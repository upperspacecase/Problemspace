"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProblemCard from "@/components/ProblemCard";
import { BorderBeam } from "@/components/ui/border-beam";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CATEGORIES } from "@/lib/constants";

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

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("sort", "score");
    params.set("page", page.toString());
    params.set("limit", "30");
    if (category) params.set("category", category);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/problems?${params.toString()}`);
      const data = await res.json();
      setProblems(data.problems || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    }
    setLoading(false);
  }, [category, search, page]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProblems();
  };

  const startRank = ((pagination?.page || 1) - 1) * (pagination?.limit || 30);

  return (
    <div>
      {/* Hero Section with Dotted Surface */}
      <section className="-mx-4 sm:-mx-6 -mt-8 overflow-hidden">
        <DottedSurface className="min-h-[480px] sm:min-h-[560px] flex items-center justify-center">
          <div className="text-center px-4 py-20 relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text-primary mb-4 leading-tight">
              Real problems.{" "}
              <span className="text-gradient">Real demand.</span>
              <br />
              Build what people need.
            </h1>
            <p className="text-text-secondary text-base max-w-2xl mx-auto leading-relaxed mb-8">
              Stop guessing what to build. Discover validated problems from businesses,
              communities, and individuals — ranked by demand signals and willingness to pay.
            </p>
            <MagneticButton>
              <Link href="/submit" className="btn-primary px-8 py-3 text-base cursor-pointer inline-block">
                Submit a Problem
              </Link>
            </MagneticButton>
          </div>
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
        </DottedSurface>
      </section>

      {/* Search Bar */}
      <section className="max-w-3xl mx-auto px-4 mb-6">
        <MagneticButton distance={0.15}>
          <form onSubmit={handleSearch} className="flex gap-0">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems (e.g., sustainability, healthcare, logistics...)"
                className="w-full bg-bg-raised border border-border rounded-l-lg pl-12 pr-4 py-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white px-6 py-3.5 rounded-r-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              Search
            </button>
          </form>
        </MagneticButton>
      </section>

      {/* Category Filter */}
      <section className="max-w-3xl mx-auto px-4 mb-10">
        <div className="flex items-center gap-3 flex-wrap">
          <MagneticButton distance={0.2}>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none bg-bg-raised border border-border rounded-full pl-4 pr-8 py-2 text-xs text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer hover:border-border-strong transition-colors"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-tertiary pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </MagneticButton>

          {category && (
            <MagneticButton distance={0.4}>
              <button
                onClick={() => setCategory("")}
                className="text-xs text-accent hover:text-accent-hover transition-colors cursor-pointer"
              >
                Clear
              </button>
            </MagneticButton>
          )}
        </div>
      </section>

      {/* Problems Leaderboard */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-text-primary tracking-wide">
            Problems Leaderboard
          </h2>
          <p className="text-sm text-text-tertiary mt-1">
            Ranked by composite demand score
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-bg-raised rounded-lg animate-pulse" />
                  <div className="h-5 bg-bg-raised rounded w-3/4 animate-pulse" />
                </div>
                <div className="flex gap-2 mb-3">
                  <div className="h-6 bg-bg-raised rounded-full w-20 animate-pulse" />
                  <div className="h-6 bg-bg-raised rounded-full w-28 animate-pulse" />
                </div>
                <div className="h-4 bg-bg-raised rounded w-full animate-pulse mb-2" />
                <div className="h-4 bg-bg-raised rounded w-2/3 animate-pulse mb-5" />
                <div className="flex gap-3">
                  <div className="h-8 bg-bg-raised rounded-lg w-16 animate-pulse" />
                  <div className="h-8 bg-bg-raised rounded-lg w-16 animate-pulse" />
                  <div className="h-8 bg-bg-raised rounded-lg w-16 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-20 card p-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <p className="text-text-primary font-medium mb-1">No problems found</p>
            <p className="text-sm text-text-tertiary mb-6">
              {search || category
                ? "Try adjusting your search or category."
                : "Be the first to submit a problem and start the conversation."}
            </p>
            <MagneticButton>
              <Link href="/submit" className="btn-primary cursor-pointer inline-block">
                Submit a Problem
              </Link>
            </MagneticButton>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem, i) => (
                <ProblemCard
                  key={problem._id}
                  problem={problem}
                  rank={startRank + i + 1}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <MagneticButton distance={0.4}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary text-xs disabled:opacity-30 cursor-pointer"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                  </button>
                </MagneticButton>
                <span className="text-xs text-text-tertiary font-num">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <MagneticButton distance={0.4}>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="btn-secondary text-xs disabled:opacity-30 cursor-pointer"
                  >
                    Next
                    <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </MagneticButton>
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom CTA */}
      {!loading && problems.length > 0 && (
        <section className="mt-16 mb-8 text-center">
          <div className="card p-8 sm:p-12 glow-accent border-accent/20 relative overflow-hidden">
            <BorderBeam
              size={250}
              duration={15}
              colorFrom="#818CF8"
              colorTo="#C084FC"
              borderWidth={1.5}
            />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-3">
              Got a problem worth solving?
            </h2>
            <p className="text-text-secondary text-sm max-w-lg mx-auto mb-6">
              Every great product started with a real problem. Submit yours for free —
              let builders and investors see the demand.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <MagneticButton>
                <Link href="/submit" className="btn-primary px-8 py-3 text-base cursor-pointer inline-block">
                  Submit a Problem
                </Link>
              </MagneticButton>
              <span className="text-xs text-text-tertiary">
                Free forever. No account needed to browse.
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
