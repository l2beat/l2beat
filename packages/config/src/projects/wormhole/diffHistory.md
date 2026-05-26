Generated with discovered.json: 0xa706d3fd7d9117e4514ad06ec5dcb3352bfb3311

# Diff at Mon, 11 May 2026 11:44:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@16c27951daab8bc6e3065fb400714a6b714e9f73 block: 1777964358
- current timestamp: 1778499359

## Description

config: adjust disco before adding to FE.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777964358 (main branch discovery), not current.

```diff
    EOA  (eth:0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) [wormhole/BridgeToken] {
    +++ description: Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs. This makes the tokens bridge-owned by default.
      description:
-        "Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs."
+        "Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs. This makes the tokens bridge-owned by default."
    }
```

```diff
    EOA  (eth:0x107A0086b32d7A0977926A205131d8731D39cbEB) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x114De8460193bdf3A2fCf81f86a09765F4762fD1) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x18e41674CcF26329cD111406C1D05C6c80b23EdC) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x3F851Ad586A47ceF8d04748f33ab0D71395f06b4) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x42579bFFbCF4276E290aB8E4C162bd4052b97970) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x6FbEBc898F403E4773E95feB15E80C9A99c8348d) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x7899cEAB1DC961Dae9defDB7A4f521269a5448FC) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0x938f104AEb5581293216ce97d771e0CB721221B1) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) [wormhole/WormholeCore] {
    +++ description: Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge by storing the active Guardian set.
      description:
-        "Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge."
+        "Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge by storing the active Guardian set."
      values.currentQuorumHardcoded:
-        13
      values.$members:
+        ["eth:0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3","eth:0xfF6CB952589BDE862c25Ef4392132fb9D4A42157","eth:0x114De8460193bdf3A2fCf81f86a09765F4762fD1","eth:0x107A0086b32d7A0977926A205131d8731D39cbEB","eth:0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2","eth:0x42579bFFbCF4276E290aB8E4C162bd4052b97970","eth:0x938f104AEb5581293216ce97d771e0CB721221B1","eth:0x18e41674CcF26329cD111406C1D05C6c80b23EdC","eth:0x9D16870160e703324D057c3361c34C5beFBa2c34","eth:0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e","eth:0xAF45Ced136b9D9e24903464AE889F5C8a723FC14","eth:0xf93124b7c738843CBB89E864c862c38cddCccF95","eth:0xD2CC37A4dc036a8D232b48f62cDD4731412f4890","eth:0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811","eth:0xD1F64e26238811de5553C40f64af41eE1B6057Cc","eth:0x3F851Ad586A47ceF8d04748f33ab0D71395f06b4","eth:0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8","eth:0x7899cEAB1DC961Dae9defDB7A4f521269a5448FC","eth:0x6FbEBc898F403E4773E95feB15E80C9A99c8348d"]
      values.$threshold:
+        13
      values.currentSizeHardcoded:
+        19
      fieldMeta.guardianSet.description:
-        "The active Wormhole Guardian set. A 2/3+1 quorum of these addresses signs VAAs accepted by this Core Bridge. The old signer set stays valid for 24h by default if the set is changed. Changes of the stored guardian sets are invisible until the set is selected."
+        "The active Wormhole Guardian set. A 2/3+1 quorum of these addresses signs VAAs accepted by this Core Bridge. The old signer set stays valid for 24h by default if the set is changed. Changes of the stored guardian sets are invisible until the set is selected. Change the hardcoded set size if this changes!"
      references:
-        [{"text":"Wormhole contract addresses","href":"https://wormhole.com/docs/products/reference/contract-addresses/"}]
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585","description":"validate incoming transfers and register remote bridge peers.","role":".wormhole"},{"permission":"upgrade","from":"eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585","role":".wormhole"}]
    }
```

```diff
    EOA  (eth:0x9D16870160e703324D057c3361c34C5beFBa2c34) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0xAF45Ced136b9D9e24903464AE889F5C8a723FC14) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0xD1F64e26238811de5553C40f64af41eE1B6057Cc) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0xD2CC37A4dc036a8D232b48f62cDD4731412f4890) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0xf93124b7c738843CBB89E864c862c38cddCccF95) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (eth:0xfF6CB952589BDE862c25Ef4392132fb9D4A42157) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters.","role":".guardianSet"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B","description":"authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain.","role":".guardianSet"}
      receivedPermissions.2.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.2.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.2.description:
-        "authorize Wormhole Core upgrades, Guardian set rotations, message fee changes, and fee transfers through governance VAAs."
+        "validate incoming crosschain messages, rotate the guardian set, change and withdraw fees."
      receivedPermissions.3.condition:
+        "if the quorum of 13/19 guardian signers is met."
      receivedPermissions.3.role:
-        ".guardianSet"
+        ".$members"
      receivedPermissions.3.description:
-        "sign VAAs that Wormhole Core accepts as cross-chain messages."
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x38694fb23df050c8ce78bdbafbbccae690d2e509

# Diff at Fri, 08 May 2026 07:52:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777964358
- current timestamp: 1777964358

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777964358 (main branch discovery), not current.

```diff
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) [wormhole/BridgeToken] {
    +++ description: Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs.
      sourceHashes.0:
-        "0xbc51a6f7503c2dccc97bd5b0fe777fa354d9c7f8a017bffcdb16119f293f0619"
+        "0xd7cffa0a386a077d44c802d0eafaccade2143c4107df332754f818aa80343d1b"
    }
```

```diff
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585) [wormhole/TokenBridge] {
    +++ description: Wormhole Token Bridge on Ethereum. It escrows Ethereum-native tokens and mints or burns wrapped assets such as WSOL after Wormhole Core verifies Guardian-signed VAAs. WSOL has no Ethereum-side escrow because it is a wrapped asset on Ethereum.
      sourceHashes.1:
-        "0x06093cab28394b5790c0a8281474cd818235258958a294ecad796fb89e7d017c"
+        "0x694d7e12e343544cde20da708d139637b87150808347040bf2ca863629f1bb19"
    }
```

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) [wormhole/WormholeCore] {
    +++ description: Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge.
      sourceHashes.1:
-        "0xb51bdb80364d69b22f5cafd3aee42a605a60f5fc3116509bea8352fbfa04c532"
+        "0xc760112d439be8b9c1d00a313efccd01b1c3179af200cabde3f02cd59a235a42"
    }
```

```diff
    contract WSOL (eth:0xD31a59c85aE9D8edEFeC411D448f90841571b89c) [wormhole/BridgeToken] {
    +++ description: WSOL is the Wormhole-wrapped ERC20 representation of native SOL on Ethereum. The Token Bridge owns this token and mints or burns it after accepting valid Token Bridge VAAs for the Solana route. The native SOL backing is escrowed on Solana, not Ethereum.
      sourceHashes.1:
-        "0xbc51a6f7503c2dccc97bd5b0fe777fa354d9c7f8a017bffcdb16119f293f0619"
+        "0xd7cffa0a386a077d44c802d0eafaccade2143c4107df332754f818aa80343d1b"
    }
```

Generated with discovered.json: 0xc943d354561759b6a886f15d4417047eda9a84e7

# Diff at Tue, 05 May 2026 10:23:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777964358
- current timestamp: 1777964358

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777964358 (main branch discovery), not current.

```diff
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs.
      deployerAddress:
+        "eth:0xE2e2d9E31d7e1CC1178Fe0d1c5950f6C809816a3"
    }
```

```diff
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: Wormhole Token Bridge on Ethereum. It escrows Ethereum-native tokens and mints or burns wrapped assets such as WSOL after Wormhole Core verifies Guardian-signed VAAs. WSOL has no Ethereum-side escrow because it is a wrapped asset on Ethereum.
      deployerAddress:
+        "eth:0x96D13cbEFFE7BAE169B9032Fe69Ed56eB07b300F"
    }
```

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge.
      deployerAddress:
+        "eth:0x5B3899809Ae2c87FdA11280b7c61C06A5F4db1de"
    }
```

```diff
    contract WSOL (eth:0xD31a59c85aE9D8edEFeC411D448f90841571b89c) {
    +++ description: WSOL is the Wormhole-wrapped ERC20 representation of native SOL on Ethereum. The Token Bridge owns this token and mints or burns it after accepting valid Token Bridge VAAs for the Solana route. The native SOL backing is escrowed on Solana, not Ethereum.
      deployerAddress:
+        "eth:0x4687f8d4a661545DF7E368972a50c4bcF0D11Ae1"
    }
```

Generated with discovered.json: 0x2da78b1c0ab9c97b9e9acab9264221de4a4fd47a

# Diff at Tue, 05 May 2026 07:13:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@26382144ce3c79862aee73e15f619d0a40458aae block: 1777463355
- current timestamp: 1777964358

## Description

guardian set rotation.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777463355 (main branch discovery), not current.

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge.
      fieldMeta.guardianSet.severity:
-        "HIGH"
      fieldMeta.guardianSet.description:
-        "The active Wormhole Guardian set. A 2/3+1 quorum of these addresses signs VAAs accepted by this Core Bridge. The old signer set stays valid for 24h by default if the set is changed."
+        "The active Wormhole Guardian set. A 2/3+1 quorum of these addresses signs VAAs accepted by this Core Bridge. The old signer set stays valid for 24h by default if the set is changed. Changes of the stored guardian sets are invisible until the set is selected."
      fieldMeta.getCurrentGuardianSetIndex.severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x867c58a3b0f796e972b3e1b5f639f27fe1b6b8fd

# Diff at Wed, 29 Apr 2026 11:50:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7777fce305237f88b6d6286e39503c0f5d636d05 block: 1777294117
- current timestamp: 1777463355

## Description

config: clean discovery and move global config to templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777294117 (main branch discovery), not current.

```diff
    EOA  (eth:0x000aC0076727b35FBea2dAc28fEE5cCB0fEA768e) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6) {
    +++ description: Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs.
      description:
-        "ERC20 implementation used by Wormhole wrapped tokens on Ethereum."
+        "Wormhole wrapped ERC20 token implementation. When initialized as a wrapped asset, the Token Bridge is the token owner and can mint, burn, and update metadata after accepting valid Token Bridge VAAs."
      category:
-        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    EOA  (eth:0x107A0086b32d7A0977926A205131d8731D39cbEB) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x114De8460193bdf3A2fCf81f86a09765F4762fD1) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x11b39756C042441BE6D8650b69b54EbE715E2343) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x15e7cAF07C4e3DC8e7C469f92C8Cd88FB8005a20) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x178e21ad2E77AE06711549CFBB1f9c7a9d8096e8) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: Wormhole Token Bridge on Ethereum. It escrows Ethereum-native tokens and mints or burns wrapped assets such as WSOL after Wormhole Core verifies Guardian-signed VAAs. WSOL has no Ethereum-side escrow because it is a wrapped asset on Ethereum.
      fieldMeta.finality.description:
-        "Consistency level used when this Token Bridge publishes Wormhole messages from Ethereum."
+        "Consistency level used when this Token Bridge publishes Wormhole messages from the local chain."
      fieldMeta.implementation.description:
-        "Beacon implementation returned by the Token Bridge for wrapped token proxies. Changing it changes the code used by wrapped assets such as WSOL."
+        "Beacon implementation returned by the Token Bridge for wrapped token proxies. Changing it changes the code used by wrapped assets minted by this bridge."
      fieldMeta.wormhole.description:
-        "The Wormhole Core Bridge used to verify Guardian-signed VAAs consumed by the Token Bridge."
+        "The Wormhole Core Bridge used to verify Guardian-signed VAAs consumed by this Token Bridge."
      references:
-        [{"text":"Wormhole Token Bridge address","href":"https://wormhole.com/docs/products/reference/contract-addresses/#wrapped-token-transfers-wtt"}]
    }
```

```diff
    EOA  (eth:0x43ac8f567A31e7850Da532B361988Bfe0d3ae11b) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x5E1487F35515d02A92753504a8D75471b9f49EdB) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x6FbEBc898F403E4773E95feB15E80C9A99c8348d) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x74a3bf913953D695260D88BC1aA25A4eeE363ef0) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x8C82B2fd82FaeD2711d59AF0F2499D16e726f6b2) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0x938f104AEb5581293216ce97d771e0CB721221B1) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge.
      values.currentQuorumHardcoded:
+        13
      fieldMeta.guardianSet.description:
-        "The active Wormhole Guardian set. A quorum of these addresses signs VAAs accepted by this Core Bridge."
+        "The active Wormhole Guardian set. A 2/3+1 quorum of these addresses signs VAAs accepted by this Core Bridge. The old signer set stays valid for 24h by default if the set is changed."
      fieldMeta.messageFee.description:
-        "Fee required to publish a Wormhole message on Ethereum."
+        "Fee required to publish a Wormhole message on the local chain."
    }
```

```diff
    EOA  (eth:0xAF45Ced136b9D9e24903464AE889F5C8a723FC14) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xD1F64e26238811de5553C40f64af41eE1B6057Cc) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xD2CC37A4dc036a8D232b48f62cDD4731412f4890) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xDA798F6896A3331F64b48c12D1D57Fd9cbe70811) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xf93124b7c738843CBB89E864c862c38cddCccF95) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

```diff
    EOA  (eth:0xfF6CB952589BDE862c25Ef4392132fb9D4A42157) {
    +++ description: None
      receivedPermissions.0.description:
-        "authorize Token Bridge governance VAAs that can upgrade the bridge or register remote Token Bridge emitters."
+        "authorize Token Bridge governance VAAs that can upgrade the local bridge or register remote Token Bridge emitters."
      receivedPermissions.1.description:
-        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on Ethereum."
+        "authorize Token Bridge transfer VAAs that mint wrapped assets or release escrowed assets on the local chain."
    }
```

Generated with discovered.json: 0x3037c0e05be4787d591e16763d7a0963f9e73d6e

# Diff at Mon, 27 Apr 2026 12:57:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1777294117

## Description

initial ai-disco using skill after revive.

## Initial discovery

```diff
+   Status: CREATED
    contract TokenImplementation (eth:0x0fD04a68d3c3A692d6Fa30384D1A87Ef93554eE6)
    +++ description: ERC20 implementation used by Wormhole wrapped tokens on Ethereum.
```

```diff
+   Status: CREATED
    contract TokenBridge (eth:0x3ee18B2214AFF97000D974cf647E7C347E8fa585)
    +++ description: Wormhole Token Bridge on Ethereum. It escrows Ethereum-native tokens and mints or burns wrapped assets such as WSOL after Wormhole Core verifies Guardian-signed VAAs. WSOL has no Ethereum-side escrow because it is a wrapped asset on Ethereum.
```

```diff
+   Status: CREATED
    contract WormholeCore (eth:0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B)
    +++ description: Wormhole Core Bridge on Ethereum. It verifies VAAs signed by the active Wormhole Guardian set and is the security root for Wormhole application contracts on Ethereum, including the Token Bridge.
```

```diff
+   Status: CREATED
    contract WSOL (eth:0xD31a59c85aE9D8edEFeC411D448f90841571b89c)
    +++ description: WSOL is the Wormhole-wrapped ERC20 representation of native SOL on Ethereum. The Token Bridge owns this token and mints or burns it after accepting valid Token Bridge VAAs for the Solana route. The native SOL backing is escrowed on Solana, not Ethereum.
```
