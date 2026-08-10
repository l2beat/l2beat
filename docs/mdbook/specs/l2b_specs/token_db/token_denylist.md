<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Token Denylist](#token-denylist)
  - [Why prevention, not filtration](#why-prevention-not-filtration)
  - [The table](#the-table)
  - [One intent, one plan](#one-intent-one-plan)
  - [Where the denylist is consulted](#where-the-denylist-is-consulted)
  - [Why relation ingestion honors the denylist](#why-relation-ingestion-honors-the-denylist)
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

Deleting such a token is not durable on its own: relations survive token
deletion (by design), and the next test transfer re-runs the whole loop —
relation ingestion re-inserts the edge, the queue pre-step re-enqueues the
address, and the processor re-resolves the abstract token from the
non-swapping transfer evidence and recreates the deployed token.

The alternative considered was a `DeployedToken.ignored` flag with
filtering on every read path. It was rejected: a flag turns the catalogue
into a two-state store, and every read — present and future — must then
decide whether it wants ignored rows. That decision genuinely differs per
call site (existence checks yes, graph no, suggestion suppression yes...),
which makes every future endpoint a chance to leak. The denylist instead
stops the data at the **write and observation boundaries**: what was never
stored cannot leak, and read paths need zero awareness. Only a handful of
entry points consult the list, and they all ask the same one-directional
question — "is this address banned? then skip/refuse".

## The table

`TokenDenylist` is keyed by `(chain, address)` (addresses normalized
lowercase, same as everywhere else) and carries a mandatory human-written
`reason` plus a database-filled `createdAt`. `createdAt` is not part of any
command payload — `executePlan` regenerates plans and compares them
byte-for-byte, so plan-time data must not contain "now".

## One intent, one plan

`DenylistDeployedTokenIntent { pk, reason }` produces a single plan that:

1. adds the denylist entry,
2. deletes the `DeployedToken` row, when the address is catalogued, and
3. deletes every `TokenRelation` touching the address.

One intent rather than separate "delete" and "denylist" actions, so no
half-state is reachable: deleted-but-not-denylisted is recreated by
ingestion within a minute, and denylisted-but-not-deleted leaves a stale
catalogue entry. The confirmation dialog shows the full command list (the
same visible-blast-radius rationale as
[abstract token merging](./abstract_token_merging.md)), and every deleted
record is preserved verbatim inside its command in `TokenDbHistory`, from
which it can be reconstructed if the ban was a mistake.

The address does **not** have to be catalogued — an uncatalogued endpoint
seen only in relations (an orange node on the graph) can be denylisted too;
the plan then consists of the entry plus whatever relations exist.

## Where the denylist is consulted

Five entry points, all additive "if banned → skip/refuse" checks:

1. **Token ingestion** — `plan()` checks the denylist first and
   short-circuits to a terminal `skip` with a `token-denylisted` trace
   step. The queue entry is removed; nothing is resolved, written, or
   propagated. Enqueueing a denylisted address is always harmless.
2. **Relation ingestion** — transfers with a denylisted endpoint are not
   turned into relations (see below).
3. **The add path** — `planAddDeployedToken` refuses denylisted addresses,
   and the `deployedTokens.checks` route returns a `denylisted` error so
   the add form blocks before a plan is even attempted.
4. **Suggestion surfaces** — CoinGecko and partial-transfer suggestions
   treat denylisted addresses as known, so a banned address never
   resurfaces as "add this token".
5. **The interop missing-tokens dashboard** — a denylisted address gets a
   dedicated `denylisted` status instead of `missing`, so nobody is
   invited to re-add it.

Everything else — the relations graph, `TokenMap`, financials, the public
frontend, search — needs no awareness at all: the data does not exist.

## Why relation ingestion honors the denylist

[Token relations](./token_relations.md) says observation recording must
never be gated on the interpretation being consistent. The denylist is not
that kind of gate. That rule exists so *systematic* interpretation failures
(token-level conflicts) cannot suppress exactly the evidence needed to
diagnose them. A denylist entry is the opposite: a rare, explicit,
human-confirmed statement that observations involving this address are
noise, not signal — the same category as the address normalization that
already drops `0x0` and `Address32.ZERO` before they enter the system. The
price, paid knowingly: if an address is denylisted by mistake, transfers
observed during the ban age out of the ~7-day retention and those
observations are unrecoverable.

## Lifting a ban

`RemoveTokenDenylistEntryIntent` deletes the entry (through the same
plan/confirm flow, recorded in history). Removal only lifts the ban: the
deleted token and relations are not restored automatically. If the route is
still active, ingestion re-creates them from live transfers within a
minute; otherwise a human re-adds them manually, using the records
preserved in history.

## What this deliberately does not do

- No banner on a token page — a denylisted address has no token page. The
  denylist page in token-UI lists all entries with their reasons and is
  where bans are added (for uncatalogued addresses) and lifted.
- No filtering anywhere in the query layer. If you find yourself adding a
  denylist check to a read path, stop — the address should not have data
  there in the first place; find the write path that let it in.
