"use client";

import Link from "next/link";

interface Problem {
  _id: string;
  title: string;
  category: string;
  submissionMethod: string;
  upvoteCount: number;
  paySignalCount: number;
  alternativesCount: number;
  compositeScore: number;
  solutionCount: number;
  hasSolvedSolution: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  health: "Health",
  finance: "Finance",
  education: "Education",
  productivity: "Productivity",
  environment: "Environment",
  social: "Social",
  housing: "Housing",
  transport: "Transport",
  food: "Food",
  work: "Work",
  other: "Other",
};

export default function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link href={`/problem/${problem._id}`}>
      <div className="bg-card-bg border border-border-warm rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-block bg-green-primary/10 text-green-primary text-xs font-medium px-3 py-1 rounded-full">
                {CATEGORY_LABELS[problem.category] || problem.category}
              </span>
              <span className="inline-block bg-border-warm text-earth-muted text-xs px-3 py-1 rounded-full">
                {problem.submissionMethod === "jtbd"
                  ? "JTBD Guided"
                  : "Free-form"}
              </span>
              {problem.hasSolvedSolution && (
                <span className="inline-block bg-green-light/20 text-green-primary text-xs font-medium px-3 py-1 rounded-full">
                  Solved
                </span>
              )}
              {!problem.hasSolvedSolution && problem.solutionCount === 0 && (
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
                  Unsolved
                </span>
              )}
            </div>

            <h3 className="font-serif text-lg text-earth-dark mb-3 leading-snug">
              {problem.title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-earth-muted">
              <span className="flex items-center gap-1" title="Upvotes">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                {problem.upvoteCount}
              </span>
              <span className="flex items-center gap-1" title="Would pay">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {problem.paySignalCount}
              </span>
              <span className="flex items-center gap-1" title="Alternatives tried">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {problem.alternativesCount}
              </span>
              <span className="flex items-center gap-1" title="Solutions">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                {problem.solutionCount}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="text-2xl font-serif text-green-primary">
              {problem.compositeScore}
            </div>
            <div className="text-xs text-earth-muted">demand</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
