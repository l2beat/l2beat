# Audit scope explicitness: what audit reports name, what they only imply, and strict and relaxed coverage

Date: 2026-11-17. Status: implemented for the six projects of the audits dashboard (`aztecnetwork`,
`optimism`, `safe`, `tornado-cash`, `uniswapv2`, `uniswapv3`), results in section 7, known gaps in
section 8. Extends the audits prototype described in `2026-09-14-audit-data-flow-design.md`
(background), `2026-10-07-audit-timeline-project-audits-design.md` (which audits count as the
project's) and `2026-10-22-audit-coverage-history-design.md` (coverage over time).

## 1. Goal and scope

An audit report names files. The contracts in those files inherit from, link and call other code:
base contracts, libraries, other contracts of the project, OpenZeppelin. Reports rarely say whether
that code was reviewed. The dashboard used to hide this: for some reports the audit dataset followed
imports and counted the reached files as audited, for others it did not, and the two cases looked
the same.

This feature makes the difference visible, in two ways:

- **Per report:** a dependency graph of the code the report names, showing which units the report
  mentions and which it is silent about, and one number for it, the report's scope explicitness. The
  message is "we have evidence for these units; for the rest we are guessing". It describes the
  report, not the auditor, and makes no judgment on the audit's quality.
- **Per project:** two coverage values instead of one. **Strict** counts only code a report
  explicitly includes. **Relaxed** also counts code a report is silent about but that the named code
  depends on. They are two readings, not the ends of a range: the true coverage is not assumed to
  lie between them.

Scope: a new command `l2b audit-scope`, a new file `audit-scope.json` per project with its config
schema, the frontend view models, and three places on the audits pages (section 6): the summary of
the project page, its "Audit reports and their scope" and "Diff from audits" sections, and the
dashboard table.

Out of scope:

- The audit dataset. What its summaries cannot express yet is kept in `scopeOverrides.ts` next to
  the command (section 9).
- `audit-coverage.json`, which is not changed. The coverage history, its chart and the dashboard
  sparkline keep the base reading it was generated with (section 8).
- The audit information in the contracts section of the regular project pages, which also keeps the
  base reading.

## 2. Definitions

### 2.1 Units and edges

A **unit** is a contract, abstract contract, library or free function, as in the rest of audit
coverage. Interfaces declare no logic: they are not nodes, the closure does not pass through them,
and they are left out of every number (they are still shown and diffed in "Diff from audits").

Unit A **depends on** unit B when A's code references B by name: inheritance, `using B for`,
`B.f()`, `B(address).f()`, `new B`, or a use of B's types, constants or errors. A reference that
passes through a file-level struct, enum, constant, error, user-defined type or `using` directive is
followed to the units behind it. Imports that are never referenced create no edge.

An edge has a kind: `inherits` when B is a base contract of A, `uses` for everything else.

This is deliberately coarse, and stated here so nobody reads more into it:

- The whole unit is implied, not only the functions called. Function-level reachability needs type
  and overload resolution (`x.add(y)` under `using Lib for T`).
- A mention that is never called, such as a state variable of type `SystemConfig`, still creates the
  edge.
- Names are matched as written; a local variable that shadows a unit's name creates a false edge.

### 2.2 Evidence states

Every unit in a report's graph has one state:

| State | Meaning | Named in the report |
| --- | --- | --- |
| `included` | In a file or directory the report lists as audited, at the audited commit. | yes |
| `excluded` | The report says it was not reviewed: listed as out of scope, covered by a blanket statement ("anything not listed is out of scope"), or covered by a general statement about dependencies ("assumed to work as intended"). | yes |
| `not-mentioned` | Reached from an included unit; the report says nothing about it. | no |
| `unavailable` | Reached from an included unit, but its source could not be read at the audited commit. Counts as not named and as not covered. | no |

Rules:

- All units of a named file are `included`. A directory at a pinned commit names every source file
  below it, except tests, mocks and scripts (the dataset's rule).
- `excluded` needs words in the report. An extractor's doubt, or a narrow engagement with no
  limiting sentence, is `not-mentioned`.
- A general statement about third-party code applies to every external unit of the graph, in either
  direction ("dependencies were also reviewed" makes them `included`). Such nodes carry `generic`.
- A scope list that lives outside the report (a contest README) counts as named only when that
  document is public and pinned to a commit.
- A file reviewed only as a diff or for selected functions is `included` with `partial`. It is not a
  root: nothing is implied from it.
- The closure starts at fully audited `included` units and stops at `excluded` and `unavailable`
  units.

### 2.3 Own code and external dependencies

A unit is **external** when its file is in a git submodule, a Foundry `lib` directory,
`node_modules`, a vendor-like directory (`vendor`, `vendored`, `thirdparty`, `third_party`,
`dependencies`, `.deps`), another package of the same monorepo reached by package name, or outside
the repository. Everything else is the project's **own** code.

External units are treated like own units: reached by the same rule, at the version the audited
commit pins (the submodule commit; a lockfile version for npm), and the closure continues inside
them. They are drawn differently and reported separately.

### 2.4 Reports that get a graph

A report gets one graph per audited commit when it has at least one fully audited Solidity path
pinned to a full commit and its scope statements were reviewed. Reports without a graph say why:
`partial` (only fix or diff reviews), `unpinned` (branch or tag only), `unreviewed` (nobody checked
the report for exclusions), `no-solidity`.

## 3. Metrics

**Scope explicitness** of a report at a commit: the units of its graph that are named (`included` or
`excluded`) as a share of all units of the graph, given separately for own and external code.
Counted in units, not lines, because "mentioned" is yes or no per unit. The pages call the own-code
share "x% explicit".

**Strict and relaxed coverage** of a project use the existing covered-lines formula and matching.
They differ only in which audited code counts as evidence for a deployed unit:

- **Strict:** code a report explicitly includes. Reports of library collections (OpenZeppelin's
  audits of OpenZeppelin) count, because they name the code.
- **Relaxed:** strict, plus `not-mentioned` units of the project's own reports. A unit covered only
  this way is labelled "implied by <auditor>".

In both readings vendor code that differs from its audited version counts as differing. The base
coverage leaves such units out of the counts; here the relaxed reading is the only place where doubt
is resolved in the project's favour.

## 4. Data

`audit-scope.json` in the project directory (`ProjectAuditScope` in `@l2beat/config`,
`project.auditScope`):

```ts
type AuditScope = {
  schema_version: '0.1.0'
  project: string
  dataset: { repository: string; commit: string }
  reports: Record<ReportId, ReportScope>          // every relevant report of the project's collection
  reportInfo: Record<ReportId, CoverageReport>    // as in audit-coverage.json, for reports named below
  collections: Record<CollectionId, { name: string; kind: 'project' | 'library' }>
  auditedFiles: Record<ObjectId, { repository: string; commit: string; path: string; blob: string; upstream?: true }>
  units: Record<UnitId, { strict: Unit; relaxed?: Unit & { impliedBy: ReportId[] } }> // relaxed only when it differs
}

type ReportScope = {
  status: 'graph' | 'partial' | 'unpinned' | 'unreviewed' | 'no-solidity'
  /** What the report says about code it does not list. */
  unlisted?: 'not-mentioned' | 'excluded'
  snapshots: Snapshot[]
}

type Snapshot = {
  repository: string
  commit: string
  nodes: Node[]
  edges: [from: number, to: number, kind: 'inherits' | 'uses'][] // from depends on to
  interfaces: number                               // reached but not drawn
  explicitness: { own: Share; external: Share }    // Share = { named: number; total: number }
}

type Node = {
  name: string
  kind: 'contract' | 'abstract' | 'library' | 'function'
  path: string                                     // in the audited repository, submodules at their mount path
  state: 'included' | 'excluded' | 'not-mentioned' | 'unavailable'
  partial?: true
  generic?: true
  external?: { package: string; version?: string }
}
```

`Unit` is the unit of `audit-coverage.json`. `auditedFiles` entries with `upstream` hold code that
is not in the audit dataset: the blob is read from `repository` on GitHub, unformatted, and
`audited.lines` point into that file.

A reading is applied to `project.auditCoverage` by replacing its units with the scope's
(`coverageUnderReading` in the frontend's `scopeReading.ts`), so everything built on the coverage
model works under either reading.

## 5. Pipeline

`l2b audit-scope <project> --dataset <path to an audit-dataset checkout>`, implemented in
`packages/l2b/src/implementations/audit-coverage/scope`:

1. Reads `<project>/audit-summary.json` for what each report lists, and `scopeOverrides.ts` for what
   the summary cannot express yet.
2. For each audited commit, reads the repository from a blobless clone cached in
   `~/.cache/l2b-audit-scope`, with submodules at their pinned commits. Imports are resolved
   relative to the file, then with the remappings of the nearest Foundry project (`foundry.toml`,
   `remappings.txt`, `lib/*`), then against the project and repository roots, then as a package of
   the same monorepo.
3. Builds the graph and the explicitness numbers.
4. Covers the deployed code twice. Strict uses the dataset export without the files its import
   expansion added to the project's own reports. Relaxed adds the `not-mentioned` units, read from
   the clones.

An import that cannot be read (an npm package) still says what it names: the imported symbol, or the
unit the file is named after. Such a name becomes an `unavailable` node, or is counted as an
interface when it starts with `I` followed by a capital or sits under `/interfaces/`.

## 6. What the pages show

- **Project page, summary:** each of the three shares (fully audited contracts, ever audited, lines
  identical to audited) is given as two values, strict and relaxed, each with a tooltip saying what
  that reading counts for that share.
- **Dashboard table:** the strict reading, so its columns equal the strict values of the project
  pages.
- **Project page, "Audit reports and their scope":** one row per own report with its own-code
  explicitness as a ten-cell meter. A row with a graph opens it; a report without one says why. A
  report title loses a trailing parenthesis that only repeats the auditor (`reportDisplayTitle`).
- **The graph:** three lanes, "Named in the report", "Own code, not mentioned" and "External
  dependencies", the last grouped by package and version. Named code is teal (filled when audited,
  outlined when out of scope, striped when reviewed in part), own code the report is silent about is
  orange, external code it is silent about is violet. A solid arrow with a hollow head is
  `inherits`, a dashed arrow `uses`. Selecting a unit lights the units that lead to it from the
  audited code and opens a card with its state and file.
- **Project page, "Diff from audits":** a strict / relaxed toggle, strict by default. Under strict,
  code no report names looks unaudited. Under relaxed it counts and is labelled "implied by
  <auditor>".

## 7. Results

Generated from the audit dataset at `29fc7fd7`. Lines are over the distinct deployed units of every
discovered contract, interfaces excluded; the pages show the critical contracts only, so their
percentages differ.

| Project | Reports with a graph | Strict | Relaxed | What the graphs show |
| --- | --- | --- | --- | --- |
| `uniswapv2` | 1 of 1 | 42.8% | 42.8% | The control: a directory scope, 6 of 6 units named, nothing external. |
| `uniswapv3` | 3 of 3 | 40.4% | 40.4% | Trail of Bits names 19 of 20 own units; ABDK's periphery report names all 13, 11 of them as excluded, and its 5 npm dependencies are `unavailable`. |
| `optimism` | 33 of 54 | 74.9% | 90.7% | Reports name between 17% and 100% of the own units in their graph and none of the external ones, except one report that excludes unlisted code in words. |
| `safe` | 13 of 14 | 99.9% | 100.0% | Reports scope whole directories, so most name every own unit of their graph; the code has no external dependencies. |
| `tornado-cash` | 4 of 7 | 52.0% | 52.0% | All four are silent about unlisted code; the only dependencies are npm packages, which are `unavailable`. |
| `aztecnetwork` | 15 of 27 | 69.6% | 73.5% | ConsenSys Diligence and Veridise limit their scope in words, and Veridise is the one report with a general statement about external libraries. The Cantina reviews name about a fifth of the own units their code reaches. |

The other 21 Optimism reports have no graph: 17 are fix or diff reviews, 4 scope no Solidity.

For `aztecnetwork`, `safe` and `tornado-cash` the dataset's summaries carry no reviewed `imports`
field, so every entry of `scopeOverrides.ts` for them comes from reading the report for this
prototype.

## 8. Known gaps

- The coverage history in `audit-coverage.json` keeps the base reading, so the chart on the project
  page and the sparkline of the dashboard table can end at a value that differs from the strict
  numbers next to them. Closing this means generating the history with the strict evidence.
- The contracts section of the regular project pages shows audit information under the base reading.
- npm dependencies are `unavailable`: the lockfile pins them, the tarballs are not fetched.
- Import expansion in other collections' exports is not stripped, so a stack or library report with
  expanded imports still counts them in the strict reading.
- An exclusion inside a directory scope reaches the graph but not the strict reading: Akhunov's Safe
  report scopes `contracts` and says only one module was audited. The override marks the other
  modules as excluded; the strict reading still counts them, because the export scopes the
  directory.
- Findings are not attributed to implied units.
- The unit diff against implied code, which is read from the audited repository itself, was checked
  by fetching the file directly but not in the page: the mock frontend has no database for the
  deployed sources.

## 9. What the audit dataset needs to take over

`scopeOverrides.ts` stands in for what the extraction skill and `audit-summary.json` should record,
each with the report line it rests on:

1. Whether unlisted code is excluded by words in the report, or only not mentioned. Today `imports:
   "not_audited"` covers both, plus diff-scoped reports.
2. General statements about third-party dependencies, which the skill currently tells the extractor
   to skip.
3. Exclusions inside a directory scope.
4. Where the scope list comes from when it is not in the report.

The export should then label each scoped path as named or implied, and carry dependency sources at
their pinned versions. Report titles should not embed the auditor, which has a field of its own.
