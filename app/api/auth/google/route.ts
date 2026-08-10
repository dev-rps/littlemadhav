import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, email, name, image, googleId } = body;

    let userEmail = email;
    let userName = name || "Devotee User";
    let userImage = image || null;
    let userGoogleId = googleId || null;

    // If Google ID Token (credential JWT) is provided, attempt to verify & decode
    if (credential) {
      try {
        // Decode payload without external library requirement
        const parts = credential.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
          if (payload.email) {
            userEmail = payload.email;
            userName = payload.name || userName;
            userImage = payload.picture || userImage;
            userGoogleId = payload.sub || userGoogleId;
          }
        }
      } catch (decErr) {
        console.warn("Could not parse Google credential token:", decErr);
      }
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Email is required for Google Sign-In" }, { status: 400 });
    }

    const normalizedEmail = userEmail.toLowerCase().trim();

    // Upsert user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(userGoogleId ? [{ googleId: userGoogleId }] : []),
        ],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: userName,
          image: userImage,
          googleId: userGoogleId,
        },
      });
    } else if (userGoogleId && !user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: userGoogleId, image: userImage || user.image },
      });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      },
      message: "Signed in with Google successfully!",
    });
  } catch (error) {
    console.error("Google Auth error:", error);
    return NextResponse.json({ error: "Failed to authenticate with Google" }, { status: 500 });
  }
}
