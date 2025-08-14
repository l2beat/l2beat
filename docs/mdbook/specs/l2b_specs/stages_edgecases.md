# Stages edge cases
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Introduction](#introduction)
- [Liveness failure upper bound](#liveness-failure-upper-bound)
  - [Case study 1: Optimism](#case-study-1-optimism)
  - [Case study 2: Scroll](#case-study-2-scroll)
- [Forced transaction delay upper bound](#forced-transaction-delay-upper-bound)
- [Frontrunning risk](#frontrunning-risk)
- [Based preconfs](#based-preconfs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

The goal of this document is to describe certain edge cases that are not explicitly covered by the Stage 1 requirements, either voluntarily or because they were not considered at the time of writing, and start a discussion on how to handle them. The document is not exhaustive, and it is expected that more edge cases will be added in the future.

## Liveness failure upper bound

The new Stage 1 requirement announced [here](https://forum.l2beat.com/t/stages-update-a-high-level-guiding-principle-for-stage-1/338?u=donnoh) is presented as follows:

> ➡️ The only way (other than bugs) for a rollup to indefinitely block an L2→L1 message (e.g. a withdrawal) or push an invalid L2→L1 message (e.g. an invalid withdrawal) is by compromising ≥75% of the Security Council.

> ⚠️ **Assumption**: if the proposer set is open to anyone with enough resources, we assume at least one live proposer at any time (i.e. 1-of-N assumption with unbounded N). We don’t assume it to be non-censoring.

While "indefinitely" corresponds to permanent liveness failures, it is unreasonable to classify chains as Stage 1 if they allow "bounded" liveness failures of a million years, hence the need to define an acceptable upper bound. Bounded liveness failures are allowed in Stage 1 to allow teams to quickly respond to threats by pausing the system and handing over control to the Security Council (SC). 

As a reminder, in the new Stage 1 principle it is assumed that at least a quorum blocking minority of the Security Council is honest and can be trusted to prevent permanent liveness failures. This can either be implemented by allowing the minimum quorum blocking minority or lower to unpause, or indirectly by implementing an expiration mechanism for the pause plus a cooldown mechanism to prevent repeated pauses. If the Security Council minority is employed, no upper bound is needed to be defined. If the second strategy is used, the expiration time defines the upper bound for the liveness failure. A cooldown period of zero would convert any bounded liveness failure into a permanent one, hence the need to define a minimum cooldown period too.

Pause mechanisms can differ, as they can either affect withdrawals, deposits, or both. For this reason, it's worth evaluating whether different upper bounds are needed for each of them.

### Case study 1: Optimism

Optimism describes the way a standard OP stack is supposed to satisfy the new Stage 1 requirements in their [specs](https://specs.optimism.io/protocol/stage-1.html). A "guardian" (i.e. the Security Council in the Superchain) can trigger a pause. The guardian can delegate such role to another actor called the "pause deputy" via a "deputy pause" Safe module. The pause automatically expires and cannot be triggered again unless the mechanism is explicitly reset by the guardian, meaning that the cooldown period is infinite. The pause can either be activated globally (e.g. Superchain-wide pause) or locally to the single chain. The expiration time of a standard OP stack is defined to be 3 months. Since both pauses can be chained, the liveness failure bound is actually 6 months. The guardian can explicitly unpause the system, and if so, the pause mechanism can be reused immediately. In addition to this mechanism, the guardian can always unilaterally revoke the deputy guardian (and with it the deputy pauser) role.

It's important to note that the pause only affects withdrawals, and not deposits or forced transactions. If a user needs to perform any action on the L2, for example to save an open position, they are still allowed to do so after the usual forced transaction delay in the worst case.

### Case study 2: Scroll

At the time of writing, Scroll allows a non-SC actor to pause the system. Scroll is assessed as a Stage 1 system with the old requirements because the Security Council majority can always recover from a malicious pause by revoking the non-SC role that allows to pause the system. With the new requirements, either a minority of the SC should be allowed to unpause and revoke, or the pause should expire. More importantly, the pause mechanism also affects forced transactions as it would not be possible to call the `depositTransaction` function in the `EnforcedTxGateway` contract. In such case, users would not be able to perform any action on the L2.

Let's assume for a moment that these issues with the pause mechanism are fixed. An explicit pause mechanism is not the only way to cause a liveness failure. The protocol currently employs a permissioned sequencer that can ignore forced transactions, up until the "enforced liveness mechanism" gets activated and everyone can then submit and prove blocks. If the delay is 7d, then the mechanism effectively acts as a pause that lasts 7 days and should be handled accordingly.

## Forced transaction delay upper bound

OP stack and Orbit stack notably have a 12h and a 24h max forced transaction delay, respectively. Given that years long delays are unreasonable, an upper bound must be defined. While the forced transaction delay is taken into consideration when calculating exit windows, if a project exclusively relies on a Security Council for upgrades, such delays are not accounted for anywhere. Moreover, some protocols don't have well defined boundaries on the delay, like the recent forced transaction mechanism introduced by Taiko, where in the worst case a forced transaction is processed from the queue every 255 batches, but if the queue is too long, the delay for a specific forced transaction can be much longer.

Given that forced transaction delays effectively act as a temporary pause from the perspective of censored users, it should be considered whether the upper bound value should be aligned with the liveness failure upper bound for sequencing (e.g. 7d).

## Frontrunning risk

Intuition: if there are two permissioned provers, one being a SC minority and one being a non-SC actor, the non-SC might frontrun the SC and prevent them from, for example, enforcing censorship resistance if no other mechanism is present. The threat model should be made more explicit on whether malicious actors have the ability to continuously frontrun other actors. For reference, Arbitrum's BoLD paper is described around this threat model.

## Based preconfs

Pre-Pacaya Taiko uses free-for-all based sequencing, and therefore does not need a forced transaction mechanism. After Pacaya, a "preconf router" can be added with the intent of restricting sequencing rights to a staked whitelist of opted-in L1 proposers. It's important to remember that most of censorship resistance guarantees today come from the long tail of self-building proposers that do not use mev-boost, or in the future by FOCIL. Arguably, proposers that do not opt-in to mev-boost will also not opt-in to stake to the preconf router, and therefore will not be able to provide censorship resistance, and neither would transactions originated from users through FOCIL as the sequencing call is gated. Because of this, the addition of a preconf router suggests the need of an additional forced transaction mechanism.
