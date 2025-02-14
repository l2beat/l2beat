// SPDX-License-Identifier: Unknown
pragma solidity 0.8.17;

library DelayBuffer {
    uint256 public constant BASIS = 10000;

    /// @dev    Depletion is limited by the elapsed blocks in the delayed message queue to avoid double counting and potential L2 reorgs.
    ///         Eg. 2 simultaneous batches sequencing multiple delayed messages with the same 100 blocks delay each
    ///         should count once as a single 100 block delay, not twice as a 200 block delay. This also prevents L2 reorg risk in edge cases.
    ///         Eg. If the buffer is 300 blocks, decrementing the buffer when processing the first batch would allow the second delay message to be force included before the sequencer could add the second batch.
    ///         Buffer depletion also saturates at the threshold instead of zero to allow a recovery margin.
    ///         Eg. when the sequencer recovers from an outage, it is able to wait threshold > finality time before queueing delayed messages to avoid L1 reorgs.
    /// @notice Conditionally updates the buffer. Replenishes the buffer and depletes if delay is unexpected.
    /// @param start The beginning reference point
    /// @param end The ending reference point
    /// @param buffer The buffer to be updated
    /// @param sequenced The reference point when messages were sequenced
    /// @param threshold The threshold to saturate at
    /// @param max The maximum buffer
    /// @param replenishRateInBasis The amount to replenish the buffer per block in basis points.
    function calcBuffer(
        uint256 start,
        uint256 end,
        uint256 buffer,
        uint256 sequenced,
        uint256 threshold,
        uint256 max,
        uint256 replenishRateInBasis
    ) internal pure returns (uint256) {
        uint256 elapsed = end > start ? end - start : 0;
        uint256 delay = sequenced > start ? sequenced - start : 0;
        // replenishment rounds down and will not overflow since all inputs including
        // replenishRateInBasis are cast from uint64 in calcPendingBuffer
        buffer += (elapsed * replenishRateInBasis) / BASIS;

        uint256 unexpectedDelay = delay > threshold ? delay - threshold : 0;
        if (unexpectedDelay > elapsed) {
            unexpectedDelay = elapsed;
        }

        // decrease the buffer
        if (buffer > unexpectedDelay) {
            buffer -= unexpectedDelay;
            if (buffer > threshold) {
                // saturating above at the max
                return buffer > max ? max : buffer;
            }
        }
        // saturating below at the threshold
        return threshold;
    }

    /// @notice Applies update to buffer data
    /// @param self The delay buffer data
    /// @param blockNumber The update block number
    function update(BufferData storage self, uint64 blockNumber) internal {
        self.bufferBlocks = calcPendingBuffer(self, blockNumber);

        // store a new starting reference point
        // any buffer updates will be applied retroactively in the next batch post
        self.prevBlockNumber = blockNumber;
        self.prevSequencedBlockNumber = uint64(block.number);
    }

    /// @dev    The delay buffer can change due to pending depletion / replenishment due to previous delays.
    ///         This function applies pending buffer changes to calculate buffer updates.
    /// @notice Calculates the buffer changes up to the requested block number
    /// @param self The delay buffer data
    /// @param blockNumber The block number to process the delay up to
    function calcPendingBuffer(
        BufferData storage self,
        uint64 blockNumber
    ) internal view returns (uint64) {
        // bufferUpdate will not overflow since inputs are uint64
        return uint64(
            calcBuffer({
                start: self.prevBlockNumber,
                end: blockNumber,
                buffer: self.bufferBlocks,
                threshold: self.threshold,
                sequenced: self.prevSequencedBlockNumber,
                max: self.max,
                replenishRateInBasis: self.replenishRateInBasis
            })
        );
    }

    /// @dev    This is the `sync validity window` during which no proofs are required.
    /// @notice Returns true if the inbox is in a synced state (no unexpected delays are possible)
    function isSynced(
        BufferData storage self
    ) internal view returns (bool) {
        return block.number - self.prevBlockNumber <= self.threshold;
    }

    function isUpdatable(
        BufferData storage self
    ) internal view returns (bool) {
        // if synced, the buffer can't be depleted
        // if full, the buffer can't be replenished
        // if neither synced nor full, the buffer updatable (depletable / replenishable)
        return !isSynced(self) || self.bufferBlocks < self.max;
    }

    function isValidBufferConfig(
        BufferConfig memory config
    ) internal pure returns (bool) {
        return config.threshold != 0 && config.max != 0 && config.replenishRateInBasis <= BASIS
            && config.threshold <= config.max;
    }
}

struct BufferData {
    uint64 bufferBlocks;
    uint64 max;
    uint64 threshold;
    uint64 prevBlockNumber;
    uint64 replenishRateInBasis;
    uint64 prevSequencedBlockNumber;
}

library ArbitrumChecker {
    function runningOnArbitrum() internal view returns (bool) {
        (bool ok, bytes memory data) =
            address(100).staticcall(abi.encodeWithSelector(ArbSys.arbOSVersion.selector));
        return ok && data.length == 32;
    }
}

interface IDelayedMessageProvider {
    /// @dev event emitted when a inbox message is added to the Bridge's delayed accumulator
    event InboxMessageDelivered(uint256 indexed messageNum, bytes data);

    /// @dev event emitted when a inbox message is added to the Bridge's delayed accumulator
    /// same as InboxMessageDelivered but the batch data is available in tx.input
    event InboxMessageDeliveredFromOrigin(uint256 indexed messageNum);
}

struct BufferConfig {
    uint64 threshold;
    uint64 max;
    uint64 replenishRateInBasis;
}

library Messages {
    struct Message {
        uint8 kind;
        address sender;
        uint64 blockNumber;
        uint64 timestamp;
        uint256 inboxSeqNum;
        uint256 baseFeeL1;
        bytes32 messageDataHash;
    }

    function messageHash(
        Message memory message
    ) internal pure returns (bytes32) {
        return messageHash(
            message.kind,
            message.sender,
            message.blockNumber,
            message.timestamp,
            message.inboxSeqNum,
            message.baseFeeL1,
            message.messageDataHash
        );
    }

    function messageHash(
        uint8 kind,
        address sender,
        uint64 blockNumber,
        uint64 timestamp,
        uint256 inboxSeqNum,
        uint256 baseFeeL1,
        bytes32 messageDataHash
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                kind, sender, blockNumber, timestamp, inboxSeqNum, baseFeeL1, messageDataHash
            )
        );
    }

    function accumulateInboxMessage(
        bytes32 prevAcc,
        bytes32 message
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(prevAcc, message));
    }

    /// @dev   Validates a delayed accumulator preimage
    /// @param delayedAcc The delayed accumulator to validate against
    /// @param beforeDelayedAcc The previous delayed accumulator
    /// @param message The message to validate
    function isValidDelayedAccPreimage(
        bytes32 delayedAcc,
        bytes32 beforeDelayedAcc,
        Message memory message
    ) internal pure returns (bool) {
        return delayedAcc == accumulateInboxMessage(beforeDelayedAcc, messageHash(message));
    }
}

struct DelayProof {
    bytes32 beforeDelayedAcc;
    Messages.Message delayedMessage;
}

interface ISequencerInbox is IDelayedMessageProvider {
    /// @notice The maximum amount of time variatin between a message being posted on the L1 and being executed on the L2
    /// @param delayBlocks The max amount of blocks in the past that a message can be received on L2
    /// @param futureBlocks The max amount of blocks in the future that a message can be received on L2
    /// @param delaySeconds The max amount of seconds in the past that a message can be received on L2
    /// @param futureSeconds The max amount of seconds in the future that a message can be received on L2
    struct MaxTimeVariation {
        uint256 delayBlocks;
        uint256 futureBlocks;
        uint256 delaySeconds;
        uint256 futureSeconds;
    }

    event SequencerBatchDelivered(
        uint256 indexed batchSequenceNumber,
        bytes32 indexed beforeAcc,
        bytes32 indexed afterAcc,
        bytes32 delayedAcc,
        uint256 afterDelayedMessagesRead,
        IBridge.TimeBounds timeBounds,
        IBridge.BatchDataLocation dataLocation
    );

    event OwnerFunctionCalled(uint256 indexed id);

    /// @dev a separate event that emits batch data when this isn't easily accessible in the tx.input
    event SequencerBatchData(uint256 indexed batchSequenceNumber, bytes data);

    /// @dev a valid keyset was added
    event SetValidKeyset(bytes32 indexed keysetHash, bytes keysetBytes);

    /// @dev a keyset was invalidated
    event InvalidateKeyset(bytes32 indexed keysetHash);

    /// @dev Owner set max time variation.
    ///      This event may have been introduced in an upgrade and therefore might not give the full history.
    ///      To get the full history, search for `OwnerFunctionCalled(0)` events.
    event MaxTimeVariationSet(MaxTimeVariation maxTimeVariation);

    /// @dev Owner set a batch poster.
    ///      This event may have been introduced in an upgrade and therefore might not give the full history.
    ///      To get the full history, search for `OwnerFunctionCalled(1)` events.
    event BatchPosterSet(address batchPoster, bool isBatchPoster);

    /// @dev Owner or batch poster manager set a sequencer.
    ///      This event may have been introduced in an upgrade and therefore might not give the full history.
    ///      To get the full history, search for `OwnerFunctionCalled(4)` events.
    event SequencerSet(address addr, bool isSequencer);

    /// @dev Owner set the batch poster manager.
    ///      This event may have been introduced in an upgrade and therefore might not give the full history.
    ///      To get the full history, search for `OwnerFunctionCalled(5)` events.
    event BatchPosterManagerSet(address newBatchPosterManager);

    /// @dev Owner set the buffer config.
    event BufferConfigSet(BufferConfig bufferConfig);

    function totalDelayedMessagesRead() external view returns (uint256);

    function bridge() external view returns (IBridge);

    /// @dev The size of the batch header
    // solhint-disable-next-line func-name-mixedcase
    function HEADER_LENGTH() external view returns (uint256);

    /// @dev If the first batch data byte after the header has this bit set,
    ///      the sequencer inbox has authenticated the data. Currently only used for 4844 blob support.
    ///      See: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
    // solhint-disable-next-line func-name-mixedcase
    function DATA_AUTHENTICATED_FLAG() external view returns (bytes1);

    /// @dev If the first data byte after the header has this bit set,
    ///      then the batch data is to be found in 4844 data blobs
    ///      See: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
    // solhint-disable-next-line func-name-mixedcase
    function DATA_BLOB_HEADER_FLAG() external view returns (bytes1);

    /// @dev If the first data byte after the header has this bit set,
    ///      then the batch data is a das message
    ///      See: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
    // solhint-disable-next-line func-name-mixedcase
    function DAS_MESSAGE_HEADER_FLAG() external view returns (bytes1);

    /// @dev If the first data byte after the header has this bit set,
    ///      then the batch data is a das message that employs a merklesization strategy
    ///      See: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
    // solhint-disable-next-line func-name-mixedcase
    function TREE_DAS_MESSAGE_HEADER_FLAG() external view returns (bytes1);

    /// @dev If the first data byte after the header has this bit set,
    ///      then the batch data has been brotli compressed
    ///      See: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
    // solhint-disable-next-line func-name-mixedcase
    function BROTLI_MESSAGE_HEADER_FLAG() external view returns (bytes1);

    /// @dev If the first data byte after the header has this bit set,
    ///      then the batch data uses a zero heavy encoding
    ///      See: https://github.com/OffchainLabs/nitro/blob/69de0603abf6f900a4128cab7933df60cad54ded/arbstate/das_reader.go
    // solhint-disable-next-line func-name-mixedcase
    function ZERO_HEAVY_MESSAGE_HEADER_FLAG() external view returns (bytes1);

    function rollup() external view returns (IOwnable);

    function isBatchPoster(
        address
    ) external view returns (bool);

    function isSequencer(
        address
    ) external view returns (bool);

    /// @notice True is the sequencer inbox is delay bufferable
    function isDelayBufferable() external view returns (bool);

    function maxDataSize() external view returns (uint256);

    /// @notice The batch poster manager has the ability to change the batch poster addresses
    ///         This enables the batch poster to do key rotation
    function batchPosterManager() external view returns (address);

    struct DasKeySetInfo {
        bool isValidKeyset;
        uint64 creationBlock;
    }

    /// @dev returns 4 uint256 to be compatible with older version
    function maxTimeVariation()
        external
        view
        returns (
            uint256 delayBlocks,
            uint256 futureBlocks,
            uint256 delaySeconds,
            uint256 futureSeconds
        );

    function dasKeySetInfo(
        bytes32
    ) external view returns (bool, uint64);

    /// @notice Remove force inclusion delay after a L1 chainId fork
    function removeDelayAfterFork() external;

    /// @notice Force messages from the delayed inbox to be included in the chain
    ///         Callable by any address, but message can only be force-included after maxTimeVariation.delayBlocks
    ///         has elapsed. As part of normal behaviour the sequencer will include these
    ///         messages so it's only necessary to call this if the sequencer is down, or not including any delayed messages.
    /// @param _totalDelayedMessagesRead The total number of messages to read up to
    /// @param kind The kind of the last message to be included
    /// @param l1BlockAndTime The l1 block and the l1 timestamp of the last message to be included
    /// @param baseFeeL1 The l1 gas price of the last message to be included
    /// @param sender The sender of the last message to be included
    /// @param messageDataHash The messageDataHash of the last message to be included
    function forceInclusion(
        uint256 _totalDelayedMessagesRead,
        uint8 kind,
        uint64[2] calldata l1BlockAndTime,
        uint256 baseFeeL1,
        address sender,
        bytes32 messageDataHash
    ) external;

    function inboxAccs(
        uint256 index
    ) external view returns (bytes32);

    function batchCount() external view returns (uint256);

    function isValidKeysetHash(
        bytes32 ksHash
    ) external view returns (bool);

    /// @notice the creation block is intended to still be available after a keyset is deleted
    function getKeysetCreationBlock(
        bytes32 ksHash
    ) external view returns (uint256);

    /// @dev    The delay buffer can change due to pending depletion/replenishment.
    ///         This function applies pending buffer changes to proactively calculate the force inclusion deadline.
    ///         This is only relevant when the buffer is less than the delayBlocks (unhappy case), otherwise force inclusion deadline is fixed at delayBlocks.
    /// @notice Calculates the upper bounds of the delay buffer
    /// @param blockNumber The block number when a delayed message was created
    /// @return blockNumberDeadline The block number at when the message can be force included
    function forceInclusionDeadline(
        uint64 blockNumber
    ) external view returns (uint64 blockNumberDeadline);

    // ---------- BatchPoster functions ----------

    /// @dev Deprecated, kept for abi generation and will be removed in the future
    function addSequencerL2BatchFromOrigin(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder
    ) external;

    /// @dev Will be deprecated due to EIP-3074, use `addSequencerL2Batch` instead
    function addSequencerL2BatchFromOrigin(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount
    ) external;

    function addSequencerL2Batch(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount
    ) external;

    function addSequencerL2BatchFromBlobs(
        uint256 sequenceNumber,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount
    ) external;

    /// @dev    Proves message delays, updates delay buffers, and posts an L2 batch with blob data.
    ///         DelayProof proves the delay of the message and syncs the delay buffer.
    function addSequencerL2BatchFromBlobsDelayProof(
        uint256 sequenceNumber,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount,
        DelayProof calldata delayProof
    ) external;

    /// @dev    Proves message delays, updates delay buffers, and posts an L2 batch with calldata posted from an EOA.
    ///         DelayProof proves the delay of the message and syncs the delay buffer.
    ///         Will be deprecated due to EIP-3074, use `addSequencerL2BatchDelayProof` instead
    function addSequencerL2BatchFromOriginDelayProof(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount,
        DelayProof calldata delayProof
    ) external;

    /// @dev    Proves message delays, updates delay buffers, and posts an L2 batch with calldata.
    ///         delayProof is used to prove the delay of the message and syncs the delay buffer.
    function addSequencerL2BatchDelayProof(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount,
        DelayProof calldata delayProof
    ) external;

    // ---------- onlyRollupOrOwner functions ----------

    /**
     * @notice Set max delay for sequencer inbox
     * @param maxTimeVariation_ the maximum time variation parameters
     */
    function setMaxTimeVariation(
        MaxTimeVariation memory maxTimeVariation_
    ) external;

    /**
     * @notice Updates whether an address is authorized to be a batch poster at the sequencer inbox
     * @param addr the address
     * @param isBatchPoster_ if the specified address should be authorized as a batch poster
     */
    function setIsBatchPoster(address addr, bool isBatchPoster_) external;

    /**
     * @notice Makes Data Availability Service keyset valid
     * @param keysetBytes bytes of the serialized keyset
     */
    function setValidKeyset(
        bytes calldata keysetBytes
    ) external;

    /**
     * @notice Invalidates a Data Availability Service keyset
     * @param ksHash hash of the keyset
     */
    function invalidateKeysetHash(
        bytes32 ksHash
    ) external;

    /**
     * @notice Updates whether an address is authorized to be a sequencer.
     * @dev The IsSequencer information is used only off-chain by the nitro node to validate sequencer feed signer.
     * @param addr the address
     * @param isSequencer_ if the specified address should be authorized as a sequencer
     */
    function setIsSequencer(address addr, bool isSequencer_) external;

    /**
     * @notice Updates the batch poster manager, the address which has the ability to rotate batch poster keys
     * @param newBatchPosterManager The new batch poster manager to be set
     */
    function setBatchPosterManager(
        address newBatchPosterManager
    ) external;

    /// @notice Allows the rollup owner to sync the rollup address
    function updateRollupAddress() external;

    // ---------- initializer ----------

    function initialize(
        IBridge bridge_,
        MaxTimeVariation calldata maxTimeVariation_,
        BufferConfig calldata bufferConfig_
    ) external;
}

library CallerChecker {
    /**
     * @notice A EIP-7702 safe check to ensure the caller is the origin and is codeless
     * @return bool true if the caller is the origin and is codeless, false otherwise
     * @dev    If the caller is the origin and is codeless, then msg.data is guaranteed to be same as tx.data
     *         It also mean the caller would not be able to call a contract multiple times with the same transaction
     */
    function isCallerCodelessOrigin() internal view returns (bool) {
        // solhint-disable-next-line avoid-tx-origin
        return msg.sender == tx.origin && msg.sender.code.length == 0;
    }
}

abstract contract GasRefundEnabled {
    uint256 internal immutable gasPerBlob = 2 ** 17;

    /// @dev this refunds the sender for execution costs of the tx
    /// calldata costs are only refunded if `msg.sender == tx.origin` to guarantee the value refunded relates to charging
    /// for the `tx.input`. this avoids a possible attack where you generate large calldata from a contract and get over-refunded
    modifier refundsGas(IGasRefunder gasRefunder, IReader4844 reader4844) {
        uint256 startGasLeft = gasleft();
        _;
        if (address(gasRefunder) != address(0)) {
            uint256 calldataSize = msg.data.length;
            uint256 calldataWords = (calldataSize + 31) / 32;
            // account for the CALLDATACOPY cost of the proxy contract, including the memory expansion cost
            startGasLeft += calldataWords * 6 + (calldataWords ** 2) / 512;
            // if triggered in a contract call, the spender may be overrefunded by appending dummy data to the call
            // so we check if it is a top level call, which would mean the sender paid calldata as part of tx.input
            if (!CallerChecker.isCallerCodelessOrigin()) {
                // We can't be sure if this calldata came from the top level tx,
                // so to be safe we tell the gas refunder there was no calldata.
                calldataSize = 0;
            } else {
                // for similar reasons to above we only refund blob gas when the tx.origin is the msg.sender
                // this avoids the caller being able to send blobs to other contracts and still get refunded here
                if (address(reader4844) != address(0)) {
                    // add any cost for 4844 data, the data hash reader throws an error prior to 4844 being activated
                    // we do this addition here rather in the GasRefunder so that we can check the msg.sender is the tx.origin
                    try reader4844.getDataHashes() returns (bytes32[] memory dataHashes) {
                        if (dataHashes.length != 0) {
                            uint256 blobBasefee = reader4844.getBlobBaseFee();
                            startGasLeft +=
                                (dataHashes.length * gasPerBlob * blobBasefee) / block.basefee;
                        }
                    } catch {}
                }
            }

            gasRefunder.onGasSpent(payable(msg.sender), startGasLeft - gasleft(), calldataSize);
        }
    }
}

abstract contract DelegateCallAware {
    address private immutable __self = address(this);

    /**
     * @dev Check that the execution is being performed through a delegate call. This allows a function to be
     * callable on the proxy contract but not on the logic contract.
     */
    modifier onlyDelegated() {
        require(address(this) != __self, "Function must be called through delegatecall");
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        require(address(this) == __self, "Function must not be called through delegatecall");
        _;
    }

    /// @dev Check that msg.sender is the current EIP 1967 proxy admin
    modifier onlyProxyOwner() {
        // Storage slot with the admin of the proxy contract
        // This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1
        bytes32 slot = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;
        address admin;
        assembly {
            admin := sload(slot)
        }
        if (msg.sender != admin) revert NotOwner(msg.sender, admin);
        _;
    }
}

contract SequencerInbox is DelegateCallAware, GasRefundEnabled, ISequencerInbox {
    uint256 public totalDelayedMessagesRead;

    IBridge public bridge;

    /// @inheritdoc ISequencerInbox
    uint256 public constant HEADER_LENGTH = 40;

    /// @inheritdoc ISequencerInbox
    bytes1 public constant DATA_AUTHENTICATED_FLAG = 0x40;

    /// @inheritdoc ISequencerInbox
    bytes1 public constant DATA_BLOB_HEADER_FLAG = DATA_AUTHENTICATED_FLAG | 0x10;

    /// @inheritdoc ISequencerInbox
    bytes1 public constant DAS_MESSAGE_HEADER_FLAG = 0x80;

    /// @inheritdoc ISequencerInbox
    bytes1 public constant TREE_DAS_MESSAGE_HEADER_FLAG = 0x08;

    /// @inheritdoc ISequencerInbox
    bytes1 public constant BROTLI_MESSAGE_HEADER_FLAG = 0x00;

    /// @inheritdoc ISequencerInbox
    bytes1 public constant ZERO_HEAVY_MESSAGE_HEADER_FLAG = 0x20;

    // GAS_PER_BLOB from EIP-4844
    uint256 internal constant GAS_PER_BLOB = 1 << 17;

    IOwnable public rollup;

    mapping(address => bool) public isBatchPoster;

    // we previously stored the max time variation in a (uint,uint,uint,uint) struct here
    // solhint-disable-next-line var-name-mixedcase
    ISequencerInbox.MaxTimeVariation private __LEGACY_MAX_TIME_VARIATION;

    mapping(bytes32 => DasKeySetInfo) public dasKeySetInfo;

    modifier onlyRollupOwner() {
        if (msg.sender != rollup.owner()) revert NotOwner(msg.sender, rollup.owner());
        _;
    }

    modifier onlyRollupOwnerOrBatchPosterManager() {
        if (msg.sender != rollup.owner() && msg.sender != batchPosterManager) {
            revert NotBatchPosterManager(msg.sender);
        }
        _;
    }

    mapping(address => bool) public isSequencer;
    IReader4844 public immutable reader4844;

    // see ISequencerInbox.MaxTimeVariation
    uint64 internal delayBlocks;
    uint64 internal futureBlocks;
    uint64 internal delaySeconds;
    uint64 internal futureSeconds;

    /// @inheritdoc ISequencerInbox
    address public batchPosterManager;

    // On L1 this should be set to 117964: 90% of Geth's 128KB tx size limit, leaving ~13KB for proving
    uint256 public immutable maxDataSize;
    uint256 internal immutable deployTimeChainId = block.chainid;
    // If the chain this SequencerInbox is deployed on is an Arbitrum chain.
    bool internal immutable hostChainIsArbitrum = ArbitrumChecker.runningOnArbitrum();
    // True if the chain this SequencerInbox is deployed on uses custom fee token
    bool public immutable isUsingFeeToken;
    // True if the SequencerInbox is delay bufferable
    bool public immutable isDelayBufferable;

    using DelayBuffer for BufferData;

    BufferData public buffer;

    constructor(
        uint256 _maxDataSize,
        IReader4844 reader4844_,
        bool _isUsingFeeToken,
        bool _isDelayBufferable
    ) {
        maxDataSize = _maxDataSize;
        if (hostChainIsArbitrum) {
            if (reader4844_ != IReader4844(address(0))) revert DataBlobsNotSupported();
        } else {
            if (reader4844_ == IReader4844(address(0))) revert InitParamZero("Reader4844");
        }
        reader4844 = reader4844_;
        isUsingFeeToken = _isUsingFeeToken;
        isDelayBufferable = _isDelayBufferable;
    }

    function _chainIdChanged() internal view returns (bool) {
        return deployTimeChainId != block.chainid;
    }

    function postUpgradeInit(
        BufferConfig memory bufferConfig_
    ) external onlyDelegated onlyProxyOwner {
        if (!isDelayBufferable) revert NotDelayBufferable();

        // Assuming we would not upgrade from a version that does not have the buffer initialized
        // If that is the case, postUpgradeInit do not need to be called
        if (buffer.bufferBlocks != 0) {
            revert AlreadyInit();
        }

        _setBufferConfig(bufferConfig_);
    }

    function initialize(
        IBridge bridge_,
        ISequencerInbox.MaxTimeVariation calldata maxTimeVariation_,
        BufferConfig memory bufferConfig_
    ) external onlyDelegated {
        if (bridge != IBridge(address(0))) revert AlreadyInit();
        if (bridge_ == IBridge(address(0))) revert HadZeroInit();

        // Make sure logic contract was created by proper value for 'isUsingFeeToken'.
        // Bridge in ETH based chains doesn't implement nativeToken(). In future it might implement it and return address(0)
        bool actualIsUsingFeeToken = false;
        try IERC20Bridge(address(bridge_)).nativeToken() returns (address feeToken) {
            if (feeToken != address(0)) {
                actualIsUsingFeeToken = true;
            }
        } catch {}
        if (isUsingFeeToken != actualIsUsingFeeToken) {
            revert NativeTokenMismatch();
        }

        bridge = bridge_;
        rollup = bridge_.rollup();

        _setMaxTimeVariation(maxTimeVariation_);

        if (isDelayBufferable) {
            _setBufferConfig(bufferConfig_);
        }
    }

    /// @notice Allows the rollup owner to sync the rollup address
    function updateRollupAddress() external {
        if (msg.sender != IOwnable(rollup).owner()) {
            revert NotOwner(msg.sender, IOwnable(rollup).owner());
        }
        IOwnable newRollup = bridge.rollup();
        if (rollup == newRollup) revert RollupNotChanged();
        rollup = newRollup;
    }

    function getTimeBounds() internal view virtual returns (IBridge.TimeBounds memory) {
        IBridge.TimeBounds memory bounds;
        (uint64 delayBlocks_, uint64 futureBlocks_, uint64 delaySeconds_, uint64 futureSeconds_) =
            maxTimeVariationInternal();
        if (block.timestamp > delaySeconds_) {
            bounds.minTimestamp = uint64(block.timestamp) - delaySeconds_;
        }
        bounds.maxTimestamp = uint64(block.timestamp) + futureSeconds_;
        if (block.number > delayBlocks_) {
            bounds.minBlockNumber = uint64(block.number) - delayBlocks_;
        }
        bounds.maxBlockNumber = uint64(block.number) + futureBlocks_;
        return bounds;
    }

    /// @inheritdoc ISequencerInbox
    function removeDelayAfterFork() external {
        if (!_chainIdChanged()) revert NotForked();
        delayBlocks = 1;
        futureBlocks = 1;
        delaySeconds = 1;
        futureSeconds = 1;
    }

    function maxTimeVariation() external view returns (uint256, uint256, uint256, uint256) {
        (uint64 delayBlocks_, uint64 futureBlocks_, uint64 delaySeconds_, uint64 futureSeconds_) =
            maxTimeVariationInternal();

        return (
            uint256(delayBlocks_),
            uint256(futureBlocks_),
            uint256(delaySeconds_),
            uint256(futureSeconds_)
        );
    }

    function maxTimeVariationInternal() internal view returns (uint64, uint64, uint64, uint64) {
        if (_chainIdChanged()) {
            return (1, 1, 1, 1);
        } else {
            return (delayBlocks, futureBlocks, delaySeconds, futureSeconds);
        }
    }

    /// @inheritdoc ISequencerInbox
    function forceInclusion(
        uint256 _totalDelayedMessagesRead,
        uint8 kind,
        uint64[2] calldata l1BlockAndTime,
        uint256 baseFeeL1,
        address sender,
        bytes32 messageDataHash
    ) external {
        if (_totalDelayedMessagesRead <= totalDelayedMessagesRead) revert DelayedBackwards();
        bytes32 messageHash = Messages.messageHash(
            kind,
            sender,
            l1BlockAndTime[0],
            l1BlockAndTime[1],
            _totalDelayedMessagesRead - 1,
            baseFeeL1,
            messageDataHash
        );

        uint256 delayBlocks_ = delayBlocks;

        if (isDelayBufferable) {
            // proactively apply any pending delay buffer updates before the force included message l1BlockAndTime
            buffer.update(l1BlockAndTime[0]);
            delayBlocks_ = delayBufferableBlocks(buffer.bufferBlocks);
        }
        // Can only force-include after the Sequencer-only window has expired.
        if (l1BlockAndTime[0] + delayBlocks_ >= block.number) revert ForceIncludeBlockTooSoon();

        // Verify that message hash represents the last message sequence of delayed message to be included
        bytes32 prevDelayedAcc = 0;
        if (_totalDelayedMessagesRead > 1) {
            prevDelayedAcc = bridge.delayedInboxAccs(_totalDelayedMessagesRead - 2);
        }
        if (
            bridge.delayedInboxAccs(_totalDelayedMessagesRead - 1)
                != Messages.accumulateInboxMessage(prevDelayedAcc, messageHash)
        ) revert IncorrectMessagePreimage();

        (bytes32 dataHash, IBridge.TimeBounds memory timeBounds) =
            formEmptyDataHash(_totalDelayedMessagesRead);
        uint256 __totalDelayedMessagesRead = _totalDelayedMessagesRead;
        uint256 prevSeqMsgCount = bridge.sequencerReportedSubMessageCount();
        uint256 newSeqMsgCount = prevSeqMsgCount; // force inclusion should not modify sequencer message count
        (uint256 seqMessageIndex, bytes32 beforeAcc, bytes32 delayedAcc, bytes32 afterAcc) =
        addSequencerL2BatchImpl(
            dataHash, __totalDelayedMessagesRead, 0, prevSeqMsgCount, newSeqMsgCount
        );
        emit SequencerBatchDelivered(
            seqMessageIndex,
            beforeAcc,
            afterAcc,
            delayedAcc,
            totalDelayedMessagesRead,
            timeBounds,
            IBridge.BatchDataLocation.NoData
        );
    }

    /// @inheritdoc ISequencerInbox
    function addSequencerL2BatchFromOrigin(
        uint256,
        bytes calldata,
        uint256,
        IGasRefunder
    ) external pure {
        revert Deprecated();
    }

    /// @inheritdoc ISequencerInbox
    function addSequencerL2BatchFromOrigin(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount
    ) external refundsGas(gasRefunder, IReader4844(address(0))) {
        if (!CallerChecker.isCallerCodelessOrigin()) revert NotCodelessOrigin();
        if (!isBatchPoster[msg.sender]) revert NotBatchPoster();
        if (isDelayProofRequired(afterDelayedMessagesRead)) revert DelayProofRequired();

        addSequencerL2BatchFromCalldataImpl(
            sequenceNumber, data, afterDelayedMessagesRead, prevMessageCount, newMessageCount, true
        );
    }

    /// @inheritdoc ISequencerInbox
    function addSequencerL2BatchFromBlobs(
        uint256 sequenceNumber,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount
    ) external refundsGas(gasRefunder, reader4844) {
        if (!isBatchPoster[msg.sender]) revert NotBatchPoster();
        if (isDelayProofRequired(afterDelayedMessagesRead)) revert DelayProofRequired();

        addSequencerL2BatchFromBlobsImpl(
            sequenceNumber, afterDelayedMessagesRead, prevMessageCount, newMessageCount
        );
    }

    /// @inheritdoc ISequencerInbox
    function addSequencerL2BatchFromBlobsDelayProof(
        uint256 sequenceNumber,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount,
        DelayProof calldata delayProof
    ) external refundsGas(gasRefunder, reader4844) {
        if (!isBatchPoster[msg.sender]) revert NotBatchPoster();
        if (!isDelayBufferable) revert NotDelayBufferable();

        delayProofImpl(afterDelayedMessagesRead, delayProof);
        addSequencerL2BatchFromBlobsImpl(
            sequenceNumber, afterDelayedMessagesRead, prevMessageCount, newMessageCount
        );
    }

    /// @inheritdoc ISequencerInbox
    function addSequencerL2BatchFromOriginDelayProof(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount,
        DelayProof calldata delayProof
    ) external refundsGas(gasRefunder, IReader4844(address(0))) {
        if (!CallerChecker.isCallerCodelessOrigin()) revert NotCodelessOrigin();
        if (!isBatchPoster[msg.sender]) revert NotBatchPoster();
        if (!isDelayBufferable) revert NotDelayBufferable();

        delayProofImpl(afterDelayedMessagesRead, delayProof);
        addSequencerL2BatchFromCalldataImpl(
            sequenceNumber, data, afterDelayedMessagesRead, prevMessageCount, newMessageCount, true
        );
    }

    function addSequencerL2BatchFromBlobsImpl(
        uint256 sequenceNumber,
        uint256 afterDelayedMessagesRead,
        uint256 prevMessageCount,
        uint256 newMessageCount
    ) internal {
        (bytes32 dataHash, IBridge.TimeBounds memory timeBounds, uint256 blobGas) =
            formBlobDataHash(afterDelayedMessagesRead);

        // we use addSequencerL2BatchImpl for submitting the message
        // normally this would also submit a batch spending report but that is skipped if we pass
        // an empty call data size, then we submit a separate batch spending report later
        (uint256 seqMessageIndex, bytes32 beforeAcc, bytes32 delayedAcc, bytes32 afterAcc) =
        addSequencerL2BatchImpl(
            dataHash, afterDelayedMessagesRead, 0, prevMessageCount, newMessageCount
        );

        // ~uint256(0) is type(uint256).max, but ever so slightly cheaper
        if (seqMessageIndex != sequenceNumber && sequenceNumber != ~uint256(0)) {
            revert BadSequencerNumber(seqMessageIndex, sequenceNumber);
        }

        emit SequencerBatchDelivered(
            sequenceNumber,
            beforeAcc,
            afterAcc,
            delayedAcc,
            totalDelayedMessagesRead,
            timeBounds,
            IBridge.BatchDataLocation.Blob
        );

        // blobs are currently not supported on host arbitrum chains, when support is added it may
        // consume gas in a different way to L1, so explicitly block host arb chains so that if support for blobs
        // on arb is added it will need to explicitly turned on in the sequencer inbox
        if (hostChainIsArbitrum) revert DataBlobsNotSupported();

        // submit a batch spending report to refund the entity that produced the blob batch data
        // same as using calldata, we only submit spending report if the caller is the origin and is codeless
        // such that one cannot "double-claim" batch posting refund in the same tx
        if (CallerChecker.isCallerCodelessOrigin() && !isUsingFeeToken) {
            submitBatchSpendingReport(dataHash, seqMessageIndex, block.basefee, blobGas);
        }
    }

    function addSequencerL2BatchFromCalldataImpl(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        uint256 prevMessageCount,
        uint256 newMessageCount,
        bool isFromCodelessOrigin
    ) internal {
        (bytes32 dataHash, IBridge.TimeBounds memory timeBounds) =
            formCallDataHash(data, afterDelayedMessagesRead);
        (uint256 seqMessageIndex, bytes32 beforeAcc, bytes32 delayedAcc, bytes32 afterAcc) =
        addSequencerL2BatchImpl(
            dataHash,
            afterDelayedMessagesRead,
            isFromCodelessOrigin ? data.length : 0,
            prevMessageCount,
            newMessageCount
        );

        // ~uint256(0) is type(uint256).max, but ever so slightly cheaper
        if (seqMessageIndex != sequenceNumber && sequenceNumber != ~uint256(0)) {
            revert BadSequencerNumber(seqMessageIndex, sequenceNumber);
        }

        emit SequencerBatchDelivered(
            seqMessageIndex,
            beforeAcc,
            afterAcc,
            delayedAcc,
            totalDelayedMessagesRead,
            timeBounds,
            isFromCodelessOrigin
                ? IBridge.BatchDataLocation.TxInput
                : IBridge.BatchDataLocation.SeparateBatchEvent
        );

        if (!isFromCodelessOrigin) {
            emit SequencerBatchData(seqMessageIndex, data);
        }
    }

    /// @inheritdoc ISequencerInbox
    function addSequencerL2Batch(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount
    ) external override refundsGas(gasRefunder, IReader4844(address(0))) {
        if (!isBatchPoster[msg.sender] && msg.sender != address(rollup)) revert NotBatchPoster();
        if (isDelayProofRequired(afterDelayedMessagesRead)) revert DelayProofRequired();

        addSequencerL2BatchFromCalldataImpl(
            sequenceNumber, data, afterDelayedMessagesRead, prevMessageCount, newMessageCount, false
        );
    }

    /// @inheritdoc ISequencerInbox
    function addSequencerL2BatchDelayProof(
        uint256 sequenceNumber,
        bytes calldata data,
        uint256 afterDelayedMessagesRead,
        IGasRefunder gasRefunder,
        uint256 prevMessageCount,
        uint256 newMessageCount,
        DelayProof calldata delayProof
    ) external refundsGas(gasRefunder, IReader4844(address(0))) {
        if (!isBatchPoster[msg.sender] && msg.sender != address(rollup)) revert NotBatchPoster();
        if (!isDelayBufferable) revert NotDelayBufferable();

        delayProofImpl(afterDelayedMessagesRead, delayProof);
        addSequencerL2BatchFromCalldataImpl(
            sequenceNumber, data, afterDelayedMessagesRead, prevMessageCount, newMessageCount, false
        );
    }

    function delayProofImpl(
        uint256 afterDelayedMessagesRead,
        DelayProof memory delayProof
    ) internal {
        // buffer update depends on new delayed messages. if none are read, no buffer update is proccessed
        if (afterDelayedMessagesRead > totalDelayedMessagesRead) {
            if (buffer.isUpdatable()) {
                // delayedAcc of the 1st new delayed message
                bytes32 delayedAcc = bridge.delayedInboxAccs(totalDelayedMessagesRead);
                // validate delayProof against the delayed accumulator
                if (
                    !Messages.isValidDelayedAccPreimage(
                        delayedAcc, delayProof.beforeDelayedAcc, delayProof.delayedMessage
                    )
                ) {
                    revert InvalidDelayedAccPreimage();
                }
                buffer.update(delayProof.delayedMessage.blockNumber);
            }
        }
    }

    function isDelayProofRequired(
        uint256 afterDelayedMessagesRead
    ) internal view returns (bool) {
        // if no new delayed messages are read, no buffer updates can be applied, so no proof required
        // if the buffer is synced, the buffer cannot be depleted, so no proof is required
        return isDelayBufferable && afterDelayedMessagesRead > totalDelayedMessagesRead
            && !buffer.isSynced();
    }

    function packHeader(
        uint256 afterDelayedMessagesRead
    ) internal view returns (bytes memory, IBridge.TimeBounds memory) {
        IBridge.TimeBounds memory timeBounds = getTimeBounds();
        bytes memory header = abi.encodePacked(
            timeBounds.minTimestamp,
            timeBounds.maxTimestamp,
            timeBounds.minBlockNumber,
            timeBounds.maxBlockNumber,
            uint64(afterDelayedMessagesRead)
        );
        // This must always be true from the packed encoding
        assert(header.length == HEADER_LENGTH);
        return (header, timeBounds);
    }

    /// @dev    Form a hash for a sequencer message with no batch data
    /// @param  afterDelayedMessagesRead The delayed messages count read up to
    /// @return The data hash
    /// @return The timebounds within which the message should be processed
    function formEmptyDataHash(
        uint256 afterDelayedMessagesRead
    ) internal view returns (bytes32, IBridge.TimeBounds memory) {
        (bytes memory header, IBridge.TimeBounds memory timeBounds) =
            packHeader(afterDelayedMessagesRead);
        return (keccak256(header), timeBounds);
    }

    /// @dev    Since the data is supplied from calldata, the batch poster can choose the data type
    ///         We need to ensure that this data cannot cause a collision with data supplied via another method (eg blobs)
    ///         therefore we restrict which flags can be provided as a header in this field
    ///         This also safe guards unused flags for future use, as we know they would have been disallowed up until this point
    /// @param  headerByte The first byte in the calldata
    function isValidCallDataFlag(
        bytes1 headerByte
    ) internal pure returns (bool) {
        return headerByte == BROTLI_MESSAGE_HEADER_FLAG || headerByte == DAS_MESSAGE_HEADER_FLAG
            || (headerByte == (DAS_MESSAGE_HEADER_FLAG | TREE_DAS_MESSAGE_HEADER_FLAG))
            || headerByte == ZERO_HEAVY_MESSAGE_HEADER_FLAG;
    }

    /// @dev    Form a hash of the data taken from the calldata
    /// @param  data The calldata to be hashed
    /// @param  afterDelayedMessagesRead The delayed messages count read up to
    /// @return The data hash
    /// @return The timebounds within which the message should be processed
    function formCallDataHash(
        bytes calldata data,
        uint256 afterDelayedMessagesRead
    ) internal view returns (bytes32, IBridge.TimeBounds memory) {
        uint256 fullDataLen = HEADER_LENGTH + data.length;
        if (fullDataLen > maxDataSize) revert DataTooLarge(fullDataLen, maxDataSize);

        (bytes memory header, IBridge.TimeBounds memory timeBounds) =
            packHeader(afterDelayedMessagesRead);

        // the batch poster is allowed to submit an empty batch, they can use this to progress the
        // delayed inbox without providing extra batch data
        if (data.length > 0) {
            // The first data byte cannot be the same as any that have been set via other methods (eg 4844 blob header) as this
            // would allow the supplier of the data to spoof an incorrect 4844 data batch
            if (!isValidCallDataFlag(data[0])) revert InvalidHeaderFlag(data[0]);

            // the first byte is used to identify the type of batch data
            // das batches expect to have the type byte set, followed by the keyset (so they should have at least 33 bytes)
            // if invalid data is supplied here the state transition function will process it as an empty block
            // however we can provide a nice additional check here for the batch poster
            if (data[0] & DAS_MESSAGE_HEADER_FLAG != 0 && data.length >= 33) {
                // we skip the first byte, then read the next 32 bytes for the keyset
                bytes32 dasKeysetHash = bytes32(data[1:33]);
                if (!dasKeySetInfo[dasKeysetHash].isValidKeyset) revert NoSuchKeyset(dasKeysetHash);
            }
        }
        return (keccak256(bytes.concat(header, data)), timeBounds);
    }

    /// @dev    Form a hash of the data being provided in 4844 data blobs
    /// @param  afterDelayedMessagesRead The delayed messages count read up to
    /// @return The data hash
    /// @return The timebounds within which the message should be processed
    /// @return The normalized amount of gas used for blob posting
    function formBlobDataHash(
        uint256 afterDelayedMessagesRead
    ) internal view virtual returns (bytes32, IBridge.TimeBounds memory, uint256) {
        bytes32[] memory dataHashes = reader4844.getDataHashes();
        if (dataHashes.length == 0) revert MissingDataHashes();

        (bytes memory header, IBridge.TimeBounds memory timeBounds) =
            packHeader(afterDelayedMessagesRead);

        uint256 blobCost = reader4844.getBlobBaseFee() * GAS_PER_BLOB * dataHashes.length;
        return (
            keccak256(bytes.concat(header, DATA_BLOB_HEADER_FLAG, abi.encodePacked(dataHashes))),
            timeBounds,
            block.basefee > 0 ? blobCost / block.basefee : 0
        );
    }

    /// @dev   Submit a batch spending report message so that the batch poster can be reimbursed on the rollup
    ///        This function expect msg.sender is tx.origin, and will always record tx.origin as the spender
    /// @param dataHash The hash of the message the spending report is being submitted for
    /// @param seqMessageIndex The index of the message to submit the spending report for
    /// @param gasPrice The gas price that was paid for the data (standard gas or data gas)
    function submitBatchSpendingReport(
        bytes32 dataHash,
        uint256 seqMessageIndex,
        uint256 gasPrice,
        uint256 extraGas
    ) internal {
        // report the account who paid the gas (tx.origin) for the tx as batch poster
        // if msg.sender is used and is a contract, it might not be able to spend the refund on l2
        // solhint-disable-next-line avoid-tx-origin
        address batchPoster = tx.origin;

        // this msg isn't included in the current sequencer batch, but instead added to
        // the delayed messages queue that is yet to be included
        if (hostChainIsArbitrum) {
            // Include extra gas for the host chain's L1 gas charging
            uint256 l1Fees = ArbGasInfo(address(0x6c)).getCurrentTxL1GasFees();
            extraGas += l1Fees / block.basefee;
        }
        if (extraGas > type(uint64).max) revert ExtraGasNotUint64();
        bytes memory spendingReportMsg = abi.encodePacked(
            block.timestamp, batchPoster, dataHash, seqMessageIndex, gasPrice, uint64(extraGas)
        );

        uint256 msgNum = bridge.submitBatchSpendingReport(batchPoster, keccak256(spendingReportMsg));
        // this is the same event used by Inbox.sol after including a message to the delayed message accumulator
        emit InboxMessageDelivered(msgNum, spendingReportMsg);
    }

    function addSequencerL2BatchImpl(
        bytes32 dataHash,
        uint256 afterDelayedMessagesRead,
        uint256 calldataLengthPosted,
        uint256 prevMessageCount,
        uint256 newMessageCount
    )
        internal
        returns (uint256 seqMessageIndex, bytes32 beforeAcc, bytes32 delayedAcc, bytes32 acc)
    {
        if (afterDelayedMessagesRead < totalDelayedMessagesRead) revert DelayedBackwards();
        if (afterDelayedMessagesRead > bridge.delayedMessageCount()) revert DelayedTooFar();

        (seqMessageIndex, beforeAcc, delayedAcc, acc) = bridge.enqueueSequencerMessage(
            dataHash, afterDelayedMessagesRead, prevMessageCount, newMessageCount
        );

        totalDelayedMessagesRead = afterDelayedMessagesRead;

        if (calldataLengthPosted > 0 && !isUsingFeeToken) {
            // only report batch poster spendings if chain is using ETH as native currency
            submitBatchSpendingReport(dataHash, seqMessageIndex, block.basefee, 0);
        }
    }

    function inboxAccs(
        uint256 index
    ) external view returns (bytes32) {
        return bridge.sequencerInboxAccs(index);
    }

    function batchCount() external view returns (uint256) {
        return bridge.sequencerMessageCount();
    }

    /// @inheritdoc ISequencerInbox
    function forceInclusionDeadline(
        uint64 blockNumber
    ) external view returns (uint64) {
        uint64 _delayBlocks = delayBlocks;
        if (isDelayBufferable) {
            uint64 _buffer = buffer.calcPendingBuffer(blockNumber);
            _delayBlocks = delayBufferableBlocks(_buffer);
        }
        return blockNumber + _delayBlocks;
    }

    /// @notice Calculates the buffer dependent delay blocks
    function delayBufferableBlocks(
        uint64 _buffer
    ) internal view returns (uint64) {
        return _buffer < delayBlocks ? _buffer : delayBlocks;
    }

    function _setBufferConfig(
        BufferConfig memory bufferConfig_
    ) internal {
        if (!isDelayBufferable) revert NotDelayBufferable();
        if (!DelayBuffer.isValidBufferConfig(bufferConfig_)) revert BadBufferConfig();

        if (buffer.bufferBlocks == 0 || buffer.bufferBlocks > bufferConfig_.max) {
            buffer.bufferBlocks = bufferConfig_.max;
        }
        if (buffer.bufferBlocks < bufferConfig_.threshold) {
            buffer.bufferBlocks = bufferConfig_.threshold;
        }
        buffer.max = bufferConfig_.max;
        buffer.threshold = bufferConfig_.threshold;
        buffer.replenishRateInBasis = bufferConfig_.replenishRateInBasis;

        // if all delayed messages are read, the buffer is considered synced
        if (bridge.delayedMessageCount() == totalDelayedMessagesRead) {
            buffer.update(uint64(block.number));
        }
    }

    function _setMaxTimeVariation(
        ISequencerInbox.MaxTimeVariation memory maxTimeVariation_
    ) internal {
        if (
            maxTimeVariation_.delayBlocks > type(uint64).max
                || maxTimeVariation_.futureBlocks > type(uint64).max
                || maxTimeVariation_.delaySeconds > type(uint64).max
                || maxTimeVariation_.futureSeconds > type(uint64).max
        ) {
            revert BadMaxTimeVariation();
        }
        delayBlocks = uint64(maxTimeVariation_.delayBlocks);
        futureBlocks = uint64(maxTimeVariation_.futureBlocks);
        delaySeconds = uint64(maxTimeVariation_.delaySeconds);
        futureSeconds = uint64(maxTimeVariation_.futureSeconds);
    }

    /// @inheritdoc ISequencerInbox
    function setMaxTimeVariation(
        ISequencerInbox.MaxTimeVariation memory maxTimeVariation_
    ) external onlyRollupOwner {
        _setMaxTimeVariation(maxTimeVariation_);
        emit MaxTimeVariationSet(maxTimeVariation_);
        emit OwnerFunctionCalled(0);
    }

    /// @inheritdoc ISequencerInbox
    function setIsBatchPoster(
        address addr,
        bool isBatchPoster_
    ) external onlyRollupOwnerOrBatchPosterManager {
        isBatchPoster[addr] = isBatchPoster_;
        emit BatchPosterSet(addr, isBatchPoster_);
        emit OwnerFunctionCalled(1);
    }

    /// @inheritdoc ISequencerInbox
    function setValidKeyset(
        bytes calldata keysetBytes
    ) external onlyRollupOwner {
        uint256 ksWord = uint256(keccak256(bytes.concat(hex"fe", keccak256(keysetBytes))));
        bytes32 ksHash = bytes32(ksWord ^ (1 << 255));
        if (keysetBytes.length >= 64 * 1024) revert KeysetTooLarge();

        if (dasKeySetInfo[ksHash].isValidKeyset) revert AlreadyValidDASKeyset(ksHash);
        uint256 creationBlock = block.number;
        if (hostChainIsArbitrum) {
            creationBlock = ArbSys(address(100)).arbBlockNumber();
        }
        dasKeySetInfo[ksHash] =
            DasKeySetInfo({isValidKeyset: true, creationBlock: uint64(creationBlock)});
        emit SetValidKeyset(ksHash, keysetBytes);
        emit OwnerFunctionCalled(2);
    }

    /// @inheritdoc ISequencerInbox
    function invalidateKeysetHash(
        bytes32 ksHash
    ) external onlyRollupOwner {
        if (!dasKeySetInfo[ksHash].isValidKeyset) revert NoSuchKeyset(ksHash);
        // we don't delete the block creation value since its used to fetch the SetValidKeyset
        // event efficiently. The event provides the hash preimage of the key.
        // this is still needed when syncing the chain after a keyset is invalidated.
        dasKeySetInfo[ksHash].isValidKeyset = false;
        emit InvalidateKeyset(ksHash);
        emit OwnerFunctionCalled(3);
    }

    /// @inheritdoc ISequencerInbox
    function setIsSequencer(
        address addr,
        bool isSequencer_
    ) external onlyRollupOwnerOrBatchPosterManager {
        isSequencer[addr] = isSequencer_;
        emit SequencerSet(addr, isSequencer_);
        emit OwnerFunctionCalled(4);
    }

    /// @inheritdoc ISequencerInbox
    function setBatchPosterManager(
        address newBatchPosterManager
    ) external onlyRollupOwner {
        batchPosterManager = newBatchPosterManager;
        emit BatchPosterManagerSet(newBatchPosterManager);
        emit OwnerFunctionCalled(5);
    }

    function setBufferConfig(
        BufferConfig memory bufferConfig_
    ) external onlyRollupOwner {
        _setBufferConfig(bufferConfig_);
        emit BufferConfigSet(bufferConfig_);
    }

    function isValidKeysetHash(
        bytes32 ksHash
    ) external view returns (bool) {
        return dasKeySetInfo[ksHash].isValidKeyset;
    }

    /// @inheritdoc ISequencerInbox
    function getKeysetCreationBlock(
        bytes32 ksHash
    ) external view returns (uint256) {
        DasKeySetInfo memory ksInfo = dasKeySetInfo[ksHash];
        if (ksInfo.creationBlock == 0) revert NoSuchKeyset(ksHash);
        return uint256(ksInfo.creationBlock);
    }
}