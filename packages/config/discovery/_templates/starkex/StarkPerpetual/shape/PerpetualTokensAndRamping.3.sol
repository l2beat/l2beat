// SPDX-License-Identifier: Unknown
pragma solidity 0.6.12;

abstract contract Withdrawals is
    MainStorage,
    MAcceptModifications,
    MTokenQuantization,
    MTokenAssetData,
    MFreezable,
    MKeyGetters,
    MTokenTransfers
{
    event LogWithdrawalPerformed(
        uint256 ownerKey,
        uint256 assetType,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount,
        address recipient
    );

    event LogNftWithdrawalPerformed(
        uint256 ownerKey,
        uint256 assetType,
        uint256 tokenId,
        uint256 assetId,
        address recipient
    );

    event LogWithdrawalWithTokenIdPerformed(
        uint256 ownerKey,
        uint256 assetType,
        uint256 tokenId,
        uint256 assetId,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount,
        address recipient
    );

    event LogMintWithdrawalPerformed(
        uint256 ownerKey,
        uint256 assetType,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount,
        uint256 assetId
    );

    function getWithdrawalBalance(uint256 ownerKey, uint256 assetId)
        external
        view
        returns (uint256)
    {
        uint256 presumedAssetType = assetId;
        return fromQuantized(presumedAssetType, pendingWithdrawals[ownerKey][assetId]);
    }

    /*
      Moves funds from the pending withdrawal account to the owner address.
      Note: this function can be called by anyone.
      Can be called normally while frozen.
    */
    function withdraw(uint256 ownerKey, uint256 assetType) external {
        address payable recipient = payable(strictGetEthKey(ownerKey));
        require(!isMintableAssetType(assetType), "MINTABLE_ASSET_TYPE");
        require(isFungibleAssetType(assetType), "NON_FUNGIBLE_ASSET_TYPE");
        uint256 assetId = assetType;
        // Fetch and clear quantized amount.
        uint256 quantizedAmount = pendingWithdrawals[ownerKey][assetId];
        pendingWithdrawals[ownerKey][assetId] = 0;

        // Transfer funds.
        transferOut(recipient, assetType, quantizedAmount);
        emit LogWithdrawalPerformed(
            ownerKey,
            assetType,
            fromQuantized(assetType, quantizedAmount),
            quantizedAmount,
            recipient
        );
    }

    /*
      Allows withdrawal of tokens to their owner's account.
      Note: this function can be called by anyone.
      This function can be called normally while frozen.
    */
    function withdrawWithTokenId(
        uint256 ownerKey,
        uint256 assetType,
        uint256 tokenId // No notFrozen modifier: This function can always be used, even when frozen.
    ) public {
        require(isAssetTypeWithTokenId(assetType), "INVALID_ASSET_TYPE");
        uint256 assetId = calculateAssetIdWithTokenId(assetType, tokenId);
        address recipient = strictGetEthKey(ownerKey);

        uint256 quantizedAmount = pendingWithdrawals[ownerKey][assetId];
        pendingWithdrawals[ownerKey][assetId] = 0;

        // Transfer funds.
        transferOutWithTokenId(recipient, assetType, tokenId, quantizedAmount);
        if (isERC721(assetType)) {
            emit LogNftWithdrawalPerformed(ownerKey, assetType, tokenId, assetId, recipient);
        }
        emit LogWithdrawalWithTokenIdPerformed(
            ownerKey,
            assetType,
            tokenId,
            assetId,
            fromQuantized(assetType, quantizedAmount),
            quantizedAmount,
            recipient
        );
    }

    /*
      Allows withdrawal of an NFT to its owner's account.
      Note: this function can be called by anyone.
      This function can be called normally while frozen.
    */
    function withdrawNft(
        uint256 ownerKey,
        uint256 assetType,
        uint256 tokenId // No notFrozen modifier: This function can always be used, even when frozen.
    ) external {
        withdrawWithTokenId(ownerKey, assetType, tokenId);
    }

    function withdrawAndMint(
        uint256 ownerKey,
        uint256 assetType,
        bytes calldata mintingBlob
    ) external {
        address recipient = strictGetEthKey(ownerKey);
        require(registeredAssetType[assetType], "INVALID_ASSET_TYPE");
        require(isMintableAssetType(assetType), "NON_MINTABLE_ASSET_TYPE");
        uint256 assetId = calculateMintableAssetId(assetType, mintingBlob);
        require(pendingWithdrawals[ownerKey][assetId] > 0, "NO_PENDING_WITHDRAWAL_BALANCE");
        uint256 quantizedAmount = pendingWithdrawals[ownerKey][assetId];
        pendingWithdrawals[ownerKey][assetId] = 0;
        // Transfer funds.
        transferOutMint(assetType, quantizedAmount, recipient, mintingBlob);
        emit LogMintWithdrawalPerformed(
            ownerKey,
            assetType,
            fromQuantized(assetType, quantizedAmount),
            quantizedAmount,
            assetId
        );
    }
}

abstract contract MDeposits {
    function depositERC20(
        // NOLINT external-function.
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId,
        uint256 quantizedAmount
    ) public virtual;

    function depositEth(
        // NOLINT external-function.
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId
    ) public payable virtual;
}

abstract contract Deposits is
    MainStorage,
    LibConstants,
    MAcceptModifications,
    MDeposits,
    MTokenQuantization,
    MTokenAssetData,
    MFreezable,
    MKeyGetters,
    MTokenTransfers
{
    event LogDeposit(
        address depositorEthKey,
        uint256 starkKey,
        uint256 vaultId,
        uint256 assetType,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount
    );

    event LogNftDeposit(
        address depositorEthKey,
        uint256 starkKey,
        uint256 vaultId,
        uint256 assetType,
        uint256 tokenId,
        uint256 assetId
    );

    event LogDepositWithTokenId(
        address depositorEthKey,
        uint256 starkKey,
        uint256 vaultId,
        uint256 assetType,
        uint256 tokenId,
        uint256 assetId,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount
    );

    event LogDepositCancel(uint256 starkKey, uint256 vaultId, uint256 assetId);

    event LogDepositCancelReclaimed(
        uint256 starkKey,
        uint256 vaultId,
        uint256 assetType,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount
    );

    event LogDepositNftCancelReclaimed(
        uint256 starkKey,
        uint256 vaultId,
        uint256 assetType,
        uint256 tokenId,
        uint256 assetId
    );

    event LogDepositWithTokenIdCancelReclaimed(
        uint256 starkKey,
        uint256 vaultId,
        uint256 assetType,
        uint256 tokenId,
        uint256 assetId,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount
    );

    function getDepositBalance(
        uint256 starkKey,
        uint256 assetId,
        uint256 vaultId
    ) external view returns (uint256) {
        uint256 presumedAssetType = assetId;
        return fromQuantized(presumedAssetType, pendingDeposits[starkKey][assetId][vaultId]);
    }

    function getQuantizedDepositBalance(
        uint256 starkKey,
        uint256 assetId,
        uint256 vaultId
    ) external view returns (uint256) {
        return pendingDeposits[starkKey][assetId][vaultId];
    }

    function depositNft(
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId,
        uint256 tokenId
    ) external notFrozen {
        require(isERC721(assetType), "NOT_ERC721_TOKEN");
        depositWithTokenId(starkKey, assetType, tokenId, vaultId, 1);
    }

    function depositERC1155(
        uint256 starkKey,
        uint256 assetType,
        uint256 tokenId,
        uint256 vaultId,
        uint256 quantizedAmount
    ) external notFrozen {
        require(isERC1155(assetType), "NOT_ERC1155_TOKEN");
        depositWithTokenId(starkKey, assetType, tokenId, vaultId, quantizedAmount);
    }

    function depositStateUpdate(
        uint256 starkKey,
        uint256 assetId,
        uint256 vaultId,
        uint256 quantizedAmount
    ) private returns (uint256) {
        // Checks for overflow and updates the pendingDeposits balance.
        uint256 vaultBalance = pendingDeposits[starkKey][assetId][vaultId];
        vaultBalance += quantizedAmount;
        require(vaultBalance >= quantizedAmount, "DEPOSIT_OVERFLOW");
        pendingDeposits[starkKey][assetId][vaultId] = vaultBalance;

        // Disable the cancellationRequest timeout when users deposit into their own account.
        if (
            isMsgSenderKeyOwner(starkKey) && cancellationRequests[starkKey][assetId][vaultId] != 0
        ) {
            delete cancellationRequests[starkKey][assetId][vaultId];
        }

        // Returns the updated vault balance.
        return vaultBalance;
    }

    function depositWithTokenId(
        uint256 starkKey,
        uint256 assetType,
        uint256 tokenId,
        uint256 vaultId,
        uint256 quantizedAmount
    ) public notFrozen {
        // The vaultId is not validated but should be in the allowed range supported by the
        // exchange. If not, it will be ignored by the exchange and the starkKey owner may reclaim
        // the funds by using depositCancel + depositReclaim.
        require(isAssetTypeWithTokenId(assetType), "INVALID_ASSET_TYPE");

        uint256 assetId = calculateAssetIdWithTokenId(assetType, tokenId);

        // Updates the pendingDeposits balance and clears cancellationRequests when applicable.
        uint256 newVaultBalance = depositStateUpdate(starkKey, assetId, vaultId, quantizedAmount);

        // No need to verify amount > 0, a deposit with amount = 0 can be used to undo cancellation.
        if (isERC721(assetType)) {
            require(newVaultBalance <= 1, "ILLEGAL_ERC721_AMOUNT");
            emit LogNftDeposit(msg.sender, starkKey, vaultId, assetType, tokenId, assetId);
        }
        // Transfer the tokens to the Deposit contract.
        transferInWithTokenId(assetType, tokenId, quantizedAmount);
        // Log event.
        emit LogDepositWithTokenId(
            msg.sender,
            starkKey,
            vaultId,
            assetType,
            tokenId,
            assetId,
            fromQuantized(assetType, quantizedAmount),
            quantizedAmount
        );
    }

    function getCancellationRequest(
        uint256 starkKey,
        uint256 assetId,
        uint256 vaultId
    ) external view returns (uint256 request) {
        request = cancellationRequests[starkKey][assetId][vaultId];
    }

    function depositERC20(
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId,
        uint256 quantizedAmount
    ) public override {
        deposit(starkKey, assetType, vaultId, quantizedAmount);
    }

    // NOLINTNEXTLINE: locked-ether.
    function depositEth(
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId
    ) public payable override {
        require(isEther(assetType), "INVALID_ASSET_TYPE");
        deposit(starkKey, assetType, vaultId, toQuantized(assetType, msg.value));
    }

    function deposit(
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId,
        uint256 quantizedAmount
    ) public notFrozen {
        // The vaultId is not validated but should be in the allowed range supported by the
        // exchange. If not, it will be ignored by the exchange and the starkKey owner may reclaim
        // the funds by using depositCancel + depositReclaim.

        // No need to verify amount > 0, a deposit with amount = 0 can be used to undo cancellation.
        require(!isMintableAssetType(assetType), "MINTABLE_ASSET_TYPE");
        require(isFungibleAssetType(assetType), "NON_FUNGIBLE_ASSET_TYPE");

        uint256 assetId = assetType;

        // Updates the pendingDeposits balance and clears cancellationRequests when applicable.
        depositStateUpdate(starkKey, assetId, vaultId, quantizedAmount);

        // Transfer the tokens to the Deposit contract.
        transferIn(assetType, quantizedAmount);

        // Log event.
        emit LogDeposit(
            msg.sender,
            starkKey,
            vaultId,
            assetType,
            fromQuantized(assetType, quantizedAmount),
            quantizedAmount
        );
    }

    function deposit(
        // NOLINT: locked-ether.
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId
    ) external payable {
        require(isEther(assetType), "INVALID_ASSET_TYPE");
        deposit(starkKey, assetType, vaultId, toQuantized(assetType, msg.value));
    }

    function depositCancel(
        uint256 starkKey,
        uint256 assetId,
        uint256 vaultId
    )
        external
        onlyKeyOwner(starkKey)
    // No notFrozen modifier: This function can always be used, even when frozen.
    {
        // Allow cancellation only for real deposit that were placed.
        require(pendingDeposits[starkKey][assetId][vaultId] > 0, "DEPOSIT_DOESNT_EXIST");

        // Start the timeout.
        cancellationRequests[starkKey][assetId][vaultId] = block.timestamp;

        // Log event.
        emit LogDepositCancel(starkKey, vaultId, assetId);
    }

    function clearCancelledDeposit(
        uint256 starkKey,
        uint256 assetId,
        uint256 vaultId
    ) private returns (uint256) {
        // Make sure enough time has passed.
        uint256 requestTime = cancellationRequests[starkKey][assetId][vaultId];
        require(requestTime != 0, "DEPOSIT_NOT_CANCELED");
        uint256 freeTime = requestTime + DEPOSIT_CANCEL_DELAY;
        assert(freeTime >= DEPOSIT_CANCEL_DELAY);
        require(block.timestamp >= freeTime, "DEPOSIT_LOCKED"); // NOLINT: timestamp.

        // Clear deposit.
        uint256 quantizedAmount = pendingDeposits[starkKey][assetId][vaultId];
        delete pendingDeposits[starkKey][assetId][vaultId];
        delete cancellationRequests[starkKey][assetId][vaultId];

        // Return the cleared amount so it can be transferred back to the reclaimer.
        return quantizedAmount;
    }

    function depositReclaim(
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId
    )
        external
        onlyKeyOwner(starkKey)
    // No notFrozen modifier: This function can always be used, even when frozen.
    {
        require(isFungibleAssetType(assetType), "NON_FUNGIBLE_ASSET_TYPE");

        // Clear deposit and attain the cleared amount to be transferred out.
        uint256 assetId = assetType;
        uint256 quantizedAmount = clearCancelledDeposit(starkKey, assetId, vaultId);

        // Refund deposit.
        transferOut(msg.sender, assetType, quantizedAmount);

        // Log event.
        emit LogDepositCancelReclaimed(
            starkKey,
            vaultId,
            assetType,
            fromQuantized(assetType, quantizedAmount),
            quantizedAmount
        );
    }

    function depositWithTokenIdReclaim(
        uint256 starkKey,
        uint256 assetType,
        uint256 tokenId,
        uint256 vaultId
    )
        public
        onlyKeyOwner(starkKey)
    // No notFrozen modifier: This function can always be used, even when frozen.
    {
        require(isAssetTypeWithTokenId(assetType), "INVALID_ASSET_TYPE");

        // Clear deposit and attain the cleared amount to be transferred out.
        uint256 assetId = calculateAssetIdWithTokenId(assetType, tokenId);
        uint256 quantizedAmount = clearCancelledDeposit(starkKey, assetId, vaultId);

        if (quantizedAmount > 0) {
            // Refund deposit.
            transferOutWithTokenId(msg.sender, assetType, tokenId, quantizedAmount);
        }

        // Log event.
        if (isERC721(assetType)) {
            emit LogDepositNftCancelReclaimed(starkKey, vaultId, assetType, tokenId, assetId);
        }
        emit LogDepositWithTokenIdCancelReclaimed(
            starkKey,
            vaultId,
            assetType,
            tokenId,
            assetId,
            fromQuantized(assetType, quantizedAmount),
            quantizedAmount
        );
    }

    function depositNftReclaim(
        uint256 starkKey,
        uint256 assetType,
        uint256 vaultId,
        uint256 tokenId
    )
        external
        onlyKeyOwner(starkKey)
    // No notFrozen modifier: This function can always be used, even when frozen.
    {
        depositWithTokenIdReclaim(starkKey, assetType, tokenId, vaultId);
    }
}

abstract contract MKeyGetters {
    // NOLINTNEXTLINE: external-function.
    function getEthKey(uint256 ownerKey) public view virtual returns (address);

    function strictGetEthKey(uint256 ownerKey) internal view virtual returns (address);

    function isMsgSenderKeyOwner(uint256 ownerKey) internal view virtual returns (bool);

    /*
      Allows calling the function only if ownerKey is registered to msg.sender.
    */
    modifier onlyKeyOwner(uint256 ownerKey) {
        // Require the calling user to own the stark key.
        require(msg.sender == strictGetEthKey(ownerKey), "MISMATCHING_STARK_ETH_KEYS");
        _;
    }
}

contract KeyGetters is MainStorage, MKeyGetters {
    uint256 internal constant MASK_ADDRESS = (1 << 160) - 1;

    /*
      Returns the Ethereum public key (address) that owns the given ownerKey.
      If the ownerKey size is within the range of an Ethereum address (i.e. < 2**160)
      it returns the owner key itself.

      If the ownerKey is larger than a potential eth address, the eth address for which the starkKey
      was registered is returned, and 0 if the starkKey is not registered.

      Note - prior to version 4.0 this function reverted on an unregistered starkKey.
      For a variant of this function that reverts on an unregistered starkKey, use strictGetEthKey.
    */
    function getEthKey(uint256 ownerKey) public view override returns (address) {
        address registeredEth = ethKeys[ownerKey];

        if (registeredEth != address(0x0)) {
            return registeredEth;
        }

        return ownerKey == (ownerKey & MASK_ADDRESS) ? address(ownerKey) : address(0x0);
    }

    /*
      Same as getEthKey, but fails when a stark key is not registered.
    */
    function strictGetEthKey(uint256 ownerKey) internal view override returns (address ethKey) {
        ethKey = getEthKey(ownerKey);
        require(ethKey != address(0x0), "USER_UNREGISTERED");
    }

    function isMsgSenderKeyOwner(uint256 ownerKey) internal view override returns (bool) {
        return msg.sender == getEthKey(ownerKey);
    }
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

abstract contract TokenRegister is MainStorage, LibConstants, MGovernance, MTokenAssetData {
    event LogTokenRegistered(uint256 assetType, bytes assetInfo, uint256 quantum);
    event LogTokenAdminAdded(address tokenAdmin);
    event LogTokenAdminRemoved(address tokenAdmin);

    modifier onlyTokensAdmin() {
        require(isTokenAdmin(msg.sender), "ONLY_TOKENS_ADMIN");
        _;
    }

    function isTokenAdmin(address testedAdmin) public view returns (bool) {
        return tokenAdmins[testedAdmin];
    }

    function registerTokenAdmin(address newAdmin) external onlyGovernance {
        tokenAdmins[newAdmin] = true;
        emit LogTokenAdminAdded(newAdmin);
    }

    function unregisterTokenAdmin(address oldAdmin) external onlyGovernance {
        tokenAdmins[oldAdmin] = false;
        emit LogTokenAdminRemoved(oldAdmin);
    }

    function isAssetRegistered(uint256 assetType) public view returns (bool) {
        return registeredAssetType[assetType];
    }

    /*
      Registers a new asset to the system.
      Once added, it can not be removed and there is a limited number
      of slots available.
    */
    function registerToken(
        uint256 assetType,
        bytes calldata assetInfo,
        uint256 quantum
    ) public virtual onlyTokensAdmin {
        // Make sure it is not invalid or already registered.
        require(!isAssetRegistered(assetType), "ASSET_ALREADY_REGISTERED");
        require(assetType < K_MODULUS, "INVALID_ASSET_TYPE");
        require(quantum > 0, "INVALID_QUANTUM");
        require(quantum < QUANTUM_UPPER_BOUND, "INVALID_QUANTUM");

        // Require that the assetType is the hash of the assetInfo and quantum truncated to 250 bits.
        uint256 enforcedId = uint256(keccak256(abi.encodePacked(assetInfo, quantum))) & MASK_250;
        require(assetType == enforcedId, "INVALID_ASSET_TYPE");

        verifyAssetInfo(assetInfo);
        // NFTs quantum must equal one.
        if (isNonFungibleAssetInfo(assetInfo)) {
            require(quantum == 1, "INVALID_NFT_QUANTUM");
        }

        // Add token to the in-storage structures.
        registeredAssetType[assetType] = true;
        assetTypeToAssetInfo[assetType] = assetInfo;
        assetTypeToQuantum[assetType] = quantum;

        // Log the registration of a new token.
        emit LogTokenRegistered(assetType, assetInfo, quantum);
    }

    function registerToken(uint256 assetType, bytes calldata assetInfo) external virtual {
        registerToken(assetType, assetInfo, 1);
    }
}

abstract contract PerpetualTokenRegister is PerpetualStorage, TokenRegister {
    event LogSystemAssetType(uint256 assetType);

    function registerToken(
        uint256, /* assetType */
        bytes calldata /* assetInfo */
    ) external override {
        revert("UNSUPPORTED_FUNCTION");
    }

    function registerToken(
        uint256, /* assetType */
        bytes memory, /* assetInfo */
        uint256 /* quantum */
    ) public override {
        revert("UNSUPPORTED_FUNCTION");
    }

    // NOLINTNEXTLINE external-function.
    function getSystemAssetType() public view returns (uint256) {
        return systemAssetType;
    }

    function registerSystemAssetType(uint256 assetType, bytes calldata assetInfo)
        external
        onlyTokensAdmin
    {
        require(systemAssetType == uint256(0), "SYSTEM_ASSET_TYPE_ALREADY_SET");
        systemAssetType = assetType;
        super.registerToken(assetType, assetInfo, 1);
        emit LogSystemAssetType(assetType);
    }
}

abstract contract MTokenTransfers {
    function transferIn(uint256 assetType, uint256 quantizedAmount) internal virtual;

    function transferInWithTokenId(
        uint256 assetType,
        uint256 tokenId,
        uint256 quantizedAmount
    ) internal virtual;

    function transferOut(
        address payable recipient,
        uint256 assetType,
        uint256 quantizedAmount
    ) internal virtual;

    function transferOutWithTokenId(
        address recipient,
        uint256 assetType,
        uint256 tokenId,
        uint256 quantizedAmount
    ) internal virtual;

    function transferOutMint(
        uint256 assetType,
        uint256 quantizedAmount,
        address recipient,
        bytes calldata mintingBlob
    ) internal virtual;
}

abstract contract TokenTransfers is MTokenQuantization, MTokenAssetData, MTokenTransfers {
    using Addresses for address;
    using Addresses for address payable;

    /*
      Transfers funds from msg.sender to the exchange.
    */
    function transferIn(uint256 assetType, uint256 quantizedAmount) internal override {
        uint256 amount = fromQuantized(assetType, quantizedAmount);
        if (isERC20(assetType)) {
            if (quantizedAmount == 0) return;
            address tokenAddress = extractContractAddress(assetType);
            IERC20 token = IERC20(tokenAddress);
            uint256 exchangeBalanceBefore = token.balanceOf(address(this));
            bytes memory callData = abi.encodeWithSelector(
                token.transferFrom.selector,
                msg.sender,
                address(this),
                amount
            );
            tokenAddress.safeTokenContractCall(callData);
            uint256 exchangeBalanceAfter = token.balanceOf(address(this));
            require(exchangeBalanceAfter >= exchangeBalanceBefore, "OVERFLOW");
            // NOLINTNEXTLINE(incorrect-equality): strict equality needed.
            require(
                exchangeBalanceAfter == exchangeBalanceBefore + amount,
                "INCORRECT_AMOUNT_TRANSFERRED"
            );
        } else if (isEther(assetType)) {
            require(msg.value == amount, "INCORRECT_DEPOSIT_AMOUNT");
        } else {
            revert("UNSUPPORTED_TOKEN_TYPE");
        }
    }

    /*
      Transfers non fungible and semi fungible tokens from a user to the exchange.
    */
    function transferInWithTokenId(
        uint256 assetType,
        uint256 tokenId,
        uint256 quantizedAmount
    ) internal override {
        require(isAssetTypeWithTokenId(assetType), "FUNGIBLE_ASSET_TYPE");

        if (isERC721(assetType)) {
            require(quantizedAmount == 1, "ILLEGAL_NFT_BALANCE");
            transferInNft(assetType, tokenId);
        } else if (quantizedAmount > 0) {
            transferInSft(assetType, tokenId, quantizedAmount);
        }
    }

    function transferInNft(uint256 assetType, uint256 tokenId) private {
        require(isERC721(assetType), "NOT_ERC721_TOKEN");
        address tokenAddress = extractContractAddress(assetType);

        tokenAddress.safeTokenContractCall(
            abi.encodeWithSignature(
                "safeTransferFrom(address,address,uint256)",
                msg.sender,
                address(this),
                tokenId
            )
        );
    }

    function transferInSft(
        uint256 assetType,
        uint256 tokenId,
        uint256 quantizedAmount
    ) private {
        require(isERC1155(assetType), "NOT_ERC1155_TOKEN");
        if (quantizedAmount == 0) return;

        uint256 amount = fromQuantized(assetType, quantizedAmount);
        address tokenAddress = extractContractAddress(assetType);
        IERC1155 token = IERC1155(tokenAddress);
        uint256 exchangeBalanceBefore = token.balanceOf(address(this), tokenId);

        // Call an ERC1155 token transfer.
        tokenAddress.safeTokenContractCall(
            abi.encodeWithSelector(
                token.safeTransferFrom.selector,
                msg.sender,
                address(this),
                tokenId,
                amount,
                bytes("")
            )
        );

        uint256 exchangeBalanceAfter = token.balanceOf(address(this), tokenId);
        require(exchangeBalanceAfter >= exchangeBalanceBefore, "OVERFLOW");
        // NOLINTNEXTLINE(incorrect-equality): strict equality needed.
        require(
            exchangeBalanceAfter == exchangeBalanceBefore + amount,
            "INCORRECT_AMOUNT_TRANSFERRED"
        );
    }

    /*
      Transfers funds from the exchange to recipient.
    */
    function transferOut(
        address payable recipient,
        uint256 assetType,
        uint256 quantizedAmount
    ) internal override {
        // Make sure we don't accidentally burn funds.
        require(recipient != address(0x0), "INVALID_RECIPIENT");
        uint256 amount = fromQuantized(assetType, quantizedAmount);
        if (isERC20(assetType)) {
            if (quantizedAmount == 0) return;
            address tokenAddress = extractContractAddress(assetType);
            IERC20 token = IERC20(tokenAddress);
            uint256 exchangeBalanceBefore = token.balanceOf(address(this));
            bytes memory callData = abi.encodeWithSelector(
                token.transfer.selector,
                recipient,
                amount
            );
            tokenAddress.safeTokenContractCall(callData);
            uint256 exchangeBalanceAfter = token.balanceOf(address(this));
            require(exchangeBalanceAfter <= exchangeBalanceBefore, "UNDERFLOW");
            // NOLINTNEXTLINE(incorrect-equality): strict equality needed.
            require(
                exchangeBalanceAfter == exchangeBalanceBefore - amount,
                "INCORRECT_AMOUNT_TRANSFERRED"
            );
        } else if (isEther(assetType)) {
            if (quantizedAmount == 0) return;
            recipient.performEthTransfer(amount);
        } else {
            revert("UNSUPPORTED_TOKEN_TYPE");
        }
    }

    /*
      Transfers non fungible and semi fungible tokens from the exchange to recipient.
    */
    function transferOutWithTokenId(
        address recipient,
        uint256 assetType,
        uint256 tokenId,
        uint256 quantizedAmount
    ) internal override {
        require(isAssetTypeWithTokenId(assetType), "FUNGIBLE_ASSET_TYPE");
        if (isERC721(assetType)) {
            require(quantizedAmount == 1, "ILLEGAL_NFT_BALANCE");
            transferOutNft(recipient, assetType, tokenId);
        } else if (quantizedAmount > 0) {
            transferOutSft(recipient, assetType, tokenId, quantizedAmount);
        }
    }

    /*
      Transfers NFT from the exchange to recipient.
    */
    function transferOutNft(
        address recipient,
        uint256 assetType,
        uint256 tokenId
    ) private {
        // Make sure we don't accidentally burn funds.
        require(recipient != address(0x0), "INVALID_RECIPIENT");
        require(isERC721(assetType), "NOT_ERC721_TOKEN");
        address tokenAddress = extractContractAddress(assetType);

        tokenAddress.safeTokenContractCall(
            abi.encodeWithSignature(
                "safeTransferFrom(address,address,uint256)",
                address(this),
                recipient,
                tokenId
            )
        );
    }

    /*
      Transfers Semi Fungible Tokens from the exchange to recipient.
    */
    function transferOutSft(
        address recipient,
        uint256 assetType,
        uint256 tokenId,
        uint256 quantizedAmount
    ) private {
        // Make sure we don't accidentally burn funds.
        require(recipient != address(0x0), "INVALID_RECIPIENT");
        require(isERC1155(assetType), "NOT_ERC1155_TOKEN");
        if (quantizedAmount == 0) return;

        uint256 amount = fromQuantized(assetType, quantizedAmount);
        address tokenAddress = extractContractAddress(assetType);
        IERC1155 token = IERC1155(tokenAddress);
        uint256 exchangeBalanceBefore = token.balanceOf(address(this), tokenId);

        // Call an ERC1155 token transfer.
        tokenAddress.safeTokenContractCall(
            abi.encodeWithSelector(
                token.safeTransferFrom.selector,
                address(this),
                recipient,
                tokenId,
                amount,
                bytes("")
            )
        );

        uint256 exchangeBalanceAfter = token.balanceOf(address(this), tokenId);
        require(exchangeBalanceAfter <= exchangeBalanceBefore, "UNDERFLOW");
        // NOLINTNEXTLINE(incorrect-equality): strict equality needed.
        require(
            exchangeBalanceAfter == exchangeBalanceBefore - amount,
            "INCORRECT_AMOUNT_TRANSFERRED"
        );
    }

    function transferOutMint(
        uint256 assetType,
        uint256 quantizedAmount,
        address recipient,
        bytes calldata mintingBlob
    ) internal override {
        // Make sure we don't accidentally burn funds.
        require(recipient != address(0x0), "INVALID_RECIPIENT");
        require(isMintableAssetType(assetType), "NON_MINTABLE_ASSET_TYPE");
        require(quantizedAmount > 0, "INVALID_MINT_AMOUNT");
        uint256 amount = fromQuantized(assetType, quantizedAmount);
        address tokenAddress = extractContractAddress(assetType);
        tokenAddress.safeTokenContractCall(
            abi.encodeWithSignature(
                "mintFor(address,uint256,bytes)",
                recipient,
                amount,
                mintingBlob
            )
        );
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

abstract contract MTokenAssetData {
    // NOLINTNEXTLINE: external-function.
    function getAssetInfo(uint256 assetType) public view virtual returns (bytes memory);

    function isEther(uint256 assetType) internal view virtual returns (bool);

    function isERC20(uint256 assetType) internal view virtual returns (bool);

    function isERC721(uint256 assetType) internal view virtual returns (bool);

    function isERC1155(uint256 assetType) internal view virtual returns (bool);

    function isFungibleAssetType(uint256 assetType) internal view virtual returns (bool);

    function isMintableAssetType(uint256 assetType) internal view virtual returns (bool);

    function isAssetTypeWithTokenId(uint256 assetType) internal view virtual returns (bool);

    function extractContractAddress(uint256 assetType) internal view virtual returns (address);

    function verifyAssetInfo(bytes memory assetInfo) internal view virtual;

    function isNonFungibleAssetInfo(bytes memory assetInfo) internal pure virtual returns (bool);

    function calculateAssetIdWithTokenId(uint256 assetType, uint256 tokenId)
        public
        view
        virtual
        returns (uint256);

    function calculateMintableAssetId(uint256 assetType, bytes calldata mintingBlob)
        public
        view
        virtual
        returns (uint256);
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

contract TokenAssetData is MainStorage, LibConstants, MTokenAssetData {
    bytes4 internal constant ERC20_SELECTOR = bytes4(keccak256("ERC20Token(address)"));
    bytes4 internal constant ETH_SELECTOR = bytes4(keccak256("ETH()"));
    bytes4 internal constant ERC721_SELECTOR = bytes4(keccak256("ERC721Token(address,uint256)"));
    bytes4 internal constant ERC1155_SELECTOR = bytes4(keccak256("ERC1155Token(address,uint256)"));
    bytes4 internal constant MINTABLE_ERC20_SELECTOR =
        bytes4(keccak256("MintableERC20Token(address)"));
    bytes4 internal constant MINTABLE_ERC721_SELECTOR =
        bytes4(keccak256("MintableERC721Token(address,uint256)"));
    bytes4 internal constant MINTABLE_ERC1155_SELECTOR =
        bytes4(keccak256("MintableERC1155Token(address,uint256)"));

    // The selector follows the 0x20 bytes assetInfo.length field.
    uint256 internal constant SELECTOR_OFFSET = 0x20;
    uint256 internal constant SELECTOR_SIZE = 4;
    uint256 internal constant TOKEN_CONTRACT_ADDRESS_OFFSET = SELECTOR_OFFSET + SELECTOR_SIZE;
    string internal constant NFT_ASSET_ID_PREFIX = "NFT:";
    string internal constant NON_MINTABLE_PREFIX = "NON_MINTABLE:";
    string internal constant MINTABLE_PREFIX = "MINTABLE:";

    using Addresses for address;

    /*
      Extract the tokenSelector from assetInfo.

      Works like bytes4 tokenSelector = abi.decode(assetInfo, (bytes4))
      but does not revert when assetInfo.length < SELECTOR_OFFSET.
    */
    function extractTokenSelectorFromAssetInfo(bytes memory assetInfo)
        private
        pure
        returns (bytes4 selector)
    {
        assembly {
            selector := and(
                0xffffffff00000000000000000000000000000000000000000000000000000000,
                mload(add(assetInfo, SELECTOR_OFFSET))
            )
        }
    }

    function getAssetInfo(uint256 assetType) public view override returns (bytes memory assetInfo) {
        // Verify that the registration is set and valid.
        require(registeredAssetType[assetType], "ASSET_TYPE_NOT_REGISTERED");

        // Retrieve registration.
        assetInfo = assetTypeToAssetInfo[assetType];
    }

    function extractTokenSelectorFromAssetType(uint256 assetType) private view returns (bytes4) {
        return extractTokenSelectorFromAssetInfo(getAssetInfo(assetType));
    }

    function isEther(uint256 assetType) internal view override returns (bool) {
        return extractTokenSelectorFromAssetType(assetType) == ETH_SELECTOR;
    }

    function isERC20(uint256 assetType) internal view override returns (bool) {
        return extractTokenSelectorFromAssetType(assetType) == ERC20_SELECTOR;
    }

    function isERC721(uint256 assetType) internal view override returns (bool) {
        return extractTokenSelectorFromAssetType(assetType) == ERC721_SELECTOR;
    }

    function isERC1155(uint256 assetType) internal view override returns (bool) {
        return extractTokenSelectorFromAssetType(assetType) == ERC1155_SELECTOR;
    }

    function isFungibleAssetType(uint256 assetType) internal view override returns (bool) {
        bytes4 tokenSelector = extractTokenSelectorFromAssetType(assetType);
        return
            tokenSelector == ETH_SELECTOR ||
            tokenSelector == ERC20_SELECTOR ||
            tokenSelector == MINTABLE_ERC20_SELECTOR;
    }

    function isMintableAssetType(uint256 assetType) internal view override returns (bool) {
        bytes4 tokenSelector = extractTokenSelectorFromAssetType(assetType);
        return
            tokenSelector == MINTABLE_ERC20_SELECTOR ||
            tokenSelector == MINTABLE_ERC721_SELECTOR ||
            tokenSelector == MINTABLE_ERC1155_SELECTOR;
    }

    function isAssetTypeWithTokenId(uint256 assetType) internal view override returns (bool) {
        bytes4 tokenSelector = extractTokenSelectorFromAssetType(assetType);
        return tokenSelector == ERC721_SELECTOR || tokenSelector == ERC1155_SELECTOR;
    }

    function isTokenSupported(bytes4 tokenSelector) private pure returns (bool) {
        return
            tokenSelector == ETH_SELECTOR ||
            tokenSelector == ERC20_SELECTOR ||
            tokenSelector == ERC721_SELECTOR ||
            tokenSelector == ERC1155_SELECTOR ||
            tokenSelector == MINTABLE_ERC20_SELECTOR ||
            tokenSelector == MINTABLE_ERC721_SELECTOR ||
            tokenSelector == MINTABLE_ERC1155_SELECTOR;
    }

    function extractContractAddressFromAssetInfo(bytes memory assetInfo)
        private
        pure
        returns (address)
    {
        uint256 offset = TOKEN_CONTRACT_ADDRESS_OFFSET;
        uint256 res;
        assembly {
            res := mload(add(assetInfo, offset))
        }
        return address(res);
    }

    function extractContractAddress(uint256 assetType) internal view override returns (address) {
        return extractContractAddressFromAssetInfo(getAssetInfo(assetType));
    }

    function verifyAssetInfo(bytes memory assetInfo) internal view override {
        bytes4 tokenSelector = extractTokenSelectorFromAssetInfo(assetInfo);

        // Ensure the selector is of an asset type we know.
        require(isTokenSupported(tokenSelector), "UNSUPPORTED_TOKEN_TYPE");

        if (tokenSelector == ETH_SELECTOR) {
            // Assset info for ETH assetType is only a selector, i.e. 4 bytes length.
            require(assetInfo.length == 4, "INVALID_ASSET_STRING");
        } else {
            // Assset info for other asset types are a selector + uint256 concatanation.
            // We pass the address as a uint256 (zero padded),
            // thus its length is 0x04 + 0x20 = 0x24.
            require(assetInfo.length == 0x24, "INVALID_ASSET_STRING");
            address tokenAddress = extractContractAddressFromAssetInfo(assetInfo);
            require(tokenAddress.isContract(), "BAD_TOKEN_ADDRESS");
        }
    }

    function isNonFungibleAssetInfo(bytes memory assetInfo) internal pure override returns (bool) {
        bytes4 tokenSelector = extractTokenSelectorFromAssetInfo(assetInfo);
        return tokenSelector == ERC721_SELECTOR || tokenSelector == MINTABLE_ERC721_SELECTOR;
    }

    function calculateAssetIdWithTokenId(uint256 assetType, uint256 tokenId)
        public
        view
        override
        returns (uint256)
    {
        require(isAssetTypeWithTokenId(assetType), "ASSET_TYPE_DOES_NOT_TAKE_TOKEN_ID");

        string memory prefix = isERC721(assetType) ? NFT_ASSET_ID_PREFIX : NON_MINTABLE_PREFIX;
        return uint256(keccak256(abi.encodePacked(prefix, assetType, tokenId))) & MASK_250;
    }

    function calculateMintableAssetId(uint256 assetType, bytes calldata mintingBlob)
        public
        view
        override
        returns (uint256)
    {
        require(isMintableAssetType(assetType), "NON_MINTABLE_ASSET_TYPE");

        // All mintable asset ids have the MINTABLE_ASSET_ID_FLAG (251st bit) set.
        // Mintable ERC1155 and ERC20 assets have NON_UNIQUE_MINTABLE_ASSET_ID_FLAG (250th bit) set.
        // Mintable ERC20s also have the MINTABLE_ERC20_ASSET_ID_FLAG (249th bit) set.
        // I.e. mintable asset ids that start with: 100 => ERC721, 110 => ERC1155, 111 => ERC20.

        uint256 mintable_asset_flags = MINTABLE_ASSET_ID_FLAG;
        bytes4 selector = extractTokenSelectorFromAssetType(assetType);
        if (selector == MINTABLE_ERC1155_SELECTOR || selector == MINTABLE_ERC20_SELECTOR) {
            mintable_asset_flags = mintable_asset_flags | NON_UNIQUE_MINTABLE_ASSET_ID_FLAG;
        }
        if (selector == MINTABLE_ERC20_SELECTOR) {
            mintable_asset_flags = mintable_asset_flags | MINTABLE_ERC20_ASSET_ID_FLAG;
        }

        uint256 blobHash = uint256(keccak256(mintingBlob));
        return
            (uint256(keccak256(abi.encodePacked(MINTABLE_PREFIX, assetType, blobHash))) &
                MASK_240) | mintable_asset_flags;
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

struct GovernanceInfoStruct {
    mapping(address => bool) effectiveGovernors;
    address candidateGovernor;
    bool initialized;
}

contract GovernanceStorage {
    // A map from a Governor tag to its own GovernanceInfoStruct.
    mapping(string => GovernanceInfoStruct) internal governanceInfo; //NOLINT uninitialized-state.
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

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract ERC721Receiver is IERC721Receiver {
    function onERC721Received(
        address operator, // The address which called `safeTransferFrom` function.
        address, // from - The address which previously owned the token.
        uint256, // tokenId -  The NFT identifier which is being transferred.
        bytes calldata // data - Additional data with no specified format.
    ) external override returns (bytes4) {
        return (operator == address(this) ? this.onERC721Received.selector : bytes4(0));
    }
}

contract PerpetualTokensAndRamping is
    ERC721Receiver,
    SubContractor,
    Freezable,
    MainGovernance,
    AcceptModifications,
    TokenAssetData,
    TokenQuantization,
    TokenTransfers,
    PerpetualTokenRegister,
    KeyGetters,
    Deposits,
    Withdrawals
{
    function initialize(
        bytes calldata /* data */
    ) external override {
        revert("NOT_IMPLEMENTED");
    }

    function initializerSize() external view override returns (uint256) {
        return 0;
    }

    function validatedSelectors() external pure override returns (bytes4[] memory selectors) {
        uint256 len_ = 3;
        uint256 index_ = 0;

        selectors = new bytes4[](len_);
        selectors[index_++] = Deposits.depositCancel.selector;
        selectors[index_++] = Deposits.depositReclaim.selector;
        selectors[index_++] = Withdrawals.withdraw.selector;
        require(index_ == len_, "INCORRECT_SELECTORS_ARRAY_LENGTH");
    }

    function identify() external pure override returns (string memory) {
        return "StarkWare_PerpetualTokensAndRamping_2022_2";
    }
}