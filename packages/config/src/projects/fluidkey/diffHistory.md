Generated with discovered.json: 0xb431777cdb71d02034c60b955afce0dc63e0c08b

# Diff at Fri, 09 Oct 2026 07:48:26 GMT:

- id: 4b078ceb
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1b0927d8fed18f91181a53bd060342f3168684bf block: 1790851084
- current timestamp: 1791532024

## Description

Added the FluidkeyScore token on Base, whose holder count bounds the number of accounts. Moved OffchainResolver and FluidkeyEarnModule from config overrides into templates, with no value changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1790851084 (main branch discovery), not current.

```diff
    contract FluidkeyEarnModule (arb1:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [fluidkey/FluidkeyEarnModule] {
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
      template:
+        "fluidkey/FluidkeyEarnModule"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FluidkeyEarnModule (base:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [fluidkey/FluidkeyEarnModule] {
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
      template:
+        "fluidkey/FluidkeyEarnModule"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Fluidkey Earn Owner (base:0x9E3eba321427941868cB4123De97DAB145C9e7CD) [GnosisSafe] {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"base:0x894c663757f6953544548EFA1aebc0846AC08bEa","description":"choose which addresses may transfer the score, such as the distributor.","role":".owner"}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"base:0x894c663757f6953544548EFA1aebc0846AC08bEa","role":"admin"}
    }
```

```diff
    contract FluidkeyEarnModule (eth:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [fluidkey/FluidkeyEarnModule] {
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
      template:
+        "fluidkey/FluidkeyEarnModule"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OffchainResolver (eth:0x9AcF316290AaA62edafdDDaC48B124032C36EB3c) [fluidkey/OffchainResolver] {
    +++ description: Immutable ENS CCIP-Read resolver used by Fluidkey. Every query redirects to a configurable gateway and accepts the returned ENS record if it is unexpired and signed by an accepted signer. It does not verify that a returned payment address was derived for the named recipient.
      template:
+        "fluidkey/OffchainResolver"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FluidkeyEarnModule (gno:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [fluidkey/FluidkeyEarnModule] {
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
      template:
+        "fluidkey/FluidkeyEarnModule"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FluidkeyEarnModule (matic:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [fluidkey/FluidkeyEarnModule] {
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
      template:
+        "fluidkey/FluidkeyEarnModule"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract FluidkeyEarnModule (oeth:0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9) [fluidkey/FluidkeyEarnModule] {
    +++ description: Safe module used for Fluidkey auto-earn. Authorized relayers can deposit tokens into the vault selected by the Safe's configuration hash, with vault shares credited to that Safe. The module owner publishes configurations, but selecting a different hash requires a call from the Safe.
      template:
+        "fluidkey/FluidkeyEarnModule"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
+   Status: CREATED
    contract FluidkeyScore (base:0x894c663757f6953544548EFA1aebc0846AC08bEa) [fluidkey/FluidkeyScore]
    +++ description: Non-transferable ERC-20 score that Fluidkey's distributor allocates to its users, based partly on their total balance. Only the owner and whitelisted senders can transfer it.
```

Generated with discovered.json: 0x1c2c0db166cf27e6de6c6605c8aca68c4d704453

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
