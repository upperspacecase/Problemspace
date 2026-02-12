import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { authenticateRequest, isAuthError } from "@/lib/auth-middleware";
import { ObjectId } from "mongodb";

const VALID_CATEGORIES = [
  "health", "finance", "education", "productivity", "environment",
  "social", "housing", "transport", "food", "work", "other",
];

export async function POST(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (isAuthError(authResult)) return authResult;

  const body = await request.json();
  const { title, description, category, submissionMethod, jtbd } = body;

  if (!title || !description || !category) {
    return NextResponse.json(
      { error: "title, description, and category are required" },
      { status: 400 }
    );
  }

  if (title.length > 120) {
    return NextResponse.json(
      { error: "Title must be 120 characters or less" },
      { status: 400 }
    );
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 }
    );
  }

  const method = submissionMethod === "jtbd" ? "jtbd" : "free_form";
  const completenessBonus = method === "jtbd" ? 5 : 0;

  const problem = {
    userId: authResult._id,
    title: title.trim(),
    description: description.trim(),
    category,
    submissionMethod: method,
    jtbd: method === "jtbd" ? {
      situation: jtbd?.situation?.trim() || null,
      motivation: jtbd?.motivation?.trim() || null,
      outcome: jtbd?.outcome?.trim() || null,
    } : null,
    upvoteCount: 0,
    paySignalCount: 0,
    alternativesCount: 0,
    compositeScore: completenessBonus,
    solutionCount: 0,
    hasSolvedSolution: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const problems = await getCollection("problems");
  const result = await problems.insertOne(problem);

  return NextResponse.json(
    { ...problem, _id: result.insertedId },
    { status: 201 }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "score";
  const category = searchParams.get("category");
  const hasSolutions = searchParams.get("hasSolutions");
  const unsolved = searchParams.get("unsolved");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (category && VALID_CATEGORIES.includes(category)) {
    filter.category = category;
  }

  if (hasSolutions === "true") {
    filter.solutionCount = { $gt: 0 };
  }

  if (unsolved === "true") {
    filter.hasSolvedSolution = false;
  }

  let sortQuery: Record<string, 1 | -1>;
  switch (sort) {
    case "newest":
      sortQuery = { createdAt: -1 };
      break;
    case "trending":
      sortQuery = { createdAt: -1, compositeScore: -1 };
      break;
    case "score":
    default:
      sortQuery = { compositeScore: -1, createdAt: -1 };
      break;
  }

  const problems = await getCollection("problems");
  const [results, total] = await Promise.all([
    problems.find(filter).sort(sortQuery).skip(skip).limit(limit).toArray(),
    problems.countDocuments(filter),
  ]);

  return NextResponse.json({
    problems: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
