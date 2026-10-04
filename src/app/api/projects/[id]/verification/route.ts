import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  getSupabaseServerClient,
  validateStudentProjectOwnership,
} from "@/lib/supabaseServer";
import { parseGithubUrl } from "@/lib/verification/githubService";
import { ProjectVerificationReport } from "@/types/verification";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await getAuthenticatedStudent(request);
    const projectId = params.id;
    const userToken = student?.token;
    const client = getSupabaseServerClient(userToken) || getSupabaseServerClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Database client unavailable." },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const githubUrl = searchParams.get("githubUrl");

    let resolvedProjectId: string | null = null;
    let data: any = null;

    // 1. If student is authenticated and projectId is a valid UUID, validate ownership and query
    if (student && UUID_REGEX.test(projectId)) {
      const ownership = await validateStudentProjectOwnership(student.id, projectId, userToken);
      if (ownership.isValid && ownership.project) {
        resolvedProjectId = ownership.project.id;
        const { data: verif } = await client
          .from("project_verifications")
          .select("*")
          .eq("project_id", resolvedProjectId)
          .eq("user_id", student.id)
          .order("verified_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        data = verif;
      }
    }

    // 2. If student is authenticated, try resolving by githubUrl in student_projects
    if (!data && student && githubUrl) {
      const normalizedUrl = githubUrl.toLowerCase().trim().replace(/\/+$/, "");
      const { data: proj } = await client
        .from("student_projects")
        .select("id")
        .eq("user_id", student.id)
        .ilike("github_url", `${normalizedUrl}%`)
        .maybeSingle();

      if (proj?.id) {
        resolvedProjectId = proj.id;
        const { data: verif } = await client
          .from("project_verifications")
          .select("*")
          .eq("project_id", resolvedProjectId)
          .eq("user_id", student.id)
          .order("verified_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        data = verif;
      }
    }

    // 3. Try matching by repo_owner and repo_name in project_verifications
    if (!data && githubUrl) {
      const parsed = parseGithubUrl(githubUrl);
      if (parsed.isValid) {
        let query = client
          .from("project_verifications")
          .select("*")
          .ilike("repo_owner", parsed.owner)
          .ilike("repo_name", parsed.repo);

        if (student) {
          query = query.eq("user_id", student.id);
        }

        const { data: repoVerif } = await query
          .order("verified_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        data = repoVerif;
      }
    }

    // 4. Try matching by project_id in project_verifications directly if valid UUID
    if (!data && UUID_REGEX.test(projectId)) {
      let query = client
        .from("project_verifications")
        .select("*")
        .eq("project_id", projectId);

      if (student) {
        query = query.eq("user_id", student.id);
      }

      const { data: idVerif } = await query
        .order("verified_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      data = idVerif;
    }

    // 5. Fallback to latest verification for student if authenticated
    if (!data && student) {
      const { data: latestVerif } = await client
        .from("project_verifications")
        .select("*")
        .eq("user_id", student.id)
        .order("verified_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      data = latestVerif;
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No verification report found for this project." },
        { status: 404 }
      );
    }

    // 5. Format database row into typed ProjectVerificationReport (snake_case -> camelCase)
    const skillImpacts =
      data.ai_analysis_summary?.skillImpacts ||
      data.skill_impacts ||
      [];

    const report: ProjectVerificationReport = {
      id: data.id,
      projectId: data.project_id,
      userId: data.user_id,
      repoOwner: data.repo_owner,
      repoName: data.repo_name,
      commitSha: data.commit_sha || undefined,
      analysisVersion: data.analysis_version || "1.0.0",
      overallScore: data.overall_score,
      metrics: data.metrics || {
        technologyDepth: 75,
        architectureQuality: 70,
        implementationComplexity: 75,
        testingPractices: 50,
        documentationPractices: 65,
        engineeringPractices: 70,
        codebaseSizeScore: 75,
      },
      detectedTechnologies: data.detected_technologies || [],
      aiAnalysisSummary: data.ai_analysis_summary || {
        architecturalPattern: "Modular Architecture",
        codeQualityTier: "Production-ready",
        keyHighlights: [],
        engineeringStrengths: [],
        recommendations: [],
      },
      skillImpacts,
      status: data.status || "VERIFIED",
      errorMessage: data.error_message || undefined,
      rootPath: data.root_path || undefined,
      verifiedAt: data.verified_at,
    };

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve verification report." },
      { status: 500 }
    );
  }
}

