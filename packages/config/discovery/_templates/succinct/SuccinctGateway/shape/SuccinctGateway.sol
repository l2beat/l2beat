// SPDX-License-Identifier: Unknown
pragma solidity 0.8.16;

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
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
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
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
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
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
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
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
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
        (bool success, bytes memory returndata) = target.delegatecall(data);
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
        if (_initialized != type(uint8).max) {
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

interface IFunctionRegistryEvents {
    event FunctionRegistered(
        bytes32 indexed functionId, address verifier, bytes32 salt, address owner
    );
    event FunctionVerifierUpdated(bytes32 indexed functionId, address verifier);
    event Deployed(
        bytes32 indexed bytecodeHash, bytes32 indexed salt, address indexed deployedAddress
    );
}

interface IFunctionRegistryErrors {
    error EmptyBytecode();
    error FailedDeploy();
    error VerifierCannotBeZero();
    error VerifierAlreadyUpdated(bytes32 functionId);
    error FunctionAlreadyRegistered(bytes32 functionId);
    error NotFunctionOwner(address owner, address actualOwner);
}

interface IFunctionRegistry is IFunctionRegistryEvents, IFunctionRegistryErrors {
    function verifiers(bytes32 functionId) external view returns (address verifier);
    function verifierOwners(bytes32 functionId) external view returns (address owner);
    function registerFunction(address owner, address verifier, bytes32 salt)
        external
        returns (bytes32 functionId);
    function deployAndRegisterFunction(address owner, bytes memory bytecode, bytes32 salt)
        external
        returns (bytes32 functionId, address verifier);
    function updateFunction(address verifier, bytes32 salt) external returns (bytes32 functionId);
    function deployAndUpdateFunction(bytes memory bytecode, bytes32 salt)
        external
        returns (bytes32 functionId, address verifier);
    function getFunctionId(address owner, bytes32 salt)
        external
        pure
        returns (bytes32 functionId);
}

abstract contract FunctionRegistry is IFunctionRegistry {
    /// @notice Maps function IDs to their corresponding verifiers.
    mapping(bytes32 => address) public override verifiers;

    /// @notice Maps function IDs to their corresponding owners.
    mapping(bytes32 => address) public override verifierOwners;

    /// @notice Registers a function, using a pre-deployed verifier.
    /// @dev The _owner can be set to address 0 to remove any update capabilities.
    /// @param _owner The owner of the function.
    /// @param _verifier The address of the verifier.
    /// @param _salt The salt to use for calculating the function ID.
    function registerFunction(address _owner, address _verifier, bytes32 _salt)
        external
        override
        returns (bytes32 functionId)
    {
        functionId = getFunctionId(_owner, _salt);
        _register(functionId, _owner, _verifier);
        emit FunctionRegistered(functionId, _verifier, _salt, _owner);
    }

    /// @notice Registers a function, using CREATE2 to deploy the verifier.
    /// @dev The _owner can be set to address 0 to remove any update capabilities.
    /// @param _owner The owner of the function.
    /// @param _bytecode The bytecode of the verifier.
    /// @param _salt The salt to use for calculating the function ID.
    function deployAndRegisterFunction(address _owner, bytes memory _bytecode, bytes32 _salt)
        external
        override
        returns (bytes32 functionId, address verifier)
    {
        functionId = getFunctionId(_owner, _salt);
        verifier = _deploy(_bytecode, functionId);
        _register(functionId, _owner, verifier);
        emit FunctionRegistered(functionId, verifier, _salt, _owner);
    }

    /// @notice Updates the function, using a pre-deployed verifier.
    /// @dev Only the owner of the function can update it.
    /// @param _verifier The address of the verifier.
    /// @param _salt The salt that was used when registering this function ID.
    function updateFunction(address _verifier, bytes32 _salt)
        external
        override
        returns (bytes32 functionId)
    {
        functionId = getFunctionId(msg.sender, _salt);
        _update(functionId, _verifier);
        emit FunctionVerifierUpdated(functionId, _verifier);
    }

    /// @notice Updates the function, using CREATE2 to deploy the new verifier.
    /// @dev Only the owner of the function can update it.
    /// @param _bytecode The bytecode of the verifier.
    /// @param _salt The salt that was used when registering this function ID.
    function deployAndUpdateFunction(bytes memory _bytecode, bytes32 _salt)
        external
        override
        returns (bytes32 functionId, address verifier)
    {
        functionId = getFunctionId(msg.sender, _salt);
        verifier = _deploy(_bytecode, functionId);
        _update(functionId, verifier);
        emit FunctionVerifierUpdated(functionId, verifier);
    }

    /// @notice Returns the function ID for a given owner and salt.
    /// @param _owner The owner of the function.
    /// @param _salt The salt to use.
    function getFunctionId(address _owner, bytes32 _salt)
        public
        pure
        override
        returns (bytes32 functionId)
    {
        functionId = keccak256(abi.encode(_owner, _salt));
    }

    function _deploy(bytes memory _bytecode, bytes32 _salt)
        internal
        returns (address deployedAddr)
    {
        if (_bytecode.length == 0) revert EmptyBytecode();

        assembly {
            deployedAddr := create2(0, add(_bytecode, 32), mload(_bytecode), _salt)
        }
        if (deployedAddr == address(0)) revert FailedDeploy();

        emit Deployed(keccak256(_bytecode), _salt, deployedAddr);
    }

    function _register(bytes32 functionId, address _owner, address _verifier) internal {
        if (_verifier == address(0)) {
            revert VerifierCannotBeZero();
        }
        if (address(verifiers[functionId]) != address(0)) {
            revert FunctionAlreadyRegistered(functionId); // should call update instead
        }
        verifierOwners[functionId] = _owner;
        verifiers[functionId] = _verifier;
    }

    function _update(bytes32 functionId, address _verifier) internal {
        if (_verifier == address(0)) {
            revert VerifierCannotBeZero();
        }
        if (msg.sender != verifierOwners[functionId]) {
            revert NotFunctionOwner(msg.sender, verifierOwners[functionId]);
        }
        if (_verifier == verifiers[functionId]) {
            revert VerifierAlreadyUpdated(functionId);
        }
        verifiers[functionId] = _verifier;
    }
}

enum WhitelistStatus {
    Default,
    Custom,
    Disabled
}

interface ISuccinctGatewayEvents {
    event RequestCallback(
        uint32 indexed nonce,
        bytes32 indexed functionId,
        bytes input,
        bytes context,
        address callbackAddress,
        bytes4 callbackSelector,
        uint32 callbackGasLimit,
        uint256 feeAmount
    );
    event RequestCall(
        bytes32 indexed functionId,
        bytes input,
        address entryAddress,
        bytes entryCalldata,
        uint32 entryGasLimit,
        address sender,
        uint256 feeAmount
    );
    event RequestFulfilled(
        uint32 indexed nonce, bytes32 indexed functionId, bytes32 inputHash, bytes32 outputHash
    );
    event Call(bytes32 indexed functionId, bytes32 inputHash, bytes32 outputHash);
    event SetFeeVault(address indexed oldFeeVault, address indexed newFeeVault);
    event ProverUpdated(bytes32 indexed functionId, address indexed prover, bool added);
    event WhitelistStatusUpdated(bytes32 indexed functionId, WhitelistStatus status);
}

interface ISuccinctGatewayErrors {
    error InvalidRequest(uint32 nonce, bytes32 expectedRequestHash, bytes32 requestHash);
    error CallbackFailed(bytes4 callbackSelector, bytes output, bytes context);
    error InvalidCall(bytes32 functionId, bytes input);
    error CallFailed(address callbackAddress, bytes callbackData);
    error InvalidProof(address verifier, bytes32 inputHash, bytes32 outputHash, bytes proof);
    error ReentrantFulfill();
    error OnlyProver(bytes32 functionId, address sender);
    error RecoverFailed();
}

interface ISuccinctGateway is ISuccinctGatewayEvents, ISuccinctGatewayErrors {
    function requestCallback(
        bytes32 functionId,
        bytes memory input,
        bytes memory context,
        bytes4 callbackSelector,
        uint32 callbackGasLimit
    ) external payable returns (bytes32);

    function requestCall(
        bytes32 functionId,
        bytes memory input,
        address entryAddress,
        bytes memory entryData,
        uint32 entryGasLimit
    ) external payable;

    function verifiedCall(bytes32 functionId, bytes memory input)
        external
        view
        returns (bytes memory);

    function isCallback() external view returns (bool);
}

contract SuccinctGateway is
    ISuccinctGateway,
    FunctionRegistry,
    Initializable,
    OwnableUpgradeable
{
    /// @notice The address of the fee vault.
    address public feeVault;

    /// @notice A nonce for keeping track of requests.
    uint32 public nonce;

    /// @notice A mapping from request nonces to request hashes.
    mapping(uint32 => bytes32) public requests;

    /// @notice The currently verified function identifier.
    bytes32 public verifiedFunctionId;

    /// @notice The currently verified function input hash.
    bytes32 public verifiedInputHash;

    /// @notice The currently verified function output.
    bytes public verifiedOutput;

    /// @notice A flag that indicates whether the contract is currently making a callback.
    bool public override isCallback;

    mapping(bytes32 => WhitelistStatus) public whitelistStatus;

    /// @notice The allowed provers that can fulfill requests.
    mapping(bytes32 => mapping(address => bool)) public allowedProvers;

    /// @dev Protects functions from being re-entered during a fullfil call.
    modifier nonReentrant() {
        if (
            isCallback || verifiedFunctionId != bytes32(0) || verifiedInputHash != bytes32(0)
                || verifiedOutput.length != 0
        ) {
            revert ReentrantFulfill();
        }
        _;
    }

    /// @dev Protects functions from being called by anyone other than the prover.
    modifier onlyProver(bytes32 _functionId) {
        if (
            whitelistStatus[_functionId] == WhitelistStatus.Default
                && !allowedProvers[bytes32(0)][msg.sender]
        ) {
            revert OnlyProver(_functionId, msg.sender);
        } else if (
            whitelistStatus[_functionId] == WhitelistStatus.Custom
                && !allowedProvers[_functionId][msg.sender]
        ) {
            revert OnlyProver(_functionId, msg.sender);
        }
        _;
    }

    /// @notice Initializes the contract. Only callable once, and only callable by deployer.
    /// @param _owner The address of the owner of the contract.
    /// @param _feeVault The address of the fee vault.
    /// @param _defaultProver The address of the default prover.
    function initialize(address _owner, address _feeVault, address _defaultProver)
        external
        initializer
    {
        _transferOwnership(_owner);
        feeVault = _feeVault;
        allowedProvers[bytes32(0)][_defaultProver] = true;
    }

    /// @notice Creates a onchain request for a proof. The output and proof is fulfilled asynchronously
    ///         by the provided callback.
    /// @param _functionId The function identifier.
    /// @param _input The function input.
    /// @param _context The function context.
    /// @param _callbackSelector The selector of the callback function.
    /// @param _callbackGasLimit The gas limit for the callback function.
    function requestCallback(
        bytes32 _functionId,
        bytes memory _input,
        bytes memory _context,
        bytes4 _callbackSelector,
        uint32 _callbackGasLimit
    ) external payable override returns (bytes32) {
        // Compute the callback hash uniquely associated with this request.
        bytes32 inputHash = sha256(_input);
        bytes32 contextHash = keccak256(_context);
        address callbackAddress = msg.sender;
        bytes32 requestHash = _requestHash(
            nonce,
            _functionId,
            inputHash,
            contextHash,
            callbackAddress,
            _callbackSelector,
            _callbackGasLimit
        );

        // Store the callback hash.
        requests[nonce] = requestHash;
        emit RequestCallback(
            nonce,
            _functionId,
            _input,
            _context,
            callbackAddress,
            _callbackSelector,
            _callbackGasLimit,
            msg.value
        );

        // Increment the nonce.
        nonce++;

        // Send the fee to the vault.
        if (feeVault != address(0)) {
            IFeeVault(feeVault).depositNative{value: msg.value}(callbackAddress);
        }

        return requestHash;
    }

    /// @notice Creates a proof request for a call. This function is equivalent to an off-chain request
    ///         through an API.
    /// @param _functionId The function identifier.
    /// @param _input The function input.
    /// @param _entryAddress The address of the callback contract.
    /// @param _entryCalldata The entry calldata for the call.
    /// @param _entryGasLimit The gas limit for the call.
    function requestCall(
        bytes32 _functionId,
        bytes memory _input,
        address _entryAddress,
        bytes memory _entryCalldata,
        uint32 _entryGasLimit
    ) external payable override {
        // Emit event.
        emit RequestCall(
            _functionId,
            _input,
            _entryAddress,
            _entryCalldata,
            _entryGasLimit,
            msg.sender,
            msg.value
        );

        // Send the fee to the vault.
        if (feeVault != address(0)) {
            IFeeVault(feeVault).depositNative{value: msg.value}(msg.sender);
        }
    }

    /// @notice If the call matches the currently verified function, returns the output. Otherwise,
    ///         this function reverts.
    /// @param _functionId The function identifier.
    /// @param _input The function input.
    function verifiedCall(bytes32 _functionId, bytes memory _input)
        external
        view
        override
        returns (bytes memory)
    {
        bytes32 inputHash = sha256(_input);
        if (verifiedFunctionId == _functionId && verifiedInputHash == inputHash) {
            return verifiedOutput;
        } else {
            revert InvalidCall(_functionId, _input);
        }
    }

    /// @notice Fulfills a request by providing the output and proof.
    /// @param _nonce The nonce of the request.
    /// @param _functionId The function identifier.
    /// @param _inputHash The hash of the function input.
    /// @param _callbackAddress The address of the callback contract.
    /// @param _callbackSelector The selector of the callback function.
    /// @param _callbackGasLimit The gas limit for the callback function.
    /// @param _context The function context.
    /// @param _output The function output.
    /// @param _proof The function proof.
    function fulfillCallback(
        uint32 _nonce,
        bytes32 _functionId,
        bytes32 _inputHash,
        address _callbackAddress,
        bytes4 _callbackSelector,
        uint32 _callbackGasLimit,
        bytes memory _context,
        bytes memory _output,
        bytes memory _proof
    ) external nonReentrant onlyProver(_functionId) {
        // Reconstruct the callback hash.
        bytes32 contextHash = keccak256(_context);
        bytes32 requestHash = _requestHash(
            _nonce,
            _functionId,
            _inputHash,
            contextHash,
            _callbackAddress,
            _callbackSelector,
            _callbackGasLimit
        );

        // Assert that the callback hash is unfilfilled.
        if (requests[_nonce] != requestHash) {
            revert InvalidRequest(_nonce, requests[_nonce], requestHash);
        }

        // Delete the callback hash for a gas refund.
        delete requests[_nonce];

        // Compute the output hash.
        bytes32 outputHash = sha256(_output);

        // Verify the proof.
        _verify(_functionId, _inputHash, outputHash, _proof);

        // Execute the callback.
        isCallback = true;
        (bool status,) = _callbackAddress.call{gas: _callbackGasLimit}(
            abi.encodeWithSelector(_callbackSelector, _output, _context)
        );
        isCallback = false;

        // If the callback failed, revert.
        if (!status) {
            revert CallbackFailed(_callbackSelector, _output, _context);
        }

        // Emit event.
        emit RequestFulfilled(_nonce, _functionId, _inputHash, outputHash);
    }

    /// @notice The entrypoint for fulfilling a call.
    /// @param _functionId The function identifier.
    /// @param _input The function input.
    /// @param _output The function output.
    /// @param _proof The function proof.
    /// @param _callbackAddress The address of the callback contract.
    /// @param _callbackData The data for the callback function.
    function fulfillCall(
        bytes32 _functionId,
        bytes memory _input,
        bytes memory _output,
        bytes memory _proof,
        address _callbackAddress,
        bytes memory _callbackData
    ) external nonReentrant onlyProver(_functionId) {
        // Compute the input and output hashes.
        bytes32 inputHash = sha256(_input);
        bytes32 outputHash = sha256(_output);

        // Verify the proof.
        _verify(_functionId, inputHash, outputHash, _proof);

        // Set the current verified call.
        verifiedFunctionId = _functionId;
        verifiedInputHash = inputHash;
        verifiedOutput = _output;

        // Execute the callback.
        (bool status,) = _callbackAddress.call(_callbackData);
        if (!status) {
            revert CallFailed(_callbackAddress, _callbackData);
        }

        // Delete the current verified call.
        delete verifiedFunctionId;
        delete verifiedInputHash;
        delete verifiedOutput;

        // Emit event.
        emit Call(_functionId, inputHash, outputHash);
    }

    /// @notice Sets the whitelist status for a function.
    /// @param _functionId The function identifier.
    /// @param _status The whitelist status to set.
    function setWhitelistStatus(bytes32 _functionId, WhitelistStatus _status) external {
        if (msg.sender != verifierOwners[_functionId]) {
            revert NotFunctionOwner(msg.sender, verifierOwners[_functionId]);
        }
        whitelistStatus[_functionId] = _status;
        emit WhitelistStatusUpdated(_functionId, _status);
    }

    /// @notice Add a custom prover.
    /// @param _functionId The function identifier.
    /// @param _prover The address of the prover to add.
    function addCustomProver(bytes32 _functionId, address _prover) external {
        if (msg.sender != verifierOwners[_functionId]) {
            revert NotFunctionOwner(msg.sender, verifierOwners[_functionId]);
        }
        allowedProvers[_functionId][_prover] = true;
        emit ProverUpdated(_functionId, _prover, true);
    }

    /// @notice Remove a custom prover.
    /// @param _functionId The function identifier.
    /// @param _prover The address of the prover to remove.
    function removeCustomProver(bytes32 _functionId, address _prover) external {
        if (msg.sender != verifierOwners[_functionId]) {
            revert NotFunctionOwner(msg.sender, verifierOwners[_functionId]);
        }
        delete allowedProvers[_functionId][_prover];
        emit ProverUpdated(_functionId, _prover, false);
    }

    /// @notice Add a default prover.
    /// @param _prover The address of the prover to add.
    function addDefaultProver(address _prover) external onlyOwner {
        allowedProvers[bytes32(0)][_prover] = true;
        emit ProverUpdated(bytes32(0), _prover, true);
    }

    /// @notice Remove a default prover.
    /// @param _prover The address of the prover to remove.
    function removeDefaultProver(address _prover) external onlyOwner {
        delete allowedProvers[bytes32(0)][_prover];
        emit ProverUpdated(bytes32(0), _prover, false);
    }

    /// @notice Sets the fee vault to a new address. Can be set to address(0) to disable fees.
    /// @param _feeVault The address of the fee vault.
    function setFeeVault(address _feeVault) external onlyOwner {
        emit SetFeeVault(feeVault, _feeVault);
        feeVault = _feeVault;
    }

    /// @notice Recovers stuck ETH from the contract.
    /// @param _to The address to send the ETH to.
    /// @param _amount The wei amount of ETH to send.
    function recover(address _to, uint256 _amount) external onlyOwner {
        (bool success,) = _to.call{value: _amount}("");
        if (!success) {
            revert RecoverFailed();
        }
    }

    /// @dev Computes a unique identifier for a request.
    /// @param _functionId The function identifier.
    /// @param _inputHash The hash of the function input.
    /// @param _contextHash The hash of the function context.
    /// @param _callbackAddress The address of the callback contract.
    /// @param _callbackSelector The selector of the callback function.
    /// @param _callbackGasLimit The gas limit for the callback function.
    function _requestHash(
        uint32 _nonce,
        bytes32 _functionId,
        bytes32 _inputHash,
        bytes32 _contextHash,
        address _callbackAddress,
        bytes4 _callbackSelector,
        uint32 _callbackGasLimit
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                _nonce,
                _functionId,
                _inputHash,
                _contextHash,
                _callbackAddress,
                _callbackSelector,
                _callbackGasLimit
            )
        );
    }

    /// @dev Verifies a proof with respect to a function identifier, input hash, and output hash.
    /// @param _functionId The function identifier.
    /// @param _inputHash The hash of the function input.
    /// @param _outputHash The hash of the function output.
    /// @param _proof The function proof.
    function _verify(
        bytes32 _functionId,
        bytes32 _inputHash,
        bytes32 _outputHash,
        bytes memory _proof
    ) internal {
        address verifier = verifiers[_functionId];
        if (!IFunctionVerifier(verifier).verify(_inputHash, _outputHash, _proof)) {
            revert InvalidProof(address(verifier), _inputHash, _outputHash, _proof);
        }
    }
}