// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

import {IHub} from 'src/hub/interfaces/IHub.sol';

/// @title IHubConfigurator
/// @author Aave Labs
/// @notice Interface for HubConfigurator.
interface IHubConfigurator {
  /// @notice Thrown when an address parameter is the zero address.
  error InvalidAddress();

  /// @notice Thrown when the list of assets and spoke configs are not the same length in `addSpokeToAssets`.
  error MismatchedConfigs();

  /// @notice Adds a new asset to a specified Hub.
  /// @dev Retrieves the decimals of the underlying asset from its ERC20 contract.
  /// @dev The fee receiver is automatically added as a Spoke with maximum caps.
  /// @param hub The address of the Hub.
  /// @param underlying The address of the underlying asset.
  /// @param feeReceiver The address of the fee receiver Spoke.
  /// @param liquidityFee The liquidity fee of the asset, expressed in BPS.
  /// @param irStrategy The address of the interest rate strategy contract.
  /// @param irData The interest rate data to apply to the given asset, encoded in bytes.
  /// @return The unique identifier of the added asset.
  function addAsset(
    address hub,
    address underlying,
    address feeReceiver,
    uint256 liquidityFee,
    address irStrategy,
    bytes calldata irData
  ) external returns (uint256);

  /// @notice Adds a new asset to a specified Hub with explicit decimals.
  /// @dev The fee receiver is automatically added as a Spoke with maximum caps.
  /// @param hub The address of the Hub.
  /// @param underlying The address of the underlying asset.
  /// @param decimals The number of decimals of the asset.
  /// @param feeReceiver The address of the fee receiver Spoke.
  /// @param liquidityFee The liquidity fee of the asset, expressed in BPS.
  /// @param irStrategy The address of the interest rate strategy contract.
  /// @param irData The interest rate data to apply to the given asset, encoded in bytes.
  /// @return The unique identifier of the added asset.
  function addAssetWithDecimals(
    address hub,
    address underlying,
    uint8 decimals,
    address feeReceiver,
    uint256 liquidityFee,
    address irStrategy,
    bytes calldata irData
  ) external returns (uint256);

  /// @notice Updates the liquidity fee of an asset on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param liquidityFee The new liquidity fee.
  function updateLiquidityFee(address hub, uint256 assetId, uint256 liquidityFee) external;

  /// @notice Updates the fee receiver of an asset on a specified hub.
  /// @dev The fee receiver cannot be zero.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param feeReceiver The new fee receiver.
  function updateFeeReceiver(address hub, uint256 assetId, address feeReceiver) external;

  /// @notice Updates the liquidity fee and fee receiver of an asset on a specified Hub.
  /// @dev The fee receiver cannot be zero.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param liquidityFee The new liquidity fee.
  /// @param feeReceiver The new fee receiver.
  function updateFeeConfig(
    address hub,
    uint256 assetId,
    uint256 liquidityFee,
    address feeReceiver
  ) external;

  /// @notice Updates the interest rate strategy of an asset on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param irStrategy The new interest rate strategy.
  /// @param irData The interest rate data to apply to the given asset, encoded in bytes.
  function updateInterestRateStrategy(
    address hub,
    uint256 assetId,
    address irStrategy,
    bytes calldata irData
  ) external;

  /// @notice Updates the reinvestment controller of an asset on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param reinvestmentController The new reinvestment controller.
  function updateReinvestmentController(
    address hub,
    uint256 assetId,
    address reinvestmentController
  ) external;

  /// @notice Resets all Spokes' add and draw caps to zero for an asset on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  function resetAssetCaps(address hub, uint256 assetId) external;

  /// @notice Deactivates an asset on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  function deactivateAsset(address hub, uint256 assetId) external;

  /// @notice Halts an asset on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  function haltAsset(address hub, uint256 assetId) external;

  /// @notice Registers the Spoke for the specified asset on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param spoke The address of the Spoke.
  /// @param assetId The identifier of the asset to register the Spoke for.
  /// @param config The Spoke configuration to register.
  function addSpoke(
    address hub,
    address spoke,
    uint256 assetId,
    IHub.SpokeConfig calldata config
  ) external;

  /// @notice Registers the same Spoke for multiple assets on a specified Hub, each with their own configuration.
  /// @dev The i-th asset identifier in `assetIds` corresponds to the i-th configuration in `configs`.
  /// @param hub The address of the Hub.
  /// @param spoke The address of the Spoke.
  /// @param assetIds The list of asset identifiers to register the Spoke for.
  /// @param configs The list of Spoke configurations to register.
  function addSpokeToAssets(
    address hub,
    address spoke,
    uint256[] calldata assetIds,
    IHub.SpokeConfig[] calldata configs
  ) external;

  /// @notice Updates the active flag of an asset's Spoke on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param active The new active flag.
  function updateSpokeActive(address hub, uint256 assetId, address spoke, bool active) external;

  /// @notice Updates the halted flag of an asset's Spoke on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param halted The new halted flag.
  function updateSpokeHalted(address hub, uint256 assetId, address spoke, bool halted) external;

  /// @notice Updates the add cap of an asset's spoke on a specified hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param addCap The new add cap.
  function updateSpokeAddCap(address hub, uint256 assetId, address spoke, uint256 addCap) external;

  /// @notice Updates the draw cap of an asset's Spoke on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param drawCap The new draw cap.
  function updateSpokeDrawCap(
    address hub,
    uint256 assetId,
    address spoke,
    uint256 drawCap
  ) external;

  /// @notice Updates the risk premium threshold of an asset's Spoke on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param riskPremiumThreshold The new risk premium threshold.
  function updateSpokeRiskPremiumThreshold(
    address hub,
    uint256 assetId,
    address spoke,
    uint256 riskPremiumThreshold
  ) external;

  /// @notice Updates the caps of an asset's Spoke on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param addCap The new add cap.
  /// @param drawCap The new draw cap.
  function updateSpokeCaps(
    address hub,
    uint256 assetId,
    address spoke,
    uint256 addCap,
    uint256 drawCap
  ) external;

  /// @notice Deactivates all assets of a Spoke on a specified Hub by setting the active flag to false.
  /// @param hub The address of the Hub.
  /// @param spoke The address of the Spoke.
  function deactivateSpoke(address hub, address spoke) external;

  /// @notice Halts all assets of a Spoke on a specified Hub by setting the halted flag to true.
  /// @param hub The address of the Hub.
  /// @param spoke The address of the Spoke.
  function haltSpoke(address hub, address spoke) external;

  /// @notice Resets draw cap and add cap to zero for a Spoke on a specified Hub.
  /// @param hub The address of the Hub.
  /// @param spoke The address of the Spoke.
  function resetSpokeCaps(address hub, address spoke) external;

  /// @notice Updates the interest rate data for an asset.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset.
  /// @param irData The interest rate data to apply to the given asset, encoded in bytes.
  function updateInterestRateData(address hub, uint256 assetId, bytes calldata irData) external;
}
