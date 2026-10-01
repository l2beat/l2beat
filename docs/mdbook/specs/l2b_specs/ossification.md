# Ossification

The critical perimeter is the project's security-critical contracts. Its age
is the time since the newest deployment or relevant code or state change.
The ossification score is derived from that age. Configure the perimeter with
`critical` and relevant state with field `severity`.

## The metric

- **Ossification (0 to 100).** The percentile of the age of the perimeter on
  the exploit-age curve. The value is the part of the recorded code-bug
  exploits that hit code younger than the perimeter. The `ossification-dataset`
  repository publishes the curve. `ossificationCurve.json` is a copy of the
  JSON from its website. The `hash` value identifies the dataset release.
- **Last change.** The age of the project clock. The project clock starts at
  the newest deployment or critical change in the current perimeter.
- **Critical changes per year.** The number of critical changes in the last 36
  months, divided by the observed time. Changes that occur within 24 hours
  count as one change. The observed time starts at the oldest known event or
  at the project start. It is not less than 30 days.

## Definitions

**Critical contract.** A contract is critical when a change to its code or its
configuration can change the security of the protected assets, state,
availability, or privacy. Include custody, verification, core protocol,
escape and pause contracts, and their upgrade or governance mechanisms.
Actor containers, for example Safes and EOAs, are not critical.

Include an escrow only when the project governs and manages both it and its
L2 counterpart. Exclude escrows controlled by external token owners, including
those with privileged roles. This often leaves only one or two canonical
escrows per project.

Declare a critical contract in a discovery template or `config.jsonc` override:

```jsonc
"critical": true                                  // critical for the full life of the contract
"critical": { "sinceTimestamp": 1712862035 }      // critical from this time
"critical": { "untilTimestamp": 1754340995 }      // critical until this time
"critical": { "sinceTimestamp": 1, "untilTimestamp": 2 }
```

Changes before `sinceTimestamp` do not count for the change rate. The clock
keeps the full age of the contract. After `untilTimestamp` the contract has no
clock. Its verification status has no effect on the score. Its changes before
`untilTimestamp` count. A `config.jsonc` override has priority over a template.
The override remains valid when discovery does not find the contract any more.
Set `untilTimestamp` on the override to keep the history of a contract that
left the project.

**Shared modules.** The perimeter of a project includes the critical
contracts of every shared module it references that the project can reach.
These are the discoveries `ProjectDiscovery` loads with the project, and the
reachability is the one it uses for contracts and permissions. A module
contract the project cannot reach is left out together with its overrides and
reviewed events. A retired contract known only from a module's
`diffHistory.md` counts for every project that references it. Each module's
contracts are judged by the module's own `config.jsonc`, templates,
`diffHistory.md` and `ossification.json`. The project start also bounds the
changes of the module. A module whose critical contracts have all retired
still adds its changes and resets. A contract that two discoveries both
contain must have the same row in both, and has one row.

**Critical code change.** A change of the implementation of a critical
contract.

**Critical state change.** A change of a field with `severity: "HIGH"` on a
critical contract resets its clock and counts as a critical change.

## Configuring field severity

- **HIGH:** conditions under which assets or protected state can be controlled,
  validated, finalized, frozen, censored, lost, created or disclosed. Examples:
  role powers or scope, thresholds, delays, controllers, modules, authority
  paths, verifiers or vkeys, program or config hashes, custody or accounting rules.
- **MEDIUM:** needs review without resetting the clock. Examples: pause state,
  pause-role holders (`guardian`, `pauser`), watched state of excluded escrows.
  Changes reach the update monitor and put the project under review on the frontend.
- **LOW or unset:** identity within an unchanged role, such as multisig members,
  sequencers, batch posters or operators. Prefer unset until researched.

Before marking a field HIGH, check that it:

1. Represents contract state. `opStackDA` observes recent batcher transactions.
2. Can change on a live system. Genesis-fixed `gasPayingToken` changes are
   already covered by implementation upgrades.
3. Separates configuration from live counters. Derive `bufferConfig` from
   `SequencerInbox.buffer` with `"edit": ["delete", "prevBlockNumber", …]`.
4. Does not duplicate a value classified differently. Making
   `UpgradeExecutor.accessControl` HIGH also counts changes to
   `EXECUTOR_ROLE.members`, already exposed as LOW in `executors`.

For role-holder changes, distinguish identity from mechanism, such as EOA to
multisig. Record confirmed mechanism changes in `ossification.json` against
the critical contract controlled.

Put severity in the template when it applies to the contract shape. Use a
project override for untemplated contracts or deployment-specific judgements,
with a comment explaining why.

History follows the field's current name. Renaming a field disconnects its
old history. Give raw and formatted twins the same severity, for example
`getMinDelay` and `getMinDelayFormatted`. Today's `fieldMeta` applies
retroactively: raising severity to HIGH counts past changes, lowering it
stops counting them. Old diff annotations are not consulted.

Run `l2b colorize` after severity edits to refresh `fieldMeta` in
`discovered.json`. Field severity values are excluded from the structure hash,
so changing one does not trigger rediscovery. Adding a field key changes the
hash and requires rediscovery of dependent projects.

## Data flow

```
discovered.json ─┐
diffHistory.md  ─┼─ getOssificationInput ─► OssificationInput ─► measureOssification ─► ProjectOssification
config.jsonc    ─┤        (judgement)          four tables            (arithmetic)
templates       ─┤
ossification.json┘         (patch)
```

The derivation answers every per-contract question. The measure only
aggregates. The input is four tables:

- `contracts`: one row per contract that is critical today, with its name,
  address, verification status, `ossifyingSince` (the last reset of its
  clock: deployment, initialization or change) and its own change counts.
  Every critical contract must have a known age.
- `changes`: every critical change made while its contract was critical,
  for current and retired contracts, ascending. A retired contract exists
  only here. A reviewed change from `ossification.json` is always here.
- `resets`: moments the perimeter was reset without a change: deployments,
  initializations, adoptions. The timeline only.
- `observedSince`: when observation of the perimeter began. The rate window
  does not start earlier, and not before the project itself.

The measure computes: the project clock as the youngest `ossifyingSince`; the
score from the age of the project clock, or 0 when a row is unverified; the
rate as the 24-hour clusters of `changes` inside the window; the timeline as
the clusters of `changes` and `resets`; one critical-update tag per
`updateId`.

**Which changes are the project's own.** A mechanical change counts when it
happened at or after the contract's `sinceTimestamp` and at or after the
project start. A change before that still resets the contract's clock, because
age is physical, but it is not in `changes`. A change after `untilTimestamp`
is dropped. A reviewed change always counts.

**Events.** In order of trust:

| Source | Event | Time |
| --- | --- | --- |
| `$pastUpgrades` of a critical contract | code change; the first entry is the initialization, a reset | exact, onchain |
| `$pastUpgrades.N` appended in a diffHistory entry, not yet known | code change (retired contracts, handler gaps) | exact, onchain |
| `$implementation` change in a diffHistory entry, contract without `$pastUpgrades` | code change | between the previous run and this one |
| change of a field that is HIGH today, in a diffHistory entry | state change | between the previous run and this one; dated at an upgrade bundled in the same diff when there is one |
| `ossification.json` `events` | reviewed code or state change | exact, tx-anchored |

Every change carries `timestamp` (when it was certainly in effect) and, when
known, `earliest` (the earliest it can have happened). The measure uses
`timestamp`, the conservative choice.

**The newest change must be dated.** The score hinges on the timestamp of the
change that starts the project clock. `ossificationUncertainty.test.ts` fails
for any project whose newest change sets the clock and is only known as an
interval, until the review either adds a reviewed event with the exact time or
lists the update in `acceptedIntervals`.

## ossification.json

`ossification.json` contains manual corrections. `OssificationPatch.ts`
validates the file. The file does not define the perimeter. The perimeter is
in the discovery configuration. A file corrects only the contracts of its own
discovery, so the corrections for a shared module are in the module's file.

Add a reviewed event when discovery cannot date a change or mistakes a later
upgrade for initialization. For proxies without `$pastUpgrades`, bisect the
implementation slot or use a block number recorded by the contract. For a
change bounded by two discovery runs, find its transaction. Record the
transaction hash, its block timestamp and a reason. Use `updateId` to link the
diffHistory entry, and re-check that link after rediscovery.

- `events`: reviewed changes anchored to their transaction, each on a
  perimeter contract (a change on an excluded Safe is attributed to the
  contract the Safe controls). One replaces the mechanical event of its
  contract with the same transaction, so a first upgrade that was a real
  change is listed here as a code event. A transaction that upgraded several
  contracts needs one event for each contract it replaces. One naming
  `updateId` replaces the mechanical events of that update for its contract
  with the precise time.
- `ignoredTransactions`: `$pastUpgrades` transactions that did not change the
  contract. The list applies to every perimeter contract the transaction
  touched. If one transaction was a no-op on one contract and a real upgrade
  on another, research will tell us, and the entries can then name a contract.
- `ignoredUpdates`: `diffHistory.md` entries that came from a discovery bug.
- `acceptedIntervals`: `diffHistory.md` entries with an interval time that can
  remain the newest change.

## Files

- `@l2beat/discovery`: `parseDiffHistoryBlocks` reads diff blocks back into
  the structure `discoveryDiffToMarkdown` rendered; `getDiffHistoryChanges`
  types every watched change (implementation, appended upgrade, value,
  representation-only) with a chain-specific address, resolving the chain
  of legacy entries from their header; `parsePastUpgrades` reads the
  `$pastUpgrades` tuples. A round-trip test, a seeded fuzz test and corpus
  tests over every project's diffHistory.md pin them. `CriticalFlag` in
  `ColorConfig.ts` is the shape of `critical`.
- `packages/config/src/ossification/`: `getOssificationInput`
  calculates the input. `measureOssification` calculates the result.
  `loadOssificationInput` reads the files. `ProjectDiscovery` exposes both
  steps as `getOssificationInput` and `getOssification`. A project opts in by
  setting `ossification: discovery.getOssification(chainStart)` in its config,
  so
  ossification can be switched off per project without touching the discovery
  data. All calls share one `now` value. The build stores the result in the
  `ossification` column of the SQLite database. The clocks are timestamps. The
  frontend calculates the ages at request time.
- `l2b ossification <project> [--input]`: Shows the result for a project. With
  `--input`, it shows the perimeter and the events. Build `packages/config`
  first.
