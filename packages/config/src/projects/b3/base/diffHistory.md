Generated with discovered.json: 0xc32873ffec167a282d70863fe8547e7c911c5682

# Diff at Mon, 10 Mar 2025 16:46:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef4d1036423fe7d398c41e6cf238a209cc1ff8f3 block: 27283267
- current block number: 27417923

## Description

Base fee increase.

## Watched changes

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.basefeeScalar:
-        668098
+        4175613
    }
```

Generated with discovered.json: 0xa6a63cf64bb24804e470c0e4d1a239fb4e50cdb7

# Diff at Fri, 07 Mar 2025 13:58:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c5dbe2ef6b8273c834507deba40dda8a1affce55 block: 23224422
- current block number: 27283267

## Description

5 signers added to MS.

## Watched changes

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      values.$members.8:
+        "0x03A0080CA69B333F2a3697Eed806Bd8c31baCF8B"
      values.$members.7:
+        "0x8486C301D5719ADdf6AB789E92D24423c50a940D"
      values.$members.6:
+        "0xB6faDA40e4376D262e25068534df4788023Bb8A3"
      values.$members.5:
+        "0x34f1fb4c76019d83Eb287B56bAa5466Fc130A028"
      values.$members.4:
+        "0x5A17352926d9681990D08771804287c2577e11C7"
      values.$members.3:
-        "0x03A0080CA69B333F2a3697Eed806Bd8c31baCF8B"
+        "0x28C0a3F0DCE25Cf013Dc86ce1AaDccB8B0758d93"
      values.$members.2:
-        "0x8486C301D5719ADdf6AB789E92D24423c50a940D"
+        "0x7B5B1d9d8a51461208a59FAa4c7E58624bB7f02D"
      values.$members.1:
-        "0xB6faDA40e4376D262e25068534df4788023Bb8A3"
+        "0xb268354DC49Cf984306ba8bdcB7c0b1a95f31901"
      values.$members.0:
-        "0x34f1fb4c76019d83Eb287B56bAa5466Fc130A028"
+        "0xb8468fbf63dfbbb62e79b0B890849Fe55Fd09Ef2"
      values.multisigThreshold:
-        "2 of 4 (50%)"
+        "2 of 9 (22%)"
    }
```

Generated with discovered.json: 0xb4478a29150a3ff1b111b0eb3d9dc835cb686bec

# Diff at Tue, 04 Mar 2025 11:27:09 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0x0a64fb23a618f9da5ae9321f5b5d474d6b836760

# Diff at Tue, 04 Mar 2025 10:40:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      sinceBlock:
+        17793749
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      sinceBlock:
+        18176861
    }
```

```diff
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        17793749
    }
```

```diff
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        17793749
    }
```

```diff
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        17793749
    }
```

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        17793749
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        17793749
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
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        17793749
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        17793749
    }
```

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        17793749
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        17793749
    }
```

Generated with discovered.json: 0xfd4020e876bec86040cd30a13d1cad64b17a9bf8

# Diff at Wed, 26 Feb 2025 10:33:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 23224422
- current block number: 23224422

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x04916262e0dd524052b9a887f7c020434a784a49

# Diff at Fri, 21 Feb 2025 14:12:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 23224422
- current block number: 23224422

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xf55d6718d4e270bb3ef032116ff221291fade3cd

# Diff at Fri, 21 Feb 2025 09:00:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0xbe0bb745fe60a780eb7d304a46591ec96c98e546

# Diff at Mon, 10 Feb 2025 19:05:21 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xf390cfa66e01a5d1f59bd1d5b7786b5c3278c816

# Diff at Tue, 04 Feb 2025 12:33:59 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 23224422
- current block number: 23224422

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.2.permission:
-        "guard"
+        "interact"
      receivedPermissions.2.from:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.from:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.0.permission:
-        "configure"
+        "guard"
      receivedPermissions.0.from:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
+        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x636a75064d928f0af1bd549792fbc79561f54138

# Diff at Mon, 20 Jan 2025 11:10:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 23224422
- current block number: 23224422

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      directlyReceivedPermissions.7.from:
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      directlyReceivedPermissions.6.target:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      directlyReceivedPermissions.6.from:
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      directlyReceivedPermissions.5.target:
-        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      directlyReceivedPermissions.5.from:
+        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      directlyReceivedPermissions.4.target:
-        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      directlyReceivedPermissions.4.from:
+        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      directlyReceivedPermissions.3.target:
-        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      directlyReceivedPermissions.3.from:
+        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      directlyReceivedPermissions.2.target:
-        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      directlyReceivedPermissions.2.from:
+        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      directlyReceivedPermissions.1.target:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      directlyReceivedPermissions.1.from:
+        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      directlyReceivedPermissions.0.target:
-        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      directlyReceivedPermissions.0.from:
+        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
    }
```

```diff
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.7.from:
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.6.target:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.6.from:
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.5.target:
-        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      receivedPermissions.5.from:
+        "0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06"
      receivedPermissions.4.target:
-        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      receivedPermissions.4.from:
+        "0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38"
      receivedPermissions.3.target:
-        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      receivedPermissions.3.from:
+        "0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595"
      receivedPermissions.2.target:
-        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      receivedPermissions.2.from:
+        "0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A"
      receivedPermissions.1.target:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.1.from:
+        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.0.target:
-        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      receivedPermissions.0.from:
+        "0xd79005b0f06b2C518893d2Ba31f94429e555b6b1"
      directlyReceivedPermissions.0.target:
-        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
      directlyReceivedPermissions.0.from:
+        "0x102e24084a003feEbe57B536a3B4E29eD6AC855A"
    }
```

```diff
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
    }
```

```diff
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
    }
```

```diff
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.1.target:
-        "0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
      issuedPermissions.1.to:
+        "0x9c9Db06722b3E33fa356C7347f7fBe328a26Dc7d"
      issuedPermissions.0.target:
-        "0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
      issuedPermissions.0.to:
+        "0xEAC870005Fe175eEc9365502eAEb2A6f50De1eff"
    }
```

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d) {
    +++ description: None
      receivedPermissions.2.target:
-        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.2.from:
+        "0xe736142a3e957660cBae61AC4bD61e5b65635140"
      receivedPermissions.1.target:
-        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.1.from:
+        "0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794"
      receivedPermissions.0.target:
-        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
      receivedPermissions.0.from:
+        "0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
    }
```

```diff
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.1.target:
-        "0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A"
      issuedPermissions.1.to:
+        "0x1af3F4e08a16B93ccBDF6887549697F17f9cf78A"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce"
      issuedPermissions.0.target:
-        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
      issuedPermissions.0.to:
+        "0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d"
    }
```

Generated with discovered.json: 0x1d0076db9dc5079a9e7a6ae53fd3f0fa7fdade32

# Diff at Wed, 08 Jan 2025 09:09:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 23224422
- current block number: 23224422

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 23224422 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x16cf8ae6def6f97184452fbcca60b2364c9d6b8a

# Diff at Tue, 03 Dec 2024 15:03:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 23224422

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x102e24084a003feEbe57B536a3B4E29eD6AC855A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract B3Multisig (0x184d44C2DfB6d17C60B9Ca329b7B8630aea325Ce)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x39d484F0FC1b3bfAed7D54934FF5C8e5d47A6867)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x3a314A6a3c1470Bf2854960D3Ce9D2435c7Ba794)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3D748542A3bb90952d90f99F3fbfDAD8B6756B0A)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x536cf1ABfD22E61a13753c0F08613aDdF4ca0595)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x769547a723783FCA36BAaf1ECcf9dfdbF6d09F38)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract Caldera Multisig 2 (0x87Ef0aB1189F76eBCaEe736A5EB8F639a8cF156d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x88Ac5Be224B0bA925A9CA73a4FAFbA171849ec06)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xA9Bc65Ff5A3106351fa92B04C91d505BcCd92Cad)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd79005b0f06b2C518893d2Ba31f94429e555b6b1)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xe736142a3e957660cBae61AC4bD61e5b65635140)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```
