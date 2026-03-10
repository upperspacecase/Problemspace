"use client";

import { useState, useEffect, useCallback } from "react";
import ProblemCard from "@/components/ProblemCard";
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
  const [status, setStatus] = useState("");
  const [submitter, setSubmitter] = useState("");
  const [page, setPage] = useState(1);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("sort", "score");
    params.set("page", page.toString());
    params.set("limit", "30");
    if (category) params.set("category", category);
    if (status === "unsolved") params.set("unsolved", "true");
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
  }, [category, status, search, page]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  useEffect(() => {
    setPage(1);
  }, [category, status, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProblems();
  };

  const startRank = ((pagination?.page || 1) - 1) * (pagination?.limit || 30);

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl sm:text-5xl font-serif text-accent mb-4 leading-tight">
          Find the World&apos;s Real Problems.
          <br />
          Build Impactful Solutions.
        </h1>
        <p className="text-text-secondary text-base max-w-2xl mx-auto leading-relaxed">
          A curated platform where entrepreneurs, builders, and innovators discover validated problems
          submitted by businesses, communities, and individuals waiting for innovative solutions.
        </p>
      </section>

      {/* Search Bar */}
      <section className="max-w-3xl mx-auto px-4 mb-6">
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
            className="bg-accent hover:bg-accent-hover text-white px-6 py-3.5 rounded-r-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            Search Problems
          </button>
        </form>
      </section>

      {/* Filter Pills */}
      <section className="max-w-3xl mx-auto px-4 mb-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-bg-raised border border-border rounded-full pl-4 pr-8 py-2 text-xs text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
            >
              <option value="">Category</option>
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

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none bg-bg-raised border border-border rounded-full pl-4 pr-8 py-2 text-xs text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
            >
              <option value="">Status</option>
              <option value="unsolved">Open</option>
              <option value="solved">Solved</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-tertiary pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="relative">
            <select
              value={submitter}
              onChange={(e) => setSubmitter(e.target.value)}
              className="appearance-none bg-bg-raised border border-border rounded-full pl-4 pr-8 py-2 text-xs text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
            >
              <option value="">Submitter</option>
              <option value="business">Business</option>
              <option value="community">Community</option>
              <option value="individual">Individual</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-tertiary pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <section className="flex items-center justify-center gap-6 mb-12">
        <div className="w-12 h-12 rounded-full bg-bg-raised border border-border flex items-center justify-center">
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>
        <div className="w-12 h-12 rounded-full bg-bg-raised border border-border flex items-center justify-center">
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.03C13.828 3 14.933 3 16.05 3c1.103 0 2 .897 2 2v.75M12.75 3.03C11.672 3 10.567 3 9.45 3 8.347 3 7.45 3.897 7.45 5v.75" />
          </svg>
        </div>
        <div className="w-12 h-12 rounded-full bg-bg-raised border border-border flex items-center justify-center">
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <div className="w-12 h-12 rounded-full bg-bg-raised border border-border flex items-center justify-center">
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
      </section>

      {/* Problems Leaderboard */}
      <section>
        <h2 className="text-2xl font-serif text-text-primary mb-8 text-center tracking-wide uppercase">
          Problems Leaderboard
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-5 bg-bg-raised rounded w-3/4 animate-pulse mb-3" />
                <div className="flex gap-2 mb-3">
                  <div className="h-6 bg-bg-raised rounded w-20 animate-pulse" />
                  <div className="h-6 bg-bg-raised rounded w-28 animate-pulse" />
                </div>
                <div className="h-4 bg-bg-raised rounded w-full animate-pulse mb-2" />
                <div className="h-4 bg-bg-raised rounded w-2/3 animate-pulse mb-4" />
                <div className="h-10 bg-bg-raised rounded w-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary mb-1">Nothing here yet.</p>
            <p className="text-sm text-text-tertiary mb-6">
              Be the first to post one.
            </p>
            <a href="/submit" className="btn-primary">
              Submit a problem
            </a>
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
      </section>
    </div>
  );
}
