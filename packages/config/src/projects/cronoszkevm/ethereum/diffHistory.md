Generated with discovered.json: 0x9e411ad3d8a33186155733bdaae730702a09c59f

# Diff at Tue, 11 Mar 2025 08:00:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 21766582
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
 .../.flat@21766582/Guardians.sol => /dev/null      | 1439 --------------------
 .../ProtocolUpgradeHandler.sol => /dev/null        |  605 --------
 .../SecurityCouncil.sol => /dev/null               | 1389 -------------------
 4 files changed, 4666 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

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

Generated with discovered.json: 0xb5c0ee9ad913e7e2e814bee0bd66e309bcb85f53

# Diff at Tue, 04 Mar 2025 10:39:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21766582
- current block number: 21766582

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

```diff
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66) {
    +++ description: Implements the ZK proof verification logic.
      sinceBlock:
+        21081436
    }
```

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      sinceBlock:
+        20524449
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
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      sinceBlock:
+        20802749
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      sinceBlock:
+        20420571
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      sinceBlock:
+        20416268
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      sinceBlock:
+        20422122
    }
```

Generated with discovered.json: 0xe52421a90156d2ee27c54185a116f07ed7990a52

# Diff at Wed, 26 Feb 2025 10:32:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21766582
- current block number: 21766582

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

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
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x6accf4d7afa41a9022fa986a7a65ece23100f835

# Diff at Tue, 04 Feb 2025 12:30:55 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21766582
- current block number: 21766582

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21766582 (main branch discovery), not current.

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
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
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      issuedPermissions.4.permission:
-        "configure"
+        "interact"
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
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x5be1bc8e4d51f2f88d9da52f09f3bb1f5ca6b1de

# Diff at Mon, 03 Feb 2025 14:33:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 21721078
- current block number: 21766582

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
discovery. Values are for block 21721078 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
      values.priorityQueueFrontOperation:
-        {"canonicalTxHash":"0x8a73a91142980f05c9e362c18105924b03a060a64713514f9078ed67f4dd4ceb","expirationTimestamp":1737962003,"layer2Tip":0}
    }
```

Generated with discovered.json: 0x4fd34a1498fdc78348d91472ab608bb4dac4cb3c

# Diff at Tue, 28 Jan 2025 06:34:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 21686341
- current block number: 21721078

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21686341 (main branch discovery), not current.

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
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]
    }
```

```diff
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      values.acAdmins:
+        ["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce","0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"]
      directlyReceivedPermissions:
+        [{"permission":"configure","from":"0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role)."}]
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: The main contract defining the Layer 2. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract and then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.
+++ description: This contract must expose the ITransactionFilterer interface (see Mailbox facet) and is used for censoring transactions pushed from L1 to L2.
+++ severity: HIGH
      values.txFilterer.0:
-        {"oldTransactionFilterer":"0x0000000000000000000000000000000000000000","newTransactionFilterer":"0xA8998F231a660Eca365B382943c71ad9b7619139"}
+        "0xA8998F231a660Eca365B382943c71ad9b7619139"
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
+        [{"permission":"configure","to":"0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]},{"permission":"configure","to":"0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E","description":"commit, prove, execute, revert batches directly in the main Diamond contract. This role is typically held by a proxying ValidatorTimelock.","via":[]},{"permission":"configure","to":"0xA8998F231a660Eca365B382943c71ad9b7619139","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet.","via":[]},{"permission":"configure","to":"0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]},{"permission":"configure","to":"0xfD7a03Cdb68E6488F950108A4d24f15519b87339","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]}]
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      severity:
+        "HIGH"
      issuedPermissions:
+        [{"permission":"configure","to":"0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b","description":"manage the blacklist of addresses in the TransactionFilterer.","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","description":"define addresses that can send transactions from L1 to L2 (e.g. for deposits, withdrawals, queued transactions). This is enforced in the Mailbox Facet."}]
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc","description":"manage fees, apply predefined upgrades and manage censorship through a TransactionFilterer (ChainAdmin role).","via":[{"address":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]},{"permission":"configure","from":"0xA8998F231a660Eca365B382943c71ad9b7619139","description":"manage the blacklist of addresses in the TransactionFilterer."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"}]
    }
```

```diff
+   Status: CREATED
    contract ValidatorTimelock (0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E)
    +++ description: Intermediary contract between the *Validators* and the central diamond contract that delays block execution (ie withdrawals and other L2 --> L1 messages) by 21h.
```

Generated with discovered.json: 0x5e8e0d515eadb4b77c41c006266778320ea52b99

# Diff at Thu, 23 Jan 2025 09:37:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c34926fa70131af78b4ff8ff2873e9c9f24dfc80 block: 21678734
- current block number: 21686341

## Description

Upgrade to v25 completed.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.getL2SystemContractsUpgradeBatchNumber:
-        268
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        268
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x05741105616b1542773967c3b52b45948335239c

# Diff at Wed, 22 Jan 2025 08:09:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae0363af45e5c1f3ac9d68ef4ce62fdaada6de1c block: 20876242
- current block number: 21678734

## Description

Upgrade to the known protocol version 25! ['protocol defence' upgrade](https://github.com/matter-labs/era-contracts/pull/774).

This upgrade brings formatting, gas optimizations and other minor changes.

## Watched changes

```diff
-   Status: DELETED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
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
      values.$pastUpgrades.3:
+        ["2025-01-22T06:36:23.000Z","0x2784286656e572cfe0abf2117628fdc5a6cd12e5c060de171c54063b273bc216",["0x90C0A0a63d7ff47BfAA1e9F8fa554dabc986504a","0x81754d2E48e3e553ba6Dfd193FC72B3A0c6076d9","0x5575218cECd370E1d630d1AdB03c254B0B376821","0xBB13642F795014E0EAC2b0d52ECD5162ECb66712"]]
      values.$upgradeCount:
-        3
+        4
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
+        268
      values.getL2SystemContractsUpgradeBlockNumber:
-        0
+        268
      values.getL2SystemContractsUpgradeTxHash:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0xd3086b71c95ce83e7f3d30ab1890ada2334695a05b65715e56f42d96b22c8674"
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
+   Status: CREATED
    contract Verifier (0x06aa7a7B07108F7C5539645e32DD5c21cBF9EB66)
    +++ description: None
```

## Source code changes

```diff
.../CronosZkEvm/AdminFacet.1.sol                   | 166 +++++++---
 .../CronosZkEvm/ExecutorFacet.4.sol                | 343 ++++++++++++++-------
 .../CronosZkEvm/GettersFacet.2.sol                 | 117 +++++--
 .../CronosZkEvm/MailboxFacet.3.sol                 | 255 +++++++++++----
 4 files changed, 627 insertions(+), 254 deletions(-)
```

Generated with discovered.json: 0x1c20d7dcd3a263db0150479e60f7450583ebe9a6

# Diff at Mon, 21 Oct 2024 11:25:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20876242
- current block number: 20876242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20876242 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.$pastUpgrades.2.2:
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.2.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "0xe5711797fb601abc2d70e9265a897ba5a16a10125a9cadbd616f938592604fe7"
      values.$pastUpgrades.1.2:
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.1.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "0x98231507bfbba69996de5a8572d8f83ccf9756be6232d3f9431e2fc68c98d58b"
      values.$pastUpgrades.0.2:
+        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
      values.$pastUpgrades.0.1:
-        ["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]
+        "0x98231507bfbba69996de5a8572d8f83ccf9756be6232d3f9431e2fc68c98d58b"
    }
```

Generated with discovered.json: 0x243a772d8506e5a22a9027dd476db25c8e6edf7c

# Diff at Mon, 14 Oct 2024 10:50:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20876242
- current block number: 20876242

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20876242 (main branch discovery), not current.

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      sourceHashes:
+        ["0xe77f0ac44ab78d4c02668f0f81051a448ab8a4b96343747f6bd1143acc7748a8"]
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
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      sourceHashes:
+        ["0xcd2dee9d49d75aa37138514c1f32d29c60222002963e0c0a7e1a815dff00444f","0x9ae32beaa5dc29055f75d3cd08fbec35ed3eee3e2ff35de263a78f7d63c610f9","0xd272def5b4e3f0a68e3019d7d40675ca6d3e3fc35500e9aafe864bce8c697de2","0x419cee160f60572fc9189007ec7c1e3c13e54d80bf1e78f837bc8fa001519685","0xe521f6bd6250a2c92af323768ad8a2274cc334725b5ed8960d8421f063fc3285"]
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      sourceHashes:
+        ["0x69b34ba871ceb0dbecab437be2d0701a5d768bb541a738bb3a7d2883d10a403e"]
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x87ece57be9c4c765e7d3656e3fbcff36d397e2ca

# Diff at Wed, 02 Oct 2024 07:13:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@97b544adfba04e970ecc4cdd40ee3ff679944269 block: 20862570
- current block number: 20876242

## Description

upgradeChainFromVersion() called, upgrading to protocol version 103079215106. This is the latest version used by ZKsync Era, effectively bringing no changes for CronosZkEvm since the postUpgradeCalldata is empty and the diamond implementations are the same as last version. (Era used this upgrade to change an admin) Upgrader role is given to the old Admin EOA (no net perm changes).

## Watched changes

```diff
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4) {
    +++ description: None
      values.accessControl.UPGRADER.members.2:
+        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
    }
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.$pastUpgrades.2:
+        ["2024-10-02T06:36:11.000Z",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]]
      values.$upgradeCount:
-        2
+        3
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

Generated with discovered.json: 0x94fa59118b88752205637a2b6454460d2c28b0da

# Diff at Tue, 01 Oct 2024 10:50:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20862570
- current block number: 20862570

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20862570 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-30T16:30:35.000Z",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]],["2024-07-30T16:30:35.000Z",["0xF6F26b416CE7AE5e5FE224Be332C7aE4e1f3450a","0xE60E94fCCb18a81D501a38959E532C0A85A1be89","0xCDB6228b616EEf8Df47D69A372C4f725C43e718C","0xaD193aDe635576d8e9f7ada71Af2137b16c64075"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xab96172d00f6f2326ada7aab90076ea973d78e84

# Diff at Mon, 30 Sep 2024 09:28:14 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@eec6993b988ab9a9f325d04da2e9717ed24ad0b9 block: 20777184
- current block number: 20862570

## Description

CronosZkEVMAdmin upgrade: New IChainAdmin interface with multicall ability, thus fully inheriting the ChainAdmin permissions in the Diamond. Project config updated, transactionFilterer permissions added.

## Watched changes

```diff
-   Status: DELETED
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC)
    +++ description: None
```

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.getAdmin:
-        "0x66eF951aEC26987915582340bCAA569E5Be67cDC"
+        "0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4"
    }
```

```diff
+   Status: CREATED
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CronosZkEVMAdmin (0x6a88E8f6B5382d87F39213eB3df43c5FF2498Dd4)
    +++ description: None
```

## Source code changes

```diff
.../.flat/CronosChainAdminMultisig/GnosisSafe.sol  | 953 +++++++++++++++++++++
 .../CronosChainAdminMultisig/GnosisSafeProxy.p.sol |  35 +
 .../{.flat@20777184 => .flat}/CronosZkEVMAdmin.sol |  60 +-
 3 files changed, 1047 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20777184 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce)
    +++ description: None
```

```diff
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC) {
    +++ description: None
      values.accessControl:
-        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"ADMIN":{"adminRole":"ADMIN","members":["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"]},"ORACLE":{"adminRole":"ADMIN","members":["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"]},"UPGRADER":{"adminRole":"ADMIN","members":["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"]},"FEE_ADMIN":{"adminRole":"ADMIN","members":["0xfD7a03Cdb68E6488F950108A4d24f15519b87339","0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"]}}
    }
```

```diff
    contract TxFiltererOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b) {
    +++ description: None
      name:
-        "DenyListOwnerMultisig"
+        "TxFiltererOwnerMultisig"
    }
```

Generated with discovered.json: 0x6000c0e91f82353e42d690f3d482b9e384a2c0b3

# Diff at Wed, 18 Sep 2024 11:29:40 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14dc1d5395aaa4aca4e79a08fd6132e42e3cf1a4 block: 20668550
- current block number: 20777184

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20668550 (main branch discovery), not current.

```diff
    contract CronosChainAdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce) {
    +++ description: None
      name:
-        "AdminMultisig"
+        "CronosChainAdminMultisig"
    }
```

Generated with discovered.json: 0x4af2a68368669c3387c20071a4d0fb5d972fe239

# Diff at Mon, 16 Sep 2024 13:59:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bb1c8d62bd8e55be7219cbf896b4a8459c92e616 block: 20668550
- current block number: 20668550

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20668550 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.validators.0:
+        "0x5D8ba173Dc6C3c90C8f7C04C9288BeF5FDbAd06E"
    }
```

Generated with discovered.json: 0x5333e854a4b470f861b576eb3371fac75b833932

# Diff at Fri, 23 Aug 2024 07:26:48 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@08f0832a5dea29e7c493cd50bda4bf1729aa03ae block: 20568367
- current block number: 20589800

## Description

Verified the bridge proxy contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20568367 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      unverified:
-        true
    }
```

Generated with discovered.json: 0x0c856d0648b71a8d06b5926a3ea8934df46b90ee

# Diff at Tue, 20 Aug 2024 07:33:17 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@5417c4717b5cefeed17cd8419a7eb2dda22d4206 block: 20532448
- current block number: 20568367

## Description

Added discovery of DA mode.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532448 (main branch discovery), not current.

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.daMode:
+        1
    }
```

Generated with discovered.json: 0xa58f80eeae7359035a0c626cbe9fb22ebc0858be

# Diff at Thu, 15 Aug 2024 07:10:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20525613
- current block number: 20532448

## Description

The pending owner now became an actual owner. No pending owner currently.

## Watched changes

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      values.owner:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
      values.pendingOwner:
-        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
+        "0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0xf60327b26a1b02b58bfd289f249ed0d4831ec61f

# Diff at Wed, 14 Aug 2024 08:16:16 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@e32dcc268a9af9f45ad205490c9d650c487e04f1 block: 20512726
- current block number: 20525613

## Description

All roles have been revoked from the EOA and a multisig (2/3) has been granted those roles.
A pending owner is added to TransactionFiltererDenyList, which is just a step in their ownership transfer process, it will become the actual owner once the entire process is completed.

## Watched changes

```diff
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC) {
    +++ description: None
      values.accessControl.ADMIN.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.ADMIN.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.ORACLE.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.ORACLE.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.UPGRADER.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.UPGRADER.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.FEE_ADMIN.members.1:
-        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
+        "0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce"
      values.accessControl.FEE_ADMIN.members.0:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
    }
```

```diff
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139) {
    +++ description: None
      values.pendingOwner:
-        "0x0000000000000000000000000000000000000000"
+        "0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b"
    }
```

```diff
+   Status: CREATED
    contract AdminMultisig (0x4c57b73435FcB2D60AAf581e44d6a8AFc57ddFce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DenyListOwnerMultisig (0xC774CDFc4d2AcE7aaD12D77B6A3752a393E1ab8b)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/AdminMultisig/GnosisSafe.sol    | 952 +++++++++++++++++++++
 .../.flat/AdminMultisig/GnosisSafeProxy.p.sol      |  34 +
 .../.flat/DenyListOwnerMultisig/GnosisSafe.sol     | 952 +++++++++++++++++++++
 .../DenyListOwnerMultisig/GnosisSafeProxy.p.sol    |  34 +
 4 files changed, 1972 insertions(+)
```

Generated with discovered.json: 0xce3cf2924b53d3ff2bfa12c6d3eacfed4b824720

# Diff at Mon, 12 Aug 2024 13:07:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@bafa261ae877bba9966845f4d250f5cbb9d4f6d2 block: 20482316
- current block number: 20512726

## Description

A second EOA is given multiple roles, now there are two EOAs with those.

## Watched changes

```diff
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC) {
    +++ description: None
      values.accessControl.ADMIN.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.ORACLE.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.UPGRADER.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
      values.accessControl.FEE_ADMIN.members.1:
+        "0xfD7a03Cdb68E6488F950108A4d24f15519b87339"
    }
```

Generated with discovered.json: 0x5a8ff11be549135c8b8b49f5bff96cb47ab97132

# Diff at Thu, 08 Aug 2024 07:17:33 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5a17db968badca34a66703637dabf76a313bb43e block: 20469638
- current block number: 20482316

## Description

Updated base token gas multiplier.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.baseTokenGasPriceMultiplierNominator:
-        40000
+        25000
    }
```

Generated with discovered.json: 0x682e63ce64e58a5524b7f506518c01daf6f57142

# Diff at Thu, 01 Aug 2024 08:25:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@295430f331b68784c13ccda9222bc78df1e833c5 block: 20425837
- current block number: 20432488

## Description

Cronoszkevm is still on block 1 (verified).
Local Admin role (see ZKsync Era diagrams) is changed from an EOA to a contract `CronosZkEVMAdmin` which allows for splitting of the Admin's permissions via accessControl. Currently all roles are given to the `0x143524d0ac8D7f35a2133b6B0a7567e0E3393137` EOA.

## Watched changes

```diff
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc) {
    +++ description: None
      values.getAdmin:
-        "0x143524d0ac8D7f35a2133b6B0a7567e0E3393137"
+        "0x66eF951aEC26987915582340bCAA569E5Be67cDC"
      values.getL2SystemContractsUpgradeBatchNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeBlockNumber:
-        1
+        0
      values.getL2SystemContractsUpgradeTxHash:
-        "0xd05d194051ec55ccc2207d19499a7959c87327586d85b0914684b0f3319cbeff"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract CronosZkEVMAdmin (0x66eF951aEC26987915582340bCAA569E5Be67cDC)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/CronosZkEVMAdmin.sol            | 2352 ++++++++++++++++++++
 1 file changed, 2352 insertions(+)
```

Generated with discovered.json: 0x7e266a80639b119ebd450a36cc47e5254bba527a

# Diff at Wed, 31 Jul 2024 10:08:17 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20425837

## Description

Initial discovery:
ZK stack chain in ValidiumMode (`getPubdataPricingMode : 1`) sharing the STM, ValidatorTimelock, Verifier and all diamond facet implementations with ZKsync Era.
DiamondProxy not yet verified which is not really a problem for our discovery?. Admin EOA so far (for the non-shared parts). BaseToken is zkCRO.

## Initial discovery

```diff
+   Status: CREATED
    contract Verifier (0x70F3FBf8a427155185Ec90BED8a3434203de9604)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CronosZkEvm (0x7b2DA4e77BAE0e0d23c53C3BE6650497d0576CFc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TransactionFiltererDenyList (0xA8998F231a660Eca365B382943c71ad9b7619139)
    +++ description: None
```
