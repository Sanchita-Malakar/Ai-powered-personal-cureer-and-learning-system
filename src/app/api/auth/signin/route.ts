import { NextRequest, NextResponse } from "next/server";
import { findUserByIdentifier, verifyPassword, createSession, toClientUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, password } = body;

    const identifier = (email || phone || "").trim();
    if (!identifier) {
      return NextResponse.json(
        { data: null, error: { message: "Email or phone number is required." } },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { data: null, error: { message: "Password is required." } },
        { status: 400 }
      );
    }

    const user = findUserByIdentifier(identifier);
    if (!user) {
      return NextResponse.json(
        { data: null, error: { message: "Invalid credentials" } },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      return NextResponse.json(
        { data: null, error: { message: "Invalid credentials" } },
        { status: 401 }
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
    console.error("Signin API error:", err);
    return NextResponse.json(
      { data: null, error: { message: err?.message || "Internal server error during sign in." } },
      { status: 500 }
    );
  }
}
