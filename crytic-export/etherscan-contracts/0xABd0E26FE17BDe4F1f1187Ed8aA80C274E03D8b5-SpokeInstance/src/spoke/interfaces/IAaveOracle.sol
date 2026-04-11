// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

import {IPriceOracle} from 'src/spoke/interfaces/IPriceOracle.sol';

/// @title IAaveOracle
/// @author Aave Labs
/// @notice Interface for the Aave Oracle.
interface IAaveOracle is IPriceOracle {
  /// @dev Emitted when the price feed source of a reserve is updated.
  /// @param reserveId The identifier of the reserve.
  /// @param source The price feed source of the reserve.
  event UpdateReserveSource(uint256 indexed reserveId, address indexed source);

  /// @dev Emitted when the Spoke is set.
  /// @param spoke The address of the Spoke.
  event SetSpoke(address indexed spoke);

  /// @dev Thrown when the caller is not the deployer.
  error OnlyDeployer();

  /// @dev Thrown when the Spoke is already set.
  error SpokeAlreadySet();

  /// @dev Thrown when the price feed source uses a different number of decimals than the oracle.
  /// @param reserveId The identifier of the reserve.
  error InvalidSourceDecimals(uint256 reserveId);

  /// @dev Thrown when the price feed source is invalid (zero address).
  /// @param reserveId The identifier of the reserve.
  error InvalidSource(uint256 reserveId);

  /// @dev Thrown when the price feed source returns an invalid price (non-positive).
  /// @param reserveId The identifier of the reserve.
  error InvalidPrice(uint256 reserveId);

  /// @dev Thrown when the given address is invalid.
  error InvalidAddress();

  /// @dev Thrown when the Spoke's oracle does not match the current oracle.
  error OracleMismatch();

  /// @notice Sets the address of the Spoke.
  /// @dev Can only be called once by the deployer.
  /// @dev The spoke should be set before any other function is called.
  /// @param spoke The address of the Spoke.
  function setSpoke(address spoke) external;

  /// @notice Sets the price feed source of a reserve.
  /// @dev Must be called by the Spoke.
  /// @dev The source must implement IPriceFeed.
  /// @param reserveId The identifier of the reserve.
  /// @param source The price feed source of the reserve.
  function setReserveSource(uint256 reserveId, address source) external;

  /// @notice Returns the prices of multiple reserves.
  /// @dev Reverts if the price of one of the reserves is not greater than 0.
  /// @param reserveIds The identifiers of the reserves.
  /// @return prices The prices of the reserves.
  function getReservesPrices(
    uint256[] calldata reserveIds
  ) external view returns (uint256[] memory);

  /// @notice Returns the price feed source of a reserve.
  /// @param reserveId The identifier of the reserve.
  /// @return source The price feed source of the reserve.
  function getReserveSource(uint256 reserveId) external view returns (address);
}
