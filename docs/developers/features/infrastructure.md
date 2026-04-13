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

**Factory-level TVL aggregation**: For protocols that deploy many child contracts (e.g., Uniswap V2 pairs, Frankencoin positions), aggregate funds tracking fetches total TVL via a handler-specific data source instead of tracking each contract individually.

**How it works**:
1. Researcher tags a factory contract with `fetchAggregate: true` and selects an `aggregateHandler` (e.g., `uniswap-v2-factory`)
2. When funds are fetched, l2b calls `defiscan-endpoints /aggregate` endpoint with the handler name
3. The endpoint dispatches to the matching handler. If the handler is unknown, the endpoint returns a 500 error (not silent zeros)
4. Aggregate data is stored in `funds-data.json` under the `aggregate` field
5. The review compiler includes aggregate-tagged contracts in `compiled-review.json` even without a `review-config.json` entry
6. `compile-data.ts` adds aggregate values to per-protocol `totalCapitalAtRisk` (counts as TVL)

**Aggregate endpoint** (`GET /aggregate`):
- `contract_address` (required): Ethereum address of the factory/hub contract
- `handler` (required): Handler name (e.g., `uniswap-v2-factory`, `frankencoin-mintinghub`)
- `chain_id` (optional): Chain identifier, defaults to `eth`
- `force_refresh` (optional): `"true"` to bypass cache
- Returns `AggregateResponse` with `total_usd_value`, `contract_count`, `breakdown[]`, `timestamp`, `source`
- Unknown handler → 500 error with available handler names listed

**Available handlers**:

| Handler | Data source | API key required | Notes |
|---------|-------------|-----------------|-------|
| `uniswap-v2-factory` | The Graph subgraph | Yes (`THEGRAPH_API_KEY`) | Uses factory address in subgraph query |
| `frankencoin-mintinghub` | Frankencoin public API (`api.frankencoin.com`) | No | Filters positions by MintingHub version (V1 vs V2) based on the contract address |

**UI**:
- `FundsTagsButton.tsx` — "Fetch Aggregate" checkbox, handler dropdown (`KNOWN_AGGREGATE_HANDLERS`), label text input
- `FundsSection.tsx` — Separate "Aggregate Funds" section with green badge, handler info, expandable breakdown
- Frontend `FundCards.tsx` / `FundsTab.tsx` — Aggregate value included in TVL totals, "Aggregate (N)" badge on rows

**Adding new handlers**:
1. Create handler class in `packages/defiscan-endpoints/src/services/aggregate/handlers/`
2. Implement `AggregateHandler` interface (`name` + `fetch(address, chain)` → `AggregateResponse`)
3. Register in `server.ts` constructor array
4. Add handler name to `KNOWN_AGGREGATE_HANDLERS` in `FundsTagsButton.tsx`
5. Handlers receive the `contractAddress` and can use it to filter results (e.g., Frankencoin filters by MintingHub version)

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
THEGRAPH_API_KEY=your-thegraph-api-key  # Required for uniswap-v2-factory handler (not needed for frankencoin-mintinghub)
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
- **Pages**: Landing (hero + stats + protocol table), Gallery (`/gallery` — card grid), Review (3 views: Report, Explorer, Activity), Compare (side-by-side charts), About (mission, methodology, team)
- **Navigation**: Header "Reports" link → `/gallery`. "Back to gallery" in ReviewPage → `/gallery`. Landing "Browse Gallery" CTA → `/gallery`. Old `/protocols` list page still exists but is no longer linked from the main nav.
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

### Gallery Page (`/gallery`)

**Protocol card grid**: browseable directory of all reviewed protocols.

- **Component**: `packages/defiscan-frontend/src/pages/gallery/GalleryPage.tsx`
- **Layout**: 3-column card grid (responsive: 1-col mobile, 2-col tablet), 12 cards per page with pagination
- **Each card shows**: Protocol name, chain, type, TVS, admin count, dependency count, points of trust (permissioned functions with fund impact, excluding Immutable admins), last activity, small radar chart, status badge
- **Status badge**: `ACTIVE` by default; `ATTENTION` if any upgrade event in `review.activity` occurred within the last 7 days
- **Points of Trust**: Count of admin functions with `impact === 'critical'` (non-Immutable admins) + dependency functions with `directFundsUsd > 0`, `directTokenValueUsd > 0`, or `reachableContracts.length > 0`
- **Filters**: ECOSYSTEM (chain), TYPE (projectType), STATUS (active/attention multi-select)
- **Radar chart**: Same 5-axis `deriveRadarData()` logic as the report hero — CONTROL, DEPENDENCIES, ACCESS, VERIFIABILITY, ABILITY TO EXIT
- **Data**: Uses `useIndex()` for the protocol list and `useAllReviews()` to load all compiled reviews for status + radar derivation

### Report Page Redesign

The report view received a full visual redesign:

- **Page background**: Entire `ReviewPage` is `bg-white`; hero section no longer has a bottom border
- **Hero (`HeroSection.tsx`)**:
  - Green "Active" badge (bg `#059669`, white bold 10px uppercase text, `px-[10px] py-[2px] rounded-[2px]`) to the left of the "Updated:" date
  - Description clamped to 3 lines with a "Show more" button to expand
  - Radar card background: `bg-[#f8fafc]` (slate-50)
  - Layout: `col-span-7` text / `col-span-5` radar chart
- **Outer frame pattern** (shared by Admins, Dependencies, TVS, Activity sections):
  - Outer container: `bg-bg-card border border-border rounded-lg p-5 sm:p-[33px]`
  - Section label row at top with icon + uppercase label + ShowMore button (top-right, opens a modal with the full explorer tab content)
  - Inner white card: `bg-white border border-border rounded-lg` for detailed content
  - Sidebar stats card: same `bg-bg-card` as outer frame, no border (visually blends in)
- **ShowMore modals** (`ReportView.tsx` + `Modal.tsx`):
  - Modal chrome matches the outer-frame branding: `bg-bg-card` background, `rounded-lg border border-border`, uppercase bold `[11px]` label header (same style as `SectionHeader`), round bordered close button (matches `CarouselNav` style)
  - Tabs render inside with `variant="modal"` — hides heavy visualizations (`FundsTab` stacked bar chart, `DepsTab` `DependencyRiskDiagram`) so the modal shows the table content only. `AdminsTab` / `GovernanceTab` accept the `variant` prop for parity even though they don't currently branch on it
- **Admins section (`AdminsSection.tsx`)**:
  - "ADMINISTRATIVE CONTROL" label, ShowMore button in outer frame header
  - Inner white card: top 3 admins sorted by `totalReachableCapital` descending
  - Sidebar stats: Impacted TVS % and admin count
  - **Empty state** (no admins or all Immutable): full frame with centered shield icon + "No permissioned resources" + zeroed stats sidebar
- **Dependencies section (`DependenciesSection.tsx`)**:
  - "DEPENDENCIES" label, ShowMore button in outer frame header
  - Groups sorted by total funds descending, top 3 shown
  - **Empty state**: full frame with centered shield icon + "No external dependencies detected" + zeroed stats sidebar
- **TVS section (`TVSSection.tsx`)**:
  - "TOTAL VALUE SECURED" label, ShowMore button in outer frame header
  - Left sidebar stats (blends with outer frame): Total TVS, include-tokens checkbox, contracts count
  - Right white card: "TVS Distribution" donut chart + legend
- **Activity section (`ActivitySection.tsx`)**:
  - "PROTOCOL ACTIVITY" label, ShowMore button in outer frame header
  - Shows last 3 events; vertical ellipsis (⋮) button at bottom when more exist (triggers ShowMore)
  - **Row layout**: bold contract name as title (with optional `(entity)` suffix for dependencies), then a descriptive sentence below it. Sentence text comes from `describeActivityEvent(event, { omitName: true })` (in `pages/review/views/activityDescription.ts`). When the event has implementation addresses, they're appended inline as clickable Etherscan links via `etherscanUrl()`. Date and tx hash live in a third metadata line.
  - **Tx links** use `etherscanTxUrl()` (in `utils/format.ts`), not `etherscanUrl()` — the latter is for addresses and produces a broken `/address/<txhash>` URL.
  - **Empty state**: full frame with centered shield icon + "No protocol changes recorded yet."
- **Governance section (`GovernanceSection.tsx`)**:
  - ShowMore button hidden when no governance admins (only shown when `governanceAdmins.length > 0`)
  - **Empty state** (no governance admins): white inner card with centered shield icon + "No governance system detected"
- **`dependencyEntityGroups` (anti-double-counting)**: The report page groups deps by entity and previously summed `dep.totalFundsAtRisk` per group — double-counting when multiple deps of the same entity reach the same contracts. The compiler now emits a `dependencyEntityGroups` array with per-entity deduplicated totals. `DependenciesSection.tsx` uses these for bar chart values and the "Impacted TVS" stat, with a fallback for old compiled reviews.
- **Source Code section (`CodeQualitySection.tsx`)**:
  - Audits sorted newest-first by `date` (format `yyyy-mm`, lexicographic sort)
  - Bug Bounty row is a clickable `<a>` linking to the bounty audit entry's URL (when a `bounty`-bearing audit exists)
  - Source code resources (`type: 'source-code'` / `type: 'github'`) are **excluded** from the Audit Reports carousel — only `audits[]` entries appear there
- **Footer (`Footer.tsx`)**: Uses the same full logo (`defiscan-logo-blue.svg`) as the header

### Shareable Report View

The Report view (`ReportView.tsx`) includes sharing and export capabilities:

- **PDF Export**: Expands all collapsible sections via `flushSync` then triggers `window.print()`. A print-only branded header is rendered. Sections collapse back via `afterprint` event listener
- **Share Dropdown**: Copy link, share on X (Twitter), share on Farcaster. Menu closes on outside click via `mousedown` listener
- **Export for AI**: Converts the compiled review to markdown via `exportMarkdown.ts` utility and copies to clipboard
- **Section Navigation**: Sticky nav bar with `IntersectionObserver`-based active section tracking and smooth scroll-to-section

### Activity Feed

**Contract upgrade timeline**: Third top-level view in defiscan-frontend (alongside Report and Explorer), showing a chronological history of protocol changes.

- **Data Source**: `$pastUpgrades` field on proxy contracts in `discovered.json` — each tuple contains `[isoTimestamp, txHash, implementationAddresses[]]`
- **Compilation**: `reviewCompiler.ts` extracts upgrade events during `buildCompiledReview()`, iterating `discovery.entries` for contracts with `$pastUpgrades`. All contracts are included (dependency contracts are tagged with `isDependency: true` and their `entity` name). Events sorted newest-first into `CompiledReview.activity?: ActivityEvent[]`
- **Types**: `UpgradeEvent { type, timestamp, contractAddress, contractName, txHash, implementations, isDependency?, entity? }` — defined in both `reviewCompiler.ts` (backend) and `types.ts` (frontend). `isDependency` is true for external/dependency contracts (from `isExternal` contract tag), `entity` carries the entity name (e.g. "Circle"). `ActivityEvent` is a union type (currently just `UpgradeEvent`, will expand with monitored change events)
- **Shared description helper**: `pages/review/views/activityDescription.ts` exports `describeActivityEvent(event, { omitName? })` — produces a narrative sentence like `"Compound Governor was upgraded to 2 new implementations."` (full form) or `"Upgraded to a new implementation."` (`omitName: true`, when the caller renders the contract name separately as a title). Used by both `ActivityView.tsx` and `report/ActivitySection.tsx` so the wording stays in sync.
- **View Component** (`pages/review/views/ActivityView.tsx`): Figma-based design (`figma.com/design/Em7lwm76VJFXso4Rs372w1?node-id=1-993`). Top-to-bottom:
  1. **Hero**: green logo square (protocol initial) + protocol name (h1) + clamped 3-line description on the left, stats grid card on the right with three cells — Total Updates (`events.length`), Monitored Contracts (`review.totals.contractCount`), Last Verified (relative time from `review.compiledAt`, e.g. `2m ago`).
  2. **Notification Channels**: heading + subtitle, then a single Telegram card in a disabled state (`opacity-60`, `cursor-not-allowed`, "UPCOMING" subtitle, "SOON" pill on the right). Email and Webhook channels from the Figma are intentionally not shown — they're not real features yet.
  3. **Protocol Activity table** inside a bordered card (`bg-white`, `border-border`, `rounded-xl`): columns `Date | Update Type | Description | Source | Severity`. Date is JetBrains Mono `YYYY-MM-DD HH:mm`. Update Type is a small pill — red "Contract Upgrade" for non-dependency events, purple "Dependency Upgrade" for `isDependency: true`. Description renders `describeActivityEvent(event)` (full form). Source is a tx-hash link via `etherscanTxUrl()` (not `etherscanUrl()` — that's for addresses). Severity is a rounded pill — red "High" (with triangle warning icon) for non-dependency, green "Info" (with info icon) for dependency. A `<sm` mobile fallback renders stacked cards instead of a table.
  4. **Pagination**: client-side, 10 events per page, only shown when `sorted.length > 10`. Compact page list (first/last/current ± 1, ellipses), prev/next chevrons, "Showing X-Y of N updates" footer.
  - **Empty state** (no upgrades): hero and notification channels still render; the table card body shows a centered clock icon + "No activity recorded yet." The sort-direction toggle is hidden when empty.
- **Page chrome** (`ReviewPage.tsx`): On the activity view, the `ViewModeToggle` is hidden — activity is treated as a child of the report, not a sibling. The back link reads "Back to report" and routes to `/protocol/${slug}?view=report` instead of `/gallery`. Explorer view keeps the toggle and the "Back to gallery" link.
- **View Registration**: `ViewModeToggle.tsx` has three modes (`report | explorer | activity`), `ReviewPage.tsx` lazy-loads `ActivityView`
- **Future**: Monitored field-level changes from the PostgreSQL UpdateNotifier table will be added as a second event type (`MonitoredChangeEvent`)

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
- See `reviewCompiler.ts` in `packages/l2b/` for TypeScript interfaces: `CompiledReview`, `CompiledAdmin`, `CompiledDependency`, `CompiledFundHolder`, `CompiledFunction`, `CompiledContract`, `ActivityEvent`, `UpgradeEvent`
- **Activity data**: `activity?: ActivityEvent[]` — upgrade events extracted from `$pastUpgrades` in `discovered.json` during compilation. Each event carries `isDependency` and `entity` fields from contract tags

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

## Discovery Handlers

Custom DeFiDisco handlers in `packages/discovery/src/discovery/handlers/defidisco/`. These extend the discovery engine with specialized analysis for DeFi-specific patterns.

### AddressMappingHandler

**Type name**: `addressMapping`

**Purpose**: Maps addresses from `discovered.json` by calling a view/pure method that returns `bool`. Useful for discovering which known contracts are registered in a given contract (e.g., `isMember(address)`, `isWhitelisted(address)`).

**Config parameters**:
- `method` (optional) — method name to call; defaults to the field name
- `discoveredJson` (optional) — path to `discovered.json`; defaults to `./discovered.json`
- `ignoreRelative` (optional) — whether to ignore relative refs

**How it works**:
1. Loads all contract addresses from `discovered.json`
2. For each candidate, calls `method(address) → bool`
3. Returns addresses where the method returns `true` (chain-prefixed format)

**Example config**:
```json
{ "handler": { "type": "addressMapping", "method": "isMember" } }
```

### EnumerableRolesHandler

**Type name**: `enumerableRoles`

**Purpose**: Enumerates roles and their holders in contracts using the EnumerableRoles pattern (OpenZeppelin AccessControl variant). Discovers role hashes from `RoleSet` events, maps them to human-readable names from source, and queries current members.

**Config parameters**:
- `roleNames` (optional) — manual `Record<hash, name>` mappings to supplement source-derived names
- `pickRoleMembers` (optional) — return only this role's members array instead of the full role object
- `flatDir` (optional) — path to `.flat/` source files; defaults to `./.flat`
- `ignoreRelative` (optional) — whether to ignore relative refs

**How it works**:
1. Scans `.sol` files for `bytes32 public constant NAME = keccak256("NAME")` declarations
2. Merges with user-provided `roleNames`
3. Fetches all historical `RoleSet(holder, role, active)` events to discover role hashes
4. Calls `roleHolders(roleHash)` for each role to get current members
5. If `pickRoleMembers` is set, returns that role's members; otherwise returns all roles as an object

**Example config**:
```json
{ "handler": { "type": "enumerableRoles", "pickRoleMembers": "ADMIN_ROLE" } }
```

### Discovery Agent Skill

The `/run-discovery` Claude Code skill (`.claude/skills/run-discovery/SKILL.md`) automates iterative discovery for a project. It runs discovery, classifies new contracts, tags them as external/governance/funds, prunes external protocols, and optionally adds handlers.

**Usage**: `/run-discovery <project-name> [--auto]`

- Default mode pauses after each iteration for user review
- `--auto` runs all iterations autonomously

### Watch Field Pruning Agent Skill

The `/prune-watch-fields` Claude Code skill (`.claude/skills/prune-watch-fields/SKILL.md`) analyzes all discovered fields on every contract and classifies them for watch-mode monitoring. Fields that change frequently but are not security-critical (supply counters, nonces, oracle reads, reward accumulators) get added to `ignoreInWatchMode` in `config.jsonc`, reducing false-positive alerts during continuous monitoring.

**Usage**: `/prune-watch-fields <project-name>`

**Classification tiers**:
- **NEVER IGNORE (Tier 1)** — Security-critical fields that must always be monitored: proxy fields (`$admin`, `$implementation`), ownership (`owner`, `pendingOwner`), access control (`accessControl`, `*_ROLE`), governance parameters (`votingDelay`, `quorumNumerator`), fee rate settings, and fields with permission metadata.
- **SAFE TO IGNORE (Tier 2)** — High-confidence safe fields: supply aggregates (`totalSupply`, `totalAssets`), counters/nonces, batch/block state, queue pointers, timestamps, price/oracle reads, reward index accumulators, and fee running totals.
- **UNCERTAIN (Tier 3)** — Everything else, sub-categorized for reviewer input (address fields, booleans, small numerics, complex structs).

**Safety cross-checks**: After initial classification, address values are rechecked (an address in a "safe" name pattern gets reclassified to uncertain), permission metadata is verified, and HIGH severity fields are flagged.

**Integration with `/run-discovery`**: Available as an optional final step after discovery completes. Can also be run standalone on any project with an existing `discovered.json`.
