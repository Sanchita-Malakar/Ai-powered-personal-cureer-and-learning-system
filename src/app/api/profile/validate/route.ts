import { NextRequest, NextResponse } from "next/server";
import { validateLocationSelection } from "@/lib/locationService";
import { LocationValidationRequest } from "@/types/location";

export async function POST(request: NextRequest) {
  try {
    const body: LocationValidationRequest = await request.json();

    const validation = validateLocationSelection(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed for location or educational institution.",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Location and institution verified successfully.",
      verifiedData: validation.verifiedData,
    });
  } catch (error) {
    console.error("Error in profile validation API:", error);
    return NextResponse.json(
      { success: false, error: "Malformed validation request" },
      { status: 400 }
    );
  }
}
