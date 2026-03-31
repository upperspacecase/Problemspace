"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const PLANS = [
  {
    id: "free",
    name: "Observer",
    price: "$0",
    period: "forever",
    description: "Browse and vote on problems.",
    features: [
      "Browse all problems",
      "Upvote problems",
      "Submit 2 problems / month",
      "Community rankings",
    ],
    cta: "Current plan",
    featured: false,
  },
  {
    id: "pro",
    name: "Builder",
    price: "$29",
    period: "/mo",
    description: "For indie hackers who ship.",
    features: [
      "Everything in Observer",
      "Unlimited problem submissions",
      "\"Would pay\" signals with price ranges",
      "Daily Reddit-sourced problems",
      "Email digest of top problems",
      "Submit solutions & track adoption",
      "Builder badge on profile",
    ],
    cta: "Start building",
    featured: true,
  },
  {
    id: "team",
    name: "Studio",
    price: "$79",
    period: "/mo",
    description: "For teams validating ideas.",
    features: [
      "Everything in Builder",
      "Up to 5 team members",
      "Private problem collections",
      "Export data (CSV, API access)",
      "Priority problem sourcing",
      "Weekly trend reports via email",
      "Dedicated support",
    ],
    cta: "Get started",
    featured: false,
  },
];

const YEARLY_DISCOUNT = 0.8; // 20% off

export default function PricingPage() {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);

  function formatPrice(price: string) {
    if (price === "$0") return "$0";
    const num = parseInt(price.replace("$", ""), 10);
    const adjusted = annual ? Math.round(num * YEARLY_DISCOUNT) : num;
    return `$${adjusted}`;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-mono text-accent tracking-wide uppercase mb-3">
          Pricing
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-text-primary mb-3">
          Find problems worth solving
        </h1>
        <p className="text-text-secondary text-[15px] max-w-lg mx-auto">
          Every plan includes access to the full problem board.
          Upgrade to submit more, get signals, and never miss a high-demand problem.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span
          className={`text-sm ${!annual ? "text-text-primary font-medium" : "text-text-tertiary"}`}
        >
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            annual ? "bg-accent" : "bg-border-strong"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              annual ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-sm ${annual ? "text-text-primary font-medium" : "text-text-tertiary"}`}
        >
          Yearly
        </span>
        {annual && (
          <span className="text-xs font-mono text-accent bg-accent-subtle px-2 py-0.5 rounded-full">
            save 20%
          </span>
        )}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl p-6 flex flex-col ${
              plan.featured
                ? "bg-white border-2 border-accent shadow-[0_0_0_1px_rgba(45,106,79,0.1),0_4px_24px_rgba(45,106,79,0.08)]"
                : "bg-white border border-border"
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-white text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
            )}

            <div className="mb-5">
              <h3 className="font-serif text-lg text-text-primary mb-1">
                {plan.name}
              </h3>
              <p className="text-xs text-text-tertiary mb-4">
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif text-text-primary">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-sm text-text-tertiary">
                  {plan.price === "$0" ? "" : annual ? "/mo, billed yearly" : plan.period}
                </span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <svg
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      plan.featured ? "text-accent" : "text-text-tertiary"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.id === "free" ? (
              <div className="text-center text-xs text-text-tertiary font-mono py-2.5">
                {user ? "Your current plan" : "Free forever"}
              </div>
            ) : (
              <Link
                href={user ? `/api/checkout?plan=${plan.id}&annual=${annual}` : "/signup"}
                className={`block text-center text-sm font-medium py-2.5 rounded-lg transition-all active:scale-[0.98] ${
                  plan.featured
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "bg-bg border border-border text-text-secondary hover:bg-bg-hover hover:text-text-primary hover:border-border-strong"
                }`}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* FAQ / trust signals */}
      <div className="mt-16 mb-8">
        <h2 className="font-serif text-xl text-text-primary text-center mb-8">
          Common questions
        </h2>
        <div className="space-y-6 max-w-lg mx-auto">
          <FaqItem
            q="What counts as a &ldquo;would pay&rdquo; signal?"
            a="When a user clicks &ldquo;I&rsquo;d pay for this&rdquo; on a problem, it registers as a pay signal. Builder and Studio plans let you also specify a price range, giving you real willingness-to-pay data before you write a line of code."
          />
          <FaqItem
            q="How does the Reddit problem finder work?"
            a="Every day, our bot scrapes 20+ subreddits for posts where real people describe real frustrations. An AI scores each one on &ldquo;would people pay?&rdquo; and &ldquo;fun to build&rdquo; — then posts the single best problem to the board."
          />
          <FaqItem
            q="Can I cancel anytime?"
            a="Yes. No lock-in, no questions. Cancel from your account page and you keep access through the end of your billing period."
          />
          <FaqItem
            q="Do you offer refunds?"
            a="Full refund within the first 14 days if it&rsquo;s not for you."
          />
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <span
          className="text-sm font-medium text-text-primary"
          dangerouslySetInnerHTML={{ __html: q }}
        />
        <svg
          className={`w-4 h-4 text-text-tertiary transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <p
          className="text-sm text-text-secondary mt-2 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: a }}
        />
      )}
    </div>
  );
}
