Generated with discovered.json: 0x4813ad4fc859bef92cd5249324318ca6ef9d8e71

# Diff at Tue, 04 Mar 2025 10:40:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 43367152
- current block number: 43367152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 43367152 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      sinceBlock:
+        11790443
    }
```

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      sinceBlock:
+        27865488
    }
```

```diff
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A) {
    +++ description: None
      sinceBlock:
+        27849895
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      sinceBlock:
+        27865483
    }
```

Generated with discovered.json: 0x23c5c050bcef5ef778a585a25ca33541589bd800

# Diff at Mon, 20 Jan 2025 11:10:47 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 43367152
- current block number: 43367152

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 43367152 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"
      receivedPermissions.1.from:
+        "0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"
      receivedPermissions.0.target:
-        "0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"
      receivedPermissions.0.from:
+        "0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"
      directlyReceivedPermissions.0.target:
-        "0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98"
      directlyReceivedPermissions.0.from:
+        "0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98"
    }
```

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3334552599C9aA1FE08CfF276A02033FF37646ca"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x3334552599C9aA1FE08CfF276A02033FF37646ca"
    }
```

```diff
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3334552599C9aA1FE08CfF276A02033FF37646ca"
      issuedPermissions.0.to:
+        "0x3334552599C9aA1FE08CfF276A02033FF37646ca"
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"
      directlyReceivedPermissions.0.from:
+        "0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"
    }
```

Generated with discovered.json: 0xbc0da7a671fb75c037a2abf4a7d170c44302e21f

# Diff at Mon, 20 Jan 2025 09:26:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 43367152
- current block number: 43367152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 43367152 (main branch discovery), not current.

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x6b4451f52fc53753b06a5e6c2b586009711ccf1c

# Diff at Wed, 27 Nov 2024 16:31:37 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@52044f8d0f05b06186da6190067676efd0c6048e block: 43367152
- current block number: 43367152

## Description

Config related change. A ProxyAdmin template was matched for EraProxyAdmin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 43367152 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"}
      receivedPermissions.0.target:
-        "0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"
+        "0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"
      receivedPermissions.0.via:
+        [{"address":"0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98"}]
    }
```

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98"
+        "0x3334552599C9aA1FE08CfF276A02033FF37646ca"
      issuedPermissions.0.via.0:
+        {"address":"0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98","delay":0}
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"}]
    }
```

Generated with discovered.json: 0x24ef1f4f9192ab0f1eadd05220d2f9b51b2d399c

# Diff at Mon, 21 Oct 2024 11:15:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 43367152
- current block number: 43367152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 43367152 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xdBA32e62e929a7e2Fa65782F812416CA65208E40"]
      values.$pastUpgrades.1.1:
-        ["0xdBA32e62e929a7e2Fa65782F812416CA65208E40"]
+        "0x7886648572871a6eb12027c117e273d16ee8026b5f51c0b01b209c0218caf005"
      values.$pastUpgrades.0.2:
+        ["0x022c9D356d6B020D3128de430458A28C7183a13d"]
      values.$pastUpgrades.0.1:
-        ["0x022c9D356d6B020D3128de430458A28C7183a13d"]
+        "0x0564dfd39bc1c198014393565488b4808d94d76790f60c342ac6b031a000233d"
    }
```

```diff
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xC9bBbdCf1778A4aA86544F02CccBf09fd3A0706E"]
      values.$pastUpgrades.2.1:
-        ["0xC9bBbdCf1778A4aA86544F02CccBf09fd3A0706E"]
+        "0x35dad9f42bcd7e9c55385a3656325f94616498878f636e080dbd059f80618492"
      values.$pastUpgrades.1.2:
+        ["0xCaAeA20e1e35214342f4Efe87d3912493E3e1CE5"]
      values.$pastUpgrades.1.1:
-        ["0xCaAeA20e1e35214342f4Efe87d3912493E3e1CE5"]
+        "0x36b4b07ab7556a46e511974d1e6ef3baacce9b569299326bba10f33d8166d0f0"
      values.$pastUpgrades.0.2:
+        ["0x1D3A82B3BDE1d23D3989b77325C4875395c9D6a9"]
      values.$pastUpgrades.0.1:
-        ["0x1D3A82B3BDE1d23D3989b77325C4875395c9D6a9"]
+        "0xc46fbc277cb8c7a4cc234225d13ef11be35301d8aae17df2537a2b54692ab750"
    }
```

Generated with discovered.json: 0x44db1635e78fda0c9346770ceda545be489a9766

# Diff at Mon, 14 Oct 2024 11:00:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 43367152
- current block number: 43367152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 43367152 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

Generated with discovered.json: 0x7c87a2e0a4db5d14422f9472a93df79728f1ded7

# Diff at Tue, 01 Oct 2024 11:14:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 43367152
- current block number: 43367152

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 43367152 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T12:44:39.000Z",["0x022c9D356d6B020D3128de430458A28C7183a13d"]],["2024-04-04T06:25:17.000Z",["0xdBA32e62e929a7e2Fa65782F812416CA65208E40"]]]
    }
```

```diff
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-01T08:10:24.000Z",["0x1D3A82B3BDE1d23D3989b77325C4875395c9D6a9"]],["2024-03-09T10:21:56.000Z",["0xCaAeA20e1e35214342f4Efe87d3912493E3e1CE5"]],["2024-04-22T02:28:56.000Z",["0xC9bBbdCf1778A4aA86544F02CccBf09fd3A0706E"]]]
    }
```

Generated with discovered.json: 0x99950caada60d529c7280593f7c0b38503ffe929

# Diff at Wed, 04 Sep 2024 07:33:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 40563041
- current block number: 43367152

## Description

One signer of EraOwner MS is changed.

## Watched changes

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      values.$members.5:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.$members.4:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
      values.$members.3:
-        "0xC75EFCffEE930706daec5CaCA012551f6a1845D7"
+        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.$members.2:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.$members.1:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.$members.0:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
    }
```

Generated with discovered.json: 0x646d06402506bb9ff77fdb6a25ccc86a7a71e41f

# Diff at Fri, 30 Aug 2024 08:18:08 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 40563041
- current block number: 40563041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40563041 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x2a41feed6d324facc8ab3cc75595c1826d676167

# Diff at Fri, 23 Aug 2024 10:04:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 40563041
- current block number: 40563041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40563041 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xa61b7eed3c4f548f19043a311599895f4e12d72b

# Diff at Wed, 21 Aug 2024 10:09:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 40563041
- current block number: 40563041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40563041 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98","via":[]}]
    }
```

```diff
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x3334552599C9aA1FE08CfF276A02033FF37646ca","via":[]}]
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08","via":[]}]
    }
```

Generated with discovered.json: 0x5a2da4664d1fdf7f031ace8c5c557531374754ab

# Diff at Fri, 09 Aug 2024 10:15:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 40563041
- current block number: 40563041

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 40563041 (main branch discovery), not current.

```diff
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"]
      assignedPermissions.upgrade:
+        ["0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A"]
      values.$multisigThreshold:
-        "5 of 8 (63%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0xF801886AE2e127A269B0F11892edb54F692d02dF","0xC75EFCffEE930706daec5CaCA012551f6a1845D7","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 8 (63%)"
    }
```

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"]
      assignedPermissions.upgrade:
+        ["0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08"]
    }
```

Generated with discovered.json: 0x809763bec8085ad7f96fd287369ad8a7647a56b2

# Diff at Tue, 30 Jul 2024 11:18:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 38562106
- current block number: 38562106

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 38562106 (main branch discovery), not current.

```diff
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98) {
    +++ description: None
      unverified:
-        true
      values.owner:
+        "0x3334552599C9aA1FE08CfF276A02033FF37646ca"
    }
```

Generated with discovered.json: 0x9c38ef301be16ede2a03d4ef7be10db31587c37d

# Diff at Mon, 08 Jul 2024 11:13:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 38562106

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract EraOwner (0x3334552599C9aA1FE08CfF276A02033FF37646ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EraProxyAdmin (0xe8184919c7200EF09e7007DFaB89BA4a99CeDc98)
    +++ description: None
```
