// SPDX-License-Identifier: Unknown
pragma solidity 0.6.12;

abstract contract VaultDepositWithdrawal is
    StarkExStorage,
    MVaultLocks,
    MTokenQuantization,
    MTokenAssetData,
    MTokenTransfers
{
    event LogDepositToVault(
        address ethKey,
        uint256 assetType,
        uint256 assetId,
        uint256 vaultId,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount
    );

    event LogWithdrawalFromVault(
        address ethKey,
        uint256 assetType,
        uint256 assetId,
        uint256 vaultId,
        uint256 nonQuantizedAmount,
        uint256 quantizedAmount
    );

    function getQuantizedVaultBalance(
        address ethKey,
        uint256 assetId,
        uint256 vaultId
    ) public view returns (uint256) {
        return vaultsBalances[ethKey][assetId][vaultId];
    }

    function getVaultBalance(
        address ethKey,
        uint256 assetId,
        uint256 vaultId
    ) external view returns (uint256) {
        return fromQuantized(assetId, getQuantizedVaultBalance(ethKey, assetId, vaultId));
    }

    function getQuantizedErc1155VaultBalance(
        address ethKey,
        uint256 assetType,
        uint256 tokenId,
        uint256 vaultId
    ) external view returns (uint256) {
        uint256 assetId = calculateAssetIdWithTokenId(assetType, tokenId);
        return vaultsBalances[ethKey][assetId][vaultId];
    }

    function updateVaultForDeposit(
        uint256 assetId,
        uint256 vaultId,
        uint256 quantizedAmount
    ) private {
        // A default withdrawal lock is applied when deposits are made.
        applyDefaultLock(assetId, vaultId);
        // Update the balance.
        vaultsBalances[msg.sender][assetId][vaultId] += quantizedAmount;
        require(vaultsBalances[msg.sender][assetId][vaultId] >= quantizedAmount, "VAULT_OVERFLOW");
    }

    // NOLINTNEXTLINE: locked-ether.
    function depositEthToVault(uint256 assetType, uint256 vaultId) external payable {
        require(isEther(assetType), "INVALID_ASSET_TYPE");
        // Update the vault balance and apply default lock.
        uint256 quantizedAmount = toQuantized(assetType, msg.value);
        uint256 assetId = assetType;
        updateVaultForDeposit(assetId, vaultId, quantizedAmount);
        // Transfer the tokens to the contract.
        transferIn(assetType, quantizedAmount);
        // Log event.
        emit LogDepositToVault(
            msg.sender,
            assetType,
            assetId,
            vaultId,
            fromQuantized(assetId, quantizedAmount),
            quantizedAmount
        );
    }

    function depositERC20ToVault(
        uint256 assetType,
        uint256 vaultId,
        uint256 quantizedAmount
    ) external {
        require(isERC20(assetType), "NOT_ERC20_ASSET_TYPE");
        // Update the vault balance and apply default lock.
        uint256 assetId = assetType;
        updateVaultForDeposit(assetId, vaultId, quantizedAmount);
        // Transfer the tokens to the contract.
        transferIn(assetType, quantizedAmount);
        // Log event.
        emit LogDepositToVault(
            msg.sender,
            assetType,
            assetId,
            vaultId,
            fromQuantized(assetId, quantizedAmount),
            quantizedAmount
        );
    }

    function depositERC1155ToVault(
        uint256 assetType,
        uint256 tokenId,
        uint256 vaultId,
        uint256 quantizedAmount
    ) external {
        require(isERC1155(assetType), "NOT_ERC1155_TOKEN");
        // Update the vault balance and apply default lock.
        uint256 assetId = calculateAssetIdWithTokenId(assetType, tokenId);
        updateVaultForDeposit(assetId, vaultId, quantizedAmount);
        // Transfer the tokens to the contract.
        transferInWithTokenId(assetType, tokenId, quantizedAmount);
        // Log event.
        emit LogDepositToVault(
            msg.sender,
            assetType,
            assetId,
            vaultId,
            fromQuantized(assetId, quantizedAmount),
            quantizedAmount
        );
    }

    function updateVaultForWithdrawal(
        uint256 assetId,
        uint256 vaultId,
        uint256 quantizedAmount
    ) private {
        require(quantizedAmount > 0, "ZERO_WITHDRAWAL");
        // Make sure the vault is not locked for withdrawals.
        require(!isVaultLocked(msg.sender, assetId, vaultId), "VAULT_IS_LOCKED");
        // Make sure the vault contains sufficient funds.
        uint256 vaultBalance = vaultsBalances[msg.sender][assetId][vaultId];
        require(vaultBalance >= quantizedAmount, "INSUFFICIENT_BALANCE");
        // Update the balance.
        vaultsBalances[msg.sender][assetId][vaultId] = vaultBalance - quantizedAmount;
    }

    function withdrawFromVault(
        uint256 assetType,
        uint256 vaultId,
        uint256 quantizedAmount
    ) external {
        require(isFungibleAssetType(assetType), "NON_FUNGIBLE_ASSET_TYPE");
        require(!isMintableAssetType(assetType), "MINTABLE_ASSET_TYPE");
        // Update the vault balance and check withdrawal lock.
        uint256 assetId = assetType;
        updateVaultForWithdrawal(assetId, vaultId, quantizedAmount);
        // Transfer funds.
        transferOut(msg.sender, assetType, quantizedAmount);
        // Log event.
        emit LogWithdrawalFromVault(
            msg.sender,
            assetType,
            assetId,
            vaultId,
            fromQuantized(assetId, quantizedAmount),
            quantizedAmount
        );
    }

    function withdrawErc1155FromVault(
        uint256 assetType,
        uint256 tokenId,
        uint256 vaultId,
        uint256 quantizedAmount
    ) external {
        require(isERC1155(assetType), "NOT_ERC1155_TOKEN");
        // Update the vault balance and check withdrawal lock.
        uint256 assetId = calculateAssetIdWithTokenId(assetType, tokenId);
        updateVaultForWithdrawal(assetId, vaultId, quantizedAmount);
        // Transfer funds.
        transferOutWithTokenId(msg.sender, assetType, tokenId, quantizedAmount);
        // Log event.
        emit LogWithdrawalFromVault(
            msg.sender,
            assetType,
            assetId,
            vaultId,
            fromQuantized(assetId, quantizedAmount),
            quantizedAmount
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

    function calculateMintableAssetId(uint256 assetType, bytes memory mintingBlob)
        public
        pure
        virtual
        returns (uint256);
}

library Addresses {
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function performEthTransfer(address recipient, uint256 amount) internal {
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

    /*
      Validates that the passed contract address is of a real contract,
      and that its id hash (as infered fromn identify()) matched the expected one.
    */
    function validateContractId(address contractAddress, bytes32 expectedIdHash) internal {
        require(isContract(contractAddress), "ADDRESS_NOT_CONTRACT");
        (bool success, bytes memory returndata) = contractAddress.call( // NOLINT: low-level-calls.
            abi.encodeWithSignature("identify()")
        );
        require(success, "FAILED_TO_IDENTIFY_CONTRACT");
        string memory realContractId = abi.decode(returndata, (string));
        require(
            keccak256(abi.encodePacked(realContractId)) == expectedIdHash,
            "UNEXPECTED_CONTRACT_IDENTIFIER"
        );
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
            tokenSelector == MINTABLE_ERC20_SELECTOR || tokenSelector == MINTABLE_ERC721_SELECTOR;
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
            tokenSelector == MINTABLE_ERC20_SELECTOR ||
            tokenSelector == MINTABLE_ERC721_SELECTOR ||
            tokenSelector == ERC1155_SELECTOR;
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

    function calculateMintableAssetId(uint256 assetType, bytes memory mintingBlob)
        public
        pure
        override
        returns (uint256 assetId)
    {
        uint256 blobHash = uint256(keccak256(mintingBlob));
        assetId =
            (uint256(keccak256(abi.encodePacked(MINTABLE_PREFIX, assetType, blobHash))) &
                MASK_240) |
            MINTABLE_ASSET_ID_FLAG;
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
    StarkExTypes.ApprovalChainData verifiersChain;
    StarkExTypes.ApprovalChainData availabilityVerifiersChain;

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

    // The 64th bit (indexed 63, counting from 0) is a flag indicating a rollup vault id.
    uint256 constant ROLLUP_VAULTS_BIT = 63;
}

contract StarkExConstants is LibConstants {
    uint256 constant STARKEX_EXPIRATION_TIMESTAMP_BITS = 22;
    uint256 public constant STARKEX_MAX_DEFAULT_VAULT_LOCK = 7 days;
}

abstract contract MVaultLocks {
    function applyDefaultLock(uint256 assetId, uint256 vaultId) internal virtual;

    function isVaultLocked(
        address ethKey,
        uint256 assetId,
        uint256 vaultId
    ) public view virtual returns (bool);
}

abstract contract VaultLocks is StarkExStorage, StarkExConstants, MGovernance, MVaultLocks {
    event LogDefaultVaultWithdrawalLockSet(uint256 newDefaultLockTime);
    event LogVaultWithdrawalLockSet(
        address ethKey,
        uint256 assetId,
        uint256 vaultId,
        uint256 timeRelease
    );

    function initialize(uint256 defaultLockTime) internal {
        setDefaultVaultWithdrawalLock(defaultLockTime);
    }

    function setDefaultVaultWithdrawalLock(uint256 newDefaultTime) public onlyGovernance {
        require(newDefaultTime <= STARKEX_MAX_DEFAULT_VAULT_LOCK, "DEFAULT_LOCK_TIME_TOO_LONG");
        defaultVaultWithdrawalLock = newDefaultTime;
        emit LogDefaultVaultWithdrawalLockSet(newDefaultTime);
    }

    function getVaultWithdrawalLock(
        address ethKey,
        uint256 assetId,
        uint256 vaultId
    ) public view returns (uint256) {
        return vaultsWithdrawalLocks[ethKey][assetId][vaultId];
    }

    function lockVault(
        uint256 assetId,
        uint256 vaultId,
        uint256 lockTime
    ) public {
        uint256 currentLockRelease = getVaultWithdrawalLock(msg.sender, assetId, vaultId);
        uint256 timeRelease = block.timestamp + lockTime;
        require(timeRelease >= currentLockRelease, "INVALID_LOCK_TIME");

        vaultsWithdrawalLocks[msg.sender][assetId][vaultId] = timeRelease;
        emit LogVaultWithdrawalLockSet(msg.sender, assetId, vaultId, timeRelease);
    }

    function applyDefaultLock(uint256 assetId, uint256 vaultId) internal override {
        uint256 currentLockRelease = getVaultWithdrawalLock(msg.sender, assetId, vaultId);
        if (currentLockRelease < block.timestamp + defaultVaultWithdrawalLock) {
            lockVault(assetId, vaultId, defaultVaultWithdrawalLock);
        }
    }

    function isVaultLocked(
        address ethKey,
        uint256 assetId,
        uint256 vaultId
    ) public view override returns (bool) {
        uint256 timeRelease = getVaultWithdrawalLock(ethKey, assetId, vaultId);
        return (block.timestamp < timeRelease);
    }
}

contract GovernanceStorage {
    // A map from a Governor tag to its own GovernanceInfoStruct.
    mapping(string => GovernanceInfoStruct) internal governanceInfo; //NOLINT uninitialized-state.
}

abstract contract MGovernance {
    function _isGovernor(address testGovernor) internal view virtual returns (bool);

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
        gub.initialized = true; // to ensure addGovernor() won't fail.
        // Add the initial governer.
        addGovernor(msg.sender);
    }

    function _isGovernor(address testGovernor) internal view override returns (bool) {
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        return gub.effectiveGovernors[testGovernor];
    }

    /*
      Cancels the nomination of a governor candidate.
    */
    function _cancelNomination() internal onlyGovernance {
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        gub.candidateGovernor = address(0x0);
        emit LogNominationCancelled();
    }

    function _nominateNewGovernor(address newGovernor) internal onlyGovernance {
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        require(!_isGovernor(newGovernor), "ALREADY_GOVERNOR");
        gub.candidateGovernor = newGovernor;
        emit LogNominatedGovernor(newGovernor);
    }

    /*
      The addGovernor is called in two cases:
      1. by _acceptGovernance when a new governor accepts its role.
      2. by initGovernance to add the initial governor.
      The difference is that the init path skips the nominate step
      that would fail because of the onlyGovernance modifier.
    */
    function addGovernor(address newGovernor) private {
        require(!_isGovernor(newGovernor), "ALREADY_GOVERNOR");
        GovernanceInfoStruct storage gub = getGovernanceInfo();
        gub.effectiveGovernors[newGovernor] = true;
    }

    function _acceptGovernance() internal {
        // The new governor was proposed as a candidate by the current governor.
        GovernanceInfoStruct storage gub = getGovernanceInfo();
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

    function mainIsGovernor(address testGovernor) external view returns (bool) {
        return _isGovernor(testGovernor);
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

    /*
      Returns an array with selectors for validation.
      These selectors are the critical ones for maintaining self custody and anti censorship.
      During the upgrade process, as part of the sub-contract validation, the MainDispatcher
      validates that the selectos are mapped to the correct sub-contract.
    */
    function validatedSelectors() external pure returns (bytes4[] memory);
}

contract OnchainVaults is
    SubContractor,
    MainGovernance,
    VaultLocks,
    TokenAssetData,
    TokenTransfers,
    TokenQuantization,
    VaultDepositWithdrawal
{
    function initialize(bytes calldata) external override {
        revert("NOT_IMPLEMENTED");
    }

    function initializerSize() external view override returns (uint256) {
        return 0;
    }

    function isStrictVaultBalancePolicy() external view returns (bool) {
        return strictVaultBalancePolicy;
    }

    function validatedSelectors() external pure override returns (bytes4[] memory selectors) {
        uint256 len_ = 2;
        uint256 index_ = 0;

        selectors = new bytes4[](len_);
        selectors[index_++] = VaultDepositWithdrawal.withdrawErc1155FromVault.selector;
        selectors[index_++] = VaultDepositWithdrawal.withdrawFromVault.selector;
        require(index_ == len_, "INCORRECT_SELECTORS_ARRAY_LENGTH");
    }

    function identify() external pure override returns (string memory) {
        return "StarkWare_OnchainVaults_2022_2";
    }
}