import { NextRequest, NextResponse } from "next/server";
import { validateSession, updateUserProfile, toClientUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, attributes } = body;

    const authHeader = req.headers.get("authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const activeToken = token || tokenFromHeader;

    if (!activeToken) {
      return NextResponse.json(
        { data: null, error: { message: "Unauthorized. No active session token." } },
        { status: 401 }
      );
    }

    const { user } = validateSession(activeToken);
    if (!user) {
      return NextResponse.json(
        { data: null, error: { message: "Invalid or expired session." } },
        { status: 401 }
      );
    }

    const updatedUser = updateUserProfile(user.id, {
      fullName: attributes?.data?.full_name || attributes?.full_name,
      targetRole: attributes?.data?.target_role || attributes?.target_role,
      userMetadata: attributes?.data || attributes,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { data: null, error: { message: "User not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        user: toClientUser(updatedUser),
      },
      error: null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { data: null, error: { message: err?.message || "Internal server error." } },
      { status: 500 }
    );
  }
}
