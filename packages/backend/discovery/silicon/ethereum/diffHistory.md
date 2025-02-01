Generated with discovered.json: 0xb14ae424f86bb39f0dba3f094679923b8974709c

# Diff at Mon, 20 Jan 2025 11:10:06 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628488
- current block number: 21628488

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628488 (main branch discovery), not current.

```diff
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
    }
```

```diff
    contract DACProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
      directlyReceivedPermissions.0.from:
+        "0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"
    }
```

Generated with discovered.json: 0x6423bc1c15bb92d059efe23e320a4cec0f2c1dd7

# Diff at Wed, 15 Jan 2025 07:48:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 20783770
- current block number: 21628488

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20783770 (main branch discovery), not current.

```diff
    contract DACProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x2b8632604e7d35a2da4a5e94f58b96b40b5c5c51

# Diff at Mon, 21 Oct 2024 11:10:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20783770
- current block number: 20783770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20783770 (main branch discovery), not current.

```diff
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"]
      values.$pastUpgrades.0.1:
-        ["0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"]
+        "0xee62b099c28e601917f60c0abff8441d48a2e7aee41711ff89a9ae0cc2fc647c"
    }
```

```diff
    contract SiliconValidium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
      values.$pastUpgrades.0.1:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
+        "0xc47c5c6b0ea1740437487c101b78895a761501a35bfa97a77d79e803151ccf41"
    }
```

Generated with discovered.json: 0xb1b4c87ab571797807e79aed98859f9e281950c7

# Diff at Mon, 14 Oct 2024 10:55:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20783770
- current block number: 20783770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20783770 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: None
      sourceHashes:
+        ["0x0bc67d276b40b2ba13903d94fd6c25ae4d3d5162bc942763c418afdc11bc9b32"]
    }
```

```diff
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3F74698A4ADb075c0501DF739745ACA55Ae543a1"
+        "0xef5D7af5dbBeE845860E75cE8f8e8fE7F6e8dBF7"
      issuedPermissions.0.via.0:
+        {"address":"0x3F74698A4ADb075c0501DF739745ACA55Ae543a1","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf7c38d00c4b6000f1840ed38f9ae99d753da8ac69ee1b6ac9ed614f2b60d470f"]
    }
```

```diff
    contract DACProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A"}]
    }
```

```diff
    contract SiliconValidium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0x354389dbc886521e157175c6f68986d5d3ec26d4

# Diff at Tue, 01 Oct 2024 10:55:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20783770
- current block number: 20783770

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20783770 (main branch discovery), not current.

```diff
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-08-21T16:55:59.000Z",["0xa2F7e6Dfd6f43976ee1E2e8A122984ECa8e38608"]]]
    }
```

```diff
    contract SiliconValidium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-08-20T19:52:11.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

Generated with discovered.json: 0x9487c18c1d17b81e0e06559883359d3be5b8dd21

# Diff at Thu, 19 Sep 2024 09:33:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20783770

## Description

Initial discovery of a standard type 4 PolygonCDK validium. LocalAdmin / Chain Owner is an EOA.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SiliconDAC (0x24e09Ef4F69B6058E047EE5E709B345F3cA47F3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0x3F74698A4ADb075c0501DF739745ACA55Ae543a1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SiliconValidium (0x419dcD0f72ebAFd3524b65a97ac96699C7fBebdB)
    +++ description: None
```
