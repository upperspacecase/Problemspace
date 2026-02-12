import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { authenticateRequest, isAuthError } from "@/lib/auth-middleware";
import { ObjectId } from "mongodb";

const VALID_PRICE_RANGES = ["<$10/mo", "$10-50/mo", "$50-200/mo", "$200+/mo"];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateRequest(request);
  if (isAuthError(authResult)) return authResult;

  let problemId: ObjectId;
  try {
    problemId = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
  }

  const problems = await getCollection("problems");
  const problem = await problems.findOne({ _id: problemId });
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const priceRange =
    body.priceRange && VALID_PRICE_RANGES.includes(body.priceRange)
      ? body.priceRange
      : null;

  const paySignals = await getCollection("problemPaySignals");
  const existing = await paySignals.findOne({
    problemId,
    userId: authResult._id,
  });

  if (existing) {
    // Remove pay signal
    await paySignals.deleteOne({ _id: existing._id });
    await problems.updateOne(
      { _id: problemId },
      {
        $inc: { paySignalCount: -1, compositeScore: -3 },
        $set: { updatedAt: new Date() },
      }
    );
    return NextResponse.json({ action: "removed" });
  } else {
    // Add pay signal
    await paySignals.insertOne({
      problemId,
      userId: authResult._id,
      priceRange,
      createdAt: new Date(),
    });
    await problems.updateOne(
      { _id: problemId },
      {
        $inc: { paySignalCount: 1, compositeScore: 3 },
        $set: { updatedAt: new Date() },
      }
    );
    return NextResponse.json({ action: "added" });
  }
}
