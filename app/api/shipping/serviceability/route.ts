import { NextRequest, NextResponse } from "next/server";
import { checkPincodeServiceability } from "@/lib/shiprocket";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get("pincode");
    const cod = searchParams.get("cod") === "true";
    const weight = parseFloat(searchParams.get("weight") || "0.5");

    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 6-digit Pincode" },
        { status: 400 }
      );
    }

    const result = await checkPincodeServiceability(pincode, weight, cod);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Shipping serviceability API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error checking delivery serviceability" },
      { status: 500 }
    );
  }
}
