Generated with discovered.json: 0x4ac9582a62db76e4a69a3247be46002631faf4e9

# Diff at Mon, 27 Jul 2026 15:11:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1785159796

## Description

Lido v3.0.2 activates Staking Router v3 together with Community Staking
Module v3 and Curated Module v2. The upgrade adds EIP-7251 support for
validator consolidations and balance top-ups, changes protocol accounting and
exit limits to use validator balance weights, and extends oracle sanity checks
for the new balance flows.

The release also deploys the stVault system built around VaultHub,
OperatorGrid, VaultFactory, Dashboard, CoreAccounting, and LazyOracle. It adds
supporting contracts for predeposit proofs, EIP-7002 triggerable withdrawals,
exit penalties, consolidation migration, and the associated governance and
permission wiring.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa) [global/DepositContract]
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract ExitPenalties (eth:0x004aFb7DAA7dEA20EbAaB75c9F4892C879FaCCe0) [lido/ExitPenalties]
    +++ description: Records delayed-exit, triggerable-withdrawal, and poor-performance penalties for a permissionless staking module.
```

```diff
+   Status: CREATED
    contract VaultFactory (eth:0x02Ca7772FF14a9F6c1a08aF385aA96bb1b34175A) [lido/VaultFactory]
    +++ description: Permissionless factory for StakingVaults and their Dashboard management contracts. It deploys beacon proxies, initializes their code-defined authorities, and optionally connects the vault to VaultHub.
```

```diff
+   Status: CREATED
    contract StakingVault (eth:0x06A56487494aa080deC7Bf69128EdA9225784553) [lido/StakingVault]
    +++ description: An isolated staking position that holds ETH for validators with 0x02 withdrawal credentials. The owner controls funds and validator operations, the depositor performs Beacon Chain deposits, and the node operator can force validator exits. Vaults normally use a beacon implementation but can irreversibly pin their current implementation.
```

```diff
+   Status: CREATED
    contract ExitPenalties (eth:0x06cd61045f958A209a0f8D746e103eCc625f4193) [lido/ExitPenalties]
    +++ description: Records delayed-exit, triggerable-withdrawal, and poor-performance penalties for a permissionless staking module.
```

```diff
+   Status: CREATED
    contract ValidatorsExitBusOracle (eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) [lido/ValidatorsExitBusOracle]
    +++ description: Receives committee-consensus lists of validators that staking modules must exit and emits the exit requests. SRv3 accounts for the validators' effective-balance weights and key indices when applying per-report and replenishing exit limits.
```

```diff
+   Status: CREATED
    contract OracleReportSanityChecker (eth:0x147f8d3cf3004FAf9Bf94E88B54b6C06De507be9) [lido/OracleReportSanityChecker]
    +++ description: Validates AccountingOracle report values against configurable safety limits. The version 3 checker covers validator balance flows, consolidations, external pending balances, triggerable exits, and EIP-7251 balance weights.
```

```diff
+   Status: CREATED
    contract Escrow (eth:0x165813A31446a98c84E20Dda8C101BB3C8228e1c) [lido/Escrow]
    +++ description: Dual Governance escrow in which holders lock stETH, wstETH or unstETH to build veto support. It can be irreversibly converted into a Rage Quit escrow that withdraws the locked position as ETH.
```

```diff
+   Status: CREATED
    contract ConsolidationGateway (eth:0x17be979344f2c2cC806229a532D92f8742C10462) [lido/ConsolidationGateway]
    +++ description: Validates validator ownership proofs and submits EIP-7251 consolidation requests through the protocol consolidation-request predeploy. It rate-limits the amount consolidated and preserves its ETH balance across requests.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x18A1065c81b0Cc356F1b1C843ddd5E14e4AefffF) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract VaultHub (eth:0x1d201BE093d847f6446530Efb0E8Fb426d176709) [lido/VaultHub]
    +++ description: The central registry and lifecycle manager for stVaults connected to Lido. It enforces collateral and risk parameters, tracks vault reports and liabilities, mints and burns stETH shares, settles fees, rebalances unhealthy vaults, and manages bad debt.
```

```diff
+   Status: CREATED
    contract CuratedGate (eth:0x207798e6fD1aa7Ee8a63782A64c959cD6727b78C) [lido/CuratedGate]
    +++ description: Merkle-gated onboarding contract for a curated Community Staking Module cohort. An eligible address consumes its proof to create a node operator with this gate's configured bond curve and metadata group.
```

```diff
+   Status: CREATED
    contract Executor (eth:0x23E0B465633FF5178808F4A75186E2F2F9537021) [lido/Executor]
    +++ description: External-call executor used by the Dual Governance timelock. Its owner can make it call any target with arbitrary calldata and ETH.
```

```diff
+   Status: CREATED
    contract Core Accounting (eth:0x23ED611be0e1a820978875C0122F92260804cdDf) [lido/CoreAccounting]
    +++ description: Calculates and applies a complete Lido oracle report: it reconciles validator balances, smooths the rebase, collects vault balances, finalizes withdrawals, burns shares, distributes module rewards, and updates stETH accounting.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x2570e0b22AD904501dfB0d49575991ACB801dD91) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRateNotifier (eth:0x25e35855783bec3E49355a29e110f02Ed8b05ba9) [lido/TokenRateNotifier]
    +++ description: Pushes the current stETH token rate to registered observer contracts after rebases.
```

```diff
+   Status: CREATED
    contract VaultsAdapter (eth:0x28F9Ac198C4E0FA6A9Ad2c2f97CB38F1A3120f27) [lido/VaultsAdapter]
    +++ description: EasyTrack adapter for stVault administration. The EVMScriptExecutor may change vault fees and jail status, liability targets, socialize bad debt, and force validator exits; a separate trusted caller controls the maximum exit fee and ETH recovery.
```

```diff
+   Status: CREATED
    contract Dashboard (eth:0x294825c2764c7D412dc32d87E2242c4f1D989AF3) [lido/Dashboard]
    +++ description: The standard role-based management interface for a StakingVault. It owns the underlying vault, routes funding, withdrawals, stETH minting and burning through VaultHub, controls validator operations, and accounts for the node operator fee.
```

```diff
+   Status: CREATED
    contract Voting (eth:0x2e59A20f205bB85a89C53f1936454680651E618e) [lido/Voting]
    +++ description: Lido DAO's Aragon token voting application. LDO holders vote on executable DAO scripts, with configurable support, quorum, vote duration, and an objection phase.
```

```diff
+   Status: CREATED
    contract Accounting (eth:0x2F91e3A8C5d6593bf4F8403fCfeCcd62dF59f6F6) [lido/Accounting]
    +++ description: Manages node-operator bonds for a permissionless staking module. It accepts ETH, stETH and wstETH bonds, applies bond curves, locks or penalizes bond, and lets eligible node-operator addresses claim rewards after the module's fee distribution.
```

```diff
+   Status: CREATED
    contract FeeDistributor (eth:0x367d23c756599c20DCc8D6943F4976E8F88D60d7) [lido/FeeDistributor]
    +++ description: Receives a staking module's stETH fee shares and distributes them to node operators according to a Merkle tree submitted by its FeeOracle. Claims are accounted in stETH shares.
```

```diff
+   Status: CREATED
    contract Execution Layer Rewards Vault (eth:0x388C818CA8B9251b393131C08a736A67ccB19297) [lido/LidoExecutionLayerRewardsVault]
    +++ description: Holds execution-layer validator rewards until stETH accounting collects them during an oracle report.
```

```diff
+   Status: CREATED
    contract CuratedGate (eth:0x3BbBb175f7F07954DE00052b20E1c5572223F24D) [lido/CuratedGate]
    +++ description: Merkle-gated onboarding contract for a curated Community Staking Module cohort. An eligible address consumes its proof to create a node operator with this gate's configured bond curve and metadata group.
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0x3D3ba54D54bbFF40F2Dfa2A8e27bD4dE3dab2951) [lido/TiebreakerSubCommittee]
    +++ description: A tiebreaker subcommittee whose members reach quorum on a proposal before forwarding it to the top-level tiebreaker committee.
```

```diff
+   Status: CREATED
    contract Lido Dao Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) [lido/LidoDaoAgent]
    +++ description: The Lido DAO's Aragon execution and treasury agent. It can transfer assets, execute arbitrary calls or scripts, and validate signatures according to granular ACL permissions.
```

```diff
+   Status: CREATED
    contract StakingVault (eth:0x3eda1e756Ba9aC0217Ac8fc5db4C5E9a8486d9c4) [lido/StakingVault]
    +++ description: An isolated staking position that holds ETH for validators with 0x02 withdrawal credentials. The owner controls funds and validator operations, the depositor performs Beacon Chain deposits, and the node operator can force validator exits. Vaults normally use a beacon implementation but can irreversibly pin their current implementation.
```

```diff
+   Status: CREATED
    contract TopUpGateway (eth:0x3FC2C71579D80790Aaa3fc7Be8B66ac39dC57374) [lido/TopUpGateway]
    +++ description: Validates consensus-layer proofs and submits EIP-7251 validator top-ups for staking modules. It limits top-up batch size, proof age, and call frequency.
```

```diff
+   Status: CREATED
    contract FeeOracle (eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB) [lido/FeeOracle]
    +++ description: Receives committee-consensus reports containing a staking module's reward-distribution Merkle root and forwards them to FeeDistributor and ValidatorStrikes.
```

```diff
+   Status: CREATED
    contract Accounting (eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) [lido/Accounting]
    +++ description: Manages node-operator bonds for a permissionless staking module. It accepts ETH, stETH and wstETH bonds, applies bond curves, locks or penalizes bond, and lets eligible node-operator addresses claim rewards after the module's fee distribution.
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) [lido/NodeOperatorsRegistry]
    +++ description: Legacy permissioned staking module for curated node operators. It stores validator keys, receives deposits from the StakingRouter, tracks exited and stuck validators, and distributes module rewards.
```

```diff
+   Status: CREATED
    contract TimelockedGovernance (eth:0x553337946F2FAb8911774b20025fa776B76a7CcE) [lido/TimelockedGovernance]
    +++ description: Emergency governance adapter. Its configured governance may submit and cancel proposals in the EmergencyProtectedTimelock; scheduling is permissionless once the submission delay has elapsed.
```

```diff
+   Status: CREATED
    contract Lido DAO Token (eth:0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32) [lido/MiniMeToken]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CallsScript (eth:0x5cEb19e1890f677c3676d5ecDF7c501eBA01A054) [lido/CallsScript]
    +++ description: Petrified Aragon CallsScript executor library used by the Lido DAO and EasyTrack to decode and perform a batch of external calls.
```

```diff
+   Status: CREATED
    contract LazyOracle (eth:0x5DB427080200c235F2Ae8Cd17A7be87921f7AD6c) [lido/LazyOracle]
    +++ description: Verifies cryptographic oracle reports for individual stVaults and forwards accepted total-value, fee, and liability updates to VaultHub. Reports outside configured rate, reward, or quarantine bounds are rejected or quarantined.
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (eth:0x5FbE8cEf9CCc56ad245736D3C5bAf82ad54Ca789) [global/UpgradeableBeacon]
    +++ description: A beacon with an upgradeable implementation currently set as eth:0x06A56487494aa080deC7Bf69128EdA9225784553. Beacon proxy contracts pointing to this beacon will all use its implementation.
```

```diff
+   Status: CREATED
    contract CircuitBreaker (eth:0x6019CB557978296BA3C08a7B73225C0975DFB2F7) [lido/CircuitBreaker]
    +++ description: Emergency pause coordinator. The admin assigns one heartbeat-gated pauser to each registered protocol contract; a live pauser can trigger one time-bounded pause before its assignment is consumed.
```

```diff
+   Status: CREATED
    contract CuratedGate (eth:0x6093EFA6B5E2FF3be54d1c895c9deA932805c49F) [lido/CuratedGate]
    +++ description: Merkle-gated onboarding contract for a curated Community Staking Module cohort. An eligible address consumes its proof to create a node operator with this gate's configured bond curve and metadata group.
```

```diff
+   Status: CREATED
    contract Ejector (eth:0x610B517D380f287c239C93F8eF6FfBd567AA4bA5) [lido/Ejector]
    +++ description: Submits triggerable full-withdrawal requests for validators. Node operators may voluntarily eject their own validators, while ValidatorStrikes can eject validators for poor performance.
```

```diff
+   Status: CREATED
    contract StakingVault (eth:0x62e0D92cf7B8752b5292B9BCbbacE4cFa1633428) [lido/StakingVault]
    +++ description: An isolated staking position that holds ETH for validators with 0x02 withdrawal credentials. The owner controls funds and validator operations, the depositor performs Beacon Chain deposits, and the node operator can force validator exits. Vaults normally use a beacon implementation but can irreversibly pin their current implementation.
```

```diff
+   Status: CREATED
    contract HashConsensus (eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4) [lido/HashConsensus]
    +++ description: Collects report hashes from an enumerable oracle committee and forwards a report to its processor once quorum agrees. It defines report frames, quorum, fast-lane members, and the report processor.
```

```diff
+   Status: CREATED
    contract Lido Multisig 1 (eth:0x73b047fe6337183A454c5217241D780a932777bD) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CuratedGate (eth:0x773933F9db8964A17d62fb808f2EC7A2de4247CC) [lido/CuratedGate]
    +++ description: Merkle-gated onboarding contract for a curated Community Staking Module cohort. An eligible address consumes its proof to create a node operator with this gate's configured bond curve and metadata group.
```

```diff
+   Status: CREATED
    contract ResealManager (eth:0x7914b5a1539b97Bd0bbd155757F25FD79A522d24) [lido/ResealManager]
    +++ description: Adapter that lets the governance configured in the EmergencyProtectedTimelock indefinitely extend an existing pause or resume a supported sealable contract.
```

```diff
+   Status: CREATED
    contract Wrapped liquid staked Ether 2.0 Token (eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) [lido/wstETH]
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a) [lido/HashConsensus]
    +++ description: Collects report hashes from an enumerable oracle committee and forwards a report to its processor once quorum agrees. It defines report frames, quorum, fast-lane members, and the report processor.
```

```diff
+   Status: CREATED
    contract AccountingOracle (eth:0x852deD011285fe67063a08005c71a85690503Cee) [lido/AccountingOracle]
    +++ description: Receives committee-consensus reports of Lido's Beacon Chain balances, validator state, withdrawals, and staking-module accounting data, then drives the stETH accounting rebase and related protocol updates.
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A) [lido/EVMScriptRegistry]
    +++ description: Aragon registry of EVM script executors used by Lido DAO applications.
```

```diff
+   Status: CREATED
    contract CuratedGate (eth:0x86A8d4E0db5938D21d98047544668FCCB1A9ADc8) [lido/CuratedGate]
    +++ description: Merkle-gated onboarding contract for a curated Community Staking Module cohort. An eligible address consumes its proof to create a node operator with this gate's configured bond curve and metadata group.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x8772E3a2D86B9347A2688f9bc1808A6d8917760C) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalQueueERC721 (eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) [lido/WithdrawalQueueERC721]
    +++ description: Queues stETH and wstETH withdrawal requests as transferable NFTs. Oracle reports can enter bunker mode and finalize batches by supplying ETH and a maximum share rate, after which NFT owners claim ETH.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x8B7854488Fde088d686Ea672B6ba1A5242515f45) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CuratedGate (eth:0x8c002c6eE10cf8adb78D1F9EB2e134FdaF8A7C1a) [lido/CuratedGate]
    +++ description: Merkle-gated onboarding contract for a curated Community Staking Module cohort. An eligible address consumes its proof to create a node operator with this gate's configured bond curve and metadata group.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x8ed4dfd3A610CCF1FB45e797bf5D8e0f93084F22) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeOracle (eth:0x8EeFCdbD984c30E472BcbF545783D051CB5114e5) [lido/FeeOracle]
    +++ description: Receives committee-consensus reports containing a staking module's reward-distribution Merkle root and forwards them to FeeDistributor and ValidatorStrikes.
```

```diff
+   Status: CREATED
    contract EIP712StETH (eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7) [lido/EIP712StETH]
    +++ description: Stateless helper that builds the stETH EIP-712 domain separator and typed-data hashes.
```

```diff
+   Status: CREATED
    contract HashConsensus (eth:0x902D64c93F6595339aA46105627a085591051aFb) [lido/HashConsensus]
    +++ description: Collects report hashes from an enumerable oracle committee and forwards a report to its processor once quorum agrees. It defines report frames, quorum, fast-lane members, and the report processor.
```

```diff
+   Status: CREATED
    contract MiniMeTokenFactory (eth:0x909d05F384D0663eD4BE59863815aB43b4f347Ec) [lido/MiniMeTokenFactory]
    +++ description: Immutable factory used by LDO's MiniMe token implementation to create snapshot-enabled token clones.
```

```diff
+   Status: CREATED
    contract Lido DAO ACL (eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) [lido/ACL]
    +++ description: The shared Aragon ACL that stores Lido DAO permission grants, optional permission parameters, and the manager allowed to grant or revoke each app role.
```

```diff
+   Status: CREATED
    contract ParametersRegistry (eth:0x9D28ad303C90DF524BA960d7a2DAC56DcC31e428) [lido/ParametersRegistry]
    +++ description: Stores configurable Community Staking Module parameters, including bond curves, operator rewards, penalties, key limits, queue policy, performance thresholds, and validator-exit rules.
```

```diff
+   Status: CREATED
    contract ConsolidationMigrator (eth:0x9Dc70b5A4f4F5E4AF9058C983D560564F031f1D7) [lido/ConsolidationMigrator]
    +++ description: Coordinates the one-time migration of eligible Curated Module v1 validators into Curated Module v2 through the delayed ConsolidationBus pipeline.
```

```diff
+   Status: CREATED
    contract VettedGate (eth:0xa12760721A72A7199aB38059DA6690b9Cd4ed7B8) [lido/VettedGate]
    +++ description: Merkle-gated node-operator onboarding contract. Eligible addresses can create an operator using the configured bond curve, or an existing operator owner can consume a proof to claim that curve.
```

```diff
+   Status: CREATED
    contract ImmutableDualGovernanceConfigProvider (eth:0xa1692Af6FDfdD1030E4E9c4Bc429986FA64CB5EF) [lido/ImmutableDualGovernanceConfigProvider]
    +++ description: Immutable Dual Governance timing and veto-threshold configuration. Replacing the provider in DualGovernance is the only way to change these parameters.
```

```diff
+   Status: CREATED
    contract MetaRegistry (eth:0xA64b339eebD3dC3De848298B6a140955932901d8) [lido/MetaRegistry]
    +++ description: Stores metadata that groups permissionless staking-module node operators, describes their operators, and assigns bond-curve weights.
```

```diff
+   Status: CREATED
    contract wstETH Referral Staker (eth:0xa88f0329C2c4ce51ba3fc619BBf44efE7120Dd0d) [lido/WstETHReferralStaker]
    +++ description: Permissionless convenience contract that stakes supplied ETH in Lido with a caller-selected referral, wraps the resulting stETH, and returns wstETH to the caller.
```

```diff
+   Status: CREATED
    contract ValidatorStrikes (eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f) [lido/ValidatorStrikes]
    +++ description: Stores the oracle-provided Merkle root of validator performance strikes. Proven strike data can cause a poor-performing validator to be ejected and penalized.
```

```diff
+   Status: CREATED
    contract ValidatorConsolidationRequests (eth:0xaC4Aae7123248684C405A4b0038C1560EC7fE018) [lido/ValidatorConsolidationRequests]
    +++ description: Read-only stVault helper that validates a Dashboard's ownership of a connected StakingVault and builds the EIP-7251 consolidation-request calldata and fee-exemption call for its source and target validators.
```

```diff
+   Status: CREATED
    contract Liquid staked Ether 2.0 Token (eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) [lido/stETH]
    +++ description: The rebasing stETH token and Lido protocol accounting entrypoint. It accepts stake, accounts for consensus- and execution-layer balances, mints and burns shares, and applies oracle reports. Version 3 adds external stake-backed shares and balance-based validator accounting.
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433) [lido/NodeOperatorsRegistry]
    +++ description: Legacy permissioned staking module for curated node operators. It stores validator keys, receives deposits from the StakingRouter, tracks exited and stuck validators, and distributes module rewards.
```

```diff
+   Status: CREATED
    contract VettedGate (eth:0xB314D4A76C457c93150d308787939063F4Cc67E0) [lido/VettedGate]
    +++ description: Merkle-gated node-operator onboarding contract. Eligible addresses can create an operator using the configured bond curve, or an existing operator owner can consume a proof to claim that curve.
```

```diff
+   Status: CREATED
    contract PermissionlessGate (eth:0xb8cd8F059Ad7a5dB8CAfDe34aAb007317F7156C8) [lido/PermissionlessGate]
    +++ description: Permissionless Community Staking Module onboarding contract. Any address can create a node operator using its fixed bond curve by depositing ETH, stETH or wstETH.
```

```diff
+   Status: CREATED
    contract Lido DAO Kernel (eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc) [lido/Kernel]
    +++ description: The Lido DAO's Aragon Kernel. It registers DAO applications and their implementation bases and points them to the shared ACL.
```

```diff
+   Status: CREATED
    contract WithdrawalVault (eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) [lido/WithdrawalVault]
    +++ description: Holds consensus-layer withdrawals and pays protocol predeploy fees. It lets stETH collect withdrawn ETH and lets the designated gateways submit EIP-7002 withdrawal and EIP-7251 consolidation requests.
```

```diff
+   Status: CREATED
    contract Finance (eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86) [lido/Finance]
    +++ description: Lido DAO's Aragon Finance application. ACL roles create and execute one-time or recurring treasury payments and change their budgets, recipients, amounts and accounting period.
```

```diff
+   Status: CREATED
    contract ValidatorExitDelayVerifier (eth:0xbDb567672c867DB533119C2dcD4FB9d8b44EC82f) [lido/ValidatorExitDelayVerifier]
    +++ description: Permissionless EIP-4788 proof verifier that detects validators which remained active after a ValidatorExitBus exit request and reports their exit delay to the StakingRouter.
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0xBF048f2111497B6Df5E062811f5fC422804D4baE) [lido/TiebreakerSubCommittee]
    +++ description: A tiebreaker subcommittee whose members reach quorum on a proposal before forwarding it to the top-level tiebreaker committee.
```

```diff
+   Status: CREATED
    contract OracleDaemonConfig (eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09) [lido/OracleDaemonConfig]
    +++ description: Stores key-value configuration consumed by Lido's off-chain oracle daemon.
```

```diff
+   Status: CREATED
    contract LidoLocator (eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) [lido/LidoLocator]
    +++ description: Canonical registry of the active Lido core, oracle, staking, withdrawal, top-up, consolidation, and StakingVault subsystem contract addresses.
```

```diff
+   Status: CREATED
    contract DualGovernance (eth:0xC1db28B3301331277e307FDCfF8DE28242A4486E) [lido/DualGovernance]
    +++ description: Lido Dual Governance state machine. Registered proposers submit calls through an associated executor, while stETH, wstETH and unstETH holders can lock assets in an escrow to delay or stop governance execution and enter Rage Quit.
```

```diff
+   Status: CREATED
    contract Community Staking Module Verifier (eth:0xC392F457960f1B13Ebaf1aa6C065479dD507E1E3) [lido/CSVerifier]
    +++ description: Permissionless beacon-state proof verifier for a Community Staking Module. Valid proofs report validator balances, withdrawals and slashing to the connected module.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xC52fC3081123073078698F1EAc2f1Dc7Bd71880f) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OperatorGrid (eth:0xC69685E89Cefc327b43B7234AC646451B27c544d) [lido/OperatorGrid]
    +++ description: Registry of stVault node-operator groups and risk tiers. It defines per-tier share limits, reserve ratios, forced-rebalance thresholds and fees, coordinates two-party tier changes, and can jail vaults.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xC7792b3F2B399bB0EdF53fECDceCeB97FBEB18AF) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProtectedTimelock (eth:0xCE0425301C85c5Ea2A0873A2dEe44d78E02D2316) [lido/EmergencyProtectedTimelock]
    +++ description: Timelock used by Dual Governance. Governance submits and schedules batches, anyone may execute a ready batch, and time-bounded emergency committees can activate emergency mode and execute already submitted proposals without the ordinary schedule delay.
```

```diff
+   Status: CREATED
    contract StakingVault (eth:0xd402937b3Ff3c187f727C1146a9E846275E9F711) [lido/StakingVault]
    +++ description: An isolated staking position that holds ETH for validators with 0x02 withdrawal credentials. The owner controls funds and validator operations, the depositor performs Beacon Chain deposits, and the node operator can force validator exits. Vaults normally use a beacon implementation but can irreversibly pin their current implementation.
```

```diff
+   Status: CREATED
    contract HashConsensus (eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288) [lido/HashConsensus]
    +++ description: Collects report hashes from an enumerable oracle committee and forwards a report to its processor once quorum agrees. It defines report frames, quorum, fast-lane members, and the report processor.
```

```diff
+   Status: CREATED
    contract ConsolidationBus (eth:0xd907CE33B4Be423823d1CFFe80BD147E8b8554C8) [lido/ConsolidationBus]
    +++ description: Queues validator consolidation batches and, after an execution delay, forwards proven EIP-7251 requests to ConsolidationGateway.
```

```diff
+   Status: CREATED
    contract FeeDistributor (eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) [lido/FeeDistributor]
    +++ description: Receives a staking module's stETH fee shares and distributes them to node operators according to a Merkle tree submitted by its FeeOracle. Claims are accounted in stETH shares.
```

```diff
+   Status: CREATED
    contract CuratedModule (eth:0xDa5F930cE326EB5205085D66c72A4E79d60cB8C1) [lido/CuratedModule]
    +++ description: The permissioned Curated Staking Module. It manages approved node operators and validator keys, accepts deposits and top-ups from the StakingRouter, and processes validator lifecycle reports and penalties.
```

```diff
+   Status: CREATED
    contract CSModule (eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) [lido/CSModule]
    +++ description: Lido's permissionless Community Staking Module. It manages node operators and validator keys, accepts router deposits and top-ups, processes validator exits, and applies bond-backed penalties.
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0xDBfa0B8A15a503f25224fcA5F84a3853230A715C) [lido/TiebreakerSubCommittee]
    +++ description: A tiebreaker subcommittee whose members reach quorum on a proposal before forwarding it to the top-level tiebreaker committee.
```

```diff
+   Status: CREATED
    contract TriggerableWithdrawalsGateway (eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B) [lido/TriggerableWithdrawalsGateway]
    +++ description: The permissioned entrypoint for full EIP-7002 validator withdrawals. It charges the current request fee, applies a replenishing global exit limit, forwards requests to WithdrawalVault, and notifies StakingRouter.
```

```diff
+   Status: CREATED
    contract Ejector (eth:0xe181A377A2d2BDE9A83f1474BC3DB7A412de091E) [lido/Ejector]
    +++ description: Submits triggerable full-withdrawal requests for validators. Node operators may voluntarily eject their own validators, while ValidatorStrikes can eject validators for poor performance.
```

```diff
+   Status: CREATED
    contract StakingVault (eth:0xE2cC063DEc5685718Bd57aAC6AEE9941b25b7c37) [lido/StakingVault]
    +++ description: An isolated staking position that holds ETH for validators with 0x02 withdrawal credentials. The owner controls funds and validator operations, the depositor performs Beacon Chain deposits, and the node operator can force validator exits. Vaults normally use a beacon implementation but can irreversibly pin their current implementation.
```

```diff
+   Status: CREATED
    contract Burner (eth:0xE76c52750019b80B43E36DF30bf4060EB73F573a) [lido/Burner]
    +++ description: Escrows stETH shares requested for cover or non-cover burning and burns them during an oracle report. Excess stETH can be recovered into the Lido protocol during migration.
```

```diff
+   Status: CREATED
    contract CuratedGate (eth:0xeF273Ca4A21Ba7B414Ae3C9f9b443038cb133F72) [lido/CuratedGate]
    +++ description: Merkle-gated onboarding contract for a curated Community Staking Module cohort. An eligible address consumes its proof to create a node operator with this gate's configured bond curve and metadata group.
```

```diff
+   Status: CREATED
    contract EasyTrack (eth:0xF0211b7660680B49De1A7E9f25C65660F0a13Fea) [lido/EasyTrack]
    +++ description: Optimistic Lido DAO motion system. Approved factories restrict the target and selector of each motion; LDO holders can object, and an unobstructed motion is executed through the EVMScriptExecutor after its delay.
```

```diff
+   Status: CREATED
    contract ValidatorStrikes (eth:0xf4618370a1fBf46905B16C10817c8CFaD924D6db) [lido/ValidatorStrikes]
    +++ description: Stores the oracle-provided Merkle root of validator performance strikes. Proven strike data can cause a poor-performing validator to be ejected and penalized.
```

```diff
+   Status: CREATED
    contract PredepositGuarantee (eth:0xF4bF42c6D6A0E38825785048124DBAD6c9eaaac3) [lido/PredepositGuarantee]
    +++ description: Protects StakingVault deposits by proving validator withdrawal credentials and requiring an initial predeposit before the remaining validator deposit is sent.
```

```diff
+   Status: CREATED
    contract DepositSecurityModule (eth:0xF573E9E3de1f86B085417ab294f56E7920B4e9Be) [lido/DepositSecurityModule]
    +++ description: Guardian-based circuit breaker for legacy staking-module deposits. Guardians can collectively pause deposits if a malicious or stale deposit is observed, while the owner configures guardians and resumes deposits.
```

```diff
+   Status: CREATED
    contract TiebreakerCoreCommittee (eth:0xf65614d73952Be91ce0aE7Dd9cFf25Ba15bEE2f5) [lido/TiebreakerCoreCommittee]
    +++ description: Top-level Dual Governance tiebreaker committee. Its members reach quorum to schedule a delayed governance proposal or resume a paused sealable contract when Dual Governance is tied.
```

```diff
+   Status: CREATED
    contract TokenManager (eth:0xf73a1260d222f447210581DDf212D915c09a3249) [lido/TokenManager]
    +++ description: Aragon TokenManager for LDO. Its ACL roles can issue supply, mint or burn LDO, assign vested balances, and revoke vesting.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xf8Bfa395744Cb25fa4368Ffe2344Dc35546092d9) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract MEV Boost Relay Allowed List (eth:0xF95f069F9AD107938F6ba802a3da87892298610E) [lido/MEVBoostRelayAllowedList]
    +++ description: Registry of MEV-Boost relay endpoints supported by Lido node operators. The list distinguishes mandatory relays from optional relays and is consumed offchain.
```

```diff
+   Status: CREATED
    contract Community Staking Module Verifier (eth:0xfce7aB839e55de77730716D05b3553e45ab3A5Ba) [lido/CSVerifier]
    +++ description: Permissionless beacon-state proof verifier for a Community Staking Module. Valid proofs report validator balances, withdrawals and slashing to the connected module.
```

```diff
+   Status: CREATED
    contract StakingRouter (eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999) [lido/StakingRouter]
    +++ description: Coordinates Lido staking modules, allocates deposits and top-ups, tracks validator balances and exit states, and distributes staking rewards. Version 3 uses validator balances instead of validator counts and supports EIP-7251 compounding validators.
```

```diff
+   Status: CREATED
    contract EVMScriptExecutor (eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977) [lido/EVMScriptExecutor]
    +++ description: EasyTrack execution adapter. It executes the Aragon CallsScript produced by an approved EasyTrack motion, making downstream calls from this contract's address.
```

```diff
+   Status: CREATED
    contract ParametersRegistry (eth:0xffC1C5d59CeAC6F6c27E701F04a70cb50474607C) [lido/ParametersRegistry]
    +++ description: Stores configurable Community Staking Module parameters, including bond curves, operator rewards, penalties, key limits, queue policy, performance thresholds, and validator-exit rules.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xFFe21561251c49AdccFad065C94Fb4931dF49081) [GnosisSafe]
    +++ description: None
```
