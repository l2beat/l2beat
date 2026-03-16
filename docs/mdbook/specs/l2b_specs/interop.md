# Interop

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Overview](#overview)
- [Derived Data Requests](#derived-data-requests)
  - [Problem](#problem)
  - [Core idea](#core-idea)
  - [Lifecycle](#lifecycle)
  - [Why persistence might be needed](#why-persistence-might-be-needed)
  - [Why an in-memory handler is needed](#why-an-in-memory-handler-is-needed)
  - [v1 scope](#v1-scope)
- [Worked Example: OP Stack Deposit Tx Hash Derivation](#worked-example-op-stack-deposit-tx-hash-derivation)
  - [How `sourceHash` is calculated](#how-sourcehash-is-calculated)
  - [How the Base transaction hash is calculated](#how-the-base-transaction-hash-is-calculated)
  - [Why this matters for interop](#why-this-matters-for-interop)
  - [Caveats](#caveats)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

The interop pipeline captures raw blockchain data, converts it into internal `InteropEvent`s, and later matches those events into user-facing messages and transfers.

A concrete OP Stack example is included at the end of this document: an Ethereum deposit into Base via `OptimismPortal`, where the destination transaction emits no logs but its L2 transaction hash can still be derived deterministically from the L1 deposit log.

For resyncable plugins, the capture phase is driven by declarative data requests. This is important because it makes the plugin's external dependencies visible without reading arbitrary TypeScript code. A plugin can state:

- which logs it wants,
- on which chains and addresses,
- and which additional same-transaction context is required.

That model works well for data that can be requested directly by range, such as EVM logs. It is not enough for cases in which processing one captured event reveals that some other piece of data must be fetched later.

This document describes the constrained **v1** design that we want to implement now. It intentionally favors a small amount of code and a small race surface over a fully generic architecture.

The plugin-facing model remains declarative:

- plugins declare derived data requests,
- the runtime handles lookup and routing,
- plugin authors do not manually manage pending work.

However, the internal implementation is intentionally narrower than the fully generic design we may want later.

## Derived Data Requests

### Problem

Some bridges do not emit a matching destination event that can be found by a normal log query. Instead:

1. a source-side event is captured,
2. the plugin computes some future identifier from it,
3. the destination-side proof of execution is only observable as some other data item, for example a transaction by hash.

This creates a problem for resync:

- static event requests are known up front,
- but the transaction hash is only known after a source event has been captured,
- and the chain on which the transaction will appear may already be ahead of the chain that produced the source event.

Without an explicit mechanism for storing and revisiting such follow-up work, the system can miss data during cross-chain catch-up.

### Core idea

To solve this, interop supports **derived data requests**.

A derived data request is a declarative statement that says:

- what kind of follow-up data should be fetched,
- which internal event type can create that request,
- from which event field the lookup key should be extracted,
- and on which chain the lookup should happen.

In v1, the main example is a request of the form:

- "for this captured event, watch for a transaction with this hash on that chain"

Conceptually, the plugin declares two layers of input:

```text
static inputs    -> queried directly from chain history
derived inputs   -> created only after static inputs are processed
```

The key design rule is that the **shape** of the derivation stays declarative even if the **value** is only known at runtime.

In v1, that declarative shape is intentionally narrow:

- only one derived request family exists: transaction lookup for an event-derived tx hash,
- the request is declared as part of `getDataRequests()`,
- the tx hash and target chain are read from top-level fields already stored in `InteropEvent.args`,
- one creator event type can define at most one derived request,
- clusters are supported, but request ownership is always tracked by the exact plugin that produced the creator event.

This keeps the plugin API small while avoiding a large internal framework.

### Lifecycle

The v1 lifecycle of a derived transaction request is:

```text
historical logs / new logs
        |
        v
    capture()
        |
        v
  InteropEvent created
        |
        v
matches derived request definition?
        |
      yes
        |
        v
creator event remains the only persisted source of truth
with "derived request fulfilled?" = false/null
        |
        v
add pending request to in-memory index
        |
        +--> do one targeted historical lookup
        |       |
        |       +--> found: call captureTx with creator context,
        |                  save resulting events,
        |                  mark creator event fulfilled,
        |                  remove from memory
        |       |
        |       +--> not found: keep unresolved creator event
        |                  and keep request active in memory
        |
        v
on restart: rebuild pending requests from unresolved creator events
        |
        v
new blocks arrive on target chain
        |
        v
incoming tx matches active request?
        |
      yes
        |
        v
call captureTx with tx + creator context
        |
        v
save resulting InteropEvents
        |
        v
mark creator event fulfilled
and remove pending request from memory
```

Three points matter here:

First, the historical lookup must happen when the derived request is created, not only when a chain reaches tip. This avoids the case in which chain B is already following new blocks while chain A is still catching up and only later discovers a request that points to an old transaction on chain B.

Second, once the request is checked historically and not found, the system does not repeatedly poll the RPC for that same missing transaction. It relies on normal tip following-mode block processing to eventually see the transaction if it appears later.

Third, as seen on the flow above, the process of checking if a transaction is "interesting" is not something to be done manually in `captureTx`. It happens as part of the block processing flow, and `captureTx` receives the creator event context from the framework.

### Why persistence might be needed

In the fully generic design (which we don't implement in v1), derived requests would be persisted in their own table rather than kept only in memory.

That table can still be a good future direction if derived data requests become common, more than one request must be produced from a single creator event, or we need richer request-local state.

V1 deliberately does **not** introduce that table.

Instead, v1 reuses the existing `InteropEvent` row as the only persisted source of truth:

- unresolved creator events are stored exactly as normal interop events,
- a small fulfillment flag on the creator event says whether the derived request has already been resolved,
- startup reconstructs pending requests by reading unresolved creator events for event types that declare a derived request.

This is less performant and less generic, but it removes a large amount of code:

- no new table,
- no new repository,
- no additional SQL lifecycle to keep in sync,
- no separate persisted request-cleanup logic.

```text
v1 persisted state = creator event row + fulfilled flag
```

The tradeoff is intentional: v1 accepts a narrower model in exchange for simpler code and a smaller operational surface.

### Why an in-memory handler is needed


During Following Mode (i.e. processing every block as it comes) the system may see very large numbers of transactions. For each of them, we need to answer a small question quickly:

```text
is this tx interesting for any active derived request?
```

To make that cheap, each derived request type has a dedicated in-memory handler. The handler:

- rebuilds pending requests from unresolved creator events on startup,
- maintains a compact in-memory index of active tx hashes,
- performs the one-time historical check when a creator event first appears,
- tests whether a newly seen tx is interesting,
- and stays in sync with `InteropEventStore` when creator events are added, fulfilled, matched, unsupported, expired, or deleted.

For transaction-by-hash requests, the efficient index is naturally keyed by transaction hash.

This is intentionally similar in spirit to `InteropEventStore`:

- `InteropEvent` SQL rows are the durable source of truth,
- memory is the fast query surface used during hot-path processing.

The in-memory handler should stay small. V1 does not need a large generic handler framework.

### v1 scope

The initial version should stay narrow:

- only one derived request family is implemented: transaction lookup for an event-derived hash,
- only events create derived requests,
- the transaction hash and target chain are read from fields already stored inside the creator event,
- plugins declare the derivation shape, but they do not perform ad hoc callbacks to build requests,
- one creator event type can define at most one derived request,
- one creator event instance can therefore produce at most one pending derived request,
- the pending request is not persisted in its own table,
- creator-event persistence is reused instead,
- fulfillment is tracked on the creator event itself,
- startup rebuilds pending requests from unresolved creator events,
- generic processing finds matching derived requests and passes the creator context into transaction capture,
- the system does not poll repeatedly for missing tx hashes,
- clusters are supported, but exact plugin ownership is preserved throughout capture and fulfillment.

This is the implementation target for now.

If derived data requests prove important and we need a more general system, the next step should be to introduce a dedicated persistence layer for derived requests. That future version would likely add:

- a dedicated derived-request table,
- support for multiple derived requests per creator event,
- request-local state such as "checked in history",
- more than one derived request family,
- a more generic lifecycle around request persistence and cleanup.

V1 is intentionally smaller than that future direction, but it preserves the same declarative plugin interface so the system can evolve later without forcing plugin authors to rewrite how they declare requests.

## Worked Example: OP Stack Deposit Tx Hash Derivation

One concrete use case for derived data requests is an OP Stack deposit that emits a source-side event on Ethereum, but does not emit any useful destination-side event on the L2 chain.

For the exact case analyzed here:

- source Ethereum transaction: `0x7c76adb9ebe70dfdb57f495c7172b308879f87416ebcc9f2e0438d7fe86a1bee`
- destination Base transaction: `0x95e44b32a03c8e146a9b4a70b3934b4efb48f3f2188e4304dc6e66f52ce4d8b8`
- L1 deposit contract (`OptimismPortal` on Ethereum for Base): `0x49048044D57e1C92A77f79988d21Fa8fAF74E97e`

The Ethereum transaction calls:

```text
depositTransaction(address,uint256,uint64,bool,bytes)
```

and emits:

```text
TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)
```

For this transaction, the emitted event and its L1 log metadata are:

- `from = 0xf70da97812CB96acDF810712Aa562db8dfA3dbEF`
- `to = 0xf70da97812CB96acDF810712Aa562db8dfA3dbEF`
- `version = 0`
- `blockHash = 0x55102b6e8f5ceb9803bfd78b9ec84ffd3e34156c821b7690f4c2b045a9696944`
- `logIndex = 514`
- `opaqueData = 0x000000000000000000000000000000000000000000000004747bc5c731c56846000000000000000000000000000000000000000000000004747bc5c731c5684600000000000186a000`

For deposit event version `0`, `opaqueData` is parsed as:

```text
mint      uint256  = 82180496084697442374
value     uint256  = 82180496084697442374
gas       uint64   = 100000
isCreation uint8   = 0
data      bytes    = 0x
```

That value is `82.180496084697442374 ETH`.

The destination Base transaction is an OP Stack deposit transaction of type `0x7e`. It has no logs, but its hash is deterministic and can be derived from the source log.

### How `sourceHash` is calculated

For a user deposit, OP Stack computes:

```text
depositIdHash = keccak256(l1BlockHash || bytes32(l1LogIndex))
sourceHash    = keccak256(bytes32(0) || depositIdHash)
```

Using the values above:

```text
depositIdHash = keccak256(
  0x55102b6e8f5ceb9803bfd78b9ec84ffd3e34156c821b7690f4c2b045a9696944 ||
  bytes32(514)
)

sourceHash = keccak256(bytes32(0) || depositIdHash)
           = 0xb613781250a490c408694b600c1443b4b0f12e13792551b9aa12703dfb17f879
```

### How the Base transaction hash is calculated

The rollup node derives a deposit transaction with the following logical fields:

```text
[
  sourceHash,
  from,
  to,
  mint,
  value,
  gasLimit,
  isSystemTx,
  data
]
```

For user deposits:

- `from` comes from the emitted event
- `to` comes from the emitted event, unless `isCreation = true`, in which case `to` is empty / `nil`
- `mint`, `value`, `gasLimit`, and `data` come from `opaqueData`
- `isSystemTx = false`

The final L2 transaction hash is then:

```text
l2TxHash = keccak256(0x7e || RLP([
  sourceHash,
  from,
  to,
  mint,
  value,
  gasLimit,
  false,
  data
]))
```

For this example:

```text
l2TxHash = 0x95e44b32a03c8e146a9b4a70b3934b4efb48f3f2188e4304dc6e66f52ce4d8b8
```

which exactly matches the observed Base transaction hash.

### Why this matters for interop

This is a good fit for a derived transaction request:

1. the source Ethereum log is easy to capture historically
2. the destination Base transaction does not have a matching event to query by log filters
3. the destination transaction hash can be derived from the source log, so the runtime can register a follow-up "watch this tx hash on Base" request

### Caveats

- The full L1 transaction is not required if the captured log includes both `blockHash` and `logIndex`. Those two fields are necessary for `sourceHash`.
- Decoded event arguments alone are not sufficient if `blockHash` and `logIndex` were discarded during capture.
- The correct `from` value is the one emitted in `TransactionDeposited`, not necessarily the original L1 transaction sender. If the depositor is a contract, `OptimismPortal` aliases the address before emitting the event.
- The `opaqueData` layout depends on the deposit event `version`. This example is for `version = 0`.
- Contract creation deposits are a special case: when `isCreation = true`, the derived deposit transaction uses an empty `to` field instead of the emitted address.
