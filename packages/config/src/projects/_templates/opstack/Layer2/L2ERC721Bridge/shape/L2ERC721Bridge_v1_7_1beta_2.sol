// SPDX-License-Identifier: Unknown
pragma solidity 0.8.15;

library ERC165Checker {
    // As per the EIP-165 spec, no interface should ever match 0xffffffff
    bytes4 private constant _INTERFACE_ID_INVALID = 0xffffffff;

    /**
     * @dev Returns true if `account` supports the {IERC165} interface,
     */
    function supportsERC165(address account) internal view returns (bool) {
        // Any contract that implements ERC165 must explicitly indicate support of
        // InterfaceId_ERC165 and explicitly indicate non-support of InterfaceId_Invalid
        return
            _supportsERC165Interface(account, type(IERC165).interfaceId) &&
            !_supportsERC165Interface(account, _INTERFACE_ID_INVALID);
    }

    /**
     * @dev Returns true if `account` supports the interface defined by
     * `interfaceId`. Support for {IERC165} itself is queried automatically.
     *
     * See {IERC165-supportsInterface}.
     */
    function supportsInterface(address account, bytes4 interfaceId) internal view returns (bool) {
        // query support of both ERC165 as per the spec and support of _interfaceId
        return supportsERC165(account) && _supportsERC165Interface(account, interfaceId);
    }

    /**
     * @dev Returns a boolean array where each value corresponds to the
     * interfaces passed in and whether they're supported or not. This allows
     * you to batch check interfaces for a contract where your expectation
     * is that some interfaces may not be supported.
     *
     * See {IERC165-supportsInterface}.
     *
     * _Available since v3.4._
     */
    function getSupportedInterfaces(address account, bytes4[] memory interfaceIds)
        internal
        view
        returns (bool[] memory)
    {
        // an array of booleans corresponding to interfaceIds and whether they're supported or not
        bool[] memory interfaceIdsSupported = new bool[](interfaceIds.length);

        // query support of ERC165 itself
        if (supportsERC165(account)) {
            // query support of each interface in interfaceIds
            for (uint256 i = 0; i < interfaceIds.length; i++) {
                interfaceIdsSupported[i] = _supportsERC165Interface(account, interfaceIds[i]);
            }
        }

        return interfaceIdsSupported;
    }

    /**
     * @dev Returns true if `account` supports all the interfaces defined in
     * `interfaceIds`. Support for {IERC165} itself is queried automatically.
     *
     * Batch-querying can lead to gas savings by skipping repeated checks for
     * {IERC165} support.
     *
     * See {IERC165-supportsInterface}.
     */
    function supportsAllInterfaces(address account, bytes4[] memory interfaceIds) internal view returns (bool) {
        // query support of ERC165 itself
        if (!supportsERC165(account)) {
            return false;
        }

        // query support of each interface in _interfaceIds
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            if (!_supportsERC165Interface(account, interfaceIds[i])) {
                return false;
            }
        }

        // all interfaces supported
        return true;
    }

    /**
     * @notice Query if a contract implements an interface, does not check ERC165 support
     * @param account The address of the contract to query for support of an interface
     * @param interfaceId The interface identifier, as specified in ERC-165
     * @return true if the contract at account indicates support of the interface with
     * identifier interfaceId, false otherwise
     * @dev Assumes that account contains a contract that supports ERC165, otherwise
     * the behavior of this method is undefined. This precondition can be checked
     * with {supportsERC165}.
     * Interface identification is specified in ERC-165.
     */
    function _supportsERC165Interface(address account, bytes4 interfaceId) private view returns (bool) {
        // prepare call
        bytes memory encodedParams = abi.encodeWithSelector(IERC165.supportsInterface.selector, interfaceId);

        // perform static call
        bool success;
        uint256 returnSize;
        uint256 returnValue;
        assembly {
            success := staticcall(30000, account, add(encodedParams, 0x20), mload(encodedParams), 0x00, 0x20)
            returnSize := returndatasize()
            returnValue := mload(0x00)
        }

        return success && returnSize >= 0x20 && returnValue > 0;
    }
}

library Predeploys {
    /// @notice Number of predeploy-namespace addresses reserved for protocol usage.
    uint256 internal constant PREDEPLOY_COUNT = 2048;

    /// @custom:legacy
    /// @notice Address of the LegacyMessagePasser predeploy. Deprecate. Use the updated
    ///         L2ToL1MessagePasser contract instead.
    address internal constant LEGACY_MESSAGE_PASSER = 0x4200000000000000000000000000000000000000;

    /// @custom:legacy
    /// @notice Address of the L1MessageSender predeploy. Deprecated. Use L2CrossDomainMessenger
    ///         or access tx.origin (or msg.sender) in a L1 to L2 transaction instead.
    ///         Not embedded into new OP-Stack chains.
    address internal constant L1_MESSAGE_SENDER = 0x4200000000000000000000000000000000000001;

    /// @custom:legacy
    /// @notice Address of the DeployerWhitelist predeploy. No longer active.
    address internal constant DEPLOYER_WHITELIST = 0x4200000000000000000000000000000000000002;

    /// @notice Address of the canonical WETH contract.
    address internal constant WETH = 0x4200000000000000000000000000000000000006;

    /// @notice Address of the L2CrossDomainMessenger predeploy.
    address internal constant L2_CROSS_DOMAIN_MESSENGER = 0x4200000000000000000000000000000000000007;

    /// @notice Address of the GasPriceOracle predeploy. Includes fee information
    ///         and helpers for computing the L1 portion of the transaction fee.
    address internal constant GAS_PRICE_ORACLE = 0x420000000000000000000000000000000000000F;

    /// @notice Address of the L2StandardBridge predeploy.
    address internal constant L2_STANDARD_BRIDGE = 0x4200000000000000000000000000000000000010;

    //// @notice Address of the SequencerFeeWallet predeploy.
    address internal constant SEQUENCER_FEE_WALLET = 0x4200000000000000000000000000000000000011;

    /// @notice Address of the OptimismMintableERC20Factory predeploy.
    address internal constant OPTIMISM_MINTABLE_ERC20_FACTORY = 0x4200000000000000000000000000000000000012;

    /// @custom:legacy
    /// @notice Address of the L1BlockNumber predeploy. Deprecated. Use the L1Block predeploy
    ///         instead, which exposes more information about the L1 state.
    address internal constant L1_BLOCK_NUMBER = 0x4200000000000000000000000000000000000013;

    /// @notice Address of the L2ERC721Bridge predeploy.
    address internal constant L2_ERC721_BRIDGE = 0x4200000000000000000000000000000000000014;

    /// @notice Address of the L1Block predeploy.
    address internal constant L1_BLOCK_ATTRIBUTES = 0x4200000000000000000000000000000000000015;

    /// @notice Address of the L2ToL1MessagePasser predeploy.
    address internal constant L2_TO_L1_MESSAGE_PASSER = 0x4200000000000000000000000000000000000016;

    /// @notice Address of the OptimismMintableERC721Factory predeploy.
    address internal constant OPTIMISM_MINTABLE_ERC721_FACTORY = 0x4200000000000000000000000000000000000017;

    /// @notice Address of the ProxyAdmin predeploy.
    address internal constant PROXY_ADMIN = 0x4200000000000000000000000000000000000018;

    /// @notice Address of the BaseFeeVault predeploy.
    address internal constant BASE_FEE_VAULT = 0x4200000000000000000000000000000000000019;

    /// @notice Address of the L1FeeVault predeploy.
    address internal constant L1_FEE_VAULT = 0x420000000000000000000000000000000000001A;

    /// @notice Address of the SchemaRegistry predeploy.
    address internal constant SCHEMA_REGISTRY = 0x4200000000000000000000000000000000000020;

    /// @notice Address of the EAS predeploy.
    address internal constant EAS = 0x4200000000000000000000000000000000000021;

    /// @notice Address of the GovernanceToken predeploy.
    address internal constant GOVERNANCE_TOKEN = 0x4200000000000000000000000000000000000042;

    /// @custom:legacy
    /// @notice Address of the LegacyERC20ETH predeploy. Deprecated. Balances are migrated to the
    ///         state trie as of the Bedrock upgrade. Contract has been locked and write functions
    ///         can no longer be accessed.
    address internal constant LEGACY_ERC20_ETH = 0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000;

    /// @notice Address of the CrossL2Inbox predeploy.
    address internal constant CROSS_L2_INBOX = 0x4200000000000000000000000000000000000022;

    /// @notice Address of the L2ToL2CrossDomainMessenger predeploy.
    address internal constant L2_TO_L2_CROSS_DOMAIN_MESSENGER = 0x4200000000000000000000000000000000000023;

    /// @notice Address of the SuperchainWETH predeploy.
    address internal constant SUPERCHAIN_WETH = 0x4200000000000000000000000000000000000024;

    /// @notice Address of the ETHLiquidity predeploy.
    address internal constant ETH_LIQUIDITY = 0x4200000000000000000000000000000000000025;

    /// @notice Address of the OptimismSuperchainERC20Factory predeploy.
    address internal constant OPTIMISM_SUPERCHAIN_ERC20_FACTORY = 0x4200000000000000000000000000000000000026;

    /// @notice Address of the OptimismSuperchainERC20Beacon predeploy.
    address internal constant OPTIMISM_SUPERCHAIN_ERC20_BEACON = 0x4200000000000000000000000000000000000027;

    // TODO: Precalculate the address of the implementation contract
    /// @notice Arbitrary address of the OptimismSuperchainERC20 implementation contract.
    address internal constant OPTIMISM_SUPERCHAIN_ERC20 = 0xB9415c6cA93bdC545D4c5177512FCC22EFa38F28;

    /// @notice Returns the name of the predeploy at the given address.
    function getName(address _addr) internal pure returns (string memory out_) {
        require(isPredeployNamespace(_addr), "Predeploys: address must be a predeploy");
        if (_addr == LEGACY_MESSAGE_PASSER) return "LegacyMessagePasser";
        if (_addr == L1_MESSAGE_SENDER) return "L1MessageSender";
        if (_addr == DEPLOYER_WHITELIST) return "DeployerWhitelist";
        if (_addr == WETH) return "WETH";
        if (_addr == L2_CROSS_DOMAIN_MESSENGER) return "L2CrossDomainMessenger";
        if (_addr == GAS_PRICE_ORACLE) return "GasPriceOracle";
        if (_addr == L2_STANDARD_BRIDGE) return "L2StandardBridge";
        if (_addr == SEQUENCER_FEE_WALLET) return "SequencerFeeVault";
        if (_addr == OPTIMISM_MINTABLE_ERC20_FACTORY) return "OptimismMintableERC20Factory";
        if (_addr == L1_BLOCK_NUMBER) return "L1BlockNumber";
        if (_addr == L2_ERC721_BRIDGE) return "L2ERC721Bridge";
        if (_addr == L1_BLOCK_ATTRIBUTES) return "L1Block";
        if (_addr == L2_TO_L1_MESSAGE_PASSER) return "L2ToL1MessagePasser";
        if (_addr == OPTIMISM_MINTABLE_ERC721_FACTORY) return "OptimismMintableERC721Factory";
        if (_addr == PROXY_ADMIN) return "ProxyAdmin";
        if (_addr == BASE_FEE_VAULT) return "BaseFeeVault";
        if (_addr == L1_FEE_VAULT) return "L1FeeVault";
        if (_addr == SCHEMA_REGISTRY) return "SchemaRegistry";
        if (_addr == EAS) return "EAS";
        if (_addr == GOVERNANCE_TOKEN) return "GovernanceToken";
        if (_addr == LEGACY_ERC20_ETH) return "LegacyERC20ETH";
        if (_addr == CROSS_L2_INBOX) return "CrossL2Inbox";
        if (_addr == L2_TO_L2_CROSS_DOMAIN_MESSENGER) return "L2ToL2CrossDomainMessenger";
        if (_addr == SUPERCHAIN_WETH) return "SuperchainWETH";
        if (_addr == ETH_LIQUIDITY) return "ETHLiquidity";
        if (_addr == OPTIMISM_SUPERCHAIN_ERC20_FACTORY) return "OptimismSuperchainERC20Factory";
        if (_addr == OPTIMISM_SUPERCHAIN_ERC20_BEACON) return "OptimismSuperchainERC20Beacon";
        revert("Predeploys: unnamed predeploy");
    }

    /// @notice Returns true if the predeploy is not proxied.
    function notProxied(address _addr) internal pure returns (bool) {
        return _addr == GOVERNANCE_TOKEN || _addr == WETH;
    }

    /// @notice Returns true if the address is a defined predeploy that is embedded into new OP-Stack chains.
    function isSupportedPredeploy(address _addr, bool _useInterop) internal pure returns (bool) {
        return _addr == LEGACY_MESSAGE_PASSER || _addr == DEPLOYER_WHITELIST || _addr == WETH
            || _addr == L2_CROSS_DOMAIN_MESSENGER || _addr == GAS_PRICE_ORACLE || _addr == L2_STANDARD_BRIDGE
            || _addr == SEQUENCER_FEE_WALLET || _addr == OPTIMISM_MINTABLE_ERC20_FACTORY || _addr == L1_BLOCK_NUMBER
            || _addr == L2_ERC721_BRIDGE || _addr == L1_BLOCK_ATTRIBUTES || _addr == L2_TO_L1_MESSAGE_PASSER
            || _addr == OPTIMISM_MINTABLE_ERC721_FACTORY || _addr == PROXY_ADMIN || _addr == BASE_FEE_VAULT
            || _addr == L1_FEE_VAULT || _addr == SCHEMA_REGISTRY || _addr == EAS || _addr == GOVERNANCE_TOKEN
            || (_useInterop && _addr == CROSS_L2_INBOX) || (_useInterop && _addr == L2_TO_L2_CROSS_DOMAIN_MESSENGER)
            || (_useInterop && _addr == SUPERCHAIN_WETH) || (_useInterop && _addr == ETH_LIQUIDITY)
            || (_useInterop && _addr == OPTIMISM_SUPERCHAIN_ERC20_FACTORY)
            || (_useInterop && _addr == OPTIMISM_SUPERCHAIN_ERC20_BEACON);
    }

    function isPredeployNamespace(address _addr) internal pure returns (bool) {
        return uint160(_addr) >> 11 == uint160(0x4200000000000000000000000000000000000000) >> 11;
    }

    /// @notice Function to compute the expected address of the predeploy implementation
    ///         in the genesis state.
    function predeployToCodeNamespace(address _addr) internal pure returns (address) {
        require(
            isPredeployNamespace(_addr), "Predeploys: can only derive code-namespace address for predeploy addresses"
        );
        return address(
            uint160(uint256(uint160(_addr)) & 0xffff | uint256(uint160(0xc0D3C0d3C0d3C0D3c0d3C0d3c0D3C0d3c0d30000)))
        );
    }
}

interface ISemver {
    /// @notice Getter for the semantic version of the contract. This is not
    ///         meant to be used onchain but instead meant to be used by offchain
    ///         tooling.
    /// @return Semver contract version as a string.
    function version() external view returns (string memory);
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
            (isTopLevelCall && _initialized < 1) || (!Address.isContract(address(this)) && _initialized == 1),
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

abstract contract ERC721Bridge is Initializable {
    /// @custom:spacer ERC721Bridge's initializer slot spacing
    /// @notice Spacer to avoid packing into the initializer slot
    bytes30 private spacer_0_2_30;

    /// @notice Messenger contract on this domain.
    /// @custom:network-specific
    ICrossDomainMessenger public messenger;

    /// @notice Contract of the bridge on the other network.
    /// @custom:network-specific
    ERC721Bridge public otherBridge;

    /// @notice Reserve extra slots (to a total of 50) in the storage layout for future upgrades.
    uint256[46] private __gap;

    /// @notice Emitted when an ERC721 bridge to the other network is initiated.
    /// @param localToken  Address of the token on this domain.
    /// @param remoteToken Address of the token on the remote domain.
    /// @param from        Address that initiated bridging action.
    /// @param to          Address to receive the token.
    /// @param tokenId     ID of the specific token deposited.
    /// @param extraData   Extra data for use on the client-side.
    event ERC721BridgeInitiated(
        address indexed localToken,
        address indexed remoteToken,
        address indexed from,
        address to,
        uint256 tokenId,
        bytes extraData
    );

    /// @notice Emitted when an ERC721 bridge from the other network is finalized.
    /// @param localToken  Address of the token on this domain.
    /// @param remoteToken Address of the token on the remote domain.
    /// @param from        Address that initiated bridging action.
    /// @param to          Address to receive the token.
    /// @param tokenId     ID of the specific token deposited.
    /// @param extraData   Extra data for use on the client-side.
    event ERC721BridgeFinalized(
        address indexed localToken,
        address indexed remoteToken,
        address indexed from,
        address to,
        uint256 tokenId,
        bytes extraData
    );

    /// @notice Ensures that the caller is a cross-chain message from the other bridge.
    modifier onlyOtherBridge() {
        require(
            msg.sender == address(messenger) && messenger.xDomainMessageSender() == address(otherBridge),
            "ERC721Bridge: function can only be called from the other bridge"
        );
        _;
    }

    /// @notice Initializer.
    /// @param _messenger   Contract of the CrossDomainMessenger on this network.
    /// @param _otherBridge Contract of the ERC721 bridge on the other network.
    function __ERC721Bridge_init(
        ICrossDomainMessenger _messenger,
        ERC721Bridge _otherBridge
    )
        internal
        onlyInitializing
    {
        messenger = _messenger;
        otherBridge = _otherBridge;
    }

    /// @notice Legacy getter for messenger contract.
    ///         Public getter is legacy and will be removed in the future. Use `messenger` instead.
    /// @return Messenger contract on this domain.
    /// @custom:legacy
    function MESSENGER() external view returns (ICrossDomainMessenger) {
        return messenger;
    }

    /// @notice Legacy getter for other bridge address.
    ///         Public getter is legacy and will be removed in the future. Use `otherBridge` instead.
    /// @return Contract of the bridge on the other network.
    /// @custom:legacy
    function OTHER_BRIDGE() external view returns (ERC721Bridge) {
        return otherBridge;
    }

    /// @notice This function should return true if the contract is paused.
    ///         On L1 this function will check the SuperchainConfig for its paused status.
    ///         On L2 this function should be a no-op.
    /// @return Whether or not the contract is paused.
    function paused() public view virtual returns (bool) {
        return false;
    }

    /// @notice Initiates a bridge of an NFT to the caller's account on the other chain. Note that
    ///         this function can only be called by EOAs. Smart contract wallets should use the
    ///         `bridgeERC721To` function after ensuring that the recipient address on the remote
    ///         chain exists. Also note that the current owner of the token on this chain must
    ///         approve this contract to operate the NFT before it can be bridged.
    ///         **WARNING**: Do not bridge an ERC721 that was originally deployed on Optimism. This
    ///         bridge only supports ERC721s originally deployed on Ethereum. Users will need to
    ///         wait for the one-week challenge period to elapse before their Optimism-native NFT
    ///         can be refunded on L2.
    /// @param _localToken  Address of the ERC721 on this domain.
    /// @param _remoteToken Address of the ERC721 on the remote domain.
    /// @param _tokenId     Token ID to bridge.
    /// @param _minGasLimit Minimum gas limit for the bridge message on the other domain.
    /// @param _extraData   Optional data to forward to the other chain. Data supplied here will not
    ///                     be used to execute any code on the other chain and is only emitted as
    ///                     extra data for the convenience of off-chain tooling.
    function bridgeERC721(
        address _localToken,
        address _remoteToken,
        uint256 _tokenId,
        uint32 _minGasLimit,
        bytes calldata _extraData
    )
        external
    {
        // Modifier requiring sender to be EOA. This prevents against a user error that would occur
        // if the sender is a smart contract wallet that has a different address on the remote chain
        // (or doesn't have an address on the remote chain at all). The user would fail to receive
        // the NFT if they use this function because it sends the NFT to the same address as the
        // caller. This check could be bypassed by a malicious contract via initcode, but it takes
        // care of the user error we want to avoid.
        require(!Address.isContract(msg.sender), "ERC721Bridge: account is not externally owned");

        _initiateBridgeERC721(_localToken, _remoteToken, msg.sender, msg.sender, _tokenId, _minGasLimit, _extraData);
    }

    /// @notice Initiates a bridge of an NFT to some recipient's account on the other chain. Note
    ///         that the current owner of the token on this chain must approve this contract to
    ///         operate the NFT before it can be bridged.
    ///         **WARNING**: Do not bridge an ERC721 that was originally deployed on Optimism. This
    ///         bridge only supports ERC721s originally deployed on Ethereum. Users will need to
    ///         wait for the one-week challenge period to elapse before their Optimism-native NFT
    ///         can be refunded on L2.
    /// @param _localToken  Address of the ERC721 on this domain.
    /// @param _remoteToken Address of the ERC721 on the remote domain.
    /// @param _to          Address to receive the token on the other domain.
    /// @param _tokenId     Token ID to bridge.
    /// @param _minGasLimit Minimum gas limit for the bridge message on the other domain.
    /// @param _extraData   Optional data to forward to the other chain. Data supplied here will not
    ///                     be used to execute any code on the other chain and is only emitted as
    ///                     extra data for the convenience of off-chain tooling.
    function bridgeERC721To(
        address _localToken,
        address _remoteToken,
        address _to,
        uint256 _tokenId,
        uint32 _minGasLimit,
        bytes calldata _extraData
    )
        external
    {
        require(_to != address(0), "ERC721Bridge: nft recipient cannot be address(0)");

        _initiateBridgeERC721(_localToken, _remoteToken, msg.sender, _to, _tokenId, _minGasLimit, _extraData);
    }

    /// @notice Internal function for initiating a token bridge to the other domain.
    /// @param _localToken  Address of the ERC721 on this domain.
    /// @param _remoteToken Address of the ERC721 on the remote domain.
    /// @param _from        Address of the sender on this domain.
    /// @param _to          Address to receive the token on the other domain.
    /// @param _tokenId     Token ID to bridge.
    /// @param _minGasLimit Minimum gas limit for the bridge message on the other domain.
    /// @param _extraData   Optional data to forward to the other domain. Data supplied here will
    ///                     not be used to execute any code on the other domain and is only emitted
    ///                     as extra data for the convenience of off-chain tooling.
    function _initiateBridgeERC721(
        address _localToken,
        address _remoteToken,
        address _from,
        address _to,
        uint256 _tokenId,
        uint32 _minGasLimit,
        bytes calldata _extraData
    )
        internal
        virtual;
}

contract L2ERC721Bridge is ERC721Bridge, ISemver {
    /// @custom:semver 1.7.1-beta.2
    string public constant version = "1.7.1-beta.2";

    /// @notice Constructs the L2ERC721Bridge contract.
    constructor() ERC721Bridge() {
        initialize({ _l1ERC721Bridge: payable(address(0)) });
    }

    /// @notice Initializes the contract.
    /// @param _l1ERC721Bridge Address of the ERC721 bridge contract on the other network.
    function initialize(address payable _l1ERC721Bridge) public initializer {
        __ERC721Bridge_init({
            _messenger: ICrossDomainMessenger(Predeploys.L2_CROSS_DOMAIN_MESSENGER),
            _otherBridge: ERC721Bridge(_l1ERC721Bridge)
        });
    }

    /// @notice Completes an ERC721 bridge from the other domain and sends the ERC721 token to the
    ///         recipient on this domain.
    /// @param _localToken  Address of the ERC721 token on this domain.
    /// @param _remoteToken Address of the ERC721 token on the other domain.
    /// @param _from        Address that triggered the bridge on the other domain.
    /// @param _to          Address to receive the token on this domain.
    /// @param _tokenId     ID of the token being deposited.
    /// @param _extraData   Optional data to forward to L1.
    ///                     Data supplied here will not be used to execute any code on L1 and is
    ///                     only emitted as extra data for the convenience of off-chain tooling.
    function finalizeBridgeERC721(
        address _localToken,
        address _remoteToken,
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata _extraData
    )
        external
        onlyOtherBridge
    {
        require(_localToken != address(this), "L2ERC721Bridge: local token cannot be self");

        // Note that supportsInterface makes a callback to the _localToken address which is user
        // provided.
        require(
            ERC165Checker.supportsInterface(_localToken, type(IOptimismMintableERC721).interfaceId),
            "L2ERC721Bridge: local token interface is not compliant"
        );

        require(
            _remoteToken == IOptimismMintableERC721(_localToken).remoteToken(),
            "L2ERC721Bridge: wrong remote token for Optimism Mintable ERC721 local token"
        );

        // When a deposit is finalized, we give the NFT with the same tokenId to the account
        // on L2. Note that safeMint makes a callback to the _to address which is user provided.
        IOptimismMintableERC721(_localToken).safeMint(_to, _tokenId);

        // slither-disable-next-line reentrancy-events
        emit ERC721BridgeFinalized(_localToken, _remoteToken, _from, _to, _tokenId, _extraData);
    }

    /// @inheritdoc ERC721Bridge
    function _initiateBridgeERC721(
        address _localToken,
        address _remoteToken,
        address _from,
        address _to,
        uint256 _tokenId,
        uint32 _minGasLimit,
        bytes calldata _extraData
    )
        internal
        override
    {
        require(_remoteToken != address(0), "L2ERC721Bridge: remote token cannot be address(0)");

        // Check that the withdrawal is being initiated by the NFT owner
        require(
            _from == IOptimismMintableERC721(_localToken).ownerOf(_tokenId),
            "L2ERC721Bridge: Withdrawal is not being initiated by NFT owner"
        );

        // Construct calldata for l1ERC721Bridge.finalizeBridgeERC721(_to, _tokenId)
        // slither-disable-next-line reentrancy-events
        address remoteToken = IOptimismMintableERC721(_localToken).remoteToken();
        require(remoteToken == _remoteToken, "L2ERC721Bridge: remote token does not match given value");

        // When a withdrawal is initiated, we burn the withdrawer's NFT to prevent subsequent L2
        // usage
        // slither-disable-next-line reentrancy-events
        IOptimismMintableERC721(_localToken).burn(_from, _tokenId);

        bytes memory message = abi.encodeWithSelector(
            IL1ERC721Bridge.finalizeBridgeERC721.selector, remoteToken, _localToken, _from, _to, _tokenId, _extraData
        );

        // Send message to L1 bridge
        // slither-disable-next-line reentrancy-events
        messenger.sendMessage({ _target: address(otherBridge), _message: message, _minGasLimit: _minGasLimit });

        // slither-disable-next-line reentrancy-events
        emit ERC721BridgeInitiated(_localToken, remoteToken, _from, _to, _tokenId, _extraData);
    }
}