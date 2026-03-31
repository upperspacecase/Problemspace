/**
 * Standalone script to run the Reddit problem finder bot.
 * Can be executed directly: npx tsx src/lib/bot/run-daily.ts
 *
 * Requires environment variables:
 *   MONGODB_URI - MongoDB connection string
 *   ANTHROPIC_API_KEY - Claude API key
 *
 * Or, if calling the API endpoint instead:
 *   DEPLOY_URL - The deployed app URL (e.g. https://problemboard.vercel.app)
 *   BOT_SECRET - Secret token for bot authentication
 */

async function main() {
  const deployUrl = process.env.DEPLOY_URL;
  const botSecret = process.env.BOT_SECRET;

  if (deployUrl && botSecret) {
    // Mode 1: Call the API endpoint (works when app is deployed)
    console.log(`[Reddit Bot] Triggering via API: ${deployUrl}`);
    const res = await fetch(`${deployUrl}/api/bot/reddit-problems`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${botSecret}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(`[Reddit Bot] Response:`, JSON.stringify(data, null, 2));
    return;
  }

  // Mode 2: Run directly (requires MONGODB_URI + ANTHROPIC_API_KEY)
  console.log("[Reddit Bot] Running directly...");
  const { scrapeRedditProblems } = await import("./reddit-scraper");
  const { rankProblems } = await import("./problem-ranker");
  const { postProblemToBoard } = await import("./post-problem");

  const candidates = await scrapeRedditProblems();
  console.log(`[Reddit Bot] Found ${candidates.length} candidates`);

  if (candidates.length === 0) {
    console.log("[Reddit Bot] No problems found today.");
    return;
  }

  const winner = await rankProblems(candidates);
  if (!winner) {
    console.log("[Reddit Bot] AI ranking failed.");
    return;
  }

  console.log(`[Reddit Bot] Winner: "${winner.title}" (${winner.totalScore}/20)`);

  const result = await postProblemToBoard(winner);
  if (result.duplicate) {
    console.log("[Reddit Bot] Already posted:", result.problemId);
  } else {
    console.log("[Reddit Bot] Posted:", result.problemId);
  }
}

main().catch((err) => {
  console.error("[Reddit Bot] Fatal error:", err);
  process.exit(1);
});
