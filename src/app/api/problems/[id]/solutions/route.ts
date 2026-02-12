import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { authenticateRequest, isAuthError } from "@/lib/auth-middleware";
import { ObjectId } from "mongodb";

const VALID_STAGES = ["idea", "prototype", "live", "mature"];

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

  const body = await request.json();
  const { name, description, link, stage, howItAddresses } = body;

  if (!name || !description || !link || !stage) {
    return NextResponse.json(
      { error: "name, description, link, and stage are required" },
      { status: 400 }
    );
  }

  if (!VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  }

  const solution = {
    problemId,
    userId: authResult._id,
    name: name.trim(),
    description: description.trim(),
    link: link.trim(),
    stage,
    howItAddresses: howItAddresses?.trim() || null,
    upvoteCount: 0,
    isMarkedSolved: false,
    solvedByUserId: null,
    createdAt: new Date(),
  };

  const solutions = await getCollection("solutions");
  const result = await solutions.insertOne(solution);

  await problems.updateOne(
    { _id: problemId },
    {
      $inc: { solutionCount: 1 },
      $set: { updatedAt: new Date() },
    }
  );

  return NextResponse.json(
    { ...solution, _id: result.insertedId },
    { status: 201 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let problemId: ObjectId;
  try {
    problemId = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
  }

  const solutions = await getCollection("solutions");
  const results = await solutions
    .find({ problemId })
    .sort({ upvoteCount: -1, createdAt: -1 })
    .toArray();

  return NextResponse.json({ solutions: results });
}
