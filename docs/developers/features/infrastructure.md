# Infrastructure Features

## DeFiScan Panel

**Overview Panel**: Contract analysis dashboard in `/defidisco/DeFiScanPanel.tsx`

- **Status Section**: Initial vs discovered contract counts, address type breakdown
- **Contract Types**: Contracts, EOAs, Multisigs, External addresses
- **Permissions Dashboard**: Shows permissioned functions count and review progress
- **Data Sources**: Uses `getProject`, `useContractTags`, and `getPermissionOverrides` APIs
- **Integration**: Registered in `ProjectPage.tsx` and `store.ts` following panel patterns

## External Contract Attributes

**Contract Tagging Enhancement**: Extended contract tags with entity grouping

- **Data Structure**: `contract-tags.json` stores `entity` (string, e.g. "Chainlink", "Uniswap") to group external contracts by provider
- **UI Component**: `/defidisco/ExternalButton.tsx` with entity selector popup; `/defidisco/EntitySelector.tsx` (shared reusable component)
- **Features**:
  - Mark contracts as external/internal
  - Entity selector (dropdown of existing entities + "+" to create new) — spelling-safe
- **Hook**: `useProjectEntities(project)` in `useContractTags.ts` extracts unique entity names from project tags
- **Backend**: `/defidisco/contractTags.ts` preserves attributes across updates; entity accepts `null` to clear
- **Address Format**: Normalizes `eth:0x...` -> `0x...` when comparing with tags

## Governance Contract Tag

**Binary tag**: `isGovernance` in `contract-tags.json`, green in graph view

- **UI**: `GovernanceButton.tsx` (node controls toggle), `GovernanceIndicator.tsx` (Values panel label, rendered inside `ExternalIndicator.tsx`)
- **Node Coloring**: `useContractTagColor` hook in `useContractTags.ts` maps tags -> color override. Priority: Unknown (red) > External (orange) > Governance (green) > Chain color
- **Admin Filtering**: "Key owners" (shown by default) = EOA, EOAPermissioned, Multisig, or governance-tagged. "Show all contracts" checkbox reveals the rest

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

- **File Location**: `packages/config/src/projects/{project}/contract-tags.json`
- **Fields**: `isExternal` (boolean), `isGovernance` (boolean), `entity` (string, groups external contracts by provider), `fetchBalances` (boolean), `fetchPositions` (boolean), `isToken` (boolean), `fetchAggregate` (boolean), `aggregateHandler` (string), `aggregateLabel` (string)
- **Update Pattern**: Backend preserves existing attributes when updating individual fields
- **Cleanup**: When all boolean tag fields (`isExternal`, `isGovernance`, `fetchBalances`, `fetchPositions`, `isToken`, `fetchAggregate`) are false, the entry is removed from the file

## Funds Tracking

**Contract Funds Data**: Fetches and displays token balances and DeFi positions for contracts

- **Data Source**: Uses `defiscan-endpoints` service (calls DeBank API for balances/positions)
- **Storage**: `funds-data.json` per project in `packages/config/src/projects/{project}/`
- **UI Component**: `FundsSection.tsx` in DeFiScan panel (between V2 Scoring and Status of Review)
- **Control Button**: `FundsTagsButton.tsx` - toggle "Fetch Balances" / "Fetch Positions" per contract

### Enabling Funds Fetching

1. Select contract(s) in the graph view
2. Click "Funds" button in controls
3. Check "Fetch Token Balances" and/or "Fetch DeFi Positions"
4. In DeFiScan panel, click "Fetch Funds" button to retrieve data

### Contract Tags Extension

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

### Funds Data Structure (`funds-data.json`)

```json
{
  "version": "1.0",
  "lastModified": "2025-12-09T...",
  "contracts": {
    "eth:0x123...": {
      "balances": {
        "tokens": [{ "symbol": "ETH", "usdValue": 1000 }],
        "totalUsdValue": 5000,
        "timestamp": "...",
        "source": "debank"
      },
      "positions": {
        "protocols": [{ "name": "Aave", "totalUsdValue": 10000 }],
        "totalUsdValue": 10000,
        "timestamp": "...",
        "source": "debank"
      },
      "aggregate": {
        "totalUsdValue": 748000000,
        "contractCount": 491000,
        "handlerName": "uniswap-v2-factory",
        "timestamp": "...",
        "source": "thegraph-uniswap-v2"
      },
      "lastFetched": "2025-12-09T...",
      "error": null
    }
  }
}
```

### Running with Funds Support

```bash
# Option 1: Start defiscan-endpoints separately
cd ~/defidisco/packages/defiscan-endpoints && pnpm start
# In another terminal:
cd ~/defidisco/packages/config && l2b ui

# Option 2: Use startup script
cd ~/defidisco/packages/l2b && ./scripts/start-with-funds.sh
```

### Aggregate Funds

**Factory-level TVL aggregation**: For protocols that deploy many child contracts (e.g., Uniswap V2 pairs), aggregate funds tracking fetches total TVL from a single subgraph query instead of tracking each contract individually.

**How it works**:
1. Researcher tags a factory contract with `fetchAggregate: true` and selects an `aggregateHandler` (e.g., `uniswap-v2-factory`)
2. When funds are fetched, l2b calls `defiscan-endpoints /aggregate` endpoint with the handler name
3. The endpoint dispatches to the matching handler (e.g., `UniswapV2FactoryHandler` queries The Graph subgraph)
4. Aggregate data is stored in `funds-data.json` under the `aggregate` field
5. The review compiler includes aggregate-tagged contracts in `compiled-review.json` even without a `review-config.json` entry
6. `compile-data.ts` adds aggregate values to per-protocol `totalCapitalAtRisk` (counts as TVL)

**UI**:
- `FundsTagsButton.tsx` — "Fetch Aggregate" checkbox, handler dropdown (`KNOWN_AGGREGATE_HANDLERS`), label text input
- `FundsSection.tsx` — Separate "Aggregate Funds" section with green badge, handler info, expandable breakdown
- Frontend `FundCards.tsx` / `FundsTab.tsx` — Aggregate value included in TVL totals, "Aggregate (N)" badge on rows

**Adding new handlers**:
1. Create handler class in `packages/defiscan-endpoints/src/services/aggregate/handlers/`
2. Implement `AggregateHandler` interface (`name` + `fetch(address, chain)` → `AggregateResponse`)
3. Register in `server.ts` constructor array
4. Add handler name to `KNOWN_AGGREGATE_HANDLERS` in `FundsTagsButton.tsx`

**Files**:
- Endpoint: `packages/defiscan-endpoints/src/routes/aggregate.ts`
- Service: `packages/defiscan-endpoints/src/services/aggregate/AggregateService.ts`
- Handlers: `packages/defiscan-endpoints/src/services/aggregate/handlers/`
- Types: `packages/defiscan-endpoints/src/types/api.ts` (`AggregateResponse`)

### Environment Configuration (defiscan-endpoints/.env)

```bash
DEBANK_API_KEY=your-debank-api-key
PORT=3001
ETHEREUM_RPC_URL_FOR_DISCOVERY=https://your-rpc-url  # Optional: enables Morpho vault onchain positions
THEGRAPH_API_KEY=your-thegraph-api-key  # Required for aggregate handlers using The Graph
```

### Morpho Vault Onchain Positions

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

### API Endpoints

- `GET /api/projects/:project/funds-data` - Get cached funds data
- `POST /api/projects/:project/funds-data/fetch` - Trigger fetch (SSE for progress)

### Files

- Backend: `packages/l2b/src/implementations/discovery-ui/defidisco/fundsData.ts`
- Frontend: `packages/protocolbeat/src/apps/discovery/defidisco/FundsSection.tsx`
- Control: `packages/protocolbeat/src/apps/discovery/defidisco/FundsTagsButton.tsx`
- Aggregate endpoint: `packages/defiscan-endpoints/src/routes/aggregate.ts`
- Aggregate service: `packages/defiscan-endpoints/src/services/aggregate/`
- Aggregate handlers: `packages/defiscan-endpoints/src/services/aggregate/handlers/`

## DeFiScan Frontend

**Standalone public review website**: React app that renders compiled reviews for end users.

- **Package**: `packages/defiscan-frontend/` (Vite + React + TailwindCSS + Recharts)
- **Data Model**: Static JSON — reads pre-compiled `compiled-review.json` from `public/data/<slug>/`
- **Build Script**: `scripts/compile-data.ts` — aggregates compiled reviews into `public/data/index.json` with global stats, entity-grouped dependency counts, and active admin counts (excludes Immutable/Revoked)
- **Pages**: Landing (protocol table + stats), Review (3 views: Report, Explorer, Dashboard), Compare (side-by-side charts), About (mission, methodology, team)
- **Explorer Tabs** (in order): Overview, Funds, Admins, Governance, Dependencies, Contracts
  - **Admins tab**: Shows non-governance human admins only (`getHumanAdmins().filter(!isGovernance)`)
  - **Governance tab**: Shows governance contracts only (`admins.filter(isGovernance)`), same table layout as Admins but without the Type column
- **TVS Metric**: "Total Value Secured" = TVL (tokens held in contracts) + protocol token market cap. Used consistently across landing page table and report view fund charts
- **Landing Page**: Protocol table with sortable TVS column showing combined value + muted breakdown `($TVL + $Token)` when both are non-zero
- **Report View — Fund Chart**: Unified stacked bar chart with purple (TVL) + amber (token market cap) segments. "Include Protocol Tokens" checkbox (default: checked) toggles between TVS and TVL-only modes. Legend explains the two color palettes
- **Report View — Mitigation Badges**: Admin and dependency card rows display inline deduplicated mitigation badges (from `deduplicateMitigations()`) next to entity names, matching the explorer tab pattern
- **Key Findings**: Narrative-generated info cards include a mitigations finding (coverage + types) when mitigations exist, and a TVS finding showing the value breakdown
- **Deployment**: Vercel with SPA rewrites (`vercel.json` — excludes `/data/` from rewrites)
- **Commands**: `pnpm dev` (dev server), `pnpm build` (production build, runs compile-data first)
- **Detailed Docs**: See `packages/defiscan-frontend/README.md`

### Shareable Report View

The Report view (`ReportView.tsx`) includes sharing and export capabilities:

- **PDF Export**: Expands all collapsible sections via `flushSync` then triggers `window.print()`. A print-only branded header is rendered. Sections collapse back via `afterprint` event listener
- **Share Dropdown**: Copy link, share on X (Twitter), share on Farcaster. Menu closes on outside click via `mousedown` listener
- **Export for AI**: Converts the compiled review to markdown via `exportMarkdown.ts` utility and copies to clipboard
- **Section Navigation**: Sticky nav bar with `IntersectionObserver`-based active section tracking and smooth scroll-to-section

## Continuous Monitoring Service

**Automated change detection, funds refresh, and review compilation**: Runs daily at 8:00 CET via GitHub Actions cron.

- **Entry Point**: `packages/backend/src/defidisco-monitor.ts` — standalone process (not the full L2Beat backend)
- **Orchestrator**: `packages/backend/src/modules/defi-update-monitor/defidisco/DefidiscoMonitorApplication.ts`
- **Config**: `packages/backend/src/modules/defi-update-monitor/defidisco/monitorConfig.ts` — standalone config from env vars (does NOT use full `makeConfig()`)
- **Documentation**: `packages/backend/src/modules/defi-update-monitor/defidisco/README.md`
- **Scheduling**: GitHub Actions cron (`.github/workflows/monitor.yml`) — daily at 7:00 UTC / 8:00 CET + manual trigger
- **Dockerfile**: `Dockerfile.monitor` — multi-stage build, run in GH Actions with Docker layer caching
- **Database**: Neon free tier PostgreSQL (temporary)
- **Run Mode**: `RUN_ONCE=true` env var -> `app.runOnce()` — single cycle then clean exit

### Monitoring Loop (for each project in `defidisco-config.json`)

1. **Discovery**: `runner.run()` — contract analysis via Etherscan V2 API
2. **Diff**: `diffDiscovery(sanitize(prev), sanitize(curr))` — detect changes
3. **Notify**: Discord message if changes detected (via `UpdateNotifier`)
4. **Store**: Upsert discovery snapshot to PostgreSQL
5. **Funds Refresh**: `fetchAllFundsForProject()` via in-process defiscan-endpoints
6. **Compile**: `ReviewCompiler.compile()` — writes `compiled-review.json` to `defiscan-frontend/public/data/<slug>/`
7. **Cycle Summary**: Discord message after all projects (project count, duration, change count)

### Key Files

| File | Purpose |
|------|---------|
| `defidisco-monitor.ts` | Process entry point |
| `monitorConfig.ts` | Standalone config from env vars |
| `DefidiscoMonitorApplication.ts` | Orchestrator — wires Clock, DiscoveryRunner, UpdateNotifier, FundsRefresher, ReviewCompiler |
| `FundsRefresher.ts` | Wraps `fetchAllFundsForProject` from l2b |
| `ReviewCompiler` | Imported from `@l2beat/l2b` (see Review Compiler in scoring-and-review.md) |

### Pre-Compilation Guards

Before compiling, checks for required data files. If missing, skips silently (log only, no Discord noise):
- No `review-config.json` -> skipped
- No `call-graph-data.json` -> skipped
- Discovery + diff + funds refresh still run regardless

### Compiled Review (`compiled-review.json`)

- Self-contained JSON per project — exact data the defiscan-frontend needs to render a review page
- Written to `packages/defiscan-frontend/public/data/<slug>/` (alongside `funds-data.json`)
- Joins V2 scoring data (contracts, functions, admins, dependencies, capital analysis) with descriptions from `review-config.json`
- Template variables (`{{variableName}}`) resolved at compile time via `dataKeys` map
- See `reviewCompiler.ts` in `packages/l2b/` for TypeScript interfaces: `CompiledReview`, `CompiledAdmin`, `CompiledDependency`, `CompiledFundHolder`, `CompiledFunction`, `CompiledContract`

### Adding/Removing Projects

Edit `packages/config/src/defidisco-config.json` and redeploy. The monitor reads the explicit list, not the `config.jsonc` `defidisco.scanPermissions` flag.

### What It Does NOT Do (researcher actions)

- Re-run call graph analysis (Slither)
- Re-run permission detection (AI or manual)
- Modify permission overrides, function scores, or review descriptions
- Push compiled reviews to a hosted database (deferred to future task)

### Database

Currently using **Neon free tier** PostgreSQL (temporary). The database stores discovery cache, update monitor snapshots, and diff history. No user credentials or sensitive data. See README.md for security considerations and migration recommendations.

### Environment Variables

See `README.md` for full table. Key vars: `DATABASE_URL`, `DISCORD_TOKEN`, `DISCORD_CHANNEL_ID`, `ETHEREUM_RPC_URL_FOR_DISCOVERY`, `ETHERSCAN_API_KEY`, `DEBANK_API_KEY`.

### Import Paths

The monitor runs compiled JS, so imports use build output paths (not TypeScript source paths):
- `@l2beat/defiscan-endpoints/build/...` (not `src/`)
- `@l2beat/l2b/dist/...` (not `src/`)
