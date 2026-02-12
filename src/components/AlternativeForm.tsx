"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

interface Props {
  problemId: string;
  onSubmitted: () => void;
}

export default function AlternativeForm({ problemId, onSubmitted }: Props) {
  const { user, getToken } = useAuth();
  const [alternativeName, setAlternativeName] = useState("");
  const [whyItFails, setWhyItFails] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const token = await getToken();
      await apiFetch(`/api/problems/${problemId}/alternative`, {
        method: "POST",
        token,
        body: JSON.stringify({
          alternativeName: alternativeName.trim(),
          whyItFails: whyItFails.trim(),
        }),
      });
      setAlternativeName("");
      setWhyItFails("");
      setShow(false);
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
    setSubmitting(false);
  }

  if (!show) {
    return (
      <button
        onClick={() => {
          if (!user) {
            window.location.href = "/login";
            return;
          }
          setShow(true);
        }}
        className="text-sm text-green-primary hover:underline"
      >
        + I&apos;ve tried an alternative that failed
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-border-warm rounded-2xl p-4 space-y-3"
    >
      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-earth-mid mb-1">
          What did you try?
        </label>
        <input
          type="text"
          value={alternativeName}
          onChange={(e) => setAlternativeName(e.target.value)}
          required
          className="w-full bg-card-bg border border-border-warm rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
          placeholder="e.g., Notion, Trello, a spreadsheet..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-mid mb-1">
          Why did it fail?
        </label>
        <textarea
          value={whyItFails}
          onChange={(e) => setWhyItFails(e.target.value)}
          required
          rows={2}
          className="w-full bg-card-bg border border-border-warm rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 resize-none"
          placeholder="Explain what didn't work..."
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-light transition-colors disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Alternative"}
        </button>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="text-sm text-earth-muted hover:text-earth-dark"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
