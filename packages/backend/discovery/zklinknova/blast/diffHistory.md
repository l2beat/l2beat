Generated with discovered.json: 0x07d235a5bfd9154b2b77e5ce71d976492c259e26

# Diff at Fri, 09 Aug 2024 10:15:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 5983401
- current block number: 5983401

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 5983401 (main branch discovery), not current.

```diff
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD","0x3f64e2e09732969813904a8473074CFADeE66AF1"]
      assignedPermissions.upgrade:
+        ["0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD","0x3f64e2e09732969813904a8473074CFADeE66AF1"]
      values.$multisigThreshold:
-        "6 of 8 (75%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"]
      values.getThreshold:
-        6
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 8 (75%)"
    }
```

```diff
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"]
      assignedPermissions.upgrade:
+        ["0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b"]
    }
```

Generated with discovered.json: 0xb86797b97573e6d0defa28430623799a7e5e5952

# Diff at Thu, 04 Jul 2024 14:10:31 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 5646203

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract zkLink (0x29BA92Fe724beD5c5EBfd0099F2F64a6DC5078FD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastL2Gateway (0x3f64e2e09732969813904a8473074CFADeE66AF1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastOwner (0x730200f698cc8Ff16C00F4E8520Fd780B916D50E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x8Df0c2bA3916bF4789c50dEc5A79b2fc719F500b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BlastProxyAdmin (0xB5111Bda1E59b220d0Cf8D519CEDac46cb3B4c19)
    +++ description: None
```
