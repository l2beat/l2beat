Generated with discovered.json: 0x2857b7cc32864c486998374c5650111df06679b5

# Diff at Tue, 01 Oct 2024 10:53:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0x9Cb8F5CBD26d7843a6043EcaB3C12246F8F47FBA"]]]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0xaBA3C0FCe72122750D71d4739D7E5Fc7c8a355d4"]]]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:47.000Z",["0x08C033C6859093b2803e54DE715077bd400D5f6a"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-05-13T14:04:23.000Z",["0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19"]],["2024-05-13T14:04:47.000Z",["0x958487e21ba9E073836d598E31f749726f23413f"]]]
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0x4d4a060c945d3ee7625ef881e76e1744b92a522f

# Diff at Tue, 17 Sep 2024 09:19:45 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a17234c1dfeb209a9842df2b454c07e2b8da435d block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      directlyReceivedPermissions.1.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
+        ["Core"]
    }
```

Generated with discovered.json: 0x853e63a362fe17fee5d5625ac0958fe682ff1c84

# Diff at Sun, 08 Sep 2024 17:18:50 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions.","It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420","via":[{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]}
      receivedPermissions.1.target:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0xEa4165C5CDCA155779803A113d8391b741bA5228"
      receivedPermissions.1.via:
+        [{"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
      receivedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"}]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228"},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420"},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781"},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228"},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420"},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781"},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED"},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5"}]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","delay":0}
    }
```

Generated with discovered.json: 0x3bf5da31819ff1427e452945233ffe550cabb39b

# Diff at Fri, 30 Aug 2024 07:53:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.1.via:
-        []
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
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

Generated with discovered.json: 0xe377321f8f756baf61b172572d8db26130d2c3a0

# Diff at Fri, 23 Aug 2024 09:53:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0x98b95361b6a19b8d49a861ad2a039b3392df189b

# Diff at Wed, 21 Aug 2024 10:04:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0xC975862927797812371A9Fb631f83F8f5e2240D5","0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]},{"permission":"configure","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"],"configure":["0xEa4165C5CDCA155779803A113d8391b741bA5228"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xEa4165C5CDCA155779803A113d8391b741bA5228","via":[]},{"permission":"upgrade","target":"0x2b3F201543adF73160bA42E1a5b7750024F30420","via":[]},{"permission":"upgrade","target":"0x59625d1FE0Eeb8114a4d13c863978F39b3471781","via":[]},{"permission":"upgrade","target":"0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","via":[]},{"permission":"upgrade","target":"0xC975862927797812371A9Fb631f83F8f5e2240D5","via":[]}]
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"upgrade","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

```diff
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","via":[]}]
    }
```

Generated with discovered.json: 0xffa2ec60da5474402f9060f965246766d95f3576

# Diff at Fri, 09 Aug 2024 12:00:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.configure.1:
-        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
+        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
      assignedPermissions.configure.0:
-        "0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"
+        "0xC975862927797812371A9Fb631f83F8f5e2240D5"
    }
```

Generated with discovered.json: 0xebbfc6090005d5430c4cdbea02ba0d9321224635

# Diff at Fri, 09 Aug 2024 10:10:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions. It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0xC975862927797812371A9Fb631f83F8f5e2240D5","0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF"]
      assignedPermissions.configure:
+        ["0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
      values.$multisigThreshold:
-        "4 of 7 (57%)"
      values.getOwners:
-        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xF3313C48BD8E17b823d5498D62F37019dFEA647D","0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0","0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C","0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 7 (57%)"
    }
```

```diff
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
      assignedPermissions.owner:
-        ["0xEa4165C5CDCA155779803A113d8391b741bA5228"]
      assignedPermissions.upgrade:
+        ["0x2b3F201543adF73160bA42E1a5b7750024F30420","0x59625d1FE0Eeb8114a4d13c863978F39b3471781","0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED","0xC975862927797812371A9Fb631f83F8f5e2240D5"]
      assignedPermissions.configure:
+        ["0xEa4165C5CDCA155779803A113d8391b741bA5228"]
    }
```

Generated with discovered.json: 0xef5d9930be760333d1e12f203bc4672f43849710

# Diff at Tue, 30 Jul 2024 11:12:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x1d9d5f50fa5e5186410fb005a1c9728894bcede5

# Diff at Thu, 18 Jul 2024 10:31:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20032860
- current block number: 20032860

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20032860 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF, inheriting its permissions.","It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

Generated with discovered.json: 0x8907a9d0268c44c81ceacbf6af9438ae3a744a10

# Diff at Thu, 06 Jun 2024 12:44:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@5302ef2899ddfb7175df497ceaa47fba4e383655 block: 19982484
- current block number: 20032860

## Description

Discovery output now includes names of templates used for contract analysis.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19982484 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      template:
+        "GnosisSafe"
    }
```

```diff
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781) {
    +++ description: The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
    }
```

```diff
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
    }
```

```diff
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5) {
    +++ description: Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
      template:
+        "opstack/SystemConfig"
    }
```

```diff
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19) {
    +++ description: Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
    }
```

Generated with discovered.json: 0x88e0f828470372caf9a8af58d6227cfdd9d9c65d

# Diff at Thu, 23 May 2024 13:58:42 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@ec50a072d7124fbf2bdaa30b50f821730ba6e919 block: 19926571
- current block number: 19933028

## Description

ConduitMultisig update.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
-        "3 of 5 (60%)"
+        "4 of 7 (57%)"
      values.getOwners.6:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.5:
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.4:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.3:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.2:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.getOwners.1:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.getOwners.0:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.getThreshold:
-        3
+        4
    }
```

Generated with discovered.json: 0x4fe6b15ce9fb31f900191985a91e36dad486b310

# Diff at Wed, 22 May 2024 16:20:16 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19926571

## Description

First discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2b3F201543adF73160bA42E1a5b7750024F30420)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x59625d1FE0Eeb8114a4d13c863978F39b3471781)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xB751A613f2Db932c6cdeF5048E6D2af05F9B98ED)
    +++ description: Central actor allowed to post new L2 state roots to L1.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xc684075a7Cc997Aa2e72152c330BDAc73FeacbDF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xC975862927797812371A9Fb631f83F8f5e2240D5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xEa4165C5CDCA155779803A113d8391b741bA5228)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xf80be9f7a74ab776b69d3F0dC5C08c39b3A0bA19)
    +++ description: None
```
