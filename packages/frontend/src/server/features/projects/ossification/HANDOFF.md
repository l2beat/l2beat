# Ossification Factor — handoff & next steps

Self-contained notes for whoever works on this next (human or agent). State as of 2026-08-19.

## What this is

An L2BEAT-original security metric measuring how battle-tested the code securing a
project's funds is. Three numbers per project:

- **Score (0–100)**: maturity of the complete project-wide critical perimeter,
  `m(age) = 1 − exp(−age / 2yr)`. `age` starts at the latest deployment or critical
  change anywhere in the perimeter.
- **Accumulated implicit bug bounty (USD)**: `B = current project TVS × m(age)`.
  This expresses accumulated adversarial exposure in present-day dollars. It is an
  estimate, not a literal bounty or reward.
- **Critical changes / year**: project-wide 24h-clustered critical change events,
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
- Project TVS only — there is no address allocation, fund-holder classification, or equal
  weighting fallback. V1 uses current TVS rather than integrating historical TVS. That
  keeps the bounty in intuitive USD; a raw TVS integral would have dollar-year units and
  would add historical-data assumptions. Uniswap v3 currently has no TVS record, so its
  score renders while its implicit bounty is unavailable.
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
- `getProjectOssification.ts` — async loader: reads ossification.json (opt-in gate),
  discovered.json (flags, `$pastUpgrades`, `sinceTimestamp`, `unverified`), diffHistory.md
  (parsed via `getDiscoveryUpdates`), and current project `TokenValue` rows. It sums
  `valueForProject`; it never reads address-level `TvsAmount` rows.
- `getOssificationPerimeter.ts` — the old value-graph closure, now a LINT/RESEARCH TOOL
  ONLY (escrow seeds from tvs.json + trackedTxsConfig, closed over values references and
  permission holders). Never decides membership.
- `packages/frontend/scripts/ossification-lint.ts` — flags vs closure diff = worklist
  for classification. `scripts/ossification-smoke.ts` — cohort score/bounty table
  (`--perimeter` lists contract names; positional project ids limit the cohort).
- UI: `components/projects/sections/OssificationSection.tsx`, wired in
  `getScalingProjectEntry.ts` and `getPrivacyProjectEntry.ts`.
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
- The score is independent of TVS availability. If current project `TokenValue` rows are
  unavailable (including `env.MOCK`), the score still renders and the implicit bounty is
  null/N/A.
- A newly deployed critical contract resets the project clock even though deployment is
  not counted as an upgrade event. This is intentional: the complete perimeter cannot be
  older than its newest critical component.
- Unverified is a project-wide conservative gate. Scroll currently scores 0 because
  `PlonkVerifierFeynmanV2` is both critical and unverified.

## Current state

Live project-wide cohort on 2026-08-19: tornado-cash 93, uniswapv3 93 (bounty N/A),
privacy-pools 23, arbitrum 9, optimism 6, linea 5, starknet 5, base 3, taiko 2,
railgun 0 (2-day clock, rounded), zksync2 0 (2-day clock, rounded), scroll 0
(unverified critical contract). Dollar bounty values depend on current TVS and are
expected to move continuously. Frontend tests and typechecks were green at this handoff.

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
2. **Parked gaps**: shared-zk-stack project needs its own classification for Era's full
   perimeter (cross-project references are not followed); zksync wstETH bridge proxy
   admin is `ignoreDiscovery`; Maker DAI wards absent from starknet discovery; scroll
   `ProposalTypesConfigurator` mis-categorized "spam" though live-wired into governance.
3. **Validation before public launch**: backtest against the IEEE S&P 2023 DeFi attacks
   dataset (181 incidents) — does the factor separate exploited from non-exploited
   protocol-years; fit λ (2yr) and clustering window (24h) to our own event data.
