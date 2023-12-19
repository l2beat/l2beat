# Diff at Fri, 08 Dec 2023 10:06:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: master@30e367cba0866d89eb0bd930461090359c5d3f4a

## Description

The big picture of these changes are the following:

- Migrated Solidity from 0.8.13 to 0.8.20.
- Moved from working on blocks to working on batches.
- Any mention to Security Council have been removed, contracts have been simplified basing on that fact
- Refactor and updates of the verifier algorithm

Here follows a description of changes to each particular contract.

### LibMap

A new library described as "Library for storage of packed unsigned integers".
Taken from open-source solady library package (https://github.com/Vectorized/solady).
It's just an gas optimized uint32 array.
It seems like they just extracted what they needed from it, because the solady version supports more than just uint32s.

### ValidatorTimelock

Uses LibMap to replace a mapping of `uint256 => uint256`, it mapped from the block number to the block timestamp.
Right now using LibMap they essentially have `uint64 => uint32`, it maps from batch number to the block timestamp.
The timestamp is truncated to `uint32`, this will wrap in the year 2106.
They have introduced a getter for the timestamp of the block `getCommittedBatchTimestamp`, but it's not used by any of the code.
In `executeBatches` the assertion changed from `require(block.timestamp > commitBlockTimestamp + delay)` to `require(block.timestamp >= commitBatchTimestamp + delay)`, now it's inclusive.

### L1ERC20Bridge

Moved to batches, simple renames.

### Diamond

Better check for facet without code, instead of doing `require(_facet != address(0))` they now do `require(_facet.code.length > 0)`.
Reverts in `_initializeDiamondCut()` will now revert with decoded calldata if it's possible, if not it will just revert with the previous error code.

### Verifier

Extracted an interface into IVerifier.
Verifier now a single file contract, where before it included `PairingsBn254.sol`, `TranscriptLib.sol`, `Plonk4VerifierWithAccessToDNext.sol`.
It was flattened and refactored for readability, but I'm unable to verify that this is the same verification algorithm.

### Storage

`UpgradeStorage upgrades` is now deprecated.
A new role, called `admin` and `pendingAdmin`.

### Base

Removed `onlySecurityCouncil` modifier and added `onlyGovernorOrAdmin`.

### AllowList

New event

```
event UpdateDepositLimit(address indexed l1Token, bool depositLimitation, uint256 depositCap);
```

that is emitted in the call to this function - that is in AllowList.sol:

```
function setDepositLimit(address _l1Token, bool _depositLimitation, uint256 _depositCap) external onlyOwner
```

### zkSync

Facets:

- changed from DiamondCut => Admin (0x409560DE546e057ce5bD5dB487EdF2bB5E785baB)
- same => Getters (0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4)
- same => Mailbox (0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08)
- same => Executor (0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269)

The 5th facet was Governance facet, it was removed so we now have 4 facets instead of 5.
The first facet (DiamondCut) has been replaced with Admin.

#### Admin

Admin is an implementation of IAdmin interface.
That interface is a combination of IGovernance and IDiamondCut.
IAdmin implements the entire IGovernance interface.
It also implements parts of the IDiamondCut interface, like `executeUpgrade()`, `freezeDiamond()` and `unfreezeDiamond()`.
Everything relating to proposal and security council has been removed.
The new functions that were in neither of these two interfaces are `setPendingAdmin()` and `acceptAdmin()`.
Implementation of Admin is a combination of implementations for Governance and DiamondCut facets from before.

#### Getters

The default IGetters interface has moved to working on batches instead of blocks.
Additionally getters for functions referencing Security Council have been removed (since they returned zero addresses either way).
The legacy interface is still supported, but it just returns the values in batches.

#### Mailbox

Variable renaming to move to batches instead of blocks

#### Executor

Batch commitment uses three inputs: pass through from batches, meta params and auxiliary output from the batch.
The first two, stay the same after the update.
But the third input (auxiliary output from the batch) changed most of the input that it takes.
Right now, the prover verifies both the main and the recursive proof in the same step.
Refactored the way logs from L2 indicate what they are, instead of different senders use `logKeys` and `logValues`.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      upgradeability.facets[4]:
-        "0x2E64926BE35412f7710A3E097Ba076740bF97CC0"
      upgradeability.facets.3:
-        "0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b"
+        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
      upgradeability.facets.2:
-        "0x62aA95ac4740A367746A664C4C69034d52E968EF"
+        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
      upgradeability.facets.1:
-        "0x7444DE636699F080cA1C033528D2bB3705B391Ce"
+        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
      upgradeability.facets.0:
-        "0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4"
+        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
      implementations[4]:
-        "0x2E64926BE35412f7710A3E097Ba076740bF97CC0"
      implementations.3:
-        "0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b"
+        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
      implementations.2:
-        "0x62aA95ac4740A367746A664C4C69034d52E968EF"
+        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
      implementations.1:
-        "0x7444DE636699F080cA1C033528D2bB3705B391Ce"
+        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
      implementations.0:
-        "0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4"
+        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
      values.facetAddresses[4]:
-        "0x2E64926BE35412f7710A3E097Ba076740bF97CC0"
      values.facetAddresses.3:
-        "0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b"
+        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
      values.facetAddresses.2:
-        "0x62aA95ac4740A367746A664C4C69034d52E968EF"
+        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
      values.facetAddresses.1:
-        "0x7444DE636699F080cA1C033528D2bB3705B391Ce"
+        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
      values.facetAddresses.0:
-        "0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4"
+        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
      values.facets[4]:
-        ["0x2E64926BE35412f7710A3E097Ba076740bF97CC0",["0xe58bb639","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d"]]
      values.facets.3.1.3:
-        "0xa9a2d18a"
+        "0x97c09d34"
      values.facets.3.1.2:
-        "0x7739cbe7"
+        "0x7f61885c"
      values.facets.3.1.1:
-        "0xce9dcf16"
+        "0xc3d93e7c"
      values.facets.3.1.0:
-        "0x0c4dd810"
+        "0x701f58c5"
      values.facets.3.0:
-        "0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b"
+        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
      values.facets.2.0:
-        "0x62aA95ac4740A367746A664C4C69034d52E968EF"
+        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
      values.facets.1.1[34]:
-        "0x74f4d30d"
      values.facets.1.1.33:
-        "0x56142d7a"
+        "0x74f4d30d"
      values.facets.1.1.32:
-        "0x9cd939e4"
+        "0xb22dd78e"
      values.facets.1.1.31:
-        "0xfacd743b"
+        "0x56142d7a"
      values.facets.1.1.30:
-        "0xe81e0ba1"
+        "0x9cd939e4"
      values.facets.1.1.29:
-        "0xc3bbd2d7"
+        "0xfacd743b"
      values.facets.1.1.28:
-        "0xbd7c5412"
+        "0xe81e0ba1"
      values.facets.1.1.27:
-        "0x29b98c67"
+        "0xc3bbd2d7"
      values.facets.1.1.26:
-        "0x3db920ce"
+        "0xbd7c5412"
      values.facets.1.1.25:
-        "0x18e3a941"
+        "0x29b98c67"
      values.facets.1.1.24:
-        "0x46657fe9"
+        "0x18e3a941"
      values.facets.1.1.23:
-        "0xa39980a0"
+        "0x46657fe9"
      values.facets.1.1.18:
-        "0x0ef240a0"
+        "0xef3f0bae"
      values.facets.1.1.17:
-        "0x33ce93fe"
+        "0xb8c2f66f"
      values.facets.1.1.16:
-        "0xe39d3bff"
+        "0xdb1f0bf9"
      values.facets.1.1.15:
-        "0x1b60e626"
+        "0x33ce93fe"
      values.facets.1.1.9:
-        "0xfd791f3c"
+        "0xe5355c75"
      values.facets.1.1.8:
-        "0xd86970d8"
+        "0xfd791f3c"
      values.facets.1.1.7:
-        "0x4fc07d75"
+        "0xd86970d8"
      values.facets.1.1.6:
-        "0x79823c9a"
+        "0x4fc07d75"
      values.facets.1.1.5:
-        "0xfe10226d"
+        "0x79823c9a"
      values.facets.1.0:
-        "0x7444DE636699F080cA1C033528D2bB3705B391Ce"
+        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
      values.facets.0.1[9]:
+        "0x17338945"
      values.facets.0.1[8]:
+        "0x4623c91d"
      values.facets.0.1.7:
-        "0x587809c7"
+        "0xbe6f11cf"
      values.facets.0.1.6:
-        "0x17338945"
+        "0x1cc5d103"
      values.facets.0.1.5:
-        "0xbeda4b12"
+        "0xf235757f"
      values.facets.0.1.4:
-        "0x8043760a"
+        "0x4dd18bf5"
      values.facets.0.1.3:
-        "0x0551448c"
+        "0x27ae4c16"
      values.facets.0.1.2:
-        "0x27ae4c16"
+        "0xa9f6d941"
      values.facets.0.1.1:
-        "0x36d4eb84"
+        "0xe58bb639"
      values.facets.0.1.0:
-        "0x73fb9297"
+        "0x0e18b681"
      values.facets.0.0:
-        "0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4"
+        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
      values.getAllowList:
-        "0x8ffd57A9B2dcc10327768b601468FA192adC5C86"
+        "0x0C0dC1171258694635AA50cec5845aC1031cA6d7"
      values.getCurrentProposalId:
-        11
      values.getL2BootloaderBytecodeHash:
-        "0x0100089b8a2f2e6a20ba28f02c9e0ed0c13d702932364561a0ea61621f65f0a8"
+        "0x01000983d4ac4f797cf5c077e022f72284969b13248c2a8e9846f574bdeb5b88"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100067d16a5485875b4249040bf421f53e869337fe118ec747cf40a4c777e5f"
+        "0x01000651c5ae96f2aab07d720439e42491bb44c6384015e3a08e32620a4d582d"
      values.getProposedUpgradeHash:
-        "0x31e9893a0c33de66bfd89adc9068af6500d315f89c83cb52f018b8dd002faa6c"
      values.getProposedUpgradeTimestamp:
-        1701681527
      values.getProtocolVersion:
-        17
+        18
      values.getSecurityCouncil:
-        "0x0000000000000000000000000000000000000000"
      values.getUpgradeProposalState:
-        1
      values.getVerifier:
-        "0x3F04F86f14aB74953fDAEde8175e0714eB8e798e"
+        "0xB465882F67d236DcC0D090F78ebb0d838e9719D8"
      values.getVerifierParams.2:
-        "0x18c1639094f58177409186e8c48d9f577c9410901d2f1d486b3e7d6cf553ae4c"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getVerifierParams.1:
-        "0x101e08b00193e529145ee09823378ef51a3bc8966504064f1f6ba3f1ba863210"
+        "0x14628525c227822148e718ca1138acfc6d25e759e19452455d89f7f610c3dcb8"
      values.getVerifierParams.0:
-        "0x1186ec268d49f1905f8d9c1e9d39fc33e98c74f91d91a21b8f7ef78bd09a8db8"
+        "0x5a3ef282b21e12fe1f4438e5bb158fc5060b160559c5158c6389d62d9fe3d080"
      values.isApprovedBySecurityCouncil:
-        false
      values.validators.0:
-        "0x3dB52cE065f728011Ac6732222270b3F2360d919"
+        "0xa0425d71cB1D6fb80E65a5361a04096E0672De03"
      values.getL2SystemContractsUpgradeBatchNumber:
+        0
      values.getTotalBatchesCommitted:
+        336365
      values.getTotalBatchesExecuted:
+        335480
      values.getTotalBatchesVerified:
+        336239
      values.storedBatchHash:
+        ["0x0ac272ab86763ec2bc093492128eb0bb7afac0ddb385e4ceb2fdb107f2946f2b","0x476876ca9c9fa49b1390ae47a04f7434936b77c22af7a055077f2e3486e6fb65","0x41de068e7043f90c7a5b6c9c80251979c333dc931859a2ec10ef17c9032db250","0x545ada4b4f784c3a471137da517a9f99ae401c7daa63d951a20222605b12ccbf","0xdf353be1f590760d533530c19b53309dde820f3c962a5317c89bcd299130c834"]
      errors:
+        {"storedBatchHash":"Too many values. Update configuration to explore fully"}
    }
```

```diff
-   Status: DELETED
    contract ValidatorTimelock (0x3dB52cE065f728011Ac6732222270b3F2360d919) {
    }
```

```diff
-   Status: DELETED
    contract Verifier (0x3F04F86f14aB74953fDAEde8175e0714eB8e798e) {
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
      upgradeability.implementation:
-        "0x7FB17101A744e156e63d5fF6A4775fb48756577c"
+        "0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"
      implementations.0:
-        "0x7FB17101A744e156e63d5fF6A4775fb48756577c"
+        "0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"
    }
```

```diff
-   Status: DELETED
    contract AllowList (0x8ffd57A9B2dcc10327768b601468FA192adC5C86) {
    }
```

```diff
+   Status: CREATED
    contract AllowList (0x0C0dC1171258694635AA50cec5845aC1031cA6d7) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0xa0425d71cB1D6fb80E65a5361a04096E0672De03) {
    }
```

```diff
+   Status: CREATED
    contract Verifier (0xB465882F67d236DcC0D090F78ebb0d838e9719D8) {
    }
```

## Source code changes

```diff
.../solpp-generated-contracts/common/AllowList.sol |   31 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../{.code@18713118 => .code}/AllowList/meta.txt   |    2 +-
 .../bridge/L1ERC20Bridge.sol                       |   88 +-
 .../bridge/interfaces/IL1Bridge.sol                |   12 +-
 .../bridge/interfaces/IL1BridgeLegacy.sol          |    2 +-
 .../bridge/interfaces/IL2Bridge.sol                |    8 +-
 .../bridge/interfaces/IL2ERC20Bridge.sol           |    8 +-
 .../libraries/BridgeInitializationHelper.sol       |    3 +-
 .../common/AllowListed.sol                         |    3 +-
 .../common/L2ContractAddresses.sol                 |   14 +-
 .../common/ReentrancyGuard.sol                     |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/interfaces/IL2ContractDeployer.sol      |    8 +-
 .../common/libraries/L2ContractHelper.sol          |    9 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../common/libraries/UnsafeBytes.sol               |    3 +-
 .../vendor/AddressAliasHelper.sol                  |    2 +-
 .../dev/null                                       |  704 --------
 .../solpp-generated-contracts/zksync/Storage.sol   |   69 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/interfaces/IAdmin.sol}                  |   32 +-
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IDiamondCut.sol => /dev/null |   48 -
 .../zksync/interfaces/IExecutor.sol                |  111 +-
 .../zksync/interfaces/IGetters.sol                 |   29 +-
 .../zksync/interfaces/IGovernance.sol => /dev/null |   63 -
 .../zksync/interfaces/IMailbox.sol                 |   19 +-
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../zksync/interfaces/IZkSync.sol                  |    7 +-
 .../zksync/libraries/Diamond.sol                   |   44 +-
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../L1ERC20Bridge/implementation/meta.txt          |    2 +-
 .../zksync/ValidatorTimelock.sol                   |  102 +-
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IExecutor.sol                |  113 +-
 .../zksync/libraries/LibMap.sol                    |   64 +
 .../ValidatorTimelock/meta.txt                     |    2 +-
 .../zksync2/ethereum/.code/Verifier/Verifier.sol   | 1712 ++++++++++++++++++++
 .../libraries/UncheckedMath.sol => /dev/null       |   19 -
 .../.code/Verifier/interfaces/IVerifier.sol        |   15 +
 .../{.code@18713118 => .code}/Verifier/meta.txt    |    2 +-
 .../dev/null                                       |  704 --------
 .../Verifier/zksync/Verifier.sol => /dev/null      |  239 ---
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../common/AllowListed.sol                         |    3 +-
 .../common/ReentrancyGuard.sol                     |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../solpp-generated-contracts/zksync/Config.sol    |   46 +-
 .../dev/null                                       |  704 --------
 .../solpp-generated-contracts/zksync/Storage.sol   |   60 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/facets/Admin.sol                        |  129 ++
 .../zksync/facets/Base.sol                         |   15 +-
 .../zksync/facets/DiamondCut.sol => /dev/null      |  202 ---
 .../zksync/interfaces/IAdmin.sol                   |   63 +
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IDiamondCut.sol => /dev/null |   48 -
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../zksync/libraries/Diamond.sol                   |   31 +-
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../zkSync/implementation-1/meta.txt               |    4 +-
 .../common/AllowListed.sol                         |    3 +-
 .../common/ReentrancyGuard.sol                     |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../dev/null                                       |  704 --------
 .../solpp-generated-contracts/zksync/Storage.sol   |   60 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/facets/Base.sol                         |   15 +-
 .../zksync/facets/Getters.sol                      |  126 +-
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IGetters.sol                 |   28 +-
 .../zksync/interfaces/ILegacyGetters.sol           |   22 +
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../zksync/libraries/Diamond.sol                   |   31 +-
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../zkSync/implementation-2/meta.txt               |    2 +-
 .../common/AllowListed.sol                         |    3 +-
 .../common/L2ContractAddresses.sol                 |   14 +-
 .../common/ReentrancyGuard.sol                     |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/libraries/L2ContractHelper.sol          |    9 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../common/libraries/UnsafeBytes.sol               |    3 +-
 .../vendor/AddressAliasHelper.sol                  |    2 +-
 .../solpp-generated-contracts/zksync/Config.sol    |   46 +-
 .../dev/null                                       |  704 --------
 .../solpp-generated-contracts/zksync/Storage.sol   |   60 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/facets/Base.sol                         |   15 +-
 .../zksync/facets/Mailbox.sol                      |  115 +-
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IMailbox.sol                 |   19 +-
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../zksync/libraries/Merkle.sol                    |    5 +-
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../zksync/libraries/TransactionValidator.sol      |   41 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../zkSync/implementation-3/meta.txt               |    2 +-
 .../zkSync/implementation-4/common/AllowListed.sol |    3 +-
 .../common/L2ContractAddresses.sol                 |   14 +-
 .../implementation-4/common/ReentrancyGuard.sol    |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../libraries/L2ContractHelper.sol => /dev/null    |   74 -
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../common/libraries/UnsafeBytes.sol               |    3 +-
 .../zkSync/implementation-4/meta.txt               |    2 +-
 .../zkSync/implementation-4/zksync/Config.sol      |   46 +-
 .../dev/null                                       |  704 --------
 .../zkSync/implementation-4/zksync/Storage.sol     |   60 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zkSync/implementation-4/zksync/facets/Base.sol |   15 +-
 .../implementation-4/zksync/facets/Executor.sol    |  546 +++----
 .../implementation-4/zksync/interfaces/IBase.sol   |    2 +-
 .../zksync/interfaces/IExecutor.sol                |  111 +-
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../common/AllowListed.sol => /dev/null            |   18 -
 .../common/ReentrancyGuard.sol => /dev/null        |   89 -
 .../common/interfaces/IAllowList.sol => /dev/null  |   87 -
 .../libraries/UncheckedMath.sol => /dev/null       |   19 -
 .../zkSync/implementation-5/meta.txt => /dev/null  |    2 -
 .../dev/null                                       |  704 --------
 .../zksync/Storage.sol => /dev/null                |  138 --
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/facets/Base.sol => /dev/null            |   33 -
 .../zksync/facets/Governance.sol => /dev/null      |   74 -
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../libraries/PriorityQueue.sol => /dev/null       |   83 -
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 143 files changed, 3430 insertions(+), 11097 deletions(-)
```

# Diff at Mon, 04 Dec 2023 12:52:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@11f81c3217315242a2af781f1c2528aa4938b44c

## Description

A new upgrade proposal has been detected.
Implementations:
DefaultUpgrade: 0x567e1B57A80a7F048A7402191F96C62730e30dB2
AdminFacet: 0x409560DE546e057ce5bD5dB487EdF2bB5E785baB
GettersFacet: 0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4
MailboxFacet: 0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08
ExecutorFacet: 0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getCurrentProposalId:
-        10
+        11
      values.getProposedUpgradeHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x31e9893a0c33de66bfd89adc9068af6500d315f89c83cb52f018b8dd002faa6c"
      values.getProposedUpgradeTimestamp:
-        0
+        1701681527
      values.getUpgradeProposalState:
-        0
+        1
    }
```

# Diff at Tue, 21 Nov 2023 15:32:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@c91f8874e3c01dd4c477491e11cff7b3c664ef34

## Description

Change in the zkSync Era Multisig owners - one address is removed and another is added.

## Watched changes

```diff
    contract zkSync Era Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
      values.getOwners.7:
-        "0xa265146cA40F52cfC439888D0b4291b5440e6769"
+        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
    }
```

# Diff at Thu, 02 Nov 2023 07:24:20 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@9b49ec4aa1d93626f3f30c0e914cb12bb6670dbd

## Description

Proposal updates (the upgrade is executed): a verification key has been updated, meaning that the circuit has been updated.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getProposedUpgradeHash:
-        "0x306f3cc703e0e1ab18693aab35276f2dbc745f5de480cee904d05de511ca8415"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getProposedUpgradeTimestamp:
-        1698826475
+        0
      values.getProtocolVersion:
-        16
+        17
      values.getUpgradeProposalState:
-        1
+        0
      values.getVerifierParams.2:
-        "0x236c97bfbe75ff507e03909fae32a78be3a70d1b468b183f430010810284ed45"
+        "0x18c1639094f58177409186e8c48d9f577c9410901d2f1d486b3e7d6cf553ae4c"
    }
```

# Diff at Wed, 01 Nov 2023 11:26:01 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@d5598e9a46a99374387c1df455805e40f3d361a7

## Description

A new proposal is detected.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getCurrentProposalId:
-        9
+        10
      values.getProposedUpgradeHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x306f3cc703e0e1ab18693aab35276f2dbc745f5de480cee904d05de511ca8415"
      values.getProposedUpgradeTimestamp:
-        0
+        1698826475
      values.getUpgradeProposalState:
-        0
+        1
    }
```

# Diff at Fri, 27 Oct 2023 10:26:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: master@f531a9c18fd564738c9f66b8b1e5c04730dce464

## Description

A new proposal has been detected.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getCurrentProposalId:
-        8
+        9
      values.getProtocolVersion:
-        15
+        16
    }
```

# Diff at Tue, 26 Sep 2023 10:27:16 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getProposedUpgradeHash:
-        "0x7d39289c3d9fd4fd8d86ed97abcdcfe208677042a65de6cccb91dc97e2936be9"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getProposedUpgradeTimestamp:
-        1695294167
+        0
      values.getProtocolVersion:
-        14
+        15
      values.getUpgradeProposalState:
-        1
+        0
      values.getVerifierParams.2:
-        "0x0a3657f884af32d3a573c5fdb3440c9ac45271ede8c982faeaae7434d032ab3e"
+        "0x236c97bfbe75ff507e03909fae32a78be3a70d1b468b183f430010810284ed45"
    }
```

```diff
    contract ValidatorTimelock (0x3dB52cE065f728011Ac6732222270b3F2360d919) {
      values.revertedBlocks:
+        []
    }
```

# Diff at Thu, 21 Sep 2023 12:39:16 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@36d4050a6ee5a543b2163fe6e44153b540b87c16

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getCurrentProposalId:
-        7
+        8
      values.getProposedUpgradeHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x7d39289c3d9fd4fd8d86ed97abcdcfe208677042a65de6cccb91dc97e2936be9"
      values.getProposedUpgradeTimestamp:
-        0
+        1695294167
      values.getUpgradeProposalState:
-        0
+        1
    }
```

```diff
    contract zkSync Era Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
      values.getOwners.1:
-        "0xd7aF418d98C0F8EDbaa407fc30ad10382286F36F"
+        "0xe79af29d618141Ffef951B240b250d47030D56d7"
    }
```
