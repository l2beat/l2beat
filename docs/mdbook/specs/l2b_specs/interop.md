# Interop
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Introduction](#introduction)
- [Technical overview](#technical-overview)
  - [Event matching](#event-matching)

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

The main insight that makes finding pairs of correlated events efficient is that instead of implementing a **function** that compares two events (and would need to be executed for earch pair of events), there should be a function that *returns* a **corellation key** for an event, so that such key can be efficiently *indexed*. For example, if there's a deposit event `A` with fields: 

* `A = { ..., messageId: 123, recipient: 0xabc, amount: $100 }` 

and there's a mint event `B` with fields:

* `B = { ..., sourceMessageId: 123, target: 0xabc }`

and we know they belong to the same transaction if:

* `A.messageId = B.sourceMessageId`, and
* `A.recipient = B.target`

then the **correlation key** for events like `A` (in terms of relation with events like `B`) is:

* `serialized({ A.messageId,  A.recipient })` 

This serialized correlation key can be saved to a database and an efficient *index* can be created for it. Whenever an event like `B` arrives, only a single index lookup is necessary to identify if a matching event `A` exists in the database.

#### Dealing with arrival order

Continuing the example above, we can't be certain that event `A` will arrive into the processing pipeline before event `B`, even if that's how it physically happened. There can be many reason for such situation, like delays in intervals of data fetching from different chains, speed of RPC endpoints, bugs, reprocessing scenarios. 

... TODO

#### Matching logic that can't be serialized into a correlation key

There might be situation when matching logic between two events can't be easily represented as a lookup for a static, serialized value (the correlation key). For example imagine, that:

* event A additionally has `A.timestamp` field,
* event B additionally has `B.timestamp` field
* event `A` matches event `B` if `A.timestamp < B.timestamp`, in addition to other constraints

In such example

...TODO

Important caveat: such situations are much more rare than it might seem and often a correlation key can be created... TODO...

#### Transactions that are composed by more than two events

...TODO... (here discuss that the correlation key in current problem belongs more properly to the "flow" definition, not any event itself)

#### Transaction flows with branching logic

...TODO
