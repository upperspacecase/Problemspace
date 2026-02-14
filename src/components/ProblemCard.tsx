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
}

export default function ProblemCard({
  problem,
  rank,
}: {
  problem: Problem;
  rank: number;
}) {
  const isOpen = !problem.hasSolvedSolution && problem.solutionCount === 0;

  return (
    <Link href={`/problem/${problem._id}`} className="block group">
      <div className="card px-4 py-3.5 flex items-center gap-4 hover:border-border-strong transition-colors">
        <div className="w-7 text-center flex-shrink-0">
          <span className="font-num text-sm text-text-tertiary">
            {rank}
          </span>
        </div>

        <div className="flex flex-col items-center flex-shrink-0 w-10">
          <svg className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          <span className="font-num text-sm font-medium text-text-primary">
            {problem.upvoteCount}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-medium text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-1">
            {problem.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-text-tertiary">
              {CATEGORY_MAP[problem.category] || problem.category}
            </span>
            {problem.paySignalCount > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-signal-pay bg-signal-pay-bg px-1.5 py-0.5 rounded">
                {problem.paySignalCount} would pay
              </span>
            )}
            {problem.alternativesCount > 0 && (
              <span className="hidden sm:inline text-xs text-text-tertiary">
                {problem.alternativesCount} tried &amp; failed
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          {problem.solutionCount > 0 && (
            <span className="text-xs text-text-tertiary font-num" title={`${problem.solutionCount} solution${problem.solutionCount !== 1 ? "s" : ""}`}>
              {problem.solutionCount} sol
            </span>
          )}
          {problem.hasSolvedSolution ? (
            <span className="text-xs font-medium text-accent bg-accent-subtle px-2 py-0.5 rounded">
              Solved
            </span>
          ) : isOpen ? (
            <span className="w-2 h-2 rounded-full bg-signal-pay flex-shrink-0" title="Open — no solutions yet" />
          ) : null}
        </div>
      </div>
    </Link>
  );
}
