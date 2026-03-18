# Scoring & Review System

## V2 Scoring UI

**Scoring Dashboard**: V2 scoring breakdown in DeFiScan panel (`/defidisco/V2ScoringSection.tsx`)

- **Inventory Sections**: Contracts, Functions, Dependencies, Owners — each with inventory count and breakdown
- **Shared Scoring Module**: `/defidisco/scoringShared.tsx` — **single source of truth** for all scoring UI utilities and components
- **Admin Type Mapping** (`mapAdminType` in `v2Scoring.ts`): Maps raw types to user-facing types based on proxy info:
  - Zero address -> `Revoked`
  - Any type + `immutable` proxyType -> `Immutable`
  - `Untemplatized`/`Unknown` + non-immutable proxyType -> `Upgradeable`

### Shared Module (`scoringShared.tsx`) — DO NOT duplicate code from this file

- **Utility Functions**: `formatUsdValue`, `formatDelay`, `hasCapitalData`, `hasTokenValueData`, `isZeroAddress`, `getAdminTypeColor`, `getImpactColor`, `computeDeduplicatedCapital`
- **Display Components**: `TreeNode`, `FundsDisplay`, `TokenValueDisplay`, `FunctionCapitalBreakdown` — tree-structured capital breakdown
- **`OwnerSection`**: Shared component used by **both** Owners and Dependencies sections to render an owner/admin with admin type badges, proxy type tags, capital-at-risk, and expandable function list with capital breakdown trees

### Section Architecture

- **Owners** (`AdminsInventoryBreakdown.tsx`): Displays non-external permission owners
  - Filters out external owners (shown in Dependencies instead)
  - By default shows only "key owners": EOAs, EOAPermissioned, Multisigs, and governance-tagged contracts
  - "Show all contracts" checkbox reveals all other contract-type admins
  - Uses `OwnerSection` from `scoringShared.tsx`
- **Dependencies** (`DependencyInventoryBreakdown.tsx`): Displays call-graph dependencies + external owners
  - Regular dependencies: `DependencySection` (local component for call-graph entries)
  - External owners: extracted from admin breakdown via `isExternal` contract tag, rendered with `OwnerSection`
  - "Show immutable" toggle (default: **on**) — for external owners only
  - Receives `adminScore` prop from `V2ScoringSection` to access admin breakdown data

### Key Design Decisions

- External owners (`isExternal: true` in contract-tags) appear in Dependencies, not Owners
- Governance contracts (`isGovernance: true`) are treated as "key owners" alongside EOAs and Multisigs
- "Key owners" (shown by default): EOA, EOAPermissioned, Multisig, or governance-tagged contracts. All other contract types hidden unless "Show all contracts" is checked
- `OwnerSection` is shared to avoid duplicating admin type badges, proxy type tags, funds display, and capital breakdown logic

### Capital & Token Value Display

- Capital at risk (green, `text-green-400`) shows contract funds (balances + positions)
- Token value (yellow, `text-aux-yellow`) shows protocol token market cap, displayed separately
- Both computed in `capitalAnalysis.ts` via `getContractFunds()` and `getContractTokenValue()`
- Token market cap is pre-computed during funds fetching (stored in `funds-data.json` under `tokenInfo.tokenValue`)
- Header totals in Owners/Dependencies use `computeDeduplicatedCapital()` to avoid double-counting the same contract across multiple admins
- Functions with `score: 'no-impact'` are excluded from capital calculations: `functionIsNoImpact()` in `capitalAnalysis.ts` zeros out direct funds and skips the contract from admin-level totals

### Capital Analysis — Enhanced Graph Forward Traversal

`CapitalAnalysisCalculator` in `capitalAnalysis.ts` computes per-admin capital using the **enhanced graph** (call graph + permission edges) from `enhancedTraversal.ts`. This is the same unified graph used for backward governance chain resolution, but traversed **forward** to find all contracts reachable from an admin's functions.

**Why not call-graph-only?** Generic admin functions like Timelock's `queueTransaction`/`executeTransaction` take arbitrary calldata — Slither can't statically resolve their targets. Without permission edges, these functions show $0 reachable capital. The enhanced graph adds permission edges (e.g., Timelock → CometProxyAdmin.changeAdmin) so capital propagates transitively through the ownership chain.

**How it works:**
1. `v2Scoring.ts` builds the enhanced graph via `buildEnhancedGraph()` + `buildIndices()` (exported from `enhancedTraversal.ts`)
2. Passes the graph to `CapitalAnalysisCalculator` along with funds data, functions data, and a contract name map
3. For each admin function, `traverseForward()` does BFS through the enhanced graph's forward index:
   - **Call graph edges**: Follows edges where `sourceFunction` matches the current function
   - **Permission edges**: Follows all edges from the current contract (permission edges are contract-level, no `sourceFunction`)
4. Cycle detection via visited `(contract:function)` pairs (handles circular ownership like Governor ↔ Timelock)
5. Reachable contracts are checked for funds; `fundsAtRisk` is true only if at least one called function has an impact score

**Key files:**
- `capitalAnalysis.ts` — `CapitalAnalysisCalculator` with `traverseForward()` BFS
- `enhancedTraversal.ts` — exports `buildEnhancedGraph()`, `buildIndices()`, `EnhancedGraph`, `EnhancedEdge`
- `v2Scoring.ts` — builds the enhanced graph in `AdminInventoryModule.calculate()`

## Review Builder

**Unified review configuration**: Protocol metadata, descriptions, entity annotations, and section-based layout all stored in a single `review-config.json` file per project.

- **File**: `review-config.json` per project in `packages/config/src/projects/{project}/`
- **Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/reviewConfig.ts`
- **Templates**: `packages/protocolbeat/src/apps/discovery/defidisco/reviewBuilderTemplates.ts`
- **UI**: `ReviewBuilderPanel.tsx` (main panel), `ReviewDescriptionsEditor.tsx` (Descriptions tab), `ReviewResourcesEditor.tsx` (Resources section in Descriptions tab), `ReviewSectionEditor.tsx` (section tabs)
- **Frontend API**: `getReviewConfig()`, `updateReviewConfig()`, `updateReviewConfigEntity()` in `api.ts`

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
  "resources": [
    { "url": "https://app.example.com", "type": "frontend", "frontendSubtype": "official" },
    { "url": "https://docs.example.com", "type": "docs" }
  ],
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
- `ApiUpdateEntityDescriptionRequest`: `{ section: 'admins' | 'dependencies' | 'funds', address, name?, description }`
- `ReviewConfig`: Full config including metadata, descriptions, resources, sections, and dataKeys

### API Endpoints

- `GET /api/projects/:project/review-config` — full config (returns `{ config, availableTemplates }`)
- `PUT /api/projects/:project/review-config` — full config save
- `PUT /api/projects/:project/review-config/entity` — partial update for a single admin/dependency/funds entry

### Resources

Protocol links (frontends, docs, GitHub, X, source code, licenses, etc.) stored as `resources: ResourceEntry[]`

- **Types**: `frontend` (with subtype: official/third-party/self-hosted), `website`, `docs`, `source-code`, `github`, `x`, `license` (with `licenseScope`), `defiscan-v1`, `other`
- **Compiler**: Pass-through to `compiled-review.json` as `resources: CompiledResourceEntry[]`
- **Preservation**: The `/generate-review` skill extracts and restores resources automatically (not AI-generated)

### Design Decisions

- Single unified file (protocol metadata + descriptions + resources + sections + data keys)
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
- **Resource Preservation**: Extracts `resources` field before moving config aside, restores it after generation (resources are human-specified, not AI-generated)

### How It Works

1. Fetches pre-processed data from l2b API endpoints (v2-score, enhanced-traversal, funds-data, contract-tags, functions, project data)
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

**Compiles all project data into a self-contained review JSON**: Shared between l2b UI and the monitor.

- **Location**: `packages/l2b/src/implementations/discovery-ui/defidisco/reviewCompiler.ts`
- **API Endpoint**: `POST /api/projects/:project/compile-review` (in `main.ts`)
- **UI Button**: "Compile Review" in `TerminalExtensions.tsx`
- **Frontend API**: `compileReview()` in `api.ts`
- **Output**: `compiled-review.json` written to `packages/defiscan-frontend/public/data/<slug>/`
- **Guard Conditions**: Requires `review-config.json` and `call-graph-data.json`; skips if either is missing
- **Template Variables**: `{{variableName}}` resolved at compile time via `dataKeys` map
- **TypeScript interfaces**: `CompiledReview`, `CompiledAdmin`, `CompiledDependency`, `CompiledDependencyFunction`, `CompiledFundHolder`, `CompiledFunction`, `CompiledContract`
- **Dependency funds**: Each `CompiledDependency` includes `totalFundsAtRisk` and `totalTokenValueAtRisk` (pre-computed, deduplicated across functions). Each `CompiledDependencyFunction` includes `directFundsUsd`, `directTokenValueUsd`, and `reachableContracts[]` with per-contract funds. These are computed server-side in the compiler, not client-side.
- **Dependency type**: Each `CompiledDependency` has an optional `dependencyType?: 'callgraph' | 'write'` field indicating how it was detected. `'callgraph'` = found via code-level call graph traversal; `'write'` = external contract that owns/controls a permissioned function (detected from `ownerDefinitions`). See [Call Graph Analysis](call-graph-analysis.md#function-analysis-functionanalysists) for details.
- **Mitigations in compiled review**: Each `CompiledAdminFunction` and `CompiledDependencyFunction` includes an optional `mitigations?: Mitigation[]` field. The compiler populates this from `functions.json` via `getMitigationsForFunction()`, which builds a lookup map keyed by `normalizedAddress|functionName`. Mitigations defined in `functions.json` (see `permissions.md`) flow through to the frontend unchanged.
- **Frontend subset**: `defiscan-frontend/scripts/compile-data.ts` uses a minimal subset of `CompiledReview` (not imported) for index aggregation — keep in sync when adding fields

### Mitigations Display (defiscan-frontend)

Mitigations are displayed in the Explorer tabs (AdminsTab, DepsTab, GovernanceTab) and Report views (AdminCards, DependencyCards).

- **`MitigationBadge`** (`src/components/MitigationBadge.tsx`): Renders a single mitigation as a colored pill badge. Handles all `MitigationType` values: `delay` (cyan, shows formatted duration), `valueRange` (indigo, shows min/max), `relativeValue` (amber, shows max change %), `other` (gray, truncated description).
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
