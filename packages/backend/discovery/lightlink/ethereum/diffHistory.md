Generated with discovered.json: 0xa97bdd5523bee84b1721a567443c3a6fa1660fbd

# Diff at Tue, 01 Oct 2024 10:52:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20685269
- current block number: 20685269

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20685269 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:32:23.000Z",["0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"]],["2024-09-05T13:35:35.000Z",["0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"]]]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:31:47.000Z",["0x79B3E839333a74137e78b0DaF84FC12512a8c704"]]]
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T03:06:47.000Z",["0x468b89D930ca7974196D7195033600B658011756"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T02:57:47.000Z",["0xC48F0e7C3c4E385ae84B4f678A0482E00208cf3E"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-16T03:12:11.000Z",["0xa8372d6FF00d48A25BaA1AF16d6a86C936708f4E"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-04T17:31:11.000Z",["0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"]],["2024-09-05T13:31:35.000Z",["0xeFE38Bd58ADDf23eFab1FFa16312030384929289"]]]
    }
```

Generated with discovered.json: 0x3e7db4030a9e68b02999c798868fa8c2066511dc

# Diff at Thu, 05 Sep 2024 15:26:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d01da0bcdde8e77051659c9718e449a44f5f957a block: 20117905
- current block number: 20685269

## Description

Small upgrade:

### Challenge.sol
- new `finalizationSeconds()` returns challengePeriod + challengeWindow

### CanonicalStateChain.sol
- new `OutputProposed` event for each new output root (on `pushBlock()`)
- `output root = keccack(version_hash || keccack(state_root || withdrawal_root || latest_block_hash))`
- new `getL2Output()` returns outputRoot, timestamp

## Watched changes

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$implementation:
-        "0x2785D4Af59bf299C1f2DBC5132E72B2eE015B3aC"
+        "0x4Fc6a6A2e3864709ae6AdCf29280dA01c95Aa10B"
      values.$upgradeCount:
-        1
+        2
      values.finalizationSeconds:
+        432000
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$implementation:
-        "0xd8C81A0CB0044fC45B51531A8dcc48Ed385937B5"
+        "0xeFE38Bd58ADDf23eFab1FFa16312030384929289"
      values.$upgradeCount:
-        1
+        2
      values.startingTimestamp:
+        1717522271
    }
```

## Source code changes

```diff
.../CanonicalStateChain/CanonicalStateChain.sol    | 37 ++++++++++++++++++++--
 .../Challenge/Challenge.sol                        |  5 +++
 2 files changed, 40 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x6d6b9df731962a3b59a97d94d7b57792794c1bed

# Diff at Fri, 30 Aug 2024 07:53:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xbfab149ef568896625f0220e4db9c67e96c97804

# Diff at Fri, 23 Aug 2024 09:52:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xeedfb4ae7298c593a94252f1f8cb181c45cee40c

# Diff at Wed, 21 Aug 2024 10:03:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

```diff
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x624631881655a310adcF0d1336658Cc977609b72","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3ca373F5ecB92ac762f9876f6e773082A4589995","via":[]},{"permission":"upgrade","target":"0x624631881655a310adcF0d1336658Cc977609b72","via":[]},{"permission":"upgrade","target":"0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9","via":[]}]
    }
```

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3345702FeA1669Efa1e085610A62F89d159Bc0c8","via":[]}]
    }
```

```diff
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xcc90c738acfc1695D19336Bc3E392a46234112BF","via":[]}]
    }
```

Generated with discovered.json: 0xf9ba057c7ad16038bcecbd934f422fb7841592e2

# Diff at Fri, 09 Aug 2024 12:00:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x624631881655a310adcF0d1336658Cc977609b72"
+        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
      assignedPermissions.upgrade.1:
-        "0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"
+        "0x624631881655a310adcF0d1336658Cc977609b72"
    }
```

Generated with discovered.json: 0xc83644e57cef1e7beae3dfcb0e282d087d0f16b1

# Diff at Fri, 09 Aug 2024 10:10:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20117905
- current block number: 20117905

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20117905 (main branch discovery), not current.

```diff
    contract LightLinkMultisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x624631881655a310adcF0d1336658Cc977609b72","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9"]
      assignedPermissions.upgrade:
+        ["0x3ca373F5ecB92ac762f9876f6e773082A4589995","0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9","0x624631881655a310adcF0d1336658Cc977609b72"]
    }
```

Generated with discovered.json: 0x2053af4a0dff819953516c381e96cf97096d863a

# Diff at Tue, 18 Jun 2024 09:58:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e3611555e0b885dd86d383737fd13f2f80d29e5d block: 20083371
- current block number: 20117905

## Description

Introduce the LightLink proxy type.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20083371 (main branch discovery), not current.

```diff
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

```diff
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9) {
    +++ description: None
      upgradeability.type:
-        "EIP1967 proxy"
+        "LightLink proxy"
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x3345702FeA1669Efa1e085610A62F89d159Bc0c8"
    }
```

Generated with discovered.json: 0x5b0656336e187bb0466ffcb9ed0d53058db03a56

# Diff at Thu, 13 Jun 2024 14:03:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@9b539b55e8e7d4d20892b6f527f5c9e27bd65f80 block: 20061082
- current block number: 20083371

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20061082 (main branch discovery), not current.

```diff
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd) {
    +++ description: None
      values.daNamespace:
-        ["0x00","0x00000000000000000000000000000000000000000000000000000000"]
+        {"version":"0x00","id":"0x00000000000000000000000000000000000000000000000000000000"}
    }
```

```diff
    contract Multisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8) {
    +++ description: None
      name:
-        "Multisig"
+        "LightLinkMultisig"
    }
```

```diff
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72) {
    +++ description: None
      values.getValidators.4:
-        ["0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938",40]
+        {"addr":"0xc8225cA10F570d4d7aD6cdb6F0bfEb683dc7C938","power":40}
      values.getValidators.3:
-        ["0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9",40]
+        {"addr":"0xaB0DDC4B1Fc1F24D4F7F67ab87B5dD8e5e0c5AC9","power":40}
      values.getValidators.2:
-        ["0xB44C32Dd1ec374224eED43FD827EBE64db16b0df",20]
+        {"addr":"0xB44C32Dd1ec374224eED43FD827EBE64db16b0df","power":20}
      values.getValidators.1:
-        ["0x6f933814903561F79137099587737DFB24c6E86D",20]
+        {"addr":"0x6f933814903561F79137099587737DFB24c6E86D","power":20}
      values.getValidators.0:
-        ["0x12eCE4AA73ee8ea958bE327daE41Dd785c997118",40]
+        {"addr":"0x12eCE4AA73ee8ea958bE327daE41Dd785c997118","power":40}
    }
```

Generated with discovered.json: 0x9ed1eacb739e181fea2cb650b2ef14492f71700c

# Diff at Mon, 10 Jun 2024 11:17:41 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 20061082

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Challenge (0x1c1271bEE8556918092dA9238FcC77ee8be4b5Cd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChainOracle (0x2fbD45A4B57379492450c3D5a8fdcaD68336DB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig (0x3345702FeA1669Efa1e085610A62F89d159Bc0c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LightLinkBridge (0x3ca373F5ecB92ac762f9876f6e773082A4589995)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BridgeRegistry (0x624631881655a310adcF0d1336658Cc977609b72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LightLinkERC20Bridge (0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CanonicalStateChain (0x65E325A22c0F519041db69F5693EbAc3b4AE71bE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RLPReader (0xEe055Dddc462e35521005e1b00FcEFd78E1fc9E2)
    +++ description: None
```
