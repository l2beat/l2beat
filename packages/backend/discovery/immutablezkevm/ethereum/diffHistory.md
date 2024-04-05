Generated with discovered.json: 0x3b4a1e4607aedb7346fc1f35d825a9142d5f70f7

# Diff at Thu, 28 Mar 2024 09:05:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19468251
- current block number: 19531603

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19468251 (main branch discovery), not current.

```diff
    contract OwnerMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

Generated with discovered.json: 0x2535ef632d848e630a8cb963806d8bd0a005df36

# Diff at Mon, 18 Mar 2024 07:41:50 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6554807e96aa5206aec95eab7b2ae23cf107941b block: 19439872
- current block number: 19460262

## Description

Withdrawal queue disabled. The queue gets triggered more and more often by 'large' withdrawals.

## Watched changes

```diff
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    +++ description: None
+++ description: If true, the withdrawal queue is activated and any withdrawals are delayed for a duration defined by withdrawalDelay. It can be manually activated or automatically triggered by the FlowRate mechanism.
+++ type: RISK_PARAMETER
+++ severity: LOW
      values.withdrawalQueueActivated:
-        true
+        false
    }
```

Generated with discovered.json: 0xcba4559c3490aac950c853627fe016a9837d784a

# Diff at Fri, 15 Mar 2024 10:53:09 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6a294996c13c1a3ad00c7c4d72e651e8fbd4fa1c block: 19431934
- current block number: 19439872

## Description

Will be active for 24h for all withdrawals.

## Watched changes

```diff
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    +++ description: None
+++ description: If true, the withdrawal queue is activated and any withdrawals are delayed for a duration defined by withdrawalDelay. It can be manually activated or automatically triggered by the FlowRate mechanism.
+++ type: RISK_PARAMETER
+++ severity: MEDIUM
      values.withdrawalQueueActivated:
-        false
+        true
    }
```

Generated with discovered.json: 0x7ef088f542869071a0bbceb84a19be2a8d1c3b56

# Diff at Wed, 07 Feb 2024 10:24:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19175701

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract AxelarGasService (0x2d5d7d31F671F86C782533cc367F14109a082712) {
    }
```

```diff
+   Status: CREATED
    contract AxelarGatewayProxyMultisig (0x4F4495243837681061C4743b74B3eEdf548D56A5) {
    }
```

```diff
+   Status: CREATED
    contract RootAxelarBridgeAdaptor (0x4f49B53928A71E553bB1B0F66a5BcB54Fd4E8932) {
    }
```

```diff
+   Status: CREATED
    contract Operators (0x7DdB2d76b80B0AA19bDEa48EB1301182F4CeefbC) {
    }
```

```diff
+   Status: CREATED
    contract ChildERC20 (0x8804A8aA1F18f23aE8A456dD73806FdA3219FaD1) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6) {
    }
```

```diff
+   Status: CREATED
    contract OwnerMultisig (0xD2C37fC6fD89563187f3679304975655e448D192) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xdE2BCd3F0297d29c25e83228E5A33C0b43b51Ec8) {
    }
```
