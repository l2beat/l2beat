Generated with discovered.json: 0x95afca38de1bef98fa2e27b1c756532ffbda25cc

# Diff at Wed, 07 Jan 2026 16:10:53 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@b319218f320edec871f10dbd490519684995e58e block: 1761914121
- current timestamp: 1767802188

## Description

Inbox and SequencerInbox upgrade:
- 7702 adjustments

## Watched changes

```diff
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.1:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "arb1:0x3De02cf69192f4805edE47d7fA5efa614c5A6593"
+        "arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"
      values.$pastUpgrades.1:
+        ["2026-01-06T14:31:59.000Z","0x6ba75dc2936bc08617505e2a1abc4d117e98fc03707dbce6a598331ae6e21e7c",["arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.arb1:0x3De02cf69192f4805edE47d7fA5efa614c5A6593:
-        "SequencerInbox"
      implementationNames.arb1:0x7be08B013de2b23a6329De51C4994f841dcE1a10:
+        "SequencerInbox"
    }
```

```diff
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.1:
-        "0xb2c117c2e00734a82fe4ab27d5fe91a6e152c06bbcdbf83db021ad32b6be3e60"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "arb1:0x0f728dd0217E26120A304B3Fa554C3Ba2b2aF535"
+        "arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"
      values.$pastUpgrades.1:
+        ["2026-01-06T14:31:59.000Z","0x6ba75dc2936bc08617505e2a1abc4d117e98fc03707dbce6a598331ae6e21e7c",["arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.arb1:0x0f728dd0217E26120A304B3Fa554C3Ba2b2aF535:
-        "ERC20Inbox"
      implementationNames.arb1:0xD87f160f8c414d834cBDd9477c3D8c3ad1802255:
+        "ERC20Inbox"
    }
```

## Source code changes

```diff
.../Inbox/ERC20Inbox.sol                           | 16 +++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 31 insertions(+), 9 deletions(-)
```

Generated with discovered.json: 0xa5fc21cc15e92c13dcd4fb27c46c67ac71f02400

# Diff at Mon, 05 Jan 2026 17:44:13 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c679543996c33dd4145a38ea0d7fccd3b24d8951 block: 1761914121
- current timestamp: 1761914121

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1761914121 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499:
+        "ArbOS v51 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x51b011ebb00a1871d1aada8630291abf104dfc63

# Diff at Fri, 31 Oct 2025 13:06:21 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1761914121

## Description

First discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (arb1:0x09fDA6447fA7758EA9245ac78Ca3c9ba68CBfd3d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (arb1:0x3131627362AD79b3D831559E0AfC986BF60A6870)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract SequencerInbox (arb1:0x38d41Ac2fbc3f13FcA7838F6638D8FbDb189e807)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (arb1:0x3930AD9a21dA38E63d52B43b0c530CB0AACcB389)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (arb1:0x39919941b42DAb335d9924Ef56dF7b9813b2D6d9)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract Inbox (arb1:0x446626827f14F89B38D5bA1ab152B484cd7912fD)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract SafeL2 (arb1:0x871e290d5447b958131F6d44f915F10032436ee6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (arb1:0x8D9e5bB33Da252739780e3df5F9E686fd11E0536)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (arb1:0xa0d6E6b1B950aCC748B45F3419FeAd4b52f7389A)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (arb1:0xA6D1cE7210353E431CE79f41BcFA9Ea3Ae507b98)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (arb1:0xA9F4ee72439afC704db48dc049CbFb7E914aD300)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (arb1:0xAc9348017885a132F1A0614B508F632A56B90ec4)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract RollupProxy (arb1:0xc930fd48846e956b308f28524dA2d5E14c832e33)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (arb1:0xcD3D1CFE5e0cDa77D0a2D1ac1c0268C77115f89D)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (arb1:0xD3dE403eADdf791104918E9C9336B434AE7DDA01)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (arb1:0xF5f5bc097ca8f4bE96D8CdE86c96Bd2d81fd2585)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
