# Privacy Dashboard Amount Analysis Spec

## Goal

Add a new `Amount analysis` section to the privacy project detail pages for:

- `tornado-cash`
- `railgun`
- `privacy-pools`

The section should analyze which addresses deposit into and withdraw from the protocol, aggregate their total activity across all protocol buckets, convert token totals into USD, and visualize the result with:

- 2 bar charts:
  - deposit address-count distribution by total deposited USD
  - withdrawal address-count distribution by total withdrawn USD
- 2 line charts:
  - sorted deposit totals per address
  - sorted withdrawal totals per address

This is a demo-only feature and should be hardcoded to the three protocols above.

## Locked Product Decisions

These decisions came from the user and should be treated as final for this implementation:

- Railgun deposits:
  - do **not** apply the Relay Adapter filtering heuristic for now
- USD distribution buckets:
  - `< $100`
  - `$100 - $1K`
  - `$1K - $10K`
  - `$10K - $100K`
  - `$100K - $1M`
  - `$1M - $10M`
  - `> $10M`
- Bar charts:
  - use **absolute address counts**, not percentages
- Token coverage:
  - exclude rows whose token cannot be resolved through the existing privacy token metadata / `TICKERS`
- Tornado withdrawals:
  - drop rows where resolved address is `0x0000000000000000000000000000000000000000`
- Line charts:
  - do **not** downsample initially
  - do **not** show tooltips
- Scale controls:
  - both bar charts and line charts need an explicit `LIN / LOG` toggle
  - default is `LIN`
- Section title:
  - `Amount analysis`
- Placement:
  - render as a new section below the current `Value Locked` section
- Scope:
  - hardcode the feature to the 3 demo protocols above

## Data Sources

Read only from these static CSVs:

- [PrivacyFlowTrxs_with_amounts.csv](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/data/PrivacyFlowTrxs_with_amounts.csv)
- [tornado_cash_privacy_flow.csv](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/data/tornado_cash_privacy_flow.csv)
- [railgun_privacy_flow.csv](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/data/railgun_privacy_flow.csv)
- [privacy_pools_privacy_flow.csv](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/data/privacy_pools_privacy_flow.csv)

Use them as follows:

- Tornado deposits:
  - source: `PrivacyFlowTrxs_with_amounts.csv`
  - filter: `protocol === "tornado-cash"`
- Tornado withdrawals:
  - source: `tornado_cash_privacy_flow.csv`
- Railgun deposits:
  - source: `PrivacyFlowTrxs_with_amounts.csv`
  - filter: `protocol === "railgun"`
- Railgun withdrawals:
  - source: `railgun_privacy_flow.csv`
- Privacy Pools deposits / withdrawals / ragequits:
  - source: `privacy_pools_privacy_flow.csv`

## Exact Address Resolution Rules

Implement these rules exactly.

### Tornado Cash deposits

- Address = `tx.from`
- In the CSV this is the `sender` column in `PrivacyFlowTrxs_with_amounts.csv`
- Amount = fixed bucket denomination
- Source of truth for the denomination should be the bucket identity, not the matched event amount

Practical implementation:

- Parse the denomination from `bucket`
  - examples:
    - `tornado-ETH-0.1`
    - `tornado-ETH-1`
    - `tornado-DAI-10000`
- Convert the parsed denomination into raw units using resolved token decimals

### Tornado Cash withdrawals

- Address = `Withdrawal.to`
- In the CSV this is the `address` column in `tornado_cash_privacy_flow.csv`
- Amount = fixed bucket denomination
- Drop rows where address is `0x0000000000000000000000000000000000000000`

Practical implementation:

- Reuse the same denomination parsing as deposits
- Ignore the row’s `amount_raw` column for denomination derivation except maybe as a sanity check

### Railgun deposits

- Address = `tx.from`
- In the CSV this is the `sender` column in `PrivacyFlowTrxs_with_amounts.csv`
- Amount = parsed Shield amount for the tracked token
- Do **not** apply Relay Adapter filtering in this version

Practical implementation:

- Use the CSV `amount` column as the raw amount
- Aggregate rows exactly as they appear in the CSV
- Do not add any extra heuristics beyond token filtering

### Railgun withdrawals

- Address = `Unshield.to`
- In the CSV this is the `address` column in `railgun_privacy_flow.csv`
- Amount = parsed Unshield amount for the tracked token

Practical implementation:

- Use the CSV `amount_raw` column as the raw amount

### Privacy Pools deposits

- Address = `Deposited._depositor`
- In the CSV this is the `address` column when `action === "deposit"`
- Amount = `Deposited._value`

### Privacy Pools withdrawals

- Address = `Withdrawn._processooor`
- In the CSV this is the `address` column when `action === "withdrawal"`
- Amount = `Withdrawn._value`

### Privacy Pools ragequits

- Address = `Ragequit._ragequitter`
- In the CSV this is the `address` column when the row represents a ragequit-derived withdrawal
- Amount = `Ragequit._value`
- Direction = `withdrawal`

Practical note:

- `privacy_pools_privacy_flow.csv` already normalizes both `Withdrawn` and `Ragequit` into `action === "withdrawal"`
- No extra frontend distinction is required; just treat both as withdrawals

## Token Resolution And Filtering

### Requirement

Exclude every row whose token cannot be resolved via the existing privacy token metadata based on Tornado `TICKERS`.

### Why this matters

- Current privacy chart code uses `getPrivacyTokenInfo()` and assumes known assets
- The static Railgun withdrawal CSV contains many tokens that are not part of current demo token metadata
- This feature must skip those rows instead of throwing

### Implementation approach

Extend the privacy token utilities with a non-throwing resolver, for example in [privacyUtils.ts](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/server/features/privacy/privacyUtils.ts):

- keep `getPrivacyTokenInfo()` for existing strict callers
- add a new helper such as `tryGetPrivacyTokenInfo()` that returns `undefined` instead of throwing
- support lookup by:
  - Ethereum token address
  - ticker symbol
  - Coingecko-style slug when available from CSV
  - ETH special case

Recommended normalization:

- build lookup maps for:
  - `address -> token info`
  - `ticker -> token info`
  - `coingecko slug -> token info`
- for ETH:
  - accept `ETH`
  - accept `ethereum`
  - accept blank `token_address` with an ETH bucket

### Resolution rules by source

#### `PrivacyFlowTrxs_with_amounts.csv`

This file does not include `token_address`, so resolve primarily from bucket / ticker:

- `tornado-ETH-*` -> ETH
- `railgun-USDC` -> token with ticker `USDC`
- `railgun-WETH` -> token with ticker `WETH`
- fallback to CSV `token` slug if needed

#### `tornado_cash_privacy_flow.csv`, `railgun_privacy_flow.csv`, `privacy_pools_privacy_flow.csv`

Resolve in this order:

1. `token_address`, if present
2. ETH special case when `token_address` is empty and the bucket/token clearly refers to ETH
3. bucket ticker fallback
4. CSV `token` slug fallback

If resolution still fails, skip the row.

## Aggregation Rules

### Aggregation model

Aggregate **per project**, **per direction**, **per address**, and keep **per-token subtotals** before converting to a final per-address USD total.

That means:

1. group rows by `(projectId, direction, address, token)`
2. sum raw token amounts inside that group
3. convert each token subtotal to USD using the resolved decimals and price
4. sum token USD subtotals into one `totalUsd` per `(projectId, direction, address)`

This preserves the intended rule:

- aggregate across all protocol buckets
- grouped by token first
- then converted to USD for charting

### Important details

- Address matching should be case-insensitive
- Normalize addresses to lowercase in aggregation output
- Only include addresses whose final `totalUsd > 0`
- Do not attempt fuzzy deduping across rows or transactions
- Do not merge deposits and withdrawals into a net value
- Deposits and withdrawals are fully separate datasets

## Output Shape For The Frontend

Add a new server feature, for example:

- `getPrivacyProjectAmountAnalysis.ts`

and expose it via TRPC as something like:

- `privacy.projectAmountAnalysis`

Recommended response shape:

```ts
interface PrivacyProjectAmountAnalysisResponse {
  projectId: string
  sectionEnabled: boolean
  deposits: PrivacyAmountAnalysisDirectionData
  withdrawals: PrivacyAmountAnalysisDirectionData
}

interface PrivacyAmountAnalysisDirectionData {
  addressCount: number
  totalUsd: number
  buckets: {
    key: string
    label: string
    minUsd: number | null
    maxUsd: number | null
    count: number
  }[]
  distribution: {
    index: number
    totalUsd: number
  }[]
}
```

Notes:

- `distribution` must be sorted by `totalUsd ASC`
- `index` is the address rank after sorting and should be 0-based or 1-based consistently
- no address strings are needed in the response for the current UI because line charts have no labels or tooltips
- if you want debugability, it is okay to keep addresses in a private/internal aggregation step, but do not make them required for rendering

## Bucket Definitions

Create a dedicated shared constant for amount buckets, for example:

- `packages/frontend/src/server/features/privacy/privacyAmountBuckets.ts`
- or a shared UI/server utility location if preferred

Exact bucket boundaries:

- `under100`: `[0, 100)`
- `from100To1K`: `[100, 1_000)`
- `from1KTo10K`: `[1_000, 10_000)`
- `from10KTo100K`: `[10_000, 100_000)`
- `from100KTo1M`: `[100_000, 1_000_000)`
- `from1MTo10M`: `[1_000_000, 10_000_000)`
- `over10M`: `[10_000_000, +inf)`

Recommended labels:

- `Under $100`
- `$100-$1K`
- `$1K-$10K`
- `$10K-$100K`
- `$100K-$1M`
- `$1M-$10M`
- `Over $10M`

## Server-Side Architecture

### Recommended file additions

- `packages/frontend/src/server/features/privacy/db/PrivacyAmountAnalysisRepo.ts`
- `packages/frontend/src/server/features/privacy/getPrivacyProjectAmountAnalysis.ts`
- optionally `packages/frontend/src/server/features/privacy/privacyAmountAnalysisUtils.ts`

### Repo behavior

Model this similarly to the existing JSON-backed privacy repos:

- [PrivacyBucketRepo.ts](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/server/features/privacy/db/PrivacyBucketRepo.ts)
- [PrivacyHistoryRepo.ts](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/server/features/privacy/db/PrivacyHistoryRepo.ts)

But since the CSV inputs are static:

- it is fine to parse them once at module load
- precompute final per-project outputs once
- return already-aggregated data to callers

Recommended flow:

1. read the 4 CSV files with `readFileSync`
2. parse rows into normalized internal records
3. resolve token metadata row-by-row
4. skip rows rejected by the explicit filters
5. aggregate into per-address per-token totals
6. convert to per-address USD totals
7. derive bucket counts and sorted distributions
8. expose `getPrivacyProjectAmountAnalysis(projectId)`

### Hardcoded project gating

Only return real data for:

- `tornado-cash`
- `railgun`
- `privacy-pools`

For other privacy projects:

- return `sectionEnabled: false`
- or return an empty structure and let the page skip rendering

## Frontend Changes

### Page integration

Modify:

- [PrivacyProjectPage.tsx](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/pages/privacy/project/PrivacyProjectPage.tsx)
- [getPrivacyProjectData.ts](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/pages/privacy/project/getPrivacyProjectData.ts)

Required changes:

- prefetch the new TRPC query for eligible projects
- add a new `ProjectSection`
  - `id="amount-analysis"`
  - `title="Amount analysis"`
- place it below the existing `Value Locked` section
- add a matching item to `getNavigationSections()`

Recommended visibility rule:

- render only when `entry.id` is one of the 3 supported project ids

### New section component

Add a page-level section component, for example:

- `packages/frontend/src/pages/privacy/project/components/PrivacyAmountAnalysisSection.tsx`

Responsibilities:

- fetch `api.privacy.projectAmountAnalysis.useQuery({ projectId })`
- render:
  - a 2-column card grid for deposit / withdrawal bar charts on desktop
  - stacked cards on mobile
  - a second 2-column grid below it for deposit / withdrawal line charts on desktop
  - stacked cards on mobile

Use the same responsive layout pattern as:

- [PrivacySummaryChartsSection.tsx](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/pages/privacy/summary/components/PrivacySummaryChartsSection.tsx)

### Bar chart component

Add a dedicated component, for example:

- `PrivacyAddressAmountBucketsChart.tsx`

Requirements:

- `BarChart`-based
- 1 series only:
  - y = address count
  - x = USD bucket label
- hover tooltip should show the exact number of addresses in the hovered bucket
- add `LIN / LOG` toggle in the card header or chart controls area
- default = linear
- log mode should switch the Y axis to log scale
- `isAnimationActive={false}`

Styling direction:

- borrow the card + chart feel from:
  - [TransferSizeChart.tsx](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/pages/interop/summary/components/charts/TransferSizeChart.tsx)
- but do **not** reuse the interop percentage-stacked logic
- this chart is not stacked and not percentage-based

### Line chart component

Add a dedicated component, for example:

- `PrivacyAddressAmountDistributionChart.tsx`

Requirements:

- use the same chart shell / visual primitives as existing TVL and activity charts
  - `ChartContainer`
  - `ChartLegend` only if needed
  - `ChartLoader`
  - shared gradients if useful
- x axis:
  - represents sorted addresses by rank
  - hide tick labels entirely
- y axis:
  - USD amount
- series:
  - one series only
- order:
  - ascending by total USD amount
- no tooltip
- no active dots
- `isAnimationActive={false}`
- add `LIN / LOG` toggle
- default = linear

Important implementation note:

- do **not** use `ChartCommonComponents` for the line chart x-axis as-is
- `ChartCommonComponents` assumes time-series `timestamp` data
- this chart is rank-based, not time-based
- create a local `XAxis`/`YAxis` setup while still reusing the broader chart container/styling approach

## Suggested UI Copy

Use concise titles like:

- `Deposits by address size`
- `Withdrawals by address size`
- `Deposits by address`
- `Withdrawals by address`

Optional helper text is fine but not required.

## TRPC Wiring

Update:

- [privacy.ts](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/server/trpc/routers/privacy.ts)

Add a new procedure, for example:

- `projectAmountAnalysis`

Suggested input:

```ts
const PrivacyProjectAmountAnalysisParams = v.object({
  projectId: v.string(),
})
```

No date range is needed because the CSV dataset is static and the charts show lifetime totals per address.

## Performance Expectations

The initial version should intentionally try the full dataset with no downsampling.

Known point counts after aggregation could still be large:

- Tornado deposits: about `60k` unique addresses
- Tornado withdrawals: about `112k` unique addresses
- Railgun deposits: about `25k` unique addresses
- Railgun withdrawals: about `14k` unique addresses
- Privacy Pools deposits: about `2.8k` unique addresses
- Privacy Pools withdrawals: about `227` unique addresses

Implementation guidance:

- keep parsing and aggregation fully server-side
- send only chart-ready data to the client
- disable chart animation
- disable line-chart tooltips and dots

If performance is still poor later, downsampling can be added in a follow-up, but it is explicitly out of scope for this pass.

## Tests

Add tests for the new pure server-side logic. Focus on the rule-heavy parts.

Recommended test file(s):

- `packages/frontend/src/server/features/privacy/getPrivacyProjectAmountAnalysis.test.ts`
- or utility-level tests if the code is split across helpers

Minimum cases to cover:

1. Tornado deposit amount comes from bucket denomination, not arbitrary row amount
2. Tornado withdrawal zero-address rows are excluded
3. Railgun deposits use sender and raw amount with no Relay Adapter filtering
4. Privacy Pools withdrawals include both normal withdrawals and ragequits
5. Unknown tokens are skipped instead of throwing
6. Per-token subtotals are converted first and then summed into per-address USD totals
7. Bucket assignment works at every boundary
8. Distribution output is sorted ascending by USD total

Existing privacy test style reference:

- [privacyChartUtils.test.ts](/Users/sergeyshemyakov/Documents/l2beat-privacy-dashboard-prototype/packages/frontend/src/server/features/privacy/privacyChartUtils.test.ts)

## Acceptance Checklist

The implementation is complete when:

- `Amount analysis` appears only on Tornado Cash, Railgun, and Privacy Pools detail pages
- the new section is navigable from the right-side project navigation and mobile section nav
- deposit and withdrawal bar charts render in separate cards
- both bar charts count addresses in absolute terms
- both bar charts support `LIN / LOG`
- line charts render below the bar charts
- line charts are sorted by increasing per-address total USD
- line charts have hidden x-axis labels and no tooltips
- all token values are resolved through existing privacy token metadata
- unsupported tokens are excluded, not fatal
- Tornado zero-address withdrawals are excluded
- no downsampling is applied

## Non-Goals

- no daily/time-series amount-analysis charts
- no address labels or address tooltips on line charts
- no cross-protocol combined view
- no dynamic enablement for future privacy protocols
- no Railgun Relay Adapter filtering in this pass
