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

We support fetching information regarding all balances and DeFi positions a contract might hold, token price and market cap of token contracts, and aggregate TVL for factory contracts (via The Graph subgraphs).

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

The Review Builder stores review configuration across **three sibling files** per project, which split intentionally so the AI-regenerated content does not clobber hand-authored data:

- **`review-config.json`** — protocol metadata (name, slug, chain, project type), entity descriptions for admins/dependencies/fund-holding contracts, and section content (e.g., Code & Audits). **Wiped and regenerated** by `/generate-review`.
- **`resources.json`** — project resources (links to frontends, docs, GitHub, X, source code), security audits, and the deduplicated lines-of-code count. Shape: `{ resources: ResourceEntry[], audits: AuditEntry[], linesOfCode?: number }` (with legacy bare-array fallback). Survives `/generate-review`.
- **`governance.json`** — governance config (framework, vote execution, voting unit, proposal requirements, voting process, proposal period, execution delay). Survives `/generate-review`.

**Backend**: Three CRUD modules under `packages/l2b/src/implementations/discovery-ui/defidisco/`: `reviewConfig.ts`, `resources.ts`, `governance.ts`. Each module reads its own file with a **legacy-fallback read** from the old location inside `review-config.json`, and on write performs a one-time migration by stripping the legacy key. Endpoints registered in `main.ts`:

- `GET`/`PUT /api/projects/:project/review-config` (+ `PUT .../review-config/entity` for partial entity updates)
- `GET`/`PUT /api/projects/:project/resources`
- `POST /api/projects/:project/count-lines-of-code` (manual LoC recount — also auto-triggered inside `compile-review`)
- `GET`/`PUT /api/projects/:project/governance`

**Frontend**: `ReviewBuilderPanel.tsx` hosts the tabbed editor UI. `ReviewDescriptionsEditor.tsx` edits entity descriptions (part of review-config). `ReviewResourcesEditor.tsx` and `ReviewGovernanceEditor.tsx` are **self-contained auto-saving editors** — they own their own `useQuery`/`useMutation` against the dedicated endpoints and do not go through `ReviewBuilderPanel`'s save button. `ReviewSectionEditor.tsx` handles section tabs with data source definitions in `reviewDataSources.ts`.

**Resources**: `ResourceEntry = { url, type, label?, frontendSubtype? }` with types `frontend` (subtype: official/third-party/self-hosted), `docs`, `source-code`, `github`, `x`, `other`. `AuditEntry = { url, author, date, scope?, bounty? }` where `bounty` is the max bug bounty USD amount. Compiled as-is into `compiled-review.json`.

**Lines of Code**: `linesOfCode?: number` is produced by `countLinesOfCode.ts` using declaration-level dedup — parses each `.flat/` Solidity file, extracts top-level `library`/`contract`/`abstract contract`/`interface` blocks with brace-depth tracking, and counts each unique declaration name once across all files. This removes the 2-3x overcount caused by flatteners inlining shared libraries (e.g., OpenZeppelin's `Address`) into every contract. `reviewCompiler.compile()` always runs the counter inline (step 4) so every `Compile Review` produces a fresh value and writes it into both `resources.json.linesOfCode` and `compiled-review.json.totals.linesOfCode`. Failure is non-fatal — a warning is logged and the field is left `undefined`, which the frontend renders as `—`. A manual recount is also exposed via `POST /api/projects/:project/count-lines-of-code` and the "Count Lines of Code" button in `TerminalExtensions.tsx`.

**Governance**: `GovernanceConfig = { framework, voteExecution, votingUnit, proposalRequirements, votingProcess, proposalPeriod, executionDelay }`. Both period/delay are `GovernanceDuration` = `{ kind: 'fieldRef', ref: { contractAddress, fieldName, unit? } } | { kind: 'fixed', value: string } | { kind: 'none' }`. `unit` is one of `seconds | blocks | minutes | hours | days` (default `seconds`; `blocks` assumes 12s Ethereum block time). Field refs are resolved by `resolveGovernance()` in `governanceCompiler.ts` — it reads the raw numeric value from `discovered.json`, multiplies by `unitToSecondsFactor(unit)`, and writes the converted seconds to `compiled-review.json`. The unit is purely an input to conversion; it never appears on `CompiledGovernanceDuration` and downstream consumers only see the resolved seconds.

**AI Generation**:
- `/generate-review` writes only `review-config.json` (after `mv`-ing the old one aside). Resources and governance survive untouched.
- `/generate-governance` writes only `governance.json` — researches the protocol's voting framework, prefers `fieldRef` durations pointing at real timelock/governor fields, and picks the right `unit` (notably `"blocks"` for Compound/OZ Governor `votingPeriod`).

For implementation details, see [Scoring & Review: Review Builder](features/scoring-and-review.md#review-builder) and [Scoring & Review: Governance](features/scoring-and-review.md#governance).

### Continuous Monitoring Service

The monitoring service is a standalone background process that continuously watches DeFi protocols for smart contract changes, refreshes live financial data, and compiles publishable review artifacts. It runs as a **GitHub Actions cron job** (daily at 8:00 CET), not as a long-running server.

**Entry point**: `packages/backend/src/defidisco-monitor.ts` — creates the config, application, and handles `RUN_ONCE` mode (used by GitHub Actions) vs long-running mode (Clock-based scheduling).

**Orchestrator**: `packages/backend/src/modules/defi-update-monitor/defidisco/DefidiscoMonitorApplication.ts` — wires all components and runs the monitoring loop. For each project listed in `packages/config/src/defidisco-config.json`:

1. **Discovery** — runs the L2Beat discovery engine (`DiscoveryRunner`)
2. **Diffing** — compares against the previous discovery snapshot stored in PostgreSQL
3. **Notification** — sends Discord messages when contract changes are detected; new diff is persisted to the `UpdateNotifier` table
4. **Discovery Write-back** — writes the fresh `discovered.json` back to `packages/config/src/projects/<project>/` via `saveDiscoveredJson`. Committed by the GH Actions workflow so `$pastUpgrades` and the activity feed stay in sync between manual runs
5. **Funds Refresh** — fetches live token balances, DeFi positions via DeBank API, and aggregate TVL via defiscan-endpoints (The Graph subgraphs). Warnings (e.g. failed aggregate fetches) are reported to Discord
6. **Activity Reconcile** — `reconcileActivity(project)` reads `activity.json`, fetches new `UpdateNotifier` rows via `getNewerThanId(project, cursor)`, runs `classifyDiff()` against the just-written `discovered.json` + contract tags, appends new events deduped by deterministic id, advances the cursor, writes the file. First run with `cursor === 0` does a full historical backfill. Must run **before** compile so the compiler sees a consistent file
7. **Review Compilation** — produces a self-contained `compiled-review.json` per project, merging upgrade events from `$pastUpgrades` with the classifier events from `activity.json`

After all projects are processed, a cycle summary is posted to Discord with project count, duration, and change count.

**Review Compilation**: `ReviewCompiler.ts` reads all project data files (discovery, permissions, call graph, funds, contract tags, review config), instantiates `ProjectAnalysis` to compute admins and dependencies, resolves template variables in descriptions, and writes a single `compiled-review.json` that contains everything a frontend needs to render a protocol review page — no client-side data joining required. Compilation is gated on `review-config.json` and `call-graph-data.json` existing; if either is missing, the step is skipped (log only).

**Scheduling & Deployment**: The monitor runs via `.github/workflows/monitor.yml`:

1. Builds the Docker image (`Dockerfile.monitor`) with GHA layer caching
2. Runs Prisma migrations (separate step for clear error reporting)
3. Runs the monitor with `RUN_ONCE=true` — single cycle, then clean exit
4. Commits any updated `discovered.json`, `activity.json`, `funds-data.json`, and `compiled-review.json` files back to the repository

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
│  STAGE 1: ProjectAnalysis (projectAnalysis.ts)    │
│  Unified computation class:                       │
│  - getAdmins():  admin grouping + capital + chains│
│  - getDependencies(): dependency grouping + funds │
│  - getSummary(): contract/function/admin counts   │
│  Orchestrates: enhancedTraversal, capitalAnalysis,│
│    functionAnalysis, owner resolution, tags        │
│  Output: ApiAdminsResponse, ApiDependenciesResponse│
└───────────────┬───────────────────────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌───────────────┐  ┌─────────────────────────────────────┐
│  HTTP API     │  │  STAGE 2: Review Compiler            │
│  GET /admins  │  │  (reviewCompiler.ts)                 │
│  GET /deps    │  │  Calls ProjectAnalysis internally    │
│  (protocolbeat│  │  + descriptions + funds + tags       │
│   UI queries) │  │  Output: compiled-review.json        │
└───────────────┘  └───────────────┬─────────────────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────────────┐
                   │  STAGE 3: Index Aggregation            │
                   │  (compile-data.ts)                     │
                   │  Cross-protocol totals + dependency    │
                   │  Output: index.json                    │
                   └───────────────┬───────────────────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────────────┐
                   │  STAGE 4: Frontend (defiscan-frontend) │
                   │  Static rendering from compiled JSON   │
                   │  Types: src/types.ts                   │
                   └───────────────────────────────────────┘
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

### Stage 1: ProjectAnalysis

**File:** `projectAnalysis.ts` — **Class:** `ProjectAnalysis`

The central computation class that orchestrates all analysis for a project. It does not rewrite algorithms — it calls existing modules (`enhancedTraversal.ts`, `capitalAnalysis.ts`, `functionAnalysis.ts`, `functions.ts`) and provides unified output via two methods: `getAdmins()` and `getDependencies()`.

**Constructor**: Takes `(paths, configReader, templateService, projectName)`. Lazily loads all source data files and builds lookup maps (contractNameMap, contractTypeMap, proxyTypeMap, implToProxyMap, fundsLookup, tagsByAddress).

#### `getAdmins(contractFilter?)`

Groups permissioned functions by their resolved admin address and enriches with capital data and ownership chains.

1. **Owner resolution**: For each function with `ownerDefinitions` in `functions.json`, calls `resolveOwnersFromDiscovered()` to resolve path expressions (e.g., `$self.owner`, `@governor.signers`) against `discovered.json` data. Results are cached per `(contractAddress, ownerDefinitions)` pair.
2. **Admin grouping**: Groups functions by resolved admin address (normalized via `normalizeChainAddress`). Each admin gets a mapped type via `mapAdminType()` (zero address → Revoked, immutable proxyType → Immutable, etc.)
3. **Capital analysis**: `CapitalAnalysisCalculator` enriches each admin-function pair with capital data via **enhanced graph forward BFS** (see [Capital Analysis](#capital-analysis)).
4. **Ownership chains**: Backward BFS through the enhanced graph produces `CollapsedChain[]` — pre-collapsed server-side (chains with identical contract sequences are merged, function names grouped per step).
5. **Contract tags enrichment**: Each admin is annotated with `isExternal`, `isGovernance`, and `entity` from `contract-tags.json`.
6. **Totals**: Project-wide `totalCapitalAtRisk` and `totalTokenValueAtRisk` are computed with deduplication across admins.

**Output:** `ApiAdminsResponse` — `{ totals, admins: AdminEntry[] }`

#### `getDependencies(contractFilter?)`

Groups external dependencies by dependency address with per-function capital data.

1. Calls `computeFunctionAnalysis()` for dependency detection (call-graph BFS + write-deps + manual deps).
2. Groups by dependency address, merging `viewOnlyPath` and `calledFunctions` across all functions that use the dependency.
3. Enriches each dependency-function pair with capital data from `CapitalAnalysisCalculator`.
4. Computes `totalFundsAtRisk` per dependency using `Math.max()` per reachable contract address to avoid double-counting.

**Output:** `ApiDependenciesResponse` — `{ totals, dependencies: DependencyEntry[] }`

#### Per-contract filtering

Both methods accept an optional `contractFilter` parameter. When provided, only functions on the specified contract (or its implementations) are included. The backend still builds the full graph (sub-second), but filters the response. This lets `FunctionFolder` get per-contract data while inventory sections and the compiler get project-wide data from the same code path.

#### HTTP API

| Endpoint | Method | Response | Used by |
|----------|--------|----------|---------|
| `GET /api/projects/:project/admins` | `getAdmins()` | `ApiAdminsResponse` | V2ScoringSection, FunctionFolder, ReviewCompiler |
| `GET /api/projects/:project/admins?contract=eth:0x...` | `getAdmins(contract)` | filtered `ApiAdminsResponse` | FunctionFolder |
| `GET /api/projects/:project/dependencies` | `getDependencies()` | `ApiDependenciesResponse` | V2ScoringSection, FunctionFolder, ReviewCompiler |
| `GET /api/projects/:project/dependencies?contract=eth:0x...` | `getDependencies(contract)` | filtered `ApiDependenciesResponse` | FunctionFolder |

#### Capital Analysis

`CapitalAnalysisCalculator` in `capitalAnalysis.ts` computes per-admin capital using the **enhanced graph** (call graph + permission edges) from `enhancedTraversal.ts`.

The enhanced graph (built by `buildEnhancedGraph()` + `buildIndices()`) unifies two edge types:
- **Call graph edges** (caller function → callee function): Slither-detected external calls
- **Permission edges** (owner contract → owned function): Resolved from `ownerDefinitions` in `functions.json`

Forward BFS through this unified graph follows both edge types, so capital propagates through permission chains. For example, Governor → Timelock (permission) → ProxyAdmin (permission) → market contract with $735M. Without permission edges, the Timelock's `queueTransaction` (which takes arbitrary calldata) would show $0 reachable — the static call graph can't resolve dynamic dispatch.

**Admin capital computation:**
```
totalDirectCapital   = Σ (balances + positions) for each contract where admin has permissions
totalReachableCapital = totalDirectCapital + Σ reachable contract funds (where fundsAtRisk=true)
```

`fundsAtRisk` is true only if at least one called function on that contract has an impact score (not 'unscored').

### Stage 2: Review Compiler

**File:** `reviewCompiler.ts` — **Output:** `compiled-review.json`

The review compiler is a **thin assembly layer** — it calls `ProjectAnalysis.getAdmins()` and `ProjectAnalysis.getDependencies()` internally (same process, no HTTP), then overlays human-written descriptions and assembles the final review JSON. If any data needs to be computed differently, change it at the `ProjectAnalysis` level, not in the compiler.

Three entity types have distinct compilation paths:

#### Admins Pipeline
```
ProjectAnalysis.getAdmins() → ApiAdminsResponse
  - filter out admins where isExternal === true
  + review-config.json admins descriptions (name overrides, descriptions)
  + mitigations via getMitigationsForOwner() (direct from functions.json + transitive via call graph BFS)
  + configSeverity.ts auto-severity (mitigatedField → config.jsonc HIGH severity)
  → CompiledAdmin[]
```
**External admin filtering:** Admins with `isExternal: true` (from contract-tags, already enriched by ProjectAnalysis) are excluded from the compiled review. These represent external dependency admins (e.g., Chainlink governance, CryptoFranc multisigs), not protocol admins. They remain visible in protocolbeat's "Show all" toggle.

Each `CompiledAdmin` carries: address, name, description, adminType, isGovernance, functions (with per-function capital), and totals (totalDirectCapital, totalReachableCapital, totalDirectTokenValue, totalReachableTokenValue).

**Mitigation values** can be hardcoded strings or field references using the same path syntax as owner definitions (`$self.field`, `@ref.field`, `eth:0xAddr.field`). Field references are resolved at display time via `resolveFieldValue()` in `ownerResolution.ts`. When a mitigation specifies a `mitigatedField` (contract + field name), `configSeverity.ts` auto-writes `severity: "HIGH"` to `config.jsonc`, ensuring the monitoring service sends priority Discord alerts when that field changes on-chain.

#### Dependencies Pipeline
```
ProjectAnalysis.getDependencies() → ApiDependenciesResponse
  + review-config.json dependency descriptions
  → CompiledDependency[]
```
The compiler maps `DependencyEntry[]` to `CompiledDependency[]` — a straightforward field mapping. Capital data (directFundsUsd, reachableContracts, totalFundsAtRisk) is pre-computed by ProjectAnalysis.

#### Funds Pipeline
```
review-config.json funds addresses + descriptions
  + funds-data.json (balances, positions, tokenInfo, aggregate)
  + contract-tags.json (fetchAggregate tags → auto-included even without review-config entry)
  → CompiledFundHolder[]
```
Pass-through of raw funds data enriched with human descriptions. Aggregate-tagged contracts are included automatically even without a `review-config.json` funds entry.

#### Lines of Code Pipeline
```
countLinesOfCode(paths, configReader, project)
  discovered.json entries (type: Contract, not external)
  dedup by sourceHashes
  → per contract: .flat/ file paths via getCodePaths()
  → extractDeclarations() (brace-depth parser, library/contract/interface)
  dedup declarations by name across all files
  → sum of unique declaration line counts
  → compiled-review.json.totals.linesOfCode + resources.json.linesOfCode
```
Auto-run inside `compile()` (step 4). Non-fatal on error. See [Resources & Review Builder: Lines of Code](features/scoring-and-review.md#lines-of-code) for the full algorithm and rationale (declaration-level dedup is needed because flattened `.sol` files inline shared libraries like OpenZeppelin's `Address` into every contract, causing 2-3x naive-line-count overcounts).

### Stage 3: Index Aggregation

**File:** `defiscan-frontend/scripts/compile-data.ts` — **Output:** `index.json`

Reads all `compiled-review.json` files and produces cross-protocol aggregations:
- Protocol list with totals (capital, functions, admins, dependencies)
- Aggregate fund values (`aggregate.totalUsdValue`) are summed into per-protocol `totalCapitalAtRisk` — they count as TVL
- Token values are computed from `funds[].tokenInfo.tokenValue`
- Global dependency map: sums `totalFundsAtRisk` across protocols for the same dependency address
- Global stats (protocols reviewed, total capital)

Uses a minimal hand-written subset of `CompiledReview` types (not imported from `src/types.ts`).

### Stage 4: Frontend

**File:** `defiscan-frontend/src/types.ts` — mirrors compiler output types exactly

Frontend reads `compiled-review.json` (per protocol) and `index.json` (cross-protocol) as static JSON. No client-side data joining — all computation is pre-baked by the compiler. The only client-side computation is `getDepFunctionFunds()` for per-function funds display in dependency detail views.

### Key Concept: Funds vs Token Value

Two distinct value types flow through the entire pipeline:

| Concept | Source | Computation | Display color |
|---------|--------|-------------|---------------|
| **Funds** (Capital at risk) | `balances.totalUsdValue + positions.totalUsdValue + aggregate.totalUsdValue` | Token holdings + DeFi positions + factory aggregate TVL | Green (`text-green-400`) |
| **Token Value** (Market cap) | `tokenInfo.tokenValue` = totalSupply × price | Only for token contracts | Yellow (`text-aux-yellow`) |

These are always tracked separately (never summed together) through all pipeline stages. Aggregate funds (from factory contracts like Uniswap V2) are treated as regular TVL — they are included in `totalCapitalAtRisk` at the index aggregation stage.

### Deduplication Rules

Capital and funds are deduplicated at different stages to prevent double-counting:

| Stage | Entity | Dedup Strategy |
|-------|--------|----------------|
| ProjectAnalysis (capital) | Admin → contracts | Set of unique contract addresses per admin (via enhanced graph forward BFS) |
| ProjectAnalysis (deps) | Dependency → reachable contracts | `Math.max(existing, new)` per contract address across functions |
| ProjectAnalysis (totals) | Admins → total capital | `computeDeduplicatedCapital()` across all admins |
| Index Aggregation | Dependency across protocols | Sum per dependency address (protocols are independent) |
