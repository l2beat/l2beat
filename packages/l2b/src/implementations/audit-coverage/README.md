# Audit coverage

`l2b audit-coverage <project>` tells, for every top-level declaration deployed by a project, whether audited code exists for it, how far the deployed code is from it, and which reports audited it.

```
l2b audit-coverage tornado-cash
l2b audit-coverage tornado-cash --github https://github.com/<owner>/audit-dataset
l2b audit-coverage tornado-cash \
  --index audit-index.json --objects audit-objects.json.zst \
  --dataset-commit <commit> -o audit-coverage.json
```

By default both files are read from `main` of `github.com/sergeyshemyakov/audit-dataset`, or of the repository passed with `--github`, at the commit `main` points to. Local files need all of `--index`, `--objects` and `--dataset-commit`, and are attributed to the same repository. The repository and commit are recorded as `dataset`, so report documents can be linked as `https://github.com/<repository>/blob/<commit>/<document>`. The output goes to `audit-coverage.json` in the project directory unless `-o` is given.

How the frontend reads the output, the deployed code and the audited code is described in [FRONTEND.md](FRONTEND.md).

Run it anywhere in the repository after discovery. Deployed sources come from discovery's provider, so they are read from the discovery cache and only fetched from the explorer when missing.

## Inputs

Both files come from the audit dataset, pinned to one dataset commit.

- `audit-index.json`: where audited code lives and who audited it.
  - `collections[id]`: display `name` and `kind`, `project` (the id is the L2BEAT project id) or `library`.
  - `reports[id]`: `collections`, `title`, `auditor`, `date`, and `document`, the dataset path of the original report. Every relevant report is listed, also those that audited no Solidity.
  - `repositories[repository][commit]`: one audited snapshot. `timestamp` is the commit time in unix seconds, `files` maps a path to an object id, `audits[report][path]` lists the paths a report scoped (a file or a directory). A file is audited by every report whose scoped path is the file or a directory above it.
- `audit-objects.json.zst`: zstd-compressed JSON from object id to file contents. The dataset stores audited files formatted with `forge fmt`; an object id is the first 12 hex characters of the git blob id of those stored contents, so contents are checked against their id when loaded. Files that do not parse as Solidity (zkSync's templated `Constants.sol`) are skipped.

## Coverage units

Contracts, abstract contracts, libraries, interfaces and free functions, split from deployed flat sources and from audited files the same way. Errors, events, structs, enums, types and constants are not units.

Not covered yet: file-level structs, enums, user-defined value types, constants, errors, events and `using ... for` directives. They rarely carry logic, but sometimes do: a file-level constant sets a limit, and `using { add as + } for Timestamp global` binds operators (the Aztec Rollup has 65 structs, 20 types, 20 constants and 6 such directives). Overloaded free functions are matched by their first overload only.

## Matching

Audited units are deduplicated by body and the import aliases it uses. Since audited code is formatted and deployed code is not, the diff also ignores what `forge fmt` rewrites: `byte` for `bytes1` and underscores in hex literals. Import aliases are compared as the deployed source writes them. Flattening turns `import { GnosisSafe as Safe }` into `GnosisSafe`, so an audited unit's aliases are first resolved to the names they import, then those names are renamed to the aliases of the verified file declaring the deployed unit. For a deployed unit:

1. Same name first. Every audited unit with the deployed name is diffed with the Solidity diff, which ignores formatting, comments, revert reasons and similar noise. `abstract` and plain contracts are paired as if they had the same kind. A candidate needs at least 0.5 similarity over all lines.
2. Only if nothing matched by name and the unit has at least 10 lines: the 5 audited units with another name that share the most normalized lines, weighted by rarity, are diffed after renaming them to the deployed name. They must be audited in the project's own collection or a library collection: across projects, similar code under another name is usually a different program with the same structure, like two zk verifiers. A candidate needs at least 0.65 similarity over code lines; comments make unrelated interfaces look alike.
3. The candidate with the fewest changed code lines wins, then the one audited at the newest commit.

The audited file shown is the newest commit containing the winning body. Every report that audited any file containing that body counts as evidence.

The dataset locates major findings in files, not units, so a unit gets a report's findings that are open in every file containing its body that the report scoped by file path. A finding the report saw fixed in another copy of the same body was fixed elsewhere in the file. Findings scoped to a directory are not attributed, since they cannot be placed in a file, and a finding located in a file is attributed to every unit of that file.

## History

`l2b audit-coverage <project> --history` also covers the perimeter at every point of its history and writes the series as `history`. It needs `packages/config` built: the series starts at the launch the audits timeline shows (the ossification history's `observedSince`, else the chain's start), or at the earliest member when the config knows neither.

The perimeter over time is rebuilt from `discovered.json` alone: the contracts with a `critical` flag (every contract when none has one), each one bounded by its critical window, running its own code plus the implementations `$pastUpgrades` recorded at each moment. When the recorded upgrades do not end at the current implementations, those are assumed current since the last recorded upgrade, with a warning. Contracts that left discovery are not reconstructed. Historic implementations are read like current ones, through discovery's provider; an unverified one counts no lines while it ran, like an unverified contract today.

Points are the launch, every report date in the dataset (its `date`, else the year and month its id ends with; undated reports count only at the present), every change of the perimeter's code clustered by 24h like ossification's critical changes, and the present. At a point the code deployed at the cluster's last change is matched against the reports dated by then, with the audited code index restricted to those reports. A flat keeps its previous result until a newly counted report adds a declaration with one of its unit names, or, when it has an unmatched unit of at least 10 lines, a file of the project's own or a library collection. Points that change no number, report or member are dropped; the present is taken from the main output, so the last point is the dashboard's number.

```ts
type AuditCoverage = {
  // ...
  history?: {
    launch: number
    points: {
      timestamp: number
      contracts: number // members of the perimeter
      withoutSource: number // members whose every code address lacks verified Solidity
      units: { identical: number; differs: number; none: number } // interfaces excluded
      lines: { total: number; covered: number } // as the dashboard counts them
      reports?: ReportId[] // first counted here and referenced by a unit of this state
      changes?: { address: ChainSpecificAddress; name: string; kind: 'added' | 'removed' | 'upgraded' }[]
    }[]
    undatedReports: ReportId[] // referenced at the present, counted nowhere else
  }
}
```

The command ends with the points of the history that have no critical code change of ossification within a day, and vice versa: the two come from different sources (ossification also reads diffHistory.md and ossification.json) and are not reconciled.

## Output

```ts
type AuditCoverage = {
  schema_version: '1.0.0'
  project: string
  dataset: { repository: string; commit: string }
  discoveredAt: number // discovery timestamp of the deployed sources
  collections: Record<CollectionId, { name: string; kind: 'project' | 'library' }>
  reports: Record<ReportId, { collections: CollectionId[]; title: string; auditor: string; date?: string; document: string }> // used by a unit, plus every report of the project's own collection
  auditedFiles: Record<ObjectId, { repository: string; commit: string; path: string; blob: string }> // blob: full git blob id of the object in the dataset repository
  units: Record<UnitId, Unit> // UnitId: first 12 hex characters of sha256 of the deployed body
  flats: Record<FlatSha256, [UnitId, number][]> // units of a flat source and their first line
  contracts: Record<ChainSpecificAddress, Contract> // every contract discovery found
}

type Contract = {
  name: string
  critical?: true | { sinceTimestamp?: number; untilTimestamp?: number } // as in discovery
  source: Source
  implementations?: Record<ChainSpecificAddress, Source>
}

type Source = FlatSha256 | 'unverified' | 'non-solidity'

type Unit = {
  name: string
  kind: 'contract' | 'abstract' | 'library' | 'interface' | 'function'
  lines: number
  status: 'identical' | 'differs' | 'none'
  audited?: { object: ObjectId; lines: [number, number]; name?: string } // name when audited under another
  reports?: ReportId[]
  findings?: Record<ReportId, FindingId[]> // major findings open in the audited code
  added?: [number, number][] // deployed lines, relative to the unit's first line
  removed?: [number, number, number][] // [before deployed line, audited first, audited last], relative
  covered?: number // when status is differs: lines minus added lines that hold code, not only comments
}
```

No source text is stored. The deployed source is the flat source of the address, checked against its sha256; the audited source is the object's contents in the bundle of the dataset commit. Audited line numbers point into those formatted contents, not into the upstream file at `<repository>/<commit>/<path>`. A diff is drawn by walking the unit's deployed lines in order, marking those inside `added`, and placing each `removed` group of audited lines before its deployed line.
