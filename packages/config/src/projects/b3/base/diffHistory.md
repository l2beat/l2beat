Generated with discovered.json: 0x8a91f14cccbcdfa83bb4edfdaa010c9cc894db2b

# Diff at Mon, 14 Jul 2025 12:44:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 30222921
- current block number: 30222921

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30222921 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "base:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      address:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.addressManager:
-        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
+        "base:0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      values.owner:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
+        "base:0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      implementationNames.0x102e24084a003feEbe57B536a3B4E29eD6AC855A:
-        "ProxyAdmin"
      implementationNames.base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A) {
    +++ description: None
      address:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "base:0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      address:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
+        "base:0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0xb8468fbf63dfbbb62e79b0B890849Fe55Fd09Ef2"
+        "base:0xb8468fbf63dfbbb62e79b0B890849Fe55Fd09Ef2"
      values.$members.1:
-        "0xb268354DC49Cf984306ba8bdcB7c0b1a95f31901"
+        "base:0xb268354DC49Cf984306ba8bdcB7c0b1a95f31901"
      values.$members.2:
-        "0x7B5B1d9d8a51461208a59FAa4c7E58624bB7f02D"
+        "base:0x7B5B1d9d8a51461208a59FAa4c7E58624bB7f02D"
      values.$members.3:
-        "0x28C0a3F0DCE25Cf013Dc86ce1AaDccB8B0758d93"
+        "base:0x28C0a3F0DCE25Cf013Dc86ce1AaDccB8B0758d93"
      values.$members.4:
-        "0x5A17352926d9681990D08771804287c2577e11C7"
+        "base:0x5A17352926d9681990D08771804287c2577e11C7"
      implementationNames.0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.base:0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce:
+        "GnosisSafeProxy"
      implementationNames.base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A) {
    +++ description: None
      address:
-        "0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A"
+        "base:0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A"
    }
```

```diff
    EOA  (0x28C0a3F0DCE25Cf013Dc86ce1AaDccB8B0758d93) {
    +++ description: None
      address:
-        "0x28C0a3F0DCE25Cf013Dc86ce1AaDccB8B0758d93"
+        "base:0x28C0a3F0DCE25Cf013Dc86ce1AaDccB8B0758d93"
    }
```

```diff
    EOA Caldera (0x356000Cec4fC967f8FC372381D983426760A0391) {
    +++ description: None
      address:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "base:0x356000Cec4fC967f8FC372381D983426760A0391"
    }
```

```diff
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
+        "base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
      values.$admin:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.$implementation:
-        "0xce1E945A3426f0521eB9D1Ccc63D6d204bC49D40"
+        "base:0xce1E945A3426f0521eB9D1Ccc63D6d204bC49D40"
      values.$pastUpgrades.0.2.0:
-        "0xce1E945A3426f0521eB9D1Ccc63D6d204bC49D40"
+        "base:0xce1E945A3426f0521eB9D1Ccc63D6d204bC49D40"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "base:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "base:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
+        "base:0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      values.PORTAL:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
+        "base:0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      values.ResolvedDelegateProxy_addressManager:
-        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
+        "base:0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      values.superchainConfig:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
+        "base:0xe736142a3e957660cBae61AC4bD61e5b65635140"
      values.systemConfig:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
+        "base:0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      implementationNames.0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867:
-        "ResolvedDelegateProxy"
      implementationNames.0xce1E945A3426f0521eB9D1Ccc63D6d204bC49D40:
-        "L1CrossDomainMessenger"
      implementationNames.base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867:
+        "ResolvedDelegateProxy"
      implementationNames.base:0xce1E945A3426f0521eB9D1Ccc63D6d204bC49D40:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
+        "base:0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      values.$admin:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.$implementation:
-        "0x602267995C801D85b4b854817D0a2231f64C3D7D"
+        "base:0x602267995C801D85b4b854817D0a2231f64C3D7D"
      values.$pastUpgrades.0.2.0:
-        "0x602267995C801D85b4b854817D0a2231f64C3D7D"
+        "base:0x602267995C801D85b4b854817D0a2231f64C3D7D"
      values.guardian:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
+        "base:0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      values.l2Oracle:
-        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
+        "base:0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "base:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
+        "base:0xe736142a3e957660cBae61AC4bD61e5b65635140"
      values.systemConfig:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
+        "base:0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      implementationNames.0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794:
-        "Proxy"
      implementationNames.0x602267995C801D85b4b854817D0a2231f64C3D7D:
-        "OptimismPortal"
      implementationNames.base:0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794:
+        "Proxy"
      implementationNames.base:0x602267995C801D85b4b854817D0a2231f64C3D7D:
+        "OptimismPortal"
    }
```

```diff
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
+        "base:0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      values.$admin:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.$implementation:
-        "0xd2227e78ee343a0d6166B4Bd5a18Ebb286c8Cc05"
+        "base:0xd2227e78ee343a0d6166B4Bd5a18Ebb286c8Cc05"
      values.$pastUpgrades.0.2.0:
-        "0xd2227e78ee343a0d6166B4Bd5a18Ebb286c8Cc05"
+        "base:0xd2227e78ee343a0d6166B4Bd5a18Ebb286c8Cc05"
      values.messenger:
-        "0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
+        "base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
      values.MESSENGER:
-        "0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
+        "base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "base:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "base:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
+        "base:0xe736142a3e957660cBae61AC4bD61e5b65635140"
      implementationNames.0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A:
-        "Proxy"
      implementationNames.0xd2227e78ee343a0d6166B4Bd5a18Ebb286c8Cc05:
-        "L1ERC721Bridge"
      implementationNames.base:0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A:
+        "Proxy"
      implementationNames.base:0xd2227e78ee343a0d6166B4Bd5a18Ebb286c8Cc05:
+        "L1ERC721Bridge"
    }
```

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
+        "base:0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      values.$admin:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.$implementation:
-        "0x0167E10be3293266c7F0f1b42E1a8906E638d0cb"
+        "base:0x0167E10be3293266c7F0f1b42E1a8906E638d0cb"
      values.$pastUpgrades.0.2.0:
-        "0x0167E10be3293266c7F0f1b42E1a8906E638d0cb"
+        "base:0x0167E10be3293266c7F0f1b42E1a8906E638d0cb"
+++ severity: HIGH
      values.challenger:
-        "0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
+        "base:0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
      values.CHALLENGER:
-        "0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
+        "base:0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
+++ severity: HIGH
      values.proposer:
-        "0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
+        "base:0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
      values.PROPOSER:
-        "0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
+        "base:0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
      implementationNames.0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595:
-        "Proxy"
      implementationNames.0x0167E10be3293266c7F0f1b42E1a8906E638d0cb:
-        "L2OutputOracle"
      implementationNames.base:0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595:
+        "Proxy"
      implementationNames.base:0x0167E10be3293266c7F0f1b42E1a8906E638d0cb:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0x54bB68f8FE08Ff315DBe1A89265103ebcDcFfd39) {
    +++ description: None
      address:
-        "0x54bB68f8FE08Ff315DBe1A89265103ebcDcFfd39"
+        "base:0x54bB68f8FE08Ff315DBe1A89265103ebcDcFfd39"
    }
```

```diff
    EOA  (0x5A17352926d9681990D08771804287c2577e11C7) {
    +++ description: None
      address:
-        "0x5A17352926d9681990D08771804287c2577e11C7"
+        "base:0x5A17352926d9681990D08771804287c2577e11C7"
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
+        "base:0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      values.$admin:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.$implementation:
-        "0x4bFC8d6bE2843626A1186bd6eEfAD1297650470a"
+        "base:0x4bFC8d6bE2843626A1186bd6eEfAD1297650470a"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "base:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
+        "base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
      values.MESSENGER:
-        "0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
+        "base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "base:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "base:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
+        "base:0xe736142a3e957660cBae61AC4bD61e5b65635140"
      values.systemConfig:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
+        "base:0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      implementationNames.0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38:
-        "L1ChugSplashProxy"
      implementationNames.0x4bFC8d6bE2843626A1186bd6eEfAD1297650470a:
-        "L1StandardBridge"
      implementationNames.base:0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38:
+        "L1ChugSplashProxy"
      implementationNames.base:0x4bFC8d6bE2843626A1186bd6eEfAD1297650470a:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0x7B5B1d9d8a51461208a59FAa4c7E58624bB7f02D) {
    +++ description: None
      address:
-        "0x7B5B1d9d8a51461208a59FAa4c7E58624bB7f02D"
+        "base:0x7B5B1d9d8a51461208a59FAa4c7E58624bB7f02D"
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      address:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
+        "base:0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
+        "base:0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
      values.$members.1:
-        "0x356000Cec4fC967f8FC372381D983426760A0391"
+        "base:0x356000Cec4fC967f8FC372381D983426760A0391"
      values.$members.2:
-        "0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
+        "base:0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A"
      implementationNames.0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.base:0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d:
+        "GnosisSafeProxy"
      implementationNames.base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
+        "base:0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      values.$admin:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.$implementation:
-        "0xb482529Ce853b8a883db28D53190FCcf44AEbF09"
+        "base:0xb482529Ce853b8a883db28D53190FCcf44AEbF09"
      values.$pastUpgrades.0.2.0:
-        "0xb482529Ce853b8a883db28D53190FCcf44AEbF09"
+        "base:0xb482529Ce853b8a883db28D53190FCcf44AEbF09"
      values.bridge:
-        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
+        "base:0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      values.BRIDGE:
-        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
+        "base:0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      implementationNames.0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06:
-        "Proxy"
      implementationNames.0xb482529Ce853b8a883db28D53190FCcf44AEbF09:
-        "OptimismMintableERC20Factory"
      implementationNames.base:0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06:
+        "Proxy"
      implementationNames.base:0xb482529Ce853b8a883db28D53190FCcf44AEbF09:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d) {
    +++ description: None
      address:
-        "0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
+        "base:0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
+        "base:0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      values.$admin:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.$implementation:
-        "0x14f5488aE20C2B591CD36D2Aa3Bc28442ed6d71a"
+        "base:0x14f5488aE20C2B591CD36D2Aa3Bc28442ed6d71a"
      values.$pastUpgrades.0.2.0:
-        "0x14f5488aE20C2B591CD36D2Aa3Bc28442ed6d71a"
+        "base:0x14f5488aE20C2B591CD36D2Aa3Bc28442ed6d71a"
      values.batcherHash:
-        "0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A"
+        "base:0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A"
      values.batchInbox:
-        "0xFc536AB2Cc1e784Ae181ca8A23b3E9C828B934A8"
+        "base:0xFc536AB2Cc1e784Ae181ca8A23b3E9C828B934A8"
      values.disputeGameFactory:
-        "0xadA565Abc1Fe7358259c22dd0A7372229d943388"
+        "base:0xadA565Abc1Fe7358259c22dd0A7372229d943388"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "base:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.l1CrossDomainMessenger:
-        "0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
+        "base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867"
      values.l1ERC721Bridge:
-        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
+        "base:0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      values.l1StandardBridge:
-        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
+        "base:0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      values.optimismMintableERC20Factory:
-        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
+        "base:0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      values.optimismPortal:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
+        "base:0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      values.owner:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
+        "base:0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      values.sequencerInbox:
-        "0xFc536AB2Cc1e784Ae181ca8A23b3E9C828B934A8"
+        "base:0xFc536AB2Cc1e784Ae181ca8A23b3E9C828B934A8"
      values.unsafeBlockSigner:
-        "0x54bB68f8FE08Ff315DBe1A89265103ebcDcFfd39"
+        "base:0x54bB68f8FE08Ff315DBe1A89265103ebcDcFfd39"
      implementationNames.0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad:
-        "Proxy"
      implementationNames.0x14f5488aE20C2B591CD36D2Aa3Bc28442ed6d71a:
-        "SystemConfig"
      implementationNames.base:0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad:
+        "Proxy"
      implementationNames.base:0x14f5488aE20C2B591CD36D2Aa3Bc28442ed6d71a:
+        "SystemConfig"
    }
```

```diff
    EOA  (0xb268354DC49Cf984306ba8bdcB7c0b1a95f31901) {
    +++ description: None
      address:
-        "0xb268354DC49Cf984306ba8bdcB7c0b1a95f31901"
+        "base:0xb268354DC49Cf984306ba8bdcB7c0b1a95f31901"
    }
```

```diff
    EOA  (0xb8468fbf63dfbbb62e79b0B890849Fe55Fd09Ef2) {
    +++ description: None
      address:
-        "0xb8468fbf63dfbbb62e79b0B890849Fe55Fd09Ef2"
+        "base:0xb8468fbf63dfbbb62e79b0B890849Fe55Fd09Ef2"
    }
```

```diff
    EOA  (0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9) {
    +++ description: None
      address:
-        "0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
+        "base:0xD61640d06dC7A61C46d9515680b4DDd2AC51E9A9"
    }
```

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
+        "base:0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      values.owner:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      implementationNames.0xd79005b0f06b2C518893d2Ba31f94429e555b6b1:
-        "AddressManager"
      implementationNames.base:0xd79005b0f06b2C518893d2Ba31f94429e555b6b1:
+        "AddressManager"
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
+        "base:0xe736142a3e957660cBae61AC4bD61e5b65635140"
      values.$admin:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
+        "base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      values.$implementation:
-        "0xAd41C2437Cb1327149e4e635caCE7c74d408be98"
+        "base:0xAd41C2437Cb1327149e4e635caCE7c74d408be98"
      values.$pastUpgrades.0.2.0:
-        "0xAd41C2437Cb1327149e4e635caCE7c74d408be98"
+        "base:0xAd41C2437Cb1327149e4e635caCE7c74d408be98"
      values.guardian:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
+        "base:0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      implementationNames.0xe736142a3e957660cBae61AC4bD61e5b65635140:
-        "Proxy"
      implementationNames.0xAd41C2437Cb1327149e4e635caCE7c74d408be98:
-        "SuperchainConfig"
      implementationNames.base:0xe736142a3e957660cBae61AC4bD61e5b65635140:
+        "Proxy"
      implementationNames.base:0xAd41C2437Cb1327149e4e635caCE7c74d408be98:
+        "SuperchainConfig"
    }
```

```diff
    EOA  (0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff) {
    +++ description: None
      address:
-        "0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
+        "base:0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
    }
```

```diff
    EOA  (0xFc536AB2Cc1e784Ae181ca8A23b3E9C828B934A8) {
    +++ description: None
      address:
-        "0xFc536AB2Cc1e784Ae181ca8A23b3E9C828B934A8"
+        "base:0xFc536AB2Cc1e784Ae181ca8A23b3E9C828B934A8"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

Generated with discovered.json: 0x964367f53a063a6c1794b5ff6de077eed57e2808

# Diff at Mon, 14 Jul 2025 08:02:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 30222921
- current block number: 30222921

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30222921 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xcd1cc19be8e8afdc4c771f0ca1db1d80e3055be7

# Diff at Mon, 16 Jun 2025 08:41:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 30222921
- current block number: 30222921

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30222921 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867","role":"admin"}
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","from":"base:0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867","role":"admin","via":[{"address":"base:0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}
    }
```

```diff
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
    }
```

Generated with discovered.json: 0xea73b6bf59858250e4e46768bd9606511f3d0a5a

# Diff at Fri, 30 May 2025 07:19:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 30222921
- current block number: 30222921

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30222921 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0xee3aa99f10e2a8eab0e84a1a669a640d97b96c45

# Diff at Fri, 23 May 2025 09:41:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 30222921
- current block number: 30222921

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30222921 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.permission:
-        "interact"
+        "guard"
      receivedPermissions.1.from:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.permission:
-        "guard"
+        "interact"
      receivedPermissions.0.from:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    EOA  (0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595","role":".CHALLENGER"}
      receivedPermissions.0.role:
+        ".challenger"
    }
```

Generated with discovered.json: 0x58a9698dc7a56f46cb2e2193437737cfdb727766

# Diff at Tue, 29 Apr 2025 08:19:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 28782094
- current block number: 28782094

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 28782094 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[]},{"permission":"upgrade","to":"0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce","via":[{"address":"0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce","via":[{"address":"0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}]
    }
```

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff","via":[]},{"permission":"propose","to":"0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d","via":[]},{"permission":"upgrade","to":"0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce","via":[{"address":"0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}]
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce","via":[{"address":"0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}]
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A","via":[]},{"permission":"upgrade","to":"0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce","via":[{"address":"0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}]
    }
```

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce","description":"set and change address mappings.","via":[{"address":"0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}]
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[]},{"permission":"upgrade","to":"0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce","via":[{"address":"0x102e24084a003feEbe57B536a3B4E29eD6AC855A"}]}]
    }
```

Generated with discovered.json: 0x9711a9b370f2de29aed1c6ca0606b9c9e9eae9e4

# Diff at Fri, 11 Apr 2025 06:39:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 27584106
- current block number: 28782094

## Description

fee increase.

## Watched changes

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        4175613
+        25053678
    }
```

Generated with discovered.json: 0xf7250eb41f7cd91e94c6fb942897f215d13a0e20

# Diff at Thu, 27 Mar 2025 11:16:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 27584106
- current block number: 27584106

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 27584106 (main branch discovery), not current.

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x00168979a56136af8d129d795a0967ef33d3ae77

# Diff at Wed, 19 Mar 2025 13:06:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 27584106
- current block number: 27584106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 27584106 (main branch discovery), not current.

```diff
    contract undefined (0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xb8ca6451bbaccf4b5c447a93f8ae851675c6f6e6

# Diff at Fri, 14 Mar 2025 13:06:25 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a22da884d1a9470186e80799bc96392136af1fbe block: 27417923
- current block number: 27584106

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      values.$members.8:
-        "0x03A0080CA69B333F2a3697Eed806Bd8c31baCF8B"
      values.$members.7:
-        "0x8486C301D5719ADdf6AB789E92D24423c50a940D"
      values.$members.6:
-        "0xB6faDA40e4376D262e25068534df4788023Bb8A3"
      values.$members.5:
-        "0x34f1fb4c76019d83Eb287B56bAa5466Fc130A028"
      values.multisigThreshold:
-        "2 of 9 (22%)"
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0xc32873ffec167a282d70863fe8547e7c911c5682

# Diff at Mon, 10 Mar 2025 16:46:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 27283267
- current block number: 27417923

## Description

Base fee increase.

## Watched changes

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        668098
+        4175613
    }
```

Generated with discovered.json: 0xa6a63cf64bb24804e470c0e4d1a239fb4e50cdb7

# Diff at Fri, 07 Mar 2025 13:58:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 23224422
- current block number: 27283267

## Description

5 signers added to MS.

## Watched changes

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      values.$members.8:
+        "0x03A0080CA69B333F2a3697Eed806Bd8c31baCF8B"
      values.$members.7:
+        "0x8486C301D5719ADdf6AB789E92D24423c50a940D"
      values.$members.6:
+        "0xB6faDA40e4376D262e25068534df4788023Bb8A3"
      values.$members.5:
+        "0x34f1fb4c76019d83Eb287B56bAa5466Fc130A028"
      values.$members.4:
+        "0x5A17352926d9681990D08771804287c2577e11C7"
      values.$members.3:
-        "0x03A0080CA69B333F2a3697Eed806Bd8c31baCF8B"
+        "0x28C0a3F0DCE25Cf013Dc86ce1AaDccB8B0758d93"
      values.$members.2:
-        "0x8486C301D5719ADdf6AB789E92D24423c50a940D"
+        "0x7B5B1d9d8a51461208a59FAa4c7E58624bB7f02D"
      values.$members.1:
-        "0xB6faDA40e4376D262e25068534df4788023Bb8A3"
+        "0xb268354DC49Cf984306ba8bdcB7c0b1a95f31901"
      values.$members.0:
-        "0x34f1fb4c76019d83Eb287B56bAa5466Fc130A028"
+        "0xb8468fbf63dfbbb62e79b0B890849Fe55Fd09Ef2"
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "2 of 9 (22%)"
    }
```

Generated with discovered.json: 0xb4478a29150a3ff1b111b0eb3d9dc835cb686bec

# Diff at Tue, 04 Mar 2025 11:27:09 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x0a64fb23a618f9da5ae9321f5b5d474d6b836760

# Diff at Tue, 04 Mar 2025 10:40:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      sinceBlock:
+        17793749
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      sinceBlock:
+        18176861
    }
```

```diff
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        17793749
    }
```

```diff
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        17793749
    }
```

```diff
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        17793749
    }
```

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        17793749
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        17793749
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      sinceBlock:
+        14896961
    }
```

```diff
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        17793749
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        17793749
    }
```

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        17793749
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        17793749
    }
```

Generated with discovered.json: 0xfd4020e876bec86040cd30a13d1cad64b17a9bf8

# Diff at Wed, 26 Feb 2025 10:33:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 23224422
- current block number: 23224422

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x04916262e0dd524052b9a887f7c020434a784a49

# Diff at Fri, 21 Feb 2025 14:12:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 23224422
- current block number: 23224422

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xf55d6718d4e270bb3ef032116ff221291fade3cd

# Diff at Fri, 21 Feb 2025 09:00:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0xbe0bb745fe60a780eb7d304a46591ec96c98e546

# Diff at Mon, 10 Feb 2025 19:05:21 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xf390cfa66e01a5d1f59bd1d5b7786b5c3278c816

# Diff at Tue, 04 Feb 2025 12:33:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 23224422
- current block number: 23224422

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.2.permission:
-        "guard"
+        "interact"
      receivedPermissions.2.from:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.from:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.0.permission:
-        "configure"
+        "guard"
      receivedPermissions.0.from:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
+        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x636a75064d928f0af1bd549792fbc79561f54138

# Diff at Mon, 20 Jan 2025 11:10:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 23224422
- current block number: 23224422

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      directlyReceivedPermissions.7.from:
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      directlyReceivedPermissions.6.target:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      directlyReceivedPermissions.6.from:
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      directlyReceivedPermissions.5.target:
-        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      directlyReceivedPermissions.5.from:
+        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      directlyReceivedPermissions.4.target:
-        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      directlyReceivedPermissions.4.from:
+        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      directlyReceivedPermissions.3.target:
-        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      directlyReceivedPermissions.3.from:
+        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      directlyReceivedPermissions.2.target:
-        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      directlyReceivedPermissions.2.from:
+        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      directlyReceivedPermissions.1.target:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      directlyReceivedPermissions.1.from:
+        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      directlyReceivedPermissions.0.target:
-        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      directlyReceivedPermissions.0.from:
+        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.7.from:
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.6.target:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.6.from:
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.5.target:
-        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      receivedPermissions.5.from:
+        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      receivedPermissions.4.target:
-        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      receivedPermissions.4.from:
+        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      receivedPermissions.3.target:
-        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      receivedPermissions.3.from:
+        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      receivedPermissions.2.target:
-        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      receivedPermissions.2.from:
+        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      receivedPermissions.1.target:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.1.from:
+        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.0.target:
-        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      receivedPermissions.0.from:
+        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      directlyReceivedPermissions.0.target:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      directlyReceivedPermissions.0.from:
+        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
    }
```

```diff
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
    }
```

```diff
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
    }
```

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.1.target:
-        "0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
      issuedPermissions.1.to:
+        "0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
      issuedPermissions.0.target:
-        "0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
      issuedPermissions.0.to:
+        "0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.2.from:
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.1.target:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.1.from:
+        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.0.target:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.0.from:
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.1.target:
-        "0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A"
      issuedPermissions.1.to:
+        "0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
    }
```

Generated with discovered.json: 0x1d0076db9dc5079a9e7a6ae53fd3f0fa7fdade32

# Diff at Wed, 08 Jan 2025 09:09:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x16cf8ae6def6f97184452fbcca60b2364c9d6b8a

# Diff at Tue, 03 Dec 2024 15:03:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 23224422

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```
