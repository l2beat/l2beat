// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {AccessManager, IAccessManager} from 'src/dependencies/openzeppelin/AccessManager.sol';
import {EnumerableSet} from 'src/dependencies/openzeppelin/EnumerableSet.sol';
import {IAccessManagerEnumerable} from 'src/access/interfaces/IAccessManagerEnumerable.sol';

/// @title AccessManagerEnumerable
/// @author Aave Labs
/// @notice Extension of AccessManager that tracks role members and their function selectors using EnumerableSet.
/// @dev Roles, target contracts, and function selectors assigned to `ADMIN_ROLE` are excluded from tracking.
/// @dev `ADMIN_ROLE` and `PUBLIC_ROLE` cannot be labeled.
contract AccessManagerEnumerable is AccessManager, IAccessManagerEnumerable {
  using EnumerableSet for *;

  /// @dev Set of all role identifiers.
  /// @dev `PUBLIC_ROLE` and `ADMIN_ROLE` are not part of this set.
  /// @dev The roles tracked in this set are never removed, even if they have no members, assigned selectors, or assigned labels.
  EnumerableSet.UintSet private _rolesSet;

  /// @dev Set of all admin role identifiers.
  /// @dev `ADMIN_ROLE` is not part of this set.
  /// @dev The roles tracked in this set are never removed, even if they have no members or managed roles.
  EnumerableSet.UintSet private _adminRolesSet;

  /// @dev Set of all role labels.
  EnumerableSet.StringSet private _labelsSet;

  /// @dev Map of role identifiers to their respective member sets.
  mapping(uint64 roleId => EnumerableSet.AddressSet) private _roleMemberSet;

  /// @dev Map of admin role identifiers to their respective role identifier sets.
  /// @dev Roles managed by the `ADMIN_ROLE` are not included.
  mapping(uint64 roleId => EnumerableSet.UintSet) private _roleAdminToRoleSet;

  /// @dev Map of role identifiers to their respective target contract addresses.
  /// @dev Target contracts assigned to `ADMIN_ROLE` are not included.
  /// @dev A target is included in the set only if it has at least one selector assigned.
  mapping(uint64 roleId => EnumerableSet.AddressSet) private _roleToTargetSet;

  /// @dev Map of target contract addresses and function selectors to their assigned role identifier.
  mapping(address target => mapping(bytes4 selector => uint64 roleId))
    private _targetToSelectorToRole;

  /// @dev Map of role identifiers and target contract addresses to their respective set of function selectors.
  /// @dev Function selectors assigned to `ADMIN_ROLE` are not included.
  mapping(uint64 roleId => mapping(address target => EnumerableSet.Bytes32Set))
    private _roleToTargetToSelectorSet;

  /// @dev Map of role identifiers to their assigned labels.
  mapping(uint64 roleId => string label) private _roleToLabel;

  /// @dev Map of labels to their assigned role identifiers.
  mapping(string label => uint64 roleId) private _labelToRole;

  /// @dev Constructor.
  /// @param initialAdmin_ The address of the initial admin.
  constructor(address initialAdmin_) AccessManager(initialAdmin_) {}

  /// @inheritdoc IAccessManager
  function labelRole(
    uint64 roleId,
    string calldata label
  ) public override(AccessManager, IAccessManager) {
    super.labelRole(roleId, label);
    _trackRoleLabel(roleId, label);
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRole(uint256 index) external view returns (uint64) {
    return uint64(_rolesSet.at(index));
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleCount() external view returns (uint256) {
    return _rolesSet.length();
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoles(uint256 start, uint256 end) external view returns (uint64[] memory) {
    uint256[] memory listedRoles = _rolesSet.values(start, end);
    uint64[] memory roles;
    assembly ('memory-safe') {
      roles := listedRoles
    }
    return roles;
  }

  /// @inheritdoc IAccessManagerEnumerable
  function isRole(uint64 roleId) external view returns (bool) {
    return _rolesSet.contains(uint256(roleId));
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getAdminRole(uint256 index) external view returns (uint64) {
    return uint64(_adminRolesSet.at(index));
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getAdminRoleCount() external view returns (uint256) {
    return _adminRolesSet.length();
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getAdminRoles(uint256 start, uint256 end) external view returns (uint64[] memory) {
    uint256[] memory listedAdminRoles = _adminRolesSet.values(start, end);
    uint64[] memory adminRoles;
    assembly ('memory-safe') {
      adminRoles := listedAdminRoles
    }
    return adminRoles;
  }

  /// @inheritdoc IAccessManagerEnumerable
  function isAdminRole(uint64 adminRoleId) external view returns (bool) {
    return _adminRolesSet.contains(uint256(adminRoleId));
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleMember(uint64 roleId, uint256 index) external view returns (address) {
    return _roleMemberSet[roleId].at(index);
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleMemberCount(uint64 roleId) external view returns (uint256) {
    return _roleMemberSet[roleId].length();
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleMembers(
    uint64 roleId,
    uint256 start,
    uint256 end
  ) external view returns (address[] memory) {
    return _roleMemberSet[roleId].values(start, end);
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleOfAdminRole(uint64 adminRoleId, uint256 index) external view returns (uint64) {
    return uint64(_roleAdminToRoleSet[adminRoleId].at(index));
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleOfAdminRoleCount(uint64 adminRoleId) external view returns (uint256) {
    return _roleAdminToRoleSet[adminRoleId].length();
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRolesOfAdminRole(
    uint64 adminRoleId,
    uint256 start,
    uint256 end
  ) external view returns (uint64[] memory) {
    uint256[] memory listedRoles = _roleAdminToRoleSet[adminRoleId].values(start, end);
    uint64[] memory roles;
    assembly ('memory-safe') {
      roles := listedRoles
    }
    return roles;
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleTarget(uint64 roleId, uint256 index) external view returns (address) {
    return _roleToTargetSet[roleId].at(index);
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleTargetCount(uint64 roleId) external view returns (uint256) {
    return _roleToTargetSet[roleId].length();
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleTargets(
    uint64 roleId,
    uint256 start,
    uint256 end
  ) external view returns (address[] memory) {
    return _roleToTargetSet[roleId].values(start, end);
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleTargetSelector(
    uint64 roleId,
    address target,
    uint256 index
  ) external view returns (bytes4) {
    return bytes4(_roleToTargetToSelectorSet[roleId][target].at(index));
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleTargetSelectorCount(
    uint64 roleId,
    address target
  ) external view returns (uint256) {
    return _roleToTargetToSelectorSet[roleId][target].length();
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleTargetSelectors(
    uint64 roleId,
    address target,
    uint256 start,
    uint256 end
  ) external view returns (bytes4[] memory) {
    bytes32[] memory targetFunctions = _roleToTargetToSelectorSet[roleId][target].values(
      start,
      end
    );
    bytes4[] memory targetFunctionSelectors;
    assembly ('memory-safe') {
      targetFunctionSelectors := targetFunctions
    }
    return targetFunctionSelectors;
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleOfTargetSelector(address target, bytes4 selector) external view returns (uint64) {
    return _targetToSelectorToRole[target][selector];
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleLabel(uint256 index) external view returns (string memory) {
    return _labelsSet.at(index);
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleLabelCount() external view returns (uint256) {
    return _labelsSet.length();
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleLabels(uint256 start, uint256 end) external view returns (string[] memory) {
    return _labelsSet.values(start, end);
  }

  /// @inheritdoc IAccessManagerEnumerable
  function isLabelAssigned(string calldata label) external view returns (bool) {
    return _labelsSet.contains(label);
  }

  /// @inheritdoc IAccessManagerEnumerable
  function isRoleLabeled(uint64 roleId) external view returns (bool) {
    return bytes(_roleToLabel[roleId]).length > 0;
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getLabelOfRole(uint64 roleId) external view returns (string memory) {
    string memory label = _roleToLabel[roleId];
    require(_labelsSet.contains(label), AccessManagerUnlabeledRole(roleId));
    return label;
  }

  /// @inheritdoc IAccessManagerEnumerable
  function getRoleOfLabel(string calldata label) external view returns (uint64) {
    require(_labelsSet.contains(label), AccessManagerUnregisteredLabel(label));
    return _labelToRole[label];
  }

  /// @dev Overrides AccessManager `_setRoleAdmin` function to track admin roles.
  function _setRoleAdmin(uint64 roleId, uint64 admin) internal override {
    uint64 oldAdmin = getRoleAdmin(roleId);

    super._setRoleAdmin(roleId, admin);

    _trackRole(roleId);
    _trackAdminRole(roleId, oldAdmin, admin);
  }

  /// @dev Overrides AccessManager `_setRoleGuardian` function to track created roles.
  function _setRoleGuardian(uint64 roleId, uint64 guardian) internal override {
    super._setRoleGuardian(roleId, guardian);

    _trackRole(roleId);
  }

  /// @dev Overrides AccessManager `_grantRole` function to track role members.
  function _grantRole(
    uint64 roleId,
    address account,
    uint32 grantDelay,
    uint32 executionDelay
  ) internal override returns (bool) {
    bool newMember = super._grantRole(roleId, account, grantDelay, executionDelay);

    if (newMember) {
      _trackRole(roleId);
      _trackRoleMember(roleId, account, newMember);
    }

    return newMember;
  }

  /// @dev Overrides AccessManager `_revokeRole` function to track removed role members.
  function _revokeRole(uint64 roleId, address account) internal override returns (bool) {
    bool revoked = super._revokeRole(roleId, account);

    if (revoked) {
      _trackRoleMember(roleId, account, false);
    }

    return revoked;
  }

  /// @dev Overrides AccessManager `_setTargetFunctionRole` function to track function selectors attributed to roles.
  function _setTargetFunctionRole(
    address target,
    bytes4 selector,
    uint64 roleId
  ) internal override {
    super._setTargetFunctionRole(target, selector, roleId);

    _trackRole(roleId);
    _trackRoleTargetSelector(roleId, target, selector);
  }

  /// @dev Tracks all role identifiers when a new role is created.
  function _trackRole(uint64 roleId) internal {
    if (roleId == ADMIN_ROLE || roleId == PUBLIC_ROLE) {
      return;
    }

    _rolesSet.add(uint256(roleId));
  }

  /// @dev Tracks all admin role identifiers when a new admin role is set.
  function _trackAdminRole(uint64 roleId, uint64 oldAdmin, uint64 admin) internal {
    if (oldAdmin == admin) {
      return;
    }

    if (oldAdmin != ADMIN_ROLE) {
      _roleAdminToRoleSet[oldAdmin].remove(uint256(roleId));
    }

    if (admin != ADMIN_ROLE) {
      _adminRolesSet.add(uint256(admin));
      _roleAdminToRoleSet[admin].add(uint256(roleId));
    }
  }

  /// @dev Tracks all members of a role when granted or revoked.
  function _trackRoleMember(uint64 roleId, address account, bool granted) internal {
    if (granted) {
      _roleMemberSet[roleId].add(account);
    } else {
      _roleMemberSet[roleId].remove(account);
    }
  }

  /// @dev Tracks labels assigned to roles.
  /// @dev To remove an existing label, pass an empty string as label.
  /// @dev To relabel a role, first remove the existing label, then set the new label.
  /// @dev Reverts if the label is already assigned to another role.
  function _trackRoleLabel(uint64 roleId, string calldata label) internal {
    string memory oldLabel = _roleToLabel[roleId];
    bool hasOldLabel = bytes(oldLabel).length > 0;

    // remove existing label
    if (bytes(label).length == 0) {
      require(hasOldLabel, AccessManagerUnlabeledRole(roleId));
      _labelsSet.remove(oldLabel);
      delete _labelToRole[oldLabel];
      delete _roleToLabel[roleId];
      return;
    }

    // set new label
    require(!hasOldLabel, AccessManagerRoleAlreadyLabeled(roleId));
    require(!_labelsSet.contains(label), AccessManagerLabelAlreadyUsed(label, _labelToRole[label]));

    _trackRole(roleId);
    _labelsSet.add(label);
    _labelToRole[label] = roleId;
    _roleToLabel[roleId] = label;
  }

  /// @dev Tracks all targets where a selector was assigned to a role and selectors.
  function _trackRoleTargetSelector(uint64 roleId, address target, bytes4 selector) internal {
    uint64 oldRoleId = _targetToSelectorToRole[target][selector];
    if (oldRoleId == roleId) {
      return;
    }

    if (oldRoleId != ADMIN_ROLE) {
      _roleToTargetToSelectorSet[oldRoleId][target].remove(bytes32(selector));
      if (_roleToTargetToSelectorSet[oldRoleId][target].length() == 0) {
        _roleToTargetSet[oldRoleId].remove(target);
      }
    }

    if (roleId != ADMIN_ROLE) {
      _roleToTargetToSelectorSet[roleId][target].add(bytes32(selector));
      _roleToTargetSet[roleId].add(target);
    }
    _targetToSelectorToRole[target][selector] = roleId;
  }
}
