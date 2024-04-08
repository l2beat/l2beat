Generated with discovered.json: 0x8cae334dd38dc116f7f7fdfc4fe76036673b3062

# Diff at Thu, 28 Mar 2024 10:30:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19418951
- current block number: 19532023

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19418951 (main branch discovery), not current.

```diff
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract Governor (0x5Fa96B622D1F4e920b92040c10fA297ca496ad37) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 7 (43%)"
    }
```

```diff
    contract GnosisSafe (0xBcd15f82Ae461335257d0851A18948784cF79E9d) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0x159de1be895e6c6e43beb7bdbb71ffdced4bbe70

# Diff at Fri, 13 Oct 2023 07:04:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@28e18077472448efd6132e6ee714b582cc1ee80b

## Description

Newly created contracts are the result of rediscovering the `upgradeBeacon` address.

## Watched changes

```diff
+   Status: CREATED
    contract ReplicaUpgradeBeacon (0x10a432946e24C49866c243a13BE7205B3EF929ee) {
    }
```

```diff
+   Status: CREATED
    contract BridgeUpgradeBeacon (0x3b96B42D1F4962CB21049fB237A886E2860AfacB) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceUpgradeBeacon (0x681Edb6d52138cEa8210060C309230244BcEa61b) {
    }
```

```diff
+   Status: CREATED
    contract HomeUpgradeBeacon (0x9E4C2547307e221383A4bcba6065389C69Bd4628) {
    }
```

# Diff at Mon, 09 Oct 2023 13:37:39 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Update discovery to include the multisig threshold.

## Watched changes

```diff
+   Status: CREATED
    contract RecoveryManager (0x2bB2a5A724170357cb691841F40d26A950d8C33D) {
    }
```

```diff
+   Status: CREATED
    contract UpdaterManager (0x2CC80EE8a3f9c85309866F4C6BDF82f6846891EC) {
    }
```

```diff
+   Status: CREATED
    contract GovernanceRouterBeaconProxy (0x42303634F37956687fB7ff2c6146AC842481A052) {
    }
```

```diff
+   Status: CREATED
    contract Governor (0x5Fa96B622D1F4e920b92040c10fA297ca496ad37) {
    }
```

```diff
+   Status: CREATED
    contract BridgeRouterBeaconProxy (0x6a39909e805A3eaDd2b61fFf61147796ca6aBB47) {
    }
```

```diff
+   Status: CREATED
    contract ReplicaBeaconProxy (0x7725EadaC5Ee986CAc8317a1d2fB16e59e079E8b) {
    }
```

```diff
+   Status: CREATED
    contract UpgradeBeaconController (0xbB6d6333FAFd2cae7ef4c5EFBF8f048F2F109D1B) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xBcd15f82Ae461335257d0851A18948784cF79E9d) {
    }
```

```diff
+   Status: CREATED
    contract XAppConnectionManager (0xcEc158A719d11005Bd9339865965bed938BEafA3) {
    }
```

```diff
+   Status: CREATED
    contract HomeBeaconProxy (0xf25C5932bb6EFc7afA4895D9916F2abD7151BF97) {
    }
```
