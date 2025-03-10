// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

library ECDSA {
    /**
     * @dev Returns the address that signed a hashed message (`hash`).
     * This address can then be used for verification purposes.
     * Receives the `v`, `r` and `s` signature fields separately.
     *
     * The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the `s` value to be in the lower
     * half order, and the `v` value to be either 27 or 28.
     *
     * IMPORTANT: `hash` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data.
     */
    function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address)
    {
        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (281): 0 < s < secp256k1n ÷ 2 + 1, and for v in (282): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        require(uint256(s) <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0, "ECDSA: invalid signature 's' value");

        // If the signature is valid (and not malleable), return the signer address
        address signer = ecrecover(hash, v, r, s);
        require(signer != address(0), "ECDSA: invalid signature");

        return signer;
    }

    /**
     * @dev Overload of `recover` that receives the `r` and `vs` short-signature fields separately.
     * See https://eips.ethereum.org/EIPS/eip-2098[EIP-2098 short signatures]
     */
    function recover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address) {
        bytes32 s;
        uint8 v;
        assembly {
            s := and(vs, 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
            v := add(shr(255, vs), 27)
        }
        return recover(hash, v, r, s);
    }
}

contract DepositSecurityModule {
    /**
     * @dev Short ECDSA signature as defined in https://eips.ethereum.org/EIPS/eip-2098.
     */
    struct Signature {
        bytes32 r;
        bytes32 vs;
    }

    event OwnerChanged(address newValue);
    event PauseIntentValidityPeriodBlocksChanged(uint256 newValue);
    event MaxOperatorsPerUnvettingChanged(uint256 newValue);
    event GuardianQuorumChanged(uint256 newValue);
    event GuardianAdded(address guardian);
    event GuardianRemoved(address guardian);
    event DepositsPaused(address indexed guardian);
    event DepositsUnpaused();
    event LastDepositBlockChanged(uint256 newValue);

    error ZeroAddress(string field);
    error DuplicateAddress(address addr);
    error NotAnOwner(address caller);
    error InvalidSignature();
    error SignaturesNotSorted();
    error DepositNoQuorum();
    error DepositRootChanged();
    error DepositInactiveModule();
    error DepositTooFrequent();
    error DepositUnexpectedBlockHash();
    error DepositsArePaused();
    error DepositsNotPaused();
    error ModuleNonceChanged();
    error PauseIntentExpired();
    error UnvetPayloadInvalid();
    error UnvetUnexpectedBlockHash();
    error NotAGuardian(address addr);
    error ZeroParameter(string parameter);

    /// @notice Represents the code version to help distinguish contract interfaces.
    uint256 public constant VERSION = 3;

    /// @notice Prefix for the message signed by guardians to attest a deposit.
    bytes32 public immutable ATTEST_MESSAGE_PREFIX;
    /// @notice Prefix for the message signed by guardians to pause deposits.
    bytes32 public immutable PAUSE_MESSAGE_PREFIX;
    /// @notice Prefix for the message signed by guardians to unvet signing keys.
    bytes32 public immutable UNVET_MESSAGE_PREFIX;

    ILido public immutable LIDO;
    IStakingRouter public immutable STAKING_ROUTER;
    IDepositContract public immutable DEPOSIT_CONTRACT;

    /// @notice Flag indicating whether deposits are paused.
    bool public isDepositsPaused;

    uint256 internal lastDepositBlock;

    uint256 internal pauseIntentValidityPeriodBlocks;
    uint256 internal maxOperatorsPerUnvetting;

    address internal owner;

    uint256 internal quorum;
    address[] internal guardians;
    mapping(address => uint256) internal guardianIndicesOneBased; // 1-based

    /**
     * @notice Initializes the contract with the given parameters.
     * @dev Reverts if any of the addresses is zero.
     *
     * Sets the last deposit block to the current block number.
     */
    constructor(
        address _lido,
        address _depositContract,
        address _stakingRouter,
        uint256 _pauseIntentValidityPeriodBlocks,
        uint256 _maxOperatorsPerUnvetting
    ) {
        if (_lido == address(0)) revert ZeroAddress("_lido");
        if (_depositContract == address(0)) revert ZeroAddress("_depositContract");
        if (_stakingRouter == address(0)) revert ZeroAddress("_stakingRouter");

        LIDO = ILido(_lido);
        STAKING_ROUTER = IStakingRouter(_stakingRouter);
        DEPOSIT_CONTRACT = IDepositContract(_depositContract);

        ATTEST_MESSAGE_PREFIX = keccak256(
            abi.encodePacked(
                // keccak256("lido.DepositSecurityModule.ATTEST_MESSAGE")
                bytes32(0x1085395a994e25b1b3d0ea7937b7395495fb405b31c7d22dbc3976a6bd01f2bf),
                block.chainid,
                address(this)
            )
        );

        PAUSE_MESSAGE_PREFIX = keccak256(
            abi.encodePacked(
                // keccak256("lido.DepositSecurityModule.PAUSE_MESSAGE")
                bytes32(0x9c4c40205558f12027f21204d6218b8006985b7a6359bcab15404bcc3e3fa122),
                block.chainid,
                address(this)
            )
        );

        UNVET_MESSAGE_PREFIX = keccak256(
            abi.encodePacked(
                // keccak256("lido.DepositSecurityModule.UNVET_MESSAGE")
                bytes32(0x2dd9727393562ed11c29080a884630e2d3a7078e71b313e713a8a1ef68948f6a),
                block.chainid,
                address(this)
            )
        );

        _setOwner(msg.sender);
        _setLastDepositBlock(block.number);
        _setPauseIntentValidityPeriodBlocks(_pauseIntentValidityPeriodBlocks);
        _setMaxOperatorsPerUnvetting(_maxOperatorsPerUnvetting);
    }

    /**
     * @notice Returns the owner of the contract.
     * @return owner The address of the owner.
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAnOwner(msg.sender);
        _;
    }

    /**
     * @notice Sets the owner of the contract.
     * @param newValue The address of the new owner.
     * @dev Only callable by the current owner.
     */
    function setOwner(address newValue) external onlyOwner {
        _setOwner(newValue);
    }

    function _setOwner(address _newOwner) internal {
        if (_newOwner == address(0)) revert ZeroAddress("_newOwner");
        owner = _newOwner;
        emit OwnerChanged(_newOwner);
    }

    /**
     * @notice Returns the number of blocks during which the pause intent is valid.
     * @return pauseIntentValidityPeriodBlocks The number of blocks during which the pause intent is valid.
     */
    function getPauseIntentValidityPeriodBlocks() external view returns (uint256) {
        return pauseIntentValidityPeriodBlocks;
    }

    /**
     * @notice Sets the number of blocks during which the pause intent is valid.
     * @param newValue The new number of blocks during which the pause intent is valid.
     * @dev Only callable by the owner.
     */
    function setPauseIntentValidityPeriodBlocks(uint256 newValue) external onlyOwner {
        _setPauseIntentValidityPeriodBlocks(newValue);
    }

    function _setPauseIntentValidityPeriodBlocks(uint256 newValue) internal {
        if (newValue == 0) revert ZeroParameter("pauseIntentValidityPeriodBlocks");
        pauseIntentValidityPeriodBlocks = newValue;
        emit PauseIntentValidityPeriodBlocksChanged(newValue);
    }

    /**
     * @notice Returns the maximum number of operators per unvetting.
     * @return maxOperatorsPerUnvetting The maximum number of operators per unvetting.
     */
    function getMaxOperatorsPerUnvetting() external view returns (uint256) {
        return maxOperatorsPerUnvetting;
    }

    /**
     * @notice Sets the maximum number of operators per unvetting.
     * @param newValue The new maximum number of operators per unvetting.
     * @dev Only callable by the owner.
     */
    function setMaxOperatorsPerUnvetting(uint256 newValue) external onlyOwner {
        _setMaxOperatorsPerUnvetting(newValue);
    }

    function _setMaxOperatorsPerUnvetting(uint256 newValue) internal {
        if (newValue == 0) revert ZeroParameter("maxOperatorsPerUnvetting");
        maxOperatorsPerUnvetting = newValue;
        emit MaxOperatorsPerUnvettingChanged(newValue);
    }

    /**
     * @notice Returns the number of guardians required to perform a deposit.
     * @return quorum The guardian quorum value.
     */
    function getGuardianQuorum() external view returns (uint256) {
        return quorum;
    }

    /**
     * @notice Sets the number of guardians required to perform a deposit.
     * @param newValue The new guardian quorum value.
     * @dev Only callable by the owner.
     */
    function setGuardianQuorum(uint256 newValue) external onlyOwner {
        _setGuardianQuorum(newValue);
    }

    function _setGuardianQuorum(uint256 newValue) internal {
        /// @dev This intentionally allows the quorum value to be set higher
        /// than the number of guardians.
        if (quorum != newValue) {
            quorum = newValue;
            emit GuardianQuorumChanged(newValue);
        }
    }

    /**
     * @notice Returns the list of guardian addresses.
     * @return guardians The list of guardian addresses.
     */
    function getGuardians() external view returns (address[] memory) {
        return guardians;
    }

    /**
     * @notice Returns whether the given address is a guardian.
     * @param addr The address to check.
     * @return isGuardian Whether the address is a guardian.
     */
    function isGuardian(address addr) external view returns (bool) {
        return _isGuardian(addr);
    }

    function _isGuardian(address addr) internal view returns (bool) {
        return guardianIndicesOneBased[addr] > 0;
    }

    /**
     * @notice Returns the index of the guardian with the given address.
     * @param addr The address of the guardian.
     * @return guardianIndex The index of the guardian.
     * @dev Returns -1 if the address is not a guardian.
     */
    function getGuardianIndex(address addr) external view returns (int256) {
        return _getGuardianIndex(addr);
    }

    function _getGuardianIndex(address addr) internal view returns (int256) {
        return int256(guardianIndicesOneBased[addr]) - 1;
    }

    /**
     * @notice Adds a guardian address and sets a new quorum value.
     * @param addr The address of the guardian.
     * @param newQuorum The new guardian quorum value.
     * @dev Only callable by the owner.
     * Reverts if the address is already a guardian or is zero.
     */
    function addGuardian(address addr, uint256 newQuorum) external onlyOwner {
        _addGuardian(addr);
        _setGuardianQuorum(newQuorum);
    }

    /**
     * @notice Adds multiple guardian addresses and sets a new quorum value.
     * @param addresses The list of guardian addresses.
     * @param newQuorum The new guardian quorum value.
     * @dev Only callable by the owner.
     * Reverts if any of the addresses is already a guardian or is zero.
     */
    function addGuardians(address[] memory addresses, uint256 newQuorum) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; ) {
            _addGuardian(addresses[i]);

            unchecked {
                ++i;
            }
        }
        _setGuardianQuorum(newQuorum);
    }

    function _addGuardian(address _newGuardian) internal {
        if (_newGuardian == address(0)) revert ZeroAddress("_newGuardian");
        if (_isGuardian(_newGuardian)) revert DuplicateAddress(_newGuardian);
        guardians.push(_newGuardian);
        guardianIndicesOneBased[_newGuardian] = guardians.length;
        emit GuardianAdded(_newGuardian);
    }

    /**
     * @notice Removes a guardian address and sets a new quorum value.
     * @param addr The address of the guardian.
     * @param newQuorum The new guardian quorum value.
     * @dev Only callable by the owner.
     * Reverts if the address is not a guardian.
     */
    function removeGuardian(address addr, uint256 newQuorum) external onlyOwner {
        uint256 indexOneBased = guardianIndicesOneBased[addr];
        if (indexOneBased == 0) revert NotAGuardian(addr);

        uint256 totalGuardians = guardians.length;
        assert(indexOneBased <= totalGuardians);

        if (indexOneBased != totalGuardians) {
            address addrToMove = guardians[totalGuardians - 1];
            guardians[indexOneBased - 1] = addrToMove;
            guardianIndicesOneBased[addrToMove] = indexOneBased;
        }

        guardianIndicesOneBased[addr] = 0;
        guardians.pop();

        _setGuardianQuorum(newQuorum);

        emit GuardianRemoved(addr);
    }

    /**
     * @notice Pauses deposits if both conditions are satisfied.
     * @param blockNumber The block number at which the pause intent was created.
     * @param sig The signature of the guardian.
     * @dev Does nothing if deposits are already paused.
     *
     * Reverts if:
     *  - the pause intent is expired;
     *  - the caller is not a guardian and signature is invalid or not from a guardian.
     *
     * The signature, if present, must be produced for the keccak256 hash of the following
     * message (each component taking 32 bytes):
     *
     * | PAUSE_MESSAGE_PREFIX | blockNumber |
     */
    function pauseDeposits(uint256 blockNumber, Signature memory sig) external {
        /// @dev In case of an emergency function `pauseDeposits` is supposed to be called
        /// by all guardians. Thus only the first call will do the actual change. But
        /// the other calls would be OK operations from the point of view of protocol’s logic.
        /// Thus we prefer not to use “error” semantics which is implied by `require`.
        if (isDepositsPaused) return;

        address guardianAddr = msg.sender;
        int256 guardianIndex = _getGuardianIndex(msg.sender);

        if (guardianIndex == -1) {
            bytes32 msgHash = keccak256(abi.encodePacked(PAUSE_MESSAGE_PREFIX, blockNumber));
            guardianAddr = ECDSA.recover(msgHash, sig.r, sig.vs);
            guardianIndex = _getGuardianIndex(guardianAddr);
            if (guardianIndex == -1) revert InvalidSignature();
        }

        if (block.number - blockNumber > pauseIntentValidityPeriodBlocks) revert PauseIntentExpired();

        isDepositsPaused = true;
        emit DepositsPaused(guardianAddr);
    }

    /**
     * @notice Unpauses deposits.
     * @dev Only callable by the owner.
     * Reverts if deposits are not paused.
     */
    function unpauseDeposits() external onlyOwner {
        if (!isDepositsPaused) revert DepositsNotPaused();
        isDepositsPaused = false;
        emit DepositsUnpaused();
    }

    /**
     * @notice Returns whether LIDO.deposit() can be called, given that the caller
     * will provide guardian attestations of non-stale deposit root and nonce,
     * and the number of such attestations will be enough to reach the quorum.
     *
     * @param stakingModuleId The ID of the staking module.
     * @return canDeposit Whether a deposit can be made.
     * @dev Returns true if all of the following conditions are met:
     *   - deposits are not paused;
     *   - the staking module is active;
     *   - the guardian quorum is not set to zero;
     *   - the deposit distance is greater than the minimum required;
     *   - LIDO.canDeposit() returns true.
     */
    function canDeposit(uint256 stakingModuleId) external view returns (bool) {
        if (!STAKING_ROUTER.hasStakingModule(stakingModuleId)) return false;

        bool isModuleActive = STAKING_ROUTER.getStakingModuleIsActive(stakingModuleId);
        bool isDepositDistancePassed = _isMinDepositDistancePassed(stakingModuleId);
        bool isLidoCanDeposit = LIDO.canDeposit();

        return (
            !isDepositsPaused
            && isModuleActive
            && quorum > 0
            && isDepositDistancePassed
            && isLidoCanDeposit
        );
    }

    /**
     * @notice Returns the block number of the last deposit.
     * @return lastDepositBlock The block number of the last deposit.
     */
    function getLastDepositBlock() external view returns (uint256) {
        return lastDepositBlock;
    }

    function _setLastDepositBlock(uint256 newValue) internal {
        lastDepositBlock = newValue;
        emit LastDepositBlockChanged(newValue);
    }

    /**
     * @notice Returns whether the deposit distance is greater than the minimum required.
     * @param stakingModuleId The ID of the staking module.
     * @return isMinDepositDistancePassed Whether the deposit distance is greater than the minimum required.
     * @dev Checks the distance for the last deposit to any staking module.
     */
    function isMinDepositDistancePassed(uint256 stakingModuleId) external view returns (bool) {
        return _isMinDepositDistancePassed(stakingModuleId);
    }

    function _isMinDepositDistancePassed(uint256 stakingModuleId) internal view returns (bool) {
        /// @dev The distance is reset when a deposit is made to any module. This prevents a front-run attack
        /// by colluding guardians on several modules at once, providing the necessary window for an honest
        /// guardian to react and pause deposits to all modules.
        uint256 lastDepositToModuleBlock = STAKING_ROUTER.getStakingModuleLastDepositBlock(stakingModuleId);
        uint256 minDepositBlockDistance = STAKING_ROUTER.getStakingModuleMinDepositBlockDistance(stakingModuleId);
        uint256 maxLastDepositBlock = lastDepositToModuleBlock >= lastDepositBlock ? lastDepositToModuleBlock : lastDepositBlock;
        return block.number - maxLastDepositBlock >= minDepositBlockDistance;
    }

    /**
     * @notice Calls LIDO.deposit(maxDepositsPerBlock, stakingModuleId, depositCalldata).
     * @param blockNumber The block number at which the deposit intent was created.
     * @param blockHash The block hash at which the deposit intent was created.
     * @param depositRoot The deposit root hash.
     * @param stakingModuleId The ID of the staking module.
     * @param nonce The nonce of the staking module.
     * @param depositCalldata The calldata for the deposit.
     * @param sortedGuardianSignatures The list of guardian signatures ascendingly sorted by address.
     * @dev Reverts if any of the following is true:
     *   - onchain deposit root is different from the provided one;
     *   - onchain module nonce is different from the provided one;
     *   - quorum is zero;
     *   - the number of guardian signatures is less than the quorum;
     *   - module is not active;
     *   - min deposit distance is not passed;
     *   - blockHash is zero or not equal to the blockhash(blockNumber);
     *   - deposits are paused;
     *   - invalid or non-guardian signature received.
     *
     * Signatures must be sorted in ascending order by address of the guardian. Each signature must
     * be produced for the keccak256 hash of the following message (each component taking 32 bytes):
     *
     * | ATTEST_MESSAGE_PREFIX | blockNumber | blockHash | depositRoot | stakingModuleId | nonce |
     */
    function depositBufferedEther(
        uint256 blockNumber,
        bytes32 blockHash,
        bytes32 depositRoot,
        uint256 stakingModuleId,
        uint256 nonce,
        bytes calldata depositCalldata,
        Signature[] calldata sortedGuardianSignatures
    ) external {
        /// @dev The first most likely reason for the signature to go stale
        bytes32 onchainDepositRoot = IDepositContract(DEPOSIT_CONTRACT).get_deposit_root();
        if (depositRoot != onchainDepositRoot) revert DepositRootChanged();

        /// @dev The second most likely reason for the signature to go stale
        uint256 onchainNonce = STAKING_ROUTER.getStakingModuleNonce(stakingModuleId);
        if (nonce != onchainNonce) revert ModuleNonceChanged();

        if (quorum == 0 || sortedGuardianSignatures.length < quorum) revert DepositNoQuorum();
        if (!STAKING_ROUTER.getStakingModuleIsActive(stakingModuleId)) revert DepositInactiveModule();
        if (!_isMinDepositDistancePassed(stakingModuleId)) revert DepositTooFrequent();
        if (blockHash == bytes32(0) || blockhash(blockNumber) != blockHash) revert DepositUnexpectedBlockHash();
        if (isDepositsPaused) revert DepositsArePaused();

        _verifyAttestSignatures(depositRoot, blockNumber, blockHash, stakingModuleId, nonce, sortedGuardianSignatures);

        uint256 maxDepositsPerBlock = STAKING_ROUTER.getStakingModuleMaxDepositsPerBlock(stakingModuleId);
        LIDO.deposit(maxDepositsPerBlock, stakingModuleId, depositCalldata);

        _setLastDepositBlock(block.number);
    }

    function _verifyAttestSignatures(
        bytes32 depositRoot,
        uint256 blockNumber,
        bytes32 blockHash,
        uint256 stakingModuleId,
        uint256 nonce,
        Signature[] memory sigs
    ) internal view {
        bytes32 msgHash = keccak256(
            abi.encodePacked(ATTEST_MESSAGE_PREFIX, blockNumber, blockHash, depositRoot, stakingModuleId, nonce)
        );

        address prevSignerAddr;
        address signerAddr;

        for (uint256 i = 0; i < sigs.length; ) {
            signerAddr = ECDSA.recover(msgHash, sigs[i].r, sigs[i].vs);
            if (!_isGuardian(signerAddr)) revert InvalidSignature();
            if (signerAddr <= prevSignerAddr) revert SignaturesNotSorted();
            prevSignerAddr = signerAddr;

            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Unvets signing keys for the given node operators.
     * @param blockNumber The block number at which the unvet intent was created.
     * @param blockHash The block hash at which the unvet intent was created.
     * @param stakingModuleId The ID of the staking module.
     * @param nonce The nonce of the staking module.
     * @param nodeOperatorIds The list of node operator IDs.
     * @param vettedSigningKeysCounts The list of vetted signing keys counts.
     * @param sig The signature of the guardian.
     * @dev Reverts if any of the following is true:
     *   - The nonce is not equal to the on-chain nonce of the staking module;
     *   - nodeOperatorIds is not packed with 8 bytes per id;
     *   - vettedSigningKeysCounts is not packed with 16 bytes per count;
     *   - the number of node operators is greater than maxOperatorsPerUnvetting;
     *   - the signature is invalid or the signer is not a guardian;
     *   - blockHash is zero or not equal to the blockhash(blockNumber).
     *
     * The signature, if present, must be produced for the keccak256 hash of the following message:
     *
     * | UNVET_MESSAGE_PREFIX | blockNumber | blockHash | stakingModuleId | nonce | nodeOperatorIds | vettedSigningKeysCounts |
     */
    function unvetSigningKeys(
        uint256 blockNumber,
        bytes32 blockHash,
        uint256 stakingModuleId,
        uint256 nonce,
        bytes calldata nodeOperatorIds,
        bytes calldata vettedSigningKeysCounts,
        Signature calldata sig
    ) external {
        /// @dev The most likely reason for the signature to go stale
        uint256 onchainNonce = STAKING_ROUTER.getStakingModuleNonce(stakingModuleId);
        if (nonce != onchainNonce) revert ModuleNonceChanged();

        uint256 nodeOperatorsCount = nodeOperatorIds.length / 8;

        if (
            nodeOperatorIds.length % 8 != 0 ||
            vettedSigningKeysCounts.length % 16 != 0 ||
            vettedSigningKeysCounts.length / 16 != nodeOperatorsCount ||
            nodeOperatorsCount > maxOperatorsPerUnvetting
        ) {
            revert UnvetPayloadInvalid();
        }

        address guardianAddr = msg.sender;
        int256 guardianIndex = _getGuardianIndex(msg.sender);

        if (guardianIndex == -1) {
            bytes32 msgHash = keccak256(
                // slither-disable-start encode-packed-collision
                // values with a dynamic type checked earlier
                abi.encodePacked(
                    UNVET_MESSAGE_PREFIX,
                    blockNumber,
                    blockHash,
                    stakingModuleId,
                    nonce,
                    nodeOperatorIds,
                    vettedSigningKeysCounts
                )
                // slither-disable-end encode-packed-collision
            );
            guardianAddr = ECDSA.recover(msgHash, sig.r, sig.vs);
            guardianIndex = _getGuardianIndex(guardianAddr);
            if (guardianIndex == -1) revert InvalidSignature();
        }

        if (blockHash == bytes32(0) || blockhash(blockNumber) != blockHash) revert UnvetUnexpectedBlockHash();

        STAKING_ROUTER.decreaseStakingModuleVettedKeysCountByNodeOperator(
            stakingModuleId,
            nodeOperatorIds,
            vettedSigningKeysCounts
        );
    }
}