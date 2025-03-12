// SPDX-License-Identifier: Unknown
pragma solidity 0.6.11;

contract StarkExConstants is LibConstants {
    uint256 constant STARKEX_VAULT_ID_UPPER_BOUND = 2**31;
    uint256 constant STARKEX_EXPIRATION_TIMESTAMP_BITS = 22;
    uint256 public constant STARKEX_MAX_DEFAULT_VAULT_LOCK = 7 days;
}

contract VerifyFactChain is MainStorage {
    function verifyFact(
        StarkExTypes.ApprovalChainData storage chain,
        bytes32 fact,
        string memory noVerifiersErrorMessage,
        string memory invalidFactErrorMessage
    ) internal view {
        address[] storage list = chain.list;
        uint256 n_entries = list.length;
        require(n_entries > 0, noVerifiersErrorMessage);
        for (uint256 i = 0; i < n_entries; i++) {
            // NOLINTNEXTLINE: calls-loop.
            require(IFactRegistry(list[i]).isValid(fact), invalidFactErrorMessage);
        }
    }
}

contract PublicInputOffsets {
    // The following constants are offsets of data expected in the public input.
    uint256 internal constant PUB_IN_INITIAL_VAULT_ROOT_OFFSET = 0;
    uint256 internal constant PUB_IN_FINAL_VAULT_ROOT_OFFSET = 1;
    uint256 internal constant PUB_IN_INITIAL_ORDER_ROOT_OFFSET = 2;
    uint256 internal constant PUB_IN_FINAL_ORDER_ROOT_OFFSET = 3;
    uint256 internal constant PUB_IN_GLOBAL_EXPIRATION_TIMESTAMP_OFFSET = 4;
    uint256 internal constant PUB_IN_VAULT_TREE_HEIGHT_OFFSET = 5;
    uint256 internal constant PUB_IN_ORDER_TREE_HEIGHT_OFFSET = 6;
    uint256 internal constant PUB_IN_ONCHAIN_DATA_VERSION = 7;
    uint256 internal constant PUB_IN_N_MODIFICATIONS_OFFSET = 8;
    uint256 internal constant PUB_IN_N_CONDITIONAL_TRANSFERS_OFFSET = 9;
    uint256 internal constant PUB_IN_N_ONCHAIN_VAULT_UPDATES_OFFSET = 10;
    uint256 internal constant PUB_IN_N_ONCHAIN_ORDERS_OFFSET = 11;
    uint256 internal constant PUB_IN_TRANSACTIONS_DATA_OFFSET = 12;

    uint256 internal constant PUB_IN_N_WORDS_PER_MODIFICATION = 3;
    uint256 internal constant PUB_IN_N_WORDS_PER_CONDITIONAL_TRANSFER = 1;
    uint256 internal constant PUB_IN_N_WORDS_PER_ONCHAIN_VAULT_UPDATE = 3;
    uint256 internal constant PUB_IN_N_MIN_WORDS_PER_ONCHAIN_ORDER = 3;

    // Onchain-data version.
    uint256 internal constant ONCHAIN_DATA_NONE = 0;
    uint256 internal constant ONCHAIN_DATA_VAULTS = 1;

    // The following constants are offsets of data expected in the application data.
    uint256 internal constant APP_DATA_BATCH_ID_OFFSET = 0;
    uint256 internal constant APP_DATA_PREVIOUS_BATCH_ID_OFFSET = 1;
    uint256 internal constant APP_DATA_TRANSACTIONS_DATA_OFFSET = 2;

    uint256 internal constant APP_DATA_N_WORDS_PER_CONDITIONAL_TRANSFER = 2;
}

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
        bytes32 mainPublicInputHash = keccak256(abi.encodePacked(programOutput));

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
}

abstract contract UpdateState is
    StarkExStorage,
    StarkExConstants,
    MStarkExForcedActionState,
    VerifyFactChain,
    MAcceptModifications,
    MFreezable,
    MOperator,
    PublicInputOffsets
{
    event LogRootUpdate(
        uint256 sequenceNumber,
        uint256 batchId,
        uint256 vaultRoot,
        uint256 orderRoot
    );

    event LogStateTransitionFact(bytes32 stateTransitionFact);

    event LogVaultBalanceChangeApplied(
        address ethKey,
        uint256 assetId,
        uint256 vaultId,
        int256 quantizedAmountChange
    );

    function updateState(uint256[] calldata publicInput, uint256[] calldata applicationData)
        external
        virtual
        notFrozen
        onlyOperator
    {
        require(
            publicInput.length >= PUB_IN_TRANSACTIONS_DATA_OFFSET,
            "publicInput does not contain all required fields."
        );
        require(
            publicInput[PUB_IN_FINAL_VAULT_ROOT_OFFSET] < K_MODULUS,
            "New vault root >= PRIME."
        );
        require(
            publicInput[PUB_IN_FINAL_ORDER_ROOT_OFFSET] < K_MODULUS,
            "New order root >= PRIME."
        );
        require(
            publicInput[PUB_IN_ONCHAIN_DATA_VERSION] == onchainDataVersion,
            "Unsupported onchain-data version."
        );
        require(
            lastBatchId == 0 || applicationData[APP_DATA_PREVIOUS_BATCH_ID_OFFSET] == lastBatchId,
            "WRONG_PREVIOUS_BATCH_ID"
        );

        // Ensure global timestamp has not expired.
        require(
            publicInput[PUB_IN_GLOBAL_EXPIRATION_TIMESTAMP_OFFSET] <
                2**STARKEX_EXPIRATION_TIMESTAMP_BITS,
            "Global expiration timestamp is out of range."
        );

        require( // NOLINT: block-timestamp.
            publicInput[PUB_IN_GLOBAL_EXPIRATION_TIMESTAMP_OFFSET] > block.timestamp / 3600,
            "Timestamp of the current block passed the threshold for the transaction batch."
        );

        bytes32 stateTransitionFact = getStateTransitionFact(publicInput);

        emit LogStateTransitionFact(stateTransitionFact);

        verifyFact(
            verifiersChain,
            stateTransitionFact,
            "NO_STATE_TRANSITION_VERIFIERS",
            "NO_STATE_TRANSITION_PROOF"
        );

        bytes32 availabilityFact = keccak256(
            abi.encodePacked(
                publicInput[PUB_IN_FINAL_VAULT_ROOT_OFFSET],
                publicInput[PUB_IN_VAULT_TREE_HEIGHT_OFFSET],
                publicInput[PUB_IN_FINAL_ORDER_ROOT_OFFSET],
                publicInput[PUB_IN_ORDER_TREE_HEIGHT_OFFSET],
                sequenceNumber + 1
            )
        );

        verifyFact(
            availabilityVerifiersChain,
            availabilityFact,
            "NO_AVAILABILITY_VERIFIERS",
            "NO_AVAILABILITY_PROOF"
        );

        performUpdateState(publicInput, applicationData);
    }

    function getStateTransitionFact(uint256[] calldata publicInput)
        internal
        pure
        returns (bytes32)
    {
        uint256 onchainDataVersionField = publicInput[PUB_IN_ONCHAIN_DATA_VERSION];
        if (onchainDataVersionField == ONCHAIN_DATA_NONE) {
            return keccak256(abi.encodePacked(publicInput));
        } else if (onchainDataVersionField == ONCHAIN_DATA_VAULTS) {
            // Use a simple fact tree.
            require(
                publicInput.length >=
                    PUB_IN_TRANSACTIONS_DATA_OFFSET +
                        OnchainDataFactTreeEncoder.ONCHAIN_DATA_FACT_ADDITIONAL_WORDS,
                "programOutput does not contain all required fields."
            );
            return
                OnchainDataFactTreeEncoder.encodeFactWithOnchainData(
                    publicInput[:publicInput.length -
                        OnchainDataFactTreeEncoder.ONCHAIN_DATA_FACT_ADDITIONAL_WORDS],
                    OnchainDataFactTreeEncoder.DataAvailabilityFact({
                        onchainDataHash: publicInput[publicInput.length - 2],
                        onchainDataSize: publicInput[publicInput.length - 1]
                    })
                );
        } else {
            revert("Unsupported onchain-data version.");
        }
    }

    function performUpdateState(uint256[] calldata publicInput, uint256[] calldata applicationData)
        internal
    {
        rootUpdate(
            publicInput[PUB_IN_INITIAL_VAULT_ROOT_OFFSET],
            publicInput[PUB_IN_FINAL_VAULT_ROOT_OFFSET],
            publicInput[PUB_IN_INITIAL_ORDER_ROOT_OFFSET],
            publicInput[PUB_IN_FINAL_ORDER_ROOT_OFFSET],
            publicInput[PUB_IN_VAULT_TREE_HEIGHT_OFFSET],
            publicInput[PUB_IN_ORDER_TREE_HEIGHT_OFFSET],
            applicationData[APP_DATA_BATCH_ID_OFFSET]
        );
        performOnchainOperations(publicInput, applicationData);
    }

    function rootUpdate(
        uint256 oldVaultRoot,
        uint256 newVaultRoot,
        uint256 oldOrderRoot,
        uint256 newOrderRoot,
        uint256 vaultTreeHeightSent,
        uint256 orderTreeHeightSent,
        uint256 batchId
    ) internal virtual {
        // Assert that the old state is correct.
        require(oldVaultRoot == vaultRoot, "VAULT_ROOT_INCORRECT");
        require(oldOrderRoot == orderRoot, "ORDER_ROOT_INCORRECT");

        // Assert that heights are correct.
        require(vaultTreeHeight == vaultTreeHeightSent, "VAULT_HEIGHT_INCORRECT");
        require(orderTreeHeight == orderTreeHeightSent, "ORDER_HEIGHT_INCORRECT");

        // Update state.
        vaultRoot = newVaultRoot;
        orderRoot = newOrderRoot;
        sequenceNumber = sequenceNumber + 1;
        lastBatchId = batchId;

        // Log update.
        emit LogRootUpdate(sequenceNumber, batchId, vaultRoot, orderRoot);
    }

    function performOnchainOperations(
        uint256[] calldata publicInput,
        uint256[] calldata applicationData
    ) private {
        uint256 nModifications = publicInput[PUB_IN_N_MODIFICATIONS_OFFSET];
        uint256 nCondTransfers = publicInput[PUB_IN_N_CONDITIONAL_TRANSFERS_OFFSET];
        uint256 onchainDataVersionField = publicInput[PUB_IN_ONCHAIN_DATA_VERSION];
        uint256 nOnchainVaultUpdates = publicInput[PUB_IN_N_ONCHAIN_VAULT_UPDATES_OFFSET];
        uint256 nOnchainOrders = publicInput[PUB_IN_N_ONCHAIN_ORDERS_OFFSET];

        // Sanity value that also protects from theoretical overflow in multiplication.
        require(nModifications < 2**64, "Invalid number of modifications.");
        require(nCondTransfers < 2**64, "Invalid number of conditional transfers.");
        require(nOnchainVaultUpdates < 2**64, "Invalid number of onchain vault updates.");
        require(nOnchainOrders < 2**64, "Invalid number of onchain orders.");
        require(
            publicInput.length >=
                PUB_IN_TRANSACTIONS_DATA_OFFSET +
                    PUB_IN_N_WORDS_PER_MODIFICATION *
                    nModifications +
                    PUB_IN_N_WORDS_PER_CONDITIONAL_TRANSFER *
                    nCondTransfers +
                    PUB_IN_N_WORDS_PER_ONCHAIN_VAULT_UPDATE *
                    nOnchainVaultUpdates +
                    PUB_IN_N_MIN_WORDS_PER_ONCHAIN_ORDER *
                    nOnchainOrders,
            "publicInput size is inconsistent with expected transactions."
        );
        require(
            applicationData.length ==
                APP_DATA_TRANSACTIONS_DATA_OFFSET +
                    APP_DATA_N_WORDS_PER_CONDITIONAL_TRANSFER *
                    nCondTransfers,
            "applicationData size is inconsistent with expected transactions."
        );

        uint256 offsetPubInput = PUB_IN_TRANSACTIONS_DATA_OFFSET;
        uint256 offsetAppData = APP_DATA_TRANSACTIONS_DATA_OFFSET;

        // When reaching this line, offsetPubInput is initialized to the beginning of modifications
        // data in publicInput. Following this line's execution, offsetPubInput is incremented by
        // the number of words consumed by sendModifications.
        offsetPubInput += sendModifications(publicInput[offsetPubInput:], nModifications);

        // When reaching this line, offsetPubInput and offsetAppData are pointing to the beginning
        // of conditional transfers data in publicInput and applicationData.
        // Following the execution of this block, offsetPubInput and offsetAppData are incremented
        // by the number of words consumed by verifyConditionalTransfers.
        {
            uint256 consumedPubInputWords;
            uint256 consumedAppDataWords;
            (consumedPubInputWords, consumedAppDataWords) = verifyConditionalTransfers(
                publicInput[offsetPubInput:],
                applicationData[offsetAppData:],
                nCondTransfers
            );

            offsetPubInput += consumedPubInputWords;
            offsetAppData += consumedAppDataWords;
        }

        // offsetPubInput is incremented by the number of words consumed by updateOnchainVaults.
        // NOLINTNEXTLINE: reentrancy-benign.
        offsetPubInput += updateOnchainVaults(publicInput[offsetPubInput:], nOnchainVaultUpdates);

        // offsetPubInput is incremented by the number of words consumed by verifyOnchainOrders.
        offsetPubInput += verifyOnchainOrders(publicInput[offsetPubInput:], nOnchainOrders);

        // The Onchain Data info appears at the end of publicInput.
        if (onchainDataVersionField == 1) {
            offsetPubInput += OnchainDataFactTreeEncoder.ONCHAIN_DATA_FACT_ADDITIONAL_WORDS;
        }

        require(offsetPubInput == publicInput.length, "Incorrect Size");
    }

    /*
      Deposits and withdrawals. Moves funds off and on chain.
        slidingPublicInput - a pointer to the beginning of modifications data in publicInput.
        nModifications - the number of modifications.
      Returns the number of publicInput words consumed by this function.
    */
    function sendModifications(uint256[] calldata slidingPublicInput, uint256 nModifications)
        private
        returns (uint256 consumedPubInputItems)
    {
        uint256 offsetPubInput = 0;

        for (uint256 i = 0; i < nModifications; i++) {
            uint256 ownerKey = slidingPublicInput[offsetPubInput];
            uint256 assetId = slidingPublicInput[offsetPubInput + 1];

            require(ownerKey < K_MODULUS, "Stark key >= PRIME");
            require(assetId < K_MODULUS, "Asset id >= PRIME");

            uint256 actionParams = slidingPublicInput[offsetPubInput + 2];
            require((actionParams >> 96) == 0, "Unsupported modification action field.");

            // Extract and unbias the balanceDiff.
            int256 balanceDiff = int256((actionParams & ((1 << 64) - 1)) - (1 << 63));
            uint256 vaultId = (actionParams >> 64) & ((1 << 31) - 1);

            if (balanceDiff > 0) {
                // This is a deposit.
                acceptDeposit(ownerKey, vaultId, assetId, uint256(balanceDiff));
            } else if (balanceDiff < 0) {
                // This is a withdrawal.
                acceptWithdrawal(ownerKey, assetId, uint256(-balanceDiff));
            }

            if ((actionParams & (1 << 95)) != 0) {
                clearFullWithdrawalRequest(ownerKey, vaultId);
            }

            offsetPubInput += PUB_IN_N_WORDS_PER_MODIFICATION;
        }
        return offsetPubInput;
    }

    /*
      Verifies that each conditional transfer's condition was met.
        slidingPublicInput - a pointer to the beginning of condTransfers data in publicInput.
        slidingAppData - a pointer to the beginning of condTransfers data in applicationData.
        nCondTransfers - the number of conditional transfers.
      Returns the number of publicInput and applicationData words consumed by this function.
    */
    function verifyConditionalTransfers(
        uint256[] calldata slidingPublicInput,
        uint256[] calldata slidingAppData,
        uint256 nCondTransfers
    ) private view returns (uint256 consumedPubInputItems, uint256 consumedAppDataItems) {
        uint256 offsetPubInput = 0;
        uint256 offsetAppData = 0;

        for (uint256 i = 0; i < nCondTransfers; i++) {
            address factRegistryAddress = address(slidingAppData[offsetAppData]);
            bytes32 condTransferFact = bytes32(slidingAppData[offsetAppData + 1]);
            uint256 condition = slidingPublicInput[offsetPubInput];

            // The condition is the 250 LS bits of keccak256 of the fact registry & fact.
            require(
                condition ==
                    uint256(keccak256(abi.encodePacked(factRegistryAddress, condTransferFact))) &
                        MASK_250,
                "Condition mismatch."
            );
            // NOLINTNEXTLINE: low-level-calls-loop.
            (bool success, bytes memory returndata) = factRegistryAddress.staticcall(
                abi.encodeWithSignature("isValid(bytes32)", condTransferFact)
            );
            require(success && returndata.length == 32, "BAD_FACT_REGISTRY_CONTRACT");
            require(
                abi.decode(returndata, (bool)),
                "Condition for the conditional transfer was not met."
            );

            offsetPubInput += PUB_IN_N_WORDS_PER_CONDITIONAL_TRANSFER;
            offsetAppData += APP_DATA_N_WORDS_PER_CONDITIONAL_TRANSFER;
        }
        return (offsetPubInput, offsetAppData);
    }

    /*
      Moves funds into and out of onchain vaults.
        slidingPublicInput - a pointer to the beginning of onchain vaults update data in publicInput.
        nOnchainVaultUpdates - the number of onchain vaults updates.
      Returns the number of publicInput words consumed by this function.
    */
    function updateOnchainVaults(
        uint256[] calldata slidingPublicInput,
        uint256 nOnchainVaultUpdates
    ) private returns (uint256 consumedPubInputItems) {
        uint256 offsetPubInput = 0;

        for (uint256 i = 0; i < nOnchainVaultUpdates; i++) {
            address ethAddress = address(slidingPublicInput[offsetPubInput]);
            uint256 assetId = slidingPublicInput[offsetPubInput + 1];

            require(assetId < K_MODULUS, "assetId >= PRIME");

            uint256 additionalParams = slidingPublicInput[offsetPubInput + 2];
            require((additionalParams >> 160) == 0, "Unsupported vault update field.");

            // Extract and unbias the balanceDiff.
            int256 balanceDiff = int256((additionalParams & ((1 << 64) - 1)) - (1 << 63));

            int256 minBalance = int256((additionalParams >> 64) & ((1 << 64) - 1));
            uint256 vaultId = (additionalParams >> 128) & ((1 << 31) - 1);

            int256 balanceBefore = int256(vaultsBalances[ethAddress][assetId][vaultId]);
            int256 newBalance = balanceBefore + balanceDiff;

            if (balanceDiff > 0) {
                require(newBalance > balanceBefore, "VAULT_OVERFLOW");
            } else {
                require(balanceBefore >= balanceDiff, "INSUFFICIENT_VAULT_BALANCE");
            }

            if (strictVaultBalancePolicy) {
                require(minBalance >= 0, "ILLEGAL_BALANCE_REQUIREMENT");
                require(balanceBefore >= minBalance, "UNMET_BALANCE_REQUIREMENT");
            }

            require(newBalance >= 0, "NEGATIVE_BALANCE");
            vaultsBalances[ethAddress][assetId][vaultId] = uint256(newBalance);
            // NOLINTNEXTLINE: reentrancy-events.
            emit LogVaultBalanceChangeApplied(ethAddress, assetId, vaultId, balanceDiff);

            offsetPubInput += PUB_IN_N_WORDS_PER_ONCHAIN_VAULT_UPDATE;
        }
        return offsetPubInput;
    }

    /*
      Verifies that each order was registered by its sender.
        slidingPublicInput - a pointer to the beginning of onchain orders data in publicInput.
        nOnchainOrders - the number of onchain orders.
      Returns the number of publicInput words consumed by this function.
    */
    function verifyOnchainOrders(uint256[] calldata slidingPublicInput, uint256 nOnchainOrders)
        private
        view
        returns (uint256 consumedPubInputItems)
    {
        MessageRegistry orderRegistry = MessageRegistry(orderRegistryAddress);
        uint256 offsetPubInput = 0;

        for (uint256 i = 0; i < nOnchainOrders; i++) {
            // Make sure we remain within slidingPublicInput's bounds.
            require(offsetPubInput + 2 <= slidingPublicInput.length, "Input out of bounds.");
            // First word is the order sender.
            address orderSender = address(slidingPublicInput[offsetPubInput]);
            // Second word is the order blob size (number of blob words) that follow.
            uint256 blobSize = uint256(slidingPublicInput[offsetPubInput + 1]);
            require(offsetPubInput + blobSize + 2 >= offsetPubInput, "Blob size overflow.");

            offsetPubInput += 2;
            require(offsetPubInput + blobSize <= slidingPublicInput.length, "Input out of bounds.");
            // Calculate the hash of the order blob.
            bytes32 orderHash = keccak256(
                abi.encodePacked(slidingPublicInput[offsetPubInput:offsetPubInput + blobSize])
            );

            // Verify this order has been registered.
            require(
                orderRegistry.isMessageRegistered(orderSender, address(this), orderHash),
                "Order not registered."
            );

            offsetPubInput += blobSize;
        }
        return offsetPubInput;
    }
}

abstract contract Escapes is StarkExStorage, MAcceptModifications, MFreezable, MStateRoot {
    function initialize(address escapeVerifier) internal {
        escapeVerifierAddress = escapeVerifier;
    }

    /*
      Escape when the contract is frozen.
    */
    function escape(
        uint256 starkKey,
        uint256 vaultId,
        uint256 assetId,
        uint256 quantizedAmount
    ) external onlyFrozen {
        require(!escapesUsed[vaultId], "ESCAPE_ALREADY_USED");

        // Escape can be used only once.
        escapesUsed[vaultId] = true;
        escapesUsedCount += 1;

        bytes32 claimHash = keccak256(
            abi.encode(
                starkKey,
                assetId,
                quantizedAmount,
                getVaultRoot(),
                getVaultTreeHeight(),
                vaultId
            )
        );
        IFactRegistry escapeVerifier = IFactRegistry(escapeVerifierAddress);
        require(escapeVerifier.isValid(claimHash), "ESCAPE_LACKS_PROOF");

        allowWithdrawal(starkKey, assetId, quantizedAmount);
    }
}

abstract contract MStateRoot {
    // NOLINTNEXTLINE external-function.
    function getVaultRoot() public view virtual returns (uint256 root);

    // NOLINTNEXTLINE external-function.
    function getVaultTreeHeight() public view virtual returns (uint256 height);
}

contract StateRoot is MainStorage, MStateRoot {
    function initialize(
        uint256 initialSequenceNumber,
        uint256 initialVaultRoot,
        uint256 initialOrderRoot,
        uint256 initialVaultTreeHeight,
        uint256 initialOrderTreeHeight
    ) internal {
        sequenceNumber = initialSequenceNumber;
        vaultRoot = initialVaultRoot;
        orderRoot = initialOrderRoot;
        vaultTreeHeight = initialVaultTreeHeight;
        orderTreeHeight = initialOrderTreeHeight;
    }

    function getVaultRoot() public view override returns (uint256 root) {
        root = vaultRoot;
    }

    function getVaultTreeHeight() public view override returns (uint256 height) {
        height = vaultTreeHeight;
    }

    function getOrderRoot() external view returns (uint256 root) {
        root = orderRoot;
    }

    function getOrderTreeHeight() external view returns (uint256 height) {
        height = orderTreeHeight;
    }

    function getSequenceNumber() external view returns (uint256 seq) {
        seq = sequenceNumber;
    }

    function getLastBatchId() external view returns (uint256 batchId) {
        batchId = lastBatchId;
    }
}

contract StarkExStorage is MainStorage {
    // Onchain vaults balances.
    // A map eth_address => asset_id => vault_id => quantized amount.
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) vaultsBalances;

    // Onchain vaults withdrawal lock time.
    // A map eth_address => asset_id => vault_id => lock expiration timestamp.
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) vaultsWithdrawalLocks;

    // Enforces the minimal balance requirement (as output by Cairo) on onchain vault updates.
    // When disabled, flash loans are enabled.
    bool strictVaultBalancePolicy; // NOLINT: constable-states, uninitialized-state.

    // The default time, in seconds, that an onchain vault is locked for withdrawal after a deposit.
    uint256 public defaultVaultWithdrawalLock; // NOLINT: constable-states.

    // Address of the message registry contract that is used to sign and verify L1 orders.
    address public orderRegistryAddress; // NOLINT: constable-states.

    // Reserved storage space for Extensibility.
    // Every added MUST be added above the end gap, and the __endGap size must be reduced
    // accordingly.
    // NOLINTNEXTLINE: naming-convention shadowing-abstract.
    uint256[LAYOUT_LENGTH - 5] private __endGap; // __endGap complements layout to LAYOUT_LENGTH.
}

contract ActionHash is MainStorage, LibConstants {
    function getActionHash(string memory actionName, bytes memory packedActionParameters)
        internal
        pure
        returns (bytes32 actionHash)
    {
        actionHash = keccak256(abi.encodePacked(actionName, packedActionParameters));
    }

    function setActionHash(bytes32 actionHash, bool premiumCost) internal {
        // The rate of forced trade requests is restricted.
        // First restriction is by capping the number of requests in a block.
        // User can override this cap by requesting with a permium flag set,
        // in this case, the gas cost is high (~1M) but no "technical" limit is set.
        // However, the high gas cost creates an obvious limitation due to the block gas limit.
        if (premiumCost) {
            for (uint256 i = 0; i < 21129; i++) {}
        } else {
            require(
                forcedRequestsInBlock[block.number] < MAX_FORCED_ACTIONS_REQS_PER_BLOCK,
                "MAX_REQUESTS_PER_BLOCK_REACHED"
            );
            forcedRequestsInBlock[block.number] += 1;
        }
        forcedActionRequests[actionHash] = block.timestamp;
        actionHashList.push(actionHash);
    }

    function getActionCount() external view returns (uint256) {
        return actionHashList.length;
    }

    function getActionHashByIndex(uint256 actionIndex) external view returns (bytes32) {
        require(actionIndex < actionHashList.length, "ACTION_INDEX_TOO_HIGH");
        return actionHashList[actionIndex];
    }
}

abstract contract MStarkExForcedActionState {
    function fullWithdrawActionHash(uint256 starkKey, uint256 vaultId)
        internal
        pure
        virtual
        returns (bytes32);

    function clearFullWithdrawalRequest(uint256 starkKey, uint256 vaultId) internal virtual;

    // NOLINTNEXTLINE: external-function.
    function getFullWithdrawalRequest(uint256 starkKey, uint256 vaultId)
        public
        view
        virtual
        returns (uint256 res);

    function setFullWithdrawalRequest(uint256 starkKey, uint256 vaultId) internal virtual;
}

contract StarkExForcedActionState is StarkExStorage, ActionHash, MStarkExForcedActionState {
    function fullWithdrawActionHash(uint256 starkKey, uint256 vaultId)
        internal
        pure
        override
        returns (bytes32)
    {
        return getActionHash("FULL_WITHDRAWAL", abi.encode(starkKey, vaultId));
    }

    /*
      Implemented in the FullWithdrawal contracts.
    */
    function clearFullWithdrawalRequest(uint256 starkKey, uint256 vaultId)
        internal
        virtual
        override
    {
        // Reset escape request.
        delete forcedActionRequests[fullWithdrawActionHash(starkKey, vaultId)];
    }

    function getFullWithdrawalRequest(uint256 starkKey, uint256 vaultId)
        public
        view
        override
        returns (uint256 res)
    {
        // Return request value. Expect zero if the request doesn't exist or has been serviced, and
        // a non-zero value otherwise.
        res = forcedActionRequests[fullWithdrawActionHash(starkKey, vaultId)];
    }

    function setFullWithdrawalRequest(uint256 starkKey, uint256 vaultId) internal override {
        // FullWithdrawal is always at premium cost, hence the `true`.
        setActionHash(fullWithdrawActionHash(starkKey, vaultId), true);
    }
}

contract TokenQuantization is MainStorage, MTokenQuantization {
    function fromQuantized(uint256 presumedAssetType, uint256 quantizedAmount)
        internal
        view
        override
        returns (uint256 amount)
    {
        uint256 quantum = getQuantum(presumedAssetType);
        amount = quantizedAmount * quantum;
        require(amount / quantum == quantizedAmount, "DEQUANTIZATION_OVERFLOW");
    }

    function getQuantum(uint256 presumedAssetType) public view override returns (uint256 quantum) {
        if (!registeredAssetType[presumedAssetType]) {
            // Default quantization, for NFTs etc.
            quantum = 1;
        } else {
            // Retrieve registration.
            quantum = assetTypeToQuantum[presumedAssetType];
        }
    }

    function toQuantized(uint256 presumedAssetType, uint256 amount)
        internal
        view
        override
        returns (uint256 quantizedAmount)
    {
        uint256 quantum = getQuantum(presumedAssetType);
        require(amount % quantum == 0, "INVALID_AMOUNT");
        quantizedAmount = amount / quantum;
    }
}

abstract contract MAcceptModifications {
    function acceptDeposit(
        uint256 ownerKey,
        uint256 vaultId,
        uint256 assetId,
        uint256 quantizedAmount
    ) internal virtual;

    function allowWithdrawal(
        uint256 ownerKey,
        uint256 assetId,
        uint256 quantizedAmount
    ) internal virtual;

    function acceptWithdrawal(
        uint256 ownerKey,
        uint256 assetId,
        uint256 quantizedAmount
    ) internal virtual;
}

abstract contract MTokenQuantization {
    function fromQuantized(uint256 presumedAssetType, uint256 quantizedAmount)
        internal
        view
        virtual
        returns (uint256 amount);

    // NOLINTNEXTLINE: external-function.
    function getQuantum(uint256 presumedAssetType) public view virtual returns (uint256 quantum);

    function toQuantized(uint256 presumedAssetType, uint256 amount)
        internal
        view
        virtual
        returns (uint256 quantizedAmount);
}

abstract contract AcceptModifications is
    MainStorage,
    LibConstants,
    MAcceptModifications,
    MTokenQuantization
{
    event LogWithdrawalAllowed(
        uint256 ownerKey,
        uint256 assetType,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount
    );

    event LogNftWithdrawalAllowed(uint256 ownerKey, uint256 assetId);

    event LogMintableWithdrawalAllowed(uint256 ownerKey, uint256 assetId, uint256 quantizedAmount);

    /*
      Transfers funds from the on-chain deposit area to the off-chain area.
      Implemented in the Deposits contracts.
    */
    function acceptDeposit(
        uint256 ownerKey,
        uint256 vaultId,
        uint256 assetId,
        uint256 quantizedAmount
    ) internal virtual override {
        // Fetch deposit.
        require(
            pendingDeposits[ownerKey][assetId][vaultId] >= quantizedAmount,
            "DEPOSIT_INSUFFICIENT"
        );

        // Subtract accepted quantized amount.
        pendingDeposits[ownerKey][assetId][vaultId] -= quantizedAmount;
    }

    /*
      Transfers funds from the off-chain area to the on-chain withdrawal area.
    */
    function allowWithdrawal(
        uint256 ownerKey,
        uint256 assetId,
        uint256 quantizedAmount
    ) internal override {
        // Fetch withdrawal.
        uint256 withdrawal = pendingWithdrawals[ownerKey][assetId];

        // Add accepted quantized amount.
        withdrawal += quantizedAmount;
        require(withdrawal >= quantizedAmount, "WITHDRAWAL_OVERFLOW");

        // Store withdrawal.
        pendingWithdrawals[ownerKey][assetId] = withdrawal;

        // Log event.
        uint256 presumedAssetType = assetId;
        if (registeredAssetType[presumedAssetType]) {
            emit LogWithdrawalAllowed(
                ownerKey,
                presumedAssetType,
                fromQuantized(presumedAssetType, quantizedAmount),
                quantizedAmount
            );
        } else if (assetId == ((assetId & MASK_240) | MINTABLE_ASSET_ID_FLAG)) {
            emit LogMintableWithdrawalAllowed(ownerKey, assetId, quantizedAmount);
        } else {
            // Default case is Non-Mintable ERC721 asset id.
            require(assetId == assetId & MASK_250, "INVALID_NFT_ASSET_ID");
            // In ERC721 case, assetId is not the assetType.
            require(withdrawal <= 1, "INVALID_NFT_AMOUNT");
            emit LogNftWithdrawalAllowed(ownerKey, assetId);
        }
    }

    // Verifier authorizes withdrawal.
    function acceptWithdrawal(
        uint256 ownerKey,
        uint256 assetId,
        uint256 quantizedAmount
    ) internal virtual override {
        allowWithdrawal(ownerKey, assetId, quantizedAmount);
    }
}

contract LibConstants {
    // Durations for time locked mechanisms (in seconds).
    // Note that it is known that miners can manipulate block timestamps
    // up to a deviation of a few seconds.
    // This mechanism should not be used for fine grained timing.

    // The time required to cancel a deposit, in the case the operator does not move the funds
    // to the off-chain storage.
    uint256 public constant DEPOSIT_CANCEL_DELAY = 2 days;

    // The time required to freeze the exchange, in the case the operator does not execute a
    // requested full withdrawal.
    uint256 public constant FREEZE_GRACE_PERIOD = 7 days;

    // The time after which the exchange may be unfrozen after it froze. This should be enough time
    // for users to perform escape hatches to get back their funds.
    uint256 public constant UNFREEZE_DELAY = 365 days;

    // Maximal number of verifiers which may co-exist.
    uint256 public constant MAX_VERIFIER_COUNT = uint256(64);

    // The time required to remove a verifier in case of a verifier upgrade.
    uint256 public constant VERIFIER_REMOVAL_DELAY = FREEZE_GRACE_PERIOD + (21 days);

    address constant ZERO_ADDRESS = address(0x0);

    uint256 constant K_MODULUS = 0x800000000000011000000000000000000000000000000000000000000000001;

    uint256 constant K_BETA = 0x6f21413efbe40de150e596d72f7a8c5609ad26c15c915c1f4cdfcb99cee9e89;

    uint256 internal constant MASK_250 =
        0x03FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    uint256 internal constant MASK_240 =
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

    uint256 public constant MAX_FORCED_ACTIONS_REQS_PER_BLOCK = 10;

    uint256 constant QUANTUM_UPPER_BOUND = 2**128;
    uint256 internal constant MINTABLE_ASSET_ID_FLAG = 1 << 250;
}

abstract contract MFreezable {
    /*
      Returns true if the exchange is frozen.
    */
    function isFrozen() public view virtual returns (bool); // NOLINT: external-function.

    /*
      Forbids calling the function if the exchange is frozen.
    */
    modifier notFrozen() {
        require(!isFrozen(), "STATE_IS_FROZEN");
        _;
    }

    function validateFreezeRequest(uint256 requestTime) internal virtual;

    /*
      Allows calling the function only if the exchange is frozen.
    */
    modifier onlyFrozen() {
        require(isFrozen(), "STATE_NOT_FROZEN");
        _;
    }

    /*
      Freezes the exchange.
    */
    function freeze() internal virtual;
}

abstract contract Freezable is MainStorage, LibConstants, MGovernance, MFreezable {
    event LogFrozen();
    event LogUnFrozen();

    function isFrozen() public view override returns (bool) {
        return stateFrozen;
    }

    function validateFreezeRequest(uint256 requestTime) internal override {
        require(requestTime != 0, "FORCED_ACTION_UNREQUESTED");
        // Verify timer on escape request.
        uint256 freezeTime = requestTime + FREEZE_GRACE_PERIOD;

        // Prevent wraparound.
        assert(freezeTime >= FREEZE_GRACE_PERIOD);
        require(block.timestamp >= freezeTime, "FORCED_ACTION_PENDING"); // NOLINT: timestamp.

        // Forced action requests placed before freeze, are no longer valid after the un-freeze.
        require(freezeTime > unFreezeTime, "REFREEZE_ATTEMPT");
    }

    function freeze() internal override notFrozen {
        unFreezeTime = block.timestamp + UNFREEZE_DELAY;

        // Update state.
        stateFrozen = true;

        // Log event.
        emit LogFrozen();
    }

    function unFreeze() external onlyFrozen onlyGovernance {
        require(block.timestamp >= unFreezeTime, "UNFREEZE_NOT_ALLOWED_YET");

        // Update state.
        stateFrozen = false;

        // Increment roots to invalidate them, w/o losing information.
        vaultRoot += 1;
        orderRoot += 1;

        // Log event.
        emit LogUnFrozen();
    }
}

contract ProxyStorage is GovernanceStorage {
    // NOLINTNEXTLINE: naming-convention uninitialized-state.
    mapping(address => bytes32) internal initializationHash_DEPRECATED;

    // The time after which we can switch to the implementation.
    // Hash(implementation, data, finalize) => time.
    mapping(bytes32 => uint256) internal enabledTime;

    // A central storage of the flags whether implementation has been initialized.
    // Note - it can be used flexibly enough to accommodate multiple levels of initialization
    // (i.e. using different key salting schemes for different initialization levels).
    mapping(bytes32 => bool) internal initialized;
}

library StarkExTypes {
    // Structure representing a list of verifiers (validity/availability).
    // A statement is valid only if all the verifiers in the list agree on it.
    // Adding a verifier to the list is immediate - this is used for fast resolution of
    // any soundness issues.
    // Removing from the list is time-locked, to ensure that any user of the system
    // not content with the announced removal has ample time to leave the system before it is
    // removed.
    struct ApprovalChainData {
        address[] list;
        // Represents the time after which the verifier with the given address can be removed.
        // Removal of the verifier with address A is allowed only in the case the value
        // of unlockedForRemovalTime[A] != 0 and unlockedForRemovalTime[A] < (current time).
        mapping(address => uint256) unlockedForRemovalTime;
    }
}

contract MainStorage is ProxyStorage {
    uint256 internal constant LAYOUT_LENGTH = 2**64;

    address escapeVerifierAddress; // NOLINT: constable-states.

    // Global dex-frozen flag.
    bool stateFrozen; // NOLINT: constable-states.

    // Time when unFreeze can be successfully called (UNFREEZE_DELAY after freeze).
    uint256 unFreezeTime; // NOLINT: constable-states.

    // Pending deposits.
    // A map STARK key => asset id => vault id => quantized amount.
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) pendingDeposits;

    // Cancellation requests.
    // A map STARK key => asset id => vault id => request timestamp.
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) cancellationRequests;

    // Pending withdrawals.
    // A map STARK key => asset id => quantized amount.
    mapping(uint256 => mapping(uint256 => uint256)) pendingWithdrawals;

    // vault_id => escape used boolean.
    mapping(uint256 => bool) escapesUsed;

    // Number of escapes that were performed when frozen.
    uint256 escapesUsedCount; // NOLINT: constable-states.

    // NOTE: fullWithdrawalRequests is deprecated, and replaced by forcedActionRequests.
    // NOLINTNEXTLINE naming-convention.
    mapping(uint256 => mapping(uint256 => uint256)) fullWithdrawalRequests_DEPRECATED;

    // State sequence number.
    uint256 sequenceNumber; // NOLINT: constable-states uninitialized-state.

    // Vaults Tree Root & Height.
    uint256 vaultRoot; // NOLINT: constable-states uninitialized-state.
    uint256 vaultTreeHeight; // NOLINT: constable-states uninitialized-state.

    // Order Tree Root & Height.
    uint256 orderRoot; // NOLINT: constable-states uninitialized-state.
    uint256 orderTreeHeight; // NOLINT: constable-states uninitialized-state.

    // True if and only if the address is allowed to add tokens.
    mapping(address => bool) tokenAdmins;

    // This mapping is no longer in use, remains for backwards compatibility.
    mapping(address => bool) userAdmins_DEPRECATED; // NOLINT: naming-convention.

    // True if and only if the address is an operator (allowed to update state).
    mapping(address => bool) operators;

    // Mapping of contract ID to asset data.
    mapping(uint256 => bytes) assetTypeToAssetInfo; // NOLINT: uninitialized-state.

    // Mapping of registered contract IDs.
    mapping(uint256 => bool) registeredAssetType; // NOLINT: uninitialized-state.

    // Mapping from contract ID to quantum.
    mapping(uint256 => uint256) assetTypeToQuantum; // NOLINT: uninitialized-state.

    // This mapping is no longer in use, remains for backwards compatibility.
    mapping(address => uint256) starkKeys_DEPRECATED; // NOLINT: naming-convention.

    // Mapping from STARK public key to the Ethereum public key of its owner.
    mapping(uint256 => address) ethKeys; // NOLINT: uninitialized-state.

    // Timelocked state transition and availability verification chain.
    StarkExTypes.ApprovalChainData verifiersChain;
    StarkExTypes.ApprovalChainData availabilityVerifiersChain;

    // Batch id of last accepted proof.
    uint256 lastBatchId; // NOLINT: constable-states uninitialized-state.

    // Mapping between sub-contract index to sub-contract address.
    mapping(uint256 => address) subContracts; // NOLINT: uninitialized-state.

    mapping(uint256 => bool) permissiveAssetType_DEPRECATED; // NOLINT: naming-convention.
    // ---- END OF MAIN STORAGE AS DEPLOYED IN STARKEX2.0 ----

    // Onchain-data version configured for the system.
    uint256 onchainDataVersion; // NOLINT: constable-states uninitialized-state.

    // Counter of forced action request in block. The key is the block number.
    mapping(uint256 => uint256) forcedRequestsInBlock;

    // ForcedAction requests: actionHash => requestTime.
    mapping(bytes32 => uint256) forcedActionRequests;

    // Mapping for timelocked actions.
    // A actionKey => activation time.
    mapping(bytes32 => uint256) actionsTimeLock;

    // Append only list of requested forced action hashes.
    bytes32[] actionHashList;

    // Reserved storage space for Extensibility.
    // Every added MUST be added above the end gap, and the __endGap size must be reduced
    // accordingly.
    // NOLINTNEXTLINE: naming-convention.
    uint256[LAYOUT_LENGTH - 37] private __endGap; // __endGap complements layout to LAYOUT_LENGTH.
}

abstract contract MOperator {
    function isOperator(address testedOperator) public view virtual returns (bool);

    modifier onlyOperator() {
        require(isOperator(msg.sender), "ONLY_OPERATOR");
        _;
    }

    function registerOperator(address newOperator) external virtual;

    function unregisterOperator(address removedOperator) external virtual;
}

abstract contract Operator is MainStorage, MGovernance, MOperator {
    event LogOperatorAdded(address operator);
    event LogOperatorRemoved(address operator);

    function initialize() internal {
        operators[msg.sender] = true;
        emit LogOperatorAdded(msg.sender);
    }

    function registerOperator(address newOperator) external override onlyGovernance {
        operators[newOperator] = true;
        emit LogOperatorAdded(newOperator);
    }

    function unregisterOperator(address removedOperator) external override onlyGovernance {
        operators[removedOperator] = false;
        emit LogOperatorRemoved(removedOperator);
    }

    function isOperator(address testedOperator) public view override returns (bool) {
        return operators[testedOperator];
    }
}

interface Identity {
    /*
      Allows a caller, typically another contract,
      to ensure that the provided address is of the expected type and version.
    */
    function identify() external pure returns (string memory);
}

interface SubContractor is Identity {
    function initialize(bytes calldata data) external;

    function initializerSize() external view returns (uint256);
}

contract GovernanceStorage {
    struct GovernanceInfoStruct {
        mapping(address => bool) effectiveGovernors;
        address candidateGovernor;
        bool initialized;
    }

    // A map from a Governor tag to its own GovernanceInfoStruct.
    mapping(string => GovernanceInfoStruct) internal governanceInfo;
}

abstract contract MGovernance {
    function isGovernor(address testGovernor) internal view virtual returns (bool);

    /*
      Allows calling the function only by a Governor.
    */
    modifier onlyGovernance() {
        require(isGovernor(msg.sender), "ONLY_GOVERNANCE");
        _;
    }
}

abstract contract Governance is GovernanceStorage, MGovernance {
    event LogNominatedGovernor(address nominatedGovernor);
    event LogNewGovernorAccepted(address acceptedGovernor);
    event LogRemovedGovernor(address removedGovernor);
    event LogNominationCancelled();

    /*
      Returns a string which uniquely identifies the type of the governance mechanism.
    */
    function getGovernanceTag() internal pure virtual returns (string memory);

    /*
      Returns the GovernanceInfoStruct associated with the governance tag.
    */
    function contractGovernanceInfo() internal view returns (GovernanceInfoStruct storage) {
        string memory tag = getGovernanceTag();
        GovernanceInfoStruct storage gub = governanceInfo[tag];
        require(gub.initialized, "NOT_INITIALIZED");
        return gub;
    }

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
        string memory tag = getGovernanceTag();
        GovernanceInfoStruct storage gub = governanceInfo[tag];
        require(!gub.initialized, "ALREADY_INITIALIZED");
        gub.initialized = true; // to ensure addGovernor() won't fail.
        // Add the initial governer.
        addGovernor(msg.sender);
    }

    function isGovernor(address testGovernor) internal view override returns (bool) {
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        return gub.effectiveGovernors[testGovernor];
    }

    /*
      Cancels the nomination of a governor candidate.
    */
    function cancelNomination() internal onlyGovernance {
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        gub.candidateGovernor = address(0x0);
        emit LogNominationCancelled();
    }

    function nominateNewGovernor(address newGovernor) internal onlyGovernance {
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        require(!isGovernor(newGovernor), "ALREADY_GOVERNOR");
        gub.candidateGovernor = newGovernor;
        emit LogNominatedGovernor(newGovernor);
    }

    /*
      The addGovernor is called in two cases:
      1. by acceptGovernance when a new governor accepts its role.
      2. by initGovernance to add the initial governor.
      The difference is that the init path skips the nominate step
      that would fail because of the onlyGovernance modifier.
    */
    function addGovernor(address newGovernor) private {
        require(!isGovernor(newGovernor), "ALREADY_GOVERNOR");
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        gub.effectiveGovernors[newGovernor] = true;
    }

    function acceptGovernance() internal {
        // The new governor was proposed as a candidate by the current governor.
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        require(msg.sender == gub.candidateGovernor, "ONLY_CANDIDATE_GOVERNOR");

        // Update state.
        addGovernor(gub.candidateGovernor);
        gub.candidateGovernor = address(0x0);

        // Send a notification about the change of governor.
        emit LogNewGovernorAccepted(msg.sender);
    }

    /*
      Remove a governor from office.
    */
    function removeGovernor(address governorForRemoval) internal onlyGovernance {
        require(msg.sender != governorForRemoval, "GOVERNOR_SELF_REMOVE");
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        require(isGovernor(governorForRemoval), "NOT_GOVERNOR");
        gub.effectiveGovernors[governorForRemoval] = false;
        emit LogRemovedGovernor(governorForRemoval);
    }
}

contract MainGovernance is Governance {
    // The tag is the sting key that is used in the Governance storage mapping.
    string public constant MAIN_GOVERNANCE_INFO_TAG = "StarkEx.Main.2019.GovernorsInformation";

    function getGovernanceTag() internal pure override returns (string memory tag) {
        tag = MAIN_GOVERNANCE_INFO_TAG;
    }

    function mainIsGovernor(address testGovernor) external view returns (bool) {
        return isGovernor(testGovernor);
    }

    function mainNominateNewGovernor(address newGovernor) external {
        nominateNewGovernor(newGovernor);
    }

    function mainRemoveGovernor(address governorForRemoval) external {
        removeGovernor(governorForRemoval);
    }

    function mainAcceptGovernance() external {
        acceptGovernance();
    }

    function mainCancelNomination() external {
        cancelNomination();
    }
}

contract StarkExState is
    MainGovernance,
    SubContractor,
    Operator,
    Freezable,
    AcceptModifications,
    TokenQuantization,
    StarkExForcedActionState,
    StateRoot,
    Escapes,
    UpdateState
{
    uint256 constant INITIALIZER_SIZE = 9 * 32; // 2 * address + 6 * uint256 + 1 * bool = 288 bytes.

    struct InitializationArgStruct {
        address escapeVerifierAddress;
        uint256 sequenceNumber;
        uint256 vaultRoot;
        uint256 orderRoot;
        uint256 vaultTreeHeight;
        uint256 orderTreeHeight;
        uint256 onchainDataVersionValue;
        bool strictVaultBalancePolicy;
        address orderRegistryAddress;
    }

    /*
      Initialization flow:
      1. Extract initialization parameters from data.
      2. Call internalInitializer with those parameters.
    */
    function initialize(bytes calldata data) external virtual override {
        // This initializer sets roots etc. It must not be applied twice.
        // I.e. it can run only when the state is still empty.
        require(vaultRoot == 0, "STATE_ALREADY_INITIALIZED");
        require(vaultTreeHeight == 0, "STATE_ALREADY_INITIALIZED");
        require(orderRoot == 0, "STATE_ALREADY_INITIALIZED");
        require(orderTreeHeight == 0, "STATE_ALREADY_INITIALIZED");

        require(data.length == INITIALIZER_SIZE, "INCORRECT_INIT_DATA_SIZE_256");

        // Copies initializer values into initValues.
        InitializationArgStruct memory initValues;
        bytes memory _data = data;
        assembly {
            initValues := add(32, _data)
        }

        initGovernance();
        Operator.initialize();
        StateRoot.initialize(
            initValues.sequenceNumber,
            initValues.vaultRoot,
            initValues.orderRoot,
            initValues.vaultTreeHeight,
            initValues.orderTreeHeight
        );
        Escapes.initialize(initValues.escapeVerifierAddress);
        onchainDataVersion = initValues.onchainDataVersionValue;
        strictVaultBalancePolicy = initValues.strictVaultBalancePolicy;
        orderRegistryAddress = initValues.orderRegistryAddress;
    }

    /*
      The call to initializerSize is done from MainDispatcherBase using delegatecall,
      thus the existing state is already accessible.
    */
    function initializerSize() external view virtual override returns (uint256) {
        return INITIALIZER_SIZE;
    }

    function identify() external pure override returns (string memory) {
        return "StarkWare_StarkExState_2021_1";
    }
}