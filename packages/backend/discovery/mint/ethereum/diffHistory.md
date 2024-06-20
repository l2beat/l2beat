Generated with discovered.json: 0x3b16af6e24b385095342e9878b4a38bbca17c646

# Diff at Thu, 06 Jun 2024 12:44:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@5302ef2899ddfb7175df497ceaa47fba4e383655 block: 19982484
- current block number: 20032860

## Description

Discovery output now includes names of templates used for contract analysis.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19982484 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      template:
+        "opstack/SystemConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
    }
```

Generated with discovered.json: 0x88e0f828470372caf9a8af58d6227cfdd9d9c65d

# Diff at Thu, 23 May 2024 13:58:42 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ec50a072d7124fbf2bdaa30b50f821730ba6e919 block: 19926571
- current block number: 19933028

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x4fe6b15ce9fb31f900191985a91e36dad486b310

# Diff at Wed, 22 May 2024 16:20:16 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19926571

## Description

First discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED)
    +++ description: Central actor allowed to post new L2 state roots to L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19)
    +++ description: None
```
