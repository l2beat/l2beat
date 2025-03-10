Generated with discovered.json: 0x8009b6aea1c2582bf57e5585a17e9e179c24e418

# Diff at Tue, 04 Mar 2025 11:25:56 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x404b91a0b9e97ec38559cabb2b48cf3233432f67

# Diff at Tue, 04 Mar 2025 10:39:22 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19788823
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19788822
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19788825
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19788804
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19788820
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19788798
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19788827
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19788831
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sinceBlock:
+        19521321
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19788829
    }
```

```diff
    contract L1OpUSDCBridgeAdapter (0xE3622468Ea7dD804702B56ca2a4f88C0936995e6) {
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
      sinceBlock:
+        20865118
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      sinceBlock:
+        19788801
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      sinceBlock:
+        19788796
    }
```

Generated with discovered.json: 0x4245e6ea71a88f69ede0b5bcb51e9b483296d38f

# Diff at Wed, 26 Feb 2025 10:32:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21635783
- current block number: 21635783

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x3cdf02cc6d4e6138aa5dd98f713585f38ea4b09c

# Diff at Fri, 21 Feb 2025 14:08:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21635783
- current block number: 21635783

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x006845ad78ba7264e240685865e10bca42220254

# Diff at Fri, 21 Feb 2025 08:59:40 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xd266ca8d8c162ce2daf529f20bbbaca8b0c69048

# Diff at Mon, 10 Feb 2025 19:04:11 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21635783
- current block number: 21635783

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x64db1d1f4aaa37e25c7224e5bb3815a0776f9e8a

# Diff at Tue, 04 Feb 2025 12:31:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21635783
- current block number: 21635783

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.4.permission:
-        "guard"
+        "interact"
      receivedPermissions.4.from:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.4.description:
+        "set and change address mappings."
      receivedPermissions.4.via:
+        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "guard"
      receivedPermissions.2.from:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.2.description:
-        "set and change address mappings."
      receivedPermissions.2.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x76000d31756d58b56febb27b960e896b554029ca

# Diff at Mon, 20 Jan 2025 11:09:42 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21635783
- current block number: 21635783

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21635783 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
      issuedPermissions.1.to:
+        "0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.target:
-        "0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
      issuedPermissions.1.to:
+        "0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "set and change address mappings."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.11.target:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      receivedPermissions.11.from:
+        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      receivedPermissions.10.target:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      receivedPermissions.10.from:
+        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      receivedPermissions.9.target:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.9.from:
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.8.target:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.8.from:
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.7.target:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      receivedPermissions.7.from:
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      receivedPermissions.6.target:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.6.from:
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.5.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.5.from:
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.4.target:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.4.from:
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.3.target:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.3.from:
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.2.target:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.2.from:
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.1.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.1.from:
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.0.target:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.0.from:
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      directlyReceivedPermissions.7.from:
+        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
      directlyReceivedPermissions.6.target:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      directlyReceivedPermissions.6.from:
+        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
      directlyReceivedPermissions.5.target:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      directlyReceivedPermissions.5.from:
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      directlyReceivedPermissions.4.target:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      directlyReceivedPermissions.4.from:
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      directlyReceivedPermissions.3.target:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      directlyReceivedPermissions.3.from:
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      directlyReceivedPermissions.2.target:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      directlyReceivedPermissions.2.from:
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      directlyReceivedPermissions.1.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      directlyReceivedPermissions.1.from:
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      directlyReceivedPermissions.0.target:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      directlyReceivedPermissions.0.from:
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
      directlyReceivedPermissions.0.from:
+        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
    }
```

Generated with discovered.json: 0x2869029ba963ae7645a09f7662eeab1fa9595eb1

# Diff at Thu, 16 Jan 2025 08:14:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a739892e4565ca2cf8f67abed360c494a770dcea block: 21628398
- current block number: 21635783

## Description

Gas limit doubled to 60M.

## Watched changes

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        30000000
+        60000000
    }
```

Generated with discovered.json: 0x47c7010c9b019fc821f8fc9e972898eea4eab874

# Diff at Wed, 15 Jan 2025 07:30:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21343018
- current block number: 21628398

## Description

Two signers added to Gelato MS, now 4/10.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.7:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.6:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x88De44422E1b1c30bc530c35aEdb9f5aD0e6fD52"
      values.$members.5:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
      values.$members.4:
-        "0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.3:
-        "0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d"
+        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
      values.$members.2:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
      values.$members.1:
-        "0x28bB9385A588EF4747264D19B9A9F1603591680c"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.0:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 10 (40%)"
    }
```

Generated with discovered.json: 0xbb9eeffc226264cb17a75017f4162fe347bdfc0d

# Diff at Wed, 08 Jan 2025 09:02:41 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21343018
- current block number: 21343018

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21343018 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xb692a1191b502cd01b681db4ab87a83ad01c9835

# Diff at Fri, 06 Dec 2024 11:00:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@da76f61d2c06d695d89e2429e2266a54932319a2 block: 21078724
- current block number: 21343018

## Description

Add external USDC escrow.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078724 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract L1OpUSDCBridgeAdapter (0xE3622468Ea7dD804702B56ca2a4f88C0936995e6)
    +++ description: Escrow for USDC that uses the canonical bridge for messaging but is governed externally.
```

Generated with discovered.json: 0x4643eb50cf7ef31cd03bbcb51f9bd08800a664c8

# Diff at Fri, 01 Nov 2024 12:23:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078724
- current block number: 21078724

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078724 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.3.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x1595c2bb52291e5edea61159da4d34466d89e118

# Diff at Wed, 30 Oct 2024 13:22:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20941810
- current block number: 21078724

## Description

GelatoMS: Signer removed, threshold decreased.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.8:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.5:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$threshold:
-        6
+        4
      values.multisigThreshold:
-        "6 of 9 (67%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x198f883b6f8dc6ff7e56c16f98997a93a2c53f84

# Diff at Tue, 29 Oct 2024 13:10:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x49a5fcb52e9729c0dab86a13c3f3fc7f897a7def

# Diff at Tue, 22 Oct 2024 13:50:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0xa92bbe11ff93f5e94854f4307b9c398c69965a0b

# Diff at Mon, 21 Oct 2024 12:45:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0xcff24f05f9be6465f44ce3160477e6743d8c5698

# Diff at Mon, 21 Oct 2024 11:07:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"]
      values.$pastUpgrades.0.1:
-        ["0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"]
+        "0xc11b949a2d36badaad0e61d755725b252de22d520f00c496c4a9d3b8cbb8a3b2"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.2.2:
+        ["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]
      values.$pastUpgrades.2.1:
-        ["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]
+        "0x0f93b344ebb035d302c35ca71e44da57db2f85df8895e5ddd2f9229245922785"
      values.$pastUpgrades.1.2:
+        ["0x4a8515A656BF683cCdabc27C25610223033b594e"]
      values.$pastUpgrades.1.1:
-        ["0x4a8515A656BF683cCdabc27C25610223033b594e"]
+        "0x0f93b344ebb035d302c35ca71e44da57db2f85df8895e5ddd2f9229245922785"
      values.$pastUpgrades.0.2:
+        ["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]
      values.$pastUpgrades.0.1:
-        ["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]
+        "0x26fede05b0c5857b3171d848447a7b8303ac46bc8c52de81eee10aea983c6d92"
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.2.2:
+        ["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]
      values.$pastUpgrades.2.1:
-        ["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]
+        "0x118a7068dc6193af0c0ee92c1c5c109135517c54bd86a8cbb65c8380962de332"
      values.$pastUpgrades.1.2:
+        ["0x4a8515A656BF683cCdabc27C25610223033b594e"]
      values.$pastUpgrades.1.1:
-        ["0x4a8515A656BF683cCdabc27C25610223033b594e"]
+        "0x118a7068dc6193af0c0ee92c1c5c109135517c54bd86a8cbb65c8380962de332"
      values.$pastUpgrades.0.2:
+        ["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]
      values.$pastUpgrades.0.1:
-        ["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]
+        "0x46970f847dcde9d9c041d68ef64608e478a6857b80c57c8651ae535c4f4b3f36"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"]
      values.$pastUpgrades.0.1:
-        ["0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"]
+        "0x4194ea6fa29f5dd080b647267726a7f0b36d277f46019550706335c763ac352d"
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0x0318A37e2662507789a6E17E85A506709F89488b"]
      values.$pastUpgrades.0.1:
-        ["0x0318A37e2662507789a6E17E85A506709F89488b"]
+        "0xfae1f2f01e0de9b66095de3faf83be79326792924394411ebef79b3c4d3314b9"
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0xefBDff012170ae592A3d197bf9Ac10eBF313233a"]
      values.$pastUpgrades.0.1:
-        ["0xefBDff012170ae592A3d197bf9Ac10eBF313233a"]
+        "0x27155d16a9584317f4c13bac90f9b3ff0b1df01ff4f7360bcddfb343e6b61d50"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"]
      values.$pastUpgrades.0.1:
-        ["0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"]
+        "0xc8310656324ea8f2f677190f579a9f950979ba83586245df990cdbf8f82b9fd0"
    }
```

Generated with discovered.json: 0x93482259fc8eab2995472f9ebe88ea8e87676318

# Diff at Wed, 16 Oct 2024 11:37:27 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
+        "0xa6Ea2f3299b63c53143c993d2d5E60A69Cd6Fe24"
      issuedPermissions.1.via.1:
-        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.1.via.0:
-        {"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x0AbD6da1cE10D1cD6c7C9C14b905786D20f3EB23","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.1:
-        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0}
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.1:
-        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0}
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0},{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.1:
-        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","delay":0}
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.11:
+        {"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.8.target:
-        "0xc1dA06CC5DD5cE23bABa924463de7F762039252d"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.7.target:
-        "0x3A44A3b263FB631cdbf25f339e2D29497511A81f"
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      receivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.6.target:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.5.target:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.4.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.4.target:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      receivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.target:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      receivedPermissions.3.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.1.target:
-        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.via:
-        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

Generated with discovered.json: 0x0a554f5ef66c77ababf423e17d7ffff609c1c32f

# Diff at Mon, 14 Oct 2024 10:52:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20941810
- current block number: 20941810

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20941810 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

Generated with discovered.json: 0x97f6e9d4d5cdd349a1b3f9f190b8950ba2d9ab1d

# Diff at Fri, 11 Oct 2024 10:34:24 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8f7c5fd25193054458be38552e62a708c480b2c8 block: 20368673
- current block number: 20941810

## Description

Getalo MS signer removed.

## Watched changes

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      values.$members.9:
-        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.8:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x547D0F472309e4239b296D01e03bEDc101241a26"
      values.$members.7:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.6:
-        "0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.multisigThreshold:
-        "6 of 10 (60%)"
+        "6 of 9 (67%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.1.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0,"description":"set and change address mappings."}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
      receivedPermissions.1:
+        {"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f","description":"set and change address mappings.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"},{"address":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"}]}
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      issuedPermissions.0.via.1:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f","description":"set and change address mappings.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}]
    }
```

Generated with discovered.json: 0xa7fb12400a09bb3c5f25cc682d8f3e388068223f

# Diff at Wed, 09 Oct 2024 13:09:39 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x32a30fce5dbba8c94f9ff2899f4e454e5162ed5e

# Diff at Tue, 01 Oct 2024 10:52:15 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-05-03T09:59:59.000Z",["0xc6cF1149d23F2788AC94312E68EB52a74F288ebe"]]]
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-05-03T10:02:59.000Z",["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]],["2024-07-22T12:25:35.000Z",["0x4a8515A656BF683cCdabc27C25610223033b594e"]],["2024-07-22T12:25:35.000Z",["0xe8912070277Dd5D9473904b7F4e6C71290F2AE90"]]]
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-05-03T09:51:11.000Z",["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]],["2024-07-22T12:26:23.000Z",["0x4a8515A656BF683cCdabc27C25610223033b594e"]],["2024-07-22T12:26:23.000Z",["0xd637dc6d7DA9151b5069a4bFB74a12E67a532CC3"]]]
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-05-03T10:03:35.000Z",["0x3Ff11Cde41a5f7c791eFfcd6AeEA05dd2df5e21e"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-05-03T10:02:23.000Z",["0x0318A37e2662507789a6E17E85A506709F89488b"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-05-03T10:00:59.000Z",["0xefBDff012170ae592A3d197bf9Ac10eBF313233a"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-05-03T10:01:23.000Z",["0xD00e38514d66bf1B761a8937559c6b2854A5B3ad"]]]
    }
```

Generated with discovered.json: 0x60b4dae22b52bad733321b15f4204f13dfc3ff07

# Diff at Sun, 08 Sep 2024 17:24:31 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.1.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: None
      descriptions:
-        ["It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45"
      issuedPermissions.0.via.0:
+        {"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750"},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6"},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08"},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7"},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f"},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750"},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6"},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","description":"upgrading bridge implementation allows to access all funds and change every system component."},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7"},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f"},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d"}]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]}
      receivedPermissions.0.target:
-        "0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"
+        "0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"
      receivedPermissions.0.via:
+        [{"address":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"}]
    }
```

Generated with discovered.json: 0x2ca54c37f7c02c8b27ebabc2ed5605a3c9bf3e63

# Diff at Fri, 30 Aug 2024 07:53:29 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
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

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x41ba141115593de23e25a41ef173868064cb70db

# Diff at Fri, 23 Aug 2024 09:53:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        3
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xb81be2d309fbabf0f34e1cf39f94a516caac2ab2

# Diff at Wed, 21 Aug 2024 10:03:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb","via":[]},{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions:
-        {"configure":["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"],"configure":["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x2dF7057d3F25212E51aFEA8dA628668229Ea423f","via":[]},{"permission":"upgrade","target":"0x05f23282FFDCA8286E4738C1aF79079f3d843750","via":[]},{"permission":"upgrade","target":"0x113cB99283AF242Da0A0C54347667edF531Aa7d6","via":[]},{"permission":"upgrade","target":"0x2658723Bf70c7667De6B25F99fcce13A16D25d08","via":[]},{"permission":"upgrade","target":"0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","via":[]},{"permission":"upgrade","target":"0x26dB93F8b8b4f7016240af62F7730979d353f9A7","via":[]},{"permission":"upgrade","target":"0x3A44A3b263FB631cdbf25f339e2D29497511A81f","via":[]},{"permission":"upgrade","target":"0xc1dA06CC5DD5cE23bABa924463de7F762039252d","via":[]}]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0xeC432c4F1d0E12737f3a42a459B84848Af979b2d","via":[]}]
    }
```

Generated with discovered.json: 0xc988d44587d40c17e96c4210210f3743a3f3cd5a

# Diff at Fri, 09 Aug 2024 12:00:11 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.4:
-        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
+        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
      assignedPermissions.upgrade.3:
-        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
+        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
      assignedPermissions.upgrade.2:
-        "0x26dB93F8b8b4f7016240af62F7730979d353f9A7"
+        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      assignedPermissions.upgrade.1:
-        "0x26C7bFB430d68Bf74d2d52497836d4336b555dE7"
+        "0x113cB99283AF242Da0A0C54347667edF531Aa7d6"
      assignedPermissions.upgrade.0:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "0x05f23282FFDCA8286E4738C1aF79079f3d843750"
    }
```

Generated with discovered.json: 0x3c1e04c49c1534797ef43b1068b0a76881f43b28

# Diff at Fri, 09 Aug 2024 10:10:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb) {
    +++ description: It can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.
      assignedPermissions.owner:
-        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]
      assignedPermissions.configure:
+        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750"]
      values.$multisigThreshold:
-        "6 of 10 (60%)"
      values.getOwners:
-        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.getThreshold:
-        6
      values.$members:
+        ["0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621","0x28bB9385A588EF4747264D19B9A9F1603591680c","0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2","0x5bE3E96Cdc3A97628bD7308d3588B9a474F4A54d","0xBc0ca6865d6883a83D4aDDD6b862aE042d855E0d","0xc85aC6d2fdC376F335455D4cCA30c45ED1080849","0x27b1682E9C5Cb0E58Ff474F3a13EeCC36E708ad3","0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e","0xf83bC4688979b13Da02CB94c76cEB169540760b5","0x547D0F472309e4239b296D01e03bEDc101241a26"]
      values.$threshold:
+        6
      values.multisigThreshold:
+        "6 of 10 (60%)"
    }
```

```diff
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"]
      assignedPermissions.owner:
-        ["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]
      assignedPermissions.upgrade:
+        ["0x2658723Bf70c7667De6B25F99fcce13A16D25d08","0x26C7bFB430d68Bf74d2d52497836d4336b555dE7","0x26dB93F8b8b4f7016240af62F7730979d353f9A7","0x113cB99283AF242Da0A0C54347667edF531Aa7d6","0x05f23282FFDCA8286E4738C1aF79079f3d843750","0x3A44A3b263FB631cdbf25f339e2D29497511A81f","0xc1dA06CC5DD5cE23bABa924463de7F762039252d"]
      assignedPermissions.configure:
+        ["0x2dF7057d3F25212E51aFEA8dA628668229Ea423f"]
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: It can act on behalf of 0xeC432c4F1d0E12737f3a42a459B84848Af979b2d, inheriting its permissions.
      assignedPermissions.owner:
-        ["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]
      assignedPermissions.configure:
+        ["0xeC432c4F1d0E12737f3a42a459B84848Af979b2d"]
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

Generated with discovered.json: 0x4220929a666aee751752bbed1141d7d708ba2ef8

# Diff at Tue, 30 Jul 2024 11:12:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20368673
- current block number: 20368673

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20368673 (main branch discovery), not current.

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x8d4557f91adb07eed80d7b422ffce2b174c2270e

# Diff at Tue, 23 Jul 2024 10:36:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@490aaec1a76ba293d442449146dd7c8335f4b7a1 block: 20367772
- current block number: 20368673

## Description

EOA signer removed, the LiskRollupOwnerMultisig is now just a transparent MS for Gelato MS. Warning removed from FE.

## Watched changes

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 2 (50%)"
+        "1 of 1 (100%)"
      values.getOwners.1:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
    }
```

Generated with discovered.json: 0x4ea5b8947e58d62a04b241936e836cfc4c567bba

# Diff at Tue, 23 Jul 2024 07:36:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@898b873eac66b785af49fe56edca0c3dc1a5d0d7 block: 20339917
- current block number: 20367772

## Description

Challenger and Guardian are changed to the GelatoMultisig. Rollup Upgrade owner is still an EOA (and additionally GelatoMS).

## Watched changes

```diff
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750) {
    +++ description: None
      values.owner:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6) {
    +++ description: None
      values.challenger:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.CHALLENGER:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7) {
    +++ description: None
      values.guardian:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7) {
    +++ description: None
      values.guardian:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
      values.GUARDIAN:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
      values.getOwners.1:
+        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
      values.getOwners.0:
-        "0xdA6e5640aFB2ED212Ba3a6fd83076e2ad3daD185"
+        "0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb"
    }
```

```diff
+   Status: CREATED
    contract GelatoMultisig (0xBeA2Bc852a160B8547273660E22F4F08C2fa9Bbb)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/GelatoMultisig/GnosisSafe.sol   | 952 +++++++++++++++++++++
 .../.flat/GelatoMultisig/GnosisSafeProxy.p.sol     |  34 +
 2 files changed, 986 insertions(+)
```

Generated with discovered.json: 0xbbda4273693b98590b45a10179daf316b84586ba

# Diff at Fri, 19 Jul 2024 10:16:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20339917

## Description

Initial discovery: OP stack rollup on the latest superchain (fork) contracts. EOA-governed without being in the Superchain governance.

## Initial discovery

```diff
+   Status: CREATED
    contract SystemConfig (0x05f23282FFDCA8286E4738C1aF79079f3d843750)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x113cB99283AF242Da0A0C54347667edF531Aa7d6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2658723Bf70c7667De6B25F99fcce13A16D25d08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x26C7bFB430d68Bf74d2d52497836d4336b555dE7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x26dB93F8b8b4f7016240af62F7730979d353f9A7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x2dF7057d3F25212E51aFEA8dA628668229Ea423f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x31B72D76FB666844C41EdF08dF0254875Dbb7edB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3A44A3b263FB631cdbf25f339e2D29497511A81f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xc1dA06CC5DD5cE23bABa924463de7F762039252d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xeC432c4F1d0E12737f3a42a459B84848Af979b2d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LiskRollupOwnerMultisig (0xECd4150ABbb1EBff13f74e42Fb43C3d78B4E0b45)
    +++ description: None
```
