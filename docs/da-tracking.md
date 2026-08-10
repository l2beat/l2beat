# DA tracking

DA tracking measures how much data each project posts to its data availability
layer. Projects declare `daTracking` entries in `packages/config` (inbox +
sequencers/topics for ethereum blobs, a namespace for celestia, appIds for
avail, a customerId for eigen-da), and the backend stores hourly
`DataAvailability` records per project, layer and configuration.

## When a DA-relevant value rotates on-chain

This is the everyday flow. After a discovery refresh changes a DA-relevant
value (batcher, sequencer, validator set), the history guard fails with
"daTracking history for X is out of date with discovery". Fix it in the same
PR:

```bash
cd packages/config
pnpm da:history <project>
```

That's it — the command records the rotation in the project's
`daTracking.json`, regenerates the snapshot, and the whole change (discovery
refresh, `daTracking.json`, `snapshot.json`) lands in one reviewed commit. It
works out of the box: block numbers are resolved through a public ethereum
RPC (set `ETHEREUM_RPC_URL` in `packages/config/.env` only if you want a
different one). For non-ethereum layers the boundary cannot be resolved
automatically — pass it yourself with `--since-block <n> --until-block <n>`
(blocks on the DA layer chain bracketing the change).

If the rotation was a discovery flap/revert (the value went A -> B and back
to A), revert the spurious era instead of keeping it:

```bash
pnpm da:history <project> --drop-last
```

A genuine A -> B -> A rotation is supported too: the repeated era gets a
`discriminator` that keeps its backend configuration id distinct.

Two things to know about the result:

- The old era is closed and the new one opened with a deliberately
  overlapping `bracketed` boundary (the old era ends at the current discovery
  run's block, the new era starts at the previous run's block). The overlap
  is safe — the two eras match disjoint on-chain data, so nothing is missed
  and nothing is double-counted even though the exact rotation block is
  unknown.
- Closing an era makes the backend resync that configuration's data on the
  next deploy. This is safe; the data is refetched automatically.

## Where the config comes from

The backend turns every `daTracking` entry into an indexer configuration
identified by a hash of its identity fields (`createDaTrackingId` in
`@l2beat/shared` — since/until are excluded so ranges can be edited in
place). For stack-template projects (opStack, orbitStack, zkStack) the
resolution order is (`resolveDaTracking` in
`packages/config/src/templates/daTrackingHistory.ts`):

1. `nonTemplateDaTracking` — full manual override, for projects whose
   tracking cannot be derived from discovery (custom topics, hand-maintained
   histories, and archived projects whose history is fully closed while
   discovery still derives an open era — the guard would reject the
   mismatch, so they stay on the override).
2. `src/projects/<name>/daTracking.json` — the committed, machine-maintained
   era store. Written ONLY by `pnpm da:history`, never by hand.
3. A single era derived from current discovery values (`SystemConfig`
   batcher/inbox, `SequencerInbox.batchPosters`, `ValidatorTimelock`
   validators) — only for projects that don't have a history file yet; a
   guard test requires every such project to get one.

The era store exists because discovery holds only the *current* chain state:
without it, an on-chain rotation of the batcher/sequencer silently replaces
the derived entry, its configuration id changes, and the backend wipes all
data indexed under the old id.

## Previewing config changes locally

> Developer tool — it needs API urls configured in a `.env` (see below). If
> you are a researcher and want a preview, ask a developer to run it or to
> set the environment up for you once.

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
new config, gaps usually mean incomplete coverage — a missing sequencer,
wrong topic or namespace — though they can also mean the project simply did
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

- `ETHEREUM_BEACON_API_URL` — ethereum blobs (plus `ETHEREUM_RPC_URL` to
  override the default rpc from the ethereum chain config)
- `CELESTIA_BLOBS_API_URL`
- `AVAIL_BLOBS_API_URL`
- `EIGEN_DA_API_URL` and `EIGEN_DA_PER_PROJECT_API_URL`
- `DA_PREVIEW_DB_URL` — optional read-only database connection. When set, the
  ethereum preview reads the indexed `Blob` table instead of calling the beacon
  API, which is much faster for larger windows (and works even without
  `ETHEREUM_BEACON_API_URL`).
- `LOG_LEVEL` — defaults to INFO

Note that the live ethereum path fetches logs and blocks over rpc for every
block in the window, so prefer `DA_PREVIEW_DB_URL` for windows longer than a
few hours. EigenDA per-project data is published as daily files starting
2025-08-01; days without a file are skipped with a warning.

## Guarding against silent data wipes

The committed snapshot is enforced by
`packages/config/src/snapshots/guard.test.ts`: it fails when an identity
disappears or the snapshot is stale, so identity changes are always explicit.
After verifying your change with `pnpm da:preview`, regenerate the snapshot to
accept it:

```bash
cd packages/config
pnpm snapshots:generate
```
