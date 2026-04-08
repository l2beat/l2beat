# Scoring & Review System

## ProjectAnalysis API

**Central computation class**: `ProjectAnalysis` in `projectAnalysis.ts` is the single backend authority for admin and dependency analysis. All consumers — the protocolbeat UI, FunctionFolder, and the review compiler — use this class (via HTTP endpoints or direct call).

See [Architecture: Stage 1](../architecture.md#stage-1-projectanalysis) for the full computation pipeline and API reference.

### HTTP Endpoints

| Endpoint | Response Type | Primary Consumers |
|----------|--------------|-------------------|
| `GET /admins` | `ApiAdminsResponse` | V2ScoringSection, FunctionFolder, ReviewCompiler |
| `GET /admins?contract=X` | `ApiAdminsResponse` (filtered) | FunctionFolder |
| `GET /dependencies` | `ApiDependenciesResponse` | V2ScoringSection, FunctionFolder, ReviewCompiler |
| `GET /dependencies?contract=X` | `ApiDependenciesResponse` (filtered) | FunctionFolder |

### Key Types

```typescript
// --- Admins ---
interface ApiAdminsResponse {
  totals: { adminCount: number; totalCapitalAtRisk: number; totalTokenValueAtRisk: number }
  admins: AdminEntry[]
}

interface AdminEntry {
  address: string;  name: string;  type: ApiAddressType
  isExternal: boolean;  isGovernance: boolean;  entity: string | null
  functions: AdminFunctionEntry[]
  totalDirectCapital: number;  totalDirectTokenValue: number
  totalReachableCapital: number;  totalReachableTokenValue: number
  uniqueContractsAffected: number
}

interface AdminFunctionEntry {
  contractAddress: string;  contractName: string;  functionName: string
  impact: Impact;  mitigations?: Mitigation[]
  chains: CollapsedChain[]           // Pre-collapsed ownership chains (backward BFS)
  directFundsUsd: number;  directTokenValueUsd: number
  reachableContracts: ReachableContract[]
  totalReachableFundsUsd: number;  totalReachableTokenValueUsd: number
  unresolvedCallsCount: number
}

interface CollapsedChain { steps: CollapsedChainStep[]; hasPublicFunction: boolean }
interface CollapsedChainStep {
  contractAddress: string;  contractName: string;  contractType: ApiAddressType
  edgeType: 'permission' | 'callgraph';  functionNames: string[]
}

// --- Dependencies ---
interface ApiDependenciesResponse {
  totals: { dependencyCount: number }
  dependencies: DependencyEntry[]
}

interface DependencyEntry {
  address: string;  name: string;  entity: string | null
  isAutoDetected: boolean;  dependencyType: 'callgraph' | 'write' | undefined
  viewOnlyPath: boolean;  calledFunctions: string[]
  functions: DependencyFunctionEntry[]
  totalFundsAtRisk: number;  totalTokenValueAtRisk: number
}

interface DependencyFunctionEntry {
  contractAddress: string;  contractName: string;  functionName: string
  impact: Impact;  viewOnlyPath: boolean;  calledFunctions: string[]
  mitigations?: Mitigation[]
  directFundsUsd: number;  directTokenValueUsd: number
  reachableContracts: ReachableContract[]
}
```

Types are defined in `projectAnalysis.ts` (backend) and mirrored in `packages/protocolbeat/src/api/types.ts` (frontend).

### Design Principles

1. **Single source of truth**: All admin/dependency computation happens in `ProjectAnalysis`. If data needs to change, change it there — not in the compiler or frontend.
2. **Per-contract filtering via query param**: The backend builds the full graph (fast, sub-second) but filters the response. Same code path for project-wide and per-contract queries.
3. **Pre-collapsed chains**: Ownership chains are collapsed server-side (chains with identical contract sequences merged, function names grouped per step). The frontend renders them directly.
4. **Contract-tags enrichment is server-side**: `isExternal`, `isGovernance`, and `entity` are pre-resolved — consumers don't need to join contract-tags data themselves.

### Admin Type Mapping

`mapAdminType()` in `projectAnalysis.ts` maps raw discovery types to user-facing types:
- Zero address → `Revoked`
- Any type + `immutable` proxyType → `Immutable`
- `Untemplatized`/`Unknown` + non-immutable proxyType → `Upgradeable`

## Scoring UI

**Scoring Dashboard**: Inventory breakdown in DeFiScan panel (`/defidisco/V2ScoringSection.tsx`)

- **Entry point**: `V2ScoringSection.tsx` fetches `getAdmins(project)` and `getDependencies(project)` via React Query
- **Inventory Sections**: Contracts, Functions, Dependencies, Owners — each with inventory count and breakdown
- **Shared Scoring Module**: `/defidisco/scoringShared.tsx` — **single source of truth** for all scoring UI utilities and components

### Shared Module (`scoringShared.tsx`) — DO NOT duplicate code from this file

- **Utility Functions**: `formatUsdValue`, `formatDelay`, `hasCapitalData`, `hasTokenValueData`, `isZeroAddress`, `getAdminTypeColor`, `getImpactColor`, `computeDeduplicatedCapital`
- **Display Components**: `TreeNode`, `FundsDisplay`, `TokenValueDisplay`, `FunctionCapitalBreakdown` — tree-structured capital breakdown
- **`OwnerSection`**: Shared component used by **both** Owners and Dependencies sections to render an owner/admin with admin type badges, proxy type tags, capital-at-risk, and expandable function list with capital breakdown trees
- **Type consumption**: Components consume `AdminEntry` and `AdminFunctionEntry` directly from the API response — no intermediate scoring types

### Section Architecture

- **Owners** (`AdminsInventoryBreakdown.tsx`): Receives `adminsData: ApiAdminsResponse` prop
  - Filters out external owners (shown in Dependencies instead) via `admin.isExternal`
  - By default shows only "key owners": EOAs, EOAPermissioned, Multisigs, and governance-tagged contracts
  - "Show all contracts" checkbox reveals all other contract-type admins
  - Uses `OwnerSection` from `scoringShared.tsx`
- **Dependencies** (`DependencyInventoryBreakdown.tsx`): Receives `depsData: ApiDependenciesResponse` and `adminsData: ApiAdminsResponse` props
  - Regular dependencies: `DependencySection` (local component for call-graph entries)
  - External owners: extracted from `adminsData.admins` where `admin.isExternal === true`, rendered with `OwnerSection`
  - "Show immutable" toggle (default: **on**) — for external owners only

### Key Design Decisions

- External owners (`isExternal: true`) appear in Dependencies, not Owners — the API provides this flag directly
- Governance contracts (`isGovernance: true`) are treated as "key owners" alongside EOAs and Multisigs
- "Key owners" (shown by default): EOA, EOAPermissioned, Multisig, or governance-tagged contracts. All other contract types hidden unless "Show all contracts" is checked
- `OwnerSection` is shared to avoid duplicating admin type badges, proxy type tags, funds display, and capital breakdown logic

### Capital & Token Value Display

- Capital at risk (green, `text-green-400`) shows contract funds (balances + positions)
- Token value (yellow, `text-aux-yellow`) shows protocol token market cap, displayed separately
- Both computed server-side in `capitalAnalysis.ts` via `getContractFunds()` and `getContractTokenValue()`
- Token market cap is pre-computed during funds fetching (stored in `funds-data.json` under `tokenInfo.tokenValue`)
- Header totals in Owners/Dependencies use `computeDeduplicatedCapital()` to avoid double-counting the same contract across multiple admins
- Functions with `score: 'no-impact'` are excluded from capital calculations: `functionIsNoImpact()` in `capitalAnalysis.ts` zeros out direct funds and skips the contract from admin-level totals

### Capital Analysis — Enhanced Graph Forward Traversal

`CapitalAnalysisCalculator` in `capitalAnalysis.ts` computes per-admin capital using the **enhanced graph** (call graph + permission edges) from `enhancedTraversal.ts`. This is the same unified graph used for backward governance chain resolution, but traversed **forward** to find all contracts reachable from an admin's functions.

**Why not call-graph-only?** Generic admin functions like Timelock's `queueTransaction`/`executeTransaction` take arbitrary calldata — Slither can't statically resolve their targets. Without permission edges, these functions show $0 reachable capital. The enhanced graph adds permission edges (e.g., Timelock → CometProxyAdmin.changeAdmin) so capital propagates transitively through the ownership chain.

**How it works:**
1. `ProjectAnalysis` builds the enhanced graph via `buildEnhancedGraph()` + `buildIndices()` (exported from `enhancedTraversal.ts`)
2. Passes the graph to `CapitalAnalysisCalculator` along with funds data, functions data, and a contract name map
3. For each admin function, `traverseForward()` does BFS through the enhanced graph's forward index:
   - **Call graph edges**: Follows edges where `sourceFunction` matches the current function
   - **Permission edges**: Follows all edges from the current contract (permission edges are contract-level, no `sourceFunction`)
4. Cycle detection via visited `(contract:function)` pairs (handles circular ownership like Governor ↔ Timelock)
5. Reachable contracts are checked for funds; `fundsAtRisk` is true only if at least one called function has an impact score

**Key files:**
- `capitalAnalysis.ts` — `CapitalAnalysisCalculator` with `traverseForward()` BFS
- `enhancedTraversal.ts` — exports `buildEnhancedGraph()`, `buildIndices()`, `EnhancedGraph`, `EnhancedEdge`
- `projectAnalysis.ts` — builds the enhanced graph and orchestrates capital analysis

### Upgrade Function Detection

Upgrade functions (`upgradeTo`, `upgradeToAndCall`, `proxy__upgradeTo`, `proxy__upgradeToAndCall`, `upgradeBeacon`) replace the entire contract implementation, granting the caller arbitrary control over all funds and call paths. Standard BFS only follows edges from the specific function being analyzed, but an upgrade means **every** function in the contract becomes reachable.

**Detection**: `isUpgradeFunction(functionName)` exported from `types.ts`, checks against the `UPGRADE_FUNCTION_NAMES` set.

**BFS seeding**: When `traverseForward()` in `capitalAnalysis.ts` starts from an upgrade function, it seeds the BFS queue with ALL source functions from the contract's enhanced graph edges (not just the upgrade function). This correctly models that a new implementation can execute any code path. The same pattern applies in `traverseWithPaths()` in `callGraph.ts` for function-level analysis.

**`isUpgrade` flag in the data pipeline**: Set on `FunctionCapitalAnalysis` in `capitalAnalysis.ts`, propagated through `AdminFunctionEntry` in `projectAnalysis.ts`, `CompiledAdminFunction` in `reviewCompiler.ts`, and the corresponding frontend types.

**UI indicators**: Both protocolbeat (`scoringShared.tsx`) and defiscan-frontend (`shared.tsx`) display an "UPGRADE" badge next to upgrade function names in admin function listings.

## Review Builder

**Unified review configuration**: Protocol metadata, descriptions, entity annotations, and section-based layout all stored in a single `review-config.json` file per project.

- **File**: `review-config.json` per project in `packages/config/src/projects/{project}/`
- **Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/reviewConfig.ts`
- **Templates**: `packages/protocolbeat/src/apps/discovery/defidisco/reviewBuilderTemplates.ts`
- **UI**: `ReviewBuilderPanel.tsx` (main panel), `ReviewDescriptionsEditor.tsx` (Descriptions tab), `ReviewResourcesEditor.tsx` (self-contained Resources section with auto-save), `ReviewSectionEditor.tsx` (section tabs)
- **Frontend API**: `getReviewConfig()`, `updateReviewConfig()`, `updateReviewConfigEntity()`, `getResources()`, `updateResources()` in `api.ts`

### Data Structure (`review-config.json`)

```json
{
  "version": "1.0",
  "lastModified": "2026-02-18T10:30:00.000Z",
  "protocolSlug": "liquity-v2",
  "protocolName": "Liquity V2",
  "tokenName": "BOLD",
  "chain": "Ethereum",
  "projectType": "lending",
  "description": "Liquity V2 is an immutable borrowing protocol...",
  "admins": {
    "eth:0x1234...": {
      "name": "Core Team Multisig",
      "description": "A 3-of-5 Gnosis Safe multisig..."
    }
  },
  "dependencies": {
    "eth:0x5678...": {
      "name": "Chainlink ETH/USD Feed",
      "description": "Price feed used for collateral valuation."
    }
  },
  "funds": {
    "eth:0x9abc...": {
      "name": "Treasury",
      "description": "Main protocol treasury holding reserves."
    }
  },
  "sections": {
    "codeAndAudits": { "title": "Code & Audits", "subsections": [] }
  },
  "dataKeys": {}
}
```

### Key Types

- `ReviewProjectType`: `'stablecoin' | 'lending' | 'dex' | 'bridge' | 'derivatives' | 'yield' | 'liquid-staking' | 'cdp' | 'other'`
- `EntityDescription`: `{ name?, description }` — used for admins, dependencies, and funds
- `ResourceType`: `'frontend' | 'website' | 'docs' | 'source-code' | 'github' | 'x' | 'license' | 'defiscan-v1' | 'other'`
- `FrontendSubtype`: `'official' | 'third-party' | 'self-hosted'`
- `ResourceEntry`: `{ url, type: ResourceType, label?, frontendSubtype?: FrontendSubtype, licenseScope?: string }`
- `AuditEntry`: `{ url, author, date, scope?, bounty? }` — see [Audits & Bug Bounties](#audits--bug-bounties) below
- `ApiUpdateEntityDescriptionRequest`: `{ section: 'admins' | 'dependencies' | 'funds', address, name?, description }`
- `ReviewConfig`: Full config including metadata, descriptions, sections, and dataKeys

### API Endpoints

- `GET /api/projects/:project/review-config` — full config (returns `{ config, availableTemplates }`)
- `PUT /api/projects/:project/review-config` — full config save
- `PUT /api/projects/:project/review-config/entity` — partial update for a single admin/dependency/funds entry
- `GET /api/projects/:project/resources` — resources array (`ResourceEntry[]`)
- `PUT /api/projects/:project/resources` — resources save (auto-save from UI)
- `GET /api/projects/:project/audits` — audits array (`AuditEntry[]`)
- `PUT /api/projects/:project/audits` — audits save (auto-save from UI)

### Resources

Protocol links (frontends, docs, GitHub, X, source code, licenses, etc.) stored in `resources.json` per project, alongside the audits array.

- **File**: `resources.json` per project in `packages/config/src/projects/{project}/`
- **File format**: Wrapper object `{ resources: ResourceEntry[], audits: AuditEntry[] }`. Legacy bare `ResourceEntry[]` arrays are read transparently (audits default to `[]`) and migrated to wrapper format on first write.
- **Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/resources.ts` — exports `getResources`, `updateResources`, `getAudits`, `updateAudits`
- **Resource types**: `frontend` (with subtype: official/third-party/self-hosted), `website`, `docs`, `source-code`, `github`, `x`, `license` (with `licenseScope`), `defiscan-v1`, `other`
- **Compiler**: Resources passed through to `compiled-review.json` as `resources: CompiledResourceEntry[]`
- **Auto-save**: Each add/edit/delete triggers an immediate save (not tied to review config Save button)
- **Legacy fallback**: If `resources.json` doesn't exist, reads from `review-config.json` `resources` field; on first save, migrates to `resources.json` and strips from review-config
- **Gathering skill**: `/gather-resources <project> <url>` — Claude Code skill that web-searches for official resources (website, frontends, docs, GitHub, X, licenses, DeFiScan V1), verifies each URL, and saves via the resources API. Also discovers security audits and bug bounty programs (see below). Merges with existing entries (additive only). Defined in `.claude/skills/gather-resources/SKILL.md`.

### Audits & Bug Bounties

Security audit reports and bug bounty programs stored as a separate `AuditEntry[]` array inside `resources.json`.

- **Schema**: `AuditEntry { url: string, author: string, date: string, scope?: string, bounty?: number }`
  - `url`: Official link to the audit report PDF or page
  - `author`: Auditing firm name (e.g. `"Trail of Bits"`, `"OpenZeppelin"`)
  - `date`: Audit date in `"YYYY-MM"` or `"YYYY-MM-DD"` format
  - `scope`: Optional short description of what was audited (e.g. `"Core contracts"`, `"Staking module"`)
  - `bounty`: Max bug bounty payout in USD as a plain number (e.g. `500000` for $500K). When set and non-zero, this value is used for the Bug Bounty stat in the defiscan-frontend Source Code section.
- **Bug bounty entries**: Use `author` = hosting platform (e.g. `"Immunefi"`, `"HackerOne"`), `scope: "Bug Bounty Program"`, and set `bounty` to the maximum payout. These are always separate entries — never merge bounty info into an audit report entry.
- **Compiler**: Passed through to `compiled-review.json` as `audits: CompiledAuditEntry[]` (`CompiledAuditEntry = AuditEntry`)
- **Frontend display**: `CodeQualitySection.tsx` (labeled "Source Code") in defiscan-frontend shows the audit count in the "Audits & Bug Bounties" card, the max bounty amount in the "Bug Bounty" stat (`$500K`, `$1M` format), and a scrollable carousel of audit cards with author, date, and scope.
- **UI editor**: `ReviewResourcesEditor.tsx` renders a separate Audits section below the Resources list with the same add/edit/delete pattern (author, date, scope, bounty, URL fields).
- **Gathering skill**: `/gather-resources <project> --audits-only` — skips resource discovery and only searches for audits + bug bounty programs, using the existing website/GitHub/docs URLs from `resources.json` as starting points.

### Design Decisions

- Single unified file for review config (protocol metadata + descriptions + sections + data keys)
- Resources stored separately in `resources.json` (independent lifecycle from review config, not affected by `/generate-review`)
- Three curated entity description records: `admins`, `dependencies`, `funds` — each keyed by address
- Resources are a flat array (not address-keyed) — researcher-specified links to external URLs
- Only `codeAndAudits` in sections (collaterals/dependencies/actors data comes from DeFiScan panel)
- `name` field overrides auto-resolved discovery names for display
- Templates provide starting configs per project type
- Complements V2 scoring data — frontend joins on address to show descriptions alongside scoring/capital data

## Review Generation Agent

**AI-powered review writer**: Claude Code skill that generates professional review text from pre-processed analysis data.

- **Skill**: `/generate-review <project-name>`
- **File**: `.claude/skills/generate-review/SKILL.md`
- **Prerequisites**: l2b UI server running at `localhost:2021` (`cd packages/config && l2b ui`)
- **Behavior**: Always replaces the entire review — every run generates fresh content
- **Isolation**: Moves existing `review-config.json` aside before generation to prevent bias from prior output
- **Resources unaffected**: Resources live in a separate `resources.json` file, so regeneration doesn't touch them

### How It Works

1. Fetches pre-processed data from l2b API endpoints (admins, dependencies, enhanced-traversal, funds-data, contract-tags, functions, project data)
2. Preprocesses large responses into compact summaries (python3 scripts); includes contract `description` fields from config for context
3. Analyzes protocol structure, admin hierarchy, dependencies, and fund distribution
4. Generates professional descriptions following built-in writing guidelines (neutral tone, data-driven, no marketing copy, no hardcoded USD values)
5. Writes result directly to `packages/config/src/projects/{project}/review-config.json`

### What It Generates

- `description`: Protocol overview (2-4 sentences)
- `admins`: Per-admin human-readable name (e.g., "Team 3/5 Multisig") + description of what they control
- `dependencies`: Per-dependency name + description of how it's used
- `funds`: Per-fund-holding contract name + description of what tokens it holds
- `sections.codeAndAudits`: Contract listing (dataTable block) + audits placeholder

## Review Compiler

**Thin assembly layer**: Calls `ProjectAnalysis` internally, then overlays human-written descriptions, funds data, and activity feeds to produce a self-contained review JSON. Shared between l2b UI and the monitor.

- **Location**: `packages/l2b/src/implementations/discovery-ui/defidisco/reviewCompiler.ts`
- **API Endpoint**: `POST /api/projects/:project/compile-review` (in `main.ts`)
- **UI Button**: "Compile Review" in `TerminalExtensions.tsx`
- **Bulk Endpoint**: `POST /api/compile-all-reviews` — compiles all DeFi projects at once (used by HomePage button)
- **Frontend API**: `compileReview()`, `compileAllReviews()` in `api.ts`
- **Output**: `compiled-review.json` written to `packages/defiscan-frontend/public/data/<slug>/`
- **Guard Conditions**: Requires `review-config.json` and `call-graph-data.json`; skips if either is missing
- **Template Variables**: `{{variableName}}` resolved at compile time via `dataKeys` map
- **Data source**: Instantiates `ProjectAnalysis` and calls `getAdmins()` + `getDependencies()` directly (same process, no HTTP). If admin/dependency data needs to change, modify `ProjectAnalysis`, not the compiler.
- **TypeScript interfaces**: `CompiledReview`, `CompiledAdmin`, `CompiledDependency`, `CompiledDependencyFunction`, `CompiledFundHolder`, `CompiledFunction`, `CompiledContract`, `CompiledResourceEntry`, `CompiledAuditEntry`
- **Dependency funds**: Each `CompiledDependency` includes `totalFundsAtRisk` and `totalTokenValueAtRisk` (pre-computed by ProjectAnalysis, deduplicated *within* that dependency's functions). Each `CompiledDependencyFunction` includes `directFundsUsd`, `directTokenValueUsd`, and `reachableContracts[]` with per-contract funds.
- **Cross-admin/dependency deduplicated totals** (`adminTotals`, `dependencyTotals`): Each contract is counted once (max value) across all admins or dependencies. Computed by `ProjectAnalysis.computeAdminTotals()` / `computeDependencyTotals()` and forwarded by the compiler as `adminTotals: { totalFundsAtRisk, totalTokenValueAtRisk }` and `dependencyTotals: { totalFundsAtRisk, totalTokenValueAtRisk }`. The frontend uses these for the "Impacted TVS" stat (capped at 100% via `impactPct()` in `_shared.tsx`), with fallback to raw sums for old compiled reviews.
- **Entity-level deduplication** (`dependencyEntityGroups`): The compiler groups deps by entity and deduplicates contracts within each group (using `Math.max` when a contract appears in multiple deps' `reachableContracts`). Used by the frontend for per-entity bar chart values and sorting.
- **Dependency type**: Each `CompiledDependency` has an optional `dependencyType?: 'callgraph' | 'write'` field indicating how it was detected. `'callgraph'` = found via code-level call graph traversal; `'write'` = external contract that owns/controls a permissioned function (detected from `ownerDefinitions`). See [Call Graph Analysis](call-graph-analysis.md#function-analysis-functionanalysists) for details.
- **Mitigations in compiled review**: Each `CompiledAdminFunction` and `CompiledDependencyFunction` includes an optional `mitigations?: Mitigation[]` field. Mitigations are computed by `ProjectAnalysis.getMitigationsForOwner()` which merges direct mitigations (from `functions.json`, filtered per owner) with transitive mitigations (collected via forward BFS through the call graph — global and scoped mitigations from downstream functions). The compiler passes these through as-is (`f.mitigations`). Each mitigation with an `impactCap` has its `impactCapUsd` resolved during `getMitigationsForOwner()` (not in the compiler).
- **Impact cap on reachable contracts**: Each `CompiledReachableContract` includes `effectiveCapUsd?: number`. Set during capital analysis BFS (for admins) and inline cap resolution (for dependencies) in `projectAnalysis.ts`. Frontend fund sums apply `Math.min(fundsUsd, effectiveCapUsd)` per reachable contract (`shared.tsx`, `dependencies.ts`, `narrative.ts`).
- **Frontend subset**: `defiscan-frontend/scripts/compile-data.ts` uses a minimal subset of `CompiledReview` (not imported) for index aggregation — keep in sync when adding fields

### Mitigations Display (defiscan-frontend)

Mitigations are displayed in the Explorer tabs (AdminsTab, DepsTab, GovernanceTab) and Report views (AdminCards, DependencyCards).

- **`MitigationBadge`** (`src/components/MitigationBadge.tsx`): Renders a single mitigation as a colored pill badge. Handles all `MitigationType` values: `delay` (cyan, shows formatted duration), `valueRange` (indigo, shows min/max), `relativeValue` (amber, shows max change %), `other` (gray, truncated description). Also renders **impact cap badges** (emerald) when `impactCapUsd` is set — displays as "$XM Max Impact" using `formatCapUsd()` helper.
- **`MitigationsSummary`** (`src/pages/review/views/explorer/shared.tsx`): Responsive overflow component for table cells. Collects mitigations from an entity's functions, deduplicates them, measures available width via `ResizeObserver`, and shows as many badges as fit with a `+N` overflow indicator. Note: uses `td.closest('td')` for measurement — only works inside `<table>` cells, not reusable in report card buttons.
- **Report card inline badges** (`AdminCards.tsx`, `DependencyCards.tsx`): Admin and dependency card rows render deduplicated mitigation badges inline after the entity name using an IIFE that collects mitigations from all functions, deduplicates via `deduplicateMitigations()`, and maps to `MitigationBadge` components. This is separate from `MitigationsSummary` because report cards use `<button>` elements, not table cells.
- **Shared explorer components** (`shared.tsx`): Also exports `SortHeader`, `ExpandedAdminFunctions`, `AdminFunctionTable`, and `deduplicateMitigations` — used by AdminsTab, DepsTab, GovernanceTab, and report card components to avoid duplication.

### Key Findings — Mitigations

The `getKeyFindings()` function in `src/utils/narrative.ts` generates a mitigations key finding (type: `info`, blue card) when mitigations exist on any admin or dependency function:

- **Coverage**: Counts fund-impacting permissioned functions (admin + dependency functions with `directFundsUsd > 0` or risky reachable contracts) vs those with mitigations. Reports "All" or "Some" coverage
- **Types**: Lists distinct mitigation type labels: Timelocks, Value Ranges, Relative Value Caps, Other Constraints
- **Visibility**: Only shown when at least one mitigation exists across all functions

### Key Findings — TVS (Total Value Secured)

The TVS key finding replaces the former TVL-only finding. Title shows the combined TVS amount (e.g., "$220M TVS"). Detail text explains the breakdown:
- Both TVL + token: "Total Value Secured by the protocol: $X in TVL (tokens held in contracts) and $Y in protocol token market cap."
- TVL only: "Total Value Locked in protocol contracts."
- Token only: "Protocol token market cap."

TVS = `totalCapitalAtRisk + (totalTokenValue ?? totalTokenValueAtRisk)` from review totals.
