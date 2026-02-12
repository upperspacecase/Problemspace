import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const problemId = new ObjectId(params.id);
    const problems = await getCollection("problems");
    const problem = await problems.findOne({ _id: problemId });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Fetch the submitter's display name
    const users = await getCollection("users");
    const submitter = await users.findOne({ _id: problem.userId });

    return NextResponse.json({
      ...problem,
      submitterName: submitter?.displayName || "Anonymous",
    });
  } catch {
    return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
  }
}
