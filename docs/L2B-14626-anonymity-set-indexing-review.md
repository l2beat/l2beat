# L2B-14626 anonymity-set indexing: reviewer guide

This document explains the production anonymity-set implementation, with an
emphasis on why it currently has a dedicated indexer instead of being folded
into `PrivacyFlowIndexer`. It also describes what is already shared, what work
is duplicated, and how a clean unified acquisition pipeline could be built.

> **Author note:** I am happy to unify the log acquisition pipeline if that is
> the preferred direction. My concern is not unification itself; it is avoiding
> a single indexer that couples unrelated progress, failure, persistence, and
> configuration lifecycles. If we unify, I recommend a raw-log source with
> independent flow and anonymity-set materializers.

## Executive summary

The current implementation uses two business indexers:

- `PrivacyFlowIndexer` records deposits and withdrawals with counts, amounts,
  prices, and USD values.
- `PrivacyAnonymitySetIndexer` records supported deposits with their raw amount
  and visible origin address.

They both consume EVM logs, so some deposit logs are fetched twice. That
duplication is real. The pipelines remain separate because they have different:

- historical start points;
- configuration identities;
- parent dependencies;
- failure requirements;
- output tables;
- trim and wipe behavior; and
- deployment and backfill timelines.

The current implementation shares pure filtering, matching, amount extraction,
and configuration-ID utilities. It does not share progress or persistence.

The clean way to eliminate duplicate RPC log fetching is:

```text
PrivacyEvmLogIndexer -> PrivacyRawLog
                              |
                              +-> Flow materializer -> PrivacyFlowEvent
                              |
                              +-> Anonymity materializer
                                      + sender enrichment
                                      -> PrivacyAnonymitySetEvent
```

This is a valid follow-up or alternative implementation. It requires another
durable table, source-level configuration ownership, consumer cursors, reorg
handling, and raw-log retention. It is materially larger than sharing a helper
function.

## PR stack

The implementation is split by deployment boundary:

1. [#12704](https://github.com/l2beat/l2beat/pull/12704) adds storage.
2. [#12705](https://github.com/l2beat/l2beat/pull/12705) adds configuration.
3. [#12706](https://github.com/l2beat/l2beat/pull/12706) adds indexing.
4. [#12707](https://github.com/l2beat/l2beat/pull/12707) adds aggregation and UI.

The intended rollout order is:

```text
schema -> configuration -> writer/backfill -> public aggregation/UI
```

## What the metric represents

For a UTC endpoint `D`, bucket `B`, and raw token threshold `T`, the 30-day
value is:

```text
count(distinct visible origin address) where
  bucket = B
  D - 30 days <= deposit timestamp < D
  individual deposit amount >= T
```

Important consequences:

- Threshold comparisons are inclusive.
- Separate deposits are not summed to cross a threshold.
- Multiple qualifying deposits by one address count once.
- Withdrawals are not subtracted because a private withdrawal generally cannot
  be linked back to a visible depositor.
- Tokens and incompatible pools are not combined.
- The result is a visible-origin proxy, not the exact cryptographic anonymity
  set of an individual withdrawal.

Thresholds are aggregation configuration. They are deliberately excluded from
the ingestion configuration ID so adding or changing chart series does not wipe
or reindex the underlying deposit stream.

## Protocol-specific origin semantics

| Protocol | Compatible unit | Origin address | Deposit amount |
| --- | --- | --- | --- |
| Tornado Cash | One denomination contract | `transaction.from` | Fixed configured denomination |
| Privacy Pools | One asset pool | Indexed `Deposited.depositor` | Event `value` |
| Railgun | One token within the pool | `transaction.from` | Sum of matching-token commitments in one `Shield` event |

Privacy Pools exposes the depositor in the event. Tornado Cash and Railgun do
not expose the required origin in their deposit event, so the anonymity-set
indexer must retrieve the transaction.

Missing transaction or sender data is an error. The update retries instead of
silently storing an incomplete set.

## Current responsibility map

| Component | Responsibility | Explicitly does not own |
| --- | --- | --- |
| Project privacy config | Select tracked buckets and thresholds | Runtime progress |
| Backend privacy config | Derive stable flow and anonymity ingestion configurations | RPC calls |
| `PrivacyBlockTimestampIndexer` | Hourly mappings required by flow pricing | Anonymity sender enrichment |
| `PrivacyPriceIndexer` | Hourly prices required by flow records | Origin addresses |
| `PrivacyFlowIndexer` | Deposit/withdrawal counts, amounts, and USD values | Unique depositor identity |
| `PrivacyAnonymitySetIndexer` | Supported deposits with visible origin addresses | Pricing and withdrawals |
| `PrivacyFlowEvent` | Flow history and totals | Raw log data and sender identity |
| `PrivacyAnonymitySetEvent` | Per-deposit amount and visible sender | Public aggregation status |
| Frontend server aggregation | Thresholds, distinct senders, windows, synchronization | Raw sender exposure |

## End-to-end implementation flow

### 1. Project configuration

A bucket opts in by configuring `anonymitySet.minimumAmounts` in token base
units. The type requires an EVM address and one of the supported deposit
extractors.

Project-level `privacyInfo.anonymitySet` is reserved for the exceptional
`not-applicable` state. A tracked project does not require a duplicate
project-level summary entry.

Configuration invariants verify that:

- threshold lists are non-empty;
- thresholds are positive integer strings;
- tracked bucket IDs are unique within the project;
- generated series IDs are unique; and
- a not-applicable project has no tracked buckets.

Primary files:

- [`packages/config/src/types.ts`](../packages/config/src/types.ts)
- [`packages/config/src/processing/getProjects.test.ts`](../packages/config/src/processing/getProjects.test.ts)

### 2. Backend configuration derivation

`getPrivacyConfig()` walks configured privacy buckets once and derives two
independent configuration collections:

```text
all buckets
  |
  +-> deposit + withdrawal -> flow configurations
  |
  +-> tracked deposits only -> anonymity-set configurations
```

Flow configurations are clamped by `PRIVACY_MIN_TIMESTAMP`. Anonymity-set
configurations start at the bucket timestamp because their initial historical
backfill is independent of the existing flow deployment.

An anonymity ingestion ID is derived from:

```text
project + bucket + chain + address + event + extractor + extractor params
```

It excludes:

- threshold series;
- display labels;
- token decimals used only for labels; and
- the mutable synchronization cursor.

Primary files:

- [`packages/backend/src/config/features/privacy.ts`](../packages/backend/src/config/features/privacy.ts)
- [`packages/shared/src/tools/createPrivacyConfigurationId.ts`](../packages/shared/src/tools/createPrivacyConfigurationId.ts)

### 3. Module construction

For every EVM chain, the privacy module creates:

```text
HourlyIndexer
  |
  +-> PrivacyPriceIndexer
  |
  +-> PrivacyBlockTimestampIndexer
  |       |
  |       +-> PrivacyFlowIndexer (+ price parent)
  |
  +-> PrivacyAnonymitySetIndexer
```

The flow indexer waits for indexed prices and hourly block mappings. The
anonymity-set indexer resolves the two block boundaries it needs directly and
does not depend on price progress.

The direct block lookup also avoids extending the hourly block-timestamp
backfill to the earlier anonymity-set start date solely for a daily ingestion
loop.

Primary file:

- [`packages/backend/src/modules/privacy/PrivacyModule.ts`](../packages/backend/src/modules/privacy/PrivacyModule.ts)

### 4. Flow-indexer call waterfall

For one managed update range:

```text
ManagedMultiIndexer
  -> PrivacyFlowIndexer.multiUpdate(from, to, flowConfigs)
     -> clamp update to at most one UTC day
     -> read blockFrom/blockTo from PrivacyBlockTimestamp
     -> build unique address and topic filters
     -> LogsProvider.getLogs(...)
     -> map logs to matching configurations
     -> extract direction/count/amount
     -> resolve any missing block timestamps
     -> load hourly prices
     -> build PrivacyFlowEvent records with valueUsd
     -> return commit callback
        -> PrivacyFlowEventRepository.upsertMany(records)
        -> advance flow configuration progress
```

The commit callback means records are persisted before the managed cursor is
advanced.

Primary file:

- [`packages/backend/src/modules/privacy/indexers/PrivacyFlowIndexer.ts`](../packages/backend/src/modules/privacy/indexers/PrivacyFlowIndexer.ts)

### 5. Anonymity-indexer call waterfall

For one managed update range:

```text
ManagedMultiIndexer
  -> PrivacyAnonymitySetIndexer.multiUpdate(from, to, anonymityConfigs)
     -> clamp update to at most one UTC day
     -> resolve blockFrom/blockTo with BlockTimestampProvider
     -> build unique address and topic filters
     -> LogsProvider.getLogs(...)
     -> map logs to matching configurations
     -> extract amount and origin strategy
        -> Privacy Pools: sender is already in the event
        -> Tornado/Railgun: sender requires transaction lookup
     -> deduplicate transaction hashes
     -> fetch transactions in bounded batches of 25
     -> resolve block timestamps
     -> assert every required sender exists
     -> build PrivacyAnonymitySetEvent records
     -> return commit callback
        -> PrivacyAnonymitySetEventRepository.upsertMany(records)
        -> advance anonymity configuration progress
```

An empty day still advances after a successful log query. A missing sender
throws before the commit callback, so neither records nor progress are
partially committed.

Primary files:

- [`packages/backend/src/modules/privacy/indexers/PrivacyAnonymitySetIndexer.ts`](../packages/backend/src/modules/privacy/indexers/PrivacyAnonymitySetIndexer.ts)
- [`packages/backend/src/modules/privacy/utils/extractPrivacyAnonymitySetDeposit.ts`](../packages/backend/src/modules/privacy/utils/extractPrivacyAnonymitySetDeposit.ts)

### 6. Storage and aggregation

The flow row and anonymity row intentionally have different contracts.

Example flow row:

```ts
{
  configurationId: 'flow-config',
  projectId: 'tornado-cash',
  bucketId: 'tornado-eth-10',
  chain: 'ethereum',
  direction: 'deposit',
  timestamp: 1_780_000_000,
  blockNumber: 24_000_000,
  txHash: '0x...',
  logIndex: 7,
  count: 1,
  amount: 10_000_000_000_000_000_000n,
  priceId: 'ethereum',
  valueUsd: 31_000,
}
```

Example anonymity-set row for the same deposit:

```ts
{
  configurationId: 'anonymity-config',
  projectId: 'tornado-cash',
  bucketId: 'tornado-eth-10',
  chain: 'ethereum',
  timestamp: 1_780_000_000,
  blockNumber: 24_000_000,
  txHash: '0x...',
  logIndex: 7,
  sender: '0x...',
  amount: 10_000_000_000_000_000_000n,
}
```

The repository query groups anonymity rows by project, bucket, sender, and UTC
day and returns the maximum individual deposit amount for that sender/day. It
does not sum deposits. This preserves threshold semantics while reducing the
number of rows processed by the application.

Primary file:

- [`packages/database/src/repositories/PrivacyAnonymitySetEventRepository.ts`](../packages/database/src/repositories/PrivacyAnonymitySetEventRepository.ts)

### 7. Synchronization boundary

The event table is sparse. An empty table range cannot distinguish:

- a successfully indexed day with no deposits; from
- a day that has not been indexed yet.

Therefore the frontend checks the exact expected managed configuration IDs in
`IndexerConfiguration`.

For a project, the common proven cursor is the minimum current height of every
expected active configuration. A configuration is not usable when it is:

- missing;
- not started (`currentHeight` is null); or
- ended (`maxHeight` is not null).

The summary remains `Syncing` until the common cursor reaches the latest
complete UTC day. Historical charts may show older proven data through that
common cursor while a backfill is still running.

This logic is implemented in PR
[#12707](https://github.com/l2beat/l2beat/pull/12707).

## What is already unified

### Log filtering and matching

Both EVM indexers use the same helpers to:

- collect unique addresses;
- collect unique event topics;
- build normalized `address:topic0` keys; and
- map one fetched log to every matching managed configuration.

Primary file:

- [`packages/backend/src/modules/privacy/utils/privacyLogConfiguration.ts`](../packages/backend/src/modules/privacy/utils/privacyLogConfiguration.ts)

### Protocol amount extraction

The anonymity-set extractor delegates amount parsing to `extractPrivacyFlow()`
and adds only the origin strategy. There is not a second implementation of
Privacy Pools or Railgun amount decoding.

Primary files:

- [`packages/backend/src/modules/privacy/utils/extractPrivacyFlow.ts`](../packages/backend/src/modules/privacy/utils/extractPrivacyFlow.ts)
- [`packages/backend/src/modules/privacy/utils/extractPrivacyAnonymitySetDeposit.ts`](../packages/backend/src/modules/privacy/utils/extractPrivacyAnonymitySetDeposit.ts)

### Stable identity primitives

Privacy indexers use one hash implementation and one stable parameter
serializer. Existing flow, price, block-timestamp, and Starknet IDs have golden
compatibility tests because changing a persisted identity can trigger an
unexpected wipe or reindex.

Primary file:

- [`packages/shared/src/tools/createPrivacyConfigurationId.ts`](../packages/shared/src/tools/createPrivacyConfigurationId.ts)

## What is intentionally separate

### Progress and backfill

The flow indexer already has production progress and may be clamped by
`PRIVACY_MIN_TIMESTAMP`. The new anonymity indexer can backfill from an earlier
bucket timestamp without rewinding flow configurations or re-fetching prices.

A single class could maintain independent internal cursors, but at that point
it would contain two indexer lifecycles behind one API rather than genuinely
unifying them.

### Failure domain

Sender identity is correctness-critical for anonymity sets. A missing
transaction must fail the anonymity update.

That same failure should not stop:

- deposit totals;
- withdrawal totals;
- flow charts;
- volume; or
- price-derived USD values.

Coupling them would turn an additional RPC dependency into an availability
regression for existing metrics.

### Persistence contract

`PrivacyFlowEvent` is an interpreted business record. It no longer contains
raw topics/data and has no sender. It cannot act as a lossless input for the
anonymity calculation.

Conversely, adding sender to every flow row would mix a new identity-sensitive
contract into the established table and still would not solve independent
progress or backfill.

### Configuration lifecycle

Flow identities include direction and flow-specific extractor parameters.
Anonymity identities cover supported deposits only and deliberately exclude
thresholds.

Removing or changing an anonymity configuration must wipe only anonymity rows.
It must not alter existing flow records or flow progress.

### Parent dependencies

Flow processing requires price availability. Anonymity processing does not.
Anonymity processing sometimes requires transaction lookups. Flow processing
does not.

One update transaction would either wait for every dependency or contain
conditional dependency behavior for each output.

## The duplicated work

For tracked EVM deposits, the two indexers can request overlapping logs:

```text
flow query:      deposits + withdrawals for all flow configurations
anonymity query: tracked deposits only
```

Consequences:

- some block ranges and deposit topics are scanned twice;
- the filters are related but not identical;
- the cursors may be far apart during historical backfill; and
- only anonymity ingestion performs transaction lookups.

This should be described as a deliberate trade-off, not as zero-cost reuse.
The current implementation has not established that `eth_getLogs` is or is not
the bottleneck. Production measurements should compare:

- log-query duration and provider rate limits;
- blocks scanned per update;
- matching deposits per update;
- transaction lookup count and duration; and
- retry frequency.

## Why a shared fetch helper does not eliminate duplicate RPC work

We could extract a `PrivacyLogFetcher` that resolves blocks, calls
`LogsProvider`, and attaches timestamps. That would make the two classes
shorter and keep acquisition behavior consistent.

It would not guarantee one network request because:

- the indexers do not necessarily request the same time range;
- their filter sets differ;
- they have independent retry schedules;
- one can be backfilling while the other is at the head; and
- an in-memory result disappears across process restarts.

A request cache could coalesce identical concurrent calls, but it would have
limited effect on different filter supersets and historical cursor positions.

Therefore there are two distinct questions:

1. Should we share acquisition code? We can, with relatively low risk.
2. Should we fetch each raw log only once? That requires durable shared
   ingestion or a more complex coordinating indexer.

## Unification options

### Option A: one indexer that writes both business tables

Shape:

```text
CombinedPrivacyIndexer
  -> fetch logs
  -> extract flows
  -> load prices
  -> resolve senders
  -> write PrivacyFlowEvent
  -> write PrivacyAnonymitySetEvent
  -> advance one combined update
```

Advantages:

- one log request for aligned ranges;
- no intermediate raw-log table; and
- superficially fewer indexer instances.

Costs:

- sender failures stall existing flow metrics;
- price failures stall anonymity ingestion;
- historical start points become conditional;
- trim/wipe semantics become multi-table operations;
- configuration removal becomes harder to reason about;
- partial success requires multiple internal cursors and commit boundaries;
- new consumers enlarge the same class; and
- tests must cover the cross-product of output and dependency states.

This is the least attractive option. It reduces an RPC call by coupling the
parts whose independence protects data integrity and availability.

### Option B: shared stateless acquisition service

Shape:

```text
PrivacyLogFetcher
  -> used by PrivacyFlowIndexer
  -> used by PrivacyAnonymitySetIndexer
```

Advantages:

- centralizes block-range and log-query behavior;
- reduces implementation drift; and
- requires no new database table.

Costs:

- normally still performs two network requests;
- caching works only for overlapping live requests;
- independent cursors remain; and
- a superset query can fetch unnecessary withdrawal or deposit events.

This is a reasonable small refactor if code-level acquisition behavior begins
to drift. It is not a complete answer to duplicate fetching.

### Option C: durable raw-log ingestion with independent materializers

Shape:

```text
HourlyIndexer
  -> PrivacyEvmLogIndexer per chain
       -> PrivacyRawLog
            -> PrivacyFlowMaterializer (+ PrivacyPriceIndexer)
            -> PrivacyAnonymitySetMaterializer (+ sender enrichment)
```

Advantages:

- each matching chain log is fetched and stored once;
- consumer failures do not roll back source ingestion;
- materializers keep independent progress and retry behavior;
- extractor changes can replay local raw data without RPC backfill;
- additional privacy metrics can reuse the same source; and
- transaction sender enrichment can be cached independently.

Costs:

- a new raw-data schema and retention policy;
- another indexed stage and operational cursor;
- source-configuration ownership/reference counting;
- reorg propagation from source to consumers;
- more database writes and storage;
- two-stage processing latency; and
- a larger migration than the feature currently requires.

If the requirement is genuinely “fetch matching logs once,” this is the clean
option.

## Proposed clean unified design

The following is a design sketch, not code implemented by the current PRs.

### Raw-log record

```ts
interface PrivacyRawLogRecord {
  chain: string
  blockNumber: number
  blockHash: string
  timestamp: UnixTime
  transactionHash: string
  logIndex: number
  address: string
  topics: string[]
  data: string
}
```

Suggested identity:

```text
primary key: chain + transactionHash + logIndex
```

The block hash is still stored so reorg replacement can be detected and
invalidated.

### Source configuration

The raw indexer should track a source such as:

```ts
interface PrivacyLogSourceConfiguration {
  chain: string
  address: string
  topic0: string
  sinceTimestamp: UnixTime
}
```

The stable source identity should exclude `sinceTimestamp`. A changed start
range changes work to perform, not what the source represents.

The active source set is the union required by all consumers. Removing a flow
configuration cannot delete raw logs while an anonymity configuration still
depends on the same source.

### Raw indexer update

```text
1. Select active source configurations for the update range.
2. Group compatible sources per chain.
3. Resolve block boundaries.
4. Fetch the union address/topic filter.
5. Normalize and deduplicate logs.
6. Persist raw logs idempotently.
7. Advance source progress only after persistence.
```

The raw stage performs no price lookup, sender lookup, threshold comparison, or
protocol-facing aggregation.

### Flow materializer

```text
1. Read raw logs covered by proven source progress.
2. Match flow configurations.
3. Decode deposits and withdrawals.
4. Wait for prices required by the range.
5. Write PrivacyFlowEvent.
6. Advance flow progress.
```

### Anonymity materializer

```text
1. Read raw logs covered by proven source progress.
2. Match anonymity deposit configurations.
3. Decode the amount and origin strategy.
4. Resolve only missing transaction senders.
5. Fail the consumer update if a required sender is unavailable.
6. Write PrivacyAnonymitySetEvent.
7. Advance anonymity progress.
```

### Optional sender cache

A durable cache can avoid repeating transaction lookups across reprocessing:

```ts
interface PrivacyTransactionSenderRecord {
  chain: string
  transactionHash: string
  sender: string
}
```

It must not cache provider failures as missing or zero-value data. Failed
lookups remain retryable and do not advance the anonymity consumer.

### Reorg and invalidation behavior

The raw stage owns chain-log invalidation. A reorg or trim should:

```text
invalidate raw logs in the affected block/time range
  -> invalidate flow materializer progress for that range
  -> invalidate anonymity materializer progress for that range
  -> recompute each consumer independently
```

Deleting a business configuration should delete only that consumer’s derived
rows. Raw rows are removed only when outside retention or no active source can
require them.

## Migration path if we choose to unify

A safe migration should avoid changing existing persisted configuration IDs.

1. Add the raw-log table and raw source indexer without changing current
   writers.
2. Backfill raw logs for the union of required sources.
3. Add flow and anonymity materializers that preserve current business
   configuration IDs and table schemas.
4. Run both paths in shadow mode for selected ranges.
5. Compare row counts, amounts, senders, and final managed cursors.
6. Stop the old writers only after deterministic parity.
7. Keep the derived tables and frontend contracts unchanged.

The migration should not infer parity from aggregate totals alone. Compare
individual `(configurationId, txHash, logIndex)` records so duplicate and
missing events are visible.

## Tests required for a unified source

At minimum:

- one raw log matching both consumers is fetched/stored once;
- flow and anonymity materializers independently consume the same raw row;
- sender failure stalls anonymity progress but not raw or flow progress;
- price failure stalls flow progress but not raw or anonymity progress;
- empty source ranges advance and are distinguishable from unindexed ranges;
- adding a threshold creates no source or ingestion reindex;
- removing one consumer leaves shared raw source data intact;
- reorg invalidation rewinds both consumers without stale derived rows;
- a process restart resumes every cursor without relying on memory cache;
- existing flow/anonymity configuration IDs remain unchanged; and
- raw sender data never appears in the public API.

## Decision criteria

Keeping the current two-indexer design is reasonable while:

- there are only two consumers;
- log queries are not the measured bottleneck;
- transaction enrichment dominates anonymity backfill cost;
- extractor replay is rare; and
- independent deployment is valuable.

Shared durable ingestion becomes attractive when:

- provider metrics show overlapping `eth_getLogs` calls are material;
- backfills repeatedly scan the same ranges;
- extractor changes require frequent historical replay;
- a third consumer needs the same logs; or
- the team prefers raw acquisition as a general privacy-indexing boundary.

## Reviewer questions this design should answer

### Why not read anonymity sets from `PrivacyFlowEvent`?

It has no sender and is not a lossless raw-log store. The identity required by
the metric has already been discarded.

### Why not add sender to `PrivacyFlowEvent`?

That still couples sender lookup failure to existing flow progress, changes an
established storage contract, and does not solve the different backfill and
configuration lifecycles.

### Why not fetch the transaction sender inside `PrivacyFlowIndexer` only for
tracked deposits?

It makes one indexer conditionally write two business tables and introduces an
RPC dependency that can stall unrelated withdrawal and pricing metrics.

### Why does anonymity ingestion not depend on `PrivacyBlockTimestampIndexer`?

Flow indexing needs hourly mappings for pricing. Anonymity ingestion needs only
the update boundaries and may start earlier than the flow timestamp clamp.
Using the same hourly parent would expand that backfill solely to serve a daily
consumer.

### Are we claiming duplicate fetching is negligible?

No. It is an explicit trade-off. We should measure it during backfill. The
current choice prioritizes independent correctness and rollout over minimizing
RPC calls before that cost is known.

### Are we opposed to unification?

No. I am happy to unify the pipeline if reviewers prefer it. The recommended
form is shared raw-log acquisition with separate materializers and cursors. I
would avoid a combined business indexer whose transaction or price failure
blocks both outputs.

## Review focus

For the current implementation, the highest-value review questions are:

1. Are the protocol origin semantics correct?
2. Are any missing sender paths able to advance progress?
3. Are existing configuration IDs preserved?
4. Can configuration removal wipe unrelated flow data?
5. Are transaction lookups sufficiently deduplicated and bounded?
6. Does synchronization rely on managed progress rather than sparse events?
7. Is duplicate log fetching acceptable for the initial rollout, or should the
   raw-source design be implemented now?
