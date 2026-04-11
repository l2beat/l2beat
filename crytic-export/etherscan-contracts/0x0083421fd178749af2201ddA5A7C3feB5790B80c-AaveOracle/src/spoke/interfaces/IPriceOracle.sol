// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

/// @title IPriceOracle
/// @author Aave Labs
/// @notice Basic interface for any price oracle.
/// @dev All prices must use the same number of decimals as the oracle and should be returned in the same currency.
interface IPriceOracle {
  /// @dev Reverts if the caller is not the Spoke.
  error OnlySpoke();

  /// @notice Returns the address of the Spoke.
  function spoke() external view returns (address);

  /// @notice Returns the number of decimals used to return prices.
  function decimals() external view returns (uint8);

  /// @notice Returns the reserve price with `decimals` precision.
  /// @dev Reverts if the price is not greater than 0.
  /// @param reserveId The identifier of the reserve.
  /// @return The price of the reserve.
  function getReservePrice(uint256 reserveId) external view returns (uint256);
}
