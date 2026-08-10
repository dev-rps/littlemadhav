import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null, authenticated: false }, { status: 200 });
    }
    return NextResponse.json({ user, authenticated: true });
  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ user: null, authenticated: false }, { status: 500 });
  }
}
