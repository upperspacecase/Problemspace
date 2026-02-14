"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CATEGORY_MAP } from "@/lib/constants";
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
  jtbd: { situation: string; motivation: string; outcome: string } | null;
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

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProblemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [error, setError] = useState(false);

  const fetchProblem = useCallback(async () => {
    try {
      const res = await fetch(`/api/problems/${id}`);
      if (!res.ok) { setError(true); return; }
      setProblem(await res.json());
    } catch { setError(true); }
  }, [id]);

  const fetchSolutions = useCallback(async () => {
    try {
      const res = await fetch(`/api/problems/${id}/solutions`);
      if (res.ok) setSolutions((await res.json()).solutions || []);
    } catch { /* noop */ }
  }, [id]);

  const fetchAlternatives = useCallback(async () => {
    try {
      const res = await fetch(`/api/problems/${id}/alternatives`);
      if (res.ok) setAlternatives((await res.json()).alternatives || []);
    } catch { /* noop */ }
  }, [id]);

  useEffect(() => {
    Promise.all([fetchProblem(), fetchSolutions(), fetchAlternatives()])
      .then(() => setLoading(false));
  }, [fetchProblem, fetchSolutions, fetchAlternatives]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-3 bg-bg-raised rounded w-20 animate-pulse" />
        <div className="h-8 bg-bg-raised rounded w-3/4 animate-pulse" />
        <div className="h-24 bg-bg-raised rounded animate-pulse" />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary mb-4">
          {error ? "Something went wrong loading this problem." : "Problem not found."}
        </p>
        <Link href="/" className="text-sm text-accent hover:underline">
          Back to board
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-xs text-text-tertiary hover:text-accent transition-colors mb-6 inline-block font-mono">
        &larr; board
      </Link>

      <article className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-xs text-text-tertiary">
          <span>{CATEGORY_MAP[problem.category] || problem.category}</span>
          <span>&middot;</span>
          <span>{timeAgo(problem.createdAt)}</span>
          <span>&middot;</span>
          <Link href={`/user/${problem.userId}`} className="hover:text-accent transition-colors">
            {problem.submitterName}
          </Link>
        </div>

        <h1 className="text-2xl font-serif text-text-primary mb-4 leading-tight">
          {problem.title}
        </h1>

        {problem.submissionMethod === "jtbd" && problem.jtbd ? (
          <div className="mb-5">
            <p className="text-text-secondary italic leading-relaxed mb-4">
              &ldquo;When I&apos;m in {problem.jtbd.situation}, I want to{" "}
              {problem.jtbd.motivation} so I can {problem.jtbd.outcome}.&rdquo;
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { label: "Situation", value: problem.jtbd.situation },
                { label: "Motivation", value: problem.jtbd.motivation },
                { label: "Outcome", value: problem.jtbd.outcome },
              ].map((field) => (
                <div key={field.label} className="bg-bg-raised rounded-lg p-3">
                  <p className="text-[11px] text-text-tertiary font-mono mb-1">{field.label}</p>
                  <p className="text-sm text-text-primary">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-text-secondary whitespace-pre-wrap leading-relaxed mb-5">
            {problem.description}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3 py-4 border-t border-b border-border">
          <DemandSignals
            problemId={problem._id}
            upvoteCount={problem.upvoteCount}
            paySignalCount={problem.paySignalCount}
          />
          <div className="flex items-center gap-4 text-xs text-text-tertiary font-mono">
            <span>{problem.upvoteCount} upvotes</span>
            <span>{problem.paySignalCount} would pay</span>
            <span>{problem.alternativesCount} alternatives</span>
          </div>
        </div>
      </article>

      {(alternatives.length > 0 || user) && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            What people have tried
            {alternatives.length > 0 && (
              <span className="font-num text-text-tertiary font-normal ml-1.5">
                {alternatives.length}
              </span>
            )}
          </h2>

          {alternatives.length > 0 && (
            <div className="space-y-2 mb-3">
              {alternatives.map((alt) => (
                <div key={alt._id} className="card px-4 py-3">
                  <p className="text-sm font-medium text-text-primary">{alt.alternativeName}</p>
                  <p className="text-sm text-text-secondary mt-0.5">{alt.whyItFails}</p>
                </div>
              ))}
            </div>
          )}

          <AlternativeForm
            problemId={problem._id}
            onSubmitted={() => { fetchAlternatives(); fetchProblem(); }}
          />
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            Solutions
            {solutions.length > 0 && (
              <span className="font-num text-text-tertiary font-normal ml-1.5">
                {solutions.length}
              </span>
            )}
          </h2>
          {user && !showSolutionForm && (
            <button
              onClick={() => setShowSolutionForm(true)}
              className="btn-primary text-xs px-4 py-2"
            >
              + Solution
            </button>
          )}
          {!user && (
            <Link href="/login" className="text-xs text-accent hover:underline">
              Log in to add a solution
            </Link>
          )}
        </div>

        {showSolutionForm && (
          <div className="mb-4">
            <SubmitSolutionForm
              problemId={problem._id}
              onSubmitted={() => { setShowSolutionForm(false); fetchSolutions(); fetchProblem(); }}
              onCancel={() => setShowSolutionForm(false)}
            />
          </div>
        )}

        {solutions.length > 0 ? (
          <div className="space-y-2">
            {solutions.map((sol) => (
              <SolutionCard key={sol._id} solution={sol} problemUserId={problem.userId} />
            ))}
          </div>
        ) : !showSolutionForm ? (
          <p className="text-sm text-text-tertiary py-8 text-center">
            No solutions yet. Got one?
          </p>
        ) : null}
      </section>
    </div>
  );
}
