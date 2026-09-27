import { NextRequest, NextResponse } from "next/server";
import { searchCountries } from "@/lib/locationService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const countries = searchCountries(query, limit);

    return NextResponse.json({
      success: true,
      total: countries.length,
      data: countries,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}
