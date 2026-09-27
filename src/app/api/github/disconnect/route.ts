import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStudent, getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const student = await getAuthenticatedStudent(request);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to disconnect GitHub." },
        { status: 401 }
      );
    }

    const client = getSupabaseServerClient();
    if (client) {
      // Mark connection as revoked and clear permitted repos for this student only
      await client
        .from("github_connections")
        .update({ connection_status: "revoked", updated_at: new Date().toISOString() })
        .eq("student_id", student.id);

      await client
        .from("github_repositories")
        .delete()
        .eq("student_id", student.id);
    }

    return NextResponse.json({
      success: true,
      message: "GitHub account disconnected successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to disconnect GitHub." },
      { status: 500 }
    );
  }
}
