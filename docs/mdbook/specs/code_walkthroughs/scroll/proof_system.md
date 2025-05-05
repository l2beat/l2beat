<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Proof system [TO BE EXPANDED]](#proof-system-to-be-expanded)
  - [Batch Lifecycle](#batch-lifecycle)
    - [Batch Commitment](#batch-commitment)
    - [Batch Finalization](#batch-finalization)
  - [Enforced Mode](#enforced-mode)
  - [Batch Versions](#batch-versions)
  - [ZK Proof Verification](#zk-proof-verification)
  - [Security Considerations](#security-considerations)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Proof system [TO BE EXPANDED]

Scroll's proof system is built to validate and finalize batches of L2 transactions that are committed on L1. The system uses ZK proofs to validate state transitions and allows for both normal sequencing and enforced batch modes.

## Batch Lifecycle

A batch goes through two main phases:

1. **Commitment**: The batch is proposed and its data is made available on L1
2. **Finalization**: The batch is proven valid with a ZK proof and finalized

### Batch Commitment

Batches can be committed in two ways:

1. Normal sequencing mode via `commitBatchWithBlobProof()` or `commitBatches()`
2. Enforced batch mode via `commitAndFinalizeBatch()`

The key differences are:

- Normal mode requires the sequencer role
- Enforced mode can be triggered by anyone after certain delay conditions are met
- Normal mode separates commitment from finalization
- Enforced mode combines commitment and finalization in one transaction

### Batch Finalization 

Finalization requires a valid ZK proof and can happen through:

1. `finalizeBundleWithProof()` - For pre-EuclidV2 batches
2. `finalizeBundlePostEuclidV2()` - For post-EuclidV2 batches 
3. `commitAndFinalizeBatch()` - For enforced mode batches

The finalization process:

1. Validates the batch exists and hasn't been finalized
2. Verifies the ZK proof against the batch data
3. Updates state roots and withdrawal roots
4. Marks messages as finalized in the L1 message queue

## Enforced Mode

The system can enter enforced mode when either:

1. No batch has been finalized for `maxDelayEnterEnforcedMode` seconds
2. No message has been included for `maxDelayMessageQueue` seconds

In enforced mode:

- The normal sequencer is disabled
- Anyone can submit batches with proofs via `commitAndFinalizeBatch()`
- Only the security council can disable enforced mode

This provides a permissionless fallback mechanism if the sequencer fails or misbehaves.

## Batch Versions

The system supports multiple batch versions with different encodings:

- V0-V6: Pre-EuclidV2 formats using various chunk codecs
- V7+: Post-EuclidV2 formats using blob data

Key version transitions:

- V5: Special Euclid initial batch for ZKT/MPT transition
- V7: EuclidV2 upgrade introducing new batch format

The version determines:

- How batch data is encoded and validated
- Which finalization function to use
- What proofs are required

## ZK Proof Verification

Proofs are verified by the `RollupVerifier` contract which:

1. Takes the batch data and proof as input
2. Validates the proof matches the claimed state transition
3. Returns success/failure

The proof format and verification logic varies by batch version.

## Security Considerations

The system prioritizes security over liveness by allowing batch reversion and enforced mode activation only after a delay.

