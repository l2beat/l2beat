// SPDX-License-Identifier: Unknown
pragma solidity 0.8.15;

function computeCommitmentKeccak256(bytes memory data) pure returns (bytes memory) {
    return bytes.concat(bytes1(uint8(CommitmentType.Keccak256)), keccak256(data));
}

enum CommitmentType {
    Keccak256
}

library SafeCall {
    /// @notice Performs a low level call without copying any returndata.
    /// @dev Passes no calldata to the call context.
    /// @param _target   Address to call
    /// @param _gas      Amount of gas to pass to the call
    /// @param _value    Amount of value to pass to the call
    function send(address _target, uint256 _gas, uint256 _value) internal returns (bool success_) {
        assembly {
            success_ :=
                call(
                    _gas, // gas
                    _target, // recipient
                    _value, // ether value
                    0, // inloc
                    0, // inlen
                    0, // outloc
                    0 // outlen
                )
        }
    }

    /// @notice Perform a low level call with all gas without copying any returndata
    /// @param _target   Address to call
    /// @param _value    Amount of value to pass to the call
    function send(address _target, uint256 _value) internal returns (bool success_) {
        success_ = send(_target, gasleft(), _value);
    }

    /// @notice Perform a low level call without copying any returndata
    /// @param _target   Address to call
    /// @param _gas      Amount of gas to pass to the call
    /// @param _value    Amount of value to pass to the call
    /// @param _calldata Calldata to pass to the call
    function call(
        address _target,
        uint256 _gas,
        uint256 _value,
        bytes memory _calldata
    )
        internal
        returns (bool success_)
    {
        assembly {
            success_ :=
                call(
                    _gas, // gas
                    _target, // recipient
                    _value, // ether value
                    add(_calldata, 32), // inloc
                    mload(_calldata), // inlen
                    0, // outloc
                    0 // outlen
                )
        }
    }

    /// @notice Helper function to determine if there is sufficient gas remaining within the context
    ///         to guarantee that the minimum gas requirement for a call will be met as well as
    ///         optionally reserving a specified amount of gas for after the call has concluded.
    /// @param _minGas      The minimum amount of gas that may be passed to the target context.
    /// @param _reservedGas Optional amount of gas to reserve for the caller after the execution
    ///                     of the target context.
    /// @return `true` if there is enough gas remaining to safely supply `_minGas` to the target
    ///         context as well as reserve `_reservedGas` for the caller after the execution of
    ///         the target context.
    /// @dev !!!!! FOOTGUN ALERT !!!!!
    ///      1.) The 40_000 base buffer is to account for the worst case of the dynamic cost of the
    ///          `CALL` opcode's `address_access_cost`, `positive_value_cost`, and
    ///          `value_to_empty_account_cost` factors with an added buffer of 5,700 gas. It is
    ///          still possible to self-rekt by initiating a withdrawal with a minimum gas limit
    ///          that does not account for the `memory_expansion_cost` & `code_execution_cost`
    ///          factors of the dynamic cost of the `CALL` opcode.
    ///      2.) This function should *directly* precede the external call if possible. There is an
    ///          added buffer to account for gas consumed between this check and the call, but it
    ///          is only 5,700 gas.
    ///      3.) Because EIP-150 ensures that a maximum of 63/64ths of the remaining gas in the call
    ///          frame may be passed to a subcontext, we need to ensure that the gas will not be
    ///          truncated.
    ///      4.) Use wisely. This function is not a silver bullet.
    function hasMinGas(uint256 _minGas, uint256 _reservedGas) internal view returns (bool) {
        bool _hasMinGas;
        assembly {
            // Equation: gas × 63 ≥ minGas × 64 + 63(40_000 + reservedGas)
            _hasMinGas := iszero(lt(mul(gas(), 63), add(mul(_minGas, 64), mul(add(40000, _reservedGas), 63))))
        }
        return _hasMinGas;
    }

    /// @notice Perform a low level call without copying any returndata. This function
    ///         will revert if the call cannot be performed with the specified minimum
    ///         gas.
    /// @param _target   Address to call
    /// @param _minGas   The minimum amount of gas that may be passed to the call
    /// @param _value    Amount of value to pass to the call
    /// @param _calldata Calldata to pass to the call
    function callWithMinGas(
        address _target,
        uint256 _minGas,
        uint256 _value,
        bytes memory _calldata
    )
        internal
        returns (bool)
    {
        bool _success;
        bool _hasMinGas = hasMinGas(_minGas, 0);
        assembly {
            // Assertion: gasleft() >= (_minGas * 64) / 63 + 40_000
            if iszero(_hasMinGas) {
                // Store the "Error(string)" selector in scratch space.
                mstore(0, 0x08c379a0)
                // Store the pointer to the string length in scratch space.
                mstore(32, 32)
                // Store the string.
                //
                // SAFETY:
                // - We pad the beginning of the string with two zero bytes as well as the
                // length (24) to ensure that we override the free memory pointer at offset
                // 0x40. This is necessary because the free memory pointer is likely to
                // be greater than 1 byte when this function is called, but it is incredibly
                // unlikely that it will be greater than 3 bytes. As for the data within
                // 0x60, it is ensured that it is 0 due to 0x60 being the zero offset.
                // - It's fine to clobber the free memory pointer, we're reverting.
                mstore(88, 0x0000185361666543616c6c3a204e6f7420656e6f75676820676173)

                // Revert with 'Error("SafeCall: Not enough gas")'
                revert(28, 100)
            }

            // The call will be supplied at least ((_minGas * 64) / 63) gas due to the
            // above assertion. This ensures that, in all circumstances (except for when the
            // `_minGas` does not account for the `memory_expansion_cost` and `code_execution_cost`
            // factors of the dynamic cost of the `CALL` opcode), the call will receive at least
            // the minimum amount of gas specified.
            _success :=
                call(
                    gas(), // gas
                    _target, // recipient
                    _value, // ether value
                    add(_calldata, 32), // inloc
                    mload(_calldata), // inlen
                    0x00, // outloc
                    0x00 // outlen
                )
        }
        return _success;
    }
}

struct Challenge {
    address challenger;
    uint256 lockedBond;
    uint256 startBlock;
    uint256 resolvedBlock;
}

enum ChallengeStatus {
    Uninitialized,
    Active,
    Resolved,
    Expired
}

interface ISemver {
    /// @notice Getter for the semantic version of the contract. This is not
    ///         meant to be used onchain but instead meant to be used by offchain
    ///         tooling.
    /// @return Semver contract version as a string.
    function version() external view returns (string memory);
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

contract DataAvailabilityChallenge is OwnableUpgradeable, ISemver {
    /// @notice Error for when the provided resolver refund percentage exceeds 100%.
    error InvalidResolverRefundPercentage(uint256 invalidResolverRefundPercentage);

    /// @notice Error for when the challenger's bond is too low.
    error BondTooLow(uint256 balance, uint256 required);

    /// @notice Error for when attempting to challenge a commitment that already has a challenge.
    error ChallengeExists();

    /// @notice Error for when attempting to resolve a challenge that is not active.
    error ChallengeNotActive();

    /// @notice Error for when attempting to unlock a bond from a challenge that is not expired.
    error ChallengeNotExpired();

    /// @notice Error for when attempting to challenge a commitment that is not in the challenge window.
    error ChallengeWindowNotOpen();

    /// @notice Error for when the provided input data doesn't match the commitment.
    error InvalidInputData(bytes providedDataCommitment, bytes expectedCommitment);

    /// @notice Error for when the call to withdraw a bond failed.
    error WithdrawalFailed();

    /// @notice Error for when a the type of a given commitment is unknown
    error UnknownCommitmentType(uint8 commitmentType);

    /// @notice Error for when the commitment length does not match the commitment type
    error InvalidCommitmentLength(uint8 commitmentType, uint256 expectedLength, uint256 actualLength);

    /// @notice An event that is emitted when the status of a challenge changes.
    /// @param challengedCommitment The commitment that is being challenged.
    /// @param challengedBlockNumber The block number at which the commitment was made.
    /// @param status The new status of the challenge.
    event ChallengeStatusChanged(
        uint256 indexed challengedBlockNumber, bytes challengedCommitment, ChallengeStatus status
    );

    /// @notice An event that is emitted when the bond size required to initiate a challenge changes.
    event RequiredBondSizeChanged(uint256 challengeWindow);

    /// @notice An event that is emitted when the percentage of the resolving cost to be refunded to the resolver
    /// changes.
    event ResolverRefundPercentageChanged(uint256 resolverRefundPercentage);

    /// @notice An event that is emitted when a user's bond balance changes.
    event BalanceChanged(address account, uint256 balance);

    /// @notice Semantic version.
    /// @custom:semver 1.0.0
    string public constant version = "1.0.0";

    /// @notice The fixed cost of resolving a challenge.
    /// @dev The value is estimated by measuring the cost of resolving with `bytes(0)`
    uint256 public constant fixedResolutionCost = 72925;

    /// @notice The variable cost of resolving a callenge per byte scaled by the variableResolutionCostPrecision.
    /// @dev upper limit; The value is estimated by measuring the cost of resolving with variable size data where each
    /// byte is non-zero.
    uint256 public constant variableResolutionCost = 16640;

    /// @dev The precision of the variable resolution cost.
    uint256 public constant variableResolutionCostPrecision = 1000;

    /// @notice The block interval during which a commitment can be challenged.
    uint256 public challengeWindow;

    /// @notice The block interval during which a challenge can be resolved.
    uint256 public resolveWindow;

    /// @notice The amount required to post a challenge.
    uint256 public bondSize;

    /// @notice The percentage of the resolving cost to be refunded to the resolver.
    /// @dev There are no decimals, ie a value of 50 corresponds to 50%.
    uint256 public resolverRefundPercentage;

    /// @notice A mapping from addresses to their bond balance in the contract.
    mapping(address => uint256) public balances;

    /// @notice A mapping from challenged block numbers to challenged commitments to challenges.
    mapping(uint256 => mapping(bytes => Challenge)) internal challenges;

    /// @notice Constructs the DataAvailabilityChallenge contract. Cannot set
    ///         the owner to `address(0)` due to the Ownable contract's
    ///         implementation, so set it to `address(0xdEaD)`.
    constructor() OwnableUpgradeable() {
        initialize({
            _owner: address(0xdEaD),
            _challengeWindow: 0,
            _resolveWindow: 0,
            _bondSize: 0,
            _resolverRefundPercentage: 0
        });
    }

    /// @notice Initializes the contract.
    /// @param _owner The owner of the contract.
    /// @param _challengeWindow The block interval during which a commitment can be challenged.
    /// @param _resolveWindow The block interval during which a challenge can be resolved.
    /// @param _bondSize The amount required to post a challenge.
    function initialize(
        address _owner,
        uint256 _challengeWindow,
        uint256 _resolveWindow,
        uint256 _bondSize,
        uint256 _resolverRefundPercentage
    )
        public
        initializer
    {
        __Ownable_init();
        challengeWindow = _challengeWindow;
        resolveWindow = _resolveWindow;
        setBondSize(_bondSize);
        setResolverRefundPercentage(_resolverRefundPercentage);
        _transferOwnership(_owner);
    }

    /// @notice Sets the bond size.
    /// @param _bondSize The amount required to post a challenge.
    function setBondSize(uint256 _bondSize) public onlyOwner {
        bondSize = _bondSize;
        emit RequiredBondSizeChanged(_bondSize);
    }

    /// @notice Sets the percentage of the resolving cost to be refunded to the resolver.
    /// @dev The function reverts if the provided percentage is above 100, since the refund logic
    /// assumes a value smaller or equal to 100%.
    /// @param _resolverRefundPercentage The percentage of the resolving cost to be refunded to the resolver.
    function setResolverRefundPercentage(uint256 _resolverRefundPercentage) public onlyOwner {
        if (_resolverRefundPercentage > 100) {
            revert InvalidResolverRefundPercentage(_resolverRefundPercentage);
        }
        resolverRefundPercentage = _resolverRefundPercentage;
    }

    /// @notice Post a bond as prerequisite for challenging a commitment.
    receive() external payable {
        deposit();
    }

    /// @notice Post a bond as prerequisite for challenging a commitment.
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit BalanceChanged(msg.sender, balances[msg.sender]);
    }

    /// @notice Withdraw a user's unlocked bond.
    function withdraw() external {
        // get caller's balance
        uint256 balance = balances[msg.sender];

        // set caller's balance to 0
        balances[msg.sender] = 0;
        emit BalanceChanged(msg.sender, 0);

        // send caller's balance to caller
        bool success = SafeCall.send(msg.sender, gasleft(), balance);
        if (!success) {
            revert WithdrawalFailed();
        }
    }

    /// @notice Checks if the current block is within the challenge window for a given challenged block number.
    /// @param challengedBlockNumber The block number at which the commitment was made.
    /// @return True if the current block is within the challenge window, false otherwise.
    function _isInChallengeWindow(uint256 challengedBlockNumber) internal view returns (bool) {
        return (block.number >= challengedBlockNumber && block.number <= challengedBlockNumber + challengeWindow);
    }

    /// @notice Checks if the current block is within the resolve window for a given challenge start block number.
    /// @param challengeStartBlockNumber The block number at which the challenge was initiated.
    /// @return True if the current block is within the resolve window, false otherwise.
    function _isInResolveWindow(uint256 challengeStartBlockNumber) internal view returns (bool) {
        return block.number <= challengeStartBlockNumber + resolveWindow;
    }

    /// @notice Returns a challenge for the given block number and commitment.
    /// @dev Unlike with a public `challenges` mapping, we can return a Challenge struct instead of tuple.
    /// @param challengedBlockNumber The block number at which the commitment was made.
    /// @param challengedCommitment The commitment that is being challenged.
    /// @return The challenge struct.
    function getChallenge(
        uint256 challengedBlockNumber,
        bytes calldata challengedCommitment
    )
        public
        view
        returns (Challenge memory)
    {
        return challenges[challengedBlockNumber][challengedCommitment];
    }

    /// @notice Returns the status of a challenge for a given challenged block number and challenged commitment.
    /// @param challengedBlockNumber The block number at which the commitment was made.
    /// @param challengedCommitment The commitment that is being challenged.
    /// @return The status of the challenge.
    function getChallengeStatus(
        uint256 challengedBlockNumber,
        bytes calldata challengedCommitment
    )
        public
        view
        returns (ChallengeStatus)
    {
        Challenge memory _challenge = challenges[challengedBlockNumber][challengedCommitment];
        // if the address is 0, the challenge is uninitialized
        if (_challenge.challenger == address(0)) return ChallengeStatus.Uninitialized;

        // if the challenge has a resolved block, it is resolved
        if (_challenge.resolvedBlock != 0) return ChallengeStatus.Resolved;

        // if the challenge's start block is in the resolve window, it is active
        if (_isInResolveWindow(_challenge.startBlock)) return ChallengeStatus.Active;

        // if the challenge's start block is not in the resolve window, it is expired
        return ChallengeStatus.Expired;
    }

    /// @notice Extract the commitment type from a given commitment.
    /// @dev The commitment type is located in the first byte of the commitment.
    /// @param commitment The commitment from which to extract the commitment type.
    /// @return The commitment type of the given commitment.
    function _getCommitmentType(bytes calldata commitment) internal pure returns (uint8) {
        return uint8(bytes1(commitment));
    }

    /// @notice Validate that a given commitment has a known type and the expected length for this type.
    /// @dev The type of a commitment is stored in its first byte.
    ///      The function reverts with `UnknownCommitmentType` if the type is not known and
    ///      with `InvalidCommitmentLength` if the commitment has an unexpected length.
    /// @param commitment The commitment for which to check the type.
    function validateCommitment(bytes calldata commitment) public pure {
        uint8 commitmentType = _getCommitmentType(commitment);
        if (commitmentType == uint8(CommitmentType.Keccak256)) {
            if (commitment.length != 33) {
                revert InvalidCommitmentLength(uint8(CommitmentType.Keccak256), 33, commitment.length);
            }
            return;
        }

        revert UnknownCommitmentType(commitmentType);
    }

    /// @notice Challenge a commitment at a given block number.
    /// @dev The block number parameter is necessary for the contract to verify the challenge window,
    ///      since the contract cannot access the block number of the commitment.
    ///      The function reverts if the commitment type (first byte) is unknown,
    ///      if the caller does not have a bond or if the challenge already exists.
    /// @param challengedBlockNumber The block number at which the commitment was made.
    /// @param challengedCommitment The commitment that is being challenged.
    function challenge(uint256 challengedBlockNumber, bytes calldata challengedCommitment) external payable {
        // require the commitment type to be known
        validateCommitment(challengedCommitment);

        // deposit value sent with the transaction as bond
        deposit();

        // require the caller to have a bond
        if (balances[msg.sender] < bondSize) {
            revert BondTooLow(balances[msg.sender], bondSize);
        }

        // require the challenge status to be uninitialized
        if (getChallengeStatus(challengedBlockNumber, challengedCommitment) != ChallengeStatus.Uninitialized) {
            revert ChallengeExists();
        }

        // require the current block to be in the challenge window
        if (!_isInChallengeWindow(challengedBlockNumber)) {
            revert ChallengeWindowNotOpen();
        }

        // reduce the caller's balance
        balances[msg.sender] -= bondSize;

        // store the challenger's address, bond size, and start block of the challenge
        challenges[challengedBlockNumber][challengedCommitment] =
            Challenge({ challenger: msg.sender, lockedBond: bondSize, startBlock: block.number, resolvedBlock: 0 });

        // emit an event to notify that the challenge status is now active
        emit ChallengeStatusChanged(challengedBlockNumber, challengedCommitment, ChallengeStatus.Active);
    }

    /// @notice Resolve a challenge by providing the data corresponding to the challenged commitment.
    /// @dev The function computes a commitment from the provided resolveData and verifies that it matches the
    /// challenged commitment.
    ///      It reverts if the commitment type is unknown, if the data doesn't match the commitment,
    ///      if the challenge is not active or if the resolve window is not open.
    /// @param challengedBlockNumber The block number at which the commitment was made.
    /// @param challengedCommitment The challenged commitment that is being resolved.
    /// @param resolveData The pre-image data corresponding to the challenged commitment.
    function resolve(
        uint256 challengedBlockNumber,
        bytes calldata challengedCommitment,
        bytes calldata resolveData
    )
        external
    {
        // require the commitment type to be known
        validateCommitment(challengedCommitment);

        // require the challenge to be active (started, not resolved, and resolve window still open)
        if (getChallengeStatus(challengedBlockNumber, challengedCommitment) != ChallengeStatus.Active) {
            revert ChallengeNotActive();
        }

        // compute the commitment corresponding to the given resolveData
        uint8 commitmentType = _getCommitmentType(challengedCommitment);
        bytes memory computedCommitment;
        if (commitmentType == uint8(CommitmentType.Keccak256)) {
            computedCommitment = computeCommitmentKeccak256(resolveData);
        }

        // require the provided input data to correspond to the challenged commitment
        if (keccak256(computedCommitment) != keccak256(challengedCommitment)) {
            revert InvalidInputData(computedCommitment, challengedCommitment);
        }

        // store the block number at which the challenge was resolved
        Challenge storage activeChallenge = challenges[challengedBlockNumber][challengedCommitment];
        activeChallenge.resolvedBlock = block.number;

        // emit an event to notify that the challenge status is now resolved
        emit ChallengeStatusChanged(challengedBlockNumber, challengedCommitment, ChallengeStatus.Resolved);

        // distribute the bond among challenger, resolver and address(0)
        _distributeBond(activeChallenge, resolveData.length, msg.sender);
    }

    /// @notice Distribute the bond of a resolved challenge among the resolver, challenger and address(0).
    ///         The challenger is refunded the bond amount exceeding the resolution cost.
    ///         The resolver is refunded a percentage of the resolution cost based on the `resolverRefundPercentage`
    ///         state variable.
    ///         The remaining bond is burned by sending it to address(0).
    /// @dev The resolution cost is approximated based on a fixed cost and variable cost depending on the size of the
    ///      pre-image.
    ///      The real resolution cost might vary, because calldata is priced differently for zero and non-zero bytes.
    ///      Computing the exact cost adds too much gas overhead to be worth the tradeoff.
    /// @param resolvedChallenge The resolved challenge in storage.
    /// @param preImageLength The size of the pre-image used to resolve the challenge.
    /// @param resolver The address of the resolver.
    function _distributeBond(Challenge storage resolvedChallenge, uint256 preImageLength, address resolver) internal {
        uint256 lockedBond = resolvedChallenge.lockedBond;
        address challenger = resolvedChallenge.challenger;

        // approximate the cost of resolving a challenge with the provided pre-image size
        uint256 resolutionCost = (
            fixedResolutionCost + preImageLength * variableResolutionCost / variableResolutionCostPrecision
        ) * block.basefee;

        // refund bond exceeding the resolution cost to the challenger
        if (lockedBond > resolutionCost) {
            balances[challenger] += lockedBond - resolutionCost;
            lockedBond = resolutionCost;
            emit BalanceChanged(challenger, balances[challenger]);
        }

        // refund a percentage of the resolution cost to the resolver (but not more than the locked bond)
        uint256 resolverRefund = resolutionCost * resolverRefundPercentage / 100;
        if (resolverRefund > lockedBond) {
            resolverRefund = lockedBond;
        }
        if (resolverRefund > 0) {
            balances[resolver] += resolverRefund;
            lockedBond -= resolverRefund;
            emit BalanceChanged(resolver, balances[resolver]);
        }

        // burn the remaining bond
        if (lockedBond > 0) {
            payable(address(0)).transfer(lockedBond);
        }
        resolvedChallenge.lockedBond = 0;
    }

    /// @notice Unlock the bond associated wth an expired challenge.
    /// @dev The function reverts if the challenge is not expired.
    ///      If the expiration is successful, the challenger's bond is unlocked.
    /// @param challengedBlockNumber The block number at which the commitment was made.
    /// @param challengedCommitment The commitment that is being challenged.
    function unlockBond(uint256 challengedBlockNumber, bytes calldata challengedCommitment) external {
        // require the challenge to be active (started, not resolved, and in the resolve window)
        if (getChallengeStatus(challengedBlockNumber, challengedCommitment) != ChallengeStatus.Expired) {
            revert ChallengeNotExpired();
        }

        // Unlock the bond associated with the challenge
        Challenge storage expiredChallenge = challenges[challengedBlockNumber][challengedCommitment];
        balances[expiredChallenge.challenger] += expiredChallenge.lockedBond;
        expiredChallenge.lockedBond = 0;

        // Emit balance update event
        emit BalanceChanged(expiredChallenge.challenger, balances[expiredChallenge.challenger]);
    }
}