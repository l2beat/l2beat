Generated with discovered.json: 0xd417633abd4295cd36ba02f5e5cd44acb1b9dacc

# Diff at Wed, 09 Oct 2024 13:10:51 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0xe235dde67cc2003b870c23ebbff46367f1a89dd7

# Diff at Tue, 01 Oct 2024 11:11:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x15567C4FfD9109795dFf1D9A5233D10aef0738D2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-06-17T17:27:11.000Z",["0x76A8Eb93D4a200e8594B1ab1021ab5595CDfB57D"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-06-17T17:27:35.000Z",["0x0092400cf9cbAC5ABD8518960Cb1F90663607630"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-06-17T17:25:59.000Z",["0x621729Ef0571a76E438689ec2bC88ee8E3f2Beff"]]]
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-06-17T17:25:23.000Z",["0x7CDAEa613E1D17e78F24CAF6349bCCf2bC364F0a"]]]
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-06-17T17:21:11.000Z",["0x704Ad7cb61f3Ff97F790FAA747279244Eb2a1802"]]]
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-06-17T17:27:59.000Z",["0x1606beCd26316B935B2dFE31D57C1C0B39f4f52f"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-06-17T17:26:11.000Z",["0x351ABA1B5B72E6bA8d530740f073993069e7BC69"]]]
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0xb0c05338b72b123d80d6c8f5c8076364e2613f91

# Diff at Sun, 08 Sep 2024 17:24:48 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0:
+        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0:
+        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.1.via.0:
+        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0:
+        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xed7525946A09056C6AaE29941b8323017382050e","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xE9614162C6128ABD7790C65D711CfC43ea842153","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xadE916De67511E5C24af4174Be67143d0dA94959","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x504D56cf68f791B45E3A2e895B0e1562f3431328","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x1c22740A0B4511E11D76434A424487862b593901","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]}
      receivedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"
      receivedPermissions.0.via:
+        [{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"}]
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0:
+        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0:
+        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x6197f64902b9275e6815F9A5b641Ed2291A5d39c","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"},{"permission":"upgrade","target":"0x1c22740A0B4511E11D76434A424487862b593901"},{"permission":"upgrade","target":"0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"},{"permission":"upgrade","target":"0x504D56cf68f791B45E3A2e895B0e1562f3431328"},{"permission":"upgrade","target":"0xadE916De67511E5C24af4174Be67143d0dA94959"},{"permission":"upgrade","target":"0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"},{"permission":"upgrade","target":"0xE9614162C6128ABD7790C65D711CfC43ea842153"},{"permission":"upgrade","target":"0xed7525946A09056C6AaE29941b8323017382050e"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"},{"permission":"upgrade","target":"0x1c22740A0B4511E11D76434A424487862b593901"},{"permission":"upgrade","target":"0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"},{"permission":"upgrade","target":"0x504D56cf68f791B45E3A2e895B0e1562f3431328"},{"permission":"upgrade","target":"0xadE916De67511E5C24af4174Be67143d0dA94959"},{"permission":"upgrade","target":"0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"},{"permission":"upgrade","target":"0xE9614162C6128ABD7790C65D711CfC43ea842153"},{"permission":"upgrade","target":"0xed7525946A09056C6AaE29941b8323017382050e","description":"upgrading bridge implementation allows to access all funds and change every system component."}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0:
+        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0:
+        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

Generated with discovered.json: 0xd776d514f393450a4645aac3d54682b8b4e7ec82

# Diff at Fri, 30 Aug 2024 08:01:16 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: It can act on behalf of 0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
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

Generated with discovered.json: 0x979a8fa269fbc00bf4e76f8922d5b92d7d241225

# Diff at Fri, 23 Aug 2024 09:55:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x7eabbee3e2262c9a7eb319c9f02229cee0e54646

# Diff at Wed, 21 Aug 2024 10:06:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248","via":[]},{"permission":"upgrade","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

```diff
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: It can act on behalf of 0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32","0x1c22740A0B4511E11D76434A424487862b593901","0x504D56cf68f791B45E3A2e895B0e1562f3431328","0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15","0xE9614162C6128ABD7790C65D711CfC43ea842153","0xadE916De67511E5C24af4174Be67143d0dA94959","0xed7525946A09056C6AaE29941b8323017382050e"],"configure":["0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x6197f64902b9275e6815F9A5b641Ed2291A5d39c","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f","via":[]},{"permission":"upgrade","target":"0x1c22740A0B4511E11D76434A424487862b593901","via":[]},{"permission":"upgrade","target":"0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32","via":[]},{"permission":"upgrade","target":"0x504D56cf68f791B45E3A2e895B0e1562f3431328","via":[]},{"permission":"upgrade","target":"0xadE916De67511E5C24af4174Be67143d0dA94959","via":[]},{"permission":"upgrade","target":"0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15","via":[]},{"permission":"upgrade","target":"0xE9614162C6128ABD7790C65D711CfC43ea842153","via":[]},{"permission":"upgrade","target":"0xed7525946A09056C6AaE29941b8323017382050e","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","via":[]}]
    }
```

Generated with discovered.json: 0xe26a257bdc80ed122817ce74bd4b69db9558e47f

# Diff at Fri, 09 Aug 2024 12:02:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.6:
-        "0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"
+        "0xed7525946A09056C6AaE29941b8323017382050e"
      assignedPermissions.upgrade.5:
-        "0xE9614162C6128ABD7790C65D711CfC43ea842153"
+        "0xadE916De67511E5C24af4174Be67143d0dA94959"
      assignedPermissions.upgrade.4:
-        "0x504D56cf68f791B45E3A2e895B0e1562f3431328"
+        "0xE9614162C6128ABD7790C65D711CfC43ea842153"
      assignedPermissions.upgrade.3:
-        "0x1c22740A0B4511E11D76434A424487862b593901"
+        "0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"
      assignedPermissions.upgrade.2:
-        "0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"
+        "0x504D56cf68f791B45E3A2e895B0e1562f3431328"
      assignedPermissions.upgrade.1:
-        "0xadE916De67511E5C24af4174Be67143d0dA94959"
+        "0x1c22740A0B4511E11D76434A424487862b593901"
      assignedPermissions.upgrade.0:
-        "0xed7525946A09056C6AaE29941b8323017382050e"
+        "0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"
    }
```

Generated with discovered.json: 0x6ee73074136afb6ff4b8a13016b67ee042cddfba

# Diff at Fri, 09 Aug 2024 10:12:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: It can act on behalf of 0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"]
      assignedPermissions.configure:
+        ["0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0xB12bd496383288A3c7916AEF8e40197d61e07815","0x2c1877cDFa3649122CC0F41423A2a185217a2E23","0x04E1b8f517aF7dcD75a95B46DAdCc2c6f486502D","0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xB12bd496383288A3c7916AEF8e40197d61e07815","0x2c1877cDFa3649122CC0F41423A2a185217a2E23","0x04E1b8f517aF7dcD75a95B46DAdCc2c6f486502D","0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32","0x1c22740A0B4511E11D76434A424487862b593901","0x504D56cf68f791B45E3A2e895B0e1562f3431328","0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15","0xE9614162C6128ABD7790C65D711CfC43ea842153","0xadE916De67511E5C24af4174Be67143d0dA94959","0xed7525946A09056C6AaE29941b8323017382050e"]
      assignedPermissions.owner:
-        ["0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"]
      assignedPermissions.upgrade:
+        ["0xed7525946A09056C6AaE29941b8323017382050e","0xadE916De67511E5C24af4174Be67143d0dA94959","0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15","0x1c22740A0B4511E11D76434A424487862b593901","0x504D56cf68f791B45E3A2e895B0e1562f3431328","0xE9614162C6128ABD7790C65D711CfC43ea842153","0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"]
      assignedPermissions.configure:
+        ["0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"]
    }
```

Generated with discovered.json: 0x20eea9b84c2fbfdd528502ba2b41d9e13a9bff6d

# Diff at Tue, 30 Jul 2024 11:16:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x384ba11ab649558fc75508b449408c264f12d147

# Diff at Mon, 29 Jul 2024 15:11:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20413034

## Description

Initial discovery: OP stack rollup with non-onboarded SuperchainConfig.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x15567C4FfD9109795dFf1D9A5233D10aef0738D2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e)
    +++ description: None
```
