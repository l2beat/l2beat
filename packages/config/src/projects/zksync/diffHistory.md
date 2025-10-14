Generated with discovered.json: 0x57db3e05b4808e8084a3e933a2bde465bbf78755

# Diff at Tue, 07 Oct 2025 14:25:01 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@8565ff097fc0a7fe0355555b648b1799518c8f35 block: 1759759105
- current timestamp: 1759847038

## Description

Removed old zksync validator.

## Watched changes

```diff
    contract Governance (eth:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      values.validators.0:
-        "eth:0x01c3A1a6890A146aC187A019F9863B3Ab2BfF91e"
    }
```

Generated with discovered.json: 0x9a8fb769f5cf9b0fee62d9a6191c69db9d3703f6

# Diff at Mon, 06 Oct 2025 13:59:28 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@af10d4e90bc0f1be21a0242f8327fccf9a01f37a block: 1751371847
- current timestamp: 1759759105

## Description

Updated Verifier (diff https://disco.l2beat.com/diff/eth:0x6e95812C432F293b8045811F4B1758285EBDB206/eth:0x57B09100e6160503aBDEBC76012b6c358eA4e462): changed verifier key tree root; two constants not used in verifier aligned with the values used in the rollup contract. See this tweet: https://x.com/zkSyncDevs/status/1968062194832249336.

Also added a new validator and changed one multisig member.

## Watched changes

```diff
    contract Governance (eth:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      values.validators.1:
+        "eth:0x0C6E6F8bb16846a0E9E866F3B9b8ec071f885Df5"
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      values.versionId:
-        11
+        12
    }
```

```diff
    contract Verifier (eth:0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      sourceHashes.1:
-        "0xcf125cd39e9e7620aea95320666f3e3c19a3ae1da200337d94d11de29e8d97af"
+        "0xd2a07a5a9b9bf3e2f936b5530eabc67694e9fa89a92407b692f35c2a46175f39"
      values.$implementation:
-        "eth:0x6e95812C432F293b8045811F4B1758285EBDB206"
+        "eth:0x57B09100e6160503aBDEBC76012b6c358eA4e462"
      implementationNames.eth:0x6e95812C432F293b8045811F4B1758285EBDB206:
-        "Verifier"
      implementationNames.eth:0x57B09100e6160503aBDEBC76012b6c358eA4e462:
+        "Verifier"
    }
```

```diff
    contract ZkSync Multisig (eth:0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$members.3:
-        "eth:0x890Da36c3dD697CbB88E616668BEDaFA369f3793"
+        "eth:0xC9474de11503D63D892cEDD12d6B93f6A25a9cbF"
    }
```

## Source code changes

```diff
.../zksync/{.flat@1751371847 => .flat}/Verifier/Verifier.sol        | 6 +++---
 1 file changed, 3 insertions(+), 3 deletions(-)
```

Generated with discovered.json: 0x0c31b750bd6ecdbdbb7b0740525594da5b1cbe80

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xdd7dc7dfce7e80c35cff823036b6610deec420b7

# Diff at Mon, 14 Jul 2025 12:46:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22824302
- current block number: 22824302

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22824302 (main branch discovery), not current.

```diff
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346) {
    +++ description: None
      address:
-        "0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346"
+        "eth:0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346"
      values.$implementation:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
      values.$members.0:
-        "0x4326E446013908fBEEE4ce7b6935219c01854B21"
+        "eth:0x4326E446013908fBEEE4ce7b6935219c01854B21"
      values.$members.1:
-        "0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B"
+        "eth:0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B"
      values.$members.2:
-        "0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8"
+        "eth:0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8"
      values.$members.3:
-        "0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3"
+        "eth:0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3"
      implementationNames.0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346:
-        "Proxy"
      implementationNames.0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
-        "GnosisSafe"
      implementationNames.eth:0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346:
+        "Proxy"
      implementationNames.eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x01c3A1a6890A146aC187A019F9863B3Ab2BfF91e) {
    +++ description: None
      address:
-        "0x01c3A1a6890A146aC187A019F9863B3Ab2BfF91e"
+        "eth:0x01c3A1a6890A146aC187A019F9863B3Ab2BfF91e"
    }
```

```diff
    EOA  (0x050b37a12451F188c7bA53D48b8A1adE6D138E71) {
    +++ description: None
      address:
-        "0x050b37a12451F188c7bA53D48b8A1adE6D138E71"
+        "eth:0x050b37a12451F188c7bA53D48b8A1adE6D138E71"
    }
```

```diff
    EOA  (0x0d4E989c7620C8749c9417d2BF218896C767B606) {
    +++ description: None
      address:
-        "0x0d4E989c7620C8749c9417d2BF218896C767B606"
+        "eth:0x0d4E989c7620C8749c9417d2BF218896C767B606"
    }
```

```diff
    EOA  (0x106fc088aBA908130fBC343F2F6d212Ff36150D1) {
    +++ description: None
      address:
-        "0x106fc088aBA908130fBC343F2F6d212Ff36150D1"
+        "eth:0x106fc088aBA908130fBC343F2F6d212Ff36150D1"
    }
```

```diff
    EOA  (0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8) {
    +++ description: None
      address:
-        "0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8"
+        "eth:0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8"
    }
```

```diff
    EOA  (0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016) {
    +++ description: None
      address:
-        "0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016"
+        "eth:0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016"
    }
```

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      address:
-        "0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567"
+        "eth:0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567"
      values.$implementation:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
      values.$members.0:
-        "0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da"
+        "eth:0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da"
      values.$members.1:
-        "0xD804aB3355a634aEBd45e1252d6208807defD554"
+        "eth:0xD804aB3355a634aEBd45e1252d6208807defD554"
      values.$members.2:
-        "0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193"
+        "eth:0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193"
      values.$members.3:
-        "0x106fc088aBA908130fBC343F2F6d212Ff36150D1"
+        "eth:0x106fc088aBA908130fBC343F2F6d212Ff36150D1"
      values.$members.4:
-        "0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe"
+        "eth:0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe"
      values.$members.5:
-        "0xf6dcD4d7141E06B916987C3C46220f6241278a30"
+        "eth:0xf6dcD4d7141E06B916987C3C46220f6241278a30"
      implementationNames.0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567:
-        "Proxy"
      implementationNames.0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
-        "GnosisSafe"
      implementationNames.eth:0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567:
+        "Proxy"
      implementationNames.eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da) {
    +++ description: None
      address:
-        "0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da"
+        "eth:0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da"
    }
```

```diff
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e) {
    +++ description: None
      address:
-        "0x225d3822De44E58eE935440E0c0B829C4232086e"
+        "eth:0x225d3822De44E58eE935440E0c0B829C4232086e"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB1A308e7F02798377b7acF685E997E3D774c5863"
+        "eth:0xB1A308e7F02798377b7acF685E997E3D774c5863"
      values.$members.1:
-        "0x0d4E989c7620C8749c9417d2BF218896C767B606"
+        "eth:0x0d4E989c7620C8749c9417d2BF218896C767B606"
      values.$members.2:
-        "0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016"
+        "eth:0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016"
      implementationNames.0x225d3822De44E58eE935440E0c0B829C4232086e:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x225d3822De44E58eE935440E0c0B829C4232086e:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x2A0a81e257a2f5D6eD4F07b81DbDa09F107bd027) {
    +++ description: None
      address:
-        "0x2A0a81e257a2f5D6eD4F07b81DbDa09F107bd027"
+        "eth:0x2A0a81e257a2f5D6eD4F07b81DbDa09F107bd027"
    }
```

```diff
    EOA  (0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc) {
    +++ description: None
      address:
-        "0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
+        "eth:0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
    }
```

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      address:
-        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
+        "eth:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
      values.$admin:
-        "0x38A43F4330f24fe920F943409709fc9A6084C939"
+        "eth:0x38A43F4330f24fe920F943409709fc9A6084C939"
      values.$implementation:
-        "0x3FBc7C6c2437dE24F91b2Ca61Fc7AD3D2D62F4c8"
+        "eth:0x3FBc7C6c2437dE24F91b2Ca61Fc7AD3D2D62F4c8"
      values.defaultFactory:
-        "0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D"
+        "eth:0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D"
      values.networkGovernor:
-        "0xE24f4870Ab85DE8E356C5fC56138587206c70d99"
+        "eth:0xE24f4870Ab85DE8E356C5fC56138587206c70d99"
      values.tokenGovernance:
-        "0x35cc31f63deef017c38d51B038891bAE7d614e86"
+        "eth:0x35cc31f63deef017c38d51B038891bAE7d614e86"
      values.validators.0:
-        "0x01c3A1a6890A146aC187A019F9863B3Ab2BfF91e"
+        "eth:0x01c3A1a6890A146aC187A019F9863B3Ab2BfF91e"
      implementationNames.0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01:
-        "Proxy"
      implementationNames.0x3FBc7C6c2437dE24F91b2Ca61Fc7AD3D2D62F4c8:
-        "Governance"
      implementationNames.eth:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01:
+        "Proxy"
      implementationNames.eth:0x3FBc7C6c2437dE24F91b2Ca61Fc7AD3D2D62F4c8:
+        "Governance"
    }
```

```diff
    contract TokenGovernance (0x35cc31f63deef017c38d51B038891bAE7d614e86) {
    +++ description: None
      address:
-        "0x35cc31f63deef017c38d51B038891bAE7d614e86"
+        "eth:0x35cc31f63deef017c38d51B038891bAE7d614e86"
      values.governance:
-        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
+        "eth:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
      values.listingFeeToken:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.tokenListers.0:
-        "0xE24f4870Ab85DE8E356C5fC56138587206c70d99"
+        "eth:0xE24f4870Ab85DE8E356C5fC56138587206c70d99"
      values.treasury:
-        "0x2A0a81e257a2f5D6eD4F07b81DbDa09F107bd027"
+        "eth:0x2A0a81e257a2f5D6eD4F07b81DbDa09F107bd027"
      implementationNames.0x35cc31f63deef017c38d51B038891bAE7d614e86:
-        "TokenGovernance"
      implementationNames.eth:0x35cc31f63deef017c38d51B038891bAE7d614e86:
+        "TokenGovernance"
    }
```

```diff
    EOA  (0x37A71E0C1A5808343D893Db40e12A74e0A387908) {
    +++ description: None
      address:
-        "0x37A71E0C1A5808343D893Db40e12A74e0A387908"
+        "eth:0x37A71E0C1A5808343D893Db40e12A74e0A387908"
    }
```

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      address:
-        "0x38A43F4330f24fe920F943409709fc9A6084C939"
+        "eth:0x38A43F4330f24fe920F943409709fc9A6084C939"
      values.getMaster:
-        "0xE24f4870Ab85DE8E356C5fC56138587206c70d99"
+        "eth:0xE24f4870Ab85DE8E356C5fC56138587206c70d99"
      values.mainContract:
-        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
+        "eth:0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
      values.managedContracts.0:
-        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
+        "eth:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
      values.managedContracts.1:
-        "0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
+        "eth:0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
      values.managedContracts.2:
-        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
+        "eth:0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
      implementationNames.0x38A43F4330f24fe920F943409709fc9A6084C939:
-        "UpgradeGatekeeper"
      implementationNames.eth:0x38A43F4330f24fe920F943409709fc9A6084C939:
+        "UpgradeGatekeeper"
    }
```

```diff
    EOA  (0x39415255619783A2E71fcF7d8f708A951d92e1b6) {
    +++ description: None
      address:
-        "0x39415255619783A2E71fcF7d8f708A951d92e1b6"
+        "eth:0x39415255619783A2E71fcF7d8f708A951d92e1b6"
    }
```

```diff
    EOA  (0x399a6a13D298CF3F41a562966C1a450136Ea52C2) {
    +++ description: None
      address:
-        "0x399a6a13D298CF3F41a562966C1a450136Ea52C2"
+        "eth:0x399a6a13D298CF3F41a562966C1a450136Ea52C2"
    }
```

```diff
    EOA  (0x4326E446013908fBEEE4ce7b6935219c01854B21) {
    +++ description: None
      address:
-        "0x4326E446013908fBEEE4ce7b6935219c01854B21"
+        "eth:0x4326E446013908fBEEE4ce7b6935219c01854B21"
    }
```

```diff
    EOA  (0x45F9AfCf9565051344aFb36e665f4d7bb2d18415) {
    +++ description: None
      address:
-        "0x45F9AfCf9565051344aFb36e665f4d7bb2d18415"
+        "eth:0x45F9AfCf9565051344aFb36e665f4d7bb2d18415"
    }
```

```diff
    EOA  (0x4964D00fA975a7346ee6196a94b07c01ed1cD3CE) {
    +++ description: None
      address:
-        "0x4964D00fA975a7346ee6196a94b07c01ed1cD3CE"
+        "eth:0x4964D00fA975a7346ee6196a94b07c01ed1cD3CE"
    }
```

```diff
    EOA  (0x4d1E3089042Ab3A93E03CA88B566b99Bd22438C6) {
    +++ description: None
      address:
-        "0x4d1E3089042Ab3A93E03CA88B566b99Bd22438C6"
+        "eth:0x4d1E3089042Ab3A93E03CA88B566b99Bd22438C6"
    }
```

```diff
    EOA  (0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B) {
    +++ description: None
      address:
-        "0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B"
+        "eth:0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B"
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      address:
-        "0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
+        "eth:0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
      values.$admin:
-        "0x38A43F4330f24fe920F943409709fc9A6084C939"
+        "eth:0x38A43F4330f24fe920F943409709fc9A6084C939"
      values.$implementation:
-        "0x6e95812C432F293b8045811F4B1758285EBDB206"
+        "eth:0x6e95812C432F293b8045811F4B1758285EBDB206"
      implementationNames.0x5290E9582B4FB706EaDf87BB1c129e897e04d06D:
-        "Proxy"
      implementationNames.0x6e95812C432F293b8045811F4B1758285EBDB206:
-        "Verifier"
      implementationNames.eth:0x5290E9582B4FB706EaDf87BB1c129e897e04d06D:
+        "Proxy"
      implementationNames.eth:0x6e95812C432F293b8045811F4B1758285EBDB206:
+        "Verifier"
    }
```

```diff
    EOA  (0x702caCafA54B88e9c54449563Fb2e496e85c78b7) {
    +++ description: None
      address:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "eth:0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
    }
```

```diff
    EOA  (0x71E805aB236c945165b9Cd0bf95B9f2F0A0488c3) {
    +++ description: None
      address:
-        "0x71E805aB236c945165b9Cd0bf95B9f2F0A0488c3"
+        "eth:0x71E805aB236c945165b9Cd0bf95B9f2F0A0488c3"
    }
```

```diff
    EOA  (0x76C6cE74EAb57254E785d1DcC3f812D274bCcB11) {
    +++ description: None
      address:
-        "0x76C6cE74EAb57254E785d1DcC3f812D274bCcB11"
+        "eth:0x76C6cE74EAb57254E785d1DcC3f812D274bCcB11"
    }
```

```diff
    contract NftFactory (0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D) {
    +++ description: None
      address:
-        "0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D"
+        "eth:0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D"
      implementationNames.0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D:
-        "ZkSyncNFTFactory"
      implementationNames.eth:0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D:
+        "ZkSyncNFTFactory"
    }
```

```diff
    EOA  (0x890Da36c3dD697CbB88E616668BEDaFA369f3793) {
    +++ description: None
      address:
-        "0x890Da36c3dD697CbB88E616668BEDaFA369f3793"
+        "eth:0x890Da36c3dD697CbB88E616668BEDaFA369f3793"
    }
```

```diff
    EOA  (0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607) {
    +++ description: None
      address:
-        "0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607"
+        "eth:0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607"
    }
```

```diff
    EOA  (0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3) {
    +++ description: None
      address:
-        "0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3"
+        "eth:0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3"
    }
```

```diff
    EOA  (0xA093284c707e207C36E3FEf9e0B6325fd9d0e33B) {
    +++ description: None
      address:
-        "0xA093284c707e207C36E3FEf9e0B6325fd9d0e33B"
+        "eth:0xA093284c707e207C36E3FEf9e0B6325fd9d0e33B"
    }
```

```diff
    EOA  (0xa2602ea835E03fb39CeD30B43d6b6EAf6aDe1769) {
    +++ description: None
      address:
-        "0xa2602ea835E03fb39CeD30B43d6b6EAf6aDe1769"
+        "eth:0xa2602ea835E03fb39CeD30B43d6b6EAf6aDe1769"
    }
```

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
    +++ description: None
      address:
-        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
+        "eth:0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
      values.$admin:
-        "0x38A43F4330f24fe920F943409709fc9A6084C939"
+        "eth:0x38A43F4330f24fe920F943409709fc9A6084C939"
      values.$implementation.0:
-        "0x8e972b354E6933275513C355Ee14D44A832aD2d9"
+        "eth:0x8e972b354E6933275513C355Ee14D44A832aD2d9"
      values.$implementation.1:
-        "0x2eaa1377e0fC95dE998B9fA7611E9D67ebA534fD"
+        "eth:0x2eaa1377e0fC95dE998B9fA7611E9D67ebA534fD"
      values.governance:
-        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
+        "eth:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
      values.securityCouncilMembers.0:
-        "0xa2602ea835E03fb39CeD30B43d6b6EAf6aDe1769"
+        "eth:0xa2602ea835E03fb39CeD30B43d6b6EAf6aDe1769"
      values.securityCouncilMembers.1:
-        "0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607"
+        "eth:0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607"
      values.securityCouncilMembers.2:
-        "0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346"
+        "eth:0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346"
      values.securityCouncilMembers.3:
-        "0x71E805aB236c945165b9Cd0bf95B9f2F0A0488c3"
+        "eth:0x71E805aB236c945165b9Cd0bf95B9f2F0A0488c3"
      values.securityCouncilMembers.4:
-        "0x76C6cE74EAb57254E785d1DcC3f812D274bCcB11"
+        "eth:0x76C6cE74EAb57254E785d1DcC3f812D274bCcB11"
      values.securityCouncilMembers.5:
-        "0xFBfF3FF69D65A9103Bf4fdBf988f5271D12B3190"
+        "eth:0xFBfF3FF69D65A9103Bf4fdBf988f5271D12B3190"
      values.securityCouncilMembers.6:
-        "0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6"
+        "eth:0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6"
      values.securityCouncilMembers.7:
-        "0x4d1E3089042Ab3A93E03CA88B566b99Bd22438C6"
+        "eth:0x4d1E3089042Ab3A93E03CA88B566b99Bd22438C6"
      values.securityCouncilMembers.8:
-        "0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567"
+        "eth:0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567"
      values.securityCouncilMembers.9:
-        "0x39415255619783A2E71fcF7d8f708A951d92e1b6"
+        "eth:0x39415255619783A2E71fcF7d8f708A951d92e1b6"
      values.securityCouncilMembers.10:
-        "0x399a6a13D298CF3F41a562966C1a450136Ea52C2"
+        "eth:0x399a6a13D298CF3F41a562966C1a450136Ea52C2"
      values.securityCouncilMembers.11:
-        "0xee8AE1F1B4B1E1956C8Bda27eeBCE54Cf0bb5eaB"
+        "eth:0xee8AE1F1B4B1E1956C8Bda27eeBCE54Cf0bb5eaB"
      values.securityCouncilMembers.12:
-        "0xe7CCD4F3feA7df88Cf9B59B30f738ec1E049231f"
+        "eth:0xe7CCD4F3feA7df88Cf9B59B30f738ec1E049231f"
      values.securityCouncilMembers.13:
-        "0xA093284c707e207C36E3FEf9e0B6325fd9d0e33B"
+        "eth:0xA093284c707e207C36E3FEf9e0B6325fd9d0e33B"
      values.securityCouncilMembers.14:
-        "0x225d3822De44E58eE935440E0c0B829C4232086e"
+        "eth:0x225d3822De44E58eE935440E0c0B829C4232086e"
      values.verifier:
-        "0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
+        "eth:0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
      implementationNames.0xaBEA9132b05A70803a4E85094fD0e1800777fBEF:
-        "Proxy"
      implementationNames.0x8e972b354E6933275513C355Ee14D44A832aD2d9:
-        "ZkSync"
      implementationNames.0x2eaa1377e0fC95dE998B9fA7611E9D67ebA534fD:
-        "AdditionalZkSync"
      implementationNames.eth:0xaBEA9132b05A70803a4E85094fD0e1800777fBEF:
+        "Proxy"
      implementationNames.eth:0x8e972b354E6933275513C355Ee14D44A832aD2d9:
+        "ZkSync"
      implementationNames.eth:0x2eaa1377e0fC95dE998B9fA7611E9D67ebA534fD:
+        "AdditionalZkSync"
    }
```

```diff
    contract Proxy (0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6) {
    +++ description: None
      address:
-        "0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6"
+        "eth:0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6"
      implementationNames.0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6:
-        "Proxy"
      implementationNames.eth:0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6:
+        "Proxy"
    }
```

```diff
    EOA  (0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193) {
    +++ description: None
      address:
-        "0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193"
+        "eth:0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193"
    }
```

```diff
    EOA  (0xB1A308e7F02798377b7acF685E997E3D774c5863) {
    +++ description: None
      address:
-        "0xB1A308e7F02798377b7acF685E997E3D774c5863"
+        "eth:0xB1A308e7F02798377b7acF685E997E3D774c5863"
    }
```

```diff
    EOA  (0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA) {
    +++ description: None
      address:
-        "0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA"
+        "eth:0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA"
    }
```

```diff
    EOA  (0xD804aB3355a634aEBd45e1252d6208807defD554) {
    +++ description: None
      address:
-        "0xD804aB3355a634aEBd45e1252d6208807defD554"
+        "eth:0xD804aB3355a634aEBd45e1252d6208807defD554"
    }
```

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      address:
-        "0xE24f4870Ab85DE8E356C5fC56138587206c70d99"
+        "eth:0xE24f4870Ab85DE8E356C5fC56138587206c70d99"
      values.$implementation:
-        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
+        "eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
      values.$members.0:
-        "0x4964D00fA975a7346ee6196a94b07c01ed1cD3CE"
+        "eth:0x4964D00fA975a7346ee6196a94b07c01ed1cD3CE"
      values.$members.1:
-        "0x050b37a12451F188c7bA53D48b8A1adE6D138E71"
+        "eth:0x050b37a12451F188c7bA53D48b8A1adE6D138E71"
      values.$members.2:
-        "0x37A71E0C1A5808343D893Db40e12A74e0A387908"
+        "eth:0x37A71E0C1A5808343D893Db40e12A74e0A387908"
      values.$members.3:
-        "0x890Da36c3dD697CbB88E616668BEDaFA369f3793"
+        "eth:0x890Da36c3dD697CbB88E616668BEDaFA369f3793"
      values.$members.4:
-        "0x45F9AfCf9565051344aFb36e665f4d7bb2d18415"
+        "eth:0x45F9AfCf9565051344aFb36e665f4d7bb2d18415"
      values.$members.5:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "eth:0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
      values.$members.6:
-        "0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA"
+        "eth:0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA"
      values.$members.7:
-        "0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
+        "eth:0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"
      implementationNames.0xE24f4870Ab85DE8E356C5fC56138587206c70d99:
-        "Proxy"
      implementationNames.0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
-        "GnosisSafe"
      implementationNames.eth:0xE24f4870Ab85DE8E356C5fC56138587206c70d99:
+        "Proxy"
      implementationNames.eth:0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe) {
    +++ description: None
      address:
-        "0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe"
+        "eth:0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe"
    }
```

```diff
    EOA  (0xe7CCD4F3feA7df88Cf9B59B30f738ec1E049231f) {
    +++ description: None
      address:
-        "0xe7CCD4F3feA7df88Cf9B59B30f738ec1E049231f"
+        "eth:0xe7CCD4F3feA7df88Cf9B59B30f738ec1E049231f"
    }
```

```diff
    EOA  (0xee8AE1F1B4B1E1956C8Bda27eeBCE54Cf0bb5eaB) {
    +++ description: None
      address:
-        "0xee8AE1F1B4B1E1956C8Bda27eeBCE54Cf0bb5eaB"
+        "eth:0xee8AE1F1B4B1E1956C8Bda27eeBCE54Cf0bb5eaB"
    }
```

```diff
    EOA  (0xf6dcD4d7141E06B916987C3C46220f6241278a30) {
    +++ description: None
      address:
-        "0xf6dcD4d7141E06B916987C3C46220f6241278a30"
+        "eth:0xf6dcD4d7141E06B916987C3C46220f6241278a30"
    }
```

```diff
    EOA  (0xFBfF3FF69D65A9103Bf4fdBf988f5271D12B3190) {
    +++ description: None
      address:
-        "0xFBfF3FF69D65A9103Bf4fdBf988f5271D12B3190"
+        "eth:0xFBfF3FF69D65A9103Bf4fdBf988f5271D12B3190"
    }
```

```diff
+   Status: CREATED
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenGovernance (0x35cc31f63deef017c38d51B038891bAE7d614e86)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NftFactory (0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Proxy (0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99)
    +++ description: None
```

Generated with discovered.json: 0xbc068f6a48615c73e1343481bd748d3086a54c63

# Diff at Fri, 04 Jul 2025 12:19:31 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22824302
- current block number: 22824302

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22824302 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
+        "eth:0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
      receivedPermissions.1.from:
-        "ethereum:0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
+        "eth:0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
      receivedPermissions.2.from:
-        "ethereum:0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
+        "eth:0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
    }
```

Generated with discovered.json: 0x857200b3e1340c1f65c3c2370017878a51a80b0c

# Diff at Tue, 01 Jul 2025 12:11:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@835b5bf291c209782da0924189d08305334497d4 block: 22081893
- current block number: 22824302

## Description

ms signer change.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$members.4:
-        "0xfB42eb487835B01cbF266f66750a7a89a7247F06"
+        "0x45F9AfCf9565051344aFb36e665f4d7bb2d18415"
    }
```

Generated with discovered.json: 0xf41ca879baf469b40df6a03dbfb6a5aba64b0fb3

# Diff at Tue, 27 May 2025 08:30:31 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 22081893
- current block number: 22081893

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22081893 (main branch discovery), not current.

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
    +++ description: None
      sourceHashes.2:
-        "0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6"
      sourceHashes.1:
-        "0xa219a8a62191e08fe0803a9bee5d9b4cf73ae71a969ff2e1bcbc00330880de07"
+        "0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6"
      sourceHashes.0:
-        "0x51cc7e771fc0a90a4ac4c584004569333b8e5355dea67cb3b6a5e19d602e4a7c"
+        "0x8f3d4519effa17873ea109f5921890111b59d96da635e3691d4a7a96192d8d25"
    }
```

Generated with discovered.json: 0x08d13975af97c042fec29f555cb0d09bf680de7d

# Diff at Fri, 23 May 2025 09:41:09 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22081893
- current block number: 22081893

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22081893 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x73e02d45ddaf5071c84257373d1e1f75c4f2006a

# Diff at Tue, 29 Apr 2025 08:19:17 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22081893
- current block number: 22081893

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22081893 (main branch discovery), not current.

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

Generated with discovered.json: 0x1a8826af057809ef6ebdcc850e6f97f499399f36

# Diff at Wed, 19 Mar 2025 15:45:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4609d8355d7594946b66bef47876090fce6b0842 block: 21365608
- current block number: 22081893

## Description

MS signer change.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$members.7:
+        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
      values.$members.6:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA"
      values.$members.5:
-        "0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA"
+        "0x890Da36c3dD697CbB88E616668BEDaFA369f3793"
      values.$members.4:
-        "0x890Da36c3dD697CbB88E616668BEDaFA369f3793"
+        "0x050b37a12451F188c7bA53D48b8A1adE6D138E71"
      values.$members.3:
-        "0x050b37a12451F188c7bA53D48b8A1adE6D138E71"
+        "0x4964D00fA975a7346ee6196a94b07c01ed1cD3CE"
      values.$threshold:
-        4
+        5
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x052532493c3ea8641917f1a1b54624139777c7a0

# Diff at Tue, 04 Mar 2025 10:40:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21365608
- current block number: 21365608

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21365608 (main branch discovery), not current.

```diff
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346) {
    +++ description: None
      sinceBlock:
+        11807778
    }
```

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      sinceBlock:
+        12505303
    }
```

```diff
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e) {
    +++ description: None
      sinceBlock:
+        9907020
    }
```

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      sinceBlock:
+        10269890
    }
```

```diff
    contract TokenGovernance (0x35cc31f63deef017c38d51B038891bAE7d614e86) {
    +++ description: None
      sinceBlock:
+        14229421
    }
```

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      sinceBlock:
+        10269890
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      sinceBlock:
+        10269890
    }
```

```diff
    contract NftFactory (0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D) {
    +++ description: None
      sinceBlock:
+        12818185
    }
```

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
    +++ description: None
      sinceBlock:
+        10269890
    }
```

```diff
    contract Proxy (0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6) {
    +++ description: None
      sinceBlock:
+        7708066
    }
```

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      sinceBlock:
+        9773819
    }
```

Generated with discovered.json: 0x6f25ffc8edca9c5b283f43b6024f52588163f0c2

# Diff at Mon, 20 Jan 2025 11:10:26 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21365608
- current block number: 21365608

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21365608 (main branch discovery), not current.

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x38A43F4330f24fe920F943409709fc9A6084C939"
      issuedPermissions.0.to:
+        "0x38A43F4330f24fe920F943409709fc9A6084C939"
    }
```

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
      receivedPermissions.2.from:
+        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
      receivedPermissions.1.target:
-        "0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
      receivedPermissions.1.from:
+        "0x5290E9582B4FB706EaDf87BB1c129e897e04d06D"
      receivedPermissions.0.target:
-        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
      receivedPermissions.0.from:
+        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x38A43F4330f24fe920F943409709fc9A6084C939"
      issuedPermissions.0.to:
+        "0x38A43F4330f24fe920F943409709fc9A6084C939"
    }
```

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x38A43F4330f24fe920F943409709fc9A6084C939"
      issuedPermissions.0.to:
+        "0x38A43F4330f24fe920F943409709fc9A6084C939"
    }
```

Generated with discovered.json: 0x508e143b6c1eb25e0a450918be3b5846d8765cce

# Diff at Mon, 09 Dec 2024 14:41:31 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02974be0caac873bba9178e618086aa67aaf0b90 block: 20532597
- current block number: 21365608

## Description

ZkSync Multisig signer replaced.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$members.2:
-        "0x733F602bB867c643542cc807a3D32AD1A86cacc1"
+        "0x890Da36c3dD697CbB88E616668BEDaFA369f3793"
    }
```

Generated with discovered.json: 0x8f01f894bad9f0f854d5972808549b8416ca4697

# Diff at Mon, 14 Oct 2024 10:58:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"]
    }
```

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"]
    }
```

```diff
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0x56f13113f7f861d8b45c18702ac8aa2b4d13d510e35a53f063d80afb36d0785f"]
    }
```

```diff
    contract TokenGovernance (0x35cc31f63deef017c38d51B038891bAE7d614e86) {
    +++ description: None
      sourceHashes:
+        ["0xbc5215ffaf06b3d4f7facebe48a2d345c8b0cf97c800aa3f8e644d843a86ae03"]
    }
```

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      sourceHashes:
+        ["0x1359a771e28c9c71730920ab6bee9509009c60908022ff865419a483f74f702b"]
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xcf125cd39e9e7620aea95320666f3e3c19a3ae1da200337d94d11de29e8d97af"]
    }
```

```diff
    contract NftFactory (0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D) {
    +++ description: None
      sourceHashes:
+        ["0x92b72fece19e4149fd14048afb074cee743d6f3386911f19d109ab73a8cc0208"]
    }
```

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
    +++ description: None
      sourceHashes:
+        ["0xa4356b8fe23f3499a5494bac2e9e1588ba6976f987fff80e2261aa7ebaa20ce6","0xa219a8a62191e08fe0803a9bee5d9b4cf73ae71a969ff2e1bcbc00330880de07","0x51cc7e771fc0a90a4ac4c584004569333b8e5355dea67cb3b6a5e19d602e4a7c"]
    }
```

```diff
    contract Proxy (0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6) {
    +++ description: None
      sourceHashes:
+        ["0x379cacebf61f1aa488b2a43b02fff3f8d7835d9dca8f342a13570553219e6e8c"]
    }
```

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"]
    }
```

Generated with discovered.json: 0x21c05225811617af316de0e7f0c20f796292fb75

# Diff at Tue, 01 Oct 2024 11:12:18 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x046fa96d96fd51cd8746e0df73ecd05381419119

# Diff at Fri, 30 Aug 2024 08:01:53 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xd2de767f061bd11047842dfb113f66896a9893bb

# Diff at Fri, 23 Aug 2024 09:56:47 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xf08beb04559d5a4661c8efb1809292301a9910c4

# Diff at Wed, 21 Aug 2024 10:07:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20532597
- current block number: 20532597

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532597 (main branch discovery), not current.

```diff
    contract Governance (0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01","0x5290E9582B4FB706EaDf87BB1c129e897e04d06D","0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01","via":[]},{"permission":"upgrade","target":"0x5290E9582B4FB706EaDf87BB1c129e897e04d06D","via":[]},{"permission":"upgrade","target":"0xaBEA9132b05A70803a4E85094fD0e1800777fBEF","via":[]}]
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x38A43F4330f24fe920F943409709fc9A6084C939","via":[]}]
    }
```

Generated with discovered.json: 0x13dea30776c0b6c15c1c470dd6f5806ecdd4005c

# Diff at Thu, 15 Aug 2024 07:40:27 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20525384
- current block number: 20532597

## Description

Two members of the ZkSync Multisig were replaced.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$members.5:
-        "0x9dF8bc0918F357c766A5697E031fF5237c05747A"
+        "0xD613b3a3924D0dE9B4a352ca0669e743cBC3C4AA"
      values.$members.3:
-        "0x84298D79ad2CD4eC0d9Ca1959F9d9f40Bc07152f"
+        "0xfB42eb487835B01cbF266f66750a7a89a7247F06"
    }
```

Generated with discovered.json: 0x5772fd09bd8af1263c7960d0da910a71bcca5f78

# Diff at Wed, 14 Aug 2024 07:30:30 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e32dcc268a9af9f45ad205490c9d650c487e04f1 block: 20432768
- current block number: 20525384

## Description

One ZKsync Multisig member address is replaced with another.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$members.1:
-        "0x1567AC0764142e91aB0A9C65C568f0DbE9E168BF"
+        "0x37A71E0C1A5808343D893Db40e12A74e0A387908"
    }
```

Generated with discovered.json: 0xf835b3fbe50281f5386c981c6991da4be2560615

# Diff at Fri, 09 Aug 2024 12:03:21 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20432768
- current block number: 20432768

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432768 (main branch discovery), not current.

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
+        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
      assignedPermissions.upgrade.0:
-        "0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"
+        "0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"
    }
```

Generated with discovered.json: 0xf569dd45f28789ef24a7f28c9cc03542a20f82b8

# Diff at Fri, 09 Aug 2024 10:13:20 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20432768
- current block number: 20432768

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20432768 (main branch discovery), not current.

```diff
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x4326E446013908fBEEE4ce7b6935219c01854B21","0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B","0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8","0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x4326E446013908fBEEE4ce7b6935219c01854B21","0x4F0eB7DBcF5410C7bA0Ad8D131956f0194Ea803B","0x117Ab3A5D9eaF4F7105e30a757F150504733C3d8","0xA0171d83E3C5F215491FcE4C0884E91674B3C8A3"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 6 (33%)"
      values.getOwners:
-        ["0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da","0xD804aB3355a634aEBd45e1252d6208807defD554","0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193","0x106fc088aBA908130fBC343F2F6d212Ff36150D1","0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe","0xf6dcD4d7141E06B916987C3C46220f6241278a30"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da","0xD804aB3355a634aEBd45e1252d6208807defD554","0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193","0x106fc088aBA908130fBC343F2F6d212Ff36150D1","0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe","0xf6dcD4d7141E06B916987C3C46220f6241278a30"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 6 (33%)"
    }
```

```diff
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xB1A308e7F02798377b7acF685E997E3D774c5863","0x0d4E989c7620C8749c9417d2BF218896C767B606","0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xB1A308e7F02798377b7acF685E997E3D774c5863","0x0d4E989c7620C8749c9417d2BF218896C767B606","0x18B7ff0370456dB6b7710714D9DCC25a0A3b3016"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01","0x5290E9582B4FB706EaDf87BB1c129e897e04d06D","0xaBEA9132b05A70803a4E85094fD0e1800777fBEF"]
      assignedPermissions.upgrade:
+        ["0xaBEA9132b05A70803a4E85094fD0e1800777fBEF","0x5290E9582B4FB706EaDf87BB1c129e897e04d06D","0x34460C0EB5074C29A9F6FE13b8e7E23A0D08aF01"]
    }
```

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0x050b37a12451F188c7bA53D48b8A1adE6D138E71","0x1567AC0764142e91aB0A9C65C568f0DbE9E168BF","0x733F602bB867c643542cc807a3D32AD1A86cacc1","0x84298D79ad2CD4eC0d9Ca1959F9d9f40Bc07152f","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0x9dF8bc0918F357c766A5697E031fF5237c05747A","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x050b37a12451F188c7bA53D48b8A1adE6D138E71","0x1567AC0764142e91aB0A9C65C568f0DbE9E168BF","0x733F602bB867c643542cc807a3D32AD1A86cacc1","0x84298D79ad2CD4eC0d9Ca1959F9d9f40Bc07152f","0x702caCafA54B88e9c54449563Fb2e496e85c78b7","0x9dF8bc0918F357c766A5697E031fF5237c05747A","0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x16fdd1682d12a2412ec3cff5e2417644d8a33d5e

# Diff at Thu, 01 Aug 2024 09:21:37 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@621480ddcec5eb0839779913d874274122eaf08f block: 19532310
- current block number: 20432768

## Description

ZKsync lite add one signer (`0xD804aB3355a634aEBd45e1252d6208807defD554`) to their MS2, who is itself just one signer of the SC.

## Watched changes

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 5 (40%)"
+        "2 of 6 (33%)"
      values.getOwners.5:
+        "0xf6dcD4d7141E06B916987C3C46220f6241278a30"
      values.getOwners.4:
-        "0xf6dcD4d7141E06B916987C3C46220f6241278a30"
+        "0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe"
      values.getOwners.3:
-        "0xE7A4F2b1772603170111BC633cbCF1AcEbD60BCe"
+        "0x106fc088aBA908130fBC343F2F6d212Ff36150D1"
      values.getOwners.2:
-        "0xCE990b1f86e954746AD3a57F5Aa6CFa9CC0c3348"
+        "0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193"
      values.getOwners.1:
-        "0x106fc088aBA908130fBC343F2F6d212Ff36150D1"
+        "0xD804aB3355a634aEBd45e1252d6208807defD554"
      values.getOwners.0:
-        "0xB0c9C5B5211dE3a75b61BB798887b76AcCD64193"
+        "0x1cAe37780Ad92801641d05BA5Bb7E978c99Fc5Da"
    }
```

Generated with discovered.json: 0xbd4699a8b52a6b73b41273be603f65b645c4926e

# Diff at Thu, 28 Mar 2024 11:28:26 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 18621109
- current block number: 19532310

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18621109 (main branch discovery), not current.

```diff
    contract Multisig 1 (0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract Multisig 2 (0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 5 (40%)"
    }
```

```diff
    contract Multisig 3 (0x225d3822De44E58eE935440E0c0B829C4232086e) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x458592c7ff46f3e95422b638c0a5a7e9033c8c53

# Diff at Tue, 21 Nov 2023 15:45:04 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@c91f8874e3c01dd4c477491e11cff7b3c664ef34

## Description

Change in the zkSync Era Multisig owners - one address is removed, which makes it a 4/7 Multisig.

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
      values.getOwners[7]:
-        "0xa265146cA40F52cfC439888D0b4291b5440e6769"
    }
```

# Diff at Fri, 13 Oct 2023 12:28:20 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@94e530cf4d7e9cfd400a51f99572fc352ba85712

## Description

Updated verification keys. There are also some other changes in Config.sol, but they are an artefact of Etherscan verification and they are not used in practice.

## Watched changes

```diff
    contract UpgradeGatekeeper (0x38A43F4330f24fe920F943409709fc9A6084C939) {
      values.versionId:
-        10
+        11
    }
```

```diff
    contract Verifier (0x5290E9582B4FB706EaDf87BB1c129e897e04d06D) {
      upgradeability.implementation:
-        "0xf7Bd436a05678B647D74a88ffcf4445Efc43BDfC"
+        "0x6e95812C432F293b8045811F4B1758285EBDB206"
    }
```

## Source code changes

```diff
.../Verifier/implementation/Config.sol                   | 16 +++++++++++++---
 .../Verifier/implementation/KeysWithPlonkVerifier.sol    |  2 +-
 .../Verifier/implementation/Verifier.sol                 |  2 +-
 .../Verifier/implementation/meta.txt                     |  2 +-
 4 files changed, 16 insertions(+), 6 deletions(-)
```

# Diff at Mon, 02 Oct 2023 13:57:17 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract ZkSync Multisig (0xE24f4870Ab85DE8E356C5fC56138587206c70d99) {
      values.getOwners.2:
-        "0xd7aF418d98C0F8EDbaa407fc30ad10382286F36F"
+        "0x733F602bB867c643542cc807a3D32AD1A86cacc1"
    }
```

# Diff at Tue, 26 Sep 2023 13:05:32 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract ZkSync (0xaBEA9132b05A70803a4E85094fD0e1800777fBEF) {
      values.revertedBlocks:
+        [{"totalBlocksCommitted":141,"totalBlocksVerified":141},{"totalBlocksCommitted":859,"totalBlocksVerified":859},{"totalBlocksCommitted":1341,"totalBlocksVerified":1341},{"totalBlocksCommitted":2387,"totalBlocksVerified":2387},{"totalBlocksCommitted":13054,"totalBlocksVerified":13042},{"totalBlocksCommitted":13047,"totalBlocksVerified":13042},{"totalBlocksCommitted":19646,"totalBlocksVerified":19646},{"totalBlocksCommitted":34518,"totalBlocksVerified":34504}]
    }
```

