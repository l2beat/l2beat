Generated with discovered.json: 0xc6bf5903cce2ee5093106ac1fd35f185394cec33

# Diff at Wed, 18 Sep 2024 11:31:00 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@eb09774f0f9d9322f2117dfdfda7d4bb095f6c52 block: 19927688
- current block number: 20775852

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x11dd2d9B5ec142dbAFBEFEA82a75985Eae4e12b0) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      template:
+        "opstack/L1CrossDomainMessenger"
      descriptions:
+        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      categories:
+        ["Core"]
    }
```

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      directlyReceivedPermissions.1.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
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
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.4.target:
-        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
+        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
      receivedPermissions.3.target:
-        "0x909E51211e959339EFb14b36f5A50955a8ae3770"
+        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
      receivedPermissions.2.target:
-        "0x787A0ACaB02437c60Aafb1a29167A3609801e320"
+        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
      receivedPermissions.2.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x4082C9647c098a6493fb499EaE63b5ce3259c574"
+        "0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"
      receivedPermissions.1.via:
-        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      receivedPermissions.1.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x22bdeca9fe8c7fb73dbf1ea6a0ac0696d356ecf9

# Diff at Sun, 08 Sep 2024 17:17:46 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"},{"permission":"upgrade","target":"0x4082C9647c098a6493fb499EaE63b5ce3259c574"},{"permission":"upgrade","target":"0x787A0ACaB02437c60Aafb1a29167A3609801e320"},{"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770"},{"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"},{"permission":"upgrade","target":"0x4082C9647c098a6493fb499EaE63b5ce3259c574"},{"permission":"upgrade","target":"0x787A0ACaB02437c60Aafb1a29167A3609801e320"},{"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770"},{"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"}]
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions."]
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x787A0ACaB02437c60Aafb1a29167A3609801e320","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x4082C9647c098a6493fb499EaE63b5ce3259c574","via":[{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]}
      receivedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"
      receivedPermissions.0.via:
+        [{"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"}]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0:
+        {"address":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","delay":0}
    }
```

Generated with discovered.json: 0x9c819f01a661cd94f84f4004336eafc9e1aefc95

# Diff at Fri, 30 Aug 2024 07:50:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
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

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xbce73f390f3e47eecb3024cb6bf4536feab9e7c0

# Diff at Fri, 23 Aug 2024 09:50:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: None
      values.$upgradeCount:
+        4
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0x940825f4d5ccc389ec13cd1898dd8007420541cf

# Diff at Wed, 21 Aug 2024 10:01:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4082C9647c098a6493fb499EaE63b5ce3259c574","0x787A0ACaB02437c60Aafb1a29167A3609801e320","0x909E51211e959339EFb14b36f5A50955a8ae3770","0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"],"configure":["0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1","via":[]},{"permission":"upgrade","target":"0x4082C9647c098a6493fb499EaE63b5ce3259c574","via":[]},{"permission":"upgrade","target":"0x787A0ACaB02437c60Aafb1a29167A3609801e320","via":[]},{"permission":"upgrade","target":"0x909E51211e959339EFb14b36f5A50955a8ae3770","via":[]},{"permission":"upgrade","target":"0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x4082C9647c098a6493fb499EaE63b5ce3259c574) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x787A0ACaB02437c60Aafb1a29167A3609801e320) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract AddressManager (0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019","via":[]}]
    }
```

Generated with discovered.json: 0x2cbeb821f96bae0f1cc3737b3cf20caccb8a7a4b

# Diff at Fri, 09 Aug 2024 10:08:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4082C9647c098a6493fb499EaE63b5ce3259c574","0x787A0ACaB02437c60Aafb1a29167A3609801e320","0x909E51211e959339EFb14b36f5A50955a8ae3770","0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"]
      assignedPermissions.owner:
-        ["0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"]
      assignedPermissions.upgrade:
+        ["0x4082C9647c098a6493fb499EaE63b5ce3259c574","0x787A0ACaB02437c60Aafb1a29167A3609801e320","0x909E51211e959339EFb14b36f5A50955a8ae3770","0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca"]
      assignedPermissions.configure:
+        ["0x7a616b25E7c96fc4d652966d7DDAbB51dE28eCc1"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"]
      assignedPermissions.configure:
+        ["0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019"]
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

Generated with discovered.json: 0xd006631d52426a7542dbb69b5c018ff0a05af1f4

# Diff at Thu, 18 Jul 2024 10:29:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19927688
- current block number: 19927688

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927688 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x27ff92b30Cae00dABCF8045cc68fc9dcB67C5019, inheriting its permissions."]
    }
```

Generated with discovered.json: 0xe4639032fbd1e336dfb6bc223ea0ea8cb20c2d38

# Diff at Wed, 22 May 2024 20:04:57 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918875
- current block number: 19927688

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

Generated with discovered.json: 0xc32a7c7a041fd05ebe665655ae4552e25de6a5e1

# Diff at Tue, 21 May 2024 14:28:13 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19531398
- current block number: 19918875

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531398 (main branch discovery), not current.

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "AevoMultiSig"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x7ea75822b1ed65b8b2d69da70a1727f6abbd48b5

# Diff at Thu, 28 Mar 2024 08:24:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19411980
- current block number: 19531398

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19411980 (main branch discovery), not current.

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x5ac8e286dec030bdfa6c4454607ac3469df1550a

# Diff at Mon, 11 Mar 2024 12:55:52 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176638
- current block number: 19411980

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176638 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x7c248e7cf936813d85d694d339b4b74a03d9aa12

# Diff at Wed, 07 Feb 2024 13:34:15 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175204
- current block number: 19176638

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175204 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.sequencerInbox:
+        "0x253887577420Cb7e7418cD4d50147743c8041b28"
    }
```

Generated with discovered.json: 0x368096bbdf292ae6710cc705bf1eb0584f168ba1

# Diff at Wed, 07 Feb 2024 08:44:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19090313
- current block number: 19175204

## Description

Increased the gas limit.
Updated with the new OpDAHandler to remove the field.

## Watched changes

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.gasLimit:
-        30000000
+        150000000
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19090313 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        true
    }
```

Generated with discovered.json: 0xdbe6ce9040494aceffa3835445396479993d2e68

# Diff at Fri, 26 Jan 2024 10:54:51 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@bb037f7100968a00265a4787338e51ca81aafe9b block: 19032812
- current block number: 19090313

## Description

Added opStackDa handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19032812 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.opStackDA:
+        {"isAllTxsLengthEqualToCelestiaDAExample":true,"isSomeTxsLengthEqualToCelestiaDAExample":true}
    }
```

Generated with discovered.json: 0x7c9f89d35918320ff94fc04fa034065255687352

# Diff at Thu, 18 Jan 2024 09:19:36 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@0cb1eb82b45ad89a272a3c1b8f8f24ae020627cc block: 18933723
- current block number: 19032812

## Description

Changed dynamic and static L2 fee overhead.
Ignoring multisig nonce.

## Watched changes

```diff
    contract SystemConfig (0xF761Cc49bB127AB666899b41CDC4E62fA50cD9ca) {
      values.overhead:
-        2100
+        188
      values.scalar:
-        1000000
+        68400
    }
```

# Diff at Thu, 04 Jan 2024 11:38:42 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@45fa22227d0d99394ce6d0a25e40e8ceeca18cb3

## Description

One owner is removed and another is added to AevoMultiSig.

## Watched changes

```diff
    contract AevoMultiSig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
      values.getOwners.4:
-        "0x5553a23a71Bc7985c8E58Ca08072D2Fa9D1D1F4c"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.getOwners.3:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.getOwners.2:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.getOwners.1:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.getOwners.0:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.nonce:
-        8
+        9
    }
```

# Diff at Tue, 26 Sep 2023 09:30:32 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cfd4e281f2af40c7c69302b16c1308c0c5651be0

## Watched changes

```diff
    contract L2OutputOracle (0x909E51211e959339EFb14b36f5A50955a8ae3770) {
      values.deletedOutputs:
+        []
    }
```
