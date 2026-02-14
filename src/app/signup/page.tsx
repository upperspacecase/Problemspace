"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signupWithEmail, loginWithGoogle, user, configured } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) { router.push("/"); return null; }

  if (!configured) {
    return (
      <div className="max-w-sm mx-auto mt-20 text-center">
        <h1 className="text-xl font-serif text-text-primary mb-3">Sign up</h1>
        <p className="text-sm text-text-tertiary">
          Auth not configured. Set <code className="font-mono text-xs bg-bg-raised px-1 py-0.5 rounded">NEXT_PUBLIC_FIREBASE_*</code> env vars and redeploy.
        </p>
      </div>
    );
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signupWithEmail(email, password, displayName);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
    setLoading(false);
  }

  async function handleGoogleSignup() {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google signup failed");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-serif text-text-primary mb-6 text-center">Create account</h1>

      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="card p-6">
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="btn-secondary w-full flex items-center justify-center gap-2 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-text-tertiary">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="input-base" placeholder="Name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-base" placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-base" placeholder="Password (6+ chars)" />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "..." : "Sign up"}
          </button>
        </form>

        <p className="text-xs text-text-tertiary text-center mt-4">
          Have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
