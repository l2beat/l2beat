Generated with discovered.json: 0x86f5a697e88e62dc3e2832bb21f5115cd2bec5e2

# Diff at Fri, 08 Mar 2024 08:53:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a10be30b5303dc6a457478efdaca424c246501ca block: 19375580
- current block number: 19389379

## Description

New proposal created and executed with the description "Change Arbitrage Settings on Main and Side Bridges".

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        49
+        50
    }
```

Generated with discovered.json: 0x5fa08b3a2322e373062b7d84998ac427346b7e7b

# Diff at Wed, 06 Mar 2024 10:38:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@724fc93d9bd160395a856b93ce5016ca876c6436 block: 19118389
- current block number: 19375580

## Description

New proposal created and executed with the description "Unfreeze bridges".

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
      values.proposalCount:
-        48
+        49
    }
```

Generated with discovered.json: 0x860ce22e6e5ca8d7087c013b808735c88781475f

# Diff at Tue, 30 Jan 2024 09:20:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8166c01da21cd9a7fadf2664669d7d2675512e02 block: 19062209
- current block number: 19118389

## Description

New proposal created with the description "Add 4 new maintainers".
The new maintainers are:

- 0x6d26b9efb640bf40cca1fb70b00b0fcec732ce00
- 0x097bdc9e913539b6aa0a79389ccc084b9502846a
- 0xa829446eec801483b32f5d5486374672aad7e028
- 0xdcc781ebeb5b6aa4648703202a34c46959302ed6

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
      values.proposalCount:
-        47
+        48
    }
```

Generated with discovered.json: 0x972c0ec8ccdd85cd61bd3520dbb2f78b1cab4165

# Diff at Mon, 22 Jan 2024 12:14:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@7755f153438c1f16773ba6733cfa3a8c8bc0a394 block: 18932447
- current block number: 19062209

## Description

Executed two proposalas 46 and 47.
The first one according to the description submitted by the Chainport Congress aims to: "Deploy Arbitrage, Upgrade Main and Side Bridge and add new Maintainer".
While the second one wants to: "Refund HODL tokens".

In the process the implementation of the Vault changed, since this contract is unverfied it's impossible to analyze what has really happened.

## Watched changes

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
      upgradeability.implementation:
-        "0x4899eB3c7db4c3b31Ee412fBcf2cfbA60Ca5C568"
+        "0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"
      implementations.0:
-        "0x4899eB3c7db4c3b31Ee412fBcf2cfbA60Ca5C568"
+        "0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"
    }
```

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
      values.proposalCount:
-        45
+        47
    }
```

## Source code changes

```diff
.../ethereum/{.code@18932447 => .code}/Vault6/implementation/meta.txt   | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

# Diff at Thu, 04 Jan 2024 07:22:14 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@45fa22227d0d99394ce6d0a25e40e8ceeca18cb3

## Description

New proposal was created and executed. It changes the fee collector address (to 0xdb07241c48eAd8b973A76B0bEb60a21F09BEC5e4) for the main Vault contract and a side contract (source code not available).

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
      values.proposalCount:
-        44
+        45
    }
```

# Diff at Fri, 06 Oct 2023 09:11:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Multisig bridge. Don't want to spend too much time on it.

## Watched changes

```diff
+   Status: CREATED
    contract ChainportCongressMembersRegistry (0x1DeE7Be5415F6Fdcc8515cA06AE8d9aFb550aBCa) {
    }
```

```diff
+   Status: CREATED
    contract MultisigVault2 (0x450aD18B4442ce2972Af2a7A12439984db4Afaf9) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F) {
    }
```

```diff
+   Status: CREATED
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    }
```

```diff
+   Status: CREATED
    contract MultisigVault1 (0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19) {
    }
```

```diff
+   Status: CREATED
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    }
```
