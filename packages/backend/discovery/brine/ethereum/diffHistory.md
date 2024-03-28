Generated with discovered.json: 0xb5850ddd61b2f05649c4fc15cdc1a99a42517d3d

# Diff at Wed, 06 Mar 2024 14:41:28 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cea88c5f3ff85fed5d72dadc72ae50315d0808d6 block: 18983727
- current block number: 19376792

## Description

Added the SHARP shared module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18983727 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6)
    +++ description: None
```

Generated with discovered.json: 0x0cd8c4cfa2d1f43c4656c004415ecaf6cdd32409

# Diff at Thu, 11 Jan 2024 12:36:15 GMT:

- author: torztomasz (<tomasz.torz@l2beat.com>)
- current block number: 18983651

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract StarkExchange (0x1390f521A79BaBE99b69B37154D63D431da27A07) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifierGovernorMultisig (0x21F9eC47b19d95b5C2DDFB6Ae5D4F92fAdacAEc4) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifierProxy (0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60) {
    }
```

```diff
+   Status: CREATED
    contract Committee (0x4F8B2dd49D958b6ac3e5f4705Bf1a9aDA5Bc4446) {
    }
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (0x5339AB7557b3152b91A57D10B0Caf5da88Db5143) {
    }
```

```diff
+   Status: CREATED
    contract SHARPVerifier (0x6cB3EE90C50a38A0e4662bB7e7E6e40B91361BF6) {
    }
```

```diff
+   Status: CREATED
    contract OrderRegistry (0x806d435a82B0381bD884540c2235147c13B97fe6) {
    }
```
