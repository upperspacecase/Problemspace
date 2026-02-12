import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "./firebase-admin";
import { getCollection } from "./mongodb";
import { ObjectId } from "mongodb";

export interface AuthenticatedUser {
  _id: ObjectId;
  firebaseUid: string;
  displayName: string;
  email: string;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthenticatedUser | NextResponse> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    const users = await getCollection("users");
    const user = await users.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return {
      _id: user._id as ObjectId,
      firebaseUid: user.firebaseUid,
      displayName: user.displayName,
      email: user.email,
    };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export function isAuthError(
  result: AuthenticatedUser | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
