# Ossification Factor — handoff & next steps

Self-contained notes for whoever works on this next (human or agent). State as of 2026-08-19.

## What this is

An L2BEAT-original security metric measuring how battle-tested the code securing a
project's funds is. Three numbers per project (UI labels in quotes):

- **"Ossification" (0–100)**: maturity of the complete project-wide critical
  perimeter, `m(age) = 1 − exp(−age / 2yr)`. `age` starts at the latest deployment or
  critical change anywhere in the perimeter — shown as **"Last change"** ("X ago").
- **"Battle-tested exposure" (USD·years)**: `∫ TVS(t) dt` from the project clock
  start to now (trapezoid over the daily TVS series, flat-extended to now). The
  accumulated implicit bug bounty the unchanged perimeter has withstood. Monotone,
  cannot be deflated by market moves or inflated by a TVS spike, unlike the earlier
  spot `TVS × m` variant it replaced. Shares the unverified gate with the score
  (unverified perimeter accumulates 0); null when no TVS series exists.
- **"Critical changes / year"**: project-wide 24h-clustered critical change events,
  trailing 36 months.

Critical change events per contract = implementation upgrades (from `$pastUpgrades` in
discovered.json, onchain timestamps, initial deployment excluded) + HIGH-severity
non-implementation blocks in diffHistory.md `## Watched changes` (implementation diffs
only count when the contract has no `$pastUpgrades`, to avoid double counting).
Severity is a **gate, not a weight**: a batch of HIGH diffs in one 24h window is one
event; individual HIGH fields are never counted.

Individual contract clocks are retained as evidence and for possible future analysis,
but they are not averaged or TVS-weighted. A deployment or qualifying change to any
critical contract resets the one project clock. If any critical contract is unverified,
project maturity is conservatively 0. If any critical contract has no known clock, the
metric is not rendered.

Deliberate design decisions (do not re-litigate casually):
- No capability term — exit windows / upgrade delays are covered by Stages, not here.
- No emergency-fix carve-out — a clock reset states the truth that new code is unproven.
- Project-wide clock, no contract averaging — every `critical: true` contract belongs to
  one security perimeter. A new critical deployment or a critical change anywhere makes
  that perimeter newly unproven. This avoids architecture-dependent scores and does not
  infer fractional criticality that the label does not encode.
- Project TVS only — there is no address allocation, fund-holder classification, or
  equal weighting fallback. Exposure integrates the project-level daily TVS series
  (retained indefinitely; coverage spans every cohort clock). Uniswap v3 currently has
  no TVS record, so its score renders while exposure is n/a.
- Externally governed escrows are NOT critical (2026-08-20) — escrows/gateways whose
  code is governed by another protocol (Maker/Sky DAI & USDS/SkyLink, Lido wstETH,
  Livepeer LPT, LORDS) are outside the host project's perimeter: their battle-testing
  belongs to the external protocol, and e.g. Maker rotating a ward must not reset
  Arbitrum's clock. The frontend's "TVS with additional trust assumptions" bucket
  (custom-canonical + external sources) is the guide, but the deciding test is
  *governance domain*, not TVS bucket: Starknet's StarkGate custom-canonical escrows
  stay critical (Starkware-governed), and Linea's immutable LidoStVaultYieldProvider
  stays critical (Linea's own code choice securing canonical ETH), while the Maker DAI
  escrows stay out even where TVS counts them plain-canonical. Their `wards` fields
  keep `severity: HIGH` as reviewer metadata. Removed from: maker/L1Escrow,
  maker/SkyLinkBridge, lido/L1ERC20TokenBridge, lido/L1LidoTokensBridge,
  starknet/L1EscrowDAI, starknet/LordsL1Bridge, orbitstack/L1DaiGateway,
  orbitstack/layer2/{L2DAIGateway,L2LPTGateway} templates + config overrides in
  arbitrum/optimism/zksync2/scroll/starknet, and scroll's backfilled L2WstETHToken.
  Gotcha: colorize merges and never deletes color fields, and color-only config edits
  do not change the tracked config hash — removing a materialized flag needs
  `l2b discover <p> --dev`. zircuit (no working RPC on free plan) and unichain
  (L2 RPC errors on 4 gas-oracle fields) were hand-edited in discovered.json with
  the diffHistory hash regenerated via l2b's updateDiffHistory.
- Shared modules can be merged into a project's perimeter via `includeProjects` in
  ossification.json (e.g. zksync2 includes shared-zk-stack): the included project's
  `critical: true` contracts join the perimeter fully (clock, unverified gate, events)
  and both diffHistories are parsed with events clustered together. The included
  project needs no ossification.json of its own.
- Rationale, prior art, and calibration live in the research memo (ask sekuba for the
  artifact link if needed).

## How the perimeter is defined (explicit curation, no derivation)

- `critical: true` on the contract config in discovery declares that the contract belongs
  to the project's security perimeter: its compromise or critical mutation can cause
  loss/freezing/unauthorized withdrawal of project funds, directly or via permissions it
  holds. The metric deliberately does not encode an affected-TVS fraction: once a contract
  is critical, it resets the project-wide clock. Curated in
  `_templates/<family>/<Name>/template.jsonc` (default per shape) and per-address in
  `<project>/config.jsonc` `overrides`. Materializes into discovered.json via
  `l2b colorize`.
- `severity: "HIGH"` on fields declares critical values (verifier addresses, vkeys,
  operator/DAC/signer sets, pause state, escrow mappings). HIGH-only curation; never
  spray LOW; undefined ≡ not critical for the metric.
- **The OF renders only if** `packages/config/src/projects/<id>/ossification.json`
  exists (opt-in marker, `{}` is enough) **and** ≥1 contract is flagged critical.
  No fallback of any kind for unclassified projects.
- Controllers ARE critical when their power reaches funds (security councils,
  proxy admins, timelocks, pausers — freezing counts). Contracts only, never EOAs.
  Individual multisig members below threshold are not critical. Unreachable code
  (estopped verifiers, deprecated contracts without permissions) is not critical.
  When unsure, state the concrete attack: "compromise X, then steal/freeze funds by Y".

## Code map

- `getOssificationFactor.ts` — pure project-wide compute, event extraction, and retained
  per-contract evidence (tested in
  `getOssificationFactor.test.ts`).
- `getProjectOssification.ts` — async loader: reads ossification.json (opt-in gate,
  `includeProjects`, `historicalContracts`), discovered.json of the project and every
  included project (flags, `$pastUpgrades`, `sinceTimestamp`, `unverified`),
  diffHistory.md of each (parsed via `getDiscoveryUpdates`), and computes exposure
  from the summed project `TokenValue` daily series
  (`getSummedByTimestampByProjects`); it never reads address-level rows.
- `getOssificationPerimeter.ts` — the old value-graph closure, now a LINT/RESEARCH TOOL
  ONLY (escrow seeds from tvs.json + trackedTxsConfig, closed over values references and
  permission holders). Never decides membership.
- `packages/frontend/scripts/ossification-lint.ts` — flags vs closure diff = worklist
  for classification. `scripts/ossification-smoke.ts` — cohort score/bounty table
  (`--perimeter` lists contract names; positional project ids limit the cohort).
- UI: `components/projects/sections/OssificationSection.tsx`, wired in
  `getL2ProjectEntry.ts` and `getPrivacyProjectEntry.ts` (the frontend renamed
  "scaling" to "layer2s" across pages/features/URLs in #12538).
- Comparison page: `/security` — `pages/security/*` +
  `getOssificationEntries.ts` (spans Layer 2, privacy, and DeFi projects; wired in
  SecurityRouter, pageLoaders, pagePaths, navGroups, and searchBarPages).
- Discovery support for the flag: `ColorConfig.ts`, `colorize.ts`, `toDiscoveryOutput.ts`
  (`sortEntry` whitelists keys — new entry fields must be added there), `output/types.ts`.

## Backfill (phase 2 — done for the cohort)

Contracts removed from discovery take their events with them (their `$pastUpgrades`
vanish and diffHistory blocks stop attributing), which understates the change rate.
The backfill restores those events:

- `scripts/ossification-backfill.ts <id> [--json]` walks the FULL git history of a
  project's discovered.json (all three repo layouts: `packages/backend/discovery/…`,
  per-chain `…/<id>/<chain>/…`, merged `…/<id>/discovered.json`), normalizes bare
  per-chain addresses, keeps the longest-observed `$pastUpgrades` per removed contract,
  and counts attributable HIGH diff blocks. Mechanical evidence only.
- Only removed contracts with **countable events** (`upgradeTimestamps.length > 1 ||
  diffEventCount > 0`) are classified — anything else contributes nothing regardless
  of judgment, so it is not stored.
- Judgments live in `<project>/ossification.json` as `historicalContracts`:
  `{ address, name, critical, upgradeTimestamps, lastSeenAt, lastSeenCommit, note }`
  (evidence copied verbatim from the scanner; `critical: false` entries document the
  judgment and are ignored at runtime).
- Runtime semantics: `critical: true` historical contracts contribute their events to
  the rate / last-change / observation window ONLY. They never touch the project
  clock, the score, or the unverified gate — they no longer secure funds. An entry
  whose address is still live in discovery is ignored (the live entry wins).
- Watch for "phantom" candidates: L1 contract addresses that old discovery resolved on
  the L2 chain (unverified, no values/permissions, nothing trusts them) — not critical
  (scroll had four).
- Residual limitation: diffHistory-derived events are review-time, not onchain-time;
  `$pastUpgrades`-derived events (the vast majority) are onchain-time.

## Workflow to classify a new project

1. `cd packages/frontend && npx tsx scripts/ossification-lint.ts <projectId>` for the
   candidate worklist (suggestions, not truth).
2. Judge per the definition above, reading discovered.json values/permissions,
   templates, and `.flat/` sources. Edit template.jsonc (`"critical": true,` after
   `displayName`) only if the shape is critical in EVERY project using it
   (`grep -rl '"template": "<family>/<Name>"' packages/config/src/projects/*/discovered.json`);
   otherwise per-address override in config.jsonc. Add missing HIGH severities sparingly.
3. `cd packages/config && l2b colorize -m "<message>"` to materialize.
4. If config.jsonc changed, hashes change: run `l2b refresh-discovery -y -m "<message>"`
   (full rediscovery for flagged projects, needs RPC keys in packages/config/.env).
5. `npm test` in packages/config — the tests "is colorized correctly" and "committed
   discovery config hash … up to date" are ground truth.
6. Create `<project>/ossification.json` (`{}`) only after review — it is the quality gate.
7. Re-run smoke + lint; every remaining lint discrepancy must have a documented reason.

## Gotchas (each cost time once)

- Discovery JSON schemas are GENERATED: run `pnpm generate-schemas` in packages/discovery,
  never hand-edit `schemas/*.json`.
- config.jsonc overrides: check for an EXISTING override block before adding one —
  duplicate keys silently clobber (jsonc keeps the last occurrence; this once erased a
  description on scroll). Preserve jsonc comments; edit surgically.
- Shared templates propagate to every fork's discovered.json — harmless for the metric
  (no ossification.json → no OF) but it makes colorize/refresh touch many projects.
- Project id ≠ slug for directory lookups (zksync-era → `zksync2`).
- Update-monitor DB tables are current-state-only; history comes from git,
  diffHistory.md, and `$pastUpgrades` — never from the DB.
- diffHistory event timestamps are review-time, not onchain-time (phase 2 fixes this).
- risc0/succinct/taiko-namespace verifier templates are usage-dependent (live vs
  estopped instances of the same shape) — per-address overrides only. maker/lido escrow
  templates ARE template-flagged (escrow in every usage).
- `manualSourcePaths` in an override clears the `unverified` flag (manually verified
  contracts, e.g. tornado's MiMCHasher, correctly count as verified).
- The score is independent of TVS availability. If project `TokenValue` rows are
  unavailable (including `env.MOCK`), the score still renders and the battle-tested
  exposure is null/N/A.
- A newly deployed critical contract resets the project clock even though deployment is
  not counted as an upgrade event. This is intentional: the complete perimeter cannot be
  older than its newest critical component.
- Unverified is a project-wide conservative gate. Scroll currently scores 0 because
  `PlonkVerifierFeynmanV2` is both critical and unverified.

## Current state

Live project-wide cohort on 2026-08-19 (ossification / battle-tested exposure):
tornado-cash 93 / $2.49B·yr, uniswapv3 93 / n/a (no TVS record), privacy-pools 23 /
$2.9M·yr, arbitrum 9 / $1.86B·yr, optimism 6 / $170M·yr, linea 5 / $32M·yr,
starknet 5 / $44M·yr, base 3 / $675M·yr, taiko 2 / $445K·yr, railgun 0 (2-day clock),
zksync2 0 / $12.7M·yr (perimeter 29 = 9 own + 20 imported from shared-zk-stack via
`includeProjects`, events clustered together), scroll 0 / $0 (unverified critical
contract gates both score and exposure). Exposure moves with the TVS series but is
monotone within an unchanged period. Frontend and config test suites were green at
this handoff.

Backfill (phase 2) is done for the cohort: 43 removed contracts with countable events
were classified across taiko (18/20 critical), base (6/6), optimism (4/5), arbitrum
(2/2), zksync2 (2/2, the Gateway settlement-layer era), scroll (2/8 — four were
phantoms, see above); the other six projects had nothing to backfill. Effect on
events(3y)/rate: taiko 30→54 (23.3/yr), base 20→25 (8.3/yr), optimism 19→20,
arbitrum 9→10, zksync2 41→42, scroll unchanged. Scores and clocks are unaffected by
construction.

**Environment and completion:** use Node 22 through `fnm`; from `packages/frontend`, run
the live cohort with `set -a; source ../config/.env; set +a; DATABASE_URL="$TVS_DB_URL" fnm exec --using=22 pnpm exec tsx scripts/ossification-smoke.ts --perimeter`. Foundry
`cast`, RPC URLs, and Etherscan keys are available through `packages/config/.env`.
Discovery inputs may be gitignored: inspect each project's `.flat/` sources and
`discovered.json`, plus `template.jsonc` and `config.jsonc` for handlers and permissions.
The working tree is uncommitted and this HANDOFF is currently untracked, so preserve it.
Phase 2 is complete only when historical events are reproducibly derived from git,
retain auditable timestamp/evidence links, and pass unit tests plus the cohort smoke.

## Next steps, in order

1. **Phase 3 churn weighting**: weight upgrades by changed-lines/total-lines; needs a
   flat-source archive per historical implementation (backfill via `$pastUpgrades` impl
   addresses + Etherscan; the repo flattener is in packages/discovery).
2. **Validation: DONE 2026-08-20** — incident backtest over 49 exploits (2021–2025),
   30 with onchain-measured exploited-code age (`scripts/ossification-incidents.ts`
   + `.data.json`; report artifact "Ossification Backtest",
   https://claude.ai/code/artifact/8fac7e4b-9e7f-44b4-8a7c-cb47da2f5d99). Findings:
   median exploited-code age 2.7mo; 90% of code-bug exploits (92% of their losses)
   hit code ≤12mo old; exploit-age MLE mean 0.54y → keep λ=2y (median exploited
   code would have scored 11/100; λ=1y would double that). Expanded sample:
   261 further exploits extracted from DeFiHackLabs @KeyInfo headers
   (`scripts/ossification-incidents.registry.json` + `-batch.ts`, results cached
   in `.batch-results.json`; only rows with USD loss + attack tx + victim
   contract verified onchain; attacker-deployed "victims" auto-excluded) —
   independently reproduces the front-loading: median 1.9mo, 41% ≤1mo,
   75% ≤12mo (fatter >2y tail since root causes aren't classified there). Scope: code bugs are
   43% of losses; keys/offchain (49%) are invisible to OF — say so in public copy.
   Counterexamples to cite honestly: Curve/Vyper (20mo), Yearn yUSDT (38mo),
   GMX v1 (46mo). 24h cluster window validated against the cohort's own gap
   distribution (6h–72h valley). Remaining launch items: methodology write-up,
   second-researcher review of critical flags, dedicated og-image.

Formerly parked gaps, all resolved 2026-08-20: shared-zk-stack merged into zksync2
via `includeProjects`; the zksync wstETH bridge and all other externally governed
escrows were removed from the perimeter entirely (see design decisions); starknet
Maker DAI wards were already discovered via Rely/Deny event handlers (verified
onchain, `wards()` = 1 for all five) and are now severity HIGH; scroll's
`ProposalTypesConfigurator` was recategorized spam→gov and its `proposalTypes`
(quorum/approval thresholds, ~0.16% quorum) are now watched at severity HIGH via
the ProposalTypeSet event.
