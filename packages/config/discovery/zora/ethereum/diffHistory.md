Generated with discovered.json: 0x17398243c9413b2433cd0f12f26f0727c40ba1d7

# Diff at Tue, 04 Mar 2025 11:26:56 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21829679
- current block number: 21829679

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829679 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x12f52597d0ec802e4deaef408287ff35f3719f86

# Diff at Tue, 04 Mar 2025 10:40:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21829679
- current block number: 21829679

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829679 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sinceBlock:
+        19989094
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sinceBlock:
+        19968607
    }
```

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        17473938
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      sinceBlock:
+        19989094
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        17473935
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sinceBlock:
+        16780617
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      sinceBlock:
+        17365800
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sinceBlock:
+        19185554
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        17473940
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sinceBlock:
+        19185544
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19064589
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sinceBlock:
+        11670007
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        17473936
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        17473941
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      sinceBlock:
+        19185517
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        17473939
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      sinceBlock:
+        20566057
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      sinceBlock:
+        17465570
    }
```

```diff
    contract ZoraMultisig2 (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      sinceBlock:
+        17465587
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      sinceBlock:
+        17473931
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        17473937
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        12686687
    }
```

```diff
    contract AddressManager (0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        17473931
    }
```

Generated with discovered.json: 0x1d9191a561430d5aa8f04a5b3282e54a5e158dda

# Diff at Thu, 27 Feb 2025 11:47:15 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21829679
- current block number: 21829679

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829679 (main branch discovery), not current.

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      name:
-        "Lib_AddressManager"
+        "AddressManager"
      displayName:
-        "AddressManager"
    }
```

Generated with discovered.json: 0x96cfbeb32ad0f5c9a88f588c133fe521ca8cc3db

# Diff at Wed, 26 Feb 2025 10:33:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21829679
- current block number: 21829679

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829679 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xc638773c8de8935b5a453f2dadf3f0b0ec289b85

# Diff at Fri, 21 Feb 2025 14:12:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21829679
- current block number: 21829679

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829679 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ZoraMultisig2 (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x89f6b200951f7cca675cb19fb3bca26fab350955

# Diff at Fri, 21 Feb 2025 09:00:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829679
- current block number: 21829679

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829679 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x2358a3a0de53b3a1a1045c3f7b2d659b0e9502a7

# Diff at Wed, 12 Feb 2025 10:01:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21802841
- current block number: 21829679

## Description

Optimism SecurityCouncil rotates signers.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.7:
-        "0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310"
+        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
      values.$members.5:
-        "0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e"
+        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
    }
```

Generated with discovered.json: 0x41d4369757ebb42bcea4d767982e5bec1fe25cb8

# Diff at Mon, 10 Feb 2025 19:05:08 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21802841
- current block number: 21802841

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802841 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x24d2a53b5cd61ee87da428e84cfad5a52841b207

# Diff at Sat, 08 Feb 2025 15:58:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786512
- current block number: 21802841

## Description

Single SC member rotated.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.12:
-        "0xE895076cD050F1f042d1040E47b5929bE989E514"
+        "0x92827223f6b397CE9F208eE352bacA710765cACb"
      values.$members.1:
-        "0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8"
+        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
    }
```

Generated with discovered.json: 0x415b0374d033ef14e09347cb569369a45c4e9943

# Diff at Thu, 06 Feb 2025 09:17:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21715637
- current block number: 21786512

## Description

OP Stack SC signer rotation.

## Watched changes

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$members.9:
-        "0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4"
+        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
    }
```

Generated with discovered.json: 0xc0747f52713d0f53a4afcf9b51b0c531d2f06561

# Diff at Tue, 04 Feb 2025 12:33:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21715637
- current block number: 21715637

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715637 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xa3bd85701b1bdccadfca3a22f6cc966f97329962

# Diff at Mon, 27 Jan 2025 11:43:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21628494
- current block number: 21715637

## Description

This is a SystemConfig upgrade (v2.3.0, adding gasToken support) for five Superchain eco chains that use superchain governance.
- op mainnet
- metal
- zora
- arena-z
- mode

Due to temporary storage setter implementations, multiple upgrades are counted within a single tx.

## Watched changes

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"
+        "0xc7135dbd2a53312d36df3f3ee91ce0a5a459ab8fc7725880a3a9c55a5fa0ed6c"
      values.$implementation:
-        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
+        "0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"
      values.$pastUpgrades.4:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xAB9d6cB7A427c0765163A7f45BB91cAfe5f2D375"]]
      values.$pastUpgrades.3:
+        ["2025-01-24T14:41:35.000Z","0x86da7386a26978c3db89e97c1f4feee613a8a0c07bbe4640624b05276f49c350",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$upgradeCount:
-        3
+        5
      values.L2_OUTPUT_ORACLE_SLOT:
-        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
-        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      values.version:
-        "1.12.0"
+        "2.3.0"
      values.basefeeScalar:
+        100000
      values.blobbasefeeScalar:
+        611590
      values.DISPUTE_GAME_FACTORY_SLOT:
+        "0x52322a25d9f59ea17656545543306b7aef62bc0cc53a0e65ccfa0c75b97aa906"
      values.disputeGameFactory:
+        "0x0000000000000000000000000000000000000000"
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      values.gasPayingToken:
+        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      values.maximumGasLimit:
+        200000000
    }
```

## Source code changes

```diff
.../SystemConfig/SystemConfig.sol                  | 1502 +++++++++++++++++++-
 1 file changed, 1462 insertions(+), 40 deletions(-)
```

Generated with discovered.json: 0xfe047c85ae082046c887c573b3c5a199efe8f530

# Diff at Tue, 21 Jan 2025 11:19:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@0da84acc479f34212f2c8133869a3eef33d46ecc block: 21628494
- current block number: 21628494

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628494 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
-        [{"permission":"guard","from":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]},{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      issuedPermissions:
+        [{"permission":"configure","to":"0x24424336F04440b1c28685a38303aC33C9D14a25","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d.","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.via.0.condition:
+        "not revoked by the Security Council"
      issuedPermissions.0.to:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.via.2:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}
      issuedPermissions.0.via.1.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.0.condition:
+        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"can remove members of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 inactive for 98d."}]
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","from":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]},{"permission":"guard","from":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"},{"address":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x0454092516c9A4d636d3CAfA1e82161376C8a748","description":"takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","condition":"the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.via.0.condition:
+        "not revoked by the Security Council"
      issuedPermissions.0.to:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      issuedPermissions.0.via.2:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}
      issuedPermissions.0.via.1.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.0.condition:
+        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.via.1.condition:
+        "not revoked by the Security Council"
      receivedPermissions.0.via.1.condition:
+        "not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
+        "not revoked by the Security Council"
    }
```

Generated with discovered.json: 0x2217b9b183aa02a492e8cb820615bd62e227e157

# Diff at Mon, 20 Jan 2025 11:10:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628494
- current block number: 21628494

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628494 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.target:
-        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      receivedPermissions.0.from:
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      directlyReceivedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      directlyReceivedPermissions.0.from:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      directlyReceivedPermissions.0.from:
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
    }
```

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.3.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.1.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.target:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"
      receivedPermissions.8.from:
+        "0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"
      receivedPermissions.7.target:
-        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
      receivedPermissions.7.from:
+        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
      receivedPermissions.6.target:
-        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      receivedPermissions.6.from:
+        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      receivedPermissions.5.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.5.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.4.target:
-        "0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"
      receivedPermissions.4.from:
+        "0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"
      receivedPermissions.3.target:
-        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
      receivedPermissions.3.from:
+        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
      receivedPermissions.2.target:
-        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      receivedPermissions.2.from:
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      receivedPermissions.1.target:
-        "0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"
      receivedPermissions.1.from:
+        "0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"
      receivedPermissions.0.target:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.from:
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.1.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
      directlyReceivedPermissions.1.from:
+        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
      directlyReceivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      directlyReceivedPermissions.0.from:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.1.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.target:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.target:
-        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      receivedPermissions.0.from:
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      directlyReceivedPermissions.0.target:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      directlyReceivedPermissions.0.from:
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0x48247032092e7b0ecf5dEF611ad89eaf3fC888Dd"
      issuedPermissions.1.to:
+        "0x48247032092e7b0ecf5dEF611ad89eaf3fC888Dd"
      issuedPermissions.0.target:
-        "0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72"
      issuedPermissions.0.to:
+        "0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72"
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.target:
-        "0x625726c858dBF78c0125436C943Bf4b4bE9d9033"
      issuedPermissions.1.to:
+        "0x625726c858dBF78c0125436C943Bf4b4bE9d9033"
      issuedPermissions.0.target:
-        "0xC72aE5c7cc9a332699305E29F68Be66c73b60542"
      issuedPermissions.0.to:
+        "0xC72aE5c7cc9a332699305E29F68Be66c73b60542"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.1.from:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.target:
-        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      receivedPermissions.0.from:
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions.0.target:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      directlyReceivedPermissions.0.from:
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
      receivedPermissions.0.from:
+        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
    }
```

```diff
    contract ZoraMultisig2 (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      receivedPermissions.0.from:
+        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"
      directlyReceivedPermissions.6.from:
+        "0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"
      directlyReceivedPermissions.5.target:
-        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
      directlyReceivedPermissions.5.from:
+        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
      directlyReceivedPermissions.4.target:
-        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      directlyReceivedPermissions.4.from:
+        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      directlyReceivedPermissions.3.target:
-        "0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"
      directlyReceivedPermissions.3.from:
+        "0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"
      directlyReceivedPermissions.2.target:
-        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
      directlyReceivedPermissions.2.from:
+        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
      directlyReceivedPermissions.1.target:
-        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      directlyReceivedPermissions.1.from:
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      directlyReceivedPermissions.0.target:
-        "0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"
      directlyReceivedPermissions.0.from:
+        "0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0xab8ae1790b65910b1b915f86d51e27c42eee606e

# Diff at Wed, 15 Jan 2025 07:49:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21235658
- current block number: 21628494

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235658 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x81d7e8dc2a71e7ecd1563628979c17da0844d6c6

# Diff at Wed, 08 Jan 2025 09:09:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21235658
- current block number: 21235658

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235658 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xafa144174da2cf7613ebe3d2948865f31ba85f03

# Diff at Thu, 21 Nov 2024 10:58:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 21122420
- current block number: 21235658

## Description

Rename OP-Foundation multisigs

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21122420 (main branch discovery), not current.

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      name:
-        "OptimismFoundationMultisig_1"
+        "OpFoundationUpgradeSafe"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      name:
-        "OptimismFoundationMultisig_2"
+        "OpFoundationOperationsSafe"
    }
```

Generated with discovered.json: 0xf276d73318b359d7629a080c14b833c05ff56860

# Diff at Tue, 05 Nov 2024 15:44:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e6ce51851b57187ccdd52c4944a82e2a8ab1e88 block: 21078732
- current block number: 21122420

## Description

Zora MS one signer added (2/10).

## Watched changes

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      values.$members.9:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.8:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
      values.$members.7:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81"
      values.$members.6:
-        "0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81"
+        "0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7"
      values.$members.5:
-        "0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7"
+        "0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB"
      values.$members.4:
-        "0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB"
+        "0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4"
      values.$members.3:
-        "0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.2:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.1:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.multisigThreshold:
-        "2 of 9 (22%)"
+        "2 of 10 (20%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078732 (main branch discovery), not current.

```diff
    contract OptimismFoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      name:
-        "FoundationMultisig_1"
+        "OptimismFoundationMultisig_1"
    }
```

```diff
    contract OptimismFoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      name:
-        "FoundationMultisig_2"
+        "OptimismFoundationMultisig_2"
    }
```

Generated with discovered.json: 0xf052d4d3276cfe95ec5076b228ad5504f85af869

# Diff at Fri, 01 Nov 2024 12:11:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078732
- current block number: 21078732

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078732 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      directlyReceivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x4f6d8330a55807ba11f8c05abd22893b6a04624c

# Diff at Wed, 30 Oct 2024 13:24:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20970978
- current block number: 21078732

## Description

Zora MS: Signer added.

## Watched changes

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
      values.$members.6:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81"
      values.$members.5:
-        "0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81"
+        "0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7"
      values.$members.4:
-        "0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7"
+        "0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB"
      values.$members.3:
-        "0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB"
+        "0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4"
      values.$members.2:
-        "0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "2 of 8 (25%)"
+        "2 of 9 (22%)"
    }
```

Generated with discovered.json: 0x7004a08b4cb90d632ac23c801787f51b67311caf

# Diff at Tue, 29 Oct 2024 13:21:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20970978
- current block number: 20970978

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20970978 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xde2bf8d4e112d4711db3c568d5bb78d580201993

# Diff at Mon, 21 Oct 2024 12:50:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20970978
- current block number: 20970978

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20970978 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      descriptions:
-        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
      description:
+        "used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"
    }
```

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions:
-        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."]
      description:
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract AddressManager (0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0x97d36bc86844d2012eb4efd808f23cd812b61142

# Diff at Mon, 21 Oct 2024 11:12:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20970978
- current block number: 20970978

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20970978 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.2.2:
+        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
      values.$pastUpgrades.2.1:
-        ["0x2D778797049FE9259d947D1ED8e5442226dFB589"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.0.2:
+        ["0x43260ee547c3965bb2a0174763bb8FEcC650BA4A"]
      values.$pastUpgrades.0.1:
-        ["0x43260ee547c3965bb2a0174763bb8FEcC650BA4A"]
+        "0x2d5cb61e2bcf7b90f813f128dd3ee41d8f0dc78bed2b49c2dcc61e95e7530d03"
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.2.2:
+        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
      values.$pastUpgrades.2.1:
-        ["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.0.2:
+        ["0xDBCdA21518AF39E7feb9748F6718D3db11591461"]
      values.$pastUpgrades.0.1:
-        ["0xDBCdA21518AF39E7feb9748F6718D3db11591461"]
+        "0x2d5cb61e2bcf7b90f813f128dd3ee41d8f0dc78bed2b49c2dcc61e95e7530d03"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.2.2:
+        ["0x53c165169401764778F780a69701385eb0FF19B7"]
      values.$pastUpgrades.2.1:
-        ["0x53c165169401764778F780a69701385eb0FF19B7"]
+        "0xe361c0d4ae3aebc94b3f281ee372fbb1cbdb0c33ca8b1b35e7f3b009b2fcbdb0"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xe361c0d4ae3aebc94b3f281ee372fbb1cbdb0c33ca8b1b35e7f3b009b2fcbdb0"
      values.$pastUpgrades.0.2:
+        ["0x53c165169401764778F780a69701385eb0FF19B7"]
      values.$pastUpgrades.0.1:
-        ["0x53c165169401764778F780a69701385eb0FF19B7"]
+        "0x8ba0e42b89cde22310b644ed30fd44e4a348619a165a54c908e7dc341e9bbd0c"
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.4.2:
+        ["0xF243BEd163251380e78068d317ae10f26042B292"]
      values.$pastUpgrades.4.1:
-        ["0xF243BEd163251380e78068d317ae10f26042B292"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.3.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.3.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.2.2:
+        ["0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44"]
      values.$pastUpgrades.2.1:
-        ["0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44"]
+        "0xc121c2598e03ceb8f6f3e508315202fa1f3ed2b962169c443d0ad6413d9fcde5"
      values.$pastUpgrades.1.2:
+        ["0x8b2131f336CFF06edD7B86aE41b476eef873f7C5"]
      values.$pastUpgrades.1.1:
-        ["0x8b2131f336CFF06edD7B86aE41b476eef873f7C5"]
+        "0xf1fb37ad9d3aab9b6c5ccda93bd4ccbba1eaf52045132df60ee1d4a129e6f575"
      values.$pastUpgrades.0.2:
+        ["0x89336159Edd615260a95309e46343602D6b6489e"]
      values.$pastUpgrades.0.1:
-        ["0x89336159Edd615260a95309e46343602D6b6489e"]
+        "0x2d5cb61e2bcf7b90f813f128dd3ee41d8f0dc78bed2b49c2dcc61e95e7530d03"
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.2.2:
+        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
      values.$pastUpgrades.2.1:
-        ["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.0.2:
+        ["0x17fb7c8Ce213F1A7691ee41EA880ABf6eBC6fa95"]
      values.$pastUpgrades.0.1:
-        ["0x17fb7c8Ce213F1A7691ee41EA880ABf6eBC6fa95"]
+        "0xf20999bd27f1d3effcc4cb9179f163441079744741a78ca04ea40bb505096f68"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.2.2:
+        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
      values.$pastUpgrades.2.1:
-        ["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.1.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.1.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.0.2:
+        ["0x84ee4b9673598ca2FbDad4Ba4a27A58D6328Ec46"]
      values.$pastUpgrades.0.1:
-        ["0x84ee4b9673598ca2FbDad4Ba4a27A58D6328Ec46"]
+        "0x2d5cb61e2bcf7b90f813f128dd3ee41d8f0dc78bed2b49c2dcc61e95e7530d03"
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.3.2:
+        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
      values.$pastUpgrades.3.1:
-        ["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.2.2:
+        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
      values.$pastUpgrades.2.1:
-        ["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]
+        "0xfe942033eec0df235735ae8872759f690e4bee4c86ebb6dba7b9b9446410b5d1"
      values.$pastUpgrades.1.2:
+        ["0x363B4B1ADa52E50353f746999bd9E94395190d2C"]
      values.$pastUpgrades.1.1:
-        ["0x363B4B1ADa52E50353f746999bd9E94395190d2C"]
+        "0x2d5cb61e2bcf7b90f813f128dd3ee41d8f0dc78bed2b49c2dcc61e95e7530d03"
      values.$pastUpgrades.0.2:
+        ["0x0000000000000000000000000000000000000000"]
      values.$pastUpgrades.0.1:
-        ["0x0000000000000000000000000000000000000000"]
+        "0xf20999bd27f1d3effcc4cb9179f163441079744741a78ca04ea40bb505096f68"
    }
```

Generated with discovered.json: 0xccb5cfff8dc36d1d6a1f7428870a0a7a877f9202

# Diff at Fri, 18 Oct 2024 11:35:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8bd58d38d84243da335cc86dc9fccafce6e4a0a9 block: 20970978
- current block number: 20970978

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20970978 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      receivedPermissions:
+        [{"permission":"guard","target":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"}]
    }
```

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}]}
      issuedPermissions.2:
+        {"permission":"guard","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      issuedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.2:
+        {"permission":"guard","target":"0xc2819DC788505Aac350142A7A707BF9D03E3Bd03","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.1.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      issuedPermissions.0.target:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      issuedPermissions.0.via.1:
+        {"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","target":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"}]
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]
    }
```

Generated with discovered.json: 0xcfb93f4117bc05645a5eeafb3a24a1c81a384adb

# Diff at Wed, 16 Oct 2024 11:43:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20970978
- current block number: 20970978

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20970978 (main branch discovery), not current.

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      roles:
-        ["Guardian"]
      directlyReceivedPermissions:
+        [{"permission":"guard","target":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054"},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
    }
```

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      issuedPermissions.0.via.0.address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x48247032092e7b0ecf5dEF611ad89eaf3fC888Dd","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72"
      issuedPermissions.0.via.0:
-        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "0x625726c858dBF78c0125436C943Bf4b4bE9d9033"
      issuedPermissions.1.via.0:
-        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"guard","target":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]},{"permission":"guard","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"}]}]
    }
```

```diff
    contract ZoraMultisig2 (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      roles:
-        ["Challenger"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"}]
    }
```

Generated with discovered.json: 0xedded29113f7fb08eea6114fd9b1dbefdf5fcefb

# Diff at Tue, 15 Oct 2024 12:32:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@33bd64a73f84c81473940dfbc42995becf18b27b block: 20769566
- current block number: 20970978

## Description

Rename Multisig to make it clear that it is not shared.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20769566 (main branch discovery), not current.

```diff
    contract ZoraMultisig2 (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      name:
-        "ChallengerMultisig"
+        "ZoraMultisig2"
    }
```

Generated with discovered.json: 0xf01266da9b95b4251e6769dda9b032b755395ac1

# Diff at Mon, 14 Oct 2024 10:58:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20769566
- current block number: 20769566

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20769566 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
      sourceHashes:
+        ["0x998654cb64c7fc216505bdb3322b20e7d7c95704005228ad1f878bc631c4af8d"]
    }
```

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      sourceHashes:
+        ["0xe771f3d1c51456e08e2c93a904b12010870dc4fa79ee82e4bc90433557931f05"]
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"]
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      sourceHashes:
+        ["0x9624d67fb3738cf1ce1e1f48e2cf433e9373345386943d12f1d751d6b8475cd6"]
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ChallengerMultisig (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xe5211497d15a7ea75577cf992ab6093dd0f6083f45c955f0136737810e44c205"]
    }
```

```diff
    contract AddressManager (0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

Generated with discovered.json: 0x8e75d106a6a0e5e60aee838271302246d23d6404

# Diff at Wed, 09 Oct 2024 13:11:06 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20769566
- current block number: 20769566

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20769566 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      displayName:
+        "AddressManager"
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract AddressManager (0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x04d3905c2c4e04bc2639b24168d629489df9f52b

# Diff at Tue, 01 Oct 2024 11:12:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20769566
- current block number: 20769566

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20769566 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2023-06-13T22:11:23.000Z",["0x43260ee547c3965bb2a0174763bb8FEcC650BA4A"]],["2024-04-19T21:23:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T21:23:23.000Z",["0x2D778797049FE9259d947D1ED8e5442226dFB589"]]]
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2023-06-13T22:11:23.000Z",["0xDBCdA21518AF39E7feb9748F6718D3db11591461"]],["2024-04-19T21:23:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T21:23:23.000Z",["0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"]]]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-01-22T20:19:59.000Z",["0x53c165169401764778F780a69701385eb0FF19B7"]],["2024-06-10T18:29:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-06-10T18:29:23.000Z",["0x53c165169401764778F780a69701385eb0FF19B7"]]]
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-06-13T22:11:23.000Z",["0x89336159Edd615260a95309e46343602D6b6489e"]],["2023-06-14T21:39:23.000Z",["0x8b2131f336CFF06edD7B86aE41b476eef873f7C5"]],["2023-06-15T14:51:59.000Z",["0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44"]],["2024-04-19T21:23:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T21:23:23.000Z",["0xF243BEd163251380e78068d317ae10f26042B292"]]]
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-06-13T22:10:59.000Z",["0x17fb7c8Ce213F1A7691ee41EA880ABf6eBC6fa95"]],["2024-04-19T21:23:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T21:23:23.000Z",["0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2023-06-13T22:11:23.000Z",["0x84ee4b9673598ca2FbDad4Ba4a27A58D6328Ec46"]],["2024-04-19T21:23:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T21:23:23.000Z",["0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-06-13T22:10:59.000Z",["0x0000000000000000000000000000000000000000"]],["2023-06-13T22:11:23.000Z",["0x363B4B1ADa52E50353f746999bd9E94395190d2C"]],["2024-04-19T21:23:23.000Z",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]],["2024-04-19T21:23:23.000Z",["0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"]]]
      values.$upgradeCount:
+        4
    }
```

Generated with discovered.json: 0xf6753efe7e6b9fb8a7d9d0841bb882fea65a691a

# Diff at Tue, 17 Sep 2024 09:55:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a17234c1dfeb209a9842df2b454c07e2b8da435d block: 20475242
- current block number: 20769566

## Description

DeputyGuardianModule upgrade: `setAnchorState()` is now callable by the deputy guardian.

## Watched changes

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.GnosisSafe_modules.0:
-        "0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8"
+        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
    }
```

```diff
-   Status: DELETED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

## Source code changes

```diff
.../DeputyGuardianModule.sol                         | 20 ++++++++++++++++++--
 1 file changed, 18 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0xd1cb531cce5075470e6a00aecb8befebec9b7589

# Diff at Sun, 08 Sep 2024 17:24:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20475242
- current block number: 20475242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475242 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
-        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C"}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions.","It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x9E6204F750cD866b299594e2aC9eA824E2e5f95c","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x3e2Ea9B92B7E48A52296fD261dc26fd995284631","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054","via":[{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"}]}
      receivedPermissions.1.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"
      receivedPermissions.1.via:
+        [{"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"}]
      receivedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.0.via:
+        [{"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04"},{"permission":"act","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"}]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
      descriptions.0:
-        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."
+        "allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe."
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
-        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
-        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.1.via.0:
+        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"},{"permission":"upgrade","target":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054"},{"permission":"upgrade","target":"0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"},{"permission":"upgrade","target":"0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"},{"permission":"upgrade","target":"0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"},{"permission":"upgrade","target":"0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"},{"permission":"upgrade","target":"0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"},{"permission":"upgrade","target":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054"},{"permission":"upgrade","target":"0x3e2Ea9B92B7E48A52296fD261dc26fd995284631","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"},{"permission":"upgrade","target":"0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"},{"permission":"upgrade","target":"0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"},{"permission":"upgrade","target":"0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"}]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","delay":0}
    }
```

```diff
    contract AddressManager (0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      issuedPermissions.0.via.0:
+        {"address":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","delay":0}
    }
```

Generated with discovered.json: 0xa27ee9d60ba1a95bb89c6ef2aafdf84239d4562c

# Diff at Fri, 30 Aug 2024 08:01:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20475242
- current block number: 20475242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475242 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xff79aa3d58d29a26e9d45d51772b0e3f1c7a6529

# Diff at Fri, 23 Aug 2024 09:56:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20475242
- current block number: 20475242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475242 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        5
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x7940d004a788a28d8a644224c6e6eeac0dc25276

# Diff at Wed, 21 Aug 2024 10:07:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20475242
- current block number: 20475242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475242 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"],"configure":["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F","via":[]},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x543bA4AADBAb8f9025686Bd03993043599c6fB04","0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]},{"permission":"configure","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","via":[]}]
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xC72aE5c7cc9a332699305E29F68Be66c73b60542","via":[]},{"permission":"upgrade","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","via":[]}]
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x1a0ad011913A150f69f6A19DF447A0CfD9551054","0x3e2Ea9B92B7E48A52296fD261dc26fd995284631","0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3","0x9E6204F750cD866b299594e2aC9eA824E2e5f95c","0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86","0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"],"configure":["0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef","via":[]},{"permission":"upgrade","target":"0x1a0ad011913A150f69f6A19DF447A0CfD9551054","via":[]},{"permission":"upgrade","target":"0x3e2Ea9B92B7E48A52296fD261dc26fd995284631","via":[]},{"permission":"upgrade","target":"0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3","via":[]},{"permission":"upgrade","target":"0x9E6204F750cD866b299594e2aC9eA824E2e5f95c","via":[]},{"permission":"upgrade","target":"0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86","via":[]},{"permission":"upgrade","target":"0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf","via":[]}]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract AddressManager (0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","via":[]}]
    }
```

Generated with discovered.json: 0xd86465242889025d7274a709265015eed7174e56

# Diff at Fri, 09 Aug 2024 12:03:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20475242
- current block number: 20475242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475242 (main branch discovery), not current.

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions.configure.1:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
      assignedPermissions.configure.0:
-        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.5:
-        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
+        "0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"
      assignedPermissions.upgrade.4:
-        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
+        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
      assignedPermissions.upgrade.3:
-        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
+        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      assignedPermissions.upgrade.2:
-        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
+        "0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"
      assignedPermissions.upgrade.1:
-        "0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"
+        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
      assignedPermissions.upgrade.0:
-        "0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
    }
```

Generated with discovered.json: 0x51676bb309ad42f57bfb173a1a7b448c2a661e88

# Diff at Fri, 09 Aug 2024 10:13:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20475242
- current block number: 20475242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475242 (main branch discovery), not current.

```diff
    contract SuperchainGuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.owner:
-        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
      assignedPermissions.upgrade:
+        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.configure:
+        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x543bA4AADBAb8f9025686Bd03993043599c6fB04","0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"]
      assignedPermissions.configure:
+        ["0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$multisigThreshold:
-        "10 of 13 (77%)"
      values.getOwners:
-        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.getThreshold:
-        10
      values.$members:
+        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.$threshold:
+        10
      values.multisigThreshold:
+        "10 of 13 (77%)"
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"]
      assignedPermissions.configure:
+        ["0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"]
      values.$multisigThreshold:
-        "2 of 8 (25%)"
      values.getOwners:
-        ["0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4","0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB","0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7","0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81","0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4","0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB","0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7","0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81","0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 8 (25%)"
    }
```

```diff
    contract ChallengerMultisig (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4","0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB","0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7","0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81","0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4","0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB","0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7","0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81","0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x1a0ad011913A150f69f6A19DF447A0CfD9551054","0x3e2Ea9B92B7E48A52296fD261dc26fd995284631","0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3","0x9E6204F750cD866b299594e2aC9eA824E2e5f95c","0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86","0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"]
      assignedPermissions.owner:
-        ["0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"]
      assignedPermissions.upgrade:
+        ["0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf","0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3","0x3e2Ea9B92B7E48A52296fD261dc26fd995284631","0x1a0ad011913A150f69f6A19DF447A0CfD9551054","0x9E6204F750cD866b299594e2aC9eA824E2e5f95c","0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"]
      assignedPermissions.configure:
+        ["0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef"]
    }
```

Generated with discovered.json: 0xe38ddab206923793122e00dfb1e565c5493a45cf

# Diff at Wed, 07 Aug 2024 07:36:56 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@47685977ba2390a8eafac8e0d4cac7c81dff5758 block: 20276973
- current block number: 20475242

## Description

The ProxyAdmin owner is changed to SuperchainProxyAdminOwner and Conduit Multisig is removed.

## Watched changes

```diff
-   Status: DELETED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions.
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      descriptions.1:
+        "It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."
      descriptions.0:
-        "It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."
+        "It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions."
      assignedPermissions.owner.1:
+        "0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49"
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

## Source code changes

```diff
.../ConduitMultisig/GnosisSafe.sol => /dev/null    | 952 ---------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |  34 -
 2 files changed, 986 deletions(-)
```

Generated with discovered.json: 0xf1f52a12f38d5ac8c3d6e74425b76a514f598ece

# Diff at Tue, 30 Jul 2024 11:16:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20276973
- current block number: 20276973

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20276973 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x6a08ee988cc87ab03ea7d4e25e8b0a2c0cff4238

# Diff at Thu, 18 Jul 2024 10:34:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20276973
- current block number: 20276973

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20276973 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: None
      values.livenessInterval:
-        8467200
+        "98d"
      template:
+        "gnosisSafeModules/LivenessModule"
      descriptions:
+        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
    }
```

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      name:
-        "GuardianMultisig"
+        "SuperchainGuardianMultisig"
    }
```

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: None
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
+        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: None
      descriptions.0:
-        "The main entry point to deposit ERC20 tokens from L1 to L2. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49, inheriting its permissions."]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: None
      template:
+        "gnosisSafeModules/DeputyGuardianModule"
      descriptions:
+        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."]
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: None
      descriptions.0:
-        "Used to bridge ERC-721 tokens from L1 to L2"
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
+        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
+        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: None
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: None
      descriptions.0:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as the L2 representation of an L1 token, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      descriptions:
+        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: None
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

Generated with discovered.json: 0xfd92703a468b61bbf9b834d1c4bd44ab2fc1c1f9

# Diff at Fri, 28 Jun 2024 07:32:22 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@555efdd96fadc389c2c70beacf820125fbb25a7d block: 20073649
- current block number: 20188709

## Description

Nonce of foundation multisig increased, after executing transaction to change the owner of the SystemConfig contract.

## Watched changes

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.nonce:
-        92
+        93
    }
```

Generated with discovered.json: 0x1565e8344e9f1419d5529f2605d544bb8288f451

# Diff at Wed, 12 Jun 2024 05:26:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@09246cd19afe46cf207c325923fef8f51d581735 block: 20032759
- current block number: 20073649

## Description

Changes due to Superchain permissions upgrade: 
- Security Council MS threshold raised
- Liveness and DeputyGuardian modules added
- Guardian (proxy)MS added

## Watched changes

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.GUARDIAN:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      upgradeability.modules.0:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      upgradeability.threshold:
-        "4 of 13 (31%)"
+        "10 of 13 (77%)"
      values.getThreshold:
-        4
+        10
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: None
```

## Source code changes

```diff
.../zora/ethereum/.flat/DeputyGuardianModule.sol   | 139 +++
 .../ethereum/.flat/GuardianMultisig/GnosisSafe.sol | 952 +++++++++++++++++++++
 .../.flat/GuardianMultisig/GnosisSafeProxy.p.sol   |  34 +
 .../zora/ethereum/.flat/LivenessGuard.sol          | 581 +++++++++++++
 .../zora/ethereum/.flat/LivenessModule.sol         | 257 ++++++
 5 files changed, 1963 insertions(+)
```

Generated with discovered.json: 0x209e13e4a7a74a8fd077a54e66bb0c08c528e44b

# Diff at Thu, 06 Jun 2024 12:23:14 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@5302ef2899ddfb7175df497ceaa47fba4e383655 block: 19982489
- current block number: 20032759

## Description

Discovery output now includes names of templates used for contract analysis.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19982489 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: None
      template:
+        "opstack/OptimismPortal"
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: None
      template:
+        "opstack/SuperchainConfig"
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: None
      template:
+        "opstack/L2OutputOracle"
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: None
      template:
+        "opstack/SystemConfig"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract ChallengerMultisig (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: None
      template:
+        "opstack/L1CrossDomainMessenger"
    }
```

Generated with discovered.json: 0x971b070707f5c7c01728fdc8f02fb4e6903fec67

# Diff at Wed, 22 May 2024 20:13:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918824
- current block number: 19927731

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x955a49539e1f6baa91668db00391e64a1514bd69

# Diff at Tue, 21 May 2024 14:17:58 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19899230
- current block number: 19918824

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19899230 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ProxyAdminOwner"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0xcc1f9152d1491cb00098c97abc3752bdd4157874

# Diff at Mon, 22 Apr 2024 14:42:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d4b694a74243557c5ded556721185672f6639b7c block: 19532317
- current block number: 19711603

## Description

The project now uses shared implementations with other projects in the Superchain and a shared Guardian (OP Foundation).

## Watched changes

```diff
    contract OptimismPortal (0x1a0ad011913A150f69f6A19DF447A0CfD9551054) {
    +++ description: None
      upgradeability.implementation:
-        "0x43260ee547c3965bb2a0174763bb8FEcC650BA4A"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      implementations.0:
-        "0x43260ee547c3965bb2a0174763bb8FEcC650BA4A"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.GUARDIAN:
-        "0xC72aE5c7cc9a332699305E29F68Be66c73b60542"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.version:
-        "1.6.0"
+        "2.5.0"
      values.guardian:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.l2Oracle:
+        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
+        "0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86"
    }
```

```diff
    contract L1StandardBridge (0x3e2Ea9B92B7E48A52296fD261dc26fd995284631) {
    +++ description: None
      upgradeability.implementation:
-        "0xbF6acaF315477b15D638bf4d91eA48FA79b58335"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      implementations.0:
-        "0xbF6acaF315477b15D638bf4d91eA48FA79b58335"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.version:
-        "1.1.0"
+        "2.1.0"
      values.otherBridge:
+        "0x4200000000000000000000000000000000000010"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract L1ERC721Bridge (0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3) {
    +++ description: None
      upgradeability.implementation:
-        "0xDBCdA21518AF39E7feb9748F6718D3db11591461"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      implementations.0:
-        "0xDBCdA21518AF39E7feb9748F6718D3db11591461"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.version:
-        "1.1.1"
+        "2.1.0"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
    +++ description: None
      upgradeability.implementation:
-        "0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      implementations.0:
-        "0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      values.version:
-        "1.3.0"
+        "1.8.0"
      values.challenger:
+        "0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
      values.proposer:
+        "0x48247032092e7b0ecf5dEF611ad89eaf3fC888Dd"
      values.submissionInterval:
+        1800
    }
```

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: None
      upgradeability.implementation:
-        "0x17fb7c8Ce213F1A7691ee41EA880ABf6eBC6fa95"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      implementations.0:
-        "0x17fb7c8Ce213F1A7691ee41EA880ABf6eBC6fa95"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      values.version:
-        "1.3.0"
+        "1.12.0"
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf"
      values.L1_CROSS_DOMAIN_MESSENGER_SLOT:
+        "0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636"
      values.L1_ERC_721_BRIDGE_SLOT:
+        "0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7"
      values.L1_STANDARD_BRIDGE_SLOT:
+        "0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376"
      values.l1CrossDomainMessenger:
+        "0xdC40a14d9abd6F410226f1E6de71aE03441ca506"
      values.l1ERC721Bridge:
+        "0x83A4521A3573Ca87f3a971B169C5A0E1d34481c3"
      values.l1StandardBridge:
+        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
      values.L2_OUTPUT_ORACLE_SLOT:
+        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
+        "0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf"
      values.optimismPortal:
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        17473957
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf) {
    +++ description: None
      upgradeability.implementation:
-        "0x84ee4b9673598ca2FbDad4Ba4a27A58D6328Ec46"
+        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      implementations.0:
-        "0x84ee4b9673598ca2FbDad4Ba4a27A58D6328Ec46"
+        "0xE01efbeb1089D1d1dB9c6c8b135C934C0734c846"
      values.version:
-        "1.1.0"
+        "1.9.0"
      values.bridge:
+        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
    }
```

```diff
    contract ProxyAdmin (0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49) {
    +++ description: None
      values.owner:
-        "0xC72aE5c7cc9a332699305E29F68Be66c73b60542"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract L1CrossDomainMessenger (0xdC40a14d9abd6F410226f1E6de71aE03441ca506) {
    +++ description: None
      upgradeability.implementation:
-        "0x363B4B1ADa52E50353f746999bd9E94395190d2C"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      implementations.0:
-        "0x363B4B1ADa52E50353f746999bd9E94395190d2C"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.version:
-        "1.4.0"
+        "2.3.0"
      values.otherMessenger:
+        "0x4200000000000000000000000000000000000007"
      values.paused:
+        false
      values.portal:
+        "0x1a0ad011913A150f69f6A19DF447A0CfD9551054"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../FoundationMultisig_1/implementation/meta.txt   |    2 +
 .../FoundationMultisig_1/proxy/GnosisSafeProxy.sol |  155 +++
 .../.code/FoundationMultisig_1/proxy/meta.txt      |    2 +
 .../implementation/GnosisSafe.sol                  | 1076 ++++++++++++++++++++
 .../FoundationMultisig_2/implementation/meta.txt   |    2 +
 .../.code/FoundationMultisig_2/proxy/Proxy.sol     |   41 +
 .../.code/FoundationMultisig_2/proxy/meta.txt      |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/GnosisSafe/implementation/meta.txt       |    2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     |  155 +++
 .../zora/ethereum/.code/GnosisSafe/proxy/meta.txt  |    2 +
 .../L1/L1CrossDomainMessenger.sol => /dev/null     |   67 --
 .../contracts/L1/L2OutputOracle.sol => /dev/null   |  350 -------
 .../contracts/L1/OptimismPortal.sol => /dev/null   |  507 ---------
 .../contracts/L1/SystemConfig.sol => /dev/null     |  297 ------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Bytes.sol => /dev/null     |  142 ---
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../libraries/Predeploys.sol => /dev/null          |  112 --
 .../contracts/libraries/SafeCall.sol => /dev/null  |  160 ---
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../trie/SecureMerkleTrie.sol => /dev/null         |   64 --
 .../CrossDomainMessenger.sol => /dev/null          |  519 ----------
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/access/OwnableUpgradeable.sol       |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../contracts}/utils/ContextUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1CrossDomainMessenger/implementation/meta.txt |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../src/L1/L1CrossDomainMessenger.sol              |   74 ++
 .../implementation/src/L1/L2OutputOracle.sol       |  317 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  433 ++++++++
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../src}/libraries/rlp/RLPReader.sol               |  249 ++---
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src}/libraries/trie/MerkleTrie.sol             |  210 ++--
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src}/vendor/AddressAliasHelper.sol             |    0
 .../contracts/L1/L1ERC721Bridge.sol => /dev/null   |  107 --
 .../contracts/L2/L2ERC721Bridge.sol => /dev/null   |  126 ---
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../contracts/libraries/SafeCall.sol => /dev/null  |  104 --
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../CrossDomainMessenger.sol => /dev/null          |  483 ---------
 .../universal/ERC721Bridge.sol => /dev/null        |  214 ----
 .../IOptimismMintableERC721.sol => /dev/null       |   76 --
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |    0
 .../contracts/token/ERC20/IERC20.sol               |    0
 .../token/ERC20/extensions/IERC20Metadata.sol      |    0
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |    0
 .../contracts/token/ERC20/utils/SafeERC20.sol      |    0
 .../contracts/token/ERC721/IERC721.sol             |    0
 .../token/ERC721/extensions/IERC721Enumerable.sol  |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |    0
 .../utils/introspection/ERC165Checker.sol          |    0
 .../contracts/utils/introspection/IERC165.sol      |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1ERC721Bridge/implementation/meta.txt         |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L1ERC721Bridge.sol       |  121 +++
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L2/L2ERC721Bridge.sol       |  126 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../implementation/src/universal/ERC721Bridge.sol  |  195 ++++
 .../src}/universal/IOptimismMintableERC20.sol      |   21 +-
 .../src/universal/IOptimismMintableERC721.sol      |   48 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/StandardBridge.sol               |  489 +++++++++
 .../contracts/L1/L1StandardBridge.sol => /dev/null |  364 -------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../libraries/Predeploys.sol => /dev/null          |  112 --
 .../contracts/libraries/SafeCall.sol => /dev/null  |  104 --
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../CrossDomainMessenger.sol => /dev/null          |  483 ---------
 .../OptimismMintableERC20.sol => /dev/null         |  149 ---
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../universal/StandardBridge.sol => /dev/null      |  561 ----------
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |    0
 .../contracts/token/ERC20/IERC20.sol               |    0
 .../token/ERC20/extensions/IERC20Metadata.sol      |    0
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 +++
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |    0
 .../utils/introspection/ERC165Checker.sol          |    0
 .../contracts/utils/introspection/IERC165.sol      |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1StandardBridge/implementation/meta.txt       |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L1StandardBridge.sol     |  321 ++++++
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../src}/universal/IOptimismMintableERC20.sol      |   21 +-
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/StandardBridge.sol               |  489 +++++++++
 .../contracts/L1/L2OutputOracle.sol => /dev/null   |  350 -------
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L2OutputOracle/implementation/meta.txt         |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L2OutputOracle.sol       |  317 ++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   68 ++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../libraries/resolver/Lib_AddressManager.sol      |   95 ++
 .../ethereum/.code/Lib_AddressManager/meta.txt     |    2 +
 .../OptimismMintableERC20.sol => /dev/null         |  149 ---
 .../OptimismMintableERC20Factory.sol => /dev/null  |  110 --
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/introspection/IERC165.sol      |    0
 .../implementation/meta.txt                        |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/OptimismMintableERC20Factory.sol |  132 +++
 .../contracts/L1/L2OutputOracle.sol => /dev/null   |  350 -------
 .../contracts/L1/OptimismPortal.sol => /dev/null   |  507 ---------
 .../contracts/L1/SystemConfig.sol => /dev/null     |  297 ------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Bytes.sol => /dev/null     |  142 ---
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../contracts/libraries/SafeCall.sol => /dev/null  |  160 ---
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../trie/SecureMerkleTrie.sol => /dev/null         |   64 --
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/access/OwnableUpgradeable.sol       |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../contracts}/utils/ContextUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../OptimismPortal/implementation/meta.txt         |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L2OutputOracle.sol       |  317 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  433 ++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../src}/libraries/rlp/RLPReader.sol               |  249 ++---
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src}/libraries/trie/MerkleTrie.sol             |  210 ++--
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src}/vendor/AddressAliasHelper.sol             |    0
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/ProxyAdminOwner/implementation/meta.txt  |    2 +
 .../ProxyAdminOwner/proxy/GnosisSafeProxy.sol      |  155 +++
 .../ethereum/.code/ProxyAdminOwner/proxy/meta.txt  |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../implementation/meta.txt                        |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 +++
 .../.code/SecurityCouncilMultisig/proxy/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../.code/SuperchainConfig/implementation/meta.txt |    2 +
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/SuperchainConfig/proxy/meta.txt |    2 +
 .../proxy/src}/L1/ResourceMetering.sol             |  116 +--
 .../proxy/src/libraries/Arithmetic.sol             |   28 +
 .../SuperchainConfig/proxy/src/libraries/Burn.sol  |   32 +
 .../proxy/src/libraries/Constants.sol              |   46 +
 .../SuperchainConfig/proxy/src/universal/Proxy.sol |  168 +++
 .../contracts/legacy/AddressManager.sol            |   64 ++
 .../contracts/legacy/L1ChugSplashProxy.sol         |  289 ++++++
 .../contracts/universal/Proxy.sol                  |  217 ++++
 .../contracts/universal/ProxyAdmin.sol             |  254 +++++
 .../ethereum/.code/SuperchainProxyAdmin/meta.txt   |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../implementation/meta.txt                        |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 +++
 .../.code/SuperchainProxyAdminOwner/proxy/meta.txt |    2 +
 .../contracts/L1/ResourceMetering.sol => /dev/null |  186 ----
 .../contracts/L1/SystemConfig.sol => /dev/null     |  297 ------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts}/access/OwnableUpgradeable.sol       |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../contracts}/utils/ContextUpgradeable.sol        |    0
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../SystemConfig/implementation/meta.txt           |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 377 files changed, 24544 insertions(+), 12878 deletions(-)
```

Generated with discovered.json: 0x8e8b7c912999391cfb5eb4ae8f11c842508f419d

# Diff at Thu, 28 Mar 2024 11:29:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19439848
- current block number: 19532317

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19439848 (main branch discovery), not current.

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 8 (25%)"
    }
```

```diff
    contract ChallengerMultisig (0xcA4571b1ecBeC86Ea2E660d242c1c29FcB55Dc72) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x9b35815efb3ceb3b2c2040c529bff139eb5b685a

# Diff at Thu, 14 Mar 2024 07:34:32 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@c79c75cb88d41e2f05e9cca5d501133eae405bbe block: 19412025
- current block number: 19431793

## Description

Blobs are switched on

## Watched changes

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279133793016986207220"
    }
```

```diff
    contract ZoraMultisig (0xC72aE5c7cc9a332699305E29F68Be66c73b60542) {
    +++ description: None
      values.getOwners[7]:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners[6]:
+        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
      values.getOwners.5:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81"
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7"
      values.getOwners.3:
-        "0xD05e9Ab3B6A7F10ec1374bc352854ABA51643E81"
+        "0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB"
      values.getOwners.2:
-        "0xc08C1b8fD69A22a448fC014bEe4A700d70726dA7"
+        "0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4"
      values.getOwners.1:
-        "0xe7d71aea6FB8248d4fD4D5d5098D201674B531dB"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0xf2989961Bf987bdD6c86CD6B845B6fACa194a8e4"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getThreshold:
-        4
+        2
    }
```

Generated with discovered.json: 0x44525c357a439c8e58fd7a9bc37a7dc22f0893d1

# Diff at Mon, 11 Mar 2024 13:04:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176790
- current block number: 19412025

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176790 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x62696348b2db46516d37506a92f9f7c43734aaf1

# Diff at Wed, 07 Feb 2024 14:04:48 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175194
- current block number: 19176790

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175194 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
      values.sequencerInbox:
+        "0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf"
    }
```

Generated with discovered.json: 0x258544e0ba1c6ca2c1c39595f9249531601ae6bf

# Diff at Wed, 07 Feb 2024 08:42:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090324
- current block number: 19175194

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090324 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

Generated with discovered.json: 0x3fa7567e1997dc0a9d4c893f92a793efbed0dd70

# Diff at Fri, 26 Jan 2024 10:57:02 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 18218892
- current block number: 19090324

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18218892 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA3cAB0126d5F504B071b81a3e8A2BBBF17930d86) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":false,"isSomeTxsLengthEqualToCelestiaDAExample":false}
    }
```

Generated with discovered.json: 0xc4da1c7eb9cf28e329c3fe57238e3bb84a640431

# Diff at Tue, 26 Sep 2023 08:54:55 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x9E6204F750cD866b299594e2aC9eA824E2e5f95c) {
      values.deletedOutputs:
+        []
    }
```
