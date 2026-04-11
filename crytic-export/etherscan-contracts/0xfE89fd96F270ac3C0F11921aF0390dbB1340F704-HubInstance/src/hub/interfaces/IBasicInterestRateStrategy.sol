// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

/// @title IBasicInterestRateStrategy
/// @author Aave Labs
/// @notice Basic interface for any interest rate strategy.
interface IBasicInterestRateStrategy {
  /// @notice Thrown when the interest rate data is not set for the asset.
  /// @param assetId The identifier of the asset with no interest rate data set.
  error InterestRateDataNotSet(uint256 assetId);

  /// @notice Sets the interest rate parameters for a specified asset.
  /// @param assetId The identifier of the asset.
  /// @param data The encoded parameters used to configure the interest rate of the asset.
  function setInterestRateData(uint256 assetId, bytes calldata data) external;

  /// @notice Calculates the interest rate depending on the asset's state and configurations.
  /// @param assetId The identifier of the asset.
  /// @param liquidity The current available liquidity of the asset.
  /// @param drawn The current drawn amount of the asset.
  /// @param deficit The current deficit of the asset.
  /// @param swept The current swept (reinvested) amount of the asset.
  /// @return The interest rate, expressed in RAY.
  function calculateInterestRate(
    uint256 assetId,
    uint256 liquidity,
    uint256 drawn,
    uint256 deficit,
    uint256 swept
  ) external view returns (uint256);
}
