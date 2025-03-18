// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

library UnstructuredRefStorage {
    function storageMapUint256Address(bytes32 _position) internal pure returns (
        mapping(uint256 => address) storage result
    ) {
        assembly { result.slot := _position }
    }

    function storageMapAddressMapAddressBool(bytes32 _position) internal pure returns (
        mapping(address => mapping(address => bool)) storage result
    ) {
        assembly { result.slot := _position }
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
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
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

abstract contract WithdrawalQueueBase {
    using EnumerableSet for EnumerableSet.UintSet;
    using UnstructuredStorage for bytes32;

    /// @dev maximal length of the batch array provided for prefinalization. See `prefinalize()`
    uint256 public constant MAX_BATCHES_LENGTH = 36;

    /// @notice precision base for share rate
    uint256 internal constant E27_PRECISION_BASE = 1e27;
    /// @dev return value for the `find...` methods in case of no result
    uint256 internal constant NOT_FOUND = 0;

    /// @dev queue for withdrawal requests, indexes (requestId) start from 1
    bytes32 internal constant QUEUE_POSITION = keccak256("lido.WithdrawalQueue.queue");
    /// @dev last index in request queue
    bytes32 internal constant LAST_REQUEST_ID_POSITION = keccak256("lido.WithdrawalQueue.lastRequestId");
    /// @dev last index of finalized request in the queue
    bytes32 internal constant LAST_FINALIZED_REQUEST_ID_POSITION =
        keccak256("lido.WithdrawalQueue.lastFinalizedRequestId");
    /// @dev finalization rate history, indexes start from 1
    bytes32 internal constant CHECKPOINTS_POSITION = keccak256("lido.WithdrawalQueue.checkpoints");
    /// @dev last index in checkpoints array
    bytes32 internal constant LAST_CHECKPOINT_INDEX_POSITION = keccak256("lido.WithdrawalQueue.lastCheckpointIndex");
    /// @dev amount of eth locked on contract for further claiming
    bytes32 internal constant LOCKED_ETHER_AMOUNT_POSITION = keccak256("lido.WithdrawalQueue.lockedEtherAmount");
    /// @dev withdrawal requests mapped to the owners
    bytes32 internal constant REQUEST_BY_OWNER_POSITION = keccak256("lido.WithdrawalQueue.requestsByOwner");
    /// @dev timestamp of the last oracle report
    bytes32 internal constant LAST_REPORT_TIMESTAMP_POSITION = keccak256("lido.WithdrawalQueue.lastReportTimestamp");

    /// @notice structure representing a request for withdrawal
    struct WithdrawalRequest {
        /// @notice sum of the all stETH submitted for withdrawals including this request
        uint128 cumulativeStETH;
        /// @notice sum of the all shares locked for withdrawal including this request
        uint128 cumulativeShares;
        /// @notice address that can claim or transfer the request
        address owner;
        /// @notice block.timestamp when the request was created
        uint40 timestamp;
        /// @notice flag if the request was claimed
        bool claimed;
        /// @notice timestamp of last oracle report for this request
        uint40 reportTimestamp;
    }

    /// @notice structure to store discounts for requests that are affected by negative rebase
    struct Checkpoint {
        uint256 fromRequestId;
        uint256 maxShareRate;
    }

    /// @notice output format struct for `_getWithdrawalStatus()` method
    struct WithdrawalRequestStatus {
        /// @notice stETH token amount that was locked on withdrawal queue for this request
        uint256 amountOfStETH;
        /// @notice amount of stETH shares locked on withdrawal queue for this request
        uint256 amountOfShares;
        /// @notice address that can claim or transfer this request
        address owner;
        /// @notice timestamp of when the request was created, in seconds
        uint256 timestamp;
        /// @notice true, if request is finalized
        bool isFinalized;
        /// @notice true, if request is claimed. Request is claimable if (isFinalized && !isClaimed)
        bool isClaimed;
    }

    /// @dev Contains both stETH token amount and its corresponding shares amount
    event WithdrawalRequested(
        uint256 indexed requestId,
        address indexed requestor,
        address indexed owner,
        uint256 amountOfStETH,
        uint256 amountOfShares
    );
    event WithdrawalsFinalized(
        uint256 indexed from, uint256 indexed to, uint256 amountOfETHLocked, uint256 sharesToBurn, uint256 timestamp
    );
    event WithdrawalClaimed(
        uint256 indexed requestId, address indexed owner, address indexed receiver, uint256 amountOfETH
    );

    error ZeroAmountOfETH();
    error ZeroShareRate();
    error ZeroTimestamp();
    error TooMuchEtherToFinalize(uint256 sent, uint256 maxExpected);
    error NotOwner(address _sender, address _owner);
    error InvalidRequestId(uint256 _requestId);
    error InvalidRequestIdRange(uint256 startId, uint256 endId);
    error InvalidState();
    error BatchesAreNotSorted();
    error EmptyBatches();
    error RequestNotFoundOrNotFinalized(uint256 _requestId);
    error NotEnoughEther();
    error RequestAlreadyClaimed(uint256 _requestId);
    error InvalidHint(uint256 _hint);
    error CantSendValueRecipientMayHaveReverted();

    /// @notice id of the last request
    ///  NB! requests are indexed from 1, so it returns 0 if there is no requests in the queue
    function getLastRequestId() public view returns (uint256) {
        return LAST_REQUEST_ID_POSITION.getStorageUint256();
    }

    /// @notice id of the last finalized request
    ///  NB! requests are indexed from 1, so it returns 0 if there is no finalized requests in the queue
    function getLastFinalizedRequestId() public view returns (uint256) {
        return LAST_FINALIZED_REQUEST_ID_POSITION.getStorageUint256();
    }

    /// @notice amount of ETH on this contract balance that is locked for withdrawal and available to claim
    function getLockedEtherAmount() public view returns (uint256) {
        return LOCKED_ETHER_AMOUNT_POSITION.getStorageUint256();
    }

    /// @notice length of the checkpoint array. Last possible value for the hint.
    ///  NB! checkpoints are indexed from 1, so it returns 0 if there is no checkpoints
    function getLastCheckpointIndex() public view returns (uint256) {
        return LAST_CHECKPOINT_INDEX_POSITION.getStorageUint256();
    }

    /// @notice return the number of unfinalized requests in the queue
    function unfinalizedRequestNumber() external view returns (uint256) {
        return getLastRequestId() - getLastFinalizedRequestId();
    }

    /// @notice Returns the amount of stETH in the queue yet to be finalized
    function unfinalizedStETH() external view returns (uint256) {
        return
            _getQueue()[getLastRequestId()].cumulativeStETH - _getQueue()[getLastFinalizedRequestId()].cumulativeStETH;
    }

    //
    // FINALIZATION FLOW
    //
    // Process when protocol is fixing the withdrawal request value and lock the required amount of ETH.
    // The value of a request after finalization can be:
    //  - nominal (when the amount of eth locked for this request are equal to the request's stETH)
    //  - discounted (when the amount of eth will be lower, because the protocol share rate dropped
    //   before request is finalized, so it will be equal to `request's shares` * `protocol share rate`)
    // The parameters that are required for finalization are:
    //  - current share rate of the protocol
    //  - id of the last request that can be finalized
    //  - the amount of eth that must be locked for these requests
    // To calculate the eth amount we'll need to know which requests in the queue will be finalized as nominal
    // and which as discounted and the exact value of the discount. It's impossible to calculate without the unbounded
    // loop over the unfinalized part of the queue. So, we need to extract a part of the algorithm off-chain, bring the
    // result with oracle report and check it later and check the result later.
    // So, we came to this solution:
    // Off-chain
    // 1. Oracle iterates over the queue off-chain and calculate the id of the latest finalizable request
    // in the queue. Then it splits all the requests that will be finalized into batches the way,
    // that requests in a batch are all nominal or all discounted.
    // And passes them in the report as the array of the ending ids of these batches. So it can be reconstructed like
    // `[lastFinalizedRequestId+1, batches[0]], [batches[0]+1, batches[1]] ... [batches[n-2], batches[n-1]]`
    // 2. Contract checks the validity of the batches on-chain and calculate the amount of eth required to
    //  finalize them. It can be done without unbounded loop using partial sums that are calculated on request enqueueing.
    // 3. Contract marks the request's as finalized and locks the eth for claiming. It also,
    //  set's the discount checkpoint for these request's if required that will be applied on claim for each request's
    // individually depending on request's share rate.

    /// @notice transient state that is used to pass intermediate results between several `calculateFinalizationBatches`
    //   invocations
    struct BatchesCalculationState {
        /// @notice amount of ether available in the protocol that can be used to finalize withdrawal requests
        ///  Will decrease on each call and will be equal to the remainder when calculation is finished
        ///  Should be set before the first call
        uint256 remainingEthBudget;
        /// @notice flag that is set to `true` if returned state is final and `false` if more calls are required
        bool finished;
        /// @notice static array to store last request id in each batch
        uint256[MAX_BATCHES_LENGTH] batches;
        /// @notice length of the filled part of `batches` array
        uint256 batchesLength;
    }

    /// @notice Offchain view for the oracle daemon that calculates how many requests can be finalized within
    /// the given budget, time period and share rate limits. Returned requests are split into batches.
    /// Each batch consist of the requests that all have the share rate below the `_maxShareRate` or above it.
    /// Below you can see an example how 14 requests with different share rates will be split into 5 batches by
    /// this method
    ///
    /// ^ share rate
    /// |
    /// |         • •
    /// |       •    •   • • •
    /// |----------------------•------ _maxShareRate
    /// |   •          •        • • •
    /// | •
    /// +-------------------------------> requestId
    ///  | 1st|  2nd  |3| 4th | 5th  |
    ///
    /// @param _maxShareRate current share rate of the protocol (1e27 precision)
    /// @param _maxTimestamp max timestamp of the request that can be finalized
    /// @param _maxRequestsPerCall max request number that can be processed per call.
    /// @param _state structure that accumulates the state across multiple invocations to overcome gas limits.
    ///  To start calculation you should pass `state.remainingEthBudget` and `state.finished == false` and then invoke
    ///  the function with returned `state` until it returns a state with `finished` flag set
    /// @return state that is changing on each call and should be passed to the next call until `state.finished` is true
    function calculateFinalizationBatches(
        uint256 _maxShareRate,
        uint256 _maxTimestamp,
        uint256 _maxRequestsPerCall,
        BatchesCalculationState memory _state
    ) external view returns (BatchesCalculationState memory) {
        if (_state.finished || _state.remainingEthBudget == 0) revert InvalidState();

        uint256 currentId;
        WithdrawalRequest memory prevRequest;
        uint256 prevRequestShareRate;

        if (_state.batchesLength == 0) {
            currentId = getLastFinalizedRequestId() + 1;

            prevRequest = _getQueue()[currentId - 1];
        } else {
            uint256 lastHandledRequestId = _state.batches[_state.batchesLength - 1];
            currentId = lastHandledRequestId + 1;

            prevRequest = _getQueue()[lastHandledRequestId];
            (prevRequestShareRate,,) = _calcBatch(_getQueue()[lastHandledRequestId - 1], prevRequest);
        }

        uint256 nextCallRequestId = currentId + _maxRequestsPerCall;
        uint256 queueLength = getLastRequestId() + 1;

        while (currentId < queueLength && currentId < nextCallRequestId) {
            WithdrawalRequest memory request = _getQueue()[currentId];

            if (request.timestamp > _maxTimestamp) break; // max timestamp break

            (uint256 requestShareRate, uint256 ethToFinalize, uint256 shares) = _calcBatch(prevRequest, request);

            if (requestShareRate > _maxShareRate) {
                // discounted
                ethToFinalize = (shares * _maxShareRate) / E27_PRECISION_BASE;
            }

            if (ethToFinalize > _state.remainingEthBudget) break; // budget break
            _state.remainingEthBudget -= ethToFinalize;

            if (_state.batchesLength != 0 && (
                // share rate of requests in the same batch can differ by 1-2 wei because of the rounding error
                // (issue: https://github.com/lidofinance/lido-dao/issues/442 )
                // so we're taking requests that are placed during the same report
                // as equal even if their actual share rate are different
                prevRequest.reportTimestamp == request.reportTimestamp ||
                // both requests are below the line
                prevRequestShareRate <= _maxShareRate && requestShareRate <= _maxShareRate ||
                // both requests are above the line
                prevRequestShareRate > _maxShareRate && requestShareRate > _maxShareRate
            )) {
                _state.batches[_state.batchesLength - 1] = currentId; // extend the last batch
            } else {
                // to be able to check batches on-chain we need array to have limited length
                if (_state.batchesLength == MAX_BATCHES_LENGTH) break;

                // create a new batch
                _state.batches[_state.batchesLength] = currentId;
                ++_state.batchesLength;
            }

            prevRequestShareRate = requestShareRate;
            prevRequest = request;
            unchecked{ ++currentId; }
        }

        _state.finished = currentId == queueLength || currentId < nextCallRequestId;

        return _state;
    }

    /// @notice Checks finalization batches, calculates required ether and the amount of shares to burn
    /// @param _batches finalization batches calculated offchain using `calculateFinalizationBatches()`
    /// @param _maxShareRate max share rate that will be used for request finalization (1e27 precision)
    /// @return ethToLock amount of ether that should be sent with `finalize()` method
    /// @return sharesToBurn amount of shares that belongs to requests that will be finalized
    function prefinalize(uint256[] calldata _batches, uint256 _maxShareRate)
        external
        view
        returns (uint256 ethToLock, uint256 sharesToBurn)
    {
        if (_maxShareRate == 0) revert ZeroShareRate();
        if (_batches.length == 0) revert EmptyBatches();

        if (_batches[0] <= getLastFinalizedRequestId()) revert InvalidRequestId(_batches[0]);
        if (_batches[_batches.length - 1] > getLastRequestId()) revert InvalidRequestId(_batches[_batches.length - 1]);

        uint256 currentBatchIndex;
        uint256 prevBatchEndRequestId = getLastFinalizedRequestId();
        WithdrawalRequest memory prevBatchEnd = _getQueue()[prevBatchEndRequestId];
        while (currentBatchIndex < _batches.length) {
            uint256 batchEndRequestId = _batches[currentBatchIndex];
            if (batchEndRequestId <= prevBatchEndRequestId) revert BatchesAreNotSorted();

            WithdrawalRequest memory batchEnd = _getQueue()[batchEndRequestId];

            (uint256 batchShareRate, uint256 stETH, uint256 shares) = _calcBatch(prevBatchEnd, batchEnd);

            if (batchShareRate > _maxShareRate) {
                // discounted
                ethToLock += shares * _maxShareRate / E27_PRECISION_BASE;
            } else {
                // nominal
                ethToLock += stETH;
            }
            sharesToBurn += shares;

            prevBatchEndRequestId = batchEndRequestId;
            prevBatchEnd = batchEnd;
            unchecked{ ++currentBatchIndex; }
        }
    }

    /// @dev Finalize requests in the queue
    ///  Emits WithdrawalsFinalized event.
    function _finalize(uint256 _lastRequestIdToBeFinalized, uint256 _amountOfETH, uint256 _maxShareRate) internal {
        if (_lastRequestIdToBeFinalized > getLastRequestId()) revert InvalidRequestId(_lastRequestIdToBeFinalized);
        uint256 lastFinalizedRequestId = getLastFinalizedRequestId();
        if (_lastRequestIdToBeFinalized <= lastFinalizedRequestId) revert InvalidRequestId(_lastRequestIdToBeFinalized);

        WithdrawalRequest memory lastFinalizedRequest = _getQueue()[lastFinalizedRequestId];
        WithdrawalRequest memory requestToFinalize = _getQueue()[_lastRequestIdToBeFinalized];

        uint128 stETHToFinalize = requestToFinalize.cumulativeStETH - lastFinalizedRequest.cumulativeStETH;
        if (_amountOfETH > stETHToFinalize) revert TooMuchEtherToFinalize(_amountOfETH, stETHToFinalize);

        uint256 firstRequestIdToFinalize = lastFinalizedRequestId + 1;
        uint256 lastCheckpointIndex = getLastCheckpointIndex();

        // add a new checkpoint with current finalization max share rate
        _getCheckpoints()[lastCheckpointIndex + 1] = Checkpoint(firstRequestIdToFinalize, _maxShareRate);
        _setLastCheckpointIndex(lastCheckpointIndex + 1);

        _setLockedEtherAmount(getLockedEtherAmount() + _amountOfETH);
        _setLastFinalizedRequestId(_lastRequestIdToBeFinalized);

        emit WithdrawalsFinalized(
            firstRequestIdToFinalize,
            _lastRequestIdToBeFinalized,
            _amountOfETH,
            requestToFinalize.cumulativeShares - lastFinalizedRequest.cumulativeShares,
            block.timestamp
        );
    }

    /// @dev creates a new `WithdrawalRequest` in the queue
    ///  Emits WithdrawalRequested event
    function _enqueue(uint128 _amountOfStETH, uint128 _amountOfShares, address _owner)
        internal
        returns (uint256 requestId)
    {
        uint256 lastRequestId = getLastRequestId();
        WithdrawalRequest memory lastRequest = _getQueue()[lastRequestId];

        uint128 cumulativeShares = lastRequest.cumulativeShares + _amountOfShares;
        uint128 cumulativeStETH = lastRequest.cumulativeStETH + _amountOfStETH;

        requestId = lastRequestId + 1;

        _setLastRequestId(requestId);

        WithdrawalRequest memory newRequest =  WithdrawalRequest(
            cumulativeStETH,
            cumulativeShares,
            _owner,
            uint40(block.timestamp),
            false,
            uint40(_getLastReportTimestamp())
        );
        _getQueue()[requestId] = newRequest;
        assert(_getRequestsByOwner()[_owner].add(requestId));

        emit WithdrawalRequested(requestId, msg.sender, _owner, _amountOfStETH, _amountOfShares);
    }

    /// @dev Returns the status of the withdrawal request with `_requestId` id
    function _getStatus(uint256 _requestId) internal view returns (WithdrawalRequestStatus memory status) {
        if (_requestId == 0 || _requestId > getLastRequestId()) revert InvalidRequestId(_requestId);

        WithdrawalRequest memory request = _getQueue()[_requestId];
        WithdrawalRequest memory previousRequest = _getQueue()[_requestId - 1];

        status = WithdrawalRequestStatus(
            request.cumulativeStETH - previousRequest.cumulativeStETH,
            request.cumulativeShares - previousRequest.cumulativeShares,
            request.owner,
            request.timestamp,
            _requestId <= getLastFinalizedRequestId(),
            request.claimed
        );
    }

    /// @dev View function to find a checkpoint hint to use in `claimWithdrawal()` and `getClaimableEther()`
    ///  Search will be performed in the range of `[_firstIndex, _lastIndex]`
    ///
    /// @param _requestId request id to search the checkpoint for
    /// @param _start index of the left boundary of the search range, should be greater than 0
    /// @param _end index of the right boundary of the search range, should be less than or equal
    ///  to `getLastCheckpointIndex()`
    ///
    /// @return hint for later use in other methods or 0 if hint not found in the range
    function _findCheckpointHint(uint256 _requestId, uint256 _start, uint256 _end) internal view returns (uint256) {
        if (_requestId == 0 || _requestId > getLastRequestId()) revert InvalidRequestId(_requestId);

        uint256 lastCheckpointIndex = getLastCheckpointIndex();
        if (_start == 0 || _end > lastCheckpointIndex) revert InvalidRequestIdRange(_start, _end);

        if (lastCheckpointIndex == 0 || _requestId > getLastFinalizedRequestId() || _start > _end) return NOT_FOUND;

        // Right boundary
        if (_requestId >= _getCheckpoints()[_end].fromRequestId) {
            // it's the last checkpoint, so it's valid
            if (_end == lastCheckpointIndex) return _end;
            // it fits right before the next checkpoint
            if (_requestId < _getCheckpoints()[_end + 1].fromRequestId) return _end;

            return NOT_FOUND;
        }
        // Left boundary
        if (_requestId < _getCheckpoints()[_start].fromRequestId) {
            return NOT_FOUND;
        }

        // Binary search
        uint256 min = _start;
        uint256 max = _end - 1;

        while (max > min) {
            uint256 mid = (max + min + 1) / 2;
            if (_getCheckpoints()[mid].fromRequestId <= _requestId) {
                min = mid;
            } else {
                max = mid - 1;
            }
        }
        return min;
    }

    /// @dev Claim the request and transfer locked ether to `_recipient`.
    ///  Emits WithdrawalClaimed event
    /// @param _requestId id of the request to claim
    /// @param _hint hint the checkpoint to use. Can be obtained by calling `findCheckpointHint()`
    /// @param _recipient address to send ether to
    function _claim(uint256 _requestId, uint256 _hint, address _recipient) internal {
        if (_requestId == 0) revert InvalidRequestId(_requestId);
        if (_requestId > getLastFinalizedRequestId()) revert RequestNotFoundOrNotFinalized(_requestId);

        WithdrawalRequest storage request = _getQueue()[_requestId];

        if (request.claimed) revert RequestAlreadyClaimed(_requestId);
        if (request.owner != msg.sender) revert NotOwner(msg.sender, request.owner);

        request.claimed = true;
        assert(_getRequestsByOwner()[request.owner].remove(_requestId));

        uint256 ethWithDiscount = _calculateClaimableEther(request, _requestId, _hint);
        // because of the stETH rounding issue
        // (issue: https://github.com/lidofinance/lido-dao/issues/442 )
        // some dust (1-2 wei per request) will be accumulated upon claiming
        _setLockedEtherAmount(getLockedEtherAmount() - ethWithDiscount);
        _sendValue(_recipient, ethWithDiscount);

        emit WithdrawalClaimed(_requestId, msg.sender, _recipient, ethWithDiscount);
    }

    /// @dev Calculates ether value for the request using the provided hint. Checks if hint is valid
    /// @return claimableEther discounted eth for `_requestId`
    function _calculateClaimableEther(WithdrawalRequest storage _request, uint256 _requestId, uint256 _hint)
        internal
        view
        returns (uint256 claimableEther)
    {
        if (_hint == 0) revert InvalidHint(_hint);

        uint256 lastCheckpointIndex = getLastCheckpointIndex();
        if (_hint > lastCheckpointIndex) revert InvalidHint(_hint);

        Checkpoint memory checkpoint = _getCheckpoints()[_hint];
        // Reverts if requestId is not in range [checkpoint[hint], checkpoint[hint+1])
        // ______(>______
        //    ^  hint
        if (_requestId < checkpoint.fromRequestId) revert InvalidHint(_hint);
        if (_hint < lastCheckpointIndex) {
            // ______(>______(>________
            //       hint    hint+1  ^
            Checkpoint memory nextCheckpoint = _getCheckpoints()[_hint + 1];
            if (nextCheckpoint.fromRequestId <= _requestId) revert InvalidHint(_hint);
        }

        WithdrawalRequest memory prevRequest = _getQueue()[_requestId - 1];
        (uint256 batchShareRate, uint256 eth, uint256 shares) = _calcBatch(prevRequest, _request);

        if (batchShareRate > checkpoint.maxShareRate) {
            eth = shares * checkpoint.maxShareRate / E27_PRECISION_BASE;
        }

        return eth;
    }

    /// @dev quazi-constructor
    function _initializeQueue() internal {
        // setting dummy zero structs in checkpoints and queue beginning
        // to avoid uint underflows and related if-branches
        // 0-index is reserved as 'not_found' response in the interface everywhere
        _getQueue()[0] = WithdrawalRequest(0, 0, address(0), uint40(block.timestamp), true, 0);
        _getCheckpoints()[getLastCheckpointIndex()] = Checkpoint(0, 0);
    }

    function _sendValue(address _recipient, uint256 _amount) internal {
        if (address(this).balance < _amount) revert NotEnoughEther();

        // solhint-disable-next-line
        (bool success,) = _recipient.call{value: _amount}("");
        if (!success) revert CantSendValueRecipientMayHaveReverted();
    }

    /// @dev calculate batch stats (shareRate, stETH and shares) for the range of `(_preStartRequest, _endRequest]`
    function _calcBatch(WithdrawalRequest memory _preStartRequest, WithdrawalRequest memory _endRequest)
        internal
        pure
        returns (uint256 shareRate, uint256 stETH, uint256 shares)
    {
        stETH = _endRequest.cumulativeStETH - _preStartRequest.cumulativeStETH;
        shares = _endRequest.cumulativeShares - _preStartRequest.cumulativeShares;

        shareRate = stETH * E27_PRECISION_BASE / shares;
    }

    //
    // Internal getters and setters for unstructured storage
    //
    function _getQueue() internal pure returns (mapping(uint256 => WithdrawalRequest) storage queue) {
        bytes32 position = QUEUE_POSITION;
        assembly {
            queue.slot := position
        }
    }

    function _getCheckpoints() internal pure returns (mapping(uint256 => Checkpoint) storage checkpoints) {
        bytes32 position = CHECKPOINTS_POSITION;
        assembly {
            checkpoints.slot := position
        }
    }

    function _getRequestsByOwner()
        internal
        pure
        returns (mapping(address => EnumerableSet.UintSet) storage requestsByOwner)
    {
        bytes32 position = REQUEST_BY_OWNER_POSITION;
        assembly {
            requestsByOwner.slot := position
        }
    }

    function _getLastReportTimestamp() internal view returns (uint256) {
        return LAST_REPORT_TIMESTAMP_POSITION.getStorageUint256();
    }

    function _setLastRequestId(uint256 _lastRequestId) internal {
        LAST_REQUEST_ID_POSITION.setStorageUint256(_lastRequestId);
    }

    function _setLastFinalizedRequestId(uint256 _lastFinalizedRequestId) internal {
        LAST_FINALIZED_REQUEST_ID_POSITION.setStorageUint256(_lastFinalizedRequestId);
    }

    function _setLastCheckpointIndex(uint256 _lastCheckpointIndex) internal {
        LAST_CHECKPOINT_INDEX_POSITION.setStorageUint256(_lastCheckpointIndex);
    }

    function _setLockedEtherAmount(uint256 _lockedEtherAmount) internal {
        LOCKED_ETHER_AMOUNT_POSITION.setStorageUint256(_lockedEtherAmount);
    }

    function _setLastReportTimestamp(uint256 _lastReportTimestamp) internal {
        LAST_REPORT_TIMESTAMP_POSITION.setStorageUint256(_lastReportTimestamp);
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

abstract contract WithdrawalQueue is AccessControlEnumerable, PausableUntil, WithdrawalQueueBase, Versioned {
    using UnstructuredStorage for bytes32;
    using EnumerableSet for EnumerableSet.UintSet;

    /// Bunker mode activation timestamp
    bytes32 internal constant BUNKER_MODE_SINCE_TIMESTAMP_POSITION =
        keccak256("lido.WithdrawalQueue.bunkerModeSinceTimestamp");

    /// Special value for timestamp when bunker mode is inactive (i.e., protocol in turbo mode)
    uint256 public constant BUNKER_MODE_DISABLED_TIMESTAMP = type(uint256).max;

    // ACL
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 public constant RESUME_ROLE = keccak256("RESUME_ROLE");
    bytes32 public constant FINALIZE_ROLE = keccak256("FINALIZE_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    /// @notice minimal amount of stETH that is possible to withdraw
    uint256 public constant MIN_STETH_WITHDRAWAL_AMOUNT = 100;

    /// @notice maximum amount of stETH that is possible to withdraw by a single request
    /// Prevents accumulating too much funds per single request fulfillment in the future.
    /// @dev To withdraw larger amounts, it's recommended to split it to several requests
    uint256 public constant MAX_STETH_WITHDRAWAL_AMOUNT = 1000 * 1e18;

    /// @notice Lido stETH token address
    IStETH public immutable STETH;
    /// @notice Lido wstETH token address
    IWstETH public immutable WSTETH;

    event InitializedV1(address _admin);
    event BunkerModeEnabled(uint256 _sinceTimestamp);
    event BunkerModeDisabled();

    error AdminZeroAddress();
    error RequestAmountTooSmall(uint256 _amountOfStETH);
    error RequestAmountTooLarge(uint256 _amountOfStETH);
    error InvalidReportTimestamp();
    error RequestIdsNotSorted();
    error ZeroRecipient();
    error ArraysLengthMismatch(uint256 _firstArrayLength, uint256 _secondArrayLength);

    /// @param _wstETH address of WstETH contract
    constructor(IWstETH _wstETH) {
        // init immutables
        WSTETH = _wstETH;
        STETH = WSTETH.stETH();
    }

    /// @notice Initialize the contract storage explicitly.
    /// @param _admin admin address that can change every role.
    /// @dev Reverts if `_admin` equals to `address(0)`
    /// @dev NB! It's initialized in paused state by default and should be resumed explicitly to start
    /// @dev NB! Bunker mode is disabled by default
    function initialize(address _admin) external {
        if (_admin == address(0)) revert AdminZeroAddress();

        _initialize(_admin);
    }

    /// @notice Resume withdrawal requests placement and finalization
    ///  Contract is deployed in paused state and should be resumed explicitly
    function resume() external {
        _checkRole(RESUME_ROLE, msg.sender);
        _resume();
    }

    /// @notice Pause withdrawal requests placement and finalization. Claiming finalized requests will still be available
    /// @param _duration pause duration in seconds (use `PAUSE_INFINITELY` for unlimited)
    /// @dev Reverts if contract is already paused
    /// @dev Reverts reason if sender has no `PAUSE_ROLE`
    /// @dev Reverts if zero duration is passed
    function pauseFor(uint256 _duration) external onlyRole(PAUSE_ROLE) {
        _pauseFor(_duration);
    }

    /// @notice Pause withdrawal requests placement and finalization. Claiming finalized requests will still be available
    /// @param _pauseUntilInclusive the last second to pause until inclusive
    /// @dev Reverts if the timestamp is in the past
    /// @dev Reverts if sender has no `PAUSE_ROLE`
    /// @dev Reverts if contract is already paused
    function pauseUntil(uint256 _pauseUntilInclusive) external onlyRole(PAUSE_ROLE) {
        _pauseUntil(_pauseUntilInclusive);
    }

    /// @notice Request the batch of stETH for withdrawal. Approvals for the passed amounts should be done before.
    /// @param _amounts an array of stETH amount values.
    ///  The standalone withdrawal request will be created for each item in the passed list.
    /// @param _owner address that will be able to manage the created requests.
    ///  If `address(0)` is passed, `msg.sender` will be used as owner.
    /// @return requestIds an array of the created withdrawal request ids
    function requestWithdrawals(uint256[] calldata _amounts, address _owner)
        public
        returns (uint256[] memory requestIds)
    {
        _checkResumed();
        if (_owner == address(0)) _owner = msg.sender;
        requestIds = new uint256[](_amounts.length);
        for (uint256 i = 0; i < _amounts.length; ++i) {
            _checkWithdrawalRequestAmount(_amounts[i]);
            requestIds[i] = _requestWithdrawal(_amounts[i], _owner);
        }
    }

    /// @notice Request the batch of wstETH for withdrawal. Approvals for the passed amounts should be done before.
    /// @param _amounts an array of wstETH amount values.
    ///  The standalone withdrawal request will be created for each item in the passed list.
    /// @param _owner address that will be able to manage the created requests.
    ///  If `address(0)` is passed, `msg.sender` will be used as an owner.
    /// @return requestIds an array of the created withdrawal request ids
    function requestWithdrawalsWstETH(uint256[] calldata _amounts, address _owner)
        public
        returns (uint256[] memory requestIds)
    {
        _checkResumed();
        if (_owner == address(0)) _owner = msg.sender;
        requestIds = new uint256[](_amounts.length);
        for (uint256 i = 0; i < _amounts.length; ++i) {
            requestIds[i] = _requestWithdrawalWstETH(_amounts[i], _owner);
        }
    }

    struct PermitInput {
        uint256 value;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /// @notice Request the batch of stETH for withdrawal using EIP-2612 Permit
    /// @param _amounts an array of stETH amount values
    ///  The standalone withdrawal request will be created for each item in the passed list.
    /// @param _owner address that will be able to manage the created requests.
    ///  If `address(0)` is passed, `msg.sender` will be used as an owner.
    /// @param _permit data required for the stETH.permit() method to set the allowance
    /// @return requestIds an array of the created withdrawal request ids
    function requestWithdrawalsWithPermit(uint256[] calldata _amounts, address _owner, PermitInput calldata _permit)
        external
        returns (uint256[] memory requestIds)
    {
        STETH.permit(msg.sender, address(this), _permit.value, _permit.deadline, _permit.v, _permit.r, _permit.s);
        return requestWithdrawals(_amounts, _owner);
    }

    /// @notice Request the batch of wstETH for withdrawal using EIP-2612 Permit
    /// @param _amounts an array of wstETH amount values
    ///  The standalone withdrawal request will be created for each item in the passed list.
    /// @param _owner address that will be able to manage the created requests.
    ///  If `address(0)` is passed, `msg.sender` will be used as an owner.
    /// @param _permit data required for the wtETH.permit() method to set the allowance
    /// @return requestIds an array of the created withdrawal request ids
    function requestWithdrawalsWstETHWithPermit(
        uint256[] calldata _amounts,
        address _owner,
        PermitInput calldata _permit
    ) external returns (uint256[] memory requestIds) {
        WSTETH.permit(msg.sender, address(this), _permit.value, _permit.deadline, _permit.v, _permit.r, _permit.s);
        return requestWithdrawalsWstETH(_amounts, _owner);
    }

    /// @notice Returns all withdrawal requests that belongs to the `_owner` address
    ///
    /// WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
    /// to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
    /// this function has an unbounded cost, and using it as part of a state-changing function may render the function
    /// uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
    function getWithdrawalRequests(address _owner) external view returns (uint256[] memory requestsIds) {
        return _getRequestsByOwner()[_owner].values();
    }

    /// @notice Returns status for requests with provided ids
    /// @param _requestIds array of withdrawal request ids
    function getWithdrawalStatus(uint256[] calldata _requestIds)
        external
        view
        returns (WithdrawalRequestStatus[] memory statuses)
    {
        statuses = new WithdrawalRequestStatus[](_requestIds.length);
        for (uint256 i = 0; i < _requestIds.length; ++i) {
            statuses[i] = _getStatus(_requestIds[i]);
        }
    }

    /// @notice Returns amount of ether available for claim for each provided request id
    /// @param _requestIds array of request ids
    /// @param _hints checkpoint hints. can be found with `findCheckpointHints(_requestIds, 1, getLastCheckpointIndex())`
    /// @return claimableEthValues amount of claimable ether for each request, amount is equal to 0 if request
    ///  is not finalized or already claimed
    function getClaimableEther(uint256[] calldata _requestIds, uint256[] calldata _hints)
        external
        view
        returns (uint256[] memory claimableEthValues)
    {
        claimableEthValues = new uint256[](_requestIds.length);
        for (uint256 i = 0; i < _requestIds.length; ++i) {
            claimableEthValues[i] = _getClaimableEther(_requestIds[i], _hints[i]);
        }
    }

    /// @notice Claim a batch of withdrawal requests if they are finalized sending ether to `_recipient`
    /// @param _requestIds array of request ids to claim
    /// @param _hints checkpoint hint for each id. Can be obtained with `findCheckpointHints()`
    /// @param _recipient address where claimed ether will be sent to
    /// @dev
    ///  Reverts if recipient is equal to zero
    ///  Reverts if requestIds and hints arrays length differs
    ///  Reverts if any requestId or hint in arguments are not valid
    ///  Reverts if any request is not finalized or already claimed
    ///  Reverts if msg sender is not an owner of the requests
    function claimWithdrawalsTo(uint256[] calldata _requestIds, uint256[] calldata _hints, address _recipient)
        external
    {
        if (_recipient == address(0)) revert ZeroRecipient();
        if (_requestIds.length != _hints.length) {
            revert ArraysLengthMismatch(_requestIds.length, _hints.length);
        }

        for (uint256 i = 0; i < _requestIds.length; ++i) {
            _claim(_requestIds[i], _hints[i], _recipient);
            _emitTransfer(msg.sender, address(0), _requestIds[i]);
        }
    }

    /// @notice Claim a batch of withdrawal requests if they are finalized sending locked ether to the owner
    /// @param _requestIds array of request ids to claim
    /// @param _hints checkpoint hint for each id. Can be obtained with `findCheckpointHints()`
    /// @dev
    ///  Reverts if requestIds and hints arrays length differs
    ///  Reverts if any requestId or hint in arguments are not valid
    ///  Reverts if any request is not finalized or already claimed
    ///  Reverts if msg sender is not an owner of the requests
    function claimWithdrawals(uint256[] calldata _requestIds, uint256[] calldata _hints) external {
        if (_requestIds.length != _hints.length) {
            revert ArraysLengthMismatch(_requestIds.length, _hints.length);
        }

        for (uint256 i = 0; i < _requestIds.length; ++i) {
            _claim(_requestIds[i], _hints[i], msg.sender);
            _emitTransfer(msg.sender, address(0), _requestIds[i]);
        }
    }

    /// @notice Claim one`_requestId` request once finalized sending locked ether to the owner
    /// @param _requestId request id to claim
    /// @dev use unbounded loop to find a hint, which can lead to OOG
    /// @dev
    ///  Reverts if requestId or hint are not valid
    ///  Reverts if request is not finalized or already claimed
    ///  Reverts if msg sender is not an owner of request
    function claimWithdrawal(uint256 _requestId) external {
        _claim(_requestId, _findCheckpointHint(_requestId, 1, getLastCheckpointIndex()), msg.sender);
        _emitTransfer(msg.sender, address(0), _requestId);
    }

    /// @notice Finds the list of hints for the given `_requestIds` searching among the checkpoints with indices
    ///  in the range  `[_firstIndex, _lastIndex]`.
    ///  NB! Array of request ids should be sorted
    ///  NB! `_firstIndex` should be greater than 0, because checkpoint list is 1-based array
    ///  Usage: findCheckpointHints(_requestIds, 1, getLastCheckpointIndex())
    /// @param _requestIds ids of the requests sorted in the ascending order to get hints for
    /// @param _firstIndex left boundary of the search range. Should be greater than 0
    /// @param _lastIndex right boundary of the search range. Should be less than or equal to getLastCheckpointIndex()
    /// @return hintIds array of hints used to find required checkpoint for the request
    function findCheckpointHints(uint256[] calldata _requestIds, uint256 _firstIndex, uint256 _lastIndex)
        external
        view
        returns (uint256[] memory hintIds)
    {
        hintIds = new uint256[](_requestIds.length);
        uint256 prevRequestId = 0;
        for (uint256 i = 0; i < _requestIds.length; ++i) {
            if (_requestIds[i] < prevRequestId) revert RequestIdsNotSorted();
            hintIds[i] = _findCheckpointHint(_requestIds[i], _firstIndex, _lastIndex);
            _firstIndex = hintIds[i];
            prevRequestId = _requestIds[i];
        }
    }

    /// @notice Update bunker mode state and last report timestamp on oracle report
    /// @dev should be called by oracle
    ///
    /// @param _isBunkerModeNow is bunker mode reported by oracle
    /// @param _bunkerStartTimestamp timestamp of start of the bunker mode
    /// @param _currentReportTimestamp timestamp of the current report ref slot
    function onOracleReport(bool _isBunkerModeNow, uint256 _bunkerStartTimestamp, uint256 _currentReportTimestamp)
        external
    {
        _checkRole(ORACLE_ROLE, msg.sender);
        if (_bunkerStartTimestamp >= block.timestamp) revert InvalidReportTimestamp();
        if (_currentReportTimestamp >= block.timestamp) revert InvalidReportTimestamp();

        _setLastReportTimestamp(_currentReportTimestamp);

        bool isBunkerModeWasSetBefore = isBunkerModeActive();

        // on bunker mode state change
        if (_isBunkerModeNow != isBunkerModeWasSetBefore) {
            // write previous timestamp to enable bunker or max uint to disable
            if (_isBunkerModeNow) {
                BUNKER_MODE_SINCE_TIMESTAMP_POSITION.setStorageUint256(_bunkerStartTimestamp);

                emit BunkerModeEnabled(_bunkerStartTimestamp);
            } else {
                BUNKER_MODE_SINCE_TIMESTAMP_POSITION.setStorageUint256(BUNKER_MODE_DISABLED_TIMESTAMP);

                emit BunkerModeDisabled();
            }
        }
    }

    /// @notice Check if bunker mode is active
    function isBunkerModeActive() public view returns (bool) {
        return bunkerModeSinceTimestamp() < BUNKER_MODE_DISABLED_TIMESTAMP;
    }

    /// @notice Get bunker mode activation timestamp
    /// @dev returns `BUNKER_MODE_DISABLED_TIMESTAMP` if bunker mode is disable (i.e., protocol in turbo mode)
    function bunkerModeSinceTimestamp() public view returns (uint256) {
        return BUNKER_MODE_SINCE_TIMESTAMP_POSITION.getStorageUint256();
    }

    /// @notice Should emit ERC721 Transfer event in the inheriting contract
    function _emitTransfer(address from, address to, uint256 _requestId) internal virtual;

    /// @dev internal initialization helper. Doesn't check provided addresses intentionally
    function _initialize(address _admin) internal {
        _initializeQueue();
        _pauseFor(PAUSE_INFINITELY);

        _initializeContractVersionTo(1);

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);

        BUNKER_MODE_SINCE_TIMESTAMP_POSITION.setStorageUint256(BUNKER_MODE_DISABLED_TIMESTAMP);

        emit InitializedV1(_admin);
    }

    function _requestWithdrawal(uint256 _amountOfStETH, address _owner) internal returns (uint256 requestId) {
        STETH.transferFrom(msg.sender, address(this), _amountOfStETH);

        uint256 amountOfShares = STETH.getSharesByPooledEth(_amountOfStETH);

        requestId = _enqueue(uint128(_amountOfStETH), uint128(amountOfShares), _owner);

        _emitTransfer(address(0), _owner, requestId);
    }

    function _requestWithdrawalWstETH(uint256 _amountOfWstETH, address _owner) internal returns (uint256 requestId) {
        WSTETH.transferFrom(msg.sender, address(this), _amountOfWstETH);
        uint256 amountOfStETH = WSTETH.unwrap(_amountOfWstETH);
        _checkWithdrawalRequestAmount(amountOfStETH);

        uint256 amountOfShares = STETH.getSharesByPooledEth(amountOfStETH);

        requestId = _enqueue(uint128(amountOfStETH), uint128(amountOfShares), _owner);

        _emitTransfer(address(0), _owner, requestId);
    }

    function _checkWithdrawalRequestAmount(uint256 _amountOfStETH) internal pure {
        if (_amountOfStETH < MIN_STETH_WITHDRAWAL_AMOUNT) {
            revert RequestAmountTooSmall(_amountOfStETH);
        }
        if (_amountOfStETH > MAX_STETH_WITHDRAWAL_AMOUNT) {
            revert RequestAmountTooLarge(_amountOfStETH);
        }
    }

    /// @notice returns claimable ether under the request. Returns 0 if request is not finalized or claimed
    function _getClaimableEther(uint256 _requestId, uint256 _hint) internal view returns (uint256) {
        if (_requestId == 0 || _requestId > getLastRequestId()) revert InvalidRequestId(_requestId);

        if (_requestId > getLastFinalizedRequestId()) return 0;

        WithdrawalRequest storage request = _getQueue()[_requestId];
        if (request.claimed) return 0;

        return _calculateClaimableEther(request, _requestId, _hint);
    }
}

interface IERC4906 is IERC165, IERC721 {
    /// @dev This event emits when the metadata of a token is changed.
    /// So that the third-party platforms such as NFT market could
    /// timely update the images and related attributes of the NFT.
    event MetadataUpdate(uint256 _tokenId);

    /// @dev This event emits when the metadata of a range of tokens is changed.
    /// So that the third-party platforms such as NFT market could
    /// timely update the images and related attributes of the NFTs.
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
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

interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;
}

interface IERC721Metadata is IERC721 {
    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

contract WithdrawalQueueERC721 is IERC721Metadata, IERC4906, WithdrawalQueue {
    using Address for address;
    using Strings for uint256;
    using EnumerableSet for EnumerableSet.UintSet;
    using UnstructuredRefStorage for bytes32;
    using UnstructuredStorage for bytes32;

    bytes32 internal constant TOKEN_APPROVALS_POSITION = keccak256("lido.WithdrawalQueueERC721.tokenApprovals");
    bytes32 internal constant OPERATOR_APPROVALS_POSITION = keccak256("lido.WithdrawalQueueERC721.operatorApprovals");
    bytes32 internal constant BASE_URI_POSITION = keccak256("lido.WithdrawalQueueERC721.baseUri");
    bytes32 internal constant NFT_DESCRIPTOR_ADDRESS_POSITION =
        keccak256("lido.WithdrawalQueueERC721.nftDescriptorAddress");

    bytes32 public constant MANAGE_TOKEN_URI_ROLE = keccak256("MANAGE_TOKEN_URI_ROLE");

    // @notion simple wrapper for base URI string
    //  Solidity does not allow to store string in UnstructuredStorage
    struct BaseURI {
        string value;
    }

    event BaseURISet(string baseURI);
    event NftDescriptorAddressSet(address nftDescriptorAddress);

    error ApprovalToOwner();
    error ApproveToCaller();
    error NotOwnerOrApprovedForAll(address sender);
    error NotOwnerOrApproved(address sender);
    error TransferFromIncorrectOwner(address from, address realOwner);
    error TransferToZeroAddress();
    error TransferFromZeroAddress();
    error TransferToThemselves();
    error TransferToNonIERC721Receiver(address);
    error InvalidOwnerAddress(address);
    error StringTooLong(string str);
    error ZeroMetadata();

    // short strings for ERC721 name and symbol
    bytes32 private immutable NAME;
    bytes32 private immutable SYMBOL;

    /// @param _wstETH address of WstETH contract
    /// @param _name IERC721Metadata name string. Should be shorter than 32 bytes
    /// @param _symbol IERC721Metadata symbol string. Should be shorter than 32 bytes
    constructor(address _wstETH, string memory _name, string memory _symbol) WithdrawalQueue(IWstETH(_wstETH)) {
        if (bytes(_name).length == 0 || bytes(_symbol).length == 0) revert ZeroMetadata();
        NAME = _toBytes32(_name);
        SYMBOL = _toBytes32(_symbol);
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, AccessControlEnumerable)
        returns (bool)
    {
        return interfaceId == type(IERC721).interfaceId || interfaceId == type(IERC721Metadata).interfaceId
            // 0x49064906 is magic number ERC4906 interfaceId as defined in the standard https://eips.ethereum.org/EIPS/eip-4906
            || interfaceId == bytes4(0x49064906) || super.supportsInterface(interfaceId);
    }

    /// @dev See {IERC721Metadata-name}.
    function name() external view override returns (string memory) {
        return _toString(NAME);
    }

    /// @dev See {IERC721Metadata-symbol}.
    function symbol() external view override returns (string memory) {
        return _toString(SYMBOL);
    }

    /// @dev See {IERC721Metadata-tokenURI}.
    /// @dev If NFTDescriptor address isn't set the `baseURI` would be used for generating erc721 tokenURI. In case
    ///  NFTDescriptor address is set it would be used as a first-priority method.
    function tokenURI(uint256 _requestId) public view virtual override returns (string memory) {
        if (!_existsAndNotClaimed(_requestId)) revert InvalidRequestId(_requestId);

        address nftDescriptorAddress = NFT_DESCRIPTOR_ADDRESS_POSITION.getStorageAddress();
        if (nftDescriptorAddress != address(0)) {
            return INFTDescriptor(nftDescriptorAddress).constructTokenURI(_requestId);
        } else {
            return _constructTokenUri(_requestId);
        }
    }

    /// @notice Base URI for computing {tokenURI}. If set, the resulting URI for each
    /// token will be the concatenation of the `baseURI` and the `_requestId`.
    function getBaseURI() external view returns (string memory) {
        return _getBaseURI().value;
    }

    /// @notice Sets the Base URI for computing {tokenURI}. It does not expect the ending slash in provided string.
    /// @dev If NFTDescriptor address isn't set the `baseURI` would be used for generating erc721 tokenURI. In case
    ///  NFTDescriptor address is set it would be used as a first-priority method.
    function setBaseURI(string calldata _baseURI) external onlyRole(MANAGE_TOKEN_URI_ROLE) {
        _getBaseURI().value = _baseURI;
        emit BaseURISet(_baseURI);
    }

    /// @notice Address of NFTDescriptor contract that is responsible for tokenURI generation.
    function getNFTDescriptorAddress() external view returns (address) {
        return NFT_DESCRIPTOR_ADDRESS_POSITION.getStorageAddress();
    }

    /// @notice Sets the address of NFTDescriptor contract that is responsible for tokenURI generation.
    /// @dev If NFTDescriptor address isn't set the `baseURI` would be used for generating erc721 tokenURI. In case
    ///  NFTDescriptor address is set it would be used as a first-priority method.
    function setNFTDescriptorAddress(address _nftDescriptorAddress) external onlyRole(MANAGE_TOKEN_URI_ROLE) {
        NFT_DESCRIPTOR_ADDRESS_POSITION.setStorageAddress(_nftDescriptorAddress);
        emit NftDescriptorAddressSet(_nftDescriptorAddress);
    }

    /// @notice Finalize requests from last finalized one up to `_lastRequestIdToBeFinalized`
    /// @dev ether to finalize all the requests should be calculated using `prefinalize()` and sent along
    function finalize(uint256 _lastRequestIdToBeFinalized, uint256 _maxShareRate) external payable {
        _checkResumed();
        _checkRole(FINALIZE_ROLE, msg.sender);

        uint256 firstFinalizedRequestId = getLastFinalizedRequestId() + 1;

        _finalize(_lastRequestIdToBeFinalized, msg.value, _maxShareRate);

        // ERC4906 metadata update event
        // We are updating all unfinalized to make it look different as they move closer to finalization in the future
        emit BatchMetadataUpdate(firstFinalizedRequestId, getLastRequestId());
    }

    /// @dev See {IERC721-balanceOf}.
    function balanceOf(address _owner) external view override returns (uint256) {
        if (_owner == address(0)) revert InvalidOwnerAddress(_owner);
        return _getRequestsByOwner()[_owner].length();
    }

    /// @dev See {IERC721-ownerOf}.
    function ownerOf(uint256 _requestId) public view override returns (address) {
        if (_requestId == 0 || _requestId > getLastRequestId()) revert InvalidRequestId(_requestId);

        WithdrawalRequest storage request = _getQueue()[_requestId];
        if (request.claimed) revert RequestAlreadyClaimed(_requestId);

        return request.owner;
    }

    /// @dev See {IERC721-approve}.
    function approve(address _to, uint256 _requestId) external override {
        address owner = ownerOf(_requestId);
        if (_to == owner) revert ApprovalToOwner();
        if (msg.sender != owner && !isApprovedForAll(owner, msg.sender)) revert NotOwnerOrApprovedForAll(msg.sender);

        _approve(_to, _requestId);
    }

    /// @dev See {IERC721-getApproved}.
    function getApproved(uint256 _requestId) external view override returns (address) {
        if (!_existsAndNotClaimed(_requestId)) revert InvalidRequestId(_requestId);

        return _getTokenApprovals()[_requestId];
    }

    /// @dev See {IERC721-setApprovalForAll}.
    function setApprovalForAll(address _operator, bool _approved) external override {
        _setApprovalForAll(msg.sender, _operator, _approved);
    }

    /// @dev See {IERC721-isApprovedForAll}.
    function isApprovedForAll(address _owner, address _operator) public view override returns (bool) {
        return _getOperatorApprovals()[_owner][_operator];
    }

    /// @dev See {IERC721-safeTransferFrom}.
    function safeTransferFrom(address _from, address _to, uint256 _requestId) external override {
        safeTransferFrom(_from, _to, _requestId, "");
    }

    /// @dev See {IERC721-safeTransferFrom}.
    function safeTransferFrom(address _from, address _to, uint256 _requestId, bytes memory _data) public override {
        _transfer(_from, _to, _requestId);
        if (!_checkOnERC721Received(_from, _to, _requestId, _data)) {
            revert TransferToNonIERC721Receiver(_to);
        }
    }

    /// @dev See {IERC721-transferFrom}.
    function transferFrom(address _from, address _to, uint256 _requestId) external override {
        _transfer(_from, _to, _requestId);
    }

    /// @dev Transfers `_requestId` from `_from` to `_to`.
    ///  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
    ///
    /// Requirements:
    ///
    /// - `_to` cannot be the zero address.
    /// - `_requestId` request must not be claimed and be owned by `_from`.
    /// - `msg.sender` should be approved, or approved for all, or owner
    function _transfer(address _from, address _to, uint256 _requestId) internal {
        if (_to == address(0)) revert TransferToZeroAddress();
        if (_to == _from) revert TransferToThemselves();
        if (_requestId == 0 || _requestId > getLastRequestId()) revert InvalidRequestId(_requestId);

        WithdrawalRequest storage request = _getQueue()[_requestId];
        if (request.claimed) revert RequestAlreadyClaimed(_requestId);

        if (_from != request.owner) revert TransferFromIncorrectOwner(_from, request.owner);
        // here and below we are sure that `_from` is the owner of the request
        address msgSender = msg.sender;
        if (
            !(_from == msgSender || isApprovedForAll(_from, msgSender) || _getTokenApprovals()[_requestId] == msgSender)
        ) {
            revert NotOwnerOrApproved(msgSender);
        }

        delete _getTokenApprovals()[_requestId];
        request.owner = _to;

        assert(_getRequestsByOwner()[_from].remove(_requestId));
        assert(_getRequestsByOwner()[_to].add(_requestId));

        _emitTransfer(_from, _to, _requestId);
    }

    /// @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
    /// The call is not executed if the target address is not a contract.
    ///
    /// @param _from address representing the previous owner of the given token ID
    /// @param _to target address that will receive the tokens
    /// @param _requestId uint256 ID of the token to be transferred
    /// @param _data bytes optional data to send along with the call
    /// @return bool whether the call correctly returned the expected magic value
    function _checkOnERC721Received(address _from, address _to, uint256 _requestId, bytes memory _data)
        private
        returns (bool)
    {
        if (_to.isContract()) {
            try IERC721Receiver(_to).onERC721Received(msg.sender, _from, _requestId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert TransferToNonIERC721Receiver(_to);
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    //
    // Internal getters and setters
    //

    /// @dev a little crutch to emit { Transfer } on request and on claim like ERC721 states
    function _emitTransfer(address _from, address _to, uint256 _requestId) internal override {
        emit Transfer(_from, _to, _requestId);
    }

    /// @dev Returns whether `_requestId` exists and not claimed.
    function _existsAndNotClaimed(uint256 _requestId) internal view returns (bool) {
        return _requestId > 0 && _requestId <= getLastRequestId() && !_getQueue()[_requestId].claimed;
    }

    /// @dev Approve `_to` to operate on `_requestId`
    /// Emits a { Approval } event.
    function _approve(address _to, uint256 _requestId) internal {
        _getTokenApprovals()[_requestId] = _to;
        emit Approval(ownerOf(_requestId), _to, _requestId);
    }

    /// @dev Approve `operator` to operate on all of `owner` tokens
    /// Emits a { ApprovalForAll } event.
    function _setApprovalForAll(address _owner, address _operator, bool _approved) internal {
        if (_owner == _operator) revert ApproveToCaller();
        _getOperatorApprovals()[_owner][_operator] = _approved;
        emit ApprovalForAll(_owner, _operator, _approved);
    }

    /// @dev Decode a `bytes32 to string
    function _toString(bytes32 _sstr) internal pure returns (string memory) {
        uint256 len = _length(_sstr);
        // using `new string(len)` would work locally but is not memory safe.
        string memory str = new string(32);
        /// @solidity memory-safe-assembly
        assembly {
            mstore(str, len)
            mstore(add(str, 0x20), _sstr)
        }
        return str;
    }

    /// @dev encodes string `_str` in bytes32. Reverts if the string length > 31
    function _toBytes32(string memory _str) internal pure returns (bytes32) {
        bytes memory bstr = bytes(_str);
        if (bstr.length > 31) {
            revert StringTooLong(_str);
        }
        return bytes32(uint256(bytes32(bstr)) | bstr.length);
    }

    /// @dev Return the length of a string encoded in bytes32
    function _length(bytes32 _sstr) internal pure returns (uint256) {
        return uint256(_sstr) & 0xFF;
    }

    function _getTokenApprovals() internal pure returns (mapping(uint256 => address) storage) {
        return TOKEN_APPROVALS_POSITION.storageMapUint256Address();
    }

    function _getOperatorApprovals() internal pure returns (mapping(address => mapping(address => bool)) storage) {
        return OPERATOR_APPROVALS_POSITION.storageMapAddressMapAddressBool();
    }

    function _getBaseURI() internal pure returns (BaseURI storage baseURI) {
        bytes32 position = BASE_URI_POSITION;
        assembly {
            baseURI.slot := position
        }
    }

    function _constructTokenUri(uint256 _requestId) internal view returns (string memory) {
        string memory baseURI = _getBaseURI().value;
        if (bytes(baseURI).length == 0) return "";

        // ${baseUri}/${_requestId}?requested=${amount}&created_at=${timestamp}[&finalized=${claimableAmount}]
        string memory uri = string(
            // we have no string.concat in 0.8.9 yet, so we have to do it with bytes.concat
            bytes.concat(
                bytes(baseURI),
                bytes("/"),
                bytes(_requestId.toString()),
                bytes("?requested="),
                bytes(
                    uint256(_getQueue()[_requestId].cumulativeStETH - _getQueue()[_requestId - 1].cumulativeStETH)
                        .toString()
                ),
                bytes("&created_at="),
                bytes(uint256(_getQueue()[_requestId].timestamp).toString())
            )
        );
        bool finalized = _requestId <= getLastFinalizedRequestId();

        if (finalized) {
            uri = string(
                bytes.concat(
                    bytes(uri),
                    bytes("&finalized="),
                    bytes(
                        _getClaimableEther(_requestId, _findCheckpointHint(_requestId, 1, getLastCheckpointIndex()))
                            .toString()
                    )
                )
            );
        }

        return uri;
    }
}