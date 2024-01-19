# Diff at Fri, 19 Jan 2024 08:46:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@66d81d543e5774973a4ef4bf257f67dd0862a255 block: 168378561
- current block number: 171955070

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
      errors.validators:
-        "bad response (status=400, headers={\"date\":\"Fri, 19 Jan 2024 08:46:16 GMT\",\"content-type\":\"application/json\",\"content-length\":\"106\",\"connection\":\"close\",\"x-alchemy-trace-id\":\"fb48a423e35361c9b6e3e1fb860bbbdd\",\"cf-cache-status\":\"DYNAMIC\",\"set-cookie\":\"_cfuvid=A4M72OvjaAiNltwZ8U50UZXiDDRQqYyVd__oUIhqpZE-1705653976632-0-604800000; path=/; domain=.g.alchemy.com; HttpOnly; Secure; SameSite=None\",\"server\":\"cloudflare\",\"cf-ray\":\"847dce690d060de8-MXP\"}, body=\"{\\\"jsonrpc\\\":\\\"2.0\\\",\\\"id\\\":43,\\\"error\\\":{\\\"code\\\":-32600,\\\"message\\\":\\\"Unsupported method: trace_transaction on arb\\\"}}\", requestBody=\"{\\\"method\\\":\\\"trace_transaction\\\",\\\"params\\\":[\\\"0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095\\\"],\\\"id\\\":43,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://arb-mainnet.g.alchemy.com/v2/vDE81dGkASEBA0Fiwu7bhA31ucQRe3ka\", code=SERVER_ERROR, version=web/5.7.1)"
+        "bad response (status=400, headers={\"date\":\"Fri, 19 Jan 2024 08:46:12 GMT\",\"content-type\":\"application/json\",\"content-length\":\"107\",\"connection\":\"close\",\"x-alchemy-trace-id\":\"0bc963f917a94c767d7536e8a7a278d6\",\"cf-cache-status\":\"DYNAMIC\",\"set-cookie\":\"_cfuvid=a8vAQtRpynNTWnLiF3acVaxa3aoNANrPLtEV3tMy6JU-1705653972184-0-604800000; path=/; domain=.g.alchemy.com; HttpOnly; Secure; SameSite=None\",\"server\":\"cloudflare\",\"cf-ray\":\"847dce4d7d814c63-MXP\"}, body=\"{\\\"jsonrpc\\\":\\\"2.0\\\",\\\"id\\\":132,\\\"error\\\":{\\\"code\\\":-32600,\\\"message\\\":\\\"Unsupported method: trace_transaction on arb\\\"}}\", requestBody=\"{\\\"method\\\":\\\"trace_transaction\\\",\\\"params\\\":[\\\"0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095\\\"],\\\"id\\\":132,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://arb-mainnet.g.alchemy.com/v2/vDE81dGkASEBA0Fiwu7bhA31ucQRe3ka\", code=SERVER_ERROR, version=web/5.7.1)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during 
discovery. Values are for block 168378561 (main branch discovery), not current.

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
      errors:
+        {"validators":"bad response (status=400, headers={\"date\":\"Fri, 19 Jan 2024 08:46:16 GMT\",\"content-type\":\"application/json\",\"content-length\":\"106\",\"connection\":\"close\",\"x-alchemy-trace-id\":\"fb48a423e35361c9b6e3e1fb860bbbdd\",\"cf-cache-status\":\"DYNAMIC\",\"set-cookie\":\"_cfuvid=A4M72OvjaAiNltwZ8U50UZXiDDRQqYyVd__oUIhqpZE-1705653976632-0-604800000; path=/; domain=.g.alchemy.com; HttpOnly; Secure; SameSite=None\",\"server\":\"cloudflare\",\"cf-ray\":\"847dce690d060de8-MXP\"}, body=\"{\\\"jsonrpc\\\":\\\"2.0\\\",\\\"id\\\":43,\\\"error\\\":{\\\"code\\\":-32600,\\\"message\\\":\\\"Unsupported method: trace_transaction on arb\\\"}}\", requestBody=\"{\\\"method\\\":\\\"trace_transaction\\\",\\\"params\\\":[\\\"0xc8d7afcb2f7f7dc0883a938db4352813e17b7629850cdc54d8cc2eba7e10b095\\\"],\\\"id\\\":43,\\\"jsonrpc\\\":\\\"2.0\\\"}\", requestMethod=\"POST\", url=\"https://arb-mainnet.g.alchemy.com/v2/vDE81dGkASEBA0Fiwu7bhA31ucQRe3ka\", code=SERVER_ERROR, version=web/5.7.1)"}
    }
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0xa8f6bB820eaD521cf834B7b371cFe025bdacEE99) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xB155C77a440DA7c282993a89FeA609598293017A) {
    }
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0xe507b9EF563DB6CcFDcE270160C50b2005BeED20) {
    }
```

# Diff at Mon, 08 Jan 2024 15:22:41 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@3ee3c075ee99707d8392a73b092ed24eeb24866f block: 159392469
- current block number: 168378561

## Description

Executors and stake escrow contracts have been updated. At this point we're not displaying any info yet (ts is empty).

## Watched changes

```diff
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xD1C955A1544cF449F4a8463E9fE2AC4Ff0798E05"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

```diff
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
      values.loserStakeEscrow:
-        "0xE6Deca8779AAd0F8C96Dd843F77BF2a55ea2F402"
+        "0x46A78349aBA0369D18292a285DE6d5FC5CC2de5c"
    }
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 159392469 (main branch discovery), not current.

```diff
    contract Inbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
      name:
-        "Inbox"
+        "SequencerInbox"
    }
```

# Diff at Tue, 12 Dec 2023 13:17:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0611b78A42903a537BE7a2f9a8783BE39AC63cD9) {
    }
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0x0fF7A97caAb356c5507e5355b6819CB8b93d5591) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x1135265fE014D3FA32B3507E325642B92aFFeAEb) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    }
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x383eFE8D410285c5CbE1B4F296022640759aA834) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b) {
    }
```

```diff
+   Status: CREATED
    contract  (0x82709E8564ce17707a7C8420c9e48e9a8A88bfc1) {
    }
```

```diff
+   Status: CREATED
    contract RollupProxy (0x846387C3D6001F74170455B1074D01f05eB3067a) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    }
```

```diff
+   Status: CREATED
    contract Outbox (0xA597e0212971e65f53f288Ff1fFd26A6C8201f83) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0) {
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xe347C1223381b9Dcd6c0F61cf81c90175A7Bae77) {
    }
```

```diff
+   Status: CREATED
    contract Inbox (0xFF55fB76F5671dD9eB6c62EffF8D693Bb161a3ad) {
    }
```
