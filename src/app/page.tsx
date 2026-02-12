"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Filter state
  const [sort, setSort] = useState("score");
  const [category, setCategory] = useState("");
  const [hasSolutions, setHasSolutions] = useState("");
  const [unsolved, setUnsolved] = useState("");
  const [page, setPage] = useState(1);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("sort", sort);
    params.set("page", page.toString());
    params.set("limit", "20");
    if (category) params.set("category", category);
    if (hasSolutions) params.set("hasSolutions", hasSolutions);
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
  }, [sort, category, hasSolutions, unsolved, page]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [sort, category, hasSolutions, unsolved]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-earth-dark mb-2">
          Problem Board
        </h1>
        <p className="text-earth-mid">
          Aim builders at the problems that matter. Ranked by demand signal.
        </p>
      </div>

      <LeaderboardFilters
        sort={sort}
        category={category}
        hasSolutions={hasSolutions}
        unsolved={unsolved}
        onSortChange={setSort}
        onCategoryChange={setCategory}
        onHasSolutionsChange={setHasSolutions}
        onUnsolvedChange={setUnsolved}
      />

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-card-bg border border-border-warm rounded-2xl p-5 animate-pulse"
            >
              <div className="h-4 bg-border-warm rounded w-1/4 mb-3" />
              <div className="h-6 bg-border-warm rounded w-3/4 mb-3" />
              <div className="h-4 bg-border-warm rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="font-serif text-xl text-earth-mid mb-2">
            No problems yet
          </h2>
          <p className="text-earth-muted mb-4">
            Be the first to submit a problem the world needs solved.
          </p>
          <a
            href="/submit"
            className="inline-block bg-green-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-light transition-colors"
          >
            Submit a Problem
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full text-sm bg-card-bg border border-border-warm text-earth-mid hover:border-green-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-earth-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-4 py-2 rounded-full text-sm bg-card-bg border border-border-warm text-earth-mid hover:border-green-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
