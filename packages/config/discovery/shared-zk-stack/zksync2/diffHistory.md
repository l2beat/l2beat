Generated with discovered.json: 0x6bdc4e4b4dd2a5b938382728661a04329f601634

# Diff at Tue, 11 Mar 2025 07:58:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6186a4f8e3a9e415d081d4e3e85c2deceaa5530c block: 56755451
- current block number: 57469400

## Description

Onchain execution of [[ZIP-5] Upgrade Governance Contracts](https://www.tally.xyz/gov/zksync/proposal/32477831455745537024214395992964479454779258818502397012096084176779102554510?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f). See also `packages/config/discovery/shared-zk-stack/ethereum/diffHistory.md`.

## Watched changes

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      receivedPermissions.4:
-        {"permission":"interact","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]}
    }
```

```diff
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      directlyReceivedPermissions.1:
-        {"permission":"interact","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."}
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      issuedPermissions.1.to:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
      issuedPermissions.0.to:
-        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
+        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
      issuedPermissions.0.via.0.address:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.DEFAULT_ADMIN_ROLE.members.0:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
      values.accessControl.MINTER_ADMIN_ROLE.members.0:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.MINTER_ROLE.members.19:
-        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
      values.accessControl.MINTER_ROLE.members.18:
-        "0x178bFf5A197FB4499526D04Db602C45cEDCA40a9"
+        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
      values.accessControl.MINTER_ROLE.members.17:
-        "0x4E86e74237Eb1f9432810eB5ab5861368d2f5964"
+        "0x178bFf5A197FB4499526D04Db602C45cEDCA40a9"
      values.accessControl.MINTER_ROLE.members.16:
-        "0x2ADa5C15BC4FEE97EC2463ce4F8E4557174B8Dcf"
+        "0x4E86e74237Eb1f9432810eB5ab5861368d2f5964"
      values.accessControl.MINTER_ROLE.members.15:
-        "0xD375A20d93C2F7C6a83B19C5ae153cF2C6e09ba9"
+        "0x2ADa5C15BC4FEE97EC2463ce4F8E4557174B8Dcf"
      values.accessControl.MINTER_ROLE.members.14:
-        "0x2CC6c7b1a59A23fB3faCAFe4A3791C5c8A58Cbcc"
+        "0xD375A20d93C2F7C6a83B19C5ae153cF2C6e09ba9"
      values.accessControl.MINTER_ROLE.members.13:
-        "0x6b689B93B368c7C25E6e5ecaeAb23C11F8C2c392"
+        "0x2CC6c7b1a59A23fB3faCAFe4A3791C5c8A58Cbcc"
      values.accessControl.MINTER_ROLE.members.12:
-        "0xDa2fBE31Fd47Af741bdB3dBC4eb662dA0107D33a"
+        "0x6b689B93B368c7C25E6e5ecaeAb23C11F8C2c392"
      values.accessControl.MINTER_ROLE.members.11:
-        "0x3BC3f64d084bE6d3336f10340DC8424290FFc4ab"
+        "0xDa2fBE31Fd47Af741bdB3dBC4eb662dA0107D33a"
      values.accessControl.MINTER_ROLE.members.10:
-        "0x11791c6249631555cEb75CB39128789E3954c2EC"
+        "0x3BC3f64d084bE6d3336f10340DC8424290FFc4ab"
      values.accessControl.MINTER_ROLE.members.9:
-        "0xe546AEaaC57584da7554e7F88154DeDAD30A82b0"
+        "0x11791c6249631555cEb75CB39128789E3954c2EC"
      values.accessControl.MINTER_ROLE.members.8:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "0xe546AEaaC57584da7554e7F88154DeDAD30A82b0"
      values.DefaultAdmin.0:
-        "0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8"
+        "0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4"
      values.MinterAdmin.0:
-        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
+        "0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d"
    }
```

```diff
    contract Guardians_l2Alias (0x711ea620AB29f41AbC6596a15981e14ce58C97c9) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period)."}
      receivedPermissions.0.from:
-        "0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160"
+        "0xb83FF6501214ddF40C91C9565d095400f3F45746"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        6
+        7
    }
```

```diff
    contract ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"upgrade","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","via":[{"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}]}
      receivedPermissions.0.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.0.description:
-        "control all roles in the ZkToken access control, including the minter roles."
      receivedPermissions.0.via:
+        [{"address":"0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"}]
    }
```

```diff
    contract ZKFoundationMultisig_l2Alias (0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"0xb83FF6501214ddF40C91C9565d095400f3F45746","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false."}]
    }
```

```diff
+   Status: CREATED
    contract ZkTokenGovernor (0xb83FF6501214ddF40C91C9565d095400f3F45746)
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
```

```diff
+   Status: CREATED
    contract ZkTokenTimelockController (0xe5d21A9179CA2E1F0F327d598D464CcF60d89c3d)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
+   Status: CREATED
    contract ProtocolUpgradeHandler_l2Alias (0xF41EcA3047B37dc7d88849de4a4dc07937Ad6bc4)
    +++ description: None
```

## Source code changes

```diff
.../zksync2/.flat/ZkTokenGovernor.sol              | 5087 ++++++++++++++++++++
 .../zksync2/.flat/ZkTokenTimelockController.sol    | 1227 +++++
 2 files changed, 6314 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 56755451 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor_deprecated (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      name:
-        "ZkTokenGovernor"
+        "ZkTokenGovernor_deprecated"
      description:
-        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
      issuedPermissions:
-        [{"permission":"interact","to":"0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false.","via":[]},{"permission":"interact","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract TokenTimelockController_deprecated (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      name:
-        "TokenTimelockController"
+        "TokenTimelockController_deprecated"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ZkGovOpsGovernor_deprecated (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E.
      name:
-        "ZkGovOpsGovernor"
+        "ZkGovOpsGovernor_deprecated"
      description:
-        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
+        "A token governance contract that allows token holders to create and vote on proposals. At least 21M tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed. The accepted token is 0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E."
      issuedPermissions:
-        [{"permission":"interact","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.7:
+        {"permission":"interact","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"propose transactions."}
      receivedPermissions.6:
+        {"permission":"interact","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"manage all access control roles and change the minimum delay.","via":[{"address":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"}]}
      receivedPermissions.5:
+        {"permission":"interact","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"execute transactions that are ready."}
      receivedPermissions.4:
+        {"permission":"interact","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"cancel queued transactions."}
      directlyReceivedPermissions.1:
+        {"permission":"act","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"}
    }
```

```diff
    contract ProtocolUpgradeHandler_l2Alias_deprecated (0xA08b9912416E8aDc4D9C21Fae1415d3318A129A8) {
    +++ description: None
      name:
-        "ProtocolUpgradeHandler_l2Alias"
+        "ProtocolUpgradeHandler_l2Alias_deprecated"
    }
```

```diff
    contract GovOpsTimelockController_deprecated (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      name:
-        "GovOpsTimelockController"
+        "GovOpsTimelockController_deprecated"
      category:
+        {"name":"Spam","priority":-1}
    }
```

```diff
    contract ZKFoundationMultisig_l2Alias (0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false."}]
    }
```

```diff
    contract Guardians_l2Alias_deprecated (0xe788e09324F8bb3cc64f009973693f751C33b999) {
    +++ description: None
      name:
-        "Guardians_l2Alias"
+        "Guardians_l2Alias_deprecated"
      receivedPermissions:
-        [{"permission":"interact","from":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period)."},{"permission":"interact","from":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period)."}]
    }
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController_deprecated (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
```

```diff
+   Status: CREATED
    contract Guardians_l2Alias (0x711ea620AB29f41AbC6596a15981e14ce58C97c9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovOpsTimelockController (0xC9E442574958f96C026DeF9a50C3236cab17428a)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
```

```diff
+   Status: CREATED
    contract ZkGovOpsGovernor (0xEEEa739a8b6fB1b8f703E23C9Be03CeeA643b160)
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
```

Generated with discovered.json: 0xa80d0aa1f580af83f24eca2f8cdca1516fe19f51

# Diff at Thu, 06 Mar 2025 15:34:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@64eed24a033030dd2d128180f3ee3f87c3c39f7c block: 56755451
- current block number: 56755451

## Description

config: updates timelock templates, added starknet proghashes to global config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 56755451 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: This timelock has a minimum delay of 0s. It does not have the L2_SENDER_ROLE yet.
      issuedPermissions.3:
+        {"permission":"interact","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"propose transactions.","via":[]}
      issuedPermissions.2.description:
-        "propose transactions."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.2.via.0:
+        {"address":"0x085b8B6407f150D62adB1EF926F7f304600ec714"}
      values.timelockAdminAC:
+        ["0x085b8B6407f150D62adB1EF926F7f304600ec714"]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0x085b8B6407f150D62adB1EF926F7f304600ec714","description":"manage all access control roles and change the minimum delay."}]
    }
```

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.4:
+        {"permission":"interact","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]}
      receivedPermissions.3.from:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      receivedPermissions.3.description:
-        "grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."
+        "propose transactions."
      receivedPermissions.3.via:
-        [{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]
      receivedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      receivedPermissions.1.description:
-        "execute transactions that are ready."
+        "cancel queued transactions."
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.0.delay:
+        259200
      receivedPermissions.0.via:
+        [{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.3:
+        {"permission":"interact","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"propose transactions.","via":[]}
      issuedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      issuedPermissions.1.description:
-        "execute transactions that are ready."
+        "cancel queued transactions."
      issuedPermissions.0.description:
-        "cancel queued transactions."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.0.via.0:
+        {"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}
      issuedPermissions.0.delay:
+        259200
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."}
      directlyReceivedPermissions.0.from:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      directlyReceivedPermissions.0.description:
-        "grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."
+        "manage all access control roles and change the minimum delay."
      directlyReceivedPermissions.0.delay:
+        259200
      values.timelockAdminAC:
+        ["0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"]
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.3:
+        {"permission":"interact","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","description":"propose transactions."}
      receivedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      receivedPermissions.1.description:
-        "execute transactions that are ready."
+        "cancel queued transactions."
      receivedPermissions.0.description:
-        "cancel queued transactions."
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.0.delay:
+        259200
      receivedPermissions.0.via:
+        [{"address":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200}]
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.3:
+        {"permission":"interact","from":"0x085b8B6407f150D62adB1EF926F7f304600ec714","description":"propose transactions."}
      receivedPermissions.2.description:
-        "propose transactions."
+        "manage all access control roles and change the minimum delay."
      receivedPermissions.2.via:
+        [{"address":"0x085b8B6407f150D62adB1EF926F7f304600ec714"}]
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.3:
+        {"permission":"interact","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"propose transactions.","via":[]}
      issuedPermissions.2.description:
-        "propose transactions."
+        "execute transactions that are ready."
      issuedPermissions.1.description:
-        "execute transactions that are ready."
+        "cancel queued transactions."
      issuedPermissions.0.description:
-        "cancel queued transactions."
+        "manage all access control roles and change the minimum delay."
      issuedPermissions.0.via.0:
+        {"address":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200}
      issuedPermissions.0.delay:
+        259200
      values.timelockAdminAC:
+        ["0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19"]
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200,"description":"manage all access control roles and change the minimum delay."}]
    }
```

Generated with discovered.json: 0xea527b5dcf9806a3bd340ad0f223338fda340d20

# Diff at Tue, 04 Mar 2025 10:40:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 56755451
- current block number: 56755451

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 56755451 (main branch discovery), not current.

```diff
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714) {
    +++ description: This timelock has a minimum delay of 0s. It does not have the L2_SENDER_ROLE yet.
      sinceBlock:
+        55404657
    }
```

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      sinceBlock:
+        41197311
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      sinceBlock:
+        41197308
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      sinceBlock:
+        41197430
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      sinceBlock:
+        34572100
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      sinceBlock:
+        41196850
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      sinceBlock:
+        41197426
    }
```

```diff
    contract ZkTokenProxyAdmin (0xdB1E46B448e68a5E35CB693a99D59f784aD115CC) {
    +++ description: None
      sinceBlock:
+        34572095
    }
```

Generated with discovered.json: 0x28177c39a81621a19a8bc43a34efb472c4d22016

# Diff at Fri, 28 Feb 2025 11:37:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a673c79f7be232b805781e844ed3929c5c5bb288 block: 55387644
- current block number: 56755451

## Description

Queue / execute [ZIP-5 Upgrade Governance Contracts](https://www.tally.xyz/gov/zksync/proposal/32477831455745537024214395992964479454779258818502397012096084176779102554510?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f) and [ZIP-6 Prepare ZKsync for ZK Gateway](https://www.tally.xyz/gov/zksync/proposal/67712324710515983914473127418805437707715095849437613773846173900686148862581?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f).

### gud / bad tldr (check notion for )
gud meta:
- the verification tool works and is helpful
- most contracts are predeployed on L1 and verified
- the audits have a summary section and working links to github
- docs are on github
gud:
- more customizability for assets while keeping central cluster standards (asset routers and -handlers)
- ZK stack comes closer to being an interop cluster: prep for proof aggregation (lower cost, similar security), preconfs, fast L3<->L3 bridging (not in this upgrade)
- all in all clever architecture where chains will be bridgeable similar to assets (choose your settlement layer)
bad meta:
- verification tool has [some limitations](https://github.com/matter-labs/protocol-upgrade-verification-tool?tab=readme-ov-file#abilities-and-limitations-of-the-tool) (e.g. would be nice if there was a step-by-step to compile the `ecosystem-yaml` or contract bytecode myself).
- docs are a bit confusing because they talk about much more than the current upgrade
bad:
- DA switching to worse DA (rollup -> validium) will be instant and can be done by local chain operators (not zk stack operators) unless actively prevented by DA mode `permanent-rollup`
- token customizability in practice usually means worse trust assumptions and risk abstraction

check [the wiki entry](https://www.notion.so/l2beat/ZK-stack-protocol-upgrade-v26-Gateway-1a0094a2aee78009af4efc679ecbd995) for more.

## Watched changes

```diff
-   Status: DELETED
    contract TimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8)
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.2.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.1.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      receivedPermissions.0.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      directlyReceivedPermissions.0.from:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      values.lateQuorumVoteExtension:
-        604800
+        259200
      values.proposalQueuedCount:
-        4
+        6
      values.timelock:
-        "0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"
+        "0x085b8B6407f150D62adB1EF926F7f304600ec714"
      values.votingDelay:
-        604800
+        259200
    }
```

```diff
+   Status: CREATED
    contract ProtocolTimelockController (0x085b8B6407f150D62adB1EF926F7f304600ec714)
    +++ description: This timelock has a minimum delay of 0s. It does not have the L2_SENDER_ROLE yet.
```

## Source code changes

```diff
.../TimelockController.sol => .flat/ProtocolTimelockController.sol}       | 0
 1 file changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 55387644 (main branch discovery), not current.

```diff
    contract TimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 0s.
      name:
-        "ProtocolTimelockController"
+        "TimelockController"
      description:
-        "Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s."
+        "Timelock contract allowing the queueing of transactions with a minimum delay of 0s."
    }
```

Generated with discovered.json: 0x6cb5d3288c6bb3c43612f498940dc890a6723970

# Diff at Wed, 26 Feb 2025 10:33:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 55387644
- current block number: 55387644

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 55387644 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x9829e200f5487d12242a34ff85f0d451e5115cec

# Diff at Thu, 06 Feb 2025 09:34:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 55181277
- current block number: 55387644

## Description

Seems to be the execution of [AAVE DAO Airdrop Claim Extension Request](https://www.tally.xyz/gov/zksync/proposal/57908166665921469155508302947951953966033148387652385473031300159207145997268?govId=eip155:324:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) TPP.

## Watched changes

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      values.accessControl.MINTER_ROLE.members.19:
+        "0x721b6d77a58FaaF540bE49F28D668a46214Ba44c"
    }
```

Generated with discovered.json: 0xd294fbd6e769de9056e40610ba279d1fd676df80

# Diff at Tue, 04 Feb 2025 12:33:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 55181277
- current block number: 55181277

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 55181277 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.3.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s.
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
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.2.permission:
-        "configure"
+        "interact"
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZkToken (0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E) {
    +++ description: The ZK token contract on ZKsync Era. Mintable through access control roles. Used for voting in the ZK stack governance system.
      issuedPermissions.1.permission:
-        "configure"
+        "interact"
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
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

Generated with discovered.json: 0x60eec5b53262d973f06f6ca4f1d13d7a1bc5c4b9

# Diff at Mon, 03 Feb 2025 15:07:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f48b05175a82517aba519a7273477b15b3c1ad94 block: 54882487
- current block number: 55181277

## Description

[AAVE DAO Airdrop Claim Extension Request](https://www.tally.xyz/gov/zksync/proposal/57908166665921469155508302947951953966033148387652385473031300159207145997268?govId=eip155:324:0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) TPP queued.

## Watched changes

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        1
+        2
    }
```

Generated with discovered.json: 0x3ac96ec7a82bd03e7013fd3b3d8c381cf7a9f3f7

# Diff at Thu, 30 Jan 2025 10:59:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 54684343
- current block number: 54882487

## Description

[GAP-2](https://vote.zknation.io/dao/proposal/35395412545014978447594654620386134175315194219985614464693911512436668500487?govId=eip155:324:0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) queued.

## Watched changes

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.proposalQueuedCount:
-        1
+        2
    }
```

Generated with discovered.json: 0xda20effe750a8a43dfc8c74f79941ffccfb1f6e1

# Diff at Wed, 29 Jan 2025 09:53:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@5741cb966172a3b26ba8279dd9fe4323805a53c2 block: 54684343
- current block number: 54684343

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 54684343 (main branch discovery), not current.

```diff
    contract ZkTokenGovernor (0x10560f8B7eE37571AD7E3702EEb12Bc422036E89) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.3:
+        {"permission":"configure","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]}
      receivedPermissions.2:
+        {"permission":"configure","from":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","description":"propose transactions."}
      receivedPermissions.1.from:
-        "0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      receivedPermissions.1.description:
-        "grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token."
+        "execute transactions that are ready."
      receivedPermissions.1.via:
-        [{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]
      receivedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s.
      issuedPermissions.2:
+        {"permission":"configure","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"propose transactions.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0x76705327e682F2d96943280D99464Ab61219e34f","description":"execute transactions that are ready.","via":[]}
      issuedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract TokenTimelockController (0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.2:
+        {"permission":"configure","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"propose transactions.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0x10560f8B7eE37571AD7E3702EEb12Bc422036E89","description":"execute transactions that are ready.","via":[]}
      issuedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract ZkGovOpsGovernor (0x496869a7575A1f907D1C5B1eca28e4e9E382afAb) {
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Governance Advisory Proposals (GAPs) that are not executable onchain. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.2:
+        {"permission":"configure","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","description":"propose transactions."}
      receivedPermissions.1:
+        {"permission":"configure","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","description":"execute transactions that are ready."}
      receivedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      receivedPermissions.2:
+        {"permission":"configure","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"propose transactions."}
      receivedPermissions.1:
+        {"permission":"configure","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"execute transactions that are ready."}
      receivedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

```diff
    contract GovOpsTimelockController (0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19) {
    +++ description: Timelock contract allowing the queueing of transactions with a minimum delay of 3d.
      issuedPermissions.2:
+        {"permission":"configure","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"propose transactions.","via":[]}
      issuedPermissions.1:
+        {"permission":"configure","to":"0x496869a7575A1f907D1C5B1eca28e4e9E382afAb","description":"execute transactions that are ready.","via":[]}
      issuedPermissions.0.description:
-        "propose transactions."
+        "cancel queued transactions."
    }
```

Generated with discovered.json: 0xaa4e9dc207bc75f0cd3031a8eb0f73fec4be520a

# Diff at Mon, 27 Jan 2025 18:32:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3683d6e8b703ed59c2657f83d1b54955644c5977 block: 54670089
- current block number: 54684343

## Description

discodrive!

## Watched changes

```diff
    contract ZkProtocolGovernor (0x76705327e682F2d96943280D99464Ab61219e34f) {
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
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
    +++ description: Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed.
      values.currentQuorum_MTokens:
+        "630"
      values.proposalThreshold_MTokens:
+        "21"
      description:
+        "Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for Token Program Proposals (TPPs) usually targeting the ZK token on ZKsync Era. At least 21M ZK tokens are necessary to start a proposal (for delegates) and a 630M quorum of voted tokens must be met to succeed."
      issuedPermissions:
+        [{"permission":"configure","to":"0xcd2753Bd3829dfeC575AFC3816d4899CD103C62D","description":"make direct proposals without owning ZK tokens. In propose-guarded mode, this address is the ONLY allowed proposer. Propose-guarded mode is currently set to false.","via":[]},{"permission":"configure","to":"0xe788e09324F8bb3cc64f009973693f751C33b999","description":"cancel proposals while they are pending (after having been proposed) or active (during the voting period).","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","from":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","description":"propose transactions."},{"permission":"configure","from":"0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E","description":"grant the MINTER_ROLE to arbitrary addresses, thus controlling the minting of the ZK token.","via":[{"address":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6","delay":259200}]
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":24}}]
    }
```

```diff
    contract ProtocolTimelockController (0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8) {
    +++ description: Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s.
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
+        "Timelock contract that can send L2->L1 transactions to start a proposal in the ProtocolUpgradeHandler on Ethereum (L2_SENDER_ROLE). This timelock has a minimum delay of 0s."
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
      directlyReceivedPermissions:
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
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xC3e970cB015B5FC36edDf293D2370ef5D00F7a19","delay":259200}]
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
+        "0x10560f8B7eE37571AD7E3702EEb12Bc422036E89"
      issuedPermissions.0.via.0.address:
-        "0xdB1E46B448e68a5E35CB693a99D59f784aD115CC"
+        "0x3E21c654B545Bf6236DC08236169DcF13dA4dDd6"
      issuedPermissions.0.via.0.delay:
+        259200
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
    +++ description: Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed.
      values.currentQuorum_MTokens:
+        "630"
      values.proposalThreshold_MTokens:
+        "21"
      description:
+        "Main Governance contract allowing for token voting (simple majority) with the ZK token through delegates. This contract is used for protocol upgrade proposals (ZIPs) that start on ZKsync Era, go through Ethereum Layer 1 and can - from there - target all L1 and L2 contracts. At least 21M ZK tokens are necessary to start a proposal and a 630M quorum of voted tokens must be met to succeed."
      receivedPermissions:
+        [{"permission":"configure","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8","description":"propose transactions."}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0x3701fB675bCd4A85eb11A2467628BBe193F6e6A8"}]
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
