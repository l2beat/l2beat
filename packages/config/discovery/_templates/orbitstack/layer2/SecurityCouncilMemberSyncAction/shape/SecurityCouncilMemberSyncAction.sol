// SPDX-License-Identifier: Unknown
pragma solidity 0.8.16;

library SecurityCouncilMgmtUtils {
    function isInArray(address addr, address[] memory arr) internal pure returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == addr) {
                return true;
            }
        }
        return false;
    }

    // filters an array of addresses by removing any addresses that are in the excludeList
    function filterAddressesWithExcludeList(
        address[] memory input,
        mapping(address => bool) storage excludeList
    ) internal view returns (address[] memory) {
        address[] memory intermediate = new address[](input.length);
        uint256 intermediateLength = 0;

        for (uint256 i = 0; i < input.length; i++) {
            address nominee = input[i];
            if (!excludeList[nominee]) {
                intermediate[intermediateLength] = nominee;
                intermediateLength++;
            }
        }

        address[] memory output = new address[](intermediateLength);
        for (uint256 i = 0; i < intermediateLength; i++) {
            output[i] = intermediate[i];
        }

        return output;
    }
}

contract ActionExecutionRecord {
    /// @notice The key value store used to record the execution
    /// @dev    Local storage cannot be used in action contracts as they're delegate called into
    KeyValueStore public immutable store;

    /// @notice A unique id for this action contract
    bytes32 public immutable actionContractId;

    constructor(KeyValueStore _store, string memory _uniqueActionName) {
        store = _store;
        actionContractId = keccak256(bytes(_uniqueActionName));
    }

    /// @notice Sets a value in the store
    /// @dev    Combines the provided key with the action contract id
    function _set(uint256 key, uint256 value) internal {
        store.set(computeKey(key), value);
    }

    /// @notice Gets a value from the store
    /// @dev    Combines the provided key with the action contract id
    function _get(uint256 key) internal view returns (uint256) {
        return store.get(computeKey(key));
    }

    /// @notice This contract uses a composite key of the provided key and the action contract id.
    ///         This function can be used to calculate the composite key
    function computeKey(uint256 key) public view returns (uint256) {
        return uint256(keccak256(abi.encode(actionContractId, key)));
    }
}

contract SecurityCouncilMemberSyncAction is ActionExecutionRecord {
    error PreviousOwnerNotFound(address targetOwner, address securityCouncil);
    error ExecFromModuleError(bytes data, address securityCouncil);

    event UpdateNonceTooLow(
        address indexed securityCouncil, uint256 currrentNonce, uint256 providedNonce
    );

    /// @dev Used in the gnosis safe as the first entry in their ownership linked list
    address public constant SENTINEL_OWNERS = address(0x1);

    constructor(KeyValueStore _store)
        ActionExecutionRecord(_store, "SecurityCouncilMemberSyncAction")
    {}

    /// @notice Updates members of security council multisig to match provided array
    /// @dev    This function contains O(n^2) operations, so doesnt scale for large numbers of members. Expected count is 12, which is acceptable.
    ///         Gnosis OwnerManager handles reverting if address(0) is passed to remove/add owner
    /// @param _securityCouncil The security council to update
    /// @param _updatedMembers  The new list of members. The Security Council will be updated to have this exact list of members
    /// @return res indicates whether an update took place
    function perform(address _securityCouncil, address[] memory _updatedMembers, uint256 _nonce)
        external
        returns (bool res)
    {
        // make sure that _nonce is greater than the last nonce
        // we do this to ensure that a previous update does not occur after a later one
        // the mechanism just checks greater, not n+1, because the Security Council Manager always
        // sends the latest full list of members so it doesn't matter if some updates are missed
        // Additionally a retryable ticket could be used to execute the update, and since tickets
        // expire if not executed after some time, then allowing updates to be skipped means that the
        // system will not be blocked if a retryable ticket is expires
        uint256 updateNonce = getUpdateNonce(_securityCouncil);
        if (_nonce <= updateNonce) {
            // when nonce is too now, we simply return, we don't revert.
            // this way an out of date update will actual execute, rather than remaining in an unexecuted state forever
            emit UpdateNonceTooLow(_securityCouncil, updateNonce, _nonce);
            return false;
        }

        // store the nonce as a record of execution
        // use security council as the key to ensure that updates to different security councils are kept separate
        _setUpdateNonce(_securityCouncil, _nonce);

        IGnosisSafe securityCouncil = IGnosisSafe(_securityCouncil);
        // preserve current threshold, the safe ensures that the threshold is never lower than the member count
        uint256 threshold = securityCouncil.getThreshold();

        address[] memory previousOwners = securityCouncil.getOwners();

        for (uint256 i = 0; i < _updatedMembers.length; i++) {
            address member = _updatedMembers[i];
            if (!securityCouncil.isOwner(member)) {
                _addMember(securityCouncil, member, threshold);
            }
        }

        for (uint256 i = 0; i < previousOwners.length; i++) {
            address owner = previousOwners[i];
            if (!SecurityCouncilMgmtUtils.isInArray(owner, _updatedMembers)) {
                _removeMember(securityCouncil, owner, threshold);
            }
        }
        return true;
    }

    function _addMember(IGnosisSafe securityCouncil, address _member, uint256 _threshold)
        internal
    {
        _execFromModule(
            securityCouncil,
            abi.encodeWithSelector(IGnosisSafe.addOwnerWithThreshold.selector, _member, _threshold)
        );
    }

    function _removeMember(IGnosisSafe securityCouncil, address _member, uint256 _threshold)
        internal
    {
        address previousOwner = getPrevOwner(securityCouncil, _member);
        _execFromModule(
            securityCouncil,
            abi.encodeWithSelector(
                IGnosisSafe.removeOwner.selector, previousOwner, _member, _threshold
            )
        );
    }

    function getPrevOwner(IGnosisSafe securityCouncil, address _owner)
        public
        view
        returns (address)
    {
        // owners are stored as a linked list and removal requires the previous owner
        address[] memory owners = securityCouncil.getOwners();
        address previousOwner = SENTINEL_OWNERS;
        for (uint256 i = 0; i < owners.length; i++) {
            address currentOwner = owners[i];
            if (currentOwner == _owner) {
                return previousOwner;
            }
            previousOwner = currentOwner;
        }
        revert PreviousOwnerNotFound({
            targetOwner: _owner,
            securityCouncil: address(securityCouncil)
        });
    }

    function getUpdateNonce(address securityCouncil) public view returns (uint256) {
        return _get(uint160(securityCouncil));
    }

    function _setUpdateNonce(address securityCouncil, uint256 nonce) internal {
        _set(uint160(securityCouncil), nonce);
    }

    /// @notice Execute provided operation via gnosis safe's trusted execTransactionFromModule entry point
    function _execFromModule(IGnosisSafe securityCouncil, bytes memory data) internal {
        if (
            !securityCouncil.execTransactionFromModule(
                address(securityCouncil), 0, data, OpEnum.Operation.Call
            )
        ) {
            revert ExecFromModuleError({data: data, securityCouncil: address(securityCouncil)});
        }
    }
}