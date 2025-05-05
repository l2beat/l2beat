# Admin operations

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [The `ScrollChain` contract](#the-scrollchain-contract)
  - [`addSequencer` function](#addsequencer-function)
  - [`removeSequencer` function](#removesequencer-function)
  - [`addProver` function](#addprover-function)
  - [`removeProver` function](#removeprover-function)
  - [`updateMaxNumTxInChunk` function](#updatemaxnumtxinchunk-function)
  - [`setPause` function](#setpause-function)
  - [`disableEnforcedBatchMode` function](#disableenforcedbatchmode-function)
  - [`revertBatch` function](#revertbatch-function)
- [The `SystemConfig` contract](#the-systemconfig-contract)
  - [`updateMessageQueueParameters` function](#updatemessagequeueparameters-function)
  - [`updateEnforcedBatchParameters` function](#updateenforcedbatchparameters-function)
  - [`updateSigner` function](#updatesigner-function)
  - [Initialization](#initialization)
- [The `EnforcedTxGateway` contract](#the-enforcedtxgateway-contract)
  - [`setPause` function](#setpause-function-1)
- [The `L1MessageQueueV2` contract](#the-l1messagequeuev2-contract)
  - [Initialization](#initialization-1)
  - [Message Queue Parameters](#message-queue-parameters)
  - [Security Model](#security-model)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The `ScrollChain` contract

The ScrollChain contract maintains data for the Scroll rollup and includes several admin operations that can only be executed by the contract owner.

### `addSequencer` function

This function allows the owner to add an account to the sequencer list.

```solidity
function addSequencer(address _account) external onlyOwner
```

The account must be an EOA (Externally Owned Account) as external services rely on EOA sequencers to decode metadata directly from transaction calldata.

### `removeSequencer` function

This function allows the owner to remove an account from the sequencer list.

```solidity
function removeSequencer(address _account) external onlyOwner
```

### `addProver` function

This function allows the owner to add an account to the prover list.

```solidity
function addProver(address _account) external onlyOwner
```

Similar to sequencers, the account must be an EOA as external services rely on EOA provers to decode metadata from transaction calldata.

### `removeProver` function

This function allows the owner to remove an account from the prover list.

```solidity
function removeProver(address _account) external onlyOwner
```

### `updateMaxNumTxInChunk` function

This function allows the owner to update the maximum number of transactions allowed in each chunk.

```solidity
function updateMaxNumTxInChunk(uint256 _maxNumTxInChunk) external onlyOwner
```

### `setPause` function

This function allows the owner to pause or unpause the contract.

```solidity
function setPause(bool _status) external onlyOwner
```

When paused, certain operations like committing and finalizing batches will be restricted.

### `disableEnforcedBatchMode` function

This function allows the owner to exit from enforced batch mode.

```solidity
function disableEnforcedBatchMode() external onlyOwner
```

The enforced batch mode is automatically enabled when certain conditions are met (like message queue delays) and can only be disabled by the owner.

### `revertBatch` function

This function allows the owner to revert batches that haven't been finalized yet.

```solidity
function revertBatch(bytes calldata batchHeader) external onlyOwner
```

This function can only revert version 7 batches and cannot revert finalized batches. During commit batch, only the last batch hash is stored in storage, so intermediate batches cannot be reverted.

## The `SystemConfig` contract

The SystemConfig contract manages various system-wide parameters for the Scroll rollup. It includes several admin operations that can only be executed by the contract owner.

### `updateMessageQueueParameters` function

This function allows the owner to update parameters related to the message queue.

```solidity
function updateMessageQueueParameters(MessageQueueParameters memory _params) external onlyOwner
```

The parameters include:
- `maxGasLimit`: The maximum gas limit allowed for each L1 message
- `baseFeeOverhead`: The overhead used to calculate L2 base fee
- `baseFeeScalar`: The scalar used to calculate L2 base fee

### `updateEnforcedBatchParameters` function

This function allows the owner to update parameters related to the enforced batch mode.

```solidity
function updateEnforcedBatchParameters(EnforcedBatchParameters memory _params) external onlyOwner
```

The parameters include:
- `maxDelayEnterEnforcedMode`: If no batch has been finalized for this duration, batch submission becomes permissionless
- `maxDelayMessageQueue`: If no message is included/finalized for this duration, batch submission becomes permissionless

### `updateSigner` function

This function allows the owner to update the authorized signer address.

```solidity
function updateSigner(address _newSigner) external onlyOwner
```

The signer is an authorized address that can perform certain privileged operations in the system.

### Initialization

The contract is initialized with the following parameters:

```solidity
function initialize(
    address _owner,
    address _signer,
    MessageQueueParameters memory _messageQueueParameters,
    EnforcedBatchParameters memory _enforcedBatchParameters
) external initializer
```

This function can only be called once during contract deployment and sets up:
- The contract owner
- The initial authorized signer
- Initial message queue parameters
- Initial enforced batch parameters

## The `EnforcedTxGateway` contract

The EnforcedTxGateway contract manages enforced transactions that can be submitted to L2. It includes admin operations that can only be executed by the contract owner.

### `setPause` function

This function allows the owner to pause or unpause the contract.

```solidity
function setPause(bool _status) external onlyOwner
```

When paused, users cannot submit enforced transactions through this gateway.

## The `L1MessageQueueV2` contract

The L1MessageQueueV2 contract manages the queue of L1 to L2 messages after the EuclidV2 upgrade. It includes several admin operations that can only be executed by authorized contracts.

### Initialization

The contract is initialized with the following parameters:

```solidity
function initialize() external initializer
```

This function can only be called once during contract deployment and sets up:
- The initial cross-domain message indices
- The next unfinalized queue index
- The ownership structure

### Message Queue Parameters

The contract relies on parameters from the SystemConfig contract to manage message processing:
- Maximum gas limit for L1 messages
- Base fee overhead and scalar for L2 fee calculation
- Message queue delay parameters

### Security Model

The contract implements a strict permission model where:
- Only the L1ScrollMessenger can append cross-domain messages
- Only the ScrollChain can finalize popped messages
- Only the EnforcedTxGateway can append enforced transactions

