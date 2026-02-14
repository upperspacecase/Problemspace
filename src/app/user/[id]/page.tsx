"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CATEGORY_MAP } from "@/lib/constants";

interface UserProfile {
  _id: string;
  displayName: string;
  createdAt: string;
}

interface UserProblem {
  _id: string;
  title: string;
  category: string;
  compositeScore: number;
  createdAt: string;
}

interface UserSolution {
  _id: string;
  name: string;
  problemId: string;
  upvoteCount: number;
  createdAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [problems, setProblems] = useState<UserProblem[]>([]);
  const [solutions, setSolutions] = useState<UserSolution[]>([]);
  const [totalUpvotes, setTotalUpvotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setProblems(data.problems || []);
          setSolutions(data.solutions || []);
          setTotalUpvotes(data.totalUpvotes || 0);
        }
      } catch { /* noop */ }
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-6 bg-bg-raised rounded w-40 animate-pulse" />
        <div className="h-4 bg-bg-raised rounded w-24 animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary mb-4">User not found.</p>
        <Link href="/" className="text-sm text-accent hover:underline">Back to board</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-serif text-text-primary">{profile.displayName}</h1>
        <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary font-mono">
          <span>joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
          <span>{problems.length} problems</span>
          <span>{solutions.length} solutions</span>
          <span>{totalUpvotes} upvotes</span>
        </div>
      </div>

      {/* Problems */}
      {problems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-text-primary mb-3">Problems</h2>
          <div className="space-y-1.5">
            {problems.map((p) => (
              <Link key={p._id} href={`/problem/${p._id}`} className="block group">
                <div className="card px-4 py-3 flex items-center justify-between hover:border-border-strong transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-text-tertiary flex-shrink-0">
                      {CATEGORY_MAP[p.category] || p.category}
                    </span>
                    <span className="text-sm text-text-primary group-hover:text-accent transition-colors truncate">
                      {p.title}
                    </span>
                  </div>
                  <span className="font-num text-xs text-text-tertiary flex-shrink-0 ml-3">
                    {p.compositeScore}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Solutions */}
      {solutions.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-text-primary mb-3">Solutions</h2>
          <div className="space-y-1.5">
            {solutions.map((s) => (
              <Link key={s._id} href={`/problem/${s.problemId}`} className="block group">
                <div className="card px-4 py-3 flex items-center justify-between hover:border-border-strong transition-colors">
                  <span className="text-sm text-text-primary group-hover:text-accent transition-colors truncate">
                    {s.name}
                  </span>
                  <span className="font-num text-xs text-text-tertiary flex-shrink-0 ml-3">
                    {s.upvoteCount} up
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {problems.length === 0 && solutions.length === 0 && (
        <p className="text-sm text-text-tertiary text-center py-12">
          No activity yet.
        </p>
      )}
    </div>
  );
}
