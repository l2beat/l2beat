# Ossification

Current as of 2026-08-21. This document defines the metric, its runtime inputs,
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

The score is project-wide. One new or changed critical contract resets the whole
perimeter. If any current critical contract is unverified, maturity is zero.

## Critical upgrade definition

> A critical upgrade is any deployment or change to executable code,
> verification logic, or mutable configuration in a project's critical contract
> perimeter—or to the security mechanism governing that perimeter—that can alter
> the conditions under which user assets or protected state may be controlled,
> validated, finalized, frozen, censored, lost, created, or disclosed.

The definition is consequence-based and applies across project types: state
validity, finality, sequencing, data availability, bridges, and forced exits for
Layer 2s; custody, accounting, pricing, liquidation, minting, and withdrawals for
DeFi; and proof verification, nullifiers, anonymity guarantees, encryption/viewing
authority, and private withdrawals for Privacy projects. For other systems, apply
the same test to their asset, state-integrity, availability, and confidentiality
boundaries.

## Reviewer contract

Use these rules in order. If a decision cannot be supported by evidence, record it
as unresolved.

### 1. Select the contract perimeter

A contract is `critical: true` when changing its code or configuration can
materially change whether protected assets, state, availability, or privacy remain
secure.

- Include canonical custody, verification, core protocol, and escape/pause
  contracts, plus the contracts that implement their upgrade or governance
  mechanism (for example ProxyAdmins, upgrade executors, timelocks, governors,
  modules, and guards).
- Exclude ordinary actor containers such as Safes/multisigs and EOAs. Their members
  identify who occupies a trusted role; the container does not itself define the
  protocol mechanism.
- Exclude externally governed escrows and gateways whose assets have additional
  trust assumptions. Project-governed canonical bridges remain in scope.

### 2. Classify changes

There is one classification shared by discovery and ossification:

- Every implementation change to a critical contract is a critical **code**
  change. It does not need a severity annotation.
- Deploying a new critical component is a critical code change.
- A mutable non-implementation value is `severity: "HIGH"` exactly when changing
  it meets the critical-upgrade definition. A HIGH change on a critical contract
  is a critical **state** change.
- Routine identity churn inside an unchanged role is not HIGH. This includes
  multisig or Security Council members, sequencers, batch posters, validators,
  operators, signers, and committee members when their powers and trust model do
  not change.
- Changes to a role's powers or scope, threshold, delay, controller, modules,
  guard, authority path, verifier/vkey, custody/accounting rule, or equivalent
  security mechanism are HIGH.
- Classify a discovered field as a whole. Every change to a HIGH field counts.
  Split broad fields into focused fields when their values have different
  security consequences.

In short: `critical: true` selects the contracts, implementation changes always
count, and HIGH selects the state changes that count.

Classify each contract independently in the per-contract breakdown. At the update
and 24-hour-cluster level, call a mixed event a code change if any constituent
contract had a code change.

### 3. Contract initialization

Initial deployment and setup before a component first acquires security authority
start its age but are not change-rate events. Any later change counts, even if it
happens soon after deployment. Do not treat the first recorded upgrade as
initialization merely because it is first: require a zero implementation slot,
constructor trace, or equivalent historical evidence. Record exceptions in
`firstUpgradeIsChange`.

### 4. Use auditable evidence

Prefer a transaction hash and onchain timestamp. If mechanical discovery history
is incomplete, add a `criticalEvents` entry with a one-sentence security consequence
and an `updateId` when a matching update card exists.

An event may omit `contract` only when a critical threshold, module, guard, or
similar setting is stored on an excluded Safe or multisig. For example, Arbitrum's
Security Council Safe is outside the contract perimeter, but changing its signing
threshold still counts.

### Review output

For each project, leave four compact artifacts:

1. Included and excluded perimeter contracts, with a short reason for non-obvious
   decisions.
2. Mutable values whose severity was added, removed, or changed.
3. Upgrade-history gaps, initialization exceptions, and reviewed
   `criticalEvents`.
4. Lint/smoke output and an explanation of any unexpected clock reset or omission.

## Exact runtime inputs

| Input | Inclusion rule | Effect |
| --- | --- | --- |
| `ossification.json` | Must exist for the project | Opts the project into the metric |
| `discovered.json` contract | `type === "Contract"`, has an address, and `critical === true` | Joins the current security perimeter |
| `includeProjects` | Listed in the root project's `ossification.json` | Adds that project's current critical contracts and discovery history to the same perimeter |
| `sinceTimestamp` | Current critical contracts only | Deployment candidate for the contract clock; deployment resets maturity but is not a change-rate event |
| `$pastUpgrades` | Current critical contracts; the first transaction is initialization unless audited in `firstUpgradeIsChange`; audited later initialization/no-op transactions are listed per contract in `ignoredUpgradeTransactions` | Latest qualifying transaction timestamp can reset the clock; every non-initialization transaction is a change-rate event. Multiple upgrade records from one transaction (for example upgrade, execute, restore) form one code change |
| Watched discovery diff | Address belongs to a current critical contract and the block is a non-implementation `severity: HIGH` change | Resets the clock and adds a change-rate event |
| Implementation diff fallback | Address belongs to a current critical contract and that contract has no `$pastUpgrades` | Resets the clock and adds an event regardless of field severity |
| `criticalEvents` | Reviewed, evidence-backed event that mechanical discovery history cannot reconstruct | Adds the specified code/state event. `historical: true` affects only history/rate; other entries also reset the current clock |
| `unverified` | Any current critical contract | Gates maturity, score, and exposure to zero |
| `historicalContracts` | Entry has `critical: true` and is no longer in the current perimeter | Its upgrades, attributable HIGH diff events, and reviewed events affect only change history/rate, never the current clock or unverified gate |
| Project `TokenValue` series | Root project only | Supplies battle-tested exposure; it does not affect score or change rate |

## Important history caveat

The runtime does not inspect today's `fieldMeta` and reconstruct old value changes.
It reads the committed `diffHistory.md`, where severity was copied from the field
metadata that existed when each diff was generated. Changing severity today does
not retroactively reclassify older diff blocks.

Implementation history is stronger: `$pastUpgrades` supplies onchain timestamps and
all recognized upgrades mechanically. When `$pastUpgrades` exists, implementation
diff blocks are ignored to avoid double counting. Without it, implementation diffs
are the fallback and use the discovery review timestamp.

Upgrade events are deduplicated by transaction hash. A successful transaction that
temporarily installs code and restores the previous implementation still resets the
clock, because the temporary implementation was live during execution, but it is one
code change rather than two. Writing the already-active implementation without an
initializer is a no-op and is listed in `ignoredUpgradeTransactions`. A reverted EVM
transaction produces no upgrade record and does not reset the clock. Historical
entries that store only timestamps dedupe equal timestamps as the best available
transaction identity.

Some legacy proxies were initialized before their first recognized `Upgraded` log.
For these, `ossification.json:firstUpgradeIsChange` records the audited exception so
the first event is not silently discarded. The judgment must be backed by a nonzero
implementation slot immediately before the event (or equivalent constructor/history
evidence); it is not inferred from event position or deployment proximity.

`criticalEvents` is an exception ledger. Each entry must identify its evidence
and consequence, and must be omitted when
`$pastUpgrades` or a contemporaneous HIGH diff already supplies the event. An
optional `updateId` applies the same critical code/state tag to its discovery update
card. An attributed event is ignored unless its contract belongs to the matching
current or historical perimeter; omit `contract` only for an unattributed
security-mechanism change on an intentionally excluded actor shell. Events
attributed to `historicalContracts` use `historical: true`; they contribute to the
rate but cannot reset today's perimeter clock. This lets validation repair known
history gaps without asking an agent to classify every ordinary proxy upgrade.

Consequences for validation:

- Validate that every critical proxy/upgrade mechanism produces a complete
  `$pastUpgrades`; missing handler coverage is a data-quality issue.
- For HIGH non-implementation fields added late, inspect old discovery/git history.
  If older critical changes matter, the current schema needs an auditable historical
  event backfill; changing today's severity alone is insufficient.
- Removed contracts require contract-level classification in `historicalContracts`.
  Their retained upgrades are still counted mechanically.

## Project validation pass

The tracked cohort is: arbitrum, base, linea, optimism, privacy-pools, railgun,
scroll, starknet, taiko, tornado-cash, uniswapv3, and zksync2. Zksync includes
`shared-zk-stack` through `includeProjects`.

For every project, apply the reviewer contract using permissions, values, `.flat/`
sources, templates, project overrides, and `diffHistory.md`. Check handler and
`$pastUpgrades` coverage for each critical proxy, inspect older history when HIGH
was added late, and use the backfill scanner for removed contracts. Finish by
running lint and smoke and producing the four review artifacts above.

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
- UI: `/security` and the Ossification details inside project Updates sections
  (direct-linked by `#ossification`), fed by `getOssificationEntries.ts`.

Use Node 22 through `fnm`. RPC and explorer credentials are in
`packages/config/.env`. Discovery inputs such as `.flat/` and current
`discovered.json` may be ignored, so inspect them directly rather than relying only on
`git ls-files`.

## Current status

- All 12 tracked projects have been validated: arbitrum, base, linea, optimism,
  privacy-pools, railgun, scroll, starknet, taiko, tornado-cash, uniswapv3, and
  zksync2.
- Current perimeter sizes are: arbitrum 45, base 35, linea 18, optimism 26,
  privacy-pools 17, railgun 8, scroll 50, starknet 49, taiko 36, tornado-cash 21,
  uniswapv3 8, and zksync2 30. Shared dependencies are included in the Starknet,
  Taiko, and ZKsync totals.
- Scroll includes its project-controlled core, governance, active verifier, and
  canonical bridge paths. Actor Safes, external-trust escrows, and retired
  verifiers are excluded; two Safe threshold changes are explicit events.
- Starknet includes its core plus the live shared SHARP verification chain.
  Actor Safes and external-additional-trust bridges are excluded; operator and
  deposit-status churn is not HIGH.
- Taiko includes its core/governance path and active shared SP1 verifiers. Actor
  Safes are excluded, with three direct protocol Safe threshold changes retained
  as explicit events.
- ZKsync Era includes its core bridge, proof, governance, and token-governance
  paths from the project and shared stack. Actor Safes and external wstETH custody
  are excluded; two direct Matter Labs Safe threshold changes are explicit events.
- Removed-contract backfill is complete for the cohort; runtime history remains
  limited by the caveat above for late-added HIGH value annotations.

## Suggested integration order

1. Discovery schema and transaction-aware proxy upgrade history.
2. Metric calculation, project-page integration, and `/security` summary UI.
3. Reviewed project classifications and their generated discovery artifacts.

Keep the incident backtest scripts and datasets separate from the product change;
they support the two-year constant but are not runtime dependencies.
