Generated with discovered.json: 0xd93090d0e0ec4f84dd4070185cf8978d5309d9f5

# Diff at Thu, 12 Mar 2026 14:54:37 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1773327174

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D)
    +++ description: Keeps track of the total stake of each operator.
```

```diff
+   Status: CREATED
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505)
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
```

```diff
+   Status: CREATED
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656)
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract PauserRegistry (eth:0x0c431C66F4dE941d089625E5B423D00707977060)
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
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
    contract StrategyBaseTVLLimits (eth:0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0x12ad349e5d72B582856290736e0f13FE5fA57Aa4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E)
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
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
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SyndicateTokenCrosschain (eth:0x1bAB804803159aD84b8854581AA53AC72455614E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x2420b6bF83B8fEEab576F2f3e5B5d130F2376b2F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract PermissionController (eth:0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5)
    +++ description: Contract that enables AVSs and operators to delegate the ability to call certain core contract functions to other addresses.
```

```diff
+   Status: CREATED
    contract ProtocolRegistry (eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129)
    +++ description: Admin-controlled on-chain registry that tracks all EigenLayer protocol contract deployments (addresses, names, configs, and versioning) and provides a pauseAll function to pause every registered pausable contract in the protocol.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x27CD0B994cc40a74962Db2fA6b973bf7d19f6Ec6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract StrategyBaseTVLLimits (eth:0x298aFB19A105D59E74658C4C334Ff360BadE6dd2)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerOwningMultisig (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: The DelegationManager contract is responsible for registering EigenLayer operators and managing the EigenLayer strategies delegations. The EigenDA StakeRegistry contract reads from the DelegationManager to track the total stake of each EigenDA operator.
```

```diff
+   Status: CREATED
    contract Bridge (eth:0x3C8cF0ae6E89AC0796f29B3a58e7dEa1cD072277)
    +++ description: None
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
    contract RollupProxy (eth:0x451bD7813909B899DA6EbEC55E8fF823c057e14A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerOperationsMultisig2 (eth:0x461854d84Ee845F905e0eCf6C288DDEEb4A9533F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x481D290473e4f6929AA45CFb7Ef7c7847aBeD007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenLayerPauserMultisig (eth:0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GatewayRouter (eth:0x534Eb1F79C8df3aB1E507e408EeF4e99D53A1239)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract EigenPod (eth:0x53cC2D82E08370Fe1e44a96f69CEc7d5b54ae868)
    +++ description: None
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
    contract UpgradeableBeacon (eth:0x5a2a4F2F3C18f09179B6703e63D9eDD165909073)
    +++ description: UpgradeableBeacon managing the single implementation for all strategies deployed via StrategyFactory.
```

```diff
+   Status: CREATED
    contract SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategyFactory (eth:0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647)
    +++ description: Factory contract for permissionless strategy creation via beacon proxies.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x5EA55Fd41D42Eb307D281bdE78E4e7572A35ea13)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ERC20Gateway (eth:0x6CA109706c6EBe5379c45f20B3311441D50cb711)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0x6D25E739016f42B70885E63629C7356C2E29a2D7)
    +++ description: None
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
    contract OneStepProverMath (eth:0x78471572Be99D99f9CE5867B208F15A75F074235)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EigenDACertVerifier (eth:0x787c88E70900f6AE10E7B9D18024482895EBD1eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad)
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
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
    contract ProxyAdmin (eth:0x817BE2d0f28b594D7023dAdf2b3Aa54327180c66)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0x82E761873714cDe47C594aA6F23E6b1844CD98dB)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
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
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0)
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
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
    contract StrategyBaseTVLLimits (eth:0xa4C637e0F704745D182e4D38cAb7E7485321d059)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract Alchemy Multisig 1 (eth:0xA4fB12D15Eb85dc9284a7df0AdBC8B696EdbbF1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0xa8aA9784FA7eC40Dc81d298130746c2FA4785EC8)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (eth:0xAa1EaB2ea108FDbCABd760a37E0B06f6e1dA8cC0)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract EigenDAThresholdRegistry (eth:0xab26536B7CaA4928708152272967FF1B32Fbf96a)
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
```

```diff
+   Status: CREATED
    contract ChallengeManager (eth:0xABf2988264170a7f94E6Fa76ECA5965B906E229d)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
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
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05)
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
```

```diff
+   Status: CREATED
    contract PauserRegistry (eth:0xB8765ed72235d279c3Fb53936E4606db0Ef12806)
    +++ description: Defines and stores pauser and unpauser roles for EigenLayer contracts.
```

```diff
+   Status: CREATED
    contract IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030)
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
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
    contract ECDSACertificateVerifier (eth:0xd0930ee96D07de4F9d493c259232222e46B6EC25)
    +++ description: Verifies ECDSA-based certificates for EigenLayer operator sets by recovering signer addresses from concatenated signatures, confirming each signer is a registered operator, and tallying their stake weights against quorum thresholds.
```

```diff
+   Status: CREATED
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B)
    +++ description: Registry for EigenDA relay keys, maps key to address.
```

```diff
+   Status: CREATED
    contract StrategyBase (eth:0xd33AAccc7E1a29Bc8E09Af55F8fa6fF3301e2780)
    +++ description: A strategy implementation allowing to deposit a specific token as a restakable asset.
```

```diff
+   Status: CREATED
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15)
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
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
    contract Outbox (eth:0xf555Bc86D1C953414F676479Bf7C979b1A737E8C)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0xFA4d1D308f4B4f6E6F836Db2B77Db549606A460c)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
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
