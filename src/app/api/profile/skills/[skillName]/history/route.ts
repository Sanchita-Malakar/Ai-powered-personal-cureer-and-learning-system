import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedStudent, getSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(
  request: NextRequest,
  { params }: { params: { skillName: string } }
) {
  try {
    const student = await getAuthenticatedStudent(request);
    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view skill history." },
        { status: 401 }
      );
    }

    const skillName = decodeURIComponent(params.skillName);
    const client = getSupabaseServerClient();

    if (!client) {
      return NextResponse.json({ success: true, history: [] });
    }

    const { data, error } = await client
      .from("skill_history")
      .select("*, student_projects(title)")
      .eq("user_id", student.id)
      .ilike("skill_name", skillName)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const formatted = (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      skillName: row.skill_name,
      previousPercentage: row.previous_percentage,
      newPercentage: row.new_percentage,
      previousLevel: row.previous_level,
      newLevel: row.new_level,
      changeReason: row.change_reason,
      projectId: row.project_id,
      projectTitle: row.student_projects?.title || undefined,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ success: true, history: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch skill history." },
      { status: 500 }
    );
  }
}
