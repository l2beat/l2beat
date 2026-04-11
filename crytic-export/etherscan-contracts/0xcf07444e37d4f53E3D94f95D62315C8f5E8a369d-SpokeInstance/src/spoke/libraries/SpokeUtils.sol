// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {WadRayMath} from 'src/libraries/math/WadRayMath.sol';
import {MathUtils} from 'src/libraries/math/MathUtils.sol';
import {ISpoke} from 'src/spoke/interfaces/ISpoke.sol';

/// @title SpokeUtils library
/// @author Aave Labs
/// @notice Provides utility functions for the Spoke contract.
library SpokeUtils {
  /// @dev See Spoke.ORACLE_DECIMALS docs
  uint8 public constant ORACLE_DECIMALS = 8;

  /// @notice Returns the reserve for a given reserve id.
  /// @param reserves The mapping of reserves per reserve id.
  /// @param reserveId The identifier of the reserve.
  /// @return The reserve.
  function get(
    mapping(uint256 reserveId => ISpoke.Reserve) storage reserves,
    uint256 reserveId
  ) internal view returns (ISpoke.Reserve storage) {
    ISpoke.Reserve storage reserve = reserves[reserveId];
    require(address(reserve.hub) != address(0), ISpoke.ReserveNotListed());
    return reserve;
  }

  /// @notice Converts an asset amount to Value. 1e26 represents 1 USD.
  /// @dev Reverts if asset uses more than 18 decimals. Reverts if multiplication overflows.
  /// @param amount The asset amount.
  /// @param decimals The decimals of the asset.
  /// @param price The price of the asset.
  /// @return The amount in units of Value.
  function toValue(
    uint256 amount,
    uint256 decimals,
    uint256 price
  ) internal pure returns (uint256) {
    return amount * price * MathUtils.uncheckedExp(10, WadRayMath.WAD_DECIMALS - decimals);
  }
}
