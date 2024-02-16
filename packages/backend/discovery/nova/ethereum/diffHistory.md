Generated with discovered.json: 0x11137089528e466103478529e9825c95fb2f9c20

# Diff at Thu, 01 Feb 2024 08:18:12 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@74040c3a8f43c630b3d31cc8376e84f5f9acda5c block: 18564156
- current block number: 19132347

## Description

Add the SequencerInboxVersion handler. Updated OS version to ArbOS 11. Added other useful handlers.

## Watched changes

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
      values.dacKeyset.keyCount:
-        8
+        6
      values.keySetUpdates:
-        10
+        11
    }
```

```diff
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
      values.getOwners.0:
-        "0x702105E66C468b5191553702cD6BF3D6Bbfa4C6b"
+        "0x375906ADFD34D93236084F462BB2dB0D92129Fe1"
    }
```

```diff
    contract RollupProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
      values.wasmModuleRoot:
-        "0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3"
+        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18564156 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b) {
      values.batchPosters:
+        ["0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D","0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc"]
      values.dacKeyset:
+        {"threshold":2,"keyCount":8}
      values.keySetUpdates:
+        10
      values.sequencerVersion:
+        "0x88"
      derivedName:
+        "SequencerInbox"
    }
```

```diff
    contract ArbitrumProxy (0xFb209827c58283535b744575e11953DCC4bEAD88) {
      name:
-        "ArbitrumProxy"
+        "RollupProxy"
      values.challenges:
+        []
      values.setValidatorCount:
+        6
      values.validators:
+        ["0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4","0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23","0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3","0x3B0369CAD35d257793F51c28213a4Cf4001397AC","0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c","0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76","0x610Aa279989F440820e14248BD3879B148717974","0x658e8123722462F888b6fa01a7dbcEFe1D6DD709","0xAB1A39332e934300eBCc57B5f95cA90631a347FF","0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d","0xDfB23DFE9De7dcC974467195C8B7D5cd21C9d7cB","0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87","0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E"]
      derivedName:
+        "ArbitrumProxy"
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x1732BE6738117e9d22A84181AF68C8d09Cd4FF23) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x24Ca61c31C7f9Af3ab104dB6B9A444F28e9071e3) {
    }
```

```diff
+   Status: CREATED
    contract Validator (0x3B0369CAD35d257793F51c28213a4Cf4001397AC) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x57004b440Cc4eb2FEd8c4d1865FaC907F9150C76) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0x658e8123722462F888b6fa01a7dbcEFe1D6DD709) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x8f6b82D007C0Ff4fd85fE84a5BFa89C00A4e6d2B) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xAd3a14Fc16751d9E7FCa2A99aF85bf4d135e878d) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb31407BCf91d54AbFC0B7ef61bFc71b8b71F0678) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb85e18C8F552c823CdA4DCd9056213bDc970f9AE) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorOwnerMultisig (0xC234E41AE2cb00311956Aa7109fC801ae8c80941) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWallet (0xE27d4Ed355e5273A3D4855c8e11BC4a8d3e39b87) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xE4d0Ba69d082Fdf6f51b8fc8F92c19bF00B1a1B4) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF32e5B5Ad94c0c0F83E0023b0AC48A93A8a2a428) {
    }
```

# Diff at Mon, 13 Nov 2023 16:26:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: master@a45348c9ae2e765b872be3f217168f73b62d35a6

## Description

Some of the Security Council members were replaced.

Names of the owners of the EOAs listed below were manually found on public Arbitrum forums,
so they may be incorrect.

Removed EOAs:

- 0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF (Mo Dong?)
- 0x0E5011001cF9c89b0259BC3B050785067495eBf5 (Diane Dai?)
- 0x8688515028955734350067695939423222009623 (Celeb Lau?)
- 0x88910996671162953E89DdcE5C8137f9077da217 (??)
- 0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5 (Bryan Pellegrino?)

Added EOAs:

- 0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3 (Patrick McCorry?)
- 0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed (0xhombre?)
- 0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF (John Morrow?)
- 0xb07dc9103328A51128bC6Cc1049d1137035f5E28 (Omer Goldberg?)
- 0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23 (Matt Fiebach?)

## Watched changes

```diff
    contract GnosisSafe (0xF06E95eF589D9c38af242a8AAee8375f14023F85) {
      values.getOwners.5:
-        "0x8e6247239CBeB3Eaf9d9a691D01A67e2A9Fea3C5"
+        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
      values.getOwners.4:
-        "0x88910996671162953E89DdcE5C8137f9077da217"
+        "0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23"
      values.getOwners.3:
-        "0x8688515028955734350067695939423222009623"
+        "0xb07dc9103328A51128bC6Cc1049d1137035f5E28"
      values.getOwners.2:
-        "0x0E5011001cF9c89b0259BC3B050785067495eBf5"
+        "0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF"
      values.getOwners.1:
-        "0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd"
+        "0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed"
      values.getOwners.0:
-        "0x526C0DA9970E7331d171f86AeD28FAFB5D8A49EF"
+        "0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3"
    }
```

# Diff at Fri, 22 Sep 2023 07:25:53 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@3a33c063dab8666dc32b4ec15a81995020325b49

## Watched changes

```diff
    contract L1ArbitrumTimelock (0xE6841D92B0C345144506576eC13ECf5103aC7f49) {
      upgradeability.implementation:
-        "0x962d70fc48F3465404bC77B03f104746B25a1d1b"
+        "0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3"
    }
```
