<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Token Relations](#token-relations)
  - [Observations, not catalogue entries](#observations-not-catalogue-entries)
  - [The table](#the-table)
  - [How relations are ingested](#how-relations-are-ingested)
  - [Why this is NOT part of the token ingestion queue](#why-this-is-not-part-of-the-token-ingestion-queue)
  - [Why the burn/mint flags are NOT columns](#why-the-burnmint-flags-are-not-columns)
  - [Why there are NO foreign keys to DeployedToken](#why-there-are-no-foreign-keys-to-deployedtoken)
  - [Deleting a deployed token leaves its relations in place](#deleting-a-deployed-token-leaves-its-relations-in-place)
  - [Display implications](#display-implications)
  - [Relations graph](#relations-graph)
  - [Human edits](#human-edits)
  - [Known limitations](#known-limitations)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Token Relations

A **token relation** records that we witnessed a *non-swapping* interop
transfer between two token addresses: the same abstract asset left one
chain as `tokenFrom` and arrived on another chain as `tokenTo`, via a
specific plugin, classified as a specific non-swapping `bridgeType`.
Relations are the raw material for reasoning about which deployed tokens
represent the same asset — including, crucially, for spotting places where
our current abstract-token assignments are *wrong*.

## Observations, not catalogue entries

This is the single mental model that explains every design decision below:

> **A token relation is an observation; the token catalogue is an
> interpretation.**

A relation says "this transfer happened on-chain". That is a fact,
true regardless of whether we have catalogued either address as a
`DeployedToken`, and true *especially* when our abstract-token assignments
disagree with it. A token-ingestion **conflict** is precisely the situation
where our interpretation (two different abstract tokens) disagrees with the
observations (non-swapping transfers between them). The whole point of
collecting relations is to surface those disagreements — for example as a
graph where an edge between tokens of different abstract tokens is drawn
red, telling a human "these abstract tokens should probably be merged"
(see [abstract token merging](./abstract_token_merging.md)).

It follows that observation recording must never be gated on the
interpretation being consistent. Any design where a token-level conflict
can suppress a relation destroys the primary use of relations.

## The table

`TokenRelation` is keyed by the full route identity:

```
(tokenFromChain, tokenFromAddress, tokenToChain, tokenToAddress,
 plugin, bridgeType)
```

plus a `transfer` JSON column holding one full sample interop transfer as
evidence. `bridgeType` is `NOT NULL` — a relation only exists for
non-swapping types, so every row has one. The evidence is embedded (not
referenced by id) because the interop transfer table is a sliding ~7-day
window — the same reasoning as the `non-swapping-transfer` assignment
proof on `DeployedToken`. The observed burn/mint flags are deliberately
*not* columns (see below); they live inside the evidence JSON. Addresses
are stored normalized (lowercase, `Address32` cropped to Ethereum
addresses, same normalization as token ingestion).

The table size is bounded by the number of distinct bridged routes, not by
transfer volume.

## How relations are ingested

`TokenRelationIngestion`
([`TokenRelationIngestion.ts`](../../../../../packages/token-backend/src/ingestion/TokenRelationIngestion.ts))
runs as the first step of the same one-minute background loop that drives
[automatic token ingestion](./automatic_token_ingestion.md). The steps run
sequentially — never in parallel — so failures and logs are attributable
to a single step. The order (relations before the queue drain) is not a
correctness requirement, since relations do not depend on the token
catalogue at all; relations simply go first because the step is fast and
bounded while the drain can run long.

The algorithm is deliberately trivial:

1. Read the cursor (`token-relations:lastSerialId` in `TokenDbSettings`) —
   a separate cursor from the queue pre-step's
   `interop-transfers:lastSerialId`, so either step can fail without
   stalling the other.
2. Page through interop transfers with `serialId` greater than the cursor,
   in fixed-size batches, ordered by `serialId`. **Do not replace the
   paging with one big read**: loading full rows for all retained
   transfers has caused out-of-memory crashes before.
3. For each transfer: normalize both token addresses (skip if either side
   has none), classify the bridge type (stored value, or inferred from the
   burn/mint flags), and keep only non-swapping types (`lockAndMint`,
   `burnAndMint`).
4. For each candidate route not already present in `TokenRelation`, commit
   an `AddTokenRelationCommand` through `commitTokenChanges` — the shared
   write boundary — so every relation insert lands in `TokenDbHistory`
   like every other TokenDB write.
5. Advance the cursor after each batch.

There is no staging, approval state, or conflict concept. Relations are
observations; there is nothing to approve, and the history table provides
the audit trail.

The insert is check-then-insert rather than an upsert so that it can go
through the write boundary. The race window is irrelevant: this loop is
the only automatic writer and runs serially; if a human inserts the same
relation in the same instant, the tick fails loudly and the next tick sees
the relation exists.

## Why this is NOT part of the token ingestion queue

An earlier version of this feature materialized relations *inside* the
token ingestion processor, as a side effect of processing a queue entry.
**Do not go back to that design.** It was removed for two reasons, and
both still apply:

1. **The queue's unit of work is the wrong shape.** A queue entry is a
   token *address* — "there is potentially new knowledge about this
   address, reprocess it". A relation is a property of a *transfer*
   (a route between two addresses). Deriving relations from an
   address-keyed queue meant every entry had to re-scan its transfer
   evidence, deduplicate candidate relations against both endpoints, and
   thread relation lists through every plan/fetch/apply outcome. It
   roughly doubled the processor's complexity for what is, standalone, a
   ~40-line loop over new transfers.
2. **Token-level conflicts must never suppress relation evidence.** In
   the embedded design, relations were only written when a queue entry
   reached a successful outcome. Entries that ended in `conflict` — which
   is *common* in production, and is exactly the situation relations are
   meant to diagnose — wrote nothing. The result observed in production:
   the relations most needed for merging wrongly-split abstract tokens
   were systematically the ones missing. That defeats the purpose of the
   table.

If some future requirement seems to demand coupling relation creation to
token ingestion again, re-read the observation/interpretation model above
first: the requirement is almost certainly about *interpreting* relations,
and belongs in a read path, not in ingestion.

## Why the burn/mint flags are NOT columns

An earlier version stored `sourceWasBurned` and `destinationWasMinted` as
`NOT NULL` boolean columns, both part of the primary key. **This was a bug;
do not add them back as columns.**

The interop transfer table's `srcWasBurned` / `dstWasMinted` are
*nullable*. Null means "we did not observe this side" — routinely the case
for one-sided transfers, where only the source or only the destination
event was captured. In production, ~85% of stored-`lockAndMint` transfers
have at least one of these flags null. The old code coerced null to
`false` (`transfer.srcWasBurned ?? false`), which was wrong in three ways:

- **It fabricated observations.** `false` asserts "we saw that it was not
  burned". We saw no such thing. In a table whose entire justification is
  "relations are facts", inventing a fact is the cardinal sin.
- **It self-contradicted.** A stored-`lockAndMint` transfer with both flags
  null became a row with `bridgeType = lockAndMint` and flags
  `(false, false)` — flags the classifier itself reads as `nonMinting`.
- **It fragmented routes.** Because the flags were in the primary key, one
  real-world route observed once via a two-sided transfer and once via a
  one-sided one produced *two* rows, split by an artifact of which events
  happened to be indexed rather than by anything on-chain.

The fix: the flags are not relation columns at all. A relation's identity
is `(route, plugin, bridgeType)`, and `bridgeType` is the authoritative,
plugin-declared (or, absent that, inferred) classification of the bridge's
mechanism. The honestly-observed flags are not lost — they remain in the
`transfer` evidence JSON exactly as seen: present when observed, absent
when not. No tri-state column, nothing to fabricate, no route
fragmentation.

Note this means a stored `bridgeType` is trusted even when the flags are
unobserved — deliberately, and consistently with how the token ingestion
processor already trusts a stored `bridgeType` as `non-swapping-transfer`
assignment evidence. Demanding observed flags instead would drop the
~80k+ one-sided non-swapping transfers and recreate the very
"missing relations" problem this subsystem exists to fix.

## Why there are NO foreign keys to DeployedToken

`TokenRelation.tokenFrom*` / `tokenTo*` deliberately do **not** reference
`DeployedToken`. This is not an oversight — the constraints existed and
were removed. Do not "fix" the schema by adding them back without
re-reading this section.

- **Relations must be recordable before their endpoints are catalogued.**
  The typical case: a transfer reveals a brand-new token, but cataloguing
  it hits an ingestion conflict that takes a human days or weeks to
  resolve. The relation observation is valid the whole time. With
  enforced foreign keys it cannot be stored, and by the time the conflict
  is resolved the source transfers may have aged out of the 7-day
  retention window — the evidence is gone forever. Without the
  constraints, the edges are already sitting in the table when the token
  is finally added; the moment it appears, its graph neighborhood is
  complete. The alternative (skip un-insertable relations and re-scan
  history later) is confusing — a freshly resolved token would appear
  with zero edges despite transfers having driven its creation — and
  fixing that requires a deferred-relations side table or periodic
  re-scans: real machinery to reproduce what "no constraint" gives for
  free.
- **Postgres has no partial foreign key.** A foreign key on non-nullable
  columns strictly requires the referenced row to exist at insert time
  (`NOT VALID` only skips validating pre-existing rows). The choice is
  binary: either the constraint blocks relations for unknown tokens, or
  there is no constraint.
- **The constraints provided no query capability.** All queries are
  handwritten Kysely joining on `(chain, address)`; the two endpoint
  indexes serve them. Prisma relation fields were only used for
  migrations, not queries.

What is given up, honestly:

- No database-level guarantee that a relation's endpoints exist as
  deployed tokens. Endpoint existence is resolved at read time (see
  below).
- No `RESTRICT` protection when deleting a deployed token — which is
  actually the semantics we want (next section).
- A garbage address in a transfer would be persisted. Mitigated by the
  same address normalization token ingestion uses, and bounded by the
  primary key (one row per route).

## Deleting a deployed token leaves its relations in place

Deleting a `DeployedToken` does not delete relations that mention its
address (the user planner used to cascade-delete them when the foreign
keys demanded it; it no longer does). The transfers still happened —
deleting the catalogue entry does not un-happen them. The relation simply
degrades to mentioning an uncatalogued address, and if the token is ever
re-added its edges are intact. Bogus relations can still be deleted
individually via the relation delete intent.

## Display implications

Because endpoints may be uncatalogued, read paths that show relations
resolve endpoints against `DeployedToken` at query time and must tolerate
a miss. The deployed-token `getRelations` endpoint returns
`otherToken: null` for unknown endpoints and the UI renders the raw
address instead of a token link.

The deployed-token set is small enough to resolve in memory; this small
read-time cost is the entire price paid for the foreign-key decision above.

## Relations graph

The graph page in token-ui is a view of the relation observations resolved
against the current token catalogue. Every observed `(chain, address)`
endpoint is a node, including endpoints that do not yet have a
`DeployedToken` row. Catalogued nodes are green and labelled with their
deployed token symbol; uncatalogued nodes are orange and use a shortened
address as their label. A directed edge is an observed token relation:
burn-and-mint edges are blue and lock-and-mint edges are pink. Arrowheads
preserve the observed `tokenFrom` to `tokenTo` direction for both bridge
types. Nodes can be dragged and the canvas can be panned or zoomed.

Before drawing, the UI treats every connected component as a cluster and
sorts the clusters by endpoint count (largest first, with a stable id
tie-break). Each cluster gets its own force simulation, which is run to
completion in memory so clusters do not repel each other and users never see
the graph settle. The finished clusters are placed left-to-right in a
square-ish grid, starting at the top-left, then the whole grid is fitted into
the viewport. At low zoom levels each cluster is overlaid with its most common
catalogued deployed-token symbol. The overlay stays a constant screen size as
the graph scales, making cluster identities easier to scan when individual
node labels are too small.

Clicking a node keeps the node, its incoming/outgoing edges, and its neighbors
prominent while dimming the rest of the graph. A non-modal details panel loads
that one deployed token and its abstract token on demand; the initial graph
payload does not contain full token records. The panel also lists the incoming
and outgoing relations already present in the graph rather than issuing a
second database query for the neighborhood. Uncatalogued nodes show their raw
endpoint information instead of token details.

Edges are independently hoverable and clickable. Clicking one highlights its
two endpoints and loads only that relation's full transfer evidence, including
source and destination transaction hashes used for explorer links. This keeps
the evidence JSON out of the initial graph response.

The graph header can search catalogued deployed tokens by symbol, chain, or
address using the already-loaded graph payload. Choosing a result selects the
node, opens its existing details panel, and animates the viewport to a readable
zoom around it. Full token and abstract-token details remain selection-time
queries rather than being added to the initial payload.

An edge is an assignment anomaly when both endpoints are assigned to abstract
tokens and those abstract token IDs differ. An unassigned or uncatalogued
endpoint is not considered an anomaly. The default view keeps the bridge-type
colors and does not draw anomalies red. An anomaly switch changes conflicting
edges to red and mutes other edges to gray, so anomaly inspection does not
compete with the default bridge-mechanism view.

The initial graph query reads only relation identity fields and the minimal
endpoint display data. It deliberately excludes full deployed/abstract token
records and the transfer evidence JSON; dedicated selection-time queries fetch
one node or one relation detail record when requested.

## Human edits

Humans can add, update, and delete relations through the standard
`intent → plan → execute` pipeline. The *add* intent still validates that
both endpoints exist as deployed tokens — a human hand-typing a relation
to an uncatalogued address is almost certainly a mistake, while the
ingestion loop observing one is the whole point. Validation belongs to
the pipeline, not the storage.

## Known limitations

- The serial-id cursor can permanently skip a transfer whose row committed
  out of order (same accepted risk as the queue pre-step's cursor).
- Relations only capture routes observed while the loop runs; transfers
  that aged out of the ~7-day retention before the loop first ran are not
  represented.

Both are acceptable on a living system: active routes recur, and a missed
observation is re-created by the next transfer on the same route.
