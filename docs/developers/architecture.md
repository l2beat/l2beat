# Architecture

We build on top of the existing architecture to add capabilities dedicated to DeFi monitoring and the complete granularity of a DeFi protocol's inventory assets.

![DeFiScan V2 Architecture](../assets/DeFiDisco-architecture.svg)

The tool is enhanced at multiple levels to add and automate the analysis for DeFi protocols, in addition to the complete discovery of the protocol handled natively by L2Beat (discovery.json). This includes detection and analysis of function-level permissions (functions.json), a complete call graph and detection of external calls (call-graph-data.json), as well as tracking of funds and positions in protocols (funds-data.json). In addition to those elements, reviewers can "tag" contracts to specify elements useful to the review (stored in contracts-tag.json), as well as correct or specify function characteristics (stored in functions.json).

## Frontend

The frontend is used to help researchers visualize the result of an analysis and complete the manual actions required during the review process. The frontend queries the backend through an API, a simple Express.js server defined in `packages/l2b/src/implementations/discovery-ui/main.ts`. Following the minimum integration principle we [defined](developers/contributing.md), all endpoints added for *DeFiScan V2* are `in packages/l2b/src/implementations/discovery-ui/defidisco/` and are simply imported and registered in the `main.ts`. The frontend makes those API calls from `packages/protocolbeat/src/api/api.ts`.

## Backend

The backend is primarily its API endpoints mentioned above. Through these endpoints it can also perform some of the analysis routines such as *discovery*, *fetching funds data*, *creating the call graph*, or *detecting permissions*. It also performs the manual changes made by reviewers/researchers such as *tagging contracts* or changing *function characteristics*.

### Discovery

The discovery process is mostly untouched from the initial [l2beat deployment](https://github.com/l2beat/l2beat), it uses the `config.json` as well as contract templates (`template.json`) to determine how to scan the contract and which data to report in the output (`discovery.json`), this data is then used extensively in the frontend and in other routines.

### Funds Data

Funds data in the backend relies on the [defiscan endpoint](). It calls this endpoint to fetch the data for the given addresses. Note that the service has to be running (separately). It stores the data locally in a `funds-data.json` file linked to the project.

We support fetching information regarding all balances and DeFi positions a contract might hold, as well as token price and market cap of token contracts.

For implementation details, see [Infrastructure: Funds Tracking](features/infrastructure.md#funds-tracking).

### Callgraph

The callgraph is a tool that deterministically detects all possible external contract calls made by each function of a contract. It then attempts to maps those calls to known contracts in the discovery. This resolution to known contracts can only be done usually for 10-30% of cases because the contracts called might not be deterministic. Detecting those calls is made using Slither's slitherir feature, which we then parse in `/packages/l2b/src/implementations/discovery-ui/defidisco/callGraph.ts` and store in `call-graph-data.json`.

For implementation details, see [Call Graph Analysis](features/call-graph-analysis.md).

### Permissions

Currently all permissions are detected through AI queries. The queries include the cropped source code, along with a prompt asking to detect any permissioned functions. In the future this will be combined with our existing [permission-scanner](https://github.com/deficollective/permission-scanner). Currently, queries are made sequentially, they use the model and API key defined in the `.env`. The frontend allows the researcher/reviewer to select which contract they want to run the scanner for. 

In addition to detecting permissions, the AI resolves the permission owner wherever possible. Permission owners are stored as a path, the path refers to the data in `discovery.json`. The paths are defined as follows:

 - *$self* refers to the address of the current contract itself
 - *$self.fieldName* refers to a field of the contract containing the owner address (eg. $self.owner)
 - *$self.signers[0]* refers to the first entry of the array which contains the address of an owner, it could also be used to refer all owners using $self.signers
 - *$self.accessControl.ADMIN_ROLE.members* refers to all members of the role *ADMIN_ROLE* if the contract inherits OpenZeppelin's AccessControl's contract.
 - *@governor.fieldName* refers to a field in another contract. *governor* is the name of the field containing the contract address in the original contract. This syntax can be combined with any of the elements above to reach specific data of the target contract.

 This data is stored in `functions.json` for each project, it's grouped by contract. The data can be overriden manually by reviewers in the frontend.

For implementation details, see [Permissions](features/permissions.md).

### Contract Tags

Contract tags are specified by the reviewer/researcher and can only be changed manually. They improve the review by specifying which contract is external to the project, and whether or note we should fetch funds/positions data for the contracts. This is stored in `contracts-tag.json` for each project.

For implementation details, see [Infrastructure: External Contract Attributes](features/infrastructure.md#external-contract-attributes).

### Review Builder

The Review Builder stores all review configuration in a single `review-config.json` file per project. This includes protocol metadata (name, slug, chain, project type), entity descriptions for admins/dependencies/fund-holding contracts, project resources (links to frontends, docs, GitHub, X, source code), and section content (e.g., Code & Audits).

**Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/reviewConfig.ts` handles CRUD operations. Three API endpoints are registered in `main.ts`:

- `GET /api/projects/:project/review-config` — returns the full config plus available templates
- `PUT /api/projects/:project/review-config` — saves the full config
- `PUT /api/projects/:project/review-config/entity` — partial update for a single admin/dependency/funds entry

**Frontend**: The `ReviewBuilderPanel.tsx` component provides the editor UI, with `ReviewDescriptionsEditor.tsx` for entity descriptions, `ReviewResourcesEditor.tsx` for project resource links (frontends, docs, socials), and `ReviewSectionEditor.tsx` for section tabs. Data source definitions in `reviewDataSources.ts` power the data table blocks.

**AI Generation**: The `/generate-review` Claude Code skill fetches pre-processed data from the l2b API, analyzes the protocol structure, and writes generated descriptions directly to `review-config.json`. Human-specified `resources` (project links) are automatically preserved across regenerations.

**Resources**: The `resources` field is a flat array of `ResourceEntry` objects (`{ url, type, label?, frontendSubtype? }`). Resource types: `frontend` (with subtype: official/third-party/self-hosted), `docs`, `source-code`, `github`, `x`, `other`. Resources are compiled as-is into `compiled-review.json` and rendered in the frontend's "More Information" section.

For implementation details, see [Scoring & Review: Review Builder](features/scoring-and-review.md#review-builder).

### Continuous Monitoring Service

The monitoring service is a standalone background process that continuously watches DeFi protocols for smart contract changes, refreshes live financial data, and compiles publishable review artifacts. It runs as a **GitHub Actions cron job** (daily at 8:00 CET), not as a long-running server.

**Entry point**: `packages/backend/src/defidisco-monitor.ts` — creates the config, application, and handles `RUN_ONCE` mode (used by GitHub Actions) vs long-running mode (Clock-based scheduling).

**Orchestrator**: `packages/backend/src/modules/defi-update-monitor/defidisco/DefidiscoMonitorApplication.ts` — wires all components and runs the monitoring loop. For each project listed in `packages/config/src/defidisco-config.json`:

1. **Discovery** — runs the L2Beat discovery engine (`DiscoveryRunner`)
2. **Diffing** — compares against the previous discovery snapshot stored in PostgreSQL
3. **Notification** — sends Discord messages when contract changes are detected
4. **Funds Refresh** — fetches live token balances and DeFi positions via DeBank API
5. **Review Compilation** — produces a self-contained `compiled-review.json` per project

After all projects are processed, a cycle summary is posted to Discord with project count, duration, and change count.

**Review Compilation**: `ReviewCompiler.ts` reads all project data files (discovery, permissions, call graph, funds, contract tags, review config), runs V2 scoring, resolves template variables in descriptions, and writes a single `compiled-review.json` that contains everything a frontend needs to render a protocol review page — no client-side data joining required. Compilation is gated on `review-config.json` and `call-graph-data.json` existing; if either is missing, the step is skipped (log only).

**Scheduling & Deployment**: The monitor runs via `.github/workflows/monitor.yml`:

1. Builds the Docker image (`Dockerfile.monitor`) with GHA layer caching
2. Runs Prisma migrations (separate step for clear error reporting)
3. Runs the monitor with `RUN_ONCE=true` — single cycle, then clean exit
4. Commits any updated `compiled-review.json` and `funds-data.json` files back to the repository

**Database**: PostgreSQL (Neon free tier) stores discovery cache (RPC response caching across ephemeral containers) and update monitor snapshots (for diffing against previous discoveries). The connection string is stored as a GitHub Actions secret.

**ReviewCompiler location**: The `ReviewCompiler` class lives in `packages/l2b/src/implementations/discovery-ui/defidisco/reviewCompiler.ts` and is shared between the l2b API (interactive compile endpoint) and the monitor (automated compilation). The monitor imports it via `@l2beat/l2b/dist/...`.

### DeFiScan Frontend

The public-facing review website is a separate package at `packages/defiscan-frontend/`. It is a static React application (Vite + TailwindCSS + Recharts) that renders compiled reviews — it does not connect to the l2b API at runtime.

**Data pipeline**:
1. `ReviewCompiler` produces `compiled-review.json` per project (triggered by "Compile Review" button in protocolbeat, or automatically by the monitor)
2. Compiled reviews are placed in `packages/defiscan-frontend/public/data/<slug>/`
3. At build time, `scripts/compile-data.ts` aggregates all compiled reviews into `public/data/index.json` with global stats and cross-protocol dependency data

**Pages**: Landing (protocol table + global stats), Review (Report / Explorer / Dashboard views), Compare (side-by-side protocol comparison with charts).

See `packages/defiscan-frontend/README.md` for detailed documentation, and [Infrastructure: DeFiScan Frontend](features/infrastructure.md#defiscan-frontend) for implementation reference.

---

## Data Pipeline: From Discovery to Frontend

This section documents the end-to-end data transformation pipeline. Each stage reads input data, transforms it, and produces output consumed by the next stage.

### Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SOURCE DATA (per project)                   │
│  discovered.json  functions.json  call-graph-data.json  funds-data  │
│                   contract-tags.json  review-config.json            │
└───────────────┬─────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────┐
│  STAGE 1: Function Analysis (functionAnalysis.ts) │
│  Per-function: impact + dependencies              │
│  Output: ApiFunctionAnalysisResponse              │
└───────────────┬───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────┐
│  STAGE 2: V2 Scoring (v2Scoring.ts)               │
│  Inventory: admins[], dependencies[],             │
│             functions[], contracts[]              │
│  Capital analysis joins funds to admins           │
│  Output: V2ScoreResult                            │
└───────────────┬───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────┐
│  STAGE 3: Review Compiler (reviewCompiler.ts)     │
│  Merges: scoring + funds + tags + descriptions    │
│  Computes dependency funds (deduplicated)         │
│  Output: compiled-review.json                     │
└───────────────┬───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────┐
│  STAGE 4: Index Aggregation (compile-data.ts)     │
│  Cross-protocol totals and dependency sums        │
│  Output: index.json                               │
└───────────────┬───────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────┐
│  STAGE 5: Frontend (defiscan-frontend)            │
│  Static rendering from compiled JSON              │
│  Types: src/types.ts                              │
└───────────────────────────────────────────────────┘
```

### Source Data Files

| File | Location | Content | Written by |
|------|----------|---------|------------|
| `discovered.json` | `packages/config/src/projects/{project}/` | Contracts, ABIs, values, proxy relationships | L2Beat discovery engine |
| `functions.json` | same | Permissioned functions, owner paths, scores, manual dependencies | AI detection + researcher overrides |
| `call-graph-data.json` | same | Slither-based external call graph per contract/function | `callGraph.ts` |
| `funds-data.json` | same | Balances, DeFi positions, token market cap per contract | DeBank API via `fundsData.ts` |
| `contract-tags.json` | same | External/governance flags, entity names per contract | Researcher via UI |
| `review-config.json` | same | Protocol metadata, entity descriptions, resources | AI generation + researcher editing |

### Stage 1: Function Analysis

**File:** `functionAnalysis.ts` — **Output:** `ApiFunctionAnalysisResponse`

Iterates ALL write functions from `discovered.json` ABIs (not just `functions.json` entries). For each function:

- **Dependencies**: BFS traversal of call graph → filter external contracts (`isExternal` tag) + merge manual deps from `functions.json`
- **Impact**: For permissioned functions or functions with dependencies → reachable contracts with funds (direct + via call graph)

```
Per function → FunctionAnalysis { impact, dependencies }
  impact:        { reachableContracts[], totalFundsAtRisk, totalTokenValueAtRisk }
  dependencies:  { entries[]: { contractAddress, contractName, viewOnlyPath, calledFunctions[], entity } }
```

### Stage 2: V2 Scoring

**File:** `v2Scoring.ts` — **Output:** `V2ScoreResult`

Four inventory modules aggregate function-level data into per-entity inventories:

| Module | Input | Aggregation | Output |
|--------|-------|-------------|--------|
| **AdminInventoryModule** | `functions.json` permissioned functions + owner resolution | Group by resolved admin address | `AdminDetail[]` — admin → functions they control |
| **DependencyInventoryModule** | `ApiFunctionAnalysisResponse` | Group by dependency contract address | `DependencyDetail[]` — dependency → functions that use it |
| **FunctionInventoryModule** | `functions.json` permissioned + scored functions | Filter and map | `FunctionDetail[]` — scored functions with impact |
| **ContractInventoryModule** | `discovered.json` entries | Count and categorize | Contract totals |

**Capital Analysis** (optional, runs when call graph + funds exist): `CapitalAnalysisCalculator` enriches `AdminDetail` → `AdminDetailWithCapital` by joining admin functions with funds data via call graph traversal.

**Admin capital computation:**
```
totalDirectCapital   = Σ (balances + positions) for each contract where admin has permissions
totalReachableCapital = totalDirectCapital + Σ reachable contract funds (where fundsAtRisk=true)
```

`fundsAtRisk` is true only if at least one called function on that contract has an impact score (not 'unscored').

### Stage 3: Review Compiler

**File:** `reviewCompiler.ts` — **Output:** `compiled-review.json`

Merges all analysis data with human-written descriptions into a self-contained JSON. Three entity types have distinct compilation paths:

#### Admins Pipeline
```
V2ScoreResult.admins.breakdown (AdminDetailWithCapital[])
  + review-config.json admins descriptions
  + contract-tags.json governance flag
  + functions.json mitigations
  → CompiledAdmin[]
```
Each `CompiledAdmin` carries: address, name, description, adminType, isGovernance, functions (with per-function capital), and totals (totalDirectCapital, totalReachableCapital, totalDirectTokenValue, totalReachableTokenValue).

#### Dependencies Pipeline
```
ApiFunctionAnalysisResponse (per-function dependencies)
  + V2ScoreResult.dependencies.breakdown (for inventory list)
  + review-config.json dependency descriptions
  + funds-data.json (for per-function direct funds)
  → CompiledDependency[]
```
The compiler iterates all functions → their dependencies, building a deduplicated map keyed by dependency contract address. For each dependency:
- Collects all calling functions as `CompiledDependencyFunction[]` (with `directFundsUsd`, `reachableContracts[]`)
- Computes `totalFundsAtRisk` using `Math.max()` per reachable contract address to avoid double-counting when multiple functions reach the same contract

#### Funds Pipeline
```
review-config.json funds addresses + descriptions
  + funds-data.json (balances, positions, tokenInfo)
  → CompiledFundHolder[]
```
Pass-through of raw funds data enriched with human descriptions.

### Stage 4: Index Aggregation

**File:** `defiscan-frontend/scripts/compile-data.ts` — **Output:** `index.json`

Reads all `compiled-review.json` files and produces cross-protocol aggregations:
- Protocol list with totals (capital, functions, admins, dependencies)
- Global dependency map: sums `totalFundsAtRisk` across protocols for the same dependency address
- Global stats (protocols reviewed, total capital)

Uses a minimal hand-written subset of `CompiledReview` types (not imported from `src/types.ts`).

### Stage 5: Frontend

**File:** `defiscan-frontend/src/types.ts` — mirrors compiler output types exactly

Frontend reads `compiled-review.json` (per protocol) and `index.json` (cross-protocol) as static JSON. No client-side data joining — all computation is pre-baked by the compiler. The only client-side computation is `getDepFunctionFunds()` for per-function funds display in dependency detail views.

### Key Concept: Funds vs Token Value

Two distinct value types flow through the entire pipeline:

| Concept | Source | Computation | Display color |
|---------|--------|-------------|---------------|
| **Funds** (Capital at risk) | `balances.totalUsdValue + positions.totalUsdValue` | Token holdings + DeFi positions | Green (`text-green-400`) |
| **Token Value** (Market cap) | `tokenInfo.tokenValue` = totalSupply × price | Only for token contracts | Yellow (`text-aux-yellow`) |

These are always tracked separately (never summed together) through all pipeline stages.

### Deduplication Rules

Capital and funds are deduplicated at different stages to prevent double-counting:

| Stage | Entity | Dedup Strategy |
|-------|--------|----------------|
| Capital Analysis | Admin → contracts | Set of unique contract addresses per admin |
| Review Compiler | Dependency → reachable contracts | `Math.max(existing, new)` per contract address across functions |
| Index Aggregation | Dependency across protocols | Sum per dependency address (protocols are independent) |
| V2 Scoring header totals | Admins → total capital | `computeDeduplicatedCapital()` across all admins |
