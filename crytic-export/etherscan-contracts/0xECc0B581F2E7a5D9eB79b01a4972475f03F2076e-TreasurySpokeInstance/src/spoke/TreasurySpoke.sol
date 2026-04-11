// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {Ownable2StepUpgradeable} from 'src/dependencies/openzeppelin-upgradeable/Ownable2StepUpgradeable.sol';
import {SafeERC20, IERC20} from 'src/dependencies/openzeppelin/SafeERC20.sol';
import {MathUtils} from 'src/libraries/math/MathUtils.sol';
import {IHubBase} from 'src/hub/interfaces/IHubBase.sol';
import {ITreasurySpoke} from 'src/spoke/interfaces/ITreasurySpoke.sol';

/// @title TreasurySpoke
/// @author Aave Labs
/// @notice Spoke contract used as a treasury where accumulated fees are treated as supplied assets.
/// @dev Dedicated to a single user, controlled exclusively by the owner.
/// @dev Allows withdraw to claim fees and supply to invest back into any Hub asset.
abstract contract TreasurySpoke is ITreasurySpoke, Ownable2StepUpgradeable {
  using SafeERC20 for IERC20;

  /// @dev To be overridden by the inheriting TreasurySpoke instance contract.
  function initialize(address owner) external virtual;

  /// @inheritdoc ITreasurySpoke
  function supply(
    address hub,
    address underlying,
    uint256 amount
  ) external onlyOwner returns (uint256, uint256) {
    return _supply({hub: hub, underlying: underlying, amount: amount, skim: false});
  }

  /// @inheritdoc ITreasurySpoke
  function supplySkimmed(
    address hub,
    address underlying,
    uint256 amount
  ) external onlyOwner returns (uint256, uint256) {
    return _supply({hub: hub, underlying: underlying, amount: amount, skim: true});
  }

  /// @inheritdoc ITreasurySpoke
  function withdraw(
    address hub,
    address underlying,
    uint256 amount
  ) external onlyOwner returns (uint256, uint256) {
    IHubBase targetHub = IHubBase(hub);
    uint256 assetId = targetHub.getAssetId(underlying);
    // if amount to withdraw is greater than total supplied, withdraw all supplied assets
    uint256 withdrawnAmount = MathUtils.min(
      amount,
      targetHub.getSpokeAddedAssets(assetId, address(this))
    );
    uint256 withdrawnShares = targetHub.remove(assetId, withdrawnAmount, msg.sender);

    return (withdrawnShares, withdrawnAmount);
  }

  /// @inheritdoc ITreasurySpoke
  function transfer(address token, address to, uint256 amount) external onlyOwner {
    IERC20(token).safeTransfer(to, amount);
  }

  /// @inheritdoc ITreasurySpoke
  function getSuppliedAssets(address hub, address underlying) external view returns (uint256) {
    IHubBase targetHub = IHubBase(hub);
    uint256 assetId = targetHub.getAssetId(underlying);
    return targetHub.getSpokeAddedAssets(assetId, address(this));
  }

  /// @inheritdoc ITreasurySpoke
  function getSuppliedShares(address hub, address underlying) external view returns (uint256) {
    IHubBase targetHub = IHubBase(hub);
    uint256 assetId = targetHub.getAssetId(underlying);
    return targetHub.getSpokeAddedShares(assetId, address(this));
  }

  /// @dev Common Supply workflow. When `skim` is true, it avoids pulling tokens from the caller and intends
  /// to skim or claim existing untracked liquidity on the `hub`.
  function _supply(
    address hub,
    address underlying,
    uint256 amount,
    bool skim
  ) internal returns (uint256, uint256) {
    IHubBase targetHub = IHubBase(hub);
    uint256 assetId = targetHub.getAssetId(underlying);

    if (!skim) {
      IERC20(underlying).safeTransferFrom(msg.sender, hub, amount);
    }
    uint256 shares = targetHub.add(assetId, amount);

    return (shares, amount);
  }
}
