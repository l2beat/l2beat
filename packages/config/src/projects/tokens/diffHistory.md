Generated with discovered.json: 0x3d824f2011aa3545a5832209ad30a1e5c17fa2da

# Diff at Tue, 28 Oct 2025 09:32:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@090e135db1084f4a9678d6bf1cb0ff5e854903ea block: 1759761526
- current timestamp: 1761643706

## Description

ignored some values in watchmode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759761526 (main branch discovery), not current.

```diff
    contract CSStrikes (eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f) {
    +++ description: None
      template:
+        "tokens/Lido/CSStrikes"
    }
```

Generated with discovered.json: 0xa580ce65af310668ee81ae6cd4bc2e630f58603d

# Diff at Mon, 06 Oct 2025 15:12:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e58bd9f0913161b35e2a2c65f233464591d4f28b block: 1758803109
- current timestamp: 1759761526

## Description

Lido- v3 upgrades (support for L1-triggerable withdrwawals)
- NodeOperatorsRegistry v4: https://disco.l2beat.com/diff/eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135/eth:0x6828b023e737f96B168aCd0b5c6351971a4F81aE
- ValidatorsExitBusOracle v2: https://disco.l2beat.com/diff/eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c/eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94
- CSFeeOravle v2: https://disco.l2beat.com/diff/eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E/eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97
- CSAccounting: https://disco.l2beat.com/diff/eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758/eth:0x6f09d2426c7405C5546413e6059F884D2D03f449
- AccountingOracle: https://disco.l2beat.com/diff/eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7/eth:0xE9906E543274cebcd335d2C560094089e9547e8d
- CSFeeDistributor: https://disco.l2beat.com/diff/eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0/eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1
- StakingRouter: https://disco.l2beat.com/diff/eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA/eth:0x226f9265CBC37231882b7409658C18bB7738173A
- CSModule: https://disco.l2beat.com/diff/eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B/eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665

## Watched changes

```diff
    contract ValidatorsExitBusOracle (eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      sourceHashes.1:
-        "0xba2e8ff1fb232454e73ee740f5c151763047d29a9c660b33be8926930334a768"
+        "0xe4c526720601a291e152819a6b6a28a60b7aa74dfc163dcdda0848713449d95d"
      values.$implementation:
-        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94"
      values.$pastUpgrades.2:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94"]]
      values.$upgradeCount:
-        2
+        3
      values.getConsensusVersion:
-        3
+        4
      values.getContractVersion:
-        1
+        2
      values.proxy__getImplementation:
-        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94"
      values.EXIT_REQUEST_LIMIT_MANAGER_ROLE:
+        "0x9c616dd118785b2e2fccf45a4ff151a335ff7b6a84cd1c4d7fd9f97f39ea9342"
      values.EXIT_TYPE:
+        2
      values.getExitRequestLimitFullInfo:
+        {"maxExitRequestsLimit":11200,"exitsPerFrame":1,"frameDurationInSec":48,"prevExitRequestsLimit":11200,"currentExitRequestsLimit":11200}
      values.getMaxValidatorsPerReport:
+        600
      values.SUBMIT_REPORT_HASH_ROLE:
+        "0x22ebb4dbafb72948800c1e1afa1688772a1a4cfc54d5ebfcec8163b1139c082e"
      implementationNames.eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c:
-        "ValidatorsExitBusOracle"
      implementationNames.eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94:
+        "ValidatorsExitBusOracle"
    }
```

```diff
-   Status: DELETED
    contract CSEarlyAdoption (eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E)
    +++ description: None
```

```diff
    contract Lido Dao Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      receivedPermissions.0:
+        {"permission":"upgrade","from":"eth:0x06cd61045f958A209a0f8D746e103eCc625f4193","role":"admin"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x9D28ad303C90DF524BA960d7a2DAC56DcC31e428","role":"admin"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f","role":"admin"}
    }
```

```diff
    contract CSFeeOracle (eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB) {
    +++ description: None
      sourceHashes.1:
-        "0xeac43c3fd7eae13460161196e3255017b4296896629f70133974d9e26bd2b742"
+        "0xe9044668de5a790902b6bfed112ac2d764965db11a13b730c985ceff09edff4d"
      values.$implementation:
-        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97"]]
      values.$upgradeCount:
-        1
+        2
      values.avgPerfLeewayBP:
-        500
      values.CONTRACT_MANAGER_ROLE:
-        "0x8135f02737a6b32709c1f229001b55183df0d6abcb3022e8bae091ad43fd9e6d"
      values.feeDistributor:
-        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getConsensusVersion:
-        2
+        3
      values.getContractVersion:
-        1
+        2
      values.proxy__getImplementation:
-        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97"
      values.FEE_DISTRIBUTOR:
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.STRIKES:
+        "eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f"
      implementationNames.eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E:
-        "CSFeeOracle"
      implementationNames.eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97:
+        "CSFeeOracle"
    }
```

```diff
    contract CSAccounting (eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      sourceHashes.1:
-        "0xc45cf7de845f22be0dadd18370faa3a228bdaa579f0c450f4459acbef0c91c05"
+        "0xa3793b129329502d6009f7a85359b308a4c6469ce911caf16b24083bdc712519"
      values.$implementation:
-        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x6f09d2426c7405C5546413e6059F884D2D03f449"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x6f09d2426c7405C5546413e6059F884D2D03f449"]]
      values.$upgradeCount:
-        1
+        2
      values.ACCOUNTING_MANAGER_ROLE:
-        "0x40579467dba486691cc62fd8536d22c6d4dc9cdc7bc716ef2518422aa554c098"
      values.CSM:
-        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      values.MAX_BOND_LOCK_RETENTION_PERIOD:
-        31536000
      values.MAX_CURVE_LENGTH:
-        10
+        100
      values.MIN_BOND_LOCK_RETENTION_PERIOD:
-        2419200
      values.proxy__getImplementation:
-        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x6f09d2426c7405C5546413e6059F884D2D03f449"
      values.RESET_BOND_CURVE_ROLE:
-        "0xb5dffea014b759c493d63b1edaceb942631d6468998125e1b4fe427c99082134"
      values.FEE_DISTRIBUTOR:
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getBondLockPeriod:
+        4838400
      values.getCurvesCount:
+        3
      values.getInitializedVersion:
+        2
      values.MAX_BOND_LOCK_PERIOD:
+        31536000
      values.MIN_BOND_LOCK_PERIOD:
+        2419200
      values.MODULE:
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      implementationNames.eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758:
-        "CSAccounting"
      implementationNames.eth:0x6f09d2426c7405C5546413e6059F884D2D03f449:
+        "CSAccounting"
    }
```

```diff
    contract NodeOperatorsRegistry (eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) {
    +++ description: None
      sourceHashes.1:
-        "0x3cbd0a87fa76b571f664c2e9d40dc8c24a1b88642270b2ebf0247128c866a937"
+        "0x7e3615bebdb8e2033c00916316355965e076187f136311105c57e4ab8eed8911"
      values.$implementation:
-        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x6828b023e737f96B168aCd0b5c6351971a4F81aE"
      values.getContractVersion:
-        3
+        4
      values.getStuckPenaltyDelay:
-        432000
+        0
      values.implementation:
-        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x6828b023e737f96B168aCd0b5c6351971a4F81aE"
      values.exitPenaltyCutoffTimestamp:
+        1759074767
      implementationNames.eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
-        "NodeOperatorsRegistry"
      implementationNames.eth:0x6828b023e737f96B168aCd0b5c6351971a4F81aE:
+        "NodeOperatorsRegistry"
    }
```

```diff
    contract AccountingOracle (eth:0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      sourceHashes.1:
-        "0x8eb8fe1367a0eb2d485632fc86c4e0eea79ee0a2dd3f72a2982a622b3c62f1ba"
+        "0x90b97d1cb45e9893fa400657a6d60368adbd83c194db38ea948219e3cab9fb7b"
      values.$implementation:
-        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0xE9906E543274cebcd335d2C560094089e9547e8d"
      values.$pastUpgrades.3:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0xE9906E543274cebcd335d2C560094089e9547e8d"]]
      values.$upgradeCount:
-        3
+        4
      values.getConsensusVersion:
-        3
+        4
      values.getContractVersion:
-        2
+        3
      values.proxy__getImplementation:
-        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0xE9906E543274cebcd335d2C560094089e9547e8d"
      implementationNames.eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7:
-        "AccountingOracle"
      implementationNames.eth:0xE9906E543274cebcd335d2C560094089e9547e8d:
+        "AccountingOracle"
    }
```

```diff
    contract NodeOperatorsRegistry (eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433) {
    +++ description: None
      sourceHashes.1:
-        "0x3cbd0a87fa76b571f664c2e9d40dc8c24a1b88642270b2ebf0247128c866a937"
+        "0x7e3615bebdb8e2033c00916316355965e076187f136311105c57e4ab8eed8911"
      values.$implementation:
-        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x6828b023e737f96B168aCd0b5c6351971a4F81aE"
      values.getContractVersion:
-        3
+        4
      values.getStuckPenaltyDelay:
-        432000
+        0
      values.implementation:
-        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x6828b023e737f96B168aCd0b5c6351971a4F81aE"
      values.exitPenaltyCutoffTimestamp:
+        1759074767
      implementationNames.eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
-        "NodeOperatorsRegistry"
      implementationNames.eth:0x6828b023e737f96B168aCd0b5c6351971a4F81aE:
+        "NodeOperatorsRegistry"
    }
```

```diff
    contract WithdrawalVault (eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      sourceHashes.1:
-        "0xfed378d959d7c0807be954e4650d7b087554f356d30c10c652058ea4ef14c0ca"
+        "0x02a7455341d351b5cf754695894d7496179272403e2b811db5202057c6373cad"
      values.$implementation:
-        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0x7D2BAa6094E1C4B60Da4cbAF4A77C3f4694fD53D"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x7D2BAa6094E1C4B60Da4cbAF4A77C3f4694fD53D"]]
      values.$upgradeCount:
-        1
+        2
      values.getContractVersion:
-        1
+        2
      values.implementation:
-        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0x7D2BAa6094E1C4B60Da4cbAF4A77C3f4694fD53D"
      values.getWithdrawalRequestFee:
+        1
      values.TRIGGERABLE_WITHDRAWALS_GATEWAY:
+        "eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B"
      values.WITHDRAWAL_REQUEST:
+        "eth:0x00000961Ef480Eb55e80D19ad83579A64c007002"
      implementationNames.eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd:
-        "WithdrawalVault"
      implementationNames.eth:0x7D2BAa6094E1C4B60Da4cbAF4A77C3f4694fD53D:
+        "WithdrawalVault"
    }
```

```diff
    contract LidoLocator (eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) {
    +++ description: None
      sourceHashes.1:
-        "0x69f924232e2916fff05aa3d4f0cbd7fd46005b8747ebacff3ac5e16761107735"
+        "0xd9bec8b380e332257d788916e194c7e66df309019cb2e5a19afa74e31d6a1890"
      values.$implementation:
-        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x2C298963FB763f74765829722a1ebe0784f4F5Cf"
      values.$pastUpgrades.8:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x2C298963FB763f74765829722a1ebe0784f4F5Cf"]]
      values.$upgradeCount:
-        8
+        9
      values.proxy__getImplementation:
-        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x2C298963FB763f74765829722a1ebe0784f4F5Cf"
      values.triggerableWithdrawalsGateway:
+        "eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B"
      values.validatorExitDelayVerifier:
+        "eth:0xbDb567672c867DB533119C2dcD4FB9d8b44EC82f"
      implementationNames.eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3:
-        "LidoLocator"
      implementationNames.eth:0x2C298963FB763f74765829722a1ebe0784f4F5Cf:
+        "LidoLocator"
    }
```

```diff
    contract CSFeeDistributor (eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      sourceHashes.1:
-        "0xd5604f959d89ec8d8a68b4679f1ac04a3e991d52f605de25f20be7f57a4e669b"
+        "0x881e365358bb714cd1d4c59279039f33010f934835d0bd8406443a9bb43c5b9f"
      values.$implementation:
-        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1"]]
      values.$upgradeCount:
-        1
+        2
      values.proxy__getImplementation:
-        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1"
      values.distributionDataHistoryCount:
+        0
      values.getInitializedVersion:
+        2
      values.rebateRecipient:
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0:
-        "CSFeeDistributor"
      implementationNames.eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1:
+        "CSFeeDistributor"
    }
```

```diff
    contract CSModule (eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      sourceHashes.1:
-        "0xf761c7555657701beab5f35f2637465a03482c146dd8566d2fe486a66b790f82"
+        "0xde753d771c3a4dc27e58e529b2dfd70871547d49e71ecd3478353ec02e995aa8"
      values.$implementation:
-        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665"]]
      values.$upgradeCount:
-        1
+        2
      values.earlyAdoption:
-        "eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
      values.EL_REWARDS_STEALING_FINE:
-        "100000000000000000"
      values.INITIAL_SLASHING_PENALTY:
-        "1000000000000000000"
      values.keyRemovalCharge:
-        0
      values.MAX_KEY_REMOVAL_CHARGE:
-        "100000000000000000"
      values.MAX_SIGNING_KEYS_PER_OPERATOR_BEFORE_PUBLIC_RELEASE:
-        12
      values.MODULE_MANAGER_ROLE:
-        "0x79dfcec784e591aafcf60db7db7b029a5c8b12aac4afd4e8c4eb740430405fa6"
      values.proxy__getImplementation:
-        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665"
      values.publicRelease:
-        true
      values.ACCOUNTING:
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      values.CREATE_NODE_OPERATOR_ROLE:
+        "0xc72a21b38830f4d6418a239e17db78b945cc7cfee674bac97fd596eaf0438478"
      values.DEPOSIT_SIZE:
+        "32000000000000000000"
      values.EXIT_PENALTIES:
+        "eth:0x06cd61045f958A209a0f8D746e103eCc625f4193"
      values.FEE_DISTRIBUTOR:
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getInitializedVersion:
+        2
      values.PARAMETERS_REGISTRY:
+        "eth:0x9D28ad303C90DF524BA960d7a2DAC56DcC31e428"
      values.QUEUE_LEGACY_PRIORITY:
+        4
      values.QUEUE_LOWEST_PRIORITY:
+        5
      implementationNames.eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B:
-        "CSModule"
      implementationNames.eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665:
+        "CSModule"
    }
```

```diff
    contract StakingRouter (eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      sourceHashes.1:
-        "0x503f0f420b9a496d2931807c8c9c7b3bae8e03c9d66fd0c046c0cee08657b365"
+        "0xfff62cfc156b3379b99f876fed184d721dcaa8f2c185eb5267d7f0609085e688"
      values.$implementation:
-        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x226f9265CBC37231882b7409658C18bB7738173A"
      values.$pastUpgrades.3:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x226f9265CBC37231882b7409658C18bB7738173A"]]
      values.$upgradeCount:
-        3
+        4
      values.getContractVersion:
-        2
+        3
      values.proxy__getImplementation:
-        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x226f9265CBC37231882b7409658C18bB7738173A"
      values.REPORT_VALIDATOR_EXIT_TRIGGERED_ROLE:
+        "0x0766e72e5c008b3df8129fb356d9176eef8544f6241e078b7d61aff604f8812b"
      values.REPORT_VALIDATOR_EXITING_STATUS_ROLE:
+        "0xbe1bd143a0dde8a867d58aab054bfdb25250951665c4570e39abc3b3de3c2d6c"
      implementationNames.eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA:
-        "StakingRouter"
      implementationNames.eth:0x226f9265CBC37231882b7409658C18bB7738173A:
+        "StakingRouter"
    }
```

```diff
    contract DepositSecurityModule (eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD) {
    +++ description: None
      values.getGuardians.2:
-        "eth:0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
+        "eth:0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
      values.getGuardians.5:
-        "eth:0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
+        "eth:0x6d22aE126eB2c37F67a1391B37FF4f2863e61389"
    }
```

```diff
+   Status: CREATED
    contract  (eth:0x00000961Ef480Eb55e80D19ad83579A64c007002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSExitPenalties (eth:0x06cd61045f958A209a0f8D746e103eCc625f4193)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSParametersRegistry (eth:0x9D28ad303C90DF524BA960d7a2DAC56DcC31e428)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSStrikes (eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorExitDelayVerifier (eth:0xbDb567672c867DB533119C2dcD4FB9d8b44EC82f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSEjector (eth:0xc72b58aa02E0e98cF8A4a0E9Dce75e763800802C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TriggerableWithdrawalsGateway (eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B)
    +++ description: None
```

## Source code changes

```diff
.../AccountingOracle/AccountingOracle.sol          |  102 +-
 .../CSAccounting/CSAccounting.sol                  | 2530 +++++++--------
 .../CSEarlyAdoption.sol => /dev/null               |  299 --
 .../src/projects/tokens/.flat/CSEjector.sol        | 1776 +++++++++++
 .../.flat/CSExitPenalties/CSExitPenalties.sol      | 1830 +++++++++++
 .../.flat/CSExitPenalties/OssifiableProxy.p.sol    |  619 ++++
 .../CSFeeDistributor/CSFeeDistributor.sol          |  377 ++-
 .../CSFeeOracle/CSFeeOracle.sol                    |  311 +-
 .../CSModule/CSModule.sol                          | 3001 ++++++++++--------
 .../CSParametersRegistry/CSParametersRegistry.sol  | 3348 ++++++++++++++++++++
 .../CSParametersRegistry/OssifiableProxy.p.sol     |  619 ++++
 .../projects/tokens/.flat/CSStrikes/CSStrikes.sol  | 1489 +++++++++
 .../tokens/.flat/CSStrikes/OssifiableProxy.p.sol   |  619 ++++
 .../LidoLocator/LidoLocator.sol                    |    6 +
 .../NodeOperatorsRegistry.sol                      |  504 ++-
 .../NodeOperatorsRegistry.sol                      |  504 ++-
 .../StakingRouter/StakingRouter.sol                |  253 +-
 .../tokens/.flat/TriggerableWithdrawalsGateway.sol | 1291 ++++++++
 .../tokens/.flat/ValidatorExitDelayVerifier.sol    |  667 ++++
 .../ValidatorsExitBusOracle.sol                    | 1121 +++++--
 .../WithdrawalVault/WithdrawalVault.sol            |  146 +-
 21 files changed, 17155 insertions(+), 4257 deletions(-)
```

Generated with discovered.json: 0x452b93407e604d63d147c7c6b2e6f1f89138f0d8

# Diff at Thu, 25 Sep 2025 12:26:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0baa1255a33ce1a02b431265f21e07fd28f2de49 block: 1758619454
- current timestamp: 1758803109

## Description

ms change.

## Watched changes

```diff
    contract SafeL2 (arb1:0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e) {
    +++ description: None
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 6 (33%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0xc06eba1ecdc676e37f47ecbc90e11756afc416ee

# Diff at Tue, 23 Sep 2025 09:25:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9a796f3fca0d6345ed73136526bf67003edbb829 block: 1758527427
- current timestamp: 1758619454

## Description

ms changes.

## Watched changes

```diff
    contract SafeL2 (base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) {
    +++ description: None
      values.$members.0:
+        "base:0x17aBc3F085fb4B7eAf5002785DE22867f964D273"
      values.$members.4:
-        "base:0x244df059d103347a054487Da7f8D42d52Cb29A55"
    }
```

```diff
    contract GnosisSafeL2 (base:0x92A19381444A001d62cE67BaFF066fA1111d7202) {
    +++ description: None
      values.$members.6:
-        "base:0x244df059d103347a054487Da7f8D42d52Cb29A55"
+        "base:0x17aBc3F085fb4B7eAf5002785DE22867f964D273"
    }
```

Generated with discovered.json: 0xd8ca3f0fd6307fe942b7b37c0210bb0636f9da59

# Diff at Mon, 22 Sep 2025 07:51:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3aa102df1ae0b60ff981cfe12b1d0c919b4c2704 block: 1755691670
- current timestamp: 1758527427

## Description

blacklister for USDC swapped.

## Watched changes

```diff
    contract USD Coin Token (base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
      values.blacklister:
-        "base:0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
+        "base:0x1f2e3A640175d20ac31ed523B6733B977173E277"
    }
```

Generated with discovered.json: 0xa89a357e0618d26a34840d542d8fcd13e06c0341

# Diff at Mon, 15 Sep 2025 10:45:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@42f2c01145ca4aa65fcdb5fd60aca707e3b4fd2c block: 1755691670
- current timestamp: 1755691670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755691670 (main branch discovery), not current.

```diff
    reference  (eth:0x59232aC80E6d403b6381393e52f4665ECA328558) {
    +++ description: None
      type:
-        "EOA"
+        "Reference"
      proxyType:
-        "EOA"
      targetType:
+        "EOA"
      targetProject:
+        "shared-sharp-verifier"
    }
```

```diff
    reference  (eth:0x955B978F3ee7818dA71fA25c676062E6BC462Fec) {
    +++ description: None
      type:
-        "EOA"
+        "Reference"
      proxyType:
-        "EOA"
      targetType:
+        "EOA"
      targetProject:
+        "shared-sharp-verifier"
    }
```

Generated with discovered.json: 0xce61b0d19b16d86f9a3f366456284766713fb26d

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xdff94927309d8cd2ed0225e235ffd234dff2ba35

# Diff at Mon, 25 Aug 2025 14:06:51 GMT:

- chain: base
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@5f43becd32095551439042bc6793b2fd16b8bdbe block: 1755691670
- current timestamp: 1755691670

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755691670 (main branch discovery), not current.

```diff
    contract Timelock (0xf817cb3092179083c48c014688D98B72fB61464f) {
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
      name:
-        "L1Timelock"
+        "Timelock"
    }
```

Generated with discovered.json: 0x39818d03c03b4a297f7eabe469fe9b7a93904687

# Diff at Wed, 20 Aug 2025 12:08:18 GMT:

- chain: arbitrum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@262b00e32d0a4e462cf5011a16f1fcaa9ed6d5a8 block: 1755018135
- current timestamp: 1755691670

## Description

Added 3 more signatures to Spiko permissions manager multisig.

## Watched changes

```diff
    contract SafeL2 (0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e) {
    +++ description: None
      values.$members.0:
+        "arb1:0x4D1d9C5B5d9Ca448194313D799De374f362Bd460"
      values.$members.1:
+        "arb1:0x6c00Be5d1013a5bca938EF6aa8F1E5e706FF384d"
      values.$members.2:
+        "arb1:0xDa47Bd72438F11bef7Cc54F18cd02426dd86A5a2"
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "2 of 6 (33%)"
    }
```

Generated with discovered.json: 0xceb37024b3b12be2a7a751268d2769624a3c50ed

# Diff at Tue, 12 Aug 2025 17:02:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1754307917
- current timestamp: 1755018135

## Description

new operators/admin for PAXG (EOAs).

## Watched changes

```diff
-   Status: DELETED
    contract SimpleMultiSig (0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713)
    +++ description: None
```

```diff
    contract Paxos Gold Token (0x45804880De22913dAFE09f4980848ECE6EcbAf78) {
    +++ description: None
      values.$admin:
-        "eth:0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
+        "eth:0xC94BcF6e1d8B3558E3B62e743630D50497E3851C"
      values.assetProtectionRole:
-        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x3Af3e85f4f97De7AD0f000B724Fb77fE5ffc024B"
      values.owner:
-        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x3Af3e85f4f97De7AD0f000B724Fb77fE5ffc024B"
    }
```

## Source code changes

```diff
.../dev/null                                       | 98 ----------------------
 1 file changed, 98 deletions(-)
```

Generated with discovered.json: 0x8f5e09a92137af2b71fa824a45c1f3da79371a3e

# Diff at Tue, 12 Aug 2025 17:02:31 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1754307917
- current timestamp: 1755018135

## Description

'Gateway' bridge deployed, minters added for that purpose.

The gateway bridge validates via EOA sigs and has separate contracts for outbound and inbound bridge transactions.

## Watched changes

```diff
    contract USD Coin Token (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.12:
+        "base:0x2222222d7164433c4C09B0b0D809a9b52C04C205"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.13:
+        "base:0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE"
    }
```

```diff
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202) {
    +++ description: None
      values.$members.1:
-        "base:0xab7C7E7ac51f70dd959f3541316dBd715773158B"
+        "base:0x397729229B3d824Ca1B93e6E25e7CB197973df33"
    }
```

```diff
+   Status: CREATED
    contract GatewayMinter (0x2222222d7164433c4C09B0b0D809a9b52C04C205)
    +++ description: Entrypoint or minter of USDC on this chain for the Gateway protocol.
```

```diff
+   Status: CREATED
    contract GatewayWallet (0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE)
    +++ description: Exit point or burner of USDC on this chain for the Gateway protocol.
```

## Source code changes

```diff
.../base/.flat/GatewayMinter/ERC1967Proxy.p.sol    |  522 ++
 .../base/.flat/GatewayMinter/GatewayMinter.sol     | 6189 ++++++++++++++++
 .../base/.flat/GatewayWallet/ERC1967Proxy.p.sol    |  522 ++
 .../base/.flat/GatewayWallet/GatewayWallet.sol     | 7521 ++++++++++++++++++++
 4 files changed, 14754 insertions(+)
```

Generated with discovered.json: 0xd346a9ffd8d7bc7471c7d7fb64ff88f2f0b10010

# Diff at Mon, 04 Aug 2025 11:45:48 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7cc919a780045cf2b13d42712da413a3bff12b3 block: 1753687577
- current timestamp: 1754307917

## Description

key removal charge waived.

## Watched changes

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      values.keyRemovalCharge:
-        "20000000000000000"
+        0
    }
```

Generated with discovered.json: 0x545d9264a8c606bccbd320805cc6deda4da0acf7

# Diff at Mon, 04 Aug 2025 11:45:47 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7cc919a780045cf2b13d42712da413a3bff12b3 block: 1753687577
- current timestamp: 1754307917

## Description

ms signer removed.

## Watched changes

```diff
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) {
    +++ description: None
      values.$members.3:
-        "base:0xab7C7E7ac51f70dd959f3541316dBd715773158B"
      values.multisigThreshold:
-        "2 of 9 (22%)"
+        "2 of 8 (25%)"
    }
```

Generated with discovered.json: 0x76fe12f3b1e3403318e47cdb3211fbc918cf9ef0

# Diff at Mon, 28 Jul 2025 07:26:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 22889418
- current block number: 23016120

## Description

ms member change.

## Watched changes

```diff
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4) {
    +++ description: None
      values.$members.0:
+        "eth:0x8e814672F5c559b15af2975fBf6Fab819A4B7Dd5"
      values.$members.1:
+        "eth:0x804d60CB1ade94511f7915A2062948685Ca8C81f"
      values.$members.0:
-        "eth:0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "eth:0xaDB26E60FA6e326B9Ee444D886B4B62EC7FA38fc"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "3 of 6 (50%)"
    }
```

Generated with discovered.json: 0x12d9be24eab87516c871dd4294902e4225109e0b

# Diff at Mon, 14 Jul 2025 12:46:38 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 356266883
- current block number: 356266883

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 356266883 (main branch discovery), not current.

```diff
    EOA  (0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949) {
    +++ description: None
      address:
-        "0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949"
+        "arb1:0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949"
    }
```

```diff
    contract SafeL2 (0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e) {
    +++ description: None
      address:
-        "0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e"
+        "arb1:0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "arb1:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0xe67D2cbeaE3090bE017C66e7A6943961619a5D35"
+        "arb1:0xe67D2cbeaE3090bE017C66e7A6943961619a5D35"
      values.$members.1:
-        "0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011"
+        "arb1:0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011"
      values.$members.2:
-        "0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949"
+        "arb1:0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949"
      implementationNames.0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.arb1:0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e:
+        "SafeProxy"
      implementationNames.arb1:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011) {
    +++ description: None
      address:
-        "0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011"
+        "arb1:0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011"
    }
```

```diff
    contract PermissionManager (0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A) {
    +++ description: None
      address:
-        "0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A"
+        "arb1:0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x344278aff344d6fb960705dc18a4912221608472"
+        "arb1:0x344278aff344d6fb960705dc18a4912221608472"
      values.$pastUpgrades.0.2.0:
-        "0x344278aff344d6fb960705dc18a4912221608472"
+        "arb1:0x344278aff344d6fb960705dc18a4912221608472"
+++ description: group 0 members are the full admins and can act via this contract. other groups are used as transfer whitelists for example.
      values.admins.0:
-        "0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e"
+        "arb1:0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e"
      implementationNames.0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A:
-        "ERC1967Proxy"
      implementationNames.0x344278aff344d6fb960705dc18a4912221608472:
-        "PermissionManager"
      implementationNames.arb1:0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A:
+        "ERC1967Proxy"
      implementationNames.arb1:0x344278aff344d6fb960705dc18a4912221608472:
+        "PermissionManager"
    }
```

```diff
    contract Spiko EU T-Bills Money Market Fund Token (0xCBeb19549054CC0a6257A77736FC78C367216cE7) {
    +++ description: None
      address:
-        "0xCBeb19549054CC0a6257A77736FC78C367216cE7"
+        "arb1:0xCBeb19549054CC0a6257A77736FC78C367216cE7"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80"
+        "arb1:0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80"
      values.$pastUpgrades.0.2.0:
-        "0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80"
+        "arb1:0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80"
      values.authority:
-        "0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A"
+        "arb1:0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A"
      values.eip712Domain.verifyingContract:
-        "0xCBeb19549054CC0a6257A77736FC78C367216cE7"
+        "arb1:0xCBeb19549054CC0a6257A77736FC78C367216cE7"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.trustedForwarder:
-        "0xd3f5f1524e1A472B51374A3ff41B8936EB5B658E"
+        "arb1:0xd3f5f1524e1A472B51374A3ff41B8936EB5B658E"
      implementationNames.0xCBeb19549054CC0a6257A77736FC78C367216cE7:
-        "ERC1967Proxy"
      implementationNames.0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80:
-        "Token"
      implementationNames.arb1:0xCBeb19549054CC0a6257A77736FC78C367216cE7:
+        "ERC1967Proxy"
      implementationNames.arb1:0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80:
+        "Token"
    }
```

```diff
    EOA  (0xe67D2cbeaE3090bE017C66e7A6943961619a5D35) {
    +++ description: None
      address:
-        "0xe67D2cbeaE3090bE017C66e7A6943961619a5D35"
+        "arb1:0xe67D2cbeaE3090bE017C66e7A6943961619a5D35"
    }
```

```diff
+   Status: CREATED
    contract SafeL2 (0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionManager (0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Spiko EU T-Bills Money Market Fund Token (0xCBeb19549054CC0a6257A77736FC78C367216cE7)
    +++ description: None
```

Generated with discovered.json: 0xc28ce96dc626654ed2956b59a46dc3739b478e1b

# Diff at Mon, 14 Jul 2025 12:46:38 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22889418
- current block number: 22889418

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22889418 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000001) {
    +++ description: None
      address:
-        "0x0000000000000000000000000000000000000001"
+        "eth:0x0000000000000000000000000000000000000001"
    }
```

```diff
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
    +++ description: Ethereum Beacon Chain deposit contract.
      address:
-        "0x00000000219ab540356cBB839Cbe05303d7705Fa"
+        "eth:0x00000000219ab540356cBB839Cbe05303d7705Fa"
      implementationNames.0x00000000219ab540356cBB839Cbe05303d7705Fa:
-        "DepositContract"
      implementationNames.eth:0x00000000219ab540356cBB839Cbe05303d7705Fa:
+        "DepositContract"
    }
```

```diff
    EOA  (0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5) {
    +++ description: None
      address:
-        "0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5"
+        "eth:0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5"
    }
```

```diff
    EOA  (0x01781c80785a679337De8c3df691cd5D15D36A6b) {
    +++ description: None
      address:
-        "0x01781c80785a679337De8c3df691cd5D15D36A6b"
+        "eth:0x01781c80785a679337De8c3df691cd5D15D36A6b"
    }
```

```diff
    EOA  (0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c) {
    +++ description: None
      address:
-        "0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
+        "eth:0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
    }
```

```diff
    EOA  (0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6) {
    +++ description: None
      address:
-        "0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6"
+        "eth:0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6"
    }
```

```diff
    contract SimpleMultiSig (0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33) {
    +++ description: None
      address:
-        "0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
      values.$members.0:
-        "0x01781c80785a679337De8c3df691cd5D15D36A6b"
+        "eth:0x01781c80785a679337De8c3df691cd5D15D36A6b"
      values.$members.1:
-        "0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d"
+        "eth:0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d"
      values.$members.2:
-        "0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27"
+        "eth:0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27"
      values.$members.3:
-        "0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9"
+        "eth:0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9"
      values.$members.4:
-        "0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e"
+        "eth:0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e"
      values.$members.5:
-        "0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f"
+        "eth:0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f"
      values.$members.6:
-        "0x4A49e050156d76590Ed9f12B06673E8C431754d1"
+        "eth:0x4A49e050156d76590Ed9f12B06673E8C431754d1"
      values.$members.7:
-        "0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686"
+        "eth:0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686"
      values.$members.8:
-        "0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e"
+        "eth:0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e"
      values.$members.9:
-        "0x61efB23a6868a74A8DFE32651361a6165F6f173E"
+        "eth:0x61efB23a6868a74A8DFE32651361a6165F6f173E"
      values.$members.10:
-        "0x68B807482ffe50050a444f6610dE2F009e7CF760"
+        "eth:0x68B807482ffe50050a444f6610dE2F009e7CF760"
      values.$members.11:
-        "0x795bF46361495271F39fdBb0AbCC263C8e5fB538"
+        "eth:0x795bF46361495271F39fdBb0AbCC263C8e5fB538"
      values.$members.12:
-        "0x8CACd1De50937b16d11B5ba11A6efeEd7e561336"
+        "eth:0x8CACd1De50937b16d11B5ba11A6efeEd7e561336"
      values.$members.13:
-        "0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296"
+        "eth:0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296"
      values.$members.14:
-        "0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3"
+        "eth:0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3"
      values.$members.15:
-        "0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01"
+        "eth:0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01"
      values.$members.16:
-        "0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a"
+        "eth:0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a"
      values.$members.17:
-        "0xb08B382f09029AB7cE3CD486540aed0ed62680E3"
+        "eth:0xb08B382f09029AB7cE3CD486540aed0ed62680E3"
      values.$members.18:
-        "0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442"
+        "eth:0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442"
      values.$members.19:
-        "0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009"
+        "eth:0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009"
      implementationNames.0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33:
-        "SimpleMultiSig"
      implementationNames.eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33:
+        "SimpleMultiSig"
    }
```

```diff
    EOA  (0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c) {
    +++ description: None
      address:
-        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
+        "eth:0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
    }
```

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      address:
-        "0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
+        "eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
      values.$pastUpgrades.0.2.0:
-        "0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
+        "eth:0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
      values.$pastUpgrades.1.2.0:
-        "0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
      values.getConsensusContract:
-        "0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a"
+        "eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
      implementationNames.0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e:
-        "OssifiableProxy"
      implementationNames.0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c:
-        "ValidatorsExitBusOracle"
      implementationNames.eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e:
+        "OssifiableProxy"
      implementationNames.eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c:
+        "ValidatorsExitBusOracle"
    }
```

```diff
    EOA  (0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282) {
    +++ description: None
      address:
-        "0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282"
+        "eth:0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282"
    }
```

```diff
    EOA  (0x10277B1922e56d1B69f4dCe5A35696C791F78cac) {
    +++ description: None
      address:
-        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
+        "eth:0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
    }
```

```diff
    contract SimpleMultiSig (0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713) {
    +++ description: None
      address:
-        "0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
+        "eth:0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
      values.$members.0:
-        "0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6"
+        "eth:0x05824ab74d7D39BeeE6785e23D51De7bFA8967D6"
      values.$members.1:
-        "0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282"
+        "eth:0x0f16C1250f2AedA677e2Ca97EF167B45735Bf282"
      values.$members.2:
-        "0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb"
+        "eth:0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb"
      values.$members.3:
-        "0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876"
+        "eth:0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876"
      values.$members.4:
-        "0x44f802506dd40405f640eE30cE13304c1Ce6A2bD"
+        "eth:0x44f802506dd40405f640eE30cE13304c1Ce6A2bD"
      values.$members.5:
-        "0x45b516231db24D03479a1fEBaA57Bcb58Cd79696"
+        "eth:0x45b516231db24D03479a1fEBaA57Bcb58Cd79696"
      values.$members.6:
-        "0x472481219B0f19B3a9e6875094deAaE8f793070B"
+        "eth:0x472481219B0f19B3a9e6875094deAaE8f793070B"
      values.$members.7:
-        "0x505f07E9a14028dBd7c72904248a8d6506961921"
+        "eth:0x505f07E9a14028dBd7c72904248a8d6506961921"
      values.$members.8:
-        "0x76da59EeB0A6258F82B26f78CDD73f6f8627a078"
+        "eth:0x76da59EeB0A6258F82B26f78CDD73f6f8627a078"
      values.$members.9:
-        "0x9a396Cb5b589357C887549cbEaE54E445A7F8114"
+        "eth:0x9a396Cb5b589357C887549cbEaE54E445A7F8114"
      values.$members.10:
-        "0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA"
+        "eth:0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA"
      values.$members.11:
-        "0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f"
+        "eth:0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f"
      values.$members.12:
-        "0xaE9cf54119fE761A4d84d5D839b715F75ccf2786"
+        "eth:0xaE9cf54119fE761A4d84d5D839b715F75ccf2786"
      values.$members.13:
-        "0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83"
+        "eth:0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83"
      values.$members.14:
-        "0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96"
+        "eth:0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96"
      values.$members.15:
-        "0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26"
+        "eth:0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26"
      values.$members.16:
-        "0xdd8fee09281D42F26e537e208c81772cB7FE16AD"
+        "eth:0xdd8fee09281D42F26e537e208c81772cB7FE16AD"
      values.$members.17:
-        "0xDe27666796568984C40cD4A3630396B1570816B5"
+        "eth:0xDe27666796568984C40cD4A3630396B1570816B5"
      values.$members.18:
-        "0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95"
+        "eth:0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95"
      values.$members.19:
-        "0xefB3Bed7dee14059C35c34CF289C46Ae0811654e"
+        "eth:0xefB3Bed7dee14059C35c34CF289C46Ae0811654e"
      implementationNames.0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713:
-        "SimpleMultiSig"
      implementationNames.eth:0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713:
+        "SimpleMultiSig"
    }
```

```diff
    EOA  (0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314) {
    +++ description: None
      address:
-        "0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
+        "eth:0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
    }
```

```diff
    EOA  (0x1652f3fb11331fD9f5e37052C1AD507DA0371052) {
    +++ description: None
      address:
-        "0x1652f3fb11331fD9f5e37052C1AD507DA0371052"
+        "eth:0x1652f3fb11331fD9f5e37052C1AD507DA0371052"
    }
```

```diff
    EOA  (0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD) {
    +++ description: None
      address:
-        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
+        "eth:0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
    }
```

```diff
    EOA  (0x198839340407E6aEaCe31527b76B3bD76769a60A) {
    +++ description: None
      address:
-        "0x198839340407E6aEaCe31527b76B3bD76769a60A"
+        "eth:0x198839340407E6aEaCe31527b76B3bD76769a60A"
    }
```

```diff
    EOA  (0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451) {
    +++ description: None
      address:
-        "0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451"
+        "eth:0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451"
    }
```

```diff
    EOA  (0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb) {
    +++ description: None
      address:
-        "0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb"
+        "eth:0x1f14112c418fAAe416101E58CdFBa3aF67Ea70Eb"
    }
```

```diff
    EOA  (0x285f8537e1dAeEdaf617e96C742F2Cf36d63CcfB) {
    +++ description: None
      address:
-        "0x285f8537e1dAeEdaf617e96C742F2Cf36d63CcfB"
+        "eth:0x285f8537e1dAeEdaf617e96C742F2Cf36d63CcfB"
    }
```

```diff
    EOA  (0x2914767E232FD7708ab06bA60dB16c36C555751d) {
    +++ description: None
      address:
-        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
+        "eth:0x2914767E232FD7708ab06bA60dB16c36C555751d"
    }
```

```diff
    EOA  (0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0) {
    +++ description: None
      address:
-        "0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0"
+        "eth:0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0"
    }
```

```diff
    EOA  (0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d) {
    +++ description: None
      address:
-        "0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d"
+        "eth:0x2a7B42C764F31Ae54a3453e9aa6C2D1c67E9Ef9d"
    }
```

```diff
    EOA  (0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105) {
    +++ description: None
      address:
-        "0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105"
+        "eth:0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105"
    }
```

```diff
    EOA  (0x2fb074FA59c9294c71246825C1c9A0c7782d41a4) {
    +++ description: None
      address:
-        "0x2fb074FA59c9294c71246825C1c9A0c7782d41a4"
+        "eth:0x2fb074FA59c9294c71246825C1c9A0c7782d41a4"
    }
```

```diff
    contract SimpleMultiSig (0x38699d04656fF537ef8671b6b595402ebDBdf6f4) {
    +++ description: None
      address:
-        "0x38699d04656fF537ef8671b6b595402ebDBdf6f4"
+        "eth:0x38699d04656fF537ef8671b6b595402ebDBdf6f4"
      values.$members.0:
-        "0x1652f3fb11331fD9f5e37052C1AD507DA0371052"
+        "eth:0x1652f3fb11331fD9f5e37052C1AD507DA0371052"
      values.$members.1:
-        "0x198839340407E6aEaCe31527b76B3bD76769a60A"
+        "eth:0x198839340407E6aEaCe31527b76B3bD76769a60A"
      values.$members.2:
-        "0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451"
+        "eth:0x1E65CB2bD3A119eA78959Dc1858E7b94AA818451"
      values.$members.3:
-        "0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105"
+        "eth:0x2F11E51CAe96DCA0332e44c41B80b05BD8a41105"
      values.$members.4:
-        "0x38AF28F88C8f7eb083630179E6647052b0e959f1"
+        "eth:0x38AF28F88C8f7eb083630179E6647052b0e959f1"
      values.$members.5:
-        "0x46E38dAA42aD10d333118D76A56068d0f25FB217"
+        "eth:0x46E38dAA42aD10d333118D76A56068d0f25FB217"
      values.$members.6:
-        "0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B"
+        "eth:0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B"
      values.$members.7:
-        "0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D"
+        "eth:0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D"
      values.$members.8:
-        "0x6D39f61703333D3E0D533be3B76161beCc96d861"
+        "eth:0x6D39f61703333D3E0D533be3B76161beCc96d861"
      values.$members.9:
-        "0x7D70b773374AB8F07d60a05f833f7039beB7406d"
+        "eth:0x7D70b773374AB8F07d60a05f833f7039beB7406d"
      values.$members.10:
-        "0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C"
+        "eth:0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C"
      values.$members.11:
-        "0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B"
+        "eth:0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B"
      values.$members.12:
-        "0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd"
+        "eth:0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd"
      values.$members.13:
-        "0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42"
+        "eth:0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42"
      values.$members.14:
-        "0xc8e590C88f1F4bC59353b400f0c0D1024288438C"
+        "eth:0xc8e590C88f1F4bC59353b400f0c0D1024288438C"
      values.$members.15:
-        "0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087"
+        "eth:0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087"
      values.$members.16:
-        "0xCe160F39Cb0ac01b7Ca755027827e8853b217086"
+        "eth:0xCe160F39Cb0ac01b7Ca755027827e8853b217086"
      values.$members.17:
-        "0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74"
+        "eth:0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74"
      values.$members.18:
-        "0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330"
+        "eth:0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330"
      values.$members.19:
-        "0xea835d74f32BAfb03d59040bB67CC028ce1E6c31"
+        "eth:0xea835d74f32BAfb03d59040bB67CC028ce1E6c31"
      implementationNames.0x38699d04656fF537ef8671b6b595402ebDBdf6f4:
-        "SimpleMultiSig"
      implementationNames.eth:0x38699d04656fF537ef8671b6b595402ebDBdf6f4:
+        "SimpleMultiSig"
    }
```

```diff
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297) {
    +++ description: None
      address:
-        "0x388C818CA8B9251b393131C08a736A67ccB19297"
+        "eth:0x388C818CA8B9251b393131C08a736A67ccB19297"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.TREASURY:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.0x388C818CA8B9251b393131C08a736A67ccB19297:
-        "LidoExecutionLayerRewardsVault"
      implementationNames.eth:0x388C818CA8B9251b393131C08a736A67ccB19297:
+        "LidoExecutionLayerRewardsVault"
    }
```

```diff
    EOA  (0x38AF28F88C8f7eb083630179E6647052b0e959f1) {
    +++ description: None
      address:
-        "0x38AF28F88C8f7eb083630179E6647052b0e959f1"
+        "eth:0x38AF28F88C8f7eb083630179E6647052b0e959f1"
    }
```

```diff
    EOA  (0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27) {
    +++ description: None
      address:
-        "0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27"
+        "eth:0x3bA2a97E12Cf715F60C9dBBED5105733B3A8Cf27"
    }
```

```diff
    contract CSEarlyAdoption (0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E) {
    +++ description: None
      address:
-        "0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
+        "eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
      values.MODULE:
-        "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      implementationNames.0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E:
-        "CSEarlyAdoption"
      implementationNames.eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E:
+        "CSEarlyAdoption"
    }
```

```diff
    EOA  (0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876) {
    +++ description: None
      address:
-        "0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876"
+        "eth:0x3D7163C791951A55fEa279B6CA3e6c05f5e5F876"
    }
```

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      address:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37"
+        "eth:0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37"
      values.designatedSigner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37"
+        "eth:0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c:
-        "AppProxyUpgradeable"
      implementationNames.0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37:
-        "Agent"
      implementationNames.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37:
+        "Agent"
    }
```

```diff
    EOA  (0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9) {
    +++ description: None
      address:
-        "0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9"
+        "eth:0x3Ec49d8Bef9746d7cf10D26c91526E9C1e9341D9"
    }
```

```diff
    EOA  (0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e) {
    +++ description: None
      address:
-        "0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e"
+        "eth:0x3eDD0d6562e9321Fb4a95e52576eE7f0b5Aa017e"
    }
```

```diff
    EOA  (0x404335BcE530400a5814375E7Ec1FB55fAff3eA2) {
    +++ description: None
      address:
-        "0x404335BcE530400a5814375E7Ec1FB55fAff3eA2"
+        "eth:0x404335BcE530400a5814375E7Ec1FB55fAff3eA2"
    }
```

```diff
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb) {
    +++ description: None
      address:
-        "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
+        "eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
      values.$implementation:
-        "0xa29b819654cE6224A222bb5f586920105E2D7E0E"
+        "eth:0xa29b819654cE6224A222bb5f586920105E2D7E0E"
      values.getAccountingOracle:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getLido:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0xa29b819654cE6224A222bb5f586920105E2D7E0E"
+        "eth:0xa29b819654cE6224A222bb5f586920105E2D7E0E"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x442af784A788A5bd6F42A01Ebe9F287a871243fb:
-        "AppProxyUpgradeable"
      implementationNames.0xa29b819654cE6224A222bb5f586920105E2D7E0E:
-        "LegacyOracle"
      implementationNames.eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb:
+        "AppProxyUpgradeable"
      implementationNames.eth:0xa29b819654cE6224A222bb5f586920105E2D7E0E:
+        "LegacyOracle"
    }
```

```diff
    EOA  (0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f) {
    +++ description: None
      address:
-        "0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f"
+        "eth:0x44375aaE18B34bdF5c2C485DbAc932aB4D7D454f"
    }
```

```diff
    EOA  (0x44f802506dd40405f640eE30cE13304c1Ce6A2bD) {
    +++ description: None
      address:
-        "0x44f802506dd40405f640eE30cE13304c1Ce6A2bD"
+        "eth:0x44f802506dd40405f640eE30cE13304c1Ce6A2bD"
    }
```

```diff
    contract Paxos Gold Token (0x45804880De22913dAFE09f4980848ECE6EcbAf78) {
    +++ description: None
      address:
-        "0x45804880De22913dAFE09f4980848ECE6EcbAf78"
+        "eth:0x45804880De22913dAFE09f4980848ECE6EcbAf78"
      values.$admin:
-        "0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
+        "eth:0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713"
      values.$implementation:
-        "0x74271F2282eD7eE35c166122A60c9830354be42a"
+        "eth:0x74271F2282eD7eE35c166122A60c9830354be42a"
      values.assetProtectionRole:
-        "0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
      values.betaDelegateWhitelister:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.feeController:
-        "0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
      values.feeRecipient:
-        "0x38699d04656fF537ef8671b6b595402ebDBdf6f4"
+        "eth:0x38699d04656fF537ef8671b6b595402ebDBdf6f4"
      values.owner:
-        "0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
+        "eth:0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33"
      values.proposedOwner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.supplyController:
-        "0x2fb074FA59c9294c71246825C1c9A0c7782d41a4"
+        "eth:0x2fb074FA59c9294c71246825C1c9A0c7782d41a4"
      implementationNames.0x45804880De22913dAFE09f4980848ECE6EcbAf78:
-        "AdminUpgradeabilityProxy"
      implementationNames.0x74271F2282eD7eE35c166122A60c9830354be42a:
-        "PAXGImplementation"
      implementationNames.eth:0x45804880De22913dAFE09f4980848ECE6EcbAf78:
+        "AdminUpgradeabilityProxy"
      implementationNames.eth:0x74271F2282eD7eE35c166122A60c9830354be42a:
+        "PAXGImplementation"
    }
```

```diff
    EOA  (0x45b516231db24D03479a1fEBaA57Bcb58Cd79696) {
    +++ description: None
      address:
-        "0x45b516231db24D03479a1fEBaA57Bcb58Cd79696"
+        "eth:0x45b516231db24D03479a1fEBaA57Bcb58Cd79696"
    }
```

```diff
    EOA  (0x46E38dAA42aD10d333118D76A56068d0f25FB217) {
    +++ description: None
      address:
-        "0x46E38dAA42aD10d333118D76A56068d0f25FB217"
+        "eth:0x46E38dAA42aD10d333118D76A56068d0f25FB217"
    }
```

```diff
    EOA  (0x472481219B0f19B3a9e6875094deAaE8f793070B) {
    +++ description: None
      address:
-        "0x472481219B0f19B3a9e6875094deAaE8f793070B"
+        "eth:0x472481219B0f19B3a9e6875094deAaE8f793070B"
    }
```

```diff
    EOA  (0x4A49e050156d76590Ed9f12B06673E8C431754d1) {
    +++ description: None
      address:
-        "0x4A49e050156d76590Ed9f12B06673E8C431754d1"
+        "eth:0x4A49e050156d76590Ed9f12B06673E8C431754d1"
    }
```

```diff
    EOA  (0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B) {
    +++ description: None
      address:
-        "0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B"
+        "eth:0x4C086857faED97b5e8bAcc81Cf41b523D4E0386B"
    }
```

```diff
    contract CSFeeOracle (0x4D4074628678Bd302921c20573EEa1ed38DdF7FB) {
    +++ description: None
      address:
-        "0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
+        "eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
      values.$pastUpgrades.0.2.0:
-        "0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
      values.feeDistributor:
-        "0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getConsensusContract:
-        "0x71093efF8D8599b5fA340D665Ad60fA7C80688e4"
+        "eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
      implementationNames.0x4D4074628678Bd302921c20573EEa1ed38DdF7FB:
-        "OssifiableProxy"
      implementationNames.0x919ac5C6c62B6ef7B05cF05070080525a7B0381E:
-        "CSFeeOracle"
      implementationNames.eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB:
+        "OssifiableProxy"
      implementationNames.eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E:
+        "CSFeeOracle"
    }
```

```diff
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      address:
-        "0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
      values.$pastUpgrades.0.2.0:
-        "0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
      values.chargePenaltyRecipient:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.CSM:
-        "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      values.feeDistributor:
-        "0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.LIDO_LOCATOR:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
      values.WITHDRAWAL_QUEUE:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da:
-        "OssifiableProxy"
      implementationNames.0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758:
-        "CSAccounting"
      implementationNames.eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da:
+        "OssifiableProxy"
      implementationNames.eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758:
+        "CSAccounting"
    }
```

```diff
    EOA  (0x505f07E9a14028dBd7c72904248a8d6506961921) {
    +++ description: None
      address:
-        "0x505f07E9a14028dBd7c72904248a8d6506961921"
+        "eth:0x505f07E9a14028dBd7c72904248a8d6506961921"
    }
```

```diff
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) {
    +++ description: None
      address:
-        "0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5"
+        "eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5"
      values.$implementation:
-        "0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getLocator:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5:
-        "AppProxyUpgradeable"
      implementationNames.0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
-        "NodeOperatorsRegistry"
      implementationNames.eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
+        "NodeOperatorsRegistry"
    }
```

```diff
    EOA  (0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C) {
    +++ description: None
      address:
-        "0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
+        "eth:0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
    }
```

```diff
    EOA  (0x59232aC80E6d403b6381393e52f4665ECA328558) {
    +++ description: None
      address:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "eth:0x59232aC80E6d403b6381393e52f4665ECA328558"
    }
```

```diff
    EOA  (0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686) {
    +++ description: None
      address:
-        "0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686"
+        "eth:0x5bcc4b324bFD0F5D7F0e9167beBe0456BE342686"
    }
```

```diff
    EOA  (0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F) {
    +++ description: None
      address:
-        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
+        "eth:0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
    }
```

```diff
    EOA  (0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e) {
    +++ description: None
      address:
-        "0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e"
+        "eth:0x5d21C8C9dD0692bdEb7AC1A3fB24DFC3500E4c3e"
    }
```

```diff
    EOA  (0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1) {
    +++ description: None
      address:
-        "0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1"
+        "eth:0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1"
    }
```

```diff
    EOA  (0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D) {
    +++ description: None
      address:
-        "0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D"
+        "eth:0x619060F79Bef3bdBA987eb0697BeD5ADDdD9e55D"
    }
```

```diff
    EOA  (0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8) {
    +++ description: None
      address:
-        "0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8"
+        "eth:0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8"
    }
```

```diff
    EOA  (0x61efB23a6868a74A8DFE32651361a6165F6f173E) {
    +++ description: None
      address:
-        "0x61efB23a6868a74A8DFE32651361a6165F6f173E"
+        "eth:0x61efB23a6868a74A8DFE32651361a6165F6f173E"
    }
```

```diff
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75) {
    +++ description: None
      address:
-        "0x6232397ebac4f5772e53285B26c47914E9461E75"
+        "eth:0x6232397ebac4f5772e53285B26c47914E9461E75"
      values.getLidoLocator:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.secondOpinionOracle:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6232397ebac4f5772e53285B26c47914E9461E75:
-        "OracleReportSanityChecker"
      implementationNames.eth:0x6232397ebac4f5772e53285B26c47914E9461E75:
+        "OracleReportSanityChecker"
    }
```

```diff
    EOA  (0x64F4396bb0669C72858Cc50C779b48EB25F45770) {
    +++ description: None
      address:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "eth:0x64F4396bb0669C72858Cc50C779b48EB25F45770"
    }
```

```diff
    EOA  (0x68B807482ffe50050a444f6610dE2F009e7CF760) {
    +++ description: None
      address:
-        "0x68B807482ffe50050a444f6610dE2F009e7CF760"
+        "eth:0x68B807482ffe50050a444f6610dE2F009e7CF760"
    }
```

```diff
    EOA  (0x6D39f61703333D3E0D533be3B76161beCc96d861) {
    +++ description: None
      address:
-        "0x6D39f61703333D3E0D533be3B76161beCc96d861"
+        "eth:0x6D39f61703333D3E0D533be3B76161beCc96d861"
    }
```

```diff
    contract HashConsensus (0x71093efF8D8599b5fA340D665Ad60fA7C80688e4) {
    +++ description: None
      address:
-        "0x71093efF8D8599b5fA340D665Ad60fA7C80688e4"
+        "eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accessControl.MANAGE_MEMBERS_AND_QUORUM_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.getReportProcessor:
-        "0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
+        "eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      implementationNames.0x71093efF8D8599b5fA340D665Ad60fA7C80688e4:
-        "HashConsensus"
      implementationNames.eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4:
+        "HashConsensus"
    }
```

```diff
    EOA  (0x73181107c8D9ED4ce0bbeF7A0b4ccf3320C41d12) {
    +++ description: None
      address:
-        "0x73181107c8D9ED4ce0bbeF7A0b4ccf3320C41d12"
+        "eth:0x73181107c8D9ED4ce0bbeF7A0b4ccf3320C41d12"
    }
```

```diff
    EOA  (0x7383DDEd70cCCFd99835612C4148fA986e9DE560) {
    +++ description: None
      address:
-        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
+        "eth:0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
    }
```

```diff
    EOA  (0x76da59EeB0A6258F82B26f78CDD73f6f8627a078) {
    +++ description: None
      address:
-        "0x76da59EeB0A6258F82B26f78CDD73f6f8627a078"
+        "eth:0x76da59EeB0A6258F82B26f78CDD73f6f8627a078"
    }
```

```diff
    EOA  (0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF) {
    +++ description: None
      address:
-        "0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF"
+        "eth:0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF"
    }
```

```diff
    EOA  (0x795bF46361495271F39fdBb0AbCC263C8e5fB538) {
    +++ description: None
      address:
-        "0x795bF46361495271F39fdBb0AbCC263C8e5fB538"
+        "eth:0x795bF46361495271F39fdBb0AbCC263C8e5fB538"
    }
```

```diff
    EOA  (0x7A3a1bE19470919318aAD57ba162891a97e2982E) {
    +++ description: None
      address:
-        "0x7A3a1bE19470919318aAD57ba162891a97e2982E"
+        "eth:0x7A3a1bE19470919318aAD57ba162891a97e2982E"
    }
```

```diff
    EOA  (0x7D70b773374AB8F07d60a05f833f7039beB7406d) {
    +++ description: None
      address:
-        "0x7D70b773374AB8F07d60a05f833f7039beB7406d"
+        "eth:0x7D70b773374AB8F07d60a05f833f7039beB7406d"
    }
```

```diff
    contract Wrapped liquid staked Ether 2.0 Token (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) {
    +++ description: None
      address:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.stETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      implementationNames.0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0:
-        "WstETH"
      implementationNames.eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0:
+        "WstETH"
    }
```

```diff
    EOA  (0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C) {
    +++ description: None
      address:
-        "0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C"
+        "eth:0x7F3e4A8Cf64aa13DaD152D9a506c84f86488C74C"
    }
```

```diff
    contract HashConsensus (0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a) {
    +++ description: None
      address:
-        "0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a"
+        "eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accessControl.MANAGE_MEMBERS_AND_QUORUM_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.getReportProcessor:
-        "0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
+        "eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
      implementationNames.0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a:
-        "HashConsensus"
      implementationNames.eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a:
+        "HashConsensus"
    }
```

```diff
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      address:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
      values.$pastUpgrades.0.2.0:
-        "0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
+        "eth:0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
      values.$pastUpgrades.1.2.0:
-        "0xF3c5E0A67f32CF1dc07a8817590efa102079a1aF"
+        "eth:0xF3c5E0A67f32CF1dc07a8817590efa102079a1aF"
      values.$pastUpgrades.2.2.0:
-        "0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
      values.getConsensusContract:
-        "0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288"
+        "eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288"
      values.LEGACY_ORACLE:
-        "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
+        "eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.LOCATOR:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
      implementationNames.0x852deD011285fe67063a08005c71a85690503Cee:
-        "OssifiableProxy"
      implementationNames.0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7:
-        "AccountingOracle"
      implementationNames.eth:0x852deD011285fe67063a08005c71a85690503Cee:
+        "OssifiableProxy"
      implementationNames.eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7:
+        "AccountingOracle"
    }
```

```diff
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A) {
    +++ description: None
      address:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.$implementation:
-        "0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb"
+        "eth:0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb"
+        "eth:0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x853cc0D5917f49B57B8e9F89e491F5E18919093A:
-        "AppProxyPinned"
      implementationNames.0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb:
-        "EVMScriptRegistry"
      implementationNames.eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A:
+        "AppProxyPinned"
      implementationNames.eth:0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb:
+        "EVMScriptRegistry"
    }
```

```diff
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) {
    +++ description: None
      address:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
+        "eth:0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
      values.$pastUpgrades.0.2.0:
-        "0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
+        "eth:0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
      values.$pastUpgrades.1.2.0:
-        "0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
+        "eth:0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
      values.getNFTDescriptorAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
+        "eth:0xE42C659Dc09109566720EA8b2De186c2Be7D94D9"
      values.STETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1:
-        "OssifiableProxy"
      implementationNames.0xE42C659Dc09109566720EA8b2De186c2Be7D94D9:
-        "WithdrawalQueueERC721"
      implementationNames.eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1:
+        "OssifiableProxy"
      implementationNames.eth:0xE42C659Dc09109566720EA8b2De186c2Be7D94D9:
+        "WithdrawalQueueERC721"
    }
```

```diff
    EOA  (0x8CACd1De50937b16d11B5ba11A6efeEd7e561336) {
    +++ description: None
      address:
-        "0x8CACd1De50937b16d11B5ba11A6efeEd7e561336"
+        "eth:0x8CACd1De50937b16d11B5ba11A6efeEd7e561336"
    }
```

```diff
    EOA  (0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B) {
    +++ description: None
      address:
-        "0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B"
+        "eth:0x8cEE90e941778a3C56Ac075C4826C8C01b9e8B2B"
    }
```

```diff
    EOA  (0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296) {
    +++ description: None
      address:
-        "0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296"
+        "eth:0x8D0f7E545B4545c7Fe06B489D93E4DA1B96dF296"
    }
```

```diff
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7) {
    +++ description: None
      address:
-        "0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7"
+        "eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7"
      implementationNames.0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7:
-        "EIP712StETH"
      implementationNames.eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7:
+        "EIP712StETH"
    }
```

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      address:
-        "0x909d0CB383Ecc77e44daE5d0146cF476f611f62b"
+        "eth:0x909d0CB383Ecc77e44daE5d0146cF476f611f62b"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
+        "eth:0x2914767E232FD7708ab06bA60dB16c36C555751d"
      values.$members.1:
-        "0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
+        "eth:0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
      values.$members.2:
-        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
+        "eth:0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
      values.$members.3:
-        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
+        "eth:0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
      values.$members.4:
-        "0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
+        "eth:0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
      values.$members.5:
-        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
+        "eth:0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
      values.$members.6:
-        "0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90"
+        "eth:0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90"
      values.$members.7:
-        "0x7A3a1bE19470919318aAD57ba162891a97e2982E"
+        "eth:0x7A3a1bE19470919318aAD57ba162891a97e2982E"
      values.$members.8:
-        "0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
+        "eth:0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
      values.$members.9:
-        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
+        "eth:0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
      values.$members.10:
-        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
+        "eth:0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
      values.$members.11:
-        "0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0"
+        "eth:0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0"
      implementationNames.0x909d0CB383Ecc77e44daE5d0146cF476f611f62b:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x909d0CB383Ecc77e44daE5d0146cF476f611f62b:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x946D3b081ed19173dC83Cd974fC69e1e760B7d78) {
    +++ description: None
      address:
-        "0x946D3b081ed19173dC83Cd974fC69e1e760B7d78"
+        "eth:0x946D3b081ed19173dC83Cd974fC69e1e760B7d78"
    }
```

```diff
    EOA  (0x955B978F3ee7818dA71fA25c676062E6BC462Fec) {
    +++ description: None
      address:
-        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
+        "eth:0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
    }
```

```diff
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      address:
-        "0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
+        "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
      values.$implementation:
-        "0x9f3b9198911054B122fDb865f8A5Ac516201c339"
+        "eth:0x9f3b9198911054B122fDb865f8A5Ac516201c339"
      values.ANY_ENTITY:
-        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
      values.BURN_ENTITY:
-        "0x0000000000000000000000000000000000000001"
+        "eth:0x0000000000000000000000000000000000000001"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x9f3b9198911054B122fDb865f8A5Ac516201c339"
+        "eth:0x9f3b9198911054B122fDb865f8A5Ac516201c339"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb:
-        "AppProxyUpgradeable"
      implementationNames.0x9f3b9198911054B122fDb865f8A5Ac516201c339:
-        "ACL"
      implementationNames.eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x9f3b9198911054B122fDb865f8A5Ac516201c339:
+        "ACL"
    }
```

```diff
    EOA  (0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3) {
    +++ description: None
      address:
-        "0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3"
+        "eth:0x99E55F86526e2aA2Abf63A7A562a46cE3bd3F8c3"
    }
```

```diff
    EOA  (0x9a396Cb5b589357C887549cbEaE54E445A7F8114) {
    +++ description: None
      address:
-        "0x9a396Cb5b589357C887549cbEaE54E445A7F8114"
+        "eth:0x9a396Cb5b589357C887549cbEaE54E445A7F8114"
    }
```

```diff
    EOA  (0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA) {
    +++ description: None
      address:
-        "0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA"
+        "eth:0x9BC2b8BBFC50f5Ec19bCe90627b45b4f1Fe435BA"
    }
```

```diff
    EOA  (0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f) {
    +++ description: None
      address:
-        "0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f"
+        "eth:0x9D39a8623e6093c074Dac0E9f2aF330D82E5645f"
    }
```

```diff
    EOA  (0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01) {
    +++ description: None
      address:
-        "0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01"
+        "eth:0x9fCE35e475Fdd84DB06eEc4cbE65028d6F9C9d01"
    }
```

```diff
    EOA  (0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd) {
    +++ description: None
      address:
-        "0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd"
+        "eth:0xA32328DE1247d04CB929408D7e5cC8AcC33f48Cd"
    }
```

```diff
    EOA  (0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8) {
    +++ description: None
      address:
-        "0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8"
+        "eth:0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8"
    }
```

```diff
    EOA  (0xA7410857ABbf75043d61ea54e07D57A6EB6EF186) {
    +++ description: None
      address:
-        "0xA7410857ABbf75043d61ea54e07D57A6EB6EF186"
+        "eth:0xA7410857ABbf75043d61ea54e07D57A6EB6EF186"
    }
```

```diff
    EOA  (0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a) {
    +++ description: None
      address:
-        "0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a"
+        "eth:0xAad13BdEeC1F6e787b95F322eBb063bae5F1641a"
    }
```

```diff
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      address:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.$implementation:
-        "0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb"
+        "eth:0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb"
      values.eip712Domain.verifyingContract:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.getEIP712StETH:
-        "0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7"
+        "eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getLidoLocator:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.getOracle:
-        "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
+        "eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getTreasury:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.implementation:
-        "0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb"
+        "eth:0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84:
-        "AppProxyUpgradeable"
      implementationNames.0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb:
-        "Lido"
      implementationNames.eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x17144556fd3424EDC8Fc8A4C940B2D04936d17eb:
+        "Lido"
    }
```

```diff
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433) {
    +++ description: None
      address:
-        "0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433"
+        "eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433"
      values.$implementation:
-        "0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
      values.getEVMScriptRegistry:
-        "0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
+        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getLocator:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
+        "eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135"
      values.kernel:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      implementationNames.0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433:
-        "AppProxyUpgradeable"
      implementationNames.0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
-        "NodeOperatorsRegistry"
      implementationNames.eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433:
+        "AppProxyUpgradeable"
      implementationNames.eth:0x1770044a38402e3CfCa2Fcfa0C84a093c9B42135:
+        "NodeOperatorsRegistry"
    }
```

```diff
    EOA  (0xaE9cf54119fE761A4d84d5D839b715F75ccf2786) {
    +++ description: None
      address:
-        "0xaE9cf54119fE761A4d84d5D839b715F75ccf2786"
+        "eth:0xaE9cf54119fE761A4d84d5D839b715F75ccf2786"
    }
```

```diff
    EOA  (0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42) {
    +++ description: None
      address:
-        "0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42"
+        "eth:0xAeb500D8EE2a0322CcE35233819e8D6bEA5c8c42"
    }
```

```diff
    EOA  (0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83) {
    +++ description: None
      address:
-        "0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83"
+        "eth:0xb04f132aDA70B39F6fBbA6f4Dd37E80Ce6058D83"
    }
```

```diff
    EOA  (0xb08B382f09029AB7cE3CD486540aed0ed62680E3) {
    +++ description: None
      address:
-        "0xb08B382f09029AB7cE3CD486540aed0ed62680E3"
+        "eth:0xb08B382f09029AB7cE3CD486540aed0ed62680E3"
    }
```

```diff
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4) {
    +++ description: None
      address:
-        "0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4"
+        "eth:0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "eth:0xCe958D997F4a5824D4d503A128216322C6C223a0"
      values.$members.1:
-        "0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
+        "eth:0x955B978F3ee7818dA71fA25c676062E6BC462Fec"
      values.$members.2:
-        "0x64F4396bb0669C72858Cc50C779b48EB25F45770"
+        "eth:0x64F4396bb0669C72858Cc50C779b48EB25F45770"
      values.$members.3:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "eth:0x59232aC80E6d403b6381393e52f4665ECA328558"
      implementationNames.0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc) {
    +++ description: None
      address:
-        "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
+        "eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc"
      values.$implementation:
-        "0x2b33CF282f867A7FF693A66e11B0FcC5552e4425"
+        "eth:0x2b33CF282f867A7FF693A66e11B0FcC5552e4425"
      values.acl:
-        "0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
+        "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
      values.getRecoveryVault:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.implementation:
-        "0x2b33CF282f867A7FF693A66e11B0FcC5552e4425"
+        "eth:0x2b33CF282f867A7FF693A66e11B0FcC5552e4425"
      implementationNames.0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc:
-        "KernelProxy"
      implementationNames.0x2b33CF282f867A7FF693A66e11B0FcC5552e4425:
-        "Kernel"
      implementationNames.eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc:
+        "KernelProxy"
      implementationNames.eth:0x2b33CF282f867A7FF693A66e11B0FcC5552e4425:
+        "Kernel"
    }
```

```diff
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      address:
-        "0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
      values.$pastUpgrades.0.2.0:
-        "0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
      values.implementation:
-        "0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.proxy_getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.TREASURY:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f:
-        "WithdrawalsManagerProxy"
      implementationNames.0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd:
-        "WithdrawalVault"
      implementationNames.eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f:
+        "WithdrawalsManagerProxy"
      implementationNames.eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd:
+        "WithdrawalVault"
    }
```

```diff
    EOA  (0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442) {
    +++ description: None
      address:
-        "0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442"
+        "eth:0xbbe25013fF925463aa6FAc0Cd90f5cf10fd4F442"
    }
```

```diff
    EOA  (0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96) {
    +++ description: None
      address:
-        "0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96"
+        "eth:0xbEc5fd85dc949D9F38dCFF6D48613e0Fcf873A96"
    }
```

```diff
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09) {
    +++ description: None
      address:
-        "0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09"
+        "eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09"
      implementationNames.0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09:
-        "OracleDaemonConfig"
      implementationNames.eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09:
+        "OracleDaemonConfig"
    }
```

```diff
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) {
    +++ description: None
      address:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
      values.$pastUpgrades.0.2.0:
-        "0xEC3B38EDc7878Ad3f18cFddcd341aa94Fc57d20B"
+        "eth:0xEC3B38EDc7878Ad3f18cFddcd341aa94Fc57d20B"
      values.$pastUpgrades.1.2.0:
-        "0x2faE8f0A4D8D11B6EC35d04d3Ea6a0d195EB6D3F"
+        "eth:0x2faE8f0A4D8D11B6EC35d04d3Ea6a0d195EB6D3F"
      values.$pastUpgrades.2.2.0:
-        "0xc601E93D9F48D5E374820957CdA57516e2523d6C"
+        "eth:0xc601E93D9F48D5E374820957CdA57516e2523d6C"
      values.$pastUpgrades.3.2.0:
-        "0xd4f6BEF8DdBc7306684b8D7c836269e0E6f8B6D0"
+        "eth:0xd4f6BEF8DdBc7306684b8D7c836269e0E6f8B6D0"
      values.$pastUpgrades.4.2.0:
-        "0x1D920cc5bACf7eE506a271a5259f2417CaDeCE1d"
+        "eth:0x1D920cc5bACf7eE506a271a5259f2417CaDeCE1d"
      values.$pastUpgrades.5.2.0:
-        "0x1D920cc5bACf7eE506a271a5259f2417CaDeCE1d"
+        "eth:0x1D920cc5bACf7eE506a271a5259f2417CaDeCE1d"
      values.$pastUpgrades.6.2.0:
-        "0x39aFE23cE59e8Ef196b81F0DCb165E9aD38b9463"
+        "eth:0x39aFE23cE59e8Ef196b81F0DCb165E9aD38b9463"
      values.$pastUpgrades.7.2.0:
-        "0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
      values.accountingOracle:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.burner:
-        "0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
+        "eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
      values.coreComponents.0:
-        "0x388C818CA8B9251b393131C08a736A67ccB19297"
+        "eth:0x388C818CA8B9251b393131C08a736A67ccB19297"
      values.coreComponents.1:
-        "0x6232397ebac4f5772e53285B26c47914E9461E75"
+        "eth:0x6232397ebac4f5772e53285B26c47914E9461E75"
      values.coreComponents.2:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
      values.coreComponents.3:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.coreComponents.4:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.coreComponents.5:
-        "0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
      values.depositSecurityModule:
-        "0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"
+        "eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"
      values.elRewardsVault:
-        "0x388C818CA8B9251b393131C08a736A67ccB19297"
+        "eth:0x388C818CA8B9251b393131C08a736A67ccB19297"
      values.legacyOracle:
-        "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
+        "eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb"
      values.lido:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.oracleDaemonConfig:
-        "0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09"
+        "eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09"
      values.oracleReportComponentsForLido.0:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.oracleReportComponentsForLido.1:
-        "0x388C818CA8B9251b393131C08a736A67ccB19297"
+        "eth:0x388C818CA8B9251b393131C08a736A67ccB19297"
      values.oracleReportComponentsForLido.2:
-        "0x6232397ebac4f5772e53285B26c47914E9461E75"
+        "eth:0x6232397ebac4f5772e53285B26c47914E9461E75"
      values.oracleReportComponentsForLido.3:
-        "0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
+        "eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
      values.oracleReportComponentsForLido.4:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.oracleReportComponentsForLido.5:
-        "0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
      values.oracleReportComponentsForLido.6:
-        "0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
+        "eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
      values.oracleReportSanityChecker:
-        "0x6232397ebac4f5772e53285B26c47914E9461E75"
+        "eth:0x6232397ebac4f5772e53285B26c47914E9461E75"
      values.postTokenRebaseReceiver:
-        "0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
+        "eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
      values.stakingRouter:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
      values.treasury:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.validatorsExitBusOracle:
-        "0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
+        "eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
      values.withdrawalQueue:
-        "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      values.withdrawalVault:
-        "0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
      implementationNames.0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb:
-        "OssifiableProxy"
      implementationNames.0x3ABc4764f0237923d52056CFba7E9AEBf87113D3:
-        "LidoLocator"
      implementationNames.eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb:
+        "OssifiableProxy"
      implementationNames.eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3:
+        "LidoLocator"
    }
```

```diff
    EOA  (0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009) {
    +++ description: None
      address:
-        "0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009"
+        "eth:0xC271e7e7EB9dEb8831C1d6e728BB7677cd0e8009"
    }
```

```diff
    EOA  (0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf) {
    +++ description: None
      address:
-        "0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf"
+        "eth:0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf"
    }
```

```diff
    EOA  (0xc8e590C88f1F4bC59353b400f0c0D1024288438C) {
    +++ description: None
      address:
-        "0xc8e590C88f1F4bC59353b400f0c0D1024288438C"
+        "eth:0xc8e590C88f1F4bC59353b400f0c0D1024288438C"
    }
```

```diff
    contract StarkNet Token (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766) {
    +++ description: None
      address:
-        "0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766"
+        "eth:0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4"
+        "eth:0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4"
      values.accessControl.MINTER_ROLE.members.0:
-        "0xCa14076A3cec95448BaD179cc19B351A4204B88B"
+        "eth:0xCa14076A3cec95448BaD179cc19B351A4204B88B"
      implementationNames.0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766:
-        "StarkNetToken"
      implementationNames.eth:0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766:
+        "StarkNetToken"
    }
```

```diff
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B) {
    +++ description: None
      address:
-        "0xCa14076A3cec95448BaD179cc19B351A4204B88B"
+        "eth:0xCa14076A3cec95448BaD179cc19B351A4204B88B"
      values.$admin:
-        "0x909d0CB383Ecc77e44daE5d0146cF476f611f62b"
+        "eth:0x909d0CB383Ecc77e44daE5d0146cF476f611f62b"
      values.$implementation:
-        "0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
+        "eth:0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
      values.$pastUpgrades.0.2.0:
-        "0xddDF984037e35a0CecCC4654F824823bB8FD2a5e"
+        "eth:0xddDF984037e35a0CecCC4654F824823bB8FD2a5e"
      values.$pastUpgrades.1.2.0:
-        "0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
+        "eth:0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
      values.implementation:
-        "0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
+        "eth:0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20"
      implementationNames.0xCa14076A3cec95448BaD179cc19B351A4204B88B:
-        "ProxyV5"
      implementationNames.0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20:
-        "MintManager"
      implementationNames.eth:0xCa14076A3cec95448BaD179cc19B351A4204B88B:
+        "ProxyV5"
      implementationNames.eth:0xa4D28d9fFF539d6E1972Ce3Cf9c4577856eD7F20:
+        "MintManager"
    }
```

```diff
    EOA  (0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087) {
    +++ description: None
      address:
-        "0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087"
+        "eth:0xcC9F578fA52beD1EeB8a8B78A8c3D14dF8f6e087"
    }
```

```diff
    EOA  (0xCe160F39Cb0ac01b7Ca755027827e8853b217086) {
    +++ description: None
      address:
-        "0xCe160F39Cb0ac01b7Ca755027827e8853b217086"
+        "eth:0xCe160F39Cb0ac01b7Ca755027827e8853b217086"
    }
```

```diff
    EOA  (0xCe958D997F4a5824D4d503A128216322C6C223a0) {
    +++ description: None
      address:
-        "0xCe958D997F4a5824D4d503A128216322C6C223a0"
+        "eth:0xCe958D997F4a5824D4d503A128216322C6C223a0"
    }
```

```diff
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3) {
    +++ description: None
      address:
-        "0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
+        "eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3"
      values.STETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.TREASURY:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.0xD15a672319Cf0352560eE76d9e89eAB0889046D3:
-        "Burner"
      implementationNames.eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3:
+        "Burner"
    }
```

```diff
    EOA  (0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f) {
    +++ description: None
      address:
-        "0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
+        "eth:0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
    }
```

```diff
    EOA  (0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74) {
    +++ description: None
      address:
-        "0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74"
+        "eth:0xD5353842ac6d8aC6e3E8fb1d0Cd7B27fE3d67c74"
    }
```

```diff
    contract OpStackTokenRatePusher (0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE) {
    +++ description: None
      address:
-        "0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE"
+        "eth:0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE"
      values.ACCOUNTING_ORACLE:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      values.L2_TOKEN_RATE_ORACLE:
-        "0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0"
+        "eth:0x294ED1f214F4e0ecAE31C3Eae4F04EBB3b36C9d0"
      values.MESSENGER:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.WSTETH:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      implementationNames.0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE:
-        "OpStackTokenRatePusher"
      implementationNames.eth:0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE:
+        "OpStackTokenRatePusher"
    }
```

```diff
    EOA  (0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26) {
    +++ description: None
      address:
-        "0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26"
+        "eth:0xD55F7d21e8057631a6A88A7FDdF82EeDB2C14e26"
    }
```

```diff
    contract HashConsensus (0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288) {
    +++ description: None
      address:
-        "0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288"
+        "eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.accessControl.MANAGE_MEMBERS_AND_QUORUM_ROLE.members.0:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.getReportProcessor:
-        "0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      implementationNames.0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288:
-        "HashConsensus"
      implementationNames.eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288:
+        "HashConsensus"
    }
```

```diff
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      address:
-        "0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
      values.$pastUpgrades.0.2.0:
-        "0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
      values.ACCOUNTING:
-        "0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      values.ORACLE:
-        "0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
+        "eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
      values.STETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      implementationNames.0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0:
-        "OssifiableProxy"
      implementationNames.0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0:
-        "CSFeeDistributor"
      implementationNames.eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0:
+        "OssifiableProxy"
      implementationNames.eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0:
+        "CSFeeDistributor"
    }
```

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      address:
-        "0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
      values.$pastUpgrades.0.2.0:
-        "0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
      values.accounting:
-        "0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      values.earlyAdoption:
-        "0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
+        "eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
      values.LIDO_LOCATOR:
-        "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
      values.STETH:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      implementationNames.0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F:
-        "OssifiableProxy"
      implementationNames.0x8daEa53b17a629918CDFAB785C5c74077c1D895B:
-        "CSModule"
      implementationNames.eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F:
+        "OssifiableProxy"
      implementationNames.eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B:
+        "CSModule"
    }
```

```diff
    EOA  (0xdd8fee09281D42F26e537e208c81772cB7FE16AD) {
    +++ description: None
      address:
-        "0xdd8fee09281D42F26e537e208c81772cB7FE16AD"
+        "eth:0xdd8fee09281D42F26e537e208c81772cB7FE16AD"
    }
```

```diff
    EOA  (0xDe27666796568984C40cD4A3630396B1570816B5) {
    +++ description: None
      address:
-        "0xDe27666796568984C40cD4A3630396B1570816B5"
+        "eth:0xDe27666796568984C40cD4A3630396B1570816B5"
    }
```

```diff
    EOA  (0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330) {
    +++ description: None
      address:
-        "0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330"
+        "eth:0xe41eAFB2746cb2Ac8A88eD8310e38501D7886330"
    }
```

```diff
    EOA  (0xe57B3792aDCc5da47EF4fF588883F0ee0c9835C9) {
    +++ description: None
      address:
-        "0xe57B3792aDCc5da47EF4fF588883F0ee0c9835C9"
+        "eth:0xe57B3792aDCc5da47EF4fF588883F0ee0c9835C9"
    }
```

```diff
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823) {
    +++ description: None
      address:
-        "0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
+        "eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.observers.0:
-        "0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE"
+        "eth:0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE"
      values.owner:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      implementationNames.0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823:
-        "TokenRateNotifier"
      implementationNames.eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823:
+        "TokenRateNotifier"
    }
```

```diff
    EOA  (0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95) {
    +++ description: None
      address:
-        "0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95"
+        "eth:0xE8F167Ad63F0Ca84C41afcf7E7C8BA7c7482cb95"
    }
```

```diff
    EOA  (0xea835d74f32BAfb03d59040bB67CC028ce1E6c31) {
    +++ description: None
      address:
-        "0xea835d74f32BAfb03d59040bB67CC028ce1E6c31"
+        "eth:0xea835d74f32BAfb03d59040bB67CC028ce1E6c31"
    }
```

```diff
    EOA  (0xefB3Bed7dee14059C35c34CF289C46Ae0811654e) {
    +++ description: None
      address:
-        "0xefB3Bed7dee14059C35c34CF289C46Ae0811654e"
+        "eth:0xefB3Bed7dee14059C35c34CF289C46Ae0811654e"
    }
```

```diff
    EOA  (0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8) {
    +++ description: None
      address:
-        "0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
+        "eth:0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
    }
```

```diff
    EOA  (0xf82D88217C249297C6037BA77CE34b3d8a90ab43) {
    +++ description: None
      address:
-        "0xf82D88217C249297C6037BA77CE34b3d8a90ab43"
+        "eth:0xf82D88217C249297C6037BA77CE34b3d8a90ab43"
    }
```

```diff
    EOA  (0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0) {
    +++ description: None
      address:
-        "0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0"
+        "eth:0xfaECfa5E4180dd55D15396F804Fd00C6dbA233B0"
    }
```

```diff
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      address:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
      values.$pastUpgrades.0.2.0:
-        "0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
+        "eth:0x6F6541C2203196fEeDd14CD2C09550dA1CbEDa31"
      values.$pastUpgrades.1.2.0:
-        "0xD8784e748f59Ba711fB5643191Ec3fAdD50Fb6df"
+        "eth:0xD8784e748f59Ba711fB5643191Ec3fAdD50Fb6df"
      values.$pastUpgrades.2.2.0:
-        "0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
      values.DEPOSIT_CONTRACT:
-        "0x00000000219ab540356cBB839Cbe05303d7705Fa"
+        "eth:0x00000000219ab540356cBB839Cbe05303d7705Fa"
      values.getLido:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
      implementationNames.0xFdDf38947aFB03C621C71b06C9C70bce73f12999:
-        "OssifiableProxy"
      implementationNames.0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA:
-        "StakingRouter"
      implementationNames.eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999:
+        "OssifiableProxy"
      implementationNames.eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA:
+        "StakingRouter"
    }
```

```diff
    EOA  (0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90) {
    +++ description: None
      address:
-        "0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90"
+        "eth:0xFf713991196F8a9D6838bA82C9Bb3579F8Cc0D90"
    }
```

```diff
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD) {
    +++ description: None
      address:
-        "0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"
+        "eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"
      values.DEPOSIT_CONTRACT:
-        "0x00000000219ab540356cBB839Cbe05303d7705Fa"
+        "eth:0x00000000219ab540356cBB839Cbe05303d7705Fa"
      values.getGuardians.0:
-        "0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1"
+        "eth:0x5fd0dDbC3351d009eb3f88DE7Cd081a614C519F1"
      values.getGuardians.1:
-        "0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF"
+        "eth:0x7912Fa976BcDe9c2cf728e213e892AD7588E6AaF"
      values.getGuardians.2:
-        "0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
+        "eth:0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
      values.getGuardians.3:
-        "0xf82D88217C249297C6037BA77CE34b3d8a90ab43"
+        "eth:0xf82D88217C249297C6037BA77CE34b3d8a90ab43"
      values.getGuardians.4:
-        "0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8"
+        "eth:0xa56b128Ea2Ea237052b0fA2a96a387C0E43157d8"
      values.getGuardians.5:
-        "0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
+        "eth:0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
      values.getOwner:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.LIDO:
-        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
+        "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
      values.STAKING_ROUTER:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
      implementationNames.0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD:
-        "DepositSecurityModule"
      implementationNames.eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD:
+        "DepositSecurityModule"
    }
```

```diff
    EOA  (0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF) {
    +++ description: None
      address:
-        "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
    }
```

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x38699d04656fF537ef8671b6b595402ebDBdf6f4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSEarlyAdoption (0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c)
    +++ description: Custom role-based operations entrypoint for Lido.
```

```diff
+   Status: CREATED
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Paxos Gold Token (0x45804880De22913dAFE09f4980848ECE6EcbAf78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSFeeOracle (0x4D4074628678Bd302921c20573EEa1ed38DdF7FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0x71093efF8D8599b5fA340D665Ad60fA7C80688e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped liquid staked Ether 2.0 Token (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StarkNet Token (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpStackTokenRatePusher (0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD)
    +++ description: None
```

Generated with discovered.json: 0xbd84259d2e240ee993e809379bcbf35df6bc53ce

# Diff at Mon, 14 Jul 2025 12:46:37 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 32674389
- current block number: 32674389

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 32674389 (main branch discovery), not current.

```diff
    EOA  (0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3) {
    +++ description: None
      address:
-        "0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
+        "base:0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
    }
```

```diff
    EOA  (0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d) {
    +++ description: None
      address:
-        "0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d"
+        "base:0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d"
    }
```

```diff
    EOA  (0x099f352107a4F61B28687B0CFDb613cF24593466) {
    +++ description: None
      address:
-        "0x099f352107a4F61B28687B0CFDb613cF24593466"
+        "base:0x099f352107a4F61B28687B0CFDb613cF24593466"
    }
```

```diff
    EOA  (0x1347D2C792fC0962022B36e6D6d7dc521676c187) {
    +++ description: None
      address:
-        "0x1347D2C792fC0962022B36e6D6d7dc521676c187"
+        "base:0x1347D2C792fC0962022B36e6D6d7dc521676c187"
    }
```

```diff
    EOA  (0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1) {
    +++ description: None
      address:
-        "0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1"
+        "base:0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1"
    }
```

```diff
    EOA  (0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE) {
    +++ description: None
      address:
-        "0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE"
+        "base:0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE"
    }
```

```diff
    contract TokenMessenger (0x1682Ae6375C4E4A97e4B583BC394c861A46D8962) {
    +++ description: Part of CCTP
      address:
-        "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962"
+        "base:0x1682Ae6375C4E4A97e4B583BC394c861A46D8962"
      values.localMessageTransmitter:
-        "0xAD09780d193884d503182aD4588450C416D6F9D4"
+        "base:0xAD09780d193884d503182aD4588450C416D6F9D4"
      values.localMinter:
-        "0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
+        "base:0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
      values.owner:
-        "0x1347D2C792fC0962022B36e6D6d7dc521676c187"
+        "base:0x1347D2C792fC0962022B36e6D6d7dc521676c187"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7"
+        "base:0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7"
      implementationNames.0x1682Ae6375C4E4A97e4B583BC394c861A46D8962:
-        "TokenMessenger"
      implementationNames.base:0x1682Ae6375C4E4A97e4B583BC394c861A46D8962:
+        "TokenMessenger"
    }
```

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      address:
-        "0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
+        "base:0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
    }
```

```diff
    EOA  (0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7) {
    +++ description: None
      address:
-        "0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7"
+        "base:0x1cF9a51D9bFee6C582653A3dcA3c4Db34faA31a7"
    }
```

```diff
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1) {
    +++ description: Manager contract for minter management [sic].
      address:
-        "0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1"
+        "base:0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1"
      values.getMinterManager:
-        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
+        "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
      values.owner:
-        "0xb5bff84d169a72e76e94eC950da51Bac90b60284"
+        "base:0xb5bff84d169a72e76e94eC950da51Bac90b60284"
      implementationNames.0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1:
-        "MasterMinter"
      implementationNames.base:0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1:
+        "MasterMinter"
    }
```

```diff
    EOA  (0x24253f1CA7540CfCb3DdDa890d3b94434786E379) {
    +++ description: None
      address:
-        "0x24253f1CA7540CfCb3DdDa890d3b94434786E379"
+        "base:0x24253f1CA7540CfCb3DdDa890d3b94434786E379"
    }
```

```diff
    EOA  (0x244df059d103347a054487Da7f8D42d52Cb29A55) {
    +++ description: None
      address:
-        "0x244df059d103347a054487Da7f8D42d52Cb29A55"
+        "base:0x244df059d103347a054487Da7f8D42d52Cb29A55"
    }
```

```diff
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d) {
    +++ description: Part of CCTP
      address:
-        "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
+        "base:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
      values.$admin:
-        "0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
+        "base:0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
      values.$implementation:
-        "0x555E272506C06e7E559d57418563742AFE363ec8"
+        "base:0x555E272506C06e7E559d57418563742AFE363ec8"
      values.$pastUpgrades.0.2.0:
-        "0x555E272506C06e7E559d57418563742AFE363ec8"
+        "base:0x555E272506C06e7E559d57418563742AFE363ec8"
      values.admin:
-        "0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
+        "base:0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
      values.denylister:
-        "0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556"
+        "base:0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556"
      values.feeRecipient:
-        "0xDB03303F417A5eF98680FECde60c1e0701F3b6f3"
+        "base:0xDB03303F417A5eF98680FECde60c1e0701F3b6f3"
      values.implementation:
-        "0x555E272506C06e7E559d57418563742AFE363ec8"
+        "base:0x555E272506C06e7E559d57418563742AFE363ec8"
      values.localMessageTransmitter:
-        "0x81D40F21F12A8F0E3252Bccb954D722d4c464B64"
+        "base:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64"
      values.localMinter:
-        "0xfd78EE919681417d192449715b2594ab58f5D002"
+        "base:0xfd78EE919681417d192449715b2594ab58f5D002"
      values.owner:
-        "0x24253f1CA7540CfCb3DdDa890d3b94434786E379"
+        "base:0x24253f1CA7540CfCb3DdDa890d3b94434786E379"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5"
+        "base:0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5"
      implementationNames.0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d:
-        "AdminUpgradableProxy"
      implementationNames.0x555E272506C06e7E559d57418563742AFE363ec8:
-        "TokenMessengerV2"
      implementationNames.base:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d:
+        "AdminUpgradableProxy"
      implementationNames.base:0x555E272506C06e7E559d57418563742AFE363ec8:
+        "TokenMessengerV2"
    }
```

```diff
    EOA  (0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5) {
    +++ description: None
      address:
-        "0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5"
+        "base:0x2f86c55c0557788c8b1AbC2685f14ED6be68F3A5"
    }
```

```diff
    EOA  (0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293) {
    +++ description: None
      address:
-        "0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293"
+        "base:0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293"
    }
```

```diff
    EOA  (0x336C02D3e3c759160E1E44fF0247f87F63086495) {
    +++ description: None
      address:
-        "0x336C02D3e3c759160E1E44fF0247f87F63086495"
+        "base:0x336C02D3e3c759160E1E44fF0247f87F63086495"
    }
```

```diff
    EOA  (0x397729229B3d824Ca1B93e6E25e7CB197973df33) {
    +++ description: None
      address:
-        "0x397729229B3d824Ca1B93e6E25e7CB197973df33"
+        "base:0x397729229B3d824Ca1B93e6E25e7CB197973df33"
    }
```

```diff
    EOA  (0x3ABd6f64A422225E61E435baE41db12096106df7) {
    +++ description: None
      address:
-        "0x3ABd6f64A422225E61E435baE41db12096106df7"
+        "base:0x3ABd6f64A422225E61E435baE41db12096106df7"
    }
```

```diff
    EOA  (0x3B5821672AF876193bBce324d93b13c3D753D2A8) {
    +++ description: None
      address:
-        "0x3B5821672AF876193bBce324d93b13c3D753D2A8"
+        "base:0x3B5821672AF876193bBce324d93b13c3D753D2A8"
    }
```

```diff
    EOA  (0x3c5D61bD70F4099DdB19405f647584Cc117b65E6) {
    +++ description: None
      address:
-        "0x3c5D61bD70F4099DdB19405f647584Cc117b65E6"
+        "base:0x3c5D61bD70F4099DdB19405f647584Cc117b65E6"
    }
```

```diff
    EOA  (0x4273C43e14888ae07FB3a850c1C7c596C607d50d) {
    +++ description: None
      address:
-        "0x4273C43e14888ae07FB3a850c1C7c596C607d50d"
+        "base:0x4273C43e14888ae07FB3a850c1C7c596C607d50d"
    }
```

```diff
    EOA  (0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA) {
    +++ description: None
      address:
-        "0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA"
+        "base:0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA"
    }
```

```diff
    EOA  (0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8) {
    +++ description: None
      address:
-        "0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8"
+        "base:0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8"
    }
```

```diff
    EOA  (0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1) {
    +++ description: None
      address:
-        "0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1"
+        "base:0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1"
    }
```

```diff
    EOA  (0x47506C6d44e42B0621001E4a93E3A055BBb267A2) {
    +++ description: None
      address:
-        "0x47506C6d44e42B0621001E4a93E3A055BBb267A2"
+        "base:0x47506C6d44e42B0621001E4a93E3A055BBb267A2"
    }
```

```diff
    EOA  (0x4d15e70518A20Fc8828b5C3853f32e35238d0b77) {
    +++ description: None
      address:
-        "0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
+        "base:0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
    }
```

```diff
    EOA  (0x4d91619a02B55a817930f22C444560933dabF7Cd) {
    +++ description: None
      address:
-        "0x4d91619a02B55a817930f22C444560933dabF7Cd"
+        "base:0x4d91619a02B55a817930f22C444560933dabF7Cd"
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      address:
-        "0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
+        "base:0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
    }
```

```diff
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) {
    +++ description: None
      address:
-        "0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
+        "base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "base:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
+        "base:0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
      values.$members.1:
-        "0x397729229B3d824Ca1B93e6E25e7CB197973df33"
+        "base:0x397729229B3d824Ca1B93e6E25e7CB197973df33"
      values.$members.2:
-        "0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE"
+        "base:0x15ff3859Af506d6e4D7e5FDf335628Fc1e3ef1CE"
      values.$members.3:
-        "0xab7C7E7ac51f70dd959f3541316dBd715773158B"
+        "base:0xab7C7E7ac51f70dd959f3541316dBd715773158B"
      values.$members.4:
-        "0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
+        "base:0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
      values.$members.5:
-        "0x244df059d103347a054487Da7f8D42d52Cb29A55"
+        "base:0x244df059d103347a054487Da7f8D42d52Cb29A55"
      values.$members.6:
-        "0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
+        "base:0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
      values.$members.7:
-        "0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
+        "base:0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
      values.$members.8:
-        "0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
+        "base:0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
      values.GnosisSafe_modules.0:
-        "0x362DBD4Ff662b2E2b05b9cEDC91da2Dd2c655b26"
+        "base:0x362DBD4Ff662b2E2b05b9cEDC91da2Dd2c655b26"
      implementationNames.0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971:
+        "SafeProxy"
      implementationNames.base:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF) {
    +++ description: None
      address:
-        "0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF"
+        "base:0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF"
    }
```

```diff
    EOA  (0x530d3F8C38C262a619C2686A7f1481815a5e6f92) {
    +++ description: None
      address:
-        "0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
+        "base:0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
    }
```

```diff
    EOA  (0x617a3582bf134fe8eC600fF04A194604DcFB5Aab) {
    +++ description: None
      address:
-        "0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
+        "base:0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
    }
```

```diff
    EOA  (0x67745b6Dcc3B4a1d52ce28119A5d59884E681228) {
    +++ description: None
      address:
-        "0x67745b6Dcc3B4a1d52ce28119A5d59884E681228"
+        "base:0x67745b6Dcc3B4a1d52ce28119A5d59884E681228"
    }
```

```diff
    EOA  (0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6) {
    +++ description: None
      address:
-        "0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6"
+        "base:0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6"
    }
```

```diff
    EOA  (0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13) {
    +++ description: None
      address:
-        "0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13"
+        "base:0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13"
    }
```

```diff
    EOA  (0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b) {
    +++ description: None
      address:
-        "0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b"
+        "base:0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b"
    }
```

```diff
    EOA  (0x725b06F73ff761eF5390e39315e2BfbF60d33F96) {
    +++ description: None
      address:
-        "0x725b06F73ff761eF5390e39315e2BfbF60d33F96"
+        "base:0x725b06F73ff761eF5390e39315e2BfbF60d33F96"
    }
```

```diff
    EOA  (0x75edf81947e2b1616c2Affdf0524d0b657c34DEf) {
    +++ description: None
      address:
-        "0x75edf81947e2b1616c2Affdf0524d0b657c34DEf"
+        "base:0x75edf81947e2b1616c2Affdf0524d0b657c34DEf"
    }
```

```diff
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) {
    +++ description: Part of CCTP
      address:
-        "0x81D40F21F12A8F0E3252Bccb954D722d4c464B64"
+        "base:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64"
      values.$admin:
-        "0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
+        "base:0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
      values.$implementation:
-        "0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
+        "base:0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
      values.$pastUpgrades.0.2.0:
-        "0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
+        "base:0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
      values.admin:
-        "0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
+        "base:0x19b4B317E6Ea4643f1507c372630483092D0AbFf"
      values.attesterManager:
-        "0xDf265e0329F6A08a772B48191b33bDC624499b84"
+        "base:0xDf265e0329F6A08a772B48191b33bDC624499b84"
      values.getEnabledAttester.0:
-        "0x725b06F73ff761eF5390e39315e2BfbF60d33F96"
+        "base:0x725b06F73ff761eF5390e39315e2BfbF60d33F96"
      values.getEnabledAttester.1:
-        "0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF"
+        "base:0x52Ed4cBff8DcE6A19748043F3240ec03c834bCeF"
      values.implementation:
-        "0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
+        "base:0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3"
      values.owner:
-        "0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8"
+        "base:0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8"
      values.pauser:
-        "0x47506C6d44e42B0621001E4a93E3A055BBb267A2"
+        "base:0x47506C6d44e42B0621001E4a93E3A055BBb267A2"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x75edf81947e2b1616c2Affdf0524d0b657c34DEf"
+        "base:0x75edf81947e2b1616c2Affdf0524d0b657c34DEf"
      implementationNames.0x81D40F21F12A8F0E3252Bccb954D722d4c464B64:
-        "AdminUpgradableProxy"
      implementationNames.0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3:
-        "MessageTransmitterV2"
      implementationNames.base:0x81D40F21F12A8F0E3252Bccb954D722d4c464B64:
+        "AdminUpgradableProxy"
      implementationNames.base:0x7Db629f6Acc20Be49a0A7565c21CC178E9Ac21e3:
+        "MessageTransmitterV2"
    }
```

```diff
    contract USD Coin Token (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
      address:
-        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
+        "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
      values.$admin:
-        "0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
+        "base:0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
      values.$implementation:
-        "0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
+        "base:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
      values.$pastUpgrades.0.2.0:
-        "0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
+        "base:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
      values.admin:
-        "0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
+        "base:0x4fc7850364958d97B4d3f5A08f79db2493f8cA44"
      values.blacklister:
-        "0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
+        "base:0x4d15e70518A20Fc8828b5C3853f32e35238d0b77"
      values.implementation:
-        "0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
+        "base:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779"
      values.masterMinter:
-        "0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1"
+        "base:0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.0:
-        "0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C"
+        "base:0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.1:
-        "0x9066d3cF60D9f7B705026417E8E533b424Bc3d48"
+        "base:0x9066d3cF60D9f7B705026417E8E533b424Bc3d48"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.2:
-        "0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725"
+        "base:0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.3:
-        "0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d"
+        "base:0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.4:
-        "0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
+        "base:0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.5:
-        "0x3B5821672AF876193bBce324d93b13c3D753D2A8"
+        "base:0x3B5821672AF876193bBce324d93b13c3D753D2A8"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.6:
-        "0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6"
+        "base:0x6A8b792DB7C6Cff061f721c5F3791A654ee1c9c6"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.7:
-        "0xfE9Ffb577ad5B21c01f81c283075647085dD97f8"
+        "base:0xfE9Ffb577ad5B21c01f81c283075647085dD97f8"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.8:
-        "0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96"
+        "base:0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.9:
-        "0x4d91619a02B55a817930f22C444560933dabF7Cd"
+        "base:0x4d91619a02B55a817930f22C444560933dabF7Cd"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.10:
-        "0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293"
+        "base:0x3170a0717c6Dbb0d565143FdC3801Fcda57f6293"
+++ description: All minters, ignoring their 'allowed amount'
      values.minters.11:
-        "0xfd78EE919681417d192449715b2594ab58f5D002"
+        "base:0xfd78EE919681417d192449715b2594ab58f5D002"
      values.owner:
-        "0x3ABd6f64A422225E61E435baE41db12096106df7"
+        "base:0x3ABd6f64A422225E61E435baE41db12096106df7"
      values.pauser:
-        "0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4"
+        "base:0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4"
      values.rescuer:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      implementationNames.0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913:
-        "FiatTokenProxy"
      implementationNames.0x2Ce6311ddAE708829bc0784C967b7d77D19FD779:
-        "FiatTokenV2_2"
      implementationNames.base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913:
+        "FiatTokenProxy"
      implementationNames.base:0x2Ce6311ddAE708829bc0784C967b7d77D19FD779:
+        "FiatTokenV2_2"
    }
```

```diff
    EOA  (0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725) {
    +++ description: None
      address:
-        "0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725"
+        "base:0x880AD1D79c50f9FA0050CDdAd139E52e06B9C725"
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      address:
-        "0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
+        "base:0x88acF681fb9a1DFcE5ac83391991895C54CF24cc"
    }
```

```diff
    EOA  (0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556) {
    +++ description: None
      address:
-        "0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556"
+        "base:0x8C598734ea0e10Da19e654251Fd4A6C14AB4F556"
    }
```

```diff
    EOA  (0x9066d3cF60D9f7B705026417E8E533b424Bc3d48) {
    +++ description: None
      address:
-        "0x9066d3cF60D9f7B705026417E8E533b424Bc3d48"
+        "base:0x9066d3cF60D9f7B705026417E8E533b424Bc3d48"
    }
```

```diff
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202) {
    +++ description: None
      address:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
+        "base:0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
      values.$members.1:
-        "0xab7C7E7ac51f70dd959f3541316dBd715773158B"
+        "base:0xab7C7E7ac51f70dd959f3541316dBd715773158B"
      values.$members.2:
-        "0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
+        "base:0x530d3F8C38C262a619C2686A7f1481815a5e6f92"
      values.$members.3:
-        "0x336C02D3e3c759160E1E44fF0247f87F63086495"
+        "base:0x336C02D3e3c759160E1E44fF0247f87F63086495"
      values.$members.4:
-        "0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13"
+        "base:0x6AC8d65Dc698aE07263E3A98Aa698C33060b4A13"
      values.$members.5:
-        "0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
+        "base:0x617a3582bf134fe8eC600fF04A194604DcFB5Aab"
      values.$members.6:
-        "0x244df059d103347a054487Da7f8D42d52Cb29A55"
+        "base:0x244df059d103347a054487Da7f8D42d52Cb29A55"
      values.$members.7:
-        "0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
+        "base:0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
      implementationNames.0x92A19381444A001d62cE67BaFF066fA1111d7202:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.base:0x92A19381444A001d62cE67BaFF066fA1111d7202:
+        "GnosisSafeProxy"
      implementationNames.base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8) {
    +++ description: None
      address:
-        "0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8"
+        "base:0x9c563B7B08C5506C4aae279E1f66658D5f9fD7B8"
    }
```

```diff
    EOA  (0xA40b230899aab50669d69C1030eE11Af3Eac786F) {
    +++ description: None
      address:
-        "0xA40b230899aab50669d69C1030eE11Af3Eac786F"
+        "base:0xA40b230899aab50669d69C1030eE11Af3Eac786F"
    }
```

```diff
    EOA  (0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4) {
    +++ description: None
      address:
-        "0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
+        "base:0xa96bD9c5D0b169f73c1c8570600aE0BAc9b2A7f4"
    }
```

```diff
    EOA  (0xA9946e4dCfE522482A317f21feF7b2AFa5051B98) {
    +++ description: None
      address:
-        "0xA9946e4dCfE522482A317f21feF7b2AFa5051B98"
+        "base:0xA9946e4dCfE522482A317f21feF7b2AFa5051B98"
    }
```

```diff
    EOA  (0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d) {
    +++ description: None
      address:
-        "0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d"
+        "base:0xaac391f166f33CdaEfaa4AfA6616A3BEA66B694d"
    }
```

```diff
    EOA  (0xab7C7E7ac51f70dd959f3541316dBd715773158B) {
    +++ description: None
      address:
-        "0xab7C7E7ac51f70dd959f3541316dBd715773158B"
+        "base:0xab7C7E7ac51f70dd959f3541316dBd715773158B"
    }
```

```diff
    contract MessageTransmitter (0xAD09780d193884d503182aD4588450C416D6F9D4) {
    +++ description: Part of CCTP
      address:
-        "0xAD09780d193884d503182aD4588450C416D6F9D4"
+        "base:0xAD09780d193884d503182aD4588450C416D6F9D4"
      values.attesterManager:
-        "0xA40b230899aab50669d69C1030eE11Af3Eac786F"
+        "base:0xA40b230899aab50669d69C1030eE11Af3Eac786F"
      values.getEnabledAttester.0:
-        "0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361"
+        "base:0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361"
      values.getEnabledAttester.1:
-        "0xE2fEfe09E74b921CbbFF229E7cD40009231501CA"
+        "base:0xE2fEfe09E74b921CbbFF229E7cD40009231501CA"
      values.owner:
-        "0x4273C43e14888ae07FB3a850c1C7c596C607d50d"
+        "base:0x4273C43e14888ae07FB3a850c1C7c596C607d50d"
      values.pauser:
-        "0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d"
+        "base:0x0860399cF761dCcfB9897C8F91CAdc32a9B3E70d"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x099f352107a4F61B28687B0CFDb613cF24593466"
+        "base:0x099f352107a4F61B28687B0CFDb613cF24593466"
      implementationNames.0xAD09780d193884d503182aD4588450C416D6F9D4:
-        "MessageTransmitter"
      implementationNames.base:0xAD09780d193884d503182aD4588450C416D6F9D4:
+        "MessageTransmitter"
    }
```

```diff
    EOA  (0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96) {
    +++ description: None
      address:
-        "0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96"
+        "base:0xaD72249C80699ABc2eAeD5c66B0300F8631Fca96"
    }
```

```diff
    EOA  (0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361) {
    +++ description: None
      address:
-        "0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361"
+        "base:0xb0Ea8E1bE37F346C7EA7ec708834D0db18A17361"
    }
```

```diff
    EOA  (0xb5bff84d169a72e76e94eC950da51Bac90b60284) {
    +++ description: None
      address:
-        "0xb5bff84d169a72e76e94eC950da51Bac90b60284"
+        "base:0xb5bff84d169a72e76e94eC950da51Bac90b60284"
    }
```

```diff
    EOA  (0xce96ae6De784181d8Eb2639F1E347fD40b4fD403) {
    +++ description: None
      address:
-        "0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
+        "base:0xce96ae6De784181d8Eb2639F1E347fD40b4fD403"
    }
```

```diff
    EOA  (0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4) {
    +++ description: None
      address:
-        "0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4"
+        "base:0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4"
    }
```

```diff
    contract Wrapped OETH Token (0xD8724322f44E5c58D7A815F542036fb17DbbF839) {
    +++ description: None
      address:
-        "0xD8724322f44E5c58D7A815F542036fb17DbbF839"
+        "base:0xD8724322f44E5c58D7A815F542036fb17DbbF839"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xF66886e242e20cAb2496AF1d411eBcFb73440270"
+        "base:0xF66886e242e20cAb2496AF1d411eBcFb73440270"
      values.$pastUpgrades.0.2.0:
-        "0xF66886e242e20cAb2496AF1d411eBcFb73440270"
+        "base:0xF66886e242e20cAb2496AF1d411eBcFb73440270"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.accessControl.BURNER_ROLE.members.0:
-        "0x1e89F91Ee35D7d21c8e8238c79146daF7aB8Bb94"
+        "base:0x1e89F91Ee35D7d21c8e8238c79146daF7aB8Bb94"
      values.accessControl.MINTER_ROLE.members.0:
-        "0x1e89F91Ee35D7d21c8e8238c79146daF7aB8Bb94"
+        "base:0x1e89F91Ee35D7d21c8e8238c79146daF7aB8Bb94"
      values.admin:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.governor:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.implementation:
-        "0xF66886e242e20cAb2496AF1d411eBcFb73440270"
+        "base:0xF66886e242e20cAb2496AF1d411eBcFb73440270"
      implementationNames.0xD8724322f44E5c58D7A815F542036fb17DbbF839:
-        "BridgedBaseWOETHProxy"
      implementationNames.0xF66886e242e20cAb2496AF1d411eBcFb73440270:
-        "BridgedWOETH"
      implementationNames.base:0xD8724322f44E5c58D7A815F542036fb17DbbF839:
+        "BridgedBaseWOETHProxy"
      implementationNames.base:0xF66886e242e20cAb2496AF1d411eBcFb73440270:
+        "BridgedWOETH"
    }
```

```diff
    EOA  (0xDB03303F417A5eF98680FECde60c1e0701F3b6f3) {
    +++ description: None
      address:
-        "0xDB03303F417A5eF98680FECde60c1e0701F3b6f3"
+        "base:0xDB03303F417A5eF98680FECde60c1e0701F3b6f3"
    }
```

```diff
    EOA  (0xDf265e0329F6A08a772B48191b33bDC624499b84) {
    +++ description: None
      address:
-        "0xDf265e0329F6A08a772B48191b33bDC624499b84"
+        "base:0xDf265e0329F6A08a772B48191b33bDC624499b84"
    }
```

```diff
    EOA  (0xE2fEfe09E74b921CbbFF229E7cD40009231501CA) {
    +++ description: None
      address:
-        "0xE2fEfe09E74b921CbbFF229E7cD40009231501CA"
+        "base:0xE2fEfe09E74b921CbbFF229E7cD40009231501CA"
    }
```

```diff
    contract TokenMinter (0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6) {
    +++ description: Part of CCTP: Used for automated access control for minting.
      address:
-        "0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
+        "base:0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6"
      values.localTokenMessenger:
-        "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962"
+        "base:0x1682Ae6375C4E4A97e4B583BC394c861A46D8962"
      values.owner:
-        "0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA"
+        "base:0x44c035FC20bC8cF5A43c4f3637AF390d5A6F3AdA"
      values.pauser:
-        "0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b"
+        "base:0x6b0c900D12721B9C8Ab48A798C2e5c87B08bbf0b"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8"
+        "base:0x468f6f91D1264B1ab4ddD517c2F3770AE85021d8"
      values.tokenController:
-        "0x67745b6Dcc3B4a1d52ce28119A5d59884E681228"
+        "base:0x67745b6Dcc3B4a1d52ce28119A5d59884E681228"
      implementationNames.0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6:
-        "TokenMinter"
      implementationNames.base:0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6:
+        "TokenMinter"
    }
```

```diff
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f) {
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
      address:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
+        "base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.cancellerAC.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.executorAC.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.executorAC.1:
-        "0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
+        "base:0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971"
      values.proposerAC.0:
-        "0x92A19381444A001d62cE67BaFF066fA1111d7202"
+        "base:0x92A19381444A001d62cE67BaFF066fA1111d7202"
      values.timelockAdminAC.0:
-        "0xf817cb3092179083c48c014688D98B72fB61464f"
+        "base:0xf817cb3092179083c48c014688D98B72fB61464f"
      implementationNames.0xf817cb3092179083c48c014688D98B72fB61464f:
-        "Timelock"
      implementationNames.base:0xf817cb3092179083c48c014688D98B72fB61464f:
+        "Timelock"
    }
```

```diff
    EOA  (0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C) {
    +++ description: None
      address:
-        "0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C"
+        "base:0xF91f1865F1570953A99cc9Bc037b9aF6f4Fd9A9C"
    }
```

```diff
    contract TokenMinterV2 (0xfd78EE919681417d192449715b2594ab58f5D002) {
    +++ description: Part of CCTP: Used for automated access control for minting.
      address:
-        "0xfd78EE919681417d192449715b2594ab58f5D002"
+        "base:0xfd78EE919681417d192449715b2594ab58f5D002"
      values.localTokenMessenger:
-        "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
+        "base:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
      values.owner:
-        "0x3c5D61bD70F4099DdB19405f647584Cc117b65E6"
+        "base:0x3c5D61bD70F4099DdB19405f647584Cc117b65E6"
      values.pauser:
-        "0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1"
+        "base:0x474E914026f8C1e1A8FAC9FE0b31BCF2fa5f96A1"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.rescuer:
-        "0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1"
+        "base:0x158bc73B1f7a246939644c6Fc77d1e2Ef4F9e9a1"
      values.tokenController:
-        "0xA9946e4dCfE522482A317f21feF7b2AFa5051B98"
+        "base:0xA9946e4dCfE522482A317f21feF7b2AFa5051B98"
      implementationNames.0xfd78EE919681417d192449715b2594ab58f5D002:
-        "TokenMinterV2"
      implementationNames.base:0xfd78EE919681417d192449715b2594ab58f5D002:
+        "TokenMinterV2"
    }
```

```diff
    EOA  (0xfE9Ffb577ad5B21c01f81c283075647085dD97f8) {
    +++ description: None
      address:
-        "0xfE9Ffb577ad5B21c01f81c283075647085dD97f8"
+        "base:0xfE9Ffb577ad5B21c01f81c283075647085dD97f8"
    }
```

```diff
+   Status: CREATED
    contract TokenMessenger (0x1682Ae6375C4E4A97e4B583BC394c861A46D8962)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1)
    +++ description: Manager contract for minter management [sic].
```

```diff
+   Status: CREATED
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract USD Coin Token (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0xAD09780d193884d503182aD4588450C416D6F9D4)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract Wrapped OETH Token (0xD8724322f44E5c58D7A815F542036fb17DbbF839)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinter (0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f)
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (0xfd78EE919681417d192449715b2594ab58f5D002)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

Generated with discovered.json: 0xab188f78d2503d077764ec88a1786860064d36b4

# Diff at Thu, 10 Jul 2025 15:33:13 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 356266883

## Description

add EUTBL token.

## Initial discovery

```diff
+   Status: CREATED
    contract SafeL2 (0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionManager (0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Spiko EU T-Bills Money Market Fund Token (0xCBeb19549054CC0a6257A77736FC78C367216cE7)
    +++ description: None
```

Generated with discovered.json: 0x3c5ddfbb92b9469779c8e5e8dceaddcdef8191b2

# Diff at Thu, 10 Jul 2025 15:33:13 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f69ff944dc2501a54a7c05f54d37308d5262553d block: 22615727
- current block number: 22889418

## Description

lido update: 
- recovery vault unset (was set to Lido DAO Agent.)
- Lido Withdrawal vault now admin'd by Lido DAO Agent

add PAXG

## Watched changes

```diff
-   Status: DELETED
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e)
    +++ description: None
```

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
      receivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f","role":"admin"}
    }
```

```diff
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract Lido DAO Token (0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32)
    +++ description: None
```

```diff
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract MiniMeTokenFactory (0x909d05F384D0663eD4BE59863815aB43b4f347Ec)
    +++ description: None
```

```diff
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc) {
    +++ description: None
      values.getRecoveryVault:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "0x0000000000000000000000000000000000000000"
      values.recoveryVaultAppId:
-        "0x701a4fd1f5174d12a0f1d9ad2c88d0ad11ab6aad0ac72b7d9ce621815f8016a9"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

```diff
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      values.$admin:
-        "0x2e59A20f205bB85a89C53f1936454680651E618e"
+        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy_getAdmin:
-        "0x2e59A20f205bB85a89C53f1936454680651E618e"
+        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
    }
```

```diff
-   Status: DELETED
    contract TokenManager (0xf73a1260d222f447210581DDf212D915c09a3249)
    +++ description: None
```

## Source code changes

```diff
.../.flat@22615727/Lido DAO Token.sol => /dev/null |  496 ------
 .../MiniMeTokenFactory.sol => /dev/null            |   38 -
 .../AppProxyUpgradeable.p.sol => /dev/null         |  241 ---
 .../TokenManager/TokenManager.sol => /dev/null     | 1209 ---------------
 .../Voting/AppProxyUpgradeable.p.sol => /dev/null  |  241 ---
 .../.flat@22615727/Voting/Voting.sol => /dev/null  | 1639 --------------------
 6 files changed, 3864 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615727 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x0644Bd0248d5F89e4F6E845a91D15c23591e5D33)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x137Dcd97872dE27a4d3bf36A4643c5e18FA40713)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleMultiSig (0x38699d04656fF537ef8671b6b595402ebDBdf6f4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Paxos Gold Token (0x45804880De22913dAFE09f4980848ECE6EcbAf78)
    +++ description: None
```

Generated with discovered.json: 0x384c3cebac32ee6107ba75b1812789a57904ea43

# Diff at Thu, 10 Jul 2025 15:33:12 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f69ff944dc2501a54a7c05f54d37308d5262553d block: 30861907
- current block number: 32674389

## Description

update: added base bridge module and new member to wOETH timelock executor

## Watched changes

```diff
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) {
    +++ description: None
      values.$members.0:
+        "0x052c01a2a88fa6Cba8Fc2DBEf39a442A140a35e3"
      values.GnosisSafe_modules.0:
+        "0x362DBD4Ff662b2E2b05b9cEDC91da2Dd2c655b26"
      values.multisigThreshold:
-        "2 of 8 (25%)"
+        "2 of 9 (22%)"
    }
```

Generated with discovered.json: 0x9af9ae61be52d74c0c9f9f0702de8de8e58778c4

# Diff at Fri, 04 Jul 2025 12:19:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22615727
- current block number: 22615727

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22615727 (main branch discovery), not current.

```diff
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
+        "eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f"
    }
```

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      receivedPermissions.0.from:
-        "ethereum:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
+        "eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e"
      receivedPermissions.1.from:
-        "ethereum:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
+        "eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      receivedPermissions.2.from:
-        "ethereum:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      receivedPermissions.3.from:
-        "ethereum:0x852deD011285fe67063a08005c71a85690503Cee"
+        "eth:0x852deD011285fe67063a08005c71a85690503Cee"
      receivedPermissions.4.from:
-        "ethereum:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
+        "eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1"
      receivedPermissions.5.from:
-        "ethereum:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
+        "eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"
      receivedPermissions.6.from:
-        "ethereum:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      receivedPermissions.7.from:
-        "ethereum:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      receivedPermissions.8.from:
-        "ethereum:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
    }
```

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xCa14076A3cec95448BaD179cc19B351A4204B88B"
+        "eth:0xCa14076A3cec95448BaD179cc19B351A4204B88B"
    }
```

Generated with discovered.json: 0x24c1af6fd42636d6f810aea4b17d8392c472ab48

# Diff at Thu, 05 Jun 2025 08:23:04 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae074e39e9b50cc71e360e470589f9a084de5fa2 block: 30861907
- current block number: 30861907

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30861907 (main branch discovery), not current.

```diff
    contract Wrapped OETH Token (0xD8724322f44E5c58D7A815F542036fb17DbbF839) {
    +++ description: None
      name:
-        "BridgedWOETH"
+        "Wrapped OETH Token"
    }
```

Generated with discovered.json: 0xc2c3349d85d03772c28593994df3299d77bbc325

# Diff at Mon, 02 Jun 2025 08:12:37 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2fee84b782a329885c84742cf9cf43143842a2d5 block: 22587696
- current block number: 22615727

## Description

Oracle limit adjustments for lido.

## Watched changes

```diff
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75) {
    +++ description: None
      values.getOracleReportLimits.exitedValidatorsPerDayLimit:
-        9000
+        3600
      values.getOracleReportLimits.appearedValidatorsPerDayLimit:
-        43200
+        1800
      values.getOracleReportLimits.initialSlashingAmountPWei:
-        1000
+        8
    }
```

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      values.keyRemovalCharge:
-        "50000000000000000"
+        "20000000000000000"
    }
```

Generated with discovered.json: 0x27b306eae0c1a10ca0ab1b31e149d79dbccff513

# Diff at Thu, 29 May 2025 13:13:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9aa89f1c179f09ddb4f24aed66c1bd0315f063a3 block: 22445558
- current block number: 22587696

## Description

add some templates

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22445558 (main branch discovery), not current.

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0xFdDf38947aFB03C621C71b06C9C70bce73f12999","role":"admin"}
      receivedPermissions.7.from:
-        "0xFdDf38947aFB03C621C71b06C9C70bce73f12999"
+        "0x4D4074628678Bd302921c20573EEa1ed38DdF7FB"
      template:
+        "tokens/Lido/LidoDaoAgent"
      description:
+        "Custom role-based operations entrypoint for Lido."
    }
```

```diff
+   Status: CREATED
    contract CSFeeOracle (0x4D4074628678Bd302921c20573EEa1ed38DdF7FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0x71093efF8D8599b5fA340D665Ad60fA7C80688e4)
    +++ description: None
```

Generated with discovered.json: 0x3477e4b5a945e52074a7d7f9480e52a0b7f6f7c0

# Diff at Wed, 28 May 2025 13:56:28 GMT:

- chain: base
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 30000033
- current block number: 30000033

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30000033 (main branch discovery), not current.

```diff
    contract USD Coin Token (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
      name:
-        "USDC"
+        "USD Coin Token"
    }
```

Generated with discovered.json: 0x27200017b87c83f1865932aec752a3c1c777eb50

# Diff at Wed, 28 May 2025 13:56:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 22445558
- current block number: 22445558

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22445558 (main branch discovery), not current.

```diff
    contract Lido DAO Token (0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32) {
    +++ description: None
      name:
-        "MiniMeToken"
+        "Lido DAO Token"
    }
```

```diff
    contract Wrapped liquid staked Ether 2.0 Token (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) {
    +++ description: None
      name:
-        "wstETH_tokenContract"
+        "Wrapped liquid staked Ether 2.0 Token"
    }
```

```diff
    contract Liquid staked Ether 2.0 Token (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      name:
-        "stETH_tokenContract"
+        "Liquid staked Ether 2.0 Token"
    }
```

```diff
    contract StarkNet Token (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766) {
    +++ description: None
      name:
-        "STRK_tokenContract"
+        "StarkNet Token"
    }
```

Generated with discovered.json: 0x400d2c89f7570138ebdc91281c6c8540a96d8249

# Diff at Fri, 23 May 2025 09:41:15 GMT:

- chain: base
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 30000033
- current block number: 30000033

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30000033 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1) {
    +++ description: Manager contract for minter management [sic].
      receivedPermissions.0.role:
+        ".masterMinter"
    }
```

```diff
    EOA  (0x3ABd6f64A422225E61E435baE41db12096106df7) {
    +++ description: None
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x4d15e70518A20Fc8828b5C3853f32e35238d0b77) {
    +++ description: None
      receivedPermissions.0.role:
+        ".blacklister"
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) {
    +++ description: None
      receivedPermissions.1.role:
+        ".executorAC"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".executorAC"
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202) {
    +++ description: None
      receivedPermissions.3.description:
-        "execute transactions that are ready."
+        "propose transactions."
      receivedPermissions.3.role:
+        ".proposerAC"
      receivedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      receivedPermissions.2.role:
+        ".executorAC"
      receivedPermissions.1.role:
+        ".cancellerAC"
      receivedPermissions.0.role:
+        ".timelockAdminAC"
      directlyReceivedPermissions.0.role:
+        ".executorAC"
    }
```

```diff
    EOA  (0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4) {
    +++ description: None
      receivedPermissions.0.role:
+        ".pauser"
    }
```

```diff
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f) {
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
      directlyReceivedPermissions.0.role:
+        ".timelockAdminAC"
    }
```

Generated with discovered.json: 0x3345d3d697a64417e2a093827d2ba764e6b78f8b

# Diff at Fri, 23 May 2025 09:41:15 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22445558
- current block number: 22445558

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22445558 (main branch discovery), not current.

```diff
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: None
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x2e7e8b0583e68462b41c5cd78fc1539f0bc69067

# Diff at Wed, 14 May 2025 14:02:09 GMT:

- chain: base
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3e40b87963942c5b1b364373f150a7eda9e4eccd block: 30000033
- current block number: 30000033

## Description

Max upgrade count flag updated (after change to algo to scope per chain).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30000033 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xa8e3f5dfc477b38a35cb083e59ce1aa6c9eeabb5

# Diff at Fri, 09 May 2025 11:17:03 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b9a3516de49f42efd9d26f04918d74a8d92c6204 block: 22438060
- current block number: 22445558

## Description

MS member changes.

## Watched changes

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      values.$members.15:
-        "0xc196985a8bAfcEcF9C29Cfb24E2fb81f80De53E7"
      values.$members.14:
-        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
      values.$members.13:
-        "0x81C1B22c67731D3f0Bac506102Fe998361565874"
      values.$members.12:
-        "0x033b8521F357F813Cc87B08c0668f1b59FAE45e2"
      values.$members.11:
-        "0x68c6AfB39D2c6e22555175dDaE02d20e37d218f0"
+        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
      values.$members.10:
-        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
+        "0xF6AB8BD99EfE2515C45d6FeE8Ea32738877EFbD8"
      values.$members.9:
-        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
+        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
      values.$members.8:
-        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
+        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
      values.$members.7:
-        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
+        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
      values.$members.6:
-        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
+        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
      values.$members.5:
-        "0xe810b82A815AC9d46FDA4D6FBfA8521864f04645"
+        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
      values.multisigThreshold:
-        "7 of 16 (44%)"
+        "7 of 12 (58%)"
    }
```

Generated with discovered.json: 0x56abde3df0f324e57d99b3857374b0b30e20a7d8

# Diff at Fri, 09 May 2025 11:17:02 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b9a3516de49f42efd9d26f04918d74a8d92c6204 block: 29954366
- current block number: 30000033

## Description

Config related

## Watched changes

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29954366 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xbf1c451828d56226072770fb89846bb5ceda8951

# Diff at Thu, 08 May 2025 09:54:54 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 29913123
- current block number: 29954366

## Description

Config related.

## Watched changes

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29913123 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x31e13bb4c6faec9367fc5399fb95b07b9e6d911b

# Diff at Wed, 07 May 2025 11:00:13 GMT:

- chain: base
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@370d0c8c1e8a1a622701270cc075f9413ad76ecd block: 29519230
- current block number: 29913123

## Description

EOAs with admin permissions identified due to a change in config.

## Watched changes

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29519230 (main branch discovery), not current.

```diff
    EOA  (0x19b4B317E6Ea4643f1507c372630483092D0AbFf) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x4fc7850364958d97B4d3f5A08f79db2493f8cA44) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

```diff
    EOA  (0x88acF681fb9a1DFcE5ac83391991895C54CF24cc) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0xfe6d5223ce5306e75372318dfc9144348c8695d2

# Diff at Wed, 07 May 2025 11:00:13 GMT:

- chain: ethereum
- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@370d0c8c1e8a1a622701270cc075f9413ad76ecd block: 22424710
- current block number: 22431247

## Description

Increased the number of minter multisig members from 12 to 16, threshold stayed unchanged.

## Watched changes

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      values.$members.15:
+        "0xc196985a8bAfcEcF9C29Cfb24E2fb81f80De53E7"
      values.$members.14:
+        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
      values.$members.13:
+        "0x81C1B22c67731D3f0Bac506102Fe998361565874"
      values.$members.12:
+        "0x033b8521F357F813Cc87B08c0668f1b59FAE45e2"
      values.$members.11:
-        "0xc196985a8bAfcEcF9C29Cfb24E2fb81f80De53E7"
+        "0x68c6AfB39D2c6e22555175dDaE02d20e37d218f0"
      values.$members.10:
-        "0x7383DDEd70cCCFd99835612C4148fA986e9DE560"
+        "0x5C7DcaECB4D8e49Ea2487c5Cc23C5131Ddb2252F"
      values.$members.9:
-        "0x81C1B22c67731D3f0Bac506102Fe998361565874"
+        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
      values.$members.8:
-        "0x033b8521F357F813Cc87B08c0668f1b59FAE45e2"
+        "0x2914767E232FD7708ab06bA60dB16c36C555751d"
      values.$members.7:
-        "0x68c6AfB39D2c6e22555175dDaE02d20e37d218f0"
+        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
      values.$members.6:
-        "0x16aB869E6dEe6eF9068E5cF75C1a5A57981257CD"
+        "0x0762bCc4D604Aa3B5122C7D6571Cf5368EF3F09c"
      values.$members.5:
-        "0x10277B1922e56d1B69f4dCe5A35696C791F78cac"
+        "0xe810b82A815AC9d46FDA4D6FBfA8521864f04645"
      values.$members.4:
-        "0xe810b82A815AC9d46FDA4D6FBfA8521864f04645"
+        "0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
      values.$members.3:
-        "0x590Cb94bE977a769d9E7D95D9eff8DeAe82e430C"
+        "0x04D5b12b196a8CADEB2F476F22Ffb1334Ef9F94c"
      values.multisigThreshold:
-        "7 of 12 (58%)"
+        "7 of 16 (44%)"
    }
```

Generated with discovered.json: 0x1019dedf2391a3023ca4e7717df51ade1c896aec

# Diff at Tue, 06 May 2025 12:38:29 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@797a9ec756b28fc8b608c3143fbee4e577108cbc block: 22123688
- current block number: 22424710

## Description

Bumped consensus version. This is the consensus/oracle used for validator exits because exits are currently not triggerable from L1 (will be solved with pectra).

## Watched changes

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      values.getConsensusVersion:
-        2
+        3
    }
```

```diff
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      values.getConsensusVersion:
-        2
+        3
    }
```

Generated with discovered.json: 0x55af5c03fcf94e5fda07992b99df0ddead10fdc3

# Diff at Tue, 29 Apr 2025 08:19:23 GMT:

- chain: base
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 29519230
- current block number: 29519230

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29519230 (main branch discovery), not current.

```diff
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d) {
    +++ description: Part of CCTP
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x88acF681fb9a1DFcE5ac83391991895C54CF24cc","via":[]}]
    }
```

```diff
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) {
    +++ description: Part of CCTP
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x19b4B317E6Ea4643f1507c372630483092D0AbFf","via":[]}]
    }
```

```diff
    contract USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1","description":"manage minter addresses.","via":[]},{"permission":"interact","to":"0x3ABd6f64A422225E61E435baE41db12096106df7","description":"manage all critical roles like pausers, blacklisters, minters, rescuer.","via":[]},{"permission":"interact","to":"0x4d15e70518A20Fc8828b5C3853f32e35238d0b77","description":"blacklist addresses, freezing any interactions with the USDC token for them.","via":[]},{"permission":"interact","to":"0xD3571B3bc51CECFf49194AD67aFFFC648d5e07b4","description":"pause the USDC token (no transfers, mints, burns).","via":[]},{"permission":"upgrade","to":"0x4fc7850364958d97B4d3f5A08f79db2493f8cA44","via":[]}]
    }
```

```diff
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f) {
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971","delay":172800,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xf817cb3092179083c48c014688D98B72fB61464f","delay":172800}]},{"permission":"interact","to":"0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","delay":172800,"description":"manage all access control roles and change the minimum delay.","via":[{"address":"0xf817cb3092179083c48c014688D98B72fB61464f","delay":172800}]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"cancel queued transactions.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"execute transactions that are ready.","via":[]},{"permission":"interact","to":"0x92A19381444A001d62cE67BaFF066fA1111d7202","description":"propose transactions.","via":[]}]
    }
```

Generated with discovered.json: 0x859feba5b2c382d43e277dd545561080e425a40e

# Diff at Tue, 29 Apr 2025 08:19:23 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22123688
- current block number: 22123688

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22123688 (main branch discovery), not current.

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2e59A20f205bB85a89C53f1936454680651E618e","via":[]}]
    }
```

```diff
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x909d0CB383Ecc77e44daE5d0146cF476f611f62b","via":[]}]
    }
```

```diff
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

```diff
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","via":[]}]
    }
```

Generated with discovered.json: 0x74a967b8211eef7064cd2c104a9230c4829c608f

# Diff at Mon, 28 Apr 2025 09:27:19 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@abb69590061038da05feece26d3be8369d45e4a9 block: 29215620
- current block number: 29519230

## Description

Add USDC and CCTP v1 and v2 on base.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29215620 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract TokenMessenger (0x1682Ae6375C4E4A97e4B583BC394c861A46D8962)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MasterMinter (0x2230393EDAD0299b7E7B59F20AA856cD1bEd52e1)
    +++ description: Manager contract for minter management [sic].
```

```diff
+   Status: CREATED
    contract TokenMessengerV2 (0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract MessageTransmitterV2 (0x81D40F21F12A8F0E3252Bccb954D722d4c464B64)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0xAD09780d193884d503182aD4588450C416D6F9D4)
    +++ description: Part of CCTP
```

```diff
+   Status: CREATED
    contract TokenMinter (0xe45B133ddc64bE80252b0e9c75A8E74EF280eEd6)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

```diff
+   Status: CREATED
    contract TokenMinterV2 (0xfd78EE919681417d192449715b2594ab58f5D002)
    +++ description: Part of CCTP: Used for automated access control for minting.
```

Generated with discovered.json: 0x7373a5757b7ceead98f064f6c18a00ae87108903

# Diff at Mon, 21 Apr 2025 08:01:01 GMT:

- chain: base
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 29215620

## Description

add wOETH (CCIP) discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract SafeL2 (0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x92A19381444A001d62cE67BaFF066fA1111d7202)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgedWOETH (0xD8724322f44E5c58D7A815F542036fb17DbbF839)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Timelock (0xf817cb3092179083c48c014688D98B72fB61464f)
    +++ description: A standard timelock with access control. The current minimum delay is 2d.
```

Generated with discovered.json: 0x3017778cb63cabe14a9edede5cbf874232512f36

# Diff at Tue, 25 Mar 2025 11:42:40 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 22017795
- current block number: 22123688

## Description

Voting time confs for Lido increased (~double).

## Watched changes

```diff
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      values.objectionPhaseTime:
-        86400
+        172800
      values.voteTime:
-        259200
+        432000
    }
```

Generated with discovered.json: 0x542c9e1dc004624b1c7a835c392321d8b0f29085

# Diff at Tue, 18 Mar 2025 08:14:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22017795
- current block number: 22017795

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22017795 (main branch discovery), not current.

```diff
    contract Lido Dao Agent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: None
      name:
-        "LidoDaoAgent"
+        "Lido Dao Agent"
    }
```

Generated with discovered.json: 0xcc4a9f1c640a86b61bd22c6e6fc9b1007c0f4ce7

# Diff at Tue, 04 Mar 2025 10:40:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21938183
- current block number: 21938183

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21938183 (main branch discovery), not current.

```diff
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
    +++ description: Ethereum Beacon Chain deposit contract.
      sinceBlock:
+        11052984
    }
```

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      sinceBlock:
+        17172556
    }
```

```diff
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297) {
    +++ description: None
      sinceBlock:
+        14834805
    }
```

```diff
    contract CSEarlyAdoption (0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E) {
    +++ description: None
      sinceBlock:
+        20935463
    }
```

```diff
    contract LidoDaoAgent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      sinceBlock:
+        20935462
    }
```

```diff
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract MiniMeToken (0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75) {
    +++ description: None
      sinceBlock:
+        20921274
    }
```

```diff
    contract wstETH_tokenContract (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) {
    +++ description: None
      sinceBlock:
+        11888477
    }
```

```diff
    contract HashConsensus (0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a) {
    +++ description: None
      sinceBlock:
+        17172558
    }
```

```diff
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      sinceBlock:
+        17172553
    }
```

```diff
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) {
    +++ description: None
      sinceBlock:
+        17172547
    }
```

```diff
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7) {
    +++ description: None
      sinceBlock:
+        17172546
    }
```

```diff
    contract MiniMeTokenFactory (0x909d05F384D0663eD4BE59863815aB43b4f347Ec) {
    +++ description: None
      sinceBlock:
+        6593191
    }
```

```diff
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b) {
    +++ description: None
      sinceBlock:
+        21222337
    }
```

```diff
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract stETH_tokenContract (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433) {
    +++ description: None
      sinceBlock:
+        18731922
    }
```

```diff
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4) {
    +++ description: None
      sinceBlock:
+        19232636
    }
```

```diff
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      sinceBlock:
+        12812480
    }
```

```diff
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09) {
    +++ description: None
      sinceBlock:
+        17172469
    }
```

```diff
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) {
    +++ description: None
      sinceBlock:
+        17031323
    }
```

```diff
    contract STRK_tokenContract (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766) {
    +++ description: None
      sinceBlock:
+        15983290
    }
```

```diff
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B) {
    +++ description: None
      sinceBlock:
+        21236399
    }
```

```diff
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3) {
    +++ description: None
      sinceBlock:
+        17172559
    }
```

```diff
    contract OpStackTokenRatePusher (0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE) {
    +++ description: None
      sinceBlock:
+        20584007
    }
```

```diff
    contract HashConsensus (0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288) {
    +++ description: None
      sinceBlock:
+        17172555
    }
```

```diff
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      sinceBlock:
+        20935463
    }
```

```diff
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      sinceBlock:
+        20935462
    }
```

```diff
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823) {
    +++ description: None
      sinceBlock:
+        20584006
    }
```

```diff
    contract TokenManager (0xf73a1260d222f447210581DDf212D915c09a3249) {
    +++ description: None
      sinceBlock:
+        11473216
    }
```

```diff
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      sinceBlock:
+        17172550
    }
```

```diff
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD) {
    +++ description: None
      sinceBlock:
+        20921272
    }
```

Generated with discovered.json: 0x0f3b02dbacc0016e5e1e7bc0775e9434bdcab4ff

# Diff at Thu, 27 Feb 2025 14:44:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6fe2d9909e2842e4f6333df986a5df30c18337ea block: 21922694
- current block number: 21938183

## Description

mute tokens disco.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21922694 (main branch discovery), not current.

```diff
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa) {
    +++ description: Ethereum Beacon Chain deposit contract.
      template:
+        "global/DepositContract"
      description:
+        "Ethereum Beacon Chain deposit contract."
    }
```

```diff
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      values.getLastProcessingRefSlot:
-        11135999
      template:
+        "tokens/Lido/ValidatorsExitBusOracle"
    }
```

```diff
    contract wstETH_tokenContract (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) {
    +++ description: None
      name:
-        "WstETH"
+        "wstETH_tokenContract"
      displayName:
-        "wstETH_tokenContract"
    }
```

```diff
    contract stETH_tokenContract (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      name:
-        "Lido"
+        "stETH_tokenContract"
      displayName:
-        "stETH_tokenContract"
    }
```

```diff
    contract STRK_tokenContract (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766) {
    +++ description: None
      name:
-        "StarkNetToken"
+        "STRK_tokenContract"
      displayName:
-        "STRK_tokenContract"
    }
```

Generated with discovered.json: 0x5a65b2e8697fdbcc17d906e8eb1eb7a55c4c894a

# Diff at Tue, 25 Feb 2025 13:08:53 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21922694

## Description

Initial discovery for tokens: STRK and Lido stETH / wstETH.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorsExitBusOracle (0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Voting (0x2e59A20f205bB85a89C53f1936454680651E618e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoExecutionLayerRewardsVault (0x388C818CA8B9251b393131C08a736A67ccB19297)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSEarlyAdoption (0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoDaoAgent (0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LegacyOracle (0x442af784A788A5bd6F42A01Ebe9F287a871243fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSAccounting (0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MiniMeToken (0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleReportSanityChecker (0x6232397ebac4f5772e53285B26c47914E9461E75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WstETH (0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccountingOracle (0x852deD011285fe67063a08005c71a85690503Cee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (0x853cc0D5917f49B57B8e9F89e491F5E18919093A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalQueueERC721 (0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIP712StETH (0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MiniMeTokenFactory (0x909d05F384D0663eD4BE59863815aB43b4f347Ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x909d0CB383Ecc77e44daE5d0146cF476f611f62b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ACL (0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido (0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xB18BB767638Bca324d158B7C7189e1a28aeB9EB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kernel (0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalVault (0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleDaemonConfig (0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoLocator (0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StarkNetToken (0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManager (0xCa14076A3cec95448BaD179cc19B351A4204B88B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Burner (0xD15a672319Cf0352560eE76d9e89eAB0889046D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpStackTokenRatePusher (0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSFeeDistributor (0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSModule (0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRateNotifier (0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenManager (0xf73a1260d222f447210581DDf212D915c09a3249)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRouter (0xFdDf38947aFB03C621C71b06C9C70bce73f12999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositSecurityModule (0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD)
    +++ description: None
```

