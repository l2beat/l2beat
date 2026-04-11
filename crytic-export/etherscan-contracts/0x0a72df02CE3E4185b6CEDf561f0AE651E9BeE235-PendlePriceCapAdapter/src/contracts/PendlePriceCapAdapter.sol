// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.19;

import {IPendlePriceCapAdapter, ICLSynchronicityPriceAdapter, IACLManager, IChainlinkAggregator} from '../interfaces/IPendlePriceCapAdapter.sol';
import {IPendlePrincipalToken} from '../interfaces/IPendlePrincipalToken.sol';

/**
 * @title PendlePriceCapAdapter
 * @author BGD Labs
 * @notice Price adapter to cap the price of the PT-tokens.
 * This adapter uses a linear discount decay model, from `maxDiscountPerYear * timeToMaturity` to 0 after and at maturity.
 * `discountRatePerYear` cannot be set greater than `MAX_DISCOUNT_RATE_PER_YEAR`, only less than, but not zero.
 *
 * The price of PT token (PT_price) is calculated as:
 *
 * currentDiscount = (maturity - block.timestamp) * discountRatePerYear / SECONDS_PER_YEAR
 * PT_price = priceOfAsset * (PERCENTAGE_FACTOR - currentDiscount) / PERCENTAGE_FACTOR
 */
contract PendlePriceCapAdapter is IPendlePriceCapAdapter {
  /// @inheritdoc IPendlePriceCapAdapter
  uint256 public constant PERCENTAGE_FACTOR = 1e18; // 100%

  /// @inheritdoc IPendlePriceCapAdapter
  uint256 public constant SECONDS_PER_YEAR = 365 days;

  /// @inheritdoc IPendlePriceCapAdapter
  IPendlePrincipalToken public immutable PENDLE_PRINCIPAL_TOKEN;

  /// @inheritdoc IPendlePriceCapAdapter
  IChainlinkAggregator public immutable ASSET_TO_USD_AGGREGATOR;

  /// @inheritdoc IPendlePriceCapAdapter
  IACLManager public immutable ACL_MANAGER;

  /// @inheritdoc IPendlePriceCapAdapter
  uint8 public immutable DECIMALS;

  /// @inheritdoc IPendlePriceCapAdapter
  uint256 public immutable MATURITY;

  /// @inheritdoc IPendlePriceCapAdapter
  uint64 public immutable MAX_DISCOUNT_RATE_PER_YEAR;

  /// @inheritdoc IPendlePriceCapAdapter
  uint64 public discountRatePerYear;

  /// @inheritdoc ICLSynchronicityPriceAdapter
  string public description;

  constructor(PendlePriceCapAdapterParams memory params) {
    if (
      params.assetToUsdAggregator == address(0) ||
      params.pendlePrincipalToken == address(0) ||
      params.aclManager == address(0)
    ) {
      revert ZeroAddress();
    }

    if (params.maxDiscountRatePerYear == 0) {
      revert ZeroMaxDiscount();
    }

    ACL_MANAGER = IACLManager(params.aclManager);

    ASSET_TO_USD_AGGREGATOR = IChainlinkAggregator(params.assetToUsdAggregator);
    DECIMALS = ASSET_TO_USD_AGGREGATOR.decimals();

    PENDLE_PRINCIPAL_TOKEN = IPendlePrincipalToken(params.pendlePrincipalToken);
    MATURITY = PENDLE_PRINCIPAL_TOKEN.expiry();

    if (MATURITY <= block.timestamp) {
      revert MaturityHasAlreadyPassed();
    }

    MAX_DISCOUNT_RATE_PER_YEAR = params.maxDiscountRatePerYear;

    description = params.description;

    _setDiscountRatePerYear(params.discountRatePerYear);
  }

  /// @inheritdoc IPendlePriceCapAdapter
  function setDiscountRatePerYear(uint64 discountRatePerYear_) external {
    if (!ACL_MANAGER.isRiskAdmin(msg.sender) && !ACL_MANAGER.isPoolAdmin(msg.sender)) {
      revert CallerIsNotRiskOrPoolAdmin();
    }

    _setDiscountRatePerYear(discountRatePerYear_);
  }

  /// @inheritdoc ICLSynchronicityPriceAdapter
  function latestAnswer() external view returns (int256) {
    int256 currentAssetPrice = ASSET_TO_USD_AGGREGATOR.latestAnswer();
    if (currentAssetPrice <= 0) {
      return 0;
    }

    uint256 price = (uint256(currentAssetPrice) * (PERCENTAGE_FACTOR - getCurrentDiscount())) /
      PERCENTAGE_FACTOR;

    return int256(price);
  }

  /// @inheritdoc ICLSynchronicityPriceAdapter
  function decimals() external view returns (uint8) {
    return DECIMALS;
  }

  /// @inheritdoc IPendlePriceCapAdapter
  function getCurrentDiscount() public view returns (uint256) {
    uint256 timeToMaturity = (MATURITY > block.timestamp) ? MATURITY - block.timestamp : 0;

    return (timeToMaturity * discountRatePerYear) / SECONDS_PER_YEAR;
  }

  function _setDiscountRatePerYear(uint64 discountRatePerYear_) internal {
    uint64 oldMaxDiscountPerYear = discountRatePerYear;

    if (discountRatePerYear_ == 0 || discountRatePerYear_ > MAX_DISCOUNT_RATE_PER_YEAR) {
      revert InvalidNewDiscountRatePerYear();
    }

    if (
      ((MATURITY - block.timestamp) * discountRatePerYear_) / SECONDS_PER_YEAR >= PERCENTAGE_FACTOR
    ) {
      revert DiscountExceeds100Percent();
    }

    discountRatePerYear = discountRatePerYear_;

    emit DiscountRatePerYearUpdated(oldMaxDiscountPerYear, discountRatePerYear_);
  }
}
