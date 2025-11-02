Generated with discovered.json: 0xe254fc7aded356a287dff310824a9b383cf76ac4

# Diff at Wed, 29 Oct 2025 17:11:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cd3acb30978545d875852451e86e15a019f3b00a block: 1759756433
- current timestamp: 1761757805

## Description

removed the actor that can pause withdrawals (but not unpause them). the admin msig can still pause.

## Watched changes

```diff
    contract ZircuitSuperchainConfig (eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      values.accessControl.MONITOR_ROLE.members.0:
-        "eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"
      values.monitorAC.0:
-        "eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"
    }
```

Generated with discovered.json: 0xeee1cb88f407f80dd40d299d898e0fb049e169aa

# Diff at Mon, 06 Oct 2025 13:15:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e58bd9f0913161b35e2a2c65f233464591d4f28b block: 1758795594
- current timestamp: 1759756433

## Description

Config: formatSeconds change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758795594 (main branch discovery), not current.

```diff
    contract L2OutputOracle (eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. Additionally, users can 'escape' their funds after 1mo of no state updates by supplying merkle proofs or using a resolver.
      description:
-        "Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. Additionally, users can 'escape' their funds after 30d of no state updates by supplying merkle proofs or using a resolver."
+        "Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. Additionally, users can 'escape' their funds after 1mo of no state updates by supplying merkle proofs or using a resolver."
      values.timeLimitOutputRootSubmissionSecondsFmt:
-        "30d"
+        "1mo"
    }
```

Generated with discovered.json: 0xf4401355c7bb0c0970ef5845c5d4e6f282b0c898

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xbaa4677fb74699d2176e39f19cc4eb06e040a3a0

# Diff at Fri, 29 Aug 2025 07:19:13 GMT:

- chain: zircuit
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e68cba094085f7ab7e642304a942701f260f19fb block: 1756216503
- current timestamp: 1756451851

## Description

Increased L2 fees by adding a constant and a scalar.

## Watched changes

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain. This version though also contains a storage slot for `depositExclusions`.
      values.operatorFeeConstant:
-        0
+        23225000000
      values.operatorFeeScalar:
-        0
+        4200000000
    }
```

Generated with discovered.json: 0x99d75e1ddf2eb52ee3bc2bc62b9dacbcf05b4d1a

# Diff at Fri, 29 Aug 2025 07:19:10 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e68cba094085f7ab7e642304a942701f260f19fb block: 1756216503
- current timestamp: 1756451851

## Description

Updated fee parameters.

## Watched changes

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.operatorFeeConstant:
-        0
+        23225000000
      values.operatorFeeScalar:
-        0
+        4200000000
    }
```

Generated with discovered.json: 0x3abb85b5b9bd5c27d49020755a9731acfb98a761

# Diff at Tue, 26 Aug 2025 13:58:36 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1756120933
- current timestamp: 1756216503

## Description

Zircuit started posting SP1 proofs and the old verifier is now impossible to be used, even though it is still there.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756120933 (main branch discovery), not current.

```diff
    contract VerifierV2 (0xC25D093D3A3f58952252D2e763BEAF2559dc9737) {
    +++ description: ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. The verifier is now unused as the project migrated to SP1.
      description:
-        "ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system."
+        "ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. The verifier is now unused as the project migrated to SP1."
      category.name:
-        "Local Infrastructure"
+        "Spam"
      category.priority:
-        5
+        -1
    }
```

Generated with discovered.json: 0x60582163e2d99029023a3267e79fbd37e734cf24

# Diff at Mon, 25 Aug 2025 13:11:34 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ad220cb66b2845d84a69889aeb34f71bc5a0a6b0 block: 1754567136
- current timestamp: 1756120933

## Description

- [SystemConfig](https://disco.l2beat.com/diff/eth:0x795277B6aD8778E27aa70813157134cfC4a4D446/eth:0x83085450544c3F360a40720859EbB1bfd311584D): added a `setEIP1559Params` function to update denominator and elasticity params.
- [OptimismPortal](https://disco.l2beat.com/diff/eth:0xA0A36095A2258568759fb41CAE4934BBd2d04E26/eth:0xF7209f5471628aC5f68FE4ae98Feb7f02E0f40Be): additional check in `proveWithdrawalTransaction`, nothing significant. Ignore changes related to interfaces.
- [L2OutputOracle](https://disco.l2beat.com/diff/eth:0xb82E8B7B3a93290EE38dB201686AbDc9FDF6A315/eth:0x6AB82bb139383BB758348fBb81EdA57458e59f65): biggest change as it now supports SP1, but it is currently not used. A check has been added to the .ts file to detect when it gets used.

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from the host chain to this chain. It also allows to prove and finalize withdrawals. This fork of the standard OP stack contract allows for permissionless 'escaping' of assets with merkle proofs or a resolver if there were no state updates for a time defined by the eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4.
      sourceHashes.1:
-        "0xb800094cbe5da9b7c7fb14d9f851fabc0adb88151044c80334d6c6f9cc27cc4b"
+        "0xc4abdb5610f10d943d33cff714f0c98807bd0f37828f9b5b32a0874a2f192ce6"
      values.$implementation:
-        "eth:0xA0A36095A2258568759fb41CAE4934BBd2d04E26"
+        "eth:0xF7209f5471628aC5f68FE4ae98Feb7f02E0f40Be"
      values.$pastUpgrades.7:
+        ["2025-08-22T22:25:59.000Z","0x1d729201879e9035259d12fc58020a8f4dd1cb7c6972f915a6fcef15f89756d6",["eth:0xF7209f5471628aC5f68FE4ae98Feb7f02E0f40Be"]]
      values.$upgradeCount:
-        7
+        8
      implementationNames.eth:0xA0A36095A2258568759fb41CAE4934BBd2d04E26:
-        "OptimismPortal"
      implementationNames.eth:0xF7209f5471628aC5f68FE4ae98Feb7f02E0f40Be:
+        "OptimismPortal"
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.1:
-        "0x889638b8fe1fe5acdc9fc63605747e530d07ef7a0e81c151b0e3f546c24adef9"
+        "0x55baff01a4d31b7dd4257fdb3509fffb44fb2fcc634cb987ae812f322bde0fcf"
      values.$implementation:
-        "eth:0x795277B6aD8778E27aa70813157134cfC4a4D446"
+        "eth:0x83085450544c3F360a40720859EbB1bfd311584D"
      values.$pastUpgrades.2:
+        ["2025-08-22T22:25:59.000Z","0x1d729201879e9035259d12fc58020a8f4dd1cb7c6972f915a6fcef15f89756d6",["eth:0x83085450544c3F360a40720859EbB1bfd311584D"]]
      values.$upgradeCount:
-        2
+        3
      values.resourceConfig.maxTransactionLimit:
-        8
      values.resourceConfig._spacer:
+        8
+++ description: volatility param: lower denominator -> quicker fee changes on L2
      values.eip1559Denominator:
+        0
      values.eip1559Elasticity:
+        0
      implementationNames.eth:0x795277B6aD8778E27aa70813157134cfC4a4D446:
-        "SystemConfig"
      implementationNames.eth:0x83085450544c3F360a40720859EbB1bfd311584D:
+        "SystemConfig"
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      directlyReceivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c","role":"admin"}
    }
```

```diff
-   Status: DELETED
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c)
    +++ description: This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof.
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. Additionally, users can 'escape' their funds after 30d of no state updates by supplying merkle proofs or using a resolver.
      template:
-        "opstack/zircuit/L2OutputOracle"
+        "opstack/zircuit/L2OutputOracle_SP1"
      sourceHashes.1:
-        "0x5c9c6bf3e729a43f2616db0dda98893b4011faf62a7ce137ee88e758028f8047"
+        "0x409b9567c50661b673c0f84e9b8ed470f1ca48bc04fb1c8d09f8cac545e82cf8"
      values.$implementation:
-        "eth:0xb82E8B7B3a93290EE38dB201686AbDc9FDF6A315"
+        "eth:0x6AB82bb139383BB758348fBb81EdA57458e59f65"
      values.$pastUpgrades.6:
+        ["2025-08-22T22:25:59.000Z","0x1d729201879e9035259d12fc58020a8f4dd1cb7c6972f915a6fcef15f89756d6",["eth:0x6AB82bb139383BB758348fBb81EdA57458e59f65"]]
      values.$upgradeCount:
-        6
+        7
      values.systemOwner:
-        "eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      values.verifier:
-        "eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      values.VERIFIER:
-        "eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      values.version:
-        "2.1.0"
+        "3.0.0"
      values.aggregationVkey:
+        "0x008adbf6e7ba087ac0b05572c938b7707400d7b41318efcbc1d7ffbbbed50452"
      values.allowBootstrapKeepalive:
+        false
      values.initializerVersion:
+        2
      values.owner:
+        "eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      values.pendingOwner:
+        "eth:0x0000000000000000000000000000000000000000"
      values.rangeVkeyCommitment:
+        "0x40bc0563112dcc6868037ea0445916342df200ec0152bf7b4c2cca1d640fdaa3"
      values.rollupConfigHash:
+        "0x4443cede364fd50e63d976126c720d4b12b9a608e1005e42f95d619b552a913c"
      values.verifierV3:
+        "eth:0xf35A4088eA0231C44B9DB52D25c0E9E2fEe31f67"
      implementationNames.eth:0xb82E8B7B3a93290EE38dB201686AbDc9FDF6A315:
-        "L2OutputOracle"
      implementationNames.eth:0x6AB82bb139383BB758348fBb81EdA57458e59f65:
+        "L2OutputOracle"
    }
```

```diff
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0xf35A4088eA0231C44B9DB52D25c0E9E2fEe31f67","description":"affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes.","role":".owner"}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c","role":"admin","via":[{"address":"eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0xf35A4088eA0231C44B9DB52D25c0E9E2fEe31f67)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

## Source code changes

```diff
.../L2OutputOracle/L2OutputOracle.sol              |  587 +++++--
 .../OptimismPortal/OptimismPortal.sol              | 1555 +++++++++---------
 .../zircuit/ethereum/.flat/SP1Verifier.sol         |  602 +++++++
 .../zircuit/ethereum/.flat/SP1VerifierGateway.sol  |  278 ++++
 .../SystemConfig/SystemConfig.sol                  |   34 +-
 .../Verifier/Proxy.p.sol => /dev/null              |  201 ---
 .../Verifier/Verifier.sol => /dev/null             | 1643 --------------------
 7 files changed, 2178 insertions(+), 2722 deletions(-)
```

Generated with discovered.json: 0x76067fd761e63e6fb7c665038b0b3c2a5e9f3d8e

# Diff at Thu, 07 Aug 2025 11:45:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@524648be63b628cab1371b61d40517ac331e0e79 block: 1754310248
- current timestamp: 1754567136

## Description

Major upgrade. New escape hatch in case there are no state updates for 30d. Unverified state roots by the operator are allowed after 4h of no new proposed state roots.

Escapes for ETH and ERC20s can be done with state / storage merkle proofs for each account / erc20 balanceOf. DeFi contracts can register 'Resolvers' directly from L2 or by their deployer on L1 who are permissioned to partition a pooled balance of a single L2 contract between multiple users.

[OptimismPortal](https://disco.l2beat.com/diff/eth:0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a/eth:0xA0A36095A2258568759fb41CAE4934BBd2d04E26)
- deposit Exclusions in `encodeSetL1BlockValuesEcotoneExclusions()`
- `escapeETH()` and -WETH added: allows withdrawing full balance after 30 day state update liveness failure (`timeLimitOutputRootSubmissionSeconds`) with state and storage (merkle-) proofs.

[L1StandardBridge](https://disco.l2beat.com/diff/eth:0x506aadcb7bF93E892a43208d879BAc076eBC97Ef/eth:0xFF30d6E9acecc919e4E9e1A2e67980ee44Df6Ebb)
- escapeERC20: escape function after 30d liveness fail for ERC20 tokens

[L2OutputOracle](https://disco.l2beat.com/diff/eth:0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4/eth:0xb82E8B7B3a93290EE38dB201686AbDc9FDF6A315)
- `setTimeLimitOutputRootSubmissionSeconds()` onlyOwner, set escape threshold
- bootstrapV2() still exists (allowing permissioned state proposal without proof after short liveness fail)
- new output root proposal disallowed after `timeLimitOutputRootSubmissionSeconds` has passed
- finality logic for deleting outputs is now `block.timestamp >= finalizationTimestamp && (pausedTimestamp == 0 || pausedTimestamp >= finalizationTimestamp)`

[SuperchainConfig](https://disco.l2beat.com/diff/eth:0xA47314C96ab9572af656788e15143B459F99AE0f/eth:0x70D688D4Bd6B1b195aE51040b54ab501278D1d31)
- support paused timeslot and pausedSince()

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from the host chain to this chain. It also allows to prove and finalize withdrawals. This fork of the standard OP stack contract allows for permissionless 'escaping' of assets with merkle proofs or a resolver if there were no state updates for a time defined by the eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4.
      template:
-        "opstack/OptimismPortal"
+        "opstack/zircuit/OptimismPortal"
      sourceHashes.1:
-        "0x67780cfd4e258f37c824b516a488799359ec5e535fb56f62fbd71765730fa32b"
+        "0xb800094cbe5da9b7c7fb14d9f851fabc0adb88151044c80334d6c6f9cc27cc4b"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from the host chain to this chain. It also allows to prove and finalize withdrawals. This fork of the standard OP stack contract allows for permissionless 'escaping' of assets with merkle proofs or a resolver if there were no state updates for a time defined by the eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4."
      values.$implementation:
-        "eth:0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a"
+        "eth:0xA0A36095A2258568759fb41CAE4934BBd2d04E26"
      values.$pastUpgrades.5:
+        ["2025-08-05T13:35:59.000Z","0x12d1d0dde1bafad169722a0d6a42fafad00cacc19282bc0f7de4ad39b70afed1",["eth:0xE14b12F4843447114A093D99Dc9322b93a967DE6"]]
      values.$pastUpgrades.6:
+        ["2025-08-05T13:35:59.000Z","0x12d1d0dde1bafad169722a0d6a42fafad00cacc19282bc0f7de4ad39b70afed1",["eth:0xA0A36095A2258568759fb41CAE4934BBd2d04E26"]]
      values.$upgradeCount:
-        5
+        7
      values.version:
-        "2.1.0"
+        "2.2.0"
      values.resolverRegistry:
+        "eth:0x6c89104690452AD7e209f0ab72287C2561d5cF0E"
      implementationNames.eth:0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a:
-        "OptimismPortal"
      implementationNames.eth:0xA0A36095A2258568759fb41CAE4934BBd2d04E26:
+        "OptimismPortal"
    }
```

```diff
    contract Zircuit Multisig 2 (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"guard","from":"eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","role":".defaultAdmin"}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","description":"manage roles including the guardian role.","role":".defaultAdmin"}
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from the host chain to this chain. This fork of the standard OP stack contract allows for permissionless 'escaping' of assets with merkle proofs or a resolver if there were no state updates for a configurable time.
      template:
-        "opstack/L1StandardBridge"
+        "opstack/zircuit/L1StandardBridge"
      sourceHashes.1:
-        "0x4da64b64aa2ba04837c58c90080a550f82596377659251b91ef703b0acdb49da"
+        "0x2ffe3729df0a4fa39ab88f1451d7d0023e7f6d680f4a8d025a68111673392470"
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain."
+        "The main entry point to deposit ERC20 tokens from the host chain to this chain. This fork of the standard OP stack contract allows for permissionless 'escaping' of assets with merkle proofs or a resolver if there were no state updates for a configurable time."
      values.$implementation:
-        "eth:0x506aadcb7bF93E892a43208d879BAc076eBC97Ef"
+        "eth:0xFF30d6E9acecc919e4E9e1A2e67980ee44Df6Ebb"
      values.$pastUpgrades.6:
+        ["2025-08-05T13:35:59.000Z","0x12d1d0dde1bafad169722a0d6a42fafad00cacc19282bc0f7de4ad39b70afed1",["eth:0xFF30d6E9acecc919e4E9e1A2e67980ee44Df6Ebb"]]
      values.$upgradeCount:
-        6
+        7
      values.version:
-        "2.2.0"
+        "2.3.0"
      implementationNames.eth:0x506aadcb7bF93E892a43208d879BAc076eBC97Ef:
-        "L1StandardBridge"
      implementationNames.eth:0xFF30d6E9acecc919e4E9e1A2e67980ee44Df6Ebb:
+        "L1StandardBridge"
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x6c89104690452AD7e209f0ab72287C2561d5cF0E","role":"admin"}
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      sourceHashes.1:
-        "0x39037837abcc5e06ffe85b07ad5f5ce901ed8551155a1b3b81cfd181bd683593"
+        "0xf69fa98cc18afd5754767df58a79532b52dab119b14df252fbea558da850139a"
      values.$implementation:
-        "eth:0xA47314C96ab9572af656788e15143B459F99AE0f"
+        "eth:0x70D688D4Bd6B1b195aE51040b54ab501278D1d31"
      values.$pastUpgrades.1:
+        ["2025-08-05T13:35:59.000Z","0x12d1d0dde1bafad169722a0d6a42fafad00cacc19282bc0f7de4ad39b70afed1",["eth:0x70D688D4Bd6B1b195aE51040b54ab501278D1d31"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.1.0"
+        "1.2.0"
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276"]},"MONITOR_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"]}}
      values.monitorAC:
+        ["eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"]
      values.pausedTimestamp:
+        0
      implementationNames.eth:0xA47314C96ab9572af656788e15143B459F99AE0f:
-        "SuperchainConfig"
      implementationNames.eth:0x70D688D4Bd6B1b195aE51040b54ab501278D1d31:
+        "SuperchainConfig"
      template:
+        "opstack/zircuit/SuperchainConfig"
      description:
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system."
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. Additionally, users can 'escape' their funds after 30d of no state updates by supplying merkle proofs or using a resolver.
      sourceHashes.1:
-        "0x60e391caee355fef81909391d0660c897c79e6ba836e46f45d51968313188073"
+        "0x5c9c6bf3e729a43f2616db0dda98893b4011faf62a7ce137ee88e758028f8047"
      values.$implementation:
-        "eth:0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4"
+        "eth:0xb82E8B7B3a93290EE38dB201686AbDc9FDF6A315"
      values.$pastUpgrades.4:
+        ["2025-08-05T13:35:59.000Z","0x12d1d0dde1bafad169722a0d6a42fafad00cacc19282bc0f7de4ad39b70afed1",["eth:0xE14b12F4843447114A093D99Dc9322b93a967DE6"]]
      values.$pastUpgrades.5:
+        ["2025-08-05T13:35:59.000Z","0x12d1d0dde1bafad169722a0d6a42fafad00cacc19282bc0f7de4ad39b70afed1",["eth:0xb82E8B7B3a93290EE38dB201686AbDc9FDF6A315"]]
      values.$upgradeCount:
-        4
+        6
      values.computeL2Timestamp:
-        [1719935831,1719935833,1719935835,1719935837,1719935839]
      values.getL2Output:
-        [["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x6377018657879415a6e998472dc6a28b263a8d6dffdb20f8754d4e3944bc7ee7",1719997259,28],["0x5b51d6381ef6f819d7134be5323374781f3d3f591c552ca39893732df2127984",1719997283,6952],["0xeb12340cbcbc7af2fca27ce389d0162a0cfde9d134bea78a2e538b83ef0faabf",1719997319,6954],["0x55b30b87e1b913e3af502ebe5e12d5df6d4cfd3771b2a3deff43504f9abc8d5f",1719997367,9198]]
      values.getL2OutputAfter:
-        [["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26]]
      values.getL2OutputEx:
-        [[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]]
      values.getL2OutputIndexAfter:
-        [0,0,0,0,0]
      values.getL2OutputRootWithFinalization:
-        [["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719963923],["0x6377018657879415a6e998472dc6a28b263a8d6dffdb20f8754d4e3944bc7ee7",1720011659],["0x5b51d6381ef6f819d7134be5323374781f3d3f591c552ca39893732df2127984",1720011683],["0xeb12340cbcbc7af2fca27ce389d0162a0cfde9d134bea78a2e538b83ef0faabf",1720011719],["0x55b30b87e1b913e3af502ebe5e12d5df6d4cfd3771b2a3deff43504f9abc8d5f",1720011767]]
      values.version:
-        "2.0.0"
+        "2.1.0"
+++ severity: HIGH
      values.deletedOutputs:
+        []
      values.superchainConfig:
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      values.timeLimitOutputRootSubmissionSeconds:
+        2592000
      values.timeLimitOutputRootSubmissionSecondsFmt:
+        "30d"
      values.withdrawalKeepalivePeriodSecondsFmt:
+        "4h"
      errors:
-        {"computeL2Timestamp":"Processing error occurred.","getL2Output":"Processing error occurred.","getL2OutputAfter":"Processing error occurred.","getL2OutputEx":"Processing error occurred.","getL2OutputIndexAfter":"Processing error occurred.","getL2OutputRootWithFinalization":"Processing error occurred."}
      implementationNames.eth:0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4:
-        "L2OutputOracle"
      implementationNames.eth:0xb82E8B7B3a93290EE38dB201686AbDc9FDF6A315:
+        "L2OutputOracle"
      template:
+        "opstack/zircuit/L2OutputOracle"
      description:
+        "Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. Additionally, users can 'escape' their funds after 30d of no state updates by supplying merkle proofs or using a resolver."
      fieldMeta:
+        {"proposer":{"severity":"HIGH"},"challenger":{"severity":"HIGH"},"deletedOutputs":{"severity":"HIGH"}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"challenge","from":"eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4","role":".challenger"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0x6c89104690452AD7e209f0ab72287C2561d5cF0E","role":"admin","via":[{"address":"eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
    }
```

```diff
    EOA  (0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"propose","from":"eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4","role":".proposer"}]
    }
```

```diff
+   Status: CREATED
    contract ResolverRegistry (0x6c89104690452AD7e209f0ab72287C2561d5cF0E)
    +++ description: Registers 'resolvers' which are allowed to supply authoritative data for blockchain balances to support escapes without merkle proofs from e.g. DeFi smart contracts on L2. A resolver can either be registered directly by the respective contract on L2 or by its deployer from L1, using deterministic deployment derivation.
```

## Source code changes

```diff
.../L1StandardBridge/L1StandardBridge.sol          | 1680 +++++++++++++++++++-
 .../L2OutputOracle/L2OutputOracle.sol              |  202 ++-
 .../OptimismPortal/OptimismPortal.sol              |  685 +++++++-
 .../ethereum/.flat/ResolverRegistry/Proxy.p.sol    |  201 +++
 .../.flat/ResolverRegistry/ResolverRegistry.sol    |  670 ++++++++
 .../ZircuitSuperchainConfig/SuperchainConfig.sol   |   20 +-
 6 files changed, 3370 insertions(+), 88 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754310248 (main branch discovery), not current.

```diff
    contract Zircuit Multisig 2 (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"guard","from":"eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","role":".defaultAdmin"}
      receivedPermissions.2:
-        {"permission":"interact","from":"eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","description":"manage roles including the guardian role.","role":".defaultAdmin"}
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      template:
-        "opstack/zircuit/SuperchainConfig"
      description:
-        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system."
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276"]},"MONITOR_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"]}}
      values.monitorAC:
-        ["eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"]
      category:
-        {"name":"Governance","priority":3}
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: None
      template:
-        "opstack/zircuit/L2OutputOracle"
      description:
-        "Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h."
      values.deletedOutputs:
-        []
      values.withdrawalKeepalivePeriodSecondsFmt:
-        "4h"
      values.computeL2Timestamp:
+        [1719935831,1719935833,1719935835,1719935837,1719935839]
      values.getL2Output:
+        [["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x6377018657879415a6e998472dc6a28b263a8d6dffdb20f8754d4e3944bc7ee7",1719997259,28],["0x5b51d6381ef6f819d7134be5323374781f3d3f591c552ca39893732df2127984",1719997283,6952],["0xeb12340cbcbc7af2fca27ce389d0162a0cfde9d134bea78a2e538b83ef0faabf",1719997319,6954],["0x55b30b87e1b913e3af502ebe5e12d5df6d4cfd3771b2a3deff43504f9abc8d5f",1719997367,9198]]
      values.getL2OutputAfter:
+        [["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26],["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719949523,26]]
      values.getL2OutputEx:
+        [[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000000"]]
      values.getL2OutputIndexAfter:
+        [0,0,0,0,0]
      values.getL2OutputRootWithFinalization:
+        [["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719963923],["0x6377018657879415a6e998472dc6a28b263a8d6dffdb20f8754d4e3944bc7ee7",1720011659],["0x5b51d6381ef6f819d7134be5323374781f3d3f591c552ca39893732df2127984",1720011683],["0xeb12340cbcbc7af2fca27ce389d0162a0cfde9d134bea78a2e538b83ef0faabf",1720011719],["0x55b30b87e1b913e3af502ebe5e12d5df6d4cfd3771b2a3deff43504f9abc8d5f",1720011767]]
      fieldMeta:
-        {"proposer":{"severity":"HIGH"},"challenger":{"severity":"HIGH"},"deletedOutputs":{"severity":"HIGH"}}
      category:
-        {"name":"Local Infrastructure","priority":5}
      errors:
+        {"computeL2Timestamp":"Processing error occurred.","getL2Output":"Processing error occurred.","getL2OutputAfter":"Processing error occurred.","getL2OutputEx":"Processing error occurred.","getL2OutputIndexAfter":"Processing error occurred.","getL2OutputRootWithFinalization":"Processing error occurred."}
    }
```

```diff
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"challenge","from":"eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4","role":".challenger"}
    }
```

```diff
    EOA  (0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"propose","from":"eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4","role":".proposer"}]
    }
```

Generated with discovered.json: 0x43d8f819be4802a5593153c469bf89c419e3e13e

# Diff at Mon, 04 Aug 2025 12:35:57 GMT:

- chain: zircuit
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7cc919a780045cf2b13d42712da413a3bff12b3 block: 1753687757
- current timestamp: 1754310248

## Description

add template for L1Block with 'depositExclusions' modification.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753687757 (main branch discovery), not current.

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain. This version though also contains a storage slot for `depositExclusions`.
      template:
+        "opstack/Layer2/L1Block_depositExclusions"
      description:
+        "Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain. This version though also contains a storage slot for `depositExclusions`."
    }
```

Generated with discovered.json: 0x6c419d61eba851803a53aff30c925fa6172cb44e

# Diff at Thu, 31 Jul 2025 13:15:24 GMT:

- chain: zircuit
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@07319d194d312aca8103826b7db44d44613cc7fa block: 1753687757
- current timestamp: 1753687757

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753687757 (main branch discovery), not current.

```diff
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      unverified:
-        true
      values.getOwners:
-        ["zircuit:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4","zircuit:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966","zircuit:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355","zircuit:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4","zircuit:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec","zircuit:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb","zircuit:0x62C688FCa995e07632D64A9586896BB7EcD68567","zircuit:0x38809210f69ed6204E276d2Be6b15cd530698679"]
      values.getThreshold:
-        6
      implementationNames.zircuit:0xC463EaC02572CC964D43D2414023E2c6B62bAF38:
-        ""
+        "GnosisSafeProxy"
      template:
+        "GnosisSafe"
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x430dcebe337cfb1b23b1da86a905add435c1776a

# Diff at Mon, 28 Jul 2025 07:29:30 GMT:

- chain: zircuit
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e540d8d4e2ea097e63a067c52194d1bf06f9b4a block: 15364203
- current block number: 16875771

## Description

L2 fee changes.

## Watched changes

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.basefee:
-        602997202
+        294515603
      values.hash:
-        "0x860409be6049dd06c3bfe74926a7a552c3277fdd865315938507dfb5731814cc"
+        "0x0acc928251b1f6dcdad1a042f1be37ab222eeed394619e6908a57a99301cf5ae"
      values.number:
-        22765716
+        23016159
      values.timestamp:
-        1750664615
+        1753687751
    }
```

Generated with discovered.json: 0xcae768c9c273570cae79fc38d2ad8dfcdac30cbd

# Diff at Wed, 16 Jul 2025 15:01:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@99f4c3c49844de20b37b0c4c9c35d616989eef7d block: 22765709
- current block number: 22765709

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765709 (main branch discovery), not current.

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof.
      values.version:
-        "c3131379c4bf618f2135c29547049b46923f7dca"
+        "eth:0xc3131379C4bf618f2135c29547049B46923F7Dca"
    }
```

Generated with discovered.json: 0xbe1c0bf13bbb959e2231e3043e80b7581c02f432

# Diff at Mon, 14 Jul 2025 12:47:15 GMT:

- chain: zircuit
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 15364203
- current block number: 15364203

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15364203 (main branch discovery), not current.

```diff
    EOA  (0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb) {
    +++ description: None
      address:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "zircuit:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
    }
```

```diff
    EOA  (0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec) {
    +++ description: None
      address:
-        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
+        "zircuit:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
    }
```

```diff
    EOA  (0x38809210f69ed6204E276d2Be6b15cd530698679) {
    +++ description: None
      address:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "zircuit:0x38809210f69ed6204E276d2Be6b15cd530698679"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      address:
-        "0x4200000000000000000000000000000000000015"
+        "zircuit:0x4200000000000000000000000000000000000015"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "zircuit:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "zircuit:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.$pastUpgrades.0.2.0:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "zircuit:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.DEPOSITOR_ACCOUNT:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "zircuit:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
      implementationNames.0x4200000000000000000000000000000000000015:
-        "Proxy"
      implementationNames.0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
-        "L1Block"
      implementationNames.zircuit:0x4200000000000000000000000000000000000015:
+        "Proxy"
      implementationNames.zircuit:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
+        "L1Block"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      address:
-        "0x4200000000000000000000000000000000000018"
+        "zircuit:0x4200000000000000000000000000000000000018"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "zircuit:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
+        "zircuit:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
      values.owner:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "zircuit:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      implementationNames.0x4200000000000000000000000000000000000018:
-        "Proxy"
      implementationNames.0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
-        "ProxyAdmin"
      implementationNames.zircuit:0x4200000000000000000000000000000000000018:
+        "Proxy"
      implementationNames.zircuit:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4) {
    +++ description: None
      address:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "zircuit:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
    }
```

```diff
    EOA  (0x62C688FCa995e07632D64A9586896BB7EcD68567) {
    +++ description: None
      address:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "zircuit:0x62C688FCa995e07632D64A9586896BB7EcD68567"
    }
```

```diff
    EOA  (0x63cbB9fA540F6249AE4A3576f48BF07609b3a355) {
    +++ description: None
      address:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "zircuit:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
    }
```

```diff
    EOA  (0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966) {
    +++ description: None
      address:
-        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
+        "zircuit:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
    }
```

```diff
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      address:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "zircuit:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      values.$implementation:
-        "0x69f4D1788e39c87893C980c06EdF4b7f686e2938"
+        "zircuit:0x69f4D1788e39c87893C980c06EdF4b7f686e2938"
      values.$members.0:
-        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
+        "zircuit:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
      values.$members.1:
-        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
+        "zircuit:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
      values.$members.2:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "zircuit:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.$members.3:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "zircuit:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.$members.4:
-        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
+        "zircuit:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
      values.$members.5:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "zircuit:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.$members.6:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "zircuit:0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.$members.7:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "zircuit:0x38809210f69ed6204E276d2Be6b15cd530698679"
      values.getOwners.0:
-        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
+        "zircuit:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
      values.getOwners.1:
-        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
+        "zircuit:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
      values.getOwners.2:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "zircuit:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.getOwners.3:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "zircuit:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.getOwners.4:
-        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
+        "zircuit:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
      values.getOwners.5:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "zircuit:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.getOwners.6:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "zircuit:0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.getOwners.7:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "zircuit:0x38809210f69ed6204E276d2Be6b15cd530698679"
      implementationNames.0xC463EaC02572CC964D43D2414023E2c6B62bAF38:
-        ""
      implementationNames.0x69f4D1788e39c87893C980c06EdF4b7f686e2938:
-        "GnosisSafe"
      implementationNames.zircuit:0xC463EaC02572CC964D43D2414023E2c6B62bAF38:
+        ""
      implementationNames.zircuit:0x69f4D1788e39c87893C980c06EdF4b7f686e2938:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4) {
    +++ description: None
      address:
-        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
+        "zircuit:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
    }
```

```diff
    EOA  (0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001) {
    +++ description: None
      address:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "zircuit:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
    }
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: None
```

Generated with discovered.json: 0x56ae3c75274c24bb879e367b74714528ca27eee1

# Diff at Mon, 14 Jul 2025 12:47:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22765709
- current block number: 22765709

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765709 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb) {
    +++ description: None
      address:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "eth:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
    }
```

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "eth:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a"
+        "eth:0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a"
      values.$pastUpgrades.0.2.0:
-        "0x8Ab1b1E21c2f229a7bB1430CF3ADfb0644a69ab7"
+        "eth:0x8Ab1b1E21c2f229a7bB1430CF3ADfb0644a69ab7"
      values.$pastUpgrades.1.2.0:
-        "0x304a52C8354f323672191Ebf1347Cd3d494Ea830"
+        "eth:0x304a52C8354f323672191Ebf1347Cd3d494Ea830"
      values.$pastUpgrades.2.2.0:
-        "0xde8B916B972cE3c27C21157Fc2b107c413062b9d"
+        "eth:0xde8B916B972cE3c27C21157Fc2b107c413062b9d"
      values.$pastUpgrades.3.2.0:
-        "0xb6714d9808909b9383B09aD7Ea4Bc7E59b3B0E20"
+        "eth:0xb6714d9808909b9383B09aD7Ea4Bc7E59b3B0E20"
      values.$pastUpgrades.4.2.0:
-        "0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a"
+        "eth:0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a"
      values.guardian:
-        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
+        "eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
      values.l2Oracle:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      values.systemConfig:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "eth:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      implementationNames.0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1:
-        "Proxy"
      implementationNames.0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a:
-        "OptimismPortal"
      implementationNames.eth:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1:
+        "Proxy"
      implementationNames.eth:0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a:
+        "OptimismPortal"
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0xA5B66A9FBCE3d57dA2b3Bd764d0a05B95052f73F"
+        "eth:0xA5B66A9FBCE3d57dA2b3Bd764d0a05B95052f73F"
      values.$pastUpgrades.0.2.0:
-        "0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"
+        "eth:0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"
      values.$pastUpgrades.1.2.0:
-        "0xA5B66A9FBCE3d57dA2b3Bd764d0a05B95052f73F"
+        "eth:0xA5B66A9FBCE3d57dA2b3Bd764d0a05B95052f73F"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "eth:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      values.PORTAL:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "eth:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      values.superchainConfig:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      implementationNames.0x2a721cBE81a128be0F01040e3353c3805A5EA091:
-        "Proxy"
      implementationNames.0xA5B66A9FBCE3d57dA2b3Bd764d0a05B95052f73F:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091:
+        "Proxy"
      implementationNames.eth:0xA5B66A9FBCE3d57dA2b3Bd764d0a05B95052f73F:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract Zircuit Multisig 2 (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      address:
-        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
+        "eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
      values.$implementation:
-        "0x69f4D1788e39c87893C980c06EdF4b7f686e2938"
+        "eth:0x69f4D1788e39c87893C980c06EdF4b7f686e2938"
      values.$members.0:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "eth:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.$members.1:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "eth:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.$members.2:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "eth:0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.$members.3:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "eth:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.$members.4:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "eth:0x38809210f69ed6204E276d2Be6b15cd530698679"
      implementationNames.0x2c0B27F7C8F083B539557a0bA787041BF22DB276:
-        "GnosisSafeProxy"
      implementationNames.0x69f4D1788e39c87893C980c06EdF4b7f686e2938:
-        "GnosisSafe"
      implementationNames.eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276:
+        "GnosisSafeProxy"
      implementationNames.eth:0x69f4D1788e39c87893C980c06EdF4b7f686e2938:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec) {
    +++ description: None
      address:
-        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
+        "eth:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "eth:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0x795277B6aD8778E27aa70813157134cfC4a4D446"
+        "eth:0x795277B6aD8778E27aa70813157134cfC4a4D446"
      values.$pastUpgrades.0.2.0:
-        "0xA03E2f3Ee6dBa20411A2326D7FA9CCCc6a9A53de"
+        "eth:0xA03E2f3Ee6dBa20411A2326D7FA9CCCc6a9A53de"
      values.$pastUpgrades.1.2.0:
-        "0x795277B6aD8778E27aa70813157134cfC4a4D446"
+        "eth:0x795277B6aD8778E27aa70813157134cfC4a4D446"
      values.batcherHash:
-        "0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145"
+        "eth:0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145"
      values.batchInbox:
-        "0xFF00000000000000000000000000000000048900"
+        "eth:0xFF00000000000000000000000000000000048900"
      values.l1CrossDomainMessenger:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      values.l1ERC721Bridge:
-        "0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
+        "eth:0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
      values.l1StandardBridge:
-        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
+        "eth:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      values.l2OutputOracle:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      values.optimismMintableERC20Factory:
-        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "eth:0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
      values.optimismPortal:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "eth:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      values.owner:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      values.sequencerInbox:
-        "0xFF00000000000000000000000000000000048900"
+        "eth:0xFF00000000000000000000000000000000048900"
      values.unsafeBlockSigner:
-        "0xAE8f771E297AAbfDE7ff35a33FB6D558f4E0a679"
+        "eth:0xAE8f771E297AAbfDE7ff35a33FB6D558f4E0a679"
      implementationNames.0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff:
-        "Proxy"
      implementationNames.0x795277B6aD8778E27aa70813157134cfC4a4D446:
-        "SystemConfig"
      implementationNames.eth:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff:
+        "Proxy"
      implementationNames.eth:0x795277B6aD8778E27aa70813157134cfC4a4D446:
+        "SystemConfig"
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
+        "eth:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0x506aadcb7bF93E892a43208d879BAc076eBC97Ef"
+        "eth:0x506aadcb7bF93E892a43208d879BAc076eBC97Ef"
      values.$pastUpgrades.0.2.0:
-        "0x7409668285336dBBe720bE3525AEe372Fce4c2ab"
+        "eth:0x7409668285336dBBe720bE3525AEe372Fce4c2ab"
      values.$pastUpgrades.1.2.0:
-        "0xE14b12F4843447114A093D99Dc9322b93a967DE6"
+        "eth:0xE14b12F4843447114A093D99Dc9322b93a967DE6"
      values.$pastUpgrades.2.2.0:
-        "0x0Fc6203310c494963eBAdd1157780a613B67eCDf"
+        "eth:0x0Fc6203310c494963eBAdd1157780a613B67eCDf"
      values.$pastUpgrades.3.2.0:
-        "0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"
+        "eth:0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"
      values.$pastUpgrades.4.2.0:
-        "0xf829F2B0d741712198Aa3F0Be88b68Ec2aB5024b"
+        "eth:0xf829F2B0d741712198Aa3F0Be88b68Ec2aB5024b"
      values.$pastUpgrades.5.2.0:
-        "0x506aadcb7bF93E892a43208d879BAc076eBC97Ef"
+        "eth:0x506aadcb7bF93E892a43208d879BAc076eBC97Ef"
      values.accessController:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      values.messenger:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      values.MESSENGER:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      implementationNames.0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8:
-        "Proxy"
      implementationNames.0x506aadcb7bF93E892a43208d879BAc076eBC97Ef:
-        "L1StandardBridge"
      implementationNames.eth:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8:
+        "Proxy"
      implementationNames.eth:0x506aadcb7bF93E892a43208d879BAc076eBC97Ef:
+        "L1StandardBridge"
    }
```

```diff
    EOA  (0x38809210f69ed6204E276d2Be6b15cd530698679) {
    +++ description: None
      address:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "eth:0x38809210f69ed6204E276d2Be6b15cd530698679"
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      address:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.owner:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      implementationNames.0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257:
-        "ProxyAdmin"
      implementationNames.eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4) {
    +++ description: None
      address:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "eth:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
    }
```

```diff
    EOA  (0x62C688FCa995e07632D64A9586896BB7EcD68567) {
    +++ description: None
      address:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "eth:0x62C688FCa995e07632D64A9586896BB7EcD68567"
    }
```

```diff
    EOA  (0x63cbB9fA540F6249AE4A3576f48BF07609b3a355) {
    +++ description: None
      address:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "eth:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof.
      address:
-        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
+        "eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e"
+        "eth:0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e"
      values.$pastUpgrades.0.2.0:
-        "0x6a8497798ae8B398608B49b003ECB23aC0756E06"
+        "eth:0x6a8497798ae8B398608B49b003ECB23aC0756E06"
      values.$pastUpgrades.1.2.0:
-        "0xA153Ec874DaB9e6590cFcf4DC3f5bb86FfaC08B9"
+        "eth:0xA153Ec874DaB9e6590cFcf4DC3f5bb86FfaC08B9"
      values.$pastUpgrades.2.2.0:
-        "0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"
+        "eth:0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"
      values.$pastUpgrades.3.2.0:
-        "0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e"
+        "eth:0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e"
      implementationNames.0x6BCe7408c0781dcE7b71494274302D4b75a1447c:
-        "Proxy"
      implementationNames.0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e:
-        "Verifier"
      implementationNames.eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c:
+        "Proxy"
      implementationNames.eth:0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e:
+        "Verifier"
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      address:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0xA47314C96ab9572af656788e15143B459F99AE0f"
+        "eth:0xA47314C96ab9572af656788e15143B459F99AE0f"
      values.$pastUpgrades.0.2.0:
-        "0xA47314C96ab9572af656788e15143B459F99AE0f"
+        "eth:0xA47314C96ab9572af656788e15143B459F99AE0f"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
+        "eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
      values.accessControl.MONITOR_ROLE.members.0:
-        "0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"
+        "eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"
      values.defaultAdmin:
-        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
+        "eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
      values.guardian:
-        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
+        "eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
      values.monitorAC.0:
-        "0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"
+        "eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"
      values.owner:
-        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
+        "eth:0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
      values.pendingDefaultAdmin.newAdmin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0:
-        "Proxy"
      implementationNames.0xA47314C96ab9572af656788e15143B459F99AE0f:
-        "SuperchainConfig"
      implementationNames.eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0:
+        "Proxy"
      implementationNames.eth:0xA47314C96ab9572af656788e15143B459F99AE0f:
+        "SuperchainConfig"
    }
```

```diff
    contract L1ERC20TokenBridge (0x912C7271a6A3622dfb8B218eb46a6122aB046C79) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      address:
-        "0x912C7271a6A3622dfb8B218eb46a6122aB046C79"
+        "eth:0x912C7271a6A3622dfb8B218eb46a6122aB046C79"
      values.$admin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.$implementation:
-        "0x6bc726C993103197C41d787dd72eCd4D2e1614E8"
+        "eth:0x6bc726C993103197C41d787dd72eCd4D2e1614E8"
      values.$pastUpgrades.0.2.0:
-        "0x6bc726C993103197C41d787dd72eCd4D2e1614E8"
+        "eth:0x6bc726C993103197C41d787dd72eCd4D2e1614E8"
      values.l1Token:
-        "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
+        "eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
      values.l2Token:
-        "0xf0e673Bc224A8Ca3ff67a61605814666b1234833"
+        "eth:0xf0e673Bc224A8Ca3ff67a61605814666b1234833"
      values.l2TokenBridge:
-        "0xF4DC271cA48446a5d2b97Ff41D39918DF8A4Eb0e"
+        "eth:0xF4DC271cA48446a5d2b97Ff41D39918DF8A4Eb0e"
      values.messenger:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      values.proxy__getAdmin:
-        "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.proxy__getImplementation:
-        "0x6bc726C993103197C41d787dd72eCd4D2e1614E8"
+        "eth:0x6bc726C993103197C41d787dd72eCd4D2e1614E8"
      implementationNames.0x912C7271a6A3622dfb8B218eb46a6122aB046C79:
-        "OssifiableProxy"
      implementationNames.0x6bc726C993103197C41d787dd72eCd4D2e1614E8:
-        "L1ERC20TokenBridge"
      implementationNames.eth:0x912C7271a6A3622dfb8B218eb46a6122aB046C79:
+        "OssifiableProxy"
      implementationNames.eth:0x6bc726C993103197C41d787dd72eCd4D2e1614E8:
+        "L1ERC20TokenBridge"
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h.
      address:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4"
+        "eth:0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4"
      values.$pastUpgrades.0.2.0:
-        "0xaaF7FCc7252eb739E0001D8727800deAE04A84f1"
+        "eth:0xaaF7FCc7252eb739E0001D8727800deAE04A84f1"
      values.$pastUpgrades.1.2.0:
-        "0x98DFF0828C8f870c31E209f35dF7ed22d194Ea9B"
+        "eth:0x98DFF0828C8f870c31E209f35dF7ed22d194Ea9B"
      values.$pastUpgrades.2.2.0:
-        "0xE14b12F4843447114A093D99Dc9322b93a967DE6"
+        "eth:0xE14b12F4843447114A093D99Dc9322b93a967DE6"
      values.$pastUpgrades.3.2.0:
-        "0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4"
+        "eth:0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4"
+++ severity: HIGH
      values.challenger:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      values.CHALLENGER:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+++ severity: HIGH
      values.proposer:
-        "0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65"
+        "eth:0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65"
      values.PROPOSER:
-        "0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65"
+        "eth:0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65"
      values.systemOwner:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      values.verifier:
-        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
+        "eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      values.VERIFIER:
-        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
+        "eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      values.verifierV2:
-        "0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
+        "eth:0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
      implementationNames.0x92Ef6Af472b39F1b363da45E35530c24619245A4:
-        "Proxy"
      implementationNames.0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4:
-        "L2OutputOracle"
      implementationNames.eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4:
+        "Proxy"
      implementationNames.eth:0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4:
+        "L2OutputOracle"
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
+        "eth:0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0xDF129ECFc63Af454F62b69d03C0f0E21e69bcDAb"
+        "eth:0xDF129ECFc63Af454F62b69d03C0f0E21e69bcDAb"
      values.$pastUpgrades.0.2.0:
-        "0x3B21dC86c412aC34fF4c679497b274509D73cDcC"
+        "eth:0x3B21dC86c412aC34fF4c679497b274509D73cDcC"
      values.$pastUpgrades.1.2.0:
-        "0xDF129ECFc63Af454F62b69d03C0f0E21e69bcDAb"
+        "eth:0xDF129ECFc63Af454F62b69d03C0f0E21e69bcDAb"
      values.messenger:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      values.MESSENGER:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      implementationNames.0x994eEb321F9cD79B077a5455fC248c77f30Dd244:
-        "Proxy"
      implementationNames.0xDF129ECFc63Af454F62b69d03C0f0E21e69bcDAb:
-        "L1ERC721Bridge"
      implementationNames.eth:0x994eEb321F9cD79B077a5455fC248c77f30Dd244:
+        "Proxy"
      implementationNames.eth:0xDF129ECFc63Af454F62b69d03C0f0E21e69bcDAb:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0xAE8f771E297AAbfDE7ff35a33FB6D558f4E0a679) {
    +++ description: None
      address:
-        "0xAE8f771E297AAbfDE7ff35a33FB6D558f4E0a679"
+        "eth:0xAE8f771E297AAbfDE7ff35a33FB6D558f4E0a679"
    }
```

```diff
    EOA  (0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145) {
    +++ description: None
      address:
-        "0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145"
+        "eth:0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145"
    }
```

```diff
    EOA  (0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966) {
    +++ description: None
      address:
-        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
+        "eth:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
    }
```

```diff
    contract VerifierV2 (0xC25D093D3A3f58952252D2e763BEAF2559dc9737) {
    +++ description: ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system.
      address:
-        "0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
+        "eth:0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0"
+        "eth:0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0"
      values.$pastUpgrades.0.2.0:
-        "0xD5B424AC36928E2da7dA9eCA9807938a56988F5a"
+        "eth:0xD5B424AC36928E2da7dA9eCA9807938a56988F5a"
      values.$pastUpgrades.1.2.0:
-        "0x89223192E728a830F09b32d93D51AaC88b6a466e"
+        "eth:0x89223192E728a830F09b32d93D51AaC88b6a466e"
      values.$pastUpgrades.2.2.0:
-        "0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0"
+        "eth:0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0"
      implementationNames.0xC25D093D3A3f58952252D2e763BEAF2559dc9737:
-        "Proxy"
      implementationNames.0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0:
-        "VerifierV2"
      implementationNames.eth:0xC25D093D3A3f58952252D2e763BEAF2559dc9737:
+        "Proxy"
      implementationNames.eth:0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0:
+        "VerifierV2"
    }
```

```diff
    EOA  (0xc3131379C4bf618f2135c29547049B46923F7Dca) {
    +++ description: None
      address:
-        "0xc3131379C4bf618f2135c29547049B46923F7Dca"
+        "eth:0xc3131379C4bf618f2135c29547049B46923F7Dca"
    }
```

```diff
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      address:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
+        "eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      values.$implementation:
-        "0x69f4D1788e39c87893C980c06EdF4b7f686e2938"
+        "eth:0x69f4D1788e39c87893C980c06EdF4b7f686e2938"
      values.$members.0:
-        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
+        "eth:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
      values.$members.1:
-        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
+        "eth:0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
      values.$members.2:
-        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
+        "eth:0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.$members.3:
-        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
+        "eth:0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.$members.4:
-        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
+        "eth:0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
      values.$members.5:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "eth:0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.$members.6:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "eth:0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.$members.7:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "eth:0x38809210f69ed6204E276d2Be6b15cd530698679"
      implementationNames.0xC463EaC02572CC964D43D2414023E2c6B62bAF38:
-        "GnosisSafeProxy"
      implementationNames.0x69f4D1788e39c87893C980c06EdF4b7f686e2938:
-        "GnosisSafe"
      implementationNames.eth:0xC463EaC02572CC964D43D2414023E2c6B62bAF38:
+        "GnosisSafeProxy"
      implementationNames.eth:0x69f4D1788e39c87893C980c06EdF4b7f686e2938:
+        "GnosisSafe"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "eth:0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
      values.$admin:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      values.$implementation:
-        "0xf885DA6A3B4c93905b02f36f9a13680922A554b0"
+        "eth:0xf885DA6A3B4c93905b02f36f9a13680922A554b0"
      values.$pastUpgrades.0.2.0:
-        "0xf885DA6A3B4c93905b02f36f9a13680922A554b0"
+        "eth:0xf885DA6A3B4c93905b02f36f9a13680922A554b0"
      values.bridge:
-        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
+        "eth:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      values.BRIDGE:
-        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
+        "eth:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      implementationNames.0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932:
-        "Proxy"
      implementationNames.0xf885DA6A3B4c93905b02f36f9a13680922A554b0:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932:
+        "Proxy"
      implementationNames.eth:0xf885DA6A3B4c93905b02f36f9a13680922A554b0:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4) {
    +++ description: None
      address:
-        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
+        "eth:0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
    }
```

```diff
    EOA  (0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65) {
    +++ description: None
      address:
-        "0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65"
+        "eth:0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65"
    }
```

```diff
    EOA  (0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5) {
    +++ description: None
      address:
-        "0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"
+        "eth:0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"
    }
```

```diff
    EOA  (0xFF00000000000000000000000000000000048900) {
    +++ description: None
      address:
-        "0xFF00000000000000000000000000000000048900"
+        "eth:0xFF00000000000000000000000000000000048900"
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract Zircuit Multisig 2 (0x2c0B27F7C8F083B539557a0bA787041BF22DB276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c)
    +++ description: This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof.
```

```diff
+   Status: CREATED
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x912C7271a6A3622dfb8B218eb46a6122aB046C79)
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4)
    +++ description: Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract VerifierV2 (0xC25D093D3A3f58952252D2e763BEAF2559dc9737)
    +++ description: ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system.
```

```diff
+   Status: CREATED
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

Generated with discovered.json: 0x32d32e672e62fd1710e084091a306372cb27511f

# Diff at Mon, 14 Jul 2025 08:02:47 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22765709
- current block number: 22765709

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765709 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xc0acab0068ff6dddf7f305bac3f2f8083b9b49e0

# Diff at Fri, 04 Jul 2025 12:19:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22765709
- current block number: 22765709

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22765709 (main branch discovery), not current.

```diff
    contract Zircuit Multisig 2 (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "eth:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      receivedPermissions.1.from:
-        "ethereum:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      receivedPermissions.2.from:
-        "ethereum:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "eth:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "eth:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
+        "eth:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
+        "eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      directlyReceivedPermissions.7.from:
-        "ethereum:0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
+        "eth:0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
+        "eth:0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "eth:0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
    }
```

```diff
    EOA  (0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "eth:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
    }
```

```diff
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.1.from:
-        "ethereum:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "eth:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.2.from:
-        "ethereum:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "eth:0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.3.from:
-        "ethereum:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "eth:0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.4.from:
-        "ethereum:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "eth:0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.5.from:
-        "ethereum:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
+        "eth:0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.6.from:
-        "ethereum:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
+        "eth:0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.7.from:
-        "ethereum:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.8.from:
-        "ethereum:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.9.from:
-        "ethereum:0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
+        "eth:0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
      receivedPermissions.10.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.10.from:
-        "ethereum:0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
+        "eth:0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
      receivedPermissions.11.via.0.address:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      receivedPermissions.11.from:
-        "ethereum:0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "eth:0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "eth:0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
    }
```

```diff
    EOA  (0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "eth:0x92Ef6Af472b39F1b363da45E35530c24619245A4"
    }
```

```diff
    EOA  (0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "eth:0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
    }
```

Generated with discovered.json: 0xbd450b3f35a7b0056ce53fc700a0d37142d8ba1f

# Diff at Mon, 23 Jun 2025 07:43:45 GMT:

- chain: zircuit
- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 15364203

## Description

Initial discovery to check L1->L2 exclusions.

## Initial discovery

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: None
```

Generated with discovered.json: 0x127e555543ac121bf9aa7f46782d5ce0699bd0e0

# Diff at Wed, 18 Jun 2025 11:51:49 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22438012
- current block number: 22731151

## Description

New verifier with new digest/vKey. No change to the backdoor / dummy proofs in the other active verifier.

## Watched changes

```diff
    contract VerifierV2 (0xC25D093D3A3f58952252D2e763BEAF2559dc9737) {
    +++ description: ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system.
      sourceHashes.0:
-        "0x3d0ebf0f8aafb6672ca85a4e9b3f8c912466ace744a78b5749a0b763bdc7876b"
+        "0x709abb48f790c58a1517d5b15d470a3b3058adc8ff1953bb2764302ffd552c1b"
      values.$implementation:
-        "0x89223192E728a830F09b32d93D51AaC88b6a466e"
+        "0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0"
      values.$pastUpgrades.2:
+        ["2025-05-07T18:25:23.000Z","0x19f086f222696bf287600d456e602d10dd4a1db43027e97262e1abb52f347570",["0x89223192E728a830F09b32d93D51AaC88b6a466e"]]
      values.$pastUpgrades.1.2:
-        "0x19f086f222696bf287600d456e602d10dd4a1db43027e97262e1abb52f347570"
+        "0x273c02e325a3bd80d508d1b259225e739853611a87491e1bbb1642141a6b1612"
      values.$pastUpgrades.1.1:
-        "2025-05-07T18:25:23.000Z"
+        "2025-06-11T21:09:23.000Z"
      values.$pastUpgrades.1.0.0:
-        "0x89223192E728a830F09b32d93D51AaC88b6a466e"
+        "0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0"
      values.$upgradeCount:
-        2
+        3
      values.digest:
-        "0x1adec13f00764ae27bbb7ba225b373bc80f120f4c4c0125619c4dd74b18ceb43"
+        "0x167f5fa574c6c6d9dec2cca7c084f607c905044487a03eb3290089b218bd1f0f"
      implementationNames.0x89223192E728a830F09b32d93D51AaC88b6a466e:
-        "VerifierV2"
      implementationNames.0x5d4F36e70Ab3Ccd8cA898A06C2D725B22A1D57f0:
+        "VerifierV2"
      template:
+        "opstack/zircuit/Verifier"
      description:
+        "ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

## Source code changes

```diff
.../VerifierV2/VerifierV2.sol                      | 1171 +++++++++++++++-----
 1 file changed, 923 insertions(+), 248 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22438012 (main branch discovery), not current.

```diff
    contract VerifierV2 (0xC25D093D3A3f58952252D2e763BEAF2559dc9737) {
    +++ description: None
      template:
-        "opstack/zircuit/Verifier"
      description:
-        "ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system."
      category:
-        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x7d3ec8c8969a7dc080398d70e5ea7d34d1f6f96c

# Diff at Fri, 30 May 2025 07:18:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22438012
- current block number: 22438012

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22438012 (main branch discovery), not current.

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x86ed0b06350426d378e5711e220c3182fd14bfcd

# Diff at Fri, 23 May 2025 09:41:08 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22438012
- current block number: 22438012

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22438012 (main branch discovery), not current.

```diff
    contract Zircuit Multisig 2 (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      receivedPermissions.2.role:
+        ".guardian"
      receivedPermissions.1.role:
+        ".defaultAdmin"
      receivedPermissions.0.role:
+        ".defaultAdmin"
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

```diff
    EOA  (0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      receivedPermissions.11.permission:
-        "challenge"
+        "upgrade"
      receivedPermissions.11.from:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.11.via:
+        [{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]
      receivedPermissions.10.from:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.from:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.from:
-        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
+        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
+        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.from:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.permission:
-        "upgrade"
+        "challenge"
      receivedPermissions.5.from:
-        "0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
+        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.5.via:
-        [{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]
      receivedPermissions.5.role:
+        ".challenger"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.3.from:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
      receivedPermissions.3.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.3.via:
+        [{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]
      receivedPermissions.2.from:
-        "0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
+        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      receivedPermissions.1.via:
-        [{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65) {
    +++ description: None
      receivedPermissions.0.role:
+        ".proposer"
    }
```

```diff
    EOA  (0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5) {
    +++ description: None
      receivedPermissions.0.role:
+        ".monitorAC"
    }
```

Generated with discovered.json: 0x381d17d6400c3cc5d7595351dc5eb597d07428ea

# Diff at Thu, 08 May 2025 09:49:03 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22337725
- current block number: 22438012

## Description

Minor upgrade to SystemConfig and the VerifierV2.

## Watched changes

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes.0:
-        "0x06f2d961bb4a244d73779f83003fd66fcda3cc297693cd348d8ac1aa8c29dc63"
+        "0x889638b8fe1fe5acdc9fc63605747e530d07ef7a0e81c151b0e3f546c24adef9"
      values.$implementation:
-        "0xA03E2f3Ee6dBa20411A2326D7FA9CCCc6a9A53de"
+        "0x795277B6aD8778E27aa70813157134cfC4a4D446"
      values.$pastUpgrades.1:
+        ["2025-05-07T18:25:23.000Z","0x19f086f222696bf287600d456e602d10dd4a1db43027e97262e1abb52f347570",["0x795277B6aD8778E27aa70813157134cfC4a4D446"]]
      values.$upgradeCount:
-        1
+        2
      values.operatorFeeConstant:
+        0
      values.operatorFeeScalar:
+        0
      implementationNames.0xA03E2f3Ee6dBa20411A2326D7FA9CCCc6a9A53de:
-        "SystemConfig"
      implementationNames.0x795277B6aD8778E27aa70813157134cfC4a4D446:
+        "SystemConfig"
    }
```

```diff
    contract VerifierV2 (0xC25D093D3A3f58952252D2e763BEAF2559dc9737) {
    +++ description: ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system.
      sourceHashes.0:
-        "0xaf075d81d9fd983d155a21617c104cfab25f4ad9e8f039fd8a15c1220e3d6227"
+        "0x3d0ebf0f8aafb6672ca85a4e9b3f8c912466ace744a78b5749a0b763bdc7876b"
      values.$implementation:
-        "0xD5B424AC36928E2da7dA9eCA9807938a56988F5a"
+        "0x89223192E728a830F09b32d93D51AaC88b6a466e"
      values.$pastUpgrades.1:
+        ["2025-05-07T18:25:23.000Z","0x19f086f222696bf287600d456e602d10dd4a1db43027e97262e1abb52f347570",["0x89223192E728a830F09b32d93D51AaC88b6a466e"]]
      values.$upgradeCount:
-        1
+        2
      values.digest:
-        "0x1d544a5de23a23d1e94ae793352208593bfa28c3d76d455f09ea3f9c25c402b8"
+        "0x1adec13f00764ae27bbb7ba225b373bc80f120f4c4c0125619c4dd74b18ceb43"
      implementationNames.0xD5B424AC36928E2da7dA9eCA9807938a56988F5a:
-        "VerifierV2"
      implementationNames.0x89223192E728a830F09b32d93D51AaC88b6a466e:
+        "VerifierV2"
    }
```

## Source code changes

```diff
.../SystemConfig/SystemConfig.sol                  | 67 +++++++++++++++++-----
 .../VerifierV2/VerifierV2.sol                      | 10 ++--
 2 files changed, 59 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0x8a73ea6e8003d3fc90a43a72458e805def58c8e9

# Diff at Tue, 29 Apr 2025 08:19:16 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22337725
- current block number: 22337725

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22337725 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x2c0B27F7C8F083B539557a0bA787041BF22DB276","via":[]},{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145","via":[]},{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x2c0B27F7C8F083B539557a0bA787041BF22DB276","via":[]},{"permission":"guard","to":"0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5","via":[]},{"permission":"interact","to":"0x2c0B27F7C8F083B539557a0bA787041BF22DB276","description":"manage roles including the guardian role.","via":[]},{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h.
      issuedPermissions:
-        [{"permission":"challenge","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[]},{"permission":"propose","to":"0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65","via":[]},{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract VerifierV2 (0xC25D093D3A3f58952252D2e763BEAF2559dc9737) {
    +++ description: ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}]
    }
```

Generated with discovered.json: 0xad866826772fccc82cf7b232810d6d2fc79170b7

# Diff at Thu, 24 Apr 2025 08:37:55 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f3ec8b7fe4d902b94844aa2f7ddfb2affe4f3f61 block: 22029918
- current block number: 22337725

## Description

Upgrades to most system contracts with minor changes:
- 7702 compatibility
- library (Math)
- gas limit and l2 gas calculations

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes.0:
-        "0xb7c0fa59b37014e507a0e86791007823e5a5548fe3523b6fcf3fb383c0e8c24e"
+        "0x67780cfd4e258f37c824b516a488799359ec5e535fb56f62fbd71765730fa32b"
      values.$implementation:
-        "0xb6714d9808909b9383B09aD7Ea4Bc7E59b3B0E20"
+        "0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a"
      values.$pastUpgrades.4:
+        ["2024-07-16T08:48:59.000Z","0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196",["0x304a52C8354f323672191Ebf1347Cd3d494Ea830"]]
      values.$pastUpgrades.3.2:
-        ["0x304a52C8354f323672191Ebf1347Cd3d494Ea830"]
+        "2024-07-17T12:11:35.000Z"
      values.$pastUpgrades.3.1:
-        "2024-07-16T08:48:59.000Z"
+        "0x472c4b57b3828c3f8a846702da5707eccb216d672b4ede4eb4186ffe606b14b3"
      values.$pastUpgrades.3.0:
-        "0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196"
+        ["0xde8B916B972cE3c27C21157Fc2b107c413062b9d"]
      values.$pastUpgrades.2.2:
-        "2024-07-17T12:11:35.000Z"
+        "2025-04-23T14:46:59.000Z"
      values.$pastUpgrades.2.1:
-        "0x472c4b57b3828c3f8a846702da5707eccb216d672b4ede4eb4186ffe606b14b3"
+        ["0x6335a030fdCBa6c5704a74EF3BeDdd6550c0375a"]
      values.$pastUpgrades.2.0:
-        ["0xde8B916B972cE3c27C21157Fc2b107c413062b9d"]
+        "0xe9ed64d1dc4bf02f583f912b831f46ae873996b36901c3b1180ac56c710e1d6f"
      values.$upgradeCount:
-        4
+        5
      values.version:
-        "2.0.2"
+        "2.1.0"
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes.0:
-        "0x1e3673770550301c22eadd847cc822cfbc995c36019d1dfce07b2ec9cffd930f"
+        "0x931681cb03b7ea6b4521cf57be98c5303f045f088c4cb9e282b889be911da623"
      values.$implementation:
-        "0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"
+        "0xA5B66A9FBCE3d57dA2b3Bd764d0a05B95052f73F"
      values.$pastUpgrades.1:
+        ["2024-07-02T16:12:35.000Z","0xba20c00dc03b009737ebbcaa3db1263524a1322c5984a4f51fbf7c4ebc979575",["0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"]]
      values.$pastUpgrades.0.2:
-        "0xba20c00dc03b009737ebbcaa3db1263524a1322c5984a4f51fbf7c4ebc979575"
+        "2025-04-23T14:46:59.000Z"
      values.$pastUpgrades.0.1:
-        "2024-07-02T16:12:35.000Z"
+        ["0xA5B66A9FBCE3d57dA2b3Bd764d0a05B95052f73F"]
      values.$pastUpgrades.0.0:
-        ["0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"]
+        "0xe9ed64d1dc4bf02f583f912b831f46ae873996b36901c3b1180ac56c710e1d6f"
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "2.3.0"
+        "2.4.0"
      values.ENCODING_OVERHEAD:
+        260
      values.FLOOR_CALLDATA_OVERHEAD:
+        40
      values.TX_BASE_GAS:
+        21000
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.minimumGasLimit:
-        9000000
+        7000000
      values.resourceConfig.maxResourceLimit:
-        8000000
+        6000000
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.0:
-        "0x751d149755c8de663c6b1eb488f5d145ad3e9aa81561545e375a6cb8adbd0f6c"
+        "0x4da64b64aa2ba04837c58c90080a550f82596377659251b91ef703b0acdb49da"
      values.$implementation:
-        "0xf829F2B0d741712198Aa3F0Be88b68Ec2aB5024b"
+        "0x506aadcb7bF93E892a43208d879BAc076eBC97Ef"
      values.$pastUpgrades.5:
+        ["2024-07-16T08:48:59.000Z","0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196",["0xE14b12F4843447114A093D99Dc9322b93a967DE6"]]
      values.$pastUpgrades.4.2.0:
-        "0xE14b12F4843447114A093D99Dc9322b93a967DE6"
+        "0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"
      values.$pastUpgrades.4.1:
-        "2024-07-16T08:48:59.000Z"
+        "2024-07-17T12:11:35.000Z"
      values.$pastUpgrades.4.0:
-        "0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196"
+        "0x472c4b57b3828c3f8a846702da5707eccb216d672b4ede4eb4186ffe606b14b3"
      values.$pastUpgrades.3.2.0:
-        "0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"
+        "0x7409668285336dBBe720bE3525AEe372Fce4c2ab"
      values.$pastUpgrades.3.1:
-        "2024-07-17T12:11:35.000Z"
+        "2024-07-02T16:11:59.000Z"
      values.$pastUpgrades.3.0:
-        "0x472c4b57b3828c3f8a846702da5707eccb216d672b4ede4eb4186ffe606b14b3"
+        "0xd13642194be1a1b8947f8d3cd1504ec56ca67f4ba953cc45e4f135fb118a46f7"
      values.$pastUpgrades.2.2:
-        ["0x7409668285336dBBe720bE3525AEe372Fce4c2ab"]
+        "2024-07-16T08:48:59.000Z"
      values.$pastUpgrades.2.1:
-        "2024-07-02T16:11:59.000Z"
+        "0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196"
      values.$pastUpgrades.2.0:
-        "0xd13642194be1a1b8947f8d3cd1504ec56ca67f4ba953cc45e4f135fb118a46f7"
+        ["0x0Fc6203310c494963eBAdd1157780a613B67eCDf"]
      values.$pastUpgrades.1.2:
-        "2024-07-16T08:48:59.000Z"
+        "2025-04-23T14:46:59.000Z"
      values.$pastUpgrades.1.1:
-        "0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196"
+        "0xe9ed64d1dc4bf02f583f912b831f46ae873996b36901c3b1180ac56c710e1d6f"
      values.$pastUpgrades.1.0.0:
-        "0x0Fc6203310c494963eBAdd1157780a613B67eCDf"
+        "0x506aadcb7bF93E892a43208d879BAc076eBC97Ef"
      values.$upgradeCount:
-        5
+        6
      values.version:
-        "2.1.0"
+        "2.2.0"
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes.0:
-        "0x7328459427570e205526a415613989750227c38d95138613a718c573132fdd17"
+        "0x937e394859daaa4d66de4cbe3e6770d80adf639ecc5d3394774676870cda8d62"
      values.$implementation:
-        "0x3B21dC86c412aC34fF4c679497b274509D73cDcC"
+        "0xDF129ECFc63Af454F62b69d03C0f0E21e69bcDAb"
      values.$pastUpgrades.1:
+        ["2025-04-23T14:46:59.000Z","0xe9ed64d1dc4bf02f583f912b831f46ae873996b36901c3b1180ac56c710e1d6f",["0xDF129ECFc63Af454F62b69d03C0f0E21e69bcDAb"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "2.1.0"
+        "2.2.0"
    }
```

## Source code changes

```diff
.../L1CrossDomainMessenger.sol                     | 504 ++++++++++++++++++++-
 .../L1ERC721Bridge/L1ERC721Bridge.sol              |  34 +-
 .../L1StandardBridge/L1StandardBridge.sol          |  28 +-
 .../OptimismPortal/OptimismPortal.sol              |  37 +-
 4 files changed, 557 insertions(+), 46 deletions(-)
```

Generated with discovered.json: 0x8b1025d2cfd986891f8457295fc23c3cb43e74f3

# Diff at Wed, 19 Mar 2025 13:05:56 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 22029918
- current block number: 22029918

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22029918 (main branch discovery), not current.

```diff
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x8b07abbfd95be79e39621b828a3c2ab00f2bc20b

# Diff at Tue, 18 Mar 2025 08:14:38 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22029918
- current block number: 22029918

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22029918 (main branch discovery), not current.

```diff
    contract Zircuit Multisig 2 (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      name:
-        "ZircuitMultiSig2"
+        "Zircuit Multisig 2"
    }
```

```diff
    contract Zircuit Multisig 1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      name:
-        "ZircuitMultiSig1"
+        "Zircuit Multisig 1"
    }
```

Generated with discovered.json: 0xab85a9cfa4221858d53762489826288c2ca5059a

# Diff at Wed, 12 Mar 2025 10:21:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d56fc86cf5944647644b8653ca9717b11d4adae8 block: 22022908
- current block number: 22029918

## Description

Zircuit has transitioned to the new Verifier, which does not allow dummy proofs. The old verifier cannot be used anymore. The backdoor for proofless state updates in the L2OutputOracle is still present.

Changed the category to ZK Rollup.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22022908 (main branch discovery), not current.

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof.
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h.
      description:
-        "Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. This contract also supports dummy proofs via the old 0x6BCe7408c0781dcE7b71494274302D4b75a1447c until a migration to the new 0xC25D093D3A3f58952252D2e763BEAF2559dc9737 has been manually executed."
+        "Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h."
      values.getL2OutputEx:
-        []
      values.getL2OutputExLatest:
-        "EXPECT_REVERT"
      fieldMeta.getL2OutputExLatest:
-        {"severity":"HIGH","description":"As soon as this returns a value, Zircuit has transitioned to the v2 verifier. Remove the v1 verifier description string from the contract template."}
    }
```

Generated with discovered.json: 0x7910094b1e0b0816459fe74dd6ff06e3524e684f

# Diff at Tue, 11 Mar 2025 11:59:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a75ac906056abb236c14b626853813f468099f57 block: 21829908
- current block number: 22022908

## Description

as a part of [the Garfield mainnet upgrade](https://www.zircuit.com/blog/zircuit-technical-roadmap-part-i-performant-provers), a new verifier without dummy proof support is deployed. This upgrade only affects L2OutputOracle and the associated proof system. 

### L2OutputOracle

- `proposeL2OutputV2()`, `verifyV2()` added. these target the new verifierV2 which does not accept empty proofs like the previous one
- `bootstrapV2()` added: this fn is a permissioned switch to migrate from the old to the new verifier. but it can also be called after already having migrated by the permissioned proposer if `withdrawalKeepalivePeriodSeconds` have passed without any state update. can be used as a backdoor because it accepts l2 outputs without proof.

## Watched changes

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.minimumGasLimit:
-        21000000
+        9000000
      values.resourceConfig.maxResourceLimit:
-        20000000
+        8000000
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"}
      directlyReceivedPermissions.8.from:
-        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. This contract also supports dummy proofs via the old 0x6BCe7408c0781dcE7b71494274302D4b75a1447c until a migration to the new 0xC25D093D3A3f58952252D2e763BEAF2559dc9737 has been manually executed.
      template:
-        "opstack/L2OutputOracle"
+        "opstack/zircuit/L2OutputOracle"
      sourceHashes.1:
-        "0x3190c62a59b62169498d1f61c08c5c722c70cc0a6aaa37b185fd3f8014941b96"
+        "0x60e391caee355fef81909391d0660c897c79e6ba836e46f45d51968313188073"
      description:
-        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
+        "Entrypoint for permissioned proposers to propose new L2 outputs (state roots). New proposals have to be accompanied by a zk-SNARK proof of a correct state transition, but there currently is a backdoor that lets this contract accept a state root without proof if the operator has not updated the state in 4h. This contract also supports dummy proofs via the old 0x6BCe7408c0781dcE7b71494274302D4b75a1447c until a migration to the new 0xC25D093D3A3f58952252D2e763BEAF2559dc9737 has been manually executed."
      values.$implementation:
-        "0x98DFF0828C8f870c31E209f35dF7ed22d194Ea9B"
+        "0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4"
      values.$pastUpgrades.3:
+        ["2025-03-11T01:01:59.000Z","0x82c8840f615a9681634471d0ca91ae7ab00e483dbc01dbf4b16a0efe042c7e2a",["0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4"]]
      values.$pastUpgrades.2:
+        ["2025-03-11T01:01:59.000Z","0x82c8840f615a9681634471d0ca91ae7ab00e483dbc01dbf4b16a0efe042c7e2a",["0xE14b12F4843447114A093D99Dc9322b93a967DE6"]]
      values.$upgradeCount:
-        2
+        4
      values.getL2OutputRootWithFinalization:
-        [["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719963923],["0x6377018657879415a6e998472dc6a28b263a8d6dffdb20f8754d4e3944bc7ee7",1720011659],["0x5b51d6381ef6f819d7134be5323374781f3d3f591c552ca39893732df2127984",1720011683],["0xeb12340cbcbc7af2fca27ce389d0162a0cfde9d134bea78a2e538b83ef0faabf",1720011719],["0x55b30b87e1b913e3af502ebe5e12d5df6d4cfd3771b2a3deff43504f9abc8d5f",1720011767]]
      values.SUBMISSION_INTERVAL:
-        1
      values.submissionInterval:
-        1
      values.version:
-        "1.4.0"
+        "2.0.0"
      values.getL2OutputEx:
+        []
+++ description: As soon as this returns a value, Zircuit has transitioned to the v2 verifier. Remove the v1 verifier description string from the contract template.
+++ severity: HIGH
      values.getL2OutputExLatest:
+        "EXPECT_REVERT"
      values.l2ChainId:
+        48900
      values.verifierV2:
+        "0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
      values.withdrawalKeepalivePeriodSeconds:
+        14400
      values.withdrawalKeepalivePeriodSecondsFmt:
+        "4h"
      errors:
-        {"getL2OutputRootWithFinalization":"Processing error occurred."}
      fieldMeta.FINALIZATION_PERIOD_SECONDS:
-        {"description":"Challenge period (Number of seconds until a state root is finalized)."}
      fieldMeta.getL2OutputExLatest:
+        {"severity":"HIGH","description":"As soon as this returns a value, Zircuit has transitioned to the v2 verifier. Remove the v1 verifier description string from the contract template."}
    }
```

```diff
    contract ZircuitMultiSig1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","from":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.10.from:
-        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "0xC25D093D3A3f58952252D2e763BEAF2559dc9737"
    }
```

```diff
+   Status: CREATED
    contract VerifierV2 (0xC25D093D3A3f58952252D2e763BEAF2559dc9737)
    +++ description: ZK verifier that verifies zk-SNARKs using the PLONK proving system to prove correct EVM state transitions. Core of the proof system.
```

## Source code changes

```diff
.../L2OutputOracle/L2OutputOracle.sol              |  323 ++++-
 .../zircuit/ethereum/.flat/VerifierV2/Proxy.p.sol  |  201 +++
 .../ethereum/.flat/VerifierV2/VerifierV2.sol       | 1498 ++++++++++++++++++++
 3 files changed, 2003 insertions(+), 19 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829908 (main branch discovery), not current.

```diff
    contract ZircuitMultiSig2 (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      name:
-        "ZircuitGuardianMultiSig"
+        "ZircuitMultiSig2"
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig_zircuit"
+        "opstack/zircuit/SuperchainConfig"
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.getL2OutputRootWithFinalization:
+        [["0x2e746edcf4ff072457c6b8d6297c74251da7bf649ca04bcd2d30ca1a4e6ab292",1719963923],["0x6377018657879415a6e998472dc6a28b263a8d6dffdb20f8754d4e3944bc7ee7",1720011659],["0x5b51d6381ef6f819d7134be5323374781f3d3f591c552ca39893732df2127984",1720011683],["0xeb12340cbcbc7af2fca27ce389d0162a0cfde9d134bea78a2e538b83ef0faabf",1720011719],["0x55b30b87e1b913e3af502ebe5e12d5df6d4cfd3771b2a3deff43504f9abc8d5f",1720011767]]
      errors:
+        {"getL2OutputRootWithFinalization":"Processing error occurred."}
    }
```

```diff
    contract ZircuitMultiSig1 (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      name:
-        "ZircuitAdminMultiSig"
+        "ZircuitMultiSig1"
    }
```

Generated with discovered.json: 0x08612676f8b73c8e0f95dafaf09c8f38fe7472bb

# Diff at Tue, 04 Mar 2025 11:26:53 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21829908
- current block number: 21829908

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829908 (main branch discovery), not current.

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x687c1db49561c838dbea1691a639e367c670584e

# Diff at Tue, 04 Mar 2025 10:40:15 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21829908
- current block number: 21829908

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829908 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20219921
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20219927
    }
```

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      sinceBlock:
+        20219691
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20219924
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20219925
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      sinceBlock:
+        20219915
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof.
      sinceBlock:
+        20219930
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      sinceBlock:
+        20219917
    }
```

```diff
    contract L1ERC20TokenBridge (0x912C7271a6A3622dfb8B218eb46a6122aB046C79) {
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
      sinceBlock:
+        20771597
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20219923
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20219929
    }
```

```diff
    contract ZircuitAdminMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      sinceBlock:
+        20219688
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20219928
    }
```

Generated with discovered.json: 0x7f675caaa2185f631ea768abe2b8e224cae185c2

# Diff at Wed, 26 Feb 2025 10:33:17 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21829908
- current block number: 21829908

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829908 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xdba32a5975538f5a659ecb1c0507aa9f3fe806a8

# Diff at Fri, 21 Feb 2025 14:12:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21829908
- current block number: 21829908

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829908 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ZircuitAdminMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x91c227cc6de096996cdb48c7dda94a83d022f9f2

# Diff at Fri, 21 Feb 2025 09:00:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21829908
- current block number: 21829908

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21829908 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0xfe3a9754dd0fadd8fa303ab31b906672b3a0dc2d

# Diff at Wed, 12 Feb 2025 11:31:38 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@554a6f0e6aa688c758b37653d0be7eb446f9152e block: 21773698
- current block number: 21829908

## Description

System contracts upgrade:

OptimismPortal, L1StandardBridge: transferThrottle removed.

L2OutputOracle: `getL2OutputRootWithFinalization()` added which independently from the OptiPortal returns the finalization status of state roots.

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
-        "opstack/OptimismPortal_zircuit"
+        "opstack/OptimismPortal"
      sourceHashes.1:
-        "0x9388575e8cf83880125e7770a596c83a0ad9c191b71f1990544987cbd0dbd4c0"
+        "0xb7c0fa59b37014e507a0e86791007823e5a5548fe3523b6fcf3fb383c0e8c24e"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version of the OptimismPortal has inbuilt flow controls that can throttle eth deposits and withdrawals automatically based on volume over time."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
      values.$implementation:
-        "0xde8B916B972cE3c27C21157Fc2b107c413062b9d"
+        "0xb6714d9808909b9383B09aD7Ea4Bc7E59b3B0E20"
      values.$pastUpgrades.3:
+        ["2025-02-12T09:23:47.000Z","0x19e7944c32b28126488482597f707797b60c4c3201abacdba5b9ea00b31cfbb4",["0xb6714d9808909b9383B09aD7Ea4Bc7E59b3B0E20"]]
      values.$upgradeCount:
-        3
+        4
      values.ethThrottleDeposits:
-        {"maxAmountPerPeriod":0,"periodLength":0,"maxAmountTotal":0}
      values.ethThrottleWithdrawals:
-        {"maxAmountPerPeriod":0,"periodLength":3600,"maxAmountTotal":0}
      values.getEthThrottleDepositsCredits:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.getEthThrottleWithdrawalsCredits:
-        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      values.version:
-        "1.8.0"
+        "2.0.2"
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sourceHashes.1:
-        "0x3a72e01a50e4baf0c333aa3ad2413675a95c2fc68a18d8a95b3a65179e98ccbc"
+        "0x751d149755c8de663c6b1eb488f5d145ad3e9aa81561545e375a6cb8adbd0f6c"
      values.$implementation:
-        "0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"
+        "0xf829F2B0d741712198Aa3F0Be88b68Ec2aB5024b"
      values.$pastUpgrades.4:
+        ["2025-02-12T09:23:47.000Z","0x19e7944c32b28126488482597f707797b60c4c3201abacdba5b9ea00b31cfbb4",["0xf829F2B0d741712198Aa3F0Be88b68Ec2aB5024b"]]
      values.$upgradeCount:
-        4
+        5
      values.ethThrottleDeposits:
-        {"maxAmountPerPeriod":0,"periodLength":2592000,"maxAmountTotal":0}
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes.1:
-        "0x2f020370d4312debb7d9c97dbf80a48a0a0ee81d261d6d239d6b01d0dd076c81"
+        "0x3190c62a59b62169498d1f61c08c5c722c70cc0a6aaa37b185fd3f8014941b96"
      values.$implementation:
-        "0xaaF7FCc7252eb739E0001D8727800deAE04A84f1"
+        "0x98DFF0828C8f870c31E209f35dF7ed22d194Ea9B"
      values.$pastUpgrades.1:
+        ["2025-02-12T09:23:47.000Z","0x19e7944c32b28126488482597f707797b60c4c3201abacdba5b9ea00b31cfbb4",["0x98DFF0828C8f870c31E209f35dF7ed22d194Ea9B"]]
      values.$upgradeCount:
-        1
+        2
    }
```

## Source code changes

```diff
.../L1StandardBridge/L1StandardBridge.sol          | 254 +----------------
 .../L2OutputOracle/L2OutputOracle.sol              |  17 +-
 .../OptimismPortal/OptimismPortal.sol              | 305 ++++-----------------
 3 files changed, 75 insertions(+), 501 deletions(-)
```

Generated with discovered.json: 0xa003963723669f119d203a3b20c3a145fe8ba7eb

# Diff at Mon, 10 Feb 2025 19:05:05 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21773698
- current block number: 21773698

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21773698 (main branch discovery), not current.

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x5bdcadeb20b8e969cf7891011d814b99f257ad2d

# Diff at Tue, 04 Feb 2025 14:52:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0b255b1e33d3bf85933cb640f6762fa0c8f26ff4 block: 21564418
- current block number: 21773698

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21564418 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version of the OptimismPortal has inbuilt flow controls that can throttle eth deposits and withdrawals automatically based on volume over time.
      issuedPermissions.1.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.1.via.0:
+        {"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions.0.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.0.via.0:
+        {"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}
    }
```

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"interact","from":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","description":"manage roles including the guardian role."}
      receivedPermissions.1:
+        {"permission":"guard","from":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"}
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.2.via.0:
+        {"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.0.via.0:
+        {"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"},{"permission":"upgrade","from":"0x2a721cBE81a128be0F01040e3353c3805A5EA091"},{"permission":"upgrade","from":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"},{"permission":"upgrade","from":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","description":"upgrading the bridge implementation can give access to all funds escrowed therein."},{"permission":"upgrade","from":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c"},{"permission":"upgrade","from":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"},{"permission":"upgrade","from":"0x92Ef6Af472b39F1b363da45E35530c24619245A4"},{"permission":"upgrade","from":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244"},{"permission":"upgrade","from":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"},{"permission":"upgrade","from":"0x2a721cBE81a128be0F01040e3353c3805A5EA091"},{"permission":"upgrade","from":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"},{"permission":"upgrade","from":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","description":"upgrading the bridge implementation can give access to all funds escrowed therein."},{"permission":"upgrade","from":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c"},{"permission":"upgrade","from":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"},{"permission":"upgrade","from":"0x92Ef6Af472b39F1b363da45E35530c24619245A4"},{"permission":"upgrade","from":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244"},{"permission":"upgrade","from":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"}]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof.
      issuedPermissions.0.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.0.via.0:
+        {"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}
      description:
+        "This contract verifies ZK proofs (if provided). There is an intentional dummy backdoor allowing to call this contract without a proof."
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system.
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x2c0B27F7C8F083B539557a0bA787041BF22DB276","description":"manage roles including the guardian role.","via":[]}
      issuedPermissions.1:
+        {"permission":"guard","to":"0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
      values.monitorAC:
+        ["0xf9Fda17D91383120D59a7c60eAEA8Bd7319B5AE5"]
      template:
+        "opstack/SuperchainConfig_zircuit"
      description:
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and access control for configuring actors who can pause and unpause the system."
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.2.via.0:
+        {"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.0.via.0:
+        {"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}
    }
```

```diff
    contract ZircuitAdminMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      name:
-        "ZircuitMultiSig"
+        "ZircuitAdminMultiSig"
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"0x92Ef6Af472b39F1b363da45E35530c24619245A4","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0x2a721cBE81a128be0F01040e3353c3805A5EA091","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","via":[{"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.to:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.0.via.0:
+        {"address":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"}
      template:
+        "opstack/OptimismMintableERC20Factory"
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xb0f3cada1cf73800cf4bcac358fd31b944542102

# Diff at Tue, 04 Feb 2025 12:33:35 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21564418
- current block number: 21564418

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21564418 (main branch discovery), not current.

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x7487ae6fc79f0a2562d8c6a7c6cd635322f48742

# Diff at Mon, 20 Jan 2025 11:10:23 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21564418
- current block number: 21564418

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21564418 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version of the OptimismPortal has inbuilt flow controls that can throttle eth deposits and withdrawals automatically based on volume over time.
      issuedPermissions.1.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.1.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.0.target:
-        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
      issuedPermissions.0.to:
+        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.0.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
    }
```

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      receivedPermissions.0.from:
+        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.2.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.1.target:
-        "0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145"
      issuedPermissions.1.to:
+        "0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145"
      issuedPermissions.0.target:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.0.to:
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.0.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
      receivedPermissions.8.from:
+        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
      receivedPermissions.7.target:
-        "0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
      receivedPermissions.7.from:
+        "0x994eEb321F9cD79B077a5455fC248c77f30Dd244"
      receivedPermissions.6.target:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.6.from:
+        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.5.target:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      receivedPermissions.5.from:
+        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      receivedPermissions.4.target:
-        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      receivedPermissions.4.from:
+        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      receivedPermissions.3.target:
-        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      receivedPermissions.3.from:
+        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      receivedPermissions.2.target:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      receivedPermissions.2.from:
+        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      receivedPermissions.1.target:
-        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      receivedPermissions.1.from:
+        "0x2a721cBE81a128be0F01040e3353c3805A5EA091"
      receivedPermissions.0.target:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
      receivedPermissions.0.from:
+        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.0.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.0.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.2.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.1.target:
-        "0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65"
      issuedPermissions.1.to:
+        "0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65"
      issuedPermissions.0.target:
-        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
      issuedPermissions.0.to:
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.0.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      receivedPermissions.1.target:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      receivedPermissions.1.from:
+        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      receivedPermissions.0.target:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.0.from:
+        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
      issuedPermissions.0.to:
+        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
    }
```

Generated with discovered.json: 0xb4f194ab21d15e9cd10698814e227839d45f81fb

# Diff at Wed, 08 Jan 2025 09:08:58 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21564418
- current block number: 21564418

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21564418 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x08cf2c4e25744f7a6789f00dfd8095dbc77dd493

# Diff at Mon, 06 Jan 2025 09:06:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@76c326507f3e17f647665da0edde4da6efb7079d block: 21388259
- current block number: 21564418

## Description

Add external wsteth escrow (matches template).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21388259 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract L1ERC20TokenBridge (0x912C7271a6A3622dfb8B218eb46a6122aB046C79)
    +++ description: Escrow for custom external tokens that use the canonical bridge for messaging but are governed externally.
```

Generated with discovered.json: 0xe28dc8a373f6a6e9c1c5f56db7248039a2e48164

# Diff at Thu, 12 Dec 2024 18:36:42 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21366345
- current block number: 21388259

## Description

Changed finalization period from 5 hours to 4.
Throttling checks are disabled since ethThrottleWithdrawals.maxAmountPerPeriod is set to 0.

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version of the OptimismPortal has inbuilt flow controls that can throttle eth deposits and withdrawals automatically based on volume over time.
      values.ethThrottleWithdrawals.maxAmountPerPeriod:
-        "1000000000000000000000"
+        0
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
+++ description: Challenge period (Number of seconds until a state root is finalized).
      values.FINALIZATION_PERIOD_SECONDS:
-        18000
+        14400
      values.finalizationPeriodSeconds:
-        18000
+        14400
    }
```

Generated with discovered.json: 0xf3cc94b95e05fcc954432c345ea9fbac05ea834f

# Diff at Mon, 09 Dec 2024 17:31:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@02974be0caac873bba9178e618086aa67aaf0b90 block: 21334344
- current block number: 21366345

## Description

Moved the zircuit-specific OptiPortal away from the default op stack template as it has custom flow control.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21334344 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version of the OptimismPortal has inbuilt flow controls that can throttle eth deposits and withdrawals automatically based on volume over time.
      template:
-        "opstack/OptimismPortal"
+        "opstack/OptimismPortal_zircuit"
      description:
-        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals. This version of the OptimismPortal has inbuilt flow controls that can throttle eth deposits and withdrawals automatically based on volume over time."
    }
```

Generated with discovered.json: 0x6b1ef83ce197665a204bcae5f0602a71929c06aa

# Diff at Thu, 05 Dec 2024 05:56:44 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7dc480bf5499525d0b44afce03521538ecc8ec73 block: 20827058
- current block number: 21334344

## Description

Minor upgrade to the verifier to support another type of dummy proof (`0xFFFF`).
```
if (_proof.length == 2 && (bytes2(_proof) == 0xDEAD || bytes2(_proof) == 0xFFFF)) {
            return bytes("");
        }
```

## Watched changes

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      sourceHashes.1:
-        "0x15cce087eeab52950ec9f98df3ec3bb507edb1fac086fa0674aad4994d49049d"
+        "0xa755414175ee27be390c32c78aaacaaf640fea05cd3198de33257a27f282b91f"
      values.$implementation:
-        "0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"
+        "0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e"
      values.$pastUpgrades.3:
+        ["2024-12-04T15:21:23.000Z","0xa77ba9edb866b52cd4f676f0ff60cc38e85987d4cee650fc232a2a9d13c00dc6",["0xa1f99E9E8D23B4945b62eAFF65eCf3D0dE6a0a5e"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "0c13cfbb19b823f524a346e7ff5b352e24b8d79b"
+        "c3131379c4bf618f2135c29547049b46923f7dca"
    }
```

## Source code changes

```diff
.../zircuit/ethereum/{.flat@20827058 => .flat}/Verifier/Verifier.sol  | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x09f3f25dd9125f5444f20f332977639589728e0e

# Diff at Fri, 01 Nov 2024 12:11:01 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      receivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xe57302eb0fb8026c2ea303740cc2c0df47e41c4d

# Diff at Tue, 29 Oct 2024 13:21:12 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x0283b722ef661fc771dad94496d924f326b0465a

# Diff at Mon, 21 Oct 2024 12:50:29 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x6d4521da31477fee385b3d2158ab0b51eb18fec8

# Diff at Mon, 21 Oct 2024 11:12:19 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.2.2:
+        ["0xde8B916B972cE3c27C21157Fc2b107c413062b9d"]
      values.$pastUpgrades.2.1:
-        ["0xde8B916B972cE3c27C21157Fc2b107c413062b9d"]
+        "0x472c4b57b3828c3f8a846702da5707eccb216d672b4ede4eb4186ffe606b14b3"
      values.$pastUpgrades.1.2:
+        ["0x304a52C8354f323672191Ebf1347Cd3d494Ea830"]
      values.$pastUpgrades.1.1:
-        ["0x304a52C8354f323672191Ebf1347Cd3d494Ea830"]
+        "0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196"
      values.$pastUpgrades.0.2:
+        ["0x8Ab1b1E21c2f229a7bB1430CF3ADfb0644a69ab7"]
      values.$pastUpgrades.0.1:
-        ["0x8Ab1b1E21c2f229a7bB1430CF3ADfb0644a69ab7"]
+        "0x67e7390665dd0d4d9d7ad86cf3ae11c0dce8d7538b69d5fc15d176b36474e08f"
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"]
      values.$pastUpgrades.0.1:
-        ["0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"]
+        "0xba20c00dc03b009737ebbcaa3db1263524a1322c5984a4f51fbf7c4ebc979575"
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xA03E2f3Ee6dBa20411A2326D7FA9CCCc6a9A53de"]
      values.$pastUpgrades.0.1:
-        ["0xA03E2f3Ee6dBa20411A2326D7FA9CCCc6a9A53de"]
+        "0x9cebd2cdbd71bf96668e003794de90cf09858ccebb8f93c41e3d7822df207505"
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades.3.2:
+        ["0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"]
      values.$pastUpgrades.3.1:
-        ["0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"]
+        "0x472c4b57b3828c3f8a846702da5707eccb216d672b4ede4eb4186ffe606b14b3"
      values.$pastUpgrades.2.2:
+        ["0x0Fc6203310c494963eBAdd1157780a613B67eCDf"]
      values.$pastUpgrades.2.1:
-        ["0x0Fc6203310c494963eBAdd1157780a613B67eCDf"]
+        "0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196"
      values.$pastUpgrades.1.2:
+        ["0xE14b12F4843447114A093D99Dc9322b93a967DE6"]
      values.$pastUpgrades.1.1:
-        ["0xE14b12F4843447114A093D99Dc9322b93a967DE6"]
+        "0xf3c21a1c1d5df7cd11018e70254ed8b78bba36107c8231dfee6ff1b1c5702196"
      values.$pastUpgrades.0.2:
+        ["0x7409668285336dBBe720bE3525AEe372Fce4c2ab"]
      values.$pastUpgrades.0.1:
-        ["0x7409668285336dBBe720bE3525AEe372Fce4c2ab"]
+        "0xd13642194be1a1b8947f8d3cd1504ec56ca67f4ba953cc45e4f135fb118a46f7"
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"]
      values.$pastUpgrades.2.1:
-        ["0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"]
+        "0x535806593d5f6ff8537efafb51d759ec64c8e93cc4edbde4a5c55f7ef585bacc"
      values.$pastUpgrades.1.2:
+        ["0xA153Ec874DaB9e6590cFcf4DC3f5bb86FfaC08B9"]
      values.$pastUpgrades.1.1:
-        ["0xA153Ec874DaB9e6590cFcf4DC3f5bb86FfaC08B9"]
+        "0x539b48f8704b83bab6fa24d7b2c46c400a2240c99dd810ebe23fb55aa7399b18"
      values.$pastUpgrades.0.2:
+        ["0x6a8497798ae8B398608B49b003ECB23aC0756E06"]
      values.$pastUpgrades.0.1:
-        ["0x6a8497798ae8B398608B49b003ECB23aC0756E06"]
+        "0x4aadbfa3f415e08a48b58c5047394f912decf4410020f8412353b1e953f161a1"
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xA47314C96ab9572af656788e15143B459F99AE0f"]
      values.$pastUpgrades.0.1:
-        ["0xA47314C96ab9572af656788e15143B459F99AE0f"]
+        "0xb5e745182a810d657ce620881623f4109ba08309028552c87519442deef98a13"
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0xaaF7FCc7252eb739E0001D8727800deAE04A84f1"]
      values.$pastUpgrades.0.1:
-        ["0xaaF7FCc7252eb739E0001D8727800deAE04A84f1"]
+        "0xb7f011bd8d0fabfe82b954ebee2fdb2bc366baa21dcceaedf227bf8cf6803232"
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x3B21dC86c412aC34fF4c679497b274509D73cDcC"]
      values.$pastUpgrades.0.1:
-        ["0x3B21dC86c412aC34fF4c679497b274509D73cDcC"]
+        "0xd6346f4354e7b4f58d6ef747d0ac04afa4c80319963ac187a69403ff1dcebdc8"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf885DA6A3B4c93905b02f36f9a13680922A554b0"]
      values.$pastUpgrades.0.1:
-        ["0xf885DA6A3B4c93905b02f36f9a13680922A554b0"]
+        "0x25c6d394396aef5f15c5f4fd388c8ebf206b71dfe6ced6d1933573016d7cee77"
    }
```

Generated with discovered.json: 0xffc1f4e59cfb0817460af8d85544d63023976fb2

# Diff at Wed, 16 Oct 2024 11:43:13 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
    }
```

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      roles:
-        ["Guardian"]
      receivedPermissions:
+        [{"permission":"guard","target":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145"
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      roles:
-        ["Challenger"]
      receivedPermissions.1:
+        {"permission":"configure","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x8d402841bbe226ee88c8e03608a48f88597290b3

# Diff at Mon, 14 Oct 2024 10:58:02 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x9388575e8cf83880125e7770a596c83a0ad9c191b71f1990544987cbd0dbd4c0"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x1e3673770550301c22eadd847cc822cfbc995c36019d1dfce07b2ec9cffd930f"]
    }
```

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x06f2d961bb4a244d73779f83003fd66fcda3cc297693cd348d8ac1aa8c29dc63"]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x3a72e01a50e4baf0c333aa3ad2413675a95c2fc68a18d8a95b3a65179e98ccbc"]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      sourceHashes:
+        ["0x9097b28161923c9e2353a796f1580ecf8bf3415bae9a69f49102bdf7a1b94da8"]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x15cce087eeab52950ec9f98df3ec3bb507edb1fac086fa0674aad4994d49049d"]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x39037837abcc5e06ffe85b07ad5f5ce901ed8551155a1b3b81cfd181bd683593"]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x2f020370d4312debb7d9c97dbf80a48a0a0ee81d261d6d239d6b01d0dd076c81"]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x7328459427570e205526a415613989750227c38d95138613a718c573132fdd17"]
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0xae58fedc9cba4efd31498542acf99901aec1544412fb8cf69fa5c7e804602cc7"]
    }
```

Generated with discovered.json: 0x504f3c5a439bf4c23b96ea7798ec84dc7a81ca5f

# Diff at Tue, 01 Oct 2024 11:11:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-07-02T16:13:23.000Z",["0x8Ab1b1E21c2f229a7bB1430CF3ADfb0644a69ab7"]],["2024-07-16T08:48:59.000Z",["0x304a52C8354f323672191Ebf1347Cd3d494Ea830"]],["2024-07-17T12:11:35.000Z",["0xde8B916B972cE3c27C21157Fc2b107c413062b9d"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-07-02T16:12:35.000Z",["0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"]]]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-07-02T16:11:47.000Z",["0xA03E2f3Ee6dBa20411A2326D7FA9CCCc6a9A53de"]]]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        [["2024-07-02T16:11:59.000Z",["0x7409668285336dBBe720bE3525AEe372Fce4c2ab"]],["2024-07-16T08:48:59.000Z",["0xE14b12F4843447114A093D99Dc9322b93a967DE6"]],["2024-07-16T08:48:59.000Z",["0x0Fc6203310c494963eBAdd1157780a613B67eCDf"]],["2024-07-17T12:11:35.000Z",["0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"]]]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-02T16:13:35.000Z",["0x6a8497798ae8B398608B49b003ECB23aC0756E06"]],["2024-07-03T09:00:47.000Z",["0xA153Ec874DaB9e6590cFcf4DC3f5bb86FfaC08B9"]],["2024-08-12T16:32:59.000Z",["0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"]]]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-02T16:08:11.000Z",["0xA47314C96ab9572af656788e15143B459F99AE0f"]]]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-07-02T16:12:59.000Z",["0xaaF7FCc7252eb739E0001D8727800deAE04A84f1"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-07-02T16:12:11.000Z",["0x3B21dC86c412aC34fF4c679497b274509D73cDcC"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-02T16:12:23.000Z",["0xf885DA6A3B4c93905b02f36f9a13680922A554b0"]]]
    }
```

Generated with discovered.json: 0x7739dd387f09b162dfd31f9caa7e750639621a36

# Diff at Wed, 25 Sep 2024 10:35:52 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e8c4fe6b10f7918ebbd761bc35018ba84053b08c block: 20619826
- current block number: 20827058

## Description

Limits changed. The maximum total deposit limit is removed (unlimited) and withdrawal limits per period are raised.

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.ethThrottleDeposits.maxAmountTotal:
-        "3000000000000000000000"
+        0
      values.ethThrottleWithdrawals.maxAmountPerPeriod:
-        "500000000000000000000"
+        "1000000000000000000000"
      values.getEthThrottleWithdrawalsCredits:
-        "500000000000000000000"
+        "1000000000000000000000"
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.ethThrottleDeposits.maxAmountPerPeriod:
-        "50000000000000000000"
+        0
    }
```

Generated with discovered.json: 0x8ec193a124244817461cb28bc56248ba72ba973e

# Diff at Sun, 08 Sep 2024 17:24:52 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20619826
- current block number: 20619826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20619826 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      receivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0xed1a5ff267d65269cdac030b1e7d6b49475b8871

# Diff at Fri, 30 Aug 2024 08:01:42 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20619826
- current block number: 20619826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20619826 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x5f23bb0b276568036f80cd0694ccc59eac7d6d7d

# Diff at Fri, 23 Aug 2024 09:56:30 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20584587
- current block number: 20584587

## Description

Config changes related to changing grantedPermissions to issuedPermissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20584587 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        3
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"configure","target":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[]},{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        4
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","0x2a721cBE81a128be0F01040e3353c3805A5EA091","0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","0x6BCe7408c0781dcE7b71494274302D4b75a1447c","0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","0x92Ef6Af472b39F1b363da45E35530c24619245A4","0x994eEb321F9cD79B077a5455fC248c77f30Dd244","0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","via":[]},{"permission":"upgrade","target":"0x2a721cBE81a128be0F01040e3353c3805A5EA091","via":[]},{"permission":"upgrade","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]},{"permission":"upgrade","target":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","via":[]},{"permission":"upgrade","target":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c","via":[]},{"permission":"upgrade","target":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","via":[]},{"permission":"upgrade","target":"0x92Ef6Af472b39F1b363da45E35530c24619245A4","via":[]},{"permission":"upgrade","target":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244","via":[]},{"permission":"upgrade","target":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932","via":[]}]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      values.$upgradeCount:
+        3
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

Generated with discovered.json: 0x8da8c2de0f2d0c615e4437db1483d52ecf12f157

# Diff at Thu, 22 Aug 2024 13:57:11 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@f2b78de1ce1e36fdbbec8b0ae072ca46ec7c1c8d block: 20563605
- current block number: 20584587

## Description

The Guardian Multisig (2/5) and Zircuit Multisig (6/8) now have more members and higher threshold. Previously the Zircuit Multisig was a 1/3 and we've missed adding the warning.

## Watched changes

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      values.$members.4:
+        "0x38809210f69ed6204E276d2Be6b15cd530698679"
      values.$members.3:
+        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.$members.2:
+        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.$members.1:
+        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.$members.0:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.$threshold:
-        1
+        2
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "2 of 5 (40%)"
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      values.$members.7:
+        "0x38809210f69ed6204E276d2Be6b15cd530698679"
      values.$members.6:
+        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.$members.5:
+        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.$members.4:
+        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
      values.$members.3:
+        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.$members.2:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.$members.1:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
      values.$members.0:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
      values.$threshold:
-        1
+        6
      values.multisigThreshold:
-        "1 of 3 (33%)"
+        "6 of 8 (75%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20563605 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"configure","target":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[]},{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","via":[]},{"permission":"upgrade","target":"0x2a721cBE81a128be0F01040e3353c3805A5EA091","via":[]},{"permission":"upgrade","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]},{"permission":"upgrade","target":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","via":[]},{"permission":"upgrade","target":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c","via":[]},{"permission":"upgrade","target":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","via":[]},{"permission":"upgrade","target":"0x92Ef6Af472b39F1b363da45E35530c24619245A4","via":[]},{"permission":"upgrade","target":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244","via":[]},{"permission":"upgrade","target":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932","via":[]}]
      assignedPermissions:
+        {"upgrade":["0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","0x2a721cBE81a128be0F01040e3353c3805A5EA091","0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","0x6BCe7408c0781dcE7b71494274302D4b75a1447c","0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","0x92Ef6Af472b39F1b363da45E35530c24619245A4","0x994eEb321F9cD79B077a5455fC248c77f30Dd244","0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"]}
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions:
-        [{"permission":"configure","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]}]
      assignedPermissions:
+        {"configure":["0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"]}
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

Generated with discovered.json: 0x3c39cd542517a443c87cfb7c168f96b603f1cd96

# Diff at Wed, 21 Aug 2024 10:06:39 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20563605
- current block number: 20563605

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20563605 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[]},{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","0x2a721cBE81a128be0F01040e3353c3805A5EA091","0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","0x6BCe7408c0781dcE7b71494274302D4b75a1447c","0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","0x92Ef6Af472b39F1b363da45E35530c24619245A4","0x994eEb321F9cD79B077a5455fC248c77f30Dd244","0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","via":[]},{"permission":"upgrade","target":"0x2a721cBE81a128be0F01040e3353c3805A5EA091","via":[]},{"permission":"upgrade","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]},{"permission":"upgrade","target":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","via":[]},{"permission":"upgrade","target":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c","via":[]},{"permission":"upgrade","target":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","via":[]},{"permission":"upgrade","target":"0x92Ef6Af472b39F1b363da45E35530c24619245A4","via":[]},{"permission":"upgrade","target":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244","via":[]},{"permission":"upgrade","target":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932","via":[]}]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

Generated with discovered.json: 0xb13c2f3ee9724b0313aff13467b331ac62c7769b

# Diff at Mon, 19 Aug 2024 15:36:01 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5417c4717b5cefeed17cd8419a7eb2dda22d4206 block: 20519354
- current block number: 20563605

## Description

Increased their withdrawal limits for ETH (amount that can be withdrawn before getting throttled) to 500 ETH and the deposit limit to 50 ETH.

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.ethThrottleWithdrawals.maxAmountPerPeriod:
-        "300000000000000000000"
+        "500000000000000000000"
      values.getEthThrottleWithdrawalsCredits:
-        "300000000000000000000"
+        "500000000000000000000"
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.ethThrottleDeposits.maxAmountPerPeriod:
-        "1000000000000000000"
+        "50000000000000000000"
    }
```

Generated with discovered.json: 0x202698101e977c3a33e24d85257db8d4fc2d0a62

# Diff at Tue, 13 Aug 2024 11:18:48 GMT:

- chain: ethereum
- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@925407501fd3d01acc73c6851abc4b5c56e2e056 block: 20490461
- current block number: 20519354

## Description

Nothing significant has changed, likely a small upgrade to the circuit

## Watched changes

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      values.$implementation:
-        "0xA153Ec874DaB9e6590cFcf4DC3f5bb86FfaC08B9"
+        "0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"
      values.version:
-        "6ad34d4fc0cb1cbbed736b058d02532e881f9674"
+        "0c13cfbb19b823f524a346e7ff5b352e24b8d79b"
    }
```

## Source code changes

```diff
.../Verifier/Verifier.sol                          | 166 ++++++++++-----------
 1 file changed, 83 insertions(+), 83 deletions(-)
```

Generated with discovered.json: 0x576473c0656040c6d9b2a979123507d0bb002581

# Diff at Fri, 09 Aug 2024 12:10:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@43f10227394a700c20a2a00a94db255d929b2777 block: 20490461
- current block number: 20490461

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20490461 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.8:
-        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
+        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
      assignedPermissions.upgrade.6:
-        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      assignedPermissions.upgrade.5:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      assignedPermissions.upgrade.4:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      assignedPermissions.upgrade.3:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      assignedPermissions.upgrade.2:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      assignedPermissions.upgrade.0:
-        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
+        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
    }
```

Generated with discovered.json: 0xa87cd2a83ac938e7e57e7e3f83cdfa45e40f27f9

# Diff at Fri, 09 Aug 2024 11:46:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 20490461

## Description

Initial discovery: Fork from the latest pre-FP OP stack contracts with added ZK proofs.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257)
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
```

```diff
+   Status: CREATED
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932)
    +++ description: None
```

