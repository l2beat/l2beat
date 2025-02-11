// SPDX-License-Identifier: Unknown
pragma solidity 0.8.20;

library SafeERC20Upgradeable {
    using AddressUpgradeable for address;

    function safeTransfer(
        IERC20Upgradeable token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20Upgradeable token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    function safePermit(
        IERC20PermitUpgradeable token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20Upgradeable token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

interface IPolygonRollupManager {
    /**
     * @dev Thrown when sender is not the PolygonZkEVM address
     */
    error UpdateToSameRollupTypeID();

    /**
     * @dev Thrown when sender is not the PolygonZkEVM address
     */
    error RollupMustExist();

    /**
     * @dev Thrown when sender is not the PolygonZkEVM address
     */
    error SenderMustBeRollup();

    /**
     * @dev Thrown when sender is not the PolygonZkEVM address
     */
    error TrustedAggregatorTimeoutNotExpired();

    /**
     * @dev Thrown when sender is not the PolygonZkEVM address
     */
    error ExceedMaxVerifyBatches();

    /**
     * @dev Thrown when attempting to access a pending state that does not exist
     */
    error PendingStateDoesNotExist();

    /**
     * @dev Thrown when the init num batch does not match with the one in the pending state
     */
    error InitNumBatchDoesNotMatchPendingState();

    /**
     * @dev Thrown when the old state root of a certain batch does not exist
     */
    error OldStateRootDoesNotExist();

    /**
     * @dev Thrown when the init verification batch is above the last verification batch
     */
    error InitNumBatchAboveLastVerifiedBatch();

    /**
     * @dev Thrown when the final verification batch is below or equal the last verification batch
     */
    error FinalNumBatchBelowLastVerifiedBatch();

    /**
     * @dev Thrown when the zkproof is not valid
     */
    error InvalidProof();

    /**
     * @dev Thrown when attempting to consolidate a pending state not yet consolidable
     */
    error PendingStateNotConsolidable();

    /**
     * @dev Thrown when attempting to consolidate a pending state that is already consolidated or does not exist
     */
    error PendingStateInvalid();

    /**
     * @dev Thrown when the new accumulate input hash does not exist
     */
    error NewAccInputHashDoesNotExist();

    /**
     * @dev Thrown when the new state root is not inside prime
     */
    error NewStateRootNotInsidePrime();

    /**
     * @dev Thrown when the final pending state num is not in a valid range
     */
    error FinalPendingStateNumInvalid();

    /**
     * @dev Thrown when the final num batch does not match with the one in the pending state
     */
    error FinalNumBatchDoesNotMatchPendingState();

    /**
     * @dev Thrown when the stored root matches the new root proving a different state
     */
    error StoredRootMustBeDifferentThanNewRoot();

    /**
     * @dev Thrown when the halt timeout is not expired when attempting to activate the emergency state
     */
    error HaltTimeoutNotExpired();

    /**
     * @dev Thrown when the old accumulate input hash does not exist
     */
    error OldAccInputHashDoesNotExist();

    /**
     * @dev Thrown when attempting to set a new trusted aggregator timeout equal or bigger than current one
     */
    error NewTrustedAggregatorTimeoutMustBeLower();

    /**
     * @dev Thrown when attempting to set a new pending state timeout equal or bigger than current one
     */
    error NewPendingStateTimeoutMustBeLower();

    /**
     * @dev Thrown when attempting to set a new multiplier batch fee in a invalid range of values
     */
    error InvalidRangeMultiplierBatchFee();

    /**
     * @dev Thrown when attempting to set a batch time target in an invalid range of values
     */
    error InvalidRangeBatchTimeTarget();

    /**
     * @dev Thrown when the caller is not the pending admin
     */
    error ChainIDAlreadyExist();

    /**
     * @dev Thrown when the caller is not the pending admin
     */
    error MustSequenceSomeBatch();

    /**
     * @dev When a rollup type does not exist
     */
    error RollupTypeDoesNotExist();

    /**
     * @dev When a rollup type does not exist
     */
    error RollupTypeObsolete();

    /**
     * @dev When a rollup type does not exist
     */
    error InitBatchMustMatchCurrentForkID();

    /**
     * @dev When a rollup type does not exist
     */
    error UpdateNotCompatible();

    /**
     * @dev When a rollup type does not exist
     */
    error BatchFeeOutOfRange();

    /**
     * @dev When a rollup type does not exist
     */
    error AllzkEVMSequencedBatchesMustBeVerified();

    /**
     * @dev When adding an existing rollup where the rollup address already was added
     */
    error RollupAddressAlreadyExist();

    /**
     * @dev When verifying proof for multiple roolups and they are not ordered by ID
     */
    error RollupIDNotAscendingOrder();

    /**
     * @dev When try to create a new rollup and set a chainID bigger than 32 bits
     */
    error ChainIDOutOfRange();

    /**
     * @dev When try to upgrade a rollup a sender that's not the admin of the rollup
     */
    error OnlyRollupAdmin();

    /**
     * @dev When try to update a rollup with sequences pending to verify
     */
    error AllSequencedMustBeVerified();

    /**
     * @dev Thrown when do not sequence any blob
     */
    error MustSequenceSomeBlob();

    /**
     * @dev Thrown when the final verification sequence is below or equal the last verification sequence
     */
    error FinalNumSequenceBelowLastVerifiedSequence();

    /**
     * @dev When the init sequence was verified in another forkID
     */
    error InitSequenceMustMatchCurrentForkID();

    /**
     * @dev Thrown when the init num sequence does not match with the one in the pending state
     */
    error InitSequenceNumDoesNotMatchPendingState();

    /**
     * @dev Thrown when the final num sequence does not match with the one in the pending state
     */
    error FinalNumSequenceDoesNotMatchPendingState();

    /**
     * @dev Thrown when attempting to set a new multiplier zkgas in a invalid range of values
     */
    error InvalidRangeMultiplierZkGasPrice();

    /**
     * @dev Thrown when attempting to set a seuqnece time target in an invalid range of values
     */
    error InvalidRangeSequenceTimeTarget();

    /**
     * @dev When a set a zkgasprice out of range
     */
    error zkGasPriceOfRange();

    /**
     * @dev Cannot update from network admin with unconsolidated pending state
     */
    error CannotUpdateWithUnconsolidatedPendingState();

    /**
     * @dev Try to verify batches without any sequence data
     */
    error EmptyVerifySequencesData();

    /**
     * @dev Update to old rollup ID
     */
    error UpdateToOldRollupTypeID();

    /**
     * @dev All batches must be verified before the upgrade
     */
    error AllBatchesMustBeVerified();

    /**
     * @dev Rollback batch is not sequenced
     */
    error RollbackBatchIsNotValid();

    /**
     * @dev Rollback batch is not the end of any sequence
     */
    error RollbackBatchIsNotEndOfSequence();

    /**
     * @dev rollbackBatches is called from a non authorized address
     */
    error NotAllowedAddress();

    /**
     * @dev Invalid Rollup type parameters
     */
    error InvalidRollupType();

    /**
     * @dev Invalid Rollup parameters
     */
    error InvalidRollup();

    /**
     * @dev Not valid L1 info tree leaf count
     */
    error L1InfoTreeLeafCountInvalid();

    /**
     * @dev Only State Transition Chains
     */
    error OnlyStateTransitionChains();

    /**
     * @dev Pending state num exist
     */
    error PendingStateNumExist();

    /**
     * @dev Only Chains with Pesismistic proofs
     */
    error OnlyChainsWithPessimisticProofs();

    /**
     * @dev Invalid Pessimistic proof
     */
    error InvalidPessimisticProof();

    /**
     * @dev Invalid Verifier Type when getting rollup data
     */
    error InvalidVerifierType();

    enum VerifierType {
        StateTransition,
        Pessimistic
    }

    function addNewRollupType(
        address consensusImplementation,
        address verifier,
        uint64 forkID,
        VerifierType rollupVerifierType,
        bytes32 initRoot,
        string memory description,
        bytes32 programVKey
    ) external;

    function obsoleteRollupType(uint32 rollupTypeID) external;

    function createNewRollup(
        uint32 rollupTypeID,
        uint64 chainID,
        address admin,
        address sequencer,
        address gasTokenAddress,
        string memory sequencerURL,
        string memory networkName
    ) external;

    function addExistingRollup(
        IPolygonRollupBase rollupAddress,
        address verifier,
        uint64 forkID,
        uint64 chainID,
        bytes32 initRoot,
        VerifierType rollupVerifierType,
        bytes32 programVKey
    ) external;

    function updateRollupByRollupAdmin(
        ITransparentUpgradeableProxy rollupContract,
        uint32 newRollupTypeID
    ) external;

    function updateRollup(
        ITransparentUpgradeableProxy rollupContract,
        uint32 newRollupTypeID,
        bytes memory upgradeData
    ) external;

    function rollbackBatches(
        IPolygonRollupBase rollupContract,
        uint64 targetBatch
    ) external;

    function onSequenceBatches(
        uint64 newSequencedBatches,
        bytes32 newAccInputHash
    ) external returns (uint64);

    function verifyBatchesTrustedAggregator(
        uint32 rollupID,
        uint64 pendingStateNum,
        uint64 initNumBatch,
        uint64 finalNewBatch,
        bytes32 newLocalExitRoot,
        bytes32 newStateRoot,
        address beneficiary,
        bytes32[24] calldata proof
    ) external;

    function verifyPessimisticTrustedAggregator(
        uint32 rollupID,
        uint32 l1InfoTreeLeafCount,
        bytes32 newLocalExitRoot,
        bytes32 newPessimisticRoot,
        bytes calldata proof
    ) external;

    function activateEmergencyState() external;

    function deactivateEmergencyState() external;

    function setBatchFee(uint256 newBatchFee) external;

    function getRollupExitRoot() external returns (bytes32);

    function getLastVerifiedBatch(uint32 rollupID) external returns (uint64);

    function calculateRewardPerBatch() external returns (uint256);

    function getBatchFee() external returns (uint256);

    function getForcedBatchFee() external returns (uint256);

    function getInputPessimisticBytes(
        uint32 rollupID,
        bytes32 selectedGlobalExitRoot,
        bytes32 newLocalExitRoot,
        bytes32 newPessimisticRoot
    ) external returns (bytes memory);

    function getInputSnarkBytes(
        uint32 rollupID,
        uint64 initNumBatch,
        uint64 finalNewBatch,
        bytes32 newLocalExitRoot,
        bytes32 oldStateRoot,
        bytes32 newStateRoot
    ) external returns (bytes memory);

    function getRollupBatchNumToStateRoot(
        uint32 rollupID,
        uint64 batchNum
    ) external returns (bytes32);

    function lastDeactivatedEmergencyStateTimestamp() external returns (uint64);
}

contract PolygonConstantsBase {
    // If the system a does not verify a batch inside this time window, the contract enters in emergency mode
    uint64 internal constant _HALT_AGGREGATION_TIMEOUT = 1 weeks;

    // Maximum batches that can be verified in one call. It depends on our current metrics
    // This should be a protection against someone that tries to generate huge chunk of invalid batches, and we can't prove otherwise before the pending timeout expires
    uint64 internal constant _MAX_VERIFY_BATCHES = 1000;
}

contract LegacyZKEVMStateVariables {
    /**
     * @notice Struct which will be stored for every batch sequence
     * @param accInputHash Hash chain that contains all the information to process a batch:
     * Before etrog: keccak256(bytes32 oldAccInputHash, keccak256(bytes transactions), bytes32 globalExitRoot, uint64 timestamp, address seqAddress)
     * Etrog: keccak256(bytes32 oldAccInputHash, keccak256(bytes transactions), bytes32 l1InfoRoot/forcedGlobalExitRoot, uint64 currentTimestamp/forcedTimestamp, address l2Coinbase, bytes32 0/forcedBlockHashL1)
     * @param sequencedTimestamp Sequenced timestamp
     * @param previousLastBatchSequenced Previous last batch sequenced before the current one, this is used to properly calculate the fees
     */
    struct SequencedBatchData {
        bytes32 accInputHash;
        uint64 sequencedTimestamp;
        uint64 previousLastBatchSequenced;
    }

    /**
     * @notice Struct to store the pending states
     * Pending state will be an intermediary state, that after a timeout can be consolidated, which means that will be added
     * to the state root mapping, and the global exit root will be updated
     * This is a protection mechanism against soundness attacks, that will be turned off in the future
     * @param timestamp Timestamp where the pending state is added to the queue
     * @param lastVerifiedBatch Last batch verified batch of this pending state
     * @param exitRoot Pending exit root
     * @param stateRoot Pending state root
     */
    struct PendingState {
        uint64 timestamp;
        uint64 lastVerifiedBatch;
        bytes32 exitRoot;
        bytes32 stateRoot;
    }

    // Time target of the verification of a batch
    // Adaptatly the batchFee will be updated to achieve this target
    /// @custom:oz-renamed-from verifyBatchTimeTarget
    uint64 internal _legacyVerifyBatchTimeTarget;

    // Batch fee multiplier with 3 decimals that goes from 1000 - 1023
    /// @custom:oz-renamed-from multiplierBatchFee
    uint16 internal _legacyMultiplierBatchFee;

    // Trusted sequencer address
    /// @custom:oz-renamed-from trustedSequencer
    address internal _legacyTrustedSequencer;

    // Current matic fee per batch sequenced
    /// @custom:oz-renamed-from batchFee
    uint256 internal _legacyBatchFee;

    // Queue of forced batches with their associated data
    // ForceBatchNum --> hashedForcedBatchData
    // hashedForcedBatchData: hash containing the necessary information to force a batch:
    // keccak256(keccak256(bytes transactions), bytes32 globalExitRoot, unint64 minForcedTimestamp)
    /// @custom:oz-renamed-from forcedBatches
    mapping(uint64 => bytes32) internal _legacyForcedBatches;

    // Queue of batches that defines the virtual state
    // SequenceBatchNum --> SequencedBatchData
    /// @custom:oz-renamed-from sequencedBatches
    mapping(uint64 => SequencedBatchData) internal _legacySequencedBatches;

    // Last sequenced timestamp
    /// @custom:oz-renamed-from lastTimestamp
    uint64 internal _legacyLastTimestamp;

    // Last batch sent by the sequencers
    /// @custom:oz-renamed-from lastBatchSequenced
    uint64 internal _legacylastBatchSequenced;

    // Last forced batch included in the sequence
    /// @custom:oz-renamed-from lastForceBatchSequenced
    uint64 internal _legacyLastForceBatchSequenced;

    // Last forced batch
    /// @custom:oz-renamed-from lastForceBatch
    uint64 internal _legacyLastForceBatch;

    // Last batch verified by the aggregators
    /// @custom:oz-renamed-from lastVerifiedBatch
    uint64 internal _legacyLastVerifiedBatch;

    // Trusted aggregator address
    /// @custom:oz-renamed-from trustedAggregator
    address internal _legacyTrustedAggregator;

    // State root mapping
    // BatchNum --> state root
    /// @custom:oz-renamed-from batchNumToStateRoot
    mapping(uint64 => bytes32) internal _legacyBatchNumToStateRoot;

    // Trusted sequencer URL
    /// @custom:oz-renamed-from trustedSequencerURL
    string internal _legacyTrustedSequencerURL;

    // L2 network name
    /// @custom:oz-renamed-from networkName
    string internal _legacyNetworkName;

    // Pending state mapping
    // pendingStateNumber --> PendingState
    /// @custom:oz-renamed-from pendingStateTransitions
    mapping(uint256 => PendingState) internal _legacyPendingStateTransitions;

    // Last pending state
    /// @custom:oz-renamed-from lastPendingState
    uint64 internal _legacyLastPendingState;

    // Last pending state consolidated
    /// @custom:oz-renamed-from lastPendingStateConsolidated
    uint64 internal _legacyLastPendingStateConsolidated;

    // Once a pending state exceeds this timeout it can be consolidated
    /// @custom:oz-renamed-from pendingStateTimeout
    uint64 internal _legacyPendingStateTimeout;

    // Trusted aggregator timeout, if a sequence is not verified in this time frame,
    // everyone can verify that sequence
    /// @custom:oz-renamed-from trustedAggregatorTimeout
    uint64 internal _legacyTrustedAggregatorTimeout;

    // Address that will be able to adjust contract parameters or stop the emergency state
    /// @custom:oz-renamed-from admin
    address internal _legacyAdmin;

    // This account will be able to accept the admin role
    /// @custom:oz-renamed-from pendingAdmin
    address internal _legacyPendingAdmin;

    // Force batch timeout
    /// @custom:oz-renamed-from forceBatchTimeout
    uint64 internal _legacyForceBatchTimeout;

    // Indicates if forced batches are disallowed
    /// @custom:oz-renamed-from isForcedBatchDisallowed
    bool internal _legacyIsForcedBatchDisallowed;

    // Indicates the current version
    /// @custom:oz-renamed-from version
    uint256 internal _legacyVersion;

    // Last batch verified before the last upgrade
    /// @custom:oz-renamed-from lastVerifiedBatchBeforeUpgrade
    uint256 internal _legacyLastVerifiedBatchBeforeUpgrade;
}

contract EmergencyManager {
    /**
     * @dev Thrown when emergency state is active, and the function requires otherwise
     */
    error OnlyNotEmergencyState();

    /**
     * @dev Thrown when emergency state is not active, and the function requires otherwise
     */
    error OnlyEmergencyState();

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     */
    uint256[10] private _gap;

    // Indicates whether the emergency state is active or not
    bool public isEmergencyState;

    /**
     * @dev Emitted when emergency state is activated
     */
    event EmergencyStateActivated();

    /**
     * @dev Emitted when emergency state is deactivated
     */
    event EmergencyStateDeactivated();

    /**
     * @notice Only allows a function to be callable if emergency state is unactive
     */
    modifier ifNotEmergencyState() {
        if (isEmergencyState) {
            revert OnlyNotEmergencyState();
        }
        _;
    }

    /**
     * @notice Only allows a function to be callable if emergency state is active
     */
    modifier ifEmergencyState() {
        if (!isEmergencyState) {
            revert OnlyEmergencyState();
        }
        _;
    }

    /**
     * @notice Activate emergency state
     */
    function _activateEmergencyState() internal virtual ifNotEmergencyState {
        isEmergencyState = true;
        emit EmergencyStateActivated();
    }

    /**
     * @notice Deactivate emergency state
     */
    function _deactivateEmergencyState() internal virtual ifEmergencyState {
        isEmergencyState = false;
        emit EmergencyStateDeactivated();
    }
}

library AddressUpgradeable {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint8 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
     * constructor.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        bool isTopLevelCall = !_initializing;
        require(
            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
            "Initializable: contract is already initialized"
        );
        _initialized = 1;
        if (isTopLevelCall) {
            _initializing = true;
        }
        _;
        if (isTopLevelCall) {
            _initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: setting the version to 255 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint8 version) {
        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
        _initialized = version;
        _initializing = true;
        _;
        _initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized < type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint8) {
        return _initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _initializing;
    }
}

abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

interface IAccessControlUpgradeable {
    /**
     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     *
     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
     * {RoleAdminChanged} not being emitted signaling this.
     *
     * _Available since v3.1._
     */
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);

    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that originated the contract call, an admin role
     * bearer except when using {AccessControl-_setupRole}.
     */
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) external view returns (bool);

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) external view returns (bytes32);

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) external;
}

abstract contract PolygonAccessControlUpgradeable is
    Initializable,
    ContextUpgradeable,
    IAccessControlUpgradeable
{
    function __AccessControl_init() internal onlyInitializing {}

    // Legacy variable
    /// @custom:oz-renamed-from _owner
    address internal _legacyOwner;

    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * @dev Thrown when the addres does not have the required role
     */
    error AddressDoNotHaveRequiredRole();

    /**
     * @dev Thrown when the renounce address is not the message sender
     */
    error AccessControlOnlyCanRenounceRolesForSelf();

    /**
     * @dev Modifier that checks that an account has a specific role. Reverts
     * with a standardized message including the required role.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     *
     * _Available since v4.1._
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(
        bytes32 role,
        address account
    ) public view virtual override returns (bool) {
        return _roles[role].members[account];
    }

    /**
     * @dev Revert with a standard message if `msg.sender` is missing `role`.
     * Overriding this function changes the behavior of the {onlyRole} modifier.
     *
     * Format of the revert message is described in {_checkRole}.
     *
     * _Available since v4.6._
     */
    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, msg.sender);
    }

    /**
     * @dev Revert with a standard message if `account` is missing `role`.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     */
    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert AddressDoNotHaveRequiredRole();
        }
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(
        bytes32 role
    ) public view virtual override returns (bytes32) {
        return _roles[role].adminRole;
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleGranted} event.
     */
    function grantRole(
        bytes32 role,
        address account
    ) public virtual override onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleRevoked} event.
     */
    function revokeRole(
        bytes32 role,
        address account
    ) public virtual override onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been revoked `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     *
     * May emit a {RoleRevoked} event.
     */
    function renounceRole(
        bytes32 role,
        address account
    ) public virtual override {
        if (account != msg.sender) {
            revert AccessControlOnlyCanRenounceRolesForSelf();
        }

        _revokeRole(role, account);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event. Note that unlike {grantRole}, this function doesn't perform any
     * checks on the calling account.
     *
     * May emit a {RoleGranted} event.
     *
     * [WARNING]
     * ====
     * This function should only be called from the constructor when setting
     * up the initial roles for the system.
     *
     * Using this function in any other way is effectively circumventing the admin
     * system imposed by {AccessControl}.
     * ====
     *
     * NOTE: This function is deprecated in favor of {_grantRole}.
     */
    function _setupRole(bytes32 role, address account) internal virtual {
        _grantRole(role, account);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     *
     * Emits a {RoleAdminChanged} event.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        bytes32 previousAdminRole = getRoleAdmin(role);
        _roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].members[account] = true;
            emit RoleGranted(role, account, msg.sender);
        }
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _roles[role].members[account] = false;
            emit RoleRevoked(role, account, msg.sender);
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[48] private __gap;
}

contract PolygonRollupManager is
    PolygonAccessControlUpgradeable,
    EmergencyManager,
    LegacyZKEVMStateVariables,
    PolygonConstantsBase,
    IPolygonRollupManager
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * @notice Struct which to store the rollup type data
     * @param consensusImplementation Consensus implementation ( contains the consensus logic for the transaparent proxy)
     * @param address verifier
     * @param forkID fork ID
     * @param rollupVerifierType Rollup compatibility ID, to check upgradability between rollup types
     * @param obsolete Indicates if the rollup type is obsolete
     * @param genesis Genesis block of the rollup, note that will only be used on creating new rollups, not upgrade them
     * @param programVKey Hashed program that will be executed in case of using a "general purpose ZK verifier" e.g SP1
     */
    struct RollupType {
        address consensusImplementation;
        address verifier;
        uint64 forkID;
        /// @custom:oz-renamed-from rollupCompatibilityID
        /// @custom:oz-retyped-from uint8
        VerifierType rollupVerifierType;
        bool obsolete;
        bytes32 genesis;
        bytes32 programVKey;
    }

    /**
     * @notice Struct which to store the rollup data of each chain
     * @param rollupContract Rollup consensus contract, which manages everything
     * related to sequencing transactions
     * @param chainID Chain ID of the rollup
     * @param verifier Verifier contract
     * @param forkID ForkID of the rollup
     * @param batchNumToStateRoot State root mapping
     * @param sequencedBatches Queue of batches that defines the virtual state
     * @param _legacyPendingStateTransitions Pending state mapping (deprecated)
     * @param lastLocalExitRoot Last exit root verified, used for compute the rollupExitRoot
     * @param lastBatchSequenced Last batch sent by the consensus contract
     * @param lastVerifiedBatch Last batch verified
     * @param _legacyLastPendingState Last pending state (deprecated)
     * @param _legacyLastPendingStateConsolidated Last pending state consolidated (deprecated)
     * @param lastVerifiedBatchBeforeUpgrade Last batch verified before the last upgrade
     * @param rollupTypeID Rollup type ID, can be 0 if it was added as an existing rollup
     * @param rollupVerifierType Rollup ID used for compatibility checks when upgrading
     * @param lastPessimisticRoot Pessimistic info, currently contains the local balance tree and the local nullifier tree hashed
     * @param programVKey Hashed program that will be executed in case of using a "general purpose ZK verifier" e.g SP1
     */
    struct RollupData {
        IPolygonRollupBase rollupContract;
        uint64 chainID;
        address verifier;
        uint64 forkID;
        mapping(uint64 batchNum => bytes32) batchNumToStateRoot;
        mapping(uint64 batchNum => SequencedBatchData) sequencedBatches;
        /// @custom:oz-renamed-from pendingStateTransitions
        mapping(uint256 pendingStateNum => PendingState) _legacyPendingStateTransitions;
        bytes32 lastLocalExitRoot;
        uint64 lastBatchSequenced;
        uint64 lastVerifiedBatch;
        /// @custom:oz-renamed-from lastPendingState
        uint64 _legacyLastPendingState;
        /// @custom:oz-renamed-from lastPendingStateConsolidated
        uint64 _legacyLastPendingStateConsolidated;
        uint64 lastVerifiedBatchBeforeUpgrade;
        uint64 rollupTypeID;
        /// @custom:oz-renamed-from rollupCompatibilityID
        /// @custom:oz-retyped-from uint8
        VerifierType rollupVerifierType;
        bytes32 lastPessimisticRoot;
        bytes32 programVKey;
    }

    /**
     * @notice Struct to return all the necessary rollup info: VerifierType StateTransition
     * @param rollupContract Rollup consensus contract, which manages everything
     * related to sequencing transactions
     * @param chainID Chain ID of the rollup
     * @param verifier Verifier contract
     * @param forkID ForkID of the rollup
     * @param lastLocalExitRoot Last exit root verified, used for compute the rollupExitRoot
     * @param lastBatchSequenced Last batch sent by the consensus contract
     * @param lastVerifiedBatch Last batch verified
     * @param _legacyLastPendingState Last pending state (deprecated)
     * @param _legacyLastPendingStateConsolidated Last pending state consolidated (deprecated)
     * @param lastVerifiedBatchBeforeUpgrade Last batch verified before the last upgrade
     * @param rollupTypeID Rollup type ID, can be 0 if it was added as an existing rollup
     * @param rollupVerifierType Rollup ID used for compatibility checks when upgrading
     */
    struct RollupDataReturn {
        IPolygonRollupBase rollupContract;
        uint64 chainID;
        address verifier;
        uint64 forkID;
        bytes32 lastLocalExitRoot;
        uint64 lastBatchSequenced;
        uint64 lastVerifiedBatch;
        uint64 _legacyLastPendingState;
        uint64 _legacyLastPendingStateConsolidated;
        uint64 lastVerifiedBatchBeforeUpgrade;
        uint64 rollupTypeID;
        VerifierType rollupVerifierType;
    }

    /**
     * @notice Struct which to store the rollup data of each chain
     * @param rollupContract Rollup consensus contract, which manages everything
     * related to sequencing transactions
     * @param chainID Chain ID of the rollup
     * @param verifier Verifier contract
     * @param forkID ForkID of the rollup
     * @param lastLocalExitRoot Last exit root verified, used for compute the rollupExitRoot
     * @param lastBatchSequenced Last batch sent by the consensus contract
     * @param lastVerifiedBatch Last batch verified
     * @param lastVerifiedBatchBeforeUpgrade Last batch verified before the last upgrade
     * @param rollupTypeID Rollup type ID, can be 0 if it was added as an existing rollup
     * @param rollupVerifierType Rollup ID used for compatibility checks when upgrading
     * @param lastPessimisticRoot Pessimistic info, currently contains the local balance tree and the local nullifier tree hashed
     * @param programVKey Hashed program that will be executed in case of using a "general purpose ZK verifier" e.g SP1
     */
    struct RollupDataReturnV2 {
        address rollupContract;
        uint64 chainID;
        address verifier;
        uint64 forkID;
        bytes32 lastLocalExitRoot;
        uint64 lastBatchSequenced;
        uint64 lastVerifiedBatch;
        uint64 lastVerifiedBatchBeforeUpgrade;
        uint64 rollupTypeID;
        VerifierType rollupVerifierType;
        bytes32 lastPessimisticRoot;
        bytes32 programVKey;
    }

    // Modulus zkSNARK
    uint256 internal constant _RFIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    // Max batch fee value
    uint256 internal constant _MAX_BATCH_FEE = 1000 ether;

    // Min value batch fee
    uint256 internal constant _MIN_BATCH_FEE = 1 gwei;

    // Goldilocks prime field
    uint256 internal constant _GOLDILOCKS_PRIME_FIELD = 0xFFFFFFFF00000001; // 2 ** 64 - 2 ** 32 + 1

    // Max uint64
    uint256 internal constant _MAX_UINT_64 = type(uint64).max; // 0xFFFFFFFFFFFFFFFF

    // Exit merkle tree levels
    uint256 internal constant _EXIT_TREE_DEPTH = 32;

    // Roles

    // Be able to add a new rollup type
    bytes32 internal constant _ADD_ROLLUP_TYPE_ROLE =
        keccak256("ADD_ROLLUP_TYPE_ROLE");

    // Be able to obsolete a rollup type, which means that new rollups cannot use this type
    bytes32 internal constant _OBSOLETE_ROLLUP_TYPE_ROLE =
        keccak256("OBSOLETE_ROLLUP_TYPE_ROLE");

    // Be able to create a new rollup using a rollup type
    bytes32 internal constant _CREATE_ROLLUP_ROLE =
        keccak256("CREATE_ROLLUP_ROLE");

    // Be able to create a new rollup which does not have to follow any rollup type.
    // Also sets the genesis block for that network
    bytes32 internal constant _ADD_EXISTING_ROLLUP_ROLE =
        keccak256("ADD_EXISTING_ROLLUP_ROLE");

    // Be able to update a rollup to a new rollup type that it's compatible
    bytes32 internal constant _UPDATE_ROLLUP_ROLE =
        keccak256("UPDATE_ROLLUP_ROLE");

    // Be able to that has priority to verify batches and consolidates the state instantly
    bytes32 internal constant _TRUSTED_AGGREGATOR_ROLE =
        keccak256("TRUSTED_AGGREGATOR_ROLE");

    // Be able to set the trusted aggregator address
    bytes32 internal constant _TRUSTED_AGGREGATOR_ROLE_ADMIN =
        keccak256("TRUSTED_AGGREGATOR_ROLE_ADMIN");

    // Be able to tweak parameters
    bytes32 internal constant _TWEAK_PARAMETERS_ROLE =
        keccak256("TWEAK_PARAMETERS_ROLE");

    // Be able to set the current batch fee
    bytes32 internal constant _SET_FEE_ROLE = keccak256("SET_FEE_ROLE");

    // Be able to stop the emergency state
    bytes32 internal constant _STOP_EMERGENCY_ROLE =
        keccak256("STOP_EMERGENCY_ROLE");

    // Be able to activate the emergency state without any further condition
    bytes32 internal constant _EMERGENCY_COUNCIL_ROLE =
        keccak256("EMERGENCY_COUNCIL_ROLE");

    // Be able to set the emergency council address
    bytes32 internal constant _EMERGENCY_COUNCIL_ADMIN =
        keccak256("EMERGENCY_COUNCIL_ADMIN");

    // Current rollup manager version
    string public constant ROLLUP_MANAGER_VERSION = "pessimistic";

    // Global Exit Root address
    IPolygonZkEVMGlobalExitRootV2 public immutable globalExitRootManager;

    // PolygonZkEVM Bridge Address
    IPolygonZkEVMBridge public immutable bridgeAddress;

    // POL token address
    IERC20Upgradeable public immutable pol;

    // Number of rollup types added, every new type will be assigned sequencially a new ID
    uint32 public rollupTypeCount;

    // Rollup type mapping
    /// @custom:oz-retyped-from PolygonRollupManagerPrevious.RollupType
    mapping(uint32 rollupTypeID => RollupType) public rollupTypeMap;

    // Number of rollups added, every new rollup will be assigned sequencially a new ID
    uint32 public rollupCount;

    // Rollups ID mapping
    /// @custom:oz-retyped-from PolygonRollupManagerPrevious.RollupData
    mapping(uint32 rollupID => RollupData) internal _rollupIDToRollupData;

    // Rollups address mapping
    mapping(address rollupAddress => uint32 rollupID) public rollupAddressToID;

    // Chain ID mapping for nullifying
    // note we will take care to avoid that current known chainIDs are not reused in our networks (example: 1)
    mapping(uint64 chainID => uint32 rollupID) public chainIDToRollupID;

    // Total sequenced batches across all rollups
    uint64 public totalSequencedBatches;

    // Total verified batches across all rollups
    uint64 public totalVerifiedBatches;

    // Last timestamp when an aggregation happen
    uint64 public lastAggregationTimestamp;

    // Trusted aggregator timeout, if a sequence is not verified in this time frame,
    // everyone can verify that sequence
    /// @custom:oz-renamed-from trustedAggregatorTimeout
    uint64 internal __legacyTrustedAggregatorTimeout;

    // Once a pending state exceeds this timeout it can be consolidated (deprecated)
    /// @custom:oz-renamed-from pendingStateTimeout
    uint64 internal __legacyPendingStateTimeout;

    // Time target of the verification of a batch
    // Adaptively the batchFee will be updated to achieve this target
    /// @custom:oz-renamed-from verifyBatchTimeTarget
    uint64 internal __legacyVerifyBatchTimeTarget;

    // Batch fee multiplier with 3 decimals that goes from 1000 - 1023
    /// @custom:oz-renamed-from multiplierBatchFee
    uint16 internal __legacyMultiplierBatchFee;

    // Current POL fee per batch sequenced
    // note This variable is internal, since the view function getBatchFee is likely to be upgraded
    uint256 internal _batchFee;

    // Timestamp when the last emergency state was deactivated
    uint64 public lastDeactivatedEmergencyStateTimestamp;

    /**
     * @dev Emitted when a new rollup type is added
     */
    event AddNewRollupType(
        uint32 indexed rollupTypeID,
        address consensusImplementation,
        address verifier,
        uint64 forkID,
        VerifierType rollupVerifierType,
        bytes32 genesis,
        string description,
        bytes32 programVKey
    );

    /**
     * @dev Emitted when a a rolup type is obsoleted
     */
    event ObsoleteRollupType(uint32 indexed rollupTypeID);

    /**
     * @dev Emitted when a new rollup is created based on a rollupType
     */
    event CreateNewRollup(
        uint32 indexed rollupID,
        uint32 rollupTypeID,
        address rollupAddress,
        uint64 chainID,
        address gasTokenAddress
    );

    /**
     * @dev Emitted when an existing rollup is added
     */
    event AddExistingRollup(
        uint32 indexed rollupID,
        uint64 forkID,
        address rollupAddress,
        uint64 chainID,
        VerifierType rollupVerifierType,
        uint64 lastVerifiedBatchBeforeUpgrade,
        bytes32 programVKey
    );

    /**
     * @dev Emitted when a rollup is udpated
     */
    event UpdateRollup(
        uint32 indexed rollupID,
        uint32 newRollupTypeID,
        uint64 lastVerifiedBatchBeforeUpgrade
    );

    /**
     * @dev Emitted when a new verifier is added
     */
    event OnSequenceBatches(uint32 indexed rollupID, uint64 lastBatchSequenced);

    /**
     * @dev Emitted when the trusted aggregator verifies batches
     */
    event VerifyBatchesTrustedAggregator(
        uint32 indexed rollupID,
        uint64 numBatch,
        bytes32 stateRoot,
        bytes32 exitRoot,
        address indexed aggregator
    );

    /**
     * @dev Emitted when rollback batches
     */
    event RollbackBatches(
        uint32 indexed rollupID,
        uint64 indexed targetBatch,
        bytes32 accInputHashToRollback
    );

    /**
     * @dev Emitted when is updated the trusted aggregator address
     */
    event SetTrustedAggregator(address newTrustedAggregator);

    /**
     * @dev Emitted when is updated the batch fee
     */
    event SetBatchFee(uint256 newBatchFee);

    /**
     * @dev Emitted when rollup manager is upgraded
     */
    event UpdateRollupManagerVersion(string rollupManagerVersion);

    /**
     * @param _globalExitRootManager Global exit root manager address
     * @param _pol POL token address
     * @param _bridgeAddress Bridge address
     */
    constructor(
        IPolygonZkEVMGlobalExitRootV2 _globalExitRootManager,
        IERC20Upgradeable _pol,
        IPolygonZkEVMBridge _bridgeAddress
    ) {
        globalExitRootManager = _globalExitRootManager;
        pol = _pol;
        bridgeAddress = _bridgeAddress;

        // Disable initalizers on the implementation following the best practices
        _disableInitializers();
    }

    /**
     * Initializer function to set new rollup manager version
     */
    function initialize() external virtual reinitializer(3) {
        emit UpdateRollupManagerVersion(ROLLUP_MANAGER_VERSION);
    }

    ///////////////////////////////////////
    // Rollups management functions
    ///////////////////////////////////////

    /**
     * @notice Add a new rollup type
     * @param consensusImplementation Consensus implementation
     * @param verifier Verifier address
     * @param forkID ForkID of the verifier
     * @param rollupVerifierType rollup verifier type
     * @param genesis Genesis block of the rollup
     * @param description Description of the rollup type
     * @param programVKey Hashed program that will be executed in case of using a "general purpose ZK verifier" e.g SP1
     */
    function addNewRollupType(
        address consensusImplementation,
        address verifier,
        uint64 forkID,
        VerifierType rollupVerifierType,
        bytes32 genesis,
        string memory description,
        bytes32 programVKey
    ) external onlyRole(_ADD_ROLLUP_TYPE_ROLE) {
        uint32 rollupTypeID = ++rollupTypeCount;

        if (rollupVerifierType == VerifierType.Pessimistic) {
            // No genesis on pessimistic rollups
            if (genesis != bytes32(0)) revert InvalidRollupType();
        } else {
            // No programVKey on state transition rollups
            if (programVKey != bytes32(0)) revert InvalidRollupType();
        }

        rollupTypeMap[rollupTypeID] = RollupType({
            consensusImplementation: consensusImplementation,
            verifier: verifier,
            forkID: forkID,
            rollupVerifierType: rollupVerifierType,
            obsolete: false,
            genesis: genesis,
            programVKey: programVKey
        });

        emit AddNewRollupType(
            rollupTypeID,
            consensusImplementation,
            verifier,
            forkID,
            rollupVerifierType,
            genesis,
            description,
            programVKey
        );
    }

    /**
     * @notice Obsolete Rollup type
     * @param rollupTypeID Rollup type to obsolete
     */
    function obsoleteRollupType(
        uint32 rollupTypeID
    ) external onlyRole(_OBSOLETE_ROLLUP_TYPE_ROLE) {
        // Check that rollup type exists
        if (rollupTypeID == 0 || rollupTypeID > rollupTypeCount) {
            revert RollupTypeDoesNotExist();
        }

        // Check rollup type is not obsolete
        RollupType storage currentRollupType = rollupTypeMap[rollupTypeID];
        if (currentRollupType.obsolete) {
            revert RollupTypeObsolete();
        }

        currentRollupType.obsolete = true;

        emit ObsoleteRollupType(rollupTypeID);
    }

    /**
     * @notice Create a new rollup
     * @param rollupTypeID Rollup type to deploy
     * @param chainID ChainID of the rollup, must be a new one, can not have more than 32 bits
     * @param admin Admin of the new created rollup
     * @param sequencer Sequencer of the new created rollup
     * @param gasTokenAddress Indicates the token address that will be used to pay gas fees in the new rollup
     * Note if a wrapped token of the bridge is used, the original network and address of this wrapped will be used instead
     * @param sequencerURL Sequencer URL of the new created rollup
     * @param networkName Network name of the new created rollup
     */
    function createNewRollup(
        uint32 rollupTypeID,
        uint64 chainID,
        address admin,
        address sequencer,
        address gasTokenAddress,
        string memory sequencerURL,
        string memory networkName
    ) external onlyRole(_CREATE_ROLLUP_ROLE) {
        // Check that rollup type exists
        if (rollupTypeID == 0 || rollupTypeID > rollupTypeCount) {
            revert RollupTypeDoesNotExist();
        }

        // Check rollup type is not obsolete
        RollupType storage rollupType = rollupTypeMap[rollupTypeID];
        if (rollupType.obsolete) {
            revert RollupTypeObsolete();
        }

        // check chainID max value
        // Currently we have this limitation by the circuit, might be removed in a future
        if (chainID > type(uint32).max) {
            revert ChainIDOutOfRange();
        }

        // Check chainID nullifier
        if (chainIDToRollupID[chainID] != 0) {
            revert ChainIDAlreadyExist();
        }

        // Create a new Rollup, using a transparent proxy pattern
        // Consensus will be the implementation, and this contract the admin
        uint32 rollupID = ++rollupCount;
        address rollupAddress = address(
            new PolygonTransparentProxy(
                rollupType.consensusImplementation,
                address(this),
                new bytes(0)
            )
        );

        // Set chainID nullifier
        chainIDToRollupID[chainID] = rollupID;

        // Store rollup data
        rollupAddressToID[rollupAddress] = rollupID;

        RollupData storage rollup = _rollupIDToRollupData[rollupID];

        rollup.rollupContract = IPolygonRollupBase(rollupAddress);
        rollup.forkID = rollupType.forkID;
        rollup.verifier = rollupType.verifier;
        rollup.chainID = chainID;
        rollup.batchNumToStateRoot[0] = rollupType.genesis;
        rollup.rollupTypeID = rollupTypeID;
        rollup.rollupVerifierType = rollupType.rollupVerifierType;
        rollup.programVKey = rollupType.programVKey;

        emit CreateNewRollup(
            rollupID,
            rollupTypeID,
            rollupAddress,
            chainID,
            gasTokenAddress
        );

        // Initialize new rollup
        IPolygonRollupBase(rollupAddress).initialize(
            admin,
            sequencer,
            rollupID,
            gasTokenAddress,
            sequencerURL,
            networkName
        );
    }

    /**
     * @notice Add an already deployed rollup
     * note that this rollup does not follow any rollupType
     * @param rollupAddress Rollup address
     * @param verifier Verifier address, must be added before
     * @param forkID Fork id of the added rollup
     * @param chainID Chain id of the added rollup
     * @param initRoot Genesis block for StateTransitionChains & localExitRoot for pessimistic chain
     * @param rollupVerifierType Compatibility ID for the added rollup
     * @param programVKey Hashed program that will be executed in case of using a "general purpose ZK verifier" e.g SP1
     */
    function addExistingRollup(
        IPolygonRollupBase rollupAddress,
        address verifier,
        uint64 forkID,
        uint64 chainID,
        bytes32 initRoot,
        VerifierType rollupVerifierType,
        bytes32 programVKey
    ) external onlyRole(_ADD_EXISTING_ROLLUP_ROLE) {
        // Check chainID nullifier
        if (chainIDToRollupID[chainID] != 0) {
            revert ChainIDAlreadyExist();
        }

        // check chainID max value
        // Currently we have this limitation by the circuit, might be removed in a future
        if (chainID > type(uint32).max) {
            revert ChainIDOutOfRange();
        }

        // Check if rollup address was already added
        if (rollupAddressToID[address(rollupAddress)] != 0) {
            revert RollupAddressAlreadyExist();
        }

        // Increment rollup count
        uint32 rollupID = ++rollupCount;

        // Set chainID nullifier
        chainIDToRollupID[chainID] = rollupID;

        // Store rollup data
        rollupAddressToID[address(rollupAddress)] = rollupID;

        RollupData storage rollup = _rollupIDToRollupData[rollupID];
        rollup.rollupContract = rollupAddress;
        rollup.forkID = forkID;
        rollup.verifier = verifier;
        rollup.chainID = chainID;
        rollup.rollupVerifierType = rollupVerifierType;

        // Check verifier type
        if (rollupVerifierType == VerifierType.Pessimistic) {
            rollup.programVKey = programVKey;
            rollup.lastLocalExitRoot = initRoot;
        } else {
            rollup.batchNumToStateRoot[0] = initRoot;
        }

        // rollup type is 0, since it does not follow any rollup type
        emit AddExistingRollup(
            rollupID,
            forkID,
            address(rollupAddress),
            chainID,
            rollupVerifierType,
            0,
            programVKey
        );
    }

    /**
     * @notice Upgrade an existing rollup from the rollup admin address
     * This address is able to udpate the rollup with more restrictions that the _UPDATE_ROLLUP_ROLE
     * @param rollupContract Rollup consensus proxy address
     * @param newRollupTypeID New rolluptypeID to upgrade to
     */
    function updateRollupByRollupAdmin(
        ITransparentUpgradeableProxy rollupContract,
        uint32 newRollupTypeID
    ) external {
        // Check admin of the network is msg.sender
        if (IPolygonRollupBase(address(rollupContract)).admin() != msg.sender) {
            revert OnlyRollupAdmin();
        }

        // Check all sequences are verified before upgrading
        RollupData storage rollup = _rollupIDToRollupData[
            rollupAddressToID[address(rollupContract)]
        ];

        // Check all sequenced batches are verified
        if (rollup.lastBatchSequenced != rollup.lastVerifiedBatch) {
            revert AllSequencedMustBeVerified();
        }

        // review sanity check
        if (rollup.rollupTypeID >= newRollupTypeID) {
            revert UpdateToOldRollupTypeID();
        }

        _updateRollup(rollupContract, newRollupTypeID, new bytes(0));
    }

    /**
     * @notice Upgrade an existing rollup
     * @param rollupContract Rollup consensus proxy address
     * @param newRollupTypeID New rolluptypeID to upgrade to
     * @param upgradeData Upgrade data
     */
    function updateRollup(
        ITransparentUpgradeableProxy rollupContract,
        uint32 newRollupTypeID,
        bytes memory upgradeData
    ) external onlyRole(_UPDATE_ROLLUP_ROLE) {
        _updateRollup(rollupContract, newRollupTypeID, upgradeData);
    }

    /**
     * @notice Upgrade an existing rollup
     * @param rollupContract Rollup consensus proxy address
     * @param newRollupTypeID New rolluptypeID to upgrade to
     * @param upgradeData Upgrade data
     */
    function _updateRollup(
        ITransparentUpgradeableProxy rollupContract,
        uint32 newRollupTypeID,
        bytes memory upgradeData
    ) internal {
        // Check that rollup type exists
        if (newRollupTypeID == 0 || newRollupTypeID > rollupTypeCount) {
            revert RollupTypeDoesNotExist();
        }

        // Check the rollup exists
        uint32 rollupID = rollupAddressToID[address(rollupContract)];
        if (rollupID == 0) {
            revert RollupMustExist();
        }

        RollupData storage rollup = _rollupIDToRollupData[rollupID];

        // The update must be to a new rollup type
        if (rollup.rollupTypeID == newRollupTypeID) {
            revert UpdateToSameRollupTypeID();
        }

        RollupType storage newRollupType = rollupTypeMap[newRollupTypeID];

        // Check rollup type is not obsolete
        if (newRollupType.obsolete) {
            revert RollupTypeObsolete();
        }

        // Check rollup types
        if (rollup.rollupVerifierType != newRollupType.rollupVerifierType) {
            revert UpdateNotCompatible();
        }

        // Update rollup parameters
        rollup.verifier = newRollupType.verifier;
        rollup.forkID = newRollupType.forkID;
        rollup.programVKey = newRollupType.programVKey;
        rollup.rollupTypeID = newRollupTypeID;

        uint64 lastVerifiedBatch = getLastVerifiedBatch(rollupID);
        rollup.lastVerifiedBatchBeforeUpgrade = lastVerifiedBatch;

        // Upgrade rollup
        rollupContract.upgradeToAndCall(
            newRollupType.consensusImplementation,
            upgradeData
        );

        emit UpdateRollup(rollupID, newRollupTypeID, lastVerifiedBatch);
    }

    /**
     * @notice Rollback batches of the target rollup
     * Only applies to state transition rollups
     * @param rollupContract Rollup consensus proxy address
     * @param targetBatch Batch to rollback up to but not including this batch
     */
    function rollbackBatches(
        IPolygonRollupBase rollupContract,
        uint64 targetBatch
    ) external {
        // Check msg.sender has _UPDATE_ROLLUP_ROLE rol or is the admin of the network
        if (
            !hasRole(_UPDATE_ROLLUP_ROLE, msg.sender) &&
            IPolygonRollupBase(address(rollupContract)).admin() != msg.sender
        ) {
            revert NotAllowedAddress();
        }

        // Check the rollup exists
        uint32 rollupID = rollupAddressToID[address(rollupContract)];
        if (rollupID == 0) {
            revert RollupMustExist();
        }

        // Load rollup
        RollupData storage rollup = _rollupIDToRollupData[rollupID];

        if (rollup.rollupVerifierType != VerifierType.StateTransition) {
            revert OnlyStateTransitionChains();
        }

        uint64 lastBatchSequenced = rollup.lastBatchSequenced;

        // Batch to rollback should be already sequenced
        if (
            targetBatch >= lastBatchSequenced ||
            targetBatch < rollup.lastVerifiedBatch
        ) {
            revert RollbackBatchIsNotValid();
        }

        uint64 currentBatch = lastBatchSequenced;

        // delete sequence batches structs until the targetBatch
        while (currentBatch != targetBatch) {
            // Load previous end of sequence batch
            uint64 previousBatch = rollup
                .sequencedBatches[currentBatch]
                .previousLastBatchSequenced;

            // Batch to rollback must be end of a sequence
            if (previousBatch < targetBatch) {
                revert RollbackBatchIsNotEndOfSequence();
            }

            // delete sequence information
            delete rollup.sequencedBatches[currentBatch];

            // Update current batch for next iteration
            currentBatch = previousBatch;
        }

        // Update last batch sequenced on rollup data
        rollup.lastBatchSequenced = targetBatch;

        // Update totalSequencedBatches
        totalSequencedBatches -= lastBatchSequenced - targetBatch;

        // Clean pending state if any
        rollupContract.rollbackBatches(
            targetBatch,
            rollup.sequencedBatches[targetBatch].accInputHash
        );

        emit RollbackBatches(
            rollupID,
            targetBatch,
            rollup.sequencedBatches[targetBatch].accInputHash
        );
    }

    /////////////////////////////////////
    // Sequence/Verify batches functions
    ////////////////////////////////////

    /**
     * @notice Sequence batches, callback called by one of the consensus managed by this contract
     * @param newSequencedBatches Number of batches sequenced
     * @param newAccInputHash New accumulate input hash
     */
    function onSequenceBatches(
        uint64 newSequencedBatches,
        bytes32 newAccInputHash
    ) external ifNotEmergencyState returns (uint64) {
        // Check that the msg.sender is an added rollup
        uint32 rollupID = rollupAddressToID[msg.sender];
        if (rollupID == 0) {
            revert SenderMustBeRollup();
        }

        // This prevents overwritting sequencedBatches
        if (newSequencedBatches == 0) {
            revert MustSequenceSomeBatch();
        }

        RollupData storage rollup = _rollupIDToRollupData[rollupID];

        if (rollup.rollupVerifierType != VerifierType.StateTransition) {
            revert OnlyStateTransitionChains();
        }

        // Update total sequence parameters
        totalSequencedBatches += newSequencedBatches;

        // Update sequenced batches of the current rollup
        uint64 previousLastBatchSequenced = rollup.lastBatchSequenced;
        uint64 newLastBatchSequenced = previousLastBatchSequenced +
            newSequencedBatches;

        rollup.lastBatchSequenced = newLastBatchSequenced;
        rollup.sequencedBatches[newLastBatchSequenced] = SequencedBatchData({
            accInputHash: newAccInputHash,
            sequencedTimestamp: uint64(block.timestamp),
            previousLastBatchSequenced: previousLastBatchSequenced
        });

        emit OnSequenceBatches(rollupID, newLastBatchSequenced);

        return newLastBatchSequenced;
    }

    /**
     * @notice Allows a trusted aggregator to verify multiple batches
     * @param rollupID Rollup identifier
     * @param pendingStateNum Init pending state, 0 if consolidated state is used (deprecated)
     * @param initNumBatch Batch which the aggregator starts the verification
     * @param finalNewBatch Last batch aggregator intends to verify
     * @param newLocalExitRoot New local exit root once the batch is processed
     * @param newStateRoot New State root once the batch is processed
     * @param beneficiary Address that will receive the verification reward
     * @param proof Fflonk proof
     */
    function verifyBatchesTrustedAggregator(
        uint32 rollupID,
        uint64 pendingStateNum,
        uint64 initNumBatch,
        uint64 finalNewBatch,
        bytes32 newLocalExitRoot,
        bytes32 newStateRoot,
        address beneficiary,
        bytes32[24] calldata proof
    ) external onlyRole(_TRUSTED_AGGREGATOR_ROLE) {
        // Pending state became deprecated,
        // It's still there just to have backwards compatibility interface
        if (pendingStateNum != 0) {
            revert PendingStateNumExist();
        }

        RollupData storage rollup = _rollupIDToRollupData[rollupID];

        if (rollup.rollupVerifierType != VerifierType.StateTransition) {
            revert OnlyStateTransitionChains();
        }

        _verifyAndRewardBatches(
            rollup,
            initNumBatch,
            finalNewBatch,
            newLocalExitRoot,
            newStateRoot,
            beneficiary,
            proof
        );

        // Consolidate state
        rollup.lastVerifiedBatch = finalNewBatch;
        rollup.batchNumToStateRoot[finalNewBatch] = newStateRoot;
        rollup.lastLocalExitRoot = newLocalExitRoot;

        // Interact with globalExitRootManager
        globalExitRootManager.updateExitRoot(getRollupExitRoot());

        emit VerifyBatchesTrustedAggregator(
            rollupID,
            finalNewBatch,
            newStateRoot,
            newLocalExitRoot,
            msg.sender
        );
    }

    /**
     * @notice Verify and reward batches internal function
     * @param rollup Rollup Data storage pointer that will be used to the verification
     * @param initNumBatch Batch which the aggregator starts the verification
     * @param finalNewBatch Last batch aggregator intends to verify
     * @param newLocalExitRoot New local exit root once the batch is processed
     * @param newStateRoot New State root once the batch is processed
     * @param beneficiary Address that will receive the verification reward
     * @param proof Fflonk proof
     */
    function _verifyAndRewardBatches(
        RollupData storage rollup,
        uint64 initNumBatch,
        uint64 finalNewBatch,
        bytes32 newLocalExitRoot,
        bytes32 newStateRoot,
        address beneficiary,
        bytes32[24] calldata proof
    ) internal virtual {
        bytes32 oldStateRoot;

        uint64 currentLastVerifiedBatch = _getLastVerifiedBatch(rollup);

        if (initNumBatch < rollup.lastVerifiedBatchBeforeUpgrade) {
            revert InitBatchMustMatchCurrentForkID();
        }

        // Use consolidated state
        oldStateRoot = rollup.batchNumToStateRoot[initNumBatch];

        if (oldStateRoot == bytes32(0)) {
            revert OldStateRootDoesNotExist();
        }

        // Check initNumBatch is inside the range, sanity check
        if (initNumBatch > currentLastVerifiedBatch) {
            revert InitNumBatchAboveLastVerifiedBatch();
        }

        // Check final batch
        if (finalNewBatch <= currentLastVerifiedBatch) {
            revert FinalNumBatchBelowLastVerifiedBatch();
        }

        // Get snark bytes
        bytes memory snarkHashBytes = _getInputSnarkBytes(
            rollup,
            initNumBatch,
            finalNewBatch,
            newLocalExitRoot,
            oldStateRoot,
            newStateRoot
        );

        // Calulate the snark input
        uint256 inputSnark = uint256(sha256(snarkHashBytes)) % _RFIELD;

        // Verify proof
        if (
            !IVerifierRollup(rollup.verifier).verifyProof(proof, [inputSnark])
        ) {
            revert InvalidProof();
        }

        // Pay POL rewards
        uint64 newVerifiedBatches = finalNewBatch - currentLastVerifiedBatch;

        pol.safeTransfer(
            beneficiary,
            calculateRewardPerBatch() * newVerifiedBatches
        );

        // Update aggregation parameters
        totalVerifiedBatches += newVerifiedBatches;
        lastAggregationTimestamp = uint64(block.timestamp);

        // Callback to the rollup address
        rollup.rollupContract.onVerifyBatches(
            finalNewBatch,
            newStateRoot,
            msg.sender
        );
    }

    /**
     * @notice Allows a trusted aggregator to verify pessimistic proof
     * @param rollupID Rollup identifier
     * @param l1InfoTreeLeafCount Count of the L1InfoTree leaf that will be used to verify imported bridge exits
     * @param newLocalExitRoot New local exit root
     * @param newPessimisticRoot New pessimistic information, Hash(localBalanceTreeRoot, nullifierTreeRoot)
     * @param proof SP1 proof (Plonk)
     */
    function verifyPessimisticTrustedAggregator(
        uint32 rollupID,
        uint32 l1InfoTreeLeafCount,
        bytes32 newLocalExitRoot,
        bytes32 newPessimisticRoot,
        bytes calldata proof
    ) external onlyRole(_TRUSTED_AGGREGATOR_ROLE) {
        RollupData storage rollup = _rollupIDToRollupData[rollupID];

        // Only for pessimistic verifiers
        if (rollup.rollupVerifierType != VerifierType.Pessimistic) {
            revert OnlyChainsWithPessimisticProofs();
        }

        // Check l1InfoTreeLeafCount has a valid l1InfoTreeRoot
        bytes32 l1InfoRoot = globalExitRootManager.l1InfoRootMap(
            l1InfoTreeLeafCount
        );

        if (l1InfoRoot == bytes32(0)) {
            revert L1InfoTreeLeafCountInvalid();
        }

        bytes memory inputPessimisticBytes = _getInputPessimisticBytes(
            rollupID,
            rollup,
            l1InfoRoot,
            newLocalExitRoot,
            newPessimisticRoot
        );

        // Verify proof
        ISP1Verifier(rollup.verifier).verifyProof(
            rollup.programVKey,
            inputPessimisticBytes,
            proof
        );
        // TODO: Since there are no batches we could have either:
        // A pool of POL for pessimistic, or make the fee system offchain, since there are already a
        // dependency with the trusted aggregator ( or pessimistic aggregator)

        // Update aggregation parameters
        lastAggregationTimestamp = uint64(block.timestamp);

        // Consolidate state
        rollup.lastLocalExitRoot = newLocalExitRoot;
        rollup.lastPessimisticRoot = newPessimisticRoot;

        // Interact with globalExitRootManager
        globalExitRootManager.updateExitRoot(getRollupExitRoot());

        // Same event as verifyBatches to support current bridge service to synchronize everything
        emit VerifyBatchesTrustedAggregator(
            rollupID,
            0, // final batch: does not apply in pessimistic
            bytes32(0), // new state root: does not apply in pessimistic
            newLocalExitRoot,
            msg.sender
        );
    }

    ////////////////////////
    // Emergency state functions
    ////////////////////////

    /**
     * @notice Function to activate emergency state, which also enables the emergency mode on both PolygonRollupManager and PolygonZkEVMBridge contracts
     * If not called by the owner must not have been aggregated in a _HALT_AGGREGATION_TIMEOUT period and an emergency state was not happened in the same period
     */
    function activateEmergencyState() external {
        if (!hasRole(_EMERGENCY_COUNCIL_ROLE, msg.sender)) {
            if (
                lastAggregationTimestamp == 0 ||
                lastAggregationTimestamp + _HALT_AGGREGATION_TIMEOUT >
                block.timestamp ||
                lastDeactivatedEmergencyStateTimestamp +
                    _HALT_AGGREGATION_TIMEOUT >
                block.timestamp
            ) {
                revert HaltTimeoutNotExpired();
            }
        }
        _activateEmergencyState();
    }

    /**
     * @notice Function to deactivate emergency state on both PolygonRollupManager and PolygonZkEVMBridge contracts
     */
    function deactivateEmergencyState()
        external
        onlyRole(_STOP_EMERGENCY_ROLE)
    {
        // Set last deactivated emergency state
        lastDeactivatedEmergencyStateTimestamp = uint64(block.timestamp);

        // Deactivate emergency state on PolygonZkEVMBridge
        bridgeAddress.deactivateEmergencyState();

        // Deactivate emergency state on this contract
        super._deactivateEmergencyState();
    }

    /**
     * @notice Internal function to activate emergency state on both PolygonRollupManager and PolygonZkEVMBridge contracts
     */
    function _activateEmergencyState() internal override {
        // Activate emergency state on PolygonZkEVM Bridge
        bridgeAddress.activateEmergencyState();

        // Activate emergency state on this contract
        super._activateEmergencyState();
    }

    //////////////////
    // Setter functions
    //////////////////

    /**
     * @notice Set the current batch fee
     * @param newBatchFee new batch fee
     */
    function setBatchFee(uint256 newBatchFee) external onlyRole(_SET_FEE_ROLE) {
        // check fees min and max
        if (newBatchFee > _MAX_BATCH_FEE || newBatchFee < _MIN_BATCH_FEE) {
            revert BatchFeeOutOfRange();
        }
        _batchFee = newBatchFee;
        emit SetBatchFee(newBatchFee);
    }

    ////////////////////////
    // view/pure functions
    ///////////////////////

    /**
     * @notice Get the current rollup exit root
     * Compute using all the local exit roots of all rollups the rollup exit root
     * Since it's expected to have no more than 10 rollups in this first version, even if this approach
     * has a gas consumption that scales linearly with the rollups added, it's ok
     * In a future versions this computation will be done inside the circuit
     */
    function getRollupExitRoot() public view returns (bytes32) {
        uint256 currentNodes = rollupCount;

        // If there are no nodes return 0
        if (currentNodes == 0) {
            return bytes32(0);
        }

        // This array will contain the nodes of the current iteration
        bytes32[] memory tmpTree = new bytes32[](currentNodes);

        // In the first iteration the nodes will be the leafs which are the local exit roots of each network
        for (uint256 i = 0; i < currentNodes; i++) {
            // The first rollup ID starts on 1
            tmpTree[i] = _rollupIDToRollupData[uint32(i + 1)].lastLocalExitRoot;
        }

        // This variable will keep track of the zero hashes
        bytes32 currentZeroHashHeight = 0;

        // This variable will keep track of the reamining levels to compute
        uint256 remainingLevels = _EXIT_TREE_DEPTH;

        // Calculate the root of the sub-tree that contains all the localExitRoots
        while (currentNodes != 1) {
            uint256 nextIterationNodes = currentNodes / 2 + (currentNodes % 2);
            bytes32[] memory nextTmpTree = new bytes32[](nextIterationNodes);
            for (uint256 i = 0; i < nextIterationNodes; i++) {
                // if we are on the last iteration of the current level and the nodes are odd
                if (i == nextIterationNodes - 1 && (currentNodes % 2) == 1) {
                    nextTmpTree[i] = keccak256(
                        abi.encodePacked(tmpTree[i * 2], currentZeroHashHeight)
                    );
                } else {
                    nextTmpTree[i] = keccak256(
                        abi.encodePacked(tmpTree[i * 2], tmpTree[(i * 2) + 1])
                    );
                }
            }

            // Update tree variables
            tmpTree = nextTmpTree;
            currentNodes = nextIterationNodes;
            currentZeroHashHeight = keccak256(
                abi.encodePacked(currentZeroHashHeight, currentZeroHashHeight)
            );
            remainingLevels--;
        }

        bytes32 currentRoot = tmpTree[0];

        // Calculate remaining levels, since it's a sequencial merkle tree, the rest of the tree are zeroes
        for (uint256 i = 0; i < remainingLevels; i++) {
            currentRoot = keccak256(
                abi.encodePacked(currentRoot, currentZeroHashHeight)
            );
            currentZeroHashHeight = keccak256(
                abi.encodePacked(currentZeroHashHeight, currentZeroHashHeight)
            );
        }
        return currentRoot;
    }

    /**
     * @notice Get the last verified batch
     */
    function getLastVerifiedBatch(
        uint32 rollupID
    ) public view returns (uint64) {
        return _getLastVerifiedBatch(_rollupIDToRollupData[rollupID]);
    }

    /**
     * @notice Get the last verified batch
     */
    function _getLastVerifiedBatch(
        RollupData storage rollup
    ) internal view returns (uint64) {
        return rollup.lastVerifiedBatch;
    }

    /**
     * @notice Function to calculate the reward to verify a single batch
     */
    function calculateRewardPerBatch() public view returns (uint256) {
        uint256 currentBalance = pol.balanceOf(address(this));

        // Total Batches to be verified = total Sequenced Batches - total verified Batches
        uint256 totalBatchesToVerify = totalSequencedBatches -
            totalVerifiedBatches;

        if (totalBatchesToVerify == 0) return 0;
        return currentBalance / totalBatchesToVerify;
    }

    /**
     * @notice Get batch fee
     * This function is used instad of the automatic public view one,
     * because in a future might change the behaviour and we will be able to mantain the interface
     */
    function getBatchFee() public view returns (uint256) {
        return _batchFee;
    }

    /**
     * @notice Get forced batch fee
     */
    function getForcedBatchFee() public view returns (uint256) {
        return _batchFee * 100;
    }

    /**
     * @notice Function to calculate the pessimistic input bytes
     * @param rollupID Rollup id used to calculate the input snark bytes
     * @param l1InfoTreeRoot L1 Info tree root to proof imported bridges
     * @param newLocalExitRoot New local exit root
     * @param newPessimisticRoot New pessimistic information, Hash(localBalanceTreeRoot, nullifierTreeRoot)
     */
    function getInputPessimisticBytes(
        uint32 rollupID,
        bytes32 l1InfoTreeRoot,
        bytes32 newLocalExitRoot,
        bytes32 newPessimisticRoot
    ) external view returns (bytes memory) {
        return
            _getInputPessimisticBytes(
                rollupID,
                _rollupIDToRollupData[rollupID],
                l1InfoTreeRoot,
                newLocalExitRoot,
                newPessimisticRoot
            );
    }

    /**
     * @notice Function to calculate the input snark bytes
     * @param rollupID Rollup identifier
     * @param rollup Rollup data storage pointer
     * @param l1InfoTreeRoot L1 Info tree root to proof imported bridges
     * @param newLocalExitRoot New local exit root
     * @param newPessimisticRoot New pessimistic information, Hash(localBalanceTreeRoot, nullifierTreeRoot)
     */
    function _getInputPessimisticBytes(
        uint32 rollupID,
        RollupData storage rollup,
        bytes32 l1InfoTreeRoot,
        bytes32 newLocalExitRoot,
        bytes32 newPessimisticRoot
    ) internal view returns (bytes memory) {
        // Get consensus information from the consensus contract
        bytes32 consensusHash = IPolygonPessimisticConsensus(
            address(rollup.rollupContract)
        ).getConsensusHash();

        return
            abi.encodePacked(
                rollup.lastLocalExitRoot,
                rollup.lastPessimisticRoot,
                l1InfoTreeRoot,
                rollupID,
                consensusHash,
                newLocalExitRoot,
                newPessimisticRoot
            );
    }

    /**
     * @notice Function to calculate the input snark bytes
     * @param rollupID Rollup id used to calculate the input snark bytes
     * @param initNumBatch Batch which the aggregator starts the verification
     * @param finalNewBatch Last batch aggregator intends to verify
     * @param newLocalExitRoot New local exit root once the batch is processed
     * @param oldStateRoot State root before batch is processed
     * @param newStateRoot New State root once the batch is processed
     */
    function getInputSnarkBytes(
        uint32 rollupID,
        uint64 initNumBatch,
        uint64 finalNewBatch,
        bytes32 newLocalExitRoot,
        bytes32 oldStateRoot,
        bytes32 newStateRoot
    ) public view returns (bytes memory) {
        return
            _getInputSnarkBytes(
                _rollupIDToRollupData[rollupID],
                initNumBatch,
                finalNewBatch,
                newLocalExitRoot,
                oldStateRoot,
                newStateRoot
            );
    }

    /**
     * @notice Function to calculate the input snark bytes
     * @param rollup Rollup data storage pointer
     * @param initNumBatch Batch which the aggregator starts the verification
     * @param finalNewBatch Last batch aggregator intends to verify
     * @param newLocalExitRoot New local exit root once the batch is processed
     * @param oldStateRoot State root before batch is processed
     * @param newStateRoot New State root once the batch is processed
     */
    function _getInputSnarkBytes(
        RollupData storage rollup,
        uint64 initNumBatch,
        uint64 finalNewBatch,
        bytes32 newLocalExitRoot,
        bytes32 oldStateRoot,
        bytes32 newStateRoot
    ) internal view returns (bytes memory) {
        // Sanity check
        bytes32 oldAccInputHash = rollup
            .sequencedBatches[initNumBatch]
            .accInputHash;

        bytes32 newAccInputHash = rollup
            .sequencedBatches[finalNewBatch]
            .accInputHash;

        // Sanity check
        if (initNumBatch != 0 && oldAccInputHash == bytes32(0)) {
            revert OldAccInputHashDoesNotExist();
        }

        if (newAccInputHash == bytes32(0)) {
            revert NewAccInputHashDoesNotExist();
        }

        // Check that new state root is inside goldilocks field
        if (!_checkStateRootInsidePrime(uint256(newStateRoot))) {
            revert NewStateRootNotInsidePrime();
        }

        return
            abi.encodePacked(
                msg.sender,
                oldStateRoot,
                oldAccInputHash,
                initNumBatch,
                rollup.chainID,
                rollup.forkID,
                newStateRoot,
                newAccInputHash,
                newLocalExitRoot,
                finalNewBatch
            );
    }

    /**
     * @notice Function to check if the state root is inside of the prime field
     * @param newStateRoot New State root once the batch is processed
     */
    function _checkStateRootInsidePrime(
        uint256 newStateRoot
    ) internal pure returns (bool) {
        if (
            ((newStateRoot & _MAX_UINT_64) < _GOLDILOCKS_PRIME_FIELD) &&
            (((newStateRoot >> 64) & _MAX_UINT_64) < _GOLDILOCKS_PRIME_FIELD) &&
            (((newStateRoot >> 128) & _MAX_UINT_64) <
                _GOLDILOCKS_PRIME_FIELD) &&
            ((newStateRoot >> 192) < _GOLDILOCKS_PRIME_FIELD)
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @notice Get rollup state root given a batch number
     * @param rollupID Rollup identifier
     * @param batchNum Batch number
     */
    function getRollupBatchNumToStateRoot(
        uint32 rollupID,
        uint64 batchNum
    ) public view returns (bytes32) {
        return _rollupIDToRollupData[rollupID].batchNumToStateRoot[batchNum];
    }

    /**
     * @notice Get rollup sequence batches struct given a batch number
     * @param rollupID Rollup identifier
     * @param batchNum Batch number
     */
    function getRollupSequencedBatches(
        uint32 rollupID,
        uint64 batchNum
    ) public view returns (SequencedBatchData memory) {
        return _rollupIDToRollupData[rollupID].sequencedBatches[batchNum];
    }

    /**
     * @notice Get rollup data: VerifierType StateTransition
     * @param rollupID Rollup identifier
     */
    function rollupIDToRollupData(
        uint32 rollupID
    ) public view returns (RollupDataReturn memory rollupData) {
        RollupData storage rollup = _rollupIDToRollupData[rollupID];

        rollupData.rollupContract = rollup.rollupContract;
        rollupData.chainID = rollup.chainID;
        rollupData.verifier = rollup.verifier;
        rollupData.forkID = rollup.forkID;
        rollupData.lastLocalExitRoot = rollup.lastLocalExitRoot;
        rollupData.lastBatchSequenced = rollup.lastBatchSequenced;
        rollupData.lastVerifiedBatch = rollup.lastVerifiedBatch;
        rollupData._legacyLastPendingState = rollup._legacyLastPendingState;
        rollupData._legacyLastPendingStateConsolidated = rollup
            ._legacyLastPendingStateConsolidated;
        rollupData.lastVerifiedBatchBeforeUpgrade = rollup
            .lastVerifiedBatchBeforeUpgrade;
        rollupData.rollupTypeID = rollup.rollupTypeID;
        rollupData.rollupVerifierType = rollup.rollupVerifierType;
    }

    /**
     * @notice Get rollup data: VerifierType Pessimistic
     * @param rollupID Rollup identifier
     */
    function rollupIDToRollupDataV2(
        uint32 rollupID
    ) public view returns (RollupDataReturnV2 memory rollupData) {
        RollupData storage rollup = _rollupIDToRollupData[rollupID];

        rollupData.rollupContract = address(rollup.rollupContract);
        rollupData.chainID = rollup.chainID;
        rollupData.verifier = rollup.verifier;
        rollupData.forkID = rollup.forkID;
        rollupData.lastLocalExitRoot = rollup.lastLocalExitRoot;
        rollupData.lastBatchSequenced = rollup.lastBatchSequenced;
        rollupData.lastVerifiedBatch = rollup.lastVerifiedBatch;
        rollupData.lastVerifiedBatchBeforeUpgrade = rollup
            .lastVerifiedBatchBeforeUpgrade;
        rollupData.rollupTypeID = rollup.rollupTypeID;
        rollupData.rollupVerifierType = rollup.rollupVerifierType;
        rollupData.lastPessimisticRoot = rollup.lastPessimisticRoot;
        rollupData.programVKey = rollup.programVKey;
    }
}