import { NextRequest, NextResponse } from "next/server";
import {
  isGithubAppConfigured,
  generateStateToken,
  getGithubAppInstallationUrl,
} from "@/lib/verification/githubAppAuth";
import { getAuthenticatedStudent } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    // 1. Strictly derive authenticated CareerOS student identity
    const student = await getAuthenticatedStudent(request);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please sign in to connect your GitHub account.",
        },
        { status: 401 }
      );
    }

    if (!isGithubAppConfigured()) {
      return NextResponse.json({
        success: false,
        isAppConfigured: false,
        message:
          "GitHub App credentials (GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY) are not configured yet in .env.local. Development fallback mode is available for local testing.",
      });
    }

    // 2. Generate HMAC-signed CSRF state token bound strictly to the authenticated student ID
    const stateToken = generateStateToken(student.id);
    const installUrl = getGithubAppInstallationUrl(stateToken);

    return NextResponse.json({
      success: true,
      isAppConfigured: true,
      url: installUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate GitHub authorization link." },
      { status: 500 }
    );
  }
}
