Generated with discovered.json: 0xa0cc6bb4698f09dc52faf5acbe9e3e3ec2647608

# Diff at Fri, 14 Jun 2024 09:10:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e0044dca50e937818bd705c0a4de3d1abb379fad block: 19697841
- current block number: 20089055

## Description

Add Wormhole Relayer, NFTBridge and Circle adapter.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19697841 (main branch discovery), not current.

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
    +++ description: None
      values.WETH:
+        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
```

```diff
    contract Wormhole (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      name:
-        "Wormhole"
+        "WormholeCore"
    }
```

```diff
+   Status: CREATED
    contract WormholeRelayer (0x27428DD2d3DD32A4D7f7C497eAaa23130d894911)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NFTBridge (0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeliveryProviderImplementation (0x7A0a53847776f7e94Cc35742971aCb2217b0Db81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CircleIntegration (0xAaDA05BD399372f0b0463744C09113c137636f6a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NFTImplementation (0xEc4d807Cd33a48A7C8Cd73D09B41Aa5160B3a7fc)
    +++ description: None
```

Generated with discovered.json: 0xcdb93f13e524a5818a8fc4185305b9a8371e08bf

# Diff at Sat, 20 Apr 2024 16:33:52 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 18483329
- current block number: 19697841

## Description

A Guardian is replaced. (Guardians are permissioned actors for bridging transfer signatures and SC upgrades)

## Watched changes

```diff
    contract Wormhole (0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B) {
    +++ description: None
      values.getCurrentGuardianSetIndex:
-        3
+        4
      values.guardianSet.0.0:
-        "0x58CC3AE5C097b213cE3c81979e1B9f9570746AA5"
+        "0x5893B5A76c3f739645648885bDCcC06cd70a3Cd3"
    }
```

Generated with discovered.json: 0x8bf5589032a5a15f5c7fe123d36f5db04cb97ef4

# Diff at Thu, 02 Nov 2023 08:52:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@370ecaf744134c819956061d3c2a56bca3cd1087

## Description

Now emits an event (event TransferRedeemed) upon token transfer completion by the bridge. The `initialize()` function of the BridgeImplementation has been gutted and now does nothing. Because of that it seems like the current version of the code is incapable of changing the implementation address of the TokenContract. The `IWormhole.sol` interface has been expanded by additional functions and events plus the structs that were in `Structs.sol` have been moved to it as well.

## Watched changes

```diff
    contract TokenBridge (0x3ee18B2214AFF97000D974cf647E7C347E8fa585) {
      upgradeability.implementation:
-        "0x299b4F6066d231521d11FAE8331fb1A4fe794F58"
+        "0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"
      implementations.0:
-        "0x299b4F6066d231521d11FAE8331fb1A4fe794F58"
+        "0x381752f5458282d317d12C30D2Bd4D6E1FD8841e"
    }
```

## Source code changes

```diff
.../contracts/Structs.sol => /dev/null             |  40 -------
 .../implementation/contracts/bridge/Bridge.sol     |  15 +++
 .../contracts/bridge/BridgeGetters.sol             |   7 +-
 .../contracts/bridge/BridgeImplementation.sol      |  39 -------
 .../contracts/bridge/BridgeSetters.sol             |   1 +
 .../contracts/bridge/interfaces/IWETH.sol          |  11 ++
 .../contracts/interfaces/IWormhole.sol             | 126 ++++++++++++++++++---
 .../TokenBridge/implementation/meta.txt            |   2 +-
 8 files changed, 142 insertions(+), 99 deletions(-)
```
