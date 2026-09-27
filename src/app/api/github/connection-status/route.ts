import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  getStudentGithubConnection,
  getStudentGithubRepositories,
} from "@/lib/supabaseServer";
import { isGithubAppConfigured } from "@/lib/verification/githubAppAuth";

export async function GET(request: NextRequest) {
  try {
    const student = await getAuthenticatedStudent(request);
    const appConfigured = isGithubAppConfigured();

    if (!student) {
      return NextResponse.json({
        success: true,
        isConnected: false,
        isAppConfigured: appConfigured,
        hasDevTokenFallback: Boolean(process.env.GITHUB_TOKEN),
        repoCount: 0,
      });
    }

    const connection = await getStudentGithubConnection(student.id);
    const repos = connection ? await getStudentGithubRepositories(student.id) : [];

    return NextResponse.json({
      success: true,
      isConnected: Boolean(connection && connection.connectionStatus === "connected"),
      username: connection?.githubUsername || null,
      repoCount: repos.length,
      isAppConfigured: appConfigured,
      hasDevTokenFallback: Boolean(process.env.GITHUB_TOKEN),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch connection status." },
      { status: 500 }
    );
  }
}
