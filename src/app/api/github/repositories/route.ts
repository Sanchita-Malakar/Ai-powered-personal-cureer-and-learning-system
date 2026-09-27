import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  getStudentGithubConnection,
  getStudentGithubRepositories,
  saveStudentGithubInstallation,
} from "@/lib/supabaseServer";
import { getInstallationRepositories } from "@/lib/verification/githubAppAuth";

export async function GET(request: NextRequest) {
  try {
    const student = await getAuthenticatedStudent(request);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view authorized repositories." },
        { status: 401 }
      );
    }

    // 1. Fetch connection for student
    const connection = await getStudentGithubConnection(student.id);
    if (!connection || connection.connectionStatus !== "connected") {
      return NextResponse.json({
        success: true,
        isConnected: false,
        repositories: [],
        message: "GitHub App not connected for this student account.",
      });
    }

    // 2. Fetch permitted repositories from database
    let repos = await getStudentGithubRepositories(student.id);

    // 3. If cache is empty or refresh requested, query GitHub live using installation token
    if (repos.length === 0 && connection.installationId) {
      try {
        const live = await getInstallationRepositories(connection.installationId);
        if (live.repositories.length > 0) {
          await saveStudentGithubInstallation(
            student.id,
            {
              installationId: connection.installationId,
              githubUserId: connection.githubUserId,
              githubUsername: connection.githubUsername,
            },
            live.repositories.map((r) => ({
              id: r.id,
              owner: { login: r.owner.login },
              name: r.name,
              full_name: r.full_name,
              default_branch: r.default_branch || "main",
              private: r.private,
              html_url: r.html_url,
            }))
          );
          repos = await getStudentGithubRepositories(student.id);
        }
      } catch (liveErr) {
        console.warn("Could not sync live installation repositories:", liveErr);
      }
    }

    return NextResponse.json({
      success: true,
      isConnected: true,
      username: connection.githubUsername,
      repositories: repos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch repositories." },
      { status: 500 }
    );
  }
}
