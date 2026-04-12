# DeFiDisco Development Guide

## L2BEAT Architecture Reference

### Core System Overview

**L2BEAT** is a TypeScript monorepo for analyzing Ethereum Layer 2 protocols. **DeFiDisco** is a fork enhanced for DeFi analysis.

**Key Packages:**

- **`discovery`**: Core contract analysis engine (keep unchanged)
- **`protocolbeat`**: React UI with Monaco editor
- **`l2b`**: CLI tool and API server
- **`config`**: Project configurations and results

**Commands:**

```bash
# Setup and run
pnpm install && pnpm build:dependencies
cd ~/defidisco/packages/config && l2b ui  # http://localhost:2021/ui

# Sync upstream
git fetch upstream && git merge upstream/main
```

### Discovery System

**Automated Analysis:** Discovery automatically analyzes any contract by:

- Calling all view/pure functions with 0 parameters
- Testing array functions with indices 0-4
- Detecting proxy patterns and relationships
- Applying templates for known contract types

**Template System:** Contracts matched by bytecode hash to templates in `packages/config/src/projects/_templates/`

**Handler System:** Custom handlers in `packages/discovery/src/discovery/handlers/user/` for specialized analysis

### Data Flow

1. **Config** (`config.jsonc`) → Discovery engine
2. **Analysis** → Results in `discovered.json`
3. **Backend** monitors changes → Frontend displays data

---

## DeFiDisco Architecture

### Minimal Integration Principle ⭐

**Core Philosophy**: Minimize modifications to original L2BEAT files to ensure easy upstream merges

### Code Organization

**DeFiDisco folders** (keep all our code here):

- `packages/protocolbeat/src/defidisco/` - All UI components, extensions, icons
- `packages/l2b/src/implementations/discovery-ui/defidisco/` - All backend modules
- `packages/discovery/src/discovery/handlers/defidisco/` - Discovery handlers

**Integration points** (minimal modifications only):

- `ValuesPanel.tsx` - Single `<ValuesPanelExtensions>` line
- `TerminalPanel.tsx` - Single `<TerminalExtensions>` line
- `main.ts` - API endpoint registrations (unavoidable)
- `api.ts` - DeFiDisco API functions (unavoidable)

### Repository Setup

- **Fork**: `~/defidisco/` (complete L2BEAT fork)
- **Why Fork**: Avoids dependency issues with unpublished internal packages
- **Benefits**: Full toolchain access, easy upstream sync

---

## Feature Index

Detailed documentation for each feature is in `docs/developers/features/`. Read the relevant doc when working on a specific feature.

**Data Pipeline**: See `docs/developers/architecture.md` § "Data Pipeline: From Discovery to Frontend" for the end-to-end transformation chain (5 stages) covering how admins, dependencies, and funds flow from source data through scoring, compilation, and into the frontend.

### Permissions — `docs/developers/features/permissions.md`
- AI-Based Permission Detection (GPT-4 / Claude, endpoint + prompt engineering)
- Interactive Permission Management (ValuesPanelExtensions, 4 attributes, delay field)
- Permissions Report Generation (terminal markdown table via SSE)
- AccessControl Role Support (OpenZeppelin handler, path expressions)
- Continuous Permission Monitoring (automated change detection, Discord alerts)
- Permission Overrides Data Structure (contract-grouped JSON, owner path syntax, resolution logic)
- Permission Scan Agent (`/scan-permissions` Claude Code skill — source code analysis for permissioned functions, owner path construction, verification against discovered data)
- Impact Analysis Agent (`/analyze-impact` Claude Code skill — traces storage writes through read sites to classify temporal fund impact: retroactive vs future-only)
- Add Mitigation Agent (`/add-mitigation` Claude Code skill — finds on-chain constraints in source code, builds structured mitigation entries in functions.json)
- Scoring Agent (`/score-contract` Claude Code skill — batch impact analysis + scoring + mitigation finding for all permissioned functions on a contract)

### Call Graph Analysis — `docs/developers/features/call-graph-analysis.md`
- Slither-based external call detection (SlithIR parsing, heuristic resolution engine)
- Enhanced Traversal (unified graph: call graph + permission edges, backward BFS for governance chains, forward BFS for capital analysis)
- Upgrade Function Detection (`isUpgradeFunction()` in `types.ts` — BFS seeding expands upgrade functions to all contract functions in both `traverseWithPaths` and `traverseForward`)
- Function Analysis (forward BFS for impact + dependency detection)
- Shared traversal helpers (`traverseWithPaths`, `findContractGraph`, `extractChainAddresses`)

### Scoring & Review — `docs/developers/features/scoring-and-review.md`
- ProjectAnalysis API (`/admins`, `/dependencies` endpoints — single source of truth for admin/dependency computation)
- Scoring UI (inventory sections, shared `scoringShared.tsx` module, capital display, enhanced graph capital analysis)
- Upgrade Function Capital (`isUpgrade` flag in data pipeline, UPGRADE badges in UI — upgrade functions seed BFS with all contract functions for full capital exposure)
- Review Builder (`review-config.json`, entity descriptions, templates)
- Resources (`resources.json` — wrapper object `{ resources, audits, linesOfCode? }` per project, auto-saves independently)
- Audits (`audits` array in `resources.json` — `AuditEntry[]` with `url`, `author`, `date`, `scope?`, `bounty?`; `bounty` = max bug bounty USD amount; separate from `ResourceEntry[]`)
- Lines of Code (`countLinesOfCode.ts` — declaration-level dedup of flattened Solidity files: parses `library`/`contract`/`abstract contract`/`interface` blocks with brace-depth tracking, dedupes by name across all `.flat/` files to handle inlined libraries. Skips external contracts, dedupes by `sourceHashes`. Auto-runs inside `reviewCompiler.compile()` and persisted to `resources.json.linesOfCode`; also exposed via "Count Lines of Code" button and `POST /api/projects/:project/count-lines-of-code`. Displayed in defiscan-frontend `CodeQualitySection` as "X,XXX LoC")
- Resource Gathering Agent (`/gather-resources` Claude Code skill — web search + verify for official links, licenses, socials, security audits, and bug bounty programs; `--audits-only` flag skips resource gathering and only discovers/saves audits using existing resources as starting points)
- Review Generation Agent (`/generate-review` Claude Code skill)
- Governance (`governance.json` — separate per-project file storing `GovernanceConfig`: framework, vote execution, voting unit, proposal requirements, voting process, proposal period + execution delay as `fieldRef`/`fixed`/`none` durations. `fieldRef` carries an optional `unit` (`seconds`|`blocks`|`minutes`|`hours`|`days`, default `seconds`; `blocks` = 12s Ethereum block time) so the compiler can convert raw on-chain values — required for Compound/OZ Governor `votingPeriod` which is in blocks. Auto-saves via its own `/api/projects/:project/governance` CRUD endpoints. Survives `/generate-review` wipes. Legacy fallback reads from `review-config.json.governance` and migrates on next write. Compiled into `compiled-review.json.governance` via `governanceCompiler.ts` with field refs resolved against `discovered.json` and unit converted via local `unitToSecondsFactor`. Editor `ReviewGovernanceEditor.tsx` exposes the unit dropdown and mirrors the same factor in its live preview. Rendered in defiscan-frontend's `GovernanceSection`)
- Governance Agent (`/generate-governance` Claude Code skill — research protocol governance, map periods/delays to on-chain numeric fields, **pick the right `unit` per fieldRef** (notably `"blocks"` for Compound/OZ Governor `votingPeriod`), write `governance.json`; never touches `review-config.json`)
- Review Compiler (`compiled-review.json` — thin assembly layer over ProjectAnalysis, template variable resolution, bulk compile-all endpoint, `adminTotals`/`dependencyTotals` for cross-entity deduplicated capital)
- Impact Cap (`impactCap` on mitigations — structured field reference or hardcoded USD, `ImpactCapUnit` scaling, `effectiveCapUsd` on reachable contracts, "$X Max Impact" badge display)
- Mitigations Display (badges in explorer tabs + report cards, key findings card, `deduplicateMitigations`)

### Infrastructure — `docs/developers/features/infrastructure.md`
- DeFiScan Panel (contract analysis dashboard)
- External Contract Attributes & Governance Tag (entity grouping, node coloring)
- Contract Tags data structure (`contract-tags.json`, cleanup rules)
- Funds Tracking (DeBank API, Morpho vault onchain positions, `funds-data.json`, aggregate funds via The Graph subgraphs)
- DeFiScan Frontend (static React app, Vercel deployment, shareable report view, TVS metric, mitigation badges in report cards)
  - Gallery Page (`/gallery` — card grid of all protocols with radar chart, filters, pagination, status badge)
  - Report Page redesign (outer frame sections for admins/deps/TVS/activity/governance, ShowMore opens modal with explorer tab content, empty states, hero with Active badge)
- Activity Feed (contract upgrade timeline from `$pastUpgrades`, third top-level view in defiscan-frontend; includes dependency contracts with orange "Dependency" badge + entity name via `isDependency`/`entity` fields on `UpgradeEvent`)
- Continuous Monitoring Service (GitHub Actions cron, discovery + diff + funds + compile)
- Discovery Agent (`/run-discovery` Claude Code skill — iterative contract discovery, external/governance/funds tagging, handler configuration, array overflow error fixing)
- Watch Field Pruning Agent (`/prune-watch-fields` Claude Code skill — classifies discovered fields as safe-to-ignore vs security-critical, updates `ignoreInWatchMode` in config.jsonc, also available as optional step in `/run-discovery`)

---

## Development Guidelines

### Minimal Integration Principle

**ALWAYS write new code in `/defidisco/` folders**

- UI components → `packages/protocolbeat/src/defidisco/`
- Backend modules → `packages/l2b/src/implementations/discovery-ui/defidisco/`
- Discovery handlers → `packages/discovery/src/discovery/handlers/defidisco/`

**Integration points should be minimal:**

- Single import + single component usage in UI files
- API functions in `api.ts` (unavoidable for frontend consumption)
- Endpoint registration in `main.ts` (unavoidable for routing)

### Development Patterns

**Handler Development:**

1. Create in `/defidisco/` folder, register in main `index.ts`
2. **Critical**: Run `pnpm run generate-schemas && pnpm build`
3. Handler config must wrap in `"handler"` object

**UI Development:**

1. Create extension components in `/defidisco/`
2. Use React Query with proper cache invalidation
3. Implement optimistic updates with error rollback

**Common Mistakes:**

- ❌ Writing DeFiDisco code in original L2BEAT files
- ❌ Not regenerating schemas after handler changes
- ❌ Mixing discovered data with user data
- ❌ Using non-existent hooks (check existing patterns in `/defidisco/` files)
- ❌ Address format mismatches (contracts use `eth:0x...`, tags use `0x...`)
- ❌ Using `??` instead of `!== undefined` for optional fields that can be explicitly cleared
- ❌ Forgetting to rebuild both `protocolbeat` AND `l2b` after backend changes
- ❌ Duplicating scoring utilities — use `scoringShared.tsx` (`OwnerSection`, capital display)
- ❌ Computing admin/dependency data in the compiler or frontend — change `ProjectAnalysis` instead
- ❌ Joining contract-tags client-side for isExternal/isGovernance — these are in the `/admins` response
- ❌ Adding a `governance` field to `ReviewConfig` — governance lives in its own `governance.json` with its own CRUD module (`governance.ts`), same pattern as `resources.json`. Keeps `/generate-review` from wiping authored governance.

**Proxy/Implementation Pattern:**

- Proxy contracts contain **both** proxy and implementation ABIs in their `contract.abis[]` array
- When rendering ABIs, each address gets a separate section (implementation functions shown under implementation address)
- Fields are stored on the **proxy contract**, not implementations
- Use `findContractForAddress()` helper in `FunctionFolder.tsx` - automatically resolves implementation addresses to their parent proxy
- Backend converts all `contract.values` to `contract.fields[]` array, so always use fields (no need for values fallback)

### Data Access Patterns

**API Access**: For new components, follow existing patterns:

- **Admins Data**: Use `useQuery` with `getAdmins(project)` or `getAdmins(project, contractAddress)` for per-contract filtering
- **Dependencies Data**: Use `useQuery` with `getDependencies(project)` or `getDependencies(project, contractAddress)` for per-contract filtering
- **Project Data**: Use `useQuery` with `getProject(project)` from `api.ts`
- **Contract Tags**: Use `useContractTags(project)` hook — note: `isExternal`/`isGovernance`/`entity` are already included in admin/dependency API responses, so new components rarely need this hook directly
- **Permission Overrides**: Use `useQuery` with `getPermissionOverrides(project)` directly (no hook exists)
- **Resources**: Use `useQuery` with `getResources(project)` — auto-saves on mutation via `updateResources()`, no panel Save button needed. Stored in `resources.json` (separate from review-config)
- **Audits**: Use `useQuery` with `getAudits(project)` — auto-saves on mutation via `updateAudits(project, audits[])`. Stored in same `resources.json` under `audits[]`, separate array from resources. `bounty` field (optional number) on an entry = max bug bounty USD (shown in defiscan-frontend Bug Bounty stat)
- **Lines of Code**: Stored as `linesOfCode?: number` in the same `resources.json` wrapper. No React Query hook — the value is produced automatically by `reviewCompiler.compile()` (inline step 4) and surfaced via `compiled-review.json.totals.linesOfCode`. Manual recount: `countLinesOfCode(project)` API function + "Count Lines of Code" button in TerminalExtensions. Backend helpers: `getLinesOfCode`/`updateLinesOfCode` in `resources.ts`. Never count raw flat file lines — always go through `countLinesOfCode.ts` so inlined-library duplication is removed.
- **Governance**: Use `useQuery` with `getGovernance(project)` — auto-saves on mutation via `updateGovernance(project, governance | null)`. Stored in `governance.json` (separate from review-config, survives `/generate-review` wipes). Pass `null` to delete the file. Never add governance to `ReviewConfig` — it's intentionally not on that type.
- **EOA Counting**: EOAs stored separately in `entry.eoas[]` array, not mixed with contracts

### Address Handling

**IMPORTANT**: Address format mismatches are a top source of bugs. Two separate `addressUtils.ts` files exist — use the right one for your context.

**Format rules**:
- All data files use chain-prefixed format: `eth:0xChecksummed` (also `arb1:`, `base:`, etc.)
- **Do NOT strip** the chain prefix unless specifically needed for display
- **NEVER** compare addresses with `===` directly — use the utilities below

**Frontend** (`packages/protocolbeat/src/apps/discovery/defidisco/addressUtils.ts`):
- `addressesEqual(a, b)` — case-insensitive comparison, handles mixed prefix formats
- `normalizeForLookup(address)` — ensures chain prefix + lowercase, use as map/object key
- `findByAddress(items, getAddress, target)` — find item in array by address field match
- `stripChainPrefix(address)` — for display only (removes `eth:` etc.)
- `ensureChainPrefix(address)` — add `eth:` if missing
- `shortenAddress(address)` — `"0x1234...abcd"` for display

**Backend** (`packages/l2b/src/implementations/discovery-ui/defidisco/addressUtils.ts`):
- `normalizeChainAddress(raw)` — canonical form: chain prefix + ERC-55 checksummed hex. Use at ingestion boundaries
- `addressesEqual(a, b)` — same as frontend but uses checksummed normalization
- `ensureChainPrefix(address)` — normalizes and adds prefix
- `buildAddressSet(addresses)` / `isInAddressSet(address, set)` — normalized Set for O(1) lookups
- `buildAddressMap(entries)` / `getFromAddressMap(map, address)` — normalized Map
- `getFromAddressRecord(record, address)` — lookup in `Record<string, T>` with normalization + legacy fallback scan

**Key difference**: Backend normalizes via ERC-55 checksumming (`EthereumAddress()`), frontend normalizes via `toLowerCase()`. Both handle mixed prefix/no-prefix inputs.

**When to use what**:
- Comparing two addresses → `addressesEqual()`
- Building a lookup structure → backend: `buildAddressSet`/`buildAddressMap`, frontend: `normalizeForLookup()` as key
- Looking up in a `Record<string, T>` from discovered.json → backend: `getFromAddressRecord()`
- Finding in an array → frontend: `findByAddress()`
- Storing/persisting addresses → always chain-prefixed + checksummed

### Key Data Structures

**Permission Overrides** (`permission-overrides.json`): Contract-grouped format with `contracts[address].functions[]`. Each function has `functionName`, `userClassification`, `checked`, `score` (`'unscored' | 'critical' | 'no-impact'`), `description`, `ownerDefinitions`, `delay`, `aiClassification`, `timestamp`. `'no-impact'` means the researcher confirmed the function has no fund impact — its capital is zeroed in analysis and scoring. Each mitigation in `mitigations[]` has a `type` (`'delay' | 'valueRange' | 'relativeValue' | 'other'`). The `'other'` type supports an optional `label?: string` (1-2 words) shown in badges instead of the truncated description — the full description appears on hover. Each mitigation can have `scopedTo?: { address: string, type: 'admin' | 'dependency' }` to limit it to a specific caller — mitigations without `scopedTo` are global. Each mitigation can have `impactCap?: { hardcodedUsd?: number, contractAddress?: string, fieldName?: string, unit?: ImpactCapUnit }` to bound the maximum potentially impacted TVL — resolved to `impactCapUsd?: number` by `getMitigationsForOwner()`. `ImpactCapUnit = 'raw' | '1e6' | '1e8' | '1e18' | 'bps' | 'percent'`. Capital analysis applies caps via `effectiveCapUsd` on reachable contracts. `deduplicateMitigations()` (in `shared.tsx`) collapses `'other'` mitigations with the same label into one badge when showing entity-level aggregates. Mitigation resolution is centralized in `projectAnalysis.ts` `getMitigationsForOwner()` — computes direct mitigations (filtered by owner) plus transitive mitigations (collected via forward BFS through call graph, including global and scoped mitigations from downstream functions). `reviewCompiler.ts` uses the result directly (`f.mitigations`), it does NOT compute mitigations. Full schema in `docs/developers/features/permissions.md`.

**Owner Path Format**: `<contractRef>.<valuePath>` where contractRef is `$self`, `@fieldName`, or `eth:0xAddress`. Examples:
- `{ "path": "$self.owner" }` - owner field in current contract
- `{ "path": "@governor.signers[0]" }` - follow governor field, get first signer
- `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE.members" }` - AccessControl role members

Full path reference with all examples in `docs/developers/features/permissions.md`.

**Contract Tags** (`contract-tags.json`): Array of `{ contractAddress, isExternal, isGovernance, entity, fetchBalances, fetchPositions, isToken, fetchAggregate, aggregateHandler, aggregateLabel, timestamp }`. Full schema in `docs/developers/features/infrastructure.md`.


### Panel Development

To add new panels:

1. Add panel ID to `PANEL_IDS` in `store.ts`
2. Register component in `PANELS` and `READONLY_PANELS` in `ProjectPage.tsx`
3. Create panel component in `/defidisco/` folder following existing patterns
4. Import and register in `ProjectPage.tsx` with single line addition

### File Structure

```
packages/
├── discovery/src/discovery/handlers/defidisco/
│   ├── WriteFunctionPermissionHandler.ts
│   ├── AddressMappingHandler.ts          # Maps addresses via method call against discovered.json candidates
│   └── EnumerableRolesHandler.ts         # Enumerates roles and their holders via RoleSet events
├── protocolbeat/src/defidisco/
│   ├── ValuesPanelExtensions.tsx
│   ├── TerminalExtensions.tsx
│   ├── DeFiScanPanel.tsx
│   ├── PermissionsDisplay.tsx
│   ├── FunctionFolder.tsx
│   ├── ExternalButton.tsx
│   ├── GovernanceButton.tsx            # Toggle governance tag in node controls
│   ├── GovernanceIndicator.tsx         # Inline governance label + toggle in Values panel
│   ├── V2ScoringSection.tsx          # Scoring entry point (fetches /admins + /dependencies)
│   ├── scoringShared.tsx             # Shared scoring utilities & components (DO NOT DUPLICATE)
│   ├── AdminsInventoryBreakdown.tsx  # Owners section (receives ApiAdminsResponse, imports from scoringShared)
│   ├── DependencyInventoryBreakdown.tsx  # Dependencies section (receives ApiDependenciesResponse + ApiAdminsResponse)
│   ├── FunctionBreakdown.tsx         # Functions section
│   ├── ReviewDescriptionsEditor.tsx  # Review descriptions editor (Descriptions tab)
│   ├── ReviewResourcesEditor.tsx    # Resources & audits editor (links, frontends, socials, security audits, bug bounties)
│   ├── ReviewGovernanceEditor.tsx   # Governance editor (framework, voting, durations with unit picker)
│   ├── ResourcesPanel.tsx          # Standalone Resources panel (wraps ReviewResourcesEditor)
│   ├── FundsTagsButton.tsx         # Funds fetching controls (balances, positions, token, aggregate)
│   ├── FundsSection.tsx            # Funds display in DeFiScan panel (tokens, aggregate, contracts)
│   ├── addressUtils.ts             # Frontend address utilities (stripChainPrefix, addressesEqual, normalizeForLookup, findByAddress)
│   ├── ownerResolution.ts          # Shared owner/field path resolution (UI + backend data access)
│   ├── functionNavigationStore.ts  # Zustand store for cross-panel function navigation (click-to-expand in Write Functions)
│   └── icons/
├── l2b/src/implementations/discovery-ui/defidisco/
│   ├── permissionOverrides.ts
│   ├── contractTags.ts
│   ├── projectAnalysis.ts            # Central computation class (getAdmins, getDependencies, getSummary, getMitigationsForOwner)
│   ├── reviewConfig.ts              # Review config CRUD
│   ├── resources.ts                  # Resources, audits & linesOfCode CRUD (resources.json wrapper format { resources, audits, linesOfCode? }, legacy bare-array fallback)
│   ├── countLinesOfCode.ts           
│   ├── governance.ts                 # Governance CRUD (governance.json, legacy fallback to review-config.json.governance + migration)
│   ├── governanceCompiler.ts         # Resolves GovernanceConfig → CompiledGovernance (field refs → seconds via discovered.json)
│   ├── reviewCompiler.ts            # Compiled review builder (thin layer over ProjectAnalysis)
│   ├── generatePermissionsReport.ts
│   ├── callGraph.ts                  # Slither-based external call detection
│   ├── callGraphHeuristics.ts        # Heuristic engine for variable-to-address resolution
│   ├── enhancedTraversal.ts          # Enhanced graph (call graph + permission edges), backward BFS governance chains
│   ├── capitalAnalysis.ts            # Capital computation via enhanced graph forward BFS
│   ├── functionAnalysis.ts           # Forward BFS impact & dependencies
│   ├── configSeverity.ts            # Auto-severity for mitigated fields in config.jsonc
│   └── addressUtils.ts              # Backend address utilities (stripChainPrefix, ensureChainPrefix, addressesEqual, isChainAddress)
├── defiscan-frontend/                # Standalone public review website
│   ├── scripts/compile-data.ts       # Build-time data aggregation
│   └── src/
│       ├── components/MitigationBadge.tsx  # Mitigation badge display (delay, valueRange, relativeValue, other — uses label for 'other' type if present)
│       ├── pages/gallery/GalleryPage.tsx   # Protocol gallery (/gallery — card grid, filters, radar, pagination, status badge)
│       ├── pages/review/views/ActivityView.tsx  # Activity feed (upgrade timeline, top-level view)
│       └── pages/review/views/explorer/shared.tsx  # Shared explorer tab components (SortHeader, MitigationsSummary, ExpandedAdminFunctions)
├── backend/src/modules/defi-update-monitor/defidisco/
│   ├── DefidiscoMonitorApplication.ts  # Monitor orchestrator
│   ├── monitorConfig.ts                # Standalone config
│   ├── FundsRefresher.ts               # Funds refresh wrapper
│   └── README.md                       # Monitor documentation
├── defiscan-endpoints/                # Standalone API service for funds data
│   └── src/services/aggregate/
│       ├── AggregateService.ts       # Handler dispatch + caching
│       └── handlers/                 # Per-protocol aggregate handlers
│           ├── uniswapV2Factory.ts   # The Graph subgraph (requires THEGRAPH_API_KEY)
│           └── frankencoinMintinghub.ts  # Frankencoin API (no key needed)
└── config/src/projects/compound-v3/
    ├── permission-overrides.json
    ├── resources.json                # Per-project resources, audits & LoC count ({ resources: ResourceEntry[], audits: AuditEntry[], linesOfCode?: number })
    ├── governance.json                # Per-project GovernanceConfig (separate from review-config so /generate-review doesn't wipe it)
    └── review-config.json            # Per-project review config
```

---

## Code Review Guidelines

### Formatting and Linting Rules

**CRITICAL: Reject PRs with formatting-only changes outside `/defidisco/` folders**

This repository is a fork of L2BEAT. To maintain easy upstream merges:

1. **DO NOT accept PRs that reformat L2BEAT code** - Changes to files outside `/defidisco/` folders should only contain functional changes, not formatting fixes
2. **Formatting is only allowed in DeFiDisco folders**:
   - `packages/protocolbeat/src/apps/discovery/defidisco/`
   - `packages/l2b/src/implementations/discovery-ui/defidisco/`
   - `packages/discovery/src/discovery/handlers/defidisco/`
3. **If a PR contains formatting changes to upstream files**, request that the author revert those changes before approval
4. Use the SKILL /lint to perform the right formatting.

### Documentation Requirements

**PRs that add or change features must include documentation updates:**

1. **CLAUDE.md** — Update the Feature Index if adding a new feature; update Development Guidelines if changing conventions or data access patterns
2. **`docs/developers/features/<relevant>.md`** — Update the relevant feature doc with new function names, file paths, data structures, or design decisions
3. **`docs/researchers/getting-started.md`** — If the feature affects the researcher workflow, add or update the relevant section
4. **`docs/developers/architecture.md`** — If the feature changes backend data flow or system architecture, update the relevant subsection
5. **Request changes** on PRs that introduce new features without corresponding documentation
