// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

library Address {
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
        return functionCall(target, data, "Address: low-level call failed");
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
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
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
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
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
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

library SafeERC20 {
    using Address for address;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20 token,
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
        IERC20 token,
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
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20 token,
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

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

interface IERC20Bridge is IBridge {
    /**
     * @dev token that is escrowed in bridge on L1 side and minted on L2 as native currency.
     * Fees are paid in this token. There are certain restrictions on the native token:
     *  - The token can't be rebasing or have a transfer fee
     *  - The token must only be transferrable via a call to the token address itself
     *  - The token must only be able to set allowance via a call to the token address itself
     *  - The token must not have a callback on transfer, and more generally a user must not be able to make a transfer to themselves revert
     */
    function nativeToken() external view returns (address);

    /**
     * @dev number of decimals used by the native token
     *      This is set on bridge initialization using nativeToken.decimals()
     *      If the token does not have decimals() method, we assume it have 0 decimals
     */
    function nativeTokenDecimals() external view returns (uint8);

    /**
     * @dev Enqueue a message in the delayed inbox accumulator.
     *      These messages are later sequenced in the SequencerInbox, either
     *      by the sequencer as part of a normal batch, or by force inclusion.
     */
    function enqueueDelayedMessage(
        uint8 kind,
        address sender,
        bytes32 messageDataHash,
        uint256 tokenFeeAmount
    ) external returns (uint256);

    // ---------- initializer ----------

    function initialize(IOwnable rollup_, address nativeToken_) external;
}

abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     */
    bool private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Modifier to protect an initializer function from being invoked twice.
     */
    modifier initializer() {
        // If the contract is initializing we ignore whether _initialized is set in order to support multiple
        // inheritance patterns, but we only do this in the context of a constructor, because in other contexts the
        // contract may have been reentered.
        require(_initializing ? _isConstructor() : !_initialized, "Initializable: contract is already initialized");

        bool isTopLevelCall = !_initializing;
        if (isTopLevelCall) {
            _initializing = true;
            _initialized = true;
        }

        _;

        if (isTopLevelCall) {
            _initializing = false;
        }
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} modifier, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    function _isConstructor() private view returns (bool) {
        return !AddressUpgradeable.isContract(address(this));
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

interface IBridge {
    /// @dev This is an instruction to offchain readers to inform them where to look
    ///      for sequencer inbox batch data. This is not the type of data (eg. das, brotli encoded, or blob versioned hash)
    ///      and this enum is not used in the state transition function, rather it informs an offchain
    ///      reader where to find the data so that they can supply it to the replay binary
    enum BatchDataLocation {
        /// @notice The data can be found in the transaction call data
        TxInput,
        /// @notice The data can be found in an event emitted during the transaction
        SeparateBatchEvent,
        /// @notice This batch contains no data
        NoData,
        /// @notice The data can be found in the 4844 data blobs on this transaction
        Blob
    }

    struct TimeBounds {
        uint64 minTimestamp;
        uint64 maxTimestamp;
        uint64 minBlockNumber;
        uint64 maxBlockNumber;
    }

    event MessageDelivered(
        uint256 indexed messageIndex,
        bytes32 indexed beforeInboxAcc,
        address inbox,
        uint8 kind,
        address sender,
        bytes32 messageDataHash,
        uint256 baseFeeL1,
        uint64 timestamp
    );

    event DepositMessageDelivered(address indexed sender);

    event BridgeCallTriggered(
        address indexed outbox,
        address indexed to,
        uint256 value,
        bytes data
    );

    event InboxToggle(address indexed inbox, bool enabled);

    event OutboxToggle(address indexed outbox, bool enabled);

    event SequencerInboxUpdated(address newSequencerInbox);

    event RollupUpdated(address rollup);

    function allowedDelayedInboxList(uint256) external returns (address);

    function allowedOutboxList(uint256) external returns (address);

    /// @dev Accumulator for delayed inbox messages; tail represents hash of the current state; each element represents the inclusion of a new message.
    function delayedInboxAccs(uint256) external view returns (bytes32);

    /// @dev Accumulator for sequencer inbox messages; tail represents hash of the current state; each element represents the inclusion of a new message.
    function sequencerInboxAccs(uint256) external view returns (bytes32);

    function rollup() external view returns (IOwnable);

    function sequencerInbox() external view returns (address);

    function activeOutbox() external view returns (address);

    function allowedDelayedInboxes(address inbox) external view returns (bool);

    function allowedOutboxes(address outbox) external view returns (bool);

    function sequencerReportedSubMessageCount() external view returns (uint256);

    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external returns (bool success, bytes memory returnData);

    function delayedMessageCount() external view returns (uint256);

    function sequencerMessageCount() external view returns (uint256);

    // ---------- onlySequencerInbox functions ----------

    function enqueueSequencerMessage(
        bytes32 dataHash,
        uint256 afterDelayedMessagesRead,
        uint256 prevMessageCount,
        uint256 newMessageCount
    )
        external
        returns (
            uint256 seqMessageIndex,
            bytes32 beforeAcc,
            bytes32 delayedAcc,
            bytes32 acc
        );

    /**
     * @dev Allows the sequencer inbox to submit a delayed message of the batchPostingReport type
     *      This is done through a separate function entrypoint instead of allowing the sequencer inbox
     *      to call `enqueueDelayedMessage` to avoid the gas overhead of an extra SLOAD in either
     *      every delayed inbox or every sequencer inbox call.
     */
    function submitBatchSpendingReport(address batchPoster, bytes32 dataHash)
        external
        returns (uint256 msgNum);

    // ---------- onlyRollupOrOwner functions ----------

    function setSequencerInbox(address _sequencerInbox) external;

    function setDelayedInbox(address inbox, bool enabled) external;

    function setOutbox(address inbox, bool enabled) external;

    function updateRollupAddress(IOwnable _rollup) external;
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
        return functionCall(target, data, "Address: low-level call failed");
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
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
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
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
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
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

library Messages {
    function messageHash(
        uint8 kind,
        address sender,
        uint64 blockNumber,
        uint64 timestamp,
        uint256 inboxSeqNum,
        uint256 baseFeeL1,
        bytes32 messageDataHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    kind,
                    sender,
                    blockNumber,
                    timestamp,
                    inboxSeqNum,
                    baseFeeL1,
                    messageDataHash
                )
            );
    }

    function accumulateInboxMessage(bytes32 prevAcc, bytes32 message)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(prevAcc, message));
    }
}

abstract contract AbsBridge is Initializable, DelegateCallAware, IBridge {
    using AddressUpgradeable for address;

    struct InOutInfo {
        uint256 index;
        bool allowed;
    }

    mapping(address => InOutInfo) private allowedDelayedInboxesMap;
    mapping(address => InOutInfo) private allowedOutboxesMap;

    address[] public allowedDelayedInboxList;
    address[] public allowedOutboxList;

    address internal _activeOutbox;

    /// @inheritdoc IBridge
    bytes32[] public delayedInboxAccs;

    /// @inheritdoc IBridge
    bytes32[] public sequencerInboxAccs;

    IOwnable public rollup;
    address public sequencerInbox;

    uint256 public override sequencerReportedSubMessageCount;

    address internal constant EMPTY_ACTIVEOUTBOX = address(type(uint160).max);

    modifier onlyRollupOrOwner() {
        if (msg.sender != address(rollup)) {
            address rollupOwner = rollup.owner();
            if (msg.sender != rollupOwner) {
                revert NotRollupOrOwner(msg.sender, address(rollup), rollupOwner);
            }
        }
        _;
    }

    /// @notice Allows the rollup owner to set another rollup address
    function updateRollupAddress(IOwnable _rollup) external onlyRollupOrOwner {
        rollup = _rollup;
        emit RollupUpdated(address(_rollup));
    }

    /// @dev returns the address of current active Outbox, or zero if no outbox is active
    function activeOutbox() public view returns (address) {
        address outbox = _activeOutbox;
        // address zero is returned if no outbox is set, but the value used in storage
        // is non-zero to save users some gas (as storage refunds are usually maxed out)
        // EIP-1153 would help here.
        // we don't return `EMPTY_ACTIVEOUTBOX` to avoid a breaking change on the current api
        if (outbox == EMPTY_ACTIVEOUTBOX) return address(0);
        return outbox;
    }

    function allowedDelayedInboxes(address inbox) public view returns (bool) {
        return allowedDelayedInboxesMap[inbox].allowed;
    }

    function allowedOutboxes(address outbox) public view returns (bool) {
        return allowedOutboxesMap[outbox].allowed;
    }

    modifier onlySequencerInbox() {
        if (msg.sender != sequencerInbox) revert NotSequencerInbox(msg.sender);
        _;
    }

    function enqueueSequencerMessage(
        bytes32 dataHash,
        uint256 afterDelayedMessagesRead,
        uint256 prevMessageCount,
        uint256 newMessageCount
    )
        external
        onlySequencerInbox
        returns (
            uint256 seqMessageIndex,
            bytes32 beforeAcc,
            bytes32 delayedAcc,
            bytes32 acc
        )
    {
        if (
            sequencerReportedSubMessageCount != prevMessageCount &&
            prevMessageCount != 0 &&
            sequencerReportedSubMessageCount != 0
        ) {
            revert BadSequencerMessageNumber(sequencerReportedSubMessageCount, prevMessageCount);
        }
        sequencerReportedSubMessageCount = newMessageCount;
        seqMessageIndex = sequencerInboxAccs.length;
        if (sequencerInboxAccs.length > 0) {
            beforeAcc = sequencerInboxAccs[sequencerInboxAccs.length - 1];
        }
        if (afterDelayedMessagesRead > 0) {
            delayedAcc = delayedInboxAccs[afterDelayedMessagesRead - 1];
        }
        acc = keccak256(abi.encodePacked(beforeAcc, dataHash, delayedAcc));
        sequencerInboxAccs.push(acc);
    }

    /// @inheritdoc IBridge
    function submitBatchSpendingReport(address sender, bytes32 messageDataHash)
        external
        onlySequencerInbox
        returns (uint256)
    {
        return
            addMessageToDelayedAccumulator(
                L1MessageType_batchPostingReport,
                sender,
                uint64(block.number),
                uint64(block.timestamp), // solhint-disable-line not-rely-on-time,
                block.basefee,
                messageDataHash
            );
    }

    function _enqueueDelayedMessage(
        uint8 kind,
        address sender,
        bytes32 messageDataHash,
        uint256 amount
    ) internal returns (uint256) {
        if (!allowedDelayedInboxes(msg.sender)) revert NotDelayedInbox(msg.sender);

        uint256 messageCount = addMessageToDelayedAccumulator(
            kind,
            sender,
            uint64(block.number),
            uint64(block.timestamp), // solhint-disable-line not-rely-on-time
            _baseFeeToReport(),
            messageDataHash
        );

        _transferFunds(amount);

        return messageCount;
    }

    function addMessageToDelayedAccumulator(
        uint8 kind,
        address sender,
        uint64 blockNumber,
        uint64 blockTimestamp,
        uint256 baseFeeL1,
        bytes32 messageDataHash
    ) internal returns (uint256) {
        uint256 count = delayedInboxAccs.length;
        bytes32 messageHash = Messages.messageHash(
            kind,
            sender,
            blockNumber,
            blockTimestamp,
            count,
            baseFeeL1,
            messageDataHash
        );
        bytes32 prevAcc = 0;
        if (count > 0) {
            prevAcc = delayedInboxAccs[count - 1];
        }
        delayedInboxAccs.push(Messages.accumulateInboxMessage(prevAcc, messageHash));
        emit MessageDelivered(
            count,
            prevAcc,
            msg.sender,
            kind,
            sender,
            messageDataHash,
            baseFeeL1,
            blockTimestamp
        );
        if (kind == L1MessageType_ethDeposit) {
            emit DepositMessageDelivered(sender);
        }
        return count;
    }

    /// @inheritdoc IBridge
    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external returns (bool success, bytes memory returnData) {
        if (!allowedOutboxes(msg.sender)) revert NotOutbox(msg.sender);
        if (data.length > 0 && !to.isContract()) revert NotContract(to);
        address prevOutbox = _activeOutbox;
        _activeOutbox = msg.sender;
        // We set and reset active outbox around external call so activeOutbox remains valid during call

        // We use a low level call here since we want to bubble up whether it succeeded or failed to the caller
        // rather than reverting on failure as well as allow contract and non-contract calls
        (success, returnData) = _executeLowLevelCall(to, value, data);

        _activeOutbox = prevOutbox;
        emit BridgeCallTriggered(msg.sender, to, value, data);
    }

    function setSequencerInbox(address _sequencerInbox) external onlyRollupOrOwner {
        sequencerInbox = _sequencerInbox;
        emit SequencerInboxUpdated(_sequencerInbox);
    }

    function setDelayedInbox(address inbox, bool enabled) external onlyRollupOrOwner {
        InOutInfo storage info = allowedDelayedInboxesMap[inbox];
        bool alreadyEnabled = info.allowed;
        emit InboxToggle(inbox, enabled);
        if (alreadyEnabled == enabled) {
            return;
        }
        if (enabled) {
            allowedDelayedInboxesMap[inbox] = InOutInfo(allowedDelayedInboxList.length, true);
            allowedDelayedInboxList.push(inbox);
        } else {
            allowedDelayedInboxList[info.index] = allowedDelayedInboxList[
                allowedDelayedInboxList.length - 1
            ];
            allowedDelayedInboxesMap[allowedDelayedInboxList[info.index]].index = info.index;
            allowedDelayedInboxList.pop();
            delete allowedDelayedInboxesMap[inbox];
        }
    }

    function setOutbox(address outbox, bool enabled) external onlyRollupOrOwner {
        if (outbox == EMPTY_ACTIVEOUTBOX) revert InvalidOutboxSet(outbox);

        InOutInfo storage info = allowedOutboxesMap[outbox];
        bool alreadyEnabled = info.allowed;
        emit OutboxToggle(outbox, enabled);
        if (alreadyEnabled == enabled) {
            return;
        }
        if (enabled) {
            allowedOutboxesMap[outbox] = InOutInfo(allowedOutboxList.length, true);
            allowedOutboxList.push(outbox);
        } else {
            allowedOutboxList[info.index] = allowedOutboxList[allowedOutboxList.length - 1];
            allowedOutboxesMap[allowedOutboxList[info.index]].index = info.index;
            allowedOutboxList.pop();
            delete allowedOutboxesMap[outbox];
        }
    }

    function setSequencerReportedSubMessageCount(uint256 newMsgCount) external onlyRollupOrOwner {
        sequencerReportedSubMessageCount = newMsgCount;
    }

    function delayedMessageCount() external view override returns (uint256) {
        return delayedInboxAccs.length;
    }

    function sequencerMessageCount() external view returns (uint256) {
        return sequencerInboxAccs.length;
    }

    /// @dev For the classic -> nitro migration. TODO: remove post-migration.
    function acceptFundsFromOldBridge() external payable {}

    /// @dev transfer funds provided to pay for crosschain msg
    function _transferFunds(uint256 amount) internal virtual;

    function _executeLowLevelCall(
        address to,
        uint256 value,
        bytes memory data
    ) internal virtual returns (bool success, bytes memory returnData);

    /// @dev get base fee which is emitted in `MessageDelivered` event and then picked up and
    /// used in ArbOs to calculate the submission fee for retryable ticket
    function _baseFeeToReport() internal view virtual returns (uint256);

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[40] private __gap;
}

contract ERC20Bridge is AbsBridge, IERC20Bridge {
    using SafeERC20 for IERC20;

    /// @inheritdoc IERC20Bridge
    address public nativeToken;

    /// @inheritdoc IERC20Bridge
    uint8 public nativeTokenDecimals;

    /// @inheritdoc IERC20Bridge
    function initialize(IOwnable rollup_, address nativeToken_) external initializer onlyDelegated {
        if (nativeToken_ == address(0)) revert InvalidTokenSet(nativeToken_);
        nativeToken = nativeToken_;
        _activeOutbox = EMPTY_ACTIVEOUTBOX;
        rollup = rollup_;

        // store number of decimals used by native token
        try ERC20(nativeToken_).decimals() returns (uint8 decimals) {
            if (decimals > MAX_ALLOWED_NATIVE_TOKEN_DECIMALS) {
                revert NativeTokenDecimalsTooLarge(decimals);
            }
            nativeTokenDecimals = decimals;
        } catch {
            // decimal is not part of the ERC20 spec
            // assume it have 0 decimals if it does not have decimals() method
            // we do this to align with the token bridge behavior
            nativeTokenDecimals = 0;
        }
    }

    /// @inheritdoc IERC20Bridge
    function enqueueDelayedMessage(
        uint8 kind,
        address sender,
        bytes32 messageDataHash,
        uint256 tokenFeeAmount
    ) external returns (uint256) {
        return _enqueueDelayedMessage(kind, sender, messageDataHash, tokenFeeAmount);
    }

    function _transferFunds(uint256 amount) internal override {
        // fetch native token from Inbox
        IERC20(nativeToken).safeTransferFrom(msg.sender, address(this), amount);
    }

    function _executeLowLevelCall(
        address to,
        uint256 value,
        bytes memory data
    ) internal override returns (bool success, bytes memory returnData) {
        address _nativeToken = nativeToken;

        // we don't allow outgoing calls to native token contract because it could
        // result in loss of native tokens which are escrowed by ERC20Bridge
        if (to == _nativeToken) {
            revert CallTargetNotAllowed(_nativeToken);
        }

        // first release native token
        IERC20(_nativeToken).safeTransfer(to, value);
        success = true;

        // if there's data do additional contract call. Make sure that call is not used to
        // decrease bridge contract's balance of the native token
        if (data.length > 0) {
            uint256 bridgeBalanceBefore = IERC20(_nativeToken).balanceOf(address(this));

            // solhint-disable-next-line avoid-low-level-calls
            (success, returnData) = to.call(data);

            uint256 bridgeBalanceAfter = IERC20(_nativeToken).balanceOf(address(this));
            if (bridgeBalanceAfter < bridgeBalanceBefore) {
                revert CallNotAllowed();
            }
        }
    }

    function _baseFeeToReport() internal pure override returns (uint256) {
        // ArbOs uses formula 'l1BaseFee * (1400 + 6 * calldataLengthInBytes)' to calculate retryable ticket's
        // submission fee. When custom ERC20 token is used to pay for fees, submission fee shall be 0. That's
        // why baseFee is reported as 0 here.
        return 0;
    }
}