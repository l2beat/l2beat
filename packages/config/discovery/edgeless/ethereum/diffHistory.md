Generated with discovered.json: 0x4b3d3cc3526794f0f2791cd6af7f67dd4e250453

# Diff at Fri, 07 Mar 2025 09:07:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 21766618
- current block number: 21993999

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766618 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0xf9c61cef7e0f9dbe41d1fe7076a18eabb8a97407

# Diff at Thu, 06 Mar 2025 09:38:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 21766618
- current block number: 21766618

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766618 (main branch discovery), not current.

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0xf51551afD112a50Fc5EDa0454111078fE6E6096E","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x5e8749760c5051fF80b73319cCf4d05ef9959563"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xe1780c76231014a5b07309d390d3cc87654699ef

# Diff at Tue, 04 Mar 2025 10:39:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766618
- current block number: 21766618

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766618 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: Manages strategies to be used with funds forwarded from the EdgelessDeposit contract.
      sinceBlock:
+        19486054
    }
```

```diff
    contract OneStepProofEntry (0x1F58949AB4C6A65C4055f45fdF9297C5F216CD95) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21228198
    }
```

```diff
    contract OneStepProverHostIo (0x251E34E4644D06b319AD39c602b857E47cCa13C3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21228197
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        18736154
    }
```

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      sinceBlock:
+        19486756
    }
```

```diff
    contract EdgelessMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      sinceBlock:
+        19543369
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        19486756
    }
```

```diff
    contract OneStepProverMemory (0x6119D59799E83329847de25Dc787A0D9ab4c0323) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21228195
    }
```

```diff
    contract ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        19486759
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        19486756
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: Receives deposits and issues ewETH tokens. Funds are forwarded to the StakingManger contract.
      sinceBlock:
+        19486056
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        19486756
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        19486756
    }
```

```diff
    contract CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      sinceBlock:
+        19486759
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      sinceBlock:
+        19486051
    }
```

```diff
    contract OneStepProver0 (0xaac292Cb9a205A140003775529181787fdbc4DC6) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21228194
    }
```

```diff
    contract GatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        19486759
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: Deposits funds into the Renzo protocol.
      sinceBlock:
+        19723689
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: Deposits funds into the Lido protocol.
      sinceBlock:
+        19486059
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        19486756
    }
```

```diff
    contract WrappedToken (0xcD0aa40948c662dEDd9F157085fd6369A255F2f7) {
    +++ description: None
      sinceBlock:
+        19486056
    }
```

```diff
    contract OneStepProverMath (0xE6068c35d4FB1899b9419cE3e7B66D318C652847) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        21228196
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        19486756
    }
```

```diff
    contract RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        19486756
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        19486756
    }
```

Generated with discovered.json: 0xe8de6b916237d4b5199015ef19e7df0591b2bf16

# Diff at Thu, 27 Feb 2025 11:45:36 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21766618
- current block number: 21766618

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766618 (main branch discovery), not current.

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      name:
-        "L1OrbitCustomGateway"
+        "CustomGateway"
      displayName:
-        "CustomGateway"
    }
```

```diff
    contract GatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

Generated with discovered.json: 0x4e8e58bb60d0ddd3e834341d1d686929007025bf

# Diff at Fri, 21 Feb 2025 14:06:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21766618
- current block number: 21766618

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766618 (main branch discovery), not current.

```diff
    contract ERC20Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitCustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ERC20Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x6ef2b7c3cebd2c5d57e9569aa0fb34729e5847c7

# Diff at Tue, 04 Feb 2025 12:31:23 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766618
- current block number: 21766618

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766618 (main branch discovery), not current.

```diff
    contract EdgelessMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x96bd7f19550cf1d531dff6ec34a086ba323eb845

# Diff at Mon, 20 Jan 2025 11:09:27 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628441
- current block number: 21628441

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628441 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: Manages strategies to be used with funds forwarded from the EdgelessDeposit contract.
      issuedPermissions.0.target:
-        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
    }
```

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      directlyReceivedPermissions.9.target:
-        "0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086"
      directlyReceivedPermissions.9.from:
+        "0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086"
      directlyReceivedPermissions.8.target:
-        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
      directlyReceivedPermissions.8.from:
+        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
      directlyReceivedPermissions.7.target:
-        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
      directlyReceivedPermissions.7.from:
+        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
      directlyReceivedPermissions.6.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      directlyReceivedPermissions.6.from:
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      directlyReceivedPermissions.5.target:
-        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
      directlyReceivedPermissions.5.from:
+        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
      directlyReceivedPermissions.4.target:
-        "0x99790790B030CF116efed1c7577e2262072EfCc9"
      directlyReceivedPermissions.4.from:
+        "0x99790790B030CF116efed1c7577e2262072EfCc9"
      directlyReceivedPermissions.3.target:
-        "0x893057442A952E3254CA53d007AD6BBB502f557e"
      directlyReceivedPermissions.3.from:
+        "0x893057442A952E3254CA53d007AD6BBB502f557e"
      directlyReceivedPermissions.2.target:
-        "0x6B595398152999bBc759D5D8ed8169793F915488"
      directlyReceivedPermissions.2.from:
+        "0x6B595398152999bBc759D5D8ed8169793F915488"
      directlyReceivedPermissions.1.target:
-        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
      directlyReceivedPermissions.1.from:
+        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
      directlyReceivedPermissions.0.target:
-        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
      directlyReceivedPermissions.0.from:
+        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
    }
```

```diff
    contract EdgelessMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086"
      receivedPermissions.11.from:
+        "0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086"
      receivedPermissions.10.target:
-        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
      receivedPermissions.10.from:
+        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
      receivedPermissions.9.target:
-        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
      receivedPermissions.9.from:
+        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
      receivedPermissions.8.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      receivedPermissions.8.from:
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      receivedPermissions.7.target:
-        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
      receivedPermissions.7.from:
+        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
      receivedPermissions.6.target:
-        "0x99790790B030CF116efed1c7577e2262072EfCc9"
      receivedPermissions.6.from:
+        "0x99790790B030CF116efed1c7577e2262072EfCc9"
      receivedPermissions.5.target:
-        "0x893057442A952E3254CA53d007AD6BBB502f557e"
      receivedPermissions.5.from:
+        "0x893057442A952E3254CA53d007AD6BBB502f557e"
      receivedPermissions.4.target:
-        "0x890025891508a463A636f81D2f532a97210240de"
      receivedPermissions.4.from:
+        "0x890025891508a463A636f81D2f532a97210240de"
      receivedPermissions.3.target:
-        "0x6B595398152999bBc759D5D8ed8169793F915488"
      receivedPermissions.3.from:
+        "0x6B595398152999bBc759D5D8ed8169793F915488"
      receivedPermissions.2.target:
-        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
      receivedPermissions.2.from:
+        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
      receivedPermissions.1.target:
-        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
      receivedPermissions.1.from:
+        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
      receivedPermissions.0.target:
-        "0x890025891508a463A636f81D2f532a97210240de"
      receivedPermissions.0.from:
+        "0x890025891508a463A636f81D2f532a97210240de"
      directlyReceivedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      directlyReceivedPermissions.0.from:
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract ERC20Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

```diff
    contract ERC20Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: Receives deposits and issues ewETH tokens. Funds are forwarded to the StakingManger contract.
      issuedPermissions.0.target:
-        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0x282e630b33B684DF61e3459316BAe4f27a28dE29"
      issuedPermissions.2.to:
+        "0x282e630b33B684DF61e3459316BAe4f27a28dE29"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

```diff
    contract L1OrbitCustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      directlyReceivedPermissions.3.target:
-        "0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"
      directlyReceivedPermissions.3.from:
+        "0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"
      directlyReceivedPermissions.2.target:
-        "0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9"
      directlyReceivedPermissions.2.from:
+        "0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9"
      directlyReceivedPermissions.1.target:
-        "0x7E0bc314535f430122caFEF18eAbd508d62934bf"
      directlyReceivedPermissions.1.from:
+        "0x7E0bc314535f430122caFEF18eAbd508d62934bf"
      directlyReceivedPermissions.0.target:
-        "0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"
      directlyReceivedPermissions.0.from:
+        "0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: Deposits funds into the Renzo protocol.
      issuedPermissions.0.target:
-        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: Deposits funds into the Lido protocol.
      issuedPermissions.0.target:
-        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      directlyReceivedPermissions.2.target:
-        "0x890025891508a463A636f81D2f532a97210240de"
      directlyReceivedPermissions.2.from:
+        "0x890025891508a463A636f81D2f532a97210240de"
      directlyReceivedPermissions.1.target:
-        "0x890025891508a463A636f81D2f532a97210240de"
      directlyReceivedPermissions.1.from:
+        "0x890025891508a463A636f81D2f532a97210240de"
      directlyReceivedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
      directlyReceivedPermissions.0.from:
+        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
    }
```

```diff
    contract ERC20Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.target:
-        "0x4e4aC6F04106964b5B69FDA5EcC207295bCae81f"
      issuedPermissions.0.to:
+        "0x4e4aC6F04106964b5B69FDA5EcC207295bCae81f"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

Generated with discovered.json: 0xc9cb889dedc735cdaecf885f8ab0c89acc92d800

# Diff at Wed, 15 Jan 2025 07:39:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21465158
- current block number: 21628441

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465158 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xb12ead8687d5d3eb9a3ac1c9d97a3dc04649ad43

# Diff at Wed, 08 Jan 2025 10:44:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 21465158
- current block number: 21465158

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21465158 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x64dacbd012c10162f8ee6890adba9ce897954718

# Diff at Mon, 23 Dec 2024 12:24:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 21292438
- current block number: 21465158

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292438 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xa51db138a6d818c835e8d329d8c56a13d81d8249

# Diff at Fri, 06 Dec 2024 08:09:41 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 21292438
- current block number: 21292438

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292438 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x391277b8601350966c0cfd9fa749100ef23852ec

# Diff at Fri, 29 Nov 2024 11:28:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 21292438
- current block number: 21292438

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21292438 (main branch discovery), not current.

```diff
    contract EdgelessMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0xc97001087552679743ff93b015a45100a44266d0

# Diff at Fri, 29 Nov 2024 09:31:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21264245
- current block number: 21292438

## Description

Config related: remove manual template override.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21264245 (main branch discovery), not current.

```diff
    contract EdgelessMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x9fa70b15bcf471cbdb237d297b04d4b7740b1f82

# Diff at Mon, 25 Nov 2024 10:42:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@62a44faa52866a55f9881cb2852ac75b1fcc60b0 block: 21235631
- current block number: 21264245

## Description

ArbOS v32 upgrade to known contracts with unused fastConfirmer.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProver0 (0x05cd95968709034744797cC37a58FD43fabFff9F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x34da361b71484F3F6B459531852ff4a60C36fE55)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x7B3cF41acea4230183e4e367c456d878467925Bf)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x4944f77757AE7050A7EF843FacA82FC449aB5901"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0xA798E033b1B3976d77a4A6aeDC496873a7264156"
      values.$pastUpgrades.1:
+        ["2024-11-24T16:28:35.000Z","0xf0976079c29124f6917774cf38e659b554b89d59a451fd9c6ebe546e87b53cbd",["0xA798E033b1B3976d77a4A6aeDC496873a7264156","0x4944f77757AE7050A7EF843FacA82FC449aB5901"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x38B79f7D08326833051AA4D0a119D8095247716f"
+        "0x92726c81BbECbC9b871304B290b412EC78cF842b"
      values.$pastUpgrades.2:
+        ["2024-11-24T16:28:35.000Z","0xf0976079c29124f6917774cf38e659b554b89d59a451fd9c6ebe546e87b53cbd",["0x92726c81BbECbC9b871304B290b412EC78cF842b"]]
      values.$upgradeCount:
-        2
+        3
      values.osp:
-        "0xcd6fda29E15919de86De6E94C348776d544cFa6E"
+        "0x1F58949AB4C6A65C4055f45fdF9297C5F216CD95"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xcd6fda29E15919de86De6E94C348776d544cFa6E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xdFa7A279F4DF9dd16cA91094ac429eC5B12EDB94)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x1F58949AB4C6A65C4055f45fdF9297C5F216CD95)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x251E34E4644D06b319AD39c602b857E47cCa13C3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x6119D59799E83329847de25Dc787A0D9ab4c0323)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xaac292Cb9a205A140003775529181787fdbc4DC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xE6068c35d4FB1899b9419cE3e7B66D318C652847)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21235631 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0xea39f03c2a2b14f40d83705240bef1054c6ff480

# Diff at Thu, 21 Nov 2024 10:53:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 21041831
- current block number: 21235631

## Description

ArbOS v20 upgrade (to known contracts). Move to discoverydriven data.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v11.1 wasmModuleRoot"
+        "ArbOS v20 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"
+        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
      values.$implementation:
-        "0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"
+        "0x38B79f7D08326833051AA4D0a119D8095247716f"
      values.$pastUpgrades.1:
+        ["2024-11-18T17:15:59.000Z","0xbc68abaef39524b8b9ee1cf1d43eee32963c1c9c3ebf91e38a9e40d9b1fadcb3",["0x38B79f7D08326833051AA4D0a119D8095247716f"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x09824fe72BFF474d16D9c2774432E381BBD60662"
+        "0xcd6fda29E15919de86De6E94C348776d544cFa6E"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"
+        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
      values.$implementation:
-        "0x873484Ba63353C8b71210ce123B465512d408B27"
+        "0x5054375f50f36812d1C45E6091b167aaFC3cA5b6"
      values.$pastUpgrades.1:
+        ["2024-11-18T17:15:59.000Z","0xbc68abaef39524b8b9ee1cf1d43eee32963c1c9c3ebf91e38a9e40d9b1fadcb3",["0x5054375f50f36812d1C45E6091b167aaFC3cA5b6"]]
      values.$upgradeCount:
-        1
+        2
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        true
      values.reader4844:
+        "0x4Cc63d9A2aA0E0168F5EDfFA2D31d1F8cF0C270E"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x05cd95968709034744797cC37a58FD43fabFff9F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x34da361b71484F3F6B459531852ff4a60C36fE55)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x7B3cF41acea4230183e4e367c456d878467925Bf)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xcd6fda29E15919de86De6E94C348776d544cFa6E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xdFa7A279F4DF9dd16cA91094ac429eC5B12EDB94)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041831 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: Manages strategies to be used with funds forwarded from the EdgelessDeposit contract.
      issuedPermissions.0.target:
-        "0xa5f13fbc57f14Bf322C900Cae0F67b4819364281"
+        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
      issuedPermissions.0.via.0:
+        {"address":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","delay":0}
      description:
+        "Manages strategies to be used with funds forwarded from the EdgelessDeposit contract."
    }
```

```diff
    contract EdgelessMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      name:
-        "ExecutorMultisig"
+        "EdgelessMultisig"
    }
```

```diff
    contract ERC20Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract L1OrbitERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1ERC20Gateway"
+        "L1OrbitERC20Gateway"
    }
```

```diff
    contract ERC20Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      displayName:
+        "Bridge"
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: Receives deposits and issues ewETH tokens. Funds are forwarded to the StakingManger contract.
      issuedPermissions.0.target:
-        "0xa5f13fbc57f14Bf322C900Cae0F67b4819364281"
+        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
      issuedPermissions.0.via.0:
+        {"address":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","delay":0}
      description:
+        "Receives deposits and issues ewETH tokens. Funds are forwarded to the StakingManger contract."
    }
```

```diff
    contract L1OrbitCustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      name:
-        "L1CustomGateway"
+        "L1OrbitCustomGateway"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"},{"permission":"upgrade","target":"0x7E0bc314535f430122caFEF18eAbd508d62934bf"},{"permission":"upgrade","target":"0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9"},{"permission":"upgrade","target":"0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"},{"permission":"upgrade","target":"0x7E0bc314535f430122caFEF18eAbd508d62934bf"},{"permission":"upgrade","target":"0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9"},{"permission":"upgrade","target":"0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"}]
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: Deposits funds into the Renzo protocol.
      issuedPermissions.0.target:
-        "0xa5f13fbc57f14Bf322C900Cae0F67b4819364281"
+        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
      issuedPermissions.0.via.0:
+        {"address":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","delay":0}
      description:
+        "Deposits funds into the Renzo protocol."
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: Deposits funds into the Lido protocol.
      issuedPermissions.0.target:
-        "0xa5f13fbc57f14Bf322C900Cae0F67b4819364281"
+        "0xcB58d1142e53e37aDE44E1F125248FbfAc99352A"
      issuedPermissions.0.via.0:
+        {"address":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","delay":0}
      description:
+        "Deposits funds into the Lido protocol."
    }
```

```diff
    contract ERC20Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

Generated with discovered.json: 0x788082b9f78a873b5c629c85fa5d048c9a48810a

# Diff at Fri, 15 Nov 2024 08:18:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21041831
- current block number: 21041831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041831 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4","via":[{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","delay":0}]}
      issuedPermissions.2.permission:
-        "propose"
+        "validate"
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x282e630b33B684DF61e3459316BAe4f27a28dE29"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.0:
+        {"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
      template:
+        "orbitstack/CustomGateway"
      displayName:
+        "CustomGateway"
      description:
+        "Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability."
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0xfb7c0c0c842e8491d98de0b7df403518b989c0d9

# Diff at Mon, 04 Nov 2024 07:55:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 21041831
- current block number: 21041831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041831 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]}
      receivedPermissions.10.target:
-        "0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086"
+        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
      receivedPermissions.9.target:
-        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
+        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
      receivedPermissions.8.target:
-        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      receivedPermissions.7.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
      receivedPermissions.6.target:
-        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
+        "0x99790790B030CF116efed1c7577e2262072EfCc9"
      receivedPermissions.5.target:
-        "0x99790790B030CF116efed1c7577e2262072EfCc9"
+        "0x893057442A952E3254CA53d007AD6BBB502f557e"
      receivedPermissions.4.target:
-        "0x893057442A952E3254CA53d007AD6BBB502f557e"
+        "0x890025891508a463A636f81D2f532a97210240de"
      receivedPermissions.4.via.1:
-        {"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}
      receivedPermissions.4.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      receivedPermissions.3.target:
-        "0x890025891508a463A636f81D2f532a97210240de"
+        "0x6B595398152999bBc759D5D8ed8169793F915488"
      receivedPermissions.3.via.1:
+        {"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}
      receivedPermissions.3.via.0.address:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
      receivedPermissions.2.target:
-        "0x6B595398152999bBc759D5D8ed8169793F915488"
+        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
      receivedPermissions.1.target:
-        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
+        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
+        "0x890025891508a463A636f81D2f532a97210240de"
      receivedPermissions.0.via.1:
-        {"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}
      receivedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4","via":[{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
+        "0x282e630b33B684DF61e3459316BAe4f27a28dE29"
      issuedPermissions.2.via.0:
-        {"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0x282e630b33B684DF61e3459316BAe4f27a28dE29"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.1.via.0:
+        {"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x890025891508a463A636f81D2f532a97210240de"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x52322974cc65cb3e6bce18e4e3252b77f5ee2096

# Diff at Tue, 29 Oct 2024 13:07:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 21041831
- current block number: 21041831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041831 (main branch discovery), not current.

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

Generated with discovered.json: 0x553752024f513385c86520421e0be7d2aff727a2

# Diff at Tue, 29 Oct 2024 08:01:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 21041831
- current block number: 21041831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041831 (main branch discovery), not current.

```diff
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5e8749760c5051fF80b73319cCf4d05ef9959563","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0x6B595398152999bBc759D5D8ed8169793F915488","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0x890025891508a463A636f81D2f532a97210240de","via":[{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0x893057442A952E3254CA53d007AD6BBB502f557e","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0x99790790B030CF116efed1c7577e2262072EfCc9","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0xf51551afD112a50Fc5EDa0454111078fE6E6096E","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]},{"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"},{"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"}]
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.2.via.0:
+        {"address":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","delay":0}
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x5e8749760c5051fF80b73319cCf4d05ef9959563","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0x6B595398152999bBc759D5D8ed8169793F915488","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0x890025891508a463A636f81D2f532a97210240de"},{"permission":"upgrade","target":"0x893057442A952E3254CA53d007AD6BBB502f557e","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0x99790790B030CF116efed1c7577e2262072EfCc9","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0xf51551afD112a50Fc5EDa0454111078fE6E6096E","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]},{"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x890025891508a463A636f81D2f532a97210240de"}
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.0.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      issuedPermissions.1.via.1:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
    }
```

Generated with discovered.json: 0x9202cab45d1db696cf5deff8819a4c8e97058731

# Diff at Mon, 28 Oct 2024 14:03:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 21041831
- current block number: 21041831

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21041831 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"]
    }
```

Generated with discovered.json: 0xb8eedb84907ab36866b6a3ecdbb1ecc19f9be4b8

# Diff at Fri, 25 Oct 2024 09:48:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20842587
- current block number: 21041831

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842587 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x5e8749760c5051fF80b73319cCf4d05ef9959563"},{"permission":"upgrade","target":"0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"},{"permission":"upgrade","target":"0x6B595398152999bBc759D5D8ed8169793F915488"},{"permission":"upgrade","target":"0x893057442A952E3254CA53d007AD6BBB502f557e"},{"permission":"upgrade","target":"0x99790790B030CF116efed1c7577e2262072EfCc9"},{"permission":"upgrade","target":"0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"},{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"},{"permission":"upgrade","target":"0xf51551afD112a50Fc5EDa0454111078fE6E6096E"},{"permission":"upgrade","target":"0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"},{"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x5e8749760c5051fF80b73319cCf4d05ef9959563"},{"permission":"upgrade","target":"0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"},{"permission":"upgrade","target":"0x6B595398152999bBc759D5D8ed8169793F915488"},{"permission":"upgrade","target":"0x893057442A952E3254CA53d007AD6BBB502f557e"},{"permission":"upgrade","target":"0x99790790B030CF116efed1c7577e2262072EfCc9"},{"permission":"upgrade","target":"0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"},{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6"},{"permission":"upgrade","target":"0xf51551afD112a50Fc5EDa0454111078fE6E6096E"},{"permission":"upgrade","target":"0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"},{"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086"}]
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xf51551afD112a50Fc5EDa0454111078fE6E6096E","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x99790790B030CF116efed1c7577e2262072EfCc9","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x893057442A952E3254CA53d007AD6BBB502f557e","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x890025891508a463A636f81D2f532a97210240de"}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x6B595398152999bBc759D5D8ed8169793F915488","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","via":[{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]}
      receivedPermissions.0.target:
-        "0x890025891508a463A636f81D2f532a97210240de"
+        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
      receivedPermissions.0.via:
+        [{"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"}]
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.0.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      issuedPermissions.1.via.0:
+        {"address":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","delay":0}
    }
```

Generated with discovered.json: 0xf20b6572d94c3b589bbda9d264f5f123d8fc4f71

# Diff at Wed, 23 Oct 2024 14:35:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 20842587
- current block number: 20842587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842587 (main branch discovery), not current.

```diff
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for bridge messaging."
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x282e630b33B684DF61e3459316BAe4f27a28dE29"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v11.1 wasmModuleRoot"
+        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v11.1 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

Generated with discovered.json: 0x59b84dea1c4a0da724798a4ac7c16ce0cb52b544

# Diff at Mon, 21 Oct 2024 12:44:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20842587
- current block number: 20842587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842587 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x9fc611d94abea92fe942d6d25ff9a47aa50d8ce8

# Diff at Mon, 21 Oct 2024 11:05:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20842587
- current block number: 20842587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842587 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x121892C0620E349723dfd3E1535cD668CD414dfD"]
      values.$pastUpgrades.0.1:
-        ["0x121892C0620E349723dfd3E1535cD668CD414dfD"]
+        "0x7248e4a0fa1c9b5d591d69a0b712108b069eaf7d005be389eed187f77635aff8"
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x19431dc37098877486532250FB3158140717C00C"]
      values.$pastUpgrades.0.1:
-        ["0x19431dc37098877486532250FB3158140717C00C"]
+        "0x9a69d7f74c80826a8d5c84398da524ff12f3bef236ff9115094e086382a33810"
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
      values.$pastUpgrades.0.1:
-        ["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]
+        "0xab9a182d783bfb5c66ed9aa081fa601c6c508c66985433e473587fec72792ccb"
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
      values.$pastUpgrades.0.1:
-        ["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]
+        "0x9a69d7f74c80826a8d5c84398da524ff12f3bef236ff9115094e086382a33810"
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xE4E2BBaCAb9bE9258D7cf3eF9D993cfA81a55356"]
      values.$pastUpgrades.0.1:
-        ["0xE4E2BBaCAb9bE9258D7cf3eF9D993cfA81a55356"]
+        "0xfbea2e40af670e98d892dbcfde2f2a51c4bcf3c70d31f62bd773faf954041e27"
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
      values.$pastUpgrades.0.1:
-        ["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]
+        "0x9a69d7f74c80826a8d5c84398da524ff12f3bef236ff9115094e086382a33810"
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
      values.$pastUpgrades.0.1:
-        ["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]
+        "0x9a69d7f74c80826a8d5c84398da524ff12f3bef236ff9115094e086382a33810"
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x688c7b64776421668a91Ed4D23554d78626c8E69"]
      values.$pastUpgrades.0.1:
-        ["0x688c7b64776421668a91Ed4D23554d78626c8E69"]
+        "0xab9a182d783bfb5c66ed9aa081fa601c6c508c66985433e473587fec72792ccb"
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
      values.$pastUpgrades.0.1:
-        ["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]
+        "0xab9a182d783bfb5c66ed9aa081fa601c6c508c66985433e473587fec72792ccb"
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xfF03657dCe3c3EAE996Bf82fD41572D47D049747"]
      values.$pastUpgrades.0.1:
-        ["0xfF03657dCe3c3EAE996Bf82fD41572D47D049747"]
+        "0x54b39e358fb6d7bd09c4b715a036f9db0a581dad7a302cfc074b81696f41b4af"
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xaD69577988FD1fF2F265C0B46E45fbC722F4Cf4c"]
      values.$pastUpgrades.0.1:
-        ["0xaD69577988FD1fF2F265C0B46E45fbC722F4Cf4c"]
+        "0x9ca85ff7f69422a81a189a421f97be95b14ffc3e369c4090621bee0fa86f06b3"
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
      values.$pastUpgrades.0.1:
-        ["0x6c21303F5986180B1394d2C89f3e883890E2867b"]
+        "0x9a69d7f74c80826a8d5c84398da524ff12f3bef236ff9115094e086382a33810"
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
      values.$pastUpgrades.0.1:
-        ["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]
+        "0x9a69d7f74c80826a8d5c84398da524ff12f3bef236ff9115094e086382a33810"
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
      values.$pastUpgrades.0.1:
-        ["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]
+        "0x9a69d7f74c80826a8d5c84398da524ff12f3bef236ff9115094e086382a33810"
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
      values.$pastUpgrades.0.1:
-        ["0x873484Ba63353C8b71210ce123B465512d408B27"]
+        "0x9a69d7f74c80826a8d5c84398da524ff12f3bef236ff9115094e086382a33810"
    }
```

Generated with discovered.json: 0x879aeacb373db85f5c88bc6ea06fcaaa26a54da7

# Diff at Wed, 16 Oct 2024 11:36:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20842587
- current block number: 20842587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842587 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x282e630b33B684DF61e3459316BAe4f27a28dE29","via":[]}
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006"
+        "0x4e4aC6F04106964b5B69FDA5EcC207295bCae81f"
    }
```

Generated with discovered.json: 0x02911dabd2fe2ca5e604eed273f89a9cc439904f

# Diff at Mon, 14 Oct 2024 10:50:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20842587
- current block number: 20842587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842587 (main branch discovery), not current.

```diff
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      sourceHashes:
+        ["0xccb5b222f823953e2082d6174b99d09cb9046c862bb91c6fe6cb57e5289a9738","0xae4f01314954d6bf92eaca0c3e5c760f63db6376d826d9cb3d41136003123856"]
    }
```

```diff
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x17c9d8bf5017982cb88ab1d4f22a085c097ab9c7a910fa109fe9e7204840bef8"]
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x057de68a7007d55f4394ba6eafb2c802efcaf13583ff9342ea4d0ee3924d9be1"]
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      sourceHashes:
+        ["0xccb5b222f823953e2082d6174b99d09cb9046c862bb91c6fe6cb57e5289a9738","0xc29a00d40454333c33bef95b7bf7c77adf0ed23d17de616fa962e665b386ca2e"]
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x7e1cd1e10119e118ffaa576ddbe1c0f9810a0859a4bf2f65a4ff596c0ed4183d"]
    }
```

```diff
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0xee0b7e8945470e5da2cfe232d3703b0ec005472afd2eb66e4b2534c19f0100d0"]
    }
```

```diff
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878) {
    +++ description: None
      sourceHashes:
+        ["0x0a8f8db8198082757cc8145891c633c20ed4313dab05beab40618258e534a1e8"]
    }
```

```diff
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      sourceHashes:
+        ["0x1c9416031605fbda74b5da95a290e00995eaed2f6f6ba85ff2681131efe940a0"]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"]
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      sourceHashes:
+        ["0xccb5b222f823953e2082d6174b99d09cb9046c862bb91c6fe6cb57e5289a9738","0xad43639684e818ceea7a4da925f6ac94c1005d69a423f65afcc40461fa2f16d2"]
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      sourceHashes:
+        ["0xccb5b222f823953e2082d6174b99d09cb9046c862bb91c6fe6cb57e5289a9738","0xe44c1094ba5445d7a4760ceeae485cef71bc9c9b38a30d781d128eb8ac93caf7"]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract WrappedToken (0xcD0aa40948c662dEDd9F157085fd6369A255F2f7) {
    +++ description: None
      sourceHashes:
+        ["0x153b6efe4e6ab2b68b61be626944cbd2bd163bbe29c7d290c19e47b32831a4a0"]
    }
```

```diff
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x08792f333db7e8a060c38033f92e3fc10c30e2648c56fc49c7460ee1c94343a0"]
    }
```

Generated with discovered.json: 0xc2eb7df0a765c1ec3b8de040873a199be1653765

# Diff at Tue, 01 Oct 2024 10:51:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20842587
- current block number: 20842587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20842587 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-21T22:38:59.000Z",["0x121892C0620E349723dfd3E1535cD668CD414dfD"]]]
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x19431dc37098877486532250FB3158140717C00C"]]]
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:59.000Z",["0xe80b4E0ed5e92d865F4708eeE0E1564287a7D848"]]]
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x7EfcB76D0e2E776A298aAa603d433336e5F8b6ab"]]]
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-21T22:39:23.000Z",["0xE4E2BBaCAb9bE9258D7cf3eF9D993cfA81a55356"]]]
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A","0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754"]]]
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:59.000Z",["0x688c7b64776421668a91Ed4D23554d78626c8E69"]]]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:59.000Z",["0x5Ff3feD7aad041ACe66E4ecDd7AfbCC43b6446b0"]]]
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-24T07:16:11.000Z",["0xfF03657dCe3c3EAE996Bf82fD41572D47D049747"]]]
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-21T22:39:59.000Z",["0xaD69577988FD1fF2F265C0B46E45fbC722F4Cf4c"]]]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x6c21303F5986180B1394d2C89f3e883890E2867b"]]]
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x31fAAAB44e74eB408d1FC69A14806B4b9cA09da2"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x302275067251F5FcdB9359Bda735fD8f7A4A54c0"]]]
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-03-22T01:00:23.000Z",["0x873484Ba63353C8b71210ce123B465512d408B27"]]]
    }
```

Generated with discovered.json: 0xe1624081c5527701dc14035960585b6ecb14985f

# Diff at Fri, 27 Sep 2024 14:36:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 20583954
- current block number: 20842587

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583954 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x442c8408e7f3d863f8dd0e28bf4a02a1fb0471e1

# Diff at Sun, 01 Sep 2024 08:44:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 20583954
- current block number: 20583954

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583954 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4"
+        "ArbOS v11.1 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xc3a6477e24d09efc9815b42caa67a39295b9b063

# Diff at Fri, 30 Aug 2024 07:52:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20583954
- current block number: 20583954

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583954 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      receivedPermissions.9.via:
-        []
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
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
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
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xe4f0454b71485d75b4e952e6d2d3bceb4b4c91af

# Diff at Fri, 23 Aug 2024 09:52:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20583954
- current block number: 20583954

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20583954 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x7c6e21bcaa06a1abcbe3ba796420b651e7919971

# Diff at Thu, 22 Aug 2024 11:51:34 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 20525344
- current block number: 20583954

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20525344 (main branch discovery), not current.

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBL4joOU9aS9yzzZL/uE5mvNkreZ1bz331f4bv8mEqfsvCxuG47A9V5948qg/7skexRhdRYgoiIqMyuiIl0LeFyeUCmcD9BXhi7lco4q5PzJHaHHHxnJofKncKT5wMziqBkzFLoIWLXhoE6j8BOUfOX7EQqnOCSJjqq7hnj7o307gKWrNw63l9XD4Aulzw+MoxTzxDEL8CLA71jp+2d6r6lesVtk4+IAd4CLOgysC0hJhSyRajOlq/r0LKtgFs7NNwMuFf8pzp6DHy7QirCbP1KOtDE813xW3lt2tEL0tb3kWbQUasHSPdsPYFS8v21RXg7Htow2LF7asLJtYnKmzGEN2D4pJq5+hJbJxATrO7aq3XrctjBLSWhrtIwjIVcNwg=="]
    }
```

Generated with discovered.json: 0x66d33384f719296a382ae511ccfc3184ec4fe4ec

# Diff at Wed, 21 Aug 2024 10:02:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20525344
- current block number: 20525344

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20525344 (main branch discovery), not current.

```diff
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5e8749760c5051fF80b73319cCf4d05ef9959563","0x6B595398152999bBc759D5D8ed8169793F915488","0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x893057442A952E3254CA53d007AD6BBB502f557e","0x99790790B030CF116efed1c7577e2262072EfCc9","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0xf51551afD112a50Fc5EDa0454111078fE6E6096E"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5e8749760c5051fF80b73319cCf4d05ef9959563","via":[]},{"permission":"upgrade","target":"0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","via":[]},{"permission":"upgrade","target":"0x6B595398152999bBc759D5D8ed8169793F915488","via":[]},{"permission":"upgrade","target":"0x893057442A952E3254CA53d007AD6BBB502f557e","via":[]},{"permission":"upgrade","target":"0x99790790B030CF116efed1c7577e2262072EfCc9","via":[]},{"permission":"upgrade","target":"0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","via":[]},{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[]},{"permission":"upgrade","target":"0xf51551afD112a50Fc5EDa0454111078fE6E6096E","via":[]},{"permission":"upgrade","target":"0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","via":[]},{"permission":"upgrade","target":"0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","via":[]}]
    }
```

```diff
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc213d433802ea473e23623476b26FB12e9B4eFe6","via":[]}]
    }
```

```diff
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0x7E0bc314535f430122caFEF18eAbd508d62934bf","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","via":[]},{"permission":"upgrade","target":"0x7E0bc314535f430122caFEF18eAbd508d62934bf","via":[]},{"permission":"upgrade","target":"0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","via":[]},{"permission":"upgrade","target":"0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa5f13fbc57f14Bf322C900Cae0F67b4819364281","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x890025891508a463A636f81D2f532a97210240de"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x890025891508a463A636f81D2f532a97210240de","via":[]}]
    }
```

```diff
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006","via":[]}]
    }
```

Generated with discovered.json: 0xf68de6fda4db9aeaadbbad8a5d10b29255daddd8

# Diff at Wed, 14 Aug 2024 07:23:14 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e32dcc268a9af9f45ad205490c9d650c487e04f1 block: 20318530
- current block number: 20525344

## Description

The EOA that was able to execute upgrades was removed. Now there's only the 3/4 multisig left.

## Watched changes

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xa43ce4721Ac0faB33E8636e0DDB55E76e3EFF461"
+        "0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4"
    }
```

Generated with discovered.json: 0x7458ebca3950e7d7a4d2441bdab89761c5e16de1

# Diff at Fri, 09 Aug 2024 11:59:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions.upgrade.9:
-        "0x893057442A952E3254CA53d007AD6BBB502f557e"
+        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
      assignedPermissions.upgrade.8:
-        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
+        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
      assignedPermissions.upgrade.7:
-        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
+        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
      assignedPermissions.upgrade.5:
-        "0x6B595398152999bBc759D5D8ed8169793F915488"
+        "0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1"
      assignedPermissions.upgrade.4:
-        "0xc213d433802ea473e23623476b26FB12e9B4eFe6"
+        "0x99790790B030CF116efed1c7577e2262072EfCc9"
      assignedPermissions.upgrade.3:
-        "0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC"
+        "0x893057442A952E3254CA53d007AD6BBB502f557e"
      assignedPermissions.upgrade.2:
-        "0xf51551afD112a50Fc5EDa0454111078fE6E6096E"
+        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
      assignedPermissions.upgrade.1:
-        "0x99790790B030CF116efed1c7577e2262072EfCc9"
+        "0x6B595398152999bBc759D5D8ed8169793F915488"
      assignedPermissions.upgrade.0:
-        "0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78"
+        "0x5e8749760c5051fF80b73319cCf4d05ef9959563"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions.upgrade.1:
-        "0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"
+        "0x7E0bc314535f430122caFEF18eAbd508d62934bf"
      assignedPermissions.upgrade.0:
-        "0x7E0bc314535f430122caFEF18eAbd508d62934bf"
+        "0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227"
    }
```

Generated with discovered.json: 0x6904195e587c378f852b66fd64ec149869508185

# Diff at Fri, 09 Aug 2024 10:09:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5e8749760c5051fF80b73319cCf4d05ef9959563","0x6B595398152999bBc759D5D8ed8169793F915488","0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x893057442A952E3254CA53d007AD6BBB502f557e","0x99790790B030CF116efed1c7577e2262072EfCc9","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0xf51551afD112a50Fc5EDa0454111078fE6E6096E"]
      assignedPermissions.upgrade:
+        ["0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78","0x99790790B030CF116efed1c7577e2262072EfCc9","0xf51551afD112a50Fc5EDa0454111078fE6E6096E","0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC","0xc213d433802ea473e23623476b26FB12e9B4eFe6","0x6B595398152999bBc759D5D8ed8169793F915488","0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086","0x5e8749760c5051fF80b73319cCf4d05ef9959563","0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1","0x893057442A952E3254CA53d007AD6BBB502f557e"]
    }
```

```diff
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0xA61A62352FAF6AD883A8D36975cf39cDEB477D25","0xC616EA9D34ec12D6879A9DE7910CA9Bf5f28C9E7"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x356000Cec4fC967f8FC372381D983426760A0391","0xA61A62352FAF6AD883A8D36975cf39cDEB477D25","0xC616EA9D34ec12D6879A9DE7910CA9Bf5f28C9E7"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0x7E0bc314535f430122caFEF18eAbd508d62934bf","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]
      assignedPermissions.upgrade:
+        ["0x7E0bc314535f430122caFEF18eAbd508d62934bf","0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227","0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9","0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b"]
    }
```

```diff
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x890025891508a463A636f81D2f532a97210240de"]
      assignedPermissions.upgrade:
+        ["0x890025891508a463A636f81D2f532a97210240de"]
    }
```

Generated with discovered.json: 0x0c9702e1fa67068c11beb0c68343eb720b10fa4f

# Diff at Tue, 30 Jul 2024 11:11:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20318530
- current block number: 20318530

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20318530 (main branch discovery), not current.

```diff
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

```diff
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

Generated with discovered.json: 0x851dddada727016068d89b57be2a2b27fd730c3c

# Diff at Tue, 16 Jul 2024 10:40:08 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20318530

## Description

Orbit chain with investment strategies baked in the deposit contract.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x09824fe72BFF474d16D9c2774432E381BBD60662)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingManager (0x1e6d08769be5Dc83d38C64C5776305Ad6F01c227)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x27C7Bfd2cC11429e9b80c443b42FDBe4754F6c91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x4811500e0d376Fa8d2EA3CCb7c61E0afB4F5A7f1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OrbitProxyAdmin (0x48E84C45fE99859B1D72FA56Ce5D3c76FF2F7006)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ExecutorMultisig (0x4dE424B0BDe70504Ad7b3c644EaAd052F4D993b4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x5e8749760c5051fF80b73319cCf4d05ef9959563)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0x6a1B2ea25c3099CAFcbd4E60a3Ae251E52B69e78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x6B595398152999bBc759D5D8ed8169793F915488)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EdgelessDeposit (0x7E0bc314535f430122caFEF18eAbd508d62934bf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x890025891508a463A636f81D2f532a97210240de)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x893057442A952E3254CA53d007AD6BBB502f557e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x89AF7C4C2198c426cFe6E86de0680A0850503e06)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CustomGateway (0x99790790B030CF116efed1c7577e2262072EfCc9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x99a2A31300816C1FA3f40818AC9280fe7271F878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x9CAd81628aB7D8e239F1A5B497313341578c5F71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StrategiesProxyAdmin (0xa5f13fbc57f14Bf322C900Cae0F67b4819364281)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xb47D14b4282DF795E036e9Ea43E54C31FCB0eCAC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RenzoStrategy (0xBCc1Ceb75De4BBb75918627E7CB301DF9Ccc8aF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EthStrategy (0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xc213d433802ea473e23623476b26FB12e9B4eFe6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WrappedToken (0xcD0aa40948c662dEDd9F157085fd6369A255F2f7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xDf94F0474F205D086dbc2e66D69a856FCf520622)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0xf51551afD112a50Fc5EDa0454111078fE6E6096E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xFa213CdA43f879FfaF17170B6E3b3AbE9900cAB1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xFfbf2b49524e09B1F1fBcA707B830e79c68c2086)
    +++ description: State batches / commitments get posted here.
```
