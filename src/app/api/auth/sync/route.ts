import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getCollection } from "@/lib/mongodb";
import { sendWelcomeEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    const { firebaseUid, email, displayName } = await request.json();

    if (decodedToken.uid !== firebaseUid) {
      return NextResponse.json({ error: "Token mismatch" }, { status: 403 });
    }

    const users = await getCollection("users");

    const result = await users.findOneAndUpdate(
      { firebaseUid },
      {
        $set: {
          email: email || decodedToken.email,
          displayName: displayName || decodedToken.name || "Anonymous",
        },
        $setOnInsert: {
          firebaseUid,
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    // Send welcome email to new users (fire-and-forget)
    const isNewUser = result?.createdAt &&
      new Date().getTime() - new Date(result.createdAt).getTime() < 10000;
    if (isNewUser && result?.email) {
      sendWelcomeEmail(result.email, result.displayName || "there").catch(
        (err) => console.error("[Auth] Welcome email failed:", err)
      );
    }

    return NextResponse.json({ user: result });
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
