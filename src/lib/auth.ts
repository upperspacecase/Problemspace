import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getCollection } from "./mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "problemspace-dev-secret-change-in-prod"
);

const COOKIE_NAME = "pb_session";

// --- Magic Link Tokens ---

export async function createMagicLinkToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokens = await getCollection("magic_tokens");

  // Delete any existing tokens for this email
  await tokens.deleteMany({ email });

  await tokens.insertOne({
    email: email.toLowerCase().trim(),
    token,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });

  return token;
}

export async function verifyMagicLinkToken(
  token: string
): Promise<string | null> {
  const tokens = await getCollection("magic_tokens");

  const record = await tokens.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  if (!record) return null;

  // Delete the token (single use)
  await tokens.deleteOne({ _id: record._id });

  return record.email;
}

// --- User Management ---

export async function findOrCreateUser(email: string) {
  const users = await getCollection("users");
  const normalizedEmail = email.toLowerCase().trim();

  const user = await users.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $setOnInsert: {
        email: normalizedEmail,
        displayName: normalizedEmail.split("@")[0],
        createdAt: new Date(),
      },
      $set: {
        lastLoginAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  return user;
}

// --- JWT Sessions ---

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;

  const users = await getCollection("users");
  const user = await users.findOne({ _id: new ObjectId(session.userId) });
  if (!user) return null;

  return {
    _id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
  };
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
