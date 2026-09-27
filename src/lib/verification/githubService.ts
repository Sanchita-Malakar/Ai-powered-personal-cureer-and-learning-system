import { EXCLUDED_PATHS, MANIFEST_FILENAMES, SOURCE_EXTENSIONS } from "./constants";
import { getInstallationAccessToken, isGithubAppConfigured } from "./githubAppAuth";
import { parseGithubUrl, ParsedRepoUrl } from "./urlUtils";

export { parseGithubUrl, type ParsedRepoUrl };

export interface RepoTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url?: string;
}

export interface FetchedManifest {
  path: string;
  content: string;
}

export interface GithubRepoSnapshot {
  owner: string;
  repo: string;
  fullName: string;
  description: string | null;
  defaultBranch: string;
  isPrivate: boolean;
  commitSha: string;
  languages: Record<string, number>; // Language name -> byte count
  totalFiles: number;
  totalCodeFiles: number;
  tree: RepoTreeItem[];
  manifests: FetchedManifest[];
  sourceFileSnippets: FetchedManifest[];
  rootPath?: string;
  authMode: "GITHUB_APP_INSTALLATION" | "DEVELOPMENT_FALLBACK" | "PUBLIC_UNAUTHENTICATED";
}


export interface GithubServiceOptions {
  token?: string;
  installationId?: number;
  rootPath?: string;
}

export class GithubService {
  private explicitToken?: string;
  private installationId?: number;
  private rootPath?: string;

  constructor(options?: GithubServiceOptions | string) {
    if (typeof options === "string") {
      this.explicitToken = options;
    } else if (options) {
      this.explicitToken = options.token;
      this.installationId = options.installationId;
      this.rootPath = options.rootPath;
    }
  }

  /**
   * Sanitizes and validates monorepo root path to prevent path traversal attacks.
   */
  private sanitizeRootPath(rawPath?: string): string | undefined {
    if (!rawPath) return undefined;
    const trimmed = rawPath.trim();
    if (!trimmed || trimmed === "/" || trimmed === ".") return undefined;

    // Disallow path traversal
    if (trimmed.includes("..") || trimmed.includes("~")) {
      throw new Error("Invalid root path: directory traversal (..) is not permitted.");
    }

    // Strip leading and trailing slashes
    return trimmed.replace(/^\/+/, "").replace(/\/+$/, "");
  }

  private async resolveAuthToken(): Promise<{
    token?: string;
    authMode: "GITHUB_APP_INSTALLATION" | "DEVELOPMENT_FALLBACK" | "PUBLIC_UNAUTHENTICATED";
  }> {
    // 1. Explicit token passed in
    if (this.explicitToken) {
      return { token: this.explicitToken, authMode: "GITHUB_APP_INSTALLATION" };
    }

    // 2. Production Multi-Tenant: GitHub App configuration exists
    if (isGithubAppConfigured()) {
      if (this.installationId) {
        try {
          const { token } = await getInstallationAccessToken(this.installationId);
          return { token, authMode: "GITHUB_APP_INSTALLATION" };
        } catch (err: any) {
          throw new Error(
            `Failed to authenticate student's GitHub installation: ${err.message || "Installation token could not be obtained."}`
          );
        }
      }
      // Production security: If GitHub App is configured, NEVER fall back to developer's personal GITHUB_TOKEN
      return { token: undefined, authMode: "PUBLIC_UNAUTHENTICATED" };
    }

    // 3. Local Development Fallback (ONLY active when GitHub App is completely unconfigured)
    const devToken = process.env.GITHUB_TOKEN;
    if (devToken && devToken.trim().length > 0 && process.env.NODE_ENV !== "production") {
      console.info("[GitHubService] Using development fallback token (GITHUB_TOKEN) for local testing.");
      return { token: devToken.trim(), authMode: "DEVELOPMENT_FALLBACK" };
    }

    // 4. Public Unauthenticated
    return { token: undefined, authMode: "PUBLIC_UNAUTHENTICATED" };
  }

  private getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "CareerOS-Skill-Verification-Engine",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private checkRateLimit(res: Response): void {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const retryAfter = res.headers.get("retry-after");
    const resetEpoch = res.headers.get("x-ratelimit-reset");

    if (res.status === 429 || (res.status === 403 && remaining === "0") || (res.status === 403 && retryAfter)) {
      let resetWaitSeconds = 60;
      if (retryAfter) {
        resetWaitSeconds = parseInt(retryAfter, 10);
      } else if (resetEpoch) {
        resetWaitSeconds = Math.max(1, parseInt(resetEpoch, 10) - Math.floor(Date.now() / 1000));
      }
      const resetMinutes = Math.max(1, Math.ceil(resetWaitSeconds / 60));
      throw new Error(
        `GitHub API rate limit reached. Access will automatically reset in ~${resetMinutes} minute(s). Authorizing with the CareerOS GitHub App provides elevated installation limits (5,000 requests/hour).`
      );
    }
  }

  async fetchRepositorySnapshot(owner: string, repo: string): Promise<GithubRepoSnapshot> {
    const { token, authMode } = await this.resolveAuthToken();
    const headers = this.getHeaders(token);
    const cleanRootPath = this.sanitizeRootPath(this.rootPath);

    // 1. Fetch Repository Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      cache: "no-store",
    });

    if (!repoRes.ok) {
      this.checkRateLimit(repoRes);

      if (repoRes.status === 404) {
        throw new Error(
          `Repository '${owner}/${repo}' was not found or is private. If it is private, please authorize CareerOS via the GitHub App with repository access.`
        );
      }

      throw new Error(`GitHub API error: ${repoRes.status} ${repoRes.statusText}`);
    }

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || "main";

    // 2. Fetch Languages Breakdown
    let languages: Record<string, number> = {};
    try {
      const langRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`,
        { headers, cache: "no-store" }
      );
      if (langRes.ok) {
        languages = await langRes.json();
      } else {
        this.checkRateLimit(langRes);
      }
    } catch (err: any) {
      if (err?.message?.includes("rate limit")) throw err;
      // Non-fatal
    }

    // 3. Fetch Latest Commit SHA on default branch
    let commitSha = "";
    try {
      const commitRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/${defaultBranch}`,
        { headers, cache: "no-store" }
      );
      if (commitRes.ok) {
        const commitData = await commitRes.json();
        commitSha = commitData.sha || "";
      } else {
        this.checkRateLimit(commitRes);
      }
    } catch (err: any) {
      if (err?.message?.includes("rate limit")) throw err;
      // Non-fatal
    }

    // 4. Fetch Full Git Tree recursively
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers, cache: "no-store" }
    );

    let rawTree: RepoTreeItem[] = [];
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      rawTree = treeData.tree || [];
    } else {
      this.checkRateLimit(treeRes);
      if (treeRes.status === 409) {
        throw new Error(`Repository '${owner}/${repo}' appears to be empty with no commits on default branch '${defaultBranch}'.`);
      }
      throw new Error(`Failed to inspect repository files (status ${treeRes.status}).`);
    }

    if (rawTree.length === 0) {
      throw new Error(`Repository '${owner}/${repo}' contains no files or is empty.`);
    }

    // Filter out excluded / vendor paths
    const filteredTree = rawTree.filter((item) => {
      if (item.type !== "blob") return false;
      return !EXCLUDED_PATHS.some((exc) => item.path.includes(exc));
    });

    // 5. Monorepo Root Path Scoping
    // If rootPath is configured, filter tree to blobs within rootPath,
    // but keep root-level config files (e.g. root package.json, docker-compose.yml, README)
    let scopedTree = filteredTree;
    if (cleanRootPath) {
      const rootPrefix = `${cleanRootPath}/`;
      const rootMatches = filteredTree.filter((item) => item.path.startsWith(rootPrefix));

      if (rootMatches.length === 0) {
        throw new Error(
          `Configured root path '${cleanRootPath}' was not found in repository '${owner}/${repo}'. Please verify the directory path.`
        );
      }

      // Keep scoped files + any top-level manifest files
      const topLevelConfigs = filteredTree.filter((item) => {
        const parts = item.path.split("/");
        return parts.length === 1 && MANIFEST_FILENAMES.includes(parts[0]);
      });

      scopedTree = [...rootMatches, ...topLevelConfigs];
    }

    const codeFiles = scopedTree.filter((item) =>
      SOURCE_EXTENSIONS.some((ext) => item.path.toLowerCase().endsWith(ext))
    );

    // 6. Fetch Key Manifest Files
    const manifestPathsToFetch = scopedTree
      .filter((item) => {
        const fileName = item.path.split("/").pop()?.toLowerCase();
        return fileName && MANIFEST_FILENAMES.map((m) => m.toLowerCase()).includes(fileName);
      })
      .slice(0, 8);

    const manifests: FetchedManifest[] = [];
    for (const item of manifestPathsToFetch) {
      try {
        const content = await this.fetchFileContent(owner, repo, item.path, defaultBranch, token);
        if (content) {
          manifests.push({ path: item.path, content });
        }
      } catch {
        // Skip unreadable files
      }
    }

    // 7. Fetch representative source file snippets for AST / static import detection
    const priorityKeywords = [
      "route",
      "router",
      "controller",
      "service",
      "model",
      "schema",
      "app",
      "server",
      "index",
      "main",
      "test",
      "spec",
    ];

    const sortedCodeFiles = [...codeFiles].sort((a, b) => {
      const aLower = a.path.toLowerCase();
      const bLower = b.path.toLowerCase();
      const aScore = priorityKeywords.filter((k) => aLower.includes(k)).length;
      const bScore = priorityKeywords.filter((k) => bLower.includes(k)).length;
      return bScore - aScore;
    });

    const representativeFiles = sortedCodeFiles.slice(0, 10);
    const sourceFileSnippets: FetchedManifest[] = [];

    for (const item of representativeFiles) {
      try {
        const content = await this.fetchFileContent(owner, repo, item.path, defaultBranch, token);
        if (content) {
          sourceFileSnippets.push({
            path: item.path,
            content: content.slice(0, 3000),
          });
        }
      } catch {
        // Skip
      }
    }

    return {
      owner,
      repo,
      fullName: `${owner}/${repo}`,
      description: repoData.description || null,
      defaultBranch,
      isPrivate: repoData.private || false,
      commitSha,
      languages,
      totalFiles: scopedTree.length,
      totalCodeFiles: codeFiles.length,
      tree: scopedTree,
      manifests,
      sourceFileSnippets,
      rootPath: cleanRootPath,
      authMode,
    };
  }

  private async fetchFileContent(
    owner: string,
    repo: string,
    filePath: string,
    ref: string,
    token?: string
  ): Promise<string> {
    const headers = this.getHeaders(token);
    const encodedPath = encodeURIComponent(filePath).replace(/%2F/g, "/");

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${ref}`,
      { headers, cache: "no-store" }
    );

    if (!res.ok) {
      this.checkRateLimit(res);
      return "";
    }

    const data = await res.json();
    if (data.encoding === "base64" && data.content) {
      try {
        const buff = Buffer.from(data.content, "base64");
        return buff.toString("utf-8");
      } catch {
        return "";
      }
    }

    return "";
  }
}
