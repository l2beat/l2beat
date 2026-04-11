// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library DataTypes {
  /**
   * This exists specifically to maintain the `getReserveData()` interface, since the new, internal
   * `ReserveData` struct includes the reserve's `virtualUnderlyingBalance`.
   */
  struct ReserveDataLegacy {
    //stores the reserve configuration
    ReserveConfigurationMap configuration;
    //the liquidity index. Expressed in ray
    uint128 liquidityIndex;
    //the current supply rate. Expressed in ray
    uint128 currentLiquidityRate;
    //variable borrow index. Expressed in ray
    uint128 variableBorrowIndex;
    //the current variable borrow rate. Expressed in ray
    uint128 currentVariableBorrowRate;
    // DEPRECATED on v3.2.0
    uint128 currentStableBorrowRate;
    //timestamp of last update
    uint40 lastUpdateTimestamp;
    //the id of the reserve. Represents the position in the list of the active reserves
    uint16 id;
    //aToken address
    address aTokenAddress;
    // DEPRECATED on v3.2.0
    address stableDebtTokenAddress;
    //variableDebtToken address
    address variableDebtTokenAddress;
    // DEPRECATED on v3.4.0, should use the `RESERVE_INTEREST_RATE_STRATEGY` variable from the Pool contract
    address interestRateStrategyAddress;
    //the current treasury balance, scaled
    uint128 accruedToTreasury;
    // DEPRECATED on v3.4.0
    uint128 unbacked;
    //the outstanding debt borrowed against this asset in isolation mode
    uint128 isolationModeTotalDebt;
  }

  struct ReserveData {
    //stores the reserve configuration
    ReserveConfigurationMap configuration;
    //the liquidity index. Expressed in ray
    uint128 liquidityIndex;
    //the current supply rate. Expressed in ray
    uint128 currentLiquidityRate;
    //variable borrow index. Expressed in ray
    uint128 variableBorrowIndex;
    //the current variable borrow rate. Expressed in ray
    uint128 currentVariableBorrowRate;
    /// @notice reused `__deprecatedStableBorrowRate` storage from pre 3.2
    // the current accumulate deficit in underlying tokens
    uint128 deficit;
    //timestamp of last update
    uint40 lastUpdateTimestamp;
    //the id of the reserve. Represents the position in the list of the active reserves
    uint16 id;
    //timestamp until when liquidations are not allowed on the reserve, if set to past liquidations will be allowed
    uint40 liquidationGracePeriodUntil;
    //aToken address
    address aTokenAddress;
    // DEPRECATED on v3.2.0
    address __deprecatedStableDebtTokenAddress;
    //variableDebtToken address
    address variableDebtTokenAddress;
    // DEPRECATED on v3.4.0, should use the `RESERVE_INTEREST_RATE_STRATEGY` variable from the Pool contract
    address __deprecatedInterestRateStrategyAddress;
    //the current treasury balance, scaled
    uint128 accruedToTreasury;
    // In aave 3.3.0 this storage slot contained the `unbacked`
    uint128 virtualUnderlyingBalance;
    //the outstanding debt borrowed against this asset in isolation mode
    uint128 isolationModeTotalDebt;
    //the amount of underlying accounted for by the protocol
    // DEPRECATED on v3.4.0. Moved into the same slot as accruedToTreasury for optimized storage access.
    uint128 __deprecatedVirtualUnderlyingBalance;
  }

  struct ReserveConfigurationMap {
    //bit 0-15: LTV
    //bit 16-31: Liq. threshold
    //bit 32-47: Liq. bonus
    //bit 48-55: Decimals
    //bit 56: reserve is active
    //bit 57: reserve is frozen
    //bit 58: borrowing is enabled
    //bit 59: DEPRECATED: stable rate borrowing enabled
    //bit 60: asset is paused
    //bit 61: borrowing in isolation mode is enabled
    //bit 62: siloed borrowing enabled
    //bit 63: flashloaning enabled
    //bit 64-79: reserve factor
    //bit 80-115: borrow cap in whole tokens, borrowCap == 0 => no cap
    //bit 116-151: supply cap in whole tokens, supplyCap == 0 => no cap
    //bit 152-167: liquidation protocol fee
    //bit 168-175: DEPRECATED: eMode category
    //bit 176-211: DEPRECATED: unbacked mint cap
    //bit 212-251: debt ceiling for isolation mode with (ReserveConfiguration::DEBT_CEILING_DECIMALS) decimals
    //bit 252: DEPRECATED: virtual accounting is enabled for the reserve
    //bit 253-255 unused

    uint256 data;
  }

  struct UserConfigurationMap {
    /**
     * @dev Bitmap of the users collaterals and borrows. It is divided in pairs of bits, one pair per asset.
     * The first bit indicates if an asset is used as collateral by the user, the second whether an
     * asset is borrowed by the user.
     */
    uint256 data;
  }

  // DEPRECATED: kept for backwards compatibility, might be removed in a future version
  struct EModeCategoryLegacy {
    // each eMode category has a custom ltv and liquidation threshold
    uint16 ltv;
    uint16 liquidationThreshold;
    uint16 liquidationBonus;
    // DEPRECATED
    address priceSource;
    string label;
  }

  struct CollateralConfig {
    uint16 ltv;
    uint16 liquidationThreshold;
    uint16 liquidationBonus;
  }

  struct EModeCategoryBaseConfiguration {
    uint16 ltv;
    uint16 liquidationThreshold;
    uint16 liquidationBonus;
    string label;
  }

  struct EModeCategory {
    // each eMode category has a custom ltv and liquidation threshold
    uint16 ltv;
    uint16 liquidationThreshold;
    uint16 liquidationBonus;
    uint128 collateralBitmap;
    string label;
    uint128 borrowableBitmap;
    uint128 ltvzeroBitmap; // if true, the asset will be treated as ltv0 and ltv0 rules apply
  }

  enum InterestRateMode {
    NONE,
    __DEPRECATED,
    VARIABLE
  }

  struct ReserveCache {
    uint256 currScaledVariableDebt;
    uint256 nextScaledVariableDebt;
    uint256 currLiquidityIndex;
    uint256 nextLiquidityIndex;
    uint256 currVariableBorrowIndex;
    uint256 nextVariableBorrowIndex;
    uint256 currLiquidityRate;
    uint256 currVariableBorrowRate;
    uint256 reserveFactor;
    ReserveConfigurationMap reserveConfiguration;
    address aTokenAddress;
    address variableDebtTokenAddress;
    uint40 reserveLastUpdateTimestamp;
  }

  struct ExecuteLiquidationCallParams {
    address liquidator;
    uint256 debtToCover;
    address collateralAsset;
    address debtAsset;
    address borrower;
    bool receiveAToken;
    address priceOracle;
    uint8 borrowerEModeCategory;
    address priceOracleSentinel;
    address interestRateStrategyAddress;
  }

  struct ExecuteSupplyParams {
    address user;
    address asset;
    address interestRateStrategyAddress;
    uint256 amount;
    address onBehalfOf;
    uint16 referralCode;
    uint8 supplierEModeCategory;
  }

  struct ExecuteBorrowParams {
    address asset;
    address user;
    address onBehalfOf;
    address interestRateStrategyAddress;
    uint256 amount;
    InterestRateMode interestRateMode;
    uint16 referralCode;
    bool releaseUnderlying;
    address oracle;
    uint8 userEModeCategory;
    address priceOracleSentinel;
  }

  struct ExecuteRepayParams {
    address asset;
    address user;
    address interestRateStrategyAddress;
    uint256 amount;
    InterestRateMode interestRateMode;
    address onBehalfOf;
    bool useATokens;
    address oracle;
    uint8 userEModeCategory;
  }

  struct ExecuteWithdrawParams {
    address user;
    address asset;
    address interestRateStrategyAddress;
    uint256 amount;
    address to;
    address oracle;
    uint8 userEModeCategory;
  }

  struct ExecuteEliminateDeficitParams {
    address user;
    address asset;
    address interestRateStrategyAddress;
    uint256 amount;
  }

  struct FinalizeTransferParams {
    address asset;
    address from;
    address to;
    uint256 scaledAmount;
    uint256 scaledBalanceFromBefore;
    address oracle;
    uint8 fromEModeCategory;
  }

  struct FlashloanParams {
    address user;
    address receiverAddress;
    address[] assets;
    uint256[] amounts;
    uint256[] interestRateModes;
    address interestRateStrategyAddress;
    address onBehalfOf;
    bytes params;
    uint16 referralCode;
    uint256 flashLoanPremium;
    address addressesProvider;
    address pool;
    uint8 userEModeCategory;
    bool isAuthorizedFlashBorrower;
  }

  struct FlashloanSimpleParams {
    address user;
    address receiverAddress;
    address asset;
    address interestRateStrategyAddress;
    uint256 amount;
    bytes params;
    uint16 referralCode;
    uint256 flashLoanPremium;
  }

  struct FlashLoanRepaymentParams {
    address user;
    uint256 amount;
    uint256 totalPremium;
    address asset;
    address interestRateStrategyAddress;
    address receiverAddress;
    uint16 referralCode;
  }

  struct CalculateUserAccountDataParams {
    UserConfigurationMap userConfig;
    address user;
    address oracle;
    uint8 userEModeCategory;
  }

  struct ValidateBorrowParams {
    ReserveCache reserveCache;
    UserConfigurationMap userConfig;
    address asset;
    address userAddress;
    uint256 amountScaled;
    InterestRateMode interestRateMode;
    address oracle;
    uint8 userEModeCategory;
    address priceOracleSentinel;
  }

  struct ValidateLiquidationCallParams {
    ReserveCache debtReserveCache;
    uint256 totalDebt;
    uint256 healthFactor;
    address priceOracleSentinel;
    address borrower;
    address liquidator;
  }

  struct CalculateInterestRatesParams {
    uint256 unbacked;
    uint256 liquidityAdded;
    uint256 liquidityTaken;
    uint256 totalDebt;
    uint256 reserveFactor;
    address reserve;
    // @notice DEPRECATED in 3.4, but kept for backwards compatibility
    bool usingVirtualBalance;
    uint256 virtualUnderlyingBalance;
  }

  struct InitReserveParams {
    address asset;
    address aTokenAddress;
    address variableDebtAddress;
    uint16 reservesCount;
    uint16 maxNumberReserves;
  }
}
