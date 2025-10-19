<!--
Sync Impact Report
- Version change: N/A → 1.0.0
- Modified principles:
  - PRINCIPLE_1_NAME → Simplicity Over Abstraction
  - PRINCIPLE_2_NAME → TypeScript + Biome Tooling
  - PRINCIPLE_3_NAME → Unit Tests with Mocha + Earl
  - PRINCIPLE_4_NAME → CLI‑Oriented Operations
  - PRINCIPLE_5_NAME → Scope Separation (Specs Own Domain Details)
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates; removed broken reference)
  - ✅ .specify/templates/spec-template.md (no change required)
  - ✅ .specify/templates/tasks-template.md (no change required)
  - N/A .specify/templates/commands/*.md (directory not present)
- Follow-up TODOs: None (RATIFICATION_DATE set as first adoption)
-->

# @l2beat/eventdb Constitution

## Core Principles

### Simplicity Over Abstraction
Keep the codebase minimal and straightforward. Prefer small, clear TypeScript
modules over layered abstractions or premature generalization. Public surfaces
MUST be as small as possible and justified by current needs.
Rationale: Simplicity reduces maintenance burden and regression risk.

### TypeScript + Biome Tooling
All code MUST be written in TypeScript and compile with `tsc -p
tsconfig.build.json`. Formatting and linting MUST pass using Biome via the
provided scripts: `npm run format` and `npm run lint`. Avoid introducing
additional formatters/linters unless a clear, documented need is approved.

### Unit Tests with Mocha + Earl
New or changed behavior MUST include unit tests runnable via `npm test`.
Tests use Mocha as the test runner with Earl for assertions. Test files SHOULD
follow the existing pattern and live under `src/**/*.test.ts` or
`test/**/*.test.ts` as configured by `.mocharc.json`.
Rationale: Fast unit tests protect against regressions.

### CLI‑Oriented Operations
Operational tasks MUST be exposed as CLI commands via `package.json` scripts
(e.g., `build`, `start`, `dev:serve`, `dev:sync`, `format`, `lint`, `test`,
`typecheck`, `clean`). Prefer simple Node/TypeScript entry points or Bash
scripts in `.specify/scripts/` when appropriate. Commands MUST be idempotent
where feasible.

### Scope Separation (Specs Own Domain Details)
This constitution defines process and engineering standards. Domain specifics—
including ClickHouse table schemas and RPC method details—BELONG in feature
specifications and tasks, not here.

## Project Scope & Technology

EventDB gathers historical and live events from EVM‑compatible chains and
stores them in ClickHouse for efficient HDD‑friendly storage and retrieval. It
exposes an Ethereum Node RPC‑compatible API for querying gathered events.

Technology in use (derived from repository):
- Language: TypeScript; compiled with `tsc` to `build/`.
- Dev/Test transpilation: `esbuild-register`.
- Formatting/Linting: Biome (`npm run format`, `npm run lint`).
- Testing: Mocha (+ Earl assertions) via `npm test`.

## Development Workflow

- Formatting/Linting: `npm run format`, `npm run lint` MUST pass before merge.
- Type checking and build: `npm run typecheck`, `npm run build` MUST pass.
- Testing: Add unit tests alongside changes; run `npm test` locally and in CI.
- CLI tasks: Expose operational tasks via `package.json` scripts; prefer simple
  commands that are easy to compose and document.

## Governance

- Authority: This constitution supersedes prior ad‑hoc practices for this
  project. All contributions MUST comply.
- PR Review: Reviewers verify formatting/linting, type checks, tests, and
  alignment with the core principles above.
- Amendments: Proposed via PR modifying this file with a clear rationale.
  - Versioning (semantic):
    - MAJOR: Backward‑incompatible governance/principle removals or redefinitions.
    - MINOR: New principle/section added or materially expanded guidance.
    - PATCH: Clarifications, wording, typo fixes, non‑semantic refinements.
  - Dates: Update Last Amended on every change; Ratified is the first adoption
    date for v1.0.0.
- Compliance Review: `format`, `lint`, `typecheck`, `build`, and `test` MUST be
  clean on PRs. New user‑facing operations SHOULD be added as npm scripts.

**Version**: 1.0.0 | **Ratified**: 2025-10-19 | **Last Amended**: 2025-10-19
