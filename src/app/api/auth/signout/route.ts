import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const authHeader = req.headers.get("authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = body?.token || tokenFromHeader;

    if (token) {
      deleteSession(token);
    }

    return NextResponse.json({ error: null }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: null }, { status: 200 });
  }
}
