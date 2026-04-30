Generated with discovered.json: 0xeb8f6a85b512f264c5d0ee30ce017704ba0ad209

# Diff at Thu, 30 Apr 2026 09:32:27 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current timestamp: 1777382619

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract LRTDepositPool (eth:0x036676389e48133B63a802f8635AD39E752D375D)
    +++ description: Main user entrypoint for KelpDAO restaking. Accepts supported LSTs (stETH, ETHx) and native ETH, mints rsETH, and routes deposits to NodeDelegators which delegate to EigenLayer operators.
```

```diff
+   Status: CREATED
    contract NodeDelegator_B1 (eth:0x049EA11D337f185b1Aa910d98e8Fbd991f0FBA7B)
    +++ description: Per-operator delegator. Holds Kelp's deposited LSTs in EigenLayer strategies, runs an EigenPod for native ETH, and delegates voting power to a single EigenLayer operator. Deployed as multiple instances; each is paired one-to-one with the EigenLayer operator address it delegates to.
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
    contract StrategyBaseTVLLimits (eth:0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract TaskMailbox (eth:0x132b466d9d5723531F68797519DfED701aC2C749)
    +++ description: Task lifecycle manager where users create tasks with fee payments directed at specific executor operator sets, and executors submit results verified via BN254 or ECDSA certificate verification, with fee distribution on successful verification and refunds on task expiration.
```

```diff
+   Status: CREATED
    contract AVSDirectory (eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
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
    contract StrategyBaseTVLLimits (eth:0x298aFB19A105D59E74658C4C334Ff360BadE6dd2)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract KelpProtocolTreasury (eth:0x322F2d4bFe8280EeB713B7C51EEbA42590C36f78)
    +++ description: KelpProtocolTreasury — registered under PROTOCOL_TREASURY in LRTConfig. Receives the rsETH that LRTOracle.updateRSETHPrice() mints as the protocol fee on every rebase (sized by protocolFeeInBPS, capped by the daily fee-mint limit). This multisig holds the realized rsETH protocol revenue.
```

```diff
+   Status: CREATED
    contract LRTOracle (eth:0x349A73444b1a310BAe67ef67973022020d70020d)
    +++ description: Computes the rsETH/ETH exchange rate used by LRTDepositPool. Aggregates per-LST oracle adapters and the total restaked balance reported by NodeDelegators.
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
    +++ description: Per-operator delegator. Holds Kelp's deposited LSTs in EigenLayer strategies, runs an EigenPod for native ETH, and delegates voting power to a single EigenLayer operator. Deployed as multiple instances; each is paired one-to-one with the EigenLayer operator address it delegates to.
```

```diff
+   Status: CREATED
    contract BN254CertificateVerifier (eth:0x3F55654b2b2b86bB11bE2f72657f9C33bf88120A)
    +++ description: Verifies BLS (BN254 curve) certificates for EigenLayer operator sets by computing the aggregate public key of signers, performing pairing-based signature verification, and returning signed-stake weights for quorum threshold validation.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerOperationsMultisig2 (eth:0x461854d84Ee845F905e0eCf6C288DDEEb4A9533F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0x49bD9989E31aD35B0A62c20BE86335196A3135B1)
    +++ description: OpenZeppelin TimelockController. Owns Kelp's ProxyAdmin (so all proxy upgrades flow through it) and holds LRTConfig's TIME_LOCK_ROLE (so adding a new supported deposit asset is timelocked). Minimum delay is 10 days; the canceller can cancel before execution.
```

```diff
+   Status: CREATED
    contract NodeDelegator_A3 (eth:0x4C798C4653b1257D5149910523D7a6eeD5712F83)
    +++ description: Per-operator delegator. Holds Kelp's deposited LSTs in EigenLayer strategies, runs an EigenPod for native ETH, and delegates voting power to a single EigenLayer operator. Deployed as multiple instances; each is paired one-to-one with the EigenLayer operator address it delegates to.
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
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeDelegator_A4 (eth:0x545D69B99759E7b670Df243b882700121d6d3AB9)
    +++ description: Per-operator delegator. Holds Kelp's deposited LSTs in EigenLayer strategies, runs an EigenPod for native ETH, and delegates voting power to a single EigenLayer operator. Deployed as multiple instances; each is paired one-to-one with the EigenLayer operator address it delegates to.
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract KeyRegistrar (eth:0x54f4bC6bDEbe479173a2bbDc31dD7178408A57A4)
    +++ description: Manages the registration and deregistration of operator cryptographic keys (ECDSA or BN254/BLS) for specific operator sets, enforcing signature-based proof of key ownership and global uniqueness of keys across the protocol.
```

```diff
+   Status: CREATED
    contract OperatorTableUpdater (eth:0x5557E1fE3068A1e823cE5Dcd052c6C352E2617B5)
    +++ description: Central coordinator for EigenLayer's operator table system: accepts BN254-certified global Merkle table roots from a designated generator operator set, then allows Merkle proof submissions to push per-operator-set tables into the certificate verifier contracts.
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x57ba429517c3473B6d34CA9aCd56c0e735b94c02)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
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
    contract TimelockController (eth:0x738130BC8eADe1Bc65A9c056DEa636835896bc53)
    +++ description: A timelock that allows scheduling calls and executing or cancelling them with a delay.
```

```diff
+   Status: CREATED
    contract RewardsCoordinator (eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda)
    +++ description: Manages the distribution of rewards (arbitrary tokens, EIGEN) to restakers and commission to operators.
```

```diff
+   Status: CREATED
    contract NodeDelegator_B2 (eth:0x79f17234746344E0365D40be50d8d43DB9082c32)
    +++ description: Per-operator delegator. Holds Kelp's deposited LSTs in EigenLayer strategies, runs an EigenPod for native ETH, and delegates voting power to a single EigenLayer operator. Deployed as multiple instances; each is paired one-to-one with the EigenLayer operator address it delegates to.
```

```diff
+   Status: CREATED
    contract AaveProtocolDataProvider (eth:0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3)
    +++ description: Aave V3 read-only data provider. Lists every reserve and aToken in the Aave V3 main pool.
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x7CA911E83dabf90C90dD3De5411a10F1A6112184)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x7F68e9C17D22005688b8E6968fCe31e32B4B03d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BackingEigen (eth:0x83E9115d334D248Ce39a6f36144aEaB5b3456e75)
    +++ description: The token backing EIGEN and used for intersubjective staking.
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
    contract CrossChainRegistry (eth:0x9376A5863F2193cdE13e1aB7c678F22554E2Ea2b)
    +++ description: Allows AVSs to create generation reservations that configure and schedule the transport of operator tables (stake weight data) from L1 to whitelisted L2 chains, managing per-operator-set configs such as staleness periods and operator table calculators.
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x93c4b944D05dfe6df7645A86cd2206016c51564D)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenLayerBeigenOwningMultisig (eth:0x942eaF324971440384e4cA0ffA39fC3bb369D67d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LRTConfig (eth:0x947Cb49334e6571ccBFEF1f1f1178d8469D65ec7)
    +++ description: KelpDAO's central registry and access-control hub. Stores supported deposit assets, asset-to-strategy and asset-to-deposit-limit configuration, and the addresses of every other Kelp contract via a bytes32-keyed registry. Holds the OZ AccessControl role table that every other Kelp contract (LRTDepositPool, NodeDelegator, rsETH, ...) checks against — granting or revoking a role here propagates to the whole protocol.
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
    contract StrategyBaseTVLLimits (eth:0xa4C637e0F704745D182e4D38cAb7E7485321d059)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0xA91Dff6C41af892a89fC5C0Bf5C32B5CC89d13AC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UnlockedWithdrawalsInitializer (eth:0xa9B1CED1839bA07c4E8AaEF45BB60c8B27B35595)
    +++ description: Holds the UNLOCKED_WITHDRAWAL_INITIALIZER role on LRTConfig. Initiates withdrawal flows on LRTWithdrawalManager that bypass the standard cooldown — used for emergency or operational unlocks.
```

```diff
+   Status: CREATED
    contract EigenStrategy (eth:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0xAe60d8180437b5C34bB956822ac2710972584473)
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
    +++ description: None
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
    +++ description: Holds and accounts for LST balances queued for unstaking from EigenLayer. Receives unstaked LSTs from NodeDelegators and forwards them to LRTWithdrawalManager.
```

```diff
+   Status: CREATED
    contract KelpManagerMultisig (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1)
    +++ description: KelpManagerMultisig — operational admin of the rsETH protocol. Holds three roles on LRTConfig: MANAGER (can raise per-asset deposit limits, change protocolFeeInBPS — which directly affects how much rsETH is minted to the treasury on every LRTOracle rebase, and set the EigenLayer reward receiver), PAUSER_ROLE (can pause LRTDepositPool, LRTOracle, LRTWithdrawalManager and rsETH transfers), and OPERATOR_ROLE (can drive NodeDelegator workflows: deposit pooled LSTs into EigenLayer strategies, queue/complete withdrawals, manage validators). Cannot grant roles or replace contracts. Effectively controls the day-to-day economics and operational state of rsETH issuance and redemption.
```

```diff
+   Status: CREATED
    contract ECDSACertificateVerifier (eth:0xd0930ee96D07de4F9d493c259232222e46B6EC25)
    +++ description: Verifies ECDSA-based certificates for EigenLayer operator sets by recovering signer addresses from concatenated signatures, confirming each signer is a registered operator, and tallying their stake weights against quorum thresholds.
```

```diff
+   Status: CREATED
    contract WrappedTokenGatewayV3 (eth:0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C)
    +++ description: Aave V3 ETH gateway. Wraps ETH to WETH on deposits to the Aave main pool.
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0xda3A73F0E56b6f97204031f278F43D2175B6F50D)
    +++ description: None
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
    contract Eigen Token (eth:0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83)
    +++ description: The EIGEN token can be socially forked to slash operators for data withholding attacks (and other intersubjectively attributable faults). EIGEN is a wrapper over a second token, bEIGEN, which will be used solely for intersubjective staking. Forking EIGEN means changing the canonical implementation of the bEIGEN token in the EIGEN token contract.
```

```diff
+   Status: CREATED
    contract ReleaseManager (eth:0xeDA3CAd031c0cf367cF3f517Ee0DC98F9bA80C8F)
    +++ description: Manages software release lifecycle for EigenLayer operator sets, allowing AVS owners to publish versioned releases (containing artifact digests, registry URLs, and upgrade-by deadlines) and metadata URIs that operators can query for required software versions.
```

```diff
+   Status: CREATED
    contract NodeDelegator_A5 (eth:0xee5470E1519972C3eA95249d60EBD064af2D53D3)
    +++ description: Per-operator delegator. Holds Kelp's deposited LSTs in EigenLayer strategies, runs an EigenPod for native ETH, and delegates voting power to a single EigenLayer operator. Deployed as multiple instances; each is paired one-to-one with the EigenLayer operator address it delegates to.
```

```diff
+   Status: CREATED
    contract KelpRewardReceiverMultisig (eth:0xEe68dF9f661da6ED968Ea4cbF7EC68fcFE375bc6)
    +++ description: KelpRewardReceiverMultisig — set as LRTConfig.eigenLayerRewardReceiver. Receives EigenLayer rewards earned by Kelp's NodeDelegators. Does not directly mint or burn rsETH, but holds the reward value that ultimately backs rsETH; how this multisig redistributes those rewards (e.g. forwarding into LRTDepositPool) is what makes the rewards actually flow into the rsETH backing.
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0xf02D53d62af4E5c1E0769c36ED0353B29B443c58)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeDelegator_A1 (eth:0xFc561966ceaAa09f4d6CBa4AdD54778c2bF1cB85)
    +++ description: Per-operator delegator. Holds Kelp's deposited LSTs in EigenLayer strategies, runs an EigenPod for native ETH, and delegates voting power to a single EigenLayer operator. Deployed as multiple instances; each is paired one-to-one with the EigenLayer operator address it delegates to.
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
