Generated with discovered.json: 0x745c3b276b223719f5dce71e971dae2afac8dfa5

# Diff at Mon, 13 Jul 2026 10:32:06 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@217e694bd321092d3ecc9f3d50e8788555454f01 block: 1783501903
- current timestamp: 1783938661

## Description

Added a DAC member and increased DAC min signatures required to 2.

## Watched changes

```diff
    contract FinalizableCommittee (eth:0x23bf3dcc14680162b7f5355aAbb56D31823c946e) [edgex/FinalizableDACommittee] {
    +++ description: DAC with admin funtions to manage members. Admins are not discoverable and thus not shown here.
+++ description: DAC members added to the initial set from the constructor.
      values.addedDACMembers.4:
+        "eth:0x085F09cc1e8cfedc40F257891EeA6c572c9EAe8d"
      values.signaturesRequired:
-        1
+        2
    }
```

Generated with discovered.json: 0xcfe3c2673ae837dff0272a9f6f37eb1b80812f69

# Diff at Wed, 08 Jul 2026 09:12:48 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@bd632cb3b3a14cad96138a9cfe1677d08dcc197d block: 1783333087
- current timestamp: 1783501903

## Description

Updated global configuration hash that commits to a set of offchain configs. Global configuration contains perp dex parameters and asset info for each synthetic asset: https://docs.starkware.co/starkex/perpetual/on-chain-configuration-perpetual-trading.html#global_configuration.

## Watched changes

```diff
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD) [N/A] {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      values.globalConfigurationHash:
-        "0x0114f28bf054a4ec460b72691af8a31eac9e0793cd57778e25b5b7d236052d64"
+        "0x02564aef7cc3de2f3779f578d2a2bf916abbf30c34007ce06434b8fb7e671a79"
    }
```

Generated with discovered.json: 0xfbd1411158193eb92661534af37e67e6fbe0a1da

# Diff at Mon, 06 Jul 2026 11:11:14 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@1fd9d39064602bc28714717ec6eae23c740b472b block: 1777891423
- current timestamp: 1783333087

## Description

Upgraded PerpetualTokensAndRamping facet of Stark diamond to an unverified contract. The diamond changed to not finalized, so probably there will be further upgrades.

## Watched changes

```diff
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD) [N/A] {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      template:
-        "starkex/StarkPerpetual"
      sourceHashes:
-        ["0x6b1917ba25a5b5df4eef66afa57aefa61ccb2230c2403358cca3b5e3dd6bbd5a","0x7cd422f025b0fd3210c5dd5116401aea5673db49cd24c6a040b7b148d25dc7f4"]
      values.$implementation.2:
-        "eth:0x1BC9C618B7FA6b5EfAAD31DC801eB55c608B9310"
+        "eth:0x80961E33198fa91C43De1Bc1d07516148099D58D"
      values.$pastUpgrades.1:
+        ["2026-07-05T07:25:47.000Z","0xa613c279b34ee7e5e767125c40a99b77136d6c4fd69042f618a5e3687a24c939",["eth:0x8C43C9bec15d82D153C52518030e0a9590ABD35d","eth:0x540Ad8576d2F90f28994ab001622F964945854A8","eth:0x80961E33198fa91C43De1Bc1d07516148099D58D","eth:0x45de249eEa8f9CDB70943B17CceDeb42F5BA0175","eth:0x31e2d974BaC547101413c24C23443AD488423f64"]]
      values.$upgradeCount:
-        1
+        2
      values.tokenAdmins:
-        ["eth:0x8847c33C6AEB53bf9a43D6b5579e9146478e6D3a"]
      implementationNames.eth:0x1BC9C618B7FA6b5EfAAD31DC801eB55c608B9310:
-        "PerpetualTokensAndRamping"
      implementationNames.eth:0x80961E33198fa91C43De1Bc1d07516148099D58D:
+        ""
      unverified:
+        true
    }
```

## Source code changes

```diff
.../PerpetualTokensAndRamping.3.sol => /dev/null   | 2254 --------------------
 1 file changed, 2254 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777891423 (main branch discovery), not current.

```diff
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD) [starkex/StarkPerpetual] {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      values.isNotFinalized:
-        true
+++ description: Finalizes most of the configuration of the contract, which cannot be changed afterwards (only thorugh an upgrade).
+++ severity: HIGH
      values.isFinalized:
+        false
    }
```

Generated with discovered.json: 0xb1703c9b23e30fcc16e61c3f884dd5abc84f19ce

# Diff at Fri, 12 Jun 2026 12:07:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@77f62933d564f65f6ab803a9850a637ea4a77091 block: 1777891423
- current timestamp: 1777891423

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777891423 (main branch discovery), not current.

```diff
    contract FinalizableGpsFactAdapter (eth:0x4abBc1826389aC0FEaA49E70c30a041b665e8562) [starkex/FinalizableGpsFactAdapter] {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`), which can be changed until the adapter is finalized.
      name:
-        "GpsFactRegistryAdapter"
+        "FinalizableGpsFactAdapter"
      template:
-        "starkex/GpsFactRegistryAdapter"
+        "starkex/FinalizableGpsFactAdapter"
      description:
-        "Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`)."
+        "Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`), which can be changed until the adapter is finalized."
+++ severity: HIGH
      values.owner:
+        "eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e"
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract Safe (eth:0x57814cC6e075f517781cB7c3B42897B3Bb2C54d8) [GnosisSafe] {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","description":"Permissioned to appoint and remove the Operator, register additional verifier and availability verifier contracts (removals are delayed), unfreeze the exchange and manage the governor set.","role":".$admin"}
      receivedPermissions.1.description:
-        "Permissioned to manage the Operator role, finalize state and change critical parameters like the programHash, configHash, or message cancellation delay in the core contract."
+        "change the global and per-asset configuration hashes committing to the L2 system parameters."
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
    }
```

Generated with discovered.json: 0xb833518de0c1ac00ef010b2c4e92b12768cf3218

# Diff at Tue, 09 Jun 2026 12:43:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1777891423
- current timestamp: 1777891423

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777891423 (main branch discovery), not current.

```diff
    contract Safe (eth:0x57814cC6e075f517781cB7c3B42897B3Bb2C54d8) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"governStarknet","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","role":".$admin"}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","description":"Permissioned to manage the Operator role, finalize state and change critical parameters like the programHash, configHash, or message cancellation delay in the core contract.","role":".$admin"}
    }
```

```diff
    EOA  (eth:0xCBe6fbf5e3c427013688E04D0fDE56705890c4bE) {
    +++ description: None
      receivedPermissions.0.description:
+        "Permissioned to regularly update the state of the L2 on L1. Each state update must have been proven via the SHARP verifier and contains state diffs for data availability."
      receivedPermissions.0.permission:
-        "operateStarknet"
+        "interact"
    }
```

Generated with discovered.json: 0xfa90ba245db44ebb0b55c652102a8caaff80489c

# Diff at Fri, 08 May 2026 07:51:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777891423
- current timestamp: 1777891423

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777891423 (main branch discovery), not current.

```diff
    contract AggregationRouterV5 (eth:0x1111111254EEB25477B68fb85Ed929f73A960582) [edgex/1InchAggregationRouterV5] {
    +++ description: 1inch DEX aggregator supporting RFQ fills, limit-order fills and direct DEX swaps.
      sourceHashes.0:
-        "0x3f07a08957b7504b340685cdf34a4374c24c86a8d07a040efe71444cbfa2ac06"
+        "0x1f424390ef58b8a3cb9ea5297f0f14936a6e632232b15d69e2d435068cf909d0"
    }
```

```diff
    contract FinalizableCommittee (eth:0x23bf3dcc14680162b7f5355aAbb56D31823c946e) [edgex/FinalizableDACommittee] {
    +++ description: DAC with admin funtions to manage members. Admins are not discoverable and thus not shown here.
      sourceHashes.0:
-        "0x7045af363bcf661aba6037e47938336e3946bbe761fff22861a972df02c1082e"
+        "0xe9c5b59d54cf434012c49507aac8220beb89073d431fc943f9a24ccb76a36cfc"
    }
```

```diff
    contract GpsFactRegistryAdapter (eth:0x4abBc1826389aC0FEaA49E70c30a041b665e8562) [starkex/GpsFactRegistryAdapter] {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
      sourceHashes.0:
-        "0x395444e8f8af03cea56ff4137d997fc94a06817d06cea35a2b467a45c6ee136b"
+        "0xc8212559a530b4ba272dfc6c98851fa8aa4c1b36e2da1bdbe18091f2c59754f0"
    }
```

```diff
    contract Safe (eth:0x57814cC6e075f517781cB7c3B42897B3Bb2C54d8) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract Safe (eth:0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
+        "0xe23c519b7324d6dc9132c8567ac55ae72bdf168c914d22825c7614d822364b0f"
    }
```

```diff
    contract PerpetualEscapeVerifier (eth:0xaadFdB9CAc145c65f2284fBe24600d07fb37F7BD) [edgex/PerpetualEscapeVerifier] {
    +++ description: Special verifier for the escape() function.
      sourceHashes.0:
-        "0xb56ab8d20ca2ce7897c0448957f5ad2bb634a2019411b1cb0453afe5c86f4f5f"
+        "0x7b9a6fc1405ce527115c6c286c0e85ba27c6c9a0576b4ca39fe647103101c676"
    }
```

```diff
    contract EdgeXDepositor (eth:0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5) [edgex/MultiSigPoolV5] {
    +++ description: A deposit wrapper that allows users to deposit arbitrary tokens to EdgeX. Tokens are swapped to USDT via 1inch and deposited to edgeX. This deposit wrapper also has fast withdrawal support using liquidity providers, but it seems deprecated in practice. Standard direct deposits and withdrawals of USDT at the StarkPerpetual contract are fully supported.
      sourceHashes.0:
-        "0x483e1f93408a0dc81d042ba65e3cf63dbc4a7330de88ad6a7dcb3925de28b3e0"
+        "0xa5a0df189af5b4d4778ba86269227ac9ea992c58b7cce101a537bb168f09065a"
    }
```

```diff
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD) [starkex/StarkPerpetual] {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      sourceHashes.0:
-        "0x11b6baf73d7af9813dd79e6017b18152200cf9eadaf83d45ac9e8c330721a703"
+        "0x6b1917ba25a5b5df4eef66afa57aefa61ccb2230c2403358cca3b5e3dd6bbd5a"
      sourceHashes.1:
-        "0xd2cfc40f85f0171f0b9b5a88fc7638bbb2af49fb1b87cf13a11d58f32403c598"
+        "0x7cd422f025b0fd3210c5dd5116401aea5673db49cd24c6a040b7b148d25dc7f4"
    }
```

Generated with discovered.json: 0x0e11dc25b70783cffb4ff4b845c20b145bb83494

# Diff at Tue, 05 May 2026 10:22:07 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777891423
- current timestamp: 1777891423

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777891423 (main branch discovery), not current.

```diff
    contract AggregationRouterV5 (eth:0x1111111254EEB25477B68fb85Ed929f73A960582) {
    +++ description: 1inch DEX aggregator supporting RFQ fills, limit-order fills and direct DEX swaps.
      deployerAddress:
+        "eth:0xCCbdBd9B0309a77fC6a56e087Ff2765ff394012e"
    }
```

```diff
    contract FinalizableCommittee (eth:0x23bf3dcc14680162b7f5355aAbb56D31823c946e) {
    +++ description: DAC with admin funtions to manage members. Admins are not discoverable and thus not shown here.
      deployerAddress:
+        "eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e"
    }
```

```diff
    contract GpsFactRegistryAdapter (eth:0x4abBc1826389aC0FEaA49E70c30a041b665e8562) {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
      deployerAddress:
+        "eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e"
    }
```

```diff
    contract Safe (eth:0x57814cC6e075f517781cB7c3B42897B3Bb2C54d8) {
    +++ description: None
      deployerAddress:
+        "eth:0xb8E3c28e88F33B9F61a37E0eE86d29C48f1cAE09"
    }
```

```diff
    contract Safe (eth:0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      deployerAddress:
+        "eth:0x58B5DAf5662425C1B8aB4Be8B3A53e8A2374Dbf1"
    }
```

```diff
    contract PerpetualEscapeVerifier (eth:0xaadFdB9CAc145c65f2284fBe24600d07fb37F7BD) {
    +++ description: Special verifier for the escape() function.
      deployerAddress:
+        "eth:0x5751a83170BeA11fE7CdA5D599B04153C021f21A"
    }
```

```diff
    contract EdgeXDepositor (eth:0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5) {
    +++ description: A deposit wrapper that allows users to deposit arbitrary tokens to EdgeX. Tokens are swapped to USDT via 1inch and deposited to edgeX. This deposit wrapper also has fast withdrawal support using liquidity providers, but it seems deprecated in practice. Standard direct deposits and withdrawals of USDT at the StarkPerpetual contract are fully supported.
      deployerAddress:
+        "eth:0x7396C0c9209fcbC6948A472835cC08c75eDe7f93"
    }
```

```diff
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      deployerAddress:
+        "eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e"
    }
```

Generated with discovered.json: 0x7dbc6e2bf512afbf855eecfcc90c2199205cc11b

# Diff at Mon, 04 May 2026 10:44:51 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@49e04c9893b7bab5ccd06ae4d7a23fa1d10918a8 block: 1777545991
- current timestamp: 1777891423

## Description

Verifier upgrade finalized, it is now actively used.

## Watched changes

```diff
    contract GpsFactRegistryAdapter (eth:0x4abBc1826389aC0FEaA49E70c30a041b665e8562) {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
      values.hasRegisteredFact:
-        false
+        true
    }
```

Generated with discovered.json: 0x9822caed1aa8f5102cb69c21aeec3c7f786726d6

# Diff at Thu, 30 Apr 2026 10:47:33 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@48c82436aca63abdd2a1dd0798daa7eaa9ef5e58 block: 1769695138
- current timestamp: 1777545991

## Description

Removed one operator (out of two). Verifier automatically changed hasRegisteredFact flag, indicating that verifier upgrade is not finalized yet.

## Watched changes

```diff
    contract GpsFactRegistryAdapter (eth:0x4abBc1826389aC0FEaA49E70c30a041b665e8562) {
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
      values.hasRegisteredFact:
-        true
+        false
    }
```

```diff
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
      values.operators.0:
-        "eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e"
    }
```

Generated with discovered.json: 0x789ff3acc9ff98947c1e59bed247a529e9d56d19

# Diff at Thu, 29 Jan 2026 14:00:02 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@8ab8b3539ad858470e2faf1383cbd783a9c5cdc5 block: 1767004364
- current timestamp: 1769695138

## Description

Rotated multisig member. 

## Watched changes

```diff
    contract Safe (eth:0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      values.$members.2:
-        "eth:0xB1A308e7F02798377b7acF685E997E3D774c5863"
+        "eth:0xd6970196Ff8CeF3Cdd61256C1841A085EEcD3ae8"
    }
```

Generated with discovered.json: 0x033da85424f2c681bd7eb2564d0f2ee810f4432d

# Diff at Mon, 29 Dec 2025 10:33:47 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@515d3131558dba4f5723e3914cca96f65c2d38d1 block: 1761895426
- current timestamp: 1767004364

## Description

Upgraded Safe multisig to version 1.4.1. Also rotated one multisig member, added a new one and increased the threshold.

## Watched changes

```diff
    contract Safe (eth:0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "Safe"
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x7d388119a66f3eae147d748f86136f073d907d6b36f7e87e9363c4c7a2899a8a"
      values.$implementation:
-        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0x41675C099F32341bf84BFc5382aF534df5C7461a"
      values.$members.0:
+        "eth:0xD8A6A3ca1739423de5F634dFAa8BA224EAf16d0e"
      values.$members.1:
+        "eth:0x223c0EF36fEe905a40175d92704b1d3624218EE7"
      values.$members.2:
-        "eth:0x2BB718a3986C36c6E02D8d15cdA4370820D08169"
      values.$threshold:
-        2
+        3
      values.multisigThreshold:
-        "2 of 3 (67%)"
+        "3 of 4 (75%)"
      values.VERSION:
-        "1.3.0"
+        "1.4.1"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x41675C099F32341bf84BFc5382aF534df5C7461a:
+        "Safe"
    }
```

## Source code changes

```diff
.../Safe.sol                                       |   0
 .../SafeProxy.p.sol                                |   0
 .../Proxy.p.sol                                    |   0
 .../Safe.sol}                                      | 685 ++++++++++++---------
 4 files changed, 410 insertions(+), 275 deletions(-)
```

Generated with discovered.json: 0xfd3177583f17eec5e5244067dec51b589ded3868

# Diff at Tue, 04 Nov 2025 11:32:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ff7b62a511791b99f61b604fb6b56e4ea223bb0 block: 1761895426
- current timestamp: 1761895426

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761895426 (main branch discovery), not current.

```diff
    contract AggregationRouterV5 (eth:0x1111111254EEB25477B68fb85Ed929f73A960582) {
    +++ description: 1inch DEX aggregator supporting RFQ fills, limit-order fills and direct DEX swaps.
      sourceHashes.0:
-        "0xcda14981e0e7c14eca7a40d2deb572f93fbfa2b9ee6e894c5b3d967ad1068bbb"
+        "0x3f07a08957b7504b340685cdf34a4374c24c86a8d07a040efe71444cbfa2ac06"
    }
```

Generated with discovered.json: 0x0b5d761071a93bb2c167755268e28aabb1e76122

# Diff at Fri, 31 Oct 2025 07:24:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@68eb98b0468d176aa44713dcaed98f67b2a200a0 block: 1760431807
- current timestamp: 1761895426

## Description

New admin.

## Watched changes

```diff
    EOA  (eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"governStarknet","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","role":".$admin"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","description":"manage the token admin role.","role":".$admin"}
      receivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD","role":".$admin"}
      controlsMajorityOfUpgradePermissions:
-        true
    }
```

```diff
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD) {
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
+++ description: Permissioned to upgrade the proxy implementations and access all `onlyGovernance` restricted functions in the various implementation contracts.
+++ severity: HIGH
      values.$admin:
-        "eth:0x17b287122363a0a6dBA7F185347DFcfb9816dA6e"
+        "eth:0x57814cC6e075f517781cB7c3B42897B3Bb2C54d8"
    }
```

```diff
+   Status: CREATED
    contract Safe (eth:0x57814cC6e075f517781cB7c3B42897B3Bb2C54d8)
    +++ description: None
```

## Source code changes

```diff
.../src/projects/edgex/.flat/Safe/Safe.sol         | 1088 ++++++++++++++++++++
 .../src/projects/edgex/.flat/Safe/SafeProxy.p.sol  |   37 +
 2 files changed, 1125 insertions(+)
```

Generated with discovered.json: 0xb4c46907dc4e1bd153b653fcc735028fe547dc4c

# Diff at Tue, 14 Oct 2025 11:53:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1760431807

## Description

Init discovery of EdgeX.

## Initial discovery

```diff
+   Status: CREATED
    contract AggregationRouterV5 (eth:0x1111111254EEB25477B68fb85Ed929f73A960582)
    +++ description: 1inch DEX aggregator supporting RFQ fills, limit-order fills and direct DEX swaps.
```

```diff
+   Status: CREATED
    contract FinalizableCommittee (eth:0x23bf3dcc14680162b7f5355aAbb56D31823c946e)
    +++ description: DAC with admin funtions to manage members. Admins are not discoverable and thus not shown here.
```

```diff
+   Status: CREATED
    reference SHARPVerifierCallProxy (eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GpsFactRegistryAdapter (eth:0x4abBc1826389aC0FEaA49E70c30a041b665e8562)
    +++ description: Adapter between the core contract and the eth:0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60. Stores the Cairo programHash (`2530337539466159944237001094809327283009177793361359619481044346150483328860`).
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x5E89f8d81C74E311458277EA1Be3d3247c7cd7D1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PerpetualEscapeVerifier (eth:0xaadFdB9CAc145c65f2284fBe24600d07fb37F7BD)
    +++ description: Special verifier for the escape() function.
```

```diff
+   Status: CREATED
    contract EdgeXDepositor (eth:0xC0a1a1e4AF873E9A37a0caC37F3aB81152432Cc5)
    +++ description: A deposit wrapper that allows users to deposit arbitrary tokens to EdgeX. Tokens are swapped to USDT via 1inch and deposited to edgeX. This deposit wrapper also has fast withdrawal support using liquidity providers, but it seems deprecated in practice. Standard direct deposits and withdrawals of USDT at the StarkPerpetual contract are fully supported.
```

```diff
+   Status: CREATED
    contract StarkPerpetual (eth:0xfAaE2946e846133af314d1Df13684c89fA7d83DD)
    +++ description: Central Validium contract. Receives (verified) state roots from the Operator, allows users to consume L2 -> L1 messages and send L1 -> L2 messages. Critical configuration values for the L2's logic are defined here by various governance roles.
```
