"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "Explore Problems" },
  { href: "/", label: "For Solvers" },
  { href: "/", label: "For Companies" },
  { href: "/", label: "About" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
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
        <div className="md:hidden border-t border-border bg-bg-raised px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border pt-3 mt-3 flex flex-col gap-2">
            {loading ? null : user ? (
              <>
                <Link
                  href="/submit"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-sm px-5 py-2 text-center"
                >
                  + Problem
                </Link>
                <Link
                  href={`/user/${user._id}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
                >
                  {user.displayName}
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="text-sm text-text-tertiary hover:text-text-secondary transition-colors text-left py-1"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-2 text-sm font-medium text-text-primary border border-border-strong rounded-lg hover:bg-bg-hover transition-colors text-center"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-sm px-5 py-2 text-center"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
