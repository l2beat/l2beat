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
