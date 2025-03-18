// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

contract PausableUntil {
    using UnstructuredStorage for bytes32;

    /// Contract resume/pause control storage slot
    bytes32 internal constant RESUME_SINCE_TIMESTAMP_POSITION = keccak256("lido.PausableUntil.resumeSinceTimestamp");
    /// Special value for the infinite pause
    uint256 public constant PAUSE_INFINITELY = type(uint256).max;

    /// @notice Emitted when paused by the `pauseFor` or `pauseUntil` call
    event Paused(uint256 duration);
    /// @notice Emitted when resumed by the `resume` call
    event Resumed();

    error ZeroPauseDuration();
    error PausedExpected();
    error ResumedExpected();
    error PauseUntilMustBeInFuture();

    /// @notice Reverts when resumed
    modifier whenPaused() {
        _checkPaused();
        _;
    }

    /// @notice Reverts when paused
    modifier whenResumed() {
        _checkResumed();
        _;
    }

    function _checkPaused() internal view {
        if (!isPaused()) {
            revert PausedExpected();
        }
    }

    function _checkResumed() internal view {
        if (isPaused()) {
            revert ResumedExpected();
        }
    }

    /// @notice Returns whether the contract is paused
    function isPaused() public view returns (bool) {
        return block.timestamp < RESUME_SINCE_TIMESTAMP_POSITION.getStorageUint256();
    }

    /// @notice Returns one of:
    ///  - PAUSE_INFINITELY if paused infinitely returns
    ///  - first second when get contract get resumed if paused for specific duration
    ///  - some timestamp in past if not paused
    function getResumeSinceTimestamp() external view returns (uint256) {
        return RESUME_SINCE_TIMESTAMP_POSITION.getStorageUint256();
    }

    function _resume() internal {
        _checkPaused();
        RESUME_SINCE_TIMESTAMP_POSITION.setStorageUint256(block.timestamp);
        emit Resumed();
    }

    function _pauseFor(uint256 _duration) internal {
        _checkResumed();
        if (_duration == 0) revert ZeroPauseDuration();

        uint256 resumeSince;
        if (_duration == PAUSE_INFINITELY) {
            resumeSince = PAUSE_INFINITELY;
        } else {
            resumeSince = block.timestamp + _duration;
        }
        _setPausedState(resumeSince);
    }

    function _pauseUntil(uint256 _pauseUntilInclusive) internal {
        _checkResumed();
        if (_pauseUntilInclusive < block.timestamp) revert PauseUntilMustBeInFuture();

        uint256 resumeSince;
        if (_pauseUntilInclusive != PAUSE_INFINITELY) {
            resumeSince = _pauseUntilInclusive + 1;
        } else {
            resumeSince = PAUSE_INFINITELY;
        }
        _setPausedState(resumeSince);
    }

    function _setPausedState(uint256 _resumeSince) internal {
        RESUME_SINCE_TIMESTAMP_POSITION.setStorageUint256(_resumeSince);
        if (_resumeSince == PAUSE_INFINITELY) {
            emit Paused(PAUSE_INFINITELY);
        } else {
            emit Paused(_resumeSince - block.timestamp);
        }
    }
}

interface IReportAsyncProcessor {
    /// @notice Submits a consensus report for processing.
    ///
    /// Note that submitting the report doesn't require the processor to start processing it right
    /// away, this can happen later (see `getLastProcessingRefSlot`). Until processing is started,
    /// HashConsensus is free to reach consensus on another report for the same reporting frame an
    /// submit it using this same function, or to lose the consensus on the submitted report,
    /// notifying the processor via `discardConsensusReport`.
    ///
    function submitConsensusReport(bytes32 report, uint256 refSlot, uint256 deadline) external;

    /// @notice Notifies that the report for the given ref. slot is not a conensus report anymore
    /// and should be discarded. This can happen when a member changes their report, is removed
    /// from the set, or when the quorum value gets increased.
    ///
    /// Only called when, for the given reference slot:
    ///
    ///   1. there previously was a consensus report; AND
    ///   1. processing of the consensus report hasn't started yet; AND
    ///   2. report processing deadline is not expired yet; AND
    ///   3. there's no consensus report now (otherwise, `submitConsensusReport` is called instead).
    ///
    /// Can be called even when there's no submitted non-discarded consensus report for the current
    /// reference slot, i.e. can be called multiple times in succession.
    ///
    function discardConsensusReport(uint256 refSlot) external;

    /// @notice Returns the last reference slot for which processing of the report was started.
    ///
    /// HashConsensus won't submit reports for any slot less than or equal to this slot.
    ///
    function getLastProcessingRefSlot() external view returns (uint256);

    /// @notice Returns the current consensus version.
    ///
    /// Consensus version must change every time consensus rules change, meaning that
    /// an oracle looking at the same reference slot would calculate a different hash.
    ///
    /// HashConsensus won't accept member reports any consensus version different form the
    /// one returned from this function.
    ///
    function getConsensusVersion() external view returns (uint256);
}

interface IAccessControlEnumerable is IAccessControl {
    /**
     * @dev Returns one of the accounts that have `role`. `index` must be a
     * value between 0 and {getRoleMemberCount}, non-inclusive.
     *
     * Role bearers are not sorted in any particular way, and their ordering may
     * change at any point.
     *
     * WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
     * you perform all queries on the same block. See the following
     * https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
     * for more information.
     */
    function getRoleMember(bytes32 role, uint256 index) external view returns (address);

    /**
     * @dev Returns the number of accounts that have `role`. Can be used
     * together with {getRoleMember} to enumerate all bearers of a role.
     */
    function getRoleMemberCount(bytes32 role) external view returns (uint256);
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

interface IAccessControl {
    /**
     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     *
     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
     * {RoleAdminChanged} not being emitted signaling this.
     *
     * _Available since v3.1._
     */
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);

    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that originated the contract call, an admin role
     * bearer except when using {AccessControl-_setupRole}.
     */
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) external view returns (bool);

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) external view returns (bytes32);

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) external;
}

interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}

library Strings {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0x00";
        }
        uint256 temp = value;
        uint256 length = 0;
        while (temp != 0) {
            length++;
            temp >>= 8;
        }
        return toHexString(value, length);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }
}

abstract contract AccessControl is Context, IAccessControl, ERC165 {
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    /// @dev Storage slot: mapping(bytes32 => RoleData) _roles
    bytes32 private constant ROLES_POSITION = keccak256("openzeppelin.AccessControl._roles");

    function _storageRoles() private pure returns (mapping(bytes32 => RoleData) storage _roles) {
        bytes32 position = ROLES_POSITION;
        assembly { _roles.slot := position }
    }

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * @dev Modifier that checks that an account has a specific role. Reverts
     * with a standardized message including the required role.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     *
     * _Available since v4.1._
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role, _msgSender());
        _;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view override returns (bool) {
        return _storageRoles()[role].members[account];
    }

    /**
     * @dev Revert with a standard message if `account` is missing `role`.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     */
    function _checkRole(bytes32 role, address account) internal view {
        if (!hasRole(role, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        Strings.toHexString(uint160(account), 20),
                        " is missing role ",
                        Strings.toHexString(uint256(role), 32)
                    )
                )
            );
        }
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) public view override returns (bytes32) {
        return _storageRoles()[role].adminRole;
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been revoked `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) public virtual override {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");

        _revokeRole(role, account);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event. Note that unlike {grantRole}, this function doesn't perform any
     * checks on the calling account.
     *
     * [WARNING]
     * ====
     * This function should only be called from the constructor when setting
     * up the initial roles for the system.
     *
     * Using this function in any other way is effectively circumventing the admin
     * system imposed by {AccessControl}.
     * ====
     *
     * NOTE: This function is deprecated in favor of {_grantRole}.
     */
    function _setupRole(bytes32 role, address account) internal virtual {
        _grantRole(role, account);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     *
     * Emits a {RoleAdminChanged} event.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        bytes32 previousAdminRole = getRoleAdmin(role);
        _storageRoles()[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * Internal function without access restriction.
     */
    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _storageRoles()[role].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * Internal function without access restriction.
     */
    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _storageRoles()[role].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }
}

library EnumerableSet {
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
                bytes32 lastvalue = set._values[lastIndex];

                // Move the last value to the index where the value to delete is
                set._values[toDeleteIndex] = lastvalue;
                // Update the index for the moved value
                set._indexes[lastvalue] = valueIndex; // Replace lastvalue's index to valueIndex
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

        assembly {
            result := store
        }

        return result;
    }
}

abstract contract AccessControlEnumerable is IAccessControlEnumerable, AccessControl {
    using EnumerableSet for EnumerableSet.AddressSet;

    /// @dev Storage slot: mapping(bytes32 => EnumerableSet.AddressSet) _roleMembers
    bytes32 private constant ROLE_MEMBERS_POSITION = keccak256("openzeppelin.AccessControlEnumerable._roleMembers");

    function _storageRoleMembers() private pure returns (
        mapping(bytes32 => EnumerableSet.AddressSet) storage _roleMembers
    ) {
        bytes32 position = ROLE_MEMBERS_POSITION;
        assembly { _roleMembers.slot := position }
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControlEnumerable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns one of the accounts that have `role`. `index` must be a
     * value between 0 and {getRoleMemberCount}, non-inclusive.
     *
     * Role bearers are not sorted in any particular way, and their ordering may
     * change at any point.
     *
     * WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
     * you perform all queries on the same block. See the following
     * https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
     * for more information.
     */
    function getRoleMember(bytes32 role, uint256 index) public view override returns (address) {
        return _storageRoleMembers()[role].at(index);
    }

    /**
     * @dev Returns the number of accounts that have `role`. Can be used
     * together with {getRoleMember} to enumerate all bearers of a role.
     */
    function getRoleMemberCount(bytes32 role) public view override returns (uint256) {
        return _storageRoleMembers()[role].length();
    }

    /**
     * @dev Overload {_grantRole} to track enumerable memberships
     */
    function _grantRole(bytes32 role, address account) internal virtual override {
        super._grantRole(role, account);
        _storageRoleMembers()[role].add(account);
    }

    /**
     * @dev Overload {_revokeRole} to track enumerable memberships
     */
    function _revokeRole(bytes32 role, address account) internal virtual override {
        super._revokeRole(role, account);
        _storageRoleMembers()[role].remove(account);
    }
}

contract Versioned {
    using UnstructuredStorage for bytes32;

    event ContractVersionSet(uint256 version);

    error NonZeroContractVersionOnInit();
    error InvalidContractVersionIncrement();
    error UnexpectedContractVersion(uint256 expected, uint256 received);

    /// @dev Storage slot: uint256 version
    /// Version of the initialized contract storage.
    /// The version stored in CONTRACT_VERSION_POSITION equals to:
    /// - 0 right after the deployment, before an initializer is invoked (and only at that moment);
    /// - N after calling initialize(), where N is the initially deployed contract version;
    /// - N after upgrading contract by calling finalizeUpgrade_vN().
    bytes32 internal constant CONTRACT_VERSION_POSITION = keccak256("lido.Versioned.contractVersion");

    uint256 internal constant PETRIFIED_VERSION_MARK = type(uint256).max;

    constructor() {
        // lock version in the implementation's storage to prevent initialization
        CONTRACT_VERSION_POSITION.setStorageUint256(PETRIFIED_VERSION_MARK);
    }

    /// @notice Returns the current contract version.
    function getContractVersion() public view returns (uint256) {
        return CONTRACT_VERSION_POSITION.getStorageUint256();
    }

    function _checkContractVersion(uint256 version) internal view {
        uint256 expectedVersion = getContractVersion();
        if (version != expectedVersion) {
            revert UnexpectedContractVersion(expectedVersion, version);
        }
    }

    /// @dev Sets the contract version to N. Should be called from the initialize() function.
    function _initializeContractVersionTo(uint256 version) internal {
        if (getContractVersion() != 0) revert NonZeroContractVersionOnInit();
        _setContractVersion(version);
    }

    /// @dev Updates the contract version. Should be called from a finalizeUpgrade_vN() function.
    function _updateContractVersion(uint256 newVersion) internal {
        if (newVersion != getContractVersion() + 1) revert InvalidContractVersionIncrement();
        _setContractVersion(newVersion);
    }

    function _setContractVersion(uint256 version) private {
        CONTRACT_VERSION_POSITION.setStorageUint256(version);
        emit ContractVersionSet(version);
    }
}

library UnstructuredStorage {
    function getStorageBool(bytes32 position) internal view returns (bool data) {
        assembly { data := sload(position) }
    }

    function getStorageAddress(bytes32 position) internal view returns (address data) {
        assembly { data := sload(position) }
    }

    function getStorageBytes32(bytes32 position) internal view returns (bytes32 data) {
        assembly { data := sload(position) }
    }

    function getStorageUint256(bytes32 position) internal view returns (uint256 data) {
        assembly { data := sload(position) }
    }

    function setStorageBool(bytes32 position, bool data) internal {
        assembly { sstore(position, data) }
    }

    function setStorageAddress(bytes32 position, address data) internal {
        assembly { sstore(position, data) }
    }

    function setStorageBytes32(bytes32 position, bytes32 data) internal {
        assembly { sstore(position, data) }
    }

    function setStorageUint256(bytes32 position, uint256 data) internal {
        assembly { sstore(position, data) }
    }
}

library SafeCast {
    /**
     * @dev Returns the downcasted uint224 from uint256, reverting on
     * overflow (when the input is greater than largest uint224).
     *
     * Counterpart to Solidity's `uint224` operator.
     *
     * Requirements:
     *
     * - input must fit into 224 bits
     */
    function toUint224(uint256 value) internal pure returns (uint224) {
        require(value <= type(uint224).max, "SafeCast: value doesn't fit in 224 bits");
        return uint224(value);
    }

    /**
     * @dev Returns the downcasted uint128 from uint256, reverting on
     * overflow (when the input is greater than largest uint128).
     *
     * Counterpart to Solidity's `uint128` operator.
     *
     * Requirements:
     *
     * - input must fit into 128 bits
     */
    function toUint128(uint256 value) internal pure returns (uint128) {
        require(value <= type(uint128).max, "SafeCast: value doesn't fit in 128 bits");
        return uint128(value);
    }

    /**
     * @dev Returns the downcasted uint96 from uint256, reverting on
     * overflow (when the input is greater than largest uint96).
     *
     * Counterpart to Solidity's `uint96` operator.
     *
     * Requirements:
     *
     * - input must fit into 96 bits
     */
    function toUint96(uint256 value) internal pure returns (uint96) {
        require(value <= type(uint96).max, "SafeCast: value doesn't fit in 96 bits");
        return uint96(value);
    }

    /**
     * @dev Returns the downcasted uint64 from uint256, reverting on
     * overflow (when the input is greater than largest uint64).
     *
     * Counterpart to Solidity's `uint64` operator.
     *
     * Requirements:
     *
     * - input must fit into 64 bits
     */
    function toUint64(uint256 value) internal pure returns (uint64) {
        require(value <= type(uint64).max, "SafeCast: value doesn't fit in 64 bits");
        return uint64(value);
    }

    /**
     * @dev Returns the downcasted uint32 from uint256, reverting on
     * overflow (when the input is greater than largest uint32).
     *
     * Counterpart to Solidity's `uint32` operator.
     *
     * Requirements:
     *
     * - input must fit into 32 bits
     */
    function toUint32(uint256 value) internal pure returns (uint32) {
        require(value <= type(uint32).max, "SafeCast: value doesn't fit in 32 bits");
        return uint32(value);
    }

    /**
     * @dev Returns the downcasted uint16 from uint256, reverting on
     * overflow (when the input is greater than largest uint16).
     *
     * Counterpart to Solidity's `uint16` operator.
     *
     * Requirements:
     *
     * - input must fit into 16 bits
     */
    function toUint16(uint256 value) internal pure returns (uint16) {
        require(value <= type(uint16).max, "SafeCast: value doesn't fit in 16 bits");
        return uint16(value);
    }

    /**
     * @dev Returns the downcasted uint8 from uint256, reverting on
     * overflow (when the input is greater than largest uint8).
     *
     * Counterpart to Solidity's `uint8` operator.
     *
     * Requirements:
     *
     * - input must fit into 8 bits.
     */
    function toUint8(uint256 value) internal pure returns (uint8) {
        require(value <= type(uint8).max, "SafeCast: value doesn't fit in 8 bits");
        return uint8(value);
    }

    /**
     * @dev Converts a signed int256 into an unsigned uint256.
     *
     * Requirements:
     *
     * - input must be greater than or equal to 0.
     */
    function toUint256(int256 value) internal pure returns (uint256) {
        require(value >= 0, "SafeCast: value must be positive");
        return uint256(value);
    }

    /**
     * @dev Returns the downcasted int128 from int256, reverting on
     * overflow (when the input is less than smallest int128 or
     * greater than largest int128).
     *
     * Counterpart to Solidity's `int128` operator.
     *
     * Requirements:
     *
     * - input must fit into 128 bits
     *
     * _Available since v3.1._
     */
    function toInt128(int256 value) internal pure returns (int128) {
        require(value >= type(int128).min && value <= type(int128).max, "SafeCast: value doesn't fit in 128 bits");
        return int128(value);
    }

    /**
     * @dev Returns the downcasted int64 from int256, reverting on
     * overflow (when the input is less than smallest int64 or
     * greater than largest int64).
     *
     * Counterpart to Solidity's `int64` operator.
     *
     * Requirements:
     *
     * - input must fit into 64 bits
     *
     * _Available since v3.1._
     */
    function toInt64(int256 value) internal pure returns (int64) {
        require(value >= type(int64).min && value <= type(int64).max, "SafeCast: value doesn't fit in 64 bits");
        return int64(value);
    }

    /**
     * @dev Returns the downcasted int32 from int256, reverting on
     * overflow (when the input is less than smallest int32 or
     * greater than largest int32).
     *
     * Counterpart to Solidity's `int32` operator.
     *
     * Requirements:
     *
     * - input must fit into 32 bits
     *
     * _Available since v3.1._
     */
    function toInt32(int256 value) internal pure returns (int32) {
        require(value >= type(int32).min && value <= type(int32).max, "SafeCast: value doesn't fit in 32 bits");
        return int32(value);
    }

    /**
     * @dev Returns the downcasted int16 from int256, reverting on
     * overflow (when the input is less than smallest int16 or
     * greater than largest int16).
     *
     * Counterpart to Solidity's `int16` operator.
     *
     * Requirements:
     *
     * - input must fit into 16 bits
     *
     * _Available since v3.1._
     */
    function toInt16(int256 value) internal pure returns (int16) {
        require(value >= type(int16).min && value <= type(int16).max, "SafeCast: value doesn't fit in 16 bits");
        return int16(value);
    }

    /**
     * @dev Returns the downcasted int8 from int256, reverting on
     * overflow (when the input is less than smallest int8 or
     * greater than largest int8).
     *
     * Counterpart to Solidity's `int8` operator.
     *
     * Requirements:
     *
     * - input must fit into 8 bits.
     *
     * _Available since v3.1._
     */
    function toInt8(int256 value) internal pure returns (int8) {
        require(value >= type(int8).min && value <= type(int8).max, "SafeCast: value doesn't fit in 8 bits");
        return int8(value);
    }

    /**
     * @dev Converts an unsigned uint256 into a signed int256.
     *
     * Requirements:
     *
     * - input must be less than or equal to maxInt256.
     */
    function toInt256(uint256 value) internal pure returns (int256) {
        // Note: Unsafe cast below is okay because `type(int256).max` is guaranteed to be positive
        require(value <= uint256(type(int256).max), "SafeCast: value doesn't fit in an int256");
        return int256(value);
    }
}

abstract contract BaseOracle is IReportAsyncProcessor, AccessControlEnumerable, Versioned {
    using UnstructuredStorage for bytes32;
    using SafeCast for uint256;

    error AddressCannotBeZero();
    error AddressCannotBeSame();
    error VersionCannotBeSame();
    error UnexpectedChainConfig();
    error SenderIsNotTheConsensusContract();
    error InitialRefSlotCannotBeLessThanProcessingOne(uint256 initialRefSlot, uint256 processingRefSlot);
    error RefSlotMustBeGreaterThanProcessingOne(uint256 refSlot, uint256 processingRefSlot);
    error RefSlotCannotDecrease(uint256 refSlot, uint256 prevRefSlot);
    error NoConsensusReportToProcess();
    error ProcessingDeadlineMissed(uint256 deadline);
    error RefSlotAlreadyProcessing();
    error UnexpectedRefSlot(uint256 consensusRefSlot, uint256 dataRefSlot);
    error UnexpectedConsensusVersion(uint256 expectedVersion, uint256 receivedVersion);
    error HashCannotBeZero();
    error UnexpectedDataHash(bytes32 consensusHash, bytes32 receivedHash);
    error SecondsPerSlotCannotBeZero();

    event ConsensusHashContractSet(address indexed addr, address indexed prevAddr);
    event ConsensusVersionSet(uint256 indexed version, uint256 indexed prevVersion);
    event ReportSubmitted(uint256 indexed refSlot, bytes32 hash, uint256 processingDeadlineTime);
    event ReportDiscarded(uint256 indexed refSlot, bytes32 hash);
    event ProcessingStarted(uint256 indexed refSlot, bytes32 hash);
    event WarnProcessingMissed(uint256 indexed refSlot);

    struct ConsensusReport {
        bytes32 hash;
        uint64 refSlot;
        uint64 processingDeadlineTime;
    }

    /// @notice An ACL role granting the permission to set the consensus
    /// contract address by calling setConsensusContract.
    bytes32 public constant MANAGE_CONSENSUS_CONTRACT_ROLE =
        keccak256("MANAGE_CONSENSUS_CONTRACT_ROLE");

    /// @notice An ACL role granting the permission to set the consensus
    /// version by calling setConsensusVersion.
    bytes32 public constant MANAGE_CONSENSUS_VERSION_ROLE =
        keccak256("MANAGE_CONSENSUS_VERSION_ROLE");


    /// @dev Storage slot: address consensusContract
    bytes32 internal constant CONSENSUS_CONTRACT_POSITION =
        keccak256("lido.BaseOracle.consensusContract");

    /// @dev Storage slot: uint256 consensusVersion
    bytes32 internal constant CONSENSUS_VERSION_POSITION =
        keccak256("lido.BaseOracle.consensusVersion");

    /// @dev Storage slot: uint256 lastProcessingRefSlot
    bytes32 internal constant LAST_PROCESSING_REF_SLOT_POSITION =
        keccak256("lido.BaseOracle.lastProcessingRefSlot");

    /// @dev Storage slot: ConsensusReport consensusReport
    bytes32 internal constant CONSENSUS_REPORT_POSITION =
        keccak256("lido.BaseOracle.consensusReport");


    uint256 public immutable SECONDS_PER_SLOT;
    uint256 public immutable GENESIS_TIME;

    ///
    /// Initialization & admin functions
    ///

    constructor(uint256 secondsPerSlot, uint256 genesisTime) {
        if (secondsPerSlot == 0) revert SecondsPerSlotCannotBeZero();
        SECONDS_PER_SLOT = secondsPerSlot;
        GENESIS_TIME = genesisTime;
    }

    /// @notice Returns the address of the HashConsensus contract.
    ///
    function getConsensusContract() external view returns (address) {
        return CONSENSUS_CONTRACT_POSITION.getStorageAddress();
    }

    /// @notice Sets the address of the HashConsensus contract.
    ///
    function setConsensusContract(address addr) external onlyRole(MANAGE_CONSENSUS_CONTRACT_ROLE) {
        _setConsensusContract(addr, LAST_PROCESSING_REF_SLOT_POSITION.getStorageUint256());
    }

    /// @notice Returns the current consensus version expected by the oracle contract.
    ///
    /// Consensus version must change every time consensus rules change, meaning that
    /// an oracle looking at the same reference slot would calculate a different hash.
    ///
    function getConsensusVersion() external view returns (uint256) {
        return CONSENSUS_VERSION_POSITION.getStorageUint256();
    }

    /// @notice Sets the consensus version expected by the oracle contract.
    ///
    function setConsensusVersion(uint256 version) external onlyRole(MANAGE_CONSENSUS_VERSION_ROLE) {
        _setConsensusVersion(version);
    }

    ///
    /// Data provider interface
    ///

    /// @notice Returns the last consensus report hash and metadata.
    ///
    function getConsensusReport() external view returns (
        bytes32 hash,
        uint256 refSlot,
        uint256 processingDeadlineTime,
        bool processingStarted
    ) {
        ConsensusReport memory report = _storageConsensusReport().value;
        uint256 processingRefSlot = LAST_PROCESSING_REF_SLOT_POSITION.getStorageUint256();
        return (
            report.hash,
            report.refSlot,
            report.processingDeadlineTime,
            report.hash != bytes32(0) && report.refSlot == processingRefSlot
        );
    }

    ///
    /// Consensus contract interface
    ///

    /// @notice Called by HashConsensus contract to push a consensus report for processing.
    ///
    /// Note that submitting the report doesn't require the processor to start processing it right
    /// away, this can happen later (see `getLastProcessingRefSlot`). Until processing is started,
    /// HashConsensus is free to reach consensus on another report for the same reporting frame an
    /// submit it using this same function, or to lose the consensus on the submitted report,
    /// notifying the processor via `discardConsensusReport`.
    ///
    function submitConsensusReport(bytes32 reportHash, uint256 refSlot, uint256 deadline) external {
        _checkSenderIsConsensusContract();

        uint256 prevSubmittedRefSlot = _storageConsensusReport().value.refSlot;
        if (refSlot < prevSubmittedRefSlot) {
            revert RefSlotCannotDecrease(refSlot, prevSubmittedRefSlot);
        }

        uint256 prevProcessingRefSlot = LAST_PROCESSING_REF_SLOT_POSITION.getStorageUint256();
        if (refSlot <= prevProcessingRefSlot) {
            revert RefSlotMustBeGreaterThanProcessingOne(refSlot, prevProcessingRefSlot);
        }

        if (_getTime() > deadline) {
            revert ProcessingDeadlineMissed(deadline);
        }

        if (refSlot != prevSubmittedRefSlot && prevProcessingRefSlot != prevSubmittedRefSlot) {
            emit WarnProcessingMissed(prevSubmittedRefSlot);
        }

        if (reportHash == bytes32(0)) {
            revert HashCannotBeZero();
        }

        emit ReportSubmitted(refSlot, reportHash, deadline);

        ConsensusReport memory report = ConsensusReport({
            hash: reportHash,
            refSlot: refSlot.toUint64(),
            processingDeadlineTime: deadline.toUint64()
        });

        _storageConsensusReport().value = report;
        _handleConsensusReport(report, prevSubmittedRefSlot, prevProcessingRefSlot);
    }

    /// @notice Called by HashConsensus contract to notify that the report for the given ref. slot
    /// is not a conensus report anymore and should be discarded. This can happen when a member
    /// changes their report, is removed from the set, or when the quorum value gets increased.
    ///
    /// Only called when, for the given reference slot:
    ///
    ///   1. there previously was a consensus report; AND
    ///   1. processing of the consensus report hasn't started yet; AND
    ///   2. report processing deadline is not expired yet; AND
    ///   3. there's no consensus report now (otherwise, `submitConsensusReport` is called instead).
    ///
    /// Can be called even when there's no submitted non-discarded consensus report for the current
    /// reference slot, i.e. can be called multiple times in succession.
    ///
    function discardConsensusReport(uint256 refSlot) external {
        _checkSenderIsConsensusContract();

        ConsensusReport memory submittedReport = _storageConsensusReport().value;
        if (refSlot < submittedReport.refSlot) {
            revert RefSlotCannotDecrease(refSlot, submittedReport.refSlot);
        } else if (refSlot > submittedReport.refSlot) {
            return;
        }

        uint256 lastProcessingRefSlot = LAST_PROCESSING_REF_SLOT_POSITION.getStorageUint256();
        if (refSlot <= lastProcessingRefSlot) {
            revert RefSlotAlreadyProcessing();
        }

        _storageConsensusReport().value.hash = bytes32(0);
        _handleConsensusReportDiscarded(submittedReport);

        emit ReportDiscarded(submittedReport.refSlot, submittedReport.hash);
    }

    /// @notice Returns the last reference slot for which processing of the report was started.
    ///
    function getLastProcessingRefSlot() external view returns (uint256) {
        return LAST_PROCESSING_REF_SLOT_POSITION.getStorageUint256();
    }

    ///
    /// Descendant contract interface
    ///

    /// @notice Initializes the contract storage. Must be called by a descendant
    /// contract as part of its initialization.
    ///
    function _initialize(
        address consensusContract,
        uint256 consensusVersion,
        uint256 lastProcessingRefSlot
    ) internal virtual {
        _initializeContractVersionTo(1);
        _setConsensusContract(consensusContract, lastProcessingRefSlot);
        _setConsensusVersion(consensusVersion);
        LAST_PROCESSING_REF_SLOT_POSITION.setStorageUint256(lastProcessingRefSlot);
        _storageConsensusReport().value.refSlot = lastProcessingRefSlot.toUint64();
    }

    /// @notice Returns whether the given address is a member of the oracle committee.
    ///
    function _isConsensusMember(address addr) internal view returns (bool) {
        address consensus = CONSENSUS_CONTRACT_POSITION.getStorageAddress();
        return IConsensusContract(consensus).getIsMember(addr);
    }

    /// @notice Called when the oracle gets a new consensus report from the HashConsensus contract.
    ///
    /// Keep in mind that, until you call `_startProcessing`, the oracle committee is free to
    /// reach consensus on another report for the same reporting frame and re-submit it using
    /// this function, or lose consensus on the report and ask to discard it by calling the
    /// `_handleConsensusReportDiscarded` function.
    ///
    function _handleConsensusReport(
        ConsensusReport memory report,
        uint256 prevSubmittedRefSlot,
        uint256 prevProcessingRefSlot
    ) internal virtual;

    /// @notice Called when the HashConsensus contract loses consensus on a previously submitted
    /// report that is not processing yet and asks to discard this report. Only called if there is
    /// no new consensus report at the moment; otherwise, `_handleConsensusReport` is called instead.
    ///
    function _handleConsensusReportDiscarded(ConsensusReport memory report) internal virtual {}

    /// @notice May be called by a descendant contract to check if the received data matches
    /// the currently submitted consensus report. Reverts otherwise.
    ///
    function _checkConsensusData(uint256 refSlot, uint256 consensusVersion, bytes32 hash)
        internal view
    {
        ConsensusReport memory report = _storageConsensusReport().value;
        if (refSlot != report.refSlot) {
            revert UnexpectedRefSlot(report.refSlot, refSlot);
        }

        uint256 expectedConsensusVersion = CONSENSUS_VERSION_POSITION.getStorageUint256();
        if (consensusVersion != expectedConsensusVersion) {
            revert UnexpectedConsensusVersion(expectedConsensusVersion, consensusVersion);
        }

        if (hash != report.hash) {
            revert UnexpectedDataHash(report.hash, hash);
        }
    }

    /// @notice Called by a descendant contract to mark the current consensus report
    /// as being processed. Returns the last ref. slot which processing was started
    /// before the call.
    ///
    /// Before this function is called, the oracle committee is free to reach consensus
    /// on another report for the same reporting frame. After this function is called,
    /// the consensus report for the current frame is guaranteed to remain the same.
    ///
    function _startProcessing() internal returns (uint256) {
        ConsensusReport memory report = _storageConsensusReport().value;
        if (report.hash == bytes32(0)) {
            revert NoConsensusReportToProcess();
        }

        _checkProcessingDeadline(report.processingDeadlineTime);

        uint256 prevProcessingRefSlot = LAST_PROCESSING_REF_SLOT_POSITION.getStorageUint256();
        if (prevProcessingRefSlot == report.refSlot) {
            revert RefSlotAlreadyProcessing();
        }

        LAST_PROCESSING_REF_SLOT_POSITION.setStorageUint256(report.refSlot);

        emit ProcessingStarted(report.refSlot, report.hash);
        return prevProcessingRefSlot;
    }

    /// @notice Reverts if the processing deadline for the current consensus report is missed.
    ///
    function _checkProcessingDeadline() internal view {
        _checkProcessingDeadline(_storageConsensusReport().value.processingDeadlineTime);
    }

    function _checkProcessingDeadline(uint256 deadlineTime) internal view {
        if (_getTime() > deadlineTime) revert ProcessingDeadlineMissed(deadlineTime);
    }

    /// @notice Returns the reference slot for the current frame.
    ///
    function _getCurrentRefSlot() internal view returns (uint256) {
        address consensusContract = CONSENSUS_CONTRACT_POSITION.getStorageAddress();
        (uint256 refSlot, ) = IConsensusContract(consensusContract).getCurrentFrame();
        return refSlot;
    }

    ///
    /// Implementation & helpers
    ///

    function _setConsensusVersion(uint256 version) internal {
        uint256 prevVersion = CONSENSUS_VERSION_POSITION.getStorageUint256();
        if (version == prevVersion) revert VersionCannotBeSame();
        CONSENSUS_VERSION_POSITION.setStorageUint256(version);
        emit ConsensusVersionSet(version, prevVersion);
    }

    function _setConsensusContract(address addr, uint256 lastProcessingRefSlot) internal {
        if (addr == address(0)) revert AddressCannotBeZero();

        address prevAddr = CONSENSUS_CONTRACT_POSITION.getStorageAddress();
        if (addr == prevAddr) revert AddressCannotBeSame();

        (, uint256 secondsPerSlot, uint256 genesisTime) = IConsensusContract(addr).getChainConfig();
        if (secondsPerSlot != SECONDS_PER_SLOT || genesisTime != GENESIS_TIME) {
            revert UnexpectedChainConfig();
        }

        uint256 initialRefSlot = IConsensusContract(addr).getInitialRefSlot();
        if (initialRefSlot < lastProcessingRefSlot) {
            revert InitialRefSlotCannotBeLessThanProcessingOne(initialRefSlot, lastProcessingRefSlot);
        }

        CONSENSUS_CONTRACT_POSITION.setStorageAddress(addr);
        emit ConsensusHashContractSet(addr, prevAddr);
    }

    function _checkSenderIsConsensusContract() internal view {
        if (_msgSender() != CONSENSUS_CONTRACT_POSITION.getStorageAddress()) {
            revert SenderIsNotTheConsensusContract();
        }
    }

    function _getTime() internal virtual view returns (uint256) {
        return block.timestamp; // solhint-disable-line not-rely-on-time
    }

    ///
    /// Storage helpers
    ///

    struct StorageConsensusReport {
        ConsensusReport value;
    }

    function _storageConsensusReport() internal pure returns (StorageConsensusReport storage r) {
        bytes32 position = CONSENSUS_REPORT_POSITION;
        assembly { r.slot := position }
    }
}

contract ValidatorsExitBusOracle is BaseOracle, PausableUntil {
    using UnstructuredStorage for bytes32;
    using SafeCast for uint256;

    error AdminCannotBeZero();
    error SenderNotAllowed();
    error UnsupportedRequestsDataFormat(uint256 format);
    error InvalidRequestsData();
    error InvalidRequestsDataLength();
    error UnexpectedRequestsDataLength();
    error InvalidRequestsDataSortOrder();
    error ArgumentOutOfBounds();
    error NodeOpValidatorIndexMustIncrease(
        uint256 moduleId,
        uint256 nodeOpId,
        uint256 prevRequestedValidatorIndex,
        uint256 requestedValidatorIndex
    );

    event ValidatorExitRequest(
        uint256 indexed stakingModuleId,
        uint256 indexed nodeOperatorId,
        uint256 indexed validatorIndex,
        bytes validatorPubkey,
        uint256 timestamp
    );

    event WarnDataIncompleteProcessing(
        uint256 indexed refSlot,
        uint256 requestsProcessed,
        uint256 requestsCount
    );

    struct DataProcessingState {
        uint64 refSlot;
        uint64 requestsCount;
        uint64 requestsProcessed;
        uint16 dataFormat;
    }

    struct RequestedValidator {
        bool requested;
        uint64 index;
    }

    /// @notice An ACL role granting the permission to submit the data for a committee report.
    bytes32 public constant SUBMIT_DATA_ROLE = keccak256("SUBMIT_DATA_ROLE");

    /// @notice An ACL role granting the permission to pause accepting validator exit requests
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");

    /// @notice An ACL role granting the permission to resume accepting validator exit requests
    bytes32 public constant RESUME_ROLE = keccak256("RESUME_ROLE");

    /// @dev Storage slot: uint256 totalRequestsProcessed
    bytes32 internal constant TOTAL_REQUESTS_PROCESSED_POSITION =
        keccak256("lido.ValidatorsExitBusOracle.totalRequestsProcessed");

    /// @dev Storage slot: mapping(uint256 => RequestedValidator) lastRequestedValidatorIndices
    /// A mapping from the (moduleId, nodeOpId) packed key to the last requested validator index.
    bytes32 internal constant LAST_REQUESTED_VALIDATOR_INDICES_POSITION =
        keccak256("lido.ValidatorsExitBusOracle.lastRequestedValidatorIndices");

    /// @dev Storage slot: DataProcessingState dataProcessingState
    bytes32 internal constant DATA_PROCESSING_STATE_POSITION =
        keccak256("lido.ValidatorsExitBusOracle.dataProcessingState");

    ILidoLocator internal immutable LOCATOR;

    ///
    /// Initialization & admin functions
    ///

    constructor(uint256 secondsPerSlot, uint256 genesisTime, address lidoLocator)
        BaseOracle(secondsPerSlot, genesisTime)
    {
        LOCATOR = ILidoLocator(lidoLocator);
    }

    function initialize(
        address admin,
        address consensusContract,
        uint256 consensusVersion,
        uint256 lastProcessingRefSlot
    ) external {
        if (admin == address(0)) revert AdminCannotBeZero();
        _setupRole(DEFAULT_ADMIN_ROLE, admin);

        _pauseFor(PAUSE_INFINITELY);
        _initialize(consensusContract, consensusVersion, lastProcessingRefSlot);
    }

    /// @notice Resume accepting validator exit requests
    ///
    /// @dev Reverts with `PausedExpected()` if contract is already resumed
    /// @dev Reverts with `AccessControl:...` reason if sender has no `RESUME_ROLE`
    ///
    function resume() external whenPaused onlyRole(RESUME_ROLE) {
        _resume();
    }

    /// @notice Pause accepting validator exit requests util in after duration
    ///
    /// @param _duration pause duration, seconds (use `PAUSE_INFINITELY` for unlimited)
    /// @dev Reverts with `ResumedExpected()` if contract is already paused
    /// @dev Reverts with `AccessControl:...` reason if sender has no `PAUSE_ROLE`
    /// @dev Reverts with `ZeroPauseDuration()` if zero duration is passed
    ///
    function pauseFor(uint256 _duration) external onlyRole(PAUSE_ROLE) {
        _pauseFor(_duration);
    }

    /// @notice Pause accepting report data
    /// @param _pauseUntilInclusive the last second to pause until
    /// @dev Reverts with `ResumeSinceInPast()` if the timestamp is in the past
    /// @dev Reverts with `AccessControl:...` reason if sender has no `PAUSE_ROLE`
    /// @dev Reverts with `ResumedExpected()` if contract is already paused
    function pauseUntil(uint256 _pauseUntilInclusive) external onlyRole(PAUSE_ROLE) {
        _pauseUntil(_pauseUntilInclusive);
    }

    ///
    /// Data provider interface
    ///

    struct ReportData {
        ///
        /// Oracle consensus info
        ///

        /// @dev Version of the oracle consensus rules. Current version expected
        /// by the oracle can be obtained by calling getConsensusVersion().
        uint256 consensusVersion;

        /// @dev Reference slot for which the report was calculated. If the slot
        /// contains a block, the state being reported should include all state
        /// changes resulting from that block. The epoch containing the slot
        /// should be finalized prior to calculating the report.
        uint256 refSlot;

        ///
        /// Requests data
        ///

        /// @dev Total number of validator exit requests in this report. Must not be greater
        /// than limit checked in OracleReportSanityChecker.checkExitBusOracleReport.
        uint256 requestsCount;

        /// @dev Format of the validator exit requests data. Currently, only the
        /// DATA_FORMAT_LIST=1 is supported.
        uint256 dataFormat;

        /// @dev Validator exit requests data. Can differ based on the data format,
        /// see the constant defining a specific data format below for more info.
        bytes data;
    }

    /// @notice The list format of the validator exit requests data. Used when all
    /// requests fit into a single transaction.
    ///
    /// Each validator exit request is described by the following 64-byte array:
    ///
    /// MSB <------------------------------------------------------- LSB
    /// |  3 bytes   |  5 bytes   |     8 bytes      |    48 bytes     |
    /// |  moduleId  |  nodeOpId  |  validatorIndex  | validatorPubkey |
    ///
    /// All requests are tightly packed into a byte array where requests follow
    /// one another without any separator or padding, and passed to the `data`
    /// field of the report structure.
    ///
    /// Requests must be sorted in the ascending order by the following compound
    /// key: (moduleId, nodeOpId, validatorIndex).
    ///
    uint256 public constant DATA_FORMAT_LIST = 1;

    /// Length in bytes of packed request
    uint256 internal constant PACKED_REQUEST_LENGTH = 64;

    /// @notice Submits report data for processing.
    ///
    /// @param data The data. See the `ReportData` structure's docs for details.
    /// @param contractVersion Expected version of the oracle contract.
    ///
    /// Reverts if:
    /// - The caller is not a member of the oracle committee and doesn't possess the
    ///   SUBMIT_DATA_ROLE.
    /// - The provided contract version is different from the current one.
    /// - The provided consensus version is different from the expected one.
    /// - The provided reference slot differs from the current consensus frame's one.
    /// - The processing deadline for the current consensus frame is missed.
    /// - The keccak256 hash of the ABI-encoded data is different from the last hash
    ///   provided by the hash consensus contract.
    /// - The provided data doesn't meet safety checks.
    ///
    function submitReportData(ReportData calldata data, uint256 contractVersion)
        external whenResumed
    {
        _checkMsgSenderIsAllowedToSubmitData();
        _checkContractVersion(contractVersion);
        // it's a waste of gas to copy the whole calldata into mem but seems there's no way around
        _checkConsensusData(data.refSlot, data.consensusVersion, keccak256(abi.encode(data)));
        _startProcessing();
        _handleConsensusReportData(data);
    }

    /// @notice Returns the total number of validator exit requests ever processed
    /// across all received reports.
    ///
    function getTotalRequestsProcessed() external view returns (uint256) {
        return TOTAL_REQUESTS_PROCESSED_POSITION.getStorageUint256();
    }

    /// @notice Returns the latest validator indices that were requested to exit for the given
    /// `nodeOpIds` in the given `moduleId`. For node operators that were never requested to exit
    /// any validator, index is set to -1.
    ///
    /// @param moduleId ID of the staking module.
    /// @param nodeOpIds IDs of the staking module's node operators.
    ///
    function getLastRequestedValidatorIndices(uint256 moduleId, uint256[] calldata nodeOpIds)
        external view returns (int256[] memory)
    {
        if (moduleId > type(uint24).max) revert ArgumentOutOfBounds();

        int256[] memory indices = new int256[](nodeOpIds.length);

        for (uint256 i = 0; i < nodeOpIds.length; ++i) {
            uint256 nodeOpId = nodeOpIds[i];
            if (nodeOpId > type(uint40).max) revert ArgumentOutOfBounds();
            uint256 nodeOpKey = _computeNodeOpKey(moduleId, nodeOpId);
            RequestedValidator memory validator = _storageLastRequestedValidatorIndices()[nodeOpKey];
            indices[i] = validator.requested ? int256(uint256(validator.index)) : -1;
        }

        return indices;
    }

    struct ProcessingState {
        /// @notice Reference slot for the current reporting frame.
        uint256 currentFrameRefSlot;
        /// @notice The last time at which a report data can be submitted for the current
        /// reporting frame.
        uint256 processingDeadlineTime;
        /// @notice Hash of the report data. Zero bytes if consensus on the hash hasn't
        /// been reached yet for the current reporting frame.
        bytes32 dataHash;
        /// @notice Whether any report data for the for the current reporting frame has been
        /// already submitted.
        bool dataSubmitted;
        /// @notice Format of the report data for the current reporting frame.
        uint256 dataFormat;
        /// @notice Total number of validator exit requests for the current reporting frame.
        uint256 requestsCount;
        /// @notice How many validator exit requests are already submitted for the current
        /// reporting frame.
        uint256 requestsSubmitted;
    }

    /// @notice Returns data processing state for the current reporting frame.
    /// @return result See the docs for the `ProcessingState` struct.
    ///
    function getProcessingState() external view returns (ProcessingState memory result) {
        ConsensusReport memory report = _storageConsensusReport().value;
        result.currentFrameRefSlot = _getCurrentRefSlot();

        if (report.hash == bytes32(0) || result.currentFrameRefSlot != report.refSlot) {
            return result;
        }

        result.processingDeadlineTime = report.processingDeadlineTime;
        result.dataHash = report.hash;

        DataProcessingState memory procState = _storageDataProcessingState().value;

        result.dataSubmitted = procState.refSlot == result.currentFrameRefSlot;
        if (!result.dataSubmitted) {
            return result;
        }

        result.dataFormat = procState.dataFormat;
        result.requestsCount = procState.requestsCount;
        result.requestsSubmitted = procState.requestsProcessed;
    }

    ///
    /// Implementation & helpers
    ///

    function _handleConsensusReport(
        ConsensusReport memory /* report */,
        uint256 /* prevSubmittedRefSlot */,
        uint256 prevProcessingRefSlot
    ) internal override {
        DataProcessingState memory state = _storageDataProcessingState().value;
        if (state.refSlot == prevProcessingRefSlot && state.requestsProcessed < state.requestsCount) {
            emit WarnDataIncompleteProcessing(
                prevProcessingRefSlot,
                state.requestsProcessed,
                state.requestsCount
            );
        }
    }

    function _checkMsgSenderIsAllowedToSubmitData() internal view {
        address sender = _msgSender();
        if (!hasRole(SUBMIT_DATA_ROLE, sender) && !_isConsensusMember(sender)) {
            revert SenderNotAllowed();
        }
    }

    function _handleConsensusReportData(ReportData calldata data) internal {
        if (data.dataFormat != DATA_FORMAT_LIST) {
            revert UnsupportedRequestsDataFormat(data.dataFormat);
        }

        if (data.data.length % PACKED_REQUEST_LENGTH != 0) {
            revert InvalidRequestsDataLength();
        }

        IOracleReportSanityChecker(LOCATOR.oracleReportSanityChecker())
            .checkExitBusOracleReport(data.requestsCount);

        if (data.data.length / PACKED_REQUEST_LENGTH != data.requestsCount) {
            revert UnexpectedRequestsDataLength();
        }

        _processExitRequestsList(data.data);

        _storageDataProcessingState().value = DataProcessingState({
            refSlot: data.refSlot.toUint64(),
            requestsCount: data.requestsCount.toUint64(),
            requestsProcessed: data.requestsCount.toUint64(),
            dataFormat: uint16(DATA_FORMAT_LIST)
        });

        if (data.requestsCount == 0) {
            return;
        }

        TOTAL_REQUESTS_PROCESSED_POSITION.setStorageUint256(
            TOTAL_REQUESTS_PROCESSED_POSITION.getStorageUint256() + data.requestsCount
        );
    }

    function _processExitRequestsList(bytes calldata data) internal {
        uint256 offset;
        uint256 offsetPastEnd;
        assembly {
            offset := data.offset
            offsetPastEnd := add(offset, data.length)
        }

        uint256 lastDataWithoutPubkey = 0;
        uint256 lastNodeOpKey = 0;
        RequestedValidator memory lastRequestedVal;
        bytes calldata pubkey;

        assembly {
            pubkey.length := 48
        }

        uint256 timestamp = _getTime();

        while (offset < offsetPastEnd) {
            uint256 dataWithoutPubkey;
            assembly {
                // 16 most significant bytes are taken by module id, node op id, and val index
                dataWithoutPubkey := shr(128, calldataload(offset))
                // the next 48 bytes are taken by the pubkey
                pubkey.offset := add(offset, 16)
                // totalling to 64 bytes
                offset := add(offset, 64)
            }
            //                              dataWithoutPubkey
            // MSB <---------------------------------------------------------------------- LSB
            // | 128 bits: zeros | 24 bits: moduleId | 40 bits: nodeOpId | 64 bits: valIndex |
            //
            if (dataWithoutPubkey <= lastDataWithoutPubkey) {
                revert InvalidRequestsDataSortOrder();
            }

            uint64 valIndex = uint64(dataWithoutPubkey);
            uint256 nodeOpId = uint40(dataWithoutPubkey >> 64);
            uint256 moduleId = uint24(dataWithoutPubkey >> (64 + 40));

            if (moduleId == 0) {
                revert InvalidRequestsData();
            }

            uint256 nodeOpKey = _computeNodeOpKey(moduleId, nodeOpId);
            if (nodeOpKey != lastNodeOpKey) {
                if (lastNodeOpKey != 0) {
                    _storageLastRequestedValidatorIndices()[lastNodeOpKey] = lastRequestedVal;
                }
                lastRequestedVal = _storageLastRequestedValidatorIndices()[nodeOpKey];
                lastNodeOpKey = nodeOpKey;
            }

            if (lastRequestedVal.requested && valIndex <= lastRequestedVal.index) {
                revert NodeOpValidatorIndexMustIncrease(
                    moduleId,
                    nodeOpId,
                    lastRequestedVal.index,
                    valIndex
                );
            }

            lastRequestedVal = RequestedValidator(true, valIndex);
            lastDataWithoutPubkey = dataWithoutPubkey;

            emit ValidatorExitRequest(moduleId, nodeOpId, valIndex, pubkey, timestamp);
        }

        if (lastNodeOpKey != 0) {
            _storageLastRequestedValidatorIndices()[lastNodeOpKey] = lastRequestedVal;
        }
    }

    function _computeNodeOpKey(uint256 moduleId, uint256 nodeOpId) internal pure returns (uint256) {
        return (moduleId << 40) | nodeOpId;
    }

    ///
    /// Storage helpers
    ///

    function _storageLastRequestedValidatorIndices() internal pure returns (
        mapping(uint256 => RequestedValidator) storage r
    ) {
        bytes32 position = LAST_REQUESTED_VALIDATOR_INDICES_POSITION;
        assembly { r.slot := position }
    }

    struct StorageDataProcessingState {
        DataProcessingState value;
    }

    function _storageDataProcessingState() internal pure returns (
        StorageDataProcessingState storage r
    ) {
        bytes32 position = DATA_PROCESSING_STATE_POSITION;
        assembly { r.slot := position }
    }
}