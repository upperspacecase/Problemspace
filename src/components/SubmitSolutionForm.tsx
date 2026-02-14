"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { STAGES } from "@/lib/constants";

interface Props {
  problemId: string;
  onSubmitted: () => void;
  onCancel: () => void;
}

export default function SubmitSolutionForm({ problemId, onSubmitted, onCancel }: Props) {
  const { getToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [stage, setStage] = useState("idea");
  const [howItAddresses, setHowItAddresses] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const token = await getToken();
      await apiFetch(`/api/problems/${problemId}/solutions`, {
        method: "POST",
        token,
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          link: link.trim(),
          stage,
          howItAddresses: howItAddresses.trim() || undefined,
        }),
      });
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
    setSubmitting(false);
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Attach a solution</h3>
        <button onClick={onCancel} className="text-xs text-text-tertiary hover:text-text-secondary">
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-lg mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-base"
          placeholder="Solution name"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="input-base"
          placeholder="What does it do? (one line)"
        />

        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          className="input-base"
          placeholder="https://..."
        />

        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStage(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                stage === s.value
                  ? "bg-accent text-white"
                  : "bg-bg-raised text-text-secondary hover:bg-bg-hover"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <textarea
          value={howItAddresses}
          onChange={(e) => setHowItAddresses(e.target.value)}
          rows={2}
          className="input-base resize-none"
          placeholder="How does this address the problem? (optional)"
        />

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
