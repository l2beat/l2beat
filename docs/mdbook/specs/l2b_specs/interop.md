# Interop

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Overview](#overview)
- [Derived Data Requests](#derived-data-requests)
  - [Problem](#problem)
  - [Core idea](#core-idea)
  - [Lifecycle](#lifecycle)
  - [Why persistence is needed](#why-persistence-is-needed)
  - [Why an in-memory handler is needed](#why-an-in-memory-handler-is-needed)
  - [v1 scope](#v1-scope)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

The interop pipeline captures raw blockchain data, converts it into internal `InteropEvent`s, and later matches those events into user-facing messages and transfers.

For resyncable plugins, the capture phase is driven by declarative data requests. This is important because it makes the plugin's external dependencies visible without reading arbitrary TypeScript code. A plugin can state:

- which logs it wants,
- on which chains and addresses,
- and which additional same-transaction context is required.

That model works well for data that can be requested directly by range, such as EVM logs. It is not enough for cases in which processing one captured event reveals that some other piece of data must be fetched later.

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

### Lifecycle

The lifecycle of a derived transaction request is:

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
persist derived request row
        |
        +--> do one targeted historical lookup
        |       |
        |       +--> found: process immediately, then delete request
        |       |
        |       +--> not found: mark as checked in history
        |
        v
keep request active in memory
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
remove derived request from memory and database
```

Three points matter here:

First, the historical lookup must happen when the derived request is created, not only when a chain reaches tip. This avoids the case in which chain B is already following new blocks while chain A is still catching up and only later discovers a request that points to an old transaction on chain B.

Second, once the request is checked historically and not found, the system does not repeatedly poll the RPC for that same missing transaction. It relies on normal tip following-mode block processing to eventually see the transaction if it appears later. Not only is this more efficient but also saves cost of RPC calls that would have to be made in a loop for transactions by hash.

Third, as seen on the flow above, the process of checking if a transaction is "interesting" (matches a pending derived data request) is not something to be done "manually" in captureTx, but happens as part of the block processing flow, and captureTx will be called with the context of all creators of those derived data request (e.g. the event that requested this transacition by hash)

### Why persistence is needed

Derived requests are persisted in their own table rather than kept only in memory.

This gives the system:

- restart safety,
- a durable record of pending follow-up work,
- correct behavior when chains catch up at different speeds,
- a place to store request-specific state such as "already checked in history".

The table is generic enough to support future request kinds, but each row still keeps enough structured information to route and process it efficiently. In practice, a row is tied to its creator, its request type, its target chain, and some request-specific data payload.

```text
creator (usually event) + request kind + target chain + request data + state
```

The derived request should expire together with the creator event. If the creator event is matched, marked unsupported, expired, or wiped during resync, its derived requests must be removed as well.

### Why an in-memory handler is needed

Persisting requests in SQL is necessary, but consulting SQL for every incoming transaction is too expensive.

During Following Mode (i.e. processing every block as it comes) the system may see very large numbers of transactions. For each of them, we need to answer a small question quickly:

```text
is this tx interesting for any active derived request?
```

To make that cheap, each derived request type has a dedicated in-memory handler. The handler:

- loads relevant request rows on startup,
- maintains a compact in-memory index of active identifiers,
- knows how to perform the one-time historical check,
- knows how to test whether a newly seen tx is interesting,
- and removes fulfilled or invalidated requests from both memory and storage.

For transaction-by-hash requests, the efficient index is naturally keyed by transaction hash.

This is intentionally similar in spirit to `InteropEventStore`:

- SQL is the durable source of truth,
- memory is the fast query surface used during hot-path processing.

### v1 scope

The initial version should stay narrow:

- only one derived request family is implemented: transaction lookup for an event-derived hash,
- only events create derived requests,
- the transaction hash and target chain are read from fields already stored inside the creator event,
- plugins declare the derivation shape, but they do not perform ad hoc callbacks to build requests,
- generic processing finds matching derived requests and passes the creator context into transaction capture.

This keeps the solution declarative, restart-safe, and small, while leaving room for future derived request families if interop later needs to follow other kinds of runtime-discovered inputs.
