Generated with discovered.json: 0x1e8181200f1d3b9c1028c2384d31a6291db71c12

# Diff at Fri, 23 Aug 2024 09:51:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x4cb868d55887fc0f08e997e8b1995b5729c81918

# Diff at Wed, 21 Aug 2024 10:02:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","0x12a580c05466eefb2c467C6b115844cDaF55B255","0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd","0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","0xa669A743b065828682eE16109273F5CFeF5e676d"],"configure":["0x19b5804B88F10262A55ac731f28A3BbC4209853a"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x19b5804B88F10262A55ac731f28A3BbC4209853a","via":[]},{"permission":"upgrade","target":"0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","via":[]},{"permission":"upgrade","target":"0x12a580c05466eefb2c467C6b115844cDaF55B255","via":[]},{"permission":"upgrade","target":"0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","via":[]},{"permission":"upgrade","target":"0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","via":[]},{"permission":"upgrade","target":"0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd","via":[]},{"permission":"upgrade","target":"0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","via":[]},{"permission":"upgrade","target":"0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","via":[]},{"permission":"upgrade","target":"0xa669A743b065828682eE16109273F5CFeF5e676d","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: It can act on behalf of 0x7E54107731EC43e78DA678DFa5fB6222Ad036e03, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x7E54107731EC43e78DA678DFa5fB6222Ad036e03","via":[]}]
    }
```

Generated with discovered.json: 0xd0a9aa16fd55fedaae26d35743f79d92292f5ba9

# Diff at Fri, 09 Aug 2024 11:59:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.7:
-        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
+        "0xa669A743b065828682eE16109273F5CFeF5e676d"
      assignedPermissions.upgrade.6:
-        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
+        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
      assignedPermissions.upgrade.5:
-        "0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055"
+        "0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4"
      assignedPermissions.upgrade.4:
-        "0xa669A743b065828682eE16109273F5CFeF5e676d"
+        "0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"
      assignedPermissions.upgrade.1:
-        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
+        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
      assignedPermissions.upgrade.0:
-        "0x12a580c05466eefb2c467C6b115844cDaF55B255"
+        "0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49"
    }
```

Generated with discovered.json: 0x09cff86baf3a6efb2719c8d8ad52ddfc6cb7c521

# Diff at Fri, 09 Aug 2024 10:09:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","0x12a580c05466eefb2c467C6b115844cDaF55B255","0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd","0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","0xa669A743b065828682eE16109273F5CFeF5e676d"]
      assignedPermissions.owner:
-        ["0x19b5804B88F10262A55ac731f28A3BbC4209853a"]
      assignedPermissions.upgrade:
+        ["0x12a580c05466eefb2c467C6b115844cDaF55B255","0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49","0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D","0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99","0xa669A743b065828682eE16109273F5CFeF5e676d","0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055","0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4","0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd"]
      assignedPermissions.configure:
+        ["0x19b5804B88F10262A55ac731f28A3BbC4209853a"]
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: It can act on behalf of 0x7E54107731EC43e78DA678DFa5fB6222Ad036e03, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"]
      assignedPermissions.configure:
+        ["0x7E54107731EC43e78DA678DFa5fB6222Ad036e03"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2","0xaC79765A73eB9dcBd3c427181E6819902AE25b48","0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7","0x1a76Ed328600489811F819959a74043f106CF0f9"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2","0xaC79765A73eB9dcBd3c427181E6819902AE25b48","0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7","0x1a76Ed328600489811F819959a74043f106CF0f9"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xd1a127cc971270b32d9e81215625b88768a84afb

# Diff at Tue, 30 Jul 2024 11:11:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0xe7dd9477f228d06317c8bfc69e1bb5c7b7d1cc28

# Diff at Thu, 18 Jul 2024 10:30:30 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20032828
- current block number: 20032828

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032828 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D) {
    +++ description: None
      template:
+        "opstack/SuperchainConfig"
      descriptions:
+        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      categories:
+        ["Upgrades&Governance"]
    }
```

```diff
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99) {
    +++ description: None
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: None
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: None
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
    }
```

```diff
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x7E54107731EC43e78DA678DFa5fB6222Ad036e03, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x51efc218ab04b3da7821488a55fc4c9bbad2a919

# Diff at Thu, 06 Jun 2024 12:37:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@5302ef2899ddfb7175df497ceaa47fba4e383655 block: 19888830
- current block number: 20032828

## Description

Discovery output now includes names of templates used for contract analysis.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19888830 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0x97e1f05644a07a906b0c40d7e6979a3d9279b28e

# Diff at Fri, 17 May 2024 09:35:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cf6498d339a075296e717008e17a69561c236726 block: 19875660
- current block number: 19888830

## Description

Signers added to Owner Multisig, threshold changed to 3/4. EOA warning is removed.

The DAChallenge contract has resolverRefundPercentage set to 100%. A successful resolve now gets `( fixedResolutionCost + preImageLength * variableResolutionCost / variableResolutionCostPrecision ) * block.basefee` as a refund. Depending on the other variables, a malicious Sequencer can now challenge itself infinitely without cost.

## Watched changes

```diff
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49) {
    +++ description: None
      values.resolverRefundPercentage:
-        0
+        100
    }
```

```diff
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398) {
    +++ description: None
      upgradeability.threshold:
-        "1 of 1 (100%)"
+        "3 of 4 (75%)"
      values.getOwners.3:
+        "0x1a76Ed328600489811F819959a74043f106CF0f9"
      values.getOwners.2:
+        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.getOwners.1:
+        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.getOwners.0:
-        "0x1a76Ed328600489811F819959a74043f106CF0f9"
+        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.getThreshold:
-        1
+        3
    }
```

Generated with discovered.json: 0xf826b642d402796210be75a928daf70a983bd0df

# Diff at Wed, 15 May 2024 13:24:31 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19875660

## Description

Initial discovery: Cyber is an OP stack plasma mode L2 using custom DA (currently not yet EigenDA).

## Initial discovery

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x10E34EfE14E4D270C0f77Bf1aF01b6C832161B49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x12a580c05466eefb2c467C6b115844cDaF55B255)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x19b5804B88F10262A55ac731f28A3BbC4209853a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x1aeC4c3BE47C30d0BEfa7514Cf9D99EaC596959D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x1d59bc9fcE6B8E2B1bf86D4777289FFd83D24C99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x4F4B716627D2Ba0439327Ce8B563b4443aF47Dbd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x7E54107731EC43e78DA678DFa5fB6222Ad036e03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xa669A743b065828682eE16109273F5CFeF5e676d)
    +++ description: Central actor allowed to post new L2 state roots to L1.
```

```diff
+   Status: CREATED
    contract ProxyAdminOwner (0xc2259E7Fb719411f97aBdCdf449f6Ba3B9D75398)
    +++ description: None
```
