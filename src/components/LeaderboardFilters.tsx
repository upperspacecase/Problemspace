"use client";

interface FiltersProps {
  sort: string;
  category: string;
  hasSolutions: string;
  unsolved: string;
  onSortChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onHasSolutionsChange: (value: string) => void;
  onUnsolvedChange: (value: string) => void;
}

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "productivity", label: "Productivity" },
  { value: "environment", label: "Environment" },
  { value: "social", label: "Social" },
  { value: "housing", label: "Housing" },
  { value: "transport", label: "Transport" },
  { value: "food", label: "Food" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

const SORT_OPTIONS = [
  { value: "score", label: "Highest Demand" },
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
];

export default function LeaderboardFilters({
  sort,
  category,
  hasSolutions,
  unsolved,
  onSortChange,
  onCategoryChange,
  onHasSolutionsChange,
  onUnsolvedChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-card-bg border border-border-warm rounded-full px-4 py-2 text-sm text-earth-mid focus:outline-none focus:ring-2 focus:ring-green-primary/30"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-card-bg border border-border-warm rounded-full px-4 py-2 text-sm text-earth-mid focus:outline-none focus:ring-2 focus:ring-green-primary/30"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-earth-mid cursor-pointer">
        <input
          type="checkbox"
          checked={hasSolutions === "true"}
          onChange={(e) =>
            onHasSolutionsChange(e.target.checked ? "true" : "")
          }
          className="rounded border-border-warm text-green-primary focus:ring-green-primary/30"
        />
        Has solutions
      </label>

      <label className="flex items-center gap-2 text-sm text-earth-mid cursor-pointer">
        <input
          type="checkbox"
          checked={unsolved === "true"}
          onChange={(e) => onUnsolvedChange(e.target.checked ? "true" : "")}
          className="rounded border-border-warm text-green-primary focus:ring-green-primary/30"
        />
        Unsolved only
      </label>
    </div>
  );
}
