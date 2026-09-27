/**
 * Canonical Application URL Resolution
 * Guarantees that production redirects and callbacks resolve to the live Vercel deployment URL
 * (https://ai-powered-personal-cureer-and-lear.vercel.app) rather than localhost.
 */

export const PRODUCTION_VERCEL_URL = "https://ai-powered-personal-cureer-and-lear.vercel.app";

export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return PRODUCTION_VERCEL_URL;
}

export function getRequestOrigin(request?: {
  url?: string;
  nextUrl?: { origin?: string };
  headers?: Headers | { get: (name: string) => string | null };
}): string {
  if (request?.headers) {
    const proto =
      ("get" in request.headers ? request.headers.get("x-forwarded-proto") : (request.headers as any)["x-forwarded-proto"]) ||
      "https";
    const host =
      ("get" in request.headers ? request.headers.get("x-forwarded-host") : (request.headers as any)["x-forwarded-host"]) ||
      ("get" in request.headers ? request.headers.get("host") : (request.headers as any)["host"]);

    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      return `${proto}://${host}`;
    }
  }

  if (request?.nextUrl?.origin && !request.nextUrl.origin.includes("localhost") && !request.nextUrl.origin.includes("127.0.0.1")) {
    return request.nextUrl.origin;
  }

  if (request?.url) {
    try {
      const parsed = new URL(request.url);
      if (!parsed.hostname.includes("localhost") && !parsed.hostname.includes("127.0.0.1")) {
        return parsed.origin;
      }
    } catch {
      // Fallback
    }
  }

  return getAppBaseUrl();
}
