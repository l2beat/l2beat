Generated with discovered.json: 0xe2c0ead4c004895b10243ab9c395650acc346721

# Diff at Wed, 21 Aug 2024 10:05:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xF5C9F957705bea56a7e806943f98F7777B995826"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xF5C9F957705bea56a7e806943f98F7777B995826","via":[]}]
    }
```

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5918481F777dBe437De249492B90AffB4e655de4","via":[]},{"permission":"upgrade","target":"0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B","via":[]}]
    }
```

Generated with discovered.json: 0xe5ece2e9f5ffb282153154a14ce8ec8b44dfdc3c

# Diff at Fri, 09 Aug 2024 10:12:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xF5C9F957705bea56a7e806943f98F7777B995826"]
      assignedPermissions.upgrade:
+        ["0xF5C9F957705bea56a7e806943f98F7777B995826"]
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8","0x59232aC80E6d403b6381393e52f4665ECA328558"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x0405107a60391Eb51821be373ff978115Ee58488","0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8","0x59232aC80E6d403b6381393e52f4665ECA328558"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x5997a7007bc82890b897625d799a049dfc967bbc

# Diff at Thu, 18 Jul 2024 10:33:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19825381
- current block number: 19825381

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825381 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0xF5C9F957705bea56a7e806943f98F7777B995826"]}
    }
```

Generated with discovered.json: 0xe1e57471108cba8fef54c3e5b37e123b2f2601ae

# Diff at Wed, 08 May 2024 12:36:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624875
- current block number: 19825381

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624875 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x879cD57975d596004863D30c59d579ef78BBbe32"
+        ["0x879cD57975d596004863D30c59d579ef78BBbe32"]
      values.getRegisteredVerifiers:
-        "0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"
+        ["0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"]
    }
```

Generated with discovered.json: 0x8802eb4ba9b21d4d40b220a280fa7f5d41020b63

# Diff at Wed, 10 Apr 2024 11:17:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19532199
- current block number: 19624875

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532199 (main branch discovery), not current.

```diff
    contract StarkExchange (0xF5C9F957705bea56a7e806943f98F7777B995826) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x879cD57975d596004863D30c59d579ef78BBbe32"]
+        "0x879cD57975d596004863D30c59d579ef78BBbe32"
      values.getRegisteredVerifiers:
-        ["0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"]
+        "0xbcc17446B99465fF01E6816d9bcb2d8b1D7cEdB1"
    }
```

Generated with discovered.json: 0xe8d8e3d4b8d168bfd406a7b9c31e4c9230626381

# Diff at Thu, 28 Mar 2024 11:06:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 17412704
- current block number: 19532199

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17412704 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xCc928977e4a75d25099e7DA7B6Fd79Dac2f9fD2B) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x67d53290cfc3cda8c8abe277975b804ba4a48718
