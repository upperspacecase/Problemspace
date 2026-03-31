import { NextRequest, NextResponse } from "next/server";
import { scrapeRedditProblems } from "@/lib/bot/reddit-scraper";
import { rankProblems } from "@/lib/bot/problem-ranker";
import { postProblemToBoard } from "@/lib/bot/post-problem";

export const maxDuration = 300; // 5 min timeout for scraping + AI

export async function POST(request: NextRequest) {
  // Verify bot secret to prevent unauthorized triggers
  const authHeader = request.headers.get("authorization");
  const botSecret = process.env.BOT_SECRET;

  if (!botSecret || authHeader !== `Bearer ${botSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[Reddit Bot] Starting daily problem scrape...");

    // 1. Scrape Reddit for problem posts
    const candidates = await scrapeRedditProblems();
    console.log(`[Reddit Bot] Found ${candidates.length} candidate problems`);

    if (candidates.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No problem posts found today",
      });
    }

    // 2. Use Claude to rank and pick the best one
    const winner = await rankProblems(candidates);
    if (!winner) {
      return NextResponse.json({
        success: false,
        message: "AI ranking failed to select a winner",
      });
    }

    console.log(
      `[Reddit Bot] Winner: "${winner.title}" (score: ${winner.totalScore}/20)`
    );

    // 3. Post to the problem board
    const result = await postProblemToBoard(winner);

    if (result.duplicate) {
      return NextResponse.json({
        success: true,
        message: result.reason === "already_posted_today"
          ? "Already posted today's problem"
          : "Problem already exists on the board",
        problemId: result.problemId,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Posted today's best problem",
      problem: {
        id: result.problemId,
        title: winner.title,
        category: winner.category,
        wouldPayScore: winner.wouldPayScore,
        funToBuildScore: winner.funToBuildScore,
        totalScore: winner.totalScore,
        redditSource: winner.redditPost.permalink,
      },
    });
  } catch (error) {
    console.error("[Reddit Bot] Error:", error);
    return NextResponse.json(
      { error: "Bot execution failed", details: String(error) },
      { status: 500 }
    );
  }
}
