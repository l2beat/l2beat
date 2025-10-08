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

