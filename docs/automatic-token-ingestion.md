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

The normal automatic flow uses:

- **pending** — approved for processing. The drain loop consumes only this
  state.
- **conflict** — disagreement was detected; left for a human to resolve.
  The automatic loop never touches a conflicted entry.
- **error** — the processor tried to ingest the address but could not fetch
  required data, such as `symbol`, `decimals`, or `deploymentTimestamp`.
  This is also left for a human to inspect and retry.

During rollout we also want one debug-only state:

- **staged** — discovered by the pre-step, visible in the UI, but not yet
  approved for processing. A human can inspect the address and approve it,
  which moves it to `pending`. The automatic drain does not touch staged
  entries.

There is still no "we couldn't resolve this" state. If a tick cannot find
an abstract token for an address, the entry is removed from the queue. If
new knowledge later makes it resolvable, something will re-enqueue it and
we'll try again from scratch. The queue holds only items that are actively
waiting on us.

The queue holds at most one entry per address. Enqueueing an address that
is already queued is a no-op. Enqueueing an address that is conflicted or
errored is also a no-op — those states are sticky until a human clears
them.

## Debug approval mode

For the first production rollout, the pre-step should be able to enqueue
newly discovered addresses as `staged` instead of `pending`. This makes the
automation observable before it is fully autonomous:

1. Every minute, the pre-step finds new interop transfer addresses and adds
   them to the queue as `staged`.
2. The UI shows staged entries alongside conflicts and errors.
3. A researcher inspects one address and clicks **Approve**.
4. Approval moves that entry from `staged` to `pending`.
5. On the next tick, the drain loop processes that one approved entry.

This mode is only a rollout/debugging aid. The long-term fully automatic
mode should enqueue new addresses directly as `pending`, and the UI should
usually focus on `conflict` and `error` entries.

Implementation toggle: `TOKEN_INGESTION_REQUIRE_APPROVAL=true`.

## Building blocks

- **`enqueue(address)`** — add as pending if not already in the queue. In
  debug approval mode, this adds as staged instead.
- **`approve(address)`** — move a staged entry to pending. Used only while
  debug approval mode is enabled.
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

When debug approval mode is enabled, the same pre-step writes `staged`
entries. The rest of the loop remains unchanged because the drain only
selects `pending` entries.

```
process(address):
  existing  = TokenDB.get(address)
  transfers = findTransfersInvolving(address)

  # First try to derive an abstract token from non-swapping transfers.
  abstractFromTransfers = null
  for t in transfers where isNonSwapping(t):
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

  # Fall back to CoinGecko only if transfers produced nothing.
  if abstractTokenId == null:
    cg = coingecko.lookupByPlatform(address)        # cached; see below
    if cg != null:
      abstractTokenId = findAbstractByCoingeckoId(cg) ?? createAbstractToken(cg)

  if abstractTokenId == null:
    queue.remove(address); return                   # nothing we can do now

  # Only fetch RPC/explorer data once we know we'll use it.
  data = fetchDeployedTokenData(address)
  if data.incomplete:
    markError(address, "missing required deployed-token data"); return

  upsertDeployedToken(address, data, abstractTokenId)
  queue.remove(address)

  # Propagate: a successful write may unlock neighbors that we couldn't
  # resolve before. We re-enqueue the other side of every transfer
  # involving this address — it's the same enqueue primitive, used
  # recursively to drain the graph.
  for t in transfers:
    enqueue(t.otherSide(address))
```

`isNonSwapping(t)` is true for lock&mint and burn&mint transfers, and
false for swap-based bridges. In these transfers the same abstract asset
is expected on both sides, so the other side can provide evidence for the
address being processed.

## Why this handles the tricky cases for free

**Interconnected transfers (A↔B, neither known yet).** A new transfer
between two unknown addresses enqueues both. The drain processes A first:
the transfer-based check finds nothing (B is not in TokenDB), CoinGecko
might fail too — A is removed. Then it processes B: CoinGecko hits, B is
written, and **the propagate step at the bottom of `process` re-enqueues
A**. A is processed again; this time the transfer-based check finds B and
resolves to the same abstract token. The loop drains itself, using the
same `enqueue` primitive for both external triggers and internal
propagation.

**Conflicts in already-resolved tokens.** Every new transfer enqueues
both of its sides — even if both sides are already in TokenDB with
abstract tokens assigned. Processing an already-resolved address still
walks its transfers and runs the same conflict checks. So if a new
non-swapping transfer appears between two existing tokens whose
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
these responsibilities apart is part of why the queue can stay simple: we
don't need a "CoinGecko already checked" state on the queue itself.

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

## What should be left untouchaed

- The BackOffice missing-tokens action column
  (`packages/backoffice/src/pages/interop/missing-tokens/`).
- The interactive form's autofill — the same fact-fetching code is reused;
  the form remains as the manual entry path.

Both can for now work as before, there's no need to change them as part of this
work.

## Open questions

- `reviewed: false` default for auto-created `AbstractToken` (current form
  default is `true`).
- Block on missing `deploymentTimestamp` in v1, or allow `null`?
- Backfill `coingeckoId` on an existing AbstractToken when transfer-based
  resolution succeeds and CoinGecko knows the coin?
- Native tokens — they have no contract code and no CoinGecko platform
  address; they need a separate metadata source.
- Conflict UX — how a researcher resolves a conflicted entry.
- Debug approval UX — staged entries need an approve action that moves one
  address to `pending`, plus normal retry actions for `conflict` and
  `error`.
