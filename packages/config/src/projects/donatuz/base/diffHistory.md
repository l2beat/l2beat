Generated with discovered.json: 0xe850d25bb50bb582c7c34c7a0ddb2198ec83f0c3

# Diff at Tue, 29 Apr 2025 08:19:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 27754690
- current block number: 27754690

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 27754690 (main branch discovery), not current.

```diff
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","description":"set and change address mappings.","via":[{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]}]
    }
```

```diff
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[]},{"permission":"propose","to":"0xfB04981fa938f03b82B4Ca8F5B1FAAA1A547306B","via":[]},{"permission":"upgrade","to":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]}]
    }
```

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x9C5657Fd52b200b3fE7652ADF20659ec071DD8b0","via":[]},{"permission":"upgrade","to":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]}]
    }
```

```diff
    contract OptimismPortal (0xb765Df9d2925a82678F4B7bc60eF5294c1604514) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[]},{"permission":"upgrade","to":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","via":[{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]}]
    }
```

```diff
    contract L1StandardBridge (0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]}]
    }
```

Generated with discovered.json: 0x76577971578e9e373406d33dab4b530a4d40f77a

# Diff at Thu, 27 Mar 2025 11:16:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 27754690
- current block number: 27754690

## Description

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 27754690 (main branch discovery), not current.

```diff
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x2f90e46249770e85d2893e5faae4700c562c2222

# Diff at Tue, 18 Mar 2025 11:52:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8a389387016e20fe96cd5cb775e4b943b3aaa832 block: 25215421
- current block number: 27754690

## Description

Conduit MS signer change.

## Watched changes

```diff
    contract Conduit Multisig 3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      values.$members.8:
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.7:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.6:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.5:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.4:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.3:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.$members.1:
-        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.0:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0x860e06Fe384D1A3340111e7D142E02642178c053"
      values.$threshold:
-        3
+        4
      values.multisigThreshold:
-        "3 of 8 (38%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x8b316ef87a5bac9bac8d2beb10cff7f26d77b32a

# Diff at Tue, 18 Mar 2025 08:15:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4ef7a8dbcec1cd9fec77aae2b73d81347a4ffb13 block: 25215421
- current block number: 25215421

## Description

Config: change Multisig names.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract Conduit Multisig 3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      name:
-        "ConduitMultisig3"
+        "Conduit Multisig 3"
    }
```

Generated with discovered.json: 0xa68c83775b62b6fe82f8cf9f53783ac2ac5edae1

# Diff at Tue, 04 Mar 2025 11:27:12 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 25215421
- current block number: 25215421

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x9a5798cbfc966046ac64a5561f3631196556b049

# Diff at Tue, 04 Mar 2025 10:40:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 25215421
- current block number: 25215421

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x4A2b7478B9646c06C3517E6f06e1232684143C00) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        16265097
    }
```

```diff
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        16265096
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      sinceBlock:
+        10917529
    }
```

```diff
    contract ProxyAdmin (0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15) {
    +++ description: None
      sinceBlock:
+        16265097
    }
```

```diff
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        16265097
    }
```

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        16265097
    }
```

```diff
    contract OptimismPortal (0xb765Df9d2925a82678F4B7bc60eF5294c1604514) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        16265097
    }
```

```diff
    contract L1StandardBridge (0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        16265097
    }
```

Generated with discovered.json: 0x0bfca3ddcfbc51012f5e7d801591f845096663bd

# Diff at Wed, 26 Feb 2025 10:33:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 25215421
- current block number: 25215421

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x4A2b7478B9646c06C3517E6f06e1232684143C00) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0xb765Df9d2925a82678F4B7bc60eF5294c1604514) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x149b62fe64b5d4a275e87d05da5232c97f770028

# Diff at Fri, 21 Feb 2025 14:13:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 25215421
- current block number: 25215421

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x863927bf0a6929672a9bfa34cbb56cf0a3c3577e

# Diff at Fri, 21 Feb 2025 09:00:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 25215421
- current block number: 25215421

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x4A2b7478B9646c06C3517E6f06e1232684143C00) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x5aba87cb756d040154a89d7aca544052ab57686e

# Diff at Mon, 10 Feb 2025 19:05:22 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 25215421
- current block number: 25215421

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        true
    }
```

Generated with discovered.json: 0x1b9ec7685636b9b11ecacc48d76e97b517fe2dfd

# Diff at Tue, 04 Feb 2025 12:34:00 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 25215421
- current block number: 25215421

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
+        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
+        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.2.via:
+        [{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
+        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.via:
-        [{"address":"0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"}]
    }
```

```diff
    contract ProxyAdmin (0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xbd20c81d1e26eac4a9aabd37f48d2932920f4987

# Diff at Mon, 20 Jan 2025 11:10:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 25215421
- current block number: 25215421

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 25215421 (main branch discovery), not current.

```diff
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B"
      receivedPermissions.7.from:
+        "0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B"
      receivedPermissions.6.target:
-        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.6.from:
+        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.5.target:
-        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.5.from:
+        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.4.target:
-        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      receivedPermissions.4.from:
+        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      receivedPermissions.3.target:
-        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.3.from:
+        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      receivedPermissions.2.target:
-        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.2.from:
+        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      receivedPermissions.1.target:
-        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
      receivedPermissions.1.from:
+        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
      receivedPermissions.0.target:
-        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      receivedPermissions.0.from:
+        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      directlyReceivedPermissions.0.target:
-        "0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"
      directlyReceivedPermissions.0.from:
+        "0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15"
    }
```

```diff
    contract ProxyAdmin (0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B"
      directlyReceivedPermissions.4.from:
+        "0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B"
      directlyReceivedPermissions.3.target:
-        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      directlyReceivedPermissions.3.from:
+        "0xb765Df9d2925a82678F4B7bc60eF5294c1604514"
      directlyReceivedPermissions.2.target:
-        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      directlyReceivedPermissions.2.from:
+        "0xa096dD38362bd2cE3C696474329989960722A7Fd"
      directlyReceivedPermissions.1.target:
-        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      directlyReceivedPermissions.1.from:
+        "0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2"
      directlyReceivedPermissions.0.target:
-        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
      directlyReceivedPermissions.0.from:
+        "0x5416B7421c42B9218B29f688C47a46020c23cF0d"
    }
```

```diff
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.1.target:
-        "0xfB04981fa938f03b82B4Ca8F5B1FAAA1A547306B"
      issuedPermissions.1.to:
+        "0xfB04981fa938f03b82B4Ca8F5B1FAAA1A547306B"
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
    }
```

```diff
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.1.target:
-        "0x9C5657Fd52b200b3fE7652ADF20659ec071DD8b0"
      issuedPermissions.1.to:
+        "0x9C5657Fd52b200b3fE7652ADF20659ec071DD8b0"
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismPortal (0xb765Df9d2925a82678F4B7bc60eF5294c1604514) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
    }
```

```diff
    contract L1StandardBridge (0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xbc3b082bb8d644921e00d9f00e443b733a78955e

# Diff at Sat, 18 Jan 2025 17:10:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 25215421

## Description

Initial discovery run: Standard opstack L3 Optimium on Base with 100% known shapes, practically no canonical TVL. The data commitments are correctly encoded for alt-DA mode with EigenDA (0x00 id byte) as target.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x4A2b7478B9646c06C3517E6f06e1232684143C00)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract AddressManager (0x5416B7421c42B9218B29f688C47a46020c23cF0d)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract ConduitMultisig3 (0x7dCe2FEE5e30EFf298cD3d9B92649f00EBDfc104)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x85519ecD4E4c59E62B68dB2082dB1F5c75da1E15)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x88dBaaeCDa265241a1BABe4A0ce69ad4957da8a2)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xa096dD38362bd2cE3C696474329989960722A7Fd)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xb765Df9d2925a82678F4B7bc60eF5294c1604514)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xBbea8Cc549702F67cc082d2cAA9842Ba3767536B)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```
