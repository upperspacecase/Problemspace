import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let userId: ObjectId;
  try {
    userId = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const users = await getCollection("users");
  const user = await users.findOne({ _id: userId });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const problems = await getCollection("problems");
  const solutions = await getCollection("solutions");

  const [userProblems, userSolutions] = await Promise.all([
    problems
      .find({ userId })
      .sort({ createdAt: -1 })
      .project({ title: 1, category: 1, compositeScore: 1, createdAt: 1 })
      .toArray(),
    solutions
      .find({ userId })
      .sort({ createdAt: -1 })
      .project({ name: 1, problemId: 1, upvoteCount: 1, createdAt: 1 })
      .toArray(),
  ]);

  // Calculate total upvotes received
  const totalProblemUpvotes = userProblems.reduce(
    (sum, p) => sum + (p.compositeScore || 0),
    0
  );
  const totalSolutionUpvotes = userSolutions.reduce(
    (sum, s) => sum + (s.upvoteCount || 0),
    0
  );

  return NextResponse.json({
    user: {
      _id: user._id,
      displayName: user.displayName,
      createdAt: user.createdAt,
    },
    problems: userProblems,
    solutions: userSolutions,
    totalUpvotes: totalProblemUpvotes + totalSolutionUpvotes,
  });
}
