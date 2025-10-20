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
