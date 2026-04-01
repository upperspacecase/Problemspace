import { ObjectId } from "mongodb";

// Real problems sourced from recurring Reddit complaints across
// r/Entrepreneur, r/SaaS, r/smallbusiness, r/sysadmin, r/webdev,
// r/selfhosted, r/freelance, r/ProductManagement, r/datascience

export interface SeedProblem {
  title: string;
  description: string;
  category: string;
  wouldPayScore: number;
  funToBuildScore: number;
  redditSource: {
    subreddit: string;
    searchTerms: string;
  };
}

export const SEED_PROBLEMS: SeedProblem[] = [
  {
    title: "No simple way to collect and organize customer feedback without enterprise pricing",
    description: `Every feedback tool is either a Trello board hack or a $300/mo enterprise platform. There's nothing in between for small SaaS teams with 50-500 users who just want to collect feature requests, let users vote, and close the loop when something ships.

Existing tools like Canny and Productboard are overkill and expensive. Most indie devs end up with a mess of Notion pages, spreadsheet links, and DMs. The result: you miss patterns, forget requests, and your loudest users drown out the majority.

A focused tool that costs $20-40/mo, embeds in your app, and gives you a ranked backlog based on actual demand — without the roadmap theater.

---
*Sourced from recurring discussions on r/SaaS and r/ProductManagement*

**Would-pay score:** 8/10 | **Fun-to-build score:** 7/10`,
    category: "b2b-saas",
    wouldPayScore: 8,
    funToBuildScore: 7,
    redditSource: { subreddit: "SaaS", searchTerms: "feedback tool too expensive" },
  },
  {
    title: "Freelancers waste hours every week chasing invoices and tracking who actually paid",
    description: `Freelancers and solo consultants constantly complain about the gap between sending an invoice and getting paid. You send a PDF, then manually check your bank, then send a follow-up email, then check again. Multiply by 5-10 clients and it's a part-time job.

Tools like FreshBooks and QuickBooks are built for accountants, not freelancers. Stripe invoicing is barebones. What's missing is something that sends the invoice, auto-detects the bank deposit, matches it, sends a thank-you, and flags overdue ones — all without you opening a spreadsheet.

The recurring pain: "I spent my Sunday chasing three clients for payment instead of doing actual work."

---
*Sourced from recurring discussions on r/freelance and r/smallbusiness*

**Would-pay score:** 9/10 | **Fun-to-build score:** 6/10`,
    category: "fintech",
    wouldPayScore: 9,
    funToBuildScore: 6,
    redditSource: { subreddit: "freelance", searchTerms: "chasing invoices payment tracking" },
  },
  {
    title: "Self-hosted apps have no unified update/monitoring dashboard",
    description: `People running 10-20 self-hosted services (Nextcloud, Immich, Vaultwarden, etc.) have no central place to see which apps need updates, which are down, and which are eating resources. You end up SSH-ing into boxes, checking Docker logs, and manually comparing versions on GitHub.

Portainer helps with containers but doesn't track upstream versions. Uptime Kuma monitors health but not updates. Watchtower auto-updates but gives you no control. There's no single pane of glass that says: "Immich has a new release, Nextcloud is using 90% RAM, and your Vaultwarden backup failed last night."

The self-hosted community is massive and growing. They'll pay for something that respects their ethos (open core, self-hostable itself) while solving this real operational headache.

---
*Sourced from recurring discussions on r/selfhosted and r/homelab*

**Would-pay score:** 7/10 | **Fun-to-build score:** 9/10`,
    category: "dev-tools",
    wouldPayScore: 7,
    funToBuildScore: 9,
    redditSource: { subreddit: "selfhosted", searchTerms: "dashboard updates monitoring" },
  },
  {
    title: "Small business owners can't find a CRM that isn't Salesforce-complicated or spreadsheet-simple",
    description: `The CRM gap for 1-10 person businesses is enormous. Salesforce and HubSpot are built for sales teams with managers who want reports. Google Sheets works until you have 50+ contacts and realize you can't set reminders, track conversations, or see a pipeline.

What small business owners actually want: add a contact, log that you talked to them, set a follow-up reminder, and see a simple pipeline. That's it. No deal stages, no forecasting, no marketing automation. Just "who do I need to call back this week?"

Every week someone on r/smallbusiness asks "what CRM should I use?" and every answer is either too complex or too basic. The market is massive but everyone's building for enterprise.

---
*Sourced from recurring discussions on r/smallbusiness and r/Entrepreneur*

**Would-pay score:** 9/10 | **Fun-to-build score:** 7/10`,
    category: "b2b-saas",
    wouldPayScore: 9,
    funToBuildScore: 7,
    redditSource: { subreddit: "smallbusiness", searchTerms: "simple CRM small business" },
  },
  {
    title: "No good way to monitor and alert on website changes without writing custom scrapers",
    description: `Product managers, researchers, and competitive analysts need to know when a competitor changes their pricing page, adds a feature, or updates their docs. Right now the options are: manually check (doesn't scale), use a generic page-change tool that alerts on every CSS tweak, or write a custom scraper.

What's needed is a tool where you point at a URL, select the section you care about (like a pricing table or feature list), and get notified only when meaningful content changes. Bonus: diff view showing exactly what changed, and a history timeline.

The technical challenge (smart diffing, ignoring layout noise, extracting structured changes) is interesting, and the use case spans marketing teams, analysts, journalists, and developers watching API docs.

---
*Sourced from recurring discussions on r/Entrepreneur and r/digital_marketing*

**Would-pay score:** 8/10 | **Fun-to-build score:** 8/10`,
    category: "productivity",
    wouldPayScore: 8,
    funToBuildScore: 8,
    redditSource: { subreddit: "Entrepreneur", searchTerms: "monitor website changes competitor" },
  },
  {
    title: "Sysadmins have no clean way to document and share internal runbooks that stay current",
    description: `Every IT team has tribal knowledge locked in someone's head, scattered across Confluence pages that are 3 years stale, or buried in Slack threads. When that person is on vacation and something breaks at 2am, you're reading a runbook that references servers that no longer exist.

The core problem: runbooks rot because there's no feedback loop. Nobody knows if a runbook was actually followed, if the steps still work, or if the infrastructure changed since it was written. What sysadmins want is runbooks that can be "executed" — step by step, with verification checks — and that flag themselves as stale when related infrastructure changes.

This sits at the intersection of documentation, automation, and incident response. Not a wiki, not full automation — something in between that makes institutional knowledge executable and self-maintaining.

---
*Sourced from recurring discussions on r/sysadmin and r/devops*

**Would-pay score:** 8/10 | **Fun-to-build score:** 9/10`,
    category: "dev-tools",
    wouldPayScore: 8,
    funToBuildScore: 9,
    redditSource: { subreddit: "sysadmin", searchTerms: "runbook documentation stale" },
  },
  {
    title: "Data scientists spend more time fixing data pipelines than doing actual data science",
    description: `The number one complaint on r/datascience isn't about algorithms — it's about spending 80% of their time cleaning data, debugging pipelines, and figuring out why yesterday's model input has nulls that weren't there last week.

The pipeline breaks silently. The CSV format changed. A vendor API started returning a new field. Column names shifted. What data scientists want isn't another orchestrator (Airflow, Dagster, Prefect) — it's something that sits on top and tells you: "The schema of your input changed here, the data quality dropped there, and this is probably why your model performance degraded."

Think of it as a data quality watchdog that understands context: not just "this column has nulls" but "this column started having nulls after the vendor update on Tuesday, and it's affecting these 3 downstream models."

---
*Sourced from recurring discussions on r/datascience and r/MachineLearning*

**Would-pay score:** 8/10 | **Fun-to-build score:** 8/10`,
    category: "ai-ml",
    wouldPayScore: 8,
    funToBuildScore: 8,
    redditSource: { subreddit: "datascience", searchTerms: "data pipeline breaks data quality" },
  },
  {
    title: "Online course creators have no way to see where students actually get stuck",
    description: `Course creators on platforms like Teachable, Thinkific, and even self-hosted setups have zero insight into student behavior. You can see completion rates and that's about it. You can't tell that 40% of students pause at minute 3:42 of lesson 5, or that the quiz after module 3 has a 90% fail rate on question 4.

This isn't just analytics — it's learning intelligence. Where do students rewind? Where do they speed up? Which lessons have the highest drop-off? Which quiz questions are confusingly worded? Right now, course creators are flying blind and iterating based on gut feel or the occasional email complaint.

The fun part: you'd build video heatmaps, engagement scoring, and AI-powered suggestions like "students who struggle at this point benefit from an additional example."

---
*Sourced from recurring discussions on r/Entrepreneur and r/WorkOnline*

**Would-pay score:** 7/10 | **Fun-to-build score:** 8/10`,
    category: "education",
    wouldPayScore: 7,
    funToBuildScore: 8,
    redditSource: { subreddit: "Entrepreneur", searchTerms: "online course analytics student engagement" },
  },
  {
    title: "Remote teams have no lightweight way to do async daily standups that people actually read",
    description: `Synchronous standups across time zones are useless — someone's always at midnight. Slack-based standup bots spam a channel that nobody reads. The information gets buried in the feed within an hour.

What remote teams actually need: a daily async check-in that takes 30 seconds to fill out, surfaces blockers to the right people, and gives managers a dashboard view of team momentum without micromanaging. Think "team pulse" not "status report."

The key insight from Reddit threads: people don't hate standups, they hate that the information disappears. A standup tool that turns daily check-ins into a searchable, trend-visible team log would be something managers would pay for in a heartbeat.

---
*Sourced from recurring discussions on r/remotework and r/ProductManagement*

**Would-pay score:** 7/10 | **Fun-to-build score:** 7/10`,
    category: "productivity",
    wouldPayScore: 7,
    funToBuildScore: 7,
    redditSource: { subreddit: "remotework", searchTerms: "async standup remote team" },
  },
  {
    title: "E-commerce sellers can't easily A/B test product photos and descriptions across platforms",
    description: `Sellers on Shopify, Etsy, and Amazon know that product photos and copy directly drive conversions, but there's no easy way to run controlled tests. You change a photo and hope sales go up, but you can't isolate the variable because traffic fluctuates, seasons change, and you're running ads simultaneously.

Enterprise tools exist for big retailers but nothing for the small seller doing $5k-50k/month. What they want: upload two versions of a listing photo or description, split traffic, and get a clear "version A converts 23% better" within a week. Works across platforms, accounts for traffic variations, and doesn't require a statistics degree to interpret.

This is a genuine gap — every e-commerce subreddit has people asking "how do I know if my new photos are actually better?" and the answer is always "you can't really tell."

---
*Sourced from recurring discussions on r/ecommerce and r/Entrepreneur*

**Would-pay score:** 8/10 | **Fun-to-build score:** 7/10`,
    category: "ecommerce",
    wouldPayScore: 8,
    funToBuildScore: 7,
    redditSource: { subreddit: "ecommerce", searchTerms: "A/B test product photos listing" },
  },
  {
    title: "Developers have no fast way to spin up realistic test data that matches their actual schema",
    description: `Every developer has hit this: you need 10,000 rows of realistic test data but Faker gives you "John Doe, 123 Main St" garbage that doesn't match your domain. If you're building a healthcare app, you need realistic patient records. If it's fintech, you need transaction histories that look real.

The current workflow: write a custom seed script every time, hard-code edge cases, and pray it covers the scenarios QA will test. Existing tools either generate generic data or require you to learn a DSL to define relationships between tables.

What developers want: point it at your database schema (or Prisma/Drizzle/TypeORM models), tell it the domain ("e-commerce with international shipping"), and get a realistic, internally-consistent dataset with proper foreign keys, realistic distributions, and edge cases built in.

---
*Sourced from recurring discussions on r/webdev and r/programming*

**Would-pay score:** 7/10 | **Fun-to-build score:** 9/10`,
    category: "dev-tools",
    wouldPayScore: 7,
    funToBuildScore: 9,
    redditSource: { subreddit: "webdev", searchTerms: "realistic test data seed database" },
  },
  {
    title: "Small agencies can't track profitability per client without enterprise project management tools",
    description: `Agencies with 5-20 people know some clients are profitable and some are bleeding them dry, but they can't tell which is which. Time tracking tools (Toggl, Harvest) track hours but don't connect to what you're charging. Project management tools (Asana, Monday) track tasks but not money. Accounting tools (Xero, QuickBooks) track invoices but not effort.

The gap: a simple dashboard that shows "Client X is paying you $5k/mo, your team spent 80 hours on them, your blended cost is $75/hr, so you're making $1k profit" vs "Client Y is paying $3k/mo but consuming 100 hours, you're losing money."

Agency owners on Reddit describe this as the most important number they can't easily see. They want it updated weekly, broken down by project, and flagging when a client is trending unprofitable before it's too late.

---
*Sourced from recurring discussions on r/Entrepreneur and r/digital_marketing*

**Would-pay score:** 9/10 | **Fun-to-build score:** 6/10`,
    category: "b2b-saas",
    wouldPayScore: 9,
    funToBuildScore: 6,
    redditSource: { subreddit: "Entrepreneur", searchTerms: "agency client profitability tracking" },
  },
];
