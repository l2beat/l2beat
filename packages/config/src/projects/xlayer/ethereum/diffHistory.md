Generated with discovered.json: 0x169ab6cdb182f9c6da70ea1e157c19055882a44c

# Diff at Tue, 04 Mar 2025 10:40:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21764788
- current block number: 21764788

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764788 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/2).
      sinceBlock:
+        19545591
    }
```

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      sinceBlock:
+        19545590
    }
```

```diff
    contract Validium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: The main system contract defining the X Layer Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        19545462
    }
```

```diff
    contract Verifier (0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        21444781
    }
```

Generated with discovered.json: 0x64451cb0c3339798243b4e75fedb3cba4bee38a3

# Diff at Thu, 27 Feb 2025 11:47:09 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21764788
- current block number: 21764788

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764788 (main branch discovery), not current.

```diff
    contract Verifier (0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "FflonkVerifier_13"
+        "Verifier"
      displayName:
-        "Verifier"
    }
```

Generated with discovered.json: 0x5afc2dba86c4c1cf051a5d576faf19b18e2029a9

# Diff at Wed, 26 Feb 2025 10:33:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21764788
- current block number: 21764788

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764788 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/2).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Validium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: The main system contract defining the X Layer Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FflonkVerifier_13 (0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x77210c3b385892d8c73bb0ab4f4672c096957e0a

# Diff at Tue, 04 Feb 2025 12:33:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21764788
- current block number: 21764788

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21764788 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/2).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Validium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: The main system contract defining the X Layer Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x647058a59ed8a77ef9e86fe0f87a753c73074986

# Diff at Mon, 03 Feb 2025 09:09:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21665594
- current block number: 21764788

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21665594 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/2).
      name:
-        "XLayerValidiumDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xE4c5BFaddbf21a1F35AE66F180F78822078FBfDE","via":[{"address":"0x1e37EA18e9515db29b3E94A00eD31484A3130204"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xE4c5BFaddbf21a1F35AE66F180F78822078FBfDE"
+        "0x491619874b866c3cDB7C8553877da223525ead01"
      issuedPermissions.0.via.0:
-        {"address":"0x1e37EA18e9515db29b3E94A00eD31484A3130204"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/2)."
    }
```

```diff
    contract Validium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: The main system contract defining the X Layer Layer 2 logic. Entry point for sequencing batches.
      name:
-        "XLayerValidium"
+        "Validium"
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the X Layer Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0x491619874b866c3cDB7C8553877da223525ead01","description":"sole address that can force batches.","via":[]},{"permission":"configure","to":"0xa90B4C8B8807569980F6cC958c8905383136B5eA","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"sequence","to":"0xAF9d27ffe4d51eD54AC8eEc78f2785D7E11E5ab1","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

```diff
    contract FflonkVerifier_13 (0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "XLayerVerifier"
+        "FflonkVerifier_13"
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

Generated with discovered.json: 0x9fe132a167297d89f06cd547302a95f9b329acdb

# Diff at Mon, 20 Jan 2025 12:06:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@658eb33e9afd98eac45a3037d195357115d19a86 block: 21579520
- current block number: 21665594

## Description

New local admin (EOA, was EOA, no warn necessary).

## Watched changes

```diff
    contract XLayerValidium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      values.admin:
-        "0x491619874b866c3cDB7C8553877da223525ead01"
+        "0xa90B4C8B8807569980F6cC958c8905383136B5eA"
      values.pendingAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "0xa90B4C8B8807569980F6cC958c8905383136B5eA"
    }
```

Generated with discovered.json: 0xf179d7b0ac740bbc36a3efc299a288c61a12d03f

# Diff at Mon, 20 Jan 2025 11:10:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21579520
- current block number: 21579520

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21579520 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xE4c5BFaddbf21a1F35AE66F180F78822078FBfDE"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xE4c5BFaddbf21a1F35AE66F180F78822078FBfDE"
    }
```

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x05652Ec92366F3C2255991a265c499E01Ba58e6a"
      directlyReceivedPermissions.0.from:
+        "0x05652Ec92366F3C2255991a265c499E01Ba58e6a"
    }
```

Generated with discovered.json: 0x5eb3b0bb62b5e238073347573831491b15662331

# Diff at Wed, 08 Jan 2025 11:41:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3e3597c92f09cb5fc5a7ac01db63929f663c026f block: 20832964
- current block number: 21579520

## Description

Upgrade to rollupType 8 (same implementation as [rollupType 7 from the servicing upgrade](https://polygon.technology/blog/polygon-zkevm-servicing-update-coming-to-mainnet-beta) but different verifier code).

The previous rollupType was 4.

## Watched changes

```diff
    contract XLayerValidium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      sourceHashes.1:
-        "0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"
+        "0x78d1eb2b96633fb1f594ef672a3791fa85a077fe0cf415ef79d93bc9a2aebd9c"
      values.$implementation:
-        "0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"
+        "0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"
      values.$pastUpgrades.1:
+        ["2025-01-07T13:41:23.000Z","0x9d23f56225d22a2a1b82c2aa6122b1a29896686b30bb1f3def0189043699d46f",["0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F"]]
      values.$upgradeCount:
-        1
+        2
      derivedName:
-        "PolygonValidiumStorageMigration"
+        "PolygonValidiumEtrog"
    }
```

```diff
+   Status: CREATED
    contract XLayerVerifier (0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB)
    +++ description: None
```

## Source code changes

```diff
.../XLayerValidium/PolygonValidiumEtrog.sol}       |  203 ++--
 .../xlayer/ethereum/.flat/XLayerVerifier.sol       | 1225 ++++++++++++++++++++
 2 files changed, 1336 insertions(+), 92 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20832964 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract XLayerVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

Generated with discovered.json: 0x146dcaf500c70a6bd92e607fa08868ab8a97ece3

# Diff at Mon, 21 Oct 2024 11:12:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20832964
- current block number: 20832964

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20832964 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xd620Ca1ad5c3888e4521c3374cE4088Cb78079b8"]
      values.$pastUpgrades.0.1:
-        ["0xd620Ca1ad5c3888e4521c3374cE4088Cb78079b8"]
+        "0xf57e0fd610164ee944168cddc98cc89adfe29cb9c9c96940eb5d899a0249e44f"
    }
```

```diff
    contract XLayerValidium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
      values.$pastUpgrades.0.1:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
+        "0x35215d1a6f4ad41bedfbfc481d53b9d508864a6ace025f243264978e1a755f81"
    }
```

Generated with discovered.json: 0xd841085d5e6926c5981e003384a8768b3569b012

# Diff at Mon, 14 Oct 2024 10:57:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20832964
- current block number: 20832964

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20832964 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1e37EA18e9515db29b3E94A00eD31484A3130204"
+        "0xE4c5BFaddbf21a1F35AE66F180F78822078FBfDE"
      issuedPermissions.0.via.0:
+        {"address":"0x1e37EA18e9515db29b3E94A00eD31484A3130204","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf7c38d00c4b6000f1840ed38f9ae99d753da8ac69ee1b6ac9ed614f2b60d470f"]
    }
```

```diff
    contract XLayerVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: None
      sourceHashes:
+        ["0x0bc67d276b40b2ba13903d94fd6c25ae4d3d5162bc942763c418afdc11bc9b32"]
    }
```

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x05652Ec92366F3C2255991a265c499E01Ba58e6a"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x05652Ec92366F3C2255991a265c499E01Ba58e6a"}]
    }
```

```diff
    contract XLayerValidium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0xfc0452d58abac01438b8c50c014c8b8ffcb6daec

# Diff at Tue, 01 Oct 2024 11:11:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20832964
- current block number: 20832964

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20832964 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-30T08:28:47.000Z",["0xd620Ca1ad5c3888e4521c3374cE4088Cb78079b8"]]]
    }
```

```diff
    contract XLayerValidium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-30T08:02:35.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

Generated with discovered.json: 0xeca515205bc21e41e7fb9686e79741467dbd28a4

# Diff at Thu, 26 Sep 2024 06:22:35 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@374d77799a44e3b2fcc4828675ccc0b0ff6146d0 block: 20325087
- current block number: 20832964

## Description

Ignore gas token.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

Generated with discovered.json: 0x529839bbd0d774852f45035d2084596df11b078e

# Diff at Fri, 30 Aug 2024 08:01:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20325087
- current block number: 20325087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x2c06eeec5c27656ca558d100c206b541febcb129

# Diff at Fri, 23 Aug 2024 09:56:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20325087
- current block number: 20325087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract XLayerValidium (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x1b167fa7de69394f47c613b41710d3732c805fe1

# Diff at Wed, 21 Aug 2024 10:06:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20325087
- current block number: 20325087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1e37EA18e9515db29b3E94A00eD31484A3130204","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x05652Ec92366F3C2255991a265c499E01Ba58e6a"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x05652Ec92366F3C2255991a265c499E01Ba58e6a","via":[]}]
    }
```

```diff
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4A164CA582D169f7caad471250991Dd861ddA981","via":[]}]
    }
```

Generated with discovered.json: 0x463ce9801dabc8dd2fb9a292a93b5c2733627b7d

# Diff at Fri, 09 Aug 2024 10:13:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20325087
- current block number: 20325087

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20325087 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x05652Ec92366F3C2255991a265c499E01Ba58e6a"]
      assignedPermissions.upgrade:
+        ["0x05652Ec92366F3C2255991a265c499E01Ba58e6a"]
    }
```

Generated with discovered.json: 0x1b09cde9ac50176d9fc89600655a3b677eb15944

# Diff at Wed, 17 Jul 2024 08:35:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0df6fda263b58edb9acce032017abb5ebd61f5fd block: 19882097
- current block number: 20325087

## Description

Introduced a new LocalAdmin, not handled by the shared template, which mainContract admin (not the upgradeabilityAdmin) and who can change local system configs. This role was wrongly given to the SharedProxyAdminOwner before.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19882097 (main branch discovery), not current.

```diff
    contract XLayerValidiumEtrog (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      name:
-        "XLayerValidiumEtrog"
+        "XLayerValidium"
    }
```

Generated with discovered.json: 0xedecf8c6eda26e5959db341cbc0c301a4ee07513

# Diff at Thu, 16 May 2024 10:59:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@59d36171ee3aaf27d6db0c75fdfba523d2dad686 block: 19731428
- current block number: 19882097

## Description

Changes related to merging with shared-polygon-cdk module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19731428 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```

Generated with discovered.json: 0x1578b061f84010d1b39b280f0615f999aad6c3c0

# Diff at Thu, 25 Apr 2024 09:16:57 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@10dca19aa3157c731f7438b0d699d97aafdf4cd7 block: 19718023
- current block number: 19731428

## Description

The contract (`PolygonValidiumStorageMigration.sol`, here `XLayerValidiumEtrog`) was already diff'd to Astar by Luca (0 diff).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718023 (main branch discovery), not current.

```diff
    contract XLayerValidiumEtrog (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507) {
    +++ description: None
      unverified:
-        true
    }
```

Generated with discovered.json: 0xf7a1cc6de98a35d884df3f95f5d35f645ab1b400

# Diff at Tue, 23 Apr 2024 12:14:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 19718023

## Description

New Validium. There is no diff with Astar zkEVM.

## Initial discovery

```diff
+   Status: CREATED
    contract XLayerValidiumDAC (0x05652Ec92366F3C2255991a265c499E01Ba58e6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XLayerVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SharedProxyAdmin (0x0F99738B2Fc14D77308337f3e2596b63aE7BCC4A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1e37EA18e9515db29b3E94A00eD31484A3130204)
    +++ description: None
```

```diff
+   Status: CREATED
    contract XLayerValidiumEtrog (0x2B0ee28D4D51bC9aDde5E58E295873F61F4a0507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonRollupManager (0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OKBImplementation (0x75231F58b43240C9718Dd58B4967c5114342a86c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonZkEVMTimelock (0xEf1462451C30Ea7aD8555386226059Fe837CA4EF)
    +++ description: None
```
