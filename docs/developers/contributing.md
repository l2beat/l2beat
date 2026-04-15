# Contributing

## Minimal Integration Principle ⭐

**Core philosophy**: minimize modifications to original L2BEAT files so upstream merges stay painless.

### Where DeFiScan V2 code lives

Put all new code in a `/defidisco/` folder under the relevant package:

- `packages/protocolbeat/src/defidisco/` — UI components, extensions, icons
- `packages/l2b/src/implementations/discovery-ui/defidisco/` — backend modules
- `packages/discovery/src/discovery/handlers/defidisco/` — custom discovery handlers

### Integration points in upstream files

The following upstream files are the *only* places where DeFiScan V2 touches L2BEAT code, and the changes must stay minimal:

- `ValuesPanel.tsx` — single `<ValuesPanelExtensions>` line
- `TerminalPanel.tsx` — single `<TerminalExtensions>` line
- `main.ts` — API endpoint registrations (unavoidable for routing)
- `api.ts` — DeFiScan V2 API functions (unavoidable for frontend consumption)
- `DiscoveryApp.tsx` — single route entry per top-level DeFiScan page
- `HomePage.tsx` — entry buttons for top-level DeFiScan pages

## Code Review Guidelines

### Formatting and linting

**Reject PRs with formatting-only changes outside `/defidisco/` folders.** Changes to files outside DeFiScan V2 folders should only contain functional changes — never whitespace or import reordering. Use the project's lint tooling to format DeFiScan V2 files; leave upstream files untouched.

### Documentation

PRs that add or change features must include documentation updates. At a minimum:

- **`docs/developers/features/<relevant>.md`** — update the relevant feature doc with new data structures, endpoints, or behaviors
- **`docs/developers/architecture.md`** — update only if the change affects backend data flow or system architecture
- **`docs/researchers/getting-started.md`** — update only if the change affects the researcher workflow

Request changes on PRs that introduce user-visible features without corresponding documentation updates.
