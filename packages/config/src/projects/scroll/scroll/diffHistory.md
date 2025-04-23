Generated with discovered.json: 0x00be3fd6098ff1897b440faf31d0dff6f8c90387

# Diff at Wed, 23 Apr 2025 12:43:32 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@883eec4b9450268891e59913a801e0da5ddff219 block: 14489756
- current block number: 14936183

## Description

Added new roles to the ScrollOwner contract and its timelock controllers.

## Watched changes

```diff
    contract FiatTokenV2_1 (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4) {
    +++ description: None
      values.totalSupply:
-        18073085046087
+        19094800279390
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14489756 (main branch discovery), not current.

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0x64CCBE37c9A82D85A1F2E74649b7A42923067988","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x7bC08E1c04fb41d75F1410363F0c5746Eae80582","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}
      receivedPermissions.5.from:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      receivedPermissions.4.from:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
      receivedPermissions.3.from:
-        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
      receivedPermissions.3.via.0.address:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
      receivedPermissions.2.from:
-        "0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      receivedPermissions.2.via.0.address:
-        "0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
+        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.accessControl:
+        {"roles":{"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"]},"SECURITY_COUNCIL_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x1f807E2E8ab2e61230a0A9C271F90242831278b4"]},"SCROLL_MULTISIG_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"EMERGENCY_MULTISIG_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_1DAY_DELAY_TOLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_7DAY_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"emergency-nodelay":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"]},"ops-fast":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"]}},"targets":{"0xA76acF000C890b0DD7AEEf57627d9899F955d026":{"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]},"0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81":{"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]},"0x5300000000000000000000000000000000000003":{"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]},"0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC":{"setPause(bool)":["emergency-nodelay"]},"0x33B60d5Dd260d453cAC3782b0bDC01ce84672142":{"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]},"0x5300000000000000000000000000000000000002":{"setOverhead(uint256)":["ops-fast"],"setCommitScalar(uint256)":["ops-fast"],"setBlobScalar(uint256)":["ops-fast"]},"0x5300000000000000000000000000000000000005":{"updateMinWithdrawAmount(uint256)":["ops-fast"],"updateRecipient(address)":["ops-fast"]},"0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79":{"setERC20Gateway(address[],address[])":["ops-fast"]},"0x64CCBE37c9A82D85A1F2E74649b7A42923067988":{"updateTokenMapping(address,address)":["ops-fast"]},"0x7bC08E1c04fb41d75F1410363F0c5746Eae80582":{"updateTokenMapping(address,address)":["ops-fast"]},"0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc":{"updateTokenMapping(address,address)":["ops-fast"]},"0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4":{"transferOwnership(address)":["ops-fast"]},"0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE":{"transferOwnership(address)":["ops-fast"]},"0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC":{"withdrawFailedAmount(address,address)":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}}}
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      name:
-        "TimelockController"
+        "TimelockSCSlow"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f","0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]}}
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"0x64CCBE37c9A82D85A1F2E74649b7A42923067988"}
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"}
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"}
      directlyReceivedPermissions.4:
+        {"permission":"upgrade","from":"0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"}
      directlyReceivedPermissions.3.from:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      directlyReceivedPermissions.2.from:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
      directlyReceivedPermissions.1.from:
-        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
    }
```

```diff
+   Status: CREATED
    contract FiatTokenV2_1 (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC1155Gateway (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x6260aF48e8948617b8FA17F4e5CEa2d21D21554B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2CustomERC20Gateway (0x64CCBE37c9A82D85A1F2E74649b7A42923067988)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC721Gateway (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2BatchBridgeGateway (0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xb2b10a289A229415a124EFDeF310C10cb004B6ff)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xb94f7F6ABcb811c5Ac709dE14E37590fcCd975B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe)
    +++ description: None
```

Generated with discovered.json: 0x03b847c424c07f740148152dd789cace71e817bd

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
