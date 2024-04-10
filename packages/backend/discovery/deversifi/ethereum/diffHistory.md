Generated with discovered.json: 0xabdfcf07ab33d7c7e52e30b0120887d3bc69f91c

# Diff at Wed, 10 Apr 2024 11:12:41 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531530
- current block number: 19624852

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      upgradeability.implementation:
-        "0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583"
+        "0xc392DD8edAd534266cbf2817ee01dC68193DE23d"
      upgradeability.facets.StarkWare_TokensAndRamping_2022_2:
-        "0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb"
      upgradeability.facets.StarkWare_TokensAndRamping_2024_3:
+        "0x654cEF88e1EDD4B5a6d10815439768c60ca109a1"
      implementations.2:
-        "0x2Dbc18A3ac126abE1fF90A83Bbc3947ff7912Afb"
+        "0x654cEF88e1EDD4B5a6d10815439768c60ca109a1"
      implementations.0:
-        "0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583"
+        "0xc392DD8edAd534266cbf2817ee01dC68193DE23d"
      values.implementation:
-        "0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583"
+        "0xc392DD8edAd534266cbf2817ee01dC68193DE23d"
      values.VERSION:
-        "4.5.1"
+        "4.5.2-bl"
      values.isBlockListed:
+        [false,false,false,false,false]
      errors:
+        {"isBlockListed":"Too many values. Update configuration to explore fully"}
    }
```

## Source code changes

```diff
.../StarkExchange/implementation-1/meta.txt        |  2 +-
 .../src/components}/GovernanceStorage.sol          |  4 +-
 .../contracts/src/components}/MainStorage.sol      | 11 ++++--
 .../contracts/src/interfaces}/BlockDirectCall.sol  |  2 +-
 .../contracts/src/interfaces}/IDispatcherBase.sol  |  2 +-
 .../contracts/src/interfaces}/Identity.sol         |  2 +-
 .../contracts/src/interfaces}/MGovernance.sol      |  2 +-
 .../contracts/src/interfaces}/MainDispatcher.sol   |  6 +--
 .../src/interfaces}/MainDispatcherBase.sol         | 10 ++---
 .../contracts/src/interfaces}/SubContractor.sol    |  4 +-
 .../contracts/src/libraries}/Common.sol            |  2 +-
 .../contracts/src/starkex}/StarkExchange.sol       | 18 ++++-----
 .../contracts/src/upgrade}/ProxyStorage.sol        |  4 +-
 .../StarkExchange/implementation-3/meta.txt        |  2 +-
 .../contracts/src/components}/ActionHash.sol       |  6 +--
 .../contracts/src/components}/ERC1155Receiver.sol  |  4 +-
 .../contracts/src/components}/ERC721Receiver.sol   |  4 +-
 .../contracts/src/components}/Freezable.sol        | 10 ++---
 .../contracts/src/components}/Governance.sol       |  4 +-
 .../src/components}/GovernanceStorage.sol          |  4 +-
 .../contracts/src/components}/KeyGetters.sol       |  6 +--
 .../contracts/src/components}/MainGovernance.sol   |  6 +--
 .../contracts/src/components}/MainStorage.sol      | 11 ++++--
 .../contracts/src/components}/TokenRegister.sol    | 12 +++---
 .../contracts/src/components}/TokenTransfers.sol   | 14 +++----
 .../src/interactions}/AcceptModifications.sol      | 10 ++---
 .../contracts/src/interactions/Blocklist.sol       | 40 +++++++++++++++++++
 .../contracts/src/interactions}/Deposits.sol       | 20 +++++-----
 .../contracts/src/interactions}/TokenAssetData.sol | 10 ++---
 .../src/interactions}/TokenQuantization.sol        |  6 +--
 .../contracts/src/interactions}/Withdrawals.sol    | 26 +++++++------
 .../contracts/src/interfaces}/Identity.sol         |  2 +-
 .../src/interfaces}/MAcceptModifications.sol       |  2 +-
 .../contracts/src/interfaces/MBlocklist.sol        | 45 ++++++++++++++++++++++
 .../contracts/src/interfaces}/MDeposits.sol        |  2 +-
 .../contracts/src/interfaces}/MFreezable.sol       |  2 +-
 .../contracts/src/interfaces}/MGovernance.sol      |  2 +-
 .../contracts/src/interfaces}/MKeyGetters.sol      |  2 +-
 .../contracts/src/interfaces}/MTokenAssetData.sol  |  2 +-
 .../src/interfaces}/MTokenQuantization.sol         |  2 +-
 .../contracts/src/interfaces}/MTokenTransfers.sol  |  2 +-
 .../contracts/src/interfaces}/SubContractor.sol    |  4 +-
 .../contracts/src/libraries}/Common.sol            |  2 +-
 .../contracts/src/libraries}/LibConstants.sol      |  2 +-
 .../src/starkex/components}/StarkExStorage.sol     |  4 +-
 .../interactions}/StarkExForcedActionState.sol     |  8 ++--
 .../interfaces}/MStarkExForcedActionState.sol      |  2 +-
 .../toplevel_subcontracts}/TokensAndRamping.sol    | 39 ++++++++++---------
 .../contracts/src/tokens/ERC1155}/IERC1155.sol     |  2 +-
 .../src/tokens/ERC1155}/IERC1155Receiver.sol       |  2 +-
 .../contracts/src/tokens/ERC20}/IERC20.sol         |  2 +-
 .../src/tokens/ERC721}/IERC721Receiver.sol         |  2 +-
 .../contracts/src/upgrade}/ProxyStorage.sol        |  4 +-
 53 files changed, 248 insertions(+), 152 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531530 (main branch discovery), not current.

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x28780349A33eEE56bb92241bAAB8095449e24306"]
+        "0x28780349A33eEE56bb92241bAAB8095449e24306"
      values.getRegisteredVerifiers:
-        ["0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73"]
+        "0x3b1298395290Bb7924F0Fcc176DECF3B4879FE73"
    }
```

Generated with discovered.json: 0x4b6fe18ad8f293504a0a33f9c42978bb3a90f0b0

# Diff at Thu, 28 Mar 2024 08:50:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19512697
- current block number: 19531530

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19512697 (main branch discovery), not current.

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0xa8a01225c5752db0370ec77705d39bcb620fa9a0

# Diff at Mon, 25 Mar 2024 16:34:55 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e6ff14fa637ed6c3a674ff43e070f1cf65f4aa1e block: 19485578
- current block number: 19512697

## Description

The upgrade delay of the StarkExchange escrow is reduced from 14 to 3 days. This is the delay after which the Governors can upgrade the implementation.

## Watched changes

```diff
    contract StarkExchange (0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b) {
    +++ description: None
      upgradeability.upgradeDelay:
-        1209600
+        259200
    }
```

Generated with discovered.json: 0xa561735c000067bf6baa50f29262ba681f1a87f8

# Diff at Thu, 21 Mar 2024 21:03:02 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@173befb1ef4ba15605c92f5f89227f2ffd2af3eb block: 19481771
- current block number: 19485578

## Description

Remove three signers and raise threshold. The gov multisig is now 4/6.

## Watched changes

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.8:
-        "0x0405107a60391Eb51821be373ff978115Ee58488"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
-        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+++ description: Threshold of the Multisig
+++ type: PERMISSION
+++ severity: HIGH
      values.getThreshold:
-        2
+        4
    }
```

Generated with discovered.json: 0x18bf4f662d02fa88c9f4ffe7a437d3a8cb716f2a

# Diff at Thu, 21 Mar 2024 08:12:23 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@fae0f54992a5b56e7393c77915df2eef2a6dd0bf block: 17968886
- current block number: 19481771

## Description

Add 6 signers to the Governance Multisig, which is now 2/9.

## Watched changes

```diff
    contract GovernanceMultisig (0xCCa5De1e10c05c50C51ac551D9182cd31aca1889) {
    +++ description: This Multisig itself is one of the two Governors, the other being an EOA, both equally permissioned to upgrade the bridge.
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.8:
+        "0x0405107a60391Eb51821be373ff978115Ee58488"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
+        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
+        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
+        "0xe0fE5b38C52A83308bEC9242d768441025DBB4D8"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
+        "0x445EEDE2681116Dd94C8D5Bfab73283B3ef1f6f3"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
+        "0x611F96c83fE0A30B504Ee2C6a2Cae890e620bA35"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.2:
-        "0x0405107a60391Eb51821be373ff978115Ee58488"
+        "0x0fa6bf3377Cfa276d9d7122c09C187e5e8ef1C59"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.1:
-        "0xd38831Bcb40bdEE0577Ee064112Fa77a38cAd3F8"
+        "0x478615F37FcCB0DF69C191a8674233f6899D092e"
+++ description: Signers of the Multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.0:
-        "0x59232aC80E6d403b6381393e52f4665ECA328558"
+        "0x94aa58E38ac22518Cf0E267cd062Ed7E78eA958E"
    }
```

Generated with discovered.json: 0x2b4f4061348e353e029e23053815e06089f74a92
