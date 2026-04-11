// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import {DataTypes} from 'aave-v3-origin/contracts/protocol/libraries/types/DataTypes.sol';
import {Errors} from 'aave-v3-origin/contracts/protocol/libraries/helpers/Errors.sol';
import {ConfiguratorInputTypes} from 'aave-v3-origin/contracts/protocol/libraries/types/ConfiguratorInputTypes.sol';
import {IPoolAddressesProvider} from 'aave-v3-origin/contracts/interfaces/IPoolAddressesProvider.sol';
import {IAToken} from 'aave-v3-origin/contracts/interfaces/IAToken.sol';
import {IPool} from 'aave-v3-origin/contracts/interfaces/IPool.sol';
import {IPoolConfigurator} from 'aave-v3-origin/contracts/interfaces/IPoolConfigurator.sol';
import {IPriceOracleGetter} from 'aave-v3-origin/contracts/interfaces/IPriceOracleGetter.sol';
import {IAaveOracle} from 'aave-v3-origin/contracts/interfaces/IAaveOracle.sol';
import {IACLManager as BasicIACLManager} from 'aave-v3-origin/contracts/interfaces/IACLManager.sol';
import {IPoolDataProvider} from 'aave-v3-origin/contracts/interfaces/IPoolDataProvider.sol';
import {IDefaultInterestRateStrategyV2} from 'aave-v3-origin/contracts/interfaces/IDefaultInterestRateStrategyV2.sol';
import {IReserveInterestRateStrategy} from 'aave-v3-origin/contracts/interfaces/IReserveInterestRateStrategy.sol';
import {IPoolDataProvider as IAaveProtocolDataProvider} from 'aave-v3-origin/contracts/interfaces/IPoolDataProvider.sol';
import {AggregatorInterface} from 'aave-v3-origin/contracts/dependencies/chainlink/AggregatorInterface.sol';
import {ICollector} from 'aave-v3-origin/contracts/treasury/ICollector.sol';

interface IACLManager is BasicIACLManager {
  function hasRole(bytes32 role, address account) external view returns (bool);

  function DEFAULT_ADMIN_ROLE() external pure returns (bytes32);

  function renounceRole(bytes32 role, address account) external;

  function getRoleAdmin(bytes32 role) external view returns (bytes32);

  function grantRole(bytes32 role, address account) external;

  function revokeRole(bytes32 role, address account) external;
}
