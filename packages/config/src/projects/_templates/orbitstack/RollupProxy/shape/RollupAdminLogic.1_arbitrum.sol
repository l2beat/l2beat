// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

interface IERC1822Proxiable {
    /**
     * @dev Returns the storage slot that the proxiable contract assumes is being used to store the implementation
     * address.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy.
     */
    function proxiableUUID() external view returns (bytes32);
}

abstract contract UUPSUpgradeable is IERC1822Proxiable, ERC1967Upgrade {
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable state-variable-assignment
    address private immutable __self = address(this);

    /**
     * @dev Check that the execution is being performed through a delegatecall call and that the execution context is
     * a proxy contract with an implementation (as defined in ERC1967) pointing to self. This should only be the case
     * for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a
     * function through ERC1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to
     * fail.
     */
    modifier onlyProxy() {
        require(address(this) != __self, "Function must be called through delegatecall");
        require(_getImplementation() == __self, "Function must be called through active proxy");
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        require(address(this) == __self, "UUPSUpgradeable: must not be called through delegatecall");
        _;
    }

    /**
     * @dev Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
     * implementation. It is used to validate that the this implementation remains valid after an upgrade.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.
     */
    function proxiableUUID() external view virtual override notDelegated returns (bytes32) {
        return _IMPLEMENTATION_SLOT;
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     */
    function upgradeTo(address newImplementation) external virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, new bytes(0), false);
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call
     * encoded in `data`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     */
    function upgradeToAndCall(address newImplementation, bytes memory data) external payable virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, data, true);
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
     * {upgradeTo} and {upgradeToAndCall}.
     *
     * Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
     *
     * ```solidity
     * function _authorizeUpgrade(address) internal override onlyOwner {}
     * ```
     */
    function _authorizeUpgrade(address newImplementation) internal virtual;
}

abstract contract ERC1967Upgrade {
    // This is the keccak-256 hash of "eip1967.proxy.rollback" subtracted by 1
    bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;

    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev Emitted when the implementation is upgraded.
     */
    event Upgraded(address indexed implementation);

    /**
     * @dev Returns the current implementation address.
     */
    function _getImplementation() internal view returns (address) {
        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 implementation slot.
     */
    function _setImplementation(address newImplementation) private {
        require(Address.isContract(newImplementation), "ERC1967: new implementation is not a contract");
        StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
    }

    /**
     * @dev Perform implementation upgrade
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeTo(address newImplementation) internal {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    /**
     * @dev Perform implementation upgrade with additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCall(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        _upgradeTo(newImplementation);
        if (data.length > 0 || forceCall) {
            Address.functionDelegateCall(newImplementation, data);
        }
    }

    /**
     * @dev Perform implementation upgrade with security checks for UUPS proxies, and additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCallUUPS(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        // Upgrades from old implementations will perform a rollback test. This test requires the new
        // implementation to upgrade back to the old, non-ERC1822 compliant, implementation. Removing
        // this special case will break upgrade paths from old UUPS implementation to new ones.
        if (StorageSlot.getBooleanSlot(_ROLLBACK_SLOT).value) {
            _setImplementation(newImplementation);
        } else {
            try IERC1822Proxiable(newImplementation).proxiableUUID() returns (bytes32 slot) {
                require(slot == _IMPLEMENTATION_SLOT, "ERC1967Upgrade: unsupported proxiableUUID");
            } catch {
                revert("ERC1967Upgrade: new implementation is not UUPS");
            }
            _upgradeToAndCall(newImplementation, data, forceCall);
        }
    }

    /**
     * @dev Storage slot with the admin of the contract.
     * This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    /**
     * @dev Emitted when the admin account has changed.
     */
    event AdminChanged(address previousAdmin, address newAdmin);

    /**
     * @dev Returns the current admin.
     */
    function _getAdmin() internal view returns (address) {
        return StorageSlot.getAddressSlot(_ADMIN_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 admin slot.
     */
    function _setAdmin(address newAdmin) private {
        require(newAdmin != address(0), "ERC1967: new admin is the zero address");
        StorageSlot.getAddressSlot(_ADMIN_SLOT).value = newAdmin;
    }

    /**
     * @dev Changes the admin of the proxy.
     *
     * Emits an {AdminChanged} event.
     */
    function _changeAdmin(address newAdmin) internal {
        emit AdminChanged(_getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    /**
     * @dev The storage slot of the UpgradeableBeacon contract which defines the implementation for this proxy.
     * This is bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1)) and is validated in the constructor.
     */
    bytes32 internal constant _BEACON_SLOT = 0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50;

    /**
     * @dev Emitted when the beacon is upgraded.
     */
    event BeaconUpgraded(address indexed beacon);

    /**
     * @dev Returns the current beacon.
     */
    function _getBeacon() internal view returns (address) {
        return StorageSlot.getAddressSlot(_BEACON_SLOT).value;
    }

    /**
     * @dev Stores a new beacon in the EIP1967 beacon slot.
     */
    function _setBeacon(address newBeacon) private {
        require(Address.isContract(newBeacon), "ERC1967: new beacon is not a contract");
        require(
            Address.isContract(IBeacon(newBeacon).implementation()),
            "ERC1967: beacon implementation is not a contract"
        );
        StorageSlot.getAddressSlot(_BEACON_SLOT).value = newBeacon;
    }

    /**
     * @dev Perform beacon upgrade with additional setup call. Note: This upgrades the address of the beacon, it does
     * not upgrade the implementation contained in the beacon (see {UpgradeableBeacon-_setImplementation} for that).
     *
     * Emits a {BeaconUpgraded} event.
     */
    function _upgradeBeaconToAndCall(
        address newBeacon,
        bytes memory data,
        bool forceCall
    ) internal {
        _setBeacon(newBeacon);
        emit BeaconUpgraded(newBeacon);
        if (data.length > 0 || forceCall) {
            Address.functionDelegateCall(IBeacon(newBeacon).implementation(), data);
        }
    }
}

library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        assembly {
            r.slot := slot
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

abstract contract DoubleLogicERC1967Upgrade is ERC1967Upgrade {
    // This is the keccak-256 hash of "eip1967.proxy.implementation.secondary" subtracted by 1
    bytes32 internal constant _IMPLEMENTATION_SECONDARY_SLOT =
        0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d;

    // This is the keccak-256 hash of "eip1967.proxy.rollback.secondary" subtracted by 1
    bytes32 private constant _ROLLBACK_SECONDARY_SLOT =
        0x49bd798cd84788856140a4cd5030756b4d08a9e4d55db725ec195f232d262a89;

    /**
     * @dev Emitted when the secondary implementation is upgraded.
     */
    event UpgradedSecondary(address indexed implementation);

    /**
     * @dev Returns the current secondary implementation address.
     */
    function _getSecondaryImplementation() internal view returns (address) {
        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SECONDARY_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 implementation slot.
     */
    function _setSecondaryImplementation(address newImplementation) private {
        require(
            Address.isContract(newImplementation),
            "ERC1967: new secondary implementation is not a contract"
        );
        StorageSlot.getAddressSlot(_IMPLEMENTATION_SECONDARY_SLOT).value = newImplementation;
    }

    /**
     * @dev Perform secondary implementation upgrade
     *
     * Emits an {UpgradedSecondary} event.
     */
    function _upgradeSecondaryTo(address newImplementation) internal {
        _setSecondaryImplementation(newImplementation);
        emit UpgradedSecondary(newImplementation);
    }

    /**
     * @dev Perform secondary implementation upgrade with additional setup call.
     *
     * Emits an {UpgradedSecondary} event.
     */
    function _upgradeSecondaryToAndCall(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        _upgradeSecondaryTo(newImplementation);
        if (data.length > 0 || forceCall) {
            Address.functionDelegateCall(newImplementation, data);
        }
    }

    /**
     * @dev Perform secondary implementation upgrade with security checks for UUPS proxies, and additional setup call.
     *
     * Emits an {UpgradedSecondary} event.
     */
    function _upgradeSecondaryToAndCallUUPS(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        // Upgrades from old implementations will perform a rollback test. This test requires the new
        // implementation to upgrade back to the old, non-ERC1822 compliant, implementation. Removing
        // this special case will break upgrade paths from old UUPS implementation to new ones.
        if (StorageSlot.getBooleanSlot(_ROLLBACK_SECONDARY_SLOT).value) {
            _setSecondaryImplementation(newImplementation);
        } else {
            try IERC1822Proxiable(newImplementation).proxiableUUID() returns (bytes32 slot) {
                require(
                    slot == _IMPLEMENTATION_SECONDARY_SLOT,
                    "ERC1967Upgrade: unsupported secondary proxiableUUID"
                );
            } catch {
                revert("ERC1967Upgrade: new secondary implementation is not UUPS");
            }
            _upgradeSecondaryToAndCall(newImplementation, data, forceCall);
        }
    }
}

abstract contract DoubleLogicUUPSUpgradeable is UUPSUpgradeable, DoubleLogicERC1967Upgrade {
    /// @inheritdoc UUPSUpgradeable
    function proxiableUUID() external view override notDelegated returns (bytes32) {
        return _IMPLEMENTATION_SLOT;
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the secondary contract. Called by
     * {upgradeSecondaryTo} and {upgradeSecondaryToAndCall}.
     *
     * Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
     *
     * ```solidity
     * function _authorizeSecondaryUpgrade(address) internal override onlyOwner {}
     * ```
     */
    function _authorizeSecondaryUpgrade(address newImplementation) internal virtual;

    /**
     * @dev Upgrade the secondary implementation of the proxy to `newImplementation`.
     *
     * Calls {_authorizeSecondaryUpgrade}.
     *
     * Emits an {UpgradedSecondary} event.
     */
    function upgradeSecondaryTo(address newImplementation) external onlyProxy {
        _authorizeSecondaryUpgrade(newImplementation);
        _upgradeSecondaryToAndCallUUPS(newImplementation, new bytes(0), false);
    }

    /**
     * @dev Upgrade the secondary implementation of the proxy to `newImplementation`, and subsequently execute the function call
     * encoded in `data`.
     *
     * Calls {_authorizeSecondaryUpgrade}.
     *
     * Emits an {UpgradedSecondary} event.
     */
    function upgradeSecondaryToAndCall(address newImplementation, bytes memory data)
        external
        payable
        onlyProxy
    {
        _authorizeSecondaryUpgrade(newImplementation);
        _upgradeSecondaryToAndCallUUPS(newImplementation, data, true);
    }
}

struct Config {
    uint64 confirmPeriodBlocks;
    uint64 extraChallengeTimeBlocks;
    address stakeToken;
    uint256 baseStake;
    bytes32 wasmModuleRoot;
    address owner;
    address loserStakeEscrow;
    uint256 chainId;
    uint64 genesisBlockNum;
    ISequencerInbox.MaxTimeVariation sequencerInboxMaxTimeVariation;
}

struct ContractDependencies {
    IBridge bridge;
    ISequencerInbox sequencerInbox;
    IInbox inbox;
    IOutbox outbox;
    IRollupEventInbox rollupEventInbox;
    IChallengeManager challengeManager;
    IRollupAdmin rollupAdminLogic;
    IRollupUser rollupUserLogic;
    // misc contracts that are useful when interacting with the rollup
    address validatorUtils;
    address validatorWalletCreator;
}

interface IRollupAdmin {
    event OwnerFunctionCalled(uint256 indexed id);

    function initialize(Config calldata config, ContractDependencies calldata connectedContracts)
        external;

    /**
     * @notice Add a contract authorized to put messages into this rollup's inbox
     * @param _outbox Outbox contract to add
     */
    function setOutbox(IOutbox _outbox) external;

    /**
     * @notice Disable an old outbox from interacting with the bridge
     * @param _outbox Outbox contract to remove
     */
    function removeOldOutbox(address _outbox) external;

    /**
     * @notice Enable or disable an inbox contract
     * @param _inbox Inbox contract to add or remove
     * @param _enabled New status of inbox
     */
    function setDelayedInbox(address _inbox, bool _enabled) external;

    /**
     * @notice Pause interaction with the rollup contract
     */
    function pause() external;

    /**
     * @notice Resume interaction with the rollup contract
     */
    function resume() external;

    /**
     * @notice Set the addresses of the validator whitelist
     * @dev It is expected that both arrays are same length, and validator at
     * position i corresponds to the value at position i
     * @param _validator addresses to set in the whitelist
     * @param _val value to set in the whitelist for corresponding address
     */
    function setValidator(address[] memory _validator, bool[] memory _val) external;

    /**
     * @notice Set a new owner address for the rollup proxy
     * @param newOwner address of new rollup owner
     */
    function setOwner(address newOwner) external;

    /**
     * @notice Set minimum assertion period for the rollup
     * @param newPeriod new minimum period for assertions
     */
    function setMinimumAssertionPeriod(uint256 newPeriod) external;

    /**
     * @notice Set number of blocks until a node is considered confirmed
     * @param newConfirmPeriod new number of blocks until a node is confirmed
     */
    function setConfirmPeriodBlocks(uint64 newConfirmPeriod) external;

    /**
     * @notice Set number of extra blocks after a challenge
     * @param newExtraTimeBlocks new number of blocks
     */
    function setExtraChallengeTimeBlocks(uint64 newExtraTimeBlocks) external;

    /**
     * @notice Set base stake required for an assertion
     * @param newBaseStake maximum avmgas to be used per block
     */
    function setBaseStake(uint256 newBaseStake) external;

    /**
     * @notice Set the token used for stake, where address(0) == eth
     * @dev Before changing the base stake token, you might need to change the
     * implementation of the Rollup User logic!
     * @param newStakeToken address of token used for staking
     */
    function setStakeToken(address newStakeToken) external;

    /**
     * @notice Upgrades the implementation of a beacon controlled by the rollup
     * @param beacon address of beacon to be upgraded
     * @param newImplementation new address of implementation
     */
    function upgradeBeacon(address beacon, address newImplementation) external;

    function forceResolveChallenge(address[] memory stackerA, address[] memory stackerB) external;

    function forceRefundStaker(address[] memory stacker) external;

    function forceCreateNode(
        uint64 prevNode,
        uint256 prevNodeInboxMaxCount,
        RollupLib.Assertion memory assertion,
        bytes32 expectedNodeHash
    ) external;

    function forceConfirmNode(
        uint64 nodeNum,
        bytes32 blockHash,
        bytes32 sendRoot
    ) external;

    function setLoserStakeEscrow(address newLoserStakerEscrow) external;

    /**
     * @notice Set the proving WASM module root
     * @param newWasmModuleRoot new module root
     */
    function setWasmModuleRoot(bytes32 newWasmModuleRoot) external;

    /**
     * @notice set a new sequencer inbox contract
     * @param _sequencerInbox new address of sequencer inbox
     */
    function setSequencerInbox(address _sequencerInbox) external;

    /**
     * @notice set the validatorWhitelistDisabled flag
     * @param _validatorWhitelistDisabled new value of validatorWhitelistDisabled, i.e. true = disabled
     */
    function setValidatorWhitelistDisabled(bool _validatorWhitelistDisabled) external;
}

interface IRollupCore {
    struct Staker {
        uint256 amountStaked;
        uint64 index;
        uint64 latestStakedNode;
        // currentChallenge is 0 if staker is not in a challenge
        uint64 currentChallenge;
        bool isStaked;
    }

    event RollupInitialized(bytes32 machineHash, uint256 chainId);

    event NodeCreated(
        uint64 indexed nodeNum,
        bytes32 indexed parentNodeHash,
        bytes32 indexed nodeHash,
        bytes32 executionHash,
        RollupLib.Assertion assertion,
        bytes32 afterInboxBatchAcc,
        bytes32 wasmModuleRoot,
        uint256 inboxMaxCount
    );

    event NodeConfirmed(uint64 indexed nodeNum, bytes32 blockHash, bytes32 sendRoot);

    event NodeRejected(uint64 indexed nodeNum);

    event RollupChallengeStarted(
        uint64 indexed challengeIndex,
        address asserter,
        address challenger,
        uint64 challengedNode
    );

    event UserStakeUpdated(address indexed user, uint256 initialBalance, uint256 finalBalance);

    event UserWithdrawableFundsUpdated(
        address indexed user,
        uint256 initialBalance,
        uint256 finalBalance
    );

    function confirmPeriodBlocks() external view returns (uint64);

    function extraChallengeTimeBlocks() external view returns (uint64);

    function chainId() external view returns (uint256);

    function baseStake() external view returns (uint256);

    function wasmModuleRoot() external view returns (bytes32);

    function bridge() external view returns (IBridge);

    function sequencerInbox() external view returns (ISequencerInbox);

    function outbox() external view returns (IOutbox);

    function rollupEventInbox() external view returns (IRollupEventInbox);

    function challengeManager() external view returns (IChallengeManager);

    function loserStakeEscrow() external view returns (address);

    function stakeToken() external view returns (address);

    function minimumAssertionPeriod() external view returns (uint256);

    function isValidator(address) external view returns (bool);

    function validatorWhitelistDisabled() external view returns (bool);

    /**
     * @notice Get the Node for the given index.
     */
    function getNode(uint64 nodeNum) external view returns (Node memory);

    /**
     * @notice Check if the specified node has been staked on by the provided staker.
     * Only accurate at the latest confirmed node and afterwards.
     */
    function nodeHasStaker(uint64 nodeNum, address staker) external view returns (bool);

    /**
     * @notice Get the address of the staker at the given index
     * @param stakerNum Index of the staker
     * @return Address of the staker
     */
    function getStakerAddress(uint64 stakerNum) external view returns (address);

    /**
     * @notice Check whether the given staker is staked
     * @param staker Staker address to check
     * @return True or False for whether the staker was staked
     */
    function isStaked(address staker) external view returns (bool);

    /**
     * @notice Get the latest staked node of the given staker
     * @param staker Staker address to lookup
     * @return Latest node staked of the staker
     */
    function latestStakedNode(address staker) external view returns (uint64);

    /**
     * @notice Get the current challenge of the given staker
     * @param staker Staker address to lookup
     * @return Current challenge of the staker
     */
    function currentChallenge(address staker) external view returns (uint64);

    /**
     * @notice Get the amount staked of the given staker
     * @param staker Staker address to lookup
     * @return Amount staked of the staker
     */
    function amountStaked(address staker) external view returns (uint256);

    /**
     * @notice Retrieves stored information about a requested staker
     * @param staker Staker address to retrieve
     * @return A structure with information about the requested staker
     */
    function getStaker(address staker) external view returns (Staker memory);

    /**
     * @notice Get the original staker address of the zombie at the given index
     * @param zombieNum Index of the zombie to lookup
     * @return Original staker address of the zombie
     */
    function zombieAddress(uint256 zombieNum) external view returns (address);

    /**
     * @notice Get Latest node that the given zombie at the given index is staked on
     * @param zombieNum Index of the zombie to lookup
     * @return Latest node that the given zombie is staked on
     */
    function zombieLatestStakedNode(uint256 zombieNum) external view returns (uint64);

    /// @return Current number of un-removed zombies
    function zombieCount() external view returns (uint256);

    function isZombie(address staker) external view returns (bool);

    /**
     * @notice Get the amount of funds withdrawable by the given address
     * @param owner Address to check the funds of
     * @return Amount of funds withdrawable by owner
     */
    function withdrawableFunds(address owner) external view returns (uint256);

    /**
     * @return Index of the first unresolved node
     * @dev If all nodes have been resolved, this will be latestNodeCreated + 1
     */
    function firstUnresolvedNode() external view returns (uint64);

    /// @return Index of the latest confirmed node
    function latestConfirmed() external view returns (uint64);

    /// @return Index of the latest rollup node created
    function latestNodeCreated() external view returns (uint64);

    /// @return Ethereum block that the most recent stake was created
    function lastStakeBlock() external view returns (uint64);

    /// @return Number of active stakers currently staked
    function stakerCount() external view returns (uint64);
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
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
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
        require(paused(), "Pausable: not paused");
        _;
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

struct Node {
    // Hash of the state of the chain as of this node
    bytes32 stateHash;
    // Hash of the data that can be challenged
    bytes32 challengeHash;
    // Hash of the data that will be committed if this node is confirmed
    bytes32 confirmData;
    // Index of the node previous to this one
    uint64 prevNum;
    // Deadline at which this node can be confirmed
    uint64 deadlineBlock;
    // Deadline at which a child of this node can be confirmed
    uint64 noChildConfirmedBeforeBlock;
    // Number of stakers staked on this node. This includes real stakers and zombies
    uint64 stakerCount;
    // Number of stakers staked on a child node. This includes real stakers and zombies
    uint64 childStakerCount;
    // This value starts at zero and is set to a value when the first child is created. After that it is constant until the node is destroyed or the owner destroys pending nodes
    uint64 firstChildBlock;
    // The number of the latest child of this node to be created
    uint64 latestChildNumber;
    // The block number when this node was created
    uint64 createdAtBlock;
    // A hash of all the data needed to determine this node's validity, to protect against reorgs
    bytes32 nodeHash;
}

library NodeLib {
    /**
     * @notice Initialize a Node
     * @param _stateHash Initial value of stateHash
     * @param _challengeHash Initial value of challengeHash
     * @param _confirmData Initial value of confirmData
     * @param _prevNum Initial value of prevNum
     * @param _deadlineBlock Initial value of deadlineBlock
     * @param _nodeHash Initial value of nodeHash
     */
    function createNode(
        bytes32 _stateHash,
        bytes32 _challengeHash,
        bytes32 _confirmData,
        uint64 _prevNum,
        uint64 _deadlineBlock,
        bytes32 _nodeHash
    ) internal view returns (Node memory) {
        Node memory node;
        node.stateHash = _stateHash;
        node.challengeHash = _challengeHash;
        node.confirmData = _confirmData;
        node.prevNum = _prevNum;
        node.deadlineBlock = _deadlineBlock;
        node.noChildConfirmedBeforeBlock = _deadlineBlock;
        node.createdAtBlock = uint64(block.number);
        node.nodeHash = _nodeHash;
        return node;
    }

    /**
     * @notice Update child properties
     * @param number The child number to set
     */
    function childCreated(Node storage self, uint64 number) internal {
        if (self.firstChildBlock == 0) {
            self.firstChildBlock = uint64(block.number);
        }
        self.latestChildNumber = number;
    }

    /**
     * @notice Update the child confirmed deadline
     * @param deadline The new deadline to set
     */
    function newChildConfirmDeadline(Node storage self, uint64 deadline) internal {
        self.noChildConfirmedBeforeBlock = deadline;
    }

    /**
     * @notice Check whether the current block number has met or passed the node's deadline
     */
    function requirePastDeadline(Node memory self) internal view {
        require(block.number >= self.deadlineBlock, "BEFORE_DEADLINE");
    }

    /**
     * @notice Check whether the current block number has met or passed deadline for children of this node to be confirmed
     */
    function requirePastChildConfirmDeadline(Node memory self) internal view {
        require(block.number >= self.noChildConfirmedBeforeBlock, "CHILD_TOO_RECENT");
    }
}

struct GlobalState {
    bytes32[2] bytes32Vals;
    uint64[2] u64Vals;
}

library GlobalStateLib {
    uint16 internal constant BYTES32_VALS_NUM = 2;
    uint16 internal constant U64_VALS_NUM = 2;

    function hash(GlobalState memory state) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Global state:",
                    state.bytes32Vals[0],
                    state.bytes32Vals[1],
                    state.u64Vals[0],
                    state.u64Vals[1]
                )
            );
    }

    function getBlockHash(GlobalState memory state) internal pure returns (bytes32) {
        return state.bytes32Vals[0];
    }

    function getSendRoot(GlobalState memory state) internal pure returns (bytes32) {
        return state.bytes32Vals[1];
    }

    function getInboxPosition(GlobalState memory state) internal pure returns (uint64) {
        return state.u64Vals[0];
    }

    function getPositionInMessage(GlobalState memory state) internal pure returns (uint64) {
        return state.u64Vals[1];
    }

    function isEmpty(GlobalState calldata state) internal pure returns (bool) {
        return (state.bytes32Vals[0] == bytes32(0) &&
            state.bytes32Vals[1] == bytes32(0) &&
            state.u64Vals[0] == 0 &&
            state.u64Vals[1] == 0);
    }
}

library StackFrameLib {
    using ValueLib for Value;

    function hash(StackFrame memory frame) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Stack frame:",
                    frame.returnPc.hash(),
                    frame.localsMerkleRoot,
                    frame.callerModule,
                    frame.callerModuleInternals
                )
            );
    }

    function hash(StackFrameWindow memory window) internal pure returns (bytes32 h) {
        h = window.remainingHash;
        for (uint256 i = 0; i < window.proved.length; i++) {
            h = keccak256(abi.encodePacked("Stack frame stack:", hash(window.proved[i]), h));
        }
    }

    function peek(StackFrameWindow memory window) internal pure returns (StackFrame memory) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        return window.proved[0];
    }

    function pop(StackFrameWindow memory window) internal pure returns (StackFrame memory frame) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        frame = window.proved[0];
        window.proved = new StackFrame[](0);
    }

    function push(StackFrameWindow memory window, StackFrame memory frame) internal pure {
        StackFrame[] memory newProved = new StackFrame[](window.proved.length + 1);
        for (uint256 i = 0; i < window.proved.length; i++) {
            newProved[i] = window.proved[i];
        }
        newProved[window.proved.length] = frame;
        window.proved = newProved;
    }
}

library ValueArrayLib {
    function get(ValueArray memory arr, uint256 index) internal pure returns (Value memory) {
        return arr.inner[index];
    }

    function set(
        ValueArray memory arr,
        uint256 index,
        Value memory val
    ) internal pure {
        arr.inner[index] = val;
    }

    function length(ValueArray memory arr) internal pure returns (uint256) {
        return arr.inner.length;
    }

    function push(ValueArray memory arr, Value memory val) internal pure {
        Value[] memory newInner = new Value[](arr.inner.length + 1);
        for (uint256 i = 0; i < arr.inner.length; i++) {
            newInner[i] = arr.inner[i];
        }
        newInner[arr.inner.length] = val;
        arr.inner = newInner;
    }

    function pop(ValueArray memory arr) internal pure returns (Value memory popped) {
        popped = arr.inner[arr.inner.length - 1];
        Value[] memory newInner = new Value[](arr.inner.length - 1);
        for (uint256 i = 0; i < newInner.length; i++) {
            newInner[i] = arr.inner[i];
        }
        arr.inner = newInner;
    }
}

library ValueStackLib {
    using ValueLib for Value;
    using ValueArrayLib for ValueArray;

    function hash(ValueStack memory stack) internal pure returns (bytes32 h) {
        h = stack.remainingHash;
        uint256 len = stack.proved.length();
        for (uint256 i = 0; i < len; i++) {
            h = keccak256(abi.encodePacked("Value stack:", stack.proved.get(i).hash(), h));
        }
    }

    function peek(ValueStack memory stack) internal pure returns (Value memory) {
        uint256 len = stack.proved.length();
        return stack.proved.get(len - 1);
    }

    function pop(ValueStack memory stack) internal pure returns (Value memory) {
        return stack.proved.pop();
    }

    function push(ValueStack memory stack, Value memory val) internal pure {
        return stack.proved.push(val);
    }
}

struct Machine {
    MachineStatus status;
    ValueStack valueStack;
    ValueStack internalStack;
    StackFrameWindow frameStack;
    bytes32 globalStateHash;
    uint32 moduleIdx;
    uint32 functionIdx;
    uint32 functionPc;
    bytes32 modulesRoot;
}

library MachineLib {
    using StackFrameLib for StackFrameWindow;
    using ValueStackLib for ValueStack;

    function hash(Machine memory mach) internal pure returns (bytes32) {
        // Warning: the non-running hashes are replicated in Challenge
        if (mach.status == MachineStatus.RUNNING) {
            return
                keccak256(
                    abi.encodePacked(
                        "Machine running:",
                        mach.valueStack.hash(),
                        mach.internalStack.hash(),
                        mach.frameStack.hash(),
                        mach.globalStateHash,
                        mach.moduleIdx,
                        mach.functionIdx,
                        mach.functionPc,
                        mach.modulesRoot
                    )
                );
        } else if (mach.status == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Machine finished:", mach.globalStateHash));
        } else if (mach.status == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Machine errored:"));
        } else if (mach.status == MachineStatus.TOO_FAR) {
            return keccak256(abi.encodePacked("Machine too far:"));
        } else {
            revert("BAD_MACH_STATUS");
        }
    }
}

library ValueLib {
    function hash(Value memory val) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("Value:", val.valueType, val.contents));
    }

    function maxValueType() internal pure returns (ValueType) {
        return ValueType.INTERNAL_REF;
    }

    function assumeI32(Value memory val) internal pure returns (uint32) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I32, "NOT_I32");
        require(uintval < (1 << 32), "BAD_I32");
        return uint32(uintval);
    }

    function assumeI64(Value memory val) internal pure returns (uint64) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I64, "NOT_I64");
        require(uintval < (1 << 64), "BAD_I64");
        return uint64(uintval);
    }

    function newRefNull() internal pure returns (Value memory) {
        return Value({valueType: ValueType.REF_NULL, contents: 0});
    }

    function newI32(uint32 x) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I32, contents: uint256(x)});
    }

    function newI64(uint64 x) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I64, contents: uint256(x)});
    }

    function newBoolean(bool x) internal pure returns (Value memory) {
        if (x) {
            return newI32(uint32(1));
        } else {
            return newI32(uint32(0));
        }
    }
}

struct ValueArray {
    Value[] inner;
}

struct ValueStack {
    ValueArray proved;
    bytes32 remainingHash;
}

enum ValueType {
    I32,
    I64,
    F32,
    F64,
    REF_NULL,
    FUNC_REF,
    INTERNAL_REF
}

struct Value {
    ValueType valueType;
    uint256 contents;
}

struct StackFrame {
    Value returnPc;
    bytes32 localsMerkleRoot;
    uint32 callerModule;
    uint32 callerModuleInternals;
}

struct StackFrameWindow {
    StackFrame[] proved;
    bytes32 remainingHash;
}

library ChallengeLib {
    using MachineLib for Machine;
    using ChallengeLib for Challenge;

    /// @dev It's assumed that that uninitialzed challenges have mode NONE
    enum ChallengeMode {
        NONE,
        BLOCK,
        EXECUTION
    }

    struct Participant {
        address addr;
        uint256 timeLeft;
    }

    struct Challenge {
        Participant current;
        Participant next;
        uint256 lastMoveTimestamp;
        bytes32 wasmModuleRoot;
        bytes32 challengeStateHash;
        uint64 maxInboxMessages;
        ChallengeMode mode;
    }

    struct SegmentSelection {
        uint256 oldSegmentsStart;
        uint256 oldSegmentsLength;
        bytes32[] oldSegments;
        uint256 challengePosition;
    }

    function timeUsedSinceLastMove(Challenge storage challenge) internal view returns (uint256) {
        return block.timestamp - challenge.lastMoveTimestamp;
    }

    function isTimedOut(Challenge storage challenge) internal view returns (bool) {
        return challenge.timeUsedSinceLastMove() > challenge.current.timeLeft;
    }

    function getStartMachineHash(bytes32 globalStateHash, bytes32 wasmModuleRoot)
        internal
        pure
        returns (bytes32)
    {
        // Start the value stack with the function call ABI for the entrypoint
        Value[] memory startingValues = new Value[](3);
        startingValues[0] = ValueLib.newRefNull();
        startingValues[1] = ValueLib.newI32(0);
        startingValues[2] = ValueLib.newI32(0);
        ValueArray memory valuesArray = ValueArray({inner: startingValues});
        ValueStack memory values = ValueStack({proved: valuesArray, remainingHash: 0});
        ValueStack memory internalStack;
        StackFrameWindow memory frameStack;

        Machine memory mach = Machine({
            status: MachineStatus.RUNNING,
            valueStack: values,
            internalStack: internalStack,
            frameStack: frameStack,
            globalStateHash: globalStateHash,
            moduleIdx: 0,
            functionIdx: 0,
            functionPc: 0,
            modulesRoot: wasmModuleRoot
        });
        return mach.hash();
    }

    function getEndMachineHash(MachineStatus status, bytes32 globalStateHash)
        internal
        pure
        returns (bytes32)
    {
        if (status == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Machine finished:", globalStateHash));
        } else if (status == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Machine errored:"));
        } else if (status == MachineStatus.TOO_FAR) {
            return keccak256(abi.encodePacked("Machine too far:"));
        } else {
            revert("BAD_BLOCK_STATUS");
        }
    }

    function extractChallengeSegment(SegmentSelection calldata selection)
        internal
        pure
        returns (uint256 segmentStart, uint256 segmentLength)
    {
        uint256 oldChallengeDegree = selection.oldSegments.length - 1;
        segmentLength = selection.oldSegmentsLength / oldChallengeDegree;
        // Intentionally done before challengeLength is potentially added to for the final segment
        segmentStart = selection.oldSegmentsStart + segmentLength * selection.challengePosition;
        if (selection.challengePosition == selection.oldSegments.length - 2) {
            segmentLength += selection.oldSegmentsLength % oldChallengeDegree;
        }
    }

    function hashChallengeState(
        uint256 segmentsStart,
        uint256 segmentsLength,
        bytes32[] memory segments
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(segmentsStart, segmentsLength, segments));
    }

    function blockStateHash(MachineStatus status, bytes32 globalStateHash)
        internal
        pure
        returns (bytes32)
    {
        if (status == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Block state:", globalStateHash));
        } else if (status == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Block state, errored:", globalStateHash));
        } else if (status == MachineStatus.TOO_FAR) {
            return keccak256(abi.encodePacked("Block state, too far:"));
        } else {
            revert("BAD_BLOCK_STATUS");
        }
    }
}

library RollupLib {
    using GlobalStateLib for GlobalState;

    struct ExecutionState {
        GlobalState globalState;
        MachineStatus machineStatus;
    }

    function stateHash(ExecutionState calldata execState, uint256 inboxMaxCount)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    execState.globalState.hash(),
                    inboxMaxCount,
                    execState.machineStatus
                )
            );
    }

    /// @dev same as stateHash but expects execState in memory instead of calldata
    function stateHashMem(ExecutionState memory execState, uint256 inboxMaxCount)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    execState.globalState.hash(),
                    inboxMaxCount,
                    execState.machineStatus
                )
            );
    }

    struct Assertion {
        ExecutionState beforeState;
        ExecutionState afterState;
        uint64 numBlocks;
    }

    function executionHash(Assertion memory assertion) internal pure returns (bytes32) {
        MachineStatus[2] memory statuses;
        statuses[0] = assertion.beforeState.machineStatus;
        statuses[1] = assertion.afterState.machineStatus;
        GlobalState[2] memory globalStates;
        globalStates[0] = assertion.beforeState.globalState;
        globalStates[1] = assertion.afterState.globalState;
        // TODO: benchmark how much this abstraction adds of gas overhead
        return executionHash(statuses, globalStates, assertion.numBlocks);
    }

    function executionHash(
        MachineStatus[2] memory statuses,
        GlobalState[2] memory globalStates,
        uint64 numBlocks
    ) internal pure returns (bytes32) {
        bytes32[] memory segments = new bytes32[](2);
        segments[0] = ChallengeLib.blockStateHash(statuses[0], globalStates[0].hash());
        segments[1] = ChallengeLib.blockStateHash(statuses[1], globalStates[1].hash());
        return ChallengeLib.hashChallengeState(0, numBlocks, segments);
    }

    function challengeRootHash(
        bytes32 execution,
        uint256 proposedTime,
        bytes32 wasmModuleRoot
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(execution, proposedTime, wasmModuleRoot));
    }

    function confirmHash(Assertion memory assertion) internal pure returns (bytes32) {
        return
            confirmHash(
                assertion.afterState.globalState.getBlockHash(),
                assertion.afterState.globalState.getSendRoot()
            );
    }

    function confirmHash(bytes32 blockHash, bytes32 sendRoot) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(blockHash, sendRoot));
    }

    function nodeHash(
        bool hasSibling,
        bytes32 lastHash,
        bytes32 assertionExecHash,
        bytes32 inboxAcc,
        bytes32 wasmModuleRoot
    ) internal pure returns (bytes32) {
        uint8 hasSiblingInt = hasSibling ? 1 : 0;
        return
            keccak256(
                abi.encodePacked(
                    hasSiblingInt,
                    lastHash,
                    assertionExecHash,
                    inboxAcc,
                    wasmModuleRoot
                )
            );
    }
}

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED,
    TOO_FAR
}

abstract contract RollupCore is IRollupCore, PausableUpgradeable {
    using NodeLib for Node;
    using GlobalStateLib for GlobalState;

    // Rollup Config
    uint64 public confirmPeriodBlocks;
    uint64 public extraChallengeTimeBlocks;
    uint256 public chainId;
    uint256 public baseStake;
    bytes32 public wasmModuleRoot;

    IInbox public inbox;
    IBridge public bridge;
    IOutbox public outbox;
    ISequencerInbox public sequencerInbox;
    IRollupEventInbox public rollupEventInbox;
    IChallengeManager public override challengeManager;

    // misc useful contracts when interacting with the rollup
    address public validatorUtils;
    address public validatorWalletCreator;

    // when a staker loses a challenge, half of their funds get escrowed in this address
    address public loserStakeEscrow;
    address public stakeToken;
    uint256 public minimumAssertionPeriod;

    mapping(address => bool) public isValidator;

    // Stakers become Zombies after losing a challenge
    struct Zombie {
        address stakerAddress;
        uint64 latestStakedNode;
    }

    uint64 private _latestConfirmed;
    uint64 private _firstUnresolvedNode;
    uint64 private _latestNodeCreated;
    uint64 private _lastStakeBlock;
    mapping(uint64 => Node) private _nodes;
    mapping(uint64 => mapping(address => bool)) private _nodeStakers;

    address[] private _stakerList;
    mapping(address => Staker) public _stakerMap;

    Zombie[] private _zombies;

    mapping(address => uint256) private _withdrawableFunds;
    uint256 public totalWithdrawableFunds;
    uint256 public rollupDeploymentBlock;

    // The node number of the initial node
    uint64 internal constant GENESIS_NODE = 0;

    bool public validatorWhitelistDisabled;

    /**
     * @notice Get a storage reference to the Node for the given node index
     * @param nodeNum Index of the node
     * @return Node struct
     */
    function getNodeStorage(uint64 nodeNum) internal view returns (Node storage) {
        return _nodes[nodeNum];
    }

    /**
     * @notice Get the Node for the given index.
     */
    function getNode(uint64 nodeNum) public view override returns (Node memory) {
        return getNodeStorage(nodeNum);
    }

    /**
     * @notice Check if the specified node has been staked on by the provided staker.
     * Only accurate at the latest confirmed node and afterwards.
     */
    function nodeHasStaker(uint64 nodeNum, address staker) public view override returns (bool) {
        return _nodeStakers[nodeNum][staker];
    }

    /**
     * @notice Get the address of the staker at the given index
     * @param stakerNum Index of the staker
     * @return Address of the staker
     */
    function getStakerAddress(uint64 stakerNum) external view override returns (address) {
        return _stakerList[stakerNum];
    }

    /**
     * @notice Check whether the given staker is staked
     * @param staker Staker address to check
     * @return True or False for whether the staker was staked
     */
    function isStaked(address staker) public view override returns (bool) {
        return _stakerMap[staker].isStaked;
    }

    /**
     * @notice Check whether the given staker is staked on the latest confirmed node,
     * which includes if the staker is staked on a descendent of the latest confirmed node.
     * @param staker Staker address to check
     * @return True or False for whether the staker was staked
     */
    function isStakedOnLatestConfirmed(address staker) public view returns (bool) {
        return _stakerMap[staker].isStaked && nodeHasStaker(_latestConfirmed, staker);
    }

    /**
     * @notice Get the latest staked node of the given staker
     * @param staker Staker address to lookup
     * @return Latest node staked of the staker
     */
    function latestStakedNode(address staker) public view override returns (uint64) {
        return _stakerMap[staker].latestStakedNode;
    }

    /**
     * @notice Get the current challenge of the given staker
     * @param staker Staker address to lookup
     * @return Current challenge of the staker
     */
    function currentChallenge(address staker) public view override returns (uint64) {
        return _stakerMap[staker].currentChallenge;
    }

    /**
     * @notice Get the amount staked of the given staker
     * @param staker Staker address to lookup
     * @return Amount staked of the staker
     */
    function amountStaked(address staker) public view override returns (uint256) {
        return _stakerMap[staker].amountStaked;
    }

    /**
     * @notice Retrieves stored information about a requested staker
     * @param staker Staker address to retrieve
     * @return A structure with information about the requested staker
     */
    function getStaker(address staker) external view override returns (Staker memory) {
        return _stakerMap[staker];
    }

    /**
     * @notice Get the original staker address of the zombie at the given index
     * @param zombieNum Index of the zombie to lookup
     * @return Original staker address of the zombie
     */
    function zombieAddress(uint256 zombieNum) public view override returns (address) {
        return _zombies[zombieNum].stakerAddress;
    }

    /**
     * @notice Get Latest node that the given zombie at the given index is staked on
     * @param zombieNum Index of the zombie to lookup
     * @return Latest node that the given zombie is staked on
     */
    function zombieLatestStakedNode(uint256 zombieNum) public view override returns (uint64) {
        return _zombies[zombieNum].latestStakedNode;
    }

    /**
     * @notice Retrieves stored information about a requested zombie
     * @param zombieNum Index of the zombie to lookup
     * @return A structure with information about the requested staker
     */
    function getZombieStorage(uint256 zombieNum) internal view returns (Zombie storage) {
        return _zombies[zombieNum];
    }

    /// @return Current number of un-removed zombies
    function zombieCount() public view override returns (uint256) {
        return _zombies.length;
    }

    function isZombie(address staker) public view override returns (bool) {
        for (uint256 i = 0; i < _zombies.length; i++) {
            if (staker == _zombies[i].stakerAddress) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Get the amount of funds withdrawable by the given address
     * @param user Address to check the funds of
     * @return Amount of funds withdrawable by user
     */
    function withdrawableFunds(address user) external view override returns (uint256) {
        return _withdrawableFunds[user];
    }

    /**
     * @return Index of the first unresolved node
     * @dev If all nodes have been resolved, this will be latestNodeCreated + 1
     */
    function firstUnresolvedNode() public view override returns (uint64) {
        return _firstUnresolvedNode;
    }

    /// @return Index of the latest confirmed node
    function latestConfirmed() public view override returns (uint64) {
        return _latestConfirmed;
    }

    /// @return Index of the latest rollup node created
    function latestNodeCreated() public view override returns (uint64) {
        return _latestNodeCreated;
    }

    /// @return Ethereum block that the most recent stake was created
    function lastStakeBlock() external view override returns (uint64) {
        return _lastStakeBlock;
    }

    /// @return Number of active stakers currently staked
    function stakerCount() public view override returns (uint64) {
        return uint64(_stakerList.length);
    }

    /**
     * @notice Initialize the core with an initial node
     * @param initialNode Initial node to start the chain with
     */
    function initializeCore(Node memory initialNode) internal {
        __Pausable_init();
        _nodes[GENESIS_NODE] = initialNode;
        _firstUnresolvedNode = GENESIS_NODE + 1;
    }

    /**
     * @notice React to a new node being created by storing it an incrementing the latest node counter
     * @param node Node that was newly created
     */
    function nodeCreated(Node memory node) internal {
        _latestNodeCreated++;
        _nodes[_latestNodeCreated] = node;
    }

    /// @notice Reject the next unresolved node
    function _rejectNextNode() internal {
        _firstUnresolvedNode++;
    }

    function confirmNode(
        uint64 nodeNum,
        bytes32 blockHash,
        bytes32 sendRoot
    ) internal {
        Node storage node = getNodeStorage(nodeNum);
        // Authenticate data against node's confirm data pre-image
        require(node.confirmData == RollupLib.confirmHash(blockHash, sendRoot), "CONFIRM_DATA");

        // trusted external call to outbox
        outbox.updateSendRoot(sendRoot, blockHash);

        _latestConfirmed = nodeNum;
        _firstUnresolvedNode = nodeNum + 1;

        emit NodeConfirmed(nodeNum, blockHash, sendRoot);
    }

    /**
     * @notice Create a new stake at latest confirmed node
     * @param stakerAddress Address of the new staker
     * @param depositAmount Stake amount of the new staker
     */
    function createNewStake(address stakerAddress, uint256 depositAmount) internal {
        uint64 stakerIndex = uint64(_stakerList.length);
        _stakerList.push(stakerAddress);
        _stakerMap[stakerAddress] = Staker(
            depositAmount,
            stakerIndex,
            _latestConfirmed,
            NO_CHAL_INDEX, // new staker is not in challenge
            true
        );
        _nodeStakers[_latestConfirmed][stakerAddress] = true;
        _lastStakeBlock = uint64(block.number);
        emit UserStakeUpdated(stakerAddress, 0, depositAmount);
    }

    /**
     * @notice Check to see whether the two stakers are in the same challenge
     * @param stakerAddress1 Address of the first staker
     * @param stakerAddress2 Address of the second staker
     * @return Address of the challenge that the two stakers are in
     */
    function inChallenge(address stakerAddress1, address stakerAddress2)
        internal
        view
        returns (uint64)
    {
        Staker storage staker1 = _stakerMap[stakerAddress1];
        Staker storage staker2 = _stakerMap[stakerAddress2];
        uint64 challenge = staker1.currentChallenge;
        require(challenge != NO_CHAL_INDEX, "NO_CHAL");
        require(challenge == staker2.currentChallenge, "DIFF_IN_CHAL");
        return challenge;
    }

    /**
     * @notice Make the given staker as not being in a challenge
     * @param stakerAddress Address of the staker to remove from a challenge
     */
    function clearChallenge(address stakerAddress) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        staker.currentChallenge = NO_CHAL_INDEX;
    }

    /**
     * @notice Mark both the given stakers as engaged in the challenge
     * @param staker1 Address of the first staker
     * @param staker2 Address of the second staker
     * @param challenge Address of the challenge both stakers are now in
     */
    function challengeStarted(
        address staker1,
        address staker2,
        uint64 challenge
    ) internal {
        _stakerMap[staker1].currentChallenge = challenge;
        _stakerMap[staker2].currentChallenge = challenge;
    }

    /**
     * @notice Add to the stake of the given staker by the given amount
     * @param stakerAddress Address of the staker to increase the stake of
     * @param amountAdded Amount of stake to add to the staker
     */
    function increaseStakeBy(address stakerAddress, uint256 amountAdded) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        uint256 initialStaked = staker.amountStaked;
        uint256 finalStaked = initialStaked + amountAdded;
        staker.amountStaked = finalStaked;
        emit UserStakeUpdated(stakerAddress, initialStaked, finalStaked);
    }

    /**
     * @notice Reduce the stake of the given staker to the given target
     * @param stakerAddress Address of the staker to reduce the stake of
     * @param target Amount of stake to leave with the staker
     * @return Amount of value released from the stake
     */
    function reduceStakeTo(address stakerAddress, uint256 target) internal returns (uint256) {
        Staker storage staker = _stakerMap[stakerAddress];
        uint256 current = staker.amountStaked;
        require(target <= current, "TOO_LITTLE_STAKE");
        uint256 amountWithdrawn = current - target;
        staker.amountStaked = target;
        increaseWithdrawableFunds(stakerAddress, amountWithdrawn);
        emit UserStakeUpdated(stakerAddress, current, target);
        return amountWithdrawn;
    }

    /**
     * @notice Remove the given staker and turn them into a zombie
     * @param stakerAddress Address of the staker to remove
     */
    function turnIntoZombie(address stakerAddress) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        _zombies.push(Zombie(stakerAddress, staker.latestStakedNode));
        deleteStaker(stakerAddress);
    }

    /**
     * @notice Update the latest staked node of the zombie at the given index
     * @param zombieNum Index of the zombie to move
     * @param latest New latest node the zombie is staked on
     */
    function zombieUpdateLatestStakedNode(uint256 zombieNum, uint64 latest) internal {
        _zombies[zombieNum].latestStakedNode = latest;
    }

    /**
     * @notice Remove the zombie at the given index
     * @param zombieNum Index of the zombie to remove
     */
    function removeZombie(uint256 zombieNum) internal {
        _zombies[zombieNum] = _zombies[_zombies.length - 1];
        _zombies.pop();
    }

    /**
     * @notice Mark the given staker as staked on this node
     * @param staker Address of the staker to mark
     */
    function addStaker(uint64 nodeNum, address staker) internal {
        require(!_nodeStakers[nodeNum][staker], "ALREADY_STAKED");
        _nodeStakers[nodeNum][staker] = true;
        Node storage node = getNodeStorage(nodeNum);
        require(node.deadlineBlock != 0, "NO_NODE");

        uint64 prevCount = node.stakerCount;
        node.stakerCount = prevCount + 1;

        if (nodeNum > GENESIS_NODE) {
            Node storage parent = getNodeStorage(node.prevNum);
            parent.childStakerCount++;
            if (prevCount == 0) {
                parent.newChildConfirmDeadline(uint64(block.number) + confirmPeriodBlocks);
            }
        }
    }

    /**
     * @notice Remove the given staker from this node
     * @param staker Address of the staker to remove
     */
    function removeStaker(uint64 nodeNum, address staker) internal {
        require(_nodeStakers[nodeNum][staker], "NOT_STAKED");
        _nodeStakers[nodeNum][staker] = false;

        Node storage node = getNodeStorage(nodeNum);
        node.stakerCount--;

        if (nodeNum > GENESIS_NODE) {
            getNodeStorage(node.prevNum).childStakerCount--;
        }
    }

    /**
     * @notice Remove the given staker and return their stake
     * This should not be called if the staker is staked on a descendent of the latest confirmed node
     * @param stakerAddress Address of the staker withdrawing their stake
     */
    function withdrawStaker(address stakerAddress) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        uint64 latestConfirmedNum = latestConfirmed();
        if (nodeHasStaker(latestConfirmedNum, stakerAddress)) {
            // Withdrawing a staker whose latest staked node isn't resolved should be impossible
            assert(staker.latestStakedNode == latestConfirmedNum);
            removeStaker(latestConfirmedNum, stakerAddress);
        }
        uint256 initialStaked = staker.amountStaked;
        increaseWithdrawableFunds(stakerAddress, initialStaked);
        deleteStaker(stakerAddress);
        emit UserStakeUpdated(stakerAddress, initialStaked, 0);
    }

    /**
     * @notice Advance the given staker to the given node
     * @param stakerAddress Address of the staker adding their stake
     * @param nodeNum Index of the node to stake on
     */
    function stakeOnNode(address stakerAddress, uint64 nodeNum) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        addStaker(nodeNum, stakerAddress);
        staker.latestStakedNode = nodeNum;
    }

    /**
     * @notice Clear the withdrawable funds for the given address
     * @param account Address of the account to remove funds from
     * @return Amount of funds removed from account
     */
    function withdrawFunds(address account) internal returns (uint256) {
        uint256 amount = _withdrawableFunds[account];
        _withdrawableFunds[account] = 0;
        totalWithdrawableFunds -= amount;
        emit UserWithdrawableFundsUpdated(account, amount, 0);
        return amount;
    }

    /**
     * @notice Increase the withdrawable funds for the given address
     * @param account Address of the account to add withdrawable funds to
     */
    function increaseWithdrawableFunds(address account, uint256 amount) internal {
        uint256 initialWithdrawable = _withdrawableFunds[account];
        uint256 finalWithdrawable = initialWithdrawable + amount;
        _withdrawableFunds[account] = finalWithdrawable;
        totalWithdrawableFunds += amount;
        emit UserWithdrawableFundsUpdated(account, initialWithdrawable, finalWithdrawable);
    }

    /**
     * @notice Remove the given staker
     * @param stakerAddress Address of the staker to remove
     */
    function deleteStaker(address stakerAddress) private {
        Staker storage staker = _stakerMap[stakerAddress];
        require(staker.isStaked, "NOT_STAKED");
        uint64 stakerIndex = staker.index;
        _stakerList[stakerIndex] = _stakerList[_stakerList.length - 1];
        _stakerMap[_stakerList[stakerIndex]].index = stakerIndex;
        _stakerList.pop();
        delete _stakerMap[stakerAddress];
    }

    struct StakeOnNewNodeFrame {
        uint256 currentInboxSize;
        Node node;
        bytes32 executionHash;
        Node prevNode;
        bytes32 lastHash;
        bool hasSibling;
        uint64 deadlineBlock;
        bytes32 sequencerBatchAcc;
    }

    function createNewNode(
        RollupLib.Assertion calldata assertion,
        uint64 prevNodeNum,
        uint256 prevNodeInboxMaxCount,
        bytes32 expectedNodeHash
    ) internal returns (bytes32 newNodeHash) {
        require(
            assertion.afterState.machineStatus == MachineStatus.FINISHED ||
                assertion.afterState.machineStatus == MachineStatus.ERRORED,
            "BAD_AFTER_STATUS"
        );

        StakeOnNewNodeFrame memory memoryFrame;
        {
            // validate data
            memoryFrame.prevNode = getNode(prevNodeNum);
            memoryFrame.currentInboxSize = bridge.sequencerMessageCount();

            // Make sure the previous state is correct against the node being built on
            require(
                RollupLib.stateHash(assertion.beforeState, prevNodeInboxMaxCount) ==
                    memoryFrame.prevNode.stateHash,
                "PREV_STATE_HASH"
            );

            // Ensure that the assertion doesn't read past the end of the current inbox
            uint64 afterInboxCount = assertion.afterState.globalState.getInboxPosition();
            uint64 prevInboxPosition = assertion.beforeState.globalState.getInboxPosition();
            require(afterInboxCount >= prevInboxPosition, "INBOX_BACKWARDS");
            if (afterInboxCount == prevInboxPosition) {
                require(
                    assertion.afterState.globalState.getPositionInMessage() >=
                        assertion.beforeState.globalState.getPositionInMessage(),
                    "INBOX_POS_IN_MSG_BACKWARDS"
                );
            }
            // See validator/assertion.go ExecutionState RequiredBatches() for reasoning
            if (
                assertion.afterState.machineStatus == MachineStatus.ERRORED ||
                assertion.afterState.globalState.getPositionInMessage() > 0
            ) {
                // The current inbox message was read
                afterInboxCount++;
            }
            require(afterInboxCount <= memoryFrame.currentInboxSize, "INBOX_PAST_END");
            // This gives replay protection against the state of the inbox
            if (afterInboxCount > 0) {
                memoryFrame.sequencerBatchAcc = bridge.sequencerInboxAccs(afterInboxCount - 1);
            }
        }

        {
            memoryFrame.executionHash = RollupLib.executionHash(assertion);

            memoryFrame.deadlineBlock = uint64(block.number) + confirmPeriodBlocks;

            memoryFrame.hasSibling = memoryFrame.prevNode.latestChildNumber > 0;
            // here we don't use ternacy operator to remain compatible with slither
            if (memoryFrame.hasSibling) {
                memoryFrame.lastHash = getNodeStorage(memoryFrame.prevNode.latestChildNumber)
                    .nodeHash;
            } else {
                memoryFrame.lastHash = memoryFrame.prevNode.nodeHash;
            }

            newNodeHash = RollupLib.nodeHash(
                memoryFrame.hasSibling,
                memoryFrame.lastHash,
                memoryFrame.executionHash,
                memoryFrame.sequencerBatchAcc,
                wasmModuleRoot
            );
            require(
                newNodeHash == expectedNodeHash || expectedNodeHash == bytes32(0),
                "UNEXPECTED_NODE_HASH"
            );

            memoryFrame.node = NodeLib.createNode(
                RollupLib.stateHash(assertion.afterState, memoryFrame.currentInboxSize),
                RollupLib.challengeRootHash(
                    memoryFrame.executionHash,
                    block.number,
                    wasmModuleRoot
                ),
                RollupLib.confirmHash(assertion),
                prevNodeNum,
                memoryFrame.deadlineBlock,
                newNodeHash
            );
        }

        {
            uint64 nodeNum = latestNodeCreated() + 1;

            // Fetch a storage reference to prevNode since we copied our other one into memory
            // and we don't have enough stack available to keep to keep the previous storage reference around
            Node storage prevNode = getNodeStorage(prevNodeNum);
            prevNode.childCreated(nodeNum);

            nodeCreated(memoryFrame.node);
        }

        emit NodeCreated(
            latestNodeCreated(),
            memoryFrame.prevNode.nodeHash,
            newNodeHash,
            memoryFrame.executionHash,
            assertion,
            memoryFrame.sequencerBatchAcc,
            wasmModuleRoot,
            memoryFrame.currentInboxSize
        );

        return newNodeHash;
    }
}

contract RollupAdminLogic is RollupCore, IRollupAdmin, DoubleLogicUUPSUpgradeable {
    function initialize(Config calldata config, ContractDependencies calldata connectedContracts)
        external
        override
        onlyProxy
        initializer
    {
        rollupDeploymentBlock = block.number;
        bridge = connectedContracts.bridge;
        sequencerInbox = connectedContracts.sequencerInbox;
        connectedContracts.bridge.setDelayedInbox(address(connectedContracts.inbox), true);
        connectedContracts.bridge.setSequencerInbox(address(connectedContracts.sequencerInbox));

        inbox = connectedContracts.inbox;
        outbox = connectedContracts.outbox;
        connectedContracts.bridge.setOutbox(address(connectedContracts.outbox), true);
        rollupEventInbox = connectedContracts.rollupEventInbox;
        connectedContracts.bridge.setDelayedInbox(
            address(connectedContracts.rollupEventInbox),
            true
        );

        connectedContracts.rollupEventInbox.rollupInitialized(config.chainId);
        connectedContracts.sequencerInbox.addSequencerL2Batch(
            0,
            "",
            1,
            IGasRefunder(address(0)),
            0,
            1
        );

        validatorUtils = connectedContracts.validatorUtils;
        validatorWalletCreator = connectedContracts.validatorWalletCreator;
        challengeManager = connectedContracts.challengeManager;

        Node memory node = createInitialNode();
        initializeCore(node);

        confirmPeriodBlocks = config.confirmPeriodBlocks;
        extraChallengeTimeBlocks = config.extraChallengeTimeBlocks;
        chainId = config.chainId;
        baseStake = config.baseStake;
        wasmModuleRoot = config.wasmModuleRoot;
        // A little over 15 minutes
        minimumAssertionPeriod = 75;

        // the owner can't access the rollup user facet where escrow is redeemable
        require(config.loserStakeEscrow != _getAdmin(), "INVALID_ESCROW_ADMIN");
        // this next check shouldn't be an issue if the owner controls an AdminProxy
        // that accesses the admin facet, but still seems like a good extra precaution
        require(config.loserStakeEscrow != config.owner, "INVALID_ESCROW_OWNER");
        loserStakeEscrow = config.loserStakeEscrow;

        stakeToken = config.stakeToken;

        emit RollupInitialized(config.wasmModuleRoot, config.chainId);
    }

    function createInitialNode() private view returns (Node memory) {
        GlobalState memory emptyGlobalState;
        bytes32 state = RollupLib.stateHashMem(
            RollupLib.ExecutionState(emptyGlobalState, MachineStatus.FINISHED),
            1 // inboxMaxCount - force the first assertion to read a message
        );
        return
            NodeLib.createNode(
                state,
                0, // challenge hash (not challengeable)
                0, // confirm data
                0, // prev node
                uint64(block.number), // deadline block (not challengeable)
                0 // initial node has a node hash of 0
            );
    }

    /**
     * Functions are only to reach this logic contract if the caller is the owner
     * so there is no need for a redundant onlyOwner check
     */

    /**
     * @notice Add a contract authorized to put messages into this rollup's inbox
     * @param _outbox Outbox contract to add
     */
    function setOutbox(IOutbox _outbox) external override {
        outbox = _outbox;
        bridge.setOutbox(address(_outbox), true);
        emit OwnerFunctionCalled(0);
    }

    /**
     * @notice Disable an old outbox from interacting with the bridge
     * @param _outbox Outbox contract to remove
     */
    function removeOldOutbox(address _outbox) external override {
        require(_outbox != address(outbox), "CUR_OUTBOX");
        bridge.setOutbox(_outbox, false);
        emit OwnerFunctionCalled(1);
    }

    /**
     * @notice Enable or disable an inbox contract
     * @param _inbox Inbox contract to add or remove
     * @param _enabled New status of inbox
     */
    function setDelayedInbox(address _inbox, bool _enabled) external override {
        bridge.setDelayedInbox(address(_inbox), _enabled);
        emit OwnerFunctionCalled(2);
    }

    /**
     * @notice Pause interaction with the rollup contract.
     * The time spent paused is not incremented in the rollup's timing for node validation.
     * @dev this function may be frontrun by a validator (ie to create a node before the system is paused).
     * The pause should be called atomically with required checks to be sure the system is paused in a consistent state.
     * The RollupAdmin may execute a check against the Rollup's latest node num or the ChallengeManager, then execute this function atomically with it.
     */
    function pause() external override {
        _pause();
        emit OwnerFunctionCalled(3);
    }

    /**
     * @notice Resume interaction with the rollup contract
     */
    function resume() external override {
        _unpause();
        emit OwnerFunctionCalled(4);
    }

    /// @notice allows the admin to upgrade the primary logic contract (ie rollup admin logic, aka this)
    /// @dev this function doesn't revert as this primary logic contract is only
    /// reachable by the proxy's admin
    function _authorizeUpgrade(address newImplementation) internal override {}

    /// @notice allows the admin to upgrade the secondary logic contract (ie rollup user logic)
    /// @dev this function doesn't revert as this primary logic contract is only
    /// reachable by the proxy's admin
    function _authorizeSecondaryUpgrade(address newImplementation) internal override {}

    /**
     * @notice Set the addresses of the validator whitelist
     * @dev It is expected that both arrays are same length, and validator at
     * position i corresponds to the value at position i
     * @param _validator addresses to set in the whitelist
     * @param _val value to set in the whitelist for corresponding address
     */
    function setValidator(address[] calldata _validator, bool[] calldata _val) external override {
        require(_validator.length > 0, "EMPTY_ARRAY");
        require(_validator.length == _val.length, "WRONG_LENGTH");

        for (uint256 i = 0; i < _validator.length; i++) {
            isValidator[_validator[i]] = _val[i];
        }
        emit OwnerFunctionCalled(6);
    }

    /**
     * @notice Set a new owner address for the rollup
     * @dev it is expected that only the rollup admin can use this facet to set a new owner
     * @param newOwner address of new rollup owner
     */
    function setOwner(address newOwner) external override {
        _changeAdmin(newOwner);
        emit OwnerFunctionCalled(7);
    }

    /**
     * @notice Set minimum assertion period for the rollup
     * @param newPeriod new minimum period for assertions
     */
    function setMinimumAssertionPeriod(uint256 newPeriod) external override {
        minimumAssertionPeriod = newPeriod;
        emit OwnerFunctionCalled(8);
    }

    /**
     * @notice Set number of blocks until a node is considered confirmed
     * @param newConfirmPeriod new number of blocks
     */
    function setConfirmPeriodBlocks(uint64 newConfirmPeriod) external override {
        require(newConfirmPeriod > 0, "INVALID_CONFIRM_PERIOD");
        confirmPeriodBlocks = newConfirmPeriod;
        emit OwnerFunctionCalled(9);
    }

    /**
     * @notice Set number of extra blocks after a challenge
     * @param newExtraTimeBlocks new number of blocks
     */
    function setExtraChallengeTimeBlocks(uint64 newExtraTimeBlocks) external override {
        extraChallengeTimeBlocks = newExtraTimeBlocks;
        emit OwnerFunctionCalled(10);
    }

    /**
     * @notice Set base stake required for an assertion
     * @param newBaseStake minimum amount of stake required
     */
    function setBaseStake(uint256 newBaseStake) external override {
        baseStake = newBaseStake;
        emit OwnerFunctionCalled(12);
    }

    /**
     * @notice Set the token used for stake, where address(0) == eth
     * @dev Before changing the base stake token, you might need to change the
     * implementation of the Rollup User facet!
     * @param newStakeToken address of token used for staking
     */
    function setStakeToken(address newStakeToken) external override whenPaused {
        /*
         * To change the stake token without breaking consistency one would need to:
         * Pause the system, have all stakers remove their funds,
         * update the user logic to handle ERC20s, change the stake token, then resume.
         *
         * Note: To avoid loss of funds stakers must remove their funds and claim all the
         * available withdrawable funds before the system is paused.
         */
        bool expectERC20Support = newStakeToken != address(0);
        // this assumes the rollup isn't its own admin. if needed, instead use a ProxyAdmin by OZ!
        bool actualERC20Support = IRollupUser(address(this)).isERC20Enabled();
        require(actualERC20Support == expectERC20Support, "NO_USER_LOGIC_SUPPORT");
        require(stakerCount() == 0, "NO_ACTIVE_STAKERS");
        require(totalWithdrawableFunds == 0, "NO_PENDING_WITHDRAW");
        stakeToken = newStakeToken;
        emit OwnerFunctionCalled(13);
    }

    /**
     * @notice Upgrades the implementation of a beacon controlled by the rollup
     * @param beacon address of beacon to be upgraded
     * @param newImplementation new address of implementation
     */
    function upgradeBeacon(address beacon, address newImplementation) external override {
        UpgradeableBeacon(beacon).upgradeTo(newImplementation);
        emit OwnerFunctionCalled(20);
    }

    function forceResolveChallenge(address[] calldata stakerA, address[] calldata stakerB)
        external
        override
        whenPaused
    {
        require(stakerA.length > 0, "EMPTY_ARRAY");
        require(stakerA.length == stakerB.length, "WRONG_LENGTH");
        for (uint256 i = 0; i < stakerA.length; i++) {
            uint64 chall = inChallenge(stakerA[i], stakerB[i]);

            require(chall != NO_CHAL_INDEX, "NOT_IN_CHALL");
            clearChallenge(stakerA[i]);
            clearChallenge(stakerB[i]);
            challengeManager.clearChallenge(chall);
        }
        emit OwnerFunctionCalled(21);
    }

    function forceRefundStaker(address[] calldata staker) external override whenPaused {
        require(staker.length > 0, "EMPTY_ARRAY");
        for (uint256 i = 0; i < staker.length; i++) {
            require(_stakerMap[staker[i]].currentChallenge == NO_CHAL_INDEX, "STAKER_IN_CHALL");
            reduceStakeTo(staker[i], 0);
            turnIntoZombie(staker[i]);
        }
        emit OwnerFunctionCalled(22);
    }

    function forceCreateNode(
        uint64 prevNode,
        uint256 prevNodeInboxMaxCount,
        RollupLib.Assertion calldata assertion,
        bytes32 expectedNodeHash
    ) external override whenPaused {
        require(prevNode == latestConfirmed(), "ONLY_LATEST_CONFIRMED");

        createNewNode(assertion, prevNode, prevNodeInboxMaxCount, expectedNodeHash);

        emit OwnerFunctionCalled(23);
    }

    function forceConfirmNode(
        uint64 nodeNum,
        bytes32 blockHash,
        bytes32 sendRoot
    ) external override whenPaused {
        // this skips deadline, staker and zombie validation
        confirmNode(nodeNum, blockHash, sendRoot);
        emit OwnerFunctionCalled(24);
    }

    function setLoserStakeEscrow(address newLoserStakerEscrow) external override {
        // escrow holder can't be proxy admin, since escrow is only redeemable through
        // the primary user logic contract
        require(newLoserStakerEscrow != _getAdmin(), "INVALID_ESCROW");
        loserStakeEscrow = newLoserStakerEscrow;
        emit OwnerFunctionCalled(25);
    }

    /**
     * @notice Set the proving WASM module root
     * @param newWasmModuleRoot new module root
     */
    function setWasmModuleRoot(bytes32 newWasmModuleRoot) external override {
        wasmModuleRoot = newWasmModuleRoot;
        emit OwnerFunctionCalled(26);
    }

    /**
     * @notice set a new sequencer inbox contract
     * @param _sequencerInbox new address of sequencer inbox
     */
    function setSequencerInbox(address _sequencerInbox) external override {
        bridge.setSequencerInbox(_sequencerInbox);
        emit OwnerFunctionCalled(27);
    }

    /**
     * @notice sets the rollup's inbox reference. Does not update the bridge's view.
     * @param newInbox new address of inbox
     */
    function setInbox(IInbox newInbox) external {
        inbox = newInbox;
        emit OwnerFunctionCalled(28);
    }

    function createNitroMigrationGenesis(RollupLib.Assertion calldata assertion)
        external
        whenPaused
    {
        bytes32 expectedSendRoot = bytes32(0);
        uint64 expectedInboxCount = 1;

        require(latestNodeCreated() == 0, "NON_GENESIS_NODES_EXIST");
        require(GlobalStateLib.isEmpty(assertion.beforeState.globalState), "NOT_EMPTY_BEFORE");
        require(
            assertion.beforeState.machineStatus == MachineStatus.FINISHED,
            "BEFORE_MACHINE_NOT_FINISHED"
        );
        // accessors such as state.getSendRoot not available for calldata structs, only memory
        require(
            assertion.afterState.globalState.bytes32Vals[1] == expectedSendRoot,
            "NOT_ZERO_SENDROOT"
        );
        require(
            assertion.afterState.globalState.u64Vals[0] == expectedInboxCount,
            "INBOX_NOT_AT_ONE"
        );
        require(assertion.afterState.globalState.u64Vals[1] == 0, "POSITION_IN_MESSAGE_NOT_ZERO");
        require(
            assertion.afterState.machineStatus == MachineStatus.FINISHED,
            "AFTER_MACHINE_NOT_FINISHED"
        );
        bytes32 genesisBlockHash = assertion.afterState.globalState.bytes32Vals[0];
        createNewNode(assertion, 0, expectedInboxCount, bytes32(0));
        confirmNode(1, genesisBlockHash, expectedSendRoot);
        emit OwnerFunctionCalled(29);
    }

    /**
     * @notice set the validatorWhitelistDisabled flag
     * @param _validatorWhitelistDisabled new value of validatorWhitelistDisabled, i.e. true = disabled
     */
    function setValidatorWhitelistDisabled(bool _validatorWhitelistDisabled) external {
        validatorWhitelistDisabled = _validatorWhitelistDisabled;
        emit OwnerFunctionCalled(30);
    }
}