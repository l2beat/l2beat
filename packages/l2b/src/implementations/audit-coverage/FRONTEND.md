# Showing audit coverage

How the frontend gets everything it needs to show which deployed code was audited. The computed data is in config; source code is not, and is read at view time from places that already hold it.

| Data | Where | How |
| --- | --- | --- |
| Statuses, matches, diff spans, reports, findings, contracts | config | `project.auditCoverage` |
| Deployed source of a contract | database | flat sources, looked up by address (needs a schema change, see below) |
| Audited source of a unit | GitHub | blob API on the audit dataset repository |
| Audit report document | GitHub | link into the audit dataset repository |

## 1. `project.auditCoverage`

Read it like any other project field, e.g. `ps.getProjects({ select: ['auditCoverage'] })`. Only projects with a committed `packages/config/src/projects/<project>/audit-coverage.json` have it. The type is `ProjectAuditCoverage` in `@l2beat/config`; the fields are described in [README.md](README.md#output).

The file is regenerated with `l2b audit-coverage <project>` and a config test fails when it no longer covers the contracts in `discovered.json`.

## 2. Deployed source

`contracts` lists every contract discovery found, keyed by address. Each has a `source` and, for a proxy, `implementations` keyed by address in the order discovery lists them. A source is `'unverified'`, `'non-solidity'`, or the sha256 of the address's flat source:

- `flats[sha256]` lists the flat source's units in order as `[unitId, firstLine]`. The unit occupies lines `firstLine` to `firstLine + units[unitId].lines - 1` (1-based).
- The flat source is the address's verified source flattened as discovery flattens it (`flattenStartingFrom` with `includeAll: true`), without the license and pragma header discovery puts on top of its `.flat` files. Hash what you read and compare: a different hash means the contract changed after coverage was generated, so show it as stale rather than drawing a diff against the wrong code.

The frontend server's database (`getDb()`) already holds every project's flat sources, but the `flatSources` table stores one record per project mapping discovery's file names (`Name.sol`, `Proxy/Implementation.p.sol`, ...) to the file contents, header included. It cannot be queried by address. Serving the flat source of an address is a schema change of that table, left to the frontend work.

## 3. Audited source

`units[unitId].audited.object` names the audited file; `auditedFiles[object].blob` is its full git blob id in the audit dataset repository (`dataset.repository`):

```
GET https://api.github.com/repos/<dataset.repository>/git/blobs/<blob>
Accept: application/vnd.github.raw+json
```

This returns the file as plain text. The audited unit is lines `audited.lines[0]` to `audited.lines[1]` of it (1-based). These are the dataset's stored copy, formatted with `forge fmt`, so they do not line up with the upstream file at `auditedFiles[object].repository`/`commit`/`path`.

Blobs never change, so cache them forever. Unauthenticated, GitHub allows 60 requests per hour per IP; fetch from the server with a token and cache, rather than from the browser.

## 4. Links

- Report document: `https://github.com/<dataset.repository>/blob/<dataset.commit>/<reports[id].document>` (GitHub renders PDFs there; raw URLs download them).
- Upstream audited file, without line numbers: for an `owner/repo` repository, `https://github.com/<repository>/blob/<commit>/<path>`. Repository ids follow the audit dataset's rule: `owner/repo` is on GitHub, `gist/<owner>/<id>` is `https://gist.github.com/<owner>/<id>`.

## 5. Drawing a diff

For a unit with `status: 'differs'`, walk its deployed lines in order. Relative line `i` (0 is the unit's first line) is added when it falls inside one of `added`. Before deployed line `i`, insert every `removed` group `[i, first, last]`: audited lines `first` to `last`, relative to `audited.lines[0]`. Units with `status: 'identical'` match the audited code once formatting, comments and revert messages are ignored.

## 6. Numbers

The definitions used by the audit coverage prototype:

- **Contracts**: the entries of `contracts`. Where a project has critical contracts, show those: `critical` is `true` or has no `untilTimestamp`, the same as the ossification perimeter. Otherwise show all.
- **Units of a contract**: the units of its `source` and of each of its `implementations`; unique units are counted by unit id.
- **Interfaces**: units of kind `interface` are listed and diffed like every other unit, but they are left out of every number below (unit counts, covered lines, fully covered contracts). They declare no logic, and reports rarely scope them, so counting them only adds noise to both the differing and the unaudited side.
- **Status shown**: `none` is unaudited, `differs` is differs. `identical` is shown as library when the unit's `reports` come from a collection of kind `library` and none from the project's own collection (the collection whose id is the project id), otherwise as identical.
- **Covered lines**: `lines` for identical units, `covered` for differing ones (their lines minus added lines that hold code, not only comments), 0 for unaudited ones. Interfaces contribute nothing to either side.
- **Reports**: own reports are those whose `collections` include the project id; an own report is matched when some shown unit lists it in `reports`. Shared reports are the other reports listed by shown units. The latest audit and the audits of the past year come from the own reports' `date`.
- **Findings**: `units[unitId].findings` maps a report to the ids of its major findings still open in the audited code; link them to the report document.
