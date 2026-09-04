# Ossification

## Metric semantics

Ossification measures how long the complete security-critical contract perimeter
has remained unchanged.

- **Ossification (0–100):** the interpolated percentile of the perimeter's age
  within the published exploit-age curve — the share of recorded code-bug
  exploits whose exploited code was younger. Incident research and curve
  construction live in the standalone `ossification-dataset` repository
  (`dist/latest/incidents.json`, one curve row per reviewed incident, validated
  against `schema/release-incidents.schema.json`);
  `packages/shared/src/ossification/ossificationCurve.ts` is its generated
  runtime projection (the rows' `codeAgeSeconds`), stamped with the source
  dataset commit.
  Regenerate with `l2b ossification curve`, verify with `--check`.
- **Last change:** age of the project clock. The clock starts at the newest
  deployment or qualifying change in the current perimeter.
- **Battle-tested exposure (USD·years):** project TVS integrated from the project
  clock start until now. It is null without TVS data and zero while an unverified
  critical contract gates maturity.
- **Critical changes / year:** qualifying events in the trailing 36 months,
  clustered into 24-hour windows. The denominator is clipped to the observed
  history and to the project's own start, and is at least 30 days. A perimeter
  can be older than the project using it — an OP-stack chain adopting the shared
  SuperchainConfig, contracts deployed and iterated weeks before genesis — and
  those changes are not the project's doing: mechanical history before the
  project start is left out of both the numerator and the denominator, while
  contract clocks, deployments and reviewed `criticalEvents` keep the full
  history.

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
| `ossification.json` | Must exist for the project; shape enforced by `OssificationJson.ts` | Opts the project into the metric |
| `discovered.json` contract | `type === "Contract"`, has an address, and `critical === true` | Joins the current security perimeter |
| `includeProjects` | Listed in the root project's `ossification.json` | Adds that project's current critical contracts and discovery history to the same perimeter |
| `sinceTimestamp` | Current critical contracts only | Deployment candidate for the contract clock; deployment resets maturity but is not a change-rate event |
| `$pastUpgrades` | Current critical contracts; the first transaction is initialization unless audited in `firstUpgradeIsChange`; audited later initialization/no-op transactions are listed per contract in `ignoredUpgradeTransactions` | Latest qualifying transaction timestamp can reset the clock; every non-initialization transaction is a change-rate event. Multiple upgrade records from one transaction (for example upgrade, execute, restore) form one code change |
| `changelog.json` watched change | Address belongs to a current critical contract and the entry changes a field whose CURRENT curated severity is HIGH (`fieldMeta` in discovered.json) | Resets the clock and adds a change-rate event |
| Implementation change fallback | Address belongs to a current critical contract and that contract has no `$pastUpgrades` | Resets the clock and adds an event regardless of field severity |
| `criticalEvents` | Reviewed, tx-anchored event that mechanical discovery history cannot reconstruct or dates imprecisely | Adds the specified code/state event. An entry naming both `updateId` and `contract` supersedes that update's mechanical diff events for that contract; `historical: true` events feed the change rate only and never reset the current clock |
| `unverified` | Any current critical contract | Gates maturity, score, and exposure to zero |
| `historicalContracts` | Entry has `critical: true` and is no longer in the current perimeter | Closed reviewed ledger fixed at the removal review (onchain upgrade timestamps plus reviewed `criticalEvents`; diff history is never consulted for it); affects only change history/rate, never the current clock or unverified gate |
| `chainConfig.sinceTimestamp` | Root project only, chain projects only | The project start: mechanical events before it are not charged to this project's change rate, and the rate window begins here |
| Project `TokenValue` series | Root project only, frontend | Supplies battle-tested exposure; it does not affect score or change rate |

## Where things live

- `packages/shared/src/ossification/`: the pure engine. `getOssificationInfo`
  turns perimeter contracts, changelog entries and reviewed events into a
  time-independent `ProjectOssificationInfo`; `measureOssification` turns that
  into ages, score and change rate for a given moment. `changelogFields.ts`
  holds the single set of rules that classify a recorded field diff (used by
  the engine and the lint alike); `getOssificationPerimeter.ts` is the
  lint/research closure and never decides runtime membership.
- `packages/config/src/ossification/` (this folder): the build step.
  `loadOssificationInfo` reads `ossification.json` (validated by
  `OssificationJson.ts`), `discovered.json` and `changelog.json`, and
  `getProjects` stores the result as `ossificationInfo` on every opted-in
  project. `ossificationJson.test.ts` pins every curated reference (contract
  attribution, historical ledger, includeProjects) and
  `changelogIntegrity.test.ts` pins `changelog.json` to the diffHistory entries
  and every `criticalEvents.updateId` to a changelog entry.
- `packages/l2b`: `changelog.json` is written by every discovery run straight
  from the computed diff (`implementations/discovery/changelog/`), and the
  research tooling is under `l2b ossification`:
  - `lint <projectId...> [--no-timestamps]`: candidate worklist for
    missing/excess flags, the severity-history audit (silenced recorded-HIGH
    events), the historical-ledger closure check, and the timestamp audit,
    which re-derives every tx-anchored `criticalEvents` date from its receipt
    (RPC; skipped per chain when none is configured). Worklist rows require
    judgment; a timestamp mismatch is an error and exits non-zero.
  - `fetch-events <chain:address> <eventSig>`: onchain log history of a
    field's mutation event as ready-to-review `criticalEvents` entries.
  - `backfill <projectId>`: removed-contract evidence from full git history.
  - `curve [--check]`: project the checked-out sibling dataset's canonical
    curve release into the runtime age knots.
  - `smoke [projectId...] [--perimeter]`: score and perimeter inspection from
    the built config (rebuild `packages/config` first).
  - `l2b migrate-changelog <projectId...>`: one-time build of `changelog.json`
    from a project's existing diffHistory.md when it opts in (also done
    automatically by the first discovery run after `ossification.json` appears).
- `packages/frontend/src/server/features/projects/ossification/`: reads
  `ossificationInfo` from the project service, measures it against now, and
  adds the TVS exposure and the table timeline. UI: `/ossification` and the
  Ossification details inside project Updates sections (direct-linked by
  `#ossification`).

## Merging main

`discovered.json`, `diffHistory.md`, and `changelog.json` are derived state;
`config.jsonc` and templates are source. Merge source normally, take main for
derived files, then re-derive with this branch's configs (l2b rewrites
`changelog.json` together with diffHistory.md on every run):

1. One-time per clone: register a take-theirs merge driver
   (`git config merge.takeTheirs.driver 'cp %B %A'`) and scope it in
   `.git/info/attributes` to `packages/config/src/projects/**/discovered.json`,
   `**/diffHistory.md` and `**/changelog.json`.
2. Record the baseline (`l2b ossification smoke` output), then `git merge main`.
3. Rebuild tooling (`pnpm build:dependencies` in `packages/l2b` — stale schemas
   fail silently), then `l2b refresh-discovery -m "reapply branch discovery
   config after merging main"`: it detects every project whose committed
   discovery no longer matches its config/template hashes and reruns exactly
   those.
4. Rebuild `packages/config`, diff the smoke output against the baseline and
   run the lint audits; an unexplained clock or event-count change means a
   branch-only watched entry was dropped by the merge — recover it as an
   onchain-anchored `criticalEvents` entry, never by hand-editing diff history.
