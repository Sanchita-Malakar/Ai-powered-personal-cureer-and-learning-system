import { NextRequest, NextResponse } from "next/server";
import { searchCities } from "@/lib/locationService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const country = searchParams.get("country") || undefined;
    const limit = parseInt(searchParams.get("limit") || "25", 10);

    // Requirement: Do not search when the input is empty
    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        total: 0,
        data: [],
      });
    }

    const cities = searchCities(query, country, limit);

    return NextResponse.json({
      success: true,
      total: cities.length,
      data: cities,
    });
  } catch (error) {
    console.error("Error searching cities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search cities" },
      { status: 500 }
    );
  }
}
