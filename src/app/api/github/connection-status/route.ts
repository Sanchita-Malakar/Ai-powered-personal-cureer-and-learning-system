import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  getStudentGithubConnection,
  getStudentGithubRepositories,
  saveStudentGithubInstallation,
  getSupabaseServerClient,
} from "@/lib/supabaseServer";
import {
  isGithubAppConfigured,
  getAllAppInstallations,
  getInstallationRepositories,
} from "@/lib/verification/githubAppAuth";

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

    const userToken = student.token;
    let connection = await getStudentGithubConnection(student.id, userToken);
    let repos = connection ? await getStudentGithubRepositories(student.id, userToken) : [];

    // Auto-detect and sync if user has an active installation on GitHub that hasn't synced yet
    if ((!connection || repos.length === 0) && appConfigured) {
      try {
        const installations = await getAllAppInstallations();
        if (installations && installations.length > 0) {
          const client = getSupabaseServerClient(userToken);
          let matchedInst = null;

          if (client) {
            const { data: profile } = await client
              .from("student_profiles")
              .select("github_url, full_name, email")
              .eq("user_id", student.id)
              .maybeSingle();

            const profileGithubLogin = profile?.github_url
              ?.replace(/^https?:\/\/(www\.)?github\.com\//i, "")
              .replace(/\/.*$/, "")
              .toLowerCase()
              .trim();

            if (profileGithubLogin) {
              matchedInst = installations.find(
                (i) => i.account?.login?.toLowerCase() === profileGithubLogin
              );
            }

            // If no exact match by profile URL, check for unlinked installation
            if (!matchedInst) {
              for (const inst of installations) {
                const { data: existingConn } = await client
                  .from("github_connections")
                  .select("student_id")
                  .eq("installation_id", inst.id)
                  .maybeSingle();

                if (!existingConn || existingConn.student_id === student.id) {
                  matchedInst = inst;
                  break;
                }
              }
            }
          }

          if (!matchedInst && installations.length === 1) {
            matchedInst = installations[0];
          }

          if (matchedInst) {
            const { repositories } = await getInstallationRepositories(matchedInst.id);
            await saveStudentGithubInstallation(
              student.id,
              {
                installationId: matchedInst.id,
                githubUserId: String(matchedInst.account.id),
                githubUsername: matchedInst.account.login,
              },
              repositories.map((r) => ({
                id: r.id,
                owner: { login: r.owner.login },
                name: r.name,
                full_name: r.full_name,
                default_branch: r.default_branch || "main",
                private: r.private,
                html_url: r.html_url,
              })),
              userToken
            );

            connection = await getStudentGithubConnection(student.id, userToken);
            repos = await getStudentGithubRepositories(student.id, userToken);
          }
        }
      } catch (syncErr) {
        console.warn("Auto-syncing GitHub installation failed:", syncErr);
      }
    }

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

