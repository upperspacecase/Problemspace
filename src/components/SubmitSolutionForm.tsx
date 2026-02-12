"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

interface Props {
  problemId: string;
  onSubmitted: () => void;
  onCancel: () => void;
}

const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "prototype", label: "Prototype" },
  { value: "live", label: "Live" },
  { value: "mature", label: "Mature" },
];

export default function SubmitSolutionForm({
  problemId,
  onSubmitted,
  onCancel,
}: Props) {
  const { user, getToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [stage, setStage] = useState("idea");
  const [howItAddresses, setHowItAddresses] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

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
    <div className="bg-white border border-border-warm rounded-2xl p-6">
      <h3 className="font-serif text-lg text-earth-dark mb-4">
        Attach a Solution
      </h3>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-earth-mid mb-1">
            Solution Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-card-bg border border-border-warm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
            placeholder="e.g., My App Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-mid mb-1">
            One-line Description *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full bg-card-bg border border-border-warm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
            placeholder="What does it do in one sentence?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-mid mb-1">
            Link *
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            className="w-full bg-card-bg border border-border-warm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-mid mb-1">
            Stage *
          </label>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStage(s.value)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  stage === s.value
                    ? "bg-green-primary text-white"
                    : "bg-card-bg border border-border-warm text-earth-mid hover:border-green-primary"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-mid mb-1">
            How it addresses this problem{" "}
            <span className="text-earth-muted">(optional)</span>
          </label>
          <textarea
            value={howItAddresses}
            onChange={(e) => setHowItAddresses(e.target.value)}
            rows={3}
            className="w-full bg-card-bg border border-border-warm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary/30 resize-none"
            placeholder="Explain how your solution tackles this specific problem..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-green-light transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Solution"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-earth-muted hover:text-earth-dark transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
