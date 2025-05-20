Generated with discovered.json: 0x8e0b4a71f5e0ac4d1c50100ba97f9a142097dbcf

# Diff at Thu, 08 May 2025 09:56:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 15127262
- current block number: 15285599

## Description

ms member change.

## Watched changes

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      values.$members.8:
-        "0x4970e361f6168a301D1036348d625A8930B1AaB7"
+        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
      values.$members.7:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
      values.$members.6:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
      values.$members.5:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
      values.$members.4:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
      values.$members.3:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
      values.$members.2:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
      values.$members.1:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
      values.$members.0:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
    }
```

Generated with discovered.json: 0x0142a4def33340c1bbc47782e3aca5b7ef821318

# Diff at Thu, 01 May 2025 13:25:04 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@2b416a2682a6346947ff8f432469bc39157f1420 block: 15048934
- current block number: 15127262

## Description

Ignored USDC on Scroll total supply.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15048934 (main branch discovery), not current.

```diff
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4) {
    +++ description: Contract of the USDC token on Scroll.
      values.totalSupply:
-        19147318188126
    }
```

Generated with discovered.json: 0x57f3ecf012398c81fdab7be5e9e1f55625b3363b

# Diff at Tue, 29 Apr 2025 09:33:30 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 15048934
- current block number: 15048934

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15048934 (main branch discovery), not current.

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      issuedPermissions:
-        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"disable enforced batch mode.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"upgrade all core contracts of the system.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]}]
    }
```

```diff
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"propose transactions.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376","delay":86400}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

```diff
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: Used to propose and manage onchain governance proposals.
      issuedPermissions:
-        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"can configure contract settings such as voting delay, quorum, contract manager.","via":[{"address":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200}]},{"permission":"interact","to":"0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351","description":"can propose new onchain governance proposals without the required threshold of votes.","via":[]}]
    }
```

```diff
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      issuedPermissions:
-        [{"permission":"interact","to":"0x0c5cc5155b346453154059aD9d2Ff695dB92f774","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"propose transactions.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"update the minimum delay and manage all access control roles of the timelock.","via":[]},{"permission":"interact","to":"0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"}]},{"permission":"interact","to":"0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]},{"permission":"interact","to":"0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402","description":"execute transactions that are ready.","via":[{"address":"0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"}]}]
    }
```

Generated with discovered.json: 0x3b4f0a01e6d2764c7b4d9c2e95064ed9c372de23

# Diff at Mon, 28 Apr 2025 10:39:37 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@a68d2e28c8787c5d6b9533bafbaed67dd065d75c block: 14489756
- current block number: 15048934

## Description

Added new roles to the ScrollOwner contract and its timelock controllers.

## Watched changes

```diff
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4) {
    +++ description: Contract of the USDC token on Scroll.
      values.totalSupply:
-        18073085046087
+        19147318188126
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      values.$members.2:
-        "0xE2e6345baAD18f779167443Dc4886495507b3249"
+        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
      values.$members.1:
-        "0x9FB9ff268B89Fb22aDe61fbE1B938F5C72D3CC59"
+        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
      values.$threshold:
-        4
+        3
      values.multisigThreshold:
-        "4 of 5 (80%)"
+        "3 of 5 (60%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 14489756 (main branch discovery), not current.

```diff
    contract undefined (0x0f50874f227621Dea72482004639a9fFe440A4dA) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","via":[{"address":"0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"}]},{"permission":"upgrade","from":"0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]},{"permission":"upgrade","from":"0x6EA73e05AdC79974B931123675ea8F78FfdacDF0","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]},{"permission":"upgrade","from":"0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]},{"permission":"upgrade","from":"0xd29687c813D741E2F938F4aC377128810E217b1b","via":[{"address":"0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"}]},{"permission":"upgrade","from":"0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      values.accessControl:
+        {"roles":{"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"]},"SECURITY_COUNCIL_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x1f807E2E8ab2e61230a0A9C271F90242831278b4"]},"SCROLL_MULTISIG_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"EMERGENCY_MULTISIG_NO_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_1DAY_DELAY_TOLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_7DAY_DELAY_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"emergency-nodelay":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"]},"ops-fast":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"]}},"targets":{"0xA76acF000C890b0DD7AEEf57627d9899F955d026":{"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]},"0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81":{"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]},"0x5300000000000000000000000000000000000003":{"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]},"0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC":{"setPause(bool)":["emergency-nodelay"]},"0x33B60d5Dd260d453cAC3782b0bDC01ce84672142":{"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]},"0x5300000000000000000000000000000000000002":{"setOverhead(uint256)":["ops-fast"],"setCommitScalar(uint256)":["ops-fast"],"setBlobScalar(uint256)":["ops-fast"]},"0x5300000000000000000000000000000000000005":{"updateMinWithdrawAmount(uint256)":["ops-fast"],"updateRecipient(address)":["ops-fast"]},"0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79":{"setERC20Gateway(address[],address[])":["ops-fast"]},"0x64CCBE37c9A82D85A1F2E74649b7A42923067988":{"updateTokenMapping(address,address)":["ops-fast"]},"0x7bC08E1c04fb41d75F1410363F0c5746Eae80582":{"updateTokenMapping(address,address)":["ops-fast"]},"0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc":{"updateTokenMapping(address,address)":["ops-fast"]},"0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4":{"transferOwnership(address)":["ops-fast"]},"0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE":{"transferOwnership(address)":["ops-fast"]},"0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC":{"withdrawFailedAmount(address,address)":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}}}
      values.scNoDelay:
+        ["0x1f807E2E8ab2e61230a0A9C271F90242831278b4"]
      template:
+        "scroll/ScrollOwnerL2"
      description:
+        "Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role."
      issuedPermissions:
+        [{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"upgrade all core contracts of the system.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"disable enforced batch mode.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"cancel queued transactions."},{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"update the minimum delay and manage all access control roles of the timelock."},{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"propose transactions."},{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"execute transactions that are ready."},{"permission":"interact","from":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","description":"upgrade all core contracts of the system.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","from":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","description":"disable enforced batch mode.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4","description":"update the minimum delay and manage all access control roles of the timelock.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","from":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","description":"update ScrollChain zk proof verifier.","via":[{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]},{"permission":"interact","from":"0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","description":"can configure contract settings such as voting delay, quorum, contract manager.","via":[{"address":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"},{"permission":"act","from":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200}]
    }
```

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","description":"can propose new onchain governance proposals without the required threshold of votes."}]
    }
```

```diff
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: Used to propose and manage onchain governance proposals.
      issuedPermissions.1:
+        {"permission":"interact","to":"0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD","description":"can configure contract settings such as voting delay, quorum, contract manager.","via":[{"address":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
      issuedPermissions.0.via.0:
-        {"address":"0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"}
      issuedPermissions.0.description:
+        "can propose new onchain governance proposals without the required threshold of votes."
      description:
+        "Used to propose and manage onchain governance proposals."
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract undefined (0x30315233090F675520eef5CBd7A6cf7d185af443) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0x383C148ba96956F985F6141B2D119add1C34e3B7) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79) {
    +++ description: Counterpart to the L1GatewayRouter contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      description:
+        "Counterpart to the L1GatewayRouter contract."
    }
```

```diff
    contract L2MessageQueue (0x5300000000000000000000000000000000000000) {
    +++ description: Used to append messages to the L2MessageQueue from the L2ScrollMessenger.
      description:
+        "Used to append messages to the L2MessageQueue from the L2ScrollMessenger."
    }
```

```diff
    contract ScrollStandardERC20Factory (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    +++ description: Contract used to deploy ScrollStandardERC20 tokens for L2StandardERC20Gateway.
      description:
+        "Contract used to deploy ScrollStandardERC20 tokens for L2StandardERC20Gateway."
    }
```

```diff
-   Status: DELETED
    contract  (0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367)
    +++ description: None
```

```diff
    contract SafeL2 (0x69C2eD64171bF5737c2B78bdF722e68a032B2825) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: Contract of the L2ScrollMessenger contract.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      values.counterpart:
-        "0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
+        "eth:0x7F2b8C31F88B6006c382775eea88297Ec1e3E905"
      description:
+        "Contract of the L2ScrollMessenger contract."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"eth"}}]
    }
```

```diff
    contract undefined (0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: ETH is pre-minted to this contract in the genesis block and released on Scroll whenever corresponding deposits are made on Ethereum.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      values.counterpart:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      description:
+        "ETH is pre-minted to this contract in the genesis block and released on Scroll whenever corresponding deposits are made on Ethereum."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"eth"}}]
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      name:
-        "TimelockController"
+        "TimelockSCSlow"
      values.timelockAdminAC:
+        ["0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x79D83D1518e2eAA64cdc0631df01b06e2762CC14","delay":259200},{"permission":"interact","from":"0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0","description":"can configure contract settings such as voting delay, quorum, contract manager."}]
    }
```

```diff
-   Status: DELETED
    contract  (0x7F2b8C31F88B6006c382775eea88297Ec1e3E905)
    +++ description: None
```

```diff
    contract SafeL2 (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract SafeL2 (0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.7:
+        {"permission":"upgrade","from":"0x64CCBE37c9A82D85A1F2E74649b7A42923067988"}
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
    contract SafeL2 (0xC3eA7C657884BB380B66D79C36aDCb5658b01896) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ScrollStandardERC20 (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    +++ description: Contract of the ERC20 standard token used by the ERC20 factory.
      description:
+        "Contract of the ERC20 standard token used by the ERC20 factory."
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
-   Status: DELETED
    contract  (0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9)
    +++ description: None
```

```diff
    contract L2GatewayRouter (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: Contract used to withdraw ERC20 tokens on L2 and finalize deposit the tokens from L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B","via":[{"address":"0xA76acF000C890b0DD7AEEf57627d9899F955d026"}]}]
      values.counterpart:
-        "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
+        "eth:0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9"
      description:
+        "Contract used to withdraw ERC20 tokens on L2 and finalize deposit the tokens from L1."
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"eth"}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract undefined (0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract undefined (0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ProposalTypesConfigurator (0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E) {
    +++ description: None
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
+   Status: CREATED
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4)
    +++ description: Contract of the USDC token on Scroll.
```

```diff
+   Status: CREATED
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376)
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract L2ERC1155Gateway (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc)
    +++ description: Counterpart to the L1ERC1155Gateway contract.
```

```diff
+   Status: CREATED
    contract L2CustomERC20Gateway (0x64CCBE37c9A82D85A1F2E74649b7A42923067988)
    +++ description: Counterpart to the L1CustomERC20Gateway contract.
```

```diff
+   Status: CREATED
    contract L2ERC721Gateway (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582)
    +++ description: Counterpart to the L1ERC721Gateway contract.
```

```diff
+   Status: CREATED
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE)
    +++ description: Manager contract for minter management [sic].
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
