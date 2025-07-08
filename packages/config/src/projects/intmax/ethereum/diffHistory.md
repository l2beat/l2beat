Generated with discovered.json: 0xc2c43f69c221d03ae4abc5e3f5990be64afb4cc0

# Diff at Tue, 08 Jul 2025 06:37:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22872700

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract EigenDAOperationsMultisig (0x002721B4790d97dC140a049936aA710152Ba92D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeRegistry (0x006124Ae7976137266feeBFb3F4D2BE4C073139D)
    +++ description: Keeps track of the total stake of each operator.
```

```diff
+   Status: CREATED
    contract BLSApkRegistry (0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505)
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x01422247a1d15BB4FcF91F5A077Cf25BA6460130)
    +++ description: None
```

```diff
+   Status: CREATED
    contract VaultFactory (0x03ABEEC03BF39ac5A5C8886cF3496326d8164E1E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedPool (0x09134C643A6B95D342BdAf081Fa473338F066572)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RegistryCoordinator (0x0BAAc79acD45A023E19345c352d8a7a83C4e5656)
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract PauserRegistry (0x0c431C66F4dE941d089625E5B423D00707977060)
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
```

```diff
+   Status: CREATED
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0x0ed6703C298d28aE0878d1b28e88cA87F9662fE9)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract TimelockController (0x1112D5C55670Cb5144BF36114C20a122908068B9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PredicatePermitter (0x11D58231A79D866674EaAa043Fdaeae9A3dF4c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EjectionManager (0x130d8EA0052B45554e4C99079B84df292149Bd5E)
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
```

```diff
+   Status: CREATED
    contract AVSDirectory (0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerRewardsInitiatorMultisig (0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SocializingPool (0x1DE458031bFbe5689deD5A8b9ed57e1E79EaB2A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionController (0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5)
    +++ description: Contract that enables AVSs and operators to delegate the ability to call certain core contract functions to other addresses.
```

```diff
+   Status: CREATED
    contract ValidatorWithdrawalVault (0x3073cC90aD39E0C30bb0d4c70F981FbD00f3458f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Stader (0x30D20208d987713f46DFD34EF128Bb16C404D10f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDA Multisig (0x338477FfaF63c04AC06048787f910671eC914B34)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerOwningMultisig (0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (0x38f6001e8ac11240f903CBa56aFF72A1425ae371)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelegationManager (0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: The DelegationManager contract is responsible for registering EigenLayer operators and managing the EigenLayer strategies delegations. The EigenDA StakeRegistry contract reads from the DelegationManager to track the total stake of each EigenDA operator.
```

```diff
+   Status: CREATED
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c)
    +++ description: Custom role-based operations entrypoint for Lido.
```

```diff
+   Status: CREATED
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerOperationsMultisig2 (0x461854d84Ee845F905e0eCf6C288DDEEb4A9533F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaderConfig (0x4ABEF2263d5A5ED582FC9A9789a41D85b68d69DB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contribution (0x4c614C7BB9420caA1F19cB2C58B00864f2125Ce2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionlessNodeRegistry (0x4f4Bfa0861F62309934a5551E0B2541Ee82fdcF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerPauserMultisig (0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0x5a2a4F2F3C18f09179B6703e63D9eDD165909073)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract SocketRegistry (0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyFactory (0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647)
    +++ description: Factory contract for permissionless strategy creation via beacon proxies.
```

```diff
+   Status: CREATED
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolSelector (0x62e0b431990Ea128fe685E764FB04e7d604603B0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x67B12264Ca3e0037Fc7E22F2457b42643a04C86e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7153803C06d6a36D6d91aEB3C1ed8e5b934Df601)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDADisperserRegistry (0x78cb05379a3b66E5227f2C1496432D7FFE794Fad)
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
```

```diff
+   Status: CREATED
    contract SDCollateral (0x7Af4730cc8EbAd1a050dcad5c03c33D2793EE91f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x7F68e9C17D22005688b8E6968fCe31e32B4B03d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8247EF5705d3345516286B72bFE6D690197C2E99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Penalty (0x84645f1B80475992Df2C65c28bE6688d15dc6ED6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OperatorRewardsCollector (0x84ffDC9De310144D889540A49052F6d1AdB2C335)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A)
    +++ description: The StrategyManager contract is responsible for managing the EigenLayer token strategies. Each EigenDA quorum has at least one strategy that defines the operators quorum stake.
```

```diff
+   Status: CREATED
    contract Auction (0x85A22763f94D703d2ee39E9374616ae4C1612569)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDAServiceManager (0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0)
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
```

```diff
+   Status: CREATED
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (0x93c4b944D05dfe6df7645A86cd2206016c51564D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AllocationManager (0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39)
    +++ description: Contract used to create Operator Sets, and used by Operators to register to them. The Allocation Manager tracks allocation of stake to a Operator Set, and enables AVSs to slash that stake.
```

```diff
+   Status: CREATED
    contract NodeELRewardVault (0x97c92752DD8a8947cE453d3e35D2cad5857367af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExchangeRateUpdater (0x9b37180d847B27ADC13C2277299045C1237Ae281)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SocializingPool (0x9d4C3166c59412CEdBe7d901f5fDe41903a1d6Fc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UserWithdrawalManager (0x9F0491B32DBce587c50c4C43AB303b06478193A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHx Token (0xA35b1B31Ce002FBF2058D22F30f95D405200A15b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Rocket Pool ETH Token (0xae78736Cd615f374D3085123A210448E74Fc6393)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedNodeRegistry (0xaf42d795A6D279e9DCc19DC0eE1cE3ecd4ecf5dD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PaymentVault (0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05)
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
```

```diff
+   Status: CREATED
    contract PauserRegistry (0xB8765ed72235d279c3Fb53936E4606db0Ef12806)
    +++ description: Defines and stores pauser and unpauser roles for EigenLayer contracts.
```

```diff
+   Status: CREATED
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract IndexRegistry (0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030)
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract EigenLayerOperationsMultisig (0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaderInsuranceFund (0xbe3781CE437Cc3fC8c8167913B4d462347D11F20)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Coinbase Wrapped Staked ETH Token (0xBe9895146f7AF43049ca1c1AE358B0541Ea49704)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d)
    +++ description: A timelock that allows scheduling calls and executing or cancelling them with a delay.
```

```diff
+   Status: CREATED
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaderStakePoolsManager (0xcf5EA1b38380f6aF39068375516Daf40Ed70D299)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDARelayRegistry (0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B)
    +++ description: Registry for EigenDA relay keys, maps key to address.
```

```diff
+   Status: CREATED
    contract PermissionlessPool (0xd1a72Bd052e0d65B7c26D3dd97A98B74AcbBb6c5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDAThresholdRegistry (0xdb4c89956eEa6F606135E7d366322F2bDE609F15)
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
```

```diff
+   Status: CREATED
    contract Safe (0xe147e23753505e2C83b5f9ef229a9B7e7B3F50Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SDIncentiveController (0xe225825bcf20F39E2F2e2170412a3247D83492D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenPod (0xe2E2dB234b0FFB9AFe41e52dB7d3c2B8585646c3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SDUtilityPool (0xED6EE5049f643289ad52411E9aDeC698D04a9602)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PoolUtils (0xeDA89ed8F89D786D816F8E14CF8d2F90c6BF763f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaderOracle (0xF64bAe65f6f2a5277571143A24FaaFDFC0C2a737)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquidity (0xF65e73aAc9182e353600a916a6c7681F810f79C3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ServiceManager (0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerCommunityMultisig (0xFEA47018D632A77bA579846c840d5706705Dc598)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD)
    +++ description: None
```
