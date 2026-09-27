import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedStudent,
  getSupabaseServerClient,
  validateStudentProjectOwnership,
} from "@/lib/supabaseServer";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await getAuthenticatedStudent(request);
    if (!student) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view verification report." },
        { status: 401 }
      );
    }

    const projectId = params.id;

    // Validate project ownership
    const ownership = await validateStudentProjectOwnership(student.id, projectId);
    if (!ownership.isValid) {
      return NextResponse.json(
        { success: false, error: ownership.error || "Unauthorized." },
        { status: 403 }
      );
    }

    const client = getSupabaseServerClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Database client unavailable." },
        { status: 503 }
      );
    }

    const { data, error } = await client
      .from("project_verifications")
      .select("*")
      .eq("project_id", projectId)
      .eq("user_id", student.id)
      .order("verified_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No verification report found for this project." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, report: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve verification report." },
      { status: 500 }
    );
  }
}
