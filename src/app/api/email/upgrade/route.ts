import { NextRequest, NextResponse } from "next/server";
import { sendUpgradeEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("x-internal-secret");
  const secret = process.env.INTERNAL_API_SECRET;

  if (!secret || authHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, displayName, plan } = await request.json();

  if (!email || !plan) {
    return NextResponse.json(
      { error: "email and plan are required" },
      { status: 400 }
    );
  }

  if (plan !== "pro" && plan !== "team") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const result = await sendUpgradeEmail(email, displayName || "there", plan);
    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("[Email] Upgrade email failed:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
