"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function LoginPage() {
  const router = useRouter();
  const { user, sendMagicLink } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (user) {
    router.push("/");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendMagicLink(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send link");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-heading font-bold text-text-primary mb-2 text-center">
        Sign in to ProblemSpace
      </h1>
      <p className="text-sm text-text-tertiary text-center mb-6">
        Enter your email and we&apos;ll send you a magic link.
      </p>

      {error && (
        <div className="bg-red-500/10 text-red-400 text-xs p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="card p-6">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <p className="text-text-primary font-medium mb-1">Check your email</p>
            <p className="text-sm text-text-secondary mb-4">
              We sent a magic link to <span className="text-text-primary font-medium">{email}</span>
            </p>
            <MagneticButton distance={0.4}>
              <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="text-xs text-accent hover:text-accent-hover transition-colors cursor-pointer"
              >
                Use a different email
              </button>
            </MagneticButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <MagneticButton distance={0.15}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base"
                placeholder="you@example.com"
                autoFocus
              />
            </MagneticButton>
            <MagneticButton distance={0.3}>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full cursor-pointer"
              >
                {loading ? "Sending..." : "Send magic link"}
              </button>
            </MagneticButton>
          </form>
        )}
      </div>

      <p className="text-xs text-text-tertiary text-center mt-4">
        No password needed. We&apos;ll create your account automatically.
      </p>
    </div>
  );
}
