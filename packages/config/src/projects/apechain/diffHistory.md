Generated with discovered.json: 0x59797193bd1e4fa693846e318c9ce567fc8f877a

# Diff at Wed, 15 Oct 2025 14:25:32 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@e6369d132630f14e783254ffb9e866e883328b9b block: 1750247636
- current timestamp: 1760538265

## Description

Apechain now uses Espresso sequencer.

## Watched changes

```diff
    EOA  (arb1:0x5737CDBb3a67001441C0DA8b86e6b1826705601c) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C","description":"Add/remove batchPosters (Sequencers).","role":".batchPosterManager"}]
    }
```

```diff
    contract SequencerInbox (arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here.
      template:
-        "orbitstack/SequencerInbox"
+        "orbitstack/SequencerInbox_Espresso"
      sourceHashes.1:
-        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
+        "0x724a7b4f0fa3a5ce6b00cc932e70b6b83a05d1a846a341cbf8477dc95f6c916c"
      description:
-        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
+        "The Espresso TEE sequencer (registered in this contract) can submit transaction batches or commitments here."
      values.$implementation:
-        "arb1:0x0DD7dA1805d207511bb3Edabe9352B9E316048bE"
+        "arb1:0xCfAfB803EF1FEc576138Cebc79Ad41Aa6760C575"
      values.$pastUpgrades.2:
+        ["2025-10-14T19:31:30.000Z","0xf2787805eb5c45529aacb68a446f51693fa2ffabbbe77585921d236a9b43d97a",["arb1:0xCfAfB803EF1FEc576138Cebc79Ad41Aa6760C575"]]
      values.$upgradeCount:
-        2
+        3
      values.batchPosterManager:
-        "arb1:0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
+        "arb1:0x3918b6ecc471211a942B0A904fbFb36302348f6B"
      values.batchPosters.0:
-        "arb1:0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
+        "arb1:0x3918b6ecc471211a942B0A904fbFb36302348f6B"
      values.setIsBatchPosterCount:
-        1
+        3
      values.espressoTEEVerifier:
+        "arb1:0x4fd6D0995B3016726D5674992c1Ec1bDe0989cF5"
      implementationNames.arb1:0x0DD7dA1805d207511bb3Edabe9352B9E316048bE:
-        "SequencerInbox"
      implementationNames.arb1:0xCfAfB803EF1FEc576138Cebc79Ad41Aa6760C575:
+        "SequencerInbox"
    }
```

```diff
+   Status: CREATED
    contract EspressoSGXTEEVerifier (arb1:0x05A16513BF74629b834878731f07b075Cca33f55)
    +++ description: Verifies attestations of an Intel SGX TEE.
```

```diff
+   Status: CREATED
    contract CertManager (arb1:0x27CA506AC6567Ef79d364b56cf4dE9C4141d803A)
    +++ description: The CertManager is used for anchoring TEE attestation keys to a trusted Certificate Authority (CA).
```

```diff
+   Status: CREATED
    contract EspressoTEEVerifier (arb1:0x4fd6D0995B3016726D5674992c1Ec1bDe0989cF5)
    +++ description: TEE gateway contract that can be used to 1) register signers that were generated inside a TEE and 2) verify the signatures of such signers. It supports both Intel SGX and AWS Nitro TEEs through modular contracts.
```

```diff
+   Status: CREATED
    contract QuoteVerifier (arb1:0x69523d25E25e5c78d828Df90459b75F189D40Cf7)
    +++ description: The QuoteVerifier contract is used by the EspressoTEEVerifier to verify the validity of the TEE quote. It references a PCCSRouter (arb1:0x0d089B3fA00CBAD0a5098025519e9e4620622acF), an access point for Intel SGX 'collateral', crucial references of which some modular contracts are unverified.
```

```diff
+   Status: CREATED
    contract EspressoNitroTEEVerifier (arb1:0xC17cd192bd0aF90a0a5c6021ee038E9223bf390C)
    +++ description: Verifies attestations of an AWS Nitro TEE.
```

## Source code changes

```diff
.../src/projects/apechain/.flat/CertManager.sol    | 1978 +++++++++++++++
 .../apechain/.flat/EspressoNitroTEEVerifier.sol    | 1973 +++++++++++++++
 .../apechain/.flat/EspressoSGXTEEVerifier.sol      |  697 ++++++
 .../apechain/.flat/EspressoTEEVerifier.sol         |  884 +++++++
 .../src/projects/apechain/.flat/QuoteVerifier.sol  | 2597 ++++++++++++++++++++
 .../SequencerInbox/SequencerInbox.sol              |  367 ++-
 6 files changed, 8410 insertions(+), 86 deletions(-)
```

Generated with discovered.json: 0x727fbcca366c826bbdb2faf4d7103617d06b7493

# Diff at Fri, 26 Sep 2025 12:44:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ec4b16fd723bf2a8625a616c4b3a1119ce79fb29 block: 1750247636
- current timestamp: 1750247636

## Description

add new celestia nitro wasmmoduleroot

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1750247636 (main branch discovery), not current.

```diff
    contract RollupProxy (arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0x597de35fc2ee60e5b2840157370d037542d6a4bc587af7f88202636c54e6bd8d:
+        "Celestia Nitro ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x6cf67e28bf0ee5593130a0a395edb3e0cbbc0165

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x5322659aa6370e81de1b282b57d750f9de42eb11

# Diff at Mon, 14 Jul 2025 13:11:47 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 348632330
- current block number: 348632330

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 348632330 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      address:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+        "arb1:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      values.$admin:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.$implementation:
-        "0xFa76A234b41f932Fa769f92d85574e1BEEfE8218"
+        "arb1:0xFa76A234b41f932Fa769f92d85574e1BEEfE8218"
      values.$pastUpgrades.0.2.0:
-        "0xCd26Db56B29e88b5394063aEA727DB1a03E961a7"
+        "arb1:0xCd26Db56B29e88b5394063aEA727DB1a03E961a7"
      values.$pastUpgrades.1.2.0:
-        "0xFa76A234b41f932Fa769f92d85574e1BEEfE8218"
+        "arb1:0xFa76A234b41f932Fa769f92d85574e1BEEfE8218"
      values.bridge:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      values.getProxyAdmin:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.sequencerInbox:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      implementationNames.0x1B98e4ED82Ee1a91A65a38C690e2266364064D15:
-        "TransparentUpgradeableProxy"
      implementationNames.0xFa76A234b41f932Fa769f92d85574e1BEEfE8218:
-        "ERC20Inbox"
      implementationNames.arb1:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xFa76A234b41f932Fa769f92d85574e1BEEfE8218:
+        "ERC20Inbox"
    }
```

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.owner:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      implementationNames.0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507:
-        "ProxyAdmin"
      implementationNames.arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507:
+        "ProxyAdmin"
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      address:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
+        "arb1:0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "arb1:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0xd125c9222160C308EdC5Cf642573Ca8a14D9d33c"
+        "arb1:0xd125c9222160C308EdC5Cf642573Ca8a14D9d33c"
      values.$members.1:
-        "0x83F58bBB1a940E364ED2dE775D1FD5218135cCE3"
+        "arb1:0x83F58bBB1a940E364ED2dE775D1FD5218135cCE3"
      values.$members.2:
-        "0x651cF50272Ffa8f6D954080DF743410Bb0aa7AFa"
+        "arb1:0x651cF50272Ffa8f6D954080DF743410Bb0aa7AFa"
      values.$members.3:
-        "0x8765bb776b00A14198025283988c23F72D330E2a"
+        "arb1:0x8765bb776b00A14198025283988c23F72D330E2a"
      values.$members.4:
-        "0x65c10dD3d50B10D0E1Bb459675b03367B1b52eD1"
+        "arb1:0x65c10dD3d50B10D0E1Bb459675b03367B1b52eD1"
      implementationNames.0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.arb1:0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF:
+        "SafeProxy"
      implementationNames.arb1:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      address:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      values.$admin:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      values.$implementation.0:
-        "0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d"
+        "arb1:0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d"
      values.$implementation.1:
-        "0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4"
+        "arb1:0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4"
      values.$pastUpgrades.0.2.0:
-        "0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d"
+        "arb1:0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d"
      values.$pastUpgrades.0.2.1:
-        "0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4"
+        "arb1:0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4"
      values.anyTrustFastConfirmer:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.bridge:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      values.challengeManager:
-        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
+        "arb1:0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      values.inbox:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+        "arb1:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      values.loserStakeEscrow:
-        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
+        "arb1:0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
      values.outbox:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+        "arb1:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      values.owner:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      values.rollupEventInbox:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+        "arb1:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      values.sequencerInbox:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      values.stakeToken:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.validators.0:
-        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
+        "arb1:0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
      values.validatorUtils:
-        "0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa"
+        "arb1:0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa"
      values.validatorWalletCreator:
-        "0x5a6C98F6A60BDC02cE4d8AD43b4Fc88Fe5b38856"
+        "arb1:0x5a6C98F6A60BDC02cE4d8AD43b4Fc88Fe5b38856"
      implementationNames.0x374de579AE15aD59eD0519aeAf1A23F348Df259c:
-        "RollupProxy"
      implementationNames.0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d:
-        "RollupAdminLogic"
      implementationNames.0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4:
-        "RollupUserLogic"
      implementationNames.arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c:
+        "RollupProxy"
      implementationNames.arb1:0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d:
+        "RollupAdminLogic"
      implementationNames.arb1:0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4:
+        "RollupUserLogic"
    }
```

```diff
    contract OneStepProverHostIo (0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca"
+        "arb1:0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca"
      implementationNames.0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca:
-        "OneStepProverHostIo"
      implementationNames.arb1:0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca:
+        "OneStepProverHostIo"
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      address:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+        "arb1:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      values.$admin:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.$implementation:
-        "0x4D92EE5cCA2A93b30549a6398C063861F18B6726"
+        "arb1:0x4D92EE5cCA2A93b30549a6398C063861F18B6726"
      values.$pastUpgrades.0.2.0:
-        "0x4D92EE5cCA2A93b30549a6398C063861F18B6726"
+        "arb1:0x4D92EE5cCA2A93b30549a6398C063861F18B6726"
      values.bridge:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      values.l2ToL1Sender:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      implementationNames.0x4F405BA65291063d8A524c2bDf55d4e67405c2aF:
-        "TransparentUpgradeableProxy"
      implementationNames.0x4D92EE5cCA2A93b30549a6398C063861F18B6726:
-        "ERC20Outbox"
      implementationNames.arb1:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x4D92EE5cCA2A93b30549a6398C063861F18B6726:
+        "ERC20Outbox"
    }
```

```diff
    contract OneStepProverMemory (0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19"
+        "arb1:0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19"
      implementationNames.0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19:
-        "OneStepProverMemory"
      implementationNames.arb1:0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19:
+        "OneStepProverMemory"
    }
```

```diff
    EOA  (0x5737CDBb3a67001441C0DA8b86e6b1826705601c) {
    +++ description: None
      address:
-        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
+        "arb1:0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
    }
```

```diff
    EOA  (0x651cF50272Ffa8f6D954080DF743410Bb0aa7AFa) {
    +++ description: None
      address:
-        "0x651cF50272Ffa8f6D954080DF743410Bb0aa7AFa"
+        "arb1:0x651cF50272Ffa8f6D954080DF743410Bb0aa7AFa"
    }
```

```diff
    EOA  (0x65c10dD3d50B10D0E1Bb459675b03367B1b52eD1) {
    +++ description: None
      address:
-        "0x65c10dD3d50B10D0E1Bb459675b03367B1b52eD1"
+        "arb1:0x65c10dD3d50B10D0E1Bb459675b03367B1b52eD1"
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      address:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      values.$admin:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.$implementation:
-        "0x20B3C55fe4ecd989beB56E13b2A726110f0c3619"
+        "arb1:0x20B3C55fe4ecd989beB56E13b2A726110f0c3619"
      values.$pastUpgrades.0.2.0:
-        "0x20B3C55fe4ecd989beB56E13b2A726110f0c3619"
+        "arb1:0x20B3C55fe4ecd989beB56E13b2A726110f0c3619"
      values.activeOutbox:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.0:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+        "arb1:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+++ description: Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge.
+++ severity: HIGH
      values.allowedDelayedInboxList.1:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+        "arb1:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+++ description: Can make calls as the bridge, steal all funds.
+++ severity: HIGH
      values.allowedOutboxList.0:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+        "arb1:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.0:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+        "arb1:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.1:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+        "arb1:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory.2:
-        "0x04577832300ca28cE7e21ddEC3E304af8739710c"
+        "arb1:0x04577832300ca28cE7e21ddEC3E304af8739710c"
      values.nativeToken:
-        "0x7f9FBf9bDd3F4105C478b996B648FE6e828a1e98"
+        "arb1:0x7f9FBf9bDd3F4105C478b996B648FE6e828a1e98"
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory.0:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+        "arb1:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      values.rollup:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      values.sequencerInbox:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      implementationNames.0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8:
-        "TransparentUpgradeableProxy"
      implementationNames.0x20B3C55fe4ecd989beB56E13b2A726110f0c3619:
-        "ERC20Bridge"
      implementationNames.arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x20B3C55fe4ecd989beB56E13b2A726110f0c3619:
+        "ERC20Bridge"
    }
```

```diff
    EOA  (0x83F58bBB1a940E364ED2dE775D1FD5218135cCE3) {
    +++ description: None
      address:
-        "0x83F58bBB1a940E364ED2dE775D1FD5218135cCE3"
+        "arb1:0x83F58bBB1a940E364ED2dE775D1FD5218135cCE3"
    }
```

```diff
    EOA  (0x845205C0F5109282954Bba4217aDA2a27Fdd89fF) {
    +++ description: None
      address:
-        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
+        "arb1:0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
    }
```

```diff
    EOA  (0x8765bb776b00A14198025283988c23F72D330E2a) {
    +++ description: None
      address:
-        "0x8765bb776b00A14198025283988c23F72D330E2a"
+        "arb1:0x8765bb776b00A14198025283988c23F72D330E2a"
    }
```

```diff
    contract OneStepProverMath (0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3"
+        "arb1:0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3"
      implementationNames.0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3:
-        "OneStepProverMath"
      implementationNames.arb1:0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3:
+        "OneStepProverMath"
    }
```

```diff
    contract OneStepProver0 (0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F"
+        "arb1:0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F"
      implementationNames.0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F:
-        "OneStepProver0"
      implementationNames.arb1:0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F:
+        "OneStepProver0"
    }
```

```diff
    contract OneStepProofEntry (0xa3180c7a17dd46DEf808477093592D8231e024a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      address:
-        "0xa3180c7a17dd46DEf808477093592D8231e024a8"
+        "arb1:0xa3180c7a17dd46DEf808477093592D8231e024a8"
      values.prover0:
-        "0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F"
+        "arb1:0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F"
      values.proverHostIo:
-        "0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca"
+        "arb1:0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca"
      values.proverMath:
-        "0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3"
+        "arb1:0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3"
      values.proverMem:
-        "0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19"
+        "arb1:0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19"
      implementationNames.0xa3180c7a17dd46DEf808477093592D8231e024a8:
-        "OneStepProofEntry"
      implementationNames.arb1:0xa3180c7a17dd46DEf808477093592D8231e024a8:
+        "OneStepProofEntry"
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      address:
-        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
+        "arb1:0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      values.$admin:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.$implementation:
-        "0x6Feb471ce7D32ee16047F1A983ac4f592df96526"
+        "arb1:0x6Feb471ce7D32ee16047F1A983ac4f592df96526"
      values.$pastUpgrades.0.2.0:
-        "0x6Feb471ce7D32ee16047F1A983ac4f592df96526"
+        "arb1:0x6Feb471ce7D32ee16047F1A983ac4f592df96526"
      values.bridge:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      values.osp:
-        "0xa3180c7a17dd46DEf808477093592D8231e024a8"
+        "arb1:0xa3180c7a17dd46DEf808477093592D8231e024a8"
      values.resultReceiver:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      values.sequencerInbox:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      implementationNames.0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1:
-        "TransparentUpgradeableProxy"
      implementationNames.0x6Feb471ce7D32ee16047F1A983ac4f592df96526:
-        "ChallengeManager"
      implementationNames.arb1:0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x6Feb471ce7D32ee16047F1A983ac4f592df96526:
+        "ChallengeManager"
    }
```

```diff
    contract ValidatorUtils (0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa) {
    +++ description: This contract implements view only utilities for validators.
      address:
-        "0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa"
+        "arb1:0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa"
      implementationNames.0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa:
-        "ValidatorUtils"
      implementationNames.arb1:0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa:
+        "ValidatorUtils"
    }
```

```diff
    EOA  (0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a) {
    +++ description: None
      address:
-        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
+        "arb1:0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
    }
```

```diff
    EOA  (0xd125c9222160C308EdC5Cf642573Ca8a14D9d33c) {
    +++ description: None
      address:
-        "0xd125c9222160C308EdC5Cf642573Ca8a14D9d33c"
+        "arb1:0xd125c9222160C308EdC5Cf642573Ca8a14D9d33c"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      address:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      values.$admin:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.$implementation:
-        "0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786"
+        "arb1:0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786"
      values.$pastUpgrades.0.2.0:
-        "0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786"
+        "arb1:0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786"
      values.accessControl.ADMIN_ROLE.members.0:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
+        "arb1:0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      values.executors.0:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
+        "arb1:0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      implementationNames.0xe032d15909e90f9A36901abB08944653e9E87d72:
-        "TransparentUpgradeableProxy"
      implementationNames.0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786:
-        "UpgradeExecutor"
      implementationNames.arb1:0xe032d15909e90f9A36901abB08944653e9E87d72:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786:
+        "UpgradeExecutor"
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      address:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      values.$admin:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.$implementation:
-        "0x0DD7dA1805d207511bb3Edabe9352B9E316048bE"
+        "arb1:0x0DD7dA1805d207511bb3Edabe9352B9E316048bE"
      values.$pastUpgrades.0.2.0:
-        "0x51120FA6D564A70E9F80874c0a55A4ee0c7396Fe"
+        "arb1:0x51120FA6D564A70E9F80874c0a55A4ee0c7396Fe"
      values.$pastUpgrades.1.2.0:
-        "0x0DD7dA1805d207511bb3Edabe9352B9E316048bE"
+        "arb1:0x0DD7dA1805d207511bb3Edabe9352B9E316048bE"
      values.batchPosterManager:
-        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
+        "arb1:0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
      values.batchPosters.0:
-        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
+        "arb1:0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
      values.bridge:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      values.reader4844:
-        "0x0000000000000000000000000000000000000000"
+        "arb1:0x0000000000000000000000000000000000000000"
      values.rollup:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      implementationNames.0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0DD7dA1805d207511bb3Edabe9352B9E316048bE:
-        "SequencerInbox"
      implementationNames.arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0x0DD7dA1805d207511bb3Edabe9352B9E316048bE:
+        "SequencerInbox"
    }
```

```diff
    contract RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      address:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+        "arb1:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      values.$admin:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      values.$implementation:
-        "0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96"
+        "arb1:0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96"
      values.$pastUpgrades.0.2.0:
-        "0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96"
+        "arb1:0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96"
      values.bridge:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      values.rollup:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      implementationNames.0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F:
-        "TransparentUpgradeableProxy"
      implementationNames.0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96:
-        "ERC20RollupEventInbox"
      implementationNames.arb1:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F:
+        "TransparentUpgradeableProxy"
      implementationNames.arb1:0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96:
+        "ERC20RollupEventInbox"
    }
```

```diff
+   Status: CREATED
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15)
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c)
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF)
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8)
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xa3180c7a17dd46DEf808477093592D8231e024a8)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1)
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa)
    +++ description: This contract implements view only utilities for validators.
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72)
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C)
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
```

```diff
+   Status: CREATED
    contract RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F)
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
```

Generated with discovered.json: 0x3fa36c52ce856b5f0169648acd9b42ff49cfd642

# Diff at Fri, 04 Jul 2025 12:18:51 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 348632330
- current block number: 348632330

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 348632330 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+        "arb1:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+        "arb1:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      directlyReceivedPermissions.3.from:
-        "arbitrum:0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
+        "arb1:0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      directlyReceivedPermissions.4.from:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      directlyReceivedPermissions.5.from:
-        "arbitrum:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      directlyReceivedPermissions.6.from:
-        "arbitrum:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+        "arb1:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.0.from:
-        "arbitrum:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.1.via.1.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.1.via.0.address:
-        "arbitrum:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.1.from:
-        "arbitrum:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+        "arb1:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.2.via.0.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.2.from:
-        "arbitrum:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.3.via.1.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.3.via.0.address:
-        "arbitrum:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.3.from:
-        "arbitrum:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+        "arb1:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      receivedPermissions.4.via.1.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.4.via.0.address:
-        "arbitrum:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.4.from:
-        "arbitrum:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      receivedPermissions.5.via.1.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.5.via.0.address:
-        "arbitrum:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.5.from:
-        "arbitrum:0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
+        "arb1:0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      receivedPermissions.6.via.1.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.6.via.0.address:
-        "arbitrum:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.6.from:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.7.via.1.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.7.via.0.address:
-        "arbitrum:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.7.from:
-        "arbitrum:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      receivedPermissions.8.via.1.address:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.8.via.0.address:
-        "arbitrum:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.8.from:
-        "arbitrum:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+        "arb1:0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      directlyReceivedPermissions.0.from:
-        "arbitrum:0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "arb1:0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    EOA  (0x5737CDBb3a67001441C0DA8b86e6b1826705601c) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
    }
```

```diff
    EOA  (0x845205C0F5109282954Bba4217aDA2a27Fdd89fF) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
    }
```

```diff
    EOA  (0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a) {
    +++ description: None
      receivedPermissions.0.from:
-        "arbitrum:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.0.from:
-        "arbitrum:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "arb1:0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      directlyReceivedPermissions.1.from:
-        "arbitrum:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.2.from:
-        "arbitrum:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "arb1:0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
    }
```

Generated with discovered.json: 0xdbd16d4e72be493d483faf49a78ed8244b5c7e76

# Diff at Wed, 18 Jun 2025 11:54:22 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 287770407
- current block number: 348632330

## Description

late upgrade to standard orbit implementations.

## Watched changes

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sourceHashes.0:
-        "0xb2c117c2e00734a82fe4ab27d5fe91a6e152c06bbcdbf83db021ad32b6be3e60"
+        "0x25984fdfffb8141859c99299fb29e7a7460732d77111e5fe23792baa99f336a3"
      values.$implementation:
-        "0xCd26Db56B29e88b5394063aEA727DB1a03E961a7"
+        "0xFa76A234b41f932Fa769f92d85574e1BEEfE8218"
      values.$pastUpgrades.1:
+        ["2025-06-13T13:06:09.000Z","0xe385aeb814e7282eac24484389ea3b1f4e6b612a750b25b547bacc5dffb70544",["0xFa76A234b41f932Fa769f92d85574e1BEEfE8218"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.0xCd26Db56B29e88b5394063aEA727DB1a03E961a7:
-        "ERC20Inbox"
      implementationNames.0xFa76A234b41f932Fa769f92d85574e1BEEfE8218:
+        "ERC20Inbox"
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      values.$members.4:
+        "0xd125c9222160C308EdC5Cf642573Ca8a14D9d33c"
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "3 of 5 (60%)"
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sourceHashes.0:
-        "0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"
+        "0x6bb86ac4bd0d31e049f543fcf0a8f94c952252222f115246ef9d5b8104d803cc"
      values.$implementation:
-        "0x51120FA6D564A70E9F80874c0a55A4ee0c7396Fe"
+        "0x0DD7dA1805d207511bb3Edabe9352B9E316048bE"
      values.$pastUpgrades.1:
+        ["2025-06-13T13:06:09.000Z","0xe385aeb814e7282eac24484389ea3b1f4e6b612a750b25b547bacc5dffb70544",["0x0DD7dA1805d207511bb3Edabe9352B9E316048bE"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.0x51120FA6D564A70E9F80874c0a55A4ee0c7396Fe:
-        "SequencerInbox"
      implementationNames.0x0DD7dA1805d207511bb3Edabe9352B9E316048bE:
+        "SequencerInbox"
    }
```

## Source code changes

```diff
.../Inbox/ERC20Inbox.sol                           | 16 +++++++++++++--
 .../SequencerInbox/SequencerInbox.sol              | 24 +++++++++++++++-------
 2 files changed, 31 insertions(+), 9 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a:
+        "ArbOS v40 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x3d6e4368a1eb33fc5c402f4372d9357d61a61bd8

# Diff at Tue, 27 May 2025 08:30:51 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.1:
-        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
+        "0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca"
      sourceHashes.0:
-        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
+        "0x86c7032e0f4b5468f1eb92c79b73ab4c7f053fc7bdfc88fdd360e2fe7baa1072"
    }
```

Generated with discovered.json: 0x7f4c786489f518d01b25d24ef057c3a1f988e94b

# Diff at Fri, 23 May 2025 09:41:11 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 287770407
- current block number: 287770407

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".executors"
    }
```

```diff
    EOA  (0x5737CDBb3a67001441C0DA8b86e6b1826705601c) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosterManager"
    }
```

```diff
    EOA  (0x845205C0F5109282954Bba4217aDA2a27Fdd89fF) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batchPosters"
    }
```

```diff
    EOA  (0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0xc67b0ba87485962e42df1382fe7c4d7be917cd29

# Diff at Fri, 02 May 2025 17:25:15 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3:
+        "Celestia Nitro 3.3.2 wasmModuleRoot"
    }
```

Generated with discovered.json: 0xa7cc55d7e84cbc25707c3948c456e27432d282c7

# Diff at Tue, 29 Apr 2025 08:19:19 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 287770407
- current block number: 287770407

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions:
-        [{"permission":"interact","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","description":"Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes.","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"validate","to":"0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a","description":"Can propose new state roots (called nodes) and challenge state roots on the host chain.","via":[]}]
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions:
-        [{"permission":"interact","to":"0x5737CDBb3a67001441C0DA8b86e6b1826705601c","description":"Add/remove batchPosters (Sequencers).","via":[]},{"permission":"sequence","to":"0x845205C0F5109282954Bba4217aDA2a27Fdd89fF","description":"Can submit transaction batches or commitments to the SequencerInbox contract on the host chain.","via":[]},{"permission":"upgrade","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
    }
```

```diff
    contract RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
    }
```

Generated with discovered.json: 0xd212274765f66a286cfe203d74ea35d69f38ec40

# Diff at Thu, 06 Mar 2025 14:21:06 GMT:

- chain: arbitrum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x3d5f54e1900076824a77019a9d8c3b8a1929de6c

# Diff at Thu, 06 Mar 2025 09:39:08 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 287770407
- current block number: 287770407

## Description

Config related: set severity for arbitrum inbox/outbox changes to high and add historical In- and Outboxes via events.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x1B98e4ED82Ee1a91A65a38C690e2266364064D15","0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","0x04577832300ca28cE7e21ddEC3E304af8739710c"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0x205f47214926ce6401e1822a95daedec87803877

# Diff at Tue, 04 Mar 2025 10:40:22 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        247653199
    }
```

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      sinceBlock:
+        247653199
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      sinceBlock:
+        259640900
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        247653199
    }
```

```diff
    contract OneStepProverHostIo (0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240992264
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        247653199
    }
```

```diff
    contract OneStepProverMemory (0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240991609
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        247653199
    }
```

```diff
    contract OneStepProverMath (0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240991948
    }
```

```diff
    contract OneStepProver0 (0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240991280
    }
```

```diff
    contract OneStepProofEntry (0xa3180c7a17dd46DEf808477093592D8231e024a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        240992619
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        247653199
    }
```

```diff
    contract ValidatorUtils (0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        240994094
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        247653199
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        247653199
    }
```

```diff
    contract RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        247653199
    }
```

Generated with discovered.json: 0x97f5701ff28642e0a8a7b5c5293263fb55c15de6

# Diff at Thu, 27 Feb 2025 11:47:20 GMT:

- chain: arbitrum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

Generated with discovered.json: 0xa70cc9affaa2eea3c0fa14034bbf6a81c7ab19ab

# Diff at Fri, 21 Feb 2025 14:12:21 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 287770407
- current block number: 287770407

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xbe0cde1a26716d6b434e0b35b44cfa057d8430c5

# Diff at Tue, 04 Feb 2025 12:33:46 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 287770407
- current block number: 287770407

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xf5c710feb7246afcd7c7f163c168a7ae730c99be

# Diff at Mon, 20 Jan 2025 11:10:27 GMT:

- chain: arbitrum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287770407
- current block number: 287770407

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      directlyReceivedPermissions.6.from:
+        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      directlyReceivedPermissions.5.target:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      directlyReceivedPermissions.5.from:
+        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      directlyReceivedPermissions.4.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      directlyReceivedPermissions.4.from:
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      directlyReceivedPermissions.3.target:
-        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      directlyReceivedPermissions.3.from:
+        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      directlyReceivedPermissions.2.target:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      directlyReceivedPermissions.2.from:
+        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      directlyReceivedPermissions.1.target:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      directlyReceivedPermissions.1.from:
+        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      directlyReceivedPermissions.0.target:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      directlyReceivedPermissions.0.from:
+        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      receivedPermissions.8.from:
+        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
      receivedPermissions.7.target:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      receivedPermissions.7.from:
+        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      receivedPermissions.6.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.6.from:
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.5.target:
-        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      receivedPermissions.5.from:
+        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      receivedPermissions.4.target:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      receivedPermissions.4.from:
+        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      receivedPermissions.3.target:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      receivedPermissions.3.from:
+        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      receivedPermissions.2.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.2.from:
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.1.target:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.1.from:
+        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.0.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.0.from:
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      directlyReceivedPermissions.0.from:
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
      issuedPermissions.2.to:
+        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ERC20Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

```diff
    contract ERC20Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      directlyReceivedPermissions.2.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.2.from:
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.1.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.1.from:
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      directlyReceivedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      directlyReceivedPermissions.0.from:
+        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.1.target:
-        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
      issuedPermissions.1.to:
+        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
      issuedPermissions.1.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
      issuedPermissions.0.target:
-        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
      issuedPermissions.0.to:
+        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
      issuedPermissions.0.description:
+        "Add/remove batchPosters (Sequencers)."
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
    }
```

Generated with discovered.json: 0x5292f048d45d18abb5264c287697164a34a32402

# Diff at Wed, 08 Jan 2025 10:44:56 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287770407
- current block number: 287770407

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287770407 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0xe053fb77ee9f9a3f836f3a6257cfaf665e3c767c

# Diff at Mon, 23 Dec 2024 12:42:35 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 279474286
- current block number: 287770407

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279474286 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x90319b12d430dde70561631298a17d10e7bb7430

# Diff at Thu, 05 Dec 2024 11:53:38 GMT:

- chain: arbitrum
- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 279474286
- current block number: 279474286

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279474286 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x05b8b11b44ab1d943d7a501c8d9254e2bc52047d

# Diff at Fri, 29 Nov 2024 11:28:46 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 279474286
- current block number: 279474286

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 279474286 (main branch discovery), not current.

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0},{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
+        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
      issuedPermissions.1.via.1:
-        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.1.via.0:
-        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}
      issuedPermissions.0.permission:
-        "sequence"
+        "configure"
      issuedPermissions.0.target:
-        "0x845205C0F5109282954Bba4217aDA2a27Fdd89fF"
+        "0x5737CDBb3a67001441C0DA8b86e6b1826705601c"
    }
```

Generated with discovered.json: 0x074b9d9bdd7cad50bfcff3657c16294b351517c0

# Diff at Fri, 29 Nov 2024 09:31:36 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 276713373
- current block number: 279474286

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 276713373 (main branch discovery), not current.

```diff
    contract ERC20Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      template:
+        "orbitstack/Inbox"
      displayName:
+        "Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
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
    contract ERC20Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      template:
+        "orbitstack/Outbox"
      displayName:
+        "Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract ERC20Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      template:
+        "orbitstack/Bridge"
      displayName:
+        "Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

Generated with discovered.json: 0xc2fa9c9d82bedfa50bbda3ddb073feb6a87bda6c

# Diff at Thu, 21 Nov 2024 07:27:22 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 267469765
- current block number: 276713373

## Description

Config related: new gnosisSafe template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      values.getOwners:
-        ["0x83F58bBB1a940E364ED2dE775D1FD5218135cCE3","0x651cF50272Ffa8f6D954080DF743410Bb0aa7AFa","0x8765bb776b00A14198025283988c23F72D330E2a","0x65c10dD3d50B10D0E1Bb459675b03367B1b52eD1"]
      values.getThreshold:
-        3
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xb9db02fba53339cc04259d6fa9097baff18c1fd6

# Diff at Fri, 15 Nov 2024 08:18:15 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
-        {"permission":"upgrade","target":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}]}
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
-        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.0:
+        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x7bf0b52d291db056a359381c3bd5955bccabbe97

# Diff at Mon, 04 Nov 2024 08:01:01 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]}
      receivedPermissions.7.target:
-        "0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"
+        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
      receivedPermissions.6.target:
-        "0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.5.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
      receivedPermissions.4.target:
-        "0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"
+        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
      receivedPermissions.3.target:
-        "0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"
+        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
      receivedPermissions.2.target:
-        "0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.2.via.1:
-        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}
      receivedPermissions.2.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.1.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.1.via.1:
+        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}
      receivedPermissions.1.via.0.address:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
+        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
      receivedPermissions.0.via.1:
-        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}
      receivedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.3:
+        {"permission":"upgrade","target":"0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.2.target:
-        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
+        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
      issuedPermissions.2.via.0:
-        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}
      issuedPermissions.1.permission:
-        "propose"
+        "configure"
      issuedPermissions.1.target:
-        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.1.via.0:
+        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [21600,300,259200,3600]
+        {"delayBlocks":21600,"futureBlocks":300,"delaySeconds":259200,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

Generated with discovered.json: 0x85e26b018da19de74dbfdc844443b962fbbdb130

# Diff at Tue, 29 Oct 2024 13:21:54 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract OneStepProverHostIo (0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMemory (0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProver0 (0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProofEntry (0xa3180c7a17dd46DEf808477093592D8231e024a8) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

Generated with discovered.json: 0x2944d42233ebc4561c3b3b82d3fab00ae2be2e2c

# Diff at Tue, 29 Oct 2024 08:07:45 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1B98e4ED82Ee1a91A65a38C690e2266364064D15","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c","via":[{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]},{"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"},{"address":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xe032d15909e90f9A36901abB08944653e9E87d72"}]
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.2.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.2.via.0:
+        {"address":"0xe032d15909e90f9A36901abB08944653e9E87d72","delay":0}
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1B98e4ED82Ee1a91A65a38C690e2266364064D15","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c"},{"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]},{"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c"}
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.1.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"
      issuedPermissions.0.via.1:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
    }
```

Generated with discovered.json: 0xf89287829e91ea572dde1335bc3afae5324b76f4

# Diff at Mon, 28 Oct 2024 14:06:38 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267469765
- current block number: 267469765

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267469765 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF"]
    }
```

Generated with discovered.json: 0x6c2421e82c77596a559199e11d14e0f104365a4e

# Diff at Fri, 25 Oct 2024 09:57:36 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 266079510
- current block number: 267469765

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266079510 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"},{"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"},{"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"},{"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"},{"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"},{"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"},{"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF"},{"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8"},{"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1"},{"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72"},{"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C"},{"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F"}]
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x4F405BA65291063d8A524c2bDf55d4e67405c2aF","via":[{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x374de579AE15aD59eD0519aeAf1A23F348Df259c"}
      receivedPermissions.0.target:
-        "0x374de579AE15aD59eD0519aeAf1A23F348Df259c"
+        "0x1B98e4ED82Ee1a91A65a38C690e2266364064D15"
      receivedPermissions.0.via:
+        [{"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"}]
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.1.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507"
+        "0xe032d15909e90f9A36901abB08944653e9E87d72"
      issuedPermissions.0.via.0:
+        {"address":"0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507","delay":0}
    }
```

Generated with discovered.json: 0xc140122f6b4e53c6f7636034411904ecd847ca68

# Diff at Wed, 23 Oct 2024 14:36:36 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 266079510
- current block number: 266079510

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266079510 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xe032d15909e90f9A36901abB08944653e9E87d72","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xe032d15909e90f9A36901abB08944653e9E87d72"
+        "0xAcB7D670bb95144B88a5Cd1883B87bC5021FD10a"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "0x5b82aa008989d331bf6f3cf75b85a04c9ee809447c19b85fecaf3b7d749a6576"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x5a6C98F6A60BDC02cE4d8AD43b4Fc88Fe5b38856)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x91f0A93A188d1516193032A687533C97D634f9F4)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

Generated with discovered.json: 0x3048b114ae09b50403471f3a605b6c74a439e0e7

# Diff at Mon, 21 Oct 2024 12:51:02 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 266079510
- current block number: 266079510

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266079510 (main branch discovery), not current.

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

Generated with discovered.json: 0x9e9bcb5dfaf58c045fbb12a94c85d7030dceac20

# Diff at Mon, 21 Oct 2024 11:29:18 GMT:

- chain: arbitrum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@89bb82544503b2bb7544ceb7dedf56a03e0c5339 block: 266079510
- current block number: 266079510

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 266079510 (main branch discovery), not current.

```diff
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xCd26Db56B29e88b5394063aEA727DB1a03E961a7"]
      values.$pastUpgrades.0.1:
-        ["0xCd26Db56B29e88b5394063aEA727DB1a03E961a7"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d","0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4"]
      values.$pastUpgrades.0.1:
-        ["0x2733fc1C97f6562466E9B29D64bCc6dC833cC88d","0x230cf5A0FE4cC58deaf8a147A42ACF3f3C20A8C4"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4D92EE5cCA2A93b30549a6398C063861F18B6726"]
      values.$pastUpgrades.0.1:
-        ["0x4D92EE5cCA2A93b30549a6398C063861F18B6726"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x20B3C55fe4ecd989beB56E13b2A726110f0c3619"]
      values.$pastUpgrades.0.1:
-        ["0x20B3C55fe4ecd989beB56E13b2A726110f0c3619"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6Feb471ce7D32ee16047F1A983ac4f592df96526"]
      values.$pastUpgrades.0.1:
-        ["0x6Feb471ce7D32ee16047F1A983ac4f592df96526"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786"]
      values.$pastUpgrades.0.1:
-        ["0xdbE68E9e47c4AC96Ab1300902b4B87A7E6470786"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.0.2:
+        ["0x51120FA6D564A70E9F80874c0a55A4ee0c7396Fe"]
      values.$pastUpgrades.0.1:
-        ["0x51120FA6D564A70E9F80874c0a55A4ee0c7396Fe"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

```diff
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96"]
      values.$pastUpgrades.0.1:
-        ["0xF088dccfD7d39b24Ce0D4c91a4fEC3F56e3DBC96"]
+        "0x0d8fd55271d42815ae9dcd9820e29d18690b3a49a3cbad17308afa6431334aa5"
    }
```

Generated with discovered.json: 0xd6fa4a4ad8fc42903fa2372bb7a447c0dd4cbe1d

# Diff at Mon, 21 Oct 2024 08:58:31 GMT:

- chain: arbitrum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 266079510

## Description

Standard Orbit stack AnyTrust optimium with APE gas token and max supply premint (bridged via LayerZero) on L3.

## Initial discovery

```diff
+   Status: CREATED
    contract Inbox (0x1B98e4ED82Ee1a91A65a38C690e2266364064D15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1E5f8ff72895aEa53DD62b590dA51E92dC75b507)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ApeChainMultisig (0x2B1FbeE3c7D278bFD9E179893FF304fE49FA7DDF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x374de579AE15aD59eD0519aeAf1A23F348Df259c)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x4aBF0E8C011142bAb19ff3C921880B71E68150Ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x4F405BA65291063d8A524c2bDf55d4e67405c2aF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x550B7B23Ed78BA25B3aBCBb290ADf1190aC28E19)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x5a6C98F6A60BDC02cE4d8AD43b4Fc88Fe5b38856)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Bridge (0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x8A4ed18B4d31bCeA908B0f96B4347a9F99e816b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x91f0A93A188d1516193032A687533C97D634f9F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xa301f8EdD4Cdf10553b6aB39d9724c56d7ab582F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xa3180c7a17dd46DEf808477093592D8231e024a8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0xAB2182C8c9a9d853Cf06A77967D2b3971A453ee1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0xaB36aec5517C346D21b9C19429BAA5aa87D17fCa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0xe032d15909e90f9A36901abB08944653e9E87d72)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0xf383814AE1eD316ed7d6FeA28810C77E8a15A49F)
    +++ description: None
```

