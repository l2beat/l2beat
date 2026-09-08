Generated with discovered.json: 0x7b143f3e6792f8bfca959ebb9432e1cc39ff61b3

# Diff at Tue, 08 Sep 2026 08:47:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1788853601

## Description

Initial discovery of the Fluidkey ENS resolver, its owner and signers, and the auto-earn module and its permissions on Ethereum, Base, Arbitrum, Optimism, Polygon PoS, and Gnosis.

## Initial discovery

```diff
+   Status: CREATED
    contract FluidkeyEarnModule (arb1:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [N/A]
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
```

```diff
+   Status: CREATED
    contract Fluidkey Earn Owner (arb1:0x9E3eba321427941868cB4123De97DAB145C9e7CD) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FluidkeyEarnModule (base:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [N/A]
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
```

```diff
+   Status: CREATED
    contract Fluidkey Earn Owner (base:0x9E3eba321427941868cB4123De97DAB145C9e7CD) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FluidkeyEarnModule (eth:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [N/A]
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
```

```diff
+   Status: CREATED
    contract OffchainResolver (eth:0x9AcF316290AaA62edafdDDaC48B124032C36EB3c) [N/A]
    +++ description: Immutable ENS CCIP-Read resolver used by Fluidkey. Every query redirects to a configurable gateway and accepts the returned ENS record if it is unexpired and signed by an accepted signer. It does not verify that a returned payment address was derived for the named recipient.
```

```diff
+   Status: CREATED
    contract Fluidkey Earn Owner (eth:0x9E3eba321427941868cB4123De97DAB145C9e7CD) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Fluidkey Resolver Multisig (eth:0xdcC34c0da55cEF7AeD38Bb749AD97DAC12A9936C) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FluidkeyEarnModule (gno:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [N/A]
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
```

```diff
+   Status: CREATED
    contract Fluidkey Earn Owner (gno:0x9E3eba321427941868cB4123De97DAB145C9e7CD) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FluidkeyEarnModule (matic:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [N/A]
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
```

```diff
+   Status: CREATED
    contract Fluidkey Earn Owner (matic:0x9E3eba321427941868cB4123De97DAB145C9e7CD) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract FluidkeyEarnModule (oeth:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [N/A]
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
```

```diff
+   Status: CREATED
    contract Fluidkey Earn Owner (oeth:0x9E3eba321427941868cB4123De97DAB145C9e7CD) [GnosisSafe]
    +++ description: None
```
