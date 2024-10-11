Generated with discovered.json: 0x5352dff9e38fa423bf4dac53486c18c3172d2e5f

# Diff at Fri, 09 Aug 2024 10:09:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531595
- current block number: 19531595

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531595 (main branch discovery), not current.

```diff
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x9f8d2dafE9978268aC7c67966B366d6d55e97f07","0x404c2184a4027b0092C5877BC4599099cd63E62D","0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x9f8d2dafE9978268aC7c67966B366d6d55e97f07","0x404c2184a4027b0092C5877BC4599099cd63E62D","0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x1db563cf7b35cf687b25e71feee6a2df0386d53a

# Diff at Thu, 28 Mar 2024 09:03:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 16154924
- current block number: 19531595

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 16154924 (main branch discovery), not current.

```diff
    contract Hop Multisig (0x1ec078551A5ac8F0f51fAc57Ffc48Ea7d9A86E9d) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x9a20a42b5832a97ae4e72f7947abb45265c60c17
