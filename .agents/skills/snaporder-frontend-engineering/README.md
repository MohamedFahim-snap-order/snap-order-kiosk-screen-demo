# snaporder-frontend-engineering

Project-scoped Cursor skill for SnapOrder vendor-portal frontend work.

## Install / availability

Lives at `.agents/skills/snaporder-frontend-engineering/`. Cursor picks it up with other project skills.

## Measure token impact

```bash
python .agents/skills/snaporder-frontend-engineering/scripts/measure_prompt_tokens.py
```

## Structure

- `SKILL.md` — short always-on rules + when to load refs
- `references/` — architecture, design-system, forms, filters, routes, a11y, validation
- `evals/evals.json` — trigger/task eval prompts
