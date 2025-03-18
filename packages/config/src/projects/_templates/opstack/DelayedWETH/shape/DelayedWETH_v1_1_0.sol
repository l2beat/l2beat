// SPDX-License-Identifier: Unknown
pragma solidity 0.8.15;

interface ISemver {
    /// @notice Getter for the semantic version of the contract. This is not
    ///         meant to be used onchain but instead meant to be used by offchain
    ///         tooling.
    /// @return Semver contract version as a string.
    function version() external view returns (string memory);
}

interface IDelayedWETH is IWETH {
    /// @notice Represents a withdrawal request.
    struct WithdrawalRequest {
        uint256 amount;
        uint256 timestamp;
    }

    /// @notice Emitted when an unwrap is started.
    /// @param src The address that started the unwrap.
    /// @param wad The amount of WETH that was unwrapped.
    event Unwrap(address indexed src, uint256 wad);

    /// @notice Returns the withdrawal delay in seconds.
    /// @return The withdrawal delay in seconds.
    function delay() external view returns (uint256);

    /// @notice Returns a withdrawal request for the given address.
    /// @param _owner The address to query the withdrawal request of.
    /// @param _guy Sub-account to query the withdrawal request of.
    /// @return The withdrawal request for the given address-subaccount pair.
    function withdrawals(address _owner, address _guy) external view returns (uint256, uint256);

    /// @notice Unlocks withdrawals for the sender's account, after a time delay.
    /// @param _guy Sub-account to unlock.
    /// @param _wad The amount of WETH to unlock.
    function unlock(address _guy, uint256 _wad) external;

    /// @notice Extension to withdrawal, must provide a sub-account to withdraw from.
    /// @param _guy Sub-account to withdraw from.
    /// @param _wad The amount of WETH to withdraw.
    function withdraw(address _guy, uint256 _wad) external;

    /// @notice Allows the owner to recover from error cases by pulling ETH out of the contract.
    /// @param _wad The amount of WETH to recover.
    function recover(uint256 _wad) external;

    /// @notice Allows the owner to recover from error cases by pulling ETH from a specific owner.
    /// @param _guy The address to recover the WETH from.
    /// @param _wad The amount of WETH to recover.
    function hold(address _guy, uint256 _wad) external;
}

interface IWETH {
    /// @notice Emitted when an approval is made.
    /// @param src The address that approved the transfer.
    /// @param guy The address that was approved to transfer.
    /// @param wad The amount that was approved to transfer.
    event Approval(address indexed src, address indexed guy, uint256 wad);

    /// @notice Emitted when a transfer is made.
    /// @param src The address that transferred the WETH.
    /// @param dst The address that received the WETH.
    /// @param wad The amount of WETH that was transferred.
    event Transfer(address indexed src, address indexed dst, uint256 wad);

    /// @notice Emitted when a deposit is made.
    /// @param dst The address that deposited the WETH.
    /// @param wad The amount of WETH that was deposited.
    event Deposit(address indexed dst, uint256 wad);

    /// @notice Emitted when a withdrawal is made.
    /// @param src The address that withdrew the WETH.
    /// @param wad The amount of WETH that was withdrawn.
    event Withdrawal(address indexed src, uint256 wad);

    /// @notice Returns the name of the token.
    /// @return The name of the token.
    function name() external view returns (string memory);

    /// @notice Returns the symbol of the token.
    /// @return The symbol of the token.
    function symbol() external view returns (string memory);

    /// @notice Returns the number of decimals the token uses.
    /// @return The number of decimals the token uses.
    function decimals() external pure returns (uint8);

    /// @notice Returns the balance of the given address.
    /// @param owner The address to query the balance of.
    /// @return The balance of the given address.
    function balanceOf(address owner) external view returns (uint256);

    /// @notice Returns the amount of WETH that the spender can transfer on behalf of the owner.
    /// @param owner The address that owns the WETH.
    /// @param spender The address that is approved to transfer the WETH.
    /// @return The amount of WETH that the spender can transfer on behalf of the owner.
    function allowance(address owner, address spender) external view returns (uint256);

    /// @notice Allows WETH to be deposited by sending ether to the contract.
    function deposit() external payable;

    /// @notice Withdraws an amount of ETH.
    /// @param wad The amount of ETH to withdraw.
    function withdraw(uint256 wad) external;

    /// @notice Returns the total supply of WETH.
    /// @return The total supply of WETH.
    function totalSupply() external view returns (uint256);

    /// @notice Approves the given address to transfer the WETH on behalf of the caller.
    /// @param guy The address that is approved to transfer the WETH.
    /// @param wad The amount that is approved to transfer.
    /// @return True if the approval was successful.
    function approve(address guy, uint256 wad) external returns (bool);

    /// @notice Transfers the given amount of WETH to the given address.
    /// @param dst The address to transfer the WETH to.
    /// @param wad The amount of WETH to transfer.
    /// @return True if the transfer was successful.
    function transfer(address dst, uint256 wad) external returns (bool);

    /// @notice Transfers the given amount of WETH from the given address to the given address.
    /// @param src The address to transfer the WETH from.
    /// @param dst The address to transfer the WETH to.
    /// @param wad The amount of WETH to transfer.
    /// @return True if the transfer was successful.
    function transferFrom(address src, address dst, uint256 wad) external returns (bool);
}

contract WETH98 is IWETH {
    uint8 public constant decimals = 18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    /// @notice Pipes to deposit.
    receive() external payable {
        deposit();
    }

    /// @notice Pipes to deposit.
    fallback() external payable {
        deposit();
    }

    /// @inheritdoc IWETH
    function name() external view virtual override returns (string memory) {
        return "Wrapped Ether";
    }

    /// @inheritdoc IWETH
    function symbol() external view virtual override returns (string memory) {
        return "WETH";
    }

    /// @inheritdoc IWETH
    function deposit() public payable virtual {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @inheritdoc IWETH
    function withdraw(uint256 wad) public virtual {
        require(balanceOf[msg.sender] >= wad);
        balanceOf[msg.sender] -= wad;
        payable(msg.sender).transfer(wad);
        emit Withdrawal(msg.sender, wad);
    }

    /// @inheritdoc IWETH
    function totalSupply() external view returns (uint256) {
        return address(this).balance;
    }

    /// @inheritdoc IWETH
    function approve(address guy, uint256 wad) external returns (bool) {
        allowance[msg.sender][guy] = wad;
        emit Approval(msg.sender, guy, wad);
        return true;
    }

    /// @inheritdoc IWETH
    function transfer(address dst, uint256 wad) external returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    /// @inheritdoc IWETH
    function transferFrom(address src, address dst, uint256 wad) public returns (bool) {
        require(balanceOf[src] >= wad);

        if (src != msg.sender && allowance[src][msg.sender] != type(uint256).max) {
            require(allowance[src][msg.sender] >= wad);
            allowance[src][msg.sender] -= wad;
        }

        balanceOf[src] -= wad;
        balanceOf[dst] += wad;

        emit Transfer(src, dst, wad);

        return true;
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
     * `onlyInitializing` functions can be used to initialize parent contracts. Equivalent to `reinitializer(1)`.
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
     * `initializer` is equivalent to `reinitializer(1)`, so a reinitializer may be used after the original
     * initialization step. This is essential to configure modules that are added through upgrades and that require
     * initialization.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
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
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized < type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
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

abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    function __Ownable_init() internal onlyInitializing {
        __Ownable_init_unchained();
    }

    function __Ownable_init_unchained() internal onlyInitializing {
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

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

contract DelayedWETH is OwnableUpgradeable, WETH98, IDelayedWETH, ISemver {
    /// @notice Semantic version.
    /// @custom:semver 1.1.0
    string public constant version = "1.1.0";

    /// @inheritdoc IDelayedWETH
    mapping(address => mapping(address => WithdrawalRequest)) public withdrawals;

    /// @notice Withdrawal delay in seconds.
    uint256 internal immutable DELAY_SECONDS;

    /// @notice Address of the SuperchainConfig contract.
    SuperchainConfig public config;

    /// @param _delay The delay for withdrawals in seconds.
    constructor(uint256 _delay) {
        DELAY_SECONDS = _delay;
        initialize({ _owner: address(0), _config: SuperchainConfig(address(0)) });
    }

    /// @notice Initializes the contract.
    /// @param _owner The address of the owner.
    /// @param _config Address of the SuperchainConfig contract.
    function initialize(address _owner, SuperchainConfig _config) public initializer {
        __Ownable_init();
        _transferOwnership(_owner);
        config = _config;
    }

    /// @inheritdoc IDelayedWETH
    function delay() external view returns (uint256) {
        return DELAY_SECONDS;
    }

    /// @inheritdoc IDelayedWETH
    function unlock(address _guy, uint256 _wad) external {
        // Note that the unlock function can be called by any address, but the actual unlocking capability still only
        // gives the msg.sender the ability to withdraw from the account. As long as the unlock and withdraw functions
        // are called with the proper recipient addresses, this will be safe. Could be made safer by having external
        // accounts execute withdrawals themselves but that would have added extra complexity and made DelayedWETH a
        // leaky abstraction, so we chose this instead.
        WithdrawalRequest storage wd = withdrawals[msg.sender][_guy];
        wd.timestamp = block.timestamp;
        wd.amount += _wad;
    }

    /// @inheritdoc IWETH
    function withdraw(uint256 _wad) public override(WETH98, IWETH) {
        withdraw(msg.sender, _wad);
    }

    /// @inheritdoc IDelayedWETH
    function withdraw(address _guy, uint256 _wad) public {
        require(!config.paused(), "DelayedWETH: contract is paused");
        WithdrawalRequest storage wd = withdrawals[msg.sender][_guy];
        require(wd.amount >= _wad, "DelayedWETH: insufficient unlocked withdrawal");
        require(wd.timestamp > 0, "DelayedWETH: withdrawal not unlocked");
        require(wd.timestamp + DELAY_SECONDS <= block.timestamp, "DelayedWETH: withdrawal delay not met");
        wd.amount -= _wad;
        super.withdraw(_wad);
    }

    /// @inheritdoc IDelayedWETH
    function recover(uint256 _wad) external {
        require(msg.sender == owner(), "DelayedWETH: not owner");
        uint256 amount = _wad < address(this).balance ? _wad : address(this).balance;
        (bool success,) = payable(msg.sender).call{ value: amount }(hex"");
        require(success, "DelayedWETH: recover failed");
    }

    /// @inheritdoc IDelayedWETH
    function hold(address _guy, uint256 _wad) external {
        require(msg.sender == owner(), "DelayedWETH: not owner");
        allowance[_guy][msg.sender] = _wad;
        emit Approval(_guy, msg.sender, _wad);
    }
}