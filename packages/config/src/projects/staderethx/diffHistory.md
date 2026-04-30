Generated with discovered.json: 0xa0c8d0bf3d31203d24a50e99a2f7248bfb32b378

# Diff at Wed, 29 Apr 2026 15:24:03 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1777473533

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract StaderTreasury (eth:0x01422247a1d15BB4FcF91F5A077Cf25BA6460130)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VaultFactory (eth:0x03ABEEC03BF39ac5A5C8886cF3496326d8164E1E)
    +++ description: Deploys the per-validator ValidatorWithdrawalVault and per-operator NodeELRewardVault EIP1167 minimal-proxy clones used by the Permissioned and Permissionless pools. The `vaultProxyImplementation` cloned by every call is a single VaultProxy contract created in the factory's `initialize` (`new VaultProxy()`); each clone is `initialise(isValidatorWithdrawalVault, poolId, validatorId | operatorId, staderConfig)` to dispatch reads to either the validator-vault or EL-reward-vault implementation registered in StaderConfig. `deployWithdrawVault` and `deployNodeELRewardVault` are gated by VaultFactory's own NODE_REGISTRY_CONTRACT role (not the StaderConfig roles), which is granted to the two NodeRegistries; clone addresses are deterministic via `cloneDeterministic`. `updateVaultProxyAddress` and `updateStaderConfig` are gated by DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract PermissionedPool (eth:0x09134C643A6B95D342BdAf081Fa473338F066572)
    +++ description: Pool registered under POOL_ID = 2 (operators are whitelisted in PermissionedNodeRegistry). `stakeUserETHToBeaconChain` is callable only by STAKE_POOL_MANAGER and pre-deposits 1 ETH per validator (operator collateral is 0); `fullDepositOnBeaconChain` is callable only by PERMISSIONED_NODE_REGISTRY and finishes the 31 ETH deposit after the oracle marks the pubkeys valid. On defective keys (front-run or invalid signature) `transferETHOfDefectiveKeysToSSPM` pulls 1 ETH per key from StaderInsuranceFund (`reimburseUserFund`) and forwards 32 ETH per key back to StaderStakePoolsManager. `setCommissionFees` is gated by StaderConfig's MANAGER role and capped at `MAX_COMMISSION_LIMIT_BIPS` = 1500. `updateStaderConfig` is gated by this contract's DEFAULT_ADMIN_ROLE. `protocolFee` and `operatorFee` initialise to 500 bps each. `transferExcessETHToSSPM` is permissionless once `preDepositValidatorCount` is zero. The plain `receive`/`fallback` revert.
```

```diff
+   Status: CREATED
    contract StaderTimelock (eth:0x1112D5C55670Cb5144BF36114C20a122908068B9)
    +++ description: OpenZeppelin TimelockController. `schedule` records `_timestamps[id] = block.timestamp + delay` for a call (where `delay >= getMinDelay()`), so operations become executable after `getMinDelay` seconds have passed. Holders of PROPOSER_ROLE schedule, holders of CANCELLER_ROLE cancel before execution, and holders of EXECUTOR_ROLE call `execute` after the delay; if EXECUTOR_ROLE is granted to the zero address, anyone can execute.
```

```diff
+   Status: CREATED
    contract PermissionlessSocializingPool (eth:0x1DE458031bFbe5689deD5A8b9ed57e1E79EaB2A4)
    +++ description: Per-pool reward distributor (one instance for the permissioned pool, one for the permissionless pool, both registered in StaderConfig). Receives ETH via plain transfers from pool validators. `handleRewards`, callable only by StaderOracle, records the next per-cycle `RewardsData` once a Merkle root has reached oracle quorum, forwards `userETHRewards` to `StaderStakePoolsManager.receiveExecutionLayerRewards`, and sends `protocolETHRewards` to `staderConfig.getStaderTreasury()`; `operatorETHRewards` and `operatorSDRewards` stay in the contract until claimed. Operators call `claim` (or `claimAndDepositSD`) with a Merkle proof against the cycle root; ETH goes to the operator's reward address (looked up through the relevant NodeRegistry) and SD either to the same address or, when `claimAndDepositSD` is used, into SDCollateral. `pause` is gated by StaderConfig's MANAGER role; `unpause` and `updateStaderConfig` are gated by this contract's DEFAULT_ADMIN_ROLE. `maxApproveSD` is also gated by MANAGER.
```

```diff
+   Status: CREATED
    contract ValidatorWithdrawalVault (eth:0x3073cC90aD39E0C30bb0d4c70F981FbD00f3458f)
    +++ description: Implementation reachable through the per-validator EIP1167 clones the VaultFactory hands out (the clone delegates through VaultProxy with `isValidatorWithdrawalVault = true`). `distributeRewards` splits the contract balance via `PoolUtils.calculateRewardShare`; if rewards exceed StaderConfig's `getRewardsThreshold` only StaderConfig's MANAGER role can trigger it. `settleFunds` is callable only by the matching NodeRegistry: it computes the user/operator/protocol split via `calculateValidatorWithdrawalShare`, reads the validator's penalty from Penalty, slashes operator SD via `SDCollateral.slashValidatorSD` if the operator share is below the penalty, and forwards the user share to StaderStakePoolsManager, the protocol share to `staderTreasury`, and the operator share to `OperatorRewardsCollector.depositFor(operator)`.
```

```diff
+   Status: CREATED
    contract Stader (eth:0x30D20208d987713f46DFD34EF128Bb16C404D10f)
    +++ description: SD governance token (`Stader`/`SD`). Inherits ERC20, ERC20Burnable, ERC20Permit, and ERC20Votes. The constructor mints 150_000_000 SD to the deployer; there is no further mint path and no admin or pause control on the token itself. Used by SDCollateral as operator-bonded collateral, by SDUtilityPool as the borrowable principal, and as the auctioned asset in Auction.
```

```diff
+   Status: CREATED
    contract VaultProxy (eth:0x3517D4C433C99fD4d75A3059e176a789FF675025)
    +++ description: Master implementation that VaultFactory clones via EIP1167 for every per-validator ValidatorWithdrawalVault and per-operator NodeELRewardVault. VaultFactory.initialize creates this with `new VaultProxy()` and each clone is initialised with (isValidatorWithdrawalVault, poolId, id, staderConfig). ValidatorWithdrawalVault and NodeELRewardVault both read poolId/id/staderConfig from this proxy's storage and rely on its fallback to delegate to the implementation registered in StaderConfig (NODE_EL_REWARD_VAULT_IMPLEMENTATION or VALIDATOR_WITHDRAWAL_VAULT_IMPLEMENTATION) according to the `isValidatorWithdrawalVault` flag. Source is not verified on Etherscan; behaviour above is observed from VaultFactory and the two vault implementations.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x45B977CeCB9Dfaa17dFcBa88826ef684b8489fF6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaderConfig (eth:0x4ABEF2263d5A5ED582FC9A9789a41D85b68d69DB)
    +++ description: Central registry that every other Stader contract reads to look up sibling contract addresses (PoolUtils, StaderOracle, VaultFactory, NodeRegistries, Pools, ETHx, SD, treasury, ...) and protocol parameters (deposit and withdraw bounds, fee, socializing pool cycle duration, staked ETH per node). Inherits OpenZeppelin AccessControlUpgradeable and exposes four custom roles (MANAGER, OPERATOR, ROLE_SD_REWARD_APPROVER, ROLE_SD_REWARD_ENTRY) plus DEFAULT_ADMIN_ROLE. `getAdmin` returns `accountsMap[ADMIN]`; `updateAdmin` rotates this entry and grants DEFAULT_ADMIN_ROLE to the new address while revoking it from the old one.
```

```diff
+   Status: CREATED
    contract PermissionlessNodeRegistry (eth:0x4f4Bfa0861F62309934a5551E0B2541Ee82fdcF1)
    +++ description: POOL_ID = 1. Registry for the open node-operator set behind PermissionlessPool. `onboardNodeOperator` is callable by anyone (subject to PoolUtils name validation and a uniqueness check across all pools); on first registration the contract deploys the operator's NodeELRewardVault EIP1167 clone via VaultFactory. `addValidatorKeys` is payable and requires the operator to bond `COLLATERAL_ETH` (set in source to 4 ether) per key, plus the configured SD collateral; the public-key set goes through PermissionlessPool's `preDepositOnBeaconChain`. `markValidatorReadyToDeposit` and `withdrawnValidators` are callable only by StaderOracle; `updateNextQueuedValidatorIndex` and `updateDepositStatusAndBlock` only by PermissionlessPool. `FRONT_RUN_PENALTY` is 3 ether (deducted to the StaderInsuranceFund on detected front-runs). The operator set is open, so per-operator data is not enumerated.
```

```diff
+   Status: CREATED
    contract RatedOracle (eth:0x51881A1Cde5DBAE15D02aE1824940b19768d8F2b)
    +++ description: Third-party oracle (Rated Network). Inherits OpenZeppelin Ownable; the constructor hardcodes `transferOwnership(0x7e764ED499BcBd64Bc0Ab76222C239c666d50E4D)` so the contract is owned by Rated, not Stader. Approved proposers (`approvedProposer` mapping) post validator-violation `Report`s through UMA's Optimistic Oracle V3 (`OO`); `bondAmount` of `bondCurrency` is locked per assertion and disputes settle within `timeToSettle` seconds. Stader's Penalty contract reads `getViolationsForValidator` from this oracle to compute MEV-theft penalties. Trusted at the boundary; its internal owner chain is out of scope.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x5A14BD3f2bf84c3690d653F1d40cfb7a8a9B3c26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolSelector (eth:0x62e0b431990Ea128fe685E764FB04e7d604603B0)
    +++ description: Decides how StaderStakePoolsManager splits queued ETH between pools. `poolWeights[poolId]` are basis points that must sum to `POOL_WEIGHTS_SUM` (10000). `computePoolAllocationForDeposit` is a view used by `validatorBatchDeposit`; `poolAllocationForExcessETHDeposit` rotates through pools starting at `poolIdArrayIndexForExcessDeposit` and is callable only by STAKE_POOL_MANAGER. `updatePoolWeights` is gated by StaderConfig's MANAGER role and rejects any combination that does not sum to 10000. `updatePoolAllocationMaxSize` is gated by StaderConfig's OPERATOR role; `updateStaderConfig` is gated by this contract's DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x67B12264Ca3e0037Fc7E22F2457b42643a04C86e)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (eth:0x67BB8f98DDff504204B9AF8e9C00E9C6926526e2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SDCollateral (eth:0x7Af4730cc8EbAd1a050dcad5c03c33D2793EE91f)
    +++ description: Holds operator-bonded SD per-account, plus a separate `operatorUtilizedSDBalance` for SD borrowed from SDUtilityPool. Anyone can call `depositSDAsCollateral`/`depositSDAsCollateralOnBehalf`; `depositSDFromUtilityPool`, `reduceUtilizedSDPosition`, and `transferBackUtilizedSD` are routed through the SD_UTILITY_POOL contract. Operator `withdraw` first repays any utilized SD via `SDUtilityPool.repayOnBehalf` and then forwards excess SD to the operator's reward address. `slashValidatorSD` is callable only by the validator's withdraw vault; it converts the per-pool minThreshold to SD via `convertETHToSD` and routes the slashed amount into `Auction.createLot`. `maxApproveSD` and `updatePoolThreshold` are gated by StaderConfig's MANAGER role; `updateStaderConfig` is gated by this contract's DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract Penalty (eth:0x84645f1B80475992Df2C65c28bE6688d15dc6ED6)
    +++ description: Computes per-validator penalty amounts. `updateTotalPenaltyAmount(pubkeys[])` is permissionless and, for each pubkey, adds (`mevTheftPenaltyPerStrike` * RatedOracle violation count) + (`missedAttestationPenaltyPerStrike` * StaderOracle missed-attestation count) + DAO-set `additionalPenaltyAmount`. If the total reaches `validatorExitPenaltyThreshold` it emits `ForceExitValidator` for offchain operators to act on. `setAdditionalPenaltyAmount`, `updateMEVTheftPenaltyPerStrike`, `updateMissedAttestationPenaltyPerStrike`, `updateValidatorExitPenaltyThreshold`, and `updateRatedOracleAddress` are gated by StaderConfig's MANAGER role; `updateStaderConfig` is gated by this contract's DEFAULT_ADMIN_ROLE. `markValidatorSettled` is callable only by the validator's withdraw vault.
```

```diff
+   Status: CREATED
    contract OperatorRewardsCollector (eth:0x84ffDC9De310144D889540A49052F6d1AdB2C335)
    +++ description: Holds per-operator ETH balances accumulated from validator EL rewards. `depositFor(receiver)` is payable and called by NodeELRewardVault and ValidatorWithdrawalVault when they distribute the operator share. Operators call `claim` or `claimWithAmount`: for permissionless operators (detected through PoolUtils + PermissionlessNodeRegistry POOL_ID) the contract first calls `claimLiquidation`, which through SDUtilityPool may pull WETH out to repay the liquidator and ETH to the staderTreasury before forwarding the rest to the operator's reward address; for permissioned operators it just sends the full balance. `updateStaderConfig` and `updateWethAddress` are gated by DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract Auction (eth:0x85A22763f94D703d2ee39E9374616ae4C1612569)
    +++ description: ETH-for-SD auctions used to convert slashed operator SD into ETH. `createLot` is permissionless; SDCollateral calls it after `slashValidatorSD` to enqueue the slashed amount, but anyone can also push SD into a lot. Bidders call `addBid` (payable) until `block.number > endBlock`; `bidIncrement` enforces the minimum step. After the auction ends the highest bidder calls `claimSD`, anyone can call `transferHighestBidToSSPM` to forward the winning ETH into `StaderStakePoolsManager.receiveEthFromAuction`, losing bidders call `withdrawUnselectedBid`, and if a lot received no bids `extractNonBidSD` returns the SD to `staderConfig.getStaderTreasury()`. `updateDuration` and `updateBidIncrement` are gated by StaderConfig's MANAGER role; `updateStaderConfig` is gated by this contract's DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    EOA  (eth:0x8E0a538081BA1d7f41b7c594F0a2Afe7aE558494)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeELRewardVault (eth:0x97c92752DD8a8947cE453d3e35D2cad5857367af)
    +++ description: Implementation reachable through the per-operator EIP1167 clones the VaultFactory hands out (the clone delegates through VaultProxy with `isValidatorWithdrawalVault = false`). `receive` accepts plain ETH from operator EL rewards. `withdraw` is permissionless: it reads the clone's pool/operator IDs from VaultProxy storage, calls `PoolUtils.calculateRewardShare(poolId, balance)`, then sends the user share to `StaderStakePoolsManager.receiveExecutionLayerRewards`, the protocol share to `staderConfig.getStaderTreasury()`, and the operator share into `OperatorRewardsCollector.depositFor(operator)`.
```

```diff
+   Status: CREATED
    contract PermissionedSocializingPool (eth:0x9d4C3166c59412CEdBe7d901f5fDe41903a1d6Fc)
    +++ description: Per-pool reward distributor (one instance for the permissioned pool, one for the permissionless pool, both registered in StaderConfig). Receives ETH via plain transfers from pool validators. `handleRewards`, callable only by StaderOracle, records the next per-cycle `RewardsData` once a Merkle root has reached oracle quorum, forwards `userETHRewards` to `StaderStakePoolsManager.receiveExecutionLayerRewards`, and sends `protocolETHRewards` to `staderConfig.getStaderTreasury()`; `operatorETHRewards` and `operatorSDRewards` stay in the contract until claimed. Operators call `claim` (or `claimAndDepositSD`) with a Merkle proof against the cycle root; ETH goes to the operator's reward address (looked up through the relevant NodeRegistry) and SD either to the same address or, when `claimAndDepositSD` is used, into SDCollateral. `pause` is gated by StaderConfig's MANAGER role; `unpause` and `updateStaderConfig` are gated by this contract's DEFAULT_ADMIN_ROLE. `maxApproveSD` is also gated by MANAGER.
```

```diff
+   Status: CREATED
    contract UserWithdrawalManager (eth:0x9F0491B32DBce587c50c4C43AB303b06478193A7)
    +++ description: Withdrawal queue. `requestWithdraw(ethXAmount, owner)` pulls ETHx from `msg.sender`, snapshots the implied ETH amount via `StaderStakePoolsManager.previewWithdraw`, and stores a UserWithdrawInfo at `nextRequestId`; per-user pending requests are capped by `maxNonRedeemedUserRequestCount`. `finalizeUserWithdrawalRequest` is permissionless: it requires `StaderOracle.safeMode() == false` and `StakePoolManager.isVaultHealthy()`, processes up to `finalizationBatchLimit` requests at once that have aged at least `getMinBlockDelayToFinalizeWithdrawRequest` blocks, calls `ETHx.burnFrom` on the locked ETHx, and pulls the matching ETH from StakePoolManager via `transferETHToUserWithdrawManager`. The request `owner` then redeems the finalized ETH with `claim(requestId)`. `pause` is gated by StaderConfig's MANAGER role; `unpause`, `updateStaderConfig`, and `updateFinalizationBatchLimit` go through this contract's DEFAULT_ADMIN_ROLE / MANAGER respectively.
```

```diff
+   Status: CREATED
    contract ETHx Token (eth:0xA35b1B31Ce002FBF2058D22F30f95D405200A15b)
    +++ description: ERC20 receipt token (`ETHx`/`ETHx`). Has its own AccessControl with two custom roles, MINTER_ROLE and BURNER_ROLE: `mint` is gated by MINTER_ROLE and `burnFrom` by BURNER_ROLE. `pause` is callable by holders of StaderConfig's MANAGER role; `unpause` is gated by this contract's DEFAULT_ADMIN_ROLE. `_beforeTokenTransfer` reverts while paused, so transfers (and `_mint`/`_burn`) all stop together.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xAAfb31780e4b9c95Bc920e388f4925A874cd07AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedNodeRegistry (eth:0xaf42d795A6D279e9DCc19DC0eE1cE3ecd4ecf5dD)
    +++ description: POOL_ID = 2. Registry of operators allowed to run validators in PermissionedPool. Onboarding is gated: `whitelistPermissionedNOs` (StaderConfig MANAGER role) adds an address to `permissionList`; the same comment in source notes the whitelist is one-way (no on-chain blacklisting). Whitelisted addresses then call `onboardNodeOperator` to register, and `addValidatorKeys` to deploy a per-validator ValidatorWithdrawalVault clone via VaultFactory. `markValidatorReadyToDeposit` and `withdrawnValidators` are callable only by StaderOracle. `allocateValidatorsAndUpdateOperatorId` is callable only by PermissionedPool.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xbDa6C9cd7eD043CB739ca2C748dAbd1fCA397132)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaderInsuranceFund (eth:0xbe3781CE437Cc3fC8c8167913B4d462347D11F20)
    +++ description: Holds reserve ETH topped up by `depositFund` (payable, anyone) and by PermissionlessNodeRegistry sending the FRONT_RUN_PENALTY when a permissionless validator gets front-run. `reimburseUserFund` is callable only by PermissionedPool, which uses it to refund the pre-deposit ETH lost to defective permissioned validator keys (front-run or invalid signature). `withdrawFund` is gated by StaderConfig's MANAGER role and sends ETH to `msg.sender`; `updateStaderConfig` is gated by this contract's DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract StaderStakePoolsManager (eth:0xcf5EA1b38380f6aF39068375516Daf40Ed70D299)
    +++ description: Entry point for user ETH deposits. `deposit` mints ETHx to the receiver in proportion to `StaderOracle.getExchangeRate()` (totalETHBalance / totalETHXSupply); the deposited amount must lie in `[getMinDepositAmount, getMaxDepositAmount]`. `validatorBatchDeposit` (permissionless) and `depositETHOverTargetWeight` (permissionless, gated by `excessETHDepositCoolDown`) push pooled ETH into the configured pools according to PoolSelector weights. `transferETHToUserWithdrawManager` is callable only by the USER_WITHDRAW_MANAGER contract registered in StaderConfig. `pause` is callable by StaderConfig's MANAGER role; `unpause` and `updateStaderConfig` are gated by this contract's DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract PermissionlessPool (eth:0xd1a72Bd052e0d65B7c26D3dd97A98B74AcbBb6c5)
    +++ description: Pool registered under POOL_ID = 1 (operators register openly via PermissionlessNodeRegistry, posting `COLLATERAL_ETH` = 4 ether plus SD collateral per validator key). `preDepositOnBeaconChain` is payable and callable only by PERMISSIONLESS_NODE_REGISTRY; it issues the 1 ETH pre-deposit per validator. `stakeUserETHToBeaconChain` is callable only by STAKE_POOL_MANAGER and combines `DEPOSIT_NODE_BOND` = 3 ether of operator collateral pulled from PermissionlessNodeRegistry (`transferCollateralToPool`) with the user's 28 ether to issue the final `getFullDepositSize` deposit. `setCommissionFees` is gated by StaderConfig's MANAGER role and capped at `MAX_COMMISSION_LIMIT_BIPS` = 1500. `updateStaderConfig` is gated by this contract's DEFAULT_ADMIN_ROLE. `protocolFee` and `operatorFee` initialise to 500 bps each. The plain `receive`/`fallback` revert.
```

```diff
+   Status: CREATED
    EOA  (eth:0xDf83E84F1eB00F0230eB912E2Ec823C979800B1c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SDIncentiveController (eth:0xe225825bcf20F39E2F2e2170412a3247D83492D0)
    +++ description: Streams SD rewards to SDUtilityPool delegators (cToken holders). `start(rewardAmount, duration)` is gated by StaderConfig's MANAGER role and pulls SD from the caller before setting `emissionPerBlock = rewardAmount / duration` and `rewardEndBlock = block.number + duration`. `claim` and `updateRewardForAccount` are callable only by the SD_UTILITY_POOL contract registered in StaderConfig; they accrue and deliver the per-account share computed against `cTokenTotalSupply`. `updateStaderConfig` is gated by this contract's DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract SDUtilityPool (eth:0xED6EE5049f643289ad52411E9aDeC698D04a9602)
    +++ description: Lending pool that lets permissionless operators borrow SD against their non-terminal validator count to satisfy the SD collateral requirement. SD delegators call `delegate` and receive cToken shares; `requestWithdraw` and `requestWithdrawWithSDAmount` queue a redemption that anyone can finalize after `minBlockDelayToFinalizeRequest` (50400 blocks ≈ 7 days) via `finalizeDelegatorWithdrawalRequest`. Operators call `utilize` (or PermissionlessNodeRegistry calls `utilizeWhileAddingKeys`) to borrow SD up to `maxETHWorthOfSDPerValidator * nonTerminalKeyCount`; interest accrues at `utilizationRatePerBlock` (capped at MAX_UTILIZATION_RATE_PER_BLOCK ≈ 25% APR) into both the borrower's principal and `accumulatedProtocolFee`. `liquidationCall` is permissionless and triggers when an operator's health factor drops below 1, applying `liquidationBonusPercent` and `liquidationFeePercent`. `withdrawProtocolFee` (sends to `staderTreasury`) and `maxApproveSD` are gated by StaderConfig's MANAGER role; `clearUtilizerInterest` and `updateStaderConfig` are gated by this contract's DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    contract PoolUtils (eth:0xeDA89ed8F89D786D816F8E14CF8d2F90c6BF763f)
    +++ description: Maps pool IDs to pool addresses, fans out queries to the underlying NodeRegistries (validator/operator counts, key existence checks, operator-pool resolution), and centralises the user/operator/protocol reward split via `calculateRewardShare(poolId, totalRewards)`. `addNewPool` and `updatePoolAddress` are gated by this contract's DEFAULT_ADMIN_ROLE despite the source comment, and verify that the proposed pool's NodeRegistry POOL_ID matches the supplied `_poolId`. `processValidatorExitList` is gated by StaderConfig's OPERATOR role and emits `ExitValidator` events for offchain operators to act on; `processOperatorExit` is callable only by SD_UTILITY_POOL. `updateStaderConfig` is gated by DEFAULT_ADMIN_ROLE.
```

```diff
+   Status: CREATED
    EOA  (eth:0xEf781De8c56775e60e07b0a0c6a78a5E82C8AfF0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaderOracle (eth:0xF64bAe65f6f2a5277571143A24FaaFDFC0C2a737)
    +++ description: Aggregates submissions from a set of trusted oracle nodes (managed via `addTrustedNode`/`removeTrustedNode`, gated by StaderConfig's MANAGER role; `MIN_TRUSTED_NODES` is 3). Holds the protocol's exchange-rate accounting: `totalETHBalance` and `totalETHXSupply` returned by `getExchangeRate()` drive every ETHx mint/burn through StaderStakePoolsManager. Trusted nodes can also submit per-pool socializing-rewards Merkle roots (forwarded to the corresponding SocializingPool via `handleRewards`), SD/ETH spot prices (median is taken), validator status and stats updates, withdrawn-validator lists, missed-attestation penalty counters, and validator-verification details. Each submission requires a quorum of `trustedNodesCount/2 + 1`. Exchange-rate updates whose deviation exceeds `erChangeLimit` (basis points) put the oracle into `erInspectionMode` until `closeERInspectionMode` confirms the value or `disableERInspectionMode` (MANAGER-gated, or anyone after MAX_ER_UPDATE_FREQUENCY blocks) re-opens submissions. Has `safeMode` and PoR-feed (`updateERFromPORFeed`) variants of the exchange-rate path.
```
