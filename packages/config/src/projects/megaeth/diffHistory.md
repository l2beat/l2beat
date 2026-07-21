Generated with discovered.json: 0x7e581d26aafe957a80fffad47c401c81fe7c567c

# Diff at Tue, 21 Jul 2026 15:40:29 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@fc28078e744c0eaf2d65858a6073cbf1fe48622d block: 1778535511
- current timestamp: 1784648359

## Description

EigenDAOperationsMultisig: new signer added. Threshold 3/4 → 3/5.

## Watched changes

```diff
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0xB646A0871af2b2c6e115b24D7E36d406780b6ca8"
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xe7a7b5dfd1167507be380e508515052476a7a63e

# Diff at Wed, 01 Jul 2026 10:34:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cfafbf3de953d9f519656c89c622fe51a04d547a block: 1778535511
- current timestamp: 1778535511

## Description

Config: small template adjustments

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778535511 (main branch discovery), not current.

```diff
    contract RiscZeroGroth16Verifier (eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x54fbc89488e324d7a459d252f0b1cb322d70ed84

# Diff at Tue, 30 Jun 2026 12:27:37 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@d6a4cf0104ece715f88d9597c7e158a2841e88fd block: 1778535511
- current timestamp: 1778535511

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778535511 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      usedTypes.0.arg.8:
+        "FaultDisputeGame"
    }
```

Generated with discovered.json: 0x7272e7ff1107c020da1b9f947f5284fb306f63f2

# Diff at Tue, 09 Jun 2026 12:43:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1778535511
- current timestamp: 1778535511

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778535511 (main branch discovery), not current.

```diff
    EOA  (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless)."
      receivedPermissions.0.permission:
-        "guard"
+        "interact"
    }
```

```diff
    contract Safe (eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F) [GnosisSafe] {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "Allowed to pause withdrawals. In op stack systems with a proof system, the Guardian can also blacklist dispute games and set the respected game type (permissioned / permissionless)."
      directlyReceivedPermissions.0.permission:
-        "guard"
+        "interact"
    }
```

```diff
    EOA  (eth:0xB98c6b1A805b96707A43e1F1ACFa163B68098FA6) {
    +++ description: None
      receivedPermissions.0.description:
+        "Allowed to commit transactions from the current layer to the host chain."
      receivedPermissions.0.permission:
-        "sequence"
+        "interact"
    }
```

```diff
    EOA  (eth:0xe8437B66E834B7CdC90cC5D98B8DD6e636b37D7a) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can store and serve both unencoded blobs as well as encoded chunks."
      receivedPermissions.0.permission:
-        "relayDA"
+        "interact"
    }
```

```diff
    EOA  (eth:0xF3d7C0D52fF8f4CF74A3CD9C53778516f4235bE9) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can disperse EigenDA blobs to the EigenDA node operators."
      receivedPermissions.0.permission:
-        "disperse"
+        "interact"
    }
```

Generated with discovered.json: 0xb5d6cffbd6eedf37cab2e8b8316dc2d287eca5c0

# Diff at Thu, 04 Jun 2026 17:41:35 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@8ad83b88dd9180e282e419267cebe10e93daf01d block: 1778535511
- current timestamp: 1778535511

## Description

New game name (aggregateVerifier) added to portal.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778535511 (main branch discovery), not current.

```diff
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      usedTypes.0.arg.621:
+        "AggregateVerifier"
    }
```

```diff
    contract RiscZeroVerifierRouter (eth:0x910b159F79288DD706789ec7768E979d4D88C057) [risc0/RiscZeroVerifierRouter] {
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97).
+++ severity: HIGH
      values.verifier_242f9d5b:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.verifier_310fe598:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.verifier_73c457ba:
+        "eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3"
+++ severity: HIGH
      values.verifier_9f39696c:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.verifier_bb001d44:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.verifier_f536085a:
+        "eth:0x0000000000000000000000000000000000000000"
      fieldMeta:
+        {"verifier_310fe598":{"severity":"HIGH"},"verifier_9f39696c":{"severity":"HIGH"},"verifier_f536085a":{"severity":"HIGH"},"verifier_bb001d44":{"severity":"HIGH"},"verifier_73c457ba":{"severity":"HIGH"},"verifier_242f9d5b":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x3b07aa1050cf1fb1a8df421493705e7bb5f329a6

# Diff at Fri, 15 May 2026 12:36:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1778535511
- current timestamp: 1778535511

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1778535511 (main branch discovery), not current.

```diff
    contract RiscZeroGroth16Verifier (eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
      sourceHashes.0:
-        "0x19c3fbedf93ee852d83096519dd22f26409f70fc13f7843307acaecb508981d6"
+        "0x20f30107695bee36a63acac61a5ba93d47cbb8ad79df70f6dd9b16d15db66ad3"
    }
```

Generated with discovered.json: 0xd6fb873eb77a64098e57a7eecd575d5b753f84fc

# Diff at Mon, 11 May 2026 21:39:47 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@da451cba8e944a28754be7e17bcb7555d857f312 block: 1777390966
- current timestamp: 1778535511

## Description

Kailua `game1337` impl rotated `0x78F8F8FE...` → `0x8c0Ed8Dd...` ([diff](https://disco.l2beat.com/diff/eth:0x78F8F8FED1d589b7098EC4B47220465A9Fa071C9/eth:0x8c0Ed8Dd0CcF6d596e321d81eD895ad51fE30B84)). Active `KailuaTreasury` is now `0x01853F26...`; `OptimismPortal2.setRespectedGameType(1337)` re-pointed the bridge.

The `proposalParent.childCount() == 1` gate around the vanguard check was removed: `vanguardAdvantage` applies to every proposal (first child and every sibling). With `vanguardAdvantage ≈ 2^60s`, only the Vanguard can submit any proposal. Faulty Vanguard proposals can be marked faulty via `proveOutputFault` but no honest sibling can replace them — chain halts until the Vanguard submits a correct state root.

Plumbing: `megaeth.ts` resolves the active game/treasury dynamically via `OptimismPortal2.respectedGameType` → `DisputeGameFactory.game{N}` → its `KAILUA_TREASURY`; `risc0/KailuaGame` and `megaeth/KailuaTreasury` shapes extended for the new contracts.

## Watched changes

```diff
    contract Safe (eth:0x63eCafD27E0B86B37903c8aA64beD47244Ad909A) [GnosisSafe] {
    +++ description: None
      values.$members.0:
+        "eth:0xEd71403a0cC46ED68E57997A225a9620b5Cf0872"
      values.multisigThreshold:
-        "1 of 4 (25%)"
+        "1 of 5 (20%)"
    }
```

```diff
-   Status: DELETED
    contract KailuaGame (eth:0x78F8F8FED1d589b7098EC4B47220465A9Fa071C9) [risc0/KailuaGame]
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
```

```diff
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      values.respectedGameTypeUpdatedAt:
-        1762796999
+        1778245595
    }
```

```diff
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game1337:
-        "eth:0x78F8F8FED1d589b7098EC4B47220465A9Fa071C9"
+        "eth:0x8c0Ed8Dd0CcF6d596e321d81eD895ad51fE30B84"
    }
```

```diff
-   Status: DELETED
    contract KailuaTreasury (eth:0xE4e456c64B9b0de5FE8a90d809180cA71534D623) [megaeth/KailuaTreasury]
    +++ description: Entrypoint for state root proposals. Manages bonds (currently 0.00001 ETH) and tournaments for the OP Kailua state validation system, wrapping the OP stack native DisputeGameFactory.
```

```diff
+   Status: CREATED
    contract KailuaTreasury (eth:0x01853F268B170D4A15D0c3AE905757b5Ec8375f3) [megaeth/KailuaTreasury]
    +++ description: Entrypoint for state root proposals. Manages bonds (currently 0.00001 ETH) and tournaments for the OP Kailua state validation system, wrapping the OP stack native DisputeGameFactory.
```

```diff
+   Status: CREATED
    contract KailuaGame (eth:0x8c0Ed8Dd0CcF6d596e321d81eD895ad51fE30B84) [risc0/KailuaGame]
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
```

## Source code changes

```diff
.../{.flat@1777390966 => .flat}/KailuaGame.sol     | 24 ++++++++++++++--------
 .../{.flat@1777390966 => .flat}/KailuaTreasury.sol | 24 ++++++++++++++--------
 2 files changed, 32 insertions(+), 16 deletions(-)
```

Generated with discovered.json: 0x6483611ae3af483c00014bcc31fbe41aea3ad958

# Diff at Fri, 08 May 2026 07:51:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777390966
- current timestamp: 1777390966

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777390966 (main branch discovery), not current.

```diff
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D) [eigenlayer/StakeRegistry] {
    +++ description: Keeps track of the total stake of each operator.
      sourceHashes.1:
-        "0x249715f12cf118070103f30534be5816b6847d0b1cd8fe8cae8e1833c6afd1f8"
+        "0x2164f0da2cf46f7b500efb558c3a6a0afe65e67d6534370fadf7dce65389b81f"
    }
```

```diff
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505) [eigenlayer/BLSApkRegistry] {
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
      sourceHashes.1:
-        "0xb4ca65ab7fb0cd9a8fd6f0c4b7805ea96914dcb6dd65309b2557931358ad1ff3"
+        "0x913bc45c379cd6b9d480abbe939324e96f3330645202dd152a4c6532f69ad73e"
    }
```

```diff
    contract BunnyInbox (eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2) [megaeth/BunnyInbox] {
    +++ description: Onchain EigenDA certificate verification inbox. Receives batch data, strips 4-byte prefix, RLP-decodes EigenDACertV3 and calls the EigenDACertVerifier to validate the certificate. Used as the batch inbox for EigenDA-based data availability.
      sourceHashes.1:
-        "0x32a8e1247fe1f5c0ed413c7604ceca4e87e5cb186cde24b165fa9f833e486b32"
+        "0x8a8af834073f90d499e71ee2ac0377f29feac9574963b35bdc66e7d55decec58"
    }
```

```diff
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) [eigenlayer/RegistryCoordinator] {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
      sourceHashes.1:
-        "0x7e7c9cae80b660c369700ce034c417e93999b08e43dabd1c37a1e76599552575"
+        "0x7bc3d6a892a6e8c6ec410ff8d531b91cca1a03c0c06abc1963b402fd63287f38"
    }
```

```diff
    contract L1StandardBridge (eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x4e15d99844dc5a4304c2396a66c95ec41218ea311c8e524b118fad7beed0bb53"
+        "0xb47cce1142fbb589ee2917f47d81c1cb8d51462f9802c4339d4f6c33cd45c790"
    }
```

```diff
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E) [eigenlayer/EjectionManager] {
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
      sourceHashes.1:
-        "0x94a826fe3f9609e445cfd3cd6d7d9709c559367e9cb49a9b6d7952cd3a116cd0"
+        "0x479a55e20f8ffd16dffa5952f97f6abd15293e57871ef06140a12860676d5327"
    }
```

```diff
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x18ecfc662e320a3cf78978511db8f7d6f3819d32a52e70d74cc636c9a43335e8"
+        "0x7a19ef244a49e018047d7e5d215aad1651e469d215364b8f16e0e59e0a9db43c"
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle] {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      sourceHashes.0:
-        "0xd9838f1f137bd5397f583f33c414ec9c0fc3dc69401213fae0f09c36d4ac8e47"
+        "0x16701fcaa0e04e5481701a81736e7c8ee2c8aa32da272bf74e0589e6a90c3615"
    }
```

```diff
    contract MegaPreDepositVaultRefund (eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071) [megaeth/MegaPreDepositVaultRefund] {
    +++ description: Refund escrow designed to hold the funds extracted from the predeposit vault and send them back to the users listed in the vault.
      sourceHashes.0:
-        "0xe6bb739bb7cfc220d4d5e58d21a77f3058747d738a06f639274a99b04a76d0f4"
+        "0x3315b069a79c1600ec032c883d42fe18cc74d2a99ac67f4bfddfad47b7f01b00"
    }
```

```diff
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242) [opstack/L1ERC721Bridge] {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x28669b49da3effd51f0f9424ca9cdd455c5b9327c09a40c65fc06f114a6eb837"
+        "0x042a00d86fcb033183aa25bf84cc94b75ddcfbcd5d40f1b8845e9f4d9cf2cb73"
    }
```

```diff
    contract RiscZeroGroth16Verifier (eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3) [taiko/RiscZeroGroth16Verifier] {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
      sourceHashes.0:
-        "0xb65f1857d55c0e91fb6bef3bce6a2199a0e974fa8f7fd1942b2b46af4ffd70cb"
+        "0x19c3fbedf93ee852d83096519dd22f26409f70fc13f7843307acaecb508981d6"
    }
```

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) [megaeth/MegaUSDmPreDeposit] {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      sourceHashes.0:
-        "0x1e4dc0cf0e125ad726bb101917363d1e5b16e3ce1049250a5c16a6c5591083e4"
+        "0x2a0d96af92e69ce41c4939c1e38d1adf85fe7cf22ac8724456163421281b0160"
    }
```

```diff
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285) [opstack/SuperchainConfigFake] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes.1:
-        "0xcfa8bfbe522f3a85a5385ccb76753907d2f839d7bc257f742c9781269d7cce4d"
+        "0x1b8936912a4352f2e7a7f9a42a1af66fd9bc6c6ea1315c98b4524608d502f809"
    }
```

```diff
    contract Safe (eth:0x63eCafD27E0B86B37903c8aA64beD47244Ad909A) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.1:
-        "0x03bcdc719cb7bd0a1377c01bb50b30a6122b308f673b7d7b15a3bb8628e6bd8c"
+        "0xa9d49d43c1f2cd8b840b38486dff4d5c39da96d00bb42dbc0a57bb7bb2a56d0f"
    }
```

```diff
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad) [eigenlayer/EigenDADisperserRegistry] {
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
      sourceHashes.1:
-        "0x8d337ccea9456dccbcd3d6b82ca9d61509d3a9343487e057438b300efe5484c6"
+        "0xd6d45d6bf7a42c401e94bff9aa98b523d14e47e6c91ec9e5aef48ddea6e75a78"
    }
```

```diff
    contract KailuaGame (eth:0x78F8F8FED1d589b7098EC4B47220465A9Fa071C9) [risc0/KailuaGame] {
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
      sourceHashes.0:
-        "0x8ccbc2dc7979e60f1522fe9a1da1a05647b47340b54f536bc9f43aa54c2d6a01"
+        "0xe68c69640ff19f4def25b2ef5fc28feb0701c3827729149b394af66b728cfad9"
    }
```

```diff
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      sourceHashes.1:
-        "0x2cb05d8405b381db83cf08312454b15a474ae2344ca5b34a2c69b3e2f3c1c87e"
+        "0xe51e34b4f5c2e2600b64518ea6efc5d49b6143fd13ed6ba3f178f8d85e461278"
    }
```

```diff
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      sourceHashes.1:
-        "0x85ca17941ef36ac6b28a4f8f89803d0d41ef419c47586dcd3acdb47ee9617285"
+        "0xfbbe43e439b6631cf110db5ab40bb632fbb1e89cc43125e59a52305d4307e429"
    }
```

```diff
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      sourceHashes.1:
-        "0x1c7d0fda5ed6d8fc7f5b5f7df5e307f0fcfd173fa5833ea9fce8875d5d44d86a"
+        "0xab80c8a5584b65d2ff6b730e9d93b954abfd1eb823ef737f3a3a2cb2be0cf07e"
    }
```

```diff
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) [eigenlayer/EigenDAServiceManager] {
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
      sourceHashes.1:
-        "0x41471c5c89db3f645030775d3f3cc317047a179f36469fbd736db24baed6523e"
+        "0x5446a295966c1f9d773b7b50883f2d7b4890b72f6a5dd66926209ab6ac919a59"
    }
```

```diff
    contract RiscZeroVerifierRouter (eth:0x910b159F79288DD706789ec7768E979d4D88C057) [risc0/RiscZeroVerifierRouter] {
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97).
      sourceHashes.0:
-        "0x09d9c9ba25591eb4e658e547eb5f5cc798449477bf745e6fa9f516a339f88364"
+        "0x3cae3ae6b0f352872c4065d61e6035712203a33041678708105f24c097febd2a"
    }
```

```diff
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract EigenDACertVerifier (eth:0xa4F38615e6a1846ccD7ff08E8179CBdAC8F5ff3B) [eigenda/EigenDACertVerifier] {
    +++ description: A DA verifier contract for EigenDA V2 certificates. The verifier is used to verify the certificate against operator signatures and stake thresholds.
      sourceHashes.0:
-        "0x2246a40167c418ed7a92ae3a5068e397e2ea4035bac8d4728a20c82364fa5f14"
+        "0xea2c1984b5e295622dc9ac6b7a3cd6f47faf6554fe916ecd14513f73f22be476"
    }
```

```diff
    contract Safe (eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0xB2E4D20ECF58f2cE6a8d3bf0c982c2c77BE42152) [opstack/PermissionedDisputeGame] {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      sourceHashes.0:
-        "0x0a442058af95748cc6199d889a46c775f9f6f4d29a61df5124ceb93ff631074d"
+        "0x0865e7c3caf7894a1b91d8420844e95bfde27db825f297d0aab90aa1d46fd5d9"
    }
```

```diff
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05) [eigenlayer/PaymentVault] {
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
      sourceHashes.1:
-        "0xf39de15799feffaa8711b3b5e9ff8fb4c66ef1cbac1fe00cc984f957663d73d1"
+        "0x198f5fd7944b62838fac91becbbf3cdb3aadaa098b9d64c37eccbabf33318378"
    }
```

```diff
    contract Megaeth Multisig (eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B) [eigenlayer/EigenDARelayRegistry] {
    +++ description: Registry for EigenDA relay keys, maps key to address.
      sourceHashes.1:
-        "0x2a5d28cd901637b2eed614152fc63ba60a2a5e10127efe030849aec4cfe64007"
+        "0x04415dba9be0ddc638a871b192f3a780b709a0841a143c08085a9f4ac1372040"
    }
```

```diff
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15) [eigenlayer/EigenDAThresholdRegistry] {
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
      sourceHashes.1:
-        "0x7de6bfaca27d4a2d2ff694543af488ed523e89a1f239036f972852611a228eae"
+        "0x77e829aa26d5459004c4d89d84d90fcc1876ecabc83130235db2c3a71f56b66f"
    }
```

```diff
    contract KailuaTreasury (eth:0xE4e456c64B9b0de5FE8a90d809180cA71534D623) [megaeth/KailuaTreasury] {
    +++ description: Entrypoint for state root proposals. Manages bonds (currently 0.00001 ETH) and tournaments for the OP Kailua state validation system, wrapping the OP stack native DisputeGameFactory.
      sourceHashes.0:
-        "0x114d2fa4777cda59fdbe4bbaa3e319588066e3d66bff66ae8dc4b96589ac1d4b"
+        "0xda724e59049862aec67c8e164b7c54b1943194e1d17baa1576e7e73bb8c99da6"
    }
```

```diff
    contract Safe (eth:0xe8344867AB6387e17b7cAE2dE52C63BCf501BD98) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract AnchorStateRegistry (eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671) [opstack/AnchorStateRegistry] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      sourceHashes.1:
-        "0x5d50c259a38eef46641553e8ec1910a443c1b25062ea558d0b3e0bc7218adae1"
+        "0x5994cf601fe1082877a6b5e5c804511df86a7e532b6a509236b8707a2393517a"
    }
```

```diff
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1) [opstack/MIPS] {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes.0:
-        "0xd693f0cc376e99425037555be4a61adb70c597ad1485e838c475743c79a41fa0"
+        "0x984283956aec5af79f6c8c370e8e233022bf503d14c995b142f29bcc564e24e7"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61) [opstack/OptimismMintableERC20Factory] {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes.1:
-        "0x9650b4bba6299e410f01a369a95a2c57e1c3ca35f0d80c13f4f59fc468f370e5"
+        "0x38811adfaa2c3c1a79fd731951dfcb607841950cdc119cd765fadcc62bc8e61d"
    }
```

Generated with discovered.json: 0xe62529e2277cb51b8ae7cda716d8b1a053850e2e

# Diff at Tue, 05 May 2026 10:22:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777390966
- current timestamp: 1777390966

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777390966 (main branch discovery), not current.

```diff
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) {
    +++ description: None
      deployerAddress:
+        "eth:0x5D9A6573206e5205702E4caD87DC61f4C2a1Ad04"
    }
```

```diff
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D) {
    +++ description: Keeps track of the total stake of each operator.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505) {
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract BunnyInbox (eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2) {
    +++ description: Onchain EigenDA certificate verification inbox. Receives batch data, strips 4-byte prefix, RLP-decodes EigenDACertV3 and calls the EigenDACertVerifier to validate the certificate. Used as the batch inbox for EigenDA-based data availability.
      deployerAddress:
+        "eth:0x61D4daFf34EA0E8267CB238B8d599Bd2EA157B1a"
    }
```

```diff
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract PauserRegistry (eth:0x0c431C66F4dE941d089625E5B423D00707977060) {
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
      deployerAddress:
+        "eth:0x4eF221F76F046f3cFA3f739c9dcD368D59df99DA"
    }
```

```diff
    contract L1StandardBridge (eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E) {
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract ProxyAdmin (eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90) {
    +++ description: None
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A) {
    +++ description: None
      deployerAddress:
+        "eth:0x2bBA03bA38D90634e6afD8C23C16ca01651bc493"
    }
```

```diff
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract MegaPreDepositVaultRefund (eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071) {
    +++ description: Refund escrow designed to hold the funds extracted from the predeposit vault and send them back to the users listed in the vault.
      deployerAddress:
+        "eth:0x7ffeef52BECC931A844B647baE73c3764F3A5bF0"
    }
```

```diff
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34) {
    +++ description: None
      deployerAddress:
+        "eth:0x34D64c402cA43C1c4B368e16130C64aC245718C6"
    }
```

```diff
    contract L1ERC721Bridge (eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract RiscZeroGroth16Verifier (eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3) {
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
      deployerAddress:
+        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
    }
```

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      deployerAddress:
+        "eth:0xe46A884CfF5653f9EbFC58EEe431a036f95FAc0d"
    }
```

```diff
    contract SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2) {
    +++ description: None
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract Safe (eth:0x63eCafD27E0B86B37903c8aA64beD47244Ad909A) {
    +++ description: None
      deployerAddress:
+        "eth:0xeCf89ebA03B54ab9C606d436b32875B6947C68E8"
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad) {
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
      deployerAddress:
+        "eth:0xDF291ebfe90eF9187c3f45609603E366a21a16Ea"
    }
```

```diff
    contract KailuaGame (eth:0x78F8F8FED1d589b7098EC4B47220465A9Fa071C9) {
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
      deployerAddress:
+        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
    }
```

```diff
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract ProxyAdmin (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99) {
    +++ description: None
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) {
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract RiscZeroVerifierRouter (eth:0x910b159F79288DD706789ec7768E979d4D88C057) {
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97).
      deployerAddress:
+        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
    }
```

```diff
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6) {
    +++ description: None
      deployerAddress:
+        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
    }
```

```diff
    contract AddressManager (eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract EigenDACertVerifier (eth:0xa4F38615e6a1846ccD7ff08E8179CBdAC8F5ff3B) {
    +++ description: A DA verifier contract for EigenDA V2 certificates. The verifier is used to verify the certificate against operator signatures and stake thresholds.
      deployerAddress:
+        "eth:0x61D4daFf34EA0E8267CB238B8d599Bd2EA157B1a"
    }
```

```diff
    contract ProxyAdmin (eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A) {
    +++ description: None
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract Safe (eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F) {
    +++ description: None
      deployerAddress:
+        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
    }
```

```diff
    contract PermissionedDisputeGame (eth:0xB2E4D20ECF58f2cE6a8d3bf0c982c2c77BE42152) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05) {
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
      deployerAddress:
+        "eth:0xDF291ebfe90eF9187c3f45609603E366a21a16Ea"
    }
```

```diff
    contract IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030) {
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
      deployerAddress:
+        "eth:0x45B866E099a790cbddA655Ca20Cb11168B2cD088"
    }
```

```diff
    contract Megaeth Multisig (eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719) {
    +++ description: None
      deployerAddress:
+        "eth:0xfa9Ad1bE10BB02FD70634ccEC3264Da9bf43DE79"
    }
```

```diff
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B) {
    +++ description: Registry for EigenDA relay keys, maps key to address.
      deployerAddress:
+        "eth:0xDF291ebfe90eF9187c3f45609603E366a21a16Ea"
    }
```

```diff
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15) {
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
      deployerAddress:
+        "eth:0xDF291ebfe90eF9187c3f45609603E366a21a16Ea"
    }
```

```diff
    contract KailuaTreasury (eth:0xE4e456c64B9b0de5FE8a90d809180cA71534D623) {
    +++ description: Entrypoint for state root proposals. Manages bonds (currently 0.00001 ETH) and tournaments for the OP Kailua state validation system, wrapping the OP stack native DisputeGameFactory.
      deployerAddress:
+        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
    }
```

```diff
    contract Safe (eth:0xe8344867AB6387e17b7cAE2dE52C63BCf501BD98) {
    +++ description: None
      deployerAddress:
+        "eth:0xfa9Ad1bE10BB02FD70634ccEC3264Da9bf43DE79"
    }
```

```diff
    contract AnchorStateRegistry (eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671) {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

```diff
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      deployerAddress:
+        "eth:0x1D0519EeD308BcD49e4ebc149284F83ebC275284"
    }
```

```diff
    contract OptimismMintableERC20Factory (eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      deployerAddress:
+        "eth:0x8B21106E95634B69433CB96dA93fc703D5bDba64"
    }
```

Generated with discovered.json: 0x65db1babac4f24853defddba68d6544d2fdb06e6

# Diff at Tue, 28 Apr 2026 15:45:52 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@0695512a70f7175257fb7756eb2008702d3f0dc5 block: 1776158984
- current timestamp: 1777390966

## Description

Sequencer-side Safe (`eth:0x63eCafD2...`) gained one new signer (`0x12130aF2`). Threshold unchanged at 1; total signers 3 → 4 (1-of-3 → 1-of-4 — note this *weakens* the threshold ratio: any one of 4 can still execute).

## Watched changes

```diff
    contract Safe (eth:0x63eCafD27E0B86B37903c8aA64beD47244Ad909A) {
    +++ description: None
      values.$members.0:
+        "eth:0x12130aF2fd6E23Cb4EFD396146bE064e893Fc694"
      values.multisigThreshold:
-        "1 of 3 (33%)"
+        "1 of 4 (25%)"
    }
```

Generated with discovered.json: 0xdba748d6aa232bf6d266e507b4626f7d513b835a

# Diff at Tue, 14 Apr 2026 09:31:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ab81aee13d178d88bf4431c3eea7328c9a3001a7 block: 1775212027
- current timestamp: 1776158984

## Description

New EOA inbox, moving away from the BunnyInbox that was intended to be used as a DA verifier in the future.

# Watched changes

```diff
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.sequencerInbox:
-        "eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2"
+        "eth:0x00656C604FC470e6a566A695B74455e18a6D75D3"
    }
```

Generated with discovered.json: 0xb85a721bdf1bea458c691b0da4ba9c479b38fe61

# Diff at Fri, 03 Apr 2026 10:29:12 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@f7ea9128001c4f5cbcec9e8c1da7ffb72aff3ffe block: 1773318433
- current timestamp: 1775212027

## Description

EigenDAOperationsMultisig member removed (0x4985...), threshold unchanged at 3, now 3-of-4 (75%) instead of 3-of-5 (60%). Shared contract with eigenda/syndicate.

## Watched changes

```diff
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) {
    +++ description: None
      values.$members.1:
-        "eth:0x4985238672d91Baed43dF1B2431F67bc332A1753"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x6e4627dcb6ec2855ebca11f4c3c877b574533888

# Diff at Thu, 12 Mar 2026 12:29:13 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@7821558a34509d47e2b343e48879506088be050d block: 1772118387
- current timestamp: 1773318433

## Description

Discovery simplification

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1772118387 (main branch discovery), not current.

```diff
    contract EigenDAOperationsMultisig (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) {
    +++ description: None
      category:
-        {"name":"Spam","priority":-1}
    }
```

```diff
    contract StakeRegistry (eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D) {
    +++ description: Keeps track of the total stake of each operator.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract BLSApkRegistry (eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505) {
    +++ description: Keeps track of the BLS public keys of each operator and the quorum aggregated keys.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract BunnyInbox (eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2) {
    +++ description: Onchain EigenDA certificate verification inbox. Receives batch data, strips 4-byte prefix, RLP-decodes EigenDACertV3 and calls the EigenDACertVerifier to validate the certificate. Used as the batch inbox for EigenDA-based data availability.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RegistryCoordinator (eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656) {
    +++ description: Operators register here with an AVS: The coordinator has three registries: 1) a `StakeRegistry` that keeps track of operators' stakes, 2) a `BLSApkRegistry` that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, 3) an `IndexRegistry` that keeps track of an ordered list of operators for each quorum.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract PauserRegistry (eth:0x0c431C66F4dE941d089625E5B423D00707977060) {
    +++ description: Defines and stores pauser and unpauser roles for EigenDA contracts.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E) {
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A) {
    +++ description: None
      category:
-        {"name":"Spam","priority":-1}
    }
```

```diff
    contract MegaPreDepositVaultRefund (eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071) {
    +++ description: Refund escrow designed to hold the funds extracted from the predeposit vault and send them back to the users listed in the vault.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34) {
    +++ description: None
      category:
-        {"name":"Spam","priority":-1}
    }
```

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2) {
    +++ description: None
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad) {
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract ProxyAdmin (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99) {
    +++ description: None
      category:
-        {"name":"Spam","priority":-1}
    }
```

```diff
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0) {
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05) {
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030) {
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B) {
    +++ description: Registry for EigenDA relay keys, maps key to address.
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15) {
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
      category.name:
-        "Spam"
+        "Shared Infrastructure"
      category.priority:
-        -1
+        4
    }
```

```diff
    contract KailuaTreasury (eth:0xE4e456c64B9b0de5FE8a90d809180cA71534D623) {
    +++ description: Entrypoint for state root proposals. Manages bonds (currently 0.00001 ETH) and tournaments for the OP Kailua state validation system, wrapping the OP stack native DisputeGameFactory.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
+   Status: CREATED
    reference AVSDirectory (eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF)
    +++ description: None
```

```diff
+   Status: CREATED
    reference EigenLayerOwningMultisig (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111)
    +++ description: None
```

```diff
+   Status: CREATED
    reference DelegationManager (eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A)
    +++ description: None
```

```diff
+   Status: CREATED
    reference EigenLayerPauserMultisig (eth:0x5050389572f2d220ad927CcbeA0D406831012390)
    +++ description: None
```

```diff
+   Status: CREATED
    reference EigenLayerOperationsMultisig (eth:0xBE1685C81aA44FF9FB319dD389addd9374383e90)
    +++ description: None
```

Generated with discovered.json: 0xbb00c55819585f961d3ee733beb81fab25aad383

# Diff at Thu, 26 Feb 2026 15:07:35 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@17ff9ba367ef55b34e16f082bde7902f4760911e block: 1770803234
- current timestamp: 1772118387

## Description

EigenLayerRewardsInitiatorMultisig: one member removed (0xf20eD26be), reducing signers from 5 to 4. Threshold remains 3, changing the effective quorum from 3/5 (60%) to 3/4 (75%).

## Watched changes

```diff
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A) {
    +++ description: None
      values.$members.4:
-        "eth:0xf20eD26be203f09B8F0Cb3265E74BB6AD24408b4"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x9bb8dbe254646e18788dca7d180bc3df1b5297ca

# Diff at Fri, 13 Feb 2026 11:33:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@55ab80636f1e0c000e757a7a146f11035a19e9c0 block: 1770803234
- current timestamp: 1770803234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1770803234 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.challengerFromDGF:
+        "UNRESOLVED"
      values.proposerFromDGF:
+        "UNRESOLVED"
      values.wethFromDGF:
+        "UNRESOLVED"
      usedTypes:
+        [{"typeCaster":"SliceAddress","arg":{"offset":124}},{"typeCaster":"SliceAddress","arg":{"offset":144}},{"typeCaster":"SliceAddress","arg":{"offset":72}}]
    }
```

Generated with discovered.json: 0x005962f940b64052a3a63ee30f17f3652da92d65

# Diff at Wed, 11 Feb 2026 09:48:23 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@d8d7849eeca6acaf38e3906f30da1c0c878658af block: 1769535661
- current timestamp: 1770803234

## Description

Major update: MegaETH transitions to onchain EigenDA certificate verification via a new BunnyInbox contract.

**SystemConfig upgrade (v2.5.0 → v2.7.0):**
Upgraded implementation from 0x2425EB to 0x7f84fE. The only code change is the addition of a new `setBatchInbox(address)` function allowing the owner to change the batch inbox address on-chain ([diff](https://disco.l2beat.com/diff/eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639/eth:0x7f84fEb1cEb9C91844ee80C63d153d9128Fb40e9)). The batchInbox was changed from the old EOA (0x00656C) to the new BunnyInbox contract (0x02B8d1).

**BunnyInbox (new, 0x02B8d1):**
New upgradeable contract serving as the batch inbox. Its `fallback()` function strips a 4-byte prefix from calldata, RLP-decodes an EigenDACertV3 struct, and calls `EigenDACertVerifier.checkDACertReverts()` to validate the EigenDA certificate on-chain. This means every batch submission now verifies the EigenDA data availability certificate on L1.

**EigenDACertVerifier (new, 0xa4F386) + EigenDA/EigenLayer infrastructure:**
An immutable EigenDA V3 certificate verifier referenced by BunnyInbox. It verifies batch data attestations against operator signatures and stake thresholds via the EigenDAServiceManager. 

**Stale proof system config:**
The KailuaGame and KailuaTreasury have an immutable `ROLLUP_CONFIG_HASH` (0x16ebac7d...) that commits to the rollup config including the batch inbox address. Since the batch inbox changed from the old EOA (0x00656C) to BunnyInbox (0x02B8d1), but the games were NOT redeployed, the on-chain `ROLLUP_CONFIG_HASH` no longer matches the current chain config. Any ZK proof generated against the current derivation pipeline would produce a different config hash and fail on-chain verification. Additionally, the `FPVM_IMAGE_ID` likely needs updating so the prover program rejects reverted BunnyInbox transactions - otherwise the batcher could submit invalid DA certs that revert on L1 but are still picked up by derivation. The games should be redeployed with updated `ROLLUP_CONFIG_HASH` and `FPVM_IMAGE_ID`.

**Governance changes:**
- MegaETH Safe multisig changed from 4/8 (50%) to 6/10 (60%) threshold
- Two new members added: a 1-of-3 nested Safe (0x63eC, nonce 0) and an EOA (0x0D17)

## Watched changes

```diff
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x5f25d989fb6ccdc8dcf6fec90727faecf13ba2e3a9cc2d4ca902a5be71e10b9a"
+        "0x18ecfc662e320a3cf78978511db8f7d6f3819d32a52e70d74cc636c9a43335e8"
      values.$implementation:
-        "eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639"
+        "eth:0x7f84fEb1cEb9C91844ee80C63d153d9128Fb40e9"
      values.$pastUpgrades.1:
+        ["2026-02-09T04:47:59.000Z","0x9c539698c6852b92c7289498f8b808d3ede8c412362dbb31c485c94e09e0cd10",["eth:0x7f84fEb1cEb9C91844ee80C63d153d9128Fb40e9"]]
      values.$upgradeCount:
-        1
+        2
      values.batchInbox:
-        "eth:0x00656C604FC470e6a566A695B74455e18a6D75D3"
+        "eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2"
      values.sequencerInbox:
-        "eth:0x00656C604FC470e6a566A695B74455e18a6D75D3"
+        "eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2"
      values.version:
-        "2.5.0"
+        "2.7.0"
      implementationNames.eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639:
-        "SystemConfig"
      implementationNames.eth:0x7f84fEb1cEb9C91844ee80C63d153d9128Fb40e9:
+        "SystemConfig"
    }
```

```diff
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6) {
    +++ description: None
      values.$members.0:
+        "eth:0x63eCafD27E0B86B37903c8aA64beD47244Ad909A"
      values.$members.1:
+        "eth:0x0D173c5d6d6018075f63F4977ae7561f7F9A40eF"
      values.$threshold:
-        4
+        6
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "6 of 10 (60%)"
      receivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2","role":"admin"}
    }
```

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
    contract BunnyInbox (eth:0x02B8d1329B653d6f53A8420C8DDbBbb5518F51b2)
    +++ description: Onchain EigenDA certificate verification inbox. Receives batch data, strips 4-byte prefix, RLP-decodes EigenDACertV3 and calls the EigenDACertVerifier to validate the certificate. Used as the batch inbox for EigenDA-based data availability.
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
    contract EjectionManager (eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E)
    +++ description: Contract used for ejection of operators from the RegistryCoordinator for violating the Service Legal Agreement (SLA).
```

```diff
+   Status: CREATED
    contract EigenLayerRewardsInitiatorMultisig (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDA Multisig (eth:0x338477FfaF63c04AC06048787f910671eC914B34)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SocketRegistry (eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x63eCafD27E0B86B37903c8aA64beD47244Ad909A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDADisperserRegistry (eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad)
    +++ description: Registry for EigenDA disperser info such as disperser key to address mapping.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EigenDAServiceManager (eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0)
    +++ description: Bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.
```

```diff
+   Status: CREATED
    contract EigenDACertVerifier (eth:0xa4F38615e6a1846ccD7ff08E8179CBdAC8F5ff3B)
    +++ description: A DA verifier contract for EigenDA V2 certificates. The verifier is used to verify the certificate against operator signatures and stake thresholds.
```

```diff
+   Status: CREATED
    contract PaymentVault (eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05)
    +++ description: Entrypoint for making reservations and on demand payments for EigenDA.
```

```diff
+   Status: CREATED
    contract IndexRegistry (eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030)
    +++ description: A registry contract that keeps track of an ordered list of operators for each quorum.
```

```diff
+   Status: CREATED
    contract EigenDARelayRegistry (eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B)
    +++ description: Registry for EigenDA relay keys, maps key to address.
```

```diff
+   Status: CREATED
    contract EigenDAThresholdRegistry (eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15)
    +++ description: Registry of EigenDA threshold (i.e, adversary and confirmation threshold percentage for a quorum)
```

## Source code changes

```diff
.../.flat/BLSApkRegistry/BLSApkRegistry.sol        | 1038 +++++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../megaeth/.flat/BunnyInbox/BunnyInbox.sol        | 1402 ++++++++++
 .../BunnyInbox/TransparentUpgradeableProxy.p.sol   |  631 +++++
 .../megaeth/.flat/EigenDA Multisig/Safe.sol        | 1088 ++++++++
 .../megaeth/.flat/EigenDA Multisig/SafeProxy.p.sol |   37 +
 .../projects/megaeth/.flat/EigenDACertVerifier.sol | 1329 +++++++++
 .../EigenDADisperserRegistry.sol                   |  410 +++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../.flat/EigenDAOperationsMultisig/Safe.sol       | 1088 ++++++++
 .../EigenDAOperationsMultisig/SafeProxy.p.sol      |   37 +
 .../EigenDARelayRegistry/EigenDARelayRegistry.sol  |  420 +++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../EigenDAServiceManager.sol                      | 2699 +++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../EigenDAThresholdRegistry.sol                   |  715 +++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../GnosisSafe.sol                                 |  953 +++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/EjectionManager/EjectionManager.sol      |  593 ++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../megaeth/.flat/IndexRegistry/IndexRegistry.sol  |  724 +++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../src/projects/megaeth/.flat/PauserRegistry.sol  |   58 +
 .../megaeth/.flat/PaymentVault/PaymentVault.sol    |  594 ++++
 .../PaymentVault/TransparentUpgradeableProxy.p.sol |  631 +++++
 ...:0x8247EF5705d3345516286B72bFE6D690197C2E99.sol |  147 +
 .../RegistryCoordinator/RegistryCoordinator.sol    | 2847 ++++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../Safe.sol                                       | 1088 ++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../.flat/SocketRegistry/SocketRegistry.sol        |   53 +
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../megaeth/.flat/StakeRegistry/StakeRegistry.sol  | 1176 ++++++++
 .../TransparentUpgradeableProxy.p.sol              |  631 +++++
 .../SystemConfig/SystemConfig.sol                  |   16 +-
 36 files changed, 26154 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x3e3c2ac5fc6f4de059ee493adb99384715acc81c

# Diff at Wed, 21 Jan 2026 10:06:24 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@a72aa7d50f1dddc0c7a6eae7f60679fc94e4eabf block: 1767341266
- current timestamp: 1768989919

## Description

New member added to MegaETH Safe multisig (now 4/8, previously 4/7).

## Watched changes

```diff
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6) {
    +++ description: None
      values.$members.0:
+        "eth:0x070Cf79fB8D0A0BcBe2d017c6A059148705c9800"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x7c45d450fb2bdc3b24ca26628384d125cdc2ff16

# Diff at Fri, 02 Jan 2026 08:09:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@af64ce90718299c8e665957964f0083baa176a36 block: 1764760164
- current timestamp: 1767341266

## Description

Initial discovery. Untemplatized contracts diff with most similar templatized:
- SystemConfig:                                                                                                                                                                                                       
  https://disco.l2beat.com/diff/eth:0x340f923E5c7cbB2171146f64169EC9d5a9FfE647/eth:0x2425EB983A470eDE96E33c4E969Ac5440a80a639  (higher gas limit)
- OptimismPortal2:                                                                                                                                                                                              
  https://disco.l2beat.com/diff/eth:0xB250566074B3c0f1B109A531A83f3d9B1a579273/eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9  (no constructor params, system address)
- SuperchainConfig:                                                                                                                                                                                                   
  https://disco.l2beat.com/diff/eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7/eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89  (guardian transfer functions)

basti 12/22: the verifier contract source is now available. looks like an older risc0groth16 verifier: https://disco.l2beat.com/diff/eth:0xafB31f5b70623CDF4b20Ada3f7230916A5A79df9/eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3

state validation: assuming the `0xf0ce5d15fa89991210ca2667b7f7a8bb740ce551c0f2b20cc76f9debc55d22c2` program hash corresponds to a valid kailua program that also verifies the eigenDA v2 commitments, the proof system is a standard kailua hybrid validity / fp system as deployed for BOB. The single large difference would be that the vanguard advantage is uint max and therefore the proof system can be delayed ~indefinitely by the vanguard.

## Watched changes

```diff
    EOA  (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"guard","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":".guardian"}
      receivedPermissions.1.via:
+        [{"address":"eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F"}]
      receivedPermissions.1.role:
-        ".owner"
+        ".guardian"
      receivedPermissions.1.description:
-        "can pull funds from the contract in case of emergency."
      receivedPermissions.1.from:
-        "eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145"
+        "eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285"
      receivedPermissions.1.permission:
-        "interact"
+        "guard"
      receivedPermissions.3:
-        {"permission":"interact","from":"eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":"admin","via":[{"address":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.9:
-        {"permission":"upgrade","from":"eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.11:
-        {"permission":"upgrade","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.12:
-        {"permission":"upgrade","from":"eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      receivedPermissions.13:
-        {"permission":"upgrade","from":"eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}
      controlsMajorityOfUpgradePermissions:
-        true
      directlyReceivedPermissions:
-        [{"permission":"act","from":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90","role":".owner"},{"permission":"act","from":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A","role":".owner"}]
    }
```

```diff
    contract ProxyAdmin (eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90) {
    +++ description: None
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.blobbasefeeScalar:
-        801949
+        0
      values.owner:
-        "eth:0x5785Df5b4234Fc63F9D6ecFe30C40b6b44619fd2"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      values.isDepositActive:
-        true
+        false
    }
```

```diff
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes.1:
-        "0x03dba37173051b02bc81487e181c791bcf1aef664c249e5d035f11f488bdd686"
+        "0xcfa8bfbe522f3a85a5385ccb76753907d2f839d7bc257f742c9781269d7cce4d"
      values.$implementation:
-        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89"
      values.$pastUpgrades.1:
+        ["2025-12-18T02:00:35.000Z","0xcf4419b7fd683f75f9619984db245eca086853395d6f033099ad7e00b0eb4518",["eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89"]]
      values.$upgradeCount:
-        1
+        2
      values.guardian:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F"
      values.version:
-        "1.2.0"
+        "1.3.0"
      values.PENDING_GUARDIAN_SLOT:
+        "0xd27e97cacf895026d8121da1df07f0476456b12320e92b2a622d646c7a54955c"
      values.pendingGuardian:
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0x2F64d234f1Ec6bA2eA6914d943c99b45fFF14E89:
+        "SuperchainConfig"
    }
```

```diff
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8) {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame.
      sourceHashes.1:
-        "0x8f2cec012bf54c7d3bf484bd41d932fbb47b7977bce894ea2138262e61905a92"
+        "0x2cb05d8405b381db83cf08312454b15a474ae2344ca5b34a2c69b3e2f3c1c87e"
      values.$implementation:
-        "eth:0x31f6E6a37ce650723EBf082EC59A48779be9Af99"
+        "eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9"
      values.$pastUpgrades.1:
+        ["2025-12-18T01:52:23.000Z","0x79b2cfcd6e5c08d9912d7450c4f77db522be234ea86b4c7db6c10fc0b711b353",["eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9"]]
      values.$upgradeCount:
-        1
+        2
      values.guardian:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F"
      values.version:
-        "3.14.0"
+        "3.15.2"
      values.RespectedGameString:
+        "KailuaGame"
      implementationNames.eth:0x31f6E6a37ce650723EBf082EC59A48779be9Af99:
-        "OptimismPortal2"
      implementationNames.eth:0x55400445e384393f9c1BE23e7E734e8d44Ed9fd9:
+        "OptimismPortal2"
      template:
+        "opstack/OptimismPortal2"
      description:
+        "The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the KailuaGame."
      fieldMeta:
+        {"respectedGameType":{"severity":"HIGH"},"paused":{"severity":"HIGH","description":"Whether the contract is paused or not. Determined by the SuperchainConfig contract PAUSED_SLOT. Here it pauses withdrawals. If this is paused, also the L1CrossDomainMessenger and ERC-20, ERC-721 deposits are paused."}}
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"FaultDisputeGame","1":"PermissionedDisputeGame","1337":"KailuaGame"}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145) {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
    contract ProxyAdmin (eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A) {
    +++ description: None
      values.owner:
-        "eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97"
+        "eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6"
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x92e0E0B15e3e99b32c9ED9AD284F939553C7b7d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xB2A9EB0c7b729c3EC704e843eF260084B3caE67F)
    +++ description: None
```

## Source code changes

```diff
.../OptimismPortal2/OptimismPortal2.sol            |   15 +-
 .../Safe.sol                                       |    0
 .../SafeProxy.p.sol                                |    0
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../Safe.sol                                       | 1088 ++++++++++++++++++++
 .../SafeProxy.p.sol                                |   37 +
 .../SuperchainConfig/SuperchainConfig.sol          |   49 +-
 8 files changed, 2307 insertions(+), 7 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764760164 (main branch discovery), not current.

```diff
    EOA  (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":".guardian"},{"permission":"interact","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","description":"can pull funds from the contract in case of emergency.","role":".owner"},{"permission":"interact","from":"eth:0x910b159F79288DD706789ec7768E979d4D88C057","description":"add/remove verifiers and the selectors they are mapped to.","role":".owner"},{"permission":"interact","from":"eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df","description":"set and change address mappings.","role":".owner","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","role":".$admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285","role":"admin","via":[{"address":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A"}]},{"permission":"upgrade","from":"eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]},{"permission":"upgrade","from":"eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61","role":"admin","via":[{"address":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90"}]}]
      controlsMajorityOfUpgradePermissions:
+        true
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90","role":".owner"},{"permission":"act","from":"eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A","role":".owner"}]
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x15fCB0120D414f246ead019cA4BdF97447cd8d90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x1ED92E1bc9A2735216540EDdD0191144681cb77E)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x3D8ee269F87A7f3F0590c5C0d825FFF06212A242)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract RiscZeroGroth16Verifier (eth:0x411e56a890c5fe0712f6F345977815Ba8E7785C3)
    +++ description: Verifier contract for RISC Zero Groth16 proofs (version 2.0.0-rc.3).
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x5d0Ff601BC8580D8682c0462df55343Cb0b99285)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0x6C7198250087B29A8040eC63903Bc130f4831Cc9)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract KailuaGame (eth:0x78F8F8FED1d589b7098EC4B47220465A9Fa071C9)
    +++ description: Implementation of the KailuaGame with type 1337. Based on this implementation, new KailuaGames are created with every new state root proposal.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0x7f82f57F0Dd546519324392e408b01fcC7D709e8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x8546840adF796875cD9AAcc5B3B048f6B2c9D563)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0x86183e7b1D908D9A5C3Bc59cC2232F2ffE4E7145)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierRouter (eth:0x910b159F79288DD706789ec7768E979d4D88C057)
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (eth:0x0A383fF8387CF07315f476D1686E95b1a97adc97).
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x9754fD3D63B3EAC3fd62b6D54DE4f61b00D6E0Df)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xab48b73a9e59aF01AfE91e18cA0774295581d07A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xB2E4D20ECF58f2cE6a8d3bf0c982c2c77BE42152)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract KailuaTreasury (eth:0xE4e456c64B9b0de5FE8a90d809180cA71534D623)
    +++ description: Entrypoint for state root proposals. Manages bonds (currently 0.00001 ETH) and tournaments for the OP Kailua state validation system, wrapping the OP stack native DisputeGameFactory.
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0xEEd67E139CC7721EC656B449F01B7b4D7dCFD671)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0xF875030B9464001fC0f964E47546b0AFEEbD7C61)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

Generated with discovered.json: 0x2b5b1b5f11f0a81947406627fc2b7a6122c03ac5

# Diff at Wed, 03 Dec 2025 11:25:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb61f5ec5bdfe1b0d99f8a8bbf88c803aa243605 block: 1764165346
- current timestamp: 1764760164

## Description

refund contract deployed, refunds completed.

## Watched changes

```diff
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6) {
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071.
      description:
-        "Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719."
+        "Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071."
      values.treasury:
-        "eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719"
+        "eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071"
    }
```

```diff
+   Status: CREATED
    contract MegaPreDepositVaultRefund (eth:0x22cfa62eD71922781984aA2AcffEfA9a82593071)
    +++ description: Refund escrow designed to hold the funds extracted from the predeposit vault and send them back to the users listed in the vault.
```

```diff
+   Status: CREATED
    contract Safe (eth:0xe8344867AB6387e17b7cAE2dE52C63BCf501BD98)
    +++ description: None
```

## Source code changes

```diff
.../megaeth/.flat/MegaPreDepositVaultRefund.sol    | 1029 ++++++++++++++++++
 .../src/projects/megaeth/.flat/Safe/Safe.sol       | 1088 ++++++++++++++++++++
 .../projects/megaeth/.flat/Safe/SafeProxy.p.sol    |   37 +
 3 files changed, 2154 insertions(+)
```

Generated with discovered.json: 0xf9cd8338d39ae28745c59c2f01082a705999a80a

# Diff at Wed, 26 Nov 2025 10:21:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1764152153

## Description

Add Megaeth predeposit contract and TVS.

## Initial discovery

```diff
+   Status: CREATED
    contract MegaUSDmPreDeposit (eth:0x46D6Eba3AECD215a3e703cdA963820d4520b45D6)
    +++ description: Predeposit Escrow, not connected to an L2: Users can deposit USDC. The system uses off-chain permit signatures to ensure only KYC'd users can deposit. Withdrawals can only be made by eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719 to eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719.
```

```diff
+   Status: CREATED
    contract Megaeth Multisig (eth:0xCB264DEf50D166d4aE7cF60188eC0038819fb719)
    +++ description: None
```
