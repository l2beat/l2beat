# Audit coverage data flow: audit-dataset and l2beat

Date: 2026-09-14. Status: draft for review.

This spec covers two repositories. Section 4 applies to `audit-dataset`
(`~/Documents/repos/audit-dataset`). Sections 5 to 8 apply to the l2beat monorepo, mainly
`packages/audit-diff` and the audits pages in `packages/frontend`.

## 1. Goal and principles

The audit dashboard shows, per L2BEAT project, how much of the deployed code was covered by
public audits and how the deployed code differs from the audited revision. The prototype covers
four projects. The design must scale to every project with discovery output and must handle code
that is shared across projects: stack contracts, forks, vendor libraries and zk components.

Principles:

1. **audit-dataset records evidence only.** Evidence is "report R says (repository, path,
   revision) was reviewed with outcome S", plus the fetched sources at those revisions. The dataset
   knows nothing about deployments.
2. **l2beat resolves evidence against deployed code.** Resolution is "deployed unit U corresponds
   to audited unit V from collection C, via relation X". All scoping, ranking and diffing lives
   here.
3. **Work per unique code, not per project.** Deployed code repeats heavily across projects. Every
   unit is resolved once and referenced from every project that deploys it.
4. **Make an extra effort to match, bounded by indexes.** The engine searches all evidence when
   looking for a unit by name or by content hash, because indexes make that cheap. Only the
   expensive similarity search without a name is limited to a bounded set of collections.

## 2. Current state and problems

audit-dataset holds one directory per project with `reports/`, `audit-summary.json`,
`audited-sources/<owner>/<repo>/<path>/<commit>/...` and a `manifest.json` with a sha256 per fetched
file. `_libs/<vendor>` uses the same layout. Deployed sources are copied in from l2beat discovery
by a manual step and are gitignored.

`@l2beat/audit-diff` builds an index of the project's own audited units plus every `_libs` vendor,
matches each deployed unit by name, then by a rename heuristic, selects a version, diffs, and writes
one JSON per project that embeds source and diff for every unit instance.

| Problem | Evidence | Change |
|---|---|---|
| Search scope hardcoded to own project plus `_libs` | Bob's OP stack contracts can only match bob's audits; stack audits have no home | Global name and hash indexes; ranking context derived per project |
| No repository identity or lineage | `bob-collective/optimism` next to bare `sp1`; forks of `ethereum-optimism/optimism` unmarked | Canonical `owner/repo` ids; root `repositories.json` with `fork_of` |
| Cross-project reuse by copying | `ethscriptions` and `facet` fetched the same four 0xFacet repositories | Never copy; resolution merges at query time |
| Per-instance matching and output | tornado: 154 unit instances, 24 unique, 4.4 MB file | Content-addressed unit store |
| Deployed code repeats across projects | 4,650 contracts with source hashes, 1,819 unique implementations, the top one repeated 226 times | Resolve per unique flat hash, then per unique unit hash |
| Deployed data copied into the dataset | gitignored, manual step, formatting drift visible in tornado diffs | audit-diff reads `.flat` and `discovered.json` directly |
| zk program files matched only inside own project by basename | sp1 collection never consulted for SP1 sources; Rust basenames collide | Whole-file units join the hash index; path-suffix candidates |
| Name collision between dataset and l2beat vocab | `_libs/gnosis` means Safe, l2beat vendor `gnosis` means Gnosis Chain | Rename the collection to `_libs/safe` |

The identical, differs and unaudited semantics remain, with comments and require messages ignored.
An exact comparable hash is authoritative. Non-identical candidates now compete using the
composite score in section 5.5; a merely best available version is not accepted unless it clears
the threshold. For example, the deployed tornado `ReentrancyGuard` is OZ 3.x while the collection
has no 3.x audit, so its former weak v5.0 match is now unaudited.

## 3. Decisions taken during design

- Dataset directories stay keyed by project. A logical unit in the dataset is an audit, and an audit
  covers a project. Repository lineage is metadata, not directory structure.
- No version markers. A deployed unit that is not identical to any audited version is compared with
  the highest-scoring compatible version, if it clears the threshold. Identity is decided by hash.
- Interfaces count like any other unit. Subtle interface differences are security relevant and are
  shown as `differs` with a diff.
- Renamed candidates come from own, upstream, stack and library collections.
- Stack projects are the central point for stack audits: OP stack audits belong to `optimism`,
  Nitro audits to `arbitrum`. Dependent chains reach them through lineage, template hints and the
  global indexes.
- The `optimism` collection is created by the maintainer separately; it is not part of this spec's
  dataset changes.
- Deployed data leaves the dataset flow. `fetch_deployed.py` and `FETCH_DEPLOYED_SKILL.md` are
  retired there; the zk part moves to l2beat.

## 4. audit-dataset changes

### 4.1 Structure after the change

```text
audit-dataset/
  repositories.json          NEW  registry of every referenced repository
  <project>/                      unchanged layout
    reports/
    audit-summary.json            repository ids canonicalized, schema 1.3.0
    audit-summary.md
    audited-sources/
      manifest.json               file entries gain `units`; sha256 defined post-format; schema 1.1.0
      <owner>/<repo>/<path>/<commit>/...
  _libs/<vendor>/                 same layout; an organizational grouping only
  _libs/safe/                     renamed from _libs/gnosis
```

Removed from the flow: `deployed.json`, `deployed-contracts/`, `fetch_deployed.py`,
`FETCH_DEPLOYED_SKILL.md`, the `_zk` convention and its `--program-path` option.

### 4.2 audit-summary.json

One rule tightens. Every `repositories[].id` and every `scopes[].repository` is the canonical id
derived from `repositories[].url` by one shared normalization function:

- GitHub: `owner/repo`, case preserved as GitHub reports it, `.git` suffix stripped.
- GitHub gists: `gist/<owner>/<id>`.
- Other hosts: `<host>/<path>` such as `gitlab.com/owner/repo`.

No lineage in this file. `schema_version` becomes `1.3.0`. Existing summaries are migrated by a
one-off run of the normalization; the libs currently use bare ids such as `sp1` and
`openzeppelin-contracts`.

### 4.3 repositories.json

Script-generated registry of every repository referenced by any summary:

```json
{
  "schema_version": "1.0.0",
  "repositories": {
    "bob-collective/optimism": {
      "url": "https://github.com/bob-collective/optimism",
      "fork_of": "ethereum-optimism/optimism"
    },
    "0xFacet/facet-optimism": {
      "url": "https://github.com/0xFacet/facet-optimism",
      "fork_of": "ethereum-optimism/optimism",
      "manual": true
    },
    "ethereum-optimism/optimism": {
      "url": "https://github.com/ethereum-optimism/optimism"
    }
  }
}
```

Rules:

- `fork_of` is read from GitHub (`gh api repos/<owner>/<repo>`, fields `fork` and
  `parent.full_name`). Entries marked `manual: true` are preserved across regeneration, for copies
  that are forks in substance but not on GitHub.
- Upstream repositories appear even when no collection references them, so a consumer can warn
  "collection X depends on upstream Y that has no audit collection".
- The registry contains no per-collection information; consumers derive "which collections
  reference repo R" from the summaries.

### 4.4 manifest.json

Each `sources[].files[]` entry gains `units`:

```json
{
  "file": "peppersec/tornado-mixer/contracts/ERC20Mixer.sol/0484408e.../ERC20Mixer.sol",
  "git_object": "5941f0e9...",
  "git_mode": "100644",
  "sha256": "d6a46b9b...",
  "units": ["ERC20Mixer"]
}
```

- For `.sol` files, `units` lists top-level declarations matched by
  `^(abstract contract|contract|interface|library)\s+([A-Za-z_$][A-Za-z0-9_$]*)` on the formatted
  file. Formatted Solidity puts declarations at column zero. Consumers re-parse for real matching;
  this is an index.
- For other files, `units` is `[<basename>]`.
- `sha256` is defined as the hash of the file **as stored**, after formatting. Today it is the
  fetched blob, and `format_sources.py` rewrites files in place afterwards, so the two drift.
  `git_object` remains the upstream provenance.
- `schema_version` becomes `1.1.0`.

### 4.5 Scripts

| Script | Change |
|---|---|
| `pdf_to_md.py` | Unchanged. |
| `generate_audit_summary.py` | Validates canonical ids and the 1.3.0 schema; refuses to render on violation. |
| `fetch_audited_sources.py` | Uses the shared normalization to resolve repository URLs. Otherwise unchanged. |
| `format_sources.py` | Formats `audited-sources` only. Exports its forge fmt settings as a `foundry.toml` at the dataset root so consumers can apply identical formatting. |
| `index_sources.py <project> \| --all` | New. Fills `units`, recomputes post-format `sha256`, verifies every referenced file exists. Idempotent. |
| `update_repositories.py` | New. Builds `repositories.json` as in 4.3. |
| `normalize.py` | New shared module with the id normalization used by the scripts above. `normalize.py --migrate <project> \| --all` rewrites ids in existing summaries and manifests in place, the one-off migration mentioned in 4.2. |
| `pipeline.py <project>` | New thin wrapper: fetch, format, index, registry, in that order. |
| `fetch_deployed.py` | Removed. |

### 4.6 Skills and documentation

- `AUDIT_EXTRACT_SKILL.md`: add the canonical id rule with examples; replace the after-writing
  steps with `pipeline.py`; add for forks: scope only what the report scopes, never expand to
  upstream files, because resolution handles inheritance.
- `FETCH_DEPLOYED_SKILL.md`: removed. Its zk instructions move to l2beat (7.3).
- `README.md`: new structure, the registry, the `units` index, the post-format `sha256`
  definition, `_libs` as a grouping, the `safe` rename.
- `_libs/README.md`: rename `gnosis` to `safe` throughout.

### 4.7 Pipeline order

```text
pdf_to_md.py  ->  AUDIT_EXTRACT_SKILL (agent)  ->  generate_audit_summary.py
             ->  pipeline.py: fetch_audited_sources, format_sources, index_sources, update_repositories
```

## 5. l2beat: resolution engine

### 5.1 Inputs

Deployed side, read directly from the monorepo:

- `packages/config/src/projects/<p>/discovered.json`: entries of type `Contract` with `name`,
  `address`, `template`, `sourceHashes`, `proxyType`, `critical`.
- `packages/config/src/projects/<p>/.flat/`: `<Name>.sol` for single-file contracts,
  `<Name>/<Impl>.sol` plus `<Proxy>.p.sol` for proxies, `<Name>-<chain:address>.sol` when names
  collide.
- Contract selection: contracts with `critical: true` when any exists, else all. Same rule as
  today.
- zk sources fetched by `audit-diff fetch-zk` (7.3) with their repository-relative paths.

Evidence side, read from a dataset checkout:

- `repositories.json`, every `*/audit-summary.json` and `_libs/*/audit-summary.json`, every
  `audited-sources/manifest.json`. Audited files are read lazily.
- `foundry.toml` for formatting parity (7.2).

Configuration: `packages/audit-diff/audit-diff.config.json` (7.4).

### 5.2 Evidence index

Built once per run from manifests and summaries, without opening sources:

- `collections`: id (directory name), `kind` = `library` when under `_libs`, referenced repository
  ids, reports.
- `nameIndex`: unit name to the list of (collection, audited file, versions).
- `repoIndex`: repository id to the collections referencing it.
- `ancestors(repo)`: transitive `fork_of` chain from the registry; `descendants` for warnings.

Then the content index, built lazily and cached:

- `hashIndex`: sha256 of the comparable text of an audited unit to its `AuditedUnitVersion`
  records across all collections. Comparable text is `comparableText(normalizeSource(unit))`
  exactly as today.
- Whole-file units for non-Solidity files: hash of the comparable whole file, plus `pathIndex`
  keyed by repository-relative path.
- Parsed units per audited file are cached on disk under
  `packages/audit-diff/.cache/audited-units/<sha256>.json`, keyed by the manifest's post-format
  `sha256`. A rerun parses only files that changed.

### 5.3 Deployed units

For each selected contract and each flat file of project P:

1. Skip the file when its flat hash (`sourceHashes`) was already processed in this run.
2. Format the file with the dataset's fmt settings (7.2), cache by flat hash.
3. Extract units with `extractUnits`. Each unit gets `unitHash = sha256(comparableText)`.
4. Dedup by `unitHash`. zk sources become whole-file units with `unitHash` over the file.

### 5.4 Ranking context

For project P, collections receive a rank. Lower is closer. The context is a ranking hint; it never
limits which collections are searched by name or hash.

```text
rank 0  own        collection whose id equals P's project id, or config `collection` override
rank 1  upstream   for each repository R referenced by own:
                     for each A in ancestors(R): repoIndex[A]
rank 2  stack      for each template `vendor/Name` on P's contracts:
                     collectionHints[`vendor/Name`] ?? collectionHints[vendor]
                     ?? the collection named `vendor` when it exists
rank 3  library    every collection under _libs
rank 4  other      every remaining collection
```

Upstream is directional: forks inherit from ancestors, never the reverse, and sibling forks do not
share through lineage. When a collection appears at several ranks, the lowest wins. The
candidate set for renamed units is own, upstream, stack and library.

`contextKey = sha256(sorted [rank:collection] pairs for ranks 0..2)`. Two projects with the same
own, upstream and stack collections share a context.

### 5.5 Resolving one unique unit

This branch intentionally uses a small experimental rule set rather than a learned or heavily
tuned matcher. Constants: `MIN_RELATED_NAME_SCORE = 0.55` for same-name or alias candidates at
ranks 0 to 3, `MIN_OTHER_NAME_SCORE = 0.7` for rank 4, `MIN_RENAME_SCORE = 0.65`,
`RANK_TIE_BAND = 0.05`, and `MIN_RENAME_SIZE_SIMILARITY = 0.5`.

```text
resolve(U, ctx):
  1. identity
     hits = hashIndex[U.hash]
     if hits: choose by (rank asc, newest first)
              -> status identical (or library when the collection is a library), matchedBy identity
     Identity is accepted from any collection, in or out of context: identical code that was
     audited is identical code that was audited. Provenance says where.

  2. compile one candidate union
     - every same-name or configured-alias unit in every collection
     - every unit from own, upstream, stack and library collections
     - require the same kind, except concrete and abstract contracts are compatible;
       signature-free namespaces may also cross interface/contract kinds
     - renamed candidates must have min(lines(U), lines(V)) / max(...) >= 0.5;
       also reject pairs where both sides are tiny and have no signatures

  3. score every version of every candidate
     normalize each side by replacing its own unit name with a placeholder and dropping lone braces
     evidence = 0.40 * lineDice
              + 0.30 * deployedLineContainment
              + 0.20 * signatureJaccard
              + 0.10 * lineCountRatio
     score = evidence / available component weight
           + 0.05 when the name or configured alias matches
     cap score at 1. When both units have no signatures, omit that component and divide by 0.8;
     this avoids penalizing data-only libraries while giving them no artificial signature match.

  4. discard candidates below the threshold for their rank
     winner = highest score; if a candidate is within RANK_TIE_BAND of the top score and has a
              lower rank, prefer it
     -> status differs, matchedBy name/alias/similarity

  5. if no candidate clears its threshold -> unaudited
```

`signatures(unit)` is the set of function, event and error signatures (name plus parameter
types) from the parser. Name matching is deliberately only a weak signal: it broadens the
candidate set and adds 0.05, but cannot rescue unrelated code. Interfaces are only compared with
interfaces unless both sides have no callable signatures, covering namespace-only declarations
such as Safe's `Enum` without allowing thin interfaces to match implementations.

### 5.6 Version selection

Within the winning (collection, unit name), versions newest first, as today:

1. A version whose comparable hash equals `U.hash` wins: identical.
2. Otherwise the version with the highest composite score, newest on ties.
   `laterAuditedVersionExists` is set when the chosen one is not the newest.

### 5.7 Whole-file units

zk programs, circuits and other non-Solidity sources:

1. Identity through `hashIndex`.
2. Candidates from `pathIndex`: audited files sharing the longest common path suffix with the
   deployed file, at least two segments, within own, upstream, stack and library collections. This
   replaces basename matching, which collides constantly on Rust files such as `mod.rs` and
   `lib.rs`.
3. Highest line similarity above `WHOLE_FILE_MIN_SIMILARITY = 0.3`, else unaudited.

### 5.8 Statuses and provenance

The four summary statuses stay: `identical`, `library`, `differs`, `unaudited`. `library` means
identical to a library collection's unit. Every match carries provenance:

- `origin`: `own | upstream | stack | library | other`
- `collection`: dataset directory id
- `relation`: `{ type: 'own' } | { type: 'fork_of', repository } | { type: 'template', template } |
  { type: 'library' } | { type: 'name' }`
- `matchedBy`: `identity | name | alias | similarity`
- `rank`, `similarity`, `warnings`

### 5.9 Complexity

Identity is one map lookup. The candidate union combines the few global same-name hits with the
distinct unit names in the contextual collections. Size and kind checks reject many renamed
candidates before line diffing. Measured today, the largest individual collections have about 350
distinct names (celo), 331 (openzeppelin), and 180 (safe); including shared libraries makes this a
batch job of minutes rather than an interactive operation.

## 6. l2beat: output store

### 6.1 Layout

```text
<out>/
  units/<unitHash>.json    name, kind, normalized source,
                           resolutions: { <contextKey>: { match, diff } }
  projects/<slug>.json     contracts -> files -> [{ unitHash, name, kind, startLine, endLine,
                           lines, status, coveredLines, warnings, contextKey }],
                           summary, report ids used, dataset revision, discovery timestamp
  reports.json             report id -> title, auditor, date, collection, url
  collections.json         collection id -> display name, kind
  meta.json                dataset revision and resolver version
```

Identity resolutions are context-free and stored under a fixed key. In practice a unit has one
resolution; the map exists for the near-tie cases where rank decides.

### 6.2 Schema changes in `src/contract/schema.ts`

- `UnitCoverage` splits into `UnitRef` (in project files: `unitHash`, name, kind, line range,
  status, coveredLines, warnings, contextKey) and `UnitRecord` (in unit files: source,
  resolutions).
- `UnitMatch` gains `collection`, `origin`, `relation`, `rank`, and `matchedBy` gains `identity`.
- `ProjectAuditCoverage` loses embedded sources and diffs; `reports` moves to `reports.json`
  with a per-project list of ids.
- `schemaVersion` becomes 2.

### 6.3 Incremental generation

- Audited-unit parsing cached by file `sha256` (5.2).
- Formatted deployed files cached by flat hash (5.3).
- Unit resolutions cached by `(unitHash, contextKey, datasetRevision)`; a rerun resolves only new
  hashes.
- `audit-diff gc` removes unit files no project references.
- `audit-diff generate --all` processes every project with discovery output; `--project` keeps
  working.

## 7. l2beat: other changes

### 7.1 Deployed reader

A new `src/deployed/` module replaces the deployed half of `dataset/read.ts`: read
`discovered.json`, apply the selection rule, locate flat files including the name-collision and
proxy conventions, and expose `sourceHashes` and `template` per contract. `fetch_deployed.py` is
the reference for the flat lookup rules.

### 7.2 Formatting parity

Both sides must be formatted identically for the displayed diff to show code changes only. The
dataset owns the formatter settings and exports them as `foundry.toml` (4.5). audit-diff runs
`forge fmt` with that file on each unique deployed flat file and caches the result. Generation
therefore requires Foundry on the machine running it. Identity does not depend on formatting,
since comparable text collapses whitespace.

### 7.3 zk sources

`audit-diff fetch-zk <project>` reads, through `@l2beat/config`, the project's
`zkCatalogInfo.verifierHashes[].knownDeployments[].sourceLink` and `programHashes` URLs, fetches
the referenced trees or files at the given revision, and stores them under
`packages/audit-diff/.cache/zk/<project>/<name>/...` with a `zk-sources.json` in the shape used
today. The directory is gitignored. The instructions from `FETCH_DEPLOYED_SKILL.md` about locating
these links become the command's documentation.

### 7.4 Configuration

```json
{
  "datasetRepoUrl": "https://github.com/sergeyshemyakov/audit-dataset/blob/main",
  "collectionHints": {
    "opstack": "optimism",
    "orbitstack": "arbitrum",
    "gnosisSafeModules/ZodiacDelay": "safe",
    "gnosisSafeModules": "optimism"
  },
  "projects": {
    "tornado-cash": { "aliases": { "Tornado": "Mixer" } },
    "<l2beat id>": { "collection": "<dataset dir>", "slug": "<frontend slug>" }
  }
}
```

`collectionHints` keys are a template vendor or `vendor/Template`; the more specific key wins. A
value may be a collection id or a list. The default for an unlisted vendor is the collection with
the same id when it exists. Hints pointing at collections that do not exist yet are inert. See
section 8 for the screened list.

### 7.5 Frontend

- `AuditCoverageSource` gains `getUnit(hash)`. The content implementation reads `projects/*.json`
  eagerly, since they are thin, and `units/<hash>.json` lazily. It does not go through
  `getCollection`, which loads a whole directory.
- `getAuditsUnitDetails` reads one unit file. Unit ids in URLs become unit hashes.
- The match panel shows origin, collection and relation, for example "upstream: optimism via
  fork of ethereum-optimism/optimism" or "stack: arbitrum via template orbitstack/Inbox".
- Summary and project pages keep their shape; `libraryReportsCount` becomes counts by origin.

### 7.6 Storage

For all projects the store is estimated at ten to twenty thousand unit files of tens of kilobytes
each, so hundreds of megabytes. That does not belong in the frontend repository. The prototype
keeps committed JSON for a curated set of projects. The next phase moves the store behind a
database-backed `AuditCoverageSource`; the interface is the seam.

### 7.7 Tests

- Fixture dataset under `packages/audit-diff/test/fixtures/dataset/` with an `upstream`
  collection, a `fork` collection whose repository has `fork_of` upstream, a `_libs/lib`
  collection, and matching fixture `discovered.json` plus `.flat` files.
- Unit tests: id normalization, registry parsing and `ancestors`, evidence index building from
  manifests, ranking context derivation including hints and defaults, resolution order and the
  tie band, weak same-name abstention, kind compatibility, renamed-candidate prefilter, path-suffix
  candidates, version selection, output schema validation, cache invalidation by dataset and
  resolver version.
- Integration: generate for the fixture and assert provenance per unit. Once the `optimism`
  collection exists, a snapshot test that bob's stack contracts resolve there.

## 8. Collection hints: screened template vendors

Every template vendor used by any `discovered.json` on 2026-09-14. Counts are contracts and
projects using the vendor. "Default" means the same-name rule applies and no hint is needed. A
hint affects ranking and which stack collection contributes renamed candidates. Name and hash
lookups still span all collections, but a missing hint can hide a renamed candidate.

Stacks and shared systems, explicit hints:

| Vendor | Contracts | Projects | Proposed collection | Note |
|---|---:|---:|---|---|
| `opstack` | 901 | 73 | `optimism` | OP monorepo contracts |
| `orbitstack` | 757 | 49 | `arbitrum` | Nitro contracts |
| `shared-zk-stack` | 122 | 14 | `zksync2` | ZK stack shared contracts. Review: or a dedicated collection |
| `polygon-cdk` | 38 | 14 | `polygonzkevm` | Agglayer and CDK contracts. Review |
| `starkex` | 34 | 10 | `starkex` | StarkWare StarkEx; no single l2beat project. New collection, review |
| `shared-sharp-verifier` | 135 | 1 | `starknet` | SHARP verifier; StarkWare. Review |
| `succinct` | 40 | 14 | `sp1` | SP1 verifiers, gateway, OP Succinct, Blobstream, Vector |
| `risc0` | 38 | 5 | `risc0` | RISC Zero verifiers and Kailua. New collection. Note: Kailua audits currently live in `bob`; name lookup finds them there meanwhile |
| `eigenlayer` | 75 | 5 | `eigenlayer` | EigenLayer and EigenDA core. New collection |
| `cartesi` | 27 | 2 | `cartesi` | Cartesi PRT. New collection |
| `taiko` | 46 | 5 | default | |
| `espresso` | 13 | 4 | default | |
| `zama` | 35 | 2 | `zama` | fhEVM gateway. New collection, review |
| `aztecv1` | 3 | 1 | `aztecnetwork` | Aztec Connect; that collection already references `AztecProtocol/AZTEC` and `aztec-connect-bridges` |

Shared infrastructure, explicit hints, some per template:

| Template or vendor | Proposed collection | Note |
|---|---|---|
| `GnosisSafe` (root) | `safe` | |
| `ChainlinkAggregatorProxy`, `ChainlinkAuthorizedForwarder`, `ChainlinkOCR2Aggregator` (root) | `chainlink` | New collection |
| `NXV` (root) | none | Unknown vendor, review |
| `global/ProxyAdmin`, `global/TimelockController`, `global/UpgradeableBeacon` | `openzeppelin` | |
| `global/Timelock` | none | Compound-style timelock, review |
| `global/DepositContract` | none | Ethereum deposit contract, review |
| `gnosisSafeModules/ZodiacDelay` | `safe` | Zodiac |
| `gnosisSafeModules/DeputyGuardianModule`, `LivenessGuard`, `LivenessModule`, `SaferSafes` | `optimism` | OP safe extensions |
| `transporter/*`, `ccip/*` | `chainlink` | CCIP |
| `tokens/*` | none | Mixed token templates; add per-template hints if a collection appears |
| `circle/*`, `shared-circle` | `circle` | New collection |
| `maker/*` | `maker` | New collection |
| `uma/*` | `uma` | New collection |
| `lido/*` | default | |
| `polygonposbridge/*` | `polygon-pos` | |
| `layerzero/*` | default | |
| `avail/*` | `avail` | Review |
| `uniswap/calibur7702` | none | Review |
| `uniswapv3/*`, `uniswapv4/*` | default | `uniswapv3` templates are used by two projects |

Project-specific vendors, default rule, no hint: `adi`, `apex-omni`, `aztecnetwork`, `base`,
`basesolbridge`, `butternetwork`, `cbridge`, `debridge`, `eclipse`, `edgex`, `eigenda`,
`ethereal`, `facet`, `fluent`, `frankencoin`, `fraxtal`, `fusionplus`, `gnosis`, `hyperliquid`,
`interfold`, `intmax`, `jovay`, `katana`, `kinto`, `lighter`, `lightlink`, `linea`, `liquityv2`,
`mantapacific`, `megaeth`, `metis`, `morph`, `payy`, `polymarket`, `polygon-pos`,
`privacy-boost`, `privacy-pools`, `railgun`, `relay`, `scroll`, `shibarium`, `sophon`,
`stargate`, `starknet`, `tornado-cash`, `unichain`, `wormhole`, `zklinknova`.

Vendors used by more than one project among these: `facet` (facet, ethscriptions), `lighter`,
`uniswapv3`, `edgex`, `adi`, `eigenda`. The default rule handles them: ethscriptions' `facet/*`
contracts rank the `facet` collection as stack.

Vendor `gnosis` here is Gnosis Chain, which is why the Safe collection is renamed to `safe`.

Template directories on disk but unused by any current `discovered.json`: `allbridge`, `amarok`,
`apechain`, `bugbuster`, `everclearbridge`, `fraxferry`, `hyperlane`, `morpho`, `nearomni`,
`robinhood`, `tradable`, `yearn`, `yieldfi`. No hints needed until used.

## 9. Phasing

1. **Dataset.** Id normalization and migration, `repositories.json`, `index_sources.py`,
   manifest `units` and post-format `sha256`, `foundry.toml` export, removal of the deployed
   flow, `_libs/gnosis` to `_libs/safe`, docs and skill updates.
2. **Engine.** Deployed reader from config, `fetch-zk`, evidence index, ranking context,
   resolution per unique unit, path-suffix whole-file matching. Output stays per project in the
   current schema to validate on tornado-cash, ethscriptions, umbra, uniswapv3 and bob.
3. **Store.** Content-addressed output, schema 2, lazy frontend source, provenance in the UI.
4. **Scale.** `generate --all`, database-backed source, the `optimism` and other stack
   collections as they are extracted.

## 10. Open points and risks

- The composite weights, thresholds and renamed-unit size prefilter are intentionally initial
  values. Evaluate them against regenerated data before adding more features.
- Exact hash matches for tiny interfaces still count. Non-identical tiny interfaces must clear the
  same composite threshold as other units; sharing a name or both having no signatures is not
  enough.
- Forks with a small delta may match a sibling fork's audited file at higher similarity than the
  upstream's. This is accepted as valid evidence; provenance shows the collection.
- Generation requires Foundry.
- Gist and non-GitHub ids follow the normalization rules in 4.2; the registry cannot resolve
  lineage for them.
- The storage backend for all projects is decided in phase 4.
- Mapping targets marked "review" in section 8 need a decision when the corresponding collections
  are created.
