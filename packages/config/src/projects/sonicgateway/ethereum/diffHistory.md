Generated with discovered.json: 0x90e4e2965a5e52d01e085f57f7bb9b880d15fbd6

# Diff at Wed, 07 May 2025 11:45:14 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@370d0c8c1e8a1a622701270cc075f9413ad76ecd block: 22297572
- current block number: 22431552

## Description

SonicGatewayMultisig was granted terminator role, it can terminate possibility to start new token deposits/withdrawals now. 

## Watched changes

```diff
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4) {
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
      values.accessControl.TERMINATOR_ROLE:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0"]}
    }
```

Generated with discovered.json: 0x41682c81de65e07a0995cd2b4e71cacb096aa25d

# Diff at Tue, 29 Apr 2025 08:19:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22297572
- current block number: 22297572

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22297572 (main branch discovery), not current.

```diff
    contract ValidatorsRegistry (0x72965045A6691E5A74299D1e878f303264D4D910) {
    +++ description: Registry of the current validator set. Validators can have different weights and be changed on each state update (signed by the current validators).
      issuedPermissions:
-        [{"permission":"validateBridge","to":"0x2534ED5d1303F035fa7e5d6a52199e59328B3F72","via":[]},{"permission":"validateBridge","to":"0x32744b98cC03A76C0559e905a31E8474a31729c1","via":[]},{"permission":"validateBridge","to":"0x34F01d6B8ad8eB46D2A7bEcCc8611EED04ef5d65","via":[]},{"permission":"validateBridge","to":"0x3Dd6C793AbA45738e531639977a292A3A8E32C9D","via":[]},{"permission":"validateBridge","to":"0x551a7DAD9a14EfD0289c8ed3e52cf8352dc52011","via":[]},{"permission":"validateBridge","to":"0x8406de45bfAca854d08377ca1436C6b4785b4D79","via":[]},{"permission":"validateBridge","to":"0x92E33222A1389aAf89C0794643fBBC7E679a6Dad","via":[]},{"permission":"validateBridge","to":"0xb8B86aAa072B3aa26d0D02A81642d00Bf58f6572","via":[]}]
    }
```

```diff
    contract TokenDeposit (0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20) {
    +++ description: Escrows the tokens that are bridged to Sonic. Users call this contract to deposit when bridging to Sonic, and to withdraw when bridging back to Ethereum. Since this contract escrows all tokens and defines the oracle and verification contracts, an upgrade of this contract can overwrite the logic of the whole bridge and potentially steal all funds.
      issuedPermissions:
-        [{"permission":"interact","to":"0x7390251Bf35AA7eA7C196fc4750bd5d6c5918329","description":"call `withdrawWhileDead()` to withdraw escrowed tokens when the bridge liveness self-check has failed.","via":[]},{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"set the proof verifier and the exit administrator.","via":[]},{"permission":"upgrade","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","via":[]}]
    }
```

```diff
    contract UpdateManager (0xB0bECf0fBfE431D42bA0FbD8dFBFbB0DCFd62Da4) {
    +++ description: Entry point for state (oracle) updates.
      issuedPermissions:
-        [{"permission":"interact","to":"0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B","description":"set permissioned relayers.","via":[]},{"permission":"interact","to":"0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B","description":"set the fast lane fee.","via":[]},{"permission":"interact","to":"0x76d906837a073bF63f0c21d1d5bC2Fd14057EC3B","description":"set the number of blocks (Sonic L1 blocks) at which periodic state root updates to Ethereum are expected (heartbeat).","via":[]},{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"manage all access control roles.","via":[]},{"permission":"relay","to":"0x11b0E7Bef4046dD43b09489926F30514584B1161","via":[]},{"permission":"relay","to":"0xa55e557Ab2Cc2DFa84Cd199e1fA1CB6E37326C4D","via":[]}]
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
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4) {
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
      issuedPermissions:
-        [{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"add tokens to the whitelist.","via":[]},{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"manage access control roles.","via":[]},{"permission":"interact","to":"0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0","description":"remove tokens from the whitelist.","via":[]}]
    }
```

Generated with discovered.json: 0x9033d7c92b00da949c7785c89129948e6fc81dec

# Diff at Fri, 18 Apr 2025 18:08:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1dee5bc960c23f20e33ad3548023a46f9d9c2128 block: 22187418
- current block number: 22297572

## Description

Small upgrade that allows claiming for any address (to that address).

## Watched changes

```diff
    contract TokenDeposit (0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20) {
    +++ description: Escrows the tokens that are bridged to Sonic. Users call this contract to deposit when bridging to Sonic, and to withdraw when bridging back to Ethereum. Since this contract escrows all tokens and defines the oracle and verification contracts, an upgrade of this contract can overwrite the logic of the whole bridge and potentially steal all funds.
      sourceHashes.0:
-        "0xa91b55bb0cd39f657105bf6422bd209274305ae3556f2f802a822a891fabfa0e"
+        "0xb8e319a32352b23a4c5e25d87b867e5b2e228f4962fba3d1cebef0fa6f879ab8"
      values.$implementation:
-        "0x4cbd824685F1E21B119F230B54d65C5a7D2a5330"
+        "0xAdE2eF0101278fe11490F2EE2aaD7915a094ADe9"
      values.$pastUpgrades.2:
+        ["2024-12-23T17:54:23.000Z","0x8186d6acbf5d0d33ccb6a7054e1e9f61649873e7c85bdf7cd11825a266db5983",["0x4cbd824685F1E21B119F230B54d65C5a7D2a5330"]]
      values.$pastUpgrades.1.2:
-        "0x8186d6acbf5d0d33ccb6a7054e1e9f61649873e7c85bdf7cd11825a266db5983"
+        ["0xAdE2eF0101278fe11490F2EE2aaD7915a094ADe9"]
      values.$pastUpgrades.1.1:
-        "2024-12-23T17:54:23.000Z"
+        "0x00658364f89d911d6cf167646f3d4cdcdaa90c60c1c1b5b7c1991e3e606dbf9c"
      values.$pastUpgrades.1.0:
-        ["0x4cbd824685F1E21B119F230B54d65C5a7D2a5330"]
+        "2025-04-17T03:06:47.000Z"
      values.$upgradeCount:
-        2
+        3
    }
```

```diff
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4) {
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
      values.accessControl.0x366e34e4dd9cacc5f69a0ea920636c292b34b8951987dd08682365f7701b86f6:
+        {"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x9Fe65a5418850015a9D8ad3Ca50d6a0B9769FbE0"]}
    }
```

## Source code changes

```diff
.../{.flat@22187418 => .flat}/TokenDeposit/TokenDeposit.sol | 13 +++++++++----
 1 file changed, 9 insertions(+), 4 deletions(-)
```

Generated with discovered.json: 0x9423de32266d187af505222684dae5f935f665bc

# Diff at Thu, 03 Apr 2025 09:13:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 21766633
- current block number: 22187418

## Description

Upgrade TokenPairs contract: add generalized terminate() function, rm old token-specific terminateXX() functions. terminating a token is part of the flow that transitions it from lock-mint to native burn/mint as is done for USDC and USDT for example.

## Watched changes

```diff
    contract TokenPairs (0xf2b1510c2709072C88C5b14db90Ec3b6297193e4) {
    +++ description: Token pairs are whitelisted in this contract for bridging through the Sonc Gateway.
      sourceHashes.1:
-        "0x2527d117bfcdd69b3e49a08514f4e5090307308646ebf2f019e382e7c4968fb3"
+        "0x29faf4889af43049c742ca34aeff493c079c023986c7f794a3dbfe3b1c642d09"
      sourceHashes.0:
-        "0x29faf4889af43049c742ca34aeff493c079c023986c7f794a3dbfe3b1c642d09"
+        "0x7acdcc46a2f205d33ffeddfba5678af59f36b41d63a986907a50713f1aba8311"
      values.$implementation:
-        "0x0c40Ae1c82401EA741953D3f026ADc07BE9e7943"
+        "0x68A4DdEDc285241440733719e43B1BCB795dD8c7"
      values.$pastUpgrades.1:
+        ["2025-03-31T13:26:35.000Z","0xa0ea3636586490b57142400ba479e1309d04e948db316b43e85733d4a63dbbf6",["0x68A4DdEDc285241440733719e43B1BCB795dD8c7"]]
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../TokenPairs/TokenPairs.sol                      | 41 ++++------------------
 1 file changed, 6 insertions(+), 35 deletions(-)
```

Generated with discovered.json: 0x06586804aec43aff7b01ecdbbd5a6b0b048ea62f

# Diff at Wed, 19 Mar 2025 13:05:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21766633
- current block number: 21766633

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766633 (main branch discovery), not current.

```diff
    contract DirectExitAdministrator (0x7390251Bf35AA7eA7C196fc4750bd5d6c5918329) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xecb61ef9df254128148f13a88d5981d22276f22e

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
