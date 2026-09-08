# @l2beat/audit-diff

Compares the smart contract sources deployed onchain (flattened discovery output) with the
sources that were covered by public audits, both taken from the `audit-dataset` repository, and
writes one JSON coverage report per project.

The report format lives in `src/contract` and is the only thing consumers (the frontend) depend
on. Everything else in this package is an implementation of that contract and can be replaced.

```sh
pnpm --filter @l2beat/audit-diff generate \
  --dataset ~/Documents/repos/audit-dataset \
  --out ../frontend/src/content/audits \
  --project tornado-cash --project ethscriptions --project umbra --project uniswapv3
```

## Comparison rules

- Two units are **identical** when their *comparable* texts are equal. The comparable text is the
  code with comments and the string messages of `require(...)` / `revert(...)` removed and
  whitespace collapsed. Such changes are shown in the diff as *ignored* lines but never make a
  unit differ and never count as uncovered lines.
- Audited versions are tried newest first; the first identical one wins. If none is identical the
  version with the highest similarity is used (newest on ties), so code copied from an older
  release is compared with that release. `laterAuditedVersionExists` flags that a newer audited
  revision exists.
- Project audits take precedence over standard library audits (`libs/<vendor>`); libraries are
  matched by exact unit name only.

`audit-diff.config.json` holds `datasetRepoUrl` (base URL used to link report files) and per-project overrides: `aliases` map a deployed unit name to the
audited unit name when a contract was renamed, and `slug` overrides the L2BEAT slug when it differs
from the dataset directory name.
