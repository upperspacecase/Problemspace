import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getCollection } from "@/lib/mongodb";

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

    return NextResponse.json({ user: result });
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
