import Anthropic from "@anthropic-ai/sdk";
import { RedditPost } from "./reddit-scraper";
import { VALID_CATEGORIES } from "../constants";

export interface RankedProblem {
  redditPost: RedditPost;
  title: string;
  description: string;
  category: string;
  wouldPayScore: number; // 1-10: how many people would pay for a solution
  funToBuildScore: number; // 1-10: how fun/interesting to build
  totalScore: number;
  reasoning: string;
}

const SYSTEM_PROMPT = `You are an expert at identifying real software/product problems that people would pay money to solve and that would be fun for a developer to build.

You will be given a batch of Reddit posts where people describe problems. For each post, evaluate:
1. "wouldPayScore" (1-10): How likely are many people to pay for a solution? Consider: is this a recurring pain, does it affect many people, are existing solutions inadequate, would saving this time/pain be worth money?
2. "funToBuildScore" (1-10): How fun and interesting would it be for a developer to build? Consider: interesting technical challenges, cool APIs to integrate, satisfying UX to design, learning opportunities, not just boring CRUD.

Then pick the SINGLE BEST problem - the one with the highest combined score that represents a real, specific, actionable problem someone could build a product around.

For the winner, write:
- A clear, concise title (max 120 chars) that frames the problem (not the solution)
- A description (2-3 paragraphs) that explains: what the problem is, who has it, why existing solutions fail, and what a good solution might look like
- The best category from: ${VALID_CATEGORIES.join(", ")}

Respond with ONLY valid JSON in this exact format:
{
  "winner_index": <index of the best post in the input array, 0-based>,
  "title": "<problem title>",
  "description": "<problem description>",
  "category": "<category>",
  "wouldPayScore": <1-10>,
  "funToBuildScore": <1-10>,
  "reasoning": "<1-2 sentences on why this is the best problem to solve>"
}`;

export async function rankProblems(
  posts: RedditPost[]
): Promise<RankedProblem | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
  }

  if (posts.length === 0) return null;

  const client = new Anthropic({ apiKey });

  const postsText = posts
    .map(
      (p, i) =>
        `[${i}] r/${p.subreddit} | Score: ${p.score} | Comments: ${p.num_comments}
Title: ${p.title}
Body: ${p.selftext.slice(0, 800)}
URL: ${p.permalink}`
    )
    .join("\n\n---\n\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Here are ${posts.length} Reddit posts describing real problems. Analyze them and pick the single best one - the problem the most people would pay to solve AND that would be fun to build.\n\n${postsText}`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Failed to parse AI response:", responseText);
    return null;
  }

  const result = JSON.parse(jsonMatch[0]);
  const winnerIndex = result.winner_index;

  if (winnerIndex < 0 || winnerIndex >= posts.length) {
    console.error("Invalid winner index:", winnerIndex);
    return null;
  }

  return {
    redditPost: posts[winnerIndex],
    title: result.title.slice(0, 120),
    description: result.description,
    category: VALID_CATEGORIES.includes(result.category)
      ? result.category
      : "other",
    wouldPayScore: result.wouldPayScore,
    funToBuildScore: result.funToBuildScore,
    totalScore: result.wouldPayScore + result.funToBuildScore,
    reasoning: result.reasoning,
  };
}
