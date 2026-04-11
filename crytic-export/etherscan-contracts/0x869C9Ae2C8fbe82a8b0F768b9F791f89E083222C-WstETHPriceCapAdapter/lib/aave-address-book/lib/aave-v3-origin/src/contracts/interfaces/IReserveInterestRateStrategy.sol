// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {DataTypes} from '../protocol/libraries/types/DataTypes.sol';

/**
 * @title IReserveInterestRateStrategy
 * @author BGD Labs
 * @notice Basic interface for any rate strategy used by the Aave protocol
 */
interface IReserveInterestRateStrategy {
  /**
   * @notice Sets interest rate data for an Aave rate strategy
   * @param reserve The reserve to update
   * @param rateData The abi encoded reserve interest rate data to apply to the given reserve
   *   Abstracted this way as rate strategies can be custom
   */
  function setInterestRateParams(address reserve, bytes calldata rateData) external;

  /**
   * @notice Calculates the interest rates depending on the reserve's state and configurations
   * @param params The parameters needed to calculate interest rates
   * @return liquidityRate The liquidity rate expressed in ray
   * @return variableBorrowRate The variable borrow rate expressed in ray
   */
  function calculateInterestRates(
    DataTypes.CalculateInterestRatesParams memory params
  ) external view returns (uint256, uint256);
}
