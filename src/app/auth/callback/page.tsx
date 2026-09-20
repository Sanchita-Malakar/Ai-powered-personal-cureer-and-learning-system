"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { CheckCircle2, Loader2, ArrowRight, ExternalLink } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "verified" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const [tabSwitched, setTabSwitched] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleAuthCallback = async () => {
      try {
        // 1. Check for PKCE code in query params
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // 2. Check for active session (either from code exchange or from hash fragments)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (isMounted) {
          setStatus("verified");

          // 3. Broadcast to existing tabs that email confirmation is complete
          let existingTabFound = false;
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const channel = new BroadcastChannel("career_os_auth_sync");
            channel.postMessage({
              type: "EMAIL_VERIFIED",
              timestamp: Date.now(),
            });

            channel.onmessage = (e) => {
              if (e.data?.type === "PONG_EXISTING_TAB") {
                existingTabFound = true;
                setTabSwitched(true);
              }
            };

            // Ping to see if another tab is listening
            channel.postMessage({ type: "PING_EXISTING_TAB" });
          }

          // Also set localStorage trigger for cross-tab sync in all browsers
          if (typeof window !== "undefined") {
            localStorage.setItem("career_os_email_verified_trigger", Date.now().toString());
          }

          // 4. If existing tab is open, attempt to close this new confirmation tab
          setTimeout(() => {
            if (existingTabFound) {
              try {
                window.close();
              } catch (e) {}
            } else {
              // No other tab or cannot close, redirect this tab to onboarding
              router.replace("/onboarding");
            }
          }, 1200);
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err?.message || "Failed to verify email confirmation link.");
        }
      }
    };

    handleAuthCallback();

    // Listen to Supabase auth state change as fallback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && isMounted) {
        setStatus("verified");
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const channel = new BroadcastChannel("career_os_auth_sync");
          channel.postMessage({ type: "EMAIL_VERIFIED", timestamp: Date.now() });
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("career_os_email_verified_trigger", Date.now().toString());
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-canvas bg-ambient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface/95 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4 font-bold shadow-sm">
          {status === "processing" ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : status === "verified" ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <span className="text-action font-bold">!</span>
          )}
        </div>

        {status === "processing" && (
          <div>
            <h3 className="text-base font-bold text-ink">Verifying Email Confirmation...</h3>
            <p className="text-xs text-ink-muted mt-1">
              Confirming your student credentials and establishing active session.
            </p>
          </div>
        )}

        {status === "verified" && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-ink">Email Successfully Confirmed!</h3>
            {tabSwitched ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                We signaled your existing CareerOS tab to continue. You can safely close this tab.
              </div>
            ) : (
              <p className="text-xs text-ink-muted leading-relaxed">
                Your email is verified. Redirecting you to student onboarding...
              </p>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-md shadow-accent/25 hover:bg-accent/90 transition-all"
              >
                <span>Continue to Onboarding in this tab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  try {
                    window.close();
                  } catch (e) {
                    router.push("/onboarding");
                  }
                }}
                className="text-xs text-ink-muted hover:text-ink font-medium"
              >
                Close this tab
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-action">Verification Link Issue</h3>
            <p className="text-xs text-ink-muted leading-relaxed">{errorMessage}</p>
            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-canvas border border-border text-ink text-xs font-semibold hover:bg-canvas/80"
            >
              <span>Return to Sign In</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-canvas bg-ambient-mesh flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-surface border border-border shadow-md">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
            <span className="text-xs font-semibold text-ink">Verifying credentials...</span>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </React.Suspense>
  );
}
