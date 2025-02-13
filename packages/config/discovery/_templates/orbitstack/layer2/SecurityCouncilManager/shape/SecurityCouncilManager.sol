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

enum Cohort {
    FIRST,
    SECOND
}

struct SecurityCouncilData {
    /// @notice Address of the Security Council
    address securityCouncil;
    /// @notice Address of the update action contract that contains the logic for
    ///         updating council membership. Will be delegate called by the upgrade executor
    address updateAction;
    uint256 chainId;
}

struct SecurityCouncilManagerRoles {
    address admin;
    address cohortUpdator;
    address memberAdder;
    address[] memberRemovers;
    address memberRotator;
    address memberReplacer;
}

interface ISecurityCouncilManager {
    // security council cohort errors
    error NotAMember(address member);
    error MemberInCohort(address member, Cohort cohort);
    error CohortFull(Cohort cohort);
    error InvalidNewCohortLength(address[] cohort, uint256 cohortSize);
    error CohortLengthMismatch(address[] cohort1, address[] cohort2);
    error InvalidCohort(Cohort cohort);

    // security council data errors
    error MaxSecurityCouncils(uint256 securityCouncilCount);
    error SecurityCouncilZeroChainID(SecurityCouncilData securiyCouncilData);
    error SecurityCouncilNotInRouter(SecurityCouncilData securiyCouncilData);
    error SecurityCouncilNotInManager(SecurityCouncilData securiyCouncilData);
    error SecurityCouncilAlreadyInRouter(SecurityCouncilData securiyCouncilData);

    /// @notice initialize SecurityCouncilManager.
    /// @param _firstCohort addresses of first cohort
    /// @param _secondCohort addresses of second cohort
    /// @param _securityCouncils data of all security councils to manage
    /// @param _roles permissions for triggering modifications to security councils
    /// @param  _l2CoreGovTimelock timelock for core governance / constitutional proposal
    /// @param _router UpgradeExecRouteBuilder address
    function initialize(
        address[] memory _firstCohort,
        address[] memory _secondCohort,
        SecurityCouncilData[] memory _securityCouncils,
        SecurityCouncilManagerRoles memory _roles,
        address payable _l2CoreGovTimelock,
        UpgradeExecRouteBuilder _router
    ) external;
    /// @notice Replaces a whole cohort.
    /// @dev    Initiaties cross chain messages to update the individual Security Councils.
    /// @param _newCohort   New cohort members to replace existing cohort. Must have 6 members.
    /// @param _cohort      Cohort to replace.
    function replaceCohort(address[] memory _newCohort, Cohort _cohort) external;
    /// @notice Add a member to the specified cohort.
    ///         Cohorts cannot have more than 6 members, so the cohort must have less than 6 in order to call this.
    ///         New member cannot already be a member of either cohort.
    /// @dev    Initiaties cross chain messages to update the individual Security Councils.
    ///         When adding a member, make sure that the key does not conflict with any contenders/nominees of ongoing elections.
    /// @param _newMember   New member to add
    /// @param _cohort      Cohort to add member to
    function addMember(address _newMember, Cohort _cohort) external;
    /// @notice Remove a member.
    /// @dev    Searches both cohorts for the member.
    ///         Initiaties cross chain messages to update the individual Security Councils
    /// @param _member  Member to remove
    function removeMember(address _member) external;
    /// @notice Replace a member in a council - equivalent to removing a member, then adding another in its place.
    ///         Idendities of members should be different.
    ///         Functionality is equivalent to replaceMember,
    ///         though emits a different event to distinguish the security council's intent (different identities).
    /// @dev    Initiaties cross chain messages to update the individual Security Councils.
    ///         When replacing a member, make sure that the key does not conflict with any contenders/nominees of ongoing electoins.
    /// @param _memberToReplace Security Council member to remove
    /// @param _newMember       Security Council member to add in their place
    function replaceMember(address _memberToReplace, address _newMember) external;
    /// @notice Security council member can rotate out their address for a new one; _currentAddress and _newAddress should be of the same identity. Functionality is equivalent to replaceMember, tho emits a different event to distinguish the security council's intent (same identity).
    ///         Rotation must be initiated by the security council.
    /// @dev    Initiaties cross chain messages to update the individual Security Councils.
    ///         When rotating a member, make sure that the key does not conflict with any contenders/nominees of ongoing elections.
    /// @param _currentAddress  Address to rotate out
    /// @param _newAddress      Address to rotate in
    function rotateMember(address _currentAddress, address _newAddress) external;
    /// @notice Is the account a member of the first cohort
    function firstCohortIncludes(address account) external view returns (bool);
    /// @notice Is the account a member of the second cohort
    function secondCohortIncludes(address account) external view returns (bool);
    /// @notice Is the account a member of the specified cohort
    function cohortIncludes(Cohort cohort, address account) external view returns (bool);
    /// @notice All members of the first cohort
    function getFirstCohort() external view returns (address[] memory);
    /// @notice All members of the second cohort
    function getSecondCohort() external view returns (address[] memory);
    /// @notice All members of both cohorts
    function getBothCohorts() external view returns (address[] memory);
    /// @notice Length of security councils array
    function securityCouncilsLength() external view returns (uint256);
    /// @notice Size of cohort under ordinary circumstances
    function cohortSize() external view returns (uint256);
    /// @notice Add new security council to be included in security council management system.
    /// @param _securityCouncilData Security council info
    function addSecurityCouncil(SecurityCouncilData memory _securityCouncilData) external;
    /// @notice Remove security council from management system.
    /// @param _securityCouncilData   security council to be removed
    function removeSecurityCouncil(SecurityCouncilData memory _securityCouncilData)
        external
        returns (bool);
    /// @notice UpgradeExecRouteBuilder is immutable, so in lieu of upgrading it, it can be redeployed and reset here
    /// @param _router new router address
    function setUpgradeExecRouteBuilder(UpgradeExecRouteBuilder _router) external;
    /// @notice Gets the data that will be used to update each of the security councils
    /// @param nonce The nonce used to generate the timelock salts
    /// @return The new members to be added to the councils
    /// @return The address of the contract that will be called by the l2 timelock
    /// @return The data that will be called from the l2 timelock
    function getScheduleUpdateInnerData(uint256 nonce)
        external
        view
        returns (address[] memory, address, bytes memory);
    /// @notice Generate the salt used in the timelocks when scheduling an update
    /// @param _members The new members to be added
    /// @param nonce    The manager nonce to make the salt unique - current nonce can be found by calling updateNonce
    function generateSalt(address[] memory _members, uint256 nonce)
        external
        pure
        returns (bytes32);
    /// @notice Each update increments an internal nonce that keeps updates unique, current value stored here
    function updateNonce() external returns (uint256);
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

interface IAccessControlUpgradeable {
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

interface IERC165Upgradeable {
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

abstract contract ERC165Upgradeable is Initializable, IERC165Upgradeable {
    function __ERC165_init() internal onlyInitializing {
    }

    function __ERC165_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165Upgradeable).interfaceId;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

library StringsUpgradeable {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

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

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }
}

abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
    function __AccessControl_init() internal onlyInitializing {
    }

    function __AccessControl_init_unchained() internal onlyInitializing {
    }
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;

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
        _checkRole(role);
        _;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        return _roles[role].members[account];
    }

    /**
     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
     * Overriding this function changes the behavior of the {onlyRole} modifier.
     *
     * Format of the revert message is described in {_checkRole}.
     *
     * _Available since v4.6._
     */
    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    /**
     * @dev Revert with a standard message if `account` is missing `role`.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     */
    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        StringsUpgradeable.toHexString(uint160(account), 20),
                        " is missing role ",
                        StringsUpgradeable.toHexString(uint256(role), 32)
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
    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
        return _roles[role].adminRole;
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
     *
     * May emit a {RoleGranted} event.
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
     *
     * May emit a {RoleRevoked} event.
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
     *
     * May emit a {RoleRevoked} event.
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
     * May emit a {RoleGranted} event.
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
        _roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _roles[role].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
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

contract SecurityCouncilManager is
    Initializable,
    AccessControlUpgradeable,
    ISecurityCouncilManager
{
    event CohortReplaced(address[] newCohort, Cohort indexed cohort);
    event MemberAdded(address indexed newMember, Cohort indexed cohort);
    event MemberRemoved(address indexed member, Cohort indexed cohort);
    event MemberReplaced(address indexed replacedMember, address indexed newMember, Cohort cohort);
    event MemberRotated(address indexed replacedAddress, address indexed newAddress, Cohort cohort);
    event SecurityCouncilAdded(
        address indexed securityCouncil,
        address indexed updateAction,
        uint256 securityCouncilsLength
    );
    event SecurityCouncilRemoved(
        address indexed securityCouncil,
        address indexed updateAction,
        uint256 securityCouncilsLength
    );
    event UpgradeExecRouteBuilderSet(address indexed UpgradeExecRouteBuilder);

    // The Security Council members are separated into two cohorts, allowing a whole cohort to be replaced, as
    // specified by the Arbitrum Constitution.
    // These two cohort arrays contain the source of truth for the members of the Security Council. When a membership
    // change needs to be made, a change to these arrays is first made here locally, then pushed to each of the Security Councils
    // A member cannot be in both cohorts at the same time
    address[] internal firstCohort;
    address[] internal secondCohort;

    /// @notice Address of the l2 timelock used by core governance
    address payable public l2CoreGovTimelock;

    /// @notice The list of Security Councils under management. Any changes to the cohorts in this manager
    ///         will be pushed to each of these security councils, ensuring that they all stay in sync
    SecurityCouncilData[] public securityCouncils;

    /// @notice Address of UpgradeExecRouteBuilder. Used to help create security council updates
    UpgradeExecRouteBuilder public router;

    /// @notice Maximum possible number of Security Councils to manage
    /// @dev    Since the councils array will be iterated this provides a safety check to make too many Sec Councils
    ///         aren't added to the array.
    uint256 public immutable MAX_SECURITY_COUNCILS = 500;

    /// @notice Nonce to ensure that scheduled updates create unique entries in the timelocks
    uint256 public updateNonce;

    /// @notice Size of cohort under ordinary circumstances
    uint256 public cohortSize;

    /// @notice Magic value used by the L1 timelock to indicate that a retryable ticket should be created
    ///         Value is defined in L1ArbitrumTimelock contract https://etherscan.io/address/0xE6841D92B0C345144506576eC13ECf5103aC7f49#readProxyContract#F5
    address public constant RETRYABLE_TICKET_MAGIC = 0xa723C008e76E379c55599D2E4d93879BeaFDa79C;

    bytes32 public constant COHORT_REPLACER_ROLE = keccak256("COHORT_REPLACER");
    bytes32 public constant MEMBER_ADDER_ROLE = keccak256("MEMBER_ADDER");
    bytes32 public constant MEMBER_REPLACER_ROLE = keccak256("MEMBER_REPLACER");
    bytes32 public constant MEMBER_ROTATOR_ROLE = keccak256("MEMBER_ROTATOR");
    bytes32 public constant MEMBER_REMOVER_ROLE = keccak256("MEMBER_REMOVER");

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address[] memory _firstCohort,
        address[] memory _secondCohort,
        SecurityCouncilData[] memory _securityCouncils,
        SecurityCouncilManagerRoles memory _roles,
        address payable _l2CoreGovTimelock,
        UpgradeExecRouteBuilder _router
    ) external initializer {
        if (_firstCohort.length != _secondCohort.length) {
            revert CohortLengthMismatch(_firstCohort, _secondCohort);
        }
        firstCohort = _firstCohort;
        secondCohort = _secondCohort;
        cohortSize = _firstCohort.length;
        _grantRole(DEFAULT_ADMIN_ROLE, _roles.admin);
        _grantRole(COHORT_REPLACER_ROLE, _roles.cohortUpdator);
        _grantRole(MEMBER_ADDER_ROLE, _roles.memberAdder);
        for (uint256 i = 0; i < _roles.memberRemovers.length; i++) {
            _grantRole(MEMBER_REMOVER_ROLE, _roles.memberRemovers[i]);
        }
        _grantRole(MEMBER_ROTATOR_ROLE, _roles.memberRotator);
        _grantRole(MEMBER_REPLACER_ROLE, _roles.memberReplacer);

        if (!Address.isContract(_l2CoreGovTimelock)) {
            revert NotAContract({account: _l2CoreGovTimelock});
        }
        l2CoreGovTimelock = _l2CoreGovTimelock;

        _setUpgradeExecRouteBuilder(_router);
        for (uint256 i = 0; i < _securityCouncils.length; i++) {
            _addSecurityCouncil(_securityCouncils[i]);
        }
    }

    /// @inheritdoc ISecurityCouncilManager
    function replaceCohort(address[] memory _newCohort, Cohort _cohort)
        external
        onlyRole(COHORT_REPLACER_ROLE)
    {
        if (_newCohort.length != cohortSize) {
            revert InvalidNewCohortLength({cohort: _newCohort, cohortSize: cohortSize});
        }

        // delete the old cohort
        _cohort == Cohort.FIRST ? delete firstCohort : delete secondCohort;

        for (uint256 i = 0; i < _newCohort.length; i++) {
            _addMemberToCohortArray(_newCohort[i], _cohort);
        }

        _scheduleUpdate();
        emit CohortReplaced(_newCohort, _cohort);
    }

    function _addMemberToCohortArray(address _newMember, Cohort _cohort) internal {
        if (_newMember == address(0)) {
            revert ZeroAddress();
        }
        address[] storage cohort = _cohort == Cohort.FIRST ? firstCohort : secondCohort;
        if (cohort.length == cohortSize) {
            revert CohortFull({cohort: _cohort});
        }
        if (firstCohortIncludes(_newMember)) {
            revert MemberInCohort({member: _newMember, cohort: Cohort.FIRST});
        }
        if (secondCohortIncludes(_newMember)) {
            revert MemberInCohort({member: _newMember, cohort: Cohort.SECOND});
        }

        cohort.push(_newMember);
    }

    function _removeMemberFromCohortArray(address _member) internal returns (Cohort) {
        for (uint256 i = 0; i < 2; i++) {
            address[] storage cohort = i == 0 ? firstCohort : secondCohort;
            for (uint256 j = 0; j < cohort.length; j++) {
                if (_member == cohort[j]) {
                    cohort[j] = cohort[cohort.length - 1];
                    cohort.pop();
                    return i == 0 ? Cohort.FIRST : Cohort.SECOND;
                }
            }
        }
        revert NotAMember({member: _member});
    }

    /// @inheritdoc ISecurityCouncilManager
    function addMember(address _newMember, Cohort _cohort) external onlyRole(MEMBER_ADDER_ROLE) {
        _addMemberToCohortArray(_newMember, _cohort);
        _scheduleUpdate();
        emit MemberAdded(_newMember, _cohort);
    }

    /// @inheritdoc ISecurityCouncilManager
    function removeMember(address _member) external onlyRole(MEMBER_REMOVER_ROLE) {
        if (_member == address(0)) {
            revert ZeroAddress();
        }
        Cohort cohort = _removeMemberFromCohortArray(_member);
        _scheduleUpdate();
        emit MemberRemoved({member: _member, cohort: cohort});
    }

    /// @inheritdoc ISecurityCouncilManager
    function replaceMember(address _memberToReplace, address _newMember)
        external
        onlyRole(MEMBER_REPLACER_ROLE)
    {
        Cohort cohort = _swapMembers(_memberToReplace, _newMember);
        emit MemberReplaced({
            replacedMember: _memberToReplace,
            newMember: _newMember,
            cohort: cohort
        });
    }

    /// @inheritdoc ISecurityCouncilManager
    function rotateMember(address _currentAddress, address _newAddress)
        external
        onlyRole(MEMBER_ROTATOR_ROLE)
    {
        Cohort cohort = _swapMembers(_currentAddress, _newAddress);
        emit MemberRotated({
            replacedAddress: _currentAddress,
            newAddress: _newAddress,
            cohort: cohort
        });
    }

    function _swapMembers(address _addressToRemove, address _addressToAdd)
        internal
        returns (Cohort)
    {
        if (_addressToRemove == address(0) || _addressToAdd == address(0)) {
            revert ZeroAddress();
        }
        Cohort cohort = _removeMemberFromCohortArray(_addressToRemove);
        _addMemberToCohortArray(_addressToAdd, cohort);
        _scheduleUpdate();
        return cohort;
    }

    function _addSecurityCouncil(SecurityCouncilData memory _securityCouncilData) internal {
        if (securityCouncils.length == MAX_SECURITY_COUNCILS) {
            revert MaxSecurityCouncils(securityCouncils.length);
        }

        if (
            _securityCouncilData.updateAction == address(0)
                || _securityCouncilData.securityCouncil == address(0)
        ) {
            revert ZeroAddress();
        }

        if (_securityCouncilData.chainId == 0) {
            revert SecurityCouncilZeroChainID(_securityCouncilData);
        }

        if (!router.upExecLocationExists(_securityCouncilData.chainId)) {
            revert SecurityCouncilNotInRouter(_securityCouncilData);
        }

        for (uint256 i = 0; i < securityCouncils.length; i++) {
            SecurityCouncilData storage existantSecurityCouncil = securityCouncils[i];

            if (
                existantSecurityCouncil.chainId == _securityCouncilData.chainId
                    && existantSecurityCouncil.securityCouncil == _securityCouncilData.securityCouncil
            ) {
                revert SecurityCouncilAlreadyInRouter(_securityCouncilData);
            }
        }

        securityCouncils.push(_securityCouncilData);
        emit SecurityCouncilAdded(
            _securityCouncilData.securityCouncil,
            _securityCouncilData.updateAction,
            securityCouncils.length
        );
    }

    /// @inheritdoc ISecurityCouncilManager
    function addSecurityCouncil(SecurityCouncilData memory _securityCouncilData)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _addSecurityCouncil(_securityCouncilData);
    }

    /// @inheritdoc ISecurityCouncilManager
    function removeSecurityCouncil(SecurityCouncilData memory _securityCouncilData)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        for (uint256 i = 0; i < securityCouncils.length; i++) {
            SecurityCouncilData storage securityCouncilData = securityCouncils[i];
            if (
                securityCouncilData.securityCouncil == _securityCouncilData.securityCouncil
                    && securityCouncilData.chainId == _securityCouncilData.chainId
                    && securityCouncilData.updateAction == _securityCouncilData.updateAction
            ) {
                SecurityCouncilData storage lastSecurityCouncil =
                    securityCouncils[securityCouncils.length - 1];

                securityCouncils[i] = lastSecurityCouncil;
                securityCouncils.pop();
                emit SecurityCouncilRemoved(
                    securityCouncilData.securityCouncil,
                    securityCouncilData.updateAction,
                    securityCouncils.length
                );
                return true;
            }
        }
        revert SecurityCouncilNotInManager(_securityCouncilData);
    }

    /// @inheritdoc ISecurityCouncilManager
    function setUpgradeExecRouteBuilder(UpgradeExecRouteBuilder _router)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setUpgradeExecRouteBuilder(_router);
    }

    function _setUpgradeExecRouteBuilder(UpgradeExecRouteBuilder _router) internal {
        address routerAddress = address(_router);

        if (!Address.isContract(routerAddress)) {
            revert NotAContract({account: routerAddress});
        }

        router = _router;
        emit UpgradeExecRouteBuilderSet(routerAddress);
    }

    /// @inheritdoc ISecurityCouncilManager
    function getFirstCohort() external view returns (address[] memory) {
        return firstCohort;
    }

    /// @inheritdoc ISecurityCouncilManager
    function getSecondCohort() external view returns (address[] memory) {
        return secondCohort;
    }

    /// @inheritdoc ISecurityCouncilManager
    function getBothCohorts() public view returns (address[] memory) {
        address[] memory members = new address[](firstCohort.length + secondCohort.length);
        for (uint256 i = 0; i < firstCohort.length; i++) {
            members[i] = firstCohort[i];
        }
        for (uint256 i = 0; i < secondCohort.length; i++) {
            members[firstCohort.length + i] = secondCohort[i];
        }
        return members;
    }

    /// @inheritdoc ISecurityCouncilManager
    function securityCouncilsLength() public view returns (uint256) {
        return securityCouncils.length;
    }

    /// @inheritdoc ISecurityCouncilManager
    function firstCohortIncludes(address account) public view returns (bool) {
        return cohortIncludes(Cohort.FIRST, account);
    }

    /// @inheritdoc ISecurityCouncilManager
    function secondCohortIncludes(address account) public view returns (bool) {
        return cohortIncludes(Cohort.SECOND, account);
    }

    /// @inheritdoc ISecurityCouncilManager
    function cohortIncludes(Cohort cohort, address account) public view returns (bool) {
        address[] memory cohortMembers = cohort == Cohort.FIRST ? firstCohort : secondCohort;
        return SecurityCouncilMgmtUtils.isInArray(account, cohortMembers);
    }

    /// @inheritdoc ISecurityCouncilManager
    function generateSalt(address[] memory _members, uint256 nonce)
        external
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(_members, nonce));
    }

    /// @inheritdoc ISecurityCouncilManager
    function getScheduleUpdateInnerData(uint256 nonce)
        public
        view
        returns (address[] memory, address, bytes memory)
    {
        // build a union array of security council members
        address[] memory newMembers = getBothCohorts();

        // build batch call to L1 timelock
        address[] memory actionAddresses = new address[](securityCouncils.length);
        bytes[] memory actionDatas = new bytes[](securityCouncils.length);
        uint256[] memory chainIds = new uint256[](securityCouncils.length);

        for (uint256 i = 0; i < securityCouncils.length; i++) {
            SecurityCouncilData memory securityCouncilData = securityCouncils[i];
            actionAddresses[i] = securityCouncilData.updateAction;
            chainIds[i] = securityCouncilData.chainId;
            actionDatas[i] = abi.encodeWithSelector(
                SecurityCouncilMemberSyncAction.perform.selector,
                securityCouncilData.securityCouncil,
                newMembers,
                nonce
            );
        }

        // unique salt used for replay protection in the L1 timelock
        bytes32 salt = this.generateSalt(newMembers, nonce);
        (address to, bytes memory data) = router.createActionRouteData(
            chainIds,
            actionAddresses,
            new uint256[](securityCouncils.length), // all values are always 0
            actionDatas,
            0,
            salt
        );

        return (newMembers, to, data);
    }

    /// @dev Create a union of the second and first cohort, then update all Security Councils under management with that unioned array.
    ///      Updates will need to be scheduled through timelocks and target upgrade executors
    function _scheduleUpdate() internal {
        // always update the nonce
        // this is used to ensure that proposals in the timelocks are unique
        // and calls to the upgradeExecutors are in the correct order
        updateNonce++;
        (address[] memory newMembers, address to, bytes memory data) =
            getScheduleUpdateInnerData(updateNonce);

        ArbitrumTimelock(l2CoreGovTimelock).schedule({
            target: to, // ArbSys address - this will trigger a call from L2->L1
            value: 0,
            // call to ArbSys.sendTxToL1; target the L1 timelock with the calldata previously constructed
            data: data,
            predecessor: bytes32(0),
            // must be unique as the proposal hash is used for replay protection in the L2 timelock
            // we cant be sure another proposal wont use this salt, and the same target + data
            // but in that case the proposal will do what we want it to do anyway
            // this can however block the execution of the election - so in this case the
            // Security Council would need to unblock it by setting the election to executed state
            // in the Member Election governor
            salt: this.generateSalt(newMembers, updateNonce),
            delay: ArbitrumTimelock(l2CoreGovTimelock).getMinDelay()
        });
    }
    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */

    uint256[43] private __gap;
}