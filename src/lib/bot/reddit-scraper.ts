const SUBREDDITS = [
  // Frustration-rich subreddits where people describe real problems
  "Entrepreneur",
  "SaaS",
  "startups",
  "smallbusiness",
  "freelance",
  "webdev",
  "sysadmin",
  "devops",
  "datascience",
  "MachineLearning",
  "ProductManagement",
  "userexperience",
  "digital_marketing",
  "ecommerce",
  "personalfinance",
  "WorkOnline",
  "remotework",
  "selfhosted",
  "productivity",
  "homeautomation",
];

// Keywords that signal someone describing a real problem they'd pay to fix
const PROBLEM_KEYWORDS = [
  "frustrated",
  "annoying",
  "wish there was",
  "looking for a tool",
  "any solution",
  "need help",
  "struggling with",
  "pain point",
  "waste of time",
  "does anyone know",
  "is there a way",
  "I would pay",
  "willing to pay",
  "can't find",
  "doesn't exist",
  "broken",
  "terrible",
  "no good solution",
  "manually",
  "tedious",
  "time-consuming",
  "inefficient",
  "workaround",
  "hack together",
  "cobbled together",
];

export interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  url: string;
  permalink: string;
  created_utc: number;
}

async function fetchSubreddit(
  subreddit: string,
  sort: "hot" | "new" | "top" = "hot",
  limit = 50,
  timeFilter = "day"
): Promise<RedditPost[]> {
  const params = new URLSearchParams({ limit: String(limit), t: timeFilter });
  const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?${params}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "ProblemBoard:v1.0 (bot; problem discovery)",
    },
  });

  if (!res.ok) {
    console.error(`Reddit fetch failed for r/${subreddit}: ${res.status}`);
    return [];
  }

  const data = await res.json();
  const children = data?.data?.children || [];

  return children
    .filter((c: { kind: string }) => c.kind === "t3")
    .map((c: { data: Record<string, unknown> }) => ({
      id: c.data.id as string,
      subreddit: c.data.subreddit as string,
      title: c.data.title as string,
      selftext: (c.data.selftext as string) || "",
      score: c.data.score as number,
      num_comments: c.data.num_comments as number,
      url: c.data.url as string,
      permalink: `https://www.reddit.com${c.data.permalink as string}`,
      created_utc: c.data.created_utc as number,
    }));
}

function isProblemPost(post: RedditPost): boolean {
  const text = `${post.title} ${post.selftext}`.toLowerCase();

  // Must have some substance (not just a link post)
  if (post.selftext.length < 50) return false;

  // Check for problem-signal keywords
  const matchCount = PROBLEM_KEYWORDS.filter((kw) =>
    text.includes(kw.toLowerCase())
  ).length;

  // At least 1 keyword match, or high engagement suggesting real pain
  return matchCount >= 1 || (post.score >= 20 && post.num_comments >= 10);
}

export async function scrapeRedditProblems(): Promise<RedditPost[]> {
  const allPosts: RedditPost[] = [];

  // Fetch in batches to respect rate limits (~10 req/min for unauthenticated)
  for (let i = 0; i < SUBREDDITS.length; i++) {
    const sub = SUBREDDITS[i];
    try {
      // Mix of hot (trending problems) and top/day (today's biggest pain points)
      const [hotPosts, topPosts] = await Promise.all([
        fetchSubreddit(sub, "hot", 25),
        fetchSubreddit(sub, "top", 25, "day"),
      ]);

      const combined = [...hotPosts, ...topPosts];
      const seen = new Set<string>();
      for (const post of combined) {
        if (!seen.has(post.id)) {
          seen.add(post.id);
          allPosts.push(post);
        }
      }
    } catch (err) {
      console.error(`Error scraping r/${sub}:`, err);
    }

    // Rate limit: wait 6 seconds between subreddit pairs (2 requests each)
    if (i < SUBREDDITS.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 6000));
    }
  }

  // Filter to problem posts and sort by engagement
  const problems = allPosts.filter(isProblemPost);
  problems.sort(
    (a, b) => b.score + b.num_comments * 2 - (a.score + a.num_comments * 2)
  );

  // Return top 30 candidates for AI ranking
  return problems.slice(0, 30);
}
