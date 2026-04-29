Generated with discovered.json: 0x9535b8836327d272cba0d5af5e4fd1cc6c4c0c22

# Diff at Wed, 29 Apr 2026 11:44:54 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- current timestamp: 1777463006

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Ethereum_DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract Unknown_Contract_1 (eth:0x00000961Ef480Eb55e80D19ad83579A64c007002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_2 (eth:0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D)
    +++ description: Keeps track of the total stake of each operator.
```

```diff
+   Status: CREATED
    contract EigenLayer_BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505)
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
```

```diff
+   Status: CREATED
    contract Gnosis_GnosisSafeL2 (eth:0x01422247a1d15BB4FcF91F5A077Cf25BA6460130)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_VaultFactory (eth:0x02Ca7772FF14a9F6c1a08aF385aA96bb1b34175A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kelp_LRTDepositPool (eth:0x036676389e48133B63a802f8635AD39E752D375D)
    +++ description: Main deposit pool that accepts ETH/LST deposits, mints rsETH, and routes collateral into NodeDelegators and EigenLayer strategies.
```

```diff
+   Status: CREATED
    contract Ethereum_VaultFactory_Eth_2 (eth:0x03ABEEC03BF39ac5A5C8886cF3496326d8164E1E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kelp_NodeDelegator (eth:0x049EA11D337f185b1Aa910d98e8Fbd991f0FBA7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_StakingVault (eth:0x06A56487494aa080deC7Bf69128EdA9225784553)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_CSExitPenalties (eth:0x06cd61045f958A209a0f8D746e103eCc625f4193)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_PermissionedPool (eth:0x09134C643A6B95D342BdAf081Fa473338F066572)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_MessageTransmitter (eth:0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract EigenLayer_RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656)
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract EigenLayer_PauserRegistry (eth:0x0c431C66F4dE941d089625E5B423D00707977060)
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
```

```diff
+   Status: CREATED
    contract Unknown_Contract_3 (eth:0x0d380Ecd17E168e6fde5B2bE1476AAb7778b8Ec5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_AllocationManagerView (eth:0x0D4e5723daAD06510CFd6864b8eB8a08CF0c4a34)
    +++ description: Read-only view contract that exposes query functions for the AllocationManager, allowing external callers to look up operator stake allocations, magnitudes, operator sets, and slashable/redistributable status.
```

```diff
+   Status: CREATED
    contract Lido_ValidatorsExitBusOracle (eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_UpgradeableBeacon (eth:0x0ed6703C298d28aE0878d1b28e88cA87F9662fE9)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract Ethereum_UpgradeableBeacon (eth:0x0fCE0A591D96BB76883323eF555867111E2050a9)
    +++ description: A beacon with an upgradeable implementation currently set as eth:0xC355123d0a51b4B5185aA7f21150904CEE3EAC97. Beacon proxy contracts pointing to this beacon will all use its implementation.
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits (eth:0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Stader_AdminTimelock (eth:0x1112D5C55670Cb5144BF36114C20a122908068B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E)
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
```

```diff
+   Status: CREATED
    contract EigenLayer_TaskMailbox (eth:0x132b466d9d5723531F68797519DfED701aC2C749)
    +++ description: Task lifecycle manager where users create tasks with fee payments directed at specific executor operator sets, and executors submit results verified via BN254 or ECDSA certificate verification, with fee distribution on successful verification and refunds on task expiration.
```

```diff
+   Status: CREATED
    contract EigenLayer_AVSDirectory (eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_2 (eth:0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_EndpointV2_Ethereum (eth:0x1a44076050125825900e736c501f859c50fE728c)
    +++ description: Part of the LayerZero messaging protocol. OApp owners can configure custom verification (MessageLib) and execution settings here.
```

```diff
+   Status: CREATED
    contract Unknown_Contract_4 (eth:0x1A9101f43a8bF842DFa26A496aB29E32245dcE71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_3 (eth:0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract LayerZero_BlockedMessageLib (eth:0x1ccBf0db9C192d969de57E25B3fF09A25bb1D862)
    +++ description: Simple LayerZero library that blocks all messages if configured.
```

```diff
+   Status: CREATED
    contract Lido_VaultHub (eth:0x1d201BE093d847f6446530Efb0E8Fb426d176709)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_SocializingPool (eth:0x1DE458031bFbe5689deD5A8b9ed57e1E79EaB2A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_5 (eth:0x1e6F8A7C096F509c9b2D15880e922Bba4fb00742)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_6 (eth:0x1e7e1287BE20a49d70C4cb81809cAF7270bE0ca0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_Safe (eth:0x218B5eC7482e072F6D47feb0463B3297eFb4bA56)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_GatewayMinter (eth:0x2222222d7164433c4C09B0b0D809a9b52C04C205)
    +++ description: Entrypoint or minter of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract Ethereum_Accounting (eth:0x23ED611be0e1a820978875C0122F92260804cdDf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_TokenRateNotifier (eth:0x25e35855783bec3E49355a29e110f02Ed8b05ba9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_PermissionController (eth:0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5)
    +++ description: Contract that enables AVSs and operators to delegate the ability to call certain core contract functions to other addresses.
```

```diff
+   Status: CREATED
    contract EigenLayer_ProtocolRegistry (eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129)
    +++ description: Admin-controlled on-chain registry that tracks all EigenLayer protocol contract deployments (addresses, names, configs, and versioning) and provides a pauseAll function to pause every registered pausable contract in the protocol.
```

```diff
+   Status: CREATED
    contract Ethereum_TokenMessengerV2 (eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract Lido_Dashboard (eth:0x294825c2764c7D412dc32d87E2242c4f1D989AF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_4 (eth:0x298aFB19A105D59E74658C4C334Ff360BadE6dd2)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Ethereum_ValidatorWithdrawalVault (eth:0x3073cC90aD39E0C30bb0d4c70F981FbD00f3458f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stader_Stader (eth:0x30D20208d987713f46DFD34EF128Bb16C404D10f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenDA_Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_7 (eth:0x3517D4C433C99fD4d75A3059e176a789FF675025)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_GnosisSafe (eth:0x35921FB43cB92F5Bfef7cBA1e97Eb5A21Fc2d353)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenLayerOwningMultisig (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_DVN_Horizen_Ethereum_A (eth:0x380275805876Ff19055EA900CDb2B46a94ecF20D)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract Lido_LidoExecutionLayerRewardsVault (eth:0x388C818CA8B9251b393131C08a736A67ccB19297)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: The DelegationManager contract is responsible for registering EigenLayer operators and managing the EigenLayer strategies delegations. The EigenDA StakeRegistry contract reads from the DelegationManager to track the total stake of each EigenDA operator.
```

```diff
+   Status: CREATED
    contract Kelp_NodeDelegator_Eth_2 (eth:0x395884D1974a839702bcFCBa176AC7871c788946)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_Lido_Dao_Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c)
    +++ description: Custom role-based operations entrypoint for Lido.
```

```diff
+   Status: CREATED
    contract Lido_StakingVault_Eth_2 (eth:0x3eda1e756Ba9aC0217Ac8fc5db4C5E9a8486d9c4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_8 (eth:0x3f0eFee8CAFf49Acd317D29DeEe909137785FaeA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_BN254CertificateVerifier (eth:0x3F55654b2b2b86bB11bE2f72657f9C33bf88120A)
    +++ description: Verifies BLS (BN254 curve) certificates for EigenLayer operator sets by computing the aggregate public key of signers, performing pairing-based signature verification, and returning signed-stake weights for quorum threshold validation.
```

```diff
+   Status: CREATED
    contract Ethereum_ProxyAdmin (eth:0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenLayerOperationsMultisig2 (eth:0x461854d84Ee845F905e0eCf6C288DDEEb4A9533F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kelp_ProxyAdminOwnerTimelock (eth:0x49bD9989E31aD35B0A62c20BE86335196A3135B1)
    +++ description: Timelock owner of the shared ProxyAdmin for rsETH core contracts.
```

```diff
+   Status: CREATED
    contract Stader_Config (eth:0x4ABEF2263d5A5ED582FC9A9789a41D85b68d69DB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kelp_NodeDelegator_Eth_3 (eth:0x4C798C4653b1257D5149910523D7a6eeD5712F83)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_CSFeeOracle (eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_CSAccounting (eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_PermissionlessNodeRegistry (eth:0x4f4Bfa0861F62309934a5551E0B2541Ee82fdcF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenLayerPauserMultisig (eth:0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_RatedOracle (eth:0x51881A1Cde5DBAE15D02aE1824940b19768d8F2b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenPod (eth:0x53cC2D82E08370Fe1e44a96f69CEc7d5b54ae868)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kelp_NodeDelegator_Eth_4 (eth:0x545D69B99759E7b670Df243b882700121d6d3AB9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_5 (eth:0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenLayer_KeyRegistrar (eth:0x54f4bC6bDEbe479173a2bbDc31dD7178408A57A4)
    +++ description: Manages the registration and deregistration of operator cryptographic keys (ECDSA or BN254/BLS) for specific operator sets, enforcing signature-based proof of key ownership and global uniqueness of keys across the protocol.
```

```diff
+   Status: CREATED
    contract Lido_NodeOperatorsRegistry (eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_OperatorTableUpdater (eth:0x5557E1fE3068A1e823cE5Dcd052c6C352E2617B5)
    +++ description: Central coordinator for EigenLayer's operator table system: accepts BN254-certified global Merkle table roots from a designated generator operator set, then allows Merkle proof submissions to push per-operator-set tables into the certificate verifier contracts.
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_6 (eth:0x57ba429517c3473B6d34CA9aCd56c0e735b94c02)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Unknown_Contract_9 (eth:0x5882e8DBead5CCc7E27B7ada5E0C6Fb34Ca124Ad)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_DVN_LayerZeroLabs_Ethereum (eth:0x589dEDbD617e0CBcB916A9223F4d1300c294236b)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract Gnosis_GnosisSafe_Eth_2 (eth:0x5A14BD3f2bf84c3690d653F1d40cfb7a8a9B3c26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_UpgradeableBeacon_Eth_2 (eth:0x5a2a4F2F3C18f09179B6703e63D9eDD165909073)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract EigenLayer_SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_LazyOracle (eth:0x5DB427080200c235F2Ae8Cd17A7be87921f7AD6c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyFactory (eth:0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647)
    +++ description: Factory contract for permissionless strategy creation via beacon proxies.
```

```diff
+   Status: CREATED
    contract LayerZero_Treasury_Ethereum (eth:0x5ebB3f2feaA15271101a927869B3A56837e73056)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_UpgradeableBeacon_Eth_2 (eth:0x5FbE8cEf9CCc56ad245736D3C5bAf82ad54Ca789)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_EmissionsController (eth:0x619F988b4EA2f896ED068d84cE6F52550d6acE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_PoolSelector (eth:0x62e0b431990Ea128fe685E764FB04e7d604603B0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_StakingVault_Eth_3 (eth:0x62e0D92cf7B8752b5292B9BCbbacE4cFa1633428)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_ProxyAdmin_Eth_2 (eth:0x67B12264Ca3e0037Fc7E22F2457b42643a04C86e)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (eth:0x67BB8f98DDff504204B9AF8e9C00E9C6926526e2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_HashConsensus (eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_TimelockController (eth:0x738130BC8eADe1Bc65A9c056DEa636835896bc53)
    +++ description: A timelock that allows scheduling calls and executing or cancelling them with a delay.
```

```diff
+   Status: CREATED
    contract LayerZero_ReadLib1002 (eth:0x74F55Bc2a79A27A0bF1D1A35dB5d0Fc36b9FDB9D)
    +++ description: LayerZero library used to read state from remote blockchains.
```

```diff
+   Status: CREATED
    contract Ethereum_RewardsCoordinator (eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_GatewayWallet (eth:0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE)
    +++ description: Exit point or burner of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad)
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
```

```diff
+   Status: CREATED
    contract Kelp_NodeDelegator_Eth_5 (eth:0x79f17234746344E0365D40be50d8d43DB9082c32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_SDCollateral (eth:0x7Af4730cc8EbAd1a050dcad5c03c33D2793EE91f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_7 (eth:0x7CA911E83dabf90C90dD3De5411a10F1A6112184)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Lido_Wrapped_liquid_staked_Ether_2_0_Token (eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_Safe_Eth_2 (eth:0x7F68e9C17D22005688b8E6968fCe31e32B4B03d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_HashConsensus_Eth_2 (eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_MessageTransmitterV2 (eth:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract Ethereum_ProxyAdmin_Eth_3 (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_BackingEigen (eth:0x83E9115d334D248Ce39a6f36144aEaB5b3456e75)
    +++ description: The token backing EIGEN and used for intersubjective staking.
```

```diff
+   Status: CREATED
    contract Ethereum_Penalty (eth:0x84645f1B80475992Df2C65c28bE6688d15dc6ED6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_OperatorRewardsCollector (eth:0x84ffDC9De310144D889540A49052F6d1AdB2C335)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_AccountingOracle (eth:0x852deD011285fe67063a08005c71a85690503Cee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_EVMScriptRegistry (eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyManager (eth:0x858646372CC42E1A627fcE94aa7A7033e7CF075A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_Auction (eth:0x85A22763f94D703d2ee39E9374616ae4C1612569)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RSETH_OFTAdapter (eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0)
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
```

```diff
+   Status: CREATED
    contract Lido_WithdrawalQueueERC721 (eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_ProxyAdmin_Eth_4 (eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_8 (eth:0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    EOA  (eth:0x8E0a538081BA1d7f41b7c594F0a2Afe7aE558494)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_StrategyBase (eth:0x8F6be4A906376bB4481E78cBF6FC783Cc0f8D1Ce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_EIP712StETH (eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenPodManager (eth:0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_CrossChainRegistry (eth:0x9376A5863F2193cdE13e1aB7c678F22554E2Ea2b)
    +++ description: Allows AVSs to create generation reservations that configure and schedule the transport of operator tables (stake weight data) from L1 to whitelisted L2 chains, managing per-operator-set configs such as staleness periods and operator table calculators.
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_9 (eth:0x93c4b944D05dfe6df7645A86cd2206016c51564D)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenLayerBeigenOwningMultisig (eth:0x942eaF324971440384e4cA0ffA39fC3bb369D67d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kelp_LRTConfig (eth:0x947Cb49334e6571ccBFEF1f1f1178d8469D65ec7)
    +++ description: Global configuration and role authority for the rsETH system. It controls supported assets, strategy mappings, protocol fees, and reward receiver routing.
```

```diff
+   Status: CREATED
    contract EigenLayer_AllocationManager (eth:0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39)
    +++ description: Contract used to create Operator Sets, and used by Operators to register to them. The Allocation Manager tracks allocation of stake to a Operator Set, and enables AVSs to slash that stake.
```

```diff
+   Status: CREATED
    contract Unknown_Contract_10 (eth:0x96b84391a4567CB383126520e070078f8EBBcEe5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_NodeELRewardVault (eth:0x97c92752DD8a8947cE453d3e35D2cad5857367af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_ACL (eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_11 (eth:0x9B2e0c472aA3231EcFB9A8a5bB2019E1CB781D7A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_CSParametersRegistry (eth:0x9D28ad303C90DF524BA960d7a2DAC56DcC31e428)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_SocializingPool_Eth_2 (eth:0x9d4C3166c59412CEdBe7d901f5fDe41903a1d6Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_10 (eth:0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Ethereum_UserWithdrawalManager (eth:0x9F0491B32DBce587c50c4C43AB303b06478193A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_USD_Coin_Token (eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RSETH (eth:0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7)
    +++ description: Core rsETH token contract. It mints/burns rsETH against collateral flows and enforces transfer and mint controls through the external LRTConfig authority.
```

```diff
+   Status: CREATED
    contract Stader_ETHx_Token (eth:0xA35b1B31Ce002FBF2058D22F30f95D405200A15b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_11 (eth:0xa4C637e0F704745D182e4D38cAb7E7485321d059)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract LayerZero_DVN_Canary_Ethereum (eth:0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract LayerZero_DVN_Horizen_Ethereum_B (eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenPod_Eth_2 (eth:0xA91Dff6C41af892a89fC5C0Bf5C32B5CC89d13AC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_CSStrikes (eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_GnosisSafe_Eth_3 (eth:0xAAfb31780e4b9c95Bc920e388f4925A874cd07AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenStrategy (eth:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenLayer_StrategyBaseTVLLimits_Eth_12 (eth:0xAe60d8180437b5C34bB956822ac2710972584473)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Gnosis_Safe_Eth_3 (eth:0xAE6A126cBb5128996433350E40dB62E68B9E58d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_Liquid_staked_Ether_2_0_Token (eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_NodeOperatorsRegistry_Eth_2 (eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_PermissionedNodeRegistry (eth:0xaf42d795A6D279e9DCc19DC0eE1cE3ecd4ecf5dD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_12 (eth:0xb02fEC3EcE9e9FcB80709375204e7bDD4bD8C66a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenPod_Eth_3 (eth:0xB25FE78fAaEfadB7249B4940EE485856df150BBe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05)
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
```

```diff
+   Status: CREATED
    contract Kelp_CustodySafe (eth:0xb3696a817D01C8623E66D156B6798291fa10a46d)
    +++ description: Primary custody multisig used by the rsETH system.
```

```diff
+   Status: CREATED
    contract Kelp_ProxyAdmin (eth:0xb61e0E39b6d4030C36A176f576aaBE44BF59Dc78)
    +++ description: Shared ProxyAdmin controlling upgrades for rsETH core contracts and NodeDelegator proxies.
```

```diff
+   Status: CREATED
    contract EigenLayer_PauserRegistry_Eth_2 (eth:0xB8765ed72235d279c3Fb53936E4606db0Ef12806)
    +++ description: Defines and stores pauser and unpauser roles for EigenLayer contracts.
```

```diff
+   Status: CREATED
    contract Lido_Kernel (eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_WithdrawalVault (eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_SendUln302_Ethereum (eth:0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)
    +++ description: Send Library used by LayerZero, defining the protocol/execution of sent messages.
```

```diff
+   Status: CREATED
    contract Unknown_Contract_13 (eth:0xbbFB64646E1c813579039c045e1D4eAe1A9fc682)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_Safe_Eth_4 (eth:0xbc06976A1A1AAc67b85737eE927f3f693a6224B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030)
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract Ethereum_TokenMessenger (eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract Ethereum_ValidatorExitDelayVerifier (eth:0xbDb567672c867DB533119C2dcD4FB9d8b44EC82f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_OneSig_Ethereum (eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478)
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenLayerOperationsMultisig (eth:0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stader_StaderInsuranceFund (eth:0xbe3781CE437Cc3fC8c8167913B4d462347D11F20)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_OracleDaemonConfig (eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_Wrapped_Ether_Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_ReceiveUln302_Ethereum (eth:0xc02Ab410f0734EFa3F14628780e6e695156024C2)
    +++ description: Receive Library used by LayerZero, defining the validation of received messages.
```

```diff
+   Status: CREATED
    contract EigenLayer_TimelockController_Eth_2 (eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d)
    +++ description: A timelock that allows scheduling calls and executing or cancelling them with a delay.
```

```diff
+   Status: CREATED
    contract Lido_Locator (eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_DurationVaultStrategy (eth:0xC355123d0a51b4B5185aA7f21150904CEE3EAC97)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_TokenMinter (eth:0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract Lido_OperatorGrid (eth:0xC69685E89Cefc327b43B7234AC646451B27c544d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_CSEjector (eth:0xc72b58aa02E0e98cF8A4a0E9Dce75e763800802C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_GnosisSafe_Eth_4 (eth:0xCbcdd778AA25476F203814214dD3E9b9c46829A1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stader_StaderStakePoolsManager (eth:0xcf5EA1b38380f6aF39068375516Daf40Ed70D299)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_ECDSACertificateVerifier (eth:0xd0930ee96D07de4F9d493c259232222e46B6EC25)
    +++ description: Verifies ECDSA-based certificates for EigenLayer operator sets by recovering signer addresses from concatenated signatures, confirming each signer is a registered operator, and tallying their stake weights against quorum thresholds.
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B)
    +++ description: Registry for EigenDA relay keys, maps key to address.
```

```diff
+   Status: CREATED
    contract Ethereum_PermissionlessPool (eth:0xd1a72Bd052e0d65B7c26D3dd97A98B74AcbBb6c5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_StakingVault_Eth_4 (eth:0xd402937b3Ff3c187f727C1146a9E846275E9F711)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_OpStackTokenRatePusher (eth:0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_HashConsensus_Eth_3 (eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_CSFeeDistributor (eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenPod_Eth_4 (eth:0xda3A73F0E56b6f97204031f278F43D2175B6F50D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_CSModule (eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15)
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
```

```diff
+   Status: CREATED
    contract Lido_TriggerableWithdrawalsGateway (eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_14 (eth:0xdDe06220e72c5a1fd605B6Fd5b9E185D682D454E)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (eth:0xDf83E84F1eB00F0230eB912E2Ec823C979800B1c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_GnosisSafe_Eth_5 (eth:0xE15AFE000789160BE164D2FBA66EaDd6c6B81e7B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_SDIncentiveController (eth:0xe225825bcf20F39E2F2e2170412a3247D83492D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_StakingVault_Eth_5 (eth:0xE2cC063DEc5685718Bd57aAC6AEE9941b25b7c37)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_Burner (eth:0xE76c52750019b80B43E36DF30bf4060EB73F573a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_MasterMinter (eth:0xE982615d461DD5cD06575BbeA87624fda4e3de17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_Eigen_Token (eth:0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83)
    +++ description: The EIGEN token can be socially forked to slash operators for data withholding attacks (and other intersubjectively attributable faults). EIGEN is a wrapper over a second token, bEIGEN, which will be used solely for intersubjective staking. Forking EIGEN means changing the canonical implementation of the bEIGEN token in the EIGEN token contract.
```

```diff
+   Status: CREATED
    contract Unknown_Contract_15 (eth:0xec81f793aFC5fe6E94843147510b8a89f6B5E0Bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_SDUtilityPool (eth:0xED6EE5049f643289ad52411E9aDeC698D04a9602)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_ReleaseManager (eth:0xeDA3CAd031c0cf367cF3f517Ee0DC98F9bA80C8F)
    +++ description: Manages software release lifecycle for EigenLayer operator sets, allowing AVS owners to publish versioned releases (containing artifact digests, registry URLs, and upgrade-by deadlines) and metadata URIs that operators can query for required software versions.
```

```diff
+   Status: CREATED
    contract Ethereum_PoolUtils (eth:0xeDA89ed8F89D786D816F8E14CF8d2F90c6BF763f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kelp_NodeDelegator_Eth_6 (eth:0xee5470E1519972C3eA95249d60EBD064af2D53D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_GnosisSafe_Eth_6 (eth:0xEe68dF9f661da6ED968Ea4cbF7EC68fcFE375bc6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenPod_Eth_5 (eth:0xf02D53d62af4E5c1E0769c36ED0353B29B443c58)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_OracleReportSanityChecker (eth:0xf1647c86E6D7959f638DD9CE1d90e2F3C9503129)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_PredepositGuarantee (eth:0xF4bF42c6D6A0E38825785048124DBAD6c9eaaac3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stader_StaderOracle (eth:0xF64bAe65f6f2a5277571143A24FaaFDFC0C2a737)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kelp_NodeDelegator_Eth_7 (eth:0xFc561966ceaAa09f4d6CBa4AdD54778c2bF1cB85)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_Safe_Eth_5 (eth:0xfD636E8EB3839cE82A58936b795043Da7DB0c734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_TokenMinterV2 (eth:0xfd78EE919681417d192449715b2594ab58f5D002)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract Lido_StakingRouter (eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayer_EigenLayerCommunityMultisig (eth:0xFEA47018D632A77bA579846c840d5706705Dc598)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido_DepositSecurityModule (eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_DVN_Nansen_Unichain (unichain:0x00A979a5D306E9c5F8Cf473659e75f8002E06fc8)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract Unknown_Contract_16 (unichain:0x178F93794328C04988bcD52a1B820eC105b17f2f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_DVN_Horizen_Unichain (unichain:0x25e0e650a78e6304A3983Fc4b7Ffc6544b1bEea6)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract LayerZero_DVN_LayerZeroLabs_Unichain (unichain:0x282b3386571f7f794450d5789911a9804FA346b4)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract LayerZero_OneSig_Unichain (unichain:0x32b323EFC09D5812510B6510b242647C603947Ab)
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
```

```diff
+   Status: CREATED
    contract LayerZero_Treasury_Unichain (unichain:0x4514FC667a944752ee8A29F544c1B20b1A315f25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_EndpointV2_Unichain (unichain:0x6F475642a6e85809B1c36Fa62763669b1b48DD5B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Gnosis_SafeL2 (unichain:0x9Fc47d6A2F5A1EFd8BaF475E1873c76D9b28dDFD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Unknown_Contract_17 (unichain:0xC1cE56B2099cA68720592583C7984CAb4B6d7E7a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero_SendUln302_Unichain (unichain:0xC39161c743D0307EB9BCc9FEF03eeb9Dc4802de7)
    +++ description: Send Library used by LayerZero, defining the protocol/execution of sent messages.
```

```diff
+   Status: CREATED
    contract RSETH_OFT (unichain:0xc3eACf0612346366Db554C991D7858716db09f58)
    +++ description: Unichain LayerZero OFT representation of rsETH, controlled by its owner safe and LayerZero endpoint wiring.
```

```diff
+   Status: CREATED
    contract LayerZero_DVN_P2P_Unichain (unichain:0xC6a6324932B399D6A673B7Ed0af671F28033E046)
    +++ description: Defines the logic that validates LayerZero Packets for this DVN.
```

```diff
+   Status: CREATED
    contract LayerZero_ReceiveUln302_Unichain (unichain:0xe1844c5D63a9543023008D332Bd3d2e6f1FE1043)
    +++ description: Receive Library used by LayerZero, defining the validation of received messages.
```
