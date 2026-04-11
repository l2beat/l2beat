// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ConfiguratorInputTypes {
  struct InitReserveInput {
    address aTokenImpl;
    address variableDebtTokenImpl;
    address underlyingAsset;
    string aTokenName;
    string aTokenSymbol;
    string variableDebtTokenName;
    string variableDebtTokenSymbol;
    bytes params;
    bytes interestRateData;
  }

  struct UpdateATokenInput {
    address asset;
    string name;
    string symbol;
    address implementation;
    bytes params;
  }

  struct UpdateDebtTokenInput {
    address asset;
    string name;
    string symbol;
    address implementation;
    bytes params;
  }
}
