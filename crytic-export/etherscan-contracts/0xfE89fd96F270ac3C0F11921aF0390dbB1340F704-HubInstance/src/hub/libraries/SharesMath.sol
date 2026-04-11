// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {Math} from 'src/dependencies/openzeppelin/Math.sol';

/// @title SharesMath library
/// @author Aave Labs
/// @notice Implements the logic to convert between assets and shares.
/// @dev Utilizes virtual assets and shares to mitigate share manipulation attacks.
library SharesMath {
  using Math for uint256;

  uint256 internal constant VIRTUAL_ASSETS = 1e6;
  uint256 internal constant VIRTUAL_SHARES = 1e6;

  /// @notice Converts an amount of assets to the equivalent amount of shares, rounding down.
  function toSharesDown(
    uint256 assets,
    uint256 totalAssets,
    uint256 totalShares
  ) internal pure returns (uint256) {
    return
      assets.mulDiv(
        totalShares + VIRTUAL_SHARES,
        totalAssets + VIRTUAL_ASSETS,
        Math.Rounding.Floor
      );
  }

  /// @notice Converts an amount of shares to the equivalent amount of assets, rounding down.
  function toAssetsDown(
    uint256 shares,
    uint256 totalAssets,
    uint256 totalShares
  ) internal pure returns (uint256) {
    return
      shares.mulDiv(
        totalAssets + VIRTUAL_ASSETS,
        totalShares + VIRTUAL_SHARES,
        Math.Rounding.Floor
      );
  }

  /// @notice Converts an amount of assets to the equivalent amount of shares, rounding up.
  function toSharesUp(
    uint256 assets,
    uint256 totalAssets,
    uint256 totalShares
  ) internal pure returns (uint256) {
    return
      assets.mulDiv(totalShares + VIRTUAL_SHARES, totalAssets + VIRTUAL_ASSETS, Math.Rounding.Ceil);
  }

  /// @notice Converts an amount of shares to the equivalent amount of assets, rounding up.
  function toAssetsUp(
    uint256 shares,
    uint256 totalAssets,
    uint256 totalShares
  ) internal pure returns (uint256) {
    return
      shares.mulDiv(totalAssets + VIRTUAL_ASSETS, totalShares + VIRTUAL_SHARES, Math.Rounding.Ceil);
  }
}
