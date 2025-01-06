// SPDX-License-Identifier: Unknown
pragma solidity 0.8.19;

library SafeERC20Upgradeable {
    using AddressUpgradeable for address;

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20Upgradeable token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20Upgradeable token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(IERC20Upgradeable token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20Upgradeable token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance + value));
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20Upgradeable token, address spender, uint256 value) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance - value));
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20Upgradeable token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeWithSelector(token.approve.selector, spender, value);

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, 0));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Use a ERC-2612 signature to set the `owner` approval toward `spender` on `token`.
     * Revert on invalid signature.
     */
    function safePermit(
        IERC20PermitUpgradeable token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20Upgradeable token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        require(returndata.length == 0 || abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20Upgradeable token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return
            success && (returndata.length == 0 || abi.decode(returndata, (bool))) && AddressUpgradeable.isContract(address(token));
    }
}

library Utils {
  /**
   * @notice Performs a gas optimized keccak hash for two bytes32 values.
   * @param _left Left value.
   * @param _right Right value.
   */
  function _efficientKeccak(bytes32 _left, bytes32 _right) internal pure returns (bytes32 value) {
    /// @solidity memory-safe-assembly
    assembly {
      mstore(0x00, _left)
      mstore(0x20, _right)
      value := keccak256(0x00, 0x40)
    }
  }

  /**
   * @notice Performs a gas optimized keccak hash for uint256 and address.
   * @param _left Left value.
   * @param _right Right value.
   */
  function _efficientKeccak(uint256 _left, address _right) internal pure returns (bytes32 value) {
    /// @solidity memory-safe-assembly
    assembly {
      mstore(0x00, _left)
      mstore(0x20, _right)
      value := keccak256(0x00, 0x40)
    }
  }
}

abstract contract StorageFiller39 {
  /// @dev Keep free storage slots for future implementation updates to avoid storage collision.
  uint256[39] private __gap_39;
}

interface IPermissionsManager {
  /**
   * @notice Structure defining a role and its associated address.
   * @param addressWithRole The address with the role.
   * @param role The role associated with the address.
   */
  struct RoleAddress {
    address addressWithRole;
    bytes32 role;
  }
}

abstract contract PermissionsManager is Initializable, AccessControlUpgradeable, IPermissionsManager, IGenericErrors {
  /**
   * @notice Sets permissions for a list of addresses and their roles.
   * @param _roleAddresses The list of addresses and roles to assign permissions to.
   */
  function __Permissions_init(RoleAddress[] calldata _roleAddresses) internal onlyInitializing {
    for (uint256 i; i < _roleAddresses.length; i++) {
      if (_roleAddresses[i].addressWithRole == address(0)) {
        revert ZeroAddressNotAllowed();
      }

      if (_roleAddresses[i].role == 0x0) {
        revert ZeroHashNotAllowed();
      }

      _grantRole(_roleAddresses[i].role, _roleAddresses[i].addressWithRole);
    }
  }
}

interface IPauseManager {
  /**
   * @notice Structure defining a pause type and its associated role.
   * @dev This struct is used for both the `_pauseTypeRoles` and `_unPauseTypeRoles` mappings.
   * @param pauseType The type of pause.
   * @param role The role associated with the pause type.
   */
  struct PauseTypeRole {
    PauseType pauseType;
    bytes32 role;
  }

  /**
   * @notice Enum defining the different types of pausing.
   * @dev The pause types are used to pause and unpause specific functionality.
   * @dev The UNUSED pause type is used as a default value to avoid accidental general pausing.
   * @dev Enums are uint8 by default.
   */
  enum PauseType {
    UNUSED,
    GENERAL,
    L1_L2,
    L2_L1,
    BLOB_SUBMISSION,
    CALLDATA_SUBMISSION,
    FINALIZATION,
    INITIATE_TOKEN_BRIDGING,
    COMPLETE_TOKEN_BRIDGING
  }

  /**
   * @notice Emitted when a pause type is paused.
   * @param messageSender The address performing the pause.
   * @param pauseType The indexed pause type that was paused.
   */
  event Paused(address messageSender, PauseType indexed pauseType);

  /**
   * @notice Emitted when a pause type is unpaused.
   * @param messageSender The address performing the unpause.
   * @param pauseType The indexed pause type that was unpaused.
   */
  event UnPaused(address messageSender, PauseType indexed pauseType);

  /**
   * @notice Emitted when a pause type and its associated role are set in the `_pauseTypeRoles` mapping.
   * @param pauseType The indexed type of pause.
   * @param role The indexed role associated with the pause type.
   */
  event PauseTypeRoleSet(PauseType indexed pauseType, bytes32 indexed role);

  /**
   * @notice Emitted when an unpause type and its associated role are set in the `_unPauseTypeRoles` mapping.
   * @param unPauseType The indexed type of unpause.
   * @param role The indexed role associated with the unpause type.
   */
  event UnPauseTypeRoleSet(PauseType indexed unPauseType, bytes32 indexed role);

  /**
   * @dev Thrown when a specific pause type is paused.
   */
  error IsPaused(PauseType pauseType);

  /**
   * @dev Thrown when a specific pause type is not paused and expected to be.
   */
  error IsNotPaused(PauseType pauseType);

  /**
   * @notice Pauses functionality by specific type.
   * @dev Requires the role mapped in pauseTypeRoles for the pauseType.
   * @param _pauseType The pause type value.
   */
  function pauseByType(PauseType _pauseType) external;

  /**
   * @notice Unpauses functionality by specific type.
   * @dev Requires the role mapped in unPauseTypeRoles for the pauseType.
   * @param _pauseType The pause type value.
   */
  function unPauseByType(PauseType _pauseType) external;

  /**
   * @notice Check if a pause type is enabled.
   * @param _pauseType The pause type value.
   * @return pauseTypeIsPaused Returns true if the pause type if paused, false otherwise.
   */
  function isPaused(PauseType _pauseType) external view returns (bool pauseTypeIsPaused);
}

abstract contract PauseManager is Initializable, IPauseManager, AccessControlUpgradeable {
  /// @notice This is used to pause all pausable functions.
  bytes32 public constant PAUSE_ALL_ROLE = keccak256("PAUSE_ALL_ROLE");

  /// @notice This is used to unpause all unpausable functions.
  bytes32 public constant UNPAUSE_ALL_ROLE = keccak256("UNPAUSE_ALL_ROLE");

  // @dev DEPRECATED. USE _pauseTypeStatusesBitMap INSTEAD
  mapping(bytes32 pauseType => bool pauseStatus) public pauseTypeStatuses;

  /// @dev The bitmap containing the pause statuses mapped by type.
  uint256 private _pauseTypeStatusesBitMap;

  /// @dev This maps the pause type to the role that is allowed to pause it.
  mapping(PauseType pauseType => bytes32 role) private _pauseTypeRoles;

  /// @dev This maps the unpause type to the role that is allowed to unpause it.
  mapping(PauseType unPauseType => bytes32 role) private _unPauseTypeRoles;

  /// @dev Total contract storage is 11 slots with the gap below.
  /// @dev Keep 7 free storage slots for future implementation updates to avoid storage collision.
  /// @dev Note: This was reduced previously to cater for new functionality.
  uint256[7] private __gap;

  /**
   * @dev Modifier to make a function callable only when the specific and general types are not paused.
   * @param _pauseType The pause type value being checked.
   * Requirements:
   *
   * - The type must not be paused.
   */
  modifier whenTypeAndGeneralNotPaused(PauseType _pauseType) {
    _requireTypeAndGeneralNotPaused(_pauseType);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the type is not paused.
   * @param _pauseType The pause type value being checked.
   * Requirements:
   *
   * - The type must not be paused.
   */
  modifier whenTypeNotPaused(PauseType _pauseType) {
    _requireTypeNotPaused(_pauseType);
    _;
  }

  /**
   * @notice Initializes the pause manager with the given pause and unpause roles.
   * @dev This function is called during contract initialization to set up the pause and unpause roles.
   * @param _pauseTypeRoleAssignments An array of PauseTypeRole structs defining the pause types and their associated roles.
   * @param _unpauseTypeRoleAssignments An array of PauseTypeRole structs defining the unpause types and their associated roles.
   */
  function __PauseManager_init(
    PauseTypeRole[] calldata _pauseTypeRoleAssignments,
    PauseTypeRole[] calldata _unpauseTypeRoleAssignments
  ) internal onlyInitializing {
    for (uint256 i; i < _pauseTypeRoleAssignments.length; i++) {
      _pauseTypeRoles[_pauseTypeRoleAssignments[i].pauseType] = _pauseTypeRoleAssignments[i].role;
      emit PauseTypeRoleSet(_pauseTypeRoleAssignments[i].pauseType, _pauseTypeRoleAssignments[i].role);
    }

    for (uint256 i; i < _unpauseTypeRoleAssignments.length; i++) {
      _unPauseTypeRoles[_unpauseTypeRoleAssignments[i].pauseType] = _unpauseTypeRoleAssignments[i].role;
      emit UnPauseTypeRoleSet(_unpauseTypeRoleAssignments[i].pauseType, _unpauseTypeRoleAssignments[i].role);
    }
  }

  /**
   * @dev Throws if the specific or general types are paused.
   * @dev Checks the specific and general pause types.
   * @param _pauseType The pause type value being checked.
   */
  function _requireTypeAndGeneralNotPaused(PauseType _pauseType) internal view virtual {
    uint256 pauseBitMap = _pauseTypeStatusesBitMap;

    if (pauseBitMap & (1 << uint256(_pauseType)) != 0) {
      revert IsPaused(_pauseType);
    }

    if (pauseBitMap & (1 << uint256(PauseType.GENERAL)) != 0) {
      revert IsPaused(PauseType.GENERAL);
    }
  }

  /**
   * @dev Throws if the type is paused.
   * @dev Checks the specific pause type.
   * @param _pauseType The pause type value being checked.
   */
  function _requireTypeNotPaused(PauseType _pauseType) internal view virtual {
    if (isPaused(_pauseType)) {
      revert IsPaused(_pauseType);
    }
  }

  /**
   * @notice Pauses functionality by specific type.
   * @dev Requires the role mapped in `_pauseTypeRoles` for the pauseType.
   * @param _pauseType The pause type value.
   */
  function pauseByType(PauseType _pauseType) external onlyRole(_pauseTypeRoles[_pauseType]) {
    if (isPaused(_pauseType)) {
      revert IsPaused(_pauseType);
    }

    _pauseTypeStatusesBitMap |= 1 << uint256(_pauseType);
    emit Paused(_msgSender(), _pauseType);
  }

  /**
   * @notice Unpauses functionality by specific type.
   * @dev Requires the role mapped in `_unPauseTypeRoles` for the pauseType.
   * @param _pauseType The pause type value.
   */
  function unPauseByType(PauseType _pauseType) external onlyRole(_unPauseTypeRoles[_pauseType]) {
    if (!isPaused(_pauseType)) {
      revert IsNotPaused(_pauseType);
    }

    _pauseTypeStatusesBitMap &= ~(1 << uint256(_pauseType));
    emit UnPaused(_msgSender(), _pauseType);
  }

  /**
   * @notice Check if a pause type is enabled.
   * @param _pauseType The pause type value.
   * @return pauseTypeIsPaused Returns true if the pause type if paused, false otherwise.
   */
  function isPaused(PauseType _pauseType) public view returns (bool pauseTypeIsPaused) {
    pauseTypeIsPaused = (_pauseTypeStatusesBitMap & (1 << uint256(_pauseType))) != 0;
  }
}

abstract contract TokenBridgePauseManager is PauseManager {
  bytes32 public constant PAUSE_INITIATE_TOKEN_BRIDGING_ROLE = keccak256("PAUSE_INITIATE_TOKEN_BRIDGING_ROLE");
  bytes32 public constant UNPAUSE_INITIATE_TOKEN_BRIDGING_ROLE = keccak256("UNPAUSE_INITIATE_TOKEN_BRIDGING_ROLE");
  bytes32 public constant PAUSE_COMPLETE_TOKEN_BRIDGING_ROLE = keccak256("PAUSE_COMPLETE_TOKEN_BRIDGING_ROLE");
  bytes32 public constant UNPAUSE_COMPLETE_TOKEN_BRIDGING_ROLE = keccak256("UNPAUSE_COMPLETE_TOKEN_BRIDGING_ROLE");
}

interface IGenericErrors {
  /**
   * @dev Thrown when a parameter is the zero address.
   */
  error ZeroAddressNotAllowed();

  /**
   * @dev Thrown when a parameter is the zero hash.
   */
  error ZeroHashNotAllowed();

  /**
   * @dev Thrown when array lengths are mismatched.
   */
  error ArrayLengthsDoNotMatch();
}

abstract contract MessageServiceBase is Initializable, IGenericErrors {
  /// @notice The message service address on the current chain.
  IMessageService public messageService;

  /// @notice The token bridge on the alternate/remote chain.
  address public remoteSender;

  /// @dev Total contract storage is 12 slots with the gap below.
  /// @dev Keep 10 free storage slots for future implementation updates to avoid storage collision.
  uint256[10] private __base_gap;

  /**
   * @dev Event emitted when the remote sender is set.
   * @param remoteSender The address of the new remote sender.
   * @param setter The address of the account that set the remote sender.
   */
  event RemoteSenderSet(address indexed remoteSender, address indexed setter);

  /**
   * @dev Thrown when the caller address is not the message service address
   */
  error CallerIsNotMessageService();

  /**
   * @dev Thrown when remote sender address is not authorized.
   */
  error SenderNotAuthorized();

  /**
   * @dev Modifier to make sure the caller is the known message service.
   *
   * Requirements:
   *
   * - The msg.sender must be the message service.
   */
  modifier onlyMessagingService() {
    if (msg.sender != address(messageService)) {
      revert CallerIsNotMessageService();
    }
    _;
  }

  /**
   * @dev Modifier to make sure the original sender is allowed.
   *
   * Requirements:
   *
   * - The original message sender via the message service must be a known sender.
   */
  modifier onlyAuthorizedRemoteSender() {
    if (messageService.sender() != remoteSender) {
      revert SenderNotAuthorized();
    }
    _;
  }

  /**
   * @notice Initializes the message service
   * @dev Must be initialized in the initialize function of the main contract or constructor.
   * @param _messageService The message service address, cannot be empty.
   */
  function __MessageServiceBase_init(address _messageService) internal onlyInitializing {
    if (_messageService == address(0)) {
      revert ZeroAddressNotAllowed();
    }

    messageService = IMessageService(_messageService);
  }

  /**
   * @notice Sets the remote sender
   * @dev This function sets the remote sender address and emits the RemoteSenderSet event.
   * @param _remoteSender The authorized remote sender address, cannot be empty.
   */
  function _setRemoteSender(address _remoteSender) internal {
    if (_remoteSender == address(0)) {
      revert ZeroAddressNotAllowed();
    }

    remoteSender = _remoteSender;
    emit RemoteSenderSet(_remoteSender, msg.sender);
  }
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

library MathUpgradeable {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
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
     * This differs from standard division with `/` in that it rounds up instead
     * of rounding down.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
     * with further edits by Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
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
            require(denominator > prod1, "Math: mulDiv overflow");

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

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
            // See https://cs.stackexchange.com/q/138556/92363.

            // Does not overflow because the denominator cannot be zero at this stage in the function.
            uint256 twos = denominator & (~denominator + 1);
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

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
            // in modular arithmetic, doubling the correct bits in each step.
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
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
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
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2, rounded down, of a positive value.
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
            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10, rounded down, of a positive value.
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
            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256, rounded down, of a positive value.
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
            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
        }
    }
}

library SignedMathUpgradeable {
    /**
     * @dev Returns the largest of two signed numbers.
     */
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two signed numbers.
     */
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two signed numbers without overflow.
     * The result is rounded towards zero.
     */
    function average(int256 a, int256 b) internal pure returns (int256) {
        // Formula from the book "Hacker's Delight"
        int256 x = (a & b) + ((a ^ b) >> 1);
        return x + (int256(uint256(x) >> 255) & (a ^ b));
    }

    /**
     * @dev Returns the absolute unsigned value of a signed value.
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            // must be unchecked in order to support `n = type(int256).min`
            return uint256(n >= 0 ? n : -n);
        }
    }
}

library StringsUpgradeable {
    bytes16 private constant _SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = MathUpgradeable.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a `int256` to its ASCII `string` decimal representation.
     */
    function toString(int256 value) internal pure returns (string memory) {
        return string(abi.encodePacked(value < 0 ? "-" : "", toString(SignedMathUpgradeable.abs(value))));
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, MathUpgradeable.log256(value) + 1);
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
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

    /**
     * @dev Returns true if the two strings are equal.
     */
    function equal(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}

abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
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

    function __AccessControl_init() internal onlyInitializing {
    }

    function __AccessControl_init_unchained() internal onlyInitializing {
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
                        StringsUpgradeable.toHexString(account),
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

abstract contract ReentrancyGuardUpgradeable is Initializable {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    function __ReentrancyGuard_init() internal onlyInitializing {
        __ReentrancyGuard_init_unchained();
    }

    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
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
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
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
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
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
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
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
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
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
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
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
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
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
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
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
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
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
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
     * constructor.
     *
     * Emits an {Initialized} event.
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
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: setting the version to 255 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
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
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized != type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint8) {
        return _initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _initializing;
    }
}

interface ITokenBridge {
  /**
   * @dev Contract will be used as proxy implementation.
   * @param defaultAdmin The account to be given DEFAULT_ADMIN_ROLE on initialization.
   * @param messageService The address of the MessageService contract.
   * @param tokenBeacon The address of the tokenBeacon.
   * @param sourceChainId The source chain id of the current layer.
   * @param targetChainId The target chaind id of the targeted layer.
   * @param reservedTokens The list of reserved tokens to be set.
   * @param roleAddresses The list of addresses and roles to assign permissions to.
   * @param pauseTypeRoles The list of pause types to associate with roles.
   * @param unpauseTypeRoles The list of unpause types to associate with roles.
   */
  struct InitializationData {
    address defaultAdmin;
    address messageService;
    address tokenBeacon;
    uint256 sourceChainId;
    uint256 targetChainId;
    address[] reservedTokens;
    IPermissionsManager.RoleAddress[] roleAddresses;
    IPauseManager.PauseTypeRole[] pauseTypeRoles;
    IPauseManager.PauseTypeRole[] unpauseTypeRoles;
  }

  /**
   * @notice Emitted when the token address is reserved.
   * @param token The indexed token address.
   */
  event TokenReserved(address indexed token);

  /**
   * @notice Emitted when the token address reservation is removed.
   * @param token The indexed token address.
   */
  event ReservationRemoved(address indexed token);

  /**
   * @notice Emitted when the custom token address is set.
   * @param nativeToken The indexed nativeToken token address.
   * @param customContract The indexed custom contract address.
   * @param setBy The indexed address of who set the custom contract.
   */
  event CustomContractSet(address indexed nativeToken, address indexed customContract, address indexed setBy);

  /**
   * @notice Emitted when token bridging is initiated.
   * @dev DEPRECATED in favor of BridgingInitiatedV2.
   * @param sender The indexed sender address.
   * @param recipient The recipient address.
   * @param token The indexed token address.
   * @param amount The indexed token amount.
   */
  event BridgingInitiated(address indexed sender, address recipient, address indexed token, uint256 indexed amount);

  /**
   * @notice Emitted when token bridging is initiated.
   * @param sender The indexed sender address.
   * @param recipient The indexed recipient address.
   * @param token The indexed token address.
   * @param amount The token amount.
   */
  event BridgingInitiatedV2(address indexed sender, address indexed recipient, address indexed token, uint256 amount);

  /**
   * @notice Emitted when token bridging is finalized.
   * @dev DEPRECATED in favor of BridgingFinalizedV2.
   * @param nativeToken The indexed native token address.
   * @param bridgedToken The indexed bridged token address.
   * @param amount The indexed token amount.
   * @param recipient The recipient address.
   */
  event BridgingFinalized(
    address indexed nativeToken,
    address indexed bridgedToken,
    uint256 indexed amount,
    address recipient
  );

  /**
   * @notice Emitted when token bridging is finalized.
   * @param nativeToken The indexed native token address.
   * @param bridgedToken The indexed bridged token address.
   * @param amount The token amount.
   * @param recipient The indexed recipient address.
   */
  event BridgingFinalizedV2(
    address indexed nativeToken,
    address indexed bridgedToken,
    uint256 amount,
    address indexed recipient
  );

  /**
   * @notice Emitted when a new token is seen being bridged on the origin chain for the first time.
   * @param token The indexed token address.
   */
  event NewToken(address indexed token);

  /**
   * @notice Emitted when a new token is deployed.
   * @param bridgedToken The indexed bridged token address.
   * @param nativeToken The indexed native token address.
   */
  event NewTokenDeployed(address indexed bridgedToken, address indexed nativeToken);

  /**
   * @notice Emitted when the remote token bridge is set.
   * @param remoteTokenBridge The indexed remote token bridge address.
   * @param setBy The indexed address that set the remote token bridge.
   */
  event RemoteTokenBridgeSet(address indexed remoteTokenBridge, address indexed setBy);

  /**
   * @notice Emitted when the token is set as deployed.
   * @dev This can be triggered by anyone calling confirmDeployment on the alternate chain.
   * @param token The indexed token address.
   */
  event TokenDeployed(address indexed token);

  /**
   * @notice Emitted when the token deployment is confirmed.
   * @dev This can be triggered by anyone provided there is correctly mapped token data.
   * @param tokens The token address list.
   * @param confirmedBy The indexed address confirming deployment.
   */
  event DeploymentConfirmed(address[] tokens, address indexed confirmedBy);

  /**
   * @notice Emitted when the message service address is set.
   * @param newMessageService The indexed new message service address.
   * @param oldMessageService The indexed old message service address.
   * @param setBy The indexed address setting the new message service address.
   */
  event MessageServiceUpdated(
    address indexed newMessageService,
    address indexed oldMessageService,
    address indexed setBy
  );

  /**
   * @dev Thrown when attempting to bridge a reserved token.
   */
  error ReservedToken(address token);

  /**
   * @dev Thrown when the remote token bridge is already set.
   */
  error RemoteTokenBridgeAlreadySet(address remoteTokenBridge);

  /**
   * @dev Thrown when attempting to reserve an already bridged token.
   */
  error AlreadyBridgedToken(address token);

  /**
   * @dev Thrown when the permit data is invalid.
   */
  error InvalidPermitData(bytes4 permitData, bytes4 permitSelector);

  /**
   * @dev Thrown when the permit is not from the sender.
   */
  error PermitNotFromSender(address owner);

  /**
   * @dev Thrown when the permit does not grant spending to the bridge.
   */
  error PermitNotAllowingBridge(address spender);

  /**
   * @dev Thrown when the amount being bridged is zero.
   */
  error ZeroAmountNotAllowed(uint256 amount);

  /**
   * @dev Thrown when trying to unreserve a non-reserved token.
   */
  error NotReserved(address token);

  /**
   * @dev Thrown when trying to confirm deployment of a non-deployed token.
   */
  error TokenNotDeployed(address token);

  /**
   * @dev Thrown when trying to set a custom contract on a bridged token.
   */
  error AlreadyBrigedToNativeTokenSet(address token);

  /**
   * @dev Thrown when trying to set a custom contract on an already set token.
   */
  error NativeToBridgedTokenAlreadySet(address token);

  /**
   * @dev Thrown when trying to set a token that is already either native, deployed or reserved.
   */
  error StatusAddressNotAllowed(address token);

  /**
   * @dev Thrown when the decimals for a token cannot be determined.
   */
  error DecimalsAreUnknown(address token);

  /**
   * @dev Thrown when the token list is empty.
   */
  error TokenListEmpty();

  /**
   * @notice Similar to `bridgeToken` function but allows to pass additional
   *   permit data to do the ERC20 approval in a single transaction.
   * @param _token The address of the token to be bridged.
   * @param _amount The amount of the token to be bridged.
   * @param _recipient The address that will receive the tokens on the other chain.
   * @param _permitData The permit data for the token, if applicable.
   */
  function bridgeTokenWithPermit(
    address _token,
    uint256 _amount,
    address _recipient,
    bytes calldata _permitData
  ) external payable;

  /**
   * @dev It can only be called from the Message Service. To finalize the bridging
   *   process, a user or postmen needs to use the `claimMessage` function of the
   *   Message Service to trigger the transaction.
   * @param _nativeToken The address of the token on its native chain.
   * @param _amount The amount of the token to be received.
   * @param _recipient The address that will receive the tokens.
   * @param _chainId The source chainId or target chaindId for this token
   * @param _tokenMetadata Additional data used to deploy the bridged token if it
   *   doesn't exist already.
   */
  function completeBridging(
    address _nativeToken,
    uint256 _amount,
    address _recipient,
    uint256 _chainId,
    bytes calldata _tokenMetadata
  ) external;

  /**
   * @dev Change the status to DEPLOYED to the tokens passed in parameter
   *    Will call the method setDeployed on the other chain using the message Service
   * @param _tokens Array of bridged tokens that have been deployed.
   */
  function confirmDeployment(address[] memory _tokens) external payable;

  /**
   * @dev Change the address of the Message Service.
   * @param _messageService The address of the new Message Service.
   */
  function setMessageService(address _messageService) external;

  /**
   * @dev It can only be called from the Message Service. To change the status of
   *   the native tokens to DEPLOYED meaning they have been deployed on the other chain
   *   a user or postman needs to use the `claimMessage` function of the
   *   Message Service to trigger the transaction.
   * @param _nativeTokens The addresses of the native tokens.
   */
  function setDeployed(address[] memory _nativeTokens) external;

  /**
   * @dev Linea can reserve tokens. In this case, the token cannot be bridged.
   *   Linea can only reserve tokens that have not been bridged before.
   * @notice Make sure that _token is native to the current chain
   *   where you are calling this function from
   * @param _token The address of the token to be set as reserved.
   */
  function setReserved(address _token) external;

  /**
   * @dev Sets the address of the remote token bridge. Can only be called once.
   * @param _remoteTokenBridge The address of the remote token bridge to be set.
   */
  function setRemoteTokenBridge(address _remoteTokenBridge) external;

  /**
   * @dev Removes a token from the reserved list.
   * @param _token The address of the token to be removed from the reserved list.
   */
  function removeReserved(address _token) external;

  /**
   * @dev Linea can set a custom ERC20 contract for specific ERC20.
   *   For security purpose, Linea can only call this function if the token has
   *   not been bridged yet.
   * @param _nativeToken address of the token on the source chain.
   * @param _targetContract address of the custom contract.
   */
  function setCustomContract(address _nativeToken, address _targetContract) external;
}

contract TokenBridge is
  ITokenBridge,
  Initializable,
  ReentrancyGuardUpgradeable,
  AccessControlUpgradeable,
  MessageServiceBase,
  TokenBridgePauseManager,
  PermissionsManager,
  StorageFiller39
{
  using Utils for *;
  using SafeERC20Upgradeable for IERC20Upgradeable;

  /// @dev This is the ABI version and not the reinitialize version.
  string public constant CONTRACT_VERSION = "1.0";

  /// @notice Role used for setting the message service address.
  bytes32 public constant SET_MESSAGE_SERVICE_ROLE = keccak256("SET_MESSAGE_SERVICE_ROLE");

  /// @notice Role used for setting the remote token bridge address.
  bytes32 public constant SET_REMOTE_TOKENBRIDGE_ROLE = keccak256("SET_REMOTE_TOKENBRIDGE_ROLE");

  /// @notice Role used for setting a reserved token address.
  bytes32 public constant SET_RESERVED_TOKEN_ROLE = keccak256("SET_RESERVED_TOKEN_ROLE");

  /// @notice Role used for removing a reserved token address.
  bytes32 public constant REMOVE_RESERVED_TOKEN_ROLE = keccak256("REMOVE_RESERVED_TOKEN_ROLE");

  /// @notice Role used for setting a custom token contract address.
  bytes32 public constant SET_CUSTOM_CONTRACT_ROLE = keccak256("SET_CUSTOM_CONTRACT_ROLE");

  // Special addresses used in the mappings to mark specific states for tokens.
  /// @notice EMPTY means a token is not present in the mapping.
  address internal constant EMPTY = address(0x0);
  /// @notice RESERVED means a token is reserved and cannot be bridged.
  address internal constant RESERVED_STATUS = address(0x111);
  /// @notice NATIVE means a token is native to the current local chain.
  address internal constant NATIVE_STATUS = address(0x222);
  /// @notice DEPLOYED means the bridged token contract has been deployed on the remote chain.
  address internal constant DEPLOYED_STATUS = address(0x333);

  // solhint-disable-next-line var-name-mixedcase
  /// @dev The permit selector to be used when decoding the permit.
  bytes4 internal constant _PERMIT_SELECTOR = IERC20PermitUpgradeable.permit.selector;

  /// @notice These 3 variables are used for the token metadata.
  bytes private constant METADATA_NAME = abi.encodeCall(IERC20MetadataUpgradeable.name, ());
  bytes private constant METADATA_SYMBOL = abi.encodeCall(IERC20MetadataUpgradeable.symbol, ());
  bytes private constant METADATA_DECIMALS = abi.encodeCall(IERC20MetadataUpgradeable.decimals, ());

  /// @dev These 3 values are used when checking for token decimals and string values.
  uint256 private constant VALID_DECIMALS_ENCODING_LENGTH = 32;
  uint256 private constant SHORT_STRING_ENCODING_LENGTH = 32;
  uint256 private constant MINIMUM_STRING_ABI_DECODE_LENGTH = 64;

  /// @notice The token beacon for deployed tokens.
  address public tokenBeacon;

  /// @notice The chainId mapped to a native token address which is then mapped to the bridged token address.
  mapping(uint256 chainId => mapping(address native => address bridged)) public nativeToBridgedToken;

  /// @notice The bridged token address mapped to the native token address.
  mapping(address bridged => address native) public bridgedToNativeToken;

  /// @notice The current layer's chainId from where the bridging is triggered.
  uint256 public sourceChainId;

  /// @notice The targeted layer's chainId where the bridging is received.
  uint256 public targetChainId;

  /// @dev Keep free storage slots for future implementation updates to avoid storage collision.
  uint256[50] private __gap;

  /// @dev Ensures the token has not been bridged before.
  modifier isNewToken(address _token) {
    if (bridgedToNativeToken[_token] != EMPTY || nativeToBridgedToken[sourceChainId][_token] != EMPTY)
      revert AlreadyBridgedToken(_token);
    _;
  }

  /**
   * @dev Ensures the address is not address(0).
   * @param _addr Address to check.
   */
  modifier nonZeroAddress(address _addr) {
    if (_addr == EMPTY) revert ZeroAddressNotAllowed();
    _;
  }
  /**
   * @dev Ensures the amount is not 0.
   * @param _amount amount to check.
   */
  modifier nonZeroAmount(uint256 _amount) {
    if (_amount == 0) revert ZeroAmountNotAllowed(_amount);
    _;
  }

  /// @dev Disable constructor for safety
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Initializes TokenBridge and underlying service dependencies - used for new networks only.
   * @dev Contract will be used as proxy implementation.
   * @param _initializationData The initial data used for initializing the TokenBridge contract.
   */
  function initialize(
    InitializationData calldata _initializationData
  )
    external
    nonZeroAddress(_initializationData.messageService)
    nonZeroAddress(_initializationData.tokenBeacon)
    initializer
  {
    __PauseManager_init(_initializationData.pauseTypeRoles, _initializationData.unpauseTypeRoles);
    __MessageServiceBase_init(_initializationData.messageService);
    __ReentrancyGuard_init();

    /**
     * @dev DEFAULT_ADMIN_ROLE is set for the security council explicitly,
     * as the permissions init purposefully does not allow DEFAULT_ADMIN_ROLE to be set.
     */
    _grantRole(DEFAULT_ADMIN_ROLE, _initializationData.defaultAdmin);

    __Permissions_init(_initializationData.roleAddresses);

    tokenBeacon = _initializationData.tokenBeacon;
    sourceChainId = _initializationData.sourceChainId;
    targetChainId = _initializationData.targetChainId;

    unchecked {
      for (uint256 i; i < _initializationData.reservedTokens.length; ) {
        if (_initializationData.reservedTokens[i] == EMPTY) revert ZeroAddressNotAllowed();
        nativeToBridgedToken[_initializationData.sourceChainId][
          _initializationData.reservedTokens[i]
        ] = RESERVED_STATUS;
        emit TokenReserved(_initializationData.reservedTokens[i]);
        ++i;
      }
    }
  }

  /**
   * @notice Sets permissions for a list of addresses and their roles as well as initialises the PauseManager pauseType:role mappings.
   * @dev This function is a reinitializer and can only be called once per version. Should be called using an upgradeAndCall transaction to the ProxyAdmin.
   * @param _defaultAdmin The default admin account's address.
   * @param _roleAddresses The list of addresses and roles to assign permissions to.
   * @param _pauseTypeRoles The list of pause types to associate with roles.
   * @param _unpauseTypeRoles The list of unpause types to associate with roles.
   */
  function reinitializePauseTypesAndPermissions(
    address _defaultAdmin,
    RoleAddress[] calldata _roleAddresses,
    PauseTypeRole[] calldata _pauseTypeRoles,
    PauseTypeRole[] calldata _unpauseTypeRoles
  ) external reinitializer(2) {
    if (_defaultAdmin == address(0)) {
      revert ZeroAddressNotAllowed();
    }

    _grantRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);

    assembly {
      /// @dev Wiping the storage slot 101 of _owner as it is replaced by AccessControl and there is now the ERC165 __gap in its place.
      sstore(101, 0)
      /// @dev Wiping the storage slot 213 of _status as it is replaced by ReentrancyGuardUpgradeable at slot 1.
      sstore(213, 0)
    }

    __ReentrancyGuard_init();
    __PauseManager_init(_pauseTypeRoles, _unpauseTypeRoles);
    __Permissions_init(_roleAddresses);
  }

  /**
   * @notice This function is the single entry point to bridge tokens to the
   *   other chain, both for native and already bridged tokens. You can use it
   *   to bridge any ERC20. If the token is bridged for the first time an ERC20
   *   (BridgedToken.sol) will be automatically deployed on the target chain.
   * @dev User should first allow the bridge to transfer tokens on his behalf.
   *   Alternatively, you can use BridgeTokenWithPermit to do so in a single
   *   transaction. If you want the transfer to be automatically executed on the
   *   destination chain. You should send enough ETH to pay the postman fees.
   *   Note that Linea can reserve some tokens (which use a dedicated bridge).
   *   In this case, the token cannot be bridged. Linea can only reserve tokens
   *   that have not been bridged yet.
   *   Linea can pause the bridge for security reason. In this case new bridge
   *   transaction would revert.
   * @dev Note: If, when bridging an unbridged token and decimals are unknown,
   * the call will revert to prevent mismatched decimals. Only those ERC20s,
   * with a decimals function are supported.
   * @param _token The address of the token to be bridged.
   * @param _amount The amount of the token to be bridged.
   * @param _recipient The address that will receive the tokens on the other chain.
   */
  function bridgeToken(
    address _token,
    uint256 _amount,
    address _recipient
  ) public payable nonZeroAddress(_token) nonZeroAddress(_recipient) nonZeroAmount(_amount) nonReentrant {
    _requireTypeAndGeneralNotPaused(PauseType.INITIATE_TOKEN_BRIDGING);
    uint256 sourceChainIdCache = sourceChainId;
    address nativeMappingValue = nativeToBridgedToken[sourceChainIdCache][_token];
    if (nativeMappingValue == RESERVED_STATUS) {
      // Token is reserved
      revert ReservedToken(_token);
    }

    address nativeToken = bridgedToNativeToken[_token];
    uint256 chainId;
    bytes memory tokenMetadata;

    if (nativeToken != EMPTY) {
      BridgedToken(_token).burn(msg.sender, _amount);
      chainId = targetChainId;
    } else {
      // Token is native

      // For tokens with special fee logic, ensure that only the amount received
      // by the bridge will be minted on the target chain.
      uint256 balanceBefore = IERC20Upgradeable(_token).balanceOf(address(this));
      IERC20Upgradeable(_token).safeTransferFrom(msg.sender, address(this), _amount);
      _amount = IERC20Upgradeable(_token).balanceOf(address(this)) - balanceBefore;
      nativeToken = _token;

      if (nativeMappingValue == EMPTY) {
        // New token
        nativeToBridgedToken[sourceChainIdCache][_token] = NATIVE_STATUS;
        emit NewToken(_token);
      }

      // Send Metadata only when the token has not been deployed on the other chain yet
      if (nativeMappingValue != DEPLOYED_STATUS) {
        tokenMetadata = abi.encode(_safeName(_token), _safeSymbol(_token), _safeDecimals(_token));
      }
      chainId = sourceChainIdCache;
    }
    messageService.sendMessage{ value: msg.value }(
      remoteSender,
      msg.value, // fees
      abi.encodeCall(ITokenBridge.completeBridging, (nativeToken, _amount, _recipient, chainId, tokenMetadata))
    );
    emit BridgingInitiatedV2(msg.sender, _recipient, _token, _amount);
  }

  /**
   * @notice Similar to `bridgeToken` function but allows to pass additional
   *   permit data to do the ERC20 approval in a single transaction.
   * @notice _permit can fail silently, don't rely on this function passing as a form
   *   of authentication
   * @dev There is no need for validation at this level as the validation on pausing,
   * and empty values exists on the "bridgeToken" call.
   * @param _token The address of the token to be bridged.
   * @param _amount The amount of the token to be bridged.
   * @param _recipient The address that will receive the tokens on the other chain.
   * @param _permitData The permit data for the token, if applicable.
   */
  function bridgeTokenWithPermit(
    address _token,
    uint256 _amount,
    address _recipient,
    bytes calldata _permitData
  ) external payable {
    if (_permitData.length != 0) {
      _permit(_token, _permitData);
    }
    bridgeToken(_token, _amount, _recipient);
  }

  /**
   * @dev It can only be called from the Message Service. To finalize the bridging
   *   process, a user or postman needs to use the `claimMessage` function of the
   *   Message Service to trigger the transaction.
   * @param _nativeToken The address of the token on its native chain.
   * @param _amount The amount of the token to be received.
   * @param _recipient The address that will receive the tokens.
   * @param _chainId The token's origin layer chaindId
   * @param _tokenMetadata Additional data used to deploy the bridged token if it
   *   doesn't exist already.
   */
  function completeBridging(
    address _nativeToken,
    uint256 _amount,
    address _recipient,
    uint256 _chainId,
    bytes calldata _tokenMetadata
  )
    external
    nonReentrant
    onlyMessagingService
    onlyAuthorizedRemoteSender
    whenTypeAndGeneralNotPaused(PauseType.COMPLETE_TOKEN_BRIDGING)
  {
    address nativeMappingValue = nativeToBridgedToken[_chainId][_nativeToken];
    address bridgedToken;

    if (nativeMappingValue == NATIVE_STATUS || nativeMappingValue == DEPLOYED_STATUS) {
      // Token is native on the local chain
      IERC20Upgradeable(_nativeToken).safeTransfer(_recipient, _amount);
    } else {
      bridgedToken = nativeMappingValue;
      if (nativeMappingValue == EMPTY) {
        // New token
        bridgedToken = deployBridgedToken(_nativeToken, _tokenMetadata, sourceChainId);
        bridgedToNativeToken[bridgedToken] = _nativeToken;
        nativeToBridgedToken[targetChainId][_nativeToken] = bridgedToken;
      }
      BridgedToken(bridgedToken).mint(_recipient, _amount);
    }
    emit BridgingFinalizedV2(_nativeToken, bridgedToken, _amount, _recipient);
  }

  /**
   * @dev Change the address of the Message Service.
   * @dev SET_MESSAGE_SERVICE_ROLE is required to execute.
   * @param _messageService The address of the new Message Service.
   */
  function setMessageService(
    address _messageService
  ) external nonZeroAddress(_messageService) onlyRole(SET_MESSAGE_SERVICE_ROLE) {
    address oldMessageService = address(messageService);
    messageService = IMessageService(_messageService);
    emit MessageServiceUpdated(_messageService, oldMessageService, msg.sender);
  }

  /**
   * @dev Change the status to DEPLOYED to the tokens passed in parameter
   *    Will call the method setDeployed on the other chain using the message Service
   * @param _tokens Array of bridged tokens that have been deployed.
   */
  function confirmDeployment(address[] memory _tokens) external payable {
    uint256 tokensLength = _tokens.length;
    if (tokensLength == 0) {
      revert TokenListEmpty();
    }

    // Check that the tokens have actually been deployed
    for (uint256 i; i < tokensLength; i++) {
      address nativeToken = bridgedToNativeToken[_tokens[i]];
      if (nativeToken == EMPTY) {
        revert TokenNotDeployed(_tokens[i]);
      }
      _tokens[i] = nativeToken;
    }

    messageService.sendMessage{ value: msg.value }(
      remoteSender,
      msg.value, // fees
      abi.encodeCall(ITokenBridge.setDeployed, (_tokens))
    );

    emit DeploymentConfirmed(_tokens, msg.sender);
  }

  /**
   * @dev Change the status of tokens to DEPLOYED. New bridge transaction will not
   *   contain token metadata, which save gas.
   *   Can only be called from the Message Service. A user or postman needs to use
   *   the `claimMessage` function of the Message Service to trigger the transaction.
   * @param _nativeTokens Array of native tokens for which the DEPLOYED status must be set.
   */
  function setDeployed(address[] calldata _nativeTokens) external onlyMessagingService onlyAuthorizedRemoteSender {
    unchecked {
      uint256 cachedSourceChainId = sourceChainId;
      for (uint256 i; i < _nativeTokens.length; ) {
        nativeToBridgedToken[cachedSourceChainId][_nativeTokens[i]] = DEPLOYED_STATUS;
        emit TokenDeployed(_nativeTokens[i]);
        ++i;
      }
    }
  }

  /**
   * @dev Sets the address of the remote token bridge. Can only be called once.
   * @dev SET_REMOTE_TOKENBRIDGE_ROLE is required to execute.
   * @param _remoteTokenBridge The address of the remote token bridge to be set.
   */
  function setRemoteTokenBridge(address _remoteTokenBridge) external onlyRole(SET_REMOTE_TOKENBRIDGE_ROLE) {
    if (remoteSender != EMPTY) revert RemoteTokenBridgeAlreadySet(remoteSender);
    _setRemoteSender(_remoteTokenBridge);
    emit RemoteTokenBridgeSet(_remoteTokenBridge, msg.sender);
  }

  /**
   * @dev Deploy a new EC20 contract for bridged token using a beacon proxy pattern.
   *   To adapt to future requirements, Linea can update the implementation of
   *   all (existing and future) contracts by updating the beacon. This update is
   *   subject to a delay by a time lock.
   *   Contracts are deployed using CREATE2 so deployment address is deterministic.
   * @param _nativeToken The address of the native token on the source chain.
   * @param _tokenMetadata The encoded metadata for the token.
   * @param _chainId The chain id on which the token will be deployed, used to calculate the salt
   * @return bridgedTokenAddress The address of the newly deployed BridgedToken contract.
   */
  function deployBridgedToken(
    address _nativeToken,
    bytes calldata _tokenMetadata,
    uint256 _chainId
  ) internal returns (address bridgedTokenAddress) {
    bridgedTokenAddress = address(
      new BeaconProxy{ salt: Utils._efficientKeccak(_chainId, _nativeToken) }(tokenBeacon, "")
    );

    (string memory name, string memory symbol, uint8 decimals) = abi.decode(_tokenMetadata, (string, string, uint8));
    BridgedToken(bridgedTokenAddress).initialize(name, symbol, decimals);
    emit NewTokenDeployed(bridgedTokenAddress, _nativeToken);
  }

  /**
   * @dev Linea can reserve tokens. In this case, the token cannot be bridged.
   *   Linea can only reserve tokens that have not been bridged before.
   * @dev SET_RESERVED_TOKEN_ROLE is required to execute.
   * @notice Make sure that _token is native to the current chain
   *   where you are calling this function from
   * @param _token The address of the token to be set as reserved.
   */
  function setReserved(
    address _token
  ) external nonZeroAddress(_token) isNewToken(_token) onlyRole(SET_RESERVED_TOKEN_ROLE) {
    nativeToBridgedToken[sourceChainId][_token] = RESERVED_STATUS;
    emit TokenReserved(_token);
  }

  /**
   * @dev Removes a token from the reserved list.
   * @dev REMOVE_RESERVED_TOKEN_ROLE is required to execute.
   * @param _token The address of the token to be removed from the reserved list.
   */
  function removeReserved(address _token) external nonZeroAddress(_token) onlyRole(REMOVE_RESERVED_TOKEN_ROLE) {
    uint256 cachedSourceChainId = sourceChainId;

    if (nativeToBridgedToken[cachedSourceChainId][_token] != RESERVED_STATUS) revert NotReserved(_token);
    nativeToBridgedToken[cachedSourceChainId][_token] = EMPTY;

    emit ReservationRemoved(_token);
  }

  /**
   * @dev Linea can set a custom ERC20 contract for specific ERC20.
   *   For security purpose, Linea can only call this function if the token has
   *   not been bridged yet.
   * @dev SET_CUSTOM_CONTRACT_ROLE is required to execute.
   * @param _nativeToken The address of the token on the source chain.
   * @param _targetContract The address of the custom contract.
   */
  function setCustomContract(
    address _nativeToken,
    address _targetContract
  )
    external
    nonZeroAddress(_nativeToken)
    nonZeroAddress(_targetContract)
    onlyRole(SET_CUSTOM_CONTRACT_ROLE)
    isNewToken(_nativeToken)
  {
    if (bridgedToNativeToken[_targetContract] != EMPTY) {
      revert AlreadyBrigedToNativeTokenSet(_targetContract);
    }
    if (_targetContract == NATIVE_STATUS || _targetContract == DEPLOYED_STATUS || _targetContract == RESERVED_STATUS) {
      revert StatusAddressNotAllowed(_targetContract);
    }

    uint256 cachedTargetChainId = targetChainId;

    if (nativeToBridgedToken[cachedTargetChainId][_nativeToken] != EMPTY) {
      revert NativeToBridgedTokenAlreadySet(_nativeToken);
    }

    nativeToBridgedToken[cachedTargetChainId][_nativeToken] = _targetContract;
    bridgedToNativeToken[_targetContract] = _nativeToken;
    emit CustomContractSet(_nativeToken, _targetContract, msg.sender);
  }

  // Helpers to safely get the metadata from a token, inspired by
  // https://github.com/traderjoe-xyz/joe-core/blob/main/contracts/MasterChefJoeV3.sol#L55-L95

  /**
   * @dev Provides a safe ERC20.name version which returns 'NO_NAME' as fallback string.
   * @param _token The address of the ERC-20 token contract
   * @return tokenName Returns the string of the token name.
   */
  function _safeName(address _token) internal view returns (string memory tokenName) {
    (bool success, bytes memory data) = _token.staticcall(METADATA_NAME);
    tokenName = success ? _returnDataToString(data) : "NO_NAME";
  }

  /**
   * @dev Provides a safe ERC20.symbol version which returns 'NO_SYMBOL' as fallback string
   * @param _token The address of the ERC-20 token contract
   * @return symbol Returns the string of the symbol.
   */
  function _safeSymbol(address _token) internal view returns (string memory symbol) {
    (bool success, bytes memory data) = _token.staticcall(METADATA_SYMBOL);
    symbol = success ? _returnDataToString(data) : "NO_SYMBOL";
  }

  /**
   * @notice Provides a safe ERC20.decimals version which reverts when decimals are unknown
   *   Note Tokens with (decimals > 255) are not supported
   * @param _token The address of the ERC-20 token contract
   * @return Returns the token's decimals value.
   */
  function _safeDecimals(address _token) internal view returns (uint8) {
    (bool success, bytes memory data) = _token.staticcall(METADATA_DECIMALS);

    if (success && data.length == VALID_DECIMALS_ENCODING_LENGTH) {
      return abi.decode(data, (uint8));
    }

    revert DecimalsAreUnknown(_token);
  }

  /**
   * @dev Converts returned data to string. Returns 'NOT_VALID_ENCODING' as fallback value.
   * @param _data returned data.
   * @return decodedString The decoded string data.
   */
  function _returnDataToString(bytes memory _data) internal pure returns (string memory decodedString) {
    if (_data.length >= MINIMUM_STRING_ABI_DECODE_LENGTH) {
      return abi.decode(_data, (string));
    } else if (_data.length != SHORT_STRING_ENCODING_LENGTH) {
      return "NOT_VALID_ENCODING";
    }

    // Since the strings on bytes32 are encoded left-right, check the first zero in the data
    uint256 nonZeroBytes;
    unchecked {
      while (nonZeroBytes < SHORT_STRING_ENCODING_LENGTH && _data[nonZeroBytes] != 0) {
        nonZeroBytes++;
      }
    }

    // If the first one is 0, we do not handle the encoding
    if (nonZeroBytes == 0) {
      return "NOT_VALID_ENCODING";
    }
    // Create a byte array with nonZeroBytes length
    bytes memory bytesArray = new bytes(nonZeroBytes);
    unchecked {
      for (uint256 i; i < nonZeroBytes; ) {
        bytesArray[i] = _data[i];
        ++i;
      }
    }
    decodedString = string(bytesArray);
  }

  /**
   * @notice Call the token permit method of extended ERC20
   * @notice Only support tokens implementing ERC-2612
   * @param _token ERC20 token address
   * @param _permitData Raw data of the call `permit` of the token
   */
  function _permit(address _token, bytes calldata _permitData) internal {
    if (bytes4(_permitData[:4]) != _PERMIT_SELECTOR)
      revert InvalidPermitData(bytes4(_permitData[:4]), _PERMIT_SELECTOR);
    // Decode the permit data
    // The parameters are:
    // 1. owner: The address of the wallet holding the tokens
    // 2. spender: The address of the entity permitted to spend the tokens
    // 3. value: The maximum amount of tokens the spender is allowed to spend
    // 4. deadline: The time until which the permit is valid
    // 5. v: Part of the signature (along with r and s), these three values form the signature of the permit
    // 6. r: Part of the signature
    // 7. s: Part of the signature
    (address owner, address spender, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) = abi.decode(
      _permitData[4:],
      (address, address, uint256, uint256, uint8, bytes32, bytes32)
    );
    if (owner != msg.sender) revert PermitNotFromSender(owner);
    if (spender != address(this)) revert PermitNotAllowingBridge(spender);

    if (IERC20Upgradeable(_token).allowance(owner, spender) < amount) {
      IERC20PermitUpgradeable(_token).permit(msg.sender, address(this), amount, deadline, v, r, s);
    }
  }
}