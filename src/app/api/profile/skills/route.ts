import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStudent, getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const student = await getAuthenticatedStudent(request);
    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view skills." },
        { status: 401 }
      );
    }

    const client = getSupabaseServerClient();
    if (!client) {
      return NextResponse.json({ success: true, skills: [] });
    }

    const { data, error } = await client
      .from("student_skills")
      .select("*")
      .eq("user_id", student.id)
      .order("verified_percentage", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, skills: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch skills." },
      { status: 500 }
    );
  }
}
