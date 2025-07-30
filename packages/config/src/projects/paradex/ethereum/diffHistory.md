Generated with discovered.json: 0x5ac3cef67b11bc2cd37a6af48bfe2ff0f037c5a5

# Diff at Mon, 14 Jul 2025 12:45:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22615702
- current block number: 22615702

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615702 (main branch discovery), not current.

```diff
    contract Paradex Multisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      address:
-        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
+        "eth:0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "eth:0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.$members.1:
-        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
+        "eth:0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
      values.$members.2:
-        "0x804d60CB1ade94511f7915A2062948685Ca8C81f"
+        "eth:0x804d60CB1ade94511f7915A2062948685Ca8C81f"
      values.$members.3:
-        "0xBF6aAc7Ae78B351180AD42b3dc5087eAd886B4A6"
+        "eth:0xBF6aAc7Ae78B351180AD42b3dc5087eAd886B4A6"
      values.$members.4:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "eth:0x59232aC80E6d403b6381393e52f4665ECA328558"
      implementationNames.0x0a64d3D7747549aF6d65C225D56ac8f71e436B93:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x0a64d3D7747549aF6d65C225D56ac8f71e436B93:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x2871B956bC19D25961E9a7519f32D7fDaA21B403) {
    +++ description: None
      address:
-        "0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
+        "eth:0x2871B956bC19D25961E9a7519f32D7fDaA21B403"
    }
```

```diff
    EOA  (0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512) {
    +++ description: None
      address:
-        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
+        "eth:0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
    }
```

```diff
    EOA  (0x64F4396bb0669C72858Cc50C779b48EB25F45770) {
    +++ description: None
      address:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "eth:0x64F4396bb0669C72858Cc50C779b48EB25F45770"
    }
```

```diff
    EOA  (0x661B48092a5af3F8d5B551D66f5B3F639deD3155) {
    +++ description: None
      address:
-        "0x661B48092a5af3F8d5B551D66f5B3F639deD3155"
+        "eth:0x661B48092a5af3F8d5B551D66f5B3F639deD3155"
    }
```

```diff
    EOA  (0x804d60CB1ade94511f7915A2062948685Ca8C81f) {
    +++ description: None
      address:
-        "0x804d60CB1ade94511f7915A2062948685Ca8C81f"
+        "eth:0x804d60CB1ade94511f7915A2062948685Ca8C81f"
    }
```

```diff
    EOA  (0x94d5dc7c96Eb6176783787669571970C7ba43e01) {
    +++ description: None
      address:
-        "0x94d5dc7c96Eb6176783787669571970C7ba43e01"
+        "eth:0x94d5dc7c96Eb6176783787669571970C7ba43e01"
    }
```

```diff
    EOA  (0xBF6aAc7Ae78B351180AD42b3dc5087eAd886B4A6) {
    +++ description: None
      address:
-        "0xBF6aAc7Ae78B351180AD42b3dc5087eAd886B4A6"
+        "eth:0xBF6aAc7Ae78B351180AD42b3dc5087eAd886B4A6"
    }
```

```diff
    EOA  (0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2) {
    +++ description: None
      address:
-        "0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2"
+        "eth:0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2"
    }
```

```diff
    EOA  (0xdaA9c7160E33d7c5C7D292f452c074Ec60f5C199) {
    +++ description: None
      address:
-        "0xdaA9c7160E33d7c5C7D292f452c074Ec60f5C199"
+        "eth:0xdaA9c7160E33d7c5C7D292f452c074Ec60f5C199"
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 0% of the locked funds per 24 hours.
      address:
-        "0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
+        "eth:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
+++ description: NOT the same as the `GOVERNANCE_ADMIN` access control role (see implementation) but managed by it.
+++ severity: HIGH
      values.$admin:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.$implementation:
-        "0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
+        "eth:0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
      values.$pastUpgrades.0.2.0:
-        "0x6Fd62239f3A441d1898683C5a84ce3681bB42C16"
+        "eth:0x6Fd62239f3A441d1898683C5a84ce3681bB42C16"
      values.$pastUpgrades.1.2.0:
-        "0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
+        "eth:0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
      values.$pastUpgrades.2.2.0:
-        "0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
+        "eth:0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
      values.$pastUpgrades.3.2.0:
-        "0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
+        "eth:0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
      values.accessControl.GOVERNANCE_ADMIN.members.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.APP_GOVERNOR.members.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.APP_ROLE_ADMIN.members.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.TOKEN_ADMIN.members.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.UPGRADE_GOVERNOR.members.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.SECURITY_ADMIN.members.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.SECURITY_AGENT.members.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.bridgedToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.depositorAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: This role is not the proxy upgrade admin role, but can assign / remove the proxy upgrader role (governor) via the `GovernanceAdminOnly` modifier in the implementation.
      values.govAdminAC.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.implementation:
-        "0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
+        "eth:0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
      values.l2TokenContract:
-        "0x311d3706Ce8A7d337Bcb67Cd53b0ED7b019C6353"
+        "eth:0x311d3706Ce8A7d337Bcb67Cd53b0ED7b019C6353"
      values.manager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.messagingContract:
-        "0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
+        "eth:0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
      values.secAdminAC.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAgentAC.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      implementationNames.0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3:
-        "Proxy"
      implementationNames.0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77:
-        "StarknetERC20Bridge"
      implementationNames.eth:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3:
+        "Proxy"
      implementationNames.eth:0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77:
+        "StarknetERC20Bridge"
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      address:
-        "0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
+        "eth:0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
+++ description: Permissioned to upgrade the proxy implementation and access `onlyGovernance` restricted calls.
+++ severity: HIGH
      values.$admin:
-        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
+        "eth:0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
      values.$implementation:
-        "0x2793010E6711Acd5C46ed17f2183a9d58db71e04"
+        "eth:0x2793010E6711Acd5C46ed17f2183a9d58db71e04"
      values.$pastUpgrades.0.2.0:
-        "0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"
+        "eth:0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"
      values.$pastUpgrades.1.2.0:
-        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
+        "eth:0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      values.$pastUpgrades.2.2.0:
-        "0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"
+        "eth:0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"
      values.$pastUpgrades.3.2.0:
-        "0x2793010E6711Acd5C46ed17f2183a9d58db71e04"
+        "eth:0x2793010E6711Acd5C46ed17f2183a9d58db71e04"
      values.feeCollector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x2793010E6711Acd5C46ed17f2183a9d58db71e04"
+        "eth:0x2793010E6711Acd5C46ed17f2183a9d58db71e04"
      values.operators.0:
-        "0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2"
+        "eth:0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2"
      values.verifier:
-        "0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
+        "eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60"
      implementationNames.0xF338cad020D506e8e3d9B4854986E0EcE6C23640:
-        "Proxy"
      implementationNames.0x2793010E6711Acd5C46ed17f2183a9d58db71e04:
-        "Starknet"
      implementationNames.eth:0xF338cad020D506e8e3d9B4854986E0EcE6C23640:
+        "Proxy"
      implementationNames.eth:0x2793010E6711Acd5C46ed17f2183a9d58db71e04:
+        "Starknet"
    }
```

```diff
    EOA  (0xfF206f46453A9dd8e1664532788f4987c15B937d) {
    +++ description: None
      address:
-        "0xfF206f46453A9dd8e1664532788f4987c15B937d"
+        "eth:0xfF206f46453A9dd8e1664532788f4987c15B937d"
    }
```

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      address:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0xdaA9c7160E33d7c5C7D292f452c074Ec60f5C199"
+        "eth:0xdaA9c7160E33d7c5C7D292f452c074Ec60f5C199"
      values.$members.1:
-        "0xfF206f46453A9dd8e1664532788f4987c15B937d"
+        "eth:0xfF206f46453A9dd8e1664532788f4987c15B937d"
      values.$members.2:
-        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
+        "eth:0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
      values.$members.3:
-        "0x94d5dc7c96Eb6176783787669571970C7ba43e01"
+        "eth:0x94d5dc7c96Eb6176783787669571970C7ba43e01"
      values.$members.4:
-        "0x661B48092a5af3F8d5B551D66f5B3F639deD3155"
+        "eth:0x661B48092a5af3F8d5B551D66f5B3F639deD3155"
      implementationNames.0xFF57A3bB6465501c993acF8f3b29125a862661C0:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0xFF57A3bB6465501c993acF8f3b29125a862661C0:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
+   Status: CREATED
    contract Paradex Multisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93)
    +++ description: None
```

```diff
+   Status: CREATED
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3)
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 0% of the locked funds per 24 hours.
```

```diff
+   Status: CREATED
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640)
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
```

```diff
+   Status: CREATED
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0)
    +++ description: None
```

Generated with discovered.json: 0x700957dd46ee6b1092cee792ff3594c6547c0538

# Diff at Fri, 04 Jul 2025 12:19:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615702
- current block number: 22615702

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615702 (main branch discovery), not current.

```diff
    contract Paradex Multisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
+        "eth:0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
      receivedPermissions.1.from:
-        "ethereum:0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
+        "eth:0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
    }
```

```diff
    EOA  (0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
+        "eth:0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
    }
```

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
+        "eth:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
      receivedPermissions.1.from:
-        "ethereum:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
+        "eth:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
      receivedPermissions.2.from:
-        "ethereum:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
+        "eth:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
      receivedPermissions.3.from:
-        "ethereum:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
+        "eth:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"
    }
```

Generated with discovered.json: 0x06b8cb02e67eafa4cb374a7cf3e36f0be8d2ff96

# Diff at Mon, 02 Jun 2025 08:07:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22517899
- current block number: 22615702

## Description

multisig signer change.

## Watched changes

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      values.$members.5:
-        "0xfF206f46453A9dd8e1664532788f4987c15B937d"
      values.$members.4:
-        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
+        "0xfF206f46453A9dd8e1664532788f4987c15B937d"
      values.$members.3:
-        "0xdaA9c7160E33d7c5C7D292f452c074Ec60f5C199"
+        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
      values.$members.2:
-        "0x921D35Fc5e1667741c9f3af0303e29b8aB3dC79B"
+        "0xdaA9c7160E33d7c5C7D292f452c074Ec60f5C199"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xf6ef8c26f5df719343c2ab5716cb64bd279d3fc8

# Diff at Fri, 23 May 2025 09:41:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22517899
- current block number: 22517899

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22517899 (main branch discovery), not current.

```diff
    contract Paradex Multisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    EOA  (0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2) {
    +++ description: None
      receivedPermissions.0.role:
+        ".operators"
    }
```

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.description:
+        "disable the withdrawal limit and manage the security agent role that can enable it."
      receivedPermissions.3.role:
+        ".secAdminAC"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.2.description:
-        "disable the withdrawal limit and manage the security agent role that can enable it."
      receivedPermissions.2.role:
+        ".$admin"
      receivedPermissions.1.role:
+        ".govAdminAC"
      receivedPermissions.0.role:
+        ".secAgentAC"
    }
```

Generated with discovered.json: 0xf7ad29432de7c8c023f91d04532287efa3f3de15

# Diff at Mon, 19 May 2025 15:28:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2ba4be7822b161a6616bac837b3f7f03225f5cb9 block: 22467133
- current block number: 22517899

## Description

Upgrade USDC Bridge to change withdrawal limit: now 0% meaning enabling the withdrawal limit pauses withdrawals.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 0% of the locked funds per 24 hours.
      description:
-        "Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours."
+        "Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 0% of the locked funds per 24 hours."
      values.$pastUpgrades.3:
+        ["2025-05-16T18:05:23.000Z","0x6df9f1b6e2fe53f2ea980ff4908aca6e43dc77e17cfdb869c67e4879c49eabf2",["0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"]]
      values.$upgradeCount:
-        3
+        4
      values.accessControl.APP_ROLE_ADMIN.members.1:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.APP_ROLE_ADMIN.members.0:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.SECURITY_ADMIN.members.0:
-        "0x0000000000000000000000000000000000000020"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.SECURITY_AGENT.members.0:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAdminAC.0:
-        "0x0000000000000000000000000000000000000020"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAgentAC.0:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+++ description: The withdrawal limit in percent of locked funds per 24 hours. This value is immutable and needs an implementation upgrade to be changed.
      values.withdrawLimitPct:
-        5
+        0
    }
```

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      values.$members.5:
+        "0xfF206f46453A9dd8e1664532788f4987c15B937d"
      values.$members.4:
-        "0xfF206f46453A9dd8e1664532788f4987c15B937d"
+        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
      values.$members.3:
-        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
+        "0xdaA9c7160E33d7c5C7D292f452c074Ec60f5C199"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"}
      receivedPermissions.2:
+        {"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"disable the withdrawal limit and manage the security agent role that can enable it."}
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.description:
+        "manage critical access control roles related to upgrades and set the proxy governor that can upgrade the implementation."
      receivedPermissions.0.description:
-        "manage critical access control roles related to upgrades and set the proxy governor that can upgrade the implementation."
+        "enable the withdrawal limit."
    }
```

Generated with discovered.json: 0x4fb9c8d6725ebbb01ac220ea9e445c77c4f32c38

# Diff at Wed, 14 May 2025 11:06:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@03d2420745f9fd123e05c87dd48abe70f160c805 block: 22467133
- current block number: 22467133

## Description

Config: cleaned starknet templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22467133 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000020) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"disable the withdrawal limit and manage the security agent role that can enable it."}]
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      values.secAdminAC.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "0x0000000000000000000000000000000000000020"
      values.secAgentAC.0:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      fieldMeta.govAdminAC.description:
-        "This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation."
+        "This role is not the proxy upgrade admin role, but can assign / remove the proxy upgrader role (governor) via the `GovernanceAdminOnly` modifier in the implementation."
    }
```

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      receivedPermissions.3:
-        {"permission":"upgrade","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"}
      receivedPermissions.2:
-        {"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"disable the withdrawal limit."}
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.description:
-        "enable the withdrawal limit."
      receivedPermissions.0.description:
-        "manage critical access control roles and the role that can upgrade the implementation."
+        "manage critical access control roles related to upgrades and set the proxy governor that can upgrade the implementation."
    }
```

Generated with discovered.json: 0xeb920aa3ac64f1a9fcc2dcdd8f359c14bee22356

# Diff at Mon, 12 May 2025 12:14:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43865580b95b7ff3abb4f43944aed50cc5d69ee3 block: 22397521
- current block number: 22467133

## Description

MS member change.

## Watched changes

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      values.$members.3:
-        "0xFE5956a7cD804b93379DE807cB0BE8D0Ad0Cb571"
+        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
      values.$members.2:
-        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
+        "0x921D35Fc5e1667741c9f3af0303e29b8aB3dC79B"
      values.$members.1:
-        "0x921D35Fc5e1667741c9f3af0303e29b8aB3dC79B"
+        "0x94d5dc7c96Eb6176783787669571970C7ba43e01"
    }
```

Generated with discovered.json: 0x0c5aea8beabb3eb8b22ae0629db8e3878028313b

# Diff at Fri, 02 May 2025 17:24:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22337719
- current block number: 22397521

## Description

MS signer change.

## Watched changes

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      values.$members.4:
-        "0xFE5956a7cD804b93379DE807cB0BE8D0Ad0Cb571"
+        "0xfF206f46453A9dd8e1664532788f4987c15B937d"
      values.$members.3:
-        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
+        "0xFE5956a7cD804b93379DE807cB0BE8D0Ad0Cb571"
      values.$members.2:
-        "0x921D35Fc5e1667741c9f3af0303e29b8aB3dC79B"
+        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
      values.$members.1:
-        "0x31fB42E93b573F1e84a51Cc1a5792e3D63FDE7A6"
+        "0x921D35Fc5e1667741c9f3af0303e29b8aB3dC79B"
    }
```

Generated with discovered.json: 0x6bc586b180876a779af071c9eedc453ec076dd92

# Diff at Tue, 29 Apr 2025 08:19:08 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22337719
- current block number: 22337719

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22337719 (main branch discovery), not current.

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      issuedPermissions:
-        [{"permission":"interact","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","description":"disable the withdrawal limit.","via":[]},{"permission":"interact","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","description":"enable the withdrawal limit.","via":[]},{"permission":"interact","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","description":"manage critical access control roles and the role that can upgrade the implementation.","via":[]},{"permission":"upgrade","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","via":[]}]
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions:
-        [{"permission":"governStarknet","to":"0x0a64d3D7747549aF6d65C225D56ac8f71e436B93","via":[]},{"permission":"operateStarknet","to":"0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2","via":[]},{"permission":"upgrade","to":"0x0a64d3D7747549aF6d65C225D56ac8f71e436B93","via":[]}]
    }
```

Generated with discovered.json: 0xa5acd8e953e44b424458f0e539f3d1c0e0e37f68

# Diff at Thu, 24 Apr 2025 08:36:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f3ec8b7fe4d902b94844aa2f7ddfb2affe4f3f61 block: 22297523
- current block number: 22337719

## Description

Gov updated, EOA upgrader removed.

## Watched changes

```diff
    contract undefined (0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"}]
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","via":[]}
      issuedPermissions.3.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.3.description:
-        "disable the withdrawal limit."
      issuedPermissions.2.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.2.to:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      issuedPermissions.2.description:
+        "disable the withdrawal limit."
+++ description: NOT the same as the `GOVERNANCE_ADMIN` access control role (see implementation) but managed by it.
+++ severity: HIGH
      values.$admin:
-        ["0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","0xFF57A3bB6465501c993acF8f3b29125a862661C0"]
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
    }
```

Generated with discovered.json: 0x89caf88c44bb5e49c837e20db90c1af5dee5a3a2

# Diff at Fri, 18 Apr 2025 17:58:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1dee5bc960c23f20e33ad3548023a46f9d9c2128 block: 22281682
- current block number: 22297523

## Description

signer changes in the governing MSigs, USDC bridge still EOA-governed though.

## Watched changes

```diff
    contract undefined (0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c) {
    +++ description: None
      receivedPermissions.3:
-        {"permission":"upgrade","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"}
      receivedPermissions.2:
-        {"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"disable the withdrawal limit."}
      receivedPermissions.1:
-        {"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"enable the withdrawal limit."}
      receivedPermissions.0.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.0.description:
-        "manage critical access control roles and the role that can upgrade the implementation."
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      issuedPermissions.6:
-        {"permission":"interact","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","description":"disable the withdrawal limit.","via":[]}
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","via":[]}
      issuedPermissions.4.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.4.description:
-        "enable the withdrawal limit."
      issuedPermissions.3.to:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      issuedPermissions.2.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.2.to:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      issuedPermissions.2.description:
-        "manage critical access control roles and the role that can upgrade the implementation."
      issuedPermissions.1.to:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      issuedPermissions.0.to:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+++ description: NOT the same as the `GOVERNANCE_ADMIN` access control role (see implementation) but managed by it.
+++ severity: HIGH
      values.$admin:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        ["0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","0xFF57A3bB6465501c993acF8f3b29125a862661C0"]
      values.accessControl.GOVERNANCE_ADMIN.members.1:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.GOVERNANCE_ADMIN.members.0:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.TOKEN_ADMIN.members.0:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+++ description: This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation.
      values.govAdminAC.1:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+++ description: This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation.
      values.govAdminAC.0:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAdminAC.1:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAdminAC.0:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAgentAC.1:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAgentAC.0:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
    }
```

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3"}
      values.$members.5:
-        "0xFE5956a7cD804b93379DE807cB0BE8D0Ad0Cb571"
      values.$members.4:
-        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
+        "0xFE5956a7cD804b93379DE807cB0BE8D0Ad0Cb571"
      values.$members.3:
-        "0x921D35Fc5e1667741c9f3af0303e29b8aB3dC79B"
+        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
      values.$members.2:
-        "0xd123e24C318a14BaF01f487d59D8Ce3F8E1aeE5C"
+        "0x921D35Fc5e1667741c9f3af0303e29b8aB3dC79B"
      values.multisigThreshold:
-        "3 of 6 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xfa1a198116bb60f60bdd28e2356a011725028810

# Diff at Wed, 16 Apr 2025 12:53:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@db872d8b788e204aeb64e983eeb7178891d61d76 block: 22243995
- current block number: 22281682

## Description

EOA removed from main contract, now 'only' present in the main bridge.

## Watched changes

```diff
    contract undefined (0x0000000000000000000000000000000000000020) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"disable the withdrawal limit."},{"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"enable the withdrawal limit."},{"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"manage critical access control roles and the role that can upgrade the implementation."}]
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      issuedPermissions.9:
-        {"permission":"interact","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","description":"disable the withdrawal limit.","via":[]}
      issuedPermissions.8:
-        {"permission":"upgrade","to":"0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","via":[]}
      issuedPermissions.7:
-        {"permission":"interact","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","description":"enable the withdrawal limit.","via":[]}
      issuedPermissions.6.to:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      issuedPermissions.5.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.5.to:
-        "0x0000000000000000000000000000000000000020"
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      issuedPermissions.5.description:
-        "disable the withdrawal limit."
      issuedPermissions.4.description:
-        "manage critical access control roles and the role that can upgrade the implementation."
+        "enable the withdrawal limit."
      issuedPermissions.3.description:
-        "enable the withdrawal limit."
+        "disable the withdrawal limit."
      issuedPermissions.2.to:
-        "0x0000000000000000000000000000000000000020"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      issuedPermissions.2.description:
-        "enable the withdrawal limit."
+        "manage critical access control roles and the role that can upgrade the implementation."
      issuedPermissions.1.description:
-        "manage critical access control roles and the role that can upgrade the implementation."
+        "enable the withdrawal limit."
      issuedPermissions.0.to:
-        "0x0000000000000000000000000000000000000020"
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      values.accessControl.GOVERNANCE_ADMIN.members.2:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.GOVERNANCE_ADMIN.members.1:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.GOVERNANCE_ADMIN.members.0:
-        "0x0000000000000000000000000000000000000020"
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      values.accessControl.SECURITY_ADMIN.members.1:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+++ description: This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation.
      values.govAdminAC.2:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+++ description: This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation.
      values.govAdminAC.1:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+++ description: This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation.
      values.govAdminAC.0:
-        "0x0000000000000000000000000000000000000020"
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      values.secAdminAC.2:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAdminAC.1:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAdminAC.0:
-        "0x0000000000000000000000000000000000000020"
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      values.secAgentAC.2:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAgentAC.1:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAgentAC.0:
-        "0x0000000000000000000000000000000000000020"
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.4:
-        {"permission":"operateStarknet","to":"0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2","via":[]}
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f","via":[]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "operateStarknet"
      issuedPermissions.2.to:
-        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
+        "0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2"
      issuedPermissions.1.permission:
-        "governStarknet"
+        "upgrade"
      issuedPermissions.1.to:
-        "0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f"
+        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
+++ description: Permissioned to upgrade the proxy implementation and access `onlyGovernance` restricted calls.
+++ severity: HIGH
      values.$admin:
-        ["0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f","0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"]
+        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
    }
```

Generated with discovered.json: 0x07b676fed79eb1ff46c9d1cfc6e03967919be842

# Diff at Fri, 11 Apr 2025 06:46:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22231621
- current block number: 22243995

## Description

MS signer changes.

## Watched changes

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      values.$members.5:
+        "0xFE5956a7cD804b93379DE807cB0BE8D0Ad0Cb571"
      values.$members.4:
-        "0xFE5956a7cD804b93379DE807cB0BE8D0Ad0Cb571"
+        "0x3552F50fFe9517d8c6913992F3d4bA8030Ca1512"
      values.multisigThreshold:
-        "3 of 5 (60%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0xc7b1f536b4e947a2b2af7a716168edbc6347c230

# Diff at Thu, 10 Apr 2025 14:42:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22231621
- current block number: 22231621

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22231621 (main branch discovery), not current.

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      displayName:
-        "Starknet"
    }
```

Generated with discovered.json: 0xf1a5d592dc1b70cb25ca4b2419644a258d2c0a0d

# Diff at Wed, 09 Apr 2025 13:23:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@45b707d5b88f76d72dd5f8252dbef76321c2f829 block: 22208553
- current block number: 22231621

## Description

Upgrade to latest SN stack contracts (includes programHash).

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      sourceHashes.1:
-        "0x2738adbe41339934ae57e5c96fb9d7e42a43ba2b112878bc9227cc1c81de8ee6"
+        "0x8074e96abc7cacf654908c0111c69027cf599f3b67332f3680c5de768a2d6dfe"
      values.$implementation:
-        "0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"
+        "0x2793010E6711Acd5C46ed17f2183a9d58db71e04"
      values.$pastUpgrades.3:
+        ["2023-07-20T11:05:35.000Z","0x7862f09db4097dc43ad1972ca9ee11eaf64a1fbfdb21fe6f84ad6b68d4b9fa56",["0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"]]
      values.$pastUpgrades.2.2:
-        "2023-07-20T11:05:35.000Z"
+        "2025-04-07T20:04:59.000Z"
      values.$pastUpgrades.2.1:
-        "0x7862f09db4097dc43ad1972ca9ee11eaf64a1fbfdb21fe6f84ad6b68d4b9fa56"
+        ["0x2793010E6711Acd5C46ed17f2183a9d58db71e04"]
      values.$pastUpgrades.2.0:
-        ["0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"]
+        "0x63d55b2c0cfa3b1866e99b66c6632e5474e177ce0e3b5d5b68ed8b801d76cc53"
      values.$upgradeCount:
-        3
+        4
      values.aggregatorHashMapped:
-        "StarkNet Aggregator (old)"
+        "Starknet Aggregator (since v0.13.4)"
      values.aggregatorProgramHash:
-        "1161178844461337253856226043908368523817098764221830529880464854589141231910"
+        "273279642033703284306509103355536170486431195329675679055627933497997642494"
      values.identify:
-        "StarkWare_Starknet_2024_9"
+        "StarkWare_Starknet_2025_10"
      values.implementation:
-        "0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"
+        "0x2793010E6711Acd5C46ed17f2183a9d58db71e04"
+++ description: The L2 programHash which is a hash of the L2 state machine logic. Liveness config MUST be changed in the .ts as soon as this is updated.
+++ severity: HIGH
      values.programHash:
-        "853638403225561750106379562222782223909906501242604214771127703946595519856"
+        "2534935718742676028234156221136000178296467523045214874259117268197132196876"
      values.programHashHistory.5:
+        "853638403225561750106379562222782223909906501242604214771127703946595519856"
      values.programHashMapped:
-        "StarkNet OS (Paradex)"
+        "2534935718742676028234156221136000178296467523045214874259117268197132196876"
      values.feeCollector:
+        "0x0000000000000000000000000000000000000000"
    }
```

## Source code changes

```diff
.../{.flat@22208553 => .flat}/Paradex/Starknet.sol | 207 ++++++++++++++++++---
 1 file changed, 176 insertions(+), 31 deletions(-)
```

Generated with discovered.json: 0x323a73c4e59a58ea7a4f67fc221fb8d9db8c4f25

# Diff at Sun, 06 Apr 2025 08:03:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 22187409
- current block number: 22208553

## Description

usdc bridge gov changes.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      values.accessControl.APP_GOVERNOR.members.1:
-        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.APP_GOVERNOR.members.0:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.APP_ROLE_ADMIN.members.1:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
    }
```

Generated with discovered.json: 0x03d3c49cc13e4aca5681486214828592274910c5

# Diff at Thu, 03 Apr 2025 09:11:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 22166267
- current block number: 22187409

## Description

Gov roles granted in the USDC bridge.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      issuedPermissions.9:
+        {"permission":"interact","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","description":"disable the withdrawal limit.","via":[]}
      issuedPermissions.8:
+        {"permission":"upgrade","to":"0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","via":[]}
      issuedPermissions.7:
+        {"permission":"interact","to":"0xFF57A3bB6465501c993acF8f3b29125a862661C0","description":"enable the withdrawal limit.","via":[]}
      issuedPermissions.6.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.6.description:
+        "disable the withdrawal limit."
      issuedPermissions.5.to:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0x0000000000000000000000000000000000000020"
      issuedPermissions.4.to:
-        "0x0000000000000000000000000000000000000020"
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      issuedPermissions.4.description:
-        "disable the withdrawal limit."
+        "manage critical access control roles and the role that can upgrade the implementation."
      values.accessControl.GOVERNANCE_ADMIN.members.2:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.accessControl.UPGRADE_GOVERNOR.members.0:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+++ description: This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation.
      values.govAdminAC.2:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAdminAC.2:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
      values.secAgentAC.2:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
    }
```

```diff
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0) {
    +++ description: None
      values.$members.4:
+        "0xFE5956a7cD804b93379DE807cB0BE8D0Ad0Cb571"
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
      receivedPermissions:
+        [{"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"disable the withdrawal limit."},{"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"enable the withdrawal limit."},{"permission":"interact","from":"0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3","description":"manage critical access control roles and the role that can upgrade the implementation."}]
    }
```

Generated with discovered.json: 0x84361864b63573b6658527d315c9d1b42f887e2c

# Diff at Mon, 31 Mar 2025 10:22:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 21979760
- current block number: 22166267

## Description

new appgovernor, max USDC balance raise.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      values.accessControl.APP_GOVERNOR.members.1:
+        "0xFF57A3bB6465501c993acF8f3b29125a862661C0"
+++ description: The maximum total balance that can be locked in the bridge.
      values.maxTotalBalance:
-        50000000000000
+        60000000000000
    }
```

```diff
+   Status: CREATED
    contract Paradex Multisig 2 (0xFF57A3bB6465501c993acF8f3b29125a862661C0)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/Paradex Multisig 2/Safe.sol     | 1088 ++++++++++++++++++++
 .../.flat/Paradex Multisig 2/SafeProxy.p.sol       |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0xd0ec5206adf2a943b0433009bacf20878d932750

# Diff at Thu, 27 Mar 2025 11:14:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21979760
- current block number: 21979760

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21979760 (main branch discovery), not current.

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      usedTypes.0.arg.2397984267054479079853548842566103781972463965746662494980785692480538410509:
-        "StarkNet OS (Starknet)"
+        "StarkNet OS (since v0.13.3)"
      usedTypes.0.arg.273279642033703284306509103355536170486431195329675679055627933497997642494:
+        "Starknet Aggregator (since v0.13.4)"
      usedTypes.0.arg.2231644845387633655859130162745748394456578773184260372693322394988769337368:
+        "StarkNet OS (since v0.13.4)"
    }
```

Generated with discovered.json: 0xcf31ec92ef38e775e8d040d58b86eba8c646b552

# Diff at Wed, 19 Mar 2025 13:05:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21979760
- current block number: 21979760

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21979760 (main branch discovery), not current.

```diff
    contract Paradex Multisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x6c824524074953d0ab51266e48e430626c1ae9f4

# Diff at Tue, 18 Mar 2025 08:13:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21979760
- current block number: 21979760

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21979760 (main branch discovery), not current.

```diff
    contract Paradex Multisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      name:
-        "ParadexAdminMultisig"
+        "Paradex Multisig"
    }
```

Generated with discovered.json: 0x912a5808e1f03b0fa842f95f8bb99f21abf3421e

# Diff at Thu, 06 Mar 2025 15:19:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21979760
- current block number: 21979760

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21979760 (main branch discovery), not current.

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      displayName:
-        "StarkExchange"
+        "Starknet"
      values.aggregatorHashMapped:
+        "StarkNet Aggregator (old)"
      values.programHashMapped:
+        "StarkNet OS (Paradex)"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"15787695375210609250491147414005894154890873413229882671403677761527504080":"Starknet Aggregator (since v0.13.3)","2397984267054479079853548842566103781972463965746662494980785692480538410509":"StarkNet OS (Starknet)","853638403225561750106379562222782223909906501242604214771127703946595519856":"StarkNet OS (Paradex)","3383082961563516565935611087683915026448707331436034043529592588079494402084":"StarkNet OS (old Paradex, old StarkNet)","3485280386001712778192330279103973322645241679001461923469191557000342180556":"StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)","770346231394331402493200980986217737662224545740427952627288191358999988146":"ApeX-USDT","3174901404014912024702042974619036870715605532092680335571201877913899936957":"StarkEx Spot v4.0 (RhinoFi, Sorare)","16830627573509542901909952446321116535677491650708854009406762893086223513":"StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)","2530337539466159944237001094809327283009177793361359619481044346150483328860":"ApeX-USDC 20250130","3114724292040200590153042023978438629733352741898912919152162079752811928849":"StarkEx Perp v2.0 ApeX-USDC","217719352201300445998518619904782191262194843262573339166404641663770051805":"StarkNet (old)","3003515909324298587247571665454372831319437787162989623104387385306791861180":"StarkNet (old)","1161178844461337253856226043908368523817098764221830529880464854589141231910":"StarkNet Aggregator (old)","1921772108187713503530008849184725638117898887391063185252422808224349294626":"StarkNet (old)","3258367057337572248818716706664617507069572185152472699066582725377748079373":"StarkNet (old)","407700941260678649793204927710478760533239334662847444187959202896452163393":"StarkNet (old)","1865367024509426979036104162713508294334262484507712987283009063059134893433":"StarkNet (old)","54878256403880350656938046611252303365750679698042371543935159963667935317":"StarkNet (old)","2479841346739966073527450029179698923866252973805981504232089731754042431018":"StarkNet (old)","109586309220455887239200613090920758778188956576212125550190099009305121410":"StarkNet (old)"}}]
    }
```

Generated with discovered.json: 0x25d429897ca9f76c0d5917833928571151ceba56

# Diff at Wed, 05 Mar 2025 11:05:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e85261cbf7cfc5afeac755b44f9df82c8a3c4ba block: 21973412
- current block number: 21979760

## Description

discodrive sn stack and starkex chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21973412 (main branch discovery), not current.

```diff
    contract ParadexAdminMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      name:
-        "ParadexImplementationGovernorMultisig"
+        "ParadexAdminMultisig"
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours.
      issuedPermissions.6:
+        {"permission":"upgrade","to":"0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","via":[]}
      issuedPermissions.5:
+        {"permission":"interact","to":"0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","description":"manage critical access control roles and the role that can upgrade the implementation.","via":[]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","description":"enable the withdrawal limit.","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","description":"disable the withdrawal limit.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x0000000000000000000000000000000000000020","description":"manage critical access control roles and the role that can upgrade the implementation.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x0000000000000000000000000000000000000020","description":"enable the withdrawal limit.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+        "0x0000000000000000000000000000000000000020"
      issuedPermissions.0.description:
+        "disable the withdrawal limit."
      values.governors:
-        ["0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"]
      values.bridgedToken:
+        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.depositorAddress:
+        "0x0000000000000000000000000000000000000000"
+++ description: Token status managed by the Manager. Only affects deposits.
+++ severity: HIGH
      values.depositStatus:
+        "active"
      values.estimateDepositFeeWei:
+        100000000000000
      values.estimateEnrollmentFeeWei:
+        500000000000000
+++ description: This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation.
      values.govAdminAC:
+        ["0x0000000000000000000000000000000000000020","0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"]
      values.l2TokenContract:
+        "0x311d3706Ce8A7d337Bcb67Cd53b0ED7b019C6353"
      values.manager:
+        "0x0000000000000000000000000000000000000000"
      values.messagingContract:
+        "0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
      values.secAdminAC:
+        ["0x0000000000000000000000000000000000000020","0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"]
      values.secAgentAC:
+        ["0x0000000000000000000000000000000000000020","0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"]
+++ description: inactive: withdrawals are not limited, any number: withdrawals are limited and the number is the intraday allowance that is left.
+++ severity: HIGH
      values.withdrawalLimitStatus:
+        "inactive"
+++ description: The withdrawal limit in percent of locked funds per 24 hours. This value is immutable and needs an implementation upgrade to be changed.
      values.withdrawLimitPct:
+        5
      fieldMeta.maxTotalBalance.severity:
-        "MEDIUM"
      fieldMeta.maxTotalBalance.description:
-        "Maximum bridge balance allowed (currentBalance + depositAmount <= maxTotalBalance)"
+        "The maximum total balance that can be locked in the bridge."
      fieldMeta.maxTotalBalance.type:
-        "RISK_PARAMETER"
      fieldMeta.$admin:
+        {"severity":"HIGH","description":"NOT the same as the `GOVERNANCE_ADMIN` access control role (see implementation) but managed by it."}
      fieldMeta.withdrawalLimitStatus:
+        {"severity":"HIGH","description":"inactive: withdrawals are not limited, any number: withdrawals are limited and the number is the intraday allowance that is left."}
      fieldMeta.depositStatus:
+        {"severity":"HIGH","description":"Token status managed by the Manager. Only affects deposits."}
      fieldMeta.withdrawLimitPct:
+        {"description":"The withdrawal limit in percent of locked funds per 24 hours. This value is immutable and needs an implementation upgrade to be changed."}
      fieldMeta.accessControl:
+        {"severity":"HIGH","description":"Access control map of the contract. The individual (pickRoleMembers) permissions need to be added if a new role becomes active."}
      fieldMeta.govAdminAC:
+        {"description":"This role is not the proxy upgrade admin role, but can assign / remove it via the `GovernanceAdminOnly` modifier or as a role admin in the implementation."}
      template:
+        "starknet/StarknetERC20Bridge"
      description:
+        "Standard Starkware bridge escrow (single token). Withdrawals can be throttled to 5% of the locked funds per 24 hours."
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0":"unknown","1":"pending","2":"active","3":"deactivated"}},{"typeCaster":"Mapping","arg":{"115792089237316195423570985008687907853269984665640564039457584007913129639935":"inactive"}}]
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      description:
-        "Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message. Critical configuration values for the L2's logic are defined here by various governance roles."
+        "Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles."
      values.governors:
-        ["0x8Cef438c3e363e15F9619e32D9b5D04ff777D670","0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"]
      fieldMeta.isFinalized.description:
-        "Finalizes most of the configuration of the Starknet contract, which cannot be changed afterwards (only thorugh an upgrade)."
+        "Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade)."
      displayName:
+        "StarkExchange"
    }
```

Generated with discovered.json: 0xe78246ec0e1cf3a12468e99d0ad4f6cdb7bd7406

# Diff at Tue, 04 Mar 2025 12:05:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@40abad0e9dad8439d751a811eb767233c5a70a2f block: 21629810
- current block number: 21973412

## Description

config related: starknet discodrive.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629810 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      severity:
+        "HIGH"
      sinceBlock:
+        18927365
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      sinceBlock:
+        17939980
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.1.to:
-        "0x8Cef438c3e363e15F9619e32D9b5D04ff777D670"
+        "0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f"
      fieldMeta.$admin:
+        {"severity":"HIGH","description":"Permissioned to upgrade the proxy implementation and access `onlyGovernance` restricted calls."}
      sinceBlock:
+        17733931
    }
```

Generated with discovered.json: 0xbb762d1a259a23cacb05fde683e76c251e76ffab

# Diff at Sat, 01 Mar 2025 11:44:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a345eaeb3dc1d9d41bdaf608eb366f7f0aae874a block: 21629810
- current block number: 21629810

## Description

config related: renamed some starknet contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629810 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"0xF338cad020D506e8e3d9B4854986E0EcE6C23640"}
      receivedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message. Critical configuration values for the L2's logic are defined here by various governance roles.
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f","via":[]}
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0x0a64d3D7747549aF6d65C225D56ac8f71e436B93","via":[]}
      issuedPermissions.2:
+        {"permission":"operateStarknet","to":"0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "governStarknet"
      issuedPermissions.1.to:
-        "0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f"
+        "0x8Cef438c3e363e15F9619e32D9b5D04ff777D670"
      issuedPermissions.0.permission:
-        "upgrade"
+        "governStarknet"
      values.programHashHistory:
+        ["3258367057337572248818716706664617507069572185152472699066582725377748079373","54878256403880350656938046611252303365750679698042371543935159963667935317","2479841346739966073527450029179698923866252973805981504232089731754042431018","109586309220455887239200613090920758778188956576212125550190099009305121410","3383082961563516565935611087683915026448707331436034043529592588079494402084"]
      fieldMeta.isFinalized:
+        {"severity":"HIGH","description":"Finalizes most of the configuration of the Starknet contract, which cannot be changed afterwards (only thorugh an upgrade)."}
      template:
+        "starknet/Starknet"
      description:
+        "Central rollup contract. Receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message. Critical configuration values for the L2's logic are defined here by various governance roles."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x08f2405e39c2fde28e5ea36d7df05f468ff6a9ef

# Diff at Mon, 20 Jan 2025 11:09:53 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21629810
- current block number: 21629810

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629810 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
      receivedPermissions.0.from:
+        "0xF338cad020D506e8e3d9B4854986E0EcE6C23640"
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      issuedPermissions.0.to:
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      issuedPermissions.1.target:
-        "0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f"
      issuedPermissions.1.to:
+        "0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f"
      issuedPermissions.0.target:
-        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
      issuedPermissions.0.to:
+        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
    }
```

Generated with discovered.json: 0x550dea5c3e912345157a92bde5f3591ea6c43999

# Diff at Mon, 20 Jan 2025 09:25:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21629810
- current block number: 21629810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629810 (main branch discovery), not current.

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      fieldMeta.maxTotalBalance.type:
+        "RISK_PARAMETER"
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      fieldMeta.programHash.type:
+        "CODE_CHANGE"
    }
```

Generated with discovered.json: 0x6d126dc7b8a43e5c366fbdb3785e8bc0ef5d5754

# Diff at Wed, 15 Jan 2025 12:14:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 20711342
- current block number: 21629810

## Description

Bridging limit increased to 50M USDC.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
+++ description: Maximum bridge balance allowed (currentBalance + depositAmount <= maxTotalBalance)
+++ severity: MEDIUM
      values.maxTotalBalance:
-        30000000000000
+        50000000000000
    }
```

Generated with discovered.json: 0x44ab48f71bfdcd945a79d579c492d972aa6299e6

# Diff at Mon, 21 Oct 2024 11:08:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20711342
- current block number: 20711342

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711342 (main branch discovery), not current.

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"]
      values.$pastUpgrades.2.1:
-        ["0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"]
+        "0x7288e6bd014f04b9aa916599a60854eb8de2106cb95030762a2372751de95922"
      values.$pastUpgrades.1.2:
+        ["0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"]
      values.$pastUpgrades.1.1:
-        ["0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"]
+        "0x015d716fec0e72b13c6ec480a008653d2402eb0e216c3b1adcb87d13582c6a7a"
      values.$pastUpgrades.0.2:
+        ["0x6Fd62239f3A441d1898683C5a84ce3681bB42C16"]
      values.$pastUpgrades.0.1:
-        ["0x6Fd62239f3A441d1898683C5a84ce3681bB42C16"]
+        "0x25fbb19a94fb450c7254e45b992272c2d6dd6b24692e34e87052621e4df3cfed"
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"]
      values.$pastUpgrades.2.1:
-        ["0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"]
+        "0xe78b11cbf1332af60b8da9b2eaf51ec52cdc5bdc7cc0a89af3c2fbb0936c14d8"
      values.$pastUpgrades.1.2:
+        ["0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"]
      values.$pastUpgrades.1.1:
-        ["0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"]
+        "0x7292984e71d89bd82d8555a1060cf741e9090f33874c6bc3b87db6d1352784d0"
      values.$pastUpgrades.0.2:
+        ["0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"]
      values.$pastUpgrades.0.1:
-        ["0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"]
+        "0x7862f09db4097dc43ad1972ca9ee11eaf64a1fbfdb21fe6f84ad6b68d4b9fa56"
    }
```

Generated with discovered.json: 0x88a9ed2bdb9de6914e7c8cfeae2a6714954671aa

# Diff at Mon, 14 Oct 2024 10:54:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20711342
- current block number: 20711342

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711342 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      sourceHashes:
+        ["0x81a134f478bcc2b72c5f77df62e5b52cd55cefd6329f8e306ac6d28f31d467c2","0xbe08cd77d92ae2b4d333c5d2850e16d06e16d98de2a8435e0a49dc35ad73b915"]
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      sourceHashes:
+        ["0xfd5ac94c5a362e7426efd613abbaca3b838cf7f6089b44d9c0d4f675ca4467b3","0x2738adbe41339934ae57e5c96fb9d7e42a43ba2b112878bc9227cc1c81de8ee6"]
    }
```

Generated with discovered.json: 0x3feebd6e9b9d1b6de86173f784d48831f04f959c

# Diff at Tue, 01 Oct 2024 10:54:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20711342
- current block number: 20711342

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711342 (main branch discovery), not current.

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-18T06:47:11.000Z",["0x6Fd62239f3A441d1898683C5a84ce3681bB42C16"]],["2024-05-28T11:01:11.000Z",["0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"]],["2024-06-15T09:52:23.000Z",["0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"]]]
      values.$upgradeCount:
+        3
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-20T11:05:35.000Z",["0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"]],["2024-03-13T16:21:59.000Z",["0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"]],["2024-09-08T16:05:35.000Z",["0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"]]]
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xdc3306b785cc9e7d6a26a2f16a3579d38722b9b2

# Diff at Mon, 09 Sep 2024 06:43:56 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20420390
- current block number: 20711342

## Description

Aggregator compatibility upgrade. (See also recent Starknet upgrade to the same implementation / programHashes)
- add aggregatorProgramHash and support aggregation
- add multiple blob support

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      values.$implementation:
-        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
+        "0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"
      values.identify:
-        "StarkWare_Starknet_2024_8"
+        "StarkWare_Starknet_2024_9"
      values.implementation:
-        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
+        "0x47103A9b801eB6a63555897d399e4b7c1c8Eb5bC"
+++ description: The L2 programHash which is a hash of the L2 state machine logic. Liveness config MUST be changed in the .ts as soon as this is updated.
+++ severity: HIGH
      values.programHash:
-        "3383082961563516565935611087683915026448707331436034043529592588079494402084"
+        "853638403225561750106379562222782223909906501242604214771127703946595519856"
      values.aggregatorProgramHash:
+        "1161178844461337253856226043908368523817098764221830529880464854589141231910"
    }
```

## Source code changes

```diff
.../{.flat@20420390 => .flat}/Paradex/Starknet.sol | 297 ++++++++++++++++-----
 1 file changed, 223 insertions(+), 74 deletions(-)
```

Generated with discovered.json: 0x0e0b96c8f79c3e7a254842be941a4c2db301e2e0

# Diff at Fri, 30 Aug 2024 07:54:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20420390
- current block number: 20420390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420390 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xd5cc157e69ce6b3e0ed1db41e96eeb1707d6d0e1

# Diff at Wed, 21 Aug 2024 10:04:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20420390
- current block number: 20420390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420390 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xF338cad020D506e8e3d9B4854986E0EcE6C23640"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xF338cad020D506e8e3d9B4854986E0EcE6C23640","via":[]}]
    }
```

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c","via":[]}]
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x0a64d3D7747549aF6d65C225D56ac8f71e436B93","via":[]},{"permission":"upgrade","target":"0x2E6fe05FE3f9a6622092Fd75439D53f01eb8A74f","via":[]}]
    }
```

Generated with discovered.json: 0x10f525307b98b5fe66ef9ce9c3a491523cb6e8bc

# Diff at Fri, 09 Aug 2024 10:11:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20420390
- current block number: 20420390

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20420390 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xF338cad020D506e8e3d9B4854986E0EcE6C23640"]
      assignedPermissions.upgrade:
+        ["0xF338cad020D506e8e3d9B4854986E0EcE6C23640"]
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x64F4396bb0669C72858Cc50C779b48EB25F45770","0x2871B956bC19D25961E9a7519f32D7fDaA21B403","0x804d60CB1ade94511f7915A2062948685Ca8C81f","0xBF6aAc7Ae78B351180AD42b3dc5087eAd886B4A6","0x59232aC80E6d403b6381393e52f4665ECA328558"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x64F4396bb0669C72858Cc50C779b48EB25F45770","0x2871B956bC19D25961E9a7519f32D7fDaA21B403","0x804d60CB1ade94511f7915A2062948685Ca8C81f","0xBF6aAc7Ae78B351180AD42b3dc5087eAd886B4A6","0x59232aC80E6d403b6381393e52f4665ECA328558"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x19d674117e91560c9f20fdaf4005960604374454

# Diff at Tue, 30 Jul 2024 15:53:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@51c652e40232eac8e60e9b31aa56f09071495fef block: 20110229
- current block number: 20420390

## Description

Accesscontrol roles of APP_GOVERNOR and APP_ROLE_ADMIN are given to the EOA that already has the upgrade admin and GOVERNANCE_ADMIN roles, not adding any new net permissions. `maxTotalBalance' raised from 20M to 30M USDC.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      values.accessControl.APP_GOVERNOR.members.0:
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      values.accessControl.APP_ROLE_ADMIN.members.0:
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
+++ description: Maximum bridge balance allowed (currentBalance + depositAmount <= maxTotalBalance)
+++ severity: MEDIUM
      values.maxTotalBalance:
-        20000000000000
+        30000000000000
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20110229 (main branch discovery), not current.

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      fieldMeta:
+        {"maxTotalBalance":{"severity":"MEDIUM","description":"Maximum bridge balance allowed (currentBalance + depositAmount <= maxTotalBalance)"}}
    }
```

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      fieldMeta:
+        {"programHash":{"severity":"HIGH","description":"The L2 programHash which is a hash of the L2 state machine logic. Liveness config MUST be changed in the .ts as soon as this is updated."}}
    }
```

Generated with discovered.json: 0xba9734e5204d6418a6b64ea98fb1b0a818f3c2a6

# Diff at Thu, 18 Jul 2024 10:32:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20110229
- current block number: 20110229

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20110229 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0xF338cad020D506e8e3d9B4854986E0EcE6C23640"]}
    }
```

Generated with discovered.json: 0x093f5b4f3898a34ecc9a8ea8c23c6863f5bd5dfb

# Diff at Mon, 17 Jun 2024 08:11:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f39ec7f15738d4847f0cbde4818140d42e26440f block: 19973942
- current block number: 20110229

## Description

The proxyGovernance is given the roles GOVERNANCE_ADMIN (can give governance roles) and SECURITY_ADMIN (can activate withdrawal limit) on the paradex USDC bridge. This is in line with the config before the implementation upgrade and already reflected on the project page.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      values.accessControl.GOVERNANCE_ADMIN.members.1:
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
      values.accessControl.SECURITY_ADMIN.members.1:
+        "0xa1F2ecaC6E3E593ED58B9ac5fa4B97962892E77c"
    }
```

Generated with discovered.json: 0xc5260cb25ec9651795eb7d1168c49550b1812f5e

# Diff at Wed, 29 May 2024 07:11:17 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca8b8ea4d1ba80d5f20f68bede9336b90b01434 block: 19532051
- current block number: 19973942

## Description

The USDC Bridge (only bridge in use by Paradex) implementation is upgraded to the one used on starknet currently (code-identical). The ProxyGovernor (allowed to upgrade the implementation) stays the same, and new accessControl roles are not set.

See also the notes `# Diff at Tue, 13 Feb 2024 12:27:47 GMT` in `discovery/starknet/ethereum/diffHistory.md`.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      upgradeability.implementation:
-        "0x6Fd62239f3A441d1898683C5a84ce3681bB42C16"
+        "0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
      implementations.0:
-        "0x6Fd62239f3A441d1898683C5a84ce3681bB42C16"
+        "0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
      values.accessControl.GOVERNANCE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":["0x0000000000000000000000000000000000000020"]}
      values.accessControl.APP_GOVERNOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.APP_ROLE_ADMIN:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.OPERATOR:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.TOKEN_ADMIN:
+        {"adminRole":"APP_ROLE_ADMIN","members":[]}
      values.accessControl.UPGRADE_GOVERNOR:
+        {"adminRole":"GOVERNANCE_ADMIN","members":[]}
      values.accessControl.SECURITY_ADMIN:
+        {"adminRole":"SECURITY_ADMIN","members":["0x0000000000000000000000000000000000000020"]}
      values.accessControl.SECURITY_AGENT:
+        {"adminRole":"SECURITY_ADMIN","members":[]}
      values.identify:
-        "StarkWare_StarknetERC20Bridge_2022_1"
+        "StarkWare_StarknetERC20Bridge_2.0_4"
      values.implementation:
-        "0x6Fd62239f3A441d1898683C5a84ce3681bB42C16"
+        "0x8A4e51ff0F2a45899519e6049FB2D1F038Be1e77"
      values.isActive:
-        true
      values.maxDeposit:
-        500000000000
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

## Source code changes

```diff
.../USDC Bridge/StarknetERC20Bridge.sol            | 2230 +++++++++++++++-----
 1 file changed, 1682 insertions(+), 548 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532051 (main branch discovery), not current.

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

Generated with discovered.json: 0xe86c2f3be0c8108f553b2bbbda07919a1d6fe7f0

# Diff at Thu, 28 Mar 2024 10:35:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19467601
- current block number: 19532051

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19467601 (main branch discovery), not current.

```diff
    contract ParadexImplementationGovernorMultisig (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x55dc427d90067c7f872f6e28295faff5e1cf4097

# Diff at Tue, 19 Mar 2024 08:27:29 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@38751f18e662e502e9656add6b7ab03bb7fb62f8 block: 19433460
- current block number: 19467601

## Description

Program hash changed.

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
+++ description: The L2 programHash which is a hash of the L2 state machine logic. Liveness config MUST be changed in the .ts as soon as this is updated.
+++ type: CODE_CHANGE
+++ severity: HIGH
      values.programHash:
-        "109586309220455887239200613090920758778188956576212125550190099009305121410"
+        "3383082961563516565935611087683915026448707331436034043529592588079494402084"
    }
```

Generated with discovered.json: 0x3ca3ccb9df16f0d2cc3faf50d40b7a4cdbc6be4b

# Diff at Thu, 14 Mar 2024 13:11:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 19411688
- current block number: 19433460

## Description

Upgraded to the new implementation to support blobs - it's actually the same implementation used by Starknet so check its changelog for the changes. The program hash is also the same.

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    +++ description: None
      upgradeability.implementation:
-        "0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      upgradeability.proxyGovernance.1:
+        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
      implementations.0:
-        "0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      values.identify:
-        "StarkWare_Starknet_2023_6"
+        "StarkWare_Starknet_2024_8"
      values.implementation:
-        "0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08"
+        "0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24"
      values.programHash:
-        "2479841346739966073527450029179698923866252973805981504232089731754042431018"
+        "109586309220455887239200613090920758778188956576212125550190099009305121410"
    }
```

## Source code changes

```diff
.../Paradex/implementation/meta.txt                |   2 +-
 .../starkware/solidity/components}/Governance.sol  |   6 +-
 .../solidity/components}/GovernedFinalizable.sol   |   8 +-
 .../components}/OnchainDataFactTreeEncoder.sol     |  13 +-
 .../starkware/solidity/components}/Operator.sol    |   8 +-
 .../solidity/interfaces}/BlockDirectCall.sol       |   4 +-
 .../solidity/interfaces}/ContractInitializer.sol   |   4 +-
 .../solidity/interfaces}/IFactRegistry.sol         |   4 +-
 .../starkware/solidity/interfaces}/Identity.sol    |   4 +-
 .../starkware/solidity/interfaces}/MGovernance.sol |   4 +-
 .../starkware/solidity/interfaces}/MOperator.sol   |   6 +-
 .../solidity/interfaces}/ProxySupport.sol          |  12 +-
 .../starkware/solidity/libraries}/Addresses.sol    |   4 +-
 .../solidity/libraries/NamedStorage8.sol}          |  23 ++-
 .../starknet/solidity}/IStarknetMessaging.sol      |  12 +-
 .../solidity}/IStarknetMessagingEvents.sol         |   4 +-
 .../starkware/starknet/solidity}/Output.sol        |  38 ++--
 .../starkware/starknet/solidity}/Starknet.sol      | 219 ++++++++++++++++-----
 .../starknet/solidity}/StarknetGovernance.sol      |   8 +-
 .../starknet/solidity}/StarknetMessaging.sol       |  14 +-
 .../starknet/solidity}/StarknetOperator.sol        |   8 +-
 .../starkware/starknet/solidity}/StarknetState.sol |   6 +-
 22 files changed, 271 insertions(+), 140 deletions(-)
```

Generated with discovered.json: 0xcf708385b5c467d77a70de0b7dfb36c5e9df798d

# Diff at Mon, 11 Mar 2024 11:54:57 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0a20664a6b5ee1585ee305022d1fb61c48648854 block: 19126264
- current block number: 19411688

## Description

The maximum allowed balance of the bridge in USDC is doubled from 10 to 20 million USDC.

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    +++ description: None
      values.maxTotalBalance:
-        10000000000000
+        20000000000000
    }
```

Generated with discovered.json: 0x9add5ea9290632cfcb71c7da24b5711ae9e16a1d

# Diff at Wed, 31 Jan 2024 11:48:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2226ccb2f9affe507b9708f9072c87989d180e43 block: 18983662
- current block number: 19126264

## Description

Updated the `programHash` and `configHash`.

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
      values.configHash:
-        "1946969884474626573154270293480115261427695072308490075958253509832033340430"
+        "2741190170141984203224468507008497105532196084369172236871397222510074358631"
      values.programHash:
-        "54878256403880350656938046611252303365750679698042371543935159963667935317"
+        "2479841346739966073527450029179698923866252973805981504232089731754042431018"
    }
```

Generated with discovered.json: 0xb15a2532273ec56424a924c846c951de4ee51aaf

# Diff at Thu, 11 Jan 2024 12:24:29 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@f4fd8a33866a1a7eab89875fb7e0473f7609e88b block: 18941335
- current block number: 18983662

## Description

The program hash is updated (with tx 0x4dc1b43e0b932f665a95af3d2cb61f280a1b7a63f7464b3b27edfde5d183bd8a).

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
      values.programHash:
-        "3258367057337572248818716706664617507069572185152472699066582725377748079373"
+        "54878256403880350656938046611252303365750679698042371543935159963667935317"
    }
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18941335 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
      name:
-        "GnosisSafe"
+        "ParadexImplementationGovernorMultisig"
      derivedName:
+        "GnosisSafe"
    }
```

# Diff at Fri, 05 Jan 2024 13:21:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@93d6aaf3e23d92ddfefa09b5758d1e10c888e66a block: 18812636
- current block number: 18941335

## Description

A new Starknet governor (2/5 MultiSig) is added to the Paradex contract.

## Watched changes

```diff
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
      values.governors[1]:
+        "0x0a64d3D7747549aF6d65C225D56ac8f71e436B93"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x0a64d3D7747549aF6d65C225D56ac8f71e436B93) {
    }
```

## Source code changes

```diff
.../.code/GnosisSafe/implementation/GnosisSafe.sol | 422 +++++++++++++++++++++
 .../GnosisSafe/implementation/base/Executor.sol    |  27 ++
 .../implementation/base/FallbackManager.sol        |  53 +++
 .../implementation/base/GuardManager.sol           |  50 +++
 .../implementation/base/ModuleManager.sol          | 133 +++++++
 .../implementation/base/OwnerManager.sol           | 149 ++++++++
 .../GnosisSafe/implementation/common/Enum.sol      |   8 +
 .../implementation/common/EtherPaymentFallback.sol |  13 +
 .../implementation/common/SecuredTokenTransfer.sol |  35 ++
 .../implementation/common/SelfAuthorized.sol       |  16 +
 .../implementation/common/SignatureDecoder.sol     |  36 ++
 .../GnosisSafe/implementation/common/Singleton.sol |  11 +
 .../implementation/common/StorageAccessible.sol    |  47 +++
 .../implementation/external/GnosisSafeMath.sol     |  54 +++
 .../interfaces/ISignatureValidator.sol             |  20 +
 .../.code/GnosisSafe/implementation/meta.txt       |   2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     | 155 ++++++++
 .../ethereum/.code/GnosisSafe/proxy/meta.txt       |   2 +
 18 files changed, 1233 insertions(+)
```

# Diff at Mon, 18 Dec 2023 11:40:25 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@636723aa928b9ac461db31dd0b5005a916961be5

## Description

Change in the deposit limits of the USDC Bridge contract:

- The maximum amount per deposit is increased to 500K USDC
- The maximum amount that can be locked across all users is increased to 10M USDC

## Watched changes

```diff
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
      values.maxDeposit:
-        200000000000
+        500000000000
      values.maxTotalBalance:
-        5000000000000
+        10000000000000
    }
```

# Diff at Tue, 31 Oct 2023 10:57:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
+   Status: CREATED
    contract USDC Bridge (0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3) {
    }
```

```diff
+   Status: CREATED
    contract Paradex (0xF338cad020D506e8e3d9B4854986E0EcE6C23640) {
    }
```
