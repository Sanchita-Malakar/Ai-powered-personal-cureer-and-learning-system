import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import {
  ProjectVerificationReport,
  GithubConnection,
  GithubPermittedRepo,
} from "@/types/verification";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Prefer Service Role key on server if available, fallback to anon key
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith("http")) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.warn("Failed to create Supabase server client:", err);
    return null;
  }
}

/**
 * Extracts and verifies the authenticated CareerOS student from the incoming request.
 * Derives student ID strictly from the server-side Supabase JWT rather than trusting client parameters.
 */
export async function getAuthenticatedStudent(
  request: NextRequest
): Promise<{ id: string; email?: string } | null> {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }

  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) {
      try {
        const { data, error } = await client.auth.getUser(token);
        if (!error && data?.user) {
          return { id: data.user.id, email: data.user.email };
        }
      } catch {
        // Fall through
      }
    }
  }

  // 2. Check Supabase Auth Cookies (inspecting standard naming conventions)
  const cookies = request.cookies.getAll();
  for (const cookie of cookies) {
    if (
      cookie.name.includes("auth-token") ||
      cookie.name.startsWith("sb-") ||
      cookie.name.includes("access-token")
    ) {
      let rawVal = cookie.value;
      if (rawVal.startsWith("base64-")) {
        try {
          rawVal = Buffer.from(rawVal.slice(7), "base64").toString("utf-8");
        } catch {
          // Keep raw
        }
      }

      let tokenToVerify = rawVal;
      try {
        const parsed = JSON.parse(rawVal);
        if (Array.isArray(parsed) && parsed.length > 0) {
          tokenToVerify = parsed[0];
        } else if (parsed && typeof parsed === "object" && parsed.access_token) {
          tokenToVerify = parsed.access_token;
        }
      } catch {
        // Not JSON, use rawVal
      }

      if (tokenToVerify && typeof tokenToVerify === "string" && tokenToVerify.split(".").length === 3) {
        try {
          const { data, error } = await client.auth.getUser(tokenToVerify);
          if (!error && data?.user) {
            return { id: data.user.id, email: data.user.email };
          }
        } catch {
          // Try next cookie
        }
      }
    }
  }

  return null;
}

/**
 * Validates that a project strictly belongs to the authenticated student.
 */
export async function validateStudentProjectOwnership(
  studentId: string,
  projectId: string
): Promise<{ isValid: boolean; project?: any; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { isValid: true };
  }

  const { data, error } = await client
    .from("student_projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", studentId)
    .maybeSingle();

  if (error || !data) {
    return {
      isValid: false,
      error: "Unauthorized: You do not own this project or it does not exist.",
    };
  }

  return { isValid: true, project: data };
}

/**
 * Validates that a GitHub repository ID is permitted by the student's GitHub installation.
 */
export async function validateStudentRepoAccess(
  studentId: string,
  githubRepositoryId: number
): Promise<{ hasAccess: boolean; repo?: any; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { hasAccess: true };
  }

  const { data, error } = await client
    .from("github_repositories")
    .select("*")
    .eq("student_id", studentId)
    .eq("github_repository_id", githubRepositoryId)
    .maybeSingle();

  if (error || !data) {
    return {
      hasAccess: false,
      error: "Unauthorized: This repository has not been authorized for your account by the CareerOS GitHub App.",
    };
  }

  return { hasAccess: true, repo: data };
}

/**
 * Fetches the student's active GitHub App connection.
 */
export async function getStudentGithubConnection(
  studentId: string
): Promise<GithubConnection | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from("github_connections")
    .select("*")
    .eq("student_id", studentId)
    .eq("connection_status", "connected")
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    studentId: data.student_id,
    githubUserId: data.github_user_id,
    githubUsername: data.github_username,
    installationId: Number(data.installation_id),
    connectionStatus: data.connection_status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Fetches the repositories accessible to this student's GitHub installation.
 */
export async function getStudentGithubRepositories(
  studentId: string
): Promise<GithubPermittedRepo[]> {
  const client = getSupabaseServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from("github_repositories")
    .select("*")
    .eq("student_id", studentId)
    .order("repository_name", { ascending: true });

  if (error || !data) return [];

  return data.map((r: any) => ({
    id: r.id,
    studentId: r.student_id,
    githubConnectionId: r.github_connection_id,
    githubRepositoryId: Number(r.github_repository_id),
    ownerLogin: r.owner_login,
    repositoryName: r.repository_name,
    fullName: r.full_name,
    defaultBranch: r.default_branch,
    private: Boolean(r.private),
    htmlUrl: r.html_url,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

/**
 * Stores or updates a student's GitHub App installation and permitted repositories.
 */
export async function saveStudentGithubInstallation(
  studentId: string,
  installation: {
    installationId: number;
    githubUserId?: string;
    githubUsername: string;
  },
  repositories: Array<{
    id: number;
    owner: { login: string };
    name: string;
    full_name: string;
    default_branch: string;
    private: boolean;
    html_url: string;
  }>
): Promise<{ success: boolean; connectionId?: string; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) return { success: true };

  try {
    // 1. Upsert github_connections
    const { data: connData, error: connErr } = await client
      .from("github_connections")
      .upsert(
        {
          student_id: studentId,
          installation_id: installation.installationId,
          github_user_id: installation.githubUserId || null,
          github_username: installation.githubUsername,
          connection_status: "connected",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "student_id" }
      )
      .select("id")
      .single();

    if (connErr) throw connErr;
    const connectionId = connData.id;

    // 2. Clear old repos and insert current permitted repositories
    await client
      .from("github_repositories")
      .delete()
      .eq("student_id", studentId);

    if (repositories.length > 0) {
      const repoRows = repositories.map((r) => ({
        student_id: studentId,
        github_connection_id: connectionId,
        github_repository_id: r.id,
        owner_login: r.owner.login,
        repository_name: r.name,
        full_name: r.full_name,
        default_branch: r.default_branch || "main",
        private: r.private,
        html_url: r.html_url,
        updated_at: new Date().toISOString(),
      }));

      await client.from("github_repositories").insert(repoRows);
    }

    return { success: true, connectionId };
  } catch (err: any) {
    console.error("Failed to save student GitHub installation:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Marks an installation as revoked (e.g. via webhook or user disconnect).
 */
export async function markGithubInstallationRevoked(installationId: number): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) return;

  await client
    .from("github_connections")
    .update({
      connection_status: "revoked",
      updated_at: new Date().toISOString(),
    })
    .eq("installation_id", installationId);
}

/**
 * Links a featured project to an authorized GitHub repository and optional root path.
 */
export async function linkProjectToGithubRepo(
  studentId: string,
  projectId: string,
  githubRepositoryId: number,
  rootPath?: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) return { success: true };

  try {
    // 1. Verify repository belongs to this student
    const { data: repo, error: repoErr } = await client
      .from("github_repositories")
      .select("*")
      .eq("student_id", studentId)
      .eq("github_repository_id", githubRepositoryId)
      .maybeSingle();

    if (repoErr || !repo) {
      throw new Error("Repository not found in your authorized GitHub repositories.");
    }

    // 2. Upsert project_github_connections
    await client.from("project_github_connections").upsert(
      {
        project_id: projectId,
        student_id: studentId,
        github_repository_id: githubRepositoryId,
        root_path: rootPath || null,
        branch: repo.default_branch,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "project_id" }
    );

    // 3. Update student_projects with repo URL and root_path
    await client
      .from("student_projects")
      .update({
        github_url: repo.html_url,
        root_path: rootPath || null,
        github_repository_id: githubRepositoryId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("user_id", studentId);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function persistVerificationToDatabase(
  report: ProjectVerificationReport,
  userId: string,
  projectTitle: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { success: true };
  }

  try {
    // 1. Insert Project Verification Report
    await client.from("project_verifications").insert({
      id: report.id,
      project_id: report.projectId,
      user_id: userId,
      repo_owner: report.repoOwner,
      repo_name: report.repoName,
      commit_sha: report.commitSha || null,
      analysis_version: report.analysisVersion,
      overall_score: report.overallScore,
      metrics: report.metrics,
      detected_technologies: report.detectedTechnologies,
      ai_analysis_summary: report.aiAnalysisSummary,
      status: report.status,
      error_message: report.errorMessage || null,
      verified_at: report.verifiedAt,
    });

    // 2. Update Student Project Status
    await client
      .from("student_projects")
      .update({
        verification_status: "VERIFIED",
        verification_score: report.overallScore,
        last_verified_at: report.verifiedAt,
        verified_commit_sha: report.commitSha || null,
        root_path: report.rootPath || null,
      })
      .eq("id", report.projectId)
      .eq("user_id", userId);

    // 3. Upsert Skill Evidence and History
    for (const impact of report.skillImpacts) {
      const detected = report.detectedTechnologies.find(
        (t) => t.name.toLowerCase() === impact.skillName.toLowerCase()
      );

      await client.from("skill_evidence").insert({
        user_id: userId,
        skill_name: impact.skillName,
        project_id: report.projectId,
        evidence_score: impact.newPercentage,
        file_count: detected?.filesCount || 1,
        signals: detected?.signals || [],
      });

      await client.from("skill_history").insert({
        user_id: userId,
        skill_name: impact.skillName,
        previous_percentage: impact.previousPercentage,
        new_percentage: impact.newPercentage,
        previous_level: impact.previousLevel,
        new_level: impact.newLevel,
        change_reason: impact.changeReason,
        project_id: report.projectId,
      });

      await client.from("student_skills").upsert(
        {
          user_id: userId,
          name: impact.skillName,
          category: detected?.category === "Language" ? "Programming" : "Development",
          student_claimed: true,
          verified: true,
          verified_percentage: impact.newPercentage,
          verified_level: impact.newLevel,
          confidence_score: 0.85,
          evidence_projects_count: 1,
          last_verified_at: new Date().toISOString(),
        },
        { onConflict: "user_id,name" }
      );
    }

    return { success: true };
  } catch (err: any) {
    console.error("Database persistence error:", err);
    return { success: false, error: err?.message };
  }
}
