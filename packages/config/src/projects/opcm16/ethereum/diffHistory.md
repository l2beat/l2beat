Generated with discovered.json: 0xbe9d9388114d5da4d04cc4ae1b2dd250bcbf8e00

# Diff at Mon, 14 Jul 2025 12:45:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22896167
- current block number: 22896167

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22896167 (main branch discovery), not current.

```diff
    contract OPContractsManagerInteropMigrator (0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A) {
    +++ description: None
      address:
-        "0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A"
+        "eth:0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A"
      values.blueprints.addressManager:
-        "0x765c6637a370595845F637739279C353484a26A6"
+        "eth:0x765c6637a370595845F637739279C353484a26A6"
      values.blueprints.proxy:
-        "0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
+        "eth:0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
      values.blueprints.proxyAdmin:
-        "0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
+        "eth:0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
      values.blueprints.l1ChugSplashProxy:
-        "0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
+        "eth:0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
      values.blueprints.resolvedDelegateProxy:
-        "0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
+        "eth:0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
      values.blueprints.permissionedDisputeGame1:
-        "0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
+        "eth:0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
      values.blueprints.permissionedDisputeGame2:
-        "0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
+        "eth:0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
      values.blueprints.permissionlessDisputeGame1:
-        "0x065E5D14a280701C054D5a6A67f31F228233B823"
+        "eth:0x065E5D14a280701C054D5a6A67f31F228233B823"
      values.blueprints.permissionlessDisputeGame2:
-        "0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
+        "eth:0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
      values.blueprints.superPermissionedDisputeGame1:
-        "0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
+        "eth:0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
      values.blueprints.superPermissionedDisputeGame2:
-        "0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
+        "eth:0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
      values.blueprints.superPermissionlessDisputeGame1:
-        "0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
+        "eth:0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
      values.blueprints.superPermissionlessDisputeGame2:
-        "0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
+        "eth:0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
      values.contractsContainer:
-        "0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
+        "eth:0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
      values.implementations.superchainConfigImpl:
-        "0xCe28685EB204186b557133766eCA00334EB441E4"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.implementations.protocolVersionsImpl:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.implementations.l1ERC721BridgeImpl:
-        "0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.implementations.optimismPortalImpl:
-        "0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.implementations.ethLockboxImpl:
-        "0x784d2F03593A42A6E4676A012762F18775ecbBe6"
+        "eth:0x784d2F03593A42A6E4676A012762F18775ecbBe6"
      values.implementations.systemConfigImpl:
-        "0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.implementations.optimismMintableERC20FactoryImpl:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.implementations.l1CrossDomainMessengerImpl:
-        "0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.implementations.l1StandardBridgeImpl:
-        "0x44AfB7722AF276A601D524F429016A18B6923df0"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.implementations.disputeGameFactoryImpl:
-        "0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.implementations.anchorStateRegistryImpl:
-        "0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
+        "eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
      values.implementations.delayedWETHImpl:
-        "0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
+        "eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
      values.implementations.mipsImpl:
-        "0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
+        "eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
      implementationNames.0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A:
-        "OPContractsManagerInteropMigrator"
      implementationNames.eth:0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A:
+        "OPContractsManagerInteropMigrator"
    }
```

```diff
    contract  (0x065E5D14a280701C054D5a6A67f31F228233B823) {
    +++ description: None
      address:
-        "0x065E5D14a280701C054D5a6A67f31F228233B823"
+        "eth:0x065E5D14a280701C054D5a6A67f31F228233B823"
      implementationNames.0x065E5D14a280701C054D5a6A67f31F228233B823:
-        ""
      implementationNames.eth:0x065E5D14a280701C054D5a6A67f31F228233B823:
+        ""
    }
```

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      values.GnosisSafe_modules.0:
-        "0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
+        "eth:0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B"
      implementationNames.0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract  (0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62) {
    +++ description: None
      address:
-        "0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
+        "eth:0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
      implementationNames.0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62:
-        ""
      implementationNames.eth:0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62:
+        ""
    }
```

```diff
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      address:
-        "0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
+        "eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
      implementationNames.0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3:
-        "PreimageOracle"
      implementationNames.eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3:
+        "PreimageOracle"
    }
```

```diff
    contract  (0x2538DA6A2862914Fd87CE8E88FF133f81c289F80) {
    +++ description: None
      address:
-        "0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
+        "eth:0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
      implementationNames.0x2538DA6A2862914Fd87CE8E88FF133f81c289F80:
-        ""
      implementationNames.eth:0x2538DA6A2862914Fd87CE8E88FF133f81c289F80:
+        ""
    }
```

```diff
    contract L1ERC721Bridge (0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F) {
    +++ description: None
      address:
-        "0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.messenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.MESSENGER:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.OTHER_BRIDGE:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.otherBridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.systemConfig:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F:
-        "L1ERC721Bridge"
      implementationNames.eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F:
+        "L1ERC721Bridge"
    }
```

```diff
    contract  (0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7) {
    +++ description: None
      address:
-        "0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
+        "eth:0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
      implementationNames.0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7:
-        ""
      implementationNames.eth:0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7:
+        ""
    }
```

```diff
    contract DisputeGameFactory (0x33D1e8571a85a538ed3D5A4d88f46C112383439D) {
    +++ description: None
      address:
-        "0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x33D1e8571a85a538ed3D5A4d88f46C112383439D:
-        "DisputeGameFactory"
      implementationNames.eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D:
+        "DisputeGameFactory"
    }
```

```diff
    contract DelayedWETH (0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998) {
    +++ description: None
      address:
-        "0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
+        "eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
      values.systemConfig:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998:
-        "DelayedWETH"
      implementationNames.eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998:
+        "DelayedWETH"
    }
```

```diff
    contract ProtocolVersions (0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C) {
    +++ description: None
      address:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C:
-        "ProtocolVersions"
      implementationNames.eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C:
+        "ProtocolVersions"
    }
```

```diff
    contract  (0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7) {
    +++ description: None
      address:
-        "0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
+        "eth:0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
      implementationNames.0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7:
-        ""
      implementationNames.eth:0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7:
+        ""
    }
```

```diff
    contract L1StandardBridge (0x44AfB7722AF276A601D524F429016A18B6923df0) {
    +++ description: None
      address:
-        "0x44AfB7722AF276A601D524F429016A18B6923df0"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.l2TokenBridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.messenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.MESSENGER:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.OTHER_BRIDGE:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.otherBridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.systemConfig:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x44AfB7722AF276A601D524F429016A18B6923df0:
-        "L1StandardBridge"
      implementationNames.eth:0x44AfB7722AF276A601D524F429016A18B6923df0:
+        "L1StandardBridge"
    }
```

```diff
    contract  (0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d) {
    +++ description: None
      address:
-        "0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
+        "eth:0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
      implementationNames.0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d:
-        ""
      implementationNames.eth:0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d:
+        ""
    }
```

```diff
    contract  (0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4) {
    +++ description: None
      address:
-        "0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
+        "eth:0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
      implementationNames.0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4:
-        ""
      implementationNames.eth:0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4:
+        ""
    }
```

```diff
    contract OPContractsManagerDeployer (0x4859c22632AC5Ad6506df5f996098b73A11Bba75) {
    +++ description: None
      address:
-        "0x4859c22632AC5Ad6506df5f996098b73A11Bba75"
+        "eth:0x4859c22632AC5Ad6506df5f996098b73A11Bba75"
      values.contractsContainer:
-        "0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
+        "eth:0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
      values.implementations.superchainConfigImpl:
-        "0xCe28685EB204186b557133766eCA00334EB441E4"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.implementations.protocolVersionsImpl:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.implementations.l1ERC721BridgeImpl:
-        "0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.implementations.optimismPortalImpl:
-        "0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.implementations.ethLockboxImpl:
-        "0x784d2F03593A42A6E4676A012762F18775ecbBe6"
+        "eth:0x784d2F03593A42A6E4676A012762F18775ecbBe6"
      values.implementations.systemConfigImpl:
-        "0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.implementations.optimismMintableERC20FactoryImpl:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.implementations.l1CrossDomainMessengerImpl:
-        "0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.implementations.l1StandardBridgeImpl:
-        "0x44AfB7722AF276A601D524F429016A18B6923df0"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.implementations.disputeGameFactoryImpl:
-        "0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.implementations.anchorStateRegistryImpl:
-        "0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
+        "eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
      values.implementations.delayedWETHImpl:
-        "0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
+        "eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
      values.implementations.mipsImpl:
-        "0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
+        "eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
      implementationNames.0x4859c22632AC5Ad6506df5f996098b73A11Bba75:
-        "OPContractsManagerDeployer"
      implementationNames.eth:0x4859c22632AC5Ad6506df5f996098b73A11Bba75:
+        "OPContractsManagerDeployer"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      address:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.addressManager:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      values.owner:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x543bA4AADBAb8f9025686Bd03993043599c6fB04:
-        "ProxyAdmin"
      implementationNames.eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04:
+        "ProxyAdmin"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5493f4677A186f64805fe7317D6993ba4863988F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.bridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.BRIDGE:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x5493f4677A186f64805fe7317D6993ba4863988F:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x5493f4677A186f64805fe7317D6993ba4863988F:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract OPContractsManager (0x56EbC5c4870F5367B836081610592241Ad3e0734) {
    +++ description: None
      address:
-        "0x56EbC5c4870F5367B836081610592241Ad3e0734"
+        "eth:0x56EbC5c4870F5367B836081610592241Ad3e0734"
      values.implementations.superchainConfigImpl:
-        "0xCe28685EB204186b557133766eCA00334EB441E4"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.implementations.protocolVersionsImpl:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.implementations.l1ERC721BridgeImpl:
-        "0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.implementations.optimismPortalImpl:
-        "0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.implementations.ethLockboxImpl:
-        "0x784d2F03593A42A6E4676A012762F18775ecbBe6"
+        "eth:0x784d2F03593A42A6E4676A012762F18775ecbBe6"
      values.implementations.systemConfigImpl:
-        "0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.implementations.optimismMintableERC20FactoryImpl:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.implementations.l1CrossDomainMessengerImpl:
-        "0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.implementations.l1StandardBridgeImpl:
-        "0x44AfB7722AF276A601D524F429016A18B6923df0"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.implementations.disputeGameFactoryImpl:
-        "0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.implementations.anchorStateRegistryImpl:
-        "0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
+        "eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
      values.implementations.delayedWETHImpl:
-        "0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
+        "eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
      values.implementations.mipsImpl:
-        "0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
+        "eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
      values.opcmDeployer:
-        "0x4859c22632AC5Ad6506df5f996098b73A11Bba75"
+        "eth:0x4859c22632AC5Ad6506df5f996098b73A11Bba75"
      values.opcmGameTypeAdder:
-        "0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C"
+        "eth:0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C"
      values.opcmInteropMigrator:
-        "0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A"
+        "eth:0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A"
      values.opcmUpgrader:
-        "0x5b6820529748d5001C1A999176bFedaBbf5fA64D"
+        "eth:0x5b6820529748d5001C1A999176bFedaBbf5fA64D"
      values.protocolVersions:
-        "0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935"
+        "eth:0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935"
      values.superchainConfig:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.superchainProxyAdmin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.upgradeController:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      implementationNames.0x56EbC5c4870F5367B836081610592241Ad3e0734:
-        "OPContractsManager"
      implementationNames.eth:0x56EbC5c4870F5367B836081610592241Ad3e0734:
+        "OPContractsManager"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      address:
-        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
+        "eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      values.$members.1:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      implementationNames.0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract OPContractsManagerUpgrader (0x5b6820529748d5001C1A999176bFedaBbf5fA64D) {
    +++ description: None
      address:
-        "0x5b6820529748d5001C1A999176bFedaBbf5fA64D"
+        "eth:0x5b6820529748d5001C1A999176bFedaBbf5fA64D"
      values.blueprints.addressManager:
-        "0x765c6637a370595845F637739279C353484a26A6"
+        "eth:0x765c6637a370595845F637739279C353484a26A6"
      values.blueprints.proxy:
-        "0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
+        "eth:0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
      values.blueprints.proxyAdmin:
-        "0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
+        "eth:0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
      values.blueprints.l1ChugSplashProxy:
-        "0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
+        "eth:0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
      values.blueprints.resolvedDelegateProxy:
-        "0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
+        "eth:0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
      values.blueprints.permissionedDisputeGame1:
-        "0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
+        "eth:0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
      values.blueprints.permissionedDisputeGame2:
-        "0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
+        "eth:0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
      values.blueprints.permissionlessDisputeGame1:
-        "0x065E5D14a280701C054D5a6A67f31F228233B823"
+        "eth:0x065E5D14a280701C054D5a6A67f31F228233B823"
      values.blueprints.permissionlessDisputeGame2:
-        "0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
+        "eth:0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
      values.blueprints.superPermissionedDisputeGame1:
-        "0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
+        "eth:0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
      values.blueprints.superPermissionedDisputeGame2:
-        "0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
+        "eth:0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
      values.blueprints.superPermissionlessDisputeGame1:
-        "0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
+        "eth:0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
      values.blueprints.superPermissionlessDisputeGame2:
-        "0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
+        "eth:0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
      values.contractsContainer:
-        "0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
+        "eth:0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
      values.implementations.superchainConfigImpl:
-        "0xCe28685EB204186b557133766eCA00334EB441E4"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.implementations.protocolVersionsImpl:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.implementations.l1ERC721BridgeImpl:
-        "0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.implementations.optimismPortalImpl:
-        "0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.implementations.ethLockboxImpl:
-        "0x784d2F03593A42A6E4676A012762F18775ecbBe6"
+        "eth:0x784d2F03593A42A6E4676A012762F18775ecbBe6"
      values.implementations.systemConfigImpl:
-        "0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.implementations.optimismMintableERC20FactoryImpl:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.implementations.l1CrossDomainMessengerImpl:
-        "0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.implementations.l1StandardBridgeImpl:
-        "0x44AfB7722AF276A601D524F429016A18B6923df0"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.implementations.disputeGameFactoryImpl:
-        "0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.implementations.anchorStateRegistryImpl:
-        "0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
+        "eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
      values.implementations.delayedWETHImpl:
-        "0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
+        "eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
      values.implementations.mipsImpl:
-        "0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
+        "eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
      implementationNames.0x5b6820529748d5001C1A999176bFedaBbf5fA64D:
-        "OPContractsManagerUpgrader"
      implementationNames.eth:0x5b6820529748d5001C1A999176bFedaBbf5fA64D:
+        "OPContractsManagerUpgrader"
    }
```

```diff
    contract  (0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3) {
    +++ description: None
      address:
-        "0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
+        "eth:0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
      implementationNames.0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3:
-        ""
      implementationNames.eth:0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3:
+        ""
    }
```

```diff
    contract  (0x765c6637a370595845F637739279C353484a26A6) {
    +++ description: None
      address:
-        "0x765c6637a370595845F637739279C353484a26A6"
+        "eth:0x765c6637a370595845F637739279C353484a26A6"
      implementationNames.0x765c6637a370595845F637739279C353484a26A6:
-        ""
      implementationNames.eth:0x765c6637a370595845F637739279C353484a26A6:
+        ""
    }
```

```diff
    contract OPContractsManagerGameTypeAdder (0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C) {
    +++ description: None
      address:
-        "0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C"
+        "eth:0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C"
      values.blueprints.addressManager:
-        "0x765c6637a370595845F637739279C353484a26A6"
+        "eth:0x765c6637a370595845F637739279C353484a26A6"
      values.blueprints.proxy:
-        "0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
+        "eth:0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
      values.blueprints.proxyAdmin:
-        "0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
+        "eth:0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
      values.blueprints.l1ChugSplashProxy:
-        "0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
+        "eth:0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
      values.blueprints.resolvedDelegateProxy:
-        "0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
+        "eth:0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
      values.blueprints.permissionedDisputeGame1:
-        "0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
+        "eth:0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
      values.blueprints.permissionedDisputeGame2:
-        "0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
+        "eth:0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
      values.blueprints.permissionlessDisputeGame1:
-        "0x065E5D14a280701C054D5a6A67f31F228233B823"
+        "eth:0x065E5D14a280701C054D5a6A67f31F228233B823"
      values.blueprints.permissionlessDisputeGame2:
-        "0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
+        "eth:0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
      values.blueprints.superPermissionedDisputeGame1:
-        "0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
+        "eth:0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
      values.blueprints.superPermissionedDisputeGame2:
-        "0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
+        "eth:0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
      values.blueprints.superPermissionlessDisputeGame1:
-        "0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
+        "eth:0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
      values.blueprints.superPermissionlessDisputeGame2:
-        "0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
+        "eth:0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
      values.contractsContainer:
-        "0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
+        "eth:0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
      values.implementations.superchainConfigImpl:
-        "0xCe28685EB204186b557133766eCA00334EB441E4"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.implementations.protocolVersionsImpl:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.implementations.l1ERC721BridgeImpl:
-        "0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.implementations.optimismPortalImpl:
-        "0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.implementations.ethLockboxImpl:
-        "0x784d2F03593A42A6E4676A012762F18775ecbBe6"
+        "eth:0x784d2F03593A42A6E4676A012762F18775ecbBe6"
      values.implementations.systemConfigImpl:
-        "0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.implementations.optimismMintableERC20FactoryImpl:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.implementations.l1CrossDomainMessengerImpl:
-        "0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.implementations.l1StandardBridgeImpl:
-        "0x44AfB7722AF276A601D524F429016A18B6923df0"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.implementations.disputeGameFactoryImpl:
-        "0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.implementations.anchorStateRegistryImpl:
-        "0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
+        "eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
      values.implementations.delayedWETHImpl:
-        "0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
+        "eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
      values.implementations.mipsImpl:
-        "0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
+        "eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
      implementationNames.0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C:
-        "OPContractsManagerGameTypeAdder"
      implementationNames.eth:0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C:
+        "OPContractsManagerGameTypeAdder"
    }
```

```diff
    contract ETHLockbox (0x784d2F03593A42A6E4676A012762F18775ecbBe6) {
    +++ description: None
      address:
-        "0x784d2F03593A42A6E4676A012762F18775ecbBe6"
+        "eth:0x784d2F03593A42A6E4676A012762F18775ecbBe6"
      values.systemConfig:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x784d2F03593A42A6E4676A012762F18775ecbBe6:
-        "ETHLockbox"
      implementationNames.eth:0x784d2F03593A42A6E4676A012762F18775ecbBe6:
+        "ETHLockbox"
    }
```

```diff
    contract ProtocolVersions (0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935) {
    +++ description: None
      address:
-        "0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935"
+        "eth:0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.$pastUpgrades.0.2.0:
-        "0x42F0bD8313ad456A38061308857b2383fe2c72a0"
+        "eth:0x42F0bD8313ad456A38061308857b2383fe2c72a0"
      values.$pastUpgrades.1.2.0:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.owner:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      implementationNames.0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935:
-        "Proxy"
      implementationNames.0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C:
-        "ProtocolVersions"
      implementationNames.eth:0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935:
+        "Proxy"
      implementationNames.eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C:
+        "ProtocolVersions"
    }
```

```diff
    contract OPContractsManagerContractsContainer (0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d) {
    +++ description: None
      address:
-        "0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
+        "eth:0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d"
      values.blueprints.addressManager:
-        "0x765c6637a370595845F637739279C353484a26A6"
+        "eth:0x765c6637a370595845F637739279C353484a26A6"
      values.blueprints.proxy:
-        "0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
+        "eth:0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
      values.blueprints.proxyAdmin:
-        "0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
+        "eth:0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7"
      values.blueprints.l1ChugSplashProxy:
-        "0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
+        "eth:0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
      values.blueprints.resolvedDelegateProxy:
-        "0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
+        "eth:0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3"
      values.blueprints.permissionedDisputeGame1:
-        "0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
+        "eth:0x2538DA6A2862914Fd87CE8E88FF133f81c289F80"
      values.blueprints.permissionedDisputeGame2:
-        "0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
+        "eth:0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
      values.blueprints.permissionlessDisputeGame1:
-        "0x065E5D14a280701C054D5a6A67f31F228233B823"
+        "eth:0x065E5D14a280701C054D5a6A67f31F228233B823"
      values.blueprints.permissionlessDisputeGame2:
-        "0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
+        "eth:0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4"
      values.blueprints.superPermissionedDisputeGame1:
-        "0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
+        "eth:0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7"
      values.blueprints.superPermissionedDisputeGame2:
-        "0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
+        "eth:0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d"
      values.blueprints.superPermissionlessDisputeGame1:
-        "0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
+        "eth:0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
      values.blueprints.superPermissionlessDisputeGame2:
-        "0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
+        "eth:0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62"
      values.implementations.superchainConfigImpl:
-        "0xCe28685EB204186b557133766eCA00334EB441E4"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.implementations.protocolVersionsImpl:
-        "0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
+        "eth:0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C"
      values.implementations.l1ERC721BridgeImpl:
-        "0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
+        "eth:0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F"
      values.implementations.optimismPortalImpl:
-        "0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.implementations.ethLockboxImpl:
-        "0x784d2F03593A42A6E4676A012762F18775ecbBe6"
+        "eth:0x784d2F03593A42A6E4676A012762F18775ecbBe6"
      values.implementations.systemConfigImpl:
-        "0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.implementations.optimismMintableERC20FactoryImpl:
-        "0x5493f4677A186f64805fe7317D6993ba4863988F"
+        "eth:0x5493f4677A186f64805fe7317D6993ba4863988F"
      values.implementations.l1CrossDomainMessengerImpl:
-        "0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.implementations.l1StandardBridgeImpl:
-        "0x44AfB7722AF276A601D524F429016A18B6923df0"
+        "eth:0x44AfB7722AF276A601D524F429016A18B6923df0"
      values.implementations.disputeGameFactoryImpl:
-        "0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
+        "eth:0x33D1e8571a85a538ed3D5A4d88f46C112383439D"
      values.implementations.anchorStateRegistryImpl:
-        "0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
+        "eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
      values.implementations.delayedWETHImpl:
-        "0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
+        "eth:0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998"
      values.implementations.mipsImpl:
-        "0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
+        "eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
      implementationNames.0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d:
-        "OPContractsManagerContractsContainer"
      implementationNames.eth:0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d:
+        "OPContractsManagerContractsContainer"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      address:
-        "0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
+        "eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
+        "eth:0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64"
      values.$members.1:
-        "0x3041BA32f451F5850c147805F5521AC206421623"
+        "eth:0x3041BA32f451F5850c147805F5521AC206421623"
      values.$members.2:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "eth:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
      values.$members.3:
-        "0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
+        "eth:0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8"
      values.$members.4:
-        "0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
+        "eth:0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15"
      values.$members.5:
-        "0x7cB07FE039a92B3D784f284D919503A381BEC54f"
+        "eth:0x7cB07FE039a92B3D784f284D919503A381BEC54f"
      values.$members.6:
-        "0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
+        "eth:0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"
      implementationNames.0x847B5c174615B1B7fDF770882256e2D3E95b9D92:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x847B5c174615B1B7fDF770882256e2D3E95b9D92:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.$admin:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      values.$implementation:
-        "0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.$pastUpgrades.0.2.0:
-        "0x53c165169401764778F780a69701385eb0FF19B7"
+        "eth:0x53c165169401764778F780a69701385eb0FF19B7"
      values.$pastUpgrades.1.2.0:
-        "0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
+        "eth:0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"
      values.$pastUpgrades.2.2.0:
-        "0x53c165169401764778F780a69701385eb0FF19B7"
+        "eth:0x53c165169401764778F780a69701385eb0FF19B7"
      values.$pastUpgrades.3.2.0:
-        "0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
+        "eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7"
      values.guardian:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      implementationNames.0x95703e0982140D16f8ebA6d158FccEde42f04a4C:
-        "Proxy"
      implementationNames.0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
-        "SuperchainConfig"
      implementationNames.eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C:
+        "Proxy"
      implementationNames.eth:0x4da82a327773965b8d4D85Fa3dB8249b387458E7:
+        "SuperchainConfig"
    }
```

```diff
    contract MIPS64 (0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a) {
    +++ description: None
      address:
-        "0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
+        "eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a"
      values.oracle:
-        "0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
+        "eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
      implementationNames.0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a:
-        "MIPS64"
      implementationNames.eth:0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a:
+        "MIPS64"
    }
```

```diff
    contract  (0xA5d36DEaf2267B267278a4a1458deFe0d65620eb) {
    +++ description: None
      address:
-        "0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
+        "eth:0xA5d36DEaf2267B267278a4a1458deFe0d65620eb"
      implementationNames.0xA5d36DEaf2267B267278a4a1458deFe0d65620eb:
-        ""
      implementationNames.eth:0xA5d36DEaf2267B267278a4a1458deFe0d65620eb:
+        ""
    }
```

```diff
    contract  (0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d) {
    +++ description: None
      address:
-        "0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
+        "eth:0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d"
      implementationNames.0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d:
-        ""
      implementationNames.eth:0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d:
+        ""
    }
```

```diff
    contract  (0xB8d4EA750956C54B394F4A9d270CaF2EDA627013) {
    +++ description: None
      address:
-        "0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
+        "eth:0xB8d4EA750956C54B394F4A9d270CaF2EDA627013"
      implementationNames.0xB8d4EA750956C54B394F4A9d270CaF2EDA627013:
-        ""
      implementationNames.eth:0xB8d4EA750956C54B394F4A9d270CaF2EDA627013:
+        ""
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      address:
-        "0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
+        "eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x07dC0893cAfbF810e3E72505041f2865726Fd073"
+        "eth:0x07dC0893cAfbF810e3E72505041f2865726Fd073"
      values.$members.1:
-        "0x652BC529E171847E2fFddCeA13567643C84ccB5f"
+        "eth:0x652BC529E171847E2fFddCeA13567643C84ccB5f"
      values.$members.2:
-        "0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
+        "eth:0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e"
      values.$members.3:
-        "0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
+        "eth:0x4A7322258c9E690e4CB8Cea6e5251443E956e61E"
      values.$members.4:
-        "0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
+        "eth:0x51aCb8e1205De850D1b512584FeE9C29C3813dDa"
      values.$members.5:
-        "0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
+        "eth:0xEF9A98511939eEe6Ec69af62082E3F2ff606877c"
      values.$members.6:
-        "0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
+        "eth:0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865"
      values.$members.7:
-        "0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
+        "eth:0xd5b735b676A043a53946C3b6F6BE28c1ECE6aC90"
      values.$members.8:
-        "0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
+        "eth:0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39"
      values.$members.9:
-        "0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
+        "eth:0x0aA384EB2fedD2741277A0f72909A0d7275575D7"
      values.$members.10:
-        "0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
+        "eth:0x9Eb11A55132c851b9991F148b3Af791ca498fD7A"
      values.$members.11:
-        "0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
+        "eth:0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9"
      values.$members.12:
-        "0x92827223f6b397CE9F208eE352bacA710765cACb"
+        "eth:0x92827223f6b397CE9F208eE352bacA710765cACb"
      values.GnosisSafe_modules.0:
-        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
+        "eth:0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      implementationNames.0xc2819DC788505Aac350142A7A707BF9D03E3Bd03:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xc2819DC788505Aac350142A7A707BF9D03E3Bd03:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract SuperchainConfig (0xCe28685EB204186b557133766eCA00334EB441E4) {
    +++ description: None
      address:
-        "0xCe28685EB204186b557133766eCA00334EB441E4"
+        "eth:0xCe28685EB204186b557133766eCA00334EB441E4"
      values.guardian:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xCe28685EB204186b557133766eCA00334EB441E4:
-        "SuperchainConfig"
      implementationNames.eth:0xCe28685EB204186b557133766eCA00334EB441E4:
+        "SuperchainConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54) {
    +++ description: None
      address:
-        "0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
+        "eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54"
      values.OTHER_MESSENGER:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.otherMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.portal:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.PORTAL:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.systemConfig:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.xDomainMessageSender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      values.owner:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      implementationNames.0xdE1FCfB0851916CA5101820A69b13a4E276bd81F:
-        "Lib_AddressManager"
      implementationNames.eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F:
+        "Lib_AddressManager"
    }
```

```diff
    contract  (0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C) {
    +++ description: None
      address:
-        "0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
+        "eth:0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C"
      implementationNames.0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C:
-        ""
      implementationNames.eth:0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C:
+        ""
    }
```

```diff
    contract AnchorStateRegistry (0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E) {
    +++ description: None
      address:
-        "0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
+        "eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E"
      values.anchorGame:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.disputeGameFactory:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.systemConfig:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E:
-        "AnchorStateRegistry"
      implementationNames.eth:0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E:
+        "AnchorStateRegistry"
    }
```

```diff
    contract OptimismPortal2 (0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a) {
    +++ description: None
      address:
-        "0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
+        "eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a"
      values.anchorStateRegistry:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.ethLockbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l2Sender:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.systemConfig:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a:
-        "OptimismPortal2"
      implementationNames.eth:0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a:
+        "OptimismPortal2"
    }
```

```diff
    contract SystemConfig (0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa) {
    +++ description: None
      address:
-        "0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
+        "eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa"
      values.batchInbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getAddresses.l1CrossDomainMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getAddresses.l1ERC721Bridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getAddresses.l1StandardBridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getAddresses.optimismPortal:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.getAddresses.optimismMintableERC20Factory:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l1CrossDomainMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l1ERC721Bridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l1StandardBridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.optimismMintableERC20Factory:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.optimismPortal:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.superchainConfig:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.unsafeBlockSigner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa:
-        "SystemConfig"
      implementationNames.eth:0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa:
+        "SystemConfig"
    }
```

```diff
+   Status: CREATED
    contract OPContractsManagerInteropMigrator (0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x065E5D14a280701C054D5a6A67f31F228233B823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract  (0x2538DA6A2862914Fd87CE8E88FF133f81c289F80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x33D1e8571a85a538ed3D5A4d88f46C112383439D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolVersions (0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x44AfB7722AF276A601D524F429016A18B6923df0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPContractsManagerDeployer (0x4859c22632AC5Ad6506df5f996098b73A11Bba75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5493f4677A186f64805fe7317D6993ba4863988F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract OPContractsManager (0x56EbC5c4870F5367B836081610592241Ad3e0734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPContractsManagerUpgrader (0x5b6820529748d5001C1A999176bFedaBbf5fA64D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x765c6637a370595845F637739279C353484a26A6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPContractsManagerGameTypeAdder (0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHLockbox (0x784d2F03593A42A6E4676A012762F18775ecbBe6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolVersions (0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPContractsManagerContractsContainer (0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract MIPS64 (0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xA5d36DEaf2267B267278a4a1458deFe0d65620eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xB8d4EA750956C54B394F4A9d270CaF2EDA627013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xCe28685EB204186b557133766eCA00334EB441E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract  (0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa)
    +++ description: None
```

Generated with discovered.json: 0x2f436127de131138063b33229410f4d8538ccd6f

# Diff at Mon, 14 Jul 2025 08:02:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22896167
- current block number: 22896167

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22896167 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x5493f4677A186f64805fe7317D6993ba4863988F) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x0ae860dc7687ad187520710c228cf8ebf20219db

# Diff at Fri, 11 Jul 2025 13:15:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6f02976fdd9466dab085b947bf3c4d28ccef1010 block: 22796150
- current block number: 22896167

## Description

MIPS64 verified and relative (PreimageOracle) discovered.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22796150 (main branch discovery), not current.

```diff
    contract MIPS64 (0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a) {
    +++ description: None
      name:
-        ""
+        "MIPS64"
      unverified:
-        true
      values.oracle:
+        "0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3"
      values.stateVersion:
+        7
      values.version:
+        "1.4.0-patch.2"
      implementationNames.0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a:
-        ""
+        "MIPS64"
      sourceHashes:
+        ["0x4cb0db3ab622eb010a64351dfd58c389cab9241c930e73b450bfd321193837eb"]
    }
```

```diff
+   Status: CREATED
    contract PreimageOracle (0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

Generated with discovered.json: 0x6017668d3ac327d1574427f8736ba6c8b8a1fc82

# Diff at Fri, 04 Jul 2025 12:19:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22796150
- current block number: 22796150

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22796150 (main branch discovery), not current.

```diff
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935"
+        "eth:0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.0.from:
-        "ethereum:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
+        "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.1.from:
-        "ethereum:0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935"
+        "eth:0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      receivedPermissions.2.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
    }
```

```diff
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "eth:0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.from:
-        "ethereum:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
+        "eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

Generated with discovered.json: 0x9b2a9929dfd615d870ecf182333a66747f06d800

# Diff at Fri, 27 Jun 2025 14:09:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22796150

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract OPContractsManagerInteropMigrator (0x01B2f6Aa2ADC77c9A4A91D09a6E806ad51B0290A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x065E5D14a280701C054D5a6A67f31F228233B823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x1DE15df33bca415B7d5F108D6F7e69386D8FAE62)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x2538DA6A2862914Fd87CE8E88FF133f81c289F80)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x25d6CeDEB277Ad7ebEe71226eD7877768E0B7A2F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x2Fa0D0f6d92061344Db35132379dB419bD1c56f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x33D1e8571a85a538ed3D5A4d88f46C112383439D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x33Dadc2d1aA9BB613A7AE6B28425eA00D44c6998)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolVersions (0x37E15e4d6DFFa9e5E320Ee1eC036922E563CB76C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x3EfB68b95a4b148B7dc0a1f4d44c20E61D224ce7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x44AfB7722AF276A601D524F429016A18B6923df0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x47Ab4081Ae9e68dEd575100D7AbC024d60A6b04d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x481f6FfbbBa2F205BB04Fc584D5cE940658D41e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPContractsManagerDeployer (0x4859c22632AC5Ad6506df5f996098b73A11Bba75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5493f4677A186f64805fe7317D6993ba4863988F)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract OPContractsManager (0x56EbC5c4870F5367B836081610592241Ad3e0734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPContractsManagerUpgrader (0x5b6820529748d5001C1A999176bFedaBbf5fA64D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7096758bDD076a4cC42255c278F2Cb216D6D8ce3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x765c6637a370595845F637739279C353484a26A6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPContractsManagerGameTypeAdder (0x77BE751385562ec5F5074f1D3d80B9B7DF0aF77C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ETHLockbox (0x784d2F03593A42A6E4676A012762F18775ecbBe6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolVersions (0x8062AbC286f5e7D9428a0Ccb9AbD71e50d93b935)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPContractsManagerContractsContainer (0x83971e7B9561B2b27A2C186cdFFa754D2eff8a1d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract  (0xA1B54D89e305bcd322Ba0C9C094093173C0d6b3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xA5d36DEaf2267B267278a4a1458deFe0d65620eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xA643EA8ee60D92f615eC70AF0248c449bBCEcF4d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xB8d4EA750956C54B394F4A9d270CaF2EDA627013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xCe28685EB204186b557133766eCA00334EB441E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xD26bB3aaAa4cB5638A8581A4c4b1d937D8E05c54)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract  (0xe6d25D68252e0D9cA9e16B554FA5D7C48EDe150C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xeb69cC681E8D4a557b30DFFBAd85aFfD47a2CF2E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xEFEd7F38BB9BE74bBa583a1A5B7D0fe7C9D5787a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xFaA660bf783CBAa55e1B7F3475C20Db74a53b9Fa)
    +++ description: None
```
