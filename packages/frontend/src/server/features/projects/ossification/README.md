# Ossification

## Metric semantics

Ossification measures how long the complete security-critical contract perimeter
has remained unchanged.

- **Ossification (0–100):** the interpolated percentile of the perimeter's age
  within the published exploit-age curve — the share of recorded code-bug
  exploits whose exploited code was younger. Incident research and curve
  construction live in the standalone `ossification-dataset` repository
  (`dist/latest/curve.json`, validated against
  `schema/release-curve.schema.json`); `ossificationCurve.ts` is its generated
  runtime projection, stamped with the source dataset commit. Regenerate with
  `scripts/ossification-incidents-curve.ts`, verify with `--check`.
- **Last change:** age of the project clock. The clock starts at the newest
  deployment or qualifying change among all current critical contracts.
- **Battle-tested exposure (USD·years):** project TVS integrated from the project
  clock start until now. It is null without TVS data and zero while an unverified
  critical contract gates maturity.
- **Critical changes / year:** qualifying events in the trailing 36 months,
  clustered into 24-hour windows. The observation denominator is at least 30 days.

The Security summary shows the exit window as context for the upgrade capability.

## Definitions

**Critical contract** (`critical: true`) — a contract whose code or
configuration change can materially change whether protected assets, state,
availability, or privacy remain secure.

- Include: custody, verification, core protocol, and escape/pause contracts,
  plus the contracts implementing their upgrade or governance mechanism
  (ProxyAdmins, upgrade executors, timelocks, governors, modules, guards).
- Exclude: actor containers (Safes/multisigs/EOAs) — members name who holds a
  trusted role; the container is not the mechanism. Exclude every escrow or
  gateway whose TVS is tagged 'with additional trust assumptions' — the TVS
  tag, not the governance domain, is the test, so a project-governed ADD_TA
  escrow (e.g. a StarkGate token bridge or an Arbitrum custom-gateway escrow)
  is also out; give its important state `severity: "MEDIUM"` so changes still
  surface without touching the clock. Escrows whose TVS counts without the
  tag stay in.

**Critical code change** — any implementation change to a critical contract, or
the deployment of a new critical contract. Always counts; needs no severity
annotation.

**Critical state change** — a change to a non-implementation value marked
`severity: "HIGH"` on a critical contract. Mark a value HIGH exactly when
changing it can alter the conditions under which user assets or protected state
may be controlled, validated, finalized, frozen, censored, lost, created, or
disclosed. In practice:

- HIGH: a role's powers or scope, threshold, delay, controller, modules, guard,
  authority path, verifier/vkey, program or config hash, custody or accounting rule.
- Not HIGH: identity churn inside an unchanged role (multisig members,
  sequencers, batch posters, validators, operators, signers, committee members)
  while powers and trust model stay the same.
- MEDIUM: important-but-not-ossification-relevant state — pausing/unpausing,
  and the watched state of escrows outside the perimeter (e.g. TVS tagged
  'with additional trust assumptions'). A MEDIUM change puts the project under
  review on the frontend and lights up the update monitor, but never resets
  the ossification clock — only HIGH does.
- Classify a field as a whole; every change to a HIGH field counts. Split broad
  fields whose values differ in security consequence.

The consequence test is the same across verticals — apply it to each system's
asset, state-integrity, availability, and confidentiality boundaries (for L2s:
state validity, finality, sequencing, DA, bridges, forced exits; for DeFi:
custody, accounting, pricing, liquidation, minting, withdrawals; for Privacy:
proof verification, nullifiers, anonymity, viewing authority).

## Exact runtime inputs

| Input | Inclusion rule | Effect |
| --- | --- | --- |
| `ossification.json` | Must exist for the project | Opts the project into the metric |
| `discovered.json` contract | `type === "Contract"`, has an address, and `critical === true` | Joins the current security perimeter |
| `includeProjects` | Listed in the root project's `ossification.json` | Adds that project's current critical contracts and discovery history to the same perimeter |
| `sinceTimestamp` | Current critical contracts only | Deployment candidate for the contract clock; deployment resets maturity but is not a change-rate event |
| `$pastUpgrades` | Current critical contracts; the first transaction is initialization unless audited in `firstUpgradeIsChange`; audited later initialization/no-op transactions are listed per contract in `ignoredUpgradeTransactions` | Latest qualifying transaction timestamp can reset the clock; every non-initialization transaction is a change-rate event. Multiple upgrade records from one transaction (for example upgrade, execute, restore) form one code change |
| `changelog.json` watched change | Address belongs to a current critical contract and the entry changes a field whose CURRENT curated severity is HIGH (`fieldMeta` in discovered.json) | Resets the clock and adds a change-rate event |
| Implementation change fallback | Address belongs to a current critical contract and that contract has no `$pastUpgrades` | Resets the clock and adds an event regardless of field severity |
| `criticalEvents` | Reviewed, evidence-backed event that mechanical discovery history cannot reconstruct or dates imprecisely | Adds the specified code/state event; see History semantics for the supersede and `historical` rules |
| `unverified` | Any current critical contract | Gates maturity, score, and exposure to zero |
| `historicalContracts` | Entry has `critical: true` and is no longer in the current perimeter | Closed reviewed ledger (see History semantics); affects only change history/rate, never the current clock or unverified gate |
| Project `TokenValue` series | Root project only | Supplies battle-tested exposure; it does not affect score or change rate |

## Tools and code map

- `getProjectOssification.ts`: opt-in, current/historical perimeter loading,
  discovery history, and TVS exposure.
- `getOssificationFactor.ts`: pure clocks, event extraction, clustering, and score.
- `getOssificationPerimeter.ts`: lint/research closure only; it never decides runtime
  membership.
- `scripts/ossification-lint.ts <projectId>`: candidate worklist for missing/excess
  flags, the severity-history audit (silenced annotated-HIGH events), and the
  historical-ledger closure check; suggestions require judgment.
- `scripts/ossification-fetch-events.ts <chain:address> <eventSig>`: onchain log
  history of a field's mutation event as ready-to-review `criticalEvents`
  entries, for pre-coverage backfills.
- `scripts/ossification-backfill.ts <projectId> [--json]`: removed-contract evidence
  from full git history.
- `scripts/ossification-build-changelog.ts [--check | projectId...]`: seed or
  verify `changelog.json`, the machine-readable projection of diffHistory.md
  that the runtime consumes; run `--check` in CI.
- `scripts/ossification-incidents-curve.ts [--check]`: project the checked-out
  sibling dataset's canonical curve release into the runtime age knots.
- `scripts/ossification-smoke.ts [projectId...] --perimeter`: score and perimeter
  inspection.
- UI: `/ossification` and the Ossification details inside project Updates sections
  (direct-linked by `#ossification`), fed by `getOssificationEntries.ts`.

## Merging main

`discovered.json`, `diffHistory.md`, and `changelog.json` are derived state;
`config.jsonc` and templates are source. Merge source normally, take main for
derived files, then re-derive with this branch's configs
(`changelog.json` is regenerated by l2b alongside diffHistory.md, or run
`scripts/ossification-build-changelog.ts` after the merge and verify with
`--check`):

1. One-time per clone: register a take-theirs merge driver
   (`git config merge.takeTheirs.driver 'cp %B %A'`) and scope it in
   `.git/info/attributes` to `packages/config/src/projects/**/discovered.json`
   and `**/diffHistory.md`.
2. Record the baseline (`ossification-smoke.ts` output), then `git merge main`.
3. Rebuild tooling (`pnpm build:dependencies` in `packages/l2b` — stale schemas
   fail silently), then `l2b refresh-discovery -m "reapply branch discovery
   config after merging main"`: it detects every project whose committed
   discovery no longer matches its config/template hashes and reruns exactly
   those.
4. Diff the smoke output against the baseline and run the lint audits; an
   unexplained clock or event-count change means a branch-only watched entry
   was dropped by the merge — recover it as an onchain-anchored
   `criticalEvents` entry, never by hand-editing diff history.
