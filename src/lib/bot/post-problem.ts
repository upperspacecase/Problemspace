import { getCollection } from "../mongodb";
import { sendDailyDigestEmail } from "../resend";
import { RankedProblem } from "./problem-ranker";

const BOT_USER_ID = "reddit-problem-bot";

async function ensureBotUser() {
  const users = await getCollection("users");
  const existing = await users.findOne({ firebaseUid: BOT_USER_ID });
  if (existing) return existing._id;

  const result = await users.insertOne({
    firebaseUid: BOT_USER_ID,
    displayName: "Reddit Problem Finder",
    email: "bot@problemboard.app",
    createdAt: new Date(),
  });
  return result.insertedId;
}

export async function postProblemToBoard(ranked: RankedProblem) {
  const botUserId = await ensureBotUser();

  // Check for duplicates - don't post if we already have this Reddit post
  const problems = await getCollection("problems");
  const existing = await problems.findOne({
    "redditSource.id": ranked.redditPost.id,
  });
  if (existing) {
    return { duplicate: true, problemId: existing._id };
  }

  // Also check for title similarity to avoid near-duplicates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysPosts = await problems.findOne({
    source: "reddit-bot",
    createdAt: { $gte: today },
  });
  if (todaysPosts) {
    return { duplicate: true, problemId: todaysPosts._id, reason: "already_posted_today" };
  }

  const redditPost = ranked.redditPost;
  const description = `${ranked.description}

---
*Found on [r/${redditPost.subreddit}](${redditPost.permalink}) (${redditPost.score} upvotes, ${redditPost.num_comments} comments)*

**Why this problem?** ${ranked.reasoning}

**Would-pay score:** ${ranked.wouldPayScore}/10 | **Fun-to-build score:** ${ranked.funToBuildScore}/10`;

  const problem = {
    userId: botUserId,
    title: ranked.title,
    description,
    category: ranked.category,
    submissionMethod: "free_form",
    jtbd: null,
    upvoteCount: 0,
    paySignalCount: 0,
    alternativesCount: 0,
    compositeScore: 0,
    solutionCount: 0,
    hasSolvedSolution: false,
    source: "reddit-bot",
    redditSource: {
      id: redditPost.id,
      subreddit: redditPost.subreddit,
      permalink: redditPost.permalink,
      score: redditPost.score,
      numComments: redditPost.num_comments,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await problems.insertOne(problem);

  // Send daily digest to paid users (fire-and-forget)
  sendDigestToSubscribers(ranked, result.insertedId.toString()).catch(
    (err) => console.error("[Bot] Digest emails failed:", err)
  );

  return { duplicate: false, problemId: result.insertedId, problem };
}

async function sendDigestToSubscribers(
  ranked: RankedProblem,
  problemId: string
) {
  const users = await getCollection("users");
  const subscribers = await users
    .find({ plan: { $in: ["pro", "team"] } })
    .toArray();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://problemboard.app";

  for (const user of subscribers) {
    if (!user.email) continue;
    try {
      await sendDailyDigestEmail(user.email, user.displayName || "there", {
        title: ranked.title,
        description: ranked.description,
        category: ranked.category,
        wouldPayScore: ranked.wouldPayScore,
        funToBuildScore: ranked.funToBuildScore,
        redditUrl: ranked.redditPost.permalink,
        problemUrl: `${appUrl}/problem/${problemId}`,
      });
    } catch (err) {
      console.error(`[Bot] Digest email to ${user.email} failed:`, err);
    }
  }
}
