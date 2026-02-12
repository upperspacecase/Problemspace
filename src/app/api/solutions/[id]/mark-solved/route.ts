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

  // Only the original problem submitter can mark as solved
  const problems = await getCollection("problems");
  const problem = await problems.findOne({ _id: solution.problemId });
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  if (problem.userId.toString() !== authResult._id.toString()) {
    return NextResponse.json(
      { error: "Only the problem submitter can mark a solution as solved" },
      { status: 403 }
    );
  }

  // Toggle solved status
  const newSolvedState = !solution.isMarkedSolved;

  await solutions.updateOne(
    { _id: solutionId },
    {
      $set: {
        isMarkedSolved: newSolvedState,
        solvedByUserId: newSolvedState ? authResult._id : null,
      },
    }
  );

  // Check if any solution on this problem is still marked solved
  if (!newSolvedState) {
    const anySolved = await solutions.findOne({
      problemId: solution.problemId,
      isMarkedSolved: true,
      _id: { $ne: solutionId },
    });
    await problems.updateOne(
      { _id: solution.problemId },
      { $set: { hasSolvedSolution: !!anySolved } }
    );
  } else {
    await problems.updateOne(
      { _id: solution.problemId },
      { $set: { hasSolvedSolution: true } }
    );
  }

  return NextResponse.json({
    action: newSolvedState ? "marked_solved" : "unmarked_solved",
  });
}
