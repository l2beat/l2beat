# Diff at Mon, 15 Jan 2024 14:53:19 GMT

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@51b4576752b780b70ed977cf2d54041a7eb81039 block: 18618865
- current block number: 19012997

## Description

New role has been configured (`1`).
One and only member has been assigned (`0x453B3A4b4d64B4E6f472A306c3D4Fc318C34bbA8`).

Assigned member can now invoke:

- `pauseByType(bytes32)` on ZkEVM/MessageService (`0xd19d4B5d358258f05D7B411E21A1460D11B0876F`)
- `pause()` on ERC20Bridge (`0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319`)
- `pause()` on USDCBridge (`0x504A330327A089d8364C4ab3811Ee26976d388ce`)

## The member of this role can now invoke

## Watched changes

```diff
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
      upgradeability.modules[0]:
+        "0x453B3A4b4d64B4E6f472A306c3D4Fc318C34bbA8"
      values.roles.roles.1:
+        {"members":{"0x453B3A4b4d64B4E6f472A306c3D4Fc318C34bbA8":true},"targets":{"0xd19d4B5d358258f05D7B411E21A1460D11B0876F":{"clearance":"Function","options":"None"},"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319":{"clearance":"Function","options":"None"},"0x504A330327A089d8364C4ab3811Ee26976d388ce":{"clearance":"Function","options":"None"}},"functions":{"0xd19d4B5d358258f05D7B411E21A1460D11B0876F":{"pauseByType(bytes32)":{"options":"None","wildcarded":true,"parameters":[]}},"0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319":{"pause()":{"options":"None","wildcarded":true,"parameters":[]}},"0x504A330327A089d8364C4ab3811Ee26976d388ce":{"pause()":{"options":"None","wildcarded":true,"parameters":[]}}},"compValues":{},"compValuesOneOf":{}}
    }
```

# Diff at Thu, 23 Nov 2023 15:07:23 GMT

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2ff45714640abe4c50d283967078888d4af81d78

## Description

Added a new module to the AdminMultisig called Roles. The owner of this module
(the AdminMultisig itself) can grant or remove access to given targets (whole
contracts) or just a certain function in a given contract per role. The module
checks if the message sender has a given role and checks if the role is allowed
to execute a given operation. This whole module seems like it solves the same
issue as AccessControl but with more granularity just like the extended
AccessControl in Scroll.

## Watched changes

```diff
    contract AdminMultisig (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
      upgradeability.modules[0]:
+        "0xF24f1DC519d88246809B660eb56D94048575d083"
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
      values.limitInWei:
-        "6250000000000000000000"
+        "18750000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761) {
    }
```

```diff
+   Status: CREATED
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083) {
    }
```

## Source code changes

```diff
.../linea/ethereum/.code/MultiSend/MultiSend.sol   |  66 ++
 .../linea/ethereum/.code/MultiSend/meta.txt        |   2 +
 .../safe-contracts/contracts/common/Enum.sol       |   8 +
 .../contracts/interfaces/IERC165.sol               |  15 +
 .../@gnosis.pm/zodiac/contracts/core/Modifier.sol  | 134 +++
 .../@gnosis.pm/zodiac/contracts/core/Module.sol    | 116 +++
 .../zodiac/contracts/factory/FactoryFriendly.sol   |  10 +
 .../zodiac/contracts/guard/BaseGuard.sol           |  38 +
 .../zodiac/contracts/guard/Guardable.sol           |  31 +
 .../zodiac/contracts/interfaces/IAvatar.sol        |  66 ++
 .../zodiac/contracts/interfaces/IGuard.sol         |  22 +
 .../access/OwnableUpgradeable.sol                  |  78 ++
 .../proxy/utils/Initializable.sol                  |  46 +
 .../utils/ContextUpgradeable.sol                   |  31 +
 .../ethereum/.code/Roles/contracts/Permissions.sol | 984 +++++++++++++++++++++
 .../linea/ethereum/.code/Roles/contracts/Roles.sol | 406 +++++++++
 .../linea/ethereum/.code/Roles/meta.txt            |   2 +
 17 files changed, 2055 insertions(+)
```

# Diff at Mon, 16 Oct 2023 07:14:10 GMT

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a2d21b0282f36d2369596c2fe3bb3e7746063abe

## Description

Unused verifier contracts are set to 0x111. The reason is that every position in the array corresponds to a proof type, therefore when a new proof type is introduced, a new verifier is added, and when a proof type is removed, the corresponding verifier is set to 0x111. My guess on why it is set to 0x111 and not 0x0 is that it allows to throw a different error in the verifier contract (deprecated proof), which is more informative than the error thrown when the verifier is not found (out of bounds).

## Watched changes

```diff
-   Status: DELETED
    contract PlonkVerifierFullLarge (0xa4F1155202D36348097b7488b0D2365fA91f8CaC) {
    }
```

```diff
-   Status: DELETED
    contract PlonkVerifierFull (0xc01E6807DB9Fb9cC75E9Fe622ba8e7f3eB9f2B32) {
    }
```

```diff
-   Status: DELETED
    contract PlonkVerifierFull2 (0xC84832f69bFFbC1A94E44a157A342766E959ED27) {
    }
```

```diff
    contract zkEVM (0xd19d4B5d358258f05D7B411E21A1460D11B0876F) {
      values.verifiers[9]:
+        "0x0000000000000000000000000000000000000000"
      values.verifiers[8]:
+        "0x0000000000000000000000000000000000000000"
      values.verifiers[7]:
+        "0x2eDEa64BB8b45Fd87c05dC89286f1a60F4f4BEE0"
      values.verifiers[6]:
+        "0x6312E56c17e1011dD0821558034a77BB60D06e1B"
      values.verifiers[5]:
+        "0x0000000000000000000000000000000000000000"
      values.verifiers[4]:
+        "0x1111111111111111111111111111111111111111"
      values.verifiers.3:
-        "0xC84832f69bFFbC1A94E44a157A342766E959ED27"
+        "0x1111111111111111111111111111111111111111"
      values.verifiers.1:
-        "0xa4F1155202D36348097b7488b0D2365fA91f8CaC"
+        "0x1111111111111111111111111111111111111111"
      values.verifiers.0:
-        "0xc01E6807DB9Fb9cC75E9Fe622ba8e7f3eB9f2B32"
+        "0x1111111111111111111111111111111111111111"
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierFullLarge (0x2eDEa64BB8b45Fd87c05dC89286f1a60F4f4BEE0) {
    }
```

```diff
+   Status: CREATED
    contract PlonkVerifierFull (0x6312E56c17e1011dD0821558034a77BB60D06e1B) {
    }
```

## Source code changes

```diff
.../PlonkVerifierFull/PlonkVerifierFull.sol        | 1754 +++++++++++---------
 .../PlonkVerifierFull/Utils.sol => /dev/null       |   83 -
 .../PlonkVerifierFull/meta.txt                     |    2 +-
 .../PlonkVerifierFull.sol => /dev/null             | 1223 --------------
 .../PlonkVerifierFull2/meta.txt => /dev/null       |    2 -
 .../PlonkVerifierFullLarge.sol                     | 1154 +++++++------
 .../PlonkVerifierFullLarge/Utils.sol => /dev/null  |   83 -
 .../PlonkVerifierFullLarge/meta.txt                |    2 +-
 8 files changed, 1585 insertions(+), 2718 deletions(-)
```
