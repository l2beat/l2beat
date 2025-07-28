Generated with discovered.json: 0x6eeb67f711954cf59c330e9d0db31b428051ee27

# Diff at Mon, 14 Jul 2025 12:44:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22882445
- current block number: 22882445

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22882445 (main branch discovery), not current.

```diff
    contract LayerZero Proof Library (0x07245eEa05826F5984c7c3C8F478b04892e4df89) {
    +++ description: None
      address:
-        "0x07245eEa05826F5984c7c3C8F478b04892e4df89"
+        "eth:0x07245eEa05826F5984c7c3C8F478b04892e4df89"
      values.stargateBridgeAddress:
-        "0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97"
+        "eth:0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97"
      values.stargateTokenAddress:
-        "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"
+        "eth:0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"
      implementationNames.0x07245eEa05826F5984c7c3C8F478b04892e4df89:
-        "FPValidator"
      implementationNames.eth:0x07245eEa05826F5984c7c3C8F478b04892e4df89:
+        "FPValidator"
    }
```

```diff
    EOA  (0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47) {
    +++ description: None
      address:
-        "0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47"
+        "eth:0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47"
    }
```

```diff
    EOA  (0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d) {
    +++ description: None
      address:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "eth:0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
    }
```

```diff
    EOA  (0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437) {
    +++ description: None
      address:
-        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
+        "eth:0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      address:
-        "0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d"
+        "eth:0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      values.uln:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      implementationNames.0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d:
-        "TreasuryV2"
      implementationNames.eth:0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d:
+        "TreasuryV2"
    }
```

```diff
    EOA  (0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346) {
    +++ description: None
      address:
-        "0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
+        "eth:0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      address:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      values.endpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.layerZeroToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.nonceContract:
-        "0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068"
+        "eth:0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      values.treasuryContract:
-        "0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d"
+        "eth:0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d"
      implementationNames.0x4D73AdB72bC3DD368966edD0f0b2148401A178E2:
-        "UltraLightNodeV2"
      implementationNames.eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2:
+        "UltraLightNodeV2"
    }
```

```diff
    contract TokenBridge (0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907) {
    +++ description: None
      address:
-        "0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907"
+        "eth:0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907"
      values.lzEndpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.owner:
-        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
+        "eth:0x65bb797c2B9830d891D87288F029ed8dACc19705"
      values.precrime:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.weth:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907:
-        "TokenBridge"
      implementationNames.eth:0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907:
+        "TokenBridge"
    }
```

```diff
    EOA  (0x565cFd7224bbc2a81a6e2a1464892ecB27efB070) {
    +++ description: None
      address:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "eth:0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
    }
```

```diff
    contract LayerZero Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      address:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
+        "eth:0x5a54fe5234E811466D5366846283323c954310B2"
      values.$admin:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
+        "eth:0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      values.$implementation:
-        "0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"
+        "eth:0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"
      values.$pastUpgrades.0.2.0:
-        "0xccEf13cFEB6873c167f62A365548A57C9ed29DC5"
+        "eth:0xccEf13cFEB6873c167f62A365548A57C9ed29DC5"
      values.$pastUpgrades.1.2.0:
-        "0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"
+        "eth:0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1"
      implementationNames.0x5a54fe5234E811466D5366846283323c954310B2:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1:
-        ""
      implementationNames.eth:0x5a54fe5234E811466D5366846283323c954310B2:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0x3eEA8d627ab6983fFFc7027ee623Fd7699343fc1:
+        ""
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      address:
-        "0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068"
+        "eth:0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068"
      values.endpoint:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      implementationNames.0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068:
-        "NonceContract"
      implementationNames.eth:0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068:
+        "NonceContract"
    }
```

```diff
    EOA  (0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c) {
    +++ description: None
      address:
-        "0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c"
+        "eth:0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c"
    }
```

```diff
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      address:
-        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
+        "eth:0x65bb797c2B9830d891D87288F029ed8dACc19705"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
+        "eth:0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
      values.$members.1:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "eth:0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
      values.$members.2:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "eth:0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
      values.$members.3:
-        "0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523"
+        "eth:0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523"
      values.$members.4:
-        "0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
+        "eth:0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
      values.$members.5:
-        "0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"
+        "eth:0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"
      implementationNames.0x65bb797c2B9830d891D87288F029ed8dACc19705:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x65bb797c2B9830d891D87288F029ed8dACc19705:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      address:
-        "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
+        "eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
      values.defaultReceiveLibraryAddress:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      values.defaultSendLibrary:
-        "0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
+        "eth:0x4D73AdB72bC3DD368966edD0f0b2148401A178E2"
      values.owner:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      implementationNames.0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675:
-        "Endpoint"
      implementationNames.eth:0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675:
+        "Endpoint"
    }
```

```diff
    EOA  (0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e) {
    +++ description: None
      address:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "eth:0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
    }
```

```diff
    EOA  (0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5) {
    +++ description: None
      address:
-        "0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
+        "eth:0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
    }
```

```diff
    EOA  (0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e) {
    +++ description: None
      address:
-        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
+        "eth:0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
    }
```

```diff
    EOA  (0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523) {
    +++ description: None
      address:
-        "0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523"
+        "eth:0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523"
    }
```

```diff
    EOA  (0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8) {
    +++ description: None
      address:
-        "0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8"
+        "eth:0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8"
    }
```

```diff
    EOA  (0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326) {
    +++ description: None
      address:
-        "0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
+        "eth:0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      address:
-        "0x902F09715B6303d4173037652FA7377e5b98089E"
+        "eth:0x902F09715B6303d4173037652FA7377e5b98089E"
      values.$admin:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
+        "eth:0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      values.$implementation:
-        "0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
+        "eth:0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
      values.$pastUpgrades.0.2.0:
-        "0x4E341b9Cf90514A5b7dfec2c9A1f20AA4514C260"
+        "eth:0x4E341b9Cf90514A5b7dfec2c9A1f20AA4514C260"
      values.$pastUpgrades.1.2.0:
-        "0xDD55F55CB9a39EF1eed4Ee1a84EE1b7411bE306a"
+        "eth:0xDD55F55CB9a39EF1eed4Ee1a84EE1b7411bE306a"
      values.$pastUpgrades.2.2.0:
-        "0x9512a85438606dEdE54297634dEd7C7C0c231874"
+        "eth:0x9512a85438606dEdE54297634dEd7C7C0c231874"
      values.$pastUpgrades.3.2.0:
-        "0xaF34771b16960ea77484A866a34CCDAFDc913D9C"
+        "eth:0xaF34771b16960ea77484A866a34CCDAFDc913D9C"
      values.$pastUpgrades.4.2.0:
-        "0x8775e9D584008f84daFe7abe75a62f6C91491027"
+        "eth:0x8775e9D584008f84daFe7abe75a62f6C91491027"
      values.$pastUpgrades.5.2.0:
-        "0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
+        "eth:0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f"
      implementationNames.0x902F09715B6303d4173037652FA7377e5b98089E:
-        "OptimizedTransparentUpgradeableProxy"
      implementationNames.0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f:
-        ""
      implementationNames.eth:0x902F09715B6303d4173037652FA7377e5b98089E:
+        "OptimizedTransparentUpgradeableProxy"
      implementationNames.eth:0xB830a5AfCBEBb936c30C607a18BbbA9f5B0a592f:
+        ""
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      address:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
+        "eth:0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      values.owner:
-        "0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8"
+        "eth:0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8"
      implementationNames.0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8:
-        "ProxyAdmin"
      implementationNames.eth:0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8:
+        "ProxyAdmin"
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      address:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
+        "eth:0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      values.owner:
-        "0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
+        "eth:0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5"
      implementationNames.0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9:
-        "ProxyAdmin"
      implementationNames.eth:0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9:
+        "ProxyAdmin"
    }
```

```diff
    contract LayerZero Multisig (0xBe010A7e3686FdF65E93344ab664D065A0B02478) {
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
      address:
-        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
+        "eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478"
      values.$members.0:
-        "0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47"
+        "eth:0x0cb72C1F6a36c225A7E2B21712E8853A4A1acc47"
      values.$members.1:
-        "0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c"
+        "eth:0x5bC6AA6ad117A8B50ABf9E1658971f5DA1968c5c"
      values.$members.2:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "eth:0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.3:
-        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
+        "eth:0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
      values.$members.4:
-        "0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7"
+        "eth:0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7"
      values.getExecutors.0:
-        "0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
+        "eth:0x39f86ECef62c5bcE23428d6b7c7050D9Ecb0e346"
      implementationNames.0xBe010A7e3686FdF65E93344ab664D065A0B02478:
-        "OneSig"
      implementationNames.eth:0xBe010A7e3686FdF65E93344ab664D065A0B02478:
+        "OneSig"
    }
```

```diff
    EOA  (0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7) {
    +++ description: None
      address:
-        "0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7"
+        "eth:0xe67DB04d7eFF4e9ec282eD929632D4FF058112d7"
    }
```

```diff
    EOA  (0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0) {
    +++ description: None
      address:
-        "0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"
+        "eth:0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"
    }
```

```diff
+   Status: CREATED
    contract LayerZero Proof Library (0x07245eEa05826F5984c7c3C8F478b04892e4df89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenBridge (0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Oracle (0x5a54fe5234E811466D5366846283323c954310B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0xBe010A7e3686FdF65E93344ab664D065A0B02478)
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
```

Generated with discovered.json: 0x7375477f593bbac941a154f4fecfaf248eb87055

# Diff at Wed, 09 Jul 2025 15:17:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d05d4ec9af28b2df4e687d7b7676cddffcae6887 block: 21723791
- current block number: 22882445

## Description

Update LZ Multisig to a custom multisig contract that allows offchain signing with multichain onchain execution.

## Watched changes

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      values.owner:
-        "0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92"
+        "0xBe010A7e3686FdF65E93344ab664D065A0B02478"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Multisig (0xBe010A7e3686FdF65E93344ab664D065A0B02478)
    +++ description: Custom multisignature contract allowing offchain signing and execution on multiple target chains.
```

## Source code changes

```diff
.../GnosisSafe/GnosisSafe.sol => /dev/null         |  953 -------------
 .../GnosisSafe/GnosisSafeProxy.p.sol => /dev/null  |   35 -
 .../aptos/ethereum/.flat/LayerZero Multisig.sol    | 1396 ++++++++++++++++++++
 3 files changed, 1396 insertions(+), 988 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723791 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      name:
-        "LayerZero Multisig"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x2608bf160c939dd3a9c2cad2692ac70e5de6f793

# Diff at Fri, 04 Jul 2025 12:18:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 21723791
- current block number: 21723791

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723791 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5a54fe5234E811466D5366846283323c954310B2"
+        "eth:0x5a54fe5234E811466D5366846283323c954310B2"
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x902F09715B6303d4173037652FA7377e5b98089E"
+        "eth:0x902F09715B6303d4173037652FA7377e5b98089E"
    }
```

Generated with discovered.json: 0x4b888b7ab0cea5accb8c7f6eb8cb36d6178a1cba

# Diff at Fri, 23 May 2025 09:40:53 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21723791
- current block number: 21723791

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723791 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x7e3f219c30ece4549cfc69439642bf8e8be4799f

# Diff at Tue, 06 May 2025 13:14:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b140e89b6bfa22af8e947558a345fd3f6e6cc810 block: 21723791
- current block number: 21723791

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723791 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract  (0x76A15d86FbBe691557C8b7A9C4BebF1d8AFE00A7)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f)
    +++ description: None
```

Generated with discovered.json: 0x391bc4ff23b320306e0943718b46ec3a52d56e70

# Diff at Tue, 29 Apr 2025 08:18:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21723791
- current block number: 21723791

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723791 (main branch discovery), not current.

```diff
    contract LayerZero Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8","via":[]}]
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9","via":[]}]
    }
```

Generated with discovered.json: 0x75936a2650e3803fcf7946bcd9ce20946cb1d10f

# Diff at Tue, 04 Mar 2025 10:38:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21723791
- current block number: 21723791

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21723791 (main branch discovery), not current.

```diff
    contract LayerZero Proof Library (0x07245eEa05826F5984c7c3C8F478b04892e4df89) {
    +++ description: None
      sinceBlock:
+        15757967
    }
```

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      sinceBlock:
+        15416287
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sinceBlock:
+        15416271
    }
```

```diff
    contract TokenBridge (0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907) {
    +++ description: None
      sinceBlock:
+        15778949
    }
```

```diff
    contract LayerZero Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      sinceBlock:
+        15416736
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      sinceBlock:
+        15398311
    }
```

```diff
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      sinceBlock:
+        14402408
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      sinceBlock:
+        14388880
    }
```

```diff
    contract  (0x76A15d86FbBe691557C8b7A9C4BebF1d8AFE00A7) {
    +++ description: None
      sinceBlock:
+        15416447
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      sinceBlock:
+        15416448
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      sinceBlock:
+        15410443
    }
```

```diff
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f) {
    +++ description: None
      sinceBlock:
+        15416732
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      sinceBlock:
+        14388905
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      sinceBlock:
+        14457816
    }
```

Generated with discovered.json: 0xaefc929f2ef58b362f1ec3d4ba7f5bc6db89aeb8

# Diff at Tue, 28 Jan 2025 15:03:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b60bc0e936cb7b213e24f14ed69abaff22493651 block: 21264260
- current block number: 21723791

## Description

LayerZero MS update: members swapped and new member added (now 3/5).

## Watched changes

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$members.4:
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.3:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
+        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
      values.$members.2:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x771dcAcB96024d1e55Fd21Fe8a8187AA7EC9e77e"
      values.$members.1:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x112c737AeEbD2E52DEb9ff5c9c19497F1A1777b0"
      values.$members.0:
-        "0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327"
+        "0xB981a2664f5f547291Df5F8dCD4505f7015912CF"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x24891d63f29248698e043034fe4317d418bb3f93

# Diff at Mon, 20 Jan 2025 11:09:15 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21264260
- current block number: 21264260

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21264260 (main branch discovery), not current.

```diff
    contract LayerZero Oracle (0x5a54fe5234E811466D5366846283323c954310B2) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
      issuedPermissions.0.to:
+        "0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8"
    }
```

```diff
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
      issuedPermissions.0.to:
+        "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9"
    }
```

```diff
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5a54fe5234E811466D5366846283323c954310B2"
      receivedPermissions.0.from:
+        "0x5a54fe5234E811466D5366846283323c954310B2"
    }
```

```diff
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x902F09715B6303d4173037652FA7377e5b98089E"
      receivedPermissions.0.from:
+        "0x902F09715B6303d4173037652FA7377e5b98089E"
    }
```

Generated with discovered.json: 0x78c623776651e930f100b2df64885d0717417a8c

# Diff at Tue, 10 Dec 2024 10:36:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21264260
- current block number: 21264260

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21264260 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract LayerZero Proof Library (0x07245eEa05826F5984c7c3C8F478b04892e4df89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Oracle (0x5a54fe5234E811466D5366846283323c954310B2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x76A15d86FbBe691557C8b7A9C4BebF1d8AFE00A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LayerZero Relayer (0x902F09715B6303d4173037652FA7377e5b98089E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9)
    +++ description: None
```

Generated with discovered.json: 0xb1eda2ab4c32b9d300756514b39f9386692c669c

# Diff at Mon, 25 Nov 2024 10:45:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@62a44faa52866a55f9881cb2852ac75b1fcc60b0 block: 21027624
- current block number: 21264260

## Description

MS signer change.

## Watched changes

```diff
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      values.$members.4:
-        "0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4"
+        "0x7C8D1Db01130acEEc5fF892c99a18c4b4BAdC326"
    }
```

Generated with discovered.json: 0x52d4c1a2aa58abc622344ec257b2ed0e550efb8b

# Diff at Wed, 23 Oct 2024 10:15:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2734bfe28641dfdb3277a5800faf0a057c08a58f block: 19531425
- current block number: 21027624

## Description

LayerZero Multisig: One signer removed.

## Watched changes

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$members.4:
-        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.3:
-        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
+        "0x67FC8c432448f9a8d541C17579EF7a142378d5aD"
      values.$members.2:
-        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
+        "0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e"
      values.$members.1:
-        "0xe095F2590eF1Ab39601445025847Ed8E4B40D687"
+        "0xBb6633cc267951E938F9B6421E4F54aa5b2c1936"
      values.multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x5edefcbfaee2dc55e54c4726350fe9d4b8e0e572

# Diff at Mon, 14 Oct 2024 10:49:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531425
- current block number: 19531425

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531425 (main branch discovery), not current.

```diff
    contract TreasuryV2 (0x3773E1E9Deb273fCdf9f80bc88bB387B1e6Ce34d) {
    +++ description: None
      sourceHashes:
+        ["0x8b908351f18fdaeaf600ae46ef1450c535f741fc95bb25acade77f8b59fdc168"]
    }
```

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
    +++ description: None
      sourceHashes:
+        ["0x38c85ab54f670eaa1fc2b351aee39913bc12e2b26c460ee31cf89d3f1f7d59b9"]
    }
```

```diff
    contract TokenBridge (0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907) {
    +++ description: None
      sourceHashes:
+        ["0xe59a44fb1b8121ccc17fa92e39fdd2b677d3ad575587692f8b1e4351878230d7"]
    }
```

```diff
    contract NonceContract (0x5B905fE05F81F3a8ad8B28C6E17779CFAbf76068) {
    +++ description: None
      sourceHashes:
+        ["0x895867397d61409de8476975bae4d871fec1c289e52fe97b31872726808dae38"]
    }
```

```diff
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
    +++ description: None
      sourceHashes:
+        ["0x945c3299d0cf62b9ea7a77d6328295d54327299d6a153e1e7b48d85fa9b77215"]
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0xe2d563e6f99b0b71e968bb74481d131c4782d1f3

# Diff at Fri, 09 Aug 2024 10:08:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531425
- current block number: 19531425

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531425 (main branch discovery), not current.

```diff
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 6 (50%)"
      values.getOwners:
-        ["0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437","0x565cFd7224bbc2a81a6e2a1464892ecB27efB070","0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d","0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523","0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4","0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437","0x565cFd7224bbc2a81a6e2a1464892ecB27efB070","0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d","0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523","0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4","0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
      values.getOwners:
-        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9F403140Bc0574D7d36eA472b82DAa1Bbd4eF327","0xe095F2590eF1Ab39601445025847Ed8E4B40D687","0xBb6633cc267951E938F9B6421E4F54aa5b2c1936","0x73E9c017Ad37e2113e709D8070Cc9E1b28180e1e","0x67FC8c432448f9a8d541C17579EF7a142378d5aD"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0xcd95aac8d7fd5421aadb26681604d7422d65f018

# Diff at Thu, 28 Mar 2024 08:29:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19168345
- current block number: 19531425

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19168345 (main branch discovery), not current.

```diff
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 6 (50%)"
    }
```

```diff
    contract LayerZero Multisig (0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x695e9666aa1d660f1069614b9e84af2847034ff8

# Diff at Tue, 06 Feb 2024 09:35:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4d639d97ae679e1e3695f59f0c84cca622283ff7 block: 18591456
- current block number: 19168345

## Description

Updated the LayerZero version.
Version 4: `0xd231084bfb234c107d3ee2b22f97f3346fdaf705` (`SendUln301`)
Version 5: `0x245b6e8ffe9ea5fc301e32d16f66bd4c2123eefc` (`ReceiveUln301`)

## Watched changes

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
      values.latestVersion:
-        3
+        5
    }
```

Generated with discovered.json: 0xfefefa739dc46550c8b3cf802febfcaf26f3698d

# Diff at Fri, 17 Nov 2023 12:00:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@8df7aef75226275b8e56ba8d4d76ce64057b0360

## Description

One EOA owner was replaced in Aptos Multisig:

- removed: 0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1
- added: 0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437

The same change was performed on a multisig in the Stargate project.

## Watched changes

```diff
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
      values.getOwners.2:
-        "0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
+        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
      values.getOwners.1:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
      values.getOwners.0:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
    }
```

# Diff at Mon, 02 Oct 2023 13:23:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract TokenBridge (0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907) {
      values.owner:
-        "0x971016EF5Bd9C71fA4ff34D731974d03cEFf5F05"
+        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
    }
```

```diff
-   Status: DELETED
    contract Aptos Multisig (0x971016EF5Bd9C71fA4ff34D731974d03cEFf5F05) {
    }
```

```diff
+   Status: CREATED
    contract Aptos Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
    }
```
