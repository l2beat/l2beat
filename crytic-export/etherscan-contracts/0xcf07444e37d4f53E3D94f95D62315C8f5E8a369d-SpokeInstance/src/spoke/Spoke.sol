// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {SafeCast} from 'src/dependencies/openzeppelin/SafeCast.sol';
import {SafeERC20, IERC20} from 'src/dependencies/openzeppelin/SafeERC20.sol';
import {Math} from 'src/dependencies/openzeppelin/Math.sol';
import {IERC20Permit} from 'src/dependencies/openzeppelin/IERC20Permit.sol';
import {ReentrancyGuardTransient} from 'src/dependencies/openzeppelin/ReentrancyGuardTransient.sol';
import {Math} from 'src/dependencies/openzeppelin/Math.sol';
import {AccessManagedUpgradeable} from 'src/dependencies/openzeppelin-upgradeable/AccessManagedUpgradeable.sol';
import {MathUtils} from 'src/libraries/math/MathUtils.sol';
import {PercentageMath} from 'src/libraries/math/PercentageMath.sol';
import {WadRayMath} from 'src/libraries/math/WadRayMath.sol';
import {SpokeUtils} from 'src/spoke/libraries/SpokeUtils.sol';
import {EIP712Hash} from 'src/spoke/libraries/EIP712Hash.sol';
import {KeyValueList} from 'src/spoke/libraries/KeyValueList.sol';
import {LiquidationLogic} from 'src/spoke/libraries/LiquidationLogic.sol';
import {PositionStatusMap} from 'src/spoke/libraries/PositionStatusMap.sol';
import {ReserveFlags, ReserveFlagsMap} from 'src/spoke/libraries/ReserveFlagsMap.sol';
import {UserPositionUtils} from 'src/spoke/libraries/UserPositionUtils.sol';
import {IntentConsumer} from 'src/utils/IntentConsumer.sol';
import {Multicall} from 'src/utils/Multicall.sol';
import {ExtSload} from 'src/utils/ExtSload.sol';
import {IAaveOracle} from 'src/spoke/interfaces/IAaveOracle.sol';
import {IHubBase} from 'src/hub/interfaces/IHubBase.sol';
import {ISpoke} from 'src/spoke/interfaces/ISpoke.sol';
import {SpokeStorage} from 'src/spoke/SpokeStorage.sol';

/// @title Spoke
/// @author Aave Labs
/// @notice Handles risk configuration & borrowing strategy for reserves and user positions.
/// @dev Each reserve can be associated with a separate Hub.
abstract contract Spoke is
  ISpoke,
  SpokeStorage,
  AccessManagedUpgradeable,
  IntentConsumer,
  ExtSload,
  Multicall,
  ReentrancyGuardTransient
{
  using SafeCast for *;
  using SafeERC20 for IERC20;
  using MathUtils for *;
  using PercentageMath for *;
  using WadRayMath for *;
  using SpokeUtils for *;
  using EIP712Hash for *;
  using KeyValueList for KeyValueList.List;
  using PositionStatusMap for *;
  using ReserveFlagsMap for ReserveFlags;
  using UserPositionUtils for ISpoke.UserPosition;

  /// @inheritdoc ISpoke
  bytes32 public constant SET_USER_POSITION_MANAGERS_TYPEHASH =
    EIP712Hash.SET_USER_POSITION_MANAGERS_TYPEHASH;

  /// @inheritdoc ISpoke
  uint16 public immutable MAX_USER_RESERVES_LIMIT;

  /// @inheritdoc ISpoke
  address public immutable ORACLE;

  /// @dev The number of decimals used by the oracle.
  uint8 internal constant ORACLE_DECIMALS = SpokeUtils.ORACLE_DECIMALS;

  /// @dev The maximum allowed value for an asset identifier (inclusive).
  uint256 internal constant MAX_ALLOWED_ASSET_ID = type(uint16).max;

  /// @dev The maximum allowed collateral risk value for a reserve, expressed in BPS (e.g. 100_00 is 100.00%).
  uint24 internal constant MAX_ALLOWED_COLLATERAL_RISK = 1000_00;

  /// @dev The maximum allowed value for a dynamic configuration key (inclusive).
  uint256 internal constant MAX_ALLOWED_DYNAMIC_CONFIG_KEY = type(uint32).max;

  /// @dev The maximum allowed value for the maximum number of reserves a user can have (collateral or borrowed) (inclusive).
  uint16 internal constant MAX_ALLOWED_USER_RESERVES_LIMIT = type(uint16).max;

  /// @dev The minimum health factor below which a position is considered unhealthy and subject to liquidation.
  /// @dev Expressed in WAD (18 decimals) (e.g. 1e18 is 1.00).
  uint64 internal constant HEALTH_FACTOR_LIQUIDATION_THRESHOLD =
    LiquidationLogic.HEALTH_FACTOR_LIQUIDATION_THRESHOLD;

  /// @dev The maximum amount considered as dust for a user's collateral and debt balances after a liquidation.
  /// @dev Worth 1000 USD, expressed in units of Value. 1e26 represents 1 USD.
  uint256 internal constant DUST_LIQUIDATION_THRESHOLD =
    LiquidationLogic.DUST_LIQUIDATION_THRESHOLD;

  /// @notice Modifier that checks if the caller is an approved positionManager for `onBehalfOf`.
  modifier onlyPositionManager(address onBehalfOf) {
    require(_isPositionManager({user: onBehalfOf, manager: msg.sender}), Unauthorized());
    _;
  }

  /// @dev Constructor.
  /// @param oracle_ The address of the AaveOracle contract.
  /// @param maxUserReservesLimit_ The maximum number of collateral and borrow reserves a user can have.
  constructor(address oracle_, uint16 maxUserReservesLimit_) {
    require(IAaveOracle(oracle_).decimals() == ORACLE_DECIMALS, InvalidOracleDecimals());
    require(maxUserReservesLimit_ > 0, InvalidMaxUserReservesLimit());
    ORACLE = oracle_;
    MAX_USER_RESERVES_LIMIT = maxUserReservesLimit_;
  }

  /// @dev To be overridden by the inheriting Spoke instance contract.
  function initialize(address authority) external virtual;

  /// @inheritdoc ISpoke
  function updateLiquidationConfig(LiquidationConfig calldata config) external restricted {
    require(
      config.targetHealthFactor >= HEALTH_FACTOR_LIQUIDATION_THRESHOLD &&
        config.liquidationBonusFactor <= PercentageMath.PERCENTAGE_FACTOR &&
        config.healthFactorForMaxBonus < HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
      InvalidLiquidationConfig()
    );
    _liquidationConfig = config;
    emit UpdateLiquidationConfig(config);
  }

  /// @inheritdoc ISpoke
  function addReserve(
    address hub,
    uint256 assetId,
    address priceSource,
    ReserveConfig calldata config,
    DynamicReserveConfig calldata dynamicConfig
  ) external restricted returns (uint256) {
    require(hub != address(0), InvalidAddress());
    require(assetId <= MAX_ALLOWED_ASSET_ID, InvalidAssetId());
    require(!_isAssetIdListed(hub, assetId, _hubAssetIdToReserveId[hub][assetId]), ReserveExists());

    _validateReserveConfig(config);
    _validateDynamicReserveConfig(dynamicConfig);
    uint256 reserveId = _reserveCount++;
    _hubAssetIdToReserveId[hub][assetId] = reserveId;

    (address underlying, uint8 decimals) = IHubBase(hub).getAssetUnderlyingAndDecimals(assetId);
    require(underlying != address(0), AssetNotListed());
    require(decimals <= WadRayMath.WAD_DECIMALS, InvalidAssetDecimals());

    _updateReservePriceSource(reserveId, priceSource);

    uint32 dynamicConfigKey; // 0 as first key to use
    _reserves[reserveId] = Reserve({
      underlying: underlying,
      hub: IHubBase(hub),
      assetId: assetId.toUint16(),
      decimals: decimals,
      collateralRisk: config.collateralRisk,
      flags: ReserveFlagsMap.create({
        initPaused: config.paused,
        initFrozen: config.frozen,
        initBorrowable: config.borrowable,
        initReceiveSharesEnabled: config.receiveSharesEnabled
      }),
      dynamicConfigKey: dynamicConfigKey
    });
    _dynamicConfig[reserveId][dynamicConfigKey] = dynamicConfig;

    emit AddReserve(reserveId, assetId, hub);
    emit UpdateReserveConfig(reserveId, config);
    emit AddDynamicReserveConfig(reserveId, dynamicConfigKey, dynamicConfig);

    return reserveId;
  }

  /// @inheritdoc ISpoke
  function updateReserveConfig(
    uint256 reserveId,
    ReserveConfig calldata config
  ) external restricted {
    Reserve storage reserve = _reserves.get(reserveId);
    _validateReserveConfig(config);
    reserve.collateralRisk = config.collateralRisk;
    reserve.flags = ReserveFlagsMap.create({
      initPaused: config.paused,
      initFrozen: config.frozen,
      initBorrowable: config.borrowable,
      initReceiveSharesEnabled: config.receiveSharesEnabled
    });
    emit UpdateReserveConfig(reserveId, config);
  }

  /// @inheritdoc ISpoke
  function updateReservePriceSource(uint256 reserveId, address priceSource) external restricted {
    require(reserveId < _reserveCount, ReserveNotListed());
    _updateReservePriceSource(reserveId, priceSource);
  }

  /// @inheritdoc ISpoke
  function addDynamicReserveConfig(
    uint256 reserveId,
    DynamicReserveConfig calldata dynamicConfig
  ) external restricted returns (uint32) {
    require(reserveId < _reserveCount, ReserveNotListed());
    uint32 dynamicConfigKey = _reserves[reserveId].dynamicConfigKey;
    require(dynamicConfigKey < MAX_ALLOWED_DYNAMIC_CONFIG_KEY, MaximumDynamicConfigKeyReached());
    _validateDynamicReserveConfig(dynamicConfig);
    dynamicConfigKey = dynamicConfigKey.uncheckedAdd(1).toUint32();
    _reserves[reserveId].dynamicConfigKey = dynamicConfigKey;
    _dynamicConfig[reserveId][dynamicConfigKey] = dynamicConfig;
    emit AddDynamicReserveConfig(reserveId, dynamicConfigKey, dynamicConfig);
    return dynamicConfigKey;
  }

  /// @inheritdoc ISpoke
  function updateDynamicReserveConfig(
    uint256 reserveId,
    uint32 dynamicConfigKey,
    DynamicReserveConfig calldata dynamicConfig
  ) external restricted {
    require(reserveId < _reserveCount, ReserveNotListed());
    _validateUpdateDynamicReserveConfig(_dynamicConfig[reserveId][dynamicConfigKey], dynamicConfig);
    _dynamicConfig[reserveId][dynamicConfigKey] = dynamicConfig;
    emit UpdateDynamicReserveConfig(reserveId, dynamicConfigKey, dynamicConfig);
  }

  /// @inheritdoc ISpoke
  function updatePositionManager(address positionManager, bool active) external restricted {
    _positionManager[positionManager].active = active;
    emit UpdatePositionManager(positionManager, active);
  }

  /// @inheritdoc ISpoke
  function supply(
    uint256 reserveId,
    uint256 amount,
    address onBehalfOf
  ) external nonReentrant onlyPositionManager(onBehalfOf) returns (uint256, uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    UserPosition storage userPosition = _userPositions[onBehalfOf][reserveId];
    _validateSupply(reserve.flags);

    IERC20(reserve.underlying).safeTransferFrom(msg.sender, address(reserve.hub), amount);
    uint256 suppliedShares = reserve.hub.add(reserve.assetId, amount);
    userPosition.suppliedShares += suppliedShares.toUint120();

    emit Supply(reserveId, msg.sender, onBehalfOf, suppliedShares, amount);

    return (suppliedShares, amount);
  }

  /// @inheritdoc ISpoke
  function withdraw(
    uint256 reserveId,
    uint256 amount,
    address onBehalfOf
  ) external nonReentrant onlyPositionManager(onBehalfOf) returns (uint256, uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    UserPosition storage userPosition = _userPositions[onBehalfOf][reserveId];
    _validateWithdraw(reserve.flags);
    IHubBase hub = reserve.hub;
    uint256 assetId = reserve.assetId;

    uint256 withdrawnAmount = MathUtils.min(
      amount,
      hub.previewRemoveByShares(assetId, userPosition.suppliedShares)
    );
    uint256 withdrawnShares = hub.remove(assetId, withdrawnAmount, msg.sender);

    userPosition.suppliedShares -= withdrawnShares.toUint120();

    if (_positionStatus[onBehalfOf].isUsingAsCollateral(reserveId)) {
      uint256 newRiskPremium = _refreshAndValidateUserAccountData(onBehalfOf).riskPremium;
      _notifyRiskPremiumUpdate(onBehalfOf, newRiskPremium);
    }

    emit Withdraw(reserveId, msg.sender, onBehalfOf, withdrawnShares, withdrawnAmount);

    return (withdrawnShares, withdrawnAmount);
  }

  /// @inheritdoc ISpoke
  function borrow(
    uint256 reserveId,
    uint256 amount,
    address onBehalfOf
  ) external nonReentrant onlyPositionManager(onBehalfOf) returns (uint256, uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    UserPosition storage userPosition = _userPositions[onBehalfOf][reserveId];
    PositionStatus storage positionStatus = _positionStatus[onBehalfOf];
    _validateBorrow(reserve.flags);
    IHubBase hub = reserve.hub;

    uint256 drawnShares = hub.draw(reserve.assetId, amount, msg.sender);
    userPosition.drawnShares += drawnShares.toUint120();
    if (!positionStatus.isBorrowing(reserveId)) {
      require(
        MAX_USER_RESERVES_LIMIT == MAX_ALLOWED_USER_RESERVES_LIMIT ||
          positionStatus.borrowCount(_reserveCount) < MAX_USER_RESERVES_LIMIT,
        MaximumUserReservesExceeded()
      );
      positionStatus.setBorrowing(reserveId, true);
    }

    uint256 newRiskPremium = _refreshAndValidateUserAccountData(onBehalfOf).riskPremium;
    _notifyRiskPremiumUpdate(onBehalfOf, newRiskPremium);

    emit Borrow(reserveId, msg.sender, onBehalfOf, drawnShares, amount);

    return (drawnShares, amount);
  }

  /// @inheritdoc ISpoke
  function repay(
    uint256 reserveId,
    uint256 amount,
    address onBehalfOf
  ) external nonReentrant onlyPositionManager(onBehalfOf) returns (uint256, uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    UserPosition storage userPosition = _userPositions[onBehalfOf][reserveId];
    _validateRepay(reserve.flags);

    uint256 drawnIndex = reserve.hub.getAssetDrawnIndex(reserve.assetId);
    (uint256 drawnDebtRestored, uint256 premiumDebtRayRestored) = userPosition
      .calculateRestoreAmount(drawnIndex, amount);
    uint256 restoredShares = drawnDebtRestored.rayDivDown(drawnIndex);

    IHubBase.PremiumDelta memory premiumDelta = userPosition.calculatePremiumDelta({
      drawnSharesTaken: restoredShares,
      drawnIndex: drawnIndex,
      riskPremium: _positionStatus[onBehalfOf].riskPremium,
      restoredPremiumRay: premiumDebtRayRestored
    });

    uint256 totalDebtRestored = drawnDebtRestored + premiumDebtRayRestored.fromRayUp();
    IERC20(reserve.underlying).safeTransferFrom(
      msg.sender,
      address(reserve.hub),
      totalDebtRestored
    );
    reserve.hub.restore(reserve.assetId, drawnDebtRestored, premiumDelta);

    userPosition.applyPremiumDelta(premiumDelta);
    userPosition.drawnShares -= restoredShares.toUint120();
    if (userPosition.drawnShares == 0) {
      PositionStatus storage positionStatus = _positionStatus[onBehalfOf];
      positionStatus.setBorrowing(reserveId, false);
    }

    emit Repay(reserveId, msg.sender, onBehalfOf, restoredShares, totalDebtRestored, premiumDelta);

    return (restoredShares, totalDebtRestored);
  }

  /// @inheritdoc ISpoke
  function liquidationCall(
    uint256 collateralReserveId,
    uint256 debtReserveId,
    address user,
    uint256 debtToCover,
    bool receiveShares
  ) external nonReentrant {
    UserAccountData memory userAccountData = _calculateUserAccountData(user);
    LiquidationLogic.LiquidateUserParams memory params = LiquidationLogic.LiquidateUserParams({
      collateralReserveId: collateralReserveId,
      debtReserveId: debtReserveId,
      liquidationConfig: _liquidationConfig,
      oracle: ORACLE,
      user: user,
      debtToCover: debtToCover,
      userAccountData: userAccountData,
      liquidator: msg.sender,
      receiveShares: receiveShares
    });

    bool isUserInDeficit = LiquidationLogic.liquidateUser({
      reserves: _reserves,
      userPositions: _userPositions,
      positionStatus: _positionStatus,
      dynamicConfig: _dynamicConfig,
      params: params
    });

    if (isUserInDeficit) {
      // report deficit for all debt reserves, including the reserve being repaid
      LiquidationLogic.notifyReportDeficit(
        _reserves,
        _userPositions,
        _positionStatus,
        _reserveCount,
        user
      );
    } else {
      uint256 newRiskPremium = _calculateUserAccountData(user).riskPremium;
      _notifyRiskPremiumUpdate(user, newRiskPremium);
    }
  }

  /// @inheritdoc ISpoke
  function setUsingAsCollateral(
    uint256 reserveId,
    bool usingAsCollateral,
    address onBehalfOf
  ) external nonReentrant onlyPositionManager(onBehalfOf) {
    Reserve storage reserve = _reserves.get(reserveId);
    PositionStatus storage positionStatus = _positionStatus[onBehalfOf];
    if (positionStatus.isUsingAsCollateral(reserveId) == usingAsCollateral) {
      return;
    }
    _validateSetUsingAsCollateral(positionStatus, reserve.flags, usingAsCollateral);
    positionStatus.setUsingAsCollateral(reserveId, usingAsCollateral);

    if (usingAsCollateral) {
      _refreshDynamicConfig(onBehalfOf, reserveId);
    } else {
      uint256 newRiskPremium = _refreshAndValidateUserAccountData(onBehalfOf).riskPremium;
      _notifyRiskPremiumUpdate(onBehalfOf, newRiskPremium);
    }

    emit SetUsingAsCollateral(reserveId, msg.sender, onBehalfOf, usingAsCollateral);
  }

  /// @inheritdoc ISpoke
  function updateUserRiskPremium(address onBehalfOf) external nonReentrant {
    if (!_isPositionManager({user: onBehalfOf, manager: msg.sender})) {
      _checkCanCall(msg.sender, msg.data);
    }
    uint256 newRiskPremium = _calculateUserAccountData(onBehalfOf).riskPremium;
    _notifyRiskPremiumUpdate(onBehalfOf, newRiskPremium);
  }

  /// @inheritdoc ISpoke
  function updateUserDynamicConfig(address onBehalfOf) external nonReentrant {
    if (!_isPositionManager({user: onBehalfOf, manager: msg.sender})) {
      _checkCanCall(msg.sender, msg.data);
    }
    uint256 newRiskPremium = _refreshAndValidateUserAccountData(onBehalfOf).riskPremium;
    _notifyRiskPremiumUpdate(onBehalfOf, newRiskPremium);
  }

  /// @inheritdoc ISpoke
  function setUserPositionManager(address positionManager, bool approve) external {
    _setUserPositionManager({positionManager: positionManager, user: msg.sender, approve: approve});
  }

  /// @inheritdoc ISpoke
  function setUserPositionManagersWithSig(
    SetUserPositionManagers calldata params,
    bytes calldata signature
  ) external {
    _verifyAndConsumeIntent({
      signer: params.onBehalfOf,
      intentHash: params.hash(),
      nonce: params.nonce,
      deadline: params.deadline,
      signature: signature
    });

    for (uint256 i = 0; i < params.updates.length; ++i) {
      _setUserPositionManager({
        positionManager: params.updates[i].positionManager,
        user: params.onBehalfOf,
        approve: params.updates[i].approve
      });
    }
  }

  /// @inheritdoc ISpoke
  function renouncePositionManagerRole(address onBehalfOf) external {
    if (!_positionManager[msg.sender].approval[onBehalfOf]) {
      return;
    }
    _positionManager[msg.sender].approval[onBehalfOf] = false;
    emit SetUserPositionManager(onBehalfOf, msg.sender, false);
  }

  /// @inheritdoc ISpoke
  function permitReserve(
    uint256 reserveId,
    address onBehalfOf,
    uint256 value,
    uint256 deadline,
    uint8 permitV,
    bytes32 permitR,
    bytes32 permitS
  ) external {
    Reserve storage reserve = _reserves[reserveId];
    address underlying = reserve.underlying;
    require(underlying != address(0), ReserveNotListed());
    try
      IERC20Permit(underlying).permit({
        owner: onBehalfOf,
        spender: address(this),
        value: value,
        deadline: deadline,
        v: permitV,
        r: permitR,
        s: permitS
      })
    {} catch {}
  }

  /// @inheritdoc ISpoke
  function getLiquidationConfig() external view returns (LiquidationConfig memory) {
    return _liquidationConfig;
  }

  /// @inheritdoc ISpoke
  function getReserveCount() external view returns (uint256) {
    return _reserveCount;
  }

  /// @inheritdoc ISpoke
  function getReserveSuppliedAssets(uint256 reserveId) external view returns (uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    return reserve.hub.getSpokeAddedAssets(reserve.assetId, address(this));
  }

  /// @inheritdoc ISpoke
  function getReserveSuppliedShares(uint256 reserveId) external view returns (uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    return reserve.hub.getSpokeAddedShares(reserve.assetId, address(this));
  }

  /// @inheritdoc ISpoke
  function getReserveDebt(uint256 reserveId) external view returns (uint256, uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    return reserve.hub.getSpokeOwed(reserve.assetId, address(this));
  }

  /// @inheritdoc ISpoke
  function getReserveTotalDebt(uint256 reserveId) external view returns (uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    return reserve.hub.getSpokeTotalOwed(reserve.assetId, address(this));
  }

  /// @inheritdoc ISpoke
  function getReserveId(address hub, uint256 assetId) external view returns (uint256) {
    uint256 reserveId = _hubAssetIdToReserveId[hub][assetId];
    require(_isAssetIdListed(hub, assetId, reserveId), ReserveNotListed());
    return reserveId;
  }

  /// @inheritdoc ISpoke
  function getReserve(uint256 reserveId) external view returns (Reserve memory) {
    return _reserves.get(reserveId);
  }

  /// @inheritdoc ISpoke
  function getReserveConfig(uint256 reserveId) external view returns (ReserveConfig memory) {
    Reserve storage reserve = _reserves.get(reserveId);
    return
      ReserveConfig({
        collateralRisk: reserve.collateralRisk,
        paused: reserve.flags.paused(),
        frozen: reserve.flags.frozen(),
        borrowable: reserve.flags.borrowable(),
        receiveSharesEnabled: reserve.flags.receiveSharesEnabled()
      });
  }

  /// @inheritdoc ISpoke
  function getDynamicReserveConfig(
    uint256 reserveId,
    uint32 dynamicConfigKey
  ) external view returns (DynamicReserveConfig memory) {
    _reserves.get(reserveId);
    return _dynamicConfig[reserveId][dynamicConfigKey];
  }

  /// @inheritdoc ISpoke
  function getUserReserveStatus(
    uint256 reserveId,
    address user
  ) external view returns (bool, bool) {
    _reserves.get(reserveId);
    PositionStatus storage positionStatus = _positionStatus[user];
    return (positionStatus.isUsingAsCollateral(reserveId), positionStatus.isBorrowing(reserveId));
  }

  /// @inheritdoc ISpoke
  function getUserSuppliedAssets(uint256 reserveId, address user) external view returns (uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    return
      reserve.hub.previewRemoveByShares(
        reserve.assetId,
        _userPositions[user][reserveId].suppliedShares
      );
  }

  /// @inheritdoc ISpoke
  function getUserSuppliedShares(uint256 reserveId, address user) external view returns (uint256) {
    _reserves.get(reserveId);
    return _userPositions[user][reserveId].suppliedShares;
  }

  /// @inheritdoc ISpoke
  function getUserDebt(uint256 reserveId, address user) external view returns (uint256, uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    UserPosition storage userPosition = _userPositions[user][reserveId];
    (uint256 drawnDebt, uint256 premiumDebtRay) = userPosition.getDebt(
      reserve.hub,
      reserve.assetId
    );
    return (drawnDebt, premiumDebtRay.fromRayUp());
  }

  /// @inheritdoc ISpoke
  function getUserTotalDebt(uint256 reserveId, address user) external view returns (uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    UserPosition storage userPosition = _userPositions[user][reserveId];
    (uint256 drawnDebt, uint256 premiumDebtRay) = userPosition.getDebt(
      reserve.hub,
      reserve.assetId
    );
    return (drawnDebt + premiumDebtRay.fromRayUp());
  }

  /// @inheritdoc ISpoke
  function getUserPremiumDebtRay(uint256 reserveId, address user) external view returns (uint256) {
    Reserve storage reserve = _reserves.get(reserveId);
    UserPosition storage userPosition = _userPositions[user][reserveId];
    (, uint256 premiumDebtRay) = userPosition.getDebt(reserve.hub, reserve.assetId);
    return premiumDebtRay;
  }

  /// @inheritdoc ISpoke
  function getUserPosition(
    uint256 reserveId,
    address user
  ) external view returns (UserPosition memory) {
    _reserves.get(reserveId);
    return _userPositions[user][reserveId];
  }

  /// @inheritdoc ISpoke
  function getUserLastRiskPremium(address user) external view returns (uint256) {
    return _positionStatus[user].riskPremium;
  }

  /// @inheritdoc ISpoke
  function getUserAccountData(address user) external view returns (UserAccountData memory) {
    // SAFETY: function does not modify state when `refreshConfig` is false.
    return _castToView(_processUserAccountData)(user, false);
  }

  /// @inheritdoc ISpoke
  function getLiquidationBonus(
    uint256 reserveId,
    address user,
    uint256 healthFactor
  ) external view returns (uint256) {
    _reserves.get(reserveId);
    return
      LiquidationLogic.calculateLiquidationBonus({
        healthFactorForMaxBonus: _liquidationConfig.healthFactorForMaxBonus,
        liquidationBonusFactor: _liquidationConfig.liquidationBonusFactor,
        healthFactor: healthFactor,
        maxLiquidationBonus: _dynamicConfig[reserveId][
          _userPositions[user][reserveId].dynamicConfigKey
        ].maxLiquidationBonus
      });
  }

  /// @inheritdoc ISpoke
  function isPositionManagerActive(address positionManager) external view returns (bool) {
    return _positionManager[positionManager].active;
  }

  /// @inheritdoc ISpoke
  function isPositionManager(address user, address positionManager) external view returns (bool) {
    return _isPositionManager(user, positionManager);
  }

  /// @inheritdoc ISpoke
  function getLiquidationLogic() external pure returns (address) {
    return address(LiquidationLogic);
  }

  function _updateReservePriceSource(uint256 reserveId, address priceSource) internal {
    require(priceSource != address(0), InvalidAddress());
    IAaveOracle(ORACLE).setReserveSource(reserveId, priceSource);
    emit UpdateReservePriceSource(reserveId, priceSource);
  }

  function _setUserPositionManager(address positionManager, address user, bool approve) internal {
    PositionManagerConfig storage config = _positionManager[positionManager];
    config.approval[user] = approve;
    emit SetUserPositionManager(user, positionManager, approve);
  }

  /// @notice Calculates and validates the user account data.
  /// @dev It refreshes the dynamic config before calculation.
  /// @dev It checks that the health factor is above the liquidation threshold.
  function _refreshAndValidateUserAccountData(
    address user
  ) internal returns (UserAccountData memory) {
    UserAccountData memory accountData = _processUserAccountData(user, true);
    emit RefreshAllUserDynamicConfig(user);
    require(
      accountData.healthFactor >= HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
      HealthFactorBelowThreshold()
    );
    return accountData;
  }

  /// @notice Calculates the user account data with the current user dynamic config.
  function _calculateUserAccountData(address user) internal returns (UserAccountData memory) {
    return _processUserAccountData(user, false); // does not modify state
  }

  /// @notice Process the user account data and updates dynamic config of the user if `refreshConfig` is true.
  /// @dev Collateral is rounded against the user, while debt is calculated with full precision.
  /// @dev If user has no debt, it returns health factor of `type(uint256).max` and risk premium of 0.
  function _processUserAccountData(
    address user,
    bool refreshConfig
  ) internal returns (UserAccountData memory accountData) {
    PositionStatus storage positionStatus = _positionStatus[user];

    uint256 reserveId = _reserveCount;
    KeyValueList.List memory collateralInfo = KeyValueList.init(
      positionStatus.collateralCount(reserveId)
    );
    bool borrowing;
    bool collateral;
    while (true) {
      (reserveId, borrowing, collateral) = positionStatus.next(reserveId);
      if (reserveId == PositionStatusMap.NOT_FOUND) break;

      UserPosition storage userPosition = _userPositions[user][reserveId];
      Reserve storage reserve = _reserves[reserveId];

      uint256 assetPrice = IAaveOracle(ORACLE).getReservePrice(reserveId);
      uint256 assetDecimals = reserve.decimals;

      if (collateral) {
        uint256 collateralFactor = _dynamicConfig[reserveId][
          refreshConfig
            ? (userPosition.dynamicConfigKey = reserve.dynamicConfigKey)
            : userPosition.dynamicConfigKey
        ].collateralFactor;
        if (collateralFactor > 0) {
          uint256 suppliedShares = userPosition.suppliedShares;
          if (suppliedShares > 0) {
            // cannot round down to zero
            uint256 userCollateralValue = reserve
              .hub
              .previewRemoveByShares(reserve.assetId, suppliedShares)
              .toValue({decimals: assetDecimals, price: assetPrice});
            accountData.totalCollateralValue += userCollateralValue;
            collateralInfo.add(
              accountData.activeCollateralCount,
              reserve.collateralRisk,
              userCollateralValue
            );
            accountData.avgCollateralFactor += collateralFactor * userCollateralValue;
            accountData.activeCollateralCount = accountData.activeCollateralCount.uncheckedAdd(1);
          }
        }
      }

      if (borrowing) {
        UserPositionUtils.DebtComponents memory debtComponents = userPosition.getDebtComponents(
          reserve.hub,
          reserve.assetId
        );
        uint256 debtRay = debtComponents.drawnShares * debtComponents.drawnIndex +
          debtComponents.premiumDebtRay;
        accountData.totalDebtValueRay += debtRay.toValue({
          decimals: assetDecimals,
          price: assetPrice
        });
        accountData.borrowCount = accountData.borrowCount.uncheckedAdd(1);
      }
    }

    if (accountData.totalDebtValueRay > 0) {
      // at this point, `avgCollateralFactor` is the total collateral value weighted by collateral factors,
      // expressed in units of Value and scaled by BPS. We convert it from BPS to WAD, since this will
      // ultimately define the scaling factor of the health factor.
      accountData.healthFactor = Math.mulDiv(
        accountData.avgCollateralFactor.bpsToWad(),
        WadRayMath.RAY,
        accountData.totalDebtValueRay,
        Math.Rounding.Floor
      );
    } else {
      accountData.healthFactor = type(uint256).max;
    }

    if (accountData.totalCollateralValue > 0) {
      accountData.avgCollateralFactor =
        accountData.avgCollateralFactor.bpsToWad() / accountData.totalCollateralValue;
    }

    // sort by collateral risk in ASC, collateral value in DESC
    collateralInfo.sortByKey();

    // runs until either the collateral or debt is exhausted
    uint256 totalDebtValue = accountData.totalDebtValueRay.fromRayUp();
    uint256 debtValueLeftToCover = totalDebtValue;

    for (uint256 index = 0; index < collateralInfo.length(); ++index) {
      if (debtValueLeftToCover == 0) {
        break;
      }

      (uint256 collateralRisk, uint256 userCollateralValue) = collateralInfo.uncheckedAt(index);
      userCollateralValue = userCollateralValue.min(debtValueLeftToCover);
      accountData.riskPremium += userCollateralValue * collateralRisk;
      debtValueLeftToCover = debtValueLeftToCover.uncheckedSub(userCollateralValue);
    }

    if (debtValueLeftToCover < totalDebtValue) {
      accountData.riskPremium = accountData.riskPremium.divUp(
        totalDebtValue.uncheckedSub(debtValueLeftToCover)
      );
    }

    return accountData;
  }

  function _refreshDynamicConfig(address user, uint256 reserveId) internal {
    _userPositions[user][reserveId].dynamicConfigKey = _reserves[reserveId].dynamicConfigKey;
    emit RefreshSingleUserDynamicConfig(user, reserveId);
  }

  /// @notice Refreshes premium for borrowed reserves of `user` with `newRiskPremium`.
  /// @dev Skips the refresh if the user risk premium remains zero.
  function _notifyRiskPremiumUpdate(address user, uint256 newRiskPremium) internal {
    PositionStatus storage positionStatus = _positionStatus[user];
    if (newRiskPremium == 0 && positionStatus.riskPremium == 0) {
      return;
    }
    positionStatus.riskPremium = newRiskPremium.toUint24();

    uint256 reserveId = _reserveCount;
    while ((reserveId = positionStatus.nextBorrowing(reserveId)) != PositionStatusMap.NOT_FOUND) {
      UserPosition storage userPosition = _userPositions[user][reserveId];
      Reserve storage reserve = _reserves[reserveId];
      uint256 assetId = reserve.assetId;
      IHubBase hub = reserve.hub;

      IHubBase.PremiumDelta memory premiumDelta = userPosition.calculatePremiumDelta({
        drawnSharesTaken: 0,
        drawnIndex: hub.getAssetDrawnIndex(assetId),
        riskPremium: newRiskPremium,
        restoredPremiumRay: 0
      });

      hub.refreshPremium(assetId, premiumDelta);
      userPosition.applyPremiumDelta(premiumDelta);
      emit RefreshPremiumDebt(reserveId, user, premiumDelta);
    }

    emit UpdateUserRiskPremium(user, newRiskPremium);
  }

  /// @dev CollateralFactor of historical config keys cannot be 0, which allows liquidations to proceed.
  function _validateUpdateDynamicReserveConfig(
    DynamicReserveConfig storage currentConfig,
    DynamicReserveConfig calldata newConfig
  ) internal view {
    // sufficient check since maxLiquidationBonus is always >= 100_00
    require(currentConfig.maxLiquidationBonus > 0, DynamicConfigKeyUninitialized());
    require(newConfig.collateralFactor > 0, InvalidCollateralFactor());
    _validateDynamicReserveConfig(newConfig);
  }

  function _validateSupply(ReserveFlags flags) internal pure {
    require(!flags.paused(), ReservePaused());
    require(!flags.frozen(), ReserveFrozen());
  }

  function _validateWithdraw(ReserveFlags flags) internal pure {
    require(!flags.paused(), ReservePaused());
  }

  function _validateBorrow(ReserveFlags flags) internal pure {
    require(!flags.paused(), ReservePaused());
    require(!flags.frozen(), ReserveFrozen());
    require(flags.borrowable(), ReserveNotBorrowable());
    // health factor is checked at the end of borrow action
  }

  function _validateRepay(ReserveFlags flags) internal pure {
    require(!flags.paused(), ReservePaused());
  }

  function _validateSetUsingAsCollateral(
    PositionStatus storage positionStatus,
    ReserveFlags flags,
    bool usingAsCollateral
  ) internal view {
    require(!flags.paused(), ReservePaused());
    if (usingAsCollateral) {
      // disabling as collateral is allowed when reserve is frozen
      require(!flags.frozen(), ReserveFrozen());
      // this must be a new collateral, otherwise would have short-circuited
      require(
        MAX_USER_RESERVES_LIMIT == MAX_ALLOWED_USER_RESERVES_LIMIT ||
          positionStatus.collateralCount(_reserveCount) < MAX_USER_RESERVES_LIMIT,
        MaximumUserReservesExceeded()
      );
    }
  }

  function _isAssetIdListed(
    address hub,
    uint256 assetId,
    uint256 reserveId
  ) internal view returns (bool) {
    return _reserves[reserveId].assetId == assetId && address(_reserves[reserveId].hub) == hub;
  }

  /// @notice Returns whether `manager` is active and approved positionManager for `user`.
  function _isPositionManager(address user, address manager) internal view returns (bool) {
    if (user == manager) return true;
    PositionManagerConfig storage config = _positionManager[manager];
    return config.active && config.approval[user];
  }

  function _validateReserveConfig(ReserveConfig calldata config) internal pure {
    require(config.collateralRisk <= MAX_ALLOWED_COLLATERAL_RISK, InvalidCollateralRisk());
  }

  /// @dev Enforces compatible `maxLiquidationBonus` and `collateralFactor` so at the moment debt is created
  /// there is enough collateral to cover liquidation.
  function _validateDynamicReserveConfig(DynamicReserveConfig calldata config) internal pure {
    require(
      config.collateralFactor < PercentageMath.PERCENTAGE_FACTOR &&
        config.maxLiquidationBonus >= PercentageMath.PERCENTAGE_FACTOR &&
        config.maxLiquidationBonus.percentMulUp(config.collateralFactor) <
          PercentageMath.PERCENTAGE_FACTOR,
      InvalidCollateralFactorAndMaxLiquidationBonus()
    );
    require(config.liquidationFee <= PercentageMath.PERCENTAGE_FACTOR, InvalidLiquidationFee());
  }

  function _domainNameAndVersion() internal pure override returns (string memory, string memory) {
    return ('Spoke', '1');
  }

  function _castToView(
    function(address, bool) internal returns (UserAccountData memory) fnIn
  )
    internal
    pure
    returns (function(address, bool) internal view returns (UserAccountData memory) fnOut)
  {
    assembly ('memory-safe') {
      fnOut := fnIn
    }
  }
}
