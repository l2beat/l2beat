<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Automatic Token Ingestion](#automatic-token-ingestion)
  - [Overview](#overview)
  - [The only input is an address](#the-only-input-is-an-address)
  - [Queue states](#queue-states)
  - [Approval mode](#approval-mode)
  - [Processing one entry: plan + fetch + apply](#processing-one-entry-plan--fetch--apply)
  - [Abstract token resolution](#abstract-token-resolution)
  - [Outcomes](#outcomes)
  - [Shared write boundary](#shared-write-boundary)
  - [Token DB history](#token-db-history)
  - [Propagation](#propagation)
  - [Reading the interop transfer table](#reading-the-interop-transfer-table)
  - [CoinGecko: never called from `plan`](#coingecko-never-called-from-plan)
  - [Address normalization](#address-normalization)
  - [What runs where](#what-runs-where)
  - [What this replaces](#what-this-replaces)
  - [Future: persistent trace audit](#future-persistent-trace-audit)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Automatic Token Ingestion

This document describes how TokenDB is kept in sync automatically: how new
deployed tokens are added, how they are linked to abstract tokens, and how
conflicts and errors surface to humans.

## Overview

A background loop in the token-backend service ticks every minute. Each tick
does two things in order:

1. **Pre-step.** Scan the interop transfer table for transfers inserted
   since the previous tick and enqueue both token addresses from each
   transfer.
2. **Drain.** Repeatedly take the next pending queue entry and process it
   until the queue is empty.

That's the entire shape. Everything else is a detail of how a single entry
gets processed.

## The only input is an address

The unit of work is a **token address** — the pair `(chain, address)`. Not
a transfer, not a CoinGecko id, not a manual form submission. Whenever any
part of the system wants the ingestion process to reconsider a token, it
calls `enqueue(address)`, which means exactly:

> There is potentially new knowledge about this address. Please reprocess
> it.

The address might be brand new, already in TokenDB, or already have an
abstract token. The queue does not pre-judge — it lets the processing
logic figure out what, if anything, needs to change.

This framing is load-bearing: every external trigger collapses into the
same act (enqueue). Conflicts in already-resolved tokens, propagation
between linked tokens, manual retries — all of them work because the
processor is one piece of code exercised by every trigger.

## Queue states

The queue holds at most one row per `(chain, address)`. States:

- **pending** — approved for processing; the drain loop only takes these.
- **staged** — discovered by the pre-step but not yet approved. The
  automatic drain ignores these. A human can promote one to `pending` from
  the UI. Used only during rollout (see *Approval mode*).
- **conflict** — disagreement was detected; left for a human to resolve.
- **error** — processing tried but could not fetch required data (e.g.
  `symbol`, `decimals`, `deploymentTimestamp`). Left for a human.

Enqueueing an address that is already queued in any state is a no-op —
`conflict` and `error` are sticky until a human clears them. There is no
"could not resolve" state: if a tick cannot find an abstract token for an
address, the entry is simply removed. New knowledge later may re-enqueue
it and we try again from scratch.

## Approval mode

For production rollout the pre-step can be configured to enqueue
discovered addresses as `staged` instead of `pending`
(`TOKEN_INGESTION_REQUIRE_APPROVAL=true`). A researcher inspects each one
and approves it from the queue UI. Long-term, with this toggle off, the
loop is fully autonomous and the UI focuses on `conflict` / `error`.

## Processing one entry: plan + fetch + apply

The processor splits each tick into three phases:

1. **`plan(entry)`** — fast and local. Looks at TokenDB, walks the
   in-memory interop transfer index, and consults the in-memory CoinGecko
   coin map. **No external calls**: no RPC, no explorer, and no per-coin
   CoinGecko endpoints (`getCoinDataById` / `getCoinMarketChartRange`).
   Produces an **`IngestionTrace`**: an ordered list of decision `steps`
   plus a single `outcome`. When the outcome can't be made terminal
   without an external call — either we'd insert a new token (needs RPC
   facts) or we'd materialize a new abstract from a CoinGecko coin we
   haven't seen before (needs CoinGecko per-coin endpoints) — the
   outcome is `pending`, which carries the operation (`insert` or
   `update`) and the abstract intent (`existing` id, or `new-coingecko`
   with just the coin id and symbol).
2. **`fetch(trace)`** — the only place external calls happen.
   Pass-through for every outcome except `pending`. For `pending`,
   `fetch` materializes the new abstract record (when needed) via
   CoinGecko, then — for `operation: insert` — calls the RPC/explorer
   fact fetcher. It either upgrades the outcome to `write` (with a full
   deployed-token record), downgrades it to `conflict` when a newly
   materialized CoinGecko abstract has a different symbol than the deployed
   token, or downgrades it to `error` when required facts are missing.
3. **`apply(entry, trace)`** — writes only. Switches on the final
   outcome and does the corresponding TokenDB and queue mutations. Throws
   if it ever sees `pending` (a sign `fetch` was skipped). For the
   `write` outcome, `apply` translates the trace into `Command[]` and
   funnels them through the shared
   [`commitTokenChanges`](../../../../../packages/token-backend/src/commitTokenChanges.ts)
   write boundary, which is the same primitive that the user-driven
   `intent → plan → execute` pipeline uses. See *Shared write boundary*
   below.

`process(entry)` is the 4-line composition: `plan` then `fetch` then
`apply`.

The split is the entire shape of the implementation. It exists because:

- **Fast queue-wide prediction.** Because `plan` is RPC-free, the queue
  page can run it for every row on the visible page (inline inside
  `getPage`) to populate a "Will do" column without paying RPC cost.
- **Dry-run for free.** Calling `plan()` + `fetch()` alone produces a
  full trace without touching the database. The queue page exposes a
  "Preview" button on every row that does exactly this.
- **The trace is its own audit log.** Steps describe *why* a particular
  abstract token was chosen, which transfer evidence was used, whether
  CoinGecko hit, which facts were fetched, and what warnings arose. The
  outcome describes *what* would change. No separate logger threading
  through RPC/CoinGecko/explorer calls is needed.
- **No `dryRun: boolean` flag.** The phase boundaries are the toggles.

The trace and outcome shapes are defined in
[`packages/token-backend/src/ingestion/IngestionTrace.ts`](../../../../../packages/token-backend/src/ingestion/IngestionTrace.ts).
That file is the canonical reference for what a trace contains — keep it
small and readable.

## Abstract token resolution

Inside `plan()`, the abstract token for an address is resolved in three
strategies, tried in order:

1. **Non-swapping transfers.** For every transfer involving this address
   where the bridge type is `lockAndMint` or `burnAndMint`, look up the
   other side in TokenDB and collect its `abstractTokenId`. If there's
   exactly one unique id, use it. If there are several, the outcome is
   `conflict`. Swap-based bridges are ignored here because the two sides
   are not the same asset. If the stored abstract on the existing
   deployed token disagrees with what transfers say, also `conflict`.
2. **The token's existing abstract.** If the deployed token already exists
   in TokenDB and has an abstract assigned, reuse it.
3. **CoinGecko platform lookup.** Search CoinGecko's coin list for a coin
   that lists this `(chain, address)` as a platform address. If found and
   we already have an `AbstractToken` with that `coingeckoId`, reuse it.
   Otherwise build a new `AbstractToken` (with `reviewed: false`) from the
   coin's data, but only commit the new abstract/deployed-token assignment
   if the deployed token symbol matches the new abstract token symbol. Since
   inserts learn the deployed token symbol from RPC/explorer facts, this
   mismatch check happens in `fetch`; a mismatch becomes `conflict`, while
   a missing deployed token symbol remains an `error`.

If none of the three resolves anything, the outcome is `skip` and the
entry is removed. RPC/explorer fact fetching only runs in the `fetch`
phase, and only for `pending-insert` outcomes — there's no point
fetching `decimals` for an address we're going to drop or for one whose
existing record only needs its abstract pointer updated.

## Outcomes

`plan` produces one of: `skip`, `conflict`, `noop`, `write` (update
with an already-existing abstract), or `pending`. `fetch` either passes
the outcome through or converts `pending` into `write` (insert or
update, possibly with a newly built CoinGecko abstract), `conflict`
(new CoinGecko abstract symbol differs from deployed token symbol), or `error`.
`apply` only ever sees the five terminal outcome kinds:

- **`skip`** — no abstract resolvable, or address could not be normalized.
  `apply` removes the queue entry. No write.
- **`conflict`** — disagreement detected. `apply` moves the entry to the
  `conflict` state with a message.
- **`error`** — abstract resolved but the deployed-token facts are
  incomplete (missing `symbol`, `decimals`, or `deploymentTimestamp`).
  `apply` moves the entry to `error` with a message.
- **`noop`** — token already exists with the resolved abstract; nothing to
  write. `apply` marks related interop transfers as unprocessed (so
  downstream re-derivation can re-run) and removes the queue entry.
- **`write`** — `apply` inserts/updates the deployed token and, if
  needed, inserts a new abstract token in the same transaction. It then
  re-enqueues every neighbor token from the address's transfers
  (propagation), marks related interop transfers as unprocessed, and
  removes the queue entry.

## Shared write boundary

Both this pipeline and the user-driven `intent → plan → execute` pipeline
ultimately write to the same two TokenDB tables (`AbstractToken` and
`DeployedToken`). To make sure both paths produce the same writes — and so
that future cross-cutting concerns like a persistent history table land
in exactly one place — they share a single primitive,
[`commitTokenChanges`](../../../../../packages/token-backend/src/commitTokenChanges.ts),
that takes a list of `Command`s and dispatches each to the matching
repository method.

`commitTokenChanges` is a pure router: every command arrives with whatever
fields it needs already populated, including any abstract-token
assignment proof. Each pipeline decides the proof at plan time:

- The user planner sets `abstractTokenAssignmentProof: { kind: 'manual',
  user: <email> }` on any `AddDeployedTokenCommand` /
  `UpdateDeployedTokenCommand` that introduces or changes
  `abstractTokenId`, and `null` when the assignment is cleared.
- The ingestion planner sets the proof returned by abstract-token
  resolution (`{ kind: 'coingecko' }` or `{ kind: 'non-swapping-transfer',
  transfer }`) onto the deployed-token write produced by the same plan
  step. For `pending` outcomes the proof is held on the pending variant
  and transferred onto the deployed-token write by `fetch`.

The plan-time stamp means the proof shows up in the diff the user sees
*before* clicking Confirm in the UI, and in the ingestion preview dialog
that renders predicted outcomes from the queue.

The proof is persisted on the `DeployedToken.abstractTokenAssignmentProof`
JSON column. Commands that don't touch the assignment leave the column
alone. Setting `abstractTokenId` to `null` clears the proof.

`AbstractTokenAssignmentProof` today is one of:

- `{ kind: 'manual'; user }` — written by user-driven plans. `user` is
  the email of whoever was logged in when the plan was confirmed.
- `{ kind: 'coingecko' }` — ingestion resolved the abstract from
  CoinGecko's platform lookup. The CoinGecko id is already on the
  abstract token itself, so the proof carries no extra data.
- `{ kind: 'non-swapping-transfer'; transfer }` — ingestion resolved
  from non-swapping transfer evidence. The proof carries the *full*
  transfer row, not just an id, because the interop transfer table is a
  sliding 24h window — by the time someone reviews the assignment, the
  row may already be gone. Because the proof is stored as JSON, BigInt
  raw amounts in that transfer are persisted as decimal strings.

The column itself is typed as JSON (`unknown`) at the repository layer
so old proofs continue to read even if the typed shape evolves; the
strong `AbstractTokenAssignmentProof` type is only used at plan time.

`commitTokenChanges` does not own its surrounding transaction — each
pipeline opens its own, because the user pipeline also needs to re-plan
inside that transaction while ingestion does not. The helper logs every
command it executes and records one row per executed command in the
[`TokenDbHistoryEntry`](#token-db-history) table, so the audit trail
covers both pipelines uniformly.

## Token DB history

Every executed command is recorded in `TokenDbHistoryEntry`. The shape is
deliberately small:

- `timestamp` — when the command was applied.
- `source` — `'manual'` (user-driven plan) or `'ingestion'`.
- `userEmail` — set when `source = 'manual'`, otherwise `null`.
- `commandType` — the `Command.type` literal (e.g.
  `AddDeployedTokenCommand`), denormalized off the JSON for indexed
  filtering.
- `command` — the executed `Command` stored verbatim as JSON.

The `Command` already carries everything an audit reader needs: `Add*`
commands hold the `record` being inserted, `Update*` commands hold both
`existing` (the row as planned against) and `update` (the patch), and
`Delete*` commands hold `existing` (the row about to be deleted). So
history needs no separate "before" / "after" columns — `command` is the
audit row. Re-rendering an `Update*` row as a diff is `{ existing, update
}`; an `Add*` row is `record`; a `Delete*` row is `existing` with a
deletion marker. `DeleteAll*` commands carry only `type` and are stored
as-is.

`source` is supplied as a third argument to `commitTokenChanges`. The
user-driven `executePlan` / `planAndExecute` pass
`{ kind: 'manual', user }` (the email is already required for proof
stamping); ingestion passes `{ kind: 'ingestion' }`. The proofs introduced
in the previous slice continue to ride on individual commands and are
captured inside `command` — so anyone reading history sees both *what*
changed and *why* the abstract assignment was chosen.

## Propagation

After a successful `write`, the processor re-enqueues the *other* side of
every transfer involving the just-written address. This is how the queue
drains the dependency graph: if A↔B started with both unknown, processing
B (via CoinGecko) writes B, propagation re-enqueues A, and the next
iteration resolves A from non-swapping transfer evidence (B is now in
TokenDB). `noop` outcomes do **not** propagate — that would cause
ping-pong cycles between two stable tokens.

## Reading the interop transfer table

For each tick, the drain loads the full interop transfer table once and
builds an in-memory index keyed by normalized `(chain, address)`. Each
processed entry looks up its own transfers from this index — no per-entry
DB queries for transfers. This is cheap because the interop table only
retains the last ~24 hours.

The pre-step uses a separate insertion-order cursor
(`interop-transfers:lastSerialId`, stored in `TokenDbSetting`) to find
transfers added since the previous tick.

## CoinGecko: never called from `plan`

CoinGecko calls cost money and are rate-limited. The processor builds a
chain-keyed map of all coin platforms once (per processor instance) and
looks up addresses in-memory after that. For new abstract tokens,
`getCoinDataById` and the listing-timestamp lookup are deferred to the
`fetch` phase — they are never called from `plan`, so populating the
queue page's "Will do" column for hundreds of rows costs zero per-coin
CoinGecko calls.

The processor instance is hoisted to server startup so it lives for the
whole server lifetime — that is, the coin map cache spans the whole
session, not just one tick. The CoinGecko client itself does not cache;
caching is the processor's concern.

There is no "we tried this address and dropped it" record. A dropped
address simply disappears from the queue. If audit history is needed
later, the natural place to store it is alongside the deployed token
itself — see *Future: persistent audit*.

## Address normalization

Interop transfer tokens are stored as bytes32; TokenDB stores 20-byte
EVM addresses. Normalization:

- Lowercases everything.
- Cuts bytes32 → 20-byte for EVM addresses.
- Treats `0x` and `Address32.ZERO` as "no address" — these get dropped
  before entering the queue.
- Keeps non-`0x` literal addresses (e.g. `"native"`) as-is for non-EVM
  chains.

## What runs where

- Pre-step: reads from the interop database (`db`).
- Drain: reads from both `db` (interop transfers) and `tokenDb` (TokenDB
  state, queue, settings). Writes go to `tokenDb` (and back to `db` for
  the unprocessed-marker).
- Preview: `plan` + `fetch`, called from the `tokenIngestionQueue.preview`
  tRPC route. Builds the transfer index on demand.
- Queue page predicted outcomes: `plan` only, called once per row from
  inside the `tokenIngestionQueue.getPage` tRPC route. Reuses a single
  transfer index built for the request.

## What this replaces

The two cards on the legacy Token UI suggestions page. Manual entry via
the form and the BackOffice missing-tokens action column remain
untouched, mostly to limit the amount of work necessary to implement
automatic ingestion. In the future they will be slimmed down where
they overlap with automatic ingestion process.

## Future: persistent trace audit

`TokenDbHistoryEntry` already gives a per-command audit trail of *what*
changed and *who* changed it. The next step, if needed, is persisting the
full `IngestionTrace` next to write events so the *reasoning* (every
decision step) is queryable too — useful when a researcher wants to
understand why a particular abstract was chosen long after the interop
transfer that justified it has rolled out of the 24h window. The trace
already exists at `apply` time, so this is a low-cost follow-up.
