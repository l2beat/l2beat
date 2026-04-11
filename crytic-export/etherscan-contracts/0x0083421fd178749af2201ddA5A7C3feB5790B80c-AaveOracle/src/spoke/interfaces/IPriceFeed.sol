// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

/// @title IPriceFeed
/// @author Aave Labs
/// @notice Defines the minimal functions needed to work with the AaveOracle contract.
interface IPriceFeed {
  /// @notice Returns the number of decimals used to represent the price.
  function decimals() external view returns (uint8);

  /// @notice Returns the description of the feed.
  function description() external view returns (string memory);

  /// @notice Returns the latest price answer, expressed with `decimals` precision.
  function latestAnswer() external view returns (int256);
}
