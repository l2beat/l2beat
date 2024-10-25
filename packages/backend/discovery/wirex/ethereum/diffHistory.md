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
