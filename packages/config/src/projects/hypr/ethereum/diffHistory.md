Generated with discovered.json: 0x7188b6cb348459b053536431f8985fa6541ec0f4

# Diff at Tue, 04 Mar 2025 11:25:50 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637077
- current block number: 21637077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x898ceacf14c342b43726acfadc67c2bbd1475a79

# Diff at Tue, 04 Mar 2025 10:39:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637077
- current block number: 21637077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19028080
    }
```

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      sinceBlock:
+        19028080
    }
```

```diff
    contract HyprMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      sinceBlock:
+        19028004
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19028080
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19028080
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19028080
    }
```

```diff
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19028080
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19028080
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19028080
    }
```

```diff
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19028080
    }
```

Generated with discovered.json: 0x069179489743c882aa26319c791258bc0d4028d1

# Diff at Wed, 26 Feb 2025 10:32:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637077
- current block number: 21637077

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x9d43b8135c5815f7826e4b58f54ba49f2c595507

# Diff at Fri, 21 Feb 2025 14:07:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637077
- current block number: 21637077

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x24f483e5c8b363490423a7feab77da66c931cc10

# Diff at Fri, 21 Feb 2025 08:59:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637077
- current block number: 21637077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xc9b21722e63d48dd138889259499421866b555cb

# Diff at Mon, 10 Feb 2025 19:04:05 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637077
- current block number: 21637077

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xc73a0b13e2dd97e5d7706a01fc2acdf9369398f7

# Diff at Tue, 04 Feb 2025 12:31:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637077
- current block number: 21637077

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
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
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x18da56e10eb06a55af3a2c057b47a40d6f42a9e4

# Diff at Mon, 20 Jan 2025 11:09:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637077
- current block number: 21637077

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637077 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
      directlyReceivedPermissions.6.from:
+        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
      directlyReceivedPermissions.5.target:
-        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
      directlyReceivedPermissions.5.from:
+        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
      directlyReceivedPermissions.4.target:
-        "0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"
      directlyReceivedPermissions.4.from:
+        "0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"
      directlyReceivedPermissions.3.target:
-        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
      directlyReceivedPermissions.3.from:
+        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
      directlyReceivedPermissions.2.target:
-        "0x2e5687010b5f62Ad0ef84370325bC91DED2724fe"
      directlyReceivedPermissions.2.from:
+        "0x2e5687010b5f62Ad0ef84370325bC91DED2724fe"
      directlyReceivedPermissions.1.target:
-        "0x1bBde518ad01BaABFE30020407A7630FB17B545d"
      directlyReceivedPermissions.1.from:
+        "0x1bBde518ad01BaABFE30020407A7630FB17B545d"
      directlyReceivedPermissions.0.target:
-        "0xeA078231B0ED94F816E57960423af6d028529b09"
      directlyReceivedPermissions.0.from:
+        "0xeA078231B0ED94F816E57960423af6d028529b09"
    }
```

```diff
    contract HyprMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
      receivedPermissions.1.from:
+        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
      receivedPermissions.0.target:
-        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
      receivedPermissions.0.from:
+        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0xeF2169180a2eda91B695eA5e5C4f4547C013840c"
      issuedPermissions.1.to:
+        "0xeF2169180a2eda91B695eA5e5C4f4547C013840c"
      issuedPermissions.0.target:
-        "0x28fB4D0e436874F4107948E358df3C242De06788"
      issuedPermissions.0.to:
+        "0x28fB4D0e436874F4107948E358df3C242De06788"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
      receivedPermissions.7.from:
+        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
      receivedPermissions.6.target:
-        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
      receivedPermissions.6.from:
+        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
      receivedPermissions.5.target:
-        "0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"
      receivedPermissions.5.from:
+        "0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"
      receivedPermissions.4.target:
-        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
      receivedPermissions.4.from:
+        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
      receivedPermissions.3.target:
-        "0x2e5687010b5f62Ad0ef84370325bC91DED2724fe"
      receivedPermissions.3.from:
+        "0x2e5687010b5f62Ad0ef84370325bC91DED2724fe"
      receivedPermissions.2.target:
-        "0x1bBde518ad01BaABFE30020407A7630FB17B545d"
      receivedPermissions.2.from:
+        "0x1bBde518ad01BaABFE30020407A7630FB17B545d"
      receivedPermissions.1.target:
-        "0xeA078231B0ED94F816E57960423af6d028529b09"
      receivedPermissions.1.from:
+        "0xeA078231B0ED94F816E57960423af6d028529b09"
      receivedPermissions.0.target:
-        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
      receivedPermissions.0.from:
+        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
      directlyReceivedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
      directlyReceivedPermissions.0.from:
+        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x28fB4D0e436874F4107948E358df3C242De06788"
      issuedPermissions.0.to:
+        "0x28fB4D0e436874F4107948E358df3C242De06788"
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x994c288de8418c8D3c5a4D21A69f35bF9641781C"
      issuedPermissions.1.to:
+        "0x994c288de8418c8D3c5a4D21A69f35bF9641781C"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0xd90dfca3ae1408ef818d6acde9fc43f1fab02ed4

# Diff at Thu, 16 Jan 2025 12:35:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078654
- current block number: 21637077

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x01f9e4b9115b834370fa6029c6c49252f27e8a8e

# Diff at Wed, 08 Jan 2025 09:01:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078654
- current block number: 21078654

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078654 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x40b86b67d96176fd4c5553a5a5f24e7d666cf169

# Diff at Fri, 01 Nov 2024 12:09:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078654
- current block number: 21078654

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078654 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      directlyReceivedPermissions.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x6e4ace80f91fe6cf8f01de0c3e9aca726ba0c528

# Diff at Wed, 30 Oct 2024 13:08:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20914127
- current block number: 21078654

## Description

Conduit MS: Signer added.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.7:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.6:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.5:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.4:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.3:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.1:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.0:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x7c297cb5ecfc6ac48fa9cd8b36a67d9ac75d8b18

# Diff at Tue, 29 Oct 2024 13:08:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20914127
- current block number: 20914127

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914127 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x84ef7eecfb675fca24dd98ba1a7b81fe4b176263

# Diff at Mon, 21 Oct 2024 12:44:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20914127
- current block number: 20914127

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914127 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0x4528f2041c6258ec273a6e3e88dcc8f091ec567d

# Diff at Mon, 21 Oct 2024 11:06:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20914127
- current block number: 20914127

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914127 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x384BA1d14cDdE620d309AcA9B154e6CACbF27d11"]
      values.$pastUpgrades.0.1:
-        ["0x384BA1d14cDdE620d309AcA9B154e6CACbF27d11"]
+        "0x674c805e53349e5b68c20bd25241d970ae83bba30757b8306114756128e32a53"
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x2246d85AC397d289d49a92C804201738C4Bd2d73"]
      values.$pastUpgrades.0.1:
-        ["0x2246d85AC397d289d49a92C804201738C4Bd2d73"]
+        "0xca1b3d60c48b85482355d9040bea39130f936d25366bba20cf0db83ed734f342"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x2A033B70a4D7FAbc6E651E964D18fcf65D9d2aED"]
      values.$pastUpgrades.0.1:
-        ["0x2A033B70a4D7FAbc6E651E964D18fcf65D9d2aED"]
+        "0x56c92e34794f4c1e5d3bb2ab33bd7a36ce493db3e10b158a439ec7456af73e4b"
    }
```

```diff
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0xdf3CEeA6357eb051c7D5C6aA0E31908C99Ec4E7e"]
      values.$pastUpgrades.1.1:
-        ["0xdf3CEeA6357eb051c7D5C6aA0E31908C99Ec4E7e"]
+        "0x160d179c75db8357b0c5c77b1017d7d5d5f1d1e888abf1e1051c070a5e54ea2b"
      values.$pastUpgrades.0.2:
+        ["0x9f6F58F07863D72C47D001066C65528C27D3AE19"]
      values.$pastUpgrades.0.1:
-        ["0x9f6F58F07863D72C47D001066C65528C27D3AE19"]
+        "0x4b182e697dc5f08c0c84092086af71c3b46ed73c9a60d12d0d3c28bab69f6e28"
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0xC3fE3e0Ea967B2878faB2fEc7e1067b32aDf1C03"]
      values.$pastUpgrades.0.1:
-        ["0xC3fE3e0Ea967B2878faB2fEc7e1067b32aDf1C03"]
+        "0x49a7f7d61580b0053fc9c9250f4aab0fab6fed09b7568889479af236ac28afe7"
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xd136b83fd10735AB0001B8F8B361900c3717d6C2"]
      values.$pastUpgrades.0.1:
-        ["0xd136b83fd10735AB0001B8F8B361900c3717d6C2"]
+        "0x68faa5363b8cab19d7ca0b3c184631a3474c6056170110c2716a26c8d6efbbca"
    }
```

Generated with discovered.json: 0x7fd0e5851ae5e545d7c442c2f995eb69e6f6f3d2

# Diff at Wed, 16 Oct 2024 11:36:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20914127
- current block number: 20914127

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914127 (main branch discovery), not current.

```diff
    contract HyprMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"},{"permission":"guard","target":"0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"}]
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xeF2169180a2eda91B695eA5e5C4f4547C013840c","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x28fB4D0e436874F4107948E358df3C242De06788"
      issuedPermissions.0.via.0:
-        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x28fB4D0e436874F4107948E358df3C242De06788"
      issuedPermissions.0.via.0:
-        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x994c288de8418c8D3c5a4D21A69f35bF9641781C"
      issuedPermissions.1.via.0:
-        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

Generated with discovered.json: 0x045f988e453cc37315ffd77eb1471bf6cb78e009

# Diff at Mon, 14 Oct 2024 10:51:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20914127
- current block number: 20914127

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914127 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract HyprMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"]
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xc8aea1ad75944084aeb3dc8b5c63135af405055da6baaffde3ed51e92c91e2eb"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

Generated with discovered.json: 0xec1e3a45bf216c71aab83c31dbeb0fce93aa38b4

# Diff at Wed, 09 Oct 2024 13:09:26 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20914127
- current block number: 20914127

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914127 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0xc671fe7911149c86e012a82d536ec3601af3e50f

# Diff at Mon, 07 Oct 2024 13:57:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7c3e632caf56b943789c1bfa1021d4f65d503045 block: 20775904
- current block number: 20914127

## Description

Rename Multisig.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775904 (main branch discovery), not current.

```diff
    contract HyprMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      name:
-        "ChallengerMultisig"
+        "HyprMultisig"
    }
```

Generated with discovered.json: 0xd5465aff937f8d9936f6f08febe31a4dbc9996ea

# Diff at Tue, 01 Oct 2024 10:51:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775904
- current block number: 20775904

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775904 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-01-17T17:27:11.000Z",["0x384BA1d14cDdE620d309AcA9B154e6CACbF27d11"]]]
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-01-17T17:27:11.000Z",["0x2246d85AC397d289d49a92C804201738C4Bd2d73"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-01-17T17:27:11.000Z",["0x2A033B70a4D7FAbc6E651E964D18fcf65D9d2aED"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-01-17T17:27:11.000Z",["0x9f6F58F07863D72C47D001066C65528C27D3AE19"]],["2024-01-17T17:27:11.000Z",["0xdf3CEeA6357eb051c7D5C6aA0E31908C99Ec4E7e"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-01-17T17:27:11.000Z",["0xC3fE3e0Ea967B2878faB2fEc7e1067b32aDf1C03"]]]
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-01-17T17:27:11.000Z",["0xd136b83fd10735AB0001B8F8B361900c3717d6C2"]]]
    }
```

Generated with discovered.json: 0xfc89da92652814898db1eb86e827fa81bb74ddf4

# Diff at Wed, 18 Sep 2024 11:33:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 19927696
- current block number: 20775904

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927696 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      directlyReceivedPermissions.1.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract ChallengerMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xBB08cf90DEb93492b463f1Ee5DA9453e51643586","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]}
      receivedPermissions.6.target:
-        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
+        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
      receivedPermissions.5.target:
-        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
+        "0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"
      receivedPermissions.4.target:
-        "0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"
+        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
      receivedPermissions.3.target:
-        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
+        "0x2e5687010b5f62Ad0ef84370325bC91DED2724fe"
      receivedPermissions.2.target:
-        "0x2e5687010b5f62Ad0ef84370325bC91DED2724fe"
+        "0x1bBde518ad01BaABFE30020407A7630FB17B545d"
      receivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x1bBde518ad01BaABFE30020407A7630FB17B545d"
+        "0xeA078231B0ED94F816E57960423af6d028529b09"
      receivedPermissions.0.target:
-        "0xeA078231B0ED94F816E57960423af6d028529b09"
+        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
      receivedPermissions.0.via:
-        [{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x26aca382028dfb2b6547e3fe0ad067fd39adbe95

# Diff at Sun, 08 Sep 2024 17:18:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19927696
- current block number: 19927696

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927696 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xeA078231B0ED94F816E57960423af6d028529b09"},{"permission":"upgrade","target":"0x1bBde518ad01BaABFE30020407A7630FB17B545d"},{"permission":"upgrade","target":"0x2e5687010b5f62Ad0ef84370325bC91DED2724fe"},{"permission":"upgrade","target":"0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"},{"permission":"upgrade","target":"0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"},{"permission":"upgrade","target":"0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"},{"permission":"upgrade","target":"0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xeA078231B0ED94F816E57960423af6d028529b09"},{"permission":"upgrade","target":"0x1bBde518ad01BaABFE30020407A7630FB17B545d"},{"permission":"upgrade","target":"0x2e5687010b5f62Ad0ef84370325bC91DED2724fe"},{"permission":"upgrade","target":"0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"},{"permission":"upgrade","target":"0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"},{"permission":"upgrade","target":"0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"},{"permission":"upgrade","target":"0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"}]
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x20D697b63d7747cF78C94ad9ee75C1436781E27E, inheriting its permissions."]
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xBB08cf90DEb93492b463f1Ee5DA9453e51643586","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xba1ac896F3b7cB273daE94bF9A6291A432e826c7","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2e5687010b5f62Ad0ef84370325bC91DED2724fe","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x1bBde518ad01BaABFE30020407A7630FB17B545d","via":[{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]}
      receivedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
+        "0xeA078231B0ED94F816E57960423af6d028529b09"
      receivedPermissions.0.via:
+        [{"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E"}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

```diff
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x20D697b63d7747cF78C94ad9ee75C1436781E27E"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","delay":0}
    }
```

Generated with discovered.json: 0xcbce71be7a7558d94d53a9ff8253b7c75c8f1476

# Diff at Fri, 30 Aug 2024 07:53:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19927696
- current block number: 19927696

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927696 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
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

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x20D697b63d7747cF78C94ad9ee75C1436781E27E, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x041d5e514465c3a25421d82502c9d5e39ed99a4c

# Diff at Fri, 23 Aug 2024 09:52:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19927696
- current block number: 19927696

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927696 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x431079c7869c8fe0d5c7e072fbc3902adce8d20a

# Diff at Wed, 21 Aug 2024 10:03:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19927696
- current block number: 19927696

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927696 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1bBde518ad01BaABFE30020407A7630FB17B545d","0x2e5687010b5f62Ad0ef84370325bC91DED2724fe","0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD","0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B","0xBB08cf90DEb93492b463f1Ee5DA9453e51643586","0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"],"configure":["0xeA078231B0ED94F816E57960423af6d028529b09"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xeA078231B0ED94F816E57960423af6d028529b09","via":[]},{"permission":"upgrade","target":"0x1bBde518ad01BaABFE30020407A7630FB17B545d","via":[]},{"permission":"upgrade","target":"0x2e5687010b5f62Ad0ef84370325bC91DED2724fe","via":[]},{"permission":"upgrade","target":"0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD","via":[]},{"permission":"upgrade","target":"0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B","via":[]},{"permission":"upgrade","target":"0xba1ac896F3b7cB273daE94bF9A6291A432e826c7","via":[]},{"permission":"upgrade","target":"0xBB08cf90DEb93492b463f1Ee5DA9453e51643586","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x20D697b63d7747cF78C94ad9ee75C1436781E27E, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x20D697b63d7747cF78C94ad9ee75C1436781E27E"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","via":[]}]
    }
```

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","via":[]}]
    }
```

```diff
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x20D697b63d7747cF78C94ad9ee75C1436781E27E","via":[]}]
    }
```

Generated with discovered.json: 0xc27c5a49b0c3924d7a714f6bbff805d68ca632cb

# Diff at Fri, 09 Aug 2024 11:59:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19927696
- current block number: 19927696

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927696 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
+        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
      assignedPermissions.upgrade.4:
-        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
+        "0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"
      assignedPermissions.upgrade.3:
-        "0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"
+        "0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"
      assignedPermissions.upgrade.2:
-        "0x1bBde518ad01BaABFE30020407A7630FB17B545d"
+        "0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD"
      assignedPermissions.upgrade.0:
-        "0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B"
+        "0x1bBde518ad01BaABFE30020407A7630FB17B545d"
    }
```

Generated with discovered.json: 0x7e3e0132b64963c69a0349793b0843d7aced6948

# Diff at Fri, 09 Aug 2024 10:09:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19927696
- current block number: 19927696

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927696 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1bBde518ad01BaABFE30020407A7630FB17B545d","0x2e5687010b5f62Ad0ef84370325bC91DED2724fe","0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD","0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B","0xBB08cf90DEb93492b463f1Ee5DA9453e51643586","0xba1ac896F3b7cB273daE94bF9A6291A432e826c7"]
      assignedPermissions.owner:
-        ["0xeA078231B0ED94F816E57960423af6d028529b09"]
      assignedPermissions.upgrade:
+        ["0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B","0x2e5687010b5f62Ad0ef84370325bC91DED2724fe","0x1bBde518ad01BaABFE30020407A7630FB17B545d","0xba1ac896F3b7cB273daE94bF9A6291A432e826c7","0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD","0xBB08cf90DEb93492b463f1Ee5DA9453e51643586"]
      assignedPermissions.configure:
+        ["0xeA078231B0ED94F816E57960423af6d028529b09"]
    }
```

```diff
    contract ChallengerMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x6D4c6D77a87F5aA89444dcCb37A65AEEb152717F","0x7A28B193dab5566bB1781f131A1d15603F2577D8","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x6D4c6D77a87F5aA89444dcCb37A65AEEb152717F","0x7A28B193dab5566bB1781f131A1d15603F2577D8","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x20D697b63d7747cF78C94ad9ee75C1436781E27E, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x20D697b63d7747cF78C94ad9ee75C1436781E27E"]
      assignedPermissions.configure:
+        ["0x20D697b63d7747cF78C94ad9ee75C1436781E27E"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x769f71c77dc775f250ed5e58797badf6a0edb6b5

# Diff at Thu, 18 Jul 2024 10:31:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19927696
- current block number: 19927696

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927696 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x20D697b63d7747cF78C94ad9ee75C1436781E27E, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x06e5f348d2fefeede00ea48b514332c748ab92d8

# Diff at Wed, 22 May 2024 20:06:37 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918842
- current block number: 19927696

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

Generated with discovered.json: 0x94f719afbbf7296c277466ef2c8ac32a8596e628

# Diff at Tue, 21 May 2024 14:21:35 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19531598
- current block number: 19918842

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531598 (main branch discovery), not current.

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "LyraMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0xcb35ba385fe9ac2754b38d86f7aee769f1626d94

# Diff at Thu, 28 Mar 2024 09:04:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19412042
- current block number: 19531598

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412042 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x004d2b7d11fdecf2f0a6c186a7e44db90726c052

# Diff at Mon, 11 Mar 2024 13:06:21 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176779
- current block number: 19412042

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176779 (main branch discovery), not current.

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xeb0c7bf141bfc7f188e3e3529f272eab8d5cb08f

# Diff at Wed, 07 Feb 2024 14:02:35 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175185
- current block number: 19176779

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175185 (main branch discovery), not current.

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
      values.sequencerInbox:
+        "0x0C57B7f3bAc278bE091431B52470fBAdBc4240E6"
    }
```

Generated with discovered.json: 0x46f4c52a626acd3dcf884cb34161e0d5fb8e3c00

# Diff at Wed, 07 Feb 2024 08:40:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19091597
- current block number: 19175185

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19091597 (main branch discovery), not current.

```diff
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0x8a7c6367f7513d053a63c0ea8d4a59e06b34cdf8

# Diff at Fri, 26 Jan 2024 15:13:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19091597

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L1StandardBridge (0x1bBde518ad01BaABFE30020407A7630FB17B545d) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x20D697b63d7747cF78C94ad9ee75C1436781E27E) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x28fB4D0e436874F4107948E358df3C242De06788) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x2e5687010b5f62Ad0ef84370325bC91DED2724fe) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x3E4F4Eb77a9c1f88c0e1F5aDCc9d3521Ce157FdD) {
    }
```

```diff
+   Status: CREATED
    contract LyraMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5F67587FB3f1736a5a91C10E3EeB7cA92117177B) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9f6F58F07863D72C47D001066C65528C27D3AE19) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xba1ac896F3b7cB273daE94bF9A6291A432e826c7) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0xBB08cf90DEb93492b463f1Ee5DA9453e51643586) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0xeA078231B0ED94F816E57960423af6d028529b09) {
    }
```
