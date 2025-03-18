// SPDX-License-Identifier: Unknown
pragma solidity 0.8.17;

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
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        /// @solidity memory-safe-assembly
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
    function _setSecondaryImplementation(
        address newImplementation
    ) private {
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
    function _upgradeSecondaryTo(
        address newImplementation
    ) internal {
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
    function _authorizeSecondaryUpgrade(
        address newImplementation
    ) internal virtual;

    /**
     * @dev Upgrade the secondary implementation of the proxy to `newImplementation`.
     *
     * Calls {_authorizeSecondaryUpgrade}.
     *
     * Emits an {UpgradedSecondary} event.
     */
    function upgradeSecondaryTo(
        address newImplementation
    ) external onlyProxy {
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
    function upgradeSecondaryToAndCall(
        address newImplementation,
        bytes memory data
    ) external payable onlyProxy {
        _authorizeSecondaryUpgrade(newImplementation);
        _upgradeSecondaryToAndCallUUPS(newImplementation, data, true);
    }
}

struct BufferConfig {
    uint64 threshold;
    uint64 max;
    uint64 replenishRateInBasis;
}

struct Config {
    uint64 confirmPeriodBlocks;
    address stakeToken;
    uint256 baseStake;
    bytes32 wasmModuleRoot;
    address owner;
    address loserStakeEscrow;
    uint256 chainId;
    string chainConfig;
    uint256 minimumAssertionPeriod;
    uint64 validatorAfkBlocks;
    uint256[] miniStakeValues;
    ISequencerInbox.MaxTimeVariation sequencerInboxMaxTimeVariation;
    uint256 layerZeroBlockEdgeHeight;
    uint256 layerZeroBigStepEdgeHeight;
    uint256 layerZeroSmallStepEdgeHeight;
    /// @notice The execution state to be used in the genesis assertion
    AssertionState genesisAssertionState;
    /// @notice The inbox size at the time the genesis execution state was created
    uint256 genesisInboxCount;
    address anyTrustFastConfirmer;
    uint8 numBigStepLevel;
    uint64 challengeGracePeriodBlocks;
    BufferConfig bufferConfig;
}

struct ContractDependencies {
    IBridge bridge;
    ISequencerInbox sequencerInbox;
    IInboxBase inbox;
    IOutbox outbox;
    IRollupEventInbox rollupEventInbox;
    IEdgeChallengeManager challengeManager;
    address rollupAdminLogic; // this cannot be IRollupAdmin because of circular dependencies
    IRollupUser rollupUserLogic;
    address validatorWalletCreator;
}

interface IRollupAdmin {
    /// @dev Outbox address was set
    event OutboxSet(address outbox);

    /// @dev Old outbox was removed
    event OldOutboxRemoved(address outbox);

    /// @dev Inbox was enabled or disabled
    event DelayedInboxSet(address inbox, bool enabled);

    /// @dev A list of validators was set
    event ValidatorsSet(address[] validators, bool[] enabled);

    /// @dev A new minimum assertion period was set
    event MinimumAssertionPeriodSet(uint256 newPeriod);

    /// @dev A new validator afk blocks was set
    event ValidatorAfkBlocksSet(uint256 newPeriod);

    /// @dev New confirm period blocks was set
    event ConfirmPeriodBlocksSet(uint64 newConfirmPeriod);

    /// @dev Base stake was set
    event BaseStakeSet(uint256 newBaseStake);

    /// @dev Stakers were force refunded
    event StakersForceRefunded(address[] staker);

    /// @dev An assertion was force created
    event AssertionForceCreated(bytes32 indexed assertionHash);

    /// @dev An assertion was force confirmed
    event AssertionForceConfirmed(bytes32 indexed assertionHash);

    /// @dev New loser stake escrow set
    event LoserStakeEscrowSet(address newLoserStakerEscrow);

    /// @dev New wasm module root was set
    event WasmModuleRootSet(bytes32 newWasmModuleRoot);

    /// @dev New sequencer inbox was set
    event SequencerInboxSet(address newSequencerInbox);

    /// @dev New inbox set
    event InboxSet(address inbox);

    /// @dev Validator whitelist was disabled or enabled
    event ValidatorWhitelistDisabledSet(bool _validatorWhitelistDisabled);

    /// @dev AnyTrust fast confirmer was set
    event AnyTrustFastConfirmerSet(address anyTrustFastConfirmer);

    /// @dev Challenge manager was set
    event ChallengeManagerSet(address challengeManager);

    function initialize(
        Config calldata config,
        ContractDependencies calldata connectedContracts
    ) external;

    /**
     * @notice Add a contract authorized to put messages into this rollup's inbox
     * @param _outbox Outbox contract to add
     */
    function setOutbox(
        IOutbox _outbox
    ) external;

    /**
     * @notice Disable an old outbox from interacting with the bridge
     * @param _outbox Outbox contract to remove
     */
    function removeOldOutbox(
        address _outbox
    ) external;

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
    function setOwner(
        address newOwner
    ) external;

    /**
     * @notice Set minimum assertion period for the rollup
     * @param newPeriod new minimum period for assertions
     */
    function setMinimumAssertionPeriod(
        uint256 newPeriod
    ) external;

    /**
     * @notice Set validator afk blocks for the rollup
     * @param  newAfkBlocks new number of blocks before a validator is considered afk (0 to disable)
     * @dev    ValidatorAfkBlocks is the number of blocks since the last confirmed
     *         assertion (or its first child) before the validator whitelist is removed.
     *         It's important that this time is greater than the max amount of time it can take to
     *         to confirm an assertion via the normal method. Therefore we need it to be greater
     *         than max(2* confirmPeriod, 2 * challengePeriod) with some additional margin.
     */
    function setValidatorAfkBlocks(
        uint64 newAfkBlocks
    ) external;

    /**
     * @notice Set number of blocks until a assertion is considered confirmed
     * @param newConfirmPeriod new number of blocks until a assertion is confirmed
     */
    function setConfirmPeriodBlocks(
        uint64 newConfirmPeriod
    ) external;

    /**
     * @notice Set base stake required for an assertion
     * @param newBaseStake maximum avmgas to be used per block
     */
    function setBaseStake(
        uint256 newBaseStake
    ) external;

    function forceRefundStaker(
        address[] memory stacker
    ) external;

    function forceCreateAssertion(
        bytes32 prevAssertionHash,
        AssertionInputs calldata assertion,
        bytes32 expectedAssertionHash
    ) external;

    function forceConfirmAssertion(
        bytes32 assertionHash,
        bytes32 parentAssertionHash,
        AssertionState calldata confirmState,
        bytes32 inboxAcc
    ) external;

    function setLoserStakeEscrow(
        address newLoserStakerEscrow
    ) external;

    /**
     * @notice Set the proving WASM module root
     * @param newWasmModuleRoot new module root
     */
    function setWasmModuleRoot(
        bytes32 newWasmModuleRoot
    ) external;

    /**
     * @notice set a new sequencer inbox contract
     * @param _sequencerInbox new address of sequencer inbox
     */
    function setSequencerInbox(
        address _sequencerInbox
    ) external;

    /**
     * @notice set the validatorWhitelistDisabled flag
     * @param _validatorWhitelistDisabled new value of validatorWhitelistDisabled, i.e. true = disabled
     */
    function setValidatorWhitelistDisabled(
        bool _validatorWhitelistDisabled
    ) external;

    /**
     * @notice set the anyTrustFastConfirmer address
     * @param _anyTrustFastConfirmer new value of anyTrustFastConfirmer
     */
    function setAnyTrustFastConfirmer(
        address _anyTrustFastConfirmer
    ) external;

    /**
     * @notice set a new challengeManager contract
     * @param _challengeManager new value of challengeManager
     */
    function setChallengeManager(
        address _challengeManager
    ) external;
}

interface IAssertionChain {
    function bridge() external view returns (IBridge);
    function validateAssertionHash(
        bytes32 assertionHash,
        AssertionState calldata state,
        bytes32 prevAssertionHash,
        bytes32 inboxAcc
    ) external view;
    function validateConfig(bytes32 assertionHash, ConfigData calldata configData) external view;
    function getFirstChildCreationBlock(
        bytes32 assertionHash
    ) external view returns (uint64);
    function getSecondChildCreationBlock(
        bytes32 assertionHash
    ) external view returns (uint64);
    function isFirstChild(
        bytes32 assertionHash
    ) external view returns (bool);
    function isPending(
        bytes32 assertionHash
    ) external view returns (bool);
    function isValidator(
        address
    ) external view returns (bool);
    function getValidators() external view returns (address[] memory);
    function validatorWhitelistDisabled() external view returns (bool);
}

interface IRollupCore is IAssertionChain {
    struct Staker {
        uint256 amountStaked;
        bytes32 latestStakedAssertion;
        uint64 index;
        bool isStaked;
        address withdrawalAddress;
    }

    event RollupInitialized(bytes32 machineHash, uint256 chainId);

    event AssertionCreated(
        bytes32 indexed assertionHash,
        bytes32 indexed parentAssertionHash,
        AssertionInputs assertion,
        bytes32 afterInboxBatchAcc,
        uint256 inboxMaxCount,
        bytes32 wasmModuleRoot,
        uint256 requiredStake,
        address challengeManager,
        uint64 confirmPeriodBlocks
    );

    event AssertionConfirmed(bytes32 indexed assertionHash, bytes32 blockHash, bytes32 sendRoot);

    event RollupChallengeStarted(
        uint64 indexed challengeIndex,
        address asserter,
        address challenger,
        uint64 challengedAssertion
    );

    event UserStakeUpdated(
        address indexed user,
        address indexed withdrawalAddress,
        uint256 initialBalance,
        uint256 finalBalance
    );

    event UserWithdrawableFundsUpdated(
        address indexed user, uint256 initialBalance, uint256 finalBalance
    );

    function confirmPeriodBlocks() external view returns (uint64);

    function validatorAfkBlocks() external view returns (uint64);

    function chainId() external view returns (uint256);

    function baseStake() external view returns (uint256);

    function wasmModuleRoot() external view returns (bytes32);

    function bridge() external view returns (IBridge);

    function sequencerInbox() external view returns (ISequencerInbox);

    function outbox() external view returns (IOutbox);

    function rollupEventInbox() external view returns (IRollupEventInbox);

    function challengeManager() external view returns (IEdgeChallengeManager);

    function loserStakeEscrow() external view returns (address);

    function stakeToken() external view returns (address);

    function minimumAssertionPeriod() external view returns (uint256);

    function genesisAssertionHash() external pure returns (bytes32);

    /**
     * @notice Get the Assertion for the given id.
     */
    function getAssertion(
        bytes32 assertionHash
    ) external view returns (AssertionNode memory);

    /**
     * @notice Returns the block in which the given assertion was created for looking up its creation event.
     * Unlike the assertion's createdAtBlock field, this will be the ArbSys blockNumber if the host chain is an Arbitrum chain.
     * That means that the block number returned for this is usable for event queries.
     * This function will revert if the given assertion hash does not exist.
     * @dev This function is meant for internal use only and has no stability guarantees.
     */
    function getAssertionCreationBlockForLogLookup(
        bytes32 assertionHash
    ) external view returns (uint256);

    /**
     * @notice Get the address of the staker at the given index
     * @param stakerNum Index of the staker
     * @return Address of the staker
     */
    function getStakerAddress(
        uint64 stakerNum
    ) external view returns (address);

    /**
     * @notice Check whether the given staker is staked
     * @param staker Staker address to check
     * @return True or False for whether the staker was staked
     */
    function isStaked(
        address staker
    ) external view returns (bool);

    /**
     * @notice Get the latest staked assertion of the given staker
     * @param staker Staker address to lookup
     * @return Latest assertion staked of the staker
     */
    function latestStakedAssertion(
        address staker
    ) external view returns (bytes32);

    /**
     * @notice Get the amount staked of the given staker
     * @param staker Staker address to lookup
     * @return Amount staked of the staker
     */
    function amountStaked(
        address staker
    ) external view returns (uint256);

    /**
     * @notice Get the withdrawal address of the given staker
     * @param staker Staker address to lookup
     * @return Withdrawal address of the staker
     */
    function withdrawalAddress(
        address staker
    ) external view returns (address);

    /**
     * @notice Retrieves stored information about a requested staker
     * @param staker Staker address to retrieve
     * @return A structure with information about the requested staker
     */
    function getStaker(
        address staker
    ) external view returns (Staker memory);

    /**
     * @notice Get the amount of funds withdrawable by the given address
     * @param owner Address to check the funds of
     * @return Amount of funds withdrawable by owner
     */
    function withdrawableFunds(
        address owner
    ) external view returns (uint256);
    /// @return Hash of the latest confirmed assertion
    function latestConfirmed() external view returns (bytes32);

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

struct AssertionNode {
    // This value starts at zero and is set to a value when the first child is created. After that it is constant until the assertion is destroyed or the owner destroys pending assertions
    uint64 firstChildBlock;
    // This value starts at zero and is set to a value when the second child is created. After that it is constant until the assertion is destroyed or the owner destroys pending assertions
    uint64 secondChildBlock;
    // The block number when this assertion was created
    uint64 createdAtBlock;
    // True if this assertion is the first child of its prev
    bool isFirstChild;
    // Status of the Assertion
    AssertionStatus status;
    // A hash of the context available at the time of this assertions creation. It should contain information that is not specific
    // to this assertion, but instead to the environment at the time of creation. This is necessary to store on the assertion
    // as this environment can change and we need to know what it was like at the time this assertion was created. An example
    // of this is the wasm module root which determines the state transition function on the L2. If the wasm module root
    // changes we need to know that previous assertions were made under a different root, so that we can understand that they
    // were valid at the time. So when resolving a challenge by one step, the edge challenge manager finds the wasm module root
    // that was recorded on the prev of the assertions being disputed and uses it to resolve the one step proof.
    bytes32 configHash;
}

library AssertionNodeLib {
    /**
     * @notice Initialize a Assertion
     */
    function createAssertion(
        bool _isFirstChild,
        bytes32 _configHash
    ) internal view returns (AssertionNode memory) {
        AssertionNode memory assertion;
        assertion.createdAtBlock = uint64(block.number);
        assertion.isFirstChild = _isFirstChild;
        assertion.configHash = _configHash;
        assertion.status = AssertionStatus.Pending;
        return assertion;
    }

    /**
     * @notice Update child properties
     */
    function childCreated(
        AssertionNode storage self
    ) internal {
        if (self.firstChildBlock == 0) {
            self.firstChildBlock = uint64(block.number);
        } else if (self.secondChildBlock == 0) {
            self.secondChildBlock = uint64(block.number);
        }
    }

    function requireExists(
        AssertionNode memory self
    ) internal pure {
        require(self.status != AssertionStatus.NoAssertion, "ASSERTION_NOT_EXIST");
    }
}

library EnumerableSetUpgradeable {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;
        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping(bytes32 => uint256) _indexes;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._indexes[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We read and store the value's index to prevent multiple reads from the same storage slot
        uint256 valueIndex = set._indexes[value];

        if (valueIndex != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            if (lastIndex != toDeleteIndex) {
                bytes32 lastValue = set._values[lastIndex];

                // Move the last value to the index where the value to delete is
                set._values[toDeleteIndex] = lastValue;
                // Update the index for the moved value
                set._indexes[lastValue] = valueIndex; // Replace lastValue's index to valueIndex
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._indexes[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        return set._values[index];
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function _values(Set storage set) private view returns (bytes32[] memory) {
        return set._values;
    }

    // Bytes32Set

    struct Bytes32Set {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _add(set._inner, value);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _remove(set._inner, value);
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
        return _contains(set._inner, value);
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(Bytes32Set storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
        return _at(set._inner, index);
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(Bytes32Set storage set) internal view returns (bytes32[] memory) {
        return _values(set._inner);
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint160(uint256(_at(set._inner, index))));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(AddressSet storage set) internal view returns (address[] memory) {
        bytes32[] memory store = _values(set._inner);
        address[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }

    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(UintSet storage set) internal view returns (uint256[] memory) {
        bytes32[] memory store = _values(set._inner);
        uint256[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
    }
}

library ArbitrumChecker {
    function runningOnArbitrum() internal view returns (bool) {
        (bool ok, bytes memory data) =
            address(100).staticcall(abi.encodeWithSelector(ArbSys.arbOSVersion.selector));
        return ok && data.length == 32;
    }
}

enum AssertionStatus {
    // No assertion at this index
    NoAssertion,
    // Assertion is being computed
    Pending,
    // Assertion is confirmed
    Confirmed
}

library GlobalStateLib {
    using GlobalStateLib for GlobalState;

    uint16 internal constant BYTES32_VALS_NUM = 2;
    uint16 internal constant U64_VALS_NUM = 2;

    function hash(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "Global state:",
                state.bytes32Vals[0],
                state.bytes32Vals[1],
                state.u64Vals[0],
                state.u64Vals[1]
            )
        );
    }

    function getBlockHash(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return state.bytes32Vals[0];
    }

    function getSendRoot(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return state.bytes32Vals[1];
    }

    function getInboxPosition(
        GlobalState memory state
    ) internal pure returns (uint64) {
        return state.u64Vals[0];
    }

    function getPositionInMessage(
        GlobalState memory state
    ) internal pure returns (uint64) {
        return state.u64Vals[1];
    }

    function isEmpty(
        GlobalState calldata state
    ) internal pure returns (bool) {
        return (
            state.bytes32Vals[0] == bytes32(0) && state.bytes32Vals[1] == bytes32(0)
                && state.u64Vals[0] == 0 && state.u64Vals[1] == 0
        );
    }

    function comparePositions(
        GlobalState calldata a,
        GlobalState calldata b
    ) internal pure returns (int256) {
        uint64 aPos = a.getInboxPosition();
        uint64 bPos = b.getInboxPosition();
        if (aPos < bPos) {
            return -1;
        } else if (aPos > bPos) {
            return 1;
        } else {
            uint64 aMsg = a.getPositionInMessage();
            uint64 bMsg = b.getPositionInMessage();
            if (aMsg < bMsg) {
                return -1;
            } else if (aMsg > bMsg) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    function comparePositionsAgainstStartOfBatch(
        GlobalState calldata a,
        uint256 bPos
    ) internal pure returns (int256) {
        uint64 aPos = a.getInboxPosition();
        if (aPos < bPos) {
            return -1;
        } else if (aPos > bPos) {
            return 1;
        } else {
            if (a.getPositionInMessage() > 0) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}

struct ExecutionState {
    GlobalState globalState;
    MachineStatus machineStatus;
}

library AssertionStateLib {
    function toExecutionState(
        AssertionState memory state
    ) internal pure returns (ExecutionState memory) {
        return ExecutionState(state.globalState, state.machineStatus);
    }

    function hash(
        AssertionState memory state
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(state));
    }
}

library RollupLib {
    using GlobalStateLib for GlobalState;
    using AssertionStateLib for AssertionState;

    // The `assertionHash` contains all the information needed to determine an assertion's validity.
    // This helps protect validators against reorgs by letting them bind their assertion to the current chain state.
    function assertionHash(
        bytes32 parentAssertionHash,
        AssertionState memory afterState,
        bytes32 inboxAcc
    ) internal pure returns (bytes32) {
        // we can no longer have `hasSibling` in the assertion hash as it would allow identical assertions
        return assertionHash(parentAssertionHash, afterState.hash(), inboxAcc);
    }

    // Takes in a hash of the afterState instead of the afterState itself
    function assertionHash(
        bytes32 parentAssertionHash,
        bytes32 afterStateHash,
        bytes32 inboxAcc
    ) internal pure returns (bytes32) {
        // we can no longer have `hasSibling` in the assertion hash as it would allow identical assertions
        return keccak256(abi.encodePacked(parentAssertionHash, afterStateHash, inboxAcc));
    }

    // All these should be emited in AssertionCreated event
    function configHash(
        bytes32 wasmModuleRoot,
        uint256 requiredStake,
        address challengeManager,
        uint64 confirmPeriodBlocks,
        uint64 nextInboxPosition
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                wasmModuleRoot,
                requiredStake,
                challengeManager,
                confirmPeriodBlocks,
                nextInboxPosition
            )
        );
    }

    function validateConfigHash(
        ConfigData calldata configData,
        bytes32 _configHash
    ) internal pure {
        require(
            _configHash
                == configHash(
                    configData.wasmModuleRoot,
                    configData.requiredStake,
                    configData.challengeManager,
                    configData.confirmPeriodBlocks,
                    configData.nextInboxPosition
                ),
            "CONFIG_HASH_MISMATCH"
        );
    }
}

struct BeforeStateData {
    // The assertion hash of the prev of the beforeState(prev)
    bytes32 prevPrevAssertionHash;
    // The sequencer inbox accumulator asserted by the beforeState(prev)
    bytes32 sequencerBatchAcc;
    // below are the components of config hash
    ConfigData configData;
}

struct GlobalState {
    bytes32[2] bytes32Vals;
    uint64[2] u64Vals;
}

struct AssertionState {
    GlobalState globalState;
    MachineStatus machineStatus;
    bytes32 endHistoryRoot;
}

struct AssertionInputs {
    // Additional data used to validate the before state
    BeforeStateData beforeStateData;
    AssertionState beforeState;
    AssertionState afterState;
}

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED
}

struct ConfigData {
    bytes32 wasmModuleRoot;
    uint256 requiredStake;
    address challengeManager;
    uint64 confirmPeriodBlocks;
    uint64 nextInboxPosition;
}

abstract contract RollupCore is IRollupCore, PausableUpgradeable {
    using AssertionNodeLib for AssertionNode;
    using GlobalStateLib for GlobalState;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    // Rollup Config
    uint256 public chainId;

    // These 4 config should be stored into the prev and not used directly
    // An assertion can be confirmed after confirmPeriodBlocks when it is unchallenged
    uint64 public confirmPeriodBlocks;
    // The validator whitelist can be dropped permissionlessly once the last confirmed assertion or its first child is at least validatorAfkBlocks old
    uint64 public validatorAfkBlocks;

    // ------------------------------
    // STAKING
    // ------------------------------

    // Overall
    // ------------------------------
    // In order to create a new assertion the validator creating it must be staked. Only one stake
    // is needed per consistent lineage of assertions, so additional stakes must be placed when
    // lineages diverge.
    // As an example, for the following chain only one stake would be locked up in the C assertion
    // A -- B -- C
    // However for the following chain 2 stakes would be locked up, in C and in D
    // A -- B -- C
    //       \-- D
    // Since we know that only one assertion chain can be correct, we only need one stake available
    // to be refunded at any one time, and any more than one stake can be immediately confiscated.
    // So in the above situation although 2 stakes are not available to be withdrawn as they are locked
    // by C and D, only 1 stake needs to remain in the contract since one of the stakes will eventually
    // be confiscated anyway.
    // In practice, what we do here is increase the withdrawable amount of an escrow address that is
    // expected to be controlled by the rollup owner, whenever the lineage forks.

    // Moving stake
    // ------------------------------
    // Since we only need one stake per lineage we can lock the stake of the validator that last extended that
    // lineage. All other stakes within that lineage are then free to be moved to other lineages, or be withdrawn.
    // Additionally, it's inconsistent for a validator to stake on two different lineages, and as a validator
    // should only need to have one stake in the system at any one time.
    // In order to create a new assertion a validator needs to have free stake. Since stake is freed from an assertion
    // when another assertion builds on it, we know that if the assertion that was last staked on by a validator
    // has children, then that validator has free stake. Likewise, if the last staked assertion does not have children
    // but it is the parent of the assertion the validator is trying to create, then we know that by the time the assertion
    // is created it will have children, so we can allow this condition as well.

    // Updating stake amount
    // ------------------------------
    // The stake required to create an assertion can be updated by the rollup owner. A required stake value is stored on each
    // assertion, and shows how much stake is required to create the next assertion. Since we only store the last
    // assertion made by a validator, we don't know if it has previously staked on lower/higher amounts and
    // therefore offer partial withdrawals due to this difference. Instead we enforce that either all of the
    // validators stake is locked, or none of it.
    uint256 public baseStake;

    bytes32 public wasmModuleRoot;
    // When there is a challenge, we trust the challenge manager to determine the winner
    IEdgeChallengeManager public challengeManager;

    // If an assertion was challenged we leave an additional period after it could have completed
    // so that the result of a challenge is observable widely before it causes an assertion to be confirmed
    uint64 public challengeGracePeriodBlocks;

    IInboxBase public inbox;
    IBridge public bridge;
    IOutbox public outbox;
    IRollupEventInbox public rollupEventInbox;

    address public validatorWalletCreator;

    // only 1 child can be confirmed, the excess/loser stake will be sent to this address
    address public loserStakeEscrow;
    address public stakeToken;
    uint256 public minimumAssertionPeriod;

    EnumerableSetUpgradeable.AddressSet internal validators;

    bytes32 private _latestConfirmed;
    mapping(bytes32 => AssertionNode) private _assertions;

    address[] private _stakerList;
    mapping(address => Staker) public _stakerMap;

    mapping(address => uint256) private _withdrawableFunds;
    uint256 public totalWithdrawableFunds;
    uint256 public rollupDeploymentBlock;

    bool public validatorWhitelistDisabled;
    address public anyTrustFastConfirmer;

    // If the chain this RollupCore is deployed on is an Arbitrum chain.
    bool internal immutable _hostChainIsArbitrum = ArbitrumChecker.runningOnArbitrum();
    // If the chain RollupCore is deployed on, this will contain the ArbSys.blockNumber() at each node's creation.
    mapping(bytes32 => uint256) internal _assertionCreatedAtArbSysBlock;

    function sequencerInbox() public view virtual returns (ISequencerInbox) {
        return ISequencerInbox(bridge.sequencerInbox());
    }

    /**
     * @notice Get a storage reference to the Assertion for the given assertion hash
     * @dev The assertion may not exists
     * @param assertionHash Id of the assertion
     * @return Assertion struct
     */
    function getAssertionStorage(
        bytes32 assertionHash
    ) internal view returns (AssertionNode storage) {
        require(assertionHash != bytes32(0), "ASSERTION_ID_CANNOT_BE_ZERO");
        return _assertions[assertionHash];
    }

    /**
     * @notice Get the Assertion for the given index.
     */
    function getAssertion(
        bytes32 assertionHash
    ) public view override returns (AssertionNode memory) {
        return getAssertionStorage(assertionHash);
    }

    /**
     * @notice Returns the block in which the given assertion was created for looking up its creation event.
     * Unlike the assertion's createdAtBlock field, this will be the ArbSys blockNumber if the host chain is an Arbitrum chain.
     * That means that the block number returned for this is usable for event queries.
     * This function will revert if the given assertion hash does not exist.
     * @dev This function is meant for internal use only and has no stability guarantees.
     */
    function getAssertionCreationBlockForLogLookup(
        bytes32 assertionHash
    ) external view override returns (uint256) {
        if (_hostChainIsArbitrum) {
            uint256 blockNum = _assertionCreatedAtArbSysBlock[assertionHash];
            require(blockNum > 0, "NO_ASSERTION");
            return blockNum;
        } else {
            AssertionNode storage assertion = getAssertionStorage(assertionHash);
            assertion.requireExists();
            return assertion.createdAtBlock;
        }
    }

    /**
     * @notice Get the address of the staker at the given index
     * @param stakerNum Index of the staker
     * @return Address of the staker
     */
    function getStakerAddress(
        uint64 stakerNum
    ) external view override returns (address) {
        return _stakerList[stakerNum];
    }

    /**
     * @notice Check whether the given staker is staked
     * @param staker Staker address to check
     * @return True or False for whether the staker was staked
     */
    function isStaked(
        address staker
    ) public view override returns (bool) {
        return _stakerMap[staker].isStaked;
    }

    /**
     * @notice Get the latest staked assertion of the given staker
     * @param staker Staker address to lookup
     * @return Latest assertion staked of the staker
     */
    function latestStakedAssertion(
        address staker
    ) public view override returns (bytes32) {
        return _stakerMap[staker].latestStakedAssertion;
    }

    /**
     * @notice Get the amount staked of the given staker
     * @param staker Staker address to lookup
     * @return Amount staked of the staker
     */
    function amountStaked(
        address staker
    ) public view override returns (uint256) {
        return _stakerMap[staker].amountStaked;
    }

    /**
     * @notice Get the withdrawal address of the given staker
     * @param staker Staker address to lookup
     * @return Withdrawal address of the staker
     */
    function withdrawalAddress(
        address staker
    ) public view override returns (address) {
        return _stakerMap[staker].withdrawalAddress;
    }

    /**
     * @notice Retrieves stored information about a requested staker
     * @param staker Staker address to retrieve
     * @return A structure with information about the requested staker
     */
    function getStaker(
        address staker
    ) external view override returns (Staker memory) {
        return _stakerMap[staker];
    }

    /**
     * @notice Get the amount of funds withdrawable by the given address
     * @param user Address to check the funds of
     * @return Amount of funds withdrawable by user
     */
    function withdrawableFunds(
        address user
    ) external view override returns (uint256) {
        return _withdrawableFunds[user];
    }

    /// @return Index of the latest confirmed assertion
    function latestConfirmed() public view override returns (bytes32) {
        return _latestConfirmed;
    }

    /// @return Number of active stakers currently staked
    function stakerCount() public view override returns (uint64) {
        return uint64(_stakerList.length);
    }

    /**
     * @notice Initialize the core with an initial assertion
     * @param initialAssertion Initial assertion to start the chain with
     */
    function initializeCore(
        AssertionNode memory initialAssertion,
        bytes32 assertionHash
    ) internal {
        __Pausable_init();
        initialAssertion.status = AssertionStatus.Confirmed;
        _assertions[assertionHash] = initialAssertion;
        _latestConfirmed = assertionHash;
    }

    /**
     * @dev This function will validate the parentAssertionHash, confirmState and inboxAcc against the assertionHash
     *          and check if the assertionHash is currently pending. If all checks pass, the assertion will be confirmed.
     */
    function confirmAssertionInternal(
        bytes32 assertionHash,
        bytes32 parentAssertionHash,
        AssertionState calldata confirmState,
        bytes32 inboxAcc
    ) internal {
        AssertionNode storage assertion = getAssertionStorage(assertionHash);
        // Check that assertion is pending, this also checks that assertion exists
        require(assertion.status == AssertionStatus.Pending, "NOT_PENDING");

        // Authenticate data against assertionHash pre-image
        require(
            assertionHash
                == RollupLib.assertionHash({
                    parentAssertionHash: parentAssertionHash,
                    afterState: confirmState,
                    inboxAcc: inboxAcc
                }),
            "CONFIRM_DATA"
        );

        bytes32 blockHash = confirmState.globalState.getBlockHash();
        bytes32 sendRoot = confirmState.globalState.getSendRoot();

        // trusted external call to outbox
        outbox.updateSendRoot(sendRoot, blockHash);

        _latestConfirmed = assertionHash;
        assertion.status = AssertionStatus.Confirmed;

        emit AssertionConfirmed(assertionHash, blockHash, sendRoot);
    }

    /**
     * @notice Create a new stake at latest confirmed assertion
     * @param stakerAddress Address of the new staker
     * @param depositAmount Stake amount of the new staker
     */
    function createNewStake(
        address stakerAddress,
        uint256 depositAmount,
        address _withdrawalAddress
    ) internal {
        uint64 stakerIndex = uint64(_stakerList.length);
        _stakerList.push(stakerAddress);
        _stakerMap[stakerAddress] =
            Staker(depositAmount, _latestConfirmed, stakerIndex, true, _withdrawalAddress);
        emit UserStakeUpdated(stakerAddress, _withdrawalAddress, 0, depositAmount);
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
        emit UserStakeUpdated(stakerAddress, staker.withdrawalAddress, initialStaked, finalStaked);
    }

    /**
     * @notice Reduce the stake of the given staker to the given target
     * @param stakerAddress Address of the staker to reduce the stake of
     * @param target Amount of stake to leave with the staker
     * @return Amount of value released from the stake
     */
    function reduceStakeTo(address stakerAddress, uint256 target) internal returns (uint256) {
        Staker storage staker = _stakerMap[stakerAddress];
        address _withdrawalAddress = staker.withdrawalAddress;
        uint256 current = staker.amountStaked;
        require(target <= current, "TOO_LITTLE_STAKE");
        uint256 amountWithdrawn = current - target;
        staker.amountStaked = target;
        increaseWithdrawableFunds(_withdrawalAddress, amountWithdrawn);
        emit UserStakeUpdated(stakerAddress, _withdrawalAddress, current, target);
        return amountWithdrawn;
    }

    /**
     * @notice Remove the given staker and return their stake
     * This should only be called when the staker is inactive
     * @param stakerAddress Address of the staker withdrawing their stake
     */
    function withdrawStaker(
        address stakerAddress
    ) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        address _withdrawalAddress = staker.withdrawalAddress;
        uint256 initialStaked = staker.amountStaked;
        increaseWithdrawableFunds(_withdrawalAddress, initialStaked);
        deleteStaker(stakerAddress);
        emit UserStakeUpdated(stakerAddress, _withdrawalAddress, initialStaked, 0);
    }

    /**
     * @notice Clear the withdrawable funds for the given address
     * @param account Address of the account to remove funds from
     * @return Amount of funds removed from account
     */
    function withdrawFunds(
        address account
    ) internal returns (uint256) {
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
    function deleteStaker(
        address stakerAddress
    ) private {
        Staker storage staker = _stakerMap[stakerAddress];
        require(staker.isStaked, "NOT_STAKED");
        uint64 stakerIndex = staker.index;
        _stakerList[stakerIndex] = _stakerList[_stakerList.length - 1];
        _stakerMap[_stakerList[stakerIndex]].index = stakerIndex;
        _stakerList.pop();
        delete _stakerMap[stakerAddress];
    }

    function createNewAssertion(
        AssertionInputs calldata assertion,
        bytes32 prevAssertionHash,
        bytes32 expectedAssertionHash
    ) internal returns (bytes32 newAssertionHash, bool overflowAssertion) {
        // Validate the config hash
        RollupLib.validateConfigHash(
            assertion.beforeStateData.configData, getAssertionStorage(prevAssertionHash).configHash
        );

        // reading inbox messages always terminates in either a finished or errored state
        // although the challenge protocol that any invalid terminal state will be proven incorrect
        // we can do a quick sanity check here
        require(
            assertion.afterState.machineStatus == MachineStatus.FINISHED
                || assertion.afterState.machineStatus == MachineStatus.ERRORED,
            "BAD_AFTER_STATUS"
        );

        // validate the provided before state is correct by checking that it's part of the prev assertion hash
        require(
            RollupLib.assertionHash(
                assertion.beforeStateData.prevPrevAssertionHash,
                assertion.beforeState,
                assertion.beforeStateData.sequencerBatchAcc
            ) == prevAssertionHash,
            "INVALID_BEFORE_STATE"
        );

        // The rollup cannot advance from an errored state
        // If it reaches an errored state it must be corrected by an administrator
        // This will involve updating the wasm root and creating an alternative assertion
        // that consumes the correct number of inbox messages, and correctly transitions to the
        // FINISHED state so that normal progress can continue
        require(assertion.beforeState.machineStatus == MachineStatus.FINISHED, "BAD_PREV_STATUS");

        AssertionNode storage prevAssertion = getAssertionStorage(prevAssertionHash);
        // Required inbox position through which the next assertion (the one after this new assertion) must consume
        uint256 nextInboxPosition;
        bytes32 sequencerBatchAcc;
        {
            // This new assertion consumes the messages from prevInboxPosition to afterInboxPosition
            GlobalState calldata afterGS = assertion.afterState.globalState;
            GlobalState calldata beforeGS = assertion.beforeState.globalState;

            // there are 3 kinds of assertions that can be made. Assertions must be made when they fill the maximum number
            // of blocks, or when they process all messages up to prev.nextInboxPosition. When they fill the max
            // blocks, but dont manage to process all messages, we call this an "overflow" assertion.
            // 1. ERRORED assertion
            //    The machine finished in an ERRORED state. This can happen with processing any
            //    messages, or moving the position in the message.
            // 2. FINISHED assertion that did not overflow
            //    The machine finished as normal, and fully processed all the messages up to prev.nextInboxPosition.
            //    In this case the inbox position must equal prev.nextInboxPosition and position in message must be 0
            // 3. FINISHED assertion that did overflow
            //    The machine finished as normal, but didn't process all messages in the inbox.
            //    The inbox can be anywhere between the previous assertion's position and the nextInboxPosition, exclusive.

            //    All types of assertion must have inbox position in the range prev.inboxPosition <= x <= prev.nextInboxPosition
            require(afterGS.comparePositions(beforeGS) >= 0, "INBOX_BACKWARDS");
            int256 afterStateCmpMaxInbox = afterGS.comparePositionsAgainstStartOfBatch(
                assertion.beforeStateData.configData.nextInboxPosition
            );
            require(afterStateCmpMaxInbox <= 0, "INBOX_TOO_FAR");

            if (
                assertion.afterState.machineStatus != MachineStatus.ERRORED
                    && afterStateCmpMaxInbox < 0
            ) {
                // If we didn't reach the target next inbox position, this is an overflow assertion.
                overflowAssertion = true;
                // This shouldn't be necessary, but might as well constrain the assertion to be non-empty
                require(afterGS.comparePositions(beforeGS) > 0, "OVERFLOW_STANDSTILL");
            }
            // Inbox position at the time of this assertion being created
            uint256 currentInboxPosition = bridge.sequencerMessageCount();
            // Cannot read more messages than currently exist in the inbox
            require(
                afterGS.comparePositionsAgainstStartOfBatch(currentInboxPosition) <= 0,
                "INBOX_PAST_END"
            );

            // under normal circumstances prev.nextInboxPosition is guaranteed to exist
            // because we populate it from bridge.sequencerMessageCount(). However, when
            // the inbox message count doesnt change we artificially increase it by 1 as explained below
            // in this case we need to ensure when the assertion is made the inbox messages are available
            // to ensure that a valid assertion can actually be made.
            require(
                assertion.beforeStateData.configData.nextInboxPosition <= currentInboxPosition,
                "INBOX_NOT_POPULATED"
            );

            // The next assertion must consume all the messages that are currently found in the inbox
            uint256 afterInboxPosition = afterGS.getInboxPosition();
            if (afterInboxPosition == currentInboxPosition) {
                // No new messages have been added to the inbox since the last assertion
                // In this case if we set the next inbox position to the current one we would be insisting that
                // the next assertion process no messages. So instead we increment the next inbox position to current
                // plus one, so that the next assertion will process exactly one message.
                // Thus, no assertion can be empty (except the genesis assertion, which is created
                // via a different codepath).
                nextInboxPosition = currentInboxPosition + 1;
            } else {
                nextInboxPosition = currentInboxPosition;
            }

            // only the genesis assertion processes no messages, and that assertion is created
            // when we initialize this contract. Therefore, all assertions created here should have a non
            // zero inbox position.
            require(afterInboxPosition != 0, "EMPTY_INBOX_COUNT");

            // Fetch the inbox accumulator for this message count. Fetching this and checking against it
            // allows the assertion creator to ensure they're creating an assertion against the expected
            // inbox messages
            sequencerBatchAcc = bridge.sequencerInboxAccs(afterInboxPosition - 1);
        }

        newAssertionHash =
            RollupLib.assertionHash(prevAssertionHash, assertion.afterState, sequencerBatchAcc);

        // allow an assertion creator to ensure that they're creating their assertion against the expected state
        require(
            newAssertionHash == expectedAssertionHash || expectedAssertionHash == bytes32(0),
            "UNEXPECTED_ASSERTION_HASH"
        );

        // the assertion hash is unique - it's only possible to have one correct assertion hash
        // per assertion. Therefore we can check if this assertion has already been made, and if so
        // we can revert
        require(
            getAssertionStorage(newAssertionHash).status == AssertionStatus.NoAssertion,
            "ASSERTION_SEEN"
        );

        // state updates
        AssertionNode memory newAssertion = AssertionNodeLib.createAssertion(
            prevAssertion.firstChildBlock == 0, // assumes block 0 is impossible
            RollupLib.configHash({
                wasmModuleRoot: wasmModuleRoot,
                requiredStake: baseStake,
                challengeManager: address(challengeManager),
                confirmPeriodBlocks: confirmPeriodBlocks,
                nextInboxPosition: uint64(nextInboxPosition)
            })
        );

        // Fetch a storage reference to prevAssertion since we copied our other one into memory
        // and we don't have enough stack available to keep to keep the previous storage reference around
        prevAssertion.childCreated();
        _assertions[newAssertionHash] = newAssertion;

        emit AssertionCreated(
            newAssertionHash,
            prevAssertionHash,
            assertion,
            sequencerBatchAcc,
            nextInboxPosition,
            wasmModuleRoot,
            baseStake,
            address(challengeManager),
            confirmPeriodBlocks
        );
        if (_hostChainIsArbitrum) {
            _assertionCreatedAtArbSysBlock[newAssertionHash] = ArbSys(address(100)).arbBlockNumber();
        }
    }

    function genesisAssertionHash() external pure returns (bytes32) {
        GlobalState memory emptyGlobalState;
        AssertionState memory emptyAssertionState =
            AssertionState(emptyGlobalState, MachineStatus.FINISHED, bytes32(0));
        bytes32 parentAssertionHash = bytes32(0);
        bytes32 inboxAcc = bytes32(0);
        return RollupLib.assertionHash({
            parentAssertionHash: parentAssertionHash,
            afterState: emptyAssertionState,
            inboxAcc: inboxAcc
        });
    }

    function getFirstChildCreationBlock(
        bytes32 assertionHash
    ) external view returns (uint64) {
        return getAssertionStorage(assertionHash).firstChildBlock;
    }

    function getSecondChildCreationBlock(
        bytes32 assertionHash
    ) external view returns (uint64) {
        return getAssertionStorage(assertionHash).secondChildBlock;
    }

    function validateAssertionHash(
        bytes32 assertionHash,
        AssertionState calldata state,
        bytes32 prevAssertionHash,
        bytes32 inboxAcc
    ) external pure {
        require(
            assertionHash == RollupLib.assertionHash(prevAssertionHash, state, inboxAcc),
            "INVALID_ASSERTION_HASH"
        );
    }

    function validateConfig(bytes32 assertionHash, ConfigData calldata configData) external view {
        RollupLib.validateConfigHash(configData, getAssertionStorage(assertionHash).configHash);
    }

    function isFirstChild(
        bytes32 assertionHash
    ) external view returns (bool) {
        return getAssertionStorage(assertionHash).isFirstChild;
    }

    function isPending(
        bytes32 assertionHash
    ) external view returns (bool) {
        return getAssertionStorage(assertionHash).status == AssertionStatus.Pending;
    }

    function getValidators() external view returns (address[] memory) {
        return validators.values();
    }

    function isValidator(
        address validator
    ) external view returns (bool) {
        return validators.contains(validator);
    }

    /**
     * @notice Verify that the given staker is not active
     * @param stakerAddress Address to check
     */
    function requireInactiveStaker(
        address stakerAddress
    ) internal view {
        require(isStaked(stakerAddress), "NOT_STAKED");
        // A staker is inactive if
        // a) their last staked assertion is the latest confirmed assertion
        // b) their last staked assertion have a child
        bytes32 lastestAssertion = latestStakedAssertion(stakerAddress);
        bool isLatestConfirmed = lastestAssertion == latestConfirmed();
        bool haveChild = getAssertionStorage(lastestAssertion).firstChildBlock > 0;
        require(isLatestConfirmed || haveChild, "STAKE_ACTIVE");
    }
}

contract RollupAdminLogic is RollupCore, IRollupAdmin, DoubleLogicUUPSUpgradeable {
    using AssertionStateLib for AssertionState;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    function initialize(
        Config calldata config,
        ContractDependencies calldata connectedContracts
    ) external override onlyProxy initializer {
        rollupDeploymentBlock = block.number;
        bridge = connectedContracts.bridge;
        connectedContracts.bridge.setDelayedInbox(address(connectedContracts.inbox), true);
        connectedContracts.bridge.setSequencerInbox(address(connectedContracts.sequencerInbox));

        inbox = connectedContracts.inbox;
        outbox = connectedContracts.outbox;
        connectedContracts.bridge.setOutbox(address(connectedContracts.outbox), true);
        rollupEventInbox = connectedContracts.rollupEventInbox;

        // dont need to connect and initialize the event inbox if it's already been initialized
        if (!bridge.allowedDelayedInboxes(address(connectedContracts.rollupEventInbox))) {
            connectedContracts.bridge.setDelayedInbox(
                address(connectedContracts.rollupEventInbox), true
            );
            connectedContracts.rollupEventInbox.rollupInitialized(
                config.chainId, config.chainConfig
            );
        }

        if (connectedContracts.sequencerInbox.totalDelayedMessagesRead() == 0) {
            connectedContracts.sequencerInbox.addSequencerL2Batch(
                0, "", 1, IGasRefunder(address(0)), 0, 1
            );
        }

        validatorWalletCreator = connectedContracts.validatorWalletCreator;
        challengeManager = connectedContracts.challengeManager;

        confirmPeriodBlocks = config.confirmPeriodBlocks;
        chainId = config.chainId;
        baseStake = config.baseStake;
        wasmModuleRoot = config.wasmModuleRoot;
        // minimumAssertionPeriod was defaulted to 75 which is a little over 15 minutes
        minimumAssertionPeriod = config.minimumAssertionPeriod;
        // ValidatorAfkBlocks was defaulted to 201600 which is 28 days assuming a 12 seconds block time.
        // Since it can take 14 days under normal circumstances to confirm an assertion, this means
        // the validators will have been inactive for a further 14 days before the whitelist is removed.
        validatorAfkBlocks = config.validatorAfkBlocks;
        challengeGracePeriodBlocks = config.challengeGracePeriodBlocks;

        // loser stake is now sent directly to loserStakeEscrow, it must not
        // be address(0) because some token do not allow transfers to address(0)
        require(config.loserStakeEscrow != address(0), "INVALID_ESCROW_0");
        loserStakeEscrow = config.loserStakeEscrow;

        stakeToken = config.stakeToken;
        anyTrustFastConfirmer = config.anyTrustFastConfirmer;

        bytes32 parentAssertionHash = bytes32(0);
        bytes32 inboxAcc = bytes32(0);
        bytes32 genesisHash = RollupLib.assertionHash({
            parentAssertionHash: parentAssertionHash,
            afterStateHash: config.genesisAssertionState.hash(),
            inboxAcc: inboxAcc
        });

        uint256 currentInboxCount = bridge.sequencerMessageCount();
        // ensure to move the inbox forward by at least one message
        if (currentInboxCount == config.genesisInboxCount) {
            currentInboxCount += 1;
        }
        AssertionNode memory initialAssertion = AssertionNodeLib.createAssertion(
            true,
            RollupLib.configHash({
                wasmModuleRoot: wasmModuleRoot,
                requiredStake: baseStake,
                challengeManager: address(challengeManager),
                confirmPeriodBlocks: confirmPeriodBlocks,
                nextInboxPosition: uint64(currentInboxCount)
            })
        );
        initializeCore(initialAssertion, genesisHash);

        AssertionInputs memory assertionInputs;
        assertionInputs.afterState = config.genesisAssertionState;
        emit AssertionCreated(
            genesisHash,
            parentAssertionHash,
            assertionInputs,
            inboxAcc,
            currentInboxCount,
            wasmModuleRoot,
            baseStake,
            address(challengeManager),
            confirmPeriodBlocks
        );
        if (_hostChainIsArbitrum) {
            _assertionCreatedAtArbSysBlock[genesisHash] = ArbSys(address(100)).arbBlockNumber();
        }

        emit RollupInitialized(config.wasmModuleRoot, config.chainId);
    }

    /**
     * Functions are only to reach this logic contract if the caller is the owner
     * so there is no need for a redundant onlyOwner check
     */

    /**
     * @notice Add a contract authorized to put messages into this rollup's inbox
     * @param _outbox Outbox contract to add
     */
    function setOutbox(
        IOutbox _outbox
    ) external override {
        outbox = _outbox;
        bridge.setOutbox(address(_outbox), true);
        emit OutboxSet(address(_outbox));
        // previously: emit OwnerFunctionCalled(0);
    }

    /**
     * @notice Disable an old outbox from interacting with the bridge
     * @param _outbox Outbox contract to remove
     */
    function removeOldOutbox(
        address _outbox
    ) external override {
        require(_outbox != address(outbox), "CUR_OUTBOX");
        bridge.setOutbox(_outbox, false);
        emit OldOutboxRemoved(address(_outbox));
        // previously: emit OwnerFunctionCalled(1);
    }

    /**
     * @notice Enable or disable an inbox contract
     * @param _inbox Inbox contract to add or remove
     * @param _enabled New status of inbox
     */
    function setDelayedInbox(address _inbox, bool _enabled) external override {
        bridge.setDelayedInbox(address(_inbox), _enabled);
        emit DelayedInboxSet(address(_inbox), _enabled);
        // previously: emit OwnerFunctionCalled(2);
    }

    /**
     * @notice Pause interaction with the rollup contract.
     * The time spent paused is not incremented in the rollup's timing for assertion validation.
     * @dev this function may be frontrun by a validator (ie to create a assertion before the system is paused).
     * The pause should be called atomically with required checks to be sure the system is paused in a consistent state.
     * The RollupAdmin may execute a check against the Rollup's latest assertion num or the OldChallengeManager, then execute this function atomically with it.
     */
    function pause() external override {
        _pause();
        // previously: emit OwnerFunctionCalled(3);
    }

    /**
     * @notice Resume interaction with the rollup contract
     */
    function resume() external override {
        _unpause();
        // previously: emit OwnerFunctionCalled(4);
    }

    /// @notice allows the admin to upgrade the primary logic contract (ie rollup admin logic, aka this)
    /// @dev this function doesn't revert as this primary logic contract is only
    /// reachable by the proxy's admin
    function _authorizeUpgrade(
        address newImplementation
    ) internal override {}

    /// @notice allows the admin to upgrade the secondary logic contract (ie rollup user logic)
    /// @dev this function doesn't revert as this primary logic contract is only
    /// reachable by the proxy's admin
    function _authorizeSecondaryUpgrade(
        address newImplementation
    ) internal override {}

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
            if (_val[i]) validators.add(_validator[i]);
            else validators.remove(_validator[i]);
        }

        emit ValidatorsSet(_validator, _val);
        // previously: emit OwnerFunctionCalled(6);
    }

    /**
     * @notice Set a new owner address for the rollup
     * @dev it is expected that only the rollup admin can use this facet to set a new owner
     * @param newOwner address of new rollup owner
     */
    function setOwner(
        address newOwner
    ) external override {
        _changeAdmin(newOwner);
        // previously: emit OwnerFunctionCalled(7);
    }

    /**
     * @notice Set minimum assertion period for the rollup
     * @param newPeriod new minimum period for assertions
     */
    function setMinimumAssertionPeriod(
        uint256 newPeriod
    ) external override {
        minimumAssertionPeriod = newPeriod;
        emit MinimumAssertionPeriodSet(newPeriod);
        // previously: emit OwnerFunctionCalled(8);
    }

    /**
     * @notice Set validator afk blocks for the rollup
     * @param  newAfkBlocks new number of blocks before a validator is considered afk (0 to disable)
     * @dev    ValidatorAfkBlocks is the number of blocks since the last confirmed
     *         assertion (or its first child) before the validator whitelist is removed.
     *         It's important that this time is greater than the max amount of time it can take to
     *         to confirm an assertion via the normal method. Therefore we need it to be greater
     *         than max(2* confirmPeriod, 2 * challengePeriod) with some additional margin.
     */
    function setValidatorAfkBlocks(
        uint64 newAfkBlocks
    ) external override {
        validatorAfkBlocks = newAfkBlocks;
        emit ValidatorAfkBlocksSet(newAfkBlocks);
    }

    /**
     * @notice Set number of blocks until a assertion is considered confirmed
     * @param newConfirmPeriod new number of blocks
     */
    function setConfirmPeriodBlocks(
        uint64 newConfirmPeriod
    ) external override {
        require(newConfirmPeriod > 0, "INVALID_CONFIRM_PERIOD");
        confirmPeriodBlocks = newConfirmPeriod;
        emit ConfirmPeriodBlocksSet(newConfirmPeriod);
        // previously: emit OwnerFunctionCalled(9);
    }

    /**
     * @notice Set base stake required for an assertion
     * @param newBaseStake minimum amount of stake required
     */
    function setBaseStake(
        uint256 newBaseStake
    ) external override {
        // we do not currently allow base stake to be reduced since as doing so might allow a malicious party
        // to withdraw some (up to the difference between baseStake and newBaseStake) honest funds from this contract
        // The sequence of events is as follows:
        // 1. The malicious party creates a sibling assertion, stake size is currently S
        // 2. The base stake is then reduced to S'
        // 3. The malicious party uses a different address to create a child of the malicious assertion, using stake size S'
        // 4. This allows the malicious party to withdraw the stake S, since assertions with children set the staker to "inactive"
        require(newBaseStake > baseStake, "BASE_STAKE_MUST_BE_INCREASED");
        baseStake = newBaseStake;
        emit BaseStakeSet(newBaseStake);
        // previously: emit OwnerFunctionCalled(12);
    }

    function forceRefundStaker(
        address[] calldata staker
    ) external override whenPaused {
        require(staker.length > 0, "EMPTY_ARRAY");
        for (uint256 i = 0; i < staker.length; i++) {
            requireInactiveStaker(staker[i]);
            reduceStakeTo(staker[i], 0);
        }
        emit StakersForceRefunded(staker);
        // previously: emit OwnerFunctionCalled(22);
    }

    function forceCreateAssertion(
        bytes32 prevAssertionHash,
        AssertionInputs calldata assertion,
        bytes32 expectedAssertionHash
    ) external override whenPaused {
        // To update the wasm module root in the case of a bug:
        // 0. pause the contract
        // 1. update the wasm module root in the contract
        // 2. update the config hash of the assertion after which you wish to use the new wasm module root (functionality not written yet)
        // 3. force refund the stake of the current leaf assertion(s)
        // 4. create a new assertion using the assertion with the updated config has as a prev
        // 5. force confirm it - this is necessary to set latestConfirmed on the correct line
        // 6. unpause the contract

        // Normally, a new assertion is created using its prev's confirmPeriodBlocks
        // in the case of a force create, we use the rollup's current confirmPeriodBlocks
        createNewAssertion(assertion, prevAssertionHash, expectedAssertionHash);

        emit AssertionForceCreated(expectedAssertionHash);
        // previously: emit OwnerFunctionCalled(23);
    }

    function forceConfirmAssertion(
        bytes32 assertionHash,
        bytes32 parentAssertionHash,
        AssertionState calldata confirmState,
        bytes32 inboxAcc
    ) external override whenPaused {
        // this skip deadline, prev, challenge validations
        confirmAssertionInternal(assertionHash, parentAssertionHash, confirmState, inboxAcc);
        emit AssertionForceConfirmed(assertionHash);
        // previously: emit OwnerFunctionCalled(24);
    }

    function setLoserStakeEscrow(
        address newLoserStakerEscrow
    ) external override {
        // loser stake is now sent directly to loserStakeEscrow, it must not
        // be address(0) because some token do not allow transfers to address(0)
        require(newLoserStakerEscrow != address(0), "INVALID_ESCROW_0");
        loserStakeEscrow = newLoserStakerEscrow;
        emit LoserStakeEscrowSet(newLoserStakerEscrow);
        // previously: emit OwnerFunctionCalled(25);
    }

    /**
     * @notice Set the proving WASM module root
     * @param newWasmModuleRoot new module root
     */
    function setWasmModuleRoot(
        bytes32 newWasmModuleRoot
    ) external override {
        wasmModuleRoot = newWasmModuleRoot;
        emit WasmModuleRootSet(newWasmModuleRoot);
        // previously: emit OwnerFunctionCalled(26);
    }

    /**
     * @notice set a new sequencer inbox contract
     * @param _sequencerInbox new address of sequencer inbox
     */
    function setSequencerInbox(
        address _sequencerInbox
    ) external override {
        bridge.setSequencerInbox(_sequencerInbox);
        emit SequencerInboxSet(_sequencerInbox);
        // previously: emit OwnerFunctionCalled(27);
    }

    /**
     * @notice sets the rollup's inbox reference. Does not update the bridge's view.
     * @param newInbox new address of inbox
     */
    function setInbox(
        IInboxBase newInbox
    ) external {
        inbox = newInbox;
        emit InboxSet(address(newInbox));
        // previously: emit OwnerFunctionCalled(28);
    }

    /**
     * @notice set the validatorWhitelistDisabled flag
     * @param _validatorWhitelistDisabled new value of validatorWhitelistDisabled, i.e. true = disabled
     */
    function setValidatorWhitelistDisabled(
        bool _validatorWhitelistDisabled
    ) external {
        validatorWhitelistDisabled = _validatorWhitelistDisabled;
        emit ValidatorWhitelistDisabledSet(_validatorWhitelistDisabled);
        // previously: emit OwnerFunctionCalled(30);
    }

    /**
     * @notice set the anyTrustFastConfirmer address
     * @param _anyTrustFastConfirmer new value of anyTrustFastConfirmer
     */
    function setAnyTrustFastConfirmer(
        address _anyTrustFastConfirmer
    ) external {
        anyTrustFastConfirmer = _anyTrustFastConfirmer;
        emit AnyTrustFastConfirmerSet(_anyTrustFastConfirmer);
        // previously: emit OwnerFunctionCalled(31);
    }

    /**
     * @notice set a new challengeManager contract
     * @param _challengeManager new value of challengeManager
     */
    function setChallengeManager(
        address _challengeManager
    ) external {
        challengeManager = IEdgeChallengeManager(_challengeManager);
        emit ChallengeManagerSet(_challengeManager);
        // previously: emit OwnerFunctionCalled(32);
    }
}