Generated with discovered.json: 0xff12e0a17194af50d22b15ed39bd3e09aef3c722

# Diff at Wed, 27 Mar 2024 11:35:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e07213c85017436a1a224233fb8e2886f76f6cf9 block: 19510528
- current block number: 19525401

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract PolygonZkEVMGlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      values.depositCount:
-        5434
+        5750
      values.getLastGlobalExitRoot:
-        "0x8b20e114371b918bf8ee77daed11deda999907c85ad606f3f6b77b285f512300"
+        "0xb0405243863a60c26134bf7846c6bf8eca3de4bdecede092ababbad4c4ffa9ba"
      values.getRoot:
-        "0x5981fbaf36eb03114ec2eeccdbb47da67e60fead9625e92be6d170354c4179e1"
+        "0x39921c54e99b178ddff2703a2bb6ac7a8141bc2bd7f9baed48125aca5d1db938"
      values.lastMainnetExitRoot:
-        "0xf4ca3309519f26af91ac5c56560a60b7d558e96404768bb1617dce3c06936cbb"
+        "0xe54366f5c01244de9a81ad5f6969113e7dff18a2754a7ba45a779d65f27b73dd"
      values.lastRollupExitRoot:
-        "0xa2b2f4325e3501cc13e976012bad1bab9d722b1592b93f2fed58052e16f95219"
+        "0x89f166097c101bd9ae2df30bdeda9cd7fec6562cee06e3f8c20620be459e622c"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19510528 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values._HALT_AGGREGATION_TIMEOUT:
-        604800
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"TRUSTED_AGGREGATOR":{"adminRole":"TRUSTED_AGGREGATOR_ADMIN","members":["0x6329Fe417621925C81c16F9F9a18c203C21Af7ab","0x20A53dCb196cD2bcc14Ece01F358f1C849aA51dE"]},"ADD_ROLLUP_TYPE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"ADD_EXISTING_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF"]},"UPDATE_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"OBSOLETE_ROLLUP_TYPE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"CREATE_ROLLUP":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"STOP_EMERGENCY":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"TWEAK_PARAMETERS":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"TRUSTED_AGGREGATOR_ADMIN":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"SET_FEE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"EMERGENCY_COUNCIL":{"adminRole":"EMERGENCY_COUNCIL_ADMIN","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]},"EMERGENCY_COUNCIL_ADMIN":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6"]}}
      values.calculateRewardPerBatch:
-        "100000000000000000"
      values.getForcedBatchFee:
-        "10000000000000000000"
      values.getRollupExitRoot:
-        "0xa2b2f4325e3501cc13e976012bad1bab9d722b1592b93f2fed58052e16f95219"
      values.lastAggregationTimestamp:
-        1711355063
      values.multiplierBatchFee:
-        1002
      values.totalSequencedBatches:
-        24576
      values.totalVerifiedBatches:
-        24316
      values.rollupsData:
+        [["0x519E42c24163192Dca44CD3fBDCEBF6be9130987","0x0775e11309d75aA6b0967917fB0213C5673eDf81"],["0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"]]
      values.rollupTypes:
+        [["0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30","0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x4AaBBA26EA9E7A7fbD052d17a167e6aE3F8eC7Be"],["0x2650a9a4fC64f63F573EF0F405064EF54BC46f71","0x0775e11309d75aA6b0967917fB0213C5673eDf81"]]
    }
```

```diff
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb) {
    +++ description: None
      name:
-        "GlobalExitRootV2"
+        "PolygonZkEVMGlobalExitRootV2"
    }
```

```diff
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0) {
    +++ description: None
      values.members:
+        [["http://cdk-validium-dac-5-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x08EbBdFf8cB6d1336515A89641e899bc8ce91F2C"],["http://cdk-validium-dac-4-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x37f0B74e0Fc72aDAAb1Fd39Ec6d779F596866aB8"],["http://cdk-validium-dac-3-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0x8FB3cb4777EE1c2C35C48aC69a650026d18aFF08"],["http://cdk-validium-dac-2-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0xCFb77B6abb27e04cE0DB347cCCd5544f51A98CBc"],["http://cdk-validium-dac-1-prod-6d3f0-port1.cdk-validium-deployment-6d3f0.svc.cluster.local:8444","0xF54b295a221B5d3510D03d9B16E23BA151da012A"]]
    }
```

```diff
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF) {
    +++ description: None
      name:
-        "Timelock"
+        "PolygonZkEVMTimelock"
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"TIMELOCK_ADMIN_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0xEf1462451C30Ea7aD8555386226059Fe837CA4EF","0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"PROPOSER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"EXECUTOR_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]},"CANCELLER_ROLE":{"adminRole":"TIMELOCK_ADMIN_ROLE","members":["0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"]}}
      values.CANCELLER_ROLE:
+        "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783"
      values.DEFAULT_ADMIN_ROLE:
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.EXECUTOR_ROLE:
+        "0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63"
      values.PROPOSER_ROLE:
+        "0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1"
      values.TIMELOCK_ADMIN_ROLE:
+        "0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5"
    }
```

Generated with discovered.json: 0x80e34d2e9f076e502c2a5f413f27f449b1570d7a

# Diff at Mon, 25 Mar 2024 09:12:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9bc44b13c53d42ef5e81d478df7a78975e8d4088 block: 19482808
- current block number: 19510528

## Description

A bug on Polygon zkEVM was fixed, unrelated to Astar zkEVM.

## Watched changes

```diff
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21) {
    +++ description: None
      values.nonce:
-        19
+        27
    }
```

```diff
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2) {
    +++ description: None
      values.accessControl.UPDATE_ROLLUP.members.1:
+        "0x242daE44F5d8fb54B198D03a94dA45B5a4413e21"
      values.lastDeactivatedEmergencyStateTimestamp:
-        0
+        1711323791
      values.rollupTypeCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x9d882fb2ce884a4add9de979baad67a6d2a8b618

# Diff at Thu, 21 Mar 2024 11:41:18 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19482808

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Permit2 (0x000000000022D473030F116dDEE9F6B43aC78BA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1963D7b78e75A5eDfF9e5376E7A07A935Fb3d50d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarVerifier (0x1C3A3da552b8662CD69538356b1E7c2E9CC1EBD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumEtrog (0x1E163594e13030244DCAf4cDfC2cd0ba3206DA80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupManagerAdminMultisig (0x242daE44F5d8fb54B198D03a94dA45B5a4413e21)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0x37c58Dfa7BF0A165C5AAEdDf3e2EdB475ac6Dcb6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract POL (0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GlobalExitRootV2 (0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x6c4876Ecb5de33f76700f44d547C593065806dAC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AstarValidiumDAC (0x9CCD205052c732Ac1Df2cf7bf8aACC0E371eE0B0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminMultisig (0xf98ee8c46baEa2B11e4f0450AD9D01861265F76E)
    +++ description: None
```
