// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library LibMap {
    /// @dev A uint32 map in storage.
    struct Uint32Map {
        mapping(uint256 packedIndex => uint256 eightPackedValues) map;
    }

    /// @dev Retrieves the uint32 value at a specific index from the Uint32Map.
    /// @param _map The Uint32Map instance containing the packed uint32 values.
    /// @param _index The index of the uint32 value to retrieve.
    /// @return result The uint32 value at the specified index.
    function get(Uint32Map storage _map, uint256 _index) internal view returns (uint32 result) {
        unchecked {
            // Each storage slot can store 256 bits of data.
            // As uint32 is 32 bits long, 8 uint32s can be packed into one storage slot.
            // Hence, `_index / 8` is done to find the storage slot that contains the required uint32.
            uint256 mapValue = _map.map[_index / 8];

            // First three bits of the original `_index` denotes the position of the uint32 in that slot.
            // So, '(_index & 7) * 32' is done to find the bit position of the uint32 in that storage slot.
            uint256 bitOffset = (_index & 7) * 32;

            // Shift the bits to the right and retrieve the uint32 value.
            result = uint32(mapValue >> bitOffset);
        }
    }

    /// @dev Updates the uint32 value at `_index` in `map`.
    /// @param _map The Uint32Map instance containing the packed uint32 values.
    /// @param _index The index of the uint32 value to set.
    /// @param _value The new value at the specified index.
    function set(Uint32Map storage _map, uint256 _index, uint32 _value) internal {
        unchecked {
            // Each storage slot can store 256 bits of data.
            // As uint32 is 32 bits long, 8 uint32s can be packed into one storage slot.
            // Hence, `_index / 8` is done to find the storage slot that contains the required uint32.
            uint256 mapIndex = _index / 8;
            uint256 mapValue = _map.map[mapIndex];

            // First three bits of the original `_index` denotes the position of the uint32 in that slot.
            // So, '(_index & 7) * 32' is done to find the bit position of the uint32 in that storage slot.
            uint256 bitOffset = (_index & 7) * 32;

            // XORing a value A with B, and then with A again, gives the original value B.
            // We will use this property to update the uint32 value in the slot.

            // Shift the bits to the right and retrieve the uint32 value.
            uint32 oldValue = uint32(mapValue >> bitOffset);

            // Calculate the XOR of the new value and the existing value.
            uint256 newValueXorOldValue = uint256(oldValue ^ _value);

            // Finally, we XOR the slot with the XOR of the new value and the existing value,
            // shifted to its proper position. The XOR operation will effectively replace the old value with the new value.
            _map.map[mapIndex] = (newValueXorOldValue << bitOffset) ^ mapValue;
        }
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract Ownable2Step is Ownable {
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Returns the address of the pending owner.
     */
    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual override {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }

    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        require(pendingOwner() == sender, "Ownable2Step: caller is not the new owner");
        _transferOwnership(sender);
    }
}

interface IZkSyncHyperchainBase {
    /// @return Returns facet name.
    function getName() external view returns (string memory);
}

interface IExecutor is IZkSyncHyperchainBase {
    /// @notice Rollup batch stored data
    /// @param batchNumber Rollup batch number
    /// @param batchHash Hash of L2 batch
    /// @param indexRepeatedStorageChanges The serial number of the shortcut index that's used as a unique identifier for storage keys that were used twice or more
    /// @param numberOfLayer1Txs Number of priority operations to be processed
    /// @param priorityOperationsHash Hash of all priority operations from this batch
    /// @param l2LogsTreeRoot Root hash of tree that contains L2 -> L1 messages from this batch
    /// @param timestamp Rollup batch timestamp, have the same format as Ethereum batch constant
    /// @param commitment Verified input for the zkSync circuit
    struct StoredBatchInfo {
        uint64 batchNumber;
        bytes32 batchHash;
        uint64 indexRepeatedStorageChanges;
        uint256 numberOfLayer1Txs;
        bytes32 priorityOperationsHash;
        bytes32 l2LogsTreeRoot;
        uint256 timestamp;
        bytes32 commitment;
    }

    /// @notice Data needed to commit new batch
    /// @param batchNumber Number of the committed batch
    /// @param timestamp Unix timestamp denoting the start of the batch execution
    /// @param indexRepeatedStorageChanges The serial number of the shortcut index that's used as a unique identifier for storage keys that were used twice or more
    /// @param newStateRoot The state root of the full state tree
    /// @param numberOfLayer1Txs Number of priority operations to be processed
    /// @param priorityOperationsHash Hash of all priority operations from this batch
    /// @param bootloaderHeapInitialContentsHash Hash of the initial contents of the bootloader heap. In practice it serves as the commitment to the transactions in the batch.
    /// @param eventsQueueStateHash Hash of the events queue state. In practice it serves as the commitment to the events in the batch.
    /// @param systemLogs concatenation of all L2 -> L1 system logs in the batch
    /// @param pubdataCommitments Packed pubdata commitments/data.
    /// @dev pubdataCommitments format: This will always start with a 1 byte pubdataSource flag. Current allowed values are 0 (calldata) or 1 (blobs)
    ///                             kzg: list of: opening point (16 bytes) || claimed value (32 bytes) || commitment (48 bytes) || proof (48 bytes) = 144 bytes
    ///                             calldata: pubdataCommitments.length - 1 - 32 bytes of pubdata
    ///                                       and 32 bytes appended to serve as the blob commitment part for the aux output part of the batch commitment
    /// @dev For 2 blobs we will be sending 288 bytes of calldata instead of the full amount for pubdata.
    /// @dev When using calldata, we only need to send one blob commitment since the max number of bytes in calldata fits in a single blob and we can pull the
    ///     linear hash from the system logs
    struct CommitBatchInfo {
        uint64 batchNumber;
        uint64 timestamp;
        uint64 indexRepeatedStorageChanges;
        bytes32 newStateRoot;
        uint256 numberOfLayer1Txs;
        bytes32 priorityOperationsHash;
        bytes32 bootloaderHeapInitialContentsHash;
        bytes32 eventsQueueStateHash;
        bytes systemLogs;
        bytes pubdataCommitments;
    }

    /// @notice Recursive proof input data (individual commitments are constructed onchain)
    struct ProofInput {
        uint256[] recursiveAggregationInput;
        uint256[] serializedProof;
    }

    /// @notice Function called by the operator to commit new batches. It is responsible for:
    /// - Verifying the correctness of their timestamps.
    /// - Processing their L2->L1 logs.
    /// - Storing batch commitments.
    /// @param _lastCommittedBatchData Stored data of the last committed batch.
    /// @param _newBatchesData Data of the new batches to be committed.
    function commitBatches(
        StoredBatchInfo calldata _lastCommittedBatchData,
        CommitBatchInfo[] calldata _newBatchesData
    ) external;

    /// @notice same as `commitBatches` but with the chainId so ValidatorTimelock can sort the inputs.
    function commitBatchesSharedBridge(
        uint256 _chainId,
        StoredBatchInfo calldata _lastCommittedBatchData,
        CommitBatchInfo[] calldata _newBatchesData
    ) external;

    /// @notice Batches commitment verification.
    /// @dev Only verifies batch commitments without any other processing.
    /// @param _prevBatch Stored data of the last committed batch.
    /// @param _committedBatches Stored data of the committed batches.
    /// @param _proof The zero knowledge proof.
    function proveBatches(
        StoredBatchInfo calldata _prevBatch,
        StoredBatchInfo[] calldata _committedBatches,
        ProofInput calldata _proof
    ) external;

    /// @notice same as `proveBatches` but with the chainId so ValidatorTimelock can sort the inputs.
    function proveBatchesSharedBridge(
        uint256 _chainId,
        StoredBatchInfo calldata _prevBatch,
        StoredBatchInfo[] calldata _committedBatches,
        ProofInput calldata _proof
    ) external;

    /// @notice The function called by the operator to finalize (execute) batches. It is responsible for:
    /// - Processing all pending operations (commpleting priority requests).
    /// - Finalizing this batch (i.e. allowing to withdraw funds from the system)
    /// @param _batchesData Data of the batches to be executed.
    function executeBatches(StoredBatchInfo[] calldata _batchesData) external;

    /// @notice same as `executeBatches` but with the chainId so ValidatorTimelock can sort the inputs.
    function executeBatchesSharedBridge(uint256 _chainId, StoredBatchInfo[] calldata _batchesData) external;

    /// @notice Reverts unexecuted batches
    /// @param _newLastBatch batch number after which batches should be reverted
    /// NOTE: Doesn't delete the stored data about batches, but only decreases
    /// counters that are responsible for the number of batches
    function revertBatches(uint256 _newLastBatch) external;

    /// @notice same as `revertBatches` but with the chainId so ValidatorTimelock can sort the inputs.
    function revertBatchesSharedBridge(uint256 _chainId, uint256 _newLastBatch) external;

    /// @notice Event emitted when a batch is committed
    /// @param batchNumber Number of the batch committed
    /// @param batchHash Hash of the L2 batch
    /// @param commitment Calculated input for the zkSync circuit
    /// @dev It has the name "BlockCommit" and not "BatchCommit" due to backward compatibility considerations
    event BlockCommit(uint256 indexed batchNumber, bytes32 indexed batchHash, bytes32 indexed commitment);

    /// @notice Event emitted when batches are verified
    /// @param previousLastVerifiedBatch Batch number of the previous last verified batch
    /// @param currentLastVerifiedBatch Batch number of the current last verified batch
    /// @dev It has the name "BlocksVerification" and not "BatchesVerification" due to backward compatibility considerations
    event BlocksVerification(uint256 indexed previousLastVerifiedBatch, uint256 indexed currentLastVerifiedBatch);

    /// @notice Event emitted when a batch is executed
    /// @param batchNumber Number of the batch executed
    /// @param batchHash Hash of the L2 batch
    /// @param commitment Verified input for the zkSync circuit
    /// @dev It has the name "BlockExecution" and not "BatchExecution" due to backward compatibility considerations
    event BlockExecution(uint256 indexed batchNumber, bytes32 indexed batchHash, bytes32 indexed commitment);

    /// @notice Event emitted when batches are reverted
    /// @param totalBatchesCommitted Total number of committed batches after the revert
    /// @param totalBatchesVerified Total number of verified batches after the revert
    /// @param totalBatchesExecuted Total number of executed batches
    /// @dev It has the name "BlocksRevert" and not "BatchesRevert" due to backward compatibility considerations
    event BlocksRevert(uint256 totalBatchesCommitted, uint256 totalBatchesVerified, uint256 totalBatchesExecuted);
}

contract ValidatorTimelock is IExecutor, Ownable2Step {
    using LibMap for LibMap.Uint32Map;

    /// @dev Part of the IBase interface. Not used in this contract.
    string public constant override getName = "ValidatorTimelock";

    /// @notice The delay between committing and executing batches is changed.
    event NewExecutionDelay(uint256 _newExecutionDelay);

    /// @notice A new validator has been added.
    event ValidatorAdded(uint256 indexed _chainId, address _addedValidator);

    /// @notice A validator has been removed.
    event ValidatorRemoved(uint256 indexed _chainId, address _removedValidator);

    /// @notice Error for when an address is already a validator.
    error AddressAlreadyValidator(uint256 _chainId);

    /// @notice Error for when an address is not a validator.
    error ValidatorDoesNotExist(uint256 _chainId);

    /// @dev The stateTransitionManager smart contract.
    IStateTransitionManager public stateTransitionManager;

    /// @dev The mapping of L2 chainId => batch number => timestamp when it was committed.
    mapping(uint256 chainId => LibMap.Uint32Map batchNumberToTimestampMapping) internal committedBatchTimestamp;

    /// @dev The address that can commit/revert/validate/execute batches.
    mapping(uint256 _chainId => mapping(address _validator => bool)) public validators;

    /// @dev The delay between committing and executing batches.
    uint32 public executionDelay;

    /// @dev Era's chainID
    uint256 immutable ERA_CHAIN_ID;

    constructor(address _initialOwner, uint32 _executionDelay, uint256 _eraChainId) {
        _transferOwnership(_initialOwner);
        executionDelay = _executionDelay;
        ERA_CHAIN_ID = _eraChainId;
    }

    /// @notice Checks if the caller is the admin of the chain.
    modifier onlyChainAdmin(uint256 _chainId) {
        require(msg.sender == stateTransitionManager.getChainAdmin(_chainId), "ValidatorTimelock: only chain admin");
        _;
    }

    /// @notice Checks if the caller is a validator.
    modifier onlyValidator(uint256 _chainId) {
        require(validators[_chainId][msg.sender], "ValidatorTimelock: only validator");
        _;
    }

    /// @dev Sets a new state transition manager.
    function setStateTransitionManager(IStateTransitionManager _stateTransitionManager) external onlyOwner {
        stateTransitionManager = _stateTransitionManager;
    }

    /// @dev Sets an address as a validator.
    function addValidator(uint256 _chainId, address _newValidator) external onlyChainAdmin(_chainId) {
        if (validators[_chainId][_newValidator]) {
            revert AddressAlreadyValidator(_chainId);
        }
        validators[_chainId][_newValidator] = true;
        emit ValidatorAdded(_chainId, _newValidator);
    }

    /// @dev Removes an address as a validator.
    function removeValidator(uint256 _chainId, address _validator) external onlyChainAdmin(_chainId) {
        if (!validators[_chainId][_validator]) {
            revert ValidatorDoesNotExist(_chainId);
        }
        validators[_chainId][_validator] = false;
        emit ValidatorRemoved(_chainId, _validator);
    }

    /// @dev Set the delay between committing and executing batches.
    function setExecutionDelay(uint32 _executionDelay) external onlyOwner {
        executionDelay = _executionDelay;
        emit NewExecutionDelay(_executionDelay);
    }

    /// @dev Returns the timestamp when `_l2BatchNumber` was committed.
    function getCommittedBatchTimestamp(uint256 _chainId, uint256 _l2BatchNumber) external view returns (uint256) {
        return committedBatchTimestamp[_chainId].get(_l2BatchNumber);
    }

    /// @dev Records the timestamp for all provided committed batches and make
    /// a call to the hyperchain diamond contract with the same calldata.
    function commitBatches(
        StoredBatchInfo calldata,
        CommitBatchInfo[] calldata _newBatchesData
    ) external onlyValidator(ERA_CHAIN_ID) {
        _commitBatchesInner(ERA_CHAIN_ID, _newBatchesData);
    }

    /// @dev Records the timestamp for all provided committed batches and make
    /// a call to the hyperchain diamond contract with the same calldata.
    function commitBatchesSharedBridge(
        uint256 _chainId,
        StoredBatchInfo calldata,
        CommitBatchInfo[] calldata _newBatchesData
    ) external onlyValidator(_chainId) {
        _commitBatchesInner(_chainId, _newBatchesData);
    }

    function _commitBatchesInner(uint256 _chainId, CommitBatchInfo[] calldata _newBatchesData) internal {
        unchecked {
            // This contract is only a temporary solution, that hopefully will be disabled until 2106 year, so...
            // It is safe to cast.
            uint32 timestamp = uint32(block.timestamp);
            for (uint256 i = 0; i < _newBatchesData.length; ++i) {
                committedBatchTimestamp[_chainId].set(_newBatchesData[i].batchNumber, timestamp);
            }
        }

        _propagateToZkSyncHyperchain(_chainId);
    }

    /// @dev Make a call to the hyperchain diamond contract with the same calldata.
    /// Note: If the batch is reverted, it needs to be committed first before the execution.
    /// So it's safe to not override the committed batches.
    function revertBatches(uint256) external onlyValidator(ERA_CHAIN_ID) {
        _propagateToZkSyncHyperchain(ERA_CHAIN_ID);
    }

    /// @dev Make a call to the hyperchain diamond contract with the same calldata.
    /// Note: If the batch is reverted, it needs to be committed first before the execution.
    /// So it's safe to not override the committed batches.
    function revertBatchesSharedBridge(uint256 _chainId, uint256) external onlyValidator(_chainId) {
        _propagateToZkSyncHyperchain(_chainId);
    }

    /// @dev Make a call to the hyperchain diamond contract with the same calldata.
    /// Note: We don't track the time when batches are proven, since all information about
    /// the batch is known on the commit stage and the proved is not finalized (may be reverted).
    function proveBatches(
        StoredBatchInfo calldata,
        StoredBatchInfo[] calldata,
        ProofInput calldata
    ) external onlyValidator(ERA_CHAIN_ID) {
        _propagateToZkSyncHyperchain(ERA_CHAIN_ID);
    }

    /// @dev Make a call to the hyperchain diamond contract with the same calldata.
    /// Note: We don't track the time when batches are proven, since all information about
    /// the batch is known on the commit stage and the proved is not finalized (may be reverted).
    function proveBatchesSharedBridge(
        uint256 _chainId,
        StoredBatchInfo calldata,
        StoredBatchInfo[] calldata,
        ProofInput calldata
    ) external onlyValidator(_chainId) {
        _propagateToZkSyncHyperchain(_chainId);
    }

    /// @dev Check that batches were committed at least X time ago and
    /// make a call to the hyperchain diamond contract with the same calldata.
    function executeBatches(StoredBatchInfo[] calldata _newBatchesData) external onlyValidator(ERA_CHAIN_ID) {
        _executeBatchesInner(ERA_CHAIN_ID, _newBatchesData);
    }

    /// @dev Check that batches were committed at least X time ago and
    /// make a call to the hyperchain diamond contract with the same calldata.
    function executeBatchesSharedBridge(
        uint256 _chainId,
        StoredBatchInfo[] calldata _newBatchesData
    ) external onlyValidator(_chainId) {
        _executeBatchesInner(_chainId, _newBatchesData);
    }

    function _executeBatchesInner(uint256 _chainId, StoredBatchInfo[] calldata _newBatchesData) internal {
        uint256 delay = executionDelay; // uint32
        unchecked {
            for (uint256 i = 0; i < _newBatchesData.length; ++i) {
                uint256 commitBatchTimestamp = committedBatchTimestamp[_chainId].get(_newBatchesData[i].batchNumber);

                // Note: if the `commitBatchTimestamp` is zero, that means either:
                // * The batch was committed, but not through this contract.
                // * The batch wasn't committed at all, so execution will fail in the zkSync contract.
                // We allow executing such batches.

                require(block.timestamp >= commitBatchTimestamp + delay, "5c"); // The delay is not passed
            }
        }
        _propagateToZkSyncHyperchain(_chainId);
    }

    /// @dev Call the hyperchain diamond contract with the same calldata as this contract was called.
    /// Note: it is called the hyperchain diamond contract, not delegatecalled!
    function _propagateToZkSyncHyperchain(uint256 _chainId) internal {
        address contractAddress = stateTransitionManager.getHyperchain(_chainId);
        assembly {
            // Copy function signature and arguments from calldata at zero position into memory at pointer position
            calldatacopy(0, 0, calldatasize())
            // Call method of the hyperchain diamond contract returns 0 on error
            let result := call(gas(), contractAddress, 0, 0, calldatasize(), 0, 0)
            // Get the size of the last return data
            let size := returndatasize()
            // Copy the size length of bytes from return data at zero position to pointer position
            returndatacopy(0, 0, size)
            // Depending on the result value
            switch result
            case 0 {
                // End execution and revert state changes
                revert(0, size)
            }
            default {
                // Return data with length of size at pointers position
                return(0, size)
            }
        }
    }
}