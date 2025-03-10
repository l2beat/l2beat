Generated with discovered.json: 0xdb0e75164b24fa829fa79362662e5c6403b50500

# Diff at Tue, 04 Mar 2025 11:27:15 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 26809248
- current block number: 26809248

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26809248 (main branch discovery), not current.

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xa9a6ed3f65de3d86aa4d602b1e8510fd698f5d4d

# Diff at Tue, 04 Mar 2025 10:40:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 26809248
- current block number: 26809248

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26809248 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        10289994
    }
```

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        10289984
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        10289980
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      sinceBlock:
+        14896961
    }
```

```diff
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        10289970
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        10289987
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      sinceBlock:
+        10289974
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        10289990
    }
```

Generated with discovered.json: 0x77bbd3a5fe1dfa4c90507a6c378fce13e7fca9a7

# Diff at Wed, 26 Feb 2025 10:33:27 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 26809248
- current block number: 26809248

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 26809248 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x62f8540a6f3231f5221543f381f0661e9e3fe6c6

# Diff at Fri, 21 Feb 2025 14:13:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 22580417
- current block number: 22580417

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580417 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xc4825f306d84fc783d2a4314181288263d97abc3

# Diff at Fri, 21 Feb 2025 09:00:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 22580417
- current block number: 22580417

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580417 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xbb945b86f5bd8f659d3f5e076e453a653b38f3ff

# Diff at Mon, 10 Feb 2025 19:05:25 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 22580417
- current block number: 22580417

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580417 (main branch discovery), not current.

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x06f781af92e35882c8e51097f1d506c46fc2a024

# Diff at Tue, 04 Feb 2025 12:34:02 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 22580417
- current block number: 22580417

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580417 (main branch discovery), not current.

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x4b4eaa5af11e1ff897289d9567ccd33ba2962cfe

# Diff at Mon, 20 Jan 2025 11:10:40 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 22580417
- current block number: 22580417

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580417 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.1.target:
-        "0xADE1F8C181934052fD1958F06B63Ef0D875803C5"
      issuedPermissions.1.to:
+        "0xADE1F8C181934052fD1958F06B63Ef0D875803C5"
      issuedPermissions.0.target:
-        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
      issuedPermissions.0.to:
+        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.target:
-        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
      issuedPermissions.0.to:
+        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.4.target:
-        "0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"
      receivedPermissions.4.from:
+        "0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"
      receivedPermissions.3.target:
-        "0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"
      receivedPermissions.3.from:
+        "0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"
      receivedPermissions.2.target:
-        "0x52fA397D799f1CE416a2089B964Aa293c347994F"
      receivedPermissions.2.from:
+        "0x52fA397D799f1CE416a2089B964Aa293c347994F"
      receivedPermissions.1.target:
-        "0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"
      receivedPermissions.1.from:
+        "0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"
      receivedPermissions.0.target:
-        "0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"
      receivedPermissions.0.from:
+        "0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"
      directlyReceivedPermissions.0.target:
-        "0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"
      directlyReceivedPermissions.0.from:
+        "0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"
    }
```

```diff
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.1.target:
-        "0x63d02F40A14c54283D5Dc3451d3Ed4DC134833e5"
      issuedPermissions.1.to:
+        "0x63d02F40A14c54283D5Dc3451d3Ed4DC134833e5"
      issuedPermissions.0.target:
-        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
      issuedPermissions.0.to:
+        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      directlyReceivedPermissions.4.target:
-        "0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"
      directlyReceivedPermissions.4.from:
+        "0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"
      directlyReceivedPermissions.3.target:
-        "0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"
      directlyReceivedPermissions.3.from:
+        "0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"
      directlyReceivedPermissions.2.target:
-        "0x52fA397D799f1CE416a2089B964Aa293c347994F"
      directlyReceivedPermissions.2.from:
+        "0x52fA397D799f1CE416a2089B964Aa293c347994F"
      directlyReceivedPermissions.1.target:
-        "0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"
      directlyReceivedPermissions.1.from:
+        "0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"
      directlyReceivedPermissions.0.target:
-        "0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"
      directlyReceivedPermissions.0.from:
+        "0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xe62cf794807c2c7b2be9d9fb3f23295c2e0a058e

# Diff at Wed, 08 Jan 2025 09:09:58 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 22580417
- current block number: 22580417

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22580417 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x04aa889b98dc1d9c730d1d9649db98adb1bfe033

# Diff at Mon, 18 Nov 2024 17:16:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b54f69b0d6666908da980a31e5f52da87009f1ab block: 20760966
- current block number: 22580417

## Description

Signer changes at Caldera.

## Watched changes

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      values.$members.3:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
      values.$threshold:
-        3
+        2
      values.multisigThreshold:
-        "3 of 4 (75%)"
+        "2 of 3 (67%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20760966 (main branch discovery), not current.

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      name:
-        "SyndicateFrameMultisig"
+        "Caldera Multisig 2"
    }
```

Generated with discovered.json: 0x493a25fa3a1af3127e0421541c88f6000d80d0b7

# Diff at Fri, 01 Nov 2024 12:11:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20760966
- current block number: 20760966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20760966 (main branch discovery), not current.

```diff
    contract SyndicateFrameMultisig (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      directlyReceivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x0db196725c63d8cb2fe288f45e4195fa66f90129

# Diff at Tue, 29 Oct 2024 13:24:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20760966
- current block number: 20760966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20760966 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x71da134c48680cfc83ce885f5c1050ac358fc1b8

# Diff at Mon, 21 Oct 2024 12:52:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20760966
- current block number: 20760966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20760966 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

Generated with discovered.json: 0xa5327a9cf4df07c3f4b47c1b7fb8c8fe7bcbc368

# Diff at Mon, 21 Oct 2024 11:14:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20760966
- current block number: 20760966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20760966 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0x06DDDA853506cECa671a06136f955f7f042FD667"]
      values.$pastUpgrades.1.1:
-        ["0x06DDDA853506cECa671a06136f955f7f042FD667"]
+        "0x64273f6d08fd5de9b9d3480c7d387e64b13c3364e227601a6af78c5a49057427"
      values.$pastUpgrades.0.2:
+        ["0x0ED44be59Ea62a9960CB97f8aC54088304D05791"]
      values.$pastUpgrades.0.1:
-        ["0x0ED44be59Ea62a9960CB97f8aC54088304D05791"]
+        "0x2eea12a1949fd31d0b78093777274d93d22abbfe7f8c3a146336baf9d413037d"
    }
```

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x6042DE5a64709d8d4bBb227891AD886ECff49c6d"]
      values.$pastUpgrades.0.1:
-        ["0x6042DE5a64709d8d4bBb227891AD886ECff49c6d"]
+        "0xaf623829a347e0ac10b6be166c1c32a64bb61fc9866d9bc1fcbfad71e6803107"
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x44Ce95273E69246fe258b02a68E3a6FfCA66fdf2"]
      values.$pastUpgrades.0.1:
-        ["0x44Ce95273E69246fe258b02a68E3a6FfCA66fdf2"]
+        "0x7365eb094277a0147c55d12fe495f56b4c4297ea9aa6672b3e3c7845b4b0d88d"
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x5581A42BAF9bd77e1c56aFB2c74dEF20dfe26f9A"]
      values.$pastUpgrades.0.1:
-        ["0x5581A42BAF9bd77e1c56aFB2c74dEF20dfe26f9A"]
+        "0x31c3e3a0a7efc91fa8eec9137a7d19fe4ab6ed13e92c9cd4cbf28f5ea10a6154"
    }
```

Generated with discovered.json: 0x69d15f67cbdc0fb108bf6e7a722c641e4d5fe2bf

# Diff at Wed, 16 Oct 2024 11:45:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20760966
- current block number: 20760966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20760966 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xADE1F8C181934052fD1958F06B63Ef0D875803C5","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
+        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
      issuedPermissions.0.via.0:
-        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
+        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
      issuedPermissions.0.via.0:
-        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
+        "0x63d02F40A14c54283D5Dc3451d3Ed4DC134833e5"
      issuedPermissions.1.via.0:
-        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
    }
```

Generated with discovered.json: 0xe9bfd9de2362790bd58c9fb3088188fff329cfb0

# Diff at Mon, 14 Oct 2024 10:59:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20760966
- current block number: 20760966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20760966 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x6d9fd2364c536d73c3e3064034991a037e4e43313e72fb130782bf63ca586437"]
    }
```

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x66cdacb7ee63d044769108a364e635bea065ba30dc12d4e5ec83f8b90c228d3a"]
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract SyndicateFrameMultisig (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x5afa3e86b6524528383af0276ca7f40885c1eb2ae2e9932f65dabc6b58a99643"]
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x9acaa683f4e228c0e24b38c1b79cf896a311a7b85c6f036e915d0fb8593a3ca5"]
    }
```

Generated with discovered.json: 0x9f667d79d8557520b948bc11d44c506d40dc180f

# Diff at Wed, 09 Oct 2024 13:11:18 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20760966
- current block number: 20760966

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20760966 (main branch discovery), not current.

```diff
    contract SyndicateFrameMultisig (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x5a75b895ff98ee34a170bc3d49d8138301686e59

# Diff at Mon, 07 Oct 2024 14:28:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7c3e632caf56b943789c1bfa1021d4f65d503045 block: 19927684
- current block number: 20760966

## Description

Discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927684 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791) {
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
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract SyndicateFrameMultisig (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      name:
-        "GnosisSafeL2"
+        "SyndicateFrameMultisig"
      receivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
+        "0xdC545dDC657A1E2EDA8F6cBBE382927E3C9aA6E4"
      issuedPermissions.0.via.0:
-        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      directlyReceivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
    }
```

Generated with discovered.json: 0xe956de0c0e5db3d8e01b0e16206dc738dd1722ef

# Diff at Tue, 01 Oct 2024 11:13:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19927684
- current block number: 19927684

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19927684 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-08T05:15:41.000Z",["0x0ED44be59Ea62a9960CB97f8aC54088304D05791"]],["2024-02-08T05:17:55.000Z",["0x06DDDA853506cECa671a06136f955f7f042FD667"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-08T05:18:07.000Z",["0x6042DE5a64709d8d4bBb227891AD886ECff49c6d"]]]
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-02-08T05:18:21.000Z",["0x44Ce95273E69246fe258b02a68E3a6FfCA66fdf2"]]]
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-02-08T05:17:07.000Z",["0x5581A42BAF9bd77e1c56aFB2c74dEF20dfe26f9A"]]]
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x552b6c3bb1972dd039722ceab4f45023d1d30e81

# Diff at Wed, 18 Sep 2024 07:32:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3edd34806055e1f218ea285ab37aade4f39688cd block: 18674800
- current block number: 19927684

## Description

Shape related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18674800 (main branch discovery), not current.

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

Generated with discovered.json: 0x8213fa83edf87c6a80c7884b871e9e4834d8f7a4

# Diff at Sun, 08 Sep 2024 17:20:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 18674800
- current block number: 18674800

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18674800 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0:
+        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0:
+        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
    }
```

```diff
    contract GnosisSafeL2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E, inheriting its permissions."]
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b","via":[{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4","via":[{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x52fA397D799f1CE416a2089B964Aa293c347994F","via":[{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5","via":[{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"}]}
      receivedPermissions.0.target:
-        "0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"
+        "0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"
      receivedPermissions.0.via:
+        [{"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"}]
    }
```

```diff
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0:
+        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0:
+        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"},{"permission":"upgrade","target":"0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"},{"permission":"upgrade","target":"0x52fA397D799f1CE416a2089B964Aa293c347994F"},{"permission":"upgrade","target":"0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"},{"permission":"upgrade","target":"0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"},{"permission":"upgrade","target":"0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"},{"permission":"upgrade","target":"0x52fA397D799f1CE416a2089B964Aa293c347994F"},{"permission":"upgrade","target":"0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"},{"permission":"upgrade","target":"0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"}]
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.via.0:
+        {"address":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","delay":0}
    }
```

Generated with discovered.json: 0x59c72cddb6b11c73779f7f07ea78cf0ce7383008

# Diff at Fri, 30 Aug 2024 08:17:26 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 18674800
- current block number: 18674800

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18674800 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: It can act on behalf of 0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
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

Generated with discovered.json: 0x0029b9aaad77af80f4c27d0af65ed3625501792d

# Diff at Fri, 23 Aug 2024 09:57:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 18674800
- current block number: 18674800

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18674800 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x3a4c57f9499dac76ac4ff5b032c3f107d2e96e18

# Diff at Wed, 21 Aug 2024 10:08:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 18674800
- current block number: 18674800

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18674800 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","via":[]}]
    }
```

```diff
    contract GnosisSafeL2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: It can act on behalf of 0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","via":[]}]
    }
```

```diff
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","via":[]}]
    }
```

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5","0x52fA397D799f1CE416a2089B964Aa293c347994F","0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b","0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"],"configure":["0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0","via":[]},{"permission":"upgrade","target":"0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5","via":[]},{"permission":"upgrade","target":"0x52fA397D799f1CE416a2089B964Aa293c347994F","via":[]},{"permission":"upgrade","target":"0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4","via":[]},{"permission":"upgrade","target":"0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E","via":[]}]
    }
```

Generated with discovered.json: 0x3065b0a06c9208eac37c0b38b231132169065726

# Diff at Tue, 20 Aug 2024 07:29:13 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5417c4717b5cefeed17cd8419a7eb2dda22d4206 block: 15661223
- current block number: 18674800

## Description

The proxy admin was updated to a 3/4 multisig (not sure why the updates below).

## Watched changes

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d)
    +++ description: It can act on behalf of 0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E, inheriting its permissions.
```

```diff
+   Status: CREATED
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b)
    +++ description: None
```

## Source code changes

```diff
.../syndicateframe/base/.flat/AddressManager.sol   |  112 +
 .../base/.flat/GnosisSafeL2/GnosisSafeL2.sol       | 1031 +++++++
 .../base/.flat/GnosisSafeL2/GnosisSafeProxy.p.sol  |   34 +
 .../L1CrossDomainMessenger.sol                     | 1532 ++++++++++
 .../ResolvedDelegateProxy.p.sol                    |   46 +
 .../.flat/L1StandardBridge/L1ChugSplashProxy.p.sol |  221 ++
 .../.flat/L1StandardBridge/L1StandardBridge.sol    | 1429 +++++++++
 .../base/.flat/L2OutputOracle/L2OutputOracle.sol   |  751 +++++
 .../base/.flat/L2OutputOracle/Proxy.p.sol          |  209 ++
 .../base/.flat/OptimismPortal/OptimismPortal.sol   | 3221 ++++++++++++++++++++
 .../base/.flat/OptimismPortal/Proxy.p.sol          |  209 ++
 .../syndicateframe/base/.flat/ProxyAdmin.sol       |  297 ++
 .../base/.flat/SystemConfig/Proxy.p.sol            |  209 ++
 .../base/.flat/SystemConfig/SystemConfig.sol       |  708 +++++
 14 files changed, 10009 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661223 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b)
    +++ description: None
```

Generated with discovered.json: 0x4c4a351cc99bdbd3869c4d7a597a94c9006d7d89

# Diff at Fri, 09 Aug 2024 12:04:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 15661223
- current block number: 15661223

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661223 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      assignedPermissions.upgrade.2:
-        "0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"
+        "0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"
      assignedPermissions.upgrade.0:
-        "0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b"
+        "0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5"
    }
```

Generated with discovered.json: 0x06d91178325ba2b708f22d5584ed8369946ae510

# Diff at Fri, 09 Aug 2024 10:14:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 15661223
- current block number: 15661223

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 15661223 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5","0x52fA397D799f1CE416a2089B964Aa293c347994F","0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b","0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"]
      assignedPermissions.owner:
-        ["0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"]
      assignedPermissions.upgrade:
+        ["0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b","0x52fA397D799f1CE416a2089B964Aa293c347994F","0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5","0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4"]
      assignedPermissions.configure:
+        ["0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0"]
    }
```

Generated with discovered.json: 0x58150dfac00f75ad2c9b331523a03d2d5a33c8d9

# Diff at Tue, 11 Jun 2024 13:16:59 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 13275713
- current block number: 15661223

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13275713 (main branch discovery), not current.

```diff
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4) {
    +++ description: None
      values.resourceConfig:
-        [20000000,10,8,1000000000,1000000,"340282366920938463463374607431768211455"]
+        {"maxResourceLimit":20000000,"elasticityMultiplier":10,"baseFeeMaxChangeDenominator":8,"minimumBaseFee":1000000000,"systemTxMaxGas":1000000,"maximumBaseFee":"340282366920938463463374607431768211455"}
    }
```

Generated with discovered.json: 0x147fd279bec58614540f9e2feb015f36787829b5

# Diff at Wed, 17 Apr 2024 07:59:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 13275713

## Description

Standard OP stack chain with no significant changes.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x0ED44be59Ea62a9960CB97f8aC54088304D05791)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x520D972B4A7C1CE4d5e01bCd4349a93a8AeaEAC5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x52fA397D799f1CE416a2089B964Aa293c347994F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x9Bf9cd5aD745076b5bFb7Cc2d3b871532973C2c0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xc2dA6Afd69F0ce69313F01c73f77E6471f06b4E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xF5BD775557F3b8817C34Fc784971A0AF1a36DD8E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b)
    +++ description: None
```
