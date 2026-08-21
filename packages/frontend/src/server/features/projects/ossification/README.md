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
The Security summary shows the exit window as context; it is not a metric input.

## Definitions

Three terms carry the whole metric. Every reviewer decision reduces to them.

**Critical contract** (`critical: true`) — a contract whose code or
configuration change can materially change whether protected assets, state,
availability, or privacy remain secure.

- Include: custody, verification, core protocol, and escape/pause contracts,
  plus the contracts implementing their upgrade or governance mechanism
  (ProxyAdmins, upgrade executors, timelocks, governors, modules, guards).
- Exclude: actor containers (Safes/multisigs/EOAs) — members name who holds a
  trusted role; the container is not the mechanism. Exclude externally governed
  escrows and gateways (additional-trust assets); project-governed canonical
  bridges stay in.

**Critical code change** — any implementation change to a critical contract, or
the deployment of a new critical contract. Always counts; needs no severity
annotation.

**Critical state change** — a change to a non-implementation value marked
`severity: "HIGH"` on a critical contract. Mark a value HIGH exactly when
changing it can alter the conditions under which user assets or protected state
may be controlled, validated, finalized, frozen, censored, lost, created, or
disclosed. In practice:

- HIGH: a role's powers or scope, threshold, delay, controller, modules, guard,
  authority path, verifier/vkey, custody or accounting rule.
- Not HIGH: identity churn inside an unchanged role (multisig members,
  sequencers, batch posters, validators, operators, signers, committee members)
  while powers and trust model stay the same.
- Classify a field as a whole; every change to a HIGH field counts. Split broad
  fields whose values differ in security consequence.

The consequence test is the same across verticals — apply it to each system's
asset, state-integrity, availability, and confidentiality boundaries (for L2s:
state validity, finality, sequencing, DA, bridges, forced exits; for DeFi:
custody, accounting, pricing, liquidation, minting, withdrawals; for Privacy:
proof verification, nullifiers, anonymity, viewing authority).

## Reviewer procedure

If a decision cannot be supported by evidence, record it as unresolved.

1. **Perimeter**: flag critical contracts per the definition; give a short
   reason for non-obvious inclusions/exclusions.
2. **Severities**: set HIGH per the definition; classify each contract
   independently. A 24h cluster mixing code and state changes counts as a code
   change.
3. **Initialization**: deployment and setup before a component first acquires
   security authority start its age but are not change-rate events; any later
   change counts, however soon. Never call the first recorded upgrade
   "initialization" merely because it is first — require a zero implementation
   slot, constructor trace, or equivalent evidence, and record exceptions in
   `firstUpgradeIsChange`.
4. **Evidence**: prefer a transaction hash and onchain timestamp. Where
   mechanical history is incomplete, add a `criticalEvents` entry with a
   one-sentence security consequence (and `updateId` when a matching update card
   exists). An event may omit `contract` only for a security-mechanism change
   stored on an intentionally excluded actor shell (e.g. a Security Council
   Safe's signing threshold).

Review output per project: (1) included/excluded contracts with reasons,
(2) severity changes made, (3) history gaps, initialization exceptions, and
reviewed `criticalEvents`, (4) lint/smoke output with any unexpected clock reset
explained.

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

## History semantics

- State-change history is a snapshot ledger: the runtime reads committed
  `diffHistory.md`, whose severity was copied from the field metadata in force
  when each diff was generated. Changing severity today does not reclassify old
  diff blocks — late-added HIGH fields need an auditable `criticalEvents`
  backfill if their older changes matter.
- Implementation history is mechanical: `$pastUpgrades` carries onchain
  timestamps for every recognized upgrade. When present, implementation diff
  blocks are ignored (no double counting); without it, implementation diffs are
  the fallback at the discovery review timestamp.
- Upgrade events dedupe by transaction hash: one transaction with several
  upgrade records (upgrade/execute/restore) is one code change; a temporary
  install-and-restore still resets the clock (the code was live). Re-writing the
  already-active implementation without an initializer is a no-op, listed in
  `ignoredUpgradeTransactions`. A reverted transaction produces nothing.
  Timestamp-only historical entries dedupe equal timestamps.
- `firstUpgradeIsChange` records the audited exception for legacy proxies
  initialized before their first recognized `Upgraded` log (evidence bar: a
  nonzero implementation slot immediately before the event, or equivalent).
- `criticalEvents` is an exception ledger, never a duplicate channel: omit an
  entry when `$pastUpgrades` or a contemporaneous HIGH diff already supplies the
  event. Attributed events must match a current or historical perimeter
  contract; `historical: true` events feed the rate only and never reset today's
  clock.

Validation consequences: every critical proxy needs complete `$pastUpgrades`
(missing handler coverage is a data-quality bug); late-added HIGH fields need
their old history inspected and, if material, backfilled; removed contracts need
contract-level classification in `historicalContracts`.

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
