// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library OnchainDataFactTreeEncoder {
    struct DataAvailabilityFact {
        uint256 onchainDataHash;
        uint256 onchainDataSize;
    }

    // The number of additional words appended to the public input when using the
    // OnchainDataFactTreeEncoder format.
    uint256 internal constant ONCHAIN_DATA_FACT_ADDITIONAL_WORDS = 2;

    /*
      Encodes a GPS fact Merkle tree where the root has two children.
      The left child contains the data we care about and the right child contains
      on-chain data for the fact.
    */
    function encodeFactWithOnchainData(
        uint256[] calldata programOutput,
        DataAvailabilityFact memory factData
    ) internal pure returns (bytes32) {
        // The state transition fact is computed as a Merkle tree, as defined in
        // GpsOutputParser.
        //
        // In our case the fact tree looks as follows:
        //   The root has two children.
        //   The left child is a leaf that includes the main part - the information regarding
        //   the state transition required by this contract.
        //   The right child contains the onchain-data which shouldn't be accessed by this
        //   contract, so we are only given its hash and length
        //   (it may be a leaf or an inner node, this has no effect on this contract).

        // Compute the hash without the two additional fields.
        uint256 mainPublicInputLen = programOutput.length;
        bytes32 mainPublicInputHash = hashMainPublicInput(programOutput);

        // Compute the hash of the fact Merkle tree.
        bytes32 hashResult = keccak256(
            abi.encodePacked(
                mainPublicInputHash,
                mainPublicInputLen,
                factData.onchainDataHash,
                mainPublicInputLen + factData.onchainDataSize
            )
        );
        // Add one to the hash to indicate it represents an inner node, rather than a leaf.
        return bytes32(uint256(hashResult) + 1);
    }

    /*
      Hashes the main public input.
    */
    function hashMainPublicInput(uint256[] calldata programOutput) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(programOutput));
    }
}

library StarknetOutput {
    uint256 internal constant MERKLE_UPDATE_OFFSET = 0;
    uint256 internal constant PREV_BLOCK_NUMBER_OFFSET = 2;
    uint256 internal constant NEW_BLOCK_NUMBER_OFFSET = 3;
    uint256 internal constant PREV_BLOCK_HASH_OFFSET = 4;
    uint256 internal constant NEW_BLOCK_HASH_OFFSET = 5;
    uint256 internal constant OS_PROGRAM_HASH_OFFSET = 6;
    uint256 internal constant CONFIG_HASH_OFFSET = 7;
    uint256 internal constant USE_KZG_DA_OFFSET = 8;
    uint256 internal constant FULL_OUTPUT_OFFSET = 9;
    uint256 internal constant HEADER_SIZE = 10;

    uint256 internal constant KZG_Z_OFFSET = 0;
    uint256 internal constant KZG_N_BLOBS_OFFSET = 1;
    uint256 internal constant KZG_COMMITMENTS_OFFSET = 2;

    uint256 constant MESSAGE_TO_L1_FROM_ADDRESS_OFFSET = 0;
    uint256 constant MESSAGE_TO_L1_TO_ADDRESS_OFFSET = 1;
    uint256 constant MESSAGE_TO_L1_PAYLOAD_SIZE_OFFSET = 2;
    uint256 constant MESSAGE_TO_L1_PREFIX_SIZE = 3;

    uint256 constant MESSAGE_TO_L2_FROM_ADDRESS_OFFSET = 0;
    uint256 constant MESSAGE_TO_L2_TO_ADDRESS_OFFSET = 1;
    uint256 constant MESSAGE_TO_L2_NONCE_OFFSET = 2;
    uint256 constant MESSAGE_TO_L2_SELECTOR_OFFSET = 3;
    uint256 constant MESSAGE_TO_L2_PAYLOAD_SIZE_OFFSET = 4;
    uint256 constant MESSAGE_TO_L2_PREFIX_SIZE = 5;

    /**
      Returns the offset of the messages segment in the output_data.
    */
    function messageSegmentOffset(uint256[] calldata programOutput)
        internal
        pure
        returns (uint256)
    {
        if (programOutput[USE_KZG_DA_OFFSET] == 0) {
            // No KZG info; messages are right after the header.
            return HEADER_SIZE;
        }

        uint256 nBlobs = programOutput[HEADER_SIZE + KZG_N_BLOBS_OFFSET];
        return
            HEADER_SIZE +
            // Point z.
            1 +
            // Number of blobs.
            1 +
            // KZG commitments.
            (2 * nBlobs) +
            // Point evaluations.
            (2 * nBlobs);
    }

    /**
      Returns a slice of the 'output_data' with the commitment tree update information.
    */
    function getMerkleUpdate(uint256[] calldata output_data)
        internal
        pure
        returns (uint256[] calldata)
    {
        return output_data[MERKLE_UPDATE_OFFSET:MERKLE_UPDATE_OFFSET + 2];
    }

    /**
      Processes a message segment from the program output.
      The format of a message segment is the length of the messages in words followed
      by the concatenation of all the messages.

      The 'messages' mapping is updated according to the messages and the direction ('isL2ToL1').
    */
    function processMessages(
        bool isL2ToL1,
        uint256[] calldata programOutputSlice,
        mapping(bytes32 => uint256) storage messages
    ) internal returns (uint256) {
        uint256 messageSegmentSize = programOutputSlice[0];
        require(messageSegmentSize < 2**30, "INVALID_MESSAGE_SEGMENT_SIZE");

        uint256 offset = 1;
        uint256 messageSegmentEnd = offset + messageSegmentSize;

        uint256 payloadSizeOffset = (
            isL2ToL1 ? MESSAGE_TO_L1_PAYLOAD_SIZE_OFFSET : MESSAGE_TO_L2_PAYLOAD_SIZE_OFFSET
        );

        uint256 totalMsgFees = 0;
        while (offset < messageSegmentEnd) {
            uint256 payloadLengthOffset = offset + payloadSizeOffset;
            require(payloadLengthOffset < programOutputSlice.length, "MESSAGE_TOO_SHORT");

            uint256 payloadLength = programOutputSlice[payloadLengthOffset];
            require(payloadLength < 2**30, "INVALID_PAYLOAD_LENGTH");

            uint256 endOffset = payloadLengthOffset + 1 + payloadLength;
            require(endOffset <= programOutputSlice.length, "TRUNCATED_MESSAGE_PAYLOAD");

            if (isL2ToL1) {
                bytes32 messageHash = keccak256(
                    abi.encodePacked(programOutputSlice[offset:endOffset])
                );

                emit IStarknetMessagingEvents.LogMessageToL1(
                    // from=
                    programOutputSlice[offset + MESSAGE_TO_L1_FROM_ADDRESS_OFFSET],
                    // to=
                    address(uint160(programOutputSlice[offset + MESSAGE_TO_L1_TO_ADDRESS_OFFSET])),
                    // payload=
                    (uint256[])(programOutputSlice[offset + MESSAGE_TO_L1_PREFIX_SIZE:endOffset])
                );
                messages[messageHash] += 1;
            } else {
                {
                    bytes32 messageHash = keccak256(
                        abi.encodePacked(programOutputSlice[offset:endOffset])
                    );

                    uint256 msgFeePlusOne = messages[messageHash];
                    require(msgFeePlusOne > 0, "INVALID_MESSAGE_TO_CONSUME");
                    totalMsgFees += msgFeePlusOne - 1;
                    messages[messageHash] = 0;
                }

                uint256 nonce = programOutputSlice[offset + MESSAGE_TO_L2_NONCE_OFFSET];
                uint256[] memory messageSlice = (uint256[])(
                    programOutputSlice[offset + MESSAGE_TO_L2_PREFIX_SIZE:endOffset]
                );
                emit IStarknetMessagingEvents.ConsumedMessageToL2(
                    // from=
                    address(
                        uint160(programOutputSlice[offset + MESSAGE_TO_L2_FROM_ADDRESS_OFFSET])
                    ),
                    // to=
                    programOutputSlice[offset + MESSAGE_TO_L2_TO_ADDRESS_OFFSET],
                    // selector=
                    programOutputSlice[offset + MESSAGE_TO_L2_SELECTOR_OFFSET],
                    // payload=
                    messageSlice,
                    // nonce =
                    nonce
                );
            }

            offset = endOffset;
        }
        require(offset == messageSegmentEnd, "INVALID_MESSAGE_SEGMENT_SIZE");

        if (totalMsgFees > 0) {
            // NOLINTNEXTLINE: low-level-calls.
            (bool success, ) = msg.sender.call{value: totalMsgFees}("");
            require(success, "ETH_TRANSFER_FAILED");
        }

        return offset;
    }
}

library CommitmentTreeUpdateOutput {
    /**
      Returns the previous commitment tree root.
    */
    function getPrevRoot(uint256[] calldata commitmentTreeUpdateData)
        internal
        pure
        returns (uint256)
    {
        return commitmentTreeUpdateData[0];
    }

    /**
      Returns the new commitment tree root.
    */
    function getNewRoot(uint256[] calldata commitmentTreeUpdateData)
        internal
        pure
        returns (uint256)
    {
        return commitmentTreeUpdateData[1];
    }
}

library StarknetState {
    struct State {
        uint256 globalRoot;
        int256 blockNumber;
        uint256 blockHash;
    }

    function copy(State storage state, State memory stateFrom) internal {
        state.globalRoot = stateFrom.globalRoot;
        state.blockNumber = stateFrom.blockNumber;
        state.blockHash = stateFrom.blockHash;
    }

    /**
      Validates that the previous block number that appears in the proof is the current block
      number.

      To protect against re-entrancy attacks, we read the block number at the beginning
      and validate that we have the expected block number at the end.
      This function must be called at the beginning of the updateState transaction.
    */
    function checkPrevBlockNumber(State storage state, uint256[] calldata starknetOutput) internal {
        uint256 expectedPrevBlockNumber;
        if (state.blockNumber == -1) {
            expectedPrevBlockNumber = 0x800000000000011000000000000000000000000000000000000000000000000;
        } else {
            expectedPrevBlockNumber = uint256(state.blockNumber);
        }
        require(
            starknetOutput[StarknetOutput.PREV_BLOCK_NUMBER_OFFSET] == expectedPrevBlockNumber,
            "INVALID_PREV_BLOCK_NUMBER"
        );
    }

    /**
      Validates that the current block number is the new block number.
      This is used to protect against re-entrancy attacks.
    */
    function checkNewBlockNumber(State storage state, uint256[] calldata starknetOutput) internal {
        require(
            uint256(state.blockNumber) == starknetOutput[StarknetOutput.NEW_BLOCK_NUMBER_OFFSET],
            "REENTRANCY_FAILURE"
        );
    }

    /**
      Validates that the 'blockNumber' and the previous root are consistent with the
      current state and updates the state.
    */
    function update(State storage state, uint256[] calldata starknetOutput) internal {
        checkPrevBlockNumber(state, starknetOutput);

        // Check the blockNumber first as the error is less ambiguous then INVALID_PREVIOUS_ROOT.
        int256 newBlockNumber = int256(starknetOutput[StarknetOutput.NEW_BLOCK_NUMBER_OFFSET]);
        require(newBlockNumber > state.blockNumber, "INVALID_NEW_BLOCK_NUMBER");
        state.blockNumber = newBlockNumber;

        require(
            starknetOutput[StarknetOutput.PREV_BLOCK_HASH_OFFSET] == state.blockHash,
            "INVALID_PREV_BLOCK_HASH"
        );
        state.blockHash = starknetOutput[StarknetOutput.NEW_BLOCK_HASH_OFFSET];

        uint256[] calldata commitment_tree_update = StarknetOutput.getMerkleUpdate(starknetOutput);
        require(
            state.globalRoot == CommitmentTreeUpdateOutput.getPrevRoot(commitment_tree_update),
            "INVALID_PREVIOUS_ROOT"
        );
        state.globalRoot = CommitmentTreeUpdateOutput.getNewRoot(commitment_tree_update);
    }
}

abstract contract BlockDirectCall {
    address immutable this_;

    constructor() internal {
        this_ = address(this);
    }

    modifier notCalledDirectly() {
        require(this_ != address(this), "DIRECT_CALL_DISALLOWED");
        _;
    }
}

library Addresses {
    /*
      Note: isContract function has some known limitation.
      See https://github.com/OpenZeppelin/
      openzeppelin-contracts/blob/master/contracts/utils/Address.sol.
    */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function performEthTransfer(address recipient, uint256 amount) internal {
        if (amount == 0) return;
        (bool success, ) = recipient.call{value: amount}(""); // NOLINT: low-level-calls.
        require(success, "ETH_TRANSFER_FAILED");
    }

    /*
      Safe wrapper around ERC20/ERC721 calls.
      This is required because many deployed ERC20 contracts don't return a value.
      See https://github.com/ethereum/solidity/issues/4116.
    */
    function safeTokenContractCall(address tokenAddress, bytes memory callData) internal {
        require(isContract(tokenAddress), "BAD_TOKEN_ADDRESS");
        // NOLINTNEXTLINE: low-level-calls.
        (bool success, bytes memory returndata) = tokenAddress.call(callData);
        require(success, string(returndata));

        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "TOKEN_OPERATION_FAILED");
        }
    }
}

abstract contract ProxySupport is Governance, BlockDirectCall, ContractInitializer {
    using Addresses for address;

    // The two function below (isFrozen & initialize) needed to bind to the Proxy.
    function isFrozen() external view virtual returns (bool) {
        return false;
    }

    /*
      The initialize() function serves as an alternative constructor for a proxied deployment.

      Flow and notes:
      1. This function cannot be called directly on the deployed contract, but only via
         delegate call.
      2. If an EIC is provided - init is passed onto EIC and the standard init flow is skipped.
         This true for both first intialization or a later one.
      3. The data passed to this function is as follows:
         [sub_contracts addresses, eic address, initData].

         When calling on an initialized contract (no EIC scenario), initData.length must be 0.
    */
    function initialize(bytes calldata data) external notCalledDirectly {
        uint256 eicOffset = 32 * numOfSubContracts();
        uint256 expectedBaseSize = eicOffset + 32;
        require(data.length >= expectedBaseSize, "INIT_DATA_TOO_SMALL");
        address eicAddress = abi.decode(data[eicOffset:expectedBaseSize], (address));

        bytes calldata subContractAddresses = data[:eicOffset];

        processSubContractAddresses(subContractAddresses);

        bytes calldata initData = data[expectedBaseSize:];

        // EIC Provided - Pass initData to EIC and the skip standard init flow.
        if (eicAddress != address(0x0)) {
            callExternalInitializer(eicAddress, initData);
            return;
        }

        if (isInitialized()) {
            require(initData.length == 0, "UNEXPECTED_INIT_DATA");
        } else {
            // Contract was not initialized yet.
            validateInitData(initData);
            initializeContractState(initData);
            initGovernance();
        }
    }

    function callExternalInitializer(address externalInitializerAddr, bytes calldata eicData)
        private
    {
        require(externalInitializerAddr.isContract(), "EIC_NOT_A_CONTRACT");

        // NOLINTNEXTLINE: low-level-calls, controlled-delegatecall.
        (bool success, bytes memory returndata) = externalInitializerAddr.delegatecall(
            abi.encodeWithSelector(this.initialize.selector, eicData)
        );
        require(success, string(returndata));
        require(returndata.length == 0, string(returndata));
    }
}

abstract contract ContractInitializer {
    /*
      The number of sub-contracts that the proxied contract consists of.
    */
    function numOfSubContracts() internal pure virtual returns (uint256);

    /*
      Indicates if the proxied contract has already been initialized.
      Used to prevent re-init.
    */
    function isInitialized() internal view virtual returns (bool);

    /*
      Validates the init data that is passed into the proxied contract.
    */
    function validateInitData(bytes calldata data) internal view virtual;

    /*
      For a proxied contract that consists of sub-contracts, this function processes
      the sub-contract addresses, e.g. validates them, stores them etc.
    */
    function processSubContractAddresses(bytes calldata subContractAddresses) internal virtual;

    /*
      This function applies the logic of initializing the proxied contract state,
      e.g. setting root values etc.
    */
    function initializeContractState(bytes calldata data) internal virtual;
}

abstract contract MOperator {
    event LogOperatorAdded(address operator);
    event LogOperatorRemoved(address operator);

    function isOperator(address user) public view virtual returns (bool);

    modifier onlyOperator() {
        require(isOperator(msg.sender), "ONLY_OPERATOR");
        _;
    }

    function registerOperator(address newOperator) external virtual;

    function unregisterOperator(address removedOperator) external virtual;

    function getOperators() internal view virtual returns (mapping(address => bool) storage);
}

abstract contract Operator is MGovernance, MOperator {
    function registerOperator(address newOperator) external override onlyGovernance {
        if (!isOperator(newOperator)) {
            getOperators()[newOperator] = true;
            emit LogOperatorAdded(newOperator);
        }
    }

    function unregisterOperator(address removedOperator) external override onlyGovernance {
        if (isOperator(removedOperator)) {
            getOperators()[removedOperator] = false;
            emit LogOperatorRemoved(removedOperator);
        }
    }

    function isOperator(address user) public view override returns (bool) {
        return getOperators()[user];
    }
}

abstract contract StarknetOperator is Operator {
    string constant OPERATORS_MAPPING_TAG = "STARKNET_1.0_ROLES_OPERATORS_MAPPING_TAG";

    function getOperators() internal view override returns (mapping(address => bool) storage) {
        return NamedStorage.addressToBoolMapping(OPERATORS_MAPPING_TAG);
    }
}

abstract contract GovernedFinalizable is MGovernance {
    event Finalized();

    string constant STORAGE_TAG = "STARKWARE_CONTRACTS_GOVERENED_FINALIZABLE_1.0_TAG";

    function isFinalized() public view returns (bool) {
        return NamedStorage.getBoolValue(STORAGE_TAG);
    }

    modifier notFinalized() {
        require(!isFinalized(), "FINALIZED");
        _;
    }

    function finalize() external onlyGovernance notFinalized {
        NamedStorage.setBoolValue(STORAGE_TAG, true);
        emit Finalized();
    }
}

abstract contract MGovernance {
    function _isGovernor(address user) internal view virtual returns (bool);

    /*
      Allows calling the function only by a Governor.
    */
    modifier onlyGovernance() {
        require(_isGovernor(msg.sender), "ONLY_GOVERNANCE");
        _;
    }
}

abstract contract Governance is MGovernance {
    event LogNominatedGovernor(address nominatedGovernor);
    event LogNewGovernorAccepted(address acceptedGovernor);
    event LogRemovedGovernor(address removedGovernor);
    event LogNominationCancelled();

    function getGovernanceInfo() internal view virtual returns (GovernanceInfoStruct storage);

    /*
      Current code intentionally prevents governance re-initialization.
      This may be a problem in an upgrade situation, in a case that the upgrade-to implementation
      performs an initialization (for real) and within that calls initGovernance().

      Possible workarounds:
      1. Clearing the governance info altogether by changing the MAIN_GOVERNANCE_INFO_TAG.
         This will remove existing main governance information.
      2. Modify the require part in this function, so that it will exit quietly
         when trying to re-initialize (uncomment the lines below).
    */
    function initGovernance() internal {
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        require(!gub.initialized, "ALREADY_INITIALIZED");
        gub.initialized = true; // to ensure acceptNewGovernor() won't fail.
        // Add the initial governer.
        acceptNewGovernor(msg.sender);
    }

    function _isGovernor(address user) internal view override returns (bool) {
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        return gub.effectiveGovernors[user];
    }

    /*
      Cancels the nomination of a governor candidate.
    */
    function _cancelNomination() internal onlyGovernance {
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        if (gub.candidateGovernor != address(0x0)) {
            gub.candidateGovernor = address(0x0);
            emit LogNominationCancelled();
        }
    }

    function _nominateNewGovernor(address newGovernor) internal onlyGovernance {
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        require(newGovernor != address(0x0), "BAD_ADDRESS");
        require(!_isGovernor(newGovernor), "ALREADY_GOVERNOR");
        require(gub.candidateGovernor == address(0x0), "OTHER_CANDIDATE_PENDING");
        gub.candidateGovernor = newGovernor;
        emit LogNominatedGovernor(newGovernor);
    }

    /*
      The acceptNewGovernor is called in two cases:
      1. by _acceptGovernance when a new governor accepts its role.
      2. by initGovernance to add the initial governor.
      The difference is that the init path skips the nominate step
      that would fail because of the onlyGovernance modifier.
    */
    function acceptNewGovernor(address newGovernor) private {
        require(!_isGovernor(newGovernor), "ALREADY_GOVERNOR");
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        gub.effectiveGovernors[newGovernor] = true;

        // Emit governance information.
        emit LogNewGovernorAccepted(newGovernor);
    }

    function _acceptGovernance() internal {
        // The new governor was proposed as a candidate by the current governor.
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        require(msg.sender == gub.candidateGovernor, "ONLY_CANDIDATE_GOVERNOR");

        // Update state.
        acceptNewGovernor(msg.sender);
        gub.candidateGovernor = address(0x0);
    }

    /*
      Remove a governor from office.
    */
    function _removeGovernor(address governorForRemoval) internal onlyGovernance {
        require(msg.sender != governorForRemoval, "GOVERNOR_SELF_REMOVE");
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        require(_isGovernor(governorForRemoval), "NOT_GOVERNOR");
        gub.effectiveGovernors[governorForRemoval] = false;
        emit LogRemovedGovernor(governorForRemoval);
    }
}

struct GovernanceInfoStruct {
    mapping(address => bool) effectiveGovernors;
    address candidateGovernor;
    bool initialized;
}

contract StarknetGovernance is Governance {
    string constant STARKNET_GOVERNANCE_INFO_TAG = "STARKNET_1.0_GOVERNANCE_INFO";

    /*
      Returns the GovernanceInfoStruct associated with the governance tag.
    */
    function getGovernanceInfo() internal view override returns (GovernanceInfoStruct storage gub) {
        bytes32 location = keccak256(abi.encodePacked(STARKNET_GOVERNANCE_INFO_TAG));
        assembly {
            gub.slot := location
        }
    }

    function starknetIsGovernor(address user) external view returns (bool) {
        return _isGovernor(user);
    }

    function starknetNominateNewGovernor(address newGovernor) external {
        _nominateNewGovernor(newGovernor);
    }

    function starknetRemoveGovernor(address governorForRemoval) external {
        _removeGovernor(governorForRemoval);
    }

    function starknetAcceptGovernance() external {
        _acceptGovernance();
    }

    function starknetCancelNomination() external {
        _cancelNomination();
    }
}

interface IStarknetMessagingEvents {
    // This event needs to be compatible with the one defined in Output.sol.
    event LogMessageToL1(uint256 indexed fromAddress, address indexed toAddress, uint256[] payload);

    // An event that is raised when a message is sent from L1 to L2.
    event LogMessageToL2(
        address indexed fromAddress,
        uint256 indexed toAddress,
        uint256 indexed selector,
        uint256[] payload,
        uint256 nonce,
        uint256 fee
    );

    // An event that is raised when a message from L2 to L1 is consumed.
    event ConsumedMessageToL1(
        uint256 indexed fromAddress,
        address indexed toAddress,
        uint256[] payload
    );

    // An event that is raised when a message from L1 to L2 is consumed.
    event ConsumedMessageToL2(
        address indexed fromAddress,
        uint256 indexed toAddress,
        uint256 indexed selector,
        uint256[] payload,
        uint256 nonce
    );

    // An event that is raised when a message from L1 to L2 Cancellation is started.
    event MessageToL2CancellationStarted(
        address indexed fromAddress,
        uint256 indexed toAddress,
        uint256 indexed selector,
        uint256[] payload,
        uint256 nonce
    );

    // An event that is raised when a message from L1 to L2 is canceled.
    event MessageToL2Canceled(
        address indexed fromAddress,
        uint256 indexed toAddress,
        uint256 indexed selector,
        uint256[] payload,
        uint256 nonce
    );
}

interface IStarknetMessaging is IStarknetMessagingEvents {
    /**
      Returns the max fee (in Wei) that StarkNet will accept per single message.
    */
    function getMaxL1MsgFee() external pure returns (uint256);

    /**
      Returns `msg_fee + 1` if there is a pending message associated with the given 'msgHash',
      otherwise, returns 0.
    */
    function l1ToL2Messages(bytes32 msgHash) external view returns (uint256);

    /**
      Sends a message to an L2 contract.
      This function is payable, the payed amount is the message fee.

      Returns the hash of the message and the nonce of the message.
    */
    function sendMessageToL2(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload
    ) external payable returns (bytes32, uint256);

    /**
      Consumes a message that was sent from an L2 contract.

      Returns the hash of the message.
    */
    function consumeMessageFromL2(uint256 fromAddress, uint256[] calldata payload)
        external
        returns (bytes32);

    /**
      Starts the cancellation of an L1 to L2 message.
      A message can be canceled messageCancellationDelay() seconds after this function is called.

      Note: This function may only be called for a message that is currently pending and the caller
      must be the sender of the that message.
    */
    function startL1ToL2MessageCancellation(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload,
        uint256 nonce
    ) external returns (bytes32);

    /**
      Cancels an L1 to L2 message, this function should be called at least
      messageCancellationDelay() seconds after the call to startL1ToL2MessageCancellation().
      A message may only be cancelled by its sender.
      If the message is missing, the call will revert.

      Note that the message fee is not refunded.
    */
    function cancelL1ToL2Message(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload,
        uint256 nonce
    ) external returns (bytes32);
}

library NamedStorage {
    function bytes32ToUint256Mapping(string memory tag_)
        internal
        pure
        returns (mapping(bytes32 => uint256) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function bytes32ToAddressMapping(string memory tag_)
        internal
        pure
        returns (mapping(bytes32 => address) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function uintToAddressMapping(string memory tag_)
        internal
        pure
        returns (mapping(uint256 => address) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function addressToAddressMapping(string memory tag_)
        internal
        pure
        returns (mapping(address => address) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function addressToBoolMapping(string memory tag_)
        internal
        pure
        returns (mapping(address => bool) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function getUintValue(string memory tag_) internal view returns (uint256 retVal) {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            retVal := sload(slot)
        }
    }

    function setUintValue(string memory tag_, uint256 value) internal {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            sstore(slot, value)
        }
    }

    function setUintValueOnce(string memory tag_, uint256 value) internal {
        require(getUintValue(tag_) == 0, "ALREADY_SET");
        setUintValue(tag_, value);
    }

    function getAddressValue(string memory tag_) internal view returns (address retVal) {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            retVal := sload(slot)
        }
    }

    function setAddressValue(string memory tag_, address value) internal {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            sstore(slot, value)
        }
    }

    function setAddressValueOnce(string memory tag_, address value) internal {
        require(getAddressValue(tag_) == address(0x0), "ALREADY_SET");
        setAddressValue(tag_, value);
    }

    function getBoolValue(string memory tag_) internal view returns (bool retVal) {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            retVal := sload(slot)
        }
    }

    function setBoolValue(string memory tag_, bool value) internal {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            sstore(slot, value)
        }
    }
}

contract StarknetMessaging is IStarknetMessaging {
    /*
      Random slot storage elements and accessors.
    */
    string constant L1L2_MESSAGE_MAP_TAG = "STARKNET_1.0_MSGING_L1TOL2_MAPPPING_V2";
    string constant L2L1_MESSAGE_MAP_TAG = "STARKNET_1.0_MSGING_L2TOL1_MAPPPING";

    string constant L1L2_MESSAGE_NONCE_TAG = "STARKNET_1.0_MSGING_L1TOL2_NONCE";

    string constant L1L2_MESSAGE_CANCELLATION_MAP_TAG = (
        "STARKNET_1.0_MSGING_L1TOL2_CANCELLATION_MAPPPING"
    );

    string constant L1L2_MESSAGE_CANCELLATION_DELAY_TAG = (
        "STARKNET_1.0_MSGING_L1TOL2_CANCELLATION_DELAY"
    );

    uint256 constant MAX_L1_MSG_FEE = 1 ether;

    function getMaxL1MsgFee() public pure override returns (uint256) {
        return MAX_L1_MSG_FEE;
    }

    /**
      Returns the msg_fee + 1 for the message with the given 'msgHash',
      or 0 if no message with such a hash is pending.
    */
    function l1ToL2Messages(bytes32 msgHash) external view override returns (uint256) {
        return l1ToL2Messages()[msgHash];
    }

    function l2ToL1Messages(bytes32 msgHash) external view returns (uint256) {
        return l2ToL1Messages()[msgHash];
    }

    function l1ToL2Messages() internal pure returns (mapping(bytes32 => uint256) storage) {
        return NamedStorage.bytes32ToUint256Mapping(L1L2_MESSAGE_MAP_TAG);
    }

    function l2ToL1Messages() internal pure returns (mapping(bytes32 => uint256) storage) {
        return NamedStorage.bytes32ToUint256Mapping(L2L1_MESSAGE_MAP_TAG);
    }

    function l1ToL2MessageNonce() public view returns (uint256) {
        return NamedStorage.getUintValue(L1L2_MESSAGE_NONCE_TAG);
    }

    function messageCancellationDelay() public view returns (uint256) {
        return NamedStorage.getUintValue(L1L2_MESSAGE_CANCELLATION_DELAY_TAG);
    }

    function messageCancellationDelay(uint256 delayInSeconds) internal {
        NamedStorage.setUintValue(L1L2_MESSAGE_CANCELLATION_DELAY_TAG, delayInSeconds);
    }

    /**
      Returns the timestamp at the time cancelL1ToL2Message was called with a message
      matching 'msgHash'.

      The function returns 0 if cancelL1ToL2Message was never called.
    */
    function l1ToL2MessageCancellations(bytes32 msgHash) external view returns (uint256) {
        return l1ToL2MessageCancellations()[msgHash];
    }

    function l1ToL2MessageCancellations()
        internal
        pure
        returns (mapping(bytes32 => uint256) storage)
    {
        return NamedStorage.bytes32ToUint256Mapping(L1L2_MESSAGE_CANCELLATION_MAP_TAG);
    }

    /**
      Returns the hash of an L1 -> L2 message from msg.sender.
    */
    function getL1ToL2MsgHash(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload,
        uint256 nonce
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    uint256(uint160(msg.sender)),
                    toAddress,
                    nonce,
                    selector,
                    payload.length,
                    payload
                )
            );
    }

    /**
      Sends a message to an L2 contract.
    */
    function sendMessageToL2(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload
    ) external payable override returns (bytes32, uint256) {
        require(msg.value > 0, "L1_MSG_FEE_MUST_BE_GREATER_THAN_0");
        require(msg.value <= getMaxL1MsgFee(), "MAX_L1_MSG_FEE_EXCEEDED");
        uint256 nonce = l1ToL2MessageNonce();
        NamedStorage.setUintValue(L1L2_MESSAGE_NONCE_TAG, nonce + 1);
        emit LogMessageToL2(msg.sender, toAddress, selector, payload, nonce, msg.value);
        bytes32 msgHash = getL1ToL2MsgHash(toAddress, selector, payload, nonce);
        // Note that the inclusion of the unique nonce in the message hash implies that
        // l1ToL2Messages()[msgHash] was not accessed before.
        l1ToL2Messages()[msgHash] = msg.value + 1;
        return (msgHash, nonce);
    }

    /**
      Consumes a message that was sent from an L2 contract.

      Returns the hash of the message.
    */
    function consumeMessageFromL2(uint256 fromAddress, uint256[] calldata payload)
        external
        override
        returns (bytes32)
    {
        bytes32 msgHash = keccak256(
            abi.encodePacked(fromAddress, uint256(uint160(msg.sender)), payload.length, payload)
        );

        require(l2ToL1Messages()[msgHash] > 0, "INVALID_MESSAGE_TO_CONSUME");
        emit ConsumedMessageToL1(fromAddress, msg.sender, payload);
        l2ToL1Messages()[msgHash] -= 1;
        return msgHash;
    }

    function startL1ToL2MessageCancellation(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload,
        uint256 nonce
    ) external override returns (bytes32) {
        emit MessageToL2CancellationStarted(msg.sender, toAddress, selector, payload, nonce);
        bytes32 msgHash = getL1ToL2MsgHash(toAddress, selector, payload, nonce);
        uint256 msgFeePlusOne = l1ToL2Messages()[msgHash];
        require(msgFeePlusOne > 0, "NO_MESSAGE_TO_CANCEL");
        l1ToL2MessageCancellations()[msgHash] = block.timestamp;
        return msgHash;
    }

    function cancelL1ToL2Message(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload,
        uint256 nonce
    ) external override returns (bytes32) {
        emit MessageToL2Canceled(msg.sender, toAddress, selector, payload, nonce);
        // Note that the message hash depends on msg.sender, which prevents one contract from
        // cancelling another contract's message.
        // Trying to do so will result in NO_MESSAGE_TO_CANCEL.
        bytes32 msgHash = getL1ToL2MsgHash(toAddress, selector, payload, nonce);
        uint256 msgFeePlusOne = l1ToL2Messages()[msgHash];
        require(msgFeePlusOne != 0, "NO_MESSAGE_TO_CANCEL");

        uint256 requestTime = l1ToL2MessageCancellations()[msgHash];
        require(requestTime != 0, "MESSAGE_CANCELLATION_NOT_REQUESTED");

        uint256 cancelAllowedTime = requestTime + messageCancellationDelay();
        require(cancelAllowedTime >= requestTime, "CANCEL_ALLOWED_TIME_OVERFLOW");
        require(block.timestamp >= cancelAllowedTime, "MESSAGE_CANCELLATION_NOT_ALLOWED_YET");

        l1ToL2Messages()[msgHash] = 0;
        return (msgHash);
    }
}

interface Identity {
    /*
      Allows a caller to ensure that the provided address is of the expected type and version.
    */
    function identify() external pure returns (string memory);
}

contract Starknet is
    Identity,
    StarknetMessaging,
    StarknetGovernance,
    GovernedFinalizable,
    StarknetOperator,
    ContractInitializer,
    ProxySupport
{
    using StarknetState for StarknetState.State;

    // Indicates a change of the Starknet config hash.
    event ConfigHashChanged(
        address indexed changedBy,
        uint256 oldConfigHash,
        uint256 newConfigHash
    );

    // Logs the new state following a state update.
    event LogStateUpdate(uint256 globalRoot, int256 blockNumber, uint256 blockHash);

    // Logs a stateTransitionFact that was used to update the state.
    event LogStateTransitionFact(bytes32 stateTransitionFact);

    // Indicates a change of the Starknet OS program hash.
    event ProgramHashChanged(
        address indexed changedBy,
        uint256 oldProgramHash,
        uint256 newProgramHash
    );

    // Indicates a change of the Starknet aggregator program hash.
    event AggregatorProgramHashChanged(
        address indexed changedBy,
        uint256 oldAggregatorProgramHash,
        uint256 newAggregatorProgramHash
    );

    // Random storage slot tags.
    string internal constant PROGRAM_HASH_TAG = "STARKNET_1.0_INIT_PROGRAM_HASH_UINT";
    string internal constant AGGREGATOR_PROGRAM_HASH_TAG =
        "STARKNET_1.0_INIT_AGGREGATOR_PROGRAM_HASH_UINT";
    string internal constant VERIFIER_ADDRESS_TAG = "STARKNET_1.0_INIT_VERIFIER_ADDRESS";
    string internal constant STATE_STRUCT_TAG = "STARKNET_1.0_INIT_STARKNET_STATE_STRUCT";

    // The hash of the StarkNet config.
    string internal constant CONFIG_HASH_TAG = "STARKNET_1.0_STARKNET_CONFIG_HASH";

    // EIP-4844 constants.
    address internal constant POINT_EVALUATION_PRECOMPILE_ADDRESS = address(0x0A);
    // The precompile expected output:
    // Web3.keccak(FIELD_ELEMENTS_PER_BLOB.to_bytes(32, "big") + BLS_PRIME.to_bytes(32, "big")).
    bytes32 internal constant POINT_EVALUATION_PRECOMPILE_OUTPUT =
        0xb2157d3a40131b14c4c675335465dffde802f0ce5218ad012284d7f275d1b37c;
    uint256 internal constant PROOF_BYTES_LENGTH = 48;
    bytes1 internal constant VERSIONED_HASH_VERSION_KZG = bytes1(0x01);

    function setProgramHash(uint256 newProgramHash) external notFinalized onlyGovernance {
        emit ProgramHashChanged(msg.sender, programHash(), newProgramHash);
        programHash(newProgramHash);
    }

    function setAggregatorProgramHash(uint256 newAggregatorProgramHash)
        external
        notFinalized
        onlyGovernance
    {
        emit AggregatorProgramHashChanged(
            msg.sender,
            aggregatorProgramHash(),
            newAggregatorProgramHash
        );
        aggregatorProgramHash(newAggregatorProgramHash);
    }

    function setConfigHash(uint256 newConfigHash) external notFinalized onlyGovernance {
        emit ConfigHashChanged(msg.sender, configHash(), newConfigHash);
        configHash(newConfigHash);
    }

    function setMessageCancellationDelay(uint256 delayInSeconds)
        external
        notFinalized
        onlyGovernance
    {
        messageCancellationDelay(delayInSeconds);
    }

    // State variable "programHash" read-access function.
    function programHash() public view returns (uint256) {
        return NamedStorage.getUintValue(PROGRAM_HASH_TAG);
    }

    // State variable "programHash" write-access function.
    function programHash(uint256 value) internal {
        NamedStorage.setUintValue(PROGRAM_HASH_TAG, value);
    }

    // State variable "aggregatorProgramHash" read-access function.
    function aggregatorProgramHash() public view returns (uint256) {
        return NamedStorage.getUintValue(AGGREGATOR_PROGRAM_HASH_TAG);
    }

    // State variable "aggregatorProgramHash" write-access function.
    function aggregatorProgramHash(uint256 value) internal {
        NamedStorage.setUintValue(AGGREGATOR_PROGRAM_HASH_TAG, value);
    }

    // State variable "verifier" access function.
    function verifier() internal view returns (address) {
        return NamedStorage.getAddressValue(VERIFIER_ADDRESS_TAG);
    }

    // State variable "configHash" write-access function.
    function configHash(uint256 value) internal {
        NamedStorage.setUintValue(CONFIG_HASH_TAG, value);
    }

    // State variable "configHash" read-access function.
    function configHash() public view returns (uint256) {
        return NamedStorage.getUintValue(CONFIG_HASH_TAG);
    }

    function setVerifierAddress(address value) internal {
        NamedStorage.setAddressValueOnce(VERIFIER_ADDRESS_TAG, value);
    }

    // State variable "state" access function.
    function state() internal pure returns (StarknetState.State storage stateStruct) {
        bytes32 location = keccak256(abi.encodePacked(STATE_STRUCT_TAG));
        assembly {
            stateStruct.slot := location
        }
    }

    function isInitialized() internal view override returns (bool) {
        return programHash() != 0;
    }

    function numOfSubContracts() internal pure override returns (uint256) {
        return 0;
    }

    function validateInitData(bytes calldata data) internal view override {
        require(data.length == 7 * 32, "ILLEGAL_INIT_DATA_SIZE");
        uint256 programHash_ = abi.decode(data[:32], (uint256));
        require(programHash_ != 0, "BAD_INITIALIZATION");
    }

    function processSubContractAddresses(bytes calldata subContractAddresses) internal override {}

    function initializeContractState(bytes calldata data) internal override {
        (
            uint256 programHash_,
            uint256 aggregatorProgramHash_,
            address verifier_,
            uint256 configHash_,
            StarknetState.State memory initialState
        ) = abi.decode(data, (uint256, uint256, address, uint256, StarknetState.State));

        programHash(programHash_);
        aggregatorProgramHash(aggregatorProgramHash_);
        setVerifierAddress(verifier_);
        state().copy(initialState);
        configHash(configHash_);
        messageCancellationDelay(5 days);
    }

    /**
      Verifies p(z) = y given z, y, a commitment to p in the KZG segment,
      and a KZG proof for every blob.
      The verification is done by calling Ethereum's point evaluation precompile.
    */
    function verifyKzgProofs(uint256[] calldata programOutputSlice, bytes[] calldata kzgProofs)
        internal
    {
        require(programOutputSlice.length >= 2, "KZG_SEGMENT_TOO_SHORT");
        bytes32 z = bytes32(programOutputSlice[StarknetOutput.KZG_Z_OFFSET]);
        uint256 nBlobs = programOutputSlice[StarknetOutput.KZG_N_BLOBS_OFFSET];
        uint256 evaluationsOffset = StarknetOutput.KZG_COMMITMENTS_OFFSET + 2 * nBlobs;

        require(kzgProofs.length == nBlobs, "INVALID_NUMBER_OF_KZG_PROOFS");
        require(
            programOutputSlice.length >= evaluationsOffset + 2 * nBlobs,
            "KZG_SEGMENT_TOO_SHORT"
        );

        for (uint256 blobIndex = 0; blobIndex < nBlobs; blobIndex++) {
            bytes32 blobHash = blobhash(blobIndex);
            require(blobHash != 0, "INVALID_BLOB_INDEX");
            require(blobHash[0] == VERSIONED_HASH_VERSION_KZG, "UNEXPECTED_BLOB_HASH_VERSION");

            bytes memory kzgCommitment;
            {
                uint256 kzgCommitmentLow = programOutputSlice[
                    StarknetOutput.KZG_COMMITMENTS_OFFSET + (2 * blobIndex)
                ];
                uint256 kzgCommitmentHigh = programOutputSlice[
                    StarknetOutput.KZG_COMMITMENTS_OFFSET + (2 * blobIndex) + 1
                ];
                require(kzgCommitmentLow <= type(uint192).max, "INVALID_KZG_COMMITMENT");
                require(kzgCommitmentHigh <= type(uint192).max, "INVALID_KZG_COMMITMENT");

                kzgCommitment = abi.encodePacked(
                    uint192(kzgCommitmentHigh),
                    uint192(kzgCommitmentLow)
                );
            }

            bytes32 y;
            {
                uint256 yLow = programOutputSlice[evaluationsOffset + (2 * blobIndex)];
                uint256 yHigh = programOutputSlice[evaluationsOffset + (2 * blobIndex) + 1];
                require(yLow <= type(uint128).max, "INVALID_Y_VALUE");
                require(yHigh <= type(uint128).max, "INVALID_Y_VALUE");

                y = bytes32((yHigh << 128) + yLow);
            }

            require(kzgProofs[blobIndex].length == PROOF_BYTES_LENGTH, "INVALID_KZG_PROOF_SIZE");
            (bool ok, bytes memory precompile_output) = POINT_EVALUATION_PRECOMPILE_ADDRESS
                .staticcall(abi.encodePacked(blobHash, z, y, kzgCommitment, kzgProofs[blobIndex]));

            require(ok, "POINT_EVALUATION_PRECOMPILE_CALL_FAILED");
            require(
                keccak256(precompile_output) == POINT_EVALUATION_PRECOMPILE_OUTPUT,
                "UNEXPECTED_POINT_EVALUATION_PRECOMPILE_OUTPUT"
            );
        }
    }

    /**
      Performs the actual state update of Starknet, based on a proof of the Starknet OS that the
      state transition is valid.

      Arguments:
        programOutput - The main part of the StarkNet OS program output.
        stateTransitionFact - An encoding of the 'programOutput' (including on-chain data, if
            available).
    */
    function updateStateInternal(uint256[] calldata programOutput, bytes32 stateTransitionFact)
        internal
    {
        // Validate that all the values are in the range [0, FIELD_PRIME).
        validateProgramOutput(programOutput);

        // Validate config hash.
        require(
            programOutput[StarknetOutput.CONFIG_HASH_OFFSET] == configHash(),
            "INVALID_CONFIG_HASH"
        );

        require(programOutput[StarknetOutput.FULL_OUTPUT_OFFSET] == 0, "FULL_OUTPUT_NOT_SUPPORTED");

        uint256 factProgramHash;
        if (programOutput[StarknetOutput.OS_PROGRAM_HASH_OFFSET] != 0) {
            // Aggregator run.
            require(
                programOutput[StarknetOutput.OS_PROGRAM_HASH_OFFSET] == programHash(),
                "AGGREGATOR_MODE_INVALID_OS_PROGRAM_HASH"
            );
            factProgramHash = aggregatorProgramHash();
        } else {
            factProgramHash = programHash();
        }

        bytes32 sharpFact = keccak256(abi.encode(factProgramHash, stateTransitionFact));
        require(IFactRegistry(verifier()).isValid(sharpFact), "NO_STATE_TRANSITION_PROOF");
        emit LogStateTransitionFact(stateTransitionFact);

        // Perform state update.
        state().update(programOutput);

        // Process the messages after updating the state.
        // This is safer, as there is a call to transfer the fees during
        // the processing of the L1 -> L2 messages.

        // Process L2 -> L1 messages.
        uint256 outputOffset = StarknetOutput.messageSegmentOffset(programOutput);
        outputOffset += StarknetOutput.processMessages(
            // isL2ToL1=
            true,
            programOutput[outputOffset:],
            l2ToL1Messages()
        );

        // Process L1 -> L2 messages.
        outputOffset += StarknetOutput.processMessages(
            // isL2ToL1=
            false,
            programOutput[outputOffset:],
            l1ToL2Messages()
        );
        require(outputOffset == programOutput.length, "STARKNET_OUTPUT_TOO_LONG");
        // Note that processing L1 -> L2 messages does an external call, and it shouldn't be
        // followed by storage changes.

        StarknetState.State storage state_ = state();
        emit LogStateUpdate(state_.globalRoot, state_.blockNumber, state_.blockHash);
    }

    /**
      Returns a string that identifies the contract.
    */
    function identify() external pure override returns (string memory) {
        return "StarkWare_Starknet_2024_9";
    }

    /**
      Returns the current state root.
    */
    function stateRoot() external view returns (uint256) {
        return state().globalRoot;
    }

    /**
      Returns the current block number.
    */
    function stateBlockNumber() external view returns (int256) {
        return state().blockNumber;
    }

    /**
      Returns the current block hash.
    */
    function stateBlockHash() external view returns (uint256) {
        return state().blockHash;
    }

    /**
      Validates that all the values are in the range [0, FIELD_PRIME).
    */
    function validateProgramOutput(uint256[] calldata programOutput) internal pure {
        bool success = true;
        assembly {
            let FIELD_PRIME := 0x800000000000011000000000000000000000000000000000000000000000001
            let programOutputEnd := add(programOutput.offset, mul(programOutput.length, 0x20))
            for {
                let ptr := programOutput.offset
            } lt(ptr, programOutputEnd) {
                ptr := add(ptr, 0x20)
            } {
                if iszero(lt(calldataload(ptr), FIELD_PRIME)) {
                    success := 0
                    break
                }
            }
        }
        if (!success) {
            revert("PROGRAM_OUTPUT_VALUE_OUT_OF_RANGE");
        }
    }

    /**
      Updates the state of the Starknet, based on a proof of the Starknet OS that the state
      transition is valid. Data availability is provided on-chain.

      Arguments:
        programOutput - The main part of the StarkNet OS program output.
        data_availability_fact - An encoding of the on-chain data associated
        with the 'programOutput'.
    */
    function updateState(
        uint256[] calldata programOutput,
        uint256 onchainDataHash,
        uint256 onchainDataSize
    ) external onlyOperator {
        // Validate program output.
        require(programOutput.length > StarknetOutput.HEADER_SIZE, "STARKNET_OUTPUT_TOO_SHORT");

        // We protect against re-entrancy attacks by reading the block number at the beginning
        // and validating that we have the expected block number at the end.
        state().checkPrevBlockNumber(programOutput);

        // Validate KZG DA flag.
        require(programOutput[StarknetOutput.USE_KZG_DA_OFFSET] == 0, "UNEXPECTED_KZG_DA_FLAG");

        bytes32 stateTransitionFact = OnchainDataFactTreeEncoder.encodeFactWithOnchainData(
            programOutput,
            OnchainDataFactTreeEncoder.DataAvailabilityFact(onchainDataHash, onchainDataSize)
        );
        updateStateInternal(programOutput, stateTransitionFact);
        // Note that updateStateInternal does an external call, and it shouldn't be followed by
        // storage changes.

        // Re-entrancy protection (see above).
        state().checkNewBlockNumber(programOutput);
    }

    /**
      Updates the state of the StarkNet, based on a proof of the StarkNet OS that the state
      transition is valid. Data availability is committed with KZG and provided in a blob.

      Arguments:
        programOutput - The main part of the StarkNet OS program output.
        kzgProofs - array of KZG proofs - one per attached blob - which are validated together
        with the StarkNet OS data commitments given in 'programOutput'.
    */
    function updateStateKzgDA(uint256[] calldata programOutput, bytes[] calldata kzgProofs)
        external
        onlyOperator
    {
        // Validate program output.
        require(programOutput.length > StarknetOutput.HEADER_SIZE, "STARKNET_OUTPUT_TOO_SHORT");

        // We protect against re-entrancy attacks by reading the block number at the beginning
        // and validating that we have the expected block number at the end.
        state().checkPrevBlockNumber(programOutput);

        // Verify the KZG Proof.
        require(programOutput[StarknetOutput.USE_KZG_DA_OFFSET] == 1, "UNEXPECTED_KZG_DA_FLAG");
        verifyKzgProofs(programOutput[StarknetOutput.HEADER_SIZE:], kzgProofs);

        bytes32 stateTransitionFact = OnchainDataFactTreeEncoder.hashMainPublicInput(programOutput);
        updateStateInternal(programOutput, stateTransitionFact);
        // Note that updateStateInternal does an external call, and it shouldn't be followed by
        // storage changes.

        // Re-entrancy protection (see above).
        state().checkNewBlockNumber(programOutput);
    }
}