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
