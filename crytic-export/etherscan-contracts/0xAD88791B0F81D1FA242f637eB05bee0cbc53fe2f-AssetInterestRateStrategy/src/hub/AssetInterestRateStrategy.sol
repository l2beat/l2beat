// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {WadRayMath} from 'src/libraries/math/WadRayMath.sol';
import {
  IAssetInterestRateStrategy,
  IBasicInterestRateStrategy
} from 'src/hub/interfaces/IAssetInterestRateStrategy.sol';

/// @title AssetInterestRateStrategy
/// @author Aave Labs
/// @notice Manages the optimal-usage-based interest rate strategy for an asset.
/// @dev Strategies are Hub-specific, due to the usage of asset identifier as index of the `_interestRateData` mapping.
contract AssetInterestRateStrategy is IAssetInterestRateStrategy {
  using WadRayMath for *;

  /// @inheritdoc IAssetInterestRateStrategy
  uint256 public constant MAX_ALLOWED_DRAWN_RATE = 1000_00;

  /// @inheritdoc IAssetInterestRateStrategy
  uint256 public constant MIN_OPTIMAL_RATIO = 1_00;

  /// @inheritdoc IAssetInterestRateStrategy
  uint256 public constant MAX_OPTIMAL_RATIO = 99_00;

  /// @inheritdoc IAssetInterestRateStrategy
  address public immutable HUB;

  /// @dev Map of asset identifiers to their interest rate data.
  mapping(uint256 assetId => InterestRateData) internal _interestRateData;

  /// @dev Constructor.
  /// @param hub_ The address of the associated Hub.
  constructor(address hub_) {
    require(hub_ != address(0), InvalidAddress());
    HUB = hub_;
  }

  /// @notice Sets the interest rate parameters for a specified asset.
  /// @param assetId The identifier of the asset.
  /// @param data The encoded parameters containing BPS data used to configure the interest rate of the asset.
  function setInterestRateData(uint256 assetId, bytes calldata data) external {
    require(HUB == msg.sender, OnlyHub());
    InterestRateData memory rateData = abi.decode(data, (InterestRateData));
    require(
      MIN_OPTIMAL_RATIO <= rateData.optimalUsageRatio &&
        rateData.optimalUsageRatio <= MAX_OPTIMAL_RATIO,
      InvalidOptimalUsageRatio()
    );
    require(
      rateData.baseDrawnRate + rateData.rateGrowthBeforeOptimal + rateData.rateGrowthAfterOptimal <=
        MAX_ALLOWED_DRAWN_RATE,
      InvalidMaxDrawnRate()
    );

    _interestRateData[assetId] = rateData;

    emit UpdateInterestRateData(
      HUB,
      assetId,
      rateData.optimalUsageRatio,
      rateData.baseDrawnRate,
      rateData.rateGrowthBeforeOptimal,
      rateData.rateGrowthAfterOptimal
    );
  }

  /// @inheritdoc IAssetInterestRateStrategy
  function getInterestRateData(uint256 assetId) external view returns (InterestRateData memory) {
    return _interestRateData[assetId];
  }

  /// @inheritdoc IAssetInterestRateStrategy
  function getOptimalUsageRatio(uint256 assetId) external view returns (uint256) {
    return _interestRateData[assetId].optimalUsageRatio;
  }

  /// @inheritdoc IAssetInterestRateStrategy
  function getBaseDrawnRate(uint256 assetId) external view returns (uint256) {
    return _interestRateData[assetId].baseDrawnRate;
  }

  /// @inheritdoc IAssetInterestRateStrategy
  function getRateGrowthBeforeOptimal(uint256 assetId) external view returns (uint256) {
    return _interestRateData[assetId].rateGrowthBeforeOptimal;
  }

  /// @inheritdoc IAssetInterestRateStrategy
  function getRateGrowthAfterOptimal(uint256 assetId) external view returns (uint256) {
    return _interestRateData[assetId].rateGrowthAfterOptimal;
  }

  /// @inheritdoc IAssetInterestRateStrategy
  function getMaxDrawnRate(uint256 assetId) external view returns (uint256) {
    return
      _interestRateData[assetId].baseDrawnRate +
      _interestRateData[assetId].rateGrowthBeforeOptimal +
      _interestRateData[assetId].rateGrowthAfterOptimal;
  }

  /// @inheritdoc IBasicInterestRateStrategy
  function calculateInterestRate(
    uint256 assetId,
    uint256 liquidity,
    uint256 drawn,
    uint256 /* deficit */,
    uint256 swept
  ) external view returns (uint256) {
    InterestRateData memory rateData = _interestRateData[assetId];
    require(rateData.optimalUsageRatio > 0, InterestRateDataNotSet(assetId));

    uint256 currentDrawnRateRay = rateData.baseDrawnRate.bpsToRay();
    if (drawn == 0) {
      return currentDrawnRateRay;
    }

    uint256 usageRatioRay = drawn.rayDivUp(liquidity + drawn + swept);
    uint256 optimalUsageRatioRay = rateData.optimalUsageRatio.bpsToRay();

    if (usageRatioRay <= optimalUsageRatioRay) {
      currentDrawnRateRay += rateData
        .rateGrowthBeforeOptimal
        .bpsToRay()
        .rayMulUp(usageRatioRay)
        .rayDivUp(optimalUsageRatioRay);
    } else {
      currentDrawnRateRay +=
        rateData.rateGrowthBeforeOptimal.bpsToRay() +
        rateData
          .rateGrowthAfterOptimal
          .bpsToRay()
          .rayMulUp(usageRatioRay - optimalUsageRatioRay)
          .rayDivUp(WadRayMath.RAY - optimalUsageRatioRay);
    }

    return currentDrawnRateRay;
  }
}
