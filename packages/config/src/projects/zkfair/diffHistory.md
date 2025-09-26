Generated with discovered.json: 0xa3894d3db36ffd799ff07ef851d48c471d6fc347

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xc10d62e10730c3561e3bd0914620e66c109f959e

# Diff at Mon, 14 Jul 2025 12:46:46 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22322978
- current block number: 22322978

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22322978 (main branch discovery), not current.

```diff
    contract ZKFairAdmin (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    +++ description: None
      address:
-        "0x0110B1B231aA3b96a94c900eb3056297526AB725"
+        "eth:0x0110B1B231aA3b96a94c900eb3056297526AB725"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x39FcAEb9870cB015f2165e93c51f4663AE970953"
+        "eth:0x39FcAEb9870cB015f2165e93c51f4663AE970953"
      values.$members.1:
-        "0x3226ECf79dc7007063599A334832d015B48aBDBc"
+        "eth:0x3226ECf79dc7007063599A334832d015B48aBDBc"
      values.$members.2:
-        "0x4dba6F06597Ea29A330C06806FA284610c810295"
+        "eth:0x4dba6F06597Ea29A330C06806FA284610c810295"
      values.$members.3:
-        "0xe1229a2716D19eC9aF74017418Fc9E165b80c7aF"
+        "eth:0xe1229a2716D19eC9aF74017418Fc9E165b80c7aF"
      implementationNames.0x0110B1B231aA3b96a94c900eb3056297526AB725:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x0110B1B231aA3b96a94c900eb3056297526AB725:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2) {
    +++ description: None
      address:
-        "0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2"
+        "eth:0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2"
    }
```

```diff
    EOA  (0x061D273bEf947BD0ef2B828526e710eEa0f297ae) {
    +++ description: None
      address:
-        "0x061D273bEf947BD0ef2B828526e710eEa0f297ae"
+        "eth:0x061D273bEf947BD0ef2B828526e710eEa0f297ae"
    }
```

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      address:
-        "0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
+        "eth:0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      values.$admin:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      values.$implementation:
-        "0x668965757127549f8755D2eEd10494B06420213b"
+        "eth:0x668965757127549f8755D2eEd10494B06420213b"
      values.$pastUpgrades.0.2.0:
-        "0x668965757127549f8755D2eEd10494B06420213b"
+        "eth:0x668965757127549f8755D2eEd10494B06420213b"
      values.admin:
-        "0x0110B1B231aA3b96a94c900eb3056297526AB725"
+        "eth:0x0110B1B231aA3b96a94c900eb3056297526AB725"
      values.bridgeAddress:
-        "0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
+        "eth:0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
      values.dataCommitteeAddress:
-        "0x997CfB0838544f68E59f877EDc905001456F125b"
+        "eth:0x997CfB0838544f68E59f877EDc905001456F125b"
      values.globalExitRootManager:
-        "0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
+        "eth:0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      values.matic:
-        "0x6dfAF52259d494C29596F5Eb16573B105693E78f"
+        "eth:0x6dfAF52259d494C29596F5Eb16573B105693E78f"
      values.owner:
-        "0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88"
+        "eth:0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rollupVerifier:
-        "0x769E285d2120472c3400A09684B82A842012F46d"
+        "eth:0x769E285d2120472c3400A09684B82A842012F46d"
      values.trustedAggregator:
-        "0xd6888c41EeAcc94f4A1CEe7A99E1557aa41FA027"
+        "eth:0xd6888c41EeAcc94f4A1CEe7A99E1557aa41FA027"
      values.trustedSequencer:
-        "0x9eed06d1566F0cAfdA3df624E2376864cA84Db6c"
+        "eth:0x9eed06d1566F0cAfdA3df624E2376864cA84Db6c"
      implementationNames.0x1CbC08bf0D48b18F9f97796c61352b192d1850A5:
-        "TransparentUpgradeableProxy"
      implementationNames.0x668965757127549f8755D2eEd10494B06420213b:
-        "CDKValidium"
      implementationNames.eth:0x1CbC08bf0D48b18F9f97796c61352b192d1850A5:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x668965757127549f8755D2eEd10494B06420213b:
+        "CDKValidium"
    }
```

```diff
    EOA  (0x3226ECf79dc7007063599A334832d015B48aBDBc) {
    +++ description: None
      address:
-        "0x3226ECf79dc7007063599A334832d015B48aBDBc"
+        "eth:0x3226ECf79dc7007063599A334832d015B48aBDBc"
    }
```

```diff
    EOA  (0x39FcAEb9870cB015f2165e93c51f4663AE970953) {
    +++ description: None
      address:
-        "0x39FcAEb9870cB015f2165e93c51f4663AE970953"
+        "eth:0x39FcAEb9870cB015f2165e93c51f4663AE970953"
    }
```

```diff
    EOA  (0x4B7f09f4D658638d81Bb2023674B80a9Dd7e9976) {
    +++ description: None
      address:
-        "0x4B7f09f4D658638d81Bb2023674B80a9Dd7e9976"
+        "eth:0x4B7f09f4D658638d81Bb2023674B80a9Dd7e9976"
    }
```

```diff
    EOA  (0x4dba6F06597Ea29A330C06806FA284610c810295) {
    +++ description: None
      address:
-        "0x4dba6F06597Ea29A330C06806FA284610c810295"
+        "eth:0x4dba6F06597Ea29A330C06806FA284610c810295"
    }
```

```diff
    contract Timelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    +++ description: None
      address:
-        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
+        "eth:0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.0:
-        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
+        "eth:0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      values.accessControl.TIMELOCK_ADMIN_ROLE.members.1:
-        "0x75575Dc1adD71eA794A52D83f836a13F7891C527"
+        "eth:0x75575Dc1adD71eA794A52D83f836a13F7891C527"
      values.accessControl.PROPOSER_ROLE.members.0:
-        "0x75575Dc1adD71eA794A52D83f836a13F7891C527"
+        "eth:0x75575Dc1adD71eA794A52D83f836a13F7891C527"
      values.accessControl.PROPOSER_ROLE.members.1:
-        "0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa"
+        "eth:0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x75575Dc1adD71eA794A52D83f836a13F7891C527"
+        "eth:0x75575Dc1adD71eA794A52D83f836a13F7891C527"
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa"
+        "eth:0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa"
      values.accessControl.CANCELLER_ROLE.members.0:
-        "0x75575Dc1adD71eA794A52D83f836a13F7891C527"
+        "eth:0x75575Dc1adD71eA794A52D83f836a13F7891C527"
      values.cdkValidium:
-        "0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
+        "eth:0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      implementationNames.0x52882c7564fAca480549145fAc4d0b09eD0D9c17:
-        "CDKValidiumTimelock"
      implementationNames.eth:0x52882c7564fAca480549145fAc4d0b09eD0D9c17:
+        "CDKValidiumTimelock"
    }
```

```diff
    EOA  (0x540C913ad8b197152EB041bC56f9c6Ab314D25Ba) {
    +++ description: None
      address:
-        "0x540C913ad8b197152EB041bC56f9c6Ab314D25Ba"
+        "eth:0x540C913ad8b197152EB041bC56f9c6Ab314D25Ba"
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      address:
-        "0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
+        "eth:0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      values.$admin:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      values.$implementation:
-        "0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615"
+        "eth:0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615"
      values.$pastUpgrades.0.2.0:
-        "0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615"
+        "eth:0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615"
      values.bridgeAddress:
-        "0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
+        "eth:0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
      values.rollupAddress:
-        "0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
+        "eth:0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      implementationNames.0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b:
-        "TransparentUpgradeableProxy"
      implementationNames.0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615:
-        "PolygonZkEVMGlobalExitRoot"
      implementationNames.eth:0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615:
+        "PolygonZkEVMGlobalExitRoot"
    }
```

```diff
    EOA  (0x75575Dc1adD71eA794A52D83f836a13F7891C527) {
    +++ description: None
      address:
-        "0x75575Dc1adD71eA794A52D83f836a13F7891C527"
+        "eth:0x75575Dc1adD71eA794A52D83f836a13F7891C527"
    }
```

```diff
    contract FflonkVerifier (0x769E285d2120472c3400A09684B82A842012F46d) {
    +++ description: None
      address:
-        "0x769E285d2120472c3400A09684B82A842012F46d"
+        "eth:0x769E285d2120472c3400A09684B82A842012F46d"
      implementationNames.0x769E285d2120472c3400A09684B82A842012F46d:
-        "FflonkVerifier"
      implementationNames.eth:0x769E285d2120472c3400A09684B82A842012F46d:
+        "FflonkVerifier"
    }
```

```diff
    contract ZKFairOwner (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88) {
    +++ description: None
      address:
-        "0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88"
+        "eth:0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x9fAe81C21be8D1Ad91c3617A7b0140dfe0DCe6C7"
+        "eth:0x9fAe81C21be8D1Ad91c3617A7b0140dfe0DCe6C7"
      values.$members.1:
-        "0x540C913ad8b197152EB041bC56f9c6Ab314D25Ba"
+        "eth:0x540C913ad8b197152EB041bC56f9c6Ab314D25Ba"
      values.$members.2:
-        "0xcf6226d0264496abB69eF8BC1DF366c9E00f5b87"
+        "eth:0xcf6226d0264496abB69eF8BC1DF366c9E00f5b87"
      values.$members.3:
-        "0x4B7f09f4D658638d81Bb2023674B80a9Dd7e9976"
+        "eth:0x4B7f09f4D658638d81Bb2023674B80a9Dd7e9976"
      implementationNames.0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x9231622437bD57349cC9a15CDEc5383627DEbA17) {
    +++ description: None
      address:
-        "0x9231622437bD57349cC9a15CDEc5383627DEbA17"
+        "eth:0x9231622437bD57349cC9a15CDEc5383627DEbA17"
    }
```

```diff
    EOA  (0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa) {
    +++ description: None
      address:
-        "0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa"
+        "eth:0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa"
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      address:
-        "0x997CfB0838544f68E59f877EDc905001456F125b"
+        "eth:0x997CfB0838544f68E59f877EDc905001456F125b"
      values.$admin:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      values.$implementation:
-        "0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc"
+        "eth:0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc"
      values.$pastUpgrades.0.2.0:
-        "0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc"
+        "eth:0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc"
      values.members.0.addr:
-        "0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2"
+        "eth:0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2"
      values.members.1.addr:
-        "0x061D273bEf947BD0ef2B828526e710eEa0f297ae"
+        "eth:0x061D273bEf947BD0ef2B828526e710eEa0f297ae"
      values.members.2.addr:
-        "0x9231622437bD57349cC9a15CDEc5383627DEbA17"
+        "eth:0x9231622437bD57349cC9a15CDEc5383627DEbA17"
      values.members.3.addr:
-        "0x9d8616545C9941138832EebC58Cb498E0ef21a13"
+        "eth:0x9d8616545C9941138832EebC58Cb498E0ef21a13"
      values.members.4.addr:
-        "0xFe1da7CAd939805d4A889822357c348177a5118d"
+        "eth:0xFe1da7CAd939805d4A889822357c348177a5118d"
      values.owner:
-        "0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70"
+        "eth:0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70"
      implementationNames.0x997CfB0838544f68E59f877EDc905001456F125b:
-        "TransparentUpgradeableProxy"
      implementationNames.0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc:
-        "CDKDataCommittee"
      implementationNames.eth:0x997CfB0838544f68E59f877EDc905001456F125b:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc:
+        "CDKDataCommittee"
    }
```

```diff
    contract OldBridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      address:
-        "0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
+        "eth:0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
      values.$admin:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      values.$implementation:
-        "0x58371687dc997A7A11154bBcA72aEb15e4Db8F46"
+        "eth:0x58371687dc997A7A11154bBcA72aEb15e4Db8F46"
      values.$pastUpgrades.0.2.0:
-        "0xEb80283EBc508CF6AaC5E054118954a2BD7fA006"
+        "eth:0xEb80283EBc508CF6AaC5E054118954a2BD7fA006"
      values.$pastUpgrades.1.2.0:
-        "0x58371687dc997A7A11154bBcA72aEb15e4Db8F46"
+        "eth:0x58371687dc997A7A11154bBcA72aEb15e4Db8F46"
      implementationNames.0x9cb4706e20A18E59a48ffa7616d700A3891e1861:
-        "TransparentUpgradeableProxy"
      implementationNames.0x58371687dc997A7A11154bBcA72aEb15e4Db8F46:
-        ""
      implementationNames.eth:0x9cb4706e20A18E59a48ffa7616d700A3891e1861:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x58371687dc997A7A11154bBcA72aEb15e4Db8F46:
+        ""
    }
```

```diff
    EOA  (0x9d8616545C9941138832EebC58Cb498E0ef21a13) {
    +++ description: None
      address:
-        "0x9d8616545C9941138832EebC58Cb498E0ef21a13"
+        "eth:0x9d8616545C9941138832EebC58Cb498E0ef21a13"
    }
```

```diff
    EOA  (0x9eed06d1566F0cAfdA3df624E2376864cA84Db6c) {
    +++ description: None
      address:
-        "0x9eed06d1566F0cAfdA3df624E2376864cA84Db6c"
+        "eth:0x9eed06d1566F0cAfdA3df624E2376864cA84Db6c"
    }
```

```diff
    EOA  (0x9fAe81C21be8D1Ad91c3617A7b0140dfe0DCe6C7) {
    +++ description: None
      address:
-        "0x9fAe81C21be8D1Ad91c3617A7b0140dfe0DCe6C7"
+        "eth:0x9fAe81C21be8D1Ad91c3617A7b0140dfe0DCe6C7"
    }
```

```diff
    EOA  (0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70) {
    +++ description: None
      address:
-        "0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70"
+        "eth:0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70"
    }
```

```diff
    contract Bridge (0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e) {
    +++ description: None
      address:
-        "0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e"
+        "eth:0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e"
      implementationNames.0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e:
-        ""
      implementationNames.eth:0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e:
+        ""
    }
```

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      address:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      values.owner:
-        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
+        "eth:0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      implementationNames.0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3:
-        "ProxyAdmin"
      implementationNames.eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0xcf6226d0264496abB69eF8BC1DF366c9E00f5b87) {
    +++ description: None
      address:
-        "0xcf6226d0264496abB69eF8BC1DF366c9E00f5b87"
+        "eth:0xcf6226d0264496abB69eF8BC1DF366c9E00f5b87"
    }
```

```diff
    EOA  (0xd6888c41EeAcc94f4A1CEe7A99E1557aa41FA027) {
    +++ description: None
      address:
-        "0xd6888c41EeAcc94f4A1CEe7A99E1557aa41FA027"
+        "eth:0xd6888c41EeAcc94f4A1CEe7A99E1557aa41FA027"
    }
```

```diff
    EOA  (0xe1229a2716D19eC9aF74017418Fc9E165b80c7aF) {
    +++ description: None
      address:
-        "0xe1229a2716D19eC9aF74017418Fc9E165b80c7aF"
+        "eth:0xe1229a2716D19eC9aF74017418Fc9E165b80c7aF"
    }
```

```diff
    EOA  (0xFe1da7CAd939805d4A889822357c348177a5118d) {
    +++ description: None
      address:
-        "0xFe1da7CAd939805d4A889822357c348177a5118d"
+        "eth:0xFe1da7CAd939805d4A889822357c348177a5118d"
    }
```

```diff
+   Status: CREATED
    contract ZKFairAdmin (0x0110B1B231aA3b96a94c900eb3056297526AB725)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x769E285d2120472c3400A09684B82A842012F46d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZKFairOwner (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b)
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
```

```diff
+   Status: CREATED
    contract OldBridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3)
    +++ description: None
```

Generated with discovered.json: 0x408fe88ca79ae236d4f26c36695a41db4ff0d6d8

# Diff at Fri, 04 Jul 2025 12:19:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22322978
- current block number: 22322978

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22322978 (main branch discovery), not current.

```diff
    contract Timelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      receivedPermissions.0.from:
-        "ethereum:0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
+        "eth:0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      receivedPermissions.1.from:
-        "ethereum:0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
+        "eth:0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      receivedPermissions.2.from:
-        "ethereum:0x997CfB0838544f68E59f877EDc905001456F125b"
+        "eth:0x997CfB0838544f68E59f877EDc905001456F125b"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      receivedPermissions.3.from:
-        "ethereum:0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
+        "eth:0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "eth:0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
    }
```

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
+        "eth:0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
+        "eth:0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x997CfB0838544f68E59f877EDc905001456F125b"
+        "eth:0x997CfB0838544f68E59f877EDc905001456F125b"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
+        "eth:0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
    }
```

Generated with discovered.json: 0x3a0098fb98652e3de6d33a803559ba6adcfd80af

# Diff at Fri, 23 May 2025 09:41:08 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22322978
- current block number: 22322978

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22322978 (main branch discovery), not current.

```diff
    contract Timelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    +++ description: None
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x5975b2a719d4e098e9f7f313d5184554b20e7a6c

# Diff at Tue, 29 Apr 2025 08:19:16 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22322978
- current block number: 22322978

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22322978 (main branch discovery), not current.

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x52882c7564fAca480549145fAc4d0b09eD0D9c17","via":[{"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]}]
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x52882c7564fAca480549145fAc4d0b09eD0D9c17","via":[{"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]}]
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x52882c7564fAca480549145fAc4d0b09eD0D9c17","via":[{"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]}]
    }
```

```diff
    contract OldBridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x52882c7564fAca480549145fAc4d0b09eD0D9c17","via":[{"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]}]
    }
```

Generated with discovered.json: 0x1805c3ccfef3c269f15939674254509419a81156

# Diff at Thu, 24 Apr 2025 10:31:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@564f772ef796772c9952d7432df8286347a08d9e block: 22322978
- current block number: 22322978

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22322978 (main branch discovery), not current.

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
+++ description: URL and address of the DAC member
      values.members.4:
-        ["http://119.28.1.197:8444","0x9d8616545C9941138832EebC58Cb498E0ef21a13"]
+        {"url":"http://43.155.22.171:8444","addr":"0x9231622437bD57349cC9a15CDEc5383627DEbA17"}
+++ description: URL and address of the DAC member
      values.members.3:
-        ["http://43.155.22.171:8444","0x9231622437bD57349cC9a15CDEc5383627DEbA17"]
+        {"url":"http://43.129.158.203:8444","addr":"0xFe1da7CAd939805d4A889822357c348177a5118d"}
+++ description: URL and address of the DAC member
      values.members.2:
-        ["http://43.129.159.5:8444","0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2"]
+        {"url":"http://119.28.1.197:8444","addr":"0x9d8616545C9941138832EebC58Cb498E0ef21a13"}
+++ description: URL and address of the DAC member
      values.members.1:
-        ["http://43.129.158.203:8444","0xFe1da7CAd939805d4A889822357c348177a5118d"]
+        {"url":"http://129.226.185.196:8444","addr":"0x061D273bEf947BD0ef2B828526e710eEa0f297ae"}
+++ description: URL and address of the DAC member
      values.members.0:
-        ["http://129.226.185.196:8444","0x061D273bEf947BD0ef2B828526e710eEa0f297ae"]
+        {"url":"http://43.129.159.5:8444","addr":"0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2"}
    }
```

Generated with discovered.json: 0xb4441644e04fc493c663f3a3cba3886d6f40cfbd

# Diff at Tue, 22 Apr 2025 07:14:25 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@60b07eece04f1a17d258d39ff1adffbef4174f23 block: 22166672
- current block number: 22322978

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22166672 (main branch discovery), not current.

```diff
    contract OldBridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      name:
-        "Bridge"
+        "OldBridge"
    }
```

```diff
+   Status: CREATED
    contract Bridge (0xb10f60B4Ea978CA02aFBAC57fa84907e8439766e)
    +++ description: None
```

Generated with discovered.json: 0xf7d12fae8f1a6f5eca7bda8230644a4d0ec6764c

# Diff at Mon, 31 Mar 2025 11:42:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 21086404
- current block number: 22166672

## Description

Bridge upgraded to an unverified implementation. Funds moved to an EOA and deposited to DeFi from there.

## Watched changes

```diff
    contract Timelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    +++ description: None
      values.accessControl.PROPOSER_ROLE.members.1:
+        "0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa"
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0x9412eCbEE1e8dd25F347D6d8002f62eF540ddDAa"
    }
```

```diff
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      sourceHashes:
-        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x63f00c3d965d6858168ed7d73fd0c413524877b196c4c5e3cf8fbc6ba40846e8"]
      values.$implementation:
-        "0xEb80283EBc508CF6AaC5E054118954a2BD7fA006"
+        "0x58371687dc997A7A11154bBcA72aEb15e4Db8F46"
      values.$pastUpgrades.1:
+        ["2023-12-18T06:01:23.000Z","0x22ef364422913d82a57f2fb0b440655ced0178c3549491490edff4663389f511",["0xEb80283EBc508CF6AaC5E054118954a2BD7fA006"]]
      values.$pastUpgrades.0.2:
-        "0x22ef364422913d82a57f2fb0b440655ced0178c3549491490edff4663389f511"
+        "0xca7c847dde27f60d98b07ef29ba9e0a677f28dddd980bb20c52f660c0071e768"
      values.$pastUpgrades.0.1:
-        "2023-12-18T06:01:23.000Z"
+        ["0x58371687dc997A7A11154bBcA72aEb15e4Db8F46"]
      values.$pastUpgrades.0.0:
-        ["0xEb80283EBc508CF6AaC5E054118954a2BD7fA006"]
+        "2025-03-27T05:30:59.000Z"
      values.$upgradeCount:
-        1
+        2
      values.admin:
-        "0xcd14BE1959928BB8c160D11817E2BE2129e2F25F"
      values.bridgeFee:
-        2500000000000000
      values.feeAddress:
-        "0xfED4D68744115A50ed22a6DA32DBA42eCaB5CF8D"
      values.gasTokenAddress:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.gasTokenDecimalDiffFactor:
-        1000000000000
      values.gasTokenMetadata:
-        "0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000005457468657200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034554480000000000000000000000000000000000000000000000000000000000"
      values.globalExitRootManager:
-        "0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      values.isEmergencyState:
-        false
      values.networkID:
-        0
      values.polygonZkEVMaddress:
-        "0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      derivedName:
-        "PolygonZkEVMBridge"
+        ""
      unverified:
+        true
    }
```

```diff
-   Status: DELETED
    contract BridgeAdminMultiSig (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F)
    +++ description: None
```

## Source code changes

```diff
.../Bridge/PolygonZkEVMBridge.sol => /dev/null     | 1477 --------------------
 .../GnosisSafe.sol => /dev/null                    |  953 -------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 3 files changed, 2465 deletions(-)
```

Generated with discovered.json: 0x6a9f7ec0e20103b14128f33bdcc0ee9e5d45422a

# Diff at Tue, 04 Mar 2025 10:40:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21086404
- current block number: 21086404

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21086404 (main branch discovery), not current.

```diff
    contract ZKFairAdmin (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    +++ description: None
      sinceBlock:
+        18807160
    }
```

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      sinceBlock:
+        18810967
    }
```

```diff
    contract Timelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    +++ description: None
      sinceBlock:
+        18810970
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      sinceBlock:
+        18810965
    }
```

```diff
    contract FflonkVerifier (0x769E285d2120472c3400A09684B82A842012F46d) {
    +++ description: None
      sinceBlock:
+        18810958
    }
```

```diff
    contract ZKFairOwner (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88) {
    +++ description: None
      sinceBlock:
+        18807134
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      sinceBlock:
+        18810964
    }
```

```diff
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      sinceBlock:
+        18810961
    }
```

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      sinceBlock:
+        18810959
    }
```

```diff
    contract BridgeAdminMultiSig (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F) {
    +++ description: None
      sinceBlock:
+        18807102
    }
```

Generated with discovered.json: 0x9516cf40a3f0a20b08d4ad32e14e36d00b337a53

# Diff at Mon, 20 Jan 2025 11:10:24 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21086404
- current block number: 21086404

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21086404 (main branch discovery), not current.

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
    }
```

```diff
    contract Timelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    +++ description: None
      receivedPermissions.3.target:
-        "0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
      receivedPermissions.3.from:
+        "0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
      receivedPermissions.2.target:
-        "0x997CfB0838544f68E59f877EDc905001456F125b"
      receivedPermissions.2.from:
+        "0x997CfB0838544f68E59f877EDc905001456F125b"
      receivedPermissions.1.target:
-        "0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      receivedPermissions.1.from:
+        "0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      receivedPermissions.0.target:
-        "0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      receivedPermissions.0.from:
+        "0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      directlyReceivedPermissions.0.target:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
      directlyReceivedPermissions.0.from:
+        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      issuedPermissions.0.target:
-        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
    }
```

```diff
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
    }
```

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      directlyReceivedPermissions.3.target:
-        "0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
      directlyReceivedPermissions.3.from:
+        "0x9cb4706e20A18E59a48ffa7616d700A3891e1861"
      directlyReceivedPermissions.2.target:
-        "0x997CfB0838544f68E59f877EDc905001456F125b"
      directlyReceivedPermissions.2.from:
+        "0x997CfB0838544f68E59f877EDc905001456F125b"
      directlyReceivedPermissions.1.target:
-        "0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      directlyReceivedPermissions.1.from:
+        "0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"
      directlyReceivedPermissions.0.target:
-        "0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
      directlyReceivedPermissions.0.from:
+        "0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"
    }
```

Generated with discovered.json: 0x866106455e93099c7d41f8efd660188d987dcd3b

# Diff at Thu, 31 Oct 2024 15:07:02 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3e423ff90004af2f328c2540ca5589b925f023a3 block: 20711816
- current block number: 21086404

## Description

Swapped ZkFairAdmin and BridgeAdmin roles, probably a labelling issue.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711816 (main branch discovery), not current.

```diff
    contract ZKFairAdmin (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    +++ description: None
      name:
-        "BridgeAdminMultiSig"
+        "ZKFairAdmin"
    }
```

```diff
    contract BridgeAdminMultiSig (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F) {
    +++ description: None
      name:
-        "ZKFairAdmin"
+        "BridgeAdminMultiSig"
    }
```

Generated with discovered.json: 0x30b1d000eea9b02da87a03cf07edc7fed1f6ac40

# Diff at Mon, 21 Oct 2024 12:50:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20711816
- current block number: 20711816

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711816 (main branch discovery), not current.

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      descriptions:
-        ["Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time."]
      description:
+        "Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time."
    }
```

Generated with discovered.json: 0x70c327cfd320506ab6d734eb788df5a798dae8d0

# Diff at Mon, 21 Oct 2024 11:12:22 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20711816
- current block number: 20711816

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711816 (main branch discovery), not current.

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x668965757127549f8755D2eEd10494B06420213b"]
      values.$pastUpgrades.0.1:
-        ["0x668965757127549f8755D2eEd10494B06420213b"]
+        "0xf231cd4ea460fef7127452f1f2e380080338d99b581b1fbdb69c02b3eb43c396"
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615"]
      values.$pastUpgrades.0.1:
-        ["0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615"]
+        "0x4e28f8a72e2c30b692920184f37ffd953bfdcc89b907a1284fbb986aad9bc686"
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      values.$pastUpgrades.0.2:
+        ["0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc"]
      values.$pastUpgrades.0.1:
-        ["0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc"]
+        "0xc32e3c87473e1564ad91461787c42867d6793e330617ca806ea1357c40fc4cba"
    }
```

```diff
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xEb80283EBc508CF6AaC5E054118954a2BD7fA006"]
      values.$pastUpgrades.0.1:
-        ["0xEb80283EBc508CF6AaC5E054118954a2BD7fA006"]
+        "0x22ef364422913d82a57f2fb0b440655ced0178c3549491490edff4663389f511"
    }
```

Generated with discovered.json: 0x0c3039250e4fa5407428285a25b2b50b1b63b689

# Diff at Mon, 14 Oct 2024 10:58:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20711816
- current block number: 20711816

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711816 (main branch discovery), not current.

```diff
    contract BridgeAdminMultiSig (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      issuedPermissions.0.via.0:
+        {"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3","delay":0}
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xf130a993ad1c6ad92168bdcb2f36fa45071cfdfccb13dd005d7d45e454089482"]
    }
```

```diff
    contract Timelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    +++ description: None
      sourceHashes:
+        ["0x1946b3da4b7b9101624b6f56e88c5546848e9acadd62375f5cc8772c0f11f92c"]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1CbC08bf0D48b18F9f97796c61352b192d1850A5","via":[{"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]},{"permission":"upgrade","target":"0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b","via":[{"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]},{"permission":"upgrade","target":"0x997CfB0838544f68E59f877EDc905001456F125b","via":[{"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]},{"permission":"upgrade","target":"0x9cb4706e20A18E59a48ffa7616d700A3891e1861","via":[{"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"}]
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      issuedPermissions.0.via.0:
+        {"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3","delay":0}
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0xb7beee2e185ac88119ddf52a7b183100c31b13dbb35154dd5b60e74c16684cba"]
    }
```

```diff
    contract FflonkVerifier (0x769E285d2120472c3400A09684B82A842012F46d) {
    +++ description: None
      sourceHashes:
+        ["0x2a8d8b10f3b85cd700a19db2ebb050c5acc6bdfd7bbd10f8b8229541fd5264ab"]
    }
```

```diff
    contract ZKFairOwner (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      issuedPermissions.0.target:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      issuedPermissions.0.via.0:
+        {"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3","delay":0}
      sourceHashes:
+        ["0x6d1bbfb1ed7d88848e594dc11366fbed3d53c5a507022c04dbeea72ef549cd6a","0x9cc000b5f37484491701d9b554b9a01ea89a6a59f918d1d53c8e173b5b14a0fe"]
    }
```

```diff
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3"
+        "0x52882c7564fAca480549145fAc4d0b09eD0D9c17"
      issuedPermissions.0.via.0:
+        {"address":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3","delay":0}
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0x63f00c3d965d6858168ed7d73fd0c413524877b196c4c5e3cf8fbc6ba40846e8"]
    }
```

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"},{"permission":"upgrade","target":"0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"},{"permission":"upgrade","target":"0x997CfB0838544f68E59f877EDc905001456F125b"},{"permission":"upgrade","target":"0x9cb4706e20A18E59a48ffa7616d700A3891e1861"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x1CbC08bf0D48b18F9f97796c61352b192d1850A5"},{"permission":"upgrade","target":"0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b"},{"permission":"upgrade","target":"0x997CfB0838544f68E59f877EDc905001456F125b"},{"permission":"upgrade","target":"0x9cb4706e20A18E59a48ffa7616d700A3891e1861"}]
    }
```

```diff
    contract ZKFairAdmin (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x41c594cf7d07adfb0a9de1a71bd31001abe520df

# Diff at Tue, 01 Oct 2024 11:11:59 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20711816
- current block number: 20711816

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20711816 (main branch discovery), not current.

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-18T06:02:35.000Z",["0x668965757127549f8755D2eEd10494B06420213b"]]]
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-18T06:02:11.000Z",["0xC4CD3D0b31904969a397A98AcE8bDF2A94ba8615"]]]
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      values.$pastUpgrades:
+        [["2023-12-18T06:01:59.000Z",["0x63150fA72c1c9fF8Fe4438f8355927D3415b0FDc"]]]
    }
```

```diff
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-18T06:01:23.000Z",["0xEb80283EBc508CF6AaC5E054118954a2BD7fA006"]]]
    }
```

Generated with discovered.json: 0x2ccdebaa7025806644571f9c5d25cfc70cd26a4b

# Diff at Mon, 09 Sep 2024 08:19:48 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20491472
- current block number: 20711816

## Description

DAC member URLs have changed (to Tencent). (Onchain addresses stay the same)

## Watched changes

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
+++ description: URL and address of the DAC member
      values.members.4.0:
-        "http://ec2-54-219-14-189.us-west-1.compute.amazonaws.com:8444"
+        "http://43.129.158.203:8444"
+++ description: URL and address of the DAC member
      values.members.3.0:
-        "http://ec2-18-144-4-166.us-west-1.compute.amazonaws.com:8444"
+        "http://119.28.1.197:8444"
+++ description: URL and address of the DAC member
      values.members.2.0:
-        "http://ec2-52-53-165-158.us-west-1.compute.amazonaws.com:8444"
+        "http://43.155.22.171:8444"
+++ description: URL and address of the DAC member
      values.members.1.0:
-        "http://ec2-54-153-117-150.us-west-1.compute.amazonaws.com:8444"
+        "http://129.226.185.196:8444"
+++ description: URL and address of the DAC member
      values.members.0.0:
-        "http://ec2-13-57-35-237.us-west-1.compute.amazonaws.com:8444"
+        "http://43.129.159.5:8444"
    }
```

Generated with discovered.json: 0x2aead1d8f69d1d3e33007e594e1a94f274b0458d

# Diff at Fri, 30 Aug 2024 08:01:43 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20491472
- current block number: 20491472

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491472 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xe62f2cfcbb59379f4daa78a452537f2342bde4be

# Diff at Fri, 23 Aug 2024 09:56:32 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20491472
- current block number: 20491472

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491472 (main branch discovery), not current.

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xc6036273804f66af71e134c94937ddb7753e9a2a

# Diff at Wed, 21 Aug 2024 10:06:41 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20491472
- current block number: 20491472

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20491472 (main branch discovery), not current.

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3","via":[]}]
    }
```

```diff
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3","via":[]}]
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3","via":[]}]
    }
```

```diff
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1CbC08bf0D48b18F9f97796c61352b192d1850A5","0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b","0x997CfB0838544f68E59f877EDc905001456F125b","0x9cb4706e20A18E59a48ffa7616d700A3891e1861"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1CbC08bf0D48b18F9f97796c61352b192d1850A5","via":[]},{"permission":"upgrade","target":"0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b","via":[]},{"permission":"upgrade","target":"0x997CfB0838544f68E59f877EDc905001456F125b","via":[]},{"permission":"upgrade","target":"0x9cb4706e20A18E59a48ffa7616d700A3891e1861","via":[]}]
    }
```

Generated with discovered.json: 0xed332bb01b0b9c882819f7b27e047b3e67fd5261

# Diff at Fri, 09 Aug 2024 13:54:22 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@55033526285d11b30f44e7cea5874c4f4d65ed80 block: 19726116
- current block number: 20491472

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19726116 (main branch discovery), not current.

```diff
    contract BridgeAdminMultiSig (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x39FcAEb9870cB015f2165e93c51f4663AE970953","0x3226ECf79dc7007063599A334832d015B48aBDBc","0x4dba6F06597Ea29A330C06806FA284610c810295","0xe1229a2716D19eC9aF74017418Fc9E165b80c7aF"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x39FcAEb9870cB015f2165e93c51f4663AE970953","0x3226ECf79dc7007063599A334832d015B48aBDBc","0x4dba6F06597Ea29A330C06806FA284610c810295","0xe1229a2716D19eC9aF74017418Fc9E165b80c7aF"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ZKFairValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    +++ description: None
      name:
-        "CDKValidium"
+        "ZKFairValidium"
    }
```

```diff
    contract ZKFairOwner (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88) {
    +++ description: None
      name:
-        "ZkFairOwner"
+        "ZKFairOwner"
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x9fAe81C21be8D1Ad91c3617A7b0140dfe0DCe6C7","0x540C913ad8b197152EB041bC56f9c6Ab314D25Ba","0xcf6226d0264496abB69eF8BC1DF366c9E00f5b87","0x4B7f09f4D658638d81Bb2023674B80a9Dd7e9976"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x9fAe81C21be8D1Ad91c3617A7b0140dfe0DCe6C7","0x540C913ad8b197152EB041bC56f9c6Ab314D25Ba","0xcf6226d0264496abB69eF8BC1DF366c9E00f5b87","0x4B7f09f4D658638d81Bb2023674B80a9Dd7e9976"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ZKFairValidiumDAC (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      name:
-        "DataAvailabilityCommittee"
+        "ZKFairValidiumDAC"
    }
```

```diff
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1CbC08bf0D48b18F9f97796c61352b192d1850A5","0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b","0x997CfB0838544f68E59f877EDc905001456F125b","0x9cb4706e20A18E59a48ffa7616d700A3891e1861"]
      assignedPermissions.upgrade:
+        ["0x1CbC08bf0D48b18F9f97796c61352b192d1850A5","0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b","0x997CfB0838544f68E59f877EDc905001456F125b","0x9cb4706e20A18E59a48ffa7616d700A3891e1861"]
    }
```

```diff
    contract ZKFairAdmin (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F) {
    +++ description: None
      name:
-        "ZkFairAdmin"
+        "ZKFairAdmin"
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x4Ea1f0f05E7484Ee85a97303DC88c2dF4288df3e","0x44fb52EB2bdDAf1c8b6D441e0b5DCa123A345292","0x689752C198f0cEbe9993ee3E13AF0e565C068c25","0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x4Ea1f0f05E7484Ee85a97303DC88c2dF4288df3e","0x44fb52EB2bdDAf1c8b6D441e0b5DCa123A345292","0x689752C198f0cEbe9993ee3E13AF0e565C068c25","0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x51b2157fcccfb97900a682a1d4e14cefcb32243e

# Diff at Tue, 30 Jul 2024 11:16:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 19726116
- current block number: 19726116

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19726116 (main branch discovery), not current.

```diff
    contract DataAvailabilityCommittee (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
      fieldMeta:
+        {"members":{"description":"URL and address of the DAC member"}}
    }
```

Generated with discovered.json: 0x4d0c74d7a0df038803ca04650c436dd850144828

# Diff at Wed, 24 Apr 2024 15:27:14 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@6a7ceb7b00aa6aba87217de183c2311e454dcd88 block: 19532302
- current block number: 19726116

## Description

The URLs on amazon aws for all 5 DAC members are changed. Their onchain addresses remain the same.

## Watched changes

```diff
    contract DataAvailabilityCommittee (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
+++ description: URL and address of the DAC member
      values.members.4.0:
-        "http://ec2-18-163-127-148.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-54-219-14-189.us-west-1.compute.amazonaws.com:8444"
+++ description: URL and address of the DAC member
      values.members.3.0:
-        "http://ec2-18-167-116-200.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-18-144-4-166.us-west-1.compute.amazonaws.com:8444"
+++ description: URL and address of the DAC member
      values.members.2.0:
-        "http://ec2-43-198-25-156.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-52-53-165-158.us-west-1.compute.amazonaws.com:8444"
+++ description: URL and address of the DAC member
      values.members.1.0:
-        "http://ec2-18-163-181-171.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-54-153-117-150.us-west-1.compute.amazonaws.com:8444"
+++ description: URL and address of the DAC member
      values.members.0.0:
-        "http://ec2-18-166-77-46.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-13-57-35-237.us-west-1.compute.amazonaws.com:8444"
    }
```

Generated with discovered.json: 0x2d47f405a658acbfa64515a3572659d31fdc3fae

# Diff at Thu, 28 Mar 2024 11:26:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19167749
- current block number: 19532302

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19167749 (main branch discovery), not current.

```diff
    contract BridgeAdminMultiSig (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ZkFairOwner (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ZkFairAdmin (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xa2429a0f47ee517399aca4dfbfda0b72c5610ea8

# Diff at Fri, 12 Jan 2024 15:03:34 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@8dedac1fc64b221baf7fd1da0dd78d78b5208ffb block: 18841455
- current block number: 18991587

## Description

DataAvailabilityCommittee contract (CDKDataCommittee) became verified, exposing
addresses of committee members. This committee attests that data for a given
dataRoot has been published. The DAC Owner can update the member set at any
time.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18841455 (main branch discovery), not current.

```diff
    contract DataAvailabilityCommittee (0x997CfB0838544f68E59f877EDc905001456F125b) {
      unverified:
-        true
      derivedName:
-        ""
+        "CDKDataCommittee"
      values:
+        {"committeeHash":"0xba409e01b8959e09c11202ce45dd3e4ac8aa7e21440e86c1e9dc924369151fca","getAmountOfMembers":5,"members":[["http://ec2-18-166-77-46.ap-east-1.compute.amazonaws.com:8444","0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2"],["http://ec2-18-163-181-171.ap-east-1.compute.amazonaws.com:8444","0x061D273bEf947BD0ef2B828526e710eEa0f297ae"],["http://ec2-43-198-25-156.ap-east-1.compute.amazonaws.com:8444","0x9231622437bD57349cC9a15CDEc5383627DEbA17"],["http://ec2-18-167-116-200.ap-east-1.compute.amazonaws.com:8444","0x9d8616545C9941138832EebC58Cb498E0ef21a13"],["http://ec2-18-163-127-148.ap-east-1.compute.amazonaws.com:8444","0xFe1da7CAd939805d4A889822357c348177a5118d"]],"owner":"0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70","requiredAmountOfSignatures":3}
    }
```

# Diff at Thu, 21 Dec 2023 14:05:42 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Add initial config for ZKFair.

## Watched changes

```diff
+   Status: CREATED
    contract GnosisSafe (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    }
```

```diff
+   Status: CREATED
    contract CDKValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    }
```

```diff
+   Status: CREATED
    contract CDKValidiumTimelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    }
```

```diff
+   Status: CREATED
    contract  (0x6dfAF52259d494C29596F5Eb16573B105693E78f) {
    }
```

```diff
+   Status: CREATED
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x769E285d2120472c3400A09684B82A842012F46d) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88) {
    }
```

```diff
+   Status: CREATED
    contract  (0x997CfB0838544f68E59f877EDc905001456F125b) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F) {
    }
```

