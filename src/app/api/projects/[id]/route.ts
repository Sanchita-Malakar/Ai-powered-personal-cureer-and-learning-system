import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  getSupabaseServerClient,
  validateStudentProjectOwnership,
  validateStudentRepoAccess,
  linkProjectToGithubRepo,
} from "@/lib/supabaseServer";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await getAuthenticatedStudent(request);
    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to update project." },
        { status: 401 }
      );
    }

    const projectId = params.id;

    // Validate student ownership
    const ownership = await validateStudentProjectOwnership(student.id, projectId);
    if (!ownership.isValid) {
      return NextResponse.json(
        { success: false, error: ownership.error || "Unauthorized project modification." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const client = getSupabaseServerClient();

    if (!client) {
      return NextResponse.json({ success: true, updated: body });
    }

    // Validate root path if provided
    if (body.rootPath && (body.rootPath.includes("..") || body.rootPath.includes("~") || body.rootPath.startsWith("/"))) {
      return NextResponse.json(
        { success: false, error: "Invalid root path: directory traversal (..) is not permitted." },
        { status: 400 }
      );
    }

    // Validate repo access if changing repo
    if (body.githubRepositoryId) {
      const repoAccess = await validateStudentRepoAccess(student.id, Number(body.githubRepositoryId));
      if (!repoAccess.hasAccess) {
        return NextResponse.json(
          { success: false, error: repoAccess.error || "Unauthorized repository access." },
          { status: 403 }
        );
      }
    }

    const updatePayload: Record<string, any> = {};
    if (body.title !== undefined) updatePayload.title = body.title;
    if (body.role !== undefined) updatePayload.role = body.role;
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.technologies !== undefined) updatePayload.technologies = body.technologies;
    if (body.githubUrl !== undefined) updatePayload.github_url = body.githubUrl;
    if (body.liveUrl !== undefined) updatePayload.live_url = body.liveUrl;
    if (body.impactMetrics !== undefined) updatePayload.impact_metrics = body.impactMetrics;
    if (body.verificationStatus !== undefined) updatePayload.verification_status = body.verificationStatus;
    if (body.rootPath !== undefined) updatePayload.root_path = body.rootPath ? body.rootPath.trim() : null;
    if (body.githubRepositoryId !== undefined) {
      updatePayload.github_repository_id = body.githubRepositoryId ? Number(body.githubRepositoryId) : null;
    }

    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await client
      .from("student_projects")
      .update(updatePayload)
      .eq("id", projectId)
      .eq("user_id", student.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // If repository ID is updated, link in project_github_connections
    if (body.githubRepositoryId) {
      await linkProjectToGithubRepo(
        student.id,
        projectId,
        Number(body.githubRepositoryId),
        body.rootPath ? body.rootPath.trim() : undefined
      );
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await getAuthenticatedStudent(request);
    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to delete project." },
        { status: 401 }
      );
    }

    const projectId = params.id;

    // Validate ownership before deleting
    const ownership = await validateStudentProjectOwnership(student.id, projectId);
    if (!ownership.isValid) {
      return NextResponse.json(
        { success: false, error: ownership.error || "Unauthorized project deletion." },
        { status: 403 }
      );
    }

    const client = getSupabaseServerClient();
    if (!client) {
      return NextResponse.json({ success: true });
    }

    const { error } = await client
      .from("student_projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", student.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete project." },
      { status: 500 }
    );
  }
}
