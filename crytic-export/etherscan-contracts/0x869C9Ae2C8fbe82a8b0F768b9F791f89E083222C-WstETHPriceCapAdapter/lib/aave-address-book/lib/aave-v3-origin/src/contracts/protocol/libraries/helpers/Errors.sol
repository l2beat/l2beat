// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Errors library
 * @author Aave
 * @notice Defines the error messages emitted by the different contracts of the Aave protocol
 */
library Errors {
  error CallerNotPoolAdmin(); // 'The caller of the function is not a pool admin'
  error CallerNotPoolOrEmergencyAdmin(); // 'The caller of the function is not a pool or emergency admin'
  error CallerNotRiskOrPoolAdmin(); // 'The caller of the function is not a risk or pool admin'
  error CallerNotAssetListingOrPoolAdmin(); // 'The caller of the function is not an asset listing or pool admin'
  error AddressesProviderNotRegistered(); // 'Pool addresses provider is not registered'
  error InvalidAddressesProviderId(); // 'Invalid id for the pool addresses provider'
  error NotContract(); // 'Address is not a contract'
  error CallerNotPoolConfigurator(); // 'The caller of the function is not the pool configurator'
  error CallerNotAToken(); // 'The caller of the function is not an AToken'
  error InvalidAddressesProvider(); // 'The address of the pool addresses provider is invalid'
  error InvalidFlashloanExecutorReturn(); // 'Invalid return value of the flashloan executor function'
  error ReserveAlreadyAdded(); // 'Reserve has already been added to reserve list'
  error NoMoreReservesAllowed(); // 'Maximum amount of reserves in the pool reached'
  error EModeCategoryReserved(); // 'Zero eMode category is reserved for volatile heterogeneous assets'
  error ReserveLiquidityNotZero(); // 'The liquidity of the reserve needs to be 0'
  error FlashloanPremiumInvalid(); // 'Invalid flashloan premium'
  error InvalidReserveParams(); // 'Invalid risk parameters for the reserve'
  error InvalidEmodeCategoryParams(); // 'Invalid risk parameters for the eMode category'
  error CallerMustBePool(); // 'The caller of this function must be a pool'
  error InvalidMintAmount(); // 'Invalid amount to mint'
  error InvalidBurnAmount(); // 'Invalid amount to burn'
  error InvalidAmount(); // 'Amount must be greater than 0'
  error ReserveInactive(); // 'Action requires an active reserve'
  error ReserveFrozen(); // 'Action cannot be performed because the reserve is frozen'
  error ReservePaused(); // 'Action cannot be performed because the reserve is paused'
  error BorrowingNotEnabled(); // 'Borrowing is not enabled'
  error NotEnoughAvailableUserBalance(); // 'User cannot withdraw more than the available balance'
  error InvalidInterestRateModeSelected(); // 'Invalid interest rate mode selected'
  error HealthFactorLowerThanLiquidationThreshold(); // 'Health factor is below the liquidation threshold'
  error CollateralCannotCoverNewBorrow(); // 'There is not enough collateral to cover a new borrow'
  error NoDebtOfSelectedType(); // 'For repayment of a specific type of debt, the user needs to have debt that type'
  error NoExplicitAmountToRepayOnBehalf(); // 'To repay on behalf of a user an explicit amount to repay is needed'
  error UnderlyingBalanceZero(); // 'The underlying balance needs to be greater than 0'
  error HealthFactorNotBelowThreshold(); // 'Health factor is not below the threshold'
  error CollateralCannotBeLiquidated(); // 'The collateral chosen cannot be liquidated'
  error SpecifiedCurrencyNotBorrowedByUser(); // 'User did not borrow the specified currency'
  error InconsistentFlashloanParams(); // 'Inconsistent flashloan parameters'
  error BorrowCapExceeded(); // 'Borrow cap is exceeded'
  error SupplyCapExceeded(); // 'Supply cap is exceeded'
  error DebtCeilingExceeded(); // 'Debt ceiling is exceeded'
  error UnderlyingClaimableRightsNotZero(); // 'Claimable rights over underlying not zero (aToken supply or accruedToTreasury)'
  error VariableDebtSupplyNotZero(); // 'Variable debt supply is not zero'
  error LtvValidationFailed(); // 'Ltv validation failed'
  error InconsistentEModeCategory(); // 'Inconsistent eMode category'
  error PriceOracleSentinelCheckFailed(); // 'Price oracle sentinel validation failed'
  error AssetNotBorrowableInIsolation(); // 'Asset is not borrowable in isolation mode'
  error ReserveAlreadyInitialized(); // 'Reserve has already been initialized'
  error UserInIsolationModeOrLtvZero(); // 'User is in isolation mode or ltv is zero'
  error InvalidLtv(); // 'Invalid ltv parameter for the reserve'
  error InvalidLiquidationThreshold(); // 'Invalid liquidity threshold parameter for the reserve'
  error InvalidLiquidationBonus(); // 'Invalid liquidity bonus parameter for the reserve'
  error InvalidDecimals(); // 'Invalid decimals parameter of the underlying asset of the reserve'
  error InvalidReserveFactor(); // 'Invalid reserve factor parameter for the reserve'
  error InvalidBorrowCap(); // 'Invalid borrow cap for the reserve'
  error InvalidSupplyCap(); // 'Invalid supply cap for the reserve'
  error InvalidLiquidationProtocolFee(); // 'Invalid liquidation protocol fee for the reserve'
  error InvalidDebtCeiling(); // 'Invalid debt ceiling for the reserve'
  error InvalidReserveIndex(); // 'Invalid reserve index'
  error AclAdminCannotBeZero(); // 'ACL admin cannot be set to the zero address'
  error InconsistentParamsLength(); // 'Array parameters that should be equal length are not'
  error ZeroAddressNotValid(); // 'Zero address not valid'
  error InvalidExpiration(); // 'Invalid expiration'
  error InvalidSignature(); // 'Invalid signature'
  error OperationNotSupported(); // 'Operation not supported'
  error DebtCeilingNotZero(); // 'Debt ceiling is not zero'
  error AssetNotListed(); // 'Asset is not listed'
  error InvalidOptimalUsageRatio(); // 'Invalid optimal usage ratio'
  error UnderlyingCannotBeRescued(); // 'The underlying asset cannot be rescued'
  error AddressesProviderAlreadyAdded(); // 'Reserve has already been added to reserve list'
  error PoolAddressesDoNotMatch(); // 'The token implementation pool address and the pool address provided by the initializing pool do not match'
  error SiloedBorrowingViolation(); // 'User is trying to borrow multiple assets including a siloed one'
  error ReserveDebtNotZero(); // the total debt of the reserve needs to be 0
  error FlashloanDisabled(); // FlashLoaning for this asset is disabled
  error InvalidMaxRate(); // The expect maximum borrow rate is invalid
  error WithdrawToAToken(); // Withdrawing to the aToken is not allowed
  error SupplyToAToken(); // Supplying to the aToken is not allowed
  error Slope2MustBeGteSlope1(); // Variable interest rate slope 2 can not be lower than slope 1
  error CallerNotRiskOrPoolOrEmergencyAdmin(); // 'The caller of the function is not a risk, pool or emergency admin'
  error LiquidationGraceSentinelCheckFailed(); // 'Liquidation grace sentinel validation failed'
  error InvalidGracePeriod(); // Grace period above a valid range
  error InvalidFreezeState(); // Reserve is already in the passed freeze state
  error InvalidLtvzeroState(); // Reserve is already in the passed ltvzero state
  error NotBorrowableInEMode(); // Asset not borrowable in eMode
  error CallerNotUmbrella(); // The caller of the function is not the umbrella contract
  error ReserveNotInDeficit(); // The reserve is not in deficit
  error MustNotLeaveDust(); // Below a certain threshold liquidators need to take the full position
  error UserCannotHaveDebt(); // Thrown when a user tries to interact with a method that requires a position without debt
  error SelfLiquidation(); // Thrown when a user tries to liquidate themselves
  error CallerNotPositionManager(); // Thrown when the caller has not been enabled as a position manager of the on-behalf-of user
  error InvalidCollateralInEmode(address reserve, uint256 categoryId); /// Thrown when trying to enter an eMode with an invalid collateral asset
  error InvalidDebtInEmode(address reserve, uint256 categoryId); /// Thrown when trying to enter an eMode with an invalid debt asset
  error MustBeEmodeCollateral(address reserve, uint256 categoryId); /// Thrown when trying to configure an asset as eMode-ltvzero that is not an eMode collateral
}
