"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="border-b border-border bg-bg-raised/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#14B8A6" strokeWidth="2" />
              <path d="M16 8C12.7 8 10 10.7 10 14c0 2.2 1.2 4.1 3 5.1V22a1 1 0 001 1h4a1 1 0 001-1v-2.9c1.8-1 3-2.9 3-5.1 0-3.3-2.7-6-6-6z" fill="#14B8A6" />
              <rect x="12" y="24" width="8" height="1.5" rx="0.75" fill="#14B8A6" />
            </svg>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              ProblemBoard
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Explore Problems
            </Link>
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              For Solvers
            </Link>
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              For Companies
            </Link>
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              About
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-9 rounded-lg bg-bg-raised animate-pulse" />
          ) : user ? (
            <>
              <Link href="/submit" className="btn-primary text-sm px-5 py-2">
                + Problem
              </Link>
              <Link
                href={`/user/${user._id}`}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors px-2"
              >
                {user.displayName}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-text-primary border border-border-strong rounded-lg hover:bg-bg-hover transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-sm px-5 py-2"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
