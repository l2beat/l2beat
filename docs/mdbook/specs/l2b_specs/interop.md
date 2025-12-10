# Interop
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Introduction](#introduction)
- [Technical overview](#technical-overview)
  - [Event matching](#event-matching)
    - [Matching via correlation key](#matching-via-correlation-key)
    - [Matching logic that can't be serialized into a correlation key](#matching-logic-that-cant-be-serialized-into-a-correlation-key)
    - [Transactions that are composed from more than two events](#transactions-that-are-composed-from-more-than-two-events)
    - [Transaction flows with branching logic](#transaction-flows-with-branching-logic)
    - [Dealing with arrival order](#dealing-with-arrival-order)
    - [Defining correlation key](#defining-correlation-key)
    - [Potential interface for flow visualization](#potential-interface-for-flow-visualization)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

In the most general terms, *Interop* (from "cross-chain *interoperability*") is the internal name for the infrastructure responsible for gathering cross-chain communication and displaying selected statistics to the user. In practice the focus is on cross-chain *token transfers*. The chains can be Ethereum and L2s/L3s, but also other Layer-1 chains, like Solana.

One of the initial goals is to find out which bridges and protocols are most often used, what the transferred values are and how long it takes to finalize the process. 

## Technical overview

Interop infrastructure is faced with problems from multiple domains, especially:

* Complex Event Processing — detecting patterns across multiple streams of events (i.e. matching multiple events of the same transfer occuring on different chains and arriving at different moments)
* Stream Processing - ingestion of events and their continuous processing
* Blockchain Indexing - dealing with blockchain reorgs

Conceptually the process looks like this:

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
│- common type for further processing ("interop event)      │
│- single onchain event can produce multiple interop events │
└────────────────────────────┬──────────────────────────────┘
                             │                               
                             ▼                               
┌───────────────────────────────────────────────────────────┐
│                     Event matching                        │
│                                                           │
│     - efficiently matching an incomming event with        │
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


### Event matching

Event matching is one of the most challenging parts of the processing. Let's take a simple example of a transfer that is represented by two events, one for deposit on the source chain and the other as e.g. withdrawal on the destination chain. As events for multiple protocols and bridges are  gathered, each new incoming event can potentially be a withdrawal event for some deposit event that has already been gathered. Therefore there needs to be a way to correlate the two together, but it must be efficient enough to use it for matching each incoming event with potentially millions of already gathered events.

What makes this problem harder is that a transfer can consist of multiple events (e.g. deposit->transfer->mint->withdrawal), events can "arrive" out of order, there can be a branching logic (e.g. different set of events depending on the token) and a reorg might revert a transfer that has already been identified.

#### Matching via correlation key

The main insight that makes finding pairs of correlated events efficient is that instead of implementing a **function** that compares two events (and in the most naive form would need to be executed for earch pair of events, leading to O(n^2) computational complexity), there should be a function that *returns* a **corellation key** for an event, so that such key can be efficiently *indexed*. For example, if there's a deposit event `A` with fields: 

* `A = { ..., messageId: 123, recipient: 0xabc, amount: $100 }` 

and there's a mint event `B` with fields:

* `B = { ..., sourceMessageId: 123, target: 0xabc }`

and we know they belong to the same transaction if:

* `A.messageId = B.sourceMessageId`, and
* `A.recipient = B.target`

then the **correlation key** for events like `A` (in terms of relation with events like `B`) is:

* `serialized({ A.messageId,  A.recipient })` 

This serialized correlation key can be saved to a database and an efficient *index* can be created for it. Whenever an event like `B` arrives, only a single index lookup is necessary to identify if a matching event `A` exists in the database.

A few questions arise here:

* is the correlation key a propery of an event, or of a relation between two events. 
* should correlation key be unique
* can every correlation be expressed as a correlation key
  
Those will be discussed in the following sections.


#### Matching logic that can't be serialized into a correlation key

There might be a situation when matching logic between two events can't be easily represented as a lookup for a static, serialized value (the correlation key). Extending the previous example imagine, that:

* event A additionally has `A.timestamp` field,
* event B additionally has `B.timestamp` field
* event `A` matches event `B` if `A.timestamp < B.timestamp`, in addition to other constraints

In such example it's not helpful to add `A.timestamp` into the corellation key:

* `correlationKey = serialized({ A.messageId,  A.recipient, A.timestamp })` 

because correlation key as a value is used for equivalence (`=`) check (i.e. it's a key in an index) which doesn't easily support relations like "smaller than", etc.

Important caveat: such situations are much rarer than it might seem and often a correlation key can be constructed even if it's not immediately obvious. If in the example above we wanted to match events that were created before timestamp 123456789 (so that the timestamp is not dependented on `B.timestamp`, but is known up-front), then it's enough to add a field `isBefore123456789` to the corellation key, since it's a boolean, so can be checked for equivalence.

But assuming the corellation check indeed must include relation of fields which can't be represented as a strict equivalence, the process needs to support calling a *matching function* on the subset of events that were found by initial correlation key query. But it's still crucial to strive for constructing the correlation key that will narrow down possible candidates for the matching function to the minimum.

This example also shows that the *correlation key is not necessarily unique* and can be the same for different events of the same type.

#### Transactions that are composed from more than two events

Many cross-chain transactions are mulit-step, with multiple events emitted during the flow. For now let's consider only a flow that is linear, with no branching. Let's take this example flow with events:

- `ContractCallWithToken -> ContractCallApprovedWithMint -> ContractCallExecuted`

It can be noticed that such flow still consists of pairs of correlated events.

- `ContractCallWithToken -> ContractCallApprovedWithMint`, and
- `ContractCallApprovedWithMint -> ContractCallExecuted`

So the idea of using correlation keys for efficiently identifying the transfer still holds and when an event arrives for processing, it needs to be correlated with the directly preceeding or following event in each flow it exists, by using the correlation key.

#### Transaction flows with branching logic

Introducing branching to the flow also doesn't change the way matching would work, e.g.:

```
                Approved_WithMint -> ContractCallExecuted`
              /
 ContractCall
              \
                Approved_WithoutMint -> ContractCallExecuted`
```

Again, in the example above, pairs of events should be matched until a flow is filled. 

This also suggests a logic for the matching engine:

- have all flows defined in some *parsable, declarative format* that represents a directed acyclic graph
- keep ingesting events, casting them into common, normalized *interop events*
- when processing a new interop event:
  - find all flows in which this event occurs
  - use correlation keys matching to see if any full flow has been filled

Having the flows defined in a parsable, declarative format (e.g. YAML or JSON) has this additional property that:
- it will be easy to visualise
- it will be possible to create a visual editor

(comment: I'm not certain, but I have a hunch that there might be an usual case in which events match only if the transfer flow has reach certain stage. This would require building a bit more complex matching engine that would also keep track of the flow "state", and use that state as part of the matching logic. But I'm not sure if that's really the case, or if it's simply an implementation detail.)

#### Dealing with arrival order

We can't be certain that events will arrive into the processing pipeline in order, as they would be defined in the flow, even if that's how it physically happens. There can be many reason for such situation, like delays in intervals of data fetching from different chains, speed of RPC endpoints, bugs, reprocessing scenarios. 

Therefore matching needs to be possible in both directions, again reinforcing the fact that correlation key is part of the connection between events in the flow, not events themselves.

When a new event arrives, the matching engine should try to find flows with that event and iteratively try to "proceed" in both directions, fetching neighbouring events via correlation keys, until some flow is filled from start to finish (or ignore it when it isn't)

#### Defining correlation key

As suggested above, transaction flows should be defined in a declarative way. This strongly suggests that correlation keys *should not be defined on an event*, but rather *on the connection in the flow*. In other words, when a person writes a code that will normalize and cast an event into internal interop event, they might not know which of the fields of the event wll be used as a correlation key. For example, imagine an event with following fields:

- `{ recipient, orderId, timestamp} `

and let's assume that it can be uniquely identified in two ways: via `{ recipient, orderId }` or via `{ recipient, timestamp }`. It's not obvious which field, `orderId` or `timestamp` will be available in the following event.

Therefore **casting and normalization should not define correlation keys** - they should be defined **on connections in the flow**. Casting should only try to extract and normalize as many fields as possible.

By saying "correlation keys" we also must assume that *custom matching functions*, if needed, should also be defined/referenced in the same place.

It also means that there can be multiple correlation keys for the same event.

Additional advantage of having correlation in the flow declaration is that it can be presented graphically and changed graphically.

#### Potential interface for flow visualization

<figure>
    <img src="../../static/assets/interop_ui.svg" alt="Visualisation of interop flow">
    <figcaption>A potential visualisation of an interop transaction flow</figcaption>
</figure>