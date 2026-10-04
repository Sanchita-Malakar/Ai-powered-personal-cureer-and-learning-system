import { NextRequest, NextResponse } from "next/server";
import { parseGithubUrl, GithubService } from "@/lib/verification/githubService";
import { performStaticAnalysis } from "@/lib/verification/analyzer";
import { evaluateWithAiOrHeuristic } from "@/lib/verification/aiEvaluator";
import {
  calculateProjectScore,
  calculateSkillImpacts,
} from "@/lib/verification/scoringEngine";
import { ANALYSIS_VERSION } from "@/lib/verification/constants";
import { ProjectVerificationReport } from "@/types/verification";
import {
  getAuthenticatedStudent,
  getStudentGithubConnection,
  getSupabaseServerClient,
  persistVerificationToDatabase,
  validateStudentProjectOwnership,
  validateStudentRepoAccess,
  ensureStudentProject,
} from "@/lib/supabaseServer";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body = await request.json();

    // 1. Authenticate CareerOS Student Identity on Server-Side
    const authenticatedStudent = await getAuthenticatedStudent(request);

    if (!authenticatedStudent && !projectId.startsWith("proj-")) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please sign in to verify your project repository.",
        },
        { status: 401 }
      );
    }

    const userId = authenticatedStudent ? authenticatedStudent.id : "demo-student";
    const userToken = authenticatedStudent?.token;

    // 2. Validate Project Ownership or Auto-Provision Student Project
    let dbProject: any = null;
    let effectiveProjectId = projectId;

    if (authenticatedStudent) {
      const ownership = await validateStudentProjectOwnership(
        authenticatedStudent.id,
        projectId,
        userToken
      );

      if (ownership.isValid && ownership.project) {
        dbProject = ownership.project;
        effectiveProjectId = dbProject.id;
      } else {
        // Project ID was not found by UUID in database (e.g. client local ID 'proj-1' or not yet persisted).
        // Auto-provision a verified record for this authenticated student
        const reqGithubUrl = body.githubUrl;
        if (!reqGithubUrl) {
          return NextResponse.json(
            {
              success: false,
              error: "Project not found and no GitHub repository URL was provided.",
            },
            { status: 400 }
          );
        }

        const provisioned = await ensureStudentProject(
          authenticatedStudent.id,
          projectId,
          {
            title: body.projectTitle || "Featured Project",
            githubUrl: reqGithubUrl,
            rootPath: body.rootPath,
            githubRepositoryId: body.githubRepositoryId ? Number(body.githubRepositoryId) : undefined,
          },
          userToken
        );

        dbProject = provisioned.project;
        effectiveProjectId = provisioned.id;
      }

      // If project is linked to a specific GitHub repository ID, validate tenant access
      if (dbProject?.github_repository_id) {
        const repoAccess = await validateStudentRepoAccess(
          authenticatedStudent.id,
          Number(dbProject.github_repository_id),
          userToken
        );
        if (!repoAccess.hasAccess) {
          return NextResponse.json(
            {
              success: false,
              error:
                repoAccess.error ||
                "Unauthorized: This repository has not been authorized for your account by the CareerOS GitHub App.",
            },
            { status: 403 }
          );
        }
      }
    }

    const githubUrl = dbProject?.github_url || body.githubUrl;
    const projectTitle = dbProject?.title || body.projectTitle || "Featured Project";
    const existingSkills = body.existingSkills || [];
    const rootPath = dbProject?.root_path || body.rootPath;

    // 3. Monorepo Root Path Traversal Prevention
    if (rootPath && (rootPath.includes("..") || rootPath.includes("~") || rootPath.startsWith("/"))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid root path: directory traversal (..) is not permitted.",
        },
        { status: 400 }
      );
    }

    // 4. Validate GitHub Repository URL
    const parsed = parseGithubUrl(githubUrl);
    if (!parsed.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error || "Invalid GitHub repository URL.",
        },
        { status: 400 }
      );
    }

    // 5. Resolve Student's GitHub App Installation (Strict Multi-Tenant Isolation)
    let installationId: number | undefined;
    if (authenticatedStudent) {
      const connection = await getStudentGithubConnection(authenticatedStudent.id, userToken);
      if (connection && connection.connectionStatus === "connected") {
        installationId = connection.installationId;
      }
    }

    // 6. Fetch Repository Snapshot via Tenant-Isolated GitHub App Installation
    const githubService = new GithubService({
      installationId,
      rootPath: rootPath?.trim() || undefined,
    });

    let snapshot;
    try {
      snapshot = await githubService.fetchRepositorySnapshot(parsed.owner, parsed.repo);
    } catch (err: any) {
      const errMsg = err.message || "Failed to inspect GitHub repository.";
      return NextResponse.json(
        {
          success: false,
          error: errMsg,
        },
        { status: 400 }
      );
    }

    // 7. Perform Deterministic Static Analysis (Scoped to rootPath if monorepo)
    const staticResult = performStaticAnalysis(snapshot);

    // 8. Perform AI / Heuristic Qualitative Evaluation (Gemini with Heuristic Fallback)
    const aiSummary = await evaluateWithAiOrHeuristic(snapshot, staticResult);

    // 9. Calculate Multidimensional Project Scores and Anti-Gaming Weights
    const scoringResult = calculateProjectScore(
      staticResult.metrics,
      staticResult.detectedTechnologies,
      snapshot.totalCodeFiles
    );

    // 10. Calculate Skill Impacts (previous -> new score)
    const skillImpacts = calculateSkillImpacts(
      existingSkills,
      scoringResult.techScores,
      projectTitle,
      scoringResult.projectWeight
    );

    // 11. Assemble Full Verification Report
    const report: ProjectVerificationReport = {
      id: `verif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      projectId: effectiveProjectId,
      userId,
      repoOwner: snapshot.owner,
      repoName: snapshot.repo,
      commitSha: snapshot.commitSha,
      analysisVersion: ANALYSIS_VERSION,
      overallScore: scoringResult.overallScore,
      metrics: staticResult.metrics,
      detectedTechnologies: staticResult.detectedTechnologies,
      aiAnalysisSummary: aiSummary,
      skillImpacts,
      status: "VERIFIED",
      rootPath: snapshot.rootPath,
      verifiedAt: new Date().toISOString(),
    };

    // 12. Persist to Database if user is authenticated
    if (authenticatedStudent) {
      await persistVerificationToDatabase(report, authenticatedStudent.id, projectTitle, userToken);
    }

    return NextResponse.json({
      success: true,
      effectiveProjectId,
      report,
      skillImpacts,
      authMode: snapshot.authMode,
    });
  } catch (error: any) {
    console.error("Project verification execution failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during repository verification.",
      },
      { status: 500 }
    );
  }
}

