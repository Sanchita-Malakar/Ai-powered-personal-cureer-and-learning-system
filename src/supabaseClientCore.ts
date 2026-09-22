import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SAMPLE_ONBOARDED_STUDENT } from "@/types/onboarding";

// 1. Supabase optional cloud configuration
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
    rawSupabaseClient = createClient(envUrl, envKey, {
      auth: { persistSession: false },
    });
  } catch (err) {
    rawSupabaseClient = null;
  }
}

// 2. Storage keys
const SESSION_STORAGE_KEY = "career_os_auth_session";
const PROFILE_STORAGE_KEY = "career_os_student_profile";
const USERS_STORAGE_KEY = "career_os_registered_users";

export function getLocalUsers(): Record<string, { user: MockUser; password: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveLocalUser(emailOrPhone: string, user: MockUser, password: string) {
  if (typeof window === "undefined") return;
  try {
    const users = getLocalUsers();
    users[emailOrPhone.toLowerCase()] = { user, password };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {}
}

export function createSessionForUser(user: MockUser): MockSession {
  return {
    access_token: `career_os_jwt_${user.id}_${Date.now()}`,
    token_type: "bearer",
    expires_in: 3600 * 24 * 30, // 30 days
    refresh_token: `career_os_refresh_${user.id}_${Date.now()}`,
    user,
  };
}

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
  updated_at?: string;
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

export function getLocalSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setLocalSession(session: MockSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      if (session.user?.user_metadata?.career_profile) {
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

// Authentication Engine connected to persistent backend API
const authEngine = {
  async getSession(): Promise<{ data: { session: any }; error: any }> {
    const localSession = getLocalSession();
    if (localSession?.user) {
      return { data: { session: localSession }, error: null };
    }

    // Try verifying from server session endpoint
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: localSession?.access_token }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.session) {
            setLocalSession(json.data.session);
            return { data: { session: json.data.session }, error: null };
          }
        }
      } catch (e) {}
    }

    return { data: { session: null }, error: null };
  },

  async getUser(): Promise<{ data: { user: any }; error: any }> {
    const localSession = getLocalSession();
    if (localSession?.user) {
      return { data: { user: localSession.user }, error: null };
    }

    const { data } = await this.getSession();
    return { data: { user: data.session?.user || null }, error: null };
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

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, password }),
      });

      const result = await response.json();

      if (response.ok && result.data?.session) {
        const session = result.data.session;
        const user = result.data.user;

        setLocalSession(session);
        saveLocalUser(identifier, user, password);
        notifyAuthListeners("SIGNED_IN", session);

        return {
          data: { user, session },
          error: null,
        };
      }

      // If serverless container doesn't share filesystem, fallback to locally registered user
      const localUsers = getLocalUsers();
      const existing = localUsers[identifier.toLowerCase()];
      if (existing) {
        if (existing.password !== password) {
          return {
            data: { user: null, session: null },
            error: { message: "Invalid credentials" },
          };
        }
        const fallbackSession = createSessionForUser(existing.user);
        setLocalSession(fallbackSession);
        notifyAuthListeners("SIGNED_IN", fallbackSession);
        return {
          data: { user: existing.user, session: fallbackSession },
          error: null,
        };
      }

      return {
        data: { user: null, session: null },
        error: { message: result?.error?.message || "Invalid credentials" },
      };
    } catch (err: any) {
      // Offline / network fallback
      const localUsers = getLocalUsers();
      const existing = localUsers[identifier.toLowerCase()];
      if (existing) {
        if (existing.password !== password) {
          return {
            data: { user: null, session: null },
            error: { message: "Invalid credentials" },
          };
        }
        const fallbackSession = createSessionForUser(existing.user);
        setLocalSession(fallbackSession);
        notifyAuthListeners("SIGNED_IN", fallbackSession);
        return {
          data: { user: existing.user, session: fallbackSession },
          error: null,
        };
      }

      return {
        data: { user: null, session: null },
        error: { message: "Invalid credentials" },
      };
    }
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

    if (!password || password.length < 6) {
      return {
        data: { user: null, session: null },
        error: { message: "Password must be at least 6 characters." },
      };
    }

    try {
      const studentName = options?.data?.full_name?.trim() || "Student";
      const targetRole = options?.data?.target_role || "Junior Full Stack Developer";

      const careerProfile = {
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
      };

      const enrichedOptions = {
        ...options,
        data: {
          full_name: studentName,
          phone: options?.data?.phone || phone || "",
          target_role: targetRole,
          onboarding_completed: true,
          career_profile: careerProfile,
          ...(options?.data || {}),
        },
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          password,
          options: enrichedOptions,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        return {
          data: { user: null, session: null },
          error: { message: result.error?.message || "Registration failed." },
        };
      }

      const session = result.data.session;
      const user = result.data.user;

      setLocalSession(session);
      saveLocalUser(identifier, user, password);
      notifyAuthListeners("SIGNED_IN", session);

      return {
        data: { user, session },
        error: null,
      };
    } catch (err: any) {
      console.error("Sign up network error:", err);
      return {
        data: { user: null, session: null },
        error: { message: err?.message || "Unable to reach registration server." },
      };
    }
  },

  async verifyOtp(params: {
    email?: string;
    phone?: string;
    token: string;
    type?: string;
  }): Promise<{ data: { session: any; user: any }; error: any }> {
    const currentSession = getLocalSession();
    if (currentSession) {
      notifyAuthListeners("SIGNED_IN", currentSession);
      return { data: { session: currentSession, user: currentSession.user }, error: null };
    }

    return {
      data: { session: null, user: null },
      error: { message: "Invalid or expired verification code." },
    };
  },

  async resend(params: any): Promise<{ data: any; error: any }> {
    return { data: null, error: null };
  },

  async exchangeCodeForSession(code: string): Promise<{ data: { session: any; user: any }; error: any }> {
    const currentSession = getLocalSession();
    if (currentSession) {
      return { data: { session: currentSession, user: currentSession.user }, error: null };
    }
    return { data: { session: null, user: null }, error: null };
  },

  async updateUser(attributes: {
    email?: string;
    password?: string;
    data?: any;
    [key: string]: any;
  }): Promise<{ data: { user: any }; error: any }> {
    const session = getLocalSession();
    if (!session) {
      return { data: { user: null }, error: new Error("No active session found to update.") };
    }

    try {
      const response = await fetch("/api/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          token: session.access_token,
          attributes,
        }),
      });

      const result = await response.json();
      if (response.ok && result.data?.user) {
        session.user = {
          ...session.user,
          ...result.data.user,
          user_metadata: {
            ...session.user.user_metadata,
            ...result.data.user.user_metadata,
          },
        };
        setLocalSession(session);
        notifyAuthListeners("USER_UPDATED", session);
        return { data: { user: session.user }, error: null };
      }
    } catch (e) {}

    // Fallback local merge
    if (attributes.data) {
      session.user.user_metadata = {
        ...session.user.user_metadata,
        ...attributes.data,
      };
    }
    setLocalSession(session);
    notifyAuthListeners("USER_UPDATED", session);
    return { data: { user: session.user }, error: null };
  },

  async signOut(): Promise<{ error: any }> {
    const session = getLocalSession();
    if (session?.access_token) {
      try {
        await fetch("/api/auth/signout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: session.access_token }),
        });
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
