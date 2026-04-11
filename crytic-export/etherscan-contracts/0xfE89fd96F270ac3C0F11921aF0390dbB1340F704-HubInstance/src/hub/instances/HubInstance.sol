// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {Hub} from 'src/hub/Hub.sol';

/// @title HubInstance
/// @author Aave Labs
/// @notice Implementation contract for the Hub.
contract HubInstance is Hub {
  uint64 public constant HUB_REVISION = 1;

  /// @dev Constructor.
  constructor() {
    _disableInitializers();
  }

  /// @notice Initializer.
  /// @dev The authority contract must implement the `AccessManaged` interface for access control.
  /// @param authority The address of the authority contract which manages permissions.
  function initialize(address authority) external override reinitializer(HUB_REVISION) {
    require(authority != address(0), InvalidAddress());
    __AccessManaged_init(authority);
  }
}
