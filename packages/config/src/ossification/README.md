# Ossification

The ossification metric shows how long the critical perimeter of a project has
not changed. The critical perimeter is the set of critical contracts of the
project.

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
availability, or privacy. Actor containers, for example Safes and EOAs, are
not critical. Declare a critical contract in the discovery configuration, in a
template or in a `config.jsonc` override:

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

**Critical code change.** A change of the implementation of a critical
contract.

**Critical state change.** A change of a value with `severity: "HIGH"` on a
critical contract. Set the severity to HIGH when a change of the value can
change the security conditions of user assets or protected state. These
conditions are: control, validation, finality, freezing, censorship, loss,
creation, and disclosure. A MEDIUM value puts the project under review on the
frontend. It does not reset the clock.

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
  A critical contract with no known age gives no input at all.
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

Severity is judged by today's `fieldMeta`, retroactively in both directions:
a field reclassified HIGH today reclassifies its past changes, one downgraded
today silences them. Annotations written into old entries are not consulted.

**The newest change must be dated.** The score hinges on the timestamp of the
change that starts the project clock. `ossificationUncertainty.test.ts` fails
for any project whose newest change sets the clock and is only known as an
interval, until the review either adds a reviewed event with the exact time or
lists the update in `acceptedIntervals`.

## ossification.json

`ossification.json` contains manual corrections. `OssificationPatch.ts`
validates the file. The file does not define the perimeter. The perimeter is
in the discovery configuration.

- `events`: reviewed changes anchored to their transaction, each on a
  perimeter contract (a change on an excluded Safe is attributed to the
  contract the Safe controls). One replaces the mechanical event of its
  contract with the same transaction, so a first upgrade that was a real
  change is listed here as a code event. A transaction that upgraded several
  contracts needs one event for each contract it replaces. One naming `updateId` replaces the mechanical events of
  that update for its contract with the precise time.
- `ignoredTransactions`: `$pastUpgrades` transactions that did not change the
  contract.
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
- `packages/config/src/ossification/` (this folder): `getOssificationInput`
  calculates the input. `measureOssification` calculates the result.
  `loadOssification` reads the files. `getProjects` calls it at build time
  with one `now` value for all projects. The build stores the result in the
  `ossification` column of the SQLite database. The clocks are timestamps. The
  frontend calculates the ages at request time.
- `l2b ossification <project> [--input]`: Shows the result for a project. With
  `--input`, it shows the perimeter and the events. Build `packages/config`
  first.
