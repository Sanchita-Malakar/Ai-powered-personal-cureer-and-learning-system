import { NextRequest, NextResponse } from "next/server";
import { createUser, createSession, toClientUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, password, options } = body;

    const identifier = (email || phone || "").trim();
    if (!identifier) {
      return NextResponse.json(
        { data: null, error: { message: "Email or phone number is required." } },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { data: null, error: { message: "Password must be at least 6 characters." } },
        { status: 400 }
      );
    }

    const fullName = options?.data?.full_name?.trim() || "Student";
    const targetRole = options?.data?.target_role || "Junior Full Stack Developer";

    const { user, error } = createUser({
      email: email ? email.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      password,
      fullName,
      targetRole,
      userMetadata: options?.data || {},
    });

    if (error || !user) {
      return NextResponse.json(
        { data: null, error: { message: error || "Failed to create user." } },
        { status: 400 }
      );
    }

    const session = createSession(user.id);
    const clientUser = toClientUser(user);

    return NextResponse.json({
      data: {
        user: clientUser,
        session: {
          access_token: session.token,
          token_type: "bearer",
          expires_in: 30 * 24 * 3600,
          refresh_token: `refresh_${session.token}`,
          user: clientUser,
        },
      },
      error: null,
    });
  } catch (err: any) {
    console.error("Signup API error:", err);
    return NextResponse.json(
      { data: null, error: { message: err?.message || "Internal server error during registration." } },
      { status: 500 }
    );
  }
}
