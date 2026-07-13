Generated with discovered.json: 0xd4ee2b65c075a2e41ae1b9b1350dde933a74c0ac

# Diff at Tue, 07 Jul 2026 22:02:36 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1fd9d39064602bc28714717ec6eae23c740b472b block: 1782988636
- current timestamp: 1783461693

## Description

ProxyAdmin, Inbox and the eight upgradeable proxies became verified on Etherscan; the permission view now shows the upgrade chain through ProxyAdmin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1782988636 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD) [global/ProxyAdmin] {
    +++ description: None
      unverified:
-        true
      receivedPermissions:
-        [{"permission":"upgrade","from":"eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D","role":"admin"},{"permission":"upgrade","from":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf","role":"admin"},{"permission":"upgrade","from":"eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB","role":"admin"},{"permission":"upgrade","from":"eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa","role":"admin"},{"permission":"upgrade","from":"eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0","role":"admin"},{"permission":"upgrade","from":"eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96","role":"admin"},{"permission":"upgrade","from":"eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4","role":"admin"},{"permission":"upgrade","from":"eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3","role":"admin"},{"permission":"upgrade","from":"eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9","role":"admin"},{"permission":"upgrade","from":"eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B","role":"admin"}]
      values.owner:
+        "eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"
      implementationNames.eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD:
-        ""
+        "ProxyAdmin"
      template:
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0xae641c7d7a83bba7fa913b9544f946dc23ca0527c2f4abb9c6a3496f49375218"]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D","role":"admin"},{"permission":"upgrade","from":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf","role":"admin"},{"permission":"upgrade","from":"eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB","role":"admin"},{"permission":"upgrade","from":"eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa","role":"admin"},{"permission":"upgrade","from":"eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0","role":"admin"},{"permission":"upgrade","from":"eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96","role":"admin"},{"permission":"upgrade","from":"eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4","role":"admin"},{"permission":"upgrade","from":"eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3","role":"admin"},{"permission":"upgrade","from":"eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9","role":"admin"},{"permission":"upgrade","from":"eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B","role":"admin"}]
    }
```

```diff
    contract Inbox (eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D) [orbitstack/Inbox] {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract Safe (eth:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe] {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"upgrade","from":"eth:0x1A07cc4BD17E0118BdB54D70990D2158AbAD7a2D","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","from":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","from":"eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","from":"eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","from":"eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","from":"eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
      receivedPermissions.11:
+        {"permission":"upgrade","from":"eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B","role":"admin","via":[{"address":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD"},{"address":"eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf"}]}
    }
```

```diff
    contract RollupProxy (eth:0x23A19d23e89166adedbDcB432518AB01e4272D94) [orbitstack/RollupProxyBoLD] {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new assertions (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both called Validators).
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xceae1f18c42f53fe2c8af2f1e6997f71f806199ea36af2e17279efdb25f798a6"
      implementationNames.eth:0x23A19d23e89166adedbDcB432518AB01e4272D94:
-        ""
+        "RollupProxy"
    }
```

```diff
    contract UpgradeExecutor (eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf) [orbitstack/UpgradeExecutor] {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      directlyReceivedPermissions.0:
+        {"permission":"act","from":"eth:0x1232813BDd40aa9d53066A880dE78a4Be70B90FD","role":".owner"}
      implementationNames.eth:0x552603b4bc1f5E896AF2854548D6380f45f1B4bf:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract EdgeChallengeManager (eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa) [orbitstack/EdgeChallengeManager] {
    +++ description: Contract that implements the main challenge protocol logic of the fraud proof system.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0x6f38FC91105Fc9a43931DcA33450ab3315E3D4Fa:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract SequencerInbox (eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96) [orbitstack/SequencerInbox] {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract RollupEventInbox (eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4) [orbitstack/RollupEventInbox] {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0xc34f4907822d1cDC6aE3038Be22e6f12DEa35bd4:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract Bridge (eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3) [orbitstack/Bridge] {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0xDf8755334ce7A73cCF6b581C02eA649AE3E864b3:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
    contract Outbox (eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9) [orbitstack/Outbox] {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      unverified:
-        true
      sourceHashes.0:
-        null
+        "0xd87f004d37330210f1eb137e4498b14ba6340f079eaa0e9e7a22c1d4f76dde7d"
      implementationNames.eth:0xf0ce991ea4A0d2400A4AB49b20ae333f6Dce3DE9:
-        ""
+        "TransparentUpgradeableProxy"
    }
```

```diff
+   Status: CREATED
    contract ArbFilteredTransactionsManager (robinhood:0x0000000000000000000000000000000000000074) [N/A]
    +++ description: ArbOS 61 transaction-filtering precompile. An authorized filterer registers tx hashes here; the state transition function then forcibly fails those transactions, including force-included ones, without delay.
```

```diff
+   Status: CREATED
    contract SafeL2 (robinhood:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2UpgradeExecutor (robinhood:0x2A153c6A1B66DBc930a8d7017230ab0253005C09) [orbitstack/UpgradeExecutor]
    +++ description: ArbOS chain owner (UpgradeExecutor). Manages the ArbOwner chain-owner set and the transaction-filterer set, and can upgrade ArbOS configuration without delay.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (robinhood:0xa3Acd31AFb851B4eB9DAD00F5204c01D924267dF) [global/ProxyAdmin]
    +++ description: None
```

Generated with discovered.json: 0x1e2edb2d1a274576e1bfa40dd36649d8608e749a

# Diff at Mon, 06 Jul 2026 12:22:14 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1783340534

## Description

Adds L2 (robinhood chain) discovery of the ArbOS 61 transaction-filtering
mechanism, its authorized filterers, and the L2-side governance that controls it.

- **ArbFilteredTransactionsManager** (`robinhood:0x…74`) — the ArbOS 61
  transaction-filtering precompile. `filteredTransactionsAdded = 2`,
  `filteredTransactionsDeleted = 0`: two transactions are currently on the
  censored list. The state transition function forcibly fails a filtered
  transaction, including one force-included via the L1 delayed inbox, without
  delay. Its `transactionFilterers` set holds the addresses authorized to
  register/remove entries here. Precompiles have no verifiable on-chain
  bytecode, so its source is pointed at the Nitro implementation.
- **TransactionFilterer** (`robinhood:0xebDc…24b7`) — EOA authorized to
  register/remove transaction hashes in the precompile above.
- **L2UpgradeExecutor** (`robinhood:0x2A15…5C09`) — the sole ArbOS chain owner,
  which can add or remove transaction filterers.
- **SafeL2** (`robinhood:0x1F3B…31C5`) — the 2-of-3 Gnosis Safe holding
  `EXECUTOR_ROLE` on the L2UpgradeExecutor (same address as the L1 governance Safe).
- **ProxyAdmin** (`robinhood:0xa3Ac…67dF`) — admin of the L2UpgradeExecutor proxy.

## Changes

```diff
+   Status: CREATED
    contract ArbFilteredTransactionsManager (robinhood:0x0000000000000000000000000000000000000074) [N/A]
    +++ description: ArbOS 61 transaction-filtering precompile. An authorized filterer registers tx hashes here; the state transition function then forcibly fails those transactions, including force-included ones, without delay.
```

```diff
+   Status: CREATED
    contract SafeL2 (robinhood:0x1F3Bdec08A161Ca9e5480feF33A3B2278c2931C5) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2UpgradeExecutor (robinhood:0x2A153c6A1B66DBc930a8d7017230ab0253005C09) [orbitstack/UpgradeExecutor]
    +++ description: ArbOS chain owner (UpgradeExecutor). Manages the ArbOwner chain-owner set and the transaction-filterer set, and can upgrade ArbOS configuration without delay.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (robinhood:0xa3Acd31AFb851B4eB9DAD00F5204c01D924267dF) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    EOA TransactionFilterer (robinhood:0xebDc18A1F5C42fC25552eA233fAcf4054DF224b7)
    +++ description: None
```

Generated with discovered.json: 0x2c1745b43c2422d989b78335e3a9218864c2a226

# Diff at Thu, 02 Jul 2026 10:38:22 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1782988636

## Description

Initial discovery.

The chain uses ArbOS 61 core contracts, newer builds of standard Orbit contracts.

- **SequencerInbox** — [diff](https://disco.l2beat.com/diff/eth:0x98a58ADAb0f8A66A1BF4544d804bc0475dff32c7/eth:0xb015D78fb9B890e96FD3E23819b2C8D9fffA3cC5)
  Adds an owner-only `setFeeTokenPricer` (inert here: `isUsingFeeToken=false`, `feeTokenPricer=0x0`), a custom-DA header flag (`0x01`, unused — chain posts blobs), and delay-proof paths. No new actors beyond the existing owner/batchPoster.
- **RollupProxy (RollupAdminLogic)** — [diff](https://disco.l2beat.com/diff/eth:0x7FC126FF51183a78C5E0437467f325f661D8Df17/eth:0xAb7A44CE7e66963d2116dCe74AB63eeF88266C82)
  ArbOS 61 admin logic; all setters (allowlist, fee-token, batch-poster mgr, AFK-whitelist) stay owner-gated — covered by the template `owner` permission.
- **RollupProxy (RollupUserLogic)** — [diff](https://disco.l2beat.com/diff/eth:0x6490bA0a60Cc7d3a59C9eeE135D9eeD24553a60d/eth:0xedC23dFC7D1e57EC07eA5ff7419634DbAe08Ed2C)
  ArbOS 61 user logic; BoLD assertion/force-inclusion flow and `getValidators` proposer set unchanged.
- **RollupEventInbox** — [diff](https://disco.l2beat.com/diff/eth:0x6D576E220Cb44C3E8eF75D0EfBeb1Ff041e2E4A5/eth:0x796FeE4adceD1cb47a3e3d1B6925472F8fC8f1f9)
  BoLD event inbox; only `initialize` is rollup-gated, no standing permissions.
- **OneStepProofEntry** — [diff](https://disco.l2beat.com/diff/eth:0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC/eth:0x5087a6fD526eFD5c6770d94D0c325de0e2A2c44D)
  Proof dispatcher (ArbOS 61 opcode set); immutable constructor-set prover addresses, no mutable state, no permissions.
- **OneStepProver0** — [diff](https://disco.l2beat.com/diff/eth:0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5/eth:0x6fE84aC811EBEcd888Eca93757fEa378Bb03b00c)
  Stateless one-step WASM verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverMath** — [diff](https://disco.l2beat.com/diff/eth:0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD/eth:0x4B15E064d5d55705E89080bDEA4BFe4cF20D6114)
  Stateless math-opcode verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverMemory** — [diff](https://disco.l2beat.com/diff/eth:0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB/eth:0x665CEA1cA6C36aB701f4C6AE895b156f79C51c35)
  Stateless memory-opcode verifier; ArbOS 61 opcode updates only, no state/permissions.
- **OneStepProverHostIo** — [diff](https://disco.l2beat.com/diff/eth:0x0003A96B27ce73505b43ea1b71a5aB06bec568C4/eth:0xe1aAfAfBde42f043495B39d1a15a58E91c894Fbf)
  Host-io verifier (ArbOS 61 host-io/opcode updates); immutable `customDAValidator` (`0x0` here, so custom-DA proof paths revert), no mutable state, no permissions.

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
    contract L1GatewayRouter (eth:0x6a2E3a1e16FC29f27Ce61429746D558d656975bB) [orbitstack/GatewayRouter]
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
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
    contract L1ERC20Gateway (eth:0x85001CC4867C5e1C22dA4B79BB8852B9e2a06da0) [orbitstack/ERC20Gateway]
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract SequencerInbox (eth:0xBd0D173EEb87D57A09521c24388a12789F33ba96) [orbitstack/SequencerInbox]
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) [N/A]
    +++ description: None
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

```diff
+   Status: CREATED
    contract L1WethGateway (eth:0xF7e12b9614b509C747ab4423bC4ACF923759Cf1B) [N/A]
    +++ description: None
```
