// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

import {IAccessManaged} from 'src/dependencies/openzeppelin/IAccessManaged.sol';
import {IIntentConsumer} from 'src/interfaces/IIntentConsumer.sol';
import {IMulticall} from 'src/interfaces/IMulticall.sol';
import {IHubBase} from 'src/hub/interfaces/IHubBase.sol';
import {IExtSload} from 'src/interfaces/IExtSload.sol';

type ReserveFlags is uint8;

/// @title ISpoke
/// @author Aave Labs
/// @notice Full interface for Spoke.
interface ISpoke is IAccessManaged, IIntentConsumer, IExtSload, IMulticall {
  /// @notice Intent data to set user position managers with EIP712-typed signature.
  /// @param onBehalfOf The address of the user on whose behalf position manager can act.
  /// @param updates The array of position manager updates.
  /// @param nonce The nonce for the signature.
  /// @param deadline The deadline for the signature.
  struct SetUserPositionManagers {
    address onBehalfOf;
    PositionManagerUpdate[] updates;
    uint256 nonce;
    uint256 deadline;
  }

  /// @notice Sub-Intent data to apply position manager update for user.
  /// @param positionManager The address of the position manager.
  /// @param approve True to approve the position manager, false to revoke approval.
  struct PositionManagerUpdate {
    address positionManager;
    bool approve;
  }

  /// @notice Reserve level data.
  /// @dev underlying The address of the underlying asset.
  /// @dev hub The address of the associated Hub.
  /// @dev assetId The identifier of the asset in the Hub.
  /// @dev decimals The number of decimals of the underlying asset.
  /// @dev collateralRisk The risk associated with a collateral asset, expressed in BPS.
  /// @dev flags The packed boolean flags of the reserve (a wrapped uint8).
  /// @dev dynamicConfigKey The key of the last reserve dynamic config.
  struct Reserve {
    address underlying;
    //
    IHubBase hub;
    uint16 assetId;
    uint8 decimals;
    uint24 collateralRisk;
    ReserveFlags flags;
    uint32 dynamicConfigKey;
  }

  /// @notice Reserve configuration. Subset of the `Reserve` struct.
  /// @dev collateralRisk The risk associated with a collateral asset, expressed in BPS.
  /// @dev paused True if all actions are prevented for the reserve.
  /// @dev frozen True if new activity is prevented for the reserve.
  /// @dev borrowable True if the reserve is borrowable.
  /// @dev receiveSharesEnabled True if the liquidator can receive collateral shares during liquidation.
  struct ReserveConfig {
    uint24 collateralRisk;
    bool paused;
    bool frozen;
    bool borrowable;
    bool receiveSharesEnabled;
  }

  /// @notice Dynamic reserve configuration data.
  /// @dev collateralFactor The proportion of a reserve's value eligible to be used as collateral, expressed in BPS.
  /// @dev maxLiquidationBonus The maximum extra amount of collateral given to the liquidator as bonus, expressed in BPS. 100_00 represents 0.00% bonus.
  /// @dev liquidationFee The protocol fee charged on liquidations, taken from the collateral bonus given to the liquidator, expressed in BPS.
  struct DynamicReserveConfig {
    uint16 collateralFactor;
    uint32 maxLiquidationBonus;
    uint16 liquidationFee;
  }

  /// @notice Liquidation configuration data.
  /// @dev targetHealthFactor The ideal health factor to restore a user position during liquidation, expressed in WAD.
  /// @dev healthFactorForMaxBonus The health factor under which liquidation bonus is maximum, expressed in WAD.
  /// @dev liquidationBonusFactor The value multiplied by `maxLiquidationBonus` to compute the minimum liquidation bonus, expressed in BPS.
  struct LiquidationConfig {
    uint128 targetHealthFactor;
    uint64 healthFactorForMaxBonus;
    uint16 liquidationBonusFactor;
  }

  /// @notice User position data per reserve.
  /// @dev drawnShares The drawn shares of the user position.
  /// @dev premiumShares The premium shares of the user position.
  /// @dev premiumOffsetRay The premium offset of the user position, used to calculate the premium, expressed in asset units and scaled by RAY.
  /// @dev suppliedShares The supplied shares of the user position.
  /// @dev dynamicConfigKey The key of the user position dynamic config.
  struct UserPosition {
    uint120 drawnShares;
    uint120 premiumShares;
    //
    int200 premiumOffsetRay;
    //
    uint120 suppliedShares;
    uint32 dynamicConfigKey;
  }

  /// @notice Position manager configuration data.
  /// @dev approval The mapping of position manager user approvals.
  /// @dev active True if the position manager is active.
  struct PositionManagerConfig {
    mapping(address user => bool) approval;
    bool active;
  }

  /// @notice User position status data.
  /// @dev map The map of bitmap buckets for the position status.
  /// @dev riskPremium The risk premium of the user position, expressed in BPS.
  struct PositionStatus {
    mapping(uint256 bucket => uint256) map;
    uint24 riskPremium;
  }

  /// @notice User account data describing a user position and its health.
  /// @dev riskPremium The risk premium of the user position, expressed in BPS.
  /// @dev avgCollateralFactor The weighted average collateral factor of the user position, expressed in WAD.
  /// @dev healthFactor The health factor of the user position, expressed in WAD. 1e18 represents a health factor of 1.00.
  /// @dev totalCollateralValue The total collateral value of the user position, expressed in units of Value.
  /// @dev totalDebtValueRay The total debt value of the user position, expressed in units of Value and scaled by RAY.
  /// @dev activeCollateralCount The number of active collaterals, which includes reserves with `collateralFactor` > 0, `enabledAsCollateral` and `suppliedAmount` > 0.
  /// @dev borrowCount The number of borrowed reserves of the user position.
  struct UserAccountData {
    uint256 riskPremium;
    uint256 avgCollateralFactor;
    uint256 healthFactor;
    uint256 totalCollateralValue;
    uint256 totalDebtValueRay;
    uint256 activeCollateralCount;
    uint256 borrowCount;
  }

  /// @notice Emitted when the immutable variables of the Spoke are set.
  /// @param oracle The address of the oracle.
  /// @param maxUserReservesLimit The max user reserves limit.
  event SetSpokeImmutables(address indexed oracle, uint16 maxUserReservesLimit);

  /// @notice Emitted when a liquidation config is updated.
  /// @param config The new liquidation config.
  event UpdateLiquidationConfig(LiquidationConfig config);

  /// @notice Emitted when a reserve is added.
  /// @param reserveId The identifier of the reserve.
  /// @param assetId The identifier of the asset.
  /// @param hub The address of the Hub where the asset is listed.
  event AddReserve(uint256 indexed reserveId, uint256 indexed assetId, address indexed hub);

  /// @notice Emitted when a reserve configuration is updated.
  /// @param reserveId The identifier of the reserve.
  /// @param config The reserve configuration.
  event UpdateReserveConfig(uint256 indexed reserveId, ReserveConfig config);

  /// @notice Emitted when the price source of a reserve is updated.
  /// @param reserveId The identifier of the reserve.
  /// @param priceSource The address of the new price source.
  event UpdateReservePriceSource(uint256 indexed reserveId, address indexed priceSource);

  /// @notice Emitted when a dynamic reserve config is added.
  /// @dev The config key is the next available key for the reserve, which is now the latest config
  /// key of the reserve.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfigKey The key of the added dynamic config.
  /// @param config The dynamic reserve config.
  event AddDynamicReserveConfig(
    uint256 indexed reserveId,
    uint32 indexed dynamicConfigKey,
    DynamicReserveConfig config
  );

  /// @notice Emitted when a dynamic reserve config is updated.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfigKey The key of the updated dynamic config.
  /// @param config The dynamic reserve config.
  event UpdateDynamicReserveConfig(
    uint256 indexed reserveId,
    uint32 indexed dynamicConfigKey,
    DynamicReserveConfig config
  );

  /// @notice Emitted on updatePositionManager action.
  /// @param positionManager The address of the position manager.
  /// @param active True if position manager has become active.
  event UpdatePositionManager(address indexed positionManager, bool active);

  /// @notice Emitted on the supply action.
  /// @param reserveId The reserve identifier of the underlying asset.
  /// @param caller The transaction initiator, and supplier of the underlying asset.
  /// @param user The owner of the modified position.
  /// @param suppliedShares The amount of supply shares minted.
  /// @param suppliedAmount The amount of underlying asset supplied.
  event Supply(
    uint256 indexed reserveId,
    address indexed caller,
    address indexed user,
    uint256 suppliedShares,
    uint256 suppliedAmount
  );

  /// @notice Emitted on the withdraw action.
  /// @param reserveId The reserve identifier of the underlying asset.
  /// @param caller The transaction initiator, and recipient of the underlying asset being withdrawn.
  /// @param user The owner of the modified position.
  /// @param withdrawnShares The amount of supply shares burned.
  /// @param withdrawnAmount The amount of underlying asset withdrawn.
  event Withdraw(
    uint256 indexed reserveId,
    address indexed caller,
    address indexed user,
    uint256 withdrawnShares,
    uint256 withdrawnAmount
  );

  /// @notice Emitted on the borrow action.
  /// @param reserveId The reserve identifier of the underlying asset.
  /// @param caller The transaction initiator, and recipient of the underlying asset being borrowed.
  /// @param user The owner of the position on which debt is generated.
  /// @param drawnShares The amount of debt shares minted.
  /// @param drawnAmount The amount of underlying asset borrowed.
  event Borrow(
    uint256 indexed reserveId,
    address indexed caller,
    address indexed user,
    uint256 drawnShares,
    uint256 drawnAmount
  );

  /// @notice Emitted on the repay action.
  /// @param reserveId The reserve identifier of the underlying asset.
  /// @param caller The transaction initiator who is repaying the underlying asset.
  /// @param user The owner of the position whose debt is being repaid.
  /// @param drawnShares The amount of drawn shares burned.
  /// @param totalAmountRepaid The amount of drawn and premium underlying assets repaid.
  /// @param premiumDelta A struct representing the changes to premium debt after repayment.
  event Repay(
    uint256 indexed reserveId,
    address indexed caller,
    address indexed user,
    uint256 drawnShares,
    uint256 totalAmountRepaid,
    IHubBase.PremiumDelta premiumDelta
  );

  /// @dev Emitted when a borrower is liquidated.
  /// @param collateralReserveId The identifier of the reserve used as collateral, to receive as a result of the liquidation.
  /// @param debtReserveId The identifier of the reserve to be repaid with the liquidation.
  /// @param user The address of the borrower getting liquidated.
  /// @param liquidator The address of the liquidator.
  /// @param receiveShares True if the liquidator received collateral in supplied shares rather than underlying assets.
  /// @param debtAmountRestored The amount of debt restored, expressed in asset units.
  /// @param drawnSharesLiquidated The amount of drawn shares liquidated.
  /// @param premiumDelta A struct representing the changes to premium debt after liquidation.
  /// @param collateralAmountRemoved The amount of collateral removed, expressed in asset units.
  /// @param collateralSharesLiquidated The total amount of collateral shares liquidated.
  /// @param collateralSharesToLiquidator The amount of collateral shares that the liquidator received.
  event LiquidationCall(
    uint256 indexed collateralReserveId,
    uint256 indexed debtReserveId,
    address indexed user,
    address liquidator,
    bool receiveShares,
    uint256 debtAmountRestored,
    uint256 drawnSharesLiquidated,
    IHubBase.PremiumDelta premiumDelta,
    uint256 collateralAmountRemoved,
    uint256 collateralSharesLiquidated,
    uint256 collateralSharesToLiquidator
  );

  /// @notice Emitted when a reserve deficit is reported to the Hub.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @param drawnShares The amount of drawn shares reported as deficit.
  /// @param premiumDelta The premium delta data struct reported as deficit.
  event ReportDeficit(
    uint256 indexed reserveId,
    address indexed user,
    uint256 drawnShares,
    IHubBase.PremiumDelta premiumDelta
  );

  /// @notice Emitted on setUsingAsCollateral action.
  /// @param reserveId The reserve identifier of the underlying asset.
  /// @param caller The transaction initiator.
  /// @param user The owner of the position being modified.
  /// @param usingAsCollateral Whether the reserve is enabled or disabled as collateral.
  event SetUsingAsCollateral(
    uint256 indexed reserveId,
    address indexed caller,
    address indexed user,
    bool usingAsCollateral
  );

  /// @notice Emitted on updateUserRiskPremium action.
  /// @param user The owner of the position being modified.
  /// @param riskPremium The new risk premium (BPS) value of user.
  event UpdateUserRiskPremium(address indexed user, uint256 riskPremium);

  /// @notice Emitted when a user's dynamic config is refreshed for all reserves to their latest config key.
  /// @param user The address of the user.
  event RefreshAllUserDynamicConfig(address indexed user);

  /// @notice Emitted when a user's dynamic config is refreshed for a single reserve to its latest config key.
  /// @param user The address of the user.
  /// @param reserveId The identifier of the reserve.
  event RefreshSingleUserDynamicConfig(address indexed user, uint256 reserveId);

  /// @notice Emitted on setUserPositionManager or renouncePositionManagerRole action.
  /// @param user The address of the user on whose behalf position manager can act.
  /// @param positionManager The address of the position manager.
  /// @param approve True if position manager approval was granted, false if it was revoked.
  event SetUserPositionManager(address indexed user, address indexed positionManager, bool approve);

  /// @notice Emitted on refreshPremiumDebt action.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @param premiumDelta The change in premium values.
  event RefreshPremiumDebt(
    uint256 indexed reserveId,
    address indexed user,
    IHubBase.PremiumDelta premiumDelta
  );

  /// @notice Thrown when an asset is not listed on the Hub when adding a reserve.
  error AssetNotListed();

  /// @notice Thrown when adding a new reserve if that reserve already exists for a given Hub/assetId pair.
  error ReserveExists();

  /// @notice Thrown when adding a new reserve if an asset id is invalid.
  error InvalidAssetId();

  /// @notice Thrown when adding a new reserve if the asset decimals are invalid.
  error InvalidAssetDecimals();

  /// @notice Thrown when updating a reserve if it is not listed.
  error ReserveNotListed();

  /// @notice Thrown when a reserve is not borrowable during a `borrow` action.
  error ReserveNotBorrowable();

  /// @notice Thrown when a reserve is paused during an attempted action.
  error ReservePaused();

  /// @notice Thrown when a reserve is frozen.
  /// @dev Can only occur during an attempted `supply`, `borrow`, or `setUsingAsCollateral` action.
  error ReserveFrozen();

  /// @notice Thrown when an action causes a user's health factor to fall below the liquidation threshold.
  error HealthFactorBelowThreshold();

  /// @notice Thrown when reserve is not enabled as collateral during liquidation.
  error ReserveNotEnabledAsCollateral();

  /// @notice Thrown when a specified reserve is not supplied by the user during liquidation.
  error ReserveNotSupplied();

  /// @notice Thrown when a specified reserve is not borrowed by the user during liquidation.
  error ReserveNotBorrowed();

  /// @notice Thrown when an unauthorized caller attempts an action.
  error Unauthorized();

  /// @notice Thrown if a config key is uninitialized when updating a dynamic reserve config.
  error DynamicConfigKeyUninitialized();

  /// @notice Thrown for an invalid zero address.
  error InvalidAddress();

  /// @notice Thrown when the oracle decimals are not 8 in the constructor.
  error InvalidOracleDecimals();

  /// @notice Thrown when the maximum user reserves limit is zero in the constructor.
  error InvalidMaxUserReservesLimit();

  /// @notice Thrown when a collateral risk exceeds the maximum allowed.
  error InvalidCollateralRisk();

  /// @notice Thrown if a liquidation config is invalid when it is updated.
  error InvalidLiquidationConfig();

  /// @notice Thrown when a liquidation fee is invalid.
  error InvalidLiquidationFee();

  /// @notice Thrown when a collateral factor and max liquidation bonus are invalid.
  error InvalidCollateralFactorAndMaxLiquidationBonus();

  /// @notice Thrown when trying to set zero collateralFactor on historic dynamic configuration keys.
  error InvalidCollateralFactor();

  /// @notice Thrown when a self-liquidation is attempted.
  error SelfLiquidation();

  /// @notice Thrown during liquidation when a user's health factor is not below the liquidation threshold.
  error HealthFactorNotBelowThreshold();

  /// @notice Thrown when collateral or debt dust remains after a liquidation, and neither reserve is fully liquidated.
  error MustNotLeaveDust();

  /// @notice Thrown when a debt to cover input is zero.
  error InvalidDebtToCover();

  /// @notice Thrown when the liquidator tries to receive shares for a collateral reserve that is frozen or is not enabled to receive shares.
  error CannotReceiveShares();

  /// @notice Thrown when the maximum number of dynamic config keys is reached.
  error MaximumDynamicConfigKeyReached();

  /// @notice Thrown when user attempts to exceed either the maximum allowed collateral or borrowed reserves.
  error MaximumUserReservesExceeded();

  /// @notice Updates the liquidation config.
  /// @param config The new liquidation config.
  function updateLiquidationConfig(LiquidationConfig calldata config) external;

  /// @notice Adds a new reserve to the Spoke.
  /// @dev Allowed even if the Spoke has not yet been added to the Hub.
  /// @dev Allowed even if the `active` flag is `false`.
  /// @dev Allowed even if the Spoke has been added but the `addCap` is zero.
  /// @param hub The address of the Hub where the asset is listed.
  /// @param assetId The identifier of the asset in the Hub.
  /// @param priceSource The address of the price source for the asset.
  /// @param config The initial reserve configuration.
  /// @param dynamicConfig The initial dynamic reserve configuration.
  /// @return The identifier of the newly added reserve.
  function addReserve(
    address hub,
    uint256 assetId,
    address priceSource,
    ReserveConfig calldata config,
    DynamicReserveConfig calldata dynamicConfig
  ) external returns (uint256);

  /// @notice Updates the reserve config for a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @param params The new reserve config.
  function updateReserveConfig(uint256 reserveId, ReserveConfig calldata params) external;

  /// @notice Updates the price source of a reserve.
  /// @param reserveId The identifier of the reserve.
  /// @param priceSource The address of the price source.
  function updateReservePriceSource(uint256 reserveId, address priceSource) external;

  /// @notice Updates the dynamic reserve config for a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev Appends dynamic config to the next available key; reverts if `MAX_ALLOWED_DYNAMIC_CONFIG_KEY` is reached.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfig The new dynamic reserve config.
  /// @return dynamicConfigKey The key of the added dynamic config.
  function addDynamicReserveConfig(
    uint256 reserveId,
    DynamicReserveConfig calldata dynamicConfig
  ) external returns (uint32 dynamicConfigKey);

  /// @notice Updates the dynamic reserve config for a given reserve at the specified key.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev Reverts with `DynamicConfigKeyUninitialized` if the config key has not been initialized yet.
  /// @dev Reverts with `InvalidCollateralFactor` if the collateral factor is 0.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfigKey The key of the config to update.
  /// @param dynamicConfig The new dynamic reserve config.
  function updateDynamicReserveConfig(
    uint256 reserveId,
    uint32 dynamicConfigKey,
    DynamicReserveConfig calldata dynamicConfig
  ) external;

  /// @notice Allows an approved caller (admin) to toggle the active status of position manager.
  /// @param positionManager The address of the position manager.
  /// @param active True if positionManager is to be set as active.
  function updatePositionManager(address positionManager, bool active) external;

  /// @notice Supplies an amount of underlying asset of the specified reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev The Spoke pulls the underlying asset from the caller, so prior token approval is required.
  /// @dev Caller must be `onBehalfOf` or an authorized position manager for `onBehalfOf`.
  /// @param reserveId The reserve identifier.
  /// @param amount The amount of asset to supply.
  /// @param onBehalfOf The owner of the position to add supply shares to.
  /// @return The amount of shares supplied.
  /// @return The amount of assets supplied.
  function supply(
    uint256 reserveId,
    uint256 amount,
    address onBehalfOf
  ) external returns (uint256, uint256);

  /// @notice Withdraws a specified amount of underlying asset from the given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev Providing an amount greater than the maximum withdrawable value signals a full withdrawal.
  /// @dev Caller must be `onBehalfOf` or an authorized position manager for `onBehalfOf`.
  /// @dev Caller receives the underlying asset withdrawn.
  /// @param reserveId The identifier of the reserve.
  /// @param amount The amount of asset to withdraw.
  /// @param onBehalfOf The owner of position to remove supply shares from.
  /// @return The amount of shares withdrawn.
  /// @return The amount of assets withdrawn.
  function withdraw(
    uint256 reserveId,
    uint256 amount,
    address onBehalfOf
  ) external returns (uint256, uint256);

  /// @notice Borrows a specified amount of underlying asset from the given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev It reverts if the user would borrow more than the maximum allowed number of borrowed reserves.
  /// @dev Caller must be `onBehalfOf` or an authorized position manager for `onBehalfOf`.
  /// @dev Caller receives the underlying asset borrowed.
  /// @param reserveId The identifier of the reserve.
  /// @param amount The amount of asset to borrow.
  /// @param onBehalfOf The owner of the position against which debt is generated.
  /// @return The amount of shares borrowed.
  /// @return The amount of assets borrowed.
  function borrow(
    uint256 reserveId,
    uint256 amount,
    address onBehalfOf
  ) external returns (uint256, uint256);

  /// @notice Repays a specified amount of underlying asset to a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev The Spoke pulls the underlying asset from the caller, so prior approval is required.
  /// @dev Caller must be `onBehalfOf` or an authorized position manager for `onBehalfOf`.
  /// @param reserveId The identifier of the reserve.
  /// @param amount The amount of asset to repay.
  /// @param onBehalfOf The owner of the position whose debt is repaid.
  /// @return The amount of shares repaid.
  /// @return The amount of assets repaid.
  function repay(
    uint256 reserveId,
    uint256 amount,
    address onBehalfOf
  ) external returns (uint256, uint256);

  /// @notice Liquidates a user position.
  /// @dev It reverts if the reserves associated with any of the given reserve identifiers are not listed.
  /// @dev The Spoke pulls underlying repaid debt assets from caller (Liquidator), hence it needs prior approval.
  /// @param collateralReserveId The reserveId of the underlying asset used as collateral by the liquidated user.
  /// @param debtReserveId The reserveId of the underlying asset borrowed by the liquidated user, to be repaid by Liquidator.
  /// @param user The address of the user to liquidate.
  /// @param debtToCover The desired amount of debt to cover.
  /// @param receiveShares True to receive collateral in supplied shares, false to receive in underlying assets.
  function liquidationCall(
    uint256 collateralReserveId,
    uint256 debtReserveId,
    address user,
    uint256 debtToCover,
    bool receiveShares
  ) external;

  /// @notice Allows suppliers to enable/disable a specific supplied reserve as collateral.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev It reverts if the user exceeds the maximum allowed collateral reserves when enabling.
  /// @dev Reserves with zero supplied or zero collateral factor count towards the max allowed collateral reserves.
  /// @dev Caller must be `onBehalfOf` or an authorized position manager for `onBehalfOf`.
  /// @param reserveId The reserve identifier of the underlying asset.
  /// @param usingAsCollateral True if the user wants to use the supply as collateral.
  /// @param onBehalfOf The owner of the position being modified.
  function setUsingAsCollateral(
    uint256 reserveId,
    bool usingAsCollateral,
    address onBehalfOf
  ) external;

  /// @notice Allows updating the risk premium on onBehalfOf position.
  /// @dev Caller must be `onBehalfOf`, an authorized position manager for `onBehalfOf`, or admin.
  /// @param onBehalfOf The owner of the position being modified.
  function updateUserRiskPremium(address onBehalfOf) external;

  /// @notice Allows updating the dynamic configuration for all collateral reserves on onBehalfOf position.
  /// @dev Caller must be `onBehalfOf`, an authorized position manager for `onBehalfOf`, or admin.
  /// @param onBehalfOf The owner of the position being modified.
  function updateUserDynamicConfig(address onBehalfOf) external;

  /// @notice Enables a user to grant or revoke approval for a position manager.
  /// @dev Allows approving inactive position managers.
  /// @param positionManager The address of the position manager.
  /// @param approve True to approve the position manager, false to revoke approval.
  function setUserPositionManager(address positionManager, bool approve) external;

  /// @notice Enables a user to grant or revoke approval for an array of position managers using an EIP712-typed intent.
  /// @dev Uses keyed-nonces where for each key's namespace nonce is consumed sequentially.
  /// @dev Allows duplicated updates and the last one is persisted. Allows approving inactive position managers.
  /// @param params The structured setUserPositionManagers parameter.
  /// @param signature The EIP712-compliant signature bytes.
  function setUserPositionManagersWithSig(
    SetUserPositionManagers calldata params,
    bytes calldata signature
  ) external;

  /// @notice Allows position manager (as caller) to renounce their approval given by the user.
  /// @param user The address of the user.
  function renouncePositionManagerRole(address user) external;

  /// @notice Allows consuming a permit signature for the given reserve's underlying asset.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev The Spoke must be configured as the spender.
  /// @param reserveId The identifier of the reserve.
  /// @param onBehalfOf The address of the user on whose behalf the permit is being used.
  /// @param value The amount of the underlying asset to permit.
  /// @param deadline The deadline for the permit.
  /// @param permitV The v parameter of the permit signature.
  /// @param permitR The r parameter of the permit signature.
  /// @param permitS The s parameter of the permit signature.
  function permitReserve(
    uint256 reserveId,
    address onBehalfOf,
    uint256 value,
    uint256 deadline,
    uint8 permitV,
    bytes32 permitR,
    bytes32 permitS
  ) external;

  /// @notice Returns the liquidation config struct.
  function getLiquidationConfig() external view returns (LiquidationConfig memory);

  /// @notice Returns the number of listed reserves on the Spoke.
  /// @dev Count includes reserves that are not currently active.
  function getReserveCount() external view returns (uint256);

  /// @notice Returns the total amount of supplied assets of a given reserve.
  /// @param reserveId The identifier of the reserve.
  /// @return The amount of supplied assets.
  function getReserveSuppliedAssets(uint256 reserveId) external view returns (uint256);

  /// @notice Returns the total amount of supplied shares of a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @return The amount of supplied shares.
  function getReserveSuppliedShares(uint256 reserveId) external view returns (uint256);

  /// @notice Returns the debt of a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev The total debt of the reserve is the sum of drawn debt and premium debt.
  /// @param reserveId The identifier of the reserve.
  /// @return The amount of drawn debt.
  /// @return The amount of premium debt.
  function getReserveDebt(uint256 reserveId) external view returns (uint256, uint256);

  /// @notice Returns the total debt of a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev The total debt of the reserve is the sum of drawn debt and premium debt.
  /// @param reserveId The identifier of the reserve.
  /// @return The total debt amount.
  function getReserveTotalDebt(uint256 reserveId) external view returns (uint256);

  /// @notice Returns the reserve identifier for a given asset in a Hub.
  /// @dev It reverts if no reserve is associated with the given asset identifier.
  /// @param hub The address of the Hub.
  /// @param assetId The identifier of the asset on the Hub.
  /// @return The identifier of the reserve.
  function getReserveId(address hub, uint256 assetId) external view returns (uint256);

  /// @notice Returns the reserve struct data in storage.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @return The reserve struct.
  function getReserve(uint256 reserveId) external view returns (Reserve memory);

  /// @notice Returns the reserve configuration struct data in storage.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @return The reserve configuration struct.
  function getReserveConfig(uint256 reserveId) external view returns (ReserveConfig memory);

  /// @notice Returns the dynamic reserve configuration struct at the specified key.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev Does not revert if `dynamicConfigKey` is unset.
  /// @param reserveId The identifier of the reserve.
  /// @param dynamicConfigKey The key of the dynamic config.
  /// @return The dynamic reserve configuration struct.
  function getDynamicReserveConfig(
    uint256 reserveId,
    uint32 dynamicConfigKey
  ) external view returns (DynamicReserveConfig memory);

  /// @notice Returns two flags indicating whether the reserve is used as collateral and whether it is borrowed by the user.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev Even if enabled as collateral, it will only count towards user position if the collateral factor is greater than 0.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @return True if the reserve is enabled as collateral by the user.
  /// @return True if the reserve is borrowed by the user.
  function getUserReserveStatus(uint256 reserveId, address user) external view returns (bool, bool);

  /// @notice Returns the amount of assets supplied by a specific user for a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @return The amount of assets supplied by the user.
  function getUserSuppliedAssets(uint256 reserveId, address user) external view returns (uint256);

  /// @notice Returns the amount of shares supplied by a specific user for a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @return The amount of shares supplied by the user.
  function getUserSuppliedShares(uint256 reserveId, address user) external view returns (uint256);

  /// @notice Returns the debt of a specific user for a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev The total debt of the user is the sum of drawn debt and premium debt.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @return The amount of drawn debt.
  /// @return The amount of premium debt.
  function getUserDebt(uint256 reserveId, address user) external view returns (uint256, uint256);

  /// @notice Returns the total debt of a specific user for a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @dev The total debt of the user is the sum of drawn debt and premium debt.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @return The total debt amount.
  function getUserTotalDebt(uint256 reserveId, address user) external view returns (uint256);

  /// @notice Returns the full precision premium debt of a specific user for a given reserve.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @return The amount of premium debt, expressed in asset units and scaled by RAY.
  function getUserPremiumDebtRay(uint256 reserveId, address user) external view returns (uint256);

  /// @notice Returns the user position struct in storage.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @return The user position struct.
  function getUserPosition(
    uint256 reserveId,
    address user
  ) external view returns (UserPosition memory);

  /// @notice Returns the most up-to-date user account data information.
  /// @dev Utilizes user's current dynamic configuration of user position.
  /// @param user The address of the user.
  /// @return The user account data struct.
  function getUserAccountData(address user) external view returns (UserAccountData memory);

  /// @notice Returns the risk premium from the user's last position update.
  /// @param user The address of the user.
  /// @return The risk premium of the user from the last position update, expressed in BPS.
  function getUserLastRiskPremium(address user) external view returns (uint256);

  /// @notice Returns the liquidation bonus for a given health factor, based on the user's current dynamic configuration.
  /// @dev It reverts if the reserve associated with the given reserve identifier is not listed.
  /// @param reserveId The identifier of the reserve.
  /// @param user The address of the user.
  /// @param healthFactor The health factor of the user, expressed in WAD.
  /// @return The liquidation bonus for the user, expressed in BPS.
  function getLiquidationBonus(
    uint256 reserveId,
    address user,
    uint256 healthFactor
  ) external view returns (uint256);

  /// @notice Returns whether positionManager is currently activated by governance.
  /// @param positionManager The address of the position manager.
  /// @return True if positionManager is currently active.
  function isPositionManagerActive(address positionManager) external view returns (bool);

  /// @notice Returns whether positionManager is active and approved by user.
  /// @param user The address of the user.
  /// @param positionManager The address of the position manager.
  /// @return True if positionManager is active and approved by user.
  function isPositionManager(address user, address positionManager) external view returns (bool);

  /// @notice Returns the address of the external `LiquidationLogic` library.
  function getLiquidationLogic() external pure returns (address);

  /// @notice Returns the type hash for the SetUserPositionManagers intent.
  /// @return The bytes-encoded EIP-712 struct hash representing the intent.
  function SET_USER_POSITION_MANAGERS_TYPEHASH() external view returns (bytes32);

  /// @notice Returns the address of the AaveOracle contract.
  function ORACLE() external view returns (address);

  /// @notice Returns the maximum allowed number of collateral and borrow reserves per user (each counted separately).
  function MAX_USER_RESERVES_LIMIT() external view returns (uint16);
}
