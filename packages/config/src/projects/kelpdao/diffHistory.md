Generated with discovered.json: 0x2c8c4409c39c5afef4141e345aa1dac4ae87e7ae

# Diff at Sun, 03 May 2026 09:56:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1777643766

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract LRTDepositPool (eth:0x036676389e48133B63a802f8635AD39E752D375D)
    +++ description: User deposit entrypoint and asset-routing hub. Holds idle LST and ETH balances, mints rsETH on deposit at the LRTOracle quote, maintains the NodeDelegator queue used to forward balances to the EigenLayer side, and exposes the protocol-wide per-asset accounting view (getTotalAssetDeposits / getAssetDistributionData / getETHDistributionData), which sums balances across this contract, every entry in nodeDelegatorQueue (via NodeDelegator getAssetBalance / getAssetUnstaking / getEffectivePodShares), the LRT_UNSTAKING_VAULT-registered address, and the LRT_CONVERTER-registered address. All role checks consult IAccessControl on the address held in lrtConfig. Role-by-role gates: DEFAULT_ADMIN_ROLE: setMaxNegligibleAmount, setMinAmountToDeposit, updateMaxNodeDelegatorLimit, addNodeDelegatorContractToQueue (rejects beyond maxNodeDelegatorLimit), removeNodeDelegatorContractFromQueue and removeManyNodeDelegatorContractsFromQueue (each rejects unless every supported-asset balance plus EigenPod shares plus the unstaking-queue balance on the NDC are at or below maxNegligibleAmount), unpause. MANAGER: stakeEthForStETH (calls Lido submit() with this contract's ETH balance), maxApproveToLRTConverter, revokeApproveToLRTConverter. OPERATOR_ROLE: swapETHForAssetWithinDepositPool, swapAssetForETHWithinDepositPool (both quote against LRTOracle.getAssetPrice). ASSET_TRANSFER_ROLE: transferAssetToNodeDelegator, transferETHToNodeDelegator, transferAssetToLRTUnstakingVault, transferETHToLRTUnstakingVault. PAUSER_ROLE: pause. Three non-obvious behaviours: (1) only depositETH and depositAsset (the user-facing entrypoints) carry whenNotPaused; the admin / manager / operator / asset-transfer functions all run while this contract is paused. (2) The deposit-cap check is asymmetric for ETH: for ERC20 assets _beforeDeposit reverts when current totalAssetDeposits + amount > depositLimitByAsset, but for native ETH it reverts only if the current totalAssetDeposits is already strictly above the limit, so a single ETH deposit can push the total over the cap as long as the cap was not already exceeded before the call. (3) getRsETHAmountToMint reads LRTOracle.getAssetPrice and rsETHPrice with no bounds check, so a corrupted oracle reading translates directly into the rsETH minted to the depositor.
```

```diff
+   Status: CREATED
    contract NodeDelegator_B1 (eth:0x049EA11D337f185b1Aa910d98e8Fbd991f0FBA7B)
    +++ description: Per-instance EigenLayer staker: holds an EigenPod for native-ETH restaking, ERC20 strategy shares for LST restaking, and delegates the resulting stake to a single EigenLayer operator via DelegationManager. Role checks consult IAccessControl on lrtConfig. Role gates: OPERATOR_ROLE: depositAssetIntoStrategy (deposits this contract's full balance of asset into IStrategy(lrtConfig.assetStrategy(asset)) via EIGEN_STRATEGY_MANAGER, recipient is address(this)), stake32Eth and stake32EthValidated (each consume 32 ether of this contract's ETH balance to register a validator via EigenPodManager.stake; withdrawal credentials derived from eigenPod, pubkey deduplicated through PUBKEY_REGISTRY, stakedButUnverifiedNativeETH += 32 ether), verifyWithdrawalCredentials (proves validators against eigenPod, stakedButUnverifiedNativeETH -= 32 ether per validator), startCheckpoint, processClaim (recipient is lrtConfig.eigenLayerRewardReceiver()), initiateUnstaking (withdrawer is address(this), bumps LRT_UNSTAKING_VAULT.uncompletedWithdrawalCount), completeUnstaking (forwards the resulting balance delta to LRT_UNSTAKING_VAULT when receiveAsTokens). MANAGER: delegateTo (caller picks the EigenLayer operator and supplies the operator's approverSignatureAndExpiry), createEigenPod (calls EigenPodManager.createPod and writes eigenPod, reverts if already set), undelegate (auto-queues one forced withdrawal per active strategy), maxApproveToEigenStrategyManager / revokeApprovalToEigenStrategyManager. ASSET_TRANSFER_ROLE: transferBackToLRTDepositPool, transferETHToLRTUnstakingVault. PAUSER_ROLE: pause. DEFAULT_ADMIN_ROLE: unpause. Caller-restricted: sendETHFromDepositPoolToNDC requires msg.sender == LRT_DEPOSIT_POOL, sendETHFromUnstakingVaultToNDC requires msg.sender == LRT_UNSTAKING_VAULT, receive() accepts ETH from any caller. eigenPod is also written lazily by stake32Eth on the first call when it is still zero (read from EigenPodManager.ownerToPod). whenNotPaused gates only depositAssetIntoStrategy, stake32Eth, processClaim, undelegate, initiateUnstaking, completeUnstaking, transferBackToLRTDepositPool and transferETHToLRTUnstakingVault; delegateTo, createEigenPod, verifyWithdrawalCredentials, startCheckpoint, the approve helpers, pause and unpause execute regardless of paused state.
```

```diff
+   Status: CREATED
    contract AllocationManagerView (eth:0x0D4e5723daAD06510CFd6864b8eB8a08CF0c4a34)
    +++ description: Read-only view contract that exposes query functions for the AllocationManager, allowing external callers to look up operator stake allocations, magnitudes, operator sets, and slashable/redistributable status.
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x0ed6703C298d28aE0878d1b28e88cA87F9662fE9)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x0fCE0A591D96BB76883323eF555867111E2050a9)
    +++ description: A beacon with an upgradeable implementation currently set as eth:0xC355123d0a51b4B5185aA7f21150904CEE3EAC97. Beacon proxy contracts pointing to this beacon will all use its implementation.
```

```diff
+   Status: CREATED
    contract AVSDirectory (eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: AVSDirectory: legacy EigenLayer (operator, AVS) registration registry. The override below adds a kelp-scoped derived field that walks every AVS Kelp's two operators (ELOperator_A, ELOperator_B) are currently registered with on this directory, so the BFS pulls their internals (ServiceManager, registries, slasher chain) into this discovery automatically. List refreshes on every discovery run; the only deployment-stable inputs hardcoded in the where clauses are the two operator addresses (which are also named in this project and would surface as a separate diff if MANAGER ever undelegates and re-delegates).
```

```diff
+   Status: CREATED
    contract Safe (eth:0x218B5eC7482e072F6D47feb0463B3297eFb4bA56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KelpInstantWithdrawalFeeRecipient (eth:0x23Bd955B62027AA2b1060c6f79B4a8281c049667)
    +++ description: KelpInstantWithdrawalFeeRecipient — set as LRTWithdrawalManager.instantWithdrawalFeeRecipient. Collects the fee users pay (in WETH) for taking the instant-withdrawal path instead of the standard EigenLayer-cooldown queue. Does not mint or burn rsETH directly, but the instant path always burns rsETH against Aave-backed WETH liquidity, so this multisig is the economic counterparty for every instant rsETH redemption.
```

```diff
+   Status: CREATED
    contract PermissionController (eth:0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5)
    +++ description: Contract that enables AVSs and operators to delegate the ability to call certain core contract functions to other addresses.
```

```diff
+   Status: CREATED
    EOA  (eth:0x268DA1016634e06f17F11CF584C5Ddf1c44787eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolRegistry (eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129)
    +++ description: Admin-controlled on-chain registry that tracks all EigenLayer protocol contract deployments (addresses, names, configs, and versioning) and provides a pauseAll function to pause every registered pausable contract in the protocol.
```

```diff
+   Status: CREATED
    contract KelpProtocolTreasury (eth:0x322F2d4bFe8280EeB713B7C51EEbA42590C36f78)
    +++ description: KelpProtocolTreasury — registered under PROTOCOL_TREASURY in LRTConfig. Receives the rsETH that LRTOracle.updateRSETHPrice() mints as the protocol fee on every rebase (sized by protocolFeeInBPS, capped by the daily fee-mint limit). This multisig holds the realized rsETH protocol revenue.
```

```diff
+   Status: CREATED
    contract LRTOracle (eth:0x349A73444b1a310BAe67ef67973022020d70020d)
    +++ description: Computes the rsETH/ETH exchange rate (rsETHPrice) on demand and mints the protocol fee. Two entrypoints: updateRSETHPrice is callable by anyone when this contract is not paused; updateRSETHPriceAsManager is callable by MANAGER and ignores both the paused gate and the upper-bound percentage check. Each successful update sums per-asset getTotalAssetDeposits read from the LRT_DEPOSIT_POOL-registered address times the per-asset assetPriceOracle reading, takes protocolFeeInBPS / 10000 of any TVL increase, mints that as rsETH to the PROTOCOL_TREASURY-registered address (capped per 24h by maxFeeMintAmountPerDay, skipped while this contract or the LRT_DEPOSIT_POOL or LRT_WITHDRAW_MANAGER address is paused), then writes rsETHPrice = (totalETHInProtocol - fee) / rsETH.totalSupply. Two non-obvious behaviours: a price increase exceeding pricePercentageLimit reverts the public path (only updateRSETHPriceAsManager can push it through), and a price decrease exceeding pricePercentageLimit auto-pauses this contract and calls pause() on the LRT_DEPOSIT_POOL- and LRT_WITHDRAW_MANAGER-registered addresses. All role checks (onlyLRTAdmin / onlyLRTManager / onlyRole(PAUSER_ROLE)) consult the IAccessControl interface on the address held in lrtConfig.
```

```diff
+   Status: CREATED
    contract EigenLayerOwningMultisig (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PubkeyRegistry (eth:0x37043DC4Ef0B3e84aC9a84959D54cdC77f2109Bd)
    +++ description: Stores the BLS pubkeys used by NodeDelegators when registering validators with EigenLayer's EigenPodManager.
```

```diff
+   Status: CREATED
    contract DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: The DelegationManager contract is responsible for registering EigenLayer operators and managing the EigenLayer strategies delegations. The EigenDA StakeRegistry contract reads from the DelegationManager to track the total stake of each EigenDA operator.
```

```diff
+   Status: CREATED
    contract NodeDelegator_A2 (eth:0x395884D1974a839702bcFCBa176AC7871c788946)
    +++ description: Per-instance EigenLayer staker: holds an EigenPod for native-ETH restaking, ERC20 strategy shares for LST restaking, and delegates the resulting stake to a single EigenLayer operator via DelegationManager. Role checks consult IAccessControl on lrtConfig. Role gates: OPERATOR_ROLE: depositAssetIntoStrategy (deposits this contract's full balance of asset into IStrategy(lrtConfig.assetStrategy(asset)) via EIGEN_STRATEGY_MANAGER, recipient is address(this)), stake32Eth and stake32EthValidated (each consume 32 ether of this contract's ETH balance to register a validator via EigenPodManager.stake; withdrawal credentials derived from eigenPod, pubkey deduplicated through PUBKEY_REGISTRY, stakedButUnverifiedNativeETH += 32 ether), verifyWithdrawalCredentials (proves validators against eigenPod, stakedButUnverifiedNativeETH -= 32 ether per validator), startCheckpoint, processClaim (recipient is lrtConfig.eigenLayerRewardReceiver()), initiateUnstaking (withdrawer is address(this), bumps LRT_UNSTAKING_VAULT.uncompletedWithdrawalCount), completeUnstaking (forwards the resulting balance delta to LRT_UNSTAKING_VAULT when receiveAsTokens). MANAGER: delegateTo (caller picks the EigenLayer operator and supplies the operator's approverSignatureAndExpiry), createEigenPod (calls EigenPodManager.createPod and writes eigenPod, reverts if already set), undelegate (auto-queues one forced withdrawal per active strategy), maxApproveToEigenStrategyManager / revokeApprovalToEigenStrategyManager. ASSET_TRANSFER_ROLE: transferBackToLRTDepositPool, transferETHToLRTUnstakingVault. PAUSER_ROLE: pause. DEFAULT_ADMIN_ROLE: unpause. Caller-restricted: sendETHFromDepositPoolToNDC requires msg.sender == LRT_DEPOSIT_POOL, sendETHFromUnstakingVaultToNDC requires msg.sender == LRT_UNSTAKING_VAULT, receive() accepts ETH from any caller. eigenPod is also written lazily by stake32Eth on the first call when it is still zero (read from EigenPodManager.ownerToPod). whenNotPaused gates only depositAssetIntoStrategy, stake32Eth, processClaim, undelegate, initiateUnstaking, completeUnstaking, transferBackToLRTDepositPool and transferETHToLRTUnstakingVault; delegateTo, createEigenPod, verifyWithdrawalCredentials, startCheckpoint, the approve helpers, pause and unpause execute regardless of paused state.
```

```diff
+   Status: CREATED
    contract EthXPriceOracle (eth:0x3D08ccb47ccCde84755924ED6B0642F9aB30dFd2)
    +++ description: IPriceFetcher implementation for one specific LST. getAssetPrice reverts unless the supplied asset equals ethxAddress; otherwise it returns IETHXStakePoolsManager(ethXStakePoolsManagerProxyAddress).getExchangeRate() as the asset/ETH rate. Both ethXStakePoolsManagerProxyAddress and ethxAddress are set by one-shot initializers (initialize and initialize2) and have no setters; the implementation behind the proxy is upgradeable through the proxy admin.
```

```diff
+   Status: CREATED
    contract EigenLayerOperationsMultisig2 (eth:0x461854d84Ee845F905e0eCf6C288DDEEb4A9533F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0x49bD9989E31aD35B0A62c20BE86335196A3135B1)
    +++ description: OZ TimelockController. PROPOSER queues an arbitrary call (target, value, data, predecessor, salt) via schedule / scheduleBatch; once getMinDelay seconds have elapsed, anyone holding EXECUTOR_ROLE (or any address, see below) can run it via execute / executeBatch. CANCELLER aborts a still-pending operation via cancel(id). Two non-obvious patterns to look for in the values: (1) execute / executeBatch are gated by the onlyRoleOrOpenRole(EXECUTOR_ROLE) modifier, which checks address(0) first: if address(0) holds EXECUTOR_ROLE the per-msg.sender check is skipped and execution is permissionless. (2) The constructor grants TIMELOCK_ADMIN_ROLE (the role admin of every other role on this contract) to the contract itself, so role changes can be performed only by scheduling them and waiting the current delay; the constructor also grants the role to its admin argument when non-zero, and OZ recommends renouncing that admin immediately after deployment. updateDelay requires msg.sender == address(this), so changing getMinDelay must itself be scheduled and survive the current delay.
```

```diff
+   Status: CREATED
    contract NodeDelegator_A3 (eth:0x4C798C4653b1257D5149910523D7a6eeD5712F83)
    +++ description: Per-instance EigenLayer staker: holds an EigenPod for native-ETH restaking, ERC20 strategy shares for LST restaking, and delegates the resulting stake to a single EigenLayer operator via DelegationManager. Role checks consult IAccessControl on lrtConfig. Role gates: OPERATOR_ROLE: depositAssetIntoStrategy (deposits this contract's full balance of asset into IStrategy(lrtConfig.assetStrategy(asset)) via EIGEN_STRATEGY_MANAGER, recipient is address(this)), stake32Eth and stake32EthValidated (each consume 32 ether of this contract's ETH balance to register a validator via EigenPodManager.stake; withdrawal credentials derived from eigenPod, pubkey deduplicated through PUBKEY_REGISTRY, stakedButUnverifiedNativeETH += 32 ether), verifyWithdrawalCredentials (proves validators against eigenPod, stakedButUnverifiedNativeETH -= 32 ether per validator), startCheckpoint, processClaim (recipient is lrtConfig.eigenLayerRewardReceiver()), initiateUnstaking (withdrawer is address(this), bumps LRT_UNSTAKING_VAULT.uncompletedWithdrawalCount), completeUnstaking (forwards the resulting balance delta to LRT_UNSTAKING_VAULT when receiveAsTokens). MANAGER: delegateTo (caller picks the EigenLayer operator and supplies the operator's approverSignatureAndExpiry), createEigenPod (calls EigenPodManager.createPod and writes eigenPod, reverts if already set), undelegate (auto-queues one forced withdrawal per active strategy), maxApproveToEigenStrategyManager / revokeApprovalToEigenStrategyManager. ASSET_TRANSFER_ROLE: transferBackToLRTDepositPool, transferETHToLRTUnstakingVault. PAUSER_ROLE: pause. DEFAULT_ADMIN_ROLE: unpause. Caller-restricted: sendETHFromDepositPoolToNDC requires msg.sender == LRT_DEPOSIT_POOL, sendETHFromUnstakingVaultToNDC requires msg.sender == LRT_UNSTAKING_VAULT, receive() accepts ETH from any caller. eigenPod is also written lazily by stake32Eth on the first call when it is still zero (read from EigenPodManager.ownerToPod). whenNotPaused gates only depositAssetIntoStrategy, stake32Eth, processClaim, undelegate, initiateUnstaking, completeUnstaking, transferBackToLRTDepositPool and transferETHToLRTUnstakingVault; delegateTo, createEigenPod, verifyWithdrawalCredentials, startCheckpoint, the approve helpers, pause and unpause execute regardless of paused state.
```

```diff
+   Status: CREATED
    contract OneETHPriceOracle (eth:0x4cB8d6DCd56d6b371210E70837753F2a835160c4)
    +++ description: IPriceFetcher implementation that returns 1e18 (asset/ETH = 1.0) from getAssetPrice regardless of which asset address is passed (the argument is ignored). Pure function, no state, no admin surface, deployed as a plain non-proxy contract.
```

```diff
+   Status: CREATED
    contract KelpAssetTransferMultisig (eth:0x4E24A7E8B276b8ed42124C9e09C811f3eDC98c62)
    +++ description: KelpAssetTransferMultisig — holds ASSET_TRANSFER_ROLE on LRTConfig. Can move pooled LSTs/ETH between LRTDepositPool, NodeDelegators and LRTUnstakingVault. Does not change rsETH supply, but controls the assets that back rsETH at any given moment, so it can rebalance Kelp's restaked vs idle balance.
```

```diff
+   Status: CREATED
    contract EigenLayerPauserMultisig (eth:0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0x53cC2D82E08370Fe1e44a96f69CEc7d5b54ae868)
    +++ description: EigenLayer EigenPod, one per staker. podOwner is set in initialize when the BeaconProxy is deployed by EigenPodManager and is not changeable afterwards. Validators staked through this pod have withdrawal credentials hardcoded to address(this), so beacon-chain withdrawals always exit into this pod. Function gates: onlyEigenPodManager: stake (msg.value must equal 32 ether, calls ETHPOS.deposit with this pod's withdrawal credentials), withdrawRestakedBeaconChainETH (sends ETH to a manager-supplied recipient, capped at withdrawableRestakedExecutionLayerGwei). onlyEigenPodOwner: recoverTokens (sweeps arbitrary ERC20 tokens to a caller-supplied recipient; does not touch native ETH or restaked balance accounting), setProofSubmitter. onlyOwnerOrProofSubmitter: startCheckpoint, verifyWithdrawalCredentials, requestConsolidation (forwards a fee + pubkey-pair payload to the EIP-7251 consolidation predeploy), requestWithdrawal (forwards a fee + pubkey/amount payload to the EIP-7002 withdrawal predeploy). Permissionless: receive() (accepts ETH from any caller, logs only), verifyCheckpointProofs (any caller advances the active checkpoint with valid Merkle proofs), verifyStaleBalance (any caller can mark a validator with stale balance to require a re-checkpoint). Each non-Manager entrypoint is independently gated by IPausable(eigenPodManager).paused(index) with a function-specific pause index, so EigenLayer's pause governance on EigenPodManager controls each operation separately.
```

```diff
+   Status: CREATED
    contract NodeDelegator_A4 (eth:0x545D69B99759E7b670Df243b882700121d6d3AB9)
    +++ description: Per-instance EigenLayer staker: holds an EigenPod for native-ETH restaking, ERC20 strategy shares for LST restaking, and delegates the resulting stake to a single EigenLayer operator via DelegationManager. Role checks consult IAccessControl on lrtConfig. Role gates: OPERATOR_ROLE: depositAssetIntoStrategy (deposits this contract's full balance of asset into IStrategy(lrtConfig.assetStrategy(asset)) via EIGEN_STRATEGY_MANAGER, recipient is address(this)), stake32Eth and stake32EthValidated (each consume 32 ether of this contract's ETH balance to register a validator via EigenPodManager.stake; withdrawal credentials derived from eigenPod, pubkey deduplicated through PUBKEY_REGISTRY, stakedButUnverifiedNativeETH += 32 ether), verifyWithdrawalCredentials (proves validators against eigenPod, stakedButUnverifiedNativeETH -= 32 ether per validator), startCheckpoint, processClaim (recipient is lrtConfig.eigenLayerRewardReceiver()), initiateUnstaking (withdrawer is address(this), bumps LRT_UNSTAKING_VAULT.uncompletedWithdrawalCount), completeUnstaking (forwards the resulting balance delta to LRT_UNSTAKING_VAULT when receiveAsTokens). MANAGER: delegateTo (caller picks the EigenLayer operator and supplies the operator's approverSignatureAndExpiry), createEigenPod (calls EigenPodManager.createPod and writes eigenPod, reverts if already set), undelegate (auto-queues one forced withdrawal per active strategy), maxApproveToEigenStrategyManager / revokeApprovalToEigenStrategyManager. ASSET_TRANSFER_ROLE: transferBackToLRTDepositPool, transferETHToLRTUnstakingVault. PAUSER_ROLE: pause. DEFAULT_ADMIN_ROLE: unpause. Caller-restricted: sendETHFromDepositPoolToNDC requires msg.sender == LRT_DEPOSIT_POOL, sendETHFromUnstakingVaultToNDC requires msg.sender == LRT_UNSTAKING_VAULT, receive() accepts ETH from any caller. eigenPod is also written lazily by stake32Eth on the first call when it is still zero (read from EigenPodManager.ownerToPod). whenNotPaused gates only depositAssetIntoStrategy, stake32Eth, processClaim, undelegate, initiateUnstaking, completeUnstaking, transferBackToLRTDepositPool and transferETHToLRTUnstakingVault; delegateTo, createEigenPod, verifyWithdrawalCredentials, startCheckpoint, the approve helpers, pause and unpause execute regardless of paused state.
```

```diff
+   Status: CREATED
    contract LRTConverter (eth:0x598dbcb99711E5577fF76ef4577417197B939Dfa)
    +++ description: Converts Kelp's holdings of LSTs (e.g. stETH, swETH) and routes withdrawals through their respective protocols. Acts as the bridge between Kelp's accounting and the underlying LST/withdrawal contracts.
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x5a2a4F2F3C18f09179B6703e63D9eDD165909073)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract StrategyFactory (eth:0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647)
    +++ description: Factory contract for permissionless strategy creation via beacon proxies.
```

```diff
+   Status: CREATED
    contract EmissionsController (eth:0x619F988b4EA2f896ED068d84cE6F52550d6acE84)
    +++ description: EigenLayer emissions distributor. Streams EIGEN rewards to KelpDAO based on configured distributions.
```

```diff
+   Status: CREATED
    contract LRTWithdrawalManager (eth:0x62De59c08eB5dAE4b7E6F7a8cAd3006d6965ec16)
    +++ description: Manages user withdrawal requests for rsETH redemption. Holds an Aave WETH position to back instant withdrawal liquidity.
```

```diff
+   Status: CREATED
    contract RewardsCoordinator (eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda)
    +++ description: Manages the distribution of rewards (arbitrary tokens, EIGEN) to restakers and commission to operators.
```

```diff
+   Status: CREATED
    contract NodeDelegator_B2 (eth:0x79f17234746344E0365D40be50d8d43DB9082c32)
    +++ description: Per-instance EigenLayer staker: holds an EigenPod for native-ETH restaking, ERC20 strategy shares for LST restaking, and delegates the resulting stake to a single EigenLayer operator via DelegationManager. Role checks consult IAccessControl on lrtConfig. Role gates: OPERATOR_ROLE: depositAssetIntoStrategy (deposits this contract's full balance of asset into IStrategy(lrtConfig.assetStrategy(asset)) via EIGEN_STRATEGY_MANAGER, recipient is address(this)), stake32Eth and stake32EthValidated (each consume 32 ether of this contract's ETH balance to register a validator via EigenPodManager.stake; withdrawal credentials derived from eigenPod, pubkey deduplicated through PUBKEY_REGISTRY, stakedButUnverifiedNativeETH += 32 ether), verifyWithdrawalCredentials (proves validators against eigenPod, stakedButUnverifiedNativeETH -= 32 ether per validator), startCheckpoint, processClaim (recipient is lrtConfig.eigenLayerRewardReceiver()), initiateUnstaking (withdrawer is address(this), bumps LRT_UNSTAKING_VAULT.uncompletedWithdrawalCount), completeUnstaking (forwards the resulting balance delta to LRT_UNSTAKING_VAULT when receiveAsTokens). MANAGER: delegateTo (caller picks the EigenLayer operator and supplies the operator's approverSignatureAndExpiry), createEigenPod (calls EigenPodManager.createPod and writes eigenPod, reverts if already set), undelegate (auto-queues one forced withdrawal per active strategy), maxApproveToEigenStrategyManager / revokeApprovalToEigenStrategyManager. ASSET_TRANSFER_ROLE: transferBackToLRTDepositPool, transferETHToLRTUnstakingVault. PAUSER_ROLE: pause. DEFAULT_ADMIN_ROLE: unpause. Caller-restricted: sendETHFromDepositPoolToNDC requires msg.sender == LRT_DEPOSIT_POOL, sendETHFromUnstakingVaultToNDC requires msg.sender == LRT_UNSTAKING_VAULT, receive() accepts ETH from any caller. eigenPod is also written lazily by stake32Eth on the first call when it is still zero (read from EigenPodManager.ownerToPod). whenNotPaused gates only depositAssetIntoStrategy, stake32Eth, processClaim, undelegate, initiateUnstaking, completeUnstaking, transferBackToLRTDepositPool and transferETHToLRTUnstakingVault; delegateTo, createEigenPod, verifyWithdrawalCredentials, startCheckpoint, the approve helpers, pause and unpause execute regardless of paused state.
```

```diff
+   Status: CREATED
    contract AaveProtocolDataProvider (eth:0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3)
    +++ description: Aave V3 read-only data provider. Lists every reserve and aToken in the Aave V3 main pool.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x7F68e9C17D22005688b8E6968fCe31e32B4B03d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SfrxETHPriceOracle (eth:0x8546A7C8C3C537914C3De24811070334568eF427)
    +++ description: IPriceFetcher implementation for one specific LST. getAssetPrice reverts unless the supplied asset equals sfrxETHContractAddress; otherwise it returns ISfrxETH(sfrxETHContractAddress).pricePerShare() as the asset/ETH rate. sfrxETHContractAddress is set once in initialize and has no setter; the implementation behind the proxy is upgradeable through the proxy admin.
```

```diff
+   Status: CREATED
    contract StrategyManager (eth:0x858646372CC42E1A627fcE94aa7A7033e7CF075A)
    +++ description: The StrategyManager contract is responsible for managing the EigenLayer token strategies. Each EigenDA quorum has at least one strategy that defines the operators quorum stake.
```

```diff
+   Status: CREATED
    contract PoolInstance (eth:0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2)
    +++ description: Aave V3 main lending pool. KelpDAO deposits WETH here to earn yield used for instant withdrawal liquidity.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract StrategyBase (eth:0x8F6be4A906376bB4481E78cBF6FC783Cc0f8D1Ce)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenPodManager (eth:0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x93c4b944D05dfe6df7645A86cd2206016c51564D)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract LRTConfig (eth:0x947Cb49334e6571ccBFEF1f1f1178d8469D65ec7)
    +++ description: OZ AccessControl + bytes32-keyed configuration store designed to be shared by a multi-contract protocol. Sibling contracts read role membership via IAccessControl and look up sibling addresses via getContract(KEY) / getLSTToken(KEY). The only state-changing function on this contract that consumes the registry is pauseAll, which fans pause() out to the addresses under LRT_DEPOSIT_POOL, LRT_WITHDRAW_MANAGER and LRT_ORACLE, to the rsETH address, and to every NodeDelegator returned by getNodeDelegatorQueue(). Five of the role identifiers declared in the embedded LRTConstants library (MINTER_ROLE, BURNER_ROLE, OPERATOR_ROLE, ASSET_TRANSFER_ROLE, UNLOCKED_WITHDRAWAL_INITIALIZER) are not gated by any function on this contract; they exist only for sibling contracts to query.
```

```diff
+   Status: CREATED
    contract AllocationManager (eth:0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39)
    +++ description: Contract used to create Operator Sets, and used by Operators to register to them. The Allocation Manager tracks allocation of stake to a Operator Set, and enables AVSs to slash that stake.
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract rsETH Token (eth:0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7)
    +++ description: rsETH liquid restaking token. ERC20 minted on deposits to LRTDepositPool and burned on withdrawals via LRTWithdrawalManager. ERC20Permit + AccessControl + Pausable with a per-block transfer guard.
```

```diff
+   Status: CREATED
    contract ETHx Token (eth:0xA35b1B31Ce002FBF2058D22F30f95D405200A15b)
    +++ description: Stader ETHx — accepted as a deposit asset by KelpDAO. Shown as a leaf: ERC20 metadata is captured but Stader's StaderConfig chain is not walked.
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0xA91Dff6C41af892a89fC5C0Bf5C32B5CC89d13AC)
    +++ description: EigenLayer EigenPod, one per staker. podOwner is set in initialize when the BeaconProxy is deployed by EigenPodManager and is not changeable afterwards. Validators staked through this pod have withdrawal credentials hardcoded to address(this), so beacon-chain withdrawals always exit into this pod. Function gates: onlyEigenPodManager: stake (msg.value must equal 32 ether, calls ETHPOS.deposit with this pod's withdrawal credentials), withdrawRestakedBeaconChainETH (sends ETH to a manager-supplied recipient, capped at withdrawableRestakedExecutionLayerGwei). onlyEigenPodOwner: recoverTokens (sweeps arbitrary ERC20 tokens to a caller-supplied recipient; does not touch native ETH or restaked balance accounting), setProofSubmitter. onlyOwnerOrProofSubmitter: startCheckpoint, verifyWithdrawalCredentials, requestConsolidation (forwards a fee + pubkey-pair payload to the EIP-7251 consolidation predeploy), requestWithdrawal (forwards a fee + pubkey/amount payload to the EIP-7002 withdrawal predeploy). Permissionless: receive() (accepts ETH from any caller, logs only), verifyCheckpointProofs (any caller advances the active checkpoint with valid Merkle proofs), verifyStaleBalance (any caller can mark a validator with stale balance to require a re-checkpoint). Each non-Manager entrypoint is independently gated by IPausable(eigenPodManager).paused(index) with a function-specific pause index, so EigenLayer's pause governance on EigenPodManager controls each operation separately.
```

```diff
+   Status: CREATED
    contract UnlockedWithdrawalsInitializer (eth:0xa9B1CED1839bA07c4E8AaEF45BB60c8B27B35595)
    +++ description: Holds the UNLOCKED_WITHDRAWAL_INITIALIZER role on LRTConfig. The role gates only LRTWithdrawalManager.initialize2, a one-shot reinitializer that seeds the per-asset unlockedWithdrawalsCount counter from the legacy withdrawal flow. After being called once, further calls are blocked by the OZ reinitializer guard, so this contract is effectively spent on the live deployment and retains no live authority over withdrawals.
```

```diff
+   Status: CREATED
    contract EigenStrategy (eth:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Liquid staked Ether 2.0 Token (eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: Lido stETH — accepted as a deposit asset by KelpDAO. Shown as a leaf: ERC20 metadata is captured but Lido's internal admin/locator chain is not walked (Lido has its own discovery).
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xB0cDbbC83C01a28EE464F5F8622E2e8707e04B25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0xB25FE78fAaEfadB7249B4940EE485856df150BBe)
    +++ description: EigenLayer EigenPod, one per staker. podOwner is set in initialize when the BeaconProxy is deployed by EigenPodManager and is not changeable afterwards. Validators staked through this pod have withdrawal credentials hardcoded to address(this), so beacon-chain withdrawals always exit into this pod. Function gates: onlyEigenPodManager: stake (msg.value must equal 32 ether, calls ETHPOS.deposit with this pod's withdrawal credentials), withdrawRestakedBeaconChainETH (sends ETH to a manager-supplied recipient, capped at withdrawableRestakedExecutionLayerGwei). onlyEigenPodOwner: recoverTokens (sweeps arbitrary ERC20 tokens to a caller-supplied recipient; does not touch native ETH or restaked balance accounting), setProofSubmitter. onlyOwnerOrProofSubmitter: startCheckpoint, verifyWithdrawalCredentials, requestConsolidation (forwards a fee + pubkey-pair payload to the EIP-7251 consolidation predeploy), requestWithdrawal (forwards a fee + pubkey/amount payload to the EIP-7002 withdrawal predeploy). Permissionless: receive() (accepts ETH from any caller, logs only), verifyCheckpointProofs (any caller advances the active checkpoint with valid Merkle proofs), verifyStaleBalance (any caller can mark a validator with stale balance to require a re-checkpoint). Each non-Manager entrypoint is independently gated by IPausable(eigenPodManager).paused(index) with a function-specific pause index, so EigenLayer's pause governance on EigenPodManager controls each operation separately.
```

```diff
+   Status: CREATED
    contract KelpAdminMultisig (eth:0xb3696a817D01C8623E66D156B6798291fa10a46d)
    +++ description: KelpAdminMultisig — root admin of the rsETH protocol. Holds DEFAULT_ADMIN_ROLE on LRTConfig: can grant/revoke any role on every Kelp contract (including MINTER_ROLE and BURNER_ROLE on rsETH), re-point any entry in LRTConfig's bytes32 contract registry (so it can effectively replace LRTDepositPool, LRTOracle, LRTWithdrawalManager or rsETH itself), and add/remove supported deposit assets and their EigenLayer strategies. Also set as rsETH.custodyAddress, the ASSET_TRANSFER_ROLE-style endpoint stored on the rsETH token. There is no timelock on these operations except for adding new supported assets (which is gated by TIME_LOCK_ROLE / 10-day timelock). In short: this multisig can stop, replace, or reroute every component that mints, burns, or backs rsETH.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xb61e0E39b6d4030C36A176f576aaBE44BF59Dc78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KelpPauserMultisig (eth:0xb6AbB489aCA4583833230F10B3A7670114D09559)
    +++ description: KelpPauserMultisig — secondary pause-only authority. Holds PAUSER_ROLE on LRTConfig. Can pause LRTDepositPool (block new deposits / rsETH minting), LRTOracle (freeze the rsETH/ETH rate and stop fee-mints), LRTWithdrawalManager (block redemptions / rsETH burning), and rsETH transfers. Cannot unpause — that requires MANAGER or DEFAULT_ADMIN. Pure circuit breaker for rsETH user flows.
```

```diff
+   Status: CREATED
    contract PauserRegistry (eth:0xB8765ed72235d279c3Fb53936E4606db0Ef12806)
    +++ description: Defines and stores pauser and unpauser roles for EigenLayer contracts.
```

```diff
+   Status: CREATED
    contract KelpLegacyProtocolTreasury (eth:0xb9577E83a6d9A6DE35047aa066E3758221FE0DA2)
    +++ description: KelpLegacyProtocolTreasury — referenced from FeeReceiver._legacyProtocolTreasury. Historical destination for protocol fees before the current FeeReceiver / PROTOCOL_TREASURY split was introduced. No active write authority over rsETH; kept on-chain for backward reference.
```

```diff
+   Status: CREATED
    contract EigenLayerOperationsMultisig (eth:0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d)
    +++ description: A timelock that allows scheduling calls and executing or cancelling them with a delay.
```

```diff
+   Status: CREATED
    contract DurationVaultStrategy (eth:0xC355123d0a51b4B5185aA7f21150904CEE3EAC97)
    +++ description: EigenLayer duration-vault strategy variant used for time-locked staking positions.
```

```diff
+   Status: CREATED
    contract LRTUnstakingVault (eth:0xc66830E2667bc740c0BED9A71F18B14B8c8184bA)
    +++ description: Forwarder vault sitting between NodeDelegators (post-EigenLayer-unstake) and the withdrawal manager. Holds whatever LST and ETH balances arrive from NodeDelegators (after their completeUnstaking forwards balance deltas) and from LRT_DEPOSIT_POOL (via ASSET_TRANSFER_ROLE transfers); pushes them out only through redeem(), which is callable solely by the LRT_WITHDRAW_MANAGER-registered address. Inherits PausableUpgradeable but exposes no pause() / unpause() and no function uses whenNotPaused, so the inherited paused field is permanently false. Function gates: onlyLRTWithdrawalManager (msg.sender == lrtConfig.withdrawManager()): redeem (sends asset/ETH to msg.sender; the only outflow path on this contract). onlyLRTNodeDelegator (msg.sender registered in ILRTDepositPool.isNodeDelegator): increaseUncompletedWithdrawalCount, decreaseUncompletedWithdrawalCount. ASSET_TRANSFER_ROLE: transferAssetToNodeDelegator, transferETHToNodeDelegator (ndcIndex resolves through LRTDepositPool.getNodeDelegatorQueue). MANAGER: setMaxUncompletedWithdrawalCount (hard-capped at 80 by the setter), setUncompletedWithdrawalCount (recomputes the counter by iterating LRTDepositPool.getNodeDelegatorQueue and summing EIGEN_DELEGATION_MANAGER.getQueuedWithdrawals lengths). OPERATOR_ROLE: setQueuedWithdrawalsBuffer (per-asset reservation subtracted from balanceOf inside getAssetsAvailableForInstantWithdrawal). Permissionless: receive() (logs only), receiveFromLRTDepositPool and receiveFromNodeDelegator (no-op payable hooks).
```

```diff
+   Status: CREATED
    contract KelpManagerMultisig (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1)
    +++ description: KelpManagerMultisig, operational admin of the rsETH protocol. Holds three roles on LRTConfig. MANAGER lets it set protocolFeeInBPS (the rsETH protocol fee LRTOracle mints to the treasury on every rebase, capped at 1500 bps by the setter) and per-asset deposit limits, tune LRTOracle parameters (maxFeeMintAmountPerDay, the manager-only updateRSETHPriceAsManager that bypasses the price-percentage limit) and LRTWithdrawalManager parameters (withdrawal delay, instant-withdrawal enable/fee/fee-recipient), set rsETH's daily mint cap, blocklist any rsETH holder for 24h via blockUserTransfers, mark addresses as permanently exempt from such freezes, call delegateTo / undelegate / createEigenPod on the NodeDelegators (changes which EigenLayer operator each NodeDelegator delegates to), and call stakeEthForStETH on LRTDepositPool. PAUSER_ROLE lets it pause every Kelp contract via LRTConfig.pauseAll or each individual pause function. OPERATOR_ROLE lets it drive NodeDelegator workflows (depositAssetIntoStrategy, stake32Eth, verifyWithdrawalCredentials, startCheckpoint, initiateUnstaking, processClaim) and the operator-gated paths on LRTDepositPool (internal swaps), LRTWithdrawalManager (completeWithdrawalForUser, depositIdleETHToAave, collectInterestToTreasury, unlockQueue) and LRTUnstakingVault. Cannot grant roles, replace contracts in the LRTConfig registry, set the EigenLayer reward receiver, change the dust threshold, or unpause anything (those are DEFAULT_ADMIN), and cannot move pooled LST/ETH balances between LRTDepositPool, NodeDelegators and LRTUnstakingVault (that is ASSET_TRANSFER_ROLE).
```

```diff
+   Status: CREATED
    contract WrappedTokenGatewayV3 (eth:0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C)
    +++ description: Aave V3 ETH gateway. Wraps ETH to WETH on deposits to the Aave main pool.
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0xda3A73F0E56b6f97204031f278F43D2175B6F50D)
    +++ description: EigenLayer EigenPod, one per staker. podOwner is set in initialize when the BeaconProxy is deployed by EigenPodManager and is not changeable afterwards. Validators staked through this pod have withdrawal credentials hardcoded to address(this), so beacon-chain withdrawals always exit into this pod. Function gates: onlyEigenPodManager: stake (msg.value must equal 32 ether, calls ETHPOS.deposit with this pod's withdrawal credentials), withdrawRestakedBeaconChainETH (sends ETH to a manager-supplied recipient, capped at withdrawableRestakedExecutionLayerGwei). onlyEigenPodOwner: recoverTokens (sweeps arbitrary ERC20 tokens to a caller-supplied recipient; does not touch native ETH or restaked balance accounting), setProofSubmitter. onlyOwnerOrProofSubmitter: startCheckpoint, verifyWithdrawalCredentials, requestConsolidation (forwards a fee + pubkey-pair payload to the EIP-7251 consolidation predeploy), requestWithdrawal (forwards a fee + pubkey/amount payload to the EIP-7002 withdrawal predeploy). Permissionless: receive() (accepts ETH from any caller, logs only), verifyCheckpointProofs (any caller advances the active checkpoint with valid Merkle proofs), verifyStaleBalance (any caller can mark a validator with stale balance to require a re-checkpoint). Each non-Manager entrypoint is independently gated by IPausable(eigenPodManager).paused(index) with a function-specific pause index, so EigenLayer's pause governance on EigenPodManager controls each operation separately.
```

```diff
+   Status: CREATED
    contract FeeReceiver (eth:0xdbC3363De051550D122D9C623CBaff441AFb477C)
    +++ description: Treasury that receives protocol fees. Fees are minted as rsETH to this address by LRTOracle.updateRSETHPrice() — the rebase function takes protocolFeeInBPS of the per-period reward and mints the equivalent rsETH here (subject to a daily fee-mint cap).
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xE15AFE000789160BE164D2FBA66EaDd6c6B81e7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeDelegator_A5 (eth:0xee5470E1519972C3eA95249d60EBD064af2D53D3)
    +++ description: Per-instance EigenLayer staker: holds an EigenPod for native-ETH restaking, ERC20 strategy shares for LST restaking, and delegates the resulting stake to a single EigenLayer operator via DelegationManager. Role checks consult IAccessControl on lrtConfig. Role gates: OPERATOR_ROLE: depositAssetIntoStrategy (deposits this contract's full balance of asset into IStrategy(lrtConfig.assetStrategy(asset)) via EIGEN_STRATEGY_MANAGER, recipient is address(this)), stake32Eth and stake32EthValidated (each consume 32 ether of this contract's ETH balance to register a validator via EigenPodManager.stake; withdrawal credentials derived from eigenPod, pubkey deduplicated through PUBKEY_REGISTRY, stakedButUnverifiedNativeETH += 32 ether), verifyWithdrawalCredentials (proves validators against eigenPod, stakedButUnverifiedNativeETH -= 32 ether per validator), startCheckpoint, processClaim (recipient is lrtConfig.eigenLayerRewardReceiver()), initiateUnstaking (withdrawer is address(this), bumps LRT_UNSTAKING_VAULT.uncompletedWithdrawalCount), completeUnstaking (forwards the resulting balance delta to LRT_UNSTAKING_VAULT when receiveAsTokens). MANAGER: delegateTo (caller picks the EigenLayer operator and supplies the operator's approverSignatureAndExpiry), createEigenPod (calls EigenPodManager.createPod and writes eigenPod, reverts if already set), undelegate (auto-queues one forced withdrawal per active strategy), maxApproveToEigenStrategyManager / revokeApprovalToEigenStrategyManager. ASSET_TRANSFER_ROLE: transferBackToLRTDepositPool, transferETHToLRTUnstakingVault. PAUSER_ROLE: pause. DEFAULT_ADMIN_ROLE: unpause. Caller-restricted: sendETHFromDepositPoolToNDC requires msg.sender == LRT_DEPOSIT_POOL, sendETHFromUnstakingVaultToNDC requires msg.sender == LRT_UNSTAKING_VAULT, receive() accepts ETH from any caller. eigenPod is also written lazily by stake32Eth on the first call when it is still zero (read from EigenPodManager.ownerToPod). whenNotPaused gates only depositAssetIntoStrategy, stake32Eth, processClaim, undelegate, initiateUnstaking, completeUnstaking, transferBackToLRTDepositPool and transferETHToLRTUnstakingVault; delegateTo, createEigenPod, verifyWithdrawalCredentials, startCheckpoint, the approve helpers, pause and unpause execute regardless of paused state.
```

```diff
+   Status: CREATED
    contract KelpRewardReceiverMultisig (eth:0xEe68dF9f661da6ED968Ea4cbF7EC68fcFE375bc6)
    +++ description: KelpRewardReceiverMultisig — set as LRTConfig.eigenLayerRewardReceiver. Receives EigenLayer rewards earned by Kelp's NodeDelegators. Does not directly mint or burn rsETH, but holds the reward value that ultimately backs rsETH; how this multisig redistributes those rewards (e.g. forwarding into LRTDepositPool) is what makes the rewards actually flow into the rsETH backing.
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0xf02D53d62af4E5c1E0769c36ED0353B29B443c58)
    +++ description: EigenLayer EigenPod, one per staker. podOwner is set in initialize when the BeaconProxy is deployed by EigenPodManager and is not changeable afterwards. Validators staked through this pod have withdrawal credentials hardcoded to address(this), so beacon-chain withdrawals always exit into this pod. Function gates: onlyEigenPodManager: stake (msg.value must equal 32 ether, calls ETHPOS.deposit with this pod's withdrawal credentials), withdrawRestakedBeaconChainETH (sends ETH to a manager-supplied recipient, capped at withdrawableRestakedExecutionLayerGwei). onlyEigenPodOwner: recoverTokens (sweeps arbitrary ERC20 tokens to a caller-supplied recipient; does not touch native ETH or restaked balance accounting), setProofSubmitter. onlyOwnerOrProofSubmitter: startCheckpoint, verifyWithdrawalCredentials, requestConsolidation (forwards a fee + pubkey-pair payload to the EIP-7251 consolidation predeploy), requestWithdrawal (forwards a fee + pubkey/amount payload to the EIP-7002 withdrawal predeploy). Permissionless: receive() (accepts ETH from any caller, logs only), verifyCheckpointProofs (any caller advances the active checkpoint with valid Merkle proofs), verifyStaleBalance (any caller can mark a validator with stale balance to require a re-checkpoint). Each non-Manager entrypoint is independently gated by IPausable(eigenPodManager).paused(index) with a function-specific pause index, so EigenLayer's pause governance on EigenPodManager controls each operation separately.
```

```diff
+   Status: CREATED
    contract NodeDelegator_A1 (eth:0xFc561966ceaAa09f4d6CBa4AdD54778c2bF1cB85)
    +++ description: Per-instance EigenLayer staker: holds an EigenPod for native-ETH restaking, ERC20 strategy shares for LST restaking, and delegates the resulting stake to a single EigenLayer operator via DelegationManager. Role checks consult IAccessControl on lrtConfig. Role gates: OPERATOR_ROLE: depositAssetIntoStrategy (deposits this contract's full balance of asset into IStrategy(lrtConfig.assetStrategy(asset)) via EIGEN_STRATEGY_MANAGER, recipient is address(this)), stake32Eth and stake32EthValidated (each consume 32 ether of this contract's ETH balance to register a validator via EigenPodManager.stake; withdrawal credentials derived from eigenPod, pubkey deduplicated through PUBKEY_REGISTRY, stakedButUnverifiedNativeETH += 32 ether), verifyWithdrawalCredentials (proves validators against eigenPod, stakedButUnverifiedNativeETH -= 32 ether per validator), startCheckpoint, processClaim (recipient is lrtConfig.eigenLayerRewardReceiver()), initiateUnstaking (withdrawer is address(this), bumps LRT_UNSTAKING_VAULT.uncompletedWithdrawalCount), completeUnstaking (forwards the resulting balance delta to LRT_UNSTAKING_VAULT when receiveAsTokens). MANAGER: delegateTo (caller picks the EigenLayer operator and supplies the operator's approverSignatureAndExpiry), createEigenPod (calls EigenPodManager.createPod and writes eigenPod, reverts if already set), undelegate (auto-queues one forced withdrawal per active strategy), maxApproveToEigenStrategyManager / revokeApprovalToEigenStrategyManager. ASSET_TRANSFER_ROLE: transferBackToLRTDepositPool, transferETHToLRTUnstakingVault. PAUSER_ROLE: pause. DEFAULT_ADMIN_ROLE: unpause. Caller-restricted: sendETHFromDepositPoolToNDC requires msg.sender == LRT_DEPOSIT_POOL, sendETHFromUnstakingVaultToNDC requires msg.sender == LRT_UNSTAKING_VAULT, receive() accepts ETH from any caller. eigenPod is also written lazily by stake32Eth on the first call when it is still zero (read from EigenPodManager.ownerToPod). whenNotPaused gates only depositAssetIntoStrategy, stake32Eth, processClaim, undelegate, initiateUnstaking, completeUnstaking, transferBackToLRTDepositPool and transferETHToLRTUnstakingVault; delegateTo, createEigenPod, verifyWithdrawalCredentials, startCheckpoint, the approve helpers, pause and unpause execute regardless of paused state.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xfD636E8EB3839cE82A58936b795043Da7DB0c734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerCommunityMultisig (eth:0xFEA47018D632A77bA579846c840d5706705Dc598)
    +++ description: None
```
