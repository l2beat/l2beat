Generated with discovered.json: 0x4078b5bb8c74564285edd29b388fc20a041befe9

# Diff at Tue, 04 Mar 2025 10:39:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19531990
- current block number: 19531990

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531990 (main branch discovery), not current.

```diff
    contract NearProver (0x051AD3F020274910065Dcb421629cd2e6E5b46c4) {
    +++ description: None
      sinceBlock:
+        12040114
    }
```

```diff
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f) {
    +++ description: None
      sinceBlock:
+        12044301
    }
```

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      sinceBlock:
+        13896975
    }
```

```diff
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873) {
    +++ description: None
      sinceBlock:
+        15617816
    }
```

```diff
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52) {
    +++ description: None
      sinceBlock:
+        12702964
    }
```

Generated with discovered.json: 0x091a0dee529ef8aad47f7d8fe1cf041a9efce9fa

# Diff at Mon, 14 Oct 2024 10:53:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19531990
- current block number: 19531990

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531990 (main branch discovery), not current.

```diff
    contract NearProver (0x051AD3F020274910065Dcb421629cd2e6E5b46c4) {
    +++ description: None
      sourceHashes:
+        ["0xcd16841a968d4ea28094de73ada515cdb0661691dec1b02c5c9e86a08bcc5d06"]
    }
```

```diff
    contract ERC20Locker (0x23Ddd3e3692d1861Ed57EDE224608875809e127f) {
    +++ description: None
      sourceHashes:
+        ["0x74501db8a51bd105da4453dc8907e59a99756bc2651ce3a861485f0ffe7cf724"]
    }
```

```diff
    contract BridgeAdminMultisig (0x2468603819Bf09Ed3Fb6f3EFeff24B1955f3CDE1) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract NearBridge (0x3FEFc5A4B1c02f21cBc8D3613643ba0635b9a873) {
    +++ description: None
      sourceHashes:
+        ["0x52e85c821a158edace9ff11f0bda7524bc7bee826844981293fd48259887aaf1"]
    }
```

```diff
    contract EthCustodian (0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52) {
    +++ description: None
      sourceHashes:
+        ["0x38ac1699854c55e7085ee14f17acf067140394f315915c61dbb7aed0ff7bce59"]
    }
```

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
