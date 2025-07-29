Generated with discovered.json: 0xee85ddce444aaa0a2eab03b90f3a5f370c93e43f

# Diff at Mon, 14 Jul 2025 12:45:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21630407
- current block number: 21630407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630407 (main branch discovery), not current.

```diff
    contract Fuel Security Council (0x32da601374b38154f05904B16F44A1911Aa6f314) {
    +++ description: None
      address:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x7cdbF64f57f0D623D924d2b4c17664c1Cd9f93d4"
+        "eth:0x7cdbF64f57f0D623D924d2b4c17664c1Cd9f93d4"
      values.$members.1:
-        "0x8a34B78Feb23b97b5ccDf83D9aDC7669C34D346F"
+        "eth:0x8a34B78Feb23b97b5ccDf83D9aDC7669C34D346F"
      values.$members.2:
-        "0xAA52e167e8Ad426054DCF0fd5BD5481348F4FfC8"
+        "eth:0xAA52e167e8Ad426054DCF0fd5BD5481348F4FfC8"
      values.$members.3:
-        "0x76707a7F4b40ecFCc7431A3D7345Ef597ee7e306"
+        "eth:0x76707a7F4b40ecFCc7431A3D7345Ef597ee7e306"
      values.$members.4:
-        "0xd4c29D8ddC7D3E326030270f35d9FD4973AbBE09"
+        "eth:0xd4c29D8ddC7D3E326030270f35d9FD4973AbBE09"
      values.$members.5:
-        "0x5F5e0C904153789a9E978c286180b4191950d886"
+        "eth:0x5F5e0C904153789a9E978c286180b4191950d886"
      values.$members.6:
-        "0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc"
+        "eth:0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc"
      values.$members.7:
-        "0x515Fa9b26E195a043582377F51F9A9bAD2D10c7d"
+        "eth:0x515Fa9b26E195a043582377F51F9A9bAD2D10c7d"
      values.$members.8:
-        "0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
+        "eth:0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
      values.$members.9:
-        "0x9F7dfAb2222A473284205cdDF08a677726d786A0"
+        "eth:0x9F7dfAb2222A473284205cdDF08a677726d786A0"
      values.$members.10:
-        "0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
+        "eth:0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
      values.$members.11:
-        "0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
+        "eth:0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
      values.$members.12:
-        "0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
+        "eth:0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
      implementationNames.0x32da601374b38154f05904B16F44A1911Aa6f314:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x32da601374b38154f05904B16F44A1911Aa6f314:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x3e814Ba5e1FE40d3D1f6D31a1AF3A5E30E4129CD) {
    +++ description: None
      address:
-        "0x3e814Ba5e1FE40d3D1f6D31a1AF3A5E30E4129CD"
+        "eth:0x3e814Ba5e1FE40d3D1f6D31a1AF3A5E30E4129CD"
    }
```

```diff
    contract Safe (0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc) {
    +++ description: None
      address:
-        "0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc"
+        "eth:0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc"
      values.$implementation:
-        "0x41675C099F32341bf84BFc5382aF534df5C7461a"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
-        "0x698F7A879197Dd834c3203b470ddBadD6616A8bF"
+        "eth:0x698F7A879197Dd834c3203b470ddBadD6616A8bF"
      values.$members.1:
-        "0x3e814Ba5e1FE40d3D1f6D31a1AF3A5E30E4129CD"
+        "eth:0x3e814Ba5e1FE40d3D1f6D31a1AF3A5E30E4129CD"
      implementationNames.0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc:
-        "SafeProxy"
      implementationNames.0x41675C099F32341bf84BFc5382aF534df5C7461a:
-        "Safe"
      implementationNames.eth:0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc:
+        "SafeProxy"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

```diff
    EOA  (0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e) {
    +++ description: None
      address:
-        "0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e"
+        "eth:0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e"
    }
```

```diff
    EOA  (0x515Fa9b26E195a043582377F51F9A9bAD2D10c7d) {
    +++ description: None
      address:
-        "0x515Fa9b26E195a043582377F51F9A9bAD2D10c7d"
+        "eth:0x515Fa9b26E195a043582377F51F9A9bAD2D10c7d"
    }
```

```diff
    EOA  (0x5F5e0C904153789a9E978c286180b4191950d886) {
    +++ description: None
      address:
-        "0x5F5e0C904153789a9E978c286180b4191950d886"
+        "eth:0x5F5e0C904153789a9E978c286180b4191950d886"
    }
```

```diff
    EOA  (0x698F7A879197Dd834c3203b470ddBadD6616A8bF) {
    +++ description: None
      address:
-        "0x698F7A879197Dd834c3203b470ddBadD6616A8bF"
+        "eth:0x698F7A879197Dd834c3203b470ddBadD6616A8bF"
    }
```

```diff
    EOA  (0x76707a7F4b40ecFCc7431A3D7345Ef597ee7e306) {
    +++ description: None
      address:
-        "0x76707a7F4b40ecFCc7431A3D7345Ef597ee7e306"
+        "eth:0x76707a7F4b40ecFCc7431A3D7345Ef597ee7e306"
    }
```

```diff
    EOA  (0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd) {
    +++ description: None
      address:
-        "0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
+        "eth:0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
    }
```

```diff
    EOA  (0x7cdbF64f57f0D623D924d2b4c17664c1Cd9f93d4) {
    +++ description: None
      address:
-        "0x7cdbF64f57f0D623D924d2b4c17664c1Cd9f93d4"
+        "eth:0x7cdbF64f57f0D623D924d2b4c17664c1Cd9f93d4"
    }
```

```diff
    EOA  (0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6) {
    +++ description: None
      address:
-        "0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
+        "eth:0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
    }
```

```diff
    EOA  (0x83dC58504D1d2276Bc8D9Cf01d0B341D84A49cfF) {
    +++ description: None
      address:
-        "0x83dC58504D1d2276Bc8D9Cf01d0B341D84A49cfF"
+        "eth:0x83dC58504D1d2276Bc8D9Cf01d0B341D84A49cfF"
    }
```

```diff
    EOA  (0x8a34B78Feb23b97b5ccDf83D9aDC7669C34D346F) {
    +++ description: None
      address:
-        "0x8a34B78Feb23b97b5ccDf83D9aDC7669C34D346F"
+        "eth:0x8a34B78Feb23b97b5ccDf83D9aDC7669C34D346F"
    }
```

```diff
    EOA  (0x958470a2ADe72b7a01A2e160F3286767b9623Ad7) {
    +++ description: None
      address:
-        "0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
+        "eth:0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
    }
```

```diff
    EOA  (0x9F7dfAb2222A473284205cdDF08a677726d786A0) {
    +++ description: None
      address:
-        "0x9F7dfAb2222A473284205cdDF08a677726d786A0"
+        "eth:0x9F7dfAb2222A473284205cdDF08a677726d786A0"
    }
```

```diff
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67) {
    +++ description: None
      address:
-        "0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67"
+        "eth:0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"
+        "eth:0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"
      values.$pastUpgrades.0.2.0:
-        "0xB3109036813ff48E523Cef3818438e64ee04069d"
+        "eth:0xB3109036813ff48E523Cef3818438e64ee04069d"
      values.$pastUpgrades.1.2.0:
-        "0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"
+        "eth:0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e"
+        "eth:0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e"
      values.accessControl.PAUSER_ROLE.members.1:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.accessControl.PAUSER_ROLE.members.2:
-        "0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
+        "eth:0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
      values.accessControl.PAUSER_ROLE.members.3:
-        "0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
+        "eth:0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
      values.accessControl.PAUSER_ROLE.members.4:
-        "0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
+        "eth:0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
      values.accessControl.PAUSER_ROLE.members.5:
-        "0x9F7dfAb2222A473284205cdDF08a677726d786A0"
+        "eth:0x9F7dfAb2222A473284205cdDF08a677726d786A0"
      values.accessControl.PAUSER_ROLE.members.6:
-        "0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
+        "eth:0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
      values.accessControl.PAUSER_ROLE.members.7:
-        "0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e"
+        "eth:0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e"
      values.accessControl.PAUSER_ROLE.members.8:
-        "0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C"
+        "eth:0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C"
      values.accessControl.SET_RATE_LIMITER_ROLE.members.0:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.fuelMessagePortal:
-        "0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf"
+        "eth:0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf"
      implementationNames.0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67:
-        "ERC1967Proxy"
      implementationNames.0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab:
-        "FuelERC20GatewayV4"
      implementationNames.eth:0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67:
+        "ERC1967Proxy"
      implementationNames.eth:0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab:
+        "FuelERC20GatewayV4"
    }
```

```diff
    EOA  (0xAA52e167e8Ad426054DCF0fd5BD5481348F4FfC8) {
    +++ description: None
      address:
-        "0xAA52e167e8Ad426054DCF0fd5BD5481348F4FfC8"
+        "eth:0xAA52e167e8Ad426054DCF0fd5BD5481348F4FfC8"
    }
```

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      address:
-        "0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf"
+        "eth:0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x2C4df10a82CF077122eD99573acA6daCd76F2E67"
+        "eth:0x2C4df10a82CF077122eD99573acA6daCd76F2E67"
      values.$pastUpgrades.0.2.0:
-        "0x5A725F508659F9846E5877E8625F9ea32B57d577"
+        "eth:0x5A725F508659F9846E5877E8625F9ea32B57d577"
      values.$pastUpgrades.1.2.0:
-        "0x6d67857224F66d7A677f063B861B6BACafB10639"
+        "eth:0x6d67857224F66d7A677f063B861B6BACafB10639"
      values.$pastUpgrades.2.2.0:
-        "0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"
+        "eth:0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"
      values.$pastUpgrades.3.2.0:
-        "0x2C4df10a82CF077122eD99573acA6daCd76F2E67"
+        "eth:0x2C4df10a82CF077122eD99573acA6daCd76F2E67"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e"
+        "eth:0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e"
      values.accessControl.PAUSER_ROLE.members.1:
-        "0xe7d56c84cEA9b58569fdfe8863085207F9a14881"
+        "eth:0xe7d56c84cEA9b58569fdfe8863085207F9a14881"
      values.accessControl.PAUSER_ROLE.members.2:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.accessControl.PAUSER_ROLE.members.3:
-        "0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
+        "eth:0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
      values.accessControl.PAUSER_ROLE.members.4:
-        "0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
+        "eth:0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
      values.accessControl.PAUSER_ROLE.members.5:
-        "0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
+        "eth:0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
      values.accessControl.PAUSER_ROLE.members.6:
-        "0x9F7dfAb2222A473284205cdDF08a677726d786A0"
+        "eth:0x9F7dfAb2222A473284205cdDF08a677726d786A0"
      values.accessControl.PAUSER_ROLE.members.7:
-        "0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
+        "eth:0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
      values.accessControl.PAUSER_ROLE.members.8:
-        "0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e"
+        "eth:0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e"
      values.accessControl.PAUSER_ROLE.members.9:
-        "0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C"
+        "eth:0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C"
      values.accessControl.SET_RATE_LIMITER_ROLE.members.0:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.fuelChainStateContract:
-        "0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130"
+        "eth:0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130"
      implementationNames.0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf:
-        "ERC1967Proxy"
      implementationNames.0x2C4df10a82CF077122eD99573acA6daCd76F2E67:
-        "FuelMessagePortalV3"
      implementationNames.eth:0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf:
+        "ERC1967Proxy"
      implementationNames.eth:0x2C4df10a82CF077122eD99573acA6daCd76F2E67:
+        "FuelMessagePortalV3"
    }
```

```diff
    EOA  (0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2) {
    +++ description: None
      address:
-        "0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
+        "eth:0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
    }
```

```diff
    EOA  (0xd4c29D8ddC7D3E326030270f35d9FD4973AbBE09) {
    +++ description: None
      address:
-        "0xd4c29D8ddC7D3E326030270f35d9FD4973AbBE09"
+        "eth:0xd4c29D8ddC7D3E326030270f35d9FD4973AbBE09"
    }
```

```diff
    EOA  (0xe7d56c84cEA9b58569fdfe8863085207F9a14881) {
    +++ description: None
      address:
-        "0xe7d56c84cEA9b58569fdfe8863085207F9a14881"
+        "eth:0xe7d56c84cEA9b58569fdfe8863085207F9a14881"
    }
```

```diff
    EOA  (0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e) {
    +++ description: None
      address:
-        "0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e"
+        "eth:0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e"
    }
```

```diff
    EOA Sequencer (0xEA0337EFC12e98AB118948dA570C07691E8E4b37) {
    +++ description: None
      address:
-        "0xEA0337EFC12e98AB118948dA570C07691E8E4b37"
+        "eth:0xEA0337EFC12e98AB118948dA570C07691E8E4b37"
    }
```

```diff
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130) {
    +++ description: None
      address:
-        "0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130"
+        "eth:0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x725B2b1a15D818E1f25c68be77816802e6036559"
+        "eth:0x725B2b1a15D818E1f25c68be77816802e6036559"
      values.$pastUpgrades.0.2.0:
-        "0x725B2b1a15D818E1f25c68be77816802e6036559"
+        "eth:0x725B2b1a15D818E1f25c68be77816802e6036559"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.accessControl.PAUSER_ROLE.members.0:
-        "0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e"
+        "eth:0xE7DCFE1B21D4b9899A80Dc67847e03830a88585e"
      values.accessControl.PAUSER_ROLE.members.1:
-        "0xe7d56c84cEA9b58569fdfe8863085207F9a14881"
+        "eth:0xe7d56c84cEA9b58569fdfe8863085207F9a14881"
      values.accessControl.PAUSER_ROLE.members.2:
-        "0x32da601374b38154f05904B16F44A1911Aa6f314"
+        "eth:0x32da601374b38154f05904B16F44A1911Aa6f314"
      values.accessControl.PAUSER_ROLE.members.3:
-        "0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
+        "eth:0x958470a2ADe72b7a01A2e160F3286767b9623Ad7"
      values.accessControl.PAUSER_ROLE.members.4:
-        "0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
+        "eth:0x81ACA96D4Ae0932d2F3463a043392efcCB1F05b6"
      values.accessControl.PAUSER_ROLE.members.5:
-        "0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
+        "eth:0x796C3f536C6bf5CB7661C9A0570da0e1ECD303Dd"
      values.accessControl.PAUSER_ROLE.members.6:
-        "0x9F7dfAb2222A473284205cdDF08a677726d786A0"
+        "eth:0x9F7dfAb2222A473284205cdDF08a677726d786A0"
      values.accessControl.PAUSER_ROLE.members.7:
-        "0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
+        "eth:0xC8Bd2Ead61e54C53C5A1836352c29F10383FBad2"
      values.accessControl.PAUSER_ROLE.members.8:
-        "0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e"
+        "eth:0x45aa9fF818Ffaca57CA31b1C624b2a8CBF5B417e"
      values.accessControl.PAUSER_ROLE.members.9:
-        "0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C"
+        "eth:0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C"
      values.accessControl.COMMITTER_ROLE.members.0:
-        "0x83dC58504D1d2276Bc8D9Cf01d0B341D84A49cfF"
+        "eth:0x83dC58504D1d2276Bc8D9Cf01d0B341D84A49cfF"
      implementationNames.0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130:
-        "ERC1967Proxy"
      implementationNames.0x725B2b1a15D818E1f25c68be77816802e6036559:
-        "FuelChainState"
      implementationNames.eth:0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130:
+        "ERC1967Proxy"
      implementationNames.eth:0x725B2b1a15D818E1f25c68be77816802e6036559:
+        "FuelChainState"
    }
```

```diff
    EOA  (0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C) {
    +++ description: None
      address:
-        "0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C"
+        "eth:0xf88b0247e611eE5af8Cf98f5303769Cba8e7177C"
    }
```

```diff
+   Status: CREATED
    contract Fuel Security Council (0x32da601374b38154f05904B16F44A1911Aa6f314)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130)
    +++ description: None
```

Generated with discovered.json: 0x8d508883bcc7966363ecc4a3400a79eebec4871e

# Diff at Tue, 18 Mar 2025 08:12:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21630407
- current block number: 21630407

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630407 (main branch discovery), not current.

```diff
    contract Fuel Security Council (0x32da601374b38154f05904B16F44A1911Aa6f314) {
    +++ description: None
      name:
-        "FuelSecurityCouncil"
+        "Fuel Security Council"
    }
```

Generated with discovered.json: 0x42da0cba8414b4b9ce24c5e228be54af50bc8257

# Diff at Tue, 04 Mar 2025 10:39:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21630407
- current block number: 21630407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630407 (main branch discovery), not current.

```diff
    contract FuelSecurityCouncil (0x32da601374b38154f05904B16F44A1911Aa6f314) {
    +++ description: None
      sinceBlock:
+        20682521
    }
```

```diff
    contract Safe (0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc) {
    +++ description: None
      sinceBlock:
+        20871672
    }
```

```diff
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67) {
    +++ description: None
      sinceBlock:
+        20678194
    }
```

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      sinceBlock:
+        20620434
    }
```

```diff
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130) {
    +++ description: None
      sinceBlock:
+        20620432
    }
```

Generated with discovered.json: 0xdeb7afb89024e7b82826cafae6ba6c3066ed213d

# Diff at Wed, 15 Jan 2025 14:14:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6fd163e76ba309fea8e407a192deb4ec99f21cb3 block: 21242136
- current block number: 21630407

## Description

add SC ref link (for FE).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242136 (main branch discovery), not current.

```diff
    contract FuelSecurityCouncil (0x32da601374b38154f05904B16F44A1911Aa6f314) {
    +++ description: None
      name:
-        "FuelMultisig"
+        "FuelSecurityCouncil"
      references:
+        [{"text":"Security Council members - Fuel Ignition docs","href":"https://docs.fuel.network/docs/verified-addresses/security-council/#fuel-bridge-security-council"}]
    }
```

Generated with discovered.json: 0x0aa7eda5ee0e248498c60090e58c072b12ce9d7c

# Diff at Tue, 10 Dec 2024 10:38:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21242136
- current block number: 21242136

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242136 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract Safe (0x446f9d40cA491cf0788dacCAc4D16d5d8B4015Cc)
    +++ description: None
```

Generated with discovered.json: 0x70d033c244b9a3911ab8c9186130eef9eb73c1de

# Diff at Thu, 28 Nov 2024 11:02:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21242136
- current block number: 21242136

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21242136 (main branch discovery), not current.

```diff
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

```diff
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x0000000000000000000000000000000000000000","via":[]}]
    }
```

Generated with discovered.json: 0xb9110d5bef6827cbde4e44ce9b9526bb90bac6ca

# Diff at Fri, 22 Nov 2024 08:40:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@292f23170122adf00047246ebc612907f3cba48f block: 21064224
- current block number: 21242136

## Description

Upgrade FuelMessagePortal to the same contract code but with a higher (max) global deposit limit. (immutable)

## Watched changes

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      values.$implementation:
-        "0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"
+        "0x2C4df10a82CF077122eD99573acA6daCd76F2E67"
      values.$pastUpgrades.3:
+        ["2024-11-21T15:58:47.000Z","0x13b86e46d736db66212cf6a47b0328b72dbd2b769c8f55a00eb1dbaa3427d94b",["0x2C4df10a82CF077122eD99573acA6daCd76F2E67"]]
      values.$upgradeCount:
-        3
+        4
      values.depositLimitGlobal:
-        "19572000000000000000000"
+        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    }
```

Generated with discovered.json: 0xca8ef6b0cd851905c181a9094d4c17e2e9b3a188

# Diff at Mon, 28 Oct 2024 12:47:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@00bd1d18460d612b1f06ce2339854c105cd41bd5 block: 21027362
- current block number: 21064224

## Description

Withdrawal limit for the ETH escrow raised to 7829 ETH or USD ~20M. Current contract TVL is USD 39M.

## Watched changes

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      values.limitAmount:
-        "10000000000000000000"
+        "7829000000000000000000"
    }
```

Generated with discovered.json: 0x1f17ce4ea058b80f90b7ed862c7a76b29124680c

# Diff at Wed, 23 Oct 2024 09:22:40 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bee92b0fa40ee8d5d78edc1795596573ca81f3da block: 21018722
- current block number: 21027362

## Description

Discovery changes, not project related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21018722 (main branch discovery), not current.

```diff
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"]
      values.$pastUpgrades.1.1:
-        ["0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"]
+        "0x03ab218eccdc5ead9a29b416f9279a9c70f24a34191a949d3448856e0b570a79"
      values.$pastUpgrades.0.2:
+        ["0xB3109036813ff48E523Cef3818438e64ee04069d"]
      values.$pastUpgrades.0.1:
-        ["0xB3109036813ff48E523Cef3818438e64ee04069d"]
+        "0x57fd18a56dc2962a59b2404aedf837e4168c2487750d1f670563ec70066a62f8"
    }
```

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"]
      values.$pastUpgrades.2.1:
-        ["0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"]
+        "0x03ab218eccdc5ead9a29b416f9279a9c70f24a34191a949d3448856e0b570a79"
      values.$pastUpgrades.1.2:
+        ["0x6d67857224F66d7A677f063B861B6BACafB10639"]
      values.$pastUpgrades.1.1:
-        ["0x6d67857224F66d7A677f063B861B6BACafB10639"]
+        "0xe79d42f297676dabd168e8f151e59c4d9d6a25f364cb098eb01273d173a8dd19"
      values.$pastUpgrades.0.2:
+        ["0x5A725F508659F9846E5877E8625F9ea32B57d577"]
      values.$pastUpgrades.0.1:
-        ["0x5A725F508659F9846E5877E8625F9ea32B57d577"]
+        "0xa06594153f87c4313fe3c5dd702cb063072dd438bac45b89b439ed7447b6ea9f"
    }
```

```diff
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x725B2b1a15D818E1f25c68be77816802e6036559"]
      values.$pastUpgrades.0.1:
-        ["0x725B2b1a15D818E1f25c68be77816802e6036559"]
+        "0x01e63713a7ddee90866f272b7afb1d49aea17ed314edc7a80d00af36fd9b640a"
    }
```

Generated with discovered.json: 0xb3aafb67c193ee8b52962fef7477d8f11b7990a6

# Diff at Tue, 22 Oct 2024 04:26:48 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e1eb5ddbb52263f225cefdf56b14642184edf59a block: 20984946
- current block number: 21018722

## Description

"Security Council" threshold update. Members not public yet.

## Watched changes

```diff
    contract FuelMultisig (0x32da601374b38154f05904B16F44A1911Aa6f314) {
    +++ description: None
      values.$threshold:
-        9
+        10
      values.multisigThreshold:
-        "9 of 13 (69%)"
+        "10 of 13 (77%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20984946 (main branch discovery), not current.

```diff
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67) {
    +++ description: None
      values.$pastUpgrades.1.2:
-        ["0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"]
      values.$pastUpgrades.1.1:
-        "0x03ab218eccdc5ead9a29b416f9279a9c70f24a34191a949d3448856e0b570a79"
+        ["0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"]
      values.$pastUpgrades.0.2:
-        ["0xB3109036813ff48E523Cef3818438e64ee04069d"]
      values.$pastUpgrades.0.1:
-        "0x57fd18a56dc2962a59b2404aedf837e4168c2487750d1f670563ec70066a62f8"
+        ["0xB3109036813ff48E523Cef3818438e64ee04069d"]
    }
```

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      values.$pastUpgrades.2.2:
-        ["0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"]
      values.$pastUpgrades.2.1:
-        "0x03ab218eccdc5ead9a29b416f9279a9c70f24a34191a949d3448856e0b570a79"
+        ["0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"]
      values.$pastUpgrades.1.2:
-        ["0x6d67857224F66d7A677f063B861B6BACafB10639"]
      values.$pastUpgrades.1.1:
-        "0xe79d42f297676dabd168e8f151e59c4d9d6a25f364cb098eb01273d173a8dd19"
+        ["0x6d67857224F66d7A677f063B861B6BACafB10639"]
      values.$pastUpgrades.0.2:
-        ["0x5A725F508659F9846E5877E8625F9ea32B57d577"]
      values.$pastUpgrades.0.1:
-        "0xa06594153f87c4313fe3c5dd702cb063072dd438bac45b89b439ed7447b6ea9f"
+        ["0x5A725F508659F9846E5877E8625F9ea32B57d577"]
    }
```

```diff
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130) {
    +++ description: None
      values.$pastUpgrades.0.2:
-        ["0x725B2b1a15D818E1f25c68be77816802e6036559"]
      values.$pastUpgrades.0.1:
-        "0x01e63713a7ddee90866f272b7afb1d49aea17ed314edc7a80d00af36fd9b640a"
+        ["0x725B2b1a15D818E1f25c68be77816802e6036559"]
    }
```

Generated with discovered.json: 0x5ac2c20dbaba0fd287add792ec0c9a1acd25c8d0

# Diff at Mon, 21 Oct 2024 11:06:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20984946
- current block number: 20984946

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20984946 (main branch discovery), not current.

```diff
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"]
      values.$pastUpgrades.1.1:
-        ["0xdE2D792ca3C4d02DE3CE1cD1456d8D0990cC3fab"]
+        "0x03ab218eccdc5ead9a29b416f9279a9c70f24a34191a949d3448856e0b570a79"
      values.$pastUpgrades.0.2:
+        ["0xB3109036813ff48E523Cef3818438e64ee04069d"]
      values.$pastUpgrades.0.1:
-        ["0xB3109036813ff48E523Cef3818438e64ee04069d"]
+        "0x57fd18a56dc2962a59b2404aedf837e4168c2487750d1f670563ec70066a62f8"
    }
```

```diff
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"]
      values.$pastUpgrades.2.1:
-        ["0x05f886DDeE0FE07496f6e38b0e140F8eF4655B16"]
+        "0x03ab218eccdc5ead9a29b416f9279a9c70f24a34191a949d3448856e0b570a79"
      values.$pastUpgrades.1.2:
+        ["0x6d67857224F66d7A677f063B861B6BACafB10639"]
      values.$pastUpgrades.1.1:
-        ["0x6d67857224F66d7A677f063B861B6BACafB10639"]
+        "0xe79d42f297676dabd168e8f151e59c4d9d6a25f364cb098eb01273d173a8dd19"
      values.$pastUpgrades.0.2:
+        ["0x5A725F508659F9846E5877E8625F9ea32B57d577"]
      values.$pastUpgrades.0.1:
-        ["0x5A725F508659F9846E5877E8625F9ea32B57d577"]
+        "0xa06594153f87c4313fe3c5dd702cb063072dd438bac45b89b439ed7447b6ea9f"
    }
```

```diff
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x725B2b1a15D818E1f25c68be77816802e6036559"]
      values.$pastUpgrades.0.1:
-        ["0x725B2b1a15D818E1f25c68be77816802e6036559"]
+        "0x01e63713a7ddee90866f272b7afb1d49aea17ed314edc7a80d00af36fd9b640a"
    }
```

Generated with discovered.json: 0xca6d885f4f2c9a75dafa947282ee00109aa3a5ef

# Diff at Thu, 17 Oct 2024 11:20:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20984946

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract FuelMultisig (0x32da601374b38154f05904B16F44A1911Aa6f314)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelERC20Gateway (0xa4cA04d02bfdC3A2DF56B9b6994520E69dF43F67)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelMessagePortal (0xAEB0c00D0125A8a788956ade4f4F12Ead9f65DDf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FuelChainState (0xf3D20Db1D16A4D0ad2f280A5e594FF3c7790f130)
    +++ description: None
```
