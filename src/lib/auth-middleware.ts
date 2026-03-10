import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getCollection } from "./mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "problemspace-dev-secret-change-in-prod"
);

const COOKIE_NAME = "pb_session";

export interface AuthenticatedUser {
  _id: ObjectId;
  displayName: string;
  email: string;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthenticatedUser | NextResponse> {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const users = await getCollection("users");
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return {
      _id: user._id as ObjectId,
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
