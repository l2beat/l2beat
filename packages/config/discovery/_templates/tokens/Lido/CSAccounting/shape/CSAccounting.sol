// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library Address {
    /**
     * @dev The ETH balance of the account is not enough to perform the operation.
     */
    error AddressInsufficientBalance(address account);

    /**
     * @dev There's no code at `target` (it is not a contract).
     */
    error AddressEmptyCode(address target);

    /**
     * @dev A call to an address target failed. The target may have reverted.
     */
    error FailedInnerCall();

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason or custom error, it is bubbled
     * up by this function (like regular Solidity function calls). However, if
     * the call reverted with no returned reason, this function reverts with a
     * {FailedInnerCall} error.
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
     * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
     * unsuccessful call.
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) internal view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            // only check if target is a contract if the call was successful and the return data is empty
            // otherwise we already know that it was a contract
            if (returndata.length == 0 && target.code.length == 0) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
     * revert reason or with a default {FailedInnerCall} error.
     */
    function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            return returndata;
        }
    }

    /**
     * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
     */
    function _revert(bytes memory returndata) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}

library SafeERC20 {
    using Address for address;

    /**
     * @dev An operation with an ERC20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeCall(token.approve, (spender, value));

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeCall(token.approve, (spender, 0)));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data);
        if (returndata.length != 0 && !abi.decode(returndata, (bool))) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return success && (returndata.length == 0 || abi.decode(returndata, (bool))) && address(token).code.length > 0;
    }
}

library AssetRecovererLib {
    using SafeERC20 for IERC20;

    /**
     * @dev Allows the sender to recover Ether held by the contract.
     * Emits an EtherRecovered event upon success.
     */
    function recoverEther() external {
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{ value: amount }("");
        if (!success) revert IAssetRecovererLib.FailedToSendEther();
        emit IAssetRecovererLib.EtherRecovered(msg.sender, amount);
    }

    /**
     * @dev Allows the sender to recover ERC20 tokens held by the contract.
     * @param token The address of the ERC20 token to recover.
     * @param amount The amount of the ERC20 token to recover.
     * Emits an ERC20Recovered event upon success.
     */
    function recoverERC20(address token, uint256 amount) external {
        IERC20(token).safeTransfer(msg.sender, amount);
        emit IAssetRecovererLib.ERC20Recovered(token, msg.sender, amount);
    }

    /**
     * @dev Allows the sender to recover stETH shares held by the contract.
     * The use of a separate method for stETH is to avoid rounding problems when converting shares to stETH.
     * @param lido The address of the Lido contract.
     * @param shares The amount of stETH shares to recover.
     * Emits an StETHRecovered event upon success.
     */
    function recoverStETHShares(address lido, uint256 shares) external {
        ILido(lido).transferShares(msg.sender, shares);
        emit IAssetRecovererLib.StETHSharesRecovered(msg.sender, shares);
    }

    /**
     * @dev Allows the sender to recover ERC721 tokens held by the contract.
     * @param token The address of the ERC721 token to recover.
     * @param tokenId The token ID of the ERC721 token to recover.
     * Emits an ERC721Recovered event upon success.
     */
    function recoverERC721(address token, uint256 tokenId) external {
        IERC721(token).safeTransferFrom(address(this), msg.sender, tokenId);
        emit IAssetRecovererLib.ERC721Recovered(token, tokenId, msg.sender);
    }

    /**
     * @dev Allows the sender to recover ERC1155 tokens held by the contract.
     * @param token The address of the ERC1155 token to recover.
     * @param tokenId The token ID of the ERC1155 token to recover.
     * Emits an ERC1155Recovered event upon success.
     */
    function recoverERC1155(address token, uint256 tokenId) external {
        uint256 amount = IERC1155(token).balanceOf(address(this), tokenId);
        IERC1155(token).safeTransferFrom({
            from: address(this),
            to: msg.sender,
            id: tokenId,
            value: amount,
            data: ""
        });
        emit IAssetRecovererLib.ERC1155Recovered(
            token,
            tokenId,
            msg.sender,
            amount
        );
    }
}

abstract contract AssetRecoverer {
    /// @dev Allows sender to recover Ether held by the contract
    /// Emits an EtherRecovered event upon success
    function recoverEther() external {
        _onlyRecoverer();
        AssetRecovererLib.recoverEther();
    }

    /// @dev Allows sender to recover ERC20 tokens held by the contract
    /// @param token The address of the ERC20 token to recover
    /// Emits an ERC20Recovered event upon success
    /// Optionally, the inheriting contract can override this function to add additional restrictions
    function recoverERC20(address token, uint256 amount) external virtual {
        _onlyRecoverer();
        AssetRecovererLib.recoverERC20(token, amount);
    }

    /// @dev Allows sender to recover ERC721 tokens held by the contract
    /// @param token The address of the ERC721 token to recover
    /// @param tokenId The token ID of the ERC721 token to recover
    /// Emits an ERC721Recovered event upon success
    function recoverERC721(address token, uint256 tokenId) external {
        _onlyRecoverer();
        AssetRecovererLib.recoverERC721(token, tokenId);
    }

    /// @dev Allows sender to recover ERC1155 tokens held by the contract.
    /// @param token The address of the ERC1155 token to recover.
    /// @param tokenId The token ID of the ERC1155 token to recover.
    /// Emits an ERC1155Recovered event upon success.
    function recoverERC1155(address token, uint256 tokenId) external {
        _onlyRecoverer();
        AssetRecovererLib.recoverERC1155(token, tokenId);
    }

    /// @dev Guardian to restrict access to the recover methods.
    ///      Should be implemented by the inheriting contract
    function _onlyRecoverer() internal view virtual;
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

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

interface IAccessControl {
    /**
     * @dev The `account` is missing a role.
     */
    error AccessControlUnauthorizedAccount(address account, bytes32 neededRole);

    /**
     * @dev The caller of a function is not the expected one.
     *
     * NOTE: Don't confuse with {AccessControlUnauthorizedAccount}.
     */
    error AccessControlBadConfirmation();

    /**
     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     *
     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
     * {RoleAdminChanged} not being emitted signaling this.
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
     * - the caller must be `callerConfirmation`.
     */
    function renounceRole(bytes32 role, address callerConfirmation) external;
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

abstract contract ERC165Upgradeable is Initializable, IERC165 {
    function __ERC165_init() internal onlyInitializing {
    }

    function __ERC165_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}

abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControl, ERC165Upgradeable {
    struct RoleData {
        mapping(address account => bool) hasRole;
        bytes32 adminRole;
    }

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;


    /// @custom:storage-location erc7201:openzeppelin.storage.AccessControl
    struct AccessControlStorage {
        mapping(bytes32 role => RoleData) _roles;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.AccessControl")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant AccessControlStorageLocation = 0x02dd7bc7dec4dceedda775e58dd541e08a116c6c53815c0bd028192f7b626800;

    function _getAccessControlStorage() private pure returns (AccessControlStorage storage $) {
        assembly {
            $.slot := AccessControlStorageLocation
        }
    }

    /**
     * @dev Modifier that checks that an account has a specific role. Reverts
     * with an {AccessControlUnauthorizedAccount} error including the required role.
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function __AccessControl_init() internal onlyInitializing {
    }

    function __AccessControl_init_unchained() internal onlyInitializing {
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
    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
        AccessControlStorage storage $ = _getAccessControlStorage();
        return $._roles[role].hasRole[account];
    }

    /**
     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
     * is missing `role`. Overriding this function changes the behavior of the {onlyRole} modifier.
     */
    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    /**
     * @dev Reverts with an {AccessControlUnauthorizedAccount} error if `account`
     * is missing `role`.
     */
    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert AccessControlUnauthorizedAccount(account, role);
        }
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32) {
        AccessControlStorage storage $ = _getAccessControlStorage();
        return $._roles[role].adminRole;
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
    function grantRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
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
    function revokeRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role)) {
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
     * - the caller must be `callerConfirmation`.
     *
     * May emit a {RoleRevoked} event.
     */
    function renounceRole(bytes32 role, address callerConfirmation) public virtual {
        if (callerConfirmation != _msgSender()) {
            revert AccessControlBadConfirmation();
        }

        _revokeRole(role, callerConfirmation);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     *
     * Emits a {RoleAdminChanged} event.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        AccessControlStorage storage $ = _getAccessControlStorage();
        bytes32 previousAdminRole = getRoleAdmin(role);
        $._roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /**
     * @dev Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(bytes32 role, address account) internal virtual returns (bool) {
        AccessControlStorage storage $ = _getAccessControlStorage();
        if (!hasRole(role, account)) {
            $._roles[role].hasRole[account] = true;
            emit RoleGranted(role, account, _msgSender());
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Attempts to revoke `role` to `account` and returns a boolean indicating if `role` was revoked.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(bytes32 role, address account) internal virtual returns (bool) {
        AccessControlStorage storage $ = _getAccessControlStorage();
        if (hasRole(role, account)) {
            $._roles[role].hasRole[account] = false;
            emit RoleRevoked(role, account, _msgSender());
            return true;
        } else {
            return false;
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
        // Position is the index of the value in the `values` array plus 1.
        // Position 0 is used to mean a value is not in the set.
        mapping(bytes32 value => uint256) _positions;
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
            set._positions[value] = set._values.length;
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
        // We cache the value's position to prevent multiple reads from the same storage slot
        uint256 position = set._positions[value];

        if (position != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 valueIndex = position - 1;
            uint256 lastIndex = set._values.length - 1;

            if (valueIndex != lastIndex) {
                bytes32 lastValue = set._values[lastIndex];

                // Move the lastValue to the index where the value to delete is
                set._values[valueIndex] = lastValue;
                // Update the tracked position of the lastValue (that was just moved)
                set._positions[lastValue] = position;
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the tracked position for the deleted slot
            delete set._positions[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._positions[value] != 0;
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
        bytes32[] memory store = _values(set._inner);
        bytes32[] memory result;

        /// @solidity memory-safe-assembly
        assembly {
            result := store
        }

        return result;
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
     * @dev Returns the number of values in the set. O(1).
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

abstract contract AccessControlEnumerableUpgradeable is Initializable, IAccessControlEnumerable, AccessControlUpgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;

    /// @custom:storage-location erc7201:openzeppelin.storage.AccessControlEnumerable
    struct AccessControlEnumerableStorage {
        mapping(bytes32 role => EnumerableSet.AddressSet) _roleMembers;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.AccessControlEnumerable")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant AccessControlEnumerableStorageLocation = 0xc1f6fe24621ce81ec5827caf0253cadb74709b061630e6b55e82371705932000;

    function _getAccessControlEnumerableStorage() private pure returns (AccessControlEnumerableStorage storage $) {
        assembly {
            $.slot := AccessControlEnumerableStorageLocation
        }
    }

    function __AccessControlEnumerable_init() internal onlyInitializing {
    }

    function __AccessControlEnumerable_init_unchained() internal onlyInitializing {
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
    function getRoleMember(bytes32 role, uint256 index) public view virtual returns (address) {
        AccessControlEnumerableStorage storage $ = _getAccessControlEnumerableStorage();
        return $._roleMembers[role].at(index);
    }

    /**
     * @dev Returns the number of accounts that have `role`. Can be used
     * together with {getRoleMember} to enumerate all bearers of a role.
     */
    function getRoleMemberCount(bytes32 role) public view virtual returns (uint256) {
        AccessControlEnumerableStorage storage $ = _getAccessControlEnumerableStorage();
        return $._roleMembers[role].length();
    }

    /**
     * @dev Overload {AccessControl-_grantRole} to track enumerable memberships
     */
    function _grantRole(bytes32 role, address account) internal virtual override returns (bool) {
        AccessControlEnumerableStorage storage $ = _getAccessControlEnumerableStorage();
        bool granted = super._grantRole(role, account);
        if (granted) {
            $._roleMembers[role].add(account);
        }
        return granted;
    }

    /**
     * @dev Overload {AccessControl-_revokeRole} to track enumerable memberships
     */
    function _revokeRole(bytes32 role, address account) internal virtual override returns (bool) {
        AccessControlEnumerableStorage storage $ = _getAccessControlEnumerableStorage();
        bool revoked = super._revokeRole(role, account);
        if (revoked) {
            $._roleMembers[role].remove(account);
        }
        return revoked;
    }
}

library UnstructuredStorage {
    function setStorageAddress(bytes32 position, address data) internal {
        assembly {
            sstore(position, data)
        }
    }

    function setStorageUint256(bytes32 position, uint256 data) internal {
        assembly {
            sstore(position, data)
        }
    }

    function getStorageAddress(
        bytes32 position
    ) internal view returns (address data) {
        assembly {
            data := sload(position)
        }
    }

    function getStorageUint256(
        bytes32 position
    ) internal view returns (uint256 data) {
        assembly {
            data := sload(position)
        }
    }
}

contract PausableUntil {
    using UnstructuredStorage for bytes32;

    /// Contract resume/pause control storage slot
    bytes32 internal constant RESUME_SINCE_TIMESTAMP_POSITION =
        keccak256("lido.PausableUntil.resumeSinceTimestamp");
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

    /// @notice Returns one of:
    ///  - PAUSE_INFINITELY if paused infinitely returns
    ///  - first second when get contract get resumed if paused for specific duration
    ///  - some timestamp in past if not paused
    function getResumeSinceTimestamp() external view returns (uint256) {
        return RESUME_SINCE_TIMESTAMP_POSITION.getStorageUint256();
    }

    /// @notice Returns whether the contract is paused
    function isPaused() public view returns (bool) {
        return
            block.timestamp <
            RESUME_SINCE_TIMESTAMP_POSITION.getStorageUint256();
    }

    function _resume() internal {
        _checkPaused();
        RESUME_SINCE_TIMESTAMP_POSITION.setStorageUint256(block.timestamp);
        emit Resumed();
    }

    function _pauseFor(uint256 duration) internal {
        _checkResumed();
        if (duration == 0) revert ZeroPauseDuration();

        uint256 resumeSince;
        if (duration == PAUSE_INFINITELY) {
            resumeSince = PAUSE_INFINITELY;
        } else {
            resumeSince = block.timestamp + duration;
        }
        _setPausedState(resumeSince);
    }

    function _pauseUntil(uint256 pauseUntilInclusive) internal {
        _checkResumed();
        if (pauseUntilInclusive < block.timestamp)
            revert PauseUntilMustBeInFuture();

        uint256 resumeSince;
        if (pauseUntilInclusive != PAUSE_INFINITELY) {
            resumeSince = pauseUntilInclusive + 1;
        } else {
            resumeSince = PAUSE_INFINITELY;
        }
        _setPausedState(resumeSince);
    }

    function _setPausedState(uint256 resumeSince) internal {
        RESUME_SINCE_TIMESTAMP_POSITION.setStorageUint256(resumeSince);
        if (resumeSince == PAUSE_INFINITELY) {
            emit Paused(PAUSE_INFINITELY);
        } else {
            emit Paused(resumeSince - block.timestamp);
        }
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
}

library SafeCast {
    /**
     * @dev Value doesn't fit in an uint of `bits` size.
     */
    error SafeCastOverflowedUintDowncast(uint8 bits, uint256 value);

    /**
     * @dev An int value doesn't fit in an uint of `bits` size.
     */
    error SafeCastOverflowedIntToUint(int256 value);

    /**
     * @dev Value doesn't fit in an int of `bits` size.
     */
    error SafeCastOverflowedIntDowncast(uint8 bits, int256 value);

    /**
     * @dev An uint value doesn't fit in an int of `bits` size.
     */
    error SafeCastOverflowedUintToInt(uint256 value);

    /**
     * @dev Returns the downcasted uint248 from uint256, reverting on
     * overflow (when the input is greater than largest uint248).
     *
     * Counterpart to Solidity's `uint248` operator.
     *
     * Requirements:
     *
     * - input must fit into 248 bits
     */
    function toUint248(uint256 value) internal pure returns (uint248) {
        if (value > type(uint248).max) {
            revert SafeCastOverflowedUintDowncast(248, value);
        }
        return uint248(value);
    }

    /**
     * @dev Returns the downcasted uint240 from uint256, reverting on
     * overflow (when the input is greater than largest uint240).
     *
     * Counterpart to Solidity's `uint240` operator.
     *
     * Requirements:
     *
     * - input must fit into 240 bits
     */
    function toUint240(uint256 value) internal pure returns (uint240) {
        if (value > type(uint240).max) {
            revert SafeCastOverflowedUintDowncast(240, value);
        }
        return uint240(value);
    }

    /**
     * @dev Returns the downcasted uint232 from uint256, reverting on
     * overflow (when the input is greater than largest uint232).
     *
     * Counterpart to Solidity's `uint232` operator.
     *
     * Requirements:
     *
     * - input must fit into 232 bits
     */
    function toUint232(uint256 value) internal pure returns (uint232) {
        if (value > type(uint232).max) {
            revert SafeCastOverflowedUintDowncast(232, value);
        }
        return uint232(value);
    }

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
        if (value > type(uint224).max) {
            revert SafeCastOverflowedUintDowncast(224, value);
        }
        return uint224(value);
    }

    /**
     * @dev Returns the downcasted uint216 from uint256, reverting on
     * overflow (when the input is greater than largest uint216).
     *
     * Counterpart to Solidity's `uint216` operator.
     *
     * Requirements:
     *
     * - input must fit into 216 bits
     */
    function toUint216(uint256 value) internal pure returns (uint216) {
        if (value > type(uint216).max) {
            revert SafeCastOverflowedUintDowncast(216, value);
        }
        return uint216(value);
    }

    /**
     * @dev Returns the downcasted uint208 from uint256, reverting on
     * overflow (when the input is greater than largest uint208).
     *
     * Counterpart to Solidity's `uint208` operator.
     *
     * Requirements:
     *
     * - input must fit into 208 bits
     */
    function toUint208(uint256 value) internal pure returns (uint208) {
        if (value > type(uint208).max) {
            revert SafeCastOverflowedUintDowncast(208, value);
        }
        return uint208(value);
    }

    /**
     * @dev Returns the downcasted uint200 from uint256, reverting on
     * overflow (when the input is greater than largest uint200).
     *
     * Counterpart to Solidity's `uint200` operator.
     *
     * Requirements:
     *
     * - input must fit into 200 bits
     */
    function toUint200(uint256 value) internal pure returns (uint200) {
        if (value > type(uint200).max) {
            revert SafeCastOverflowedUintDowncast(200, value);
        }
        return uint200(value);
    }

    /**
     * @dev Returns the downcasted uint192 from uint256, reverting on
     * overflow (when the input is greater than largest uint192).
     *
     * Counterpart to Solidity's `uint192` operator.
     *
     * Requirements:
     *
     * - input must fit into 192 bits
     */
    function toUint192(uint256 value) internal pure returns (uint192) {
        if (value > type(uint192).max) {
            revert SafeCastOverflowedUintDowncast(192, value);
        }
        return uint192(value);
    }

    /**
     * @dev Returns the downcasted uint184 from uint256, reverting on
     * overflow (when the input is greater than largest uint184).
     *
     * Counterpart to Solidity's `uint184` operator.
     *
     * Requirements:
     *
     * - input must fit into 184 bits
     */
    function toUint184(uint256 value) internal pure returns (uint184) {
        if (value > type(uint184).max) {
            revert SafeCastOverflowedUintDowncast(184, value);
        }
        return uint184(value);
    }

    /**
     * @dev Returns the downcasted uint176 from uint256, reverting on
     * overflow (when the input is greater than largest uint176).
     *
     * Counterpart to Solidity's `uint176` operator.
     *
     * Requirements:
     *
     * - input must fit into 176 bits
     */
    function toUint176(uint256 value) internal pure returns (uint176) {
        if (value > type(uint176).max) {
            revert SafeCastOverflowedUintDowncast(176, value);
        }
        return uint176(value);
    }

    /**
     * @dev Returns the downcasted uint168 from uint256, reverting on
     * overflow (when the input is greater than largest uint168).
     *
     * Counterpart to Solidity's `uint168` operator.
     *
     * Requirements:
     *
     * - input must fit into 168 bits
     */
    function toUint168(uint256 value) internal pure returns (uint168) {
        if (value > type(uint168).max) {
            revert SafeCastOverflowedUintDowncast(168, value);
        }
        return uint168(value);
    }

    /**
     * @dev Returns the downcasted uint160 from uint256, reverting on
     * overflow (when the input is greater than largest uint160).
     *
     * Counterpart to Solidity's `uint160` operator.
     *
     * Requirements:
     *
     * - input must fit into 160 bits
     */
    function toUint160(uint256 value) internal pure returns (uint160) {
        if (value > type(uint160).max) {
            revert SafeCastOverflowedUintDowncast(160, value);
        }
        return uint160(value);
    }

    /**
     * @dev Returns the downcasted uint152 from uint256, reverting on
     * overflow (when the input is greater than largest uint152).
     *
     * Counterpart to Solidity's `uint152` operator.
     *
     * Requirements:
     *
     * - input must fit into 152 bits
     */
    function toUint152(uint256 value) internal pure returns (uint152) {
        if (value > type(uint152).max) {
            revert SafeCastOverflowedUintDowncast(152, value);
        }
        return uint152(value);
    }

    /**
     * @dev Returns the downcasted uint144 from uint256, reverting on
     * overflow (when the input is greater than largest uint144).
     *
     * Counterpart to Solidity's `uint144` operator.
     *
     * Requirements:
     *
     * - input must fit into 144 bits
     */
    function toUint144(uint256 value) internal pure returns (uint144) {
        if (value > type(uint144).max) {
            revert SafeCastOverflowedUintDowncast(144, value);
        }
        return uint144(value);
    }

    /**
     * @dev Returns the downcasted uint136 from uint256, reverting on
     * overflow (when the input is greater than largest uint136).
     *
     * Counterpart to Solidity's `uint136` operator.
     *
     * Requirements:
     *
     * - input must fit into 136 bits
     */
    function toUint136(uint256 value) internal pure returns (uint136) {
        if (value > type(uint136).max) {
            revert SafeCastOverflowedUintDowncast(136, value);
        }
        return uint136(value);
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
        if (value > type(uint128).max) {
            revert SafeCastOverflowedUintDowncast(128, value);
        }
        return uint128(value);
    }

    /**
     * @dev Returns the downcasted uint120 from uint256, reverting on
     * overflow (when the input is greater than largest uint120).
     *
     * Counterpart to Solidity's `uint120` operator.
     *
     * Requirements:
     *
     * - input must fit into 120 bits
     */
    function toUint120(uint256 value) internal pure returns (uint120) {
        if (value > type(uint120).max) {
            revert SafeCastOverflowedUintDowncast(120, value);
        }
        return uint120(value);
    }

    /**
     * @dev Returns the downcasted uint112 from uint256, reverting on
     * overflow (when the input is greater than largest uint112).
     *
     * Counterpart to Solidity's `uint112` operator.
     *
     * Requirements:
     *
     * - input must fit into 112 bits
     */
    function toUint112(uint256 value) internal pure returns (uint112) {
        if (value > type(uint112).max) {
            revert SafeCastOverflowedUintDowncast(112, value);
        }
        return uint112(value);
    }

    /**
     * @dev Returns the downcasted uint104 from uint256, reverting on
     * overflow (when the input is greater than largest uint104).
     *
     * Counterpart to Solidity's `uint104` operator.
     *
     * Requirements:
     *
     * - input must fit into 104 bits
     */
    function toUint104(uint256 value) internal pure returns (uint104) {
        if (value > type(uint104).max) {
            revert SafeCastOverflowedUintDowncast(104, value);
        }
        return uint104(value);
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
        if (value > type(uint96).max) {
            revert SafeCastOverflowedUintDowncast(96, value);
        }
        return uint96(value);
    }

    /**
     * @dev Returns the downcasted uint88 from uint256, reverting on
     * overflow (when the input is greater than largest uint88).
     *
     * Counterpart to Solidity's `uint88` operator.
     *
     * Requirements:
     *
     * - input must fit into 88 bits
     */
    function toUint88(uint256 value) internal pure returns (uint88) {
        if (value > type(uint88).max) {
            revert SafeCastOverflowedUintDowncast(88, value);
        }
        return uint88(value);
    }

    /**
     * @dev Returns the downcasted uint80 from uint256, reverting on
     * overflow (when the input is greater than largest uint80).
     *
     * Counterpart to Solidity's `uint80` operator.
     *
     * Requirements:
     *
     * - input must fit into 80 bits
     */
    function toUint80(uint256 value) internal pure returns (uint80) {
        if (value > type(uint80).max) {
            revert SafeCastOverflowedUintDowncast(80, value);
        }
        return uint80(value);
    }

    /**
     * @dev Returns the downcasted uint72 from uint256, reverting on
     * overflow (when the input is greater than largest uint72).
     *
     * Counterpart to Solidity's `uint72` operator.
     *
     * Requirements:
     *
     * - input must fit into 72 bits
     */
    function toUint72(uint256 value) internal pure returns (uint72) {
        if (value > type(uint72).max) {
            revert SafeCastOverflowedUintDowncast(72, value);
        }
        return uint72(value);
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
        if (value > type(uint64).max) {
            revert SafeCastOverflowedUintDowncast(64, value);
        }
        return uint64(value);
    }

    /**
     * @dev Returns the downcasted uint56 from uint256, reverting on
     * overflow (when the input is greater than largest uint56).
     *
     * Counterpart to Solidity's `uint56` operator.
     *
     * Requirements:
     *
     * - input must fit into 56 bits
     */
    function toUint56(uint256 value) internal pure returns (uint56) {
        if (value > type(uint56).max) {
            revert SafeCastOverflowedUintDowncast(56, value);
        }
        return uint56(value);
    }

    /**
     * @dev Returns the downcasted uint48 from uint256, reverting on
     * overflow (when the input is greater than largest uint48).
     *
     * Counterpart to Solidity's `uint48` operator.
     *
     * Requirements:
     *
     * - input must fit into 48 bits
     */
    function toUint48(uint256 value) internal pure returns (uint48) {
        if (value > type(uint48).max) {
            revert SafeCastOverflowedUintDowncast(48, value);
        }
        return uint48(value);
    }

    /**
     * @dev Returns the downcasted uint40 from uint256, reverting on
     * overflow (when the input is greater than largest uint40).
     *
     * Counterpart to Solidity's `uint40` operator.
     *
     * Requirements:
     *
     * - input must fit into 40 bits
     */
    function toUint40(uint256 value) internal pure returns (uint40) {
        if (value > type(uint40).max) {
            revert SafeCastOverflowedUintDowncast(40, value);
        }
        return uint40(value);
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
        if (value > type(uint32).max) {
            revert SafeCastOverflowedUintDowncast(32, value);
        }
        return uint32(value);
    }

    /**
     * @dev Returns the downcasted uint24 from uint256, reverting on
     * overflow (when the input is greater than largest uint24).
     *
     * Counterpart to Solidity's `uint24` operator.
     *
     * Requirements:
     *
     * - input must fit into 24 bits
     */
    function toUint24(uint256 value) internal pure returns (uint24) {
        if (value > type(uint24).max) {
            revert SafeCastOverflowedUintDowncast(24, value);
        }
        return uint24(value);
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
        if (value > type(uint16).max) {
            revert SafeCastOverflowedUintDowncast(16, value);
        }
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
     * - input must fit into 8 bits
     */
    function toUint8(uint256 value) internal pure returns (uint8) {
        if (value > type(uint8).max) {
            revert SafeCastOverflowedUintDowncast(8, value);
        }
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
        if (value < 0) {
            revert SafeCastOverflowedIntToUint(value);
        }
        return uint256(value);
    }

    /**
     * @dev Returns the downcasted int248 from int256, reverting on
     * overflow (when the input is less than smallest int248 or
     * greater than largest int248).
     *
     * Counterpart to Solidity's `int248` operator.
     *
     * Requirements:
     *
     * - input must fit into 248 bits
     */
    function toInt248(int256 value) internal pure returns (int248 downcasted) {
        downcasted = int248(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(248, value);
        }
    }

    /**
     * @dev Returns the downcasted int240 from int256, reverting on
     * overflow (when the input is less than smallest int240 or
     * greater than largest int240).
     *
     * Counterpart to Solidity's `int240` operator.
     *
     * Requirements:
     *
     * - input must fit into 240 bits
     */
    function toInt240(int256 value) internal pure returns (int240 downcasted) {
        downcasted = int240(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(240, value);
        }
    }

    /**
     * @dev Returns the downcasted int232 from int256, reverting on
     * overflow (when the input is less than smallest int232 or
     * greater than largest int232).
     *
     * Counterpart to Solidity's `int232` operator.
     *
     * Requirements:
     *
     * - input must fit into 232 bits
     */
    function toInt232(int256 value) internal pure returns (int232 downcasted) {
        downcasted = int232(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(232, value);
        }
    }

    /**
     * @dev Returns the downcasted int224 from int256, reverting on
     * overflow (when the input is less than smallest int224 or
     * greater than largest int224).
     *
     * Counterpart to Solidity's `int224` operator.
     *
     * Requirements:
     *
     * - input must fit into 224 bits
     */
    function toInt224(int256 value) internal pure returns (int224 downcasted) {
        downcasted = int224(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(224, value);
        }
    }

    /**
     * @dev Returns the downcasted int216 from int256, reverting on
     * overflow (when the input is less than smallest int216 or
     * greater than largest int216).
     *
     * Counterpart to Solidity's `int216` operator.
     *
     * Requirements:
     *
     * - input must fit into 216 bits
     */
    function toInt216(int256 value) internal pure returns (int216 downcasted) {
        downcasted = int216(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(216, value);
        }
    }

    /**
     * @dev Returns the downcasted int208 from int256, reverting on
     * overflow (when the input is less than smallest int208 or
     * greater than largest int208).
     *
     * Counterpart to Solidity's `int208` operator.
     *
     * Requirements:
     *
     * - input must fit into 208 bits
     */
    function toInt208(int256 value) internal pure returns (int208 downcasted) {
        downcasted = int208(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(208, value);
        }
    }

    /**
     * @dev Returns the downcasted int200 from int256, reverting on
     * overflow (when the input is less than smallest int200 or
     * greater than largest int200).
     *
     * Counterpart to Solidity's `int200` operator.
     *
     * Requirements:
     *
     * - input must fit into 200 bits
     */
    function toInt200(int256 value) internal pure returns (int200 downcasted) {
        downcasted = int200(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(200, value);
        }
    }

    /**
     * @dev Returns the downcasted int192 from int256, reverting on
     * overflow (when the input is less than smallest int192 or
     * greater than largest int192).
     *
     * Counterpart to Solidity's `int192` operator.
     *
     * Requirements:
     *
     * - input must fit into 192 bits
     */
    function toInt192(int256 value) internal pure returns (int192 downcasted) {
        downcasted = int192(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(192, value);
        }
    }

    /**
     * @dev Returns the downcasted int184 from int256, reverting on
     * overflow (when the input is less than smallest int184 or
     * greater than largest int184).
     *
     * Counterpart to Solidity's `int184` operator.
     *
     * Requirements:
     *
     * - input must fit into 184 bits
     */
    function toInt184(int256 value) internal pure returns (int184 downcasted) {
        downcasted = int184(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(184, value);
        }
    }

    /**
     * @dev Returns the downcasted int176 from int256, reverting on
     * overflow (when the input is less than smallest int176 or
     * greater than largest int176).
     *
     * Counterpart to Solidity's `int176` operator.
     *
     * Requirements:
     *
     * - input must fit into 176 bits
     */
    function toInt176(int256 value) internal pure returns (int176 downcasted) {
        downcasted = int176(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(176, value);
        }
    }

    /**
     * @dev Returns the downcasted int168 from int256, reverting on
     * overflow (when the input is less than smallest int168 or
     * greater than largest int168).
     *
     * Counterpart to Solidity's `int168` operator.
     *
     * Requirements:
     *
     * - input must fit into 168 bits
     */
    function toInt168(int256 value) internal pure returns (int168 downcasted) {
        downcasted = int168(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(168, value);
        }
    }

    /**
     * @dev Returns the downcasted int160 from int256, reverting on
     * overflow (when the input is less than smallest int160 or
     * greater than largest int160).
     *
     * Counterpart to Solidity's `int160` operator.
     *
     * Requirements:
     *
     * - input must fit into 160 bits
     */
    function toInt160(int256 value) internal pure returns (int160 downcasted) {
        downcasted = int160(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(160, value);
        }
    }

    /**
     * @dev Returns the downcasted int152 from int256, reverting on
     * overflow (when the input is less than smallest int152 or
     * greater than largest int152).
     *
     * Counterpart to Solidity's `int152` operator.
     *
     * Requirements:
     *
     * - input must fit into 152 bits
     */
    function toInt152(int256 value) internal pure returns (int152 downcasted) {
        downcasted = int152(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(152, value);
        }
    }

    /**
     * @dev Returns the downcasted int144 from int256, reverting on
     * overflow (when the input is less than smallest int144 or
     * greater than largest int144).
     *
     * Counterpart to Solidity's `int144` operator.
     *
     * Requirements:
     *
     * - input must fit into 144 bits
     */
    function toInt144(int256 value) internal pure returns (int144 downcasted) {
        downcasted = int144(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(144, value);
        }
    }

    /**
     * @dev Returns the downcasted int136 from int256, reverting on
     * overflow (when the input is less than smallest int136 or
     * greater than largest int136).
     *
     * Counterpart to Solidity's `int136` operator.
     *
     * Requirements:
     *
     * - input must fit into 136 bits
     */
    function toInt136(int256 value) internal pure returns (int136 downcasted) {
        downcasted = int136(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(136, value);
        }
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
     */
    function toInt128(int256 value) internal pure returns (int128 downcasted) {
        downcasted = int128(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(128, value);
        }
    }

    /**
     * @dev Returns the downcasted int120 from int256, reverting on
     * overflow (when the input is less than smallest int120 or
     * greater than largest int120).
     *
     * Counterpart to Solidity's `int120` operator.
     *
     * Requirements:
     *
     * - input must fit into 120 bits
     */
    function toInt120(int256 value) internal pure returns (int120 downcasted) {
        downcasted = int120(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(120, value);
        }
    }

    /**
     * @dev Returns the downcasted int112 from int256, reverting on
     * overflow (when the input is less than smallest int112 or
     * greater than largest int112).
     *
     * Counterpart to Solidity's `int112` operator.
     *
     * Requirements:
     *
     * - input must fit into 112 bits
     */
    function toInt112(int256 value) internal pure returns (int112 downcasted) {
        downcasted = int112(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(112, value);
        }
    }

    /**
     * @dev Returns the downcasted int104 from int256, reverting on
     * overflow (when the input is less than smallest int104 or
     * greater than largest int104).
     *
     * Counterpart to Solidity's `int104` operator.
     *
     * Requirements:
     *
     * - input must fit into 104 bits
     */
    function toInt104(int256 value) internal pure returns (int104 downcasted) {
        downcasted = int104(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(104, value);
        }
    }

    /**
     * @dev Returns the downcasted int96 from int256, reverting on
     * overflow (when the input is less than smallest int96 or
     * greater than largest int96).
     *
     * Counterpart to Solidity's `int96` operator.
     *
     * Requirements:
     *
     * - input must fit into 96 bits
     */
    function toInt96(int256 value) internal pure returns (int96 downcasted) {
        downcasted = int96(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(96, value);
        }
    }

    /**
     * @dev Returns the downcasted int88 from int256, reverting on
     * overflow (when the input is less than smallest int88 or
     * greater than largest int88).
     *
     * Counterpart to Solidity's `int88` operator.
     *
     * Requirements:
     *
     * - input must fit into 88 bits
     */
    function toInt88(int256 value) internal pure returns (int88 downcasted) {
        downcasted = int88(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(88, value);
        }
    }

    /**
     * @dev Returns the downcasted int80 from int256, reverting on
     * overflow (when the input is less than smallest int80 or
     * greater than largest int80).
     *
     * Counterpart to Solidity's `int80` operator.
     *
     * Requirements:
     *
     * - input must fit into 80 bits
     */
    function toInt80(int256 value) internal pure returns (int80 downcasted) {
        downcasted = int80(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(80, value);
        }
    }

    /**
     * @dev Returns the downcasted int72 from int256, reverting on
     * overflow (when the input is less than smallest int72 or
     * greater than largest int72).
     *
     * Counterpart to Solidity's `int72` operator.
     *
     * Requirements:
     *
     * - input must fit into 72 bits
     */
    function toInt72(int256 value) internal pure returns (int72 downcasted) {
        downcasted = int72(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(72, value);
        }
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
     */
    function toInt64(int256 value) internal pure returns (int64 downcasted) {
        downcasted = int64(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(64, value);
        }
    }

    /**
     * @dev Returns the downcasted int56 from int256, reverting on
     * overflow (when the input is less than smallest int56 or
     * greater than largest int56).
     *
     * Counterpart to Solidity's `int56` operator.
     *
     * Requirements:
     *
     * - input must fit into 56 bits
     */
    function toInt56(int256 value) internal pure returns (int56 downcasted) {
        downcasted = int56(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(56, value);
        }
    }

    /**
     * @dev Returns the downcasted int48 from int256, reverting on
     * overflow (when the input is less than smallest int48 or
     * greater than largest int48).
     *
     * Counterpart to Solidity's `int48` operator.
     *
     * Requirements:
     *
     * - input must fit into 48 bits
     */
    function toInt48(int256 value) internal pure returns (int48 downcasted) {
        downcasted = int48(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(48, value);
        }
    }

    /**
     * @dev Returns the downcasted int40 from int256, reverting on
     * overflow (when the input is less than smallest int40 or
     * greater than largest int40).
     *
     * Counterpart to Solidity's `int40` operator.
     *
     * Requirements:
     *
     * - input must fit into 40 bits
     */
    function toInt40(int256 value) internal pure returns (int40 downcasted) {
        downcasted = int40(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(40, value);
        }
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
     */
    function toInt32(int256 value) internal pure returns (int32 downcasted) {
        downcasted = int32(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(32, value);
        }
    }

    /**
     * @dev Returns the downcasted int24 from int256, reverting on
     * overflow (when the input is less than smallest int24 or
     * greater than largest int24).
     *
     * Counterpart to Solidity's `int24` operator.
     *
     * Requirements:
     *
     * - input must fit into 24 bits
     */
    function toInt24(int256 value) internal pure returns (int24 downcasted) {
        downcasted = int24(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(24, value);
        }
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
     */
    function toInt16(int256 value) internal pure returns (int16 downcasted) {
        downcasted = int16(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(16, value);
        }
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
     * - input must fit into 8 bits
     */
    function toInt8(int256 value) internal pure returns (int8 downcasted) {
        downcasted = int8(value);
        if (downcasted != value) {
            revert SafeCastOverflowedIntDowncast(8, value);
        }
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
        if (value > uint256(type(int256).max)) {
            revert SafeCastOverflowedUintToInt(value);
        }
        return int256(value);
    }
}

abstract contract CSBondLock is ICSBondLock, Initializable {
    using SafeCast for uint256;

    /// @custom:storage-location erc7201:CSAccounting.CSBondLock
    struct CSBondLockStorage {
        /// @dev Default bond lock retention period for all locks
        ///      After this period the bond lock is removed and no longer valid
        uint256 bondLockRetentionPeriod;
        /// @dev Mapping of the Node Operator id to the bond lock
        mapping(uint256 nodeOperatorId => BondLock) bondLock;
    }

    // keccak256(abi.encode(uint256(keccak256("CSBondLock")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant CS_BOND_LOCK_STORAGE_LOCATION =
        0x78c5a36767279da056404c09083fca30cf3ea61c442cfaba6669f76a37393f00;

    uint256 public immutable MIN_BOND_LOCK_RETENTION_PERIOD;
    uint256 public immutable MAX_BOND_LOCK_RETENTION_PERIOD;

    event BondLockChanged(
        uint256 indexed nodeOperatorId,
        uint256 newAmount,
        uint256 retentionUntil
    );
    event BondLockRemoved(uint256 indexed nodeOperatorId);

    event BondLockRetentionPeriodChanged(uint256 retentionPeriod);

    error InvalidBondLockRetentionPeriod();
    error InvalidBondLockAmount();

    constructor(
        uint256 minBondLockRetentionPeriod,
        uint256 maxBondLockRetentionPeriod
    ) {
        if (minBondLockRetentionPeriod > maxBondLockRetentionPeriod) {
            revert InvalidBondLockRetentionPeriod();
        }
        // retention period can not be more than type(uint64).max to avoid overflow when setting bond lock
        if (maxBondLockRetentionPeriod > type(uint64).max) {
            revert InvalidBondLockRetentionPeriod();
        }
        MIN_BOND_LOCK_RETENTION_PERIOD = minBondLockRetentionPeriod;
        MAX_BOND_LOCK_RETENTION_PERIOD = maxBondLockRetentionPeriod;
    }

    /// @notice Get default bond lock retention period
    /// @return Default bond lock retention period
    function getBondLockRetentionPeriod() external view returns (uint256) {
        return _getCSBondLockStorage().bondLockRetentionPeriod;
    }

    /// @notice Get information about the locked bond for the given Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Locked bond info
    function getLockedBondInfo(
        uint256 nodeOperatorId
    ) public view returns (BondLock memory) {
        return _getCSBondLockStorage().bondLock[nodeOperatorId];
    }

    /// @notice Get amount of the locked bond in ETH (stETH) by the given Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Amount of the actual locked bond
    function getActualLockedBond(
        uint256 nodeOperatorId
    ) public view returns (uint256) {
        BondLock storage bondLock = _getCSBondLockStorage().bondLock[
            nodeOperatorId
        ];
        return bondLock.retentionUntil > block.timestamp ? bondLock.amount : 0;
    }

    /// @dev Lock bond amount for the given Node Operator until the retention period.
    function _lock(uint256 nodeOperatorId, uint256 amount) internal {
        CSBondLockStorage storage $ = _getCSBondLockStorage();
        if (amount == 0) {
            revert InvalidBondLockAmount();
        }
        if ($.bondLock[nodeOperatorId].retentionUntil > block.timestamp) {
            amount += $.bondLock[nodeOperatorId].amount;
        }
        _changeBondLock({
            nodeOperatorId: nodeOperatorId,
            amount: amount,
            retentionUntil: block.timestamp + $.bondLockRetentionPeriod
        });
    }

    /// @dev Reduce locked bond amount for the given Node Operator without changing retention period
    function _reduceAmount(uint256 nodeOperatorId, uint256 amount) internal {
        uint256 blocked = getActualLockedBond(nodeOperatorId);
        if (amount == 0) {
            revert InvalidBondLockAmount();
        }
        if (blocked < amount) {
            revert InvalidBondLockAmount();
        }
        unchecked {
            _changeBondLock(
                nodeOperatorId,
                blocked - amount,
                _getCSBondLockStorage().bondLock[nodeOperatorId].retentionUntil
            );
        }
    }

    /// @dev Remove bond lock for the given Node Operator
    function _remove(uint256 nodeOperatorId) internal {
        delete _getCSBondLockStorage().bondLock[nodeOperatorId];
        emit BondLockRemoved(nodeOperatorId);
    }

    // solhint-disable-next-line func-name-mixedcase
    function __CSBondLock_init(
        uint256 retentionPeriod
    ) internal onlyInitializing {
        _setBondLockRetentionPeriod(retentionPeriod);
    }

    /// @dev Set default bond lock retention period. That period will be sum with the current block timestamp of lock tx
    function _setBondLockRetentionPeriod(uint256 retentionPeriod) internal {
        if (
            retentionPeriod < MIN_BOND_LOCK_RETENTION_PERIOD ||
            retentionPeriod > MAX_BOND_LOCK_RETENTION_PERIOD
        ) {
            revert InvalidBondLockRetentionPeriod();
        }
        _getCSBondLockStorage().bondLockRetentionPeriod = retentionPeriod;
        emit BondLockRetentionPeriodChanged(retentionPeriod);
    }

    function _changeBondLock(
        uint256 nodeOperatorId,
        uint256 amount,
        uint256 retentionUntil
    ) private {
        if (amount == 0) {
            _remove(nodeOperatorId);
            return;
        }
        _getCSBondLockStorage().bondLock[nodeOperatorId] = BondLock({
            amount: amount.toUint128(),
            retentionUntil: retentionUntil.toUint128()
        });
        emit BondLockChanged(nodeOperatorId, amount, retentionUntil);
    }

    function _getCSBondLockStorage()
        private
        pure
        returns (CSBondLockStorage storage $)
    {
        assembly {
            $.slot := CS_BOND_LOCK_STORAGE_LOCATION
        }
    }
}

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

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
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

    /**
     * @dev Returns an `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }
}

library Math {
    /**
     * @dev Muldiv operation overflow.
     */
    error MathOverflowedMulDiv();

    enum Rounding {
        Floor, // Toward negative infinity
        Ceil, // Toward positive infinity
        Trunc, // Toward zero
        Expand // Away from zero
    }

    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds towards infinity instead
     * of rounding towards zero.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        if (b == 0) {
            // Guarantee the same behavior as in a regular Solidity division.
            return a / b;
        }

        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or
     * denominator == 0.
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv) with further edits by
     * Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0 = x * y; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            if (denominator <= prod1) {
                revert MathOverflowedMulDiv();
            }

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator.
            // Always >= 1. See https://cs.stackexchange.com/q/138556/92363.

            uint256 twos = denominator & (0 - denominator);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also
            // works in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (unsignedRoundsUp(rounding) && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded
     * towards zero.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (unsignedRoundsUp(rounding) && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (unsignedRoundsUp(rounding) && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (unsignedRoundsUp(rounding) && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (unsignedRoundsUp(rounding) && 1 << (result << 3) < value ? 1 : 0);
        }
    }

    /**
     * @dev Returns whether a provided rounding mode is considered rounding up for unsigned integers.
     */
    function unsignedRoundsUp(Rounding rounding) internal pure returns (bool) {
        return uint8(rounding) % 2 == 1;
    }
}

library Arrays {
    using StorageSlot for bytes32;

    /**
     * @dev Searches a sorted `array` and returns the first index that contains
     * a value greater or equal to `element`. If no such index exists (i.e. all
     * values in the array are strictly less than `element`), the array length is
     * returned. Time complexity O(log n).
     *
     * `array` is expected to be sorted in ascending order, and to contain no
     * repeated elements.
     */
    function findUpperBound(uint256[] storage array, uint256 element) internal view returns (uint256) {
        uint256 low = 0;
        uint256 high = array.length;

        if (high == 0) {
            return 0;
        }

        while (low < high) {
            uint256 mid = Math.average(low, high);

            // Note that mid will always be strictly less than high (i.e. it will be a valid array index)
            // because Math.average rounds towards zero (it does integer division with truncation).
            if (unsafeAccess(array, mid).value > element) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        // At this point `low` is the exclusive upper bound. We will return the inclusive upper bound.
        if (low > 0 && unsafeAccess(array, low - 1).value == element) {
            return low - 1;
        } else {
            return low;
        }
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(address[] storage arr, uint256 pos) internal pure returns (StorageSlot.AddressSlot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.20/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getAddressSlot();
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(bytes32[] storage arr, uint256 pos) internal pure returns (StorageSlot.Bytes32Slot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.20/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getBytes32Slot();
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(uint256[] storage arr, uint256 pos) internal pure returns (StorageSlot.Uint256Slot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.20/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getUint256Slot();
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeMemoryAccess(uint256[] memory arr, uint256 pos) internal pure returns (uint256 res) {
        assembly {
            res := mload(add(add(arr, 0x20), mul(pos, 0x20)))
        }
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeMemoryAccess(address[] memory arr, uint256 pos) internal pure returns (address res) {
        assembly {
            res := mload(add(add(arr, 0x20), mul(pos, 0x20)))
        }
    }
}

abstract contract CSBondCurve is ICSBondCurve, Initializable {
    using Arrays for uint256[];

    /// @custom:storage-location erc7201:CSAccounting.CSBondCurve
    struct CSBondCurveStorage {
        BondCurve[] bondCurves;
        /// @dev Mapping of Node Operator id to bond curve id
        mapping(uint256 nodeOperatorId => uint256 bondCurveId) operatorBondCurveId;
    }

    // keccak256(abi.encode(uint256(keccak256("CSBondCurve")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant CS_BOND_CURVE_STORAGE_LOCATION =
        0x8f22e270e477f5becb8793b61d439ab7ae990ed8eba045eb72061c0e6cfe1500;

    uint256 public constant MIN_CURVE_LENGTH = 1;
    uint256 public constant DEFAULT_BOND_CURVE_ID = 0;
    uint256 public immutable MAX_CURVE_LENGTH;

    event BondCurveAdded(uint256[] bondCurve);
    event BondCurveUpdated(uint256 indexed curveId, uint256[] bondCurve);
    event BondCurveSet(uint256 indexed nodeOperatorId, uint256 curveId);

    error InvalidBondCurveLength();
    error InvalidBondCurveMaxLength();
    error InvalidBondCurveValues();
    error InvalidBondCurveId();
    error InvalidInitialisationCurveId();

    constructor(uint256 maxCurveLength) {
        if (maxCurveLength < MIN_CURVE_LENGTH)
            revert InvalidBondCurveMaxLength();
        MAX_CURVE_LENGTH = maxCurveLength;
    }

    /// @dev Get default bond curve info if `curveId` is `0` or invalid
    /// @notice Return bond curve for the given curve id
    /// @param curveId Curve id to get bond curve for
    /// @return Bond curve
    function getCurveInfo(
        uint256 curveId
    ) public view returns (BondCurve memory) {
        CSBondCurveStorage storage $ = _getCSBondCurveStorage();
        if (curveId > $.bondCurves.length - 1) revert InvalidBondCurveId();
        return $.bondCurves[curveId];
    }

    /// @notice Get bond curve for the given Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Bond curve
    function getBondCurve(
        uint256 nodeOperatorId
    ) public view returns (BondCurve memory) {
        return getCurveInfo(getBondCurveId(nodeOperatorId));
    }

    /// @notice Get bond curve ID for the given Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Bond curve ID
    function getBondCurveId(
        uint256 nodeOperatorId
    ) public view returns (uint256) {
        return _getCSBondCurveStorage().operatorBondCurveId[nodeOperatorId];
    }

    /// @notice Get required bond in ETH for the given number of keys for default bond curve
    /// @dev To calculate the amount for the new keys 2 calls are required:
    ///      getBondAmountByKeysCount(newTotal) - getBondAmountByKeysCount(currentTotal)
    /// @param keys Number of keys to get required bond for
    /// @param curveId Id of the curve to perform calculations against
    /// @return Amount for particular keys count
    function getBondAmountByKeysCount(
        uint256 keys,
        uint256 curveId
    ) public view returns (uint256) {
        return getBondAmountByKeysCount(keys, getCurveInfo(curveId));
    }

    /// @notice Get keys count for the given bond amount with default bond curve
    /// @param amount Bond amount in ETH (stETH)to get keys count for
    /// @param curveId Id of the curve to perform calculations against
    /// @return Keys count
    function getKeysCountByBondAmount(
        uint256 amount,
        uint256 curveId
    ) public view returns (uint256) {
        return getKeysCountByBondAmount(amount, getCurveInfo(curveId));
    }

    /// @notice Get required bond in ETH for the given number of keys for particular bond curve.
    /// @dev To calculate the amount for the new keys 2 calls are required:
    ///      getBondAmountByKeysCount(newTotal, curve) - getBondAmountByKeysCount(currentTotal, curve)
    /// @param keys Number of keys to get required bond for
    /// @param curve Bond curve to perform calculations against
    /// @return Required bond amount in ETH (stETH) for particular keys count
    function getBondAmountByKeysCount(
        uint256 keys,
        BondCurve memory curve
    ) public pure returns (uint256) {
        if (keys == 0) return 0;
        uint256 len = curve.points.length;
        return
            keys > len
                ? curve.points.unsafeMemoryAccess(len - 1) +
                    (keys - len) *
                    curve.trend
                : curve.points.unsafeMemoryAccess(keys - 1);
    }

    /// @notice Get keys count for the given bond amount for particular bond curve.
    /// @param amount Bond amount to get keys count for
    /// @param curve Bond curve to perform calculations against
    /// @return Keys count
    function getKeysCountByBondAmount(
        uint256 amount,
        BondCurve memory curve
    ) public pure returns (uint256) {
        if (amount < curve.points.unsafeMemoryAccess(0)) return 0;
        uint256 len = curve.points.length;
        uint256 maxCurveAmount = curve.points.unsafeMemoryAccess(len - 1);
        unchecked {
            return
                amount < maxCurveAmount
                    ? _searchKeysCount(amount, curve.points)
                    : len + (amount - maxCurveAmount) / curve.trend;
        }
    }

    // solhint-disable-next-line func-name-mixedcase
    function __CSBondCurve_init(
        uint256[] calldata defaultBondCurvePoints
    ) internal onlyInitializing {
        uint256 addedId = _addBondCurve(defaultBondCurvePoints);
        if (addedId != DEFAULT_BOND_CURVE_ID)
            revert InvalidInitialisationCurveId();
    }

    /// @dev Add a new bond curve to the array
    function _addBondCurve(
        uint256[] calldata curvePoints
    ) internal returns (uint256) {
        CSBondCurveStorage storage $ = _getCSBondCurveStorage();

        _checkBondCurve(curvePoints);
        unchecked {
            uint256 curveTrend = curvePoints[curvePoints.length - 1] -
                // if the curve length is 1, then 0 is used as the previous value to calculate the trend
                (
                    curvePoints.length > 1
                        ? curvePoints[curvePoints.length - 2]
                        : 0
                );
            $.bondCurves.push(
                BondCurve({ points: curvePoints, trend: curveTrend })
            );
            emit BondCurveAdded(curvePoints);
            return $.bondCurves.length - 1;
        }
    }

    /// @dev Update existing bond curve
    function _updateBondCurve(
        uint256 curveId,
        uint256[] calldata curvePoints
    ) internal {
        CSBondCurveStorage storage $ = _getCSBondCurveStorage();
        unchecked {
            if (curveId > $.bondCurves.length - 1) revert InvalidBondCurveId();

            _checkBondCurve(curvePoints);

            uint256 curveTrend = curvePoints[curvePoints.length - 1] -
                // if the curve length is 1, then 0 is used as the previous value to calculate the trend
                (
                    curvePoints.length > 1
                        ? curvePoints[curvePoints.length - 2]
                        : 0
                );
            $.bondCurves[curveId] = BondCurve({
                points: curvePoints,
                trend: curveTrend
            });
        }
        emit BondCurveUpdated(curveId, curvePoints);
    }

    /// @dev Sets bond curve for the given Node Operator
    ///      It will be used for the Node Operator instead of the previously set curve
    function _setBondCurve(uint256 nodeOperatorId, uint256 curveId) internal {
        CSBondCurveStorage storage $ = _getCSBondCurveStorage();
        unchecked {
            if (curveId > $.bondCurves.length - 1) revert InvalidBondCurveId();
        }
        $.operatorBondCurveId[nodeOperatorId] = curveId;
        emit BondCurveSet(nodeOperatorId, curveId);
    }

    /// @dev Reset bond curve for the given Node Operator to default.
    ///      (for example, because of breaking the rules by Node Operator)
    function _resetBondCurve(uint256 nodeOperatorId) internal {
        CSBondCurveStorage storage $ = _getCSBondCurveStorage();
        if ($.operatorBondCurveId[nodeOperatorId] == DEFAULT_BOND_CURVE_ID)
            return;

        $.operatorBondCurveId[nodeOperatorId] = DEFAULT_BOND_CURVE_ID;
        emit BondCurveSet(nodeOperatorId, DEFAULT_BOND_CURVE_ID);
    }

    function _checkBondCurve(uint256[] calldata curvePoints) private view {
        if (
            curvePoints.length < MIN_CURVE_LENGTH ||
            curvePoints.length > MAX_CURVE_LENGTH
        ) revert InvalidBondCurveLength();
        if (curvePoints[0] == 0) revert InvalidBondCurveValues();
        for (uint256 i = 1; i < curvePoints.length; ++i) {
            unchecked {
                if (curvePoints[i] <= curvePoints[i - 1])
                    revert InvalidBondCurveValues();
            }
        }
    }

    function _searchKeysCount(
        uint256 amount,
        uint256[] memory curvePoints
    ) private pure returns (uint256) {
        unchecked {
            uint256 low;
            // @dev Curves of a length = 1 are handled in the parent method
            uint256 high = curvePoints.length - 2;
            uint256 mid;
            uint256 midAmount;
            while (low <= high) {
                mid = (low + high) / 2;
                midAmount = curvePoints.unsafeMemoryAccess(mid);
                if (amount == midAmount) {
                    return mid + 1;
                }
                // underflow is excluded by the conditions in the parent method
                if (amount < midAmount) {
                    high = mid - 1;
                } else if (amount > midAmount) {
                    low = mid + 1;
                }
            }
            return low;
        }
    }

    function _getCSBondCurveStorage()
        private
        pure
        returns (CSBondCurveStorage storage $)
    {
        assembly {
            $.slot := CS_BOND_CURVE_STORAGE_LOCATION
        }
    }
}

abstract contract CSBondCore is ICSBondCore {
    /// @custom:storage-location erc7201:CSAccounting.CSBondCore
    struct CSBondCoreStorage {
        mapping(uint256 nodeOperatorId => uint256 shares) bondShares;
        uint256 totalBondShares;
    }

    ILidoLocator public immutable LIDO_LOCATOR;
    ILido public immutable LIDO;
    IWithdrawalQueue public immutable WITHDRAWAL_QUEUE;
    IWstETH public immutable WSTETH;

    // keccak256(abi.encode(uint256(keccak256("CSBondCore")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant CS_BOND_CORE_STORAGE_LOCATION =
        0x23f334b9eb5378c2a1573857b8f9d9ca79959360a69e73d3f16848e56ec92100;

    event BondDepositedETH(
        uint256 indexed nodeOperatorId,
        address from,
        uint256 amount
    );
    event BondDepositedStETH(
        uint256 indexed nodeOperatorId,
        address from,
        uint256 amount
    );
    event BondDepositedWstETH(
        uint256 indexed nodeOperatorId,
        address from,
        uint256 amount
    );
    event BondClaimedUnstETH(
        uint256 indexed nodeOperatorId,
        address to,
        uint256 amount,
        uint256 requestId
    );
    event BondClaimedStETH(
        uint256 indexed nodeOperatorId,
        address to,
        uint256 amount
    );
    event BondClaimedWstETH(
        uint256 indexed nodeOperatorId,
        address to,
        uint256 amount
    );
    event BondBurned(
        uint256 indexed nodeOperatorId,
        uint256 toBurnAmount,
        uint256 burnedAmount
    );
    event BondCharged(
        uint256 indexed nodeOperatorId,
        uint256 toChargeAmount,
        uint256 chargedAmount
    );

    error ZeroLocatorAddress();
    error NothingToClaim();

    constructor(address lidoLocator) {
        if (lidoLocator == address(0)) {
            revert ZeroLocatorAddress();
        }
        LIDO_LOCATOR = ILidoLocator(lidoLocator);
        LIDO = ILido(LIDO_LOCATOR.lido());
        WITHDRAWAL_QUEUE = IWithdrawalQueue(LIDO_LOCATOR.withdrawalQueue());
        WSTETH = IWstETH(WITHDRAWAL_QUEUE.WSTETH());
    }

    /// @notice Get total bond shares (stETH) stored on the contract
    /// @return Total bond shares (stETH)
    function totalBondShares() public view returns (uint256) {
        return _getCSBondCoreStorage().totalBondShares;
    }

    /// @notice Get bond shares (stETH) for the given Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Bond in stETH shares
    function getBondShares(
        uint256 nodeOperatorId
    ) public view returns (uint256) {
        return _getCSBondCoreStorage().bondShares[nodeOperatorId];
    }

    /// @notice Get bond amount in ETH (stETH) for the given Node Operator
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Bond amount in ETH (stETH)
    function getBond(uint256 nodeOperatorId) public view returns (uint256) {
        return _ethByShares(getBondShares(nodeOperatorId));
    }

    /// @dev Stake user's ETH with Lido and stores stETH shares as Node Operator's bond shares
    function _depositETH(address from, uint256 nodeOperatorId) internal {
        if (msg.value == 0) return;
        uint256 shares = LIDO.submit{ value: msg.value }({
            _referal: address(0)
        });
        _increaseBond(nodeOperatorId, shares);
        emit BondDepositedETH(nodeOperatorId, from, msg.value);
    }

    /// @dev Transfer user's stETH to the contract and stores stETH shares as Node Operator's bond shares
    function _depositStETH(
        address from,
        uint256 nodeOperatorId,
        uint256 amount
    ) internal {
        if (amount == 0) return;
        uint256 shares = _sharesByEth(amount);
        LIDO.transferSharesFrom(from, address(this), shares);
        _increaseBond(nodeOperatorId, shares);
        emit BondDepositedStETH(nodeOperatorId, from, amount);
    }

    /// @dev Transfer user's wstETH to the contract, unwrap and store stETH shares as Node Operator's bond shares
    function _depositWstETH(
        address from,
        uint256 nodeOperatorId,
        uint256 amount
    ) internal {
        if (amount == 0) return;
        WSTETH.transferFrom(from, address(this), amount);
        uint256 sharesBefore = LIDO.sharesOf(address(this));
        WSTETH.unwrap(amount);
        uint256 sharesAfter = LIDO.sharesOf(address(this));
        _increaseBond(nodeOperatorId, sharesAfter - sharesBefore);
        emit BondDepositedWstETH(nodeOperatorId, from, amount);
    }

    function _increaseBond(uint256 nodeOperatorId, uint256 shares) internal {
        if (shares == 0) return;
        CSBondCoreStorage storage $ = _getCSBondCoreStorage();
        unchecked {
            $.bondShares[nodeOperatorId] += shares;
            $.totalBondShares += shares;
        }
    }

    /// @dev Claim Node Operator's excess bond shares (stETH) in ETH by requesting withdrawal from the protocol
    ///      As a usual withdrawal request, this claim might be processed on the next stETH rebase
    function _claimUnstETH(
        uint256 nodeOperatorId,
        uint256 requestedAmountToClaim,
        address to
    ) internal {
        uint256 claimableShares = _getClaimableBondShares(nodeOperatorId);
        uint256 sharesToClaim = requestedAmountToClaim <
            _ethByShares(claimableShares)
            ? _sharesByEth(requestedAmountToClaim)
            : claimableShares;
        if (sharesToClaim == 0) revert NothingToClaim();

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _ethByShares(sharesToClaim);
        uint256 sharesBefore = LIDO.sharesOf(address(this));
        uint256[] memory requestIds = WITHDRAWAL_QUEUE.requestWithdrawals(
            amounts,
            to
        );
        uint256 sharesAfter = LIDO.sharesOf(address(this));
        _unsafeReduceBond(nodeOperatorId, sharesBefore - sharesAfter);
        emit BondClaimedUnstETH(nodeOperatorId, to, amounts[0], requestIds[0]);
    }

    /// @dev Claim Node Operator's excess bond shares (stETH) in stETH by transferring shares from the contract
    function _claimStETH(
        uint256 nodeOperatorId,
        uint256 requestedAmountToClaim,
        address to
    ) internal {
        uint256 claimableShares = _getClaimableBondShares(nodeOperatorId);
        uint256 sharesToClaim = requestedAmountToClaim <
            _ethByShares(claimableShares)
            ? _sharesByEth(requestedAmountToClaim)
            : claimableShares;
        if (sharesToClaim == 0) revert NothingToClaim();
        _unsafeReduceBond(nodeOperatorId, sharesToClaim);

        uint256 ethAmount = LIDO.transferShares(to, sharesToClaim);
        emit BondClaimedStETH(nodeOperatorId, to, ethAmount);
    }

    /// @dev Claim Node Operator's excess bond shares (stETH) in wstETH by wrapping stETH from the contract and transferring wstETH
    function _claimWstETH(
        uint256 nodeOperatorId,
        uint256 requestedAmountToClaim,
        address to
    ) internal {
        uint256 claimableShares = _getClaimableBondShares(nodeOperatorId);
        uint256 sharesToClaim = requestedAmountToClaim < claimableShares
            ? requestedAmountToClaim
            : claimableShares;
        if (sharesToClaim == 0) revert NothingToClaim();
        uint256 sharesBefore = LIDO.sharesOf(address(this));
        uint256 amount = WSTETH.wrap(_ethByShares(sharesToClaim));
        uint256 sharesAfter = LIDO.sharesOf(address(this));
        _unsafeReduceBond(nodeOperatorId, sharesBefore - sharesAfter);
        WSTETH.transfer(to, amount);
        emit BondClaimedWstETH(nodeOperatorId, to, amount);
    }

    /// @dev Burn Node Operator's bond shares (stETH). Shares will be burned on the next stETH rebase
    /// @dev The method sender should be granted as `Burner.REQUEST_BURN_SHARES_ROLE` and make stETH allowance for `Burner`
    /// @param amount Bond amount to burn in ETH (stETH)
    function _burn(uint256 nodeOperatorId, uint256 amount) internal {
        uint256 toBurnShares = _sharesByEth(amount);
        uint256 burnedShares = _reduceBond(nodeOperatorId, toBurnShares);
        // If no bond already
        if (burnedShares == 0) return;

        IBurner(LIDO_LOCATOR.burner()).requestBurnShares(
            address(this),
            burnedShares
        );
        emit BondBurned(
            nodeOperatorId,
            _ethByShares(toBurnShares),
            _ethByShares(burnedShares)
        );
    }

    /// @dev Transfer Node Operator's bond shares (stETH) to charge recipient to pay some fee
    /// @param amount Bond amount to charge in ETH (stETH)
    function _charge(
        uint256 nodeOperatorId,
        uint256 amount,
        address recipient
    ) internal returns (uint256 chargedShares) {
        uint256 toChargeShares = _sharesByEth(amount);
        chargedShares = _reduceBond(nodeOperatorId, toChargeShares);
        uint256 chargedEth = LIDO.transferShares(recipient, chargedShares);
        emit BondCharged(
            nodeOperatorId,
            _ethByShares(toChargeShares),
            chargedEth
        );
    }

    /// @dev Must be overridden in case of additional restrictions on a claimable bond amount
    function _getClaimableBondShares(
        uint256 nodeOperatorId
    ) internal view virtual returns (uint256) {
        return _getCSBondCoreStorage().bondShares[nodeOperatorId];
    }

    /// @dev Shortcut for Lido's getSharesByPooledEth
    function _sharesByEth(uint256 ethAmount) internal view returns (uint256) {
        if (ethAmount == 0) return 0;
        return LIDO.getSharesByPooledEth(ethAmount);
    }

    /// @dev Shortcut for Lido's getPooledEthByShares
    function _ethByShares(uint256 shares) internal view returns (uint256) {
        if (shares == 0) return 0;
        return LIDO.getPooledEthByShares(shares);
    }

    /// @dev Unsafe reduce bond shares (stETH) (possible underflow). Safety checks should be done outside
    function _unsafeReduceBond(uint256 nodeOperatorId, uint256 shares) private {
        CSBondCoreStorage storage $ = _getCSBondCoreStorage();
        $.bondShares[nodeOperatorId] -= shares;
        $.totalBondShares -= shares;
    }

    /// @dev Safe reduce bond shares (stETH). The maximum shares to reduce is the current bond shares
    function _reduceBond(
        uint256 nodeOperatorId,
        uint256 shares
    ) private returns (uint256 reducedShares) {
        uint256 currentShares = getBondShares(nodeOperatorId);
        reducedShares = shares < currentShares ? shares : currentShares;
        _unsafeReduceBond(nodeOperatorId, reducedShares);
    }

    function _getCSBondCoreStorage()
        private
        pure
        returns (CSBondCoreStorage storage $)
    {
        assembly {
            $.slot := CS_BOND_CORE_STORAGE_LOCATION
        }
    }
}

interface ICSBondCore {
    function totalBondShares() external view returns (uint256);

    function getBondShares(
        uint256 nodeOperatorId
    ) external view returns (uint256);

    function getBond(uint256 nodeOperatorId) external view returns (uint256);
}

interface ICSBondCurve {
    /// @dev Bond curve structure.
    /// It contains:
    ///  - points |> total bond amount for particular keys count
    ///  - trend  |> value for the next keys after described points
    ///
    /// For example, how the curve points look like:
    ///   Points Array Index  |>       0          1          2          i
    ///   Bond Amount         |>   [ 2 ETH ] [ 3.9 ETH ] [ 5.7 ETH ] [ ... ]
    ///   Keys Count          |>       1          2          3        i + 1
    ///
    ///   Bond Amount (ETH)
    ///       ^
    ///       |
    ///     6 -
    ///       | ------------------ 5.7 ETH --> .
    ///   5.5 -                              ..^
    ///       |                             .  |
    ///     5 -                            .   |
    ///       |                           .    |
    ///   4.5 -                          .     |
    ///       |                         .      |
    ///     4 -                       ..       |
    ///       | ------- 3.9 ETH --> ..         |
    ///   3.5 -                    .^          |
    ///       |                  .. |          |
    ///     3 -                ..   |          |
    ///       |               .     |          |
    ///   2.5 -              .      |          |
    ///       |            ..       |          |
    ///     2 - -------->..         |          |
    ///       |          ^          |          |
    ///       |----------|----------|----------|----------|----> Keys Count
    ///       |          1          2          3          i
    ///
    struct BondCurve {
        uint256[] points;
        uint256 trend;
    }

    // solhint-disable-next-line
    function DEFAULT_BOND_CURVE_ID() external view returns (uint256);

    function getCurveInfo(
        uint256 curveId
    ) external view returns (BondCurve memory);

    function getBondCurve(
        uint256 nodeOperatorId
    ) external view returns (BondCurve memory);

    function getBondCurveId(
        uint256 nodeOperatorId
    ) external view returns (uint256);

    function getBondAmountByKeysCount(
        uint256 keys,
        uint256 curveId
    ) external view returns (uint256);

    function getBondAmountByKeysCount(
        uint256 keys,
        BondCurve memory curve
    ) external view returns (uint256);

    function getKeysCountByBondAmount(
        uint256 amount,
        uint256 curveId
    ) external view returns (uint256);

    function getKeysCountByBondAmount(
        uint256 amount,
        BondCurve memory curve
    ) external view returns (uint256);
}

interface ICSBondLock {
    /// @dev Bond lock structure.
    /// It contains:
    ///  - amount         |> amount of locked bond
    ///  - retentionUntil |> timestamp until locked bond is retained
    struct BondLock {
        uint128 amount;
        uint128 retentionUntil;
    }

    function getBondLockRetentionPeriod()
        external
        view
        returns (uint256 retention);

    function getLockedBondInfo(
        uint256 nodeOperatorId
    ) external view returns (BondLock memory);

    function getActualLockedBond(
        uint256 nodeOperatorId
    ) external view returns (uint256);
}

interface IAssetRecovererLib {
    event EtherRecovered(address indexed recipient, uint256 amount);
    event ERC20Recovered(
        address indexed token,
        address indexed recipient,
        uint256 amount
    );
    event StETHSharesRecovered(address indexed recipient, uint256 shares);
    event ERC721Recovered(
        address indexed token,
        uint256 tokenId,
        address indexed recipient
    );
    event ERC1155Recovered(
        address indexed token,
        uint256 tokenId,
        address indexed recipient,
        uint256 amount
    );

    error FailedToSendEther();
    error NotAllowedToRecover();
}

interface ICSAccounting is
    ICSBondCore,
    ICSBondCurve,
    ICSBondLock,
    IAssetRecovererLib
{
    struct PermitInput {
        uint256 value;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    function feeDistributor() external view returns (ICSFeeDistributor);

    function chargePenaltyRecipient() external view returns (address);

    function getRequiredBondForNextKeys(
        uint256 nodeOperatorId,
        uint256 additionalKeys
    ) external view returns (uint256);

    function getBondAmountByKeysCountWstETH(
        uint256 keysCount,
        uint256 curveId
    ) external view returns (uint256);

    function getBondAmountByKeysCountWstETH(
        uint256 keysCount,
        BondCurve memory curve
    ) external view returns (uint256);

    function getRequiredBondForNextKeysWstETH(
        uint256 nodeOperatorId,
        uint256 additionalKeys
    ) external view returns (uint256);

    function getUnbondedKeysCount(
        uint256 nodeOperatorId
    ) external view returns (uint256);

    function getUnbondedKeysCountToEject(
        uint256 nodeOperatorId
    ) external view returns (uint256);

    function depositWstETH(
        address from,
        uint256 nodeOperatorId,
        uint256 wstETHAmount,
        PermitInput calldata permit
    ) external;

    function depositStETH(
        address from,
        uint256 nodeOperatorId,
        uint256 stETHAmount,
        PermitInput calldata permit
    ) external;

    function depositETH(address from, uint256 nodeOperatorId) external payable;

    function claimRewardsStETH(
        uint256 nodeOperatorId,
        uint256 stETHAmount,
        address rewardAddress,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external;

    function claimRewardsWstETH(
        uint256 nodeOperatorId,
        uint256 wstETHAmount,
        address rewardAddress,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external;

    function claimRewardsUnstETH(
        uint256 nodeOperatorId,
        uint256 stEthAmount,
        address rewardAddress,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external;

    function lockBondETH(uint256 nodeOperatorId, uint256 amount) external;

    function releaseLockedBondETH(
        uint256 nodeOperatorId,
        uint256 amount
    ) external;

    function settleLockedBondETH(uint256 nodeOperatorId) external;

    function compensateLockedBondETH(uint256 nodeOperatorId) external payable;

    function setBondCurve(uint256 nodeOperatorId, uint256 curveId) external;

    function resetBondCurve(uint256 nodeOperatorId) external;

    function penalize(uint256 nodeOperatorId, uint256 amount) external;

    function chargeFee(uint256 nodeOperatorId, uint256 amount) external;
}

contract CSAccounting is
    ICSAccounting,
    CSBondCore,
    CSBondCurve,
    CSBondLock,
    PausableUntil,
    AccessControlEnumerableUpgradeable,
    AssetRecoverer
{
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 public constant RESUME_ROLE = keccak256("RESUME_ROLE");
    bytes32 public constant ACCOUNTING_MANAGER_ROLE =
        keccak256("ACCOUNTING_MANAGER_ROLE");
    bytes32 public constant MANAGE_BOND_CURVES_ROLE =
        keccak256("MANAGE_BOND_CURVES_ROLE");
    bytes32 public constant SET_BOND_CURVE_ROLE =
        keccak256("SET_BOND_CURVE_ROLE");
    bytes32 public constant RESET_BOND_CURVE_ROLE =
        keccak256("RESET_BOND_CURVE_ROLE");
    bytes32 public constant RECOVERER_ROLE = keccak256("RECOVERER_ROLE");

    ICSModule public immutable CSM;
    ICSFeeDistributor public feeDistributor;
    address public chargePenaltyRecipient;

    event BondLockCompensated(uint256 indexed nodeOperatorId, uint256 amount);
    event ChargePenaltyRecipientSet(address chargePenaltyRecipient);

    error SenderIsNotCSM();
    error ZeroModuleAddress();
    error ZeroAdminAddress();
    error ZeroFeeDistributorAddress();
    error ZeroChargePenaltyRecipientAddress();
    error NodeOperatorDoesNotExist();
    error ElRewardsVaultReceiveFailed();

    modifier onlyCSM() {
        if (msg.sender != address(CSM)) revert SenderIsNotCSM();
        _;
    }

    /// @param lidoLocator Lido locator contract address
    /// @param communityStakingModule Community Staking Module contract address
    /// @param maxCurveLength Max number of the points in the bond curves
    /// @param minBondLockRetentionPeriod Min time in seconds for the bondLock retention period
    /// @param maxBondLockRetentionPeriod Max time in seconds for the bondLock retention period
    constructor(
        address lidoLocator,
        address communityStakingModule,
        uint256 maxCurveLength,
        uint256 minBondLockRetentionPeriod,
        uint256 maxBondLockRetentionPeriod
    )
        CSBondCore(lidoLocator)
        CSBondCurve(maxCurveLength)
        CSBondLock(minBondLockRetentionPeriod, maxBondLockRetentionPeriod)
    {
        if (communityStakingModule == address(0)) {
            revert ZeroModuleAddress();
        }
        CSM = ICSModule(communityStakingModule);

        _disableInitializers();
    }

    /// @param bondCurve Initial bond curve
    /// @param admin Admin role member address
    /// @param _feeDistributor Fee Distributor contract address
    /// @param bondLockRetentionPeriod Retention period for locked bond in seconds
    /// @param _chargePenaltyRecipient Recipient of the charge penalty type
    function initialize(
        uint256[] calldata bondCurve,
        address admin,
        address _feeDistributor,
        uint256 bondLockRetentionPeriod,
        address _chargePenaltyRecipient
    ) external initializer {
        __AccessControlEnumerable_init();
        __CSBondCurve_init(bondCurve);
        __CSBondLock_init(bondLockRetentionPeriod);

        if (admin == address(0)) {
            revert ZeroAdminAddress();
        }
        if (_feeDistributor == address(0)) {
            revert ZeroFeeDistributorAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(SET_BOND_CURVE_ROLE, address(CSM));
        _grantRole(RESET_BOND_CURVE_ROLE, address(CSM));

        feeDistributor = ICSFeeDistributor(_feeDistributor);

        _setChargePenaltyRecipient(_chargePenaltyRecipient);

        LIDO.approve(address(WSTETH), type(uint256).max);
        LIDO.approve(address(WITHDRAWAL_QUEUE), type(uint256).max);
        LIDO.approve(LIDO_LOCATOR.burner(), type(uint256).max);
    }

    /// @notice Resume reward claims and deposits
    function resume() external onlyRole(RESUME_ROLE) {
        _resume();
    }

    /// @notice Pause reward claims and deposits for `duration` seconds
    /// @dev Must be called together with `CSModule.pauseFor`
    /// @dev Passing MAX_UINT_256 as `duration` pauses indefinitely
    /// @param duration Duration of the pause in seconds
    function pauseFor(uint256 duration) external onlyRole(PAUSE_ROLE) {
        _pauseFor(duration);
    }

    /// @notice Set charge recipient address
    /// @param _chargePenaltyRecipient Charge recipient address
    function setChargePenaltyRecipient(
        address _chargePenaltyRecipient
    ) external onlyRole(ACCOUNTING_MANAGER_ROLE) {
        _setChargePenaltyRecipient(_chargePenaltyRecipient);
    }

    /// @notice Set bond lock retention period
    /// @param retention Period in seconds to retain bond lock
    function setLockedBondRetentionPeriod(
        uint256 retention
    ) external onlyRole(ACCOUNTING_MANAGER_ROLE) {
        CSBondLock._setBondLockRetentionPeriod(retention);
    }

    /// @notice Add a new bond curve
    /// @param bondCurve Bond curve definition to add
    /// @return id Id of the added curve
    function addBondCurve(
        uint256[] calldata bondCurve
    ) external onlyRole(MANAGE_BOND_CURVES_ROLE) returns (uint256 id) {
        id = CSBondCurve._addBondCurve(bondCurve);
    }

    /// @notice Update existing bond curve
    /// @dev If the curve is updated to a curve with higher values for any point,
    ///      Extensive checks should be performed to avoid inconsistency in the keys accounting
    /// @param curveId Bond curve ID to update
    /// @param bondCurve Bond curve definition
    function updateBondCurve(
        uint256 curveId,
        uint256[] calldata bondCurve
    ) external onlyRole(MANAGE_BOND_CURVES_ROLE) {
        CSBondCurve._updateBondCurve(curveId, bondCurve);
    }

    /// @notice Set the bond curve for the given Node Operator
    /// @dev If called externally, the `normalizeQueue` method from CSModule.sol should be called after
    ///      to ensure key pointers consistency
    /// @param nodeOperatorId ID of the Node Operator
    /// @param curveId ID of the bond curve to set
    function setBondCurve(
        uint256 nodeOperatorId,
        uint256 curveId
    ) external onlyRole(SET_BOND_CURVE_ROLE) {
        _onlyExistingNodeOperator(nodeOperatorId);
        CSBondCurve._setBondCurve(nodeOperatorId, curveId);
    }

    /// @notice Reset bond curve to the default one for the given Node Operator
    /// @dev If called externally, the `normalizeQueue` method from CSModule.sol should be called after
    ///      to ensure key pointers consistency
    /// @param nodeOperatorId ID of the Node Operator
    function resetBondCurve(
        uint256 nodeOperatorId
    ) external onlyRole(RESET_BOND_CURVE_ROLE) {
        _onlyExistingNodeOperator(nodeOperatorId);
        CSBondCurve._resetBondCurve(nodeOperatorId);
    }

    /// @notice Stake user's ETH with Lido and deposit stETH to the bond
    /// @dev Called by CSM exclusively
    /// @param from Address to stake ETH and deposit stETH from
    /// @param nodeOperatorId ID of the Node Operator
    function depositETH(
        address from,
        uint256 nodeOperatorId
    ) external payable whenResumed onlyCSM {
        CSBondCore._depositETH(from, nodeOperatorId);
    }

    /// @notice Deposit user's stETH to the bond for the given Node Operator
    /// @dev Called by CSM exclusively
    /// @param from Address to deposit stETH from
    /// @param nodeOperatorId ID of the Node Operator
    /// @param stETHAmount Amount of stETH to deposit
    /// @param permit stETH permit for the contract
    function depositStETH(
        address from,
        uint256 nodeOperatorId,
        uint256 stETHAmount,
        PermitInput calldata permit
    ) external whenResumed onlyCSM {
        // @dev for some reason foundry coverage consider this if as not fully covered. Check tests to see it is covered indeed
        // preventing revert for already used permit or avoid permit usage in case of value == 0
        if (
            permit.value > 0 &&
            LIDO.allowance(from, address(this)) < permit.value
        ) {
            // solhint-disable-next-line func-named-parameters
            LIDO.permit(
                from,
                address(this),
                permit.value,
                permit.deadline,
                permit.v,
                permit.r,
                permit.s
            );
        }

        CSBondCore._depositStETH(from, nodeOperatorId, stETHAmount);
    }

    /// @notice Unwrap the user's wstETH and deposit stETH to the bond for the given Node Operator
    /// @dev Called by CSM exclusively
    /// @param from Address to unwrap wstETH from
    /// @param nodeOperatorId ID of the Node Operator
    /// @param wstETHAmount Amount of wstETH to deposit
    /// @param permit wstETH permit for the contract
    function depositWstETH(
        address from,
        uint256 nodeOperatorId,
        uint256 wstETHAmount,
        PermitInput calldata permit
    ) external whenResumed onlyCSM {
        // @dev for some reason foundry coverage consider this if as not fully covered. Check tests to see it is covered indeed
        // preventing revert for already used permit or avoid permit usage in case of value == 0
        if (
            permit.value > 0 &&
            WSTETH.allowance(from, address(this)) < permit.value
        ) {
            // solhint-disable-next-line func-named-parameters
            WSTETH.permit(
                from,
                address(this),
                permit.value,
                permit.deadline,
                permit.v,
                permit.r,
                permit.s
            );
        }

        CSBondCore._depositWstETH(from, nodeOperatorId, wstETHAmount);
    }

    /// @notice Claim full reward (fee + bond) in stETH for the given Node Operator with desirable value.
    ///         `rewardsProof` and `cumulativeFeeShares` might be empty in order to claim only excess bond
    /// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    /// @param stETHAmount Amount of stETH to claim
    /// @param rewardAddress Reward address of the node operator
    /// @param cumulativeFeeShares Cumulative fee stETH shares for the Node Operator
    /// @param rewardsProof Merkle proof of the rewards
    /// @dev It's impossible to use single-leaf proof via this method, so this case should be treated carefully by
    /// off-chain tooling, e.g. to make sure a tree has at least 2 leafs.
    function claimRewardsStETH(
        uint256 nodeOperatorId,
        uint256 stETHAmount,
        address rewardAddress,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external whenResumed onlyCSM {
        if (rewardsProof.length != 0) {
            _pullFeeRewards(nodeOperatorId, cumulativeFeeShares, rewardsProof);
        }
        CSBondCore._claimStETH(nodeOperatorId, stETHAmount, rewardAddress);
    }

    /// @notice Claim full reward (fee + bond) in wstETH for the given Node Operator available for this moment.
    ///         `rewardsProof` and `cumulativeFeeShares` might be empty in order to claim only excess bond
    /// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    /// @param wstETHAmount Amount of wstETH to claim
    /// @param rewardAddress Reward address of the node operator
    /// @param cumulativeFeeShares Cumulative fee stETH shares for the Node Operator
    /// @param rewardsProof Merkle proof of the rewards
    /// @dev It's impossible to use single-leaf proof via this method, so this case should be treated carefully by
    /// off-chain tooling, e.g. to make sure a tree has at least 2 leafs.
    function claimRewardsWstETH(
        uint256 nodeOperatorId,
        uint256 wstETHAmount,
        address rewardAddress,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external whenResumed onlyCSM {
        if (rewardsProof.length != 0) {
            _pullFeeRewards(nodeOperatorId, cumulativeFeeShares, rewardsProof);
        }
        CSBondCore._claimWstETH(nodeOperatorId, wstETHAmount, rewardAddress);
    }

    /// @notice Request full reward (fee + bond) in Withdrawal NFT (unstETH) for the given Node Operator available for this moment.
    ///         `rewardsProof` and `cumulativeFeeShares` might be empty in order to claim only excess bond
    /// @dev Reverts if amount isn't between `MIN_STETH_WITHDRAWAL_AMOUNT` and `MAX_STETH_WITHDRAWAL_AMOUNT`
    /// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    /// @param stEthAmount Amount of ETH to request
    /// @param rewardAddress Reward address of the node operator
    /// @param cumulativeFeeShares Cumulative fee stETH shares for the Node Operator
    /// @param rewardsProof Merkle proof of the rewards
    /// @dev It's impossible to use single-leaf proof via this method, so this case should be treated carefully by
    /// off-chain tooling, e.g. to make sure a tree has at least 2 leafs.
    function claimRewardsUnstETH(
        uint256 nodeOperatorId,
        uint256 stEthAmount,
        address rewardAddress,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external whenResumed onlyCSM {
        if (rewardsProof.length != 0) {
            _pullFeeRewards(nodeOperatorId, cumulativeFeeShares, rewardsProof);
        }
        CSBondCore._claimUnstETH(nodeOperatorId, stEthAmount, rewardAddress);
    }

    /// @notice Lock bond in ETH for the given Node Operator
    /// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    /// @param amount Amount to lock in ETH (stETH)
    function lockBondETH(
        uint256 nodeOperatorId,
        uint256 amount
    ) external onlyCSM {
        CSBondLock._lock(nodeOperatorId, amount);
    }

    /// @notice Release locked bond in ETH for the given Node Operator
    /// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    /// @param amount Amount to release in ETH (stETH)
    function releaseLockedBondETH(
        uint256 nodeOperatorId,
        uint256 amount
    ) external onlyCSM {
        CSBondLock._reduceAmount(nodeOperatorId, amount);
    }

    /// @notice Compensate locked bond ETH for the given Node Operator
    //// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    function compensateLockedBondETH(
        uint256 nodeOperatorId
    ) external payable onlyCSM {
        (bool success, ) = LIDO_LOCATOR.elRewardsVault().call{
            value: msg.value
        }("");
        if (!success) revert ElRewardsVaultReceiveFailed();
        CSBondLock._reduceAmount(nodeOperatorId, msg.value);
        emit BondLockCompensated(nodeOperatorId, msg.value);
    }

    /// @notice Settle locked bond ETH for the given Node Operator
    /// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    function settleLockedBondETH(uint256 nodeOperatorId) external onlyCSM {
        uint256 lockedAmount = CSBondLock.getActualLockedBond(nodeOperatorId);
        if (lockedAmount > 0) {
            CSBondCore._burn(nodeOperatorId, lockedAmount);
            // reduce all locked bond even if bond isn't covered lock fully
            CSBondLock._remove(nodeOperatorId);
        }
    }

    /// @notice Penalize bond by burning stETH shares of the given Node Operator
    /// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    /// @param amount Amount to penalize in ETH (stETH)
    function penalize(uint256 nodeOperatorId, uint256 amount) external onlyCSM {
        CSBondCore._burn(nodeOperatorId, amount);
    }

    /// @notice Charge fee from bond by transferring stETH shares of the given Node Operator to the charge recipient
    /// @dev Called by CSM exclusively
    /// @param nodeOperatorId ID of the Node Operator
    /// @param amount Amount to charge in ETH (stETH)
    function chargeFee(
        uint256 nodeOperatorId,
        uint256 amount
    ) external onlyCSM {
        CSBondCore._charge(nodeOperatorId, amount, chargePenaltyRecipient);
    }

    /// @notice Pull fees from CSFeeDistributor to the Node Operator's bond
    /// @dev Permissionless method. Can be called before penalty application to ensure that rewards are also penalized
    /// @param nodeOperatorId ID of the Node Operator
    /// @param cumulativeFeeShares Cumulative fee stETH shares for the Node Operator
    /// @param rewardsProof Merkle proof of the rewards
    function pullFeeRewards(
        uint256 nodeOperatorId,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) external {
        _onlyExistingNodeOperator(nodeOperatorId);
        _pullFeeRewards(nodeOperatorId, cumulativeFeeShares, rewardsProof);
    }

    /// @notice Recover ERC20 tokens from the contract
    /// @param token Address of the ERC20 token to recover
    /// @param amount Amount of the ERC20 token to recover
    function recoverERC20(address token, uint256 amount) external override {
        _onlyRecoverer();
        if (token == address(LIDO)) {
            revert NotAllowedToRecover();
        }
        AssetRecovererLib.recoverERC20(token, amount);
    }

    /// @notice Recover all stETH shares from the contract
    /// @dev Accounts for the bond funds stored during recovery
    function recoverStETHShares() external {
        _onlyRecoverer();
        uint256 shares = LIDO.sharesOf(address(this)) - totalBondShares();
        AssetRecovererLib.recoverStETHShares(address(LIDO), shares);
    }

    /// @notice Service method to update allowance to Burner in case it has changed
    function renewBurnerAllowance() external {
        LIDO.approve(LIDO_LOCATOR.burner(), type(uint256).max);
    }

    /// @notice Get current and required bond amounts in ETH (stETH) for the given Node Operator
    /// @dev To calculate excess bond amount subtract `required` from `current` value.
    ///      To calculate missed bond amount subtract `current` from `required` value
    /// @param nodeOperatorId ID of the Node Operator
    /// @return current Current bond amount in ETH
    /// @return required Required bond amount in ETH
    function getBondSummary(
        uint256 nodeOperatorId
    ) public view returns (uint256 current, uint256 required) {
        unchecked {
            current = CSBondCore.getBond(nodeOperatorId);
            // @dev 'getActualLockedBond' is uint128, so no overflow expected in practice
            required =
                CSBondCurve.getBondAmountByKeysCount(
                    CSM.getNodeOperatorNonWithdrawnKeys(nodeOperatorId),
                    CSBondCurve.getBondCurve(nodeOperatorId)
                ) +
                CSBondLock.getActualLockedBond(nodeOperatorId);
        }
    }

    /// @notice Get current and required bond amounts in stETH shares for the given Node Operator
    /// @dev To calculate excess bond amount subtract `required` from `current` value.
    ///      To calculate missed bond amount subtract `current` from `required` value
    /// @param nodeOperatorId ID of the Node Operator
    /// @return current Current bond amount in stETH shares
    /// @return required Required bond amount in stETH shares
    function getBondSummaryShares(
        uint256 nodeOperatorId
    ) public view returns (uint256 current, uint256 required) {
        unchecked {
            current = CSBondCore.getBondShares(nodeOperatorId);
            // @dev 'getActualLockedBond' is uint128, so no overflow expected in practice
            required = _sharesByEth(
                CSBondCurve.getBondAmountByKeysCount(
                    CSM.getNodeOperatorNonWithdrawnKeys(nodeOperatorId),
                    CSBondCurve.getBondCurve(nodeOperatorId)
                ) + CSBondLock.getActualLockedBond(nodeOperatorId)
            );
        }
    }

    /// @notice Get the number of the unbonded keys
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Unbonded keys count
    function getUnbondedKeysCount(
        uint256 nodeOperatorId
    ) public view returns (uint256) {
        return
            _getUnbondedKeysCount({
                nodeOperatorId: nodeOperatorId,
                accountLockedBond: true
            });
    }

    /// @notice Get the number of the unbonded keys to be ejected using a forcedTargetLimit
    /// @param nodeOperatorId ID of the Node Operator
    /// @return Unbonded keys count
    function getUnbondedKeysCountToEject(
        uint256 nodeOperatorId
    ) public view returns (uint256) {
        return
            _getUnbondedKeysCount({
                nodeOperatorId: nodeOperatorId,
                accountLockedBond: false
            });
    }

    /// @notice Get the required bond in ETH (inc. missed and excess) for the given Node Operator to upload new deposit data
    /// @param nodeOperatorId ID of the Node Operator
    /// @param additionalKeys Number of new keys to add
    /// @return Required bond amount in ETH
    function getRequiredBondForNextKeys(
        uint256 nodeOperatorId,
        uint256 additionalKeys
    ) public view returns (uint256) {
        uint256 current = CSBondCore.getBond(nodeOperatorId);
        uint256 requiredForNewTotalKeys = CSBondCurve.getBondAmountByKeysCount(
            CSM.getNodeOperatorNonWithdrawnKeys(nodeOperatorId) +
                additionalKeys,
            CSBondCurve.getBondCurve(nodeOperatorId)
        );
        uint256 totalRequired = requiredForNewTotalKeys +
            CSBondLock.getActualLockedBond(nodeOperatorId);

        unchecked {
            return totalRequired > current ? totalRequired - current : 0;
        }
    }

    /// @notice Get the bond amount in wstETH required for the `keysCount` keys using the default bond curve
    /// @param keysCount Keys count to calculate the required bond amount
    /// @param curveId Id of the curve to perform calculations against
    /// @return wstETH amount required for the `keysCount`
    function getBondAmountByKeysCountWstETH(
        uint256 keysCount,
        uint256 curveId
    ) public view returns (uint256) {
        return
            _sharesByEth(
                CSBondCurve.getBondAmountByKeysCount(keysCount, curveId)
            );
    }

    /// @notice Get the bond amount in wstETH required for the `keysCount` keys using the custom bond curve
    /// @param keysCount Keys count to calculate the required bond amount
    /// @param curve Bond curve definition.
    ///              Use CSBondCurve.getBondCurve(id) method to get the definition for the exiting curve
    /// @return wstETH amount required for the `keysCount`
    function getBondAmountByKeysCountWstETH(
        uint256 keysCount,
        BondCurve memory curve
    ) public view returns (uint256) {
        return
            _sharesByEth(
                CSBondCurve.getBondAmountByKeysCount(keysCount, curve)
            );
    }

    /// @notice Get the required bond in wstETH (inc. missed and excess) for the given Node Operator to upload new keys
    /// @param nodeOperatorId ID of the Node Operator
    /// @param additionalKeys Number of new keys to add
    /// @return Required bond in wstETH
    function getRequiredBondForNextKeysWstETH(
        uint256 nodeOperatorId,
        uint256 additionalKeys
    ) public view returns (uint256) {
        return
            _sharesByEth(
                getRequiredBondForNextKeys(nodeOperatorId, additionalKeys)
            );
    }

    function _pullFeeRewards(
        uint256 nodeOperatorId,
        uint256 cumulativeFeeShares,
        bytes32[] calldata rewardsProof
    ) internal {
        uint256 distributed = feeDistributor.distributeFees(
            nodeOperatorId,
            cumulativeFeeShares,
            rewardsProof
        );
        CSBondCore._increaseBond(nodeOperatorId, distributed);
    }

    /// @dev Overrides the original implementation to account for a locked bond and withdrawn validators
    function _getClaimableBondShares(
        uint256 nodeOperatorId
    ) internal view override returns (uint256) {
        unchecked {
            uint256 current = CSBondCore.getBondShares(nodeOperatorId);
            uint256 required = _sharesByEth(
                CSBondCurve.getBondAmountByKeysCount(
                    CSM.getNodeOperatorNonWithdrawnKeys(nodeOperatorId),
                    CSBondCurve.getBondCurve(nodeOperatorId)
                ) + CSBondLock.getActualLockedBond(nodeOperatorId)
            );
            return current > required ? current - required : 0;
        }
    }

    /// @dev Unbonded stands for the amount of the keys not fully covered with the bond
    function _getUnbondedKeysCount(
        uint256 nodeOperatorId,
        bool accountLockedBond
    ) internal view returns (uint256) {
        uint256 nonWithdrawnKeys = CSM.getNodeOperatorNonWithdrawnKeys(
            nodeOperatorId
        );
        unchecked {
            /// 10 wei added to account for possible stETH rounding errors
            /// https://github.com/lidofinance/lido-dao/issues/442#issuecomment-1182264205.
            /// Should be sufficient for ~ 40 years
            uint256 currentBond = CSBondCore._ethByShares(
                getBondShares(nodeOperatorId)
            ) + 10 wei;
            if (accountLockedBond) {
                uint256 lockedBond = CSBondLock.getActualLockedBond(
                    nodeOperatorId
                );
                if (currentBond <= lockedBond) return nonWithdrawnKeys;
                currentBond -= lockedBond;
            }
            uint256 bondedKeys = CSBondCurve.getKeysCountByBondAmount(
                currentBond,
                CSBondCurve.getBondCurve(nodeOperatorId)
            );
            return
                nonWithdrawnKeys > bondedKeys
                    ? nonWithdrawnKeys - bondedKeys
                    : 0;
        }
    }

    function _onlyRecoverer() internal view override {
        _checkRole(RECOVERER_ROLE);
    }

    function _onlyExistingNodeOperator(uint256 nodeOperatorId) internal view {
        if (nodeOperatorId < CSM.getNodeOperatorsCount()) return;
        revert NodeOperatorDoesNotExist();
    }

    function _setChargePenaltyRecipient(
        address _chargePenaltyRecipient
    ) private {
        if (_chargePenaltyRecipient == address(0)) {
            revert ZeroChargePenaltyRecipientAddress();
        }
        chargePenaltyRecipient = _chargePenaltyRecipient;
        emit ChargePenaltyRecipientSet(_chargePenaltyRecipient);
    }
}