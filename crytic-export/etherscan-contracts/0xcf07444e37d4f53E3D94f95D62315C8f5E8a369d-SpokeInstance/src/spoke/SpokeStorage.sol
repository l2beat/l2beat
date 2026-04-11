// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {ISpoke} from 'src/spoke/interfaces/ISpoke.sol';

/// @title SpokeStorage
/// @author Aave Labs
/// @notice Storage layout for the Spoke contract.
/// @dev This contract defines all storage variables used by Spoke.
abstract contract SpokeStorage {
  /// @dev Number of reserves listed in the Spoke.
  uint256 internal _reserveCount;

  /// @dev Liquidation configuration for the Spoke.
  ISpoke.LiquidationConfig internal _liquidationConfig;

  /// @dev Map of reserve identifiers to their Reserve data.
  mapping(uint256 reserveId => ISpoke.Reserve) internal _reserves;

  /// @dev Map of hub addresses and asset identifiers to the reserve identifier.
  mapping(address hub => mapping(uint256 assetId => uint256 reserveId))
    internal _hubAssetIdToReserveId;

  /// @dev Map of reserve identifiers and dynamic configuration keys to the dynamic configuration data.
  mapping(uint256 reserveId => mapping(uint32 dynamicConfigKey => ISpoke.DynamicReserveConfig))
    internal _dynamicConfig;

  /// @dev Map of user addresses to their position status.
  mapping(address user => ISpoke.PositionStatus) internal _positionStatus;

  /// @dev Map of user addresses and reserve identifiers to user positions.
  mapping(address user => mapping(uint256 reserveId => ISpoke.UserPosition))
    internal _userPositions;

  /// @dev Map of position manager addresses to their configuration data.
  mapping(address positionManager => ISpoke.PositionManagerConfig) internal _positionManager;

  /// @dev Reserved storage space to allow for future layout updates.
  uint256[50] private __gap;
}
