Generated with discovered.json: 0x9b36c271cfd6a020df8e88b2d9ad59a584a8a454

# Diff at Thu, 31 Jul 2025 10:55:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1753093859
- current timestamp: 1753093859

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753093859 (main branch discovery), not current.

```diff
    contract TimelockSCEmergencyScroll (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      name:
-        "TimelockSCEmergency"
+        "TimelockSCEmergencyScroll"
    }
```

Generated with discovered.json: 0x16f3ff55675a5fbde37e84d4506b3ff4ff786461

# Diff at Mon, 14 Jul 2025 12:47:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 17024223
- current block number: 17024223

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17024223 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000001) {
    +++ description: None
      address:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
    }
```

```diff
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4) {
    +++ description: Contract of the USDC token on Scroll.
      address:
-        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
+        "scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b"
+        "scr:0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b"
      values.admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.blacklister:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
      values.implementation:
-        "0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b"
+        "scr:0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b"
      values.masterMinter:
-        "0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE"
+        "scr:0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.pauser:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
      values.rescuer:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4:
-        "FiatTokenProxy"
      implementationNames.0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b:
-        "FiatTokenV2_1"
      implementationNames.scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4:
+        "FiatTokenProxy"
      implementationNames.scr:0x72e2451a2da1535DBf0E7CB1e8C69F56E00A7B7b:
+        "FiatTokenV2_1"
    }
```

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      address:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "scr:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
    }
```

```diff
    EOA  (0x0f50874f227621Dea72482004639a9fFe440A4dA) {
    +++ description: None
      address:
-        "0x0f50874f227621Dea72482004639a9fFe440A4dA"
+        "scr:0x0f50874f227621Dea72482004639a9fFe440A4dA"
    }
```

```diff
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F) {
    +++ description: None
      address:
-        "0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
+        "scr:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
+        "scr:0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
      values.$members.1:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "scr:0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
      values.$members.2:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "scr:0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
      values.$members.3:
-        "0x6626593C237f530D15aE9980A95ef938Ac15c35c"
+        "scr:0x6626593C237f530D15aE9980A95ef938Ac15c35c"
      values.$members.4:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "scr:0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
      values.$members.5:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "scr:0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
      values.$members.6:
-        "0x9106372987a14400F283bc1AfC122A57130c18a3"
+        "scr:0x9106372987a14400F283bc1AfC122A57130c18a3"
      values.$members.7:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "scr:0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
      values.$members.8:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "scr:0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
      values.$members.9:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "scr:0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
      values.$members.10:
-        "0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
+        "scr:0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
      values.$members.11:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "scr:0x32E8B0B9783d65170fd37f79079d5707107cCc62"
      implementationNames.0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.scr:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F:
+        "GnosisSafeProxy"
      implementationNames.scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      address:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.accessControl.roles.DEFAULT_ADMIN_ROLE.members.0:
-        "0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      values.accessControl.roles.SECURITY_COUNCIL_NO_DELAY_ROLE.members.0:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      values.accessControl.roles.emergency-nodelay.members.0:
-        "0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      values.accessControl.roles.ops-fast.members.0:
-        "0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      values.accessControl.targets.0xA76acF000C890b0DD7AEEf57627d9899F955d026:
-        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81:
-        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.0x5300000000000000000000000000000000000003:
-        {"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]}
      values.accessControl.targets.0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC:
-        {"setPause(bool)":["emergency-nodelay"]}
      values.accessControl.targets.0x33B60d5Dd260d453cAC3782b0bDC01ce84672142:
-        {"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]}
      values.accessControl.targets.0x5300000000000000000000000000000000000002:
-        {"setOverhead(uint256)":["ops-fast"],"setCommitScalar(uint256)":["ops-fast"],"setBlobScalar(uint256)":["ops-fast"]}
      values.accessControl.targets.0x5300000000000000000000000000000000000005:
-        {"updateMinWithdrawAmount(uint256)":["ops-fast"],"updateRecipient(address)":["ops-fast"]}
      values.accessControl.targets.0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79:
-        {"setERC20Gateway(address[],address[])":["ops-fast"]}
      values.accessControl.targets.0x64CCBE37c9A82D85A1F2E74649b7A42923067988:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0x7bC08E1c04fb41d75F1410363F0c5746Eae80582:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc:
-        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4:
-        {"transferOwnership(address)":["ops-fast"]}
      values.accessControl.targets.0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE:
-        {"transferOwnership(address)":["ops-fast"]}
      values.accessControl.targets.0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC:
-        {"withdrawFailedAmount(address,address)":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}
      values.accessControl.targets.scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026:
+        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81:
+        {"upgrade(address,address)":["SECURITY_COUNCIL_NO_DELAY_ROLE"],"upgradeAndCall(address,address,bytes)":["SECURITY_COUNCIL_NO_DELAY_ROLE"]}
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000003:
+        {"updateWhitelistStatus(address[],bool)":["emergency-nodelay"]}
      values.accessControl.targets.scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC:
+        {"setPause(bool)":["emergency-nodelay"]}
      values.accessControl.targets.scr:0x33B60d5Dd260d453cAC3782b0bDC01ce84672142:
+        {"pauseDeposit(bool)":["emergency-nodelay"],"pauseWithdraw(bool)":["emergency-nodelay"],"updateCircleCaller(address)":["ops-fast"]}
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000002:
+        {"setOverhead(uint256)":["ops-fast"],"setCommitScalar(uint256)":["ops-fast"],"setBlobScalar(uint256)":["ops-fast"]}
      values.accessControl.targets.scr:0x5300000000000000000000000000000000000005:
+        {"updateMinWithdrawAmount(uint256)":["ops-fast"],"updateRecipient(address)":["ops-fast"]}
      values.accessControl.targets.scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79:
+        {"setERC20Gateway(address[],address[])":["ops-fast"]}
      values.accessControl.targets.scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc:
+        {"updateTokenMapping(address,address)":["ops-fast"]}
      values.accessControl.targets.scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4:
+        {"transferOwnership(address)":["ops-fast"]}
      values.accessControl.targets.scr:0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE:
+        {"transferOwnership(address)":["ops-fast"]}
      values.accessControl.targets.scr:0xa1a12158bE6269D7580C63eC5E609Cdc0ddD82bC:
+        {"withdrawFailedAmount(address,address)":["ops-fast"],"grantRole(bytes32,address)":["ops-fast"],"revokeRole(bytes32,address)":["ops-fast"]}
      values.scNoDelay.0:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      implementationNames.0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B:
-        "ScrollOwner"
      implementationNames.scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B:
+        "ScrollOwner"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      address:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x0f50874f227621Dea72482004639a9fFe440A4dA"
+        "scr:0x0f50874f227621Dea72482004639a9fFe440A4dA"
      values.$members.1:
-        "0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
+        "scr:0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
      values.$members.2:
-        "0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
+        "scr:0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
      values.$members.3:
-        "0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
+        "scr:0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
      values.$members.4:
-        "0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
+        "scr:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
      values.$members.5:
-        "0x30315233090F675520eef5CBd7A6cf7d185af443"
+        "scr:0x30315233090F675520eef5CBd7A6cf7d185af443"
      values.$members.6:
-        "0x9479ABfebefEea3c846163012a472b44F305b3d7"
+        "scr:0x9479ABfebefEea3c846163012a472b44F305b3d7"
      values.$members.7:
-        "0x383C148ba96956F985F6141B2D119add1C34e3B7"
+        "scr:0x383C148ba96956F985F6141B2D119add1C34e3B7"
      values.$members.8:
-        "0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
+        "scr:0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
      values.$members.9:
-        "0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
+        "scr:0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
      values.$members.10:
-        "0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
+        "scr:0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F"
      values.$members.11:
-        "0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
+        "scr:0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
      implementationNames.0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50) {
    +++ description: None
      address:
-        "0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50"
+        "scr:0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50"
    }
```

```diff
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.Canceller.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.Proposer.0:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.timelockAdminAC.0:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      values.timelockAdminAC.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      implementationNames.0x1f807E2E8ab2e61230a0A9C271F90242831278b4:
-        "TimelockController"
      implementationNames.scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4:
+        "TimelockController"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      address:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "scr:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.1:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "scr:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.$members.2:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "scr:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
      values.$members.3:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "scr:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
      implementationNames.0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f:
+        "GnosisSafeProxy"
      implementationNames.scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf) {
    +++ description: None
      address:
-        "0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
+        "scr:0x218C720079833e0e40a3cc68CD5fA2f89D65d0bf"
    }
```

```diff
    EOA  (0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B) {
    +++ description: None
      address:
-        "0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
+        "scr:0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      address:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "scr:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
    }
```

```diff
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.Canceller.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.Proposer.0:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.timelockAdminAC.0:
-        "0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      values.timelockAdminAC.1:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      implementationNames.0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376:
-        "TimelockController"
      implementationNames.scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376:
+        "TimelockController"
    }
```

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      address:
-        "0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
+        "scr:0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
      values.$implementation:
-        "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
+        "scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E"
      values.$members.0:
-        "0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
+        "scr:0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
      values.$members.1:
-        "0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50"
+        "scr:0x1Da431d2D5ECA4Df735F69fB5ea10c8E630b8f50"
      values.$members.2:
-        "0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
+        "scr:0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
      implementationNames.0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351:
-        "GnosisSafeProxy"
      implementationNames.0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
-        "GnosisSafeL2"
      implementationNames.scr:0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351:
+        "GnosisSafeProxy"
      implementationNames.scr:0x3E5c63644E683549055b9Be8653de26E0B4CD36E:
+        "GnosisSafeL2"
    }
```

```diff
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0) {
    +++ description: Used to propose and manage onchain governance proposals.
      address:
-        "0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
      values.$admin:
-        "0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
+        "scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
      values.$implementation:
-        "0xd74aD535faE370Ec0762ECe045EeB8970Be378F7"
+        "scr:0xd74aD535faE370Ec0762ECe045EeB8970Be378F7"
      values.$pastUpgrades.0.2.0:
-        "0x4dCEC34886014C1a2E1Ca742B5Bd7B9952B7f4A2"
+        "scr:0x4dCEC34886014C1a2E1Ca742B5Bd7B9952B7f4A2"
      values.$pastUpgrades.1.2.0:
-        "0xd74aD535faE370Ec0762ECe045EeB8970Be378F7"
+        "scr:0xd74aD535faE370Ec0762ECe045EeB8970Be378F7"
      values.admin:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      values.manager:
-        "0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
+        "scr:0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351"
      values.PROPOSAL_TYPES_CONFIGURATOR:
-        "0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E"
+        "scr:0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E"
      values.timelock:
-        "0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      values.token:
-        "0xd29687c813D741E2F938F4aC377128810E217b1b"
+        "scr:0xd29687c813D741E2F938F4aC377128810E217b1b"
      implementationNames.0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0:
-        "TransparentUpgradeableProxy"
      implementationNames.0xd74aD535faE370Ec0762ECe045EeB8970Be378F7:
-        "AgoraGovernor"
      implementationNames.scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0xd74aD535faE370Ec0762ECe045EeB8970Be378F7:
+        "AgoraGovernor"
    }
```

```diff
    EOA  (0x30315233090F675520eef5CBd7A6cf7d185af443) {
    +++ description: None
      address:
-        "0x30315233090F675520eef5CBd7A6cf7d185af443"
+        "scr:0x30315233090F675520eef5CBd7A6cf7d185af443"
    }
```

```diff
    EOA  (0x32E8B0B9783d65170fd37f79079d5707107cCc62) {
    +++ description: None
      address:
-        "0x32E8B0B9783d65170fd37f79079d5707107cCc62"
+        "scr:0x32E8B0B9783d65170fd37f79079d5707107cCc62"
    }
```

```diff
    EOA  (0x383C148ba96956F985F6141B2D119add1C34e3B7) {
    +++ description: None
      address:
-        "0x383C148ba96956F985F6141B2D119add1C34e3B7"
+        "scr:0x383C148ba96956F985F6141B2D119add1C34e3B7"
    }
```

```diff
    EOA  (0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD) {
    +++ description: None
      address:
-        "0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
+        "scr:0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
    }
```

```diff
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79) {
    +++ description: Counterpart to the L1GatewayRouter contract.
      address:
-        "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763"
+        "scr:0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763"
      values.$pastUpgrades.0.2.0:
-        "0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763"
+        "scr:0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763"
      values.defaultERC20Gateway:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
      values.ethGateway:
-        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79:
-        "TransparentUpgradeableProxy"
      implementationNames.0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763:
-        "L2GatewayRouter"
      implementationNames.scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x3808d0F2F25839E73e0Fbf711368fC4aE80c7763:
+        "L2GatewayRouter"
    }
```

```diff
    contract L2MessageQueue (0x5300000000000000000000000000000000000000) {
    +++ description: Used to append messages to the L2MessageQueue from the L2ScrollMessenger.
      address:
-        "0x5300000000000000000000000000000000000000"
+        "scr:0x5300000000000000000000000000000000000000"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0x5300000000000000000000000000000000000000:
-        "L2MessageQueue"
      implementationNames.scr:0x5300000000000000000000000000000000000000:
+        "L2MessageQueue"
    }
```

```diff
    EOA cts-Zellic (0x5a09A94eE8198D3c474d723337aa58023810022C) {
    +++ description: None
      address:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "scr:0x5a09A94eE8198D3c474d723337aa58023810022C"
    }
```

```diff
    contract L2ERC1155Gateway (0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc) {
    +++ description: Counterpart to the L1ERC1155Gateway contract.
      address:
-        "0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
+        "scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94"
+        "scr:0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94"
      values.$pastUpgrades.0.2.0:
-        "0x4a1b3D103801F0E1400046aE1948B9808e9b043b"
+        "scr:0x4a1b3D103801F0E1400046aE1948B9808e9b043b"
      values.$pastUpgrades.1.2.0:
-        "0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94"
+        "scr:0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc:
-        "TransparentUpgradeableProxy"
      implementationNames.0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94:
-        "L2ERC1155Gateway"
      implementationNames.scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0xAc92E88bAc1848A5FeEA5cf5A60e0abc3bD5Df94:
+        "L2ERC1155Gateway"
    }
```

```diff
    contract L2CustomERC20Gateway (0x64CCBE37c9A82D85A1F2E74649b7A42923067988) {
    +++ description: Counterpart to the L1CustomERC20Gateway contract.
      address:
-        "0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
+        "scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x1D40306EEfCF6EBd496d6048F6edf8892346e558"
+        "scr:0x1D40306EEfCF6EBd496d6048F6edf8892346e558"
      values.$pastUpgrades.0.2.0:
-        "0xc568B5dcCeBE52073Fa783EAdacDE0a30fA4c2c9"
+        "scr:0xc568B5dcCeBE52073Fa783EAdacDE0a30fA4c2c9"
      values.$pastUpgrades.1.2.0:
-        "0x1D40306EEfCF6EBd496d6048F6edf8892346e558"
+        "scr:0x1D40306EEfCF6EBd496d6048F6edf8892346e558"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      implementationNames.0x64CCBE37c9A82D85A1F2E74649b7A42923067988:
-        "TransparentUpgradeableProxy"
      implementationNames.0x1D40306EEfCF6EBd496d6048F6edf8892346e558:
-        "L2CustomERC20Gateway"
      implementationNames.scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x1D40306EEfCF6EBd496d6048F6edf8892346e558:
+        "L2CustomERC20Gateway"
    }
```

```diff
    EOA  (0x6626593C237f530D15aE9980A95ef938Ac15c35c) {
    +++ description: None
      address:
-        "0x6626593C237f530D15aE9980A95ef938Ac15c35c"
+        "scr:0x6626593C237f530D15aE9980A95ef938Ac15c35c"
    }
```

```diff
    contract ScrollStandardERC20Factory (0x66e5312EDeEAef6e80759A0F789e7914Fb401484) {
    +++ description: Contract used to deploy ScrollStandardERC20 tokens for L2StandardERC20Gateway.
      address:
-        "0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
+        "scr:0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
      values.implementation:
-        "0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
+        "scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
      values.owner:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
      implementationNames.0x66e5312EDeEAef6e80759A0F789e7914Fb401484:
-        "ScrollStandardERC20Factory"
      implementationNames.scr:0x66e5312EDeEAef6e80759A0F789e7914Fb401484:
+        "ScrollStandardERC20Factory"
    }
```

```diff
    EOA  (0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3) {
    +++ description: None
      address:
-        "0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
+        "scr:0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
    }
```

```diff
    contract SafeL2 (0x69C2eD64171bF5737c2B78bdF722e68a032B2825) {
    +++ description: None
      address:
-        "0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
+        "scr:0x69C2eD64171bF5737c2B78bdF722e68a032B2825"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0xc8B6bF89877337188Ea84eA93547687225389553"
+        "scr:0xc8B6bF89877337188Ea84eA93547687225389553"
      values.$members.1:
-        "0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
+        "scr:0x498C0c17e26EEEC63375A4A20Ba8A91Aa357CbcD"
      values.$members.2:
-        "0x5a09A94eE8198D3c474d723337aa58023810022C"
+        "scr:0x5a09A94eE8198D3c474d723337aa58023810022C"
      implementationNames.0x69C2eD64171bF5737c2B78bdF722e68a032B2825:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0x69C2eD64171bF5737c2B78bdF722e68a032B2825:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0) {
    +++ description: Contract of the L2ScrollMessenger contract.
      address:
-        "0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x191770c52309dff2c52FfEcf059ECC3862f5D721"
+        "scr:0x191770c52309dff2c52FfEcf059ECC3862f5D721"
      values.$pastUpgrades.0.2.0:
-        "0xE0a0509a66C509f55c85A20EB8c60676135081f7"
+        "scr:0xE0a0509a66C509f55c85A20EB8c60676135081f7"
      values.$pastUpgrades.1.2.0:
-        "0x191770c52309dff2c52FfEcf059ECC3862f5D721"
+        "scr:0x191770c52309dff2c52FfEcf059ECC3862f5D721"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      implementationNames.0x6EA73e05AdC79974B931123675ea8F78FfdacDF0:
-        "TransparentUpgradeableProxy"
      implementationNames.0x191770c52309dff2c52FfEcf059ECC3862f5D721:
-        "L2ETHGateway"
      implementationNames.scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x191770c52309dff2c52FfEcf059ECC3862f5D721:
+        "L2ETHGateway"
    }
```

```diff
    EOA  (0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed) {
    +++ description: None
      address:
-        "0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
+        "scr:0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
    }
```

```diff
    EOA  (0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d) {
    +++ description: None
      address:
-        "0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
+        "scr:0x70DFdAE47E29D2C40EE58Cefa7379588B421a86d"
    }
```

```diff
    EOA  (0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d) {
    +++ description: None
      address:
-        "0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
+        "scr:0x7742637569CE1dd9AA9F4F91EaAc7c028C5e1f4d"
    }
```

```diff
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC) {
    +++ description: ETH is pre-minted to this contract in the genesis block and released on Scroll whenever corresponding deposits are made on Ethereum.
      address:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772"
+        "scr:0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772"
      values.$pastUpgrades.0.2.0:
-        "0x485149079c421f9e4c465276BbaBB2fE0748d138"
+        "scr:0x485149079c421f9e4c465276BbaBB2fE0748d138"
      values.$pastUpgrades.1.2.0:
-        "0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772"
+        "scr:0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772"
      values.feeVault:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.messageQueue:
-        "0x5300000000000000000000000000000000000000"
+        "scr:0x5300000000000000000000000000000000000000"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.xDomainMessageSender:
-        "0x0000000000000000000000000000000000000001"
+        "scr:0x0000000000000000000000000000000000000001"
      implementationNames.0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772:
-        "L2ScrollMessenger"
      implementationNames.scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x6fa66EeD8e8086f4c77204B5484D26F4e9AB7772:
+        "L2ScrollMessenger"
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      address:
-        "0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      values.timelockAdminAC.0:
-        "0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      values.timelockAdminAC.1:
-        "0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
+        "scr:0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD"
      implementationNames.0x79D83D1518e2eAA64cdc0631df01b06e2762CC14:
-        "TimelockController"
      implementationNames.scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14:
+        "TimelockController"
    }
```

```diff
    contract L2ERC721Gateway (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582) {
    +++ description: Counterpart to the L1ERC721Gateway contract.
      address:
-        "0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
+        "scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x0894150DB82B912105F6D0907B5c69E72F1Df279"
+        "scr:0x0894150DB82B912105F6D0907B5c69E72F1Df279"
      values.$pastUpgrades.0.2.0:
-        "0x71d7F43617CEaE99A43B7727151267A9919288F6"
+        "scr:0x71d7F43617CEaE99A43B7727151267A9919288F6"
      values.$pastUpgrades.1.2.0:
-        "0x0894150DB82B912105F6D0907B5c69E72F1Df279"
+        "scr:0x0894150DB82B912105F6D0907B5c69E72F1Df279"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0x7bC08E1c04fb41d75F1410363F0c5746Eae80582:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0894150DB82B912105F6D0907B5c69E72F1Df279:
-        "L2ERC721Gateway"
      implementationNames.scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x0894150DB82B912105F6D0907B5c69E72F1Df279:
+        "L2ERC721Gateway"
    }
```

```diff
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81) {
    +++ description: None
      address:
-        "0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
+        "scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81:
-        "ProxyAdmin"
      implementationNames.scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae) {
    +++ description: None
      address:
-        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
+        "scr:0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
    }
```

```diff
    EOA  (0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424) {
    +++ description: None
      address:
-        "0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
+        "scr:0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
    }
```

```diff
    contract SafeL2 (0x8edC4EADEE120d4C51923c515e7C3241c815C2BC) {
    +++ description: None
      address:
-        "0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
+        "scr:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
+        "scr:0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
      values.$members.1:
-        "0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
+        "scr:0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
      values.$members.2:
-        "0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
+        "scr:0x6F166508d423169A3C7cb3e7856Ba4bf9Fb2cCed"
      implementationNames.0x8edC4EADEE120d4C51923c515e7C3241c815C2BC:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0x8edC4EADEE120d4C51923c515e7C3241c815C2BC:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x9106372987a14400F283bc1AfC122A57130c18a3) {
    +++ description: None
      address:
-        "0x9106372987a14400F283bc1AfC122A57130c18a3"
+        "scr:0x9106372987a14400F283bc1AfC122A57130c18a3"
    }
```

```diff
    EOA  (0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a) {
    +++ description: None
      address:
-        "0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
+        "scr:0x93738D2aD25678BAE4F467FFad2c5a4C4c79658a"
    }
```

```diff
    contract SafeL2 (0x9479ABfebefEea3c846163012a472b44F305b3d7) {
    +++ description: None
      address:
-        "0x9479ABfebefEea3c846163012a472b44F305b3d7"
+        "scr:0x9479ABfebefEea3c846163012a472b44F305b3d7"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
+        "scr:0x8BBf9D47752fED1437Bb0EC7Ac4A2fAc2164F424"
      values.$members.1:
-        "0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
+        "scr:0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
      implementationNames.0x9479ABfebefEea3c846163012a472b44F305b3d7:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0x9479ABfebefEea3c846163012a472b44F305b3d7:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4) {
    +++ description: None
      address:
-        "0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
+        "scr:0x9B2C2Bc80C209c9C5D7f26F57b1Bb3B1699281D4"
    }
```

```diff
    EOA  (0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1) {
    +++ description: None
      address:
-        "0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
+        "scr:0xA0895eF86B766aFd455Fdb129A830A1C6CE054A1"
    }
```

```diff
    EOA  (0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD) {
    +++ description: None
      address:
-        "0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
+        "scr:0xa28b7D23e9F8D8d5346A7901ecC9eC8ea48bAEcD"
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      address:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0xA76acF000C890b0DD7AEEf57627d9899F955d026:
-        "ProxyAdmin"
      implementationNames.scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026:
+        "ProxyAdmin"
    }
```

```diff
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      address:
-        "0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.Canceller.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+++ description: Executing proposals is only open to all addresses if this resolves to the 0x0 address
+++ severity: HIGH
      values.Executor.0:
-        "0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      values.Proposer.0:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.timelockAdminAC.0:
-        "0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      values.timelockAdminAC.1:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      implementationNames.0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f:
-        "TimelockController"
      implementationNames.scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f:
+        "TimelockController"
    }
```

```diff
    EOA  (0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32) {
    +++ description: None
      address:
-        "0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
+        "scr:0xaFb4c32eCb8e4a86363a2fb2Fa27982fbd21ac32"
    }
```

```diff
    EOA  (0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7) {
    +++ description: None
      address:
-        "0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
+        "scr:0xb01474b50382fAe1A847E3A916ECDf07Ba57BcC7"
    }
```

```diff
    EOA  (0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d) {
    +++ description: None
      address:
-        "0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
+        "scr:0xb3dd2CA3F575FCDd79F5Cd45c5a6c9db860F3E4d"
    }
```

```diff
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE) {
    +++ description:  Contract that uses controllers to manage minters for USDC on Scroll.
      address:
-        "0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE"
+        "scr:0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE"
      values.getMinterManager:
-        "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
+        "scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE:
-        "MasterMinter"
      implementationNames.scr:0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE:
+        "MasterMinter"
    }
```

```diff
    EOA  (0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3) {
    +++ description: None
      address:
-        "0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
+        "scr:0xbB2491beFBd46CF26F7e9B9Dec16E0c31f9c5ae3"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      address:
-        "0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
+        "scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
+        "scr:0x0c5cc5155b346453154059aD9d2Ff695dB92f774"
      values.$members.1:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "scr:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.2:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "scr:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
      values.$members.3:
-        "0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
+        "scr:0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5"
      implementationNames.0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.scr:0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc:
+        "GnosisSafeProxy"
      implementationNames.scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xc1985e3712b33a5303e097e9CeD22E91338ba64d) {
    +++ description: None
      address:
-        "0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
+        "scr:0xc1985e3712b33a5303e097e9CeD22E91338ba64d"
    }
```

```diff
    contract SafeL2 (0xC3eA7C657884BB380B66D79C36aDCb5658b01896) {
    +++ description: None
      address:
-        "0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
+        "scr:0xC3eA7C657884BB380B66D79C36aDCb5658b01896"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
+        "scr:0x68bA95fb5108CFFd9608e8d9d54320acC531Ebe3"
      implementationNames.0xC3eA7C657884BB380B66D79C36aDCb5658b01896:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.scr:0xC3eA7C657884BB380B66D79C36aDCb5658b01896:
+        "SafeProxy"
      implementationNames.scr:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    contract ScrollStandardERC20 (0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69) {
    +++ description: Contract of the ERC20 standard token used by the ERC20 factory.
      address:
-        "0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
+        "scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
      values.counterpart:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      values.eip712Domain.verifyingContract:
-        "0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
+        "scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69"
      values.gateway:
-        "0x0000000000000000000000000000000000000000"
+        "scr:0x0000000000000000000000000000000000000000"
      implementationNames.0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69:
-        "ScrollStandardERC20"
      implementationNames.scr:0xC7d86908ccf644Db7C69437D5852CedBC1aD3f69:
+        "ScrollStandardERC20"
    }
```

```diff
    EOA  (0xc8B6bF89877337188Ea84eA93547687225389553) {
    +++ description: None
      address:
-        "0xc8B6bF89877337188Ea84eA93547687225389553"
+        "scr:0xc8B6bF89877337188Ea84eA93547687225389553"
    }
```

```diff
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b) {
    +++ description: None
      address:
-        "0xd29687c813D741E2F938F4aC377128810E217b1b"
+        "scr:0xd29687c813D741E2F938F4aC377128810E217b1b"
      values.$admin:
-        "0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
+        "scr:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
      values.$implementation:
-        "0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8"
+        "scr:0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8"
      values.$pastUpgrades.0.2.0:
-        "0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8"
+        "scr:0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8"
      values.eip712Domain.verifyingContract:
-        "0xd29687c813D741E2F938F4aC377128810E217b1b"
+        "scr:0xd29687c813D741E2F938F4aC377128810E217b1b"
      implementationNames.0xd29687c813D741E2F938F4aC377128810E217b1b:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8:
-        "L2GovToken"
      implementationNames.scr:0xd29687c813D741E2F938F4aC377128810E217b1b:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x7600174E2a730a05da046fFA8Fc32DEC27FfdDC8:
+        "L2GovToken"
    }
```

```diff
    EOA  (0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f) {
    +++ description: None
      address:
-        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
+        "scr:0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
    }
```

```diff
    EOA  (0xd5A0f3DfCe7128B7119462F7aC912616bB05b593) {
    +++ description: None
      address:
-        "0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
+        "scr:0xd5A0f3DfCe7128B7119462F7aC912616bB05b593"
    }
```

```diff
    EOA  (0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC) {
    +++ description: None
      address:
-        "0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
+        "scr:0xDD659911EcBD4458db07Ee7cDdeC79bf8F859AbC"
    }
```

```diff
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e) {
    +++ description: None
      address:
-        "0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
+        "scr:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      implementationNames.0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e:
-        "ProxyAdmin"
      implementationNames.scr:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e:
+        "ProxyAdmin"
    }
```

```diff
    contract L2GatewayRouter (0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A) {
    +++ description: Contract used to withdraw ERC20 tokens on L2 and finalize deposit the tokens from L1.
      address:
-        "0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
      values.$admin:
-        "0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      values.$implementation:
-        "0x3ffe801a43D25d0288683237A848e14f73a226f0"
+        "scr:0x3ffe801a43D25d0288683237A848e14f73a226f0"
      values.$pastUpgrades.0.2.0:
-        "0xCaa86d504B7670f4BCe0B323c2AaF7002CF6C478"
+        "scr:0xCaa86d504B7670f4BCe0B323c2AaF7002CF6C478"
      values.$pastUpgrades.1.2.0:
-        "0x3ffe801a43D25d0288683237A848e14f73a226f0"
+        "scr:0x3ffe801a43D25d0288683237A848e14f73a226f0"
      values.messenger:
-        "0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      values.owner:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      values.router:
-        "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      values.tokenFactory:
-        "0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
+        "scr:0x66e5312EDeEAef6e80759A0F789e7914Fb401484"
      implementationNames.0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A:
-        "TransparentUpgradeableProxy"
      implementationNames.0x3ffe801a43D25d0288683237A848e14f73a226f0:
-        "L2StandardERC20Gateway"
      implementationNames.scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A:
+        "TransparentUpgradeableProxy"
      implementationNames.scr:0x3ffe801a43D25d0288683237A848e14f73a226f0:
+        "L2StandardERC20Gateway"
    }
```

```diff
    EOA  (0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a) {
    +++ description: None
      address:
-        "0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
+        "scr:0xE47D966E2c7e94fC20ffAf5119d1926381C40f2a"
    }
```

```diff
    EOA  (0xe515cD19E8a67BF367a1d20dA6f21035913a2897) {
    +++ description: None
      address:
-        "0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
+        "scr:0xe515cD19E8a67BF367a1d20dA6f21035913a2897"
    }
```

```diff
    EOA  (0xEbbeeAA424AE904508465a41c927Be594C43Dc68) {
    +++ description: None
      address:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "scr:0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      address:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "scr:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      address:
-        "0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
+        "scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
+        "scr:0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
      values.$members.1:
-        "0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
+        "scr:0x8460aCc9A42D2CF07015a3e838df2E3aB37d30ae"
      values.$members.2:
-        "0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
+        "scr:0xEbbeeAA424AE904508465a41c927Be594C43Dc68"
      values.$members.3:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "scr:0xfc31892C5500AbE00974280b28907BaA9190E384"
      values.$members.4:
-        "0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
+        "scr:0xd33b8405635fE0Bd91aD1483778Bc5c053D8177f"
      implementationNames.0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.scr:0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe:
+        "GnosisSafeProxy"
      implementationNames.scr:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf) {
    +++ description: None
      address:
-        "0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
+        "scr:0xFb77d22ED83F42922F9542e39dCfA9F8C47FDaFf"
    }
```

```diff
    EOA  (0xfc31892C5500AbE00974280b28907BaA9190E384) {
    +++ description: None
      address:
-        "0xfc31892C5500AbE00974280b28907BaA9190E384"
+        "scr:0xfc31892C5500AbE00974280b28907BaA9190E384"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      address:
-        "0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
+        "scr:0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402"
    }
```

```diff
    contract ProposalTypesConfigurator (0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E) {
    +++ description: None
      address:
-        "0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E"
+        "scr:0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E"
      values.governor:
-        "0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
      implementationNames.0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E:
-        "ProposalTypesConfigurator"
      implementationNames.scr:0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E:
+        "ProposalTypesConfigurator"
    }
```

```diff
+   Status: CREATED
    contract Scroll USDC (0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4)
    +++ description: Contract of the USDC token on Scroll.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x11cd09a0c5B1dc674615783b0772a9bFD53e3A8F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B)
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
```

```diff
+   Status: CREATED
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD)
    +++ description: None
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
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AgoraGovernor (0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0)
    +++ description: Used to propose and manage onchain governance proposals.
```

```diff
+   Status: CREATED
    contract L2GatewayRouter (0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79)
    +++ description: Counterpart to the L1GatewayRouter contract.
```

```diff
+   Status: CREATED
    contract L2MessageQueue (0x5300000000000000000000000000000000000000)
    +++ description: Used to append messages to the L2MessageQueue from the L2ScrollMessenger.
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
    contract ScrollStandardERC20Factory (0x66e5312EDeEAef6e80759A0F789e7914Fb401484)
    +++ description: Contract used to deploy ScrollStandardERC20 tokens for L2StandardERC20Gateway.
```

```diff
+   Status: CREATED
    contract SafeL2 (0x69C2eD64171bF5737c2B78bdF722e68a032B2825)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ETHGateway (0x6EA73e05AdC79974B931123675ea8F78FfdacDF0)
    +++ description: Contract of the L2ScrollMessenger contract.
```

```diff
+   Status: CREATED
    contract L2ScrollMessenger (0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC)
    +++ description: ETH is pre-minted to this contract in the genesis block and released on Scroll whenever corresponding deposits are made on Ethereum.
```

```diff
+   Status: CREATED
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC721Gateway (0x7bC08E1c04fb41d75F1410363F0c5746Eae80582)
    +++ description: Counterpart to the L1ERC721Gateway contract.
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
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f)
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
```

```diff
+   Status: CREATED
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE)
    +++ description:  Contract that uses controllers to manage minters for USDC on Scroll.
```

```diff
+   Status: CREATED
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc)
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
    +++ description: Contract of the ERC20 standard token used by the ERC20 factory.
```

```diff
+   Status: CREATED
    contract SCRToken (0xd29687c813D741E2F938F4aC377128810E217b1b)
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
    +++ description: Contract used to withdraw ERC20 tokens on L2 and finalize deposit the tokens from L1.
```

```diff
+   Status: CREATED
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProposalTypesConfigurator (0xfDa7cF1D9C51b3fab41E2e4093374DD8715D640E)
    +++ description: None
```

Generated with discovered.json: 0xe99e662f1a9426135c00d8b359caa3a8a6d59191

# Diff at Mon, 07 Jul 2025 08:22:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 16562505
- current block number: 17024223

## Description

single MS member change.

## Watched changes

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      values.$members.2:
-        "0x108493124adf60F401E051e6A05043d8967bff6f"
+        "0x226A1669cd60A43e53030fD0A482Ea566d3Dba8B"
    }
```

Generated with discovered.json: 0xf4f826135f93fbbd6f3b7d64313f8d14d841edce

# Diff at Fri, 04 Jul 2025 12:19:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 16562505
- current block number: 16562505

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16562505 (main branch discovery), not current.

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      directlyReceivedPermissions.0.from:
-        "scroll:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
+        "scr:0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81"
      directlyReceivedPermissions.1.from:
-        "scroll:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
+        "scr:0xA76acF000C890b0DD7AEEf57627d9899F955d026"
      directlyReceivedPermissions.2.from:
-        "scroll:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
+        "scr:0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.0.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.2.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      receivedPermissions.3.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.4.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.5.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.6.via.0.address:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.6.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.7.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.8.via.0.address:
-        "scroll:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      receivedPermissions.8.from:
-        "scroll:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
      directlyReceivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      directlyReceivedPermissions.1.from:
-        "scroll:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
    }
```

```diff
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      directlyReceivedPermissions.1.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      directlyReceivedPermissions.2.from:
-        "scroll:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "scr:0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      directlyReceivedPermissions.3.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      directlyReceivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      directlyReceivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
    }
```

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      receivedPermissions.0.from:
-        "scroll:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
+        "scr:0x79D83D1518e2eAA64cdc0631df01b06e2762CC14"
      directlyReceivedPermissions.1.from:
-        "scroll:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
    }
```

```diff
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
+        "scr:0x2f3F2054776bd3C2fc30d750734A8F539Bb214f0"
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
+        "scr:0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
      directlyReceivedPermissions.1.from:
-        "scroll:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
+        "scr:0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79"
      directlyReceivedPermissions.2.from:
-        "scroll:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
+        "scr:0x62597Cc19703aF10B58feF87B0d5D29eFE263bcc"
      directlyReceivedPermissions.3.from:
-        "scroll:0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
+        "scr:0x64CCBE37c9A82D85A1F2E74649b7A42923067988"
      directlyReceivedPermissions.4.from:
-        "scroll:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
+        "scr:0x6EA73e05AdC79974B931123675ea8F78FfdacDF0"
      directlyReceivedPermissions.5.from:
-        "scroll:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
+        "scr:0x781e90f1c8Fc4611c9b7497C3B47F99Ef6969CbC"
      directlyReceivedPermissions.6.from:
-        "scroll:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
+        "scr:0x7bC08E1c04fb41d75F1410363F0c5746Eae80582"
      directlyReceivedPermissions.7.from:
-        "scroll:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
+        "scr:0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A"
    }
```

```diff
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      receivedPermissions.0.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      receivedPermissions.1.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      receivedPermissions.2.via.0.address:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      receivedPermissions.3.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
      directlyReceivedPermissions.0.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "scroll:0xd29687c813D741E2F938F4aC377128810E217b1b"
+        "scr:0xd29687c813D741E2F938F4aC377128810E217b1b"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      receivedPermissions.0.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.3.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      directlyReceivedPermissions.0.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.0.from:
-        "scroll:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "scr:0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      receivedPermissions.1.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.1.from:
-        "scroll:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
+        "scr:0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376"
      receivedPermissions.2.via.0.address:
-        "scroll:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
+        "scr:0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f"
      receivedPermissions.2.from:
-        "scroll:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
+        "scr:0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f"
    }
```

Generated with discovered.json: 0x0a63033544bee2b06983e6bfb49938e9e1b33a85

# Diff at Thu, 03 Jul 2025 10:57:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 16562505
- current block number: 16562505

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16562505 (main branch discovery), not current.

```diff
    contract MasterMinter (0xb5cE5F2277CFc547F48aA8263838FAEd424ae4BE) {
    +++ description:  Contract that uses controllers to manage minters for USDC on Scroll.
      description:
-        "Manager contract for minter management [sic]."
+        " Contract that uses controllers to manage minters for USDC on Scroll."
    }
```

Generated with discovered.json: 0x9a2440616c0b425220ba85fc9629d3b03f3a6cd7

# Diff at Wed, 18 Jun 2025 12:03:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 15984224
- current block number: 16562505

## Description

Signer change in team MS.

## Watched changes

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      values.$members.4:
-        "0xFCf6364F5157901f533DD3615A5d8c375F13c072"
+        "0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B"
    }
```

Generated with discovered.json: 0x2587b57b5429717f2c763848ed3afacacbf988c4

# Diff at Fri, 23 May 2025 09:41:19 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 15285599
- current block number: 15285599

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15285599 (main branch discovery), not current.

```diff
    EOA  (0x0c5cc5155b346453154059aD9d2Ff695dB92f774) {
    +++ description: None
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract ScrollOwner (0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B) {
    +++ description: Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.
      directlyReceivedPermissions.2.role:
+        ".owner"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract Scroll Security Council (0x1a37bF1Ccbf570C92FE2239FefaaAF861c2924DD) {
    +++ description: None
      receivedPermissions.8.role:
+        ".timelock"
      receivedPermissions.7.role:
+        ".scNoDelay"
      receivedPermissions.6.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "execute transactions that are ready."
      receivedPermissions.6.via:
-        [{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]
      receivedPermissions.6.role:
+        ".Executor"
      receivedPermissions.5.role:
+        ".scNoDelay"
      receivedPermissions.4.role:
+        ".scNoDelay"
      receivedPermissions.3.description:
-        "execute transactions that are ready."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.3.role:
+        ".timelockAdminAC"
      receivedPermissions.3.via:
+        [{"address":"0x1f807E2E8ab2e61230a0A9C271F90242831278b4"}]
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.1.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    contract TimelockSCEmergency (0x1f807E2E8ab2e61230a0A9C271F90242831278b4) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.3.role:
+        ".scNoDelay"
      directlyReceivedPermissions.2.from:
-        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
+        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
      directlyReceivedPermissions.2.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "disable enforced batch mode."
      directlyReceivedPermissions.2.role:
+        ".scNoDelay"
      directlyReceivedPermissions.1.description:
-        "disable enforced batch mode."
+        "upgrade all core contracts of the system."
      directlyReceivedPermissions.1.role:
+        ".scNoDelay"
      directlyReceivedPermissions.0.from:
-        "0x13D24a7Ff6F5ec5ff0e9C40Fc3B8C9c01c65437B"
+        "0x1f807E2E8ab2e61230a0A9C271F90242831278b4"
      directlyReceivedPermissions.0.description:
-        "upgrade all core contracts of the system."
+        "update the minimum delay and manage all access control roles of the timelock."
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract Scroll Multisig 1 (0x1FF1fc1BB4d1f081f6E0a7E7E3240F3ECC5B236f) {
    +++ description: None
      directlyReceivedPermissions.2.role:
+        ".Executor"
      directlyReceivedPermissions.1.role:
+        ".Executor"
      directlyReceivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    EOA  (0x26eceC198AdC0be598311bAe8EDfd4eEa47A56c5) {
    +++ description: None
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract TimelockFast (0x2b14d0E4b042d11C7e3Fc653132a2c82EFa7d376) {
    +++ description: A timelock with access control. The current minimum delay is 1d. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract GnosisSafeL2 (0x2B2A8546Df3B23535fffd75B4e312f3C5c7B4351) {
    +++ description: None
      receivedPermissions.0.role:
+        ".manager"
    }
```

```diff
    contract TimelockSCSlow (0x79D83D1518e2eAA64cdc0631df01b06e2762CC14) {
    +++ description: None
      directlyReceivedPermissions.1.role:
+        ".timelock"
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract ProxyAdmin (0x82e58e20Da6ecF4B07649C9B2237FAf27f02bC81) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ProxyAdmin (0xA76acF000C890b0DD7AEEf57627d9899F955d026) {
    +++ description: None
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract TimelockEmergency (0xA77D19C1F2B06C9aeA9bE88C17B771a33892734f) {
    +++ description: A timelock with access control. The current minimum delay is 0s. Proposals that passed their minimum delay can be executed by the anyone.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

```diff
    contract Scroll Multisig 2 (0xbdA143d49da40C2cDA27c40edfBbe8A0D4AE0cBc) {
    +++ description: None
      receivedPermissions.3.role:
+        ".timelockAdminAC"
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    contract ProxyAdmin (0xde4972789EA56c4e7ac7Ba655EaFe73a30155F1e) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0xEe9bb388d320F4305af6a4a1a70c862D3F4d0D5B) {
    +++ description: None
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

```diff
    contract Scroll Multisig 3 (0xEfc9D1096fb65c832207E5e7F13C2D1102244dbe) {
    +++ description: None
      receivedPermissions.3.role:
+        ".timelockAdminAC"
      receivedPermissions.2.role:
+        ".Proposer"
      receivedPermissions.1.description:
-        "update the minimum delay and manage all access control roles of the timelock."
+        "cancel queued transactions."
      receivedPermissions.1.role:
+        ".Canceller"
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "update the minimum delay and manage all access control roles of the timelock."
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".Proposer"
    }
```

```diff
    EOA  (0xFcf1f182FC79047d99e5db0d7113c0EfE2EC9402) {
    +++ description: None
      receivedPermissions.2.role:
+        ".Executor"
      receivedPermissions.1.role:
+        ".Executor"
      receivedPermissions.0.role:
+        ".Executor"
    }
```

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
