Generated with discovered.json: 0x39818d03c03b4a297f7eabe469fe9b7a93904687

# Diff at Wed, 20 Aug 2025 12:08:18 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@262b00e32d0a4e462cf5011a16f1fcaa9ed6d5a8 block: 1755018135
- current timestamp: 1755691670

## Description

Added 3 more signatures to Spiko permissions manager multisig.

## Watched changes

```diff
    contract SafeL2 (0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e) {
    +++ description: None
      values.$members.0:
+        "arb1:0x4D1d9C5B5d9Ca448194313D799De374f362Bd460"
      values.$members.1:
+        "arb1:0x6c00Be5d1013a5bca938EF6aa8F1E5e706FF384d"
      values.$members.2:
+        "arb1:0xDa47Bd72438F11bef7Cc54F18cd02426dd86A5a2"
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "2 of 6 (33%)"
    }
```

Generated with discovered.json: 0x12d9be24eab87516c871dd4294902e4225109e0b

# Diff at Mon, 14 Jul 2025 12:46:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 356266883
- current block number: 356266883

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 356266883 (main branch discovery), not current.

```diff
    EOA  (0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949) {
    +++ description: None
      address:
-        "0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949"
+        "arb1:0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949"
    }
```

```diff
    contract SafeL2 (0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e) {
    +++ description: None
      address:
-        "0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e"
+        "arb1:0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "arb1:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0xe67D2cbeaE3090bE017C66e7A6943961619a5D35"
+        "arb1:0xe67D2cbeaE3090bE017C66e7A6943961619a5D35"
      values.$members.1:
-        "0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011"
+        "arb1:0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011"
      values.$members.2:
-        "0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949"
+        "arb1:0x4896F23FF83242D8D4EB5fA1dEdF8c57e9145949"
      implementationNames.0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.arb1:0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e:
+        "SafeProxy"
      implementationNames.arb1:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011) {
    +++ description: None
      address:
-        "0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011"
+        "arb1:0xA6e06dfE42064B7Cd6DC902a62e74ca5Bb574011"
    }
```

```diff
    contract PermissionManager (0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A) {
    +++ description: None
      address:
-        "0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A"
+        "arb1:0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x344278aff344d6fb960705dc18a4912221608472"
+        "arb1:0x344278aff344d6fb960705dc18a4912221608472"
      values.$pastUpgrades.0.2.0:
-        "0x344278aff344d6fb960705dc18a4912221608472"
+        "arb1:0x344278aff344d6fb960705dc18a4912221608472"
+++ description: group 0 members are the full admins and can act via this contract. other groups are used as transfer whitelists for example.
      values.admins.0:
-        "0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e"
+        "arb1:0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e"
      implementationNames.0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A:
-        "ERC1967Proxy"
      implementationNames.0x344278aff344d6fb960705dc18a4912221608472:
-        "PermissionManager"
      implementationNames.arb1:0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A:
+        "ERC1967Proxy"
      implementationNames.arb1:0x344278aff344d6fb960705dc18a4912221608472:
+        "PermissionManager"
    }
```

```diff
    contract Spiko EU T-Bills Money Market Fund Token (0xCBeb19549054CC0a6257A77736FC78C367216cE7) {
    +++ description: None
      address:
-        "0xCBeb19549054CC0a6257A77736FC78C367216cE7"
+        "arb1:0xCBeb19549054CC0a6257A77736FC78C367216cE7"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80"
+        "arb1:0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80"
      values.$pastUpgrades.0.2.0:
-        "0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80"
+        "arb1:0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80"
      values.authority:
-        "0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A"
+        "arb1:0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A"
      values.eip712Domain.verifyingContract:
-        "0xCBeb19549054CC0a6257A77736FC78C367216cE7"
+        "arb1:0xCBeb19549054CC0a6257A77736FC78C367216cE7"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.trustedForwarder:
-        "0xd3f5f1524e1A472B51374A3ff41B8936EB5B658E"
+        "arb1:0xd3f5f1524e1A472B51374A3ff41B8936EB5B658E"
      implementationNames.0xCBeb19549054CC0a6257A77736FC78C367216cE7:
-        "ERC1967Proxy"
      implementationNames.0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80:
-        "Token"
      implementationNames.arb1:0xCBeb19549054CC0a6257A77736FC78C367216cE7:
+        "ERC1967Proxy"
      implementationNames.arb1:0xa0769f7A8fC65e47dE93797b4e21C073c117Fc80:
+        "Token"
    }
```

```diff
    EOA  (0xe67D2cbeaE3090bE017C66e7A6943961619a5D35) {
    +++ description: None
      address:
-        "0xe67D2cbeaE3090bE017C66e7A6943961619a5D35"
+        "arb1:0xe67D2cbeaE3090bE017C66e7A6943961619a5D35"
    }
```

```diff
+   Status: CREATED
    contract SafeL2 (0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionManager (0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Spiko EU T-Bills Money Market Fund Token (0xCBeb19549054CC0a6257A77736FC78C367216cE7)
    +++ description: None
```

Generated with discovered.json: 0xab188f78d2503d077764ec88a1786860064d36b4

# Diff at Thu, 10 Jul 2025 15:33:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 356266883

## Description

add EUTBL token.

## Initial discovery

```diff
+   Status: CREATED
    contract SafeL2 (0x7843225BA488cf780A4Fe2c842B5dc2aBCf8A03e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionManager (0xa925C217e4c1C82Ee721eBD496d3863D5C2d829A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Spiko EU T-Bills Money Market Fund Token (0xCBeb19549054CC0a6257A77736FC78C367216cE7)
    +++ description: None
```
