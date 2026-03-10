import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, findOrCreateUser, createSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  try {
    const email = await verifyMagicLinkToken(token);

    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 400 }
      );
    }

    const user = await findOrCreateUser(email);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    await createSession(user._id.toString());

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    console.error("Failed to verify magic link:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
