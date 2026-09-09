<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Interop Plugin Matching](#interop-plugin-matching)
  - [The matcher](#the-matcher)
  - [Two kinds of input: transfers and observations](#two-kinds-of-input-transfers-and-observations)
  - [From matches to projects: subgroup shadowing](#from-matches-to-projects-subgroup-shadowing)
  - [Where each consumer resolves](#where-each-consumer-resolves)
  - [Known limitations](#known-limitations)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Interop Plugin Matching

A plugin name (`opstack`, `cctp-v2`, …) does not identify an interop project:
several projects can claim the same plugin, distinguished by qualifiers.
Everything that needs to answer "which project(s) does this sighting belong
to" — aggregation, the transfer lists, the token page's Minters column —
goes through **one matcher**: `InteropTransferClassifier` in
`@l2beat/shared`. If you are about to match plugin names against
`interopConfig.plugins` anywhere else, use it instead.

## The matcher

Each project declares `interopConfig.plugins` as a list of entries:

```text
{ plugin, bridgeType, chain?, abstractTokenId? }
```

A sighting matches a project when **some** entry's conditions **all** hold:

- `plugin` and `bridgeType` must match exactly (the identity),
- `chain`, when configured, must equal *either* side of the sighting,
- `abstractTokenId`, when configured, must equal *either* side's token.

The qualifiers are deliberately symmetric: `chain: 'base'` means "this
plugin entry concerns transfers touching base", not "minted on base". The
src/dst split of the input carries no meaning to the matching.

There is intentionally no qualifier on the transfer's `type` string — the
classification input does not even carry it. One
existed while the axelar plugin emitted both gateway and squid transfers
under one plugin name; the squid emission is gone, and the lasting fix for
"one plugin, two products" is splitting the plugin (as `axelar-its` was) —
a per-type qualifier could never be honored for relation-derived
observations, which carry no transfer type.

## Two kinds of input: transfers and observations

The classifier exposes the same core through two entry points:

- **`createMatcher`** takes a full transfer
  (`InteropTransferForClassification`). It has per-transfer evidence, so it
  can infer a missing `bridgeType` from the burn/mint flags and waive the
  bridge-type check for one-sided transfers whose type is unknown.
- **`createPluginMatcher`** takes a bare observation
  (`InteropPluginObservation`): plugin, bridge type, the two chains, and
  optionally the abstract tokens. This is what a
  [token relation](./token_db/token_relations.md) can produce. Identity
  must match exactly.

Both share the qualifier logic (`createQualifiedMatcher`), so every
qualifier applies to every consumer at once; the variants differ only in
how leniently identity is established for transfers.

## From matches to projects: subgroup shadowing

Matching alone can name several projects, some of which are parents of
others: usdt0 declares `subgroupId: layerzero`, and both match a
layerzero-v2-ofts sighting. `createMatchingProjectsResolver` (frontend
interop utils) applies the rule: a matching project shadows the project its
`subgroupId` names, so only the most specific match survives. Both frontend
resolvers are built on it:

- `createTransferBridgeResolver` (transfers) additionally asserts the result
  is exactly one project — for a full transfer, ambiguity is a config bug.
- `createInteropProjectResolver` (observations) returns all survivors —
  several bridges can mint the same deployment, so an observation genuinely
  can name several projects.

## Where each consumer resolves

- **Aggregation (backend)** resolves at aggregation time:
  `InteropAggregationService` classifies every transfer against every
  project's plugin entries and stores aggregated rows keyed by project id.
  The frontend never re-matches aggregated data — it groups by `record.id`.
  Re-running aggregation re-resolves, so config changes propagate.
- **Transfer lists (frontend)** resolve at read time with
  `createTransferBridgeResolver`, since raw transfer rows carry plugin
  names, not project ids.
- **Minters column (frontend)** resolves at read time with
  `createInteropProjectResolver` over observations derived from token
  relations. Relations are deliberately config-independent evidence
  (recorded without consulting any config), so project attribution must not
  be baked in at ingestion — a config change would otherwise require
  re-ingesting relations.

## Known limitations

- A relation names only the minted endpoint's abstract token, so an
  `abstractTokenId` qualifier can only ever match that token, never the
  related endpoint's.
