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
- `ResourceType`: `'frontend' | 'docs' | 'source-code' | 'github' | 'x' | 'other'`
- `FrontendSubtype`: `'official' | 'third-party' | 'self-hosted'`
- `ResourceEntry`: `{ url, type: ResourceType, label?, frontendSubtype?: FrontendSubtype }`
- `ApiUpdateEntityDescriptionRequest`: `{ section: 'admins' | 'dependencies' | 'funds', address, name?, description }`
- `ReviewConfig`: Full config including metadata, descriptions, resources, sections, and dataKeys

### API Endpoints

- `GET /api/projects/:project/review-config` — full config (returns `{ config, availableTemplates }`)
- `PUT /api/projects/:project/review-config` — full config save
- `PUT /api/projects/:project/review-config/entity` — partial update for a single admin/dependency/funds entry

### Resources

Protocol links (frontends, docs, GitHub, X, source code, other) stored as `resources: ResourceEntry[]`

- **Types**: `frontend` (with subtype: official/third-party/self-hosted), `docs`, `source-code`, `github`, `x`, `other`
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
- **Frontend subset**: `defiscan-frontend/scripts/compile-data.ts` uses a minimal subset of `CompiledReview` (not imported) for index aggregation — keep in sync when adding fields
