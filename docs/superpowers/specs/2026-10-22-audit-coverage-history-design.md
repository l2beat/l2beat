# Audit coverage history: coverage of the critical perimeter over time

Date: 2026-10-22. Status: implemented for Scroll and Unichain, findings in section 11. Extends the audits prototype described in
`2026-09-14-audit-data-flow-design.md` (background) and
`2026-10-07-audit-timeline-project-audits-design.md` (which audits count as the project's).

## 1. Goal and scope

Add a chart to the audits and upgrades timeline section of the audits project page that shows,
from the project's launch to now, the share of deployed lines in the critical perimeter that match
audited code, taking into account only the audits published by each moment and the code deployed
at that moment.

This is a prototype with two purposes:

1. Learn whether the feature is feasible in production and which technical problems it raises.
2. See whether the chart carries insight. The hypothesis is that it shows, per upgrade, how long
   and how deep the deployed code was ahead of its audits.

Scope: the generation step in `l2b audit-coverage`, the config schema and test, the frontend view
model and chart. Projects: Scroll and Unichain first, OP Mainnet as the runtime stress test. The
command is opt-in per run (`--history`), so other projects are unaffected until their coverage is
regenerated with the flag.

Out of scope: the dashboard sparkline, shared discovery modules (the current coverage covers the
project's own discovery only, and so does the history), and the retired contracts of projects that
migrated their perimeter (section 7).

## 2. Definitions

- **Perimeter**: the contracts the dashboard shows, by the same rule as `selectContracts` in
  `packages/frontend/src/server/features/audits/coverage/coverageModel.ts`: contracts with a
  `critical` flag when any has one, else every contract discovery found. For the history a contract
  with a `critical` window is a member only inside its window.
- **State at t**: the members of the perimeter at t and, for each, the code addresses in force at
  t: the member's own address plus the implementations its proxy pointed to at t.
- **Audits at t**: the reports of the audit dataset dated at or before t. A report's date is its
  `date`, or the year and month its id ends with when it has none, parsed as midnight UTC. This is
  `parseReportDate` in `packages/frontend/src/server/features/audits/getAuditsProjectReports.ts`,
  which moves to a shared package (section 4.4). Reports with neither are undated and are counted
  only at the present (section 4.3).
- **Coverage at t**: the deployed units of the state at t matched against the audits at t with the
  existing matcher, summarized by the dashboard's rule: interfaces excluded, `lines` of a unit
  counted in the total, covered lines are `lines` for identical units, `covered` for differing
  ones, 0 for unaudited ones. Units are counted per deployed instance, as `summarizeUnits` does.
  Addresses without verified Solidity contribute no lines and are counted as `withoutSource`.
- **Point**: a timestamp at which the coverage is evaluated. Points come from audit dates, code
  changes of the state, the launch and the present. Between points the value is constant.
- **Launch**: where the timeline's launch marker sits, `getAuditsLaunch`: the ossification
  history's `observedSince`, else the chain's `sinceTimestamp`, else the earliest member start.

## 3. Data sources

| Need | Source | Notes |
| --- | --- | --- |
| Members and their windows | `discovered.json` entries with `critical` | `true`, or `{ sinceTimestamp?, untilTimestamp? }` |
| Member deployment time | entry `sinceTimestamp` | missing for a few entries, see 4.2 |
| Implementation history of a proxy | entry `values.$pastUpgrades` | `[isoDate, txHash, [implementations]]`, ascending; the same source ossification counts code changes from |
| Current implementations | `get$Implementations(entry.values)` | consistency check against the last past upgrade |
| Historic sources | explorer, through `deployedSourceFromDiscovery` | old implementations keep their verified source; cached in the discovery SQLite cache by address |
| Audits and their dates | `audit-index.json` reports | 55 of 494 reports are undated before the id fallback |
| Audited code | `audit-objects.json.zst` | split once, filtered per point |
| Launch | `ProjectService` | as `l2b ossification` does; needs `packages/config` built |

Not used: `diffHistory.md` and `ossification.json`. Ossification derives some code changes from
diff history entries and from reviewed events, and ignores some transactions. The history takes
every past upgrade as a code change, so its code points may differ from the timeline's critical
change markers. The generator logs the differences (section 4.7) and the evaluation decides whether
the two must be reconciled.

## 4. Generator: `l2b audit-coverage <project> --history`

New files live next to the existing ones in `packages/l2b/src/implementations/audit-coverage/`.
The existing pass is unchanged and runs first; the history pass reuses its parsed index, objects,
split audited code and the `getDeployedSource` function.

### 4.1 Command

`--history` adds the pass. Without it the command behaves as today, and an existing `history` field
of the output file is dropped (the file is rewritten whole, as now). The flag exists so that only
the selected projects carry a history while the prototype is evaluated.

With the flag the command reads the project through `ProjectService` (optional fields
`ossificationHistory` and `chainConfig`) to find the launch as `getAuditsLaunch` does, which needs
`packages/config` built, as `l2b ossification` does. A project unknown to the config, or one with
neither field, has no launch and the perimeter timeline supplies one (4.2).

### 4.2 Perimeter timeline (`perimeterTimeline.ts`)

Pure. Builds the members from the discovery output and answers the state at any t.

```ts
interface PerimeterMember {
  address: ChainSpecificAddress
  name: string
  /** Latest of deployment, critical since and launch. */
  since: number
  /** Critical until; undefined while a member. */
  until?: number
  /** Code addresses in force from each moment, ascending. */
  code: { from: number; addresses: ChainSpecificAddress[] }[]
}

interface PerimeterState {
  members: PerimeterMember[]
  /** Deduplicated code addresses of the members. */
  addresses: ChainSpecificAddress[]
}

function buildPerimeterTimeline(
  discovery: DiscoveryOutput,
  launch: number | undefined,
): { launch: number; members: PerimeterMember[] }
function perimeterAt(members: PerimeterMember[], t: number): PerimeterState
```

Rules:

- When no launch is given, the launch is the earliest `since` of the members computed without
  one, so the series starts at the earliest member.

- Selection: entries of type `Contract` with a `critical` flag of any shape when at least one has
  one, else every `Contract` entry. Unlike the dashboard, a member with `untilTimestamp` is kept,
  bounded by its window.
- `deployedAt` is the entry's `sinceTimestamp`, else the timestamp of its first past upgrade. An
  entry with neither is a member from the launch, with a warning.
- `since = max(deployedAt, critical.sinceTimestamp, launch)`; `until = critical.untilTimestamp`.
- `code` starts with `{ from: deployedAt, addresses: [address] }`. Each past upgrade appends
  `{ from: upgrade.timestamp, addresses: [address, ...implementations] }`. Past upgrades are
  parsed with their implementations by a local parser mirroring `parseUpgrade` (which drops them),
  deduplicated by transaction, sorted ascending.
- If the last entry's implementations differ from `get$Implementations(entry.values)`, the
  recorded history is incomplete: the last entry is replaced by the current implementations with
  a warning naming the address. The implementation is then assumed current since the last recorded
  upgrade.
- Entries before the launch collapse into the one in force at the launch.
- `perimeterAt(t)`: members with `since <= t` and (`until` undefined or `t < until`); the code of a
  member is its last entry with `from <= t`. Addresses are deduplicated across members (shared
  implementations).

### 4.3 Points (`historyPoints.ts`)

Pure. From the members, the report dates and the launch:

- **Launch**: `launch`, evaluated with the audits dated at or before it, so reports older than the
  project count from the first point.
- **Audit cutoffs**: every distinct report date in the index that is greater than the launch and
  at most the discovery timestamp, across all collections. Library and foreign reports are included
  so that the value is exact at every change; most of them change nothing and are dropped by
  deduplication (4.5). Cutoff semantics: a report dated d counts at every `t >= d`.
- **Code events**: every `code[i].from` with `i > 0` of every member, every `since` greater than
  the launch, every `until`. Events are sorted and clustered with the ossification rule: a new
  cluster starts when an event is more than 24h after the current cluster's start. A cluster yields
  one point at the cluster start, evaluated at the cluster's last event, so the state includes
  every change of the cluster. The audits at that point are those dated at or before the cluster's
  last event.
- **Now**: the discovery timestamp, evaluated from the main pass's output (see below).

A cutoff and a cluster start that fall on the same second merge into one point.

### 4.4 Audited code at a cutoff (`AuditedCode.ts`)

```ts
function auditedCodeAt(code: AuditedCode, index: AuditIndex, cutoff: number): AuditedCode
```

Returns a view of the audited code restricted to the reports dated at or before `cutoff`:

- `occurrences`: each occurrence keeps the reports of its `findings` whose date is at or before the
  cutoff and drops `directoryScoped` entries of removed reports; an occurrence without reports is
  removed; `collections` is recomputed from the remaining reports.
- `declarations`: those with at least one object that still has an occurrence, with `objects`
  filtered accordingly; `byName` and `lines` are rebuilt over them. `declarationsByObject`,
  `libraries` and `unparsed` are shared with the full index. Splitting is never repeated.
- Report dates come from `parseReportDate`, moved from the frontend to
  `packages/shared/src/tools/audits/parseReportDate.ts` and exported from `@l2beat/shared`, with
  its test. The frontend imports it from there.

The matcher (`matchDeclaration`, `coverFlat`) runs unchanged on the view. The newest-occurrence
tie break then picks the newest snapshot among the audits known at the cutoff, which is the
intended behavior.

Views are built lazily, one per distinct cutoff, and kept only while a point uses them. Points are
processed ascending, so one view is alive at a time.

### 4.5 Covering the points (`coverageHistory.ts`)

```ts
interface CoverageHistoryInputs {
  index: AuditIndex
  code: AuditedCode
  discovery: DiscoveryOutput
  launch: number
  project: string
}

async function coverageHistoryOfProject(
  inputs: CoverageHistoryInputs,
  getDeployedSource: GetDeployedSource,
  onProgress: (point: number, count: number, status: string) => void,
): Promise<AuditCoverageHistory>
```

For each point, ascending:

1. `perimeterAt(t_state)` gives the members and addresses. Sources are fetched through
   `getDeployedSource`, memoized per address for the run. Each flat source is hashed as in the main
   pass.
2. Each flat is covered against the view at the point's audit cutoff. Results are memoized per
   `(flat hash, cutoff)`.
3. **Skip rule.** Covering is the expensive step, so a flat that was covered at the previous
   point reuses that result when the reports added between the two points' cutoffs cannot change
   it. Let `addedObjects` be the objects that gained their first counted report between the two
   cutoffs and `addedNames` the names of
   the declarations in those objects (from `declarationsByObject`). The flat is recomputed only if
   `addedNames` intersects the flat's unit names, or if the previous result has an unmatched unit
   of at least 10 lines (eligible for the renamed search) and some added object occurs in the
   project's own collection or a library collection. Otherwise the previous result is reused.
   The rule is sound because same-name candidates are looked up by name only, renamed candidates
   are restricted to own and library collections, and a changed newest occurrence of an unchanged
   body changes no number.
4. The point's numbers are summarized over the members' flats with the rule of section 2.
5. The point's `reports` are the report ids first counted at this cutoff that some unit of the
   state references at this point. The point's `changes` are the members whose membership or flat
   set changed since the previous point: `added`, `removed` or `upgraded`. A past upgrade that left
   the flat hashes unchanged is not a change.
6. **Deduplication.** A point is dropped when its numbers equal the previous retained point's and
   it has no `reports` and no `changes`. The launch and the present are always kept.

The present is not matched again: its numbers, `withoutSource` and unit counts are computed from
the main pass's output with the same summarizing function, over the dashboard's contract selection
(which is `perimeterAt(discoveredAt)`), so the chart's last value is the dashboard's number by
construction. Its `reports` are the reports dated after the previous point that a current unit
references, its `changes` the members whose membership or flat set differs from the previous
point's state. Undated reports are counted only at the present; the ids of those that a current
unit references are recorded in `undatedReports` so the frontend can explain the final step.

Reports referenced by any point's `reports` are added to the output's `reports` map (extend
`reportsOf` with those ids), since a report matched in the past may be matched by no current unit.

Cost model, Scroll: about 60 flats in the perimeter over time, about 450 audit cutoffs globally
of which few add objects with Scroll's unit names, 2 to 5 code clusters. With the skip rule the
expected work is a few hundred `coverFlat` calls. OP Mainnet is the stress test: 115 past upgrades
mean up to 115 historic flats to fetch and cover, and 54 OP reports that share unit names with
every one of them. If a run exceeds roughly ten minutes, the next optimization is to key the memo
by the set of candidate declarations instead of by cutoff.

### 4.6 Output

`audit-coverage.json` gains an optional `history`. `schema_version` stays `1.0.0`: the field is
optional and the other twelve files remain valid.

```ts
type AuditCoverageHistory = {
  launch: number
  /** Ascending by timestamp, first at launch, last at discoveredAt. */
  points: AuditCoverageHistoryPoint[]
  /** Reports counted only at the present, see 4.5. */
  undatedReports: ReportId[]
}

type AuditCoverageHistoryPoint = {
  timestamp: number
  /** Members of the perimeter at this point. */
  contracts: number
  /** Members whose every code address lacks verified Solidity. */
  withoutSource: number
  /** Deployed unit instances per status, interfaces excluded. */
  units: { identical: number; differs: number; none: number }
  lines: { total: number; covered: number }
  /** Reports first counted here that a unit of this state references. */
  reports?: ReportId[]
  changes?: { address: ChainSpecificAddress; name: string; kind: 'added' | 'removed' | 'upgraded' }[]
}
```

Unit statuses are stored raw (`none`, not `unaudited`; no `library`), as in `units`; the frontend
derives display statuses as it does today. The l2b types derive from `ProjectAuditCoverage` in
`@l2beat/config`, as the existing ones in `AuditCoverage.ts` do.

### 4.7 Logging

The pass logs a progress line per point and ends with a summary: points evaluated, retained, flats
covered, flats reused. Warnings:

- a code address without verified source, with the member and the interval it was in force;
- a member without deployment time;
- a proxy whose past upgrades do not end at its current implementations;
- when the project has an ossification history (through `ProjectService`), each critical code
  change of the history without a code point within 24h, and each code point without such a
  change. These are the alignment differences of section 3, listed for the evaluation.

### 4.8 README and FRONTEND

`README.md` gets a section on the history pass (inputs, points, skip rule, output), `FRONTEND.md` a
section on reading `history`.

## 5. Config

- `ProjectAuditCoverageSchema` in `packages/config/src/types.ts` gains `history` as an optional
  object matching 4.6.
- `packages/config/src/test/discovery/auditCoverage.test.ts` gains, for every coverage with a
  history: timestamps strictly ascending; first timestamp is `launch`; last timestamp is
  `discoveredAt`; the last point's `lines`, `units`, `contracts` and `withoutSource` equal the
  numbers recomputed from `contracts`, `flats` and `units` of the same file by the rule of section 2
  with the dashboard's contract selection; every id in a point's `reports` and in `undatedReports`
  exists in the file's `reports`; every `changes` address with kind `added` or `upgraded` at the
  last point exists in `contracts`. The recomputation lives in a small pure function in the test, mirroring
  `summarizeUnits`; it is the guard that the generator and the frontend count the same way.

## 6. Frontend

### 6.1 View model

`packages/frontend/src/server/features/audits/types.ts`:

```ts
interface AuditsCoverageHistoryPoint {
  timestamp: number
  /** covered / total, 0 when total is 0. */
  percent: number
  lines: { total: number; covered: number }
  units: { identical: number; differs: number; unaudited: number }
  contracts: number
  withoutSource: number
  reports: AuditsUnitReportRef[]
  changes: { address: string; name: string; kind: 'added' | 'removed' | 'upgraded' }[]
}

interface AuditsCoverageHistory {
  launch: number
  points: AuditsCoverageHistoryPoint[]
  undatedReports: AuditsUnitReportRef[]
}
```

`AuditsProjectTimeline` gains `coverageHistory?: AuditsCoverageHistory`. A new
`getAuditsCoverageHistory(coverage, projectId, stackCollection)` in
`packages/frontend/src/server/features/audits/getAuditsCoverageHistory.ts` builds it: report refs
through the same `toReportRef` logic as `projectCoverage.ts` (extract that helper so both use it),
`units.unaudited` is the raw `none` (the raw statuses carry no library split; the chart does not
show statuses, the tooltip shows lines). `getAuditsProjectDetails` passes it into
`getAuditsProjectTimeline`'s sources, which copies it onto the timeline.

### 6.2 Section layout and shared range

`AuditsTimelineSection` renders the timeline chart and, when `timeline.coverageHistory` exists,
the new `AuditsCoverageChart` directly below it. Both charts must share the x scale, so the range
state moves from `AuditsTimelineChart` into the section: the section owns `range` and `setRange`,
the timeline chart keeps rendering the range controls and receives both as props, the coverage
chart receives `range`. Both compute `toX` with the same `PAD_X` and their own measured width; the
containers have the same width, so the scales coincide. The section's intro paragraph gets one
sentence on the chart.

### 6.3 Chart (`AuditsCoverageChart.tsx`)

Plain SVG like the timeline chart, in `packages/frontend/src/pages/audits/project/components/`.

- Height about 160px, y from 0% at the bottom to 100% at the top, gridlines and labels at 0, 50
  and 100, the same vertical time ticks as the timeline (`getTimeTicks`, `getLabeledTicks`).
- A step line (`stepAfter`) through the points in `[from, to]`, starting from the value in force
  at `from` (the last point at or before `from`, or nothing before the launch) and extended to
  `to`. A light area fill below the line, in the positive color used for audit markers.
- A dot on each retained point inside the range. Hovering the chart highlights the point whose
  interval contains the cursor and shows a tooltip: the date, the percentage, covered and total
  lines, then the point's reports (title and auditor, linked) or its changes (names and kinds). The
  present point's tooltip lists the undated reports when there are any.
- Legend: "Lines identical to audited code". When the series starts after `from` the chart shows
  nothing before the launch, matching the timeline's launch marker.
- Mobile: the same layout, labels thinned by `getLabeledTicks`.

No new chart stats in this iteration; the tooltip carries the detail.

### 6.4 Texts

Section intro addition: "The chart below shows the share of the perimeter's lines that matched
audited code at each moment, counting only the audits published by then and the code deployed
then." The tooltip of the present point adds "Includes n undated reports" when applicable.

## 7. Decisions and limitations

1. **Retired contracts.** Contracts that left `discovered.json` are not reconstructed. Members
   that are still in discovery with an `untilTimestamp` (11 each on BOB and Ronin) are handled by
   their windows; contracts known only from diff-history deletions, which ossification adds to its
   perimeter, are not members here. Their history would need git history of `discovered.json` at
   generation time. Not done.
2. **Unverified historic implementations** contribute no lines, as unverified current contracts do
   today, and are counted in `withoutSource`. The tooltip shows that count when it is nonzero.
3. **Undated reports** count only at the present (section 4.5).
4. **Code points come from past upgrades**, not from the ossification history. Differences to the
   timeline's markers are logged, not reconciled, in this iteration.
5. **Dates are day-granular** for audits and second-granular for upgrades. An audit dated the day of
   an upgrade counts from that midnight, so it precedes the upgrade.
6. **Retroactive criticality.** Today's `critical` flags are applied to the past, as ossification
   does. A contract critical today is assumed critical since its window start.
7. **Library audits** change the value at their own date, not at the next project audit, because
   every report date is a cutoff. Points that change nothing are dropped.
8. **No regeneration automation.** The history is regenerated with the coverage, by hand, as the
   coverage is today. Old points never change for a fixed dataset, so an incremental mode is a
   later optimization, not a prerequisite.

## 8. Testing

l2b (mocha, earl; the directory has no tests yet, so these set the pattern):

- `perimeterTimeline.test.ts`: selection with and without critical flags; windows; past upgrade
  parsing with implementations; the current-implementation consistency fallback; collapse before
  the launch; `perimeterAt` at boundaries (`since` inclusive, `until` exclusive, upgrade timestamp
  inclusive); shared implementations deduplicated.
- `historyPoints.test.ts`: cutoffs above the launch only; 24h clustering with evaluation at the
  cluster's last event; merge of a cutoff and a cluster on the same second.
- `AuditedCode.test.ts` (`auditedCodeAt`): occurrences lose reports and are dropped when empty;
  declarations without remaining objects disappear from `byName`; collections recomputed; undated
  reports absent at every cutoff.
- `coverageHistory.test.ts`: a tiny index with two reports on two dates and a project with one
  proxy and one upgrade, `getDeployedSource` stubbed; asserts the retained points, their numbers,
  `reports`, `changes`, the skip rule (a cutoff adding an unrelated name reuses the result, which
  is observable through a counting stub around `coverFlat`), and deduplication.

shared: `parseReportDate.test.ts` moves with the function.

config: the consistency assertions of section 5 on the committed files.

frontend: `getAuditsCoverageHistory.test.ts` (percent, refs, undated list) and
`AuditsTimelineSection`'s range lifting covered by the existing timeline tests where they touch
the range.

Manual: `l2b audit-coverage scroll --history` and `unichain --history`, then the page in the
browser, light and dark, desktop and phone width, with the 1Y and MAX ranges.

## 9. Evaluation

To answer the two goals after Scroll, Unichain and OP Mainnet are generated:

- Runtime per project and the share of flats reused by the skip rule; number of explorer fetches
  and of unverified historic implementations.
- Alignment: the logged differences between code points and ossification's critical changes, with
  a cause for each (ignored transaction, diff-history-only change, reviewed event).
- Insight: for each upgrade, the drop in coverage and the time until the next audit restored it; on
  Unichain, whether OP Labs' reports dated before each upgrade keep the value flat, which would
  confirm the hypothesis that the chart shows unaudited exposure windows. For Scroll, whether the
  curve climbs with its own reports as expected.
- Decide from these whether to reconcile code points with ossification (limitation 4), whether to
  reconstruct retired contracts (limitation 1), and whether the generation step is cheap enough to
  run for every covered project.

## 10. Implementation order

1. `parseReportDate` to `@l2beat/shared`; frontend import switched. Tests move.
2. `perimeterTimeline.ts` with tests.
3. `auditedCodeAt` with tests.
4. `historyPoints.ts` with tests.
5. `coverageHistory.ts`, the skip rule, the output type and the `reportsOf` extension, with tests.
6. `--history` flag, logging, README and FRONTEND sections.
7. Config schema and test.
8. Generate Scroll; fix what the config test and the logs reveal.
9. Frontend view model with test; section range lifting; chart component; texts.
10. Generate Unichain and OP Mainnet; run the evaluation of section 9 and write the findings
    below this spec's status line.

## 11. Findings (2026-10-22, Scroll and Unichain)

Runtime. Both runs finished within minutes, not timed precisely. Scroll: 285 points, 32 retained,
1549 flats covered, 8618 reused by the skip rule, 105 sources read. Unichain: 182 points, 43
retained, 393 covered, 2554 reused, 70 sources read. The skip rule carries the pass; OP Mainnet
was not generated yet.

Data. Scroll had 7 historic code addresses without verified source, all of them contracts that are
unverified today (L2 gateways, AgoraGovernor, three verifiers). Unichain's OP Stack proxies record
a shared intermediate implementation (`eth:0x2476…`) as the result of their last upgrade: the OP
Contracts Manager sets it inside the upgrade transaction before the real one, and `$pastUpgrades`
kept only the first. The current-implementations fallback covers the last upgrade; whether earlier
upgrades carry the same artifact, and therefore matched the intermediate contract's code for a
while, must be checked before the chart is trusted on OP Stack chains.

Alignment. No critical change of ossification lacked a code point. Scroll has 10 and Unichain 5
code points without a critical change, all of one kind: contracts joining the perimeter
(verifiers, timelocks, governance, dispute games) and the launch-day rollout. Ossification counts
those as deployments, not changes. The chart needs them for the denominator, so the two will not
align by construction; the tooltip's "joined the perimeter" wording explains the difference.

Insight. Scroll moves from 74% to 79% over three years, almost flat: its upgrades ship with
audits dated weeks earlier, and the uncovered share is code that differs from the audited revision
regardless of timing. Unichain shows the hypothesized shape once, climbing from 76% to 83% as U13
to U16 replaced early code with code matching new OP Labs reports, but its drops come from new
contracts joining the perimeter (ETHLockbox and AnchorStateRegistry, SaferSafes, the super dispute
games), not from upgrades outrunning audits. On these two projects the chart mostly describes how
the perimeter's composition changed, and only secondarily audit lag. OP Mainnet, with 16 upgrade
clusters over a longer life, is the next test of whether exposure windows show up anywhere.

Addendum, same day, all projects. A transaction that upgrades a proxy twice (the OP Contracts
Manager sets an intermediate implementation, then the final one) was deduplicated to its first
record; `parsePastUpgrades` now keeps the last record per transaction, and Unichain's wrong
segment is gone. Twelve of thirteen projects were generated in 10s to 187s each (OP Mainnet the
slowest); Ethscriptions failed twice in the main pass because its RPC answered HTTP 522, and keeps
its coverage without a history. OP Mainnet is the one project with the hypothesized shape: 35% at
the 2021 launch, lifted to 62% by the Bedrock audits before the Bedrock upgrade, then small dips of
2 to 4 points at upgrades, each closed within weeks. Elsewhere the curves are dominated by
contracts joining the perimeter (Privacy Pools dilutes from 66% to 54% as pools are added, Tornado
halves in 2021 with its second generation of pools) and by foreign reports: the Code4rena zkSync
system-contracts review lifts OP Mainnet, Tornado, Umbra and Uniswap at once through vendored
library code, and a Mantle report "recovers" OP Mainnet's 2024-02 upgrade dip. Aztec's dashboard
perimeter is one contract because only `ZkMoneyPortal` carries a critical flag. Two ossification
code changes on BOB and one on OP Mainnet have no code point: they come from diff history, not
from `$pastUpgrades`.

Chart revision. The share proved uninformative, so the chart now draws the absolute number of
lines no audit covered (`lines.total - lines.covered`), on a y axis that follows the visible
values with padding, in the negative color: every uncovered line is a possible exploit whatever
the perimeter's size. The generated data is unchanged; the percentage stays in the tooltip.
The chart has its own range controls, defaulting to MAX, and its tooltip sits below the plot.

Launch rollout. Contracts deployed within a day of the launch, and the code they were given
within that day (OP Stack proxies are deployed and initialized minutes apart), now count from the
launch: the launch point is the state at the end of the rollout, as ossification's genesis is the
rollout's last deployment. Before, Scroll started with 11 of its 28 launch contracts and BOB with
proxies that had no implementation yet, each followed by a same-day jump.
