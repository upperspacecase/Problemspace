"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="max-w-sm mx-auto mt-20 text-center">
        <p className="text-text-secondary">Verifying...</p>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setError("No token provided");
      setVerifying(false);
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Verification failed");
          setVerifying(false);
          return;
        }

        await refreshUser();
        router.push("/");
      } catch {
        setError("Verification failed");
        setVerifying(false);
      }
    }

    verify();
  }, [searchParams, refreshUser, router]);

  return (
    <div className="max-w-sm mx-auto mt-20 text-center">
      {verifying ? (
        <>
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-text-primary font-medium">Verifying your link...</p>
          <p className="text-sm text-text-tertiary mt-1">Just a moment.</p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="text-text-primary font-medium mb-1">{error}</p>
          <p className="text-sm text-text-tertiary mb-4">
            This link may have expired or already been used.
          </p>
          <MagneticButton>
            <a href="/login" className="btn-primary inline-block cursor-pointer">
              Try again
            </a>
          </MagneticButton>
        </>
      )}
    </div>
  );
}
