Generated with discovered.json: 0x6f9be17535a7a534daf6cee0f9a2c059b0764c6a

# Diff at Tue, 22 Jul 2025 16:12:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@83bf55f537ce86d3d1dac9f1a98f31f9169b801f block: 22437895
- current block number: 22975821

## Description

FRAX Ferry Bridge (evmos) paused.

## Watched changes

```diff
    contract FRAX Ferry Bridge (evmos) (0x2d2261f970F605C813f160E8BAEd455E9004A842) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x023b4b96e4ad4dcf018289850e9bf5fdbd7b86d0

# Diff at Mon, 14 Jul 2025 12:45:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22437895
- current block number: 22437895

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437895 (main branch discovery), not current.

```diff
    contract sfrxETH Ferry Bridge (Optimism) (0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC) {
    +++ description: None
      address:
-        "0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC"
+        "eth:0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x484c2D6e3cDd945a8B2DF735e079178C1036578c"
+        "eth:0x484c2D6e3cDd945a8B2DF735e079178C1036578c"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC:
-        "Fraxferry"
      implementationNames.eth:0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Optimism) (0x06Fa869caa1160754C6a0B744Da6454c5EA325d4) {
    +++ description: None
      address:
-        "0x06Fa869caa1160754C6a0B744Da6454c5EA325d4"
+        "eth:0x06Fa869caa1160754C6a0B744Da6454c5EA325d4"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x2E3D870790dC77A83DD1d18184Acc7439A53f475"
+        "eth:0x2E3D870790dC77A83DD1d18184Acc7439A53f475"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x06Fa869caa1160754C6a0B744Da6454c5EA325d4:
-        "Fraxferry"
      implementationNames.eth:0x06Fa869caa1160754C6a0B744Da6454c5EA325d4:
+        "Fraxferry"
    }
```

```diff
    contract FPI Ferry Bridge (ZKsync) (0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5) {
    +++ description: None
      address:
-        "0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5"
+        "eth:0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xD405617DB7473b0A3158356Be7bC9EbEc6D88b85"
+        "eth:0xD405617DB7473b0A3158356Be7bC9EbEc6D88b85"
      values.token:
-        "0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
+        "eth:0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
      implementationNames.0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5:
-        "Fraxferry"
      implementationNames.eth:0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (Fantom) (0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622) {
    +++ description: None
      address:
-        "0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622"
+        "eth:0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x7d016eec9c25232b01F23EF992D98ca97fc2AF5a"
+        "eth:0x7d016eec9c25232b01F23EF992D98ca97fc2AF5a"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622:
-        "Fraxferry"
      implementationNames.eth:0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Moonriver) (0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0) {
    +++ description: None
      address:
-        "0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0"
+        "eth:0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x1A93B23281CC1CDE4C4741353F3064709A16197d"
+        "eth:0x1A93B23281CC1CDE4C4741353F3064709A16197d"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0:
-        "Fraxferry"
      implementationNames.eth:0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0:
+        "Fraxferry"
    }
```

```diff
    EOA  (0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e) {
    +++ description: None
      address:
-        "0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e"
+        "eth:0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e"
    }
```

```diff
    contract FPIS Ferry Bridge (Avalanche) (0x18A5ca670dC42D0551f00E11A730074f6787f17F) {
    +++ description: None
      address:
-        "0x18A5ca670dC42D0551f00E11A730074f6787f17F"
+        "eth:0x18A5ca670dC42D0551f00E11A730074f6787f17F"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0xee7cBa1403A2B0C53181B3980D52f9C5EdEEcC9e"
+        "eth:0xee7cBa1403A2B0C53181B3980D52f9C5EdEEcC9e"
      values.token:
-        "0xc2544A32872A91F4A553b404C6950e89De901fdb"
+        "eth:0xc2544A32872A91F4A553b404C6950e89De901fdb"
      implementationNames.0x18A5ca670dC42D0551f00E11A730074f6787f17F:
-        "Fraxferry"
      implementationNames.eth:0x18A5ca670dC42D0551f00E11A730074f6787f17F:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (Moonbeam) (0x228567c10b7533C88057c10dDeA6349360F122c5) {
    +++ description: None
      address:
-        "0x228567c10b7533C88057c10dDeA6349360F122c5"
+        "eth:0x228567c10b7533C88057c10dDeA6349360F122c5"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x82bbd1b6f6De2B7bb63D3e1546e6b1553508BE99"
+        "eth:0x82bbd1b6f6De2B7bb63D3e1546e6b1553508BE99"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0x228567c10b7533C88057c10dDeA6349360F122c5:
-        "Fraxferry"
      implementationNames.eth:0x228567c10b7533C88057c10dDeA6349360F122c5:
+        "Fraxferry"
    }
```

```diff
    contract sFRAX Ferry Bridge (Arbitrum) (0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d) {
    +++ description: None
      address:
-        "0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d"
+        "eth:0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xe3b3FE7bcA19cA77Ad877A5Bebab186bEcfAD906"
+        "eth:0xe3b3FE7bcA19cA77Ad877A5Bebab186bEcfAD906"
      values.token:
-        "0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
+        "eth:0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
      implementationNames.0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d:
-        "Fraxferry"
      implementationNames.eth:0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (ZKsync) (0x27E97F35D80514D5DD1Caa730e22a292E912a214) {
    +++ description: None
      address:
-        "0x27E97F35D80514D5DD1Caa730e22a292E912a214"
+        "eth:0x27E97F35D80514D5DD1Caa730e22a292E912a214"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x19BC97D3C223fC8a0fF0541D260f4f438d5FaF99"
+        "eth:0x19BC97D3C223fC8a0fF0541D260f4f438d5FaF99"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0x27E97F35D80514D5DD1Caa730e22a292E912a214:
-        "Fraxferry"
      implementationNames.eth:0x27E97F35D80514D5DD1Caa730e22a292E912a214:
+        "Fraxferry"
    }
```

```diff
    contract sfrxETH Ferry Bridge (ZKsync) (0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37) {
    +++ description: None
      address:
-        "0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37"
+        "eth:0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x22F91E9436C220af83fb0Ce27a08918dD1d27D32"
+        "eth:0x22F91E9436C220af83fb0Ce27a08918dD1d27D32"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37:
-        "Fraxferry"
      implementationNames.eth:0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37:
+        "Fraxferry"
    }
```

```diff
    contract sFRAX Ferry Bridge (Fraxtal) (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47) {
    +++ description: None
      address:
-        "0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47"
+        "eth:0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xfc00000000000000000000000000000000000008"
+        "eth:0xfc00000000000000000000000000000000000008"
      values.token:
-        "0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
+        "eth:0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
      implementationNames.0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47:
-        "Fraxferry"
      implementationNames.eth:0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (evmos) (0x2d2261f970F605C813f160E8BAEd455E9004A842) {
    +++ description: None
      address:
-        "0x2d2261f970F605C813f160E8BAEd455E9004A842"
+        "eth:0x2d2261f970F605C813f160E8BAEd455E9004A842"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xE03494D0033687543a80c9B1ca7D6237F2EA8BD8"
+        "eth:0xE03494D0033687543a80c9B1ca7D6237F2EA8BD8"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x2d2261f970F605C813f160E8BAEd455E9004A842:
-        "Fraxferry"
      implementationNames.eth:0x2d2261f970F605C813f160E8BAEd455E9004A842:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (Moonbeam) (0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A) {
    +++ description: None
      address:
-        "0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A"
+        "eth:0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x2CC0A9D8047A5011dEfe85328a6f26968C8aaA1C"
+        "eth:0x2CC0A9D8047A5011dEfe85328a6f26968C8aaA1C"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A:
-        "Fraxferry"
      implementationNames.eth:0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (Optimism) (0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2) {
    +++ description: None
      address:
-        "0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2"
+        "eth:0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x6806411765Af15Bddd26f8f544A34cC40cb9838B"
+        "eth:0x6806411765Af15Bddd26f8f544A34cC40cb9838B"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2:
-        "Fraxferry"
      implementationNames.eth:0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (ZKsync) (0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4) {
    +++ description: None
      address:
-        "0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4"
+        "eth:0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xb4C1544cb4163f4C2ECa1aE9Ce999F63892d912A"
+        "eth:0xb4C1544cb4163f4C2ECa1aE9Ce999F63892d912A"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4:
-        "Fraxferry"
      implementationNames.eth:0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (Polygon zkEVM) (0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137) {
    +++ description: None
      address:
-        "0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137"
+        "eth:0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xCf7eceE185f19e2E970a301eE37F93536ed66179"
+        "eth:0xCf7eceE185f19e2E970a301eE37F93536ed66179"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137:
-        "Fraxferry"
      implementationNames.eth:0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Boba) (0x3eF1d856EA62A2292B8690855042095a7aC48B4b) {
    +++ description: None
      address:
-        "0x3eF1d856EA62A2292B8690855042095a7aC48B4b"
+        "eth:0x3eF1d856EA62A2292B8690855042095a7aC48B4b"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x7562F525106F5d54E891e005867Bf489B5988CD9"
+        "eth:0x7562F525106F5d54E891e005867Bf489B5988CD9"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x3eF1d856EA62A2292B8690855042095a7aC48B4b:
-        "Fraxferry"
      implementationNames.eth:0x3eF1d856EA62A2292B8690855042095a7aC48B4b:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Polygon PoS) (0x43959A388603DCb6B02Ca084A55d4c7f3b442c57) {
    +++ description: None
      address:
-        "0x43959A388603DCb6B02Ca084A55d4c7f3b442c57"
+        "eth:0x43959A388603DCb6B02Ca084A55d4c7f3b442c57"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89"
+        "eth:0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x43959A388603DCb6B02Ca084A55d4c7f3b442c57:
-        "Fraxferry"
      implementationNames.eth:0x43959A388603DCb6B02Ca084A55d4c7f3b442c57:
+        "Fraxferry"
    }
```

```diff
    contract FPI Ferry Bridge (Polygon zkEVM) (0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349) {
    +++ description: None
      address:
-        "0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349"
+        "eth:0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0x7E5845b1bFc9e6620893e48346bdB8541995a8D9"
+        "eth:0x7E5845b1bFc9e6620893e48346bdB8541995a8D9"
      values.token:
-        "0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
+        "eth:0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
      implementationNames.0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349:
-        "Fraxferry"
      implementationNames.eth:0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (Fraxtal) (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6) {
    +++ description: None
      address:
-        "0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6"
+        "eth:0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xFc00000000000000000000000000000000000002"
+        "eth:0xFc00000000000000000000000000000000000002"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6:
-        "Fraxferry"
      implementationNames.eth:0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (Arbitrum) (0x4b8792aF00eaE944484bF572bc33029B2184a50C) {
    +++ description: None
      address:
-        "0x4b8792aF00eaE944484bF572bc33029B2184a50C"
+        "eth:0x4b8792aF00eaE944484bF572bc33029B2184a50C"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x9d2F299715D94d8A7E6F5eaa8E654E8c74a988A7"
+        "eth:0x9d2F299715D94d8A7E6F5eaa8E654E8c74a988A7"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0x4b8792aF00eaE944484bF572bc33029B2184a50C:
-        "Fraxferry"
      implementationNames.eth:0x4b8792aF00eaE944484bF572bc33029B2184a50C:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (Arbitrum) (0x505603e2440b44C1602b44D0Eb8385399b3F7bab) {
    +++ description: None
      address:
-        "0x505603e2440b44C1602b44D0Eb8385399b3F7bab"
+        "eth:0x505603e2440b44C1602b44D0Eb8385399b3F7bab"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x178412e79c25968a32e89b11f63B33F733770c2A"
+        "eth:0x178412e79c25968a32e89b11f63B33F733770c2A"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0x505603e2440b44C1602b44D0Eb8385399b3F7bab:
-        "Fraxferry"
      implementationNames.eth:0x505603e2440b44C1602b44D0Eb8385399b3F7bab:
+        "Fraxferry"
    }
```

```diff
    contract FPI Ferry Bridge (Arbitrum) (0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB) {
    +++ description: None
      address:
-        "0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB"
+        "eth:0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0x1B01514A2B3CdEf16fD3c680a818A0Ab97Da8a09"
+        "eth:0x1B01514A2B3CdEf16fD3c680a818A0Ab97Da8a09"
      values.token:
-        "0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
+        "eth:0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
      implementationNames.0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB:
-        "Fraxferry"
      implementationNames.eth:0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB:
+        "Fraxferry"
    }
```

```diff
    contract sFRAX Ferry Bridge (Avalanche) (0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9) {
    +++ description: None
      address:
-        "0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9"
+        "eth:0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x3405E88af759992937b84E58F2Fe691EF0EeA320"
+        "eth:0x3405E88af759992937b84E58F2Fe691EF0EeA320"
      values.token:
-        "0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
+        "eth:0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
      implementationNames.0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9:
-        "Fraxferry"
      implementationNames.eth:0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9:
+        "Fraxferry"
    }
```

```diff
    contract sfrxETH Ferry Bridge (Fraxtal) (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3) {
    +++ description: None
      address:
-        "0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3"
+        "eth:0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xFC00000000000000000000000000000000000005"
+        "eth:0xFC00000000000000000000000000000000000005"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3:
-        "Fraxferry"
      implementationNames.eth:0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Fraxtal) (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE) {
    +++ description: None
      address:
-        "0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE"
+        "eth:0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.crewmembers.0:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xFc00000000000000000000000000000000000001"
+        "eth:0xFc00000000000000000000000000000000000001"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE:
-        "Fraxferry"
      implementationNames.eth:0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE:
+        "Fraxferry"
    }
```

```diff
    contract sFRAX Ferry Bridge (Polygon zkEVM) (0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E) {
    +++ description: None
      address:
-        "0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E"
+        "eth:0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x2C37fb628b35dfdFD515d41B0cAAe11B542773C3"
+        "eth:0x2C37fb628b35dfdFD515d41B0cAAe11B542773C3"
      values.token:
-        "0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
+        "eth:0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
      implementationNames.0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E:
-        "Fraxferry"
      implementationNames.eth:0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E:
+        "Fraxferry"
    }
```

```diff
    contract sfrxETH Ferry Bridge (bsc) (0x621D0e62f26314387f338A2509aFA3Ae3414661A) {
    +++ description: None
      address:
-        "0x621D0e62f26314387f338A2509aFA3Ae3414661A"
+        "eth:0x621D0e62f26314387f338A2509aFA3Ae3414661A"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x3Cd55356433C89E50DC51aB07EE0fa0A95623D53"
+        "eth:0x3Cd55356433C89E50DC51aB07EE0fa0A95623D53"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0x621D0e62f26314387f338A2509aFA3Ae3414661A:
-        "Fraxferry"
      implementationNames.eth:0x621D0e62f26314387f338A2509aFA3Ae3414661A:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (Optimism) (0x6650D5183C4Cd294a81B1F724c365b0c42f8270a) {
    +++ description: None
      address:
-        "0x6650D5183C4Cd294a81B1F724c365b0c42f8270a"
+        "eth:0x6650D5183C4Cd294a81B1F724c365b0c42f8270a"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x67CCEA5bb16181E7b4109c9c2143c24a1c2205Be"
+        "eth:0x67CCEA5bb16181E7b4109c9c2143c24a1c2205Be"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0x6650D5183C4Cd294a81B1F724c365b0c42f8270a:
-        "Fraxferry"
      implementationNames.eth:0x6650D5183C4Cd294a81B1F724c365b0c42f8270a:
+        "Fraxferry"
    }
```

```diff
    EOA  (0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2) {
    +++ description: None
      address:
-        "0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2"
+        "eth:0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2"
    }
```

```diff
    contract FPI Multisig (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      address:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2"
+        "eth:0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2"
      values.$members.1:
-        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
+        "eth:0xcbc616D595D38483e6AdC45C7E426f44bF230928"
      values.$members.2:
-        "0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e"
+        "eth:0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e"
      values.$members.3:
-        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
+        "eth:0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
      values.$members.4:
-        "0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
+        "eth:0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
      implementationNames.0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract FRAX Ferry Bridge (Aurora) (0x6ac96F65156281a9383455D704b58A74ea9C9eC4) {
    +++ description: None
      address:
-        "0x6ac96F65156281a9383455D704b58A74ea9C9eC4"
+        "eth:0x6ac96F65156281a9383455D704b58A74ea9C9eC4"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xE4B9e004389d91e4134a28F19BD833cBA1d994B6"
+        "eth:0xE4B9e004389d91e4134a28F19BD833cBA1d994B6"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x6ac96F65156281a9383455D704b58A74ea9C9eC4:
-        "Fraxferry"
      implementationNames.eth:0x6ac96F65156281a9383455D704b58A74ea9C9eC4:
+        "Fraxferry"
    }
```

```diff
    EOA  (0x6e74053a3798e0fC9a9775F7995316b27f21c4D2) {
    +++ description: None
      address:
-        "0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
+        "eth:0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
    }
```

```diff
    contract FRAX Ferry Bridge (Arbitrum) (0x85c5f05Ae4CB68190C695a22b292C3bA90696128) {
    +++ description: None
      address:
-        "0x85c5f05Ae4CB68190C695a22b292C3bA90696128"
+        "eth:0x85c5f05Ae4CB68190C695a22b292C3bA90696128"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"
+        "eth:0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x85c5f05Ae4CB68190C695a22b292C3bA90696128:
-        "Fraxferry"
      implementationNames.eth:0x85c5f05Ae4CB68190C695a22b292C3bA90696128:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Polygon zkEVM) (0x86E71075e55F0aaD27D700017E0783458310c98a) {
    +++ description: None
      address:
-        "0x86E71075e55F0aaD27D700017E0783458310c98a"
+        "eth:0x86E71075e55F0aaD27D700017E0783458310c98a"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xFf8544feD5379D9ffa8D47a74cE6b91e632AC44D"
+        "eth:0xFf8544feD5379D9ffa8D47a74cE6b91e632AC44D"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0x86E71075e55F0aaD27D700017E0783458310c98a:
-        "Fraxferry"
      implementationNames.eth:0x86E71075e55F0aaD27D700017E0783458310c98a:
+        "Fraxferry"
    }
```

```diff
    contract sfrxETH Ferry Bridge (Arbitrum) (0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6) {
    +++ description: None
      address:
-        "0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6"
+        "eth:0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x95aB45875cFFdba1E5f451B950bC2E42c0053f39"
+        "eth:0x95aB45875cFFdba1E5f451B950bC2E42c0053f39"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6:
-        "Fraxferry"
      implementationNames.eth:0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6:
+        "Fraxferry"
    }
```

```diff
    contract FPIS Ferry Bridge (Optimism) (0x8Bf7Af56bB721BC3d015111508593Fcb301546F0) {
    +++ description: None
      address:
-        "0x8Bf7Af56bB721BC3d015111508593Fcb301546F0"
+        "eth:0x8Bf7Af56bB721BC3d015111508593Fcb301546F0"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0x8368Dca5CE2a4Db530c0F6e535d90B6826428Dee"
+        "eth:0x8368Dca5CE2a4Db530c0F6e535d90B6826428Dee"
      values.token:
-        "0xc2544A32872A91F4A553b404C6950e89De901fdb"
+        "eth:0xc2544A32872A91F4A553b404C6950e89De901fdb"
      implementationNames.0x8Bf7Af56bB721BC3d015111508593Fcb301546F0:
-        "Fraxferry"
      implementationNames.eth:0x8Bf7Af56bB721BC3d015111508593Fcb301546F0:
+        "Fraxferry"
    }
```

```diff
    contract sfrxETH Ferry Bridge (Polygon PoS) (0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90) {
    +++ description: None
      address:
-        "0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90"
+        "eth:0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x6d1FdBB266fCc09A16a22016369210A15bb95761"
+        "eth:0x6d1FdBB266fCc09A16a22016369210A15bb95761"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90:
-        "Fraxferry"
      implementationNames.eth:0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (Avalanche) (0x94ddd112C9ea0fb534e376BE09A50d310F0612b4) {
    +++ description: None
      address:
-        "0x94ddd112C9ea0fb534e376BE09A50d310F0612b4"
+        "eth:0x94ddd112C9ea0fb534e376BE09A50d310F0612b4"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x2018B0CA0eDcE80800851958bD094dD4a8DA1fc4"
+        "eth:0x2018B0CA0eDcE80800851958bD094dD4a8DA1fc4"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0x94ddd112C9ea0fb534e376BE09A50d310F0612b4:
-        "Fraxferry"
      implementationNames.eth:0x94ddd112C9ea0fb534e376BE09A50d310F0612b4:
+        "Fraxferry"
    }
```

```diff
    contract FPIS Ferry Bridge (Fraxtal) (0x958815f476cD07354c0BC034EE5077B20fD93003) {
    +++ description: None
      address:
-        "0x958815f476cD07354c0BC034EE5077B20fD93003"
+        "eth:0x958815f476cD07354c0BC034EE5077B20fD93003"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0xfc00000000000000000000000000000000000004"
+        "eth:0xfc00000000000000000000000000000000000004"
      values.token:
-        "0xc2544A32872A91F4A553b404C6950e89De901fdb"
+        "eth:0xc2544A32872A91F4A553b404C6950e89De901fdb"
      implementationNames.0x958815f476cD07354c0BC034EE5077B20fD93003:
-        "Fraxferry"
      implementationNames.eth:0x958815f476cD07354c0BC034EE5077B20fD93003:
+        "Fraxferry"
    }
```

```diff
    contract sFRAX Ferry Bridge (Optimism) (0x9694dcF5b6CCF6216B05FE64945f62603e2d2367) {
    +++ description: None
      address:
-        "0x9694dcF5b6CCF6216B05FE64945f62603e2d2367"
+        "eth:0x9694dcF5b6CCF6216B05FE64945f62603e2d2367"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x2Dd1B4D4548aCCeA497050619965f91f78b3b532"
+        "eth:0x2Dd1B4D4548aCCeA497050619965f91f78b3b532"
      values.token:
-        "0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
+        "eth:0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
      implementationNames.0x9694dcF5b6CCF6216B05FE64945f62603e2d2367:
-        "Fraxferry"
      implementationNames.eth:0x9694dcF5b6CCF6216B05FE64945f62603e2d2367:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (Polygon PoS) (0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26) {
    +++ description: None
      address:
-        "0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26"
+        "eth:0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xEe327F889d5947c1dc1934Bb208a1E792F953E96"
+        "eth:0xEe327F889d5947c1dc1934Bb208a1E792F953E96"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26:
-        "Fraxferry"
      implementationNames.eth:0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26:
+        "Fraxferry"
    }
```

```diff
    contract FPI Ferry Bridge (Fraxtal) (0x9A576A3d39c589A861B46864C253288bcA428a6c) {
    +++ description: None
      address:
-        "0x9A576A3d39c589A861B46864C253288bcA428a6c"
+        "eth:0x9A576A3d39c589A861B46864C253288bcA428a6c"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0xFc00000000000000000000000000000000000003"
+        "eth:0xFc00000000000000000000000000000000000003"
      values.token:
-        "0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
+        "eth:0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
      implementationNames.0x9A576A3d39c589A861B46864C253288bcA428a6c:
-        "Fraxferry"
      implementationNames.eth:0x9A576A3d39c589A861B46864C253288bcA428a6c:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (Avalanche) (0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742) {
    +++ description: None
      address:
-        "0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742"
+        "eth:0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x214DB107654fF987AD859F34125307783fC8e387"
+        "eth:0x214DB107654fF987AD859F34125307783fC8e387"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742:
-        "Fraxferry"
      implementationNames.eth:0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (bsc) (0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d) {
    +++ description: None
      address:
-        "0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d"
+        "eth:0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xe48A3d7d0Bc88d552f730B62c006bC925eadB9eE"
+        "eth:0xe48A3d7d0Bc88d552f730B62c006bC925eadB9eE"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d:
-        "Fraxferry"
      implementationNames.eth:0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (ZKsync) (0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9) {
    +++ description: None
      address:
-        "0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9"
+        "eth:0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xB54aAE4A0743aeEc1d584F2b2abC1EBDC12f1b0F"
+        "eth:0xB54aAE4A0743aeEc1d584F2b2abC1EBDC12f1b0F"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9:
-        "Fraxferry"
      implementationNames.eth:0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Avalanche) (0xA381d58e96eC3818c825E1fb264099448945CF8b) {
    +++ description: None
      address:
-        "0xA381d58e96eC3818c825E1fb264099448945CF8b"
+        "eth:0xA381d58e96eC3818c825E1fb264099448945CF8b"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64"
+        "eth:0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0xA381d58e96eC3818c825E1fb264099448945CF8b:
-        "Fraxferry"
      implementationNames.eth:0xA381d58e96eC3818c825E1fb264099448945CF8b:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (Fantom) (0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE) {
    +++ description: None
      address:
-        "0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE"
+        "eth:0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x9E73F99EE061C8807F69f9c6CCc44ea3d8c373ee"
+        "eth:0x9E73F99EE061C8807F69f9c6CCc44ea3d8c373ee"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE:
-        "Fraxferry"
      implementationNames.eth:0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE:
+        "Fraxferry"
    }
```

```diff
    contract Frax Finance Multisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      address:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2"
+        "eth:0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2"
      values.$members.1:
-        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
+        "eth:0xcbc616D595D38483e6AdC45C7E426f44bF230928"
      values.$members.2:
-        "0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e"
+        "eth:0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e"
      values.$members.3:
-        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
+        "eth:0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
      values.$members.4:
-        "0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
+        "eth:0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
      implementationNames.0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract sfrxETH Ferry Bridge (Fantom) (0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4) {
    +++ description: None
      address:
-        "0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4"
+        "eth:0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xb90CCD563918fF900928dc529aA01046795ccb4A"
+        "eth:0xb90CCD563918fF900928dc529aA01046795ccb4A"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4:
-        "Fraxferry"
      implementationNames.eth:0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4:
+        "Fraxferry"
    }
```

```diff
    contract sfrxETH Ferry Bridge (Polygon zkEVM) (0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2) {
    +++ description: None
      address:
-        "0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2"
+        "eth:0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x7c2aF1Fb79D0b1c67d4eb802d44C673D0A1D2C04"
+        "eth:0x7c2aF1Fb79D0b1c67d4eb802d44C673D0A1D2C04"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2:
-        "Fraxferry"
      implementationNames.eth:0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (polygonzkEVM) (0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a) {
    +++ description: None
      address:
-        "0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a"
+        "eth:0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x6b856a14CeA1d7dCfaF80fA6936c0b75972cCacE"
+        "eth:0x6b856a14CeA1d7dCfaF80fA6936c0b75972cCacE"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a:
-        "Fraxferry"
      implementationNames.eth:0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a:
+        "Fraxferry"
    }
```

```diff
    EOA  (0xBB437059584e30598b3AF0154472E47E6e2a45B9) {
    +++ description: None
      address:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
    }
```

```diff
    contract FPI Ferry Bridge (Avalanche) (0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1) {
    +++ description: None
      address:
-        "0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1"
+        "eth:0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0xF530904FD8F9ce55F40b7cc78382A13B0cd5C48c"
+        "eth:0xF530904FD8F9ce55F40b7cc78382A13B0cd5C48c"
      values.token:
-        "0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
+        "eth:0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
      implementationNames.0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1:
-        "Fraxferry"
      implementationNames.eth:0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1:
+        "Fraxferry"
    }
```

```diff
    contract sfrxETH Ferry Bridge (Moonbeam) (0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187) {
    +++ description: None
      address:
-        "0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187"
+        "eth:0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xecf91116348aF1cfFe335e9807f0051332BE128D"
+        "eth:0xecf91116348aF1cfFe335e9807f0051332BE128D"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187:
-        "Fraxferry"
      implementationNames.eth:0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187:
+        "Fraxferry"
    }
```

```diff
    contract FPI Ferry Bridge (Optimism) (0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a) {
    +++ description: None
      address:
-        "0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a"
+        "eth:0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0xC5d43A94e26fCa47A9b21CF547ae4AA0268670E1"
+        "eth:0xC5d43A94e26fCa47A9b21CF547ae4AA0268670E1"
      values.token:
-        "0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
+        "eth:0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
      implementationNames.0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a:
-        "Fraxferry"
      implementationNames.eth:0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a:
+        "Fraxferry"
    }
```

```diff
    EOA  (0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228) {
    +++ description: None
      address:
-        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
+        "eth:0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
    }
```

```diff
    contract FXS Ferry Bridge (Polygon PoS) (0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276) {
    +++ description: None
      address:
-        "0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276"
+        "eth:0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x1a3acf6D19267E2d3e7f898f42803e90C9219062"
+        "eth:0x1a3acf6D19267E2d3e7f898f42803e90C9219062"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276:
-        "Fraxferry"
      implementationNames.eth:0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276:
+        "Fraxferry"
    }
```

```diff
    EOA  (0xcbc616D595D38483e6AdC45C7E426f44bF230928) {
    +++ description: None
      address:
-        "0xcbc616D595D38483e6AdC45C7E426f44bF230928"
+        "eth:0xcbc616D595D38483e6AdC45C7E426f44bF230928"
    }
```

```diff
    contract FPIS Ferry Bridge (Arbitrum) (0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E) {
    +++ description: None
      address:
-        "0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E"
+        "eth:0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0x3405E88af759992937b84E58F2Fe691EF0EeA320"
+        "eth:0x3405E88af759992937b84E58F2Fe691EF0EeA320"
      values.token:
-        "0xc2544A32872A91F4A553b404C6950e89De901fdb"
+        "eth:0xc2544A32872A91F4A553b404C6950e89De901fdb"
      implementationNames.0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E:
-        "Fraxferry"
      implementationNames.eth:0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E:
+        "Fraxferry"
    }
```

```diff
    contract frxETH Ferry Bridge (bsc) (0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5) {
    +++ description: None
      address:
-        "0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5"
+        "eth:0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x64048A7eEcF3a2F1BA9e144aAc3D7dB6e58F555e"
+        "eth:0x64048A7eEcF3a2F1BA9e144aAc3D7dB6e58F555e"
      values.token:
-        "0x5E8422345238F34275888049021821E8E08CAa1f"
+        "eth:0x5E8422345238F34275888049021821E8E08CAa1f"
      implementationNames.0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5:
-        "Fraxferry"
      implementationNames.eth:0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (bsc) (0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9) {
    +++ description: None
      address:
-        "0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9"
+        "eth:0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x90C97F71E18723b0Cf0dfa30ee176Ab653E89F40"
+        "eth:0x90C97F71E18723b0Cf0dfa30ee176Ab653E89F40"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9:
-        "Fraxferry"
      implementationNames.eth:0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9:
+        "Fraxferry"
    }
```

```diff
    contract sFRAX Ferry Bridge (bsc) (0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9) {
    +++ description: None
      address:
-        "0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9"
+        "eth:0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xa63f56985F9C7F3bc9fFc5685535649e0C1a55f3"
+        "eth:0xa63f56985F9C7F3bc9fFc5685535649e0C1a55f3"
      values.token:
-        "0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
+        "eth:0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32"
      implementationNames.0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9:
-        "Fraxferry"
      implementationNames.eth:0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9:
+        "Fraxferry"
    }
```

```diff
    contract FPIS Ferry Bridge (bsc) (0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5) {
    +++ description: None
      address:
-        "0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5"
+        "eth:0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0xD1738eB733A636d1b8665f48bC8a24dA889c2562"
+        "eth:0xD1738eB733A636d1b8665f48bC8a24dA889c2562"
      values.token:
-        "0xc2544A32872A91F4A553b404C6950e89De901fdb"
+        "eth:0xc2544A32872A91F4A553b404C6950e89De901fdb"
      implementationNames.0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5:
-        "Fraxferry"
      implementationNames.eth:0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Moonbeam) (0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242) {
    +++ description: None
      address:
-        "0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242"
+        "eth:0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x322E86852e492a7Ee17f28a78c663da38FB33bfb"
+        "eth:0x322E86852e492a7Ee17f28a78c663da38FB33bfb"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242:
-        "Fraxferry"
      implementationNames.eth:0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242:
+        "Fraxferry"
    }
```

```diff
    contract sfrxETH Ferry Bridge (Avalanche) (0xF380200B115Caa22D49e6C115b758d6130377620) {
    +++ description: None
      address:
-        "0xF380200B115Caa22D49e6C115b758d6130377620"
+        "eth:0xF380200B115Caa22D49e6C115b758d6130377620"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x6D3B126ae28f3E39894070148B377624F6Ab4a45"
+        "eth:0x6D3B126ae28f3E39894070148B377624F6Ab4a45"
      values.token:
-        "0xac3E018457B222d93114458476f3E3416Abbe38F"
+        "eth:0xac3E018457B222d93114458476f3E3416Abbe38F"
      implementationNames.0xF380200B115Caa22D49e6C115b758d6130377620:
-        "Fraxferry"
      implementationNames.eth:0xF380200B115Caa22D49e6C115b758d6130377620:
+        "Fraxferry"
    }
```

```diff
    contract FPIS Ferry Bridge (Polygon zkEVM) (0xF887C4cFAAfB43d1AA7De204344895591016772c) {
    +++ description: None
      address:
-        "0xF887C4cFAAfB43d1AA7De204344895591016772c"
+        "eth:0xF887C4cFAAfB43d1AA7De204344895591016772c"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0xdE7df9036801676aF0cB73661d93a098c0085fba"
+        "eth:0xdE7df9036801676aF0cB73661d93a098c0085fba"
      values.token:
-        "0xc2544A32872A91F4A553b404C6950e89De901fdb"
+        "eth:0xc2544A32872A91F4A553b404C6950e89De901fdb"
      implementationNames.0xF887C4cFAAfB43d1AA7De204344895591016772c:
-        "Fraxferry"
      implementationNames.eth:0xF887C4cFAAfB43d1AA7De204344895591016772c:
+        "Fraxferry"
    }
```

```diff
    contract FRAX Ferry Bridge (Fantom) (0xfB788F9E20ef426a32A67986654750172A6c1788) {
    +++ description: None
      address:
-        "0xfB788F9E20ef426a32A67986654750172A6c1788"
+        "eth:0xfB788F9E20ef426a32A67986654750172A6c1788"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355"
+        "eth:0xdc301622e621166BD8E82f2cA0A26c13Ad0BE355"
      values.token:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      implementationNames.0xfB788F9E20ef426a32A67986654750172A6c1788:
-        "Fraxferry"
      implementationNames.eth:0xfB788F9E20ef426a32A67986654750172A6c1788:
+        "Fraxferry"
    }
```

```diff
    contract FPIS Ferry Bridge (ZKsync) (0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482) {
    +++ description: None
      address:
-        "0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482"
+        "eth:0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x36711BA13B461f1998EC9f9B36A410799560f206"
+        "eth:0x36711BA13B461f1998EC9f9B36A410799560f206"
      values.token:
-        "0xc2544A32872A91F4A553b404C6950e89De901fdb"
+        "eth:0xc2544A32872A91F4A553b404C6950e89De901fdb"
      implementationNames.0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482:
-        "Fraxferry"
      implementationNames.eth:0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482:
+        "Fraxferry"
    }
```

```diff
    contract FPI Ferry Bridge (bsc) (0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393) {
    +++ description: None
      address:
-        "0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393"
+        "eth:0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
+        "eth:0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502"
      values.targetToken:
-        "0x2Dd1B4D4548aCCeA497050619965f91f78b3b532"
+        "eth:0x2Dd1B4D4548aCCeA497050619965f91f78b3b532"
      values.token:
-        "0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
+        "eth:0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E"
      implementationNames.0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393:
-        "Fraxferry"
      implementationNames.eth:0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393:
+        "Fraxferry"
    }
```

```diff
    contract FXS Ferry Bridge (Moonriver) (0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE) {
    +++ description: None
      address:
-        "0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE"
+        "eth:0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE"
      values.captain:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.firstOfficer:
-        "0xBB437059584e30598b3AF0154472E47E6e2a45B9"
+        "eth:0xBB437059584e30598b3AF0154472E47E6e2a45B9"
      values.nominatedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
+        "eth:0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      values.targetToken:
-        "0x6f1D1Ee50846Fcbc3de91723E61cb68CFa6D0E98"
+        "eth:0x6f1D1Ee50846Fcbc3de91723E61cb68CFa6D0E98"
      values.token:
-        "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
+        "eth:0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0"
      implementationNames.0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE:
-        "Fraxferry"
      implementationNames.eth:0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE:
+        "Fraxferry"
    }
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Optimism) (0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Optimism) (0x06Fa869caa1160754C6a0B744Da6454c5EA325d4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (ZKsync) (0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Fantom) (0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Moonriver) (0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Avalanche) (0x18A5ca670dC42D0551f00E11A730074f6787f17F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Moonbeam) (0x228567c10b7533C88057c10dDeA6349360F122c5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Arbitrum) (0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (ZKsync) (0x27E97F35D80514D5DD1Caa730e22a292E912a214)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (ZKsync) (0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Fraxtal) (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (evmos) (0x2d2261f970F605C813f160E8BAEd455E9004A842)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Moonbeam) (0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Optimism) (0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (ZKsync) (0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Polygon zkEVM) (0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Boba) (0x3eF1d856EA62A2292B8690855042095a7aC48B4b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Polygon PoS) (0x43959A388603DCb6B02Ca084A55d4c7f3b442c57)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Polygon zkEVM) (0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Fraxtal) (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Arbitrum) (0x4b8792aF00eaE944484bF572bc33029B2184a50C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Arbitrum) (0x505603e2440b44C1602b44D0Eb8385399b3F7bab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Arbitrum) (0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Avalanche) (0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Fraxtal) (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Fraxtal) (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Polygon zkEVM) (0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (bsc) (0x621D0e62f26314387f338A2509aFA3Ae3414661A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Optimism) (0x6650D5183C4Cd294a81B1F724c365b0c42f8270a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Multisig (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Aurora) (0x6ac96F65156281a9383455D704b58A74ea9C9eC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Arbitrum) (0x85c5f05Ae4CB68190C695a22b292C3bA90696128)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Polygon zkEVM) (0x86E71075e55F0aaD27D700017E0783458310c98a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Arbitrum) (0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Optimism) (0x8Bf7Af56bB721BC3d015111508593Fcb301546F0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Polygon PoS) (0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Avalanche) (0x94ddd112C9ea0fb534e376BE09A50d310F0612b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Fraxtal) (0x958815f476cD07354c0BC034EE5077B20fD93003)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Optimism) (0x9694dcF5b6CCF6216B05FE64945f62603e2d2367)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Polygon PoS) (0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Fraxtal) (0x9A576A3d39c589A861B46864C253288bcA428a6c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Avalanche) (0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (bsc) (0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (ZKsync) (0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Avalanche) (0xA381d58e96eC3818c825E1fb264099448945CF8b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Fantom) (0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Frax Finance Multisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Fantom) (0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Polygon zkEVM) (0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (polygonzkEVM) (0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Avalanche) (0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Moonbeam) (0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Optimism) (0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Polygon PoS) (0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Arbitrum) (0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (bsc) (0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (bsc) (0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (bsc) (0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (bsc) (0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Moonbeam) (0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Avalanche) (0xF380200B115Caa22D49e6C115b758d6130377620)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Polygon zkEVM) (0xF887C4cFAAfB43d1AA7De204344895591016772c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Fantom) (0xfB788F9E20ef426a32A67986654750172A6c1788)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (ZKsync) (0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (bsc) (0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Moonriver) (0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE)
    +++ description: None
```

Generated with discovered.json: 0x417ed8c478ad940d7c5962964ad4bf5b40a50872

# Diff at Thu, 08 May 2025 09:21:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 21880952
- current block number: 22437895

## Description

Two bridges paused, FE should correctly reflect it.

## Watched changes

```diff
    contract FXS Ferry Bridge (Fraxtal) (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

```diff
    contract FRAX Ferry Bridge (Fraxtal) (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x68f02b017d77db74573c98e626f38bb1560cbe29

# Diff at Tue, 04 Mar 2025 10:39:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21880952
- current block number: 21880952

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880952 (main branch discovery), not current.

```diff
    contract sfrxETH Ferry Bridge (Optimism) (0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC) {
    +++ description: None
      sinceBlock:
+        16365436
    }
```

```diff
    contract FRAX Ferry Bridge (Optimism) (0x06Fa869caa1160754C6a0B744Da6454c5EA325d4) {
    +++ description: None
      sinceBlock:
+        15963106
    }
```

```diff
    contract FPI Ferry Bridge (ZKsync) (0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5) {
    +++ description: None
      sinceBlock:
+        17103686
    }
```

```diff
    contract FXS Ferry Bridge (Fantom) (0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622) {
    +++ description: None
      sinceBlock:
+        16453840
    }
```

```diff
    contract FRAX Ferry Bridge (Moonriver) (0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0) {
    +++ description: None
      sinceBlock:
+        15964667
    }
```

```diff
    contract FPIS Ferry Bridge (Avalanche) (0x18A5ca670dC42D0551f00E11A730074f6787f17F) {
    +++ description: None
      sinceBlock:
+        17182542
    }
```

```diff
    contract frxETH Ferry Bridge (Moonbeam) (0x228567c10b7533C88057c10dDeA6349360F122c5) {
    +++ description: None
      sinceBlock:
+        16365158
    }
```

```diff
    contract sFRAX Ferry Bridge (Arbitrum) (0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d) {
    +++ description: None
      sinceBlock:
+        18552986
    }
```

```diff
    contract FXS Ferry Bridge (ZKsync) (0x27E97F35D80514D5DD1Caa730e22a292E912a214) {
    +++ description: None
      sinceBlock:
+        17103619
    }
```

```diff
    contract sfrxETH Ferry Bridge (ZKsync) (0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37) {
    +++ description: None
      sinceBlock:
+        17103716
    }
```

```diff
    contract sFRAX Ferry Bridge (Fraxtal) (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47) {
    +++ description: None
      sinceBlock:
+        19299909
    }
```

```diff
    contract FRAX Ferry Bridge (evmos) (0x2d2261f970F605C813f160E8BAEd455E9004A842) {
    +++ description: None
      sinceBlock:
+        16284725
    }
```

```diff
    contract FXS Ferry Bridge (Moonbeam) (0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A) {
    +++ description: None
      sinceBlock:
+        16457044
    }
```

```diff
    contract frxETH Ferry Bridge (Optimism) (0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2) {
    +++ description: None
      sinceBlock:
+        16365428
    }
```

```diff
    contract FRAX Ferry Bridge (ZKsync) (0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4) {
    +++ description: None
      sinceBlock:
+        17103613
    }
```

```diff
    contract frxETH Ferry Bridge (Polygon zkEVM) (0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137) {
    +++ description: None
      sinceBlock:
+        16978490
    }
```

```diff
    contract FRAX Ferry Bridge (Boba) (0x3eF1d856EA62A2292B8690855042095a7aC48B4b) {
    +++ description: None
      sinceBlock:
+        16284714
    }
```

```diff
    contract FRAX Ferry Bridge (Polygon PoS) (0x43959A388603DCb6B02Ca084A55d4c7f3b442c57) {
    +++ description: None
      sinceBlock:
+        15963120
    }
```

```diff
    contract FPI Ferry Bridge (Polygon zkEVM) (0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349) {
    +++ description: None
      sinceBlock:
+        16978474
    }
```

```diff
    contract FXS Ferry Bridge (Fraxtal) (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6) {
    +++ description: None
      sinceBlock:
+        19299859
    }
```

```diff
    contract FXS Ferry Bridge (Arbitrum) (0x4b8792aF00eaE944484bF572bc33029B2184a50C) {
    +++ description: None
      sinceBlock:
+        16453509
    }
```

```diff
    contract frxETH Ferry Bridge (Arbitrum) (0x505603e2440b44C1602b44D0Eb8385399b3F7bab) {
    +++ description: None
      sinceBlock:
+        16364862
    }
```

```diff
    contract FPI Ferry Bridge (Arbitrum) (0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB) {
    +++ description: None
      sinceBlock:
+        16679694
    }
```

```diff
    contract sFRAX Ferry Bridge (Avalanche) (0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9) {
    +++ description: None
      sinceBlock:
+        18553022
    }
```

```diff
    contract sfrxETH Ferry Bridge (Fraxtal) (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3) {
    +++ description: None
      sinceBlock:
+        19299903
    }
```

```diff
    contract FRAX Ferry Bridge (Fraxtal) (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE) {
    +++ description: None
      sinceBlock:
+        19299834
    }
```

```diff
    contract sFRAX Ferry Bridge (Polygon zkEVM) (0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E) {
    +++ description: None
      sinceBlock:
+        18553042
    }
```

```diff
    contract sfrxETH Ferry Bridge (bsc) (0x621D0e62f26314387f338A2509aFA3Ae3414661A) {
    +++ description: None
      sinceBlock:
+        16364959
    }
```

```diff
    contract FXS Ferry Bridge (Optimism) (0x6650D5183C4Cd294a81B1F724c365b0c42f8270a) {
    +++ description: None
      sinceBlock:
+        16457075
    }
```

```diff
    contract FPI Multisig (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      sinceBlock:
+        14522206
    }
```

```diff
    contract FRAX Ferry Bridge (Aurora) (0x6ac96F65156281a9383455D704b58A74ea9C9eC4) {
    +++ description: None
      sinceBlock:
+        15928395
    }
```

```diff
    contract FRAX Ferry Bridge (Arbitrum) (0x85c5f05Ae4CB68190C695a22b292C3bA90696128) {
    +++ description: None
      sinceBlock:
+        15963031
    }
```

```diff
    contract FRAX Ferry Bridge (Polygon zkEVM) (0x86E71075e55F0aaD27D700017E0783458310c98a) {
    +++ description: None
      sinceBlock:
+        16978452
    }
```

```diff
    contract sfrxETH Ferry Bridge (Arbitrum) (0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6) {
    +++ description: None
      sinceBlock:
+        16364883
    }
```

```diff
    contract FPIS Ferry Bridge (Optimism) (0x8Bf7Af56bB721BC3d015111508593Fcb301546F0) {
    +++ description: None
      sinceBlock:
+        16986425
    }
```

```diff
    contract sfrxETH Ferry Bridge (Polygon PoS) (0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90) {
    +++ description: None
      sinceBlock:
+        16365376
    }
```

```diff
    contract frxETH Ferry Bridge (Avalanche) (0x94ddd112C9ea0fb534e376BE09A50d310F0612b4) {
    +++ description: None
      sinceBlock:
+        17182548
    }
```

```diff
    contract FPIS Ferry Bridge (Fraxtal) (0x958815f476cD07354c0BC034EE5077B20fD93003) {
    +++ description: None
      sinceBlock:
+        19299869
    }
```

```diff
    contract sFRAX Ferry Bridge (Optimism) (0x9694dcF5b6CCF6216B05FE64945f62603e2d2367) {
    +++ description: None
      sinceBlock:
+        18553029
    }
```

```diff
    contract frxETH Ferry Bridge (Polygon PoS) (0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26) {
    +++ description: None
      sinceBlock:
+        16365367
    }
```

```diff
    contract FPI Ferry Bridge (Fraxtal) (0x9A576A3d39c589A861B46864C253288bcA428a6c) {
    +++ description: None
      sinceBlock:
+        19299864
    }
```

```diff
    contract FXS Ferry Bridge (Avalanche) (0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742) {
    +++ description: None
      sinceBlock:
+        16453591
    }
```

```diff
    contract FXS Ferry Bridge (bsc) (0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d) {
    +++ description: None
      sinceBlock:
+        16453757
    }
```

```diff
    contract frxETH Ferry Bridge (ZKsync) (0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9) {
    +++ description: None
      sinceBlock:
+        17103698
    }
```

```diff
    contract FRAX Ferry Bridge (Avalanche) (0xA381d58e96eC3818c825E1fb264099448945CF8b) {
    +++ description: None
      sinceBlock:
+        15963057
    }
```

```diff
    contract frxETH Ferry Bridge (Fantom) (0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE) {
    +++ description: None
      sinceBlock:
+        16470815
    }
```

```diff
    contract Frax Finance Multisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      sinceBlock:
+        13077564
    }
```

```diff
    contract sfrxETH Ferry Bridge (Fantom) (0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4) {
    +++ description: None
      sinceBlock:
+        16470835
    }
```

```diff
    contract sfrxETH Ferry Bridge (Polygon zkEVM) (0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2) {
    +++ description: None
      sinceBlock:
+        16978498
    }
```

```diff
    contract FXS Ferry Bridge (polygonzkEVM) (0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a) {
    +++ description: None
      sinceBlock:
+        16978464
    }
```

```diff
    contract FPI Ferry Bridge (Avalanche) (0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1) {
    +++ description: None
      sinceBlock:
+        17182536
    }
```

```diff
    contract sfrxETH Ferry Bridge (Moonbeam) (0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187) {
    +++ description: None
      sinceBlock:
+        16365191
    }
```

```diff
    contract FPI Ferry Bridge (Optimism) (0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a) {
    +++ description: None
      sinceBlock:
+        16986411
    }
```

```diff
    contract FXS Ferry Bridge (Polygon PoS) (0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276) {
    +++ description: None
      sinceBlock:
+        16456981
    }
```

```diff
    contract FPIS Ferry Bridge (Arbitrum) (0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E) {
    +++ description: None
      sinceBlock:
+        16679704
    }
```

```diff
    contract frxETH Ferry Bridge (bsc) (0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5) {
    +++ description: None
      sinceBlock:
+        16364951
    }
```

```diff
    contract FRAX Ferry Bridge (bsc) (0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9) {
    +++ description: None
      sinceBlock:
+        15963068
    }
```

```diff
    contract sFRAX Ferry Bridge (bsc) (0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9) {
    +++ description: None
      sinceBlock:
+        18553015
    }
```

```diff
    contract FPIS Ferry Bridge (bsc) (0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5) {
    +++ description: None
      sinceBlock:
+        16679727
    }
```

```diff
    contract FRAX Ferry Bridge (Moonbeam) (0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242) {
    +++ description: None
      sinceBlock:
+        15963091
    }
```

```diff
    contract sfrxETH Ferry Bridge (Avalanche) (0xF380200B115Caa22D49e6C115b758d6130377620) {
    +++ description: None
      sinceBlock:
+        17182554
    }
```

```diff
    contract FPIS Ferry Bridge (Polygon zkEVM) (0xF887C4cFAAfB43d1AA7De204344895591016772c) {
    +++ description: None
      sinceBlock:
+        16978483
    }
```

```diff
    contract FRAX Ferry Bridge (Fantom) (0xfB788F9E20ef426a32A67986654750172A6c1788) {
    +++ description: None
      sinceBlock:
+        15963081
    }
```

```diff
    contract FPIS Ferry Bridge (ZKsync) (0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482) {
    +++ description: None
      sinceBlock:
+        17103692
    }
```

```diff
    contract FPI Ferry Bridge (bsc) (0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393) {
    +++ description: None
      sinceBlock:
+        16679719
    }
```

```diff
    contract FXS Ferry Bridge (Moonriver) (0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE) {
    +++ description: None
      sinceBlock:
+        16638006
    }
```

Generated with discovered.json: 0xc87f1dfc0d29488586b4047d1b914cb217896244

# Diff at Wed, 19 Feb 2025 14:17:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@90e939c93581cd5b2e00d23bb3ba08dde38932e8 block: 21844142
- current block number: 21880952

## Description

sFRAX Ferry Bridge (Avalanche), will be reflected on FE, although only in the contract text as a string.

## Watched changes

```diff
    contract sFRAX Ferry Bridge (Avalanche) (0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x0d5d7f1a32a70a733d8d9b3111967e0e4c5207e9

# Diff at Fri, 14 Feb 2025 10:37:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 21802905
- current block number: 21844142

## Description

sFrax bridge paused.

## Watched changes

```diff
    contract sFRAX Ferry Bridge (Fraxtal) (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x0c7f5ba04b1527cefb5e1be849aa2b7cd9ccf79d

# Diff at Sat, 08 Feb 2025 16:13:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21388115
- current block number: 21802905

## Description

Fraxtal MS single signer change.

## Watched changes

```diff
    contract Frax Finance Multisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      values.$members.4:
-        "0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"
+        "0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"
    }
```

Generated with discovered.json: 0xf75804d21302b2897149d7174b91655278712134

# Diff at Thu, 12 Dec 2024 18:07:50 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 19697870
- current block number: 21388115

## Description

Ignored not needed values in ferry template.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19697870 (main branch discovery), not current.

```diff
    contract sfrxETH Ferry Bridge (Optimism) (0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC) {
    +++ description: None
      values.executeIndex:
-        43
      values.noBatches:
-        44
      values.noTransactions:
-        111
    }
```

```diff
    contract FRAX Ferry Bridge (Optimism) (0x06Fa869caa1160754C6a0B744Da6454c5EA325d4) {
    +++ description: None
      values.executeIndex:
-        98
      values.noBatches:
-        98
      values.noTransactions:
-        109
    }
```

```diff
    contract FPI Ferry Bridge (ZKsync) (0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        1
    }
```

```diff
    contract FXS Ferry Bridge (Fantom) (0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622) {
    +++ description: None
      values.executeIndex:
-        59
      values.noBatches:
-        59
      values.noTransactions:
-        87
    }
```

```diff
    contract FRAX Ferry Bridge (Moonriver) (0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0) {
    +++ description: None
      values.executeIndex:
-        210
      values.noBatches:
-        210
      values.noTransactions:
-        110
    }
```

```diff
    contract FPIS Ferry Bridge (Avalanche) (0x18A5ca670dC42D0551f00E11A730074f6787f17F) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract frxETH Ferry Bridge (Moonbeam) (0x228567c10b7533C88057c10dDeA6349360F122c5) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        2
    }
```

```diff
    contract sFRAX Ferry Bridge (Arbitrum) (0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d) {
    +++ description: None
      values.executeIndex:
-        8
      values.noBatches:
-        8
      values.noTransactions:
-        41
    }
```

```diff
    contract FXS Ferry Bridge (ZKsync) (0x27E97F35D80514D5DD1Caa730e22a292E912a214) {
    +++ description: None
      values.executeIndex:
-        2
      values.noBatches:
-        2
      values.noTransactions:
-        4
    }
```

```diff
    contract sfrxETH Ferry Bridge (ZKsync) (0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        3
    }
```

```diff
    contract FRAX Ferry Bridge (evmos) (0x2d2261f970F605C813f160E8BAEd455E9004A842) {
    +++ description: None
      values.executeIndex:
-        5
      values.noBatches:
-        5
      values.noTransactions:
-        1
    }
```

```diff
    contract FXS Ferry Bridge (Moonbeam) (0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A) {
    +++ description: None
      values.executeIndex:
-        22
      values.noBatches:
-        22
      values.noTransactions:
-        47
    }
```

```diff
    contract frxETH Ferry Bridge (Optimism) (0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2) {
    +++ description: None
      values.executeIndex:
-        75
      values.noBatches:
-        75
      values.noTransactions:
-        149
    }
```

```diff
    contract FRAX Ferry Bridge (ZKsync) (0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4) {
    +++ description: None
      values.executeIndex:
-        5
      values.noBatches:
-        5
      values.noTransactions:
-        11
    }
```

```diff
    contract frxETH Ferry Bridge (Polygon zkEVM) (0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137) {
    +++ description: None
      values.executeIndex:
-        27
      values.noBatches:
-        27
      values.noTransactions:
-        26
    }
```

```diff
    contract FRAX Ferry Bridge (Boba) (0x3eF1d856EA62A2292B8690855042095a7aC48B4b) {
    +++ description: None
      values.executeIndex:
-        12
      values.noBatches:
-        12
      values.noTransactions:
-        0
    }
```

```diff
    contract FRAX Ferry Bridge (Polygon PoS) (0x43959A388603DCb6B02Ca084A55d4c7f3b442c57) {
    +++ description: None
      values.executeIndex:
-        72
      values.noBatches:
-        72
      values.noTransactions:
-        92
    }
```

```diff
    contract FPI Ferry Bridge (Polygon zkEVM) (0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        1
    }
```

```diff
    contract FXS Ferry Bridge (Arbitrum) (0x4b8792aF00eaE944484bF572bc33029B2184a50C) {
    +++ description: None
      values.executeIndex:
-        181
      values.noBatches:
-        181
      values.noTransactions:
-        287
    }
```

```diff
    contract frxETH Ferry Bridge (Arbitrum) (0x505603e2440b44C1602b44D0Eb8385399b3F7bab) {
    +++ description: None
      values.executeIndex:
-        91
      values.noBatches:
-        92
      values.noTransactions:
-        207
    }
```

```diff
    contract FPI Ferry Bridge (Arbitrum) (0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB) {
    +++ description: None
      values.executeIndex:
-        11
      values.noBatches:
-        11
      values.noTransactions:
-        12
    }
```

```diff
    contract sFRAX Ferry Bridge (Avalanche) (0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        1
    }
```

```diff
    contract sFRAX Ferry Bridge (Polygon zkEVM) (0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        1
    }
```

```diff
    contract sfrxETH Ferry Bridge (bsc) (0x621D0e62f26314387f338A2509aFA3Ae3414661A) {
    +++ description: None
      values.executeIndex:
-        49
      values.noBatches:
-        49
      values.noTransactions:
-        72
    }
```

```diff
    contract FXS Ferry Bridge (Optimism) (0x6650D5183C4Cd294a81B1F724c365b0c42f8270a) {
    +++ description: None
      values.executeIndex:
-        71
      values.noBatches:
-        71
      values.noTransactions:
-        71
    }
```

```diff
    contract FRAX Ferry Bridge (Aurora) (0x6ac96F65156281a9383455D704b58A74ea9C9eC4) {
    +++ description: None
      values.executeIndex:
-        9
      values.noBatches:
-        9
      values.noTransactions:
-        9
    }
```

```diff
    contract FRAX Ferry Bridge (Arbitrum) (0x85c5f05Ae4CB68190C695a22b292C3bA90696128) {
    +++ description: None
      values.executeIndex:
-        199
      values.noBatches:
-        199
      values.noTransactions:
-        335
    }
```

```diff
    contract FRAX Ferry Bridge (Polygon zkEVM) (0x86E71075e55F0aaD27D700017E0783458310c98a) {
    +++ description: None
      values.executeIndex:
-        22
      values.noBatches:
-        22
      values.noTransactions:
-        24
    }
```

```diff
    contract sfrxETH Ferry Bridge (Arbitrum) (0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6) {
    +++ description: None
      values.executeIndex:
-        68
      values.noBatches:
-        68
      values.noTransactions:
-        146
    }
```

```diff
    contract FPIS Ferry Bridge (Optimism) (0x8Bf7Af56bB721BC3d015111508593Fcb301546F0) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract sfrxETH Ferry Bridge (Polygon PoS) (0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract frxETH Ferry Bridge (Avalanche) (0x94ddd112C9ea0fb534e376BE09A50d310F0612b4) {
    +++ description: None
      values.executeIndex:
-        9
      values.noBatches:
-        9
      values.noTransactions:
-        13
    }
```

```diff
    contract sFRAX Ferry Bridge (Optimism) (0x9694dcF5b6CCF6216B05FE64945f62603e2d2367) {
    +++ description: None
      values.executeIndex:
-        5
      values.noBatches:
-        5
      values.noTransactions:
-        26
    }
```

```diff
    contract frxETH Ferry Bridge (Polygon PoS) (0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26) {
    +++ description: None
      values.executeIndex:
-        33
      values.noBatches:
-        33
      values.noTransactions:
-        48
    }
```

```diff
    contract FXS Ferry Bridge (Avalanche) (0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742) {
    +++ description: None
      values.executeIndex:
-        36
      values.noBatches:
-        36
      values.noTransactions:
-        59
    }
```

```diff
    contract FXS Ferry Bridge (bsc) (0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d) {
    +++ description: None
      values.executeIndex:
-        55
      values.noBatches:
-        55
      values.noTransactions:
-        73
    }
```

```diff
    contract frxETH Ferry Bridge (ZKsync) (0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        6
    }
```

```diff
    contract FRAX Ferry Bridge (Avalanche) (0xA381d58e96eC3818c825E1fb264099448945CF8b) {
    +++ description: None
      values.executeIndex:
-        61
      values.noBatches:
-        62
      values.noTransactions:
-        45
    }
```

```diff
    contract frxETH Ferry Bridge (Fantom) (0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE) {
    +++ description: None
      values.executeIndex:
-        10
      values.noBatches:
-        10
      values.noTransactions:
-        15
    }
```

```diff
    contract sfrxETH Ferry Bridge (Fantom) (0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract sfrxETH Ferry Bridge (Polygon zkEVM) (0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2) {
    +++ description: None
      values.executeIndex:
-        12
      values.noBatches:
-        12
      values.noTransactions:
-        16
    }
```

```diff
    contract FXS Ferry Bridge (polygonzkEVM) (0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a) {
    +++ description: None
      values.executeIndex:
-        11
      values.noBatches:
-        11
      values.noTransactions:
-        6
    }
```

```diff
    contract FPI Ferry Bridge (Avalanche) (0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract sfrxETH Ferry Bridge (Moonbeam) (0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract FPI Ferry Bridge (Optimism) (0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract FXS Ferry Bridge (Polygon PoS) (0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276) {
    +++ description: None
      values.executeIndex:
-        28
      values.noBatches:
-        28
      values.noTransactions:
-        61
    }
```

```diff
    contract FPIS Ferry Bridge (Arbitrum) (0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E) {
    +++ description: None
      values.executeIndex:
-        2
      values.noBatches:
-        2
      values.noTransactions:
-        4
    }
```

```diff
    contract frxETH Ferry Bridge (bsc) (0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5) {
    +++ description: None
      values.executeIndex:
-        79
      values.noBatches:
-        79
      values.noTransactions:
-        140
    }
```

```diff
    contract FRAX Ferry Bridge (bsc) (0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9) {
    +++ description: None
      values.executeIndex:
-        151
      values.noBatches:
-        151
      values.noTransactions:
-        221
    }
```

```diff
    contract sFRAX Ferry Bridge (bsc) (0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9) {
    +++ description: None
      values.executeIndex:
-        4
      values.noBatches:
-        4
      values.noTransactions:
-        7
    }
```

```diff
    contract FPIS Ferry Bridge (bsc) (0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract FRAX Ferry Bridge (Moonbeam) (0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242) {
    +++ description: None
      values.executeIndex:
-        123
      values.noBatches:
-        123
      values.noTransactions:
-        112
    }
```

```diff
    contract sfrxETH Ferry Bridge (Avalanche) (0xF380200B115Caa22D49e6C115b758d6130377620) {
    +++ description: None
      values.executeIndex:
-        4
      values.noBatches:
-        4
      values.noTransactions:
-        10
    }
```

```diff
    contract FPIS Ferry Bridge (Polygon zkEVM) (0xF887C4cFAAfB43d1AA7De204344895591016772c) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        1
    }
```

```diff
    contract FRAX Ferry Bridge (Fantom) (0xfB788F9E20ef426a32A67986654750172A6c1788) {
    +++ description: None
      values.executeIndex:
-        143
      values.noBatches:
-        143
      values.noTransactions:
-        109
    }
```

```diff
    contract FPIS Ferry Bridge (ZKsync) (0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        1
    }
```

```diff
    contract FPI Ferry Bridge (bsc) (0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393) {
    +++ description: None
      values.executeIndex:
-        0
      values.noBatches:
-        0
      values.noTransactions:
-        0
    }
```

```diff
    contract FXS Ferry Bridge (Moonriver) (0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE) {
    +++ description: None
      values.executeIndex:
-        2
      values.noBatches:
-        2
      values.noTransactions:
-        3
    }
```

Generated with discovered.json: 0x35813d3714df8c5ffd216b896a66a8f3ad866ec7

# Diff at Tue, 10 Dec 2024 10:38:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 19697870
- current block number: 19697870

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19697870 (main branch discovery), not current.

```diff
    contract sFRAX Ferry Bridge (Fraxtal) (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47) {
    +++ description: None
      name:
-        "sfraxFerryBridgeFraxtal"
+        "sFRAX Ferry Bridge (Fraxtal)"
    }
```

```diff
    contract FXS Ferry Bridge (Fraxtal) (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6) {
    +++ description: None
      name:
-        "fxsFerryBridgeFraxtal"
+        "FXS Ferry Bridge (Fraxtal)"
    }
```

```diff
    contract sfrxETH Ferry Bridge (Fraxtal) (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3) {
    +++ description: None
      name:
-        "sfrxFerryBridgeFraxtal"
+        "sfrxETH Ferry Bridge (Fraxtal)"
    }
```

```diff
    contract FRAX Ferry Bridge (Fraxtal) (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE) {
    +++ description: None
      name:
-        "fraxFerryBridgeFraxtal"
+        "FRAX Ferry Bridge (Fraxtal)"
    }
```

```diff
    contract FPIS Ferry Bridge (Fraxtal) (0x958815f476cD07354c0BC034EE5077B20fD93003) {
    +++ description: None
      name:
-        "fpisFerryBridgeFraxtal"
+        "FPIS Ferry Bridge (Fraxtal)"
    }
```

```diff
    contract FPI Ferry Bridge (Fraxtal) (0x9A576A3d39c589A861B46864C253288bcA428a6c) {
    +++ description: None
      name:
-        "fpiFerryBridgeFraxtal"
+        "FPI Ferry Bridge (Fraxtal)"
    }
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Optimism) (0x04ba20D2Cc47C63bce1166C2864F0241e4D0a0CC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Optimism) (0x06Fa869caa1160754C6a0B744Da6454c5EA325d4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (ZKsync) (0x0F6136F9aBB7A0c21FbE076771625b39C544BDf5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Fantom) (0x1313d143BE1ac25aCACEFF39Bf31877bccDb9622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Moonriver) (0x15ADa72A3B52A88E25DdD2CC2bA1120234e34bb0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Avalanche) (0x18A5ca670dC42D0551f00E11A730074f6787f17F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Moonbeam) (0x228567c10b7533C88057c10dDeA6349360F122c5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Arbitrum) (0x2453b1FbD17ceA069A31C9D16A27f4F93a85Cc0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (ZKsync) (0x27E97F35D80514D5DD1Caa730e22a292E912a214)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (ZKsync) (0x29396AaE6198130A15F6Ff982C44BC4a7353Ef37)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (evmos) (0x2d2261f970F605C813f160E8BAEd455E9004A842)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Moonbeam) (0x2De1354c98880889643c4cA8B06FA2Fb8Fc1Fd7A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Optimism) (0x2F08F4645d2fA1fB12D2db8531c0c2EA0268BdE2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (ZKsync) (0x32dDf80508cfD8feD8ABe375582FC7cfD20372C4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Polygon zkEVM) (0x3aaB5C43D4e47f71DEea94a7d541E6C07e21B137)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Boba) (0x3eF1d856EA62A2292B8690855042095a7aC48B4b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Polygon PoS) (0x43959A388603DCb6B02Ca084A55d4c7f3b442c57)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Polygon zkEVM) (0x45D2d8e4aB0F5af1D29305301A1b31D5d41b3349)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Arbitrum) (0x4b8792aF00eaE944484bF572bc33029B2184a50C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Arbitrum) (0x505603e2440b44C1602b44D0Eb8385399b3F7bab)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Arbitrum) (0x5878d03AA50d2c00A921948Ea8Fa5F2d247f6BDB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Avalanche) (0x59ae66FB395893E3FD965aDb06A52d06C49dF8A9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Polygon zkEVM) (0x602cCfee6B4BA8Eb5e35Cf26e05fDEDE379e578E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (bsc) (0x621D0e62f26314387f338A2509aFA3Ae3414661A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Optimism) (0x6650D5183C4Cd294a81B1F724c365b0c42f8270a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Aurora) (0x6ac96F65156281a9383455D704b58A74ea9C9eC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Arbitrum) (0x85c5f05Ae4CB68190C695a22b292C3bA90696128)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Polygon zkEVM) (0x86E71075e55F0aaD27D700017E0783458310c98a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Arbitrum) (0x8afd5082E0C24dEcEA39A9eFb14e4ACF4373D7D6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Optimism) (0x8Bf7Af56bB721BC3d015111508593Fcb301546F0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Polygon PoS) (0x91Ff54EffF7564BA3884A91d0E293502D8E6fF90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Avalanche) (0x94ddd112C9ea0fb534e376BE09A50d310F0612b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (Optimism) (0x9694dcF5b6CCF6216B05FE64945f62603e2d2367)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Polygon PoS) (0x98f5E4b7D9eDF57A6ED41b334bD40B2eAa6B6e26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Avalanche) (0x9Ab224996D25bfDCB91d838F7f1902698Ac0a742)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (bsc) (0x9B62402Eb9A755677dEbdaE3639CB531c0Af0E5d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (ZKsync) (0x9f76b097Cd95627bFbD8052A583127FF6e7b3Fa9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Avalanche) (0xA381d58e96eC3818c825E1fb264099448945CF8b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (Fantom) (0xaF4305d05e9B08b1D17894ce1ACE8235528f7EdE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Fantom) (0xB6b0290A39E2F896bBd8fC19cf17FE393e993dE4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Polygon zkEVM) (0xb8686Ef9B7ee9e73dE5d1721E4Da580278F8F4d2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (polygonzkEVM) (0xBa32Df0b78b1A68F7FA304BbD4Ed7a56A74c525a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Avalanche) (0xbb6b54F8969a4711527fdF6AB852B6D6cdF368d1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Moonbeam) (0xbc3A2bF4FA20bE2056DCE5BFB168970BA657F187)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (Optimism) (0xC05DE1CB258bAdc152d8EAd3F573CA9A2E812B2a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Polygon PoS) (0xCa026e80F1E9e44da7ce3eD6aC2E9630260B9276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Arbitrum) (0xCd4aa7DB9D8a995a651498E94f6693A4D26e6C9E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH Ferry Bridge (bsc) (0xce4DbAF3fa72C962Ee1F371694109fc2a80B03f5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (bsc) (0xDAe210BfB0cF8c81EDB4b459e2e0bA14D553e2D9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sFRAX Ferry Bridge (bsc) (0xe3e7F354ac948ceBa925181C81618D7c9b3da8C9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (bsc) (0xf18B122c3935Ff49f62C8f1f77Dc42A6F85A0bb5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Moonbeam) (0xF1E1deA8F1053FD9C5F47f72F1f03977E17aF242)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH Ferry Bridge (Avalanche) (0xF380200B115Caa22D49e6C115b758d6130377620)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (Polygon zkEVM) (0xF887C4cFAAfB43d1AA7De204344895591016772c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAX Ferry Bridge (Fantom) (0xfB788F9E20ef426a32A67986654750172A6c1788)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS Ferry Bridge (ZKsync) (0xFBC512849D4dcEeeFAa1bfce08B3dC9daD755482)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI Ferry Bridge (bsc) (0xfbD33d2f3330f063C87b523Ba80D5F7f296E5393)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FXS Ferry Bridge (Moonriver) (0xFe7ebA20c20C8FF12A337F940Ce7A97c6e2594DE)
    +++ description: None
```

Generated with discovered.json: 0xcfe9784c25b0d27f7b68993dd31e1142996708a8

# Diff at Mon, 14 Oct 2024 10:51:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19697870
- current block number: 19697870

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19697870 (main branch discovery), not current.

```diff
    contract sfraxFerryBridgeFraxtal (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47) {
    +++ description: None
      sourceHashes:
+        ["0x326f7d9a81994cc621445ba82a4fa9f93494434ebeba2c62e615409b7195b095"]
    }
```

```diff
    contract fxsFerryBridgeFraxtal (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6) {
    +++ description: None
      sourceHashes:
+        ["0x326f7d9a81994cc621445ba82a4fa9f93494434ebeba2c62e615409b7195b095"]
    }
```

```diff
    contract sfrxFerryBridgeFraxtal (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3) {
    +++ description: None
      sourceHashes:
+        ["0x326f7d9a81994cc621445ba82a4fa9f93494434ebeba2c62e615409b7195b095"]
    }
```

```diff
    contract fraxFerryBridgeFraxtal (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE) {
    +++ description: None
      sourceHashes:
+        ["0x326f7d9a81994cc621445ba82a4fa9f93494434ebeba2c62e615409b7195b095"]
    }
```

```diff
    contract FPI Multisig (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract fpisFerryBridgeFraxtal (0x958815f476cD07354c0BC034EE5077B20fD93003) {
    +++ description: None
      sourceHashes:
+        ["0x326f7d9a81994cc621445ba82a4fa9f93494434ebeba2c62e615409b7195b095"]
    }
```

```diff
    contract fpiFerryBridgeFraxtal (0x9A576A3d39c589A861B46864C253288bcA428a6c) {
    +++ description: None
      sourceHashes:
+        ["0x326f7d9a81994cc621445ba82a4fa9f93494434ebeba2c62e615409b7195b095"]
    }
```

```diff
    contract Frax Finance Multisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x9598b6dfc01a4c33497bb0731e19ac551ee890f3

# Diff at Fri, 09 Aug 2024 10:09:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19697870
- current block number: 19697870

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19697870 (main branch discovery), not current.

```diff
    contract FPI Multisig (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0xcbc616D595D38483e6AdC45C7E426f44bF230928","0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e","0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228","0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0xcbc616D595D38483e6AdC45C7E426f44bF230928","0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e","0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228","0x6e74053a3798e0fC9a9775F7995316b27f21c4D2"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract Frax Finance Multisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0xcbc616D595D38483e6AdC45C7E426f44bF230928","0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e","0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228","0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x6933BCC3e96f1C4d2cb73Cb391d854b18Ab7A4F2","0xcbc616D595D38483e6AdC45C7E426f44bF230928","0x17e06ce6914E3969f7BD37D8b2a563890cA1c96e","0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228","0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x608a0eb360e9f1af3256cbfbaa6172b41e75e725

# Diff at Sat, 20 Apr 2024 16:39:35 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 19654781
- current block number: 19697870

## Description

All Fraxtal-facing bridges have their %-fees removed, constant fees decreased and waiting periods reduced.
Spot checks of fraxferry bridges facing other chains than fraxtal (not in discovery) show unchanged fees.

## Watched changes

```diff
    contract sfraxFerryBridgeFraxtal (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47) {
    +++ description: None
      values.FEE_MAX:
-        "100000000000000000000"
+        "1000000000000000000"
      values.FEE_MIN:
-        "5000000000000000000"
+        "1000000000000000000"
      values.FEE_RATE:
-        10
+        0
      values.MIN_WAIT_PERIOD_EXECUTE:
-        79200
+        39600
    }
```

```diff
    contract fxsFerryBridgeFraxtal (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6) {
    +++ description: None
      values.FEE_MAX:
-        "100000000000000000000"
+        "1000000000000000000"
      values.FEE_RATE:
-        10
+        0
      values.MIN_WAIT_PERIOD_EXECUTE:
-        79200
+        39600
    }
```

```diff
    contract sfrxFerryBridgeFraxtal (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3) {
    +++ description: None
      values.FEE_MAX:
-        5000000000000000
+        400000000000000
      values.FEE_MIN:
-        4000000000000000
+        400000000000000
      values.FEE_RATE:
-        4
+        0
      values.MIN_WAIT_PERIOD_EXECUTE:
-        79200
+        39600
    }
```

```diff
    contract fraxFerryBridgeFraxtal (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE) {
    +++ description: None
      values.FEE_MAX:
-        "100000000000000000000"
+        "1000000000000000000"
      values.FEE_MIN:
-        "5000000000000000000"
+        "1000000000000000000"
      values.FEE_RATE:
-        10
+        0
      values.MIN_WAIT_PERIOD_EXECUTE:
-        79200
+        39600
    }
```

```diff
    contract fpisFerryBridgeFraxtal (0x958815f476cD07354c0BC034EE5077B20fD93003) {
    +++ description: None
      values.FEE_MAX:
-        "100000000000000000000"
+        "1000000000000000000"
      values.FEE_MIN:
-        "5000000000000000000"
+        "1000000000000000000"
      values.FEE_RATE:
-        10
+        0
      values.MIN_WAIT_PERIOD_EXECUTE:
-        79200
+        39600
    }
```

Generated with discovered.json: 0x26a1cf6926ad6177aed37b5d7137c132e16081a7

# Diff at Sun, 14 Apr 2024 15:51:18 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@c88e9917cce55305c9e770ab2f0db5a43854522c block: 19609246
- current block number: 19654781

## Description

### Fee change on Fraxtal FPI bridge

The fees of the FPI bridge to / from Fraxtal are lowered. The 0.1% fee is removed and the flat fee is reduced to 1 token (FPI). Other fraxferry bridges and (inlcuding other FPI bridges) have their fees unchanged.

## Watched changes

```diff
    contract fpiFerryBridgeFraxtal (0x9A576A3d39c589A861B46864C253288bcA428a6c) {
    +++ description: None
      values.FEE_MAX:
-        "100000000000000000000"
+        "1000000000000000000"
      values.FEE_MIN:
-        "5000000000000000000"
+        "1000000000000000000"
      values.FEE_RATE:
-        10
+        0
      values.MIN_WAIT_PERIOD_EXECUTE:
-        79200
+        39600
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19609246 (main branch discovery), not current.

```diff
    contract sfraxFerryBridgeArbitrum (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47) {
    +++ description: None
      name:
-        "sfraxFerryBridgeArbitrum"
+        "sfraxFerryBridgeFraxtal"
    }
```

```diff
    contract fxsFerryBridgeArbitrum (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6) {
    +++ description: None
      name:
-        "fxsFerryBridgeArbitrum"
+        "fxsFerryBridgeFraxtal"
    }
```

```diff
    contract sfrxFerryBridgeArbitrum (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3) {
    +++ description: None
      name:
-        "sfrxFerryBridgeArbitrum"
+        "sfrxFerryBridgeFraxtal"
    }
```

```diff
    contract fraxFerryBridgeArbitrum (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE) {
    +++ description: None
      name:
-        "fraxFerryBridgeArbitrum"
+        "fraxFerryBridgeFraxtal"
    }
```

```diff
    contract fpisFerryBridgeArbitrum (0x958815f476cD07354c0BC034EE5077B20fD93003) {
    +++ description: None
      name:
-        "fpisFerryBridgeArbitrum"
+        "fpisFerryBridgeFraxtal"
    }
```

```diff
    contract fpiFerryBridgeArbitrum (0x9A576A3d39c589A861B46864C253288bcA428a6c) {
    +++ description: None
      name:
-        "fpiFerryBridgeArbitrum"
+        "fpiFerryBridgeFraxtal"
    }
```

Generated with discovered.json: 0xf59b292e8d18dbff6b5fb428a682d89a9b877a6b

# Diff at Mon, 08 Apr 2024 06:44:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ad88f63bb61619b31763ca9524dff8964cdc75f3 block: 19589377
- current block number: 19609246

## Description

No change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19589377 (main branch discovery), not current.

```diff
    contract FPI Multisig (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract Frax Finance Multisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x60380fb9853345495e1cc4a3837502812ae1cb38

# Diff at Fri, 05 Apr 2024 11:56:30 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@6e27442909c4cbe26f03c6413f64274ff68aa0d7 block: 19517283
- current block number: 19589377

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract FPI Multisig (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      values.getOwners.3:
-        "0x05FB8eC3C41da95b26fCb85503DaF8B89B89A935"
+        "0xc8dE9f45601DA8C76158b8CAF3E56E8A037F2228"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19517283 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FeeToSetter (0x18e433c7Bf8A2E1d0197CE5d8f9AFAda1A771360)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0x1a9C8182C09F50C8318d769245beA52c32BE35BC)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FRAXOracleWrapper (0x2A6ddD9401B14d0443d0738B8a78fd5B99829A80)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FRAXShares (0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UniswapPairOracle_USDT_WETH (0x3B11DA52030420c663d263Ad4415a8A02E5f8cf8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UniswapV2Factory (0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FPI (0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f)
    +++ description: None
```

```diff
    contract GnosisSafe (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "FPI Multisig"
      values.nonce:
-        487
    }
```

```diff
-   Status: DELETED
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x831822660572bd54ebaa065C2acef662a6277D40)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FRAXStablecoin (0x853d955aCEf822Db058eb8505911ED77F175b99e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StakedFrax (0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32)
    +++ description: None
```

```diff
-   Status: DELETED
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F)
    +++ description: None
```

```diff
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27) {
    +++ description: None
      name:
-        "TimelockMultisig"
+        "Frax Finance Multisig"
      values.nonce:
-        5402
    }
```

```diff
-   Status: DELETED
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FPIS (0xc2544A32872A91F4A553b404C6950e89De901fdb)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FeeTo (0xDAF819c2437a82f9e01f6586207ebF961a7f0970)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UniswapV2Pair (0xecBa967D84fCF0405F6b32Bc45F4d36BfDBB2E81)
    +++ description: None
```

Generated with discovered.json: 0x17dbf8ac6c5be3253cb51ce71ca590a06ddd5fd6

# Diff at Tue, 26 Mar 2024 08:00:03 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19517283

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeToSetter (0x18e433c7Bf8A2E1d0197CE5d8f9AFAda1A771360)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x1a9C8182C09F50C8318d769245beA52c32BE35BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAXOracleWrapper (0x2A6ddD9401B14d0443d0738B8a78fd5B99829A80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfraxFerryBridgeArbitrum (0x2b4864c2F2A2C275C6C66B90a2ae6BE9fA9cbE47)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAXShares (0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapPairOracle_USDT_WETH (0x3B11DA52030420c663d263Ad4415a8A02E5f8cf8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract fxsFerryBridgeArbitrum (0x4A6d155df9Ec9A1BB3639e6B7B99E46Fb68D42f6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxFerryBridgeArbitrum (0x5c5f05cF8528FFe925A2264743bFfEdbAB2b0FE3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapV2Factory (0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPI (0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract fraxFerryBridgeArbitrum (0x5e1D94021484642863Ea8E7Cb4F0188e56B18FEE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETH (0x5E8422345238F34275888049021821E8E08CAa1f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6A7efa964Cf6D9Ab3BC3c47eBdDB853A8853C502)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETHMultisig (0x8306300ffd616049FD7e4b0354a64Da835c1A81C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x831822660572bd54ebaa065C2acef662a6277D40)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x8412ebf45bAC1B340BbE8F318b928C466c4E39CA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FRAXStablecoin (0x853d955aCEf822Db058eb8505911ED77F175b99e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract fpisFerryBridgeArbitrum (0x958815f476cD07354c0BC034EE5077B20fD93003)
    +++ description: None
```

```diff
+   Status: CREATED
    contract fpiFerryBridgeArbitrum (0x9A576A3d39c589A861B46864C253288bcA428a6c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakedFrax (0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract sfrxETH (0xac3E018457B222d93114458476f3E3416Abbe38F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockMultisig (0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27)
    +++ description: None
```

```diff
+   Status: CREATED
    contract frxETHMinter (0xbAFA44EFE7901E04E39Dad13167D089C559c1138)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FPIS (0xc2544A32872A91F4A553b404C6950e89De901fdb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FeeTo (0xDAF819c2437a82f9e01f6586207ebF961a7f0970)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UniswapV2Pair (0xecBa967D84fCF0405F6b32Bc45F4d36BfDBB2E81)
    +++ description: None
```
