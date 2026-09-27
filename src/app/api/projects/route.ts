import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  getSupabaseServerClient,
  validateStudentRepoAccess,
  linkProjectToGithubRepo,
} from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const student = await getAuthenticatedStudent(request);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view projects." },
        { status: 401 }
      );
    }

    const client = getSupabaseServerClient();
    if (!client) {
      return NextResponse.json({ success: true, projects: [] });
    }

    const { data, error } = await client
      .from("student_projects")
      .select("*")
      .eq("user_id", student.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, projects: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch projects." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const student = await getAuthenticatedStudent(request);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to create a project." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      role = "Developer",
      description,
      technologies = [],
      githubUrl,
      liveUrl,
      impactMetrics,
      rootPath,
      githubRepositoryId,
    } = body;

    if (!title || !description || !githubUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, description, and GitHub repository URL are required.",
        },
        { status: 400 }
      );
    }

    // Validate root path if provided to prevent path traversal
    if (rootPath && (rootPath.includes("..") || rootPath.includes("~") || rootPath.startsWith("/"))) {
      return NextResponse.json(
        { success: false, error: "Invalid root path: directory traversal (..) is not permitted." },
        { status: 400 }
      );
    }

    // If a specific GitHub repository ID was selected, ensure it belongs to this student
    if (githubRepositoryId) {
      const repoAccess = await validateStudentRepoAccess(student.id, Number(githubRepositoryId));
      if (!repoAccess.hasAccess) {
        return NextResponse.json(
          { success: false, error: repoAccess.error || "Repository access not authorized." },
          { status: 403 }
        );
      }
    }

    const client = getSupabaseServerClient();
    if (!client) {
      return NextResponse.json({
        success: true,
        project: {
          id: `proj-${Date.now()}`,
          userId: student.id,
          title,
          role,
          description,
          technologies,
          githubUrl,
          liveUrl,
          impactMetrics,
          rootPath: rootPath?.trim() || null,
          githubRepositoryId: githubRepositoryId ? Number(githubRepositoryId) : null,
          verificationStatus: "NOT_VERIFIED",
        },
      });
    }

    const { data, error } = await client
      .from("student_projects")
      .insert({
        user_id: student.id,
        title,
        role,
        description,
        technologies,
        github_url: githubUrl,
        live_url: liveUrl || null,
        impact_metrics: impactMetrics || null,
        root_path: rootPath?.trim() || null,
        github_repository_id: githubRepositoryId ? Number(githubRepositoryId) : null,
        verification_status: "NOT_VERIFIED",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Link in project_github_connections if repo ID was provided
    if (githubRepositoryId && data?.id) {
      await linkProjectToGithubRepo(
        student.id,
        data.id,
        Number(githubRepositoryId),
        rootPath?.trim() || undefined
      );
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create project." },
      { status: 500 }
    );
  }
}
