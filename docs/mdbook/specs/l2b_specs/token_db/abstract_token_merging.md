<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Abstract token merging & additional CoinGecko entries](#abstract-token-merging--additional-coingecko-entries)
  - [Why duplicate abstract tokens exist](#why-duplicate-abstract-tokens-exist)
  - [How duplicates surface](#how-duplicates-surface)
  - [Additional CoinGecko entries](#additional-coingecko-entries)
  - [The merge operation](#the-merge-operation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Abstract token merging & additional CoinGecko entries

TokenDB's core invariant is that every deployed token belongs to exactly
one abstract token — abstract tokens are the "class", deployed tokens the
"instances". In practice we accumulate *duplicate* abstract tokens:
several abstract tokens that are really one asset. This document explains
why that happens and why the fix is a first-class **merge** operation
backed by **multiple CoinGecko entries per abstract token**.

## Why duplicate abstract tokens exist

Two causes, both rooted in CoinGecko:

1. **CoinGecko splits assets we consider one.** CoinGecko sometimes lists
   what is, from our point of view, a single asset as two or three
   separate coins, for reasons we don't understand or agree with. As long
   as an abstract token could hold only a single `coingeckoId`, each
   extra CoinGecko coin forced us to create a separate abstract token.
2. **Ingestion falls back to creating abstracts.** Most tokens are added
   by [automatic token ingestion](./automatic_token_ingestion.md). When
   it cannot resolve an existing abstract token — neither from transfer
   evidence nor by the CoinGecko id — but CoinGecko does know the
   deployed token's address, it materializes a *new* abstract token from
   the CoinGecko coin. If the asset already existed under a different
   CoinGecko id, that's a duplicate.

## How duplicates surface

A non-swapping transfer is, by definition, a transfer of the *same*
abstract token — only the deployed token changes across it. So a
non-swapping relation between deployed tokens assigned to two
*different* abstract tokens contradicts the invariant. These show up as
`conflict` entries in the ingestion queue and as red edges in the
token-UI relations graph (see [token relations](./token_relations.md)).
Occasionally the plugin misclassified the transfer and it should have
been a swap — then the plugin is what needs fixing. But usually the
diagnosis is: two abstract tokens that should be one. Merging is how a
human resolves that.

## Additional CoinGecko entries

An abstract token keeps its main `coingeckoId` plus a list of
`additionalCoingeckoEntries`. Only the main entry is used for pricing
and the icon. The additional entries serve two purposes:

- **Informational** — we keep the data from the absorbed CoinGecko
  coins in case it's ever needed.
- **Load-bearing for ingestion** — ingestion resolves abstract tokens by
  CoinGecko id, so *every* CoinGecko id the asset is known under must
  stay attached to the abstract token. Drop one, and the next deployed
  token CoinGecko lists under that id would make ingestion recreate the
  duplicate we just merged away.

## The merge operation

Merging abstract token B (source) into A (target) does three things, in
order: copy B's CoinGecko entries onto A as additional entries, reassign
all of B's deployed tokens to A, delete B. A `Merged from
<id>:<issuer>:<symbol> (...)` note is also appended to A's comment — this
happens even when B has no CoinGecko data and no entries get copied, so
the target always shows at a glance what was absorbed into it. It is a
single intent in the
[intent → plan → execute](./intent_plan_execute.md) pipeline, so the
user sees the full command list — every reassigned deployed token —
before confirming. The operation has no automatic undo; history retains
enough information to reconstruct the source token manually if a merge
turns out to be wrong.
