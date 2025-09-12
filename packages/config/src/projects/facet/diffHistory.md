Generated with discovered.json: 0x88f5fa6d952d7ee313819a598a64aab568f50506

# Diff at Tue, 02 Sep 2025 10:39:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1144aeaf984988c003c97be3791eeda76896f8ca block: 1756118684
- current timestamp: 1756809496

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756118684 (main branch discovery), not current.

```diff
    contract FastExternalBridge (eth:0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: A Facet implementation of the ETH Bridge. This bridge is also called "fast bridge" as it uses a permissioned EOA as operator for faster withdrawal processing.
      sourceHashes.0:
-        "0x64951d7e399d4852270a3959b8d5a2e1cab268e252375816e78ad88ab3d971e2"
+        "0xd5a977325a2b053491581c54141a59a425e2fe510cdfa1cd3b85ab45ca437a7e"
      implementationNames.eth:0x0000000000000b07ED001607f5263D85bf28Ce4C:
-        "ERC1967Factory"
+        "FacetEtherBridgeV6"
    }
```

Generated with discovered.json: 0x526590413c899973fab888bed315640dee3834a0

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x72e48c1f62cde6fef47fb657fb8f93735cca9c5e

# Diff at Mon, 25 Aug 2025 14:09:32 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ad220cb66b2845d84a69889aeb34f71bc5a0a6b0 block: 1755605791
- current timestamp: 1756118684

## Description

Cache issue, name FacetEtherBridgeV6 is correct.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755605791 (main branch discovery), not current.

```diff
    contract FastExternalBridge (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: A Facet implementation of the ETH Bridge. This bridge is also called "fast bridge" as it uses a permissioned EOA as operator for faster withdrawal processing.
      sourceHashes.0:
-        "0x64951d7e399d4852270a3959b8d5a2e1cab268e252375816e78ad88ab3d971e2"
+        "0xd5a977325a2b053491581c54141a59a425e2fe510cdfa1cd3b85ab45ca437a7e"
      implementationNames.eth:0x0000000000000b07ED001607f5263D85bf28Ce4C:
-        "ERC1967Factory"
+        "FacetEtherBridgeV6"
    }
```

Generated with discovered.json: 0x7cb73d0e4c2b1ba9ed45474e55f4b8d60fc9f787

# Diff at Fri, 22 Aug 2025 09:01:47 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@515ea2f778e0acc901831f9413259d8fb41219ff block: 1755605791
- current timestamp: 1755605791

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755605791 (main branch discovery), not current.

```diff
    contract FastExternalBridge (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: A Facet implementation of the ETH Bridge. This bridge is also called "fast bridge" as it uses a permissioned EOA as operator for faster withdrawal processing.
      sourceHashes.0:
-        "0xd5a977325a2b053491581c54141a59a425e2fe510cdfa1cd3b85ab45ca437a7e"
+        "0x64951d7e399d4852270a3959b8d5a2e1cab268e252375816e78ad88ab3d971e2"
      implementationNames.eth:0x0000000000000b07ED001607f5263D85bf28Ce4C:
-        "FacetEtherBridgeV6"
+        "ERC1967Factory"
    }
```

Generated with discovered.json: 0x8353bceb9d6213c536f528dfb173ae38f2251a06

# Diff at Tue, 19 Aug 2025 12:17:22 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@67e41f566326dea91dc3f12a1b8947109f00301c block: 1755000507
- current timestamp: 1755605791

## Description

Ignore anchor values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1755000507 (main branch discovery), not current.

```diff
    contract Rollup (0x686E7d01C7BFCB563721333A007699F154C04eb4) {
    +++ description: Rollup contract for Facet. This is the core contract that manages the state of the rollup and its proof system.
      values.getAnchorRoot:
-        ["0x88b54f3a73b2cbb7f29caae53a780a8b4974c5e0bd157ad3c7bb122b72939bcc",1721260]
    }
```

Generated with discovered.json: 0x4d37c193d5468f98a75add8a6ac62b91e7bf21c5

# Diff at Tue, 12 Aug 2025 12:08:32 GMT:

- chain: facet
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32a723ac08d08671a14307e26f7e27a0b92d39e7 block: 1754566470
- current timestamp: 1755000507

## Description

Silenced discovery.

## Watched changes

```diff
    contract L2Bridge (0x016bE6d77b783aBdDccaF3fea49ffa9c1CA660D4) {
    +++ description: L2Bridge is an ERC20 minter counterpart to an L1 bridge. This contract is used to mint new ERC20 tokens on the L2 once a token deposit is made on the L1. Note that the token received on L2 could have a different ticker/symbol than the token sent on L1.
      values.totalSupply:
-        1000000000000000
+        "52000000000000000"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: L2ToL1MessagePasser is a contract that allows messages to be sent from the L2 to the L1, used to send withdrawal requests from the L2 to the L1.
      values.messageNonce:
-        "1766847064778384329583297500742918515827483896875618958121606201292619931"
+        "1766847064778384329583297500742918515827483896875618958121606201292619932"
    }
```

Generated with discovered.json: 0xe4aff01914f343654cdb84cac31b608f1dc388c6

# Diff at Tue, 12 Aug 2025 12:08:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32a723ac08d08671a14307e26f7e27a0b92d39e7 block: 1754566470
- current timestamp: 1755000507

## Description

Whitelisted Proposer changed. Config changes only (our side) for the bridge.

## Watched changes

```diff
    contract Rollup (0x686E7d01C7BFCB563721333A007699F154C04eb4) {
    +++ description: Rollup contract for Facet. This is the core contract that manages the state of the rollup and its proof system.
      values.whitelistedProposers.0:
-        "eth:0x23B0caA3782b5CE6Be7A54655A5DD2791335EAFC"
+        "eth:0x615452db5467849689E98a8C5C242A96cF768a94"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754566470 (main branch discovery), not current.

```diff
    contract FastExternalBridge (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: A Facet implementation of the ETH Bridge. This bridge is also called "fast bridge" as it uses a permissioned EOA as operator for faster withdrawal processing.
      sourceHashes.0:
-        "0x64951d7e399d4852270a3959b8d5a2e1cab268e252375816e78ad88ab3d971e2"
+        "0xd5a977325a2b053491581c54141a59a425e2fe510cdfa1cd3b85ab45ca437a7e"
      implementationNames.eth:0x0000000000000b07ED001607f5263D85bf28Ce4C:
-        "ERC1967Factory"
+        "FacetEtherBridgeV6"
    }
```

Generated with discovered.json: 0xca546f7391c1b283064ce820a034d0aabfe882cb

# Diff at Thu, 07 Aug 2025 11:34:38 GMT:

- chain: facet
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current timestamp: 1754566470

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L2Bridge (0x016bE6d77b783aBdDccaF3fea49ffa9c1CA660D4)
    +++ description: L2Bridge is an ERC20 minter counterpart to an L1 bridge. This contract is used to mint new ERC20 tokens on the L2 once a token deposit is made on the L1. Note that the token received on L2 could have a different ticker/symbol than the token sent on L1.
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: L2ToL1MessagePasser is a contract that allows messages to be sent from the L2 to the L1, used to send withdrawal requests from the L2 to the L1.
```

Generated with discovered.json: 0x8361ccb69ced4641e0e08f8a12cba6d6d81cee10

# Diff at Thu, 07 Aug 2025 11:34:38 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3b461c4e9ab6af411ff23d3e19ddd42c0b1c052d block: 1745840699
- current timestamp: 1754566470

## Description

Discovery rerun on the same block number with only config-related changes.

## Watched changes

```diff
    contract L1Bridge (0x4E2eBa30a786c0643699b92234d74a71e958C08E) {
    +++ description: L1Bridge is an ETH bridge built on top of Rollup contract. It is the selected canonical bridge for this risk analysis. It used to bridge ETH from L1 to L2. Note that the token received on L2 has a different ticker/symbol than the token sent on L1.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      template:
+        "facet/L1ETHBridge"
      sourceHashes:
+        ["0x2428a7345462c1359eba9d5cf1d2749c05cb9419787b7e2914c411bb0c244867"]
      description:
+        "L1Bridge is an ETH bridge built on top of Rollup contract. It is the selected canonical bridge for this risk analysis. It used to bridge ETH from L1 to L2. Note that the token received on L2 has a different ticker/symbol than the token sent on L1."
      sinceTimestamp:
+        1754512679
      sinceBlock:
+        23084460
      values:
+        {"$immutable":true,"depositNonce":1,"l2Bridge":"eth:0x016bE6d77b783aBdDccaF3fea49ffa9c1CA660D4","owner":"eth:0x0000000000000000000000000000000000000000","paused":false,"rollup":"eth:0x686E7d01C7BFCB563721333A007699F154C04eb4","withdrawalDelay":0}
      implementationNames:
+        {"eth:0x4E2eBa30a786c0643699b92234d74a71e958C08E":"L1Bridge"}
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract Rollup (0x686E7d01C7BFCB563721333A007699F154C04eb4) {
    +++ description: Rollup contract for Facet. This is the core contract that manages the state of the rollup and its proof system.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      template:
+        "facet/Rollup"
      sourceHashes:
+        ["0xd5ecfadcad80a6370fcf20fd9285959bf3452352c79ba06748998ea55cad3732"]
      description:
+        "Rollup contract for Facet. This is the core contract that manages the state of the rollup and its proof system."
      sinceTimestamp:
+        1754512643
      sinceBlock:
+        23084457
      values:
+        {"$immutable":true,"AGG_VKEY":"0x0083a8b50160475a7a5911c03dfdee30f6c8a83112a71c5c1125cfb96148b8c2","anchorL2BlockNumber":1721260,"anchorProposalId":0,"anchorRoot":"0x88b54f3a73b2cbb7f29caae53a780a8b4974c5e0bd157ad3c7bb122b72939bcc","canonicalProposalFor":[],"canonicalProposalIdFor":[],"CHALLENGER_BOND":"10000000000000000000","computeL2Timestamp":[],"FALLBACK_TIMEOUT_SECS":1209600,"getAnchorRoot":["0x88b54f3a73b2cbb7f29caae53a780a8b4974c5e0bd157ad3c7bb122b72939bcc",1721260],"getProposalsLength":1,"isInFallbackWindow":[],"L2_BLOCK_TIME":12,"L2_START_TIMESTAMP":1754499659,"l2BlockAge":[],"MAX_CHALLENGE_SECS":604800,"MAX_PROVE_SECS":604800,"owner":"eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525","PROPOSAL_INTERVAL":1800,"PROPOSER_BOND":5000000000000000,"RANGE_VKEY_COMMITMENT":"0x43f01f7522e77ddc0bea30de6cb8075608a0d0c906660e4f5f430a1e5e170829","renouncedOwner":"eth:0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001","ROLLUP_CONFIG_HASH":"0x9554c3fe04d8bd05d2dff01471781e1d9fbbdcfa58bda686ad883fe5451fd97c","sequencerInbox":"eth:0x00000000000000000000000000000000000face7","VERIFIER":"eth:0x70C7FdB9e543bD15cd392df04e6d4BD05AfD8A66","version":"1.0.0","whitelistedProposers":["eth:0x23B0caA3782b5CE6Be7A54655A5DD2791335EAFC"]}
      implementationNames:
+        {"eth:0x686E7d01C7BFCB563721333A007699F154C04eb4":"Rollup"}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF)
    +++ description: Module that allows the Safe to send Facet transactions.
```

```diff
+   Status: CREATED
    contract SP1Verifier (0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x70C7FdB9e543bD15cd392df04e6d4BD05AfD8A66)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract Facet Multisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FacetSafeProxy (0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25)
    +++ description: Helper of the Safe Module that allows to send Facet transactions.
```

## Source code changes

```diff
.../ethereum/.flat/Facet Multisig/GnosisSafe.sol   |  953 +++++++
 .../.flat/Facet Multisig/GnosisSafeProxy.p.sol     |   35 +
 .../facet/ethereum/.flat/FacetSafeModule.sol       |   29 +
 .../facet/ethereum/.flat/FacetSafeProxy.sol        |  488 ++++
 .../src/projects/facet/ethereum/.flat/L1Bridge.sol | 2650 ++++++++++++++++++++
 .../src/projects/facet/ethereum/.flat/Rollup.sol   | 1192 +++++++++
 ...:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459.sol | 1396 +++++++++++
 ...:0x50ACFBEdecf4cbe350E1a86fC6f03a821772f1e5.sol |  602 +++++
 .../facet/ethereum/.flat/SP1VerifierGateway.sol    |  231 ++
 9 files changed, 7576 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1745840699 (main branch discovery), not current.

```diff
    contract FastExternalBridge (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: A Facet implementation of the ETH Bridge. This bridge is also called "fast bridge" as it uses a permissioned EOA as operator for faster withdrawal processing.
      name:
-        "FacetEtherBridgeV6"
+        "FastExternalBridge"
      description:
-        "Official Facet implementation of the Ether Bridge."
+        "A Facet implementation of the ETH Bridge. This bridge is also called \"fast bridge\" as it uses a permissioned EOA as operator for faster withdrawal processing."
      values.getAdmin:
-        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      values.getDumbContract:
-        "eth:0x1673540243E793B0e77C038D4a88448efF524DcE"
      values.getSigner:
-        "eth:0x314d660b083675f415cCAA9c545FeedF377d1006"
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
-   Status: DELETED
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
-   Status: DELETED
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF)
    +++ description: Module that allows the Safe to send Facet transactions.
```

```diff
-   Status: DELETED
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
    contract L1ETHLockbox (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: Deprecated entry point to deposit ERC20 tokens from host chain to this chain. Currently just holds ETH that the Facet multisig can withdraw.
      name:
-        "L1StandardBridge"
+        "L1ETHLockbox"
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain."
+        "Deprecated entry point to deposit ERC20 tokens from host chain to this chain. Currently just holds ETH that the Facet multisig can withdraw."
      values.admin:
-        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      values.l2TokenBridge:
-        "eth:0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
      values.messenger:
-        "eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
      values.MESSENGER:
-        "eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
      values.OTHER_BRIDGE:
-        "eth:0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
      values.otherBridge:
-        "eth:0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
      values.superchainConfig:
-        "eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      values.systemConfig:
-        "eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      values.weth:
-        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0xa1233c2DB638D41893a101B0e9dd44cb681270E8)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
-   Status: DELETED
    contract Facet Multisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FacetSafeProxy (0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25)
    +++ description: Helper of the Safe Module that allows to send Facet transactions.
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
-   Status: DELETED
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE)
    +++ description: Module that allows the Safe to interact with Ethscriptions.
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
-   Status: DELETED
    contract EthscriptionsSafeProxy (0xeEd444Fc821b866b002f30f502C53e88E15d5095)
    +++ description: Helper of the Safe Module that allows to send Ethscriptions transactions.
```

Generated with discovered.json: 0x150387ea18b0d28ab352a0c1f48b147e923816b3

# Diff at Mon, 14 Jul 2025 12:45:04 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22367347
- current block number: 22367347

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367347 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    EOA  (0x00000000000000000000000000000000000FacE7) {
    +++ description: None
      address:
-        "0x00000000000000000000000000000000000FacE7"
+        "eth:0x00000000000000000000000000000000000FacE7"
    }
```

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      address:
-        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
+        "eth:0x0000000000000b07ED001607f5263D85bf28Ce4C"
      values.$admin:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.$implementation:
-        "0x68c56f4D88846A4Cdce966d92D92a0636baf40FE"
+        "eth:0x68c56f4D88846A4Cdce966d92D92a0636baf40FE"
      values.eip712Domain.verifyingContract:
-        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
+        "eth:0x0000000000000b07ED001607f5263D85bf28Ce4C"
      values.getAdmin:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      values.getDumbContract:
-        "0x1673540243E793B0e77C038D4a88448efF524DcE"
+        "eth:0x1673540243E793B0e77C038D4a88448efF524DcE"
      values.getSigner:
-        "0x314d660b083675f415cCAA9c545FeedF377d1006"
+        "eth:0x314d660b083675f415cCAA9c545FeedF377d1006"
      implementationNames.0x0000000000000b07ED001607f5263D85bf28Ce4C:
-        "ERC1967Factory"
      implementationNames.0x68c56f4D88846A4Cdce966d92D92a0636baf40FE:
-        "FacetEtherBridgeV6"
      implementationNames.eth:0x0000000000000b07ED001607f5263D85bf28Ce4C:
+        "ERC1967Factory"
      implementationNames.eth:0x68c56f4D88846A4Cdce966d92D92a0636baf40FE:
+        "FacetEtherBridgeV6"
    }
```

```diff
    EOA  (0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3) {
    +++ description: None
      address:
-        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
+        "eth:0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
    }
```

```diff
    EOA  (0x1673540243E793B0e77C038D4a88448efF524DcE) {
    +++ description: None
      address:
-        "0x1673540243E793B0e77C038D4a88448efF524DcE"
+        "eth:0x1673540243E793B0e77C038D4a88448efF524DcE"
    }
```

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
+        "eth:0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      values.owner:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      implementationNames.0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA:
-        "AddressManager"
      implementationNames.eth:0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA:
+        "AddressManager"
    }
```

```diff
    EOA  (0x314d660b083675f415cCAA9c545FeedF377d1006) {
    +++ description: None
      address:
-        "0x314d660b083675f415cCAA9c545FeedF377d1006"
+        "eth:0x314d660b083675f415cCAA9c545FeedF377d1006"
    }
```

```diff
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF) {
    +++ description: Module that allows the Safe to send Facet transactions.
      address:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "eth:0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      values.facetProxyAddress:
-        "0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25"
+        "eth:0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25"
      implementationNames.0x3235AdE33cF7013f5b5A51089390396e931e6BCF:
-        "FacetSafeModule"
      implementationNames.eth:0x3235AdE33cF7013f5b5A51089390396e931e6BCF:
+        "FacetSafeModule"
    }
```

```diff
    EOA  (0x75deB70b12689e9CaeF4b316eDD04F213Af06127) {
    +++ description: None
      address:
-        "0x75deB70b12689e9CaeF4b316eDD04F213Af06127"
+        "eth:0x75deB70b12689e9CaeF4b316eDD04F213Af06127"
    }
```

```diff
    EOA  (0x77610267a344Eb39955c20908978830f61e2373C) {
    +++ description: None
      address:
-        "0x77610267a344Eb39955c20908978830f61e2373C"
+        "eth:0x77610267a344Eb39955c20908978830f61e2373C"
    }
```

```diff
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "eth:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      values.$admin:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      values.$implementation:
-        "0x059249eBf6e7F1B6c7E7bFb9079f6BCd8581635E"
+        "eth:0x059249eBf6e7F1B6c7E7bFb9079f6BCd8581635E"
      values.$pastUpgrades.0.2.0:
-        "0x059249eBf6e7F1B6c7E7bFb9079f6BCd8581635E"
+        "eth:0x059249eBf6e7F1B6c7E7bFb9079f6BCd8581635E"
      values.guardian:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      values.l2Oracle:
-        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      values.systemConfig:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      implementationNames.0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD:
-        "Proxy"
      implementationNames.0x059249eBf6e7F1B6c7E7bFb9079f6BCd8581635E:
-        "OptimismPortal"
      implementationNames.eth:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD:
+        "Proxy"
      implementationNames.eth:0x059249eBf6e7F1B6c7E7bFb9079f6BCd8581635E:
+        "OptimismPortal"
    }
```

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
+        "eth:0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      values.$admin:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      values.$implementation:
-        "0x77764Bdf2B52C4B2635A73927945541B65DF74E9"
+        "eth:0x77764Bdf2B52C4B2635A73927945541B65DF74E9"
      values.admin:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      values.l2TokenBridge:
-        "0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
+        "eth:0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
      values.messenger:
-        "0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
+        "eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
      values.MESSENGER:
-        "0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
+        "eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
      values.OTHER_BRIDGE:
-        "0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
+        "eth:0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
      values.otherBridge:
-        "0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
+        "eth:0xaCde2ce9a9Bc89ED083FaA80685E2bA2c9ec72E9"
      values.superchainConfig:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      values.systemConfig:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      values.weth:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0x8F75466D69a52EF53C7363F38834bEfC027A2909:
-        "L1ChugSplashProxy"
      implementationNames.0x77764Bdf2B52C4B2635A73927945541B65DF74E9:
-        "PausedL1StandardBridge"
      implementationNames.eth:0x8F75466D69a52EF53C7363F38834bEfC027A2909:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x77764Bdf2B52C4B2635A73927945541B65DF74E9:
+        "PausedL1StandardBridge"
    }
```

```diff
    contract L1CrossDomainMessenger (0xa1233c2DB638D41893a101B0e9dd44cb681270E8) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
+        "eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
      values.$admin:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      values.$implementation:
-        "0xa711dC056C2Db08ee2Ba89be3ED504f48Bf4dbfA"
+        "eth:0xa711dC056C2Db08ee2Ba89be3ED504f48Bf4dbfA"
      values.$pastUpgrades.0.2.0:
-        "0xa711dC056C2Db08ee2Ba89be3ED504f48Bf4dbfA"
+        "eth:0xa711dC056C2Db08ee2Ba89be3ED504f48Bf4dbfA"
      values.OTHER_MESSENGER:
-        "0x0272ea8cf3572f818Bb0b00b0D3D3b33f9B4b1f6"
+        "eth:0x0272ea8cf3572f818Bb0b00b0D3D3b33f9B4b1f6"
      values.otherMessenger:
-        "0x0272ea8cf3572f818Bb0b00b0D3D3b33f9B4b1f6"
+        "eth:0x0272ea8cf3572f818Bb0b00b0D3D3b33f9B4b1f6"
      values.portal:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "eth:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      values.PORTAL:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "eth:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      values.ResolvedDelegateProxy_addressManager:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
+        "eth:0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      values.superchainConfig:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      values.systemConfig:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      implementationNames.0xa1233c2DB638D41893a101B0e9dd44cb681270E8:
-        "ResolvedDelegateProxy"
      implementationNames.0xa711dC056C2Db08ee2Ba89be3ED504f48Bf4dbfA:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xa711dC056C2Db08ee2Ba89be3ED504f48Bf4dbfA:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract Facet Multisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      address:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x77610267a344Eb39955c20908978830f61e2373C"
+        "eth:0x77610267a344Eb39955c20908978830f61e2373C"
      values.$members.1:
-        "0xD66Cb98865181a890ffee5654fAe1D6b4D1827a7"
+        "eth:0xD66Cb98865181a890ffee5654fAe1D6b4D1827a7"
      values.$members.2:
-        "0x75deB70b12689e9CaeF4b316eDD04F213Af06127"
+        "eth:0x75deB70b12689e9CaeF4b316eDD04F213Af06127"
      values.GnosisSafe_modules.0:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "eth:0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      values.GnosisSafe_modules.1:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
+        "eth:0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      implementationNames.0xb2B01DeCb6cd36E7396b78D3744482627F22C525:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      address:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      values.$admin:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      values.$implementation:
-        "0x484EEcfCa1E83eA73Aa569F1cA1eBaf9316F5da3"
+        "eth:0x484EEcfCa1E83eA73Aa569F1cA1eBaf9316F5da3"
      values.$pastUpgrades.0.2.0:
-        "0x484EEcfCa1E83eA73Aa569F1cA1eBaf9316F5da3"
+        "eth:0x484EEcfCa1E83eA73Aa569F1cA1eBaf9316F5da3"
      values.batcherHash:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.batchInbox:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.disputeGameFactory:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.gasPayingToken.addr_:
-        "0xFACE7fAcE7fAcE7FacE7FACE7FACe7FAcE7fACE7"
+        "eth:0xFACE7fAcE7fAcE7FacE7FACE7FACe7FAcE7fACE7"
      values.l1CrossDomainMessenger:
-        "0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
+        "eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
      values.l1ERC721Bridge:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.l1StandardBridge:
-        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
+        "eth:0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      values.optimismMintableERC20Factory:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.optimismPortal:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "eth:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      values.owner:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      values.sequencerAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.sequencerInbox:
-        "0x00000000000000000000000000000000000FacE7"
+        "eth:0x00000000000000000000000000000000000FacE7"
      values.unsafeBlockSigner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xC1E935F25f9c1198200ec442c6F02f1A2F04534e:
-        "Proxy"
      implementationNames.0x484EEcfCa1E83eA73Aa569F1cA1eBaf9316F5da3:
-        "SystemConfig"
      implementationNames.eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e:
+        "Proxy"
      implementationNames.eth:0x484EEcfCa1E83eA73Aa569F1cA1eBaf9316F5da3:
+        "SystemConfig"
    }
```

```diff
    contract FacetSafeProxy (0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25) {
    +++ description: Helper of the Safe Module that allows to send Facet transactions.
      address:
-        "0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25"
+        "eth:0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25"
      implementationNames.0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25:
-        "FacetSafeProxy"
      implementationNames.eth:0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25:
+        "FacetSafeProxy"
    }
```

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      values.$admin:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      values.$implementation:
-        "0xEcc75A86c91D857C6Cb8ea991F88eaE40819C6AC"
+        "eth:0xEcc75A86c91D857C6Cb8ea991F88eaE40819C6AC"
      values.$pastUpgrades.0.2.0:
-        "0xEcc75A86c91D857C6Cb8ea991F88eaE40819C6AC"
+        "eth:0xEcc75A86c91D857C6Cb8ea991F88eaE40819C6AC"
+++ severity: HIGH
      values.challenger:
-        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
+        "eth:0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
      values.CHALLENGER:
-        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
+        "eth:0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
+++ severity: HIGH
      values.proposer:
-        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
+        "eth:0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
      values.PROPOSER:
-        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
+        "eth:0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
      implementationNames.0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6:
-        "Proxy"
      implementationNames.0xEcc75A86c91D857C6Cb8ea991F88eaE40819C6AC:
-        "L2OutputOracle"
      implementationNames.eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6:
+        "Proxy"
      implementationNames.eth:0xEcc75A86c91D857C6Cb8ea991F88eaE40819C6AC:
+        "L2OutputOracle"
    }
```

```diff
    EOA  (0xD66Cb98865181a890ffee5654fAe1D6b4D1827a7) {
    +++ description: None
      address:
-        "0xD66Cb98865181a890ffee5654fAe1D6b4D1827a7"
+        "eth:0xD66Cb98865181a890ffee5654fAe1D6b4D1827a7"
    }
```

```diff
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE) {
    +++ description: Module that allows the Safe to interact with Ethscriptions.
      address:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
+        "eth:0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      values.ethscriptionsProxyAddress:
-        "0xeEd444Fc821b866b002f30f502C53e88E15d5095"
+        "eth:0xeEd444Fc821b866b002f30f502C53e88E15d5095"
      implementationNames.0xDB866fD9241cd32851Df760c1Ec536f3199B22cE:
-        "EthscriptionsSafeModule"
      implementationNames.eth:0xDB866fD9241cd32851Df760c1Ec536f3199B22cE:
+        "EthscriptionsSafeModule"
    }
```

```diff
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C) {
    +++ description: None
      address:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      values.addressManager:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
+        "eth:0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      values.owner:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      implementationNames.0xe2A3bda6CD571943DD4224d0B8872e221EB5997C:
-        "ProxyAdmin"
      implementationNames.eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C:
+        "ProxyAdmin"
    }
```

```diff
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      values.$admin:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      values.$implementation:
-        "0x12df0dfDb02cf4FB18d13eA133Ad9C0F9284f267"
+        "eth:0x12df0dfDb02cf4FB18d13eA133Ad9C0F9284f267"
      values.$pastUpgrades.0.2.0:
-        "0x12df0dfDb02cf4FB18d13eA133Ad9C0F9284f267"
+        "eth:0x12df0dfDb02cf4FB18d13eA133Ad9C0F9284f267"
      values.guardian:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      implementationNames.0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59:
-        "Proxy"
      implementationNames.0x12df0dfDb02cf4FB18d13eA133Ad9C0F9284f267:
-        "SuperchainConfig"
      implementationNames.eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59:
+        "Proxy"
      implementationNames.eth:0x12df0dfDb02cf4FB18d13eA133Ad9C0F9284f267:
+        "SuperchainConfig"
    }
```

```diff
    contract EthscriptionsSafeProxy (0xeEd444Fc821b866b002f30f502C53e88E15d5095) {
    +++ description: Helper of the Safe Module that allows to send Ethscriptions transactions.
      address:
-        "0xeEd444Fc821b866b002f30f502C53e88E15d5095"
+        "eth:0xeEd444Fc821b866b002f30f502C53e88E15d5095"
      implementationNames.0xeEd444Fc821b866b002f30f502C53e88E15d5095:
-        "EthscriptionsSafeProxy"
      implementationNames.eth:0xeEd444Fc821b866b002f30f502C53e88E15d5095:
+        "EthscriptionsSafeProxy"
    }
```

```diff
+   Status: CREATED
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C)
    +++ description: Official Facet implementation of the Ether Bridge.
```

```diff
+   Status: CREATED
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF)
    +++ description: Module that allows the Safe to send Facet transactions.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xa1233c2DB638D41893a101B0e9dd44cb681270E8)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract Facet Multisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FacetSafeProxy (0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25)
    +++ description: Helper of the Safe Module that allows to send Facet transactions.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE)
    +++ description: Module that allows the Safe to interact with Ethscriptions.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract EthscriptionsSafeProxy (0xeEd444Fc821b866b002f30f502C53e88E15d5095)
    +++ description: Helper of the Safe Module that allows to send Ethscriptions transactions.
```

Generated with discovered.json: 0xe97e41029573e01c2c917e569473ceadea2f15f9

# Diff at Fri, 04 Jul 2025 12:34:23 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@34cb32da9aba13b54692a657031c317903866c59 block: 22367347
- current block number: 22367347

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367347 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      sourceHashes.0:
-        "0x60cd8a11d99e2d3ed98fa2bbd47ef1096acb4bc535c5520343ae45cea6436e7b"
+        "0x64951d7e399d4852270a3959b8d5a2e1cab268e252375816e78ad88ab3d971e2"
      implementationNames.0x0000000000000b07ED001607f5263D85bf28Ce4C:
-        ""
+        "ERC1967Factory"
      references:
-        [{"text":"Source Code","href":"https://github.com/vectorized/solady/blob/main/src/utils/ERC1967Factory.sol"}]
    }
```

Generated with discovered.json: 0xfef5cf3def59f7ea8f916f1ee67b3d5df3b76041

# Diff at Fri, 04 Jul 2025 12:19:00 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22367347
- current block number: 22367347

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367347 (main branch discovery), not current.

```diff
    EOA  (0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.1.from:
-        "ethereum:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.2.from:
-        "ethereum:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.3.from:
-        "ethereum:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
    }
```

```diff
    EOA  (0x314d660b083675f415cCAA9c545FeedF377d1006) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x0000000000000b07ED001607f5263D85bf28Ce4C"
+        "eth:0x0000000000000b07ED001607f5263D85bf28Ce4C"
    }
```

```diff
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF) {
    +++ description: Module that allows the Safe to send Facet transactions.
      directlyReceivedPermissions.0.from:
-        "ethereum:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
    }
```

```diff
    contract Facet Multisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "eth:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.1.from:
-        "ethereum:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.2.from:
-        "ethereum:0x0000000000000b07ED001607f5263D85bf28Ce4C"
+        "eth:0x0000000000000b07ED001607f5263D85bf28Ce4C"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      receivedPermissions.3.from:
-        "ethereum:0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
+        "eth:0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.4.from:
-        "ethereum:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.5.via.0.address:
-        "ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      receivedPermissions.5.from:
-        "ethereum:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "eth:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.6.via.0.address:
-        "ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      receivedPermissions.6.from:
-        "ethereum:0x8F75466D69a52EF53C7363F38834bEfC027A2909"
+        "eth:0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      receivedPermissions.7.via.0.address:
-        "ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      receivedPermissions.7.from:
-        "ethereum:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
+        "eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
      receivedPermissions.8.via.0.address:
-        "ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      receivedPermissions.8.from:
-        "ethereum:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.9.via.0.address:
-        "ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      receivedPermissions.9.from:
-        "ethereum:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.10.via.0.address:
-        "ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      receivedPermissions.10.from:
-        "ethereum:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "eth:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
    }
```

```diff
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE) {
    +++ description: Module that allows the Safe to interact with Ethscriptions.
      directlyReceivedPermissions.0.from:
-        "ethereum:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
    }
```

```diff
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
+        "eth:0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "eth:0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x8F75466D69a52EF53C7363F38834bEfC027A2909"
+        "eth:0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
+        "eth:0xa1233c2DB638D41893a101B0e9dd44cb681270E8"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "eth:0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      directlyReceivedPermissions.5.from:
-        "ethereum:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "eth:0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "eth:0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
    }
```

Generated with discovered.json: 0xb29eb1e8d04c8ff4a7f42ebc347eb766940e1758

# Diff at Mon, 16 Jun 2025 08:41:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22367347
- current block number: 22367347

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367347 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0xa1233c2DB638D41893a101B0e9dd44cb681270E8) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
    }
```

```diff
    contract Facet Multisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"ethereum:0xa1233c2DB638D41893a101B0e9dd44cb681270E8","role":"admin","via":[{"address":"ethereum:0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
    }
```

```diff
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C) {
    +++ description: None
      directlyReceivedPermissions.6:
+        {"permission":"upgrade","from":"ethereum:0xa1233c2DB638D41893a101B0e9dd44cb681270E8","role":"admin"}
    }
```

Generated with discovered.json: 0x141b3678f6ae01317b30a5e2b8333d4ca15eec88

# Diff at Fri, 23 May 2025 09:40:56 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22367347
- current block number: 22367347

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367347 (main branch discovery), not current.

```diff
    EOA  (0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"propose","from":"0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6","role":".proposer"}
      receivedPermissions.2:
+        {"permission":"challenge","from":"0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6","role":".CHALLENGER"}
      receivedPermissions.1.role:
+        ".challenger"
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    EOA  (0x314d660b083675f415cCAA9c545FeedF377d1006) {
    +++ description: None
      receivedPermissions.0.role:
+        ".getSigner"
    }
```

```diff
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF) {
    +++ description: Module that allows the Safe to send Facet transactions.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    contract Facet Multisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      receivedPermissions.9.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.9.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.9.via:
+        [{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]
      receivedPermissions.8.from:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.from:
-        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.permission:
-        "guard"
+        "upgrade"
      receivedPermissions.6.from:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.6.via:
+        [{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]
      receivedPermissions.5.permission:
-        "guard"
+        "interact"
      receivedPermissions.5.from:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.5.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.5.role:
+        ".owner"
      receivedPermissions.4.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.4.via:
-        [{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]
      receivedPermissions.4.role:
+        ".guardian"
      receivedPermissions.3.permission:
-        "interact"
+        "guard"
      receivedPermissions.3.from:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.3.description:
-        "set and change address mappings."
      receivedPermissions.3.via:
-        [{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]
      receivedPermissions.3.role:
+        ".guardian"
      receivedPermissions.2.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.2.from:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
      receivedPermissions.2.via:
-        [{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]
      receivedPermissions.2.description:
+        "can withdraw all funds from the bridge."
      receivedPermissions.2.role:
+        ".getAdmin"
      receivedPermissions.1.from:
-        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
+        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.1.description:
-        "can withdraw all funds from the bridge."
+        "set and change address mappings."
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.1.via:
+        [{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]
      receivedPermissions.0.role:
+        ".$admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE) {
    +++ description: Module that allows the Safe to interact with Ethscriptions.
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C) {
    +++ description: None
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.2.from:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      directlyReceivedPermissions.2.description:
-        "set and change address mappings."
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.1.from:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      directlyReceivedPermissions.1.description:
+        "set and change address mappings."
      directlyReceivedPermissions.1.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".$admin"
    }
```

Generated with discovered.json: 0x87742a143bf4434a14ffd02b9b40b74f87f832a6

# Diff at Tue, 29 Apr 2025 09:37:25 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22367347
- current block number: 22367347

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22367347 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      issuedPermissions:
-        [{"permission":"interact","to":"0x314d660b083675f415cCAA9c545FeedF377d1006","description":"can sign arbitrary withdrawals for users.","via":[]},{"permission":"interact","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","description":"can withdraw all funds from the bridge.","via":[]}]
    }
```

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","description":"set and change address mappings.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}]
    }
```

```diff
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[]},{"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}]
    }
```

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}]
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"interact","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}]
    }
```

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3","via":[]},{"permission":"propose","to":"0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3","via":[]},{"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}]
    }
```

```diff
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[]},{"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}]
    }
```

Generated with discovered.json: 0x926c4d2f5698bb4222321f1584ab501ec4224c67

# Diff at Mon, 28 Apr 2025 11:45:15 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@640aad31846aa48203969768d234f58dfd9896e5 block: 21678827
- current block number: 22367347

## Description

config related (due to canActIndependently fix we merged).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      issuedPermissions.3:
-        {"permission":"interact","to":"0x314d660b083675f415cCAA9c545FeedF377d1006","description":"can sign arbitrary withdrawals for users.","via":[]}
      issuedPermissions.2:
-        {"permission":"interact","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.1.to:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0x314d660b083675f415cCAA9c545FeedF377d1006"
      issuedPermissions.1.description:
-        "can withdraw all funds from the bridge."
+        "can sign arbitrary withdrawals for users."
      issuedPermissions.0.to:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.0:
-        {"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}
    }
```

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.2:
-        {"permission":"interact","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","description":"set and change address mappings.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.1:
-        {"permission":"interact","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","description":"set and change address mappings.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
    }
```

```diff
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF) {
    +++ description: Module that allows the Safe to send Facet transactions.
      receivedPermissions:
-        [{"permission":"guard","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"guard","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0x0000000000000b07ED001607f5263D85bf28Ce4C","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA","description":"set and change address mappings.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8F75466D69a52EF53C7363F38834bEfC027A2909","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}]
    }
```

```diff
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
-        {"permission":"guard","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.2:
-        {"permission":"guard","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.via.0:
-        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.0.to:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.0.address:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
    }
```

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
-        {"permission":"interact","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.1.permission:
-        "interact"
+        "upgrade"
      issuedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.1.via.0:
+        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.to:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.0:
-        {"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}
    }
```

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
    }
```

```diff
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE) {
    +++ description: Module that allows the Safe to interact with Ethscriptions.
      receivedPermissions:
-        [{"permission":"guard","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"guard","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0x0000000000000b07ED001607f5263D85bf28Ce4C","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA","description":"set and change address mappings.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8F75466D69a52EF53C7363F38834bEfC027A2909","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}]
    }
```

```diff
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
-        {"permission":"guard","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.2:
-        {"permission":"guard","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.1.via.0:
-        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.0.to:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.0.address:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
    }
```

Generated with discovered.json: 0x1ea898dbb324cfa9d057c692df12b622e2695b46

# Diff at Thu, 10 Apr 2025 14:42:27 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 21678827
- current block number: 21678827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      displayName:
-        "FacetEtherBridge"
      issuedPermissions.3:
+        {"permission":"interact","to":"0x314d660b083675f415cCAA9c545FeedF377d1006","description":"can sign arbitrary withdrawals for users.","via":[]}
      issuedPermissions.2:
+        {"permission":"interact","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.1.to:
-        "0x314d660b083675f415cCAA9c545FeedF377d1006"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.description:
-        "can sign arbitrary withdrawals for users."
+        "can withdraw all funds from the bridge."
      issuedPermissions.0.to:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.0.via.0:
+        {"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}
    }
```

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.2:
+        {"permission":"interact","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","description":"set and change address mappings.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.1:
+        {"permission":"interact","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","description":"set and change address mappings.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
    }
```

```diff
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF) {
    +++ description: Module that allows the Safe to send Facet transactions.
      receivedPermissions:
+        [{"permission":"guard","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"guard","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0x0000000000000b07ED001607f5263D85bf28Ce4C","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA","description":"set and change address mappings.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8F75466D69a52EF53C7363F38834bEfC027A2909","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}]
    }
```

```diff
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
+        {"permission":"guard","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.2:
+        {"permission":"guard","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[]}
      issuedPermissions.1.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.1.via.0:
+        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.0.via.0.address:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
    }
```

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      displayName:
-        "SystemConfig_facet"
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
+        {"permission":"interact","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "interact"
      issuedPermissions.1.via.0:
-        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.0.to:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.0.via.0:
+        {"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}
    }
```

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
    }
```

```diff
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE) {
    +++ description: Module that allows the Safe to interact with Ethscriptions.
      receivedPermissions:
+        [{"permission":"guard","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"guard","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0x0000000000000b07ED001607f5263D85bf28Ce4C","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA","description":"set and change address mappings.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"interact","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8F75466D69a52EF53C7363F38834bEfC027A2909","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}]
    }
```

```diff
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.5:
+        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
+        {"permission":"guard","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.2:
+        {"permission":"guard","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[]}
      issuedPermissions.1.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.1.via.0:
+        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.to:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.0.via.0.address:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
    }
```

Generated with discovered.json: 0xc219cca3f6dab70a9bb3826599568a00f9ae57f2

# Diff at Thu, 27 Mar 2025 11:14:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21678827
- current block number: 21678827

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x8481d2dd63d394f674ee86f2597c72707b2d0377

# Diff at Wed, 19 Mar 2025 13:04:40 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21678827
- current block number: 21678827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract undefined (0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xa69feb0928c371cfca9b9ebf0870afe592f5c8cc

# Diff at Tue, 18 Mar 2025 08:12:45 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 21678827
- current block number: 21678827

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract Facet Multisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      name:
-        "FacetMultisig"
+        "Facet Multisig"
    }
```

Generated with discovered.json: 0xb5f13dfa0dff0f30a70ecc0a71d79f4ec65ca876

# Diff at Tue, 04 Mar 2025 10:39:09 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21678827
- current block number: 21678827

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      sinceBlock:
+        21444055
    }
```

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21373904
    }
```

```diff
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF) {
    +++ description: Module that allows the Safe to send Facet transactions.
      sinceBlock:
+        21352215
    }
```

```diff
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        21373911
    }
```

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21373913
    }
```

```diff
    contract L1CrossDomainMessenger (0xa1233c2DB638D41893a101B0e9dd44cb681270E8) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21373914
    }
```

```diff
    contract FacetMultisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      sinceBlock:
+        18663532
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      sinceBlock:
+        21373912
    }
```

```diff
    contract FacetSafeProxy (0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25) {
    +++ description: Helper of the Safe Module that allows to send Facet transactions.
      sinceBlock:
+        21352209
    }
```

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        21373915
    }
```

```diff
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE) {
    +++ description: Module that allows the Safe to interact with Ethscriptions.
      sinceBlock:
+        18393837
    }
```

```diff
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C) {
    +++ description: None
      sinceBlock:
+        21373905
    }
```

```diff
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21373908
    }
```

```diff
    contract EthscriptionsSafeProxy (0xeEd444Fc821b866b002f30f502C53e88E15d5095) {
    +++ description: Helper of the Safe Module that allows to send Ethscriptions transactions.
      sinceBlock:
+        18393830
    }
```

Generated with discovered.json: 0x6c81269772f20a029b98c2f78f08de8a0b8c2032

# Diff at Wed, 26 Feb 2025 10:32:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21678827
- current block number: 21678827

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CrossDomainMessenger (0xa1233c2DB638D41893a101B0e9dd44cb681270E8) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x41f94d5c689a8487e1281d398ae43f9f42309acd

# Diff at Fri, 21 Feb 2025 14:06:50 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21678827
- current block number: 21678827

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x4afe078dadcf17cb242c6f1bff37ef99d6daabf1

# Diff at Tue, 04 Feb 2025 12:31:25 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21678827
- current block number: 21678827

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract FacetMultisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.4.from:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.4.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
+        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.via:
+        [{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
+        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "can withdraw all funds from the bridge."
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.via:
-        [{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]
      receivedPermissions.0.permission:
-        "configure"
+        "guard"
      receivedPermissions.0.from:
-        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.0.description:
-        "can withdraw all funds from the bridge."
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x24304eef943273ff60a79585b7cc8e34165b60ec

# Diff at Fri, 31 Jan 2025 11:10:06 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@84b1296dd423a2ef9361874d922cd6911109ba10 block: 21678827
- current block number: 21678827

## Description

Discovery rerun on the same block number with only config-related changes.

FacetSafeModule and EthscriptionsSafeModule where configured as 
`canActIndependently: false` because they don't give ability to
act on behalf on the GnosisSafe.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21678827 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      issuedPermissions.3:
-        {"permission":"configure","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.2:
-        {"permission":"configure","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","description":"can withdraw all funds from the bridge.","via":[]}
      issuedPermissions.1.to:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.via.0:
-        {"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}
    }
```

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.2:
-        {"permission":"configure","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","description":"set and change address mappings.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.1:
-        {"permission":"configure","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","description":"set and change address mappings.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.0.to:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.1:
-        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.via.0.address:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
    }
```

```diff
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF) {
    +++ description: Module that allows the Safe to send Facet transactions.
      receivedPermissions:
-        [{"permission":"configure","from":"0x0000000000000b07ED001607f5263D85bf28Ce4C","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"configure","from":"0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA","description":"set and change address mappings.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"configure","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"guard","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"guard","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8F75466D69a52EF53C7363F38834bEfC027A2909","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}]
    }
```

```diff
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.2:
-        {"permission":"guard","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.1.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.1.via.0:
+        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.to:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.0:
-        {"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}
    }
```

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.2:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.1:
-        {"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.0.to:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.1:
-        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.via.0.address:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.2:
-        {"permission":"configure","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.1.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.1.via.0:
+        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.to:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.0:
-        {"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}
    }
```

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.2.to:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.2.via.1:
-        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.2.via.0.address:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
+        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
    }
```

```diff
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE) {
    +++ description: Module that allows the Safe to interact with Ethscriptions.
      receivedPermissions:
-        [{"permission":"configure","from":"0x0000000000000b07ED001607f5263D85bf28Ce4C","description":"can withdraw all funds from the bridge.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"configure","from":"0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA","description":"set and change address mappings.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"configure","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"guard","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"guard","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0x8F75466D69a52EF53C7363F38834bEfC027A2909","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xC1E935F25f9c1198200ec442c6F02f1A2F04534e","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]},{"permission":"upgrade","from":"0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"},{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}]
    }
```

```diff
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.5:
-        {"permission":"upgrade","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.4:
-        {"permission":"upgrade","to":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525","via":[{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.3:
-        {"permission":"upgrade","to":"0x3235AdE33cF7013f5b5A51089390396e931e6BCF","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"},{"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}]}
      issuedPermissions.2:
-        {"permission":"guard","to":"0xDB866fD9241cd32851Df760c1Ec536f3199B22cE","via":[{"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}]}
      issuedPermissions.1.permission:
-        "guard"
+        "upgrade"
      issuedPermissions.1.via.0:
+        {"address":"0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"}
      issuedPermissions.0.to:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.via.0:
-        {"address":"0xb2B01DeCb6cd36E7396b78D3744482627F22C525"}
    }
```

Generated with discovered.json: 0x06121f91c74b17d2d316163c82d731d1d87cab80

# Diff at Wed, 22 Jan 2025 08:28:09 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 21543602
- current block number: 21678827

## Description

One line FacetEtherBridgeV6 upgrade: The gas limit for `bridgeAndCall()` transactions is now hardcoded to 50M.

## Watched changes

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      sourceHashes.1:
-        "0xc6fc9d901cf59527db2a86ff96ebd61f6a469b56100f1a94498e2f068a91f50b"
+        "0xd5a977325a2b053491581c54141a59a425e2fe510cdfa1cd3b85ab45ca437a7e"
      values.$implementation:
-        "0x100524b68fe88035623F1309Bb3Db9b64e924724"
+        "0x68c56f4D88846A4Cdce966d92D92a0636baf40FE"
    }
```

## Source code changes

```diff
.../FacetEtherBridgeV6/FacetEtherBridgeV6.sol                         | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x732c7bdb83433619e72a9fa0358b5253b3484ac0

# Diff at Mon, 20 Jan 2025 11:09:30 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21543602
- current block number: 21543602

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543602 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      issuedPermissions.3.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.via.0.description:
-        "can withdraw all funds from the bridge."
      issuedPermissions.3.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.3.description:
+        "can withdraw all funds from the bridge."
      issuedPermissions.2.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.2.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.2.description:
+        "can withdraw all funds from the bridge."
      issuedPermissions.1.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "can withdraw all funds from the bridge."
      issuedPermissions.1.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.1.description:
+        "can withdraw all funds from the bridge."
      issuedPermissions.0.target:
-        "0x314d660b083675f415cCAA9c545FeedF377d1006"
      issuedPermissions.0.to:
+        "0x314d660b083675f415cCAA9c545FeedF377d1006"
      issuedPermissions.0.description:
+        "can sign arbitrary withdrawals for users."
    }
```

```diff
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.2.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.1.description:
-        "set and change address mappings."
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.2.description:
+        "set and change address mappings."
      issuedPermissions.1.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "set and change address mappings."
      issuedPermissions.1.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.description:
+        "set and change address mappings."
      issuedPermissions.0.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "set and change address mappings."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF) {
    +++ description: Module that allows the Safe to send Facet transactions.
      receivedPermissions.9.target:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.9.from:
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.8.target:
-        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.8.from:
+        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.7.target:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.7.from:
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.6.target:
-        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      receivedPermissions.6.from:
+        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      receivedPermissions.5.target:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.5.from:
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.4.target:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.4.from:
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.3.target:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.3.from:
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.2.target:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.2.from:
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.1.target:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.1.from:
+        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.0.target:
-        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
      receivedPermissions.0.from:
+        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
      directlyReceivedPermissions.0.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      directlyReceivedPermissions.0.from:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
    }
```

```diff
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.5.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.5.via.1.delay:
-        0
      issuedPermissions.5.via.0.delay:
-        0
      issuedPermissions.5.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.4.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.3.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.3.via.1.delay:
-        0
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.2.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.1.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
    }
```

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.2.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.2.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.1.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.1.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract FacetMultisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.9.from:
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.8.target:
-        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.8.from:
+        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.7.target:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.7.from:
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.6.target:
-        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      receivedPermissions.6.from:
+        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      receivedPermissions.5.target:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.5.from:
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.4.target:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.4.from:
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.3.target:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.3.from:
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.2.target:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.2.from:
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.1.target:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.1.from:
+        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.0.target:
-        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
      receivedPermissions.0.from:
+        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
      directlyReceivedPermissions.0.target:
-        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
      directlyReceivedPermissions.0.from:
+        "0xe2A3bda6CD571943DD4224d0B8872e221EB5997C"
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      issuedPermissions.5.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.5.via.1.delay:
-        0
      issuedPermissions.5.via.0.delay:
-        0
      issuedPermissions.5.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.4.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.3.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.3.via.1.delay:
-        0
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.2.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.via.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.2.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.1.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.0.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      issuedPermissions.0.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.4.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.4.via.1.delay:
-        0
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.3.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.2.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.1.target:
-        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
      issuedPermissions.1.to:
+        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
      issuedPermissions.0.target:
-        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
      issuedPermissions.0.to:
+        "0x034B0a32395D15C0F63F3e88931Bf7e1D9627eE3"
    }
```

```diff
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE) {
    +++ description: Module that allows the Safe to interact with Ethscriptions.
      receivedPermissions.9.target:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.9.from:
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.8.target:
-        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.8.from:
+        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      receivedPermissions.7.target:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.7.from:
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.6.target:
-        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      receivedPermissions.6.from:
+        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      receivedPermissions.5.target:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.5.from:
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.4.target:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.4.from:
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      receivedPermissions.3.target:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.3.from:
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      receivedPermissions.2.target:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.2.from:
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      receivedPermissions.1.target:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.1.from:
+        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      receivedPermissions.0.target:
-        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
      receivedPermissions.0.from:
+        "0x0000000000000b07ED001607f5263D85bf28Ce4C"
      directlyReceivedPermissions.0.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      directlyReceivedPermissions.0.from:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
    }
```

```diff
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C) {
    +++ description: None
      directlyReceivedPermissions.5.target:
-        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      directlyReceivedPermissions.5.from:
+        "0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59"
      directlyReceivedPermissions.4.target:
-        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      directlyReceivedPermissions.4.from:
+        "0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6"
      directlyReceivedPermissions.3.target:
-        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      directlyReceivedPermissions.3.from:
+        "0xC1E935F25f9c1198200ec442c6F02f1A2F04534e"
      directlyReceivedPermissions.2.target:
-        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      directlyReceivedPermissions.2.from:
+        "0x8F75466D69a52EF53C7363F38834bEfC027A2909"
      directlyReceivedPermissions.1.target:
-        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      directlyReceivedPermissions.1.from:
+        "0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD"
      directlyReceivedPermissions.0.target:
-        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
      directlyReceivedPermissions.0.from:
+        "0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA"
    }
```

```diff
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.5.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.5.via.1.delay:
-        0
      issuedPermissions.5.via.0.delay:
-        0
      issuedPermissions.5.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.4.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.4.via.0.delay:
-        0
      issuedPermissions.4.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.3.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.3.via.1.delay:
-        0
      issuedPermissions.3.via.0.delay:
-        0
      issuedPermissions.3.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.2.target:
-        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xDB866fD9241cd32851Df760c1Ec536f3199B22cE"
      issuedPermissions.1.target:
-        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.1.to:
+        "0xb2B01DeCb6cd36E7396b78D3744482627F22C525"
      issuedPermissions.0.target:
-        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x3235AdE33cF7013f5b5A51089390396e931e6BCF"
    }
```

Generated with discovered.json: 0xc5c0fbf6903a5b99ee13df0f77e50e974248d361

# Diff at Fri, 10 Jan 2025 15:23:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@13c134b0211f75779d58c36868cbda90565479ce block: 21543602
- current block number: 21543602

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543602 (main branch discovery), not current.

```diff
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C) {
    +++ description: Official Facet implementation of the Ether Bridge.
      unverified:
-        true
      sourceHashes:
+        ["0x60cd8a11d99e2d3ed98fa2bbd47ef1096acb4bc535c5520343ae45cea6436e7b","0xc6fc9d901cf59527db2a86ff96ebd61f6a469b56100f1a94498e2f068a91f50b"]
      references:
+        [{"text":"Source Code","href":"https://github.com/vectorized/solady/blob/main/src/utils/ERC1967Factory.sol"}]
    }
```

```diff
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e) {
    +++ description: None
      displayName:
+        "SystemConfig_facet"
    }
```

Generated with discovered.json: 0x7cf027e6e1d79c780e4032052354bca1a07a911b

# Diff at Wed, 08 Jan 2025 09:39:07 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3870091bac574174d64874eed9f76e846e3c3c9e block: 21543602
- current block number: 21543602

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543602 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x54e0eea976975dbaf70c242572171682ad00ba8a

# Diff at Fri, 03 Jan 2025 11:17:26 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 21543602

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C)
    +++ description: Official Facet implementation of the Ether Bridge.
```

```diff
+   Status: CREATED
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF)
    +++ description: Module that allows the Safe to send Facet transactions.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xa1233c2DB638D41893a101B0e9dd44cb681270E8)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract FacetMultisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FacetSafeProxy (0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25)
    +++ description: Helper of the Safe Module that allows to send Facet transactions.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE)
    +++ description: Module that allows the Safe to interact with Ethscriptions.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract EthscriptionsSafeProxy (0xeEd444Fc821b866b002f30f502C53e88E15d5095)
    +++ description: Helper of the Safe Module that allows to send Ethscriptions transactions.
```

