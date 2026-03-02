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

## DeFiDisco Features

### AI-Based Permission Detection ✅

**Manual Detection System**: AI-powered permission analysis with UI button

- **File**: `/defidisco/aiPermissionDetection.ts` - OpenAI (GPT-4) and Claude (Sonnet 3.5) support
- **UI**: "AI Permissions" button in `ValuesPanel.tsx` (once per contract, disabled if permissions exist)
- **Config**: `.env` file with `AI_PROVIDER` (openai/claude) and `AI_API_KEY`
- **Endpoint**: `POST /api/projects/:project/ai-detect-permissions/:address`
- **Features**:
  - Analyzes contract source code to identify permissioned functions
  - Maps functions to correct addresses (proxy vs implementation via .p.sol naming)
  - Validates against ABI to filter hallucinated functions
  - Saves to `permission-overrides.json` with `aiClassification` field (not currently used in UI)
- **Prompt Engineering**: Instructs AI to identify owners with `sourceField` (e.g., "owner", "accessControl") and `dataPath` (e.g., "$self", "DEFAULT_ADMIN_ROLE")

### Interactive Permission Management ✅

**UI System**: Complete permission management in `/defidisco/ValuesPanelExtensions.tsx`

- **Data Structure**: Contract-grouped permissions for O(1) lookups (`contracts[address].functions[]`)
- **Data Separation**: Discovered permissions vs user overrides (persistent)
- **Four Attributes**: Checked (✓), Permission (🔒), Risk Score (⚡), Delay (⏱️)
- **Features**: Expandable functions, code navigation, owner tracking, delay field specification
- **Performance**: File caching, optimistic updates, debounced inputs, efficient contract-specific queries

**Delay Field Feature**: Associate delays with permissioned functions

- **UI**: Select contract + numeric field to specify delay reference
- **Backend**: Resolves delay value from discovered.json in real-time
- **Display**: Clock icon (`IconClock.tsx`) always visible in collapsed view, color-coded: green (>= 7d), yellow (>= 1d), red (< 1d), gray (no delay). Uses `formatDelay()` from `scoringShared.tsx` for human-readable units (e.g., `7d`, `2h`, `45s`)
- **Storage**: Delay reference stored in `permission-overrides.json` as `{ contractAddress, fieldName }`

### Permissions Report Generation ✅

**Terminal Integration**: Button in `/defidisco/TerminalExtensions.tsx`

- Generates markdown table from contract-grouped `permission-overrides.json`
- Maps addresses to contract names, resolves owner definitions
- Server-Sent Events API for real-time output
- Efficiently processes contract-grouped data structure

### DeFiScan Panel ✅

**Overview Panel**: Contract analysis dashboard in `/defidisco/DeFiScanPanel.tsx`

- **Status Section**: Initial vs discovered contract counts, address type breakdown
- **Contract Types**: Contracts, EOAs, Multisigs, External addresses
- **Permissions Dashboard**: Shows permissioned functions count and review progress
- **Data Sources**: Uses `getProject`, `useContractTags`, and `getPermissionOverrides` APIs
- **Integration**: Registered in `ProjectPage.tsx` and `store.ts` following panel patterns

### External Contract Attributes ✅

**Contract Tagging Enhancement**: Extended contract tags with entity grouping

- **Data Structure**: `contract-tags.json` stores `entity` (string, e.g. "Chainlink", "Uniswap") to group external contracts by provider
- **UI Component**: `/defidisco/ExternalButton.tsx` with entity selector popup; `/defidisco/EntitySelector.tsx` (shared reusable component)
- **Features**:
  - Mark contracts as external/internal
  - Entity selector (dropdown of existing entities + "+" to create new) — spelling-safe
- **Hook**: `useProjectEntities(project)` in `useContractTags.ts` extracts unique entity names from project tags
- **Backend**: `/defidisco/contractTags.ts` preserves attributes across updates; entity accepts `null` to clear
- **Address Format**: Normalizes `eth:0x...` → `0x...` when comparing with tags

### Governance Contract Tag ✅

**Binary tag**: `isGovernance` in `contract-tags.json`, green in graph view

- **UI**: `GovernanceButton.tsx` (node controls toggle), `GovernanceIndicator.tsx` (Values panel label, rendered inside `ExternalIndicator.tsx`)
- **Node Coloring**: `useContractTagColor` hook in `useContractTags.ts` maps tags → color override. Priority: Unknown (red) > External (orange) > Governance (green) > Chain color
- **Admin Filtering**: "Key owners" (shown by default) = EOA, EOAPermissioned, Multisig, or governance-tagged. "Show all contracts" checkbox reveals the rest

### AccessControl Role Support ✅

**OpenZeppelin AccessControl Integration**: Full support for role-based access control

- **Handler**: Use `accessControl` handler in templates or config overrides
  ```jsonc
  "fields": {
    "accessControl": {
      "handler": { "type": "accessControl" }
    }
  }
  ```
- **Discovery**: Automatically detects roles from `RoleGranted`/`RoleRevoked` events
- **Data Structure**: Roles stored in `values.accessControl` with `adminRole` and `members[]`
- **Owner Tracking with Path Expressions**:
  - `$self.accessControl.ROLE_NAME.members` - Only the members array
  - `$self.accessControl.ROLE_NAME` - All addresses in the role (members + any address in adminRole field if it's an address)
  - `@fieldName.accessControl.ROLE_NAME.members` - Members in another contract
  - Example: `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE.members" }`
- **Cross-Contract**: Can reference AccessControl roles in external contracts via address fields
- **Resolution**: Works like any other path - navigates the data structure and recursively extracts all addresses
- **Display**: Shows all resolved addresses with click-to-select functionality

### Continuous Permission Monitoring ✅

**Automated Change Detection**: Monitors permission changes alongside discovery updates

- **Location**: `packages/backend/src/modules/update-monitor/defidisco/`
- **Trigger**: Automatically runs when discovery detects changes (`diff.length > 0`)
- **Components**:
  - **PermissionResolver**: Resolves owner paths and detects changes
  - **PermissionResolutionRepository**: Stores append-only resolution history
  - **UpdateNotifier.notifyPermissionChanges()**: Formats Discord alerts
- **Database Schema**:
  - `PermissionResolution` table: Stores resolution blobs with timestamp
  - `UpdateDiff.details` field: Stores permission change metadata (JSONB)
  - Migration: `20251202000000_add_permission_monitoring`
- **Change Detection**:
  - ✅ Detects added/removed owner addresses (resolved from paths)
  - ❌ Ignores config changes (manually marked as permissioned)
  - ❌ Ignores manual updates (scores, descriptions, checked status)
- **Discord Notifications**:
  - Sent to INTERNAL channel only
  - Shows added/removed owners with contract names
  - Groups resolution errors at end of message
  - Format: 🔒 **Permission Changes Detected: project-name**
- **Error Handling**: Resolution errors logged but don't stop processing
- **Performance**: Only re-resolves when discovery changes detected
- **Documentation**: See `packages/backend/src/modules/update-monitor/defidisco/README.md`

### Funds Tracking ✅

**Contract Funds Data**: Fetches and displays token balances and DeFi positions for contracts

- **Data Source**: Uses `defiscan-endpoints` service (calls DeBank API for balances/positions)
- **Storage**: `funds-data.json` per project in `packages/config/src/projects/{project}/`
- **UI Component**: `FundsSection.tsx` in DeFiScan panel (between V2 Scoring and Status of Review)
- **Control Button**: `FundsTagsButton.tsx` - toggle "Fetch Balances" / "Fetch Positions" per contract

**Enabling Funds Fetching**:

1. Select contract(s) in the graph view
2. Click "Funds" button in controls
3. Check "Fetch Token Balances" and/or "Fetch DeFi Positions"
4. In DeFiScan panel, click "Fetch Funds" button to retrieve data

**Contract Tags Extension**:

```json
{
  "contractAddress": "eth:0x...",
  "isExternal": true,
  "fetchBalances": true,
  "fetchPositions": false
}
```

**Funds Data Structure** (`funds-data.json`):

```json
{
  "version": "1.0",
  "lastModified": "2025-12-09T...",
  "contracts": {
    "eth:0x123...": {
      "balances": {
        "tokens": [{ "symbol": "ETH", "usdValue": 1000, ... }],
        "totalUsdValue": 5000,
        "timestamp": "...",
        "source": "debank"
      },
      "positions": {
        "protocols": [{ "name": "Aave", "totalUsdValue": 10000, ... }],
        "totalUsdValue": 10000,
        "timestamp": "...",
        "source": "debank"
      },
      "lastFetched": "2025-12-09T...",
      "error": null
    }
  }
}
```

**Running with Funds Support**:

```bash
# Option 1: Start defiscan-endpoints separately
cd ~/defidisco/packages/defiscan-endpoints && pnpm start
# In another terminal:
cd ~/defidisco/packages/config && l2b ui

# Option 2: Use startup script
cd ~/defidisco/packages/l2b && ./scripts/start-with-funds.sh
```

**Environment Configuration** (defiscan-endpoints/.env):

```bash
DEBANK_API_KEY=your-debank-api-key
PORT=3001
ETHEREUM_RPC_URL_FOR_DISCOVERY=https://your-rpc-url  # Optional: enables Morpho vault onchain positions
```

**Morpho Vault Onchain Positions**:

When `ETHEREUM_RPC_URL_FOR_DISCOVERY` is set, defiscan-endpoints detects Morpho vaults and fetches their positions directly onchain instead of from DeBank. This provides more accurate per-market breakdowns.

- **Detection**: Checks two MetaMorpho Factory contracts (`0x1897...`, `0xA9c3...`) via `isMetaMorpho(address)`. Results cached for 24h (immutable once deployed)
- **Position Fetching**: Reads vault's supply queue from onchain, then for each market queries Morpho Blue (`0xBBBB...`) for position/market data. Computes `suppliedAssets = supplyShares * totalSupplyAssets / totalSupplyShares`
- **Pricing**: Uses existing `BalanceService` to get Morpho Blue singleton's DeBank balances — standard cache applies, no extra API calls per vault
- **Output**: Formatted as `DebankComplexProtocol[]` for downstream compatibility. One portfolio_item per market with non-zero supply
- **Fallback**: On any RPC error, falls back to DeBank with a warning log. If RPC URL is not configured, logs a warning at startup and uses DeBank for everything
- **Files**:
  - `packages/defiscan-endpoints/src/clients/MorphoRpcClient.ts` — Ethers.js v5 RPC client for vault detection and position fetching
  - `packages/defiscan-endpoints/src/services/MorphoVaultService.ts` — Orchestrates detection, onchain fetch, pricing, and formatting
  - `packages/defiscan-endpoints/src/services/PositionService.ts` — Routes Morpho vaults (eth chain) to onchain path with try/catch fallback

**API Endpoints**:

- `GET /api/projects/:project/funds-data` - Get cached funds data
- `POST /api/projects/:project/funds-data/fetch` - Trigger fetch (SSE for progress)

**Files**:

- Backend: `packages/l2b/src/implementations/discovery-ui/defidisco/fundsData.ts`
- Frontend: `packages/protocolbeat/src/apps/discovery/defidisco/FundsSection.tsx`
- Control: `packages/protocolbeat/src/apps/discovery/defidisco/FundsTagsButton.tsx`

### Call Graph Analysis ✅

**External Call Detection**: Uses Slither to analyze which external contracts each function calls

- **Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/callGraph.ts`
- **Storage**: `call-graph-data.json` per project
- **Tool**: Slither's `--print slithir` command
- **Configuration**:
  - `SLITHER_VENV_PATH` env var (default: `~/.slither-venv/`)
  - `SLITHER_PATH` env var (default: `$SLITHER_VENV_PATH/bin/slither`)

**How It Works**:

1. Runs Slither on each non-external contract to get SlithIR output
2. Parses output into structured representation (contracts → functions → calls)
3. Starts from ABI functions only (public/external) to avoid library contamination
4. Follows `INTERNAL_CALL` and `LIBRARY_CALL` chains transitively
5. Collects `HIGH_LEVEL_CALL`s reachable from each public function
6. Resolves storage variables to addresses using `discovered.json`
7. Classifies calls as view/write using target ABI or caller inference

**Key Implementation Details**:

- **ABI-driven parsing**: Only captures calls from the target contract's public interface
- **Function overloading**: Merges calls from overloaded functions with same name
- **View inference**: If caller is view/pure, external call must also be view
- **Contract name matching**: Slithir uses `INFO:Printers:Contract X` or alternatives such as `Contract X` format for main contract
- **Deduplication**: Removes duplicate calls per caller function

**Data Structure** (`call-graph-data.json`):

```json
{
  "contracts": {
    "eth:0x...": {
      "externalCalls": [
        {
          "callerFunction": "deposit",
          "storageVariable": "token",
          "interfaceType": "IERC20",
          "calledFunction": "transferFrom",
          "resolvedAddress": "eth:0x...",
          "resolvedContractName": "USDC",
          "isViewCall": false,
          "callerIsView": false
        }
      ]
    }
  }
}
```

**Shared Traversal Helpers** (exported from `callGraph.ts`, used by `functionAnalysis.ts` and `v2Scoring.ts`):

- `traverseWithPaths(callGraphData, startContract, startFunction)` — BFS traversal with path tracking, returns reachable contracts + shortest paths
- `findContractGraph(callGraphData, contract)` — case-insensitive contract graph lookup
- `buildExternalAddressSet(tags)` / `buildTagsByAddress(tags)` — build lookup structures from contract tags
- `isExternalAddress(address, externalAddresses)` / `findTag(tagsByAddress, address)` — address matching with `eth:` prefix normalization
- `getCallGraphContractName(callGraphData, address)` — resolve contract name from call graph data

### Enhanced Traversal & Function Analysis ✅

**Owner chain traversal and per-function impact/dependency analysis using call graph + permission data**

| Endpoint | Backend | Purpose |
|---|---|---|
| `GET /api/projects/:project/enhanced-traversal` | `enhancedTraversal.ts` | Backward BFS → governance chain terminals (owners) for each permissioned function |
| `GET /api/projects/:project/function-analysis` | `functionAnalysis.ts` | Forward BFS → reachable contracts with funds (impact) + external dependencies |

**Enhanced Traversal** (`enhancedTraversal.ts`):
- Unified graph from call graph edges (caller→callee) + permission edges (owner→function)
- Backward BFS from each permissioned function, collapses chains into `CollapsedChainStep[]`
- Response: `ApiEnhancedTraversalResponse` — `contracts[address][functionName] → FunctionTraversalResult`

**Function Analysis** (`functionAnalysis.ts`):
- **Impact** (permissioned only): Forward BFS via call graph, filters contracts with funds. Includes `callPath: CallPathStep[]` (shortest path)
- **Dependencies** (all functions): Auto-detected external contracts (BFS + `isExternal` tag) merged with manual deps from `functions.json`. `isAutoDetected` flag distinguishes them
- Response: `ApiFunctionAnalysisResponse` — `contracts[address][functionName] → FunctionAnalysis`

**Key types** (in both backend and frontend `types.ts`):
- `FunctionTraversalResult`, `TraversalTerminal`, `OwnershipChainStep` — enhanced traversal
- `FunctionImpactEntry`, `FunctionDependencyEntry`, `FunctionAnalysis`, `CallPathStep` — function analysis

### V2 Scoring UI ✅

**Scoring Dashboard**: V2 scoring breakdown in DeFiScan panel (`/defidisco/V2ScoringSection.tsx`)

- **Inventory Sections**: Contracts, Functions, Dependencies, Owners — each with inventory count and breakdown
- **Shared Scoring Module**: `/defidisco/scoringShared.tsx` — **single source of truth** for all scoring UI utilities and components

**Shared Module (`scoringShared.tsx`)** — DO NOT duplicate code from this file:

- **Utility Functions**: `formatUsdValue`, `formatDelay`, `hasCapitalData`, `hasTokenValueData`, `isZeroAddress`, `getAdminTypeColor`, `getImpactColor`, `computeDeduplicatedCapital`
- **Display Components**: `TreeNode`, `FundsDisplay`, `TokenValueDisplay`, `FunctionCapitalBreakdown` — tree-structured capital breakdown
- **`OwnerSection`**: Shared component used by **both** Owners and Dependencies sections to render an owner/admin with admin type badges, proxy type tags, capital-at-risk, and expandable function list with capital breakdown trees

**Section Architecture**:

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

**Key Design Decisions**:

- External owners (`isExternal: true` in contract-tags) appear in Dependencies, not Owners
- Governance contracts (`isGovernance: true`) are treated as "key owners" alongside EOAs and Multisigs
- "Key owners" (shown by default): EOA, EOAPermissioned, Multisig, or governance-tagged contracts. All other contract types hidden unless "Show all contracts" is checked
- `OwnerSection` is shared to avoid duplicating admin type badges, proxy type tags, funds display, and capital breakdown logic

**Capital & Token Value Display**:

- Capital at risk (green, `text-green-400`) shows contract funds (balances + positions)
- Token value (yellow, `text-aux-yellow`) shows protocol token market cap, displayed separately
- Both computed in `capitalAnalysis.ts` via `getContractFunds()` and `getContractTokenValue()`
- Token market cap is pre-computed during funds fetching (stored in `funds-data.json` under `tokenInfo.tokenValue`)
- Header totals in Owners/Dependencies use `computeDeduplicatedCapital()` to avoid double-counting the same contract across multiple admins

### Review Builder ✅

**Unified review configuration**: Protocol metadata, descriptions, entity annotations, and section-based layout all stored in a single `review-config.json` file per project.

- **File**: `review-config.json` per project in `packages/config/src/projects/{project}/`
- **Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/reviewConfig.ts`
- **Templates**: `packages/protocolbeat/src/apps/discovery/defidisco/reviewBuilderTemplates.ts`
- **UI**: `ReviewBuilderPanel.tsx` (main panel), `ReviewDescriptionsEditor.tsx` (Descriptions tab), `ReviewSectionEditor.tsx` (section tabs)
- **Frontend API**: `getReviewConfig()`, `updateReviewConfig()`, `updateReviewConfigEntity()` in `api.ts`

**Data Structure** (`review-config.json`):

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

**Key Types**:
- `ReviewProjectType`: `'stablecoin' | 'lending' | 'dex' | 'bridge' | 'derivatives' | 'yield' | 'liquid-staking' | 'cdp' | 'other'`
- `EntityDescription`: `{ name?, description }` — used for admins, dependencies, and funds
- `ApiUpdateEntityDescriptionRequest`: `{ section: 'admins' | 'dependencies' | 'funds', address, name?, description }`
- `ReviewConfig`: Full config including metadata, descriptions, sections, and dataKeys

**API Endpoints**:
- `GET /api/projects/:project/review-config` — full config (returns `{ config, availableTemplates }`)
- `PUT /api/projects/:project/review-config` — full config save
- `PUT /api/projects/:project/review-config/entity` — partial update for a single admin/dependency/funds entry

**Design Decisions**:
- Single unified file (protocol metadata + descriptions + sections + data keys)
- Three curated entity description records: `admins`, `dependencies`, `funds` — each keyed by address
- Only `codeAndAudits` in sections (collaterals/dependencies/actors data comes from DeFiScan panel)
- `name` field overrides auto-resolved discovery names for display
- Templates provide starting configs per project type 
- Complements V2 scoring data — frontend joins on address to show descriptions alongside scoring/capital data

### Review Generation Agent ✅

**AI-powered review writer**: Claude Code skill that generates professional review text from pre-processed analysis data.

- **Skill**: `/generate-review <project-name>`
- **File**: `.claude/skills/generate-review/SKILL.md`
- **Prerequisites**: l2b UI server running at `localhost:2021` (`cd packages/config && l2b ui`)
- **Behavior**: Always replaces the entire review — every run generates fresh content

**How It Works**:
1. Fetches pre-processed data from l2b API endpoints (v2-score, enhanced-traversal, funds-data, contract-tags, functions, project data)
2. Preprocesses large responses into compact summaries (python3 scripts)
3. Analyzes protocol structure, admin hierarchy, dependencies, and fund distribution
4. Generates professional descriptions following built-in writing guidelines (neutral tone, data-driven, no marketing copy, no hardcoded USD values)
5. Writes result directly to `packages/config/src/projects/{project}/review-config.json`

**What It Generates**:
- `description`: Protocol overview (2-4 sentences)
- `admins`: Per-admin human-readable name (e.g., "Team 3/5 Multisig") + description of what they control
- `dependencies`: Per-dependency name + description of how it's used
- `funds`: Per-fund-holding contract name + description of what tokens it holds
- `sections.codeAndAudits`: Contract listing (dataTable block) + audits placeholder

### Continuous Monitoring Service ✅

**Automated change detection, funds refresh, and review compilation**: Runs daily at 8:00 CET via GitHub Actions cron.

- **Entry Point**: `packages/backend/src/defidisco-monitor.ts` — standalone process (not the full L2Beat backend)
- **Orchestrator**: `packages/backend/src/modules/defi-update-monitor/defidisco/DefidiscoMonitorApplication.ts`
- **Config**: `packages/backend/src/modules/defi-update-monitor/defidisco/monitorConfig.ts` — standalone config from env vars (does NOT use full `makeConfig()`)
- **Documentation**: `packages/backend/src/modules/defi-update-monitor/defidisco/README.md`
- **Scheduling**: GitHub Actions cron (`.github/workflows/monitor.yml`) — daily at 7:00 UTC / 8:00 CET + manual trigger
- **Dockerfile**: `Dockerfile.monitor` — multi-stage build, run in GH Actions with Docker layer caching
- **Database**: Neon free tier PostgreSQL (temporary)
- **Run Mode**: `RUN_ONCE=true` env var → `app.runOnce()` — single cycle then clean exit

**Monitoring Loop** (for each project in `defidisco-config.json`):
1. **Discovery**: `runner.run()` — contract analysis via Etherscan V2 API
2. **Diff**: `diffDiscovery(sanitize(prev), sanitize(curr))` — detect changes
3. **Notify**: Discord message if changes detected (via `UpdateNotifier`)
4. **Store**: Upsert discovery snapshot to PostgreSQL
5. **Funds Refresh**: `fetchAllFundsForProject()` via in-process defiscan-endpoints
6. **Compile**: `ReviewCompiler.compile()` — writes `compiled-review.json`
7. **Cycle Summary**: Discord message after all projects (project count, duration, change count)

**Key Files**:

| File | Purpose |
|------|---------|
| `defidisco-monitor.ts` | Process entry point |
| `monitorConfig.ts` | Standalone config from env vars |
| `DefidiscoMonitorApplication.ts` | Orchestrator — wires Clock, DiscoveryRunner, UpdateNotifier, FundsRefresher, ReviewCompiler |
| `FundsRefresher.ts` | Wraps `fetchAllFundsForProject` from l2b |
| `ReviewCompiler.ts` | Reads data files, computes V2 score, resolves templates, writes compiled JSON |

**Pre-Compilation Guards**: Before compiling, checks for required data files. If missing, skips silently (log only, no Discord noise):
- No `review-config.json` → skipped
- No `call-graph-data.json` → skipped
- Discovery + diff + funds refresh still run regardless

**Compiled Review** (`compiled-review.json`):
- Self-contained JSON per project — exact data a frontend needs to render a review page
- Joins V2 scoring data (contracts, functions, admins, dependencies, capital analysis) with descriptions from `review-config.json`
- Template variables (`{{variableName}}`) resolved at compile time via `dataKeys` map
- See `ReviewCompiler.ts` for TypeScript interfaces: `CompiledReview`, `CompiledAdmin`, `CompiledDependency`, `CompiledFundHolder`, `CompiledFunction`, `CompiledContract`

**Adding/Removing Projects**: Edit `packages/config/src/defidisco-config.json` and redeploy. The monitor reads the explicit list, not the `config.jsonc` `defidisco.scanPermissions` flag.

**What It Does NOT Do** (researcher actions):
- Re-run call graph analysis (Slither)
- Re-run permission detection (AI or manual)
- Modify permission overrides, function scores, or review descriptions
- Push compiled reviews to D1 (deferred to future task)

**Database**: Currently using **Neon free tier** PostgreSQL (temporary). The database stores discovery cache, update monitor snapshots, and diff history. No user credentials or sensitive data. See README.md for security considerations and migration recommendations.

**Environment Variables**: See `README.md` for full table. Key vars: `DATABASE_URL`, `DISCORD_TOKEN`, `DISCORD_CHANNEL_ID`, `ETHEREUM_RPC_URL_FOR_DISCOVERY`, `ETHERSCAN_API_KEY`, `DEBANK_API_KEY`.

**Import Paths**: The monitor runs compiled JS, so imports use build output paths (not TypeScript source paths):
- `@l2beat/defiscan-endpoints/build/...` (not `src/`)
- `@l2beat/l2b/dist/...` (not `src/`)

---

## Development Guidelines

### 🎯 Minimal Integration Principle

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

**Proxy/Implementation Pattern:**

- Proxy contracts contain **both** proxy and implementation ABIs in their `contract.abis[]` array
- When rendering ABIs, each address gets a separate section (implementation functions shown under implementation address)
- Fields are stored on the **proxy contract**, not implementations
- Use `findContractForAddress()` helper in `FunctionFolder.tsx` - automatically resolves implementation addresses to their parent proxy
- Backend converts all `contract.values` to `contract.fields[]` array, so always use fields (no need for values fallback)

### File Structure

```
packages/
├── discovery/src/discovery/handlers/defidisco/
│   └── WriteFunctionPermissionHandler.ts
├── protocolbeat/src/defidisco/
│   ├── ValuesPanelExtensions.tsx
│   ├── TerminalExtensions.tsx
│   ├── DeFiScanPanel.tsx
│   ├── PermissionsDisplay.tsx
│   ├── FunctionFolder.tsx
│   ├── ExternalButton.tsx
│   ├── GovernanceButton.tsx            # Toggle governance tag in node controls
│   ├── GovernanceIndicator.tsx         # Inline governance label + toggle in Values panel
│   ├── V2ScoringSection.tsx          # V2 scoring entry point
│   ├── scoringShared.tsx             # Shared scoring utilities & components (DO NOT DUPLICATE)
│   ├── AdminsInventoryBreakdown.tsx  # Owners section (imports from scoringShared)
│   ├── DependencyInventoryBreakdown.tsx  # Dependencies section (imports from scoringShared)
│   ├── FunctionBreakdown.tsx         # Functions section
│   ├── ReviewDescriptionsEditor.tsx  # Review descriptions editor (Descriptions tab)
│   └── icons/
├── l2b/src/implementations/discovery-ui/defidisco/
│   ├── permissionOverrides.ts
│   ├── contractTags.ts
│   ├── reviewConfig.ts              # Review config CRUD
│   ├── generatePermissionsReport.ts
│   ├── enhancedTraversal.ts          # Backward BFS governance chains
│   └── functionAnalysis.ts           # Forward BFS impact & dependencies
├── backend/src/modules/defi-update-monitor/defidisco/
│   ├── DefidiscoMonitorApplication.ts  # Monitor orchestrator
│   ├── monitorConfig.ts                # Standalone config
│   ├── FundsRefresher.ts               # Funds refresh wrapper
│   ├── ReviewCompiler.ts               # Compiled review builder
│   └── README.md                       # Monitor documentation
└── config/src/projects/compound-v3/
    ├── permission-overrides.json
    ├── review-config.json            # Per-project review config
    └── compiled-review.json          # Monitor output (auto-generated)
```

### Data Access Patterns

**API Access**: For new components, follow existing patterns:

- **Project Data**: Use `useQuery` with `getProject(project)` from `api.ts`
- **Contract Tags**: Use `useContractTags(project)` hook for external address marking
- **Permission Overrides**: Use `useQuery` with `getPermissionOverrides(project)` directly (no hook exists)
- **Address Format**:
  - **IMPORTANT**: Contract addresses use `eth:` prefix in ALL data files (functions.json, contract-tags.json, discovered.json)
  - When comparing addresses, keep the prefix: `address1.toLowerCase() === address2.toLowerCase()`
  - **Do NOT strip** the `eth:` prefix unless specifically needed for display purposes
  - Example: `eth:0x123...` should match `eth:0x123...` (both lowercase)
- **EOA Counting**: EOAs stored separately in `entry.eoas[]` array, not mixed with contracts

**Contract Tags Data Structure**:

```json
{
  "version": "1.0",
  "lastModified": "2025-09-30T19:47:51.353Z",
  "tags": [
    {
      "contractAddress": "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
      "isExternal": true,
      "isGovernance": true,
      "entity": "Chainlink",
      "timestamp": "2025-09-30T19:47:42.278Z"
    }
  ]
}
```

- **File Location**: `packages/config/src/projects/{project}/contract-tags.json`
- **Fields**: `isExternal` (boolean), `isGovernance` (boolean), `entity` (string, groups external contracts by provider)
- **Update Pattern**: Backend preserves existing attributes when updating individual fields
- **Cleanup**: When all boolean tag fields (`isExternal`, `isGovernance`, `fetchBalances`, `fetchPositions`, `isToken`) are false, the entry is removed from the file

### Permission Overrides Data Structure ✅

**Contract-Grouped Format**: Optimized for O(1) contract lookups and efficient data access

```json
{
  "version": "1.0",
  "lastModified": "2025-09-30T15:21:54.826Z",
  "contracts": {
    "eth:0x123...": {
      "functions": [
        {
          "functionName": "pause",
          "userClassification": "permissioned",
          "checked": true,
          "score": "critical",
          "description": "Emergency pause function",
          "ownerDefinitions": [
            {
              "path": "$self.$admin"
            }
          ],
          "delay": {
            "contractAddress": "eth:0x456...",
            "fieldName": "delay"
          },
          "aiClassification": "permissioned",
          "timestamp": "2025-09-30T15:21:54.826Z"
        }
      ]
    }
  }
}
```

**Owner Definitions**:

- **Unified Path Expression**: Single path string that navigates any data structure
- **Path Format**: `<contractRef>.<valuePath>`
  - `<contractRef>`: `$self` (current contract), `@fieldName` (follow address field), or `eth:0xAddress` (absolute)
  - `<valuePath>`: JSONPath-like navigation in contract.values
- **Path Syntax**:
  - Object keys: `field.subfield`
  - Array indices: `field[0]`
  - Dynamic keys: `field[eth:0x123]` or `field[ROLE_HASH]`
- **Examples**:
  - `{ "path": "$self.owner" }` - owner field in current contract
  - `{ "path": "$self.getOwner" }` - call getOwner() in current contract
  - `{ "path": "@governor.signers[0]" }` - follow governor field, get first signer
  - `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE.members" }` - AccessControl role members only
  - `{ "path": "$self.accessControl.DEFAULT_ADMIN_ROLE" }` - Entire role object structure preserved (shows admin + members)
  - `{ "path": "@kernel.accessControl.PAUSER_ROLE.members" }` - Role in external contract
  - `{ "path": "eth:0x123...acl.permissions[eth:0x456][ROLE].entities" }` - Complex ACL structure
  - `{ "path": "$self" }` - current contract itself is the owner
- **Structured Value Preservation**: When a path resolves to an object with properties (not just a simple address or array), the entire JSON object structure is preserved and displayed in the UI. This maintains important contextual information like distinguishing between role admins and members. Arrays are not considered structured values to avoid redundancy.
- Multiple owner definitions supported via array
- Use `ownerDefinitions !== undefined` pattern (not `??`) to handle explicit clearing
- **Resolution**: Both frontend (`FunctionFolder.tsx`) and backend (`generatePermissionsReport.ts`) use same logic
  - Parses contract reference and value path separately
  - Navigates any structure with recursive descent
  - **Preserves JSON object structure**: If path resolves to an object (like a role with `{ adminRole, members }`), the entire object structure is preserved
  - **Extracts addresses for listing**: While preserving the structure, also extracts all addresses recursively for address-based operations
  - **Display**: UI shows the full JSON structure when present, plus clickable links to all contained addresses
  - Works with any handler's data format (ACL, AccessControl, custom handlers)
  - Shows contract names with click-to-select functionality

**Delay Field**:

- Stores reference to numeric field (not the value itself)
- Backend resolves value at runtime from discovered.json
- Use `delay !== undefined` pattern (not `??`) to handle explicit clearing

**Access Patterns**:

- **Direct Contract Access**: `permissionOverrides.contracts[contractAddress]` - O(1) lookup
- **Function Lookup**: `contracts[address].functions.find(f => f.functionName === name)` - O(n) only within contract
- **Global Operations**: `Object.values(contracts).flatMap(c => c.functions)` when needed
- **UI Components**: Use `getOverridesForContract(address)` helper for contract-specific data

**Panel Development**: To add new panels:

1. Add panel ID to `PANEL_IDS` in `store.ts`
2. Register component in `PANELS` and `READONLY_PANELS` in `ProjectPage.tsx`
3. Create panel component in `/defidisco/` folder following existing patterns
4. Import and register in `ProjectPage.tsx` with single line addition

**Important Notes**:

- **Permission Owner System**: Uses generalized path expressions that work with **any** handler's data structure (ACL, AccessControl, custom handlers, future handlers). No special cases or hardcoded logic needed.
- **Migration**: All existing permission-overrides.json files have been migrated to the new unified path format (one-off migration, October 2025).
- **Score / Impact (Binary)**:
  - In `functions.json`, the field is called `score` with values: `'unscored' | 'critical'`
  - **TypeScript types** use `Impact = 'critical'` (single-value type)
  - Impact is displayed as a static label in V2 scoring, toggled via binary switch in the Values panel

**Future Development:** Follow the minimal integration principle to ensure easy upstream merges and maintainable code separation.

---

## Code Review Guidelines

### Formatting and Linting Rules

**CRITICAL: Reject PRs with formatting-only changes outside `/defidisco/` folders**

This repository is a fork of L2BEAT. To maintain easy upstream merges:

1. **DO NOT accept PRs that reformat L2BEAT code** - Changes to files outside `/defidisco/` folders should only contain functional changes, not formatting fixes
2. **Formatting is only allowed in DefidDisco folders**:
   - `packages/protocolbeat/src/apps/discovery/defidisco/`
   - `packages/l2b/src/implementations/discovery-ui/defidisco/`
   - `packages/discovery/src/discovery/handlers/defidisco/`
3. **If a PR contains formatting changes to upstream files**, request that the author revert those changes before approval
4. **Biome is configured project-wide** but should only be enforced on DefidDisco code to avoid massive diffs with upstream

### Documentation Requirements

**PRs that add or change features must include documentation updates:**

1. **CLAUDE.md** — Update the relevant feature section with new function names, file paths, data structures, or design decisions
2. **`docs/researchers/getting-started.md`** — If the feature affects the researcher workflow, add or update the relevant section
3. **`docs/developers/architecture.md`** — If the feature changes backend data flow or system architecture, update the relevant subsection
4. **Request changes** on PRs that introduce new features without corresponding documentation
