"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { PRICE_RANGES } from "@/lib/constants";

interface Props {
  problemId: string;
  upvoteCount: number;
  paySignalCount: number;
  initialUpvoted?: boolean;
  initialPaid?: boolean;
}

export default function DemandSignals({
  problemId,
  upvoteCount: initialUpvotes,
  paySignalCount: initialPaySignals,
  initialUpvoted = false,
  initialPaid = false,
}: Props) {
  const { user, getToken } = useAuth();
  const router = useRouter();
  const [upvoteCount, setUpvoteCount] = useState(initialUpvotes);
  const [paySignalCount, setPaySignalCount] = useState(initialPaySignals);
  const [hasUpvoted, setHasUpvoted] = useState(initialUpvoted);
  const [hasPaid, setHasPaid] = useState(initialPaid);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPriceRange(false);
      }
    }
    if (showPriceRange) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showPriceRange]);

  async function handleUpvote() {
    if (!user) { router.push("/login"); return; }
    if (loading) return;
    setLoading(true);
    setHasUpvoted((v) => !v);
    setUpvoteCount((c) => hasUpvoted ? c - 1 : c + 1);
    try {
      const token = await getToken();
      await apiFetch(`/api/problems/${problemId}/upvote`, { method: "POST", token });
    } catch {
      setHasUpvoted((v) => !v);
      setUpvoteCount((c) => hasUpvoted ? c + 1 : c - 1);
    }
    setLoading(false);
  }

  async function handlePaySignal(priceRange?: string) {
    if (!user) { router.push("/login"); return; }
    if (loading) return;
    setLoading(true);
    setShowPriceRange(false);
    const wasPaid = hasPaid;
    setHasPaid((v) => !v);
    setPaySignalCount((c) => wasPaid ? c - 1 : c + 1);
    try {
      const token = await getToken();
      const body: Record<string, string> = {};
      if (priceRange) body.priceRange = priceRange;
      await apiFetch(`/api/problems/${problemId}/pay-signal`, {
        method: "POST",
        token,
        body: JSON.stringify(body),
      });
    } catch {
      setHasPaid((v) => !v);
      setPaySignalCount((c) => wasPaid ? c + 1 : c - 1);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleUpvote}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${
          hasUpvoted
            ? "bg-signal-up-bg text-signal-up border border-signal-up/20"
            : "bg-bg-raised text-text-secondary hover:bg-bg-hover border border-transparent"
        }`}
      >
        <svg className="w-4 h-4" fill={hasUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="font-num">{upvoteCount}</span>
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            if (!user) { router.push("/login"); return; }
            if (hasPaid) {
              handlePaySignal();
            } else {
              setShowPriceRange(!showPriceRange);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${
            hasPaid
              ? "bg-signal-pay-bg text-signal-pay border border-signal-pay/20"
              : "bg-bg-raised text-text-secondary hover:bg-bg-hover border border-transparent"
          }`}
        >
          <span className="text-xs">$</span>
          <span>I&apos;d pay</span>
          {paySignalCount > 0 && (
            <span className="font-num text-xs opacity-70">{paySignalCount}</span>
          )}
        </button>

        {showPriceRange && (
          <div className="absolute top-full left-0 mt-1.5 bg-white border border-border rounded-xl shadow-lg p-2 z-20 min-w-[200px]">
            <p className="text-[11px] text-text-tertiary px-2 pt-1 pb-2">
              What would you pay?
            </p>
            {PRICE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => handlePaySignal(range)}
                className="block w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-raised rounded-lg transition-colors"
              >
                {range}
              </button>
            ))}
            <div className="border-t border-border mt-1 pt-1">
              <button
                onClick={() => handlePaySignal()}
                className="block w-full text-left px-3 py-2 text-xs text-text-tertiary hover:bg-bg-raised rounded-lg transition-colors"
              >
                Just signal — skip price
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
