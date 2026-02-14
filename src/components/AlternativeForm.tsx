"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

interface Props {
  problemId: string;
  onSubmitted: () => void;
}

export default function AlternativeForm({ problemId, onSubmitted }: Props) {
  const { user, getToken } = useAuth();
  const router = useRouter();
  const [alternativeName, setAlternativeName] = useState("");
  const [whyItFails, setWhyItFails] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
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
          if (!user) { router.push("/login"); return; }
          setShow(true);
        }}
        className="text-xs text-text-tertiary hover:text-accent transition-colors"
      >
        + Add an alternative you tried
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-2.5">
      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-lg">{error}</div>
      )}
      <input
        type="text"
        value={alternativeName}
        onChange={(e) => setAlternativeName(e.target.value)}
        required
        className="input-base"
        placeholder="What did you try?"
      />
      <textarea
        value={whyItFails}
        onChange={(e) => setWhyItFails(e.target.value)}
        required
        rows={2}
        className="input-base resize-none"
        placeholder="Why didn't it work?"
      />
      <div className="flex items-center gap-2">
        <button type="submit" disabled={submitting} className="btn-primary text-xs px-4 py-2">
          {submitting ? "Adding..." : "Add"}
        </button>
        <button type="button" onClick={() => setShow(false)} className="text-xs text-text-tertiary hover:text-text-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
