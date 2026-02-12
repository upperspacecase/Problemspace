"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-card-bg border-b border-border-warm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-xl font-serif text-green-primary">
            Problem Board
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/submit"
            className="bg-green-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-light transition-colors"
          >
            Submit Problem
          </Link>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-border-warm animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/user/${user._id}`}
                className="text-sm text-earth-mid hover:text-green-primary transition-colors"
              >
                {user.displayName}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-earth-muted hover:text-earth-dark transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-earth-mid hover:text-green-primary transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
