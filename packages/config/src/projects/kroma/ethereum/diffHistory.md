Generated with discovered.json: 0xe98ba44a7f3a95bbb8f87e62e3496a0ddb951d1e

# Diff at Thu, 06 Mar 2025 15:18:45 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 21845178
- current block number: 21845178

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21845178 (main branch discovery), not current.

```diff
    contract L1Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: A standard timelock with access control. The current minimum delay is 0s.
      description:
-        "A timelock with access control. The current minimum delay is 0s."
+        "A standard timelock with access control. The current minimum delay is 0s."
      issuedPermissions.3.description:
-        "manage all access control roles."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.2.description:
-        "manage all access control roles."
+        "manage all access control roles and change the minimum delay."
      directlyReceivedPermissions.1.description:
-        "manage all access control roles."
+        "manage all access control roles and change the minimum delay."
      values.Canceller:
-        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      values.Executor:
-        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      values.getMinDelayFormatted:
-        "0s"
      values.Proposer:
-        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      values.cancellerAC:
+        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      values.executorAC:
+        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      values.minDelayFormatted:
+        "0s"
      values.proposerAC:
+        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: A governance proxy contract using token voting with 0xe4D08346609055c091D3DEECdAAd3Bf83119B08c as identification of actors allowed to vote/sign a proposal which is passed to the 0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1 afterwards.
      directlyReceivedPermissions.3.description:
-        "manage all access control roles."
+        "manage all access control roles and change the minimum delay."
    }
```

```diff
    contract SecurityCouncilTokenOwners (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: A soulbound token implementation to identify participants of the KromaSecurityCouncil. Owners of the token are members of the council. There are currently 10 members.
      receivedPermissions.3.description:
-        "manage all access control roles."
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.2.description:
-        "manage all access control roles."
+        "manage all access control roles and change the minimum delay."
    }
```

Generated with discovered.json: 0x3da7b6094dd1f71ab5888e107b835e9df12647c4

# Diff at Tue, 04 Mar 2025 11:25:53 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21845178
- current block number: 21845178

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21845178 (main branch discovery), not current.

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x8dea360bfd0fc4e17ec64d5ce6d2177a31d84108

# Diff at Tue, 04 Mar 2025 10:39:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21845178
- current block number: 21845178

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21845178 (main branch discovery), not current.

```diff
    contract ZKProofVerifier (0x005DDC466C804c79adB079c120347dDE48132105) {
    +++ description: None
      sinceBlock:
+        21692210
    }
```

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: The L2OutputOracle contract contains a list of proposed state roots which Proposers assert to be a result of block execution. Anyone can participate as a Proposer by depositing in the ValidatorPool. A root can be proposed every 1800 blocks (2s block time).
      sinceBlock:
+        18067271
    }
```

```diff
    contract L1Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: A timelock with access control. The current minimum delay is 0s.
      sinceBlock:
+        18067277
    }
```

```diff
    contract ValidatorManager (0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363) {
    +++ description: Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the window to submit the output root within 30m, after which anyone can propose for them. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets.
      sinceBlock:
+        21010651
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: This is a fork of the standard OP stack OptimismPortal contract, the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        18067269
    }
```

```diff
    contract ZKMerkleTrie (0x339208824010425cBE73201ceD4372308ACD610B) {
    +++ description: Merkle Trie contract used to prove withdrawals that were initiated in the legacy system, deprecated for new withdrawals and succeeded by a merkle tree library in the KromaPortal.
      sinceBlock:
+        18018290
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        18067268
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        20233410
    }
```

```diff
    contract KromaSecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: Custom Multisig contract in which each signer is identified by a token. The threshold is 8 and the token contract is called SecurityCouncilToken.
      sinceBlock:
+        18067275
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        18067272
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        18018264
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      sinceBlock:
+        18018255
    }
```

```diff
    contract ZkVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: ZK verifier used to verify the last step of a legacy zkEVM proof, which corresponds to a block.
      sinceBlock:
+        18018266
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: Contract used to challenge state roots and prove fraud. If successful, the wrong state root in the 0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6 is replaced.
      sinceBlock:
+        18067274
    }
```

```diff
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e) {
    +++ description: None
      sinceBlock:
+        18583133
    }
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        18067273
    }
```

```diff
    contract AssetManager (0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3) {
    +++ description: Manages the delegation and undelegation of KRO tokens and Kroma Guardian House (KGH) NFTs for Proposers (Kroma Validators) and distributes rewards.
      sinceBlock:
+        21010650
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: A governance proxy contract using token voting with 0xe4D08346609055c091D3DEECdAAd3Bf83119B08c as identification of actors allowed to vote/sign a proposal which is passed to the 0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1 afterwards.
      sinceBlock:
+        18067278
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        20573748
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        21031662
    }
```

```diff
    contract SecurityCouncilTokenOwners (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: A soulbound token implementation to identify participants of the KromaSecurityCouncil. Owners of the token are members of the council. There are currently 10 members.
      sinceBlock:
+        18067276
    }
```

```diff
    contract KromaRewardVaultMultisig (0xe57E217d8ed498992452791622711B866403E950) {
    +++ description: Escrows a pool of KRO used as validator rewards by the AssetManager.
      sinceBlock:
+        20423009
    }
```

```diff
    contract Poseidon2 (0xFd234971881a7c72965175fA8E438c97B2Dcd273) {
    +++ description: Contract used to compute hashes. It is used by the ZKMerkeTrie. The contract has been generated using the circomlibjs library.
      sinceBlock:
+        18018289
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: Contract used to manage the Proposers. Anyone can submit a deposit and bond to a state root, or create a challenge. It also manages the Proposer rotation for each submittable block using a random selection. If the selected proposer fails to publish a root within 30m then the submission becomes open to everyone.
      sinceBlock:
+        18067270
    }
```

Generated with discovered.json: 0xe15e14bdcec30d7ffc6b10c12fcc7511556fd7dc

# Diff at Thu, 27 Feb 2025 11:45:52 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 21845178
- current block number: 21845178

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21845178 (main branch discovery), not current.

```diff
    contract L1Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: A timelock with access control. The current minimum delay is 0s.
      name:
-        "TimeLock"
+        "L1Timelock"
      displayName:
-        "L1Timelock"
    }
```

Generated with discovered.json: 0x899582a9d013bc2402c2096f2cfdaa6be2ba2a72

# Diff at Wed, 26 Feb 2025 10:32:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21845178
- current block number: 21845178

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21845178 (main branch discovery), not current.

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xf32cc23940829f620aa19f140edc716b2a9e283f

# Diff at Fri, 14 Feb 2025 14:19:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 21141582
- current block number: 21845178

## Description

[Kroma proof system upgrade](https://blog.kroma.network/kromas-transition-to-zkvm-fault-proof-b8c8d2dc39c6):
Kroma moves to optional SP1 for zk proofs of the last step in a fault proof (The old zkEVM verifier can still be used).

## Watched changes

```diff
    contract ValidatorManager (0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363) {
    +++ description: Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the window to submit the output root within 30m, after which anyone can propose for them. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets.
      sourceHashes.1:
-        "0x3b00390af29aee88ea29fcb7a7d70395cae6d537dfc25f3a71768f5c6280479a"
+        "0x9352046e1debd70d6603f184b60930075d5445af5ed02e1e4b299010ec5d7348"
      values.$implementation:
-        "0x0Ed7bb332F7307F5c97E566E74A4A73ab6671082"
+        "0x8687b9ecD75ea00997a999B9DdE54C735DE9DEE1"
      values.$pastUpgrades.1:
+        ["2025-02-10T04:48:23.000Z","0x78625237350cb2047aa1ec6392d2402dabf1a5d44d54e0142ae27d19546c8c74",["0x8687b9ecD75ea00997a999B9DdE54C735DE9DEE1"]]
      values.$upgradeCount:
-        1
+        2
      values.MPT_FIRST_OUTPUT_INDEX:
+        12603
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: This is a fork of the standard OP stack OptimismPortal contract, the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
      sourceHashes.1:
-        "0x110b957ac30147c969242967fdb5705351484239bca1c7060fe8b522d8d9cc44"
+        "0x380ba7ac243cd77b18b24f82aba2b0b2b32ae18c02f8ae15db16810fb9f205ca"
      values.$implementation:
-        "0x381F53695230BAF83a39D1a08304D233A35730Fa"
+        "0x5C8eE8323a33ebBF3ea3c6c3b84DACFca44A9316"
      values.$pastUpgrades.1:
+        ["2025-02-10T04:48:23.000Z","0x78625237350cb2047aa1ec6392d2402dabf1a5d44d54e0142ae27d19546c8c74",["0x5C8eE8323a33ebBF3ea3c6c3b84DACFca44A9316"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.0.0"
+        "2.0.0"
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      directlyReceivedPermissions.15:
+        {"permission":"upgrade","from":"0xFdFF462845953D90719A78Fd12a2d103541d2103"}
      directlyReceivedPermissions.14.from:
-        "0xFdFF462845953D90719A78Fd12a2d103541d2103"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      directlyReceivedPermissions.13.from:
-        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
+        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      directlyReceivedPermissions.12.from:
-        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
+        "0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"
      directlyReceivedPermissions.11.from:
-        "0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"
+        "0x827962404D7104202C5aaa6b929115C8211d9596"
      directlyReceivedPermissions.11.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.10.from:
-        "0x827962404D7104202C5aaa6b929115C8211d9596"
+        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
      directlyReceivedPermissions.10.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.9.from:
-        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
+        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
      directlyReceivedPermissions.8.from:
-        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
+        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
      directlyReceivedPermissions.7.from:
-        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
+        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
      directlyReceivedPermissions.6.from:
-        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
+        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      directlyReceivedPermissions.5.from:
-        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
+        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
      directlyReceivedPermissions.4.from:
-        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
+        "0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"
      directlyReceivedPermissions.3.from:
-        "0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"
+        "0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"
      directlyReceivedPermissions.2.from:
-        "0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      directlyReceivedPermissions.1.from:
-        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
+        "0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"
      directlyReceivedPermissions.0.from:
-        "0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"
+        "0x005DDC466C804c79adB079c120347dDE48132105"
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: Contract used to challenge state roots and prove fraud. If successful, the wrong state root in the 0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6 is replaced.
      sourceHashes.1:
-        "0x00a929674c752e3543c7d0b26d1965574c3f956dd892502eb782e8087e12af45"
+        "0x6f653563abba409e3c26569deb686f8f22823bd92ef3d658b4bc77ba630236c7"
      values.$implementation:
-        "0xAB54b3e775f645cf4486039bfA4dA539E70c9f99"
+        "0xBFcA810D1c26a3aC6F81a32Ab5C023F24bE93dAC"
      values.$pastUpgrades.4:
+        ["2025-02-10T04:48:23.000Z","0x78625237350cb2047aa1ec6392d2402dabf1a5d44d54e0142ae27d19546c8c74",["0xBFcA810D1c26a3aC6F81a32Ab5C023F24bE93dAC"]]
      values.$upgradeCount:
-        4
+        5
      values.DUMMY_HASH:
-        "0xedf1ae3da135c124658e215a9bf53477facb442a1dcd5a92388332cb6193237f"
      values.MAX_TXS:
-        100
      values.version:
-        "1.1.0"
+        "2.0.0"
      values.ZK_MERKLE_TRIE:
-        "0x339208824010425cBE73201ceD4372308ACD610B"
      values.ZK_VERIFIER:
-        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
      values.ZK_PROOF_VERIFIER:
+        "0x005DDC466C804c79adB079c120347dDE48132105"
    }
```

```diff
    contract SecurityCouncilTokenOwners (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: A soulbound token implementation to identify participants of the KromaSecurityCouncil. Owners of the token are members of the council. There are currently 10 members.
      receivedPermissions.22:
+        {"permission":"upgrade","from":"0xFdFF462845953D90719A78Fd12a2d103541d2103","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]}
      receivedPermissions.21.from:
-        "0xFdFF462845953D90719A78Fd12a2d103541d2103"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      receivedPermissions.20.from:
-        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
+        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      receivedPermissions.19.from:
-        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
+        "0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"
      receivedPermissions.18.from:
-        "0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"
+        "0x827962404D7104202C5aaa6b929115C8211d9596"
      receivedPermissions.18.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.17.from:
-        "0x827962404D7104202C5aaa6b929115C8211d9596"
+        "0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"
      receivedPermissions.17.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.17.via.2:
-        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      receivedPermissions.17.via.1.address:
-        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
+        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      receivedPermissions.17.via.0.address:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      receivedPermissions.16.from:
-        "0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"
+        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
      receivedPermissions.16.via.2:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      receivedPermissions.16.via.1.address:
-        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      receivedPermissions.16.via.0.address:
-        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      receivedPermissions.15.from:
-        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
+        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
      receivedPermissions.14.from:
-        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
+        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
      receivedPermissions.13.from:
-        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
+        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
      receivedPermissions.12.from:
-        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
+        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      receivedPermissions.11.from:
-        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
+        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
      receivedPermissions.10.from:
-        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
+        "0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"
      receivedPermissions.9.from:
-        "0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"
+        "0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"
      receivedPermissions.8.from:
-        "0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      receivedPermissions.7.from:
-        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
+        "0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"
      receivedPermissions.6.from:
-        "0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"
+        "0x005DDC466C804c79adB079c120347dDE48132105"
    }
```

```diff
+   Status: CREATED
    contract ZKProofVerifier (0x005DDC466C804c79adB079c120347dDE48132105)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

## Source code changes

```diff
.../Colosseum/Colosseum.sol                        | 1160 +++-------------
 .../KromaPortal/KromaPortal.sol                    | 1439 ++++++++++++++------
 .../kroma/ethereum/.flat/SP1Verifier.sol           | 1432 +++++++++++++++++++
 .../kroma/ethereum/.flat/SP1VerifierGateway.sol    |  231 ++++
 .../SuccinctGatewaySP1Multisig/GnosisSafe.sol      |  953 +++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../ValidatorManager/ValidatorManager.sol          |   90 +-
 .../ethereum/.flat/ZKProofVerifier/Proxy.p.sol     |  211 +++
 .../.flat/ZKProofVerifier/ZKProofVerifier.sol      | 1284 +++++++++++++++++
 9 files changed, 5425 insertions(+), 1410 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141582 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: The L2OutputOracle contract contains a list of proposed state roots which Proposers assert to be a result of block execution. Anyone can participate as a Proposer by depositing in the ValidatorPool. A root can be proposed every 1800 blocks (2s block time).
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      description:
+        "The L2OutputOracle contract contains a list of proposed state roots which Proposers assert to be a result of block execution. Anyone can participate as a Proposer by depositing in the ValidatorPool. A root can be proposed every 1800 blocks (2s block time)."
    }
```

```diff
    contract TimeLock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: A timelock with access control. The current minimum delay is 0s.
      name:
-        "Timelock"
+        "TimeLock"
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","description":"propose transactions.","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","description":"manage all access control roles.","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","description":"manage all access control roles.","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","description":"execute transactions that are ready.","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      issuedPermissions.0.description:
+        "cancel queued transactions."
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"}]
      values.Canceller:
+        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      values.Executor:
+        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      values.getMinDelayFormatted:
+        "0s"
      values.Proposer:
+        ["0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      values.timelockAdminAC:
+        ["0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","0xb3c415c2Aad428D5570208e1772cb68e7D06a537"]
      template:
+        "global/Timelock"
      displayName:
+        "L1Timelock"
      description:
+        "A timelock with access control. The current minimum delay is 0s."
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"manage all access control roles."},{"permission":"interact","from":"0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."},{"permission":"upgrade","from":"0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"}]
    }
```

```diff
    contract ValidatorManager (0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363) {
    +++ description: Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the window to submit the output root within 30m, after which anyone can propose for them. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets.
      description:
-        "Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the permission to submit the output root. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets."
+        "Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the window to submit the output root within 30m, after which anyone can propose for them. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets."
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      values.RoundDurationFormatted:
+        "30m"
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: This is a fork of the standard OP stack OptimismPortal contract, the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      description:
+        "This is a fork of the standard OP stack OptimismPortal contract, the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract ZKMerkleTrie (0x339208824010425cBE73201ceD4372308ACD610B) {
    +++ description: Merkle Trie contract used to prove withdrawals that were initiated in the legacy system, deprecated for new withdrawals and succeeded by a merkle tree library in the KromaPortal.
      description:
+        "Merkle Trie contract used to prove withdrawals that were initiated in the legacy system, deprecated for new withdrawals and succeeded by a merkle tree library in the KromaPortal."
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}]}
      issuedPermissions.1:
+        {"permission":"sequence","to":"0x41b8cD6791De4D8f9E0eaF7861aC506822AdcE12","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      template:
+        "opstack/SystemConfig"
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract KromaSecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: Custom Multisig contract in which each signer is identified by a token. The threshold is 8 and the token contract is called SecurityCouncilToken.
      name:
-        "SecurityCouncil"
+        "KromaSecurityCouncil"
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      description:
+        "Custom Multisig contract in which each signer is identified by a token. The threshold is 8 and the token contract is called SecurityCouncilToken."
      receivedPermissions:
+        [{"permission":"guard","from":"0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"},{"permission":"interact","from":"0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a","description":"dismiss ongoing challenges and override state roots (`forceDeleteOutput()`)."},{"permission":"interact","from":"0xFdFF462845953D90719A78Fd12a2d103541d2103","description":"become a validator without posting a bond."}]
      references:
+        [{"text":"Security Council members - Announcing Kroma Security Council","href":"https://blog.kroma.network/announcing-kroma-security-council-435b540d2ab4"}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      template:
+        "opstack/L1CrossDomainMessenger"
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      template:
+        "opstack/L1ERC721Bridge"
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"},{"permission":"upgrade","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"permission":"upgrade","from":"0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"},{"permission":"upgrade","from":"0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"},{"permission":"upgrade","from":"0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"},{"permission":"upgrade","from":"0x3de211088dF516da72efe68D386b561BEE256Ec4"},{"permission":"upgrade","from":"0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"},{"permission":"upgrade","from":"0x46d07221dfC313afe1BF104F4bB1f185301D65B9"},{"permission":"upgrade","from":"0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"},{"permission":"upgrade","from":"0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"},{"permission":"upgrade","from":"0x827962404D7104202C5aaa6b929115C8211d9596"},{"permission":"upgrade","from":"0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"},{"permission":"upgrade","from":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"permission":"upgrade","from":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"},{"permission":"upgrade","from":"0xFdFF462845953D90719A78Fd12a2d103541d2103"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"},{"permission":"upgrade","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"permission":"upgrade","from":"0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"},{"permission":"upgrade","from":"0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"},{"permission":"upgrade","from":"0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"},{"permission":"upgrade","from":"0x3de211088dF516da72efe68D386b561BEE256Ec4"},{"permission":"upgrade","from":"0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"},{"permission":"upgrade","from":"0x46d07221dfC313afe1BF104F4bB1f185301D65B9"},{"permission":"upgrade","from":"0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"},{"permission":"upgrade","from":"0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"},{"permission":"upgrade","from":"0x827962404D7104202C5aaa6b929115C8211d9596","description":"upgrading the bridge implementation can give access to all funds escrowed therein."},{"permission":"upgrade","from":"0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"},{"permission":"upgrade","from":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"permission":"upgrade","from":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"},{"permission":"upgrade","from":"0xFdFF462845953D90719A78Fd12a2d103541d2103"}]
    }
```

```diff
    contract ZkVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: ZK verifier used to verify the last step of a legacy zkEVM proof, which corresponds to a block.
      name:
-        "ZKVerifier"
+        "ZkVerifier"
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      description:
+        "ZK verifier used to verify the last step of a legacy zkEVM proof, which corresponds to a block."
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: Contract used to challenge state roots and prove fraud. If successful, the wrong state root in the 0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6 is replaced.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      issuedPermissions.0.description:
+        "dismiss ongoing challenges and override state roots (`forceDeleteOutput()`)."
      fieldMeta.challengedRoots.severity:
-        "MEDIUM"
+        "HIGH"
      description:
+        "Contract used to challenge state roots and prove fraud. If successful, the wrong state root in the 0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6 is replaced."
    }
```

```diff
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e) {
    +++ description: None
      issuedPermissions.0.to:
-        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
    }
```

```diff
-   Status: DELETED
    contract SpectrumHub (0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5)
    +++ description: None
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      template:
+        "opstack/L1StandardBridge"
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

```diff
-   Status: DELETED
    contract SpectrumCore (0x88b6bBb148748C18B377A57c9d4E6c714AF28078)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C)
    +++ description: None
```

```diff
    contract AssetManager (0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3) {
    +++ description: Manages the delegation and undelegation of KRO tokens and Kroma Guardian House (KGH) NFTs for Proposers (Kroma Validators) and distributes rewards.
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
    }
```

```diff
-   Status: DELETED
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xacA91C74748090f861E25D142B6fCB265c6171c8)
    +++ description: None
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: A governance proxy contract using token voting with 0xe4D08346609055c091D3DEECdAAd3Bf83119B08c as identification of actors allowed to vote/sign a proposal which is passed to the 0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1 afterwards.
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      issuedPermissions.0.via.2:
+        {"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}
      issuedPermissions.0.via.1:
+        {"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"}
      issuedPermissions.0.via.0:
+        {"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}
      description:
+        "A governance proxy contract using token voting with 0xe4D08346609055c091D3DEECdAAd3Bf83119B08c as identification of actors allowed to vote/sign a proposal which is passed to the 0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1 afterwards."
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"cancel queued transactions."},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"execute transactions that are ready."},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"manage all access control roles."},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"propose transactions."}]
    }
```

```diff
-   Status: DELETED
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d)
    +++ description: None
```

```diff
    contract SecurityCouncilTokenOwners (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: A soulbound token implementation to identify participants of the KromaSecurityCouncil. Owners of the token are members of the council. There are currently 10 members.
      name:
-        "SecurityCouncilToken"
+        "SecurityCouncilTokenOwners"
      issuedPermissions.10:
+        {"permission":"upgrade","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}]}
      issuedPermissions.9:
+        {"permission":"interact","to":"0xECe4AAf6A41aa81A164363Ec6C420510617Fc998","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.8:
+        {"permission":"interact","to":"0x8ECF028Cd647379E580DaA6701A11154750fcd3c","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.7:
+        {"permission":"interact","to":"0x77Fe100758c5320cdfBb4f4a0Bed57885c97158A","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.6:
+        {"permission":"interact","to":"0x66FA82F4AEA284d1d208437F179dFE13d8118f3A","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.5:
+        {"permission":"interact","to":"0x5ddcf494A8b6EeE4904934E829109cCF584EAF80","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.4:
+        {"permission":"interact","to":"0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0x3aa00bb915A8e78b0523E4c365e3E70A19d329e6","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0x27EFE61C5266e461995141f57b4D13F13c83f786","description":"one of the signers of the KromaSecurityCouncil.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0x16876e5c608cec36968517A9Eb345269D308D94a"
      issuedPermissions.0.description:
+        "one of the signers of the KromaSecurityCouncil."
      description:
+        "A soulbound token implementation to identify participants of the KromaSecurityCouncil. Owners of the token are members of the council. There are currently 10 members."
      receivedPermissions:
+        [{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"cancel queued transactions.","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"execute transactions that are ready.","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"manage all access control roles.","via":[{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"manage all access control roles.","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"interact","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","description":"propose transactions.","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"interact","from":"0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x31F648572b67e60Ec6eb8E197E1848CC5F5558de","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x3de211088dF516da72efe68D386b561BEE256Ec4","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x46d07221dfC313afe1BF104F4bB1f185301D65B9","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e","via":[{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0x827962404D7104202C5aaa6b929115C8211d9596","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]},{"permission":"upgrade","from":"0xFdFF462845953D90719A78Fd12a2d103541d2103","via":[{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"}]
    }
```

```diff
    contract KromaRewardVaultMultisig (0xe57E217d8ed498992452791622711B866403E950) {
    +++ description: Escrows a pool of KRO used as validator rewards by the AssetManager.
      description:
+        "Escrows a pool of KRO used as validator rewards by the AssetManager."
    }
```

```diff
-   Status: DELETED
    contract spETH (0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474)
    +++ description: None
```

```diff
    contract Poseidon2 (0xFd234971881a7c72965175fA8E438c97B2Dcd273) {
    +++ description: Contract used to compute hashes. It is used by the ZKMerkeTrie. The contract has been generated using the circomlibjs library.
      description:
+        "Contract used to compute hashes. It is used by the ZKMerkeTrie. The contract has been generated using the circomlibjs library."
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: Contract used to manage the Proposers. Anyone can submit a deposit and bond to a state root, or create a challenge. It also manages the Proposer rotation for each submittable block using a random selection. If the selected proposer fails to publish a root within 30m then the submission becomes open to everyone.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","via":[{"address":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537"},{"address":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"},{"address":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.0.to:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
+        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      issuedPermissions.0.description:
+        "become a validator without posting a bond."
      values.RoundDurationFormatted:
+        "30m"
      description:
+        "Contract used to manage the Proposers. Anyone can submit a deposit and bond to a state root, or create a challenge. It also manages the Proposer rotation for each submittable block using a random selection. If the selected proposer fails to publish a root within 30m then the submission becomes open to everyone."
    }
```

Generated with discovered.json: 0x4dcaca955a29f835bfb97ea15820e1a98c878408

# Diff at Mon, 10 Feb 2025 19:04:08 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21141582
- current block number: 21141582

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141582 (main branch discovery), not current.

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x29c5b3b4018d04d7c04196e65aa48d5f06fee52b

# Diff at Mon, 20 Jan 2025 11:09:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21141582
- current block number: 21141582

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141582 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      receivedPermissions.0.target:
-        "0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"
      receivedPermissions.0.from:
+        "0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"
    }
```

```diff
    contract ValidatorManager (0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363) {
    +++ description: Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the permission to submit the output root. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets.
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      receivedPermissions.14.target:
-        "0xFdFF462845953D90719A78Fd12a2d103541d2103"
      receivedPermissions.14.from:
+        "0xFdFF462845953D90719A78Fd12a2d103541d2103"
      receivedPermissions.13.target:
-        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      receivedPermissions.13.from:
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      receivedPermissions.12.target:
-        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      receivedPermissions.12.from:
+        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      receivedPermissions.11.target:
-        "0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"
      receivedPermissions.11.from:
+        "0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"
      receivedPermissions.10.target:
-        "0x827962404D7104202C5aaa6b929115C8211d9596"
      receivedPermissions.10.from:
+        "0x827962404D7104202C5aaa6b929115C8211d9596"
      receivedPermissions.9.target:
-        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
      receivedPermissions.9.from:
+        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
      receivedPermissions.8.target:
-        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
      receivedPermissions.8.from:
+        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
      receivedPermissions.7.target:
-        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
      receivedPermissions.7.from:
+        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
      receivedPermissions.6.target:
-        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
      receivedPermissions.6.from:
+        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
      receivedPermissions.5.target:
-        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      receivedPermissions.5.from:
+        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      receivedPermissions.4.target:
-        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
      receivedPermissions.4.from:
+        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
      receivedPermissions.3.target:
-        "0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"
      receivedPermissions.3.from:
+        "0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"
      receivedPermissions.2.target:
-        "0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"
      receivedPermissions.2.from:
+        "0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"
      receivedPermissions.1.target:
-        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      receivedPermissions.1.from:
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      receivedPermissions.0.target:
-        "0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"
      receivedPermissions.0.from:
+        "0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"
    }
```

```diff
    contract ZKVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      issuedPermissions.0.to:
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
    }
```

```diff
    contract SpectrumHub (0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x9841bC06C8284095824e9397AC818aD1114C444C"
      issuedPermissions.0.to:
+        "0x9841bC06C8284095824e9397AC818aD1114C444C"
    }
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract SpectrumCore (0x88b6bBb148748C18B377A57c9d4E6c714AF28078) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd26F4195B147b988E7497779f7DED22ba130204d"
      issuedPermissions.0.to:
+        "0xd26F4195B147b988E7497779f7DED22ba130204d"
    }
```

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
      issuedPermissions.0.to:
+        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
      receivedPermissions.0.target:
-        "0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5"
      receivedPermissions.0.from:
+        "0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5"
    }
```

```diff
    contract AssetManager (0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3) {
    +++ description: Manages the delegation and undelegation of KRO tokens and Kroma Guardian House (KGH) NFTs for Proposers (Kroma Validators) and distributes rewards.
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
      issuedPermissions.0.to:
+        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
      receivedPermissions.0.target:
-        "0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474"
      receivedPermissions.0.from:
+        "0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474"
    }
```

```diff
    contract  (0xacA91C74748090f861E25D142B6fCB265c6171c8) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
      issuedPermissions.0.to:
+        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
      issuedPermissions.0.to:
+        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
      receivedPermissions.0.target:
-        "0x88b6bBb148748C18B377A57c9d4E6c714AF28078"
      receivedPermissions.0.from:
+        "0x88b6bBb148748C18B377A57c9d4E6c714AF28078"
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

```diff
    contract spETH (0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4"
      issuedPermissions.0.to:
+        "0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4"
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
      issuedPermissions.0.to:
+        "0x665c23A5722B6A237fa6Be2B49c0A94504db1edd"
    }
```

Generated with discovered.json: 0xd51f5b5e640e51ac7f0ba695a7ee7577b9f7b52a

# Diff at Mon, 20 Jan 2025 09:24:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21141582
- current block number: 21141582

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141582 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      fieldMeta.COLOSSEUM.type:
+        "CODE_CHANGE"
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      fieldMeta.COLOSSEUM.type:
+        "CODE_CHANGE"
      fieldMeta.transactionCount.type:
+        "L2"
    }
```

Generated with discovered.json: 0xff6fd8a4c854beb6a880cda7353de79d84875215

# Diff at Fri, 10 Jan 2025 15:24:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13c134b0211f75779d58c36868cbda90565479ce block: 21141582
- current block number: 21141582

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21141582 (main branch discovery), not current.

```diff
    contract Poseidon2 (0xFd234971881a7c72965175fA8E438c97B2Dcd273) {
    +++ description: None
      unverified:
-        true
      sourceHashes:
+        ["0xa3600b2900d8b1fef0f3e6e58b0a56f5639eee39776eb2d7bce841b245fdf288"]
      references:
+        [{"text":"Source Code","href":"https://github.com/iden3/circomlibjs/blob/main/src/poseidon_gencontract.js"}]
    }
```

Generated with discovered.json: 0x1d83f3fa814362ea0a7cae6d80b8ece3290603e1

# Diff at Fri, 08 Nov 2024 08:00:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53988239f42edde0275ed92d8f3ada4279354f7d block: 21121964
- current block number: 21141582

## Description

Sets to 0. The current validator reward is calculated in the ValidatorManager (`_calculateReward()`) and does not reference this value in the SystemConfig, so it is unclear what consequence this change has. One SC member address is rotated.

## Watched changes

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      values.validatorRewardScalar:
-        5000
+        0
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.tokenOwners.9:
-        "0x16876e5c608cec36968517A9Eb345269D308D94a"
+        "0x27EFE61C5266e461995141f57b4D13F13c83f786"
      values.tokenOwners.4:
-        "0x7B3225ADc5D908668FaA050246680CBE4e75A93f"
+        "0x16876e5c608cec36968517A9Eb345269D308D94a"
      values.tokens.9:
-        13
+        14
      values.tokens.4:
-        6
+        13
    }
```

Generated with discovered.json: 0xae6965fa07c9fb7b28f375e33d6b3162e72d9712

# Diff at Fri, 01 Nov 2024 14:16:06 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21064298
- current block number: 21093326

## Description

New validator, increased security council quorum.

## Watched changes

```diff
    contract ValidatorManager (0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363) {
    +++ description: Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the permission to submit the output root. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets.
      values.nextValidator:
-        "0x3aa00bb915A8e78b0523E4c365e3E70A19d329e6"
+        "0x16876e5c608cec36968517A9Eb345269D308D94a"
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      values.quorum:
-        7
+        8
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.tokenOwners.9:
+        "0x16876e5c608cec36968517A9Eb345269D308D94a"
      values.tokens.9:
+        13
      values.totalSupply:
-        9
+        10
    }
```

Generated with discovered.json: 0x617e6c6d66c82472234945840af020ab950dfe07

# Diff at Fri, 25 Oct 2024 09:44:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 20912649
- current block number: 21041809

## Description

This [upgrade to the L2OutpuOracle and related contracts](https://github.com/kroma-network/kroma/releases/tag/v2.0.0) introduces a TERMINATE_OUTPUT_INDEX to the ValidatorPool, after which all validator management will be switched over to a new ValidatorManager contract. This new contract allows for bonds in KRO (Kroma token) and delegation.

The switch is expected to occur from output index 10107 or after Wed Oct 30 2024 05:20:00 UTC.

## Watched changes

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      sourceHashes.1:
-        "0x23bd4269751ee622a2c70f6ff77812e48b54e0f5b236f7b143e78d31fd26ce19"
+        "0x3e082acc764e6210a6d92e75bffb677ec096ac9d382eef70ea3152f9eeb72791"
      values.$implementation:
-        "0x14126FFa3889a026A79F0f99FaE80B3dc9E38095"
+        "0x4B68F22d96a04F6d80e284C20A648f8Da2fD569b"
      values.$pastUpgrades.1:
+        ["2024-10-24T04:28:47.000Z","0xb2a500d332d7b3348b8ffa91aba9b8a5a3bc018b44225a1b6e99605c56c6564e",["0x4B68F22d96a04F6d80e284C20A648f8Da2fD569b"]]
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.0.0"
+        "1.1.0"
      values.nextFinalizeOutputIndex:
+        9822
      values.nextOutputMinL2Timestamp:
+        1729847989
      values.VALIDATOR_MANAGER:
+        "0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      receivedPermissions.14:
+        {"permission":"upgrade","target":"0xFdFF462845953D90719A78Fd12a2d103541d2103"}
      receivedPermissions.13:
+        {"permission":"upgrade","target":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"}
      receivedPermissions.12.target:
-        "0xFdFF462845953D90719A78Fd12a2d103541d2103"
+        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      receivedPermissions.11.target:
-        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
+        "0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3"
      receivedPermissions.10.target:
-        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
+        "0x827962404D7104202C5aaa6b929115C8211d9596"
      receivedPermissions.9.target:
-        "0x827962404D7104202C5aaa6b929115C8211d9596"
+        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
      receivedPermissions.8.target:
-        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
+        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
      receivedPermissions.7.target:
-        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
+        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
      receivedPermissions.6.target:
-        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
+        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
      receivedPermissions.5.target:
-        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
+        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      receivedPermissions.4.target:
-        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
+        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
      receivedPermissions.3.target:
-        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
+        "0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"
      receivedPermissions.2.target:
-        "0x31F648572b67e60Ec6eb8E197E1848CC5F5558de"
+        "0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363"
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      sourceHashes.1:
-        "0x044a9955ffcea5b68400e934c9bd2a7e7f856ad28b98727c0cf762a44a428601"
+        "0x00a929674c752e3543c7d0b26d1965574c3f956dd892502eb782e8087e12af45"
      values.$implementation:
-        "0xb87eaB624EE684C1799f1E8b24936A1c90759eEc"
+        "0xAB54b3e775f645cf4486039bfA4dA539E70c9f99"
      values.$pastUpgrades.3:
+        ["2024-10-24T04:28:47.000Z","0xb2a500d332d7b3348b8ffa91aba9b8a5a3bc018b44225a1b6e99605c56c6564e",["0xAB54b3e775f645cf4486039bfA4dA539E70c9f99"]]
      values.$upgradeCount:
-        3
+        4
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      sourceHashes.1:
-        "0x22ee68d5248870b98295dbc19fb66375ddbb2b23f040c2c6d8cc43a946f9940f"
+        "0xac308f84cc546d491c72f2e9d4309c3e67334cd61b5300e0eb259d2950e20511"
      values.$implementation:
-        "0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4"
+        "0xE36776FFA20a9206dcD742C981402a3f3d81938d"
      values.$pastUpgrades.3:
+        ["2024-10-24T04:28:47.000Z","0xb2a500d332d7b3348b8ffa91aba9b8a5a3bc018b44225a1b6e99605c56c6564e",["0xE36776FFA20a9206dcD742C981402a3f3d81938d"]]
      values.$upgradeCount:
-        3
+        4
      values.version:
-        "1.0.1"
+        "1.1.0"
      values.TERMINATE_OUTPUT_INDEX:
+        10106
    }
```

```diff
+   Status: CREATED
    contract ValidatorManager (0x232277d9672eEdd53c4B26C0F386C2Eb88DC7363)
    +++ description: Manages the set of Proposers (Validators in Kroma) and selects the next proposer with the permission to submit the output root. It is also the entry point for other contracts, such as the L2OutputOracle and the Colosseum, which distribute output rewards and slash challenge losers. It makes successive calls to the AssetManager to apply changes to the proposers' assets.
```

```diff
+   Status: CREATED
    contract AssetManager (0xa295310DE52b86F236A815AFb2f518F3C0F5A6D3)
    +++ description: Manages the delegation and undelegation of KRO tokens and Kroma Guardian House (KGH) NFTs for Proposers (Kroma Validators) and distributes rewards.
```

```diff
+   Status: CREATED
    contract  (0xacA91C74748090f861E25D142B6fCB265c6171c8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract KromaRewardVaultMultisig (0xe57E217d8ed498992452791622711B866403E950)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/AssetManager/AssetManager.sol   | 1778 +++++++++++++++
 .../kroma/ethereum/.flat/AssetManager/Proxy.p.sol  |  211 ++
 .../Colosseum/Colosseum.sol                        |  554 +++--
 .../.flat/KromaRewardVaultMultisig/GnosisSafe.sol  |  953 ++++++++
 .../KromaRewardVaultMultisig/GnosisSafeProxy.p.sol |   35 +
 .../L2OutputOracle/L2OutputOracle.sol              |  652 ++----
 .../ethereum/.flat/ValidatorManager/Proxy.p.sol    |  211 ++
 .../.flat/ValidatorManager/ValidatorManager.sol    | 2301 ++++++++++++++++++++
 .../ValidatorPool/ValidatorPool.sol                |   69 +-
 9 files changed, 5982 insertions(+), 782 deletions(-)
```

Generated with discovered.json: 0x434a34a25191acb813b1ed81b407a2f0bf6eef41

# Diff at Mon, 21 Oct 2024 11:06:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20912649
- current block number: 20912649

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912649 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x14126FFa3889a026A79F0f99FaE80B3dc9E38095"]
      values.$pastUpgrades.0.1:
-        ["0x14126FFa3889a026A79F0f99FaE80B3dc9E38095"]
+        "0xf1ce5facb5ac6b858552c8af4867797e1c69ad89629f1c836b7f489770683783"
    }
```

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xe44da6e9fA92E3FD897Da84d38fa6B9322Dd22c3"]
      values.$pastUpgrades.1.1:
-        ["0xe44da6e9fA92E3FD897Da84d38fa6B9322Dd22c3"]
+        "0xf4e23f51e23f9549e6bed354f5330524c65d5796b765bd38fdacdb6758e7f8ff"
      values.$pastUpgrades.0.2:
+        ["0x595E1b330892Fcbf18b2BF099DE501Ad4d6A07C4"]
      values.$pastUpgrades.0.1:
-        ["0x595E1b330892Fcbf18b2BF099DE501Ad4d6A07C4"]
+        "0xc92251d7f8a454b533f0e272ba324cb7572ca4142aabf17cd29821e1d8ebfe1b"
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x381F53695230BAF83a39D1a08304D233A35730Fa"]
      values.$pastUpgrades.0.1:
-        ["0x381F53695230BAF83a39D1a08304D233A35730Fa"]
+        "0x3166f6173eb630e96f74c5c9d6765cd93e39566dc592a423fddae11eb09f8d17"
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2af8a383C395EBa6551E674EeD02344936fE36f5"]
      values.$pastUpgrades.0.1:
-        ["0x2af8a383C395EBa6551E674EeD02344936fE36f5"]
+        "0x3dcaff162fff51f2f6ba6264967bb5a3e6e9aefeb290b159109038ae38455e10"
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x61c7C854Dcdf8393230B1242a4c1107f4d023c28"]
      values.$pastUpgrades.1.1:
-        ["0x61c7C854Dcdf8393230B1242a4c1107f4d023c28"]
+        "0xf4e23f51e23f9549e6bed354f5330524c65d5796b765bd38fdacdb6758e7f8ff"
      values.$pastUpgrades.0.2:
+        ["0x2BB1c629c46a4018fBe2538a98da7162F8355583"]
      values.$pastUpgrades.0.1:
-        ["0x2BB1c629c46a4018fBe2538a98da7162F8355583"]
+        "0x7aed5f7b2d0d4843ead380d9f809554d9d3f379d81ca91a8645fcd4873e4d4bf"
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x675924D68200F2C967Ba12349d5d510676C7214c"]
      values.$pastUpgrades.0.1:
-        ["0x675924D68200F2C967Ba12349d5d510676C7214c"]
+        "0xc077167cfc27b631ad397c64fd72bcaf2c8fcc7c9f08498eb247abc0094354a5"
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xbB1cDB5Cc35B1c9801DA8772aCBcDbd323A912D9"]
      values.$pastUpgrades.1.1:
-        ["0xbB1cDB5Cc35B1c9801DA8772aCBcDbd323A912D9"]
+        "0x2aaca06bcfebdfe7511fe20033c1af5dd9c4cae053340995621ce10da29392ec"
      values.$pastUpgrades.0.2:
+        ["0x0257e4d92C00C9EfcCa1d641b224d7d09cfa4522"]
      values.$pastUpgrades.0.1:
-        ["0x0257e4d92C00C9EfcCa1d641b224d7d09cfa4522"]
+        "0xb5f090dda7636b95e017de8e0619fc4d6f706b7b4a2a9bbd07996bd85ef70bad"
    }
```

```diff
    contract ZKVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x4cd05aB629055a449617a28E3466660403eA7126"]
      values.$pastUpgrades.2.1:
-        ["0x4cd05aB629055a449617a28E3466660403eA7126"]
+        "0xe56ba658fc810d727438e3bb124aa2e8ef1c25e5c21cbfe9715983ba5ce65a63"
      values.$pastUpgrades.1.2:
+        ["0x7E79726560B140fd6e089547bD049509F5423BFf"]
      values.$pastUpgrades.1.1:
-        ["0x7E79726560B140fd6e089547bD049509F5423BFf"]
+        "0x66fecb7dffc867d91d6f840e65fc28f81ad1301204cfca38b3bbb22146ffa361"
      values.$pastUpgrades.0.2:
+        ["0xD3b1D396330EA8dd79615f12433B856160d7D8B4"]
      values.$pastUpgrades.0.1:
-        ["0xD3b1D396330EA8dd79615f12433B856160d7D8B4"]
+        "0x6ab34004b7846a1d1406bc53825ee386d905f8499c72ab9bfe07f4721d773ae9"
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xb87eaB624EE684C1799f1E8b24936A1c90759eEc"]
      values.$pastUpgrades.2.1:
-        ["0xb87eaB624EE684C1799f1E8b24936A1c90759eEc"]
+        "0x0fb2eca6483b1d042af562bf0e8e804c1356df56d7b8094e9d6edd4b63edf715"
      values.$pastUpgrades.1.2:
+        ["0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"]
      values.$pastUpgrades.1.1:
-        ["0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"]
+        "0xd420f3a8af8254ca1095409b3c4c2a3a1faa26fbe50c0477663e1bcb39727dfc"
      values.$pastUpgrades.0.2:
+        ["0x7526F997ea040B3949415c3a44e708273863AA2b"]
      values.$pastUpgrades.0.1:
-        ["0x7526F997ea040B3949415c3a44e708273863AA2b"]
+        "0x70494d42df3a5668be6ac9bd1a46cdcfebe8980cae31dddcb7ec86c97200d60f"
    }
```

```diff
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xE4e9F3AD8A6F224c4b39854D3550AD258441AfE3"]
      values.$pastUpgrades.0.1:
-        ["0xE4e9F3AD8A6F224c4b39854D3550AD258441AfE3"]
+        "0x04a7ec0dad1a7a0ebf4cb2bd1f983b19d43e57972e91c4e73aabf2bff3530014"
    }
```

```diff
    contract SpectrumHub (0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x5d55AEC0a39c660f369F147c4133cc099f095508"]
      values.$pastUpgrades.2.1:
-        ["0x5d55AEC0a39c660f369F147c4133cc099f095508"]
+        "0x1db635b7f09a772f64f347dd3ce8393a2aae5d78bcd215c8551c0de6758d1512"
      values.$pastUpgrades.1.2:
+        ["0x736058a55d3D711aC2DC131A6B926A4C245c7351"]
      values.$pastUpgrades.1.1:
-        ["0x736058a55d3D711aC2DC131A6B926A4C245c7351"]
+        "0xddf911daed4f7da04853f3c52b8d49c9b4221ed29e9d1ff79b26a2e1472cf259"
      values.$pastUpgrades.0.2:
+        ["0xbb1C83Da81A6eb02B3156A894a58325b741e0F0F"]
      values.$pastUpgrades.0.1:
-        ["0xbb1C83Da81A6eb02B3156A894a58325b741e0F0F"]
+        "0x22e682ffba1c1e5f191a38d64dd37dbf464961c89ae771cbb7d46c2e1ebf2b80"
    }
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x404133EdF24F56b7dD9c6d89Fb56bb35244461B4"]
      values.$pastUpgrades.0.1:
-        ["0x404133EdF24F56b7dD9c6d89Fb56bb35244461B4"]
+        "0xe67e8f042d304b70f1fd718343378219e0be9c49ed4a8242f8f96ea9ced2c0fd"
    }
```

```diff
    contract SpectrumCore (0x88b6bBb148748C18B377A57c9d4E6c714AF28078) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x89792dDc14209A3156d90F5e4A34F4c532bB4EC6"]
      values.$pastUpgrades.1.1:
-        ["0x89792dDc14209A3156d90F5e4A34F4c532bB4EC6"]
+        "0x1210763148011b6c3e5c21d85fa5926a6436157be454f7f44534af56210ba703"
      values.$pastUpgrades.0.2:
+        ["0xCa977F1D10Dd2361ae57295AdC0C6fFc06f1E6C0"]
      values.$pastUpgrades.0.1:
-        ["0xCa977F1D10Dd2361ae57295AdC0C6fFc06f1E6C0"]
+        "0x1d2561062b895b73850985943534cf27aeb54c7cca7775f31ec41c8e3bac14ef"
    }
```

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]
      values.$pastUpgrades.0.1:
-        ["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]
+        "0x22e682ffba1c1e5f191a38d64dd37dbf464961c89ae771cbb7d46c2e1ebf2b80"
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]
      values.$pastUpgrades.0.1:
-        ["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]
+        "0x2193af686678c3946482fc5b9506c6360d5c7b7810e917e86c82b3676278f46f"
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x64F8F4EB207D51F74caf6db644Bf710Ad86989b3"]
      values.$pastUpgrades.1.1:
-        ["0x64F8F4EB207D51F74caf6db644Bf710Ad86989b3"]
+        "0xf4e23f51e23f9549e6bed354f5330524c65d5796b765bd38fdacdb6758e7f8ff"
      values.$pastUpgrades.0.2:
+        ["0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030"]
      values.$pastUpgrades.0.1:
-        ["0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030"]
+        "0x1474ff104cbd078775403ee9b33a18394d045e5e00e03e94586e73a3596cbde0"
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]
      values.$pastUpgrades.0.1:
-        ["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]
+        "0x1d2561062b895b73850985943534cf27aeb54c7cca7775f31ec41c8e3bac14ef"
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x108eDc4Df0b9B04dcE9f6FFBD65Dd9895562c14C"]
      values.$pastUpgrades.1.1:
-        ["0x108eDc4Df0b9B04dcE9f6FFBD65Dd9895562c14C"]
+        "0xf4e23f51e23f9549e6bed354f5330524c65d5796b765bd38fdacdb6758e7f8ff"
      values.$pastUpgrades.0.2:
+        ["0x54140F4Cd6e6665BE0151eD5a8aC949EC2942439"]
      values.$pastUpgrades.0.1:
-        ["0x54140F4Cd6e6665BE0151eD5a8aC949EC2942439"]
+        "0xa1a5d4f87ba3ebc2951c5f2d521882061eaf5ee68bc8c6179ba1dfc0ed6b8a7b"
    }
```

```diff
    contract spETH (0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x05F3e2b5f90EF4543D3E147AD4DDAa0C7A8C3Fcc"]
      values.$pastUpgrades.0.1:
-        ["0x05F3e2b5f90EF4543D3E147AD4DDAa0C7A8C3Fcc"]
+        "0x2193af686678c3946482fc5b9506c6360d5c7b7810e917e86c82b3676278f46f"
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4"]
      values.$pastUpgrades.2.1:
-        ["0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4"]
+        "0xd420f3a8af8254ca1095409b3c4c2a3a1faa26fbe50c0477663e1bcb39727dfc"
      values.$pastUpgrades.1.2:
+        ["0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"]
      values.$pastUpgrades.1.1:
-        ["0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"]
+        "0xf4e23f51e23f9549e6bed354f5330524c65d5796b765bd38fdacdb6758e7f8ff"
      values.$pastUpgrades.0.2:
+        ["0x6e1781678ffE6CDc109fd3bC0833c47BD0F23de1"]
      values.$pastUpgrades.0.1:
-        ["0x6e1781678ffE6CDc109fd3bC0833c47BD0F23de1"]
+        "0x31c5282eb4cc1bcf3b3a3fbbbb0116c0ee335b4ccabd497f02b2761b0bc65dbd"
    }
```

Generated with discovered.json: 0xae4d22496c8fabd8e7c78c6e9b24cd65c4ba6c89

# Diff at Mon, 14 Oct 2024 10:52:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20912649
- current block number: 20912649

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20912649 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x23bd4269751ee622a2c70f6ff77812e48b54e0f5b236f7b143e78d31fd26ce19"]
    }
```

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x6bcef64b35598149aee2e622e06fb8e414063ee43de09312ca4bbd0306b0eea9"]
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x110b957ac30147c969242967fdb5705351484239bca1c7060fe8b522d8d9cc44"]
    }
```

```diff
    contract ZKMerkleTrie (0x339208824010425cBE73201ceD4372308ACD610B) {
    +++ description: None
      sourceHashes:
+        ["0x90927c331f5a5d562d23263a9343eb8828b5dc83798239506f42fcd382b903a4"]
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x579a99eb751c6e2b976e753d11220cfa89229ac2225f9ce87d4dfdabc7371ff0"]
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x1a3ad305d7acaa5f74c8de3149553a1eb31fa3be9e4649c601512623645015a4"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xaff375ae74ed132384e4286ac5de5830f7c8e7c3f2bb6b31f4f2251e0dc2b8d2"]
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x4a2ad213ff7b5da7d065bc134bb2392837364747089248e4083d17a39ea87fd7"]
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      sourceHashes:
+        ["0x82e048446e41433c990a710c946cb691f4cde26f99023a0afcfda2d22e1f30d0"]
    }
```

```diff
    contract ZKVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd974fa3206ad97d493c1fadcbb131b7fee176407ad7aae0d92d9b54b47bfbc32"]
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x044a9955ffcea5b68400e934c9bd2a7e7f856ad28b98727c0cf762a44a428601"]
    }
```

```diff
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x531e0a3d7e3c3cf7433e6462f1606d0470104dfd9eb9e500fecc14e8334670dd"]
    }
```

```diff
    contract SpectrumHub (0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5) {
    +++ description: None
      sourceHashes:
+        ["0x452d0da14e8093b03552229d64244a198eadf6e81731f2c5755cf5c4efae5df6","0x7c08ca7f13985a63106aa5f6dc1ea45a6706252a7c4e9578523365d6d77ca826"]
    }
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xe4eddca14af777a8abcb70781c5881acfaec17ce822a4231242061a4032ace9a"]
    }
```

```diff
    contract SpectrumCore (0x88b6bBb148748C18B377A57c9d4E6c714AF28078) {
    +++ description: None
      sourceHashes:
+        ["0x452d0da14e8093b03552229d64244a198eadf6e81731f2c5755cf5c4efae5df6","0x4e05028ce6debb60bfcfc5262ccc5afbc807b98fca7b0e0afbe849724f16e5ed"]
    }
```

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      sourceHashes:
+        ["0xeb2472cd0f50272a33698b0eea38767d493d4d4f25ef378a981cde4ed201c258","0x1ec7e35ec363a1c5133b29101701dabc1f1cf8774648944bfb44ee8684ddb9d3"]
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      sourceHashes:
+        ["0xeb2472cd0f50272a33698b0eea38767d493d4d4f25ef378a981cde4ed201c258","0x1ec7e35ec363a1c5133b29101701dabc1f1cf8774648944bfb44ee8684ddb9d3"]
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x83b27c2e32131de05d6b3676aea653f8a46267dd75c421acd51b2c53fa145604"]
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      sourceHashes:
+        ["0xeb2472cd0f50272a33698b0eea38767d493d4d4f25ef378a981cde4ed201c258","0x1ec7e35ec363a1c5133b29101701dabc1f1cf8774648944bfb44ee8684ddb9d3"]
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x5143e277c3037f518a48916fbdf29d6ab69cb265fedb2d68e4e2ba404b42a453"]
    }
```

```diff
    contract spETH (0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474) {
    +++ description: None
      sourceHashes:
+        ["0x452d0da14e8093b03552229d64244a198eadf6e81731f2c5755cf5c4efae5df6","0xd221fde741d3a22b1b97b9996ba58d404be2eb771c22e87a783d59d6fa5f01f9"]
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x22ee68d5248870b98295dbc19fb66375ddbb2b23f040c2c6d8cc43a946f9940f"]
    }
```

Generated with discovered.json: 0x192ec46727290d3f2d3b8213fa58f007f2fd1280

# Diff at Mon, 07 Oct 2024 09:02:03 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ec3878239ad71f9055b207bdcd338b2f207af050 block: 20232340
- current block number: 20912649

## Description

One SC signer swapped its EOA (Xangle): https://www.tally.xyz/gov/kroma-security-council-l2/proposal/66793954205565734871927487347209424383799739452575476193452192540588648719016.

## Watched changes

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.tokenOwners.8:
-        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
+        "0x66FA82F4AEA284d1d208437F179dFE13d8118f3A"
      values.tokenOwners.3:
-        "0xbDeE962137373A755a71C716E01B9946B1a27686"
+        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
      values.tokens.8:
-        10
+        12
      values.tokens.3:
-        5
+        10
    }
```

Generated with discovered.json: 0x5b6193f2a97f297ba8bb7924dd948346e3654372

# Diff at Tue, 01 Oct 2024 10:51:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20232340
- current block number: 20232340

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20232340 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:26:47.000Z",["0x14126FFa3889a026A79F0f99FaE80B3dc9E38095"]]]
    }
```

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:30:35.000Z",["0x595E1b330892Fcbf18b2BF099DE501Ad4d6A07C4"]],["2023-11-22T07:31:11.000Z",["0xe44da6e9fA92E3FD897Da84d38fa6B9322Dd22c3"]]]
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:27:59.000Z",["0x381F53695230BAF83a39D1a08304D233A35730Fa"]]]
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:28:23.000Z",["0x2af8a383C395EBa6551E674EeD02344936fE36f5"]]]
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:27:35.000Z",["0x2BB1c629c46a4018fBe2538a98da7162F8355583"]],["2023-11-22T07:31:11.000Z",["0x61c7C854Dcdf8393230B1242a4c1107f4d023c28"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:24:47.000Z",["0x675924D68200F2C967Ba12349d5d510676C7214c"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-29T05:48:11.000Z",["0x0257e4d92C00C9EfcCa1d641b224d7d09cfa4522"]],["2023-09-05T02:25:35.000Z",["0xbB1cDB5Cc35B1c9801DA8772aCBcDbd323A912D9"]]]
    }
```

```diff
    contract ZKVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-08-29T05:49:23.000Z",["0xD3b1D396330EA8dd79615f12433B856160d7D8B4"]],["2023-09-01T03:41:59.000Z",["0x7E79726560B140fd6e089547bD049509F5423BFf"]],["2024-06-21T06:13:11.000Z",["0x4cd05aB629055a449617a28E3466660403eA7126"]]]
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:27:11.000Z",["0x7526F997ea040B3949415c3a44e708273863AA2b"]],["2024-04-05T08:14:59.000Z",["0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"]],["2024-04-25T08:09:11.000Z",["0xb87eaB624EE684C1799f1E8b24936A1c90759eEc"]]]
    }
```

```diff
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-11-16T08:17:11.000Z",["0xE4e9F3AD8A6F224c4b39854D3550AD258441AfE3"]]]
    }
```

```diff
    contract SpectrumHub (0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-13T06:43:23.000Z",["0xbb1C83Da81A6eb02B3156A894a58325b741e0F0F"]],["2024-05-13T07:08:59.000Z",["0x736058a55d3D711aC2DC131A6B926A4C245c7351"]],["2024-05-17T05:55:23.000Z",["0x5d55AEC0a39c660f369F147c4133cc099f095508"]]]
    }
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:25:11.000Z",["0x404133EdF24F56b7dD9c6d89Fb56bb35244461B4"]]]
    }
```

```diff
    contract SpectrumCore (0x88b6bBb148748C18B377A57c9d4E6c714AF28078) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-13T04:33:11.000Z",["0xCa977F1D10Dd2361ae57295AdC0C6fFc06f1E6C0"]],["2024-05-17T05:55:47.000Z",["0x89792dDc14209A3156d90F5e4A34F4c532bB4EC6"]]]
    }
```

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-13T06:43:23.000Z",["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]]]
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-13T04:32:11.000Z",["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]]]
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:30:59.000Z",["0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030"]],["2023-11-22T07:31:11.000Z",["0x64F8F4EB207D51F74caf6db644Bf710Ad86989b3"]]]
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-13T04:33:11.000Z",["0x0114fd85c342F39e22E2c8e1Be512ade856309C0"]]]
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:28:47.000Z",["0x54140F4Cd6e6665BE0151eD5a8aC949EC2942439"]],["2023-11-22T07:31:11.000Z",["0x108eDc4Df0b9B04dcE9f6FFBD65Dd9895562c14C"]]]
    }
```

```diff
    contract spETH (0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-13T04:32:11.000Z",["0x05F3e2b5f90EF4543D3E147AD4DDAa0C7A8C3Fcc"]]]
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-09-05T02:26:23.000Z",["0x6e1781678ffE6CDc109fd3bC0833c47BD0F23de1"]],["2023-11-22T07:31:11.000Z",["0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"]],["2024-04-05T08:14:59.000Z",["0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4"]]]
    }
```

Generated with discovered.json: 0xa0f804d04385316fdedc422c72c8f83409cb6920

# Diff at Fri, 30 Aug 2024 07:53:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20232340
- current block number: 20232340

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20232340 (main branch discovery), not current.

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      receivedPermissions.12.via:
-        []
      receivedPermissions.11.via:
-        []
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
      receivedPermissions.8.via:
-        []
      receivedPermissions.7.via:
-        []
      receivedPermissions.6.via:
-        []
      receivedPermissions.5.via:
-        []
      receivedPermissions.4.via:
-        []
      receivedPermissions.3.via:
-        []
      receivedPermissions.2.via:
-        []
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x1dafe4e6e98463faf88e920a5deaf95f78406d71

# Diff at Fri, 23 Aug 2024 09:52:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20232340
- current block number: 20232340

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20232340 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract ZKVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SpectrumHub (0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SpectrumCore (0x88b6bBb148748C18B377A57c9d4E6c714AF28078) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract spETH (0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xfbf243d3c5c170e22f8f77052d627e34ee28a610

# Diff at Wed, 21 Aug 2024 10:03:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20232340
- current block number: 20232340

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20232340 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e","via":[]}]
    }
```

```diff
    contract KromaPortal (0x31F648572b67e60Ec6eb8E197E1848CC5F5558de) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x46d07221dfC313afe1BF104F4bB1f185301D65B9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6","0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","0x31F648572b67e60Ec6eb8E197E1848CC5F5558de","0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35","0x3de211088dF516da72efe68D386b561BEE256Ec4","0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746","0x46d07221dfC313afe1BF104F4bB1f185301D65B9","0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7","0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a","0x827962404D7104202C5aaa6b929115C8211d9596","0xFdFF462845953D90719A78Fd12a2d103541d2103","0xb3c415c2Aad428D5570208e1772cb68e7D06a537","0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6","via":[]},{"permission":"upgrade","target":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","via":[]},{"permission":"upgrade","target":"0x31F648572b67e60Ec6eb8E197E1848CC5F5558de","via":[]},{"permission":"upgrade","target":"0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35","via":[]},{"permission":"upgrade","target":"0x3de211088dF516da72efe68D386b561BEE256Ec4","via":[]},{"permission":"upgrade","target":"0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746","via":[]},{"permission":"upgrade","target":"0x46d07221dfC313afe1BF104F4bB1f185301D65B9","via":[]},{"permission":"upgrade","target":"0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7","via":[]},{"permission":"upgrade","target":"0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a","via":[]},{"permission":"upgrade","target":"0x827962404D7104202C5aaa6b929115C8211d9596","via":[]},{"permission":"upgrade","target":"0xb3c415c2Aad428D5570208e1772cb68e7D06a537","via":[]},{"permission":"upgrade","target":"0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","via":[]},{"permission":"upgrade","target":"0xFdFF462845953D90719A78Fd12a2d103541d2103","via":[]}]
    }
```

```diff
    contract ZKVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","via":[]}]
    }
```

```diff
    contract SpectrumHub (0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9841bC06C8284095824e9397AC818aD1114C444C","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x827962404D7104202C5aaa6b929115C8211d9596) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract SpectrumCore (0x88b6bBb148748C18B377A57c9d4E6c714AF28078) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd26F4195B147b988E7497779f7DED22ba130204d","via":[]}]
    }
```

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5","via":[]}]
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474","via":[]}]
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x88b6bBb148748C18B377A57c9d4E6c714AF28078"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x88b6bBb148748C18B377A57c9d4E6c714AF28078","via":[]}]
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

```diff
    contract spETH (0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4","via":[]}]
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x665c23A5722B6A237fa6Be2B49c0A94504db1edd","via":[]}]
    }
```

Generated with discovered.json: 0x2aba46ca096ee6f14072f7e88ac3e7271d026f8c

# Diff at Fri, 09 Aug 2024 11:59:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20232340
- current block number: 20232340

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20232340 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      assignedPermissions.upgrade.12:
-        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
+        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
      assignedPermissions.upgrade.11:
-        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
+        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      assignedPermissions.upgrade.10:
-        "0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"
+        "0xFdFF462845953D90719A78Fd12a2d103541d2103"
      assignedPermissions.upgrade.9:
-        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
+        "0x827962404D7104202C5aaa6b929115C8211d9596"
      assignedPermissions.upgrade.8:
-        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
+        "0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a"
      assignedPermissions.upgrade.7:
-        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
+        "0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"
      assignedPermissions.upgrade.6:
-        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
+        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
      assignedPermissions.upgrade.5:
-        "0xFdFF462845953D90719A78Fd12a2d103541d2103"
+        "0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746"
      assignedPermissions.upgrade.4:
-        "0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"
+        "0x3de211088dF516da72efe68D386b561BEE256Ec4"
      assignedPermissions.upgrade.3:
-        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
+        "0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35"
      assignedPermissions.upgrade.1:
-        "0x46d07221dfC313afe1BF104F4bB1f185301D65B9"
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      assignedPermissions.upgrade.0:
-        "0x827962404D7104202C5aaa6b929115C8211d9596"
+        "0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6"
    }
```

Generated with discovered.json: 0xd6a4c51809a153a3c8623e48fb8618c3f6e083da

# Diff at Fri, 09 Aug 2024 10:10:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20232340
- current block number: 20232340

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20232340 (main branch discovery), not current.

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"]
      assignedPermissions.upgrade:
+        ["0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e"]
    }
```

```diff
    contract ProxyAdmin (0x665c23A5722B6A237fa6Be2B49c0A94504db1edd) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6","0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","0x31F648572b67e60Ec6eb8E197E1848CC5F5558de","0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35","0x3de211088dF516da72efe68D386b561BEE256Ec4","0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746","0x46d07221dfC313afe1BF104F4bB1f185301D65B9","0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7","0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a","0x827962404D7104202C5aaa6b929115C8211d9596","0xFdFF462845953D90719A78Fd12a2d103541d2103","0xb3c415c2Aad428D5570208e1772cb68e7D06a537","0xe4D08346609055c091D3DEECdAAd3Bf83119B08c"]
      assignedPermissions.upgrade:
+        ["0x827962404D7104202C5aaa6b929115C8211d9596","0x46d07221dfC313afe1BF104F4bB1f185301D65B9","0x31F648572b67e60Ec6eb8E197E1848CC5F5558de","0xb3c415c2Aad428D5570208e1772cb68e7D06a537","0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6","0xFdFF462845953D90719A78Fd12a2d103541d2103","0x46B8bB4C5dd27bB42807Db477af4d1a7C8A5B746","0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1","0x3de211088dF516da72efe68D386b561BEE256Ec4","0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35","0xe4D08346609055c091D3DEECdAAd3Bf83119B08c","0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a","0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7"]
    }
```

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5"]
      assignedPermissions.upgrade:
+        ["0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5"]
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      assignedPermissions.admin:
-        ["0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474"]
      assignedPermissions.upgrade:
+        ["0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474"]
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x88b6bBb148748C18B377A57c9d4E6c714AF28078"]
      assignedPermissions.upgrade:
+        ["0x88b6bBb148748C18B377A57c9d4E6c714AF28078"]
    }
```

Generated with discovered.json: 0x5ec6b33639bd2d38bc1978f0c2fdd216d6e0c209

# Diff at Tue, 30 Jul 2024 11:12:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20232340
- current block number: 20232340

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20232340 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6) {
    +++ description: None
      fieldMeta:
+        {"COLOSSEUM":{"severity":"HIGH","description":"Contract used to challenge state roots and prove fraud."}}
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      fieldMeta:
+        {"COLOSSEUM":{"severity":"HIGH","description":"Contract used to challenge state roots and prove fraud."},"transactionCount":{"severity":"HIGH","description":"Increases with each Security Council action."}}
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      fieldMeta:
+        {"challengedRoots":{"severity":"MEDIUM","description":"State roots that have been challenged by the validators. Challenges are created when, according to the validators, the roots commit to an incorrect L2 state."}}
    }
```

Generated with discovered.json: 0x836966473c2ac7afb47c8f897669515a539cdea8

# Diff at Thu, 04 Jul 2024 09:46:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e880b32f603c98cd7ec9cadedc3a383e26a650a block: 20139536
- current block number: 20232340

## Description

One SecurityCouncil signer is removed and the threshold / quorum is lowered to 7/9.

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      values.quorum:
-        8
+        7
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.getApproved.2:
-        "0x0000000000000000000000000000000000000000"
      values.locked.2:
-        true
      values.tokenOwners.9:
-        "0x77Fe100758c5320cdfBb4f4a0Bed57885c97158A"
      values.tokenOwners.1:
-        "0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851"
+        "0x77Fe100758c5320cdfBb4f4a0Bed57885c97158A"
      values.tokens.9:
-        11
      values.tokens.1:
-        3
+        11
      values.tokenURI.2:
-        "https://nft.kroma.network/sc/3.png"
      values.tokenURI.1:
-        "https://nft.kroma.network/sc/2.png"
+        "https://nft.kroma.network/sc/3.png"
      values.totalSupply:
-        10
+        9
    }
```

Generated with discovered.json: 0x272adbeea1cb884bd882b20ce10fc34e78b95430

# Diff at Fri, 21 Jun 2024 10:36:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ec2af791e025f39dac189a183e6a382ceece70f block: 19976276
- current block number: 20139536

## Description

Small ZKVerifier upgrade:
- libraries Strings, SignedMath and Math are dropped.
- formatting
- change of constants

## Watched changes

```diff
    contract ZKVerifier (0x6deb6a630D7b486c1C08d4016AEe3835a2F52Fa7) {
    +++ description: None
      upgradeability.implementation:
-        "0x7E79726560B140fd6e089547bD049509F5423BFf"
+        "0x4cd05aB629055a449617a28E3466660403eA7126"
      implementations.0:
-        "0x7E79726560B140fd6e089547bD049509F5423BFf"
+        "0x4cd05aB629055a449617a28E3466660403eA7126"
      values.version:
-        "0.1.4"
+        "0.1.5"
    }
```

## Source code changes

```diff
.../ZKVerifier/ZKVerifier.sol                      | 629 +++------------------
 1 file changed, 65 insertions(+), 564 deletions(-)
```

Generated with discovered.json: 0xce4214285c00751fd2d5541be9ba2bb5272615c6

# Diff at Wed, 29 May 2024 15:01:43 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19910333
- current block number: 19976276

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19910333 (main branch discovery), not current.

```diff
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
    }
```

```diff
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
    }
```

```diff
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0x7D76Ae60dcc2FdB57d3924024E2Ad940B76Ef81f"
    }
```

Generated with discovered.json: 0xe882afee6647d123919721780a186d5f658d81b5

# Diff at Fri, 17 May 2024 14:01:28 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@b4d647588d691ebe1349f28f3bbcd5a4affa9a83 block: 19731710
- current block number: 19890151

## Description

Kroma added a custom escrow and gateway for a new token (spETH, Spectrum staked ETH) which is canonically bridged. The gateway and the escrow are upgradeable by an EOA. spETH is 1:1 convertible to weETH, which is held in the escrow.

## Watched changes

```diff
+   Status: CREATED
    contract SpectrumHub (0x7fe71D0Dde2f6Bbc8474c41dc39bDFd6bCd9Eca5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SpectrumCore (0x88b6bBb148748C18B377A57c9d4E6c714AF28078)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SH_ProxyAdmin (0x9841bC06C8284095824e9397AC818aD1114C444C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract spETH_ProxyAdmin (0xa50f2b3d55fb311c81f6FB75998B48A67505c6F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SC_ProxyAdmin (0xd26F4195B147b988E7497779f7DED22ba130204d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract spETH (0xf96d4B1e0a0B129e1471e88dF6f1281b933Bc474)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/SC_ProxyAdmin/EcoProxyAdmin.sol |  804 +++++
 .../SC_ProxyAdmin/EcoProxyForProxyAdmin.p.sol      |  529 ++++
 .../ethereum/.flat/SH_ProxyAdmin/EcoProxyAdmin.sol |  804 +++++
 .../SH_ProxyAdmin/EcoProxyForProxyAdmin.p.sol      |  529 ++++
 .../.flat/SpectrumCore/EcoTUPWithAdminLogic.p.sol  |  588 ++++
 .../ethereum/.flat/SpectrumCore/SpectrumCore.sol   | 2012 ++++++++++++
 .../.flat/SpectrumHub/EcoTUPWithAdminLogic.p.sol   |  588 ++++
 .../ethereum/.flat/SpectrumHub/SpectrumHub.sol     | 1982 ++++++++++++
 .../.flat/spETH/EcoTUPWithAdminLogic.p.sol         |  588 ++++
 .../kroma/ethereum/.flat/spETH/SPETH.sol           | 3210 ++++++++++++++++++++
 .../.flat/spETH_ProxyAdmin/EcoProxyAdmin.sol       |  804 +++++
 .../spETH_ProxyAdmin/EcoProxyForProxyAdmin.p.sol   |  529 ++++
 12 files changed, 12967 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19731710 (main branch discovery), not current.

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      values.validators:
-        ["0x3aa00bb915A8e78b0523E4c365e3E70A19d329e6","0x3123Df5C6166f59BaaFbbb021d1F32Baab272318","0xFab557d2c471983541709968AC7EEF398fE6133A","0xA3A81c16C85f2B118ceF7Fe9f034fAC72882c517","0xECe4AAf6A41aa81A164363Ec6C420510617Fc998","0x691b96Cb652eEdd9C09ED92013db651640746c00","0x91512D45758ca717FD6E78527705dA6653108977","0xE0A6A1398AC76Fd546c2dFD6B030308E75a0F43F","0xE45ed5ce8C3882372820e2AE64d24d497f339953","0xCad4acC8e9dCf550CDf7Bb0a2d8d2Ea526210C87","0xc3282C1CB349ccC79a9C51F9a02a91ccbc157DBa","0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0","0xbDeE962137373A755a71C716E01B9946B1a27686","0x510E315047cEEF91675fEcE17cC5e0297962a33A","0x73E1c971260B3f9740Fb6E0884b236eb35356191","0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1","0x5B545B2DB372158a22F53ED980E99116d1685C08","0x4c3f15b8594ce62AB1AfF321210Afcf6ce8A21bB","0x2333E4442E9b05a9857e9Cbf89f937b8a60C95Af","0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851","0x84f193D262dB0B1606bb32eb63FEd6b9CBA456AB","0x063BC3ee1b548509DBA15b9C5a0e49725D24aaaC","0x8281F8004067DbbC77734B6f22e5e8c340923591","0xB6841Eb53eB5053f14a84C9f979776973Ebae23A","0x5Da8c27376A68024a42fEA8A8389af9C7552fBE7","0xBB62f18515De9BC747669C4e38A89429267BaB9e","0x28683F7Ee8d4C0bc197Bc6903F2657665134Cc02","0xc931c3C4feBa2b91127bEC5c64c11d78221eD7B7","0x7429357fb2125743d32625Cd0E9757a9e50A6aAC","0xc4D44D617FBfD62E9c27F337cB3Cbb291FB0a0dD","0x41D4746CB8847791EF3950081c28b32C81216431","0x8278071A9f472Fe9DAa102A3c76a70069ba6BC4b","0x458c4cBe6f2F8a949F4639D44ace14017d05BBC0","0x8E36Dad1040993820BE0885feE75a721C14EA872","0x9F678265d6c69DC3036E2877b6C60499b1125DBA","0xC983F676141A6784dd345D235A639B3381B4db82","0x7982dAd7fC9DC10356BcB9161AADB4A6310D25BB","0x473753C30e005d65A3CBB36bD2f38fb8Cd3fE05a","0x2E8a03820c77312FE1B189a78963e94553f11b6F","0xEA87A83B032B3Ac8a96CAEE2A42eC516b1bAeB74","0xF29E2BD1164b91EEe85Ec81c5b88Aba7B79ACBF3","0x44b626d97E17AbdE90C0922357A669490172867c","0xa3a5fbE9cEEbB701Dd4181e9Cd1d753bDC865801","0xAf44576135D1Af2466FB4a027322A356F21D3182","0xE540C94F2F32DF07160f7fdb6A6AE0Bc7B9920f7","0x1930FBC2b9CD411B081691E6347339aFf43ab498","0xc03540631a4923fBA777497779Fab98509264F03","0x9B6B7fd6CD5deE2d41C6E16da39847B94C0ab096","0xCC0a1978680E603D7B8A478B934aA9FF9a30d17B","0x4fF82452A8D0F94A3B52f6a891e5b794d7A2FD52","0xFF48E03C97e353B5623a9B84c967A843Bb6fE326","0x0b59e41cab3f078F3C6cf42cf165081AF4f049Ec","0x4E74557796003f79Cbd51796dDB92C39FE4D0AE0","0xf1B0796c0A208D98aC02D9B682692CDc8403C14D","0x7d06b6eA10cCb824d12FEd7c934B89866ab26C33","0x65676ef3950a7F342F78aDb72490aeeAd7BeE894","0x2B24035B1Aa70eFe7F5AeA73bd1Bbf390154F0A4","0x9687bE3Bc362C25861Aa352e77c040d1d61DB12c","0xc8E3928E2f3D88ef3426aA90E5FFA249345D7d77","0xF1FAe4c29db03A4972B9234c6Ebc70CC409a7682","0x3Bf24cFD4208f7301295D73AC224977F9f56b23f","0x2B74F75c069a80eB2595E2AbE5C79803Bb5adad0","0x4F537f9b9f23df77EEC35BccAC149eaBe9b5F618","0xD53b5B82936cD6d6E89D5f5250F681874c223b8C","0x568C44943e2034Dd86B9c9d237672ebBdbE959E3","0x2B48290B911e3c7D1F49BfB2f85f156c06824976","0xa7584c69EFCE8bFA88765f99306aa701be2B9171","0xb0B1103B488aB5281EE02CafeEF382845A89b444","0xB842088f301B25F3cf0fFb19AE7FC7F70F01903b","0x9D231BD744A7965E81E219Fcdf5fb091062020AB","0x6fbD17ce339A8153AB459dE946951c51DDFBDB48","0x58029098E47A952a07cafcA1D0A216A8c0fAde56","0xed5696bE6b2E74a47F5AE775D2126af4aF94b701","0xa90C06D2AF97893591d62EC3c93DEF4648092B3e","0x6Ee7426e7c95BDE071eDf1C8c1c478499552f5D7","0xB0220B00Add5F06245aa64bB622a1dF9E986658c","0x7951e34B1a6628375a0C037f51910D8Ccd729bbf","0xC512Bb0553156fF14EA45782668583F102bEcd5D","0x595663Cb2b5Ab8535227cAE975766D46184c8e88","0x89595A32941303D9Fd40a558C66F2E5641638ad0","0x1af5C7aD88b953117073991d8a45046Cac5f5DA5","0x66012996Bcf10777Dd0323966452febf9B5Bb821","0x22963f931baA98D5CE2A43AB7681a638a693F560","0x13073f1A19969D04Ea6060D8eFE6A7391C73a29D","0x70FBa8B8C23e97BE0DAe995AD239697225e98652","0x04BDa0bD3022715D00FB8717696418e8963e1cfd","0x9513B71fb1A83753402E69B3D9AE889A7C1C423F","0x5756eD22b0630B59e4bAb01e5ceaaAC68f1BAd24","0xe18486aA64F04C38449A7a7B462d17a87e47cEa2","0xA4b000E0C7483bbFAC54a004Dd587DA578B98b50","0xC8C32E106a75819839d14dF77aEbda0A9dB1E113","0xbAC64Cbc0915E1f39bdE620fBDFaB0A06D48664A","0x119E731C9338A3b44C35354d49e8D075DE279Da3","0xa96447dF0b034E53f215A2f5748DeBd88B0840a1","0x0E8830fB2b13E4E931A9dD6d26c56e3396BeFA79","0x881B5289790bF431b38bcC752FF6A4184Bf4A7EC","0x7de8f647Ded74EDB71B6Fc2Fcd9014eAA18fd172","0x0798d740Df1060bA68e7d7349f3808b41eb12Daa","0x328fbE99cC9A05f9e6f956847EDF8075661eb5fF","0xfC3867F19161b8981d8B9c9fa3D7360c9Cee9733","0x9D493D9d3eFEE49F6FA90fEBc6ef6d284B161A2c","0x655fED6846693da4A7223A07652BF12E66414581","0x290B2d65b889ea23656d4E7AA92960928ffe50d5","0xc5F28EEb0A954ed9595b52e94f8Ac0B386eb0b53","0x80C244CDD92FA3AeE03daC6726a4F0aB0976A7b8","0x2D6A4B92E54919b34936F73093993F90F9A76E35","0x7231826E2504365248C75106553Fa4Ee044208AE","0xEf41997e0ED63250Ba6846729f8078f7ad171A40","0x5ddcf494A8b6EeE4904934E829109cCF584EAF80","0xeB85e095dbcf0Ae5E43E0283D4E5D1DC04855b31","0x14dD4cCe169FAe0862FAf1EFd1160356b0D9Fb47","0x51F7FC98Ee497361021A075a4B123FD019243de5","0xE242395d1eBF78cEC71BADa23280FF6779c8054b","0x199D2ac9dd042aA6254863d9E927A3Dd62b6eae2","0xfeaC3EAeE9C509cBbff72F701174c7D6253069F1","0x3d98e7E45a7dca3Fdf6CAA8369A077aA96a45265","0x03D6998D0C6Be3547c59b080F6919b47f2C4aE45","0x29Be20aD1414C08f014cCbe56633bBD33D1ebAAA","0xcB8B4a4E6D720cAA07f67158696c6526051390B4","0xC8c05DFE6721571F1D91e81B2469e214F9306170","0x80335e2BB7ff34369E373e6aeb0b9a2857428866","0xb40b9eaD573a9342538d8401efEfB9D0cb37B651","0x5A76B2C70B7Bb40c84B85cCbF83102b2337b6462","0xA95EB3352BD6CA1ba48331A127929b58E77d5235","0xBA25A7BEab8e2E7521fE55952501bDc5675D97d9","0x108713FcE1099B2D7B48B4895300506581eDb99E","0x1cCCB15378D897aeE65BDD8f92182F90e217b967","0x06eAcd795b9171D186b8dd14178A2D1F0Df2b7E8","0xAA42E3FA1EC821901EFf4B30C20BC030C6fDC10f","0x6Ccd68cF5ad4E3b666c5F609B652f0eaC3ADc040","0xFe23Ab8236c31fDb9d8071b4A7D247498C1E0EAe","0x468C5B98D6A3fA746694c4a38D0aEc576BaC9bd4","0xaB642B758ca09baabCFd2e6F21D9d5A3Eb0E320D","0xA6b6e94A2480A55B912de538345355D80558788c","0x6973822c30b0D8759a2C0C1A0b06824Cc8E0690c","0x7c361821b30F020F6bdc9e41529ffeeA60d699c8","0xa560e492FE5F3fBf0af29E9A943870298da0B757","0x5B514ACc0857e9902476e2ed686148EEf041Fd93","0x9b705489265867EB95542e0AB28f18c8e20dBcC0","0x049810A2A58a93e8A511A69214C5250667dDc4d3","0xfCca5b5132A7AC520eE61e41A48d187Dbd2e942b","0x2779a1591b73c0E69dE57D1Ee262C3f9e3d1635f","0x7c483696178e56C1ccA92F9E1BEE02C67F66bF8F","0xB9acE31B947D9D0d0f4425544f6A9ba15939Ee3D","0x8361e04B3DeC8CeD3940c66ECf8ed4618B66C0BD","0xCbcFB49676e04e6F4C14673EB1C0375D07577856","0xF218A2Ce07dF6b2eC89e87fC0050dF656d1D0052","0x7B3225ADc5D908668FaA050246680CBE4e75A93f","0x435663829b595621a3a1c0BA2a7622193A7B5b21","0xf5e05A771df09812B35eF558349470c01c76bC6A","0xfB090D5c0A2d2CD4A038E1f6e87d83fCca1Be9b4","0x884aa1b2db923dccfe912fC4FbFe2d6E1254a37D","0x12F1b64b0B1789830A7f13097Bd1E44f0cBa2FCB","0x2a1c4EBEE3bbC1968F80b735C9Af406d68Da4Fc0","0x3416e93887E8a94167A2bA1c2683146eaEd1b691","0xb03E8EACbefE2a23F1928012E7D089bb50A43cC6","0xAbbB98705cC8Cc96a7c0A22c942092581b4a54cE","0x38cC88D1E4670aA11E17c9c6Aa38A934471139F6","0xc2B58C92a3C5160f957c60A6fFFFb3653Ef134e3","0x6b8403aaba1B9bF8C082307d625222F148873e1f","0xBD5f6648872702505547dDcF7c51fB0b1A23e843","0xC3f044e25630C8eC292b876f90DF13e83283d471","0xA187F2D8FBf7b336d166c2F2908289BeD561c75D","0x62805414dfe76c52cD9B80636E03d3C957844594","0x87D62f0338fa0A17B68D77005aE84015aaA76d93","0x20F2d43e0B41bdAbD1E7CB96BbFE96A069cA2F27","0xb3ddE93c4B9AE41F5e8751a37D586cD71787DA60","0xBce9B0898aC0D0a4Bc9DCc71544B8e56e29a7B00","0x8E71b8194C9F5781b0099d29ca18A24272837a6f","0x8F1c3626686D9BCbc1C1Cd589Ef7161B01D52b70","0xEd83e84735088ad913d814967E5F08F2e26Ca51B","0x1bE433537B194909A167a455018eDEF6d1012549","0x26788EdE8b4A5f0c4A6b23A72B6c399D2C53A190","0x655ae0De55d3335eD47083424ac3A4E97087d40f","0x3c8338Fb7b836ea6051974a605a67C30A016A0cE","0x3c170d82889A9D678ED9898089d6013d6B40FACd","0xCfaEaC37075e75a9Ec409424f0dD467C96dF7B40","0x6bd1DC8D10bc1988078535A1f5a30B1e1525e761","0xb9d920b0bCA644fD1332351b9136BB04d6F8Aa0f","0x5f12A882A44ccb837F07091eE8A30D8eB0E1ED09","0x8ECF028Cd647379E580DaA6701A11154750fcd3c","0x2e471BE62da4a97d214d35Fef58Df6547fdFffd4","0xC63Cc019Bb47A948131891407d1371849B757714","0x52A81362E4858A1B6776131B008C7dF8eB106fE5","0x191a161953D001e53B7fa5862e032fB0CBFD6C09","0xFb2d2BCA59dF62DFb3cE7215121ed90f6B17727B","0x57e3E33ECd1dfa2EeE45e9B05BAca0EA52C135f3","0xbcbafDBe5ee7983C05425826C89E80C405325082","0xC001052B0bC1Bb7b15C2d5858bf79c5ef9eAd09e","0x0125adEE89dE396b586959190e931b83120359AB","0xd29AB3c390C1E8a0d172CF74cFa03A38bEF829AD","0x44Ba3AE0bfd7E3ecBBCD8A14b97dE3724FCb5E15","0x23530D129Aa6396Be0c6C8E7A57BF9537760C662","0xCA374949e00536CBC6c95912a15643ff1afD11BE","0x3A9AE38cEB4655268A2dEb6e9AdBaD3252bd03E7","0x5045E61746BA204A0200C8321832A95833b42FBd","0x2380F7D1EbcA8044f6489c504628C8CAc41b9557","0xE6850AedFae091b07B89bB54a42a8e47518F2dF6","0x265457cd2ED479f4648224D91781695A076Cdc0B","0x3253499Ff28723Cb6b99336308A282c02d22660a","0xB657e7e7082D799c670bb585feE145678a0CBE61","0x7D219822c7339a444031F976Ae796be331c046A1","0xb7abB6cE2cEb122369C21ba42F26b5c584Ac1552","0x0B467455E28d40Ef49B1EDD64f8657CF9B6A4358","0x268a249053FabDFc6396A5EF1f8EbC6eeF005C8C","0xAbA94A795E14d3129148af12acE016F7d4260cbD","0x77Fe100758c5320cdfBb4f4a0Bed57885c97158A","0x67dA73bb90fDD5901b1De9665BF645CDc5fCb684","0x3e442C602A7E0113B0252485E069847852E22CF6","0x0048B1937C87Bc66C69301f2ea72aB4a42d44681","0x74F66e40Ccf771Bf1bD7321B92251F89952530F6","0x3b4F8253a57dBBD2452DDD6214126E19Bce343a9","0xCf7Fde55A0Dd4Ee454731557757b47e2340b4570","0x5A1DD24BCEf6eBDd00aD270103edE1b1f19758c5","0xF2aDaDd8B006D6317dE7E440Db067b14180101D4","0x7f8Bf6A05eB53402B0fDd1C053aF8E19750f97E6","0x3ff0d6aB0A26F3630B5c465ffADfB26CEa069Cb9","0x286598ebF05fdFC1177161ec2dFfD469D4d23f55","0xe35002a892EA997CC10500DE27B5bA3E32FEaC61","0x7fCC65d7686FEd83c2709020cDaBB40e58152701","0x701aa2E5cf7Ad6a994F88ec32c1f42469caF032B","0xd5095c0A328b7c738E2E0fDA4DbCe3A42D85ecD3","0xF3507DB640493bE370e44a68638125F4F6981043","0x20Def3C09E8B6b9E0396A832AafAd1fEA11ef33c","0xF390D6B6316985DfD3eC403e5B35B55b316Fbf8C","0x13f21E122d71A648C427d4cD36501BBFF261cB59","0x7Fb00286be9C3A893D9EF89fB3269eBb057bc04b","0x41852D4F060b7a209FDc073E48fB26eea3D19ca3","0xAB171AA2a94924d6609E79Bd51D7EB8030BAD471","0x7180650FE131F2c4ADcDE9D6339D360074e9a501","0x5567D843C2A8CCaff48db53A3E85F82202991bE4","0x14A63749e57A273187ac229F22249683a4F6B83b","0x1F4f1450Cb0e8BF8cB792e37a2Cc41d990dB081D","0x9b83C73dB1239C7b96E3372B81af17d5186C51D1","0xd2261925c992ccB881F30d1206D5382358ba54c7","0x9ebDf3eEF51735b713ea6CDACFB631655afEdc78","0x770A93Fa7Caf7582b9d6052019f85a33EeeD8F38","0x4576481b914FE9FCA4Bbe6A85aB1A409124Ef9A7","0x8f49933058f71446CE3f55B137ED47b8bf9E23EF","0x04f106957bD638892b799D71733dd37e800Ed852","0xdBBDF1991C64f6493Cdc202fb04eC7D5775278b9","0xE07098DC3240FDf4BB084de2C43d5ECEc0C21865","0xce049103b7bA6c8ecFC60072eb6b6A4d90AD7271","0x0eD5422D54aE9818b7cd832BF63Cc718e070ADda","0x146124d752B5A93D0E5BE93AFeAcad4c980a9637","0x6079195f115A428058B1F4bdd2F990e3e131eF73","0x26C4AF99Ea17e179cFa6AEe7F40277a1f0798f80","0xC81b9746155038C50fE3715A2c7FBB492c08f606","0xe86f119adbDE95fd4778c0C9671F3caDa3Bb4de4","0x5F0b6e843aD84721dc09cD18611834f26f9c7B5F","0x766BdfBC9373271aB5B0BF132BBCe159054E1Ed2","0xB5e7Cc6D1bd4f126Dd704B105eDE4827Fc4faEb2","0xF41feaD53F7E300a7c48cCC20ED60382D53E5187","0xB6673B1b71cDCFf8dc31EAC976CC14ada39D122b","0xcFfDFbB32cCAC0f6eb75609B50C910e14D9Ff2d6","0xbcabd47a8E10737e4239CB9c6742DdD28FF1e1D5","0xEfDf90363BCE49E8755B2a9E04f7b4B7f22D8c9F","0x2aC67125282d6574454D628F9759C63821F38D98","0x8501D18A563D0D2773418D2688b1a9E60fB6a562","0xC0348C7dcE5af3F36c48d551C9233758f9bBE586","0xc1FE32F8127Fd2f198Aa643f748848958a7FF925","0xABecebdd2A398A37B4332BE2B2523D0a0d68256a","0xc55dCaC2d7e1bABAf8FC1919a6cE06455a398501","0x88705f72053F1823f8474A38EE3d0439d485BC7b"]
    }
```

Generated with discovered.json: 0x46401001ddf921652991175c3bb62fecccc5ad43

# Diff at Thu, 25 Apr 2024 10:15:57 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@b2d6f0f9ccd7e269685e4a3459e22efcedcc2628 block: 19695350
- current block number: 19731710

## Description

### Blobs

Kroma is posting blobs. ([First blob tx](https://etherscan.io/tx/0x1e504f673dcf1d1a9b1a332b02c62ab6f7b4cc73bd9cb8162b3c748e29c86b08))

### Colosseum

Only one change: `_validatePublicInput()` now computes the blockhash for either Cancun or Shanghai blocks with their respective functions (ternary operator). The Shanghai update on L2 changed the structure of the block header and the last implementation addressed this, but there was probably an oversight.

## Watched changes

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      upgradeability.implementation:
-        "0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"
+        "0xb87eaB624EE684C1799f1E8b24936A1c90759eEc"
      implementations.0:
-        "0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"
+        "0xb87eaB624EE684C1799f1E8b24936A1c90759eEc"
      values.version:
-        "1.0.0"
+        "1.1.0"
    }
```

## Source code changes

```diff
.../implementation/contracts/L1/Colosseum.sol      |  53 ++++---
 .../contracts/libraries/Encoding.sol               | 166 ++++++++++++---------
 .../implementation/contracts/libraries/Hashing.sol |  21 +++
 .../implementation/contracts/libraries/Types.sol   |   6 +
 .../Colosseum/implementation/meta.txt              |   2 +-
 5 files changed, 148 insertions(+), 100 deletions(-)
```

Generated with discovered.json: 0x9a3a63d115a94c4282aea8a94bf88911eac00254

# Diff at Sat, 20 Apr 2024 08:12:38 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@262f9e3e98ac8a85b09235e0b440b48e826f1f9f block: 19616998
- current block number: 19695350

## Description

A transaction is executed to send ~2.5 ETH from the ValidatorPool contract to the trusted validator and member of SC `0x3aa00bb915a8e78b0523e4c365e3e70a19d329e6`.
This was enabled by the `withdrawTo()` function that was added in the previous upgrade. (see below) The source of funds is from the balance of the SecurityCouncil inside the ValidatorPool contract, leaving the SC with 0.12 ETH of balance in the ValidatorPool. The SC's balance inside the ValidatorPool comes from taxes in the `increaseBond()` function.
Context: The previous reimbursement in this [tweet by Kroma](https://twitter.com/kroma_network/status/1775801214552375417).

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
+++ description: Increases with each Security Council action.
+++ type: L2
+++ severity: HIGH
      values.transactionCount:
-        2
+        3
    }
```

Generated with discovered.json: 0x68b9b451a1ae0f51c4cc2055cdd6530505b7c803

# Diff at Tue, 09 Apr 2024 08:50:09 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bdb0620154d0bd06d04a6877172f01b9a2a0b8c9 block: 19567016
- current block number: 19616998

## Description

This upgrade brings small changes with huge diffs in the non-flat sources because new (but unused!) .sol files were pushed to etherscan among the actually upgraded implementations. This happens because for example the SecurityCouncil.sol that is shown on the Collosseum implementation's address on etherscan is now a newer version than the actual SecurityCouncil.sol that sits at the SECURITY_COUNCIL address (currently `0x3de211088dF516da72efe68D386b561BEE256Ec4`) The newer version is used only as an interface while the old version at the defined address is imported and used.
Our flat source files mostly ignore this.

### Main changes

1. Change from Semver to ISemver in the two upgraded implementations (ValidatorPool and Colosseum) with no functional changes
2. Support of Post-Shanghai (on the L2) block headers on the L1 Colosseum
3. Ability to withdraw to a specified address from the ValidatorPool

original description from the onchain upgrade proposal in tx# `0x80b280058f4eab3d9b250be874a5e7e816beaf68553f3ba61ec5c76340cfec5d`:
[Smart Contract upgrades for v1.3.4]

### 1. Addition of withdrawTo in ValidatorPool

Previously, validators could only withdraw funds to themselves. Now, with the withdrawTo function, they can withdraw directly to a specified address. Implementation contract address: `0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4`

### 2. Change in block header hash function for Colosseum

With the Shanghai upgrade on the Kroma mainnet, a withdrawalsRoot field has been added to the block header. Accordingly, the hash function for obtaining the block header in Colosseum has been modified. Implemenatation contract address: `0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066`

### Current Context

Kroma also had two fork incidents on their mainnet L2:

- March 12: https://twitter.com/kroma_network/status/1775801201197531144
- Apr 1: https://twitter.com/kroma_network/status/1774683208753590506

Right after the upgrade that is described above, an L2 output root was deleted after having been fault proven:

- output root # 5017 from Apr 1 at L2 block number 9028800 in eth mainnet tx# 0x74e2739982fde96145d822151d93e093ab915e357cdd7167dd925ce4026e0841

Earlier Challenges for the same output were not successfully proven and i assume that the difference in block header construction after the upgrade was a fix for that.

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
+++ description: Increases with each Security Council action.
+++ type: L2
+++ severity: HIGH
      values.transactionCount:
-        1
+        2
    }
```

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      upgradeability.implementation:
-        "0x7526F997ea040B3949415c3a44e708273863AA2b"
+        "0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"
      implementations.0:
-        "0x7526F997ea040B3949415c3a44e708273863AA2b"
+        "0x311b4A33b6dC4e080eE0d98caAaf8dF86C833066"
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
    +++ description: None
      upgradeability.implementation:
-        "0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"
+        "0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4"
      implementations.0:
-        "0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"
+        "0x8EDc4cCa2aF96f5D5141d55333043a65c3f59Ec4"
    }
```

## Source code changes

```diff
.../implementation/contracts/L1/Colosseum.sol      |   16 +-
 .../implementation/contracts/L1/KromaPortal.sol    |   12 +-
 .../implementation/contracts/L1/L2OutputOracle.sol |   12 +-
 .../contracts/L1/SecurityCouncil.sol               |   40 +-
 .../implementation/contracts/L1/SystemConfig.sol   |   12 +-
 .../implementation/contracts/L1/ValidatorPool.sol  |   45 +-
 .../implementation/contracts/L1/ZKVerifier.sol     |  138 +--
 .../contracts/L2/L2StandardBridge.sol              |   17 +-
 .../contracts/L2/ValidatorRewardVault.sol          |   56 +-
 .../contracts/governance/UpgradeGovernor.sol       |  179 +++
 .../implementation/contracts/libraries/Hashing.sol |   53 +-
 .../contracts/libraries/Predeploys.sol             |    4 +-
 .../implementation/contracts/libraries/Types.sol   |   21 +-
 .../contracts/universal/FeeVault.sol               |   39 +-
 .../universal/IMultiSigWallet.sol => /dev/null     |  193 ----
 .../implementation/contracts/universal/ISemver.sol |   13 +
 .../contracts/universal/ITokenMultiSigWallet.sol   |  120 +++
 .../contracts/universal/KromaMintableERC20.sol     |   14 +-
 .../universal/MultiSigWallet.sol => /dev/null      |  533 ---------
 .../contracts/universal/Semver.sol => /dev/null    |   58 -
 .../contracts/universal/TokenMultiSigWallet.sol    |  258 +++++
 .../Colosseum/implementation/meta.txt              |    2 +-
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../governance/GovernorUpgradeable.sol             |  736 +++++++++++++
 .../governance/IGovernorUpgradeable.sol            |  326 ++++++
 .../governance/TimelockControllerUpgradeable.sol   |  434 ++++++++
 .../GovernorCountingSimpleUpgradeable.sol          |  113 ++
 .../extensions/GovernorSettingsUpgradeable.sol     |  122 +++
 .../GovernorTimelockControlUpgradeable.sol         |  178 +++
 .../GovernorVotesQuorumFractionUpgradeable.sol     |  133 +++
 .../extensions/GovernorVotesUpgradeable.sol        |   69 ++
 .../extensions/IGovernorTimelockUpgradeable.sol    |   39 +
 .../governance/utils/IVotesUpgradeable.sol         |   56 +
 .../interfaces/IERC165Upgradeable.sol              |    6 +
 .../interfaces/IERC5267Upgradeable.sol             |   28 +
 .../interfaces/IERC5805Upgradeable.sol             |    9 +
 .../interfaces/IERC6372Upgradeable.sol             |   17 +
 .../token/ERC1155/IERC1155ReceiverUpgradeable.sol  |   58 +
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../utils/CheckpointsUpgradeable.sol               |  560 ++++++++++
 .../utils/StringsUpgradeable.sol}                  |   12 +-
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 ++++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 ++++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 ++++++
 .../utils/math/SafeCastUpgradeable.sol             | 1136 ++++++++++++++++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/DoubleEndedQueueUpgradeable.sol  |  170 +++
 .../implementation/contracts/L1/KromaPortal.sol    |   12 +-
 .../implementation/contracts/L1/L2OutputOracle.sol |   12 +-
 .../implementation/contracts/L1/SystemConfig.sol   |   12 +-
 .../implementation/contracts/L1/ValidatorPool.sol  |   28 +-
 .../contracts/L2/L2StandardBridge.sol              |   17 +-
 .../contracts/L2/ValidatorRewardVault.sol          |   56 +-
 .../implementation/contracts/libraries/Hashing.sol |   53 +-
 .../contracts/libraries/Predeploys.sol             |    4 +-
 .../contracts/universal/FeeVault.sol               |   39 +-
 .../implementation/contracts/universal/ISemver.sol |   13 +
 .../contracts/universal/KromaMintableERC20.sol     |   14 +-
 .../contracts/universal/Semver.sol => /dev/null    |   58 -
 .../ValidatorPool/implementation/meta.txt          |    2 +-
 63 files changed, 6485 insertions(+), 1119 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19567016 (main branch discovery), not current.

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
    }
```

Generated with discovered.json: 0x310dac62fc3a977695365cb5f63945bc621c6113

# Diff at Tue, 02 Apr 2024 08:48:56 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f62e2b01d51472dd8c710b0599031b7ba1a58f0d block: 19474421
- current block number: 19567016

## Description

A root is challenged.
Context: Kroma had issues on Apr 1. Sequencer was stopped and is now operational again. Around this incident there were multiple challenges created, so far no challenge was successful.

## Watched changes

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
+++ description: State roots that have been challenged by the validators. Challenges are created when, according to the validators, the roots commit to an incorrect L2 state.
+++ severity: MEDIUM
      values.challengedRoots.2:
+        5017
    }
```

Generated with discovered.json: 0x192fbb137203cbda301e605a6cd68bc4473be030

# Diff at Wed, 20 Mar 2024 07:28:01 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@445fe8affe786a2fd91907e202a17fb37f748047 block: 19467530
- current block number: 19474421

## Description

Added escrow for USDC.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19467530 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract USDCBridge (0x7e1Bdb9ee75B6ef1BCAAE3B1De1c616C7B11ef6e)
    +++ description: None
```

Generated with discovered.json: 0x1a008a7fbef09baf0ce1d2c7b0c2569920692411

# Diff at Tue, 19 Mar 2024 08:14:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@87a9df6317bf41ef2d063033dfc77d54521b9991 block: 19439816
- current block number: 19467530

## Description

A new proposal for an L2 output root deletion was submitted and is executed. The deleted root metadata is:
"submitter":"0xfa3a4f7e5e1238d188e6d2dc6d1a9c5fa94c3c17",
"outputRoot":"0x9b5606d9c8fdc6517211cd2e7255c1dee0475d25515889b1d78789c346170191",
"timestamp":"1710224711","l2BlockNumber":"8172000"

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
+++ description: Increases with each Security Council action.
+++ type: L2
+++ severity: HIGH
      values.transactionCount:
-        0
+        1
    }
```

Generated with discovered.json: 0xffe98182ff3880cc6479d9f173c18bfb383280d6

# Diff at Tue, 12 Mar 2024 10:43:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@aa756f53b5067168dd1bce4c3f562d0212b0da15 block: 19412001
- current block number: 19418455

## Description

A root is challenged.

## Watched changes

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
    +++ description: None
      values.challengedRoots[1]:
+        4540
    }
```

Generated with discovered.json: 0xb82f88c28e19c911b04f370e8b70b9047afd71ae

# Diff at Mon, 11 Mar 2024 13:02:21 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19383415
- current block number: 19412001

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19383415 (main branch discovery), not current.

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x66e7d57ef59143fb02afe041c6d98f4b33e448d9

# Diff at Thu, 07 Mar 2024 12:54:19 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ef5ca32c526f9f368a9df9c40dfdb81fe1a9382c block: 19317972
- current block number: 19383415

## Description

One SC member is added and the threshold has been updated accordingly to be above 75%. The delay has been removed so the risk has been updated.

## Watched changes

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
    +++ description: None
      values.getMinDelay:
-        604800
+        0
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
    +++ description: None
      values.quorum:
-        7
+        8
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
    +++ description: None
      values.tokenOwners[9]:
+        "0x77Fe100758c5320cdfBb4f4a0Bed57885c97158A"
      values.tokens[9]:
+        11
      values.totalSupply:
-        9
+        10
    }
```

Generated with discovered.json: 0xf9a2868df47939ae03b5391125f035a38ff09445

# Diff at Tue, 27 Feb 2024 09:26:18 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@4f9617ef0b726c0af67b0e31e0d1ed434f10f1ef block: 19182633
- current block number: 19317972

## Description

A Kroma validator has created a challenge (challenging a state root) for the first time.

## Watched changes

```diff
    contract Colosseum (0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a) {
      values.challengedRoots[0]:
+        4062
    }
```

Generated with discovered.json: 0xf2efb953c5d3442db9a5c3a901d3af836fbd3787

# Diff at Thu, 08 Feb 2024 09:45:31 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@0a61ea8397e7cdcf34b79a079bc53c0c2e703fe2 block: 18940443
- current block number: 19182633

## Description

Add opStackDA and opStackSequencerInbox handlers

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18940443 (main branch discovery), not current.

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
      values.opStackDA:
+        {"isSomeTxsLengthEqualToCelestiaDAExample":false}
      values.sequencerInbox:
+        "0xfF00000000000000000000000000000000000255"
    }
```

Generated with discovered.json: 0x5c2d3985c37d7e2b7bfa690fefaec55556e068d8

# Diff at Fri, 05 Jan 2024 10:21:46 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ea50ecee4d08800c3cff3742fc1c8912fc54c16c

## Description

The Security Council is now a 7/9 multisig, satisfying the requirements to be considered a Security Council.

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
      values.quorum:
-        4
+        7
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
      values.quorumNumerator:
-        51
+        82
    }
```

# Diff at Thu, 23 Nov 2023 10:41:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@4c7175133fcba5685ddf8bf8d42acc70413b9b0c

## Description

Not sure what's going on here. Look at the description below this one.

## Watched changes

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
      values.tokenOwners.8:
-        "0x8ECF028Cd647379E580DaA6701A11154750fcd3c"
+        "0xbDeE962137373A755a71C716E01B9946B1a27686"
      values.tokenOwners.7:
-        "0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851"
+        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
      values.tokenOwners.6:
-        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
+        "0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0"
      values.tokenOwners.5:
-        "0xECe4AAf6A41aa81A164363Ec6C420510617Fc998"
+        "0x7B3225ADc5D908668FaA050246680CBE4e75A93f"
      values.tokenOwners.4:
-        "0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0"
+        "0x5ddcf494A8b6EeE4904934E829109cCF584EAF80"
      values.tokenOwners.3:
-        "0x7B3225ADc5D908668FaA050246680CBE4e75A93f"
+        "0xECe4AAf6A41aa81A164363Ec6C420510617Fc998"
      values.tokenOwners.2:
-        "0x5ddcf494A8b6EeE4904934E829109cCF584EAF80"
+        "0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851"
      values.tokenOwners.1:
-        "0xbDeE962137373A755a71C716E01B9946B1a27686"
+        "0x8ECF028Cd647379E580DaA6701A11154750fcd3c"
    }
```

# Diff at Wed, 22 Nov 2023 09:43:04 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@265d269ec8f97fee9cd01487403d12ff66e8509f

## Description

### Timelock

![image](https://github.com/l2beat/l2beat/assets/30298476/ead78084-4fb9-4567-b8b1-3e8ba8928205)
Removed the possibility to bypass the timelock delay. Also, the delay has been reduced from 30 days to 7 days.

### SystemConfig

Updated the reward scalar, doesn't affect security.

### SecurityCouncil

The Security Council now inherits from `TokenMultisigWallet` instead of `MultiSigWallet`. There is no particular change, the contract is much cleaner now and when a deletion is requested it gets also auto-confirmed by the sender. The role of this contrc

### UpgradeGovernor

Removed the function that allowed to bypass the timelock delay since it's not possible anymore. The UpgradeGovernor logic is based on the SecurityCouncilToken ownership.

### SecurityCouncilToken

Added self-delegation by default.

### ValidatorPool

Slightly tweaked the logic to select the next proposer, related to some small changes in the unbound mechanism.

## Watched changes

```diff
    contract Timelock (0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1) {
      upgradeability.implementation:
-        "0x595E1b330892Fcbf18b2BF099DE501Ad4d6A07C4"
+        "0xe44da6e9fA92E3FD897Da84d38fa6B9322Dd22c3"
      implementations.0:
-        "0x595E1b330892Fcbf18b2BF099DE501Ad4d6A07C4"
+        "0xe44da6e9fA92E3FD897Da84d38fa6B9322Dd22c3"
      values.getMinDelay:
-        2592000
+        604800
    }
```

```diff
    contract SystemConfig (0x3971EB866AA9b2b8aFEa8a7C816F3b7e8b195a35) {
      values.validatorRewardScalar:
-        10000
+        5000
    }
```

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
      upgradeability.implementation:
-        "0x2BB1c629c46a4018fBe2538a98da7162F8355583"
+        "0x61c7C854Dcdf8393230B1242a4c1107f4d023c28"
      implementations.0:
-        "0x2BB1c629c46a4018fBe2538a98da7162F8355583"
+        "0x61c7C854Dcdf8393230B1242a4c1107f4d023c28"
      values.GOVERNOR:
-        "0xA03c13C6597a0716D1525b7fDaD2fD95ECb49081"
+        "0xb3c415c2Aad428D5570208e1772cb68e7D06a537"
      values.numConfirmationsRequired:
-        1
      values.owners:
-        ["0x3aa00bb915A8e78b0523E4c365e3E70A19d329e6","0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851","0x8ECF028Cd647379E580DaA6701A11154750fcd3c","0xbDeE962137373A755a71C716E01B9946B1a27686","0x7B3225ADc5D908668FaA050246680CBE4e75A93f","0x5ddcf494A8b6EeE4904934E829109cCF584EAF80","0xECe4AAf6A41aa81A164363Ec6C420510617Fc998","0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0","0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"]
      values.version:
-        "1.0.0"
+        "1.1.0"
      values.clock:
+        18626452
      values.confirmations:
+        [0,0,0,0,0]
      values.quorum:
+        4
      errors:
+        {"confirmations":"Too many values. Update configuration to explore fully","owners":"Cannot find a matching method for owners"}
    }
```

```diff
    contract UpgradeGovernor (0xb3c415c2Aad428D5570208e1772cb68e7D06a537) {
      upgradeability.implementation:
-        "0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030"
+        "0x64F8F4EB207D51F74caf6db644Bf710Ad86989b3"
      implementations.0:
-        "0x2a51e099CC7AF922CcDe7F3db909DC7b71B8D030"
+        "0x64F8F4EB207D51F74caf6db644Bf710Ad86989b3"
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
      upgradeability.implementation:
-        "0x54140F4Cd6e6665BE0151eD5a8aC949EC2942439"
+        "0x108eDc4Df0b9B04dcE9f6FFBD65Dd9895562c14C"
      implementations.0:
-        "0x54140F4Cd6e6665BE0151eD5a8aC949EC2942439"
+        "0x108eDc4Df0b9B04dcE9f6FFBD65Dd9895562c14C"
      values.version:
-        "1.0.0"
+        "1.0.1"
    }
```

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
      upgradeability.implementation:
-        "0x6e1781678ffE6CDc109fd3bC0833c47BD0F23de1"
+        "0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"
      implementations.0:
-        "0x6e1781678ffE6CDc109fd3bC0833c47BD0F23de1"
+        "0x3eb033BAc5c449bDcb6D082c4f728eDAfC8D75fa"
      values.version:
-        "1.0.0"
+        "1.0.1"
    }
```

## Source code changes

```diff
.../contracts/L1/SecurityCouncil.sol               |   37 +-
 .../implementation/contracts/L1/ValidatorPool.sol  |   21 +-
 .../implementation/contracts/L1/ZKVerifier.sol     |  138 +--
 .../contracts/L2/ValidatorRewardVault.sol          |    2 +-
 .../contracts/governance/UpgradeGovernor.sol       |  173 +++
 .../implementation/contracts/libraries/Types.sol   |   21 +-
 .../universal/IMultiSigWallet.sol => /dev/null     |  193 ----
 .../contracts/universal/ITokenMultiSigWallet.sol   |  120 +++
 .../universal/MultiSigWallet.sol => /dev/null      |  533 ---------
 .../contracts/universal/TokenMultiSigWallet.sol    |  258 +++++
 .../SecurityCouncil/implementation/meta.txt        |    2 +-
 .../access/AccessControlUpgradeable.sol            |  261 +++++
 .../access/IAccessControlUpgradeable.sol           |   88 ++
 .../governance/GovernorUpgradeable.sol             |  736 +++++++++++++
 .../governance/IGovernorUpgradeable.sol            |  326 ++++++
 .../governance}/TimelockControllerUpgradeable.sol  |   74 +-
 .../GovernorCountingSimpleUpgradeable.sol          |  113 ++
 .../extensions/GovernorSettingsUpgradeable.sol     |  122 +++
 .../GovernorTimelockControlUpgradeable.sol         |   70 +-
 .../GovernorVotesQuorumFractionUpgradeable.sol     |  133 +++
 .../extensions/GovernorVotesUpgradeable.sol        |   69 ++
 .../extensions/IGovernorTimelockUpgradeable.sol    |   39 +
 .../governance/utils/IVotesUpgradeable.sol         |   56 +
 .../interfaces/IERC165Upgradeable.sol              |    6 +
 .../interfaces/IERC5267Upgradeable.sol             |   28 +
 .../interfaces/IERC5805Upgradeable.sol             |    9 +
 .../interfaces/IERC6372Upgradeable.sol             |   17 +
 .../token/ERC1155/IERC1155ReceiverUpgradeable.sol  |   58 +
 .../token/ERC721/IERC721ReceiverUpgradeable.sol    |   27 +
 .../utils/CheckpointsUpgradeable.sol               |  560 ++++++++++
 .../utils/StringsUpgradeable.sol                   |   85 ++
 .../utils/cryptography/ECDSAUpgradeable.sol        |  217 ++++
 .../utils/cryptography/EIP712Upgradeable.sol       |  205 ++++
 .../utils/introspection/ERC165Upgradeable.sol      |   42 +
 .../utils/introspection/IERC165Upgradeable.sol     |   25 +
 .../utils/math/MathUpgradeable.sol                 |  339 ++++++
 .../utils/math/SafeCastUpgradeable.sol             | 1136 ++++++++++++++++++++
 .../utils/math/SignedMathUpgradeable.sol           |   43 +
 .../utils/structs/DoubleEndedQueueUpgradeable.sol  |  170 +++
 .../contracts/governance/SecurityCouncilToken.sol  |    4 +-
 .../contracts/universal/KromaSoulBoundERC721.sol   |    1 +
 .../SecurityCouncilToken/implementation/meta.txt   |    2 +-
 .../contracts/governance/TimeLock.sol              |    2 +-
 .../Timelock/implementation/meta.txt               |    2 +-
 .../governance}/TimelockControllerUpgradeable.sol  |   74 +-
 .../contracts/governance/UpgradeGovernor.sol       |   47 +-
 .../UpgradeGovernor/implementation/meta.txt        |    2 +-
 .../governance/TimelockControllerUpgradeable.sol   |  434 ++++++++
 .../GovernorTimelockControlUpgradeable.sol         |  178 +++
 .../implementation/contracts/L1/ValidatorPool.sol  |   21 +-
 .../contracts/L2/ValidatorRewardVault.sol          |    2 +-
 .../implementation/contracts/libraries/Types.sol   |   21 +-
 .../ValidatorPool/implementation/meta.txt          |    2 +-
 53 files changed, 6269 insertions(+), 1075 deletions(-)
```

# Diff at Fri, 03 Nov 2023 09:59:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9fa31f2a6274083dfe7f01b69d1220921459db02

## Description

- Additional 8 EOAs added to the SecurityCouncil (making it a 1/9 multisig).
- Owner of the SecurityCouncilToken changed from EOA to a Timelock contract
  (0x2260...FDc1).

## Watched changes

```diff
    contract SecurityCouncil (0x3de211088dF516da72efe68D386b561BEE256Ec4) {
      values.owners[8]:
+        "0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1"
      values.owners[7]:
+        "0x3a4F65D1ACFb2A3F5AD93ef7b240bfa1079052e0"
      values.owners[6]:
+        "0xECe4AAf6A41aa81A164363Ec6C420510617Fc998"
      values.owners[5]:
+        "0x5ddcf494A8b6EeE4904934E829109cCF584EAF80"
      values.owners[4]:
+        "0x7B3225ADc5D908668FaA050246680CBE4e75A93f"
      values.owners[3]:
+        "0xbDeE962137373A755a71C716E01B9946B1a27686"
      values.owners[2]:
+        "0x8ECF028Cd647379E580DaA6701A11154750fcd3c"
      values.owners[1]:
+        "0xe1b712e16Be1Eb098D0b2B846e2f547F9E292851"
    }
```

```diff
    contract SecurityCouncilToken (0xe4D08346609055c091D3DEECdAAd3Bf83119B08c) {
      values.owner:
-        "0xA03c13C6597a0716D1525b7fDaD2fD95ECb49081"
+        "0x22605A12cB77Fe420B0cC1263cEb58a77352FDc1"
      values.totalSupply:
-        1
+        9
    }
```

# Diff at Fri, 29 Sep 2023 07:58:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@af96105393755c6fead3fa1b6c9845f238580952

## Watched changes

```diff
    contract ValidatorPool (0xFdFF462845953D90719A78Fd12a2d103541d2103) {
      values.validators:
+        ["0x3aa00bb915A8e78b0523E4c365e3E70A19d329e6","0x81BF552f9Fc83e88012d6C3ab84cF1946Bc55FD0","0x42a4f1958A5d99A62C50eb24a80d1D8b142ea3A1","0xfC3867F19161b8981d8B9c9fa3D7360c9Cee9733","0x0125adEE89dE396b586959190e931b83120359AB","0x7d06b6eA10cCb824d12FEd7c934B89866ab26C33","0x1F4f1450Cb0e8BF8cB792e37a2Cc41d990dB081D","0x91b6178188ccDD1e735F54ba135cd5EcabECdB15","0x328fbE99cC9A05f9e6f956847EDF8075661eb5fF","0x8ECF028Cd647379E580DaA6701A11154750fcd3c","0x4576481b914FE9FCA4Bbe6A85aB1A409124Ef9A7"]
    }
```
