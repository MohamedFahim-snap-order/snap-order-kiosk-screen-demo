const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const est = (t) => Math.ceil(t.length / 4);

const short =
  "Build the Customers list and details pages at /dashboard/customers and /dashboard/customers/[customerId] with segment tabs, URL filters, pagination, PDPL-safe masking, and vehicle dialogs.";

const longRules = `Reuse existing SnapOrder dashboard shell, sidebar, topbar, Tailwind CSS v4, semantic design tokens,
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
avoid heavy chart/grid libraries, static Tailwind classes.

Validation: npm run lint, type-check, test, build. Honest final report with remaining differences.
Support light and dark themes using semantic tokens only. Prefer Lucide over emoji icons.`;

const files = [
  "SKILL.md",
  "references/architecture.md",
  "references/design-system.md",
  "references/filters-pagination.md",
  "references/list-details-routes.md",
  "references/forms-dialogs.md",
  "references/responsive-a11y.md",
  "references/validation-reporting.md",
];

const skill = files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n\n");
const longPrompt = `${short}\n\n${longRules}`;

const userLong = est(longPrompt);
const userShort = est(short);
const skillTok = est(skill);
const skillMdOnly = est(fs.readFileSync(path.join(root, "SKILL.md"), "utf8"));

// Filters-only progressive load
const filtersLoad = [
  "SKILL.md",
  "references/architecture.md",
  "references/filters-pagination.md",
  "references/validation-reporting.md",
]
  .map((f) => fs.readFileSync(path.join(root, f), "utf8"))
  .join("\n\n");

// Approximate a fuller historical paste (Customers-style acceptance + architecture dump)
const fatHistorical = short + "\n\n" + longRules.repeat(4);

console.log(
  JSON.stringify(
    {
      estimator: "chars/4",
      skillMdLines: fs.readFileSync(path.join(root, "SKILL.md"), "utf8").split(/\n/).length,
      userPrompt: {
        withoutSkillCondensedRules: userLong,
        withoutSkillFatHistoricalApprox: est(fatHistorical),
        withSkillTaskOnly: userShort,
        reductionVsCondensedPercent: Number(((1 - userShort / userLong) * 100).toFixed(1)),
        reductionVsFatPercent: Number(((1 - userShort / est(fatHistorical)) * 100).toFixed(1)),
      },
      agentSkillPayload: {
        skillMdOnly: skillMdOnly,
        filtersTaskRefs: est(filtersLoad),
        customersLikeAllRefs: skillTok,
      },
      notes: [
        "User prompt shrinks dramatically because rules stop being re-pasted.",
        "Skill refs are denser/more complete than a condensed paste; use progressive disclosure.",
        "Across a session, skill load amortizes; repeated long dumps do not.",
      ],
    },
    null,
    2,
  ),
);
