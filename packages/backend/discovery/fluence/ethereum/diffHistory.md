Generated with discovered.json: 0x5dbb652288446df9c587ed6d23724e9f0ab385a2

# Diff at Fri, 29 Nov 2024 09:31:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 21285836
- current block number: 21285836

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285836 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd","via":[{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"},{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}]}
      receivedPermissions.9.target:
-        "0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd"
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.9.via.1:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.9.via.0.address:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.8.target:
-        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
+        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
      receivedPermissions.8.via.1:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.8.via.0.address:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
      receivedPermissions.7.target:
-        "0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0"
+        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
      receivedPermissions.6.target:
-        "0x89De2771f84b8fd0d09560f75908D6F6a1273A6e"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.5.target:
-        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
+        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
      receivedPermissions.4.target:
-        "0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A"
+        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
      receivedPermissions.3.target:
-        "0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D"
+        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
      receivedPermissions.2.target:
-        "0x50Df2E43aDefee3b6510b637697d30e7dc155e13"
+        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
      receivedPermissions.1.target:
-        "0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F"
+        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95"
+        "0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"
      receivedPermissions.0.via.1:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7"}
      receivedPermissions.0.via.0.address:
-        "0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790"
+        "0x6BCe4c44668C77ff67730C14d2378857103F53C7"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0x505aFCB1502aa5589e4b5F948275100551E79b7b","via":[]}
      issuedPermissions.3.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.3.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.3.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.1.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.1.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.target:
-        "0x0000000000000000000000000000000000000000"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.0.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xb1461e556fc13132b9ea66329c0ded9de9b5f5c4

# Diff at Thu, 28 Nov 2024 11:15:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 21270981
- current block number: 21285836

## Description

Gelato MS added as second executor.

## Watched changes

```diff
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
      values.accessControl.EXECUTOR_ROLE.members.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.executors.1:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"validate","target":"0x505aFCB1502aa5589e4b5F948275100551E79b7b","via":[]}
      issuedPermissions.2.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.2.target:
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0},{"address":"0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790","delay":0}]}
    }
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GelatoMultisig/GnosisSafe.sol   | 953 +++++++++++++++++++++
 .../.flat/GelatoMultisig/GnosisSafeProxy.p.sol     |  35 +
 2 files changed, 988 insertions(+)
```

Generated with discovered.json: 0x23eeabd5772a47856f34b6f15686a7c5ec0c5b4f

# Diff at Tue, 26 Nov 2024 09:19:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2a3b80d2c777b6125ac0d9d7c441cf8578a57a5f block: 21128887
- current block number: 21270981

## Description

ArbOS v32 upgrade to known contracts.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      values.$implementation:
-        "0x1D901DD7A5eFE421C3C437B147040E5AF22E6A43"
+        "0x02E05A9245C5853f895daDcc3A8216C953C8736B"
      values.$pastUpgrades.1:
+        ["2024-11-25T14:08:23.000Z","0x788c3362a0afa116cef977fba73d4b39186dd5f4222f594b31469c115499acbc",["0x02E05A9245C5853f895daDcc3A8216C953C8736B"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0x57EA090Ac0554d174AE0e2855B460e84A1A7C221"
+        "0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","target":"0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f"}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "upgrade"
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.0.target:
-        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.0.via.0:
-        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      values.$implementation.1:
-        "0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1"
+        "0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"
      values.$implementation.0:
-        "0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A"
+        "0x9B56A789fEDD5df27dBaB53b085F7157397cA17D"
      values.$pastUpgrades.1:
+        ["2024-11-25T14:08:23.000Z","0x788c3362a0afa116cef977fba73d4b39186dd5f4222f594b31469c115499acbc",["0x9B56A789fEDD5df27dBaB53b085F7157397cA17D","0x5607Ea4b5F6e3F610bD346B36D3143FFf46d1C34"]]
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
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x0003A96B27ce73505b43ea1b71a5aB06bec568C4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x1cD76B9C33b2e3b04D7B181399d492B3e49AD7fB)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x2dCCAbE89cF76132619a9B18e9F9e48E837222b5)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x8Faa21891B0b928afEbd5314D1D313f8f7B34DaC)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xCf4b98cFF2976E4eb579B9498f398b5bd279A6eD)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@21128887 => .flat}/OneStepProver0.sol   | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0x7eb381761b7d1025a73c07541c04a05e5424be41

# Diff at Fri, 15 Nov 2024 08:18:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 21128887
- current block number: 21128887

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21128887 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e) {
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
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0xBc54708fB6C6C97086e3f6554a517DE5EF16c304","via":[{"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0}]}
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
-        "0x505aFCB1502aa5589e4b5F948275100551E79b7b"
+        "0xBc54708fB6C6C97086e3f6554a517DE5EF16c304"
      issuedPermissions.0.via.0:
+        {"address":"0x6BCe4c44668C77ff67730C14d2378857103F53C7","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

Generated with discovered.json: 0x8e49aa93da332bcc7872bd4ace5e1d57eb67e23e

# Diff at Wed, 06 Nov 2024 13:24:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21128887

## Description

Standard orbit stack anytrust 1/2 optimium with naughty eoa admin (0.96 alienx similarity).

## Initial discovery

```diff
+   Status: CREATED
    contract ERC20Inbox (0x06084a0AC843084a1d1B8ba0f67E048e4f8f3B95)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x17e7F68ce50A77e55C7834ddF31AEf86403B8010)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1c46E1029C2Bd8b18448faA9Ab0ac03412D46790)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x284696FB7BF57dB7133Fd8c9EB74f49A76b2485F)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x2b0E04Dc90e3fA58165CB41E2834B44A56E766aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Outbox (0x50Df2E43aDefee3b6510b637697d30e7dc155e13)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x57EA090Ac0554d174AE0e2855B460e84A1A7C221)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D)
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
```

```diff
+   Status: CREATED
    contract ERC20Bridge (0x5E6B2D08EA7B3251fef4a244F54D508E0cBD6D3A)
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x6BCe4c44668C77ff67730C14d2378857103F53C7)
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x72B166070781a552D7b95a907eF59ca05d3D5a62)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x89De2771f84b8fd0d09560f75908D6F6a1273A6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x8b73Ef238ADaB31EBC7c05423d243c345241a22f)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x90eC62De2EB7C7512a22bD2D55926AD6bA609F38)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xD04Cf183526aDC4a37B72D49bFe6eE19d9E19bd0)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupProxy (0xD085B74A57D1d7947B9C9f8E2d75cB6832d62d0f)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0xEed3cDE012D1F46304dE892186Ad391Ccb994BBd)
    +++ description: None
```
