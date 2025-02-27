// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

library MinFirstAllocationStrategy {
    uint256 private constant MAX_UINT256 = 2**256 - 1;

    /// @notice Allocates passed maxAllocationSize among the buckets. The resulting allocation doesn't exceed the
    ///     capacities of the buckets. An algorithm starts filling from the least populated buckets to equalize the fill factor.
    ///     For example, for buckets: [9998, 70, 0], capacities: [10000, 101, 100], and maxAllocationSize: 101, the allocation happens
    ///     following way:
    ///         1. top up the bucket with index 2 on 70. Intermediate state of the buckets: [9998, 70, 70]. According to the definition,
    ///            the rest allocation must be proportionally split among the buckets with the same values.
    ///         2. top up the bucket with index 1 on 15. Intermediate state of the buckets: [9998, 85, 70].
    ///         3. top up the bucket with index 2 on 15. Intermediate state of the buckets: [9998, 85, 85].
    ///         4. top up the bucket with index 1 on 1. Nothing to distribute. The final state of the buckets: [9998, 86, 85]
    /// @dev Method modifies the passed buckets array to reduce the gas costs on memory allocation.
    /// @param buckets The array of current allocations in the buckets
    /// @param capacities The array of capacities of the buckets
    /// @param allocationSize The desired value to allocate among the buckets
    /// @return allocated The total value allocated among the buckets. Can't exceed the allocationSize value
    function allocate(
        uint256[] memory buckets,
        uint256[] memory capacities,
        uint256 allocationSize
    ) public pure returns (uint256 allocated, uint256[] memory) {
        uint256 allocatedToBestCandidate = 0;
        while (allocated < allocationSize) {
            allocatedToBestCandidate = allocateToBestCandidate(buckets, capacities, allocationSize - allocated);
            if (allocatedToBestCandidate == 0) {
                break;
            }
            allocated += allocatedToBestCandidate;
        }
        return (allocated, buckets);
    }

    /// @notice Allocates the max allowed value not exceeding allocationSize to the bucket with the least value.
    ///     The candidate search happens according to the following algorithm:
    ///         1. Find the first least filled bucket which has free space. Count the number of such buckets.
    ///         2. If no buckets are found terminate the search - no free buckets
    ///         3. Find the first bucket with free space, which has the least value greater
    ///             than the bucket found in step 1. To preserve proportional allocation the resulting allocation can't exceed this value.
    ///         4. Calculate the allocation size as:
    ///             min(
    ///                 (count of least filling buckets > 1 ? ceilDiv(allocationSize, count of least filling buckets) : allocationSize),
    ///                 fill factor of the bucket found in step 3,
    ///                 free space of the least filled bucket
    ///             )
    /// @dev Method modifies the passed buckets array to reduce the gas costs on memory allocation.
    /// @param buckets The array of current allocations in the buckets
    /// @param capacities The array of capacities of the buckets
    /// @param allocationSize The desired value to allocate to the bucket
    /// @return allocated The total value allocated to the bucket. Can't exceed the allocationSize value
    function allocateToBestCandidate(
        uint256[] memory buckets,
        uint256[] memory capacities,
        uint256 allocationSize
    ) internal pure returns (uint256 allocated) {
        uint256 bestCandidateIndex = buckets.length;
        uint256 bestCandidateAllocation = MAX_UINT256;
        uint256 bestCandidatesCount = 0;

        if (allocationSize == 0) {
            return 0;
        }

        for (uint256 i = 0; i < buckets.length; ++i) {
            if (buckets[i] >= capacities[i]) {
                continue;
            } else if (bestCandidateAllocation > buckets[i]) {
                bestCandidateIndex = i;
                bestCandidatesCount = 1;
                bestCandidateAllocation = buckets[i];
            } else if (bestCandidateAllocation == buckets[i]) {
                bestCandidatesCount += 1;
            }
        }

        if (bestCandidatesCount == 0) {
            return 0;
        }

        // cap the allocation by the smallest larger allocation than the found best one
        uint256 allocationSizeUpperBound = MAX_UINT256;
        for (uint256 j = 0; j < buckets.length; ++j) {
            if (buckets[j] >= capacities[j]) {
                continue;
            } else if (buckets[j] > bestCandidateAllocation && buckets[j] < allocationSizeUpperBound) {
                allocationSizeUpperBound = buckets[j];
            }
        }

        allocated = Math256.min(
            bestCandidatesCount > 1 ? Math256.ceilDiv(allocationSize, bestCandidatesCount) : allocationSize,
            Math256.min(allocationSizeUpperBound, capacities[bestCandidateIndex]) - bestCandidateAllocation
        );
        buckets[bestCandidateIndex] += allocated;
    }
}

library Math256 {
    /// @dev Returns the largest of two numbers.
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /// @dev Returns the smallest of two numbers.
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /// @dev Returns the largest of two numbers.
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /// @dev Returns the smallest of two numbers.
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /// @dev Returns the ceiling of the division of two numbers.
    ///
    /// This differs from standard division with `/` in that it rounds up instead
    /// of rounding down.
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /// @dev Returns absolute difference of two numbers.
    function absDiff(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a - b : b - a;
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

library MemUtils {
    /**
     * @dev Allocates a memory byte array of `_len` bytes without zeroing it out.
     */
    function unsafeAllocateBytes(uint256 _len) internal pure returns (bytes memory result) {
        assembly {
            result := mload(0x40)
            mstore(result, _len)
            let freeMemPtr := add(add(result, 32), _len)
            // align free mem ptr to 32 bytes as the compiler does now
            mstore(0x40, and(add(freeMemPtr, 31), not(31)))
        }
    }

    /**
     * Performs a memory copy of `_len` bytes from position `_src` to position `_dst`.
     */
    function memcpy(uint256 _src, uint256 _dst, uint256 _len) internal pure {
        assembly {
            // while al least 32 bytes left, copy in 32-byte chunks
            for { } gt(_len, 31) { } {
                mstore(_dst, mload(_src))
                _src := add(_src, 32)
                _dst := add(_dst, 32)
                _len := sub(_len, 32)
            }
            if gt(_len, 0) {
                // read the next 32-byte chunk from _dst, replace the first N bytes
                // with those left in the _src, and write the transformed chunk back
                let mask := sub(shl(mul(8, sub(32, _len)), 1), 1) // 2 ** (8 * (32 - _len)) - 1
                let srcMasked := and(mload(_src), not(mask))
                let dstMasked := and(mload(_dst), mask)
                mstore(_dst, or(dstMasked, srcMasked))
            }
        }
    }

    /**
     * Copies `_len` bytes from `_src`, starting at position `_srcStart`, into `_dst`, starting at position `_dstStart` into `_dst`.
     */
    function copyBytes(bytes memory _src, bytes memory _dst, uint256 _srcStart, uint256 _dstStart, uint256 _len) internal pure {
        require(_srcStart + _len <= _src.length && _dstStart + _len <= _dst.length, "BYTES_ARRAY_OUT_OF_BOUNDS");
        uint256 srcStartPos;
        uint256 dstStartPos;
        assembly {
            srcStartPos := add(add(_src, 32), _srcStart)
            dstStartPos := add(add(_dst, 32), _dstStart)
        }
        memcpy(srcStartPos, dstStartPos, _len);
    }

    /**
     * Copies bytes from `_src` to `_dst`, starting at position `_dstStart` into `_dst`.
     */
    function copyBytes(bytes memory _src, bytes memory _dst, uint256 _dstStart) internal pure {
        copyBytes(_src, _dst, 0, _dstStart, _src.length);
    }
}

contract BeaconChainDepositor {
    uint256 internal constant PUBLIC_KEY_LENGTH = 48;
    uint256 internal constant SIGNATURE_LENGTH = 96;
    uint256 internal constant DEPOSIT_SIZE = 32 ether;

    /// @dev deposit amount 32eth in gweis converted to little endian uint64
    /// DEPOSIT_SIZE_IN_GWEI_LE64 = toLittleEndian64(32 ether / 1 gwei)
    uint64 internal constant DEPOSIT_SIZE_IN_GWEI_LE64 = 0x0040597307000000;

    IDepositContract public immutable DEPOSIT_CONTRACT;

    constructor(address _depositContract) {
        if (_depositContract == address(0)) revert DepositContractZeroAddress();
        DEPOSIT_CONTRACT = IDepositContract(_depositContract);
    }

    /// @dev Invokes a deposit call to the official Beacon Deposit contract
    /// @param _keysCount amount of keys to deposit
    /// @param _withdrawalCredentials Commitment to a public key for withdrawals
    /// @param _publicKeysBatch A BLS12-381 public keys batch
    /// @param _signaturesBatch A BLS12-381 signatures batch
    function _makeBeaconChainDeposits32ETH(
        uint256 _keysCount,
        bytes memory _withdrawalCredentials,
        bytes memory _publicKeysBatch,
        bytes memory _signaturesBatch
    ) internal {
        if (_publicKeysBatch.length != PUBLIC_KEY_LENGTH * _keysCount) {
            revert InvalidPublicKeysBatchLength(_publicKeysBatch.length, PUBLIC_KEY_LENGTH * _keysCount);
        }
        if (_signaturesBatch.length != SIGNATURE_LENGTH * _keysCount) {
            revert InvalidSignaturesBatchLength(_signaturesBatch.length, SIGNATURE_LENGTH * _keysCount);
        }

        bytes memory publicKey = MemUtils.unsafeAllocateBytes(PUBLIC_KEY_LENGTH);
        bytes memory signature = MemUtils.unsafeAllocateBytes(SIGNATURE_LENGTH);

        for (uint256 i; i < _keysCount;) {
            MemUtils.copyBytes(_publicKeysBatch, publicKey, i * PUBLIC_KEY_LENGTH, 0, PUBLIC_KEY_LENGTH);
            MemUtils.copyBytes(_signaturesBatch, signature, i * SIGNATURE_LENGTH, 0, SIGNATURE_LENGTH);

            DEPOSIT_CONTRACT.deposit{value: DEPOSIT_SIZE}(
                publicKey, _withdrawalCredentials, signature, _computeDepositDataRoot(_withdrawalCredentials, publicKey, signature)
            );

            unchecked {
                ++i;
            }
        }
    }

    /// @dev computes the deposit_root_hash required by official Beacon Deposit contract
    /// @param _publicKey A BLS12-381 public key.
    /// @param _signature A BLS12-381 signature
    function _computeDepositDataRoot(bytes memory _withdrawalCredentials, bytes memory _publicKey, bytes memory _signature)
        private
        pure
        returns (bytes32)
    {
        // Compute deposit data root (`DepositData` hash tree root) according to deposit_contract.sol
        bytes memory sigPart1 = MemUtils.unsafeAllocateBytes(64);
        bytes memory sigPart2 = MemUtils.unsafeAllocateBytes(SIGNATURE_LENGTH - 64);
        MemUtils.copyBytes(_signature, sigPart1, 0, 0, 64);
        MemUtils.copyBytes(_signature, sigPart2, 64, 0, SIGNATURE_LENGTH - 64);

        bytes32 publicKeyRoot = sha256(abi.encodePacked(_publicKey, bytes16(0)));
        bytes32 signatureRoot = sha256(abi.encodePacked(sha256(abi.encodePacked(sigPart1)), sha256(abi.encodePacked(sigPart2, bytes32(0)))));

        return sha256(
                abi.encodePacked(
                    sha256(abi.encodePacked(publicKeyRoot, _withdrawalCredentials)),
                    sha256(abi.encodePacked(DEPOSIT_SIZE_IN_GWEI_LE64, bytes24(0), signatureRoot))
                )
            );
    }

    error DepositContractZeroAddress();
    error InvalidPublicKeysBatchLength(uint256 actual, uint256 expected);
    error InvalidSignaturesBatchLength(uint256 actual, uint256 expected);
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

contract StakingRouter is AccessControlEnumerable, BeaconChainDepositor, Versioned {
    using UnstructuredStorage for bytes32;

    /// @dev Events
    event StakingModuleAdded(uint256 indexed stakingModuleId, address stakingModule, string name, address createdBy);
    event StakingModuleShareLimitSet(uint256 indexed stakingModuleId, uint256 stakeShareLimit, uint256 priorityExitShareThreshold, address setBy);
    event StakingModuleFeesSet(uint256 indexed stakingModuleId, uint256 stakingModuleFee, uint256 treasuryFee, address setBy);
    event StakingModuleStatusSet(uint256 indexed stakingModuleId, StakingModuleStatus status, address setBy);
    event StakingModuleExitedValidatorsIncompleteReporting(uint256 indexed stakingModuleId, uint256 unreportedExitedValidatorsCount);
    event StakingModuleMaxDepositsPerBlockSet(
        uint256 indexed stakingModuleId, uint256 maxDepositsPerBlock, address setBy
    );
    event StakingModuleMinDepositBlockDistanceSet(
        uint256 indexed stakingModuleId, uint256 minDepositBlockDistance, address setBy
    );
    event WithdrawalCredentialsSet(bytes32 withdrawalCredentials, address setBy);
    event WithdrawalsCredentialsChangeFailed(uint256 indexed stakingModuleId, bytes lowLevelRevertData);
    event ExitedAndStuckValidatorsCountsUpdateFailed(uint256 indexed stakingModuleId, bytes lowLevelRevertData);
    event RewardsMintedReportFailed(uint256 indexed stakingModuleId, bytes lowLevelRevertData);

    /// Emitted when the StakingRouter received ETH
    event StakingRouterETHDeposited(uint256 indexed stakingModuleId, uint256 amount);

    /// @dev Errors
    error ZeroAddressLido();
    error ZeroAddressAdmin();
    error ZeroAddressStakingModule();
    error InvalidStakeShareLimit();
    error InvalidFeeSum();
    error StakingModuleNotActive();
    error EmptyWithdrawalsCredentials();
    error DirectETHTransfer();
    error InvalidReportData(uint256 code);
    error ExitedValidatorsCountCannotDecrease();
    error ReportedExitedValidatorsExceedDeposited(
        uint256 reportedExitedValidatorsCount,
        uint256 depositedValidatorsCount
    );
    error StakingModulesLimitExceeded();
    error StakingModuleUnregistered();
    error AppAuthLidoFailed();
    error StakingModuleStatusTheSame();
    error StakingModuleWrongName();
    error UnexpectedCurrentValidatorsCount(
        uint256 currentModuleExitedValidatorsCount,
        uint256 currentNodeOpExitedValidatorsCount,
        uint256 currentNodeOpStuckValidatorsCount
    );
    error UnexpectedFinalExitedValidatorsCount (
        uint256 newModuleTotalExitedValidatorsCount,
        uint256 newModuleTotalExitedValidatorsCountInStakingRouter
    );
    error InvalidDepositsValue(uint256 etherValue, uint256 depositsCount);
    error StakingModuleAddressExists();
    error ArraysLengthMismatch(uint256 firstArrayLength, uint256 secondArrayLength);
    error UnrecoverableModuleError();
    error InvalidPriorityExitShareThreshold();
    error InvalidMinDepositBlockDistance();
    error InvalidMaxDepositPerBlockValue();

    enum StakingModuleStatus {
        Active, // deposits and rewards allowed
        DepositsPaused, // deposits NOT allowed, rewards allowed
        Stopped // deposits and rewards NOT allowed
    }

    struct StakingModule {
        /// @notice Unique id of the staking module.
        uint24 id;
        /// @notice Address of the staking module.
        address stakingModuleAddress;
        /// @notice Part of the fee taken from staking rewards that goes to the staking module.
        uint16 stakingModuleFee;
        /// @notice Part of the fee taken from staking rewards that goes to the treasury.
        uint16 treasuryFee;
        /// @notice Maximum stake share that can be allocated to a module, in BP.
        /// @dev Formerly known as `targetShare`.
        uint16 stakeShareLimit;
        /// @notice Staking module status if staking module can not accept the deposits or can
        /// participate in further reward distribution.
        uint8 status;
        /// @notice Name of the staking module.
        string name;
        /// @notice block.timestamp of the last deposit of the staking module.
        /// @dev NB: lastDepositAt gets updated even if the deposit value was 0 and no actual deposit happened.
        uint64 lastDepositAt;
        /// @notice block.number of the last deposit of the staking module.
        /// @dev NB: lastDepositBlock gets updated even if the deposit value was 0 and no actual deposit happened.
        uint256 lastDepositBlock;
        /// @notice Number of exited validators.
        uint256 exitedValidatorsCount;
        /// @notice Module's share threshold, upon crossing which, exits of validators from the module will be prioritized, in BP.
        uint16 priorityExitShareThreshold;
        /// @notice The maximum number of validators that can be deposited in a single block.
        /// @dev Must be harmonized with `OracleReportSanityChecker.appearedValidatorsPerDayLimit`.
        /// See docs for the `OracleReportSanityChecker.setAppearedValidatorsPerDayLimit` function.
        uint64 maxDepositsPerBlock;
        /// @notice The minimum distance between deposits in blocks.
        /// @dev Must be harmonized with `OracleReportSanityChecker.appearedValidatorsPerDayLimit`.
        /// See docs for the `OracleReportSanityChecker.setAppearedValidatorsPerDayLimit` function).
        uint64 minDepositBlockDistance;
    }

    struct StakingModuleCache {
        address stakingModuleAddress;
        uint24 stakingModuleId;
        uint16 stakingModuleFee;
        uint16 treasuryFee;
        uint16 stakeShareLimit;
        StakingModuleStatus status;
        uint256 activeValidatorsCount;
        uint256 availableValidatorsCount;
    }

    bytes32 public constant MANAGE_WITHDRAWAL_CREDENTIALS_ROLE = keccak256("MANAGE_WITHDRAWAL_CREDENTIALS_ROLE");
    bytes32 public constant STAKING_MODULE_MANAGE_ROLE = keccak256("STAKING_MODULE_MANAGE_ROLE");
    bytes32 public constant STAKING_MODULE_UNVETTING_ROLE = keccak256("STAKING_MODULE_UNVETTING_ROLE");
    bytes32 public constant REPORT_EXITED_VALIDATORS_ROLE = keccak256("REPORT_EXITED_VALIDATORS_ROLE");
    bytes32 public constant UNSAFE_SET_EXITED_VALIDATORS_ROLE = keccak256("UNSAFE_SET_EXITED_VALIDATORS_ROLE");
    bytes32 public constant REPORT_REWARDS_MINTED_ROLE = keccak256("REPORT_REWARDS_MINTED_ROLE");

    bytes32 internal constant LIDO_POSITION = keccak256("lido.StakingRouter.lido");

    /// @dev Credentials to withdraw ETH on Consensus Layer side.
    bytes32 internal constant WITHDRAWAL_CREDENTIALS_POSITION = keccak256("lido.StakingRouter.withdrawalCredentials");

    /// @dev Total count of staking modules.
    bytes32 internal constant STAKING_MODULES_COUNT_POSITION = keccak256("lido.StakingRouter.stakingModulesCount");
    /// @dev Id of the last added staking module. This counter grow on staking modules adding.
    bytes32 internal constant LAST_STAKING_MODULE_ID_POSITION = keccak256("lido.StakingRouter.lastStakingModuleId");
    /// @dev Mapping is used instead of array to allow to extend the StakingModule.
    bytes32 internal constant STAKING_MODULES_MAPPING_POSITION = keccak256("lido.StakingRouter.stakingModules");
    /// @dev Position of the staking modules in the `_stakingModules` map, plus 1 because
    /// index 0 means a value is not in the set.
    bytes32 internal constant STAKING_MODULE_INDICES_MAPPING_POSITION = keccak256("lido.StakingRouter.stakingModuleIndicesOneBased");

    uint256 public constant FEE_PRECISION_POINTS = 10 ** 20; // 100 * 10 ** 18
    uint256 public constant TOTAL_BASIS_POINTS = 10000;
    uint256 public constant MAX_STAKING_MODULES_COUNT = 32;
    /// @dev Restrict the name size with 31 bytes to storage in a single slot.
    uint256 public constant MAX_STAKING_MODULE_NAME_LENGTH = 31;

    constructor(address _depositContract) BeaconChainDepositor(_depositContract) {}

    /// @notice Initializes the contract.
    /// @param _admin Lido DAO Aragon agent contract address.
    /// @param _lido Lido address.
    /// @param _withdrawalCredentials Credentials to withdraw ETH on Consensus Layer side.
    /// @dev Proxy initialization method.
    function initialize(address _admin, address _lido, bytes32 _withdrawalCredentials) external {
        if (_admin == address(0)) revert ZeroAddressAdmin();
        if (_lido == address(0)) revert ZeroAddressLido();

        _initializeContractVersionTo(2);

        _setupRole(DEFAULT_ADMIN_ROLE, _admin);

        LIDO_POSITION.setStorageAddress(_lido);
        WITHDRAWAL_CREDENTIALS_POSITION.setStorageBytes32(_withdrawalCredentials);
        emit WithdrawalCredentialsSet(_withdrawalCredentials, msg.sender);
    }

    /// @dev Prohibit direct transfer to contract.
    receive() external payable {
        revert DirectETHTransfer();
    }

    /// @notice Finalizes upgrade to v2 (from v1). Can be called only once.
    /// @param _priorityExitShareThresholds Array of priority exit share thresholds.
    /// @param _maxDepositsPerBlock Array of max deposits per block.
    /// @param _minDepositBlockDistances Array of min deposit block distances.
    /// @dev https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-10.md
    function finalizeUpgrade_v2(
        uint256[] memory _priorityExitShareThresholds,
        uint256[] memory _maxDepositsPerBlock,
        uint256[] memory _minDepositBlockDistances
    ) external {
        _checkContractVersion(1);

        uint256 stakingModulesCount = getStakingModulesCount();

        _validateEqualArrayLengths(stakingModulesCount, _priorityExitShareThresholds.length);
        _validateEqualArrayLengths(stakingModulesCount, _maxDepositsPerBlock.length);
        _validateEqualArrayLengths(stakingModulesCount, _minDepositBlockDistances.length);

        for (uint256 i; i < stakingModulesCount; ) {
            StakingModule storage stakingModule = _getStakingModuleByIndex(i);
            _updateStakingModule(
                stakingModule,
                stakingModule.id,
                stakingModule.stakeShareLimit,
                _priorityExitShareThresholds[i],
                stakingModule.stakingModuleFee,
                stakingModule.treasuryFee,
                _maxDepositsPerBlock[i],
                _minDepositBlockDistances[i]
            );

            unchecked {
                ++i;
            }
        }

        _updateContractVersion(2);
    }

    /// @notice Returns Lido contract address.
    /// @return Lido contract address.
    function getLido() public view returns (address) {
        return LIDO_POSITION.getStorageAddress();
    }

    /// @notice Registers a new staking module.
    /// @param _name Name of staking module.
    /// @param _stakingModuleAddress Address of staking module.
    /// @param _stakeShareLimit Maximum share that can be allocated to a module.
    /// @param _priorityExitShareThreshold Module's priority exit share threshold.
    /// @param _stakingModuleFee Fee of the staking module taken from the staking rewards.
    /// @param _treasuryFee Treasury fee.
    /// @param _maxDepositsPerBlock The maximum number of validators that can be deposited in a single block.
    /// @param _minDepositBlockDistance The minimum distance between deposits in blocks.
    /// @dev The function is restricted to the `STAKING_MODULE_MANAGE_ROLE` role.
    function addStakingModule(
        string calldata _name,
        address _stakingModuleAddress,
        uint256 _stakeShareLimit,
        uint256 _priorityExitShareThreshold,
        uint256 _stakingModuleFee,
        uint256 _treasuryFee,
        uint256 _maxDepositsPerBlock,
        uint256 _minDepositBlockDistance
    ) external onlyRole(STAKING_MODULE_MANAGE_ROLE) {
        if (_stakingModuleAddress == address(0)) revert ZeroAddressStakingModule();
        if (bytes(_name).length == 0 || bytes(_name).length > MAX_STAKING_MODULE_NAME_LENGTH) revert StakingModuleWrongName();

        uint256 newStakingModuleIndex = getStakingModulesCount();

        if (newStakingModuleIndex >= MAX_STAKING_MODULES_COUNT)
            revert StakingModulesLimitExceeded();

        for (uint256 i; i < newStakingModuleIndex; ) {
            if (_stakingModuleAddress == _getStakingModuleByIndex(i).stakingModuleAddress)
                revert StakingModuleAddressExists();

            unchecked {
                ++i;
            }
        }

        StakingModule storage newStakingModule = _getStakingModuleByIndex(newStakingModuleIndex);
        uint24 newStakingModuleId = uint24(LAST_STAKING_MODULE_ID_POSITION.getStorageUint256()) + 1;

        newStakingModule.id = newStakingModuleId;
        newStakingModule.name = _name;
        newStakingModule.stakingModuleAddress = _stakingModuleAddress;
        /// @dev Since `enum` is `uint8` by nature, so the `status` is stored as `uint8` to avoid
        ///      possible problems when upgrading. But for human readability, we use `enum` as
        ///      function parameter type. More about conversion in the docs:
        ///      https://docs.soliditylang.org/en/v0.8.17/types.html#enums
        newStakingModule.status = uint8(StakingModuleStatus.Active);

        /// @dev Simulate zero value deposit to prevent real deposits into the new StakingModule via
        ///      DepositSecurityModule just after the addition.
        _updateModuleLastDepositState(newStakingModule, newStakingModuleId, 0);

        _setStakingModuleIndexById(newStakingModuleId, newStakingModuleIndex);
        LAST_STAKING_MODULE_ID_POSITION.setStorageUint256(newStakingModuleId);
        STAKING_MODULES_COUNT_POSITION.setStorageUint256(newStakingModuleIndex + 1);

        emit StakingModuleAdded(newStakingModuleId, _stakingModuleAddress, _name, msg.sender);
        _updateStakingModule(
            newStakingModule,
            newStakingModuleId,
            _stakeShareLimit,
            _priorityExitShareThreshold,
            _stakingModuleFee,
            _treasuryFee,
            _maxDepositsPerBlock,
            _minDepositBlockDistance
        );
    }

    /// @notice Updates staking module params.
    /// @param _stakingModuleId Staking module id.
    /// @param _stakeShareLimit Target total stake share.
    /// @param _priorityExitShareThreshold Module's priority exit share threshold.
    /// @param _stakingModuleFee Fee of the staking module taken from the staking rewards.
    /// @param _treasuryFee Treasury fee.
    /// @param _maxDepositsPerBlock The maximum number of validators that can be deposited in a single block.
    /// @param _minDepositBlockDistance The minimum distance between deposits in blocks.
    /// @dev The function is restricted to the `STAKING_MODULE_MANAGE_ROLE` role.
    function updateStakingModule(
        uint256 _stakingModuleId,
        uint256 _stakeShareLimit,
        uint256 _priorityExitShareThreshold,
        uint256 _stakingModuleFee,
        uint256 _treasuryFee,
        uint256 _maxDepositsPerBlock,
        uint256 _minDepositBlockDistance
    ) external onlyRole(STAKING_MODULE_MANAGE_ROLE) {
        StakingModule storage stakingModule = _getStakingModuleById(_stakingModuleId);
        _updateStakingModule(
            stakingModule,
            _stakingModuleId,
            _stakeShareLimit,
            _priorityExitShareThreshold,
            _stakingModuleFee,
            _treasuryFee,
            _maxDepositsPerBlock,
            _minDepositBlockDistance
        );
    }

    function _updateStakingModule(
        StakingModule storage stakingModule,
        uint256 _stakingModuleId,
        uint256 _stakeShareLimit,
        uint256 _priorityExitShareThreshold,
        uint256 _stakingModuleFee,
        uint256 _treasuryFee,
        uint256 _maxDepositsPerBlock,
        uint256 _minDepositBlockDistance
    ) internal {
        if (_stakeShareLimit > TOTAL_BASIS_POINTS) revert InvalidStakeShareLimit();
        if (_priorityExitShareThreshold > TOTAL_BASIS_POINTS) revert InvalidPriorityExitShareThreshold();
        if (_stakeShareLimit > _priorityExitShareThreshold) revert InvalidPriorityExitShareThreshold();
        if (_stakingModuleFee + _treasuryFee > TOTAL_BASIS_POINTS) revert InvalidFeeSum();
        if (_minDepositBlockDistance == 0 || _minDepositBlockDistance > type(uint64).max) revert InvalidMinDepositBlockDistance();
        if (_maxDepositsPerBlock > type(uint64).max) revert InvalidMaxDepositPerBlockValue();

        stakingModule.stakeShareLimit = uint16(_stakeShareLimit);
        stakingModule.priorityExitShareThreshold = uint16(_priorityExitShareThreshold);
        stakingModule.treasuryFee = uint16(_treasuryFee);
        stakingModule.stakingModuleFee = uint16(_stakingModuleFee);
        stakingModule.maxDepositsPerBlock = uint64(_maxDepositsPerBlock);
        stakingModule.minDepositBlockDistance = uint64(_minDepositBlockDistance);

        emit StakingModuleShareLimitSet(_stakingModuleId, _stakeShareLimit, _priorityExitShareThreshold, msg.sender);
        emit StakingModuleFeesSet(_stakingModuleId, _stakingModuleFee, _treasuryFee, msg.sender);
        emit StakingModuleMaxDepositsPerBlockSet(_stakingModuleId, _maxDepositsPerBlock, msg.sender);
        emit StakingModuleMinDepositBlockDistanceSet(_stakingModuleId, _minDepositBlockDistance, msg.sender);
    }

    /// @notice Updates the limit of the validators that can be used for deposit.
    /// @param _stakingModuleId Id of the staking module.
    /// @param _nodeOperatorId Id of the node operator.
    /// @param _targetLimitMode Target limit mode.
    /// @param _targetLimit Target limit of the node operator.
    /// @dev The function is restricted to the `STAKING_MODULE_MANAGE_ROLE` role.
    function updateTargetValidatorsLimits(
        uint256 _stakingModuleId,
        uint256 _nodeOperatorId,
        uint256 _targetLimitMode,
        uint256 _targetLimit
    ) external onlyRole(STAKING_MODULE_MANAGE_ROLE) {
        _getIStakingModuleById(_stakingModuleId).updateTargetValidatorsLimits(
            _nodeOperatorId, _targetLimitMode, _targetLimit
        );
    }

    /// @notice Updates the number of the refunded validators in the staking module with the given
    /// node operator id.
    /// @param _stakingModuleId Id of the staking module.
    /// @param _nodeOperatorId Id of the node operator.
    /// @param _refundedValidatorsCount New number of refunded validators of the node operator.
    /// @dev The function is restricted to the `STAKING_MODULE_MANAGE_ROLE` role.
    function updateRefundedValidatorsCount(
        uint256 _stakingModuleId,
        uint256 _nodeOperatorId,
        uint256 _refundedValidatorsCount
    ) external onlyRole(STAKING_MODULE_MANAGE_ROLE) {
        _getIStakingModuleById(_stakingModuleId).updateRefundedValidatorsCount(
            _nodeOperatorId, _refundedValidatorsCount
        );
    }

    /// @notice Reports the minted rewards to the staking modules with the specified ids.
    /// @param _stakingModuleIds Ids of the staking modules.
    /// @param _totalShares Total shares minted for the staking modules.
    /// @dev The function is restricted to the `REPORT_REWARDS_MINTED_ROLE` role.
    function reportRewardsMinted(uint256[] calldata _stakingModuleIds, uint256[] calldata _totalShares)
        external
        onlyRole(REPORT_REWARDS_MINTED_ROLE)
    {
        _validateEqualArrayLengths(_stakingModuleIds.length, _totalShares.length);

        for (uint256 i = 0; i < _stakingModuleIds.length; ) {
            if (_totalShares[i] > 0) {
                try _getIStakingModuleById(_stakingModuleIds[i]).onRewardsMinted(_totalShares[i]) {}
                catch (bytes memory lowLevelRevertData) {
                    /// @dev This check is required to prevent incorrect gas estimation of the method.
                    ///      Without it, Ethereum nodes that use binary search for gas estimation may
                    ///      return an invalid value when the onRewardsMinted() reverts because of the
                    ///      "out of gas" error. Here we assume that the onRewardsMinted() method doesn't
                    ///      have reverts with empty error data except "out of gas".
                    if (lowLevelRevertData.length == 0) revert UnrecoverableModuleError();
                    emit RewardsMintedReportFailed(
                        _stakingModuleIds[i],
                        lowLevelRevertData
                    );
                }
            }

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Updates total numbers of exited validators for staking modules with the specified module ids.
    /// @param _stakingModuleIds Ids of the staking modules to be updated.
    /// @param _exitedValidatorsCounts New counts of exited validators for the specified staking modules.
    /// @return The total increase in the aggregate number of exited validators across all updated modules.
    ///
    /// @dev The total numbers are stored in the staking router and can differ from the totals obtained by calling
    /// `IStakingModule.getStakingModuleSummary()`. The overall process of updating validator counts is the following:
    ///
    /// 1. In the first data submission phase, the oracle calls `updateExitedValidatorsCountByStakingModule` on the
    ///    staking router, passing the totals by module. The staking router stores these totals and uses them to
    ///    distribute new stake and staking fees between the modules. There can only be single call of this function
    ///    per oracle reporting frame.
    ///
    /// 2. In the first part of the second data submission phase, the oracle calls
    ///    `StakingRouter.reportStakingModuleStuckValidatorsCountByNodeOperator` on the staking router which passes the
    ///    counts by node operator to the staking module by calling `IStakingModule.updateStuckValidatorsCount`.
    ///    This can be done multiple times for the same module, passing data for different subsets of node operators.
    ///
    /// 3. In the second part of the second data submission phase, the oracle calls
    ///    `StakingRouter.reportStakingModuleExitedValidatorsCountByNodeOperator` on the staking router which passes
    ///    the counts by node operator to the staking module by calling `IStakingModule.updateExitedValidatorsCount`.
    ///    This can be done multiple times for the same module, passing data for different subsets of node
    ///    operators.
    ///
    /// 4. At the end of the second data submission phase, it's expected for the aggregate exited validators count
    ///    across all module's node operators (stored in the module) to match the total count for this module
    ///    (stored in the staking router). However, it might happen that the second phase of data submission doesn't
    ///    finish until the new oracle reporting frame is started, in which case staking router will emit a warning
    ///    event `StakingModuleExitedValidatorsIncompleteReporting` when the first data submission phase is performed
    ///    for a new reporting frame. This condition will result in the staking module having an incomplete data about
    ///    the exited and maybe stuck validator counts during the whole reporting frame. Handling this condition is
    ///    the responsibility of each staking module.
    ///
    /// 5. When the second reporting phase is finished, i.e. when the oracle submitted the complete data on the stuck
    ///    and exited validator counts per node operator for the current reporting frame, the oracle calls
    ///    `StakingRouter.onValidatorsCountsByNodeOperatorReportingFinished` which, in turn, calls
    ///    `IStakingModule.onExitedAndStuckValidatorsCountsUpdated` on all modules.
    ///
    /// @dev The function is restricted to the `REPORT_EXITED_VALIDATORS_ROLE` role.
    function updateExitedValidatorsCountByStakingModule(
        uint256[] calldata _stakingModuleIds,
        uint256[] calldata _exitedValidatorsCounts
    )
        external
        onlyRole(REPORT_EXITED_VALIDATORS_ROLE)
        returns (uint256)
    {
        _validateEqualArrayLengths(_stakingModuleIds.length, _exitedValidatorsCounts.length);

        uint256 newlyExitedValidatorsCount;

        for (uint256 i = 0; i < _stakingModuleIds.length; ) {
            uint256 stakingModuleId = _stakingModuleIds[i];
            StakingModule storage stakingModule = _getStakingModuleById(stakingModuleId);

            uint256 prevReportedExitedValidatorsCount = stakingModule.exitedValidatorsCount;
            if (_exitedValidatorsCounts[i] < prevReportedExitedValidatorsCount) {
                revert ExitedValidatorsCountCannotDecrease();
            }

            (
                uint256 totalExitedValidators,
                uint256 totalDepositedValidators,
                /* uint256 depositableValidatorsCount */
            ) = _getStakingModuleSummary(IStakingModule(stakingModule.stakingModuleAddress));

            if (_exitedValidatorsCounts[i] > totalDepositedValidators) {
                revert ReportedExitedValidatorsExceedDeposited(
                    _exitedValidatorsCounts[i],
                    totalDepositedValidators
                );
            }

            newlyExitedValidatorsCount += _exitedValidatorsCounts[i] - prevReportedExitedValidatorsCount;

            if (totalExitedValidators < prevReportedExitedValidatorsCount) {
                // not all of the exited validators were async reported to the module
                emit StakingModuleExitedValidatorsIncompleteReporting(
                    stakingModuleId,
                    prevReportedExitedValidatorsCount - totalExitedValidators
                );
            }

            stakingModule.exitedValidatorsCount = _exitedValidatorsCounts[i];

            unchecked {
                ++i;
            }
        }

        return newlyExitedValidatorsCount;
    }

    /// @notice Updates exited validators counts per node operator for the staking module with
    /// the specified id. See the docs for `updateExitedValidatorsCountByStakingModule` for the
    /// description of the overall update process.
    ///
    /// @param _stakingModuleId The id of the staking modules to be updated.
    /// @param _nodeOperatorIds Ids of the node operators to be updated.
    /// @param _exitedValidatorsCounts New counts of exited validators for the specified node operators.
    ///
    /// @dev The function is restricted to the `REPORT_EXITED_VALIDATORS_ROLE` role.
    function reportStakingModuleExitedValidatorsCountByNodeOperator(
        uint256 _stakingModuleId,
        bytes calldata _nodeOperatorIds,
        bytes calldata _exitedValidatorsCounts
    )
        external
        onlyRole(REPORT_EXITED_VALIDATORS_ROLE)
    {
        _checkValidatorsByNodeOperatorReportData(_nodeOperatorIds, _exitedValidatorsCounts);
        _getIStakingModuleById(_stakingModuleId).updateExitedValidatorsCount(_nodeOperatorIds, _exitedValidatorsCounts);
    }

    struct ValidatorsCountsCorrection {
        /// @notice The expected current number of exited validators of the module that is
        /// being corrected.
        uint256 currentModuleExitedValidatorsCount;
        /// @notice The expected current number of exited validators of the node operator
        /// that is being corrected.
        uint256 currentNodeOperatorExitedValidatorsCount;
        /// @notice The expected current number of stuck validators of the node operator
        /// that is being corrected.
        uint256 currentNodeOperatorStuckValidatorsCount;
        /// @notice The corrected number of exited validators of the module.
        uint256 newModuleExitedValidatorsCount;
        /// @notice The corrected number of exited validators of the node operator.
        uint256 newNodeOperatorExitedValidatorsCount;
        /// @notice The corrected number of stuck validators of the node operator.
        uint256 newNodeOperatorStuckValidatorsCount;
    }

    /// @notice Sets exited validators count for the given module and given node operator in that module
    /// without performing critical safety checks, e.g. that exited validators count cannot decrease.
    ///
    /// Should only be used by the DAO in extreme cases and with sufficient precautions to correct invalid
    /// data reported by the oracle committee due to a bug in the oracle daemon.
    ///
    /// @param _stakingModuleId Id of the staking module.
    /// @param _nodeOperatorId Id of the node operator.
    /// @param _triggerUpdateFinish Whether to call `onExitedAndStuckValidatorsCountsUpdated` on the module
    /// after applying the corrections.
    /// @param _correction See the docs for the `ValidatorsCountsCorrection` struct.
    ///
    /// @dev Reverts if the current numbers of exited and stuck validators of the module and node operator
    /// don't match the supplied expected current values.
    ///
    /// @dev The function is restricted to the `UNSAFE_SET_EXITED_VALIDATORS_ROLE` role.
    function unsafeSetExitedValidatorsCount(
        uint256 _stakingModuleId,
        uint256 _nodeOperatorId,
        bool _triggerUpdateFinish,
        ValidatorsCountsCorrection memory _correction
    )
        external
        onlyRole(UNSAFE_SET_EXITED_VALIDATORS_ROLE)
    {
        StakingModule storage stakingModuleState = _getStakingModuleById(_stakingModuleId);
        IStakingModule stakingModule = IStakingModule(stakingModuleState.stakingModuleAddress);

        (
            /* uint256 targetLimitMode */,
            /* uint256 targetValidatorsCount */,
            uint256 stuckValidatorsCount,
            /* uint256 refundedValidatorsCount */,
            /* uint256 stuckPenaltyEndTimestamp */,
            uint256 totalExitedValidators,
            /* uint256 totalDepositedValidators */,
            /* uint256 depositableValidatorsCount */
        ) = stakingModule.getNodeOperatorSummary(_nodeOperatorId);

        if (_correction.currentModuleExitedValidatorsCount != stakingModuleState.exitedValidatorsCount ||
            _correction.currentNodeOperatorExitedValidatorsCount != totalExitedValidators ||
            _correction.currentNodeOperatorStuckValidatorsCount != stuckValidatorsCount
        ) {
            revert UnexpectedCurrentValidatorsCount(
                stakingModuleState.exitedValidatorsCount,
                totalExitedValidators,
                stuckValidatorsCount
            );
        }

        stakingModuleState.exitedValidatorsCount = _correction.newModuleExitedValidatorsCount;

        stakingModule.unsafeUpdateValidatorsCount(
            _nodeOperatorId,
            _correction.newNodeOperatorExitedValidatorsCount,
            _correction.newNodeOperatorStuckValidatorsCount
        );

        (
            uint256 moduleTotalExitedValidators,
            uint256 moduleTotalDepositedValidators,
        ) = _getStakingModuleSummary(stakingModule);

        if (_correction.newModuleExitedValidatorsCount > moduleTotalDepositedValidators) {
            revert ReportedExitedValidatorsExceedDeposited(
                _correction.newModuleExitedValidatorsCount,
                moduleTotalDepositedValidators
            );
        }

        if (_triggerUpdateFinish) {
            if (moduleTotalExitedValidators != _correction.newModuleExitedValidatorsCount) {
                revert UnexpectedFinalExitedValidatorsCount(
                    moduleTotalExitedValidators,
                    _correction.newModuleExitedValidatorsCount
                );
            }

            stakingModule.onExitedAndStuckValidatorsCountsUpdated();
        }
    }

    /// @notice Updates stuck validators counts per node operator for the staking module with
    /// the specified id. See the docs for `updateExitedValidatorsCountByStakingModule` for the
    /// description of the overall update process.
    ///
    /// @param _stakingModuleId The id of the staking modules to be updated.
    /// @param _nodeOperatorIds Ids of the node operators to be updated.
    /// @param _stuckValidatorsCounts New counts of stuck validators for the specified node operators.
    ///
    /// @dev The function is restricted to the `REPORT_EXITED_VALIDATORS_ROLE` role.
    function reportStakingModuleStuckValidatorsCountByNodeOperator(
        uint256 _stakingModuleId,
        bytes calldata _nodeOperatorIds,
        bytes calldata _stuckValidatorsCounts
    )
        external
        onlyRole(REPORT_EXITED_VALIDATORS_ROLE)
    {
        _checkValidatorsByNodeOperatorReportData(_nodeOperatorIds, _stuckValidatorsCounts);
        _getIStakingModuleById(_stakingModuleId).updateStuckValidatorsCount(_nodeOperatorIds, _stuckValidatorsCounts);
    }

    /// @notice Finalizes the reporting of the exited and stuck validators counts for the current
    /// reporting frame.
    ///
    /// @dev Called by the oracle when the second phase of data reporting finishes, i.e. when the
    /// oracle submitted the complete data on the stuck and exited validator counts per node operator
    /// for the current reporting frame. See the docs for `updateExitedValidatorsCountByStakingModule`
    /// for the description of the overall update process.
    ///
    /// @dev The function is restricted to the `REPORT_EXITED_VALIDATORS_ROLE` role.
    function onValidatorsCountsByNodeOperatorReportingFinished()
        external
        onlyRole(REPORT_EXITED_VALIDATORS_ROLE)
    {
        uint256 stakingModulesCount = getStakingModulesCount();
        StakingModule storage stakingModule;
        IStakingModule moduleContract;

        for (uint256 i; i < stakingModulesCount; ) {
            stakingModule = _getStakingModuleByIndex(i);
            moduleContract = IStakingModule(stakingModule.stakingModuleAddress);

            (uint256 exitedValidatorsCount, , ) = _getStakingModuleSummary(moduleContract);
            if (exitedValidatorsCount == stakingModule.exitedValidatorsCount) {
                // oracle finished updating exited validators for all node ops
                try moduleContract.onExitedAndStuckValidatorsCountsUpdated() {}
                catch (bytes memory lowLevelRevertData) {
                    /// @dev This check is required to prevent incorrect gas estimation of the method.
                    ///      Without it, Ethereum nodes that use binary search for gas estimation may
                    ///      return an invalid value when the onExitedAndStuckValidatorsCountsUpdated()
                    ///      reverts because of the "out of gas" error. Here we assume that the
                    ///      onExitedAndStuckValidatorsCountsUpdated() method doesn't have reverts with
                    ///      empty error data except "out of gas".
                    if (lowLevelRevertData.length == 0) revert UnrecoverableModuleError();
                    emit ExitedAndStuckValidatorsCountsUpdateFailed(
                        stakingModule.id,
                        lowLevelRevertData
                    );
                }
            }

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Decreases vetted signing keys counts per node operator for the staking module with
    /// the specified id.
    /// @param _stakingModuleId The id of the staking module to be updated.
    /// @param _nodeOperatorIds Ids of the node operators to be updated.
    /// @param _vettedSigningKeysCounts New counts of vetted signing keys for the specified node operators.
    /// @dev The function is restricted to the `STAKING_MODULE_UNVETTING_ROLE` role.
    function decreaseStakingModuleVettedKeysCountByNodeOperator(
        uint256 _stakingModuleId,
        bytes calldata _nodeOperatorIds,
        bytes calldata _vettedSigningKeysCounts
    ) external onlyRole(STAKING_MODULE_UNVETTING_ROLE) {
        _checkValidatorsByNodeOperatorReportData(_nodeOperatorIds, _vettedSigningKeysCounts);
        _getIStakingModuleById(_stakingModuleId).decreaseVettedSigningKeysCount(_nodeOperatorIds, _vettedSigningKeysCounts);
    }

    /// @notice Returns all registered staking modules.
    /// @return res Array of staking modules.
    function getStakingModules() external view returns (StakingModule[] memory res) {
        uint256 stakingModulesCount = getStakingModulesCount();
        res = new StakingModule[](stakingModulesCount);
        for (uint256 i; i < stakingModulesCount; ) {
            res[i] = _getStakingModuleByIndex(i);

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Returns the ids of all registered staking modules.
    /// @return stakingModuleIds Array of staking module ids.
    function getStakingModuleIds() public view returns (uint256[] memory stakingModuleIds) {
        uint256 stakingModulesCount = getStakingModulesCount();
        stakingModuleIds = new uint256[](stakingModulesCount);
        for (uint256 i; i < stakingModulesCount; ) {
            stakingModuleIds[i] = _getStakingModuleByIndex(i).id;

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Returns the staking module by its id.
    /// @param _stakingModuleId Id of the staking module.
    /// @return Staking module data.
    function getStakingModule(uint256 _stakingModuleId)
        public
        view
        returns (StakingModule memory)
    {
        return _getStakingModuleById(_stakingModuleId);
    }

    /// @notice Returns total number of staking modules.
    /// @return Total number of staking modules.
    function getStakingModulesCount() public view returns (uint256) {
        return STAKING_MODULES_COUNT_POSITION.getStorageUint256();
    }

    /// @notice Returns true if staking module with the given id was registered via `addStakingModule`, false otherwise.
    /// @param _stakingModuleId Id of the staking module.
    /// @return True if staking module with the given id was registered, false otherwise.
    function hasStakingModule(uint256 _stakingModuleId) external view returns (bool) {
        return _getStorageStakingIndicesMapping()[_stakingModuleId] != 0;
    }

    /// @notice Returns status of staking module.
    /// @param _stakingModuleId Id of the staking module.
    /// @return Status of the staking module.
    function getStakingModuleStatus(uint256 _stakingModuleId)
        public
        view
        returns (StakingModuleStatus)
    {
        return StakingModuleStatus(_getStakingModuleById(_stakingModuleId).status);
    }

    /// @notice A summary of the staking module's validators.
    struct StakingModuleSummary {
        /// @notice The total number of validators in the EXITED state on the Consensus Layer.
        /// @dev This value can't decrease in normal conditions.
        uint256 totalExitedValidators;

        /// @notice The total number of validators deposited via the official Deposit Contract.
        /// @dev This value is a cumulative counter: even when the validator goes into EXITED state this
        /// counter is not decreasing.
        uint256 totalDepositedValidators;

        /// @notice The number of validators in the set available for deposit
        uint256 depositableValidatorsCount;
    }

    /// @notice A summary of node operator and its validators.
    struct NodeOperatorSummary {
        /// @notice Shows whether the current target limit applied to the node operator.
        uint256 targetLimitMode;

        /// @notice Relative target active validators limit for operator.
        uint256 targetValidatorsCount;

        /// @notice The number of validators with an expired request to exit time.
        uint256 stuckValidatorsCount;

        /// @notice The number of validators that can't be withdrawn, but deposit costs were
        /// compensated to the Lido by the node operator.
        uint256 refundedValidatorsCount;

        /// @notice A time when the penalty for stuck validators stops applying to node operator rewards.
        uint256 stuckPenaltyEndTimestamp;

        /// @notice The total number of validators in the EXITED state on the Consensus Layer.
        /// @dev This value can't decrease in normal conditions.
        uint256 totalExitedValidators;

        /// @notice The total number of validators deposited via the official Deposit Contract.
        /// @dev This value is a cumulative counter: even when the validator goes into EXITED state this
        /// counter is not decreasing.
        uint256 totalDepositedValidators;

        /// @notice The number of validators in the set available for deposit.
        uint256 depositableValidatorsCount;
    }

    /// @notice Returns all-validators summary in the staking module.
    /// @param _stakingModuleId Id of the staking module to return summary for.
    /// @return summary Staking module summary.
    function getStakingModuleSummary(uint256 _stakingModuleId)
        public
        view
        returns (StakingModuleSummary memory summary)
    {
        StakingModule memory stakingModuleState = getStakingModule(_stakingModuleId);
        IStakingModule stakingModule = IStakingModule(stakingModuleState.stakingModuleAddress);
        (
            summary.totalExitedValidators,
            summary.totalDepositedValidators,
            summary.depositableValidatorsCount
        ) = _getStakingModuleSummary(stakingModule);
    }


    /// @notice Returns node operator summary from the staking module.
    /// @param _stakingModuleId Id of the staking module where node operator is onboarded.
    /// @param _nodeOperatorId Id of the node operator to return summary for.
    /// @return summary Node operator summary.
    function getNodeOperatorSummary(uint256 _stakingModuleId, uint256 _nodeOperatorId)
        public
        view
        returns (NodeOperatorSummary memory summary)
    {
        StakingModule memory stakingModuleState = getStakingModule(_stakingModuleId);
        IStakingModule stakingModule = IStakingModule(stakingModuleState.stakingModuleAddress);
        /// @dev using intermediate variables below due to "Stack too deep" error in case of
        /// assigning directly into the NodeOperatorSummary struct
        (
            uint256 targetLimitMode,
            uint256 targetValidatorsCount,
            uint256 stuckValidatorsCount,
            uint256 refundedValidatorsCount,
            uint256 stuckPenaltyEndTimestamp,
            uint256 totalExitedValidators,
            uint256 totalDepositedValidators,
            uint256 depositableValidatorsCount
        ) = stakingModule.getNodeOperatorSummary(_nodeOperatorId);
        summary.targetLimitMode = targetLimitMode;
        summary.targetValidatorsCount = targetValidatorsCount;
        summary.stuckValidatorsCount = stuckValidatorsCount;
        summary.refundedValidatorsCount = refundedValidatorsCount;
        summary.stuckPenaltyEndTimestamp = stuckPenaltyEndTimestamp;
        summary.totalExitedValidators = totalExitedValidators;
        summary.totalDepositedValidators = totalDepositedValidators;
        summary.depositableValidatorsCount = depositableValidatorsCount;
    }

    /// @notice A collection of the staking module data stored across the StakingRouter and the
    /// staking module contract.
    ///
    /// @dev This data, first of all, is designed for off-chain usage and might be redundant for
    /// on-chain calls. Give preference for dedicated methods for gas-efficient on-chain calls.
    struct StakingModuleDigest {
        /// @notice The number of node operators registered in the staking module.
        uint256 nodeOperatorsCount;
        /// @notice The number of node operators registered in the staking module in active state.
        uint256 activeNodeOperatorsCount;
        /// @notice The current state of the staking module taken from the StakingRouter.
        StakingModule state;
        /// @notice A summary of the staking module's validators.
        StakingModuleSummary summary;
    }

    /// @notice A collection of the node operator data stored in the staking module.
    /// @dev This data, first of all, is designed for off-chain usage and might be redundant for
    /// on-chain calls. Give preference for dedicated methods for gas-efficient on-chain calls.
    struct NodeOperatorDigest {
        /// @notice Id of the node operator.
        uint256 id;
        /// @notice Shows whether the node operator is active or not.
        bool isActive;
        /// @notice A summary of node operator and its validators.
        NodeOperatorSummary summary;
    }

    /// @notice Returns staking module digest for each staking module registered in the staking router.
    /// @return Array of staking module digests.
    /// @dev WARNING: This method is not supposed to be used for onchain calls due to high gas costs
    /// for data aggregation.
    function getAllStakingModuleDigests() external view returns (StakingModuleDigest[] memory) {
        return getStakingModuleDigests(getStakingModuleIds());
    }

    /// @notice Returns staking module digest for passed staking module ids.
    /// @param _stakingModuleIds Ids of the staking modules to return data for.
    /// @return digests Array of staking module digests.
    /// @dev WARNING: This method is not supposed to be used for onchain calls due to high gas costs
    /// for data aggregation.
    function getStakingModuleDigests(uint256[] memory _stakingModuleIds)
        public
        view
        returns (StakingModuleDigest[] memory digests)
    {
        digests = new StakingModuleDigest[](_stakingModuleIds.length);
        for (uint256 i = 0; i < _stakingModuleIds.length; ) {
            StakingModule memory stakingModuleState = getStakingModule(_stakingModuleIds[i]);
            IStakingModule stakingModule = IStakingModule(stakingModuleState.stakingModuleAddress);
            digests[i] = StakingModuleDigest({
                nodeOperatorsCount: stakingModule.getNodeOperatorsCount(),
                activeNodeOperatorsCount: stakingModule.getActiveNodeOperatorsCount(),
                state: stakingModuleState,
                summary: getStakingModuleSummary(_stakingModuleIds[i])
            });

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Returns node operator digest for each node operator registered in the given staking module.
    /// @param _stakingModuleId Id of the staking module to return data for.
    /// @return Array of node operator digests.
    /// @dev WARNING: This method is not supposed to be used for onchain calls due to high gas costs
    /// for data aggregation.
    function getAllNodeOperatorDigests(uint256 _stakingModuleId) external view returns (NodeOperatorDigest[] memory) {
        return getNodeOperatorDigests(
            _stakingModuleId, 0, _getIStakingModuleById(_stakingModuleId).getNodeOperatorsCount()
        );
    }

    /// @notice Returns node operator digest for passed node operator ids in the given staking module.
    /// @param _stakingModuleId Id of the staking module where node operators registered.
    /// @param _offset Node operators offset starting with 0.
    /// @param _limit The max number of node operators to return.
    /// @return Array of node operator digests.
    /// @dev WARNING: This method is not supposed to be used for onchain calls due to high gas costs
    /// for data aggregation.
    function getNodeOperatorDigests(
        uint256 _stakingModuleId,
        uint256 _offset,
        uint256 _limit
    ) public view returns (NodeOperatorDigest[] memory) {
        return getNodeOperatorDigests(
            _stakingModuleId, _getIStakingModuleById(_stakingModuleId).getNodeOperatorIds(_offset, _limit)
        );
    }

    /// @notice Returns node operator digest for a slice of node operators registered in the given
    /// staking module.
    /// @param _stakingModuleId Id of the staking module where node operators registered.
    /// @param _nodeOperatorIds Ids of the node operators to return data for.
    /// @return digests Array of node operator digests.
    /// @dev WARNING: This method is not supposed to be used for onchain calls due to high gas costs
    /// for data aggregation.
    function getNodeOperatorDigests(uint256 _stakingModuleId, uint256[] memory _nodeOperatorIds)
        public
        view
        returns (NodeOperatorDigest[] memory digests)
    {
        IStakingModule stakingModule = _getIStakingModuleById(_stakingModuleId);
        digests = new NodeOperatorDigest[](_nodeOperatorIds.length);
        for (uint256 i = 0; i < _nodeOperatorIds.length; ) {
            digests[i] = NodeOperatorDigest({
                id: _nodeOperatorIds[i],
                isActive: stakingModule.getNodeOperatorIsActive(_nodeOperatorIds[i]),
                summary: getNodeOperatorSummary(_stakingModuleId, _nodeOperatorIds[i])
            });

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Sets the staking module status flag for participation in further deposits and/or reward distribution.
    /// @param _stakingModuleId Id of the staking module to be updated.
    /// @param _status New status of the staking module.
    /// @dev The function is restricted to the `STAKING_MODULE_MANAGE_ROLE` role.
    function setStakingModuleStatus(
        uint256 _stakingModuleId,
        StakingModuleStatus _status
    ) external onlyRole(STAKING_MODULE_MANAGE_ROLE) {
        StakingModule storage stakingModule = _getStakingModuleById(_stakingModuleId);
        if (StakingModuleStatus(stakingModule.status) == _status) revert StakingModuleStatusTheSame();
        _setStakingModuleStatus(stakingModule, _status);
    }

    /// @notice Returns whether the staking module is stopped.
    /// @param _stakingModuleId Id of the staking module.
    /// @return True if the staking module is stopped, false otherwise.
    function getStakingModuleIsStopped(uint256 _stakingModuleId) external view returns (bool)
    {
        return getStakingModuleStatus(_stakingModuleId) == StakingModuleStatus.Stopped;
    }

    /// @notice Returns whether the deposits are paused for the staking module.
    /// @param _stakingModuleId Id of the staking module.
    /// @return True if the deposits are paused, false otherwise.
    function getStakingModuleIsDepositsPaused(uint256 _stakingModuleId)
        external
        view
        returns (bool)
    {
        return getStakingModuleStatus(_stakingModuleId) == StakingModuleStatus.DepositsPaused;
    }

    /// @notice Returns whether the staking module is active.
    /// @param _stakingModuleId Id of the staking module.
    /// @return True if the staking module is active, false otherwise.
    function getStakingModuleIsActive(uint256 _stakingModuleId) external view returns (bool) {
        return getStakingModuleStatus(_stakingModuleId) == StakingModuleStatus.Active;
    }

    /// @notice Returns staking module nonce.
    /// @param _stakingModuleId Id of the staking module.
    /// @return Staking module nonce.
    function getStakingModuleNonce(uint256 _stakingModuleId) external view returns (uint256) {
        return _getIStakingModuleById(_stakingModuleId).getNonce();
    }

    /// @notice Returns the last deposit block for the staking module.
    /// @param _stakingModuleId Id of the staking module.
    /// @return Last deposit block for the staking module.
    function getStakingModuleLastDepositBlock(uint256 _stakingModuleId)
        external
        view
        returns (uint256)
    {
        return _getStakingModuleById(_stakingModuleId).lastDepositBlock;
    }

    /// @notice Returns the min deposit block distance for the staking module.
    /// @param _stakingModuleId Id of the staking module.
    /// @return Min deposit block distance for the staking module.
    function getStakingModuleMinDepositBlockDistance(uint256 _stakingModuleId) external view returns (uint256) {
        return _getStakingModuleById(_stakingModuleId).minDepositBlockDistance;
    }

    /// @notice Returns the max deposits count per block for the staking module.
    /// @param _stakingModuleId Id of the staking module.
    /// @return Max deposits count per block for the staking module.
    function getStakingModuleMaxDepositsPerBlock(uint256 _stakingModuleId) external view returns (uint256) {
        return _getStakingModuleById(_stakingModuleId).maxDepositsPerBlock;
    }

    /// @notice Returns active validators count for the staking module.
    /// @param _stakingModuleId Id of the staking module.
    /// @return activeValidatorsCount Active validators count for the staking module.
    function getStakingModuleActiveValidatorsCount(uint256 _stakingModuleId)
        external
        view
        returns (uint256 activeValidatorsCount)
    {
        StakingModule storage stakingModule = _getStakingModuleById(_stakingModuleId);
        (
            uint256 totalExitedValidators,
            uint256 totalDepositedValidators,
            /* uint256 depositableValidatorsCount */
        ) = _getStakingModuleSummary(IStakingModule(stakingModule.stakingModuleAddress));

        activeValidatorsCount = totalDepositedValidators - Math256.max(
            stakingModule.exitedValidatorsCount, totalExitedValidators
        );
    }

    /// @notice Returns the max count of deposits which the staking module can provide data for based
    /// on the passed `_maxDepositsValue` amount.
    /// @param _stakingModuleId Id of the staking module to be deposited.
    /// @param _maxDepositsValue Max amount of ether that might be used for deposits count calculation.
    /// @return Max number of deposits might be done using the given staking module.
    function getStakingModuleMaxDepositsCount(uint256 _stakingModuleId, uint256 _maxDepositsValue)
        public
        view
        returns (uint256)
    {
        (
            /* uint256 allocated */,
            uint256[] memory newDepositsAllocation,
            StakingModuleCache[] memory stakingModulesCache
        ) = _getDepositsAllocation(_maxDepositsValue / DEPOSIT_SIZE);
        uint256 stakingModuleIndex = _getStakingModuleIndexById(_stakingModuleId);
        return
            newDepositsAllocation[stakingModuleIndex] - stakingModulesCache[stakingModuleIndex].activeValidatorsCount;
    }

    /// @notice Returns the aggregate fee distribution proportion.
    /// @return modulesFee Modules aggregate fee in base precision.
    /// @return treasuryFee Treasury fee in base precision.
    /// @return basePrecision Base precision: a value corresponding to the full fee.
    function getStakingFeeAggregateDistribution() public view returns (
        uint96 modulesFee,
        uint96 treasuryFee,
        uint256 basePrecision
    ) {
        uint96[] memory moduleFees;
        uint96 totalFee;
        (, , moduleFees, totalFee, basePrecision) = getStakingRewardsDistribution();
        for (uint256 i; i < moduleFees.length; ) {
            modulesFee += moduleFees[i];

            unchecked {
                ++i;
            }
        }
        treasuryFee = totalFee - modulesFee;
    }

    /// @notice Return shares table.
    /// @return recipients Rewards recipient addresses corresponding to each module.
    /// @return stakingModuleIds Module IDs.
    /// @return stakingModuleFees Fee of each recipient.
    /// @return totalFee Total fee to mint for each staking module and treasury.
    /// @return precisionPoints Base precision number, which constitutes 100% fee.
    function getStakingRewardsDistribution()
        public
        view
        returns (
            address[] memory recipients,
            uint256[] memory stakingModuleIds,
            uint96[] memory stakingModuleFees,
            uint96 totalFee,
            uint256 precisionPoints
        )
    {
        (uint256 totalActiveValidators, StakingModuleCache[] memory stakingModulesCache) = _loadStakingModulesCache();
        uint256 stakingModulesCount = stakingModulesCache.length;

        /// @dev Return empty response if there are no staking modules or active validators yet.
        if (stakingModulesCount == 0 || totalActiveValidators == 0) {
            return (new address[](0), new uint256[](0), new uint96[](0), 0, FEE_PRECISION_POINTS);
        }

        precisionPoints = FEE_PRECISION_POINTS;
        stakingModuleIds = new uint256[](stakingModulesCount);
        recipients = new address[](stakingModulesCount);
        stakingModuleFees = new uint96[](stakingModulesCount);

        uint256 rewardedStakingModulesCount = 0;
        uint256 stakingModuleValidatorsShare;
        uint96 stakingModuleFee;

        for (uint256 i; i < stakingModulesCount; ) {
            /// @dev Skip staking modules which have no active validators.
            if (stakingModulesCache[i].activeValidatorsCount > 0) {
                stakingModuleIds[rewardedStakingModulesCount] = stakingModulesCache[i].stakingModuleId;
                stakingModuleValidatorsShare = ((stakingModulesCache[i].activeValidatorsCount * precisionPoints) / totalActiveValidators);

                recipients[rewardedStakingModulesCount] = address(stakingModulesCache[i].stakingModuleAddress);
                stakingModuleFee = uint96((stakingModuleValidatorsShare * stakingModulesCache[i].stakingModuleFee) / TOTAL_BASIS_POINTS);
                /// @dev If the staking module has the `Stopped` status for some reason, then
                ///      the staking module's rewards go to the treasury, so that the DAO has ability
                ///      to manage them (e.g. to compensate the staking module in case of an error, etc.)
                if (stakingModulesCache[i].status != StakingModuleStatus.Stopped) {
                    stakingModuleFees[rewardedStakingModulesCount] = stakingModuleFee;
                }
                // Else keep stakingModuleFees[rewardedStakingModulesCount] = 0, but increase totalFee.

                totalFee += (uint96((stakingModuleValidatorsShare * stakingModulesCache[i].treasuryFee) / TOTAL_BASIS_POINTS) + stakingModuleFee);

                unchecked {
                    rewardedStakingModulesCount++;
                }
            }

            unchecked {
                ++i;
            }
        }

        // Total fee never exceeds 100%.
        assert(totalFee <= precisionPoints);

        /// @dev Shrink arrays.
        if (rewardedStakingModulesCount < stakingModulesCount) {
            assembly {
                mstore(stakingModuleIds, rewardedStakingModulesCount)
                mstore(recipients, rewardedStakingModulesCount)
                mstore(stakingModuleFees, rewardedStakingModulesCount)
            }
        }
    }

    /// @notice Returns the same as getStakingRewardsDistribution() but in reduced, 1e4 precision (DEPRECATED).
    /// @dev Helper only for Lido contract. Use getStakingRewardsDistribution() instead.
    /// @return totalFee Total fee to mint for each staking module and treasury in reduced, 1e4 precision.
    function getTotalFeeE4Precision() external view returns (uint16 totalFee) {
        /// @dev The logic is placed here but in Lido contract to save Lido bytecode.
        (, , , uint96 totalFeeInHighPrecision, uint256 precision) = getStakingRewardsDistribution();
        // Here we rely on (totalFeeInHighPrecision <= precision).
        totalFee = _toE4Precision(totalFeeInHighPrecision, precision);
    }

    /// @notice Returns the same as getStakingFeeAggregateDistribution() but in reduced, 1e4 precision (DEPRECATED).
    /// @dev Helper only for Lido contract. Use getStakingFeeAggregateDistribution() instead.
    /// @return modulesFee Modules aggregate fee in reduced, 1e4 precision.
    /// @return treasuryFee Treasury fee in reduced, 1e4 precision.
    function getStakingFeeAggregateDistributionE4Precision()
        external view
        returns (uint16 modulesFee, uint16 treasuryFee)
    {
        /// @dev The logic is placed here but in Lido contract to save Lido bytecode.
        (
            uint256 modulesFeeHighPrecision,
            uint256 treasuryFeeHighPrecision,
            uint256 precision
        ) = getStakingFeeAggregateDistribution();
        // Here we rely on ({modules,treasury}FeeHighPrecision <= precision).
        modulesFee = _toE4Precision(modulesFeeHighPrecision, precision);
        treasuryFee = _toE4Precision(treasuryFeeHighPrecision, precision);
    }

    /// @notice Returns new deposits allocation after the distribution of the `_depositsCount` deposits.
    /// @param _depositsCount The maximum number of deposits to be allocated.
    /// @return allocated Number of deposits allocated to the staking modules.
    /// @return allocations Array of new deposits allocation to the staking modules.
    function getDepositsAllocation(uint256 _depositsCount) external view returns (uint256 allocated, uint256[] memory allocations) {
        (allocated, allocations, ) = _getDepositsAllocation(_depositsCount);
    }

    /// @notice Invokes a deposit call to the official Deposit contract.
    /// @param _depositsCount Number of deposits to make.
    /// @param _stakingModuleId Id of the staking module to be deposited.
    /// @param _depositCalldata Staking module calldata.
    /// @dev Only the Lido contract is allowed to call this method.
    function deposit(
        uint256 _depositsCount,
        uint256 _stakingModuleId,
        bytes calldata _depositCalldata
    ) external payable {
        if (msg.sender != LIDO_POSITION.getStorageAddress()) revert AppAuthLidoFailed();

        bytes32 withdrawalCredentials = getWithdrawalCredentials();
        if (withdrawalCredentials == 0) revert EmptyWithdrawalsCredentials();

        StakingModule storage stakingModule = _getStakingModuleById(_stakingModuleId);
        if (StakingModuleStatus(stakingModule.status) != StakingModuleStatus.Active)
            revert StakingModuleNotActive();

        /// @dev Firstly update the local state of the contract to prevent a reentrancy attack
        /// even though the staking modules are trusted contracts.
        uint256 depositsValue = msg.value;
        if (depositsValue != _depositsCount * DEPOSIT_SIZE) revert InvalidDepositsValue(depositsValue, _depositsCount);

        _updateModuleLastDepositState(stakingModule, _stakingModuleId, depositsValue);

        if (_depositsCount > 0) {
            (bytes memory publicKeysBatch, bytes memory signaturesBatch) =
                IStakingModule(stakingModule.stakingModuleAddress)
                    .obtainDepositData(_depositsCount, _depositCalldata);

            uint256 etherBalanceBeforeDeposits = address(this).balance;
            _makeBeaconChainDeposits32ETH(
                _depositsCount,
                abi.encodePacked(withdrawalCredentials),
                publicKeysBatch,
                signaturesBatch
            );
            uint256 etherBalanceAfterDeposits = address(this).balance;

            /// @dev All sent ETH must be deposited and self balance stay the same.
            assert(etherBalanceBeforeDeposits - etherBalanceAfterDeposits == depositsValue);
        }
    }

    /// @notice Set credentials to withdraw ETH on Consensus Layer side.
    /// @param _withdrawalCredentials withdrawal credentials field as defined in the Consensus Layer specs.
    /// @dev Note that setWithdrawalCredentials discards all unused deposits data as the signatures are invalidated.
    /// @dev The function is restricted to the `MANAGE_WITHDRAWAL_CREDENTIALS_ROLE` role.
    function setWithdrawalCredentials(bytes32 _withdrawalCredentials) external onlyRole(MANAGE_WITHDRAWAL_CREDENTIALS_ROLE) {
        WITHDRAWAL_CREDENTIALS_POSITION.setStorageBytes32(_withdrawalCredentials);

        uint256 stakingModulesCount = getStakingModulesCount();
        for (uint256 i; i < stakingModulesCount; ) {
            StakingModule storage stakingModule = _getStakingModuleByIndex(i);

            unchecked {
                ++i;
            }

            try IStakingModule(stakingModule.stakingModuleAddress)
                .onWithdrawalCredentialsChanged() {}
            catch (bytes memory lowLevelRevertData) {
                /// @dev This check is required to prevent incorrect gas estimation of the method.
                ///      Without it, Ethereum nodes that use binary search for gas estimation may
                ///      return an invalid value when the onWithdrawalCredentialsChanged()
                ///      reverts because of the "out of gas" error. Here we assume that the
                ///      onWithdrawalCredentialsChanged() method doesn't have reverts with
                ///      empty error data except "out of gas".
                if (lowLevelRevertData.length == 0) revert UnrecoverableModuleError();
                _setStakingModuleStatus(stakingModule, StakingModuleStatus.DepositsPaused);
                emit WithdrawalsCredentialsChangeFailed(stakingModule.id, lowLevelRevertData);
            }
        }

        emit WithdrawalCredentialsSet(_withdrawalCredentials, msg.sender);
    }

    /// @notice Returns current credentials to withdraw ETH on Consensus Layer side.
    /// @return Withdrawal credentials.
    function getWithdrawalCredentials() public view returns (bytes32) {
        return WITHDRAWAL_CREDENTIALS_POSITION.getStorageBytes32();
    }

    function _checkValidatorsByNodeOperatorReportData(
        bytes calldata _nodeOperatorIds,
        bytes calldata _validatorsCounts
    ) internal pure {
        if (_nodeOperatorIds.length % 8 != 0 || _validatorsCounts.length % 16 != 0) {
            revert InvalidReportData(3);
        }
        uint256 nodeOperatorsCount = _nodeOperatorIds.length / 8;
        if (_validatorsCounts.length / 16 != nodeOperatorsCount) {
            revert InvalidReportData(2);
        }
        if (nodeOperatorsCount == 0) {
            revert InvalidReportData(1);
        }
    }

    /// @dev Save the last deposit state for the staking module and emit the event
    /// @param stakingModule staking module storage ref
    /// @param stakingModuleId id of the staking module to be deposited
    /// @param depositsValue value to deposit
    function _updateModuleLastDepositState(
        StakingModule storage stakingModule,
        uint256 stakingModuleId,
        uint256 depositsValue
    ) internal {
        stakingModule.lastDepositAt = uint64(block.timestamp);
        stakingModule.lastDepositBlock = block.number;
        emit StakingRouterETHDeposited(stakingModuleId, depositsValue);
    }


    /// @dev Loads modules into a memory cache.
    /// @return totalActiveValidators Total active validators across all modules.
    /// @return stakingModulesCache Array of StakingModuleCache structs.
    function _loadStakingModulesCache() internal view returns (
        uint256 totalActiveValidators,
        StakingModuleCache[] memory stakingModulesCache
    ) {
        uint256 stakingModulesCount = getStakingModulesCount();
        stakingModulesCache = new StakingModuleCache[](stakingModulesCount);
        for (uint256 i; i < stakingModulesCount; ) {
            stakingModulesCache[i] = _loadStakingModulesCacheItem(i);
            totalActiveValidators += stakingModulesCache[i].activeValidatorsCount;

            unchecked {
                ++i;
            }
        }
    }

    function _loadStakingModulesCacheItem(uint256 _stakingModuleIndex)
        internal
        view
        returns (StakingModuleCache memory cacheItem)
    {
        StakingModule storage stakingModuleData = _getStakingModuleByIndex(_stakingModuleIndex);

        cacheItem.stakingModuleAddress = stakingModuleData.stakingModuleAddress;
        cacheItem.stakingModuleId = stakingModuleData.id;
        cacheItem.stakingModuleFee = stakingModuleData.stakingModuleFee;
        cacheItem.treasuryFee = stakingModuleData.treasuryFee;
        cacheItem.stakeShareLimit = stakingModuleData.stakeShareLimit;
        cacheItem.status = StakingModuleStatus(stakingModuleData.status);

        (
            uint256 totalExitedValidators,
            uint256 totalDepositedValidators,
            uint256 depositableValidatorsCount
        ) = _getStakingModuleSummary(IStakingModule(cacheItem.stakingModuleAddress));

        cacheItem.availableValidatorsCount = cacheItem.status == StakingModuleStatus.Active
            ? depositableValidatorsCount
            : 0;

        // The module might not receive all exited validators data yet => we need to replacing
        // the exitedValidatorsCount with the one that the staking router is aware of.
        cacheItem.activeValidatorsCount =
            totalDepositedValidators -
            Math256.max(totalExitedValidators, stakingModuleData.exitedValidatorsCount);
    }

    function _setStakingModuleStatus(StakingModule storage _stakingModule, StakingModuleStatus _status) internal {
        StakingModuleStatus prevStatus = StakingModuleStatus(_stakingModule.status);
        if (prevStatus != _status) {
            _stakingModule.status = uint8(_status);
            emit StakingModuleStatusSet(_stakingModule.id, _status, msg.sender);
        }
    }

    function _getDepositsAllocation(
        uint256 _depositsToAllocate
    ) internal view returns (uint256 allocated, uint256[] memory allocations, StakingModuleCache[] memory stakingModulesCache) {
        // Calculate total used validators for operators.
        uint256 totalActiveValidators;

        (totalActiveValidators, stakingModulesCache) = _loadStakingModulesCache();

        uint256 stakingModulesCount = stakingModulesCache.length;
        allocations = new uint256[](stakingModulesCount);
        if (stakingModulesCount > 0) {
            /// @dev New estimated active validators count.
            totalActiveValidators += _depositsToAllocate;
            uint256[] memory capacities = new uint256[](stakingModulesCount);
            uint256 targetValidators;

            for (uint256 i; i < stakingModulesCount; ) {
                allocations[i] = stakingModulesCache[i].activeValidatorsCount;
                targetValidators = (stakingModulesCache[i].stakeShareLimit * totalActiveValidators) / TOTAL_BASIS_POINTS;
                capacities[i] = Math256.min(targetValidators, stakingModulesCache[i].activeValidatorsCount + stakingModulesCache[i].availableValidatorsCount);

                unchecked {
                    ++i;
                }
            }

            (allocated, allocations) = MinFirstAllocationStrategy.allocate(allocations, capacities, _depositsToAllocate);
        }
    }

    function _getStakingModuleIndexById(uint256 _stakingModuleId) internal view returns (uint256) {
        mapping(uint256 => uint256) storage _stakingModuleIndicesOneBased = _getStorageStakingIndicesMapping();
        uint256 indexOneBased = _stakingModuleIndicesOneBased[_stakingModuleId];
        if (indexOneBased == 0) revert StakingModuleUnregistered();
        return indexOneBased - 1;
    }

    function _setStakingModuleIndexById(uint256 _stakingModuleId, uint256 _stakingModuleIndex) internal {
        mapping(uint256 => uint256) storage _stakingModuleIndicesOneBased = _getStorageStakingIndicesMapping();
        _stakingModuleIndicesOneBased[_stakingModuleId] = _stakingModuleIndex + 1;
    }

    function _getStakingModuleById(uint256 _stakingModuleId) internal view returns (StakingModule storage) {
        return _getStakingModuleByIndex(_getStakingModuleIndexById(_stakingModuleId));
    }

    function _getIStakingModuleById(uint256 _stakingModuleId) internal view returns (IStakingModule) {
        return IStakingModule(_getStakingModuleAddressById(_stakingModuleId));
    }

    function _getStakingModuleByIndex(uint256 _stakingModuleIndex) internal view returns (StakingModule storage) {
        mapping(uint256 => StakingModule) storage _stakingModules = _getStorageStakingModulesMapping();
        return _stakingModules[_stakingModuleIndex];
    }

    function _getStakingModuleAddressById(uint256 _stakingModuleId) internal view returns (address) {
        return _getStakingModuleById(_stakingModuleId).stakingModuleAddress;
    }

    function _getStorageStakingModulesMapping() internal pure returns (mapping(uint256 => StakingModule) storage result) {
        bytes32 position = STAKING_MODULES_MAPPING_POSITION;
        assembly {
            result.slot := position
        }
    }

    function _getStorageStakingIndicesMapping() internal pure returns (mapping(uint256 => uint256) storage result) {
        bytes32 position = STAKING_MODULE_INDICES_MAPPING_POSITION;
        assembly {
            result.slot := position
        }
    }

    function _toE4Precision(uint256 _value, uint256 _precision) internal pure returns (uint16) {
        return uint16((_value * TOTAL_BASIS_POINTS) / _precision);
    }

    function _validateEqualArrayLengths(uint256 firstArrayLength, uint256 secondArrayLength) internal pure {
        if (firstArrayLength != secondArrayLength) {
            revert ArraysLengthMismatch(firstArrayLength, secondArrayLength);
        }
    }

    /// @dev Optimizes contract deployment size by wrapping the 'stakingModule.getStakingModuleSummary' function.
    function _getStakingModuleSummary(IStakingModule stakingModule) internal view returns (uint256, uint256, uint256) {
        return stakingModule.getStakingModuleSummary();
    }
}