// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

library Math {
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /// @notice Tests if x ∈ [a, b) (mod n)
    ///
    function pointInHalfOpenIntervalModN(uint256 x, uint256 a, uint256 b, uint256 n)
        internal pure returns (bool)
    {
        return (x + n - a) % n < (b - a) % n;
    }

    /// @notice Tests if x ∈ [a, b] (mod n)
    ///
    function pointInClosedIntervalModN(uint256 x, uint256 a, uint256 b, uint256 n)
        internal pure returns (bool)
    {
        return (x + n - a) % n <= (b - a) % n;
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

contract HashConsensus is AccessControlEnumerable {
    using SafeCast for uint256;

    error InvalidChainConfig();
    error NumericOverflow();
    error AdminCannotBeZero();
    error ReportProcessorCannotBeZero();
    error DuplicateMember();
    error AddressCannotBeZero();
    error InitialEpochIsYetToArrive();
    error InitialEpochAlreadyArrived();
    error InitialEpochRefSlotCannotBeEarlierThanProcessingSlot();
    error EpochsPerFrameCannotBeZero();
    error NonMember();
    error UnexpectedConsensusVersion(uint256 expected, uint256 received);
    error QuorumTooSmall(uint256 minQuorum, uint256 receivedQuorum);
    error InvalidSlot();
    error DuplicateReport();
    error EmptyReport();
    error StaleReport();
    error NonFastLaneMemberCannotReportWithinFastLaneInterval();
    error NewProcessorCannotBeTheSame();
    error ConsensusReportAlreadyProcessing();
    error FastLanePeriodCannotBeLongerThanFrame();

    event FrameConfigSet(uint256 newInitialEpoch, uint256 newEpochsPerFrame);
    event FastLaneConfigSet(uint256 fastLaneLengthSlots);
    event MemberAdded(address indexed addr, uint256 newTotalMembers, uint256 newQuorum);
    event MemberRemoved(address indexed addr, uint256 newTotalMembers, uint256 newQuorum);
    event QuorumSet(uint256 newQuorum, uint256 totalMembers, uint256 prevQuorum);
    event ReportReceived(uint256 indexed refSlot, address indexed member, bytes32 report);
    event ConsensusReached(uint256 indexed refSlot, bytes32 report, uint256 support);
    event ConsensusLost(uint256 indexed refSlot);
    event ReportProcessorSet(address indexed processor, address indexed prevProcessor);

    struct FrameConfig {
        uint64 initialEpoch;
        uint64 epochsPerFrame;
        uint64 fastLaneLengthSlots;
    }

    /// @dev Oracle reporting is divided into frames, each lasting the same number of slots.
    ///
    /// The start slot of the next frame is always the next slot after the end slot of the previous
    /// frame.
    ///
    /// Each frame also has a reference slot: if the oracle report contains any data derived from
    /// onchain data, the onchain data should be sampled at the reference slot.
    ///
    struct ConsensusFrame {
        // frame index; increments by 1 with each frame but resets to zero on frame size change
        uint256 index;
        // the slot at which to read the state around which consensus is being reached;
        // if the slot contains a block, the state should include all changes from that block
        uint256 refSlot;
        // the last slot at which a report can be reported and processed
        uint256 reportProcessingDeadlineSlot;
    }

    struct ReportingState {
        // the last reference slot any report was received for
        uint64 lastReportRefSlot;
        // the last reference slot a consensus was reached for
        uint64 lastConsensusRefSlot;
        // the last consensus variant index
        uint64 lastConsensusVariantIndex;
    }

    struct MemberState {
        // the last reference slot a report from this member was received for
        uint64 lastReportRefSlot;
        // the variant index of the last report from this member
        uint64 lastReportVariantIndex;
    }

    struct ReportVariant {
        // the reported hash
        bytes32 hash;
        // how many unique members from the current set reported this hash in the current frame
        uint64 support;
    }

    /// @notice An ACL role granting the permission to modify members list members and
    /// change the quorum by calling addMember, removeMember, and setQuorum functions.
    bytes32 public constant MANAGE_MEMBERS_AND_QUORUM_ROLE =
        keccak256("MANAGE_MEMBERS_AND_QUORUM_ROLE");

    /// @notice An ACL role granting the permission to disable the consensus by calling
    /// the disableConsensus function. Enabling the consensus back requires the possession
    /// of the MANAGE_QUORUM_ROLE.
    bytes32 public constant DISABLE_CONSENSUS_ROLE = keccak256("DISABLE_CONSENSUS_ROLE");

    /// @notice An ACL role granting the permission to change reporting interval duration
    /// and fast lane reporting interval length by calling setFrameConfig.
    bytes32 public constant MANAGE_FRAME_CONFIG_ROLE = keccak256("MANAGE_FRAME_CONFIG_ROLE");

    /// @notice An ACL role granting the permission to change fast lane reporting interval
    /// length by calling setFastLaneLengthSlots.
    bytes32 public constant MANAGE_FAST_LANE_CONFIG_ROLE = keccak256("MANAGE_FAST_LANE_CONFIG_ROLE");

    /// @notice An ACL role granting the permission to change еру report processor
    /// contract by calling setReportProcessor.
    bytes32 public constant MANAGE_REPORT_PROCESSOR_ROLE = keccak256("MANAGE_REPORT_PROCESSOR_ROLE");

    /// Chain specification
    uint64 internal immutable SLOTS_PER_EPOCH;
    uint64 internal immutable SECONDS_PER_SLOT;
    uint64 internal immutable GENESIS_TIME;

    /// @dev A quorum value that effectively disables the oracle.
    uint256 internal constant UNREACHABLE_QUORUM = type(uint256).max;
    bytes32 internal constant ZERO_HASH = bytes32(0);

    /// @dev An offset from the processing deadline slot of the previous frame (i.e. the last slot
    /// at which a report for the prev. frame can be submitted and its processing started) to the
    /// reference slot of the next frame (equal to the last slot of the previous frame).
    /// frame[i].reportProcessingDeadlineSlot := frame[i + 1].refSlot - DEADLINE_SLOT_OFFSET
    uint256 internal constant DEADLINE_SLOT_OFFSET = 0;

    /// @dev Reporting frame configuration
    FrameConfig internal _frameConfig;

    /// @dev Oracle committee members states array
    MemberState[] internal _memberStates;

    /// @dev Oracle committee members' addresses array
    address[] internal _memberAddresses;

    /// @dev Mapping from an oracle committee member address to the 1-based index in the
    /// members array
    mapping(address => uint256) internal _memberIndices1b;

    /// @dev A structure containing the last reference slot any report was received for, the last
    /// reference slot consensus report was achieved for, and the last consensus variant index
    ReportingState internal _reportingState;

    /// @dev Oracle committee members quorum value, must be larger than totalMembers // 2
    uint256 internal _quorum;

    /// @dev Mapping from a report variant index to the ReportVariant structure
    mapping(uint256 => ReportVariant) internal _reportVariants;

    /// @dev The number of report variants
    uint256 internal _reportVariantsLength;

    /// @dev The address of the report processor contract
    address internal _reportProcessor;

    ///
    /// Initialization
    ///

    constructor(
        uint256 slotsPerEpoch,
        uint256 secondsPerSlot,
        uint256 genesisTime,
        uint256 epochsPerFrame,
        uint256 fastLaneLengthSlots,
        address admin,
        address reportProcessor
    ) {
        if (slotsPerEpoch == 0) revert InvalidChainConfig();
        if (secondsPerSlot == 0) revert InvalidChainConfig();

        SLOTS_PER_EPOCH = slotsPerEpoch.toUint64();
        SECONDS_PER_SLOT = secondsPerSlot.toUint64();
        GENESIS_TIME = genesisTime.toUint64();

        if (admin == address(0)) revert AdminCannotBeZero();
        if (reportProcessor == address(0)) revert ReportProcessorCannotBeZero();

        _setupRole(DEFAULT_ADMIN_ROLE, admin);

        uint256 farFutureEpoch = _computeEpochAtTimestamp(type(uint64).max);
        _setFrameConfig(farFutureEpoch, epochsPerFrame, fastLaneLengthSlots, FrameConfig(0, 0, 0));

        _reportProcessor = reportProcessor;
    }

    ///
    /// Time
    ///

    /// @notice Returns the immutable chain parameters required to calculate epoch and slot
    /// given a timestamp.
    ///
    function getChainConfig() external view returns (
        uint256 slotsPerEpoch,
        uint256 secondsPerSlot,
        uint256 genesisTime
    ) {
        return (SLOTS_PER_EPOCH, SECONDS_PER_SLOT, GENESIS_TIME);
    }

    /// @notice Returns the time-related configuration.
    ///
    /// @return initialEpoch Epoch of the frame with zero index.
    /// @return epochsPerFrame Length of a frame in epochs.
    /// @return fastLaneLengthSlots Length of the fast lane interval in slots; see `getIsFastLaneMember`.
    ///
    function getFrameConfig() external view returns (
        uint256 initialEpoch,
        uint256 epochsPerFrame,
        uint256 fastLaneLengthSlots
    ) {
        FrameConfig memory config = _frameConfig;
        return (config.initialEpoch, config.epochsPerFrame, config.fastLaneLengthSlots);
    }

    /// @notice Returns the current reporting frame.
    ///
    /// @return refSlot The frame's reference slot: if the data the consensus is being reached upon
    ///         includes or depends on any onchain state, this state should be queried at the
    ///         reference slot. If the slot contains a block, the state should include all changes
    ///         from that block.
    ///
    /// @return reportProcessingDeadlineSlot The last slot at which the report can be processed by
    ///         the report processor contract.
    ///
    function getCurrentFrame() external view returns (
        uint256 refSlot,
        uint256 reportProcessingDeadlineSlot
    ) {
        ConsensusFrame memory frame = _getCurrentFrame();
        return (frame.refSlot, frame.reportProcessingDeadlineSlot);
    }

    /// @notice Returns the earliest possible reference slot, i.e. the reference slot of the
    /// reporting frame with zero index.
    ///
    function getInitialRefSlot() external view returns (uint256) {
        return _getInitialFrame().refSlot;
    }

    /// @notice Sets a new initial epoch given that the current initial epoch is in the future.
    ///
    /// @param initialEpoch The new initial epoch.
    ///
    function updateInitialEpoch(uint256 initialEpoch) external onlyRole(DEFAULT_ADMIN_ROLE) {
        FrameConfig memory prevConfig = _frameConfig;

        if (_computeEpochAtTimestamp(_getTime()) >= prevConfig.initialEpoch) {
            revert InitialEpochAlreadyArrived();
        }

        _setFrameConfig(
            initialEpoch,
            prevConfig.epochsPerFrame,
            prevConfig.fastLaneLengthSlots,
            prevConfig
        );

        if (_getInitialFrame().refSlot < _getLastProcessingRefSlot()) {
            revert InitialEpochRefSlotCannotBeEarlierThanProcessingSlot();
        }
    }

    /// @notice Updates the time-related configuration.
    ///
    /// @param epochsPerFrame Length of a frame in epochs.
    /// @param fastLaneLengthSlots Length of the fast lane interval in slots; see `getIsFastLaneMember`.
    ///
    function setFrameConfig(uint256 epochsPerFrame, uint256 fastLaneLengthSlots)
        external onlyRole(MANAGE_FRAME_CONFIG_ROLE)
    {
        // Updates epochsPerFrame in a way that either keeps the current reference slot the same
        // or increases it by at least the minimum of old and new frame sizes.
        uint256 timestamp = _getTime();
        uint256 currentFrameStartEpoch = _computeFrameStartEpoch(timestamp, _frameConfig);
        _setFrameConfig(currentFrameStartEpoch, epochsPerFrame, fastLaneLengthSlots, _frameConfig);
    }

    ///
    /// Members
    ///

    /// @notice Returns whether the given address is currently a member of the consensus.
    ///
    function getIsMember(address addr) external view returns (bool) {
        return _isMember(addr);
    }

    /// @notice Returns whether the given address is a fast lane member for the current reporting
    /// frame.
    ///
    /// Fast lane members is a subset of all members that changes each reporting frame. These
    /// members can, and are expected to, submit a report during the first part of the frame called
    /// the "fast lane interval" and defined via `setFrameConfig` or `setFastLaneLengthSlots`. Under
    /// regular circumstances, all other members are only allowed to submit a report after the fast
    /// lane interval passes.
    ///
    /// The fast lane subset consists of `quorum` members; selection is implemented as a sliding
    /// window of the `quorum` width over member indices (mod total members). The window advances
    /// by one index each reporting frame.
    ///
    /// This is done to encourage each member from the full set to participate in reporting on a
    /// regular basis, and identify any malfunctioning members.
    ///
    /// With the fast lane mechanism active, it's sufficient for the monitoring to check that
    /// consensus is consistently reached during the fast lane part of each frame to conclude that
    /// all members are active and share the same consensus rules.
    ///
    /// However, there is no guarantee that, at any given time, it holds true that only the current
    /// fast lane members can or were able to report during the currently-configured fast lane
    /// interval of the current frame. In particular, this assumption can be violated in any frame
    /// during which the members set, initial epoch, or the quorum number was changed, or the fast
    /// lane interval length was increased. Thus, the fast lane mechanism should not be used for any
    /// purpose other than monitoring of the members liveness, and monitoring tools should take into
    /// consideration the potential irregularities within frames with any configuration changes.
    ///
    function getIsFastLaneMember(address addr) external view returns (bool) {
        uint256 index1b = _memberIndices1b[addr];
        unchecked {
            return index1b > 0 && _isFastLaneMember(index1b - 1, _getCurrentFrame().index);
        }
    }

    /// @notice Returns all current members, together with the last reference slot each member
    /// submitted a report for.
    ///
    function getMembers() external view returns (
        address[] memory addresses,
        uint256[] memory lastReportedRefSlots
    ) {
        return _getMembers(false);
    }

    /// @notice Returns the subset of the oracle committee members (consisting of `quorum` items)
    /// that changes each frame.
    ///
    /// See `getIsFastLaneMember`.
    ///
    function getFastLaneMembers() external view returns (
        address[] memory addresses,
        uint256[] memory lastReportedRefSlots
    ) {
        return _getMembers(true);
    }

    /// @notice Sets the duration of the fast lane interval of the reporting frame.
    ///
    /// See `getIsFastLaneMember`.
    ///
    /// @param fastLaneLengthSlots The length of the fast lane reporting interval in slots. Setting
    ///        it to zero disables the fast lane subset, allowing any oracle to report starting from
    ///        the first slot of a frame and until the frame's reporting deadline.
    ///
    function setFastLaneLengthSlots(uint256 fastLaneLengthSlots)
        external onlyRole(MANAGE_FAST_LANE_CONFIG_ROLE)
    {
        _setFastLaneLengthSlots(fastLaneLengthSlots);
    }

    function addMember(address addr, uint256 quorum)
        external
        onlyRole(MANAGE_MEMBERS_AND_QUORUM_ROLE)
    {
        _addMember(addr, quorum);
    }

    function removeMember(address addr, uint256 quorum)
        external
        onlyRole(MANAGE_MEMBERS_AND_QUORUM_ROLE)
    {
        _removeMember(addr, quorum);
    }

    function getQuorum() external view returns (uint256) {
        return _quorum;
    }

    function setQuorum(uint256 quorum) external {
        // access control is performed inside the next call
        _setQuorumAndCheckConsensus(quorum, _memberStates.length);
    }

    /// @notice Disables the oracle by setting the quorum to an unreachable value.
    ///
    function disableConsensus() external {
        // access control is performed inside the next call
        _setQuorumAndCheckConsensus(UNREACHABLE_QUORUM, _memberStates.length);
    }

    ///
    /// Report processor
    ///

    function getReportProcessor() external view returns (address) {
        return _reportProcessor;
    }

    function setReportProcessor(address newProcessor)
        external
        onlyRole(MANAGE_REPORT_PROCESSOR_ROLE)
    {
        _setReportProcessor(newProcessor);
    }

    ///
    /// Consensus
    ///

    /// @notice Returns info about the current frame and consensus state in that frame.
    ///
    /// @return refSlot Reference slot of the current reporting frame.
    ///
    /// @return consensusReport Consensus report for the current frame, if any.
    ///         Zero bytes otherwise.
    ///
    /// @return isReportProcessing If consensus report for the current frame is already
    ///         being processed. Consensus can be changed before the processing starts.
    ///
    function getConsensusState() external view returns (
        uint256 refSlot,
        bytes32 consensusReport,
        bool isReportProcessing
    ) {
        refSlot = _getCurrentFrame().refSlot;
        (consensusReport,,) = _getConsensusReport(refSlot, _quorum);
        isReportProcessing = _getLastProcessingRefSlot() == refSlot;
    }

    /// @notice Returns report variants and their support for the current reference slot.
    ///
    function getReportVariants() external view returns (
        bytes32[] memory variants,
        uint256[] memory support
    ) {
        if (_reportingState.lastReportRefSlot != _getCurrentFrame().refSlot) {
            return (variants, support);
        }

        uint256 variantsLength = _reportVariantsLength;
        variants = new bytes32[](variantsLength);
        support = new uint256[](variantsLength);

        for (uint256 i = 0; i < variantsLength; ++i) {
            ReportVariant memory variant = _reportVariants[i];
            variants[i] = variant.hash;
            support[i] = variant.support;
        }
    }

    struct MemberConsensusState {
        /// @notice Current frame's reference slot.
        uint256 currentFrameRefSlot;

        /// @notice Consensus report for the current frame, if any. Zero bytes otherwise.
        bytes32 currentFrameConsensusReport;

        /// @notice Whether the provided address is a member of the oracle committee.
        bool isMember;

        /// @notice Whether the oracle committee member is in the fast lane members subset
        /// of the current reporting frame. See `getIsFastLaneMember`.
        bool isFastLane;

        /// @notice Whether the oracle committee member is allowed to submit a report at
        /// the moment of the call.
        bool canReport;

        /// @notice The last reference slot for which the member submitted a report.
        uint256 lastMemberReportRefSlot;

        /// @notice The hash reported by the member for the current frame, if any.
        /// Zero bytes otherwise.
        bytes32 currentFrameMemberReport;
    }

    /// @notice Returns the extended information related to an oracle committee member with the
    /// given address and the current consensus state. Provides all the information needed for
    /// an oracle daemon to decide if it needs to submit a report.
    ///
    /// @param addr The member address.
    /// @return result See the docs for `MemberConsensusState`.
    ///
    function getConsensusStateForMember(address addr)
        external view returns (MemberConsensusState memory result)
    {
        ConsensusFrame memory frame = _getCurrentFrame();
        result.currentFrameRefSlot = frame.refSlot;
        (result.currentFrameConsensusReport,,) = _getConsensusReport(frame.refSlot, _quorum);

        uint256 index = _memberIndices1b[addr];
        result.isMember = index != 0;

        if (index != 0) {
            unchecked { --index; } // convert to 0-based
            MemberState memory memberState = _memberStates[index];

            result.lastMemberReportRefSlot = memberState.lastReportRefSlot;
            result.currentFrameMemberReport =
                result.lastMemberReportRefSlot == frame.refSlot
                    ? _reportVariants[memberState.lastReportVariantIndex].hash
                    : ZERO_HASH;

            uint256 slot = _computeSlotAtTimestamp(_getTime());

            result.canReport = slot <= frame.reportProcessingDeadlineSlot &&
                frame.refSlot > _getLastProcessingRefSlot();

            result.isFastLane = _isFastLaneMember(index, frame.index);

            if (!result.isFastLane && result.canReport) {
                result.canReport = slot > frame.refSlot + _frameConfig.fastLaneLengthSlots;
            }
        }
    }

    /// @notice Used by oracle members to submit hash of the data calculated for the given
    /// reference slot.
    ///
    /// @param slot The reference slot the data was calculated for. Reverts if doesn't match
    ///        the current reference slot.
    ///
    /// @param report Hash of the data calculated for the given reference slot.
    ///
    /// @param consensusVersion Version of the oracle consensus rules. Reverts if doesn't
    ///        match the version returned by the currently set consensus report processor,
    ///        or zero if no report processor is set.
    ///
    function submitReport(uint256 slot, bytes32 report, uint256 consensusVersion) external {
        _submitReport(slot, report, consensusVersion);
    }

    ///
    /// Implementation: time
    ///

    function _setFrameConfig(
        uint256 initialEpoch,
        uint256 epochsPerFrame,
        uint256 fastLaneLengthSlots,
        FrameConfig memory prevConfig
    ) internal {
        if (epochsPerFrame == 0) revert EpochsPerFrameCannotBeZero();

        if (fastLaneLengthSlots > epochsPerFrame * SLOTS_PER_EPOCH) {
            revert FastLanePeriodCannotBeLongerThanFrame();
        }

        _frameConfig = FrameConfig(
            initialEpoch.toUint64(),
            epochsPerFrame.toUint64(),
            fastLaneLengthSlots.toUint64()
        );

        if (initialEpoch != prevConfig.initialEpoch || epochsPerFrame != prevConfig.epochsPerFrame) {
            emit FrameConfigSet(initialEpoch, epochsPerFrame);
        }

        if (fastLaneLengthSlots != prevConfig.fastLaneLengthSlots) {
            emit FastLaneConfigSet(fastLaneLengthSlots);
        }
    }

    function _getCurrentFrame() internal view returns (ConsensusFrame memory) {
        return _getFrameAtTimestamp(_getTime(), _frameConfig);
    }

    function _getInitialFrame() internal view returns (ConsensusFrame memory) {
        return _getFrameAtIndex(0, _frameConfig);
    }

    function _getFrameAtTimestamp(uint256 timestamp, FrameConfig memory config)
        internal view returns (ConsensusFrame memory)
    {
        return _getFrameAtIndex(_computeFrameIndex(timestamp, config), config);
    }

    function _getFrameAtIndex(uint256 frameIndex, FrameConfig memory config)
        internal view returns (ConsensusFrame memory)
    {
        uint256 frameStartEpoch = _computeStartEpochOfFrameWithIndex(frameIndex, config);
        uint256 frameStartSlot = _computeStartSlotAtEpoch(frameStartEpoch);
        uint256 nextFrameStartSlot = frameStartSlot + config.epochsPerFrame * SLOTS_PER_EPOCH;

        return ConsensusFrame({
            index: frameIndex,
            refSlot: uint64(frameStartSlot - 1),
            reportProcessingDeadlineSlot: uint64(nextFrameStartSlot - 1 - DEADLINE_SLOT_OFFSET)
        });
    }

    function _computeFrameStartEpoch(uint256 timestamp, FrameConfig memory config)
        internal view returns (uint256)
    {
        return _computeStartEpochOfFrameWithIndex(_computeFrameIndex(timestamp, config), config);
    }

    function _computeStartEpochOfFrameWithIndex(uint256 frameIndex, FrameConfig memory config)
        internal pure returns (uint256)
    {
        return config.initialEpoch + frameIndex * config.epochsPerFrame;
    }

    function _computeFrameIndex(uint256 timestamp, FrameConfig memory config)
        internal view returns (uint256)
    {
        uint256 epoch = _computeEpochAtTimestamp(timestamp);
        if (epoch < config.initialEpoch) {
            revert InitialEpochIsYetToArrive();
        }
        return (epoch - config.initialEpoch) / config.epochsPerFrame;
    }

    function _computeTimestampAtSlot(uint256 slot) internal view returns (uint256) {
        // See: github.com/ethereum/consensus-specs/blob/dev/specs/bellatrix/beacon-chain.md#compute_timestamp_at_slot
        return GENESIS_TIME + slot * SECONDS_PER_SLOT;
    }

    function _computeSlotAtTimestamp(uint256 timestamp) internal view returns (uint256) {
        return (timestamp - GENESIS_TIME) / SECONDS_PER_SLOT;
    }

    function _computeEpochAtSlot(uint256 slot) internal view returns (uint256) {
        // See: github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#compute_epoch_at_slot
        return slot / SLOTS_PER_EPOCH;
    }

    function _computeEpochAtTimestamp(uint256 timestamp) internal view returns (uint256) {
        return _computeEpochAtSlot(_computeSlotAtTimestamp(timestamp));
    }

    function _computeStartSlotAtEpoch(uint256 epoch) internal view returns (uint256) {
        // See: github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#compute_start_slot_at_epoch
        return epoch * SLOTS_PER_EPOCH;
    }

    function _getTime() internal virtual view returns (uint256) {
        return block.timestamp; // solhint-disable-line not-rely-on-time
    }

    ///
    /// Implementation: members
    ///

    function _isMember(address addr) internal view returns (bool) {
        return _memberIndices1b[addr] != 0;
    }

    function _getMemberIndex(address addr) internal view returns (uint256) {
        uint256 index1b = _memberIndices1b[addr];
        if (index1b == 0) {
            revert NonMember();
        }
        unchecked {
            return uint256(index1b - 1);
        }
    }

    function _addMember(address addr, uint256 quorum) internal {
        if (_isMember(addr)) revert DuplicateMember();
        if (addr == address(0)) revert AddressCannotBeZero();

        _memberStates.push(MemberState(0, 0));
        _memberAddresses.push(addr);

        uint256 newTotalMembers = _memberStates.length;
        _memberIndices1b[addr] = newTotalMembers;

        emit MemberAdded(addr, newTotalMembers, quorum);

        _setQuorumAndCheckConsensus(quorum, newTotalMembers);
    }

    function _removeMember(address addr, uint256 quorum) internal {
        uint256 index = _getMemberIndex(addr);
        uint256 newTotalMembers = _memberStates.length - 1;

        assert(index <= newTotalMembers);
        MemberState memory memberState = _memberStates[index];

        if (index != newTotalMembers) {
            address addrToMove = _memberAddresses[newTotalMembers];
            _memberAddresses[index] = addrToMove;
            _memberStates[index] = _memberStates[newTotalMembers];
            _memberIndices1b[addrToMove] = index + 1;
        }

        _memberStates.pop();
        _memberAddresses.pop();
        _memberIndices1b[addr] = 0;

        emit MemberRemoved(addr, newTotalMembers, quorum);

        if (memberState.lastReportRefSlot > 0) {
            // member reported at least once
            ConsensusFrame memory frame = _getCurrentFrame();

            if (memberState.lastReportRefSlot == frame.refSlot &&
                _getLastProcessingRefSlot() < frame.refSlot
            ) {
                // member reported for the current ref. slot and the consensus report
                // is not processing yet => need to cancel the member's report
                --_reportVariants[memberState.lastReportVariantIndex].support;
            }
        }

        _setQuorumAndCheckConsensus(quorum, newTotalMembers);
    }

    function _setFastLaneLengthSlots(uint256 fastLaneLengthSlots) internal {
        FrameConfig memory frameConfig = _frameConfig;
        if (fastLaneLengthSlots > frameConfig.epochsPerFrame * SLOTS_PER_EPOCH) {
            revert FastLanePeriodCannotBeLongerThanFrame();
        }
        if (fastLaneLengthSlots != frameConfig.fastLaneLengthSlots) {
            _frameConfig.fastLaneLengthSlots = fastLaneLengthSlots.toUint64();
            emit FastLaneConfigSet(fastLaneLengthSlots);
        }
    }

    /// @dev Returns start and past-end incides (mod totalMembers) of the fast lane members subset.
    ///
    function _getFastLaneSubset(uint256 frameIndex, uint256 totalMembers)
        internal view returns (uint256 startIndex, uint256 pastEndIndex)
    {
        uint256 quorum = _quorum;
        if (quorum >= totalMembers) {
            startIndex = 0;
            pastEndIndex = totalMembers;
        } else {
            startIndex = frameIndex % totalMembers;
            pastEndIndex = startIndex + quorum;
        }
    }

    /// @dev Tests whether the member with the given `index` is in the fast lane subset for the
    /// given reporting `frameIndex`.
    ///
    function _isFastLaneMember(uint256 index, uint256 frameIndex) internal view returns (bool) {
        uint256 totalMembers = _memberStates.length;
        (uint256 flLeft, uint256 flPastRight) = _getFastLaneSubset(frameIndex, totalMembers);
        unchecked {
            return (
                flPastRight != 0 &&
                Math.pointInClosedIntervalModN(index, flLeft, flPastRight - 1, totalMembers)
            );
        }
    }

    function _getMembers(bool fastLane) internal view returns (
        address[] memory addresses,
        uint256[] memory lastReportedRefSlots
    ) {
        uint256 totalMembers = _memberStates.length;
        uint256 left;
        uint256 right;

        if (fastLane) {
            (left, right) = _getFastLaneSubset(_getCurrentFrame().index, totalMembers);
        } else {
            right = totalMembers;
        }

        addresses = new address[](right - left);
        lastReportedRefSlots = new uint256[](addresses.length);

        for (uint256 i = left; i < right; ++i) {
            uint256 iModTotal = i % totalMembers;
            MemberState memory memberState = _memberStates[iModTotal];
            uint256 k = i - left;
            addresses[k] = _memberAddresses[iModTotal];
            lastReportedRefSlots[k] = memberState.lastReportRefSlot;
        }
    }

    ///
    /// Implementation: consensus
    ///

    function _submitReport(uint256 slot, bytes32 report, uint256 consensusVersion) internal {
        if (slot == 0) revert InvalidSlot();
        if (slot > type(uint64).max) revert NumericOverflow();
        if (report == ZERO_HASH) revert EmptyReport();

        uint256 memberIndex = _getMemberIndex(_msgSender());
        MemberState memory memberState = _memberStates[memberIndex];

        uint256 expectedConsensusVersion = _getConsensusVersion();
        if (consensusVersion != expectedConsensusVersion) {
            revert UnexpectedConsensusVersion(expectedConsensusVersion, consensusVersion);
        }

        uint256 timestamp = _getTime();
        uint256 currentSlot = _computeSlotAtTimestamp(timestamp);
        FrameConfig memory config = _frameConfig;
        ConsensusFrame memory frame = _getFrameAtTimestamp(timestamp, config);

        if (slot != frame.refSlot) revert InvalidSlot();
        if (currentSlot > frame.reportProcessingDeadlineSlot) revert StaleReport();

        if (currentSlot <= frame.refSlot + config.fastLaneLengthSlots &&
            !_isFastLaneMember(memberIndex, frame.index)
        ) {
            revert NonFastLaneMemberCannotReportWithinFastLaneInterval();
        }

        if (slot <= _getLastProcessingRefSlot()) {
            // consensus for the ref. slot was already reached and consensus report is processing
            if (slot == memberState.lastReportRefSlot) {
                // member sends a report for the same slot => let them know via a revert
                revert ConsensusReportAlreadyProcessing();
            } else {
                // member hasn't sent a report for this slot => normal operation, do nothing
                return;
            }
        }

        uint256 variantsLength;

        if (_reportingState.lastReportRefSlot != slot) {
            // first report for a new slot => clear report variants
            _reportingState.lastReportRefSlot = uint64(slot);
            variantsLength = 0;
        } else {
            variantsLength = _reportVariantsLength;
        }

        uint64 varIndex = 0;
        bool prevConsensusLost = false;

        while (varIndex < variantsLength && _reportVariants[varIndex].hash != report) {
            ++varIndex;
        }

        if (slot == memberState.lastReportRefSlot) {
            uint64 prevVarIndex = memberState.lastReportVariantIndex;
            assert(prevVarIndex < variantsLength);
            if (varIndex == prevVarIndex) {
                revert DuplicateReport();
            } else {
                uint256 support = --_reportVariants[prevVarIndex].support;
                if (support == _quorum - 1) {
                    prevConsensusLost = true;
                }
            }
        }

        uint256 support;

        if (varIndex < variantsLength) {
            support = ++_reportVariants[varIndex].support;
        } else {
            support = 1;
            _reportVariants[varIndex] = ReportVariant({hash: report, support: 1});
            _reportVariantsLength = ++variantsLength;
        }

        _memberStates[memberIndex] = MemberState({
            lastReportRefSlot: uint64(slot),
            lastReportVariantIndex: varIndex
        });

        emit ReportReceived(slot, _msgSender(), report);

        if (support >= _quorum) {
            _consensusReached(frame, report, varIndex, support);
        } else if (prevConsensusLost) {
            _consensusNotReached(frame);
        }
    }

    function _consensusReached(
        ConsensusFrame memory frame,
        bytes32 report,
        uint256 variantIndex,
        uint256 support
    ) internal {
        if (_reportingState.lastConsensusRefSlot != frame.refSlot ||
            _reportingState.lastConsensusVariantIndex != variantIndex
        ) {
            _reportingState.lastConsensusRefSlot = uint64(frame.refSlot);
            _reportingState.lastConsensusVariantIndex = uint64(variantIndex);
            emit ConsensusReached(frame.refSlot, report, support);
            _submitReportForProcessing(frame, report);
        }
    }

    function _consensusNotReached(ConsensusFrame memory frame) internal {
        if (_reportingState.lastConsensusRefSlot == frame.refSlot) {
            _reportingState.lastConsensusRefSlot = 0;
            emit ConsensusLost(frame.refSlot);
            _cancelReportProcessing(frame);
        }
    }

    function _setQuorumAndCheckConsensus(uint256 quorum, uint256 totalMembers) internal {
        if (quorum <= totalMembers / 2) {
            revert QuorumTooSmall(totalMembers / 2 + 1, quorum);
        }

        // we're explicitly allowing quorum values greater than the number of members to
        // allow effectively disabling the oracle in case something unpredictable happens

        uint256 prevQuorum = _quorum;
        if (quorum != prevQuorum) {
            _checkRole(
                quorum == UNREACHABLE_QUORUM ? DISABLE_CONSENSUS_ROLE : MANAGE_MEMBERS_AND_QUORUM_ROLE,
                _msgSender()
            );
            _quorum = quorum;
            emit QuorumSet(quorum, totalMembers, prevQuorum);
        }

        if (_computeEpochAtTimestamp(_getTime()) >= _frameConfig.initialEpoch) {
            _checkConsensus(quorum);
        }
    }

    function _checkConsensus(uint256 quorum) internal {
        uint256 timestamp = _getTime();
        ConsensusFrame memory frame = _getFrameAtTimestamp(timestamp, _frameConfig);

        if (_computeSlotAtTimestamp(timestamp) > frame.reportProcessingDeadlineSlot) {
            // a report for the current ref. slot cannot be processed anymore
            return;
        }

        if (_getLastProcessingRefSlot() >= frame.refSlot) {
            // a consensus report for the current ref. slot is already being processed
            return;
        }

        (bytes32 consensusReport, int256 consensusVariantIndex, uint256 support) =
            _getConsensusReport(frame.refSlot, quorum);

        if (consensusVariantIndex >= 0) {
            _consensusReached(frame, consensusReport, uint256(consensusVariantIndex), support);
        } else {
            _consensusNotReached(frame);
        }
    }

    function _getConsensusReport(uint256 currentRefSlot, uint256 quorum)
        internal view returns (bytes32 report, int256 variantIndex, uint256 support)
    {
        if (_reportingState.lastReportRefSlot != currentRefSlot) {
            // there were no reports for the current ref. slot
            return (ZERO_HASH, -1, 0);
        }

        uint256 variantsLength = _reportVariantsLength;
        variantIndex = -1;
        report = ZERO_HASH;
        support = 0;

        for (uint256 i = 0; i < variantsLength; ++i) {
            uint256 iSupport = _reportVariants[i].support;
            if (iSupport >= quorum) {
                variantIndex = int256(i);
                report = _reportVariants[i].hash;
                support = iSupport;
                break;
            }
        }

        return (report, variantIndex, support);
    }

    ///
    /// Implementation: report processing
    ///

    function _setReportProcessor(address newProcessor) internal {
        address prevProcessor = _reportProcessor;
        if (newProcessor == address(0)) revert ReportProcessorCannotBeZero();
        if (newProcessor == prevProcessor) revert NewProcessorCannotBeTheSame();

        _reportProcessor = newProcessor;
        emit ReportProcessorSet(newProcessor, prevProcessor);

        ConsensusFrame memory frame = _getCurrentFrame();
        uint256 lastConsensusRefSlot = _reportingState.lastConsensusRefSlot;

        uint256 processingRefSlotPrev = IReportAsyncProcessor(prevProcessor).getLastProcessingRefSlot();
        uint256 processingRefSlotNext = IReportAsyncProcessor(newProcessor).getLastProcessingRefSlot();

        if (
            processingRefSlotPrev < frame.refSlot &&
            processingRefSlotNext < frame.refSlot &&
            lastConsensusRefSlot == frame.refSlot
        ) {
            bytes32 report = _reportVariants[_reportingState.lastConsensusVariantIndex].hash;
            _submitReportForProcessing(frame, report);
        }
    }

    function _getLastProcessingRefSlot() internal view returns (uint256) {
        return IReportAsyncProcessor(_reportProcessor).getLastProcessingRefSlot();
    }

    function _submitReportForProcessing(ConsensusFrame memory frame, bytes32 report) internal {
        IReportAsyncProcessor(_reportProcessor).submitConsensusReport(
            report,
            frame.refSlot,
            _computeTimestampAtSlot(frame.reportProcessingDeadlineSlot)
        );
    }

    function _cancelReportProcessing(ConsensusFrame memory frame) internal {
        IReportAsyncProcessor(_reportProcessor).discardConsensusReport(frame.refSlot);
    }

    function _getConsensusVersion() internal view returns (uint256) {
        return IReportAsyncProcessor(_reportProcessor).getConsensusVersion();
    }
}