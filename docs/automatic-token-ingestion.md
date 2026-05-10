# Automatic Token Ingestion

This document describes a process for automatically ingesting and updating
tokens in TokenDB. The goal is **simplicity**: a small number of reusable
building blocks, composed into a loop that's easy to read, modify, and (if
ever needed) lift out of the package. There are surely places to optimize
further; we're choosing clarity first, and the few primitives we introduce
recur throughout the design rather than each scenario growing its own.

## Convention

Throughout this document, **address** means a chain-specific address — the
pair `(chain, address)`. We don't spell out "chain and address" every time.

## The process

A cron job runs every minute. Each run picks up any new knowledge that has
accumulated since the previous run, and uses it to ingest new tokens or
update existing ones in TokenDB. That's the whole thing.

## The only input is an address

The unit of work is a **token address**. Not a transfer. Not a CoinGecko id.
Just an address that, for whatever reason, we'd like the process to
re-examine. Everything is built around this single input.

The system has one queue (eventually a database table) holding addresses
that are waiting to be processed. When we say *enqueue an address*, we mean
exactly one thing:

> *There is potentially new knowledge about this address. Please reprocess
> it.*

That's the entire semantic. The address might be brand new; it might
already be in TokenDB; it might already have an `abstractTokenId`. We don't
pre-judge — we put it on the queue and let the processing logic figure out
what, if anything, needs to change.

This framing is the load-bearing piece of the design. Every external
trigger — a new transfer, a manual entry, a CoinGecko platform-diff —
collapses into the same act: enqueue some addresses. The processing logic
is one piece of code, exercised by every trigger.

## Queue states

Just two:

- **pending** — needs processing.
- **conflicted** — disagreement was detected; left for a human to resolve.
  The automatic loop never touches a conflicted entry.

There is no "we couldn't resolve this" state. If a tick can't resolve an
address, the entry is removed from the queue. If new knowledge later makes
it resolvable, something will re-enqueue it and we'll try again from
scratch. The queue holds only items that are actively waiting on us.

The queue holds at most one entry per address. Enqueueing an address that
is already pending is a no-op. Enqueueing an address that is conflicted is
also a no-op — conflicts are sticky until a human clears them.

## Building blocks

- **`enqueue(address)`** — add as pending if not already in the queue.
- **`findTransfersInvolving(address)`** — every transfer in the interop
  table that has this address on either side. We do not bother with a
  "since last time" cursor here: the interop table only retains the last
  ~24 hours of transfers, so iterating all of them per address is cheap.
- **`findNewTransfersSinceLastCheck()`** — transfers indexed since the
  previous tick. Used only by the pre-step that feeds the queue.

The last two read interop tables directly (same database), behind a thin
repository interface so this dependency stays in one file and is easy to
swap out later.

## The loop

```
tick():                                       # runs every minute
  # 1. Pre-step: feed the queue with new knowledge.
  for t in findNewTransfersSinceLastCheck():
    enqueue(t.source)
    enqueue(t.target)
  recordLastCheck()

  # 2. Drain.
  while queue has any pending entry:
    address = takeNextPending()
    process(address)
```

The pre-step is intentionally dumb. It does no checks, no joins, no
TokenDB lookups. A new transfer is the only signal that knowledge about
the two tokens involved might have changed; we enqueue both sides
unconditionally and let the drain decide what — if anything — to do.

```
process(address):
  existing  = TokenDB.get(address)
  transfers = findTransfersInvolving(address)

  # Path A: derive an abstract token from the transfers themselves.
  abstractFromTransfers = null
  for t in transfers where isAbstractPreserving(t):
    other = TokenDB.get(t.otherSide(address))
    if other == null or other.abstractTokenId == null: continue
    if abstractFromTransfers != null and abstractFromTransfers != other.abstractTokenId:
      markConflict(address, "transfers disagree about abstract token"); return
    abstractFromTransfers = other.abstractTokenId

  # Conflict between transfers and what we already have stored.
  if existing?.abstractTokenId and abstractFromTransfers
     and existing.abstractTokenId != abstractFromTransfers:
    markConflict(address, "transfer disagrees with stored abstract token"); return

  abstractTokenId = abstractFromTransfers ?? existing?.abstractTokenId

  # Path B: fall back to CoinGecko only if Path A produced nothing.
  if abstractTokenId == null:
    cg = coingecko.lookupByPlatform(address)        # cached; see below
    if cg != null:
      abstractTokenId = findAbstractByCoingeckoId(cg) ?? createAbstractToken(cg)

  if abstractTokenId == null:
    queue.remove(address); return                   # nothing we can do now

  # Only fetch RPC/explorer data once we know we'll use it.
  data = fetchDeployedTokenData(address)
  if data.incomplete:
    queue.remove(address); return                   # see open questions

  upsertDeployedToken(address, data, abstractTokenId)
  queue.remove(address)

  # Propagate: a successful write may unlock neighbors that we couldn't
  # resolve before. We re-enqueue the other side of every transfer
  # involving this address — it's the same enqueue primitive, used
  # recursively to drain the graph.
  for t in transfers:
    enqueue(t.otherSide(address))
```

`isAbstractPreserving(t)` is what we used to call "non-swapping" — it's
true for lock&mint and burn&mint transfers (the underlying asset is
preserved across the bridge), false for swap-based bridges. We rename it
because the predicate is really about preservation of the abstract token,
not about the absence of a swap.

## Why this handles the tricky cases for free

**Interconnected transfers (A↔B, neither known yet).** A new transfer
between two unknown addresses enqueues both. The drain processes A first:
Path A finds nothing (B is not in TokenDB), Path B (CoinGecko) might fail
too — A is removed. Then it processes B: CoinGecko hits, B is written, and
**the propagate step at the bottom of `process` re-enqueues A**. A is
processed again; this time Path A finds B and resolves to the same
abstract token. The loop drains itself, using the same `enqueue` primitive
for both external triggers and internal propagation.

**Conflicts in already-resolved tokens.** Every new transfer enqueues
both of its sides — even if both sides are already in TokenDB with
abstract tokens assigned. Processing an already-resolved address still
walks its transfers and runs the same conflict checks. So if a new
abstract-preserving transfer appears between two existing tokens whose
stored abstracts disagree, it gets caught the same way as a conflict
during fresh ingestion. There is no separate code path for
"audit existing entries" — it falls out of the universal "enqueue both
sides of every new transfer" rule.

**Manual entry / missing-tokens / CoinGecko platform-diff.** All collapse
into the same act: `enqueue(address)`. The drain doesn't care where the
address came from.

## CoinGecko: queried at most once per address

CoinGecko calls cost money. A separate caching layer inside the CoinGecko
client records, per address, whether we've already queried and what the
result was (a coin id, or "no match"). Subsequent calls return from cache
without hitting the API.

This belongs to the CoinGecko client, not to the ingestion queue. Keeping
these responsibilities apart is part of why the queue can stay simple —
two states is enough; we don't need a "CoinGecko already checked" state on
the queue itself.

For v1, "queried once, ever" is enough. A future version may add a TTL
(re-query after a week, a month, ...) without any change to the queue
logic.

We accept one small loss in this trade: we no longer have a list of
"addresses we tried to ingest and dropped". A token that was rejected
because nothing knew about it just disappears from the queue. If we ever
need that audit trail it can be added as a separate table that the
CoinGecko client (or `process`) writes to; the queue does not need to
carry it.

## What this replaces

- The two cards on the Token UI suggestions page
  (`packages/token-ui/src/pages/tokens/TokenSuggestionsPage.tsx`).
- The BackOffice missing-tokens action column
  (`packages/backoffice/src/pages/interop/missing-tokens/`).
- The interactive form's autofill — the same fact-fetching code is reused;
  the form remains as the manual entry path.

In place of all three: one ingestion process, one queue, one UI listing
the queue's contents.

## Slicing

Lock the architecture above before writing code. Then ship one slice at a
time.

1. **Slice 1 — Path B only, where the AbstractToken already exists by
   `coingeckoId`.** Zero AbstractToken creation. Conflicts limited to
   "address already exists". Safest pipeline-validation work.
2. **Slice 2 — Path A.** Reuses today's `getSuggestionsByPartialTransfers`
   heuristic.
3. **Slice 3 — Auto-creation of new AbstractTokens via Path B.** Requires
   the `reviewed: false` policy.
4. **Slice 4 — Native tokens; conflict resolution UX.**

Each slice expands the policy of the same `process` function. None of
them changes the architecture.

## Open questions

- `reviewed: false` default for auto-created `AbstractToken` (current form
  default is `true`).
- Block on missing `deploymentTimestamp` in v1, or allow `null`?
- Backfill `coingeckoId` on an existing AbstractToken when Path A
  resolves and CoinGecko knows the coin?
- Native tokens — they have no contract code and no CoinGecko platform
  address; they need a separate metadata source.
- Conflict UX — how a researcher resolves a conflicted entry. Designed
  once both Path A and Path B run automatically.
