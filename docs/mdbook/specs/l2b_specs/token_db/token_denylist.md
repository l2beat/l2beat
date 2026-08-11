<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Token Denylist](#token-denylist)
  - [Why prevention, not filtration](#why-prevention-not-filtration)
  - [The table](#the-table)
  - [One intent, one plan](#one-intent-one-plan)
  - [Where the denylist is consulted](#where-the-denylist-is-consulted)
  - [Relations are not deleted — the graph filters](#relations-are-not-deleted--the-graph-filters)
  - [Lifting a ban](#lifting-a-ban)
  - [What this deliberately does not do](#what-this-deliberately-does-not-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Token Denylist

`TokenDenylist` holds addresses that must never (re-)enter TokenDB. An entry
means a human decided the address is not a real asset deployment and banned
it. The motivating case: a test token wired through a LayerZero OFT to a
real token. The resulting transfers are genuine on-chain observations, but
interpreting them catalogued the test token as a deployment of the real
asset — in production, a token named TPAXG ended up recorded as a
deployment of OP this way, connected to the OP cluster on the relations
graph and visible to every downstream consumer.

## Why prevention, not filtration

Deleting such a token is not durable on its own: the queue pre-step
re-enqueues the address with the next test transfer, and the processor
re-resolves the abstract token from the non-swapping transfer evidence and
recreates the deployed token.

The alternative considered was a `DeployedToken.ignored` flag with
filtering on every read path. It was rejected: a flag turns the catalogue
into a two-state store, and every read — present and future — must then
decide whether it wants ignored rows. That decision genuinely differs per
call site (existence checks yes, graph no, suggestion suppression yes...),
which makes every future endpoint a chance to leak. The denylist instead
stops the data at the **catalogue write boundary**: a banned address is
never a `DeployedToken`, so the catalogue's read paths need zero awareness.
Only a handful of entry points consult the list, and they all ask the same
one-directional question — "is this address banned? then skip/refuse".

Relation *observations* are the deliberate exception to prevention: they
keep being recorded (see below), and the one interpretation surface that
draws them — the relations graph — filters denylisted endpoints out.

## The table

`TokenDenylist` is keyed by `(chain, address)` (addresses normalized
lowercase, same as everywhere else) and carries a mandatory human-written
`reason` plus a database-filled `createdAt`. `createdAt` is not part of any
command payload — `executePlan` regenerates plans and compares them
byte-for-byte, so plan-time data must not contain "now".

Planning canonicalizes the pasted address with the same helper ingestion
uses for its lookups (Address32 forms cropped to 20 bytes, lowercase) — an
entry stored under any other form would never match a lookup and the ban
would silently do nothing. The free-form `chain` gets the same protection
against silent no-ops: a chain that is missing from the chain table *and*
referenced by nothing in TokenDB (no token, no relations, no queue entry)
is rejected as a probable typo. A chain missing from the table is still
accepted when something references the address under it — production has
queued tokens on chains that were never added to the table.

## One intent, one plan

`AddTokenToDenylistIntent { pk, reason }` produces a single plan that:

1. adds the denylist entry, and
2. deletes the `DeployedToken` row, when the address is catalogued.

Relations touching the address are **not** deleted — see below.

One intent rather than separate "delete" and "denylist" actions, so no
half-state is reachable: deleted-but-not-denylisted is recreated by
ingestion within a minute, and denylisted-but-not-deleted leaves a stale
catalogue entry. The confirmation dialog shows the full command list (the
same visible-blast-radius rationale as
[abstract token merging](./abstract_token_merging.md)), and the deleted
record is preserved verbatim inside its command in `TokenDbHistory`, from
which it can be reconstructed if the ban was a mistake.

The address does **not** have to be catalogued — an uncatalogued endpoint
seen only in relations (an orange node on the graph) can be denylisted too;
the plan then consists of the entry alone.

## Where the denylist is consulted

Five entry points, all additive "if banned → skip/refuse/filter" checks:

1. **Token ingestion** — `plan()` checks the denylist first and
   short-circuits to a terminal `skip` with a `token-denylisted` trace
   step. The queue entry is removed; nothing is resolved, written, or
   propagated. Enqueueing a denylisted address is always harmless.
   Because `fetch()` makes slow external calls, `apply()` rechecks the
   denylist inside the same serializable transaction as the write — an
   address denylisted between planning and applying is skipped, not
   written next to its own ban.
2. **The add path** — `planAddDeployedToken` refuses denylisted addresses,
   and the `deployedTokens.checks` route returns a `denylisted` error so
   the add form blocks before a plan is even attempted.
3. **Suggestion surfaces** — CoinGecko and partial-transfer suggestions
   treat denylisted addresses as known, so a banned address never
   resurfaces as "add this token".
4. **The interop missing-tokens dashboard** — a denylisted address gets a
   dedicated `denylisted` status instead of `missing`, so nobody is
   invited to re-add it.
5. **The relations graph** — `getRelationsGraph` drops relations with a
   denylisted endpoint when assembling the graph (see below). This is the
   only read-side consult point.

Everything else — `TokenMap`, financials, the public frontend, search —
needs no awareness at all: for the catalogue, the data does not exist.

## Relations are not deleted — the graph filters

[Token relations](./token_relations.md) says observation recording must
never be gated on interpretation. A human ban is an interpretation ("this
address is not a real asset"), so it gets no carve-out: relation ingestion
keeps recording transfers touching a denylisted address, and the ban plan
deletes no relations. Granting the denylist an exception here would invite
the next exception, and the observation record would stop being the one
thing it must be — complete.

Instead the ban acts where interpretations belong: the relations graph, the
one surface that turns relations into a picture of asset clusters, filters
out relations with a denylisted endpoint when assembling the graph. The
banned test token's edge therefore disappears from the graph while the
underlying observation stays queryable, and if the ban was a mistake,
nothing was lost — lifting it makes the edges reappear on the next load.
The per-token Relations tab still lists such relations: it displays raw
observations for a catalogued token, and a denylisted address has no token
page of its own.

## Lifting a ban

`DeleteTokenFromDenylistIntent` deletes the entry (through the same
plan/confirm flow, recorded in history). Removal only lifts the ban: the
deleted token is not restored automatically. If the route is still active,
ingestion re-creates it from live transfers within a minute; otherwise a
human re-adds it manually, using the record preserved in history. Relations
were never deleted, so the graph shows the address again immediately.

## What this deliberately does not do

- No banner on a token page — a denylisted address has no token page. The
  denylist page in token-UI lists all entries with their reasons and is
  where bans are added (for uncatalogued addresses) and lifted.
- No filtering in the catalogue's query layer. The relations graph filter
  is the single sanctioned read-side check, because relations are
  observations that must outlive any ban. If you find yourself adding a
  denylist check to any *catalogue* read path, stop — the address should
  not have data there in the first place; find the write path that let it
  in.
