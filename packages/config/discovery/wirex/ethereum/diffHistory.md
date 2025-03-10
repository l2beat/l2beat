Generated with discovered.json: 0x0f52e84c5231490f729db9e189fba575a90231a3

# Diff at Tue, 04 Mar 2025 10:40:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766767
- current block number: 21766767

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      sinceBlock:
+        19505052
    }
```

```diff
    contract ProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      sinceBlock:
+        20270515
    }
```

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      sinceBlock:
+        20270516
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      sinceBlock:
+        20232613
    }
```

Generated with discovered.json: 0x37490b7438d38c5274263a2ceb43d97803f7d6ba

# Diff at Thu, 27 Feb 2025 11:47:06 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21766767
- current block number: 21766767

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "FflonkVerifier"
+        "Verifier"
      displayName:
-        "Verifier"
    }
```

Generated with discovered.json: 0x85f0ba3baae963c17c0ecd202de2d7b36cc8fc33

# Diff at Wed, 26 Feb 2025 10:33:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766767
- current block number: 21766767

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x8998cc447ebe71b90e2965bfb4c9f86e6ee4af83

# Diff at Tue, 04 Feb 2025 12:33:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766767
- current block number: 21766767

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766767 (main branch discovery), not current.

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xd7f87508fd92685be6282803ba7c198e613b7502

# Diff at Mon, 03 Feb 2025 09:09:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a86862ef704cb8a38295607226918095f937c05b block: 21744311
- current block number: 21744311

## Description

discodrive polygoncdk chains!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744311 (main branch discovery), not current.

```diff
    contract FflonkVerifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager.
      name:
-        "Verifier"
+        "FflonkVerifier"
      template:
+        "polygon-cdk/Verifier"
      displayName:
+        "Verifier"
      description:
+        "Verifies ZK proofs for state roots of this Layer 2 via the PolygonRollupManager."
    }
```

```diff
    contract ProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      name:
-        "DACProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
    }
```

```diff
    contract PolygonDataCommittee (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1).
      name:
-        "WirexPayChainDAC"
+        "PolygonDataCommittee"
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xb8605297399baEb6628C9E8F5D3E52A056492cfe","via":[{"address":"0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
+        "0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A"
      issuedPermissions.0.via.0:
-        {"address":"0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"}
      issuedPermissions.0.description:
+        "manage the members of the data availability committee and the threshold for valid commitments."
      template:
+        "polygon-cdk/PolygonDataCommittee"
      description:
+        "Manages the members of the data availability committee (DAC) and the threshold for accepting commitments from them (Currently 2/1)."
    }
```

```diff
    contract Validium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches.
      name:
-        "WirexPayChainValidium"
+        "Validium"
      template:
+        "polygon-cdk/PolygonZkEVM"
      displayName:
+        "PolygonZkEVM"
      description:
+        "The main system contract defining the pay-chain Layer 2 logic. Entry point for sequencing batches."
      issuedPermissions:
+        [{"permission":"configure","to":"0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A","description":"set core system parameters like the trusted sequencer and manage forced transactions/batches.","via":[]},{"permission":"configure","to":"0xecEA75e2854FD52b0aE5C51C88f5eA8e2eC4bf9A","description":"sole address that can force batches.","via":[]},{"permission":"sequence","to":"0x49a191471F248f7c86cA29477e6E969970BaEAdA","via":[]}]
      fieldMeta:
+        {"forceBatchAddress":{"severity":"HIGH","description":"If this changes to the ZERO address, an update to the risk rosette is probably needed, since forcing batches is open to everyone."}}
    }
```

Generated with discovered.json: 0xb1c46d9bf0ddb845aa2e66e34c6d27da840081fa

# Diff at Mon, 20 Jan 2025 11:10:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628493
- current block number: 21628493

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628493 (main branch discovery), not current.

```diff
    contract DACProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
      directlyReceivedPermissions.0.from:
+        "0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"
    }
```

```diff
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
    }
```

Generated with discovered.json: 0xda273b56a8732f100bfe957628930f248386445c

# Diff at Wed, 15 Jan 2025 07:48:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 20677136
- current block number: 21628493

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20677136 (main branch discovery), not current.

```diff
    contract DACProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x3748c865fbc30f1a153a66160d6761d3ab9c5596

# Diff at Mon, 21 Oct 2024 11:11:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20677136
- current block number: 20677136

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20677136 (main branch discovery), not current.

```diff
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xAce9269EaC3419937093154dea0AD44C36Df6963"]
      values.$pastUpgrades.0.1:
-        ["0xAce9269EaC3419937093154dea0AD44C36Df6963"]
+        "0xf72b5eafd4612b45278a8d49041d0736c6c4a6de6069160dec9a086e08027762"
    }
```

```diff
    contract WirexPayChainValidium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
      values.$pastUpgrades.0.1:
-        ["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]
+        "0xb727fee71f71c51e9d5fe335b8c6382b80f576364002f5986149004578a16af9"
    }
```

Generated with discovered.json: 0xa95a7e97b3b97875a1638147c61c6d243f153a4a

# Diff at Mon, 14 Oct 2024 10:57:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20677136
- current block number: 20677136

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20677136 (main branch discovery), not current.

```diff
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81) {
    +++ description: None
      sourceHashes:
+        ["0x0bc67d276b40b2ba13903d94fd6c25ae4d3d5162bc942763c418afdc11bc9b32"]
    }
```

```diff
    contract DACProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"}]
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x68f689a23d3badd91255602a1eb13d4789baedc16d904c3103244642fc78ca8f"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5"}]
    }
```

```diff
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78"
+        "0xb8605297399baEb6628C9E8F5D3E52A056492cfe"
      issuedPermissions.0.via.0:
+        {"address":"0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78","delay":0}
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xf7c38d00c4b6000f1840ed38f9ae99d753da8ac69ee1b6ac9ed614f2b60d470f"]
    }
```

```diff
    contract WirexPayChainValidium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: None
      sourceHashes:
+        ["0xa25e4c87882527d75fa2198c374939dd0c3b3fd509be89ee51c9b206bc62bdc4","0x7c56bc9e6cae8422520d318420d3b180551e366e0e265bc846875479cfabdef7"]
    }
```

Generated with discovered.json: 0x39961efda43844f0cba42161f343746d162f8572

# Diff at Tue, 01 Oct 2024 11:11:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20677136
- current block number: 20677136

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20677136 (main branch discovery), not current.

```diff
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-09T17:46:23.000Z",["0xAce9269EaC3419937093154dea0AD44C36Df6963"]]]
    }
```

```diff
    contract WirexPayChainValidium (0x78253E2E6120164bd826668A4C96Db20f78A94c9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-04T10:40:23.000Z",["0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C"]]]
    }
```

Generated with discovered.json: 0x6dbe8280005c0dd93f94d92e6c37c6e4ec7c7721

# Diff at Wed, 04 Sep 2024 12:11:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20677136

## Description

Initial discovery: Type 4 polygonCDK Validium with shared verifier and main contract implementation. No TVL tracking yet due to shared bridge.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x0775e11309d75aA6b0967917fB0213C5673eDf81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DACProxyAdmin (0x2B966b9824c11f274aa39f2f72cF25C4b47c3A78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WirexPayChainDAC (0x755e9A5B4BAEFc78Bb82BA7E6d2386CCB2F238a5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WirexPayChainValidium (0x78253E2E6120164bd826668A4C96Db20f78A94c9)
    +++ description: None
```
