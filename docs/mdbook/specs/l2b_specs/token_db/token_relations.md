<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Token Relations](#token-relations)
  - [Observations, not catalogue entries](#observations-not-catalogue-entries)
  - [A transfer has a direction; a relation has roles](#a-transfer-has-a-direction-a-relation-has-roles)
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
transfer between two token addresses: the same abstract asset moved between
them via a specific plugin, classified as a specific non-swapping
`bridgeType`. Relations are the raw material for reasoning about which
deployed tokens represent the same asset — including, crucially, for
spotting places where our current abstract-token assignments are *wrong*.

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

## A transfer has a direction; a relation has roles

This is the second load-bearing distinction, and getting it wrong has
already cost us one bug:

> **Which way a transfer moved is a property of the transfer. Which token is
> escrowed and which is a minted representation is a property of the pair.**

An interop transfer travels from a source to a destination — a fact about
one transaction, at one moment, in one direction. A relation says two token
addresses are the same asset, bridged by a given mechanism. That is not
directional in the transfer sense: users bridge both ways over the same
route all day, and each of those transfers is evidence of *the same*
relation.

What a `lockAndMint` relation *does* have is an asymmetry between the two
tokens: one is locked (escrowed) and released, the other is minted and
burned. Take a `lockAndMint` bridge between token X on ethereum, which is
escrowed, and token Y on arbitrum, which is its minted representation:

| observed transfer | `srcWasBurned` | `dstWasMinted` |
|---|---|---|
| deposit, X → Y | `false` (X locked) | `true` (Y minted) |
| withdrawal, Y → X | `true` (Y burned) | `false` (X released) |

Both transfers say exactly the same thing about the pair: **X is escrowed,
Y is its representation.** So the roles are a stable property of the pair,
while the direction is not — and the roles are *complementary*, so naming
one endpoint names both. That is the one bit of information a relation
needs, and `lockedToken` is where it lives.

The earlier design instead stored the endpoints in the order the sample
transfer happened to travel and let readers infer roles from that order.
That silently made every arrow on the graph and every role in the deployed
token's Relations tab a coin flip, and it stored one real relation twice —
once per observed direction — in opposite orientations that nothing could
tell apart. Do not reintroduce a directional reading of the endpoint
columns.

## The table

`TokenRelation` is keyed by the identity of the *pair*:

```
(tokenAChain, tokenAAddress, tokenBChain, tokenBAddress,
 plugin, bridgeType)
```

**`tokenA*`/`tokenB*` are not a direction.** They are two slots holding an
unordered pair, always in lexicographic order of `(chain, address)`, so that
a pair has exactly one possible identity and the primary key enforces one row
per pair. They are named A and B rather than from/to precisely so that no
reader can mistake a slot for an origin: A is simply whichever endpoint sorts
first. A `CHECK` constraint on the table rejects any other order,
which is also how anyone reading the schema learns the columns are not a
direction. `normalizeTokenRelation` in
[`TokenRelationRepository.ts`](../../../../../packages/database/src/repositories/TokenRelationRepository.ts)
puts a relation into that order, and every write path calls it. Addresses
are stored normalized (lowercase, `Address32` cropped to Ethereum
addresses, same normalization as token ingestion).

These columns were once called `tokenFrom*`/`tokenTo*`. That spelling survives
in one place and will forever: `TokenDbHistory` stores the executed command as
an immutable JSON snapshot, so entries recorded before the rename still use the
old field names. The history page reads both spellings for that reason — see
`LEGACY_ENDPOINT_FIELDS` in
[`TokenHistoryPage.tsx`](../../../../../packages/token-ui/src/pages/tokens/TokenHistoryPage.tsx).
Nothing else should ever accept the old names.

The remaining columns:

- `bridgeType` is `NOT NULL` — a relation only exists for non-swapping
  types, so every row has one.
- `lockedToken` names the slot holding the locked token: `'A'`, `'B'`, or
  `NULL` — a `CHAR(1)`, since one letter says everything there is to say. It
  is deliberately **outside** the
  primary key, which is what makes both of the following possible: `NULL`
  can later be resolved by a plain update, and the two observed directions
  of one route cannot fragment into two rows.

  `NULL` means "no endpoint is identified as the locked one", which covers
  two cases that are the same thing to every reader, disambiguated by
  `bridgeType`:

  | `bridgeType` | `lockedToken` `NULL` means |
  |---|---|
  | `burnAndMint` | nothing is locked — the pair is symmetric, both sides burn and mint. A terminal value, not a gap. |
  | `lockAndMint` | no observation has identified the locked endpoint yet. Resolved as soon as one does. |
- `transfer` holds one full sample interop transfer as evidence. It is
  embedded (not referenced by id) because the interop transfer table is a
  sliding ~7-day window — the same reasoning as the
  `non-swapping-transfer` assignment proof on `DeployedToken`. The sample
  keeps its own observed direction; read `srcChain`/`dstChain` from inside
  the JSON when displaying it, never the relation's endpoint columns.

A pair of identical endpoints (same chain, same address) is not recorded: a
token is trivially the same asset as itself, so the row would carry no
information, and it has no canonical order.

The table size is bounded by the number of distinct bridged pairs, not by
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
   has none, or if both sides are the same token), classify the bridge type
   (stored value, or inferred from the burn/mint flags), and keep only
   non-swapping types (`lockAndMint`, `burnAndMint`).
4. Derive `lockedToken` from the transfer's burn/mint flags via
   `InteropTransferClassifier.inferLockedTransferSide`, then normalize the
   pair into stored order. **This is the only place transfer semantics are
   translated into relation semantics.** Downstream code never opens the
   evidence JSON to work out roles or direction — that is precisely the
   mistake this step exists to prevent.
5. For each candidate pair not already present in `TokenRelation`, commit an
   `AddTokenRelationCommand` through `commitTokenChanges` — the shared write
   boundary — so every relation insert lands in `TokenDbHistory` like every
   other TokenDB write.
6. For each candidate that already exists with `lockedToken = NULL`, where
   this transfer *does* identify the locked endpoint, commit an
   `UpdateTokenRelationCommand` filling it in. An already-identified
   `lockedToken` is never overwritten, so a relation's role cannot flap.
7. Advance the cursor after each batch.

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
is `(pair, plugin, bridgeType)`, and `bridgeType` is the authoritative,
plugin-declared (or, absent that, inferred) classification of the bridge's
mechanism. The honestly-observed flags are not lost — they remain in the
`transfer` evidence JSON exactly as seen: present when observed, absent
when not. No tri-state column, nothing to fabricate, no pair
fragmentation.

Note this means a stored `bridgeType` is trusted even when the flags are
unobserved — deliberately, and consistently with how the token ingestion
processor already trusts a stored `bridgeType` as `non-swapping-transfer`
assignment evidence. Demanding observed flags instead would drop the
~80k+ one-sided non-swapping transfers and recreate the very
"missing relations" problem this subsystem exists to fix.

The flags are also **not copied verbatim** onto the relation under new
names, which is the other tempting shortcut. Two reasons:

- They are transfer-shaped, not pair-shaped. `srcWasBurned` is a fact about
  one leg of one transaction; a relation summarizes an unbounded set of
  transfers over a pair. Copying one sample's flags onto the row would
  assert that they are a property of the pair.
- They carry no information the relation needs beyond `lockedToken`. Two
  nullable booleans encode nine states, of which only two identify a locked
  endpoint for a `lockAndMint` pair — and every read site would have to
  re-run that truth table. `lockedToken` is that truth table applied once,
  at ingestion.

Nothing is lost by not copying them: the flags stay in the evidence JSON
verbatim, so any future question about a specific sample can still be
answered from there. A future question about the *pair* should get its own
pair-shaped column derived at ingestion, not a raw transfer field.

## Why there are NO foreign keys to DeployedToken

`TokenRelation.tokenA*` / `tokenB*` deliberately do **not** reference
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
  primary key (one row per pair).

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

`getRelations` returns one flat list, not an inbound/outbound split: the
endpoint columns are not a direction, so there is nothing to split on. Each
entry instead carries the queried token's `role` in that relation, derived
from `bridgeType` and `lockedToken`:

| `role` | meaning |
|---|---|
| `locked` | this token is escrowed; the other is its minted representation |
| `minted` | this token is minted by the plugin: the representation side of a `lockAndMint` pair, or either side of a `burnAndMint` pair |
| `unknown` | a `lockAndMint` pair whose locked endpoint is not identified |

There is deliberately no `symmetric` role (there used to be one, shown for
`burnAndMint` pairs). A `burnAndMint` pair *is* symmetric, but from each
endpoint's point of view that fact reads "minted" — the question the role
answers — and the bridge type, shown alongside, is what carries the
symmetry. A relation that is neither `burnAndMint` nor `lockAndMint` (a
human-added `nonMinting` row; ingestion never writes one) mints nothing and
shows `unknown`.

This is the answer to "which plugin minted this token, and which token is it
a representation of" — the question the Relations tab exists for. Read it
from `role`, never by comparing the endpoint columns.

The narrower question "which plugins mint this token" — asked by the public
frontend, which reads the token database directly rather than through
token-backend — is answered by
`TokenRelationRepository.getMintingPluginsFor`: the distinct plugins of the
relations where the token's role is minted. Deliberately excluded: relations
where the token is locked, relations with an unknown role (one of their
endpoints is minted, but nothing says it is this one), and human-added
`nonMinting` relations, which mint nothing. Token-UI exposes the same query
as `deployedTokens.getMintingPlugins` and shows the list above the Relations
table, so the summary can be eyeballed against the roles in the table.

## Relations graph

The graph page in token-ui is a view of the relation observations resolved
against the current token catalogue. Every observed `(chain, address)`
endpoint is a node, including endpoints that do not yet have a
`DeployedToken` row. Catalogued nodes are green and labelled with their
deployed token symbol; uncatalogued nodes are orange and use a shortened
address as their label. An edge is an observed token relation: burn-and-mint
edges are blue and non-directional, while lock-and-mint edges are pink and
carry an arrowhead pointing **from the locked token to the minted one**. The
arrow follows `lockedToken`, never the endpoint column order — that order is
lexicographic and says nothing about roles. A lock-and-mint edge whose
`lockedToken` is unidentified is drawn without an arrowhead rather than
guessing which token is the original. Nodes can be dragged and the canvas can
be panned or zoomed. Edge stroke widths remain constant while zooming, and node
visuals stop growing beyond 2x zoom so additional zoom creates useful space
between them. Above 2.5x zoom, each edge shows its relation plugin name at its
midpoint.

Before drawing, the UI treats every connected component as a cluster and
sorts the clusters by endpoint count (largest first, with a stable id
tie-break). Each cluster gets its own force simulation, which is run to
completion in memory so clusters do not repel each other and users never see
the graph settle. The finished clusters are placed left-to-right in a
square-ish grid, starting at the top-left, then the whole grid is fitted into
the viewport. At low zoom levels each cluster is overlaid with its most common
catalogued deployed-token symbol. The overlay stays readable through the
mid-zoom range, then shrinks and fades at extreme zoom-out to avoid overlapping
nearby cluster labels.

Clicking a node keeps the node, its incident edges, and its neighbors
prominent while dimming the rest of the graph. A non-modal details panel loads
that one deployed token and its abstract token on demand; the initial graph
payload does not contain full token records. The panel also lists the relations
already present in the graph — one list, each entry labelled with the selected
token's role — rather than issuing a second database query for the
neighborhood. Uncatalogued nodes show their raw endpoint information instead of
token details.

Edges are independently hoverable and clickable. Clicking one highlights its
two endpoints and loads only that relation's full transfer evidence, including
source and destination transaction hashes used for explorer links. This keeps
the evidence JSON out of the initial graph response. The evidence panel labels
those hashes with the chains recorded *inside* the evidence, because the sample
transfer keeps its own observed direction, which the relation's endpoint order
does not describe.

The relation panel also carries a delete button — the tool for removing a
bogus observation that a buggy plugin's interop transfer ingested. Any
relation can be deleted this way, not only anomalies. The button goes through
the standard delete intent (see [Human edits](#human-edits)), so the user
confirms a plan first; the confirmation notes that the executed command lands
in `TokenDbHistory` with the full removed record, from which the relation can
be recovered in the worst case. On success the edge simply disappears from the
drawing and from the panel's relation lists. **The layout is deliberately not
re-run.** Removing an edge can split a cluster in two, and re-clustering —
new cluster grid, new cluster labels, reset viewport — would yank the graph
out from under a user mid-investigation on a view that takes seconds to
build. Refreshing the page is how one sees the re-clustered graph. For the
same reason, the graph query is never refetched automatically while the page
is open — executing a plan only marks it stale without refetching active
instances, and the page opts out of the window-focus and reconnect refetches
that would otherwise pick that staleness up — so fresh data loads only on
the next visit to the page.

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

The initial graph query reads only relation identity fields, `lockedToken`,
and the minimal endpoint display data. It deliberately excludes full
deployed/abstract token records and the transfer evidence JSON; dedicated
selection-time queries fetch one node or one relation detail record when
requested. `lockedToken` is in that payload precisely so the graph never has
to open the evidence to know which way an arrow points.

## Human edits

Humans can add, update, and delete relations through the standard
`intent → plan → execute` pipeline. The *add* intent still validates that
both endpoints exist as deployed tokens — a human hand-typing a relation
to an uncatalogued address is almost certainly a mistake, while the
ingestion loop observing one is the whole point. Validation belongs to
the pipeline, not the storage.

The add planner normalizes the record before storing it: a human names the
two endpoints in whichever order they happen to think of them, and the pair
is unordered, so the stored order is derived rather than taken. `lockedToken`
moves with the endpoints when they are swapped, so the role a human stated is
preserved. The update intent can also set `lockedToken` directly, which is
how a human corrects a role the flags got wrong.

## Known limitations

- The serial-id cursor can permanently skip a transfer whose row committed
  out of order (same accepted risk as the queue pre-step's cursor).
- Relations only capture routes observed while the loop runs; transfers
  that aged out of the ~7-day retention before the loop first ran are not
  represented.
- A `lockAndMint` relation can sit at `lockedToken = NULL` indefinitely if no
  transfer on that route ever identifies a side. Two things cause this: a
  plugin that declares `bridgeType: 'lockAndMint'` while its burn/mint flags
  stay unobserved, and a plugin whose declared `lockAndMint` contradicts the
  flags it did observe (both sides locked, or both supply-changing). Such
  relations are still recorded — identity is the table's primary purpose and
  matters more than the role — they just display as `unknown`. The ingestion
  log's `resolvedLockedTokens` counter shows how often this self-corrects.

All are acceptable on a living system: active routes recur, and a missed
observation is re-created by the next transfer on the same route.
