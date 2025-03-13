Generated with discovered.json: 0x0a8f3252c21646c04199331dcbeea782cffbf18a

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
