Generated with discovered.json: 0x5be930e3288828c5018b927b6b47ae5a11a49354

# Diff at Mon, 17 Mar 2025 16:31:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83c6f5a675a7a6512e7a8af5c777ef32d60dc946 block: 21766633
- current block number: 21766633

## Description

Config: Change multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766633 (main branch discovery), not current.

```diff
    contract undefined (0x11b0E7Bef4046dD43b09489926F30514584B1161) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"relay","from":"0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4"}]
    }
```

```diff
    contract undefined (0x2534ED5d1303F035fa7e5d6a52199e59328B3F72) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"validateBridge","from":"0x72965045A6691E5A74299D1e878f303264D4D910"}]
    }
```

```diff
    contract undefined (0x32744b98cC03A76C0559e905a31E8474a31729c1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"validateBridge","from":"0x72965045A6691E5A74299D1e878f303264D4D910"}]
    }
```

```diff
    contract undefined (0x34F01d6B8ad8eB46D2A7bEcCc8611EED04ef5d65) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"validateBridge","from":"0x72965045A6691E5A74299D1e878f303264D4D910"}]
    }
```

```diff
    contract undefined (0x3Dd6C793AbA45738e531639977a292A3A8E32C9D) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"validateBridge","from":"0x72965045A6691E5A74299D1e878f303264D4D910"}]
    }
```

```diff
    contract undefined (0x551a7DAD9a14EfD0289c8ed3e52cf8352dc52011) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"validateBridge","from":"0x72965045A6691E5A74299D1e878f303264D4D910"}]
    }
```

```diff
    contract ValidatorsRegistry (0x72965045A6691E5A74299D1e878f303264D4D910) {
    +++ description: Registry of the current validator set. Validators can have different weights and be changed on each state update (signed by the current validators).
      issuedPermissions:
-        [{"permission":"validateBridge","to":"0x2534ED5d1303F035fa7e5d6a52199e59328B3F72","via":[]},{"permission":"validateBridge","to":"0x32744b98cC03A76C0559e905a31E8474a31729c1","via":[]},{"permission":"validateBridge","to":"0x34F01d6B8ad8eB46D2A7bEcCc8611EED04ef5d65","via":[]},{"permission":"validateBridge","to":"0x3Dd6C793AbA45738e531639977a292A3A8E32C9D","via":[]},{"permission":"validateBridge","to":"0x551a7DAD9a14EfD0289c8ed3e52cf8352dc52011","via":[]},{"permission":"validateBridge","to":"0x8406de45bfAca854d08377ca1436C6b4785b4D79","via":[]},{"permission":"validateBridge","to":"0x92E33222A1389aAf89C0794643fBBC7E679a6Dad","via":[]},{"permission":"validateBridge","to":"0xb8B86aAa072B3aa26d0D02A81642d00Bf58f6572","via":[]}]
    }
```

```diff
    contract DirectExitAdministrator (0x7390251Bf35AA7eA7C196fc4750bd5d6c5918329) {
    +++ description: None
      severity:
-        "HIGH"
      receivedPermissions:
-        [{"permission":"interact","from":"0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20","description":"call `withdrawWhileDead()` to withdraw escrowed tokens when the bridge liveness self-check has failed."}]
    }
```

```diff
    contract SonicGatewayOpsMultisig (0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4","description":"set permissioned relayers."},{"permission":"interact","from":"0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4","description":"set the fast lane fee."},{"permission":"interact","from":"0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4","description":"set the number of blocks (Sonic L1 blocks) at which periodic state root updates to Ethereum are expected (heartbeat)."}]
    }
```

```diff
    contract undefined (0x8406de45bfAca854d08377ca1436C6b4785b4D79) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"validateBridge","from":"0x72965045A6691E5A74299D1e878f303264D4D910"}]
    }
```

```diff
    contract undefined (0x92E33222A1389aAf89C0794643fBBC7E679a6Dad) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"validateBridge","from":"0x72965045A6691E5A74299D1e878f303264D4D910"}]
    }
```

```diff
    contract SonicGatewayMultisig (0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0) {
    +++ description: None
      receivedPermissions.5:
-        {"permission":"upgrade","from":"0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20"}
      receivedPermissions.4:
-        {"permission":"interact","from":"0xf2b1510c2709072C88C5b14db90Ec3b6297193e4","description":"manage access control roles."}
      receivedPermissions.3:
-        {"permission":"interact","from":"0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4","description":"manage all access control roles."}
      receivedPermissions.2:
-        {"permission":"interact","from":"0xf2b1510c2709072C88C5b14db90Ec3b6297193e4","description":"remove tokens from the whitelist."}
      receivedPermissions.1:
-        {"permission":"interact","from":"0xf2b1510c2709072C88C5b14db90Ec3b6297193e4","description":"add tokens to the whitelist."}
      receivedPermissions.0.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.0.description:
-        "set the proof verifier and the exit administrator."
    }
```

```diff
    contract TokenDeposit (0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20) {
    +++ description: Escrows the tokens that are bridged to Sonic. Users call this contract to deposit when bridging to Sonic, and to withdraw when bridging back to Ethereum. Since this contract escrows all tokens and defines the oracle and verification contracts, an upgrade of this contract can overwrite the logic of the whole bridge and potentially steal all funds.
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","via":[]}
      issuedPermissions.1:
-        {"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"set the proof verifier and the exit administrator.","via":[]}
      issuedPermissions.0.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.0.to:
-        "0x7390251Bf35AA7eA7C196fc4750bd5d6c5918329"
+        "0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0"
      issuedPermissions.0.description:
-        "call `withdrawWhileDead()` to withdraw escrowed tokens when the bridge liveness self-check has failed."
    }
```

```diff
    contract undefined (0xa55e557Ab2Cc2DFa84Cd199e1fA1CB6E37326C4D) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"relay","from":"0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4"}]
    }
```

```diff
    contract UpdateManager (0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4) {
    +++ description: Entry point for state (oracle) updates.
      issuedPermissions:
-        [{"permission":"interact","to":"0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B","description":"set permissioned relayers.","via":[]},{"permission":"interact","to":"0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B","description":"set the fast lane fee.","via":[]},{"permission":"interact","to":"0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B","description":"set the number of blocks (Sonic L1 blocks) at which periodic state root updates to Ethereum are expected (heartbeat).","via":[]},{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"manage all access control roles.","via":[]},{"permission":"relay","to":"0x11b0E7Bef4046dD43b09489926F30514584B1161","via":[]},{"permission":"relay","to":"0xa55e557Ab2Cc2DFa84Cd199e1fA1CB6E37326C4D","via":[]}]
      receivedPermissions:
-        [{"permission":"interact","from":"0xB7e8CC3F5FeA12443136f0cc13D81F109B2dEd7f","description":"update the state root."}]
    }
```

```diff
    contract StateOracle (0xB7e8CC3F5FeA12443136f0cc13D81F109B2dEd7f) {
    +++ description: Simple contract that saves the latest state root.
      issuedPermissions:
-        [{"permission":"interact","to":"0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4","description":"update the state root.","via":[]}]
    }
```

```diff
    contract undefined (0xb8B86aAa072B3aa26d0D02A81642d00Bf58f6572) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"validateBridge","from":"0x72965045A6691E5A74299D1e878f303264D4D910"}]
    }
```

```diff
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4) {
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
      issuedPermissions:
-        [{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"add tokens to the whitelist.","via":[]},{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"manage access control roles.","via":[]},{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"remove tokens from the whitelist.","via":[]}]
    }
```

Generated with discovered.json: 0x0f55a9515686bf8869b08b5c6199ca4ba27de7c0

# Diff at Tue, 04 Mar 2025 10:39:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766633
- current block number: 21766633

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766633 (main branch discovery), not current.

```diff
    contract ValidatorsRegistry (0x72965045A6691E5A74299D1e878f303264D4D910) {
    +++ description: Registry of the current validator set. Validators can have different weights and be changed on each state update (signed by the current validators).
      sinceBlock:
+        21443134
    }
```

```diff
    contract DirectExitAdministrator (0x7390251Bf35AA7eA7C196fc4750bd5d6c5918329) {
    +++ description: None
      sinceBlock:
+        21443151
    }
```

```diff
    contract SonicGatewayOpsMultisig (0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B) {
    +++ description: None
      sinceBlock:
+        21451725
    }
```

```diff
    contract MPTProofVerifier (0x921B147a90Ef738BBb7c2c89D88ea9d8Af3e9306) {
    +++ description: Verifier contract for merkle proofs.
      sinceBlock:
+        21443127
    }
```

```diff
    contract SonicGatewayMultisig (0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0) {
    +++ description: None
      sinceBlock:
+        21336741
    }
```

```diff
    contract TokenDeposit (0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20) {
    +++ description: Escrows the tokens that are bridged to Sonic. Users call this contract to deposit when bridging to Sonic, and to withdraw when bridging back to Ethereum. Since this contract escrows all tokens and defines the oracle and verification contracts, an upgrade of this contract can overwrite the logic of the whole bridge and potentially steal all funds.
      sinceBlock:
+        21443147
    }
```

```diff
    contract UpdateManager (0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4) {
    +++ description: Entry point for state (oracle) updates.
      sinceBlock:
+        21443161
    }
```

```diff
    contract StateOracle (0xB7e8CC3F5FeA12443136f0cc13D81F109B2dEd7f) {
    +++ description: Simple contract that saves the latest state root.
      sinceBlock:
+        21443130
    }
```

```diff
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4) {
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
      sinceBlock:
+        21443138
    }
```

Generated with discovered.json: 0x17f5da83e23bf7e0425e03a08b51fcb5bc947ee7

# Diff at Tue, 04 Feb 2025 12:32:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766633
- current block number: 21766633

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766633 (main branch discovery), not current.

```diff
    contract DirectExitAdministrator (0x7390251Bf35AA7eA7C196fc4750bd5d6c5918329) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SonicGatewayOpsMultisig (0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B) {
    +++ description: None
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SonicGatewayMultisig (0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0) {
    +++ description: None
      receivedPermissions.4.permission:
-        "configure"
+        "interact"
      receivedPermissions.3.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract TokenDeposit (0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20) {
    +++ description: Escrows the tokens that are bridged to Sonic. Users call this contract to deposit when bridging to Sonic, and to withdraw when bridging back to Ethereum. Since this contract escrows all tokens and defines the oracle and verification contracts, an upgrade of this contract can overwrite the logic of the whole bridge and potentially steal all funds.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpdateManager (0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4) {
    +++ description: Entry point for state (oracle) updates.
      issuedPermissions.3.permission:
-        "configure"
+        "interact"
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract StateOracle (0xB7e8CC3F5FeA12443136f0cc13D81F109B2dEd7f) {
    +++ description: Simple contract that saves the latest state root.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4) {
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x6d993ba7c51f734ec2d2ecdb561813ab96c9507a

# Diff at Mon, 03 Feb 2025 14:40:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21744201
- current block number: 21766633

## Description

New relayer added.

## Watched changes

```diff
    contract UpdateManager (0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4) {
    +++ description: Entry point for state (oracle) updates.
      issuedPermissions.5:
+        {"permission":"relay","to":"0xa55e557Ab2Cc2DFa84Cd199e1fA1CB6E37326C4D","via":[]}
      values.accessControl.RELAY_ROLE.members.1:
+        "0xa55e557Ab2Cc2DFa84Cd199e1fA1CB6E37326C4D"
      values.acRelay.1:
+        "0xa55e557Ab2Cc2DFa84Cd199e1fA1CB6E37326C4D"
    }
```

Generated with discovered.json: 0x6cf6874469b11f691b52488765fc560da6584d86

# Diff at Wed, 29 Jan 2025 16:28:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21730951

## Description

Initial Discovery: Standard TokenBridge validated by 6/8 Validators and secured by a 3/4 Multisig.

## Initial discovery

```diff
+   Status: CREATED
    contract ValidatorsRegistry (0x72965045A6691E5A74299D1e878f303264D4D910)
    +++ description: Registry of the current validator set. Validators can have different weights and be changed on each state update (signed by the current validators).
```

```diff
+   Status: CREATED
    contract DirectExitAdministrator (0x7390251Bf35AA7eA7C196fc4750bd5d6c5918329)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SonicGatewayOpsMultisig (0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MPTProofVerifier (0x921B147a90Ef738BBb7c2c89D88ea9d8Af3e9306)
    +++ description: Verifier contract for merkle proofs.
```

```diff
+   Status: CREATED
    contract SonicGatewayMultisig (0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenDeposit (0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20)
    +++ description: Escrows the tokens that are bridged to Sonic. Users call this contract to deposit when bridging to Sonic, and to withdraw when bridging back to Ethereum. Since this contract escrows all tokens and defines the oracle and verification contracts, an upgrade of this contract can overwrite the logic of the whole bridge and potentially steal all funds.
```

```diff
+   Status: CREATED
    contract UpdateManager (0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4)
    +++ description: Entry point for state (oracle) updates.
```

```diff
+   Status: CREATED
    contract StateOracle (0xB7e8CC3F5FeA12443136f0cc13D81F109B2dEd7f)
    +++ description: Simple contract that saves the latest state root.
```

```diff
+   Status: CREATED
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4)
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
```
