"use client";

import Link from "next/link";
import { CATEGORY_MAP } from "@/lib/constants";
import { BorderBeam } from "@/components/ui/border-beam";

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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1mo ago" : `${months}mo ago`;
}

export default function ProblemCard({
  problem,
  rank,
}: {
  problem: Problem;
  rank: number;
}) {
  const isHot = problem.paySignalCount > 0;
  const isNew = Date.now() - new Date(problem.createdAt).getTime() < 7 * 86400000;

  return (
    <Link
      href={`/problem/${problem._id}`}
      className="card-hover p-6 flex flex-col justify-between h-full group relative overflow-hidden"
    >
      {isHot && (
        <BorderBeam
          size={150}
          duration={12}
          colorFrom="#F59E0B"
          colorTo="#818CF8"
          borderWidth={1.5}
        />
      )}
      {/* Rank + Title */}
      <div>
        <div className="flex items-start gap-3 mb-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-bg-raised border border-border flex items-center justify-center font-num text-sm font-bold text-text-tertiary group-hover:text-accent group-hover:border-accent/30 transition-colors">
            {rank}
          </span>
          <h3 className="text-base font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors">
            {problem.title}
          </h3>
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="inline-block bg-accent/10 text-accent text-[11px] font-medium px-2.5 py-1 rounded-full">
            {CATEGORY_MAP[problem.category] || problem.category}
          </span>
          {isHot && (
            <span className="inline-flex items-center gap-1 bg-signal-pay-bg text-signal-pay text-[11px] font-medium px-2 py-1 rounded-full">
              <span className="text-[10px]">$</span>
              {problem.paySignalCount} would pay
            </span>
          )}
          {isNew && !isHot && (
            <span className="inline-block bg-accent/10 text-accent text-[11px] font-medium px-2 py-1 rounded-full">
              New
            </span>
          )}
          {problem.hasSolvedSolution && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Solved
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">
          {problem.description || problem.title}
        </p>
      </div>

      {/* Bottom: Demand signals + meta */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-3">
          {/* Upvotes */}
          <div className="flex items-center gap-1 text-text-tertiary" title="Upvotes">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <span className="font-num text-xs">{problem.upvoteCount}</span>
          </div>
          {/* Pay signals */}
          <div className={`flex items-center gap-1 ${problem.paySignalCount > 0 ? "text-signal-pay" : "text-text-tertiary"}`} title="Pay signals">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-num text-xs">{problem.paySignalCount}</span>
          </div>
          {/* Solutions */}
          <div className="flex items-center gap-1 text-text-tertiary" title="Solutions">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <span className="font-num text-xs">{problem.solutionCount}</span>
          </div>
        </div>

        {/* Score + time */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-tertiary">{timeAgo(problem.createdAt)}</span>
          <div className="flex items-center gap-1 text-accent">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 15l7-7 7 7" />
            </svg>
            <span className="font-num text-xs font-bold">
              {problem.compositeScore.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
