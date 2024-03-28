Generated with discovered.json: 0x3e398c9a07a24393eda56ca1d029dddcdaafbc5b

# Diff at Thu, 28 Mar 2024 08:29:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 18685523
- current block number: 19531421

## Description

Provide description of changes. This section will be preserved.

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
