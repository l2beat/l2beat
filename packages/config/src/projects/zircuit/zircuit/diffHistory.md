Generated with discovered.json: 0x6c419d61eba851803a53aff30c925fa6172cb44e

# Diff at Thu, 31 Jul 2025 13:15:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1753687757
- current timestamp: 1753687757

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753687757 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      unverified:
-        true
      values.getOwners:
-        ["zircuit:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4","zircuit:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966","zircuit:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355","zircuit:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4","zircuit:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec","zircuit:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb","zircuit:0x62C688FCa995e07632D64A9586896BB7EcD68567","zircuit:0x38809210f69ed6204E276d2Be6b15cd530698679"]
      values.getThreshold:
-        6
      implementationNames.zircuit:0xC463EaC02572CC964D43D2414023E2c6B62bAF38:
-        ""
+        "GnosisSafeProxy"
      template:
+        "GnosisSafe"
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x430dcebe337cfb1b23b1da86a905add435c1776a

# Diff at Mon, 28 Jul 2025 07:29:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 15364203
- current block number: 16875771

## Description

L2 fee changes.

## Watched changes

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.basefee:
-        602997202
+        294515603
      values.hash:
-        "0x860409be6049dd06c3bfe74926a7a552c3277fdd865315938507dfb5731814cc"
+        "0x0acc928251b1f6dcdad1a042f1be37ab222eeed394619e6908a57a99301cf5ae"
      values.number:
-        22765716
+        23016159
      values.timestamp:
-        1750664615
+        1753687751
    }
```

Generated with discovered.json: 0xbe1c0bf13bbb959e2231e3043e80b7581c02f432

# Diff at Mon, 14 Jul 2025 12:47:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 15364203
- current block number: 15364203

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15364203 (main branch discovery), not current.

```diff
    EOA  (0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb) {
    +++ description: None
      address:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "zircuit:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
    }
```

```diff
    EOA  (0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec) {
    +++ description: None
      address:
-        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
+        "zircuit:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
    }
```

```diff
    EOA  (0x38809210f69ed6204E276d2Be6b15cd530698679) {
    +++ description: None
      address:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "zircuit:0x38809210f69ed6204E276d2Be6b15cd530698679"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      address:
-        "0x4200000000000000000000000000000000000015"
+        "zircuit:0x4200000000000000000000000000000000000015"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "zircuit:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "zircuit:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.$pastUpgrades.0.2.0:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "zircuit:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.DEPOSITOR_ACCOUNT:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "zircuit:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
      implementationNames.0x4200000000000000000000000000000000000015:
-        "Proxy"
      implementationNames.0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
-        "L1Block"
      implementationNames.zircuit:0x4200000000000000000000000000000000000015:
+        "Proxy"
      implementationNames.zircuit:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
+        "L1Block"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      address:
-        "0x4200000000000000000000000000000000000018"
+        "zircuit:0x4200000000000000000000000000000000000018"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "zircuit:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
+        "zircuit:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
      values.owner:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "zircuit:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      implementationNames.0x4200000000000000000000000000000000000018:
-        "Proxy"
      implementationNames.0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
-        "ProxyAdmin"
      implementationNames.zircuit:0x4200000000000000000000000000000000000018:
+        "Proxy"
      implementationNames.zircuit:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4) {
    +++ description: None
      address:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "zircuit:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
    }
```

```diff
    EOA  (0x62C688FCa995e07632D64A9586896BB7EcD68567) {
    +++ description: None
      address:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "zircuit:0x62C688FCa995e07632D64A9586896BB7EcD68567"
    }
```

```diff
    EOA  (0x63cbB9fA540F6249AE4A3576f48BF07609b3a355) {
    +++ description: None
      address:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "zircuit:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
    }
```

```diff
    EOA  (0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966) {
    +++ description: None
      address:
-        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
+        "zircuit:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
    }
```

```diff
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      address:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "zircuit:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      values.$implementation:
-        "0x69f4D1788e39c87893C980c06EdF4b7f686e2938"
+        "zircuit:0x69f4D1788e39c87893C980c06EdF4b7f686e2938"
      values.$members.0:
-        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
+        "zircuit:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
      values.$members.1:
-        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
+        "zircuit:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
      values.$members.2:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "zircuit:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.$members.3:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "zircuit:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.$members.4:
-        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
+        "zircuit:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
      values.$members.5:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "zircuit:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.$members.6:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "zircuit:0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.$members.7:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "zircuit:0x38809210f69ed6204E276d2Be6b15cd530698679"
      values.getOwners.0:
-        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
+        "zircuit:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
      values.getOwners.1:
-        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
+        "zircuit:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
      values.getOwners.2:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "zircuit:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.getOwners.3:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "zircuit:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.getOwners.4:
-        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
+        "zircuit:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
      values.getOwners.5:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "zircuit:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.getOwners.6:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "zircuit:0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.getOwners.7:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "zircuit:0x38809210f69ed6204E276d2Be6b15cd530698679"
      implementationNames.0xC463EaC02572CC964D43D2414023E2c6B62bAF38:
-        ""
      implementationNames.0x69f4D1788e39c87893C980c06EdF4b7f686e2938:
-        "GnosisSafe"
      implementationNames.zircuit:0xC463EaC02572CC964D43D2414023E2c6B62bAF38:
+        ""
      implementationNames.zircuit:0x69f4D1788e39c87893C980c06EdF4b7f686e2938:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4) {
    +++ description: None
      address:
-        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
+        "zircuit:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
    }
```

```diff
    EOA  (0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001) {
    +++ description: None
      address:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "zircuit:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
    }
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
