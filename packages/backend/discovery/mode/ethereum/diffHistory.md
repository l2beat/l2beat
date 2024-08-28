Generated with discovered.json: 0xa4aa2895df01ae7ea7a17ea2189786228004041e

# Diff at Fri, 23 Aug 2024 09:53:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        7
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

Generated with discovered.json: 0xc6f095cb396951462001e142d81600fdd2ffcfbe

# Diff at Wed, 21 Aug 2024 10:04:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x2901dA832a4D0297FF0691100A8E496626cc626D","0x4317ba146D4933D889518a3e5E11Fe7a53199b04","0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","0x69216395A62dFb243C05EF4F1C27AF8655096a95","0x735aDBbE72226BD52e818E7181953f42E3b0FF21","0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"],"configure":["0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15","via":[]},{"permission":"upgrade","target":"0x2901dA832a4D0297FF0691100A8E496626cc626D","via":[]},{"permission":"upgrade","target":"0x4317ba146D4933D889518a3e5E11Fe7a53199b04","via":[]},{"permission":"upgrade","target":"0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","via":[]},{"permission":"upgrade","target":"0x69216395A62dFb243C05EF4F1C27AF8655096a95","via":[]},{"permission":"upgrade","target":"0x735aDBbE72226BD52e818E7181953f42E3b0FF21","via":[]},{"permission":"upgrade","target":"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","via":[]}]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","via":[]}]
    }
```

```diff
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"],"configure":["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xdE1FCfB0851916CA5101820A69b13a4E276bd81F","via":[]},{"permission":"upgrade","target":"0x95703e0982140D16f8ebA6d158FccEde42f04a4C","via":[]}]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x470d87b1dae09a454A43D1fD772A561a03276aB7","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]},{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x470d87b1dae09a454A43D1fD772A561a03276aB7","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

```diff
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x543bA4AADBAb8f9025686Bd03993043599c6fB04","via":[]}]
    }
```

Generated with discovered.json: 0xab19b50883073914e8522303459553cc8bdabf2d

# Diff at Fri, 09 Aug 2024 12:00:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.5:
-        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      assignedPermissions.upgrade.4:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
+        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      assignedPermissions.upgrade.3:
-        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
+        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      assignedPermissions.upgrade.2:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      assignedPermissions.upgrade.1:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
    }
```

Generated with discovered.json: 0xe0aa3df3a6070ebaac253cddc268a74360ef2bcc

# Diff at Fri, 09 Aug 2024 10:10:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20475234
- current block number: 20475234

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20475234 (main branch discovery), not current.

```diff
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

```diff
    contract ChallengerMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0x8DF5F3E4a0688595b02768c37F32424365F36f26","0x0825BdB1A5868682B1F880CF1E743e0bA4634ceC","0xa85EF4aEDf7B395cDbb894DF8F017E8A73f4a6fB","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.getThreshold:
-        4
      values.$members:
+        ["0x8DF5F3E4a0688595b02768c37F32424365F36f26","0x0825BdB1A5868682B1F880CF1E743e0bA4634ceC","0xa85EF4aEDf7B395cDbb894DF8F017E8A73f4a6fB","0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f","0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038","0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xb23794fd6BA1CEAd01Cf54D772b8341F2F0197A5","0x4665374939642965EfD8357D4568D2A77f677429"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x2901dA832a4D0297FF0691100A8E496626cc626D","0x4317ba146D4933D889518a3e5E11Fe7a53199b04","0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","0x69216395A62dFb243C05EF4F1C27AF8655096a95","0x735aDBbE72226BD52e818E7181953f42E3b0FF21","0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"]
      assignedPermissions.owner:
-        ["0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"]
      assignedPermissions.upgrade:
+        ["0x2901dA832a4D0297FF0691100A8E496626cc626D","0x735aDBbE72226BD52e818E7181953f42E3b0FF21","0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07","0x4317ba146D4933D889518a3e5E11Fe7a53199b04","0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221","0x69216395A62dFb243C05EF4F1C27AF8655096a95"]
      assignedPermissions.configure:
+        ["0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15"]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"]
      assignedPermissions.configure:
+        ["0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"]
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
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.owner:
-        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
      assignedPermissions.upgrade:
+        ["0x95703e0982140D16f8ebA6d158FccEde42f04a4C"]
      assignedPermissions.configure:
+        ["0xdE1FCfB0851916CA5101820A69b13a4E276bd81F"]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x470d87b1dae09a454A43D1fD772A561a03276aB7","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      assignedPermissions.configure:
+        ["0x470d87b1dae09a454A43D1fD772A561a03276aB7","0x543bA4AADBAb8f9025686Bd03993043599c6fB04"]
      values.$multisigThreshold:
-        "2 of 2 (100%)"
      values.getOwners:
-        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x847B5c174615B1B7fDF770882256e2D3E95b9D92","0xc2819DC788505Aac350142A7A707BF9D03E3Bd03"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 2 (100%)"
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2.
      values.$multisigThreshold:
-        "5 of 7 (71%)"
      values.getOwners:
-        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.getThreshold:
-        5
      values.$members:
+        ["0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64","0x3041BA32f451F5850c147805F5521AC206421623","0xE7dEA1306D9F829bA469d1904c50903b46ebd02e","0xBF93D4d727F7Ba1F753E1124C3e532dCb04Ea2c8","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0x9bbFB9919062C29a5eE15aCD93c9D7c3b14d31aa"]
      values.$threshold:
+        5
      values.multisigThreshold:
+        "5 of 7 (71%)"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      values.$multisigThreshold:
-        "10 of 13 (77%)"
      values.getOwners:
-        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.getThreshold:
-        10
      values.$members:
+        ["0x07dC0893cAfbF810e3E72505041f2865726Fd073","0x0a122d8aA40758FBAFf0360BFB391EdFfD9758b8","0x1822b35B09f5ce1C78ecbC06AC0A4e17885b925e","0x4A7322258c9E690e4CB8Cea6e5251443E956e61E","0x51aCb8e1205De850D1b512584FeE9C29C3813dDa","0x5C0F529d5B025540c54f71d2BcbB4c78F368C47e","0x6323ef2b80030f3fBc508bFc321Fc71fDB95c865","0x74FAE9a9fbe31d1F69b95f59CaF12736a8b6B310","0x7ed8d9Af9eaA194D1A75C67c1475579E42289E39","0x8Afe777B5A4D1e156435ab44Ad4b73A318cE0EA4","0x9Eb11A55132c851b9991F148b3Af791ca498fD7A","0xbfA046B0bc5cEa1596be62B8b3f79f9f41f1E0d9","0xE895076cD050F1f042d1040E47b5929bE989E514"]
      values.$threshold:
+        10
      values.multisigThreshold:
+        "10 of 13 (77%)"
    }
```

Generated with discovered.json: 0xd220121ce90c4ff9be1a2a9416be1d074c02f1ec

# Diff at Wed, 07 Aug 2024 07:35:36 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@47685977ba2390a8eafac8e0d4cac7c81dff5758 block: 20211472
- current block number: 20475234

## Description

The ProxyAdmin owner is changed to SuperchainProxyAdminOwner and Conduit Multisig is removed.

## Watched changes

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      values.owner:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      descriptions.1:
-        "It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      descriptions.0:
-        "It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions."
+        "It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      assignedPermissions.owner.1:
-        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
      assignedPermissions.owner.0:
-        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions. It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions.
      descriptions.1:
+        "It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."
      descriptions.0:
-        "It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."
+        "It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions."
      assignedPermissions.owner.1:
+        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
      assignedPermissions.owner.0:
-        "0x543bA4AADBAb8f9025686Bd03993043599c6fB04"
+        "0x470d87b1dae09a454A43D1fD772A561a03276aB7"
    }
```

Generated with discovered.json: 0x28abf5e906cdaadf3ba88273bce0525f6320b16a

# Diff at Tue, 30 Jul 2024 11:12:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20211472
- current block number: 20211472

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211472 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x8b699b8c889c7f74f8931bd192aa598bd1a0f2c6

# Diff at Thu, 18 Jul 2024 10:32:01 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20211472
- current block number: 20211472

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20211472 (main branch discovery), not current.

```diff
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748) {
    +++ description: None
      values.livenessInterval:
-        8467200
+        "98d"
      template:
+        "gnosisSafeModules/LivenessModule"
      descriptions:
+        ["used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig"]
    }
```

```diff
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25) {
    +++ description: None
      descriptions:
+        ["Liveness Guard of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - used to remove members inactive for 98d."]
    }
```

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: None
      descriptions.0:
-        "Used to bridge ERC-721 tokens from L1 to L2"
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x470d87b1dae09a454A43D1fD772A561a03276aB7, inheriting its permissions.","It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
    }
```

```diff
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x543bA4AADBAb8f9025686Bd03993043599c6fB04, inheriting its permissions."]
    }
```

```diff
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8) {
    +++ description: None
      template:
+        "gnosisSafeModules/DeputyGuardianModule"
      descriptions:
+        ["allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A (the deputy guardian) to act on behalf of the Gnosis Safe."]
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: None
      descriptions.0:
-        "The main entry point to deposit ERC20 tokens from L1 to L2. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      descriptions:
+        ["Fallback Owner of 0x0454092516c9A4d636d3CAfA1e82161376C8a748 - takes ownership of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 if the number of members falls below 8."]
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: None
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: None
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      descriptions:
+        ["Deputy Guardian of 0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8. It can act on behalf of the 0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2."]
    }
```

Generated with discovered.json: 0x9f87d66ebe309620dc3eca424e960eb28adb0d82

# Diff at Fri, 28 Jun 2024 07:30:45 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@555efdd96fadc389c2c70beacf820125fbb25a7d block: 20073661
- current block number: 20188700

## Description

Nonce of foundation multisig increased, after executing transaction to change the owner of the SystemConfig contract.

## Watched changes

```diff
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.nonce:
-        92
+        93
    }
```

Generated with discovered.json: 0x6a375fc46bdbde85214e37d66370814e5f3b66c1

# Diff at Wed, 12 Jun 2024 05:28:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@09246cd19afe46cf207c325923fef8f51d581735 block: 19927713
- current block number: 20073661

## Description

Changes due to Superchain permissions upgrade: 
- Security Council MS threshold raised
- Liveness and DeputyGuardian modules added
- Guardian (proxy)MS added

## Watched changes

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      values.GUARDIAN:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C) {
    +++ description: None
      values.guardian:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
    }
```

```diff
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03) {
    +++ description: None
      upgradeability.modules.0:
+        "0x0454092516c9A4d636d3CAfA1e82161376C8a748"
      upgradeability.threshold:
-        "4 of 13 (31%)"
+        "10 of 13 (77%)"
      values.getThreshold:
-        4
+        10
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GuardianMultisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0x5dC91D01290af474CE21DE14c17335a6dEe4d2a8)
    +++ description: None
```

## Source code changes

```diff
.../mode/ethereum/.flat/DeputyGuardianModule.sol   | 139 +++
 .../ethereum/.flat/GuardianMultisig/GnosisSafe.sol | 952 +++++++++++++++++++++
 .../.flat/GuardianMultisig/GnosisSafeProxy.p.sol   |  34 +
 .../mode/ethereum/.flat/LivenessGuard.sol          | 581 +++++++++++++
 .../mode/ethereum/.flat/LivenessModule.sol         | 257 ++++++
 5 files changed, 1963 insertions(+)
```

Generated with discovered.json: 0xfffebdaab376af03709f0a2eeacf05b0a7213d19

# Diff at Wed, 22 May 2024 20:10:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@bac4efad06804152ae97853892e122a801bbc509 block: 19918748
- current block number: 19927713

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

Generated with discovered.json: 0x6580fca91888426840cc3da6d0b9e9b39d214523

# Diff at Tue, 21 May 2024 14:02:35 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@c032520e456d0e6bee8b65e420ff7dba9f36bd48 block: 19711616
- current block number: 19918748

## Description

Name change.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19711616 (main branch discovery), not current.

```diff
    contract ProxyAdminOwner (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ProxyAdminOwner"
+        "ConduitMultisig"
    }
```

Generated with discovered.json: 0x8d82bf4a8f5996acda0e483af1b8e4b842e3256c

# Diff at Mon, 22 Apr 2024 14:44:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@d4b694a74243557c5ded556721185672f6639b7c block: 19582837
- current block number: 19711616

## Description

The project now uses shared implementations with other projects in the Superchain and a shared Guardian (OP Foundation).

## Watched changes

```diff
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    +++ description: None
      upgradeability.implementation:
-        "0x8b91Af069928bA6591c950354d1EA29e08192Bf8"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      implementations.0:
-        "0x8b91Af069928bA6591c950354d1EA29e08192Bf8"
+        "0xAE2AF01232a6c4a4d3012C5eC5b1b35059caF10d"
      values.version:
-        "1.1.2"
+        "2.1.0"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    +++ description: None
      upgradeability.implementation:
-        "0x6093023a4A7E6873EDFb02B4bCE48c53FD310EEc"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      implementations.0:
-        "0x6093023a4A7E6873EDFb02B4bCE48c53FD310EEc"
+        "0xF243BEd163251380e78068d317ae10f26042B292"
      values.version:
-        "1.3.1"
+        "1.8.0"
      values.challenger:
+        "0x309Fe2536d01867018D120b40e4676723C53A14C"
      values.finalizationPeriodSeconds:
+        604800
      values.l2BlockTime:
+        2
      values.proposer:
+        "0x674F64D64Ddc198db83cd9047dF54BF89cCD0ddB"
      values.submissionInterval:
+        1800
    }
```

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      upgradeability.implementation:
-        "0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      implementations.0:
-        "0x951754B08C52b2aC5d5a2aF1D52C2D12aED5Bcaf"
+        "0xba2492e52F45651B60B8B38d4Ea5E2390C64Ffb1"
      values.version:
-        "1.3.1"
+        "1.12.0"
      values.BATCH_INBOX_SLOT:
+        "0x71ac12829d66ee73d8d95bff50b3589745ce57edae70a3fb111a2342464dc597"
      values.batchInbox:
+        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
      values.L1_CROSS_DOMAIN_MESSENGER_SLOT:
+        "0x383f291819e6d54073bc9a648251d97421076bdd101933c0c022219ce9580636"
      values.L1_ERC_721_BRIDGE_SLOT:
+        "0x46adcbebc6be8ce551740c29c47c8798210f23f7f4086c41752944352568d5a7"
      values.L1_STANDARD_BRIDGE_SLOT:
+        "0x9904ba90dde5696cda05c9e0dab5cbaa0fea005ace4d11218a02ac668dad6376"
      values.l1CrossDomainMessenger:
+        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.l1ERC721Bridge:
+        "0x2901dA832a4D0297FF0691100A8E496626cc626D"
      values.l1StandardBridge:
+        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      values.L2_OUTPUT_ORACLE_SLOT:
+        "0xe52a667f71ec761b9b381c7b76ca9b852adf7e8905da0e0ad49986a0a6871815"
      values.l2OutputOracle:
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      values.OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT:
+        "0xa04c5bb938ca6fc46d95553abf0a76345ce3e722a30bf4f74928b8e7d852320c"
      values.OPTIMISM_PORTAL_SLOT:
+        "0x4b6c74f9e688cb39801f2112c14a8c57232a3fc5202e1444126d4bce86eb19ac"
      values.optimismMintableERC20Factory:
+        "0x69216395A62dFb243C05EF4F1C27AF8655096a95"
      values.optimismPortal:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.START_BLOCK_SLOT:
+        "0xa11ee3ab75b40e88a0105e935d17cd36c8faee0138320d776c411291bdbbb19f"
      values.startBlock:
+        18586931
    }
```

```diff
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    +++ description: None
      upgradeability.implementation:
-        "0x9c67ACcb38137CB761587032179b176c9276Eb5a"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      implementations.0:
-        "0x9c67ACcb38137CB761587032179b176c9276Eb5a"
+        "0x64B5a5Ed26DCb17370Ff4d33a8D503f0fbD06CfF"
      values.version:
-        "1.1.1"
+        "2.1.0"
      values.otherBridge:
+        "0x4200000000000000000000000000000000000010"
      values.paused:
+        false
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    +++ description: None
      upgradeability.implementation:
-        "0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      implementations.0:
-        "0xad3DC277d3242938F8Be18f0560e3d9B9988C46A"
+        "0x2D778797049FE9259d947D1ED8e5442226dFB589"
      values.GUARDIAN:
-        "0x309Fe2536d01867018D120b40e4676723C53A14C"
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.version:
-        "1.7.2"
+        "2.5.0"
      values.guardian:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      values.l2Oracle:
+        "0x4317ba146D4933D889518a3e5E11Fe7a53199b04"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      values.systemConfig:
+        "0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221"
    }
```

```diff
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    +++ description: None
      upgradeability.implementation:
-        "0x14DdD08c0e28764FC89a266eC95A93619b0EE835"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      implementations.0:
-        "0x14DdD08c0e28764FC89a266eC95A93619b0EE835"
+        "0xD3494713A5cfaD3F5359379DfA074E2Ac8C6Fd65"
      values.version:
-        "1.4.1"
+        "2.3.0"
      values.otherMessenger:
+        "0x4200000000000000000000000000000000000007"
      values.paused:
+        false
      values.portal:
+        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.superchainConfig:
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x69216395A62dFb243C05EF4F1C27AF8655096a95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_1 (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FoundationMultisig_2 (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SecurityCouncilMultisig (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../FoundationMultisig_1/implementation/meta.txt   |    2 +
 .../FoundationMultisig_1/proxy/GnosisSafeProxy.sol |  155 +++
 .../.code/FoundationMultisig_1/proxy/meta.txt      |    2 +
 .../implementation/GnosisSafe.sol                  | 1076 ++++++++++++++++++++
 .../FoundationMultisig_2/implementation/meta.txt   |    2 +
 .../.code/FoundationMultisig_2/proxy/Proxy.sol     |   41 +
 .../.code/FoundationMultisig_2/proxy/meta.txt      |    2 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../.code/GnosisSafe/implementation/meta.txt       |    2 +
 .../.code/GnosisSafe/proxy/GnosisSafeProxy.sol     |  155 +++
 .../mode/ethereum/.code/GnosisSafe/proxy/meta.txt  |    2 +
 .../L1/L1CrossDomainMessenger.sol => /dev/null     |   67 --
 .../contracts/L1/L2OutputOracle.sol => /dev/null   |  350 -------
 .../contracts/L1/OptimismPortal.sol => /dev/null   |  507 ---------
 .../contracts/L1/SystemConfig.sol => /dev/null     |  297 ------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Bytes.sol => /dev/null     |  142 ---
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../libraries/Predeploys.sol => /dev/null          |  112 --
 .../contracts/libraries/SafeCall.sol => /dev/null  |  160 ---
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../trie/SecureMerkleTrie.sol => /dev/null         |   64 --
 .../CrossDomainMessenger.sol => /dev/null          |  519 ----------
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/access/OwnableUpgradeable.sol       |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../contracts}/utils/ContextUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1CrossDomainMessenger/implementation/meta.txt |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../src/L1/L1CrossDomainMessenger.sol              |   74 ++
 .../implementation/src}/L1/L2OutputOracle.sol      |  193 ++--
 .../implementation/src}/L1/OptimismPortal.sol      |  252 +++--
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src}/libraries/Burn.sol         |    0
 .../implementation/src}/libraries/Bytes.sol        |   16 +-
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src}/libraries/Encoding.sol     |   98 +-
 .../implementation/src}/libraries/Hashing.sol      |   80 +-
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src}/libraries/SafeCall.sol     |   79 +-
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src}/libraries/Types.sol        |    0
 .../src}/libraries/rlp/RLPReader.sol               |  249 ++---
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src}/libraries/trie/MerkleTrie.sol             |  210 ++--
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src}/vendor/AddressAliasHelper.sol             |    0
 .../contracts/L1/L1ERC721Bridge.sol => /dev/null   |  107 --
 .../contracts/L2/L2ERC721Bridge.sol => /dev/null   |  126 ---
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../contracts/libraries/SafeCall.sol => /dev/null  |  104 --
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../CrossDomainMessenger.sol => /dev/null          |  483 ---------
 .../universal/ERC721Bridge.sol => /dev/null        |  214 ----
 .../IOptimismMintableERC721.sol => /dev/null       |   76 --
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |    0
 .../contracts/token/ERC20/IERC20.sol               |    0
 .../token/ERC20/extensions/IERC20Metadata.sol      |    0
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |    0
 .../contracts/token/ERC20/utils/SafeERC20.sol      |    0
 .../contracts/token/ERC721/IERC721.sol             |    0
 .../token/ERC721/extensions/IERC721Enumerable.sol  |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |    0
 .../utils/introspection/ERC165Checker.sol          |    0
 .../contracts/utils/introspection/IERC165.sol      |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1ERC721Bridge/implementation/meta.txt         |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L1ERC721Bridge.sol       |  121 +++
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L2/L2ERC721Bridge.sol       |  126 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../implementation/src/universal/ERC721Bridge.sol  |  195 ++++
 .../src}/universal/IOptimismMintableERC20.sol      |   21 +-
 .../src/universal/IOptimismMintableERC721.sol      |   48 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/StandardBridge.sol               |  489 +++++++++
 .../contracts/L1/L1StandardBridge.sol => /dev/null |  364 -------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/libraries/Constants.sol => /dev/null |   49 -
 .../contracts/libraries/Encoding.sol => /dev/null  |  162 ---
 .../contracts/libraries/Hashing.sol => /dev/null   |  172 ----
 .../libraries/Predeploys.sol => /dev/null          |  112 --
 .../contracts/libraries/SafeCall.sol => /dev/null  |  104 --
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../CrossDomainMessenger.sol => /dev/null          |  483 ---------
 .../OptimismMintableERC20.sol => /dev/null         |  149 ---
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../universal/StandardBridge.sol => /dev/null      |  561 ----------
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../token/ERC20/extensions/draft-IERC20Permit.sol  |   60 ++
 .../contracts/token/ERC20/utils/SafeERC20.sol      |  116 +++
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |   24 +
 .../utils/introspection/ERC165Checker.sol          |    0
 .../contracts/utils/introspection/IERC165.sol      |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L1StandardBridge/implementation/meta.txt       |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L1StandardBridge.sol     |  321 ++++++
 .../implementation/src}/L1/ResourceMetering.sol    |  124 +--
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/Predeploys.sol    |  113 ++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src/universal/CrossDomainMessenger.sol         |  406 ++++++++
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/StandardBridge.sol               |  489 +++++++++
 .../contracts/L1/L2OutputOracle.sol => /dev/null   |  350 -------
 .../contracts/libraries/Types.sol => /dev/null     |   84 --
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/math/Math.sol                  |    0
 .../contracts/utils/math/SignedMath.sol            |    0
 .../lib}/solmate/src/utils/FixedPointMathLib.sol   |    0
 .../L2OutputOracle/implementation/meta.txt         |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/L2OutputOracle.sol       |  317 ++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   68 ++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../libraries/resolver/Lib_AddressManager.sol      |   95 ++
 .../ethereum/.code/Lib_AddressManager/meta.txt     |    2 +
 .../contracts/proxy/utils/Initializable.sol        |    0
 .../contracts/token/ERC20/ERC20.sol                |  383 +++++++
 .../contracts/token/ERC20/IERC20.sol               |   82 ++
 .../token/ERC20/extensions/IERC20Metadata.sol      |   28 +
 .../contracts/utils/Address.sol                    |    0
 .../contracts/utils/Context.sol                    |   24 +
 .../contracts/utils/introspection/IERC165.sol      |   25 +
 .../implementation/meta.txt                        |    2 +
 .../src/universal/IOptimismMintableERC20.sol       |   31 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src/universal/OptimismMintableERC20.sol        |  140 +++
 .../src/universal/OptimismMintableERC20Factory.sol |  132 +++
 .../proxy/contracts/universal/Proxy.sol            |  217 ++++
 .../OptimismMintableERC20Factory/proxy/meta.txt    |    2 +
 .../contracts/L1/SystemConfig.sol => /dev/null     |  243 -----
 .../libraries/rlp/RLPWriter.sol => /dev/null       |  221 ----
 .../trie/SecureMerkleTrie.sol => /dev/null         |   64 --
 .../contracts/universal/Semver.sol => /dev/null    |   45 -
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../OptimismPortal/implementation/meta.txt         |    2 +-
 .../implementation/src/L1/L2OutputOracle.sol       |  317 ++++++
 .../implementation/src/L1/OptimismPortal.sol       |  433 ++++++++
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Bytes.sol         |  144 +++
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Encoding.sol      |  176 ++++
 .../implementation/src/libraries/Hashing.sol       |  124 +++
 .../implementation/src/libraries/SafeCall.sol      |  142 +++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/libraries/Types.sol         |   70 ++
 .../src}/libraries/rlp/RLPReader.sol               |  249 ++---
 .../implementation/src/libraries/rlp/RLPWriter.sol |  163 +++
 .../src}/libraries/trie/MerkleTrie.sol             |  210 ++--
 .../src/libraries/trie/SecureMerkleTrie.sol        |   49 +
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../src}/vendor/AddressAliasHelper.sol             |    0
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../implementation/meta.txt                        |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 +++
 .../.code/SecurityCouncilMultisig/proxy/meta.txt   |    2 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../.code/SuperchainConfig/implementation/meta.txt |    2 +
 .../implementation/src/L1/SuperchainConfig.sol     |   94 ++
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../ethereum/.code/SuperchainConfig/proxy/meta.txt |    2 +
 .../proxy/src}/L1/ResourceMetering.sol             |   14 +-
 .../proxy/src}/libraries/Arithmetic.sol            |   16 +-
 .../SuperchainConfig/proxy/src/libraries/Burn.sol  |   32 +
 .../proxy/src}/libraries/Constants.sol             |   15 +-
 .../SuperchainConfig/proxy/src/universal/Proxy.sol |  168 +++
 .../contracts/legacy/AddressManager.sol            |   64 ++
 .../contracts/legacy/L1ChugSplashProxy.sol         |  289 ++++++
 .../contracts/universal/Proxy.sol                  |  217 ++++
 .../contracts/universal/ProxyAdmin.sol             |  254 +++++
 .../ethereum/.code/SuperchainProxyAdmin/meta.txt   |    2 +
 .../@openzeppelin/contracts/access/Ownable.sol     |   83 ++
 .../@openzeppelin/contracts/utils/Context.sol      |   24 +
 .../implementation/contracts/GnosisSafe.sol        |  422 ++++++++
 .../implementation/contracts/base/Executor.sol     |   27 +
 .../contracts/base/FallbackManager.sol             |   53 +
 .../implementation/contracts/base/GuardManager.sol |   50 +
 .../contracts/base/ModuleManager.sol               |  133 +++
 .../implementation/contracts/base/OwnerManager.sol |  149 +++
 .../implementation/contracts/common/Enum.sol       |    8 +
 .../contracts/common/EtherPaymentFallback.sol      |   13 +
 .../contracts/common/SecuredTokenTransfer.sol      |   35 +
 .../contracts/common/SelfAuthorized.sol            |   16 +
 .../contracts/common/SignatureDecoder.sol          |   36 +
 .../implementation/contracts/common/Singleton.sol  |   11 +
 .../contracts/common/StorageAccessible.sol         |   47 +
 .../contracts/external/GnosisSafeMath.sol          |   54 +
 .../contracts/interfaces/ISignatureValidator.sol   |   20 +
 .../implementation/meta.txt                        |    2 +
 .../proxy/GnosisSafeProxy.sol                      |  155 +++
 .../.code/SuperchainProxyAdminOwner/proxy/meta.txt |    2 +
 .../contracts/L1/ResourceMetering.sol => /dev/null |  186 ----
 .../contracts/L1/SystemConfig.sol => /dev/null     |  297 ------
 .../libraries/Arithmetic.sol => /dev/null          |   48 -
 .../contracts/libraries/Burn.sol => /dev/null      |   42 -
 .../contracts/universal/Semver.sol => /dev/null    |   58 --
 .../contracts/proxy/utils/Initializable.sol        |  138 +++
 .../contracts/utils/Address.sol                    |  222 ++++
 .../contracts/utils/math/Math.sol                  |  226 ++++
 .../contracts/utils/math/SignedMath.sol            |   43 +
 .../contracts}/access/OwnableUpgradeable.sol       |    0
 .../contracts}/proxy/utils/Initializable.sol       |    0
 .../contracts}/utils/AddressUpgradeable.sol        |    0
 .../contracts}/utils/ContextUpgradeable.sol        |    0
 .../lib/solmate/src/utils/FixedPointMathLib.sol    |  366 +++++++
 .../SystemConfig/implementation/meta.txt           |    2 +-
 .../contracts/utils/Strings.sol => /dev/null       |   75 --
 .../implementation/src/L1/ResourceMetering.sol     |  162 +++
 .../implementation/src/L1/SystemConfig.sol         |  367 +++++++
 .../implementation/src/libraries/Arithmetic.sol    |   28 +
 .../implementation/src/libraries/Burn.sol          |   32 +
 .../implementation/src/libraries/Constants.sol     |   46 +
 .../implementation/src/libraries/Storage.sol       |   88 ++
 .../implementation/src/universal/ISemver.sol       |   13 +
 338 files changed, 22927 insertions(+), 10993 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19582837 (main branch discovery), not current.

```diff
    contract ModeMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ModeMultisig"
+        "ProxyAdminOwner"
    }
```

Generated with discovered.json: 0x6f45a1009c898f828353ee2a8c6fb0af9ef7ed51

# Diff at Thu, 28 Mar 2024 10:23:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@dd32bb06b292cc8459fb09925454ee3a90f5c27e block: 19439842
- current block number: 19531989

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19439842 (main branch discovery), not current.

```diff
    contract ChallengerMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 6 (67%)"
    }
```

```diff
    contract ModeMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x1d22da0722e3ba859e81dc7e25fcc8b23f10048a

# Diff at Thu, 14 Mar 2024 07:33:30 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- comparing to: main@c79c75cb88d41e2f05e9cca5d501133eae405bbe block: 19411974
- current block number: 19431787

## Description

Blobs are switched on.

## Watched changes

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
-        false
+        true
      values.overhead:
-        188
+        0
      values.scalar:
-        684000
+        "452312848583266388373324160190187140051835877600158453279133701594312344529"
    }
```

Generated with discovered.json: 0x7583f54e5c6195c95832243781e1837e45e36883

# Diff at Mon, 11 Mar 2024 12:53:12 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19176961
- current block number: 19411974

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19176961 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0xcc53221fa9d617cfac43ac7d0e03cc50a5345f8c

# Diff at Wed, 07 Feb 2024 14:38:56 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@2e35800e01005d93332a552032058dcd67f3631d block: 19175200
- current block number: 19176961

## Description

Added opStackSequencerInbox handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19175200 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
      values.sequencerInbox:
+        "0x24E59d9d3Bd73ccC28Dc54062AF7EF7bFF58Bd67"
    }
```

Generated with discovered.json: 0x90d5136a81557b8fc210bdfc11441aa43010487b

# Diff at Wed, 07 Feb 2024 08:43:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@64f1e0f27f831d3ef860a1c2faad8c77e04e6c29 block: 19113377
- current block number: 19175200

## Description

Updated with the new OpDAHandler to remove the field.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19113377 (main branch discovery), not current.

```diff
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
      values.opStackDA.isAllTxsLengthEqualToCelestiaDAExample:
-        false
    }
```

Generated with discovered.json: 0x8c8447d97aa00a6dffbf43381ebbea74a47cfdbd

# Diff at Mon, 29 Jan 2024 16:29:36 GMT:

- author: Radina Talanova (<radinatalanova@Radinas-MacBook-Air.local>)
- current block number: 19113377

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x2901dA832a4D0297FF0691100A8E496626cc626D) {
    }
```

```diff
+   Status: CREATED
    contract ChallengerMultisig (0x309Fe2536d01867018D120b40e4676723C53A14C) {
    }
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x4317ba146D4933D889518a3e5E11Fe7a53199b04) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x470d87b1dae09a454A43D1fD772A561a03276aB7) {
    }
```

```diff
+   Status: CREATED
    contract ModeMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0x50eF494573f28Cad6B64C31b7a00Cdaa48306e15) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x5e6432F18Bc5d497B1Ab2288a025Fbf9D69E2221) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x735aDBbE72226BD52e818E7181953f42E3b0FF21) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f) {
    }
```
