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

  const upvotes = await getCollection("problemUpvotes");
  const existing = await upvotes.findOne({
    problemId,
    userId: authResult._id,
  });

  if (existing) {
    // Remove upvote
    await upvotes.deleteOne({ _id: existing._id });
    await problems.updateOne(
      { _id: problemId },
      {
        $inc: { upvoteCount: -1, compositeScore: -1 },
        $set: { updatedAt: new Date() },
      }
    );
    return NextResponse.json({ action: "removed" });
  } else {
    // Add upvote
    await upvotes.insertOne({
      problemId,
      userId: authResult._id,
      createdAt: new Date(),
    });
    await problems.updateOne(
      { _id: problemId },
      {
        $inc: { upvoteCount: 1, compositeScore: 1 },
        $set: { updatedAt: new Date() },
      }
    );
    return NextResponse.json({ action: "added" });
  }
}
