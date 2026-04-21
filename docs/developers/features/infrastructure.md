# Infrastructure

## DeFiScan Panel

The DeFiScan panel (`/defidisco/DeFiScanPanel.tsx`) is the contract analysis dashboard rendered inside protocolbeat:

- **Status section**: initial vs discovered contract counts, address type breakdown
- **Contract types**: Contracts, EOAs, Multisigs, External addresses
- **Permissions**: permissioned function count and review progress
- **Data sources**: `getProject`, `useContractTags`, `getPermissionOverrides`
- Registered in `ProjectPage.tsx` and `store.ts` following the standard panel pattern

## External Contract Attributes

Contract tags extend L2BEAT's discovery metadata with researcher-authored attributes, most importantly a per-contract **entity** that groups external contracts by provider (Chainlink, Uniswap, …).

- **UI**: `ExternalButton.tsx` (toggle + entity selector popup), `EntitySelector.tsx` (shared dropdown)
- **Hook**: `useProjectEntities(project)` in `useContractTags.ts` extracts unique entity names
- **Backend**: `contractTags.ts` preserves all attributes across individual field updates; `entity` accepts `null` to clear

## Governance Tag

`isGovernance` is a binary tag stored on `contract-tags.json`. Governance-tagged contracts are colored green in the graph view and treated as "key owners" alongside EOAs and Multisigs.

- **UI**: `GovernanceButton.tsx` (node toolbar), `GovernanceIndicator.tsx` (inline label in the Values panel)
- **Coloring priority**: Unknown (red) > External (orange) > Governance (green) > Chain color
- **Admin filtering**: By default the Owners section shows only key owners (EOAs, EOAPermissioned, Multisigs, governance-tagged contracts). "Show all contracts" reveals the rest.

## Contract Tags Data Structure

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

- **Location**: `packages/config/src/projects/{project}/contract-tags.json`
- **Fields**: `isExternal`, `isGovernance`, `entity`, `fetchBalances`, `fetchPositions`, `isToken`, `fetchAggregate`, `aggregateHandler`, `aggregateLabel`
- **Cleanup**: When all boolean tag fields are `false`, the entry is removed from the file

## Funds Tracking

Fetches and displays token balances and DeFi positions for contracts marked for funds fetching.

- **Data source**: `defiscan-endpoints` service (wraps DeBank for balances/positions)
- **Storage**: `funds-data.json` per project
- **UI**: `FundsSection.tsx` (display) and `FundsTagsButton.tsx` (controls — toggles per-contract)

### Enabling funds fetching

1. Select a contract in the graph view
2. Click **Funds** in the controls
3. Check **Fetch Token Balances** and/or **Fetch DeFi Positions**
4. In the DeFiScan panel, click **Fetch Funds**

### Contract tag extension

```json
{
  "contractAddress": "eth:0x...",
  "isExternal": true,
  "fetchBalances": true,
  "fetchPositions": false,
  "isToken": false,
  "fetchAggregate": true,
  "aggregateHandler": "uniswap-v2-factory",
  "aggregateLabel": "Uniswap V2 Liquidity Pools"
}
```

### `funds-data.json` shape

```json
{
  "version": "1.0",
  "contracts": {
    "eth:0x123...": {
      "balances": { "tokens": [...], "totalUsdValue": 5000, "source": "debank" },
      "positions": { "protocols": [...], "totalUsdValue": 10000, "source": "debank" },
      "aggregate": {
        "totalUsdValue": 748000000,
        "contractCount": 491000,
        "handlerName": "uniswap-v2-factory",
        "source": "thegraph-uniswap-v2"
      },
      "lastFetched": "...",
      "error": null
    }
  }
}
```

### Running with funds support

```bash
# Option 1: two terminals
cd packages/defiscan-endpoints && pnpm start
cd packages/config && l2b ui

# Option 2: bundled startup script
cd packages/l2b && ./scripts/start-with-funds.sh
```

### Aggregate Funds

For protocols that deploy many identical child contracts (Uniswap V2 pairs, Frankencoin positions, …), aggregate funds tracking fetches total TVL via a handler-specific data source instead of tracking each child individually.

1. Researcher tags a factory contract with `fetchAggregate: true` and picks an `aggregateHandler`
2. `l2b` calls `defiscan-endpoints /aggregate` with the handler name
3. The endpoint dispatches to the matching handler. Unknown handlers return `500` (not silent zeros)
4. Aggregate data is stored under `funds-data.json` `aggregate` and included in the compiled review even without a `review-config.json` entry
5. `compile-data.ts` adds aggregate values to per-protocol `totalCapitalAtRisk`

**`GET /aggregate` parameters**: `contract_address` (required), `handler` (required), `chain_id` (optional, defaults to `eth`), `force_refresh` (optional). Returns `AggregateResponse` with `total_usd_value`, `contract_count`, `breakdown[]`, `timestamp`, `source`.

**Available handlers:**

| Handler | Data source | API key | Notes |
|---|---|---|---|
| `uniswap-v2-factory` | The Graph subgraph | `THEGRAPH_API_KEY` | Uses factory address in subgraph query |
| `frankencoin-mintinghub` | Frankencoin public API | None | Filters positions by MintingHub version (V1 vs V2) |
| `aerodrome-v2-factory` | DefiLlama + on-chain `allPoolsLength()` via Base Blockscout RPC | None | Reports Aerodrome V2 TVL (DefiLlama slug `aerodrome-v1`), pool count via `eth_call` |
| `aerodrome-cl-factory` | DefiLlama + on-chain `allPoolsLength()` via Base Blockscout RPC | None | Reports Slipstream TVL (DefiLlama slug `aerodrome-slipstream`), combines pool counts from both CL factory deployments |

**Adding a new handler:**

1. Create the handler class under `packages/defiscan-endpoints/src/services/aggregate/handlers/`
2. Implement the `AggregateHandler` interface (`name` + `fetch(address, chain)`)
3. Register in `server.ts`
4. Add the handler name to `KNOWN_AGGREGATE_HANDLERS` in `FundsTagsButton.tsx`

### `defiscan-endpoints` env config

```bash
DEBANK_API_KEY=your-debank-api-key
PORT=3001
ETHEREUM_RPC_URL_FOR_DISCOVERY=https://your-rpc-url   # enables Morpho onchain positions
THEGRAPH_API_KEY=your-thegraph-api-key                # required for uniswap-v2-factory
```

### Morpho Vault Onchain Positions

When `ETHEREUM_RPC_URL_FOR_DISCOVERY` is set, defiscan-endpoints detects Morpho vaults and fetches their positions directly onchain instead of from DeBank. This produces more accurate per-market breakdowns.

- **Detection**: checks two MetaMorpho Factory contracts via `isMetaMorpho(address)`. Results are cached for 24h (the factory is immutable once deployed)
- **Position fetch**: reads the vault's supply queue onchain, then queries Morpho Blue for per-market position data. Computes `suppliedAssets = supplyShares × totalSupplyAssets / totalSupplyShares`
- **Pricing**: reuses `BalanceService` to fetch Morpho Blue's DeBank balances (standard cache applies)
- **Output**: formatted as `DebankComplexProtocol[]` for downstream compatibility
- **Fallback**: any RPC error falls back to DeBank with a warning log. If the RPC URL is not configured, everything uses DeBank

## DeFiScan Frontend

The public-facing review website is a separate package at `packages/defiscan-frontend/`. It is a static React app (Vite + Tailwind + Recharts) that renders compiled reviews — no runtime connection to the l2b API.

- **Data model**: static JSON. Reads pre-compiled `compiled-review.json` from `public/data/<slug>/`
- **Build**: `scripts/compile-data.ts` aggregates all compiled reviews into `public/data/index.json` with global stats, entity-grouped dependency counts, and active admin counts
- **Pages**: Landing, Gallery (`/gallery`), Review (Report / Explorer / Activity), Compare, About
- **Explorer tabs**: Overview, Funds, Admins, Governance, Dependencies, Contracts. The Admins tab shows non-governance human admins only; the Governance tab shows governance-tagged contracts only.
- **TVS metric**: "Total Value Secured" = TVL (tokens held in contracts) + protocol token market cap. Used consistently across the landing table and the fund charts
- **Deployment**: Vercel with SPA rewrites (`vercel.json` excludes `/data/` from rewrites)
- **Commands**: `pnpm dev` (dev), `pnpm build` (builds after `compile-data`)
- **See also**: `packages/defiscan-frontend/README.md`

### Gallery Page

`/gallery` is the public directory of reviewed protocols (`packages/defiscan-frontend/src/pages/gallery/GalleryPage.tsx`):

- 3-column responsive card grid, 12 cards per page, client-side pagination
- Each card shows protocol name, chain, type, TVS, admin count, dependency count, points of trust, last activity, a small radar chart, and a status badge
- **Status badge**: `ACTIVE` by default; `ATTENTION` if any upgrade event in `review.activity` occurred within the last 7 days
- **Filters**: ECOSYSTEM (chain), TYPE (projectType), STATUS (active/attention)
- **Radar chart**: same `deriveRadarData()` logic used on the Report hero — CONTROL, DEPENDENCIES, ACCESS, VERIFIABILITY, ABILITY TO EXIT

### Report Page

The Report view is structured around an outer-frame pattern: Admins, Dependencies, TVS, Activity, and Governance each live in a bordered card that shows a section label, a summary, and a "Show More" button that opens a modal with the full Explorer tab content.

- **Hero**: active badge, clamped description with "Show more", radar card
- **Admins / Dependencies / TVS / Activity sections**: each has an empty state (shield icon + message) when no data is present
- **Source Code section** (`CodeQualitySection.tsx`): audits sorted newest-first, Bug Bounty row links to the bounty audit entry, LoC count rendered as "{N} LoC"
- **Shareable Report View**: print-friendly PDF export (expands all collapsibles via `flushSync` before calling `window.print()`), copy link / X / Farcaster share dropdown, and Markdown export to clipboard

### About Page

`/about` (`AboutPage.tsx`) reads `useIndex()` for two live stats: Protocols Tracked (`protocols.length`) and Total Value Verified (`globalTotals.totalCapitalAtRisk + globalTotals.totalTokenValue`). **Do not use `totalDefiTvl`** — it's a hardcoded constant used only as the "% of DeFi reviewed" denominator.

## Activity Feed

The Activity feed is a chronological timeline of everything that has changed in a protocol: contract upgrades, role rotations, parameter tweaks, and contracts being added or removed from the discovery. It is rendered on the public frontend as a third view alongside Report and Explorer.

Two data sources are merged by `reviewCompiler.ts`:

1. **Upgrades** — `$pastUpgrades` on proxy contracts in `discovered.json` (tuples of `[isoTimestamp, txHash, implementations[]]`)
2. **Everything else** — per-project `activity.json`, reconciled from the `UpdateNotifier` Postgres table by the monitor

### `activity.json` schema (v1.1)

```ts
interface ActivityFile {
  version: '1.1'
  lastReconciledAt: number              // unix seconds
  lastConsumedUpdateNotifierId: number  // monotonic DB row cursor — 0 = full backfill
  events: ActivityFileEvent[]
}
```

Events are grouped **per contract per cycle**. `DataChangeEvent` and `RoleUpdateEvent` carry a `changes: FieldChange[]` array (`FieldChange = { field, before, after }`) instead of one event per individual field, so a contract with 50 ticking fields produces 1 row instead of 50.

When `readActivityFile()` sees a version mismatch, it logs a single reset line and returns an empty file (`lastConsumedUpdateNotifierId: 0`). The next reconcile walks the `UpdateNotifier` table from id 0 and rebuilds the file in the new shape. This is cheap (~a few dozen rows total) and avoids carrying legacy read paths forever. The DB is the source of truth.

### Classifier

`classifyDiff(notifier, discovery, contractTags)` in `activityClassifier.ts`:

- Skips `$implementation`, `$pastUpgrades`, `$upgradeCount` (already covered by upgrade events)
- `$admin` → `RoleUpdateEvent` with `roleName: 'ProxyAdmin'`
- `accessControl.<ROLE>.(members|adminRole)` → `role-update` with `roleName = <ROLE>`
- `owner`, `pendingOwner`, Safe `$members` and `$threshold` → `role-update` with a descriptive role name
- `DiscoveryDiff.type === 'created' | 'deleted'` → `contract-added` / `contract-removed`
- Everything else → `data-change` aggregated under one event per contract per cycle

Each `(updateNotifierId, address)` pair emits one `data-change` event plus one `role-update` event per distinct `roleName`. Event ids are deterministic (`${updateNotifierId}:${address}:${bucket}`) for idempotent dedup.

### Frontend rendering

- `describeActivityEvent` switches on `event.type` and on `changes.length`. Count=1 keeps the original "X changed from Y to Z" wording; count>1 produces a "{count} fields changed (a, b, c and N more)" summary
- `FieldChangesPanel.tsx` is a shared component used by both `ActivityView.tsx` and the Report's `ActivitySection.tsx` — it renders grouped `changes[]` as a `Field | Before | After` table
- `data-change` and `role-update` rows are **click-to-expand**: clicking toggles an inline `FieldChangesPanel` underneath (single-open semantics). `upgrade`, `contract-added`, and `contract-removed` rows are non-expandable
- `ActivityView.tsx`: hero with stats grid, Telegram "Upcoming" notification channel, table with `Date | Update Type | Description | Source | Severity` columns, client-side pagination (10 events per page)
- On the activity view, the `ViewModeToggle` is hidden and the back link reads "Back to report" — activity is treated as a child of the report

### Monitor integration

`DefidiscoMonitorApplication.reconcileActivity(project)` runs between funds refresh and compile review. It loads the current file, fetches `updateNotifier.getNewerThanId(projectId, cursor)`, classifies each row, appends new events (deduped by deterministic id), advances the cursor, and writes the file. First run with `cursor === 0` performs a full historical backfill.

## Monitor Admin Dashboard

The Monitor Admin Dashboard (`/ui/monitor-admin`) is a researcher cleanup UI for the `UpdateNotifier` table populated by the monitoring service. Monitor cycles inevitably catch noisy ticking values that snuck past `ignoreInWatchMode`; before this dashboard, the only remedy was hand-editing the DB and `activity.json`.

- **Route**: `/ui/monitor-admin` (entry button on the Home page next to "Compile All")
- **Backend**: `packages/l2b/src/implementations/discovery-ui/defidisco/monitorAdmin.ts`
- **Endpoints** (all under `/api/defidisco/monitor/*`, **gated on `DATABASE_URL`**; mutations also respect `l2b ui --readonly` and return `403`):
  - `GET /health` — returns `{ available, readonly }`. When `DATABASE_URL` is unset, the page renders an "unavailable" notice and every endpoint returns `503`
  - `GET /rows` — list of `MonitorRowSummary` grouped by project
  - `GET /rows/:id` — full `MonitorRowDetail` for inline rendering
  - `POST /rows/:id/delete` — drops the whole row
  - `POST /rows/:id/strip` — mutates `diffJsonBlob` to drop selected `(address, key)` pairs

Both mutations optionally take `addToIgnoreWatchMode` and promote the stripped field names into `overrides[address].ignoreInWatchMode` in `config.jsonc` via `jsonc-parser` (comment-preserving). Structural keys that are not valid `ignoreInWatchMode` entries (proxy escapes, `accessControl.*` subtrees) are skipped.

### Cascade semantics

| Action | DB effect | `activity.json` effect | `config.jsonc` effect (if toggle on) |
|---|---|---|---|
| Strip selected fields | `updateDiff` removes the chosen `(address, key)` pairs; if the entire diff becomes empty the row is deleted | Walks the matching grouped event's `changes[]` array and prunes the requested fields. Drops the event when `changes[]` becomes empty | Merges only the chosen fields per contract |
| Delete whole row | `deleteById` drops the row | Drops every event tagged with that `updateNotifierId` | Merges every field that was on the row |

After either action, `safeCompile()` recompiles the project's review so `compiled-review.json` reflects the cleanup immediately. A compile error is returned in `MutationResult.recompile` without rolling back the mutation.

## Continuous Monitoring Service

Runs daily at 08:00 CET via GitHub Actions cron (`.github/workflows/monitor.yml`). Performs change detection, funds refresh, activity reconciliation, and review compilation for every project listed in `packages/config/src/defidisco-config.json`.

- **Entry**: `packages/backend/src/defidisco-monitor.ts` — standalone process (not the full L2BEAT backend)
- **Orchestrator**: `packages/backend/src/modules/defi-update-monitor/defidisco/DefidiscoMonitorApplication.ts`
- **Config**: `monitorConfig.ts` — standalone config from env vars (does NOT use full `makeConfig()`)
- **Dockerfile**: `Dockerfile.monitor` — multi-stage build with GH Actions layer caching
- **Run mode**: `RUN_ONCE=true` → `app.runOnce()` → single cycle then clean exit
- **Database**: Neon free tier PostgreSQL (stores discovery cache and update monitor snapshots)

### Monitor cycle

For each project in `defidisco-config.json`:

1. **Discovery** — `runner.run()` via Etherscan V2 API
2. **Diff** — `diffDiscovery(sanitize(prev), sanitize(curr))`
3. **Notify** — Discord message via `UpdateNotifier` when changes are detected
4. **Store + write-back** — upsert discovery snapshot to PostgreSQL **and** write the fresh `discovered.json` back to the project folder. The GH Actions workflow mounts that directory into the container and commits the updated files, so `$pastUpgrades` and the activity feed stay in sync between manual `l2b discover` runs. Write-back failures are logged but do not abort the project update — the DB snapshot is the source of truth for diffing
5. **Funds refresh** — `fetchAllFundsForProject()` via in-process defiscan-endpoints
6. **Activity reconcile** — loads `activity.json`, fetches new `UpdateNotifier` rows via `getNewerThanId(project, cursor)`, classifies them, appends new events, advances the cursor, writes the file
7. **Compile** — `ReviewCompiler.compile()` reads the just-refreshed `discovered.json` and merges `activity.json` events into `CompiledReview.activity`, writing `compiled-review.json` to `defiscan-frontend/public/data/<slug>/`

After all projects are processed, a cycle summary is posted to Discord (project count, duration, change count).

### Pre-compilation guards

Compilation is skipped silently (log only, no Discord noise) when:

- `review-config.json` is missing
- `call-graph-data.json` is missing

Discovery, diff, and funds refresh still run regardless.

### What the monitor does NOT do

- Re-run call graph analysis (Slither)
- Re-run permission detection (AI or manual)
- Modify permission overrides, function scores, or review descriptions
- Push compiled reviews to a hosted database

### Import paths

The monitor runs compiled JS, so imports use build output paths:

- `@l2beat/defiscan-endpoints/build/...` (not `src/`)
- `@l2beat/l2b/dist/...` (not `src/`)

## Discovery Handlers

Custom DeFiDisco handlers live under `packages/discovery/src/discovery/handlers/defidisco/`. They extend the discovery engine with specialized analysis for DeFi-specific patterns.

### AddressMappingHandler

Type name: `addressMapping`.

Maps addresses from `discovered.json` by calling a view/pure method that returns `bool`. Useful for discovering which known contracts are registered in a given contract (e.g. `isMember(address)`, `isWhitelisted(address)`).

**Config parameters:**

- `method` — method name to call; defaults to the field name
- `discoveredJson` — path to `discovered.json`; defaults to `./discovered.json`
- `ignoreRelative` — whether to ignore relative refs

**Example:**

```json
{ "handler": { "type": "addressMapping", "method": "isMember" } }
```

### EnumerableRolesHandler

Type name: `enumerableRoles`.

Enumerates roles and their holders in contracts using the EnumerableRoles pattern (OpenZeppelin AccessControl variant). Discovers role hashes from `RoleSet` events, maps them to human-readable names from source, and queries current members.

**Config parameters:**

- `roleNames` — manual `Record<hash, name>` mappings to supplement source-derived names
- `pickRoleMembers` — return only this role's members array instead of the full role object
- `flatDir` — path to `.flat/` source files; defaults to `./.flat`
- `ignoreRelative` — whether to ignore relative refs

**Example:**

```json
{ "handler": { "type": "enumerableRoles", "pickRoleMembers": "ADMIN_ROLE" } }
```
