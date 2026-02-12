"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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

const CATEGORY_LABELS: Record<string, string> = {
  health: "Health",
  finance: "Finance",
  education: "Education",
  productivity: "Productivity",
  environment: "Environment",
  social: "Social",
  housing: "Housing",
  transport: "Transport",
  food: "Food",
  work: "Work",
  other: "Other",
};

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
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-border-warm rounded w-1/3" />
        <div className="h-4 bg-border-warm rounded w-1/4" />
        <div className="h-32 bg-border-warm rounded" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h2 className="font-serif text-xl text-earth-mid mb-2">
          User not found
        </h2>
        <Link
          href="/"
          className="text-green-primary hover:underline text-sm"
        >
          Back to leaderboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-card-bg border border-border-warm rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-serif text-earth-dark mb-1">
          {profile.displayName}
        </h1>
        <p className="text-sm text-earth-muted mb-4">
          Joined {new Date(profile.createdAt).toLocaleDateString()}
        </p>

        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-xl font-serif text-green-primary">
              {problems.length}
            </span>
            <p className="text-earth-muted">Problems</p>
          </div>
          <div>
            <span className="text-xl font-serif text-green-primary">
              {solutions.length}
            </span>
            <p className="text-earth-muted">Solutions</p>
          </div>
          <div>
            <span className="text-xl font-serif text-green-primary">
              {totalUpvotes}
            </span>
            <p className="text-earth-muted">Total Upvotes</p>
          </div>
        </div>
      </div>

      {/* Problems */}
      <div className="mb-6">
        <h2 className="font-serif text-lg text-earth-dark mb-3">
          Problems Submitted
        </h2>
        {problems.length > 0 ? (
          <div className="space-y-3">
            {problems.map((p) => (
              <Link key={p._id} href={`/problem/${p._id}`}>
                <div className="bg-card-bg border border-border-warm rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-green-primary bg-green-primary/10 px-2 py-0.5 rounded-full mr-2">
                        {CATEGORY_LABELS[p.category] || p.category}
                      </span>
                      <span className="text-sm font-medium text-earth-dark">
                        {p.title}
                      </span>
                    </div>
                    <span className="text-sm font-serif text-green-primary">
                      {p.compositeScore}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-earth-muted">No problems submitted yet.</p>
        )}
      </div>

      {/* Solutions */}
      <div>
        <h2 className="font-serif text-lg text-earth-dark mb-3">
          Solutions Attached
        </h2>
        {solutions.length > 0 ? (
          <div className="space-y-3">
            {solutions.map((s) => (
              <Link key={s._id} href={`/problem/${s.problemId}`}>
                <div className="bg-card-bg border border-border-warm rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-earth-dark">
                      {s.name}
                    </span>
                    <span className="text-sm text-earth-muted">
                      {s.upvoteCount} upvotes
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-earth-muted">No solutions attached yet.</p>
        )}
      </div>
    </div>
  );
}
