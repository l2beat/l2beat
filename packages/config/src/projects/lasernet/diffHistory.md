Generated with discovered.json: 0xa5b8c15b7af491eed53f49ffc5e30d0912c65929

# Diff at Wed, 11 Feb 2026 15:34:33 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@2e859859d90363aa5bf619da50a94cddbc1e3894 block: 1769514335
- current timestamp: 1770824009

## Description

Upgrade to BoLD dispute protocol and ArbOS v51 "Dia" (nitro-contracts v3.1.0+).

RollupProxy replaced with a new BoLD-enabled contract (`isPostBoLD: true`). Assertion-based state management replaces the old node-based system. Validators stake 0.1 ETH (WETH), validator whitelist remains enabled.

ChallengeManager replaced with EdgeChallengeManager implementing the BoLD multi-level bisection protocol: block-level edges (height 67M), 1 big-step level (height 524K), small-step edges (height 8.4M), with 0.1 ETH stake for big-step and small-step edges.

All core contracts upgraded: Bridge, Inbox, Outbox, RollupEventInbox, SequencerInbox. SequencerInbox gains delay buffer support (`isDelayBufferable: true`, currently set to max/disabled) and `feeTokenPricer` field. `delayBlocks` increased from 5760 to 7200.

All four OneStepProvers and OneStepProofEntry replaced with new versions. ValidatorUtils removed (no longer needed in BoLD).

ArbOS updated to v51 "Dia" (wasmModuleRoot `0x8a7513bf...`), adding Ethereum Fusaka support (secp256r1, BLS12-381, CLZ opcode), improved gas pricing, and native token mint/burn support.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMath (eth:0x036147913eEb42E97790F9a693246c8444290AB6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract UpgradeExecutor (eth:0x0F8cF337D5A0A45e61559f6Ab1999FF8aA0eACD5) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.1.from:
-        "eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b"
+        "eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783"
      directlyReceivedPermissions.2.from:
-        "eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b"
+        "eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783"
    }
```

```diff
    contract Bridge (eth:0x1eeE9b9F024188E54930D2927d7a28e66E7649a7) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sourceHashes.1:
-        "0x73087d4667e81f676a10708feb2774bab3a9a558a1987b8ac4f112cc464bba96"
+        "0x7f62b9bd4a0aac711ca355a523b1d934ab93ae14c5fae5a860c0ded42ee5a3c3"
      values.$implementation:
-        "eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797"
+        "eth:0x81be1Bf06cB9B23e8EEDa3145c3366A912DAD9D6"
      values.$pastUpgrades.1:
+        ["2026-02-09T09:22:35.000Z","0xafbcbe360ba3526a2f683ac3199504e90bd3b4647b959e94aef6c5b5487a0461",["eth:0x81be1Bf06cB9B23e8EEDa3145c3366A912DAD9D6"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b"
+        "eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783"
      implementationNames.eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797:
-        "ERC20Bridge"
      implementationNames.eth:0x81be1Bf06cB9B23e8EEDa3145c3366A912DAD9D6:
+        "ERC20Bridge"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (eth:0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (eth:0x231173CC90cB8486A7dbD1733B5105254316D50A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ChallengeManager (eth:0x27a66B6e6aFB0179Bf8E9B97af6e148a5eF79D97)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
-   Status: DELETED
    contract RollupProxy (eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.from:
-        "eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b"
+        "eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783"
      receivedPermissions.3:
-        {"permission":"upgrade","from":"eth:0x27a66B6e6aFB0179Bf8E9B97af6e148a5eF79D97","role":"admin","via":[{"address":"eth:0xF815C4c8A671395dAF5706DCB917CfA60DE7B3f9"},{"address":"eth:0x0F8cF337D5A0A45e61559f6Ab1999FF8aA0eACD5"}]}
      receivedPermissions.4:
-        {"permission":"upgrade","from":"eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b","role":"admin","via":[{"address":"eth:0x0F8cF337D5A0A45e61559f6Ab1999FF8aA0eACD5"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783","role":"admin","via":[{"address":"eth:0x0F8cF337D5A0A45e61559f6Ab1999FF8aA0eACD5"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xbB31B4eD64fFF7ee149a8c7F7FA3E6BF35E8363B","role":"admin","via":[{"address":"eth:0xF815C4c8A671395dAF5706DCB917CfA60DE7B3f9"},{"address":"eth:0x0F8cF337D5A0A45e61559f6Ab1999FF8aA0eACD5"}]}
    }
```

```diff
    contract SequencerInbox (eth:0x661b39a5EB200dFcbb436d98453BdBf88Da02AA1) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0xb57f3e67e08492b235337cda4f3ea0117e3e043cceaf8e9a7a51b57611ba99de"
      values.$implementation:
-        "eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18"
+        "eth:0x6F2E7F9B5Db5e4e9B5B1181D2Eb0e4972500C324"
      values.$pastUpgrades.2:
+        ["2026-02-09T09:22:35.000Z","0xafbcbe360ba3526a2f683ac3199504e90bd3b4647b959e94aef6c5b5487a0461",["eth:0x6F2E7F9B5Db5e4e9B5B1181D2Eb0e4972500C324"]]
      values.$upgradeCount:
-        2
+        3
      values.maxTimeVariation.delayBlocks:
-        5760
+        7200
      values.reader4844:
-        "eth:0x6c5c9E6c080a6C25f49DfFE85cfA71aaEAAfdE74"
+        "eth:0xB1F1A77AB63671a6355Fa5c8423f436118943411"
      values.rollup:
-        "eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b"
+        "eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783"
      values.feeTokenPricer:
+        "eth:0x0000000000000000000000000000000000000000"
      values.isDelayBufferable:
+        true
      implementationNames.eth:0xaEd84B70Be8117112a5aa0d93a7fBff463A03b18:
-        "SequencerInbox"
      implementationNames.eth:0x6F2E7F9B5Db5e4e9B5B1181D2Eb0e4972500C324:
+        "SequencerInbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (eth:0x72b55c2C38EadE57C10047746632A369A060A46E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ValidatorUtils (eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
    EOA  (eth:0x8fbEf9f7554aec9CCf62b88D86aE1C91F1599F7C) {
    +++ description: None
      receivedPermissions.0.role:
-        ".validators"
+        ".getValidators"
      receivedPermissions.0.from:
-        "eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b"
+        "eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (eth:0x9f403f2054736884518E6D3f510C02f5959BDCC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Inbox (eth:0xa2809b5f031bf91d2408B3e2464774A28B0F4949) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
+        "0x82dad78abdf27e168de1ae177b8055db4167106d71273d9a3264e9898a6055e4"
      values.$implementation:
-        "eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4"
+        "eth:0xD210b64eD9D47Ef8Acf1A3284722FcC7Fc6A1f4e"
      values.$pastUpgrades.2:
+        ["2026-02-09T09:22:35.000Z","0xafbcbe360ba3526a2f683ac3199504e90bd3b4647b959e94aef6c5b5487a0461",["eth:0xD210b64eD9D47Ef8Acf1A3284722FcC7Fc6A1f4e"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0x6C051397fee2d79ccf92d1f3c5c6547fEBD838F4:
-        "ERC20Inbox"
      implementationNames.eth:0xD210b64eD9D47Ef8Acf1A3284722FcC7Fc6A1f4e:
+        "ERC20Inbox"
    }
```

```diff
    contract RollupEventInbox (eth:0xb343522e5663E0cE1060dd50EF04b12820F84890) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sourceHashes.1:
-        "0x35bd9f6436158f2147578ce95b85de68f435e81f1f3ed3858f7523a8c4825a1a"
+        "0x089ac3cec821c0f014f284ec4ec1039ef6bc50b6ad3ee47c82e20af65cc30c33"
      values.$implementation:
-        "eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da"
+        "eth:0x0d079b22B0B4083b9b0bDc62Bf1a4EAF4a95bDEe"
      values.$pastUpgrades.1:
+        ["2026-02-09T09:22:35.000Z","0xafbcbe360ba3526a2f683ac3199504e90bd3b4647b959e94aef6c5b5487a0461",["eth:0x0d079b22B0B4083b9b0bDc62Bf1a4EAF4a95bDEe"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b"
+        "eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783"
      implementationNames.eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da:
-        "ERC20RollupEventInbox"
      implementationNames.eth:0x0d079b22B0B4083b9b0bDc62Bf1a4EAF4a95bDEe:
+        "ERC20RollupEventInbox"
    }
```

```diff
    contract Outbox (eth:0xDb5abc57397530DddC1e33BC023F2ef73Db6A86A) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      values.$implementation:
-        "eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878"
+        "eth:0x17E0C5fE0dFF2AE4cfC9E96d9Ccd112DaF5c0386"
      values.$pastUpgrades.1:
+        ["2026-02-09T09:22:35.000Z","0xafbcbe360ba3526a2f683ac3199504e90bd3b4647b959e94aef6c5b5487a0461",["eth:0x17E0C5fE0dFF2AE4cfC9E96d9Ccd112DaF5c0386"]]
      values.$upgradeCount:
-        1
+        2
      values.rollup:
-        "eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b"
+        "eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783"
      implementationNames.eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878:
-        "ERC20Outbox"
      implementationNames.eth:0x17E0C5fE0dFF2AE4cfC9E96d9Ccd112DaF5c0386:
+        "ERC20Outbox"
    }
```

```diff
    contract ProxyAdmin (eth:0xF815C4c8A671395dAF5706DCB917CfA60DE7B3f9) {
    +++ description: None
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","from":"eth:0x27a66B6e6aFB0179Bf8E9B97af6e148a5eF79D97","role":"admin"}
      directlyReceivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0xbB31B4eD64fFF7ee149a8c7F7FA3E6BF35E8363B","role":"admin"}
    }
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x29efff3EfE3E01A3F69011a054C33410edFc2283)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x7368F782E109518fD3914e8b315eE45E51C15835)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x769b70b6b1fA281ab5c99e9C5A284BE4117e4783)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0x91cB57F200Bd5F897E41C164425Ab4DB0991A64f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (eth:0xbB31B4eD64fFF7ee149a8c7F7FA3E6BF35E8363B)
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0xD1D75248ed95450B793d80F9fb418C2eD4c5F5e4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0xDdaD5E59D056078A4E67a9d42e21Ce8057F22D60)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         |  306 +-
 .../ChallengeManager.sol => /dev/null              |  994 -----
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3193 +++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../Inbox/ERC20Inbox.sol                           |  430 +-
 .../OneStepProofEntry.sol                          |  656 +--
 .../{.flat@1769514335 => .flat}/OneStepProver0.sol |  502 ++-
 .../OneStepProverHostIo.sol                        |  643 +--
 .../OneStepProverMath.sol                          |  101 +-
 .../OneStepProverMemory.sol                        |  421 +-
 .../Outbox/ERC20Outbox.sol                         |  104 +-
 .../RollupEventInbox/ERC20RollupEventInbox.sol     |   73 +-
 .../RollupProxy/RollupAdminLogic.1.sol             | 2809 ++++++------
 .../RollupProxy/RollupProxy.p.sol                  |   91 +-
 .../RollupProxy/RollupUserLogic.2.sol              | 4700 ++++++++++----------
 .../SequencerInbox/SequencerInbox.sol              | 1030 +++--
 .../ValidatorUtils.sol => /dev/null                |  323 --
 17 files changed, 9455 insertions(+), 6939 deletions(-)
```

Generated with discovered.json: 0xb138fe1ed296a37aedbff937825ab32105770087

# Diff at Tue, 27 Jan 2026 11:47:28 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@01c924f177b66fde012756076e94adb03520b757 block: 1768984424
- current timestamp: 1769514335

## Description

New member added to Conduit Multisig 1, increasing from 4 of 12 to 4 of 13 threshold.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xA9FCCc53F1c9095DA867Bd648683F8bdCcc78d09"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 13 (31%)"
    }
```

Generated with discovered.json: 0xa131419f26bf5aca333284d7fc66e4e1da14f581

# Diff at Wed, 21 Jan 2026 08:34:46 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@a72aa7d50f1dddc0c7a6eae7f60679fc94e4eabf block: 1768566203
- current timestamp: 1768984424

## Description

New member conduit msig.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x381624F7912BddD83dc67c6C53Ef6FE61B87Cf07"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x21035a8a0409bc7dc8674ead554b97d937756c3e

# Diff at Fri, 16 Jan 2026 12:24:32 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@5858fbf220b5dda1ab2a19f029fdd9eb700ca7fa block: 1764933681
- current timestamp: 1768566203

## Description

Conduit Multisig 1 added a new signer, increasing members from 10 to 11 (threshold remains 4).

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x6BB4249858Ee19b6ABC071AD26bEe690baa783A6"
      values.multisigThreshold:
-        "4 of 10 (40%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x3eb5e57f667aee45a0fb70fffd8e1ae1fa0e0ed5

# Diff at Mon, 05 Jan 2026 17:44:32 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1764933681
- current timestamp: 1764933681

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933681 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x166f84c2e3f7597ee867a945fd8b086c9fbe6e8a

# Diff at Fri, 05 Dec 2025 11:22:39 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1edf3e71cea32596658a3ea017cea9df6408b77c block: 1759480862
- current timestamp: 1764933681

## Description

Conduit multisig key rotation.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x2103c69696CB2D3779f5445393808239034E911c"
      values.$members.0:
-        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
+        "eth:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.4:
-        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

Generated with discovered.json: 0x107eb7cba8473d36966393b84c1b3cd19a1ffd0b

# Diff at Fri, 03 Oct 2025 08:42:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1756214657
- current timestamp: 1759480862

## Description

Member removed from multisig.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0x0fc54bdad1105baefcf3365553d96791c9bb4706

# Diff at Fri, 26 Sep 2025 12:50:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1756214657
- current timestamp: 1756214657

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756214657 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x311b5c87f245D39f2B31965C5Cb8cB52797e422b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x9e75d3647689133d3fead2a87f49183d01b03aac

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xbf10d00d70d2512db03f4320e3146c3c53d8ba4f

# Diff at Tue, 26 Aug 2025 13:29:03 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@e10932be0db538f3a760bbc29232375f08915af7 block: 1755696922
- current timestamp: 1756214657

## Description

Conduit msig: removed one address

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.2:
-        "eth:0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 12 (33%)"
+        "4 of 11 (36%)"
    }
```

Generated with discovered.json: 0x6f0cd8876999bf2d5a4205e57ada394604aa2fb7

# Diff at Wed, 20 Aug 2025 13:36:07 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@67e41f566326dea91dc3f12a1b8947109f00301c block: 1755009465
- current timestamp: 1755696922

## Description

Upgrade to ArbOS v40 wasmModuleRoot.

## Watched changes

```diff
    contract RollupProxy (0x311b5c87f245D39f2B31965C5Cb8cB52797e422b) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v32 wasmModuleRoot"
+        "ArbOS v40 wasmModuleRoot"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
+        "0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a"
    }
```

Generated with discovered.json: 0x1a27375bd145e6b4736a4170001e6a4a189a93f6

# Diff at Tue, 12 Aug 2025 14:40:39 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e94498235c6c8b45d3e4bfb77316081ba540850a block: 1752589271
- current timestamp: 1755009465

## Description

Conduit Multisig 1 signer added.

## Watched changes

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
      values.multisigThreshold:
-        "4 of 11 (36%)"
+        "4 of 12 (33%)"
    }
```

Generated with discovered.json: 0x5bb4097cb73b19a6f1745044df3dc39793e78b90

# Diff at Tue, 15 Jul 2025 14:39:48 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22925142

## Description

standard orbit stack optimium with 1/1 DAC and custom gas token.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMath (0x036147913eEb42E97790F9a693246c8444290AB6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x0F8cF337D5A0A45e61559f6Ab1999FF8aA0eACD5)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract Bridge (0x1eeE9b9F024188E54930D2927d7a28e66E7649a7)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x231173CC90cB8486A7dbD1733B5105254316D50A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x27a66B6e6aFB0179Bf8E9B97af6e148a5eF79D97)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract RollupProxy (0x311b5c87f245D39f2B31965C5Cb8cB52797e422b)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x661b39a5EB200dFcbb436d98453BdBf88Da02AA1)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72b55c2C38EadE57C10047746632A369A060A46E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x9f403f2054736884518E6D3f510C02f5959BDCC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (0xa2809b5f031bf91d2408B3e2464774A28B0F4949)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xb343522e5663E0cE1060dd50EF04b12820F84890)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Outbox (0xDb5abc57397530DddC1e33BC023F2ef73Db6A86A)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF815C4c8A671395dAF5706DCB917CfA60DE7B3f9)
    +++ description: None
```

