# Interop
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Introduction](#introduction)
- [Introduction](#introduction-1)
- [Technical overview](#technical-overview)
- [Event matching](#event-matching)
  - [Matching via a correlation key](#matching-via-a-correlation-key)
  - [Matching logic that can't be serialized into a correlation key](#matching-logic-that-cant-be-serialized-into-a-correlation-key)
  - [Transactions that are composed of more than two events](#transactions-that-are-composed-of-more-than-two-events)
  - [Transaction flows with branching logic](#transaction-flows-with-branching-logic)
  - [Simplification of branching logic](#simplification-of-branching-logic)
  - [Handling one-to-many event relations in a flow](#handling-one-to-many-event-relations-in-a-flow)
  - [Dealing with arrival order](#dealing-with-arrival-order)
  - [Defining a correlation key](#defining-a-correlation-key)
  - [Potential interface for flow visualization](#potential-interface-for-flow-visualization)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

In general terms, *Interop* (short for cross-chain *interoperability*) is the internal name for the infrastructure responsible for gathering cross-chain communication and displaying selected statistics to the user. In practice, the focus is on cross-chain *token transfers*. The chains can include Ethereum and L2s/L3s, as well as other Layer-1 chains such as Solana.

One of the initial goals is to determine which bridges and protocols are used most often, what values are transferred, and how long it takes to finalize the process.

## Technical overview

Interop infrastructure faces challenges from multiple domains, in particular:

* Complex Event Processing - detecting patterns across multiple event streams (i.e., matching multiple events of the same transfer occurring on different chains and arriving at different times)
* Stream Processing - ingesting events and processing them continuously
* Blockchain Indexing - dealing with blockchain reorgs

Conceptually, the process looks like this:

```

┌───────────────────────────────────────────────────────────┐
│                     Gathering events                      │
│                                                           │
│     - live/backfill, multiple sources, reorg aware        │
└────────────────────────────┬──────────────────────────────┘
                             │                               
                             ▼                               
┌───────────────────────────────────────────────────────────┐
│                   Event normalization                     │
│                                                           │
│- common type for further processing ("interop event")     │
│- single on-chain event can produce multiple interop events│
└────────────────────────────┬──────────────────────────────┘
                             │                               
                             ▼                               
┌───────────────────────────────────────────────────────────┐
│                     Event matching                        │
│                                                           │
│     - efficiently matching an incoming event with         │
│       potentially millions of gathered events             │
└────────────────────────────┬──────────────────────────────┘
                             │                               
                             ▼                               
┌───────────────────────────────────────────────────────────┐
│                       Analytics                           │
│                                                           │
│ - gathering statistics and enabling efficient querying    │
└───────────────────────────────────────────────────────────┘

```

## Event matching

Event matching is one of the most challenging parts of the pipeline. Consider a simple transfer represented by two events: one for a deposit on the source chain and another for, for example, a withdrawal on the destination chain. Because events for multiple protocols and bridges are gathered, each new incoming event can potentially be a withdrawal event for some deposit event that has already been collected. Therefore, there needs to be a way to correlate the two, and it must be efficient enough to match each incoming event against potentially millions of previously gathered events.

What makes this problem harder is that a transfer can consist of multiple events (e.g., deposit -> transfer -> mint -> withdrawal), events can arrive out of order, there can be branching logic (e.g., a different set of events depending on the token), and a reorg might revert a transfer that has already been identified.

### Matching via a correlation key

The main insight that makes finding pairs of correlated events efficient is that, instead of implementing a **function** that compares two events (which, in the most naive form, would need to be executed for each pair of events, leading to O(n^2) computational complexity), there should be a function that *returns* a **correlation key** for an event so that the key can be efficiently *indexed*. For example, if there is a deposit event `A` with fields:

* `A = { ..., messageId: 123, recipient: 0xabc, amount: $100 }`

and there is a mint event `B` with fields:

* `B = { ..., sourceMessageId: 123, target: 0xabc }`

and we know they belong to the same transaction if:

* `A.messageId = B.sourceMessageId`, and
* `A.recipient = B.target`

then the **correlation key** for events like `A` (in terms of their relation to events like `B`) is:

* `serialized({ A.messageId, A.recipient })`

This serialized correlation key can be saved to a database and an efficient *index* can be created for it. Whenever an event like `B` arrives, only a single index lookup is needed to identify whether a matching event `A` exists in the database.

A few questions arise here:

* Is the correlation key a property of an event, or of a relation between two events?
* Should the correlation key be unique?
* Can every correlation be expressed as a correlation key?

These will be discussed in the following sections.

### Matching logic that can't be serialized into a correlation key

There may be cases where matching logic between two events cannot be easily represented as a lookup for a static, serialized value (the correlation key). Extending the previous example, imagine that:

* event A additionally has an `A.timestamp` field,
* event B additionally has a `B.timestamp` field, and
* event `A` matches event `B` if `A.timestamp < B.timestamp`, in addition to other constraints

In such an example, it is not helpful to add `A.timestamp` into the correlation key:

* `correlationKey = serialized({ A.messageId, A.recipient, A.timestamp })`

because a correlation key, as a value, is used for an equivalence (`=`) check (i.e., it is a key in an index), which does not easily support relations like "smaller than", etc.

Important caveat: such situations are much rarer than they might seem, and a correlation key can often be constructed even if it is not immediately obvious. If, in the example above, we wanted to match events created before timestamp `123456789` (so that the timestamp is not dependent on `B.timestamp`, but is known up front), then it is enough to add a field `isBefore123456789` to the correlation key. Since it is a boolean, it can be checked for equivalence.

However, assuming the correlation check must include a relation between fields that cannot be represented as strict equivalence, the process needs to support calling a *matching function* on the subset of events found by the initial correlation key query. Even then, it is still crucial to construct a correlation key that narrows the candidate set for the matching function as much as possible.

This example also shows that the *correlation key is not necessarily unique* and can be the same for different events of the same type.

### Transactions that are composed of more than two events

Many cross-chain transactions are multi-step, with multiple events emitted during the flow. For now, consider only a flow that is linear, with no branching. Take this example flow with events:

- `ContractCallWithToken -> ContractCallApprovedWithMint -> ContractCallExecuted`

Such a flow still consists of pairs of correlated events:

- `ContractCallWithToken -> ContractCallApprovedWithMint`, and
- `ContractCallApprovedWithMint -> ContractCallExecuted`

So the idea of using correlation keys to identify the transfer efficiently still holds. When an event arrives for processing, it needs to be correlated with the directly preceding or following event in each flow it participates in, using the correlation key.

### Transaction flows with branching logic

Introducing branching into the flow also does not change how matching works, e.g.:

```
              Approved_WithMint -> ContractCallExecuted
            /
ContractCall
            \
              Approved_WithoutMint -> ContractCallExecuted

```

Again, in the example above, pairs of events should be matched until a flow is filled.

This also suggests a general approach for the matching engine:

- Define all flows in a *parsable, declarative format* that represents a directed acyclic graph.
- Keep ingesting events and casting them into a common, normalized *interop event* type.
- When processing a new interop event:
  - Find all flows in which this event occurs.
  - Use correlation key matching to determine whether any full flow has been filled.

Having the flows defined in a parsable, declarative format (e.g., YAML or JSON) also has the additional property that:

- it will be possible to "ask" why a certain event has not created a Transfer (by showing the flow it is part of and the missing events),
- it will be easy to visualize,
- it will be possible to create a visual editor,
- it will be possible to link a transfer to the set of internal events that were matched to create it,
- if the internal events are linked to on-chain events, it will be possible to show which on-chain events yielded the transfer.

(Comment: I am not certain, but I have a hunch that there might be an unusual case in which events match only if the transfer flow has reached a certain stage. This would require a slightly more complex matching engine that also keeps track of flow "state" and uses that state as part of the matching logic. But I am not sure if this is truly the case, or if it is simply an implementation detail.)

### Simplification of branching logic

While it is possible to create flows with:

* branching logic
* complex event relations (combinations of `and` and `or`)

it is easier to implement support for linear flows only, because more complex flows and relations can be represented as many linear flows with `and`-only relations, e.g.

```
              Approved_WithMint -> ContractCallExecuted
            /
ContractCall
            \
              Approved_WithoutMint -> ContractCallExecuted
```

can be represented as two flows:

```
ContractCall -> Approved_WithMint -> ContractCallExecuted

ContractCall -> Approved_WithoutMint -> ContractCallExecuted
```

Also, this relation: `or(and(a=b, c=d), d=e)` can be represented as two relations in separate flows: `and(a=b, c=d)` in one flow and `d=e` in the other.

### Suggestion for implementation

Here's a simple, temporary suggestion for a definition in TypeScript for the following flow:

`LogCreatedOrder ---(orderId=orderId)---> LogFulfilledOrder`

```typescript
const simpleFlow = {
    path: [
      { event: LogCreatedOrder },
      {
        whenEq: [{ prev: 'orderId', next: 'orderId'}], 
        event: LogFulfilledOrder,
      },
      // {
      //   whenEq: [...],
      //   event: ...,
      // },
      // ... and so on
    ],
    processor: this.processSimpleFlow // called with matched events
  }
```

The `whenEq` field would be the one that supports optional *matching function* and additional operations (e.g. *modulo* for "approximate match").

### Handling one-to-many event relations in a flow

It might happen that *multiple interop events* need to be matched with a single subsequent event (or vice-versa). Such scenario is already supported in the solution described above, as the non-unique correlation key (and optional matching function) may return multiple matching events. But in order to prevent false-positives it might be necessary to *explicitly define cardinality on each connection*, or keep 1-to-1 as default, and require a special flag to be set to accept one-to-many relations.

### Dealing with arrival order

We cannot be certain that events will arrive in the processing pipeline in the order defined by the flow, even if that is the order in which they occur on-chain. There can be many reasons for this, such as different polling intervals across chains, varying RPC endpoint performance, bugs, or reprocessing scenarios.

Therefore, matching needs to be possible in both directions, which again reinforces that the correlation key is part of the *connection* between events in the flow, not the events themselves.

When a new event arrives, the matching engine should try to find flows containing that event and iteratively try to proceed in both directions, fetching neighboring events via correlation keys, until some flow is filled end-to-end (or ignore it if it is not).

### Defining a correlation key

As suggested above, transaction flows should be defined declaratively. This strongly suggests that correlation keys *should not be defined on an event*, but rather *on the connection in the flow*. In other words, when someone writes code to normalize and cast an on-chain event into an internal interop event, they might not know which fields will be used as a correlation key. For example, imagine an event with the following fields:

- `{ recipient, orderId, timestamp }`

and assume it can be uniquely identified in two ways: via `{ recipient, orderId }` or via `{ recipient, timestamp }`. It is not obvious which field (`orderId` or `timestamp`) will be available in the following event.

Therefore, **casting and normalization should not define correlation keys** - they should be defined **on connections in the flow**. Casting should only try to extract and normalize as many fields as possible.

When we say "correlation keys", we must also assume that *custom matching functions*, if needed, should be defined or referenced in the same place.

It also means that there can be multiple correlation keys for the same event.

An additional advantage of defining correlations in the flow declaration is that they can be presented graphically and modified graphically.

### Potential interface for flow visualization

<figure>
    <img src="../../static/assets/interop_ui_branching.svg" alt="Visualisation of interop flow">
    <figcaption>A potential visualisation of an interop transaction flow with branching</figcaption>
</figure>

althoug, as mentioned above, it would initially be supported wihtout support for branching:

<figure>
    <img src="../../static/assets/interop_ui_linear.svg" alt="Visualisation of interop flow">
    <figcaption>A potential visualisation of an interop transaction flow witout branching</figcaption>
</figure>