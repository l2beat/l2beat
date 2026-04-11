// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

/// @title ITreasurySpoke
/// @author Aave Labs
/// @notice Interface for the TreasurySpoke.
interface ITreasurySpoke {
  /// @notice Supplies a specified amount of the underlying asset to the specified Hub.
  /// @dev The Spoke pulls the underlying asset from the caller, so prior approval is required.
  /// @param hub The address of the Hub.
  /// @param underlying The address of the underlying asset.
  /// @param amount The amount of asset to supply.
  /// @return The amount of shares supplied.
  /// @return The amount of assets supplied.
  function supply(
    address hub,
    address underlying,
    uint256 amount
  ) external returns (uint256, uint256);

  /// @notice Supplies a specified amount of the underlying asset to the specified Hub.
  /// @dev The underlying asset must already be transferred to the Hub before calling.
  /// @param hub The address of the Hub.
  /// @param underlying The address of the underlying asset.
  /// @param amount The amount of asset to supply.
  /// @return The amount of shares supplied.
  /// @return The amount of assets supplied.
  function supplySkimmed(
    address hub,
    address underlying,
    uint256 amount
  ) external returns (uint256, uint256);

  /// @notice Withdraws a specified amount of underlying asset from the specified Hub.
  /// @dev Providing an amount greater than the maximum withdrawable value signals a full withdrawal.
  /// @param hub The address of the Hub.
  /// @param underlying The address of the underlying asset.
  /// @param amount The amount of asset to withdraw.
  /// @return The amount of shares withdrawn.
  /// @return The amount of assets withdrawn.
  function withdraw(
    address hub,
    address underlying,
    uint256 amount
  ) external returns (uint256, uint256);

  /// @notice Transfers a specified amount of ERC20 tokens from this contract.
  /// @param token The address of the ERC20 token to transfer.
  /// @param to The recipient address.
  /// @param amount The amount of tokens to transfer.
  function transfer(address token, address to, uint256 amount) external;

  /// @notice Returns the amount of assets supplied by this spoke.
  /// @param hub The address of the Hub.
  /// @param underlying The address of the underlying asset.
  /// @return The amount of assets supplied.
  function getSuppliedAssets(address hub, address underlying) external view returns (uint256);

  /// @notice Returns the amount of shares supplied by this spoke.
  /// @dev Shares are denominated relative to the supply side.
  /// @param hub The address of the Hub.
  /// @param underlying The address of the underlying asset.
  /// @return The amount of shares supplied.
  function getSuppliedShares(address hub, address underlying) external view returns (uint256);
}
