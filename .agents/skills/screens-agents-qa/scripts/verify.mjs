#!/usr/bin/env node
/**
 * Screens & Agents feature verifier.
 * Exit 0 = all checks passed. Exit 1 = failures printed.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const skillDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(skillDir, "../../../..");

const requiredFiles = [
  "src/app/dashboard/screens-agents/page.tsx",
  "src/app/dashboard/screens-agents/loading.tsx",
  "src/app/dashboard/screens-agents/error.tsx",
  "src/app/dashboard/screens-agents/screens/[screenId]/page.tsx",
  "src/app/dashboard/screens-agents/agents/[agentId]/page.tsx",
  "src/features/administration/screens-agents/components/ScreensAgentsPageView.tsx",
  "src/features/administration/screens-agents/components/ScreensTable.tsx",
  "src/features/administration/screens-agents/components/AgentsTable.tsx",
  "src/features/administration/screens-agents/components/ScreenDetailsPageClient.tsx",
  "src/features/administration/screens-agents/components/AgentDetailsPageClient.tsx",
  "src/features/administration/screens-agents/hooks/useScreensAgents.ts",
  "src/features/administration/screens-agents/hooks/useScreensAgentsFilters.ts",
  "src/features/administration/screens-agents/services/screens-agents.service.ts",
  "src/features/administration/screens-agents/schemas/screens-agents-filters.schema.ts",
  "src/features/administration/screens-agents/schemas/screens-agents-filters.schema.test.ts",
  "src/features/dashboard/config/dashboard-navigation.ts",
];

const failures = [];

console.log("Screens & Agents QA");
console.log(`Root: ${root}`);

for (const rel of requiredFiles) {
  const abs = path.join(root, rel);
  if (!existsSync(abs)) {
    failures.push(`Missing file: ${rel}`);
  }
}

function run(label, command, args) {
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    failures.push(`${label} failed (exit ${result.status ?? "null"})`);
  }
}

run(
  "vitest screens-agents",
  "npx",
  ["vitest", "run", "src/features/administration/screens-agents"],
);
run("type-check", "npx", ["tsc", "--noEmit", "-p", "tsconfig.json"]);
run(
  "eslint screens-agents",
  "npx",
  [
    "eslint",
    "src/features/administration/screens-agents",
    "src/app/dashboard/screens-agents",
  ],
);

const navPath = path.join(
  root,
  "src/features/dashboard/config/dashboard-navigation.ts",
);
if (existsSync(navPath)) {
  const { readFileSync } = await import("node:fs");
  const nav = readFileSync(navPath, "utf8");
  if (nav.includes('"/dashboard/screens-agents"') && nav.includes("DASHBOARD_NAV_PLACEHOLDER_ROUTES")) {
    const placeholderBlock = nav.slice(
      nav.indexOf("DASHBOARD_NAV_PLACEHOLDER_ROUTES"),
      nav.indexOf("] as const;", nav.indexOf("DASHBOARD_NAV_PLACEHOLDER_ROUTES")) + 10,
    );
    if (placeholderBlock.includes('"/dashboard/screens-agents"')) {
      failures.push(
        "Route still listed in DASHBOARD_NAV_PLACEHOLDER_ROUTES — remove placeholder entry.",
      );
    }
  }
}

console.log("\n---");
if (failures.length > 0) {
  console.error("FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("PASS — screens-agents structure, tests, type-check, lint OK");
process.exit(0);
