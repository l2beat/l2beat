// SPDX-License-Identifier: Unknown
pragma solidity 0.5.15;

library Addresses {
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}

contract MGovernance {
    /*
      Allows calling the function only by a Governor.
    */
    modifier onlyGovernance()
    {
        // Pure modifier declarations are not supported. Instead we provide
        // a dummy definition.
        revert("UNIMPLEMENTED");
        _;
    }
}

contract Governance is GovernanceStorage, MGovernance {
    event LogNominatedGovernor(address nominatedGovernor);
    event LogNewGovernorAccepted(address acceptedGovernor);
    event LogRemovedGovernor(address removedGovernor);
    event LogNominationCancelled();

    address internal constant ZERO_ADDRESS = address(0x0);

    /*
      Returns a string which uniquely identifies the type of the governance mechanism.
    */
    function getGovernanceTag()
        internal
        view
        returns (string memory);

    /*
      Returns the GovernanceInfoStruct associated with the governance tag.
    */
    function contractGovernanceInfo()
        internal
        view
        returns (GovernanceInfoStruct storage) {
        string memory tag = getGovernanceTag();
        GovernanceInfoStruct storage gub = governanceInfo[tag];
        require(gub.initialized == true, "NOT_INITIALIZED");
        return gub;
    }

    function initGovernance()
        internal
    {
        string memory tag = getGovernanceTag();
        GovernanceInfoStruct storage gub = governanceInfo[tag];
        require(gub.initialized == false, "ALREADY_INITIALIZED");
        gub.initialized = true;  // to ensure addGovernor() won't fail.
        // Add the initial governer.
        addGovernor(msg.sender);
    }

    modifier onlyGovernance()
    {
        require(isGovernor(msg.sender), "ONLY_GOVERNANCE");
        _;
    }

    function isGovernor(address testGovernor)
        internal view
        returns (bool addressIsGovernor){
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        addressIsGovernor = gub.effectiveGovernors[testGovernor];
    }

    /*
      Cancels the nomination of a governor condidate.
    */
    function cancelNomination() internal onlyGovernance() {
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        gub.candidateGovernor = ZERO_ADDRESS;
        emit LogNominationCancelled();
    }

    function nominateNewGovernor(address newGovernor) internal onlyGovernance() {
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        require(isGovernor(newGovernor) == false, "ALREADY_GOVERNOR");
        gub.candidateGovernor = newGovernor;
        emit LogNominatedGovernor(newGovernor);
    }

    /*
      The addGovernor is called in two cases:
      1. by acceptGovernance when a new governor accepts its role.
      2. by initGovernance to add the initial governor.
      The difference is that the init path skips the nominate step
      that would fail because of the onlyGovernance modifier.
    */
    function addGovernor(address newGovernor) private {
        require(isGovernor(newGovernor) == false, "ALREADY_GOVERNOR");
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        gub.effectiveGovernors[newGovernor] = true;
    }

    function acceptGovernance()
        internal
    {
        // The new governor was proposed as a candidate by the current governor.
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        require(msg.sender == gub.candidateGovernor, "ONLY_CANDIDATE_GOVERNOR");

        // Update state.
        addGovernor(gub.candidateGovernor);
        gub.candidateGovernor = ZERO_ADDRESS;

        // Send a notification about the change of governor.
        emit LogNewGovernorAccepted(msg.sender);
    }

    /*
      Remove a governor from office.
    */
    function removeGovernor(address governorForRemoval) internal onlyGovernance() {
        require(msg.sender != governorForRemoval, "GOVERNOR_SELF_REMOVE");
        GovernanceInfoStruct storage gub = contractGovernanceInfo();
        require (isGovernor(governorForRemoval), "NOT_GOVERNOR");
        gub.effectiveGovernors[governorForRemoval] = false;
        emit LogRemovedGovernor(governorForRemoval);
    }
}

contract ProxyGovernance is Governance {

    // The tag is the string key that is used in the Governance storage mapping.
    string public constant PROXY_GOVERNANCE_TAG = "StarkEx.Proxy.2019.GovernorsInformation";

    function getGovernanceTag()
        internal
        view
        returns (string memory tag) {
        tag = PROXY_GOVERNANCE_TAG;
    }

    function proxyIsGovernor(address testGovernor) external view returns (bool) {
        return isGovernor(testGovernor);
    }

    function proxyNominateNewGovernor(address newGovernor) external {
        nominateNewGovernor(newGovernor);
    }

    function proxyRemoveGovernor(address governorForRemoval) external {
        removeGovernor(governorForRemoval);
    }

    function proxyAcceptGovernance()
        external
    {
        acceptGovernance();
    }

    function proxyCancelNomination() external {
        cancelNomination();
    }
}

contract GovernanceStorage {

    struct GovernanceInfoStruct {
        mapping (address => bool) effectiveGovernors;
        address candidateGovernor;
        bool initialized;
    }

    // A map from a Governor tag to its own GovernanceInfoStruct.
    mapping (string => GovernanceInfoStruct) internal governanceInfo;
}

contract ProxyStorage is GovernanceStorage {

    // Stores the hash of the initialization vector of the added implementation.
    // Upon upgradeTo the implementation, the initialization vector is verified
    // to be identical to the one submitted when adding the implementaion.
    mapping (address => bytes32) internal initializationHash;

    // The time after which we can switch to the implementation.
    mapping (address => uint256) internal enabledTime;

    // A central storage of the flags whether implementation has been initialized.
    // Note - it can be used flexibly enough to accomodate multiple level of initialization
    // (i.e. using different key salting schemes for different initialization levels).
    mapping (bytes32 => bool) internal initialized;
}

contract Proxy is ProxyStorage, ProxyGovernance {

    // Emitted when the active implementation is replaced.
    event Upgraded(address indexed implementation);

    // Emitted when an implementation is submitted as an upgrade candidate and a time lock
    // is activated.
    event ImplementationAdded(address indexed implementation, bytes initializer, bool finalize);

    // Emitted when an implementation is removed from the list of upgrade candidates.
    event ImplementationRemoved(address indexed implementation);

    // Emitted when the implementation is finalized.
    event FinalizedImplementation(address indexed implementation);

    // Storage slot with the address of the current implementation.
    // The address of the slot is keccak256("StarkWare2019.implemntation-slot").
    // We need to keep this variable stored outside of the commonly used space,
    // so that it's not overrun by the logical implementaiton (the proxied contract).
    bytes32 internal constant IMPLEMENTATION_SLOT =
    0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24;

    // This storage slot stores the finalization flag.
    // Once the value stored in this slot is set to non-zero
    // the proxy blocks implementation upgrades.
    // The current implementation is then referred to as Finalized.
    // Web3.solidityKeccak(['string'], ["StarkWare2019.finalization-flag-slot"]).
    bytes32 internal constant FINALIZED_STATE_SLOT =
    0x7d433c6f837e8f93009937c466c82efbb5ba621fae36886d0cac433c5d0aa7d2;
    uint256 public constant UPGRADE_ACTIVATION_DELAY = 28 days;

    using Addresses for address;

    constructor ( )
        public
    {
        initGovernance();
    }

    /*
      Returns true if the implementation is frozen.
      If the implementation was not assigned yet, returns false.
    */
    function implementationIsFrozen() private returns (bool) {
        address _implementation = implementation();

        // We can't call low level implementation before it's assigned. (i.e. ZERO).
        if (_implementation == ZERO_ADDRESS) {
            return false;
        }
        // solium-disable-next-line security/no-low-level-calls
        (bool success, bytes memory returndata) = _implementation.delegatecall(
            abi.encodeWithSignature("isFrozen()"));
        require(success, string(returndata));
        return abi.decode(returndata, (bool));
    }

    /*
      This method blocks delegation to initialize().
      Only upgradeTo should be able to delegate call to initialize().
    */
    function initialize(bytes calldata /*data*/)
        external pure
    {
        revert("CANNOT_CALL_INITIALIZE");
    }

    modifier notFinalized()
    {
        require(isNotFinalized(), "IMPLEMENTATION_FINALIZED");
        _;
    }

    /*
      Forbids calling the function if the implementation is frozen.
      This modifier relies on the lower level (logical contract) implementation of isFrozen().
    */
    modifier notFrozen()
    {
        require(implementationIsFrozen() == false, "STATE_IS_FROZEN");
        _;
    }

    /*
      Contract's default function. Delegates execution to the implementation contract.
      It returns back to the external caller whatever the implementation delegated code returns.
    */
    function () external payable {
        address _implementation = implementation();
        require (_implementation != ZERO_ADDRESS, "MISSING_IMPLEMENTATION");

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize)

            // Call the implementation.
            // out and outsize are 0 for now, as we don't know the out size yet.
            let result := delegatecall(gas, _implementation, 0, calldatasize, 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize)

            switch result
            // delegatecall returns 0 on error.
            case 0 { revert(0, returndatasize) }
            default { return(0, returndatasize) }
        }
    }

    /*
      Returns the address of the current implementation.
    */
    function implementation() public view returns (address _implementation) {
        bytes32 slot = IMPLEMENTATION_SLOT;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            _implementation := sload(slot)
        }
    }

    /*
      Sets the implementation address of the proxy.
    */
    function setImplementation(address newImplementation) private {
        bytes32 slot = IMPLEMENTATION_SLOT;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            sstore(slot, newImplementation)
        }
    }

    /*
      Returns true if the contract is not in the finalized state.
    */
    function isNotFinalized() public view returns (bool notFinal) {
        bytes32 slot = FINALIZED_STATE_SLOT;
        uint256 slotValue;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            slotValue := sload(slot)
        }
        notFinal = (slotValue == 0);
    }

    /*
      Marks the current implementation as finalized.
    */
    function setFinalizedFlag() private {
        bytes32 slot = FINALIZED_STATE_SLOT;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            sstore(slot, 0x1)
        }
    }

    /*
      Introduce an implementation and its initialization vector,
      and start the time-lock before it can be upgraded to.
      addImplementation is not blocked when frozen or finalized.
      (upgradeTo API is blocked when finalized or frozen).
    */
    function addImplementation(address newImplementation, bytes calldata data, bool finalize)
        external onlyGovernance {
        require(newImplementation.isContract(), "ADDRESS_NOT_CONTRACT");

        bytes32 init_hash = keccak256(abi.encode(data, finalize));
        initializationHash[newImplementation] = init_hash;

        // solium-disable-next-line security/no-block-members
        uint256 activation_time = now + UPGRADE_ACTIVATION_DELAY;

        // First implementation should not have time-lock.
        if (implementation() == ZERO_ADDRESS) {
            // solium-disable-next-line security/no-block-members
            activation_time = now;
        }

        enabledTime[newImplementation] = activation_time;
        emit ImplementationAdded(newImplementation, data, finalize);
    }

    /*
      Removes a candidate implementation.
      Note that it is possible to remove the current implementation. Doing so doesn't affect the
      current implementation, but rather revokes it as a future candidate.
    */
    function removeImplementation(address newImplementation)
        external onlyGovernance {

        // If we have initializer, we set the hash of it.
        uint256 activation_time = enabledTime[newImplementation];

        require(activation_time > 0, "ADDRESS_NOT_UPGRADE_CANDIDATE");

        enabledTime[newImplementation] = 0;

        initializationHash[newImplementation] = 0;
        emit ImplementationRemoved(newImplementation);
    }

    /*
      Upgrades the proxy to a new implementation, with its initialization.
      to upgrade successfully, implementation must have been added time-lock agreeably
      before, and the init vector must be identical ot the one submitted before.

      Upon assignment of new implementation address,
      its initialize will be called with the inititalizing vector (even if empty).
      Therefore, the implementatin MUST must have such a method.
    */
    function upgradeTo(address newImplementation, bytes calldata data, bool finalize)
        external payable onlyGovernance notFinalized notFrozen {
        uint256 activation_time = enabledTime[newImplementation];

        require(activation_time > 0, "ADDRESS_NOT_UPGRADE_CANDIDATE");
        // solium-disable-next-line security/no-block-members
        require(activation_time <= now, "UPGRADE_NOT_ENABLED_YET");

        bytes32 init_vector_hash = initializationHash[newImplementation];
        require(init_vector_hash == keccak256(abi.encode(data, finalize)), "CHANGED_INITIALIZER");
        setImplementation(newImplementation);

        // solium-disable-next-line security/no-low-level-calls
        (bool success, bytes memory returndata) = newImplementation.delegatecall(
            abi.encodeWithSelector(this.initialize.selector, data));
        require(success, string(returndata));

        // Verify that the new implementation is not frozen post initialization.
        (success, returndata) = newImplementation.delegatecall(
            abi.encodeWithSignature("isFrozen()"));
        require(success, "CALL_TO_ISFROZEN_REVERTED");
        require(abi.decode(returndata, (bool)) == false, "NEW_IMPLEMENTATION_FROZEN");

        if (finalize == true) {
            setFinalizedFlag();
            emit FinalizedImplementation(newImplementation);
        }

        emit Upgraded(newImplementation);
    }
}