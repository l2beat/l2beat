Generated with discovered.json: 0x149884175b645a3184d9e956a827c9896944235b

# Diff at Tue, 04 Mar 2025 10:39:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20792032
- current block number: 20792032

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792032 (main branch discovery), not current.

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      sinceBlock:
+        19287370
    }
```

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
      sinceBlock:
+        11149847
    }
```

```diff
    contract USDT Farm (0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9) {
    +++ description: None
      sinceBlock:
+        14580778
    }
```

```diff
    contract USDC Farm (0x830433dE03ABedE062660CC629e1A2c714272474) {
    +++ description: None
      sinceBlock:
+        14580894
    }
```

```diff
    contract DAI Farm (0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0) {
    +++ description: None
      sinceBlock:
+        14580782
    }
```

```diff
    contract  (0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70) {
    +++ description: None
      sinceBlock:
+        19287339
    }
```

```diff
    contract WBTC Farm (0xd910f6F23889919fAd9C8cE3171dd557cE0308Da) {
    +++ description: None
      sinceBlock:
+        14580990
    }
```

```diff
    contract ProxyAdmin (0xFb504CD4eD46024B83c4337044995CF112205f18) {
    +++ description: None
      sinceBlock:
+        14580766
    }
```

Generated with discovered.json: 0x5c4accd3d8adae05961d972ae2e963946d782703

# Diff at Mon, 20 Jan 2025 11:09:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20792032
- current block number: 20792032

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792032 (main branch discovery), not current.

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70"
      issuedPermissions.0.to:
+        "0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70"
    }
```

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
      receivedPermissions.3.target:
-        "0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"
      receivedPermissions.3.from:
+        "0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"
      receivedPermissions.2.target:
-        "0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0"
      receivedPermissions.2.from:
+        "0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0"
      receivedPermissions.1.target:
-        "0x830433dE03ABedE062660CC629e1A2c714272474"
      receivedPermissions.1.from:
+        "0x830433dE03ABedE062660CC629e1A2c714272474"
      receivedPermissions.0.target:
-        "0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"
      receivedPermissions.0.from:
+        "0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"
      directlyReceivedPermissions.0.target:
-        "0xFb504CD4eD46024B83c4337044995CF112205f18"
      directlyReceivedPermissions.0.from:
+        "0xFb504CD4eD46024B83c4337044995CF112205f18"
    }
```

```diff
    contract USDT Farm (0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
    }
```

```diff
    contract USDC Farm (0x830433dE03ABedE062660CC629e1A2c714272474) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
    }
```

```diff
    contract DAI Farm (0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
    }
```

```diff
    contract  (0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8"
      receivedPermissions.0.from:
+        "0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8"
    }
```

```diff
    contract WBTC Farm (0xd910f6F23889919fAd9C8cE3171dd557cE0308Da) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
    }
```

```diff
    contract ProxyAdmin (0xFb504CD4eD46024B83c4337044995CF112205f18) {
    +++ description: None
      directlyReceivedPermissions.3.target:
-        "0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"
      directlyReceivedPermissions.3.from:
+        "0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"
      directlyReceivedPermissions.2.target:
-        "0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0"
      directlyReceivedPermissions.2.from:
+        "0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0"
      directlyReceivedPermissions.1.target:
-        "0x830433dE03ABedE062660CC629e1A2c714272474"
      directlyReceivedPermissions.1.from:
+        "0x830433dE03ABedE062660CC629e1A2c714272474"
      directlyReceivedPermissions.0.target:
-        "0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"
      directlyReceivedPermissions.0.from:
+        "0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"
    }
```

Generated with discovered.json: 0x536d1a9b795df535fdedbc640fbcb209178395f5

# Diff at Mon, 20 Jan 2025 09:25:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 20792032
- current block number: 20792032

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792032 (main branch discovery), not current.

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
      fieldMeta.policyAdmin.type:
+        "PERMISSION"
      fieldMeta.required.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x5ab02c379209488d67b40755b0562076d19c466b

# Diff at Fri, 29 Nov 2024 09:08:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 20792032
- current block number: 20792032

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792032 (main branch discovery), not current.

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9","via":[{"address":"0xFb504CD4eD46024B83c4337044995CF112205f18"}]},{"permission":"upgrade","target":"0x830433dE03ABedE062660CC629e1A2c714272474","via":[{"address":"0xFb504CD4eD46024B83c4337044995CF112205f18"}]},{"permission":"upgrade","target":"0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0","via":[{"address":"0xFb504CD4eD46024B83c4337044995CF112205f18"}]},{"permission":"upgrade","target":"0xd910f6F23889919fAd9C8cE3171dd557cE0308Da","via":[{"address":"0xFb504CD4eD46024B83c4337044995CF112205f18"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xFb504CD4eD46024B83c4337044995CF112205f18"}]
    }
```

```diff
    contract USDT Farm (0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xFb504CD4eD46024B83c4337044995CF112205f18"
+        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
      issuedPermissions.0.via.0:
+        {"address":"0xFb504CD4eD46024B83c4337044995CF112205f18","delay":0}
    }
```

```diff
    contract USDC Farm (0x830433dE03ABedE062660CC629e1A2c714272474) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xFb504CD4eD46024B83c4337044995CF112205f18"
+        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
      issuedPermissions.0.via.0:
+        {"address":"0xFb504CD4eD46024B83c4337044995CF112205f18","delay":0}
    }
```

```diff
    contract DAI Farm (0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xFb504CD4eD46024B83c4337044995CF112205f18"
+        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
      issuedPermissions.0.via.0:
+        {"address":"0xFb504CD4eD46024B83c4337044995CF112205f18","delay":0}
    }
```

```diff
    contract WBTC Farm (0xd910f6F23889919fAd9C8cE3171dd557cE0308Da) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xFb504CD4eD46024B83c4337044995CF112205f18"
+        "0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a"
      issuedPermissions.0.via.0:
+        {"address":"0xFb504CD4eD46024B83c4337044995CF112205f18","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xFb504CD4eD46024B83c4337044995CF112205f18) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"},{"permission":"upgrade","target":"0x830433dE03ABedE062660CC629e1A2c714272474"},{"permission":"upgrade","target":"0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0"},{"permission":"upgrade","target":"0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"},{"permission":"upgrade","target":"0x830433dE03ABedE062660CC629e1A2c714272474"},{"permission":"upgrade","target":"0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0"},{"permission":"upgrade","target":"0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"}]
    }
```

Generated with discovered.json: 0x2f5b23b66cea5217e5df4026732e6e30578a907a

# Diff at Mon, 21 Oct 2024 11:08:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20792032
- current block number: 20792032

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792032 (main branch discovery), not current.

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      values.$pastUpgrades.3.2:
+        ["0x59fF8Eb9B384a6e1146194D7b2e754694957c5Af"]
      values.$pastUpgrades.3.1:
-        ["0x59fF8Eb9B384a6e1146194D7b2e754694957c5Af"]
+        "0x9553335896b187c5265343e52c5491224b6bc45e9a9d6eb1d3f91dbbbd4b0e66"
      values.$pastUpgrades.2.2:
+        ["0xb4D37E8f6e970344c1cc99F65D8D1Afd5F7590D9"]
      values.$pastUpgrades.2.1:
-        ["0xb4D37E8f6e970344c1cc99F65D8D1Afd5F7590D9"]
+        "0x96eafc66472aedb0c290a3b972b8b8c1c4f3eb95cc03e14cc279fe5a6ce6145b"
      values.$pastUpgrades.1.2:
+        ["0x2BeBced27D2c7ECE9C6cEa9daFD2711aDdc8a1Bc"]
      values.$pastUpgrades.1.1:
-        ["0x2BeBced27D2c7ECE9C6cEa9daFD2711aDdc8a1Bc"]
+        "0x4c04a6a28b38b19f8f5d17e6cc454fd948dea95ea89fe7b2a19ba07b5034f326"
      values.$pastUpgrades.0.2:
+        ["0x88022f07eB8F5c6FfECCd50152A6c7CAf69Bfc62"]
      values.$pastUpgrades.0.1:
-        ["0x88022f07eB8F5c6FfECCd50152A6c7CAf69Bfc62"]
+        "0x31ec94bc2c28b44d3390b639f19673371816d7b503960eed6b615b60477faab2"
    }
```

Generated with discovered.json: 0xe6e001b29955cc8331855e99096408ccb9bd30b1

# Diff at Mon, 14 Oct 2024 10:54:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20792032
- current block number: 20792032

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792032 (main branch discovery), not current.

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
      sourceHashes:
+        ["0x14ff670031a318957fb84a598af08c637cec739b303d25c08d5d870d3df03482","0x2e54618fac09ff40e0bfc745f840cab0e89c2aa480df85e74a97612aa959df76"]
    }
```

```diff
    contract ProxyAdmin (0xFb504CD4eD46024B83c4337044995CF112205f18) {
    +++ description: None
      sourceHashes:
+        ["0x579c6df39480618101e39d5b997df14c347d7f8a880df6cf0e1ae526771a0444"]
    }
```

Generated with discovered.json: 0xaba7b92fe4492b2bcd2d7c44a1c1252aa32b0fab

# Diff at Tue, 01 Oct 2024 10:53:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20792032
- current block number: 20792032

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20792032 (main branch discovery), not current.

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-23T02:38:47.000Z",["0x88022f07eB8F5c6FfECCd50152A6c7CAf69Bfc62"]],["2024-03-18T08:25:23.000Z",["0x2BeBced27D2c7ECE9C6cEa9daFD2711aDdc8a1Bc"]],["2024-06-20T02:59:11.000Z",["0xb4D37E8f6e970344c1cc99F65D8D1Afd5F7590D9"]],["2024-09-20T05:02:35.000Z",["0x59fF8Eb9B384a6e1146194D7b2e754694957c5Af"]]]
    }
```

```diff
    contract USDT Farm (0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract USDC Farm (0x830433dE03ABedE062660CC629e1A2c714272474) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract DAI Farm (0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract WBTC Farm (0xd910f6F23889919fAd9C8cE3171dd557cE0308Da) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0xac54d983e1bb572e4fb773ca0797b11461ff5438

# Diff at Fri, 20 Sep 2024 13:15:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c1f8c9b7beabeba1a847fb9e1064a356593cfe16 block: 20362600
- current block number: 20792032

## Description

Gas limit doubled (ETH Vault) and implementation of the PolicyAdmin changed (remains unverified). The Policy Admin 'can set bridging fees, gas limits and can pause / unpause the bridge or censor individual withdrawals.'

## Watched changes

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      values.$implementation:
-        "0xb4D37E8f6e970344c1cc99F65D8D1Afd5F7590D9"
+        "0x59fF8Eb9B384a6e1146194D7b2e754694957c5Af"
      values.$upgradeCount:
-        3
+        4
    }
```

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
      values.gasLimitForBridgeReceiver:
-        300000
+        600000
    }
```

Generated with discovered.json: 0xe61e5c603a688c56a6bcdaf85392b5d8984a8648

# Diff at Fri, 30 Aug 2024 07:54:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20362600
- current block number: 20362600

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20362600 (main branch discovery), not current.

```diff
    contract  (0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xFb504CD4eD46024B83c4337044995CF112205f18) {
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

Generated with discovered.json: 0xa58fefcf77e2e6ccc27c7182379206e8411cc8a9

# Diff at Fri, 23 Aug 2024 09:53:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20362600
- current block number: 20362600

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20362600 (main branch discovery), not current.

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract USDT Farm (0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract USDC Farm (0x830433dE03ABedE062660CC629e1A2c714272474) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract DAI Farm (0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract WBTC Farm (0xd910f6F23889919fAd9C8cE3171dd557cE0308Da) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0xe49277c1844eb9f39a95047cb7196773f0cf9796

# Diff at Wed, 21 Aug 2024 10:04:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20362600
- current block number: 20362600

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20362600 (main branch discovery), not current.

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70","via":[]}]
    }
```

```diff
    contract USDT Farm (0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFb504CD4eD46024B83c4337044995CF112205f18","via":[]}]
    }
```

```diff
    contract USDC Farm (0x830433dE03ABedE062660CC629e1A2c714272474) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFb504CD4eD46024B83c4337044995CF112205f18","via":[]}]
    }
```

```diff
    contract DAI Farm (0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFb504CD4eD46024B83c4337044995CF112205f18","via":[]}]
    }
```

```diff
    contract  (0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8","via":[]}]
    }
```

```diff
    contract WBTC Farm (0xd910f6F23889919fAd9C8cE3171dd557cE0308Da) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xFb504CD4eD46024B83c4337044995CF112205f18","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xFb504CD4eD46024B83c4337044995CF112205f18) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9","0x830433dE03ABedE062660CC629e1A2c714272474","0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0","0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9","via":[]},{"permission":"upgrade","target":"0x830433dE03ABedE062660CC629e1A2c714272474","via":[]},{"permission":"upgrade","target":"0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0","via":[]},{"permission":"upgrade","target":"0xd910f6F23889919fAd9C8cE3171dd557cE0308Da","via":[]}]
    }
```

Generated with discovered.json: 0x01d4fecd83df816472406673d2f1aaec61885fad

# Diff at Fri, 09 Aug 2024 12:01:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20362600
- current block number: 20362600

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20362600 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xFb504CD4eD46024B83c4337044995CF112205f18) {
    +++ description: None
      assignedPermissions.upgrade.3:
-        "0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"
+        "0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"
      assignedPermissions.upgrade.2:
-        "0x830433dE03ABedE062660CC629e1A2c714272474"
+        "0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0"
      assignedPermissions.upgrade.1:
-        "0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0"
+        "0x830433dE03ABedE062660CC629e1A2c714272474"
      assignedPermissions.upgrade.0:
-        "0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"
+        "0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"
    }
```

Generated with discovered.json: 0x50c5ce62e29d3b1d3e82adbef4b84d4192981e03

# Diff at Fri, 09 Aug 2024 10:11:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20362600
- current block number: 20362600

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20362600 (main branch discovery), not current.

```diff
    contract  (0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8"]
      assignedPermissions.upgrade:
+        ["0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8"]
    }
```

```diff
    contract ProxyAdmin (0xFb504CD4eD46024B83c4337044995CF112205f18) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9","0x830433dE03ABedE062660CC629e1A2c714272474","0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0","0xd910f6F23889919fAd9C8cE3171dd557cE0308Da"]
      assignedPermissions.upgrade:
+        ["0xd910f6F23889919fAd9C8cE3171dd557cE0308Da","0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0","0x830433dE03ABedE062660CC629e1A2c714272474","0x378F1CD69e1012cfe8FbeAfFeC02630190fda4d9"]
    }
```

Generated with discovered.json: 0x0ba4c97ce4590eccf4c9766af8432e548d700a62

# Diff at Tue, 30 Jul 2024 11:13:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20362600
- current block number: 20362600

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20362600 (main branch discovery), not current.

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
      fieldMeta:
+        {"policyAdmin":{"severity":"MEDIUM","description":"Can set bridging fees, gas limits and can pause / unpause the bridge or censor individual withdrawals."},"required":{"severity":"HIGH","description":"Threshold of the bridge governance admin multisig"}}
    }
```

Generated with discovered.json: 0x91684e58959b4d6b2f34fc48ef10d4839aa81ab5

# Diff at Mon, 22 Jul 2024 14:15:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 20132375
- current block number: 20362600

## Description

The bridge contract governors are changed (one is removed, six are changed to different addresses) and the taxReceiver (not used so far) is changed.

## Watched changes

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
      values.getOwners.9:
-        "0x86cec292d5d5DB6bA16722F0B01291426C4b61E2"
      values.getOwners.8:
-        "0xa6dc28CbcB2f8060a00b4FA67F9b67775AC5a3a1"
+        "0x1e3B165817b0f2935E1599eD5449a28f67D399EC"
      values.getOwners.7:
-        "0x6013f0B3ffE1fFdcA3Fc6A8cd705b1Af048F7437"
+        "0xE1A22D823bDb4A9Ed2Bdd1743628533Fa0C7f704"
      values.getOwners.6:
-        "0x1c0Cd56F1c3E2cF13B9B44dBE5529104bade543E"
+        "0xDF91c9BF46DD6f214AAB47F7AC9d64c22596d930"
      values.getOwners.4:
-        "0x3924Ac70075078A7713f543b72e3F8817ecEc646"
+        "0x8257E89eaBAFb01589351e431EB328E0dDc51fcD"
      values.getOwners.3:
-        "0x3b6590Ff12Ba188e465395E1610D8368613054B0"
+        "0x501A0F1436555E124c14ad9c1E48742F734B5179"
      values.getOwners.2:
-        "0x34EBf4f74a881eB63F666E63ce1Ff2F287CA5a8b"
+        "0x86cec292d5d5DB6bA16722F0B01291426C4b61E2"
      values.taxReceiver:
-        "0xE9f3604B85c9672728eEecf689cf1F0cF7Dd03F2"
+        "0xE93FEeE21009C3578C43A1F8487E3B2a5a731c6E"
    }
```

Generated with discovered.json: 0x1339f85b0b6761a29ed86b8f5a6b7e0ccf4c653a

# Diff at Thu, 20 Jun 2024 10:35:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aec998c0b1729b92e258e393212527022a7342b5 block: 19475340
- current block number: 20132375

## Description

The implementation of an unverified proxy is changed to a new unverified implementation. This address has the role PolicyAdmin in the ETH Vault and can set fees and pause / unpause.

## Watched changes

```diff
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8) {
    +++ description: None
      upgradeability.implementation:
-        "0x2BeBced27D2c7ECE9C6cEa9daFD2711aDdc8a1Bc"
+        "0xb4D37E8f6e970344c1cc99F65D8D1Afd5F7590D9"
      implementations.0:
-        "0x2BeBced27D2c7ECE9C6cEa9daFD2711aDdc8a1Bc"
+        "0xb4D37E8f6e970344c1cc99F65D8D1Afd5F7590D9"
    }
```

Generated with discovered.json: 0x0eea6c81a69f735161ed485b33e25b8b32f9fb13

# Diff at Wed, 20 Mar 2024 10:33:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@0a58f72fc0c5d7145b2e613962ce55cee5c1b355 block: 19224708
- current block number: 19475340

## Description

The policyAdmin is changed from an EOA to an unverified smart contract.
Required validators' signatures for an upgrade or withdrawal are decreased from 7 to 6 out of 10.

## Watched changes

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
    +++ description: None
+++ description: Can set bridging fees, gas limits and can pause / unpause the bridge or censor individual withdrawals.
+++ type: PERMISSION
+++ severity: MEDIUM
      values.policyAdmin:
-        "0x4C35e473D57cF4daA90BB9FE341CeDEc81124d05"
+        "0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8"
+++ description: Threshold of the bridge governance admin multisig
+++ type: PERMISSION
+++ severity: HIGH
      values.required:
-        7
+        6
    }
```

```diff
+   Status: CREATED
    contract  (0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70)
    +++ description: None
```

## Source code changes

```diff
.../-0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8/implementation/meta.txt | 2 ++
 .../.code/-0x09F3320e8d2dBD8913659bAb28940bb4f041eaD8/proxy/meta.txt    | 2 ++
 .../ethereum/.code/-0xc045b35d1cf9501B2fc95e7c489FDA96345A4D70/meta.txt | 2 ++
 3 files changed, 6 insertions(+)
```

Generated with discovered.json: 0x234afadbeb23f4a7f3f1b173e251e6330e692eee

# Diff at Wed, 14 Feb 2024 07:26:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@90897a821f9f4b90bdbfba06a5a5aa77fc31e145 block: 19064000
- current block number: 19224708

## Description

Change in ETH Vault owners (4 of the addresses are replaced with new ones).

## Watched changes

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
      values.getOwners.9:
-        "0x7F4b332611818aE13c76f9222e2229f274Ded9BD"
+        "0x86cec292d5d5DB6bA16722F0B01291426C4b61E2"
      values.getOwners.5:
-        "0x595f1a527527Fa28A8C5f294c49E51B9799fdAF0"
+        "0x8c7aa8Bf53f881703e7a9672C863Eb6147e43214"
      values.getOwners.1:
-        "0x67C3c784C49d9ab8757ADb71491df1A1B38FbFA8"
+        "0x98A86EB9Ff3B473E61B7b7a82Dd2c328323A66D0"
      values.getOwners.0:
-        "0x8a3F117Ef3b40f1661Dedf7f28fC33E7b6fae4F8"
+        "0x35f720fd3042EC8b05b7c8C8c0B33e45d71ad5Ba"
    }
```

Generated with discovered.json: 0x95c69471a8ecde9d0f3e88c6212cfd0117cae535

# Diff at Mon, 22 Jan 2024 18:20:21 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@f58cc44bf923844f52038487bcd5a563329f4b43 block: 17913544
- current block number: 19064000

## Description

ETH Vault has been deactivated.

## Watched changes

```diff
    contract ETH Vault (0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a) {
      values.isActivated:
-        true
+        false
    }
```
