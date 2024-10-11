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
