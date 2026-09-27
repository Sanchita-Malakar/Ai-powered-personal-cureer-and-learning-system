import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStudent, linkProjectToGithubRepo } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const student = await getAuthenticatedStudent(request);
    const body = await request.json();

    const {
      projectId,
      githubRepositoryId,
      rootPath,
      userId = student?.id,
    } = body;

    const studentId = student?.id || userId;

    if (!studentId || !projectId || !githubRepositoryId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: projectId and githubRepositoryId are required.",
        },
        { status: 400 }
      );
    }

    // Path traversal validation for rootPath
    if (rootPath && (rootPath.includes("..") || rootPath.includes("~"))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid root path: directory traversal (..) is not permitted.",
        },
        { status: 400 }
      );
    }

    const result = await linkProjectToGithubRepo(
      studentId,
      projectId,
      Number(githubRepositoryId),
      rootPath?.trim() || undefined
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Repository linked to project successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to link repository." },
      { status: 500 }
    );
  }
}
