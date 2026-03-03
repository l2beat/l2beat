Generated with discovered.json: 0x32645ffa4b914c106b539c8e5ef86a7bda170b3f

# Diff at Wed, 11 Feb 2026 15:35:06 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@2e859859d90363aa5bf619da50a94cddbc1e3894 block: 1769514641
- current timestamp: 1770824041

## Description

Upgrade to BoLD dispute protocol and ArbOS v51 "Dia" (nitro-contracts v3.1.0+).

RollupProxy replaced with a new BoLD-enabled contract (`isPostBoLD: true`). Assertion-based state management replaces the old node-based system. Validators stake 0.1 ETH (WETH), validator whitelist remains enabled.

ChallengeManager replaced with EdgeChallengeManager implementing the BoLD multi-level bisection protocol: block-level edges (height 67M), 1 big-step level (height 524K), small-step edges (height 8.4M), with 0.1 ETH stake for big-step and small-step edges.

All core contracts upgraded: Bridge, Inbox, Outbox, RollupEventInbox, SequencerInbox. SequencerInbox gains delay buffer support (`isDelayBufferable: true`, currently set to max/disabled) and `feeTokenPricer` field. `delayBlocks` increased from 5760 to 7200.

All four OneStepProvers and OneStepProofEntry replaced with new versions. ValidatorUtils removed (no longer needed in BoLD).

ArbOS updated to v51 "Dia" (wasmModuleRoot `0x8a7513bf...`), adding Ethereum Fusaka support (secp256r1, BLS12-381, CLZ opcode), improved gas pricing, and native token mint/burn support.

## Watched changes

```diff
    contract RollupEventInbox (eth:0x02f3a60D25abF1844740a39cd9679227309a1Fa6) {
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
-        "eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8"
+        "eth:0xc3196FEE2b194bf699076865060d566c7Cb02892"
      implementationNames.eth:0xb0f031Cd10598c6b4C33FcE1675F26CF937091da:
-        "ERC20RollupEventInbox"
      implementationNames.eth:0x0d079b22B0B4083b9b0bDc62Bf1a4EAF4a95bDEe:
+        "ERC20RollupEventInbox"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverMath (eth:0x036147913eEb42E97790F9a693246c8444290AB6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract ChallengeManager (eth:0x0B5BbEedB3E8bc9a2352fFa0aED56b6fad8d3040)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
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
    contract ProxyAdmin (eth:0x256bBeDabDBa636a9Cd17890841C941a28e9437e) {
    +++ description: None
      directlyReceivedPermissions.1:
-        {"permission":"upgrade","from":"eth:0x0B5BbEedB3E8bc9a2352fFa0aED56b6fad8d3040","role":"admin"}
      directlyReceivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0xfFfEB1c8C3ec3c45c17E4E1EB547452DF9FF1A76","role":"admin"}
    }
```

```diff
    EOA  (eth:0x401Ba2e5037e3d8D1c32E77Dfd371501618604Bf) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"fastconfirm","from":"eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer","via":[{"address":"eth:0xA7A2cc389aFCcDE8A1F47F14dA88e82e7D99b68F"}]}
      receivedPermissions.1:
-        {"permission":"validate","from":"eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators","via":[{"address":"eth:0xA7A2cc389aFCcDE8A1F47F14dA88e82e7D99b68F"}]}
      receivedPermissions.2.role:
-        ".validators"
+        ".getValidators"
      receivedPermissions.2.from:
-        "eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8"
+        "eth:0xc3196FEE2b194bf699076865060d566c7Cb02892"
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.from:
-        "eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8"
+        "eth:0xc3196FEE2b194bf699076865060d566c7Cb02892"
      receivedPermissions.2:
-        {"permission":"upgrade","from":"eth:0x0B5BbEedB3E8bc9a2352fFa0aED56b6fad8d3040","role":"admin","via":[{"address":"eth:0x256bBeDabDBa636a9Cd17890841C941a28e9437e"},{"address":"eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","from":"eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8","role":"admin","via":[{"address":"eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xc3196FEE2b194bf699076865060d566c7Cb02892","role":"admin","via":[{"address":"eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xfFfEB1c8C3ec3c45c17E4E1EB547452DF9FF1A76","role":"admin","via":[{"address":"eth:0x256bBeDabDBa636a9Cd17890841C941a28e9437e"},{"address":"eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F"}]}
    }
```

```diff
    contract Bridge (eth:0x53b168016aA2E3469B5D76315311aAC4Ce0020DB) {
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
-        "eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8"
+        "eth:0xc3196FEE2b194bf699076865060d566c7Cb02892"
      implementationNames.eth:0xd7FD189F1652378f32dA3db7926e51a7b0344797:
-        "ERC20Bridge"
      implementationNames.eth:0x81be1Bf06cB9B23e8EEDa3145c3366A912DAD9D6:
+        "ERC20Bridge"
    }
```

```diff
    contract UpgradeExecutor (eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      directlyReceivedPermissions.1.from:
-        "eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8"
+        "eth:0xc3196FEE2b194bf699076865060d566c7Cb02892"
      directlyReceivedPermissions.2.from:
-        "eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8"
+        "eth:0xc3196FEE2b194bf699076865060d566c7Cb02892"
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (eth:0x72b55c2C38EadE57C10047746632A369A060A46E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract Inbox (eth:0x7d4509336b154C17Df80D03A19C051ddAcdA2e7f) {
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
-   Status: DELETED
    contract ValidatorUtils (eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
    contract SequencerInbox (eth:0x903Af716AA8C7C27Fd785F453D5a59C20E06bDeC) {
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
-        "eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8"
+        "eth:0xc3196FEE2b194bf699076865060d566c7Cb02892"
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
    contract RollupProxy (eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (eth:0x9f403f2054736884518E6D3f510C02f5959BDCC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract GnosisSafeL2 (eth:0xA7A2cc389aFCcDE8A1F47F14dA88e82e7D99b68F) {
    +++ description: None
      directlyReceivedPermissions:
-        [{"permission":"fastconfirm","from":"eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8","description":"Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.","role":".anyTrustFastConfirmer"},{"permission":"validate","from":"eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","role":".validators"}]
    }
```

```diff
    contract Outbox (eth:0xc0dd0a059a8a948B7737D00bfC9024475C791259) {
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
-        "eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8"
+        "eth:0xc3196FEE2b194bf699076865060d566c7Cb02892"
      implementationNames.eth:0x1f24EDD5161f82588007f33B72b0b28e46cCE878:
-        "ERC20Outbox"
      implementationNames.eth:0x17E0C5fE0dFF2AE4cfC9E96d9Ccd112DaF5c0386:
+        "ERC20Outbox"
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
    contract OneStepProofEntry (eth:0x91cB57F200Bd5F897E41C164425Ab4DB0991A64f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0xc3196FEE2b194bf699076865060d566c7Cb02892)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
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

```diff
+   Status: CREATED
    contract EdgeChallengeManager (eth:0xfFfEB1c8C3ec3c45c17E4E1EB547452DF9FF1A76)
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

## Source code changes

```diff
.../Bridge/ERC20Bridge.sol                         |  306 +-
 .../ChallengeManager.sol => /dev/null              |  994 -----
 .../EdgeChallengeManager/EdgeChallengeManager.sol  | 3193 +++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |   18 +-
 .../Inbox/ERC20Inbox.sol                           |  430 +-
 .../OneStepProofEntry.sol                          |  656 +--
 .../{.flat@1769514641 => .flat}/OneStepProver0.sol |  502 ++-
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

Generated with discovered.json: 0x89d6c1d5df1d7285467ea12463680b3d2689f5fb

# Diff at Tue, 27 Jan 2026 11:52:12 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@01c924f177b66fde012756076e94adb03520b757 block: 1768984464
- current timestamp: 1769514641

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

Generated with discovered.json: 0xedc96de8f833ec29af7fad17f4fa2899886e04e4

# Diff at Wed, 21 Jan 2026 08:35:27 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@a72aa7d50f1dddc0c7a6eae7f60679fc94e4eabf block: 1768566203
- current timestamp: 1768984464

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

Generated with discovered.json: 0x204490827c376336dee42af9a81714e9f30ee2eb

# Diff at Fri, 16 Jan 2026 12:24:33 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@5858fbf220b5dda1ab2a19f029fdd9eb700ca7fa block: 1764933841
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

Generated with discovered.json: 0xfa59f58868150c872518493eb10aef0483157f03

# Diff at Mon, 05 Jan 2026 17:44:57 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1764933841
- current timestamp: 1764933841

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933841 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xc1ce8d3aa65bab8ccb64941153b44129574ecce0

# Diff at Fri, 05 Dec 2025 11:25:21 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1edf3e71cea32596658a3ea017cea9df6408b77c block: 1759480962
- current timestamp: 1764933841

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

Generated with discovered.json: 0x71ee44eaf521e8eff9cd0f83c4e53bd6f5e5d97d

# Diff at Fri, 03 Oct 2025 08:43:50 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e647409961cd173771dcfcaeb808991c99e73911 block: 1758210381
- current timestamp: 1759480962

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

Generated with discovered.json: 0x208ec078b7ae2617b1b511d8df83648eb211ee6e

# Diff at Fri, 26 Sep 2025 13:10:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1758210381
- current timestamp: 1758210381

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758210381 (main branch discovery), not current.

```diff
    contract RollupProxy (eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x40db531f00c9191379cfbcc3d8d2d9a0d63d75de

# Diff at Thu, 18 Sep 2025 15:47:28 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@0bdfa87489b47d7662c688d0c187b81dffc81e27 block: 1757939365
- current timestamp: 1758210381

## Description

Update to ArbOS v40.

## Watched changes

```diff
    contract RollupProxy (eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8) {
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

Generated with discovered.json: 0x9dc3f705f9b834771df564fffb39be83bf2979da

# Diff at Mon, 15 Sep 2025 12:31:29 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@823103e23195ea5382f353da97a0232ffda42a10 block: 1757506676
- current timestamp: 1757939365

## Description

Verified L1OrbitUSDCGateway contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757506676 (main branch discovery), not current.

```diff
    contract L1OrbitUSDCGateway (eth:0x23593421341152D5322F8869c0638DAAc4aED57C) {
    +++ description: Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally.
      unverified:
-        true
      values.burnAmount:
+        0
      values.burner:
+        "eth:0x0000000000000000000000000000000000000000"
      values.counterpartGateway:
+        "eth:0xfC55Ec44Ff8032E82c7EcFF34cBEACb14152DC48"
      values.depositsPaused:
+        false
      values.inbox:
+        "eth:0x7d4509336b154C17Df80D03A19C051ddAcdA2e7f"
      values.l1USDC:
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.l2USDC:
+        "eth:0x0F3B6CC558A714ecf4Cc9ec8caFF0b57ECf65890"
      values.owner:
+        "eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      values.router:
+        "eth:0x8b4b4328455615fCb7aaE14460cfa90767B1df55"
      implementationNames.eth:0xca8b6572477f5b5c5a2b1C7fEad58cF3DA5CD211:
-        ""
+        "L1OrbitUSDCGateway"
      template:
+        "circle/L1OrbitUSDCGateway"
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x5c7b5d634bb6392d1662b17adb247ff923a285a471ad50aca1f9d34d82ddf671"]
      description:
+        "Orbit stack specific escrow (gateway) for Circle USDC that uses the canonical bridge for messaging but is governed externally."
    }
```

```diff
    contract ProxyAdmin (eth:0x256bBeDabDBa636a9Cd17890841C941a28e9437e) {
    +++ description: None
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","from":"eth:0x46D9ff7ED3049798B406be811FE68b75B208f81A","role":"admin"}
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x8b4b4328455615fCb7aaE14460cfa90767B1df55","role":"admin"}
    }
```

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0x46D9ff7ED3049798B406be811FE68b75B208f81A","role":"admin","via":[{"address":"eth:0x256bBeDabDBa636a9Cd17890841C941a28e9437e"},{"address":"eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0x8b4b4328455615fCb7aaE14460cfa90767B1df55","role":"admin","via":[{"address":"eth:0x256bBeDabDBa636a9Cd17890841C941a28e9437e"},{"address":"eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F"}]}
    }
```

```diff
+   Status: CREATED
    contract ERC20Gateway (eth:0x46D9ff7ED3049798B406be811FE68b75B208f81A)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract GatewayRouter (eth:0x8b4b4328455615fCb7aaE14460cfa90767B1df55)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

Generated with discovered.json: 0x1a6c3ea30b47595f4f3bb14009908947e1857645

# Diff at Wed, 10 Sep 2025 12:26:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1757506676

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0x02f3a60D25abF1844740a39cd9679227309a1Fa6)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0x036147913eEb42E97790F9a693246c8444290AB6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (eth:0x0B5BbEedB3E8bc9a2352fFa0aED56b6fad8d3040)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x21c6F81b1063f09A6c26EDc74fBb9beb349A5E96)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0x231173CC90cB8486A7dbD1733B5105254316D50A)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitUSDCGateway (eth:0x23593421341152D5322F8869c0638DAAc4aED57C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x256bBeDabDBa636a9Cd17890841C941a28e9437e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x2A7F4d60fE6dD63c4690Dd9f11C26D0BE53b3110)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (eth:0x53b168016aA2E3469B5D76315311aAC4Ce0020DB)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0x6a23390d8a086c1091188f8Db702E91DCA38805F)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x72b55c2C38EadE57C10047746632A369A060A46E)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x7d4509336b154C17Df80D03A19C051ddAcdA2e7f)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (eth:0x84eA2523b271029FFAeB58fc6E6F1435a280db44)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0x903Af716AA8C7C27Fd785F453D5a59C20E06bDeC)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x9f3dC4D1f6c6D9F2273d8b497E460E6E727210e8)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0x9f403f2054736884518E6D3f510C02f5959BDCC6)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (eth:0xA7A2cc389aFCcDE8A1F47F14dA88e82e7D99b68F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xc0dd0a059a8a948B7737D00bfC9024475C791259)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
