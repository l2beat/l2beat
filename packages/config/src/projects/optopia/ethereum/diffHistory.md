Generated with discovered.json: 0x26ed890d44773749617249b325a7b85bc8588950

# Diff at Tue, 04 Mar 2025 11:26:06 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21184911
- current block number: 21184911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x9639501b69975003ae2a016418dd7e1c90a7a87b

# Diff at Tue, 04 Mar 2025 10:39:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21184911
- current block number: 21184911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19838878
    }
```

```diff
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19838879
    }
```

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: None
      sinceBlock:
+        19838879
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19838879
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: None
      sinceBlock:
+        19838878
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19838879
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19838879
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19838879
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19838879
    }
```

```diff
    contract OptimismMintableERC20Factory (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      sinceBlock:
+        19838879
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19838880
    }
```

Generated with discovered.json: 0xa81e2351dc0819ae6d3f957951ffbf48ebba592a

# Diff at Wed, 26 Feb 2025 10:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21184911
- current block number: 21184911

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xffa1f7ec9e6b88b239c34fb10c21469f43c8c6fa

# Diff at Fri, 21 Feb 2025 14:09:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21184911
- current block number: 21184911

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x3c4a443b2a78a309d64376df4836d94d0d9d60b7

# Diff at Fri, 21 Feb 2025 08:59:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21184911
- current block number: 21184911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0x9437f7bd2c883487abcf2b642b16dc6cf45805b1

# Diff at Wed, 12 Feb 2025 08:36:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21184911
- current block number: 21184911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      name:
-        ""
+        "OptimismMintableERC20Factory"
    }
```

Generated with discovered.json: 0xfca6d1de1ba4bca427b20e84d4893299e5e2eaae

# Diff at Mon, 10 Feb 2025 19:04:23 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21184911
- current block number: 21184911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xdc510cb58e3f937136a34c55cef5006d463cec94

# Diff at Tue, 04 Feb 2025 12:31:49 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21184911
- current block number: 21184911

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xa007fe6458a622a95243536a6dcf102de18eb21e

# Diff at Mon, 20 Jan 2025 11:09:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21184911
- current block number: 21184911

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"
      directlyReceivedPermissions.7.from:
+        "0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"
      directlyReceivedPermissions.6.target:
-        "0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"
      directlyReceivedPermissions.6.from:
+        "0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"
      directlyReceivedPermissions.5.target:
-        "0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"
      directlyReceivedPermissions.5.from:
+        "0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"
      directlyReceivedPermissions.4.target:
-        "0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"
      directlyReceivedPermissions.4.from:
+        "0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"
      directlyReceivedPermissions.3.target:
-        "0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"
      directlyReceivedPermissions.3.from:
+        "0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"
      directlyReceivedPermissions.2.target:
-        "0x39A90926306E11497EC5FE1C459910258B620edD"
      directlyReceivedPermissions.2.from:
+        "0x39A90926306E11497EC5FE1C459910258B620edD"
      directlyReceivedPermissions.1.target:
-        "0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1"
      directlyReceivedPermissions.1.from:
+        "0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1"
      directlyReceivedPermissions.0.target:
-        "0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"
      directlyReceivedPermissions.0.from:
+        "0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"
      receivedPermissions.7.from:
+        "0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"
      receivedPermissions.6.target:
-        "0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"
      receivedPermissions.6.from:
+        "0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"
      receivedPermissions.5.target:
-        "0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"
      receivedPermissions.5.from:
+        "0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"
      receivedPermissions.4.target:
-        "0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"
      receivedPermissions.4.from:
+        "0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"
      receivedPermissions.3.target:
-        "0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"
      receivedPermissions.3.from:
+        "0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"
      receivedPermissions.2.target:
-        "0x39A90926306E11497EC5FE1C459910258B620edD"
      receivedPermissions.2.from:
+        "0x39A90926306E11497EC5FE1C459910258B620edD"
      receivedPermissions.1.target:
-        "0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1"
      receivedPermissions.1.from:
+        "0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1"
      receivedPermissions.0.target:
-        "0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"
      receivedPermissions.0.from:
+        "0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"
      directlyReceivedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
      directlyReceivedPermissions.0.from:
+        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.target:
-        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
      issuedPermissions.0.to:
+        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.target:
-        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
      issuedPermissions.0.to:
+        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.1.target:
-        "0x3D0Bf26E60a689a7Da5EA3ddAD7371F27f7671a5"
      issuedPermissions.1.to:
+        "0x3D0Bf26E60a689a7Da5EA3ddAD7371F27f7671a5"
      issuedPermissions.0.target:
-        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
      issuedPermissions.0.to:
+        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
    }
```

```diff
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.1.target:
-        "0x33397410000A219fa5a476c5B51032B367C77e78"
      issuedPermissions.1.to:
+        "0x33397410000A219fa5a476c5B51032B367C77e78"
      issuedPermissions.0.target:
-        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
      issuedPermissions.0.to:
+        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
    }
```

Generated with discovered.json: 0x9117994192438d52c22b4447eecfb2ab9bcb477e

# Diff at Wed, 08 Jan 2025 09:04:51 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21184911
- current block number: 21184911

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21184911 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xf3a34ffaa238662eb4bccc81db9fd850d1b2acdd

# Diff at Thu, 14 Nov 2024 09:02:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ea60800af45c71fbd5d292e0f4301ba9afda01fa block: 20427351
- current block number: 21184911

## Description

Upgrade L2OutputOracle to a beta version (minor changes).

## Watched changes

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes.1:
-        "0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"
+        "0x82ce2b4d2c7dcca833593de12c2cf9aef63b23af286529708131f3aa909484ce"
      values.$implementation:
-        "0x38f2D861b23866b92188155C4876F0879cA706Ec"
+        "0xDe94ECc695F2Df967b49ED11829eC9f7c1831a61"
      values.$pastUpgrades.2:
+        ["2024-11-12T05:33:23.000Z","0x205d623832f5a7d959f55aac33cae361475b2abfd69ca37c8eec2bd510276c3f",["0xDe94ECc695F2Df967b49ED11829eC9f7c1831a61"]]
      values.$pastUpgrades.1:
+        ["2024-11-12T03:33:47.000Z","0xe56f6658e706a93ca4aa13817ca9316ae594f08268d7dbada461427b4f55756c",["0xfc2Af8738f04d14833BBcE3AD446F603E91D9306"]]
      values.$upgradeCount:
-        1
+        3
      values.SUBMISSION_INTERVAL:
-        1800
+        18000
      values.submissionInterval:
-        1800
+        18000
      values.version:
-        "1.8.0"
+        "1.8.1-beta.2"
    }
```

## Source code changes

```diff
.../L2OutputOracle/L2OutputOracle.sol              | 163 +++++++++++++++++----
 1 file changed, 135 insertions(+), 28 deletions(-)
```

Generated with discovered.json: 0x68124028c6826842d33172001049f07db1237c2c

# Diff at Fri, 01 Nov 2024 12:23:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: None
      directlyReceivedPermissions.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: None
      receivedPermissions.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0x83badceebeae857b8a485b79c07bb8773e9c3d7b

# Diff at Tue, 29 Oct 2024 13:14:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x91b688f42d748679e46b1aee72218561d06ee425

# Diff at Tue, 22 Oct 2024 13:50:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0xe77d39e6da487a7fc885467c35c7575f0ef68027

# Diff at Mon, 21 Oct 2024 12:46:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

Generated with discovered.json: 0x854504dbffae7e87e4bf1024325a8cd55176c483

# Diff at Mon, 21 Oct 2024 11:08:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0xD09C8E2C6D124bCE71235046B95ab676bE1d5601"]
      values.$pastUpgrades.0.1:
-        ["0xD09C8E2C6D124bCE71235046B95ab676bE1d5601"]
+        "0xf3b204596e40214b046c7cebacfb0be751ab67df24f25ce689a7422367ba9793"
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.4.2:
+        ["0xFe9B3d40DB0ec8f97D9ea638e926b3aEED8cF29B"]
      values.$pastUpgrades.4.1:
-        ["0xFe9B3d40DB0ec8f97D9ea638e926b3aEED8cF29B"]
+        "0x9070b165958b48b3eabe3dac62a836e942ad8ec64273ce5f9d4627deb427974e"
      values.$pastUpgrades.3.2:
+        ["0x9b29299b791a36DA8Dd7dDeBe55038576995145b"]
      values.$pastUpgrades.3.1:
-        ["0x9b29299b791a36DA8Dd7dDeBe55038576995145b"]
+        "0x04b31173f0fd9c8ab794ad926a7f96b867974dd952c91423910d17f5c702e8af"
      values.$pastUpgrades.2.2:
+        ["0x63dD9FB4b0Af7a158E819cDfE781082bCb60e21D"]
      values.$pastUpgrades.2.1:
-        ["0x63dD9FB4b0Af7a158E819cDfE781082bCb60e21D"]
+        "0xfd1c496fe0c25e3f59bfafb68e47aa9bc0fee4c77220290e398676ee63a6b68f"
      values.$pastUpgrades.1.2:
+        ["0xFe9B3d40DB0ec8f97D9ea638e926b3aEED8cF29B"]
      values.$pastUpgrades.1.1:
-        ["0xFe9B3d40DB0ec8f97D9ea638e926b3aEED8cF29B"]
+        "0x07498c42d2879512867123618dc2fa47869d97a111c091722f489e05ebedce96"
      values.$pastUpgrades.0.2:
+        ["0x63dD9FB4b0Af7a158E819cDfE781082bCb60e21D"]
      values.$pastUpgrades.0.1:
-        ["0x63dD9FB4b0Af7a158E819cDfE781082bCb60e21D"]
+        "0x47e3348f1a815baed93634d82c6eec4839f21c6f2cc949b589bf7c9912adadfa"
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.0.2:
+        ["0xF3E372Ec07a9Bf0C94ff21ceBe02952F2164996F"]
      values.$pastUpgrades.0.1:
-        ["0xF3E372Ec07a9Bf0C94ff21ceBe02952F2164996F"]
+        "0x8ceff1123470899bafdc1e6b187d546752254d5a05ab2ac78ed21396ee1528f8"
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xa65DE544846795C7eeAd60790197B0EB755547ee"]
      values.$pastUpgrades.0.1:
-        ["0xa65DE544846795C7eeAd60790197B0EB755547ee"]
+        "0x24ca235a5fe65c9dde1db0054a48b85133ac9524cb2416a70c9458d9a3340790"
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0xe04D088840aE793afd0970fE97FEC6Ac7BaF4AAC"]
      values.$pastUpgrades.0.1:
-        ["0xe04D088840aE793afd0970fE97FEC6Ac7BaF4AAC"]
+        "0xdaefb6ed2c511dbaa99b5a0d6b38ee6dfb6cf267872509b3f72f93d8d482dcf5"
    }
```

```diff
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xAd8890C1DF1f29f6a26B6eCcc73c299599c40F3d"]
      values.$pastUpgrades.0.1:
-        ["0xAd8890C1DF1f29f6a26B6eCcc73c299599c40F3d"]
+        "0x2fdeb4652fc3616644be2358c6410407c7e04b5e8dd205ceb5bf5ee6fc27484f"
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x38f2D861b23866b92188155C4876F0879cA706Ec"]
      values.$pastUpgrades.0.1:
-        ["0x38f2D861b23866b92188155C4876F0879cA706Ec"]
+        "0x180139009c00eb38a40976d4c9203252b2c5ecfdd00af1678827f1dd32ba29ba"
    }
```

Generated with discovered.json: 0x6a12f03a1decc9e08f06d5865545ce32634fb283

# Diff at Wed, 16 Oct 2024 11:38:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x2C73A1610EE822a8C2C21eddd455e725A3334c8C","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
+        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
      issuedPermissions.0.via.0:
-        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x2C73A1610EE822a8C2C21eddd455e725A3334c8C","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
+        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
      issuedPermissions.0.via.0:
-        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x2C73A1610EE822a8C2C21eddd455e725A3334c8C","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
+        "0x3D0Bf26E60a689a7Da5EA3ddAD7371F27f7671a5"
      issuedPermissions.1.via.0:
-        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x2C73A1610EE822a8C2C21eddd455e725A3334c8C","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x33397410000A219fa5a476c5B51032B367C77e78","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
+        "0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"
      issuedPermissions.0.via.0:
-        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

Generated with discovered.json: 0x836ad78372cd5852d03d557fdb8acf6401957616

# Diff at Mon, 14 Oct 2024 10:53:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

Generated with discovered.json: 0xe82340fa5c6319c40d18783214d23c7bfec13ad6

# Diff at Wed, 09 Oct 2024 13:10:21 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x45d4c134035fe754e6f58d267b73d408d01a7d43

# Diff at Tue, 01 Oct 2024 10:53:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-05-10T09:57:11.000Z",["0xD09C8E2C6D124bCE71235046B95ab676bE1d5601"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-05-10T09:57:23.000Z",["0x63dD9FB4b0Af7a158E819cDfE781082bCb60e21D"]],["2024-05-23T11:39:11.000Z",["0xFe9B3d40DB0ec8f97D9ea638e926b3aEED8cF29B"]],["2024-05-24T03:40:35.000Z",["0x63dD9FB4b0Af7a158E819cDfE781082bCb60e21D"]],["2024-05-29T06:06:23.000Z",["0x9b29299b791a36DA8Dd7dDeBe55038576995145b"]],["2024-05-29T06:10:23.000Z",["0xFe9B3d40DB0ec8f97D9ea638e926b3aEED8cF29B"]]]
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-05-10T09:56:11.000Z",["0xF3E372Ec07a9Bf0C94ff21ceBe02952F2164996F"]]]
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-05-10T09:57:11.000Z",["0xa65DE544846795C7eeAd60790197B0EB755547ee"]]]
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-05-10T09:57:11.000Z",["0xe04D088840aE793afd0970fE97FEC6Ac7BaF4AAC"]]]
    }
```

```diff
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-10T09:57:11.000Z",["0xAd8890C1DF1f29f6a26B6eCcc73c299599c40F3d"]]]
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-05-10T09:57:11.000Z",["0x38f2D861b23866b92188155C4876F0879cA706Ec"]]]
    }
```

Generated with discovered.json: 0xe6e500bd1941daac91d9b95ac3d7eae7e62e4a85

# Diff at Sun, 08 Sep 2024 17:24:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0:
+        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x2C73A1610EE822a8C2C21eddd455e725A3334c8C","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"},{"permission":"upgrade","target":"0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1"},{"permission":"upgrade","target":"0x39A90926306E11497EC5FE1C459910258B620edD"},{"permission":"upgrade","target":"0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"},{"permission":"upgrade","target":"0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"},{"permission":"upgrade","target":"0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"},{"permission":"upgrade","target":"0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"},{"permission":"upgrade","target":"0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"},{"permission":"upgrade","target":"0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x39A90926306E11497EC5FE1C459910258B620edD"},{"permission":"upgrade","target":"0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"},{"permission":"upgrade","target":"0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"},{"permission":"upgrade","target":"0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"},{"permission":"upgrade","target":"0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"},{"permission":"upgrade","target":"0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"}]
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0:
+        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x39A90926306E11497EC5FE1C459910258B620edD","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]}
      receivedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"
      receivedPermissions.0.via:
+        [{"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"}]
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0:
+        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0:
+        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.1.via.0:
+        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0:
+        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0:
+        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"
+        "0x2C73A1610EE822a8C2C21eddd455e725A3334c8C"
      issuedPermissions.0.via.0:
+        {"address":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","delay":0}
    }
```

Generated with discovered.json: 0x3f448a1004da8a7e85c2c937082324d3b3d48b0c

# Diff at Fri, 30 Aug 2024 07:54:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.7.via:
-        []
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
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x6f69afbe929e4922a1daebdd08d10f96692d349f

# Diff at Fri, 23 Aug 2024 09:53:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        5
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xc841c07a00b94e5eeb64d917f521e11a54d87d69

# Diff at Wed, 21 Aug 2024 10:04:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","0x39A90926306E11497EC5FE1C459910258B620edD","0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c","0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"],"configure":["0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x2C73A1610EE822a8C2C21eddd455e725A3334c8C","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C","via":[]},{"permission":"upgrade","target":"0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","via":[]},{"permission":"upgrade","target":"0x39A90926306E11497EC5FE1C459910258B620edD","via":[]},{"permission":"upgrade","target":"0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","via":[]},{"permission":"upgrade","target":"0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","via":[]},{"permission":"upgrade","target":"0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","via":[]},{"permission":"upgrade","target":"0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c","via":[]},{"permission":"upgrade","target":"0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE","via":[]},{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x161aF05fA6BdA1c6E7Ee12839d470931bA796948","via":[]}]
    }
```

Generated with discovered.json: 0x13c87f5e742ef7b13b3fd84548ba0e227dea1bc0

# Diff at Fri, 09 Aug 2024 12:01:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.6:
-        "0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"
+        "0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"
      assignedPermissions.upgrade.5:
-        "0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"
+        "0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"
      assignedPermissions.upgrade.4:
-        "0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"
+        "0xAFc9946b25e3e93208b7E2D477680C5B6e2952be"
      assignedPermissions.upgrade.3:
-        "0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"
+        "0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9"
      assignedPermissions.upgrade.2:
-        "0x39A90926306E11497EC5FE1C459910258B620edD"
+        "0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"
      assignedPermissions.upgrade.1:
-        "0x5e8d351FD046Aa0b3DDA24096751996C0c397C61"
+        "0x39A90926306E11497EC5FE1C459910258B620edD"
    }
```

Generated with discovered.json: 0xf5a0937c9179cbd4a83ed83ac1fe9eae6e56a737

# Diff at Fri, 09 Aug 2024 10:11:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20427351
- current block number: 20427351

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20427351 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","0x39A90926306E11497EC5FE1C459910258B620edD","0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c","0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5"]
      assignedPermissions.owner:
-        ["0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"]
      assignedPermissions.upgrade:
+        ["0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1","0x5e8d351FD046Aa0b3DDA24096751996C0c397C61","0x39A90926306E11497EC5FE1C459910258B620edD","0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5","0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9","0xAFc9946b25e3e93208b7E2D477680C5B6e2952be","0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c"]
      assignedPermissions.configure:
+        ["0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C"]
    }
```

```diff
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C) {
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"]
      assignedPermissions.configure:
+        ["0x161aF05fA6BdA1c6E7Ee12839d470931bA796948"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xb6130283Ed292E3f42465617d6d8FFd61F615462","0xe30FD2f41326d500f5071440546643d9A7926e63","0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb6130283Ed292E3f42465617d6d8FFd61F615462","0xe30FD2f41326d500f5071440546643d9A7926e63","0xd01De08Cc118Cc1a1b39c54c8b4ff02A8ADE63eE"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x207f322d908c7a5b5b1951e19c4120f60fa25e00

# Diff at Wed, 31 Jul 2024 15:12:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20427351

## Description

Initial discovery: OP stack rollup with superchain fork.

## Initial discovery

```diff
+   Status: CREATED
    contract AddressManager (0x039A3B4AF85A91626f428b8B881603b6DD1f6C4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x03D5bc58E7b7E13ba785F67AFA2d2fC49cB2BdF3)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x161aF05fA6BdA1c6E7Ee12839d470931bA796948)
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x1adE86B9cc8a50Db747b7aaC32E8527d42c71fC1)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract Optopia Multisig (0x2C73A1610EE822a8C2C21eddd455e725A3334c8C)
    +++ description: It can act on behalf of 0x161aF05fA6BdA1c6E7Ee12839d470931bA796948, inheriting its permissions.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x39A90926306E11497EC5FE1C459910258B620edD)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x5e8d351FD046Aa0b3DDA24096751996C0c397C61)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x94118F86eE37Fa4Fdb266CDab1e55B8F0D6959D9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xAFc9946b25e3e93208b7E2D477680C5B6e2952be)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract  (0xB77d3ea899ef38c464e19F5A6CBc5a37187DC43c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xdd80E05004f40815EaEf12ffeE69c2a8A5112aA5)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```
