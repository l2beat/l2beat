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

To make this problem harder, a transfer can consist of multiple events (e.g. deposit->transfer->mint->withdrawal),  they can arrive out of order, there can be a branching logic (e.g. different set of events depending on the token) and a reorg might revert a transfer than has already been identified.

