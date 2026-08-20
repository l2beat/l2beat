# Ossification

Current as of 2026-08-20. This document defines the metric, its runtime inputs,
and how to validate project classifications.

## Metric semantics

Ossification measures how long the complete security-critical contract perimeter
has remained unchanged.

- **Ossification (0–100):** `round(100 × (1 − exp(−age / 2 years)))`.
- **Last change:** age of the project clock. The clock starts at the newest
  deployment or qualifying change among all current critical contracts.
- **Battle-tested exposure (USD·years):** project TVS integrated from the project
  clock start until now. It is null without TVS data and zero while an unverified
  critical contract gates maturity.
- **Critical changes / year:** qualifying events in the trailing 36 months,
  clustered into 24-hour windows. The observation denominator is at least 30 days.

The score is project-wide: contracts are not averaged or TVS-weighted. One new or
changed critical contract resets the whole perimeter. If any current critical
contract is unverified, maturity is zero. A project with a current critical contract
whose deployment/change clock is unknown is not rendered.

## Critical upgrade definition

> A critical upgrade is any deployment or change to executable code,
> verification logic, or mutable configuration within a project's critical
> security perimeter that can alter the conditions under which user assets or
> protected state may be controlled, validated, finalized, frozen, censored,
> lost, created, or disclosed—or can alter who has authority to cause or prevent
> those outcomes.

For ossification:

- Every implementation change to a critical contract is presumed critical. A
  claimed equivalent, cosmetic, or minor implementation does not preserve
  battle-tested age.
- A non-code change is critical when it modifies a security boundary, trusted
  actor, authorization threshold, verifier or vkey, custody path, accounting
  rule, oracle/risk control, pause/escape mechanism, or equivalent control.
- Introducing a new critical component is equivalent to a critical upgrade.
- Purely presentational, descriptive, or observational metadata/configuration
  changes that cannot alter security behavior are not critical. This exclusion
  does not apply to an implementation replacement.

The definition is consequence-based and applies across project types: state
validity, finality, sequencing, data availability, bridges, and forced exits for
Layer 2s; custody, accounting, pricing, liquidation, minting, and withdrawals for
DeFi; and proof verification, nullifiers, anonymity guarantees, encryption/viewing
authority, and private withdrawals for Privacy projects. For other systems, apply
the same test to their asset, state-integrity, availability, and confidentiality
boundaries.

Reviewer test:

> Could this change—or authority introduced by it—materially change which states
> are accepted, who can control or impair user assets, or whether the project's
> promised security or privacy property holds?

If yes, it is critical from the ossification perspective.

## Exact runtime inputs

| Input | Inclusion rule | Effect |
| --- | --- | --- |
| `ossification.json` | Must exist for the project | Opts the project into the metric |
| `discovered.json` contract | `type === "Contract"`, has an address, and `critical === true` | Joins the current security perimeter |
| `includeProjects` | Listed in the root project's `ossification.json` | Adds that project's current critical contracts and discovery history to the same perimeter |
| `sinceTimestamp` | Current critical contracts only | Deployment candidate for the contract clock; deployment resets maturity but is not a change-rate event |
| `$pastUpgrades` | Current critical contracts; first item is the initial implementation | Latest timestamp can reset the clock; every item after the first is a change-rate event |
| Watched discovery diff | Address belongs to a current critical contract and the block is a non-implementation `severity: HIGH` change | Resets the clock and adds a change-rate event |
| Implementation diff fallback | Address belongs to a current critical contract and that contract has no `$pastUpgrades` | Resets the clock and adds an event regardless of field severity |
| `unverified` | Any current critical contract | Gates maturity, score, and exposure to zero |
| `historicalContracts` | Entry has `critical: true` and is no longer live | Its upgrades and attributable HIGH diff events affect only change history/rate, never the current clock or unverified gate |
| Project `TokenValue` series | Root project only | Supplies battle-tested exposure; it does not affect score or change rate |

The concise answer to “critical flags plus HIGH values?” is **almost, but not
literally**:

1. `critical: true` is the only live-contract membership gate. HIGH changes on a
   non-critical contract are ignored.
2. Every recognized implementation upgrade of a critical contract counts. It does
   **not** need a HIGH annotation or per-upgrade judgment.
3. Non-implementation value changes count only when their stored watched-change diff
   block says `severity: HIGH`.
4. Deployments, verification state, historical contract judgments, and TVS are
   additional inputs with the effects shown above.

Severity is a binary event gate, not a weight. Multiple qualifying changes within
24 hours form one project event.

## Important history caveat

The runtime does not inspect today's `fieldMeta` and reconstruct old value changes.
It reads the committed `diffHistory.md`, where severity was copied from the field
metadata that existed when each diff was generated. Adding `severity: "HIGH"` today
does not retroactively mark older diff blocks.

Implementation history is stronger: `$pastUpgrades` supplies onchain timestamps and
all recognized upgrades mechanically. When `$pastUpgrades` exists, implementation
diff blocks are ignored to avoid double counting. Without it, implementation diffs
are the fallback and use the discovery review timestamp.

Consequences for validation:

- Validate that every critical proxy/upgrade mechanism produces a complete
  `$pastUpgrades`; missing handler coverage is a data-quality issue.
- For HIGH non-implementation fields added late, inspect old discovery/git history.
  If older critical changes matter, the current schema needs an auditable historical
  event backfill; changing today's severity alone is insufficient.
- Removed contracts require contract-level classification in `historicalContracts`.
  Their retained upgrades are still counted mechanically.

## Recommended project validation pass

The tracked cohort is: arbitrum, base, linea, optimism, privacy-pools, railgun,
scroll, starknet, taiko, tornado-cash, uniswapv3, and zksync2. Zksync includes
`shared-zk-stack` through `includeProjects`.

For every project:

1. **Validate perimeter membership.** Review every current `critical: true` contract
   and likely omissions using permissions, values, `.flat/` sources, templates, and
   project overrides. Apply the critical-upgrade test above: can compromise or
   mutation of this contract affect user assets, protected state, or the project's
   promised security or privacy property?
2. **Validate controllers.** Include contract-based admins, timelocks, security
   councils, pausers, and other controllers when their authority reaches funds.
   Never flag EOAs or individual multisig members merely because they participate in
   a threshold.
3. **Validate governance boundaries.** Exclude externally governed escrows whose
   security belongs to another protocol. The deciding test is governance domain, not
   the frontend TVS bucket. Project-governed canonical/custom bridges remain in scope.
4. **Validate deployment and upgrade evidence.** Check `sinceTimestamp`, proxy type,
   upgrade event handlers, and `$pastUpgrades` completeness for every critical
   contract. Confirm the first upgrade entry is initialization and later entries are
   real implementation changes.
5. **Validate HIGH values.** Mark every mutable non-implementation value that can
   change the loss/freeze boundary: verifiers and vkeys, operators/signers/DACs,
   pause state, escrow mappings, thresholds, and equivalent controls. Do not use LOW
   as a catch-all.
6. **Validate historical coverage.** Inspect relevant HIGH blocks in
   `diffHistory.md`, especially when severity was introduced recently. Run the
   backfill scanner for removed contracts and review each countable candidate.
7. **Review the computed evidence.** Run lint and smoke, inspect the perimeter and
   youngest clock, and explain every unexpected inclusion, omission, or recent reset.

### Where an agent helps

Use an agent as a reviewer for perimeter membership, sensitive value selection,
handler coverage, and historical gaps. Agent classification of **every upgrade** is
not required by the current methodology: any implementation change to a critical
contract deliberately resets maturity, including a small or benign upgrade.

Per-upgrade classification would be a methodology change, not a missing validation
step. It would make the metric subjective and risk treating newly deployed code as
already battle-tested. Consider it only if the intended metric changes to distinguish
security-relevant upgrades from cosmetic ones. If the problem is missing upgrade
events, fix discovery/handler coverage or add auditable historical inputs instead.

## Curation and materialization

- Put `critical: true` in a shared `template.jsonc` only when every use of that
  contract shape is critical. Otherwise use the project's `config.jsonc` override.
- Put `severity: "HIGH"` on security-critical fields in templates or overrides using
  the same reuse rule.
- `l2b colorize` materializes flags and field metadata into `discovered.json`.
  Colorization merges metadata and does not remove old materialized fields; use a
  discovery refresh when removing them.
- Config changes can alter discovery hashes. Run the normal refresh and config tests;
  do not hand-edit generated schemas.
- `ossification.json` is the reviewed opt-in quality gate. `{}` is sufficient when
  no includes or historical contracts are needed.

## Tools and code map

- `getProjectOssification.ts`: opt-in, current/historical perimeter loading,
  discovery history, and TVS exposure.
- `getOssificationFactor.ts`: pure clocks, event extraction, clustering, and score.
- `getOssificationPerimeter.ts`: lint/research closure only; it never decides runtime
  membership.
- `scripts/ossification-lint.ts <projectId>`: candidate worklist for missing/excess
  flags; suggestions require judgment.
- `scripts/ossification-backfill.ts <projectId> [--json]`: removed-contract evidence
  from full git history.
- `scripts/ossification-smoke.ts [projectId...] --perimeter`: score and perimeter
  inspection.
- UI: `/security`, project `#ossification` sections, and
  `getOssificationEntries.ts`.

Use Node 22 through `fnm`. RPC and explorer credentials are in
`packages/config/.env`. Discovery inputs such as `.flat/` and current
`discovered.json` may be ignored, so inspect them directly rather than relying only on
`git ls-files`.

## Current status

- The 12-project cohort is classified and opted in.
- Removed-contract backfill is complete for the cohort; runtime history remains
  limited by the caveat above for late-added HIGH value annotations.
- The exploit-age backtest supports retaining the two-year maturity constant. The
  two sources are now merged into one classified corpus: 308 exploits 2017–2026,
  282 with onchain-measured code age, every registry row root-cause-classified
  with an evidence sentence (see `scripts/ossification-incidents.registry.json`).
  Merged code-bug numbers (n=243): median exploited-code age 1.9mo, 78% ≤12mo,
  88% of $2.05B verified losses on ≤12mo code, median score at incident 8/100
  under λ=2y. Keys and offchain failures are outside this metric's scope.
- Before public launch, the important remaining validation is an independent review
  of critical flags, HIGH value coverage, upgrade-handler completeness, and any
  historical value-change gaps discovered by that review.
