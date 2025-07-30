Generated with discovered.json: 0xa6b4541561b4468e4e5deacfc8e62e05d63ce72a

# Diff at Mon, 14 Jul 2025 12:46:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22337733
- current block number: 22337733

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22337733 (main branch discovery), not current.

```diff
    contract ERC1155Predicate (0x0057bed57066F61c64DACB395B38c6E1792e03B8) {
    +++ description: None
      address:
-        "0x0057bed57066F61c64DACB395B38c6E1792e03B8"
+        "eth:0x0057bed57066F61c64DACB395B38c6E1792e03B8"
      values.$admin:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.$implementation:
-        "0xCbb0D2eCBEDBF2D0F0D5616dFE25bC286D8F8610"
+        "eth:0xCbb0D2eCBEDBF2D0F0D5616dFE25bC286D8F8610"
      values.$pastUpgrades.0.2.0:
-        "0xCbb0D2eCBEDBF2D0F0D5616dFE25bC286D8F8610"
+        "eth:0xCbb0D2eCBEDBF2D0F0D5616dFE25bC286D8F8610"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.1:
-        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      values.implementation:
-        "0xCbb0D2eCBEDBF2D0F0D5616dFE25bC286D8F8610"
+        "eth:0xCbb0D2eCBEDBF2D0F0D5616dFE25bC286D8F8610"
      values.proxyOwner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0x0057bed57066F61c64DACB395B38c6E1792e03B8:
-        "ERC1155PredicateProxy"
      implementationNames.0xCbb0D2eCBEDBF2D0F0D5616dFE25bC286D8F8610:
-        "ERC1155Predicate"
      implementationNames.eth:0x0057bed57066F61c64DACB395B38c6E1792e03B8:
+        "ERC1155PredicateProxy"
      implementationNames.eth:0xCbb0D2eCBEDBF2D0F0D5616dFE25bC286D8F8610:
+        "ERC1155Predicate"
    }
```

```diff
    contract MintableERC721Predicate (0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665) {
    +++ description: None
      address:
-        "0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665"
+        "eth:0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665"
      values.$admin:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.$implementation:
-        "0x37A9b4e7c327c449858dba9F5e39CE6771cBc31b"
+        "eth:0x37A9b4e7c327c449858dba9F5e39CE6771cBc31b"
      values.$pastUpgrades.0.2.0:
-        "0x37A9b4e7c327c449858dba9F5e39CE6771cBc31b"
+        "eth:0x37A9b4e7c327c449858dba9F5e39CE6771cBc31b"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.1:
-        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      values.implementation:
-        "0x37A9b4e7c327c449858dba9F5e39CE6771cBc31b"
+        "eth:0x37A9b4e7c327c449858dba9F5e39CE6771cBc31b"
      values.proxyOwner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665:
-        "MintableERC721PredicateProxy"
      implementationNames.0x37A9b4e7c327c449858dba9F5e39CE6771cBc31b:
-        "MintableERC721Predicate"
      implementationNames.eth:0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665:
+        "MintableERC721PredicateProxy"
      implementationNames.eth:0x37A9b4e7c327c449858dba9F5e39CE6771cBc31b:
+        "MintableERC721Predicate"
    }
```

```diff
    contract RootChainManager (0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82) {
    +++ description: Main configuration contract to manage tokens, token types, escrows (predicates) for given token types. It also serves as an entry point for deposits and withdrawals effectively acting as a token router.
      address:
-        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      values.$admin:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.$implementation:
-        "0x1b50d902F01ad1e6358FD6116BC115E0a43Fe925"
+        "eth:0x1b50d902F01ad1e6358FD6116BC115E0a43Fe925"
      values.$pastUpgrades.0.2.0:
-        "0x1b50d902F01ad1e6358FD6116BC115E0a43Fe925"
+        "eth:0x1b50d902F01ad1e6358FD6116BC115E0a43Fe925"
      values.checkpointManagerAddress:
-        "0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
+        "eth:0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
      values.childChainManagerAddress:
-        "0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4"
+        "eth:0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4"
      values.ETHER_ADDRESS:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.implementation:
-        "0x1b50d902F01ad1e6358FD6116BC115E0a43Fe925"
+        "eth:0x1b50d902F01ad1e6358FD6116BC115E0a43Fe925"
      values.PREDICATES.0:
-        "0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa"
+        "eth:0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa"
      values.PREDICATES.1:
-        "0x98C831cFB18852f7deB3E3a970e907475b49730f"
+        "eth:0x98C831cFB18852f7deB3E3a970e907475b49730f"
      values.PREDICATES.2:
-        "0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665"
+        "eth:0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665"
      values.PREDICATES.3:
-        "0x0057bed57066F61c64DACB395B38c6E1792e03B8"
+        "eth:0x0057bed57066F61c64DACB395B38c6E1792e03B8"
      values.PREDICATES.4:
-        "0xc3897302aB4B42931cB4857050Fa60f53B775870"
+        "eth:0xc3897302aB4B42931cB4857050Fa60f53B775870"
      values.proxyOwner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.stateSenderAddress:
-        "0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C"
+        "eth:0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C"
      implementationNames.0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82:
-        "RootChainManagerProxy"
      implementationNames.0x1b50d902F01ad1e6358FD6116BC115E0a43Fe925:
-        "RootChainManager"
      implementationNames.eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82:
+        "RootChainManagerProxy"
      implementationNames.eth:0x1b50d902F01ad1e6358FD6116BC115E0a43Fe925:
+        "RootChainManager"
    }
```

```diff
    contract EventsHub (0x12185669Dac70749f717247971E0B8819b2e472e) {
    +++ description: None
      address:
-        "0x12185669Dac70749f717247971E0B8819b2e472e"
+        "eth:0x12185669Dac70749f717247971E0B8819b2e472e"
      values.$admin:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.$implementation:
-        "0x01E988D4b8E86496a45C842E60155a9472541266"
+        "eth:0x01E988D4b8E86496a45C842E60155a9472541266"
      values.implementation:
-        "0x01E988D4b8E86496a45C842E60155a9472541266"
+        "eth:0x01E988D4b8E86496a45C842E60155a9472541266"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.registry:
-        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
+        "eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      implementationNames.0x12185669Dac70749f717247971E0B8819b2e472e:
-        "EventsHubProxy"
      implementationNames.0x01E988D4b8E86496a45C842E60155a9472541266:
-        "EventsHub"
      implementationNames.eth:0x12185669Dac70749f717247971E0B8819b2e472e:
+        "EventsHubProxy"
      implementationNames.eth:0x01E988D4b8E86496a45C842E60155a9472541266:
+        "EventsHub"
    }
```

```diff
    contract StakeManagerExtension (0x17174796E0eF24330aed565c87Ba5e85431DE19e) {
    +++ description: Contract primarily used to check whether a validator is whitelisted or not. It also provides the ability to update the validator registry address.
      address:
-        "0x17174796E0eF24330aed565c87Ba5e85431DE19e"
+        "eth:0x17174796E0eF24330aed565c87Ba5e85431DE19e"
      values.eventsHub:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.extensionCode:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.governance:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.logger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.NFTContract:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.registry:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rootChain:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.token:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.validatorRegistry:
-        "0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6"
+        "eth:0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6"
      values.validatorShareFactory:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x17174796E0eF24330aed565c87Ba5e85431DE19e:
-        "StakeManagerExtension"
      implementationNames.eth:0x17174796E0eF24330aed565c87Ba5e85431DE19e:
+        "StakeManagerExtension"
    }
```

```diff
    contract Merkle (0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2) {
    +++ description: None
      address:
-        "0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2"
+        "eth:0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2"
      implementationNames.0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2:
-        "Merkle"
      implementationNames.eth:0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2:
+        "Merkle"
    }
```

```diff
    contract StateSender (0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C) {
    +++ description: Smart contract allowing whitelisted addresses to send messages to contracts on the child chain.
      address:
-        "0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C"
+        "eth:0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.REGISTRATIONS.0:
-        "0x885fcE983b6a01633f764325B8c3c5D31032C995"
+        "eth:0x885fcE983b6a01633f764325B8c3c5D31032C995"
      values.REGISTRATIONS.1:
-        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      implementationNames.0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C:
-        "StateSender"
      implementationNames.eth:0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C:
+        "StateSender"
    }
```

```diff
    contract StakingNFT (0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0) {
    +++ description: None
      address:
-        "0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0"
+        "eth:0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0"
      values.getApproved.0:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getApproved.1:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getApproved.2:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getApproved.3:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x65218A41Fb92637254B4f8c97448d3dF343A3064"
+        "eth:0x65218A41Fb92637254B4f8c97448d3dF343A3064"
      values.ownerOf.0:
-        "0xf6aA8B10bAA3C228fC94F3344b4a4A3BBf152CCd"
+        "eth:0xf6aA8B10bAA3C228fC94F3344b4a4A3BBf152CCd"
      values.ownerOf.1:
-        "0xb5f7d2A522cB918C3364529b65440a83fab7407C"
+        "eth:0xb5f7d2A522cB918C3364529b65440a83fab7407C"
      values.ownerOf.2:
-        "0xF41a8315531d225AcC889C207aF7638adDCcf948"
+        "eth:0xF41a8315531d225AcC889C207aF7638adDCcf948"
      values.ownerOf.3:
-        "0xF0Bf9BA7B71646d73a393d805CaF0c7e67C06a0F"
+        "eth:0xF0Bf9BA7B71646d73a393d805CaF0c7e67C06a0F"
      implementationNames.0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0:
-        "StakingNFT"
      implementationNames.eth:0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0:
+        "StakingNFT"
    }
```

```diff
    contract StakingInfo (0x539964b3d225194717fb896D26c8b3E635b8A1aE) {
    +++ description: Contains logging and getter functions about staking.
      address:
-        "0x539964b3d225194717fb896D26c8b3E635b8A1aE"
+        "eth:0x539964b3d225194717fb896D26c8b3E635b8A1aE"
      values.getStakerDetails.0.4:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.registry:
-        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
+        "eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      implementationNames.0x539964b3d225194717fb896D26c8b3E635b8A1aE:
-        "StakingInfo"
      implementationNames.eth:0x539964b3d225194717fb896D26c8b3E635b8A1aE:
+        "StakingInfo"
    }
```

```diff
    contract ValidatorRegistry (0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6) {
    +++ description: Defines the whitelist of validators that can stake and therefore participate in the PoS consensus protocol.
      address:
-        "0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6"
+        "eth:0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6:
-        "ValidatorRegistry"
      implementationNames.eth:0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6:
+        "ValidatorRegistry"
    }
```

```diff
    contract WithdrawalManager (0x5F683665ca87dbC3D1358913da80e3C71c328Fb0) {
    +++ description: Contract handling users’ withdrawal finalization for tokens escrowed in DepositManager.
      address:
-        "0x5F683665ca87dbC3D1358913da80e3C71c328Fb0"
+        "eth:0x5F683665ca87dbC3D1358913da80e3C71c328Fb0"
      values.$implementation:
-        "0xA5E0bD9dc1F1d55e53ca87496731aE6B768094D3"
+        "eth:0xA5E0bD9dc1F1d55e53ca87496731aE6B768094D3"
      values.exitNft:
-        "0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307"
+        "eth:0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307"
      values.implementation:
-        "0xA5E0bD9dc1F1d55e53ca87496731aE6B768094D3"
+        "eth:0xA5E0bD9dc1F1d55e53ca87496731aE6B768094D3"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0x5F683665ca87dbC3D1358913da80e3C71c328Fb0:
-        "WithdrawManagerProxy"
      implementationNames.0xA5E0bD9dc1F1d55e53ca87496731aE6B768094D3:
-        "WithdrawManager"
      implementationNames.eth:0x5F683665ca87dbC3D1358913da80e3C71c328Fb0:
+        "WithdrawManagerProxy"
      implementationNames.eth:0xA5E0bD9dc1F1d55e53ca87496731aE6B768094D3:
+        "WithdrawManager"
    }
```

```diff
    contract StakeManager (0x65218A41Fb92637254B4f8c97448d3dF343A3064) {
    +++ description: None
      address:
-        "0x65218A41Fb92637254B4f8c97448d3dF343A3064"
+        "eth:0x65218A41Fb92637254B4f8c97448d3dF343A3064"
      values.$admin:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.$implementation:
-        "0x1be79AED4088A55f5ED249a14f777758d9F888c6"
+        "eth:0x1be79AED4088A55f5ED249a14f777758d9F888c6"
      values.$pastUpgrades.0.2.0:
-        "0xa5eeE6a1478c9c1b80f6f242D230C309107Cc584"
+        "eth:0xa5eeE6a1478c9c1b80f6f242D230C309107Cc584"
      values.$pastUpgrades.1.2.0:
-        "0x1be79AED4088A55f5ED249a14f777758d9F888c6"
+        "eth:0x1be79AED4088A55f5ED249a14f777758d9F888c6"
      values.eventsHub:
-        "0x12185669Dac70749f717247971E0B8819b2e472e"
+        "eth:0x12185669Dac70749f717247971E0B8819b2e472e"
      values.extensionCode:
-        "0x17174796E0eF24330aed565c87Ba5e85431DE19e"
+        "eth:0x17174796E0eF24330aed565c87Ba5e85431DE19e"
      values.getRegistry:
-        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
+        "eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      values.governance:
-        "0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
+        "eth:0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
      values.implementation:
-        "0x1be79AED4088A55f5ED249a14f777758d9F888c6"
+        "eth:0x1be79AED4088A55f5ED249a14f777758d9F888c6"
      values.logger:
-        "0x539964b3d225194717fb896D26c8b3E635b8A1aE"
+        "eth:0x539964b3d225194717fb896D26c8b3E635b8A1aE"
      values.NFTContract:
-        "0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0"
+        "eth:0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.ownerOf.0:
-        "0xf6aA8B10bAA3C228fC94F3344b4a4A3BBf152CCd"
+        "eth:0xf6aA8B10bAA3C228fC94F3344b4a4A3BBf152CCd"
      values.ownerOf.1:
-        "0xb5f7d2A522cB918C3364529b65440a83fab7407C"
+        "eth:0xb5f7d2A522cB918C3364529b65440a83fab7407C"
      values.ownerOf.2:
-        "0xF41a8315531d225AcC889C207aF7638adDCcf948"
+        "eth:0xF41a8315531d225AcC889C207aF7638adDCcf948"
      values.ownerOf.3:
-        "0xF0Bf9BA7B71646d73a393d805CaF0c7e67C06a0F"
+        "eth:0xF0Bf9BA7B71646d73a393d805CaF0c7e67C06a0F"
      values.registry:
-        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
+        "eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      values.rootChain:
-        "0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
+        "eth:0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
      values.token:
-        "0x9813037ee2218799597d83D4a5B6F3b6778218d9"
+        "eth:0x9813037ee2218799597d83D4a5B6F3b6778218d9"
      values.validatorShareFactory:
-        "0x6113E0FDBe8EAE2e95F4a35cB0a6530c518881fD"
+        "eth:0x6113E0FDBe8EAE2e95F4a35cB0a6530c518881fD"
      implementationNames.0x65218A41Fb92637254B4f8c97448d3dF343A3064:
-        "StakeManagerProxy"
      implementationNames.0x1be79AED4088A55f5ED249a14f777758d9F888c6:
-        "StakeManager"
      implementationNames.eth:0x65218A41Fb92637254B4f8c97448d3dF343A3064:
+        "StakeManagerProxy"
      implementationNames.eth:0x1be79AED4088A55f5ED249a14f777758d9F888c6:
+        "StakeManager"
    }
```

```diff
    contract ERC20Predicate (0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa) {
    +++ description: None
      address:
-        "0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa"
+        "eth:0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa"
      values.$admin:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.$implementation:
-        "0xfffC2D781999F09A8b127f8Ef419a3EeD2EDa1dd"
+        "eth:0xfffC2D781999F09A8b127f8Ef419a3EeD2EDa1dd"
      values.$pastUpgrades.0.2.0:
-        "0xfffC2D781999F09A8b127f8Ef419a3EeD2EDa1dd"
+        "eth:0xfffC2D781999F09A8b127f8Ef419a3EeD2EDa1dd"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.1:
-        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      values.implementation:
-        "0xfffC2D781999F09A8b127f8Ef419a3EeD2EDa1dd"
+        "eth:0xfffC2D781999F09A8b127f8Ef419a3EeD2EDa1dd"
      values.proxyOwner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa:
-        "ERC20PredicateProxy"
      implementationNames.0xfffC2D781999F09A8b127f8Ef419a3EeD2EDa1dd:
-        "ERC20Predicate"
      implementationNames.eth:0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa:
+        "ERC20PredicateProxy"
      implementationNames.eth:0xfffC2D781999F09A8b127f8Ef419a3EeD2EDa1dd:
+        "ERC20Predicate"
    }
```

```diff
    contract ExitNFT (0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307) {
    +++ description: NFTs used to represent a withdrawal in the withdrawal PriorityQueue (Only used for tokens initially deposited via DepositManager).
      address:
-        "0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307"
+        "eth:0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307"
      implementationNames.0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307:
-        "ExitNFT"
      implementationNames.eth:0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307:
+        "ExitNFT"
    }
```

```diff
    EOA  (0x80Cc222EA02F4334F67e9E55E7412fed62599004) {
    +++ description: None
      address:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
    }
```

```diff
    contract DepositManager (0x885fcE983b6a01633f764325B8c3c5D31032C995) {
    +++ description: Contract to deposit and escrow ETH, ERC20 or ERC721 tokens.
      address:
-        "0x885fcE983b6a01633f764325B8c3c5D31032C995"
+        "eth:0x885fcE983b6a01633f764325B8c3c5D31032C995"
      values.$implementation:
-        "0x79a674D373551e6CfD22b2ed65cc1Ac09250F430"
+        "eth:0x79a674D373551e6CfD22b2ed65cc1Ac09250F430"
      values.childChain:
-        "0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2"
+        "eth:0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2"
      values.governance:
-        "0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
+        "eth:0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
      values.implementation:
-        "0x79a674D373551e6CfD22b2ed65cc1Ac09250F430"
+        "eth:0x79a674D373551e6CfD22b2ed65cc1Ac09250F430"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.registry:
-        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
+        "eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      values.rootChain:
-        "0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
+        "eth:0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
      values.stateSender:
-        "0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C"
+        "eth:0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C"
      implementationNames.0x885fcE983b6a01633f764325B8c3c5D31032C995:
-        "DepositManagerProxy"
      implementationNames.0x79a674D373551e6CfD22b2ed65cc1Ac09250F430:
-        "DepositManager"
      implementationNames.eth:0x885fcE983b6a01633f764325B8c3c5D31032C995:
+        "DepositManagerProxy"
      implementationNames.eth:0x79a674D373551e6CfD22b2ed65cc1Ac09250F430:
+        "DepositManager"
    }
```

```diff
    contract SlashingManager (0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce) {
    +++ description: Contract that allows the consensus supermajority to slash validators.
      address:
-        "0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce"
+        "eth:0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce"
      values.logger:
-        "0x539964b3d225194717fb896D26c8b3E635b8A1aE"
+        "eth:0x539964b3d225194717fb896D26c8b3E635b8A1aE"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.registry:
-        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
+        "eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      implementationNames.0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce:
-        "SlashingManager"
      implementationNames.eth:0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce:
+        "SlashingManager"
    }
```

```diff
    contract ERC721Predicate (0x98C831cFB18852f7deB3E3a970e907475b49730f) {
    +++ description: None
      address:
-        "0x98C831cFB18852f7deB3E3a970e907475b49730f"
+        "eth:0x98C831cFB18852f7deB3E3a970e907475b49730f"
      values.$admin:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.$implementation:
-        "0xe0f4555Fcffb181B1D7566d89200105226F29580"
+        "eth:0xe0f4555Fcffb181B1D7566d89200105226F29580"
      values.$pastUpgrades.0.2.0:
-        "0x67281E19c31B19f5450d1F218AA29e036C606fC0"
+        "eth:0x67281E19c31B19f5450d1F218AA29e036C606fC0"
      values.$pastUpgrades.1.2.0:
-        "0xe0f4555Fcffb181B1D7566d89200105226F29580"
+        "eth:0xe0f4555Fcffb181B1D7566d89200105226F29580"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.1:
-        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      values.implementation:
-        "0xe0f4555Fcffb181B1D7566d89200105226F29580"
+        "eth:0xe0f4555Fcffb181B1D7566d89200105226F29580"
      values.proxyOwner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0x98C831cFB18852f7deB3E3a970e907475b49730f:
-        "ERC721PredicateProxy"
      implementationNames.0xe0f4555Fcffb181B1D7566d89200105226F29580:
-        "ERC721Predicate"
      implementationNames.eth:0x98C831cFB18852f7deB3E3a970e907475b49730f:
+        "ERC721PredicateProxy"
      implementationNames.eth:0xe0f4555Fcffb181B1D7566d89200105226F29580:
+        "ERC721Predicate"
    }
```

```diff
    contract ERC721Predicate (0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3) {
    +++ description: None
      address:
-        "0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3"
+        "eth:0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3"
      implementationNames.0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3:
-        "ERC721PredicateBurnOnly"
      implementationNames.eth:0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3:
+        "ERC721PredicateBurnOnly"
    }
```

```diff
    EOA  (0xb5f7d2A522cB918C3364529b65440a83fab7407C) {
    +++ description: None
      address:
-        "0xb5f7d2A522cB918C3364529b65440a83fab7407C"
+        "eth:0xb5f7d2A522cB918C3364529b65440a83fab7407C"
    }
```

```diff
    contract RLPReader (0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4) {
    +++ description: None
      address:
-        "0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4"
+        "eth:0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4"
      implementationNames.0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4:
-        "RLPReader"
      implementationNames.eth:0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4:
+        "RLPReader"
    }
```

```diff
    contract EtherPredicate (0xc3897302aB4B42931cB4857050Fa60f53B775870) {
    +++ description: None
      address:
-        "0xc3897302aB4B42931cB4857050Fa60f53B775870"
+        "eth:0xc3897302aB4B42931cB4857050Fa60f53B775870"
      values.$admin:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.$implementation:
-        "0x3f3bF9Ce73CE5a152561f4BF0306de3E3526f8FA"
+        "eth:0x3f3bF9Ce73CE5a152561f4BF0306de3E3526f8FA"
      values.$pastUpgrades.0.2.0:
-        "0x3f3bF9Ce73CE5a152561f4BF0306de3E3526f8FA"
+        "eth:0x3f3bF9Ce73CE5a152561f4BF0306de3E3526f8FA"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.0:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      values.accessControl.MANAGER_ROLE.members.1:
-        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      values.implementation:
-        "0x3f3bF9Ce73CE5a152561f4BF0306de3E3526f8FA"
+        "eth:0x3f3bF9Ce73CE5a152561f4BF0306de3E3526f8FA"
      values.proxyOwner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0xc3897302aB4B42931cB4857050Fa60f53B775870:
-        "EtherPredicateProxy"
      implementationNames.0x3f3bF9Ce73CE5a152561f4BF0306de3E3526f8FA:
-        "EtherPredicate"
      implementationNames.eth:0xc3897302aB4B42931cB4857050Fa60f53B775870:
+        "EtherPredicateProxy"
      implementationNames.eth:0x3f3bF9Ce73CE5a152561f4BF0306de3E3526f8FA:
+        "EtherPredicate"
    }
```

```diff
    contract Governance (0xC476E20c2F7FA3B35aC242aBE71B59e902242f06) {
    +++ description: Simple contract that allows the owner to call an `update` function on arbitrary contracts.
      address:
-        "0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
+        "eth:0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
      values.$implementation:
-        "0x3ca9770a30c61e6cF0a4bDD66A26Cee61AE51e65"
+        "eth:0x3ca9770a30c61e6cF0a4bDD66A26Cee61AE51e65"
      values.implementation:
-        "0x3ca9770a30c61e6cF0a4bDD66A26Cee61AE51e65"
+        "eth:0x3ca9770a30c61e6cF0a4bDD66A26Cee61AE51e65"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0xC476E20c2F7FA3B35aC242aBE71B59e902242f06:
-        "GovernanceProxy"
      implementationNames.0x3ca9770a30c61e6cF0a4bDD66A26Cee61AE51e65:
-        "Governance"
      implementationNames.eth:0xC476E20c2F7FA3B35aC242aBE71B59e902242f06:
+        "GovernanceProxy"
      implementationNames.eth:0x3ca9770a30c61e6cF0a4bDD66A26Cee61AE51e65:
+        "Governance"
    }
```

```diff
    contract RootChain (0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9) {
    +++ description: Contract storing chain checkpoints. Note that validity of these checkpoints is not verified, it is assumed to be valid if signed by 2/3 of the validators.
      address:
-        "0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
+        "eth:0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
      values.$implementation:
-        "0xb3bfb2aE369a0e9D9735ac679e4A14eD81E837fA"
+        "eth:0xb3bfb2aE369a0e9D9735ac679e4A14eD81E837fA"
      values.constructorArgs._proxyTo:
-        "0xb3bfb2aE369a0e9D9735ac679e4A14eD81E837fA"
+        "eth:0xb3bfb2aE369a0e9D9735ac679e4A14eD81E837fA"
      values.constructorArgs._registry:
-        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
+        "eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      values.implementation:
-        "0xb3bfb2aE369a0e9D9735ac679e4A14eD81E837fA"
+        "eth:0xb3bfb2aE369a0e9D9735ac679e4A14eD81E837fA"
      values.owner:
-        "0x80Cc222EA02F4334F67e9E55E7412fed62599004"
+        "eth:0x80Cc222EA02F4334F67e9E55E7412fed62599004"
      implementationNames.0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9:
-        "RootChainProxy"
      implementationNames.0xb3bfb2aE369a0e9D9735ac679e4A14eD81E837fA:
-        "RootChain"
      implementationNames.eth:0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9:
+        "RootChainProxy"
      implementationNames.eth:0xb3bfb2aE369a0e9D9735ac679e4A14eD81E837fA:
+        "RootChain"
    }
```

```diff
    contract ERC20Predicate (0xdaF14950155DF895E9D0fd2521D05477d26F462c) {
    +++ description: None
      address:
-        "0xdaF14950155DF895E9D0fd2521D05477d26F462c"
+        "eth:0xdaF14950155DF895E9D0fd2521D05477d26F462c"
      implementationNames.0xdaF14950155DF895E9D0fd2521D05477d26F462c:
-        "ERC20PredicateBurnOnly"
      implementationNames.eth:0xdaF14950155DF895E9D0fd2521D05477d26F462c:
+        "ERC20PredicateBurnOnly"
    }
```

```diff
    EOA  (0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
    +++ description: None
      address:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    }
```

```diff
    EOA  (0xF0Bf9BA7B71646d73a393d805CaF0c7e67C06a0F) {
    +++ description: None
      address:
-        "0xF0Bf9BA7B71646d73a393d805CaF0c7e67C06a0F"
+        "eth:0xF0Bf9BA7B71646d73a393d805CaF0c7e67C06a0F"
    }
```

```diff
    EOA  (0xF41a8315531d225AcC889C207aF7638adDCcf948) {
    +++ description: None
      address:
-        "0xF41a8315531d225AcC889C207aF7638adDCcf948"
+        "eth:0xF41a8315531d225AcC889C207aF7638adDCcf948"
    }
```

```diff
    contract Registry (0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB) {
    +++ description: Maintains the addresses of the contracts used in the system.
      address:
-        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
+        "eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      values.erc20Predicate:
-        "0xdaF14950155DF895E9D0fd2521D05477d26F462c"
+        "eth:0xdaF14950155DF895E9D0fd2521D05477d26F462c"
      values.erc721Predicate:
-        "0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3"
+        "eth:0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3"
      values.getChildChainAndStateSender.0:
-        "0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2"
+        "eth:0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2"
      values.getChildChainAndStateSender.1:
-        "0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C"
+        "eth:0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C"
      values.getDepositManagerAddress:
-        "0x885fcE983b6a01633f764325B8c3c5D31032C995"
+        "eth:0x885fcE983b6a01633f764325B8c3c5D31032C995"
      values.getSlashingManagerAddress:
-        "0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce"
+        "eth:0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce"
      values.getStakeManagerAddress:
-        "0x65218A41Fb92637254B4f8c97448d3dF343A3064"
+        "eth:0x65218A41Fb92637254B4f8c97448d3dF343A3064"
      values.getValidatorShareAddress:
-        "0xe99f1001c8afD34AcF0CEd6aD33137DeE8D81dE6"
+        "eth:0xe99f1001c8afD34AcF0CEd6aD33137DeE8D81dE6"
      values.getWethTokenAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getWithdrawManagerAddress:
-        "0x5F683665ca87dbC3D1358913da80e3C71c328Fb0"
+        "eth:0x5F683665ca87dbC3D1358913da80e3C71c328Fb0"
      values.governance:
-        "0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
+        "eth:0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
      implementationNames.0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB:
-        "Registry"
      implementationNames.eth:0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB:
+        "Registry"
    }
```

```diff
    EOA  (0xf6aA8B10bAA3C228fC94F3344b4a4A3BBf152CCd) {
    +++ description: None
      address:
-        "0xf6aA8B10bAA3C228fC94F3344b4a4A3BBf152CCd"
+        "eth:0xf6aA8B10bAA3C228fC94F3344b4a4A3BBf152CCd"
    }
```

```diff
+   Status: CREATED
    contract ERC1155Predicate (0x0057bed57066F61c64DACB395B38c6E1792e03B8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintableERC721Predicate (0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChainManager (0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82)
    +++ description: Main configuration contract to manage tokens, token types, escrows (predicates) for given token types. It also serves as an entry point for deposits and withdrawals effectively acting as a token router.
```

```diff
+   Status: CREATED
    contract EventsHub (0x12185669Dac70749f717247971E0B8819b2e472e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeManagerExtension (0x17174796E0eF24330aed565c87Ba5e85431DE19e)
    +++ description: Contract primarily used to check whether a validator is whitelisted or not. It also provides the ability to update the validator registry address.
```

```diff
+   Status: CREATED
    contract Merkle (0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateSender (0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C)
    +++ description: Smart contract allowing whitelisted addresses to send messages to contracts on the child chain.
```

```diff
+   Status: CREATED
    contract StakingNFT (0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingInfo (0x539964b3d225194717fb896D26c8b3E635b8A1aE)
    +++ description: Contains logging and getter functions about staking.
```

```diff
+   Status: CREATED
    contract ValidatorRegistry (0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6)
    +++ description: Defines the whitelist of validators that can stake and therefore participate in the PoS consensus protocol.
```

```diff
+   Status: CREATED
    contract WithdrawalManager (0x5F683665ca87dbC3D1358913da80e3C71c328Fb0)
    +++ description: Contract handling users’ withdrawal finalization for tokens escrowed in DepositManager.
```

```diff
+   Status: CREATED
    contract StakeManager (0x65218A41Fb92637254B4f8c97448d3dF343A3064)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Predicate (0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExitNFT (0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307)
    +++ description: NFTs used to represent a withdrawal in the withdrawal PriorityQueue (Only used for tokens initially deposited via DepositManager).
```

```diff
+   Status: CREATED
    contract DepositManager (0x885fcE983b6a01633f764325B8c3c5D31032C995)
    +++ description: Contract to deposit and escrow ETH, ERC20 or ERC721 tokens.
```

```diff
+   Status: CREATED
    contract SlashingManager (0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce)
    +++ description: Contract that allows the consensus supermajority to slash validators.
```

```diff
+   Status: CREATED
    contract ERC721Predicate (0x98C831cFB18852f7deB3E3a970e907475b49730f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC721Predicate (0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RLPReader (0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherPredicate (0xc3897302aB4B42931cB4857050Fa60f53B775870)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0xC476E20c2F7FA3B35aC242aBE71B59e902242f06)
    +++ description: Simple contract that allows the owner to call an `update` function on arbitrary contracts.
```

```diff
+   Status: CREATED
    contract RootChain (0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9)
    +++ description: Contract storing chain checkpoints. Note that validity of these checkpoints is not verified, it is assumed to be valid if signed by 2/3 of the validators.
```

```diff
+   Status: CREATED
    contract ERC20Predicate (0xdaF14950155DF895E9D0fd2521D05477d26F462c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB)
    +++ description: Maintains the addresses of the contracts used in the system.
```

Generated with discovered.json: 0x9cc15bc1b954366d8116b38baf19b382be7a8dec

# Diff at Fri, 04 Jul 2025 12:19:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22337733
- current block number: 22337733

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22337733 (main branch discovery), not current.

```diff
    EOA  (0x80Cc222EA02F4334F67e9E55E7412fed62599004) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x17174796E0eF24330aed565c87Ba5e85431DE19e"
+        "eth:0x17174796E0eF24330aed565c87Ba5e85431DE19e"
      receivedPermissions.1.from:
-        "ethereum:0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6"
+        "eth:0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6"
      receivedPermissions.2.from:
-        "ethereum:0x65218A41Fb92637254B4f8c97448d3dF343A3064"
+        "eth:0x65218A41Fb92637254B4f8c97448d3dF343A3064"
      receivedPermissions.3.from:
-        "ethereum:0x885fcE983b6a01633f764325B8c3c5D31032C995"
+        "eth:0x885fcE983b6a01633f764325B8c3c5D31032C995"
      receivedPermissions.4.from:
-        "ethereum:0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce"
+        "eth:0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce"
      receivedPermissions.5.from:
-        "ethereum:0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
+        "eth:0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
      receivedPermissions.6.from:
-        "ethereum:0x0057bed57066F61c64DACB395B38c6E1792e03B8"
+        "eth:0x0057bed57066F61c64DACB395B38c6E1792e03B8"
      receivedPermissions.7.from:
-        "ethereum:0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665"
+        "eth:0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665"
      receivedPermissions.8.from:
-        "ethereum:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "eth:0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      receivedPermissions.9.from:
-        "ethereum:0x12185669Dac70749f717247971E0B8819b2e472e"
+        "eth:0x12185669Dac70749f717247971E0B8819b2e472e"
      receivedPermissions.10.from:
-        "ethereum:0x65218A41Fb92637254B4f8c97448d3dF343A3064"
+        "eth:0x65218A41Fb92637254B4f8c97448d3dF343A3064"
      receivedPermissions.11.from:
-        "ethereum:0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa"
+        "eth:0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa"
      receivedPermissions.12.from:
-        "ethereum:0x98C831cFB18852f7deB3E3a970e907475b49730f"
+        "eth:0x98C831cFB18852f7deB3E3a970e907475b49730f"
      receivedPermissions.13.from:
-        "ethereum:0xc3897302aB4B42931cB4857050Fa60f53B775870"
+        "eth:0xc3897302aB4B42931cB4857050Fa60f53B775870"
    }
```

Generated with discovered.json: 0x6d5b534c34ccd08c50b9cdd591ceda8f79a08dc3

# Diff at Fri, 23 May 2025 09:41:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22337733
- current block number: 22337733

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22337733 (main branch discovery), not current.

```diff
    EOA  (0x80Cc222EA02F4334F67e9E55E7412fed62599004) {
    +++ description: None
      receivedPermissions.13.role:
+        "admin"
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        ".owner"
      receivedPermissions.4.role:
+        ".owner"
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x5f36b4a9ce32e9d3b0a08ab0a31c509bd0dd3c44

# Diff at Tue, 06 May 2025 10:56:56 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 22337733
- current block number: 22337733

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22337733 (main branch discovery), not current.

```diff
    EOA  (0x80Cc222EA02F4334F67e9E55E7412fed62599004) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x3f85bd4a1efe34151c12907fa962c743e13bd8cc

# Diff at Tue, 29 Apr 2025 08:19:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22337733
- current block number: 22337733

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22337733 (main branch discovery), not current.

```diff
    contract ERC1155Predicate (0x0057bed57066F61c64DACB395B38c6E1792e03B8) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}]
    }
```

```diff
    contract MintableERC721Predicate (0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}]
    }
```

```diff
    contract RootChainManager (0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82) {
    +++ description: Main configuration contract to manage tokens, token types, escrows (predicates) for given token types. It also serves as an entry point for deposits and withdrawals effectively acting as a token router.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}]
    }
```

```diff
    contract EventsHub (0x12185669Dac70749f717247971E0B8819b2e472e) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}]
    }
```

```diff
    contract StakeManagerExtension (0x17174796E0eF24330aed565c87Ba5e85431DE19e) {
    +++ description: Contract primarily used to check whether a validator is whitelisted or not. It also provides the ability to update the validator registry address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","description":"can update the validator registry address used to check whitelist inclusion.","via":[]}]
    }
```

```diff
    contract ValidatorRegistry (0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6) {
    +++ description: Defines the whitelist of validators that can stake and therefore participate in the PoS consensus protocol.
      issuedPermissions:
-        [{"permission":"interact","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","description":"can update the whitelist of validators","via":[]}]
    }
```

```diff
    contract StakeManager (0x65218A41Fb92637254B4f8c97448d3dF343A3064) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","description":"can replace all validators.","via":[]},{"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}]
    }
```

```diff
    contract ERC20Predicate (0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}]
    }
```

```diff
    contract DepositManager (0x885fcE983b6a01633f764325B8c3c5D31032C995) {
    +++ description: Contract to deposit and escrow ETH, ERC20 or ERC721 tokens.
      issuedPermissions:
-        [{"permission":"interact","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","description":"can update the root chain it references.","via":[]}]
    }
```

```diff
    contract SlashingManager (0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce) {
    +++ description: Contract that allows the consensus supermajority to slash validators.
      issuedPermissions:
-        [{"permission":"interact","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","description":"can update how much of the slashed funds go to the proposer and reporter.","via":[]}]
    }
```

```diff
    contract ERC721Predicate (0x98C831cFB18852f7deB3E3a970e907475b49730f) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}]
    }
```

```diff
    contract EtherPredicate (0xc3897302aB4B42931cB4857050Fa60f53B775870) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}]
    }
```

```diff
    contract RootChain (0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9) {
    +++ description: Contract storing chain checkpoints. Note that validity of these checkpoints is not verified, it is assumed to be valid if signed by 2/3 of the validators.
      issuedPermissions:
-        [{"permission":"interact","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","description":"can delete arbitrary checkpoints.","via":[]}]
    }
```

Generated with discovered.json: 0x4001f17ec85b943d1a0c2cf5f8df5214763ca204

# Diff at Tue, 22 Apr 2025 14:34:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@883eec4b9450268891e59913a801e0da5ddff219 block: 22266722
- current block number: 22324571

## Description

Contracts have been verified, mainly the ones regarding StakeManager. Everything is practically identical to Polygon PoS, except that to join the validator set you need to be whitelisted.

## Watched changes

```diff
    contract StakeManager (0x65218A41Fb92637254B4f8c97448d3dF343A3064) {
    +++ description: None
      values.delegatorsReward.3:
-        "137524527461779631638"
+        "109467320641385679508"
      values.delegatorsReward.2:
-        "31505383038278874498"
+        "209217921475560211751"
      values.delegatorsReward.1:
-        "31034346349265424252"
+        "46086307030217220592"
      values.delegatorsReward.0:
-        "311850291839562954995"
+        "86098662800150278851"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22266722 (main branch discovery), not current.

```diff
    contract StateSender (0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C) {
    +++ description: Smart contract allowing whitelisted addresses to send messages to contracts on the child chain.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract WithdrawalManager (0x5F683665ca87dbC3D1358913da80e3C71c328Fb0) {
    +++ description: Contract handling users’ withdrawal finalization for tokens escrowed in DepositManager.
      unverified:
-        true
      template:
+        "polygonposbridge/WithdrawManager"
      sourceHashes:
+        ["0xda0990aeeb22bcf3c867d4f398d00bd7d2f15aef3add8c60800711185b34a09c","0x7ff7f5fd1ef5fec15bf32c69a0cdd350dc14edf95e739c32035dddde5009e3c0"]
      description:
+        "Contract handling users’ withdrawal finalization for tokens escrowed in DepositManager."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract StakeManager (0x65218A41Fb92637254B4f8c97448d3dF343A3064) {
    +++ description: None
      unverified:
-        true
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x80Cc222EA02F4334F67e9E55E7412fed62599004","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.description:
+        "can replace all validators."
      values.auctionPeriod:
+        0
      values.CHECKPOINT_REWARD:
+        "100000000000000000000"
      values.checkPointBlockInterval:
+        1024
      values.checkpointRewardDelta:
+        0
      values.currentValidatorSetSize:
+        12
      values.delegationEnabled:
+        true
      values.delegatorsReward:
+        ["311850291839562954995","31034346349265424252","31505383038278874498","137524527461779631638"]
      values.dynasty:
+        1
      values.eventsHub:
+        "0x12185669Dac70749f717247971E0B8819b2e472e"
      values.extensionCode:
+        "0x17174796E0eF24330aed565c87Ba5e85431DE19e"
      values.getRegistry:
+        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      values.governance:
+        "0xC476E20c2F7FA3B35aC242aBE71B59e902242f06"
      values.isOwner:
+        false
      values.locked:
+        false
      values.logger:
+        "0x539964b3d225194717fb896D26c8b3E635b8A1aE"
      values.maxRewardedCheckpoints:
+        0
      values.minDeposit:
+        "1000000000000000000"
      values.minHeimdallFee:
+        "1000000000000000000"
      values.NFTContract:
+        "0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0"
      values.ownerOf:
+        ["0xF41a8315531d225AcC889C207aF7638adDCcf948","0xF0Bf9BA7B71646d73a393d805CaF0c7e67C06a0F","0xb5f7d2A522cB918C3364529b65440a83fab7407C","0xf6aA8B10bAA3C228fC94F3344b4a4A3BBf152CCd"]
      values.prevBlockInterval:
+        0
      values.proposerBonus:
+        10
      values.registry:
+        "0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB"
      values.replacementCoolDown:
+        13608
      values.rewardDecreasePerCheckpoint:
+        0
      values.rootChain:
+        "0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
      values.signerUpdateLimit:
+        100
      values.token:
+        "0x9813037ee2218799597d83D4a5B6F3b6778218d9"
      values.totalRewards:
+        0
      values.validatorShareFactory:
+        "0x6113E0FDBe8EAE2e95F4a35cB0a6530c518881fD"
      values.validatorThreshold:
+        15
      values.WITHDRAWAL_DELAY:
+        1
      values.withdrawalDelay:
+        1
      template:
+        "polygonposbridge/StakeManager_shibarium"
      sourceHashes:
+        ["0x315e4278520bf097047cc2be4371ac60125bba1043fa4e97e7054988fe3ba503","0x0e16b120e42fc8b8c6ed46c538b263aa895b463415254eba82cc25e7d104a136"]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract undefined (0x80Cc222EA02F4334F67e9E55E7412fed62599004) {
    +++ description: None
      receivedPermissions.13:
+        {"permission":"upgrade","from":"0x98C831cFB18852f7deB3E3a970e907475b49730f"}
      receivedPermissions.12:
+        {"permission":"upgrade","from":"0x65218A41Fb92637254B4f8c97448d3dF343A3064"}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665"}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x12185669Dac70749f717247971E0B8819b2e472e"}
      receivedPermissions.9.from:
-        "0x98C831cFB18852f7deB3E3a970e907475b49730f"
+        "0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa"
      receivedPermissions.8.from:
-        "0x65218A41Fb92637254B4f8c97448d3dF343A3064"
+        "0xc3897302aB4B42931cB4857050Fa60f53B775870"
      receivedPermissions.7.from:
-        "0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665"
+        "0x0057bed57066F61c64DACB395B38c6E1792e03B8"
      receivedPermissions.6.from:
-        "0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa"
+        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0xc3897302aB4B42931cB4857050Fa60f53B775870"
+        "0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6"
      receivedPermissions.5.description:
+        "can update the whitelist of validators"
      receivedPermissions.4.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.4.from:
-        "0x0057bed57066F61c64DACB395B38c6E1792e03B8"
+        "0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
      receivedPermissions.4.description:
+        "can delete arbitrary checkpoints."
      receivedPermissions.3.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.3.from:
-        "0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82"
+        "0x17174796E0eF24330aed565c87Ba5e85431DE19e"
      receivedPermissions.3.description:
+        "can update the validator registry address used to check whitelist inclusion."
      receivedPermissions.2.from:
-        "0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9"
+        "0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce"
      receivedPermissions.2.description:
-        "can delete arbitrary checkpoints."
+        "can update how much of the slashed funds go to the proposer and reporter."
      receivedPermissions.1.from:
-        "0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce"
+        "0x65218A41Fb92637254B4f8c97448d3dF343A3064"
      receivedPermissions.1.description:
-        "can update how much of the slashed funds go to the proposer and reporter."
+        "can replace all validators."
    }
```

```diff
    contract ERC721Predicate (0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3) {
    +++ description: None
      unverified:
-        true
      values.CHAINID:
+        109
      values.networkId:
+        "0x6d"
      sourceHashes:
+        ["0xd28d2832fa5e35e810073b99fcec18faf119bfc95223abc05bfb353a1f90dfd3"]
    }
```

```diff
    contract Governance (0xC476E20c2F7FA3B35aC242aBE71B59e902242f06) {
    +++ description: Simple contract that allows the owner to call an `update` function on arbitrary contracts.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RootChain (0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9) {
    +++ description: Contract storing chain checkpoints. Note that validity of these checkpoints is not verified, it is assumed to be valid if signed by 2/3 of the validators.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Predicate (0xdaF14950155DF895E9D0fd2521D05477d26F462c) {
    +++ description: None
      unverified:
-        true
      values.CHAINID:
+        109
      values.networkId:
+        "0x6d"
      sourceHashes:
+        ["0xbcd7eec85265625afbc2eb9dda85d5f9134b5a206a965d8f040be01a92d12299"]
    }
```

```diff
-   Status: DELETED
    contract ValidatorShare (0xe99f1001c8afD34AcF0CEd6aD33137DeE8D81dE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EventsHub (0x12185669Dac70749f717247971E0B8819b2e472e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeManagerExtension (0x17174796E0eF24330aed565c87Ba5e85431DE19e)
    +++ description: Contract primarily used to check whether a validator is whitelisted or not. It also provides the ability to update the validator registry address.
```

```diff
+   Status: CREATED
    contract StakingNFT (0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorRegistry (0x53D63B9523Ab13399e2071BB4056bbc7Bf98e6A6)
    +++ description: Defines the whitelist of validators that can stake and therefore participate in the PoS consensus protocol.
```

Generated with discovered.json: 0xd0d871211e1987eadd1af7cec3f1aeb8bcb9654d

# Diff at Mon, 14 Apr 2025 10:46:54 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22266722

## Description

Polygon PoS fork controlled by EOA and lots of unverified contracts.

## Initial discovery

```diff
+   Status: CREATED
    contract ERC1155Predicate (0x0057bed57066F61c64DACB395B38c6E1792e03B8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintableERC721Predicate (0x03c77e03dB8183C8a9eFC178eC1Dfd98c1EfD665)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChainManager (0x08C4b60fda8aA6239b7de7d165BCF6F1686Cad82)
    +++ description: Main configuration contract to manage tokens, token types, escrows (predicates) for given token types. It also serves as an entry point for deposits and withdrawals effectively acting as a token router.
```

```diff
+   Status: CREATED
    contract Merkle (0x32262DDD01fFF9bb367586317A5e40Dbe2bCcbe2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateSender (0x3a122785bC4d951D132B2CAD31FC187D6DC7A21C)
    +++ description: Smart contract allowing whitelisted addresses to send messages to contracts on the child chain.
```

```diff
+   Status: CREATED
    contract StakingInfo (0x539964b3d225194717fb896D26c8b3E635b8A1aE)
    +++ description: Contains logging and getter functions about staking.
```

```diff
+   Status: CREATED
    contract WithdrawalManager (0x5F683665ca87dbC3D1358913da80e3C71c328Fb0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeManager (0x65218A41Fb92637254B4f8c97448d3dF343A3064)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Predicate (0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExitNFT (0x7ad7f98f229c5C1EA5161bEd952c3007DBE1F307)
    +++ description: NFTs used to represent a withdrawal in the withdrawal PriorityQueue (Only used for tokens initially deposited via DepositManager).
```

```diff
+   Status: CREATED
    contract DepositManager (0x885fcE983b6a01633f764325B8c3c5D31032C995)
    +++ description: Contract to deposit and escrow ETH, ERC20 or ERC721 tokens.
```

```diff
+   Status: CREATED
    contract SlashingManager (0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce)
    +++ description: Contract that allows the consensus supermajority to slash validators.
```

```diff
+   Status: CREATED
    contract ERC721Predicate (0x98C831cFB18852f7deB3E3a970e907475b49730f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC721Predicate (0x9df56e63CD340F0f3D811dd2aAAEEa42ec27D5a3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RLPReader (0xc107664eeEEA2c84e51D56F1B7a479EbCf9541c4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EtherPredicate (0xc3897302aB4B42931cB4857050Fa60f53B775870)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0xC476E20c2F7FA3B35aC242aBE71B59e902242f06)
    +++ description: Simple contract that allows the owner to call an `update` function on arbitrary contracts.
```

```diff
+   Status: CREATED
    contract RootChain (0xd46042f503B8Ec0A166af8C0BFbB0a3C562353F9)
    +++ description: Contract storing chain checkpoints. Note that validity of these checkpoints is not verified, it is assumed to be valid if signed by 2/3 of the validators.
```

```diff
+   Status: CREATED
    contract ERC20Predicate (0xdaF14950155DF895E9D0fd2521D05477d26F462c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorShare (0xe99f1001c8afD34AcF0CEd6aD33137DeE8D81dE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0xF486e3B6A432Bdd6EDaAe85a565CD7682A7862BB)
    +++ description: Maintains the addresses of the contracts used in the system.
```
