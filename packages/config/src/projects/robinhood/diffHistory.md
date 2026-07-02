Generated with discovered.json: 0x5f4eaba927cd929293ad8608c5f0561d44e6389b

# Diff at Thu, 02 Jul 2026 09:13:52 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1782983567

## Description

Initial discovery.

The ArbOS 61 core contracts are newer builds of standard Orbit contracts, so their
shapes were registered on the shared `orbitstack` templates. Code diff of each
Robinhood implementation vs the closest existing template shape (impl-to-impl):

- **SequencerInbox** — [diff](https://disco.l2beat.com/diff/eth:0x98a58ADAb0f8A66A1BF4544d804bc0475dff32c7/eth:0xb015D78fb9B890e96FD3E23819b2C8D9fffA3cC5)
  Adds a fee-token pricer, a custom-DA header flag (`0x01`) and delay-proof paths; batchPoster/owner privileged surface is unchanged.
- **RollupProxy (RollupAdminLogic)** — [diff](https://disco.l2beat.com/diff/eth:0x7FC126FF51183a78C5E0437467f325f661D8Df17/eth:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82)
  ArbOS 61 admin logic; all setters (allowlist, fee-token, batch-poster mgr, AFK-whitelist) stay owner-gated — covered by the template `owner` permission.
- **RollupProxy (RollupUserLogic)** — [diff](https://disco.l2beat.com/diff/eth:0x6490bA0a60Cc7d3a59C9eeE135D9eeD24553a60d/eth:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C)
  ArbOS 61 user logic; BoLD assertion/force-inclusion flow and `getValidators` proposer set unchanged.
- **RollupEventInbox** — [diff](https://disco.l2beat.com/diff/eth:0x6D576E220Cb44C3E8eF75D0EfBeb1Ff041e2E4A5/eth:0x796FeE4adceD1cb47a3e3d1B6925472F8fC8f1f9)
  BoLD event inbox; only `initialize` is rollup-gated, no standing permissions.
- **OneStepProofEntry** — [diff](https://disco.l2beat.com/diff/eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC/eth:0x5087a6fD526eFD5c6770d94D0c325de0e2A2c44D)
  Stateless proof dispatcher, ArbOS 61 opcode set; no state, no permissions.
- **OneStepProver0** — [diff](https://disco.l2beat.com/diff/eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5/eth:0x6fE84aC811EBEcd888Eca93757fEa378Bb03b00c)
  Stateless one-step WASM verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverMath** — [diff](https://disco.l2beat.com/diff/eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD/eth:0x4B15E064d5d55705E89080bDEA4BFe4cF20D6114)
  Stateless math-opcode verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverMemory** — [diff](https://disco.l2beat.com/diff/eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB/eth:0x665CEA1cA6C36aB701f4C6AE895b156f79C51c35)
  Stateless memory-opcode verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverHostIo** — [diff](https://disco.l2beat.com/diff/eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4/eth:0xe1aAfAfBde42f043495B39d1a15a58E91c894Fbf)
  Stateless host-io verifier; ArbOS 61 host-io/opcode updates only, no state/permissions.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D) [orbitstack/Inbox]
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract Safe (eth:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (eth:0x23A19d23e89166adedbDcB432518AB01e4272D94) [orbitstack/RollupProxyBoLD]
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverMath (eth:0x4B15E064d5d55705E89080bDEA4BFe4cF20D6114) [orbitstack/OneStepProverMath]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (eth:0x5087a6fD526eFD5c6770d94D0c325de0e2A2c44D) [orbitstack/OneStepProofEntry]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf) [orbitstack/UpgradeExecutor]
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (eth:0x665CEA1cA6C36aB701f4C6AE895b156f79C51c35) [orbitstack/OneStepProverMemory]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EdgeChallengeManager (eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa) [orbitstack/EdgeChallengeManager]
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (eth:0x6fE84aC811EBEcd888Eca93757fEa378Bb03b00c) [orbitstack/OneStepProver0]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96) [orbitstack/SequencerInbox]
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4) [orbitstack/RollupEventInbox]
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract Bridge (eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3) [orbitstack/Bridge]
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (eth:0xe1aAfAfBde42f043495B39d1a15a58E91c894Fbf) [orbitstack/OneStepProverHostIo]
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9) [orbitstack/Outbox]
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```
