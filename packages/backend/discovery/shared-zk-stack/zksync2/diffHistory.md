Generated with discovered.json: 0xc86057dbca2ac0dcb4886d84f930ed8d8e312d92

# Diff at Mon, 27 Jan 2025 16:56:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 54670089
- current block number: 54682636

## Description

discodrive!

## Watched changes

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that go through Ethereum Layer 1 and can target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        3
+        4
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 54670089 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.currentQuorum_MTokens:
+        "630"
      values.proposalThreshold_MTokens:
+        "21"
      description:
+        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed."
      issuedPermissions:
+        [{"permission":"configure","to":"0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false.","via":[]},{"permission":"configure","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","description":"propose transactions."}]
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":24}}]
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract that can send L2->L1 transactions that start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s.
      values.Canceller:
+        ["0x76705327e682F2d96943280D99464Ab61219e34f"]
      values.Executor:
+        ["0x76705327e682F2d96943280D99464Ab61219e34f"]
      values.getMinDelay_formatted:
+        "0s"
      values.Proposer:
+        ["0x76705327e682F2d96943280D99464Ab61219e34f"]
      template:
+        "shared-zk-stack/TimelockController"
      description:
+        "Timelock contract that can send L2->L1 transactions that start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s."
      issuedPermissions:
+        [{"permission":"configure","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"propose transactions.","via":[]}]
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      values.Canceller:
+        ["0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"]
      values.Executor:
+        ["0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"]
      values.getMinDelay_formatted:
+        "3d"
      values.Proposer:
+        ["0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"]
      template:
+        "shared-zk-stack/TimelockController"
      description:
+        "Timelock contract allowing the queueing of transactions with a minimum delay of 3d."
      issuedPermissions:
+        [{"permission":"configure","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"propose transactions.","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."}]
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.currentQuorum_MTokens:
+        "630"
      values.proposalThreshold_MTokens:
+        "21"
      description:
+        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
      issuedPermissions:
+        [{"permission":"configure","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","description":"propose transactions."}]
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":24}}]
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      issuedPermissions.2:
+        {"permission":"upgrade","to":"0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8","via":[{"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8","description":"control all roles in the ZkToken access control, including the minter roles.","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.to:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      issuedPermissions.0.via.0:
-        {"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}
      issuedPermissions.0.description:
+        "grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."
      values.DefaultAdmin:
+        ["0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"]
      values.MinterAdmin:
+        ["0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"]
      template:
+        "shared-zk-stack/ZkToken"
      description:
+        "The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system."
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that go through Ethereum Layer 1 and can target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.currentQuorum_MTokens:
+        "630"
      values.proposalThreshold_MTokens:
+        "21"
      description:
+        "Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that go through Ethereum Layer 1 and can target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
      receivedPermissions:
+        [{"permission":"configure","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"propose transactions."}]
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":24}}]
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      values.Canceller:
+        ["0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"]
      values.Executor:
+        ["0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"]
      values.getMinDelay_formatted:
+        "3d"
      values.Proposer:
+        ["0x496869a7575A1f907D1C5B1eca28e4e9E382afAb"]
      template:
+        "shared-zk-stack/TimelockController"
      description:
+        "Timelock contract allowing the queueing of transactions with a minimum delay of 3d."
      issuedPermissions:
+        [{"permission":"configure","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"propose transactions.","via":[]}]
    }
```

Generated with discovered.json: 0x4f5c74e5e4ed8db60e1de92ff86377dbb4502f02

# Diff at Mon, 27 Jan 2025 13:17:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@43cb526d71ed01f024dced9d5aea2a30cf306714 block: 54131125
- current block number: 54670089

## Description

[GAP-1](https://vote.zknation.io/dao/proposal/13823050748058617424077595486689751986818771098977300222700522842013613046754?govId=eip155:324:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) ZKsync Token Program Priorities 2025 Endorsement queued in timelock (voting finished in favor).

## Watched changes

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: None
      values.proposalQueuedCount:
-        0
+        1
    }
```

Generated with discovered.json: 0x079e02fd625cb6f100f843470a2c5144657c22dd

# Diff at Mon, 20 Jan 2025 12:14:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@658eb33e9afd98eac45a3037d195357115d19a86 block: 44113900
- current block number: 54131125

## Description

Config related: zksync2 discovery was deactivated for some time and is now re-enabled, these updates are old.

## Watched changes

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: None
      values.proposalQueuedCount:
-        0
+        1
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      values.accessControl.MINTER_ROLE.members.18:
+        "0x178bFf5A197FB4499526D04Db602C45cEDCA40a9"
      values.accessControl.MINTER_ROLE.members.17:
+        "0x4E86e74237Eb1f9432810eB5ab5861368d2f5964"
      values.accessControl.MINTER_ROLE.members.16:
+        "0x2ADa5C15BC4FEE97EC2463ce4F8E4557174B8Dcf"
      values.accessControl.MINTER_ROLE.members.15:
+        "0xD375A20d93C2F7C6a83B19C5ae153cF2C6e09ba9"
      values.accessControl.MINTER_ROLE.members.14:
+        "0x2CC6c7b1a59A23fB3faCAFe4A3791C5c8A58Cbcc"
      values.accessControl.MINTER_ROLE.members.13:
+        "0x6b689B93B368c7C25E6e5ecaeAb23C11F8C2c392"
      values.accessControl.MINTER_ROLE.members.12:
+        "0xDa2fBE31Fd47Af741bdB3dBC4eb662dA0107D33a"
      values.accessControl.MINTER_ROLE.members.11:
+        "0x3BC3f64d084bE6d3336f10340DC8424290FFc4ab"
      values.accessControl.MINTER_ROLE.members.10:
+        "0x11791c6249631555cEb75CB39128789E3954c2EC"
      values.accessControl.MINTER_ROLE.members.9:
+        "0xe546AEaaC57584da7554e7F88154DeDAD30A82b0"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: None
      values.proposalQueuedCount:
-        0
+        3
    }
```

Generated with discovered.json: 0x9b7b6c787576a3feea73a81c20ba63815740a4ea

# Diff at Mon, 20 Jan 2025 11:10:47 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 44113900
- current block number: 44113900

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
      directlyReceivedPermissions.0.from:
+        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
    }
```

Generated with discovered.json: 0x1952ccf0e63752ab6ffe2e2b850c6daa6c251323

# Diff at Mon, 20 Jan 2025 09:26:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0x7834eee0c00ff2ede2944dbdc6c7a1d9a38b154e

# Diff at Wed, 06 Nov 2024 12:10:20 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@569158b15e3821e66365edc31ada3588122315be block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
      issuedPermissions.0.via.0:
+        {"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC","delay":0}
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"}]
    }
```

Generated with discovered.json: 0x03496e6ab8129e2a79adcf97e5207bd330279a28

# Diff at Mon, 21 Oct 2024 11:15:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x01a6715d3560241E09E865a46122bf347A576c09"]
      values.$pastUpgrades.1.1:
-        ["0x01a6715d3560241E09E865a46122bf347A576c09"]
+        "0xa6bc022ba0f60ac6f10a6efb84b261e9ca1b327a611bdd7a1f4d37cc9b027a3c"
      values.$pastUpgrades.0.2:
+        ["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]
      values.$pastUpgrades.0.1:
-        ["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]
+        "0x5bfce59c2ad18019ef20d58a3f1ec496cdc85537fc9564c932f7dcbbb2a15b56"
    }
```

Generated with discovered.json: 0x2246a8aced604288721a8ed0d1148c84b6110e4b

# Diff at Mon, 14 Oct 2024 11:00:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: None
      sourceHashes:
+        ["0x3d8c2d3bcd396a14d951c81ad0c163139768c7439152292846ce2ef8a34affe8"]
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: None
      sourceHashes:
+        ["0x7132507bdacfea50a991d23f4b78d18a03a78fe5a265fd7a07397c4f6ce93399"]
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      sourceHashes:
+        ["0x993403059c5620e6c91110514f9f4a2f2331c55dab587699c67c19edddab92ad","0x3a3b3a9708ad3a6179afe0f24a1426254e558d14bbaa4f155ed0db49027b2099"]
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: None
      sourceHashes:
+        ["0x82c5a05996248ee29f451f121ff0f973a3b17f7c7a8ed31878d30c5eaa51b245"]
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: None
      sourceHashes:
+        ["0x2d84b1bb959469a8ddf00b906d14914c4b3e902442e41cd94f6c6b48f845c77f"]
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

Generated with discovered.json: 0xf64431a2b31fceb223cd8c07679bebcb4755d352

# Diff at Tue, 01 Oct 2024 11:14:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 44113900
- current block number: 44113900

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 44113900 (main branch discovery), not current.

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-05-21T18:48:46.000Z",["0x3931e73ebA79a7C898D3b0e02c7C62bA4F11cB14"]],["2024-06-10T09:25:38.000Z",["0x01a6715d3560241E09E865a46122bf347A576c09"]]]
    }
```

Generated with discovered.json: 0x8280118b8556ab1e638dadc43c445dd09f499c68

# Diff at Fri, 13 Sep 2024 15:33:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 44113900

## Description

Initial discovery: Added the three token governance contracts for the shared ZK stack (including the main ProtocolGov contract that acts through L1) and their timelocks. Wrote event alerts for all three contracts.

## Initial discovery

```diff
+   Status: CREATED
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC)
    +++ description: None
```
