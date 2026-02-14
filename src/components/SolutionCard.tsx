"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { STAGE_MAP } from "@/lib/constants";

interface Solution {
  _id: string;
  name: string;
  description: string;
  link: string;
  stage: string;
  howItAddresses: string | null;
  upvoteCount: number;
  isMarkedSolved: boolean;
}

interface Props {
  solution: Solution;
  problemUserId: string;
  initialUpvoted?: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  idea: "text-stage-idea bg-gray-100",
  prototype: "text-stage-prototype bg-amber-50",
  live: "text-stage-live bg-emerald-50",
  mature: "text-stage-mature bg-purple-50",
};

export default function SolutionCard({
  solution,
  problemUserId,
  initialUpvoted = false,
}: Props) {
  const { user, getToken } = useAuth();
  const router = useRouter();
  const [upvoteCount, setUpvoteCount] = useState(solution.upvoteCount);
  const [hasUpvoted, setHasUpvoted] = useState(initialUpvoted);
  const [isSolved, setIsSolved] = useState(solution.isMarkedSolved);
  const [loading, setLoading] = useState(false);

  const isOwner = user?._id === problemUserId;

  async function handleUpvote() {
    if (!user) { router.push("/login"); return; }
    if (loading) return;
    setLoading(true);
    const was = hasUpvoted;
    setHasUpvoted(!was);
    setUpvoteCount((c) => was ? c - 1 : c + 1);
    try {
      const token = await getToken();
      await apiFetch(`/api/solutions/${solution._id}/upvote`, { method: "POST", token });
    } catch {
      setHasUpvoted(was);
      setUpvoteCount((c) => was ? c + 1 : c - 1);
    }
    setLoading(false);
  }

  async function handleMarkSolved() {
    if (!user || !isOwner || loading) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await apiFetch(`/api/solutions/${solution._id}/mark-solved`, { method: "POST", token });
      setIsSolved(res.action === "marked_solved");
    } catch { /* noop */ }
    setLoading(false);
  }

  return (
    <div className="card p-4 flex items-start gap-3">
      {/* Upvote */}
      <button
        onClick={handleUpvote}
        className={`flex flex-col items-center gap-0.5 pt-0.5 flex-shrink-0 rounded-lg px-2 py-1.5 transition-all active:scale-[0.97] ${
          hasUpvoted
            ? "bg-signal-up-bg text-signal-up"
            : "text-text-tertiary hover:bg-bg-raised"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill={hasUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="font-num text-xs">{upvoteCount}</span>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-text-primary">{solution.name}</span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${STAGE_COLORS[solution.stage] || ""}`}>
            {STAGE_MAP[solution.stage] || solution.stage}
          </span>
          {isSolved && (
            <span className="text-[11px] px-1.5 py-0.5 rounded font-medium text-accent bg-accent-subtle">
              Solved it
            </span>
          )}
        </div>
        <p className="text-sm text-text-secondary mt-0.5 line-clamp-2">{solution.description}</p>
        {solution.howItAddresses && (
          <p className="text-xs text-text-tertiary italic mt-1">{solution.howItAddresses}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <a
            href={solution.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline"
          >
            {solution.link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]} &rarr;
          </a>
          {isOwner && (
            <button
              onClick={handleMarkSolved}
              className={`text-xs transition-colors ${
                isSolved
                  ? "text-accent font-medium"
                  : "text-text-tertiary hover:text-accent"
              }`}
            >
              {isSolved ? "Marked solved" : "This solved it for me"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
