import { NextRequest, NextResponse } from "next/server";
import { validateSession, toClientUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const authHeader = req.headers.get("authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = body?.token || tokenFromHeader;

    if (!token) {
      return NextResponse.json(
        { data: { session: null, user: null }, error: null },
        { status: 200 }
      );
    }

    const { user, session } = validateSession(token);
    if (!user || !session) {
      return NextResponse.json(
        { data: { session: null, user: null }, error: null },
        { status: 200 }
      );
    }

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
    return NextResponse.json(
      { data: { session: null, user: null }, error: null },
      { status: 200 }
    );
  }
}
