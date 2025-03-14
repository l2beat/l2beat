// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

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
}

enum SystemLogKey {
    L2_TO_L1_LOGS_TREE_ROOT_KEY,
    TOTAL_L2_TO_L1_PUBDATA_KEY,
    STATE_DIFF_HASH_KEY,
    PACKED_BATCH_AND_L2_BLOCK_TIMESTAMP_KEY,
    PREV_BATCH_HASH_KEY,
    CHAINED_PRIORITY_TXN_HASH_KEY,
    NUMBER_OF_LAYER_1_TXS_KEY,
    BLOB_ONE_HASH_KEY,
    BLOB_TWO_HASH_KEY,
    BLOB_THREE_HASH_KEY,
    BLOB_FOUR_HASH_KEY,
    BLOB_FIVE_HASH_KEY,
    BLOB_SIX_HASH_KEY,
    EXPECTED_SYSTEM_CONTRACT_UPGRADE_TX_HASH_KEY
}

struct LogProcessingOutput {
    uint256 numberOfLayer1Txs;
    bytes32 chainedPriorityTxsHash;
    bytes32 previousBatchHash;
    bytes32 pubdataHash;
    bytes32 stateDiffHash;
    bytes32 l2LogsTreeRoot;
    uint256 packedBatchAndL2BlockTimestamp;
    bytes32[] blobHashes;
}

enum PubdataSource {
    Calldata,
    Blob
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

struct ZkSyncHyperchainStorage {
    /// @dev Storage of variables needed for deprecated diamond cut facet
    uint256[7] __DEPRECATED_diamondCutStorage;
    /// @notice Address which will exercise critical changes to the Diamond Proxy (upgrades, freezing & unfreezing). Replaced by STM
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
    FeeParams feeParams;
    /// @dev Address of the blob versioned hash getter smart contract used for EIP-4844 versioned hashes.
    address blobVersionedHashRetriever;
    /// @dev The chainId of the chain
    uint256 chainId;
    /// @dev The address of the bridgehub
    address bridgehub;
    /// @dev The address of the StateTransitionManager
    address stateTransitionManager;
    /// @dev The address of the baseToken contract. Eth is address(1)
    address baseToken;
    /// @dev The address of the baseTokenbridge. Eth also uses the shared bridge
    address baseTokenBridge;
    /// @notice gasPriceMultiplier for each baseToken, so that each L1->L2 transaction pays for its transaction on the destination
    /// we multiply by the nominator, and divide by the denominator
    uint128 baseTokenGasPriceMultiplierNominator;
    uint128 baseTokenGasPriceMultiplierDenominator;
    /// @dev The optional address of the contract that has to be used for transaction filtering/whitelisting
    address transactionFilterer;
}

contract ZkSyncHyperchainBase is ReentrancyGuard {
    // slither-disable-next-line uninitialized-state
    ZkSyncHyperchainStorage internal s;

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

    modifier onlyStateTransitionManager() {
        if (msg.sender != s.stateTransitionManager) {
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

    modifier onlyAdminOrStateTransitionManager() {
        if (msg.sender != s.admin && msg.sender != s.stateTransitionManager) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyValidatorOrStateTransitionManager() {
        if (!s.validators[msg.sender] && msg.sender != s.stateTransitionManager) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyBaseTokenBridge() {
        if (msg.sender != s.baseTokenBridge) {
            revert Unauthorized(msg.sender);
        }
        _;
    }
}

contract ExecutorFacet is ZkSyncHyperchainBase, IExecutor {
    using UncheckedMath for uint256;
    using PriorityQueue for PriorityQueue.Queue;

    /// @inheritdoc IZkSyncHyperchainBase
    string public constant override getName = "ExecutorFacet";

    /// @dev Process one batch commit using the previous batch StoredBatchInfo
    /// @dev returns new batch StoredBatchInfo
    /// @notice Does not change storage
    function _commitOneBatch(
        StoredBatchInfo memory _previousBatch,
        CommitBatchInfo calldata _newBatch,
        bytes32 _expectedSystemContractUpgradeTxHash
    ) internal view returns (StoredBatchInfo memory) {
        // only commit next batch
        if (_newBatch.batchNumber != _previousBatch.batchNumber + 1) {
            revert BatchNumberMismatch(_previousBatch.batchNumber + 1, _newBatch.batchNumber);
        }

        uint8 pubdataSource = uint8(bytes1(_newBatch.pubdataCommitments[0]));
        PubdataPricingMode pricingMode = s.feeParams.pubdataPricingMode;
        if (
            pricingMode != PubdataPricingMode.Validium &&
            pubdataSource != uint8(PubdataSource.Calldata) &&
            pubdataSource != uint8(PubdataSource.Blob)
        ) {
            revert InvalidPubdataMode();
        }

        // Check that batch contain all meta information for L2 logs.
        // Get the chained hash of priority transaction hashes.
        LogProcessingOutput memory logOutput = _processL2Logs(_newBatch, _expectedSystemContractUpgradeTxHash);

        bytes32[] memory blobCommitments = new bytes32[](MAX_NUMBER_OF_BLOBS);
        if (pricingMode == PubdataPricingMode.Validium) {
            // skipping data validation for validium, we just check that the data is empty
            if (_newBatch.pubdataCommitments.length != 1) {
                revert CalldataLengthTooBig();
            }
            for (uint8 i = uint8(SystemLogKey.BLOB_ONE_HASH_KEY); i <= uint8(SystemLogKey.BLOB_SIX_HASH_KEY); ++i) {
                logOutput.blobHashes[i - uint8(SystemLogKey.BLOB_ONE_HASH_KEY)] = bytes32(0);
            }
        } else if (pubdataSource == uint8(PubdataSource.Blob)) {
            // In this scenario, pubdataCommitments is a list of: opening point (16 bytes) || claimed value (32 bytes) || commitment (48 bytes) || proof (48 bytes)) = 144 bytes
            blobCommitments = _verifyBlobInformation(_newBatch.pubdataCommitments[1:], logOutput.blobHashes);
        } else if (pubdataSource == uint8(PubdataSource.Calldata)) {
            // In this scenario pubdataCommitments is actual pubdata consisting of l2 to l1 logs, l2 to l1 message, compressed smart contract bytecode, and compressed state diffs
            if (_newBatch.pubdataCommitments.length > BLOB_SIZE_BYTES) {
                revert InvalidPubdataLength();
            }
            bytes32 pubdataHash = keccak256(_newBatch.pubdataCommitments[1:_newBatch.pubdataCommitments.length - 32]);
            if (logOutput.pubdataHash != pubdataHash) {
                revert InvalidPubdataHash(pubdataHash, logOutput.pubdataHash);
            }
            blobCommitments[0] = bytes32(
                _newBatch.pubdataCommitments[_newBatch.pubdataCommitments.length - 32:_newBatch
                    .pubdataCommitments
                    .length]
            );
        }

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
            logOutput.stateDiffHash,
            blobCommitments,
            logOutput.blobHashes
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
        CommitBatchInfo calldata _newBatch,
        bytes32 _expectedSystemContractUpgradeTxHash
    ) internal pure returns (LogProcessingOutput memory logOutput) {
        // Copy L2 to L1 logs into memory.
        bytes memory emittedL2Logs = _newBatch.systemLogs;

        logOutput.blobHashes = new bytes32[](MAX_NUMBER_OF_BLOBS);

        // Used as bitmap to set/check log processing happens exactly once.
        // See SystemLogKey enum in Constants.sol for ordering.
        uint256 processedLogs = 0;

        // linear traversal of the logs
        uint256 logsLength = emittedL2Logs.length;
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
            } else if (logKey == uint256(SystemLogKey.TOTAL_L2_TO_L1_PUBDATA_KEY)) {
                if (logSender != L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR) {
                    revert InvalidLogSender(logSender, logKey);
                }
                logOutput.pubdataHash = logValue;
            } else if (logKey == uint256(SystemLogKey.STATE_DIFF_HASH_KEY)) {
                if (logSender != L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR) {
                    revert InvalidLogSender(logSender, logKey);
                }
                logOutput.stateDiffHash = logValue;
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
            } else if (
                logKey >= uint256(SystemLogKey.BLOB_ONE_HASH_KEY) && logKey <= uint256(SystemLogKey.BLOB_SIX_HASH_KEY)
            ) {
                if (logSender != L2_PUBDATA_CHUNK_PUBLISHER_ADDR) {
                    revert InvalidLogSender(logSender, logKey);
                }
                uint8 blobNumber = uint8(logKey) - uint8(SystemLogKey.BLOB_ONE_HASH_KEY);

                if (blobNumber >= MAX_NUMBER_OF_BLOBS) {
                    revert TooManyBlobs();
                }

                logOutput.blobHashes[blobNumber] = logValue;
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

        // We only require 13 logs to be checked, the 14th is if we are expecting a protocol upgrade
        // Without the protocol upgrade we expect 13 logs: 2^13 - 1 = 8191
        // With the protocol upgrade we expect 14 logs: 2^14 - 1 = 16383
        if (_expectedSystemContractUpgradeTxHash == bytes32(0)) {
            if (processedLogs != 8191) {
                revert MissingSystemLogs(8191, processedLogs);
            }
        } else {
            if (processedLogs != 16383) {
                revert MissingSystemLogs(16383, processedLogs);
            }
        }
    }

    /// @inheritdoc IExecutor
    function commitBatches(
        StoredBatchInfo calldata _lastCommittedBatchData,
        CommitBatchInfo[] calldata _newBatchesData
    ) external nonReentrant onlyValidator {
        _commitBatches(_lastCommittedBatchData, _newBatchesData);
    }

    /// @inheritdoc IExecutor
    function commitBatchesSharedBridge(
        uint256, // _chainId
        StoredBatchInfo calldata _lastCommittedBatchData,
        CommitBatchInfo[] calldata _newBatchesData
    ) external nonReentrant onlyValidator {
        _commitBatches(_lastCommittedBatchData, _newBatchesData);
    }

    function _commitBatches(
        StoredBatchInfo memory _lastCommittedBatchData,
        CommitBatchInfo[] calldata _newBatchesData
    ) internal {
        // check that we have the right protocol version
        // three comments:
        // 1. A chain has to keep their protocol version up to date, as processing a block requires the latest or previous protocol version
        // to solve this we will need to add the feature to create batches with only the protocol upgrade tx, without any other txs.
        // 2. A chain might become out of sync if it launches while we are in the middle of a protocol upgrade. This would mean they cannot process their genesis upgrade
        // as their protocolversion would be outdated, and they also cannot process the protocol upgrade tx as they have a pending upgrade.
        // 3. The protocol upgrade is increased in the BaseZkSyncUpgrade, in the executor only the systemContractsUpgradeTxHash is checked
        if (!IStateTransitionManager(s.stateTransitionManager).protocolVersionIsActive(s.protocolVersion)) {
            revert InvalidProtocolVersion();
        }
        // With the new changes for EIP-4844, namely the restriction on number of blobs per block, we only allow for a single batch to be committed at a time.
        if (_newBatchesData.length != 1) {
            revert CanOnlyProcessOneBatch();
        }
        // Check that we commit batches after last committed batch
        if (s.storedBatchHashes[s.totalBatchesCommitted] != _hashStoredBatchInfo(_lastCommittedBatchData)) {
            // incorrect previous batch data
            revert BatchHashMismatch(
                s.storedBatchHashes[s.totalBatchesCommitted],
                _hashStoredBatchInfo(_lastCommittedBatchData)
            );
        }

        bytes32 systemContractsUpgradeTxHash = s.l2SystemContractsUpgradeTxHash;
        // Upgrades are rarely done so we optimize a case with no active system contracts upgrade.
        if (systemContractsUpgradeTxHash == bytes32(0) || s.l2SystemContractsUpgradeBatchNumber != 0) {
            _commitBatchesWithoutSystemContractsUpgrade(_lastCommittedBatchData, _newBatchesData);
        } else {
            _commitBatchesWithSystemContractsUpgrade(
                _lastCommittedBatchData,
                _newBatchesData,
                systemContractsUpgradeTxHash
            );
        }

        s.totalBatchesCommitted = s.totalBatchesCommitted + _newBatchesData.length;
    }

    /// @dev Commits new batches without any system contracts upgrade.
    /// @param _lastCommittedBatchData The data of the last committed batch.
    /// @param _newBatchesData An array of batch data that needs to be committed.
    function _commitBatchesWithoutSystemContractsUpgrade(
        StoredBatchInfo memory _lastCommittedBatchData,
        CommitBatchInfo[] calldata _newBatchesData
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
        CommitBatchInfo[] calldata _newBatchesData,
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
    }

    /// @dev Executes one batch
    /// @dev 1. Processes all pending operations (Complete priority requests)
    /// @dev 2. Finalizes batch on Ethereum
    /// @dev _executedBatchIdx is an index in the array of the batches that we want to execute together
    function _executeOneBatch(StoredBatchInfo memory _storedBatch, uint256 _executedBatchIdx) internal {
        uint256 currentBatchNumber = _storedBatch.batchNumber;
        if (currentBatchNumber != s.totalBatchesExecuted + _executedBatchIdx + 1) {
            revert NonSequentialBatch();
        }
        if (_hashStoredBatchInfo(_storedBatch) != s.storedBatchHashes[currentBatchNumber]) {
            revert BatchHashMismatch(s.storedBatchHashes[currentBatchNumber], _hashStoredBatchInfo(_storedBatch));
        }

        bytes32 priorityOperationsHash = _collectOperationsFromPriorityQueue(_storedBatch.numberOfLayer1Txs);
        if (priorityOperationsHash != _storedBatch.priorityOperationsHash) {
            revert PriorityOperationsRollingHashMismatch();
        }

        // Save root hash of L2 -> L1 logs tree
        s.l2LogsRootHashes[currentBatchNumber] = _storedBatch.l2LogsTreeRoot;
    }

    /// @inheritdoc IExecutor
    function executeBatchesSharedBridge(
        uint256,
        StoredBatchInfo[] calldata _batchesData
    ) external nonReentrant onlyValidator {
        _executeBatches(_batchesData);
    }

    /// @inheritdoc IExecutor
    function executeBatches(StoredBatchInfo[] calldata _batchesData) external nonReentrant onlyValidator {
        _executeBatches(_batchesData);
    }

    function _executeBatches(StoredBatchInfo[] calldata _batchesData) internal {
        uint256 nBatches = _batchesData.length;
        for (uint256 i = 0; i < nBatches; i = i.uncheckedInc()) {
            _executeOneBatch(_batchesData[i], i);
            emit BlockExecution(_batchesData[i].batchNumber, _batchesData[i].batchHash, _batchesData[i].commitment);
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
    function proveBatches(
        StoredBatchInfo calldata _prevBatch,
        StoredBatchInfo[] calldata _committedBatches,
        ProofInput calldata _proof
    ) external nonReentrant onlyValidator {
        _proveBatches(_prevBatch, _committedBatches, _proof);
    }

    /// @inheritdoc IExecutor
    function proveBatchesSharedBridge(
        uint256, // _chainId
        StoredBatchInfo calldata _prevBatch,
        StoredBatchInfo[] calldata _committedBatches,
        ProofInput calldata _proof
    ) external nonReentrant onlyValidator {
        _proveBatches(_prevBatch, _committedBatches, _proof);
    }

    function _proveBatches(
        StoredBatchInfo calldata _prevBatch,
        StoredBatchInfo[] calldata _committedBatches,
        ProofInput calldata _proof
    ) internal {
        // Save the variables into the stack to save gas on reading them later
        uint256 currentTotalBatchesVerified = s.totalBatchesVerified;
        uint256 committedBatchesLength = _committedBatches.length;

        // Initialize the array, that will be used as public input to the ZKP
        uint256[] memory proofPublicInput = new uint256[](committedBatchesLength);

        // Check that the batch passed by the validator is indeed the first unverified batch
        if (_hashStoredBatchInfo(_prevBatch) != s.storedBatchHashes[currentTotalBatchesVerified]) {
            revert BatchHashMismatch(
                s.storedBatchHashes[currentTotalBatchesVerified],
                _hashStoredBatchInfo(_prevBatch)
            );
        }

        bytes32 prevBatchCommitment = _prevBatch.commitment;
        for (uint256 i = 0; i < committedBatchesLength; i = i.uncheckedInc()) {
            currentTotalBatchesVerified = currentTotalBatchesVerified.uncheckedInc();
            if (_hashStoredBatchInfo(_committedBatches[i]) != s.storedBatchHashes[currentTotalBatchesVerified]) {
                revert BatchHashMismatch(
                    s.storedBatchHashes[currentTotalBatchesVerified],
                    _hashStoredBatchInfo(_committedBatches[i])
                );
            }

            bytes32 currentBatchCommitment = _committedBatches[i].commitment;
            proofPublicInput[i] = _getBatchProofPublicInput(prevBatchCommitment, currentBatchCommitment);

            prevBatchCommitment = currentBatchCommitment;
        }
        if (currentTotalBatchesVerified > s.totalBatchesCommitted) {
            revert VerifiedBatchesExceedsCommittedBatches();
        }

        _verifyProof(proofPublicInput, _proof);

        emit BlocksVerification(s.totalBatchesVerified, currentTotalBatchesVerified);
        s.totalBatchesVerified = currentTotalBatchesVerified;
    }

    function _verifyProof(uint256[] memory proofPublicInput, ProofInput calldata _proof) internal view {
        // We can only process 1 batch proof at a time.
        if (proofPublicInput.length != 1) {
            revert CanOnlyProcessOneBatch();
        }

        bool successVerifyProof = s.verifier.verify(
            proofPublicInput,
            _proof.serializedProof,
            _proof.recursiveAggregationInput
        );
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
    function revertBatches(uint256 _newLastBatch) external nonReentrant onlyValidatorOrStateTransitionManager {
        _revertBatches(_newLastBatch);
    }

    /// @inheritdoc IExecutor
    function revertBatchesSharedBridge(uint256, uint256 _newLastBatch) external nonReentrant onlyValidator {
        _revertBatches(_newLastBatch);
    }

    function _revertBatches(uint256 _newLastBatch) internal {
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
        CommitBatchInfo calldata _newBatchData,
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

    function _batchPassThroughData(CommitBatchInfo calldata _batch) internal pure returns (bytes memory) {
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
        CommitBatchInfo calldata _batch,
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
        if (_blobCommitments.length != MAX_NUMBER_OF_BLOBS || _blobHashes.length != MAX_NUMBER_OF_BLOBS) {
            revert InvalidNumberOfBlobs(MAX_NUMBER_OF_BLOBS, _blobCommitments.length, _blobHashes.length);
        }

        // for each blob we have:
        // linear hash (hash of preimage from system logs) and
        // output hash of blob commitments: keccak(versioned hash || opening point || evaluation value)
        // These values will all be bytes32(0) when we submit pubdata via calldata instead of blobs.
        //
        // For now, only up to 6 blobs are supported by the contract, while 16 are required by the circuits.
        // All the unfilled blobs will have their commitment as 0, including the case when we use only 1 blob.

        blobAuxOutputWords = new bytes32[](2 * TOTAL_BLOBS_IN_COMMITMENT);

        for (uint256 i = 0; i < MAX_NUMBER_OF_BLOBS; ++i) {
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

    /// @notice Calls the point evaluation precompile and verifies the output
    /// Verify p(z) = y given commitment that corresponds to the polynomial p(x) and a KZG proof.
    /// Also verify that the provided commitment matches the provided versioned_hash.
    ///
    function _pointEvaluationPrecompile(
        bytes32 _versionedHash,
        bytes32 _openingPoint,
        bytes calldata _openingValueCommitmentProof
    ) internal view {
        bytes memory precompileInput = abi.encodePacked(_versionedHash, _openingPoint, _openingValueCommitmentProof);

        (bool success, bytes memory data) = POINT_EVALUATION_PRECOMPILE_ADDR.staticcall(precompileInput);

        // We verify that the point evaluation precompile call was successful by testing the latter 32 bytes of the
        // response is equal to BLS_MODULUS as defined in https://eips.ethereum.org/EIPS/eip-4844#point-evaluation-precompile
        if (!success) {
            revert PointEvalCallFailed(precompileInput);
        }
        (, uint256 result) = abi.decode(data, (uint256, uint256));
        if (result != BLS_MODULUS) {
            revert PointEvalFailed(abi.encode(result));
        }
    }

    /// @dev Verifies that the blobs contain the correct data by calling the point evaluation precompile. For the precompile we need:
    /// versioned hash || opening point || opening value || commitment || proof
    /// the _pubdataCommitments will contain the last 4 values, the versioned hash is pulled from the BLOBHASH opcode
    /// pubdataCommitments is a list of: opening point (16 bytes) || claimed value (32 bytes) || commitment (48 bytes) || proof (48 bytes)) = 144 bytes
    function _verifyBlobInformation(
        bytes calldata _pubdataCommitments,
        bytes32[] memory _blobHashes
    ) internal view returns (bytes32[] memory blobCommitments) {
        uint256 versionedHashIndex = 0;

        if (_pubdataCommitments.length == 0) {
            revert PubdataCommitmentsEmpty();
        }
        if (_pubdataCommitments.length > PUBDATA_COMMITMENT_SIZE * MAX_NUMBER_OF_BLOBS) {
            revert PubdataCommitmentsTooBig();
        }
        if (_pubdataCommitments.length % PUBDATA_COMMITMENT_SIZE != 0) {
            revert InvalidPubdataCommitmentsSize();
        }
        blobCommitments = new bytes32[](MAX_NUMBER_OF_BLOBS);

        // We disable this check because calldata array length is cheap.
        // solhint-disable-next-line gas-length-in-loops
        for (uint256 i = 0; i < _pubdataCommitments.length; i += PUBDATA_COMMITMENT_SIZE) {
            bytes32 blobVersionedHash = _getBlobVersionedHash(versionedHashIndex);

            if (blobVersionedHash == bytes32(0)) {
                revert EmptyBlobVersionHash(versionedHashIndex);
            }

            // First 16 bytes is the opening point. While we get the point as 16 bytes, the point evaluation precompile
            // requires it to be 32 bytes. The blob commitment must use the opening point as 16 bytes though.
            bytes32 openingPoint = bytes32(
                uint256(uint128(bytes16(_pubdataCommitments[i:i + PUBDATA_COMMITMENT_CLAIMED_VALUE_OFFSET])))
            );

            _pointEvaluationPrecompile(
                blobVersionedHash,
                openingPoint,
                _pubdataCommitments[i + PUBDATA_COMMITMENT_CLAIMED_VALUE_OFFSET:i + PUBDATA_COMMITMENT_SIZE]
            );

            // Take the hash of the versioned hash || opening point || claimed value
            blobCommitments[versionedHashIndex] = keccak256(
                abi.encodePacked(blobVersionedHash, _pubdataCommitments[i:i + PUBDATA_COMMITMENT_COMMITMENT_OFFSET])
            );
            ++versionedHashIndex;
        }

        // This check is required because we want to ensure that there aren't any extra blobs trying to be published.
        // Calling the BLOBHASH opcode with an index > # blobs - 1 yields bytes32(0)
        bytes32 versionedHash = _getBlobVersionedHash(versionedHashIndex);
        if (versionedHash != bytes32(0)) {
            revert NonEmptyBlobVersionHash(versionedHashIndex);
        }

        // We verify that for each set of blobHash/blobCommitment are either both empty
        // or there are values for both.
        for (uint256 i = 0; i < MAX_NUMBER_OF_BLOBS; ++i) {
            if (
                (_blobHashes[i] == bytes32(0) && blobCommitments[i] != bytes32(0)) ||
                (_blobHashes[i] != bytes32(0) && blobCommitments[i] == bytes32(0))
            ) {
                revert BlobHashCommitmentError(i, _blobHashes[i] == bytes32(0), blobCommitments[i] == bytes32(0));
            }
        }
    }

    function _getBlobVersionedHash(uint256 _index) internal view virtual returns (bytes32 versionedHash) {
        assembly {
            versionedHash := blobhash(_index)
        }
    }
}