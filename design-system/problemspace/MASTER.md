# Design System — Problemspace

> **RULE:** When building a specific page, check `design-system/pages/[page-name].md` first.
> If that file exists, its rules **override** this Master file. Otherwise, follow these rules strictly.

---

**Project:** Problemspace
**Updated:** 2026-03-10
**Theme:** Dark mode only

---

## Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Headings | Space Grotesk | 500, 600, 700 | h1–h3, section titles, card titles |
| Body | DM Sans | 400, 500, 600 | Paragraphs, labels, buttons |
| Monospace | JetBrains Mono | 400, 500 | Numbers, scores, code, timestamps |

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Tailwind classes:**
- Headings: `font-heading` (Space Grotesk)
- Body: `font-sans` (DM Sans) — default, no class needed
- Numbers/scores: `font-num` (JetBrains Mono, tabular-nums)

**Rules:**
- Body text: 15px / line-height 1.6
- Headings: line-height 1.15, letter-spacing -0.02em
- Never use serif fonts — the brand is tech/modern
- All text uses `-webkit-font-smoothing: antialiased`

---

## Color Palette

### Backgrounds
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| bg | `#020617` | `bg-bg` / `bg-slate-950` | Page background |
| bg-raised | `#0F172A` | `bg-bg-raised` | Navbar, inputs, elevated surfaces |
| bg-hover | `#1E293B` | `bg-bg-hover` | Hover states on raised surfaces |
| bg-active | `#334155` | `bg-bg-active` | Active/pressed states |
| bg-card | `#0F172A` | `bg-bg-card` | Card backgrounds |

### Text
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| text-primary | `#F1F5F9` | `text-text-primary` | Headings, primary content |
| text-secondary | `#94A3B8` | `text-text-secondary` | Body text, descriptions |
| text-tertiary | `#64748B` | `text-text-tertiary` | Muted labels, timestamps |

### Borders
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| border | `#1E293B` | `border-border` | Default borders |
| border-strong | `#334155` | `border-border-strong` | Hover borders, emphasis |

### Accent
| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| accent | `#818CF8` | `text-accent` / `bg-accent` | Primary actions, links, CTA (indigo-400) |
| accent-hover | `#6366F1` | `bg-accent-hover` | Hover on accent elements (indigo-500) |
| accent-subtle | `rgba(129,140,248,0.1)` | `bg-accent-subtle` | Badge backgrounds |
| accent-dark | `#4F46E5` | — | Deep accent for emphasis (indigo-600) |

### Signal Colors (Demand)
| Token | Hex | Usage |
|-------|-----|-------|
| signal-pay | `#F59E0B` | "Would pay" indicators |
| signal-up | `#818CF8` | Upvote highlights |
| signal-alt | `#A78BFA` | Alternatives, secondary accent |

### Stage Colors
| Token | Hex | Usage |
|-------|-----|-------|
| stage-idea | `#6B7280` | Idea stage |
| stage-prototype | `#D97706` | Prototype stage |
| stage-live | `#059669` | Live stage |
| stage-mature | `#7C3AED` | Mature stage |

---

## Component Classes

Defined in `globals.css` under `@layer components`:

| Class | Usage |
|-------|-------|
| `.input-base` | All form inputs — bg-raised, border, rounded-lg, focus ring |
| `.btn-primary` | Primary CTA — bg-accent, white text, hover darken, active scale |
| `.btn-secondary` | Secondary actions — bg-raised, border, hover elevate |
| `.card` | Static cards — bg-card, border, rounded-xl, 200ms transition |
| `.card-hover` | Interactive cards — extends card with hover border + shadow + cursor |
| `.font-num` | Tabular numbers — JetBrains Mono, font-variant-numeric: tabular-nums |

---

## Spacing

Use Tailwind defaults. Key conventions:
- Card padding: `p-4` to `p-6`
- Section gaps: `gap-6` (card grids), `gap-3` (inline elements)
- Page max-width: `max-w-7xl` with `px-4 sm:px-6`
- Section vertical spacing: `mb-6` to `mb-12`

---

## Effects

| Effect | Usage | Implementation |
|--------|-------|----------------|
| Glow | Bottom CTA, featured elements | `.glow-accent` — box-shadow with accent/15 |
| Gradient text | Hero emphasis | `.text-gradient` — animated accent→purple shimmer |
| Pulse dot | Live indicators | `.pulse-dot` — opacity animation |
| Border beam | Hot cards, CTA | `<BorderBeam>` component — animated border trace |
| Ripple grid | Hero background | `<BackgroundCells>` — interactive cell grid |

---

## Anti-Patterns

- No emojis as icons (use SVG: Heroicons inline)
- No `font-serif` — removed from project
- No light mode — dark only
- No layout-shifting hovers (use color/opacity, not scale on cards)
- No missing `cursor-pointer` on interactive elements
- No transitions over 300ms for micro-interactions
- Respect `prefers-reduced-motion`

---

## Pre-Delivery Checklist

- [ ] All text uses correct font family (heading vs body vs mono)
- [ ] Colors from the palette above only — no arbitrary hex values
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with 200ms transitions
- [ ] Focus rings visible for keyboard navigation
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] `prefers-reduced-motion` respected for animations
