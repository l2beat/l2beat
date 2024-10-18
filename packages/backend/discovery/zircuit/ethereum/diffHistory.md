Generated with discovered.json: 0xffc1f4e59cfb0817460af8d85544d63023976fb2

# Diff at Wed, 16 Oct 2024 11:43:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0x2c0B27F7C8F083B539557a0bA787041BF22DB276"
    }
```

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      roles:
-        ["Guardian"]
      receivedPermissions:
+        [{"permission":"guard","target":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145"
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xE8C20EA8eF100d7aa3846616E5D07A5aBb067C65","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257"
+        "0xC463EaC02572CC964D43D2414023E2c6B62bAF38"
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      roles:
-        ["Challenger"]
      receivedPermissions.1:
+        {"permission":"configure","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."}
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x8d402841bbe226ee88c8e03608a48f88597290b3

# Diff at Mon, 14 Oct 2024 10:58:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x9388575e8cf83880125e7770a596c83a0ad9c191b71f1990544987cbd0dbd4c0"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x1e3673770550301c22eadd847cc822cfbc995c36019d1dfce07b2ec9cffd930f"]
    }
```

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x06f2d961bb4a244d73779f83003fd66fcda3cc297693cd348d8ac1aa8c29dc63"]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x3a72e01a50e4baf0c333aa3ad2413675a95c2fc68a18d8a95b3a65179e98ccbc"]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      sourceHashes:
+        ["0x9097b28161923c9e2353a796f1580ecf8bf3415bae9a69f49102bdf7a1b94da8"]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x15cce087eeab52950ec9f98df3ec3bb507edb1fac086fa0674aad4994d49049d"]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x39037837abcc5e06ffe85b07ad5f5ce901ed8551155a1b3b81cfd181bd683593"]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x2f020370d4312debb7d9c97dbf80a48a0a0ee81d261d6d239d6b01d0dd076c81"]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0x7328459427570e205526a415613989750227c38d95138613a718c573132fdd17"]
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      sourceHashes:
+        ["0x58e0fa3818df29fbb7de4e09a8c62f8952335a4ac32e30256ae72fd9681d7b50","0xae58fedc9cba4efd31498542acf99901aec1544412fb8cf69fa5c7e804602cc7"]
    }
```

Generated with discovered.json: 0x504f3c5a439bf4c23b96ea7798ec84dc7a81ca5f

# Diff at Tue, 01 Oct 2024 11:11:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20827058
- current block number: 20827058

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20827058 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-07-02T16:13:23.000Z",["0x8Ab1b1E21c2f229a7bB1430CF3ADfb0644a69ab7"]],["2024-07-16T08:48:59.000Z",["0x304a52C8354f323672191Ebf1347Cd3d494Ea830"]],["2024-07-17T12:11:35.000Z",["0xde8B916B972cE3c27C21157Fc2b107c413062b9d"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-07-02T16:12:35.000Z",["0x6c01D349d3010Cc2953fFA0A5e8d176fc273B834"]]]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-07-02T16:11:47.000Z",["0xA03E2f3Ee6dBa20411A2326D7FA9CCCc6a9A53de"]]]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        [["2024-07-02T16:11:59.000Z",["0x7409668285336dBBe720bE3525AEe372Fce4c2ab"]],["2024-07-16T08:48:59.000Z",["0xE14b12F4843447114A093D99Dc9322b93a967DE6"]],["2024-07-16T08:48:59.000Z",["0x0Fc6203310c494963eBAdd1157780a613B67eCDf"]],["2024-07-17T12:11:35.000Z",["0xA4ba8bd753695B6121722CBB7cd81c71BCFBCA28"]]]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-02T16:13:35.000Z",["0x6a8497798ae8B398608B49b003ECB23aC0756E06"]],["2024-07-03T09:00:47.000Z",["0xA153Ec874DaB9e6590cFcf4DC3f5bb86FfaC08B9"]],["2024-08-12T16:32:59.000Z",["0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"]]]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-02T16:08:11.000Z",["0xA47314C96ab9572af656788e15143B459F99AE0f"]]]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-07-02T16:12:59.000Z",["0xaaF7FCc7252eb739E0001D8727800deAE04A84f1"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-07-02T16:12:11.000Z",["0x3B21dC86c412aC34fF4c679497b274509D73cDcC"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-07-02T16:12:23.000Z",["0xf885DA6A3B4c93905b02f36f9a13680922A554b0"]]]
    }
```

Generated with discovered.json: 0x7739dd387f09b162dfd31f9caa7e750639621a36

# Diff at Wed, 25 Sep 2024 10:35:52 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e8c4fe6b10f7918ebbd761bc35018ba84053b08c block: 20619826
- current block number: 20827058

## Description

Limits changed. The maximum total deposit limit is removed (unlimited) and withdrawal limits per period are raised.

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.ethThrottleDeposits.maxAmountTotal:
-        "3000000000000000000000"
+        0
      values.ethThrottleWithdrawals.maxAmountPerPeriod:
-        "500000000000000000000"
+        "1000000000000000000000"
      values.getEthThrottleWithdrawalsCredits:
-        "500000000000000000000"
+        "1000000000000000000000"
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.ethThrottleDeposits.maxAmountPerPeriod:
-        "50000000000000000000"
+        0
    }
```

Generated with discovered.json: 0x8ec193a124244817461cb28bc56248ba72ba973e

# Diff at Sun, 08 Sep 2024 17:24:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20619826
- current block number: 20619826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20619826 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      receivedPermissions.3.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0xed1a5ff267d65269cdac030b1e7d6b49475b8871

# Diff at Fri, 30 Aug 2024 08:01:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20619826
- current block number: 20619826

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20619826 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
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
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x5f23bb0b276568036f80cd0694ccc59eac7d6d7d

# Diff at Fri, 23 Aug 2024 09:56:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20584587
- current block number: 20584587

## Description

Config changes related to changing grantedPermissions to issuedPermissions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20584587 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        3
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"configure","target":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[]},{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        4
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","0x2a721cBE81a128be0F01040e3353c3805A5EA091","0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","0x6BCe7408c0781dcE7b71494274302D4b75a1447c","0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","0x92Ef6Af472b39F1b363da45E35530c24619245A4","0x994eEb321F9cD79B077a5455fC248c77f30Dd244","0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","via":[]},{"permission":"upgrade","target":"0x2a721cBE81a128be0F01040e3353c3805A5EA091","via":[]},{"permission":"upgrade","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]},{"permission":"upgrade","target":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","via":[]},{"permission":"upgrade","target":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c","via":[]},{"permission":"upgrade","target":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","via":[]},{"permission":"upgrade","target":"0x92Ef6Af472b39F1b363da45E35530c24619245A4","via":[]},{"permission":"upgrade","target":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244","via":[]},{"permission":"upgrade","target":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932","via":[]}]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      values.$upgradeCount:
+        3
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      values.$upgradeCount:
+        1
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

Generated with discovered.json: 0x8da8c2de0f2d0c615e4437db1483d52ecf12f157

# Diff at Thu, 22 Aug 2024 13:57:11 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@f2b78de1ce1e36fdbbec8b0ae072ca46ec7c1c8d block: 20563605
- current block number: 20584587

## Description

The Guardian Multisig (2/5) and Zircuit Multisig (6/8) now have more members and higher threshold. Previously the Zircuit Multisig was a 1/3 and we've missed adding the warning.

## Watched changes

```diff
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276) {
    +++ description: None
      values.$members.4:
+        "0x38809210f69ed6204E276d2Be6b15cd530698679"
      values.$members.3:
+        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.$members.2:
+        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.$members.1:
+        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.$members.0:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.$threshold:
-        1
+        2
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "2 of 5 (40%)"
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      values.$members.7:
+        "0x38809210f69ed6204E276d2Be6b15cd530698679"
      values.$members.6:
+        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
      values.$members.5:
+        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
      values.$members.4:
+        "0x2F9072d5A8118a60ce41611AEe3e393D107f8Cec"
      values.$members.3:
+        "0x5E2a81d611e973C2ab1A4cAa71DD4E4Cdb2617d4"
      values.$members.2:
-        "0x38809210f69ed6204E276d2Be6b15cd530698679"
+        "0x63cbB9fA540F6249AE4A3576f48BF07609b3a355"
      values.$members.1:
-        "0x62C688FCa995e07632D64A9586896BB7EcD68567"
+        "0xC1Ea584f696ABF39044c18D510067f0Ce2cC8966"
      values.$members.0:
-        "0x0D5edFC67Ae336eddC91031FD6402EeAD6350CAb"
+        "0xD8399320cF3a6C7068DaC0C35ea5e74ddd650BD4"
      values.$threshold:
-        1
+        6
      values.multisigThreshold:
-        "1 of 3 (33%)"
+        "6 of 8 (75%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20563605 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"configure","target":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[]},{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","via":[]},{"permission":"upgrade","target":"0x2a721cBE81a128be0F01040e3353c3805A5EA091","via":[]},{"permission":"upgrade","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]},{"permission":"upgrade","target":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","via":[]},{"permission":"upgrade","target":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c","via":[]},{"permission":"upgrade","target":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","via":[]},{"permission":"upgrade","target":"0x92Ef6Af472b39F1b363da45E35530c24619245A4","via":[]},{"permission":"upgrade","target":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244","via":[]},{"permission":"upgrade","target":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932","via":[]}]
      assignedPermissions:
+        {"upgrade":["0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","0x2a721cBE81a128be0F01040e3353c3805A5EA091","0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","0x6BCe7408c0781dcE7b71494274302D4b75a1447c","0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","0x92Ef6Af472b39F1b363da45E35530c24619245A4","0x994eEb321F9cD79B077a5455fC248c77f30Dd244","0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"]}
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions:
-        [{"permission":"configure","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]}]
      assignedPermissions:
+        {"configure":["0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"]}
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

Generated with discovered.json: 0x3c39cd542517a443c87cfb7c168f96b603f1cd96

# Diff at Wed, 21 Aug 2024 10:06:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20563605
- current block number: 20563605

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20563605 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xC463EaC02572CC964D43D2414023E2c6B62bAF38","via":[]},{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","0x2a721cBE81a128be0F01040e3353c3805A5EA091","0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","0x6BCe7408c0781dcE7b71494274302D4b75a1447c","0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","0x92Ef6Af472b39F1b363da45E35530c24619245A4","0x994eEb321F9cD79B077a5455fC248c77f30Dd244","0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1","via":[]},{"permission":"upgrade","target":"0x2a721cBE81a128be0F01040e3353c3805A5EA091","via":[]},{"permission":"upgrade","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]},{"permission":"upgrade","target":"0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8","via":[]},{"permission":"upgrade","target":"0x6BCe7408c0781dcE7b71494274302D4b75a1447c","via":[]},{"permission":"upgrade","target":"0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0","via":[]},{"permission":"upgrade","target":"0x92Ef6Af472b39F1b363da45E35530c24619245A4","via":[]},{"permission":"upgrade","target":"0x994eEb321F9cD79B077a5455fC248c77f30Dd244","via":[]},{"permission":"upgrade","target":"0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932","via":[]}]
    }
```

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

```diff
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257","via":[]}]
    }
```

Generated with discovered.json: 0xb13c2f3ee9724b0313aff13467b331ac62c7769b

# Diff at Mon, 19 Aug 2024 15:36:01 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5417c4717b5cefeed17cd8419a7eb2dda22d4206 block: 20519354
- current block number: 20563605

## Description

Increased their withdrawal limits for ETH (amount that can be withdrawn before getting throttled) to 500 ETH and the deposit limit to 50 ETH.

## Watched changes

```diff
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.ethThrottleWithdrawals.maxAmountPerPeriod:
-        "300000000000000000000"
+        "500000000000000000000"
      values.getEthThrottleWithdrawalsCredits:
-        "300000000000000000000"
+        "500000000000000000000"
    }
```

```diff
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.ethThrottleDeposits.maxAmountPerPeriod:
-        "1000000000000000000"
+        "50000000000000000000"
    }
```

Generated with discovered.json: 0x202698101e977c3a33e24d85257db8d4fc2d0a62

# Diff at Tue, 13 Aug 2024 11:18:48 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@925407501fd3d01acc73c6851abc4b5c56e2e056 block: 20490461
- current block number: 20519354

## Description

Nothing significant has changed, likely a small upgrade to the circuit

## Watched changes

```diff
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c) {
    +++ description: None
      values.$implementation:
-        "0xA153Ec874DaB9e6590cFcf4DC3f5bb86FfaC08B9"
+        "0x13A06FF21E46BCCd4B03E5Cb04372bB7aE7f2168"
      values.version:
-        "6ad34d4fc0cb1cbbed736b058d02532e881f9674"
+        "0c13cfbb19b823f524a346e7ff5b352e24b8d79b"
    }
```

## Source code changes

```diff
.../Verifier/Verifier.sol                          | 166 ++++++++++-----------
 1 file changed, 83 insertions(+), 83 deletions(-)
```

Generated with discovered.json: 0x576473c0656040c6d9b2a979123507d0bb002581

# Diff at Fri, 09 Aug 2024 12:10:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@43f10227394a700c20a2a00a94db255d929b2777 block: 20490461
- current block number: 20490461

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20490461 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.8:
-        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
+        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
      assignedPermissions.upgrade.6:
-        "0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932"
+        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
      assignedPermissions.upgrade.5:
-        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
+        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
      assignedPermissions.upgrade.4:
-        "0x92Ef6Af472b39F1b363da45E35530c24619245A4"
+        "0x6BCe7408c0781dcE7b71494274302D4b75a1447c"
      assignedPermissions.upgrade.3:
-        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
+        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
      assignedPermissions.upgrade.2:
-        "0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0"
+        "0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff"
      assignedPermissions.upgrade.0:
-        "0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8"
+        "0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1"
    }
```

Generated with discovered.json: 0xa87cd2a83ac938e7e57e7e3f83cdfa45e40f27f9

# Diff at Fri, 09 Aug 2024 11:46:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- current block number: 20490461

## Description

Initial discovery: Fork from the latest pre-FP OP stack contracts with added ZK proofs.

## Initial discovery

```diff
+   Status: CREATED
    contract OptimismPortal (0x17bfAfA932d2e23Bd9B909Fd5B4D2e2a27043fb1)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2a721cBE81a128be0F01040e3353c3805A5EA091)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ZircuitGuardianMultiSig (0x2c0B27F7C8F083B539557a0bA787041BF22DB276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x30F82a1Ca89226E8b8815d6EbB728e3b18a428ff)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x386B76D9cA5F5Fb150B6BFB35CF5379B22B26dd8)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5B1Ef673d9c316b3eE9Ed3B4E3cC84952bfC5257)
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
```

```diff
+   Status: CREATED
    contract Verifier (0x6BCe7408c0781dcE7b71494274302D4b75a1447c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZircuitSuperchainConfig (0x745393Cc03b5fE668ECd52c0E625f59aAD6D3Da0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x92Ef6Af472b39F1b363da45E35530c24619245A4)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x994eEb321F9cD79B077a5455fC248c77f30Dd244)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract ZircuitMultiSig (0xC463EaC02572CC964D43D2414023E2c6B62bAF38)
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc77ece87C91C44AFb5f19638f9a0F75b5d90E932)
    +++ description: None
```
