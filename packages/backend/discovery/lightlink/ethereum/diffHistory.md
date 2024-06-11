Generated with discovered.json: 0x9a75ecd93689ea16fa10b84be27fe4ef94aba25d

# Diff at Tue, 11 Jun 2024 15:59:59 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@d9af418fd1e3a202fc32c7e04b57a386f988dfc8 block: 20061082
- current block number: 20069637

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
