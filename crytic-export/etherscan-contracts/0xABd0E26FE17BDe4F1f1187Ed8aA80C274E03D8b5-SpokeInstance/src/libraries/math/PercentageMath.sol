// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

/// @title PercentageMath library
/// @author Aave Labs
/// @notice Provides functions to perform percentage calculations with explicit rounding.
/// @dev Percentages are defined by default with 2 decimals of precision (100.00). The precision is indicated by `PERCENTAGE_FACTOR`.
library PercentageMath {
  // Percentage factor expressed in BPS (100.00%)
  uint256 internal constant PERCENTAGE_FACTOR = 1e4;

  /// @notice Executes a percentage multiplication, rounded down.
  /// @dev Reverts if intermediate multiplication overflows.
  /// @return result = floor(value * percentage / PERCENTAGE_FACTOR)
  function percentMulDown(
    uint256 value,
    uint256 percentage
  ) internal pure returns (uint256 result) {
    // to avoid overflow, value <= type(uint256).max / percentage
    assembly ('memory-safe') {
      if iszero(or(iszero(percentage), iszero(gt(value, div(not(0), percentage))))) {
        revert(0, 0)
      }

      result := div(mul(value, percentage), PERCENTAGE_FACTOR)
    }
  }

  /// @notice Executes a percentage multiplication, rounded up.
  /// @dev Reverts if intermediate multiplication overflows.
  /// @return result = ceil(value * percentage / PERCENTAGE_FACTOR)
  function percentMulUp(uint256 value, uint256 percentage) internal pure returns (uint256 result) {
    // to avoid overflow, value <= type(uint256).max / percentage
    assembly ('memory-safe') {
      if iszero(or(iszero(percentage), iszero(gt(value, div(not(0), percentage))))) {
        revert(0, 0)
      }
      result := mul(value, percentage)

      // Add 1 if (value * percentage) % PERCENTAGE_FACTOR > 0 to round up the division of (value * percentage) by PERCENTAGE_FACTOR
      result := add(div(result, PERCENTAGE_FACTOR), gt(mod(result, PERCENTAGE_FACTOR), 0))
    }
  }

  /// @notice Executes a percentage division, rounded down.
  /// @dev Reverts if division by zero or intermediate multiplication overflows.
  /// @return result = floor(value * PERCENTAGE_FACTOR / percentage)
  function percentDivDown(
    uint256 value,
    uint256 percentage
  ) internal pure returns (uint256 result) {
    // to avoid overflow, value <= type(uint256).max / PERCENTAGE_FACTOR
    assembly ('memory-safe') {
      if or(iszero(percentage), iszero(iszero(gt(value, div(not(0), PERCENTAGE_FACTOR))))) {
        revert(0, 0)
      }

      result := div(mul(value, PERCENTAGE_FACTOR), percentage)
    }
  }

  /// @notice Executes a percentage division, rounded up.
  /// @dev Reverts if division by zero or intermediate multiplication overflows.
  /// @return result = ceil(value * PERCENTAGE_FACTOR / percentage)
  function percentDivUp(uint256 value, uint256 percentage) internal pure returns (uint256 result) {
    // to avoid overflow, value <= type(uint256).max / PERCENTAGE_FACTOR
    assembly ('memory-safe') {
      if or(iszero(percentage), iszero(iszero(gt(value, div(not(0), PERCENTAGE_FACTOR))))) {
        revert(0, 0)
      }
      result := mul(value, PERCENTAGE_FACTOR)

      // Add 1 if (value * PERCENTAGE_FACTOR) % percentage > 0 to round up the division of (value * PERCENTAGE_FACTOR) by percentage
      result := add(div(result, percentage), gt(mod(result, percentage), 0))
    }
  }

  /// @notice Truncates number from BPS precision, rounding down.
  function fromBpsDown(uint256 value) internal pure returns (uint256) {
    return value / PERCENTAGE_FACTOR;
  }
}
