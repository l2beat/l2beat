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
