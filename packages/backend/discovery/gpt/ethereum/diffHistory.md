Generated with discovered.json: 0x80485d39579849709d6e2f4f62e475686f8d9ce9

# Diff at Tue, 01 Oct 2024 10:51:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20676773
- current block number: 20676773

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20676773 (main branch discovery), not current.

```diff
    contract GptProtocolDAC (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-06-19T11:51:11.000Z",["0xA36aFB6b79A3d164a3d12C141c916BECc6e012D8"]]]
    }
```

```diff
    contract GptProtocolValidium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-27T11:06:11.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

Generated with discovered.json: 0x6f161e5e223889737465ce1e4b0eb818906ad14f

# Diff at Wed, 04 Sep 2024 10:59:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20676773

## Description

Initial discovery: type 4 polygonCDK Validium with shared verifier and main contract implementation. Custom gas token (GPT), no TVL tracking yet due to shared bridge.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GptProtocolDAC (0x75E26A2996DEAbA20386B6f3c1C957eFadb3f6E8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0xada59D145126A746976F0F56477aafFEB3acc8e3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GptProtocolValidium (0xC4E903D3Af4c3d2e437492d602adcC9d9b536858)
    +++ description: None
```
