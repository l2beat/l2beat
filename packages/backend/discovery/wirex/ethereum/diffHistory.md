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
