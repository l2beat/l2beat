// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.19;

import {IPriceCapAdapter, ICLSynchronicityPriceAdapter, IACLManager, IChainlinkAggregator} from '../interfaces/IPriceCapAdapter.sol';

/**
 * @title PriceCapAdapterBase
 * @author BGD Labs
 * @notice Price adapter to cap the price of the underlying asset.
 */
abstract contract PriceCapAdapterBase is IPriceCapAdapter {
  /// @inheritdoc IPriceCapAdapter
  uint256 public constant PERCENTAGE_FACTOR = 1e4;

  /// @inheritdoc IPriceCapAdapter
  uint256 public constant SCALING_FACTOR = 1e6;

  /// @inheritdoc IPriceCapAdapter
  uint256 public constant SECONDS_PER_YEAR = 365 days;

  /// @inheritdoc IPriceCapAdapter
  IChainlinkAggregator public immutable BASE_TO_USD_AGGREGATOR;

  /// @inheritdoc IPriceCapAdapter
  IACLManager public immutable ACL_MANAGER;

  /// @inheritdoc IPriceCapAdapter
  address public immutable RATIO_PROVIDER;

  /// @inheritdoc IPriceCapAdapter
  uint8 public immutable DECIMALS;

  /// @inheritdoc IPriceCapAdapter
  uint8 public immutable RATIO_DECIMALS;

  /// @inheritdoc IPriceCapAdapter
  uint48 public immutable MINIMUM_SNAPSHOT_DELAY;

  /// @inheritdoc IPriceCapAdapter
  uint48 public immutable MAXIMUM_SNAPSHOT_TERM = 180 days;

  /**
   * @notice Description of the pair
   */
  string private _description;

  /**
   * @notice Ratio at the time of snapshot
   */
  uint104 private _snapshotRatio;

  /**
   * @notice Timestamp at the time of snapshot
   */
  uint48 private _snapshotTimestamp;

  /**
   * @notice Ratio growth per second
   */
  uint104 private _maxRatioGrowthPerSecondScaled;

  /**
   * @notice Max yearly growth percent
   */
  uint16 private _maxYearlyRatioGrowthPercent;

  /**
   * @param capAdapterBaseParams parameters to create adapter
   */
  constructor(CapAdapterBaseParams memory capAdapterBaseParams) {
    if (address(capAdapterBaseParams.aclManager) == address(0)) {
      revert ACLManagerIsZeroAddress();
    }

    if (capAdapterBaseParams.ratioDecimals < 8 || capAdapterBaseParams.ratioDecimals > 24) {
      revert WrongRatioDecimals();
    }

    ACL_MANAGER = capAdapterBaseParams.aclManager;
    BASE_TO_USD_AGGREGATOR = IChainlinkAggregator(capAdapterBaseParams.baseAggregatorAddress);
    RATIO_PROVIDER = capAdapterBaseParams.ratioProviderAddress;
    DECIMALS = BASE_TO_USD_AGGREGATOR.decimals();
    RATIO_DECIMALS = capAdapterBaseParams.ratioDecimals;
    MINIMUM_SNAPSHOT_DELAY = capAdapterBaseParams.minimumSnapshotDelay;

    _description = capAdapterBaseParams.pairDescription;

    _setCapParameters(capAdapterBaseParams.priceCapParams);
  }

  /// @inheritdoc ICLSynchronicityPriceAdapter
  function description() external view returns (string memory) {
    return _description;
  }

  /// @inheritdoc ICLSynchronicityPriceAdapter
  function decimals() external view returns (uint8) {
    return DECIMALS;
  }

  /// @inheritdoc IPriceCapAdapter
  function getSnapshotRatio() external view returns (uint256) {
    return _snapshotRatio;
  }

  /// @inheritdoc IPriceCapAdapter
  function getSnapshotTimestamp() external view returns (uint256) {
    return _snapshotTimestamp;
  }

  /// @inheritdoc IPriceCapAdapter
  function getMaxYearlyGrowthRatePercent() external view returns (uint256) {
    return _maxYearlyRatioGrowthPercent;
  }

  /// @inheritdoc IPriceCapAdapter
  function getMaxRatioGrowthPerSecond() external view returns (uint256) {
    return _maxRatioGrowthPerSecondScaled / SCALING_FACTOR;
  }

  /// @inheritdoc IPriceCapAdapter
  function getMaxRatioGrowthPerSecondScaled() external view returns (uint256) {
    return _maxRatioGrowthPerSecondScaled;
  }

  /// @inheritdoc IPriceCapAdapter
  function setCapParameters(PriceCapUpdateParams memory priceCapParams) external {
    if (!ACL_MANAGER.isRiskAdmin(msg.sender) && !ACL_MANAGER.isPoolAdmin(msg.sender)) {
      revert CallerIsNotRiskOrPoolAdmin();
    }

    _setCapParameters(priceCapParams);
  }

  /// @inheritdoc ICLSynchronicityPriceAdapter
  function latestAnswer() external view override returns (int256) {
    // get the current lst to underlying ratio
    int256 currentRatio = getRatio();
    // get the base price
    int256 basePrice = BASE_TO_USD_AGGREGATOR.latestAnswer();

    if (basePrice <= 0 || currentRatio <= 0) {
      return 0;
    }

    // calculate the ratio based on snapshot ratio and max growth rate
    int256 maxRatio = _getMaxRatio();

    if (maxRatio < currentRatio) {
      currentRatio = maxRatio;
    }

    // calculate the price of the underlying asset
    int256 price = (basePrice * currentRatio) / int256(10 ** RATIO_DECIMALS);

    return price;
  }

  /**
   * @notice Updates price cap parameters
   * @param priceCapParams parameters to set price cap
   */
  function _setCapParameters(PriceCapUpdateParams memory priceCapParams) internal {
    // if snapshot ratio is 0 then growth will not work as expected
    if (priceCapParams.snapshotRatio == 0) {
      revert SnapshotRatioIsZero();
    }

    // new snapshot timestamp should be greater than stored one,
    // also snapshot timestamp must be older than `MINIMUM_SNAPSHOT_DELAY` but no older than `MAXIMUM_SNAPSHOT_TERM`
    if (
      _snapshotTimestamp >= priceCapParams.snapshotTimestamp ||
      priceCapParams.snapshotTimestamp > block.timestamp - MINIMUM_SNAPSHOT_DELAY ||
      priceCapParams.snapshotTimestamp < block.timestamp - MAXIMUM_SNAPSHOT_TERM
    ) {
      revert InvalidRatioTimestamp(priceCapParams.snapshotTimestamp);
    }

    _snapshotRatio = priceCapParams.snapshotRatio;
    _snapshotTimestamp = priceCapParams.snapshotTimestamp;
    _maxYearlyRatioGrowthPercent = priceCapParams.maxYearlyRatioGrowthPercent;

    // Lowest possible value of `maxRatioGrowthPerSecondScaled` with non-zero `maxYearlyRatioGrowthPercent` is 317 wei
    uint256 maxRatioGrowthPerSecondScaled = (uint256(priceCapParams.snapshotRatio) *
      priceCapParams.maxYearlyRatioGrowthPercent *
      SCALING_FACTOR) /
      PERCENTAGE_FACTOR /
      SECONDS_PER_YEAR;

    // cast to 'uint104' is safe because `maxYearlyRatioGrowthPercent` is uint16 and the formula simplifies to
    // `snapshotRatio * maxYearlyRatioGrowthPercent / 315_360`, so even with snapshotRatio == type(uint104).max and
    // maxYearlyRatioGrowthPercent == type(uint16).max the result remains below type(uint104).max.
    // forge-lint: disable-next-line(unsafe-typecast)
    _maxRatioGrowthPerSecondScaled = uint104(maxRatioGrowthPerSecondScaled);

    emit CapParametersUpdated(
      priceCapParams.snapshotRatio,
      priceCapParams.snapshotTimestamp,
      maxRatioGrowthPerSecondScaled / SCALING_FACTOR,
      priceCapParams.maxYearlyRatioGrowthPercent
    );
  }

  /// @inheritdoc IPriceCapAdapter
  function getRatio() public view virtual returns (int256);

  /// @inheritdoc IPriceCapAdapter
  function isCapped() public view returns (bool) {
    // get the current lst to underlying ratio
    int256 currentRatio = getRatio();

    // calculate the ratio based on snapshot ratio and max growth rate
    int256 maxRatio = _getMaxRatio();

    return currentRatio > maxRatio;
  }

  function _getMaxRatio() internal view returns (int256) {
    uint256 maxRatio = _snapshotRatio +
      (_maxRatioGrowthPerSecondScaled * (block.timestamp - _snapshotTimestamp)) /
      SCALING_FACTOR;
    return
      // cast to 'int256' is safe because the computed `maxRatio` is non-negative and
      // would need an unrealistically large timestamp delta to approach the int256 bound.
      // forge-lint: disable-next-line(unsafe-typecast)
      int256(maxRatio);
  }
}
