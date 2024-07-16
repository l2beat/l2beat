Generated with discovered.json: 0x8e6ad3cb28ab7b83c623ff0ca9f3440b1b8e7d34

# Diff at Tue, 16 Jul 2024 20:09:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@9916d4da5ec6a86bec108b3daa1ca189b3086b1a block: 20032828
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
+        ["The main entry point to deposit ERC20 tokens from L1 to L2. This contract can store any token."]
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
+        ["The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x3c01ebF22e9c111528c1E027D68944eDaB08Dfc9) {
    +++ description: None
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."]
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
+        ["Used to bridge ERC-721 tokens from L1 to L2."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x51A00470Eb50D758EcFF3B96DB0bF4A8e86268F4) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as the L2 representation of an L1 token, or vice-versa."]
    }
```

```diff
    contract SystemConfig (0x5D1F4bbaF6D484fA9D5D9705f92dE6063bff6055) {
    +++ description: None
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."]
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
