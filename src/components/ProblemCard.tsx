"use client";

import Link from "next/link";
import { CATEGORY_MAP } from "@/lib/constants";

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
  description?: string;
}

export default function ProblemCard({
  problem,
  rank,
}: {
  problem: Problem;
  rank: number;
}) {
  return (
    <div className="card p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-text-primary leading-snug pr-4">
            {rank}. {problem.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 text-accent">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 15l7-7 7 7" />
            </svg>
            <span className="font-num text-sm font-medium">
              {problem.compositeScore.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block bg-accent/20 text-accent text-xs font-medium px-2.5 py-1 rounded">
            {CATEGORY_MAP[problem.category] || problem.category}
          </span>
          <span className="text-xs text-accent">
            {problem.solutionCount} Solutions Attached
          </span>
        </div>

        {problem.description ? (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
            {problem.description}
          </p>
        ) : (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
            {problem.title}...
          </p>
        )}
      </div>

      <Link
        href={`/problem/${problem._id}`}
        className="block w-full text-center bg-accent hover:bg-accent-hover text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
      >
        View Problem &amp; Attach a Solution
      </Link>
    </div>
  );
}
