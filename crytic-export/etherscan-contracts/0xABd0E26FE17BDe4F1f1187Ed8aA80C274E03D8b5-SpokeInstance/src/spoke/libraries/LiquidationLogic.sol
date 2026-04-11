// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {Math} from 'src/dependencies/openzeppelin/Math.sol';
import {SafeCast} from 'src/dependencies/openzeppelin/SafeCast.sol';
import {SafeERC20, IERC20} from 'src/dependencies/openzeppelin/SafeERC20.sol';
import {MathUtils} from 'src/libraries/math/MathUtils.sol';
import {PercentageMath} from 'src/libraries/math/PercentageMath.sol';
import {WadRayMath} from 'src/libraries/math/WadRayMath.sol';
import {SpokeUtils} from 'src/spoke/libraries/SpokeUtils.sol';
import {PositionStatusMap} from 'src/spoke/libraries/PositionStatusMap.sol';
import {UserPositionUtils} from 'src/spoke/libraries/UserPositionUtils.sol';
import {ReserveFlags, ReserveFlagsMap} from 'src/spoke/libraries/ReserveFlagsMap.sol';
import {IHubBase} from 'src/hub/interfaces/IHubBase.sol';
import {IAaveOracle} from 'src/spoke/interfaces/IAaveOracle.sol';
import {ISpoke} from 'src/spoke/interfaces/ISpoke.sol';

/// @title LiquidationLogic library
/// @author Aave Labs
/// @notice Implements the logic for liquidations.
library LiquidationLogic {
  using SafeCast for *;
  using SafeERC20 for IERC20;
  using MathUtils for *;
  using PercentageMath for uint256;
  using WadRayMath for uint256;
  using SpokeUtils for *;
  using UserPositionUtils for ISpoke.UserPosition;
  using ReserveFlagsMap for ReserveFlags;
  using PositionStatusMap for ISpoke.PositionStatus;

  struct LiquidateUserParams {
    uint256 collateralReserveId;
    uint256 debtReserveId;
    address oracle;
    address user;
    ISpoke.LiquidationConfig liquidationConfig;
    uint256 debtToCover;
    ISpoke.UserAccountData userAccountData;
    address liquidator;
    bool receiveShares;
  }

  struct ExecuteLiquidationParams {
    IHubBase collateralHub;
    uint256 collateralAssetId;
    uint256 collateralAssetDecimals;
    uint256 collateralReserveId;
    ReserveFlags collateralReserveFlags;
    ISpoke.DynamicReserveConfig collateralDynConfig;
    IHubBase debtHub;
    uint256 debtAssetId;
    uint256 debtAssetDecimals;
    address debtUnderlying;
    uint256 debtReserveId;
    ReserveFlags debtReserveFlags;
    ISpoke.LiquidationConfig liquidationConfig;
    address oracle;
    address user;
    uint256 debtToCover;
    uint256 healthFactor;
    uint256 totalDebtValueRay;
    uint256 activeCollateralCount;
    uint256 borrowCount;
    address liquidator;
    bool receiveShares;
  }

  struct LiquidateCollateralParams {
    IHubBase hub;
    uint256 assetId;
    uint256 sharesToLiquidate;
    uint256 sharesToLiquidator;
    address liquidator;
    bool receiveShares;
  }

  struct LiquidateCollateralResult {
    uint256 amountRemoved;
    bool isCollateralPositionEmpty;
  }

  struct LiquidateDebtParams {
    IHubBase hub;
    uint256 assetId;
    address underlying;
    uint256 reserveId;
    uint256 drawnSharesToLiquidate;
    uint256 premiumDebtRayToLiquidate;
    uint256 drawnIndex;
    address liquidator;
  }

  struct LiquidateDebtResult {
    uint256 amountRestored;
    IHubBase.PremiumDelta premiumDelta;
    bool isDebtPositionEmpty;
  }

  struct ValidateLiquidationCallParams {
    address user;
    address liquidator;
    ReserveFlags collateralReserveFlags;
    ReserveFlags debtReserveFlags;
    uint256 suppliedShares;
    uint256 drawnShares;
    uint256 debtToCover;
    uint256 collateralFactor;
    bool isUsingAsCollateral;
    uint256 healthFactor;
    bool receiveShares;
  }

  struct CalculateDebtToTargetHealthFactorParams {
    uint256 totalDebtValueRay;
    uint256 debtAssetUnit;
    uint256 debtAssetPrice;
    uint256 collateralFactor;
    uint256 liquidationBonus;
    uint256 healthFactor;
    uint256 targetHealthFactor;
  }

  struct CalculateDebtToLiquidateParams {
    uint256 drawnShares;
    uint256 premiumDebtRay;
    uint256 drawnIndex;
    uint256 totalDebtValueRay;
    uint256 debtAssetDecimals;
    uint256 debtAssetUnit;
    uint256 debtAssetPrice;
    uint256 debtToCover;
    uint256 collateralFactor;
    uint256 liquidationBonus;
    uint256 healthFactor;
    uint256 targetHealthFactor;
  }

  struct CalculateCollateralToLiquidateParams {
    IHubBase collateralReserveHub;
    uint256 collateralReserveAssetId;
    uint256 collateralAssetUnit;
    uint256 collateralAssetPrice;
    uint256 drawnSharesToLiquidate;
    uint256 premiumDebtRayToLiquidate;
    uint256 drawnIndex;
    uint256 debtAssetUnit;
    uint256 debtAssetPrice;
    uint256 liquidationBonus;
  }

  struct CalculateLiquidationAmountsParams {
    IHubBase collateralReserveHub;
    uint256 collateralReserveAssetId;
    uint256 suppliedShares;
    uint256 collateralAssetDecimals;
    uint256 collateralAssetPrice;
    uint256 drawnShares;
    uint256 premiumDebtRay;
    uint256 drawnIndex;
    uint256 totalDebtValueRay;
    uint256 debtAssetDecimals;
    uint256 debtAssetPrice;
    uint256 debtToCover;
    uint256 collateralFactor;
    uint256 healthFactorForMaxBonus;
    uint256 liquidationBonusFactor;
    uint256 maxLiquidationBonus;
    uint256 targetHealthFactor;
    uint256 healthFactor;
    uint256 liquidationFee;
  }

  struct LiquidationAmounts {
    uint256 collateralSharesToLiquidate;
    uint256 collateralSharesToLiquidator;
    uint256 drawnSharesToLiquidate;
    uint256 premiumDebtRayToLiquidate;
  }

  /// @dev See Spoke.HEALTH_FACTOR_LIQUIDATION_THRESHOLD docs
  uint64 public constant HEALTH_FACTOR_LIQUIDATION_THRESHOLD = 1e18;

  /// @dev See Spoke.DUST_LIQUIDATION_THRESHOLD docs
  uint256 public constant DUST_LIQUIDATION_THRESHOLD = 1000e26;

  /// @notice Liquidates a user position.
  /// @param reserves The mapping of reserves per reserve id.
  /// @param userPositions The mapping of user positions per user per reserve.
  /// @param positionStatus The mapping of position status per user.
  /// @param dynamicConfig The mapping of dynamic config per reserve per dynamic config key.
  /// @param params The liquidate user params.
  /// @return True if the liquidation results in deficit.
  function liquidateUser(
    mapping(uint256 reserveId => ISpoke.Reserve) storage reserves,
    mapping(address user => mapping(uint256 reserveId => ISpoke.UserPosition)) storage userPositions,
    mapping(address user => ISpoke.PositionStatus) storage positionStatus,
    mapping(uint256 reserveId => mapping(uint32 dynamicConfigKey => ISpoke.DynamicReserveConfig)) storage dynamicConfig,
    LiquidateUserParams memory params
  ) external returns (bool) {
    ISpoke.Reserve storage collateralReserve = reserves.get(params.collateralReserveId);
    ISpoke.Reserve storage debtReserve = reserves.get(params.debtReserveId);

    ISpoke.UserPosition storage collateralUserPosition = userPositions[params.user][
      params.collateralReserveId
    ];
    ISpoke.DynamicReserveConfig storage collateralDynConfig = dynamicConfig[
      params.collateralReserveId
    ][collateralUserPosition.dynamicConfigKey];

    ExecuteLiquidationParams memory executeLiquidationParams = ExecuteLiquidationParams({
      collateralHub: collateralReserve.hub,
      collateralAssetId: collateralReserve.assetId,
      collateralAssetDecimals: collateralReserve.decimals,
      collateralReserveId: params.collateralReserveId,
      collateralReserveFlags: collateralReserve.flags,
      collateralDynConfig: collateralDynConfig,
      debtHub: debtReserve.hub,
      debtAssetId: debtReserve.assetId,
      debtAssetDecimals: debtReserve.decimals,
      debtUnderlying: debtReserve.underlying,
      debtReserveId: params.debtReserveId,
      debtReserveFlags: debtReserve.flags,
      liquidationConfig: params.liquidationConfig,
      oracle: params.oracle,
      user: params.user,
      debtToCover: params.debtToCover,
      healthFactor: params.userAccountData.healthFactor,
      totalDebtValueRay: params.userAccountData.totalDebtValueRay,
      activeCollateralCount: params.userAccountData.activeCollateralCount,
      borrowCount: params.userAccountData.borrowCount,
      liquidator: params.liquidator,
      receiveShares: params.receiveShares
    });

    ISpoke.UserPosition storage debtUserPosition = userPositions[params.user][params.debtReserveId];
    ISpoke.UserPosition storage collateralLiquidatorPosition = userPositions[params.liquidator][
      params.collateralReserveId
    ];
    ISpoke.PositionStatus storage userPositionStatus = positionStatus[params.user];

    return
      _executeLiquidation({
        collateralUserPosition: collateralUserPosition,
        debtUserPosition: debtUserPosition,
        collateralLiquidatorPosition: collateralLiquidatorPosition,
        userPositionStatus: userPositionStatus,
        params: executeLiquidationParams
      });
  }

  /// @notice Reports deficits for all debt reserves of the user.
  /// @dev Deficit validation should already have occurred during liquidation.
  /// @dev It clears the user position, setting drawn debt, premium debt and user risk premium to zero.
  /// @param reserves The mapping of reserves per reserve identifier.
  /// @param userPositions The mapping of user positions per reserve per user.
  /// @param positionStatus The mapping of position status per user.
  /// @param reserveCount The number of reserves.
  /// @param user The address of the user.
  function notifyReportDeficit(
    mapping(uint256 reserveId => ISpoke.Reserve) storage reserves,
    mapping(address user => mapping(uint256 reserveId => ISpoke.UserPosition)) storage userPositions,
    mapping(address user => ISpoke.PositionStatus) storage positionStatus,
    uint256 reserveCount,
    address user
  ) external {
    ISpoke.PositionStatus storage userPositionStatus = positionStatus[user];
    userPositionStatus.riskPremium = 0;

    uint256 reserveId = reserveCount;
    while (
      (reserveId = userPositionStatus.nextBorrowing(reserveId)) != PositionStatusMap.NOT_FOUND
    ) {
      ISpoke.UserPosition storage userPosition = userPositions[user][reserveId];
      ISpoke.Reserve storage reserve = reserves[reserveId];
      IHubBase hub = reserve.hub;
      uint256 assetId = reserve.assetId;

      UserPositionUtils.DebtComponents memory debtComponents = userPosition.getDebtComponents(
        hub,
        assetId
      );
      IHubBase.PremiumDelta memory premiumDelta = userPosition.calculatePremiumDelta({
        drawnSharesTaken: debtComponents.drawnShares,
        drawnIndex: debtComponents.drawnIndex,
        riskPremium: 0,
        restoredPremiumRay: debtComponents.premiumDebtRay
      });

      hub.reportDeficit(
        assetId,
        debtComponents.drawnShares.rayMulUp(debtComponents.drawnIndex),
        premiumDelta
      );
      userPosition.applyPremiumDelta(premiumDelta);
      userPosition.drawnShares -= debtComponents.drawnShares.toUint120();
      userPositionStatus.setBorrowing(reserveId, false);

      emit ISpoke.ReportDeficit(reserveId, user, debtComponents.drawnShares, premiumDelta);
    }

    emit ISpoke.UpdateUserRiskPremium(user, 0);
  }

  /// @notice Calculates the liquidation bonus at a given health factor.
  /// @dev Liquidation Bonus is expressed as a BPS value greater than `PercentageMath.PERCENTAGE_FACTOR`.
  /// @param healthFactorForMaxBonus The health factor for max bonus, expressed in WAD.
  /// @param liquidationBonusFactor The liquidation bonus factor, expressed in BPS.
  /// @param healthFactor The health factor, expressed in WAD.
  /// @param maxLiquidationBonus The max liquidation bonus, expressed in BPS.
  /// @return The liquidation bonus, expressed in BPS.
  function calculateLiquidationBonus(
    uint256 healthFactorForMaxBonus,
    uint256 liquidationBonusFactor,
    uint256 healthFactor,
    uint256 maxLiquidationBonus
  ) public pure returns (uint256) {
    if (healthFactor <= healthFactorForMaxBonus) {
      return maxLiquidationBonus;
    }

    uint256 minLiquidationBonus = (maxLiquidationBonus - PercentageMath.PERCENTAGE_FACTOR)
      .percentMulDown(liquidationBonusFactor) + PercentageMath.PERCENTAGE_FACTOR;

    // linear interpolation between min and max
    // denominator cannot be zero as healthFactorForMaxBonus is always < HEALTH_FACTOR_LIQUIDATION_THRESHOLD
    return
      minLiquidationBonus +
      (maxLiquidationBonus - minLiquidationBonus).mulDivDown(
        HEALTH_FACTOR_LIQUIDATION_THRESHOLD - healthFactor,
        HEALTH_FACTOR_LIQUIDATION_THRESHOLD - healthFactorForMaxBonus
      );
  }

  /// @dev Executes the liquidation.
  /// @param collateralUserPosition User's collateral position.
  /// @param debtUserPosition User's debt position.
  /// @param collateralLiquidatorPosition Liquidator's collateral position.
  /// @param userPositionStatus User's position status.
  /// @param params The execute liquidation params.
  /// @return True if the liquidation results in deficit.
  function _executeLiquidation(
    ISpoke.UserPosition storage collateralUserPosition,
    ISpoke.UserPosition storage debtUserPosition,
    ISpoke.UserPosition storage collateralLiquidatorPosition,
    ISpoke.PositionStatus storage userPositionStatus,
    ExecuteLiquidationParams memory params
  ) internal returns (bool) {
    uint256 suppliedShares = collateralUserPosition.suppliedShares;
    UserPositionUtils.DebtComponents memory debtComponents = debtUserPosition.getDebtComponents(
      params.debtHub,
      params.debtAssetId
    );

    _validateLiquidationCall(
      ValidateLiquidationCallParams({
        user: params.user,
        liquidator: params.liquidator,
        collateralReserveFlags: params.collateralReserveFlags,
        debtReserveFlags: params.debtReserveFlags,
        suppliedShares: suppliedShares,
        drawnShares: debtComponents.drawnShares,
        debtToCover: params.debtToCover,
        collateralFactor: params.collateralDynConfig.collateralFactor,
        isUsingAsCollateral: userPositionStatus.isUsingAsCollateral(params.collateralReserveId),
        healthFactor: params.healthFactor,
        receiveShares: params.receiveShares
      })
    );

    LiquidationAmounts memory liquidationAmounts = _calculateLiquidationAmounts(
      CalculateLiquidationAmountsParams({
        collateralReserveHub: params.collateralHub,
        collateralReserveAssetId: params.collateralAssetId,
        suppliedShares: suppliedShares,
        collateralAssetDecimals: params.collateralAssetDecimals,
        collateralAssetPrice: IAaveOracle(params.oracle).getReservePrice(
          params.collateralReserveId
        ),
        drawnShares: debtComponents.drawnShares,
        premiumDebtRay: debtComponents.premiumDebtRay,
        drawnIndex: debtComponents.drawnIndex,
        totalDebtValueRay: params.totalDebtValueRay,
        debtAssetDecimals: params.debtAssetDecimals,
        debtAssetPrice: IAaveOracle(params.oracle).getReservePrice(params.debtReserveId),
        debtToCover: params.debtToCover,
        collateralFactor: params.collateralDynConfig.collateralFactor,
        healthFactorForMaxBonus: params.liquidationConfig.healthFactorForMaxBonus,
        liquidationBonusFactor: params.liquidationConfig.liquidationBonusFactor,
        maxLiquidationBonus: params.collateralDynConfig.maxLiquidationBonus,
        targetHealthFactor: params.liquidationConfig.targetHealthFactor,
        healthFactor: params.healthFactor,
        liquidationFee: params.collateralDynConfig.liquidationFee
      })
    );

    LiquidateCollateralResult memory liquidateCollateralResult = _liquidateCollateral(
      collateralUserPosition,
      collateralLiquidatorPosition,
      LiquidateCollateralParams({
        hub: params.collateralHub,
        assetId: params.collateralAssetId,
        sharesToLiquidate: liquidationAmounts.collateralSharesToLiquidate,
        sharesToLiquidator: liquidationAmounts.collateralSharesToLiquidator,
        liquidator: params.liquidator,
        receiveShares: params.receiveShares
      })
    );

    LiquidateDebtResult memory liquidateDebtResult = _liquidateDebt(
      debtUserPosition,
      userPositionStatus,
      LiquidateDebtParams({
        hub: params.debtHub,
        assetId: params.debtAssetId,
        underlying: params.debtUnderlying,
        reserveId: params.debtReserveId,
        drawnSharesToLiquidate: liquidationAmounts.drawnSharesToLiquidate,
        premiumDebtRayToLiquidate: liquidationAmounts.premiumDebtRayToLiquidate,
        drawnIndex: debtComponents.drawnIndex,
        liquidator: params.liquidator
      })
    );

    emit ISpoke.LiquidationCall({
      collateralReserveId: params.collateralReserveId,
      debtReserveId: params.debtReserveId,
      user: params.user,
      liquidator: params.liquidator,
      receiveShares: params.receiveShares,
      debtAmountRestored: liquidateDebtResult.amountRestored,
      drawnSharesLiquidated: liquidationAmounts.drawnSharesToLiquidate,
      premiumDelta: liquidateDebtResult.premiumDelta,
      collateralAmountRemoved: liquidateCollateralResult.amountRemoved,
      collateralSharesLiquidated: liquidationAmounts.collateralSharesToLiquidate,
      collateralSharesToLiquidator: liquidationAmounts.collateralSharesToLiquidator
    });

    return
      _evaluateDeficit({
        isCollateralPositionEmpty: liquidateCollateralResult.isCollateralPositionEmpty,
        isDebtPositionEmpty: liquidateDebtResult.isDebtPositionEmpty,
        activeCollateralCount: params.activeCollateralCount,
        borrowCount: params.borrowCount
      });
  }

  /// @dev Invoked by `liquidateUser` method.
  /// @return The liquidate collateral result.
  function _liquidateCollateral(
    ISpoke.UserPosition storage userPosition,
    ISpoke.UserPosition storage liquidatorPosition,
    LiquidateCollateralParams memory params
  ) internal returns (LiquidateCollateralResult memory) {
    uint120 newUserSuppliedShares = userPosition.suppliedShares -
      params.sharesToLiquidate.toUint120();
    userPosition.suppliedShares = newUserSuppliedShares;

    uint256 amountRemoved = params.hub.previewRemoveByShares(
      params.assetId,
      params.sharesToLiquidate
    );

    if (params.sharesToLiquidator > 0) {
      if (params.receiveShares) {
        liquidatorPosition.suppliedShares += params.sharesToLiquidator.toUint120();
      } else {
        uint256 amountToLiquidator = amountRemoved;
        if (params.sharesToLiquidator < params.sharesToLiquidate) {
          amountToLiquidator = params.hub.previewRemoveByShares(
            params.assetId,
            params.sharesToLiquidator
          );
        }
        params.hub.remove(params.assetId, amountToLiquidator, params.liquidator);
      }
    }

    uint256 feeShares = params.sharesToLiquidate - params.sharesToLiquidator;
    if (feeShares > 0) {
      params.hub.payFeeShares(params.assetId, feeShares);
    }

    return
      LiquidateCollateralResult({
        amountRemoved: amountRemoved,
        isCollateralPositionEmpty: newUserSuppliedShares == 0
      });
  }

  /// @dev Invoked by `liquidateUser` method.
  /// @return The liquidate debt result.
  function _liquidateDebt(
    ISpoke.UserPosition storage userPosition,
    ISpoke.PositionStatus storage positionStatus,
    LiquidateDebtParams memory params
  ) internal returns (LiquidateDebtResult memory) {
    IHubBase.PremiumDelta memory premiumDelta = userPosition.calculatePremiumDelta({
      drawnSharesTaken: params.drawnSharesToLiquidate,
      drawnIndex: params.drawnIndex,
      riskPremium: positionStatus.riskPremium,
      restoredPremiumRay: params.premiumDebtRayToLiquidate
    });

    uint256 drawnAmountToRestore = params.drawnSharesToLiquidate.rayMulUp(params.drawnIndex);
    uint256 amountToRestore = drawnAmountToRestore + params.premiumDebtRayToLiquidate.fromRayUp();
    IERC20(params.underlying).safeTransferFrom(
      params.liquidator,
      address(params.hub),
      amountToRestore
    );
    params.hub.restore(params.assetId, drawnAmountToRestore, premiumDelta);

    userPosition.applyPremiumDelta(premiumDelta);
    userPosition.drawnShares -= params.drawnSharesToLiquidate.toUint120();

    bool isDebtPositionEmpty;
    if (userPosition.drawnShares == 0) {
      positionStatus.setBorrowing(params.reserveId, false);
      isDebtPositionEmpty = true;
    }

    return
      LiquidateDebtResult({
        amountRestored: amountToRestore,
        premiumDelta: premiumDelta,
        isDebtPositionEmpty: isDebtPositionEmpty
      });
  }

  /// @notice Validates the liquidation call.
  /// @param params The validate liquidation call params.
  function _validateLiquidationCall(ValidateLiquidationCallParams memory params) internal pure {
    require(params.user != params.liquidator, ISpoke.SelfLiquidation());
    require(params.debtToCover > 0, ISpoke.InvalidDebtToCover());
    require(
      !params.collateralReserveFlags.paused() && !params.debtReserveFlags.paused(),
      ISpoke.ReservePaused()
    );
    require(params.suppliedShares > 0, ISpoke.ReserveNotSupplied());
    // user has active debt if and only if user has drawn shares (premium debt is always repaid first,
    // and can only be created when drawn shares exist)
    require(params.drawnShares > 0, ISpoke.ReserveNotBorrowed());
    require(
      params.healthFactor < HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
      ISpoke.HealthFactorNotBelowThreshold()
    );
    require(
      params.collateralFactor > 0 && params.isUsingAsCollateral,
      ISpoke.ReserveNotEnabledAsCollateral()
    );
    if (params.receiveShares) {
      require(
        !params.collateralReserveFlags.frozen() &&
          params.collateralReserveFlags.receiveSharesEnabled(),
        ISpoke.CannotReceiveShares()
      );
    }
  }

  /// @notice Calculates the liquidation amounts.
  /// @dev Invoked by `liquidateUser` method.
  function _calculateLiquidationAmounts(
    CalculateLiquidationAmountsParams memory params
  ) internal view returns (LiquidationAmounts memory) {
    uint256 collateralAssetUnit = MathUtils.uncheckedExp(10, params.collateralAssetDecimals);
    uint256 debtAssetUnit = MathUtils.uncheckedExp(10, params.debtAssetDecimals);

    uint256 liquidationBonus = calculateLiquidationBonus({
      healthFactorForMaxBonus: params.healthFactorForMaxBonus,
      liquidationBonusFactor: params.liquidationBonusFactor,
      healthFactor: params.healthFactor,
      maxLiquidationBonus: params.maxLiquidationBonus
    });

    // To prevent accumulation of dust, one of the following conditions is enforced:
    // 1. liquidate all debt
    // 2. liquidate all collateral
    // 3. leave at least `DUST_LIQUIDATION_THRESHOLD` of collateral and debt (in value terms)
    (uint256 drawnSharesToLiquidate, uint256 premiumDebtRayToLiquidate) = _calculateDebtToLiquidate(
      CalculateDebtToLiquidateParams({
        drawnShares: params.drawnShares,
        premiumDebtRay: params.premiumDebtRay,
        drawnIndex: params.drawnIndex,
        totalDebtValueRay: params.totalDebtValueRay,
        debtAssetDecimals: params.debtAssetDecimals,
        debtAssetUnit: debtAssetUnit,
        debtAssetPrice: params.debtAssetPrice,
        debtToCover: params.debtToCover,
        collateralFactor: params.collateralFactor,
        liquidationBonus: liquidationBonus,
        healthFactor: params.healthFactor,
        targetHealthFactor: params.targetHealthFactor
      })
    );

    uint256 collateralSharesToLiquidate = _calculateCollateralToLiquidate(
      CalculateCollateralToLiquidateParams({
        collateralReserveHub: params.collateralReserveHub,
        collateralReserveAssetId: params.collateralReserveAssetId,
        collateralAssetUnit: collateralAssetUnit,
        collateralAssetPrice: params.collateralAssetPrice,
        drawnSharesToLiquidate: drawnSharesToLiquidate,
        premiumDebtRayToLiquidate: premiumDebtRayToLiquidate,
        drawnIndex: params.drawnIndex,
        debtAssetUnit: debtAssetUnit,
        debtAssetPrice: params.debtAssetPrice,
        liquidationBonus: liquidationBonus
      })
    );

    bool leavesCollateralDust;
    if (collateralSharesToLiquidate < params.suppliedShares) {
      uint256 collateralRemaining = params.collateralReserveHub.previewRemoveByShares(
        params.collateralReserveAssetId,
        params.suppliedShares.uncheckedSub(collateralSharesToLiquidate)
      );
      leavesCollateralDust =
        collateralRemaining.toValue({
          decimals: params.collateralAssetDecimals,
          price: params.collateralAssetPrice
        }) < DUST_LIQUIDATION_THRESHOLD;
    }

    // debt is fully liquidated if and only if all drawn shares are liquidated
    if (
      collateralSharesToLiquidate > params.suppliedShares ||
      (leavesCollateralDust && drawnSharesToLiquidate < params.drawnShares)
    ) {
      collateralSharesToLiquidate = params.suppliedShares;

      // - `debtRayToLiquidate` is decreased if `collateralSharesToLiquidate > params.suppliedShares` (if so, debt dust could remain).
      // - `debtRayToLiquidate` is increased if `(leavesCollateralDust && drawnSharesToLiquidate < params.drawnShares)`,
      // ensuring collateral reserve is fully liquidated (potentially bypassing the target health factor).
      uint256 debtRayToLiquidate = Math.mulDiv(
        params.collateralReserveHub.previewAddByShares(
          params.collateralReserveAssetId,
          collateralSharesToLiquidate
        ),
        params.collateralAssetPrice *
          debtAssetUnit *
          PercentageMath.PERCENTAGE_FACTOR *
          WadRayMath.RAY,
        params.debtAssetPrice * collateralAssetUnit * liquidationBonus,
        Math.Rounding.Ceil
      );

      if (debtRayToLiquidate <= params.premiumDebtRay) {
        // `premiumDebtRayToLiquidate` may exceed `debtRayToLiquidate` as a result of rounding up to asset units, ensuring full utilization of assets
        premiumDebtRayToLiquidate = debtRayToLiquidate.roundRayUp().min(params.premiumDebtRay);
        drawnSharesToLiquidate = 0;
      } else {
        premiumDebtRayToLiquidate = params.premiumDebtRay;
        drawnSharesToLiquidate = (debtRayToLiquidate - premiumDebtRayToLiquidate).divUp(
          params.drawnIndex
        );

        // `drawnSharesToLiquidate` may exceed `params.drawnShares` due to rounding.
        if (drawnSharesToLiquidate > params.drawnShares) {
          drawnSharesToLiquidate = params.drawnShares;

          // `collateralSharesToLiquidate` may exceed `params.suppliedShares` due to rounding.
          // If this happens, simply cap `collateralSharesToLiquidate` to `params.suppliedShares` since
          // debt to liquidate would be the same (it is already calculated based on `params.suppliedShares`).
          collateralSharesToLiquidate = _calculateCollateralToLiquidate(
            CalculateCollateralToLiquidateParams({
              collateralReserveHub: params.collateralReserveHub,
              collateralReserveAssetId: params.collateralReserveAssetId,
              collateralAssetUnit: collateralAssetUnit,
              collateralAssetPrice: params.collateralAssetPrice,
              drawnSharesToLiquidate: drawnSharesToLiquidate,
              premiumDebtRayToLiquidate: premiumDebtRayToLiquidate,
              drawnIndex: params.drawnIndex,
              debtAssetUnit: debtAssetUnit,
              debtAssetPrice: params.debtAssetPrice,
              liquidationBonus: liquidationBonus
            })
          ).min(params.suppliedShares);
        }
      }
    }

    // revert if the liquidator does not intend to cover the necessary debt to prevent dust from remaining
    require(
      params.debtToCover >=
        drawnSharesToLiquidate.rayMulUp(params.drawnIndex) + premiumDebtRayToLiquidate.fromRayUp(),
      ISpoke.MustNotLeaveDust()
    );

    uint256 collateralSharesToLiquidator = collateralSharesToLiquidate -
      collateralSharesToLiquidate.mulDivUp(
        params.liquidationFee * (liquidationBonus - PercentageMath.PERCENTAGE_FACTOR),
        liquidationBonus * PercentageMath.PERCENTAGE_FACTOR
      );

    return
      LiquidationAmounts({
        collateralSharesToLiquidate: collateralSharesToLiquidate,
        collateralSharesToLiquidator: collateralSharesToLiquidator,
        drawnSharesToLiquidate: drawnSharesToLiquidate,
        premiumDebtRayToLiquidate: premiumDebtRayToLiquidate
      });
  }

  /// @notice Calculates the amount of collateral shares that should be liquidated based on liquidated debt.
  /// @return The amount of collateral shares that should be liquidated.
  function _calculateCollateralToLiquidate(
    CalculateCollateralToLiquidateParams memory params
  ) internal view returns (uint256) {
    uint256 debtRayToLiquidate = params.drawnSharesToLiquidate * params.drawnIndex +
      params.premiumDebtRayToLiquidate;

    uint256 collateralToLiquidate = Math.mulDiv(
      debtRayToLiquidate,
      params.debtAssetPrice * params.collateralAssetUnit * params.liquidationBonus,
      params.debtAssetUnit *
        params.collateralAssetPrice *
        PercentageMath.PERCENTAGE_FACTOR *
        WadRayMath.RAY,
      Math.Rounding.Floor
    );

    uint256 collateralSharesToLiquidate = params.collateralReserveHub.previewAddByAssets(
      params.collateralReserveAssetId,
      collateralToLiquidate
    );

    return collateralSharesToLiquidate;
  }

  /// @notice Calculates the amount of drawn shares and premium debt that should be liquidated.
  /// @dev Returned values do not exceed `params.debtToCover`, except when all debt must be repaid due to remaining dust.
  /// @return The amount of drawn shares to liquidate. Does not exceed `params.drawnShares`.
  /// @return The amount of premium debt to liquidate. Does not exceed `params.premiumDebtRay`.
  function _calculateDebtToLiquidate(
    CalculateDebtToLiquidateParams memory params
  ) internal pure returns (uint256, uint256) {
    uint256 debtRayToTarget = _calculateDebtToTargetHealthFactor(
      CalculateDebtToTargetHealthFactorParams({
        totalDebtValueRay: params.totalDebtValueRay,
        debtAssetUnit: params.debtAssetUnit,
        debtAssetPrice: params.debtAssetPrice,
        collateralFactor: params.collateralFactor,
        liquidationBonus: params.liquidationBonus,
        healthFactor: params.healthFactor,
        targetHealthFactor: params.targetHealthFactor
      })
    );

    // `premiumDebtRayToLiquidate` may exceed `debtRayToTarget` as a result of rounding up to asset units, ensuring full utilization of assets
    uint256 premiumDebtRayToLiquidate = debtRayToTarget.roundRayUp().min(params.premiumDebtRay);
    // strict inequality is mandatory given rounding
    if (params.debtToCover < premiumDebtRayToLiquidate.fromRayUp()) {
      premiumDebtRayToLiquidate = params.debtToCover.toRay();
    }

    uint256 drawnSharesToLiquidate;
    if (
      premiumDebtRayToLiquidate == params.premiumDebtRay &&
      premiumDebtRayToLiquidate < debtRayToTarget
    ) {
      uint256 drawnSharesToTarget = (debtRayToTarget - premiumDebtRayToLiquidate).divUp(
        params.drawnIndex
      );
      uint256 drawnSharesToCover = Math.mulDiv(
        params.debtToCover - premiumDebtRayToLiquidate.fromRayUp(),
        WadRayMath.RAY,
        params.drawnIndex,
        Math.Rounding.Floor
      );

      drawnSharesToLiquidate = drawnSharesToTarget.min(drawnSharesToCover).min(params.drawnShares);
    }

    uint256 debtRayRemaining = (params.drawnShares - drawnSharesToLiquidate) * params.drawnIndex +
      params.premiumDebtRay -
      premiumDebtRayToLiquidate;

    // debt is fully liquidated if and only if all drawn shares are liquidated (premium debt is always liquidated first)
    bool leavesDebtDust = (drawnSharesToLiquidate < params.drawnShares) &&
      debtRayRemaining.toValue({decimals: params.debtAssetDecimals, price: params.debtAssetPrice}) <
        DUST_LIQUIDATION_THRESHOLD.toRay();

    if (leavesDebtDust) {
      // target health factor is bypassed to prevent leaving dust
      drawnSharesToLiquidate = params.drawnShares;
      premiumDebtRayToLiquidate = params.premiumDebtRay;
    }

    return (drawnSharesToLiquidate, premiumDebtRayToLiquidate);
  }

  /// @notice Calculates the amount of debt needed to be liquidated to restore a position to the target health factor.
  /// @return The amount of debt needed to be liquidated to restore user to the target health factor, expressed in units of debt asset and scaled by RAY.
  function _calculateDebtToTargetHealthFactor(
    CalculateDebtToTargetHealthFactorParams memory params
  ) internal pure returns (uint256) {
    // rounding direction has no effect on the result, as there is no precision loss in this calculation.
    uint256 liquidationPenalty = params.liquidationBonus.bpsToWad().percentMulUp(
      params.collateralFactor
    );

    // denominator cannot be zero as `liquidationPenalty` is always < PercentageMath.PERCENTAGE_FACTOR
    // `liquidationBonus.percentMulUp(collateralFactor) < PercentageMath.PERCENTAGE_FACTOR` is enforced in `_validateDynamicReserveConfig`
    // and targetHealthFactor is always >= HEALTH_FACTOR_LIQUIDATION_THRESHOLD
    return
      Math.mulDiv(
        params.totalDebtValueRay,
        params.debtAssetUnit * (params.targetHealthFactor - params.healthFactor),
        (params.targetHealthFactor - liquidationPenalty) * params.debtAssetPrice.toWad(),
        Math.Rounding.Ceil
      );
  }

  /// @notice Returns if the liquidation results in deficit.
  function _evaluateDeficit(
    bool isCollateralPositionEmpty,
    bool isDebtPositionEmpty,
    uint256 activeCollateralCount,
    uint256 borrowCount
  ) internal pure returns (bool) {
    if (!isCollateralPositionEmpty || activeCollateralCount > 1) {
      return false;
    }
    return !isDebtPositionEmpty || borrowCount > 1;
  }
}
