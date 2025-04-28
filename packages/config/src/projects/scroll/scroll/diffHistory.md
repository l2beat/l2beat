Generated with discovered.json: 0x0bf810e890cea47314800a73e2ab605157621057

# Diff at Mon, 28 Apr 2025 10:36:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 14489756
- current block number: 14489756

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14489756 (main branch discovery), not current.

```diff
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"}]}]
    }
```

```diff
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
    }
```

```diff
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
    }
```

```diff
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
    }
```

```diff
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"}]}]
    }
```

```diff
    contract L2GatewayRouter (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
    }
```

Generated with discovered.json: 0x7516b67414bc24c4dcff6339a2858a557766be03

# Diff at Sun, 06 Apr 2025 08:18:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02dea11f7707601873600e275c4e2b7792c1a190 block: 14332194
- current block number: 14489756

## Description

shhh.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14332194 (main branch discovery), not current.

```diff
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b) {
    +++ description: None
      values.clock:
-        14332194
    }
```

Generated with discovered.json: 0xf5f216ef4926d63c56829cc82f50e434797bdda6

# Diff at Mon, 31 Mar 2025 13:32:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 14332194

## Description

L2 side first discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2MessageQueue (0x5300000000000000000000000000000000000000)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollStandardERC20Factory (0x66e5312EDeEAef6e80759A0F789e7914Fb401484)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0x69C2eD64171bF5737c2B78bdF722e68a032B2825)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0x9479ABfebefEea3c846163012a472b44F305b3d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SafeL2 (0xC3eA7C657884BB380B66D79C36aDCb5658b01896)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollStandardERC20 (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProposalTypesConfigurator (0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E)
    +++ description: None
```
