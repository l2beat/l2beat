# Arbitrum

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Intro](#intro)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Intro

Arbitrum is a Layer 2 scaling solution for Ethereum that uses Optimistic Rollup technology with a unique proof system called BoLD (Bounded Liquidity Delay). This documentation provides a comprehensive walkthrough of Arbitrum's core components and mechanisms.

### Key Components

Arbitrum's architecture consists of several critical components:

- **Rollup Contracts**: The main rollup logic is split between `RollupUserLogic` (for user interactions) and `RollupAdminLogic` (for administrative functions)
- **Proof System**: BoLD protocol that enables efficient dispute resolution through interactive fraud proofs
- **Sequencing**: Mechanisms for transaction ordering and forced inclusion to prevent censorship
- **Bridge System**: Handles message passing between L1 and L2, including delayed inboxes and outboxes

### Documentation Structure

This section covers:

1. **[Admin Operations](admin_ops.md)**: Administrative functions available to the rollup owner, including contract upgrades, parameter adjustments, and emergency procedures
2. **[Proof System](proof_system.md)**: The BoLD protocol implementation, staking mechanisms, and challenge resolution
3. **[Sequencing](sequencing.md)**: Transaction ordering, forced inclusion mechanisms, and censorship resistance

### Key Features

- **Optimistic Execution**: Transactions are executed optimistically and can be challenged if incorrect
- **Interactive Fraud Proofs**: Disputes are resolved through a multi-step interactive process
- **Censorship Resistance**: Users can force transaction inclusion through L1 if needed
- **Flexible Governance**: Admin functions allow for protocol upgrades and parameter adjustments
