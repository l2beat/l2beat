Generated with discovered.json: 0x22e6130effae2201921b460f6857aa1d07e6af4c

# Diff at Mon, 02 Dec 2024 08:55:36 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 280513116

## Description

Standard orbit stack L3 with native token EDU and admin EOA, launch on Dec 2nd (Gelato).

## Initial discovery

```diff
+   Status: CREATED
    contract ChallengeManager (0x14dBe58192B60b5207b86c751255B34550Bd12Fb)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x33c1514Bf90e202d242C299b37C60f908aa206D4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x419e439e5c0B839d6e31d7C438939EEE1A4f4184)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x54E0923782b701044444De5d8c3A45aC890b0881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20Inbox (0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x6339965Cb3002f5c746895e4eD895bd775dbfdf9)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x6c21303F5986180B1394d2C89f3e883890E2867b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x9132151475ACCf0662C545Bc81FbC1741d978EE0)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xBaE3B462a2A7fb758F66D91170514C10B14Ce914)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xD36cd2624a7187ED41ec30FC1d6E6B7b3abAf251)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD89d54007079071cBA859127318b9F34eeB78049)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6)
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
```

```diff
+   Status: CREATED
    contract L1OrbitCustomGateway (0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759)
    +++ description: Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xE58a2dEb5718F9aAF2C1DdD0E366ED076D204cc4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract EduFastConfirmerMultisig (0xF4620078b10CDfD0Dc8E4BCec4250642fa5B517b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xf8E5e5562c2c12d8690786f5C9FA65F20F6bD881)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```
