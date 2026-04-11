// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {IERC20Metadata} from 'src/dependencies/openzeppelin/IERC20Metadata.sol';
import {AccessManaged} from 'src/dependencies/openzeppelin/AccessManaged.sol';
import {SafeCast} from 'src/dependencies/openzeppelin/SafeCast.sol';
import {IHub} from 'src/hub/interfaces/IHub.sol';
import {IHubConfigurator} from 'src/hub/interfaces/IHubConfigurator.sol';

/// @title HubConfigurator
/// @author Aave Labs
/// @notice Handles administrative functions on the Hub.
/// @dev Must be granted permission by the Hub.
contract HubConfigurator is AccessManaged, IHubConfigurator {
  using SafeCast for uint256;

  /// @dev Constructor.
  /// @param authority_ The address of the authority contract which manages permissions.
  constructor(address authority_) AccessManaged(authority_) {
    require(authority_ != address(0), InvalidAddress());
  }

  /// @inheritdoc IHubConfigurator
  function addAsset(
    address hub,
    address underlying,
    address feeReceiver,
    uint256 liquidityFee,
    address irStrategy,
    bytes calldata irData
  ) external restricted returns (uint256) {
    IHub targetHub = IHub(hub);
    uint256 assetId = targetHub.addAsset(
      underlying,
      IERC20Metadata(underlying).decimals(),
      feeReceiver,
      irStrategy,
      irData
    );
    _updateLiquidityFee(targetHub, assetId, liquidityFee);
    return assetId;
  }

  /// @inheritdoc IHubConfigurator
  function addAssetWithDecimals(
    address hub,
    address underlying,
    uint8 decimals,
    address feeReceiver,
    uint256 liquidityFee,
    address irStrategy,
    bytes calldata irData
  ) external restricted returns (uint256) {
    IHub targetHub = IHub(hub);
    uint256 assetId = targetHub.addAsset(underlying, decimals, feeReceiver, irStrategy, irData);
    _updateLiquidityFee(targetHub, assetId, liquidityFee);
    return assetId;
  }

  /// @inheritdoc IHubConfigurator
  function updateLiquidityFee(
    address hub,
    uint256 assetId,
    uint256 liquidityFee
  ) external restricted {
    _updateLiquidityFee(IHub(hub), assetId, liquidityFee);
  }

  /// @inheritdoc IHubConfigurator
  function updateFeeReceiver(
    address hub,
    uint256 assetId,
    address feeReceiver
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.AssetConfig memory config = targetHub.getAssetConfig(assetId);
    config.feeReceiver = feeReceiver;
    targetHub.updateAssetConfig(assetId, config, new bytes(0));
  }

  /// @inheritdoc IHubConfigurator
  function updateFeeConfig(
    address hub,
    uint256 assetId,
    uint256 liquidityFee,
    address feeReceiver
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.AssetConfig memory config = targetHub.getAssetConfig(assetId);
    config.liquidityFee = liquidityFee.toUint16();
    config.feeReceiver = feeReceiver;
    targetHub.updateAssetConfig(assetId, config, new bytes(0));
  }

  /// @inheritdoc IHubConfigurator
  function updateInterestRateStrategy(
    address hub,
    uint256 assetId,
    address irStrategy,
    bytes calldata irData
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.AssetConfig memory config = targetHub.getAssetConfig(assetId);
    config.irStrategy = irStrategy;
    targetHub.updateAssetConfig(assetId, config, irData);
  }

  /// @inheritdoc IHubConfigurator
  function updateReinvestmentController(
    address hub,
    uint256 assetId,
    address reinvestmentController
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.AssetConfig memory config = targetHub.getAssetConfig(assetId);
    config.reinvestmentController = reinvestmentController;
    targetHub.updateAssetConfig(assetId, config, new bytes(0));
  }

  /// @inheritdoc IHubConfigurator
  function resetAssetCaps(address hub, uint256 assetId) external restricted {
    IHub targetHub = IHub(hub);
    uint256 spokesCount = targetHub.getSpokeCount(assetId);

    for (uint256 i = 0; i < spokesCount; ++i) {
      address spoke = targetHub.getSpokeAddress(assetId, i);
      IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
      config.addCap = 0;
      config.drawCap = 0;
      targetHub.updateSpokeConfig(assetId, spoke, config);
    }
  }

  /// @inheritdoc IHubConfigurator
  function deactivateAsset(address hub, uint256 assetId) external restricted {
    IHub targetHub = IHub(hub);
    uint256 spokesCount = targetHub.getSpokeCount(assetId);
    for (uint256 i = 0; i < spokesCount; ++i) {
      address spoke = targetHub.getSpokeAddress(assetId, i);
      IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
      config.active = false;
      targetHub.updateSpokeConfig(assetId, spoke, config);
    }
  }

  /// @inheritdoc IHubConfigurator
  function haltAsset(address hub, uint256 assetId) external restricted {
    IHub targetHub = IHub(hub);
    uint256 spokesCount = targetHub.getSpokeCount(assetId);
    for (uint256 i = 0; i < spokesCount; ++i) {
      address spoke = targetHub.getSpokeAddress(assetId, i);
      IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
      config.halted = true;
      targetHub.updateSpokeConfig(assetId, spoke, config);
    }
  }

  /// @inheritdoc IHubConfigurator
  function addSpoke(
    address hub,
    address spoke,
    uint256 assetId,
    IHub.SpokeConfig calldata config
  ) external restricted {
    IHub(hub).addSpoke(assetId, spoke, config);
  }

  /// @inheritdoc IHubConfigurator
  function addSpokeToAssets(
    address hub,
    address spoke,
    uint256[] calldata assetIds,
    IHub.SpokeConfig[] calldata configs
  ) external restricted {
    uint256 assetCount = assetIds.length;
    require(assetCount == configs.length, MismatchedConfigs());
    for (uint256 i = 0; i < assetCount; ++i) {
      IHub(hub).addSpoke(assetIds[i], spoke, configs[i]);
    }
  }

  /// @inheritdoc IHubConfigurator
  function updateSpokeActive(
    address hub,
    uint256 assetId,
    address spoke,
    bool active
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
    config.active = active;
    targetHub.updateSpokeConfig(assetId, spoke, config);
  }

  /// @inheritdoc IHubConfigurator
  function updateSpokeHalted(
    address hub,
    uint256 assetId,
    address spoke,
    bool halted
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
    config.halted = halted;
    targetHub.updateSpokeConfig(assetId, spoke, config);
  }

  /// @inheritdoc IHubConfigurator
  function updateSpokeAddCap(
    address hub,
    uint256 assetId,
    address spoke,
    uint256 addCap
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
    config.addCap = addCap.toUint40();
    targetHub.updateSpokeConfig(assetId, spoke, config);
  }

  /// @inheritdoc IHubConfigurator
  function updateSpokeDrawCap(
    address hub,
    uint256 assetId,
    address spoke,
    uint256 drawCap
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
    config.drawCap = drawCap.toUint40();
    targetHub.updateSpokeConfig(assetId, spoke, config);
  }

  /// @inheritdoc IHubConfigurator
  function updateSpokeRiskPremiumThreshold(
    address hub,
    uint256 assetId,
    address spoke,
    uint256 riskPremiumThreshold
  ) external restricted {
    IHub targetHub = IHub(hub);
    IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
    config.riskPremiumThreshold = riskPremiumThreshold.toUint24();
    targetHub.updateSpokeConfig(assetId, spoke, config);
  }

  /// @inheritdoc IHubConfigurator
  function updateSpokeCaps(
    address hub,
    uint256 assetId,
    address spoke,
    uint256 addCap,
    uint256 drawCap
  ) external restricted {
    _updateSpokeCaps(IHub(hub), assetId, spoke, addCap, drawCap);
  }

  /// @inheritdoc IHubConfigurator
  function deactivateSpoke(address hub, address spoke) external restricted {
    IHub targetHub = IHub(hub);
    uint256 assetCount = targetHub.getAssetCount();
    for (uint256 assetId = 0; assetId < assetCount; ++assetId) {
      if (targetHub.isSpokeListed(assetId, spoke)) {
        IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
        config.active = false;
        targetHub.updateSpokeConfig(assetId, spoke, config);
      }
    }
  }

  /// @inheritdoc IHubConfigurator
  function haltSpoke(address hub, address spoke) external restricted {
    IHub targetHub = IHub(hub);
    uint256 assetCount = targetHub.getAssetCount();
    for (uint256 assetId = 0; assetId < assetCount; ++assetId) {
      if (targetHub.isSpokeListed(assetId, spoke)) {
        IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
        config.halted = true;
        targetHub.updateSpokeConfig(assetId, spoke, config);
      }
    }
  }

  /// @inheritdoc IHubConfigurator
  function resetSpokeCaps(address hub, address spoke) external restricted {
    IHub targetHub = IHub(hub);
    uint256 assetCount = targetHub.getAssetCount();
    for (uint256 assetId = 0; assetId < assetCount; ++assetId) {
      if (targetHub.isSpokeListed(assetId, spoke)) {
        IHub.SpokeConfig memory config = targetHub.getSpokeConfig(assetId, spoke);
        config.addCap = 0;
        config.drawCap = 0;
        targetHub.updateSpokeConfig(assetId, spoke, config);
      }
    }
  }

  /// @inheritdoc IHubConfigurator
  function updateInterestRateData(
    address hub,
    uint256 assetId,
    bytes calldata irData
  ) external restricted {
    IHub(hub).setInterestRateData(assetId, irData);
  }

  /// @dev Updates spoke caps without changing the active flag.
  function _updateSpokeCaps(
    IHub hub,
    uint256 assetId,
    address spoke,
    uint256 addCap,
    uint256 drawCap
  ) internal {
    IHub.SpokeConfig memory config = hub.getSpokeConfig(assetId, spoke);
    config.addCap = addCap.toUint40();
    config.drawCap = drawCap.toUint40();
    hub.updateSpokeConfig(assetId, spoke, config);
  }

  function _updateLiquidityFee(IHub hub, uint256 assetId, uint256 liquidityFee) internal {
    IHub.AssetConfig memory config = hub.getAssetConfig(assetId);
    config.liquidityFee = liquidityFee.toUint16();
    hub.updateAssetConfig(assetId, config, new bytes(0));
  }
}
