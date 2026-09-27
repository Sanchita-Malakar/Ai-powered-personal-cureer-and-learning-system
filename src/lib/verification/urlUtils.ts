export interface ParsedRepoUrl {
  isValid: boolean;
  owner: string;
  repo: string;
  normalizedUrl: string;
  error?: string;
}

/**
 * Pure client/server safe GitHub repository URL parser and validator.
 */
export function parseGithubUrl(rawUrl: string): ParsedRepoUrl {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      isValid: false,
      owner: "",
      repo: "",
      normalizedUrl: "",
      error: "GitHub repository URL cannot be empty.",
    };
  }

  const trimmed = rawUrl.trim();
  const githubPattern =
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)(?:\/.*)?$/;
  const match = trimmed.match(githubPattern);

  if (!match) {
    return {
      isValid: false,
      owner: "",
      repo: "",
      normalizedUrl: trimmed,
      error: "Invalid GitHub repository URL. Must be in the format 'https://github.com/owner/repo'.",
    };
  }

  let owner = match[1];
  let repo = match[2];

  if (repo.endsWith(".git")) {
    repo = repo.slice(0, -4);
  }
  repo = repo.replace(/\/+$/, "");

  if (!owner || !repo) {
    return {
      isValid: false,
      owner: "",
      repo: "",
      normalizedUrl: trimmed,
      error: "Could not identify GitHub repository owner and repository name.",
    };
  }

  return {
    isValid: true,
    owner,
    repo,
    normalizedUrl: `https://github.com/${owner}/${repo}`,
  };
}
