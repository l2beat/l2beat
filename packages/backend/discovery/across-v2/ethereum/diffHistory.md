Generated with discovered.json: 0x23ba1cd898c48745cfbf6f95e764d3dd8904bfed

# Diff at Thu, 18 Jan 2024 12:51:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: master@9ea763a3a6145f892624da4ecacd25a080a0d5b0 block: 18519360
- current block number: 19033859

## Description

OptimisticGovernor got discovered as a GnosisSafe module.
Smaller values for bonds in the OptimisticGovernor.
New owner added to the EmergencyProposalExecutor.

## Watched changes

```diff
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
      values.getOwners[3]:
+        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
      values.getOwners.2:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
      values.getOwners.1:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
      values.getOwners.0:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
    }
```

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
      values.bondAmount:
-        "10000000000000000000"
+        "2000000000000000000"
      values.getProposalBond:
-        "10000000000000000000"
+        "2000000000000000000"
      values.liveness:
-        432000
+        172800
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18519360 (main branch discovery), not current.

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
      upgradeability.type:
-        "immutable"
+        "gnosis safe zodiac module"
      upgradeability.avatar:
+        "0xB524735356985D2f267FA010D681f061DfF03715"
      upgradeability.target:
+        "0xB524735356985D2f267FA010D681f061DfF03715"
      upgradeability.guard:
+        "0x0000000000000000000000000000000000000000"
    }
```

# Diff at Fri, 13 Oct 2023 08:47:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@2aa7c4f2a9e71b0f29f6bdefa9d749d4fbbd7f5f

## Description

Updated the logic used to take into account the timestamp drift between L1 and L2 blocks.

## Watched changes

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
      upgradeability.implementation:
-        "0x326510c1bf9d85Fb73d0AB8d20Aa5BbE9c7561e9"
+        "0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"
    }
```

## Source code changes

```diff
.../token/ERC20/utils/SafeERC20Upgradeable.sol     |  6 +--
 .../implementation/contracts/SpokePool.sol         | 54 +++++++++++++++++-----
 .../contracts/interfaces/SpokePoolInterface.sol    | 10 ++++
 .../Ethereum_SpokePool/implementation/meta.txt     |  2 +-
 4 files changed, 57 insertions(+), 15 deletions(-)
```

# Diff at Thu, 21 Sep 2023 12:05:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@36d4050a6ee5a543b2163fe6e44153b540b87c16

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
      values.liveness:
-        7200
+        5400
    }
```
