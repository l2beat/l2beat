Generated with discovered.json: 0x98ae8aae2c09a4a4c7ec4db1638ab9aa4b9109ff

# Diff at Thu, 28 Mar 2024 11:34:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 21838858
- current block number: 24791025

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21838858 (main branch discovery), not current.

```diff
    contract OpticsV2Governor (0x070c2843402Aa0637ae0F2E2edf601aAB5E72509) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0xe0eb643589af786ceaa130d75b2bd202d54100f7

# Diff at Mon, 09 Oct 2023 14:48:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Multisig that can upgrade Optics V2 contracts across domains.

## Watched changes

```diff
+   Status: CREATED
    contract OpticsV2Governor (0x070c2843402Aa0637ae0F2E2edf601aAB5E72509) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0x5A4E9B127183130b1814858F6ca5d1B1c6d799Ee) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0x5EE2BA07742D9276b2F51Ee4AD949016b7F164c1) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0x913EE05036f3cbc94Ee4afDea87ceb430524648a) {
    }
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0xaa099aF87ACE9E437b9B410a687F263eeaeC4321) {
    }
```

```diff
+   Status: CREATED
    contract BeaconProxy (0xd13aC1024d266B73180cA7445Ca0E78b3Acfe8CE) {
    }
```
