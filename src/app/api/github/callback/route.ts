import { NextRequest, NextResponse } from "next/server";
import {
  verifyStateToken,
  getInstallationDetails,
  getInstallationRepositories,
} from "@/lib/verification/githubAppAuth";
import { saveStudentGithubInstallation } from "@/lib/supabaseServer";
import { getRequestOrigin } from "@/lib/appUrl";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const installationIdStr = searchParams.get("installation_id");
  const state = searchParams.get("state");

  // Determine base site URL for redirect (resolves to Vercel deployment URL in production)
  const origin = getRequestOrigin(request);

  if (!installationIdStr) {
    return NextResponse.redirect(`${origin}/#profile?github_error=missing_installation_id`);
  }

  const installationId = parseInt(installationIdStr, 10);
  if (isNaN(installationId)) {
    return NextResponse.redirect(`${origin}/#profile?github_error=invalid_installation_id`);
  }

  // Verify CSRF HMAC state token strictly to bind installation to the authenticated student
  if (!state) {
    return NextResponse.redirect(
      `${origin}/#profile?github_error=${encodeURIComponent("Missing authorization state token. Please initiate connection from CareerOS.")}`
    );
  }

  const verified = verifyStateToken(state);
  if (!verified.isValid || !verified.userId) {
    return NextResponse.redirect(
      `${origin}/#profile?github_error=${encodeURIComponent("Invalid or expired authorization state. Please try connecting again.")}`
    );
  }

  const studentId = verified.userId;

  try {
    // 1. Fetch Installation Details from GitHub API using GitHub App JWT
    const details = await getInstallationDetails(installationId);

    // 2. Fetch Permitted Repositories granted to this installation
    const { repositories } = await getInstallationRepositories(installationId);

    // 3. Persist tenant-isolated connection and repositories in Supabase
    await saveStudentGithubInstallation(
      studentId,
      {
        installationId,
        githubUserId: String(details.account.id),
        githubUsername: details.account.login,
      },
      repositories.map((r) => ({
        id: r.id,
        owner: { login: r.owner.login },
        name: r.name,
        full_name: r.full_name,
        default_branch: r.default_branch || "main",
        private: r.private,
        html_url: r.html_url,
      }))
    );

    return NextResponse.redirect(
      `${origin}/#profile?github_connected=true&username=${encodeURIComponent(
        details.account.login
      )}&repo_count=${repositories.length}`
    );
  } catch (error: any) {
    console.error("GitHub App callback error:", error);
    return NextResponse.redirect(
      `${origin}/#profile?github_error=${encodeURIComponent(error.message || "installation_failed")}`
    );
  }
}
