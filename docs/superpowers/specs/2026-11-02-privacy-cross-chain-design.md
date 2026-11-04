# Privacy dashboard: cross-chain deployments

Date: 2026-11-02. Branch: `privacy-cross-chain`. Status: design approved in
conversation, awaiting written review.

## Goal

A privacy project today is configured, indexed and displayed on one chain.
Several protocols in the catalog run the same contracts on more than one
L2BEAT-supported chain. This feature lets a project declare every chain it is
deployed on, track its statistics on the chains that matter, and lets the
reader pick a deployment on the project page.

The deliverable is one PR, a prototype that carries the framework and the
first multi-chain projects together.

## What exists already

- Discovery is one `config.jsonc` per project with chain-prefixed addresses
  (`eth:`, `arb1:`, `bnb:`, `matic:`). Fluidkey and privacy-boost already
  span several chains. `generateDiscoveryDrivenContracts` returns contracts
  grouped by chain, and the contracts and permissions sections render one
  subsection per chain.
- The backend never reads `trackedOn`. `packages/backend/src/config/features/privacy.ts`
  derives the chain of every indexer config from the bucket address, the
  registry address or the relayer source address, groups configs by chain,
  and `PrivacyModule` creates one indexer set per chain. Every privacy table
  (`PrivacyFlowEvent`, `PrivacyAnonymitySetEvent`, `PrivacyRelayerActivity`,
  `PrivacyRelayerSample`, `PrivacyBlockTimestamp`) has a `chain` column, and
  chain is hashed into every configuration id.
- `TvsEscrowValue` stores per-escrow, per-chain values with full history
  since the 2026-10-28 recompute. `TokenValue` has no chain column.
- The frontend reads the database directly. All aggregate reads are keyed by
  project id and ignore chain. `trackedOn` only produces chain icons.
- `getTokenBySymbol(symbol, chainId)` and `getTokenByAddress(address, chainId)`
  resolve tokens from `packages/config/src/tokens/generated.json`, built from
  `tokens.jsonc` by `pnpm tokens`.

## Decisions

### Scope of chains

- `deployedOn` is a new required field next to `trackedOn`. It lists every
  chain with a live deployment of the protocol, limited to chains that have a
  `chainConfig` (needed for the icon). `trackedOn` must be a subset of it.
- `trackedOn` alone drives discovery, indexing and the chain dropdown. A
  chain in `deployedOn` but not in `trackedOn` is shown as a dimmed icon and
  nothing else.
- The first entry of `trackedOn` is the primary chain. The dropdown follows
  config order.
- Tracking rule, a research policy and not a config test: a deployment is
  tracked when its pool TVL is at least $100k and it has at least 500
  distinct depositors over the trailing twelve months. The depositor half is
  checked after the first indexing run; a chain that fails is demoted to
  `deployedOn`. For key-registration protocols (Umbra) the measure is
  registrations on that chain's registry, counted with one `eth_getLogs` per
  chain before configuring.

### Projects in this PR

Per-chain TVL from DefiLlama on 2026-11-02:

| Project | Tracked additions | Deployed only |
|---|---|---|
| Railgun | arbitrum $3.1M, bsc $971k, polygonpos $431k | – |
| Tornado Cash | bsc $54.9M, arbitrum $523k | gnosis, avalanche, polygonpos, optimism |
| Privacy Boost | optimism $253k | soneium, ink |
| Umbra | decided by registration counts on optimism, polygonpos, base, arbitrum | the rest of those four |
| Fluidkey | bsc (no pools, so no tracking rule applies) | – |
| Privacy Pools v1 | – | arbitrum, optimism |

All other privacy projects get `deployedOn` equal to their `trackedOn`.

Research notes that matter for configs: Railgun on BSC and Polygon has its own
staking tokens and DAO, Arbitrum is secured by Ethereum RAIL, and Waku
broadcasters serve one chain id each. Tornado's sidechain pools share CREATE2
addresses, have no governance and no relayer registry, and route through a
shared `proxy-light`. Umbra uses the same addresses on every chain.

### Default view and aggregation

- The project page never aggregates across chains. Every number, chart and
  section is for the selected chain, and the primary chain is selected by
  default.
- The summary table sums TVL, its 7D change and 30D volume across tracked
  chains, takes the anonymity set from the primary chain, and shows the
  tracked chains as a compact icon list in the name cell.

### What the chain switch governs

- Per chain: summary stats, flows chart, anonymity set chart and coverage,
  relayer stat, TVL chart and value, assets breakdown, contracts,
  permissions, escrows.
- Project-wide, unchanged by the switch: detailed description, exit window,
  reproducibility, attributes, adversaries, risk summary, upgrades and
  governance, trusted setup, verifiers, milestones, updates. A tooltip on
  the dropdown and on the exit window says the assessment describes the
  primary chain. Per-chain overrides of exit window and governance are a
  follow-up, not this PR.
- Sections with no data on the selected chain are hidden. There is no
  per-chain `anonymitySet` type; the per-chain anonymity set is derived from
  the buckets on that chain.

### Selection mechanism

- URL query parameter `chain`, e.g. `/privacy/projects/railgun?chain=arbitrum`.
  Dropdown items are links, so hover prefetch applies.
- No parameter renders the primary chain. `?chain=<primary>` and an unknown or
  untracked chain also render the primary chain, with a canonical link to the
  bare URL.
- The page is server-rendered and cached under `['privacy', 'projects', slug,
  chain]`. The `.md` route takes the same parameter.

### Presentation

- Desktop: the dropdown sits in the project links row next to DISCO, aligned
  right. The trigger shows the current chain's icon and name. Items show icon
  and name in config order.
- Mobile: a full-width chip under the header, above the summary card, since
  the desktop links row is hidden there.
- One "Deployed on" stat replaces "Tracked on" in the summary card. It is a
  `ProjectIconList` of `deployedOn`, with untracked chains dimmed and a
  tooltip "Deployed, not tracked by L2BEAT". When `deployedOn` equals
  `trackedOn` nothing is dimmed.
- When more than one chain is tracked, the side navigation and the browser
  tab title read the project name with "on <Chain>" in smaller type beneath,
  and per-chain charts get the same subtitle under their title. The h1 is
  unchanged. Single-chain pages do not change. The Markdown export puts the
  chain in the title text, e.g. "Value Locked on Arbitrum".

### Config shape

```ts
privacyInfo: {
  deployedOn: ['ethereum', 'arbitrum', 'bsc', 'polygonpos'],
  trackedOn: ['ethereum', 'arbitrum', 'bsc', 'polygonpos'],
  tokens: ProjectPrivacyToken[]   // one entry per token and chain
  relayerTracking:
    | { type: 'onchainEvents'; sources: ProjectPrivacyOnchainRelayerSource[] }
    | { type: 'railgunWaku'; sources: { chainId: number; sinceTimestamp: UnixTime }[] }
}
```

- `ProjectPrivacyToken.token` gains a required `chain: string` (long chain
  name) so the frontend filters tokens without inspecting buckets.
- Project files declare tokens by symbol per chain and resolve them with
  `getTokenBySymbol(symbol, chainId)`; no token addresses in project files.
  Pool addresses still come from discovery. Example for Railgun:

  ```ts
  const DEPLOYMENTS = [
    { chain: 'ethereum', wallet: 'eth:0xfa70…', tokens: ['WETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'NEAR', 'FLUID', 'RAIL'] },
    { chain: 'arbitrum', wallet: 'arb1:0xfa70…', tokens: ['WETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'ARB'] },
    { chain: 'bsc', wallet: 'bnb:0x5901…', tokens: ['WBNB', 'USDT', 'USDC', 'BTCB', 'RAILBSC'] },
    { chain: 'polygonpos', wallet: 'matic:0x19b6…', tokens: ['WMATIC', 'USDC', 'USDT', 'DAI', 'WBTC', 'RAILPOLY'] },
  ]
  ```

  The exact token lists per chain are researched during implementation from
  the pools' holdings; the example shows the shape.
- Bucket ids stay unique per project across chains. Existing Ethereum ids are
  unchanged, so no Ethereum data resyncs. New chains put the chain in the id:
  `railgun-arbitrum-USDC`.
- Escrows: one per pool and token per chain, `chain` from the address prefix,
  as today.
- `ProjectDiscovery.getContract(identifier)` asserts a single match by name,
  which breaks on multi-chain discoveries with repeated contract names. Add a
  chain-aware lookup, `getContract(name, chain)` or by chain-prefixed address,
  and use it in multi-chain project files. Values used in descriptions (fees,
  delays, governance parameters) come from the primary chain.
- Config tests, in `packages/config/src/processing/getProjects.test.ts`:
  1. `deployedOn` is non-empty, has no duplicates, every entry has a
     `chainConfig`, and `trackedOn` is a subset of it.
  2. Every bucket, key registry and relayer source lives on a chain in
     `trackedOn`.
  3. Every chain in `trackedOn` has at least one bucket with an anonymity set
     or a key registry, unless `anonymitySet.type` is `not-applicable`,
     `too-small` or `partially-attributed`.
  4. Bucket ids stay unique per project (existing test).

### Tokens

- Add the BSC and Polygon PoS tokens the pools hold to
  `packages/config/src/tokens/tokens.jsonc` and run `pnpm tokens`. BSC has no
  `coingeckoPlatform`, so its entries carry an explicit `coingeckoId`.
  Non-Ethereum entries need `source` and `supply`.
- Bridged variants (USDC.e and native USDC) are separate tokens with their own
  symbols, as the token list already treats them.
- The token database (`TokenDatabase`) is not used: the config package is
  static and the TVS pipeline reads `generated.json`.

### Backend

- No change to indexers, configuration ids or tables.
- `toRelayerSampleConfig` fans out over the Waku `sources` list, one sampler
  config per chain id.
- Deployment prerequisites: `BSC_RPC_URL`, `POLYGONPOS_RPC_URL`,
  `ARBITRUM_RPC_URL`, `OPTIMISM_RPC_URL` set for the privacy backend, with
  rate limits suited to a full backfill. Everything is backfilled from each
  pool's deployment; `PRIVACY_MIN_TIMESTAMP` stays as the global bound.
- Run `pnpm tvs:generate` for the changed projects so `tvs.json` gains the
  new chains' escrows.

### Database reads

Add an optional `chain` filter, pushed into the SQL `where`, to:

- `PrivacyFlowEventRepository`: `getDailyByProjectIds`,
  `getBucketTotalsByProjectIds`, `getNonZeroDepositCount`,
  `getLatestTimestampByProjectIds`, `getFirstTimestampByProjectIds`
- `PrivacyAnonymitySetEventRepository`: `getSenderDaysByProjectIds`,
  `getDepositCount`
- `PrivacyRelayerActivityRepository.getActiveRelayerCount`
- `PrivacyRelayerSampleRepository.getAverageRelayerCount`

Add `TvsEscrowValueRepository.getDailyValueByProjectAndChain(projectId,
chain, from, to)`: the sum of `value` per day over the project's escrows on
that chain, taking the last timestamp per day. This feeds the per-chain TVL
chart. The current per-chain TVL is the same sum at the latest timestamp.

An index `(projectId, chain, timestamp)` on the flow and anonymity set tables
is added if the filtered queries are slow on the Tornado volumes.

### Frontend

- `PrivacyRouter`: read `req.query.chain`, validate against the project's
  `trackedOn`, resolve to the primary chain otherwise, include it in the cache
  key and pass it to `getPrivacyProjectData` and the Markdown route.
- `getPrivacyProjectDetails(slug, chain)`: filter tokens by `token.chain`,
  buckets by address chain, contracts and permissions by key, escrows by
  `chain`; pass `chain` to every repository read; compute the relayer stat for
  that chain; build `deployedOn` icons with the tracked flag.
- `ProjectPrivacyEntry` gains `chain`, `chains` (tracked chains with icon,
  name, href) and `deployedOn`. `trackedOn` is removed from the entry.
- tRPC inputs `privacy.flowsChart`, `privacy.anonymitySetChart` gain
  `chain?: string`. A new `tvs.chartByProjectChain({ projectId, chain, range })`
  serves the per-chain TVL chart; `TvsValueSection` takes an optional chain
  and calls it when set. The summary page keeps calling the existing
  procedures without a chain.
- New `PrivacyChainSwitcher` component, modelled on
  `ProjectVersionSwitcher` for the chip style and `ChainSelect` for the icon
  label, rendering links. Placed in `DesktopProjectLinks` row on desktop and
  under the header on mobile.
- `ProjectSummaryStat` "Deployed on" with a `ProjectIconList` that supports a
  dimmed state and per-item tooltip.
- Side navigation header and `<title>` take an optional second line. Chart
  section titles take an optional subtitle.
- `getPrivacySummaryEntries`: unchanged aggregation, plus `chains` for the
  name cell; anonymity set read with `chain = primary`.

## Data flow for one request

`GET /privacy/projects/railgun?chain=arbitrum` → router validates `arbitrum`
against `trackedOn`, cache key `['privacy','projects','railgun','arbitrum']`
→ `getPrivacyProjectDetails('railgun', 'arbitrum')` filters config to the
Arbitrum tokens, buckets, escrows, contracts and permissions and reads flows,
anonymity set, relayers and escrow values with `chain = 'arbitrum'` →
`getPrivacyProjectEntry` builds sections with `chain` so chart sections query
with `chain` → page renders the switcher with Arbitrum selected and
"Railgun / on Arbitrum" in the side navigation.

## Error handling

- Unknown or untracked `chain` renders the primary chain, never a 404, and
  the canonical URL omits the parameter.
- A tracked chain with no data yet (indexer still syncing) shows the existing
  syncing states per section; sections with nothing configured on that chain
  are hidden.
- Config tests fail the build for a bucket on an untracked chain, a tracked
  chain without an anonymity source, or `trackedOn` not within `deployedOn`.
- Missing RPC env vars for a new chain fail the backend at startup through
  the existing provider asserts, which is the intended behaviour.

## Testing

- Config: the three new rules in `getProjects.test.ts`; `getTokenBySymbol`
  on the new chain ids; `ProjectDiscovery` chain-aware lookup unit test with
  two same-named contracts on two chains.
- Database: repository tests for each `chain` filter and for the per-chain
  escrow value query, with rows on two chains asserting only one is summed.
- Frontend: router test for parameter parsing, fallback and cache key;
  `getPrivacyProjectDetails` test that Arbitrum filtering drops Ethereum
  buckets, contracts and escrows; Markdown renderer test with a chain; e2e
  smoke of the switcher on the Railgun page.
- Backend: `toRelayerSampleConfig` test for the Waku fan-out; privacy config
  builder test that a multi-chain project yields configs grouped by chain.

## Out of scope, follow-ups

- Per-chain exit window, governance and adversary overrides.
- Per-chain milestones.
- Tracking Tornado's small chains, Privacy Boost on Soneium and Ink, Privacy
  Pools on Arbitrum and Optimism. Avalanche needs a `chainConfig.sinceTimestamp`
  and Soneium a discovery chain entry before either can be tracked.
- Generating `tokens.jsonc` from the token database.
