// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

/// @title IHubBase
/// @author Aave Labs
/// @notice Minimal interface for Hub.
interface IHubBase {
  /// @notice Changes to premium owed accounting.
  /// @dev sharesDelta The change in premium shares.
  /// @dev offsetRayDelta The change in premium offset, expressed in asset units and scaled by RAY.
  /// @dev restoredPremiumRay The restored premium, expressed in asset units and scaled by RAY.
  struct PremiumDelta {
    int256 sharesDelta;
    int256 offsetRayDelta;
    uint256 restoredPremiumRay;
  }

  /// @notice Emitted on the `add` action.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param shares The amount of shares added.
  /// @param amount The amount of assets added.
  event Add(uint256 indexed assetId, address indexed spoke, uint256 shares, uint256 amount);

  /// @notice Emitted on the `remove` action.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param shares The amount of shares removed.
  /// @param amount The amount of assets removed.
  event Remove(uint256 indexed assetId, address indexed spoke, uint256 shares, uint256 amount);

  /// @notice Emitted on the `draw` action.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param drawnShares The amount of drawn shares.
  /// @param drawnAmount The amount of drawn assets.
  event Draw(
    uint256 indexed assetId,
    address indexed spoke,
    uint256 drawnShares,
    uint256 drawnAmount
  );

  /// @notice Emitted on the `restore` action.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param drawnShares The amount of drawn shares.
  /// @param premiumDelta The premium delta data struct.
  /// @param drawnAmount The amount of drawn assets restored.
  /// @param premiumAmount The amount of premium assets restored.
  event Restore(
    uint256 indexed assetId,
    address indexed spoke,
    uint256 drawnShares,
    PremiumDelta premiumDelta,
    uint256 drawnAmount,
    uint256 premiumAmount
  );

  /// @notice Emitted on the `refreshPremium` action.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param premiumDelta The premium delta data struct.
  event RefreshPremium(uint256 indexed assetId, address indexed spoke, PremiumDelta premiumDelta);

  /// @notice Emitted on the `reportDeficit` action.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @param drawnShares The amount of drawn shares reported as deficit.
  /// @param premiumDelta The premium delta data struct.
  /// @param deficitAmountRay The amount of deficit reported, expressed in asset units and scaled by RAY.
  event ReportDeficit(
    uint256 indexed assetId,
    address indexed spoke,
    uint256 drawnShares,
    PremiumDelta premiumDelta,
    uint256 deficitAmountRay
  );

  /// @notice Emitted on the `transferShares` action.
  /// @param assetId The identifier of the asset.
  /// @param sender The address of the sender.
  /// @param receiver The address of the receiver.
  /// @param shares The amount of shares transferred.
  event TransferShares(
    uint256 indexed assetId,
    address indexed sender,
    address indexed receiver,
    uint256 shares
  );

  /// @notice Adds assets on behalf of a user.
  /// @dev Only callable by active spokes.
  /// @dev Underlying assets must be transferred to the Hub before invocation.
  /// @dev Extra untracked underlying liquidity in the Hub can be skimmed into the Hub's liquidity accounting through this action.
  /// @param assetId The identifier of the asset.
  /// @param amount The amount of asset liquidity to add.
  /// @return The amount of shares added.
  function add(uint256 assetId, uint256 amount) external returns (uint256);

  /// @notice Removes assets on behalf of a user.
  /// @dev Only callable by active spokes.
  /// @param assetId The identifier of the asset.
  /// @param amount The amount of asset liquidity to remove.
  /// @param to The address to transfer the assets to.
  /// @return The amount of shares removed.
  function remove(uint256 assetId, uint256 amount, address to) external returns (uint256);

  /// @notice Draws assets on behalf of a user.
  /// @dev Only callable by active spokes.
  /// @param assetId The identifier of the asset.
  /// @param amount The amount of assets to draw.
  /// @param to The address to transfer the underlying assets to.
  /// @return The amount of drawn shares.
  function draw(uint256 assetId, uint256 amount, address to) external returns (uint256);

  /// @notice Restores assets on behalf of a user.
  /// @dev Only callable by active spokes.
  /// @dev Interest is always paid off first from premium, then from drawn.
  /// @dev Underlying assets must be transferred to the Hub before invocation.
  /// @dev Extra untracked underlying liquidity in the Hub can be skimmed into the Hub's liquidity accounting through this action.
  /// @param assetId The identifier of the asset.
  /// @param drawnAmount The drawn amount to restore.
  /// @param premiumDelta The premium delta to apply which signals premium repayment.
  /// @return The amount of drawn shares restored.
  function restore(
    uint256 assetId,
    uint256 drawnAmount,
    PremiumDelta calldata premiumDelta
  ) external returns (uint256);

  /// @notice Reports an owed amount by the caller Spoke as a deficit.
  /// @dev Only callable by active spokes.
  /// @param assetId The identifier of the asset.
  /// @param drawnAmount The drawn amount to report as deficit.
  /// @param premiumDelta The premium delta to apply which signals premium deficit.
  /// @return The amount of drawn shares reported as deficit.
  /// @return The amount of deficit reported, expressed in asset units.
  function reportDeficit(
    uint256 assetId,
    uint256 drawnAmount,
    PremiumDelta calldata premiumDelta
  ) external returns (uint256, uint256);

  /// @notice Refreshes premium accounting.
  /// @dev Only callable by active spokes.
  /// @dev Asset and spoke premium should not decrease.
  /// @param assetId The identifier of the asset.
  /// @param premiumDelta The change in premium.
  function refreshPremium(uint256 assetId, PremiumDelta calldata premiumDelta) external;

  /// @notice Transfers an amount of added shares of the caller Spoke to the fee receiver Spoke.
  /// @dev It can be used to execute one-time payments to the fee receiver Spoke (e.g., liquidation fees).
  /// @dev Only callable by active spokes.
  /// @param assetId The identifier of the asset.
  /// @param shares The amount of shares to pay to feeReceiver.
  function payFeeShares(uint256 assetId, uint256 shares) external;

  /// @notice Converts the specified amount of assets to shares upon an `add` action.
  /// @dev Rounds down to the nearest shares amount.
  /// @dev Defaults to a 1:1 exchange rate.
  /// @param assetId The identifier of the asset.
  /// @param assets The amount of assets to convert to shares amount.
  /// @return The amount of shares converted from assets amount.
  function previewAddByAssets(uint256 assetId, uint256 assets) external view returns (uint256);

  /// @notice Converts the specified shares amount to assets amount added upon an `add` action.
  /// @dev Rounds up to the nearest assets amount.
  /// @dev Defaults to a 1:1 exchange rate.
  /// @param assetId The identifier of the asset.
  /// @param shares The amount of shares to convert to assets amount.
  /// @return The amount of assets converted from shares amount.
  function previewAddByShares(uint256 assetId, uint256 shares) external view returns (uint256);

  /// @notice Converts the specified amount of assets to shares amount removed upon a `remove` action.
  /// @dev Rounds up to the nearest shares amount.
  /// @dev Defaults to a 1:1 exchange rate.
  /// @param assetId The identifier of the asset.
  /// @param assets The amount of assets to convert to shares amount.
  /// @return The amount of shares converted from assets amount.
  function previewRemoveByAssets(uint256 assetId, uint256 assets) external view returns (uint256);

  /// @notice Converts the specified amount of shares to assets amount removed upon a `remove` action.
  /// @dev Rounds down to the nearest assets amount.
  /// @dev Defaults to a 1:1 exchange rate.
  /// @param assetId The identifier of the asset.
  /// @param shares The amount of shares to convert to assets amount.
  /// @return The amount of assets converted from shares amount.
  function previewRemoveByShares(uint256 assetId, uint256 shares) external view returns (uint256);

  /// @notice Converts the specified amount of assets to shares amount drawn upon a `draw` action.
  /// @dev Rounds up to the nearest shares amount.
  /// @param assetId The identifier of the asset.
  /// @param assets The amount of assets to convert to shares amount.
  /// @return The amount of shares converted from assets amount.
  function previewDrawByAssets(uint256 assetId, uint256 assets) external view returns (uint256);

  /// @notice Converts the specified amount of shares to assets amount drawn upon a `draw` action.
  /// @dev Rounds down to the nearest assets amount.
  /// @param assetId The identifier of the asset.
  /// @param shares The amount of shares to convert to assets amount.
  /// @return The amount of assets converted from shares amount.
  function previewDrawByShares(uint256 assetId, uint256 shares) external view returns (uint256);

  /// @notice Converts the specified amount of assets to shares amount restored upon a `restore` action.
  /// @dev Rounds down to the nearest shares amount.
  /// @param assetId The identifier of the asset.
  /// @param assets The amount of assets to convert to shares amount.
  /// @return The amount of shares converted from assets amount.
  function previewRestoreByAssets(uint256 assetId, uint256 assets) external view returns (uint256);

  /// @notice Converts the specified amount of shares to assets amount restored upon a `restore` action.
  /// @dev Rounds up to the nearest assets amount.
  /// @param assetId The identifier of the asset.
  /// @param shares The amount of drawn shares to convert to assets amount.
  /// @return The amount of assets converted from shares amount.
  function previewRestoreByShares(uint256 assetId, uint256 shares) external view returns (uint256);

  /// @notice Returns the asset identifier for the specified underlying asset.
  /// @dev Reverts with `AssetNotListed` if the underlying is not listed.
  /// @param underlying The address of the underlying asset.
  function getAssetId(address underlying) external view returns (uint256);

  /// @notice Returns the underlying address and decimals of the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The underlying address of the asset.
  /// @return The decimals of the asset.
  function getAssetUnderlyingAndDecimals(uint256 assetId) external view returns (address, uint8);

  /// @notice Calculates the current drawn index for the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The current drawn index of the asset.
  function getAssetDrawnIndex(uint256 assetId) external view returns (uint256);

  /// @notice Returns the total amount of the specified asset added to the Hub.
  /// @param assetId The identifier of the asset.
  /// @return The amount of the asset added.
  function getAddedAssets(uint256 assetId) external view returns (uint256);

  /// @notice Returns the total amount of shares of the specified asset added to the Hub.
  /// @param assetId The identifier of the asset.
  /// @return The amount of shares of the asset added.
  function getAddedShares(uint256 assetId) external view returns (uint256);

  /// @notice Returns the amount of owed drawn and premium assets for the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The amount of owed drawn assets.
  /// @return The amount of owed premium assets.
  function getAssetOwed(uint256 assetId) external view returns (uint256, uint256);

  /// @notice Returns the total amount of assets owed to the Hub.
  /// @param assetId The identifier of the asset.
  /// @return The total amount of the assets owed.
  function getAssetTotalOwed(uint256 assetId) external view returns (uint256);

  /// @notice Returns the amount of owed premium with full precision for specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The amount of premium owed, expressed in asset units and scaled by RAY.
  function getAssetPremiumRay(uint256 assetId) external view returns (uint256);

  /// @notice Returns the amount of drawn shares of the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The amount of drawn shares.
  function getAssetDrawnShares(uint256 assetId) external view returns (uint256);

  /// @notice Returns the information regarding premium shares of the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The amount of premium shares owed to the asset.
  /// @return The premium offset of the asset, expressed in asset units and scaled by RAY.
  function getAssetPremiumData(uint256 assetId) external view returns (uint256, int256);

  /// @notice Returns the amount of available liquidity for the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The amount of available liquidity.
  function getAssetLiquidity(uint256 assetId) external view returns (uint256);

  /// @notice Returns the amount of deficit with full precision of the specified asset.
  /// @param assetId The identifier of the asset.
  /// @return The amount of deficit, expressed in asset units and scaled by RAY.
  function getAssetDeficitRay(uint256 assetId) external view returns (uint256);

  /// @notice Returns the total amount of the specified assets added to the Hub by the specified spoke.
  /// @dev If spoke is `asset.feeReceiver`, includes converted `unrealizedFeeShares` in return value.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The amount of added assets.
  function getSpokeAddedAssets(uint256 assetId, address spoke) external view returns (uint256);

  /// @notice Returns the total amount of shares of the specified asset added to the Hub by the specified spoke.
  /// @dev If spoke is `asset.feeReceiver`, includes `unrealizedFeeShares` in return value.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The amount of added shares.
  function getSpokeAddedShares(uint256 assetId, address spoke) external view returns (uint256);

  /// @notice Returns the amount of the specified assets owed to the Hub by the specified spoke.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The amount of owed drawn assets.
  /// @return The amount of owed premium assets.
  function getSpokeOwed(uint256 assetId, address spoke) external view returns (uint256, uint256);

  /// @notice Returns the total amount of the specified asset owed to the Hub by the specified spoke.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The total amount of the asset owed.
  function getSpokeTotalOwed(uint256 assetId, address spoke) external view returns (uint256);

  /// @notice Returns the amount of owed premium with full precision for specified asset and spoke.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The amount of owed premium assets, expressed in asset units and scaled by RAY.
  function getSpokePremiumRay(uint256 assetId, address spoke) external view returns (uint256);

  /// @notice Returns the amount of drawn shares of the specified asset by the specified spoke.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The amount of drawn shares.
  function getSpokeDrawnShares(uint256 assetId, address spoke) external view returns (uint256);

  /// @notice Returns the information regarding premium shares of the specified asset for the specified spoke.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The amount of premium shares.
  /// @return The premium offset, expressed in asset units and scaled by RAY.
  function getSpokePremiumData(
    uint256 assetId,
    address spoke
  ) external view returns (uint256, int256);

  /// @notice Returns the amount of a given spoke's deficit with full precision for the specified asset.
  /// @param assetId The identifier of the asset.
  /// @param spoke The address of the Spoke.
  /// @return The amount of deficit, expressed in asset units and scaled by RAY.
  function getSpokeDeficitRay(uint256 assetId, address spoke) external view returns (uint256);
}
