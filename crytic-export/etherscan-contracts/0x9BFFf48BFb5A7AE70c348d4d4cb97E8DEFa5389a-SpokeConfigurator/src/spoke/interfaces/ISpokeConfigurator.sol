// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

import {ISpoke} from 'src/spoke/interfaces/ISpoke.sol';

/// @title ISpokeConfigurator
/// @author Aave Labs
/// @notice Interface for the SpokeConfigurator.
interface ISpokeConfigurator {
  /// @notice Thrown when an address parameter is the zero address.
  error InvalidAddress();

  /// @notice Updates the price source of a reserve.
  /// @dev The price source must implement IPriceFeed.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param priceSource The new price source.
  function updateReservePriceSource(address spoke, uint256 reserveId, address priceSource) external;

  /// @notice Updates the liquidation target health factor of a spoke.
  /// @param spoke The address of the Spoke.
  /// @param targetHealthFactor The new liquidation target health factor.
  function updateLiquidationTargetHealthFactor(address spoke, uint256 targetHealthFactor) external;

  /// @notice Updates the health factor for max liquidation bonus of a spoke.
  /// @param spoke The address of the Spoke.
  /// @param healthFactorForMaxBonus The new health factor for max liquidation bonus.
  function updateHealthFactorForMaxBonus(address spoke, uint256 healthFactorForMaxBonus) external;

  /// @notice Updates the liquidation bonus factor of a spoke.
  /// @param spoke The address of the Spoke.
  /// @param liquidationBonusFactor The new liquidation bonus factor.
  function updateLiquidationBonusFactor(address spoke, uint256 liquidationBonusFactor) external;

  /// @notice Updates the liquidation config of a spoke.
  /// @param spoke The address of the Spoke.
  /// @param liquidationConfig The new liquidation config.
  function updateLiquidationConfig(
    address spoke,
    ISpoke.LiquidationConfig calldata liquidationConfig
  ) external;

  /// @notice Adds a new reserve to a spoke.
  /// @dev The asset corresponding to the reserve must be already listed on the Hub.
  /// @dev The price source must implement IPriceFeed.
  /// @param spoke The address of the Spoke.
  /// @param hub The address of the Hub where the asset corresponding to the reserve is listed.
  /// @param assetId The identifier of the asset.
  /// @param priceSource The address of the price source.
  /// @param config The configuration of the reserve.
  /// @param dynamicConfig The dynamic configuration of the reserve.
  /// @return reserveId The identifier of the reserve.
  function addReserve(
    address spoke,
    address hub,
    uint256 assetId,
    address priceSource,
    ISpoke.ReserveConfig calldata config,
    ISpoke.DynamicReserveConfig calldata dynamicConfig
  ) external returns (uint256);

  /// @notice Updates the paused flag of a reserve.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param paused The new paused flag.
  function updatePaused(address spoke, uint256 reserveId, bool paused) external;

  /// @notice Updates the frozen flag of a reserve.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param frozen The new frozen flag.
  function updateFrozen(address spoke, uint256 reserveId, bool frozen) external;

  /// @notice Updates the borrowable flag of a reserve.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param borrowable The new borrowable flag.
  function updateBorrowable(address spoke, uint256 reserveId, bool borrowable) external;

  /// @notice Updates whether receiving shares on liquidation is enabled.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param receiveSharesEnabled The new receiveSharesEnabled flag.
  function updateReceiveSharesEnabled(
    address spoke,
    uint256 reserveId,
    bool receiveSharesEnabled
  ) external;

  /// @notice Updates the collateral risk of a reserve.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param collateralRisk The new collateral risk.
  function updateCollateralRisk(address spoke, uint256 reserveId, uint256 collateralRisk) external;

  /// @notice Adds a dynamic config to a reserve, identical to the latest one but with the specified collateral factor.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param collateralFactor The new collateral factor.
  /// @return The dynamicConfigKey of the added dynamic configuration.
  function addCollateralFactor(
    address spoke,
    uint256 reserveId,
    uint16 collateralFactor
  ) external returns (uint32);

  /// @notice Updates an existing collateral factor of a reserve at the specified key.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfigKey The key of the dynamic config to update.
  /// @param collateralFactor The new collateral factor.
  function updateCollateralFactor(
    address spoke,
    uint256 reserveId,
    uint32 dynamicConfigKey,
    uint16 collateralFactor
  ) external;

  /// @notice Adds a dynamic config to a reserve, identical to the latest one but with the specified max liquidation bonus.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param maxLiquidationBonus The new max liquidation bonus.
  /// @return The dynamicConfigKey of the added dynamic configuration.
  function addMaxLiquidationBonus(
    address spoke,
    uint256 reserveId,
    uint256 maxLiquidationBonus
  ) external returns (uint32);

  /// @notice Updates an existing liquidation bonus of a reserve at the specified key.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfigKey The key of the dynamic config to update.
  /// @param maxLiquidationBonus The new liquidation bonus.
  function updateMaxLiquidationBonus(
    address spoke,
    uint256 reserveId,
    uint32 dynamicConfigKey,
    uint256 maxLiquidationBonus
  ) external;

  /// @notice Adds a dynamic config to a reserve, identical to the latest one but with the specified liquidation fee.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param liquidationFee The new liquidation fee.
  /// @return The dynamicConfigKey of the added dynamic configuration.
  function addLiquidationFee(
    address spoke,
    uint256 reserveId,
    uint256 liquidationFee
  ) external returns (uint32);

  /// @notice Updates an existing liquidation fee of a reserve at the specified key.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfigKey The key of the dynamic config to update.
  /// @param liquidationFee The new liquidation fee.
  function updateLiquidationFee(
    address spoke,
    uint256 reserveId,
    uint32 dynamicConfigKey,
    uint256 liquidationFee
  ) external;

  /// @notice Adds a dynamic config to a reserve.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfig The new dynamic config.
  /// @return dynamicConfigKey The key of the added dynamic config.
  function addDynamicReserveConfig(
    address spoke,
    uint256 reserveId,
    ISpoke.DynamicReserveConfig calldata dynamicConfig
  ) external returns (uint32);

  /// @notice Updates the dynamic config of a reserve at the specified key.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfigKey The key of the dynamic config to update.
  /// @param dynamicConfig The new dynamic config.
  function updateDynamicReserveConfig(
    address spoke,
    uint256 reserveId,
    uint32 dynamicConfigKey,
    ISpoke.DynamicReserveConfig calldata dynamicConfig
  ) external;

  /// @notice Pauses all reserves of a spoke.
  /// @param spoke The address of the Spoke.
  function pauseAllReserves(address spoke) external;

  /// @notice Freezes all reserves of a spoke.
  /// @param spoke The address of the Spoke.
  function freezeAllReserves(address spoke) external;

  /// @notice Pauses a reserve of a spoke.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  function pauseReserve(address spoke, uint256 reserveId) external;

  /// @notice Freezes a reserve of a spoke.
  /// @param spoke The address of the Spoke.
  /// @param reserveId The identifier of the reserve.
  function freezeReserve(address spoke, uint256 reserveId) external;

  /// @notice Updates the active flag of a spoke's position manager.
  /// @param spoke The address of the Spoke.
  /// @param positionManager The address of the position manager.
  /// @param active The new active flag.
  function updatePositionManager(address spoke, address positionManager, bool active) external;
}
