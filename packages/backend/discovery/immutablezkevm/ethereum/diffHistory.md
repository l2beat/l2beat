Generated with discovered.json: 0x2f37a47969364befbfa09088d484ced2840f3d27

# Diff at Fri, 06 Sep 2024 11:30:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08a747098d22564c3a0b869c0a20851bf283bd07 block: 20491123
- current block number: 20691264

## Description

One signer removed.

## Watched changes

```diff
    contract OwnerMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      values.$members.6:
-        "0xbD8Dc294478ec4dAd9f1b4596bf275f4d0309817"
      values.$members.5:
-        "0x296A19A4e87F5824DBE8DEd53415A4704538bB30"
+        "0xbD8Dc294478ec4dAd9f1b4596bf275f4d0309817"
      values.$members.4:
-        "0xB3669C058ddF26171Fd131D80C801AaEeb1519b8"
+        "0x296A19A4e87F5824DBE8DEd53415A4704538bB30"
      values.$members.3:
-        "0xdb6c271060571A96A62E3947E373395C89f765Ba"
+        "0xB3669C058ddF26171Fd131D80C801AaEeb1519b8"
      values.$members.2:
-        "0x5F1A23A3baB949D7264AfA4E6fbfEB245685E6B5"
+        "0xdb6c271060571A96A62E3947E373395C89f765Ba"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x8b9c640015dea885190fc1c5ff08d944dbc15902

# Diff at Fri, 30 Aug 2024 07:53:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20491123
- current block number: 20491123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491123 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xdE2BCd3F0297d29c25e83228E5A33C0b43b51Ec8) {
    +++ description: None
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xd7a8d47fe04471712dceff60477b77e901ff2530

# Diff at Fri, 23 Aug 2024 09:52:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20491123
- current block number: 20491123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491123 (main branch discovery), not current.

```diff
    contract RootAxelarBridgeAdaptor (0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xaeee44682470a79377c17b1cb73c8b3f04ba252d

# Diff at Wed, 21 Aug 2024 10:03:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20491123
- current block number: 20491123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491123 (main branch discovery), not current.

```diff
    contract RootAxelarBridgeAdaptor (0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdE2BCd3F0297d29c25e83228E5A33C0b43b51Ec8","via":[]}]
    }
```

```diff
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xdE2BCd3F0297d29c25e83228E5A33C0b43b51Ec8","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xdE2BCd3F0297d29c25e83228E5A33C0b43b51Ec8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932","0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932","via":[]},{"permission":"upgrade","target":"0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6","via":[]}]
    }
```

Generated with discovered.json: 0x651d883c58d2d23fc5a51f18ca4a42c5bc97f824

# Diff at Fri, 09 Aug 2024 12:46:43 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@55033526285d11b30f44e7cea5874c4f4d65ed80 block: 20017490
- current block number: 20491123

## Description

Two new members added to OwnerMultisig and threshold changed to 4.

## Watched changes

```diff
    contract OwnerMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      values.$members.6:
+        "0xbD8Dc294478ec4dAd9f1b4596bf275f4d0309817"
      values.$members.5:
+        "0x296A19A4e87F5824DBE8DEd53415A4704538bB30"
      values.$members.4:
-        "0xbD8Dc294478ec4dAd9f1b4596bf275f4d0309817"
+        "0xB3669C058ddF26171Fd131D80C801AaEeb1519b8"
      values.$members.3:
-        "0x5C40EC9b11673925405ac132d248973a2b9d5cD4"
+        "0xdb6c271060571A96A62E3947E373395C89f765Ba"
      values.$members.2:
-        "0xdAeDdFC3D4f10650E22939e6992349127C3F8C36"
+        "0x5F1A23A3baB949D7264AfA4E6fbfEB245685E6B5"
      values.$members.1:
-        "0x869896ac62ADc693322F461ded2fe4452bA74Ac3"
+        "0x3d395f623D8954d71132F5caC10778CA275806e0"
      values.$members.0:
-        "0x5F1A23A3baB949D7264AfA4E6fbfEB245685E6B5"
+        "0x37AC4a9Bf184aa1130016525631f3Daec11f7b26"
      values.$threshold:
-        2
+        4
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "4 of 7 (57%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20017490 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x5F1A23A3baB949D7264AfA4E6fbfEB245685E6B5","0x869896ac62ADc693322F461ded2fe4452bA74Ac3","0xdAeDdFC3D4f10650E22939e6992349127C3F8C36","0x5C40EC9b11673925405ac132d248973a2b9d5cD4","0xbD8Dc294478ec4dAd9f1b4596bf275f4d0309817"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x5F1A23A3baB949D7264AfA4E6fbfEB245685E6B5","0x869896ac62ADc693322F461ded2fe4452bA74Ac3","0xdAeDdFC3D4f10650E22939e6992349127C3F8C36","0x5C40EC9b11673925405ac132d248973a2b9d5cD4","0xbD8Dc294478ec4dAd9f1b4596bf275f4d0309817"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract ProxyAdmin (0xdE2BCd3F0297d29c25e83228E5A33C0b43b51Ec8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932","0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6"]
      assignedPermissions.upgrade:
+        ["0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932","0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6"]
    }
```

Generated with discovered.json: 0xbe66c42100b192b9fe49446658eb9a038aec2906

# Diff at Tue, 30 Jul 2024 11:12:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20017490
- current block number: 20017490

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20017490 (main branch discovery), not current.

```diff
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    +++ description: None
      fieldMeta:
+        {"withdrawalDelay":{"severity":"MEDIUM","description":"Delay in seconds of any withdrawals submitted after the withdrawal queue is activated."},"withdrawalQueueActivated":{"severity":"LOW","description":"If true, the withdrawal queue is activated and any withdrawals are delayed for a duration defined by withdrawalDelay. It can be manually activated or automatically triggered by the FlowRate mechanism."}}
    }
```

Generated with discovered.json: 0xbff143ccc78a2ae0361e6da5156907a0666680fe

# Diff at Tue, 04 Jun 2024 09:13:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@35cc9bbe2a9c9163e503882bcb76877c4909bbc9 block: 19976259
- current block number: 20017490

## Description

Added the accesscontrol of the AxelarBridgeAdaptor to discovery, but this changes nothing as the Multisig that is in the permissions section has full control. (as before)

Edit: removed the AxelarGasService contract from this discovery since it is shared infrastructure of the Axelar bridge on Ethereum. (unlike the Adaptor)

The AxelarGasService contract is upgraded, adding L2 gas estimator functions.

### AxelarGasService

The function `updateGasInfo()` is added, allowing a permissioned 'gas price oracle' to update the gas price for destination L2s.
The new `payGas()` function then allows bridgers to pre-pay the gas for arbitrary contract calls at the destination.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976259 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712)
    +++ description: None
```

```diff
    contract RootAxelarBridgeAdaptor (0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xD2C37fC6fD89563187f3679304975655e448D192"]},"0x77eacfcb6207f26b72edc4f15c48e5518843e7e98ccfd7e0d6c16f92ed1fef8d":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xD2C37fC6fD89563187f3679304975655e448D192"]},"0x2b5bda39c23731c6890b6a6f985ff1c326c66dc20aa14dc2e50fc5ec656ecc35":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xD2C37fC6fD89563187f3679304975655e448D192"]},"0x28a0840e09502c63ed1e83b95421995a3ea654657390bb15ac27b2b85aef53b2":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xD2C37fC6fD89563187f3679304975655e448D192"]}}
    }
```

```diff
-   Status: DELETED
    contract Operators (0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC)
    +++ description: None
```

Generated with discovered.json: 0x6890d0d61e53889a889b7b86778403a6408d5a49

# Diff at Wed, 29 May 2024 14:58:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19531603
- current block number: 19976259

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531603 (main branch discovery), not current.

```diff
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x6f24A47Fc8AE5441Eb47EFfC3665e70e69Ac3F05"
    }
```

Generated with discovered.json: 0x738db2dd660800d0d4677bb76f9739d2c25bd55a

# Diff at Thu, 28 Mar 2024 09:05:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19468251
- current block number: 19531603

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19468251 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x2535ef632d848e630a8cb963806d8bd0a005df36

# Diff at Mon, 18 Mar 2024 07:41:50 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6554807e96aa5206aec95eab7b2ae23cf107941b block: 19439872
- current block number: 19460262

## Description

Withdrawal queue disabled. The queue gets triggered more and more often by 'large' withdrawals.

## Watched changes

```diff
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    +++ description: None
+++ description: If true, the withdrawal queue is activated and any withdrawals are delayed for a duration defined by withdrawalDelay. It can be manually activated or automatically triggered by the FlowRate mechanism.
+++ type: RISK_PARAMETER
+++ severity: LOW
      values.withdrawalQueueActivated:
-        true
+        false
    }
```

Generated with discovered.json: 0xcba4559c3490aac950c853627fe016a9837d784a

# Diff at Fri, 15 Mar 2024 10:53:09 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6a294996c13c1a3ad00c7c4d72e651e8fbd4fa1c block: 19431934
- current block number: 19439872

## Description

Will be active for 24h for all withdrawals.

## Watched changes

```diff
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    +++ description: None
+++ description: If true, the withdrawal queue is activated and any withdrawals are delayed for a duration defined by withdrawalDelay. It can be manually activated or automatically triggered by the FlowRate mechanism.
+++ type: RISK_PARAMETER
+++ severity: MEDIUM
      values.withdrawalQueueActivated:
-        false
+        true
    }
```

Generated with discovered.json: 0x7ef088f542869071a0bbceb84a19be2a8d1c3b56

# Diff at Wed, 07 Feb 2024 10:24:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19175701

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    }
```

```diff
+   Status: CREATED
    contract AxelarGatewayProxyMultisig (0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    }
```

```diff
+   Status: CREATED
    contract RootAxelarBridgeAdaptor (0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932) {
    }
```

```diff
+   Status: CREATED
    contract Operators (0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC) {
    }
```

```diff
+   Status: CREATED
    contract ChildERC20 (0x8804A8aA1F18f23aE8A456dD73806FdA3219FaD1) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    }
```

```diff
+   Status: CREATED
    contract OwnerMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xdE2BCd3F0297d29c25e83228E5A33C0b43b51Ec8) {
    }
```
