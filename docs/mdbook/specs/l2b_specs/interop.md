# Interop
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Introduction](#introduction)

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
│- single onchain even can produce multiple internal events │
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


### Complex Event Processing

test
