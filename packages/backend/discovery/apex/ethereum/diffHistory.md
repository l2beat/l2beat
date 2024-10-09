Generated with discovered.json: 0x47f3d0e5f9e1fadbf12695cd1b9acc85a02e049a

# Diff at Tue, 01 Oct 2024 10:49:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-08-11T21:07:19.000Z",["0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x8f62a4a85B64dF803FDB644a1c7F595BFC6fF8dA","0xBdc6c96D298408415Ac70D334BedEbc8862B3C41","0xf1f087A5da4c5938E3ee091Edeea4f773fe203CA"]],["2022-08-23T13:51:05.000Z",["0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0","0xfbea22FeB369DB10C0d3a2aAa8F4939E76815f12","0x8f62a4a85B64dF803FDB644a1c7F595BFC6fF8dA","0xBdc6c96D298408415Ac70D334BedEbc8862B3C41","0xf1f087A5da4c5938E3ee091Edeea4f773fe203CA"]],["2022-12-22T08:17:35.000Z",["0xdD813397b79f8df581eEb0c4B8aB72304c528396","0x533a7f4bE5453513049EB94A2b115F2CcE161dce","0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058","0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859","0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"]],["2023-01-06T06:29:35.000Z",["0xdD813397b79f8df581eEb0c4B8aB72304c528396","0x533a7f4bE5453513049EB94A2b115F2CcE161dce","0x564EA75a26Dc0Bb5c5033B4752f88953A25AD058","0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859","0x34E7cfedF99995A47B3e3D0AB88ba67072B55035"]]]
      values.$upgradeCount:
+        4
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-18T12:19:47.000Z",["0x3167617e913BF59afb90e5ec1A7B32D4Ea03eae4","0x5a50e280883B1FB39Aa04Eb263BCA47630D17D8E","0x3F3A131caB7eb5b4EAE9497Bebb9E06bE80F2809","0x5BfbE850d18b73ed98FB830e0A5E9F4970Bb93dA","0x229BbdF97eBc4993efe1433c0ae4A0bE79A4fe21"]],["2023-11-28T15:26:47.000Z",["0x3167617e913BF59afb90e5ec1A7B32D4Ea03eae4","0x5a50e280883B1FB39Aa04Eb263BCA47630D17D8E","0x3F3A131caB7eb5b4EAE9497Bebb9E06bE80F2809","0x5BfbE850d18b73ed98FB830e0A5E9F4970Bb93dA","0x229BbdF97eBc4993efe1433c0ae4A0bE79A4fe21"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xea67e288a5b4518cce9d44247359a2886d5cd8ef

# Diff at Fri, 30 Aug 2024 07:51:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x4667d97d555c55a259262c565872eac34b1528da

# Diff at Wed, 21 Aug 2024 10:01:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xC532d2976209A56DdF4a99B844130f7c0daCa7B6","via":[]},{"permission":"upgrade","target":"0xef75e1199B0599BA823b7770AcE8eb34864a1D55","via":[]}]
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb","via":[]}]
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x53c6Ec9640761c669B800088F097E01A8207Ac8b","via":[]}]
    }
```

Generated with discovered.json: 0xb43b38464018b222160218080718d20095921320

# Diff at Fri, 09 Aug 2024 10:08:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract AggregationRouterV4Owner (0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xB1A308e7F02798377b7acF685E997E3D774c5863","0x3A6ED6885608Ead8174789a81Eb2B05600ca89F8","0x2BB718a3986C36c6E02D8d15cdA4370820D08169"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xB1A308e7F02798377b7acF685E997E3D774c5863","0x3A6ED6885608Ead8174789a81Eb2B05600ca89F8","0x2BB718a3986C36c6E02D8d15cdA4370820D08169"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"]
      assignedPermissions.upgrade:
+        ["0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x22c89137525b593Dd2A18434348b550ffA5984Fe","0xef75e1199B0599BA823b7770AcE8eb34864a1D55"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x22c89137525b593Dd2A18434348b550ffA5984Fe","0xef75e1199B0599BA823b7770AcE8eb34864a1D55"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

Generated with discovered.json: 0xd876b97495cd92f29c9969cd6abbb7e64b6e83c5

# Diff at Thu, 18 Jul 2024 10:29:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19825348
- current block number: 19825348

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19825348 (main branch discovery), not current.

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      assignedPermissions:
+        {"admin":["0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb"]}
    }
```

Generated with discovered.json: 0xcdbbaf68b28da1e22c57df19c736fdedc8a4eb72

# Diff at Wed, 08 May 2024 12:30:13 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7eb116053a3dfe1dcff4cde0b8b45a07198fbab8 block: 19624842
- current block number: 19825348

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624842 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4"
+        ["0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4"]
      values.getRegisteredVerifiers:
-        "0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953"
+        ["0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953"]
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        "0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800"
+        ["0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800"]
      values.getRegisteredVerifiers:
-        "0x40e1e5Ece49A878062fA9F87eA6dc81281098B22"
+        ["0x40e1e5Ece49A878062fA9F87eA6dc81281098B22"]
    }
```

Generated with discovered.json: 0xe502ced95cc56e356340ce6c4f72089b3662254c

# Diff at Wed, 10 Apr 2024 11:10:55 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ee07d1cb2dc09651ee4b52c49bb3ad20765aa9f3 block: 19531421
- current block number: 19624842

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531421 (main branch discovery), not current.

```diff
    contract StarkExchangeUSDC (0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4"]
+        "0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4"
      values.getRegisteredVerifiers:
-        ["0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953"]
+        "0xE741e26573782ae3C0ea9EC710FA99Fcd27fB953"
    }
```

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    +++ description: None
      values.getRegisteredAvailabilityVerifiers:
-        ["0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800"]
+        "0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800"
      values.getRegisteredVerifiers:
-        ["0x40e1e5Ece49A878062fA9F87eA6dc81281098B22"]
+        "0x40e1e5Ece49A878062fA9F87eA6dc81281098B22"
    }
```

Generated with discovered.json: 0x3e398c9a07a24393eda56ca1d029dddcdaafbc5b

# Diff at Thu, 28 Mar 2024 08:29:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18685523
- current block number: 19531421

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18685523 (main branch discovery), not current.

```diff
    contract AggregationRouterV4Owner (0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract PerpetualGovernanceMultisig (0xC532d2976209A56DdF4a99B844130f7c0daCa7B6) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 2 (100%)"
    }
```

Generated with discovered.json: 0x0fa337b45cd76773ae656410f777bdb702845b4e

# Diff at Thu, 30 Nov 2023 16:11:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@86509954e727fb4deae9efbdf805e6bb714a43c5

## Description

Upgrade delay for USDT StarkEx has been changed from 0 to 14 days.

## Watched changes

```diff
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
      upgradeability.upgradeDelay:
-        0
+        1209600
      values.getUpgradeActivationDelay:
-        0
+        1209600
    }
```

# Diff at Thu, 23 Nov 2023 15:27:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2ff45714640abe4c50d283967078888d4af81d78

## Description

Apex is enabling USDT as an additional collateral for their perpetual pairs.
Previously only USDC was available. Technically StarkEx system for perpetuals
doesn't support multiple collaterals, so Apex will be running 2 independent
StarkEx instances. This also means that there will be no interoperability
between them and between -USDC and -USDT perpetual pairs. Also parameters
of each system can differ.

## Watched changes

```diff
+   Status: CREATED
    contract MultiSigPoolUSDT (0x379c15156B527D6E693bED60d1FBb44CE46046b8) {
    }
```

```diff
+   Status: CREATED
    contract FinalizableGpsFactAdapterUSDT (0x40e1e5Ece49A878062fA9F87eA6dc81281098B22) {
    }
```

```diff
+   Status: CREATED
    contract CommitteeUSDT (0x7249082BfAFE9BCA502d38a686Ef3df37A0cf800) {
    }
```

```diff
+   Status: CREATED
    contract StarkExchangeUSDT (0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b) {
    }
```

## Source code changes

```diff
.../ethereum/.code/CommitteeUSDT/Committee.sol     | 100 +++++
 .../ethereum/.code/CommitteeUSDT/FactRegistry.sol  |  58 +++
 .../.code/CommitteeUSDT/IAvailabilityVerifier.sol  |  24 ++
 .../ethereum/.code/CommitteeUSDT/IFactRegistry.sol |  39 ++
 .../.code/CommitteeUSDT/IQueryableFactRegistry.sol |  30 ++
 .../apex/ethereum/.code/CommitteeUSDT/Identity.sol |  24 ++
 .../apex/ethereum/.code/CommitteeUSDT/meta.txt     |   2 +
 .../FinalizableGpsFactAdapterUSDT/Finalizable.sol  |  42 ++
 .../FinalizableGpsFactAdapter.sol                  |  40 ++
 .../GpsFactRegistryAdapter.sol                     |  57 +++
 .../IFactRegistry.sol                              |  39 ++
 .../IQueryableFactRegistry.sol                     |  30 ++
 .../FinalizableGpsFactAdapterUSDT/Identity.sol     |  24 ++
 .../SimpleAdminable.sol                            |  71 ++++
 .../.code/FinalizableGpsFactAdapterUSDT/meta.txt   |   2 +
 .../@openzeppelin/contracts/interfaces/IERC20.sol  |   6 +
 .../contracts/security/ReentrancyGuard.sol         |  77 ++++
 .../@openzeppelin/contracts/token/ERC20/IERC20.sol |  78 ++++
 .../token/ERC20/extensions/IERC20Permit.sol        |  60 +++
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 143 +++++++
 .../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++++++
 .../@openzeppelin/contracts/utils/Strings.sol      |  85 ++++
 .../contracts/utils/cryptography/ECDSA.sol         | 217 ++++++++++
 .../@openzeppelin/contracts/utils/math/Math.sol    | 339 +++++++++++++++
 .../contracts/utils/math/SafeMath.sol              | 215 ++++++++++
 .../contracts/utils/math/SignedMath.sol            |  43 ++
 .../contracts/core/MultiSigPool.sol                | 380 +++++++++++++++++
 .../contracts/interfaces/IAggregationExecutor.sol  |   5 +
 .../contracts/interfaces/IAggregationRouterV4.sol  |  31 ++
 .../contracts/interfaces/IFactRegister.sol         |  13 +
 .../contracts/interfaces/IStarkEx.sol              |  44 ++
 .../contracts/interfaces/IWETH.sol                 |   9 +
 .../apex/ethereum/.code/MultiSigPoolUSDT/meta.txt  |   2 +
 .../implementation-1/Addresses.sol                 |  58 +++
 .../implementation-1/BlockDirectCall.sol           |  36 ++
 .../implementation-1/Governance.sol                | 123 ++++++
 .../implementation-1/GovernanceStorage.sol         |  26 ++
 .../implementation-1/IDispatcherBase.sol           |  37 ++
 .../implementation-1/Identity.sol                  |  24 ++
 .../implementation-1/MGovernance.sol               |  29 ++
 .../implementation-1/MainDispatcher.sol            |  84 ++++
 .../implementation-1/MainDispatcherBase.sol        | 232 +++++++++++
 .../implementation-1/MainStorage.sol               | 136 ++++++
 .../implementation-1/PerpetualStorage.sol          |  46 ++
 .../implementation-1/ProxyStorage.sol              |  38 ++
 .../implementation-1/StarkExTypes.sol              |  32 ++
 .../implementation-1/StarkPerpetual.sol            |  78 ++++
 .../implementation-1/SubContractor.sol             |  33 ++
 .../StarkExchangeUSDT/implementation-1/meta.txt    |   2 +
 .../implementation-2/Addresses.sol                 |  58 +++
 .../implementation-2/AllVerifiers.sol              |  56 +++
 .../implementation-2/ApprovalChain.sol             | 130 ++++++
 .../implementation-2/AvailabilityVerifiers.sol     |  72 ++++
 .../implementation-2/Freezable.sol                 |  72 ++++
 .../implementation-2/Governance.sol                | 123 ++++++
 .../implementation-2/GovernanceStorage.sol         |  26 ++
 .../implementation-2/IFactRegistry.sol             |  39 ++
 .../implementation-2/IQueryableFactRegistry.sol    |  30 ++
 .../implementation-2/Identity.sol                  |  24 ++
 .../implementation-2/LibConstants.sol              |  69 +++
 .../implementation-2/MApprovalChain.sol            |  74 ++++
 .../implementation-2/MFreezable.sol                |  47 +++
 .../implementation-2/MGovernance.sol               |  29 ++
 .../implementation-2/MainGovernance.sol            |  82 ++++
 .../implementation-2/MainStorage.sol               | 136 ++++++
 .../implementation-2/ProxyStorage.sol              |  38 ++
 .../implementation-2/StarkExTypes.sol              |  32 ++
 .../implementation-2/SubContractor.sol             |  33 ++
 .../implementation-2/Verifiers.sol                 |  65 +++
 .../StarkExchangeUSDT/implementation-2/meta.txt    |   2 +
 .../implementation-3/AcceptModifications.sol       | 123 ++++++
 .../implementation-3/Addresses.sol                 |  58 +++
 .../implementation-3/Deposits.sol                  | 409 ++++++++++++++++++
 .../implementation-3/ERC721Receiver.sol            |  48 +++
 .../implementation-3/Freezable.sol                 |  72 ++++
 .../implementation-3/Governance.sol                | 123 ++++++
 .../implementation-3/GovernanceStorage.sol         |  26 ++
 .../implementation-3/IERC1155.sol                  | 138 ++++++
 .../StarkExchangeUSDT/implementation-3/IERC20.sol  |  43 ++
 .../implementation-3/IERC721Receiver.sol           |  26 ++
 .../implementation-3/Identity.sol                  |  24 ++
 .../implementation-3/KeyGetters.sol                |  60 +++
 .../implementation-3/LibConstants.sol              |  69 +++
 .../implementation-3/MAcceptModifications.sol      |  42 ++
 .../implementation-3/MDeposits.sol                 |  34 ++
 .../implementation-3/MFreezable.sol                |  47 +++
 .../implementation-3/MGovernance.sol               |  29 ++
 .../implementation-3/MKeyGetters.sol               |  35 ++
 .../implementation-3/MTokenAssetData.sol           |  54 +++
 .../implementation-3/MTokenQuantization.sol        |  34 ++
 .../implementation-3/MTokenTransfers.sol           |  47 +++
 .../implementation-3/MainGovernance.sol            |  82 ++++
 .../implementation-3/MainStorage.sol               | 136 ++++++
 .../implementation-3/PerpetualStorage.sol          |  46 ++
 .../implementation-3/PerpetualTokenRegister.sol    |  60 +++
 .../implementation-3/PerpetualTokensAndRamping.sol |  70 ++++
 .../implementation-3/ProxyStorage.sol              |  38 ++
 .../implementation-3/StarkExTypes.sol              |  32 ++
 .../implementation-3/SubContractor.sol             |  33 ++
 .../implementation-3/TokenAssetData.sol            | 205 +++++++++
 .../implementation-3/TokenQuantization.sol         |  54 +++
 .../implementation-3/TokenRegister.sol             | 136 ++++++
 .../implementation-3/TokenTransfers.sol            | 269 ++++++++++++
 .../implementation-3/Withdrawals.sol               | 211 ++++++++++
 .../StarkExchangeUSDT/implementation-3/meta.txt    |   2 +
 .../implementation-4/AcceptModifications.sol       | 123 ++++++
 .../implementation-4/ActionHash.sol                |  61 +++
 .../implementation-4/Addresses.sol                 |  58 +++
 .../implementation-4/Configuration.sol             | 117 ++++++
 .../implementation-4/ForcedTradeActionState.sol    | 150 +++++++
 .../ForcedWithdrawalActionState.sol                |  63 +++
 .../implementation-4/Freezable.sol                 |  72 ++++
 .../implementation-4/Governance.sol                | 123 ++++++
 .../implementation-4/GovernanceStorage.sol         |  26 ++
 .../implementation-4/IFactRegistry.sol             |  39 ++
 .../implementation-4/Identity.sol                  |  24 ++
 .../implementation-4/LibConstants.sol              |  69 +++
 .../implementation-4/MAcceptModifications.sol      |  42 ++
 .../implementation-4/MForcedTradeActionState.sol   |  73 ++++
 .../MForcedWithdrawalActionState.sol               |  45 ++
 .../implementation-4/MFreezable.sol                |  47 +++
 .../implementation-4/MGovernance.sol               |  29 ++
 .../implementation-4/MOperator.sol                 |  37 ++
 .../implementation-4/MStateRoot.sol                |  57 +++
 .../implementation-4/MTokenQuantization.sol        |  34 ++
 .../implementation-4/MainGovernance.sol            |  82 ++++
 .../implementation-4/MainStorage.sol               | 136 ++++++
 .../OnchainDataFactTreeEncoder.sol                 |  65 +++
 .../implementation-4/Operator.sol                  |  48 +++
 .../implementation-4/PerpetualConstants.sol        |  29 ++
 .../implementation-4/PerpetualEscapes.sol          |  66 +++
 .../implementation-4/PerpetualState.sol            | 107 +++++
 .../implementation-4/PerpetualStorage.sol          |  46 ++
 .../implementation-4/ProgramOutputOffsets.sol      |  65 +++
 .../implementation-4/ProxyStorage.sol              |  38 ++
 .../implementation-4/StarkExOperator.sol           |  34 ++
 .../implementation-4/StarkExTypes.sol              |  32 ++
 .../implementation-4/StateRoot.sol                 |  98 +++++
 .../implementation-4/SubContractor.sol             |  33 ++
 .../implementation-4/TokenQuantization.sol         |  54 +++
 .../implementation-4/UpdatePerpetualState.sol      | 459 ++++++++++++++++++++
 .../implementation-4/VerifyFactChain.sol           |  38 ++
 .../StarkExchangeUSDT/implementation-4/meta.txt    |   2 +
 .../implementation-5/ActionHash.sol                |  61 +++
 .../implementation-5/Addresses.sol                 |  58 +++
 .../StarkExchangeUSDT/implementation-5/ECDSA.sol   |  71 ++++
 .../implementation-5/EllipticCurve.sol             | 464 +++++++++++++++++++++
 .../implementation-5/ForcedTradeActionState.sol    | 150 +++++++
 .../implementation-5/ForcedTrades.sol              | 197 +++++++++
 .../ForcedWithdrawalActionState.sol                |  63 +++
 .../implementation-5/ForcedWithdrawals.sol         |  70 ++++
 .../implementation-5/Freezable.sol                 |  72 ++++
 .../implementation-5/Governance.sol                | 123 ++++++
 .../implementation-5/GovernanceStorage.sol         |  26 ++
 .../implementation-5/Identity.sol                  |  24 ++
 .../implementation-5/KeyGetters.sol                |  60 +++
 .../implementation-5/LibConstants.sol              |  69 +++
 .../implementation-5/MForcedTradeActionState.sol   |  73 ++++
 .../MForcedWithdrawalActionState.sol               |  45 ++
 .../implementation-5/MFreezable.sol                |  47 +++
 .../implementation-5/MGovernance.sol               |  29 ++
 .../implementation-5/MKeyGetters.sol               |  35 ++
 .../implementation-5/MainGovernance.sol            |  82 ++++
 .../implementation-5/MainStorage.sol               | 136 ++++++
 .../implementation-5/PerpetualConstants.sol        |  29 ++
 .../implementation-5/PerpetualForcedActions.sol    |  66 +++
 .../implementation-5/PerpetualStorage.sol          |  46 ++
 .../implementation-5/ProxyStorage.sol              |  38 ++
 .../implementation-5/StarkExTypes.sol              |  32 ++
 .../implementation-5/SubContractor.sol             |  33 ++
 .../StarkExchangeUSDT/implementation-5/Users.sol   | 113 +++++
 .../StarkExchangeUSDT/implementation-5/meta.txt    |   2 +
 .../.code/StarkExchangeUSDT/proxy/Addresses.sol    |  58 +++
 .../.code/StarkExchangeUSDT/proxy/Governance.sol   | 123 ++++++
 .../StarkExchangeUSDT/proxy/GovernanceStorage.sol  |  26 ++
 .../.code/StarkExchangeUSDT/proxy/MGovernance.sol  |  29 ++
 .../.code/StarkExchangeUSDT/proxy/Proxy.sol        | 330 +++++++++++++++
 .../StarkExchangeUSDT/proxy/ProxyGovernance.sol    |  82 ++++
 .../.code/StarkExchangeUSDT/proxy/ProxyStorage.sol |  38 ++
 .../.code/StarkExchangeUSDT/proxy/StorageSlots.sol |  52 +++
 .../.code/StarkExchangeUSDT/proxy/meta.txt         |   2 +
 181 files changed, 13514 insertions(+)
```
