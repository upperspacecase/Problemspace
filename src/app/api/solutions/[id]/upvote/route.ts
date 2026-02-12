import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { authenticateRequest, isAuthError } from "@/lib/auth-middleware";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateRequest(request);
  if (isAuthError(authResult)) return authResult;

  let solutionId: ObjectId;
  try {
    solutionId = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid solution ID" }, { status: 400 });
  }

  const solutions = await getCollection("solutions");
  const solution = await solutions.findOne({ _id: solutionId });
  if (!solution) {
    return NextResponse.json({ error: "Solution not found" }, { status: 404 });
  }

  const upvotes = await getCollection("solutionUpvotes");
  const existing = await upvotes.findOne({
    solutionId,
    userId: authResult._id,
  });

  if (existing) {
    await upvotes.deleteOne({ _id: existing._id });
    await solutions.updateOne(
      { _id: solutionId },
      { $inc: { upvoteCount: -1 } }
    );
    return NextResponse.json({ action: "removed" });
  } else {
    await upvotes.insertOne({
      solutionId,
      userId: authResult._id,
      createdAt: new Date(),
    });
    await solutions.updateOne(
      { _id: solutionId },
      { $inc: { upvoteCount: 1 } }
    );
    return NextResponse.json({ action: "added" });
  }
}
