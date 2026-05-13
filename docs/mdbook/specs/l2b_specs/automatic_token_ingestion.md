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

## Processing one entry: plan + apply

The processor splits each tick into two phases:

1. **`plan(entry)`** — read-only. Looks at TokenDB, walks the interop
   transfer index, optionally calls CoinGecko and the RPC/explorer fact
   fetcher. Produces an **`IngestionTrace`**: an ordered list of decision
   `steps` plus a single `outcome`.
2. **`apply(entry, trace)`** — writes only. Switches on the outcome and
   does the corresponding TokenDB and queue mutations.

`process(entry)` is the 3-line composition: `plan` then `apply`.

The split is the entire shape of the implementation. It exists because:

- **Dry-run for free.** Calling `plan()` alone produces a full trace
  without touching the database. The queue page exposes a "Preview" button
  on every row that does exactly this.
- **The trace is its own audit log.** Steps describe *why* a particular
  abstract token was chosen, which transfer evidence was used, whether
  CoinGecko hit, which facts were fetched, and what warnings arose. The
  outcome describes *what* would change. No separate logger threading
  through RPC/CoinGecko/explorer calls is needed.
- **No `dryRun: boolean` flag.** The phase boundary is the toggle.

The trace and outcome shapes are defined in
[`packages/token-backend/src/ingestion/IngestionTrace.ts`](../../../../packages/token-backend/src/ingestion/IngestionTrace.ts).
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
   coin's data.

If none of the three resolves anything, the outcome is `skip` and the
entry is removed. RPC/explorer fact fetching only runs *after* an abstract
has been resolved — there's no point fetching `decimals` for an address
we're going to drop.

## Outcomes

The five outcome kinds are:

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

## CoinGecko: queried at most once per address

CoinGecko calls cost money. The processor builds a chain-keyed map of all
coin platforms once (per processor instance) and looks up addresses
in-memory after that. For new abstract tokens, `getCoinDataById` and the
listing-timestamp lookup are called once at creation.

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
- Preview: same as plan(), called from the `tokenIngestionQueue.preview`
  tRPC route. Builds the transfer index on demand.

## What this replaces

The two cards on the legacy Token UI suggestions page. Manual entry via
the form and the BackOffice missing-tokens action column remain
untouched, mostly to limit the amount of work necessary to implement
automatic ingestion. In the future they will be slimmed down where
they overlap with automatic ingestion process.

## Future: persistent audit

The plan/apply split makes it trivial to persist traces. When `apply`
performs a `write`, it already holds the full `IngestionTrace`. Storing
it next to the deployed/abstract token (separate table or a JSON column)
gives a permanent answer to "why does this token have this abstract
assigned?". This is not currently implemented.
