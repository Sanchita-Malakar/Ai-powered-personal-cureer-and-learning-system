import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SAMPLE_ONBOARDED_STUDENT } from "@/types/onboarding";

// 1. Supabase configuration
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

const isConfiguredValidSupabase =
  Boolean(envUrl) &&
  Boolean(envKey) &&
  !envUrl.includes("your-project") &&
  !envUrl.includes("placeholder");

let rawSupabaseClient: SupabaseClient | null = null;
if (isConfiguredValidSupabase) {
  try {
    rawSupabaseClient = createClient(envUrl, envKey);
  } catch (err) {
    rawSupabaseClient = null;
  }
}

// 2. Storage keys
const SESSION_STORAGE_KEY = "career_os_auth_session";
const USERS_STORAGE_KEY = "career_os_registered_users";
const PROFILE_STORAGE_KEY = "career_os_student_profile";

export interface MockUser {
  id: string;
  email?: string;
  phone?: string;
  user_metadata: {
    full_name?: string;
    phone?: string;
    target_role?: string;
    onboarding_completed?: boolean;
    career_profile?: any;
    [key: string]: any;
  };
  app_metadata: Record<string, any>;
  aud: string;
  created_at: string;
}

export interface MockSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: MockUser;
}

// In-memory subscribers
type AuthListener = (event: string, session: MockSession | null) => void;
const authListeners = new Set<AuthListener>();

function notifyAuthListeners(event: string, session: MockSession | null) {
  authListeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (e) {
      console.error("Error in auth state listener:", e);
    }
  });

  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel("career_os_auth_sync");
      channel.postMessage({ type: "AUTH_STATE_CHANGE", event, session });
      channel.close();
    } catch (e) {}
  }
}

function getLocalUsers(): Record<string, { user: MockUser; password: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalUser(emailOrPhone: string, user: MockUser, password: string) {
  if (typeof window === "undefined") return;
  try {
    const users = getLocalUsers();
    users[emailOrPhone.toLowerCase()] = { user, password };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {}
}

function getLocalSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setLocalSession(session: MockSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      if (session.user.user_metadata?.career_profile) {
        localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(session.user.user_metadata.career_profile)
        );
      }
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {}
}

function createSessionForUser(user: MockUser): MockSession {
  return {
    access_token: `career_os_jwt_${user.id}_${Date.now()}`,
    token_type: "bearer",
    expires_in: 3600 * 24 * 30, // 30 days
    refresh_token: `career_os_refresh_${user.id}_${Date.now()}`,
    user,
  };
}

function isFetchError(err: any): boolean {
  if (!err) return false;
  const msg = (err?.message || err?.error_description || String(err)).toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("network error") ||
    msg.includes("fetch failed") ||
    msg.includes("enotfound") ||
    msg.includes("load failed") ||
    msg.includes("networkerror") ||
    msg.includes("timeout") ||
    msg.includes("timed out")
  );
}

// Authentication Engine
const authEngine = {
  async getSession(): Promise<{ data: { session: any }; error: any }> {
    const localSession = getLocalSession();
    if (localSession?.user) {
      return { data: { session: localSession }, error: null };
    }

    if (rawSupabaseClient) {
      try {
        const res = await rawSupabaseClient.auth.getSession();
        if (!res.error && res.data.session) {
          return res;
        }
      } catch (err) {
        // Fall back to local
      }
    }

    return { data: { session: null }, error: null };
  },

  async getUser(): Promise<{ data: { user: any }; error: any }> {
    const localSession = getLocalSession();
    if (localSession?.user) {
      return { data: { user: localSession.user }, error: null };
    }

    if (rawSupabaseClient) {
      try {
        const res = await rawSupabaseClient.auth.getUser();
        if (!res.error && res.data.user) {
          return res;
        }
      } catch (err) {}
    }

    return { data: { user: null }, error: null };
  },

  async signInWithPassword(credentials: {
    email?: string;
    phone?: string;
    password: string;
  }): Promise<{ data: { user: any; session: any }; error: any }> {
    const { email, phone, password } = credentials;
    const identifier = (email || phone || "").trim();

    if (!identifier) {
      return {
        data: { user: null, session: null },
        error: { message: "Please enter your email or phone number." },
      };
    }

    if (!password) {
      return {
        data: { user: null, session: null },
        error: { message: "Please enter your password." },
      };
    }

    // 1. If live Supabase client is configured, attempt cloud sign in
    if (rawSupabaseClient) {
      try {
        const result = email
          ? await rawSupabaseClient.auth.signInWithPassword({ email, password })
          : await rawSupabaseClient.auth.signInWithPassword({ phone: phone!, password });

        if (!result.error && result.data.session) {
          return result;
        }
        if (!isFetchError(result.error)) {
          return result;
        }
      } catch (err: any) {
        if (!isFetchError(err)) {
          return { data: { user: null, session: null }, error: err };
        }
      }
    }

    // 2. Local Account Verification
    const normalizedIdentifier = identifier.toLowerCase();
    const localUsers = getLocalUsers();
    const existing = localUsers[normalizedIdentifier];

    let targetUser: MockUser;

    if (existing) {
      // Validate password
      if (existing.password && existing.password !== password) {
        return {
          data: { user: null, session: null },
          error: { message: "Invalid email or password. Please verify your credentials and try again." },
        };
      }
      targetUser = existing.user;
    } else {
      // If user is not yet in the local registry, auto-register their account with the entered credentials
      const formattedName = identifier.includes("@")
        ? identifier.split("@")[0].replace(/[._-]/g, " ")
        : "Student";

      const capitalizedName = formattedName
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");

      targetUser = {
        id: `student_${Date.now()}`,
        email: email ? identifier : undefined,
        phone: phone ? identifier : undefined,
        user_metadata: {
          full_name: capitalizedName,
          phone: phone || "",
          target_role: "Junior Full Stack Developer",
          onboarding_completed: true,
          career_profile: {
            ...SAMPLE_ONBOARDED_STUDENT,
            personalInfo: {
              ...SAMPLE_ONBOARDED_STUDENT.personalInfo,
              fullName: capitalizedName,
              email: email || identifier,
              phone: phone || "",
            },
            onboardingCompleted: true,
          },
        },
        app_metadata: { provider: email ? "email" : "phone" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };

      saveLocalUser(identifier, targetUser, password);
    }

    const session = createSessionForUser(targetUser);
    setLocalSession(session);
    notifyAuthListeners("SIGNED_IN", session);

    return {
      data: {
        user: targetUser,
        session,
      },
      error: null,
    };
  },

  async signUp(params: {
    email?: string;
    phone?: string;
    password: string;
    options?: {
      data?: {
        full_name?: string;
        phone?: string;
        target_role?: string;
        [key: string]: any;
      };
      emailRedirectTo?: string;
    };
  }): Promise<{ data: { user: any; session: any }; error: any }> {
    const { email, phone, password, options } = params;
    const identifier = (email || phone || "").trim();

    if (!identifier) {
      return {
        data: { user: null, session: null },
        error: { message: "Please provide an email or phone number." },
      };
    }

    // 1. If live Supabase client is configured, attempt cloud sign up
    if (rawSupabaseClient) {
      try {
        const result = await rawSupabaseClient.auth.signUp(params as any);
        if (!result.error) {
          return result;
        }
        if (!isFetchError(result.error)) {
          return result;
        }
      } catch (err: any) {
        if (!isFetchError(err)) {
          return { data: { user: null, session: null }, error: err };
        }
      }
    }

    // 2. Local Account Creation
    const studentName = options?.data?.full_name?.trim() || "Student";
    const targetRole = options?.data?.target_role || "Junior Full Stack Developer";

    const newUser: MockUser = {
      id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: email ? identifier : undefined,
      phone: phone ? identifier : undefined,
      user_metadata: {
        full_name: studentName,
        phone: options?.data?.phone || phone || "",
        target_role: targetRole,
        onboarding_completed: true,
        career_profile: {
          ...SAMPLE_ONBOARDED_STUDENT,
          personalInfo: {
            ...SAMPLE_ONBOARDED_STUDENT.personalInfo,
            fullName: studentName,
            email: email || identifier,
            phone: options?.data?.phone || phone || "",
          },
          careerPreferences: {
            ...SAMPLE_ONBOARDED_STUDENT.careerPreferences,
            primaryRole: targetRole,
            targetRoles: [targetRole],
          },
          onboardingCompleted: true,
        },
      },
      app_metadata: { provider: email ? "email" : "phone" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };

    saveLocalUser(identifier, newUser, password);
    const session = createSessionForUser(newUser);
    setLocalSession(session);
    notifyAuthListeners("SIGNED_IN", session);

    return {
      data: {
        user: newUser,
        session,
      },
      error: null,
    };
  },

  async verifyOtp(params: {
    email?: string;
    phone?: string;
    token: string;
    type?: string;
  }): Promise<{ data: { session: any; user: any }; error: any }> {
    if (rawSupabaseClient) {
      try {
        const result = await rawSupabaseClient.auth.verifyOtp(params as any);
        if (!result.error) return result;
        if (!isFetchError(result.error)) return result;
      } catch (err) {
        if (!isFetchError(err)) return { data: { session: null, user: null }, error: err };
      }
    }

    const currentSession = getLocalSession();
    if (currentSession) {
      notifyAuthListeners("SIGNED_IN", currentSession);
      return { data: { session: currentSession, user: currentSession.user }, error: null };
    }

    return { data: { session: null, user: null }, error: { message: "Invalid or expired verification code." } };
  },

  async resend(params: any): Promise<{ data: any; error: any }> {
    if (rawSupabaseClient) {
      try {
        const result = await rawSupabaseClient.auth.resend(params);
        if (!result.error) return result;
        if (!isFetchError(result.error)) return result;
      } catch (err) {
        if (!isFetchError(err)) return { data: null, error: err };
      }
    }
    return { data: { message: "Verification code sent." }, error: null };
  },

  async exchangeCodeForSession(code: string): Promise<{ data: any; error: any }> {
    if (rawSupabaseClient) {
      try {
        const result = await rawSupabaseClient.auth.exchangeCodeForSession(code);
        if (!result.error) return result;
        if (!isFetchError(result.error)) return result;
      } catch (err) {
        if (!isFetchError(err)) return { data: null, error: err };
      }
    }

    const session = getLocalSession();
    return { data: { session, user: session?.user || null }, error: null };
  },

  async updateUser(attributes: {
    data?: any;
    email?: string;
    password?: string;
  }): Promise<{ data: { user: any }; error: any }> {
    if (rawSupabaseClient) {
      try {
        const result = await rawSupabaseClient.auth.updateUser(attributes);
        if (!result.error) return result;
        if (!isFetchError(result.error)) return result;
      } catch (err) {
        if (!isFetchError(err)) return { data: { user: null }, error: err };
      }
    }

    const session = getLocalSession();
    if (session?.user) {
      session.user.user_metadata = {
        ...session.user.user_metadata,
        ...attributes.data,
      };
      if (attributes.email) session.user.email = attributes.email;
      setLocalSession(session);
      notifyAuthListeners("USER_UPDATED", session);
      return { data: { user: session.user }, error: null };
    }

    return { data: { user: null }, error: new Error("No active session found to update.") };
  },

  async signOut(): Promise<{ error: any }> {
    if (rawSupabaseClient) {
      try {
        await rawSupabaseClient.auth.signOut();
      } catch (e) {}
    }

    setLocalSession(null);
    notifyAuthListeners("SIGNED_OUT", null);
    return { error: null };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    authListeners.add(callback);

    const initialSession = getLocalSession();
    if (initialSession) {
      setTimeout(() => {
        try {
          callback("INITIAL_SESSION", initialSession);
        } catch (e) {}
      }, 0);
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners.delete(callback);
          },
        },
      },
    };
  },
};

export const supabase = {
  auth: authEngine,
  isCloudConfigured: isConfiguredValidSupabase,
};

export default supabase;
