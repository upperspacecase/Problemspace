"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

interface Props {
  problemId: string;
  upvoteCount: number;
  paySignalCount: number;
  initialUpvoted?: boolean;
  initialPaid?: boolean;
}

const PRICE_RANGES = ["<$10/mo", "$10-50/mo", "$50-200/mo", "$200+/mo"];

export default function DemandSignals({
  problemId,
  upvoteCount: initialUpvotes,
  paySignalCount: initialPaySignals,
  initialUpvoted = false,
  initialPaid = false,
}: Props) {
  const { user, getToken } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(initialUpvotes);
  const [paySignalCount, setPaySignalCount] = useState(initialPaySignals);
  const [hasUpvoted, setHasUpvoted] = useState(initialUpvoted);
  const [hasPaid, setHasPaid] = useState(initialPaid);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpvote() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const res = await apiFetch(`/api/problems/${problemId}/upvote`, {
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
      console.error("Upvote failed:", err);
    }
    setLoading(false);
  }

  async function handlePaySignal(priceRange?: string) {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    setShowPriceRange(false);
    try {
      const token = await getToken();
      const body: Record<string, string> = {};
      if (priceRange) body.priceRange = priceRange;
      const res = await apiFetch(`/api/problems/${problemId}/pay-signal`, {
        method: "POST",
        token,
        body: JSON.stringify(body),
      });
      if (res.action === "added") {
        setPaySignalCount((c) => c + 1);
        setHasPaid(true);
      } else {
        setPaySignalCount((c) => c - 1);
        setHasPaid(false);
      }
    } catch (err) {
      console.error("Pay signal failed:", err);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleUpvote}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          hasUpvoted
            ? "bg-green-primary text-white"
            : "bg-card-bg border border-border-warm text-earth-mid hover:border-green-primary hover:text-green-primary"
        }`}
      >
        <svg
          className="w-4 h-4"
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

      <div className="relative">
        <button
          onClick={() => {
            if (hasPaid) {
              handlePaySignal();
            } else {
              setShowPriceRange(!showPriceRange);
            }
          }}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            hasPaid
              ? "bg-green-primary text-white"
              : "bg-card-bg border border-border-warm text-earth-mid hover:border-green-primary hover:text-green-primary"
          }`}
        >
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
          I&apos;d pay · {paySignalCount}
        </button>

        {showPriceRange && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-border-warm rounded-2xl shadow-lg p-3 z-10 min-w-[180px]">
            <p className="text-xs text-earth-muted mb-2">
              Price range (optional):
            </p>
            {PRICE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => handlePaySignal(range)}
                className="block w-full text-left px-3 py-1.5 text-sm text-earth-mid hover:bg-card-bg rounded-lg transition-colors"
              >
                {range}
              </button>
            ))}
            <button
              onClick={() => handlePaySignal()}
              className="block w-full text-left px-3 py-1.5 text-sm text-earth-muted hover:bg-card-bg rounded-lg transition-colors mt-1 border-t border-border-warm pt-2"
            >
              Skip — just signal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
