// SPDX-License-Identifier: Unknown
pragma solidity 0.8.26;

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

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

interface ITokenHopper {
    /**
     * HopperConfiguration
     *
     * This structure is supplied by the hopper owner
     * to configure it's parameters.
     */
    struct HopperConfiguration {
        // Initial Funds
        // Each hopper will hold exactly one token type.
        address token;

        // Behavior
        // Time at (or after) which the first button press can occur.
        uint256 startTime;
        // During each `cooldownSeconds` period from the `startTime`, there can be a single button press
        uint256 cooldownSeconds;
        // Provides the logic behind the button press for the hopper.
        address actionGenerator;

        // Expiration
        /**
         * Optionally, a hopper can expire at a specific timestamp.
         * If set to true, the expirationTimestamp is used to disable
         * the hopper's programmed behavior and, if any funds are left,
         * enables the hopper owner to retrieve the funds.
         */
        // CAREFUL! Setting this to false will lock funds FOREVER! 
        bool doesExpire;
        // only considered as valid (even set to 0) if doesExpire is true
        uint256 expirationTimestamp;
    }

    // @notice Emitted on construction, capturing the Hopper Configuration
    event HopperLoaded(HopperConfiguration config);

    /**
     * @notice Emitted when `pressButton` is called successfully
     * @param caller The address which pressed the button
     * @param newCooldownHorizon The next time at which the button can be pressed
     */
    event ButtonPressed(address indexed caller, uint256 newCooldownHorizon);

    // @notice Emitted when `retrieveFunds` is called and `amount` funds are retrieved.
    event FundsRetrieved(uint256 amount);

    /**
     * isExpired()
     *
     * Determines if the hopper has expired, making any remaining token balance
     * retriavable by the owner.
     *
     * @return true if and only if isLoaded() && (doesExpire && block.timestamp >= expirationTimestamp)
     */
    function isExpired() external view returns (bool);

    /**
     * getHopperConfiguration()
     *
     * If the hopper has not yet been loaded, this call will revert.
     *
     * @return the hopper configuration initially supplied by the owner.
     */
    function getHopperConfiguration() external view returns (HopperConfiguration memory);

    /**
     * canPress()
     *
     * Determines if the hopper is in a state ready for action. Great way
     * within other contracts to make sure your transaction doesn't blow up.
     *
     * @return true if the hopper is loaded and not in cooldown, false otherwise.
     */
    function canPress() external view returns (bool);

    /**
     * pressButton()
     *
     * Any actor can call this function to initiate the set of actions in the hopper.
     *
     * This call will revert if any of the actions revert, if the hopper has
     * not yet been loaded, or if the hopper is in a cooldown period.
     */
    function pressButton() external;

    /**
     * retrieveFunds()
     *
     * This method can only be called by the owner and will return all remaining
     * token balance to them if and only if the hopper is expired.
     *
     * This method will always revert if the hopper is not configured to expire.
     * It will also revert if the expiration date has not yet passed.
     */
     function retrieveFunds() external;
}

contract TokenHopper is ITokenHopper, Ownable {
    using SafeERC20 for IERC20;

    // provided on construction
    HopperConfiguration internal configuration;

    // Button state
    // timestamp of last button press
    uint256 public latestPress;

    constructor(HopperConfiguration memory config, address initialOwner) {
        require(config.cooldownSeconds != 0, "TokenHopper: zero cooldown not allowed");
        require(config.token != address(0), "TokenHopper: token cannot be zeroa ddress");
        if (config.doesExpire) {
            require(config.expirationTimestamp > config.startTime,
                "TokenHopper: cannot expire before starting");
        }
        _transferOwnership(initialOwner);
        // set the configuration and emit an event
        configuration = config;
        emit HopperLoaded(config);
    }

    /**
     * isExpired()
     *
     * Determines if the hopper has expired, making any remaining token balance
     * retriavable by the owner.
     *
     * @return true if and only if isLoaded() && (doesExpire && block.timestamp >= expirationTimestamp)
     */
    function isExpired() external view returns (bool) {
        return _isExpired();
    }

    /**
     * getHopperConfiguration()
     *
     * If the hopper has not yet been loaded, this call will revert.
     *
     * @return the hopper configuration initially supplied by the owner.
     */
    function getHopperConfiguration() external view returns (HopperConfiguration memory) {
        return configuration;
    }

    /**
     * canPress()
     *
     * Determines if the hopper is in a state ready for action. Great way
     * within other contracts to make sure your transaction doesn't blow up.
     *
     * @return true if the hopper is loaded and not in cooldown, false otherwise.
     */
    function canPress() external view returns (bool) {
       return _canPress(); 
    }

    /**
     * pressButton()
     *
     * Any actor can call this function to initiate the set of actions in the hopper.
     *
     * This call will revert if any of the actions revert, if the hopper has
     * not yet been loaded, or if the hopper is in a cooldown period.
     */
    function pressButton() external {
        // make sure we can press the button
        require(_canPress(), "TokenHopper.pressButton: button currently unpressable.");

        /**
         * We immediately set the latestPress time so that actions
         * can't re-enter and press the button again. If a button isn't
         * pressed during a window, then one opportunity for a button press is "lost"
         * -- there is no "button press backlog".
         * 
         * It's the responsibility of the action generators to modulo their
         * action generation to the same granularity as the cooldown period.
         * its a design decision to make the action generator "stateless"
         * and not compensate for missed button presses.
         */

        latestPress = block.timestamp;

        // grab the actions
        IHopperActionGenerator.HopperAction[] memory actions = 
            IHopperActionGenerator(configuration.actionGenerator).generateHopperActions(
                address(this), configuration.token);

        // perform the actions, and make sure they were successful
        for(uint256 x = 0; x < actions.length; x++) {
            (bool success,) = (actions[x].target).call(actions[x].callData);
            require(success, "TokenHopper.pressButton: call reverted");
        }

        uint256 newCooldownHorizon =
            ((block.timestamp - configuration.startTime) / configuration.cooldownSeconds + 1) * configuration.cooldownSeconds
            + configuration.startTime;
        emit ButtonPressed(msg.sender, newCooldownHorizon);
    }

    /**
     * retrieveFunds()
     *
     * This method can only be called by the owner and will return all remaining
     * token balance to them if and only if the hopper is expired.
     *
     * This method will always revert if the hopper is not configured to expire.
     * It will also revert if the expiration date has not yet passed.
     */
     function retrieveFunds() onlyOwner external {
        require(_isExpired(), "TokenHopper.retrieveFunds: Hopper is not currently expired.");

        // move the existing balance of the token in this contract
        // back to the caller, who must be the owner
        uint256 tokenBalance = IERC20(configuration.token).balanceOf(address(this));
        IERC20(configuration.token).safeTransfer(owner(), tokenBalance);
        emit FundsRetrieved(tokenBalance);
     }

     /////////////////////////////////////////////////
     // Internal Methods
     /////////////////////////////////////////////////
    
     function _canPress() internal view returns (bool) {
        require(block.timestamp >= configuration.startTime, "TokenHopper._canPress: block.timestamp < startTime");
        // hopper must be unexpired and not yet pressed during the current period.
        uint256 currentPeriodStart =
            ((block.timestamp - configuration.startTime) / configuration.cooldownSeconds) * configuration.cooldownSeconds
            + configuration.startTime;
        bool isNotExpired = configuration.doesExpire ? block.timestamp < configuration.expirationTimestamp : true;
        bool isNotPressedInCurrentPeriod = latestPress < currentPeriodStart;
        return isNotExpired && isNotPressedInCurrentPeriod;
    }
    
    function _isExpired() internal view returns (bool) {
        return configuration.doesExpire &&                           // something that can't expire won't
               block.timestamp >= configuration.expirationTimestamp; // is this block past the expiration date?
    }
}