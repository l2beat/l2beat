// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

import {IAccessManaged} from 'src/dependencies/openzeppelin/IAccessManaged.sol';
import {IHubBase} from 'src/hub/interfaces/IHubBase.sol';

/// @title IHub
/// @author Aave Labs
/// @notice Full interface for the Hub.
interface IHub is IHubBase, IAccessManaged {
  /// @notice Asset position and configuration data.
  /// @dev liquidity The liquidity available to be accessed, expressed in asset units.
  /// @dev realizedFees The amount of fees realized but not yet minted, expressed in asset units.
  /// @dev decimals The number of decimals of the underlying asset.
  /// @dev addedShares The total shares added across all spokes.
  /// @dev swept The outstanding liquidity which has been invested by the reinvestment controller, expressed in asset units.
  /// @dev premiumOffsetRay The total premium offset across all spokes, used to calculate the premium, expressed in asset units and scaled by RAY.
  /// @dev drawnShares The total drawn shares across all spokes.
  /// @dev premiumShares The total premium shares across all spokes.
  /// @dev liquidityFee The protocol fee charged on drawn and premium liquidity growth, expressed in BPS.
  /// @dev drawnIndex The drawn index which monotonically increases according to the drawn rate, expressed in RAY.
  /// @dev drawnRate The rate at which drawn assets grow, expressed in RAY.
  /// @dev lastUpdateTimestamp The timestamp of the last accrual.
  /// @dev underlying The address of the underlying asset.
  /// @dev irStrategy The address of the interest rate strategy.
  /// @dev reinvestmentController The address of the reinvestment controller.
  /// @dev feeReceiver The address of the fee receiver spoke.
  /// @dev deficitRay The amount of outstanding bad debt across all spokes, expressed in asset units and scaled by RAY.
  struct Asset {
    uint120 liquidity;
    uint120 realizedFees;
    uint8 decimals;
    //
    uint120 addedShares;
    uint120 swept;
    //
    int200 premiumOffsetRay;
    //
    uint120 drawnShares;
    uint120 premiumShares;
    uint16 liquidityFee;
    //
    uint120 drawnIndex;
    uint96 drawnRate;
    uint40 lastUpdateTimestamp;
    //
    address underlying;
    //
    address irStrategy;
    //
    address reinvestmentController;
    //
    address feeReceiver;
    //
    uint200 deficitRay;
  }

  /// @notice Asset configuration. Subset of the `Asset` struct.
  struct AssetConfig {
    address feeReceiver;
    uint16 liquidityFee;
    address irStrategy;
    address reinvestmentController;
  }

  /// @notice Spoke position and configuration data.
  /// @dev drawnShares The drawn shares of a spoke for a given asset.
  /// @dev premiumShares The premium shares of a spoke for a given asset.
  /// @dev premiumOffsetRay The premium offset of a spoke for a given asset, used to calculate the premium, expressed in asset units and scaled by RAY.
  /// @dev addedShares The added shares of a spoke for a given asset.
  /// @dev addCap The maximum amount that can be added by a spoke, expressed in whole assets (not scaled by decimals). A value of `MAX_ALLOWED_SPOKE_CAP` indicates no cap.
  /// @dev drawCap The maximum amount that can be drawn by a spoke, expressed in whole assets (not scaled by decimals). A value of `MAX_ALLOWED_SPOKE_CAP` indicates no cap.
  /// @dev riskPremiumThreshold The maximum ratio of premium to drawn shares a spoke can have, expressed in BPS. A value of `MAX_RISK_PREMIUM_THRESHOLD` indicates no threshold.
  /// @dev active True if the Spoke is allowed to perform any action.
  /// @dev halted True if the Spoke is prevented from performing actions that instantly update liquidity.
  /// @dev deficitRay The deficit reported by a spoke for a given asset, expressed in asset units and scaled by RAY.
  struct SpokeData {
    uint120 drawnShares;
    uint120 premiumShares;
    //
    int200 premiumOffsetRay;
    //
    uint120 addedShares;
    uint40 addCap;
    uint40 drawCap;
    uint24 riskPremiumThreshold;
    bool active;
    bool halted;
    //
    uint200 deficitRay;
  }

  /// @notice Spoke configuration data. Subset of the `SpokeData` struct.
  struct SpokeConfig {
    uint40 addCap;
    uint40 drawCap;
    uint24 riskPremiumThreshold;
    bool active;
    bool halted;
  }

  /// @notice Emitted when an asset is added.
  /// @param assetId The identifier of the asset.
  /// @param underlying The address of the underlying asset.
  /// @param decimals The number of decimals of the asset.
  event AddAsset(uint256 indexed assetId, address indexed underlying, uint8 decimals);

  /// @notice Emitted when an asset is updated.
  /// @param assetId The identifier of the asset.
  /// @param drawnIndex The new drawn index of the asset.
  /// @param drawnRate The new drawn rate of the asset.
  /// @param accruedFees The accrued fees of the asset since the last mint.
  event UpdateAsset(
    uint256 indexed assetId,
    uint256 drawnIndex,
    uint256 drawnRate,
    uint256 accruedFees
  );

  /// @notice Emitted when an asset configuration is updated.
  /// @param assetId The identifier of the asset.
  /// @param config The new asset configuration struct.
  event UpdateAssetConfig(uint256 indexed assetId, AssetConfig config);

  /// @notice Emitted when a spoke is added.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  event AddSpoke(uint256 indexed assetId, address indexed spoke);

  /// @notice Emitted when a spoke configuration is updated.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param config The new spoke configuration struct.
  event UpdateSpokeConfig(uint256 indexed assetId, address indexed spoke, SpokeConfig config);

  /// @notice Emitted when fees are minted to the fee receiver spoke.
  /// @param assetId The identifier of the asset.
  /// @param feeReceiver The address of the current fee receiver spoke.
  /// @param shares The amount of shares minted.
  /// @param assets The amount of assets used to mint the shares.
  event MintFeeShares(
    uint256 indexed assetId,
    address indexed feeReceiver,
    uint256 shares,
    uint256 assets
  );

  /// @notice Emitted when liquidity is invested by the reinvestment controller.
  /// @param assetId The identifier of the asset.
  /// @param reinvestmentController The active asset controller.
  /// @param amount The amount invested.
  event Sweep(uint256 indexed assetId, address indexed reinvestmentController, uint256 amount);

  /// @notice Emitted when liquidity is reclaimed (from swept liquidity) by the reinvestment controller.
  /// @param assetId The identifier of the asset.
  /// @param reinvestmentController The active asset controller.
  /// @param amount The amount reclaimed.
  event Reclaim(uint256 indexed assetId, address indexed reinvestmentController, uint256 amount);

  /// @notice Emitted when a deficit is eliminated.
  /// @param assetId The identifier of the asset.
  /// @param callerSpoke The spoke that eliminated the deficit using its added shares.
  /// @param coveredSpoke The spoke for which the deficit was eliminated.
  /// @param shares The amount of shares removed.
  /// @param deficitAmountRay The amount of deficit eliminated, expressed in asset units and scaled by RAY.
  event EliminateDeficit(
    uint256 indexed assetId,
    address indexed callerSpoke,
    address indexed coveredSpoke,
    uint256 shares,
    uint256 deficitAmountRay
  );

  /// @notice Thrown when an underlying asset is already listed.
  error UnderlyingAlreadyListed();

  /// @notice Thrown when an asset is not listed.
  error AssetNotListed();

  /// @notice Thrown when the add cap is exceeded.
  /// @param addCap The current `addCap` of the asset, expressed in whole assets (not scaled by decimals).
  error AddCapExceeded(uint256 addCap);

  /// @notice Thrown when the available liquidity is insufficient.
  /// @param liquidity The current available liquidity.
  error InsufficientLiquidity(uint256 liquidity);

  /// @notice Thrown when the transferred liquidity is insufficient.
  /// @param liquidityNeeded The amount of additional liquidity needed.
  error InsufficientTransferred(uint256 liquidityNeeded);

  /// @notice Thrown when the draw cap is exceeded.
  /// @param drawCap The current `drawCap` of the asset, expressed in whole assets (not scaled by decimals).
  error DrawCapExceeded(uint256 drawCap);

  /// @notice Thrown when a surplus amount of drawn is restored.
  /// @param maxAllowedRestore The maximum allowed drawn amount to restore.
  error SurplusDrawnRestored(uint256 maxAllowedRestore);

  /// @notice Thrown when a surplus amount of premium is restored.
  /// @param maxAllowedRestoreRay The maximum allowed premium amount to restore, expressed in asset units and scaled by RAY.
  error SurplusPremiumRayRestored(uint256 maxAllowedRestoreRay);

  /// @notice Thrown when the premium change is invalid.
  error InvalidPremiumChange();

  /// @notice Thrown when a surplus amount of drawn is reported as deficit.
  /// @param maxAllowedDeficit The maximum allowed drawn to report as deficit.
  error SurplusDrawnDeficitReported(uint256 maxAllowedDeficit);

  /// @notice Thrown when a surplus amount of premium is reported as deficit.
  /// @param maxAllowedDeficitRay The maximum allowed premium to report as deficit, expressed in asset units and scaled by RAY.
  error SurplusPremiumRayDeficitReported(uint256 maxAllowedDeficitRay);

  /// @notice Thrown when a spoke is not active.
  error SpokeNotActive();

  /// @notice Thrown when a spoke is halted.
  error SpokeHalted();

  /// @notice Thrown when a new reinvestment controller is the zero address and the asset has existing swept liquidity.
  error InvalidReinvestmentController();

  /// @notice Thrown when an invalid reinvestment controller attempts to perform a `sweep` action.
  error OnlyReinvestmentController();

  /// @notice Thrown when a spoke being added is already listed.
  error SpokeAlreadyListed();

  /// @notice Thrown when a spoke being updated is not listed.
  error SpokeNotListed();

  /// @notice Thrown when the amount is invalid.
  error InvalidAmount();

  /// @notice Thrown when the shares amount is invalid.
  error InvalidShares();

  /// @notice Thrown when an input address is invalid.
  error InvalidAddress();

  /// @notice Thrown if the liquidity fee is invalid when updating an asset configuration.
  error InvalidLiquidityFee();

  /// @notice Thrown when the asset decimals exceed the maximum allowed decimals.
  error InvalidAssetDecimals();

  /// @notice Thrown if the interest rate strategy or data are invalid when updating an asset configuration.
  /// @dev The `irData` must be empty if the interest rate strategy is not updated.
  error InvalidInterestRateStrategy();

  /// @notice Adds a new asset to the Hub.
  /// @dev The same underlying asset address cannot be added as an asset multiple times.
  /// @dev The fee receiver is added as a new spoke with maximum add cap and zero draw cap.
  /// @param underlying The address of the underlying asset.
  /// @param decimals The number of decimals of `underlying`.
  /// @param feeReceiver The address of the fee receiver spoke.
  /// @param irStrategy The address of the interest rate strategy contract.
  /// @param irData The interest rate data to apply to the given asset encoded in bytes.
  /// @return The unique identifier of the added asset.
  function addAsset(
    address underlying,
    uint8 decimals,
    address feeReceiver,
    address irStrategy,
    bytes calldata irData
  ) external returns (uint256);

  /// @notice Updates the configuration of an asset.
  /// @dev If the fee receiver is updated, adds it as a new spoke with maximum add cap and zero draw cap, and sets old fee receiver caps to zero.
  /// @dev If the fee receiver is updated, accrued fees are minted as shares before the update if their value exceeds one share.
  /// @dev If the interest rate strategy is updated, it is configured with `irData`. Otherwise, `irData` must be empty.
  /// @param assetId The identifier of the asset.
  /// @param config The new configuration for the asset.
  /// @param irData The interest rate data to apply to the given asset, encoded in bytes.
  function updateAssetConfig(
    uint256 assetId,
    AssetConfig calldata config,
    bytes calldata irData
  ) external;

  /// @notice Registers a new spoke for a specific asset in the Hub.
  /// @dev Reverts with `SpokeAlreadyListed` if spoke is already listed.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke to add.
  /// @param params The configuration parameters for the Spoke.
  function addSpoke(uint256 assetId, address spoke, SpokeConfig calldata params) external;

  /// @notice Updates the configuration of a spoke for a specific asset.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke to update.
  /// @param config The new configuration for the Spoke.
  function updateSpokeConfig(uint256 assetId, address spoke, SpokeConfig calldata config) external;

  /// @notice Updates the interest rate strategy for a specified asset.
  /// @param assetId The identifier of the asset.
  /// @param irData The interest rate data to apply to the given asset, encoded in bytes.
  function setInterestRateData(uint256 assetId, bytes calldata irData) external;

  /// @notice Mints shares to the fee receiver from accrued fees.
  /// @dev No op when fees are worth less than one share.
  /// @param assetId The identifier of the asset.
  /// @return The amount of shares minted.
  function mintFeeShares(uint256 assetId) external returns (uint256);

  /// @notice Eliminates deficit by removing added shares of caller spoke.
  /// @dev Only callable by active and authorized spokes.
  /// @param assetId The identifier of the asset.
  /// @param amount The amount of deficit to eliminate.
  /// @param spoke The spoke for which the deficit is eliminated.
  /// @return The amount of added shares removed.
  /// @return The amount of deficit eliminated, expressed in asset units.
  function eliminateDeficit(
    uint256 assetId,
    uint256 amount,
    address spoke
  ) external returns (uint256, uint256);

  /// @notice Allows a spoke to transfer its added shares of an asset to another spoke.
  /// @dev Only callable by spokes.
  /// @param assetId The identifier of the asset.
  /// @param shares The amount of shares to move.
  /// @param toSpoke The address of the recipient spoke.
  function transferShares(uint256 assetId, uint256 shares, address toSpoke) external;

  /// @notice Sweeps an amount of liquidity of the corresponding asset and sends it to the configured reinvestment controller.
  /// @dev The controller handles the actual reinvestment of funds, redistribution of interest, and investment caps.
  /// @param assetId The identifier of the asset.
  /// @param amount The amount to sweep.
  function sweep(uint256 assetId, uint256 amount) external;

  /// @notice Reclaims an amount of liquidity of the corresponding asset from the configured reinvestment controller.
  /// @dev The controller can only reclaim up to swept amount. All accrued interest is distributed offchain.
  /// @dev Underlying assets must be transferred to the Hub before invocation.
  /// @dev Extra untracked underlying liquidity in the Hub can be skimmed into the Hub's liquidity accounting through this action.
  /// @param assetId The identifier of the asset.
  /// @param amount The amount to reclaim.
  function reclaim(uint256 assetId, uint256 amount) external;

  /// @notice Returns whether the underlying is listed as an asset.
  /// @param underlying The address of the underlying asset.
  /// @return True if the underlying asset is listed.
  function isUnderlyingListed(address underlying) external view returns (bool);

  /// @notice Returns the number of listed assets.
  function getAssetCount() external view returns (uint256);

  /// @notice Returns information regarding the specified asset.
  /// @dev `drawnIndex`, `drawnRate` and `lastUpdateTimestamp` can be outdated due to passage of time.
  /// @param assetId The identifier of the asset.
  /// @return The asset struct.
  function getAsset(uint256 assetId) external view returns (Asset memory);

  /// @notice Returns the asset configuration for the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The asset configuration struct.
  function getAssetConfig(uint256 assetId) external view returns (AssetConfig memory);

  /// @notice Returns the accrued fees for the asset, expressed in asset units.
  /// @dev Accrued fees are excluded from total added assets.
  /// @param assetId The identifier of the asset.
  /// @return The amount of accrued fees.
  function getAssetAccruedFees(uint256 assetId) external view returns (uint256);

  /// @notice Returns the amount of liquidity swept by the reinvestment controller for the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The amount of liquidity swept.
  function getAssetSwept(uint256 assetId) external view returns (uint256);

  /// @notice Calculates the current drawn rate for the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The current drawn rate of the asset.
  function getAssetDrawnRate(uint256 assetId) external view returns (uint256);

  /// @notice Returns the number of spokes listed for the specified asset.
  /// @param assetId The identifier of the asset.
  function getSpokeCount(uint256 assetId) external view returns (uint256);

  /// @notice Returns whether the Spoke is listed for the specified asset.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return True if the Spoke is listed.
  function isSpokeListed(uint256 assetId, address spoke) external view returns (bool);

  /// @notice Returns the address of the Spoke for an asset at the given index.
  /// @param assetId The identifier of the asset.
  /// @param index The index of the Spoke.
  /// @return The address of the Spoke.
  function getSpokeAddress(uint256 assetId, uint256 index) external view returns (address);

  /// @notice Returns the Spoke data struct.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The spoke data struct.
  function getSpoke(uint256 assetId, address spoke) external view returns (SpokeData memory);

  /// @notice Returns the Spoke configuration struct.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The spoke configuration struct.
  function getSpokeConfig(
    uint256 assetId,
    address spoke
  ) external view returns (SpokeConfig memory);

  /// @notice Returns the maximum allowed number of decimals for the underlying asset.
  /// @return The maximum number of decimals (inclusive).
  function MAX_ALLOWED_UNDERLYING_DECIMALS() external view returns (uint8);

  /// @notice Returns the minimum allowed number of decimals for the underlying asset.
  /// @return The minimum number of decimals (inclusive).
  function MIN_ALLOWED_UNDERLYING_DECIMALS() external view returns (uint8);

  /// @notice Returns the maximum value for any spoke cap (add or draw).
  /// @dev The value is not inclusive; using the maximum value indicates no cap.
  /// @return The maximum cap value, expressed in asset units.
  function MAX_ALLOWED_SPOKE_CAP() external view returns (uint40);

  /// @notice Returns the maximum value for any spoke risk premium threshold.
  /// @dev The value is not inclusive; using the maximum value indicates no threshold.
  /// @return The maximum risk premium threshold, expressed in BPS.
  function MAX_RISK_PREMIUM_THRESHOLD() external view returns (uint24);
}
