"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DemandSignals from "@/components/DemandSignals";
import SolutionCard from "@/components/SolutionCard";
import SubmitSolutionForm from "@/components/SubmitSolutionForm";
import AlternativeForm from "@/components/AlternativeForm";

interface Problem {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  submissionMethod: string;
  jtbd: {
    situation: string;
    motivation: string;
    outcome: string;
  } | null;
  upvoteCount: number;
  paySignalCount: number;
  alternativesCount: number;
  compositeScore: number;
  solutionCount: number;
  hasSolvedSolution: boolean;
  submitterName: string;
  createdAt: string;
}

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

interface Alternative {
  _id: string;
  alternativeName: string;
  whyItFails: string;
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

export default function ProblemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSolutionForm, setShowSolutionForm] = useState(false);

  const fetchProblem = useCallback(async () => {
    try {
      const res = await fetch(`/api/problems/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProblem(data);
      }
    } catch (err) {
      console.error("Failed to fetch problem:", err);
    }
  }, [id]);

  const fetchSolutions = useCallback(async () => {
    try {
      const res = await fetch(`/api/problems/${id}/solutions`);
      if (res.ok) {
        const data = await res.json();
        setSolutions(data.solutions || []);
      }
    } catch (err) {
      console.error("Failed to fetch solutions:", err);
    }
  }, [id]);

  const fetchAlternatives = useCallback(async () => {
    try {
      const res = await fetch(`/api/problems/${id}/alternatives`);
      if (res.ok) {
        const data = await res.json();
        setAlternatives(data.alternatives || []);
      }
    } catch (err) {
      console.error("Failed to fetch alternatives:", err);
    }
  }, [id]);

  useEffect(() => {
    Promise.all([fetchProblem(), fetchSolutions(), fetchAlternatives()]).then(
      () => setLoading(false)
    );
  }, [fetchProblem, fetchSolutions, fetchAlternatives]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-border-warm rounded w-1/4" />
          <div className="h-8 bg-border-warm rounded w-3/4" />
          <div className="h-24 bg-border-warm rounded" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-16">
        <h2 className="font-serif text-xl text-earth-mid mb-2">
          Problem not found
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
      <Link
        href="/"
        className="text-sm text-earth-muted hover:text-green-primary transition-colors mb-4 inline-block"
      >
        &larr; Back to leaderboard
      </Link>

      {/* Problem header */}
      <div className="bg-card-bg border border-border-warm rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-block bg-green-primary/10 text-green-primary text-xs font-medium px-3 py-1 rounded-full">
            {CATEGORY_LABELS[problem.category] || problem.category}
          </span>
          <span className="inline-block bg-border-warm text-earth-muted text-xs px-3 py-1 rounded-full">
            {problem.submissionMethod === "jtbd"
              ? "JTBD Guided"
              : "Free-form"}
          </span>
          {problem.hasSolvedSolution && (
            <span className="inline-block bg-green-light/20 text-green-primary text-xs font-medium px-3 py-1 rounded-full">
              Solved
            </span>
          )}
          {!problem.hasSolvedSolution && problem.solutionCount === 0 && (
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
              Unsolved
            </span>
          )}
        </div>

        <h1 className="text-2xl font-serif text-earth-dark mb-3">
          {problem.title}
        </h1>

        {problem.submissionMethod === "jtbd" && problem.jtbd ? (
          <div className="mb-4">
            <p className="text-earth-mid italic mb-3">
              &ldquo;When I&apos;m in {problem.jtbd.situation}, I want to{" "}
              {problem.jtbd.motivation} so I can {problem.jtbd.outcome}
              .&rdquo;
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-earth-muted mb-1">Situation</p>
                <p className="text-sm text-earth-dark">
                  {problem.jtbd.situation}
                </p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-earth-muted mb-1">Motivation</p>
                <p className="text-sm text-earth-dark">
                  {problem.jtbd.motivation}
                </p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-earth-muted mb-1">Outcome</p>
                <p className="text-sm text-earth-dark">
                  {problem.jtbd.outcome}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-earth-mid whitespace-pre-wrap mb-4">
            {problem.description}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <DemandSignals
            problemId={problem._id}
            upvoteCount={problem.upvoteCount}
            paySignalCount={problem.paySignalCount}
          />

          <div className="text-sm text-earth-muted">
            by{" "}
            <Link
              href={`/user/${problem.userId}`}
              className="text-green-primary hover:underline"
            >
              {problem.submitterName}
            </Link>
            {" · "}
            {new Date(problem.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Alternatives section */}
      <div className="mb-6">
        <h2 className="font-serif text-lg text-earth-dark mb-3">
          Alternatives Tried ({alternatives.length})
        </h2>

        {alternatives.length > 0 ? (
          <div className="space-y-3 mb-4">
            {alternatives.map((alt) => (
              <div
                key={alt._id}
                className="bg-card-bg border border-border-warm rounded-xl p-4"
              >
                <p className="text-sm font-medium text-earth-dark mb-1">
                  {alt.alternativeName}
                </p>
                <p className="text-sm text-earth-mid">{alt.whyItFails}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-earth-muted mb-4">
            No alternatives shared yet.
          </p>
        )}

        <AlternativeForm
          problemId={problem._id}
          onSubmitted={() => {
            fetchAlternatives();
            fetchProblem();
          }}
        />
      </div>

      {/* Solutions section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg text-earth-dark">
            Solutions ({solutions.length})
          </h2>
          {user && !showSolutionForm && (
            <button
              onClick={() => setShowSolutionForm(true)}
              className="bg-green-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-light transition-colors"
            >
              Attach a Solution
            </button>
          )}
          {!user && (
            <Link
              href="/login"
              className="text-sm text-green-primary hover:underline"
            >
              Log in to attach a solution
            </Link>
          )}
        </div>

        {showSolutionForm && (
          <div className="mb-4">
            <SubmitSolutionForm
              problemId={problem._id}
              onSubmitted={() => {
                setShowSolutionForm(false);
                fetchSolutions();
                fetchProblem();
              }}
              onCancel={() => setShowSolutionForm(false)}
            />
          </div>
        )}

        {solutions.length > 0 ? (
          <div className="space-y-3">
            {solutions.map((solution) => (
              <SolutionCard
                key={solution._id}
                solution={solution}
                problemUserId={problem.userId}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-earth-muted">
            No solutions attached yet. Be the first to propose one.
          </p>
        )}
      </div>
    </div>
  );
}
