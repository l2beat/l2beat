Generated with discovered.json: 0x78096fa68cd074ed0f7fca836848e97b50b48ad0

# Diff at Thu, 28 Mar 2024 10:31:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19218300
- current block number: 19532028

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19218300 (main branch discovery), not current.

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

Generated with discovered.json: 0x49181e4503e9468845b1d08bde6efff7f7601e23

# Diff at Fri, 13 Oct 2023 07:04:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@28e18077472448efd6132e6ee714b582cc1ee80b

## Description

Newly created contracts are the result of rediscovering the `upgradeBeacon` address.

## Watched changes

```diff
+   Status: CREATED
    contract HomeUpgradeBeacon (0x101a39eA1143cb252fc8093847399046fc35Db89) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceUpgradeBeacon (0x4d89F34dB307015F8002F97c1d100d84e3AFb76c) {
    }
```

```diff
+   Status: CREATED
    contract ReplicaUpgradeBeacon (0xA734EDE8229970776e1B68085D579b6b6E97dAd4) {
    }
```

```diff
+   Status: CREATED
    contract BridgeUpgradeBeacon (0xB6bB41B1fb8c381b002C405B8abB5D1De0C0abFE) {
    }
```

# Diff at Mon, 09 Oct 2023 13:00:07 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Added config.

## Watched changes

```diff
+   Status: CREATED
    contract ReplicaBeaconProxy (0x27658c5556A9a57f96E69Bbf6d3B8016f001a785) {
    }
```

```diff
+   Status: CREATED
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0x4F50a7081792063693F46A6402390b9647562457) {
    }
```

```diff
+   Status: CREATED
    contract BridgeRouterBeaconProxy (0x4fc16De11deAc71E8b2Db539d82d93BE4b486892) {
    }
```

```diff
+   Status: CREATED
    contract UpdaterManager (0x81B97dfBB743c343983e9bE7B863dB636DbD7373) {
    }
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0x8A926cE79f83A5A4C234BeE93feAFCC85b1E40cD) {
    }
```

```diff
+   Status: CREATED
    contract HomeBeaconProxy (0xa73a3a74C7044B5411bD61E1990618A1400DA379) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceRouterBeaconProxy (0xcbcF180dbd02460dCFCdD282A0985DdC049a4c94) {
    }
```
