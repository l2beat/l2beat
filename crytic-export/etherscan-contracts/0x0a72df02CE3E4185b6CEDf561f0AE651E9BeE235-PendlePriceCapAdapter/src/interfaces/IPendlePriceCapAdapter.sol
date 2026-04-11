// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import {IACLManager} from 'aave-address-book/AaveV3.sol';

import {IChainlinkAggregator} from '../../src/interfaces/IChainlinkAggregator.sol';
import {ICLSynchronicityPriceAdapter} from '../../src/interfaces/ICLSynchronicityPriceAdapter.sol';

import {IPendlePrincipalToken} from '../interfaces/IPendlePrincipalToken.sol';

interface IPendlePriceCapAdapter is ICLSynchronicityPriceAdapter {
  /**
   * @notice Parameters to create adapter
   * @param assetToUsdAggregator Price feed contract address for (ASSET / USD) pair, can also be CAPO adapter
   * @param pendlePrincipalToken Pendle principal token contract address
   * @param maxDiscountRatePerYear Maximum discount rate per year (in percents)
   * @param discountRatePerYear Discount rate per year to set during construction (should be greater than zero and up to `maxDiscountRatePerYear`)
   * @param aclManager ACL manager contract
   * @param description Description of the adapter
   */
  struct PendlePriceCapAdapterParams {
    address assetToUsdAggregator;
    address pendlePrincipalToken;
    uint64 maxDiscountRatePerYear;
    uint64 discountRatePerYear;
    address aclManager;
    string description;
  }

  /**
   * @notice Event is emitted when `discountRatePerYear` is changed from old value to the new one
   * @param oldDiscountRatePerYear Old `discountRatePerYear` value
   * @param newDiscountRatePerYear New `discountRatePerYear` value
   */
  event DiscountRatePerYearUpdated(uint64 oldDiscountRatePerYear, uint64 newDiscountRatePerYear);

  /// @dev Attempted to set zero address
  error ZeroAddress();

  /// @dev Attempted to set zero `MAX_DISCOUNT_RATE_PER_YEAR`
  error ZeroMaxDiscount();

  /// @dev Attempted to create price adapter for pendle token with already passed maturity
  error MaturityHasAlreadyPassed();

  /// @dev Attempted to change `discountRatePerYear` from unauthorized address
  error CallerIsNotRiskOrPoolAdmin();

  /// @dev Attempted to set new `discountRatePerYear` greater than `MAX_DISCOUNT_RATE_PER_YEAR` or set zero
  error InvalidNewDiscountRatePerYear();

  /// @dev Attempted to set parameters that are valued at a discount of more than 100% for this linear model
  error DiscountExceeds100Percent();

  /**
   * @notice Sets a new value `discountRatePerYear` used for PT tokens pricing
   * @dev Can be called from risk admin or pool admin only
   * @param discountRatePerYear_ New discount rate per year
   */
  function setDiscountRatePerYear(uint64 discountRatePerYear_) external;

  /**
   * @notice Returns the current discount rate set for a given asset (should be greater than zero and less than `MAX_DISCOUNT_RATE_PER_YEAR`)
   * @dev The value may exceed 100%, but only if the period to maturity is less than an year
   * @dev The parameter should be set based on the maximum possible APY value of the underlying asset
   * @return discountRatePerYear The discount rate for the asset pricing
   */
  function discountRatePerYear() external view returns (uint64 discountRatePerYear);

  /**
   * @notice Returns the current discount on PT tokens
   * @dev The discount amount is always inside [0; `PERCENTAGE_FACTOR`) range
   * @return currentDiscount Current discount amount for the asset pricing
   */
  function getCurrentDiscount() external view returns (uint256 currentDiscount);

  /**
   * @notice Price feed for (ASSET / USD) pair
   */
  function ASSET_TO_USD_AGGREGATOR() external view returns (IChainlinkAggregator);

  /**
   * @notice Pendle principal token contract
   */
  function PENDLE_PRINCIPAL_TOKEN() external view returns (IPendlePrincipalToken);

  /**
   * @notice ACL manager contract
   */
  function ACL_MANAGER() external view returns (IACLManager);

  /**
   * @notice Number of decimals in the output of this price adapter
   */
  function DECIMALS() external view returns (uint8);

  /**
   * @notice Maximum percentage factor (100.00%)
   */
  function PERCENTAGE_FACTOR() external pure returns (uint256);

  /**
   * @notice Number of seconds per year (365 days)
   */
  function SECONDS_PER_YEAR() external pure returns (uint256);

  /**
   * @notice Asset maturity timestamp
   */
  function MATURITY() external view returns (uint256);

  /**
   * @notice The maximum implied APY rate that is set for a given asset before maturity occurs
   */
  function MAX_DISCOUNT_RATE_PER_YEAR() external view returns (uint64);
}
