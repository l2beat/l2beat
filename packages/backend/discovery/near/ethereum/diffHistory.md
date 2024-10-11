Generated with discovered.json: 0x360ebcabc3aa641d59211739fef063326a7c5bd4

# Diff at Fri, 09 Aug 2024 10:10:44 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531990
- current block number: 19531990

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531990 (main branch discovery), not current.

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xed9cB50304991951Cbee747900484E9a041DA464","0xF58096A602C960c841Bd83A29DE21c808a9c1ac9","0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d","0x1180c536465413eE05b206b3a99d4C6a9934D2b7","0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xed9cB50304991951Cbee747900484E9a041DA464","0xF58096A602C960c841Bd83A29DE21c808a9c1ac9","0xCFB9C137E21E199757Ae3Ce705B199CB26A3b91d","0x1180c536465413eE05b206b3a99d4C6a9934D2b7","0x8F3A347Eb3eB62fEa4975d293e052cD96abd36C6"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x33d977f13e815c884a1acc91e89d4d8c81a62faa

# Diff at Thu, 28 Mar 2024 10:23:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19233286
- current block number: 19531990

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19233286 (main branch discovery), not current.

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xabe7c526f112e7c35d9d3809029eda70c54e600f

# Diff at Thu, 15 Feb 2024 12:19:54 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19233286

## Description

Added Discovery integration to the Near Rainbow Bridge.

## Initial discovery

```diff
+   Status: CREATED
    contract NearProver (0x051AD3F020274910065Dcb421629cd2e6E5b46c4) {
    }
```

```diff
+   Status: CREATED
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f) {
    }
```

```diff
+   Status: CREATED
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    }
```

```diff
+   Status: CREATED
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873) {
    }
```

```diff
+   Status: CREATED
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52) {
    }
```
