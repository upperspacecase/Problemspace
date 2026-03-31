import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  // Internal-only: called from auth sync, not exposed publicly
  const authHeader = request.headers.get("x-internal-secret");
  const secret = process.env.INTERNAL_API_SECRET;

  if (!secret || authHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, displayName } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const result = await sendWelcomeEmail(email, displayName || "there");
    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("[Email] Welcome email failed:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
