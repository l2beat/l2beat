Generated with discovered.json: 0xfed4ba6df91e43d66285b08161f05823cf96ea72

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xae23bd35a6d0417edc22ce030c707b6cc4e4a5f0

# Diff at Mon, 14 Jul 2025 12:44:48 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 21041827
- current block number: 21041827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    EOA  (0x1D93fE338A035f297819EA867275661a4f5B4fdD) {
    +++ description: None
      address:
-        "0x1D93fE338A035f297819EA867275661a4f5B4fdD"
+        "eth:0x1D93fE338A035f297819EA867275661a4f5B4fdD"
    }
```

```diff
    contract AztecFeeDistributor (0x4cf32670a53657596E641DFCC6d40f01e4d64927) {
    +++ description: None
      address:
-        "0x4cf32670a53657596E641DFCC6d40f01e4d64927"
+        "eth:0x4cf32670a53657596E641DFCC6d40f01e4d64927"
      values.aztecFeeClaimer:
-        "0xD64791E747188b0e5061fC65b56Bf20FeE2e3321"
+        "eth:0xD64791E747188b0e5061fC65b56Bf20FeE2e3321"
      values.owner:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
+        "eth:0xE298a76986336686CC3566469e3520d23D1a8aaD"
      values.rollupProcessor:
-        "0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
+        "eth:0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
      implementationNames.0x4cf32670a53657596E641DFCC6d40f01e4d64927:
-        "AztecFeeDistributor"
      implementationNames.eth:0x4cf32670a53657596E641DFCC6d40f01e4d64927:
+        "AztecFeeDistributor"
    }
```

```diff
    EOA  (0x7fb9f93Cc6614dDd76c893EC8b5310674aC3Fc5f) {
    +++ description: None
      address:
-        "0x7fb9f93Cc6614dDd76c893EC8b5310674aC3Fc5f"
+        "eth:0x7fb9f93Cc6614dDd76c893EC8b5310674aC3Fc5f"
    }
```

```diff
    EOA  (0xA173BDdF4953C1E8be2cA0695CFc07502Ff3B1e7) {
    +++ description: None
      address:
-        "0xA173BDdF4953C1E8be2cA0695CFc07502Ff3B1e7"
+        "eth:0xA173BDdF4953C1E8be2cA0695CFc07502Ff3B1e7"
    }
```

```diff
    contract DefiBridgeProxy (0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487) {
    +++ description: None
      address:
-        "0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487"
+        "eth:0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487"
      implementationNames.0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487:
-        "DefiBridgeProxy"
      implementationNames.eth:0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487:
+        "DefiBridgeProxy"
    }
```

```diff
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB) {
    +++ description: None
      address:
-        "0xb7baA1420f88b7758E341c93463426A2b7651CFB"
+        "eth:0xb7baA1420f88b7758E341c93463426A2b7651CFB"
      implementationNames.0xb7baA1420f88b7758E341c93463426A2b7651CFB:
-        "Verifier28x32"
      implementationNames.eth:0xb7baA1420f88b7758E341c93463426A2b7651CFB:
+        "Verifier28x32"
    }
```

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      address:
-        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
+        "eth:0xC5b735d05c26579B701Be9bED253Bb588503B26B"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xC5b735d05c26579B701Be9bED253Bb588503B26B:
-        "ProxyAdmin"
      implementationNames.eth:0xC5b735d05c26579B701Be9bED253Bb588503B26B:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xD64791E747188b0e5061fC65b56Bf20FeE2e3321) {
    +++ description: None
      address:
-        "0xD64791E747188b0e5061fC65b56Bf20FeE2e3321"
+        "eth:0xD64791E747188b0e5061fC65b56Bf20FeE2e3321"
    }
```

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      address:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
+        "eth:0xE298a76986336686CC3566469e3520d23D1a8aaD"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x1D93fE338A035f297819EA867275661a4f5B4fdD"
+        "eth:0x1D93fE338A035f297819EA867275661a4f5B4fdD"
      values.$members.1:
-        "0x7fb9f93Cc6614dDd76c893EC8b5310674aC3Fc5f"
+        "eth:0x7fb9f93Cc6614dDd76c893EC8b5310674aC3Fc5f"
      implementationNames.0xE298a76986336686CC3566469e3520d23D1a8aaD:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xE298a76986336686CC3566469e3520d23D1a8aaD:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      address:
-        "0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
+        "eth:0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
      values.$admin:
-        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
+        "eth:0xC5b735d05c26579B701Be9bED253Bb588503B26B"
      values.$implementation:
-        "0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
+        "eth:0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
      values.$pastUpgrades.0.2.0:
-        "0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28"
+        "eth:0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28"
      values.$pastUpgrades.1.2.0:
-        "0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"
+        "eth:0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"
      values.$pastUpgrades.2.2.0:
-        "0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
+        "eth:0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
      values.defiBridgeProxy:
-        "0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487"
+        "eth:0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487"
      values.getSupportedAsset.0:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.getSupportedAsset.1:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.getSupportedAsset.2:
-        "0xdA816459F1AB5631232FE5e97a05BBBb94970c95"
+        "eth:0xdA816459F1AB5631232FE5e97a05BBBb94970c95"
      values.getSupportedAsset.3:
-        "0xa258C4606Ca8206D8aA700cE2143D7db854D168c"
+        "eth:0xa258C4606Ca8206D8aA700cE2143D7db854D168c"
      values.getSupportedAsset.4:
-        "0x3c66B18F67CA6C1A71F829E2F6a0c987f97462d0"
+        "eth:0x3c66B18F67CA6C1A71F829E2F6a0c987f97462d0"
      values.getSupportedAsset.5:
-        "0x60897720AA966452e8706e74296B018990aEc527"
+        "eth:0x60897720AA966452e8706e74296B018990aEc527"
      values.getSupportedAsset.6:
-        "0x4169Df1B7820702f566cc10938DA51F6F597d264"
+        "eth:0x4169Df1B7820702f566cc10938DA51F6F597d264"
      values.getSupportedAsset.7:
-        "0xbcb91e0B4Ad56b0d41e0C168E3090361c0039abC"
+        "eth:0xbcb91e0B4Ad56b0d41e0C168E3090361c0039abC"
      values.getSupportedAsset.8:
-        "0xc21F107933612eCF5677894d45fc060767479A9b"
+        "eth:0xc21F107933612eCF5677894d45fc060767479A9b"
      values.getSupportedAsset.9:
-        "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"
+        "eth:0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"
      values.getSupportedAsset.10:
-        "0x998650bf01A6424F9B11debd85a29090906cB559"
+        "eth:0x998650bf01A6424F9B11debd85a29090906cB559"
      values.getSupportedAsset.11:
-        "0x646Df2Dc98741a0Ab5798DeAC6Fc62411dA41D96"
+        "eth:0x646Df2Dc98741a0Ab5798DeAC6Fc62411dA41D96"
      values.getSupportedAsset.12:
-        "0x6D088fe2500Da41D7fA7ab39c76a506D7c91f53b"
+        "eth:0x6D088fe2500Da41D7fA7ab39c76a506D7c91f53b"
      values.getSupportedAsset.13:
-        "0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84"
+        "eth:0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84"
      values.getSupportedAsset.14:
-        "0x378cb52b00F9D0921cb46dFc099CFf73b42419dC"
+        "eth:0x378cb52b00F9D0921cb46dFc099CFf73b42419dC"
      values.getSupportedBridge.0:
-        "0xaeD181779A8AAbD8Ce996949853FEA442C2CDB47"
+        "eth:0xaeD181779A8AAbD8Ce996949853FEA442C2CDB47"
      values.getSupportedBridge.1:
-        "0x381abF150B53cc699f0dBBBEF3C5c0D1fA4B3Efd"
+        "eth:0x381abF150B53cc699f0dBBBEF3C5c0D1fA4B3Efd"
      values.getSupportedBridge.2:
-        "0x381abF150B53cc699f0dBBBEF3C5c0D1fA4B3Efd"
+        "eth:0x381abF150B53cc699f0dBBBEF3C5c0D1fA4B3Efd"
      values.getSupportedBridge.3:
-        "0x0eb7F9464060289fE4FDDFDe2258f518c6347a70"
+        "eth:0x0eb7F9464060289fE4FDDFDe2258f518c6347a70"
      values.getSupportedBridge.4:
-        "0x0031130c56162e00A7e9C01eE4147b11cbac8776"
+        "eth:0x0031130c56162e00A7e9C01eE4147b11cbac8776"
      values.getSupportedBridge.5:
-        "0xe09801dA4C74e62fB42DFC8303a1C1BD68073D1a"
+        "eth:0xe09801dA4C74e62fB42DFC8303a1C1BD68073D1a"
      values.getSupportedBridge.6:
-        "0xE71A50a78CcCff7e20D8349EED295F12f0C8C9eF"
+        "eth:0xE71A50a78CcCff7e20D8349EED295F12f0C8C9eF"
      values.getSupportedBridge.7:
-        "0xE71A50a78CcCff7e20D8349EED295F12f0C8C9eF"
+        "eth:0xE71A50a78CcCff7e20D8349EED295F12f0C8C9eF"
      values.getSupportedBridge.8:
-        "0xaeD181779A8AAbD8Ce996949853FEA442C2CDB47"
+        "eth:0xaeD181779A8AAbD8Ce996949853FEA442C2CDB47"
      values.getSupportedBridge.9:
-        "0x3578D6D5e1B4F07A48bb1c958CBfEc135bef7d98"
+        "eth:0x3578D6D5e1B4F07A48bb1c958CBfEc135bef7d98"
      values.getSupportedBridge.10:
-        "0x94679A39679ffE53B53b6a1187aa1c649A101321"
+        "eth:0x94679A39679ffE53B53b6a1187aa1c649A101321"
      values.getSupportedBridge.11:
-        "0x3578D6D5e1B4F07A48bb1c958CBfEc135bef7d98"
+        "eth:0x3578D6D5e1B4F07A48bb1c958CBfEc135bef7d98"
      values.getSupportedBridge.12:
-        "0x3578D6D5e1B4F07A48bb1c958CBfEc135bef7d98"
+        "eth:0x3578D6D5e1B4F07A48bb1c958CBfEc135bef7d98"
      values.getSupportedBridge.13:
-        "0x998650bf01A6424F9B11debd85a29090906cB559"
+        "eth:0x998650bf01A6424F9B11debd85a29090906cB559"
      values.getSupportedBridge.14:
-        "0x646Df2Dc98741a0Ab5798DeAC6Fc62411dA41D96"
+        "eth:0x646Df2Dc98741a0Ab5798DeAC6Fc62411dA41D96"
      values.getSupportedBridge.15:
-        "0x5594808e8A7b44da9D2382E6d72ad50a3e2571E0"
+        "eth:0x5594808e8A7b44da9D2382E6d72ad50a3e2571E0"
      values.getSupportedBridge.16:
-        "0x5594808e8A7b44da9D2382E6d72ad50a3e2571E0"
+        "eth:0x5594808e8A7b44da9D2382E6d72ad50a3e2571E0"
      values.getSupportedBridge.17:
-        "0xA915B9C104F865105Caa29E122C8e558cC22bd41"
+        "eth:0xA915B9C104F865105Caa29E122C8e558cC22bd41"
      values.rollupProviders.0:
-        "0xA173BDdF4953C1E8be2cA0695CFc07502Ff3B1e7"
+        "eth:0xA173BDdF4953C1E8be2cA0695CFc07502Ff3B1e7"
      values.rollupProviders.1:
-        "0xD64791E747188b0e5061fC65b56Bf20FeE2e3321"
+        "eth:0xD64791E747188b0e5061fC65b56Bf20FeE2e3321"
      values.verifier:
-        "0xb7baA1420f88b7758E341c93463426A2b7651CFB"
+        "eth:0xb7baA1420f88b7758E341c93463426A2b7651CFB"
      implementationNames.0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728:
-        "RollupProcessorV3"
      implementationNames.eth:0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728:
+        "RollupProcessorV3"
    }
```

```diff
+   Status: CREATED
    contract AztecFeeDistributor (0x4cf32670a53657596E641DFCC6d40f01e4d64927)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefiBridgeProxy (0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455)
    +++ description: None
```

Generated with discovered.json: 0x2f39ea16436b43ca9f6f83508cb30b67e0a10ed6

# Diff at Fri, 04 Jul 2025 12:18:53 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 21041827
- current block number: 21041827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
+        "eth:0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
    }
```

Generated with discovered.json: 0x4fe75869f6785f1444f5d1898b46ea0284f37815

# Diff at Fri, 23 May 2025 09:40:53 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21041827
- current block number: 21041827

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x768d7f494e1311f97029e643243efd217649c062

# Diff at Tue, 29 Apr 2025 08:19:00 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21041827
- current block number: 21041827

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xC5b735d05c26579B701Be9bED253Bb588503B26B","via":[]}]
    }
```

Generated with discovered.json: 0xcd06c8d354353949ddaf50355c39adf0b754ff94

# Diff at Tue, 04 Mar 2025 10:38:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21041827
- current block number: 21041827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract AztecFeeDistributor (0x4cf32670a53657596E641DFCC6d40f01e4d64927) {
    +++ description: None
      sinceBlock:
+        14923083
    }
```

```diff
    contract DefiBridgeProxy (0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487) {
    +++ description: None
      sinceBlock:
+        14923076
    }
```

```diff
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB) {
    +++ description: None
      sinceBlock:
+        19609952
    }
```

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      sinceBlock:
+        14923077
    }
```

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      sinceBlock:
+        11647532
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      sinceBlock:
+        14923081
    }
```

Generated with discovered.json: 0xc0abb212722da4f4e4ae682e6901f217245c8ee2

# Diff at Mon, 20 Jan 2025 11:09:18 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21041827
- current block number: 21041827

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
      receivedPermissions.0.from:
+        "0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
      issuedPermissions.0.to:
+        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
    }
```

Generated with discovered.json: 0x76e236f9cfe6da09cec92f53897e57d028a1bcc8

# Diff at Tue, 10 Dec 2024 10:37:00 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21041827
- current block number: 21041827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract AztecFeeDistributor (0x4cf32670a53657596E641DFCC6d40f01e4d64927)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD)
    +++ description: None
```

Generated with discovered.json: 0xa1ec9af4eeae57032afb3dfc89bf2faf162aad87

# Diff at Thu, 28 Nov 2024 11:02:01 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21041827
- current block number: 21041827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041827 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      directlyReceivedPermissions:
-        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"}]
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x0000000000000000000000000000000000000000"
+        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
      issuedPermissions.0.via.0:
-        {"address":"0xC5b735d05c26579B701Be9bED253Bb588503B26B","delay":0}
    }
```

Generated with discovered.json: 0x71c0d46ab3fbd5ceace5752319b78c495b1f74a2

# Diff at Fri, 25 Oct 2024 09:47:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 19816414
- current block number: 21041827

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"}]
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xC5b735d05c26579B701Be9bED253Bb588503B26B"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.0.via.0:
+        {"address":"0xC5b735d05c26579B701Be9bED253Bb588503B26B","delay":0}
    }
```

Generated with discovered.json: 0xe8e10e2752a9b321eb8eac5388cdd3ace2fcb5c5

# Diff at Mon, 21 Oct 2024 11:04:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"]
      values.$pastUpgrades.2.1:
-        ["0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"]
+        "0x540d7db72d3a04eef10b2c57b05382653c1bfb89a4a5bec24873747fa981c68c"
      values.$pastUpgrades.1.2:
+        ["0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"]
      values.$pastUpgrades.1.1:
-        ["0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"]
+        "0xe5e9eb537607a7998e112f673812580f7bb0c588a659df1d1a52a7aebc43af7f"
      values.$pastUpgrades.0.2:
+        ["0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28"]
      values.$pastUpgrades.0.1:
-        ["0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28"]
+        "0x837765f53d9ae32bf1b507fec696052d3ee2a245515dccebc13b3717bc987921"
    }
```

Generated with discovered.json: 0x8d9a0a95d3aa11dcfa7af73f65dccf0b530d8b0e

# Diff at Mon, 14 Oct 2024 10:49:34 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract DefiBridgeProxy (0xA1BBa894a6D39D79C0D1ef9c68a2139c84B81487) {
    +++ description: None
      sourceHashes:
+        ["0x4c3447f738f38931105bfe030716b1bdc26c6e9ca0bbed38fff31afccabc90fb"]
    }
```

```diff
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB) {
    +++ description: None
      sourceHashes:
+        ["0x55fc1304c184842e528edeff31d00322f57295e9f369b6e457f0c9944bc77de9"]
    }
```

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xca3afcf92a9c12ce307d9de265b57fe02f7022f6a5f0eab38511eccafbfff478"]
    }
```

Generated with discovered.json: 0x3c5215d997e8351ca277c5a3aa3274c3d2a6f161

# Diff at Tue, 01 Oct 2024 10:49:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-06-07T21:43:14.000Z",["0x3f972e325CecD99a6be267fd36ceB46DCa7C3F28"]],["2022-12-08T17:38:23.000Z",["0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"]],["2024-04-09T18:42:35.000Z",["0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"]]]
    }
```

Generated with discovered.json: 0x3c53c44d40c9bad7c5226fca36e29f5940b27f82

# Diff at Fri, 30 Aug 2024 07:51:26 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x087d03a086d807b24d6bd37993400755412c4ae6

# Diff at Fri, 23 Aug 2024 09:51:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x747b28f962c7a6fd65af13b35c07447a4d76707e

# Diff at Wed, 21 Aug 2024 10:02:05 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455","via":[]}]
    }
```

```diff
    contract RollupProcessorV3 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC5b735d05c26579B701Be9bED253Bb588503B26B","via":[]}]
    }
```

Generated with discovered.json: 0x39fc71387a47587540725472d60544e040a382ac

# Diff at Fri, 09 Aug 2024 10:08:43 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19816414
- current block number: 19816414

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19816414 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"]
      assignedPermissions.upgrade:
+        ["0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455"]
    }
```

Generated with discovered.json: 0x671317ae0ac7f934dcaf37d70b48fc7c3411b9bb

# Diff at Tue, 07 May 2024 06:31:48 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@20cad040a80da0f4072f1c6f9778026143a458db block: 19773867
- current block number: 19816414

## Description

Renamed RollupProcessor to match the onchain reality.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19773867 (main branch discovery), not current.

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      name:
-        "RollupProcessorV2"
+        "RollupProcessorV3"
    }
```

Generated with discovered.json: 0x0cdec08688e0bf04ae55526247b3daa31458700c

# Diff at Wed, 01 May 2024 07:44:40 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@acc36455c1f5f929e0ed99a6e280e868e5ad4c09 block: 19624947
- current block number: 19773867

## Description

Aztec connect [was sunset on March 31st, 2024](https://medium.com/aztec-protocol/sunsetting-aztec-connect-a786edce5cae) and deposits are disabled (pendingCap = 0, dailyCap = 0). Furthermore, the ownership- and governance roles of the rollup are irrevocably renounced in this update.

Assets can still be manually withdrawn with the [Aztec Connect Ejector](https://github.com/AztecProtocol/aztec-connect-ejector).

## Watched changes

```diff
-   Status: DELETED
    contract Emergency Multisig (0x23f8008159C0427458b948c3DD7795c6DBE8236F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Resume Multisig (0x62415C92528C7d86Fd3f82D3fc75c2F66Bb9389a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Lister Multisig (0x68A36Aa8E309d5010ab4F9D6c5F1246b854D0b9e)
    +++ description: None
```

```diff
    contract ProxyAdmin (0xC5b735d05c26579B701Be9bED253Bb588503B26B) {
    +++ description: None
      values.owner:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD)
    +++ description: None
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
      values.accessControl.OWNER_ROLE.members.0:
-        "0xE298a76986336686CC3566469e3520d23D1a8aaD"
      values.accessControl.EMERGENCY_ROLE.members.0:
-        "0x23f8008159C0427458b948c3DD7795c6DBE8236F"
      values.accessControl.LISTER_ROLE.members.0:
-        "0x68A36Aa8E309d5010ab4F9D6c5F1246b854D0b9e"
      values.accessControl.RESUME_ROLE.members.0:
-        "0x62415C92528C7d86Fd3f82D3fc75c2F66Bb9389a"
    }
```

## Source code changes

```diff
.../contracts/GnosisSafe.sol => /dev/null          | 422 ---------------------
 .../contracts/base/Executor.sol => /dev/null       |  27 --
 .../base/FallbackManager.sol => /dev/null          |  53 ---
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ---
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 -------
 .../contracts/base/OwnerManager.sol => /dev/null   | 149 --------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 --
 .../common/SelfAuthorized.sol => /dev/null         |  16 -
 .../common/SignatureDecoder.sol => /dev/null       |  36 --
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../common/StorageAccessible.sol => /dev/null      |  47 ---
 .../external/GnosisSafeMath.sol => /dev/null       |  54 ---
 .../ISignatureValidator.sol => /dev/null           |  20 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../Aztec Multisig/proxy/Proxy.sol => /dev/null    |  41 --
 .../Aztec Multisig/proxy/meta.txt => /dev/null     |   2 -
 .../contracts/GnosisSafe.sol => /dev/null          | 422 ---------------------
 .../contracts/base/Executor.sol => /dev/null       |  27 --
 .../base/FallbackManager.sol => /dev/null          |  53 ---
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ---
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 -------
 .../contracts/base/OwnerManager.sol => /dev/null   | 149 --------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 --
 .../common/SelfAuthorized.sol => /dev/null         |  16 -
 .../common/SignatureDecoder.sol => /dev/null       |  36 --
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../common/StorageAccessible.sol => /dev/null      |  47 ---
 .../external/GnosisSafeMath.sol => /dev/null       |  54 ---
 .../ISignatureValidator.sol => /dev/null           |  20 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         | 155 --------
 .../Emergency Multisig/proxy/meta.txt => /dev/null |   2 -
 .../contracts/GnosisSafe.sol => /dev/null          | 422 ---------------------
 .../contracts/base/Executor.sol => /dev/null       |  27 --
 .../base/FallbackManager.sol => /dev/null          |  53 ---
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ---
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 -------
 .../contracts/base/OwnerManager.sol => /dev/null   | 149 --------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 --
 .../common/SelfAuthorized.sol => /dev/null         |  16 -
 .../common/SignatureDecoder.sol => /dev/null       |  36 --
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../common/StorageAccessible.sol => /dev/null      |  47 ---
 .../external/GnosisSafeMath.sol => /dev/null       |  54 ---
 .../ISignatureValidator.sol => /dev/null           |  20 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         | 155 --------
 .../Lister Multisig/proxy/meta.txt => /dev/null    |   2 -
 .../contracts/GnosisSafe.sol => /dev/null          | 422 ---------------------
 .../contracts/base/Executor.sol => /dev/null       |  27 --
 .../base/FallbackManager.sol => /dev/null          |  53 ---
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ---
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 -------
 .../contracts/base/OwnerManager.sol => /dev/null   | 149 --------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 --
 .../common/SelfAuthorized.sol => /dev/null         |  16 -
 .../common/SignatureDecoder.sol => /dev/null       |  36 --
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../common/StorageAccessible.sol => /dev/null      |  47 ---
 .../external/GnosisSafeMath.sol => /dev/null       |  54 ---
 .../ISignatureValidator.sol => /dev/null           |  20 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         | 155 --------
 .../Resume Multisig/proxy/meta.txt => /dev/null    |   2 -
 72 files changed, 4818 deletions(-)
```

Generated with discovered.json: 0x41c6e44818140d3abfbd12081543887091fe4c75

# Diff at Wed, 10 Apr 2024 11:32:14 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b05e9a9401061dc09d3987350e2d33de147386b8 block: 19531440
- current block number: 19624947

## Description

### RollupProcessorV3:

- Make processRollup() public by removing the `rollupProviders[msg.sender]` check from the function
- Remove default asset caps from the initializer (caps are currently set to 0)

This allows external participants to withdraw from the rollup and keeps deposits disabled, in line with their March 30 sunset.

### Verifier28x32:

Change of six constants.

From chatgpt:

- Two of the constants represent the elliptic curve point `Q2`
- The other four describe the elliptic curve point `g2_x`

These points among others are used to compute the verification key.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0x9BDc85491BD589e8390A6AAb6982b82255ae2297)
    +++ description: Verifier contract used by the RollupProcessorV2.
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
    +++ description: None
      upgradeability.implementation:
-        "0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"
+        "0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
      implementations.0:
-        "0x8430Be7B8fd28Cc58EA70A25C9c7A624F26f5D09"
+        "0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728"
      values.getImplementationVersion:
-        2
+        3
+++ description: Address of the ZK verifier.
+++ type: PERMISSION
+++ severity: LOW
      values.verifier:
-        "0x9BDc85491BD589e8390A6AAb6982b82255ae2297"
+        "0xb7baA1420f88b7758E341c93463426A2b7651CFB"
      derivedName:
-        "RollupProcessorV2"
+        "RollupProcessorV3"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0xb7baA1420f88b7758E341c93463426A2b7651CFB)
    +++ description: Verifier contract used by the RollupProcessorV2.
```

## Source code changes

```diff
.../contracts/access/AccessControl.sol             |  2 +-
 .../contracts/utils/Strings.sol                    |  2 +-
 .../contracts/utils/math/Math.sol                  |  4 +-
 .../RollupProcessorV2/implementation/meta.txt      |  4 +-
 .../src/core/processors/RollupProcessorV3.sol}     | 98 ++++++++--------------
 .../Verifier28x32/meta.txt                         |  2 +-
 .../core/verifier/keys/VerificationKey28x32.sol    | 18 ++--
 7 files changed, 49 insertions(+), 81 deletions(-)
```

Generated with discovered.json: 0x9e7064e6e198b24fb116f87b988a7ce0fed986a3

# Diff at Thu, 28 Mar 2024 08:32:53 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19326151
- current block number: 19531440

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19326151 (main branch discovery), not current.

```diff
    contract Emergency Multisig (0x23f8008159C0427458b948c3DD7795c6DBE8236F) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 15 (13%)"
    }
```

```diff
    contract Resume Multisig (0x62415C92528C7d86Fd3f82D3fc75c2F66Bb9389a) {
    +++ description: None
      upgradeability.threshold:
+        "10 of 15 (67%)"
    }
```

```diff
    contract Lister Multisig (0x68A36Aa8E309d5010ab4F9D6c5F1246b854D0b9e) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract Aztec Multisig (0xE298a76986336686CC3566469e3520d23D1a8aaD) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0x73d400dd88af30c348a74387ae0bf451c5f428db

# Diff at Wed, 28 Feb 2024 12:54:36 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@65091524debd9f36ca34aa554968373d1b3115a7 block: 18340180
- current block number: 19326151

## Description

On Feb 16, 2024 the verifier has been updated. The difference between the
source code contains only changes to hardcoded values. This update is way
simpler than AztecV1. The update was done in a single step and the Sequencer of
Aztec Connect still posts and processes data without reverts.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69) {
    }
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
      values.verifier:
-        "0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69"
+        "0x9BDc85491BD589e8390A6AAb6982b82255ae2297"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0x9BDc85491BD589e8390A6AAb6982b82255ae2297) {
    }
```

## Source code changes

```diff
.../Verifier28x32/meta.txt                         |  2 +-
 .../core/verifier/keys/VerificationKey28x32.sol    | 36 +++++++++++-----------
 2 files changed, 19 insertions(+), 19 deletions(-)
```

Generated with discovered.json: 0xd1fc1482dbb037a789f8c83db253e8e30567dad2

# Diff at Fri, 13 Oct 2023 08:09:03 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ac0c322776a31842f5549b3d357b8b4bc3bfd07f

## Description

Verification keys update.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier28x32 (0xB656f4219f565b93DF57D531B574E17FE0F25939) {
    }
```

```diff
    contract RollupProcessorV2 (0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455) {
      values.verifier:
-        "0xB656f4219f565b93DF57D531B574E17FE0F25939"
+        "0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69"
    }
```

```diff
+   Status: CREATED
    contract Verifier28x32 (0x71c0Ab7dF00F00E4ec2990D4F1C8302c1D178f69) {
    }
```

## Source code changes

```diff
.../{.code@18163333 => .code}/Verifier28x32/meta.txt   |  2 +-
 .../Verifier28x32/verifier/BaseStandardVerifier.sol    |  4 ++--
 .../Verifier28x32/verifier/instances/Verifier28x32.sol |  2 +-
 .../verifier/keys/VerificationKey28x32.sol             | 18 +++++++++---------
 4 files changed, 13 insertions(+), 13 deletions(-)
```

