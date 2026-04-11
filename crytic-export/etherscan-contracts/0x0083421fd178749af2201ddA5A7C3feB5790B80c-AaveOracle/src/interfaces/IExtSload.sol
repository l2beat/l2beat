// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

/// @title IExtSload
/// @author Aave Labs
/// @notice Minimal interface to easily access storage of source contract externally. See https://eips.ethereum.org/EIPS/eip-2330#rationale.
interface IExtSload {
  /// @notice Returns the storage `value` of this contract at a given `slot`.
  /// @param slot Slot to SLOAD from.
  function extSload(bytes32 slot) external view returns (bytes32 value);

  /// @notice Returns the storage `values` of this contract at the given `slots`.
  /// @param slots Array of slots to SLOAD from.
  function extSloads(bytes32[] calldata slots) external view returns (bytes32[] memory values);
}
