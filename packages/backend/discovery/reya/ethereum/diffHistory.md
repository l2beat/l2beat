Generated with discovered.json: 0xc8e2e47c01857e9b59af509ec2b08f5aadb2651c

# Diff at Fri, 11 Oct 2024 10:33:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8f7c5fd25193054458be38552e62a708c480b2c8 block: 20842808
- current block number: 20941807

## Description

Gelato MS signer removed, one DAC member added, one changed.

## Watched changes

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.dacKeyset.membersCount:
-        1
+        2
      values.dacKeyset.blsSignatures.1:
+        "YAbEnnI/RpbGv0lwkp7I0JhTwGaPz8lEVjkr8SE9LlTrPiEeRegjYymNY2doPnin1hOQfpQuGBRjgxaw3h8lIoBxn31tIMbc3I2pjRBuZhF14klu+I1bkluXRJO9ZYmC9BACIIohozMTWRXI/ej0MFQytyvZsXN2PWKKky0Yy+RzUP7Y7982vn4X81IwuZ4FdhIbogTvc6RSDzgPhiH2ejRB6XPlRT/f76KeNWZogD299lBrYySIceH/aA98cp3ixA7/ryLG6sD2VddYDdfsoSQbTbWuUQrO5/DK3SlMtbMv+vKqMNgCjstJ2DJXPKhiOhQ5nsnOZg9cSalU6LbPPFDdSO/0h09HXno290Iw0yxS20SGmx51lO6q/vEgX0OVvw=="
      values.dacKeyset.blsSignatures.0:
-        "YAiqbxEldcCCF4w3w4rdcfKobllBTGfReIRDwPzEQlUlhq7UFfj70vGcsqwwgzVnNwfqObDvYQ8k5tB5MNDBqJawE4yLZrjazXPba/DQAQ1uXDhXE0OzvZQJxgFrsmkijRBd/Oj24eTJLFV3UrOPE+g9S5wrfTmWwtbVsfYxYSr+KgAKrOy1BsB/MQU8UTtS7g5QNaIGGpwVnDp5RgtpEo1KHrcio4YmEi7HZHsgkpiuTev93ju4EMtrIYN29H8YDhV2UNYA0ZsoQF2B0rbNNp0bWQi6SlnTd9jd4Xffqnol1fmwL6qNWtln4DbfvpK3ZxSNtNvO5GsfPCcbwDPv+kR9ywNQHcDCsJluydK1jMzJLlXUFxuNy3uWUHV+9sBo6g=="
+        "YAfz7xTJCh4W2eYRm14dHI9/MzmE4XpACAD8kSdGPQR9hYj0KVfOfn84xCnXxPRLoBOUCU4l4rzz0HSU3joV5kuBxKQh46L3yZ0h0oP4MXFOG8cbV5oIs2WFjP6s4sPZpRVYhGBPsMSEuD/52l2fMMZTaAQ2p9Vb8VDlSCad3tigl9luWtLItup5DuAS6ixUVBDajyKu9RIGApJwPgtr5dtorAuQ01M6DUhcLM5EPOafuzwvqMywUVmv5YEBJZ96JweOpBJHh7Vs3FKnaR/aDewkrnJBUAlOmW/O09NsbrAGovEQboyn/j17TLfkJVOriQllp0SQJtD/L6somLazwnkbGpN1e0pFod/jqIPI/fetEu6KvteYLX37lzjJQ4l8pA=="
      values.keySetUpdates:
-        1
+        2
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.6:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.multisigThreshold:
-        "6 of 10 (60%)"
+        "6 of 9 (67%)"
    }
```

Generated with discovered.json: 0x8db582682a13cb82fe1ee0cd851b48305e7e34aa

# Diff at Tue, 01 Oct 2024 10:54:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842808
- current block number: 20842808

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842808 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F"]]]
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC"]]]
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x1162084C3C6575121146582Db5BE43189e8CEe6b"]]]
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]]]
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]]]
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-02T11:56:47.000Z",["0x13BE515E44Eefaf3eBEFAD684F1FBB574Ac0A494"]]]
    }
```

Generated with discovered.json: 0x39a2fbca1f1dfc9b8a5f466410691057fb02fb99

# Diff at Fri, 27 Sep 2024 15:19:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20177364
- current block number: 20842808

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xc7f1fcfb5ea20feba39c88cc0aac80e33dbbf4a5

# Diff at Sun, 01 Sep 2024 08:45:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a"
+        "ArbOS v11 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0x988beb59ab791d19186f3f656afc35d7176e3300

# Diff at Fri, 30 Aug 2024 07:56:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
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

Generated with discovered.json: 0x9b09c3c492382ffc81fca3c0b194f79a769fd93c

# Diff at Fri, 23 Aug 2024 09:54:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x2b5f1d0fa7d7bbc653a4a5926b65252f2c8bc87d

# Diff at Wed, 21 Aug 2024 13:25:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@63cb0bd5d55a6dfae0e2e22590983dd8344be4a3 block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      values.dacKeyset.blsSignatures:
+        ["YAiqbxEldcCCF4w3w4rdcfKobllBTGfReIRDwPzEQlUlhq7UFfj70vGcsqwwgzVnNwfqObDvYQ8k5tB5MNDBqJawE4yLZrjazXPba/DQAQ1uXDhXE0OzvZQJxgFrsmkijRBd/Oj24eTJLFV3UrOPE+g9S5wrfTmWwtbVsfYxYSr+KgAKrOy1BsB/MQU8UTtS7g5QNaIGGpwVnDp5RgtpEo1KHrcio4YmEi7HZHsgkpiuTev93ju4EMtrIYN29H8YDhV2UNYA0ZsoQF2B0rbNNp0bWQi6SlnTd9jd4Xffqnol1fmwL6qNWtln4DbfvpK3ZxSNtNvO5GsfPCcbwDPv+kR9ywNQHcDCsJluydK1jMzJLlXUFxuNy3uWUHV+9sBo6g=="]
    }
```

Generated with discovered.json: 0xd9a12fbd5cde2748bd18f10c73750f4e337fd081

# Diff at Wed, 21 Aug 2024 10:05:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x448Bbd134dE1B23976073aB4F2915849b2dcD73A","via":[]}]
    }
```

```diff
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","via":[]}]
    }
```

```diff
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x07390626b8Bc2C04b1D93c7D246A0629198D7868","0x383c03c4EfF819E73409DbC690755a9992393814","0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","0x672109752635177ebcb17F2C7e04575A709014BD","0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","0x728B406A4809118533D96bB3b5C50712C99d8Fa5","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x07390626b8Bc2C04b1D93c7D246A0629198D7868","via":[]},{"permission":"upgrade","target":"0x383c03c4EfF819E73409DbC690755a9992393814","via":[]},{"permission":"upgrade","target":"0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","via":[]},{"permission":"upgrade","target":"0x672109752635177ebcb17F2C7e04575A709014BD","via":[]},{"permission":"upgrade","target":"0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","via":[]},{"permission":"upgrade","target":"0x728B406A4809118533D96bB3b5C50712C99d8Fa5","via":[]},{"permission":"upgrade","target":"0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","via":[]}]
    }
```

```diff
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9","via":[]}]
    }
```

Generated with discovered.json: 0xd390f5045290a8c860d9973e09b79bb24bfbaba8

# Diff at Fri, 09 Aug 2024 12:01:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      assignedPermissions.upgrade.6:
-        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
+        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
      assignedPermissions.upgrade.5:
-        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
+        "0x728B406A4809118533D96bB3b5C50712C99d8Fa5"
      assignedPermissions.upgrade.4:
-        "0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"
+        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
      assignedPermissions.upgrade.3:
-        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
+        "0x672109752635177ebcb17F2C7e04575A709014BD"
      assignedPermissions.upgrade.2:
-        "0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d"
+        "0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9"
      assignedPermissions.upgrade.0:
-        "0x672109752635177ebcb17F2C7e04575A709014BD"
+        "0x07390626b8Bc2C04b1D93c7D246A0629198D7868"
    }
```

Generated with discovered.json: 0x3c4821d41420fdbdd4e995dffb0bed68e0e30f3a

# Diff at Fri, 09 Aug 2024 10:11:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"]
      assignedPermissions.upgrade:
+        ["0x448Bbd134dE1B23976073aB4F2915849b2dcD73A"]
    }
```

```diff
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x07390626b8Bc2C04b1D93c7D246A0629198D7868","0x383c03c4EfF819E73409DbC690755a9992393814","0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","0x672109752635177ebcb17F2C7e04575A709014BD","0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","0x728B406A4809118533D96bB3b5C50712C99d8Fa5","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd"]
      assignedPermissions.upgrade:
+        ["0x672109752635177ebcb17F2C7e04575A709014BD","0x383c03c4EfF819E73409DbC690755a9992393814","0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d","0x07390626b8Bc2C04b1D93c7D246A0629198D7868","0xFd9f59554351122b231F832a0e0A1aBb0604D7fd","0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9","0x728B406A4809118533D96bB3b5C50712C99d8Fa5"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$multisigThreshold:
-        "6 of 10 (60%)"
      values.getOwners:
-        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 10 (60%)"
    }
```

Generated with discovered.json: 0xd206dd3f29a9b75aa36f6be5a5e3aa295ba9c145

# Diff at Tue, 30 Jul 2024 11:14:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20177364
- current block number: 20177364

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20177364 (main branch discovery), not current.

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0xc4f473c42277bdd183e49089b1b3413cc298b04b

# Diff at Wed, 05 Jun 2024 08:43:07 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@3a08c61f892fdbd930567c41f50f427b83391859 block: 19973435
- current block number: 20024504

## Description

Same Multisig as in new re.al L2, deployed by gelato deployer.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19973435 (main branch discovery), not current.

```diff
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      name:
-        "ReyaMultisig"
+        "GelatoMultisig"
    }
```

Generated with discovered.json: 0x365b8f59f73971268b17211f32b838a2f592af96

# Diff at Wed, 29 May 2024 05:29:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca8b8ea4d1ba80d5f20f68bede9336b90b01434 block: 19926951
- current block number: 19973435

## Description

The EOA is removed from EXECUTOR_ROLE.members. The rollup can now be upgraded by the 6/10 Reya Multisig only.

## Watched changes

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x91Ef6E02740bDcc9dB248F995c7f394D7617d7a1"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      upgradeability.threshold:
-        "5 of 9 (56%)"
+        "6 of 10 (60%)"
      values.getOwners.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.getOwners.8:
-        "0xebD4919C075417a86F19713dADe101852867A04F"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.getOwners.7:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.getOwners.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
      values.getOwners.5:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
      values.getOwners.4:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
      values.getOwners.3:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.getOwners.2:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.getOwners.1:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.getOwners.0:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.getThreshold:
-        5
+        6
      values.nonce:
-        0
+        4
    }
```

Generated with discovered.json: 0x940faef00f64ffdef8e782429009677653fbae56

# Diff at Wed, 22 May 2024 17:36:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eae7b47a410c2b8cc7e6a7d7a0bc841a31c6e83 block: 19883593
- current block number: 19926951

## Description

A new Executor is added (a multisig) but the old EOA admin is still not removed.

## Watched changes

```diff
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
+   Status: CREATED
    contract ReyaMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/ReyaMultisig/GnosisSafe.sol     | 952 +++++++++++++++++++++
 .../.flat/ReyaMultisig/GnosisSafeProxy.p.sol       |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0x5664902f67add10c7d67f86c907fb3ea7ec5ecd3

# Diff at Tue, 14 May 2024 09:35:12 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@c3f1e2e18f153bc7ee23c0dd431182773076cc43 block: 19789584
- current block number: 19867390

## Description

The challenge period (`confirmPeriodBlocks`) is increased from 30m and now matches the self-propose (`VALIDATOR_AFK_BLOCKS`) delay of 6d 8h.

## Watched changes

```diff
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A) {
    +++ description: None
      values.confirmPeriodBlocks:
-        150
+        45818
    }
```

Generated with discovered.json: 0x5b3d003cfab482308ba681b8eecea5562a2b9df5

# Diff at Fri, 03 May 2024 12:27:40 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19789584

## Description

Initial discovery for Reya network (Orbit stack L2). 1.0 code similarity (identical) to popapex L3 when excluding the socket vault and Mulltisig.

## Initial discovery

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x07390626b8Bc2C04b1D93c7D246A0629198D7868)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x383c03c4EfF819E73409DbC690755a9992393814)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x3f373b0A7DcEe7b7bCfC16DF85CfAE18388542c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x448Bbd134dE1B23976073aB4F2915849b2dcD73A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x672109752635177ebcb17F2C7e04575A709014BD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x6CA2A628fb690Bd431F4aA608655ce37c66aff9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x728B406A4809118533D96bB3b5C50712C99d8Fa5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x74627dd54FA6E94c87F12DBAdAEc275758f51dF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SocketVault_Reya (0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xFd9f59554351122b231F832a0e0A1aBb0604D7fd)
    +++ description: None
```
