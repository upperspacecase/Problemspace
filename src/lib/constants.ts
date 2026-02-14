export const CATEGORIES = [
  { value: "dev-tools", label: "Dev Tools" },
  { value: "ai-ml", label: "AI / ML" },
  { value: "b2b-saas", label: "B2B SaaS" },
  { value: "creator-economy", label: "Creator Economy" },
  { value: "fintech", label: "Fintech" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "productivity", label: "Productivity" },
  { value: "climate", label: "Climate" },
  { value: "housing", label: "Housing" },
  { value: "transport", label: "Transport" },
  { value: "social", label: "Social" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "other", label: "Other" },
] as const;

export const CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);

export const VALID_CATEGORIES: string[] = CATEGORIES.map((c) => c.value);

export const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "prototype", label: "Prototype" },
  { value: "live", label: "Live" },
  { value: "mature", label: "Mature" },
] as const;

export const STAGE_MAP: Record<string, string> = Object.fromEntries(
  STAGES.map((s) => [s.value, s.label])
);

export const PRICE_RANGES = [
  "<$10/mo",
  "$10–50/mo",
  "$50–200/mo",
  "$200+/mo",
] as const;
