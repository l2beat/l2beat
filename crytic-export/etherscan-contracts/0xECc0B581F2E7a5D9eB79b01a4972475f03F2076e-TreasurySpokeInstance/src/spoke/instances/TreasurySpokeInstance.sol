// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {TreasurySpoke} from 'src/spoke/TreasurySpoke.sol';

/// @title TreasurySpokeInstance
/// @author Aave Labs
/// @notice Implementation contract for the TreasurySpoke.
contract TreasurySpokeInstance is TreasurySpoke {
  uint64 public constant SPOKE_REVISION = 1;

  /// @dev Constructor.
  constructor() {
    _disableInitializers();
  }

  /// @notice Initializer.
  /// @param owner The address of the owner.
  function initialize(address owner) external override reinitializer(SPOKE_REVISION) {
    __Ownable_init(owner);
    __Ownable2Step_init();
  }
}
