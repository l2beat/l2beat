// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

import {IAccessManager} from 'src/dependencies/openzeppelin/IAccessManager.sol';

/// @title IAccessManagerEnumerable
/// @author Aave Labs
/// @notice Interface for AccessManagerEnumerable extension.
interface IAccessManagerEnumerable is IAccessManager {
  /// @notice Thrown when the role has not been labeled.
  error AccessManagerUnlabeledRole(uint64 roleId);

  /// @notice Thrown when the label is not assigned to any role.
  error AccessManagerUnregisteredLabel(string label);

  /// @notice Thrown when the role has already been labeled.
  error AccessManagerRoleAlreadyLabeled(uint64 roleId);

  /// @notice Thrown when the label is already assigned to a different role.
  error AccessManagerLabelAlreadyUsed(string label, uint64 roleId);

  /// @notice Returns the identifier of the role at a specified index.
  /// @dev `PUBLIC_ROLE` and `ADMIN_ROLE` are not accessible via any index.
  /// @dev Roles with no assigned members are also accessible.
  /// @param index The index in the role list.
  /// @return The identifier of the role.
  function getRole(uint256 index) external view returns (uint64);

  /// @notice Returns the total number of existing roles.
  /// @dev `PUBLIC_ROLE` and `ADMIN_ROLE` are not included in the role count.
  /// @dev Roles with no assigned members are also taken into account.
  /// @return The number of roles.
  function getRoleCount() external view returns (uint256);

  /// @notice Returns the list of role identifiers between the specified indexes.
  /// @dev `PUBLIC_ROLE` and `ADMIN_ROLE` are not accessible via any index.
  /// @dev Roles with no assigned members are also accessible.
  /// @param start The starting index for the role list.
  /// @param end The ending index for the role list.
  /// @return The list of role identifiers.
  function getRoles(uint256 start, uint256 end) external view returns (uint64[] memory);

  /// @notice Returns whether the specified role exists.
  /// @dev `PUBLIC_ROLE` and `ADMIN_ROLE` are not taken into account.
  /// @param roleId The identifier of the role.
  function isRole(uint64 roleId) external view returns (bool);

  /// @notice Returns the identifier of the admin role at a specified index.
  /// @dev `ADMIN_ROLE` is not accessible via any index.
  /// @dev Admin roles with no assigned members or managed roles are also accessible.
  /// @param index The index in the admin role list.
  /// @return The identifier of the admin role.
  function getAdminRole(uint256 index) external view returns (uint64);

  /// @notice Returns the total number of existing admin roles.
  /// @dev `ADMIN_ROLE` is not included in the admin role count.
  /// @dev Admin roles with no assigned members or managed roles are also taken into account.
  /// @return The number of admin roles.
  function getAdminRoleCount() external view returns (uint256);

  /// @notice Returns the list of admin role identifiers between the specified indexes.
  /// @dev `ADMIN_ROLE` is not accessible via any index.
  /// @dev Admin roles with no assigned members or managed roles are also accessible.
  /// @param start The starting index for the admin role list.
  /// @param end The ending index for the admin role list.
  /// @return The list of admin role identifiers.
  function getAdminRoles(uint256 start, uint256 end) external view returns (uint64[] memory);

  /// @notice Returns whether the specified admin role exists.
  /// @dev `ADMIN_ROLE` is not taken into account.
  /// @param adminRoleId The identifier of the admin role.
  function isAdminRole(uint64 adminRoleId) external view returns (bool);

  /// @notice Returns the address of the role member at a specified index.
  /// @param roleId The identifier of the role.
  /// @param index The index in the role member list.
  /// @return The address of the role member.
  function getRoleMember(uint64 roleId, uint256 index) external view returns (address);

  /// @notice Returns the number of members for a specified role.
  /// @param roleId The identifier of the role.
  /// @return The number of members for the role.
  function getRoleMemberCount(uint64 roleId) external view returns (uint256);

  /// @notice Returns the list of members for a specified role between the specified indexes.
  /// @param roleId The identifier of the role.
  /// @param start The starting index for the member list.
  /// @param end The ending index for the member list.
  /// @return The list of members for the role.
  function getRoleMembers(
    uint64 roleId,
    uint256 start,
    uint256 end
  ) external view returns (address[] memory);

  /// @notice Returns the identifier of the role managed by the given admin role at a specified index.
  /// @dev Roles managed by the `ADMIN_ROLE` are not accessible.
  /// @param adminRoleId The identifier of the admin role.
  /// @param index The index in the list of roles managed by the admin role.
  /// @return The identifier of the role.
  function getRoleOfAdminRole(uint64 adminRoleId, uint256 index) external view returns (uint64);

  /// @notice Returns the number of roles managed by a specified admin role.
  /// @dev Roles managed by the `ADMIN_ROLE` are not accessible.
  /// @param adminRoleId The identifier of the admin role.
  /// @return The number of roles managed by the admin role.
  function getRoleOfAdminRoleCount(uint64 adminRoleId) external view returns (uint256);

  /// @notice Returns the list of role identifiers managed by the given admin role between the specified indexes.
  /// @dev Roles managed by the `ADMIN_ROLE` are not accessible.
  /// @param adminRoleId The identifier of the admin role.
  /// @param start The starting index in the list of roles managed by the admin role.
  /// @param end The ending index in the list of roles managed by the admin role.
  /// @return The list of role identifiers managed by the given admin role.
  function getRolesOfAdminRole(
    uint64 adminRoleId,
    uint256 start,
    uint256 end
  ) external view returns (uint64[] memory);

  /// @notice Returns the address of the target contract for a specified role and index.
  /// @dev Target contracts assigned to `ADMIN_ROLE` are not accessible.
  /// @param roleId The identifier of the role.
  /// @param index The index in the role target list.
  /// @return The address of the target contract.
  function getRoleTarget(uint64 roleId, uint256 index) external view returns (address);

  /// @notice Returns the number of target contracts for a specified role.
  /// @dev Target contracts assigned to `ADMIN_ROLE` are not accessible.
  /// @param roleId The identifier of the role.
  /// @return The number of target contracts for the role.
  function getRoleTargetCount(uint64 roleId) external view returns (uint256);

  /// @notice Returns the list of target contracts for a specified role between the specified indexes.
  /// @dev Target contracts assigned to `ADMIN_ROLE` are not accessible.
  /// @param roleId The identifier of the role.
  /// @param start The starting index for the role target list.
  /// @param end The ending index for the role target list.
  /// @return The list of target contracts for the role.
  function getRoleTargets(
    uint64 roleId,
    uint256 start,
    uint256 end
  ) external view returns (address[] memory);

  /// @notice Returns the function selector assigned to a given role at the specified index.
  /// @dev Target selectors assigned to `ADMIN_ROLE` are not accessible.
  /// @param roleId The identifier of the role.
  /// @param target The address of the target contract.
  /// @param index The index in the role member list.
  /// @return The selector at the index.
  function getRoleTargetSelector(
    uint64 roleId,
    address target,
    uint256 index
  ) external view returns (bytes4);

  /// @notice Returns the number of function selectors assigned to the given role.
  /// @dev Target selectors assigned to `ADMIN_ROLE` are not accessible.
  /// @param roleId The identifier of the role.
  /// @param target The address of the target contract.
  /// @return The number of selectors assigned to the role.
  function getRoleTargetSelectorCount(
    uint64 roleId,
    address target
  ) external view returns (uint256);

  /// @notice Returns the list of function selectors assigned to the given role between the specified indexes.
  /// @dev Target selectors assigned to `ADMIN_ROLE` are not accessible.
  /// @param roleId The identifier of the role.
  /// @param target The address of the target contract.
  /// @param start The starting index for the selector list.
  /// @param end The ending index for the selector list.
  /// @return The list of selectors assigned to the role.
  function getRoleTargetSelectors(
    uint64 roleId,
    address target,
    uint256 start,
    uint256 end
  ) external view returns (bytes4[] memory);

  /// @notice Returns the role identifier for the specified function selector.
  /// @param target The address of the target contract.
  /// @param selector The function selector.
  /// @return The identifier of the role.
  function getRoleOfTargetSelector(address target, bytes4 selector) external view returns (uint64);

  /// @notice Returns the label at a specified index.
  /// @param index The index in the labeled role list.
  /// @return The label at the index.
  function getRoleLabel(uint256 index) external view returns (string memory);

  /// @notice Returns the total number of assigned role labels.
  function getRoleLabelCount() external view returns (uint256);

  /// @notice Returns the list of role labels between the specified indexes.
  /// @param start The starting index for the labeled role list.
  /// @param end The ending index for the labeled role list.
  /// @return The list of role labels.
  function getRoleLabels(uint256 start, uint256 end) external view returns (string[] memory);

  /// @notice Returns whether the specified label is assigned to any tracked role.
  /// @param label The label string.
  function isLabelAssigned(string calldata label) external view returns (bool);

  /// @notice Returns whether the given role has been labeled.
  /// @param roleId The identifier of the role.
  function isRoleLabeled(uint64 roleId) external view returns (bool);

  /// @notice Returns the label of a specified role.
  /// @dev `PUBLIC_ROLE` and `ADMIN_ROLE` cannot be labeled.
  /// @dev Reverts with `AccessManagerUnlabeledRole` if the role has no assigned label.
  /// @param roleId The identifier of the role.
  /// @return The label of the role.
  function getLabelOfRole(uint64 roleId) external view returns (string memory);

  /// @notice Returns the role identifier for the specified label.
  /// @dev Reverts with `AccessManagerUnregisteredLabel` if the label is not assigned to any role.
  /// @param label The label string.
  /// @return The identifier of the role.
  function getRoleOfLabel(string calldata label) external view returns (uint64);
}
