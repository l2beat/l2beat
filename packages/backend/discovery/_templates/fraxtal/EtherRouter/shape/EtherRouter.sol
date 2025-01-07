// SPDX-License-Identifier: Unknown
pragma solidity 0.8.28;

library Address {
    /**
     * @dev The ETH balance of the account is not enough to perform the operation.
     */
    error AddressInsufficientBalance(address account);

    /**
     * @dev There's no code at `target` (it is not a contract).
     */
    error AddressEmptyCode(address target);

    /**
     * @dev A call to an address target failed. The target may have reverted.
     */
    error FailedInnerCall();

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason or custom error, it is bubbled
     * up by this function (like regular Solidity function calls). However, if
     * the call reverted with no returned reason, this function reverts with a
     * {FailedInnerCall} error.
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
     * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
     * unsuccessful call.
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) internal view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            // only check if target is a contract if the call was successful and the return data is empty
            // otherwise we already know that it was a contract
            if (returndata.length == 0 && target.code.length == 0) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
     * revert reason or with a default {FailedInnerCall} error.
     */
    function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            return returndata;
        }
    }

    /**
     * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
     */
    function _revert(bytes memory returndata) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}

library SafeERC20 {
    using Address for address;

    /**
     * @dev An operation with an ERC20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeCall(token.approve, (spender, value));

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeCall(token.approve, (spender, 0)));
            _callOptionalReturn(token, approvalCall);
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
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data);
        if (returndata.length != 0 && !abi.decode(returndata, (bool))) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return success && (returndata.length == 0 || abi.decode(returndata, (bool))) && address(token).code.length > 0;
    }
}

abstract contract PublicReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 internal _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}

abstract contract Timelock2Step {
    /// @notice The pending timelock address
    address public pendingTimelockAddress;

    /// @notice The current timelock address
    address public timelockAddress;

    constructor(address _timelockAddress) {
        timelockAddress = _timelockAddress;
    }

    // ============================================================================================
    // Functions: External Functions
    // ============================================================================================

    /// @notice The ```transferTimelock``` function initiates the timelock transfer
    /// @dev Must be called by the current timelock
    /// @param _newTimelock The address of the nominated (pending) timelock
    function transferTimelock(address _newTimelock) external virtual {
        _requireSenderIsTimelock();
        _transferTimelock(_newTimelock);
    }

    /// @notice The ```acceptTransferTimelock``` function completes the timelock transfer
    /// @dev Must be called by the pending timelock
    function acceptTransferTimelock() external virtual {
        _requireSenderIsPendingTimelock();
        _acceptTransferTimelock();
    }

    /// @notice The ```renounceTimelock``` function renounces the timelock after setting pending timelock to current timelock
    /// @dev Pending timelock must be set to current timelock before renouncing, creating a 2-step renounce process
    function renounceTimelock() external virtual {
        _requireSenderIsTimelock();
        _requireSenderIsPendingTimelock();
        _transferTimelock(address(0));
        _setTimelock(address(0));
    }

    // ============================================================================================
    // Functions: Internal Actions
    // ============================================================================================

    /// @notice The ```_transferTimelock``` function initiates the timelock transfer
    /// @dev This function is to be implemented by a public function
    /// @param _newTimelock The address of the nominated (pending) timelock
    function _transferTimelock(address _newTimelock) internal {
        pendingTimelockAddress = _newTimelock;
        emit TimelockTransferStarted(timelockAddress, _newTimelock);
    }

    /// @notice The ```_acceptTransferTimelock``` function completes the timelock transfer
    /// @dev This function is to be implemented by a public function
    function _acceptTransferTimelock() internal {
        pendingTimelockAddress = address(0);
        _setTimelock(msg.sender);
    }

    /// @notice The ```_setTimelock``` function sets the timelock address
    /// @dev This function is to be implemented by a public function
    /// @param _newTimelock The address of the new timelock
    function _setTimelock(address _newTimelock) internal {
        emit TimelockTransferred(timelockAddress, _newTimelock);
        timelockAddress = _newTimelock;
    }

    // ============================================================================================
    // Functions: Internal Checks
    // ============================================================================================

    /// @notice The ```_isTimelock``` function checks if _address is current timelock address
    /// @param _address The address to check against the timelock
    /// @return Whether or not msg.sender is current timelock address
    function _isTimelock(address _address) internal view returns (bool) {
        return _address == timelockAddress;
    }

    /// @notice The ```_requireIsTimelock``` function reverts if _address is not current timelock address
    /// @param _address The address to check against the timelock
    function _requireIsTimelock(address _address) internal view {
        if (!_isTimelock(_address)) revert AddressIsNotTimelock(timelockAddress, _address);
    }

    /// @notice The ```_requireSenderIsTimelock``` function reverts if msg.sender is not current timelock address
    /// @dev This function is to be implemented by a public function
    function _requireSenderIsTimelock() internal view {
        _requireIsTimelock(msg.sender);
    }

    /// @notice The ```_isPendingTimelock``` function checks if the _address is pending timelock address
    /// @dev This function is to be implemented by a public function
    /// @param _address The address to check against the pending timelock
    /// @return Whether or not _address is pending timelock address
    function _isPendingTimelock(address _address) internal view returns (bool) {
        return _address == pendingTimelockAddress;
    }

    /// @notice The ```_requireIsPendingTimelock``` function reverts if the _address is not pending timelock address
    /// @dev This function is to be implemented by a public function
    /// @param _address The address to check against the pending timelock
    function _requireIsPendingTimelock(address _address) internal view {
        if (!_isPendingTimelock(_address)) revert AddressIsNotPendingTimelock(pendingTimelockAddress, _address);
    }

    /// @notice The ```_requirePendingTimelock``` function reverts if msg.sender is not pending timelock address
    /// @dev This function is to be implemented by a public function
    function _requireSenderIsPendingTimelock() internal view {
        _requireIsPendingTimelock(msg.sender);
    }

    // ============================================================================================
    // Functions: Events
    // ============================================================================================

    /// @notice The ```TimelockTransferStarted``` event is emitted when the timelock transfer is initiated
    /// @param previousTimelock The address of the previous timelock
    /// @param newTimelock The address of the new timelock
    event TimelockTransferStarted(address indexed previousTimelock, address indexed newTimelock);

    /// @notice The ```TimelockTransferred``` event is emitted when the timelock transfer is completed
    /// @param previousTimelock The address of the previous timelock
    /// @param newTimelock The address of the new timelock
    event TimelockTransferred(address indexed previousTimelock, address indexed newTimelock);

    // ============================================================================================
    // Functions: Errors
    // ============================================================================================

    /// @notice Emitted when timelock is transferred
    error AddressIsNotTimelock(address timelockAddress, address actualAddress);

    /// @notice Emitted when pending timelock is transferred
    error AddressIsNotPendingTimelock(address pendingTimelockAddress, address actualAddress);
}

abstract contract OperatorRole {
    // ============================================================================================
    // Storage & Constructor
    // ============================================================================================

    /// @notice The current operator address
    address public operatorAddress;

    constructor(address _operatorAddress) {
        operatorAddress = _operatorAddress;
    }

    // ============================================================================================
    // Functions: Internal Actions
    // ============================================================================================

    /// @notice The ```OperatorTransferred``` event is emitted when the operator transfer is completed
    /// @param previousOperator The address of the previous operator
    /// @param newOperator The address of the new operator
    event OperatorTransferred(address indexed previousOperator, address indexed newOperator);

    /// @notice The ```_setOperator``` function sets the operator address
    /// @dev This function is to be implemented by a public function
    /// @param _newOperator The address of the new operator
    function _setOperator(address _newOperator) internal {
        emit OperatorTransferred(operatorAddress, _newOperator);
        operatorAddress = _newOperator;
    }

    // ============================================================================================
    // Functions: Internal Checks
    // ============================================================================================

    /// @notice The ```_isOperator``` function checks if _address is current operator address
    /// @param _address The address to check against the operator
    /// @return Whether or not msg.sender is current operator address
    function _isOperator(address _address) internal view returns (bool) {
        return _address == operatorAddress;
    }

    /// @notice The ```AddressIsNotOperator``` error is used for validation of the operatorAddress
    /// @param operatorAddress The expected operatorAddress
    /// @param actualAddress The actual operatorAddress
    error AddressIsNotOperator(address operatorAddress, address actualAddress);

    /// @notice The ```_requireIsOperator``` function reverts if _address is not current operator address
    /// @param _address The address to check against the operator
    function _requireIsOperator(address _address) internal view {
        if (!_isOperator(_address)) revert AddressIsNotOperator(operatorAddress, _address);
    }

    /// @notice The ```_requireSenderIsOperator``` function reverts if msg.sender is not current operator address
    /// @dev This function is to be implemented by a public function
    function _requireSenderIsOperator() internal view {
        _requireIsOperator(msg.sender);
    }
}

abstract contract RedemptionQueueV2Role {
    // ==============================================================================
    // Storage & Constructor
    // ==============================================================================

    FraxEtherRedemptionQueueV2 public redemptionQueue;

    /// @notice constructor
    /// @param _redemptionQueue Address of Redemption Queue
    constructor(address payable _redemptionQueue) {
        redemptionQueue = FraxEtherRedemptionQueueV2(_redemptionQueue);
    }

    // ==============================================================================
    // Configuration Setters
    // ==============================================================================

    /// @notice Sets a new Redemption Queue
    /// @param _redemptionQueue Address for the new Redemption Queue.
    function _setFraxEtherRedemptionQueueV2(address payable _redemptionQueue) internal {
        emit SetFraxEtherRedemptionQueueV2(address(redemptionQueue), _redemptionQueue);
        redemptionQueue = FraxEtherRedemptionQueueV2(_redemptionQueue);
    }

    // ==============================================================================
    // Internal Checks
    // ==============================================================================

    /// @notice Checks if an address is the Redemption Queue
    /// @param _address Address to test
    function _isFraxEtherRedemptionQueueV2(address _address) internal view returns (bool) {
        return (_address == address(redemptionQueue));
    }

    /// @notice Reverts if the address is not the Redemption Queue
    /// @param _address Address to test
    function _requireIsFraxEtherRedemptionQueueV2(address _address) internal view {
        if (!_isFraxEtherRedemptionQueueV2(_address)) {
            revert AddressIsNotFraxEtherRedemptionQueueV2(address(redemptionQueue), _address);
        }
    }

    /// @notice Reverts if msg.sender is not the Redemption Queue
    function _requireSenderIsFraxEtherRedemptionQueueV2() internal view {
        _requireIsFraxEtherRedemptionQueueV2(msg.sender);
    }

    // ==============================================================================
    // Events
    // ==============================================================================

    /// @notice The ```SetFraxEtherRedemptionQueueV2``` event fires when the Redemption Queue address changes
    /// @param oldFraxEtherRedemptionQueueV2 The old address
    /// @param newFraxEtherRedemptionQueueV2 The new address
    event SetFraxEtherRedemptionQueueV2(
        address indexed oldFraxEtherRedemptionQueueV2,
        address indexed newFraxEtherRedemptionQueueV2
    );

    // ==============================================================================
    // Errors
    // ==============================================================================

    /// @notice Emitted when the test address is not the Redemption Queue
    error AddressIsNotFraxEtherRedemptionQueueV2(address redemptionQueueAddress, address actualAddress);
}

abstract contract LendingPoolRole {
    // ==============================================================================
    // Storage & Constructor
    // ==============================================================================

    LendingPool public lendingPool;

    /// @notice constructor
    /// @param _lendingPool Address of Lending Pool
    constructor(address payable _lendingPool) {
        lendingPool = LendingPool(_lendingPool);
    }

    // ==============================================================================
    // Configuration Setters
    // ==============================================================================

    /// @notice Sets a new Lending Pool
    /// @param _lendingPool Address for the new Lending Pool.
    function _setLendingPool(address payable _lendingPool) internal {
        emit SetLendingPool(address(lendingPool), _lendingPool);
        lendingPool = LendingPool(_lendingPool);
    }

    // ==============================================================================
    // Internal Checks
    // ==============================================================================

    /// @notice Checks if an address is the Lending Pool
    /// @param _address Address to test
    function _isLendingPool(address _address) internal view returns (bool) {
        return (_address == address(lendingPool));
    }

    /// @notice Reverts if the address is not the Lending Pool
    /// @param _address Address to test
    function _requireIsLendingPool(address _address) internal view {
        if (!_isLendingPool(_address)) {
            revert AddressIsNotLendingPool(address(lendingPool), _address);
        }
    }

    /// @notice Reverts if msg.sender is not the Lending Pool
    function _requireSenderIsLendingPool() internal view {
        _requireIsLendingPool(msg.sender);
    }

    // ==============================================================================
    // Events
    // ==============================================================================

    /// @notice The ```SetLendingPool``` event fires when the Lending Pool address changes
    /// @param oldLendingPool The old address
    /// @param newLendingPool The new address
    event SetLendingPool(address indexed oldLendingPool, address indexed newLendingPool);

    // ==============================================================================
    // Errors
    // ==============================================================================

    /// @notice Emitted when the test address is not the Lending Pool
    error AddressIsNotLendingPool(address lendingPoolAddress, address actualAddress);
}

contract EtherRouter is LendingPoolRole, RedemptionQueueV2Role, OperatorRole, Timelock2Step, PublicReentrancyGuard {
    using SafeERC20 for ERC20;

    // ========================================================
    // STATE VARIABLES
    // ========================================================

    // AMO addresses
    /// @notice Array of AMOs
    address[] public amosArray;

    /// @notice Mapping is also used for faster verification
    mapping(address => bool) public amos; //

    /// @notice For caching getConsolidatedEthFrxEthBalance
    // mapping(address => bool) public staleStatusCEFEBals;
    mapping(address => CachedConsEFxBalances) public cachedConsEFxEBals;

    /// @notice Address where all ETH deposits will go to
    address public depositToAmoAddr;

    /// @notice Address where requestEther will pull from first
    address public primaryWithdrawFromAmoAddr;

    /// @notice Address of frxETH
    ERC20 public immutable frxETH;

    // ========================================================
    // STRUCTS
    // ========================================================

    /// @notice Get frxETH/sfrxETH and ETH/LSD/WETH balances
    /// @param isStale If the cache is stale or not
    /// @param amoAddress Address of the AMO for this cache
    /// @param ethFree Free and clear ETH/LSD/WETH
    /// @param ethInLpBalanced ETH/LSD/WETH in LP (balanced withdrawal)
    /// @param ethTotalBalanced Free and clear ETH/LSD/WETH + ETH/LSD/WETH in LP (balanced withdrawal)
    /// @param frxEthFree Free and clear frxETH/sfrxETH
    /// @param frxEthInLpBalanced frxETH/sfrxETH in LP (balanced withdrawal)
    struct CachedConsEFxBalances {
        bool isStale;
        address amoAddress;
        uint96 ethFree;
        uint96 ethInLpBalanced;
        uint96 ethTotalBalanced;
        uint96 frxEthFree;
        uint96 frxEthInLpBalanced;
    }

    // ========================================================
    // CONSTRUCTOR
    // ========================================================

    /// @notice Constructor for the EtherRouter
    /// @param _timelockAddress The timelock address
    /// @param _operatorAddress The operator address
    /// @param _frxEthAddress The address of the frxETH ERC20
    constructor(
        address _timelockAddress,
        address _operatorAddress,
        address _frxEthAddress
    )
        RedemptionQueueV2Role(payable(address(0)))
        LendingPoolRole(payable(address(0)))
        OperatorRole(_operatorAddress)
        Timelock2Step(_timelockAddress)
    {
        frxETH = ERC20(_frxEthAddress);
    }

    // ====================================
    // INTERNAL FUNCTIONS
    // ====================================

    /// @notice Checks if msg.sender is current timelock address or the operator
    function _requireIsTimelockOrOperator() internal view {
        if (!((msg.sender == timelockAddress) || (msg.sender == operatorAddress))) revert NotTimelockOrOperator();
    }

    /// @notice Checks if msg.sender is the lending pool or the redemption queue
    function _requireSenderIsLendingPoolOrRedemptionQueue() internal view {
        if (!((msg.sender == address(lendingPool)) || (msg.sender == address(redemptionQueue)))) {
            revert NotLendingPoolOrRedemptionQueue();
        }
    }

    // ========================================================
    // VIEWS
    // ========================================================

    /// @notice Get frxETH/sfrxETH and ETH/LSD/WETH balances
    /// @param _forceLive Force a live recalculation of the AMO values
    /// @param _previewUpdateCache Calculate, but do not write, updated cache values
    /// @return _rtnTtlBalances frxETH/sfrxETH and ETH/LSD/WETH balances
    /// @return _cachesToUpdate Caches to be updated, if specified in _previewUpdateCache
    function _getConsolidatedEthFrxEthBalanceViewCore(
        bool _forceLive,
        bool _previewUpdateCache
    )
        internal
        view
        returns (CachedConsEFxBalances memory _rtnTtlBalances, CachedConsEFxBalances[] memory _cachesToUpdate)
    {
        // Initialize _cachesToUpdate
        CachedConsEFxBalances[] memory _cachesToUpdateLocal = new CachedConsEFxBalances[](amosArray.length);

        // Add ETH sitting in this contract first
        // frxETH/sfrxETH should never be here
        // _rtnTtlBalances.isStale = false
        _rtnTtlBalances.ethFree += uint96(address(this).balance);
        _rtnTtlBalances.ethTotalBalanced += uint96(address(this).balance);

        // Loop through all the AMOs and sum
        for (uint256 i = 0; i < amosArray.length; ) {
            address _amoAddress = amosArray[i];
            // Skip removed AMOs
            if (_amoAddress != address(0)) {
                // Pull the cache entry
                CachedConsEFxBalances memory _cacheEntry = cachedConsEFxEBals[_amoAddress];

                // If the caller wants to force a live calc, or the cache is stale
                if (_cacheEntry.isStale || _forceLive) {
                    IfrxEthV2AMOHelper.ShowAmoBalancedAllocsPacked memory _packedBals = IfrxEthV2AMOHelper(
                        IfrxEthV2AMO(_amoAddress).amoHelper()
                    ).getConsolidatedEthFrxEthBalancePacked(_amoAddress);

                    // Add to the return totals
                    _rtnTtlBalances.ethFree += _packedBals.amoEthFree;
                    _rtnTtlBalances.ethInLpBalanced += _packedBals.amoEthInLpBalanced;
                    _rtnTtlBalances.ethTotalBalanced += _packedBals.amoEthTotalBalanced;
                    _rtnTtlBalances.frxEthFree += _packedBals.amoFrxEthFree;
                    _rtnTtlBalances.frxEthInLpBalanced += _packedBals.amoFrxEthInLpBalanced;

                    // If the cache should be updated (per the input params)
                    if (_previewUpdateCache) {
                        // Push to the return array
                        // Would have rather wrote to storage here, but the compiler complained about the view "mutability"
                        _cachesToUpdateLocal[i] = CachedConsEFxBalances(
                            false,
                            _amoAddress,
                            _packedBals.amoEthFree,
                            _packedBals.amoEthInLpBalanced,
                            _packedBals.amoEthTotalBalanced,
                            _packedBals.amoFrxEthFree,
                            _packedBals.amoFrxEthInLpBalanced
                        );
                    }
                } else {
                    // Otherwise, just read from the cache
                    _rtnTtlBalances.ethFree += _cacheEntry.ethFree;
                    _rtnTtlBalances.ethInLpBalanced += _cacheEntry.ethInLpBalanced;
                    _rtnTtlBalances.ethTotalBalanced += _cacheEntry.ethTotalBalanced;
                    _rtnTtlBalances.frxEthFree += _cacheEntry.frxEthFree;
                    _rtnTtlBalances.frxEthInLpBalanced += _cacheEntry.frxEthInLpBalanced;
                }
            }
            unchecked {
                ++i;
            }
        }

        // Update the return value
        _cachesToUpdate = _cachesToUpdateLocal;
    }

    /// @notice Get frxETH/sfrxETH and ETH/LSD/WETH balances
    /// @param _forceLive Force a live recalculation of the AMO values
    /// @param _updateCache Whether to update the cache
    /// @return _rtnBalances frxETH/sfrxETH and ETH/LSD/WETH balances
    function getConsolidatedEthFrxEthBalance(
        bool _forceLive,
        bool _updateCache
    ) external returns (CachedConsEFxBalances memory _rtnBalances) {
        CachedConsEFxBalances[] memory _cachesToUpdate;
        // Determine the route
        if (_updateCache) {
            // Fetch the return balances as well as the new balances to cache
            (_rtnBalances, _cachesToUpdate) = _getConsolidatedEthFrxEthBalanceViewCore(_forceLive, true);

            // Loop through the caches and store them
            for (uint256 i = 0; i < _cachesToUpdate.length; ) {
                // Get the address of the AMO
                address _amoAddress = _cachesToUpdate[i].amoAddress;

                // Skip caches that don't need to be updated
                if (_amoAddress != address(0)) {
                    // Update storage
                    cachedConsEFxEBals[_amoAddress] = _cachesToUpdate[i];
                }
                unchecked {
                    ++i;
                }
            }
        } else {
            // Don't care about updating the cache, so return early
            (_rtnBalances, ) = _getConsolidatedEthFrxEthBalanceViewCore(_forceLive, false);
        }
    }

    /// @notice Get frxETH/sfrxETH and ETH/LSD/WETH balances
    /// @param _forceLive Force a live recalculation of the AMO values
    /// @return _rtnBalances frxETH/sfrxETH and ETH/LSD/WETH balances
    function getConsolidatedEthFrxEthBalanceView(
        bool _forceLive
    ) external view returns (CachedConsEFxBalances memory _rtnBalances) {
        // Return the view-only component
        (_rtnBalances, ) = _getConsolidatedEthFrxEthBalanceViewCore(_forceLive, false);
    }

    // ========================================================
    // CALLED BY LENDING POOL
    // ========================================================

    /// @notice Lending Pool or Minter or otherwise -> ETH -> This Ether Router
    function depositEther() external payable {
        // Do nothing for now except accepting the ETH
    }

    /// @notice Use a private transaction. Router will deposit ETH first into the redemption queue, if there is a shortage. Any leftover ETH goes to the default depositToAmoAddr.
    /// @param _amount Amount to sweep. Will use contract balance if = 0
    /// @param _depositAndVault Whether you want to just dump the ETH in the Curve AMO, or if you want to wrap and vault it too
    function sweepEther(uint256 _amount, bool _depositAndVault) external {
        _requireIsTimelockOrOperator();

        // Add interest first
        lendingPool.addInterest(false);

        // Use the entire contract balance if _amount is 0
        if (_amount == 0) _amount = address(this).balance;

        // See if the redemption queue has a shortage
        (, uint256 _rqShortage) = redemptionQueue.ethShortageOrSurplus();

        // Take care of any shortage first
        if (_amount <= _rqShortage) {
            // Give all you can to help address the shortage
            (bool sent, ) = payable(redemptionQueue).call{ value: _amount }("");
            if (!sent) revert EthTransferFailedER(0);

            emit EtherSwept(address(redemptionQueue), _amount);
        } else {
            // First fulfill the shortage, if any
            if (_rqShortage > 0) {
                (bool sent, ) = payable(redemptionQueue).call{ value: _rqShortage }("");
                if (!sent) revert EthTransferFailedER(1);

                emit EtherSwept(address(redemptionQueue), _rqShortage);
            }

            // Calculate the remaining ETH
            uint256 _remainingEth = _amount - _rqShortage;

            // Make sure the AMO is not the zero address, then deposit to it
            if (depositToAmoAddr != address(0)) {
                // Send ETH to the AMO. Either 1) Leave it alone, or 2) Deposit it into cvxLP + vault it
                if (_depositAndVault) {
                    // Drop in, deposit, and vault
                    IfrxEthV2AMO(depositToAmoAddr).depositEther{ value: _remainingEth }();
                } else {
                    // Drop in only
                    (bool sent, ) = payable(depositToAmoAddr).call{ value: _remainingEth }("");
                    if (!sent) revert EthTransferFailedER(2);
                }

                // Mark the getConsolidatedEthFrxEthBalance cache as stale for this AMO
                cachedConsEFxEBals[depositToAmoAddr].isStale = true;
            }

            emit EtherSwept(depositToAmoAddr, _remainingEth);
        }

        // Update the stored utilization rate
        lendingPool.updateUtilization();
    }

    /// @notice See how ETH would flow if requestEther were called
    /// @param _ethRequested Amount of ETH requested
    /// @return _currEthInRouter How much ETH is currently in this contract
    /// @return _rqShortage How much the ETH shortage in the redemption queue is, if any
    /// @return _pullFromAmosAmount How much ETH would need to be pulled from various AMO(s)
    function previewRequestEther(
        uint256 _ethRequested
    ) public view returns (uint256 _currEthInRouter, uint256 _rqShortage, uint256 _pullFromAmosAmount) {
        // See how much ETH is already in this contract
        _currEthInRouter = address(this).balance;

        // See if the redemption queue has a shortage
        (, _rqShortage) = redemptionQueue.ethShortageOrSurplus();

        // Determine where to get the ETH from
        if ((_ethRequested + _rqShortage) <= _currEthInRouter) {
            // Do nothing, the ETH will be pulled from existing funds in this contract
        } else {
            // Calculate the extra amount needed from various AMO(s)
            _pullFromAmosAmount = _ethRequested + _rqShortage - _currEthInRouter;
        }
    }

    /// @notice AMO(s) -> ETH -> (Lending Pool or Redemption Queue). Instruct the router to get ETH from various AMO(s) (free and vaulted)
    /// @param _recipient Recipient of the ETH
    /// @param _ethRequested Amount of ETH requested
    /// @param _bypassFullRqShortage If someone wants to redeem and _rqShortage is too large, send back what you can
    /// @dev Need to pay off any shortage in the redemption queue first
    function requestEther(
        address payable _recipient,
        uint256 _ethRequested,
        bool _bypassFullRqShortage
    ) external nonReentrant {
        // Only the LendingPool or RedemptionQueue can call
        _requireSenderIsLendingPoolOrRedemptionQueue();

        // Add interest
        lendingPool.addInterestPrivileged(false);
        // if (msg.sender == address(redemptionQueue)) {
        //     lendingPool.addInterestPrivileged(false);
        // }
        // else if (msg.sender == address(lendingPool)) {
        //     lendingPool.addInterest(false);

        // }
        // else {
        //     revert NotLendingPoolOrRedemptionQueue();
        // }

        // See where the ETH is and where it needs to go
        (uint256 _currEthInRouter, uint256 _rqShortage, uint256 _pullFromAmosAmount) = previewRequestEther(
            _ethRequested
        );

        // Pull the extra amount needed from the AMO(s) first, if necessary
        uint256 _remainingEthToPull = _pullFromAmosAmount;

        // If _bypassFullRqShortage is true, we don't care about the full RQ shortage
        if (_bypassFullRqShortage) {
            if (_ethRequested <= _currEthInRouter) {
                // The ETH will be pulled from existing funds in this contract
                _remainingEthToPull = 0;
            } else {
                // Calculate the extra amount needed from various AMO(s)
                _remainingEthToPull = _ethRequested - _currEthInRouter;
            }
        }

        // Start pulling from the AMOs, with primaryWithdrawFromAmoAddr being preferred
        if (_remainingEthToPull > 0) {
            // Order the amos
            address[] memory _sortedAmos = new address[](amosArray.length);

            // Handle primaryWithdrawFromAmoAddr
            if (primaryWithdrawFromAmoAddr != address(0)) {
                // primaryWithdrawFromAmoAddr should be first
                _sortedAmos[0] = primaryWithdrawFromAmoAddr;

                // Loop through all the AMOs and fill _sortedAmos
                uint256 _nextIdx = 1; // [0] is always primaryWithdrawFromAmoAddr
                for (uint256 i = 0; i < amosArray.length; ++i) {
                    // Don't double add primaryWithdrawFromAmoAddr
                    if (amosArray[i] == primaryWithdrawFromAmoAddr) continue;

                    // Push the remaining AMOs in
                    _sortedAmos[_nextIdx] = amosArray[i];

                    // Increment the next index to insert at
                    ++_nextIdx;
                }
            } else {
                _sortedAmos = amosArray;
            }

            // Loop through the AMOs and pull out ETH
            for (uint256 i = 0; i < _sortedAmos.length; ) {
                if (_sortedAmos[i] != address(0)) {
                    // Pull Ether from an AMO. May return a 0, partial, or full amount
                    (uint256 _ethOut, ) = IfrxEthV2AMO(_sortedAmos[i]).requestEtherByRouter(_remainingEthToPull);

                    // Account for the collected Ether
                    _remainingEthToPull -= _ethOut;

                    // If ETH was removed, mark the getConsolidatedEthFrxEthBalance cache as stale for this AMO
                    if (_ethOut > 0) cachedConsEFxEBals[_sortedAmos[i]].isStale = true;

                    // Stop looping if it collected enough
                    if (_remainingEthToPull == 0) break;
                    unchecked {
                        ++i;
                    }
                }
            }
        }

        // Fail early if you didn't manage to collect enough, but see if it is a dust amount first
        if (_remainingEthToPull > 0) revert NotEnoughEthPulled(_remainingEthToPull);

        // Give the shortage ETH to the redemption queue, if necessary and not bypassed
        if (!_bypassFullRqShortage && (_rqShortage > 0)) {
            (bool sent, ) = payable(redemptionQueue).call{ value: _rqShortage }("");
            if (!sent) revert EthTransferFailedER(2);
        }

        // Give remaining ETH to the recipient (could be the redemption queue)
        (bool sent, ) = payable(_recipient).call{ value: _ethRequested }("");
        if (!sent) revert EthTransferFailedER(3);

        // Update the stored utilization rate
        lendingPool.updateUtilization();

        emit EtherRequested(payable(_recipient), _ethRequested, _rqShortage);
    }

    /// @notice Needs to be here to receive ETH
    receive() external payable {
        // Do nothing for now.
    }

    // ========================================================
    // RESTRICTED GOVERNANCE FUNCTIONS
    // ========================================================

    // Adds an AMO
    /// @param _amoAddress Address of the AMO to add
    function addAmo(address _amoAddress) external {
        _requireSenderIsTimelock();
        if (_amoAddress == address(0)) revert ZeroAddress();

        // Need to make sure at least that getConsolidatedEthFrxEthBalance is present
        // This will revert if it isn't there
        IfrxEthV2AMOHelper(IfrxEthV2AMO(_amoAddress).amoHelper()).getConsolidatedEthFrxEthBalance(_amoAddress);

        // Make sure the AMO isn't already here
        if (amos[_amoAddress]) revert AmoAlreadyExists();

        // Update state
        amos[_amoAddress] = true;
        amosArray.push(_amoAddress);

        emit FrxEthAmoAdded(_amoAddress);
    }

    // Removes an AMO
    /// @param _amoAddress Address of the AMO to remove
    function removeAmo(address _amoAddress) external {
        _requireSenderIsTimelock();
        if (_amoAddress == address(0)) revert ZeroAddress();
        if (!amos[_amoAddress]) revert AmoAlreadyOffOrMissing();

        // Delete from the mapping
        delete amos[_amoAddress];

        // 'Delete' from the array by setting the address to 0x0
        for (uint256 i = 0; i < amosArray.length; ) {
            if (amosArray[i] == _amoAddress) {
                amosArray[i] = address(0); // This will leave a null in the array and keep the indices the same
                break;
            }
            unchecked {
                ++i;
            }
        }

        emit FrxEthAmoRemoved(_amoAddress);
    }

    /// @notice Set preferred AMO addresses to deposit to / withdraw from
    /// @param _depositToAddress New address for the ETH deposit destination
    /// @param _withdrawFromAddress New address for the primary ETH withdrawal source
    function setPreferredDepositAndWithdrawalAMOs(address _depositToAddress, address _withdrawFromAddress) external {
        _requireIsTimelockOrOperator();

        // Make sure they are actually AMOs
        if (!amos[_depositToAddress] || !amos[_withdrawFromAddress]) revert InvalidAmo();

        // Set the addresses
        depositToAmoAddr = _depositToAddress;
        primaryWithdrawFromAmoAddr = _withdrawFromAddress;

        emit PreferredDepositAndWithdrawalAmoAddressesSet(_depositToAddress, _withdrawFromAddress);
    }

    /// @notice Sets the lending pool, where ETH is taken from / given to
    /// @param _newAddress New address for the lending pool
    function setLendingPool(address _newAddress) external {
        _requireSenderIsTimelock();
        _setLendingPool(payable(_newAddress));
    }

    /// @notice Change the Operator address
    /// @param _newOperatorAddress Operator address
    function setOperatorAddress(address _newOperatorAddress) external {
        _requireSenderIsTimelock();
        _setOperator(_newOperatorAddress);
    }

    /// @notice Sets the redemption queue, where frxETH is redeemed for ETH. Only callable once
    /// @param _newAddress New address for the redemption queue
    function setRedemptionQueue(address _newAddress) external {
        _requireSenderIsTimelock();

        // Only can set once
        if (payable(redemptionQueue) != payable(0)) revert RedemptionQueueAddressAlreadySet();

        _setFraxEtherRedemptionQueueV2(payable(_newAddress));
    }

    // ==============================================================================
    // Recovery Functions
    // ==============================================================================

    /// @notice For taking lending interest profits, or removing excess ETH. Proceeds go to timelock.
    /// @param _amount Amount of ETH to recover
    function recoverEther(uint256 _amount) external {
        _requireSenderIsTimelock();

        (bool _success, ) = address(timelockAddress).call{ value: _amount }("");
        if (!_success) revert InvalidRecoverEtherTransfer();

        emit EtherRecovered(_amount);
    }

    /// @notice For emergencies if someone accidentally sent some ERC20 tokens here. Proceeds go to timelock.
    /// @param _tokenAddress Address of the ERC20 to recover
    /// @param _tokenAmount Amount of the ERC20 to recover
    function recoverErc20(address _tokenAddress, uint256 _tokenAmount) external {
        _requireSenderIsTimelock();

        ERC20(_tokenAddress).safeTransfer({ to: timelockAddress, value: _tokenAmount });

        emit Erc20Recovered(_tokenAddress, _tokenAmount);
    }

    // ========================================================
    // ERRORS
    // ========================================================

    /// @notice When you are trying to add an AMO that already exists
    error AmoAlreadyExists();

    /// @notice When you are trying to remove an AMO that is already removed or doesn't exist
    error AmoAlreadyOffOrMissing();

    /// @notice When an Ether transfer fails
    /// @param step A marker in the code where it is failing
    error EthTransferFailedER(uint256 step);

    /// @notice When you are trying to interact with an invalid AMO
    error InvalidAmo();

    /// @notice Invalid ETH transfer during recoverEther
    error InvalidRecoverEtherTransfer();

    /// @notice If requestEther was unable to pull enough ETH from AMOs to satify a request
    /// @param remainingEth The amount remaining that was unable to be pulled
    error NotEnoughEthPulled(uint256 remainingEth);

    /// @notice Thrown if the sender is not the lending pool or the redemption queue
    error NotLendingPoolOrRedemptionQueue();

    /// @notice Thrown if the sender is not the timelock or the operator
    error NotTimelockOrOperator();

    /// @notice Thrown if the redemption queue address was already set
    error RedemptionQueueAddressAlreadySet();

    /// @notice When an provided address is address(0)
    error ZeroAddress();

    // ========================================================
    // EVENTS
    // ========================================================

    /// @notice When recoverEther is called
    /// @param amount The amount of Ether recovered
    event EtherRecovered(uint256 amount);

    /// @notice When recoverErc20 is called
    /// @param tokenAddress The address of the ERC20 token being recovered
    /// @param tokenAmount The quantity of the token
    event Erc20Recovered(address tokenAddress, uint256 tokenAmount);

    /// @notice When Ether is requested and sent out
    /// @param requesterAddress Address of the requester
    /// @param amountToRequester Amount of ETH sent to the requester
    /// @param amountToRedemptionQueue Amount of ETH sent to the redemption queue
    event EtherRequested(address requesterAddress, uint256 amountToRequester, uint256 amountToRedemptionQueue);

    /// @notice When Ether is moved from this contract into the redemption queue or AMO(s)
    /// @param destAddress Where the ETH was swept into
    /// @param amount Amount of the swept ETH
    event EtherSwept(address destAddress, uint256 amount);

    /// @notice When an AMO is added
    /// @param amoAddress The address of the added AMO
    event FrxEthAmoAdded(address amoAddress);

    /// @notice When an AMO is removed
    /// @param amoAddress The address of the removed AMO
    event FrxEthAmoRemoved(address amoAddress);

    /// @notice When the preferred AMO addresses to deposit to / withdraw from are set
    /// @param depositToAddress Which AMO incoming ETH should be sent to
    /// @param withdrawFromAddress New address for the primary ETH withdrawal source
    event PreferredDepositAndWithdrawalAmoAddressesSet(address depositToAddress, address withdrawFromAddress);
}