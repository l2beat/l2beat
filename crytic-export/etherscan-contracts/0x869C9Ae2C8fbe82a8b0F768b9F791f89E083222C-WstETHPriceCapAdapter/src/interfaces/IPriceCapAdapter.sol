// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import {IACLManager} from 'aave-address-book/AaveV3.sol';
import {ICLSynchronicityPriceAdapter} from '../../src/interfaces/ICLSynchronicityPriceAdapter.sol';
import {IChainlinkAggregator} from '../../src/interfaces/IChainlinkAggregator.sol';

interface IPriceCapAdapter is ICLSynchronicityPriceAdapter {
  /**
   * @dev Emitted when the cap parameters are updated
   * @param snapshotRatio the ratio at the time of snapshot
   * @param snapshotTimestamp the timestamp at the time of snapshot
   * @param maxRatioGrowthPerSecond max ratio growth per second
   * @param maxYearlyRatioGrowthPercent max yearly ratio growth percent
   **/
  event CapParametersUpdated(
    uint256 snapshotRatio,
    uint256 snapshotTimestamp,
    uint256 maxRatioGrowthPerSecond,
    uint16 maxYearlyRatioGrowthPercent
  );

  /**
   * @notice Parameters to create adapter
   * @param capAdapterParams parameters to create adapter
   */
  struct CapAdapterBaseParams {
    IACLManager aclManager;
    address baseAggregatorAddress;
    address ratioProviderAddress;
    string pairDescription;
    uint8 ratioDecimals;
    uint48 minimumSnapshotDelay;
    PriceCapUpdateParams priceCapParams;
  }

  /**
   * @notice Parameters to create CL cap adapter
   * @param clCapAdapterParams parameters to create CL cap adapter
   */
  struct CapAdapterParams {
    IACLManager aclManager;
    address baseAggregatorAddress;
    address ratioProviderAddress;
    string pairDescription;
    uint48 minimumSnapshotDelay;
    PriceCapUpdateParams priceCapParams;
  }

  /**
   * @notice Parameters to update price cap
   * @param priceCapParams parameters to set price cap
   */
  struct PriceCapUpdateParams {
    uint104 snapshotRatio;
    uint48 snapshotTimestamp;
    uint16 maxYearlyRatioGrowthPercent;
  }

  /**
   * @notice Updates price cap parameters
   * @param priceCapParams parameters to set price cap
   */
  function setCapParameters(PriceCapUpdateParams memory priceCapParams) external;

  /**
   * @notice Maximum percentage factor (100.00%)
   */
  function PERCENTAGE_FACTOR() external view returns (uint256);

  /**
   * @notice Scaling factor for internal calculations
   */
  function SCALING_FACTOR() external view returns (uint256);

  /**
   * @notice Number of seconds per year (365 days)
   */
  function SECONDS_PER_YEAR() external view returns (uint256);

  /**
   * @notice Price feed for (BASE_ASSET / USD) pair
   */
  function BASE_TO_USD_AGGREGATOR() external view returns (IChainlinkAggregator);

  /**
   * @notice Ratio feed for (LST_ASSET / BASE_ASSET) pair
   */
  function RATIO_PROVIDER() external view returns (address);

  /**
   * @notice ACL manager contract
   */
  function ACL_MANAGER() external view returns (IACLManager);

  /**
   * @notice Number of decimals in the output of this price adapter
   */
  function DECIMALS() external view returns (uint8);

  /**
   * @notice Number of decimals for (lst asset / underlying asset) ratio
   */
  function RATIO_DECIMALS() external view returns (uint8);

  /**
   * @notice Minimum time (in seconds) that should have passed from the snapshot timestamp to the current block.timestamp
   */
  function MINIMUM_SNAPSHOT_DELAY() external view returns (uint48);

  /**
   * @notice Maximum time (in seconds) that could have passed from the snapshot timestamp to the current block.timestamp
   */
  function MAXIMUM_SNAPSHOT_TERM() external view returns (uint48);

  /**
   * @notice Returns the current exchange ratio of lst to the underlying(base) asset
   */
  function getRatio() external view returns (int256);

  /**
   * @notice Returns the latest snapshot ratio
   */
  function getSnapshotRatio() external view returns (uint256);

  /**
   * @notice Returns the latest snapshot timestamp
   */
  function getSnapshotTimestamp() external view returns (uint256);

  /**
   * @notice Returns the max ratio growth per second
   * @dev For small values of the initial `snapshotRatio` and `maxYearlyRatioGrowthPercent` it can take a zero value
   * In these cases it is recommended to look at `getMaxRatioGrowthPerSecondScaled()`
   */
  function getMaxRatioGrowthPerSecond() external view returns (uint256);

  /**
   * @notice Returns the max ratio growth per second scaled using `SCALING_FACTOR`
   * @dev When used in calculations, it must be divided by `SCALING_FACTOR`
   */
  function getMaxRatioGrowthPerSecondScaled() external view returns (uint256);

  /**
   * @notice Returns the max yearly ratio growth
   */
  function getMaxYearlyGrowthRatePercent() external view returns (uint256);

  /**
   * @notice Returns if the price is currently capped
   */
  function isCapped() external view returns (bool);

  error ACLManagerIsZeroAddress();
  error WrongRatioDecimals();
  error SnapshotRatioIsZero();
  error InvalidRatioTimestamp(uint48 timestamp);
  error CallerIsNotRiskOrPoolAdmin();
}
