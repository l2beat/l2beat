Generated with discovered.json: 0xe1506d2c2a77c9c3706cd6379696d915cd755128

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
