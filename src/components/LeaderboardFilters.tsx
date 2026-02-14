"use client";

import { CATEGORIES } from "@/lib/constants";

interface FiltersProps {
  sort: string;
  category: string;
  unsolved: string;
  onSortChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onUnsolvedChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: "score", label: "Top" },
  { value: "newest", label: "New" },
  { value: "trending", label: "Rising" },
];

export default function LeaderboardFilters({
  sort,
  category,
  unsolved,
  onSortChange,
  onCategoryChange,
  onUnsolvedChange,
}: FiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center bg-bg-raised rounded-lg p-0.5">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              sort === opt.value
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-bg-raised border-0 rounded-lg px-3 py-1.5 text-xs text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onUnsolvedChange(unsolved === "true" ? "" : "true")}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
          unsolved === "true"
            ? "bg-accent text-white"
            : "bg-bg-raised text-text-tertiary hover:text-text-secondary"
        }`}
      >
        Open only
      </button>
    </div>
  );
}
