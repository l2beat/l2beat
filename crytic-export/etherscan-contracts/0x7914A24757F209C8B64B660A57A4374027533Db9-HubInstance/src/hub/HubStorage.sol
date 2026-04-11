// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {EnumerableSet} from 'src/dependencies/openzeppelin/EnumerableSet.sol';
import {IHub} from 'src/hub/interfaces/IHub.sol';

/// @title HubStorage
/// @author Aave Labs
/// @notice Storage layout for the Hub contract.
/// @dev This contract defines all storage variables used by the Hub.
abstract contract HubStorage {
  /// @dev Number of assets listed in the Hub.
  uint256 internal _assetCount;

  /// @dev Map of asset identifiers to Asset data.
  mapping(uint256 assetId => IHub.Asset) internal _assets;

  /// @dev Map of asset identifiers and spoke addresses to Spoke data.
  mapping(uint256 assetId => mapping(address spoke => IHub.SpokeData)) internal _spokes;

  /// @dev Map of asset identifiers to set of spoke addresses.
  mapping(uint256 assetId => EnumerableSet.AddressSet) internal _assetToSpokes;

  /// @dev Map of underlying addresses to asset identifiers.
  mapping(address underlying => uint256 assetId) internal _underlyingToAssetId;

  /// @dev Reserved storage space to allow for future layout updates.
  uint256[50] private __gap;
}
