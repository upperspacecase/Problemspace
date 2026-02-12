"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

const CATEGORIES = [
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "productivity", label: "Productivity" },
  { value: "environment", label: "Environment" },
  { value: "social", label: "Social" },
  { value: "housing", label: "Housing" },
  { value: "transport", label: "Transport" },
  { value: "food", label: "Food" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

type SubmissionPath = "choose" | "free_form" | "jtbd";

export default function SubmitPage() {
  const router = useRouter();
  const { user, getToken } = useAuth();

  const [path, setPath] = useState<SubmissionPath>("choose");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [situation, setSituation] = useState("");
  const [motivation, setMotivation] = useState("");
  const [outcome, setOutcome] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  function getJtbdDescription() {
    return `When I'm in ${situation}, I want to ${motivation} so I can ${outcome}.`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const token = await getToken();
      const body: Record<string, unknown> = {
        title: title.trim(),
        category,
        submissionMethod: path,
      };

      if (path === "jtbd") {
        body.description = getJtbdDescription();
        body.jtbd = {
          situation: situation.trim(),
          motivation: motivation.trim(),
          outcome: outcome.trim(),
        };
      } else {
        body.description = description.trim();
      }

      const result = await apiFetch("/api/problems", {
        method: "POST",
        token,
        body: JSON.stringify(body),
      });

      router.push(`/problem/${result._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
    setSubmitting(false);
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="font-serif text-xl text-earth-mid mb-2">
          Sign in to submit a problem
        </h2>
        <a
          href="/login"
          className="inline-block bg-green-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-light transition-colors"
        >
          Log in
        </a>
      </div>
    );
  }

  // Path selection screen
  if (path === "choose") {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-serif text-earth-dark mb-2">
          Submit a Problem
        </h1>
        <p className="text-earth-mid mb-8">
          Choose how you want to describe your problem.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setPath("free_form")}
            className="bg-card-bg border border-border-warm rounded-2xl p-6 text-left hover:border-green-primary transition-colors group"
          >
            <h3 className="font-serif text-lg text-earth-dark mb-2 group-hover:text-green-primary">
              Free-form
            </h3>
            <p className="text-sm text-earth-mid">
              Describe your problem in your own words. No structure required.
              Quick and easy.
            </p>
          </button>

          <button
            onClick={() => setPath("jtbd")}
            className="bg-card-bg border border-border-warm rounded-2xl p-6 text-left hover:border-green-primary transition-colors group"
          >
            <h3 className="font-serif text-lg text-earth-dark mb-2 group-hover:text-green-primary">
              Guided (JTBD)
            </h3>
            <p className="text-sm text-earth-mid">
              Walk through the Jobs to Be Done framework. Three guided steps for
              a sharper problem definition.
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Preview
  if (preview) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-serif text-earth-dark mb-6">
          Preview Your Problem
        </h1>

        <div className="bg-card-bg border border-border-warm rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-green-primary/10 text-green-primary text-xs font-medium px-3 py-1 rounded-full">
              {CATEGORIES.find((c) => c.value === category)?.label || category}
            </span>
            <span className="inline-block bg-border-warm text-earth-muted text-xs px-3 py-1 rounded-full">
              {path === "jtbd" ? "JTBD Guided" : "Free-form"}
            </span>
          </div>

          <h2 className="font-serif text-xl text-earth-dark mb-3">{title}</h2>

          {path === "jtbd" ? (
            <div className="space-y-3">
              <p className="text-earth-mid italic">{getJtbdDescription()}</p>
              <div className="grid gap-3 sm:grid-cols-3 pt-2">
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-earth-muted mb-1">Situation</p>
                  <p className="text-sm text-earth-dark">{situation}</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-earth-muted mb-1">Motivation</p>
                  <p className="text-sm text-earth-dark">{motivation}</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-earth-muted mb-1">Outcome</p>
                  <p className="text-sm text-earth-dark">{outcome}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-earth-mid whitespace-pre-wrap">{description}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-light transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Problem"}
          </button>
          <button
            onClick={() => setPreview(false)}
            className="text-sm text-earth-muted hover:text-earth-dark transition-colors"
          >
            Back to editing
          </button>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-earth-dark">
          {path === "jtbd" ? "Guided: Jobs to Be Done" : "Free-form Submission"}
        </h1>
        <button
          onClick={() => setPath("choose")}
          className="text-sm text-earth-muted hover:text-earth-dark transition-colors"
        >
          Change method
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPreview(true);
        }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-earth-mid mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
            className="w-full bg-card-bg border border-border-warm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
            placeholder="A short, descriptive title for this problem"
          />
          <p className="text-xs text-earth-muted mt-1">
            {title.length}/120 characters
          </p>
        </div>

        {path === "jtbd" ? (
          <>
            <div className="bg-card-bg border border-border-warm rounded-2xl p-5">
              <p className="text-sm text-earth-mid mb-4 italic">
                &ldquo;When I&apos;m in [situation], I want to [motivation] so I
                can [outcome].&rdquo;
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-earth-mid mb-1">
                    Situation *
                  </label>
                  <input
                    type="text"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    required
                    className="w-full bg-white border border-border-warm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
                    placeholder='e.g., "trying to track my daily spending across multiple accounts"'
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-mid mb-1">
                    Motivation *
                  </label>
                  <input
                    type="text"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    required
                    className="w-full bg-white border border-border-warm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
                    placeholder='e.g., "see all my expenses in one place without manual entry"'
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-mid mb-1">
                    Outcome *
                  </label>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    required
                    className="w-full bg-white border border-border-warm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
                    placeholder='e.g., "stick to my budget and save more each month"'
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-earth-mid mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full bg-card-bg border border-border-warm rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 resize-none"
              placeholder="Describe the problem in detail. What are you trying to do? What's getting in the way?"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-earth-mid mb-2">
            Category *
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  category === cat.value
                    ? "bg-green-primary text-white"
                    : "bg-card-bg border border-border-warm text-earth-mid hover:border-green-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!title || !category || (path === "free_form" ? !description : !situation || !motivation || !outcome)}
            className="bg-green-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview
          </button>
        </div>
      </form>
    </div>
  );
}
