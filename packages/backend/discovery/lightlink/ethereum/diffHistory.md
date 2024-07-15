Generated with discovered.json: 0xa4d91694fce06928f1dfff6ec7e5d39ee2176a36

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
