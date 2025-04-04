// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library Create2 {
    /**
     * @dev Deploys a contract using `CREATE2`. The address where the contract
     * will be deployed can be known in advance via {computeAddress}.
     *
     * The bytecode for a contract can be obtained from Solidity with
     * `type(contractName).creationCode`.
     *
     * Requirements:
     *
     * - `bytecode` must not be empty.
     * - `salt` must have not been used for `bytecode` already.
     * - the factory must have a balance of at least `amount`.
     * - if `amount` is non-zero, `bytecode` must have a `payable` constructor.
     */
    function deploy(uint256 amount, bytes32 salt, bytes memory bytecode) internal returns (address addr) {
        require(address(this).balance >= amount, "Create2: insufficient balance");
        require(bytecode.length != 0, "Create2: bytecode length is zero");
        /// @solidity memory-safe-assembly
        assembly {
            addr := create2(amount, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Create2: Failed on deploy");
    }

    /**
     * @dev Returns the address where a contract will be stored if deployed via {deploy}. Any change in the
     * `bytecodeHash` or `salt` will result in a new destination address.
     */
    function computeAddress(bytes32 salt, bytes32 bytecodeHash) internal view returns (address) {
        return computeAddress(salt, bytecodeHash, address(this));
    }

    /**
     * @dev Returns the address where a contract will be stored if deployed via {deploy} from a contract located at
     * `deployer`. If `deployer` is this contract's address, returns the same value as {computeAddress}.
     */
    function computeAddress(bytes32 salt, bytes32 bytecodeHash, address deployer) internal pure returns (address addr) {
        /// @solidity memory-safe-assembly
        assembly {
            let ptr := mload(0x40) // Get free memory pointer

            // |                   | ↓ ptr ...  ↓ ptr + 0x0B (start) ...  ↓ ptr + 0x20 ...  ↓ ptr + 0x40 ...   |
            // |-------------------|---------------------------------------------------------------------------|
            // | bytecodeHash      |                                                        CCCCCCCCCCCCC...CC |
            // | salt              |                                      BBBBBBBBBBBBB...BB                   |
            // | deployer          | 000000...0000AAAAAAAAAAAAAAAAAAA...AA                                     |
            // | 0xFF              |            FF                                                             |
            // |-------------------|---------------------------------------------------------------------------|
            // | memory            | 000000...00FFAAAAAAAAAAAAAAAAAAA...AABBBBBBBBBBBBB...BBCCCCCCCCCCCCC...CC |
            // | keccak(start, 85) |            ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ |

            mstore(add(ptr, 0x40), bytecodeHash)
            mstore(add(ptr, 0x20), salt)
            mstore(ptr, deployer) // Right-aligned with 12 preceding garbage bytes
            let start := add(ptr, 0x0b) // The hashed data starts at the final garbage byte which we will set to 0xff
            mstore8(start, 0xff)
            addr := keccak256(start, 85)
        }
    }
}

interface IAssetHandler {
    /// @dev Emitted when a token is minted
    event BridgeMint(uint256 indexed chainId, bytes32 indexed assetId, address receiver, uint256 amount);

    /// @dev Emitted when a token is burned
    event BridgeBurn(
        uint256 indexed chainId,
        bytes32 indexed assetId,
        address indexed sender,
        address receiver,
        uint256 amount
    );

    /// @param _chainId the chainId that the message is from
    /// @param _assetId the assetId of the asset being bridged
    /// @param _data the actual data specified for the function
    /// @dev Note, that while payable, this function will only receive base token on L2 chains,
    /// while L1 the provided msg.value is always 0. However, this may change in the future,
    /// so if your AssetHandler implementation relies on it, it is better to explicitly check it.
    function bridgeMint(uint256 _chainId, bytes32 _assetId, bytes calldata _data) external payable;

    /// @notice Burns bridged tokens and returns the calldata for L2 <-> L1 message.
    /// @dev In case of native token vault _data is the tuple of _depositAmount and _l2Receiver.
    /// @param _chainId the chainId that the message will be sent to
    /// @param _msgValue the msg.value of the L2 transaction. For now it is always 0.
    /// @param _assetId the assetId of the asset being bridged
    /// @param _originalCaller the original caller of the
    /// @param _data the actual data specified for the function
    /// @return _bridgeMintData The calldata used by counterpart asset handler to unlock tokens for recipient.
    function bridgeBurn(
        uint256 _chainId,
        uint256 _msgValue,
        bytes32 _assetId,
        address _originalCaller,
        bytes calldata _data
    ) external payable returns (bytes memory _bridgeMintData);
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

abstract contract Ownable2StepUpgradeable is Initializable, OwnableUpgradeable {
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);

    function __Ownable2Step_init() internal onlyInitializing {
        __Ownable_init_unchained();
    }

    function __Ownable2Step_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev Returns the address of the pending owner.
     */
    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual override {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }

    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        require(pendingOwner() == sender, "Ownable2Step: caller is not the new owner");
        _transferOwnership(sender);
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

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

abstract contract PausableUpgradeable is Initializable, ContextUpgradeable {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    function __Pausable_init() internal onlyInitializing {
        __Pausable_init_unchained();
    }

    function __Pausable_init_unchained() internal onlyInitializing {
        _paused = false;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        require(!paused(), "Pausable: paused");
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        require(paused(), "Pausable: not paused");
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

abstract contract AssetHandlerModifiers {
    /// @notice Modifier that ensures that a certain value is zero.
    /// @dev This should be used in bridgeBurn-like functions to ensure that users
    /// do not accidentally provide value there.
    modifier requireZeroValue(uint256 _value) {
        if (_value != 0) {
            revert NonEmptyMsgValue();
        }
        _;
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

library SafeERC20 {
    using Address for address;

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance + value));
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance - value));
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeWithSelector(token.approve.selector, spender, value);

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, 0));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Use a ERC-2612 signature to set the `owner` approval toward `spender` on `token`.
     * Revert on invalid signature.
     */
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
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        require(returndata.length == 0 || abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
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
        return
            success && (returndata.length == 0 || abi.decode(returndata, (bool))) && Address.isContract(address(token));
    }
}

library DataEncoding {
    /// @notice Abi.encodes the data required for bridgeBurn for NativeTokenVault.
    /// @param _amount The amount of token to be transferred.
    /// @param _remoteReceiver The address which to receive tokens on remote chain.
    /// @param _maybeTokenAddress The helper field that should be either equal to 0 (in this case
    /// it is assumed that the token has been registered within NativeTokenVault already) or it
    /// can be equal to the address of the token on the current chain. Providing non-zero address
    /// allows it to be automatically registered in case it is not yet a part of NativeTokenVault.
    /// @return The encoded bridgeBurn data
    function encodeBridgeBurnData(
        uint256 _amount,
        address _remoteReceiver,
        address _maybeTokenAddress
    ) internal pure returns (bytes memory) {
        return abi.encode(_amount, _remoteReceiver, _maybeTokenAddress);
    }

    /// @notice Function decoding bridgeBurn data previously encoded with this library.
    /// @param _data The encoded data for bridgeBurn
    /// @return amount The amount of token to be transferred.
    /// @return receiver The address which to receive tokens on remote chain.
    /// @return maybeTokenAddress The helper field that should be either equal to 0 (in this case
    /// it is assumed that the token has been registered within NativeTokenVault already) or it
    /// can be equal to the address of the token on the current chain. Providing non-zero address
    /// allows it to be automatically registered in case it is not yet a part of NativeTokenVault.
    function decodeBridgeBurnData(
        bytes memory _data
    ) internal pure returns (uint256 amount, address receiver, address maybeTokenAddress) {
        if (_data.length != 96) {
            // For better error handling
            revert InvalidNTVBurnData();
        }

        (amount, receiver, maybeTokenAddress) = abi.decode(_data, (uint256, address, address));
    }

    /// @notice Abi.encodes the data required for bridgeMint on remote chain.
    /// @param _originalCaller The address which initiated the transfer.
    /// @param _remoteReceiver The address which to receive tokens on remote chain.
    /// @param _originToken The transferred token address.
    /// @param _amount The amount of token to be transferred.
    /// @param _erc20Metadata The transferred token metadata.
    /// @return The encoded bridgeMint data
    function encodeBridgeMintData(
        address _originalCaller,
        address _remoteReceiver,
        address _originToken,
        uint256 _amount,
        bytes memory _erc20Metadata
    ) internal pure returns (bytes memory) {
        // solhint-disable-next-line func-named-parameters
        return abi.encode(_originalCaller, _remoteReceiver, _originToken, _amount, _erc20Metadata);
    }

    /// @notice Function decoding transfer data previously encoded with this library.
    /// @param _bridgeMintData The encoded bridgeMint data
    /// @return _originalCaller The address which initiated the transfer.
    /// @return _remoteReceiver The address which to receive tokens on remote chain.
    /// @return _parsedOriginToken The transferred token address.
    /// @return _amount The amount of token to be transferred.
    /// @return _erc20Metadata The transferred token metadata.
    function decodeBridgeMintData(
        bytes memory _bridgeMintData
    )
        internal
        pure
        returns (
            address _originalCaller,
            address _remoteReceiver,
            address _parsedOriginToken,
            uint256 _amount,
            bytes memory _erc20Metadata
        )
    {
        (_originalCaller, _remoteReceiver, _parsedOriginToken, _amount, _erc20Metadata) = abi.decode(
            _bridgeMintData,
            (address, address, address, uint256, bytes)
        );
    }

    /// @notice Encodes the asset data by combining chain id, asset deployment tracker and asset data.
    /// @param _chainId The id of the chain token is native to.
    /// @param _assetData The asset data that has to be encoded.
    /// @param _sender The asset deployment tracker address.
    /// @return The encoded asset data.
    function encodeAssetId(uint256 _chainId, bytes32 _assetData, address _sender) internal pure returns (bytes32) {
        return keccak256(abi.encode(_chainId, _sender, _assetData));
    }

    /// @notice Encodes the asset data by combining chain id, asset deployment tracker and asset data.
    /// @param _chainId The id of the chain token is native to.
    /// @param _tokenAddress The address of token that has to be encoded (asset data is the address itself).
    /// @param _sender The asset deployment tracker address.
    /// @return The encoded asset data.
    function encodeAssetId(uint256 _chainId, address _tokenAddress, address _sender) internal pure returns (bytes32) {
        return keccak256(abi.encode(_chainId, _sender, _tokenAddress));
    }

    /// @notice Encodes the asset data by combining chain id, NTV as asset deployment tracker and asset data.
    /// @param _chainId The id of the chain token is native to.
    /// @param _assetData The asset data that has to be encoded.
    /// @return The encoded asset data.
    function encodeNTVAssetId(uint256 _chainId, bytes32 _assetData) internal pure returns (bytes32) {
        return keccak256(abi.encode(_chainId, L2_NATIVE_TOKEN_VAULT_ADDR, _assetData));
    }

    /// @notice Encodes the asset data by combining chain id, NTV as asset deployment tracker and token address.
    /// @param _chainId The id of the chain token is native to.
    /// @param _tokenAddress The address of token that has to be encoded (asset data is the address itself).
    /// @return The encoded asset data.
    function encodeNTVAssetId(uint256 _chainId, address _tokenAddress) internal pure returns (bytes32) {
        return keccak256(abi.encode(_chainId, L2_NATIVE_TOKEN_VAULT_ADDR, _tokenAddress));
    }

    /// @dev Encodes the transaction data hash using either the latest encoding standard or the legacy standard.
    /// @param _encodingVersion EncodingVersion.
    /// @param _originalCaller The address of the entity that initiated the deposit.
    /// @param _assetId The unique identifier of the deposited L1 token.
    /// @param _nativeTokenVault The address of the token, only used if the encoding version is legacy.
    /// @param _transferData The encoded transfer data, which includes both the deposit amount and the address of the L2 receiver.
    /// @return txDataHash The resulting encoded transaction data hash.
    function encodeTxDataHash(
        bytes1 _encodingVersion,
        address _originalCaller,
        bytes32 _assetId,
        address _nativeTokenVault,
        bytes memory _transferData
    ) internal view returns (bytes32 txDataHash) {
        if (_encodingVersion == LEGACY_ENCODING_VERSION) {
            address tokenAddress = INativeTokenVault(_nativeTokenVault).tokenAddress(_assetId);

            // This is a double check to ensure that the used token for the legacy encoding is correct.
            // This revert should never be emitted and in real life and should only serve as a guard in
            // case of inconsistent state of Native Token Vault.
            bytes32 expectedAssetId = encodeNTVAssetId(block.chainid, tokenAddress);
            if (_assetId != expectedAssetId) {
                revert IncorrectTokenAddressFromNTV(_assetId, tokenAddress);
            }

            (uint256 depositAmount, , ) = decodeBridgeBurnData(_transferData);
            txDataHash = keccak256(abi.encode(_originalCaller, tokenAddress, depositAmount));
        } else if (_encodingVersion == NEW_ENCODING_VERSION) {
            // Similarly to calldata, the txDataHash is collision-resistant.
            // In the legacy data hash, the first encoded variable was the address, which is padded with zeros during `abi.encode`.
            txDataHash = keccak256(
                bytes.concat(_encodingVersion, abi.encode(_originalCaller, _assetId, _transferData))
            );
        } else {
            revert UnsupportedEncodingVersion();
        }
    }

    /// @notice Decodes the token data by combining chain id, asset deployment tracker and asset data.
    function decodeTokenData(
        bytes calldata _tokenData
    ) internal pure returns (uint256 chainId, bytes memory name, bytes memory symbol, bytes memory decimals) {
        bytes1 encodingVersion = _tokenData[0];
        if (encodingVersion == LEGACY_ENCODING_VERSION) {
            (name, symbol, decimals) = abi.decode(_tokenData, (bytes, bytes, bytes));
        } else if (encodingVersion == NEW_ENCODING_VERSION) {
            return abi.decode(_tokenData[1:], (uint256, bytes, bytes, bytes));
        } else {
            revert UnsupportedEncodingVersion();
        }
    }

    /// @notice Encodes the token data by combining chain id, and its metadata.
    /// @dev Note that all the metadata of the token is expected to be ABI encoded.
    /// @param _chainId The id of the chain token is native to.
    /// @param _name The name of the token.
    /// @param _symbol The symbol of the token.
    /// @param _decimals The decimals of the token.
    /// @return The encoded token data.
    function encodeTokenData(
        uint256 _chainId,
        bytes memory _name,
        bytes memory _symbol,
        bytes memory _decimals
    ) internal pure returns (bytes memory) {
        return bytes.concat(NEW_ENCODING_VERSION, abi.encode(_chainId, _name, _symbol, _decimals));
    }
}

library BridgeHelper {
    /// @dev Receives and parses (name, symbol, decimals) from the token contract
    function getERC20Getters(address _token, uint256 _originChainId) internal view returns (bytes memory) {
        bytes memory name;
        bytes memory symbol;
        bytes memory decimals;
        if (_token == ETH_TOKEN_ADDRESS) {
            // when depositing eth to a non-eth based chain it is an ERC20
            name = abi.encode("Ether");
            symbol = abi.encode("ETH");
            decimals = abi.encode(uint8(18));
        } else {
            bool success;
            /// note this also works on the L2 for the base token.
            (success, name) = _token.staticcall(abi.encodeCall(IERC20Metadata.name, ()));
            if (!success) {
                // We ignore the revert data
                name = hex"";
            }
            (success, symbol) = _token.staticcall(abi.encodeCall(IERC20Metadata.symbol, ()));
            if (!success) {
                // We ignore the revert data
                symbol = hex"";
            }
            (success, decimals) = _token.staticcall(abi.encodeCall(IERC20Metadata.decimals, ()));
            if (!success) {
                // We ignore the revert data
                decimals = hex"";
            }
        }
        return
            DataEncoding.encodeTokenData({_chainId: _originChainId, _name: name, _symbol: symbol, _decimals: decimals});
    }
}

abstract contract NativeTokenVault is
    INativeTokenVault,
    IAssetHandler,
    Ownable2StepUpgradeable,
    PausableUpgradeable,
    AssetHandlerModifiers
{
    using SafeERC20 for IERC20;

    /// @dev The address of the WETH token.
    address public immutable override WETH_TOKEN;

    /// @dev L1 Shared Bridge smart contract that handles communication with its counterparts on L2s
    IAssetRouterBase public immutable override ASSET_ROUTER;

    /// @dev The assetId of the base token.
    bytes32 public immutable BASE_TOKEN_ASSET_ID;

    /// @dev Chain ID of L1 for bridging reasons.
    uint256 public immutable L1_CHAIN_ID;

    /// @dev Contract that stores the implementation address for token.
    /// @dev For more details see https://docs.openzeppelin.com/contracts/3.x/api/proxy#UpgradeableBeacon.
    IBeacon public bridgedTokenBeacon;

    /// @dev A mapping assetId => originChainId
    mapping(bytes32 assetId => uint256 originChainId) public originChainId;

    /// @dev A mapping assetId => tokenAddress
    mapping(bytes32 assetId => address tokenAddress) public tokenAddress;

    /// @dev A mapping tokenAddress => assetId
    mapping(address tokenAddress => bytes32 assetId) public assetId;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[46] private __gap;

    /// @notice Checks that the message sender is the bridgehub.
    modifier onlyAssetRouter() {
        if (msg.sender != address(ASSET_ROUTER)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    /// @dev Contract is expected to be used as proxy implementation.
    /// @dev Disable the initialization to prevent Parity hack.
    /// @param _wethToken Address of WETH on deployed chain
    /// @param _assetRouter Address of assetRouter
    constructor(address _wethToken, address _assetRouter, bytes32 _baseTokenAssetId, uint256 _l1ChainId) {
        _disableInitializers();
        L1_CHAIN_ID = _l1ChainId;
        ASSET_ROUTER = IAssetRouterBase(_assetRouter);
        WETH_TOKEN = _wethToken;
        BASE_TOKEN_ASSET_ID = _baseTokenAssetId;
    }

    /// @inheritdoc INativeTokenVault
    function registerToken(address _nativeToken) external virtual {
        _registerToken(_nativeToken);
    }

    function _registerToken(address _nativeToken) internal virtual returns (bytes32 newAssetId) {
        // We allow registering `WETH_TOKEN` inside `NativeTokenVault` only for L1 native token vault.
        // It is needed to allow withdrawing such assets. We restrict all WETH-related
        // operations to deposits from L1 only to be able to upgrade their logic more easily in the
        // future.
        if (_nativeToken == WETH_TOKEN && block.chainid != L1_CHAIN_ID) {
            revert TokenNotSupported(WETH_TOKEN);
        }
        if (_nativeToken.code.length == 0) {
            revert EmptyToken();
        }
        if (assetId[_nativeToken] != bytes32(0)) {
            revert AssetIdAlreadyRegistered();
        }
        newAssetId = _unsafeRegisterNativeToken(_nativeToken);
    }

    /// @inheritdoc INativeTokenVault
    function ensureTokenIsRegistered(address _nativeToken) public {
        if (assetId[_nativeToken] == bytes32(0)) {
            _registerToken(_nativeToken);
        }
    }

    /*//////////////////////////////////////////////////////////////
                            FINISH TRANSACTION FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @inheritdoc IAssetHandler
    /// @notice Used when the chain receives a transfer from L1 Shared Bridge and correspondingly mints the asset.
    /// @param _chainId The chainId that the message is from.
    /// @param _assetId The assetId of the asset being bridged.
    /// @param _data The abi.encoded transfer data.
    function bridgeMint(
        uint256 _chainId,
        bytes32 _assetId,
        bytes calldata _data
    ) external payable override requireZeroValue(msg.value) onlyAssetRouter whenNotPaused {
        address receiver;
        uint256 amount;
        // we set all originChainId for all already bridged tokens with the setLegacyTokenAssetId and updateChainBalancesFromSharedBridge functions.
        // for tokens that are bridged for the first time, the originChainId will be 0.
        if (originChainId[_assetId] == block.chainid) {
            (receiver, amount) = _bridgeMintNativeToken(_chainId, _assetId, _data);
        } else {
            (receiver, amount) = _bridgeMintBridgedToken(_chainId, _assetId, _data);
        }
        // solhint-disable-next-line func-named-parameters
        emit BridgeMint(_chainId, _assetId, receiver, amount);
    }

    function _bridgeMintBridgedToken(
        uint256 _chainId,
        bytes32 _assetId,
        bytes calldata _data
    ) internal virtual returns (address receiver, uint256 amount) {
        // Either it was bridged before, therefore address is not zero, or it is first time bridging and standard erc20 will be deployed
        address token = tokenAddress[_assetId];
        bytes memory erc20Data;
        address originToken;
        // slither-disable-next-line unused-return
        (, receiver, originToken, amount, erc20Data) = DataEncoding.decodeBridgeMintData(_data);

        if (token == address(0)) {
            token = _ensureAndSaveTokenDeployed(_assetId, originToken, erc20Data);
        }
        _handleChainBalanceDecrease(_chainId, _assetId, amount, false);
        IBridgedStandardToken(token).bridgeMint(receiver, amount);
    }

    function _bridgeMintNativeToken(
        uint256 _chainId,
        bytes32 _assetId,
        bytes calldata _data
    ) internal returns (address receiver, uint256 amount) {
        address token = tokenAddress[_assetId];
        // slither-disable-next-line unused-return
        (, receiver, , amount, ) = DataEncoding.decodeBridgeMintData(_data);

        _handleChainBalanceDecrease(_chainId, _assetId, amount, true);
        _withdrawFunds(_assetId, receiver, token, amount);
    }

    function _withdrawFunds(bytes32 _assetId, address _to, address _token, uint256 _amount) internal virtual;

    /*//////////////////////////////////////////////////////////////
                            Start transaction Functions
    //////////////////////////////////////////////////////////////*/

    /// @inheritdoc IAssetHandler
    /// @notice Allows bridgehub to acquire mintValue for L1->L2 transactions.
    /// @dev In case of native token vault _data is the tuple of _depositAmount and _receiver.
    function bridgeBurn(
        uint256 _chainId,
        uint256 _l2MsgValue,
        bytes32 _assetId,
        address _originalCaller,
        bytes calldata _data
    )
        external
        payable
        override
        requireZeroValue(_l2MsgValue)
        onlyAssetRouter
        whenNotPaused
        returns (bytes memory _bridgeMintData)
    {
        (uint256 amount, address receiver, address tokenAddress) = _decodeBurnAndCheckAssetId(_data, _assetId);
        if (originChainId[_assetId] != block.chainid) {
            _bridgeMintData = _bridgeBurnBridgedToken({
                _chainId: _chainId,
                _assetId: _assetId,
                _originalCaller: _originalCaller,
                _amount: amount,
                _receiver: receiver,
                _tokenAddress: tokenAddress
            });
        } else {
            _bridgeMintData = _bridgeBurnNativeToken({
                _chainId: _chainId,
                _assetId: _assetId,
                _originalCaller: _originalCaller,
                _depositChecked: false,
                _depositAmount: amount,
                _receiver: receiver,
                _nativeToken: tokenAddress
            });
        }
    }

    function tryRegisterTokenFromBurnData(bytes calldata _burnData, bytes32 _expectedAssetId) external {
        // slither-disable-next-line unused-return
        (, , address tokenAddress) = DataEncoding.decodeBridgeBurnData(_burnData);

        if (tokenAddress == address(0)) {
            revert ZeroAddress();
        }

        bytes32 storedAssetId = assetId[tokenAddress];
        if (storedAssetId != bytes32(0)) {
            revert AssetIdAlreadyRegistered();
        }

        // This token has not been registered within this NTV yet. Usually this means that the
        // token is native to the chain and the user would prefer to get it registered as such.
        // However, there are exceptions (e.g. bridged legacy ERC20 tokens on L2) when the
        // assetId has not been stored yet. We will ask the implementor to double check that the token
        // is not legacy.

        // We try to register it as legacy token. If it fails, we know
        // it is a native one and so register it as a native token.
        bytes32 newAssetId = _registerTokenIfBridgedLegacy(tokenAddress);
        if (newAssetId == bytes32(0)) {
            newAssetId = _registerToken(tokenAddress);
        }

        if (newAssetId != _expectedAssetId) {
            revert AssetIdMismatch(_expectedAssetId, newAssetId);
        }
    }

    function _decodeBurnAndCheckAssetId(
        bytes calldata _data,
        bytes32 _suppliedAssetId
    ) internal returns (uint256 amount, address receiver, address parsedTokenAddress) {
        (amount, receiver, parsedTokenAddress) = DataEncoding.decodeBridgeBurnData(_data);

        if (parsedTokenAddress == address(0)) {
            // This means that the user wants the native token vault to resolve the
            // address. In this case, it is assumed that the assetId is already registered.
            parsedTokenAddress = tokenAddress[_suppliedAssetId];
        }

        // If it is still zero, it means that the token has not been registered.
        if (parsedTokenAddress == address(0)) {
            revert ZeroAddress();
        }

        bytes32 storedAssetId = assetId[parsedTokenAddress];
        if (_suppliedAssetId != storedAssetId) {
            revert AssetIdMismatch(storedAssetId, _suppliedAssetId);
        }
    }

    function _registerTokenIfBridgedLegacy(address _token) internal virtual returns (bytes32);

    function _bridgeBurnBridgedToken(
        uint256 _chainId,
        bytes32 _assetId,
        address _originalCaller,
        uint256 _amount,
        address _receiver,
        address _tokenAddress
    ) internal requireZeroValue(msg.value) returns (bytes memory _bridgeMintData) {
        if (_amount == 0) {
            // "Amount cannot be zero");
            revert AmountMustBeGreaterThanZero();
        }

        IBridgedStandardToken(_tokenAddress).bridgeBurn(_originalCaller, _amount);
        _handleChainBalanceIncrease(_chainId, _assetId, _amount, false);

        emit BridgeBurn({
            chainId: _chainId,
            assetId: _assetId,
            sender: _originalCaller,
            receiver: _receiver,
            amount: _amount
        });
        bytes memory erc20Metadata;
        {
            // we set all originChainId for all already bridged tokens with the setLegacyTokenAssetId and updateChainBalancesFromSharedBridge functions.
            // for native tokens the originChainId is set when they register.
            uint256 originChainId = originChainId[_assetId];
            if (originChainId == 0) {
                revert ZeroAddress();
            }
            erc20Metadata = getERC20Getters(_tokenAddress, originChainId);
        }
        address originToken;
        {
            originToken = IBridgedStandardToken(_tokenAddress).originToken();
            if (originToken == address(0)) {
                revert ZeroAddress();
            }
        }

        _bridgeMintData = DataEncoding.encodeBridgeMintData({
            _originalCaller: _originalCaller,
            _remoteReceiver: _receiver,
            _originToken: originToken,
            _amount: _amount,
            _erc20Metadata: erc20Metadata
        });
    }

    function _bridgeBurnNativeToken(
        uint256 _chainId,
        bytes32 _assetId,
        address _originalCaller,
        bool _depositChecked,
        uint256 _depositAmount,
        address _receiver,
        address _nativeToken
    ) internal virtual returns (bytes memory _bridgeMintData) {
        if (_nativeToken == WETH_TOKEN) {
            // This ensures that WETH_TOKEN can never be bridged from chains it is native to.
            // It can only be withdrawn from the chain where it has already gotten.
            revert BurningNativeWETHNotSupported();
        }

        if (_assetId == BASE_TOKEN_ASSET_ID) {
            if (_depositAmount != msg.value) {
                revert ValueMismatch(_depositAmount, msg.value);
            }

            _handleChainBalanceIncrease(_chainId, _assetId, _depositAmount, true);
        } else {
            if (msg.value != 0) {
                revert NonEmptyMsgValue();
            }
            _handleChainBalanceIncrease(_chainId, _assetId, _depositAmount, true);
            if (!_depositChecked) {
                uint256 expectedDepositAmount = _depositFunds(_originalCaller, IERC20(_nativeToken), _depositAmount); // note if _originalCaller is this contract, this will return 0. This does not happen.
                // The token has non-standard transfer logic
                if (_depositAmount != expectedDepositAmount) {
                    revert TokensWithFeesNotSupported();
                }
            }
        }
        if (_depositAmount == 0) {
            // empty deposit amount
            revert EmptyDeposit();
        }

        bytes memory erc20Metadata;
        {
            erc20Metadata = getERC20Getters(_nativeToken, originChainId[_assetId]);
        }
        _bridgeMintData = DataEncoding.encodeBridgeMintData({
            _originalCaller: _originalCaller,
            _remoteReceiver: _receiver,
            _originToken: _nativeToken,
            _amount: _depositAmount,
            _erc20Metadata: erc20Metadata
        });

        emit BridgeBurn({
            chainId: _chainId,
            assetId: _assetId,
            sender: _originalCaller,
            receiver: _receiver,
            amount: _depositAmount
        });
    }

    /*//////////////////////////////////////////////////////////////
                            INTERNAL & HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Transfers tokens from the depositor address to the smart contract address.
    /// @param _from The address of the depositor.
    /// @param _token The ERC20 token to be transferred.
    /// @param _amount The amount to be transferred.
    /// @return The difference between the contract balance before and after the transferring of funds.
    function _depositFunds(address _from, IERC20 _token, uint256 _amount) internal virtual returns (uint256) {
        uint256 balanceBefore = _token.balanceOf(address(this));
        // slither-disable-next-line arbitrary-send-erc20
        _token.safeTransferFrom(_from, address(this), _amount);
        uint256 balanceAfter = _token.balanceOf(address(this));

        return balanceAfter - balanceBefore;
    }

    /// @param _token The address of token of interest.
    /// @dev Receives and parses (name, symbol, decimals) from the token contract
    function getERC20Getters(address _token, uint256 _originChainId) public view override returns (bytes memory) {
        return BridgeHelper.getERC20Getters(_token, _originChainId);
    }

    /// @notice Registers a native token address for the vault.
    /// @dev It does not perform any checks for the correctnesss of the token contract.
    /// @param _nativeToken The address of the token to be registered.
    function _unsafeRegisterNativeToken(address _nativeToken) internal returns (bytes32 newAssetId) {
        newAssetId = DataEncoding.encodeNTVAssetId(block.chainid, _nativeToken);
        tokenAddress[newAssetId] = _nativeToken;
        assetId[_nativeToken] = newAssetId;
        originChainId[newAssetId] = block.chainid;
        ASSET_ROUTER.setAssetHandlerAddressThisChain(bytes32(uint256(uint160(_nativeToken))), address(this));
    }

    function _handleChainBalanceIncrease(
        uint256 _chainId,
        bytes32 _assetId,
        uint256 _amount,
        bool _isNative
    ) internal virtual;

    function _handleChainBalanceDecrease(
        uint256 _chainId,
        bytes32 _assetId,
        uint256 _amount,
        bool _isNative
    ) internal virtual;

    /*//////////////////////////////////////////////////////////////
                            TOKEN DEPLOYER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _ensureAndSaveTokenDeployed(
        bytes32 _assetId,
        address _originToken,
        bytes memory _erc20Data
    ) internal virtual returns (address expectedToken) {
        uint256 tokenOriginChainId;
        (expectedToken, tokenOriginChainId) = _calculateExpectedTokenAddress(_originToken, _erc20Data);
        _ensureAndSaveTokenDeployedInner({
            _tokenOriginChainId: tokenOriginChainId,
            _assetId: _assetId,
            _originToken: _originToken,
            _erc20Data: _erc20Data,
            _expectedToken: expectedToken
        });
    }

    /// @notice Calculates the bridged token address corresponding to native token counterpart.
    function _calculateExpectedTokenAddress(
        address _originToken,
        bytes memory _erc20Data
    ) internal view returns (address expectedToken, uint256 tokenOriginChainId) {
        /// @dev calling externally to convert from memory to calldata
        tokenOriginChainId = this.tokenDataOriginChainId(_erc20Data);
        expectedToken = calculateCreate2TokenAddress(tokenOriginChainId, _originToken);
    }

    /// @notice Returns the origin chain id from the token data.
    function tokenDataOriginChainId(bytes calldata _erc20Data) public view returns (uint256 tokenOriginChainId) {
        // slither-disable-next-line unused-return
        (tokenOriginChainId, , , ) = DataEncoding.decodeTokenData(_erc20Data);
        if (tokenOriginChainId == 0) {
            tokenOriginChainId = L1_CHAIN_ID;
        }
    }

    /// @notice Checks that the assetId is correct for the origin token and chain.
    function _assetIdCheck(uint256 _tokenOriginChainId, bytes32 _assetId, address _originToken) internal view {
        bytes32 expectedAssetId = DataEncoding.encodeNTVAssetId(_tokenOriginChainId, _originToken);
        if (_assetId != expectedAssetId) {
            // Make sure that a NativeTokenVault sent the message
            revert AssetIdMismatch(_assetId, expectedAssetId);
        }
    }

    function _ensureAndSaveTokenDeployedInner(
        uint256 _tokenOriginChainId,
        bytes32 _assetId,
        address _originToken,
        bytes memory _erc20Data,
        address _expectedToken
    ) internal {
        _assetIdCheck(_tokenOriginChainId, _assetId, _originToken);

        address deployedToken = _deployBridgedToken(_tokenOriginChainId, _assetId, _originToken, _erc20Data);
        if (deployedToken != _expectedToken) {
            revert AddressMismatch(_expectedToken, deployedToken);
        }

        tokenAddress[_assetId] = _expectedToken;
        assetId[_expectedToken] = _assetId;
    }

    /// @notice Calculates the bridged token address corresponding to native token counterpart.
    /// @param _tokenOriginChainId The chain id of the origin token.
    /// @param _bridgeToken The address of native token.
    /// @return The address of bridged token.
    function calculateCreate2TokenAddress(
        uint256 _tokenOriginChainId,
        address _bridgeToken
    ) public view virtual override returns (address);

    /// @notice Deploys and initializes the bridged token for the native counterpart.
    /// @param _tokenOriginChainId The chain id of the origin token.
    /// @param _originToken The address of origin token.
    /// @param _erc20Data The ERC20 metadata of the token deployed.
    /// @return The address of the beacon proxy (bridged token).
    function _deployBridgedToken(
        uint256 _tokenOriginChainId,
        bytes32 _assetId,
        address _originToken,
        bytes memory _erc20Data
    ) internal returns (address) {
        if (_tokenOriginChainId == block.chainid) {
            revert DeployingBridgedTokenForNativeToken();
        }
        bytes32 salt = _getCreate2Salt(_tokenOriginChainId, _originToken);

        BeaconProxy l2Token = _deployBeaconProxy(salt, _tokenOriginChainId);
        BridgedStandardERC20(address(l2Token)).bridgeInitialize(_assetId, _originToken, _erc20Data);

        originChainId[_assetId] = _tokenOriginChainId;
        return address(l2Token);
    }

    /// @notice Converts the L1 token address to the create2 salt of deployed L2 token.
    /// @param _l1Token The address of token on L1.
    /// @return salt The salt used to compute address of bridged token on L2 and for beacon proxy deployment.
    function _getCreate2Salt(uint256 _originChainId, address _l1Token) internal view virtual returns (bytes32 salt) {
        salt = keccak256(abi.encode(_originChainId, _l1Token));
    }

    /// @notice Deploys the beacon proxy for the bridged token.
    /// @dev This function uses raw call to ContractDeployer to make sure that exactly `l2TokenProxyBytecodeHash` is used
    /// for the code of the proxy.
    /// @param _salt The salt used for beacon proxy deployment of the bridged token (we pass the native token address).
    /// @return proxy The beacon proxy, i.e. bridged token.
    function _deployBeaconProxy(
        bytes32 _salt,
        uint256 _tokenOriginChainId
    ) internal virtual returns (BeaconProxy proxy);

    /*//////////////////////////////////////////////////////////////
                            PAUSE
    //////////////////////////////////////////////////////////////*/

    /// @notice Pauses all functions marked with the `whenNotPaused` modifier.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the contract, allowing all functions marked with the `whenNotPaused` modifier to be called again.
    function unpause() external onlyOwner {
        _unpause();
    }
}

interface IL1AssetHandler {
    /// @param _chainId the chainId that the message will be sent to
    /// @param _assetId the assetId of the asset being bridged
    /// @param _depositSender the address of the entity that initiated the deposit.
    /// @param _data the actual data specified for the function
    function bridgeRecoverFailedTransfer(
        uint256 _chainId,
        bytes32 _assetId,
        address _depositSender,
        bytes calldata _data
    ) external payable;
}

interface INativeTokenVault {
    event BridgedTokenBeaconUpdated(address bridgedTokenBeacon, bytes32 bridgedTokenProxyBytecodeHash);

    /// @notice The Weth token address
    function WETH_TOKEN() external view returns (address);

    /// @notice The AssetRouter contract
    function ASSET_ROUTER() external view returns (IAssetRouterBase);

    /// @notice The chain ID of the L1 chain
    function L1_CHAIN_ID() external view returns (uint256);

    /// @notice Returns the chain ID of the origin chain for a given asset ID
    function originChainId(bytes32 assetId) external view returns (uint256);

    /// @notice Registers tokens within the NTV.
    /// @dev The goal is to allow bridging native tokens automatically, by registering them on the fly.
    /// @notice Allows the bridge to register a token address for the vault.
    /// @notice No access control is ok, since the bridging of tokens should be permissionless. This requires permissionless registration.
    function registerToken(address _l1Token) external;

    /// @notice Ensures that the native token is registered with the NTV.
    /// @dev This function is used to ensure that the token is registered with the NTV.
    function ensureTokenIsRegistered(address _nativeToken) external;

    /// @notice Used to get the the ERC20 data for a token
    function getERC20Getters(address _token, uint256 _originChainId) external view returns (bytes memory);

    /// @notice Used to get the token address of an assetId
    function tokenAddress(bytes32 assetId) external view returns (address);

    /// @notice Used to get the assetId of a token
    function assetId(address token) external view returns (bytes32);

    /// @notice Used to get the expected bridged token address corresponding to its native counterpart
    function calculateCreate2TokenAddress(uint256 _originChainId, address _originToken) external view returns (address);

    /// @notice Tries to register a token from the provided `_burnData` and reverts if it is not possible.
    function tryRegisterTokenFromBurnData(bytes calldata _burnData, bytes32 _expectedAssetId) external;
}

interface IL1AssetDeploymentTracker {
    function bridgeCheckCounterpartAddress(
        uint256 _chainId,
        bytes32 _assetId,
        address _originalCaller,
        address _assetHandlerAddressOnCounterpart
    ) external view;
}

interface IL1NativeTokenVault is INativeTokenVault, IL1AssetDeploymentTracker {
    /// @notice The L1Nullifier contract
    function L1_NULLIFIER() external view returns (IL1Nullifier);

    /// @notice Returns the total number of specific tokens locked for some chain
    function chainBalance(uint256 _chainId, bytes32 _assetId) external view returns (uint256);

    /// @notice Registers ETH token
    function registerEthToken() external;

    event TokenBeaconUpdated(address indexed l2TokenBeacon);
}

contract L1NativeTokenVault is IL1NativeTokenVault, IL1AssetHandler, NativeTokenVault {
    using SafeERC20 for IERC20;

    /// @dev L1 nullifier contract that handles legacy functions & finalize withdrawal, confirm l2 tx mappings
    IL1Nullifier public immutable override L1_NULLIFIER;

    /// @dev Maps token balances for each chain to prevent unauthorized spending across ZK chains.
    /// This serves as a security measure until hyperbridging is implemented.
    /// NOTE: this function may be removed in the future, don't rely on it!
    mapping(uint256 chainId => mapping(bytes32 assetId => uint256 balance)) public chainBalance;

    /// @dev Contract is expected to be used as proxy implementation.
    /// @dev Initialize the implementation to prevent Parity hack.
    /// @param _l1WethAddress Address of WETH on deployed chain
    /// @param _l1AssetRouter Address of Asset Router on L1.
    /// @param _l1Nullifier Address of the nullifier contract, which handles transaction progress between L1 and ZK chains.
    constructor(
        address _l1WethAddress,
        address _l1AssetRouter,
        IL1Nullifier _l1Nullifier
    )
        NativeTokenVault(
            _l1WethAddress,
            _l1AssetRouter,
            DataEncoding.encodeNTVAssetId(block.chainid, ETH_TOKEN_ADDRESS),
            block.chainid
        )
    {
        L1_NULLIFIER = _l1Nullifier;
    }

    /// @dev Accepts ether only from the contract that was the shared Bridge.
    receive() external payable {
        if (address(L1_NULLIFIER) != msg.sender) {
            revert Unauthorized(msg.sender);
        }
    }

    /// @dev Initializes a contract for later use. Expected to be used in the proxy
    /// @param _owner Address which can change pause / unpause the NTV
    /// implementation. The owner is the Governor and separate from the ProxyAdmin from now on, so that the Governor can call the bridge.
    function initialize(address _owner, address _bridgedTokenBeacon) external initializer {
        if (_owner == address(0)) {
            revert ZeroAddress();
        }
        bridgedTokenBeacon = IBeacon(_bridgedTokenBeacon);
        _transferOwnership(_owner);
    }

    /// @inheritdoc IL1NativeTokenVault
    function registerEthToken() external {
        _unsafeRegisterNativeToken(ETH_TOKEN_ADDRESS);
    }

    /// @notice Transfers tokens from shared bridge as part of the migration process.
    /// The shared bridge becomes the L1Nullifier contract.
    /// @dev Both ETH and ERC20 tokens can be transferred. Exhausts balance of shared bridge after the first call.
    /// @dev Calling second time for the same token will revert.
    /// @param _token The address of token to be transferred (address(1) for ether and contract address for ERC20).
    function transferFundsFromSharedBridge(address _token) external {
        ensureTokenIsRegistered(_token);
        if (_token == ETH_TOKEN_ADDRESS) {
            uint256 balanceBefore = address(this).balance;
            L1_NULLIFIER.transferTokenToNTV(_token);
            uint256 balanceAfter = address(this).balance;
            if (balanceAfter <= balanceBefore) {
                revert NoFundsTransferred();
            }
        } else {
            uint256 balanceBefore = IERC20(_token).balanceOf(address(this));
            uint256 nullifierChainBalance = IERC20(_token).balanceOf(address(L1_NULLIFIER));
            if (nullifierChainBalance == 0) {
                revert ZeroAmountToTransfer();
            }
            L1_NULLIFIER.transferTokenToNTV(_token);
            uint256 balanceAfter = IERC20(_token).balanceOf(address(this));
            if (balanceAfter - balanceBefore < nullifierChainBalance) {
                revert WrongAmountTransferred(balanceAfter - balanceBefore, nullifierChainBalance);
            }
        }
    }

    /// @notice Updates chain token balance within NTV to account for tokens transferred from the shared bridge (part of the migration process).
    /// @dev Clears chain balance on the shared bridge after the first call. Subsequent calls will not affect the state.
    /// @param _token The address of token to be transferred (address(1) for ether and contract address for ERC20).
    /// @param _targetChainId The chain ID of the corresponding ZK chain.
    function updateChainBalancesFromSharedBridge(address _token, uint256 _targetChainId) external {
        uint256 nullifierChainBalance = L1_NULLIFIER.chainBalance(_targetChainId, _token);
        bytes32 assetId = DataEncoding.encodeNTVAssetId(block.chainid, _token);
        chainBalance[_targetChainId][assetId] = chainBalance[_targetChainId][assetId] + nullifierChainBalance;
        originChainId[assetId] = block.chainid;
        L1_NULLIFIER.nullifyChainBalanceByNTV(_targetChainId, _token);
    }

    /// @notice Used to register the Asset Handler asset in L2 AssetRouter.
    /// @param _assetHandlerAddressOnCounterpart the address of the asset handler on the counterpart chain.
    function bridgeCheckCounterpartAddress(
        uint256,
        bytes32,
        address,
        address _assetHandlerAddressOnCounterpart
    ) external view override onlyAssetRouter {
        if (_assetHandlerAddressOnCounterpart != L2_NATIVE_TOKEN_VAULT_ADDR) {
            revert WrongCounterpart();
        }
    }

    function _getOriginChainId(bytes32 _assetId) internal view returns (uint256) {
        uint256 chainId = originChainId[_assetId];
        if (chainId != 0) {
            return chainId;
        } else {
            address token = tokenAddress[_assetId];
            if (token == ETH_TOKEN_ADDRESS) {
                return block.chainid;
            } else if (IERC20(token).balanceOf(address(this)) > 0) {
                return block.chainid;
            } else if (IERC20(token).balanceOf(address(L1_NULLIFIER)) > 0) {
                return block.chainid;
            } else {
                return 0;
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                            Start transaction Functions
    //////////////////////////////////////////////////////////////*/

    function _bridgeBurnNativeToken(
        uint256 _chainId,
        bytes32 _assetId,
        address _originalCaller,
        // solhint-disable-next-line no-unused-vars
        bool _depositChecked,
        uint256 _depositAmount,
        address _receiver,
        address _nativeToken
    ) internal override returns (bytes memory _bridgeMintData) {
        bool depositChecked = IL1AssetRouter(address(ASSET_ROUTER)).transferFundsToNTV(
            _assetId,
            _depositAmount,
            _originalCaller
        );
        _bridgeMintData = super._bridgeBurnNativeToken({
            _chainId: _chainId,
            _assetId: _assetId,
            _originalCaller: _originalCaller,
            _depositChecked: depositChecked,
            _depositAmount: _depositAmount,
            _receiver: _receiver,
            _nativeToken: _nativeToken
        });
    }

    /*//////////////////////////////////////////////////////////////
                            L1 SPECIFIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    ///  @inheritdoc IL1AssetHandler
    function bridgeRecoverFailedTransfer(
        uint256 _chainId,
        bytes32 _assetId,
        address _depositSender,
        bytes calldata _data
    ) external payable override requireZeroValue(msg.value) onlyAssetRouter whenNotPaused {
        // slither-disable-next-line unused-return
        (uint256 _amount, , ) = DataEncoding.decodeBridgeBurnData(_data);
        address l1Token = tokenAddress[_assetId];
        if (_amount == 0) {
            revert NoFundsTransferred();
        }

        _handleChainBalanceDecrease(_chainId, _assetId, _amount, false);

        if (l1Token == ETH_TOKEN_ADDRESS) {
            bool callSuccess;
            // Low-level assembly call, to avoid any memory copying (save gas)
            assembly {
                callSuccess := call(gas(), _depositSender, _amount, 0, 0, 0, 0)
            }
            if (!callSuccess) {
                revert ClaimFailedDepositFailed();
            }
        } else {
            uint256 originChainId = _getOriginChainId(_assetId);
            if (originChainId == block.chainid) {
                IERC20(l1Token).safeTransfer(_depositSender, _amount);
            } else if (originChainId != 0) {
                IBridgedStandardToken(l1Token).bridgeMint(_depositSender, _amount);
            } else {
                revert OriginChainIdNotFound();
            }
            // Note we don't allow weth deposits anymore, but there might be legacy weth deposits.
            // until we add Weth bridging capabilities, we don't wrap/unwrap weth to ether.
        }
    }

    /*//////////////////////////////////////////////////////////////
                            INTERNAL & HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _registerTokenIfBridgedLegacy(address) internal override returns (bytes32) {
        // There are no legacy tokens present on L1.
        return bytes32(0);
    }

    // get the computed address before the contract DeployWithCreate2 deployed using Bytecode of contract DeployWithCreate2 and salt specified by the sender
    function calculateCreate2TokenAddress(
        uint256 _originChainId,
        address _nonNativeToken
    ) public view override(INativeTokenVault, NativeTokenVault) returns (address) {
        bytes32 salt = _getCreate2Salt(_originChainId, _nonNativeToken);
        return
            Create2.computeAddress(
                salt,
                keccak256(abi.encodePacked(type(BeaconProxy).creationCode, abi.encode(bridgedTokenBeacon, "")))
            );
    }

    function _withdrawFunds(bytes32 _assetId, address _to, address _token, uint256 _amount) internal override {
        if (_assetId == BASE_TOKEN_ASSET_ID) {
            bool callSuccess;
            // Low-level assembly call, to avoid any memory copying (save gas)
            assembly {
                callSuccess := call(gas(), _to, _amount, 0, 0, 0, 0)
            }
            if (!callSuccess) {
                revert WithdrawFailed();
            }
        } else {
            // Withdraw funds
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

    function _deployBeaconProxy(bytes32 _salt, uint256) internal override returns (BeaconProxy proxy) {
        // Use CREATE2 to deploy the BeaconProxy
        address proxyAddress = Create2.deploy(
            0,
            _salt,
            abi.encodePacked(type(BeaconProxy).creationCode, abi.encode(bridgedTokenBeacon, ""))
        );
        return BeaconProxy(payable(proxyAddress));
    }

    function _handleChainBalanceIncrease(
        uint256 _chainId,
        bytes32 _assetId,
        uint256 _amount,
        bool _isNative
    ) internal override {
        // Note, that we do not update balances for chains where the assetId comes from,
        // since these chains can mint new instances of the token.
        if (!_hasInfiniteBalance(_isNative, _assetId, _chainId)) {
            chainBalance[_chainId][_assetId] += _amount;
        }
    }

    function _handleChainBalanceDecrease(
        uint256 _chainId,
        bytes32 _assetId,
        uint256 _amount,
        bool _isNative
    ) internal override {
        // Note, that we do not update balances for chains where the assetId comes from,
        // since these chains can mint new instances of the token.
        if (!_hasInfiniteBalance(_isNative, _assetId, _chainId)) {
            // Check that the chain has sufficient balance
            if (chainBalance[_chainId][_assetId] < _amount) {
                revert InsufficientChainBalance();
            }
            chainBalance[_chainId][_assetId] -= _amount;
        }
    }

    /// @dev Returns whether a chain `_chainId` has infinite balance for an asset `_assetId`, i.e.
    /// it can be minted by it.
    /// @param _isNative Whether the asset is native to the L1 chain.
    /// @param _assetId The asset id
    /// @param _chainId An id of a chain which we test against.
    /// @return Whether The chain `_chainId` has infinite balance of the token
    function _hasInfiniteBalance(bool _isNative, bytes32 _assetId, uint256 _chainId) private view returns (bool) {
        return !_isNative && originChainId[_assetId] == _chainId;
    }
}