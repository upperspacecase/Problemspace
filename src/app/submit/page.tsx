"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { MagneticButton } from "@/components/ui/magnetic-button";

type Path = "choose" | "free_form" | "jtbd";

export default function SubmitPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [path, setPath] = useState<Path>("choose");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [situation, setSituation] = useState("");
  const [motivation, setMotivation] = useState("");
  const [outcome, setOutcome] = useState("");
  const [submitterType, setSubmitterType] = useState("individual");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary mb-4">Log in to submit a problem.</p>
        <MagneticButton>
          <Link href="/login" className="btn-primary inline-block">Log in</Link>
        </MagneticButton>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        category,
        submissionMethod: path,
        submitterType,
      };
      if (path === "jtbd") {
        body.description = `When I'm in ${situation.trim()}, I want to ${motivation.trim()} so I can ${outcome.trim()}.`;
        body.jtbd = { situation: situation.trim(), motivation: motivation.trim(), outcome: outcome.trim() };
      } else {
        body.description = description.trim();
      }
      const result = await apiFetch("/api/problems", { method: "POST", body: JSON.stringify(body) });
      router.push(`/problem/${result._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setSubmitting(false);
  }

  if (path === "choose") {
    return (
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-serif text-text-primary mb-1">
          What&apos;s the problem?
        </h1>
        <p className="text-sm text-text-tertiary mb-8">
          If others have the same problem, it&apos;ll rise.
        </p>

        <div className="space-y-3">
          <MagneticButton distance={0.3}>
            <button
              onClick={() => setPath("free_form")}
              className="card w-full p-5 text-left hover:border-border-strong transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary group-hover:text-accent transition-colors">
                    Just describe it
                  </p>
                  <p className="text-sm text-text-tertiary mt-0.5">
                    Write it however you want. No structure needed.
                  </p>
                </div>
                <span className="text-text-tertiary group-hover:text-accent transition-colors">&rarr;</span>
              </div>
            </button>
          </MagneticButton>

          <MagneticButton distance={0.3}>
            <button
              onClick={() => setPath("jtbd")}
              className="card w-full p-5 text-left hover:border-border-strong transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary group-hover:text-accent transition-colors">
                    Use the JTBD framework
                  </p>
                  <p className="text-sm text-text-tertiary mt-0.5">
                    Three fields: situation, motivation, outcome.
                  </p>
                </div>
                <span className="text-text-tertiary group-hover:text-accent transition-colors">&rarr;</span>
              </div>
            </button>
          </MagneticButton>
        </div>
      </div>
    );
  }

  const isValid = title && category && (path === "free_form" ? description : situation && motivation && outcome);

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-text-primary">
          {path === "jtbd" ? "JTBD" : "Describe the problem"}
        </h1>
        <button
          onClick={() => setPath("choose")}
          className="text-xs text-text-tertiary hover:text-text-secondary transition-colors font-mono"
        >
          switch method
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 text-xs p-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Title
          </label>
          <MagneticButton distance={0.15}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              className="input-base"
              placeholder="What's the problem in one line?"
            />
          </MagneticButton>
          <p className="text-[11px] text-text-tertiary mt-1 font-mono text-right">{title.length}/120</p>
        </div>

        {path === "jtbd" ? (
          <div className="card p-4 space-y-3">
            <p className="text-xs text-text-tertiary italic">
              &ldquo;When I&apos;m in ___, I want to ___ so I can ___.&rdquo;
            </p>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Situation</label>
              <MagneticButton distance={0.15}>
                <input
                  type="text"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  required
                  className="input-base"
                  placeholder='e.g., "managing a remote team across 4 time zones"'
                />
              </MagneticButton>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Motivation</label>
              <MagneticButton distance={0.15}>
                <input
                  type="text"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  required
                  className="input-base"
                  placeholder='e.g., "run async standups without scheduling headaches"'
                />
              </MagneticButton>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Outcome</label>
              <MagneticButton distance={0.15}>
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  required
                  className="input-base"
                  placeholder='e.g., "keep everyone aligned without another meeting"'
                />
              </MagneticButton>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Description</label>
            <MagneticButton distance={0.15}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="input-base resize-none"
                placeholder="What are you trying to do? What's not working? Be specific."
              />
            </MagneticButton>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">Category</label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat.value
                    ? "bg-accent text-white"
                    : "bg-bg-raised text-text-secondary hover:bg-bg-hover"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">Submitted as</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: "individual", label: "Individual" },
              { value: "business", label: "Business" },
              { value: "community", label: "Community" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSubmitterType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  submitterType === t.value
                    ? "bg-accent text-white"
                    : "bg-bg-raised text-text-secondary hover:bg-bg-hover"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <MagneticButton distance={0.3}>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="btn-primary w-full mt-2"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </MagneticButton>
      </form>
    </div>
  );
}
