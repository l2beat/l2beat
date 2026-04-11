// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {SafeCast} from 'src/dependencies/openzeppelin/SafeCast.sol';

/// @title Premium library
/// @author Aave Labs
/// @notice Implements the premium calculations.
library Premium {
  using SafeCast for *;

  /// @notice Calculates the premium debt with full precision.
  /// @param premiumShares The number of premium shares.
  /// @param premiumOffsetRay The premium offset, expressed in asset units and scaled by RAY.
  /// @param drawnIndex The drawn index at which premium debt is calculated.
  /// @return The premium debt, expressed in asset units and scaled by RAY.
  function calculatePremiumRay(
    uint256 premiumShares,
    int256 premiumOffsetRay,
    uint256 drawnIndex
  ) internal pure returns (uint256) {
    return ((premiumShares * drawnIndex).toInt256() - premiumOffsetRay).toUint256();
  }
}
