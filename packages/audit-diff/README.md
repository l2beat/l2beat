# @l2beat/audit-diff

Compares the smart contract sources deployed onchain (l2beat discovery output in
`packages/config/src/projects/<project>/.flat`) with the sources covered by public audits (the
`audit-dataset` repository) and writes a content-addressed coverage store.

The store format lives in `src/contract` and is the only thing consumers (the frontend) depend on.

```sh
# optional: fetch zk verifier / program sources referenced by the project's config
pnpm --filter @l2beat/audit-diff cli fetch-zk --project ethscriptions

pnpm --filter @l2beat/audit-diff generate \
  --dataset ~/Documents/repos/audit-dataset \
  --out ../frontend/src/content/audits \
  --project tornado-cash --project ethscriptions --project umbra --project uniswapv3

# every project with a discovered.json
pnpm --filter @l2beat/audit-diff generate --dataset ~/Documents/repos/audit-dataset --out <dir> --all

# drop unit records no project references
pnpm --filter @l2beat/audit-diff cli gc --out <dir>
```

Requires Foundry (`forge fmt`) to format deployed sources with the dataset's `foundry.toml`;
without it the comparison still works but diffs may show style differences.

## Output

```text
<out>/
  units/<unitHash>.json    one record per unique deployed unit: source, resolutions by context
  projects/<slug>.json     contracts -> files -> unit references with status and match
  reports.json             report metadata by global id `<collection>/<report id>`
  collections.json         collection metadata
  meta.json                dataset revision the resolutions belong to
```

A unit is identified by the sha256 of its *comparable* text: the code with comments and the
string messages of `require(...)` / `revert(...)` removed and whitespace collapsed. Identical
units across contracts and projects are resolved once.

## Resolution

For every unique deployed unit:

1. **Identity.** The comparable hash exists in any collection: `identical` (or `library` when the
   collection is under `_libs`). Closest collection wins, then newest version.
2. **Same name, anywhere.** Every collection declaring the unit name is a candidate; the version
   with the highest similarity wins, the closer collection wins within a 0.05 band. Candidates
   from unrelated collections need similarity 0.5, others 0.3.
3. **Rename heuristic** over the project's own, upstream and stack collections, with cheap
   prefilters (line count band, function signature overlap) before the line diff.
4. A same-name candidate below its threshold is kept with a `low-similarity` warning.
5. Otherwise `unaudited`.

Whole-file units (zk programs, circuits) use identity, then audited files sharing the longest
repository path suffix.

Collections are ranked per project: `own` (the dataset directory named like the project, or the
configured `collection`), `upstream` (collections referencing an ancestor in the dataset's
`repositories.json` of a repository the own audits cover), `stack` (collections hinted by the
discovery template vendor, see `collectionHints` in `audit-diff.config.json`; unlisted vendors
default to a collection of the same name), `library` (`_libs/*`), `other`. Ranking never limits
where a unit is searched by name or hash.

`audit-diff.config.json` holds `datasetRepoUrl`, `collectionHints` and per-project overrides:
`aliases` map a deployed unit name to the audited unit name when a contract was renamed,
`collection` names the dataset directory, `slug` overrides the L2BEAT slug.
