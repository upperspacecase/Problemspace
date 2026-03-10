"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-heading font-bold text-text-primary tracking-tight">
            ProblemSpace
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 rounded-lg bg-bg-raised animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href={`/user/${user._id}`}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors px-2"
                >
                  {user.displayName}
                </Link>
                <MagneticButton distance={0.3}>
                  <button
                    onClick={logout}
                    className="text-sm text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    Log out
                  </button>
                </MagneticButton>
                <MagneticButton distance={0.4}>
                  <Link
                    href="/submit"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors cursor-pointer"
                    aria-label="Submit a problem"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </Link>
                </MagneticButton>
              </>
            ) : (
              <>
                <MagneticButton distance={0.3}>
                  <Link
                    href="/login"
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Sign in
                  </Link>
                </MagneticButton>
                <MagneticButton distance={0.4}>
                  <Link
                    href="/submit"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors cursor-pointer"
                    aria-label="Submit a problem"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </Link>
                </MagneticButton>
              </>
            )}
          </div>

          {/* Mobile */}
          <Link
            href="/submit"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors cursor-pointer"
            aria-label="Submit a problem"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-slate-950 px-4 py-4 space-y-3">
          {loading ? null : user ? (
            <>
              <Link
                href={`/user/${user._id}`}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
              >
                {user.displayName}
              </Link>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="block text-sm text-text-tertiary hover:text-text-secondary transition-colors text-left py-1 cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
