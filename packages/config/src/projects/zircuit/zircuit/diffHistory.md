Generated with discovered.json: 0x046614ecd46e0684cb01c6410fbd4abb06163f9f

# Diff at Thu, 10 Jul 2025 08:15:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b92b4c59c14c9cd2f4e072498dc1bcf695d33787 block: 15364203
- current block number: 15364203

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15364203 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: None
```

Generated with discovered.json: 0xbd450b3f35a7b0056ce53fc700a0d37142d8ba1f

# Diff at Mon, 23 Jun 2025 07:43:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 15364203

## Description

Initial discovery to check L1->L2 exclusions.

## Initial discovery

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: None
```
