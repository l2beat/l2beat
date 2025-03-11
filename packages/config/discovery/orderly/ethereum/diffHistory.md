Generated with discovered.json: 0x4d3fb1e91784d73d26b0b145999fd52381b3b8fb

# Diff at Tue, 04 Mar 2025 11:26:06 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637081
- current block number: 21637081

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0xab6bb0fba9f2d290bf34d23d1083c5cec26cfe2e

# Diff at Tue, 04 Mar 2025 10:39:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637081
- current block number: 21637081

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        18292537
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        18292533
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        18292538
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        18292536
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        18292543
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      sinceBlock:
+        18292534
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        18292540
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      sinceBlock:
+        18285574
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        18292539
    }
```

Generated with discovered.json: 0xe43309611711fd10dfb634f39df9edaa4c7715e2

# Diff at Wed, 26 Feb 2025 10:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637081
- current block number: 21637081

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x008ff4634a97e990f7312982bef720ef11d4e38b

# Diff at Fri, 21 Feb 2025 14:09:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637081
- current block number: 21637081

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x1c7260cf4514eb400760183a64e6018bea09b5cc

# Diff at Fri, 21 Feb 2025 08:59:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637081
- current block number: 21637081

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x7f155f10082233a50cfa22f206e1c6bd06f171a0

# Diff at Mon, 10 Feb 2025 19:04:24 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637081
- current block number: 21637081

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x66fcd6ecc85b48e0a1936aa87bb8b1f9a902a1fd

# Diff at Tue, 04 Feb 2025 12:31:50 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637081
- current block number: 21637081

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

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
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x9a6dca585daadd9318b5e3f5104fd8ff9dfb24ad

# Diff at Mon, 20 Jan 2025 11:09:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637081
- current block number: 21637081

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637081 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6.target:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      receivedPermissions.6.from:
+        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      receivedPermissions.5.target:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.5.from:
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.4.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.4.from:
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.3.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.3.from:
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.2.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.2.from:
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.1.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.1.from:
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.0.target:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      receivedPermissions.0.from:
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      directlyReceivedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
      directlyReceivedPermissions.0.from:
+        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
      issuedPermissions.1.to:
+        "0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B"
      issuedPermissions.0.target:
-        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      issuedPermissions.0.to:
+        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
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

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
      issuedPermissions.1.to:
+        "0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      issuedPermissions.0.to:
+        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
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
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.5.target:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      directlyReceivedPermissions.5.from:
+        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      directlyReceivedPermissions.4.target:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      directlyReceivedPermissions.4.from:
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      directlyReceivedPermissions.3.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      directlyReceivedPermissions.3.from:
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      directlyReceivedPermissions.2.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      directlyReceivedPermissions.2.from:
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      directlyReceivedPermissions.1.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      directlyReceivedPermissions.1.from:
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      directlyReceivedPermissions.0.target:
-        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      directlyReceivedPermissions.0.from:
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.1.from:
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.0.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.0.from:
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
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

Generated with discovered.json: 0xc817fbd660270ec3a6c083e7bb5c29a9d7760161

# Diff at Thu, 16 Jan 2025 12:35:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078674
- current block number: 21637081

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

Generated with discovered.json: 0xabddebd4805121726062510a2d0848db8b318e4a

# Diff at Wed, 08 Jan 2025 09:05:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078674
- current block number: 21078674

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078674 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x2d1904484a775595b2df58916cf8777b0c0f1e6c

# Diff at Fri, 01 Nov 2024 12:10:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078674
- current block number: 21078674

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078674 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x3b50208cabccaf08b0aa97444332c6d316d8623a

# Diff at Wed, 30 Oct 2024 13:12:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20920069
- current block number: 21078674

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

Generated with discovered.json: 0x466a881884904a9c6c0065beebe1a8a3cd3c23b6

# Diff at Tue, 29 Oct 2024 13:15:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x72ac4d99c8760631af29ab8ec729d8b414da3309

# Diff at Mon, 21 Oct 2024 12:47:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

Generated with discovered.json: 0x05e1810bbb23d863943574e0d76b7e2000a5455f

# Diff at Mon, 21 Oct 2024 11:08:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x334251f91a3795c043663172CB59a963a9029aed"]
      values.$pastUpgrades.0.1:
-        ["0x334251f91a3795c043663172CB59a963a9029aed"]
+        "0xca444e38e6211cc12586b9e29fe3e5612c2571e945baf37bb82f7dd892409292"
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"]
      values.$pastUpgrades.0.1:
-        ["0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"]
+        "0x92a61db152c2af8b75d8189eb9248997deaa06614e070a29476867af140f5562"
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"]
      values.$pastUpgrades.0.1:
-        ["0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"]
+        "0xe67534a97b70fa009f2193161a0bc01c5ab1e858d26eb90ee81ee9b279a31d3b"
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"]
      values.$pastUpgrades.0.1:
-        ["0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"]
+        "0xdf70e83fd16bf306ecd7497a9f24817d028e8e7bd267ead870360777b9e1a0a8"
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"]
      values.$pastUpgrades.1.1:
-        ["0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"]
+        "0xe8bb9753ef91830bd4bae629e76232efcfb35cd39d6b2e2e5bf5384e08e82bbe"
      values.$pastUpgrades.0.2:
+        ["0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"]
      values.$pastUpgrades.0.1:
-        ["0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"]
+        "0x690ab35045db8f46db127951b24b5241e3848503c9e5d6dd6888e34e9373f283"
    }
```

Generated with discovered.json: 0x3fd16b7fc418840f81b6724d1409c7e91b890917

# Diff at Wed, 16 Oct 2024 11:38:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x74BaD482a7f73C8286F50D8Aa03e53b7d24A5f3B","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      issuedPermissions.0.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0xf8dB8Aba597fF36cCD16fECfbb1B816B3236E9b8"
      issuedPermissions.1.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4"
      issuedPermissions.0.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions:
+        [{"permission":"challenge","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0"},{"permission":"guard","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"}]
    }
```

Generated with discovered.json: 0xa11f4c4f6d923adfb2f2932ed108c2207b951469

# Diff at Mon, 14 Oct 2024 10:54:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

Generated with discovered.json: 0x15517beca4a095d532eb18080e8b792831885b8d

# Diff at Wed, 09 Oct 2024 13:10:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20920069
- current block number: 20920069

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920069 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x0d00d1c4e97a77321515b7cf757d33b25a81d930

# Diff at Tue, 08 Oct 2024 16:27:39 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 20775932
- current block number: 20920069

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775932 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.scalar:
-        {"severity":"LOW","description":"A system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation."}
    }
```

```diff
    contract OrderlyMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      name:
-        "ChallengerMultisig"
+        "OrderlyMultisig"
    }
```

Generated with discovered.json: 0xbabcc2ea6910170e7f642c9c3436761368428543

# Diff at Tue, 01 Oct 2024 10:53:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20775932
- current block number: 20775932

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20775932 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2023-10-06T16:10:47.000Z",["0x334251f91a3795c043663172CB59a963a9029aed"]]]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2023-10-06T16:08:47.000Z",["0x240B3bd6b95cE40497Aafd71aD4705d0345A33CD"]]]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2023-10-06T16:11:11.000Z",["0x7A163eb6Df3EEBbf817A7A9769F53FB2a441D47E"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2023-10-06T16:09:35.000Z",["0x701E95156dfD378d1985C6CC405D0Ee3d2af8503"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2023-10-06T16:06:11.000Z",["0xc76543A64666d9a073FaEF4e75F651c88e7DBC08"]],["2023-10-06T16:10:23.000Z",["0xB6767fA038e8fbe3B60d42866dbeF0fca3B1a7d6"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x6587e77b1bc0109902cce14ed8418d8c477b4747

# Diff at Wed, 18 Sep 2024 11:34:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 20389626
- current block number: 20775932

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.5.target:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      receivedPermissions.4.target:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
      receivedPermissions.3.target:
-        "0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.2.target:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      receivedPermissions.1.via:
-        [{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
      fieldMeta.gasLimit:
+        {"severity":"LOW","description":"Gas limit for blocks on L2."}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      directlyReceivedPermissions.5.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
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
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

Generated with discovered.json: 0x3e7c965c6264d54c688e01f8ba4dd0f5e60c8c14

# Diff at Sun, 08 Sep 2024 17:19:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions."]
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0","via":[{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]}
      receivedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"
      receivedPermissions.0.via:
+        [{"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"}]
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0"},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0"},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84"},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"}]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","delay":0}
    }
```

Generated with discovered.json: 0x9c75831703a3694cfa0e697fd0de4ebff7994eb6

# Diff at Fri, 30 Aug 2024 07:54:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
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

Generated with discovered.json: 0xa40daeb4cf7eab339511b0315a54944a5e707d87

# Diff at Fri, 23 Aug 2024 09:54:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x3ca55cefdcfe9adffcca7bfa15ab94ed5fead558

# Diff at Wed, 21 Aug 2024 10:04:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"],"configure":["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x87630a802a3789463eC4b00f89b27b1e9f6b92e9","via":[]},{"permission":"upgrade","target":"0x5e76821C3c1AbB9fD6E310224804556C61D860e0","via":[]},{"permission":"upgrade","target":"0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","via":[]},{"permission":"upgrade","target":"0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","via":[]},{"permission":"upgrade","target":"0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","via":[]},{"permission":"upgrade","target":"0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9","via":[]}]
    }
```

Generated with discovered.json: 0x2caca61eaccc3a2c034c3dfe5527b5a76959d731

# Diff at Fri, 09 Aug 2024 12:01:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions.upgrade.4:
-        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
+        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
      assignedPermissions.upgrade.3:
-        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
+        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
      assignedPermissions.upgrade.1:
-        "0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"
+        "0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"
      assignedPermissions.upgrade.0:
-        "0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC"
+        "0x5e76821C3c1AbB9fD6E310224804556C61D860e0"
    }
```

Generated with discovered.json: 0x1841a57a9c7afbf5e3b041512887c9375fe4f8ff

# Diff at Fri, 09 Aug 2024 10:11:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]
      assignedPermissions.configure:
+        ["0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9"]
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
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1"]
      assignedPermissions.owner:
-        ["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]
      assignedPermissions.upgrade:
+        ["0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC","0xe07eA0436100918F157DF35D01dCE5c11b16D1F1","0x91493a61ab83b62943E6dCAa5475Dd330704Cc84","0x5e76821C3c1AbB9fD6E310224804556C61D860e0","0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664"]
      assignedPermissions.configure:
+        ["0x87630a802a3789463eC4b00f89b27b1e9f6b92e9"]
    }
```

```diff
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x71884086Cfacc370cf5EC34363Bf3938C6c6d888","0xC11D658978FF288da8bda4004CB93C6C99D791b1","0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0x71884086Cfacc370cf5EC34363Bf3938C6c6d888","0xC11D658978FF288da8bda4004CB93C6C99D791b1","0x985Fa8958Aa3dcE89a83E519e6FAAeCAa4930b32"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xc065214323221c00d532c88f2554ff27ad4bceac

# Diff at Tue, 30 Jul 2024 11:13:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20389626
- current block number: 20389626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389626 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      fieldMeta:
+        {"scalar":{"severity":"LOW","description":"A system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation."}}
    }
```

Generated with discovered.json: 0x19f4d93eec683b08cf420083a293d12ebb2fd2f9

# Diff at Fri, 26 Jul 2024 08:48:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20110288
- current block number: 20389626

## Description

Gas limit raise to 180M, the highest current limit on OP stack chains. With a block time of 2s and elasticity of 10x, this currently puts Orderly at 9 GGas/s on average. This is ~ 7x Ethereum Mainnet's 1,25 GGas/s and has a much higher surge scaling buffer. (elasticity)

Note: While orderly has ~ 80% higher Gas/s than base, base more regularly hits its target Gas/s, producing more high-usage data.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        100000000
+        180000000
    }
```

Generated with discovered.json: 0x88f0e627756850be622db543fb18dbd56fb4d43e

# Diff at Thu, 18 Jul 2024 10:32:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20110288
- current block number: 20110288

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20110288 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9, inheriting its permissions."]
    }
```

Generated with discovered.json: 0xacba6ab4a87f8e5be0f863efe0fa9ae45984e681

# Diff at Mon, 17 Jun 2024 08:23:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f39ec7f15738d4847f0cbde4818140d42e26440f block: 20082412
- current block number: 20110288

## Description

Gas limit raised. Now ~10% higher than base L2.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        60000000
+        100000000
    }
```

Generated with discovered.json: 0xfbd9c919a36d8ba7131d60ce803c892cd260a714

# Diff at Thu, 13 Jun 2024 10:50:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd33b23d6b32d4d38eea92d309fd854193b90203 block: 19927716
- current block number: 20082412

## Description

Gas limit raised.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        40000000
+        60000000
    }
```

Generated with discovered.json: 0x8ea4f813fa7d4b58eb69ad964fafb89cd12576b2

# Diff at Wed, 22 May 2024 20:10:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918763
- current block number: 19927716

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

Generated with discovered.json: 0x540ca88f8981b161a151986f136629dc3e13d7c5

# Diff at Tue, 21 May 2024 14:05:34 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19859812
- current block number: 19918763

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19859812 (main branch discovery), not current.

```diff
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "OrderlyMultisig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x5edacefb20bc8a6791e626d8341b2641515ce115

# Diff at Mon, 13 May 2024 08:10:33 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19830984
- current block number: 19859812

## Description

After doubling the gasLimit, it is now decreased to 40M, still a 1/3 increase from the original 30M.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        60000000
+        40000000
    }
```

Generated with discovered.json: 0x5d1123ab6324ea7e55ea01032dfc89c12ca212e2

# Diff at Thu, 09 May 2024 07:27:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d3bba0812727b9105a3f44fe55a68572c804b992 block: 19776802
- current block number: 19830984

## Description

The gasLimit for L2 is doubled. Current block time is 2s, elasticity is 10x. This config is now identical to Base L2.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.gasLimit:
-        30000000
+        60000000
    }
```

Generated with discovered.json: 0x3edeab069898df087a548f652052250c2f97a55a

# Diff at Thu, 28 Mar 2024 10:33:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19412725
- current block number: 19532040

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19412725 (main branch discovery), not current.

```diff
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x27306da2737a02c26f8c4f41629c815ee18b5695

# Diff at Mon, 11 Mar 2024 15:24:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@d2d5fba14a44528004eaad2e4389550987c4f3cd block: 19370130
- current block number: 19412725

## Description

Update OP stack DA handler.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19370130 (main branch discovery), not current.

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x3cbbe86d1549ff16f956680e8ecb073e926f6be1

# Diff at Tue, 05 Mar 2024 16:23:09 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@529206d4dcd4dd7502f78a4a18a97240a3a0211b block: 19182535
- current block number: 19370130

## Description

Scalar - a system configuration parameter used as dynamic L2 gas overhead in the L2 fee calculation, has been decreased.

## Watched changes

```diff
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    +++ description: None
      values.scalar:
-        68400
+        13680
    }
```

Generated with discovered.json: 0xbe756234887059a7f1f0faab5602440c3db37a6d

# Diff at Thu, 08 Feb 2024 09:25:18 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- current block number: 19182535

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract OrderlyMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x5e76821C3c1AbB9fD6E310224804556C61D860e0) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x87630a802a3789463eC4b00f89b27b1e9f6b92e9) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x886B187C3D293B1449A3A0F23Ca9e2269E0f2664) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x91493a61ab83b62943E6dCAa5475Dd330704Cc84) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x934Ab59Ef14b638653b1C0FEf7aB9a72186393DC) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb570F4aD27e7De879A2E4F2F3DE27dBaBc20E9B9) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xc76543A64666d9a073FaEF4e75F651c88e7DBC08) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0xcE10372313Ca39Fbf75A09e7f4c0E57F070259f4) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xe07eA0436100918F157DF35D01dCE5c11b16D1F1) {
    }
```
