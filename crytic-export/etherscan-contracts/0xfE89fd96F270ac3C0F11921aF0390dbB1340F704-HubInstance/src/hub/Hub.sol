// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {AccessManagedUpgradeable} from 'src/dependencies/openzeppelin-upgradeable/AccessManagedUpgradeable.sol';
import {EnumerableSet} from 'src/dependencies/openzeppelin/EnumerableSet.sol';
import {SafeCast} from 'src/dependencies/openzeppelin/SafeCast.sol';
import {SafeERC20, IERC20} from 'src/dependencies/openzeppelin/SafeERC20.sol';
import {MathUtils} from 'src/libraries/math/MathUtils.sol';
import {PercentageMath} from 'src/libraries/math/PercentageMath.sol';
import {WadRayMath} from 'src/libraries/math/WadRayMath.sol';
import {AssetLogic} from 'src/hub/libraries/AssetLogic.sol';
import {SharesMath} from 'src/hub/libraries/SharesMath.sol';
import {Premium} from 'src/hub/libraries/Premium.sol';
import {IBasicInterestRateStrategy} from 'src/hub/interfaces/IBasicInterestRateStrategy.sol';
import {IHubBase, IHub} from 'src/hub/interfaces/IHub.sol';
import {HubStorage} from 'src/hub/HubStorage.sol';

/// @title Hub
/// @author Aave Labs
/// @notice A liquidity hub that manages assets and spokes.
abstract contract Hub is IHub, HubStorage, AccessManagedUpgradeable {
  using EnumerableSet for EnumerableSet.AddressSet;
  using SafeCast for *;
  using SafeERC20 for IERC20;
  using MathUtils for *;
  using PercentageMath for *;
  using WadRayMath for uint256;
  using AssetLogic for Asset;
  using SharesMath for uint256;

  /// @inheritdoc IHub
  uint8 public constant MAX_ALLOWED_UNDERLYING_DECIMALS = 18;

  /// @inheritdoc IHub
  uint8 public constant MIN_ALLOWED_UNDERLYING_DECIMALS = 6;

  /// @inheritdoc IHub
  uint40 public constant MAX_ALLOWED_SPOKE_CAP = type(uint40).max;

  /// @inheritdoc IHub
  uint24 public constant MAX_RISK_PREMIUM_THRESHOLD = type(uint24).max;

  /// @dev To be overridden by the inheriting Hub instance contract.
  function initialize(address authority) external virtual;

  /// @inheritdoc IHub
  function addAsset(
    address underlying,
    uint8 decimals,
    address feeReceiver,
    address irStrategy,
    bytes calldata irData
  ) external restricted returns (uint256) {
    require(
      underlying != address(0) && feeReceiver != address(0) && irStrategy != address(0),
      InvalidAddress()
    );
    require(
      MIN_ALLOWED_UNDERLYING_DECIMALS <= decimals && decimals <= MAX_ALLOWED_UNDERLYING_DECIMALS,
      InvalidAssetDecimals()
    );
    require(!isUnderlyingListed(underlying), UnderlyingAlreadyListed());

    uint256 assetId = _assetCount++;
    _underlyingToAssetId[underlying] = assetId;

    IBasicInterestRateStrategy(irStrategy).setInterestRateData(assetId, irData);
    uint256 drawnRate = IBasicInterestRateStrategy(irStrategy).calculateInterestRate({
      assetId: assetId,
      liquidity: 0,
      drawn: 0,
      deficit: 0,
      swept: 0
    });

    uint256 drawnIndex = WadRayMath.RAY;
    uint256 lastUpdateTimestamp = block.timestamp;
    _assets[assetId] = Asset({
      liquidity: 0,
      deficitRay: 0,
      swept: 0,
      addedShares: 0,
      drawnShares: 0,
      premiumShares: 0,
      premiumOffsetRay: 0,
      drawnIndex: drawnIndex.toUint120(),
      underlying: underlying,
      lastUpdateTimestamp: lastUpdateTimestamp.toUint40(),
      decimals: decimals,
      drawnRate: drawnRate.toUint96(),
      irStrategy: irStrategy,
      realizedFees: 0,
      reinvestmentController: address(0),
      feeReceiver: feeReceiver,
      liquidityFee: 0
    });
    _addFeeReceiver(assetId, feeReceiver);

    emit AddAsset(assetId, underlying, decimals);
    emit UpdateAssetConfig(
      assetId,
      AssetConfig({
        feeReceiver: feeReceiver,
        liquidityFee: 0,
        irStrategy: irStrategy,
        reinvestmentController: address(0)
      })
    );
    emit UpdateAsset(assetId, drawnIndex, drawnRate, 0);

    return assetId;
  }

  /// @inheritdoc IHub
  function updateAssetConfig(
    uint256 assetId,
    AssetConfig calldata config,
    bytes calldata irData
  ) external restricted {
    require(assetId < _assetCount, AssetNotListed());
    Asset storage asset = _assets[assetId];
    asset.accrue();

    require(config.liquidityFee <= PercentageMath.PERCENTAGE_FACTOR, InvalidLiquidityFee());
    require(config.feeReceiver != address(0) && config.irStrategy != address(0), InvalidAddress());
    require(
      config.reinvestmentController != address(0) || asset.swept == 0,
      InvalidReinvestmentController()
    );

    asset.liquidityFee = config.liquidityFee;
    asset.reinvestmentController = config.reinvestmentController;

    address oldFeeReceiver = asset.feeReceiver;
    if (oldFeeReceiver != config.feeReceiver) {
      _mintFeeShares(asset, assetId);
      IHub.SpokeConfig memory spokeConfig;
      spokeConfig.active = _spokes[assetId][oldFeeReceiver].active;
      spokeConfig.halted = _spokes[assetId][oldFeeReceiver].halted;
      _updateSpokeConfig(assetId, oldFeeReceiver, spokeConfig);
      asset.feeReceiver = config.feeReceiver;
      _addFeeReceiver(assetId, config.feeReceiver);
    }

    if (config.irStrategy != asset.irStrategy) {
      asset.irStrategy = config.irStrategy;
      IBasicInterestRateStrategy(config.irStrategy).setInterestRateData(assetId, irData);
    } else {
      require(irData.length == 0, InvalidInterestRateStrategy());
    }

    asset.updateDrawnRate(assetId);

    emit UpdateAssetConfig(assetId, config);
  }

  /// @inheritdoc IHub
  function addSpoke(
    uint256 assetId,
    address spoke,
    SpokeConfig calldata config
  ) external restricted {
    require(assetId < _assetCount, AssetNotListed());
    require(spoke != address(0), InvalidAddress());
    _addSpoke(assetId, spoke);
    _updateSpokeConfig(assetId, spoke, config);
  }

  /// @inheritdoc IHub
  function updateSpokeConfig(
    uint256 assetId,
    address spoke,
    SpokeConfig calldata config
  ) external restricted {
    require(assetId < _assetCount, AssetNotListed());
    require(_assetToSpokes[assetId].contains(spoke), SpokeNotListed());
    _updateSpokeConfig(assetId, spoke, config);
  }

  /// @inheritdoc IHub
  function setInterestRateData(uint256 assetId, bytes calldata irData) external restricted {
    require(assetId < _assetCount, AssetNotListed());
    Asset storage asset = _assets[assetId];
    asset.accrue();
    IBasicInterestRateStrategy(asset.irStrategy).setInterestRateData(assetId, irData);
    asset.updateDrawnRate(assetId);
  }

  /// @inheritdoc IHub
  function mintFeeShares(uint256 assetId) external restricted returns (uint256) {
    require(assetId < _assetCount, AssetNotListed());
    Asset storage asset = _assets[assetId];
    asset.accrue();
    uint256 feeShares = _mintFeeShares(asset, assetId);
    asset.updateDrawnRate(assetId);
    return feeShares;
  }

  /// @inheritdoc IHubBase
  function add(uint256 assetId, uint256 amount) external returns (uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage spoke = _spokes[assetId][msg.sender];

    asset.accrue();
    _validateAdd(asset, spoke, amount);

    uint256 liquidity = asset.liquidity + amount;
    uint256 balance = IERC20(asset.underlying).balanceOf(address(this));
    require(balance >= liquidity, InsufficientTransferred(liquidity.uncheckedSub(balance)));
    uint120 shares = asset.toAddedSharesDown(amount).toUint120();
    require(shares > 0, InvalidShares());
    asset.addedShares += shares;
    spoke.addedShares += shares;
    asset.liquidity = liquidity.toUint120();

    asset.updateDrawnRate(assetId);

    emit Add(assetId, msg.sender, shares, amount);

    return shares;
  }

  /// @inheritdoc IHubBase
  function remove(uint256 assetId, uint256 amount, address to) external returns (uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage spoke = _spokes[assetId][msg.sender];

    asset.accrue();
    _validateRemove(spoke, amount, to);

    uint256 liquidity = asset.liquidity;
    require(amount <= liquidity, InsufficientLiquidity(liquidity));

    uint120 shares = asset.toAddedSharesUp(amount).toUint120();
    asset.addedShares -= shares;
    spoke.addedShares -= shares;
    asset.liquidity = liquidity.uncheckedSub(amount).toUint120();

    asset.updateDrawnRate(assetId);

    IERC20(asset.underlying).safeTransfer(to, amount);

    emit Remove(assetId, msg.sender, shares, amount);

    return shares;
  }

  /// @inheritdoc IHubBase
  function draw(uint256 assetId, uint256 amount, address to) external returns (uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage spoke = _spokes[assetId][msg.sender];

    asset.accrue();
    _validateDraw(asset, spoke, amount, to);

    uint256 liquidity = asset.liquidity;
    require(amount <= liquidity, InsufficientLiquidity(liquidity));

    uint120 drawnShares = asset.toDrawnSharesUp(amount).toUint120();
    asset.drawnShares += drawnShares;
    spoke.drawnShares += drawnShares;
    asset.liquidity = liquidity.uncheckedSub(amount).toUint120();

    asset.updateDrawnRate(assetId);

    IERC20(asset.underlying).safeTransfer(to, amount);

    emit Draw(assetId, msg.sender, drawnShares, amount);

    return drawnShares;
  }

  /// @inheritdoc IHubBase
  function restore(
    uint256 assetId,
    uint256 drawnAmount,
    PremiumDelta calldata premiumDelta
  ) external returns (uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage spoke = _spokes[assetId][msg.sender];

    asset.accrue();
    _validateRestore(asset, spoke, drawnAmount, premiumDelta.restoredPremiumRay);

    uint120 drawnShares = asset.toDrawnSharesDown(drawnAmount).toUint120();
    asset.drawnShares -= drawnShares;
    spoke.drawnShares -= drawnShares;
    _applyPremiumDelta(asset, spoke, premiumDelta);

    uint256 premiumAmount = premiumDelta.restoredPremiumRay.fromRayUp();
    uint256 liquidity = asset.liquidity + drawnAmount + premiumAmount;
    uint256 balance = IERC20(asset.underlying).balanceOf(address(this));
    require(balance >= liquidity, InsufficientTransferred(liquidity.uncheckedSub(balance)));
    asset.liquidity = liquidity.toUint120();

    asset.updateDrawnRate(assetId);

    emit Restore(assetId, msg.sender, drawnShares, premiumDelta, drawnAmount, premiumAmount);

    return drawnShares;
  }

  /// @inheritdoc IHubBase
  function reportDeficit(
    uint256 assetId,
    uint256 drawnAmount,
    PremiumDelta calldata premiumDelta
  ) external returns (uint256, uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage spoke = _spokes[assetId][msg.sender];

    asset.accrue();
    _validateReportDeficit(asset, spoke, drawnAmount, premiumDelta.restoredPremiumRay);

    uint120 drawnShares = asset.toDrawnSharesDown(drawnAmount).toUint120();
    asset.drawnShares -= drawnShares;
    spoke.drawnShares -= drawnShares;
    _applyPremiumDelta(asset, spoke, premiumDelta);

    uint256 deficitAmountRay = uint256(drawnShares) * asset.drawnIndex +
      premiumDelta.restoredPremiumRay;
    asset.deficitRay += deficitAmountRay.toUint200();
    spoke.deficitRay += deficitAmountRay.toUint200();

    asset.updateDrawnRate(assetId);

    emit ReportDeficit(assetId, msg.sender, drawnShares, premiumDelta, deficitAmountRay);

    return (drawnShares, deficitAmountRay.fromRayUp());
  }

  /// @inheritdoc IHub
  function eliminateDeficit(
    uint256 assetId,
    uint256 amount,
    address spoke
  ) external restricted returns (uint256, uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage callerSpoke = _spokes[assetId][msg.sender];
    SpokeData storage coveredSpoke = _spokes[assetId][spoke];

    asset.accrue();
    uint256 deficitRay = coveredSpoke.deficitRay;
    uint256 deficitAmountRay = (amount < deficitRay.fromRayUp()) ? amount.toRay() : deficitRay;
    _validateEliminateDeficit(callerSpoke, deficitAmountRay);

    uint256 deficitToEliminate = deficitAmountRay.fromRayUp();
    uint120 shares = asset.toAddedSharesUp(deficitToEliminate).toUint120();
    asset.addedShares -= shares;
    callerSpoke.addedShares -= shares;
    asset.deficitRay -= deficitAmountRay.toUint200();
    coveredSpoke.deficitRay -= deficitAmountRay.toUint200();

    asset.updateDrawnRate(assetId);

    emit EliminateDeficit(assetId, msg.sender, spoke, shares, deficitAmountRay);

    return (shares, deficitToEliminate);
  }

  /// @inheritdoc IHubBase
  function refreshPremium(uint256 assetId, PremiumDelta calldata premiumDelta) external {
    Asset storage asset = _assets[assetId];
    SpokeData storage spoke = _spokes[assetId][msg.sender];

    asset.accrue();
    require(spoke.active, SpokeNotActive());
    // no premium change allowed
    require(premiumDelta.restoredPremiumRay == 0, InvalidPremiumChange());
    _applyPremiumDelta(asset, spoke, premiumDelta);
    asset.updateDrawnRate(assetId);

    emit RefreshPremium(assetId, msg.sender, premiumDelta);
  }

  /// @inheritdoc IHubBase
  function payFeeShares(uint256 assetId, uint256 shares) external {
    Asset storage asset = _assets[assetId];
    address feeReceiver = _assets[assetId].feeReceiver;
    SpokeData storage receiverSpoke = _spokes[assetId][feeReceiver];
    SpokeData storage callerSpoke = _spokes[assetId][msg.sender];

    asset.accrue();
    _validatePayFeeShares(callerSpoke, shares);
    _transferShares({sender: callerSpoke, receiver: receiverSpoke, shares: shares});
    asset.updateDrawnRate(assetId);

    emit TransferShares(assetId, msg.sender, feeReceiver, shares);
  }

  /// @inheritdoc IHub
  function transferShares(uint256 assetId, uint256 shares, address toSpoke) external {
    Asset storage asset = _assets[assetId];
    SpokeData storage callerSpoke = _spokes[assetId][msg.sender];
    SpokeData storage receiverSpoke = _spokes[assetId][toSpoke];

    asset.accrue();
    _validateTransferShares(asset, callerSpoke, receiverSpoke, shares);
    _transferShares({sender: callerSpoke, receiver: receiverSpoke, shares: shares});
    asset.updateDrawnRate(assetId);

    emit TransferShares(assetId, msg.sender, toSpoke, shares);
  }

  /// @inheritdoc IHub
  function sweep(uint256 assetId, uint256 amount) external {
    require(assetId < _assetCount, AssetNotListed());
    Asset storage asset = _assets[assetId];

    asset.accrue();
    _validateSweep(asset, msg.sender, amount);

    uint256 liquidity = asset.liquidity;
    require(amount <= liquidity, InsufficientLiquidity(liquidity));

    asset.liquidity = liquidity.uncheckedSub(amount).toUint120();
    asset.swept += amount.toUint120();

    asset.updateDrawnRate(assetId);

    IERC20(asset.underlying).safeTransfer(msg.sender, amount);

    emit Sweep(assetId, msg.sender, amount);
  }

  /// @inheritdoc IHub
  function reclaim(uint256 assetId, uint256 amount) external {
    require(assetId < _assetCount, AssetNotListed());
    Asset storage asset = _assets[assetId];

    asset.accrue();
    _validateReclaim(asset, msg.sender, amount);

    uint256 liquidity = asset.liquidity + amount;
    uint256 balance = IERC20(asset.underlying).balanceOf(address(this));
    require(balance >= liquidity, InsufficientTransferred(liquidity.uncheckedSub(balance)));
    asset.liquidity = liquidity.toUint120();
    asset.swept -= amount.toUint120();

    asset.updateDrawnRate(assetId);

    emit Reclaim(assetId, msg.sender, amount);
  }

  /// @inheritdoc IHub
  function isUnderlyingListed(address underlying) public view returns (bool) {
    return _assets[_underlyingToAssetId[underlying]].underlying == underlying;
  }

  /// @inheritdoc IHub
  function getAssetCount() external view returns (uint256) {
    return _assetCount;
  }

  /// @inheritdoc IHubBase
  function previewAddByAssets(uint256 assetId, uint256 assets) external view returns (uint256) {
    return _assets[assetId].toAddedSharesDown(assets);
  }

  /// @inheritdoc IHubBase
  function previewAddByShares(uint256 assetId, uint256 shares) external view returns (uint256) {
    return _assets[assetId].toAddedAssetsUp(shares);
  }

  /// @inheritdoc IHubBase
  function previewRemoveByAssets(uint256 assetId, uint256 assets) external view returns (uint256) {
    return _assets[assetId].toAddedSharesUp(assets);
  }

  /// @inheritdoc IHubBase
  function previewRemoveByShares(uint256 assetId, uint256 shares) external view returns (uint256) {
    return _assets[assetId].toAddedAssetsDown(shares);
  }

  /// @inheritdoc IHubBase
  function previewDrawByAssets(uint256 assetId, uint256 assets) external view returns (uint256) {
    return _assets[assetId].toDrawnSharesUp(assets);
  }

  /// @inheritdoc IHubBase
  function previewDrawByShares(uint256 assetId, uint256 shares) external view returns (uint256) {
    return _assets[assetId].toDrawnAssetsDown(shares);
  }

  /// @inheritdoc IHubBase
  function previewRestoreByAssets(uint256 assetId, uint256 assets) external view returns (uint256) {
    return _assets[assetId].toDrawnSharesDown(assets);
  }

  /// @inheritdoc IHubBase
  function previewRestoreByShares(uint256 assetId, uint256 shares) external view returns (uint256) {
    return _assets[assetId].toDrawnAssetsUp(shares);
  }

  /// @inheritdoc IHubBase
  function getAssetId(address underlying) external view returns (uint256) {
    require(isUnderlyingListed(underlying), AssetNotListed());
    return _underlyingToAssetId[underlying];
  }

  /// @inheritdoc IHubBase
  function getAssetUnderlyingAndDecimals(uint256 assetId) external view returns (address, uint8) {
    Asset storage asset = _assets[assetId];
    return (asset.underlying, asset.decimals);
  }

  /// @inheritdoc IHubBase
  function getAssetDrawnIndex(uint256 assetId) external view returns (uint256) {
    return _assets[assetId].getDrawnIndex();
  }

  /// @inheritdoc IHubBase
  function getAddedAssets(uint256 assetId) external view returns (uint256) {
    return _assets[assetId].totalAddedAssets();
  }

  /// @inheritdoc IHubBase
  function getAddedShares(uint256 assetId) external view returns (uint256) {
    return _assets[assetId].addedShares;
  }

  /// @inheritdoc IHubBase
  function getAssetOwed(uint256 assetId) external view returns (uint256, uint256) {
    Asset storage asset = _assets[assetId];
    uint256 drawnIndex = asset.getDrawnIndex();
    return (asset.drawn(drawnIndex), asset.premium(drawnIndex));
  }

  /// @inheritdoc IHubBase
  function getAssetTotalOwed(uint256 assetId) external view returns (uint256) {
    Asset storage asset = _assets[assetId];
    return asset.totalOwed(asset.getDrawnIndex());
  }

  /// @inheritdoc IHubBase
  function getAssetPremiumRay(uint256 assetId) external view returns (uint256) {
    Asset storage asset = _assets[assetId];
    return
      Premium.calculatePremiumRay({
        premiumShares: asset.premiumShares,
        premiumOffsetRay: asset.premiumOffsetRay,
        drawnIndex: asset.getDrawnIndex()
      });
  }

  /// @inheritdoc IHubBase
  function getAssetDrawnShares(uint256 assetId) external view returns (uint256) {
    return _assets[assetId].drawnShares;
  }

  /// @inheritdoc IHubBase
  function getAssetPremiumData(uint256 assetId) external view returns (uint256, int256) {
    Asset storage asset = _assets[assetId];
    return (asset.premiumShares, asset.premiumOffsetRay);
  }

  /// @inheritdoc IHubBase
  function getAssetLiquidity(uint256 assetId) external view returns (uint256) {
    return _assets[assetId].liquidity;
  }

  /// @inheritdoc IHubBase
  function getAssetDeficitRay(uint256 assetId) external view returns (uint256) {
    return _assets[assetId].deficitRay;
  }

  /// @inheritdoc IHub
  function getAsset(uint256 assetId) external view returns (Asset memory) {
    return _assets[assetId];
  }

  /// @inheritdoc IHub
  function getAssetConfig(uint256 assetId) external view returns (AssetConfig memory) {
    Asset storage asset = _assets[assetId];
    return
      AssetConfig({
        feeReceiver: asset.feeReceiver,
        liquidityFee: asset.liquidityFee,
        irStrategy: asset.irStrategy,
        reinvestmentController: asset.reinvestmentController
      });
  }

  /// @inheritdoc IHub
  function getAssetAccruedFees(uint256 assetId) external view returns (uint256) {
    Asset storage asset = _assets[assetId];
    return asset.realizedFees + asset.getUnrealizedFees(asset.getDrawnIndex());
  }

  /// @inheritdoc IHub
  function getAssetSwept(uint256 assetId) external view returns (uint256) {
    return _assets[assetId].swept;
  }

  /// @inheritdoc IHub
  function getAssetDrawnRate(uint256 assetId) external view returns (uint256) {
    Asset storage asset = _assets[assetId];
    return asset.getDrawnRate(assetId, asset.getDrawnIndex());
  }

  /// @inheritdoc IHub
  function getSpokeCount(uint256 assetId) external view returns (uint256) {
    return _assetToSpokes[assetId].length();
  }

  /// @inheritdoc IHubBase
  function getSpokeAddedAssets(uint256 assetId, address spoke) external view returns (uint256) {
    return _assets[assetId].toAddedAssetsDown(_spokes[assetId][spoke].addedShares);
  }

  /// @inheritdoc IHubBase
  function getSpokeAddedShares(uint256 assetId, address spoke) external view returns (uint256) {
    return _spokes[assetId][spoke].addedShares;
  }

  /// @inheritdoc IHubBase
  function getSpokeOwed(uint256 assetId, address spoke) external view returns (uint256, uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage spokeData = _spokes[assetId][spoke];
    return (_getSpokeDrawn(asset, spokeData), _getSpokePremium(asset, spokeData));
  }

  /// @inheritdoc IHubBase
  function getSpokeTotalOwed(uint256 assetId, address spoke) external view returns (uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage spokeData = _spokes[assetId][spoke];
    return _getSpokeDrawn(asset, spokeData) + _getSpokePremium(asset, spokeData);
  }

  /// @inheritdoc IHubBase
  function getSpokePremiumRay(uint256 assetId, address spoke) external view returns (uint256) {
    Asset storage asset = _assets[assetId];
    SpokeData storage spokeData = _spokes[assetId][spoke];
    return _getSpokePremiumRay(asset, spokeData);
  }

  /// @inheritdoc IHubBase
  function getSpokeDrawnShares(uint256 assetId, address spoke) external view returns (uint256) {
    return _spokes[assetId][spoke].drawnShares;
  }

  /// @inheritdoc IHubBase
  function getSpokePremiumData(
    uint256 assetId,
    address spoke
  ) external view returns (uint256, int256) {
    SpokeData storage spokeData = _spokes[assetId][spoke];
    return (spokeData.premiumShares, spokeData.premiumOffsetRay);
  }

  /// @inheritdoc IHubBase
  function getSpokeDeficitRay(uint256 assetId, address spoke) external view returns (uint256) {
    return _spokes[assetId][spoke].deficitRay;
  }

  /// @inheritdoc IHub
  function isSpokeListed(uint256 assetId, address spoke) external view returns (bool) {
    return _assetToSpokes[assetId].contains(spoke);
  }

  /// @inheritdoc IHub
  function getSpokeAddress(uint256 assetId, uint256 index) external view returns (address) {
    return _assetToSpokes[assetId].at(index);
  }

  /// @inheritdoc IHub
  function getSpoke(uint256 assetId, address spoke) external view returns (SpokeData memory) {
    return _spokes[assetId][spoke];
  }

  /// @inheritdoc IHub
  function getSpokeConfig(
    uint256 assetId,
    address spoke
  ) external view returns (SpokeConfig memory) {
    SpokeData storage spokeData = _spokes[assetId][spoke];
    return
      SpokeConfig({
        addCap: spokeData.addCap,
        drawCap: spokeData.drawCap,
        riskPremiumThreshold: spokeData.riskPremiumThreshold,
        active: spokeData.active,
        halted: spokeData.halted
      });
  }

  /// @notice Adds a new spoke to an asset with default feeReceiver configuration (maximum add cap, zero draw cap).
  function _addFeeReceiver(uint256 assetId, address feeReceiver) internal {
    _addSpoke(assetId, feeReceiver);
    _updateSpokeConfig(
      assetId,
      feeReceiver,
      SpokeConfig({
        addCap: MAX_ALLOWED_SPOKE_CAP,
        drawCap: 0,
        riskPremiumThreshold: 0,
        active: true,
        halted: false
      })
    );
  }

  /// @notice Adds a spoke to an asset.
  /// @dev Reverts with `SpokeAlreadyListed` if spoke is already listed for the given asset.
  function _addSpoke(uint256 assetId, address spoke) internal {
    require(_assetToSpokes[assetId].add(spoke), SpokeAlreadyListed());
    emit AddSpoke(assetId, spoke);
  }

  function _updateSpokeConfig(uint256 assetId, address spoke, SpokeConfig memory config) internal {
    SpokeData storage spokeData = _spokes[assetId][spoke];
    spokeData.addCap = config.addCap;
    spokeData.drawCap = config.drawCap;
    spokeData.riskPremiumThreshold = config.riskPremiumThreshold;
    spokeData.active = config.active;
    spokeData.halted = config.halted;
    emit UpdateSpokeConfig(assetId, spoke, config);
  }

  /// @dev Receiver `addCap` is validated in `_validateTransferShares`.
  function _transferShares(
    SpokeData storage sender,
    SpokeData storage receiver,
    uint256 shares
  ) internal {
    sender.addedShares -= shares.toUint120();
    receiver.addedShares += shares.toUint120();
  }

  /// @dev Applies premium deltas on asset & spoke premium owed.
  /// @dev Checks premium owed decreases by exactly `restoredPremiumRay`.
  /// @dev Checks updated risk premium is within allowed threshold.
  /// @dev Uses last stored index; asset accrual should have already occurred.
  function _applyPremiumDelta(
    Asset storage asset,
    SpokeData storage spoke,
    PremiumDelta calldata premiumDelta
  ) internal {
    uint256 drawnIndex = asset.drawnIndex;

    // asset premium change
    (asset.premiumShares, asset.premiumOffsetRay) = _validateApplyPremiumDelta(
      drawnIndex,
      asset.premiumShares,
      asset.premiumOffsetRay,
      premiumDelta
    );

    // spoke premium change
    (spoke.premiumShares, spoke.premiumOffsetRay) = _validateApplyPremiumDelta(
      drawnIndex,
      spoke.premiumShares,
      spoke.premiumOffsetRay,
      premiumDelta
    );

    uint24 riskPremiumThreshold = spoke.riskPremiumThreshold;
    require(
      riskPremiumThreshold == MAX_RISK_PREMIUM_THRESHOLD ||
        spoke.premiumShares <= spoke.drawnShares.percentMulUp(riskPremiumThreshold),
      InvalidPremiumChange()
    );
  }

  function _mintFeeShares(Asset storage asset, uint256 assetId) internal returns (uint256) {
    uint256 fees = asset.realizedFees;
    uint120 shares = asset.toAddedSharesDown(fees).toUint120();
    if (shares == 0) {
      return 0;
    }

    address feeReceiver = asset.feeReceiver;
    SpokeData storage feeReceiverSpoke = _spokes[assetId][feeReceiver];
    require(feeReceiverSpoke.active, SpokeNotActive());

    asset.addedShares += shares;
    feeReceiverSpoke.addedShares += shares;
    asset.realizedFees = 0;
    emit MintFeeShares(assetId, feeReceiver, shares, fees);

    return shares;
  }

  /// @dev Returns the Spoke's drawn amount for a specified asset.
  function _getSpokeDrawn(
    Asset storage asset,
    SpokeData storage spoke
  ) internal view returns (uint256) {
    return asset.toDrawnAssetsUp(spoke.drawnShares);
  }

  /// @dev Returns the Spoke's premium amount for a specified asset.
  function _getSpokePremium(
    Asset storage asset,
    SpokeData storage spoke
  ) internal view returns (uint256) {
    return _getSpokePremiumRay(asset, spoke).fromRayUp();
  }

  /// @dev Returns the Spoke's premium amount with full precision for a specified asset.
  function _getSpokePremiumRay(
    Asset storage asset,
    SpokeData storage spoke
  ) internal view returns (uint256) {
    return
      Premium.calculatePremiumRay({
        premiumShares: spoke.premiumShares,
        premiumOffsetRay: spoke.premiumOffsetRay,
        drawnIndex: asset.getDrawnIndex()
      });
  }

  /// @dev Spoke with maximum cap have unlimited add capacity.
  function _validateAdd(
    Asset storage asset,
    SpokeData storage spoke,
    uint256 amount
  ) internal view {
    require(amount > 0, InvalidAmount());
    require(spoke.active, SpokeNotActive());
    require(!spoke.halted, SpokeHalted());
    uint256 addCap = spoke.addCap;
    require(
      addCap == MAX_ALLOWED_SPOKE_CAP ||
        addCap * MathUtils.uncheckedExp(10, asset.decimals) >=
          asset.toAddedAssetsUp(spoke.addedShares) + amount,
      AddCapExceeded(addCap)
    );
  }

  function _validateRemove(SpokeData storage spoke, uint256 amount, address to) internal view {
    require(to != address(this), InvalidAddress());
    require(amount > 0, InvalidAmount());
    require(spoke.active, SpokeNotActive());
    require(!spoke.halted, SpokeHalted());
  }

  /// @dev The draw cap is enforced against the Spoke's total owed, including any reported deficit.
  /// @dev Spoke with maximum cap have unlimited draw capacity.
  function _validateDraw(
    Asset storage asset,
    SpokeData storage spoke,
    uint256 amount,
    address to
  ) internal view {
    require(to != address(this), InvalidAddress());
    require(amount > 0, InvalidAmount());
    require(spoke.active, SpokeNotActive());
    require(!spoke.halted, SpokeHalted());
    uint256 drawCap = spoke.drawCap;
    uint256 owed = _getSpokeDrawn(asset, spoke) + _getSpokePremium(asset, spoke);
    require(
      drawCap == MAX_ALLOWED_SPOKE_CAP ||
        drawCap * MathUtils.uncheckedExp(10, asset.decimals) >=
          owed + amount + uint256(spoke.deficitRay).fromRayUp(),
      DrawCapExceeded(drawCap)
    );
  }

  function _validateRestore(
    Asset storage asset,
    SpokeData storage spoke,
    uint256 drawnAmount,
    uint256 premiumAmountRay
  ) internal view {
    require(drawnAmount > 0 || premiumAmountRay > 0, InvalidAmount());
    require(spoke.active, SpokeNotActive());
    require(!spoke.halted, SpokeHalted());
    uint256 drawn = _getSpokeDrawn(asset, spoke);
    uint256 premiumRay = _getSpokePremiumRay(asset, spoke);
    require(drawnAmount <= drawn, SurplusDrawnRestored(drawn));
    require(premiumAmountRay <= premiumRay, SurplusPremiumRayRestored(premiumRay));
  }

  function _validateReportDeficit(
    Asset storage asset,
    SpokeData storage spoke,
    uint256 drawnAmount,
    uint256 premiumAmountRay
  ) internal view {
    require(drawnAmount > 0 || premiumAmountRay > 0, InvalidAmount());
    require(spoke.active, SpokeNotActive());
    uint256 drawn = _getSpokeDrawn(asset, spoke);
    uint256 premiumRay = _getSpokePremiumRay(asset, spoke);
    require(drawnAmount <= drawn, SurplusDrawnDeficitReported(drawn));
    require(premiumAmountRay <= premiumRay, SurplusPremiumRayDeficitReported(premiumRay));
  }

  function _validateEliminateDeficit(
    SpokeData storage callerSpoke,
    uint256 deficitAmountRay
  ) internal view {
    require(callerSpoke.active, SpokeNotActive());
    require(deficitAmountRay > 0, InvalidAmount());
  }

  function _validatePayFeeShares(SpokeData storage callerSpoke, uint256 feeShares) internal view {
    require(callerSpoke.active, SpokeNotActive());
    require(feeShares > 0, InvalidShares());
  }

  function _validateTransferShares(
    Asset storage asset,
    SpokeData storage callerSpoke,
    SpokeData storage receiverSpoke,
    uint256 shares
  ) internal view {
    require(callerSpoke.active && receiverSpoke.active, SpokeNotActive());
    require(!callerSpoke.halted && !receiverSpoke.halted, SpokeHalted());
    require(shares > 0, InvalidShares());
    uint256 addCap = receiverSpoke.addCap;
    require(
      addCap == MAX_ALLOWED_SPOKE_CAP ||
        addCap * MathUtils.uncheckedExp(10, asset.decimals) >=
          asset.toAddedAssetsUp(receiverSpoke.addedShares + shares),
      AddCapExceeded(addCap)
    );
  }

  function _validateSweep(Asset storage asset, address caller, uint256 amount) internal view {
    // sufficient check to disallow when controller unset
    require(caller == asset.reinvestmentController, OnlyReinvestmentController());
    require(amount > 0, InvalidAmount());
  }

  function _validateReclaim(Asset storage asset, address caller, uint256 amount) internal view {
    // sufficient check to disallow when controller unset
    require(caller == asset.reinvestmentController, OnlyReinvestmentController());
    require(amount > 0, InvalidAmount());
  }

  /// @dev Validates applied premium delta for given premium data and returns updated premium data.
  function _validateApplyPremiumDelta(
    uint256 drawnIndex,
    uint256 premiumShares,
    int256 premiumOffsetRay,
    PremiumDelta calldata premiumDelta
  ) internal pure returns (uint120, int200) {
    uint256 premiumRayBefore = Premium.calculatePremiumRay({
      premiumShares: premiumShares,
      premiumOffsetRay: premiumOffsetRay,
      drawnIndex: drawnIndex
    });

    uint256 newPremiumShares = premiumShares.add(premiumDelta.sharesDelta);
    int256 newPremiumOffsetRay = premiumOffsetRay + premiumDelta.offsetRayDelta;

    uint256 premiumRayAfter = Premium.calculatePremiumRay({
      premiumShares: newPremiumShares,
      premiumOffsetRay: newPremiumOffsetRay,
      drawnIndex: drawnIndex
    });

    require(
      premiumRayAfter + premiumDelta.restoredPremiumRay == premiumRayBefore,
      InvalidPremiumChange()
    );
    return (newPremiumShares.toUint120(), newPremiumOffsetRay.toInt200());
  }
}
