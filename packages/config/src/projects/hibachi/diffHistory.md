Generated with discovered.json: 0xedda32d6f1824e709edfba134c2bc9c3e03d8177

# Diff at Mon, 27 Oct 2025 18:10:04 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e90d561a3c749c64b7c47b2495a9f71414e93dd2 block: 1760976189
- current timestamp: 1761588534

## Description

program update.

## Watched changes

```diff
    contract Hibachi (arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400) {
    +++ description: Main contract handling deposits, withdrawals and state updates.
      values.stateUpdateProgramImageId:
-        "0x5e5029174e9f99b7beff5facf19cd9c663cea713547dca3ce0aeaaf82102268a"
+        "0x7957ea2b84588fbc8c743a7dd77b1f39a0bc35132ee7fd5ecba3ec31f6705f57"
      values.stateUpdateProgramVKey:
-        "0x001bc283c6d7353ee47a2b61c3e469448e2be664d5a87fed8b7606319c2561e1"
+        "0x009d8e651bdf75e655eeafd0b6941cebe37f03e41d3f65b60a5ccb4003c446e6"
    }
```

Generated with discovered.json: 0xa1fe9de07ab13bf5241112eadf9a426708033e42

# Diff at Mon, 20 Oct 2025 16:04:19 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bfe80e92f67656ee716f7ab40cc8f3f9e92dc7d6 block: 1758703543
- current timestamp: 1760976189

## Description

program update.

## Watched changes

```diff
    contract Hibachi (arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400) {
    +++ description: Main contract handling deposits, withdrawals and state updates.
      values.stateUpdateProgramImageId:
-        "0xe67ae11c6b1408e9c51c070704d7e19eb6dd0dfe91cdc00759834d516bb4d180"
+        "0x5e5029174e9f99b7beff5facf19cd9c663cea713547dca3ce0aeaaf82102268a"
      values.stateUpdateProgramVKey:
-        "0x00a03342ba849be32311d27782f9979f4873f95feba8edcaf5bdbecc68fe9274"
+        "0x001bc283c6d7353ee47a2b61c3e469448e2be664d5a87fed8b7606319c2561e1"
    }
```

Generated with discovered.json: 0x9c909e60aae4b3a9e45364fcfd05dab12622f478

# Diff at Wed, 24 Sep 2025 08:46:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@7cc51773c5a1ecdb206a7bb11f12baa5f90228b9 block: 1754411762
- current timestamp: 1758703543

## Description

added a function that allows the admin to update the accounts root field, which is supposed to only be updated during a state update with the ZK verifiers.

## Watched changes

```diff
    contract Hibachi (arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400) {
    +++ description: Main contract handling deposits, withdrawals and state updates.
      sourceHashes.1:
-        "0xcf9fc16700d140e29a359a4c254a4a619c0093716fce601e5146e0a735e71f73"
+        "0x788c1099dcbbf4952a483c5c18e6c89199866587e457d7226ae0e2cb10e083f4"
      values.$implementation:
-        "arb1:0x66EBbea46E474e4e1C10fE2209184182a89736a4"
+        "arb1:0xCDAEfAEAE04EBe37c84c71a18518A0037F01aE7d"
      values.$pastUpgrades.2:
+        ["2025-09-18T14:42:40.000Z","0x9c195a5fca107c916ab8e384e19b25a021980082117e563929cf1e115e3895a5",["arb1:0xCDAEfAEAE04EBe37c84c71a18518A0037F01aE7d"]]
      values.$upgradeCount:
-        2
+        3
      values.stateUpdateProgramImageId:
-        "0xe36df63187239cb11fc29356c18dd9996c19ef4668379f72956f648fbb7c72f2"
+        "0xe67ae11c6b1408e9c51c070704d7e19eb6dd0dfe91cdc00759834d516bb4d180"
      values.stateUpdateProgramVKey:
-        "0x00761079b58d6d09fea47ee455238cae478986d76fc2c778e293f3c846a148b3"
+        "0x00a03342ba849be32311d27782f9979f4873f95feba8edcaf5bdbecc68fe9274"
      implementationNames.arb1:0x66EBbea46E474e4e1C10fE2209184182a89736a4:
-        "Hibachi"
      implementationNames.arb1:0xCDAEfAEAE04EBe37c84c71a18518A0037F01aE7d:
+        "Hibachi"
    }
```

## Source code changes

```diff
.../Hibachi/Hibachi.sol                            | 46 +++++++++++++---------
 1 file changed, 27 insertions(+), 19 deletions(-)
```

Generated with discovered.json: 0x22e5ddc9479a2ae1ff7a4e85b2f2d7d6112664ca

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x8b72e3ad02fcbd5ffacf1a5a4da12a2704e01573

# Diff at Tue, 05 Aug 2025 16:36:07 GMT:

- chain: arbitrum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@102320c86f8441c4ad97dd092d898f3142ff4433 block: 1753687629
- current timestamp: 1754411762

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753687629 (main branch discovery), not current.

```diff
    contract SP1Verifier (0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      template:
+        "succinct/SP1Verifier"
      description:
+        "Verifier contract for SP1 proofs (v5.0.0)."
    }
```

Generated with discovered.json: 0xb6e52cc51123d51f680f068994abc3d2baa7290e

# Diff at Mon, 28 Jul 2025 07:27:15 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 361056917
- current block number: 362381317

## Description

verifier changes.

## Watched changes

```diff
    contract Hibachi (0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400) {
    +++ description: Main contract handling deposits, withdrawals and state updates.
      values.stateUpdateProgramImageId:
-        "0x6c66cc03d0d50933ca4558a6513f51cded2f48dd8f1ea8929f86f553f35b2328"
+        "0xe36df63187239cb11fc29356c18dd9996c19ef4668379f72956f648fbb7c72f2"
      values.stateUpdateProgramVKey:
-        "0x00202b4f9c0e94c5915fcb43369795fd30f35491b4017ceecf876199d6b26163"
+        "0x00761079b58d6d09fea47ee455238cae478986d76fc2c778e293f3c846a148b3"
    }
```

Generated with discovered.json: 0xb74ec2373881c5581514daffc14019c45ae977c0

# Diff at Thu, 24 Jul 2025 11:35:40 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@daf9b4c0c3e0cc879ae7e4d12a2a3cc6a78da2a5 block: 351073243
- current block number: 361056917

## Description

stateUpdateProgramImageId update.

Config: Kailua added to OptimismPortal2 and DisputeGameFactory.

## Watched changes

```diff
    contract Hibachi (0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400) {
    +++ description: Main contract handling deposits, withdrawals and state updates.
      values.stateUpdateProgramImageId:
-        "0x624424e8cfb1478de0bbd5b2dbdb1a19a2dd235c3f7997b9d585d7f2e87879c4"
+        "0x6c66cc03d0d50933ca4558a6513f51cded2f48dd8f1ea8929f86f553f35b2328"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 351073243 (main branch discovery), not current.

```diff
    contract RiscZeroVerifierRouter (0x0b144E07A0826182B6b59788c34b32Bfa86Fb711) {
    +++ description: A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (arb1:0xDC986a09728F76110FF666eE7b20d99086501d15).
      template:
+        "risc0/RiscZeroVerifierRouter"
      description:
+        "A router proxy that routes to verifiers based on selectors. The mapping can be changed by a permissioned owner (arb1:0xDC986a09728F76110FF666eE7b20d99086501d15)."
    }
```

```diff
    contract TimelockController (0xDC986a09728F76110FF666eE7b20d99086501d15) {
    +++ description: A timelock with access control. The current minimum delay is 3d.
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["arb1:0xDC986a09728F76110FF666eE7b20d99086501d15"]},"PROPOSER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["arb1:0xF616A4f81857CFEe54A4A049Ec187172574bd412"]},"CANCELLER_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["arb1:0xF616A4f81857CFEe54A4A049Ec187172574bd412"]},"EXECUTOR_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["arb1:0xF616A4f81857CFEe54A4A049Ec187172574bd412"]}}
      values.Canceller:
+        ["arb1:0xF616A4f81857CFEe54A4A049Ec187172574bd412"]
      values.defaultAdminAC:
+        ["arb1:0xDC986a09728F76110FF666eE7b20d99086501d15"]
      values.Executor:
+        ["arb1:0xF616A4f81857CFEe54A4A049Ec187172574bd412"]
      values.getMinDelayFormatted:
+        "3d"
      values.Proposer:
+        ["arb1:0xF616A4f81857CFEe54A4A049Ec187172574bd412"]
      template:
+        "global/TimelockController"
      description:
+        "A timelock with access control. The current minimum delay is 3d."
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"arb1:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711","description":"add/remove verifiers and the selectors they are mapped to.","role":".owner"},{"permission":"interact","from":"arb1:0xDC986a09728F76110FF666eE7b20d99086501d15","description":"manage all access control roles.","role":".defaultAdminAC"}]
    }
```

Generated with discovered.json: 0x4293bcdecdaca79f526667dcef172eb6d8d7bbb5

# Diff at Mon, 14 Jul 2025 12:44:17 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 351073243
- current block number: 351073243

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 351073243 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000000) {
    +++ description: None
      address:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract RiscZeroVerifierRouter (0x0b144E07A0826182B6b59788c34b32Bfa86Fb711) {
    +++ description: None
      address:
-        "0x0b144E07A0826182B6b59788c34b32Bfa86Fb711"
+        "arb1:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711"
      values.owner:
-        "0xDC986a09728F76110FF666eE7b20d99086501d15"
+        "arb1:0xDC986a09728F76110FF666eE7b20d99086501d15"
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0x0b144E07A0826182B6b59788c34b32Bfa86Fb711:
-        "RiscZeroVerifierRouter"
      implementationNames.arb1:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711:
+        "RiscZeroVerifierRouter"
    }
```

```diff
    contract Hibachi (0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400) {
    +++ description: Main contract handling deposits, withdrawals and state updates.
      address:
-        "0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
+        "arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
      values.$admin:
-        "0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
+        "arb1:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
      values.$implementation:
-        "0x66EBbea46E474e4e1C10fE2209184182a89736a4"
+        "arb1:0x66EBbea46E474e4e1C10fE2209184182a89736a4"
      values.$pastUpgrades.0.2.0:
-        "0x7ebf03D61a452fEA00aeAFd65Fd0Fe637cB2a3a7"
+        "arb1:0x7ebf03D61a452fEA00aeAFd65Fd0Fe637cB2a3a7"
      values.$pastUpgrades.1.2.0:
-        "0x66EBbea46E474e4e1C10fE2209184182a89736a4"
+        "arb1:0x66EBbea46E474e4e1C10fE2209184182a89736a4"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x420eee5B429664F08f001786541acbE0F59feF5c"
+        "arb1:0x420eee5B429664F08f001786541acbE0F59feF5c"
      values.accessControl.PROVER_ROLE.members.0:
-        "0x40e94Ed956F3077F4EA64935C1D52ae30951157C"
+        "arb1:0x40e94Ed956F3077F4EA64935C1D52ae30951157C"
      values.accessControl.X_CHAIN_ADMIN_ROLE.members.0:
-        "0x420eee5B429664F08f001786541acbE0F59feF5c"
+        "arb1:0x420eee5B429664F08f001786541acbE0F59feF5c"
      values.accessControl.KILLSWITCH_ROLE.members.0:
-        "0x420eee5B429664F08f001786541acbE0F59feF5c"
+        "arb1:0x420eee5B429664F08f001786541acbE0F59feF5c"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0x420eee5B429664F08f001786541acbE0F59feF5c"
+        "arb1:0x420eee5B429664F08f001786541acbE0F59feF5c"
      values.exchangeVerificationAddress:
-        "0x4aF802A931CADb2aF3a9Ec4C810A0485a2eF3610"
+        "arb1:0x4aF802A931CADb2aF3a9Ec4C810A0485a2eF3610"
      values.hibachiEscape:
-        "0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
+        "arb1:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
      values.nativeAssetInfo.0.assetAddress:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.nativeAssetInfo.1.assetAddress:
-        "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
+        "arb1:0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
      values.nativeAssetInfo.2.assetAddress:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.nativeAssetInfo.3.assetAddress:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.nativeAssetInfo.4.assetAddress:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.oracles.0:
-        "0x735d77411693F244d35192d95D8804B6b371a553"
+        "arb1:0x735d77411693F244d35192d95D8804B6b371a553"
      values.risc0Verifier:
-        "0x0b144E07A0826182B6b59788c34b32Bfa86Fb711"
+        "arb1:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711"
      values.succinctVerifier:
-        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
+        "arb1:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
      values.wormhole:
-        "0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
+        "arb1:0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
      implementationNames.0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400:
-        "TransparentUpgradeableProxy"
      implementationNames.0x66EBbea46E474e4e1C10fE2209184182a89736a4:
-        "Hibachi"
      implementationNames.arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x66EBbea46E474e4e1C10fE2209184182a89736a4:
+        "Hibachi"
    }
```

```diff
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      address:
-        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
+        "arb1:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
      values.activeVerifiers.0.verifier:
-        "0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5"
+        "arb1:0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5"
      values.allVerifiers.0.verifier:
-        "0xE780809121774D06aD9B0EEeC620fF4B3913Ced1"
+        "arb1:0xE780809121774D06aD9B0EEeC620fF4B3913Ced1"
      values.allVerifiers.1.verifier:
-        "0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D"
+        "arb1:0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D"
      values.allVerifiers.2.verifier:
-        "0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5"
+        "arb1:0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5"
      values.owner:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "arb1:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      implementationNames.0x397A5f7f3dBd538f23DE225B51f532c34448dA9B:
-        "SP1VerifierGateway"
      implementationNames.arb1:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B:
+        "SP1VerifierGateway"
    }
```

```diff
    EOA  (0x40e94Ed956F3077F4EA64935C1D52ae30951157C) {
    +++ description: None
      address:
-        "0x40e94Ed956F3077F4EA64935C1D52ae30951157C"
+        "arb1:0x40e94Ed956F3077F4EA64935C1D52ae30951157C"
    }
```

```diff
    EOA  (0x420eee5B429664F08f001786541acbE0F59feF5c) {
    +++ description: None
      address:
-        "0x420eee5B429664F08f001786541acbE0F59feF5c"
+        "arb1:0x420eee5B429664F08f001786541acbE0F59feF5c"
    }
```

```diff
    contract HibachiRedemptionERC20 (0x4407f4F272f78D1157C59E8557729be36137158F) {
    +++ description: None
      address:
-        "0x4407f4F272f78D1157C59E8557729be36137158F"
+        "arb1:0x4407f4F272f78D1157C59E8557729be36137158F"
      values.admin:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      implementationNames.0x4407f4F272f78D1157C59E8557729be36137158F:
-        "HibachiRedemptionERC20"
      implementationNames.arb1:0x4407f4F272f78D1157C59E8557729be36137158F:
+        "HibachiRedemptionERC20"
    }
```

```diff
    EOA  (0x4aF802A931CADb2aF3a9Ec4C810A0485a2eF3610) {
    +++ description: None
      address:
-        "0x4aF802A931CADb2aF3a9Ec4C810A0485a2eF3610"
+        "arb1:0x4aF802A931CADb2aF3a9Ec4C810A0485a2eF3610"
    }
```

```diff
    contract SP1Verifier (0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5) {
    +++ description: None
      address:
-        "0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5"
+        "arb1:0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5"
      implementationNames.0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5:
-        "SP1Verifier"
      implementationNames.arb1:0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5:
+        "SP1Verifier"
    }
```

```diff
    EOA  (0x72Ff26D9517324eEFA89A48B75c5df41132c4f54) {
    +++ description: None
      address:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "arb1:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
    }
```

```diff
    EOA  (0x735d77411693F244d35192d95D8804B6b371a553) {
    +++ description: None
      address:
-        "0x735d77411693F244d35192d95D8804B6b371a553"
+        "arb1:0x735d77411693F244d35192d95D8804B6b371a553"
    }
```

```diff
    contract HibachiEscape (0x818351386C3a63A8244C78aDAD42B9b4f9a516d4) {
    +++ description: None
      address:
-        "0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
+        "arb1:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
      values.$admin:
-        "0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
+        "arb1:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
      values.$implementation:
-        "0x86C58d5853E05110e9297A324ceFD455A9585b9E"
+        "arb1:0x86C58d5853E05110e9297A324ceFD455A9585b9E"
      values.$pastUpgrades.0.2.0:
-        "0x86C58d5853E05110e9297A324ceFD455A9585b9E"
+        "arb1:0x86C58d5853E05110e9297A324ceFD455A9585b9E"
      values.hibachi:
-        "0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
+        "arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
      values.redemptionTokenAddress.0:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.redemptionTokenAddress.1:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.redemptionTokenAddress.2:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.redemptionTokenAddress.3:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.redemptionTokenAddress.4:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.redemptionTokenImpl:
-        "0x4407f4F272f78D1157C59E8557729be36137158F"
+        "arb1:0x4407f4F272f78D1157C59E8557729be36137158F"
      values.verifier:
-        "0x0b144E07A0826182B6b59788c34b32Bfa86Fb711"
+        "arb1:0x0b144E07A0826182B6b59788c34b32Bfa86Fb711"
      values.wormhole:
-        "0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
+        "arb1:0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
      implementationNames.0x818351386C3a63A8244C78aDAD42B9b4f9a516d4:
-        "TransparentUpgradeableProxy"
      implementationNames.0x86C58d5853E05110e9297A324ceFD455A9585b9E:
-        "HibachiEscape"
      implementationNames.arb1:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x86C58d5853E05110e9297A324ceFD455A9585b9E:
+        "HibachiEscape"
    }
```

```diff
    EOA  (0x9395e83720bf2D8ac6435f9c520b48E289Cb8885) {
    +++ description: None
      address:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "arb1:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
    }
```

```diff
    contract ProxyAdmin (0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1) {
    +++ description: None
      address:
-        "0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
+        "arb1:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
      values.owner:
-        "0x420eee5B429664F08f001786541acbE0F59feF5c"
+        "arb1:0x420eee5B429664F08f001786541acbE0F59feF5c"
      implementationNames.0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1:
-        "ProxyAdmin"
      implementationNames.arb1:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1:
+        "ProxyAdmin"
    }
```

```diff
    contract ProxyAdmin (0xa3F61770BBd12e705734Ad940f382227d0fD82fE) {
    +++ description: None
      address:
-        "0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
+        "arb1:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
      values.owner:
-        "0x420eee5B429664F08f001786541acbE0F59feF5c"
+        "arb1:0x420eee5B429664F08f001786541acbE0F59feF5c"
      implementationNames.0xa3F61770BBd12e705734Ad940f382227d0fD82fE:
-        "ProxyAdmin"
      implementationNames.arb1:0xa3F61770BBd12e705734Ad940f382227d0fD82fE:
+        "ProxyAdmin"
    }
```

```diff
    contract Implementation (0xa5f208e072434bC67592E4C49C1B991BA79BCA46) {
    +++ description: None
      address:
-        "0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
+        "arb1:0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x621199f6beB2ba6fbD962E8A52A320EA4F6D4aA3"
+        "arb1:0x621199f6beB2ba6fbD962E8A52A320EA4F6D4aA3"
      values.$pastUpgrades.0.2.0:
-        "0x126783A6Cb203a3E35344528B26ca3a0489a1485"
+        "arb1:0x126783A6Cb203a3E35344528B26ca3a0489a1485"
      values.$pastUpgrades.1.2.0:
-        "0x91175AEE6dAc41B9C1f749ded077568aD93B84Ca"
+        "arb1:0x91175AEE6dAc41B9C1f749ded077568aD93B84Ca"
      values.$pastUpgrades.2.2.0:
-        "0x621199f6beB2ba6fbD962E8A52A320EA4F6D4aA3"
+        "arb1:0x621199f6beB2ba6fbD962E8A52A320EA4F6D4aA3"
      implementationNames.0xa5f208e072434bC67592E4C49C1B991BA79BCA46:
-        "Wormhole"
      implementationNames.0x621199f6beB2ba6fbD962E8A52A320EA4F6D4aA3:
-        "Implementation"
      implementationNames.arb1:0xa5f208e072434bC67592E4C49C1B991BA79BCA46:
+        "Wormhole"
      implementationNames.arb1:0x621199f6beB2ba6fbD962E8A52A320EA4F6D4aA3:
+        "Implementation"
    }
```

```diff
    EOA  (0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126) {
    +++ description: None
      address:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "arb1:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
    }
```

```diff
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      address:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
+        "arb1:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "arb1:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
+        "arb1:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
      values.$members.1:
-        "0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
+        "arb1:0x72Ff26D9517324eEFA89A48B75c5df41132c4f54"
      values.$members.2:
-        "0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
+        "arb1:0x9395e83720bf2D8ac6435f9c520b48E289Cb8885"
      implementationNames.0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.arb1:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878:
+        "GnosisSafeProxy"
      implementationNames.arb1:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract TimelockController (0xDC986a09728F76110FF666eE7b20d99086501d15) {
    +++ description: None
      address:
-        "0xDC986a09728F76110FF666eE7b20d99086501d15"
+        "arb1:0xDC986a09728F76110FF666eE7b20d99086501d15"
      implementationNames.0xDC986a09728F76110FF666eE7b20d99086501d15:
-        "TimelockController"
      implementationNames.arb1:0xDC986a09728F76110FF666eE7b20d99086501d15:
+        "TimelockController"
    }
```

```diff
+   Status: CREATED
    contract RiscZeroVerifierRouter (0x0b144E07A0826182B6b59788c34b32Bfa86Fb711)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hibachi (0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400)
    +++ description: Main contract handling deposits, withdrawals and state updates.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract HibachiRedemptionERC20 (0x4407f4F272f78D1157C59E8557729be36137158F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HibachiEscape (0x818351386C3a63A8244C78aDAD42B9b4f9a516d4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xa3F61770BBd12e705734Ad940f382227d0fD82fE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Implementation (0xa5f208e072434bC67592E4C49C1B991BA79BCA46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (0xDC986a09728F76110FF666eE7b20d99086501d15)
    +++ description: None
```

Generated with discovered.json: 0x2119cf2129cb91c0d94dfddd5e9a2e432556575f

# Diff at Fri, 04 Jul 2025 12:19:03 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 351073243
- current block number: 351073243

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 351073243 (main branch discovery), not current.

```diff
    EOA  (0x0000000000000000000000000000000000000000) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
+        "arb1:0xa5f208e072434bC67592E4C49C1B991BA79BCA46"
    }
```

```diff
    EOA  (0x420eee5B429664F08f001786541acbE0F59feF5c) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
+        "arb1:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
      receivedPermissions.0.from:
-        "arbitrum:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
+        "arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
+        "arb1:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
      receivedPermissions.1.from:
-        "arbitrum:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
+        "arb1:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
+        "arb1:0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
+        "arb1:0xa3F61770BBd12e705734Ad940f382227d0fD82fE"
    }
```

```diff
    contract ProxyAdmin (0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
+        "arb1:0x818351386C3a63A8244C78aDAD42B9b4f9a516d4"
    }
```

```diff
    contract ProxyAdmin (0xa3F61770BBd12e705734Ad940f382227d0fD82fE) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
+        "arb1:0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400"
    }
```

```diff
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
+        "arb1:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
    }
```

Generated with discovered.json: 0x62f209406f6eedcd1612933d5af5ae1f82f0380a

# Diff at Wed, 25 Jun 2025 13:51:49 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 351073243

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract RiscZeroVerifierRouter (0x0b144E07A0826182B6b59788c34b32Bfa86Fb711)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hibachi (0x0E9C1a3AA696299E38b00a8144Bf6dc16C1F5400)
    +++ description: Main contract handling deposits, withdrawals and state updates.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract HibachiRedemptionERC20 (0x4407f4F272f78D1157C59E8557729be36137158F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HibachiEscape (0x818351386C3a63A8244C78aDAD42B9b4f9a516d4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x951e848eAD9c2B4aFaEa5e0649b36A00f97f01b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xa3F61770BBd12e705734Ad940f382227d0fD82fE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Implementation (0xa5f208e072434bC67592E4C49C1B991BA79BCA46)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockController (0xDC986a09728F76110FF666eE7b20d99086501d15)
    +++ description: None
```

