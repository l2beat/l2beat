Generated with discovered.json: 0x72381594813bce08bf669a0eda5aea6faa39409f

# Diff at Tue, 01 Oct 2024 10:55:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19719123
- current block number: 19719123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19719123 (main branch discovery), not current.

```diff
    contract DepositBoxERC1155 (0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-19T18:43:58.000Z",["0xd0Fc79156E3a60858F24F9b7172Cd64ef7cc1DBB"]],["2021-09-23T19:13:19.000Z",["0x825a23B6cBbb1880b3189C2C684b3DF53Dd8Cb83"]],["2021-12-21T05:02:24.000Z",["0x2faDfcb4AB510463bA8B1aE6f44FB0D55a79a6db"]],["2022-04-18T22:17:20.000Z",["0x947CB65494903A53E55f7Dfef949e66d43e076b3"]],["2022-07-01T23:44:45.000Z",["0xDdE9fC39471F1D119b9928994c555E7296752b9A"]],["2022-11-30T10:30:23.000Z",["0xBc03C79991f6a6486B5187ad91853626c9686bF2"]],["2023-01-30T15:33:59.000Z",["0x9429952791A01c35E715826f34727E885A2b2f09"]],["2023-06-22T10:42:11.000Z",["0xE8d18a64e5bD3C3e96e7c163Dc67FF97296b6304"]]]
    }
```

```diff
    contract DepositBoxEth (0x49F583d263e4Ef938b9E09772D3394c71605Df94) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-19T18:35:33.000Z",["0x912B03Fa0aA8C848f7B16950870dC0B1B89CB28C"]],["2021-09-23T19:13:19.000Z",["0xAcb26F2B4018e20ab4F5b729bbF70c56583dFBD9"]],["2021-12-21T05:02:24.000Z",["0x02113b595aF3BAFD390Bc4B0a44224c789dE3824"]],["2022-04-18T22:17:20.000Z",["0xF0551a55E73734751324BF8299f50c9229754c56"]],["2022-07-01T23:44:45.000Z",["0x1d3c18a87DF66cc3F8e176f5bef4CDE0C40D50e7"]],["2022-11-30T10:30:23.000Z",["0x998D6AA8CaC99f1557b65E680fc4FDCD94Be70ca"]],["2023-01-30T15:33:59.000Z",["0xfE6faFAC88150A23D946E53E9e2285aAB98A0d90"]],["2023-06-22T10:42:11.000Z",["0x2f90BeD90fa0Cc605B86b8623612a2638EB4019a"]]]
    }
```

```diff
    contract CommunityPool (0x588801cA36558310D91234aFC2511502282b1621) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-19T18:32:44.000Z",["0xf1b9d10472A62EA977089336dc4a65580Ebdae60"]],["2021-09-23T19:13:19.000Z",["0x8375acDca1feCdb89F3C3A440f40884C6B1a7A7D"]],["2021-12-21T05:02:24.000Z",["0x956455d81d5DC0F4FbE666Bffb278Af292dFa4dB"]],["2022-04-18T22:17:20.000Z",["0x06FE670E7647A67F95f09EbC292a833d66ebb681"]],["2022-07-01T23:44:45.000Z",["0x59501EDE4441B566D43330938b01044168a4Af0C"]],["2022-11-30T10:30:23.000Z",["0xAC1861ed87595E0AfF6C2bB9f8742D3308f48ba0"]],["2023-06-22T10:42:11.000Z",["0xffC647d4Cef8FB8b365e6B11a0156972e9343f6A"]]]
    }
```

```diff
    contract Linker (0x6ef406953bac772C2146389ED37846BA3b6086D1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-19T18:28:58.000Z",["0x886C47563cA045dd3b41F4E13CdD0122D412738c"]],["2021-09-23T19:13:19.000Z",["0x4827ecE3114796c9c26459b35B6E23E2A952Ae09"]],["2022-04-18T22:17:20.000Z",["0xe8608987fee290114f99Cc23C1eABD084C0176E9"]],["2022-07-01T23:44:45.000Z",["0xc107d8CCC84C391b0E66A6cE2460Ece69EF1ad26"]],["2022-11-30T10:30:23.000Z",["0xEde996A9899b570dE70eaDE06Fa69621cE1470Be"]],["2023-06-22T10:42:11.000Z",["0x676FAFCE73F5a304988C519407AAc06bD117CdD0"]]]
    }
```

```diff
    contract DepositBoxERC721 (0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-19T18:41:05.000Z",["0xB6b164FD2b72a5Cf2570BB55b9cd9624DDD23ad7"]],["2021-09-23T19:13:19.000Z",["0x683325e0B5475222f6521e729Dd1f3D566a2fa66"]],["2021-12-21T05:02:24.000Z",["0xA99A7b8FBb46cbeb9BF8174B21964ba11399B272"]],["2022-04-18T22:17:20.000Z",["0x573383DB7D9b41e2a9Aa180e305d958c0CF9A52e"]],["2022-07-01T23:44:45.000Z",["0x5C6Cbec4dbDbb5176BbfbF68aA33AbF4b49a116c"]],["2022-11-30T10:30:23.000Z",["0x205fDFa8BB5b035152d9aca24cA32377A98838b8"]],["2023-01-30T15:33:59.000Z",["0xa66b813b2e32EEb82D4dafB5e784471cdba452E8"]],["2023-06-22T10:42:11.000Z",["0xAD64712a9F3F7Ca4e7064381135082AAA68F56d5"]]]
    }
```

```diff
    contract MessageProxyForMainnet (0x8629703a9903515818C2FeB45a6f6fA5df8Da404) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-19T18:26:36.000Z",["0x7B50F0d25a45Fa3e121F51e101099d2d5a6980eD"]],["2021-09-23T19:13:19.000Z",["0xb7512b598d4751B5636573235588E42aAC0eCE02"]],["2021-12-21T05:02:24.000Z",["0xc8663c0bd8238A440C0E272c01b64F509ca4E1F5"]],["2022-02-16T19:20:59.000Z",["0x8629703a9903515818C2FeB45a6f6fA5df8Da404"]],["2022-02-19T11:09:28.000Z",["0x7F388C2282987Fd7738D4d56Ea047ee05D2dFef7"]],["2022-04-18T22:17:20.000Z",["0x7EeB2Fb952a11a4675717A34bA803D6E95FF24A5"]],["2022-07-01T23:44:45.000Z",["0x8BaC52833c7901182ED972Bfa4A56A2432D79170"]],["2022-11-30T10:30:23.000Z",["0xC261084Dc6475d4980548Bd8C323FF825b3D0C38"]],["2023-06-22T10:42:11.000Z",["0x64e4cd4Fe42eAB98AcD15fddaC657B1537aa5190"]]]
    }
```

```diff
    contract DepositBoxERC20 (0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-19T18:38:20.000Z",["0x28bb5918c37F8170D12C211Ae924bF02A7DF8CA4"]],["2021-09-23T19:13:19.000Z",["0xD0aEc35561751FA11e622532383f5aAe4b58F66e"]],["2021-12-21T05:02:24.000Z",["0x0c02d198dd84582FA319dB9d53158C4a21AF3D09"]],["2022-04-18T22:17:20.000Z",["0x0209B161D99E121C026697F6C7558905a9bD7089"]],["2022-05-24T20:26:27.000Z",["0xBDA6d5ced98156377A9E3f60eadc0424b2934D19"]],["2022-07-01T23:44:45.000Z",["0x1419fE9A82741fe6d9Ab27Fd7e007810a3c1896b"]],["2022-11-30T10:30:23.000Z",["0x4B4192649E9450f329dD36F56a81C08aD0c12c02"]],["2023-01-30T15:33:59.000Z",["0x778B105215e59e4731CcBDcB0A54C367FD3897a1"]],["2023-06-22T10:42:11.000Z",["0xc616EaF17c5e3349c1Fa493459494BB4DD0FD788"]]]
    }
```

```diff
    contract DepositBoxERC721WithMetadata (0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-04-15T11:13:37.000Z",["0x584cc3A9305867E30594647872cB5257E6769C1a"]],["2022-11-30T10:30:23.000Z",["0xCe4ceF453a2D7071B845e36a2E1bf096fba6eEeA"]],["2023-01-30T15:33:59.000Z",["0x858b1F991F248Dc150cE2B839d3d0d71597dBF68"]],["2023-06-22T10:42:11.000Z",["0xF99F446340483C5d9D63697a60232ECb9274E1e7"]]]
    }
```

Generated with discovered.json: 0x1a40084b3656b9a65464a5154f63b3809ff491b3

# Diff at Fri, 30 Aug 2024 08:00:43 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19719123
- current block number: 19719123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19719123 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627) {
    +++ description: None
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
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

Generated with discovered.json: 0x16e7408422bca316783c317c0aa2c4af91276bdb

# Diff at Fri, 23 Aug 2024 09:55:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19719123
- current block number: 19719123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19719123 (main branch discovery), not current.

```diff
    contract DepositBoxERC1155 (0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a) {
    +++ description: None
      values.$upgradeCount:
+        8
    }
```

```diff
    contract DepositBoxEth (0x49F583d263e4Ef938b9E09772D3394c71605Df94) {
    +++ description: None
      values.$upgradeCount:
+        8
    }
```

```diff
    contract CommunityPool (0x588801cA36558310D91234aFC2511502282b1621) {
    +++ description: None
      values.$upgradeCount:
+        7
    }
```

```diff
    contract Linker (0x6ef406953bac772C2146389ED37846BA3b6086D1) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

```diff
    contract DepositBoxERC721 (0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d) {
    +++ description: None
      values.$upgradeCount:
+        8
    }
```

```diff
    contract MessageProxyForMainnet (0x8629703a9903515818C2FeB45a6f6fA5df8Da404) {
    +++ description: None
      values.$upgradeCount:
+        9
    }
```

```diff
    contract DepositBoxERC20 (0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669) {
    +++ description: None
      values.$upgradeCount:
+        9
    }
```

```diff
    contract DepositBoxERC721WithMetadata (0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

Generated with discovered.json: 0x2af0e37e151a5833828163fc67664c36d74a74b2

# Diff at Wed, 21 Aug 2024 10:05:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19719123
- current block number: 19719123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19719123 (main branch discovery), not current.

```diff
    contract DepositBoxERC1155 (0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627","via":[]}]
    }
```

```diff
    contract DepositBoxEth (0x49F583d263e4Ef938b9E09772D3394c71605Df94) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627","via":[]}]
    }
```

```diff
    contract CommunityPool (0x588801cA36558310D91234aFC2511502282b1621) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627","via":[]}]
    }
```

```diff
    contract Linker (0x6ef406953bac772C2146389ED37846BA3b6086D1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627","via":[]}]
    }
```

```diff
    contract DepositBoxERC721 (0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627","via":[]}]
    }
```

```diff
    contract MessageProxyForMainnet (0x8629703a9903515818C2FeB45a6f6fA5df8Da404) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627","via":[]}]
    }
```

```diff
    contract DepositBoxERC20 (0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627","via":[]}]
    }
```

```diff
    contract DepositBoxERC721WithMetadata (0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a","0x49F583d263e4Ef938b9E09772D3394c71605Df94","0x588801cA36558310D91234aFC2511502282b1621","0x6ef406953bac772C2146389ED37846BA3b6086D1","0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d","0x8629703a9903515818C2FeB45a6f6fA5df8Da404","0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669","0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a","via":[]},{"permission":"upgrade","target":"0x49F583d263e4Ef938b9E09772D3394c71605Df94","via":[]},{"permission":"upgrade","target":"0x588801cA36558310D91234aFC2511502282b1621","via":[]},{"permission":"upgrade","target":"0x6ef406953bac772C2146389ED37846BA3b6086D1","via":[]},{"permission":"upgrade","target":"0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d","via":[]},{"permission":"upgrade","target":"0x8629703a9903515818C2FeB45a6f6fA5df8Da404","via":[]},{"permission":"upgrade","target":"0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669","via":[]},{"permission":"upgrade","target":"0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986","via":[]}]
    }
```

Generated with discovered.json: 0x37c24f07a5e6946d1fc644313da74ff45102e221

# Diff at Fri, 09 Aug 2024 12:02:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19719123
- current block number: 19719123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19719123 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627) {
    +++ description: None
      assignedPermissions.upgrade.7:
-        "0x588801cA36558310D91234aFC2511502282b1621"
+        "0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986"
      assignedPermissions.upgrade.6:
-        "0x8629703a9903515818C2FeB45a6f6fA5df8Da404"
+        "0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669"
      assignedPermissions.upgrade.5:
-        "0x6ef406953bac772C2146389ED37846BA3b6086D1"
+        "0x8629703a9903515818C2FeB45a6f6fA5df8Da404"
      assignedPermissions.upgrade.4:
-        "0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986"
+        "0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d"
      assignedPermissions.upgrade.3:
-        "0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a"
+        "0x6ef406953bac772C2146389ED37846BA3b6086D1"
      assignedPermissions.upgrade.2:
-        "0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669"
+        "0x588801cA36558310D91234aFC2511502282b1621"
      assignedPermissions.upgrade.1:
-        "0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d"
+        "0x49F583d263e4Ef938b9E09772D3394c71605Df94"
      assignedPermissions.upgrade.0:
-        "0x49F583d263e4Ef938b9E09772D3394c71605Df94"
+        "0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a"
    }
```

Generated with discovered.json: 0xbb8d38a3a10de3152c316f47e840f0105cbba5ed

# Diff at Fri, 09 Aug 2024 10:12:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19719123
- current block number: 19719123

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19719123 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x13fD1622F0E7e50A87B79cb296cbAf18362631C0) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x86EBB3994A558C27d19E2BADF5f98b99C478F98F","0x3E8eba8D8E1BA34cB5780d541748438aA21b1245","0x60f66a4056852d0Bd6D5BF6FF5D2eBeb474cd587","0x315537a8004A7E598f807e8e0ce2F92e6a497E18","0xE74ad5437C6CFB0cCD6bADda1F6b57b6E542E75e"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x86EBB3994A558C27d19E2BADF5f98b99C478F98F","0x3E8eba8D8E1BA34cB5780d541748438aA21b1245","0x60f66a4056852d0Bd6D5BF6FF5D2eBeb474cd587","0x315537a8004A7E598f807e8e0ce2F92e6a497E18","0xE74ad5437C6CFB0cCD6bADda1F6b57b6E542E75e"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract ProxyAdmin (0xA35d3Ffc3812F6caD1Ac64FDE740a98bfb900627) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a","0x49F583d263e4Ef938b9E09772D3394c71605Df94","0x588801cA36558310D91234aFC2511502282b1621","0x6ef406953bac772C2146389ED37846BA3b6086D1","0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d","0x8629703a9903515818C2FeB45a6f6fA5df8Da404","0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669","0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986"]
      assignedPermissions.upgrade:
+        ["0x49F583d263e4Ef938b9E09772D3394c71605Df94","0x7343d31eb99Fd31424bcca9f0a7EAFBc1F515f2d","0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669","0x3C02FdEe8E05B6dc4d44a6555b3ff5762D03871a","0x9f8196D864ee9476bF8DBE68aD07cc555d6B7986","0x6ef406953bac772C2146389ED37846BA3b6086D1","0x8629703a9903515818C2FeB45a6f6fA5df8Da404","0x588801cA36558310D91234aFC2511502282b1621"]
    }
```

Generated with discovered.json: 0xeb67a9f636e0cfcd17e2582a09a5163393c1da99

# Diff at Tue, 23 Apr 2024 15:56:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@f6f4ef80f0b2193da88313a911968b74fcfed02f block: 19532187
- current block number: 19719123

## Description

A `version` variable of MessageProxyForMainnet has been bumped up
from 1.5.0 to 2.1.0 with no changes to implementation.

This `version` variable can be arbitrarily changed by the owner
(emitting `VersionUpdated` event), but it doesn't seem to
have any impact on contracts in the project.

## Watched changes

```diff
    contract MessageProxyForMainnet (0x8629703a9903515818C2FeB45a6f6fA5df8Da404) {
    +++ description: None
      values.version:
-        "1.5.0"
+        "2.1.0"
    }
```

Generated with discovered.json: 0x3c215b105b69e1d5c6f495d65e708a2faf8bbc3d

# Diff at Thu, 28 Mar 2024 11:03:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 18768542
- current block number: 19532187

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18768542 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x13fD1622F0E7e50A87B79cb296cbAf18362631C0) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0xf4edd5511278705580d44b0d0e629dd58c0c352a

# Diff at Tue, 12 Dec 2023 07:14:10 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@fdc867519c9c4b27d1a45a5037b5ab0509a4a2f8

## Description

One owner of ProxyAdminOwner is changed.

## Watched changes

```diff
    contract ProxyAdminOwner (0x13fD1622F0E7e50A87B79cb296cbAf18362631C0) {
      values.getOwners.2:
-        "0x1c3c10544EDd69c9a09EDEcf05A4646293DCAedB"
+        "0x60f66a4056852d0Bd6D5BF6FF5D2eBeb474cd587"
    }
```
