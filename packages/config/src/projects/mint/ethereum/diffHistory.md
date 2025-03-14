Generated with discovered.json: 0xbf5135fedb6b64e93b10e95424de68b6082a37b2

# Diff at Tue, 04 Mar 2025 11:26:00 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637079
- current block number: 21637079

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xf7b3b4a6a592ca5226321bee2f2ec5505cbee68b

# Diff at Tue, 04 Mar 2025 10:39:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637079
- current block number: 21637079

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19861572
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
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19861572
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19861572
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      sinceBlock:
+        19861572
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19861572
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19861572
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19861572
    }
```

Generated with discovered.json: 0x7b14aa4a02152a56b2298707e1021fbc4f88c6e7

# Diff at Wed, 26 Feb 2025 10:32:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637079
- current block number: 21637079

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x823fcc62594463b3cf8293409bb7ddc96f7b63cc

# Diff at Fri, 21 Feb 2025 14:09:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637079
- current block number: 21637079

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xd7e8f3732a33489a5075f9e1e7bc74acc0d38379

# Diff at Fri, 21 Feb 2025 08:59:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637079
- current block number: 21637079

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x4c511f3b01105304c7de006c09fa999853acbcb5

# Diff at Mon, 10 Feb 2025 19:04:16 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637079
- current block number: 21637079

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x5d059c3dbf5253fc0a4b79dab4aa1c636d9cb6eb

# Diff at Tue, 04 Feb 2025 12:31:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637079
- current block number: 21637079

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.via:
+        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.2.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.via:
-        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xaa75bf422fd03ea01d523df42729e67603e3ea13

# Diff at Mon, 20 Jan 2025 11:09:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637079
- current block number: 21637079

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637079 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
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
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.7.from:
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.6.target:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.6.from:
+        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.5.target:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.5.from:
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.4.target:
-        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      receivedPermissions.4.from:
+        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      receivedPermissions.3.target:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.3.from:
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.2.target:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.2.from:
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.1.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.1.from:
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.0.target:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.0.from:
+        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      directlyReceivedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      directlyReceivedPermissions.0.from:
+        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
      issuedPermissions.1.to:
+        "0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      directlyReceivedPermissions.4.from:
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      directlyReceivedPermissions.3.target:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      directlyReceivedPermissions.3.from:
+        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      directlyReceivedPermissions.2.target:
-        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      directlyReceivedPermissions.2.from:
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      directlyReceivedPermissions.1.target:
-        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      directlyReceivedPermissions.1.from:
+        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      directlyReceivedPermissions.0.target:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      directlyReceivedPermissions.0.from:
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
      issuedPermissions.1.to:
+        "0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
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

Generated with discovered.json: 0x304e69c53d1245293b59d1e99d06f7a3971e90f6

# Diff at Thu, 16 Jan 2025 12:35:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078665
- current block number: 21637079

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

Generated with discovered.json: 0xc2501c451f048f88335e3550ad8bdf7c6af64360

# Diff at Wed, 08 Jan 2025 09:04:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078665
- current block number: 21078665

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078665 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xa0afcb4960b94b4c336942f0cc0272297bbad77a

# Diff at Fri, 01 Nov 2024 12:10:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078665
- current block number: 21078665

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078665 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xaa58554978b22d31d83fd8664dc086ce579198bc

# Diff at Wed, 30 Oct 2024 13:10:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20915064
- current block number: 21078665

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

Generated with discovered.json: 0x4895221ac5ad4940dfd9fbf850135a7fd5203f4d

# Diff at Tue, 29 Oct 2024 13:12:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xf1d95e88677b6873fd6f714c8156a3e84f5a7d65

# Diff at Mon, 21 Oct 2024 12:46:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

Generated with discovered.json: 0x4278b05a89be8a240d29ca1bf06079377f02dbc7

# Diff at Mon, 21 Oct 2024 11:07:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"]
      values.$pastUpgrades.0.1:
-        ["0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"]
+        "0xf9c4b516fbf6330483f4bb2dc6db4e544d1eb9d09a7b9cda3e578d48bcc10736"
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"]
      values.$pastUpgrades.0.1:
-        ["0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"]
+        "0xd780db925a08261a82189b1d692b87934304277d8db9e6e2faf198afdd0d2c13"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x08C033C6859093b2803e54DE715077bd400D5f6a"]
      values.$pastUpgrades.0.1:
-        ["0x08C033C6859093b2803e54DE715077bd400D5f6a"]
+        "0x2b9629c950de2ee9defa34d449dd784caa1877200c1c6fabfbde02692a6d077f"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0x958487e21ba9E073836d598E31f749726f23413f"]
      values.$pastUpgrades.1.1:
-        ["0x958487e21ba9E073836d598E31f749726f23413f"]
+        "0x9d07d5c5f28d46fdc0b6ff4ecf7cdf165e162a5d44623955da21c7340686d8f5"
      values.$pastUpgrades.0.2:
+        ["0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"]
      values.$pastUpgrades.0.1:
-        ["0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"]
+        "0x127974ee188b1f3ce9ff4ad58f1cb84fa84029b470db08a64958dd97d350d8c7"
    }
```

Generated with discovered.json: 0x03d42535d8fb607379d5d54f4b765351b458ccd9

# Diff at Wed, 16 Oct 2024 11:38:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.5.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0x59625d1FE0Eeb8114a4d13c863978F39b3471781"
      receivedPermissions.4.target:
-        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
+        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
      receivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.via:
-        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x2b3F201543adF73160bA42E1a5b7750024F30420"
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.2.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "set and change address mappings."
      receivedPermissions.1.target:
-        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.via:
-        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x3d53Df1e69A32F98dFCcf23CCB689763E21A78bA","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x68bdFecE01535090c8f3C27ec3b1AE97E83fA4aA"
      issuedPermissions.1.via.0:
-        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

Generated with discovered.json: 0xee4da1c703ca11994585ea3ca45b8d2dd352d71d

# Diff at Mon, 14 Oct 2024 10:53:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
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
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

Generated with discovered.json: 0x2f8a0067d0f54fff426d1712769d173dc7746819

# Diff at Wed, 09 Oct 2024 13:09:58 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20915064
- current block number: 20915064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20915064 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x2857b7cc32864c486998374c5650111df06679b5

# Diff at Tue, 01 Oct 2024 10:53:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"]]]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"]]]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0x08C033C6859093b2803e54DE715077bd400D5f6a"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:23.000Z",["0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"]],["2024-05-13T14:04:47.000Z",["0x958487e21ba9E073836d598E31f749726f23413f"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x4d4a060c945d3ee7625ef881e76e1744b92a522f

# Diff at Tue, 17 Sep 2024 09:19:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a17234c1dfeb209a9842df2b454c07e2b8da435d block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
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
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.1.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
+        ["Core"]
    }
```

Generated with discovered.json: 0x853e63a362fe17fee5d5625ac0958fe682ff1c84

# Diff at Sun, 08 Sep 2024 17:18:50 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions.","It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.1.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.1.via:
+        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228"},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420"},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781"},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228"},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420"},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781"},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5"}]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

Generated with discovered.json: 0x3bf5da31819ff1427e452945233ffe550cabb39b

# Diff at Fri, 30 Aug 2024 07:53:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
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

Generated with discovered.json: 0xe377321f8f756baf61b172572d8db26130d2c3a0

# Diff at Fri, 23 Aug 2024 09:53:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x98b95361b6a19b8d49a861ad2a039b3392df189b

# Diff at Wed, 21 Aug 2024 10:04:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0xC975862927797812371A9Fb631f83F8f5e2240D5","0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]},{"permission":"configure","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"],"configure":["0xEa4165C5CDCA155779803A113d8391b741bA5228"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228","via":[]},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420","via":[]},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781","via":[]},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","via":[]},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[]}]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

Generated with discovered.json: 0xffa2ec60da5474402f9060f965246766d95f3576

# Diff at Fri, 09 Aug 2024 12:00:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.configure.1:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      assignedPermissions.configure.0:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
    }
```

Generated with discovered.json: 0xebbfc6090005d5430c4cdbea02ba0d9321224635

# Diff at Fri, 09 Aug 2024 10:10:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0xC975862927797812371A9Fb631f83F8f5e2240D5","0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"]
      assignedPermissions.configure:
+        ["0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
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

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
      assignedPermissions.owner:
-        ["0xEa4165C5CDCA155779803A113d8391b741bA5228"]
      assignedPermissions.upgrade:
+        ["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
      assignedPermissions.configure:
+        ["0xEa4165C5CDCA155779803A113d8391b741bA5228"]
    }
```

Generated with discovered.json: 0xef5d9930be760333d1e12f203bc4672f43849710

# Diff at Tue, 30 Jul 2024 11:12:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x1d9d5f50fa5e5186410fb005a1c9728894bcede5

# Diff at Thu, 18 Jul 2024 10:31:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions.","It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

Generated with discovered.json: 0x8907a9d0268c44c81ceacbf6af9438ae3a744a10

# Diff at Thu, 06 Jun 2024 12:44:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@5302ef2899ddfb7175df497ceaa47fba4e383655 block: 19982484
- current block number: 20032860

## Description

Discovery output now includes names of templates used for contract analysis.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19982484 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      template:
+        "opstack/SystemConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
    }
```

Generated with discovered.json: 0x88e0f828470372caf9a8af58d6227cfdd9d9c65d

# Diff at Thu, 23 May 2024 13:58:42 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ec50a072d7124fbf2bdaa30b50f821730ba6e919 block: 19926571
- current block number: 19933028

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

Generated with discovered.json: 0x4fe6b15ce9fb31f900191985a91e36dad486b310

# Diff at Wed, 22 May 2024 16:20:16 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19926571

## Description

First discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED)
    +++ description: Central actor allowed to post new L2 state roots to L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19)
    +++ description: None
```
