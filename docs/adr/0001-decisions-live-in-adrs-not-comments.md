# 1. Decisions live in ADRs, not in code comments

Status: accepted, 2026-11-21

## Context

Comments drift from the code they describe, and nothing checks them. Most of
ours repeat what the code says, describe code that has since changed, or
excuse a workaround, which then gets copied because the comment makes it look
deliberate. The few that matter record a decision a reader could not guess
from the code.

## Decision

Code has no comments. Each comment is one of:

- **Tautology**: repeats the code. Delete it.
- **Stale**: describes code or behaviour that is gone. Delete it.
- **Excuse**: covers for a hack. Delete it and list the hack for a fix.
- **Decision record**: a non-obvious choice. Move it into an ADR here.

Comments that tools read (`biome-ignore`, `@ts-expect-error`, `/// <reference>`,
`@vite-ignore`, `#__PURE__`, `@jsxImportSource`, `@vitest-environment`) are
not prose and stay.

`pnpm lint:comments` (`lint/noComments.mts`) enforces this as a ratchet: no
file may have more comments than `lint/noComments.baseline.json` allows, and
the baseline only goes down. The `/delete-comment` skill walks through a
triage.

## Consequences

The reason for a non-obvious line sits in `docs/adr`, not next to the line.
Each ADR names the files it covers, so search for the file path to find it.
Prefer making the code say it (a name, a type, a test) over writing an ADR.
