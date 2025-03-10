Generated with discovered.json: 0x0d96994560bd2571d0b223565076ce21364cd477

# Diff at Tue, 04 Mar 2025 11:25:26 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21715439
- current block number: 21715439

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715439 (main branch discovery), not current.

```diff
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xd7d440114f27b754de7b358088c61f16edaf4111

# Diff at Tue, 04 Mar 2025 10:38:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21715439
- current block number: 21715439

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715439 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00bd00c5C7F60e222D9CB8040270Ba929241A280) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20323396
    }
```

```diff
    contract AutomataUpgradeMultisig (0x03eC1C43434E2f910A2fb984906cd2470fdb39c8) {
    +++ description: None
      sinceBlock:
+        20323376
    }
```

```diff
    contract DataAvailabilityChallenge (0x08c5DCDD5e46d31CC1591ee15b084663507597f3) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      sinceBlock:
+        20323388
    }
```

```diff
    contract AutomataOpsMultisig (0x5E2FC552288857cfE709C398Ecac448314dE1320) {
    +++ description: None
      sinceBlock:
+        21709637
    }
```

```diff
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20323392
    }
```

```diff
    contract ProxyAdmin (0x7617f4a55d62b9EE49578D9C90593e58E607415F) {
    +++ description: None
      sinceBlock:
+        20323379
    }
```

```diff
    contract L1CrossDomainMessenger (0x825C858149F1E775a0f4Aeb172037B970bE7B736) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20323394
    }
```

```diff
    contract OptimismMintableERC20Factory (0xa74b7baF04867E62B7824268e96144E503A23666) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20323395
    }
```

```diff
    contract OptimismPortal (0xD52ba64CBE1e3B44167f810622fBef36bE24d95c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20323391
    }
```

```diff
    contract L2OutputOracle (0xdbf381984c4515Fe3285D3C55fDfb3054C52c261) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20323398
    }
```

```diff
    contract SuperchainConfig (0xDf87154Ed6cF332931b70014bA3d9dF423074FfF) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        20323382
    }
```

```diff
    contract L1StandardBridge (0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20323393
    }
```

```diff
    contract AddressManager (0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20323377
    }
```

Generated with discovered.json: 0x2af773e8e7f4c6a5cb006f2c20c3263d27300dad

# Diff at Wed, 26 Feb 2025 10:32:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21715439
- current block number: 21715439

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715439 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00bd00c5C7F60e222D9CB8040270Ba929241A280) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract DataAvailabilityChallenge (0x08c5DCDD5e46d31CC1591ee15b084663507597f3) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x825C858149F1E775a0f4Aeb172037B970bE7B736) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0xD52ba64CBE1e3B44167f810622fBef36bE24d95c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xdbf381984c4515Fe3285D3C55fDfb3054C52c261) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xDf87154Ed6cF332931b70014bA3d9dF423074FfF) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1StandardBridge (0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x2bf90bb52825a68624e172f1f493556925b02606

# Diff at Fri, 21 Feb 2025 14:05:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21715439
- current block number: 21715439

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715439 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xdbf381984c4515Fe3285D3C55fDfb3054C52c261) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x1214977a5b12d39fc3898882d7e1526bc86aaa6d

# Diff at Fri, 21 Feb 2025 08:59:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21715439
- current block number: 21715439

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715439 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x825C858149F1E775a0f4Aeb172037B970bE7B736) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract SuperchainConfig (0xDf87154Ed6cF332931b70014bA3d9dF423074FfF) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1StandardBridge (0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x5cca80d24a430f13676117104569f56f2db8e6f4

# Diff at Mon, 10 Feb 2025 19:03:41 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21715439
- current block number: 21715439

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715439 (main branch discovery), not current.

```diff
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x99e06c43a4fe31a0dce4806b6f97767f90a6053d

# Diff at Tue, 04 Feb 2025 12:30:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21715439
- current block number: 21715439

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21715439 (main branch discovery), not current.

```diff
    contract AutomataUpgradeMultisig (0x03eC1C43434E2f910A2fb984906cd2470fdb39c8) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract DataAvailabilityChallenge (0x08c5DCDD5e46d31CC1591ee15b084663507597f3) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AutomataOpsMultisig (0x5E2FC552288857cfE709C398Ecac448314dE1320) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x7617f4a55d62b9EE49578D9C90593e58E607415F) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xb906696e8af033abaa34cee8305694ad7cf14f01

# Diff at Mon, 27 Jan 2025 11:06:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 21265411
- current block number: 21715439

## Description

Automata adds an EOA as SystemConfig owner.

## Watched changes

```diff
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.via.0:
+        {"address":"0x5E2FC552288857cfE709C398Ecac448314dE1320"}
      values.owner:
-        "0x49eC5Bd8C9cC35Ce26b87E534d2E36980621dDD2"
+        "0x5E2FC552288857cfE709C398Ecac448314dE1320"
    }
```

```diff
+   Status: CREATED
    contract AutomataOpsMultisig (0x5E2FC552288857cfE709C398Ecac448314dE1320)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/AutomataOpsMultisig/Safe.sol    | 1088 ++++++++++++++++++++
 .../.flat/AutomataOpsMultisig/SafeProxy.p.sol      |   37 +
 2 files changed, 1125 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21265411 (main branch discovery), not current.

```diff
    contract AutomataUpgradeMultisig (0x03eC1C43434E2f910A2fb984906cd2470fdb39c8) {
    +++ description: None
      name:
-        "AutomataMultisig"
+        "AutomataUpgradeMultisig"
    }
```

Generated with discovered.json: 0x40446be24fe195940d4df25c7158c6d34d980dc9

# Diff at Mon, 20 Jan 2025 11:09:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21265411
- current block number: 21265411

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21265411 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x00bd00c5C7F60e222D9CB8040270Ba929241A280) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
    }
```

```diff
    contract AutomataMultisig (0x03eC1C43434E2f910A2fb984906cd2470fdb39c8) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5"
      receivedPermissions.8.from:
+        "0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5"
      receivedPermissions.7.target:
-        "0xDf87154Ed6cF332931b70014bA3d9dF423074FfF"
      receivedPermissions.7.from:
+        "0xDf87154Ed6cF332931b70014bA3d9dF423074FfF"
      receivedPermissions.6.target:
-        "0xdbf381984c4515Fe3285D3C55fDfb3054C52c261"
      receivedPermissions.6.from:
+        "0xdbf381984c4515Fe3285D3C55fDfb3054C52c261"
      receivedPermissions.5.target:
-        "0xD52ba64CBE1e3B44167f810622fBef36bE24d95c"
      receivedPermissions.5.from:
+        "0xD52ba64CBE1e3B44167f810622fBef36bE24d95c"
      receivedPermissions.4.target:
-        "0xa74b7baF04867E62B7824268e96144E503A23666"
      receivedPermissions.4.from:
+        "0xa74b7baF04867E62B7824268e96144E503A23666"
      receivedPermissions.3.target:
-        "0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00"
      receivedPermissions.3.from:
+        "0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00"
      receivedPermissions.2.target:
-        "0x08c5DCDD5e46d31CC1591ee15b084663507597f3"
      receivedPermissions.2.from:
+        "0x08c5DCDD5e46d31CC1591ee15b084663507597f3"
      receivedPermissions.1.target:
-        "0x00bd00c5C7F60e222D9CB8040270Ba929241A280"
      receivedPermissions.1.from:
+        "0x00bd00c5C7F60e222D9CB8040270Ba929241A280"
      receivedPermissions.0.target:
-        "0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6"
      receivedPermissions.0.from:
+        "0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6"
      directlyReceivedPermissions.0.target:
-        "0x7617f4a55d62b9EE49578D9C90593e58E607415F"
      directlyReceivedPermissions.0.from:
+        "0x7617f4a55d62b9EE49578D9C90593e58E607415F"
    }
```

```diff
    contract DataAvailabilityChallenge (0x08c5DCDD5e46d31CC1591ee15b084663507597f3) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.target:
-        "0x49eC5Bd8C9cC35Ce26b87E534d2E36980621dDD2"
      issuedPermissions.0.to:
+        "0x49eC5Bd8C9cC35Ce26b87E534d2E36980621dDD2"
      issuedPermissions.0.description:
+        "can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure."
    }
```

```diff
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.1.target:
-        "0x5BEF09f138921eF7985d83AAB97da1dB6E4dd190"
      issuedPermissions.1.to:
+        "0x5BEF09f138921eF7985d83AAB97da1dB6E4dd190"
      issuedPermissions.0.target:
-        "0x49eC5Bd8C9cC35Ce26b87E534d2E36980621dDD2"
      issuedPermissions.0.to:
+        "0x49eC5Bd8C9cC35Ce26b87E534d2E36980621dDD2"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0x7617f4a55d62b9EE49578D9C90593e58E607415F) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5"
      directlyReceivedPermissions.8.from:
+        "0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5"
      directlyReceivedPermissions.7.target:
-        "0xDf87154Ed6cF332931b70014bA3d9dF423074FfF"
      directlyReceivedPermissions.7.from:
+        "0xDf87154Ed6cF332931b70014bA3d9dF423074FfF"
      directlyReceivedPermissions.6.target:
-        "0xdbf381984c4515Fe3285D3C55fDfb3054C52c261"
      directlyReceivedPermissions.6.from:
+        "0xdbf381984c4515Fe3285D3C55fDfb3054C52c261"
      directlyReceivedPermissions.5.target:
-        "0xD52ba64CBE1e3B44167f810622fBef36bE24d95c"
      directlyReceivedPermissions.5.from:
+        "0xD52ba64CBE1e3B44167f810622fBef36bE24d95c"
      directlyReceivedPermissions.4.target:
-        "0xa74b7baF04867E62B7824268e96144E503A23666"
      directlyReceivedPermissions.4.from:
+        "0xa74b7baF04867E62B7824268e96144E503A23666"
      directlyReceivedPermissions.3.target:
-        "0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00"
      directlyReceivedPermissions.3.from:
+        "0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00"
      directlyReceivedPermissions.2.target:
-        "0x08c5DCDD5e46d31CC1591ee15b084663507597f3"
      directlyReceivedPermissions.2.from:
+        "0x08c5DCDD5e46d31CC1591ee15b084663507597f3"
      directlyReceivedPermissions.1.target:
-        "0x00bd00c5C7F60e222D9CB8040270Ba929241A280"
      directlyReceivedPermissions.1.from:
+        "0x00bd00c5C7F60e222D9CB8040270Ba929241A280"
      directlyReceivedPermissions.0.target:
-        "0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6"
      directlyReceivedPermissions.0.from:
+        "0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xa74b7baF04867E62B7824268e96144E503A23666) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
    }
```

```diff
    contract OptimismPortal (0xD52ba64CBE1e3B44167f810622fBef36bE24d95c) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.target:
-        "0xa5822fb7E3Fb516E518e2629E6786e93858e41F4"
      issuedPermissions.0.to:
+        "0xa5822fb7E3Fb516E518e2629E6786e93858e41F4"
    }
```

```diff
    contract L2OutputOracle (0xdbf381984c4515Fe3285D3C55fDfb3054C52c261) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.1.target:
-        "0x8c6F6580C846634C5DA08c40AE308DE23006a679"
      issuedPermissions.1.to:
+        "0x8c6F6580C846634C5DA08c40AE308DE23006a679"
      issuedPermissions.0.target:
-        "0x34Faa77b4D1686E399c96deF0de31D30572eaa9F"
      issuedPermissions.0.to:
+        "0x34Faa77b4D1686E399c96deF0de31D30572eaa9F"
    }
```

```diff
    contract SuperchainConfig (0xDf87154Ed6cF332931b70014bA3d9dF423074FfF) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.target:
-        "0xa5822fb7E3Fb516E518e2629E6786e93858e41F4"
      issuedPermissions.0.to:
+        "0xa5822fb7E3Fb516E518e2629E6786e93858e41F4"
    }
```

```diff
    contract L1StandardBridge (0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract AddressManager (0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x03eC1C43434E2f910A2fb984906cd2470fdb39c8"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x2ba4b0a64c6945eb82f5b38d0daaf7f2f162ff3f

# Diff at Wed, 08 Jan 2025 08:58:30 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21265411
- current block number: 21265411

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21265411 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x50304b726686499b9eb9cbf73708268f5d6658b8

# Diff at Mon, 25 Nov 2024 14:36:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21265411

## Description

Standard opstack L2 in alt-DA mode with unused DAChallenge contract (and unreferenced DisputeGame but instead L2OutputOracle).

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x00bd00c5C7F60e222D9CB8040270Ba929241A280)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AutomataMultisig (0x03eC1C43434E2f910A2fb984906cd2470fdb39c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x08c5DCDD5e46d31CC1591ee15b084663507597f3)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x72934D7AEDC1A2d889ca89Aaf064CD9455E64d00)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7617f4a55d62b9EE49578D9C90593e58E607415F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x825C858149F1E775a0f4Aeb172037B970bE7B736)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xa74b7baF04867E62B7824268e96144E503A23666)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xD52ba64CBE1e3B44167f810622fBef36bE24d95c)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdbf381984c4515Fe3285D3C55fDfb3054C52c261)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xDf87154Ed6cF332931b70014bA3d9dF423074FfF)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xE639919b92AB6DD238aEACc6F2A8d6e355D17bd5)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract AddressManager (0xF1C911e0c1E6dd08c8a7C80c9890e2037e0504c6)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```
