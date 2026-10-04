import crypto from "crypto";

// Memory cache for installation tokens: installationId -> { token, expiresAtEpoch }
const tokenCache = new Map<number, { token: string; expiresAtEpoch: number }>();

export function isGithubAppConfigured(): boolean {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
  return Boolean(appId && privateKey && appId.trim().length > 0 && privateKey.trim().length > 0);
}

/**
 * Normalizes private key string, handling escaped newlines (\n) commonly found in env vars.
 */
function normalizePrivateKey(rawKey: string): string {
  let key = rawKey.trim();
  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }
  // Ensure header and footer boundaries
  if (!key.includes("BEGIN") && !key.includes("PRIVATE KEY")) {
    key = `-----BEGIN RSA PRIVATE KEY-----\n${key}\n-----END RSA PRIVATE KEY-----`;
  }
  return key;
}

/**
 * Generates an RS256 signed JSON Web Token (JWT) representing the GitHub App.
 */
export function generateAppJwt(): string {
  const appId = process.env.GITHUB_APP_ID;
  const rawKey = process.env.GITHUB_APP_PRIVATE_KEY;

  if (!appId || !rawKey) {
    throw new Error(
      "GitHub App configuration missing: GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY must be set in environment variables."
    );
  }

  const privateKey = normalizePrivateKey(rawKey);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60, // 60s in the past to allow for clock drift
    exp: now + 10 * 60, // 10 minutes maximum expiration allowed by GitHub
    iss: appId.trim(),
  };

  const encodeBase64Url = (obj: any): string =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsignedToken = `${encodeBase64Url(header)}.${encodeBase64Url(payload)}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsignedToken);
  sign.end();
  const signature = sign.sign(privateKey, "base64url");

  return `${unsignedToken}.${signature}`;
}

export interface InstallationAccessTokenResult {
  token: string;
  expiresAt: string;
}

/**
 * Obtains a short-lived (1 hour) GitHub App installation access token for a specific installation ID.
 * Caches tokens in memory until 5 minutes before expiry.
 */
export async function getInstallationAccessToken(
  installationId: number
): Promise<InstallationAccessTokenResult> {
  const nowEpoch = Math.floor(Date.now() / 1000);

  // 1. Check in-memory cache
  const cached = tokenCache.get(installationId);
  if (cached && cached.expiresAtEpoch - nowEpoch > 300) {
    return {
      token: cached.token,
      expiresAt: new Date(cached.expiresAtEpoch * 1000).toISOString(),
    };
  }

  // 2. Generate GitHub App JWT
  const appJwt = generateAppJwt();

  // 3. Request installation access token from GitHub API
  const res = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${appJwt}`,
        "User-Agent": "CareerOS-Skill-Verification-Platform",
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    if (res.status === 404) {
      throw new Error(
        `GitHub App Installation #${installationId} was not found or was uninstalled by the student.`
      );
    }
    throw new Error(
      `Failed to obtain GitHub App installation token (status ${res.status}): ${errorBody}`
    );
  }

  const data = await res.json();
  const token = data.token as string;
  const expiresAt = data.expires_at as string;
  const expiresAtEpoch = Math.floor(new Date(expiresAt).getTime() / 1000);

  // Cache token
  tokenCache.set(installationId, { token, expiresAtEpoch });

  return { token, expiresAt };
}

export interface GithubInstallationDetails {
  id: number;
  account: {
    login: string;
    id: number;
    avatar_url?: string;
    type: string;
  };
  repository_selection: "all" | "selected";
  app_id: number;
  suspended_at: string | null;
}

/**
 * Fetches installation details using the App JWT.
 */
export async function getInstallationDetails(
  installationId: number
): Promise<GithubInstallationDetails> {
  const appJwt = generateAppJwt();

  const res = await fetch(`https://api.github.com/app/installations/${installationId}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${appJwt}`,
      "User-Agent": "CareerOS-Skill-Verification-Platform",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Could not fetch details for GitHub installation #${installationId} (status ${res.status}).`
    );
  }

  return await res.json();
}

/**
 * Lists all active installations for the CareerOS GitHub App.
 */
export async function getAllAppInstallations(): Promise<GithubInstallationDetails[]> {
  if (!isGithubAppConfigured()) return [];
  try {
    const appJwt = generateAppJwt();
    const res = await fetch("https://api.github.com/app/installations?per_page=100", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${appJwt}`,
        "User-Agent": "CareerOS-Skill-Verification-Platform",
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("Failed to list app installations:", e);
    return [];
  }
}

export interface GithubPermittedRepoItem {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
  default_branch: string;
  html_url: string;
  description: string | null;
}

/**
 * Lists all repositories granted to a specific installation.
 */
export async function getInstallationRepositories(
  installationId: number
): Promise<{ total_count: number; repositories: GithubPermittedRepoItem[] }> {
  const { token } = await getInstallationAccessToken(installationId);

  const res = await fetch(`https://api.github.com/installation/repositories?per_page=100`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "CareerOS-Skill-Verification-Platform",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Failed to list repositories for installation #${installationId} (status ${res.status}).`
    );
  }

  const data = await res.json();
  return {
    total_count: data.total_count || 0,
    repositories: data.repositories || [],
  };
}

/**
 * Generates an HMAC-signed CSRF state token that binds the installation flow to a specific CareerOS student.
 */
export function generateStateToken(userId: string): string {
  const secret = process.env.GITHUB_APP_CLIENT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "careeros-state-secret";
  const now = Math.floor(Date.now() / 1000);
  const payload = `${userId}:${now}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

/**
 * Validates the CSRF state token and recovers the student's authenticated user ID.
 */
export function verifyStateToken(state: string): { isValid: boolean; userId?: string } {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return { isValid: false };

    const [userId, timestampStr, hmac] = parts;
    const timestamp = parseInt(timestampStr, 10);
    const now = Math.floor(Date.now() / 1000);

    // State valid for 30 minutes
    if (now - timestamp > 1800) {
      return { isValid: false };
    }

    const secret = process.env.GITHUB_APP_CLIENT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "careeros-state-secret";
    const expectedHmac = crypto.createHmac("sha256", secret).update(`${userId}:${timestampStr}`).digest("hex");

    if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return { isValid: true, userId };
    }

    return { isValid: false };
  } catch {
    return { isValid: false };
  }
}

/**
 * Generates the GitHub App installation URL that the student is redirected to.
 */
export function getGithubAppInstallationUrl(stateToken: string): string {
  const appSlug = process.env.GITHUB_APP_SLUG || "careeros-verification";
  return `https://github.com/apps/${encodeURIComponent(appSlug)}/installations/new?state=${encodeURIComponent(stateToken)}`;
}
