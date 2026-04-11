// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {IPriceFeed} from 'src/spoke/interfaces/IPriceFeed.sol';
import {ISpoke} from 'src/spoke/interfaces/ISpoke.sol';
import {IAaveOracle, IPriceOracle} from 'src/spoke/interfaces/IAaveOracle.sol';

/// @title AaveOracle
/// @author Aave Labs
/// @notice Provides reserve prices.
/// @dev Oracles are spoke-specific, due to the usage of reserve id as index of the `_sources` mapping.
contract AaveOracle is IAaveOracle {
  /// @dev The number of decimals for the oracle.
  uint8 private immutable DECIMALS;

  /// @dev The address of the deployer.
  address private immutable DEPLOYER;

  /// @inheritdoc IPriceOracle
  address public spoke;

  /// @dev Map of reserve identifiers to their price feed.
  mapping(uint256 reserveId => IPriceFeed) internal _sources;

  /// @dev Constructor.
  /// @dev `decimals` must match the Spoke's decimals for compatibility.
  /// @param decimals_ The number of decimals for the oracle.
  constructor(uint8 decimals_) {
    DEPLOYER = msg.sender;
    DECIMALS = decimals_;
  }

  /// @inheritdoc IAaveOracle
  function setSpoke(address spoke_) external {
    require(msg.sender == DEPLOYER, OnlyDeployer());
    require(spoke_ != address(0), InvalidAddress());
    require(spoke == address(0), SpokeAlreadySet());
    require(ISpoke(spoke_).ORACLE() == address(this), OracleMismatch());
    spoke = spoke_;
    emit SetSpoke(spoke_);
  }

  /// @inheritdoc IAaveOracle
  function setReserveSource(uint256 reserveId, address source) external {
    require(msg.sender == spoke, OnlySpoke());
    IPriceFeed targetSource = IPriceFeed(source);
    require(targetSource.decimals() == DECIMALS, InvalidSourceDecimals(reserveId));
    _sources[reserveId] = targetSource;
    _getSourcePrice(reserveId);
    emit UpdateReserveSource(reserveId, source);
  }

  /// @inheritdoc IPriceOracle
  function decimals() external view returns (uint8) {
    return DECIMALS;
  }

  /// @inheritdoc IPriceOracle
  function getReservePrice(uint256 reserveId) external view returns (uint256) {
    return _getSourcePrice(reserveId);
  }

  /// @inheritdoc IAaveOracle
  function getReservesPrices(
    uint256[] calldata reserveIds
  ) external view returns (uint256[] memory) {
    uint256[] memory prices = new uint256[](reserveIds.length);
    for (uint256 i = 0; i < reserveIds.length; ++i) {
      prices[i] = _getSourcePrice(reserveIds[i]);
    }
    return prices;
  }

  /// @inheritdoc IAaveOracle
  function getReserveSource(uint256 reserveId) external view returns (address) {
    return address(_sources[reserveId]);
  }

  /// @dev Price of zero will revert with `InvalidPrice`.
  function _getSourcePrice(uint256 reserveId) internal view returns (uint256) {
    IPriceFeed source = _sources[reserveId];
    require(address(source) != address(0), InvalidSource(reserveId));

    int256 price = source.latestAnswer();
    require(price > 0, InvalidPrice(reserveId));

    return uint256(price);
  }
}
