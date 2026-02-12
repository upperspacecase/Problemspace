import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

  const alternatives = await getCollection("problemAlternatives");
  const results = await alternatives
    .find({ problemId })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ alternatives: results });
}
