// SPDX-License-Identifier: Unknown
pragma solidity 0.6.12;

contract VerifyFactChain is MainStorage {
    function verifyFact(
        ApprovalChainData storage chain,
        bytes32 fact,
        string memory noVerifiersErrorMessage,
        string memory invalidFactErrorMessage
    ) internal view {
        address[] storage verifiers = chain.verifiers;
        uint256 n_entries = verifiers.length;
        require(n_entries > 0, noVerifiersErrorMessage);
        for (uint256 i = 0; i < n_entries; i++) {
            // NOLINTNEXTLINE: calls-loop.
            require(IFactRegistry(verifiers[i]).isValid(fact), invalidFactErrorMessage);
        }
    }
}

contract ProgramOutputOffsets {
    // The following constants are offsets of data expected in the program output.
    // The offsets here are of the fixed fields.
    uint256 internal constant PROG_OUT_GENERAL_CONFIG_HASH = 0;
    uint256 internal constant PROG_OUT_DATA_AVAILABILTY_MODE = 1;
    uint256 internal constant PROG_OUT_N_ASSET_CONFIGS = 2;
    uint256 internal constant PROG_OUT_ASSET_CONFIG_HASHES = 3;

    /*
      Additional mandatory fields of a single word:
      - Previous state size         3
      - New state size              4
      - Vault tree height           5
      - Order tree height           6
      - Expiration timestamp        7
      - No. of Modifications        8.
    */
    uint256 internal constant PROG_OUT_N_WORDS_MIN_SIZE = 9;

    uint256 internal constant PROG_OUT_N_WORDS_PER_ASSET_CONFIG = 2;
    uint256 internal constant PROG_OUT_N_WORDS_PER_MODIFICATION = 3;

    uint256 internal constant ASSET_CONFIG_OFFSET_ASSET_ID = 0;
    uint256 internal constant ASSET_CONFIG_OFFSET_CONFIG_HASH = 1;

    uint256 internal constant MODIFICATIONS_OFFSET_STARKKEY = 0;
    uint256 internal constant MODIFICATIONS_OFFSET_POS_ID = 1;
    uint256 internal constant MODIFICATIONS_OFFSET_BIASED_DIFF = 2;

    uint256 internal constant STATE_OFFSET_VAULTS_ROOT = 0;
    uint256 internal constant STATE_OFFSET_VAULTS_HEIGHT = 1;
    uint256 internal constant STATE_OFFSET_ORDERS_ROOT = 2;
    uint256 internal constant STATE_OFFSET_ORDERS_HEIGHT = 3;
    uint256 internal constant STATE_OFFSET_N_FUNDING = 4;
    uint256 internal constant STATE_OFFSET_FUNDING = 5;

    // Data availability mode.
    uint256 internal constant VALIDIUM_MODE = 0;
    uint256 internal constant ROLLUP_MODE = 1;

    // The following constants are offsets of data expected in the application data.
    uint256 internal constant APP_DATA_BATCH_ID_OFFSET = 0;
    uint256 internal constant APP_DATA_PREVIOUS_BATCH_ID_OFFSET = 1;
    uint256 internal constant APP_DATA_N_CONDITIONAL_TRANSFER = 2;
    uint256 internal constant APP_DATA_CONDITIONAL_TRANSFER_DATA_OFFSET = 3;
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

abstract contract UpdatePerpetualState is
    PerpetualStorage,
    PerpetualConstants,
    MForcedTradeActionState,
    MForcedWithdrawalActionState,
    VerifyFactChain,
    MAcceptModifications,
    MFreezable,
    MOperator,
    ProgramOutputOffsets
{
    event LogUpdateState(uint256 sequenceNumber, uint256 batchId);

    event LogStateTransitionFact(bytes32 stateTransitionFact);

    enum ForcedAction {
        Withdrawal,
        Trade
    }

    struct ProgramOutputMarkers {
        uint256 globalConfigurationHash;
        uint256 nAssets;
        uint256 assetConfigOffset;
        uint256 prevSharedStateSize;
        uint256 prevSharedStateOffset;
        uint256 newSharedStateSize;
        uint256 newSharedStateOffset;
        uint256 newVaultsRoot;
        uint256 newVaultsHeight;
        uint256 newOrdersRoot;
        uint256 newOrdersHeight;
        uint256 newSystemTime;
        uint256 dataAvailabilityMode;
        uint256 expirationTimestamp;
        uint256 nModifications;
        uint256 modificationsOffset;
        uint256 forcedActionsSize;
        uint256 nForcedActions;
        uint256 forcedActionsOffset;
        uint256 nConditions;
        uint256 conditionsOffset;
    }

    function updateState(uint256[] calldata programOutput, uint256[] calldata applicationData)
        external
        notFrozen
        onlyOperator
    {
        ProgramOutputMarkers memory outputMarkers = parseProgramOutput(programOutput);
        require(
            outputMarkers.expirationTimestamp < 2**PERPETUAL_TIMESTAMP_BITS,
            "Expiration timestamp is out of range."
        );

        require(
            outputMarkers.newSystemTime > (block.timestamp - PERPETUAL_SYSTEM_TIME_LAG_BOUND),
            "SYSTEM_TIME_OUTDATED"
        );

        require(
            outputMarkers.newSystemTime < (block.timestamp + PERPETUAL_SYSTEM_TIME_ADVANCE_BOUND),
            "SYSTEM_TIME_INVALID"
        );

        require(
            outputMarkers.expirationTimestamp > block.timestamp / 3600,
            "BATCH_TIMESTAMP_EXPIRED"
        );
        require(
            outputMarkers.newVaultsHeight ==
                programOutput[outputMarkers.prevSharedStateOffset + STATE_OFFSET_VAULTS_HEIGHT],
            "INCONSISTENT_POSITION_TREE_HEIGHT"
        );
        require(
            outputMarkers.newOrdersHeight ==
                programOutput[outputMarkers.prevSharedStateOffset + STATE_OFFSET_ORDERS_HEIGHT],
            "INCONSISTENT_ORDER_TREE_HEIGHT"
        );

        validateConfigHashes(programOutput, outputMarkers);

        // Caclulate previous shared state hash, and compare with stored one.
        bytes32 prevStateHash = keccak256(
            abi.encodePacked(
                programOutput[outputMarkers.prevSharedStateOffset:outputMarkers
                    .prevSharedStateOffset + outputMarkers.prevSharedStateSize]
            )
        );

        require(prevStateHash == sharedStateHash, "INVALID_PREVIOUS_SHARED_STATE");

        require(
            applicationData[APP_DATA_PREVIOUS_BATCH_ID_OFFSET] == lastBatchId,
            "WRONG_PREVIOUS_BATCH_ID"
        );

        bytes32 stateTransitionFact;
        if (outputMarkers.dataAvailabilityMode == VALIDIUM_MODE) {
            stateTransitionFact = keccak256(abi.encodePacked(programOutput));
        } else {
            require(
                outputMarkers.dataAvailabilityMode == ROLLUP_MODE,
                "UNSUPPORTED_DATA_AVAILABILITY_MODE"
            );
            require(
                programOutput.length >=
                    outputMarkers.forcedActionsOffset +
                        OnchainDataFactTreeEncoder.ONCHAIN_DATA_FACT_ADDITIONAL_WORDS,
                "programOutput does not contain all required fields."
            );
            stateTransitionFact = OnchainDataFactTreeEncoder.encodeFactWithOnchainData(
                programOutput[:programOutput.length -
                    OnchainDataFactTreeEncoder.ONCHAIN_DATA_FACT_ADDITIONAL_WORDS],
                OnchainDataFactTreeEncoder.DataAvailabilityFact({
                    onchainDataHash: programOutput[programOutput.length - 2],
                    onchainDataSize: programOutput[programOutput.length - 1]
                })
            );
        }

        emit LogStateTransitionFact(stateTransitionFact);

        verifyFact(
            verifiersChain,
            stateTransitionFact,
            "NO_STATE_TRANSITION_VERIFIERS",
            "NO_STATE_TRANSITION_PROOF"
        );

        if (outputMarkers.dataAvailabilityMode == VALIDIUM_MODE) {
            bytes32 availabilityFact = keccak256(
                abi.encodePacked(
                    outputMarkers.newVaultsRoot,
                    outputMarkers.newVaultsHeight,
                    outputMarkers.newOrdersRoot,
                    outputMarkers.newOrdersHeight,
                    sequenceNumber + 1
                )
            );
            verifyFact(
                availabilityVerifiersChain,
                availabilityFact,
                "NO_AVAILABILITY_VERIFIERS",
                "NO_AVAILABILITY_PROOF"
            );
        }

        performUpdateState(programOutput, outputMarkers, applicationData);
    }

    function validateConfigHashes(
        uint256[] calldata programOutput,
        ProgramOutputMarkers memory markers
    ) internal view {
        require(globalConfigurationHash != bytes32(0), "GLOBAL_CONFIGURATION_NOT_SET");
        require(
            globalConfigurationHash == bytes32(markers.globalConfigurationHash),
            "GLOBAL_CONFIGURATION_MISMATCH"
        );

        uint256 offset = markers.assetConfigOffset;
        for (uint256 i = 0; i < markers.nAssets; i++) {
            uint256 assetId = programOutput[offset + ASSET_CONFIG_OFFSET_ASSET_ID];
            bytes32 assetConfigHash = bytes32(
                programOutput[offset + ASSET_CONFIG_OFFSET_CONFIG_HASH]
            );
            require(configurationHash[assetId] == assetConfigHash, "ASSET_CONFIGURATION_MISMATCH");
            offset += PROG_OUT_N_WORDS_PER_ASSET_CONFIG;
        }
    }

    function parseProgramOutput(uint256[] calldata programOutput)
        internal
        pure
        returns (ProgramOutputMarkers memory)
    {
        require(
            programOutput.length >= PROG_OUT_N_WORDS_MIN_SIZE,
            "programOutput does not contain all required fields."
        );

        ProgramOutputMarkers memory markers; // NOLINT: uninitialized-local.
        markers.globalConfigurationHash = programOutput[PROG_OUT_GENERAL_CONFIG_HASH];
        markers.dataAvailabilityMode = programOutput[PROG_OUT_DATA_AVAILABILTY_MODE];
        markers.nAssets = programOutput[PROG_OUT_N_ASSET_CONFIGS];
        require(markers.nAssets < 2**16, "ILLEGAL_NUMBER_OF_ASSETS");

        uint256 offset = PROG_OUT_ASSET_CONFIG_HASHES;
        markers.assetConfigOffset = offset;
        offset += markers.nAssets * PROG_OUT_N_WORDS_PER_ASSET_CONFIG;
        require(
            programOutput.length >= offset + 1, // Adding +1 for the next mandatory field.
            "programOutput invalid size (nAssetConfig)"
        );

        markers.prevSharedStateSize = programOutput[offset++];
        markers.prevSharedStateOffset = offset;

        offset += markers.prevSharedStateSize;
        require(
            programOutput.length >= offset + 1, // Adding +1 for the next mandatory field.
            "programOutput invalid size (prevState)"
        );

        markers.newSharedStateSize = programOutput[offset++];
        markers.newSharedStateOffset = offset;

        offset += markers.newSharedStateSize;
        require(
            programOutput.length >= offset + 2, // Adding +2 for the next mandatory fields.
            "programOutput invalid size (newState)"
        );

        // System time is the last field in the state.
        markers.newSystemTime = programOutput[offset - 1];

        markers.newVaultsRoot = programOutput[
            markers.newSharedStateOffset + STATE_OFFSET_VAULTS_ROOT
        ];
        markers.newVaultsHeight = programOutput[
            markers.newSharedStateOffset + STATE_OFFSET_VAULTS_HEIGHT
        ];
        markers.newOrdersRoot = programOutput[
            markers.newSharedStateOffset + STATE_OFFSET_ORDERS_ROOT
        ];
        markers.newOrdersHeight = programOutput[
            markers.newSharedStateOffset + STATE_OFFSET_ORDERS_HEIGHT
        ];

        markers.expirationTimestamp = programOutput[offset++];

        markers.nModifications = programOutput[offset++];
        markers.modificationsOffset = offset;
        offset += markers.nModifications * PROG_OUT_N_WORDS_PER_MODIFICATION;

        markers.forcedActionsSize = programOutput[offset++];
        markers.nForcedActions = programOutput[offset++];
        markers.forcedActionsOffset = offset;
        offset += markers.forcedActionsSize;

        markers.nConditions = programOutput[offset++];
        markers.conditionsOffset = offset;
        offset += markers.nConditions;

        // In ROLLUP_MODE the Onchain Data info appears at the end of programOutput.
        if (markers.dataAvailabilityMode == ROLLUP_MODE) {
            offset += OnchainDataFactTreeEncoder.ONCHAIN_DATA_FACT_ADDITIONAL_WORDS;
        }
        require(
            programOutput.length == offset,
            "programOutput invalid size (mods/forced/conditions)"
        );
        return markers;
    }

    function performUpdateState(
        uint256[] calldata programOutput,
        ProgramOutputMarkers memory markers,
        uint256[] calldata applicationData
    ) internal {
        sharedStateHash = keccak256(
            abi.encodePacked(
                programOutput[markers.newSharedStateOffset:markers.newSharedStateOffset +
                    markers.newSharedStateSize]
            )
        );

        sequenceNumber += 1;
        uint256 batchId = applicationData[APP_DATA_BATCH_ID_OFFSET];
        lastBatchId = batchId;

        sendModifications(programOutput, markers, applicationData);

        verifyConditionalTransfers(programOutput, markers, applicationData);

        clearForcedActionsFlags(programOutput, markers);

        emit LogUpdateState(sequenceNumber, batchId);
    }

    /*
      Goes through the program output forced actions section,
      extract each forced action, and if valid and its flag exists, clears it.
      If invalid, or not flag not exist - revert.
    */
    function clearForcedActionsFlags(
        uint256[] calldata programOutput,
        ProgramOutputMarkers memory markers
    ) private {
        uint256 offset = markers.forcedActionsOffset;
        for (uint256 i = 0; i < markers.nForcedActions; i++) {
            ForcedAction forcedActionType = ForcedAction(programOutput[offset++]);
            if (forcedActionType == ForcedAction.Withdrawal) {
                offset = clearForcedWithdrawal(programOutput, offset);
            } else if (forcedActionType == ForcedAction.Trade) {
                offset = clearForcedTrade(programOutput, offset);
            } else {
                revert("UNKNOWN_FORCED_ACTION_TYPE");
            }
        }
        // Ensure all sizes are matching (this is not checked in parsing).
        require(markers.forcedActionsOffset + markers.forcedActionsSize == offset, "SIZE_MISMATCH");
    }

    function clearForcedWithdrawal(uint256[] calldata programOutput, uint256 offset)
        private
        returns (uint256)
    {
        uint256 starkKey = programOutput[offset++];
        uint256 vaultId = programOutput[offset++];
        uint256 quantizedAmount = programOutput[offset++];
        clearForcedWithdrawalRequest(starkKey, vaultId, quantizedAmount);
        return offset;
    }

    function clearForcedTrade(uint256[] calldata programOutput, uint256 offset)
        private
        returns (uint256)
    {
        uint256 starkKeyA = programOutput[offset++];
        uint256 starkKeyB = programOutput[offset++];
        uint256 vaultIdA = programOutput[offset++];
        uint256 vaultIdB = programOutput[offset++];
        // CollateralAssetId Not taken from progOutput. We use systemAssetType.
        uint256 syntheticAssetId = programOutput[offset++];
        uint256 amountCollateral = programOutput[offset++];
        uint256 amountSynthetic = programOutput[offset++];
        bool aIsBuyingSynthetic = (programOutput[offset++] != 0);
        uint256 nonce = programOutput[offset++];
        clearForcedTradeRequest(
            starkKeyA,
            starkKeyB,
            vaultIdA,
            vaultIdB,
            systemAssetType,
            syntheticAssetId,
            amountCollateral,
            amountSynthetic,
            aIsBuyingSynthetic,
            nonce
        );
        return offset;
    }

    function verifyConditionalTransfers(
        uint256[] calldata programOutput,
        ProgramOutputMarkers memory markers,
        uint256[] calldata applicationData
    ) private view {
        require(applicationData.length >= APP_DATA_N_CONDITIONAL_TRANSFER, "APP_DATA_TOO_SHORT");

        require(
            applicationData[APP_DATA_N_CONDITIONAL_TRANSFER] == markers.nConditions,
            "N_CONDITIONS_MISMATCH"
        );

        require(
            applicationData.length >=
                APP_DATA_CONDITIONAL_TRANSFER_DATA_OFFSET +
                    markers.nConditions *
                    APP_DATA_N_WORDS_PER_CONDITIONAL_TRANSFER,
            "BAD_APP_DATA_SIZE"
        );

        uint256 conditionsOffset = markers.conditionsOffset;
        uint256 preImageOffset = APP_DATA_CONDITIONAL_TRANSFER_DATA_OFFSET;

        // Conditional Transfers appear after all other modifications.
        for (uint256 i = 0; i < markers.nConditions; i++) {
            address transferRegistry = address(applicationData[preImageOffset]);
            bytes32 transferFact = bytes32(applicationData[preImageOffset + 1]);
            uint256 condition = programOutput[conditionsOffset];

            // The condition is the 250 LS bits of keccak256 of the fact registry & fact.
            require(
                condition ==
                    uint256(keccak256(abi.encodePacked(transferRegistry, transferFact))) & MASK_250,
                "Condition mismatch."
            );
            // NOLINTNEXTLINE: low-level-calls-loop reentrancy-events.
            (bool success, bytes memory returndata) = transferRegistry.staticcall(
                abi.encodeWithSignature("isValid(bytes32)", transferFact)
            );
            require(success && returndata.length == 32, "BAD_FACT_REGISTRY_CONTRACT");
            require(
                abi.decode(returndata, (bool)),
                "Condition for the conditional transfer was not met."
            );
            conditionsOffset += 1;
            preImageOffset += APP_DATA_N_WORDS_PER_CONDITIONAL_TRANSFER;
        }
    }

    function sendModifications(
        uint256[] calldata programOutput,
        ProgramOutputMarkers memory markers,
        uint256[] calldata /*applicationData*/
    ) private {
        uint256 assetId = systemAssetType;
        require(assetId < K_MODULUS, "Asset id >= PRIME");

        uint256 offset = markers.modificationsOffset;
        for (uint256 i = 0; i < markers.nModifications; i++) {
            uint256 starkKey = programOutput[offset + MODIFICATIONS_OFFSET_STARKKEY];
            uint256 vaultId = programOutput[offset + MODIFICATIONS_OFFSET_POS_ID];
            uint256 biasedDiff = programOutput[offset + MODIFICATIONS_OFFSET_BIASED_DIFF];
            // Biased representation.
            // biased_delta is in range [0, 2**65), where 2**64 means 0 change.
            // The effective difference is biased_delta - 2**64.
            require(biasedDiff < (1 << 65), "Illegal Balance Diff");
            int256 balanceDiff = int256(biasedDiff - (1 << 64));

            require(starkKey < K_MODULUS, "Stark key >= PRIME");

            if (balanceDiff > 0) {
                // This is a deposit.
                acceptDeposit(starkKey, vaultId, assetId, uint256(balanceDiff));
            } else if (balanceDiff < 0) {
                // This is a withdrawal.
                acceptWithdrawal(starkKey, assetId, uint256(-balanceDiff));
            }
            offset += PROG_OUT_N_WORDS_PER_MODIFICATION;
        }
    }
}

abstract contract PerpetualEscapes is PerpetualStorage, MAcceptModifications, MFreezable {
    function initialize(address escapeVerifier) internal {
        escapeVerifierAddress = escapeVerifier;
    }

    /*
      Escape when the contract is frozen.
    */
    function escape(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount
    ) external onlyFrozen {
        require(!escapesUsed[vaultId], "ESCAPE_ALREADY_USED");

        // Escape can be used only once.
        escapesUsed[vaultId] = true;
        escapesUsedCount += 1;

        bytes32 claimHash = keccak256(
            abi.encode(starkKey, quantizedAmount, sharedStateHash, vaultId)
        );
        IFactRegistry escapeVerifier = IFactRegistry(escapeVerifierAddress);
        require(escapeVerifier.isValid(claimHash), "ESCAPE_LACKS_PROOF");

        allowWithdrawal(starkKey, systemAssetType, quantizedAmount);
    }
}

abstract contract MStateRoot {
    function getValidiumVaultRoot() public view virtual returns (uint256);

    function getValidiumTreeHeight() public view virtual returns (uint256);

    function getRollupVaultRoot() public view virtual returns (uint256);

    function getRollupTreeHeight() public view virtual returns (uint256);

    /*
      Returns true iff vaultId is in the valid vault ids range,
      i.e. could appear in either the validium or rollup vaults trees.
    */
    function isVaultInRange(uint256 vaultId) internal view virtual returns (bool);

    /*
      Returns true if vaultId is a valid validium vault id.

      Note: when this function returns false it might mean that vaultId is invalid and does not
      guarantee that vaultId is a valid rollup vault id.
    */
    function isValidiumVault(uint256 vaultId) internal view virtual returns (bool);

    /*
      Returns true if vaultId is a valid rollup vault id.

      Note: when this function returns false it might mean that vaultId is invalid and does not
      guarantee that vaultId is a valid validium vault id.
    */
    function isRollupVault(uint256 vaultId) internal view virtual returns (bool);

    /*
      Given a valid vaultId, returns its leaf index in the validium/rollup tree.

      Note: this function does not assert the validity of vaultId, make sure to explicitly assert it
      when required.
    */
    function getVaultLeafIndex(uint256 vaultId) internal pure virtual returns (uint256);
}

contract StateRoot is MainStorage, LibConstants, MStateRoot {
    function initialize(
        uint256 initialSequenceNumber,
        uint256 initialValidiumVaultRoot,
        uint256 initialRollupVaultRoot,
        uint256 initialOrderRoot,
        uint256 initialValidiumTreeHeight,
        uint256 initialRollupTreeHeight,
        uint256 initialOrderTreeHeight
    ) internal {
        sequenceNumber = initialSequenceNumber;
        validiumVaultRoot = initialValidiumVaultRoot;
        rollupVaultRoot = initialRollupVaultRoot;
        orderRoot = initialOrderRoot;
        validiumTreeHeight = initialValidiumTreeHeight;
        rollupTreeHeight = initialRollupTreeHeight;
        orderTreeHeight = initialOrderTreeHeight;
    }

    function getValidiumVaultRoot() public view override returns (uint256) {
        return validiumVaultRoot;
    }

    function getValidiumTreeHeight() public view override returns (uint256) {
        return validiumTreeHeight;
    }

    function getRollupVaultRoot() public view override returns (uint256) {
        return rollupVaultRoot;
    }

    function getRollupTreeHeight() public view override returns (uint256) {
        return rollupTreeHeight;
    }

    function getOrderRoot() external view returns (uint256) {
        return orderRoot;
    }

    function getOrderTreeHeight() external view returns (uint256) {
        return orderTreeHeight;
    }

    function getSequenceNumber() external view returns (uint256) {
        return sequenceNumber;
    }

    function getLastBatchId() external view returns (uint256) {
        return lastBatchId;
    }

    function getGlobalConfigCode() external view returns (uint256) {
        return globalConfigCode;
    }

    function isVaultInRange(uint256 vaultId) internal view override returns (bool) {
        return (isValidiumVault(vaultId) || isRollupVault(vaultId));
    }

    function isValidiumVault(uint256 vaultId) internal view override returns (bool) {
        // Return true iff vaultId is in the validium vaults tree.
        return vaultId < 2**getValidiumTreeHeight();
    }

    function isRollupVault(uint256 vaultId) internal view override returns (bool) {
        // Return true iff vaultId is in the rollup vaults tree.
        uint256 rollupLowerBound = 2**ROLLUP_VAULTS_BIT;
        uint256 rollupUpperBound = rollupLowerBound + 2**getRollupTreeHeight();
        return (rollupLowerBound <= vaultId && vaultId < rollupUpperBound);
    }

    function getVaultLeafIndex(uint256 vaultId) internal pure override returns (uint256) {
        // Return the index of vaultId leaf in its tree, which doesn't include the rollup bit flag.
        return (vaultId & (2**ROLLUP_VAULTS_BIT - 1));
    }
}

abstract contract MForcedWithdrawalActionState {
    function forcedWithdrawActionHash(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount
    ) internal pure virtual returns (bytes32);

    function clearForcedWithdrawalRequest(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount
    ) internal virtual;

    // NOLINTNEXTLINE: external-function.
    function getForcedWithdrawalRequest(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount
    ) public view virtual returns (uint256 res);

    function setForcedWithdrawalRequest(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount,
        bool premiumCost
    ) internal virtual;
}

contract ForcedWithdrawalActionState is PerpetualStorage, ActionHash, MForcedWithdrawalActionState {
    function forcedWithdrawActionHash(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount
    ) internal pure override returns (bytes32) {
        return getActionHash("FORCED_WITHDRAWAL", abi.encode(starkKey, vaultId, quantizedAmount));
    }

    function clearForcedWithdrawalRequest(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount
    ) internal override {
        bytes32 actionHash = forcedWithdrawActionHash(starkKey, vaultId, quantizedAmount);
        require(forcedActionRequests[actionHash] != 0, "NON_EXISTING_ACTION");
        delete forcedActionRequests[actionHash];
    }

    function getForcedWithdrawalRequest(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount
    ) public view override returns (uint256) {
        // Return request value. Expect zero if the request doesn't exist or has been serviced, and
        // a non-zero value otherwise.
        return forcedActionRequests[forcedWithdrawActionHash(starkKey, vaultId, quantizedAmount)];
    }

    function setForcedWithdrawalRequest(
        uint256 starkKey,
        uint256 vaultId,
        uint256 quantizedAmount,
        bool premiumCost
    ) internal override {
        setActionHash(forcedWithdrawActionHash(starkKey, vaultId, quantizedAmount), premiumCost);
    }
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

abstract contract MForcedTradeActionState {
    function forcedTradeActionHash(
        uint256 starkKeyA,
        uint256 starkKeyB,
        uint256 vaultIdA,
        uint256 vaultIdB,
        uint256 collateralAssetId,
        uint256 syntheticAssetId,
        uint256 amountCollateral,
        uint256 amountSynthetic,
        bool aIsBuyingSynthetic,
        uint256 nonce
    ) internal pure virtual returns (bytes32);

    function clearForcedTradeRequest(
        uint256 starkKeyA,
        uint256 starkKeyB,
        uint256 vaultIdA,
        uint256 vaultIdB,
        uint256 collateralAssetId,
        uint256 syntheticAssetId,
        uint256 amountCollateral,
        uint256 amountSynthetic,
        bool aIsBuyingSynthetic,
        uint256 nonce
    ) internal virtual;

    // NOLINTNEXTLINE: external-function.
    function getForcedTradeRequest(
        uint256 starkKeyA,
        uint256 starkKeyB,
        uint256 vaultIdA,
        uint256 vaultIdB,
        uint256 collateralAssetId,
        uint256 syntheticAssetId,
        uint256 amountCollateral,
        uint256 amountSynthetic,
        bool aIsBuyingSynthetic,
        uint256 nonce
    ) public view virtual returns (uint256 res);

    function setForcedTradeRequest(
        uint256 starkKeyA,
        uint256 starkKeyB,
        uint256 vaultIdA,
        uint256 vaultIdB,
        uint256 collateralAssetId,
        uint256 syntheticAssetId,
        uint256 amountCollateral,
        uint256 amountSynthetic,
        bool aIsBuyingSynthetic,
        uint256 nonce,
        bool premiumCost
    ) internal virtual;
}

contract ForcedTradeActionState is PerpetualStorage, ActionHash, MForcedTradeActionState {
    function forcedTradeActionHash(
        uint256 starkKeyA,
        uint256 starkKeyB,
        uint256 vaultIdA,
        uint256 vaultIdB,
        uint256 collateralAssetId,
        uint256 syntheticAssetId,
        uint256 amountCollateral,
        uint256 amountSynthetic,
        bool aIsBuyingSynthetic,
        uint256 nonce
    ) internal pure override returns (bytes32) {
        return
            getActionHash(
                "FORCED_TRADE",
                abi.encodePacked(
                    starkKeyA,
                    starkKeyB,
                    vaultIdA,
                    vaultIdB,
                    collateralAssetId,
                    syntheticAssetId,
                    amountCollateral,
                    amountSynthetic,
                    aIsBuyingSynthetic,
                    nonce
                )
            );
    }

    function clearForcedTradeRequest(
        uint256 starkKeyA,
        uint256 starkKeyB,
        uint256 vaultIdA,
        uint256 vaultIdB,
        uint256 collateralAssetId,
        uint256 syntheticAssetId,
        uint256 amountCollateral,
        uint256 amountSynthetic,
        bool aIsBuyingSynthetic,
        uint256 nonce
    ) internal override {
        /*
          We don't clear the entry, but set the time to max so that
          it cannot be replayed.
        */
        bytes32 actionHash = forcedTradeActionHash(
            starkKeyA,
            starkKeyB,
            vaultIdA,
            vaultIdB,
            collateralAssetId,
            syntheticAssetId,
            amountCollateral,
            amountSynthetic,
            aIsBuyingSynthetic,
            nonce
        );
        // A cleared ForcedTrade action is marked with ~0 and not zero, to prevent party A from
        // replaying the trade without a new signature from party B.
        require(forcedActionRequests[actionHash] != uint256(~0), "ACTION_ALREADY_CLEARED");
        require(forcedActionRequests[actionHash] != 0, "NON_EXISTING_ACTION");
        forcedActionRequests[actionHash] = uint256(~0);
    }

    function getForcedTradeRequest(
        uint256 starkKeyA,
        uint256 starkKeyB,
        uint256 vaultIdA,
        uint256 vaultIdB,
        uint256 collateralAssetId,
        uint256 syntheticAssetId,
        uint256 amountCollateral,
        uint256 amountSynthetic,
        bool aIsBuyingSynthetic,
        uint256 nonce
    ) public view override returns (uint256) {
        return
            forcedActionRequests[
                forcedTradeActionHash(
                    starkKeyA,
                    starkKeyB,
                    vaultIdA,
                    vaultIdB,
                    collateralAssetId,
                    syntheticAssetId,
                    amountCollateral,
                    amountSynthetic,
                    aIsBuyingSynthetic,
                    nonce
                )
            ];
    }

    function setForcedTradeRequest(
        uint256 starkKeyA,
        uint256 starkKeyB,
        uint256 vaultIdA,
        uint256 vaultIdB,
        uint256 collateralAssetId,
        uint256 syntheticAssetId,
        uint256 amountCollateral,
        uint256 amountSynthetic,
        bool aIsBuyingSynthetic,
        uint256 nonce,
        bool premiumCost
    ) internal override {
        bytes32 actionHash = forcedTradeActionHash(
            starkKeyA,
            starkKeyB,
            vaultIdA,
            vaultIdB,
            collateralAssetId,
            syntheticAssetId,
            amountCollateral,
            amountSynthetic,
            aIsBuyingSynthetic,
            nonce
        );
        // NOLINTNEXTLINE: timestamp.
        require(forcedActionRequests[actionHash] == 0, "FORCED_TRADE_REPLAYED");
        setActionHash(actionHash, premiumCost);
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

    event LogAssetWithdrawalAllowed(uint256 ownerKey, uint256 assetId, uint256 quantizedAmount);

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
        } else if (
            assetId ==
            ((assetId &
                (MASK_240 | NON_UNIQUE_MINTABLE_ASSET_ID_FLAG | MINTABLE_ERC20_ASSET_ID_FLAG)) |
                MINTABLE_ASSET_ID_FLAG)
        ) {
            emit LogMintableWithdrawalAllowed(ownerKey, assetId, quantizedAmount);
        } else {
            // Default case is Non-Mintable ERC721 or ERC1155 asset id.
            // In ERC721 and ERC1155 cases, assetId is not the assetType.
            require(assetId == assetId & MASK_250, "INVALID_ASSET_ID");
            // If withdrawal amount is 1, the asset could be either NFT or SFT. In that case, both
            // NFT and general events will be emitted so that the listened for event is captured.
            // When withdrawal is greater than 1, it must be SFT and only one event will be emitted.
            if (withdrawal <= 1) {
                emit LogNftWithdrawalAllowed(ownerKey, assetId);
            }
            emit LogAssetWithdrawalAllowed(ownerKey, assetId, quantizedAmount);
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
        validiumVaultRoot += 1;
        rollupVaultRoot += 1;
        orderRoot += 1;

        // Log event.
        emit LogUnFrozen();
    }
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

abstract contract StarkExOperator is MainStorage, Operator {
    function initialize() internal {
        getOperators()[msg.sender] = true;
        emit LogOperatorAdded(msg.sender);
    }

    function getOperators() internal view override returns (mapping(address => bool) storage) {
        return operators;
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

struct ApprovalChainData {
    address[] verifiers;
    // Represents the time after which the verifier with the given address can be removed.
    // Removal of the verifier with address A is allowed only in the case the value
    // of verifierAllowedRemovalTime[A] != 0 and verifierAllowedRemovalTime[A] < (current time).
    mapping(address => uint256) verifierAllowedRemovalTime;
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

    // Validium Vaults Tree Root & Height.
    uint256 validiumVaultRoot; // NOLINT: constable-states uninitialized-state.
    uint256 validiumTreeHeight; // NOLINT: constable-states uninitialized-state.

    // Order Tree Root & Height.
    uint256 orderRoot; // NOLINT: constable-states uninitialized-state.
    uint256 orderTreeHeight; // NOLINT: constable-states uninitialized-state.

    // True if and only if the address is allowed to add tokens.
    mapping(address => bool) tokenAdmins;

    // This mapping is no longer in use, remains for backwards compatibility.
    mapping(address => bool) userAdmins_DEPRECATED; // NOLINT: naming-convention.

    // True if and only if the address is an operator (allowed to update state).
    mapping(address => bool) operators; // NOLINT: uninitialized-state.

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
    ApprovalChainData verifiersChain;
    ApprovalChainData availabilityVerifiersChain;

    // Batch id of last accepted proof.
    uint256 lastBatchId; // NOLINT: constable-states uninitialized-state.

    // Mapping between sub-contract index to sub-contract address.
    mapping(uint256 => address) subContracts; // NOLINT: uninitialized-state.

    mapping(uint256 => bool) permissiveAssetType_DEPRECATED; // NOLINT: naming-convention.
    // ---- END OF MAIN STORAGE AS DEPLOYED IN STARKEX2.0 ----

    // Onchain-data version configured for the system.
    uint256 onchainDataVersion_DEPRECATED; // NOLINT: naming-convention constable-states.

    // Counter of forced action request in block. The key is the block number.
    mapping(uint256 => uint256) forcedRequestsInBlock;

    // ForcedAction requests: actionHash => requestTime.
    mapping(bytes32 => uint256) forcedActionRequests;

    // Mapping for timelocked actions.
    // A actionKey => activation time.
    mapping(bytes32 => uint256) actionsTimeLock;

    // Append only list of requested forced action hashes.
    bytes32[] actionHashList;
    // ---- END OF MAIN STORAGE AS DEPLOYED IN STARKEX3.0 ----
    // ---- END OF MAIN STORAGE AS DEPLOYED IN STARKEX4.0 ----

    // Rollup Vaults Tree Root & Height.
    uint256 rollupVaultRoot; // NOLINT: constable-states uninitialized-state.
    uint256 rollupTreeHeight; // NOLINT: constable-states uninitialized-state.

    uint256 globalConfigCode; // NOLINT: constable-states uninitialized-state.

    // Reserved storage space for Extensibility.
    // Every added MUST be added above the end gap, and the __endGap size must be reduced
    // accordingly.
    // NOLINTNEXTLINE: naming-convention.
    uint256[LAYOUT_LENGTH - 40] private __endGap; // __endGap complements layout to LAYOUT_LENGTH.
}

contract PerpetualStorage is MainStorage {
    uint256 systemAssetType; // NOLINT: constable-states uninitialized-state.

    bytes32 public globalConfigurationHash; // NOLINT: constable-states uninitialized-state.

    mapping(uint256 => bytes32) public configurationHash; // NOLINT: uninitialized-state.

    bytes32 sharedStateHash; // NOLINT: constable-states uninitialized-state.

    // Configuration apply time-lock.
    // The delay is held in storage (and not constant)
    // So that it can be modified during upgrade.
    uint256 public configurationDelay; // NOLINT: constable-states.

    // Reserved storage space for Extensibility.
    // Every added MUST be added above the end gap, and the __endGap size must be reduced
    // accordingly.
    // NOLINTNEXTLINE: naming-convention shadowing-abstract.
    uint256[LAYOUT_LENGTH - 5] private __endGap; // __endGap complements layout to LAYOUT_LENGTH.
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

    // All mintable asset ids have the MINTABLE_ASSET_ID_FLAG (251st bit) set.
    // Mintable ERC1155 and ERC20 assets have NON_UNIQUE_MINTABLE_ASSET_ID_FLAG (250th bit) set too.
    // Mintable ERC20s also have the MINTABLE_ERC20_ASSET_ID_FLAG (249th bit) set.
    // I.e. mintable asset ids that start with: 100 => ERC721, 110 => ERC1155, 111 => ERC20.
    // All non-mintable asset ids have the MINTABLE_ASSET_ID_FLAG bit off.
    uint256 internal constant MINTABLE_ASSET_ID_FLAG = 1 << 250;
    uint256 internal constant NON_UNIQUE_MINTABLE_ASSET_ID_FLAG = 1 << 249;
    uint256 internal constant MINTABLE_ERC20_ASSET_ID_FLAG = 1 << 248;

    // Bit 64 (indexed 63, counting from 0) is a flag indicating a rollup vault id.
    uint256 constant ROLLUP_VAULTS_BIT = 63;
}

contract PerpetualConstants is LibConstants {
    uint256 constant PERPETUAL_POSITION_ID_UPPER_BOUND = 2**64;
    uint256 constant PERPETUAL_AMOUNT_UPPER_BOUND = 2**64;
    uint256 constant PERPETUAL_TIMESTAMP_BITS = 32;
    uint256 constant PERPETUAL_ASSET_ID_UPPER_BOUND = 2**120;
    uint256 constant PERPETUAL_SYSTEM_TIME_LAG_BOUND = 7 days;
    uint256 constant PERPETUAL_SYSTEM_TIME_ADVANCE_BOUND = 4 hours;
    uint256 constant PERPETUAL_CONFIGURATION_DELAY = 0;
}

abstract contract Configuration is PerpetualStorage, PerpetualConstants, MGovernance {
    // This key is used in for the actionsTimeLock.
    uint256 constant GLOBAL_CONFIG_KEY = uint256(~0);

    event LogGlobalConfigurationRegistered(bytes32 configHash);
    event LogGlobalConfigurationApplied(bytes32 configHash);
    event LogGlobalConfigurationRemoved(bytes32 configHash);
    event LogAssetConfigurationRegistered(uint256 assetId, bytes32 configHash);
    event LogAssetConfigurationApplied(uint256 assetId, bytes32 configHash);
    event LogAssetConfigurationRemoved(uint256 assetId, bytes32 configHash);

    /*
      Configuration delay is set during initialization.
      It is designed to be changed only through upgrade cycle, by altering the storage variable.
    */
    function initialize(uint256 delay) internal {
        configurationDelay = delay;
    }

    /*
      Register global configuration hash, for applying once configuration delay time-lock expires.
    */
    function registerGlobalConfigurationChange(bytes32 configHash) external onlyGovernance {
        require(uint256(configHash) < K_MODULUS, "INVALID_CONFIG_HASH");
        bytes32 actionKey = keccak256(abi.encodePacked(GLOBAL_CONFIG_KEY, configHash));

        actionsTimeLock[actionKey] = block.timestamp + configurationDelay;
        emit LogGlobalConfigurationRegistered(configHash);
    }

    /*
      Applies global configuration hash.
    */
    function applyGlobalConfigurationChange(bytes32 configHash) external onlyGovernance {
        bytes32 actionKey = keccak256(abi.encode(GLOBAL_CONFIG_KEY, configHash));
        uint256 activationTime = actionsTimeLock[actionKey];
        require(activationTime > 0, "CONFIGURATION_NOT_REGSITERED");
        require(activationTime <= block.timestamp, "CONFIGURATION_NOT_ENABLE_YET");
        globalConfigurationHash = configHash;
        emit LogGlobalConfigurationApplied(configHash);
    }

    function removeGlobalConfigurationChange(bytes32 configHash) external onlyGovernance {
        bytes32 actionKey = keccak256(abi.encodePacked(GLOBAL_CONFIG_KEY, configHash));
        require(actionsTimeLock[actionKey] > 0, "CONFIGURATION_NOT_REGSITERED");
        delete actionsTimeLock[actionKey];
        emit LogGlobalConfigurationRemoved(configHash);
    }

    /*
      Register an asset configuration hash, for applying once configuration delay time-lock expires.
    */
    function registerAssetConfigurationChange(uint256 assetId, bytes32 configHash)
        external
        onlyGovernance
    {
        require(assetId < PERPETUAL_ASSET_ID_UPPER_BOUND, "INVALID_ASSET_ID");
        require(uint256(configHash) < K_MODULUS, "INVALID_CONFIG_HASH");
        bytes32 actionKey = keccak256(abi.encode(assetId, configHash));
        actionsTimeLock[actionKey] = block.timestamp + configurationDelay;
        emit LogAssetConfigurationRegistered(assetId, configHash);
    }

    /*
      Applies asset configuration hash.
    */
    function applyAssetConfigurationChange(uint256 assetId, bytes32 configHash)
        external
        onlyGovernance
    {
        bytes32 actionKey = keccak256(abi.encode(assetId, configHash));
        uint256 activationTime = actionsTimeLock[actionKey];
        require(activationTime > 0, "CONFIGURATION_NOT_REGSITERED");
        require(activationTime <= block.timestamp, "CONFIGURATION_NOT_ENABLE_YET");
        configurationHash[assetId] = configHash;
        emit LogAssetConfigurationApplied(assetId, configHash);
    }

    function removeAssetConfigurationChange(uint256 assetId, bytes32 configHash)
        external
        onlyGovernance
    {
        bytes32 actionKey = keccak256(abi.encode(assetId, configHash));
        require(actionsTimeLock[actionKey] > 0, "CONFIGURATION_NOT_REGSITERED");
        delete actionsTimeLock[actionKey];
        emit LogAssetConfigurationRemoved(assetId, configHash);
    }
}

interface Identity {
    /*
      Allows a caller to ensure that the provided address is of the expected type and version.
    */
    function identify() external pure returns (string memory);
}

interface SubContractor is Identity {
    function initialize(bytes calldata data) external;

    function initializerSize() external view returns (uint256);

    /*
      Returns an array with selectors for validation.
      These selectors are the critical ones for maintaining self custody and anti censorship.
      During the upgrade process, as part of the sub-contract validation, the MainDispatcher
      validates that the selectos are mapped to the correct sub-contract.
    */
    function validatedSelectors() external pure returns (bytes4[] memory);
}

contract GovernanceStorage {
    // A map from a Governor tag to its own GovernanceInfoStruct.
    mapping(string => GovernanceInfoStruct) internal governanceInfo; //NOLINT uninitialized-state.
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

contract MainGovernance is GovernanceStorage, Governance {
    // The tag is the sting key that is used in the Governance storage mapping.
    string public constant MAIN_GOVERNANCE_INFO_TAG = "StarkEx.Main.2019.GovernorsInformation";

    /*
      Returns the GovernanceInfoStruct associated with the governance tag.
    */
    function getGovernanceInfo() internal view override returns (GovernanceInfoStruct storage) {
        return governanceInfo[MAIN_GOVERNANCE_INFO_TAG];
    }

    function mainIsGovernor(address user) external view returns (bool) {
        return _isGovernor(user);
    }

    function mainNominateNewGovernor(address newGovernor) external {
        _nominateNewGovernor(newGovernor);
    }

    function mainRemoveGovernor(address governorForRemoval) external {
        _removeGovernor(governorForRemoval);
    }

    function mainAcceptGovernance() external {
        _acceptGovernance();
    }

    function mainCancelNomination() external {
        _cancelNomination();
    }
}

contract PerpetualState is
    MainGovernance,
    SubContractor,
    Configuration,
    StarkExOperator,
    Freezable,
    AcceptModifications,
    TokenQuantization,
    ForcedTradeActionState,
    ForcedWithdrawalActionState,
    StateRoot,
    PerpetualEscapes,
    UpdatePerpetualState
{
    // Empty state is 8 words (256 bytes) To pass as uint[] we need also head & len fields (64).
    uint256 constant INITIALIZER_SIZE = 384; // Padded address(32), uint(32), Empty state(256+64).

    /*
      Initialization flow:
      1. Extract initialization parameters from data.
      2. Call internalInitializer with those parameters.
    */
    function initialize(bytes calldata data) external override {
        // This initializer sets roots etc. It must not be applied twice.
        // I.e. it can run only when the state is still empty.
        require(sharedStateHash == bytes32(0x0), "STATE_ALREADY_INITIALIZED");
        require(configurationHash[GLOBAL_CONFIG_KEY] == bytes32(0x0), "STATE_ALREADY_INITIALIZED");

        require(data.length == INITIALIZER_SIZE, "INCORRECT_INIT_DATA_SIZE_384");

        (
            address escapeVerifierAddress_,
            uint256 initialSequenceNumber,
            uint256[] memory initialState
        ) = abi.decode(data, (address, uint256, uint256[]));

        initGovernance();
        Configuration.initialize(PERPETUAL_CONFIGURATION_DELAY);
        StarkExOperator.initialize();

        // The StateRoot struct has room for 3 trees for compatability with StarkEx.
        // Perpertual only uses two of these trees.
        StateRoot.initialize(
            initialSequenceNumber,
            uint256(-1), // NOT IN USE.
            initialState[0], // PositionTreeRoots.
            initialState[2], // OrderTreeRoots.
            uint256(-1), // NOT IN USE.
            initialState[1], // PositionTreeHeights.
            initialState[3] // OrderTreeHeights.
        );
        sharedStateHash = keccak256(abi.encodePacked(initialState));
        PerpetualEscapes.initialize(escapeVerifierAddress_);
    }

    /*
      The call to initializerSize is done from MainDispatcherBase using delegatecall,
      thus the existing state is already accessible.
    */
    function initializerSize() external view override returns (uint256) {
        return INITIALIZER_SIZE;
    }

    function validatedSelectors() external pure override returns (bytes4[] memory selectors) {
        uint256 len_ = 1;
        uint256 index_ = 0;

        selectors = new bytes4[](len_);
        selectors[index_++] = PerpetualEscapes.escape.selector;
        require(index_ == len_, "INCORRECT_SELECTORS_ARRAY_LENGTH");
    }

    function identify() external pure override returns (string memory) {
        return "StarkWare_PerpetualState_2023_4";
    }
}