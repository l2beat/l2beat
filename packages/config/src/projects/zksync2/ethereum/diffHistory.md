Generated with discovered.json: 0x8d149434e612266253c142e6f44dbcfe48293254

# Diff at Tue, 11 Mar 2025 08:00:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21766584
- current block number: 22022298

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
 .../.flat@21766584/Guardians.sol => /dev/null      | 1439 --------------------
 .../ProtocolUpgradeHandler.sol => /dev/null        |  605 --------
 .../SecurityCouncil.sol => /dev/null               | 1389 -------------------
 4 files changed, 4666 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766584 (main branch discovery), not current.

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

Generated with discovered.json: 0x8de661f0aacb60400faf42c0cefe721a7e0b904d

# Diff at Tue, 04 Mar 2025 10:40:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766584
- current block number: 21766584

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766584 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      sinceBlock:
+        21081436
    }
```

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: Old Governance contract for ZKsync Era allowing for proposals in form of transactions. The minimum delay is 0s.
      sinceBlock:
+        18677050
    }
```

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sinceBlock:
+        16621828
    }
```

```diff
    contract L1ERC20Bridge_wstETH (0x41527B2d03844dB6b0945f25702cB958b6d55989) {
    +++ description: Bridge for depositing wrapped stETH (Lido) to ZKsync Era. These deposits and withdrawals do not go through the shared Bridge.
      sinceBlock:
+        18413072
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
    +++ description: Legacy bridge for depositing ERC20 tokens to ZKsync Era. Forwards deposits and withdrawals to the BridgeHub.
      sinceBlock:
+        16626406
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
    contract ValidatorTimelockOld (0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD) {
    +++ description: Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h. This contract is a remnant from pre Elastic Chain times.
      sinceBlock:
+        19386286
    }
```

Generated with discovered.json: 0x9aab0a83b0b6a25294611d57fb9ca1a825fab58a

# Diff at Wed, 26 Feb 2025 10:33:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766584
- current block number: 21766584

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766584 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
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

Generated with discovered.json: 0x6aa92c27fe49b194d9d9974f68d70f942adcdcad

# Diff at Tue, 04 Feb 2025 12:33:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766584
- current block number: 21766584

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766584 (main branch discovery), not current.

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: Old Governance contract for ZKsync Era allowing for proposals in form of transactions. The minimum delay is 0s.
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
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
    contract ValidatorTimelockOld (0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD) {
    +++ description: Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h. This contract is a remnant from pre Elastic Chain times.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe1b5faa7a75f502d87551b03533e68aaaf8e9105

# Diff at Mon, 03 Feb 2025 14:33:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21717502
- current block number: 21766584

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
discovery. Values are for block 21717502 (main branch discovery), not current.

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0xcdc30009111831c38e0f1e7e1941b13792047d246e2eb1d64931da74365b35af","expirationTimestamp":1737916571,"layer2Tip":0}
    }
```

Generated with discovered.json: 0x0460401d9dedef2f9b1e4eec1ee585731c7410e5

# Diff at Tue, 28 Jan 2025 06:34:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21630311
- current block number: 21717502

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630311 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      template:
+        "shared-zk-stack/Verifier"
      description:
+        "Implements the ZK proof verification logic."
    }
```

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: Old Governance contract for ZKsync Era allowing for proposals in form of transactions. The minimum delay is 0s.
      values.minDelay_formatted:
+        "0s"
      description:
+        "Old Governance contract for ZKsync Era allowing for proposals in form of transactions. The minimum delay is 0s."
      receivedPermissions:
+        [{"permission":"configure","from":"0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD","description":"set addresses (validators) that can commit, prove, execute, revert batches through this contract."}]
    }
```

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      fieldMeta.txFilterer.description:
-        "Optional: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
+        "This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."
      fieldMeta.getProtocolVersion.description:
-        "Protocol version, increments with each protocol change"
+        "Protocol version, increments with each protocol upgrade."
      fieldMeta.getVerifierParams.description:
-        "Verifier parameters used for proving batches"
+        "Verifier parameters used for proving batches."
      template:
+        "shared-zk-stack/Diamond"
      description:
+        "The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions."
      issuedPermissions:
+        [{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"configure","to":"0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]}]
    }
```

```diff
    contract L1ERC20Bridge_wstETH (0x41527B2d03844dB6b0945f25702cB958b6d55989) {
    +++ description: Bridge for depositing wrapped stETH (Lido) to ZKsync Era. These deposits and withdrawals do not go through the shared Bridge.
      description:
+        "Bridge for depositing wrapped stETH (Lido) to ZKsync Era. These deposits and withdrawals do not go through the shared Bridge."
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
    +++ description: Legacy bridge for depositing ERC20 tokens to ZKsync Era. Forwards deposits and withdrawals to the BridgeHub.
      description:
+        "Legacy bridge for depositing ERC20 tokens to ZKsync Era. Forwards deposits and withdrawals to the BridgeHub."
    }
```

```diff
    contract ValidatorTimelockOld (0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD) {
    +++ description: Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h. This contract is a remnant from pre Elastic Chain times.
      values.validatorsAdded:
-        []
      values.validatorsRemoved:
-        []
      values.executionDelay_formatted:
+        "21h"
      values.validatorsVTLold:
+        []
      description:
+        "Intermediary contract between the *Validators* and the ZKsync Era diamond that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h. This contract is a remnant from pre Elastic Chain times."
      issuedPermissions:
+        [{"permission":"configure","to":"0x0b622A2061EaccAE1c664eBC3E868b8438e03F61","description":"set addresses (validators) that can commit, prove, execute, revert batches through this contract.","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0x32400084C286CF3E17e7B677ea9583e60a000324","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock."}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x36b8c6d9ead866cfaf46cdf38330c2c22943315b

# Diff at Wed, 15 Jan 2025 13:55:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21585292
- current block number: 21630311

## Description

Upgrade the diamond contract to the predeployed v25 in context of the ['protocol defence' upgrade](https://github.com/matter-labs/era-contracts/pull/774).

This updrade brings formatting, gas optimizations and minor changes only.

## Watched changes

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
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
      values.$pastUpgrades.18:
+        ["2025-01-10T14:55:59.000Z","0x4f45a603cfe9fb680e13fc3ecb48aed0ba73e198e7be5f53e39f016384d262b0",["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]]
      values.$upgradeCount:
-        18
+        19
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
+++ description: Protocol version, increments with each protocol change
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
-   Status: DELETED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: None
```

## Source code changes

```diff
.../ZKsync/AdminFacet.1.sol                        | 166 +++++++---
 .../ZKsync/ExecutorFacet.4.sol                     | 343 ++++++++++++++-------
 .../ZKsync/GettersFacet.2.sol                      | 117 +++++--
 .../ZKsync/MailboxFacet.3.sol                      | 255 +++++++++++----
 4 files changed, 627 insertions(+), 254 deletions(-)
```

Generated with discovered.json: 0x995ecd648c3af31da05c3286480b2c916139cf74

# Diff at Thu, 09 Jan 2025 07:00:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@edc6acaed84d40aabd5185e0a0b5ebaf1c90143b block: 21035830
- current block number: 21585292

## Description

Upgrade L1ERC20Bridge.

Minor changes only (replacing `require()` with `if(revert()))` and adding docs). [Tally proposal](https://www.tally.xyz/gov/zksync/proposal/39897055470405054808751466940888279812739313934036970931300785151980460250983?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f).

## Watched changes

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
    +++ description: None
      sourceHashes.1:
-        "0xddcdd4b758b565f39e4924d6a66afc27850a66e5f1022fb1c008d10f85af1028"
+        "0x179b79e02a71cc452486d433271b925a402363053a3dd4e9d83837877c677dfd"
      values.$implementation:
-        "0x8191975d8B0851C7f0740918896Cf298c09aA05E"
+        "0x8D231E4097C3cb200Ed62134B466AA615cE60336"
      values.$pastUpgrades.8:
+        ["2025-01-08T16:00:35.000Z","0xc90d135e4b8ab58304853f3be34b2fefd18c2a817d3d250e7b669e024d5277c5",["0x8D231E4097C3cb200Ed62134B466AA615cE60336"]]
      values.$upgradeCount:
-        8
+        9
    }
```

## Source code changes

```diff
.../L1ERC20Bridge/L1ERC20Bridge.sol                | 88 ++++++++++++++++------
 1 file changed, 67 insertions(+), 21 deletions(-)
```

Generated with discovered.json: 0x767c7f8e45564a97713452f286e26f4afaf38104

# Diff at Mon, 21 Oct 2024 11:24:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20777173
- current block number: 20777173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777173 (main branch discovery), not current.

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      values.$pastUpgrades.17.2:
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.17.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "0x2060aa785aeefa91a0b103accc9df689c7a2056aacfa70309492e729ddea4565"
      values.$pastUpgrades.16.2:
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.16.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "0x71a3b924989f551cbf3024fcd6b52aeb9a52902d95c0efb690e7340d667b6e21"
      values.$pastUpgrades.15.2:
+        ["0x230214F0224C7E0485f348a79512ad00514DB1F7","0x10113bB3a8e64f8eD67003126adC8CE74C34610c","0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7","0xfd3779e6214eBBd40f5F5890351298e123A46BA6"]
      values.$pastUpgrades.15.1:
-        ["0x230214F0224C7E0485f348a79512ad00514DB1F7","0x10113bB3a8e64f8eD67003126adC8CE74C34610c","0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7","0xfd3779e6214eBBd40f5F5890351298e123A46BA6"]
+        "0xc78a986be023f367f121c06fa9662ef950ad76f2cfe9397693f63de6c5959c61"
      values.$pastUpgrades.14.2:
+        ["0x230214F0224C7E0485f348a79512ad00514DB1F7","0x10113bB3a8e64f8eD67003126adC8CE74C34610c","0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7","0xfd3779e6214eBBd40f5F5890351298e123A46BA6"]
      values.$pastUpgrades.14.1:
-        ["0x230214F0224C7E0485f348a79512ad00514DB1F7","0x10113bB3a8e64f8eD67003126adC8CE74C34610c","0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7","0xfd3779e6214eBBd40f5F5890351298e123A46BA6"]
+        "0xa5fd3584a815267a84a5686b386d911ed7e53d6c1863ff64a57ef0f7085bd4d7"
      values.$pastUpgrades.13.2:
+        ["0xE6426c725cB507168369c10284390E59d91eC821","0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B","0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB","0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"]
      values.$pastUpgrades.13.1:
-        ["0xE6426c725cB507168369c10284390E59d91eC821","0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B","0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB","0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"]
+        "0x937dd21a05142c02159170dafb1bbaaa145ae7bd2c29bf512534fbec9ff801ab"
      values.$pastUpgrades.12.2:
+        ["0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967","0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7","0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58","0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"]
      values.$pastUpgrades.12.1:
-        ["0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967","0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7","0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58","0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"]
+        "0x2200e7109d3abbb74cb03144fea37f7227188e1fcaba4538bd9dfa3fa17cca02"
      values.$pastUpgrades.11.2:
+        ["0x409560DE546e057ce5bD5dB487EdF2bB5E785baB","0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4","0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08","0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"]
      values.$pastUpgrades.11.1:
-        ["0x409560DE546e057ce5bD5dB487EdF2bB5E785baB","0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4","0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08","0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"]
+        "0x9f0e9ecd78b5c17ff95c130b183df452486a0f784705927e608fd90a00aa9bcd"
      values.$pastUpgrades.10.2:
+        ["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
      values.$pastUpgrades.10.1:
-        ["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
+        "0x4d3e09380ee604e75800fd61da0c1771987e1cbca7c5254e8c7479e3dd0e3b37"
      values.$pastUpgrades.9.2:
+        ["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
      values.$pastUpgrades.9.1:
-        ["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
+        "0x0de4556791139b205562b388f2ddc4a2d2ec1bf0996feea38158535cd7e1a5c6"
      values.$pastUpgrades.8.2:
+        ["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
      values.$pastUpgrades.8.1:
-        ["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
+        "0x5e3ce9e7d3920f293487a5581146f8333191a4068762db6fe4d1eec65a3fb805"
      values.$pastUpgrades.7.2:
+        ["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
      values.$pastUpgrades.7.1:
-        ["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
+        "0x72983cd25802230545bcb38b805638b0ffa17990ad51e8843e55519fe96d702c"
      values.$pastUpgrades.6.2:
+        ["0xc6f7e57C6e1e20468D869Fe33675524e243CD6a0","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x5349E94435Cc9Cab9FfB40A492DA46935052733A","0x16615a85B451edfb6FCBea0b34405D9C7ca1a22A","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
      values.$pastUpgrades.6.1:
-        ["0xc6f7e57C6e1e20468D869Fe33675524e243CD6a0","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x5349E94435Cc9Cab9FfB40A492DA46935052733A","0x16615a85B451edfb6FCBea0b34405D9C7ca1a22A","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]
+        "0x8cdc268e23c0fa073ab3f1b75bd32a2cf05ea1e268a07c1aec44d5805f22fb12"
      values.$pastUpgrades.5.2:
+        ["0x9B1A10bDC4A40219544C835263b2cA3f3e689693","0xA389bF185B301C8e20E79E3098e71399914035dF","0xf002dFBc52C250a2E14C148041aDB8567a0B19BD","0xab458aCbD8FF9B6cF7B8a029705A02F70DCDBf7D","0x8c0f38F13526fCB379a80B87F4DEbdBCC9CAEcbD"]
      values.$pastUpgrades.5.1:
-        ["0x9B1A10bDC4A40219544C835263b2cA3f3e689693","0xA389bF185B301C8e20E79E3098e71399914035dF","0xf002dFBc52C250a2E14C148041aDB8567a0B19BD","0xab458aCbD8FF9B6cF7B8a029705A02F70DCDBf7D","0x8c0f38F13526fCB379a80B87F4DEbdBCC9CAEcbD"]
+        "0x83d729e260c7ac2cf439aa2b8e667454489e4fb8d4965aaa9dc8e2fb95a44f46"
      values.$pastUpgrades.4.2:
+        ["0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc","0x6df4A6D71622860dcc64C1FD9645d9a5BE96f088","0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE","0x389a081BCf20e5803288183b929F08458F1d863D","0xb2097DBe4410B538a45574B1FCD767E2303c7867"]
      values.$pastUpgrades.4.1:
-        ["0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc","0x6df4A6D71622860dcc64C1FD9645d9a5BE96f088","0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE","0x389a081BCf20e5803288183b929F08458F1d863D","0xb2097DBe4410B538a45574B1FCD767E2303c7867"]
+        "0xe246fdfa41030d23e91e4378db8697727da3c321a426a93a0861066cfb875875"
      values.$pastUpgrades.3.2:
+        ["0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc","0x6df4A6D71622860dcc64C1FD9645d9a5BE96f088","0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE","0xc796A402E1B26eCd2cd38F23e05A2f904504ec89","0x389a081BCf20e5803288183b929F08458F1d863D"]
      values.$pastUpgrades.3.1:
-        ["0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc","0x6df4A6D71622860dcc64C1FD9645d9a5BE96f088","0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE","0xc796A402E1B26eCd2cd38F23e05A2f904504ec89","0x389a081BCf20e5803288183b929F08458F1d863D"]
+        "0x07c949f4a829a991f30998c6e89fdd8629fba240aedd59d55896c5c0999b6da4"
      values.$pastUpgrades.2.2:
+        ["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]
      values.$pastUpgrades.2.1:
-        ["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]
+        "0x33a58f3097f84d41ae7f3bd280af6db28d04cd28af362faab164404b463e2791"
      values.$pastUpgrades.1.2:
+        ["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]
      values.$pastUpgrades.1.1:
-        ["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]
+        "0x33a58f3097f84d41ae7f3bd280af6db28d04cd28af362faab164404b463e2791"
      values.$pastUpgrades.0.2:
+        ["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]
      values.$pastUpgrades.0.1:
-        ["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]
+        "0xba8357ad4ef5c48e120daf7c1569d90a803975958df777a4d8132dba6e8ef196"
    }
```

```diff
    contract L1ERC20Bridge_wstETH (0x41527B2d03844dB6b0945f25702cB958b6d55989) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x9a810469F4a451Ebb7ef53672142053b4971587c"]
      values.$pastUpgrades.0.1:
-        ["0x9a810469F4a451Ebb7ef53672142053b4971587c"]
+        "0x51c6da607599f4f5f12d9fce001ede3fb1b94c9e2bd37fb48e081898fabf0020"
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
    +++ description: None
      values.$pastUpgrades.7.2:
+        ["0x8191975d8B0851C7f0740918896Cf298c09aA05E"]
      values.$pastUpgrades.7.1:
-        ["0x8191975d8B0851C7f0740918896Cf298c09aA05E"]
+        "0xb689a0cfff9af4bb1d1da94c404d396f24d5cf5031c31647671549c717cdba7a"
      values.$pastUpgrades.6.2:
+        ["0x810c6598CAaA08B61f6430Df5a8e120B3390d78A"]
      values.$pastUpgrades.6.1:
-        ["0x810c6598CAaA08B61f6430Df5a8e120B3390d78A"]
+        "0x7a9c713189afcfbb07826da5078905f2543da22468f98507e51eac632dc784ce"
      values.$pastUpgrades.5.2:
+        ["0x79Cc1DF74Ac2d1B0876498C9FcE32c7e34F57B43"]
      values.$pastUpgrades.5.1:
-        ["0x79Cc1DF74Ac2d1B0876498C9FcE32c7e34F57B43"]
+        "0xd340a9274753c7f5edd33bc034c08df9e050821d399059c2f6bf0686dd341a87"
      values.$pastUpgrades.4.2:
+        ["0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"]
      values.$pastUpgrades.4.1:
-        ["0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"]
+        "0x9f0e9ecd78b5c17ff95c130b183df452486a0f784705927e608fd90a00aa9bcd"
      values.$pastUpgrades.3.2:
+        ["0x7FB17101A744e156e63d5fF6A4775fb48756577c"]
      values.$pastUpgrades.3.1:
-        ["0x7FB17101A744e156e63d5fF6A4775fb48756577c"]
+        "0x351e42a19944da59b77c2fdd0d5adb58fd0af1cc960e14af3cfae0d686fda478"
      values.$pastUpgrades.2.2:
+        ["0x38ABF296EE79621A225AA85086853b0dA3225D2F"]
      values.$pastUpgrades.2.1:
-        ["0x38ABF296EE79621A225AA85086853b0dA3225D2F"]
+        "0xa462b66e80e973da1eaea5a5bde5a1b4ff6a1a3b29ac4db25922712e71900e80"
      values.$pastUpgrades.1.2:
+        ["0x7e5E66B01fe43293545eaB98ec4D31784A5Efa84"]
      values.$pastUpgrades.1.1:
-        ["0x7e5E66B01fe43293545eaB98ec4D31784A5Efa84"]
+        "0x5fc563e76bc3421166b3898389b72d6a93ac04d94741fc884290d2120ce8cfd0"
      values.$pastUpgrades.0.2:
+        ["0x22bE40122BA952b81c50bcaa86F84418ff623391"]
      values.$pastUpgrades.0.1:
-        ["0x22bE40122BA952b81c50bcaa86F84418ff623391"]
+        "0xbeb9be61e12ebe1e8abcaa0ddd3149cc0282a60af9b11ee2cae50fbcd0adb96e"
    }
```

Generated with discovered.json: 0x27db14f25fed6063264540b67c2b37d01f425f11

# Diff at Mon, 14 Oct 2024 10:58:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20777173
- current block number: 20777173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777173 (main branch discovery), not current.

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      sourceHashes:
+        ["0x33d82f6564cf2a54b6bf9c51d42620b2702ccfa9393f498a5bee57c108a66055"]
    }
```

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      sourceHashes:
+        ["0x46ab6472330f39b5dde71de5fc30609f34ecfa68c11673e09438f6db607279ea","0x9ae32beaa5dc29055f75d3cd08fbec35ed3eee3e2ff35de263a78f7d63c610f9","0xd272def5b4e3f0a68e3019d7d40675ca6d3e3fc35500e9aafe864bce8c697de2","0x419cee160f60572fc9189007ec7c1e3c13e54d80bf1e78f837bc8fa001519685","0xe521f6bd6250a2c92af323768ad8a2274cc334725b5ed8960d8421f063fc3285"]
    }
```

```diff
    contract L1ERC20Bridge_wstETH (0x41527B2d03844dB6b0945f25702cB958b6d55989) {
    +++ description: None
      sourceHashes:
+        ["0x698ae88793265d087e07a445b69bf16b450cdcf636b9073b86221936e912a135","0x8d6377528b46831d215e352a53f276acbd18ec4bc66c04894dd72dad36288c4d"]
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
    +++ description: None
      sourceHashes:
+        ["0x3f8d1d2461c05779ca5de685fd391f6a4c07e91953373effd46d11f72b025dc3","0xddcdd4b758b565f39e4924d6a66afc27850a66e5f1022fb1c008d10f85af1028"]
    }
```

```diff
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604) {
    +++ description: None
      sourceHashes:
+        ["0xb36dfb10be7530bb56af796b85f6c84bf90513603fe59c2f7f0d78fc2a9a9235"]
    }
```

```diff
    contract ValidatorTimelockOld (0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD) {
    +++ description: None
      sourceHashes:
+        ["0x2aff1337a5d8a9be27e6d384ec8a2efd746fb4b73195773c82f3e42e2210c8ed"]
    }
```

Generated with discovered.json: 0x72f5d92fd316fdb7f061934a187e7f72cfe50aee

# Diff at Tue, 01 Oct 2024 11:12:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20777173
- current block number: 20777173

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777173 (main branch discovery), not current.

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-02-13T19:09:35.000Z",["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]],["2023-03-23T18:01:59.000Z",["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]],["2023-03-23T18:01:59.000Z",["0xC48d496459e1358D055a79173BEA41efb7449028","0xc30af84A6aFF43D5fd06FEdA6bA20BdfeD539F6C","0x2EA0CFB9C942058ee5A84411EF2E37C6DE5bfe5c","0x98E900Eb2e5fdE9786f736e86d6BFBfDb3E4683b","0xa7E8a8F71c3cC43946601CC99997f8Cd6828a9B9"]],["2023-03-23T19:15:35.000Z",["0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc","0x6df4A6D71622860dcc64C1FD9645d9a5BE96f088","0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE","0xc796A402E1B26eCd2cd38F23e05A2f904504ec89","0x389a081BCf20e5803288183b929F08458F1d863D"]],["2023-04-24T20:03:11.000Z",["0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc","0x6df4A6D71622860dcc64C1FD9645d9a5BE96f088","0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE","0x389a081BCf20e5803288183b929F08458F1d863D","0xb2097DBe4410B538a45574B1FCD767E2303c7867"]],["2023-08-16T10:15:11.000Z",["0x9B1A10bDC4A40219544C835263b2cA3f3e689693","0xA389bF185B301C8e20E79E3098e71399914035dF","0xf002dFBc52C250a2E14C148041aDB8567a0B19BD","0xab458aCbD8FF9B6cF7B8a029705A02F70DCDBf7D","0x8c0f38F13526fCB379a80B87F4DEbdBCC9CAEcbD"]],["2023-08-29T08:28:11.000Z",["0xc6f7e57C6e1e20468D869Fe33675524e243CD6a0","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x5349E94435Cc9Cab9FfB40A492DA46935052733A","0x16615a85B451edfb6FCBea0b34405D9C7ca1a22A","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]],["2023-09-07T10:53:11.000Z",["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]],["2023-09-22T17:22:47.000Z",["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]],["2023-10-20T16:15:35.000Z",["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]],["2023-11-01T16:41:35.000Z",["0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4","0x7444DE636699F080cA1C033528D2bB3705B391Ce","0x62aA95ac4740A367746A664C4C69034d52E968EF","0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b","0x2E64926BE35412f7710A3E097Ba076740bF97CC0"]],["2023-12-04T20:29:11.000Z",["0x409560DE546e057ce5bD5dB487EdF2bB5E785baB","0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4","0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08","0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"]],["2023-12-21T11:51:35.000Z",["0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967","0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7","0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58","0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"]],["2024-02-05T14:30:47.000Z",["0xE6426c725cB507168369c10284390E59d91eC821","0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B","0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB","0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"]],["2024-03-11T14:32:11.000Z",["0x230214F0224C7E0485f348a79512ad00514DB1F7","0x10113bB3a8e64f8eD67003126adC8CE74C34610c","0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7","0xfd3779e6214eBBd40f5F5890351298e123A46BA6"]],["2024-03-12T23:16:23.000Z",["0x230214F0224C7E0485f348a79512ad00514DB1F7","0x10113bB3a8e64f8eD67003126adC8CE74C34610c","0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7","0xfd3779e6214eBBd40f5F5890351298e123A46BA6"]],["2024-06-06T11:55:23.000Z",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]],["2024-08-06T09:50:47.000Z",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]]]
      values.$upgradeCount:
+        18
    }
```

```diff
    contract L1ERC20Bridge_wstETH (0x41527B2d03844dB6b0945f25702cB958b6d55989) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-10-23T12:49:11.000Z",["0x9a810469F4a451Ebb7ef53672142053b4971587c"]]]
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-02-14T10:31:23.000Z",["0x22bE40122BA952b81c50bcaa86F84418ff623391"]],["2023-03-23T19:49:59.000Z",["0x7e5E66B01fe43293545eaB98ec4D31784A5Efa84"]],["2023-04-25T12:37:35.000Z",["0x38ABF296EE79621A225AA85086853b0dA3225D2F"]],["2023-08-16T10:21:35.000Z",["0x7FB17101A744e156e63d5fF6A4775fb48756577c"]],["2023-12-04T20:29:11.000Z",["0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"]],["2023-12-22T10:57:59.000Z",["0x79Cc1DF74Ac2d1B0876498C9FcE32c7e34F57B43"]],["2024-02-08T10:36:47.000Z",["0x810c6598CAaA08B61f6430Df5a8e120B3390d78A"]],["2024-06-06T13:20:35.000Z",["0x8191975d8B0851C7f0740918896Cf298c09aA05E"]]]
    }
```

Generated with discovered.json: 0x8fd65efb4e653157e98805805d5ef5c70eaf8190

# Diff at Mon, 16 Sep 2024 15:02:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ca08843b12ed576cbcc139ad58ca045f72d96ab5 block: 20663804
- current block number: 20763938

## Description

Discovery rerun on the same block number with only config-related changes.
Generated with discovered.json: 0x7b0898b1b7bc0e395ac622b07984a65391d7141e

# Diff at Sun, 15 Sep 2024 09:49:19 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@f3f080827a9c9144630c7d8b5f28745b2029ead2 block: 20663804
- current block number: 20755221

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20663804 (main branch discovery), not current.

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      values.validators.1:
+        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

```diff
    contract ValidatorTimelockOld (0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD) {
    +++ description: None
      name:
-        "ValidatorTimelock_deprecated"
+        "ValidatorTimelockOld"
    }
```

```diff
+   Status: CREATED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

Generated with discovered.json: 0x5270c251c79965be07e9177540990f860f341e6d

# Diff at Fri, 23 Aug 2024 09:56:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20568363
- current block number: 20568363

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20568363 (main branch discovery), not current.

```diff
    contract L1ERC20Bridge_wstETH (0x41527B2d03844dB6b0945f25702cB958b6d55989) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
    +++ description: None
      values.$upgradeCount:
+        8
    }
```

Generated with discovered.json: 0xa78edb0e13f75aefdf487a6a4a87de5623550883

# Diff at Tue, 20 Aug 2024 07:32:29 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@5417c4717b5cefeed17cd8419a7eb2dda22d4206 block: 20469560
- current block number: 20568363

## Description

Added discovery for DA mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20469560 (main branch discovery), not current.

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      values.daMode:
+        0
    }
```

Generated with discovered.json: 0x57f2c0f38f6fa42d0bfd67cdc3ae06d13b7ecefe

# Diff at Tue, 06 Aug 2024 12:34:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@08572cac0b099c9871f6e5b417260b029c0e9393 block: 20432407
- current block number: 20469560

## Description

The admin- and protocolVersion of ZKsync diamond are changed. (No code changes)
The new ChainAdmin is used as admin (but is owned by the known Matter Labs Multisig), so there are no net changes in permissions.

## Watched changes

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      values.getAdmin:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0x2cf3bD6a9056b39999F3883955E183F655345063"
+++ description: Protocol version, increments with each protocol change
+++ severity: MEDIUM
      values.getProtocolVersion:
-        103079215105
+        103079215106
      values.getSemverProtocolVersion.2:
-        1
+        2
    }
```

Generated with discovered.json: 0xadd226712f2ce745b2bab01dc437bbdc95f8bccf

# Diff at Wed, 31 Jul 2024 10:33:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d56d4dbb204689f1599b0e3bb6de495651bd8c62 block: 20389678
- current block number: 20425965

## Description

Move to shared config --> `shared-zk-stack`.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389678 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828)
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
```

```diff
-   Status: DELETED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB)
    +++ description: None
```

Generated with discovered.json: 0x62852440703eb0ddd632a1f505f860b7a865134b

# Diff at Tue, 30 Jul 2024 11:16:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20389678
- current block number: 20389678

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389678 (main branch discovery), not current.

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      fieldMeta:
+        {"minDelay":{"severity":"MEDIUM","description":"Minimum delay for scheduled upgrades"},"owner":{"severity":"HIGH","description":"This owner role has all permissions in absence of a security council"},"pendingOwner":{"severity":"HIGH","description":"Pending owner can be set by current owner and accept or renounce ownership"},"securityCouncil":{"severity":"HIGH","description":"Address of the security council, change Governance section if this differs from the null address"}}
    }
```

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      fieldMeta:
+        {"chainsCreated":{"description":"All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs."}}
    }
```

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      fieldMeta:
+        {"txFilterer":{"severity":"HIGH","description":"Optional: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2."},"getProtocolVersion":{"severity":"MEDIUM","description":"Protocol version, increments with each protocol change"},"getVerifierParams":{"severity":"LOW","description":"Verifier parameters used for proving batches"}}
    }
```

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      fieldMeta:
+        {"getOwners":{"severity":"LOW","description":"Signers of the multisig"},"getThreshold":{"severity":"HIGH","description":"Should be 4/8 per official docs"}}
    }
```

Generated with discovered.json: 0xde5376b773eecea543f6c653d6459e9c88a5b0bb

# Diff at Fri, 26 Jul 2024 08:58:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20319585
- current block number: 20389678

## Description

Matter Labs Multisig changes one signer, and removes another.

## Watched changes

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      values.$multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 7 (57%)"
+++ description: Signers of the multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.7:
-        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
+++ description: Signers of the multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.6:
-        "0x1567AC0764142e91aB0A9C65C568f0DbE9E168BF"
+        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
+++ description: Signers of the multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.5:
-        "0x9dF8bc0918F357c766A5697E031fF5237c05747A"
+        "0xfd03dA3aeb6807a98db96C1704Ea4CFf031BaEd2"
+++ description: Signers of the multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.4:
-        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
+        "0x9dF8bc0918F357c766A5697E031fF5237c05747A"
+++ description: Signers of the multisig
+++ type: PERMISSION
+++ severity: LOW
      values.getOwners.3:
-        "0x84298D79ad2CD4eC0d9Ca1959F9d9f40Bc07152f"
+        "0x702caCafA54B88e9c54449563Fb2e496e85c78b7"
    }
```

Generated with discovered.json: 0xbbd3ea3917e6834c4b3e76bfd7d8ab7af9d48fb8

# Diff at Tue, 16 Jul 2024 14:11:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f93ad7c5065058eed2c863b02558bd19734146e6 block: 20261948
- current block number: 20319585

## Description

Decode scheduled transactions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20261948 (main branch discovery), not current.

```diff
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    +++ description: None
      values.scheduledTransactions:
+        [{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"acceptGovernor","inputs":[]},{"target":"0xa0425d71cB1D6fb80E65a5361a04096E0672De03","value":"0","function":"acceptOwnership","inputs":[]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"executeUpgrade","inputs":[{"name":"_diamondCut","value":[[["0x0000000000000000000000000000000000000000",2,false,["0x0e18b681","0xe58bb639","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d","0x17338945"]],["0x0000000000000000000000000000000000000000",2,false,["0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0xa7cd63b7","0x79823c9a","0x4fc07d75","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0x8665b150","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]],["0x0000000000000000000000000000000000000000",2,false,["0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419"]],["0x0000000000000000000000000000000000000000",2,false,["0x701f58c5","0xc3d93e7c","0x7f61885c","0x97c09d34"]],["0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967",0,false,["0x0e18b681","0xe58bb639","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d","0x17338945"]],["0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7",0,false,["0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0x79823c9a","0x4fc07d75","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0x8665b150","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]],["0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58",0,true,["0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419"]],["0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d",0,true,["0x701f58c5","0xc3d93e7c","0x7f61885c","0x97c09d34"]]],"0x75dE2E1ABB12Bc54A5aB04b2761AFc083Be54dC5","0x1ed824a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000168001000831ba7021800f5d9103772fcc7463ed7e764a2a3624cacca6b3826172d00100055bf7f1bc4237c2be24252fb6737cc235194139e544933c1dbf25c24ee8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016a000000000000000000000000000000000000000000000000000000000000016c0000000000000000000000000000000000000000000000000000000006581a1e00000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fe0000000000000000000000000000000000000000000000000000000000008007000000000000000000000000000000000000000000000000000000000000800600000000000000000000000000000000000000000000000000000000044aa200000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000130000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000001460000000000000000000000000000000000000000000000000000000000000148000000000000000000000000000000000000000000000000000000000000014a000000000000000000000000000000000000000000000000000000000000014c000000000000000000000000000000000000000000000000000000000000011c4e9f18c170000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000004c000000000000000000000000000000000000000000000000000000000000005800000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000007c0000000000000000000000000000000000000000000000000000000000000088000000000000000000000000000000000000000000000000000000000000009400000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000ac00000000000000000000000000000000000000000000000000000000000000b800000000000000000000000000000000000000000000000000000000000000c400000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000dc00000000000000000000000000000000000000000000000000000000000000e800000000000000000000000000000000000000000000000000000000000000f40000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010c001000007f845e3f2ab16646632231e4fee11627449b45067fa0e7c76ba114d0600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100001147fcb33fbc266df8067be8b51d68ad9362a6204de5a6b2279c613d1200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000179d3c90b59acbc8fbda5ba2389cc80dfa840840e5183d44ea3c9b013100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100008f337dc5cc92411071569be5cd4bfd755adf20021c8a0e316c4834c4ef00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000d941fe2d54aa725915db7d63795e02ced38fa2709d736631e30792ccb200000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000007f845e3f2ab16646632231e4fee11627449b45067fa0e7c76ba114d0600000000000000000000000000000000000000000000000000000000000080010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000075c32c6af70ed4fd798a3fca41f2984e7440e2d2937858d700637e065500000000000000000000000000000000000000000000000000000000000080020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000e52e563c15152eb655ea2d1b633c1409b61afa74065d05e93107a7e22300000000000000000000000000000000000000000000000000000000000080030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100007d4be0212415ae3920fbd92c2547f5419ac8da07bb7e29488472a434a200000000000000000000000000000000000000000000000000000000000080040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100003d467f114197fad7d1e6bb58867710524d5c8d200558a213f5429cbf8400000000000000000000000000000000000000000000000000000000000080050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100055578bdf1a737843d2278c672bfa9be2c17183a7e9b00052845aa5d240a00000000000000000000000000000000000000000000000000000000000080060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100028debc3f96ddf2c6630fb28ac7b4ae198ad453fdc08df2e81e6d2a4aa0b00000000000000000000000000000000000000000000000000000000000080080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000063d13c3fdbd042669053befb649f89c1dd0de3d7a0542486e89b6a7f0000000000000000000000000000000000000000000000000000000000000080090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000101dbb3209311751d4f335ac6909943e19a1c3d26cdd27db01adb509db0000000000000000000000000000000000000000000000000000000000000800a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000181e472c23b9b5e9b971dec1971183ab06fb5932ea469ee207cc4a668da000000000000000000000000000000000000000000000000000000000000800b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010007c95cdffb79ed99ad5fb842d3bab4084e2d49028df8ee3f7c2d543f7ebe000000000000000000000000000000000000000000000000000000000000800c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100001752ddb6f7d76adaf32594816c0bda5b9c17d6fd86e90a06acba2e4cb6000000000000000000000000000000000000000000000000000000000000800d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010001670943abd41e5b14499ae7bd0b99406a7d3cc406d9251c138d87f573c0000000000000000000000000000000000000000000000000000000000000800e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000055de10df9214a2628ab870a3bc2154a6e7f8c0479a7bad15c875aec050000000000000000000000000000000000000000000000000000000000000800f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000021e3954694ddb9479f31cabe797467b4ea3b92ab64fd81e9b5e53f130000000000000000000000000000000000000000000000000000000000000080100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"183600000000000000","function":"requestL2Transaction","inputs":[{"name":"_contractL2","value":"0x11f943b2c77b743AB90f4A0Ae7d5A4e7FCA3E102"},{"name":"_l2Value","value":0},{"name":"_calldata","value":"0x3659cfe6000000000000000000000000924c0e6cad37f708abfec777ef93cb6cbe490f0a"},{"name":"_l2GasLimit","value":72000000},{"name":"_l2GasPerPubdataByteLimit","value":800},{"name":"_factoryDeps","value":[]},{"name":"_refundRecipient","value":"0x043DA37F21c4C83b97b546724c75600c2D0C9E16"}]},{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"183600000000000000","function":"requestL2Transaction","inputs":[{"name":"_contractL2","value":"0x1Eb710030273e529A6aD7E1e14D4e601765Ba3c6"},{"name":"_l2Value","value":0},{"name":"_calldata","value":"0x3659cfe60000000000000000000000009a8de191644140bd874f911359b5d15bb18f8a58"},{"name":"_l2GasLimit","value":72000000},{"name":"_l2GasPerPubdataByteLimit","value":800},{"name":"_factoryDeps","value":[]},{"name":"_refundRecipient","value":"0x043DA37F21c4C83b97b546724c75600c2D0C9E16"}]},{"target":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063","value":"0","function":"upgradeTo","inputs":[{"name":"newImplementation","value":"0x79Cc1DF74Ac2d1B0876498C9FcE32c7e34F57B43"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"executeUpgrade","inputs":[{"name":"_diamondCut","value":[[["0x0000000000000000000000000000000000000000",2,false,["0x0e18b681","0xe58bb639","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d","0x17338945"]],["0x0000000000000000000000000000000000000000",2,false,["0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0x79823c9a","0x4fc07d75","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0x8665b150","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]],["0x0000000000000000000000000000000000000000",2,false,["0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419"]],["0x0000000000000000000000000000000000000000",2,false,["0x701f58c5","0xc3d93e7c","0x7f61885c","0x97c09d34"]],["0xE6426c725cB507168369c10284390E59d91eC821",0,false,["0x0e18b681","0xe58bb639","0x64bf8d66","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d","0x17338945"]],["0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B",0,false,["0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0x79823c9a","0x4fc07d75","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0x8665b150","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]],["0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB",0,true,["0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419"]],["0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a",0,true,["0x701f58c5","0xc3d93e7c","0x7f61885c","0x97c09d34"]]],"0x38283BE1B217873DDacb599e727669E88c8f36C7","0x1ed824a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000001060010007ed0e328b940e241f7666a6303b7ffd4e3fd7e8c154d6e7556befe6cd6d0100055b7a8be90522251be8be1a186464d056462973502ac8a0437c85e4d2a90000000000000000000000003390051435ecb25a9610a1cf17d1ba0a228a05605a3ef282b21e12fe1f4438e5bb158fc5060b160559c5158c6389d62d9fe3d080062362cb3eaf1f631406cbe19bf2a2c5d0d9ea69d069309a6003addae9f387be0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000108000000000000000000000000000000000000000000000000000000000000010a00000000000000000000000000000000000000000000000000000000065c0a3900000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fe0000000000000000000000000000000000000000000000000000000000008007000000000000000000000000000000000000000000000000000000000000800600000000000000000000000000000000000000000000000000000000044aa200000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000e400000000000000000000000000000000000000000000000000000000000000e600000000000000000000000000000000000000000000000000000000000000e800000000000000000000000000000000000000000000000000000000000000ea00000000000000000000000000000000000000000000000000000000000000ba4e9f18c170000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d00000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003e000000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000000000560000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000006e000000000000000000000000000000000000000000000000000000000000007a00000000000000000000000000000000000000000000000000000000000000860000000000000000000000000000000000000000000000000000000000000092000000000000000000000000000000000000000000000000000000000000009e00000000000000000000000000000000000000000000000000000000000000aa001000075bc9de2129f5d58efa04515bbf24610645546eab19192d7f94a23f83e00000000000000000000000000000000000000000000000000000000000080020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000e5eef000fb93f3b7f746149d0f467fe99e0f628aa76520b18321eeb7b300000000000000000000000000000000000000000000000000000000000080030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100007d88348c8092dd260d3ba1b90da3d693c5d416b7078b2faca348e2f3a800000000000000000000000000000000000000000000000000000000000080040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100003ddb0142c77e7e36c37910cd90b07e48bb952168e66c79519953d32d5700000000000000000000000000000000000000000000000000000000000080050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000555b2471aa863b7da5360cc0d2459a8aa5ad9feb6ad8ea5666aee0b5f4c00000000000000000000000000000000000000000000000000000000000080060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100028d5519113834685985178f33d36dd855e0b0835e2dad3892ddc3244d8000000000000000000000000000000000000000000000000000000000000080080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000063cb83b923ab1e67bb7944c6493286ba7c1c5614c0cb17155c5eef82d900000000000000000000000000000000000000000000000000000000000080090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010001014336cee5c792682bf2c2079807e643c491d879c07de9dea482a78e39000000000000000000000000000000000000000000000000000000000000800a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000181b1c963c230c8521d78a0a650cf7c1879cc6b38e9315035c5596cd914000000000000000000000000000000000000000000000000000000000000800b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010007c96884dfd5de1a2e02616564c057e67c423d31c589df25bf25b08dd3d6000000000000000000000000000000000000000000000000000000000000800c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000167b75441cbdf3edc039678e2e57bb28d87ca3b76c88ba153be0e65f366000000000000000000000000000000000000000000000000000000000000800e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000553156325702c61297c4ebe6171f7d64845d548311e0fe88792cd86841000000000000000000000000000000000000000000000000000000000000800f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100000fb004b644efe76e9ef3ba89dfa3eaac946e3fa19f8a046ed27465eeef00000000000000000000000000000000000000000000000000000000000080100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"153000000000000000","function":"requestL2Transaction","inputs":[{"name":"_contractL2","value":"0x11f943b2c77b743AB90f4A0Ae7d5A4e7FCA3E102"},{"name":"_l2Value","value":0},{"name":"_calldata","value":"0x3659cfe60000000000000000000000004f87ac9ab720bb47073a236b42c245fe30e225d5"},{"name":"_l2GasLimit","value":72000000},{"name":"_l2GasPerPubdataByteLimit","value":800},{"name":"_factoryDeps","value":[]},{"name":"_refundRecipient","value":"0x112A673160540a35a8b1B41c582ee4CE4995a5Ca"}]},{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"153000000000000000","function":"requestL2Transaction","inputs":[{"name":"_contractL2","value":"0x1Eb710030273e529A6aD7E1e14D4e601765Ba3c6"},{"name":"_l2Value","value":0},{"name":"_calldata","value":"0x3659cfe60000000000000000000000001f13810c6ffc29a9a26456f1d8541e4631178eab"},{"name":"_l2GasLimit","value":72000000},{"name":"_l2GasPerPubdataByteLimit","value":800},{"name":"_factoryDeps","value":[]},{"name":"_refundRecipient","value":"0x112A673160540a35a8b1B41c582ee4CE4995a5Ca"}]},{"target":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063","value":"0","function":"upgradeTo","inputs":[{"name":"newImplementation","value":"0x810c6598CAaA08B61f6430Df5a8e120B3390d78A"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"executeUpgrade","inputs":[{"name":"_diamondCut","value":[[["0x0000000000000000000000000000000000000000",2,false,["0x0e18b681","0xe58bb639","0x64bf8d66","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d","0x17338945"]],["0x0000000000000000000000000000000000000000",2,false,["0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0x79823c9a","0x4fc07d75","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0x8665b150","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]],["0x0000000000000000000000000000000000000000",2,false,["0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419"]],["0x0000000000000000000000000000000000000000",2,false,["0x701f58c5","0xc3d93e7c","0x7f61885c","0x97c09d34"]],["0x230214F0224C7E0485f348a79512ad00514DB1F7",0,false,["0x0e18b681","0xe58bb639","0x64bf8d66","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d","0x17338945"]],["0x10113bB3a8e64f8eD67003126adC8CE74C34610c",0,false,["0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0x79823c9a","0x4fc07d75","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0x8665b150","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]],["0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7",0,true,["0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419"]],["0xfd3779e6214eBBd40f5F5890351298e123A46BA6",0,true,["0x701f58c5","0xc3d93e7c","0x7f61885c","0x97c09d34"]]],"0x2cEF8ff7a1B327C7AC7aF249645249d84Cc724db","0x1ed824a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000001060010007ede999d096c84553fb514d3d6ca76fbf39789dda76bfeda9f3ae06236e0100055b041eb28aff6e3a6e0f37c31fd053fc9ef142683b05e5f0aee6934066000000000000000000000000dd9c826196cf3510b040a8784d85ae36674c7ed2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000108000000000000000000000000000000000000000000000000000000000000010a00000000000000000000000000000000000000000000000000000000065eec8100000000000000000000000000000000000000000000000000000000000000015000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fe0000000000000000000000000000000000000000000000000000000000008007000000000000000000000000000000000000000000000000000000000000800600000000000000000000000000000000000000000000000000000000044aa200000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000150000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000e400000000000000000000000000000000000000000000000000000000000000e600000000000000000000000000000000000000000000000000000000000000e800000000000000000000000000000000000000000000000000000000000000ea00000000000000000000000000000000000000000000000000000000000000ba4e9f18c170000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d00000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003e000000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000000000560000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000006e000000000000000000000000000000000000000000000000000000000000007a00000000000000000000000000000000000000000000000000000000000000860000000000000000000000000000000000000000000000000000000000000092000000000000000000000000000000000000000000000000000000000000009e00000000000000000000000000000000000000000000000000000000000000aa00100007537b226f7de4103e8c2d1df831e990ff722dc3aca654fd45ce61bd2ec00000000000000000000000000000000000000000000000000000000000080020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000e53b54bc7d1e273de73918fe1b12123c61e0fb0c1ab2ac94839d31102900000000000000000000000000000000000000000000000000000000000080030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100007d0340c8a63df15d428ff5ab8acc61c74e67874c5252656ff9a694aacf00000000000000000000000000000000000000000000000000000000000080040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100003d5fe89ded57edee93a69c969ad6f43a4fcf22dc24f0b8742f27e0410f00000000000000000000000000000000000000000000000000000000000080050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010005559dd27f9279b39dce0350dbef9636e743b7f00edf49b40f23b90e523b00000000000000000000000000000000000000000000000000000000000080060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010002af715306a32366b81dee75e9f888355e430bfe591228314b08ce2d77d900000000000000000000000000000000000000000000000000000000000080080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000632c2595abece956e70cf98f7f95672588c636500ebfee820547ff723d00000000000000000000000000000000000000000000000000000000000080090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000101390b0b7b816627d366d34fe732328fafc6ba339be74376c6219d3a3f000000000000000000000000000000000000000000000000000000000000800a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000181520b3a64b82e423d221b35739c35c0021e586e911531b6987c33562d000000000000000000000000000000000000000000000000000000000000800b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010007c975f78e50264c2d3b4deb89cbbb04a04a105dd3524848bad5329948f2000000000000000000000000000000000000000000000000000000000000800c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000167fb76a165404d403ea1d5853cdefe4e71b93d595125f7576981381919000000000000000000000000000000000000000000000000000000000000800e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100005589186a7446ebd5e1d568dada8f903693ea9daa75b010981f3e9e2585000000000000000000000000000000000000000000000000000000000000800f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000472947f34d576bdcf99b520fa40c159e32ddce9fc600d65e2469f6a26700000000000000000000000000000000000000000000000000000000000080110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"setValidator","inputs":[{"name":"_validator","value":"0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD"},{"name":"_active","value":true}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"setValidator","inputs":[{"name":"_validator","value":"0xa0425d71cB1D6fb80E65a5361a04096E0672De03"},{"name":"_active","value":false}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"executeUpgrade","inputs":[{"name":"_diamondCut","value":[[],"0x75dE2E1ABB12Bc54A5aB04b2761AFc083Be54dC5","0x1ed824a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005a3ef282b21e12fe1f4438e5bb158fc5060b160559c5158c6389d62d9fe3d080400a4b532c6f072c00d1806ef299300d4c104f4ac55bd8698ade78894fcadc0a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004c000000000000000000000000000000000000000000000000000000000000004e00000000000000000000000000000000000000000000000000000000065f08f4a00000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"273600000000000000","function":"requestL2Transaction","inputs":[{"name":"_contractL2","value":"0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"},{"name":"_l2Value","value":0},{"name":"_calldata","value":"0xb71bcf9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001542726964676564205553444320287a6b53796e632900000000000000000000000000000000000000000000000000000000000000000000000000000000000006555344432e650000000000000000000000000000000000000000000000000000"},{"name":"_l2GasLimit","value":72000000},{"name":"_l2GasPerPubdataByteLimit","value":800},{"name":"_factoryDeps","value":[]},{"name":"_refundRecipient","value":"0xC301f8B2a2C08958E6e7a286AB49A986c1f7ef6A"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xc2d7a7Bd59a548249e64C1a587220c0E4F6F439E","value":"0","function":"acceptOwnership","inputs":[]},{"target":"0x280372beAAf440C52a2ed893daa14CDACc0422b8","value":"0","function":"acceptOwnership","inputs":[]},{"target":"0x241F19eA8CcD04515b309f1C9953A322F51891FC","value":"0","function":"acceptOwnership","inputs":[]},{"target":"0x5B5c82f4Da996e118B127880492a23391376F65c","value":"0","function":"acceptOwnership","inputs":[]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","value":"0","function":"acceptOwnership","inputs":[]},{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"acceptOwnership","inputs":[]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"acceptOwnership","inputs":[]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"acceptOwnership","inputs":[]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","value":"0","function":"acceptAdmin","inputs":[]},{"target":"0x303a465B659cBB0ab36eE643eA362c509EEb5213","value":"0","function":"acceptAdmin","inputs":[]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"0","function":"executeUpgrade","inputs":[{"name":"_diamondCut","value":[[["0x0000000000000000000000000000000000000000",2,false,["0x0e18b681","0xe58bb639","0x64bf8d66","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d","0x17338945"]],["0x0000000000000000000000000000000000000000",2,false,["0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0x79823c9a","0x4fc07d75","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0x8665b150","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]],["0x0000000000000000000000000000000000000000",2,false,["0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419"]],["0x0000000000000000000000000000000000000000",2,false,["0x701f58c5","0xc3d93e7c","0x7f61885c","0x97c09d34"]],["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a",0,false,["0x0e18b681","0x64bf8d66","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0x1cc5d103","0xbe6f11cf","0xe76db865","0x235d9eb5","0x21f603d7","0x4623c91d","0x17338945","0xfc57565f"]],["0xE60E94fCCb18a81D501a38959E532C0A85A1be89",0,false,["0x1de72e34","0xea6c029c","0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0x6e9960c3","0x98acd7a6","0x086a56f8","0x3591c1a0","0x79823c9a","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0xd0468156","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0x06d49e5b","0xf5c1182c","0x5518c73b","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]],["0xCDB6228b616EEf8Df47D69A372C4f725C43e718C",0,true,["0x12f43dab","0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419","0xc924de35"]],["0xaD193aDe635576d8e9f7ada71Af2137b16c64075",0,true,["0x701f58c5","0x6edd4f12","0xc3d93e7c","0x6f497ac6","0x7f61885c","0xc37533bb","0x97c09d34","0x0f23da43"]]],"0xD719fca4433646CBD86F6b073EE364D36b856b1D","0x08284e57000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000001ac0010008e742608b21bf7eb23c1a9d0602047e3618b464c9b59c0fba3b3d7ab66e01000563374c277a2c1e34659a2a1e87371bb6d852ce142022d497bfb50b9e3200000000000000000000000070f3fbf8a427155185ec90bed8a3434203de9604f520cd5b37e74e19fdb369c8d676a04dce8a19457497ac6686d2bb95d94109c8f9664f4324c1400fa5c3822d667f30e873f53f1b8033180cd15fe41c1e2355c600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001ae00000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000066615060000000000000000000000000000000000000000000000000000000180000000100000000000000000000000000000000000000000000000000000000000000fe0000000000000000000000000000000000000000000000000000000000008007000000000000000000000000000000000000000000000000000000000000800600000000000000000000000000000000000000000000000000000000044aa2000000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000018c000000000000000000000000000000000000000000000000000000000000018e0000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000019200000000000000000000000000000000000000000000000000000000000001624e9f18c1700000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003e000000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000000000560000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000006e000000000000000000000000000000000000000000000000000000000000007a00000000000000000000000000000000000000000000000000000000000000860000000000000000000000000000000000000000000000000000000000000092000000000000000000000000000000000000000000000000000000000000009e00000000000000000000000000000000000000000000000000000000000000aa00000000000000000000000000000000000000000000000000000000000000b600000000000000000000000000000000000000000000000000000000000000c200000000000000000000000000000000000000000000000000000000000000ce00000000000000000000000000000000000000000000000000000000000000da00000000000000000000000000000000000000000000000000000000000000e600000000000000000000000000000000000000000000000000000000000000f200000000000000000000000000000000000000000000000000000000000000fe000000000000000000000000000000000000000000000000000000000000010a00000000000000000000000000000000000000000000000000000000000001160000000000000000000000000000000000000000000000000000000000000122000000000000000000000000000000000000000000000000000000000000012e000000000000000000000000000000000000000000000000000000000000013a0000000000000000000000000000000000000000000000000000000000000146000000000000000000000000000000000000000000000000000000000000015200100000781e55a60f3f14fd7dd67e3c8caab896b7b0fca4a662583959299eede00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100001112e34172b2bc31574d155893a087a1cf4b608cf9895a2201ea7bd6ee00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100001752dc8a1a374a6346781205017b7b594d97c28812265865f3a45fcb4500000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000872dd7e2dc1b34416c174086aa84fd80c78acc7b670214da955bd5572800000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000bd8bd7ab008f76e359dc296ff5fe0e8a95fedce1d570943e90143acdfd00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000f1b3432a32f9fba2115f5dd3b0ee8127e7bf2c609d57d3e231f19119c4300000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100000781e55a60f3f14fd7dd67e3c8caab896b7b0fca4a662583959299eede00000000000000000000000000000000000000000000000000000000000080010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100007549287362e4263ea5b204f01fc3c7f2ac09d71e6eb21029698220f01a00000000000000000000000000000000000000000000000000000000000080020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000e563d4ad7b4822cc19d8f74f2c41ee3d3153379be4b02b27d4498d52b600000000000000000000000000000000000000000000000000000000000080030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100007d82d4a2eb62e539e3c89cc641f507132b247022ba05ef1ddfed2b007300000000000000000000000000000000000000000000000000000000000080040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100003de00c5ceaa3fdf4566a9822ce94abe676f68b17a6ae11c453e14455fd00000000000000000000000000000000000000000000000000000000000080050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010005215fda00bfbf95847a13078bd16cdcb1b875534261c1dda9940c7754fe00000000000000000000000000000000000000000000000000000000000080060000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010002b97ebf3c481ead775617590ffca139bee428e443aa49eb38b6a5b8365700000000000000000000000000000000000000000000000000000000000080080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000695a1e821b6d5fcb25e25793b81de0bdca3ff8277e3ac93a38e729e0a100000000000000000000000000000000000000000000000000000000000080090000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010001039329e4bb55b24531c7e7d27ed40d2c82ad145033fdd5ed5b8ea86cf3000000000000000000000000000000000000000000000000000000000000800a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010001b3f2c3a6bdd5ad00ae29a7cbbb32dca3c31fb608b5cd52f8f3056a3847000000000000000000000000000000000000000000000000000000000000800b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010007d1e53f2dca05f7e27ae5b7062291ed3a1470ca511140b8e786aae7eb77000000000000000000000000000000000000000000000000000000000000800c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000010000159a3a08da3ac57cdefec0e9e30da60456bc5643134cf16d6957bcf1ac000000000000000000000000000000000000000000000000000000000000800d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000179842b5aa1c76036f5b90652fe614dacb28438a89649d6ca48131bd402000000000000000000000000000000000000000000000000000000000000800e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000055c1f27b8316ba61bf07959b11cf3b2a418aa357ccc5531c0914a2da27000000000000000000000000000000000000000000000000000000000000800f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100000f248e111a1b587fef850dc4585c39af2dd505bc8a0d5cc6d3fcc7ed3c00000000000000000000000000000000000000000000000000000000000080100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000023b02bbb21baf1367835e56ae17b82688527dc8f78caf34b12e670ee6500000000000000000000000000000000000000000000000000000000000080120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100001169cd6aa311c1bc9bbe2e7dd085720c96bb197e3223be7e9c66e46ef900000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000001000049eb6d79244e74e5286ed4d3f6eef2b5eb746b67d98691dbc28fa1698400000000000000000000000000000000000000000000000000000000000080110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000100004bc85f45ebf0f0bf004752bcbff1bb99792d6cc6494227970ec77fe53b00000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000144000000000000000000000000303a465b659cbb0ab36ee643ea362c509eeb5213000000000000000000000000c2ee6b6af7d616f6e27ce7f4a451aedc2b0f5f5c000000000000000000000000d7f9f54194c633f36ccd5f3da84ad4a1c38cb2cb0000000000000000000000000b622a2061eaccae1c664ebc3e868b8438e03f610000000000000000000000005d8ba173dc6c3c90c8f7c04c9288bef5fdbad06e"]}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0x32400084C286CF3E17e7B677ea9583e60a000324","value":"456000000048000000","function":"requestL2Transaction","inputs":[{"name":"_contractL2","value":"0x11f943b2c77b743AB90f4A0Ae7d5A4e7FCA3E102"},{"name":"_l2Value","value":0},{"name":"_calldata","value":"0x4f1ef286000000000000000000000000470afaacce2acdaefcc662419b74c79d76c914ae00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000084a31ee5b0000000000000000000000000d7f9f54194c633f36ccd5f3da84ad4a1c38cb2cb00000000000000000000000057891966931eb4bb6fb81430e6ce0a03aabde063010001211b0c33353cdf7a320f768e3dc40bce1326d639fcac099bba9ecd8e340000000000000000000000001c732a2061eaccae1c664ebc3e868b8438e0507200000000000000000000000000000000000000000000000000000000"},{"name":"_l2GasLimit","value":72000000},{"name":"_l2GasPerPubdataByteLimit","value":800},{"name":"_factoryDeps","value":[]},{"name":"_refundRecipient","value":"0x343Ee72DdD8CCD80cd43D6Adbc6c463a2DE433a7"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x7f31345fc6e2cb84ffcfd8c3fc10530c1ef2ee711267934993f1ee696c42ecab"}},{"delay":0,"operation":{"calls":[{"target":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063","value":"0","function":"changeAdmin","inputs":[{"name":"newAdmin","value":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0xa195d0d43061f0625218b336fdda1e711a225c6d87e9e9fc217f335dd03c3896"}},{"delay":0,"operation":{"calls":[{"target":"0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1","value":"0","function":"upgrade","inputs":[{"name":"proxy","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"implementation","value":"0x8191975d8B0851C7f0740918896Cf298c09aA05E"}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x714ad8d07badbf96a33866ae1797912bfc86203a24f4d827172392496d8d4126"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xA49d7499271aE71cd8aB9Ac515e6694C755d400c"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xfFffFffF2ba8F66D4e51811C5190992176930278"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xbC396689893D065F41bc2C6EcbeE5e0085233447"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x471Ea49dd8E60E697f4cac262b5fafCc307506e4"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xF655C8567E0f213e6C634CD2A68d992152161dC6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xba100000625a3754423978a60c9317c58a424e3D"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x95b3497bBcCcc46a8F45F5Cf54b0878b39f8D96C"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xc17272C3e15074C55b810bCebA02ba0C4481cd79"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xF9c53268e9de692AE1b2ea5216E24e1c3ad7CB1E"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x63A3AE78711b52fb75a03aCF9996F18ab611b877"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xdAC17F958D2ee523a2206206994597C13D831ec7"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xcDa4e840411C00a614aD9205CAEC807c7458a0E3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5F64Ab1544D28732F0A24F4713c2C8ec0dA089f0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4691937a7508860F876c9c0a2a617E7d9E945D4B"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xeEAA40B28A2d1b0B08f6f97bB1DD4B75316c6107"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xDDdddd4301A082e62E84e43F474f044423921918"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x111111111117dC0aa78b770fA6A738034120C302"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC63E1F3fDAe49E9eF5951Ab5E84334a6934Ce767"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x108a850856Db3f85d0269a2693D896B394C80325"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4Fabb145d64652a948d72533023f6E7A623C7C53"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6982508145454Ce325dDbE47a25d4ec3d2311933"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xd38BB40815d2B0c2d2c866e0c72c5728ffC76dd9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD38e031f4529a07996aaB977d2B79f0e00656C56"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x76054592D1F789eA5958971fb3ba6628334fAa86"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD33526068D116cE69F19A9ee46F0bd304F21A51f"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xae78736Cd615f374D3085123A210448E74Fc6393"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xBe9895146f7AF43049ca1c1AE358B0541Ea49704"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x459706Cc06a2095266E623a5684126130e74B930"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x1Ed81E03D7DDB67A21755D02ED2f24da71C27C55"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xfAC77A24E52B463bA9857d6b758ba41aE20e31FF"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xA91ac63D040dEB1b7A5E4d4134aD23eb0ba07e14"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xe963e120f818F15420EA3DAD0083289261923C2e"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4E9e4Ab99Cfc14B852f552f5Fb3Aa68617825B6c"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x21eAD867C8c5181854f6f8Ce71f75b173d2Bc16A"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x3bdffA70f4b4E6985eED50453c7C0D4A15dcEc52"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xc6F5D26e9A9cfA5B917E049139AD9CcF5CDddE6D"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC91a71A1fFA3d8B22ba615BA1B9c01b2BBBf55ad"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8A7aDc1B690E81c758F1BD0F72DFe27Ae6eC56A5"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC6b50D3c36482Cba08D2b60183Ae17D75b90FdC9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7448c7456a97769F6cD04F1E83A4a23cCdC46aBD"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xbB94d52B84568Beb26106F5CC66C29f352d85f8d"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9ad37205d608B8b219e6a2573f922094CEc5c200"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x97e3C21f27182498382f81e32fbe0ea3A0e3D79b"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5C1d9aA868a30795F92fAe903eDc9eFF269044bf"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x54Ea1C9fe9f3987eB2bc69e2b45aC1F19001406D"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD41f3D112cb8695c7a8992E4055BD273f3ce8729"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0a77eF9bf662D62Fbf9BA4cf861EaA83F9CC4FEC"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x423f4e6138E475D85CF7Ea071AC92097Ed631eea"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xe4815AE53B124e7263F08dcDBBB757d41Ed658c6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9469D013805bFfB7D3DEBe5E7839237e535ec483"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x72e4f9F808C49A2a61dE9C5896298920Dc4EEEa9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6EFF556748Ee452CbDaf31bcb8c76A28651509bd"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xeDCC68Cc8b6Ec3eDE0979f8A52835b238A272027"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xFf5B9f95DCAafc8204d4b6B156Be2851aC7B604f"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4Bb3205bf648B7F59EF90Dee0F1B62F6116Bc7ca"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8A9C67fee641579dEbA04928c4BC45F66e26343A"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5Bec54282A1B57D5d7FdE6330e2D4a78618F0508"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0386E113221ccC785B0636898d8b379c1A113713"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xBD8FdDa057de7e0162b7A386BeC253844B5E07A5"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6B175474E89094C44Da98b954EedeAC495271d0F"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8353b92201f19B4812EeE32EFd325f7EDe123718"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf0655DcEE37E5C0b70Fffd70D85f88F8eDf0AfF6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x68592c5c98C4F4A8a4bC6dA2121E65Da3d1c0917"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB6eD7644C69416d67B522e20bC294A9a9B405B31"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD533a949740bb3306d119CC777fa900bA034cd52"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9BE89D2a4cd102D8Fecc6BF9dA793be995C22541"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xea4a1Fc739D8B70d16185950332158eDFa85d3e8"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x600204AE2DB743D15dFA5cbBfB47BBcA2bA0ac3C"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x72aDadb447784dd7AB1F472467750fC485e4cb2d"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x514910771AF9Ca656af840dff83E8264EcF986CA"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7E743f75C2555A7c29068186feed7525D0fe9195"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x69e5C11a7C30f0bf84A9faECBd5161AA7a94decA"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xFE3E6a25e6b192A42a44ecDDCd13796471735ACf"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x86715AFA18d9fD7090d5C2e0f8E6E824A8723fBA"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xED5464bd5c477b7F71739Ce1d741b43E932b97b0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xF411903cbC70a74d22900a5DE66A2dda66507255"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xd7C1EB0fe4A30d3B2a846C04aa6300888f087A5F"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8A0C816A52e71A1e9b6719580ebE754709C55198"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9813037ee2218799597d83D4a5B6F3b6778218d9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x405be842CdB64B69470972Eb83C07C2c0788d864"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x64F80550848eFf3402C5880851B77dD82a1a71F3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xCeDefE438860D2789dA6419b3a19cEcE2A41038d"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xcfa04B9Bf3c346b2Ac9d3121c1593BA8DD30bCd5"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9ee91F9f426fA633d227f7a9b000E28b9dfd8599"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8c18D6a985Ef69744b9d57248a45c0861874f244"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0f51bb10119727a7e5eA3538074fb341F56B09Ad"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xd1d2Eb1B1e90B638588728b4130137D262C87cae"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xaE86f48c0B00F2a3eaeF4ba4c23d17368f0f63f4"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x10BA1F6604Af42cA96aEAbCa1DF6C26FB0572515"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x44ff8620b8cA30902395A7bD3F2407e1A091BF73"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x467719aD09025FcC6cF6F8311755809d45a5E5f3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD5d86FC8d5C0Ea1aC1Ac5Dfab6E529c9967a45E9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD31a59c85aE9D8edEFeC411D448f90841571b89c"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x595832F8FC6BF59c85C527fEC3740A1b7a361269"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xc2E2368D4F3efa84489BF3729C55aFBC2Fa01652"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xb5b2D6acd78Ac99D202a362B50aC3733A47a7C7b"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xBBBbbBBB46A1dA0F0C3F64522c275BAA4C332636"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xFE67A4450907459c3e1FFf623aA927dD4e28c67a"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7659CE147D0e714454073a5dd7003544234b6Aa0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x1D4241F7370253C0f12EFC536B7e16E462Fb3526"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x22Ee12DFEBc4685bA2240d45893D4e479775b4cf"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xe2353069f71a27bBbe66eEabfF05dE109c7d5E19"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8f74A5d0A3bA170f2A43b1aBBA16C251F611500D"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf951E335afb289353dc249e82926178EaC7DEd78"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC3f7ac3a68369975CFF21DCbdb303383C5E203CC"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x788DdD6f2c13bDC00426dEB67add5c057de84941"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4507cEf57C46789eF8d1a19EA45f4216bae2B528"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x57F228e13782554feb8FE180738e12A70717CFAE"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB4EFd85c19999D84251304bDA99E90B92300Bd93"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x34Be5b8C30eE4fDe069DC878989686aBE9884470"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC5190E7FEC4d97a3a3b1aB42dfedac608e2d0793"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xa2B0fDe6D710e201d0d608e924A484d1A5fEd57c"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xE55d97A97ae6A17706ee281486E98A84095d8AAf"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7bFEBd989ef62f7f794d9936908565dA42Fa6D70"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0Fb765ddBD4d26AC524AA5990B0643D0Ab6Ac2fE"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xde67d97b8770dC98C746A3FC0093c538666eB493"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x41f7B8b9b897276b7AAE926a9016935280b44E97"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x12970E6868f88f6557B76120662c1B3E50A646bf"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x72577C54b897f2b10a136bF288360B6BAaAD92F2"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xE5F166c0D8872B68790061317BB6CcA04582C912"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5114616637bEc16B023c9E29632286BcEa670127"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x772c44b5166647B135BB4836AbC4E06c28E94978"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xc834Fa996fA3BeC7aAD3693af486ae53D8aA8B50"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf6AeaF0FE66cf2ef2e738bA465fb531ffE39b4e2"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9b110Fda4E20DB18Ad7052f8468a455de7449eb6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x430EF9263E76DAE63c84292C3409D61c598E9682"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x66a0f676479Cee1d7373f3DC2e2952778BfF5bd6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0cF5003a5262E163fDbB26A9DEf389fd468E32CC"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xa41d2f8Ee4F47D3B860A149765A7dF8c3287b7F0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x562E362876c8Aee4744FC2c6aaC8394C312d215d"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5D80A8D8CB80696073e82407968600A37e1dd780"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xCdCFc0f66c522Fd086A1b725ea3c0Eeb9F9e8814"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0a58531518DbA2009BdfBf1AF79602bfD312FdF1"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5DE8ab7E27f6E7A1fFf3E5B337584Aa43961BEeF"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xda31D0d1Bc934fC34F7189E38A413ca0A5e8b44F"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x15e6E0D4ebeAC120F9a97e71FaA6a0235b85ED12"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9b8e9d523D1D6bC8EB209301c82C7D64D10b219E"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x137dDB47Ee24EaA998a535Ab00378d6BFa84F893"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x88ACDd2a6425c3FaAE4Bc9650Fd7E27e0Bebb7aB"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xb945E3F853B5f8033C8513Cf3cE9F8AD9beBB1c9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x41EA5d41EEACc2D5c4072260945118a13bb7EbCE"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0001A500A6B18995B03f44bb040A5fFc28E45CB0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x62D0A8458eD7719FDAF978fe5929C6D342B0bFcE"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6aDb5216796fD9D4a53F6cC407075C6c075D468A"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0D8775F648430679A709E98d2b0Cb6250d2887EF"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xdc8aF07A7861bedD104B8093Ae3e9376fc8596D2"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4EE9968393d5ec65b215B9aa61e5598851f384F2"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6c249b6F6492864d914361308601A7aBb32E68f8"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x304645590f197d99fAD9fA1d05e7BcDc563E1378"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x805C2077f3ab224D889f9c3992B41B2F4722c787"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8B5653Ae095529155462eDa8CF664eD96773F557"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xeb2635c62B6b4DdA7943928a1a6189DF654c850e"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4AaC461C86aBfA71e9d00d9a2cde8d74E4E1aeEa"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x607F4C5BB672230e8672085532f7e901544a7375"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x77F76483399Dc6328456105B1db23e2Aca455bf9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0b38210ea11411557c13457D4dA7dC6ea731B88a"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x839e71613f9aA06E5701CF6de63E303616B0DDE3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD13c7342e1ef687C5ad21b27c2b65D772cAb5C8c"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x73fBD93bFDa83B111DdC092aa3a4ca77fD30d380"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x66b658b7979abf71d212956f62BdD3630Cc7f309"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8e199473348Eb597d428D4ce950479771a109715"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x83e6f1E41cdd28eAcEB20Cb649155049Fac3D5Aa"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x61a35258107563f6B6f102aE25490901C8760b12"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xbf5495Efe5DB9ce00f80364C8B423567e58d2110"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8457CA5040ad67fdebbCC8EdCE889A335Bc0fbFB"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x66580f80a00deAfab4519dC33C35BF44d8A12B00"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x869b1F57380aE501d387b19262EFD3C0Eb7501b0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x000000007a58f5f58E697e51Ab0357BC9e260A04"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2965395F71B7d97ede251E9B63e44dfA9647cC0A"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5A520e593F89c908cd2bc27D928bc75913C55C42"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x16AaB4738843FB2d9Eafc8fD261488797bF0df29"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x43Ffdc962DB6c1708e218751e7E8e92009152486"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4c11249814f11b9346808179Cf06e71ac328c1b5"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xbcD29DA38b66E2b7855C92080ebe82330ED2012a"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x3007083EAA95497cD6B2b809fB97B6A30bdF53D3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xF9Ca9523E5b5A42C3018C62B084Db8543478C400"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2c489F6c2B728665f56691744f0336A5cC69ba94"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB627a1BF727f578384ba18B2A2b46f4fb924Ab3b"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4a0552F34f2237Ce3D15cA69d09F65B7D7aA00bb"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x178c820f862B14f316509ec36b13123DA19A6054"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xc56c2b7e71B54d38Aab6d52E94a04Cbfa8F604fA"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5973f93D1efbDcAa91BA2ABc7ae1f6926434bcB6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xE89C20096b636fFec9fd26d1a623F42A33eaD309"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC57d533c50bC22247d49a368880fb49a1caA39F7"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x33909C9CE97Ce509daB3A038B3eC7ac3d1Be3231"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xE66b3AA360bB78468c00Bebe163630269DB3324F"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x85f138bfEE4ef8e540890CFb48F620571d67Eda3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xcB77467F6cf5cfC913aC5C757284D914Ed086Cf0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7e931f31b742977ed673dE660e54540B45959447"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x175D9Dfd6850AA96460E29bC0cEad05756965E91"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5d74468b69073f809D4FaE90AfeC439e69Bf6263"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xF250b1f6193941bB8BFF4152d719EDf1a59C0E69"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xa23C1194d421F252b4e6D5edcc3205F7650a4eBE"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xA8258AbC8f2811dd48EccD209db68F25E3E34667"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x35b0CCC549776e927B8FA7f5fc7afe9f8652472c"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x41B6F91DAa1509bFbe06340D756560C4a1d146Fd"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x5a07EF0B2523fD41F8fE80c3DE1Bc75861d86C51"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xeCbEE2fAE67709F718426DDC3bF770B26B95eD20"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xbDDf3B5A786775F63C2c389B86CDDaDD04d5A7aa"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD514B77060e04b1Ee7e15f6e1D3b5419e9f32773"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x32a7C02e79c4ea1008dD6564b35F131428673c41"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD9A442856C234a39a81a089C06451EBAa4306a72"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x207e14389183A94343942de7aFbC607F57460618"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x967da4048cD07aB37855c090aAF366e4ce1b9F48"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x03EE5026c07d85ff8ae791370DD0F4C1aE6C97fc"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2364BB6DeA9CAcD4F8541aF761D3BcF3d86B26FD"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x750A575284fad07fbF2fCc45Eb26d1111AfeE165"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6368e1E18c4C419DDFC608A0BEd1ccb87b9250fc"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x60bE1e1fE41c1370ADaF5d8e66f07Cf1C2Df2268"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xe25bCec5D3801cE3a794079BF94adF1B8cCD802D"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x97AEB5066E1A590e868b511457BEb6FE99d329F5"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x725440512cb7b78bF56B334E50e31707418231CB"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xd9f79Fc56839c696e2E9F63948337F49d164a015"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x516D813bc49b0EB556F9D09549f98443aCDD7D8F"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x54a7cee7B02976ACE1bdd4aFad87273251Ed34Cf"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8E870D67F660D95d5be530380D0eC0bd388289E1"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6732Efaf6f39926346BeF8b821a04B6361C4F3e5"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x65E6B60Ea01668634D68D0513Fe814679F925BaD"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC3ADe5aCe1bBb033CcAE8177C12Ecbfa16bD6A9D"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9E32b13ce7f2E80A01932B42553652E053D6ed8e"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf32CEA5d29C060069372AB9385F6E292387d5535"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4Cf89ca06ad997bC732Dc876ed2A7F26a9E7f361"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xA35b1B31Ce002FBF2058D22F30f95D405200A15b"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xd680ffF1699aD71f52e29CB4C36010feE7b8d61B"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0E573Ce2736Dd9637A0b21058352e1667925C7a8"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD973637d6c982a492BdAFE6956cc79163F279B2C"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xfc448180d5254A55846a37c86146407Db48d2a36"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xbc4171f45EF0EF66E76F979dF021a34B46DCc81d"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x163f8C2467924be0ae7B5347228CABF260318753"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x93581991f68DBaE1eA105233b67f7FA0D6BDeE7b"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9144D8E206B98ED9C38F19D3E4760E278FAAB1C9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xaE66e13E7ff6F505c6E53aDFE47B2b9082b9E0eA"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xfAc0403a24229d7e2Edd994D50F5940624CBeac2"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2dE7B02Ae3b1f11d51Ca7b2495e9094874A064c0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xD101dCC414F310268c37eEb4cD376CcFA507F571"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xCFc006a32a98031C2338BF9d5ff8ED2c0Cae4a9e"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9D14BcE1dADdf408d77295BB1be9b343814f44DE"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x9fC86c5Afb7b336367B8c1cf1f895dBFDd1CA06d"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xeB8eB73Bbf1B0b3a8eF30e48447F47894Bf6FfdB"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB7Df0f42FAe30acf30C9A5BA147D6B792b5eB9d9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC3D3BCb666588d8b58c921d3d297E04037Ad4665"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xc78B628b060258300218740B1A7a5b3c82b3bd9f"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8c30bA8e0b776D0B3654B72D737ecd668B26a192"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x046EeE2cc3188071C02BfC1745A6b17c656e3f3d"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xDb82c0d91E057E05600C8F8dc836bEb41da6df14"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x738865301A9b7Dd80Dc3666dD48cF034ec42bdDa"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xC9fE6E1C76210bE83DC1B5b20ec7FD010B0b1D15"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x216c9bb7380cDe431662E37e30098d838d7e1Dc8"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xDa546071DCBcec77E707aCC6ee32328b91607a23"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2e2364966267B5D7D2cE6CD9A9B5bD19d9C7C6A9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2a2550e0A75aCec6D811AE3930732F7f3ad67588"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf79c694605F29DDF3F0eB41319C38672ab6fA89F"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xAC57De9C1A09FeC648E93EB98875B212DB0d460B"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xF96459323030137703483B46fD59A71D712BF0aa"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x7c9f4C87d911613Fe9ca58b579f737911AAD2D43"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf2EAb3A2034D3f6B63734D2E08262040E3fF7B48"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x669c01CAF0eDcaD7c2b8Dc771474aD937A7CA4AF"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x828E0EDF347Bd53E57d64426c67F291D8C553a70"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x582d872A1B094FC48F5DE31D3B73F2D9bE47def1"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x15f74458aE0bFdAA1a96CA1aa779D715Cc1Eefe4"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0000000000ca73A6df4C58b84C5B4b847FE8Ff39"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x025daf950C6e814dEe4c96e13c98D3196D22E60C"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xe2bCA705991ba5F1Bb8a33610dBa10D481379CD3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xa636Ee3f2C24748e9FC7fd8b577F7A629e879b45"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf9BD51d756a3caF52348f2901B7EFf9Bd03398E7"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x07150e919B4De5fD6a63DE1F9384828396f25fDC"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x93728F9B63edbb91739f4fbAa84890E5073E3D4f"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x865377367054516e17014CcdED1e7d814EDC9ce4"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xdebe620609674F21B1089042527F420372eA98A5"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB58E61C3098d85632Df34EecfB899A1Ed80921cB"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x726516B20c4692a6beA3900971a37e0cCf7A6BFf"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4a220E6096B25EADb88358cb44068A3248254675"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x84018071282d4B2996272659D9C01cB08DD7327F"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xc944E90C64B2c07662A292be6244BDf05Cda44a7"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xf65B5C5104c4faFD4b709d9D60a185eAE063276c"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xCD4b21DeadEEBfCFf202ce73E976012AfAd11361"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x36E66fbBce51e4cD5bd3C62B637Eb411b18949D4"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xdBB7a34Bf10169d6d2D0d02A6cbb436cF4381BFa"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB8c77482e45F1F44dE1745F52C74426C631bDD52"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x23eC026590d6CCCfEce04097F9B49aE6A442C3BA"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xDA7C0810cE6F8329786160bb3d1734cf6661CA6E"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x72e364F2ABdC788b7E918bc238B21f109Cd634D7"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x1B9eBb707D87fbec93C49D9f2d994Ebb60461B9b"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xd3843c6Be03520f45871874375D618b3C7923019"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xB6ff96B8A8d214544Ca0dBc9B33f7AD6503eFD32"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x2b1D36f5B61AdDAf7DA7ebbd11B35FD8cfb0DE31"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0xe8A25C46d623f12B8bA08b583b6fE1bEE3eB31C9"},{"name":"_target","value":"0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]},{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0000000000000000000000000000000000000001"},{"name":"_target","value":"0x32400084C286CF3E17e7B677ea9583e60a000324"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":300000}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"safeTransferFundsFromLegacy","inputs":[{"name":"_token","value":"0x0000000000000000000000000000000000000001"},{"name":"_target","value":"0x32400084C286CF3E17e7B677ea9583e60a000324"},{"name":"_targetChainId","value":324},{"name":"_gasPerToken","value":1100001}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x0000000000000000000000000000000000000000000000000000000000000000"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"setEraPostDiamondUpgradeFirstBatch","inputs":[{"name":"_eraPostDiamondUpgradeFirstBatch","value":484171}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0xfeb63ba784b61e1f2059de3c5d056e49053dd6da45a961a5b4aa0135c2597953"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"setEraPostLegacyBridgeUpgradeFirstBatch","inputs":[{"name":"_eraPostLegacyBridgeUpgradeFirstBatch","value":484171}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x93e799b8bd978a66f15bd3bbee77a1979a102ecb1c64d51b7e15863ed2c83f8d"}},{"delay":0,"operation":{"calls":[{"target":"0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB","value":"0","function":"setEraLegacyBridgeLastDepositTime","inputs":[{"name":"_eraLegacyBridgeLastDepositBatch","value":484335},{"name":"_eraLegacyBridgeLastDepositTxNumber","value":914}]}],"predecessor":"0x0000000000000000000000000000000000000000000000000000000000000000","salt":"0x68e79408fd7f74113e7e3b3546b6a0584fb45718f15465bb0bdfdd923c2f56ee"}}]
    }
```

Generated with discovered.json: 0xff49a44630ba96d62441acf8d3e8ca32fc76f809

# Diff at Mon, 08 Jul 2024 13:00:35 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@555efdd96fadc389c2c70beacf820125fbb25a7d block: 20061811
- current block number: 20261948

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20061811 (main branch discovery), not current.

```diff
    contract ZKsync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      values.facets:
-        [{"addr":"0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","selectors":["0x0e18b681","0x64bf8d66","0xa9f6d941","0x27ae4c16","0x4dd18bf5","0x1cc5d103","0xbe6f11cf","0xe76db865","0x235d9eb5","0x21f603d7","0x4623c91d","0x17338945","0xfc57565f"]},{"addr":"0xE60E94fCCb18a81D501a38959E532C0A85A1be89","selectors":["0x1de72e34","0xea6c029c","0xcdffacc6","0x52ef6b2c","0xadfca15e","0x7a0ed627","0x6e9960c3","0x98acd7a6","0x086a56f8","0x3591c1a0","0x79823c9a","0xd86970d8","0xfd791f3c","0xe5355c75","0x9d1b5a81","0x7b30c8da","0xd0468156","0x631f4bac","0x0ec6b0b7","0x33ce93fe","0x06d49e5b","0xf5c1182c","0x5518c73b","0xdb1f0bf9","0xb8c2f66f","0xef3f0bae","0xfe26699e","0x39607382","0xaf6a2dcd","0xa1954fc5","0x46657fe9","0x18e3a941","0x29b98c67","0xbd7c5412","0xc3bbd2d7","0xe81e0ba1","0xfacd743b","0x9cd939e4","0x56142d7a","0xb22dd78e","0x74f4d30d"]},{"addr":"0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","selectors":["0x12f43dab","0x6c0960f9","0xb473318e","0x042901c7","0x263b7f8e","0xe4948f43","0xeb672419","0xc924de35"]},{"addr":"0xaD193aDe635576d8e9f7ada71Af2137b16c64075","selectors":["0x701f58c5","0x6edd4f12","0xc3d93e7c","0x6f497ac6","0x7f61885c","0xc37533bb","0x97c09d34","0x0f23da43"]}]
+        {"0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a":["acceptAdmin()","changeFeeParams((uint8,uint32,uint32,uint32,uint32,uint64))","executeUpgrade(((address,uint8,bool,bytes4[])[],address,bytes))","freezeDiamond()","setPendingAdmin(address)","setPorterAvailability(bool)","setPriorityTxMaxGasLimit(uint256)","setPubdataPricingMode(uint8)","setTokenMultiplier(uint128,uint128)","setTransactionFilterer(address)","setValidator(address,bool)","unfreezeDiamond()","upgradeChainFromVersion(uint256,((address,uint8,bool,bytes4[])[],address,bytes))"],"0xE60E94fCCb18a81D501a38959E532C0A85A1be89":["baseTokenGasPriceMultiplierDenominator()","baseTokenGasPriceMultiplierNominator()","facetAddress(bytes4)","facetAddresses()","facetFunctionSelectors(address)","facets()","getAdmin()","getBaseToken()","getBaseTokenBridge()","getBridgehub()","getFirstUnprocessedPriorityTx()","getL2BootloaderBytecodeHash()","getL2DefaultAccountBytecodeHash()","getL2SystemContractsUpgradeBatchNumber()","getL2SystemContractsUpgradeBlockNumber()","getL2SystemContractsUpgradeTxHash()","getPendingAdmin()","getPriorityQueueSize()","getPriorityTxMaxGasLimit()","getProtocolVersion()","getPubdataPricingMode()","getSemverProtocolVersion()","getStateTransitionManager()","getTotalBatchesCommitted()","getTotalBatchesExecuted()","getTotalBatchesVerified()","getTotalBlocksCommitted()","getTotalBlocksExecuted()","getTotalBlocksVerified()","getTotalPriorityTxs()","getVerifier()","getVerifierParams()","isDiamondStorageFrozen()","isEthWithdrawalFinalized(uint256,uint256)","isFacetFreezable(address)","isFunctionFreezable(bytes4)","isValidator(address)","l2LogsRootHash(uint256)","priorityQueueFrontOperation()","storedBatchHash(uint256)","storedBlockHash(uint256)"],"0xCDB6228b616EEf8Df47D69A372C4f725C43e718C":["bridgehubRequestL2Transaction((address,address,uint256,uint256,bytes,uint256,uint256,bytes[],address))","finalizeEthWithdrawal(uint256,uint256,uint16,bytes,bytes32[])","l2TransactionBaseCost(uint256,uint256,uint256)","proveL1ToL2TransactionStatus(bytes32,uint256,uint256,uint16,bytes32[],uint8)","proveL2LogInclusion(uint256,uint256,(uint8,bool,uint16,address,bytes32,bytes32),bytes32[])","proveL2MessageInclusion(uint256,uint256,(uint16,address,bytes),bytes32[])","requestL2Transaction(address,uint256,bytes,uint256,uint256,bytes[],address)","transferEthToSharedBridge()"],"0xaD193aDe635576d8e9f7ada71Af2137b16c64075":["commitBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","commitBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,uint64,uint64,bytes32,uint256,bytes32,bytes32,bytes32,bytes,bytes)[])","executeBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","executeBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[])","proveBatches((uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","proveBatchesSharedBridge(uint256,(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32),(uint64,bytes32,uint64,uint256,bytes32,bytes32,uint256,bytes32)[],(uint256[],uint256[]))","revertBatches(uint256)","revertBatchesSharedBridge(uint256,uint256)"]}
    }
```

Generated with discovered.json: 0xc0fc7f99bf716dda44efaa9998f17de5c62e5d98

# Diff at Mon, 10 Jun 2024 13:45:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5076f0f120afd8d9006d198d9d9c9bf0f5327f31 block: 20040416
- current block number: 20061811

## Description

Remove the deprecated constructorArgs from the config.
Add trigger for all new chains that are created (even with a different STM).

For v24 upgrade below, there is now also an [informative diff audit by OpenZeppelin](https://blog.openzeppelin.com/zksync-state-transition-diff-audit).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20040416 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
+++ description: All new chains created go thorugh the central bridgehub and are thus stored here with their respective STMs.
      values.chainsCreated:
+        [{"chainId":324,"stateTransitionManager":"0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C","chainGovernance":"0x71d84c3404a6ae258E6471d4934B96a2033F9438"}]
    }
```

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      name:
-        "zkSync"
+        "ZKsync"
      values.txFilterer:
+        []
    }
```

```diff
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      values.constructorArgs:
-        {"_initialOwner":"0x0000000000000000000000000000000000000040","_executionDelay":1,"_eraChainId":"7067"}
    }
```

Generated with discovered.json: 0x93ee29c36171713f01b80b6748356bdbc622eb7a

# Diff at Fri, 07 Jun 2024 14:02:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bb1e924130ed617ad936049f31500ae091525180 block: 20034095
- current block number: 20040416

## Description

Upgrade v24 - VM version 1.5.0. (was initially scheduled for May 13)

[CHANGELOG](https://github.com/zkSync-Community-Hub/zksync-developers/discussions/519)

Main points:
- New shared L1 escrow and Bridgehub for zkSync Era and all future ZK stack chains 
- New StateTransitionManager (shared proof verification for ZK stack chains with the same EVM implementation, currently only one)

### New architecture summary

Each ZK stack chain including zkSync Era has its own diamond contract similar to the old model, with all chain-specific logic inside. ZK stack chains with the same EVM logic can share a State Transition Manager (STM), which is responsible for proof verification for each connected chain. The multiple future STMs in turn are connected through the single Bridgehub, which allows L1 to L2 and L2 to L2 message passing. Below it is the shared bridge for all registered ZK stack chains.

### Changes to the zkSync Era diamond
#### AdminFacet.sol

- L1--> L2 Transaction filtering (can set tx filtering contract)
- Governor role removed (onlyGovernor functions are now mostly onlySTM)
- VerifierParams moved to STM
- Support for custom native token ('basetoken')
- Function `upgradeChainFromVersion()` added: Allows to upgrade the diamond with preformed calldata (can be used for synchronous upgrading of multiple chains in the future)

#### ExecutorFacet.sol

- Support for more Blobs in one transaction (6, up from 2)
- ChainID can be added to committing, proving, executing, reverting of batches
- `PubdataPricingMode.Validium` implemented (was not usable before)
- New upgrade logic in `commitBatches()`: L2 upgrade will be logged on L1

### MailBoxFacet.sol

- New function `transferEthToSharedBridge()` can be used to move all ETH to a shared bridge by the `BaseTokenBridge` address
- `requestL2Transaction()` is still available, but can also be accessed via Bridgehub

## L1ERC20Bridge.sol (old)

Will be deprecated and funds are already being moved off of this bridge to the new shared one. Can still be used though as it has the `IL1SharedBridge` Interface to forward transactions to the new shared bridge.

## StateTransitionManager.sol (added)

Implements admin, freezing and upgrade logic for the chains that are registered to it. (heavily interfaces with the diamond contracts) Also interfaces with the proof verification and the validator timelock of zkSync Era. Future diamond contracts for rollups that share their evm and proving logic can share an STM.

## Bridgehub.sol (added)

Singular central hub contract acting as a bridge gateway / proxy between the shared bridge and the individual mailboxes of the registered diamond contracts. 

All L1 <-> L2 ccommunication is handled here.

## L1SharedBridge.sol (added)

Shared bridge contract that can store all ERC-20 tokens and ETH, WETH for all chains. Has a mapping of token balances for each chain and backwards compatibility for the old ZkSync Era bridge.

Deposits and Withdrawals for all registered chains are handled here.

Has legacy functions that interface with the old ZkSync Era bridge for backwards compatibility.

## GenesisUpgrade.sol (added)

Stores the initial chain creation parameters for chains that register with the STM. In this case these are the chain creation parameters for ZkSync Era and its associated STM, and all potential future chains that want to use the same STM ad Era.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      values.getL2SystemContractsUpgradeBatchNumber:
-        484290
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        484290
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xb88380066d84222045097f0fad44e876c361dc27f5367d46decb294ba1a7d29c"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20034095 (main branch discovery), not current.

```diff
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213) {
    +++ description: None
      values.zksyncEraDiamond:
+        "0x32400084C286CF3E17e7B677ea9583e60a000324"
      values.zksyncEraSTM:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
    }
```

```diff
    contract ValidatorTimelock_NEW (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E) {
    +++ description: None
      name:
-        "ValidatorTimelock_NEW"
+        "ValidatorTimelock"
      values.constructorArgs:
+        {"_initialOwner":"0x0000000000000000000000000000000000000040","_executionDelay":1,"_eraChainId":"7067"}
      values.revertedBlocks:
+        []
      values.validatorsAdded:
+        ["0x0D3250c3D5FAcb74Ac15834096397a3Ef790ec99","0x3527439923a63F8C13CF72b8Fe80a77f6e572092"]
      values.validatorsRemoved:
+        []
    }
```

```diff
    contract ValidatorTimelock (0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD) {
    +++ description: None
      name:
-        "ValidatorTimelock"
+        "ValidatorTimelock_deprecated"
    }
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB) {
    +++ description: None
      values.L1_WETH_TOKEN:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
```

Generated with discovered.json: 0x3a4dd94fb8e0bcc87ffc7593dfc1c7aff5188b10

# Diff at Thu, 06 Jun 2024 16:52:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@ede45d4470f4a86adbf9140e79f58d3d03af8b66 block: 19624206
- current block number: 20034095

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      upgradeability.facets.3:
-        "0xfd3779e6214eBBd40f5F5890351298e123A46BA6"
+        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
      upgradeability.facets.2:
-        "0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7"
+        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
      upgradeability.facets.1:
-        "0x10113bB3a8e64f8eD67003126adC8CE74C34610c"
+        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
      upgradeability.facets.0:
-        "0x230214F0224C7E0485f348a79512ad00514DB1F7"
+        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
      implementations.3:
-        "0xfd3779e6214eBBd40f5F5890351298e123A46BA6"
+        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
      implementations.2:
-        "0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7"
+        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
      implementations.1:
-        "0x10113bB3a8e64f8eD67003126adC8CE74C34610c"
+        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
      implementations.0:
-        "0x230214F0224C7E0485f348a79512ad00514DB1F7"
+        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
      values.facetAddresses.3:
-        "0xfd3779e6214eBBd40f5F5890351298e123A46BA6"
+        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
      values.facetAddresses.2:
-        "0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7"
+        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
      values.facetAddresses.1:
-        "0x10113bB3a8e64f8eD67003126adC8CE74C34610c"
+        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
      values.facetAddresses.0:
-        "0x230214F0224C7E0485f348a79512ad00514DB1F7"
+        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
      values.facets.3.1.7:
+        "0x0f23da43"
      values.facets.3.1.6:
+        "0x97c09d34"
      values.facets.3.1.5:
+        "0xc37533bb"
      values.facets.3.1.4:
+        "0x7f61885c"
      values.facets.3.1.3:
-        "0x97c09d34"
+        "0x6f497ac6"
      values.facets.3.1.2:
-        "0x7f61885c"
+        "0xc3d93e7c"
      values.facets.3.1.1:
-        "0xc3d93e7c"
+        "0x6edd4f12"
      values.facets.3.0:
-        "0xfd3779e6214eBBd40f5F5890351298e123A46BA6"
+        "0xaD193aDe635576d8e9f7ada71Af2137b16c64075"
      values.facets.2.1.7:
+        "0xc924de35"
      values.facets.2.1.6:
+        "0xeb672419"
      values.facets.2.1.5:
-        "0xeb672419"
+        "0xe4948f43"
      values.facets.2.1.4:
-        "0xe4948f43"
+        "0x263b7f8e"
      values.facets.2.1.3:
-        "0x263b7f8e"
+        "0x042901c7"
      values.facets.2.1.2:
-        "0x042901c7"
+        "0xb473318e"
      values.facets.2.1.1:
-        "0xb473318e"
+        "0x6c0960f9"
      values.facets.2.1.0:
-        "0x6c0960f9"
+        "0x12f43dab"
      values.facets.2.0:
-        "0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7"
+        "0xCDB6228b616EEf8Df47D69A372C4f725C43e718C"
      values.facets.1.1.40:
+        "0x74f4d30d"
      values.facets.1.1.39:
+        "0xb22dd78e"
      values.facets.1.1.38:
+        "0x56142d7a"
      values.facets.1.1.37:
+        "0x9cd939e4"
      values.facets.1.1.36:
+        "0xfacd743b"
      values.facets.1.1.35:
+        "0xe81e0ba1"
      values.facets.1.1.34:
+        "0xc3bbd2d7"
      values.facets.1.1.33:
+        "0xbd7c5412"
      values.facets.1.1.32:
-        "0x74f4d30d"
+        "0x29b98c67"
      values.facets.1.1.31:
-        "0xb22dd78e"
+        "0x18e3a941"
      values.facets.1.1.30:
-        "0x56142d7a"
+        "0x46657fe9"
      values.facets.1.1.29:
-        "0x9cd939e4"
+        "0xa1954fc5"
      values.facets.1.1.28:
-        "0xfacd743b"
+        "0xaf6a2dcd"
      values.facets.1.1.27:
-        "0xe81e0ba1"
+        "0x39607382"
      values.facets.1.1.26:
-        "0xc3bbd2d7"
+        "0xfe26699e"
      values.facets.1.1.25:
-        "0xbd7c5412"
+        "0xef3f0bae"
      values.facets.1.1.24:
-        "0x29b98c67"
+        "0xb8c2f66f"
      values.facets.1.1.23:
-        "0x18e3a941"
+        "0xdb1f0bf9"
      values.facets.1.1.22:
-        "0x46657fe9"
+        "0x5518c73b"
      values.facets.1.1.21:
-        "0xa1954fc5"
+        "0xf5c1182c"
      values.facets.1.1.20:
-        "0xaf6a2dcd"
+        "0x06d49e5b"
      values.facets.1.1.19:
-        "0x39607382"
+        "0x33ce93fe"
      values.facets.1.1.18:
-        "0xfe26699e"
+        "0x0ec6b0b7"
      values.facets.1.1.17:
-        "0xef3f0bae"
+        "0x631f4bac"
      values.facets.1.1.16:
-        "0xb8c2f66f"
+        "0xd0468156"
      values.facets.1.1.15:
-        "0xdb1f0bf9"
+        "0x7b30c8da"
      values.facets.1.1.14:
-        "0x33ce93fe"
+        "0x9d1b5a81"
      values.facets.1.1.13:
-        "0x0ec6b0b7"
+        "0xe5355c75"
      values.facets.1.1.12:
-        "0x631f4bac"
+        "0xfd791f3c"
      values.facets.1.1.11:
-        "0x8665b150"
+        "0xd86970d8"
      values.facets.1.1.10:
-        "0x7b30c8da"
+        "0x79823c9a"
      values.facets.1.1.9:
-        "0x9d1b5a81"
+        "0x3591c1a0"
      values.facets.1.1.8:
-        "0xe5355c75"
+        "0x086a56f8"
      values.facets.1.1.7:
-        "0xfd791f3c"
+        "0x98acd7a6"
      values.facets.1.1.6:
-        "0xd86970d8"
+        "0x6e9960c3"
      values.facets.1.1.5:
-        "0x4fc07d75"
+        "0x7a0ed627"
      values.facets.1.1.4:
-        "0x79823c9a"
+        "0xadfca15e"
      values.facets.1.1.3:
-        "0x7a0ed627"
+        "0x52ef6b2c"
      values.facets.1.1.2:
-        "0xadfca15e"
+        "0xcdffacc6"
      values.facets.1.1.1:
-        "0x52ef6b2c"
+        "0xea6c029c"
      values.facets.1.1.0:
-        "0xcdffacc6"
+        "0x1de72e34"
      values.facets.1.0:
-        "0x10113bB3a8e64f8eD67003126adC8CE74C34610c"
+        "0xE60E94fCCb18a81D501a38959E532C0A85A1be89"
      values.facets.0.1.12:
+        "0xfc57565f"
      values.facets.0.1.11:
+        "0x17338945"
      values.facets.0.1.10:
-        "0x17338945"
+        "0x4623c91d"
      values.facets.0.1.9:
-        "0x4623c91d"
+        "0x21f603d7"
      values.facets.0.1.8:
-        "0xbe6f11cf"
+        "0x235d9eb5"
      values.facets.0.1.7:
-        "0x1cc5d103"
+        "0xe76db865"
      values.facets.0.1.6:
-        "0xf235757f"
+        "0xbe6f11cf"
      values.facets.0.1.5:
-        "0x4dd18bf5"
+        "0x1cc5d103"
      values.facets.0.1.4:
-        "0x27ae4c16"
+        "0x4dd18bf5"
      values.facets.0.1.3:
-        "0xa9f6d941"
+        "0x27ae4c16"
      values.facets.0.1.2:
-        "0x64bf8d66"
+        "0xa9f6d941"
      values.facets.0.1.1:
-        "0xe58bb639"
+        "0x64bf8d66"
      values.facets.0.0:
-        "0x230214F0224C7E0485f348a79512ad00514DB1F7"
+        "0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a"
      values.getGovernor:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
      values.getL2BootloaderBytecodeHash:
-        "0x010007ede999d096c84553fb514d3d6ca76fbf39789dda76bfeda9f3ae06236e"
+        "0x010008e742608b21bf7eb23c1a9d0602047e3618b464c9b59c0fba3b3d7ab66e"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100055b041eb28aff6e3a6e0f37c31fd053fc9ef142683b05e5f0aee6934066"
+        "0x01000563374c277a2c1e34659a2a1e87371bb6d852ce142022d497bfb50b9e32"
      values.getL2SystemContractsUpgradeBatchNumber:
-        0
+        484290
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        484290
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0xb88380066d84222045097f0fad44e876c361dc27f5367d46decb294ba1a7d29c"
      values.getPendingGovernor:
-        "0x0000000000000000000000000000000000000000"
+++ description: Protocol version, increments with each protocol change
+++ severity: MEDIUM
      values.getProtocolVersion:
-        22
+        103079215105
      values.getVerifier:
-        "0xdd9C826196cf3510B040A8784D85aE36674c7Ed2"
+        "0x70F3FBf8a427155185Ec90BED8a3434203de9604"
+++ description: Verifier parameters used for proving batches
+++ severity: LOW
      values.getVerifierParams.1:
-        "0x400a4b532c6f072c00d1806ef299300d4c104f4ac55bd8698ade78894fcadc0a"
+        "0xf9664f4324c1400fa5c3822d667f30e873f53f1b8033180cd15fe41c1e2355c6"
+++ description: Verifier parameters used for proving batches
+++ severity: LOW
      values.getVerifierParams.0:
-        "0x5a3ef282b21e12fe1f4438e5bb158fc5060b160559c5158c6389d62d9fe3d080"
+        "0xf520cd5b37e74e19fdb369c8d676a04dce8a19457497ac6686d2bb95d94109c8"
      values.baseTokenGasPriceMultiplierDenominator:
+        1
      values.baseTokenGasPriceMultiplierNominator:
+        1
      values.getAdmin:
+        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
      values.getBaseToken:
+        "0x0000000000000000000000000000000000000001"
      values.getBaseTokenBridge:
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
      values.getBridgehub:
+        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.getPendingAdmin:
+        "0x0000000000000000000000000000000000000000"
      values.getPubdataPricingMode:
+        0
      values.getSemverProtocolVersion:
+        [0,24,1]
      values.getStateTransitionManager:
+        "0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C"
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
    +++ description: None
      upgradeability.implementation:
-        "0x810c6598CAaA08B61f6430Df5a8e120B3390d78A"
+        "0x8191975d8B0851C7f0740918896Cf298c09aA05E"
      upgradeability.admin:
-        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
+        "0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1"
      implementations.0:
-        "0x810c6598CAaA08B61f6430Df5a8e120B3390d78A"
+        "0x8191975d8B0851C7f0740918896Cf298c09aA05E"
      values.SHARED_BRIDGE:
+        "0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB"
    }
```

```diff
-   Status: DELETED
    contract Verifier (0xdd9C826196cf3510B040A8784D85aE36674c7Ed2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgeHub (0x303a465B659cBB0ab36eE643eA362c509EEb5213)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GenesisUpgrade (0x3dDD7ED2AeC0758310A4C6596522FCAeD108DdA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock_NEW (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xC2a36181fB524a6bEfE639aFEd37A67e77d62cf1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateTransitionManager (0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1SharedBridge (0xD7f9f54194C633F36CCD5F3da84ad4a1c38cB2cB)
    +++ description: None
```

## Source code changes

```diff
.../zksync2/ethereum/.flat/BridgeHub/Bridgehub.sol | 1200 +++++++
 .../BridgeHub/TransparentUpgradeableProxy.p.sol    |  728 ++++
 .../zksync2/ethereum/.flat/GenesisUpgrade.sol      | 2657 +++++++++++++++
 .../L1ERC20Bridge.sol                              |  438 +--
 .../.flat/L1SharedBridge/L1SharedBridge.sol        | 2072 ++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  728 ++++
 .../zksync2/ethereum/.flat/ProxyAdmin.sol          |  150 +
 .../StateTransitionManager.sol                     | 3514 ++++++++++++++++++++
 .../TransparentUpgradeableProxy.p.sol              |  728 ++++
 ...-0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E.sol |  540 +++
 ...0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD.sol} |    0
 .../{.flat@19624206 => .flat}/Verifier.sol         |   14 +-
 .../zksync2/ethereum/.flat/WETH9.sol               |   62 +
 .../zkSync/AdminFacet.1.sol                        |  214 +-
 .../zkSync/ExecutorFacet.4.sol                     |  380 ++-
 .../zkSync/GettersFacet.2.sol                      | 1542 +++++----
 .../zkSync/MailboxFacet.3.sol                      |  563 ++--
 17 files changed, 14047 insertions(+), 1483 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19624206 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x77954eb572fe13db06fdf974b4da51725e6a2792

# Diff at Wed, 10 Apr 2024 09:02:17 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6bb1fb9faf46a5960ef8903031fd713f6bd1234a block: 19532313
- current block number: 19624206

## Description

Add wstETH escrow governed by Lido.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19532313 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract L1ERC20Bridge_wstETH (0x41527B2d03844dB6b0945f25702cB958b6d55989)
    +++ description: None
```

Generated with discovered.json: 0x07d9b55885b29033ec3731f18859237455278c7f

# Diff at Thu, 28 Mar 2024 11:28:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19434460
- current block number: 19532313

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19434460 (main branch discovery), not current.

```diff
    contract Matter Labs Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: Can instantly upgrade all contracts and roles in the zksync Era contracts
      upgradeability.threshold:
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0xc0158f98e4c7abbca10d59b4d5f862a4fbf0c27c

# Diff at Thu, 14 Mar 2024 16:35:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@3ffa91064379f34a2916a1ad4e93791b752e7e9e block: 19425767
- current block number: 19434460

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19425767 (main branch discovery), not current.

```diff
    contract zkSync Era Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
    +++ description: None
      name:
-        "zkSync Era Multisig"
+        "Matter Labs Multisig"
    }
```

Generated with discovered.json: 0x7439825b1cfed9717b7d64fb67fd18dd4fad9c6b

# Diff at Wed, 13 Mar 2024 11:11:36 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@569d0a5fb269e21eeb1e6c7fdb1a2848a0c6fda7 block: 19418904
- current block number: 19425767

## Description

A verification parameter named recursionLeafLevelVkHash is updated suggesting a change in how the verifier should prove batches.
Protocol version is updated from 21 to 22.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
+++ description: Protocol version, increments with each protocol change
+++ severity: MEDIUM
      values.getProtocolVersion:
-        21
+        22
+++ description: Verifier parameters used for proving batches
+++ severity: LOW
      values.getVerifierParams.1:
-        "0x062362cb3eaf1f631406cbe19bf2a2c5d0d9ea69d069309a6003addae9f387be"
+        "0x400a4b532c6f072c00d1806ef299300d4c104f4ac55bd8698ade78894fcadc0a"
    }
```

Generated with discovered.json: 0xae47dc197c06eb123d220b6f285c6f66bb4e93ca

# Diff at Tue, 12 Mar 2024 12:09:43 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bdacb4204f519a0796aaef823774cc10a4fb2f8b block: 19275529
- current block number: 19418904

## Description

### ZkSync

Protocol version was updated from 20 to 21.

#### Executor

This upgrade introduces logic allowing the use of EIP-4844 blobs for data availability, also keeping calldata as an option. L2 contracts where updated with batch 459581.

### ValidatorTimelock

Allows to whitelist multiple validators (rather than only 1).

### Verifier

New keys

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
    +++ description: None
      upgradeability.facets.3:
-        "0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"
+        "0xfd3779e6214eBBd40f5F5890351298e123A46BA6"
      upgradeability.facets.2:
-        "0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB"
+        "0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7"
      upgradeability.facets.1:
-        "0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B"
+        "0x10113bB3a8e64f8eD67003126adC8CE74C34610c"
      upgradeability.facets.0:
-        "0xE6426c725cB507168369c10284390E59d91eC821"
+        "0x230214F0224C7E0485f348a79512ad00514DB1F7"
      implementations.3:
-        "0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"
+        "0xfd3779e6214eBBd40f5F5890351298e123A46BA6"
      implementations.2:
-        "0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB"
+        "0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7"
      implementations.1:
-        "0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B"
+        "0x10113bB3a8e64f8eD67003126adC8CE74C34610c"
      implementations.0:
-        "0xE6426c725cB507168369c10284390E59d91eC821"
+        "0x230214F0224C7E0485f348a79512ad00514DB1F7"
      values.facetAddresses.3:
-        "0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"
+        "0xfd3779e6214eBBd40f5F5890351298e123A46BA6"
      values.facetAddresses.2:
-        "0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB"
+        "0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7"
      values.facetAddresses.1:
-        "0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B"
+        "0x10113bB3a8e64f8eD67003126adC8CE74C34610c"
      values.facetAddresses.0:
-        "0xE6426c725cB507168369c10284390E59d91eC821"
+        "0x230214F0224C7E0485f348a79512ad00514DB1F7"
      values.facets.3.0:
-        "0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"
+        "0xfd3779e6214eBBd40f5F5890351298e123A46BA6"
      values.facets.2.0:
-        "0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB"
+        "0xA57F9FFD65fC0F5792B5e958dF42399a114EC7e7"
      values.facets.1.0:
-        "0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B"
+        "0x10113bB3a8e64f8eD67003126adC8CE74C34610c"
      values.facets.0.0:
-        "0xE6426c725cB507168369c10284390E59d91eC821"
+        "0x230214F0224C7E0485f348a79512ad00514DB1F7"
      values.getL2BootloaderBytecodeHash:
-        "0x010007ed0e328b940e241f7666a6303b7ffd4e3fd7e8c154d6e7556befe6cd6d"
+        "0x010007ede999d096c84553fb514d3d6ca76fbf39789dda76bfeda9f3ae06236e"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100055b7a8be90522251be8be1a186464d056462973502ac8a0437c85e4d2a9"
+        "0x0100055b041eb28aff6e3a6e0f37c31fd053fc9ef142683b05e5f0aee6934066"
      values.getProtocolVersion:
-        20
+        21
      values.getVerifier:
-        "0x3390051435eCB25a9610A1cF17d1BA0a228A0560"
+        "0xdd9C826196cf3510B040A8784D85aE36674c7Ed2"
      values.validators.0:
-        "0xa0425d71cB1D6fb80E65a5361a04096E0672De03"
+        "0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD"
    }
```

```diff
-   Status: DELETED
    contract Verifier (0x3390051435eCB25a9610A1cF17d1BA0a228A0560)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorTimelock (0xa0425d71cB1D6fb80E65a5361a04096E0672De03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0xa8CB082A5a689E0d594d7da1E2d72A3D63aDc1bD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Verifier (0xdd9C826196cf3510B040A8784D85aE36674c7Ed2)
    +++ description: None
```

## Source code changes

```diff
.../zksync/ValidatorTimelock.sol                   |  57 ++++--
 .../zksync/interfaces/IBase.sol                    |   4 +
 .../zksync/interfaces/IExecutor.sol                |  81 +++++++-
 .../zksync/libraries/LibMap.sol                    |   8 +-
 .../ValidatorTimelock/meta.txt                     |   2 +-
 .../@openzeppelin/contracts/access/Ownable.sol     |   6 +-
 .../contracts/access/Ownable2Step.sol              |   4 +-
 .../@openzeppelin/contracts/utils/Context.sol      |   6 +-
 .../solpp-generated-contracts/zksync/Verifier.sol  |   8 +-
 .../{.code@19275529 => .code}/Verifier/meta.txt    |   2 +-
 .../solpp-generated-contracts/zksync/Config.sol    |   3 +
 .../solpp-generated-contracts/zksync/Storage.sol   |   2 +
 .../zkSync/implementation-1/meta.txt               |   2 +-
 .../solpp-generated-contracts/zksync/Storage.sol   |   2 +
 .../zkSync/implementation-2/meta.txt               |   2 +-
 .../common/L2ContractAddresses.sol                 |  15 +-
 .../solpp-generated-contracts/zksync/Config.sol    |   3 +
 .../solpp-generated-contracts/zksync/Storage.sol   |   2 +
 .../zkSync/implementation-3/meta.txt               |   2 +-
 .../common/L2ContractAddresses.sol                 |  15 +-
 .../solpp-generated-contracts/zksync/Config.sol    |   3 +
 .../solpp-generated-contracts/zksync/Storage.sol   |   2 +
 .../zksync/facets/Executor.sol                     | 214 ++++++++++++++++-----
 .../zksync/interfaces/IExecutor.sol                |  59 +++++-
 .../zkSync/implementation-4/meta.txt               |   2 +-
 25 files changed, 401 insertions(+), 105 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19275529 (main branch discovery), not current.

```diff
    contract ValidatorTimelock (0xa0425d71cB1D6fb80E65a5361a04096E0672De03) {
    +++ description: None
      values.revertedBlocks:
-        []
      values.getCommittedBatchTimestamp:
+        [0,0,0,0,0]
      errors:
+        {"getCommittedBatchTimestamp":"Too many values. Update configuration to explore fully"}
    }
```

Generated with discovered.json: 0x2a6d354fd89f8981107b3b6fa8743d24329997c7

# Diff at Wed, 21 Feb 2024 10:47:09 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9b9ae3ded14098eb8cc02dd80f4be605745e1b19 block: 19182180
- current block number: 19275529

## Description

Updated the SafeERC20 library. Deprecated some methods.

## Watched changes

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
      upgradeability.implementation:
-        "0x79Cc1DF74Ac2d1B0876498C9FcE32c7e34F57B43"
+        "0x810c6598CAaA08B61f6430Df5a8e120B3390d78A"
      implementations.0:
-        "0x79Cc1DF74Ac2d1B0876498C9FcE32c7e34F57B43"
+        "0x810c6598CAaA08B61f6430Df5a8e120B3390d78A"
    }
```

## Source code changes

```diff
.../@openzeppelin/contracts/token/ERC20/IERC20.sol |  8 +-
 .../token/ERC20/extensions/IERC20Permit.sol}       | 32 ++++++-
 .../contracts/token/ERC20/utils/SafeERC20.sol      | 99 ++++++++++++++--------
 .../@openzeppelin/contracts/utils/Address.sol      | 16 ++--
 .../bridge/L1ERC20Bridge.sol                       | 49 ++++++-----
 .../bridge/interfaces/IL1Bridge.sol                |  2 +
 .../bridge/interfaces/IL1BridgeLegacy.sol          |  2 +
 .../common/L2ContractAddresses.sol                 |  3 -
 .../common/libraries/L2ContractHelper.sol          |  2 +-
 .../solpp-generated-contracts/zksync/Storage.sol   | 42 +++++++--
 .../zksync/interfaces/IAdmin.sol                   | 36 +++++++-
 .../zksync/interfaces/IBase.sol                    |  4 +
 .../zksync/interfaces/IExecutor.sol                | 22 +++++
 .../zksync/interfaces/IGetters.sol                 | 47 +++++++++-
 .../zksync/interfaces/IMailbox.sol                 | 55 +++++++++++-
 .../zksync/interfaces/IVerifier.sol                |  8 ++
 .../zksync/interfaces/IZkSync.sol                  | 12 ++-
 .../zksync/libraries/Diamond.sol                   | 13 +--
 .../zksync/libraries/PriorityQueue.sol             |  2 +-
 .../L1ERC20Bridge/implementation/meta.txt          |  2 +-
 20 files changed, 357 insertions(+), 99 deletions(-)
```

Generated with discovered.json: 0x6ea4015640d399764ce2291a73b01d1fa8270153

# Diff at Thu, 08 Feb 2024 08:13:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9217c6a2eaa101c8d887a96cdb949f396eb72c8a block: 18968886
- current block number: 19182180

## Description

Overall big picture change is that factors used to calculate `gasPrice` can now
be changed by the governor and are not hardcoded.

### ZkSync

#### Base

Revert in `onlyGovernorOrAdmin` with error code instead of a message.
Added some comments.

### Admin

New function (`changeFeeParams`) callable only by the governor.
It overwrites data used to calculate the gasPrice for the L1 -> L2 tx.

### Diamond

The variable `DIAMOND_INIT_SUCCESS_RETURN_VALUE` changed from `constant` to `internal`.
And `DIAMOND_STORAGE_POSITION` changed from `constant` to `private`.

### PriorityQueue

Superfluous, basically comments.

### Config

Removed a bunch of configuration values:

```solidity
uint256 constant INITIAL_STORAGE_CHANGE_SERIALIZE_SIZE = 64;
uint256 constant MAX_INITIAL_STORAGE_CHANGES_COMMITMENT_BYTES = 4 + INITIAL_STORAGE_CHANGE_SERIALIZE_SIZE * 4765;
uint256 constant REPEATED_STORAGE_CHANGE_SERIALIZE_SIZE = 40;
uint256 constant MAX_REPEATED_STORAGE_CHANGES_COMMITMENT_BYTES = 4 + REPEATED_STORAGE_CHANGE_SERIALIZE_SIZE * 7564;
uint256 constant UPGRADE_NOTICE_PERIOD = 0;
uint256 constant MAX_PUBDATA_PER_BATCH = 110000;
uint256 constant PRIORITY_TX_MAX_PUBDATA = 99000;
uint256 constant FAIR_L2_GAS_PRICE = 500000000;
uint256 constant BATCH_OVERHEAD_L2_GAS = 1200000;
uint256 constant BATCH_OVERHEAD_L1_GAS = 1000000;
uint256 constant BATCH_OVERHEAD_PUBDATA = BATCH_OVERHEAD_L1_GAS / L1_GAS_PER_PUBDATA_BYTE;
uint256 constant MAX_TRANSACTIONS_IN_BATCH = 1024;
uint256 constant BOOTLOADER_TX_ENCODING_SPACE = 8740224;
```

The value `L2_TX_MAX_GAS_LIMIT` is not renamed to `MAX_GAS_PER_TRANSACTION`.

Added two new configuration values:

```solidity
uint256 constant TX_SLOT_OVERHEAD_L2_GAS = 10000; // overhead for a transaction slot in L2 gas
uint256 constant MEMORY_OVERHEAD_GAS = 10; // overhead for each byte of the bootloader memory
```

### Storage

Introduced `PubdataPricingMode` enum and `FeeParams` structure that uses that
enum. It seems like `FeeParams` is there to allow the governor to overwrite the
gas pricing/gas amounts on things that were before constant and are not removed
from the Config. The enum `PubdataPricingMode` is just a switch between
`Rollup` and `Validium`.

Deprecated the `totalDepositedAmountPerUser` field.

### Getters

Only changes are comments, or the structure of imports is different.

### Math

Syntax/formatting changes - (like `x * 8` changed to `x << 3`) - or comments.

### L2ContractHelper

The constant `CREATE2_PREFIX` is now `private`.

### L2ContractAddresses

Removed `L2_BYTECODE_COMPRESSOR_SYSTEM_CONTRACT_ADDR`.

### Mailbox

Additional comments, syntax/formatting changes. The `_deriveL2GasPrice()`
function now uses `FeeParams` to derive the gas price.

### Executor

Additional comments, syntax/formatting changes. Removed a helper function
`_maxU256()`. In `_createBatchCommitment()` the result now includes four zero
bytes32, described as to be replaced with EIP4844 commitments.

### Verifier

Two out of eight gate setup commitments changed and added some comments.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      upgradeability.facets.3:
-        "0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"
+        "0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"
      upgradeability.facets.2:
-        "0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58"
+        "0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB"
      upgradeability.facets.1:
-        "0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7"
+        "0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B"
      upgradeability.facets.0:
-        "0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967"
+        "0xE6426c725cB507168369c10284390E59d91eC821"
      implementations.3:
-        "0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"
+        "0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"
      implementations.2:
-        "0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58"
+        "0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB"
      implementations.1:
-        "0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7"
+        "0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B"
      implementations.0:
-        "0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967"
+        "0xE6426c725cB507168369c10284390E59d91eC821"
      values.facetAddresses.3:
-        "0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"
+        "0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"
      values.facetAddresses.2:
-        "0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58"
+        "0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB"
      values.facetAddresses.1:
-        "0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7"
+        "0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B"
      values.facetAddresses.0:
-        "0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967"
+        "0xE6426c725cB507168369c10284390E59d91eC821"
      values.facets.3.0:
-        "0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"
+        "0x3a4ef67C6cAb51444E5d3861843F7f4a37F64F0a"
      values.facets.2.0:
-        "0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58"
+        "0x0f58Fd6c9Ed966e09C1dFFBc8E6FF600ec65f6eB"
      values.facets.1.0:
-        "0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7"
+        "0xc4a5e861df9DD9495f8Dba1c260913d1A9b8Ec2B"
      values.facets.0.1[10]:
+        "0x17338945"
      values.facets.0.1.9:
-        "0x17338945"
+        "0x4623c91d"
      values.facets.0.1.8:
-        "0x4623c91d"
+        "0xbe6f11cf"
      values.facets.0.1.7:
-        "0xbe6f11cf"
+        "0x1cc5d103"
      values.facets.0.1.6:
-        "0x1cc5d103"
+        "0xf235757f"
      values.facets.0.1.5:
-        "0xf235757f"
+        "0x4dd18bf5"
      values.facets.0.1.4:
-        "0x4dd18bf5"
+        "0x27ae4c16"
      values.facets.0.1.3:
-        "0x27ae4c16"
+        "0xa9f6d941"
      values.facets.0.1.2:
-        "0xa9f6d941"
+        "0x64bf8d66"
      values.facets.0.0:
-        "0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967"
+        "0xE6426c725cB507168369c10284390E59d91eC821"
      values.getL2BootloaderBytecodeHash:
-        "0x01000831ba7021800f5d9103772fcc7463ed7e764a2a3624cacca6b3826172d0"
+        "0x010007ed0e328b940e241f7666a6303b7ffd4e3fd7e8c154d6e7556befe6cd6d"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100055bf7f1bc4237c2be24252fb6737cc235194139e544933c1dbf25c24ee8"
+        "0x0100055b7a8be90522251be8be1a186464d056462973502ac8a0437c85e4d2a9"
      values.getProtocolVersion:
-        19
+        20
      values.getVerifier:
-        "0xB465882F67d236DcC0D090F78ebb0d838e9719D8"
+        "0x3390051435eCB25a9610A1cF17d1BA0a228A0560"
      values.getVerifierParams.1:
-        "0x14628525c227822148e718ca1138acfc6d25e759e19452455d89f7f610c3dcb8"
+        "0x062362cb3eaf1f631406cbe19bf2a2c5d0d9ea69d069309a6003addae9f387be"
    }
```

```diff
-   Status: DELETED
    contract Verifier (0xB465882F67d236DcC0D090F78ebb0d838e9719D8) {
    }
```

```diff
+   Status: CREATED
    contract Verifier (0x3390051435eCB25a9610A1cF17d1BA0a228A0560) {
    }
```

## Source code changes

```diff
.../Verifier/Verifier.sol                          |  15 ++-
 .../Verifier/interfaces/IVerifier.sol              |   8 ++
 .../{.code@18968886 => .code}/Verifier/meta.txt    |   2 +-
 .../solpp-generated-contracts/zksync/Config.sol    |  61 +++---------
 .../solpp-generated-contracts/zksync/Storage.sol   |  42 ++++++--
 .../zksync/facets/Admin.sol                        |  59 +++++------
 .../zksync/facets/Base.sol                         |   6 +-
 .../zksync/interfaces/IAdmin.sol                   |  36 ++++++-
 .../zksync/interfaces/IBase.sol                    |   4 +
 .../zksync/interfaces/IVerifier.sol                |   8 ++
 .../zksync/libraries/Diamond.sol                   |  13 +--
 .../zksync/libraries/PriorityQueue.sol             |   2 +-
 .../zkSync/implementation-1/meta.txt               |   2 +-
 .../solpp-generated-contracts/zksync/Storage.sol   |  42 ++++++--
 .../zksync/facets/Base.sol                         |   6 +-
 .../zksync/facets/Getters.sol                      | 108 +++++++++------------
 .../zksync/interfaces/IBase.sol                    |   4 +
 .../zksync/interfaces/IGetters.sol                 |  47 ++++++++-
 .../zksync/interfaces/ILegacyGetters.sol           |  21 +++-
 .../zksync/interfaces/IVerifier.sol                |   8 ++
 .../zksync/libraries/Diamond.sol                   |  13 +--
 .../zksync/libraries/PriorityQueue.sol             |   2 +-
 .../zkSync/implementation-2/meta.txt               |   2 +-
 .../@openzeppelin/contracts/utils/math/Math.sol    |  52 +++++-----
 .../common/L2ContractAddresses.sol                 |   3 -
 .../common/libraries/L2ContractHelper.sol          |   2 +-
 .../solpp-generated-contracts/zksync/Config.sol    |  61 +++---------
 .../solpp-generated-contracts/zksync/Storage.sol   |  42 ++++++--
 .../zksync/facets/Base.sol                         |   6 +-
 .../zksync/facets/Mailbox.sol                      |  97 +++++++-----------
 .../zksync/interfaces/IBase.sol                    |   4 +
 .../zksync/interfaces/IMailbox.sol                 |  55 ++++++++++-
 .../zksync/interfaces/IVerifier.sol                |   8 ++
 .../zksync/libraries/Merkle.sol                    |   2 +-
 .../zksync/libraries/PriorityQueue.sol             |   2 +-
 .../zksync/libraries/TransactionValidator.sol      |  61 +++---------
 .../zkSync/implementation-3/meta.txt               |   2 +-
 .../common/L2ContractAddresses.sol                 |   3 -
 .../zkSync/implementation-4/meta.txt               |   2 +-
 .../zkSync/implementation-4/zksync/Config.sol      |  61 +++---------
 .../zkSync/implementation-4/zksync/Storage.sol     |  42 ++++++--
 .../zkSync/implementation-4/zksync/facets/Base.sol |   6 +-
 .../implementation-4/zksync/facets/Executor.sol    |  41 ++++----
 .../implementation-4/zksync/interfaces/IBase.sol   |   4 +
 .../zksync/interfaces/IExecutor.sol                |  22 +++++
 .../zksync/interfaces/IVerifier.sol                |   8 ++
 .../zksync/libraries/PriorityQueue.sol             |   2 +-
 47 files changed, 627 insertions(+), 472 deletions(-)
```

Generated with discovered.json: 0xb99d6a83690f166d2551d4c4cf9d8dd3b3ba1a3b

# Diff at Tue, 09 Jan 2024 10:44:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b01559086d88aef87bd572fd8173d5933affc8d9 block: 18740832
- current block number: 18968886

## Description

Overall seems like a step towards introducing a security council.
The Governance contract is improved and written in a way that allows to simply set the security councils address and increase the minimum delay.
Any reference to AllowList has been deleted in favour of Gorvernance.
Removed the deposit limit.

### L1ERC20Bridge

When calling `deposit()`, `claimFailedDeposit()` and `finalizeWithdrawal()` the `senderCanCallFunction()` modifier has been removed.
In the first two functions the call to `_verifyDepositLimit()` is no longer being made because the function has been removed.

### zkSync

- Admin facet: setting a new pending admin is done by governor only instead of governor or admin.
- Getters facet: everything related to AllowList is removed.
- Mailbox facet: when calling `finalizeEthWithdrawal()`, `requestL2Transaction()` the `senderCanCallFunction()` modifier has been removed. In the latter function the call to `_verifyDepositLimit()` is removed.

### Governance

A new contract admin of L1ERC20Bridge and ValidatorTimelock.
Owned by zkSync Era Multisig, securityCouncil set to zero.
Owner can schedule a transparent (you see the upgrade data on-chain) or a shadow (you don't see the upgrade data on-chain) upgrade.
While scheduling an upgrade the owner chooses a delay, that delay has to be bigger than `minDelay` - currently that is set to zero.
Canceling the upgrade can be done only by the owner.
The owner or security council can call `execute()` that performs the upgrade if the delay is up.
Only the security council can call `executeInstant()` that performs the upgrade even if the delay is not up.

## Watched changes

```diff
-   Status: DELETED
    contract AllowList (0x0C0dC1171258694635AA50cec5845aC1031cA6d7) {
    }
```

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      upgradeability.facets.3:
-        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
+        "0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"
      upgradeability.facets.2:
-        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
+        "0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58"
      upgradeability.facets.1:
-        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
+        "0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7"
      upgradeability.facets.0:
-        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
+        "0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967"
      implementations.3:
-        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
+        "0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"
      implementations.2:
-        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
+        "0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58"
      implementations.1:
-        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
+        "0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7"
      implementations.0:
-        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
+        "0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967"
      values.facetAddresses.3:
-        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
+        "0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"
      values.facetAddresses.2:
-        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
+        "0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58"
      values.facetAddresses.1:
-        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
+        "0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7"
      values.facetAddresses.0:
-        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
+        "0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967"
      values.facets.3.0:
-        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
+        "0xc40e5BE1a6D18DdB14268D32dc6075FCf72fF16d"
      values.facets.2.0:
-        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
+        "0x2FbF76bAE617cE41AdB9021907F02e2bF187BB58"
      values.facets.1.1[33]:
-        "0x74f4d30d"
      values.facets.1.1.32:
-        "0xb22dd78e"
+        "0x74f4d30d"
      values.facets.1.1.31:
-        "0x56142d7a"
+        "0xb22dd78e"
      values.facets.1.1.30:
-        "0x9cd939e4"
+        "0x56142d7a"
      values.facets.1.1.29:
-        "0xfacd743b"
+        "0x9cd939e4"
      values.facets.1.1.28:
-        "0xe81e0ba1"
+        "0xfacd743b"
      values.facets.1.1.27:
-        "0xc3bbd2d7"
+        "0xe81e0ba1"
      values.facets.1.1.26:
-        "0xbd7c5412"
+        "0xc3bbd2d7"
      values.facets.1.1.25:
-        "0x29b98c67"
+        "0xbd7c5412"
      values.facets.1.1.24:
-        "0x18e3a941"
+        "0x29b98c67"
      values.facets.1.1.23:
-        "0x46657fe9"
+        "0x18e3a941"
      values.facets.1.1.22:
-        "0xa1954fc5"
+        "0x46657fe9"
      values.facets.1.1.21:
-        "0xaf6a2dcd"
+        "0xa1954fc5"
      values.facets.1.1.20:
-        "0x39607382"
+        "0xaf6a2dcd"
      values.facets.1.1.19:
-        "0xfe26699e"
+        "0x39607382"
      values.facets.1.1.18:
-        "0xef3f0bae"
+        "0xfe26699e"
      values.facets.1.1.17:
-        "0xb8c2f66f"
+        "0xef3f0bae"
      values.facets.1.1.16:
-        "0xdb1f0bf9"
+        "0xb8c2f66f"
      values.facets.1.1.15:
-        "0x33ce93fe"
+        "0xdb1f0bf9"
      values.facets.1.1.14:
-        "0x0ec6b0b7"
+        "0x33ce93fe"
      values.facets.1.1.13:
-        "0x631f4bac"
+        "0x0ec6b0b7"
      values.facets.1.1.12:
-        "0x8665b150"
+        "0x631f4bac"
      values.facets.1.1.11:
-        "0x7b30c8da"
+        "0x8665b150"
      values.facets.1.1.10:
-        "0x9d1b5a81"
+        "0x7b30c8da"
      values.facets.1.1.9:
-        "0xe5355c75"
+        "0x9d1b5a81"
      values.facets.1.1.8:
-        "0xfd791f3c"
+        "0xe5355c75"
      values.facets.1.1.7:
-        "0xd86970d8"
+        "0xfd791f3c"
      values.facets.1.1.6:
-        "0x4fc07d75"
+        "0xd86970d8"
      values.facets.1.1.5:
-        "0x79823c9a"
+        "0x4fc07d75"
      values.facets.1.1.4:
-        "0xa7cd63b7"
+        "0x79823c9a"
      values.facets.1.0:
-        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
+        "0x5edb1756c0A0F933EB87f9d69DfA1db3167547a7"
      values.facets.0.0:
-        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
+        "0xAeA49FCEbe3A93ADaE67FF668C0ac87799537967"
      values.getAllowList:
-        "0x0C0dC1171258694635AA50cec5845aC1031cA6d7"
      values.getGovernor:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
      values.getL2BootloaderBytecodeHash:
-        "0x01000983d4ac4f797cf5c077e022f72284969b13248c2a8e9846f574bdeb5b88"
+        "0x01000831ba7021800f5d9103772fcc7463ed7e764a2a3624cacca6b3826172d0"
      values.getL2DefaultAccountBytecodeHash:
-        "0x01000651c5ae96f2aab07d720439e42491bb44c6384015e3a08e32620a4d582d"
+        "0x0100055bf7f1bc4237c2be24252fb6737cc235194139e544933c1dbf25c24ee8"
      values.getProtocolVersion:
-        18
+        19
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
      upgradeability.implementation:
-        "0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"
+        "0x79Cc1DF74Ac2d1B0876498C9FcE32c7e34F57B43"
      upgradeability.admin:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
      implementations.0:
-        "0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"
+        "0x79Cc1DF74Ac2d1B0876498C9FcE32c7e34F57B43"
    }
```

```diff
    contract ValidatorTimelock (0xa0425d71cB1D6fb80E65a5361a04096E0672De03) {
      values.owner:
-        "0x4e4943346848c4867F81dFb37c4cA9C5715A7828"
+        "0x0b622A2061EaccAE1c664eBC3E868b8438e03F61"
    }
```

```diff
+   Status: CREATED
    contract Governance (0x0b622A2061EaccAE1c664eBC3E868b8438e03F61) {
    }
```

## Source code changes

```diff
.../common/AllowList.sol => /dev/null              | 142 -----------
 .../common/interfaces/IAllowList.sol => /dev/null  |  73 ------
 .../libraries/UncheckedMath.sol => /dev/null       |  24 --
 .../.code@18740832/AllowList/meta.txt => /dev/null |   2 -
 .../@openzeppelin/contracts/access/Ownable.sol     |   0
 .../contracts/access/Ownable2Step.sol              |   0
 .../@openzeppelin/contracts/utils/Context.sol      |   0
 .../governance/Governance.sol                      | 265 +++++++++++++++++++++
 .../governance/IGovernance.sol                     |  83 +++++++
 .../zksync2/ethereum/.code/Governance/meta.txt     |   2 +
 .../bridge/L1ERC20Bridge.sol                       |  37 +--
 .../common/AllowListed.sol => /dev/null            |  19 --
 .../common/interfaces/IAllowList.sol => /dev/null  |  73 ------
 .../solpp-generated-contracts/zksync/Storage.sol   |   3 +-
 .../zksync/interfaces/IGetters.sol                 |   2 -
 .../L1ERC20Bridge/implementation/meta.txt          |   2 +-
 .../common/AllowListed.sol => /dev/null            |  19 --
 .../common/interfaces/IAllowList.sol => /dev/null  |  73 ------
 .../solpp-generated-contracts/zksync/Storage.sol   |   3 +-
 .../zksync/facets/Admin.sol                        |   2 +-
 .../zksync/facets/Base.sol                         |   3 +-
 .../zkSync/implementation-1/meta.txt               |   2 +-
 .../common/AllowListed.sol => /dev/null            |  19 --
 .../common/interfaces/IAllowList.sol => /dev/null  |  73 ------
 .../solpp-generated-contracts/zksync/Storage.sol   |   3 +-
 .../zksync/facets/Base.sol                         |   3 +-
 .../zksync/facets/Getters.sol                      |   5 -
 .../zksync/interfaces/IGetters.sol                 |   2 -
 .../zkSync/implementation-2/meta.txt               |   2 +-
 .../common/AllowListed.sol => /dev/null            |  19 --
 .../common/interfaces/IAllowList.sol => /dev/null  |  73 ------
 .../solpp-generated-contracts/zksync/Storage.sol   |   3 +-
 .../zksync/facets/Base.sol                         |   3 +-
 .../zksync/facets/Mailbox.sol                      |  16 +-
 .../zkSync/implementation-3/meta.txt               |   2 +-
 .../common/AllowListed.sol => /dev/null            |  19 --
 .../common/interfaces/IAllowList.sol => /dev/null  |  73 ------
 .../zkSync/implementation-4/meta.txt               |   2 +-
 .../zkSync/implementation-4/zksync/Storage.sol     |   3 +-
 .../zkSync/implementation-4/zksync/facets/Base.sol |   3 +-
 40 files changed, 373 insertions(+), 779 deletions(-)
```

# Diff at Fri, 08 Dec 2023 10:06:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@30e367cba0866d89eb0bd930461090359c5d3f4a

## Description

The big picture of these changes are the following:

- Migrated Solidity from 0.8.13 to 0.8.20.
- Moved from working on blocks to working on batches.
- Any mention to Security Council have been removed, contracts have been simplified basing on that fact
- Refactor and updates of the verifier algorithm

Here follows a description of changes to each particular contract.

### LibMap

A new library described as "Library for storage of packed unsigned integers".
Taken from open-source solady library package (https://github.com/Vectorized/solady).
It's just an gas optimized uint32 array.
It seems like they just extracted what they needed from it, because the solady version supports more than just uint32s.

### ValidatorTimelock

Uses LibMap to replace a mapping of `uint256 => uint256`, it mapped from the block number to the block timestamp.
Right now using LibMap they essentially have `uint64 => uint32`, it maps from batch number to the block timestamp.
The timestamp is truncated to `uint32`, this will wrap in the year 2106.
They have introduced a getter for the timestamp of the block `getCommittedBatchTimestamp`, but it's not used by any of the code.
In `executeBatches` the assertion changed from `require(block.timestamp > commitBlockTimestamp + delay)` to `require(block.timestamp >= commitBatchTimestamp + delay)`, now it's inclusive.

### L1ERC20Bridge

Moved to batches, simple renames.

### Diamond

Better check for facet without code, instead of doing `require(_facet != address(0))` they now do `require(_facet.code.length > 0)`.
Reverts in `_initializeDiamondCut()` will now revert with decoded calldata if it's possible, if not it will just revert with the previous error code.

### Verifier

Extracted an interface into IVerifier.
Verifier now a single file contract, where before it included `PairingsBn254.sol`, `TranscriptLib.sol`, `Plonk4VerifierWithAccessToDNext.sol`.
It was flattened and refactored for readability, but I'm unable to verify that this is the same verification algorithm.

### Storage

`UpgradeStorage upgrades` is now deprecated.
A new role, called `admin` and `pendingAdmin`.

### Base

Removed `onlySecurityCouncil` modifier and added `onlyGovernorOrAdmin`.

### AllowList

New event

```
event UpdateDepositLimit(address indexed l1Token, bool depositLimitation, uint256 depositCap);
```

that is emitted in the call to this function - that is in AllowList.sol:

```
function setDepositLimit(address _l1Token, bool _depositLimitation, uint256 _depositCap) external onlyOwner
```

### zkSync

Facets:

- changed from DiamondCut => Admin (0x409560DE546e057ce5bD5dB487EdF2bB5E785baB)
- same => Getters (0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4)
- same => Mailbox (0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08)
- same => Executor (0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269)

The 5th facet was Governance facet, it was removed so we now have 4 facets instead of 5.
The first facet (DiamondCut) has been replaced with Admin.

#### Admin

Admin is an implementation of IAdmin interface.
That interface is a combination of IGovernance and IDiamondCut.
IAdmin implements the entire IGovernance interface.
It also implements parts of the IDiamondCut interface, like `executeUpgrade()`, `freezeDiamond()` and `unfreezeDiamond()`.
Everything relating to proposal and security council has been removed.
The new functions that were in neither of these two interfaces are `setPendingAdmin()` and `acceptAdmin()`.
Implementation of Admin is a combination of implementations for Governance and DiamondCut facets from before.

#### Getters

The default IGetters interface has moved to working on batches instead of blocks.
Additionally getters for functions referencing Security Council have been removed (since they returned zero addresses either way).
The legacy interface is still supported, but it just returns the values in batches.

#### Mailbox

Variable renaming to move to batches instead of blocks

#### Executor

Batch commitment uses three inputs: pass through from batches, meta params and auxiliary output from the batch.
The first two, stay the same after the update.
But the third input (auxiliary output from the batch) changed most of the input that it takes.
Right now, the prover verifies both the main and the recursive proof in the same step.
Refactored the way logs from L2 indicate what they are, instead of different senders use `logKeys` and `logValues`.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      upgradeability.facets[4]:
-        "0x2E64926BE35412f7710A3E097Ba076740bF97CC0"
      upgradeability.facets.3:
-        "0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b"
+        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
      upgradeability.facets.2:
-        "0x62aA95ac4740A367746A664C4C69034d52E968EF"
+        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
      upgradeability.facets.1:
-        "0x7444DE636699F080cA1C033528D2bB3705B391Ce"
+        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
      upgradeability.facets.0:
-        "0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4"
+        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
      implementations[4]:
-        "0x2E64926BE35412f7710A3E097Ba076740bF97CC0"
      implementations.3:
-        "0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b"
+        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
      implementations.2:
-        "0x62aA95ac4740A367746A664C4C69034d52E968EF"
+        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
      implementations.1:
-        "0x7444DE636699F080cA1C033528D2bB3705B391Ce"
+        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
      implementations.0:
-        "0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4"
+        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
      values.facetAddresses[4]:
-        "0x2E64926BE35412f7710A3E097Ba076740bF97CC0"
      values.facetAddresses.3:
-        "0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b"
+        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
      values.facetAddresses.2:
-        "0x62aA95ac4740A367746A664C4C69034d52E968EF"
+        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
      values.facetAddresses.1:
-        "0x7444DE636699F080cA1C033528D2bB3705B391Ce"
+        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
      values.facetAddresses.0:
-        "0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4"
+        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
      values.facets[4]:
-        ["0x2E64926BE35412f7710A3E097Ba076740bF97CC0",["0xe58bb639","0xf235757f","0x1cc5d103","0xbe6f11cf","0x4623c91d"]]
      values.facets.3.1.3:
-        "0xa9a2d18a"
+        "0x97c09d34"
      values.facets.3.1.2:
-        "0x7739cbe7"
+        "0x7f61885c"
      values.facets.3.1.1:
-        "0xce9dcf16"
+        "0xc3d93e7c"
      values.facets.3.1.0:
-        "0x0c4dd810"
+        "0x701f58c5"
      values.facets.3.0:
-        "0x7Ed066718Dfb1b2B04D94780Eca92b67ECF3330b"
+        "0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269"
      values.facets.2.0:
-        "0x62aA95ac4740A367746A664C4C69034d52E968EF"
+        "0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08"
      values.facets.1.1[34]:
-        "0x74f4d30d"
      values.facets.1.1.33:
-        "0x56142d7a"
+        "0x74f4d30d"
      values.facets.1.1.32:
-        "0x9cd939e4"
+        "0xb22dd78e"
      values.facets.1.1.31:
-        "0xfacd743b"
+        "0x56142d7a"
      values.facets.1.1.30:
-        "0xe81e0ba1"
+        "0x9cd939e4"
      values.facets.1.1.29:
-        "0xc3bbd2d7"
+        "0xfacd743b"
      values.facets.1.1.28:
-        "0xbd7c5412"
+        "0xe81e0ba1"
      values.facets.1.1.27:
-        "0x29b98c67"
+        "0xc3bbd2d7"
      values.facets.1.1.26:
-        "0x3db920ce"
+        "0xbd7c5412"
      values.facets.1.1.25:
-        "0x18e3a941"
+        "0x29b98c67"
      values.facets.1.1.24:
-        "0x46657fe9"
+        "0x18e3a941"
      values.facets.1.1.23:
-        "0xa39980a0"
+        "0x46657fe9"
      values.facets.1.1.18:
-        "0x0ef240a0"
+        "0xef3f0bae"
      values.facets.1.1.17:
-        "0x33ce93fe"
+        "0xb8c2f66f"
      values.facets.1.1.16:
-        "0xe39d3bff"
+        "0xdb1f0bf9"
      values.facets.1.1.15:
-        "0x1b60e626"
+        "0x33ce93fe"
      values.facets.1.1.9:
-        "0xfd791f3c"
+        "0xe5355c75"
      values.facets.1.1.8:
-        "0xd86970d8"
+        "0xfd791f3c"
      values.facets.1.1.7:
-        "0x4fc07d75"
+        "0xd86970d8"
      values.facets.1.1.6:
-        "0x79823c9a"
+        "0x4fc07d75"
      values.facets.1.1.5:
-        "0xfe10226d"
+        "0x79823c9a"
      values.facets.1.0:
-        "0x7444DE636699F080cA1C033528D2bB3705B391Ce"
+        "0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4"
      values.facets.0.1[9]:
+        "0x17338945"
      values.facets.0.1[8]:
+        "0x4623c91d"
      values.facets.0.1.7:
-        "0x587809c7"
+        "0xbe6f11cf"
      values.facets.0.1.6:
-        "0x17338945"
+        "0x1cc5d103"
      values.facets.0.1.5:
-        "0xbeda4b12"
+        "0xf235757f"
      values.facets.0.1.4:
-        "0x8043760a"
+        "0x4dd18bf5"
      values.facets.0.1.3:
-        "0x0551448c"
+        "0x27ae4c16"
      values.facets.0.1.2:
-        "0x27ae4c16"
+        "0xa9f6d941"
      values.facets.0.1.1:
-        "0x36d4eb84"
+        "0xe58bb639"
      values.facets.0.1.0:
-        "0x73fb9297"
+        "0x0e18b681"
      values.facets.0.0:
-        "0xdC7c3D03845EfE2c4a9E758A70a68BA6bba9FaC4"
+        "0x409560DE546e057ce5bD5dB487EdF2bB5E785baB"
      values.getAllowList:
-        "0x8ffd57A9B2dcc10327768b601468FA192adC5C86"
+        "0x0C0dC1171258694635AA50cec5845aC1031cA6d7"
      values.getCurrentProposalId:
-        11
      values.getL2BootloaderBytecodeHash:
-        "0x0100089b8a2f2e6a20ba28f02c9e0ed0c13d702932364561a0ea61621f65f0a8"
+        "0x01000983d4ac4f797cf5c077e022f72284969b13248c2a8e9846f574bdeb5b88"
      values.getL2DefaultAccountBytecodeHash:
-        "0x0100067d16a5485875b4249040bf421f53e869337fe118ec747cf40a4c777e5f"
+        "0x01000651c5ae96f2aab07d720439e42491bb44c6384015e3a08e32620a4d582d"
      values.getProposedUpgradeHash:
-        "0x31e9893a0c33de66bfd89adc9068af6500d315f89c83cb52f018b8dd002faa6c"
      values.getProposedUpgradeTimestamp:
-        1701681527
      values.getProtocolVersion:
-        17
+        18
      values.getSecurityCouncil:
-        "0x0000000000000000000000000000000000000000"
      values.getUpgradeProposalState:
-        1
      values.getVerifier:
-        "0x3F04F86f14aB74953fDAEde8175e0714eB8e798e"
+        "0xB465882F67d236DcC0D090F78ebb0d838e9719D8"
      values.getVerifierParams.2:
-        "0x18c1639094f58177409186e8c48d9f577c9410901d2f1d486b3e7d6cf553ae4c"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getVerifierParams.1:
-        "0x101e08b00193e529145ee09823378ef51a3bc8966504064f1f6ba3f1ba863210"
+        "0x14628525c227822148e718ca1138acfc6d25e759e19452455d89f7f610c3dcb8"
      values.getVerifierParams.0:
-        "0x1186ec268d49f1905f8d9c1e9d39fc33e98c74f91d91a21b8f7ef78bd09a8db8"
+        "0x5a3ef282b21e12fe1f4438e5bb158fc5060b160559c5158c6389d62d9fe3d080"
      values.isApprovedBySecurityCouncil:
-        false
      values.validators.0:
-        "0x3dB52cE065f728011Ac6732222270b3F2360d919"
+        "0xa0425d71cB1D6fb80E65a5361a04096E0672De03"
      values.getL2SystemContractsUpgradeBatchNumber:
+        0
      values.getTotalBatchesCommitted:
+        336365
      values.getTotalBatchesExecuted:
+        335480
      values.getTotalBatchesVerified:
+        336239
      values.storedBatchHash:
+        ["0x0ac272ab86763ec2bc093492128eb0bb7afac0ddb385e4ceb2fdb107f2946f2b","0x476876ca9c9fa49b1390ae47a04f7434936b77c22af7a055077f2e3486e6fb65","0x41de068e7043f90c7a5b6c9c80251979c333dc931859a2ec10ef17c9032db250","0x545ada4b4f784c3a471137da517a9f99ae401c7daa63d951a20222605b12ccbf","0xdf353be1f590760d533530c19b53309dde820f3c962a5317c89bcd299130c834"]
      errors:
+        {"storedBatchHash":"Too many values. Update configuration to explore fully"}
    }
```

```diff
-   Status: DELETED
    contract ValidatorTimelock (0x3dB52cE065f728011Ac6732222270b3F2360d919) {
    }
```

```diff
-   Status: DELETED
    contract Verifier (0x3F04F86f14aB74953fDAEde8175e0714eB8e798e) {
    }
```

```diff
    contract L1ERC20Bridge (0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063) {
      upgradeability.implementation:
-        "0x7FB17101A744e156e63d5fF6A4775fb48756577c"
+        "0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"
      implementations.0:
-        "0x7FB17101A744e156e63d5fF6A4775fb48756577c"
+        "0x03F3F3c12e11C2FAA60080bd3F7f80AADF369a33"
    }
```

```diff
-   Status: DELETED
    contract AllowList (0x8ffd57A9B2dcc10327768b601468FA192adC5C86) {
    }
```

```diff
+   Status: CREATED
    contract AllowList (0x0C0dC1171258694635AA50cec5845aC1031cA6d7) {
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0xa0425d71cB1D6fb80E65a5361a04096E0672De03) {
    }
```

```diff
+   Status: CREATED
    contract Verifier (0xB465882F67d236DcC0D090F78ebb0d838e9719D8) {
    }
```

## Source code changes

```diff
.../solpp-generated-contracts/common/AllowList.sol |   31 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../{.code@18713118 => .code}/AllowList/meta.txt   |    2 +-
 .../bridge/L1ERC20Bridge.sol                       |   88 +-
 .../bridge/interfaces/IL1Bridge.sol                |   12 +-
 .../bridge/interfaces/IL1BridgeLegacy.sol          |    2 +-
 .../bridge/interfaces/IL2Bridge.sol                |    8 +-
 .../bridge/interfaces/IL2ERC20Bridge.sol           |    8 +-
 .../libraries/BridgeInitializationHelper.sol       |    3 +-
 .../common/AllowListed.sol                         |    3 +-
 .../common/L2ContractAddresses.sol                 |   14 +-
 .../common/ReentrancyGuard.sol                     |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/interfaces/IL2ContractDeployer.sol      |    8 +-
 .../common/libraries/L2ContractHelper.sol          |    9 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../common/libraries/UnsafeBytes.sol               |    3 +-
 .../vendor/AddressAliasHelper.sol                  |    2 +-
 .../dev/null                                       |  704 --------
 .../solpp-generated-contracts/zksync/Storage.sol   |   69 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/interfaces/IAdmin.sol}                  |   32 +-
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IDiamondCut.sol => /dev/null |   48 -
 .../zksync/interfaces/IExecutor.sol                |  111 +-
 .../zksync/interfaces/IGetters.sol                 |   29 +-
 .../zksync/interfaces/IGovernance.sol => /dev/null |   63 -
 .../zksync/interfaces/IMailbox.sol                 |   19 +-
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../zksync/interfaces/IZkSync.sol                  |    7 +-
 .../zksync/libraries/Diamond.sol                   |   44 +-
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../L1ERC20Bridge/implementation/meta.txt          |    2 +-
 .../zksync/ValidatorTimelock.sol                   |  102 +-
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IExecutor.sol                |  113 +-
 .../zksync/libraries/LibMap.sol                    |   64 +
 .../ValidatorTimelock/meta.txt                     |    2 +-
 .../zksync2/ethereum/.code/Verifier/Verifier.sol   | 1712 ++++++++++++++++++++
 .../libraries/UncheckedMath.sol => /dev/null       |   19 -
 .../.code/Verifier/interfaces/IVerifier.sol        |   15 +
 .../{.code@18713118 => .code}/Verifier/meta.txt    |    2 +-
 .../dev/null                                       |  704 --------
 .../Verifier/zksync/Verifier.sol => /dev/null      |  239 ---
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../common/AllowListed.sol                         |    3 +-
 .../common/ReentrancyGuard.sol                     |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../solpp-generated-contracts/zksync/Config.sol    |   46 +-
 .../dev/null                                       |  704 --------
 .../solpp-generated-contracts/zksync/Storage.sol   |   60 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/facets/Admin.sol                        |  129 ++
 .../zksync/facets/Base.sol                         |   15 +-
 .../zksync/facets/DiamondCut.sol => /dev/null      |  202 ---
 .../zksync/interfaces/IAdmin.sol                   |   63 +
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IDiamondCut.sol => /dev/null |   48 -
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../zksync/libraries/Diamond.sol                   |   31 +-
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../zkSync/implementation-1/meta.txt               |    4 +-
 .../common/AllowListed.sol                         |    3 +-
 .../common/ReentrancyGuard.sol                     |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../dev/null                                       |  704 --------
 .../solpp-generated-contracts/zksync/Storage.sol   |   60 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/facets/Base.sol                         |   15 +-
 .../zksync/facets/Getters.sol                      |  126 +-
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IGetters.sol                 |   28 +-
 .../zksync/interfaces/ILegacyGetters.sol           |   22 +
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../zksync/libraries/Diamond.sol                   |   31 +-
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../zkSync/implementation-2/meta.txt               |    2 +-
 .../common/AllowListed.sol                         |    3 +-
 .../common/L2ContractAddresses.sol                 |   14 +-
 .../common/ReentrancyGuard.sol                     |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../common/libraries/L2ContractHelper.sol          |    9 +-
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../common/libraries/UnsafeBytes.sol               |    3 +-
 .../vendor/AddressAliasHelper.sol                  |    2 +-
 .../solpp-generated-contracts/zksync/Config.sol    |   46 +-
 .../dev/null                                       |  704 --------
 .../solpp-generated-contracts/zksync/Storage.sol   |   60 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/facets/Base.sol                         |   15 +-
 .../zksync/facets/Mailbox.sol                      |  115 +-
 .../zksync/interfaces/IBase.sol                    |    2 +-
 .../zksync/interfaces/IMailbox.sol                 |   19 +-
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../zksync/libraries/Merkle.sol                    |    5 +-
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../zksync/libraries/TransactionValidator.sol      |   41 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../zkSync/implementation-3/meta.txt               |    2 +-
 .../zkSync/implementation-4/common/AllowListed.sol |    3 +-
 .../common/L2ContractAddresses.sol                 |   14 +-
 .../implementation-4/common/ReentrancyGuard.sol    |    7 +-
 .../common/interfaces/IAllowList.sol               |   30 +-
 .../libraries/L2ContractHelper.sol => /dev/null    |   74 -
 .../common/libraries/UncheckedMath.sol             |    7 +-
 .../common/libraries/UnsafeBytes.sol               |    3 +-
 .../zkSync/implementation-4/meta.txt               |    2 +-
 .../zkSync/implementation-4/zksync/Config.sol      |   46 +-
 .../dev/null                                       |  704 --------
 .../zkSync/implementation-4/zksync/Storage.sol     |   60 +-
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zkSync/implementation-4/zksync/facets/Base.sol |   15 +-
 .../implementation-4/zksync/facets/Executor.sol    |  546 +++----
 .../implementation-4/zksync/interfaces/IBase.sol   |    2 +-
 .../zksync/interfaces/IExecutor.sol                |  111 +-
 .../zksync/interfaces/IVerifier.sol                |   15 +
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../zksync/libraries/PriorityQueue.sol             |    3 +-
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 .../common/AllowListed.sol => /dev/null            |   18 -
 .../common/ReentrancyGuard.sol => /dev/null        |   89 -
 .../common/interfaces/IAllowList.sol => /dev/null  |   87 -
 .../libraries/UncheckedMath.sol => /dev/null       |   19 -
 .../zkSync/implementation-5/meta.txt => /dev/null  |    2 -
 .../dev/null                                       |  704 --------
 .../zksync/Storage.sol => /dev/null                |  138 --
 .../zksync/Verifier.sol => /dev/null               |  239 ---
 .../zksync/facets/Base.sol => /dev/null            |   33 -
 .../zksync/facets/Governance.sol => /dev/null      |   74 -
 .../libraries/PairingsBn254.sol => /dev/null       |  277 ----
 .../libraries/PriorityQueue.sol => /dev/null       |   83 -
 .../libraries/TranscriptLib.sol => /dev/null       |   49 -
 143 files changed, 3430 insertions(+), 11097 deletions(-)
```

# Diff at Mon, 04 Dec 2023 12:52:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@11f81c3217315242a2af781f1c2528aa4938b44c

## Description

A new upgrade proposal has been detected.
Implementations:
DefaultUpgrade: 0x567e1B57A80a7F048A7402191F96C62730e30dB2
AdminFacet: 0x409560DE546e057ce5bD5dB487EdF2bB5E785baB
GettersFacet: 0xF3ACF6a03ea4a914B78Ec788624B25ceC37c14A4
MailboxFacet: 0x63b5EC36B09384fFA7106A80Ec7cfdFCa521fD08
ExecutorFacet: 0x9e3Fa34a10619fEDd7aE40A3fb86FA515fcfd269

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getCurrentProposalId:
-        10
+        11
      values.getProposedUpgradeHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x31e9893a0c33de66bfd89adc9068af6500d315f89c83cb52f018b8dd002faa6c"
      values.getProposedUpgradeTimestamp:
-        0
+        1701681527
      values.getUpgradeProposalState:
-        0
+        1
    }
```

# Diff at Tue, 21 Nov 2023 15:32:06 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@c91f8874e3c01dd4c477491e11cff7b3c664ef34

## Description

Change in the zkSync Era Multisig owners - one address is removed and another is added.

## Watched changes

```diff
    contract zkSync Era Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
      values.getOwners.7:
-        "0xa265146cA40F52cfC439888D0b4291b5440e6769"
+        "0x700DA14328eC2F81053E5B6aAE4803E16BEdF1df"
    }
```

# Diff at Thu, 02 Nov 2023 07:24:20 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9b49ec4aa1d93626f3f30c0e914cb12bb6670dbd

## Description

Proposal updates (the upgrade is executed): a verification key has been updated, meaning that the circuit has been updated.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getProposedUpgradeHash:
-        "0x306f3cc703e0e1ab18693aab35276f2dbc745f5de480cee904d05de511ca8415"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getProposedUpgradeTimestamp:
-        1698826475
+        0
      values.getProtocolVersion:
-        16
+        17
      values.getUpgradeProposalState:
-        1
+        0
      values.getVerifierParams.2:
-        "0x236c97bfbe75ff507e03909fae32a78be3a70d1b468b183f430010810284ed45"
+        "0x18c1639094f58177409186e8c48d9f577c9410901d2f1d486b3e7d6cf553ae4c"
    }
```

# Diff at Wed, 01 Nov 2023 11:26:01 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@d5598e9a46a99374387c1df455805e40f3d361a7

## Description

A new proposal is detected.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getCurrentProposalId:
-        9
+        10
      values.getProposedUpgradeHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x306f3cc703e0e1ab18693aab35276f2dbc745f5de480cee904d05de511ca8415"
      values.getProposedUpgradeTimestamp:
-        0
+        1698826475
      values.getUpgradeProposalState:
-        0
+        1
    }
```

# Diff at Fri, 27 Oct 2023 10:26:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@f531a9c18fd564738c9f66b8b1e5c04730dce464

## Description

A new proposal has been detected.

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getCurrentProposalId:
-        8
+        9
      values.getProtocolVersion:
-        15
+        16
    }
```

# Diff at Tue, 26 Sep 2023 10:27:16 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getProposedUpgradeHash:
-        "0x7d39289c3d9fd4fd8d86ed97abcdcfe208677042a65de6cccb91dc97e2936be9"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.getProposedUpgradeTimestamp:
-        1695294167
+        0
      values.getProtocolVersion:
-        14
+        15
      values.getUpgradeProposalState:
-        1
+        0
      values.getVerifierParams.2:
-        "0x0a3657f884af32d3a573c5fdb3440c9ac45271ede8c982faeaae7434d032ab3e"
+        "0x236c97bfbe75ff507e03909fae32a78be3a70d1b468b183f430010810284ed45"
    }
```

```diff
    contract ValidatorTimelock (0x3dB52cE065f728011Ac6732222270b3F2360d919) {
      values.revertedBlocks:
+        []
    }
```

# Diff at Thu, 21 Sep 2023 12:39:16 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@36d4050a6ee5a543b2163fe6e44153b540b87c16

## Watched changes

```diff
    contract zkSync (0x32400084C286CF3E17e7B677ea9583e60a000324) {
      values.getCurrentProposalId:
-        7
+        8
      values.getProposedUpgradeHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x7d39289c3d9fd4fd8d86ed97abcdcfe208677042a65de6cccb91dc97e2936be9"
      values.getProposedUpgradeTimestamp:
-        0
+        1695294167
      values.getUpgradeProposalState:
-        0
+        1
    }
```

```diff
    contract zkSync Era Multisig (0x4e4943346848c4867F81dFb37c4cA9C5715A7828) {
      values.getOwners.1:
-        "0xd7aF418d98C0F8EDbaa407fc30ad10382286F36F"
+        "0xe79af29d618141Ffef951B240b250d47030D56d7"
    }
```
