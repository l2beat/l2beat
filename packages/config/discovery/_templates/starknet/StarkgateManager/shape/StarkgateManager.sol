// SPDX-License-Identifier: Unknown
pragma solidity 0.8.20;

library NamedStorage {
    function bytes32ToBoolMapping(string memory tag_)
        internal
        pure
        returns (mapping(bytes32 => bool) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function bytes32ToUint256Mapping(string memory tag_)
        internal
        pure
        returns (mapping(bytes32 => uint256) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function addressToUint256Mapping(string memory tag_)
        internal
        pure
        returns (mapping(address => uint256) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function bytes32ToAddressMapping(string memory tag_)
        internal
        pure
        returns (mapping(bytes32 => address) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function uintToAddressMapping(string memory tag_)
        internal
        pure
        returns (mapping(uint256 => address) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function addressToAddressMapping(string memory tag_)
        internal
        pure
        returns (mapping(address => address) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function addressToAddressListMapping(string memory tag_)
        internal
        pure
        returns (mapping(address => address[]) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function addressToBoolMapping(string memory tag_)
        internal
        pure
        returns (mapping(address => bool) storage randomVariable)
    {
        bytes32 location = keccak256(abi.encodePacked(tag_));
        assembly {
            randomVariable.slot := location
        }
    }

    function getUintValue(string memory tag_) internal view returns (uint256 retVal) {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            retVal := sload(slot)
        }
    }

    function setUintValue(string memory tag_, uint256 value) internal {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            sstore(slot, value)
        }
    }

    function setUintValueOnce(string memory tag_, uint256 value) internal {
        require(getUintValue(tag_) == 0, "ALREADY_SET");
        setUintValue(tag_, value);
    }

    function getAddressValue(string memory tag_) internal view returns (address retVal) {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            retVal := sload(slot)
        }
    }

    function setAddressValue(string memory tag_, address value) internal {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            sstore(slot, value)
        }
    }

    function setAddressValueOnce(string memory tag_, address value) internal {
        require(getAddressValue(tag_) == address(0x0), "ALREADY_SET");
        setAddressValue(tag_, value);
    }

    function getBoolValue(string memory tag_) internal view returns (bool retVal) {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            retVal := sload(slot)
        }
    }

    function setBoolValue(string memory tag_, bool value) internal {
        bytes32 slot = keccak256(abi.encodePacked(tag_));
        assembly {
            sstore(slot, value)
        }
    }
}

abstract contract BlockDirectCall {
    address immutable this_;

    constructor() {
        this_ = address(this);
    }

    modifier notCalledDirectly() {
        require(this_ != address(this), "DIRECT_CALL_DISALLOWED");
        _;
    }
}

abstract contract ContractInitializer {
    /*
      The number of sub-contracts that the proxied contract consists of.
    */
    function numOfSubContracts() internal pure virtual returns (uint256);

    /*
      Indicates if the proxied contract has already been initialized.
      Used to prevent re-init.
    */
    function isInitialized() internal view virtual returns (bool);

    /*
      Validates the init data that is passed into the proxied contract.
    */
    function validateInitData(bytes calldata data) internal view virtual;

    /*
      For a proxied contract that consists of sub-contracts, this function processes
      the sub-contract addresses, e.g. validates them, stores them etc.
    */
    function processSubContractAddresses(bytes calldata subContractAddresses) internal virtual;

    /*
      This function applies the logic of initializing the proxied contract state,
      e.g. setting root values etc.
    */
    function initializeContractState(bytes calldata data) internal virtual;
}

abstract contract Roles {
    // This flag dermine if the GOVERNANCE_ADMIN role can be renounced.
    bool immutable fullyRenouncable;

    constructor(bool renounceable) {
        fullyRenouncable = renounceable;
        RolesLib.initialize();
    }

    // MODIFIERS.
    modifier onlyAppGovernor() {
        require(isAppGovernor(AccessControl._msgSender()), "ONLY_APP_GOVERNOR");
        _;
    }

    modifier onlyOperator() {
        require(isOperator(AccessControl._msgSender()), "ONLY_OPERATOR");
        _;
    }

    modifier onlySecurityAdmin() {
        require(isSecurityAdmin(AccessControl._msgSender()), "ONLY_SECURITY_ADMIN");
        _;
    }

    modifier onlySecurityAgent() {
        require(isSecurityAgent(AccessControl._msgSender()), "ONLY_SECURITY_AGENT");
        _;
    }

    modifier onlyTokenAdmin() {
        require(isTokenAdmin(AccessControl._msgSender()), "ONLY_TOKEN_ADMIN");
        _;
    }

    modifier onlyUpgradeGovernor() {
        require(isUpgradeGovernor(AccessControl._msgSender()), "ONLY_UPGRADE_GOVERNOR");
        _;
    }

    modifier notSelf(address account) {
        require(account != AccessControl._msgSender(), "CANNOT_PERFORM_ON_SELF");
        _;
    }

    // Is holding role.
    function isAppGovernor(address account) public view returns (bool) {
        return AccessControl.hasRole(APP_GOVERNOR, account);
    }

    function isAppRoleAdmin(address account) public view returns (bool) {
        return AccessControl.hasRole(APP_ROLE_ADMIN, account);
    }

    function isGovernanceAdmin(address account) public view returns (bool) {
        return AccessControl.hasRole(GOVERNANCE_ADMIN, account);
    }

    function isOperator(address account) public view returns (bool) {
        return AccessControl.hasRole(OPERATOR, account);
    }

    function isSecurityAdmin(address account) public view returns (bool) {
        return AccessControl.hasRole(SECURITY_ADMIN, account);
    }

    function isSecurityAgent(address account) public view returns (bool) {
        return AccessControl.hasRole(SECURITY_AGENT, account);
    }

    function isTokenAdmin(address account) public view returns (bool) {
        return AccessControl.hasRole(TOKEN_ADMIN, account);
    }

    function isUpgradeGovernor(address account) public view returns (bool) {
        return AccessControl.hasRole(UPGRADE_GOVERNOR, account);
    }

    // Register Role.
    function registerAppGovernor(address account) external {
        AccessControl.grantRole(APP_GOVERNOR, account);
    }

    function registerAppRoleAdmin(address account) external {
        AccessControl.grantRole(APP_ROLE_ADMIN, account);
    }

    function registerGovernanceAdmin(address account) external {
        AccessControl.grantRole(GOVERNANCE_ADMIN, account);
    }

    function registerOperator(address account) external {
        AccessControl.grantRole(OPERATOR, account);
    }

    function registerSecurityAdmin(address account) external {
        AccessControl.grantRole(SECURITY_ADMIN, account);
    }

    function registerSecurityAgent(address account) external {
        AccessControl.grantRole(SECURITY_AGENT, account);
    }

    function registerTokenAdmin(address account) external {
        AccessControl.grantRole(TOKEN_ADMIN, account);
    }

    function registerUpgradeGovernor(address account) external {
        AccessControl.grantRole(UPGRADE_GOVERNOR, account);
    }

    // Revoke Role.
    function revokeAppGovernor(address account) external {
        AccessControl.revokeRole(APP_GOVERNOR, account);
    }

    function revokeAppRoleAdmin(address account) external notSelf(account) {
        AccessControl.revokeRole(APP_ROLE_ADMIN, account);
    }

    function revokeGovernanceAdmin(address account) external notSelf(account) {
        AccessControl.revokeRole(GOVERNANCE_ADMIN, account);
    }

    function revokeOperator(address account) external {
        AccessControl.revokeRole(OPERATOR, account);
    }

    function revokeSecurityAdmin(address account) external notSelf(account) {
        AccessControl.revokeRole(SECURITY_ADMIN, account);
    }

    function revokeSecurityAgent(address account) external {
        AccessControl.revokeRole(SECURITY_AGENT, account);
    }

    function revokeTokenAdmin(address account) external {
        AccessControl.revokeRole(TOKEN_ADMIN, account);
    }

    function revokeUpgradeGovernor(address account) external {
        AccessControl.revokeRole(UPGRADE_GOVERNOR, account);
    }

    // Renounce Role.
    function renounceRole(bytes32 role, address account) external {
        if (role == GOVERNANCE_ADMIN && !fullyRenouncable) {
            revert("CANNOT_RENOUNCE_GOVERNANCE_ADMIN");
        }
        AccessControl.renounceRole(role, account);
    }
}

library Addresses {
    /*
      Note: isContract function has some known limitation.
      See https://github.com/OpenZeppelin/
      openzeppelin-contracts/blob/master/contracts/utils/Address.sol.
    */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function performEthTransfer(address recipient, uint256 amount) internal {
        if (amount == 0) return;
        (bool success, ) = recipient.call{value: amount}(""); // NOLINT: low-level-calls.
        require(success, "ETH_TRANSFER_FAILED");
    }

    /*
      Safe wrapper around ERC20/ERC721 calls.
      This is required because many deployed ERC20 contracts don't return a value.
      See https://github.com/ethereum/solidity/issues/4116.
    */
    function safeTokenContractCall(address tokenAddress, bytes memory callData) internal {
        require(isContract(tokenAddress), "BAD_TOKEN_ADDRESS");
        // NOLINTNEXTLINE: low-level-calls.
        (bool success, bytes memory returndata) = tokenAddress.call(callData);
        require(success, string(returndata));

        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "TOKEN_OPERATION_FAILED");
        }
    }
}

library Strings {
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

library AccessControl {
    /*
      Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     
      `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
      {RoleAdminChanged} not being emitted signaling this.
     
      Available since v3.1.
    */
    event RoleAdminChanged(
        bytes32 indexed role,
        bytes32 indexed previousAdminRole,
        bytes32 indexed newAdminRole
    );

    /*
      Emitted when `account` is granted `role`.
     
      `sender` is the account that originated the contract call, an admin role
      bearer except when using {AccessControl-_setupRole}.
    */
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    /*
      Emitted when `account` is revoked `role`.
     
      `sender` is the account that originated the contract call:
        - if using `revokeRole`, it is the admin role bearer
        - if using `renounceRole`, it is the role bearer (i.e. `account`).
    */
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    // Context interface functions.
    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    function _msgData() internal pure returns (bytes calldata) {
        return msg.data;
    }

    // The storage variable `_roles` is located away from the contract linear area (low storage addresses)
    // to prevent potential collision/corruption in upgrade scenario.
    // Slot = Web3.keccak(text="AccesControl_Storage_Slot").
    bytes32 constant rolesSlot = 0x53e43b954ba190a7e49386f1f78b01dcd9f628db23f432fa029a7dfd6d98e8fb;

    function _roles() private pure returns (mapping(bytes32 => RoleData) storage roles) {
        assembly {
            roles.slot := rolesSlot
        }
    }

    bytes32 constant DEFAULT_ADMIN_ROLE = 0x00;

    /*
      Modifier that checks that an account has a specific role. Reverts
      with a standardized message including the required role.
      
      The format of the revert reason is given by the following regular expression:
      
      /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
      
      Available since v4.1.
    */
    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    /*
      Returns `true` if `account` has been granted `role`.
    */
    function hasRole(bytes32 role, address account) internal view returns (bool) {
        return _roles()[role].members[account];
    }

    /*
      Revert with a standard message if `_msgSender()` is missing `role`.
      Overriding this function changes the behavior of the {onlyRole} modifier.
     
      Format of the revert message is described in {_checkRole}.
     
      Available since v4.6.
    */
    function _checkRole(bytes32 role) internal view {
        _checkRole(role, _msgSender());
    }

    /*
      Revert with a standard message if `account` is missing `role`.
     
      The format of the revert reason is given by the following regular expression:
     
       /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/.
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

    /*
      Returns the admin role that controls `role`. See {grantRole} and
      {revokeRole}.
     
      To change a role's admin, use {_setRoleAdmin}.
    */
    function getRoleAdmin(bytes32 role) internal view returns (bytes32) {
        return _roles()[role].adminRole;
    }

    /*
      Grants `role` to `account`.
     
      If `account` had not been already granted `role`, emits a {RoleGranted}
      event.
     
      Requirements:
     
      - the caller must have ``role``'s admin role.
     
      May emit a {RoleGranted} event.
    */
    function grantRole(bytes32 role, address account) internal onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    /*
      Revokes `role` from `account`.
     
      If `account` had been granted `role`, emits a {RoleRevoked} event.
     
      Requirements:
     
      - the caller must have ``role``'s admin role.
     
      * May emit a {RoleRevoked} event.
    */
    function revokeRole(bytes32 role, address account) internal onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    /*
      Revokes `role` from the calling account.
     
      Roles are often managed via {grantRole} and {revokeRole}: this function's
      purpose is to provide a mechanism for accounts to lose their privileges
      if they are compromised (such as when a trusted device is misplaced).
     
      If the calling account had been revoked `role`, emits a {RoleRevoked}
      event.
     
      Requirements:
     
      - the caller must be `account`.
     
      May emit a {RoleRevoked} event.
    */
    function renounceRole(bytes32 role, address account) internal {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");

        _revokeRole(role, account);
    }

    /*
      Grants `role` to `account`.
     
      If `account` had not been already granted `role`, emits a {RoleGranted}
      event. Note that unlike {grantRole}, this function doesn't perform any
      checks on the calling account.
     
      May emit a {RoleGranted} event.
     
      [WARNING]virtual
      ====
      This function should only be called from the constructor when setting
      up the initial roles for the system.
     
      Using this function in any other way is effectively circumventing the admin
      system imposed by {AccessControl}.
      ====
     
      NOTE: This function is deprecated in favor of {_grantRole}.
    */
    function _setupRole(bytes32 role, address account) internal {
        _grantRole(role, account);
    }

    /*
      Sets `adminRole` as ``role``'s admin role.
     
      Emits a {RoleAdminChanged} event.
    */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal {
        bytes32 previousAdminRole = getRoleAdmin(role);
        _roles()[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /*
      Grants `role` to `account`.
     
      Internal function without access restriction.
     
      May emit a {RoleGranted} event.
    */
    function _grantRole(bytes32 role, address account) internal {
        if (!hasRole(role, account)) {
            _roles()[role].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    /*
      Revokes `role` from `account`.
     
      Internal function without access restriction.
     
      May emit a {RoleRevoked} event.
    */
    function _revokeRole(bytes32 role, address account) internal {
        if (hasRole(role, account)) {
            _roles()[role].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }
}

library RolesLib {
    // INITIALIZERS.
    function governanceRolesInitialized() internal view returns (bool) {
        return AccessControl.getRoleAdmin(GOVERNANCE_ADMIN) != bytes32(0x00);
    }

    function securityRolesInitialized() internal view returns (bool) {
        return AccessControl.getRoleAdmin(SECURITY_ADMIN) != bytes32(0x00);
    }

    function initialize() internal {
        address provisional = AccessControl._msgSender();
        initialize(provisional, provisional);
    }

    function initialize(address provisionalGovernor, address provisionalSecAdmin) internal {
        if (governanceRolesInitialized()) {
            // Support Proxied contract initialization.
            // In case the Proxy already initialized the roles,
            // init will succeed IFF the provisionalGovernor is already `GovernanceAdmin`.
            require(
                AccessControl.hasRole(GOVERNANCE_ADMIN, provisionalGovernor),
                "ROLES_ALREADY_INITIALIZED"
            );
        } else {
            initGovernanceRoles(provisionalGovernor);
        }

        if (securityRolesInitialized()) {
            // If SecurityAdmin initialized,
            // then provisionalSecAdmin must already be a `SecurityAdmin`.
            // If it's not initilized - initialize it.
            require(
                AccessControl.hasRole(SECURITY_ADMIN, provisionalSecAdmin),
                "SECURITY_ROLES_ALREADY_INITIALIZED"
            );
        } else {
            initSecurityRoles(provisionalSecAdmin);
        }
    }

    function initSecurityRoles(address provisionalSecAdmin) private {
        AccessControl._setRoleAdmin(SECURITY_ADMIN, SECURITY_ADMIN);
        AccessControl._setRoleAdmin(SECURITY_AGENT, SECURITY_ADMIN);
        AccessControl._grantRole(SECURITY_ADMIN, provisionalSecAdmin);
    }

    function initGovernanceRoles(address provisionalGovernor) private {
        AccessControl._grantRole(GOVERNANCE_ADMIN, provisionalGovernor);
        AccessControl._setRoleAdmin(APP_GOVERNOR, APP_ROLE_ADMIN);
        AccessControl._setRoleAdmin(APP_ROLE_ADMIN, GOVERNANCE_ADMIN);
        AccessControl._setRoleAdmin(GOVERNANCE_ADMIN, GOVERNANCE_ADMIN);
        AccessControl._setRoleAdmin(OPERATOR, APP_ROLE_ADMIN);
        AccessControl._setRoleAdmin(TOKEN_ADMIN, APP_ROLE_ADMIN);
        AccessControl._setRoleAdmin(UPGRADE_GOVERNOR, GOVERNANCE_ADMIN);
    }
}

abstract contract ProxySupport is BlockDirectCall, ContractInitializer, Roles(true) {
    using Addresses for address;

    // The two function below (isFrozen & initialize) needed to bind to the Proxy.
    function isFrozen() external view virtual returns (bool) {
        return false;
    }

    /*
      The initialize() function serves as an alternative constructor for a proxied deployment.

      Flow and notes:
      1. This function cannot be called directly on the deployed contract, but only via
         delegate call.
      2. If an EIC is provided - init is passed onto EIC and the standard init flow is skipped.
         This true for both first intialization or a later one.
      3. The data passed to this function is as follows:
         [sub_contracts addresses, eic address, initData].

         When calling on an initialized contract (no EIC scenario), initData.length must be 0.
    */
    function initialize(bytes calldata data) external notCalledDirectly {
        uint256 eicOffset = 32 * numOfSubContracts();
        uint256 expectedBaseSize = eicOffset + 32;
        require(data.length >= expectedBaseSize, "INIT_DATA_TOO_SMALL");
        address eicAddress = abi.decode(data[eicOffset:expectedBaseSize], (address));

        bytes calldata subContractAddresses = data[:eicOffset];

        processSubContractAddresses(subContractAddresses);

        bytes calldata initData = data[expectedBaseSize:];

        // EIC Provided - Pass initData to EIC and the skip standard init flow.
        if (eicAddress != address(0x0)) {
            callExternalInitializer(eicAddress, initData);
            return;
        }

        if (isInitialized()) {
            require(initData.length == 0, "UNEXPECTED_INIT_DATA");
        } else {
            // Contract was not initialized yet.
            validateInitData(initData);
            initializeContractState(initData);
            RolesLib.initialize();
        }
    }

    function callExternalInitializer(address externalInitializerAddr, bytes calldata eicData)
        private
    {
        require(externalInitializerAddr.isContract(), "EIC_NOT_A_CONTRACT");

        // NOLINTNEXTLINE: low-level-calls, controlled-delegatecall.
        (bool success, bytes memory returndata) = externalInitializerAddr.delegatecall(
            abi.encodeWithSelector(this.initialize.selector, eicData)
        );
        require(success, string(returndata));
        require(returndata.length == 0, string(returndata));
    }
}

interface IStarkgateManager {
    /**
      Returns the address of the Starkgate Registry contract.
    */
    function getRegistry() external view returns (address);

    /**
      Adds an existing bridge to the Starkgate system for a specific token.
     */
    function addExistingBridge(address token, address bridge) external;

    /**
      Deactivates bridging of a specific token.
      A deactivated token is blocked for deposits and cannot be re-deployed.     
      */
    function deactivateToken(address token) external;

    /**
      Block a specific token from being used in the StarkGate.
      A blocked token cannot be deployed.
      */
    function blockToken(address token) external;

    /**
      Enrolls a token bridge for a specific token.
     */
    function enrollTokenBridge(address token) external payable;
}

interface Identity {
    /*
      Allows a caller to ensure that the provided address is of the expected type and version.
    */
    function identify() external pure returns (string memory);
}

contract StarkgateManager is Identity, IStarkgateManager, ProxySupport {
    using Addresses for address;
    // Named storage slot tags.
    string internal constant REGISTRY_TAG = "STARKGATE_MANAGER_REGISTRY_SLOT_TAG";
    string internal constant BRIDGE_TAG = "STARKGATE_MANAGER_BRIDGE_SLOT_TAG";
    event TokenEnrolled(address indexed token, address indexed sender);
    event ExistingBridgeAdded(address indexed token, address indexed bridge);
    event TokenDeactivated(address indexed token, address indexed sender);
    event TokenBlocked(address indexed token, address indexed sender);

    function getRegistry() external view returns (address) {
        return registry();
    }

    // Storage Getters.
    // TODO : add doc.
    function registry() internal view returns (address) {
        return NamedStorage.getAddressValue(REGISTRY_TAG);
    }

    function bridge() internal view returns (address) {
        return NamedStorage.getAddressValue(BRIDGE_TAG);
    }

    // Storage Setters.
    function setRegistry(address contract_) internal {
        NamedStorage.setAddressValueOnce(REGISTRY_TAG, contract_);
    }

    function setBridge(address contract_) internal {
        NamedStorage.setAddressValueOnce(BRIDGE_TAG, contract_);
    }

    function identify() external pure override returns (string memory) {
        return "StarkWare_StarkgateManager_2.0_1";
    }

    /*
      Initializes the contract.
    */
    function initializeContractState(bytes calldata data) internal override {
        (address registry_, address bridge_) = abi.decode(data, (address, address));
        setRegistry(registry_);
        setBridge(bridge_);
    }

    function isInitialized() internal view override returns (bool) {
        return registry() != address(0);
    }

    function numOfSubContracts() internal pure override returns (uint256) {
        return 0;
    }

    /*
      No processing needed, as there are no sub-contracts to this contract.
    */
    function processSubContractAddresses(bytes calldata subContractAddresses) internal override {}

    function validateInitData(bytes calldata data) internal view virtual override {
        require(data.length == 64, "ILLEGAL_DATA_SIZE");
        (address registry_, address bridge_) = abi.decode(data, (address, address));
        require(registry_.isContract(), "INVALID_REGISTRY_CONTRACT_ADDRESS");
        require(bridge_.isContract(), "INVALID_BRIDGE_CONTRACT_ADDRESS");
    }

    function addExistingBridge(address token, address bridge_) external onlyTokenAdmin {
        require(bridge() != bridge_, "CANNOT_ADD_MAIN_MULTI_BRIDGE_AS_EXISTING");
        IStarkgateRegistry(registry()).enlistToken(token, bridge_);
        emit ExistingBridgeAdded(token, bridge_);
    }

    /**
      Deactivates bridging of a specific token.
      A deactivated token is blocked for deposits and cannot be re-deployed.
      Note: Only serviced tokens can be deactivated. In order to block an unserviced tokens
      see 'blockToken'.
    */
    function deactivateToken(address token) external onlyTokenAdmin {
        IStarkgateRegistry registryContract = IStarkgateRegistry(registry());
        address current_bridge = registryContract.getBridge(token);

        require(current_bridge != address(0), "TOKEN_NOT_ENROLLED");
        if (current_bridge == BLOCKED_TOKEN) {
            string memory revertMsg = registryContract.getWithdrawalBridges(token).length == 0
                ? "TOKEN_ALREADY_BLOCKED"
                : "TOKEN_ALREADY_DEACTIVATED";
            revert(revertMsg);
        }
        emit TokenDeactivated(token, msg.sender);
        registryContract.blockToken(token);
        if (current_bridge == bridge()) {
            IStarkgateBridge(bridge()).deactivate(token);
        }
    }

    /**
      Block token from being bridged.
      A blocked token cannot be deployed.
      Note: Only an unserviced token can be blocked. In order to deactivate a serviced tokens
        see 'deactivateToken'.
    */
    function blockToken(address token) external onlyTokenAdmin {
        IStarkgateRegistry registryContract = IStarkgateRegistry(registry());
        address current_bridge = registryContract.getBridge(token);
        if (current_bridge == address(0)) {
            emit TokenBlocked(token, msg.sender);
            registryContract.blockToken(token);
        } else if (current_bridge == BLOCKED_TOKEN) {
            string memory revertMsg = registryContract.getWithdrawalBridges(token).length == 0
                ? "TOKEN_ALREADY_BLOCKED"
                : "CANNOT_BLOCK_DEACTIVATED_TOKEN";
            revert(revertMsg);
        } else {
            revert("CANNOT_BLOCK_TOKEN_IN_SERVICE");
        }
    }

    function enrollTokenBridge(address token) external payable {
        IStarkgateRegistry registryContract = IStarkgateRegistry(registry());
        require(registryContract.getBridge(token) != BLOCKED_TOKEN, "CANNOT_DEPLOY_BRIDGE");
        emit TokenEnrolled(token, msg.sender);
        registryContract.enlistToken(token, bridge());
        IStarkgateBridge(bridge()).enrollToken{value: msg.value}(token);
    }
}