// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library BatchDecoder {
    /// @notice The currently supported encoding version.
    uint8 internal constant SUPPORTED_ENCODING_VERSION = 0;

    /// @notice Decodes commit data from a calldata bytes into the last committed batch data and an array of new batch data.
    /// @param _commitData The calldata byte array containing the data for committing batches.
    /// @return lastCommittedBatchData The data for the batch before newly committed batches.
    /// @return newBatchesData An array containing the newly committed batches.
    function _decodeCommitData(
        bytes calldata _commitData
    )
        private
        pure
        returns (
            IExecutor.StoredBatchInfo memory lastCommittedBatchData,
            IExecutor.CommitBatchInfo[] memory newBatchesData
        )
    {
        if (_commitData.length == 0) {
            revert EmptyData();
        }

        uint8 encodingVersion = uint8(_commitData[0]);
        if (encodingVersion == SUPPORTED_ENCODING_VERSION) {
            (lastCommittedBatchData, newBatchesData) = abi.decode(
                _commitData[1:],
                (IExecutor.StoredBatchInfo, IExecutor.CommitBatchInfo[])
            );
        } else {
            revert UnsupportedCommitBatchEncoding(encodingVersion);
        }
    }

    /// @notice Decodes the commit data and checks that the provided batch bounds are correct.
    /// @dev Note that it only checks that the last and the first batches in the array correspond to the provided bounds.
    /// The fact that the batches inside the array are provided in the correct order should be checked by the caller.
    /// @param _commitData The calldata byte array containing the data for committing batches.
    /// @param _processBatchFrom The expected batch number of the first commit batch in the array.
    /// @param _processBatchTo The expected batch number of the last commit batch in the array.
    /// @return lastCommittedBatchData The data for the batch before newly committed batches.
    /// @return newBatchesData An array containing the newly committed batches.
    function decodeAndCheckCommitData(
        bytes calldata _commitData,
        uint256 _processBatchFrom,
        uint256 _processBatchTo
    )
        internal
        pure
        returns (
            IExecutor.StoredBatchInfo memory lastCommittedBatchData,
            IExecutor.CommitBatchInfo[] memory newBatchesData
        )
    {
        (lastCommittedBatchData, newBatchesData) = _decodeCommitData(_commitData);

        if (newBatchesData.length == 0) {
            revert EmptyData();
        }

        if (
            newBatchesData[0].batchNumber != _processBatchFrom ||
            newBatchesData[newBatchesData.length - 1].batchNumber != _processBatchTo
        ) {
            revert IncorrectBatchBounds(
                _processBatchFrom,
                _processBatchTo,
                newBatchesData[0].batchNumber,
                newBatchesData[newBatchesData.length - 1].batchNumber
            );
        }
    }

    /// @notice Decodes proof data from a calldata byte array into the previous batch, an array of proved batches, and a proof array.
    /// @param _proofData The calldata byte array containing the data for proving batches.
    /// @return prevBatch The batch information before the batches to be verified.
    /// @return provedBatches An array containing the the batches to be verified.
    /// @return proof An array containing the proof for the verifier.
    function _decodeProofData(
        bytes calldata _proofData
    )
        private
        pure
        returns (
            IExecutor.StoredBatchInfo memory prevBatch,
            IExecutor.StoredBatchInfo[] memory provedBatches,
            uint256[] memory proof
        )
    {
        uint8 encodingVersion = uint8(_proofData[0]);
        if (encodingVersion == SUPPORTED_ENCODING_VERSION) {
            (prevBatch, provedBatches, proof) = abi.decode(
                _proofData[1:],
                (IExecutor.StoredBatchInfo, IExecutor.StoredBatchInfo[], uint256[])
            );
        } else {
            revert UnsupportedProofBatchEncoding(encodingVersion);
        }
    }

    /// @notice Decodes the commit data and checks that the provided batch bounds are correct.
    /// @dev Note that it only checks that the last and the first batches in the array correspond to the provided bounds.
    /// The fact that the batches inside the array are provided in the correct order should be checked by the caller.
    /// @param _proofData The commit data to decode.
    /// @param _processBatchFrom The expected batch number of the first batch in the array.
    /// @param _processBatchTo The expected batch number of the last batch in the array.
    /// @return prevBatch The batch information before the batches to be verified.
    /// @return provedBatches An array containing the the batches to be verified.
    /// @return proof An array containing the proof for the verifier.
    function decodeAndCheckProofData(
        bytes calldata _proofData,
        uint256 _processBatchFrom,
        uint256 _processBatchTo
    )
        internal
        pure
        returns (
            IExecutor.StoredBatchInfo memory prevBatch,
            IExecutor.StoredBatchInfo[] memory provedBatches,
            uint256[] memory proof
        )
    {
        (prevBatch, provedBatches, proof) = _decodeProofData(_proofData);

        if (provedBatches.length == 0) {
            revert EmptyData();
        }

        if (
            provedBatches[0].batchNumber != _processBatchFrom ||
            provedBatches[provedBatches.length - 1].batchNumber != _processBatchTo
        ) {
            revert IncorrectBatchBounds(
                _processBatchFrom,
                _processBatchTo,
                provedBatches[0].batchNumber,
                provedBatches[provedBatches.length - 1].batchNumber
            );
        }
    }

    /// @notice Decodes execution data from a calldata byte array into an array of stored batch information.
    /// @param _executeData The calldata byte array containing the execution data to decode.
    /// @return executeData An array containing the stored batch information for execution.
    /// @return priorityOpsData Merkle proofs of the priority operations for each batch.
    function _decodeExecuteData(
        bytes calldata _executeData
    )
        private
        pure
        returns (IExecutor.StoredBatchInfo[] memory executeData, PriorityOpsBatchInfo[] memory priorityOpsData)
    {
        if (_executeData.length == 0) {
            revert EmptyData();
        }

        uint8 encodingVersion = uint8(_executeData[0]);
        if (encodingVersion == SUPPORTED_ENCODING_VERSION) {
            (executeData, priorityOpsData) = abi.decode(
                _executeData[1:],
                (IExecutor.StoredBatchInfo[], PriorityOpsBatchInfo[])
            );
        } else {
            revert UnsupportedExecuteBatchEncoding(encodingVersion);
        }
    }

    /// @notice Decodes the execute data and checks that the provided batch bounds are correct.
    /// @dev Note that it only checks that the last and the first batches in the array correspond to the provided bounds.
    /// The fact that the batches inside the array are provided in the correct order should be checked by the caller.
    /// @param _executeData The calldata byte array containing the execution data to decode.
    /// @param _processBatchFrom The expected batch number of the first batch in the array.
    /// @param _processBatchTo The expected batch number of the last batch in the array.
    /// @return executeData An array containing the stored batch information for execution.
    /// @return priorityOpsData Merkle proofs of the priority operations for each batch.
    function decodeAndCheckExecuteData(
        bytes calldata _executeData,
        uint256 _processBatchFrom,
        uint256 _processBatchTo
    )
        internal
        pure
        returns (IExecutor.StoredBatchInfo[] memory executeData, PriorityOpsBatchInfo[] memory priorityOpsData)
    {
        (executeData, priorityOpsData) = _decodeExecuteData(_executeData);

        if (executeData.length == 0) {
            revert EmptyData();
        }

        if (
            executeData[0].batchNumber != _processBatchFrom ||
            executeData[executeData.length - 1].batchNumber != _processBatchTo
        ) {
            revert IncorrectBatchBounds(
                _processBatchFrom,
                _processBatchTo,
                executeData[0].batchNumber,
                executeData[executeData.length - 1].batchNumber
            );
        }
    }
}

enum SystemLogKey {
    L2_TO_L1_LOGS_TREE_ROOT_KEY,
    PACKED_BATCH_AND_L2_BLOCK_TIMESTAMP_KEY,
    CHAINED_PRIORITY_TXN_HASH_KEY,
    NUMBER_OF_LAYER_1_TXS_KEY,
    // Note, that it is important that `PREV_BATCH_HASH_KEY` has position
    // `4` since it is the same as it was in the previous protocol version and
    // it is the only one that is emitted before the system contracts are upgraded.
    PREV_BATCH_HASH_KEY,
    L2_DA_VALIDATOR_OUTPUT_HASH_KEY,
    USED_L2_DA_VALIDATOR_ADDRESS_KEY,
    EXPECTED_SYSTEM_CONTRACT_UPGRADE_TX_HASH_KEY
}

library UnsafeBytes {
    function readUint32(bytes memory _bytes, uint256 _start) internal pure returns (uint32 result, uint256 offset) {
        assembly {
            offset := add(_start, 4)
            result := mload(add(_bytes, offset))
        }
    }

    function readAddress(bytes memory _bytes, uint256 _start) internal pure returns (address result, uint256 offset) {
        assembly {
            offset := add(_start, 20)
            result := mload(add(_bytes, offset))
        }
    }

    function readUint256(bytes memory _bytes, uint256 _start) internal pure returns (uint256 result, uint256 offset) {
        assembly {
            offset := add(_start, 32)
            result := mload(add(_bytes, offset))
        }
    }

    function readBytes32(bytes memory _bytes, uint256 _start) internal pure returns (bytes32 result, uint256 offset) {
        assembly {
            offset := add(_start, 32)
            result := mload(add(_bytes, offset))
        }
    }

    function readRemainingBytes(bytes memory _bytes, uint256 _start) internal pure returns (bytes memory result) {
        uint256 arrayLen = _bytes.length - _start;
        result = new bytes(arrayLen);

        assembly {
            mcopy(add(result, 0x20), add(_bytes, add(0x20, _start)), arrayLen)
        }
    }
}

struct L1DAValidatorOutput {
    /// @dev The hash of the uncompressed state diff.
    bytes32 stateDiffHash;
    /// @dev The hashes of the blobs on L1. The array is dynamic to account for forward compatibility.
    /// The length of it must be equal to `maxBlobsSupported`.
    bytes32[] blobsLinearHashes;
    /// @dev The commitments to the blobs on L1. The array is dynamic to account for forward compatibility.
    /// Its length must be equal to the length of blobsLinearHashes.
    /// @dev If the system supports more blobs than returned, the rest of the array should be filled with zeros.
    bytes32[] blobsOpeningCommitments;
}

struct LogProcessingOutput {
    uint256 numberOfLayer1Txs;
    bytes32 chainedPriorityTxsHash;
    bytes32 previousBatchHash;
    bytes32 pubdataHash;
    bytes32 stateDiffHash;
    bytes32 l2LogsTreeRoot;
    uint256 packedBatchAndL2BlockTimestamp;
    bytes32 l2DAValidatorOutputHash;
}

interface IZKChainBase {
    /// @return Returns facet name.
    function getName() external view returns (string memory);
}

interface IExecutor is IZKChainBase {
    /// @notice Rollup batch stored data
    /// @param batchNumber Rollup batch number
    /// @param batchHash Hash of L2 batch
    /// @param indexRepeatedStorageChanges The serial number of the shortcut index that's used as a unique identifier for storage keys that were used twice or more
    /// @param numberOfLayer1Txs Number of priority operations to be processed
    /// @param priorityOperationsHash Hash of all priority operations from this batch
    /// @param l2LogsTreeRoot Root hash of tree that contains L2 -> L1 messages from this batch
    /// @param timestamp Rollup batch timestamp, have the same format as Ethereum batch constant
    /// @param commitment Verified input for the ZKsync circuit
    // solhint-disable-next-line gas-struct-packing
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
    /// @param operatorDAInput Packed pubdata commitments/data.
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
        bytes operatorDAInput;
    }

    /// @notice Function called by the operator to commit new batches. It is responsible for:
    /// - Verifying the correctness of their timestamps.
    /// - Processing their L2->L1 logs.
    /// - Storing batch commitments.
    /// @param _chainId Chain ID of the chain.
    /// @param _processFrom The batch number from which the processing starts.
    /// @param _processTo The batch number at which the processing ends.
    /// @param _commitData The encoded data of the new batches to be committed.
    function commitBatchesSharedBridge(
        uint256 _chainId,
        uint256 _processFrom,
        uint256 _processTo,
        bytes calldata _commitData
    ) external;

    /// @notice Batches commitment verification.
    /// @dev Only verifies batch commitments without any other processing.
    /// @param _chainId Chain ID of the chain.
    /// @param _processBatchFrom The batch number from which the verification starts.
    /// @param _processBatchTo The batch number at which the verification ends.
    /// @param _proofData The encoded data of the new batches to be verified.
    function proveBatchesSharedBridge(
        uint256 _chainId,
        uint256 _processBatchFrom,
        uint256 _processBatchTo,
        bytes calldata _proofData
    ) external;

    /// @notice The function called by the operator to finalize (execute) batches. It is responsible for:
    /// - Processing all pending operations (commpleting priority requests).
    /// - Finalizing this batch (i.e. allowing to withdraw funds from the system)
    /// @param _chainId Chain ID of the chain.
    /// @param _processFrom The batch number from which the execution starts.
    /// @param _processTo The batch number at which the execution ends.
    /// @param _executeData The encoded data of the new batches to be executed.
    function executeBatchesSharedBridge(
        uint256 _chainId,
        uint256 _processFrom,
        uint256 _processTo,
        bytes calldata _executeData
    ) external;

    /// @notice Reverts unexecuted batches
    /// @param _chainId Chain ID of the chain
    /// @param _newLastBatch batch number after which batches should be reverted
    /// NOTE: Doesn't delete the stored data about batches, but only decreases
    /// counters that are responsible for the number of batches
    function revertBatchesSharedBridge(uint256 _chainId, uint256 _newLastBatch) external;

    /// @notice Event emitted when a batch is committed
    /// @param batchNumber Number of the batch committed
    /// @param batchHash Hash of the L2 batch
    /// @param commitment Calculated input for the ZKsync circuit
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
    /// @param commitment Verified input for the ZKsync circuit
    /// @dev It has the name "BlockExecution" and not "BatchExecution" due to backward compatibility considerations
    event BlockExecution(uint256 indexed batchNumber, bytes32 indexed batchHash, bytes32 indexed commitment);

    /// @notice Event emitted when batches are reverted
    /// @param totalBatchesCommitted Total number of committed batches after the revert
    /// @param totalBatchesVerified Total number of verified batches after the revert
    /// @param totalBatchesExecuted Total number of executed batches
    /// @dev It has the name "BlocksRevert" and not "BatchesRevert" due to backward compatibility considerations
    event BlocksRevert(uint256 totalBatchesCommitted, uint256 totalBatchesVerified, uint256 totalBatchesExecuted);
}

abstract contract ReentrancyGuard {
    /// @dev Address of lock flag variable.
    /// @dev Flag is placed at random memory location to not interfere with Storage contract.
    // keccak256("ReentrancyGuard") - 1;
    uint256 private constant LOCK_FLAG_ADDRESS = 0x8e94fed44239eb2314ab7a406345e6c5a8f0ccedf3b600de3d004e672c33abf4;

    // solhint-disable-next-line max-line-length
    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/566a774222707e424896c0c390a84dc3c13bdcb2/contracts/security/ReentrancyGuard.sol
    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    modifier reentrancyGuardInitializer() {
        _initializeReentrancyGuard();
        _;
    }

    function _initializeReentrancyGuard() private {
        uint256 lockSlotOldValue;

        // Storing an initial non-zero value makes deployment a bit more
        // expensive but in exchange every call to nonReentrant
        // will be cheaper.
        assembly {
            lockSlotOldValue := sload(LOCK_FLAG_ADDRESS)
            sstore(LOCK_FLAG_ADDRESS, _NOT_ENTERED)
        }

        // Check that storage slot for reentrancy guard is empty to rule out possibility of slot conflict
        if (lockSlotOldValue != 0) {
            revert SlotOccupied();
        }
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and make it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        uint256 _status;
        assembly {
            _status := sload(LOCK_FLAG_ADDRESS)
        }

        if (_status == 0) {
            revert NotInitializedReentrancyGuard();
        }
        // On the first call to nonReentrant, _NOT_ENTERED will be true
        if (_status != _NOT_ENTERED) {
            revert Reentrancy();
        }

        // Any calls to nonReentrant after this point will fail
        assembly {
            sstore(LOCK_FLAG_ADDRESS, _ENTERED)
        }

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        assembly {
            sstore(LOCK_FLAG_ADDRESS, _NOT_ENTERED)
        }
    }
}

struct PriorityOperation {
    bytes32 canonicalTxHash;
    uint64 expirationTimestamp;
    uint192 layer2Tip;
}

library PriorityQueue {
    using PriorityQueue for Queue;

    /// @notice Container that stores priority operations
    /// @param data The inner mapping that saves priority operation by its index
    /// @param head The pointer to the first unprocessed priority operation, equal to the tail if the queue is empty
    /// @param tail The pointer to the free slot
    struct Queue {
        mapping(uint256 priorityOpId => PriorityOperation priorityOp) data;
        uint256 tail;
        uint256 head;
    }

    /// @notice Returns zero if and only if no operations were processed from the queue
    /// @return Index of the oldest priority operation that wasn't processed yet
    function getFirstUnprocessedPriorityTx(Queue storage _queue) internal view returns (uint256) {
        return _queue.head;
    }

    /// @return The total number of priority operations that were added to the priority queue, including all processed ones
    function getTotalPriorityTxs(Queue storage _queue) internal view returns (uint256) {
        return _queue.tail;
    }

    /// @return The total number of unprocessed priority operations in a priority queue
    function getSize(Queue storage _queue) internal view returns (uint256) {
        return uint256(_queue.tail - _queue.head);
    }

    /// @return Whether the priority queue contains no operations
    function isEmpty(Queue storage _queue) internal view returns (bool) {
        return _queue.tail == _queue.head;
    }

    /// @notice Add the priority operation to the end of the priority queue
    function pushBack(Queue storage _queue, PriorityOperation memory _operation) internal {
        // Save value into the stack to avoid double reading from the storage
        uint256 tail = _queue.tail;

        _queue.data[tail] = _operation;
        _queue.tail = tail + 1;
    }

    /// @return The first unprocessed priority operation from the queue
    function front(Queue storage _queue) internal view returns (PriorityOperation memory) {
        // priority queue is empty
        if (_queue.isEmpty()) {
            revert QueueIsEmpty();
        }

        return _queue.data[_queue.head];
    }

    /// @notice Remove the first unprocessed priority operation from the queue
    /// @return priorityOperation that was popped from the priority queue
    function popFront(Queue storage _queue) internal returns (PriorityOperation memory priorityOperation) {
        // priority queue is empty
        if (_queue.isEmpty()) {
            revert QueueIsEmpty();
        }

        // Save value into the stack to avoid double reading from the storage
        uint256 head = _queue.head;

        priorityOperation = _queue.data[head];
        delete _queue.data[head];
        _queue.head = head + 1;
    }
}

struct VerifierParams {
    bytes32 recursionNodeLevelVkHash;
    bytes32 recursionLeafLevelVkHash;
    bytes32 recursionCircuitsSetVksHash;
}

enum UpgradeState {
    None,
    Transparent,
    Shadow
}

struct UpgradeStorage {
    bytes32 proposedUpgradeHash;
    UpgradeState state;
    address securityCouncil;
    bool approvedBySecurityCouncil;
    uint40 proposedUpgradeTimestamp;
    uint40 currentProposalId;
}

enum PubdataPricingMode {
    Rollup,
    Validium
}

struct FeeParams {
    PubdataPricingMode pubdataPricingMode;
    uint32 batchOverheadL1Gas;
    uint32 maxPubdataPerBatch;
    uint32 maxL2GasPerBatch;
    uint32 priorityTxMaxPubdata;
    uint64 minimalL2GasPrice;
}

library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }
}

library Math {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds up instead
     * of rounding down.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
     * with further edits by Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            require(denominator > prod1, "Math: mulDiv overflow");

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
            // See https://cs.stackexchange.com/q/138556/92363.

            // Does not overflow because the denominator cannot be zero at this stage in the function.
            uint256 twos = denominator & (~denominator + 1);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
            // in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256, rounded down, of a positive value.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
        }
    }
}

library Arrays {
    using StorageSlot for bytes32;

    /**
     * @dev Searches a sorted `array` and returns the first index that contains
     * a value greater or equal to `element`. If no such index exists (i.e. all
     * values in the array are strictly less than `element`), the array length is
     * returned. Time complexity O(log n).
     *
     * `array` is expected to be sorted in ascending order, and to contain no
     * repeated elements.
     */
    function findUpperBound(uint256[] storage array, uint256 element) internal view returns (uint256) {
        if (array.length == 0) {
            return 0;
        }

        uint256 low = 0;
        uint256 high = array.length;

        while (low < high) {
            uint256 mid = Math.average(low, high);

            // Note that mid will always be strictly less than high (i.e. it will be a valid array index)
            // because Math.average rounds down (it does integer division with truncation).
            if (unsafeAccess(array, mid).value > element) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        // At this point `low` is the exclusive upper bound. We will return the inclusive upper bound.
        if (low > 0 && unsafeAccess(array, low - 1).value == element) {
            return low - 1;
        } else {
            return low;
        }
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(address[] storage arr, uint256 pos) internal pure returns (StorageSlot.AddressSlot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getAddressSlot();
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(bytes32[] storage arr, uint256 pos) internal pure returns (StorageSlot.Bytes32Slot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getBytes32Slot();
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(uint256[] storage arr, uint256 pos) internal pure returns (StorageSlot.Uint256Slot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getUint256Slot();
    }
}

library DynamicIncrementalMerkle {
    /**
     * @dev A complete `bytes32` Merkle tree.
     *
     * The `sides` and `zero` arrays are set to have a length equal to the depth of the tree during setup.
     *
     * Struct members have an underscore prefix indicating that they are "private" and should not be read or written to
     * directly. Use the functions provided below instead. Modifying the struct manually may violate assumptions and
     * lead to unexpected behavior.
     *
     * NOTE: The `root` and the updates history is not stored within the tree. Consider using a secondary structure to
     * store a list of historical roots from the values returned from {setup} and {push} (e.g. a mapping, {BitMaps} or
     * {Checkpoints}).
     *
     * WARNING: Updating any of the tree's parameters after the first insertion will result in a corrupted tree.
     */
    struct Bytes32PushTree {
        uint256 _nextLeafIndex;
        bytes32[] _sides;
        bytes32[] _zeros;
    }

    /**
     * @dev Initialize a {Bytes32PushTree} using {Hashes-Keccak256} to hash internal nodes.
     * The capacity of the tree (i.e. number of leaves) is set to `2**levels`.
     *
     * IMPORTANT: The zero value should be carefully chosen since it will be stored in the tree representing
     * empty leaves. It should be a value that is not expected to be part of the tree.
     */
    function setup(Bytes32PushTree storage self, bytes32 zero) internal returns (bytes32 initialRoot) {
        self._nextLeafIndex = 0;
        self._zeros.push(zero);
        self._sides.push(bytes32(0));
        return bytes32(0);
    }

    /**
     * @dev Resets the tree to a blank state.
     * Calling this function on MerkleTree that was already setup and used will reset it to a blank state.
     * @param zero The value that represents an empty leaf.
     * @return initialRoot The initial root of the tree.
     */
    function reset(Bytes32PushTree storage self, bytes32 zero) internal returns (bytes32 initialRoot) {
        self._nextLeafIndex = 0;
        uint256 length = self._zeros.length;
        for (uint256 i = length; 0 < i; --i) {
            self._zeros.pop();
        }
        length = self._sides.length;
        for (uint256 i = length; 0 < i; --i) {
            self._sides.pop();
        }
        self._zeros.push(zero);
        self._sides.push(bytes32(0));
        return bytes32(0);
    }

    /**
     * @dev Insert a new leaf in the tree, and compute the new root. Returns the position of the inserted leaf in the
     * tree, and the resulting root.
     *
     * Hashing the leaf before calling this function is recommended as a protection against
     * second pre-image attacks.
     */
    function push(Bytes32PushTree storage self, bytes32 leaf) internal returns (uint256 index, bytes32 newRoot) {
        // Cache read
        uint256 levels = self._zeros.length - 1;

        // Get leaf index
        // solhint-disable-next-line gas-increment-by-one
        index = self._nextLeafIndex++;

        // Check if tree is full.
        if (index == 1 << levels) {
            bytes32 zero = self._zeros[levels];
            bytes32 newZero = Merkle.efficientHash(zero, zero);
            self._zeros.push(newZero);
            self._sides.push(bytes32(0));
            ++levels;
        }

        // Rebuild branch from leaf to root
        uint256 currentIndex = index;
        bytes32 currentLevelHash = leaf;
        bool updatedSides = false;
        for (uint32 i = 0; i < levels; ++i) {
            // Reaching the parent node, is currentLevelHash the left child?
            bool isLeft = currentIndex % 2 == 0;

            // If so, next time we will come from the right, so we need to save it
            if (isLeft && !updatedSides) {
                Arrays.unsafeAccess(self._sides, i).value = currentLevelHash;
                updatedSides = true;
            }

            // Compute the current node hash by using the hash function
            // with either its sibling (side) or the zero value for that level.
            currentLevelHash = Merkle.efficientHash(
                isLeft ? currentLevelHash : Arrays.unsafeAccess(self._sides, i).value,
                isLeft ? Arrays.unsafeAccess(self._zeros, i).value : currentLevelHash
            );

            // Update node index
            currentIndex >>= 1;
        }

        Arrays.unsafeAccess(self._sides, levels).value = currentLevelHash;
        return (index, currentLevelHash);
    }

    /**
     * @dev Tree's root.
     */
    function root(Bytes32PushTree storage self) internal view returns (bytes32) {
        return Arrays.unsafeAccess(self._sides, self._sides.length - 1).value;
    }

    /**
     * @dev Tree's height (does not include the root node).
     */
    function height(Bytes32PushTree storage self) internal view returns (uint256) {
        return self._sides.length - 1;
    }
}

struct PriorityOpsBatchInfo {
    bytes32[] leftPath;
    bytes32[] rightPath;
    bytes32[] itemHashes;
}

library UncheckedMath {
    function uncheckedInc(uint256 _number) internal pure returns (uint256) {
        unchecked {
            return _number + 1;
        }
    }

    function uncheckedAdd(uint256 _lhs, uint256 _rhs) internal pure returns (uint256) {
        unchecked {
            return _lhs + _rhs;
        }
    }
}

library Merkle {
    using UncheckedMath for uint256;

    /// @dev Calculate Merkle root by the provided Merkle proof.
    /// NOTE: When using this function, check that the _path length is equal to the tree height to prevent shorter/longer paths attack
    /// however, for chains settling on GW the proof includes the GW proof, so the path increases. See Mailbox for more details.
    /// @param _path Merkle path from the leaf to the root
    /// @param _index Leaf index in the tree
    /// @param _itemHash Hash of leaf content
    /// @return The Merkle root
    function calculateRoot(
        bytes32[] calldata _path,
        uint256 _index,
        bytes32 _itemHash
    ) internal pure returns (bytes32) {
        uint256 pathLength = _path.length;
        _validatePathLengthForSingleProof(_index, pathLength);

        bytes32 currentHash = _itemHash;
        for (uint256 i; i < pathLength; i = i.uncheckedInc()) {
            currentHash = (_index % 2 == 0)
                ? efficientHash(currentHash, _path[i])
                : efficientHash(_path[i], currentHash);
            _index /= 2;
        }

        return currentHash;
    }

    /// @dev Calculate Merkle root by the provided Merkle proof.
    /// NOTE: When using this function, check that the _path length is equal to the tree height to prevent shorter/longer paths attack
    /// @param _path Merkle path from the leaf to the root
    /// @param _index Leaf index in the tree
    /// @param _itemHash Hash of leaf content
    /// @return The Merkle root
    function calculateRootMemory(
        bytes32[] memory _path,
        uint256 _index,
        bytes32 _itemHash
    ) internal pure returns (bytes32) {
        uint256 pathLength = _path.length;
        _validatePathLengthForSingleProof(_index, pathLength);

        bytes32 currentHash = _itemHash;
        for (uint256 i; i < pathLength; i = i.uncheckedInc()) {
            currentHash = (_index % 2 == 0)
                ? efficientHash(currentHash, _path[i])
                : efficientHash(_path[i], currentHash);
            _index /= 2;
        }

        return currentHash;
    }

    /// @dev Calculate Merkle root by the provided Merkle proof for a range of elements
    /// NOTE: When using this function, check that the _startPath and _endPath lengths are equal to the tree height to prevent shorter/longer paths attack
    /// @param _startPath Merkle path from the first element of the range to the root
    /// @param _endPath Merkle path from the last element of the range to the root
    /// @param _startIndex Index of the first element of the range in the tree
    /// @param _itemHashes Hashes of the elements in the range
    /// @return The Merkle root
    function calculateRootPaths(
        bytes32[] memory _startPath,
        bytes32[] memory _endPath,
        uint256 _startIndex,
        bytes32[] memory _itemHashes
    ) internal pure returns (bytes32) {
        uint256 pathLength = _startPath.length;
        if (pathLength != _endPath.length) {
            revert MerklePathLengthMismatch(pathLength, _endPath.length);
        }
        if (pathLength >= 256) {
            revert MerklePathOutOfBounds();
        }
        uint256 levelLen = _itemHashes.length;
        // Edge case: we want to be able to prove an element in a single-node tree.
        if (pathLength == 0 && (_startIndex != 0 || levelLen != 1)) {
            revert MerklePathEmpty();
        }
        if (levelLen == 0) {
            revert MerkleNothingToProve();
        }
        if (_startIndex + levelLen > (1 << pathLength)) {
            revert MerkleIndexOrHeightMismatch();
        }
        bytes32[] memory itemHashes = _itemHashes;

        for (uint256 level; level < pathLength; level = level.uncheckedInc()) {
            uint256 parity = _startIndex % 2;
            // We get an extra element on the next level if on the current level elements either
            // start on an odd index (`parity == 1`) or end on an even index (`levelLen % 2 == 1`)
            uint256 nextLevelLen = levelLen / 2 + (parity | (levelLen % 2));
            for (uint256 i; i < nextLevelLen; i = i.uncheckedInc()) {
                bytes32 lhs = (i == 0 && parity == 1) ? _startPath[level] : itemHashes[2 * i - parity];
                bytes32 rhs = (i == nextLevelLen - 1 && (levelLen - parity) % 2 == 1)
                    ? _endPath[level]
                    : itemHashes[2 * i + 1 - parity];
                itemHashes[i] = efficientHash(lhs, rhs);
            }
            levelLen = nextLevelLen;
            _startIndex /= 2;
        }

        return itemHashes[0];
    }

    /// @dev Keccak hash of the concatenation of two 32-byte words
    function efficientHash(bytes32 _lhs, bytes32 _rhs) internal pure returns (bytes32 result) {
        assembly {
            mstore(0x00, _lhs)
            mstore(0x20, _rhs)
            result := keccak256(0x00, 0x40)
        }
    }

    function _validatePathLengthForSingleProof(uint256 _index, uint256 _pathLength) private pure {
        if (_pathLength >= 256) {
            revert MerklePathOutOfBounds();
        }
        if (_index >= (1 << _pathLength)) {
            revert MerkleIndexOutOfBounds();
        }
    }
}

struct PriorityTreeCommitment {
    uint256 nextLeafIndex;
    uint256 startIndex;
    uint256 unprocessedIndex;
    bytes32[] sides;
}

library PriorityTree {
    using PriorityTree for Tree;
    using DynamicIncrementalMerkle for DynamicIncrementalMerkle.Bytes32PushTree;

    struct Tree {
        uint256 startIndex; // priority tree started accepting priority ops from this index
        uint256 unprocessedIndex; // relative to `startIndex`
        mapping(bytes32 => bool) historicalRoots;
        DynamicIncrementalMerkle.Bytes32PushTree tree;
    }

    /// @notice Returns zero if and only if no operations were processed from the tree
    /// @return Index of the oldest priority operation that wasn't processed yet
    function getFirstUnprocessedPriorityTx(Tree storage _tree) internal view returns (uint256) {
        return _tree.startIndex + _tree.unprocessedIndex;
    }

    /// @return The total number of priority operations that were added to the priority queue, including all processed ones
    function getTotalPriorityTxs(Tree storage _tree) internal view returns (uint256) {
        return _tree.startIndex + _tree.tree._nextLeafIndex;
    }

    /// @return The total number of unprocessed priority operations in a priority queue
    function getSize(Tree storage _tree) internal view returns (uint256) {
        return _tree.tree._nextLeafIndex - _tree.unprocessedIndex;
    }

    /// @notice Add the priority operation to the end of the priority queue
    function push(Tree storage _tree, bytes32 _hash) internal {
        (, bytes32 newRoot) = _tree.tree.push(_hash);
        _tree.historicalRoots[newRoot] = true;
    }

    /// @notice Set up the tree
    function setup(Tree storage _tree, uint256 _startIndex) internal {
        bytes32 initialRoot = _tree.tree.setup(ZERO_LEAF_HASH);
        _tree.historicalRoots[initialRoot] = true;
        _tree.startIndex = _startIndex;
    }

    /// @return Returns the tree root.
    function getRoot(Tree storage _tree) internal view returns (bytes32) {
        return _tree.tree.root();
    }

    /// @param _root The root to check.
    /// @return Returns true if the root is a historical root.
    function isHistoricalRoot(Tree storage _tree, bytes32 _root) internal view returns (bool) {
        return _tree.historicalRoots[_root];
    }

    /// @notice Process the priority operations of a batch.
    /// @dev Note, that the function below only checks that a certain segment of items is present in the tree.
    /// It does not check that e.g. there are no zero items inside the provided `itemHashes`, so in theory proofs
    /// that include non-existing priority operations could be created. This function relies on the fact
    /// that the `itemHashes` of `_priorityOpsData` are hashes of valid priority transactions.
    /// This fact is ensures by the fact the rolling hash of those is sent to the Executor by the bootloader
    /// and so assuming that zero knowledge proofs are correct, so is the structure of the `itemHashes`.
    function processBatch(Tree storage _tree, PriorityOpsBatchInfo memory _priorityOpsData) internal {
        if (_priorityOpsData.itemHashes.length > 0) {
            bytes32 expectedRoot = Merkle.calculateRootPaths(
                _priorityOpsData.leftPath,
                _priorityOpsData.rightPath,
                _tree.unprocessedIndex,
                _priorityOpsData.itemHashes
            );
            if (!_tree.historicalRoots[expectedRoot]) {
                revert NotHistoricalRoot();
            }
            _tree.unprocessedIndex += _priorityOpsData.itemHashes.length;
        }
    }

    /// @notice Allows to skip a certain number of operations.
    /// @param _lastUnprocessed The new expected id of the unprocessed transaction.
    /// @dev It is used when the corresponding transactions have been processed by priority queue.
    function skipUntil(Tree storage _tree, uint256 _lastUnprocessed) internal {
        if (_tree.startIndex > _lastUnprocessed) {
            // Nothing to do, return
            return;
        }
        uint256 newUnprocessedIndex = _lastUnprocessed - _tree.startIndex;
        if (newUnprocessedIndex <= _tree.unprocessedIndex) {
            // These transactions were already processed, skip.
            return;
        }

        _tree.unprocessedIndex = newUnprocessedIndex;
    }

    /// @notice Initialize a chain from a commitment.
    function initFromCommitment(Tree storage _tree, PriorityTreeCommitment memory _commitment) internal {
        uint256 height = _commitment.sides.length; // Height, including the root node.
        if (height == 0) {
            revert InvalidCommitment();
        }
        _tree.startIndex = _commitment.startIndex;
        _tree.unprocessedIndex = _commitment.unprocessedIndex;
        _tree.tree._nextLeafIndex = _commitment.nextLeafIndex;
        _tree.tree._sides = _commitment.sides;
        bytes32 zero = ZERO_LEAF_HASH;
        _tree.tree._zeros = new bytes32[](height);
        for (uint256 i; i < height; ++i) {
            _tree.tree._zeros[i] = zero;
            zero = Merkle.efficientHash(zero, zero);
        }
        _tree.historicalRoots[_tree.tree.root()] = true;
    }

    /// @notice Reinitialize the tree from a commitment on L1.
    function l1Reinit(Tree storage _tree, PriorityTreeCommitment memory _commitment) internal {
        if (_tree.startIndex != _commitment.startIndex) {
            revert InvalidStartIndex(_tree.startIndex, _commitment.startIndex);
        }
        if (_tree.unprocessedIndex > _commitment.unprocessedIndex) {
            revert InvalidUnprocessedIndex(_tree.unprocessedIndex, _commitment.unprocessedIndex);
        }
        if (_tree.tree._nextLeafIndex < _commitment.nextLeafIndex) {
            revert InvalidNextLeafIndex(_tree.tree._nextLeafIndex, _commitment.nextLeafIndex);
        }

        _tree.unprocessedIndex = _commitment.unprocessedIndex;
    }

    /// @notice Reinitialize the tree from a commitment on GW.
    function checkGWReinit(Tree storage _tree, PriorityTreeCommitment memory _commitment) internal view {
        if (_tree.startIndex != _commitment.startIndex) {
            revert InvalidStartIndex(_tree.startIndex, _commitment.startIndex);
        }
        if (_tree.unprocessedIndex > _commitment.unprocessedIndex) {
            revert InvalidUnprocessedIndex(_tree.unprocessedIndex, _commitment.unprocessedIndex);
        }
        if (_tree.tree._nextLeafIndex > _commitment.nextLeafIndex) {
            revert InvalidNextLeafIndex(_tree.tree._nextLeafIndex, _commitment.nextLeafIndex);
        }
    }

    /// @notice Returns the commitment to the priority tree.
    function getCommitment(Tree storage _tree) internal view returns (PriorityTreeCommitment memory commitment) {
        commitment.nextLeafIndex = _tree.tree._nextLeafIndex;
        commitment.startIndex = _tree.startIndex;
        commitment.unprocessedIndex = _tree.unprocessedIndex;
        commitment.sides = _tree.tree._sides;
    }
}

struct ZKChainStorage {
    /// @dev Storage of variables needed for deprecated diamond cut facet
    uint256[7] __DEPRECATED_diamondCutStorage;
    /// @notice Address which will exercise critical changes to the Diamond Proxy (upgrades, freezing & unfreezing). Replaced by CTM
    address __DEPRECATED_governor;
    /// @notice Address that the governor proposed as one that will replace it
    address __DEPRECATED_pendingGovernor;
    /// @notice List of permitted validators
    mapping(address validatorAddress => bool isValidator) validators;
    /// @dev Verifier contract. Used to verify aggregated proof for batches
    IVerifier verifier;
    /// @notice Total number of executed batches i.e. batches[totalBatchesExecuted] points at the latest executed batch
    /// (batch 0 is genesis)
    uint256 totalBatchesExecuted;
    /// @notice Total number of proved batches i.e. batches[totalBatchesProved] points at the latest proved batch
    uint256 totalBatchesVerified;
    /// @notice Total number of committed batches i.e. batches[totalBatchesCommitted] points at the latest committed
    /// batch
    uint256 totalBatchesCommitted;
    /// @dev Stored hashed StoredBatch for batch number
    mapping(uint256 batchNumber => bytes32 batchHash) storedBatchHashes;
    /// @dev Stored root hashes of L2 -> L1 logs
    mapping(uint256 batchNumber => bytes32 l2LogsRootHash) l2LogsRootHashes;
    /// @dev Container that stores transactions requested from L1
    PriorityQueue.Queue priorityQueue;
    /// @dev The smart contract that manages the list with permission to call contract functions
    address __DEPRECATED_allowList;
    VerifierParams __DEPRECATED_verifierParams;
    /// @notice Bytecode hash of bootloader program.
    /// @dev Used as an input to zkp-circuit.
    bytes32 l2BootloaderBytecodeHash;
    /// @notice Bytecode hash of default account (bytecode for EOA).
    /// @dev Used as an input to zkp-circuit.
    bytes32 l2DefaultAccountBytecodeHash;
    /// @dev Indicates that the porter may be touched on L2 transactions.
    /// @dev Used as an input to zkp-circuit.
    bool zkPorterIsAvailable;
    /// @dev The maximum number of the L2 gas that a user can request for L1 -> L2 transactions
    /// @dev This is the maximum number of L2 gas that is available for the "body" of the transaction, i.e.
    /// without overhead for proving the batch.
    uint256 priorityTxMaxGasLimit;
    /// @dev Storage of variables needed for upgrade facet
    UpgradeStorage __DEPRECATED_upgrades;
    /// @dev A mapping L2 batch number => message number => flag.
    /// @dev The L2 -> L1 log is sent for every withdrawal, so this mapping is serving as
    /// a flag to indicate that the message was already processed.
    /// @dev Used to indicate that eth withdrawal was already processed
    mapping(uint256 l2BatchNumber => mapping(uint256 l2ToL1MessageNumber => bool isFinalized)) isEthWithdrawalFinalized;
    /// @dev The most recent withdrawal time and amount reset
    uint256 __DEPRECATED_lastWithdrawalLimitReset;
    /// @dev The accumulated withdrawn amount during the withdrawal limit window
    uint256 __DEPRECATED_withdrawnAmountInWindow;
    /// @dev A mapping user address => the total deposited amount by the user
    mapping(address => uint256) __DEPRECATED_totalDepositedAmountPerUser;
    /// @dev Stores the protocol version. Note, that the protocol version may not only encompass changes to the
    /// smart contracts, but also to the node behavior.
    uint256 protocolVersion;
    /// @dev Hash of the system contract upgrade transaction. If 0, then no upgrade transaction needs to be done.
    bytes32 l2SystemContractsUpgradeTxHash;
    /// @dev Batch number where the upgrade transaction has happened. If 0, then no upgrade transaction has happened
    /// yet.
    uint256 l2SystemContractsUpgradeBatchNumber;
    /// @dev Address which will exercise non-critical changes to the Diamond Proxy (changing validator set & unfreezing)
    address admin;
    /// @notice Address that the admin proposed as one that will replace admin role
    address pendingAdmin;
    /// @dev Fee params used to derive gasPrice for the L1->L2 transactions. For L2 transactions,
    /// the bootloader gives enough freedom to the operator.
    /// @dev The value is only for the L1 deployment of the ZK Chain, since payment for all the priority transactions is
    /// charged at that level.
    FeeParams feeParams;
    /// @dev Address of the blob versioned hash getter smart contract used for EIP-4844 versioned hashes.
    /// @dev Used only for testing.
    address blobVersionedHashRetriever;
    /// @dev The chainId of the chain
    uint256 chainId;
    /// @dev The address of the bridgehub
    address bridgehub;
    /// @dev The address of the ChainTypeManager
    address chainTypeManager;
    /// @dev The address of the baseToken contract. Eth is address(1)
    address __DEPRECATED_baseToken;
    /// @dev The address of the baseTokenbridge. Eth also uses the shared bridge
    address __DEPRECATED_baseTokenBridge;
    /// @notice gasPriceMultiplier for each baseToken, so that each L1->L2 transaction pays for its transaction on the destination
    /// we multiply by the nominator, and divide by the denominator
    uint128 baseTokenGasPriceMultiplierNominator;
    uint128 baseTokenGasPriceMultiplierDenominator;
    /// @dev The optional address of the contract that has to be used for transaction filtering/whitelisting
    address transactionFilterer;
    /// @dev The address of the l1DAValidator contract.
    /// This contract is responsible for the verification of the correctness of the DA on L1.
    address l1DAValidator;
    /// @dev The address of the contract on L2 that is responsible for the data availability verification.
    /// This contract sends `l2DAValidatorOutputHash` to L1 via L2->L1 system log and it will routed to the `l1DAValidator` contract.
    address l2DAValidator;
    /// @dev the Asset Id of the baseToken
    bytes32 baseTokenAssetId;
    /// @dev If this ZKchain settles on this chain, then this is zero. Otherwise it is the address of the ZKchain that is a
    /// settlement layer for this ZKchain. (think about it as a 'forwarding' address for the chain that migrated away).
    address settlementLayer;
    /// @dev Priority tree, the new data structure for priority queue
    PriorityTree.Tree priorityTree;
    /// @dev Whether the chain is a permanent rollup. Note, that it only enforces the DA validator pair, but
    /// it does not enforce any other parameters, e.g. `pubdataPricingMode`
    bool isPermanentRollup;
}

contract ZKChainBase is ReentrancyGuard {
    using PriorityQueue for PriorityQueue.Queue;
    using PriorityTree for PriorityTree.Tree;

    // slither-disable-next-line uninitialized-state
    ZKChainStorage internal s;

    /// @notice Checks that the message sender is an active admin
    modifier onlyAdmin() {
        if (msg.sender != s.admin) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    /// @notice Checks if validator is active
    modifier onlyValidator() {
        if (!s.validators[msg.sender]) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyChainTypeManager() {
        if (msg.sender != s.chainTypeManager) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyBridgehub() {
        if (msg.sender != s.bridgehub) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyAdminOrChainTypeManager() {
        if (msg.sender != s.admin && msg.sender != s.chainTypeManager) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyValidatorOrChainTypeManager() {
        if (!s.validators[msg.sender] && msg.sender != s.chainTypeManager) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlySettlementLayer() {
        if (s.settlementLayer != address(0)) {
            revert NotSettlementLayer();
        }
        _;
    }

    /// @notice Returns whether the priority queue is still active, i.e.
    /// the chain has not processed all transactions from it
    function _isPriorityQueueActive() internal view returns (bool) {
        return s.priorityQueue.getFirstUnprocessedPriorityTx() < s.priorityTree.startIndex;
    }

    /// @notice Ensures that the queue is deactivated. Should be invoked
    /// whenever the chain migrates to another settlement layer.
    function _forceDeactivateQueue() internal {
        // We double check whether it is still active mainly to prevent
        // overriding `tail`/`head` on L1 deployment.
        if (_isPriorityQueueActive()) {
            uint256 startIndex = s.priorityTree.startIndex;
            s.priorityQueue.head = startIndex;
            s.priorityQueue.tail = startIndex;
        }
    }

    function _getTotalPriorityTxs() internal view returns (uint256) {
        if (_isPriorityQueueActive()) {
            return s.priorityQueue.getTotalPriorityTxs();
        } else {
            return s.priorityTree.getTotalPriorityTxs();
        }
    }
}

contract ExecutorFacet is ZKChainBase, IExecutor {
    using UncheckedMath for uint256;
    using PriorityQueue for PriorityQueue.Queue;
    using PriorityTree for PriorityTree.Tree;

    /// @inheritdoc IZKChainBase
    string public constant override getName = "ExecutorFacet";

    /// @notice The chain id of L1. This contract can be deployed on multiple layers, but this value is still equal to the
    /// L1 that is at the most base layer.
    uint256 internal immutable L1_CHAIN_ID;

    constructor(uint256 _l1ChainId) {
        L1_CHAIN_ID = _l1ChainId;
    }

    /// @dev Process one batch commit using the previous batch StoredBatchInfo
    /// @dev returns new batch StoredBatchInfo
    /// @notice Does not change storage
    function _commitOneBatch(
        StoredBatchInfo memory _previousBatch,
        CommitBatchInfo memory _newBatch,
        bytes32 _expectedSystemContractUpgradeTxHash
    ) internal returns (StoredBatchInfo memory) {
        // only commit next batch
        if (_newBatch.batchNumber != _previousBatch.batchNumber + 1) {
            revert BatchNumberMismatch(_previousBatch.batchNumber + 1, _newBatch.batchNumber);
        }

        // Check that batch contains all meta information for L2 logs.
        // Get the chained hash of priority transaction hashes.
        LogProcessingOutput memory logOutput = _processL2Logs(_newBatch, _expectedSystemContractUpgradeTxHash);

        L1DAValidatorOutput memory daOutput = IL1DAValidator(s.l1DAValidator).checkDA({
            _chainId: s.chainId,
            _batchNumber: uint256(_newBatch.batchNumber),
            _l2DAValidatorOutputHash: logOutput.l2DAValidatorOutputHash,
            _operatorDAInput: _newBatch.operatorDAInput,
            _maxBlobsSupported: TOTAL_BLOBS_IN_COMMITMENT
        });

        if (_previousBatch.batchHash != logOutput.previousBatchHash) {
            revert HashMismatch(logOutput.previousBatchHash, _previousBatch.batchHash);
        }
        // Check that the priority operation hash in the L2 logs is as expected
        if (logOutput.chainedPriorityTxsHash != _newBatch.priorityOperationsHash) {
            revert HashMismatch(logOutput.chainedPriorityTxsHash, _newBatch.priorityOperationsHash);
        }
        // Check that the number of processed priority operations is as expected
        if (logOutput.numberOfLayer1Txs != _newBatch.numberOfLayer1Txs) {
            revert ValueMismatch(logOutput.numberOfLayer1Txs, _newBatch.numberOfLayer1Txs);
        }

        // Check the timestamp of the new batch
        _verifyBatchTimestamp(logOutput.packedBatchAndL2BlockTimestamp, _newBatch.timestamp, _previousBatch.timestamp);

        // Create batch commitment for the proof verification
        bytes32 commitment = _createBatchCommitment(
            _newBatch,
            daOutput.stateDiffHash,
            daOutput.blobsOpeningCommitments,
            daOutput.blobsLinearHashes
        );

        return
            StoredBatchInfo({
                batchNumber: _newBatch.batchNumber,
                batchHash: _newBatch.newStateRoot,
                indexRepeatedStorageChanges: _newBatch.indexRepeatedStorageChanges,
                numberOfLayer1Txs: _newBatch.numberOfLayer1Txs,
                priorityOperationsHash: _newBatch.priorityOperationsHash,
                l2LogsTreeRoot: logOutput.l2LogsTreeRoot,
                timestamp: _newBatch.timestamp,
                commitment: commitment
            });
    }

    /// @notice checks that the timestamps of both the new batch and the new L2 block are correct.
    /// @param _packedBatchAndL2BlockTimestamp - packed batch and L2 block timestamp in a format of batchTimestamp * 2**128 + l2BatchTimestamp
    /// @param _expectedBatchTimestamp - expected batch timestamp
    /// @param _previousBatchTimestamp - the timestamp of the previous batch
    function _verifyBatchTimestamp(
        uint256 _packedBatchAndL2BlockTimestamp,
        uint256 _expectedBatchTimestamp,
        uint256 _previousBatchTimestamp
    ) internal view {
        // Check that the timestamp that came from the system context is expected
        uint256 batchTimestamp = _packedBatchAndL2BlockTimestamp >> 128;
        if (batchTimestamp != _expectedBatchTimestamp) {
            revert TimestampError();
        }

        // While the fact that _previousBatchTimestamp < batchTimestamp is already checked on L2,
        // we double check it here for clarity
        if (_previousBatchTimestamp >= batchTimestamp) {
            revert NonIncreasingTimestamp();
        }

        uint256 lastL2BlockTimestamp = _packedBatchAndL2BlockTimestamp & PACKED_L2_BLOCK_TIMESTAMP_MASK;

        // All L2 blocks have timestamps within the range of [batchTimestamp, lastL2BlockTimestamp].
        // So here we need to only double check that:
        // - The timestamp of the batch is not too small.
        // - The timestamp of the last L2 block is not too big.
        // New batch timestamp is too small
        if (block.timestamp - COMMIT_TIMESTAMP_NOT_OLDER > batchTimestamp) {
            revert TimeNotReached(batchTimestamp, block.timestamp - COMMIT_TIMESTAMP_NOT_OLDER);
        }
        // The last L2 block timestamp is too big
        if (lastL2BlockTimestamp > block.timestamp + COMMIT_TIMESTAMP_APPROXIMATION_DELTA) {
            revert L2TimestampTooBig();
        }
    }

    /// @dev Check that L2 logs are proper and batch contain all meta information for them
    /// @dev The logs processed here should line up such that only one log for each key from the
    ///      SystemLogKey enum in Constants.sol is processed per new batch.
    /// @dev Data returned from here will be used to form the batch commitment.
    function _processL2Logs(
        CommitBatchInfo memory _newBatch,
        bytes32 _expectedSystemContractUpgradeTxHash
    ) internal view returns (LogProcessingOutput memory logOutput) {
        // Copy L2 to L1 logs into memory.
        bytes memory emittedL2Logs = _newBatch.systemLogs;

        // Used as bitmap to set/check log processing happens exactly once.
        // See SystemLogKey enum in Constants.sol for ordering.
        uint256 processedLogs = 0;

        // linear traversal of the logs
        uint256 logsLength = emittedL2Logs.length;

        if (logsLength % L2_TO_L1_LOG_SERIALIZE_SIZE != 0) {
            revert InvalidSystemLogsLength();
        }

        for (uint256 i = 0; i < logsLength; i = i.uncheckedAdd(L2_TO_L1_LOG_SERIALIZE_SIZE)) {
            // Extract the values to be compared to/used such as the log sender, key, and value
            // slither-disable-next-line unused-return
            (address logSender, ) = UnsafeBytes.readAddress(emittedL2Logs, i + L2_LOG_ADDRESS_OFFSET);
            // slither-disable-next-line unused-return
            (uint256 logKey, ) = UnsafeBytes.readUint256(emittedL2Logs, i + L2_LOG_KEY_OFFSET);
            // slither-disable-next-line unused-return
            (bytes32 logValue, ) = UnsafeBytes.readBytes32(emittedL2Logs, i + L2_LOG_VALUE_OFFSET);

            // Ensure that the log hasn't been processed already
            if (_checkBit(processedLogs, uint8(logKey))) {
                revert LogAlreadyProcessed(uint8(logKey));
            }
            processedLogs = _setBit(processedLogs, uint8(logKey));

            // Need to check that each log was sent by the correct address.
            if (logKey == uint256(SystemLogKey.L2_TO_L1_LOGS_TREE_ROOT_KEY)) {
                if (logSender != L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR) {
                    revert InvalidLogSender(logSender, logKey);
                }
                logOutput.l2LogsTreeRoot = logValue;
            } else if (logKey == uint256(SystemLogKey.PACKED_BATCH_AND_L2_BLOCK_TIMESTAMP_KEY)) {
                if (logSender != L2_SYSTEM_CONTEXT_SYSTEM_CONTRACT_ADDR) {
                    revert InvalidLogSender(logSender, logKey);
                }
                logOutput.packedBatchAndL2BlockTimestamp = uint256(logValue);
            } else if (logKey == uint256(SystemLogKey.PREV_BATCH_HASH_KEY)) {
                if (logSender != L2_SYSTEM_CONTEXT_SYSTEM_CONTRACT_ADDR) {
                    revert InvalidLogSender(logSender, logKey);
                }
                logOutput.previousBatchHash = logValue;
            } else if (logKey == uint256(SystemLogKey.CHAINED_PRIORITY_TXN_HASH_KEY)) {
                if (logSender != L2_BOOTLOADER_ADDRESS) {
                    revert InvalidLogSender(logSender, logKey);
                }
                logOutput.chainedPriorityTxsHash = logValue;
            } else if (logKey == uint256(SystemLogKey.NUMBER_OF_LAYER_1_TXS_KEY)) {
                if (logSender != L2_BOOTLOADER_ADDRESS) {
                    revert InvalidLogSender(logSender, logKey);
                }
                logOutput.numberOfLayer1Txs = uint256(logValue);
            } else if (logKey == uint256(SystemLogKey.USED_L2_DA_VALIDATOR_ADDRESS_KEY)) {
                if (logSender != L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR) {
                    revert InvalidLogSender(logSender, logKey);
                }
                if (s.l2DAValidator != address(uint160(uint256(logValue)))) {
                    revert MismatchL2DAValidator();
                }
            } else if (logKey == uint256(SystemLogKey.L2_DA_VALIDATOR_OUTPUT_HASH_KEY)) {
                if (logSender != L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR) {
                    revert InvalidLogSender(logSender, logKey);
                }
                logOutput.l2DAValidatorOutputHash = logValue;
            } else if (logKey == uint256(SystemLogKey.EXPECTED_SYSTEM_CONTRACT_UPGRADE_TX_HASH_KEY)) {
                if (logSender != L2_BOOTLOADER_ADDRESS) {
                    revert InvalidLogSender(logSender, logKey);
                }
                if (_expectedSystemContractUpgradeTxHash != logValue) {
                    revert TxHashMismatch();
                }
            } else if (logKey > uint256(SystemLogKey.EXPECTED_SYSTEM_CONTRACT_UPGRADE_TX_HASH_KEY)) {
                revert UnexpectedSystemLog(logKey);
            }
        }

        // We only require 7 logs to be checked, the 8th is if we are expecting a protocol upgrade
        // Without the protocol upgrade we expect 7 logs: 2^7 - 1 = 127
        // With the protocol upgrade we expect 8 logs: 2^8 - 1 = 255
        if (_expectedSystemContractUpgradeTxHash == bytes32(0)) {
            if (processedLogs != 127) {
                revert MissingSystemLogs(127, processedLogs);
            }
        } else if (processedLogs != 255) {
            revert MissingSystemLogs(255, processedLogs);
        }
    }

    /// @inheritdoc IExecutor
    function commitBatchesSharedBridge(
        uint256, // _chainId
        uint256 _processFrom,
        uint256 _processTo,
        bytes calldata _commitData
    ) external nonReentrant onlyValidator onlySettlementLayer {
        // check that we have the right protocol version
        // three comments:
        // 1. A chain has to keep their protocol version up to date, as processing a block requires the latest or previous protocol version
        // to solve this we will need to add the feature to create batches with only the protocol upgrade tx, without any other txs.
        // 2. A chain might become out of sync if it launches while we are in the middle of a protocol upgrade. This would mean they cannot process their genesis upgrade
        // as their protocolversion would be outdated, and they also cannot process the protocol upgrade tx as they have a pending upgrade.
        // 3. The protocol upgrade is increased in the BaseZkSyncUpgrade, in the executor only the systemContractsUpgradeTxHash is checked
        if (!IChainTypeManager(s.chainTypeManager).protocolVersionIsActive(s.protocolVersion)) {
            revert InvalidProtocolVersion();
        }
        (StoredBatchInfo memory lastCommittedBatchData, CommitBatchInfo[] memory newBatchesData) = BatchDecoder
            .decodeAndCheckCommitData(_commitData, _processFrom, _processTo);
        // With the new changes for EIP-4844, namely the restriction on number of blobs per block, we only allow for a single batch to be committed at a time.
        // Note: Don't need to check that `_processFrom` == `_processTo` because there is only one batch,
        // and so the range checked in the `decodeAndCheckCommitData` is enough.
        if (newBatchesData.length != 1) {
            revert CanOnlyProcessOneBatch();
        }
        // Check that we commit batches after last committed batch
        if (s.storedBatchHashes[s.totalBatchesCommitted] != _hashStoredBatchInfo(lastCommittedBatchData)) {
            // incorrect previous batch data
            revert BatchHashMismatch(
                s.storedBatchHashes[s.totalBatchesCommitted],
                _hashStoredBatchInfo(lastCommittedBatchData)
            );
        }

        bytes32 systemContractsUpgradeTxHash = s.l2SystemContractsUpgradeTxHash;
        // Upgrades are rarely done so we optimize a case with no active system contracts upgrade.
        if (systemContractsUpgradeTxHash == bytes32(0) || s.l2SystemContractsUpgradeBatchNumber != 0) {
            _commitBatchesWithoutSystemContractsUpgrade(lastCommittedBatchData, newBatchesData);
        } else {
            _commitBatchesWithSystemContractsUpgrade(
                lastCommittedBatchData,
                newBatchesData,
                systemContractsUpgradeTxHash
            );
        }

        s.totalBatchesCommitted = s.totalBatchesCommitted + newBatchesData.length;
    }

    /// @dev Commits new batches without any system contracts upgrade.
    /// @param _lastCommittedBatchData The data of the last committed batch.
    /// @param _newBatchesData An array of batch data that needs to be committed.
    function _commitBatchesWithoutSystemContractsUpgrade(
        StoredBatchInfo memory _lastCommittedBatchData,
        CommitBatchInfo[] memory _newBatchesData
    ) internal {
        // We disable this check because calldata array length is cheap.
        // solhint-disable-next-line gas-length-in-loops
        for (uint256 i = 0; i < _newBatchesData.length; i = i.uncheckedInc()) {
            _lastCommittedBatchData = _commitOneBatch(_lastCommittedBatchData, _newBatchesData[i], bytes32(0));

            s.storedBatchHashes[_lastCommittedBatchData.batchNumber] = _hashStoredBatchInfo(_lastCommittedBatchData);
            emit BlockCommit(
                _lastCommittedBatchData.batchNumber,
                _lastCommittedBatchData.batchHash,
                _lastCommittedBatchData.commitment
            );
        }
    }

    /// @dev Commits new batches with a system contracts upgrade transaction.
    /// @param _lastCommittedBatchData The data of the last committed batch.
    /// @param _newBatchesData An array of batch data that needs to be committed.
    /// @param _systemContractUpgradeTxHash The transaction hash of the system contract upgrade.
    function _commitBatchesWithSystemContractsUpgrade(
        StoredBatchInfo memory _lastCommittedBatchData,
        CommitBatchInfo[] memory _newBatchesData,
        bytes32 _systemContractUpgradeTxHash
    ) internal {
        // The system contract upgrade is designed to be executed atomically with the new bootloader, a default account,
        // ZKP verifier, and other system parameters. Hence, we ensure that the upgrade transaction is
        // carried out within the first batch committed after the upgrade.

        // While the logic of the contract ensures that the s.l2SystemContractsUpgradeBatchNumber is 0 when this function is called,
        // this check is added just in case. Since it is a hot read, it does not incur noticeable gas cost.
        if (s.l2SystemContractsUpgradeBatchNumber != 0) {
            revert UpgradeBatchNumberIsNotZero();
        }

        // Save the batch number where the upgrade transaction was executed.
        s.l2SystemContractsUpgradeBatchNumber = _newBatchesData[0].batchNumber;

        // We disable this check because calldata array length is cheap.
        // solhint-disable-next-line gas-length-in-loops
        for (uint256 i = 0; i < _newBatchesData.length; i = i.uncheckedInc()) {
            // The upgrade transaction must only be included in the first batch.
            bytes32 expectedUpgradeTxHash = i == 0 ? _systemContractUpgradeTxHash : bytes32(0);
            _lastCommittedBatchData = _commitOneBatch(
                _lastCommittedBatchData,
                _newBatchesData[i],
                expectedUpgradeTxHash
            );

            s.storedBatchHashes[_lastCommittedBatchData.batchNumber] = _hashStoredBatchInfo(_lastCommittedBatchData);
            emit BlockCommit(
                _lastCommittedBatchData.batchNumber,
                _lastCommittedBatchData.batchHash,
                _lastCommittedBatchData.commitment
            );
        }
    }

    /// @dev Pops the priority operations from the priority queue and returns a rolling hash of operations
    function _collectOperationsFromPriorityQueue(uint256 _nPriorityOps) internal returns (bytes32 concatHash) {
        concatHash = EMPTY_STRING_KECCAK;

        for (uint256 i = 0; i < _nPriorityOps; i = i.uncheckedInc()) {
            PriorityOperation memory priorityOp = s.priorityQueue.popFront();
            concatHash = keccak256(abi.encode(concatHash, priorityOp.canonicalTxHash));
        }

        s.priorityTree.skipUntil(s.priorityQueue.getFirstUnprocessedPriorityTx());
    }

    function _rollingHash(bytes32[] memory _hashes) internal pure returns (bytes32) {
        bytes32 hash = EMPTY_STRING_KECCAK;
        uint256 nHashes = _hashes.length;
        for (uint256 i = 0; i < nHashes; i = i.uncheckedInc()) {
            hash = keccak256(abi.encode(hash, _hashes[i]));
        }
        return hash;
    }

    /// @dev Checks that the data of the batch is correct and can be executed
    /// @dev Verifies that batch number, batch hash and priority operations hash are correct
    function _checkBatchData(
        StoredBatchInfo memory _storedBatch,
        uint256 _executedBatchIdx,
        bytes32 _priorityOperationsHash
    ) internal view {
        uint256 currentBatchNumber = _storedBatch.batchNumber;
        if (currentBatchNumber != s.totalBatchesExecuted + _executedBatchIdx + 1) {
            revert NonSequentialBatch();
        }
        if (_hashStoredBatchInfo(_storedBatch) != s.storedBatchHashes[currentBatchNumber]) {
            revert BatchHashMismatch(s.storedBatchHashes[currentBatchNumber], _hashStoredBatchInfo(_storedBatch));
        }
        if (_priorityOperationsHash != _storedBatch.priorityOperationsHash) {
            revert PriorityOperationsRollingHashMismatch();
        }
    }

    /// @dev Executes one batch
    /// @dev 1. Processes all pending operations (Complete priority requests)
    /// @dev 2. Finalizes batch on Ethereum
    /// @dev _executedBatchIdx is an index in the array of the batches that we want to execute together
    function _executeOneBatch(StoredBatchInfo memory _storedBatch, uint256 _executedBatchIdx) internal {
        bytes32 priorityOperationsHash = _collectOperationsFromPriorityQueue(_storedBatch.numberOfLayer1Txs);
        _checkBatchData(_storedBatch, _executedBatchIdx, priorityOperationsHash);

        uint256 currentBatchNumber = _storedBatch.batchNumber;

        // Save root hash of L2 -> L1 logs tree
        s.l2LogsRootHashes[currentBatchNumber] = _storedBatch.l2LogsTreeRoot;
        _appendMessageRoot(currentBatchNumber, _storedBatch.l2LogsTreeRoot);
    }

    /// @notice Executes one batch
    /// @dev 1. Processes all pending operations (Complete priority requests)
    /// @dev 2. Finalizes batch
    /// @dev _executedBatchIdx is an index in the array of the batches that we want to execute together
    function _executeOneBatch(
        StoredBatchInfo memory _storedBatch,
        PriorityOpsBatchInfo memory _priorityOpsData,
        uint256 _executedBatchIdx
    ) internal {
        if (_priorityOpsData.itemHashes.length != _storedBatch.numberOfLayer1Txs) {
            revert MismatchNumberOfLayer1Txs(_priorityOpsData.itemHashes.length, _storedBatch.numberOfLayer1Txs);
        }
        bytes32 priorityOperationsHash = _rollingHash(_priorityOpsData.itemHashes);
        _checkBatchData(_storedBatch, _executedBatchIdx, priorityOperationsHash);
        s.priorityTree.processBatch(_priorityOpsData);

        uint256 currentBatchNumber = _storedBatch.batchNumber;

        // Save root hash of L2 -> L1 logs tree
        s.l2LogsRootHashes[currentBatchNumber] = _storedBatch.l2LogsTreeRoot;
        _appendMessageRoot(currentBatchNumber, _storedBatch.l2LogsTreeRoot);
    }

    /// @notice Appends the batch message root to the global message.
    /// @param _batchNumber The number of the batch
    /// @param _messageRoot The root of the merkle tree of the messages to L1.
    /// @dev The logic of this function depends on the settlement layer as we support
    /// message root aggregation only on non-L1 settlement layers for ease for migration.
    function _appendMessageRoot(uint256 _batchNumber, bytes32 _messageRoot) internal {
        // During migration to the new protocol version, there will be a period when
        // the bridgehub does not yet provide the `messageRoot` functionality.
        // To ease up the migration, we never append messages to message root on L1.
        if (block.chainid != L1_CHAIN_ID) {
            // Once the batch is executed, we include its message to the message root.
            IMessageRoot messageRootContract = IBridgehub(s.bridgehub).messageRoot();
            messageRootContract.addChainBatchRoot(s.chainId, _batchNumber, _messageRoot);
        }
    }

    /// @inheritdoc IExecutor
    function executeBatchesSharedBridge(
        uint256, // _chainId
        uint256 _processFrom,
        uint256 _processTo,
        bytes calldata _executeData
    ) external nonReentrant onlyValidator onlySettlementLayer {
        (StoredBatchInfo[] memory batchesData, PriorityOpsBatchInfo[] memory priorityOpsData) = BatchDecoder
            .decodeAndCheckExecuteData(_executeData, _processFrom, _processTo);
        uint256 nBatches = batchesData.length;
        if (batchesData.length != priorityOpsData.length) {
            revert InvalidBatchesDataLength(batchesData.length, priorityOpsData.length);
        }

        for (uint256 i = 0; i < nBatches; i = i.uncheckedInc()) {
            if (_isPriorityQueueActive()) {
                if (priorityOpsData[i].leftPath.length != 0) {
                    revert PriorityOpsDataLeftPathLengthIsNotZero();
                }
                if (priorityOpsData[i].rightPath.length != 0) {
                    revert PriorityOpsDataRightPathLengthIsNotZero();
                }
                if (priorityOpsData[i].itemHashes.length != 0) {
                    revert PriorityOpsDataItemHashesLengthIsNotZero();
                }

                _executeOneBatch(batchesData[i], i);
            } else {
                _executeOneBatch(batchesData[i], priorityOpsData[i], i);
            }
            emit BlockExecution(batchesData[i].batchNumber, batchesData[i].batchHash, batchesData[i].commitment);
        }

        uint256 newTotalBatchesExecuted = s.totalBatchesExecuted + nBatches;
        s.totalBatchesExecuted = newTotalBatchesExecuted;
        if (newTotalBatchesExecuted > s.totalBatchesVerified) {
            revert CantExecuteUnprovenBatches();
        }

        uint256 batchWhenUpgradeHappened = s.l2SystemContractsUpgradeBatchNumber;
        if (batchWhenUpgradeHappened != 0 && batchWhenUpgradeHappened <= newTotalBatchesExecuted) {
            delete s.l2SystemContractsUpgradeTxHash;
            delete s.l2SystemContractsUpgradeBatchNumber;
        }
    }

    /// @inheritdoc IExecutor
    function proveBatchesSharedBridge(
        uint256, // _chainId
        uint256 _processBatchFrom,
        uint256 _processBatchTo,
        bytes calldata _proofData
    ) external nonReentrant onlyValidator onlySettlementLayer {
        (
            StoredBatchInfo memory prevBatch,
            StoredBatchInfo[] memory committedBatches,
            uint256[] memory proof
        ) = BatchDecoder.decodeAndCheckProofData(_proofData, _processBatchFrom, _processBatchTo);

        // Save the variables into the stack to save gas on reading them later
        uint256 currentTotalBatchesVerified = s.totalBatchesVerified;
        uint256 committedBatchesLength = committedBatches.length;

        // Initialize the array, that will be used as public input to the ZKP
        uint256[] memory proofPublicInput = new uint256[](committedBatchesLength);

        // Check that the batch passed by the validator is indeed the first unverified batch
        if (_hashStoredBatchInfo(prevBatch) != s.storedBatchHashes[currentTotalBatchesVerified]) {
            revert BatchHashMismatch(s.storedBatchHashes[currentTotalBatchesVerified], _hashStoredBatchInfo(prevBatch));
        }

        bytes32 prevBatchCommitment = prevBatch.commitment;
        for (uint256 i = 0; i < committedBatchesLength; i = i.uncheckedInc()) {
            currentTotalBatchesVerified = currentTotalBatchesVerified.uncheckedInc();
            if (_hashStoredBatchInfo(committedBatches[i]) != s.storedBatchHashes[currentTotalBatchesVerified]) {
                revert BatchHashMismatch(
                    s.storedBatchHashes[currentTotalBatchesVerified],
                    _hashStoredBatchInfo(committedBatches[i])
                );
            }

            bytes32 currentBatchCommitment = committedBatches[i].commitment;
            proofPublicInput[i] = _getBatchProofPublicInput(prevBatchCommitment, currentBatchCommitment);

            prevBatchCommitment = currentBatchCommitment;
        }
        if (currentTotalBatchesVerified > s.totalBatchesCommitted) {
            revert VerifiedBatchesExceedsCommittedBatches();
        }

        _verifyProof(proofPublicInput, proof);

        emit BlocksVerification(s.totalBatchesVerified, currentTotalBatchesVerified);
        s.totalBatchesVerified = currentTotalBatchesVerified;
    }

    function _verifyProof(uint256[] memory proofPublicInput, uint256[] memory _proof) internal view {
        // We can only process 1 batch proof at a time.
        if (proofPublicInput.length != 1) {
            revert CanOnlyProcessOneBatch();
        }

        bool successVerifyProof = s.verifier.verify(proofPublicInput, _proof);
        if (!successVerifyProof) {
            revert InvalidProof();
        }
    }

    /// @dev Gets zk proof public input
    function _getBatchProofPublicInput(
        bytes32 _prevBatchCommitment,
        bytes32 _currentBatchCommitment
    ) internal pure returns (uint256) {
        return
            uint256(keccak256(abi.encodePacked(_prevBatchCommitment, _currentBatchCommitment))) >> PUBLIC_INPUT_SHIFT;
    }

    /// @inheritdoc IExecutor
    function revertBatchesSharedBridge(
        uint256,
        uint256 _newLastBatch
    ) external nonReentrant onlyValidatorOrChainTypeManager {
        _revertBatches(_newLastBatch);
    }

    function _revertBatches(uint256 _newLastBatch) internal onlySettlementLayer {
        if (s.totalBatchesCommitted <= _newLastBatch) {
            revert RevertedBatchNotAfterNewLastBatch();
        }
        if (_newLastBatch < s.totalBatchesExecuted) {
            revert CantRevertExecutedBatch();
        }

        if (_newLastBatch < s.totalBatchesVerified) {
            s.totalBatchesVerified = _newLastBatch;
        }
        s.totalBatchesCommitted = _newLastBatch;

        // Reset the batch number of the executed system contracts upgrade transaction if the batch
        // where the system contracts upgrade was committed is among the reverted batches.
        if (s.l2SystemContractsUpgradeBatchNumber > _newLastBatch) {
            delete s.l2SystemContractsUpgradeBatchNumber;
        }

        emit BlocksRevert(s.totalBatchesCommitted, s.totalBatchesVerified, s.totalBatchesExecuted);
    }

    /// @dev Creates batch commitment from its data
    function _createBatchCommitment(
        CommitBatchInfo memory _newBatchData,
        bytes32 _stateDiffHash,
        bytes32[] memory _blobCommitments,
        bytes32[] memory _blobHashes
    ) internal view returns (bytes32) {
        bytes32 passThroughDataHash = keccak256(_batchPassThroughData(_newBatchData));
        bytes32 metadataHash = keccak256(_batchMetaParameters());
        bytes32 auxiliaryOutputHash = keccak256(
            _batchAuxiliaryOutput(_newBatchData, _stateDiffHash, _blobCommitments, _blobHashes)
        );

        return keccak256(abi.encode(passThroughDataHash, metadataHash, auxiliaryOutputHash));
    }

    function _batchPassThroughData(CommitBatchInfo memory _batch) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                // solhint-disable-next-line func-named-parameters
                _batch.indexRepeatedStorageChanges,
                _batch.newStateRoot,
                uint64(0), // index repeated storage changes in zkPorter
                bytes32(0) // zkPorter batch hash
            );
    }

    function _batchMetaParameters() internal view returns (bytes memory) {
        bytes32 l2DefaultAccountBytecodeHash = s.l2DefaultAccountBytecodeHash;
        return
            abi.encodePacked(
                s.zkPorterIsAvailable,
                s.l2BootloaderBytecodeHash,
                l2DefaultAccountBytecodeHash,
                // VM 1.5.0 requires us to pass the EVM simulator code hash. For now it is the same as the default account.
                l2DefaultAccountBytecodeHash
            );
    }

    function _batchAuxiliaryOutput(
        CommitBatchInfo memory _batch,
        bytes32 _stateDiffHash,
        bytes32[] memory _blobCommitments,
        bytes32[] memory _blobHashes
    ) internal pure returns (bytes memory) {
        if (_batch.systemLogs.length > MAX_L2_TO_L1_LOGS_COMMITMENT_BYTES) {
            revert SystemLogsSizeTooBig();
        }

        bytes32 l2ToL1LogsHash = keccak256(_batch.systemLogs);

        return
            // solhint-disable-next-line func-named-parameters
            abi.encodePacked(
                l2ToL1LogsHash,
                _stateDiffHash,
                _batch.bootloaderHeapInitialContentsHash,
                _batch.eventsQueueStateHash,
                _encodeBlobAuxiliaryOutput(_blobCommitments, _blobHashes)
            );
    }

    /// @dev Encodes the commitment to blobs to be used in the auxiliary output of the batch commitment
    /// @param _blobCommitments - the commitments to the blobs
    /// @param _blobHashes - the hashes of the blobs
    /// @param blobAuxOutputWords - The circuit commitment to the blobs split into 32-byte words
    function _encodeBlobAuxiliaryOutput(
        bytes32[] memory _blobCommitments,
        bytes32[] memory _blobHashes
    ) internal pure returns (bytes32[] memory blobAuxOutputWords) {
        // These invariants should be checked by the caller of this function, but we double check
        // just in case.
        if (_blobCommitments.length != TOTAL_BLOBS_IN_COMMITMENT || _blobHashes.length != TOTAL_BLOBS_IN_COMMITMENT) {
            revert InvalidNumberOfBlobs(TOTAL_BLOBS_IN_COMMITMENT, _blobCommitments.length, _blobHashes.length);
        }

        // for each blob we have:
        // linear hash (hash of preimage from system logs) and
        // output hash of blob commitments: keccak(versioned hash || opening point || evaluation value)
        // These values will all be bytes32(0) when we submit pubdata via calldata instead of blobs.
        //
        // For now, only up to 6 blobs are supported by the contract, while 16 are required by the circuits.
        // All the unfilled blobs will have their commitment as 0, including the case when we use only 1 blob.

        blobAuxOutputWords = new bytes32[](2 * TOTAL_BLOBS_IN_COMMITMENT);

        for (uint256 i = 0; i < TOTAL_BLOBS_IN_COMMITMENT; ++i) {
            blobAuxOutputWords[i * 2] = _blobHashes[i];
            blobAuxOutputWords[i * 2 + 1] = _blobCommitments[i];
        }
    }

    /// @notice Returns the keccak hash of the ABI-encoded StoredBatchInfo
    function _hashStoredBatchInfo(StoredBatchInfo memory _storedBatchInfo) internal pure returns (bytes32) {
        return keccak256(abi.encode(_storedBatchInfo));
    }

    /// @notice Returns true if the bit at index {_index} is 1
    function _checkBit(uint256 _bitMap, uint8 _index) internal pure returns (bool) {
        return (_bitMap & (1 << _index)) > 0;
    }

    /// @notice Sets the given bit in {_num} at index {_index} to 1.
    function _setBit(uint256 _bitMap, uint8 _index) internal pure returns (uint256) {
        return _bitMap | (1 << _index);
    }
}