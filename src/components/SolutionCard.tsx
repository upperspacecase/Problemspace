"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

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

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea",
  prototype: "Prototype",
  live: "Live",
  mature: "Mature",
};

const STAGE_COLORS: Record<string, string> = {
  idea: "bg-blue-100 text-blue-700",
  prototype: "bg-yellow-100 text-yellow-700",
  live: "bg-green-100 text-green-700",
  mature: "bg-purple-100 text-purple-700",
};

export default function SolutionCard({
  solution,
  problemUserId,
  initialUpvoted = false,
}: Props) {
  const { user, getToken } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(solution.upvoteCount);
  const [hasUpvoted, setHasUpvoted] = useState(initialUpvoted);
  const [isSolved, setIsSolved] = useState(solution.isMarkedSolved);
  const [loading, setLoading] = useState(false);

  const isOwner = user?._id === problemUserId;

  async function handleUpvote() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const res = await apiFetch(`/api/solutions/${solution._id}/upvote`, {
        method: "POST",
        token,
      });
      if (res.action === "added") {
        setUpvoteCount((c) => c + 1);
        setHasUpvoted(true);
      } else {
        setUpvoteCount((c) => c - 1);
        setHasUpvoted(false);
      }
    } catch (err) {
      console.error("Solution upvote failed:", err);
    }
    setLoading(false);
  }

  async function handleMarkSolved() {
    if (!user || !isOwner) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await apiFetch(`/api/solutions/${solution._id}/mark-solved`, {
        method: "POST",
        token,
      });
      setIsSolved(res.action === "marked_solved");
    } catch (err) {
      console.error("Mark solved failed:", err);
    }
    setLoading(false);
  }

  return (
    <div className="bg-white border border-border-warm rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-medium text-earth-dark">{solution.name}</h4>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                STAGE_COLORS[solution.stage] || ""
              }`}
            >
              {STAGE_LABELS[solution.stage] || solution.stage}
            </span>
            {isSolved && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-primary/10 text-green-primary font-medium">
                Solved it for me
              </span>
            )}
          </div>
          <p className="text-sm text-earth-mid mb-2">{solution.description}</p>
          {solution.howItAddresses && (
            <p className="text-sm text-earth-muted italic mb-2">
              {solution.howItAddresses}
            </p>
          )}
          <a
            href={solution.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-primary hover:underline"
          >
            View solution &rarr;
          </a>
        </div>

        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <button
            onClick={handleUpvote}
            disabled={loading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
              hasUpvoted
                ? "bg-green-primary text-white"
                : "bg-card-bg border border-border-warm text-earth-mid hover:border-green-primary"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill={hasUpvoted ? "currentColor" : "none"}
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
            {upvoteCount}
          </button>

          {isOwner && (
            <button
              onClick={handleMarkSolved}
              disabled={loading}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                isSolved
                  ? "bg-green-primary text-white"
                  : "border border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
              }`}
            >
              {isSolved ? "Solved" : "This solved it"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
