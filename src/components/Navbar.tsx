"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="border-b border-border bg-white/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-serif text-lg text-text-primary">
            Problem Board
          </span>
          <span className="hidden sm:inline text-xs text-text-tertiary font-mono">
            /beta
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-20 h-8 rounded-lg bg-bg-raised animate-pulse" />
          ) : user ? (
            <>
              <Link href="/submit" className="btn-primary text-xs px-4 py-2">
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
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/submit" className="btn-primary text-xs px-4 py-2">
                + Problem
              </Link>
              <Link
                href="/login"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors px-2"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
