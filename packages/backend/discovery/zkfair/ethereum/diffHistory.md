Generated with discovered.json: 0xf8efcb7a9ea1eb3b6cf51588c8ebe10dba759514

# Diff at Tue, 01 Oct 2024 11:11:59 GMT:

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
