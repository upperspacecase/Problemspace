"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProblemCard from "@/components/ProblemCard";
import LeaderboardFilters from "@/components/LeaderboardFilters";

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("score");
  const [category, setCategory] = useState("");
  const [unsolved, setUnsolved] = useState("");
  const [page, setPage] = useState(1);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("sort", sort);
    params.set("page", page.toString());
    params.set("limit", "30");
    if (category) params.set("category", category);
    if (unsolved) params.set("unsolved", unsolved);

    try {
      const res = await fetch(`/api/problems?${params.toString()}`);
      const data = await res.json();
      setProblems(data.problems || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    }
    setLoading(false);
  }, [sort, category, unsolved, page]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  useEffect(() => {
    setPage(1);
  }, [sort, category, unsolved]);

  const startRank = ((pagination?.page || 1) - 1) * (pagination?.limit || 30);

  return (
    <div>
      {/* Header — no tagline, just the filters */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-serif text-text-primary">Problems</h1>
          {pagination && (
            <p className="text-xs text-text-tertiary font-mono mt-1">
              {pagination.total} problems
            </p>
          )}
        </div>
        <LeaderboardFilters
          sort={sort}
          category={category}
          unsolved={unsolved}
          onSortChange={setSort}
          onCategoryChange={setCategory}
          onUnsolvedChange={setUnsolved}
        />
      </div>

      {/* Scoring explanation — transparent, not hidden */}
      <div className="text-[11px] text-text-tertiary mb-4 font-mono">
        Ranked by: upvotes + 3x &ldquo;would pay&rdquo; signals + 2x failed alternatives
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card px-4 py-3.5 flex items-center gap-4">
              <div className="w-7 h-4 bg-bg-raised rounded animate-pulse" />
              <div className="w-10 h-8 bg-bg-raised rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-bg-raised rounded w-2/3 animate-pulse" />
                <div className="h-3 bg-bg-raised rounded w-1/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-secondary mb-1">Nothing here yet.</p>
          <p className="text-sm text-text-tertiary mb-6">
            Submit the first problem and let the market tell you if it matters.
          </p>
          <Link href="/submit" className="btn-primary">
            Submit a problem
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            {problems.map((problem, i) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                rank={startRank + i + 1}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-xs disabled:opacity-30"
              >
                Prev
              </button>
              <span className="text-xs text-text-tertiary font-mono">
                {pagination.page}/{pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="btn-secondary text-xs disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
