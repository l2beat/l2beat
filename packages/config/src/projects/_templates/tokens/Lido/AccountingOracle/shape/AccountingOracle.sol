// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

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

contract AccountingOracle is BaseOracle {
    using UnstructuredStorage for bytes32;
    using SafeCast for uint256;

    error LidoLocatorCannotBeZero();
    error AdminCannotBeZero();
    error LegacyOracleCannotBeZero();
    error LidoCannotBeZero();
    error IncorrectOracleMigration(uint256 code);
    error SenderNotAllowed();
    error InvalidExitedValidatorsData();
    error UnsupportedExtraDataFormat(uint256 format);
    error UnsupportedExtraDataType(uint256 itemIndex, uint256 dataType);
    error CannotSubmitExtraDataBeforeMainData();
    error ExtraDataAlreadyProcessed();
    error UnexpectedExtraDataHash(bytes32 consensusHash, bytes32 receivedHash);
    error UnexpectedExtraDataFormat(uint256 expectedFormat, uint256 receivedFormat);
    error ExtraDataItemsCountCannotBeZeroForNonEmptyData();
    error ExtraDataHashCannotBeZeroForNonEmptyData();
    error UnexpectedExtraDataItemsCount(uint256 expectedCount, uint256 receivedCount);
    error UnexpectedExtraDataIndex(uint256 expectedIndex, uint256 receivedIndex);
    error InvalidExtraDataItem(uint256 itemIndex);
    error InvalidExtraDataSortOrder(uint256 itemIndex);

    event ExtraDataSubmitted(uint256 indexed refSlot, uint256 itemsProcessed, uint256 itemsCount);

    event WarnExtraDataIncompleteProcessing(
        uint256 indexed refSlot,
        uint256 processedItemsCount,
        uint256 itemsCount
    );

    struct ExtraDataProcessingState {
        uint64 refSlot;
        uint16 dataFormat;
        bool submitted;
        uint64 itemsCount;
        uint64 itemsProcessed;
        uint256 lastSortingKey;
        bytes32 dataHash;
    }

    /// @notice An ACL role granting the permission to submit the data for a committee report.
    bytes32 public constant SUBMIT_DATA_ROLE = keccak256("SUBMIT_DATA_ROLE");

    /// @dev Storage slot: ExtraDataProcessingState state
    bytes32 internal constant EXTRA_DATA_PROCESSING_STATE_POSITION =
        keccak256("lido.AccountingOracle.extraDataProcessingState");

    bytes32 internal constant ZERO_HASH = bytes32(0);

    address public immutable LIDO;
    ILidoLocator public immutable LOCATOR;
    address public immutable LEGACY_ORACLE;

    ///
    /// Initialization & admin functions
    ///

    constructor(
        address lidoLocator,
        address lido,
        address legacyOracle,
        uint256 secondsPerSlot,
        uint256 genesisTime
    )
        BaseOracle(secondsPerSlot, genesisTime)
    {
        if (lidoLocator == address(0)) revert LidoLocatorCannotBeZero();
        if (legacyOracle == address(0)) revert LegacyOracleCannotBeZero();
        if (lido == address(0)) revert LidoCannotBeZero();
        LOCATOR = ILidoLocator(lidoLocator);
        LIDO = lido;
        LEGACY_ORACLE = legacyOracle;
    }

    function initialize(
        address admin,
        address consensusContract,
        uint256 consensusVersion
    ) external {
        if (admin == address(0)) revert AdminCannotBeZero();

        uint256 lastProcessingRefSlot = _checkOracleMigration(LEGACY_ORACLE, consensusContract);
        _initialize(admin, consensusContract, consensusVersion, lastProcessingRefSlot);

        _updateContractVersion(2);
    }

    function initializeWithoutMigration(
        address admin,
        address consensusContract,
        uint256 consensusVersion,
        uint256 lastProcessingRefSlot
    ) external {
        if (admin == address(0)) revert AdminCannotBeZero();

        _initialize(admin, consensusContract, consensusVersion, lastProcessingRefSlot);

        _updateContractVersion(2);
    }

    function finalizeUpgrade_v2(uint256 consensusVersion) external {
        _updateContractVersion(2);
        _setConsensusVersion(consensusVersion);
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
        /// CL values
        ///

        /// @dev The number of validators on consensus layer that were ever deposited
        /// via Lido as observed at the reference slot.
        uint256 numValidators;

        /// @dev Cumulative balance of all Lido validators on the consensus layer
        /// as observed at the reference slot.
        uint256 clBalanceGwei;

        /// @dev Ids of staking modules that have more exited validators than the number
        /// stored in the respective staking module contract as observed at the reference
        /// slot.
        uint256[] stakingModuleIdsWithNewlyExitedValidators;

        /// @dev Number of ever exited validators for each of the staking modules from
        /// the stakingModuleIdsWithNewlyExitedValidators array as observed at the
        /// reference slot.
        uint256[] numExitedValidatorsByStakingModule;

        ///
        /// EL values
        ///

        /// @dev The ETH balance of the Lido withdrawal vault as observed at the reference slot.
        uint256 withdrawalVaultBalance;

        /// @dev The ETH balance of the Lido execution layer rewards vault as observed
        /// at the reference slot.
        uint256 elRewardsVaultBalance;

        /// @dev The shares amount requested to burn through Burner as observed
        /// at the reference slot. The value can be obtained in the following way:
        /// `(coverSharesToBurn, nonCoverSharesToBurn) = IBurner(burner).getSharesRequestedToBurn()
        /// sharesRequestedToBurn = coverSharesToBurn + nonCoverSharesToBurn`
        uint256 sharesRequestedToBurn;

        ///
        /// Decision
        ///

        /// @dev The ascendingly-sorted array of withdrawal request IDs obtained by calling
        /// WithdrawalQueue.calculateFinalizationBatches. Empty array means that no withdrawal
        /// requests should be finalized.
        uint256[] withdrawalFinalizationBatches;

        /// @dev The share/ETH rate with the 10^27 precision (i.e. the price of one stETH share
        /// in ETH where one ETH is denominated as 10^27) that would be effective as the result of
        /// applying this oracle report at the reference slot, with withdrawalFinalizationBatches
        /// set to empty array and simulatedShareRate set to 0.
        uint256 simulatedShareRate;

        /// @dev Whether, based on the state observed at the reference slot, the protocol should
        /// be in the bunker mode.
        bool isBunkerMode;

        ///
        /// Extra data — the oracle information that allows asynchronous processing in
        /// chunks, after the main data is processed. The oracle doesn't enforce that extra data
        /// attached to some data report is processed in full before the processing deadline expires
        /// or a new data report starts being processed, but enforces that no processing of extra
        /// data for a report is possible after its processing deadline passes or a new data report
        /// arrives.
        ///
        /// Depending on the size of the extra data, the processing might need to be split into
        /// multiple transactions. Each transaction contains a chunk of report data (an array of items)
        /// and the hash of the next transaction. The last transaction will contain ZERO_HASH
        /// as the next transaction hash.
        ///
        /// | 32 bytes |    array of items
        /// | nextHash |         ...
        ///
        /// Each item being encoded as follows:
        ///
        ///    3 bytes    2 bytes      X bytes
        /// | itemIndex | itemType | itemPayload |
        ///
        /// itemIndex is a 0-based index into the extra data array;
        /// itemType is the type of extra data item;
        /// itemPayload is the item's data which interpretation depends on the item's type.
        ///
        /// Items should be sorted ascendingly by the (itemType, ...itemSortingKey) compound key
        /// where `itemSortingKey` calculation depends on the item's type (see below).
        ///
        /// ----------------------------------------------------------------------------------------
        ///
        /// itemType=0 (EXTRA_DATA_TYPE_STUCK_VALIDATORS): stuck validators by node operators.
        /// itemPayload format:
        ///
        /// | 3 bytes  |   8 bytes    |  nodeOpsCount * 8 bytes  |  nodeOpsCount * 16 bytes  |
        /// | moduleId | nodeOpsCount |      nodeOperatorIds     |   stuckValidatorsCounts   |
        ///
        /// moduleId is the staking module for which exited keys counts are being reported.
        ///
        /// nodeOperatorIds contains an array of ids of node operators that have total stuck
        /// validators counts changed compared to the staking module smart contract storage as
        /// observed at the reference slot. Each id is a 8-byte uint, ids are packed tightly.
        ///
        /// nodeOpsCount contains the number of node operator ids contained in the nodeOperatorIds
        /// array. Thus, nodeOpsCount = byteLength(nodeOperatorIds) / 8.
        ///
        /// stuckValidatorsCounts contains an array of stuck validators total counts, as observed at
        /// the reference slot, for the node operators from the nodeOperatorIds array, in the same
        /// order. Each count is a 16-byte uint, counts are packed tightly. Thus,
        /// byteLength(stuckValidatorsCounts) = nodeOpsCount * 16.
        ///
        /// nodeOpsCount must not be greater than maxNodeOperatorsPerExtraDataItem specified
        /// in OracleReportSanityChecker contract. If a staking module has more node operators
        /// with total stuck validators counts changed compared to the staking module smart contract
        /// storage (as observed at the reference slot), reporting for that module should be split
        /// into multiple items.
        ///
        /// Item sorting key is a compound key consisting of the module id and the first reported
        /// node operator's id:
        ///
        /// itemSortingKey = (moduleId, nodeOperatorIds[0:8])
        ///
        /// ----------------------------------------------------------------------------------------
        ///
        /// itemType=1 (EXTRA_DATA_TYPE_EXITED_VALIDATORS): exited validators by node operators.
        ///
        /// The payload format is exactly the same as for itemType=EXTRA_DATA_TYPE_STUCK_VALIDATORS,
        /// except that, instead of stuck validators counts, exited validators counts are reported.
        /// The `itemSortingKey` is calculated identically.
        ///
        /// ----------------------------------------------------------------------------------------
        ///
        /// The oracle daemon should report exited/stuck validators counts ONLY for those
        /// (moduleId, nodeOperatorId) pairs that contain outdated counts in the staking
        /// module smart contract as observed at the reference slot.
        ///
        /// Extra data array can be passed in different formats, see below.
        ///

        /// @dev Format of the extra data.
        ///
        /// Currently, only the EXTRA_DATA_FORMAT_EMPTY=0 and EXTRA_DATA_FORMAT_LIST=1
        /// formats are supported. See the constant defining a specific data format for
        /// more info.
        ///
        uint256 extraDataFormat;

        /// @dev Hash of the extra data. See the constant defining a specific extra data
        /// format for the info on how to calculate the hash.
        ///
        /// Must be set to a zero hash if the oracle report contains no extra data.
        ///
        bytes32 extraDataHash;

        /// @dev Number of the extra data items.
        ///
        /// Must be set to zero if the oracle report contains no extra data.
        ///
        uint256 extraDataItemsCount;
    }

    uint256 public constant EXTRA_DATA_TYPE_STUCK_VALIDATORS = 1;
    uint256 public constant EXTRA_DATA_TYPE_EXITED_VALIDATORS = 2;

    /// @notice The extra data format used to signify that the oracle report contains no extra data.
    ///
    uint256 public constant EXTRA_DATA_FORMAT_EMPTY = 0;

    /// @notice The list format for the extra data array. Used when all extra data processing
    /// fits into a single or multiple transactions.
    ///
    /// Depend on the extra data size it passed within a single or multiple transactions.
    /// Each transaction contains next transaction hash and a bytearray containing data items
    /// packed tightly.
    ///
    /// Hash is a keccak256 hash calculated over the transaction data (next transaction hash and bytearray items).
    /// The Solidity equivalent of the hash calculation code would be `keccak256(data)`,
    /// where `data` has the `bytes` type.
    ///
    uint256 public constant EXTRA_DATA_FORMAT_LIST = 1;

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
    function submitReportData(ReportData calldata data, uint256 contractVersion) external {
        _checkMsgSenderIsAllowedToSubmitData();
        _checkContractVersion(contractVersion);
        _checkConsensusData(data.refSlot, data.consensusVersion, keccak256(abi.encode(data)));
        uint256 prevRefSlot = _startProcessing();
        _handleConsensusReportData(data, prevRefSlot);
    }

    /// @notice Triggers the processing required when no extra data is present in the report,
    /// i.e. when extra data format equals EXTRA_DATA_FORMAT_EMPTY.
    ///
    function submitReportExtraDataEmpty() external {
        _submitReportExtraDataEmpty();
    }

    /// @notice Submits report extra data in the EXTRA_DATA_FORMAT_LIST format for processing.
    ///
    /// @param data The extra data chunk with items list. See docs for the `EXTRA_DATA_FORMAT_LIST`
    ///              constant for details.
    ///
    function submitReportExtraDataList(bytes calldata data) external {
        _submitReportExtraDataList(data);
    }

    struct ProcessingState {
        /// @notice Reference slot for the current reporting frame.
        uint256 currentFrameRefSlot;
        /// @notice The last time at which a data can be submitted for the current reporting frame.
        uint256 processingDeadlineTime;
        /// @notice Hash of the main report data. Zero bytes if consensus on the hash hasn't been
        /// reached yet for the current reporting frame.
        bytes32 mainDataHash;
        /// @notice Whether the main report data for the current reporting frame has already been
        /// submitted.
        bool mainDataSubmitted;
        /// @notice Hash of the extra report data. Should be ignored unless `mainDataSubmitted`
        /// is true.
        bytes32 extraDataHash;
        /// @notice Format of the extra report data for the current reporting frame. Should be
        /// ignored unless `mainDataSubmitted` is true.
        uint256 extraDataFormat;
        /// @notice Whether any extra report data for the current reporting frame has been submitted.
        bool extraDataSubmitted;
        /// @notice Total number of extra report data items for the current reporting frame.
        /// Should be ignored unless `mainDataSubmitted` is true.
        uint256 extraDataItemsCount;
        /// @notice How many extra report data items are already submitted for the current
        /// reporting frame.
        uint256 extraDataItemsSubmitted;
    }

    /// @notice Returns data processing state for the current reporting frame.
    /// @return result See the docs for the `ProcessingState` struct.
    ///
    function getProcessingState() external view returns (ProcessingState memory result) {
        ConsensusReport memory report = _storageConsensusReport().value;
        result.currentFrameRefSlot = _getCurrentRefSlot();

        if (report.hash == ZERO_HASH || result.currentFrameRefSlot != report.refSlot) {
            return result;
        }

        result.processingDeadlineTime = report.processingDeadlineTime;
        result.mainDataHash = report.hash;

        uint256 processingRefSlot = LAST_PROCESSING_REF_SLOT_POSITION.getStorageUint256();
        result.mainDataSubmitted = report.refSlot == processingRefSlot;
        if (!result.mainDataSubmitted) {
            return result;
        }

        ExtraDataProcessingState memory extraState = _storageExtraDataProcessingState().value;
        result.extraDataHash = extraState.dataHash;
        result.extraDataFormat = extraState.dataFormat;
        result.extraDataSubmitted = extraState.submitted;
        result.extraDataItemsCount = extraState.itemsCount;
        result.extraDataItemsSubmitted = extraState.itemsProcessed;
    }

    ///
    /// Implementation & helpers
    ///

    /// @dev Returns last processed reference slot of the legacy oracle.
    ///
    /// Old oracle didn't specify what slot use as a reference one, but actually
    /// used the first slot of the first frame's epoch. The new oracle uses the
    /// last slot of the previous frame's last epoch as a reference one.
    ///
    /// Oracle migration scheme:
    ///
    /// last old frame    <--------->
    /// old frames       |r  .   .   |
    /// new frames                  r|   .   .  r|   .   .  r|
    /// first new frame               <--------->
    /// events            0  1  2   3  4
    /// time ------------------------------------------------>
    ///
    /// 0. last reference slot of legacy oracle
    /// 1. last legacy oracle's consensus report arrives
    /// 2. new oracle is deployed and enabled, legacy oracle is disabled and upgraded to
    ///    the compatibility implementation
    /// 3. first reference slot of the new oracle
    /// 4. first new oracle's consensus report arrives
    ///
    function _checkOracleMigration(
        address legacyOracle,
        address consensusContract
    )
        internal view returns (uint256)
    {
        (uint256 initialEpoch,
            uint256 epochsPerFrame) = IConsensusContract(consensusContract).getFrameConfig();

        (uint256 slotsPerEpoch,
            uint256 secondsPerSlot,
            uint256 genesisTime) = IConsensusContract(consensusContract).getChainConfig();

        {
            // check chain spec to match the prev. one (a block is used to reduce stack allocation)
            (uint256 legacyEpochsPerFrame,
                uint256 legacySlotsPerEpoch,
                uint256 legacySecondsPerSlot,
                uint256 legacyGenesisTime) = ILegacyOracle(legacyOracle).getBeaconSpec();
            if (slotsPerEpoch != legacySlotsPerEpoch ||
                secondsPerSlot != legacySecondsPerSlot ||
                genesisTime != legacyGenesisTime
            ) {
                revert IncorrectOracleMigration(0);
            }
            if (epochsPerFrame != legacyEpochsPerFrame) {
                revert IncorrectOracleMigration(1);
            }
        }

        uint256 legacyProcessedEpoch = ILegacyOracle(legacyOracle).getLastCompletedEpochId();
        if (initialEpoch != legacyProcessedEpoch + epochsPerFrame) {
            revert IncorrectOracleMigration(2);
        }

        // last processing ref. slot of the new oracle should be set to the last processed
        // ref. slot of the legacy oracle, i.e. the first slot of the last processed epoch
        return legacyProcessedEpoch * slotsPerEpoch;
    }

    function _initialize(
        address admin,
        address consensusContract,
        uint256 consensusVersion,
        uint256 lastProcessingRefSlot
    ) internal {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);

        BaseOracle._initialize(consensusContract, consensusVersion, lastProcessingRefSlot);
    }

    function _handleConsensusReport(
        ConsensusReport memory /* report */,
        uint256 /* prevSubmittedRefSlot */,
        uint256 prevProcessingRefSlot
    ) internal override {
        ExtraDataProcessingState memory state = _storageExtraDataProcessingState().value;
        if (state.refSlot == prevProcessingRefSlot && (
            !state.submitted || state.itemsProcessed < state.itemsCount
        )) {
            emit WarnExtraDataIncompleteProcessing(
                prevProcessingRefSlot,
                state.itemsProcessed,
                state.itemsCount
            );
        }
    }

    function _checkMsgSenderIsAllowedToSubmitData() internal view {
        address sender = _msgSender();
        if (!hasRole(SUBMIT_DATA_ROLE, sender) && !_isConsensusMember(sender)) {
            revert SenderNotAllowed();
        }
    }

    function _handleConsensusReportData(ReportData calldata data, uint256 prevRefSlot) internal {
        if (data.extraDataFormat == EXTRA_DATA_FORMAT_EMPTY) {
            if (data.extraDataHash != ZERO_HASH) {
                revert UnexpectedExtraDataHash(ZERO_HASH, data.extraDataHash);
            }
            if (data.extraDataItemsCount != 0) {
                revert UnexpectedExtraDataItemsCount(0, data.extraDataItemsCount);
            }
        } else {
            if (data.extraDataFormat != EXTRA_DATA_FORMAT_LIST) {
                revert UnsupportedExtraDataFormat(data.extraDataFormat);
            }
            if (data.extraDataItemsCount == 0) {
                revert ExtraDataItemsCountCannotBeZeroForNonEmptyData();
            }
            if (data.extraDataHash == ZERO_HASH) {
                revert ExtraDataHashCannotBeZeroForNonEmptyData();
            }
        }

        ILegacyOracle(LEGACY_ORACLE).handleConsensusLayerReport(
            data.refSlot,
            data.clBalanceGwei * 1e9,
            data.numValidators
        );

        uint256 slotsElapsed = data.refSlot - prevRefSlot;

        IStakingRouter stakingRouter = IStakingRouter(LOCATOR.stakingRouter());
        IWithdrawalQueue withdrawalQueue = IWithdrawalQueue(LOCATOR.withdrawalQueue());

        _processStakingRouterExitedValidatorsByModule(
            stakingRouter,
            data.stakingModuleIdsWithNewlyExitedValidators,
            data.numExitedValidatorsByStakingModule,
            slotsElapsed
        );

        withdrawalQueue.onOracleReport(
            data.isBunkerMode,
            GENESIS_TIME + prevRefSlot * SECONDS_PER_SLOT,
            GENESIS_TIME + data.refSlot * SECONDS_PER_SLOT
        );

        ILido(LIDO).handleOracleReport(
            GENESIS_TIME + data.refSlot * SECONDS_PER_SLOT,
            slotsElapsed * SECONDS_PER_SLOT,
            data.numValidators,
            data.clBalanceGwei * 1e9,
            data.withdrawalVaultBalance,
            data.elRewardsVaultBalance,
            data.sharesRequestedToBurn,
            data.withdrawalFinalizationBatches,
            data.simulatedShareRate
        );

        _storageExtraDataProcessingState().value = ExtraDataProcessingState({
            refSlot: data.refSlot.toUint64(),
            dataFormat: data.extraDataFormat.toUint16(),
            submitted: false,
            dataHash: data.extraDataHash,
            itemsCount: data.extraDataItemsCount.toUint16(),
            itemsProcessed: 0,
            lastSortingKey: 0
        });
    }

    function _processStakingRouterExitedValidatorsByModule(
        IStakingRouter stakingRouter,
        uint256[] calldata stakingModuleIds,
        uint256[] calldata numExitedValidatorsByStakingModule,
        uint256 slotsElapsed
    ) internal {
        if (stakingModuleIds.length != numExitedValidatorsByStakingModule.length) {
            revert InvalidExitedValidatorsData();
        }

        if (stakingModuleIds.length == 0) {
            return;
        }

        for (uint256 i = 1; i < stakingModuleIds.length;) {
            if (stakingModuleIds[i] <= stakingModuleIds[i - 1]) {
                revert InvalidExitedValidatorsData();
            }
            unchecked { ++i; }
        }

        for (uint256 i = 0; i < stakingModuleIds.length;) {
            if (numExitedValidatorsByStakingModule[i] == 0) {
                revert InvalidExitedValidatorsData();
            }
            unchecked { ++i; }
        }

        uint256 newlyExitedValidatorsCount = stakingRouter.updateExitedValidatorsCountByStakingModule(
            stakingModuleIds,
            numExitedValidatorsByStakingModule
        );

        uint256 exitedValidatorsRatePerDay =
            newlyExitedValidatorsCount * (1 days) /
            (SECONDS_PER_SLOT * slotsElapsed);

        IOracleReportSanityChecker(LOCATOR.oracleReportSanityChecker())
            .checkExitedValidatorsRatePerDay(exitedValidatorsRatePerDay);
    }

    function _submitReportExtraDataEmpty() internal {
        ExtraDataProcessingState memory procState = _storageExtraDataProcessingState().value;
        _checkCanSubmitExtraData(procState, EXTRA_DATA_FORMAT_EMPTY);
        if (procState.submitted) revert ExtraDataAlreadyProcessed();

        IStakingRouter(LOCATOR.stakingRouter()).onValidatorsCountsByNodeOperatorReportingFinished();
        _storageExtraDataProcessingState().value.submitted = true;
        emit ExtraDataSubmitted(procState.refSlot, 0, 0);
    }

    function _checkCanSubmitExtraData(ExtraDataProcessingState memory procState, uint256 format)
        internal view
    {
        _checkMsgSenderIsAllowedToSubmitData();

        ConsensusReport memory report = _storageConsensusReport().value;

        if (report.hash == ZERO_HASH || procState.refSlot != report.refSlot) {
            revert CannotSubmitExtraDataBeforeMainData();
        }

        _checkProcessingDeadline();

        if (procState.dataFormat != format) {
            revert UnexpectedExtraDataFormat(procState.dataFormat, format);
        }
    }

    struct ExtraDataIterState {
        uint256 index;
        uint256 itemType;
        uint256 dataOffset;
        uint256 lastSortingKey;
        // config
        address stakingRouter;
    }

    function _submitReportExtraDataList(bytes calldata data) internal {
        ExtraDataProcessingState memory procState = _storageExtraDataProcessingState().value;
        _checkCanSubmitExtraData(procState, EXTRA_DATA_FORMAT_LIST);

        if (procState.itemsProcessed == procState.itemsCount) {
            revert ExtraDataAlreadyProcessed();
        }

        bytes32 dataHash = keccak256(data);
        if (dataHash != procState.dataHash) {
            revert UnexpectedExtraDataHash(procState.dataHash, dataHash);
        }

        // load the next hash value
        assembly {
            dataHash := calldataload(data.offset)
        }

        ExtraDataIterState memory iter = ExtraDataIterState({
            index: procState.itemsProcessed > 0 ? procState.itemsProcessed - 1 : 0,
            itemType: 0,
            dataOffset: 32, // skip the next hash bytes
            lastSortingKey: procState.lastSortingKey,
            stakingRouter: LOCATOR.stakingRouter()
        });

        _processExtraDataItems(data, iter);
        uint256 itemsProcessed = iter.index + 1;

        if (dataHash == ZERO_HASH) {
            if (itemsProcessed != procState.itemsCount) {
                revert UnexpectedExtraDataItemsCount(procState.itemsCount, itemsProcessed);
            }

            procState.submitted = true;
            procState.itemsProcessed = uint64(itemsProcessed);
            procState.lastSortingKey = iter.lastSortingKey;
            _storageExtraDataProcessingState().value = procState;

            IStakingRouter(iter.stakingRouter).onValidatorsCountsByNodeOperatorReportingFinished();
        } else {
            if (itemsProcessed >= procState.itemsCount) {
                revert UnexpectedExtraDataItemsCount(procState.itemsCount, itemsProcessed);
            }

            // save the next hash value
            procState.dataHash = dataHash;
            procState.itemsProcessed = uint64(itemsProcessed);
            procState.lastSortingKey = iter.lastSortingKey;
             _storageExtraDataProcessingState().value = procState;
        }

        emit ExtraDataSubmitted(procState.refSlot, procState.itemsProcessed, procState.itemsCount);
    }

    function _processExtraDataItems(bytes calldata data, ExtraDataIterState memory iter) internal {
        uint256 dataOffset = iter.dataOffset;
        uint256 maxNodeOperatorsPerItem = 0;
        uint256 maxNodeOperatorItemIndex = 0;
        uint256 itemsCount;
        uint256 index;
        uint256 itemType;

        while (dataOffset < data.length) {
            /// @solidity memory-safe-assembly
            assembly {
                // layout at the dataOffset:
                // |  3 bytes  | 2 bytes  |   X bytes   |
                // | itemIndex | itemType | itemPayload |
                let header := calldataload(add(data.offset, dataOffset))
                index := shr(232, header)
                itemType := and(shr(216, header), 0xffff)
                dataOffset := add(dataOffset, 5)
            }

            if (iter.lastSortingKey == 0) {
                if (index != 0) {
                    revert UnexpectedExtraDataIndex(0, index);
                }
            } else if (index != iter.index + 1) {
                revert UnexpectedExtraDataIndex(iter.index + 1, index);
            }

            iter.index = index;
            iter.itemType = itemType;
            iter.dataOffset = dataOffset;

            if (itemType == EXTRA_DATA_TYPE_EXITED_VALIDATORS ||
                itemType == EXTRA_DATA_TYPE_STUCK_VALIDATORS
            ) {
                uint256 nodeOpsProcessed = _processExtraDataItem(data, iter);

                if (nodeOpsProcessed > maxNodeOperatorsPerItem) {
                    maxNodeOperatorsPerItem = nodeOpsProcessed;
                    maxNodeOperatorItemIndex = index;
                }
            } else {
                revert UnsupportedExtraDataType(index, itemType);
            }

            assert(iter.dataOffset > dataOffset);
            dataOffset = iter.dataOffset;
            unchecked {
                // overflow is not possible here
                ++itemsCount;
            }
        }

        assert(maxNodeOperatorsPerItem > 0);

        IOracleReportSanityChecker(LOCATOR.oracleReportSanityChecker())
            .checkExtraDataItemsCountPerTransaction(itemsCount);

        IOracleReportSanityChecker(LOCATOR.oracleReportSanityChecker())
            .checkNodeOperatorsPerExtraDataItemCount(maxNodeOperatorItemIndex, maxNodeOperatorsPerItem);
    }

    function _processExtraDataItem(bytes calldata data, ExtraDataIterState memory iter) internal returns (uint256) {
        uint256 dataOffset = iter.dataOffset;
        uint256 moduleId;
        uint256 nodeOpsCount;
        uint256 nodeOpId;
        bytes calldata nodeOpIds;
        bytes calldata valuesCounts;

        if (dataOffset + 35 > data.length) {
            // has to fit at least moduleId (3 bytes), nodeOpsCount (8 bytes),
            // and data for one node operator (8 + 16 bytes), total 35 bytes
            revert InvalidExtraDataItem(iter.index);
        }

        /// @solidity memory-safe-assembly
        assembly {
            // layout at the dataOffset:
            // | 3 bytes  |   8 bytes    |  nodeOpsCount * 8 bytes  |  nodeOpsCount * 16 bytes  |
            // | moduleId | nodeOpsCount |      nodeOperatorIds     |      validatorsCounts     |
            let header := calldataload(add(data.offset, dataOffset))
            moduleId := shr(232, header)
            nodeOpsCount := and(shr(168, header), 0xffffffffffffffff)
            nodeOpIds.offset := add(data.offset, add(dataOffset, 11))
            nodeOpIds.length := mul(nodeOpsCount, 8)
            // read the 1st node operator id for checking the sorting order later
            nodeOpId := shr(192, calldataload(nodeOpIds.offset))
            valuesCounts.offset := add(nodeOpIds.offset, nodeOpIds.length)
            valuesCounts.length := mul(nodeOpsCount, 16)
            dataOffset := sub(add(valuesCounts.offset, valuesCounts.length), data.offset)
        }

        if (moduleId == 0) {
            revert InvalidExtraDataItem(iter.index);
        }

        unchecked {
            // firstly, check the sorting order between the 1st item's element and the last one of the previous item

            // | 2 bytes  | 19 bytes | 3 bytes  | 8 bytes  |
            // | itemType | 00000000 | moduleId | nodeOpId |
            uint256 sortingKey = (iter.itemType << 240) | (moduleId << 64) | nodeOpId;
            if (sortingKey <= iter.lastSortingKey) {
                revert InvalidExtraDataSortOrder(iter.index);
            }

            // secondly, check the sorting order between the rest of the elements
            uint256 tmpNodeOpId;
            for (uint256 i = 1; i < nodeOpsCount;) {
                /// @solidity memory-safe-assembly
                assembly {
                    tmpNodeOpId := shr(192, calldataload(add(nodeOpIds.offset, mul(i, 8))))
                    i := add(i, 1)
                }
                if (tmpNodeOpId <= nodeOpId) {
                    revert InvalidExtraDataSortOrder(iter.index);
                }
                nodeOpId = tmpNodeOpId;
            }

            // update the last sorting key with the last item's element
            iter.lastSortingKey = ((sortingKey >> 64) << 64) | nodeOpId;
        }

        if (dataOffset > data.length || nodeOpsCount == 0) {
            revert InvalidExtraDataItem(iter.index);
        }

        if (iter.itemType == EXTRA_DATA_TYPE_STUCK_VALIDATORS) {
            IStakingRouter(iter.stakingRouter)
                .reportStakingModuleStuckValidatorsCountByNodeOperator(moduleId, nodeOpIds, valuesCounts);
        } else {
            IStakingRouter(iter.stakingRouter)
                .reportStakingModuleExitedValidatorsCountByNodeOperator(moduleId, nodeOpIds, valuesCounts);
        }

        iter.dataOffset = dataOffset;
        return nodeOpsCount;
    }

    ///
    /// Storage helpers
    ///

    struct StorageExtraDataProcessingState {
        ExtraDataProcessingState value;
    }

    function _storageExtraDataProcessingState()
        internal pure returns (StorageExtraDataProcessingState storage r)
    {
        bytes32 position = EXTRA_DATA_PROCESSING_STATE_POSITION;
        assembly { r.slot := position }
    }
}