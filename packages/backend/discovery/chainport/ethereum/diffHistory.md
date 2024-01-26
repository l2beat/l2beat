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
