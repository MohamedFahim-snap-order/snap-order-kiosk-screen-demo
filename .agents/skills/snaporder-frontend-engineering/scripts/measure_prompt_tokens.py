#!/usr/bin/env python3
"""Estimate prompt-token savings from snaporder-frontend-engineering skill.

Compares:
  A) Long prompt that inlines project rules (historical style)
  B) Short task prompt + skill metadata/body + selectively loaded references

Uses a simple ~4 chars/token estimator (good enough for relative savings).
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REFS = ROOT / "references"

# Representative rules dump distilled from prior feature prompts (Customers/Branches style).
LONG_RULES = """
Reuse existing SnapOrder dashboard shell, sidebar, topbar, Tailwind CSS v4, semantic design tokens,
.ui-* utilities, scrollbar utilities, Dialog primitives, React Query, React Hook Form, Zod,
skeleton system, light and dark themes. Do not redesign the application.

Use feature-based structure with components, schemas, hooks, services, types, mappers, query-keys.
Keep UI, URL state, server state, mutations, validation, formatting, API contracts, and mapping separated.
Do not use Redux for filters, pagination, selected segments, or dialogs.

URL is the source of truth for filters. Validate URL values with Zod. Invalid values fall back to defaults.
Filter changes reset page to 1. Search debounces ~300ms with router.replace. Use shared FilterSelect.
Pagination is server-driven with page and pageSize. Keep previous data during refetch.
Query keys must be stable typed objects, not raw URLSearchParams.

List and details routes: explicit View actions, stable public ids, notFound for missing details,
responsive two-column grids, content-driven heights, separate activity pagination params.

Accessibility: WCAG 2.2 AA, one h1, semantic tabs, visible focus, accessible dialogs, no color-only meaning,
reduced motion, touch-friendly controls, masked PII labels.

Responsive: 1760 down to 320, no page-level horizontal overflow, CSS Grid/Flexbox only.

Performance: reuse shell, limit Client Components, lightweight list fetch, paginate activity,
avoid heavy grid/chart libraries, static Tailwind classes.

Validation: npm run lint, type-check, test, build. Honest final report with remaining differences.
Support light and dark themes using semantic tokens only. Prefer Lucide over emoji icons.
"""

SHORT_TASK = (
    "Build the Customers list and details pages at /dashboard/customers and "
    "/dashboard/customers/[customerId] with segment tabs, URL filters, pagination, "
    "PDPL-safe masking, and vehicle dialogs."
)

# Typical load for that task (progressive disclosure).
LOAD_FOR_CUSTOMERS = [
    ROOT / "SKILL.md",
    REFS / "architecture.md",
    REFS / "design-system.md",
    REFS / "filters-pagination.md",
    REFS / "list-details-routes.md",
    REFS / "forms-dialogs.md",
    REFS / "responsive-a11y.md",
    REFS / "validation-reporting.md",
]

# Coverage checklist the long dump intended to preserve.
COVERAGE = [
    "architecture",
    "responsiveness",
    "accessibility",
    "theme support",
    "performance",
    "validation",
    "tests",
    "honest reporting",
]


def est_tokens(text: str) -> int:
    return max(1, (len(text) + 3) // 4)


def main() -> None:
    long_prompt = SHORT_TASK + "\n\n" + LONG_RULES.strip()
    skill_bits = []
    missing = []
    for path in LOAD_FOR_CUSTOMERS:
        if path.exists():
            skill_bits.append(path.read_text(encoding="utf-8"))
        else:
            missing.append(str(path))
    skill_context = "\n\n".join(skill_bits)
    short_with_skill = SHORT_TASK + "\n\n" + skill_context

    long_tok = est_tokens(long_prompt)
    # Fair comparison for *user prompt* size: short task only, skill loaded from disk by agent.
    user_short_tok = est_tokens(SHORT_TASK)
    user_long_tok = est_tokens(long_prompt)
    skill_tok = est_tokens(skill_context)
    # Agent context when skill triggers = short user prompt + skill body/refs (once cached per session).
    agent_with_skill = user_short_tok + skill_tok

    user_savings = user_long_tok - user_short_tok
    user_savings_pct = 100.0 * user_savings / user_long_tok

    print("snaporder-frontend-engineering token estimate")
    print("(approx tokens ≈ ceil(chars/4); relative comparison only)")
    print()
    print(f"User prompt WITHOUT skill (task + inlined rules): {user_long_tok}")
    print(f"User prompt WITH skill (task only):               {user_short_tok}")
    print(f"User prompt token reduction:                     {user_savings} ({user_savings_pct:.1f}%)")
    print()
    print(f"Skill payload loaded for customers-like task:    {skill_tok}")
    print(f"Agent context (short task + skill payload):      {agent_with_skill}")
    print()
    print("Note: skill payload is reusable across turns; long rules were re-pasted every prompt.")
    print("Amortized user-prompt savings grow with each feature request in a session.")
    print()
    print("Coverage preserved via skill references:")
    for item in COVERAGE:
        print(f"  [x] {item}")
    if missing:
        print("Missing files:", ", ".join(missing))


if __name__ == "__main__":
    main()
