Generated with discovered.json: 0x6aa238b93e1fb75daa84f0b1ea40a61326c2f152

# Diff at Wed, 14 Feb 2024 10:08:14 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@6045526c8b7e15993de0acdd037b3ffbaa1bedda block: 18820326
- current block number: 19225512

## Description

A new pool for mETH is added. The Default basis point multiplier of the Google Oracle is updated (related to fees). The latest version of the LayerZero Endpoint contract is updated:

- Version 4: 0xd231084bfb234c107d3ee2b22f97f3346fdaf705 (SendUln301)
- Version 5: 0x245b6e8ffe9ea5fc301e32d16f66bd4c2123eefc (ReceiveUln301)

## Watched changes

```diff
    contract Factory (0x06D538690AF257Da524f25D0CD52fD85b1c2173E) {
      values.allPools[12]:
+        "0xA572d137666DCbAdFA47C3fC41F15e90134C618c"
      values.allPoolsLength:
-        12
+        13
    }
```

```diff
    contract Endpoint (0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675) {
      values.latestVersion:
-        3
+        5
    }
```

```diff
    contract Google Cloud Oracle (0xD56e4eAb23cb81f43168F9F45211Eb027b9aC7cc) {
      values.defaultMultiplierBps:
-        12000
+        12100
    }
```

```diff
+   Status: CREATED
    contract mETH Pool (0xA572d137666DCbAdFA47C3fC41F15e90134C618c) {
    }
```

## Source code changes

```diff
.../@openzeppelin/contracts/access/Ownable.sol     |  68 +++
 .../@openzeppelin/contracts/math/SafeMath.sol      | 214 +++++++
 .../@openzeppelin/contracts/utils/Context.sol      |  24 +
 .../contracts/utils/ReentrancyGuard.sol            |  62 ++
 .../.code/mETH Pool/contracts/LPTokenERC20.sol     | 134 +++++
 .../ethereum/.code/mETH Pool/contracts/Pool.sol    | 644 +++++++++++++++++++++
 .../contracts/interfaces/IStargateFeeLibrary.sol   |  17 +
 .../stargate/ethereum/.code/mETH Pool/meta.txt     |   2 +
 8 files changed, 1165 insertions(+)
```

Generated with discovered.json: 0x98cb3e3594feadbd9145ee754066d371eda0c119

# Diff at Tue, 19 Dec 2023 13:36:06 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@1e70db199340dc9df7ac0996900e54067b9d4f12

## Description

Added new config values.

## Watched changes

```diff
    contract UltraLightNodeV2 (0x4D73AdB72bC3DD368966edD0f0b2148401A178E2) {
      values.stargateOracles[1]:
+        "0x000000000000000000000000d56e4eab23cb81f43168f9f45211eb027b9ac7cc"
      values.stargateOracles[0]:
+        "0x0000000000000000000000005a54fe5234e811466d5366846283323c954310b2"
      values.stargateRelayers[0]:
+        "0x000000000000000000000000902f09715b6303d4173037652fa7377e5b98089e"
    }
```

# Diff at Thu, 23 Nov 2023 13:31:10 GMT:

- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: main@2ff45714640abe4c50d283967078888d4af81d78

## Description

StarGateFeeLibrary7 owner was replaced: 0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d -> 0x65bb797c2B9830d891D87288F029ed8dACc19705

## Watched changes

```diff
    contract StarGateFeeLibrary7 (0x8C3085D9a554884124C998CDB7f6d7219E9C1e6F) {
      values.owner:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x65bb797c2B9830d891D87288F029ed8dACc19705"
    }
```

# Diff at Fri, 17 Nov 2023 12:24:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@8df7aef75226275b8e56ba8d4d76ce64057b0360

## Description

One EOA owner was replaced in StarGate Multisig:

- removed: 0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1
- added: 0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437

The same change was performed on a multisig in the Aptos project.

## Watched changes

```diff
    contract StarGate Multisig (0x65bb797c2B9830d891D87288F029ed8dACc19705) {
      values.getOwners.2:
-        "0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1"
+        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
      values.getOwners.1:
-        "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
+        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
      values.getOwners.0:
-        "0x565cFd7224bbc2a81a6e2a1464892ecB27efB070"
+        "0x2E1078e128e8AA6A70eC8d1B17A79Fc4B457d437"
    }
```
