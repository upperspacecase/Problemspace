import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, isAuthError } from "@/lib/auth-middleware";
import { getCollection } from "@/lib/mongodb";
import { sendUpgradeEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (isAuthError(authResult)) return authResult;

  const { plan, annual } = await request.json();

  if (plan !== "pro" && plan !== "team") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Record the subscription in the database
  const users = await getCollection("users");
  await users.updateOne(
    { _id: authResult._id },
    {
      $set: {
        plan,
        billingCycle: annual ? "yearly" : "monthly",
        planUpdatedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  // Send upgrade confirmation email
  try {
    if (authResult.email) {
      await sendUpgradeEmail(
        authResult.email,
        authResult.displayName || "there",
        plan
      );
    }
  } catch (err) {
    // Don't fail the checkout if email fails
    console.error("[Checkout] Upgrade email failed:", err);
  }

  return NextResponse.json({
    success: true,
    plan,
    billingCycle: annual ? "yearly" : "monthly",
  });
}
