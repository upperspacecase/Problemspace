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

  const body = await request.json();
  const { alternativeName, whyItFails } = body;

  if (!alternativeName || !whyItFails) {
    return NextResponse.json(
      { error: "alternativeName and whyItFails are required" },
      { status: 400 }
    );
  }

  const alternatives = await getCollection("problemAlternatives");
  const alt = {
    problemId,
    userId: authResult._id,
    alternativeName: alternativeName.trim(),
    whyItFails: whyItFails.trim(),
    createdAt: new Date(),
  };

  const result = await alternatives.insertOne(alt);

  await problems.updateOne(
    { _id: problemId },
    {
      $inc: { alternativesCount: 1, compositeScore: 2 },
      $set: { updatedAt: new Date() },
    }
  );

  return NextResponse.json(
    { ...alt, _id: result.insertedId },
    { status: 201 }
  );
}
