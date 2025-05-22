Generated with discovered.json: 0x9338cdc37db14d89fad80615383b8a9a7e085241

# Diff at Fri, 09 May 2025 10:09:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a1d49c07f4092914d62c65181e5fec18a88318 block: 22437741
- current block number: 22437741

## Description

Config related: Move IFs to the editable string for condition configs (yeet IFs from the automatic resolver).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22437741 (main branch discovery), not current.

```diff
    EOA Optimism EOA 1 (0x352f1defB49718e7Ea411687E850aA8d6299F7aC) {
    +++ description: None
      receivedPermissions.2.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      receivedPermissions.1.via.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
      receivedPermissions.0.via.3.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      receivedPermissions.0.via.1.address:
-        "0x126a736B18E0a64fBA19D421647A530E327E112C"
+        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
      receivedPermissions.0.via.1.condition:
-        "restricted to the global pause function"
      receivedPermissions.0.via.0.address:
-        "0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.0.via.0.condition:
+        "though restricted to the global pause function"
      directlyReceivedPermissions.0.condition:
-        "restricted to the global pause function"
+        "though restricted to the global pause function"
    }
```

```diff
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92) {
    +++ description: None
      receivedPermissions.0.via.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
      directlyReceivedPermissions.0.condition:
-        "the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
+        "if the number of 0xc2819DC788505Aac350142A7A707BF9D03E3Bd03 members falls below 8."
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.0.via.1.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
      directlyReceivedPermissions.0.condition:
-        "not revoked by the Security Council"
+        "if not revoked by the Security Council"
    }
```

Generated with discovered.json: 0x8364d97f09dbc7bc00cd89f43f269c890b1ddc3f

# Diff at Thu, 08 May 2025 08:50:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8e1926142ab0c57cc131de4d8da307e13d9af54d block: 22244001
- current block number: 22437741

## Description

superchain guardian connected, but not full superchain gov.

OP stack DeputyPauser upgrade (see op mainnet for more info).

## Watched changes

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      values.getModules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      values.GnosisSafe_modules.0:
+        "0x126a736B18E0a64fBA19D421647A530E327E112C"
      receivedPermissions.2:
+        {"permission":"guard","from":"0x11654D67e0360A82e5Badd272Ced336B80972135"}
      receivedPermissions.1.from:
-        "0x11654D67e0360A82e5Badd272Ced336B80972135"
+        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
      receivedPermissions.0.from:
-        "0x384e3AE4D5efC9471201039b555EAe496b2A7240"
+        "0x95703e0982140D16f8ebA6d158FccEde42f04a4C"
      receivedPermissions.0.via:
+        [{"address":"0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2"},{"address":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B","condition":"not revoked by the Security Council"}]
    }
```

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyPauseModule (0x126a736B18E0a64fBA19D421647A530E327E112C)
    +++ description: Allows 0x352f1defB49718e7Ea411687E850aA8d6299F7aC, called the deputy pauser, to act on behalf of the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A if set as its Safe module.
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
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

## Source code changes

```diff
...0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5.sol} |    0
 ...-0xdE1FCfB0851916CA5101820A69b13a4E276bd81F.sol |  152 +++
 .../ethereum/.flat/DeputyGuardianModule.sol        |  156 +++
 .../ethereum/.flat/DeputyPauseModule.sol           | 1338 ++++++++++++++++++++
 .../ethereum/.flat/LivenessModule.sol              |  258 ++++
 .../.flat/OpFoundationUpgradeSafe/GnosisSafe.sol   |  953 ++++++++++++++
 .../OpFoundationUpgradeSafe/GnosisSafeProxy.p.sol  |   35 +
 .../Optimism Guardian Multisig/GnosisSafe.sol      |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../.flat/Optimism Security Council/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../Proxy.p.sol                                    |    0
 .../SuperchainConfig.sol                           |    0
 .../Proxy.p.sol                                    |  200 +++
 .../SuperchainConfig.sol                           |  477 +++++++
 .../ethereum/.flat/SuperchainProxyAdmin.sol        |  298 +++++
 .../.flat/SuperchainProxyAdminOwner/GnosisSafe.sol |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 18 files changed, 6831 insertions(+)
```

Generated with discovered.json: 0xb90df94d2efca2ffe0e9b3c7dddd173ac6cf9e76

# Diff at Tue, 29 Apr 2025 08:19:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22244001
- current block number: 22244001

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22244001 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x5c89b56bead2f99d41721f1D15442Fe813879587","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x320E53df19662A58fF4953d62B229E9BCAAC0b49"}]}]
    }
```

Generated with discovered.json: 0xa1f850efa1c8afa86d1d1fff5b5fc9a62be49e35

# Diff at Fri, 11 Apr 2025 06:47:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a946e9842245b891a11dfd66e5a103281bde27da block: 22046072
- current block number: 22244001

## Description

storageSetter upgrade for changing the challenge period (1d).

## Watched changes

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.2:
+        ["2025-04-09T18:39:47.000Z","0x6a3c741de4a66f9e4f6ab204507d0d1e6c6c0e8ec2ca63bb03ad6c57e8e5d373",["0xd81f43eDBCAcb4c29a9bA38a13Ee5d79278270cC"]]
      values.$pastUpgrades.1:
+        ["2025-04-09T18:39:47.000Z","0x6a3c741de4a66f9e4f6ab204507d0d1e6c6c0e8ec2ca63bb03ad6c57e8e5d373",["0x1Fd1be2e1c65F136020d2CcC073ED8A7269aE53f"]]
      values.$upgradeCount:
-        1
+        3
+++ description: Challenge period (Number of seconds until a state root is finalized).
      values.FINALIZATION_PERIOD_SECONDS:
-        604800
+        86400
      values.finalizationPeriodSeconds:
-        604800
+        86400
    }
```

Generated with discovered.json: 0x3cc31776ff2f7ea42a8f5bdbac490b0ad6b0c065

# Diff at Thu, 27 Mar 2025 11:14:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 22046072
- current block number: 22046072

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046072 (main branch discovery), not current.

```diff
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0xd930fc9221f4bd1e8e89d1082adf8c2ed4931013

# Diff at Wed, 19 Mar 2025 13:05:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 22046072
- current block number: 22046072

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046072 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x919B2511b2DB24Cc0C0EebE28b62a4E591579C1B) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x6ebedc309d2143462ff2c40d745e6c9e8b3fd68f

# Diff at Tue, 18 Mar 2025 08:13:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 22046072
- current block number: 22046072

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22046072 (main branch discovery), not current.

```diff
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      name:
-        "ConduitMultisig"
+        "Conduit Multisig 1"
    }
```

Generated with discovered.json: 0x8285fe5f90a90d7d2236e5cb364a2e88043d6955

# Diff at Fri, 14 Mar 2025 15:41:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@002bac09dea3b1154ecc36736323fb7552478ce4 block: 21894981
- current block number: 22046072

## Description

Conduit MS changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.9:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.8:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.7:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.6:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.5:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.4:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.3:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.2:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.1:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.0:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xcba398ba072c0c68a565eacd78b667153fd85ddb

# Diff at Tue, 04 Mar 2025 11:26:08 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21894981
- current block number: 21894981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x6870cc88fdec3d9f181a85247370469ffff9f0c8

# Diff at Tue, 04 Mar 2025 10:39:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21894981
- current block number: 21894981

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21314015
    }
```

```diff
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49) {
    +++ description: None
      sinceBlock:
+        21314014
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21314015
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        21314015
    }
```

```diff
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21314015
    }
```

```diff
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64) {
    +++ description: None
      sinceBlock:
+        16780617
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21314015
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      sinceBlock:
+        11670007
    }
```

```diff
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21314017
    }
```

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        21314017
    }
```

```diff
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21314014
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21314015
    }
```

Generated with discovered.json: 0x2b73f94e639cf264857a0b01aa5b427a2c5aea2c

# Diff at Wed, 26 Feb 2025 10:32:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21894981
- current block number: 21894981

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21894981 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x43a781fae05bc530d11a404544d31bc8d3d6825e

# Diff at Fri, 21 Feb 2025 19:02:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21894981

## Description

First discovery. OpStack using Celestia for DA. DisputeGameFactory and related contracts are deployed but not used.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x11654D67e0360A82e5Badd272Ced336B80972135)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x320E53df19662A58fF4953d62B229E9BCAAC0b49)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x34Ef4B527DB3F4AcfAE7Fdc7Db0f9981F48Cd23F)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x384e3AE4D5efC9471201039b555EAe496b2A7240)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x3D831FD51f80398488a2452b9Ba44eDe104e8789)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6007758DBd8c9e83e24761D248e51850Ff2612CC)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x9dd8e00Ff731FBf3dd3559578BeB518a41b16Cfe)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xb9c4EA7171b588e8D4c3F63e955Cd61e5172bb92)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract AddressManager (0xC3BcdF5cb9AEA2cc4938C9D1AA866CF0BA6B19b5)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xF41E72f55d9bE849ecCe3b7AEe2A07Ccdadb655d)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```
