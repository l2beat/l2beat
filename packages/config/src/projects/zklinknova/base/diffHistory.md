Generated with discovered.json: 0x8d24792768686c0b8aadd6b0b099956bedfa7b78

# Diff at Tue, 11 Mar 2025 08:13:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 27418087
- current block number: 27445725

## Description

proxyadmin template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 27418087 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE"
+        "0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C"
      issuedPermissions.0.via.0:
+        {"address":"0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE"}
    }
```

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x80d12A78EfE7604F00ed07aB2f16F643301674D5"}]
      template:
+        "global/ProxyAdmin"
      displayName:
+        "ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x80d12A78EfE7604F00ed07aB2f16F643301674D5"}]
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"}
      receivedPermissions.0.from:
-        "0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"
+        "0x80d12A78EfE7604F00ed07aB2f16F643301674D5"
      receivedPermissions.0.via:
+        [{"address":"0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE"}]
    }
```

Generated with discovered.json: 0x3a42555a8df827988f2587425c71462031c465ba

# Diff at Mon, 10 Mar 2025 16:52:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 19378036
- current block number: 27418087

## Description

zklink core contract paused. this only prevents deposits/ on the affected chains.

## Watched changes

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0x84c57019a2b0b7aecae082cb8c1b176dbc9893ea

# Diff at Tue, 04 Mar 2025 10:40:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 19378036
- current block number: 19378036

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19378036 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      sinceBlock:
+        12153218
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      sinceBlock:
+        12154343
    }
```

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      sinceBlock:
+        12154343
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      sinceBlock:
+        12153175
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      sinceBlock:
+        2908461
    }
```

Generated with discovered.json: 0x7a7f365fdeb4c3c5657431017d1caab76e2dd469

# Diff at Mon, 20 Jan 2025 11:10:40 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 19378036
- current block number: 19378036

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19378036 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
      issuedPermissions.0.to:
+        "0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9"
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE"
      issuedPermissions.0.to:
+        "0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE"
    }
```

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x80d12A78EfE7604F00ed07aB2f16F643301674D5"
      receivedPermissions.0.from:
+        "0x80d12A78EfE7604F00ed07aB2f16F643301674D5"
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C"
      issuedPermissions.0.to:
+        "0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C"
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"
      receivedPermissions.0.from:
+        "0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"
    }
```

Generated with discovered.json: 0x0980ca07f23461fd8f1b8d3ffb329417bde3c876

# Diff at Mon, 21 Oct 2024 11:14:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 19378036
- current block number: 19378036

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19378036 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7f00134427437b2883F59EF3880597FDc836E356"]
      values.$pastUpgrades.0.1:
-        ["0x7f00134427437b2883F59EF3880597FDc836E356"]
+        "0xceb644026cf3c4c4f5c91e64352f5b2bceaaacc69e8f3c6a23591bf29fa16978"
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xA89aa7e3D34516EAB7129E401215d5d1239Ce715"]
      values.$pastUpgrades.1.1:
-        ["0xA89aa7e3D34516EAB7129E401215d5d1239Ce715"]
+        "0xe6819dfc1ae0abb6a95ad6b8778ca1ad6eda78b48e4f9685819bb09df8b5c8c8"
      values.$pastUpgrades.0.2:
+        ["0x413552461b0b2c13f117d885b52AaA2f23374B1D"]
      values.$pastUpgrades.0.1:
-        ["0x413552461b0b2c13f117d885b52AaA2f23374B1D"]
+        "0xd9b67d7dc47832724dd1b7bdc7e734d949b55a7e329662ccc91016eeed6fb60a"
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x08Ca9154DA9318323D3f6DFd872f5cDC4C85E388"]
      values.$pastUpgrades.1.1:
-        ["0x08Ca9154DA9318323D3f6DFd872f5cDC4C85E388"]
+        "0x6c9c54497c2950dfbedc2c1c5e77cfadb8381e95743c32a240d43605a7f8f2b4"
      values.$pastUpgrades.0.2:
+        ["0x314bF0D901361F2e31A18cb3500bFD33aF51dE47"]
      values.$pastUpgrades.0.1:
-        ["0x314bF0D901361F2e31A18cb3500bFD33aF51dE47"]
+        "0xb135f489f7b7bcb2593e487ba1c07df4c6bb382b98f3ee1cb37a608715f7b180"
    }
```

Generated with discovered.json: 0x292046d011bc9d07a43a1ad0209e7e97aebf4495

# Diff at Mon, 14 Oct 2024 10:59:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 19378036
- current block number: 19378036

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19378036 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x650e6121058aa74419a8d997f6cf169c5bb82b7e6302193672de5f10c1c1e561"]
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      sourceHashes:
+        ["0x8c407edc4ac1fa1cea2c45903e2cf0158906a2ff39fc2eb92aca3ca9f0d43ed8","0xcabc91ee17e9a771bb999a95f4705966cf206325fc82ac15d440c8b6086f9679"]
    }
```

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      sourceHashes:
+        ["0x8fd8f837bb320bd2a7463c103bea2ff207b0969b5795f320a6c868858aa92074"]
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      sourceHashes:
+        ["0xbbe53a68c0042f4050bdf21e8d16eee4688dd35d24e49740915f0a0cf994f0d6","0x9d3b6cf7c8756dc6cce424dc754ed146f84d3201e5223d47b0a4fcd994a76a7f"]
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

Generated with discovered.json: 0x32ca7b6d6197bab0830bf1390042aeeb392ff68c

# Diff at Tue, 01 Oct 2024 11:13:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19378036
- current block number: 19378036

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19378036 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T08:23:03.000Z",["0x7f00134427437b2883F59EF3880597FDc836E356"]]]
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T09:00:33.000Z",["0x413552461b0b2c13f117d885b52AaA2f23374B1D"]],["2024-04-04T06:39:33.000Z",["0xA89aa7e3D34516EAB7129E401215d5d1239Ce715"]]]
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T08:21:37.000Z",["0x314bF0D901361F2e31A18cb3500bFD33aF51dE47"]],["2024-04-18T13:24:53.000Z",["0x08Ca9154DA9318323D3f6DFd872f5cDC4C85E388"]]]
    }
```

Generated with discovered.json: 0x5d7f7de272164a612e3e4d7ef18b304b885d8334

# Diff at Thu, 05 Sep 2024 14:10:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d01da0bcdde8e77051659c9718e449a44f5f957a block: 19322901
- current block number: 19378036

## Description

Fee withdrawer changed to BaseOwner.

## Watched changes

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      values.forwardFeeAllocator:
-        "0x0000000000000000000000000000000000000000"
+        "0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C"
    }
```

Generated with discovered.json: 0x9d20a45aef54e0a11919ca39a3300349b4e5abdd

# Diff at Wed, 04 Sep 2024 07:32:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 17596075
- current block number: 19322901

## Description

Add one signer to the MS, increase threshold to 5/8.

## Watched changes

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      values.$members.7:
+        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
      values.$members.6:
-        "0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"
+        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
      values.$members.5:
-        "0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92"
+        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
      values.$members.4:
-        "0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db"
+        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
      values.$members.3:
-        "0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5"
+        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
      values.$members.2:
-        "0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9"
+        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
      values.$members.1:
-        "0xF801886AE2e127A269B0F11892edb54F692d02dF"
+        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
      values.$members.0:
-        "0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10"
+        "0xd30898ECdc21C72250a5fd1dbD37FF7D63237Db5"
      values.$threshold:
-        4
+        5
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "5 of 8 (63%)"
    }
```

Generated with discovered.json: 0x086346a6cadc0dd620fa64682a084e9fbf6c4c5a

# Diff at Fri, 30 Aug 2024 08:17:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 17596075
- current block number: 17596075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17596075 (main branch discovery), not current.

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xdc59fa8ac919c4ce129af4e5c7295cba97e1ad8b

# Diff at Fri, 23 Aug 2024 09:57:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 17596075
- current block number: 17596075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17596075 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xc9e4ea4138df34eb0d2b8fb49cfc888beea54032

# Diff at Wed, 21 Aug 2024 10:08:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 17596075
- current block number: 17596075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17596075 (main branch discovery), not current.

```diff
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x344A908d1a7b7d06B7AD7169C1db81fc9d496dE9","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE","via":[]}]
    }
```

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x80d12A78EfE7604F00ed07aB2f16F643301674D5"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x80d12A78EfE7604F00ed07aB2f16F643301674D5","via":[]}]
    }
```

```diff
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C","via":[]}]
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd","via":[]}]
    }
```

Generated with discovered.json: 0x4347b60465d4f469d7a829995eb1b4548deaf759

# Diff at Fri, 09 Aug 2024 10:14:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 17596075
- current block number: 17596075

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 17596075 (main branch discovery), not current.

```diff
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x80d12A78EfE7604F00ed07aB2f16F643301674D5"]
      assignedPermissions.upgrade:
+        ["0x80d12A78EfE7604F00ed07aB2f16F643301674D5"]
    }
```

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"]
      assignedPermissions.upgrade:
+        ["0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x7785bccF9110C188Dad39bE49D4Cdf6c6CC03F10","0xF801886AE2e127A269B0F11892edb54F692d02dF","0x24a257B7D975E7ec6219C4cFCbcF6E504253c7A9","0x4D9b22B92Ff9faFAc013f82faCA88BDa8E778cb5","0x824C9364A6CF8f5EB542ad2ca8F5705561C8b1db","0xd8F26118505417Ef6468Ac8A2AE1E5117245Db92","0xcC1A2bd1a459be0C7fAd3B7F9Fa9a6CBBFE9BFa5"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x48895f2e81c94c737dd2f79015ae61f53db17593

# Diff at Fri, 26 Jul 2024 08:11:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 16993704
- current block number: 17596075

## Description

Base admin / owner MS threshold is lowered to 4/7.

## Watched changes

```diff
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C) {
    +++ description: None
      values.$multisigThreshold:
-        "5 of 7 (71%)"
+        "4 of 7 (57%)"
      values.getThreshold:
-        5
+        4
    }
```

Generated with discovered.json: 0xd40a7f76a3c835dc8caeb94c859893b3483f8a4b

# Diff at Thu, 04 Jul 2024 14:09:20 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 16656405

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract BaseL2Gateway (0x1054Ff8B3B7B9F68d2e55C4A42E8952332c69011)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Bridge (0x80d12A78EfE7604F00ed07aB2f16F643301674D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseProxyAdmin (0x85F0d9da054C5FE399E079Cc0b47de74be5b22AE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract zkLink (0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseOwner (0xEf1c84A2fdCE663b75dB3F822cBe1cFddaaa162C)
    +++ description: None
```
