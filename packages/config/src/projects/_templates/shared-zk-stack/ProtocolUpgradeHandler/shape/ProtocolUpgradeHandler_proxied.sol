// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

abstract contract Initializable {
    /**
     * @dev Storage of the initializable contract.
     *
     * It's implemented on a custom ERC-7201 namespace to reduce the risk of storage collisions
     * when using with upgradeable contracts.
     *
     * @custom:storage-location erc7201:openzeppelin.storage.Initializable
     */
    struct InitializableStorage {
        /**
         * @dev Indicates that the contract has been initialized.
         */
        uint64 _initialized;
        /**
         * @dev Indicates that the contract is in the process of being initialized.
         */
        bool _initializing;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Initializable")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant INITIALIZABLE_STORAGE = 0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00;

    /**
     * @dev The contract is already initialized.
     */
    error InvalidInitialization();

    /**
     * @dev The contract is not initializing.
     */
    error NotInitializing();

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint64 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that in the context of a constructor an `initializer` may be invoked any
     * number of times. This behavior in the constructor can be useful during testing and is not expected to be used in
     * production.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        // Cache values to avoid duplicated sloads
        bool isTopLevelCall = !$._initializing;
        uint64 initialized = $._initialized;

        // Allowed calls:
        // - initialSetup: the contract is not in the initializing state and no previous version was
        //                 initialized
        // - construction: the contract is initialized at version 1 (no reininitialization) and the
        //                 current contract is just being deployed
        bool initialSetup = initialized == 0 && isTopLevelCall;
        bool construction = initialized == 1 && address(this).code.length == 0;

        if (!initialSetup && !construction) {
            revert InvalidInitialization();
        }
        $._initialized = 1;
        if (isTopLevelCall) {
            $._initializing = true;
        }
        _;
        if (isTopLevelCall) {
            $._initializing = false;
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
     * WARNING: Setting the version to 2**64 - 1 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint64 version) {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        if ($._initializing || $._initialized >= version) {
            revert InvalidInitialization();
        }
        $._initialized = version;
        $._initializing = true;
        _;
        $._initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        _checkInitializing();
        _;
    }

    /**
     * @dev Reverts if the contract is not in an initializing state. See {onlyInitializing}.
     */
    function _checkInitializing() internal view virtual {
        if (!_isInitializing()) {
            revert NotInitializing();
        }
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
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        if ($._initializing) {
            revert InvalidInitialization();
        }
        if ($._initialized != type(uint64).max) {
            $._initialized = type(uint64).max;
            emit Initialized(type(uint64).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint64) {
        return _getInitializableStorage()._initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _getInitializableStorage()._initializing;
    }

    /**
     * @dev Returns a pointer to the storage namespace.
     */
    // solhint-disable-next-line var-name-mixedcase
    function _getInitializableStorage() private pure returns (InitializableStorage storage $) {
        assembly {
            $.slot := INITIALIZABLE_STORAGE
        }
    }
}

interface IProtocolUpgradeHandler {
    /// @dev This enumeration includes the following states:
    /// @param None Default state, indicating the upgrade has not been set.
    /// @param LegalVetoPeriod The upgrade passed L2 voting process but it is waiting for the legal veto period.
    /// @param Waiting The upgrade passed Legal Veto period but it is waiting for the approval from guardians or Security Council.
    /// @param ExecutionPending The upgrade proposal is waiting for the delay period before being ready for execution.
    /// @param Ready The upgrade proposal is ready to be executed.
    /// @param Expired The upgrade proposal was expired.
    /// @param Done The upgrade has been successfully executed.
    enum UpgradeState {
        None,
        LegalVetoPeriod,
        Waiting,
        ExecutionPending,
        Ready,
        Expired,
        Done
    }

    /// @dev Represents the status of an upgrade process, including the creation timestamp and actions made by guardians and Security Council.
    /// @param creationTimestamp The timestamp (in seconds) when the upgrade state was created.
    /// @param securityCouncilApprovalTimestamp The timestamp (in seconds) when Security Council approved the upgrade.
    /// @param guardiansApproval Indicates whether the upgrade has been approved by the guardians.
    /// @param guardiansExtendedLegalVeto Indicates whether guardians extended the legal veto period.
    /// @param executed Indicates whether the proposal is executed or not.
    struct UpgradeStatus {
        uint48 creationTimestamp;
        uint48 securityCouncilApprovalTimestamp;
        bool guardiansApproval;
        bool guardiansExtendedLegalVeto;
        bool executed;
    }

    /// @dev Represents a call to be made during an upgrade.
    /// @param target The address to which the call will be made.
    /// @param value The amount of Ether (in wei) to be sent along with the call.
    /// @param data The calldata to be executed on the `target` address.
    struct Call {
        address target;
        uint256 value;
        bytes data;
    }

    /// @dev Defines the structure of an upgrade that is executed by Protocol Upgrade Handler.
    /// @param executor The L1 address that is authorized to perform the upgrade execution (if address(0) then anyone).
    /// @param calls An array of `Call` structs, each representing a call to be made during the upgrade execution.
    /// @param salt A bytes32 value used for creating unique upgrade proposal hashes.
    struct UpgradeProposal {
        Call[] calls;
        address executor;
        bytes32 salt;
    }

    /// @dev This enumeration includes the following states:
    /// @param None Default state, indicating the freeze has not been happening in this upgrade cycle.
    /// @param Soft The protocol is/was frozen for the short time.
    /// @param Hard The protocol is/was frozen for the long time.
    /// @param AfterSoftFreeze The protocol was soft frozen, it can be hard frozen in this upgrade cycle.
    /// @param AfterHardFreeze The protocol was hard frozen, but now it can't be frozen until the upgrade.
    enum FreezeStatus {
        None,
        Soft,
        Hard,
        AfterSoftFreeze,
        AfterHardFreeze
    }

    function startUpgrade(
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _proof,
        UpgradeProposal calldata _proposal
    ) external;

    function extendLegalVeto(bytes32 _id) external;

    function approveUpgradeSecurityCouncil(bytes32 _id) external;

    function approveUpgradeGuardians(bytes32 _id) external;

    function execute(UpgradeProposal calldata _proposal) external payable;

    function executeEmergencyUpgrade(UpgradeProposal calldata _proposal) external payable;

    function softFreeze() external;

    function hardFreeze() external;

    function reinforceFreeze() external;

    function unfreeze() external;

    function reinforceFreezeOneChain(uint256 _chainId) external;

    function reinforceUnfreeze() external;

    function reinforceUnfreezeOneChain(uint256 _chainId) external;

    function upgradeState(bytes32 _id) external view returns (UpgradeState);

    function updateSecurityCouncil(address _newSecurityCouncil) external;

    function updateGuardians(address _newGuardians) external;

    function updateEmergencyUpgradeBoard(address _newEmergencyUpgradeBoard) external;

    /// @notice Emitted when the security council address is changed.
    event ChangeSecurityCouncil(address indexed _securityCouncilBefore, address indexed _securityCouncilAfter);

    /// @notice Emitted when the guardians address is changed.
    event ChangeGuardians(address indexed _guardiansBefore, address indexed _guardiansAfter);

    /// @notice Emitted when the emergency upgrade board address is changed.
    event ChangeEmergencyUpgradeBoard(
        address indexed _emergencyUpgradeBoardBefore, address indexed _emergencyUpgradeBoardAfter
    );

    /// @notice Emitted when upgrade process on L1 is started.
    event UpgradeStarted(bytes32 indexed _id, UpgradeProposal _proposal);

    /// @notice Emitted when the legal veto period is extended.
    event UpgradeLegalVetoExtended(bytes32 indexed _id);

    /// @notice Emitted when Security Council approved the upgrade.
    event UpgradeApprovedBySecurityCouncil(bytes32 indexed _id);

    /// @notice Emitted when Guardians approved the upgrade.
    event UpgradeApprovedByGuardians(bytes32 indexed _id);

    /// @notice Emitted when the upgrade is executed.
    event UpgradeExecuted(bytes32 indexed _id);

    /// @notice Emitted when the emergency upgrade is executed.
    event EmergencyUpgradeExecuted(bytes32 indexed _id);

    /// @notice Emitted when the protocol became soft frozen.
    event SoftFreeze(uint256 _protocolFrozenUntil);

    /// @notice Emitted when the protocol became hard frozen.
    event HardFreeze(uint256 _protocolFrozenUntil);

    /// @notice Emitted when someone makes an attempt to freeze the protocol when it is frozen already.
    event ReinforceFreeze();

    /// @notice Emitted when the protocol became active after the soft/hard freeze.
    event Unfreeze();

    /// @notice Emitted when someone makes an attempt to freeze the specific chain when the protocol is frozen already.
    event ReinforceFreezeOneChain(uint256 _chainId);

    /// @notice Emitted when someone makes an attempt to unfreeze the protocol when it is unfrozen already.
    event ReinforceUnfreeze();

    /// @notice Emitted when someone makes an attempt to unfreeze the specific chain when the protocol is unfrozen already.
    event ReinforceUnfreezeOneChain(uint256 _chainId);
}

contract ProtocolUpgradeHandler is IProtocolUpgradeHandler, Initializable {
    /// @dev Duration of the standard legal veto period.
    /// Note: this value should not exceed EXTENDED_LEGAL_VETO_PERIOD.
    function STANDARD_LEGAL_VETO_PERIOD() internal pure virtual returns (uint256) {
        return 3 days;
    }

    /// @dev Duration of the extended legal veto period.
    uint256 internal constant EXTENDED_LEGAL_VETO_PERIOD = 7 days;

    /// @dev The mandatory delay period before an upgrade can be executed.
    /// This period is intended to provide a buffer after an upgrade's final approval and before its execution,
    /// allowing for final reviews and preparations for devs and users.
    function UPGRADE_DELAY_PERIOD() internal pure virtual returns (uint256) {
        return 1 days;
    }

    /// @dev Time limit for an upgrade proposal to be approved by guardians or expire, and the waiting period for execution post-guardians approval.
    /// If the Security Council approves, the upgrade can proceed immediately; otherwise,
    /// the proposal will expire after this period if not approved, or wait this period after guardians approval.
    uint256 internal constant UPGRADE_WAIT_OR_EXPIRE_PERIOD = 30 days;

    /// @dev Duration of a soft freeze which temporarily pause protocol contract functionality.
    /// This freeze window is needed for the Security Council to decide whether they want to
    /// do hard freeze and protocol upgrade.
    uint256 internal constant SOFT_FREEZE_PERIOD = 12 hours;

    /// @dev Duration of a hard freeze which temporarily pause protocol contract functionality.
    /// This freeze window is needed for the Security Council to perform emergency protocol upgrade.
    uint256 internal constant HARD_FREEZE_PERIOD = 7 days;

    /// @dev Address of the L2 Protocol Governor contract.
    /// This address is used to interface with governance actions initiated on Layer 2,
    /// specifically for proposing and approving protocol upgrades.
    address public immutable L2_PROTOCOL_GOVERNOR;

    /// @dev ZKsync smart contract that used to operate with L2 via asynchronous L2 <-> L1 communication.
    IZKsyncEra public immutable ZKSYNC_ERA;

    /// @dev ZKsync smart contract that is responsible for creating new hyperchains and changing parameters in existent.
    IStateTransitionManager public immutable STATE_TRANSITION_MANAGER;

    /// @dev Bridgehub smart contract that is used to operate with L2 via asynchronous L2 <-> L1 communication.
    IPausable public immutable BRIDGE_HUB;

    /// @dev The shared bridge that is used for all bridging.
    IPausable public immutable SHARED_BRIDGE;

    /// @notice The address of the Security Council.
    address public securityCouncil;

    /// @notice The address of the guardians.
    address public guardians;

    /// @notice The address of the smart contract that can execute protocol emergency upgrade.
    address public emergencyUpgradeBoard;

    /// @notice A mapping to store status of an upgrade process for each upgrade ID.
    mapping(bytes32 upgradeId => UpgradeStatus) public upgradeStatus;

    /// @notice Tracks the last freeze type within an upgrade cycle.
    FreezeStatus public lastFreezeStatusInUpgradeCycle;

    /// @notice Stores the timestamp until which the protocol remains frozen.
    uint256 public protocolFrozenUntil;

    /// @notice Initializes the contract with the Security Council address, guardians address and address of L2 voting governor.
    /// @param _l2ProtocolGovernor The address of the L2 voting governor contract for protocol upgrades.
    /// @param _ZKsyncEra The address of the zkSync Era chain, on top of which the `_l2ProtocolGovernor` is deployed.
    /// @param _stateTransitionManager The address of the state transition manager.
    /// @param _bridgeHub The address of the bridgehub.
    /// @param _sharedBridge The address of the shared bridge.
    constructor(
        address _l2ProtocolGovernor,
        IZKsyncEra _ZKsyncEra,
        IStateTransitionManager _stateTransitionManager,
        IPausable _bridgeHub,
        IPausable _sharedBridge
    ) {
        _disableInitializers();

        // Soft configuration check for contracts that inherit this contract.
        assert(STANDARD_LEGAL_VETO_PERIOD() <= EXTENDED_LEGAL_VETO_PERIOD);

        L2_PROTOCOL_GOVERNOR = _l2ProtocolGovernor;
        ZKSYNC_ERA = _ZKsyncEra;
        STATE_TRANSITION_MANAGER = _stateTransitionManager;
        BRIDGE_HUB = _bridgeHub;
        SHARED_BRIDGE = _sharedBridge;
    }

    /*//////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Checks that the message sender is contract itself.
    modifier onlySelf() {
        require(msg.sender == address(this), "Only upgrade handler contract itself is allowed to call this function");
        _;
    }

    /// @notice Checks that the message sender is an active Security Council.
    modifier onlySecurityCouncil() {
        require(msg.sender == securityCouncil, "Only Security Council is allowed to call this function");
        _;
    }

    /// @notice Checks that the message sender is an active guardians.
    modifier onlyGuardians() {
        require(msg.sender == guardians, "Only guardians is allowed to call this function");
        _;
    }

    /// @notice Checks that the message sender is an active Security Council or the protocol is frozen but freeze period expired.
    modifier onlySecurityCouncilOrProtocolFreezeExpired() {
        require(
            msg.sender == securityCouncil || (protocolFrozenUntil != 0 && block.timestamp > protocolFrozenUntil),
            "Only Security Council is allowed to call this function or the protocol should be frozen"
        );
        _;
    }

    /// @notice Checks that the message sender is an Emergency Upgrade Board.
    modifier onlyEmergencyUpgradeBoard() {
        require(msg.sender == emergencyUpgradeBoard, "Only Emergency Upgrade Board is allowed to call this function");
        _;
    }

    /// @notice Calculates the current upgrade state for the specified upgrade ID.
    /// @param _id The unique identifier of the upgrade proposal to be approved.
    function upgradeState(bytes32 _id) public view returns (UpgradeState) {
        UpgradeStatus memory upg = upgradeStatus[_id];
        // Upgrade already executed
        if (upg.executed) {
            return UpgradeState.Done;
        }

        // Upgrade doesn't exist
        if (upg.creationTimestamp == 0) {
            return UpgradeState.None;
        }

        // Legal veto period
        uint256 legalVetoTime =
            upg.guardiansExtendedLegalVeto ? EXTENDED_LEGAL_VETO_PERIOD : STANDARD_LEGAL_VETO_PERIOD();
        if (block.timestamp < upg.creationTimestamp + legalVetoTime) {
            return UpgradeState.LegalVetoPeriod;
        }

        // Security council approval case
        if (upg.securityCouncilApprovalTimestamp != 0) {
            uint256 readyWithSecurityCouncilTimestamp = upg.securityCouncilApprovalTimestamp + UPGRADE_DELAY_PERIOD();
            return block.timestamp >= readyWithSecurityCouncilTimestamp
                ? UpgradeState.Ready
                : UpgradeState.ExecutionPending;
        }

        uint256 waitOrExpiryTimestamp = upg.creationTimestamp + legalVetoTime + UPGRADE_WAIT_OR_EXPIRE_PERIOD;
        if (block.timestamp >= waitOrExpiryTimestamp) {
            if (!upg.guardiansApproval) {
                return UpgradeState.Expired;
            }

            uint256 readyWithGuardiansTimestamp = waitOrExpiryTimestamp + UPGRADE_DELAY_PERIOD();
            return block.timestamp >= readyWithGuardiansTimestamp ? UpgradeState.Ready : UpgradeState.ExecutionPending;
        }

        return UpgradeState.Waiting;
    }

    /*//////////////////////////////////////////////////////////////
                            UPGRADE PROCESS
    //////////////////////////////////////////////////////////////*/

    /// @notice Initiates the upgrade process by verifying an L2 voting decision.
    /// @dev This function decodes and validates an upgrade proposal message from L2, setting the initial state for the upgrade process.
    /// @param _l2BatchNumber The batch number of the L2 transaction containing the upgrade proposal.
    /// @param _l2MessageIndex The index of the message within the L2 batch.
    /// @param _l2TxNumberInBatch The transaction number of the upgrade proposal in the L2 batch.
    /// @param _proof Merkle proof verifying the inclusion of the upgrade message in the L2 batch.
    /// @param _proposal The upgrade proposal details including proposed actions and the executor address.
    function startUpgrade(
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _proof,
        UpgradeProposal calldata _proposal
    ) external {
        bytes memory upgradeMessage = abi.encode(_proposal);
        IZKsyncEra.L2Message memory l2ToL1Message = IZKsyncEra.L2Message({
            txNumberInBatch: _l2TxNumberInBatch,
            sender: L2_PROTOCOL_GOVERNOR,
            data: upgradeMessage
        });
        bool success = ZKSYNC_ERA.proveL2MessageInclusion(_l2BatchNumber, _l2MessageIndex, l2ToL1Message, _proof);
        require(success, "Failed to check upgrade proposal initiation");
        require(_proposal.executor != emergencyUpgradeBoard, "Emergency Upgrade Board can't execute usual upgrade");

        bytes32 id = keccak256(upgradeMessage);
        UpgradeState upgState = upgradeState(id);
        require(upgState == UpgradeState.None, "Upgrade with this id already exists");

        upgradeStatus[id].creationTimestamp = uint48(block.timestamp);
        emit UpgradeStarted(id, _proposal);
    }

    /// @notice Extends the legal veto period by the guardians.
    /// @param _id The unique identifier of the upgrade proposal to be approved.
    function extendLegalVeto(bytes32 _id) external onlyGuardians {
        require(!upgradeStatus[_id].guardiansExtendedLegalVeto, "Legal veto period is already extended");
        UpgradeState upgState = upgradeState(_id);
        require(upgState == UpgradeState.LegalVetoPeriod, "Upgrade with this id is not in the legal veto period");
        upgradeStatus[_id].guardiansExtendedLegalVeto = true;

        emit UpgradeLegalVetoExtended(_id);
    }

    /// @notice Approves an upgrade proposal by the Security Council.
    /// @dev Transitions the state of an upgrade proposal to 'VetoPeriod' after approval by the Security Council.
    /// @param _id The unique identifier of the upgrade proposal to be approved.
    function approveUpgradeSecurityCouncil(bytes32 _id) external onlySecurityCouncil {
        UpgradeState upgState = upgradeState(_id);
        require(
            upgState == UpgradeState.Waiting,
            "Upgrade with this id is not waiting for the approval from Security Council"
        );
        upgradeStatus[_id].securityCouncilApprovalTimestamp = uint48(block.timestamp);

        emit UpgradeApprovedBySecurityCouncil(_id);
    }

    /// @notice Approves an upgrade proposal by the guardians.
    /// @dev Marks the upgrade proposal identified by `_id` as approved by guardians.
    /// @param _id The unique identifier of the upgrade proposal to approve.
    function approveUpgradeGuardians(bytes32 _id) external onlyGuardians {
        require(!upgradeStatus[_id].guardiansApproval, "Upgrade is already approved by guardians");

        UpgradeState upgState = upgradeState(_id);
        require(upgState == UpgradeState.Waiting, "Upgrade with this id is not waiting for the approval from Guardians");
        upgradeStatus[_id].guardiansApproval = true;

        emit UpgradeApprovedByGuardians(_id);
    }

    /// @notice Executes an upgrade proposal that has reached the 'Ready' state.
    /// @param _proposal The upgrade proposal to be executed, containing the target calls and optionally an executor.
    function execute(UpgradeProposal calldata _proposal) external payable {
        bytes32 id = keccak256(abi.encode(_proposal));
        UpgradeState upgState = upgradeState(id);
        // 1. Checks
        require(upgState == UpgradeState.Ready, "Upgrade is not yet ready");
        require(
            _proposal.executor == address(0) || _proposal.executor == msg.sender,
            "msg.sender is not authorized to perform the upgrade"
        );
        // 2. Effects
        upgradeStatus[id].executed = true;
        // 3. Interactions
        _execute(_proposal.calls);
        emit UpgradeExecuted(id);
    }

    /// @notice Executes an emergency upgrade proposal initiated by the emergency upgrade board.
    /// @param _proposal The upgrade proposal details including proposed actions and the executor address.
    function executeEmergencyUpgrade(UpgradeProposal calldata _proposal) external payable onlyEmergencyUpgradeBoard {
        bytes32 id = keccak256(abi.encode(_proposal));
        UpgradeState upgState = upgradeState(id);
        // 1. Checks
        require(upgState == UpgradeState.None, "Upgrade already exists");
        require(_proposal.executor == msg.sender, "msg.sender is not authorized to perform the upgrade");
        // 2. Effects
        upgradeStatus[id].executed = true;
        // Clear the freeze
        lastFreezeStatusInUpgradeCycle = FreezeStatus.None;
        protocolFrozenUntil = 0;
        _unfreeze();
        // 3. Interactions
        _execute(_proposal.calls);
        emit Unfreeze();
        emit EmergencyUpgradeExecuted(id);
    }

    /*//////////////////////////////////////////////////////////////
                            HELPERS
    //////////////////////////////////////////////////////////////*/

    /// @dev Execute an upgrade's calls.
    /// @param _calls The array of calls to be executed.
    function _execute(Call[] calldata _calls) internal {
        for (uint256 i = 0; i < _calls.length; ++i) {
            if (_calls[i].data.length > 0) {
                require(
                    _calls[i].target.code.length > 0, "Target must be a smart contract if the calldata is not empty"
                );
            }
            (bool success, bytes memory returnData) = _calls[i].target.call{value: _calls[i].value}(_calls[i].data);
            if (!success) {
                // Propagate an error if the call fails.
                assembly {
                    revert(add(returnData, 0x20), mload(returnData))
                }
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                            FREEZABILITY
    //////////////////////////////////////////////////////////////*/

    /// @notice Initiates a soft protocol freeze.
    function softFreeze() external onlySecurityCouncil {
        require(lastFreezeStatusInUpgradeCycle == FreezeStatus.None, "Protocol already frozen");
        lastFreezeStatusInUpgradeCycle = FreezeStatus.Soft;
        protocolFrozenUntil = block.timestamp + SOFT_FREEZE_PERIOD;
        _freeze();
        emit SoftFreeze(protocolFrozenUntil);
    }

    /// @notice Initiates a hard protocol freeze.
    function hardFreeze() external onlySecurityCouncil {
        FreezeStatus freezeStatus = lastFreezeStatusInUpgradeCycle;
        require(
            freezeStatus == FreezeStatus.None || freezeStatus == FreezeStatus.Soft
                || freezeStatus == FreezeStatus.AfterSoftFreeze,
            "Protocol can't be hard frozen"
        );
        lastFreezeStatusInUpgradeCycle = FreezeStatus.Hard;
        protocolFrozenUntil = block.timestamp + HARD_FREEZE_PERIOD;
        _freeze();
        emit HardFreeze(protocolFrozenUntil);
    }

    /// @dev Reinforces the freezing state of the protocol if it is already within the frozen period. This function
    /// can be called by anyone to ensure the protocol remains in a frozen state, particularly useful if there is a need
    /// to confirm or re-apply the freeze due to partial or incomplete application during the initial freeze.
    function reinforceFreeze() external {
        require(block.timestamp <= protocolFrozenUntil, "Protocol should be already frozen");
        _freeze();
        emit ReinforceFreeze();
    }

    /// @dev Reinforces the freezing state of the specific chain if the protocol is already within the frozen period.
    /// The function is an analog of `reinforceFreeze` but only for one specific chain, needed in the
    /// rare case where the execution could get stuck at a particular ID for some unforeseen reason.
    function reinforceFreezeOneChain(uint256 _chainId) external {
        require(block.timestamp <= protocolFrozenUntil, "Protocol should be already frozen");
        STATE_TRANSITION_MANAGER.freezeChain(_chainId);
        emit ReinforceFreezeOneChain(_chainId);
    }

    /// @dev Freeze all ZKsync contracts, including bridges, state transition managers and all hyperchains.
    function _freeze() internal {
        uint256[] memory hyperchainIds = STATE_TRANSITION_MANAGER.getAllHyperchainChainIDs();
        uint256 len = hyperchainIds.length;
        for (uint256 i = 0; i < len; ++i) {
            try STATE_TRANSITION_MANAGER.freezeChain(hyperchainIds[i]) {} catch {}
        }

        try BRIDGE_HUB.pause() {} catch {}
        try SHARED_BRIDGE.pause() {} catch {}
    }

    /// @dev Unfreezes the protocol and resumes normal operations.
    function unfreeze() external onlySecurityCouncilOrProtocolFreezeExpired {
        if (lastFreezeStatusInUpgradeCycle == FreezeStatus.Soft) {
            lastFreezeStatusInUpgradeCycle = FreezeStatus.AfterSoftFreeze;
        } else if (lastFreezeStatusInUpgradeCycle == FreezeStatus.Hard) {
            lastFreezeStatusInUpgradeCycle = FreezeStatus.AfterHardFreeze;
        } else {
            revert("Unexpected last freeze status");
        }
        protocolFrozenUntil = 0;
        _unfreeze();
        emit Unfreeze();
    }

    /// @dev Reinforces the unfreeze for protocol if it is not in the freeze mode. This function can be called
    /// by anyone to ensure the protocol remains in an unfrozen state, particularly useful if there is a need
    /// to confirm or re-apply the unfreeze due to partial or incomplete application during the initial unfreeze.
    function reinforceUnfreeze() external {
        require(protocolFrozenUntil == 0, "Protocol should be already unfrozen");
        _unfreeze();
        emit ReinforceUnfreeze();
    }

    /// @dev Reinforces the unfreeze for one specific chain if the protocol is not in the freeze mode.
    /// The function is an analog of `reinforceUnfreeze` but only for one specific chain, needed in the
    /// rare case where the execution could get stuck at a particular ID for some unforeseen reason.
    function reinforceUnfreezeOneChain(uint256 _chainId) external {
        require(protocolFrozenUntil == 0, "Protocol should be already unfrozen");
        STATE_TRANSITION_MANAGER.unfreezeChain(_chainId);
        emit ReinforceUnfreezeOneChain(_chainId);
    }

    /// @dev Unfreeze all ZKsync contracts, including bridges, state transition managers and all hyperchains.
    function _unfreeze() internal {
        uint256[] memory hyperchainIds = STATE_TRANSITION_MANAGER.getAllHyperchainChainIDs();
        uint256 len = hyperchainIds.length;
        for (uint256 i = 0; i < len; ++i) {
            try STATE_TRANSITION_MANAGER.unfreezeChain(hyperchainIds[i]) {} catch {}
        }

        try BRIDGE_HUB.unpause() {} catch {}
        try SHARED_BRIDGE.unpause() {} catch {}
    }

    /*//////////////////////////////////////////////////////////////
                            SELF UPGRADES
    //////////////////////////////////////////////////////////////*/

    /// @dev Updates the address of the Security Council.
    /// @param _newSecurityCouncil The address of the new Security Council.
    function updateSecurityCouncil(address _newSecurityCouncil) external onlySelf {
        emit ChangeSecurityCouncil(securityCouncil, _newSecurityCouncil);
        securityCouncil = _newSecurityCouncil;
    }

    /// @dev Updates the address of the guardians.
    /// @param _newGuardians The address of the guardians.
    function updateGuardians(address _newGuardians) external onlySelf {
        emit ChangeGuardians(guardians, _newGuardians);
        guardians = _newGuardians;
    }

    /// @dev Updates the address of the emergency upgrade board.
    /// @param _newEmergencyUpgradeBoard The address of the guardians.
    function updateEmergencyUpgradeBoard(address _newEmergencyUpgradeBoard) external onlySelf {
        emit ChangeEmergencyUpgradeBoard(emergencyUpgradeBoard, _newEmergencyUpgradeBoard);
        emergencyUpgradeBoard = _newEmergencyUpgradeBoard;
    }

    /*//////////////////////////////////////////////////////////////
                            FALLBACK
    //////////////////////////////////////////////////////////////*/

    /// @dev Contract might receive/hold ETH as part of the maintenance process.
    receive() external payable {}

    /*//////////////////////////////////////////////////////////////
                        PROXY INITIALIZER
    //////////////////////////////////////////////////////////////*/
    function initialize(
        address _securityCouncil,
        address _guardians,
        address _emergencyUpgradeBoard
    ) external initializer() {
        securityCouncil = _securityCouncil;
        emit ChangeSecurityCouncil(address(0), _securityCouncil);

        guardians = _guardians;
        emit ChangeGuardians(address(0), _guardians);

        emergencyUpgradeBoard = _emergencyUpgradeBoard;
        emit ChangeEmergencyUpgradeBoard(address(0), _emergencyUpgradeBoard);
    }
}