import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { SEED_PROBLEMS } from "@/lib/bot/seed-problems";

export async function POST(request: NextRequest) {
  // Verify secret to prevent unauthorized seeding
  const authHeader = request.headers.get("authorization");
  const botSecret = process.env.BOT_SECRET;

  if (!botSecret || authHeader !== `Bearer ${botSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const problems = await getCollection("problems");
  const users = await getCollection("users");

  // Check if already seeded
  const existing = await problems.countDocuments({ source: "seed" });
  if (existing > 0) {
    return NextResponse.json({
      success: true,
      message: `Already seeded (${existing} problems exist)`,
      skipped: true,
    });
  }

  // Ensure bot user exists
  let botUser = await users.findOne({ firebaseUid: "reddit-problem-bot" });
  if (!botUser) {
    const result = await users.insertOne({
      firebaseUid: "reddit-problem-bot",
      displayName: "Reddit Problem Finder",
      email: "bot@problemboard.app",
      createdAt: new Date(),
    });
    botUser = { _id: result.insertedId };
  }

  // Insert seed problems with staggered dates so they look natural
  const now = new Date();
  const inserted = [];

  for (let i = 0; i < SEED_PROBLEMS.length; i++) {
    const seed = SEED_PROBLEMS[i];
    const daysAgo = SEED_PROBLEMS.length - i - 1; // Oldest first
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Give each problem a realistic-looking score
    const baseScore = seed.wouldPayScore * 3 + seed.funToBuildScore * 2;
    const upvotes = Math.floor(Math.random() * 15) + 3;
    const paySignals = Math.floor(Math.random() * 8) + 1;
    const compositeScore = upvotes + paySignals * 3 + baseScore;

    const problem = {
      userId: botUser._id,
      title: seed.title,
      description: seed.description,
      category: seed.category,
      submissionMethod: "free_form",
      jtbd: null,
      upvoteCount: upvotes,
      paySignalCount: paySignals,
      alternativesCount: Math.floor(Math.random() * 4),
      compositeScore,
      solutionCount: 0,
      hasSolvedSolution: false,
      source: "seed",
      redditSource: seed.redditSource,
      createdAt,
      updatedAt: createdAt,
    };

    const result = await problems.insertOne(problem);
    inserted.push({ id: result.insertedId, title: seed.title });
  }

  return NextResponse.json({
    success: true,
    message: `Seeded ${inserted.length} problems`,
    problems: inserted,
  });
}
