Generated with discovered.json: 0x2906b512f8787bfd800fa8f3ebf29cd82ee2be6c

# Diff at Tue, 29 Apr 2025 08:19:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22323047
- current block number: 22323047

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22323047 (main branch discovery), not current.

```diff
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A) {
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract DomainRoutingIsm (0x630011A3e7Dc73fE6aA9F95C7549F0bAaaa46944) {
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","description":"manage the domain -> ISM contract mapping.","via":[]}]
    }
```

```diff
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543) {
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions:
-        [{"permission":"interact","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","description":"change the default ISM and hooks for this chain that are used for all connected contracts that do not override them.","via":[]},{"permission":"interact","to":"0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751","description":"verify messages for destination contracts that do not specify a custom ISM.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09) {
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c) {
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e","via":[{"address":"0x9Fca159607687AE26367d66166e680A930af0780"}]}]
    }
```

```diff
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7) {
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2) {
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0xCEA8039076E35a825854c5C2f85659430b06ec96","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0xCEA8039076E35a825854c5C2f85659430b06ec96","via":[{"address":"0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"}]}]
    }
```

```diff
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
      issuedPermissions:
-        [{"permission":"validateBridge2","to":"0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc","via":[]},{"permission":"validateBridge2","to":"0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97","via":[]},{"permission":"validateBridge2","to":"0xEa83086a62617A7228ce4206FAe2ea8b0ab23513","via":[]},{"permission":"validateBridge2","to":"0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0","via":[]}]
    }
```

Generated with discovered.json: 0x7aab1fcae3f6fd561d1708cb9783b33df61d4c01

# Diff at Tue, 22 Apr 2025 12:16:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@60b07eece04f1a17d258d39ff1adffbef4174f23 block: 22187330
- current block number: 22323047

## Description

New ISMs, no validation changes for eclipse.

## Watched changes

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620)
    +++ description: None
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.9:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"0xe1De9910fe71cC216490AC7FCF019e13a34481D7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"0xc2495f3183F043627CAECD56dAaa726e3B2D9c09","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"0x647C621CEb36853Ef6A907E397Adf18568E70543","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.4:
-        {"permission":"interact","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","description":"change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A) {
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543) {
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659) {
    +++ description: None
      values.owner:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions.2.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751"
      issuedPermissions.1.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+        "verify messages for destination contracts that do not specify a custom ISM."
      issuedPermissions.0.to:
-        "0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
      issuedPermissions.0.description:
-        "verify messages for destination contracts that do not specify a custom ISM."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77"
+        "0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751"
      values.owner:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09) {
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7) {
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
-   Status: DELETED
    contract  (0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x630011A3e7Dc73fE6aA9F95C7549F0bAaaa46944)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xb7d55490065c157352b2a560bb3eFf5d5c548563)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

## Source code changes

```diff
.../GnosisSafe.sol                                 |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 5 files changed, 2595 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187330 (main branch discovery), not current.

```diff
    contract DomainRoutingIsm (0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"manage the domain -> ISM contract mapping.","via":[]}]
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.8.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.7.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.6.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.description:
-        "manage the domain -> ISM contract mapping."
      receivedPermissions.5.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
    }
```

```diff
    contract StaticAggregationIsm (0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      values.modules:
-        ["0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620","0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075"]
      values.threshold:
-        2
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
    contract  (0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

Generated with discovered.json: 0x057c152a2765cbb9ea3b3a3c754b4f7ea4685376

# Diff at Thu, 10 Apr 2025 14:42:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22187330
- current block number: 22187330

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187330 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm_default (0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620,0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
    }
```

```diff
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
    }
```

Generated with discovered.json: 0x85e36eaf7f20a51742108b0294367ffd5da6d2fb

# Diff at Thu, 03 Apr 2025 09:10:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 22123446
- current block number: 22187330

## Description

core isms updated, eclipse-specific stay the same.

## Watched changes

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x0115b6ea2933C11540079E55E16A940fd9856c83)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.8.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.7.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.6.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620"
      receivedPermissions.5.via:
-        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.5.description:
+        "manage the domain -> ISM contract mapping."
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446)
    +++ description: None
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions.1.to:
-        "0x0115b6ea2933C11540079E55E16A940fd9856c83"
+        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
      issuedPermissions.1.description:
-        "verify messages for destination contracts that do not specify a custom ISM."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      issuedPermissions.0.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77"
      issuedPermissions.0.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+        "verify messages for destination contracts that do not specify a custom ISM."
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0x0115b6ea2933C11540079E55E16A940fd9856c83"
+        "0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77"
    }
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620,0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075)
    +++ description: None
```

## Source code changes

```diff
.../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 3 files changed, 1607 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22123446 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (0x0115b6ea2933C11540079E55E16A940fd9856c83) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4,0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4","0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446"]
      values.threshold:
-        2
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.8.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.7.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.6.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.5.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.4.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.4.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.3.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.2.from:
-        "0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.2.description:
-        "manage the domain -> ISM contract mapping."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
    }
```

```diff
    contract DomainRoutingIsm (0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"manage the domain -> ISM contract mapping.","via":[]}]
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
    contract  (0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

Generated with discovered.json: 0x8c4d7d163cc32685f33e18d345152dac8c38d162

# Diff at Tue, 25 Mar 2025 11:01:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 21880791
- current block number: 22123446

## Description

ISMs upgraded. Security config unchanged.

## Watched changes

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.8.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.7.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.6.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.5.via:
-        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.5.description:
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.4.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.4.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
      receivedPermissions.3.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.2.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4"
      receivedPermissions.2.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "manage the domain -> ISM contract mapping."
    }
```

```diff
-   Status: DELETED
    contract  (0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x57e1787fbdCCf7516721DC621CE17C45509cc2DB)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions.1.to:
-        "0x57e1787fbdCCf7516721DC621CE17C45509cc2DB"
+        "0x0115b6ea2933C11540079E55E16A940fd9856c83"
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0x57e1787fbdCCf7516721DC621CE17C45509cc2DB"
+        "0x0115b6ea2933C11540079E55E16A940fd9856c83"
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0xc72f634784EA020b703E11e88582Beb5903792b9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x0115b6ea2933C11540079E55E16A940fd9856c83)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4,0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

## Source code changes

```diff
.../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 3 files changed, 1607 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880791 (main branch discovery), not current.

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.8.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.7.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.6.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.5.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.4.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.4.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.3.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.2.from:
-        "0xc72f634784EA020b703E11e88582Beb5903792b9"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.2.description:
-        "manage the domain -> ISM contract mapping."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
    }
```

```diff
    contract  (0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

```diff
    contract StaticAggregationIsm (0x57e1787fbdCCf7516721DC621CE17C45509cc2DB) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835,0xc72f634784EA020b703E11e88582Beb5903792b9] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835","0xc72f634784EA020b703E11e88582Beb5903792b9"]
      values.threshold:
-        2
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
    contract DomainRoutingIsm (0xc72f634784EA020b703E11e88582Beb5903792b9) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"manage the domain -> ISM contract mapping.","via":[]}]
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x5de36f6992b9663de49dade5b19b045b10233eb6

# Diff at Wed, 19 Mar 2025 13:04:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21880791
- current block number: 21880791

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880791 (main branch discovery), not current.

```diff
    contract undefined (0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xEa83086a62617A7228ce4206FAe2ea8b0ab23513) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x100f5c842b2d8b6ecd6182e44058e2dbed0dca9f

# Diff at Tue, 04 Mar 2025 10:39:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21880791
- current block number: 21880791

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880791 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08) {
    +++ description: None
      sinceBlock:
+        21128399
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      sinceBlock:
+        18978558
    }
```

```diff
    contract UnknownIsm (0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835) {
    +++ description: None
      sinceBlock:
+        21876325
    }
```

```diff
    contract StaticAggregationIsm_default (0x57e1787fbdCCf7516721DC621CE17C45509cc2DB) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835,0xc72f634784EA020b703E11e88582Beb5903792b9] ISM contracts successfully verify a message.
      sinceBlock:
+        21876328
    }
```

```diff
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A) {
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        21092922
    }
```

```diff
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543) {
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        21092900
    }
```

```diff
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659) {
    +++ description: None
      sinceBlock:
+        16271449
    }
```

```diff
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780) {
    +++ description: None
      sinceBlock:
+        21271791
    }
```

```diff
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
      sinceBlock:
+        20742981
    }
```

```diff
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e) {
    +++ description: None
      sinceBlock:
+        13805677
    }
```

```diff
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
      sinceBlock:
+        20742978
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      sinceBlock:
+        18422582
    }
```

```diff
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09) {
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        20785910
    }
```

```diff
    contract DomainRoutingIsm (0xc72f634784EA020b703E11e88582Beb5903792b9) {
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
      sinceBlock:
+        21876321
    }
```

```diff
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96) {
    +++ description: None
      sinceBlock:
+        19459281
    }
```

```diff
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c) {
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        21271799
    }
```

```diff
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7) {
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        20785718
    }
```

```diff
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2) {
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        21128407
    }
```

```diff
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
      sinceBlock:
+        20742975
    }
```

Generated with discovered.json: 0x2aacb4b3b45af51ed19fddac263e2826cdab5baf

# Diff at Wed, 19 Feb 2025 13:56:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@90e939c93581cd5b2e00d23bb3ba08dde38932e8 block: 21816462
- current block number: 21880791

## Description

New routing ISMs deployed without affecting the watched security config (eclipse), disco config updated.

## Watched changes

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x011a0D839e043D74c1073337DBf449ac47b82405)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x26a3D8C5b70abb99828997b94D53d3c193A0F24b)
    +++ description: None
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xe1De9910fe71cC216490AC7FCF019e13a34481D7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.8.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.7.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.6.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.5.via:
-        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.5.description:
+        "change the ISM and hooks, whitelist new routes and update destination fees."
      receivedPermissions.4.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc72f634784EA020b703E11e88582Beb5903792b9"
      receivedPermissions.4.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "manage the domain -> ISM contract mapping."
      severity:
+        "HIGH"
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions.1.to:
-        "0xd27fe5631533a193776A61B600809a73256eF9a7"
+        "0x57e1787fbdCCf7516721DC621CE17C45509cc2DB"
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0xd27fe5631533a193776A61B600809a73256eF9a7"
+        "0x57e1787fbdCCf7516721DC621CE17C45509cc2DB"
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0xd27fe5631533a193776A61B600809a73256eF9a7)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x57e1787fbdCCf7516721DC621CE17C45509cc2DB)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835,0xc72f634784EA020b703E11e88582Beb5903792b9] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0xc72f634784EA020b703E11e88582Beb5903792b9)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

## Source code changes

```diff
.../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 3 files changed, 1607 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21816462 (main branch discovery), not current.

```diff
    contract DomainRoutingIsm (0x011a0D839e043D74c1073337DBf449ac47b82405) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"manage the domain -> ISM contract mapping.","via":[]}]
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

```diff
    contract  (0x26a3D8C5b70abb99828997b94D53d3c193A0F24b) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      severity:
-        "HIGH"
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xe1De9910fe71cC216490AC7FCF019e13a34481D7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.8.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.7.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.6.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.5.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
      receivedPermissions.5.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.4.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.3.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.3.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
      receivedPermissions.2.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.2.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.1.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.0.from:
-        "0x011a0D839e043D74c1073337DBf449ac47b82405"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.0.description:
-        "manage the domain -> ISM contract mapping."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
    contract StaticAggregationIsm (0xd27fe5631533a193776A61B600809a73256eF9a7) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x011a0D839e043D74c1073337DBf449ac47b82405,0x26a3D8C5b70abb99828997b94D53d3c193A0F24b] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["0x011a0D839e043D74c1073337DBf449ac47b82405","0x26a3D8C5b70abb99828997b94D53d3c193A0F24b"]
      values.threshold:
-        2
    }
```

Generated with discovered.json: 0xe15df813d52d414c3cf9a7e9ef950c6bb747eb6e

# Diff at Mon, 10 Feb 2025 13:45:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2b0c549e9be2ec1627969531e2ff05c01d31a788 block: 21808054
- current block number: 21816462

## Description

Add description to explain the differences between the two multisigs that can be used.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808054 (main branch discovery), not current.

```diff
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
      description:
-        "An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time."
+        "An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages."
    }
```

Generated with discovered.json: 0xb96ca09ceb1ec8cb97c9551db7056e11394d3075

# Diff at Sun, 09 Feb 2025 14:57:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21808054

## Description

Initial discovery: Token bridge with lane-specific confiuigurable security and chain-specific default security configs.

## Initial discovery

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x011a0D839e043D74c1073337DBf449ac47b82405)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0x26a3D8C5b70abb99828997b94D53d3c193A0F24b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A)
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543)
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
```

```diff
+   Status: CREATED
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239)
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09)
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0xd27fe5631533a193776A61B600809a73256eF9a7)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x011a0D839e043D74c1073337DBf449ac47b82405,0x26a3D8C5b70abb99828997b94D53d3c193A0F24b] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c)
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7)
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2)
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
```
