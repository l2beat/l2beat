// SPDX-License-Identifier: Unknown
pragma solidity 0.8.16;

library AddressAliasHelper {
    uint160 internal constant OFFSET = uint160(0x1111000000000000000000000000000000001111);

    /// @notice Utility function that converts the address in the L1 that submitted a tx to
    /// the inbox to the msg.sender viewed in the L2
    /// @param l1Address the address in the L1 that triggered the tx to L2
    /// @return l2Address L2 address as viewed in msg.sender
    function applyL1ToL2Alias(address l1Address) internal pure returns (address l2Address) {
        unchecked {
            l2Address = address(uint160(l1Address) + OFFSET);
        }
    }

    /// @notice Utility function that converts the msg.sender viewed in the L2 to the
    /// address in the L1 that submitted a tx to the inbox
    /// @param l2Address L2 address as viewed in msg.sender
    /// @return l1Address the address in the L1 that triggered the tx to L2
    function undoL1ToL2Alias(address l2Address) internal pure returns (address l1Address) {
        unchecked {
            l1Address = address(uint160(l2Address) - OFFSET);
        }
    }
}

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

    function safePermit(
        IERC20Permit token,
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

abstract contract DistributionInterval {
    address public constant NATIVE_CURRENCY = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    mapping(address => uint256) public nextDistributions;
    uint256 immutable minDistributionIntervalSeconds;

    error DistributionTooSoon(uint256 currentTimestamp, uint256 distributionTimestamp);

    constructor(uint256 _minDistributionIntervalSeconds) {
        minDistributionIntervalSeconds = _minDistributionIntervalSeconds;
    }

    function timeToNextDistribution(address _erc20orNative) public view returns (uint256) {
        uint256 nextDistribution = nextDistributions[_erc20orNative];
        return block.timestamp >= nextDistribution ? 0 : nextDistribution - block.timestamp;
    }

    function canDistribute(address _erc20orNative) public view returns (bool) {
        return timeToNextDistribution(_erc20orNative) == 0;
    }

    function _updateDistribution(address _erc20orNative) internal {
        nextDistributions[_erc20orNative] = block.timestamp + minDistributionIntervalSeconds;
    }
}

contract ParentToChildRewardRouter is DistributionInterval {
    using SafeERC20 for IERC20;

    // inbox of target Arbitrum child chain
    IInbox public immutable inbox;
    // Receiving address of funds on target Arbitrum chain
    address public immutable destination;
    // minimum child chain gas price for retryable ticket execution, to prevent spam
    uint256 public immutable minGasPrice;
    // minimum child chain gas limit for retryable ticket execution, to prevent spam
    uint256 public immutable minGasLimit;
    // address of token gateway router on this chain.
    IParentChainGatewayRouter public immutable parentChainGatewayRouter;

    event FundsRouted(address indexed token, uint256 amount);

    constructor(
        IParentChainGatewayRouter _parentChainGatewayRouter,
        address _destination,
        uint256 _minDistributionIntervalSeconds,
        uint256 _minGasPrice,
        uint256 _minGasLimit
    ) DistributionInterval(_minDistributionIntervalSeconds) {
        if (_destination == address(0)) {
            revert ZeroAddress();
        }
        parentChainGatewayRouter = _parentChainGatewayRouter;
        inbox = IInbox(parentChainGatewayRouter.inbox());
        destination = _destination;
        minGasPrice = _minGasPrice;
        minGasLimit = _minGasLimit;
    }

    receive() external payable {}

    /// @notice send all native funds in this contract to destination. Uses sender's address for fee refund
    /// @param maxSubmissionCost submission cost for retryable ticket
    /// @param gasLimit gas limit for l2 execution of retryable ticket
    /// @param maxFeePerGas max gas l2 gas price for retryable ticket
    function routeNativeFunds(uint256 maxSubmissionCost, uint256 gasLimit, uint256 maxFeePerGas) public payable {
        if (!canDistribute(NATIVE_CURRENCY)) {
            revert DistributionTooSoon(block.timestamp, nextDistributions[NATIVE_CURRENCY]);
        }

        if (gasLimit < minGasLimit) {
            revert GasLimitTooLow(gasLimit);
        }

        if (maxFeePerGas < minGasPrice) {
            revert GasPriceTooLow(maxFeePerGas);
        }

        uint256 amount = address(this).balance - msg.value;
        if (amount == 0) {
            revert NoFundsToDistribute();
        }

        // This method uses unsafeCreateRetryableTicket. Compared to createRetryableTicket, unsafeCreateRetryableTicket leaves out 3 things:
        // 1. check msg.value supplied equals gas required for retryable execution
        // 2. Conditionally alias excessFeeRefundAddress
        // 3. Conditionally alias callValueRefundAddress
        // The rationale for including, modifying, or excluding these things is as follows:

        // #1 we include in slightly modified form; we ensure the msg.value covers the cost of execution, though not including the L2 callvalue.
        // (the L2Callue will be the funds already escrowed in this contract)
        if (maxFeePerGas * gasLimit + maxSubmissionCost != msg.value) {
            revert IncorrectValue(maxFeePerGas * gasLimit + maxSubmissionCost, msg.value);
        }

        // #2 we include identically to how it appears in the createRetryableTicket path, and for the same rationale:
        // gives smart contract wallets the opportunity to access excess fee funds on the child chain
        address excessFeeRefundAddress = msg.sender;
        if (Address.isContract(excessFeeRefundAddress)) {
            excessFeeRefundAddress = AddressAliasHelper.applyL1ToL2Alias(excessFeeRefundAddress);
        }

        _updateDistribution(NATIVE_CURRENCY);
        inbox.unsafeCreateRetryableTicket{value: address(this).balance}({
            to: destination,
            l2CallValue: amount,
            maxSubmissionCost: maxSubmissionCost,
            excessFeeRefundAddress: excessFeeRefundAddress,
            // #3 we leave out; i.e., we don't alias the callValueRefundAddress, we simply set it to the destination.
            // This means if the retryable ticket expires or is cancelled, the l2CallValue is sent to the destination, which
            // is the intended result anyway.
            callValueRefundAddress: destination,
            gasLimit: gasLimit,
            maxFeePerGas: maxFeePerGas,
            data: ""
        });
        emit FundsRouted(NATIVE_CURRENCY, amount);
    }

    /// @notice send full token balance in this contract to destination. Uses sender's address for fee refund
    /// @param parentChainTokenAddr address of token on this chain to route
    /// @param maxSubmissionCost submission cost for retryable ticket
    /// @param gasLimit gas limit for l2 execution of retryable ticket
    /// @param maxFeePerGas max gas l2 gas price for retryable ticket
    function routeToken(address parentChainTokenAddr, uint256 maxSubmissionCost, uint256 gasLimit, uint256 maxFeePerGas)
        public
        payable
    {
        // use routeNativeFunds, not this method, for native currency,
        if (parentChainTokenAddr == NATIVE_CURRENCY) {
            revert WrongMethod();
        }
        if (!canDistribute(parentChainTokenAddr)) {
            revert DistributionTooSoon(block.timestamp, nextDistributions[parentChainTokenAddr]);
        }

        if (gasLimit < minGasLimit) {
            revert GasLimitTooLow(gasLimit);
        }

        if (maxFeePerGas < minGasPrice) {
            revert GasPriceTooLow(maxFeePerGas);
        }

        uint256 amount = IERC20(parentChainTokenAddr).balanceOf(address(this));
        if (amount == 0) {
            revert NoFundsToDistribute();
        }
        _updateDistribution(parentChainTokenAddr);
        // get gateway from gateway router
        address gateway = parentChainGatewayRouter.getGateway(address(parentChainTokenAddr));
        // approve amount on gateway
        IERC20(parentChainTokenAddr).safeApprove(gateway, amount);

        // encode max submission cost (and empty callhook data) for gateway router
        bytes memory _data = abi.encode(maxSubmissionCost, bytes(""));

        // As the caller of outboundTransferCustomRefund, this contract's alias is set as the callValueRfundAddress,
        // giving it affordance to cancel and receive callvalue refund. Since this contract can't call cancel, cancellation
        // can't be performed. Generally calls to outboundTransferCustomRefund will create retryables with zero callValue
        // (and even if there is callvalue, the refund would only take effect if the retryable expires).
        parentChainGatewayRouter.outboundTransferCustomRefund{value: msg.value}({
            _token: parentChainTokenAddr,
            _refundTo: msg.sender, // send excess fees to the sender's address on the child chain
            _to: destination,
            _amount: amount,
            _maxGas: gasLimit,
            _gasPriceBid: maxFeePerGas,
            _data: _data
        });

        emit FundsRouted(parentChainTokenAddr, amount);
    }
}