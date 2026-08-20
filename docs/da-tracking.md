# DA tracking

DA tracking measures how much data each project posts to its data availability
layer. Projects declare `daTracking` entries in `packages/config` (inbox +
sequencers/topics for ethereum blobs, a namespace for celestia, appIds for
avail, a customerId for eigen-da). The backend turns every entry into an
indexer configuration identified by a hash of its identity fields
(`createDaTrackingId` in `@l2beat/shared` - the range is not part of the id;
see the guard section below for what editing it costs) and stores hourly
`DataAvailability` records per project, layer and configuration id.

## Declaring daTracking in a project

Every project's DA tracking history is an explicit array in its own config
file - `daTracking` for the stack templates (`opStackL2`, `orbitStackL2`,
`zkStackL2`, `agglayer`, ...), `config.daTrackingConfig` for hand-written
projects. Templates never derive it: a project without the array has no DA
tracking, and adding one is a step of the new-project checklist (see below).

The array is the chain's history, oldest first:

- **Closed (historical) entries are pure literals** - inbox, sequencers,
  namespace, appIds, customerId, `sinceBlock` and `untilBlock` written out,
  with a comment saying what each boundary is
  (`untilBlock: 25631821, // batcherHash rotation`).
- **The open (last) entry of a template stack is a helper call**:
  `getOpStackDaTracking(discovery, { sinceBlock })`,
  `getOrbitStackDaTracking(discovery, { sinceBlock })` or
  `getZkStackDaTracking(discovery, { sinceBlock })` (exported next to the
  template). The helper reads the identity fields - inbox and batcher for OP
  Stack, SequencerInbox and batch posters for Orbit, ValidatorTimelock and
  validators for ZK Stack - from discovery **on purpose**: when the operator
  rotates, discovery changes the id, the snapshot guard fails CI and the
  freeze recipe below tells you what to do. Do not "simplify" the open entry
  to literals - that is the rotation detection.
- **Ranges are always literals.** The helpers take `sinceBlock` (and an
  optional `untilBlock`) as arguments and never read them from discovery, so
  the indexed window cannot drift behind the project's back. Hand-written
  entries follow the same rule - no `discovery.getContract(...).sinceBlock`.
- Non-ethereum layers (celestia, avail, eigen-da) have no helper: their
  identity is a literal namespace / appIds / customerId anyway.

`packages/config/src/projects/ink/ink.ts` is the reference shape: a frozen
literal entry closed at the rotation block, followed by the helper call
starting at the same block.

### New-project checklist

Adding DA tracking is a deliberate step when adding a project. A test narrows
the forgetting gap: a live scaling project whose DA row names a layer we have
indexers for (ethereum, celestia, avail, eigenda) must declare a `daTracking`
array or be allowlisted with a comment on `MISSING_DA_TRACKING` in
`packages/config/src/snapshots/daTracking/missing.ts`.

1. Find what the chain posts and where (ethereum blobs/calldata, celestia
   namespace, avail appIds, eigen-da customerId).
2. Add the `daTracking` array: the helper call for a template stack posting
   to ethereum, a literal entry otherwise. `sinceBlock` is the first real
   post (first batch / first blob in the namespace), verified on-chain, not
   the contract deployment block.
3. Verify with `pnpm da:preview <projectId>` (below) - it shows the blobs the
   configuration matches and the identity diff against the snapshot.
4. Regenerate the snapshot (`pnpm snapshots:generate` in `packages/config`)
   and commit it with the project.

## Previewing config changes locally

After editing `daTracking` config you can preview the resulting data without
deploying the backend:

```bash
cd packages/backend
pnpm da:preview [projectId] [--from <unix|ISO>] [--to <unix|ISO>] [--layer <name>]
```

The script rebuilds `@l2beat/config`, assembles the exact configurations the
backend would index (including sovereign projects tracked through a DA layer's
`sovereignProjectsTrackingConfig`), fetches blobs for the window and runs the
production record generation. It prints a per-project summary and writes the
full hourly records to `scripts/da/preview.json`.

Hours in the window where a configuration matched no data are reported as
`GAP` warnings (and listed under `gaps` in the JSON). When you are adding a
new config, gaps usually mean incomplete coverage - a missing sequencer,
wrong topic or namespace - though they can also mean the project simply did
not post in those hours, so compare against the project's posting cadence.
Hours where the layer produced no blobs at all (e.g. a lagging blob cache)
are excluded from gap detection and warned about separately.

It also always prints an identity diff against the committed snapshot
(`packages/config/src/snapshots/daTracking/snapshot.json`): added ids sync from
scratch, removed ids mean the backend WILL WIPE the data indexed under them on
deploy.

Examples:

```bash
# last 3 hours (default window) for a single project
pnpm da:preview taiko

# explicit window, single layer
pnpm da:preview eclipse --from 2026-07-30T00:00Z --to 2026-07-30T06:00Z --layer celestia
```

### Environment variables

The script loads `packages/backend/scripts/da/.env` (see the `.env.example`
next to it) with `packages/backend/.env` as a fallback. Each layer is enabled
only when its url is set (same variables as the backend module); layers
without one are skipped with a warning:

- `ETHEREUM_BEACON_API_URL` - ethereum blobs (plus `ETHEREUM_RPC_URL` to
  override the default rpc from the ethereum chain config)
- `CELESTIA_BLOBS_API_URL`
- `AVAIL_BLOBS_API_URL`
- `EIGEN_DA_API_URL` and `EIGEN_DA_PER_PROJECT_API_URL`
- `DA_PREVIEW_DB_URL` - optional read-only database connection. When set, the
  ethereum preview reads the indexed `Blob` table instead of calling the beacon
  API, which is much faster for larger windows (and works even without
  `ETHEREUM_BEACON_API_URL`).
- `LOG_LEVEL` - defaults to INFO

Note that the live ethereum path fetches logs and blocks over rpc for every
block in the window, so prefer `DA_PREVIEW_DB_URL` for windows longer than a
few hours. EigenDA per-project data is published as daily files starting
2025-08-01; days without a file are skipped with a warning.

## Editing sinceBlock / untilBlock

`sinceBlock` / `untilBlock` are not part of the configuration id, so editing
them keeps the history indexed under that id. The block indexer (ethereum,
celestia, avail) trims instead of wiping:

- raising `sinceBlock` deletes only the records before the new start
- setting or lowering `untilBlock` deletes only the records after the new end
- lowering `sinceBlock` still wipes the configuration and re-indexes it from
  the new start, because the indexed range cannot have gaps

Records are hourly buckets, so the hour the edited edge falls into cannot be
split - it holds blobs from both sides of the edge. It is deleted together
with the out-of-range records: up to an hour of in-range data is lost per
edited edge, but nothing is ever counted twice (see `DaIndexer.trimData` in
`packages/backend`).

## Editing sinceTimestamp / untilTimestamp (eigen-da)

Since/until are not part of the configuration id, so editing them keeps the
history under the same id. The EigenDA indexers implement `trimData`, so on
deploy such an edit trims the configuration's `DataAvailability` rows to the
new range instead of wiping them:

- raising `sinceTimestamp` deletes only the rows before the new start
- setting or lowering `untilTimestamp` deletes only the rows after the new end
- lowering `sinceTimestamp` still wipes and re-indexes from scratch, because
  the pipeline cannot leave gaps in the indexed range

Rows are hourly buckets, so an edge that is not a full hour has a bucket
straddling it. Unlike the block DA indexer, the `since` edge keeps the
straddling hour (it is never indexed again, so deleting it would leave a
hole); at the `until` edge it is deleted (indexing resumes inside that hour
if the range is ever extended again, so nothing is lost for good).

## Guarding against silent data wipes

`packages/config/src/snapshots/daTracking/snapshot.json` pins, per project,
every DA tracking configuration identity the backend will index - its `id`
and the full `config` it was computed from (label and range are derived from
the config on load, so they cannot diverge; the id is stored so a change to
the hash function itself still trips the guard) - including sovereign
projects tracked through a DA layer's `sovereignProjectsTrackingConfig`.
After a rotation the snapshot is the only surviving copy of the old
configuration's fields, which is what lets the freeze notice print a
paste-ready frozen entry. The guard tests in
`packages/config/src/snapshots/` enforce it against the configs:

- **no identity disappears** (`guard.test.ts`) - the backend deletes
  configurations whose id is gone and wipes everything indexed under them;
- **no range moves** (`guard.test.ts`) - the id hashes the identity fields
  only, so a changed `sinceBlock`/`untilBlock`/`sinceTimestamp`/
  `untilTimestamp` keeps the id while the backend re-syncs the configuration
  to the new range: raising `since` or lowering/setting `until` trims the
  out-of-range records (see the editing sections above for the exact
  bucket-edge behaviour), lowering `since` wipes and re-indexes from the new
  start. The guard makes every such move an explicit decision; the failure
  prints the old and the new range;
- the snapshot is up to date and no two configs hash to the same id.

Every failure message says what the backend would do and how to resolve it.
The resolutions are deliberately human work - the messages end with a
guard-rail telling AI agents to hand the error over. The one thing **not** to
do is regenerate the snapshot to make CI green: that is exactly the sign-off
that accepts the wipe.

### An identity disappeared - freeze it

This is what a sequencer or inbox rotation picked up by discovery looks like:
the old id vanishes and a new one appears for the same project. Editing the
entry in place loses the old era, so freeze it instead (the two ethereum
entries in `packages/config/src/projects/ink/ink.ts` are the resulting
shape):

1. In the project's `daTracking` array, turn the old entry into literals -
   copy the pre-change values (inbox, sequencers/topics, namespace, appIds,
   customerId, since) from git history so it keeps producing exactly the old
   id. If the entry is a helper call (`getOpStackDaTracking` & co), replace
   the call with the literal entry it used to produce.
2. Close it with `untilBlock` (`untilTimestamp` for eigen-da) at the last
   block the old configuration was live, verified on-chain. If you cannot
   pin it down, the current discovery run's `usedBlockNumbers[<chain>]` in
   `discovered.json` is a safe upper bound.
3. Add the new entry with the new values as the last array element, starting
   where the old one ended (`sinceBlock` = the old entry's `untilBlock`). For
   a template stack that is the helper call again -
   `getOpStackDaTracking(discovery, { sinceBlock })` - so the next rotation
   is caught the same way. If you only bracketed the change, start it at the
   previous discovery run's `usedBlockNumbers[<chain>]` from the pre-change
   `discovered.json` - overlaps are fine, holes are not.
4. If the configuration genuinely stopped being used, close it as in step 2
   and add nothing - a deleted entry is gone for good, a closed one is kept.
5. Only then regenerate the snapshot with `--overwrite` (see below) and
   commit it as the sign-off.

### A range changed - pin it or accept it

The id did not change, so do not freeze-and-re-add (both entries would hash
to the same id). Ranges are literals in the project's `.ts` (the helper calls
included), so if the move is unintended find the edit that changed
`since`/`until`, restore the snapshot's values and leave the snapshot alone.
If it is intended (you just closed an entry with `untilBlock` while freezing
it, or you are deliberately correcting a range), regenerate the snapshot
knowing what it costs: a raised `since` or lowered `until` trims the records
outside the new range, a lowered `since` re-indexes the configuration from
scratch.

### Regenerating the snapshot

After verifying your change with `pnpm da:preview` (it prints the identity
diff against the committed snapshot) and resolving the guard as above:

```bash
cd packages/config
pnpm snapshots:generate
```

The plain command is **append-only**: it registers new identities for
projects that only gained configs, and leaves a project completely untouched
when one of its committed identities disappeared or a range moved - it does
not append the re-keyed identity either, since the snapshot would then show
two configs where the project file has one. It prints which projects it left
alone. Accepting a removal or a range move - the sign-off for a wipe/re-sync
- has to be asked for explicitly:

```bash
pnpm snapshots:generate --overwrite
```
