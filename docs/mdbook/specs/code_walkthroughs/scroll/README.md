<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Scroll](#scroll)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Scroll

Scroll is a ZK Rollup that extends Ethereum's capabilities through zero-knowledge technology and EVM compatibility. As a Layer 2 solution, Scroll provides faster and cheaper transactions while maintaining the security guarantees of Ethereum's mainnet.

## Key Features

- **EVM Compatibility**: Full compatibility with Ethereum Virtual Machine, allowing seamless deployment of existing smart contracts
- **ZK Proofs**: Uses zero-knowledge proofs to validate state transitions and ensure data integrity
- **Data Availability**: Transaction data is posted to Ethereum using EIP-4844 blobs or calldata
- **Forced Transactions**: Users can force transactions through L1 when the sequencer fails to process them
- **Enforced Batch Mode**: Permissionless batch submission mechanism activated when certain delay conditions are met

## Architecture Overview

Scroll operates with a centralized sequencer that accepts transactions and generates L2 blocks. The system uses a two-phase approach:

1. **Commitment**: Batches are proposed and their data is made available on L1
2. **Finalization**: Batches are proven valid with ZK proofs and finalized

The protocol includes several key contracts:
- `ScrollChain`: Main rollup contract managing batch lifecycle
- `SystemConfig`: Manages system-wide parameters
- `EnforcedTxGateway`: Handles forced transactions from L1
- `L1MessageQueueV2`: Manages L1 to L2 message queue

This documentation provides detailed walkthroughs of Scroll's core mechanisms, including its proof system, sequencing process, and administrative operations.
