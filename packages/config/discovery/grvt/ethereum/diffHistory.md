Generated with discovered.json: 0xda9c13bb7b827b8c3dc6dbf5b0055e3826e957bc

# Diff at Tue, 11 Mar 2025 08:00:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21766583
- current block number: 22022296

## Description

ValidatorTimelock governance transfer for ZIP 5.

## Watched changes

```diff
-   Status: DELETED
    contract undefined (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      values.owner:
-        "0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897"
+        "0xE30Dca3047B37dc7d88849dE4A4Dc07937ad5Ab3"
    }
```

```diff
-   Status: DELETED
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
-   Status: DELETED
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
-   Status: DELETED
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
-   Status: DELETED
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
```

## Source code changes

```diff
.../EmergencyUpgradeBoard.sol => /dev/null         | 1233 -----------------
 .../.flat@21766583/Guardians.sol => /dev/null      | 1439 --------------------
 .../ProtocolUpgradeHandler.sol => /dev/null        |  605 --------
 .../SecurityCouncil.sol => /dev/null               | 1389 -------------------
 4 files changed, 4666 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766583 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract undefined (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler (0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897)
    +++ description: The central upgrade contract and Governance proxy for all ZK stack contracts. Accepts successful DAO proposals from L2, emergency proposals from the EmergencyUpgradeBoard. The three members of the EmergencyUpgradeBoard also have special roles and permissions in this contract.
```

```diff
+   Status: CREATED
    contract SecurityCouncil (0xBDFfCC71FE84020238F2990a6D2954e87355De0D)
    +++ description: Custom Multisig implementation that has a general threshold of 9 but also specific thresholds for upgrade approvals (6) or soft freezes (3).
```

```diff
+   Status: CREATED
    contract Guardians (0xD677e09324F8Bb3cC64F009973693f751c33A888)
    +++ description: Custom Multisig implementation that has a general threshold of 5 and a specific threshold for extending the legal voting period of 2.
```

```diff
+   Status: CREATED
    contract EmergencyUpgradeBoard (0xdEFd1eDEE3E8c5965216bd59C866f7f5307C9b29)
    +++ description: A custom contract allowing a 3/3 of 0xBDFfCC71FE84020238F2990a6D2954e87355De0D, 0xbC1653bd3829dfEc575AfC3816D4899cd103B51c and 0xD677e09324F8Bb3cC64F009973693f751c33A888 to `executeEmergencyUpgrade()` via the 0x8f7a9912416e8AdC4D9c21FAe1415D3318A11897.
```

Generated with discovered.json: 0x9a924385421b3c06b52864bd53a7e362ac4f4ae8

# Diff at Tue, 04 Mar 2025 10:39:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766583
- current block number: 21766583

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766583 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      sinceBlock:
+        21081436
    }
```

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      sinceBlock:
+        20996715
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      sinceBlock:
+        21313725
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      sinceBlock:
+        20019826
    }
```

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      sinceBlock:
+        21120440
    }
```

```diff
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT.
      sinceBlock:
+        21313725
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sinceBlock:
+        21168735
    }
```

```diff
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1) {
    +++ description: None
      sinceBlock:
+        21134244
    }
```

Generated with discovered.json: 0xb4ccceda7a88f6c1ffe15e503a5b93b50e7b57df

# Diff at Wed, 26 Feb 2025 10:32:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766583
- current block number: 21766583

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766583 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0xb9820f9ab3e1cdab970adef05c2dae9bea612da9

# Diff at Tue, 04 Feb 2025 12:31:32 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766583
- current block number: 21766583

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766583 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions.3.permission:
-        "configure"
+        "interact"
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x5e7644ba5c5277c6b612c7bfcf928d88f1fa0d3d

# Diff at Mon, 03 Feb 2025 14:33:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21736827
- current block number: 21766583

## Description

[ZIP-002] 'Reduce the execution delay from 21 hours to 3 hours' executed.

## Watched changes

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h.
      description:
-        "Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h."
+        "Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 3h."
      values.executionDelay:
-        75600
+        10800
      values.executionDelay_fmt:
-        "21h"
+        "3h"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21736827 (main branch discovery), not current.

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0x89614d1f53e5c4a5098d1b40b2fcf90dd3c43651d7197412f44ba5b1c992cf0e","expirationTimestamp":1738163327,"layer2Tip":0}
    }
```

Generated with discovered.json: 0x9af4c4f1901a058700e83194bd3e21459018cb4e

# Diff at Thu, 30 Jan 2025 10:43:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 21721209
- current block number: 21736827

## Description

upgrade completed.

## Watched changes

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.getL2SystemContractsUpgradeBatchNumber:
-        533
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        533
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xd736970d8df850999330f41ea339a8663e282877

# Diff at Wed, 29 Jan 2025 09:51:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 21721209
- current block number: 21721209

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21721209 (main branch discovery), not current.

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions.4:
+        {"permission":"upgrade","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","via":[]}
      issuedPermissions.3.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.3.to:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
+        "0xF29bFff344c7ef0186432fE30C39fda0cca0550b"
      issuedPermissions.3.description:
+        "manage the whitelist of addresses."
    }
```

Generated with discovered.json: 0x828b4c785ebeb4d554e814ff682f6c733052cd6d

# Diff at Tue, 28 Jan 2025 06:33:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21629172
- current block number: 21721209

## Description

upgrade to protocol version 25 (see zksync era for changelog).

discodrive!

## Watched changes

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
+++ description: Timestamps for new protocol version upgrades can be registered here (NOT enforced)
      values.upgradeTimestamps.0:
+        {"_protocolVersion":107374182400,"_upgradeTimestamp":1729793768}
    }
```

```diff
-   Status: DELETED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: Implements the ZK proof verification logic.
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sourceHashes.4:
-        "0xe521f6bd6250a2c92af323768ad8a2274cc334725b5ed8960d8421f063fc3285"
+        "0xdf47c6cd4fcffcfa4a670e1544e2391acc365cd7fd9b8e7583d58b28dff50c40"
      sourceHashes.3:
-        "0x419cee160f60572fc9189007ec7c1e3c13e54d80bf1e78f837bc8fa001519685"
+        "0x91db58e4059dfed7357e56dac17d2963c6f9cfb540f527988ed25172251a2584"
      sourceHashes.2:
-        "0xd272def5b4e3f0a68e3019d7d40675ca6d3e3fc35500e9aafe864bce8c697de2"
+        "0x981d4f2ae5949ab33c6ba83f6446595d3b853bf6f7157884304445d70b185374"
      sourceHashes.1:
-        "0x9ae32beaa5dc29055f75d3cd08fbec35ed3eee3e2ff35de263a78f7d63c610f9"
+        "0x081a1805983e86cd6a80ed48c012c26bf9a39473c0f1e69b357afff240f027a0"
      values.$implementation.3:
-        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
+        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
      values.$implementation.2:
-        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
+        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
      values.$implementation.1:
-        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
+        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
      values.$implementation.0:
-        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
+        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
      values.$pastUpgrades.2:
+        ["2025-01-28T05:38:11.000Z","0x733c89da487edb502dc65f5115ada9cef6b44128a85cf36adbde4821e13abe31",["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]]
      values.$upgradeCount:
-        2
+        3
      values.facetAddresses.3:
-        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
+        "0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"
      values.facetAddresses.2:
-        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
+        "0x5575218cECd370E1d630d1AdB03c254B0B376821"
      values.facetAddresses.1:
-        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
+        "0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9"
      values.facetAddresses.0:
-        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
+        "0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a"
      values.facets.0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a:
-        ["acceptAdmin()","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","freezeDiamond()","setPendingAdmin(address)","setPorterAvailability(bool)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)","setTokenMultiplier(uint128,uint128)","setTransactionFilterer(address)","setValidator(address,bool)","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))"]
      values.facets.0xE60E94fCCb18a81D501a38959E532C0A85A1be89:
-        ["baseTokenGasPriceMultiplierDenominator()","baseTokenGasPriceMultiplierNominator()","facetAddress(bytes4)","facetAddresses()","facetFunctionSelectors(address)","facets()","getAdmin()","getBaseToken()","getBaseTokenBridge()","getBridgehub()","getFirstUnprocessedPriorityTx()","getL2BootloaderBytecodeHash()","getL2DefaultAccountBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","getL2SystemContractsUpgradeBlockNumber()","getL2SystemContractsUpgradeTxHash()","getPendingAdmin()","getPriorityQueueSize()","getPriorityTxMaxGasLimit()","getProtocolVersion()","getPubdataPricingMode()","getSemverProtocolVersion()","getStateTransitionManager()","getTotalBatchesCommitted()","getTotalBatchesExecuted()","getTotalBatchesVerified()","getTotalBlocksCommitted()","getTotalBlocksExecuted()","getTotalBlocksVerified()","getTotalPriorityTxs()","getVerifier()","getVerifierParams()","isDiamondStorageFrozen()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","isFunctionFreezable(bytes4)","isValidator(address)","l2LogsRootHash(uint256)","priorityQueueFrontOperation()","storedBatchHash(uint256)","storedBlockHash(uint256)"]
      values.facets.0xCDB6228b616EEf8Df47D69A372C4f725C43e718C:
-        ["bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","transferEthToSharedBridge()"]
      values.facets.0xaD193aDe635576d8e9f7ada71Af2137b16c64075:
-        ["commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","commitBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","executeBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","executeBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","proveBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","revertBatches(uint256)","revertBatchesSharedBridge(uint256,uint256)"]
      values.facets.0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a:
+        ["acceptAdmin()","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","freezeDiamond()","setPendingAdmin(address)","setPorterAvailability(bool)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)","setTokenMultiplier(uint128,uint128)","setTransactionFilterer(address)","setValidator(address,bool)","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))"]
      values.facets.0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9:
+        ["baseTokenGasPriceMultiplierDenominator()","baseTokenGasPriceMultiplierNominator()","facetAddress(bytes4)","facetAddresses()","facetFunctionSelectors(address)","facets()","getAdmin()","getBaseToken()","getBaseTokenBridge()","getBridgehub()","getFirstUnprocessedPriorityTx()","getL2BootloaderBytecodeHash()","getL2DefaultAccountBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","getL2SystemContractsUpgradeBlockNumber()","getL2SystemContractsUpgradeTxHash()","getPendingAdmin()","getPriorityQueueSize()","getPriorityTxMaxGasLimit()","getProtocolVersion()","getPubdataPricingMode()","getSemverProtocolVersion()","getStateTransitionManager()","getTotalBatchesCommitted()","getTotalBatchesExecuted()","getTotalBatchesVerified()","getTotalBlocksCommitted()","getTotalBlocksExecuted()","getTotalBlocksVerified()","getTotalPriorityTxs()","getVerifier()","getVerifierParams()","isDiamondStorageFrozen()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","isFunctionFreezable(bytes4)","isValidator(address)","l2LogsRootHash(uint256)","priorityQueueFrontOperation()","storedBatchHash(uint256)","storedBlockHash(uint256)"]
      values.facets.0x5575218cECd370E1d630d1AdB03c254B0B376821:
+        ["bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","transferEthToSharedBridge()"]
      values.facets.0xBB13642F795014E0EAC2b0d52ECD5162ECb66712:
+        ["commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","commitBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","executeBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","executeBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","proveBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","revertBatches(uint256)","revertBatchesSharedBridge(uint256,uint256)"]
      values.getL2BootloaderBytecodeHash:
-        "0x010008e742608b21bf7eb23c1a9d0602047e3618b464c9b59c0fba3b3d7ab66e"
+        "0x010008c3be57ae5800e077b6c2056d9d75ad1a7b4f0ce583407961cc6fe0b678"
      values.getL2DefaultAccountBytecodeHash:
-        "0x01000563374c277a2c1e34659a2a1e87371bb6d852ce142022d497bfb50b9e32"
+        "0x0100055dba11508480be023137563caec69debc85f826cb3a4b68246a7cabe30"
      values.getL2SystemContractsUpgradeBatchNumber:
-        0
+        533
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        533
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+++ description: Protocol version, increments with each protocol upgrade.
+++ severity: MEDIUM
      values.getProtocolVersion:
-        103079215106
+        107374182400
      values.getSemverProtocolVersion.2:
-        2
+        0
      values.getSemverProtocolVersion.1:
-        24
+        25
      values.getVerifier:
-        "0x70F3FBf8a427155185Ec90BED8a3434203de9604"
+        "0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66"
    }
```

```diff
+   Status: CREATED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: Implements the ZK proof verification logic.
```

## Source code changes

```diff
.../GrvtZkEvm/AdminFacet.1.sol                     | 166 +++++++---
 .../GrvtZkEvm/ExecutorFacet.4.sol                  | 343 ++++++++++++++-------
 .../GrvtZkEvm/GettersFacet.2.sol                   | 117 +++++--
 .../GrvtZkEvm/MailboxFacet.3.sol                   | 255 +++++++++++----
 4 files changed, 627 insertions(+), 254 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629172 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"upgrade","from":"0xE17aeD2fC55f4A876315376ffA49FE6358113a65"}
      receivedPermissions.2:
+        {"permission":"upgrade","from":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a"}
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.from:
-        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
+        "0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E"
      receivedPermissions.1.description:
+        "manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."
      receivedPermissions.1.via:
+        [{"address":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}]
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.from:
-        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
+        "0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"
      receivedPermissions.0.description:
+        "set the conversion factor for gas token deposits."
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}]
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions.3:
+        {"permission":"upgrade","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","via":[]}
      issuedPermissions.2:
+        {"permission":"configure","to":"0xF29bFff344c7ef0186432fE30C39fda0cca0550b","description":"address is part of the GRVTTransactionFilterer whitelist.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0xe81d64195072e4d09639b31Abb257d0096FEa9d1","description":"address is part of the GRVTTransactionFilterer whitelist.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
      issuedPermissions.0.description:
+        "address is part of the GRVTTransactionFilterer whitelist."
      values.acAdmin:
+        ["0xF29bFff344c7ef0186432fE30C39fda0cca0550b"]
      values.whitelistedSender:
+        ["0xe81d64195072e4d09639b31Abb257d0096FEa9d1","0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","0xE17aeD2fC55f4A876315376ffA49FE6358113a65","0xF29bFff344c7ef0186432fE30C39fda0cca0550b"]
      severity:
+        "HIGH"
      receivedPermissions:
+        [{"permission":"configure","from":"0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet."}]
    }
```

```diff
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      issuedPermissions:
+        [{"permission":"configure","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","description":"set the conversion factor for gas token deposits.","via":[]}]
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."}]
    }
```

```diff
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604) {
    +++ description: Implements the ZK proof verification logic.
      template:
+        "shared-zk-stack/Verifier"
      description:
+        "Implements the ZK proof verification logic."
    }
```

```diff
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT.
      issuedPermissions.1:
+        {"permission":"upgrade","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
+        "0x5c8de5821dd9263F124E8ddbff11C3368Ff86a37"
      issuedPermissions.0.description:
+        "approve deposits to GRVT via the GRVTBridgeProxy."
      description:
+        "Checks the signature of the DepositApprover for each deposit and, on succeeding, forwards the user's funds and bridging request to the L1SharedBridge contract to deposit to GRVT."
      receivedPermissions:
+        [{"permission":"configure","from":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a","description":"address is part of the GRVTTransactionFilterer whitelist."}]
    }
```

```diff
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.txFilterer.0:
-        {"oldTransactionFilterer":"0x0000000000000000000000000000000000000000","newTransactionFilterer":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a"}
+        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
      fieldMeta.txFilterer.description:
-        "Optional: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
+        "This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
      fieldMeta.getProtocolVersion.description:
-        "Protocol version, increments with each protocol change"
+        "Protocol version, increments with each protocol upgrade."
      fieldMeta.getVerifierParams.description:
-        "Verifier parameters used for proving batches"
+        "Verifier parameters used for proving batches."
      fieldMeta.daMode:
-        {"description":"0 = rollup; 1 = Validium"}
      template:
+        "shared-zk-stack/Diamond"
      description:
+        "The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions."
      issuedPermissions:
+        [{"permission":"configure","to":"0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D"}]},{"permission":"configure","to":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet.","via":[]},{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

```diff
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x3Cd52B238Ac856600b22756133eEb31ECb25109a","description":"address is part of the GRVTTransactionFilterer whitelist."}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x8389fd0febf49490dfb76c31b368eb6fbf1d8530

# Diff at Mon, 20 Jan 2025 11:09:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21629172
- current block number: 21629172

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629172 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
      receivedPermissions.1.from:
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
      receivedPermissions.0.target:
-        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
      receivedPermissions.0.from:
+        "0x3Cd52B238Ac856600b22756133eEb31ECb25109a"
    }
```

```diff
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
      issuedPermissions.0.to:
+        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
    }
```

```diff
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
      issuedPermissions.0.to:
+        "0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5"
    }
```

Generated with discovered.json: 0x0b37aeb60b3c8badba363a35a5d7211e4895cd5c

# Diff at Wed, 15 Jan 2025 10:05:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21593895
- current block number: 21629172

## Description

Ignore GRVT token.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21593895 (main branch discovery), not current.

```diff
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5) {
    +++ description: None
      receivedPermissions.2:
-        {"permission":"upgrade","target":"0xE17aeD2fC55f4A876315376ffA49FE6358113a65"}
      receivedPermissions.1.target:
-        "0xAB3B124052F0389D1cbED221d912026Ac995bb95"
+        "0xE17aeD2fC55f4A876315376ffA49FE6358113a65"
    }
```

```diff
-   Status: DELETED
    contract GRVTBaseToken (0xAB3B124052F0389D1cbED221d912026Ac995bb95)
    +++ description: None
```

Generated with discovered.json: 0x01760da7c2e999a872c59c95cea8d1bfdf8fc730

# Diff at Fri, 10 Jan 2025 11:53:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21593895

## Description

Initial discovery of a standard ZK stack Validium.

## Initial discovery

```diff
+   Status: CREATED
    contract GrvtChainAdminMultisig (0x3a23919d4aA39e096E9d6420fd6a2861A20B19e5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTTransactionFilterer (0x3Cd52B238Ac856600b22756133eEb31ECb25109a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GrvtZkEvmAdmin (0x6308ee1Ebdb8D5E60bB88D3EA3b56CE326193e7D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTBaseToken (0xAB3B124052F0389D1cbED221d912026Ac995bb95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GRVTBridgeProxy (0xE17aeD2fC55f4A876315376ffA49FE6358113a65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GrvtZkEvm (0xe3e310cd8EE0C808794810AB50FE4BcCC5c7D89E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0xe81d64195072e4d09639b31Abb257d0096FEa9d1)
    +++ description: None
```
