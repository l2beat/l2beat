Generated with discovered.json: 0x33e24f307aca463fcec3f2cfcaff70e685905b76

# Diff at Tue, 04 Mar 2025 11:25:53 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x3be99fae905ee16b45ea89277b615edc1ab54b1e

# Diff at Tue, 04 Mar 2025 10:39:19 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        19674374
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      sinceBlock:
+        19674370
    }
```

```diff
    contract GnosisSafe (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      sinceBlock:
+        19674367
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19674389
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19674386
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19674369
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19674382
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19674385
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19674387
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19674383
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19674384
    }
```

Generated with discovered.json: 0x5610f470752fa2c255e01a1e140fd82225ee8291

# Diff at Wed, 26 Feb 2025 10:32:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 20914730
- current block number: 20914730

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x515d8a7a3fb51cc7a061421a2890e63343d7deff

# Diff at Fri, 21 Feb 2025 14:08:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 20914730
- current block number: 20914730

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x981bf47b56f56cec394f0f4d86e2637ce7dd17ff

# Diff at Fri, 21 Feb 2025 08:59:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x1f5be69551e014e3ec59b8c6a9fb0f2f9224e363

# Diff at Mon, 10 Feb 2025 19:04:09 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xf4dbcf2aa83c0a8a75f6c44e0a0c25874fa99ea2

# Diff at Tue, 04 Feb 2025 12:31:36 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 20914730
- current block number: 20914730

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x2f8eb2407bb25f8f483c9084be02cfa567f62414

# Diff at Mon, 20 Jan 2025 11:09:39 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20914730
- current block number: 20914730

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F"
      directlyReceivedPermissions.7.from:
+        "0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F"
      directlyReceivedPermissions.6.target:
-        "0xae809d42f861A6381b0DFCf7216556e95362a7a8"
      directlyReceivedPermissions.6.from:
+        "0xae809d42f861A6381b0DFCf7216556e95362a7a8"
      directlyReceivedPermissions.5.target:
-        "0x8334f9A70294556101527bfB9bdEdeF7EB382D94"
      directlyReceivedPermissions.5.from:
+        "0x8334f9A70294556101527bfB9bdEdeF7EB382D94"
      directlyReceivedPermissions.4.target:
-        "0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"
      directlyReceivedPermissions.4.from:
+        "0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"
      directlyReceivedPermissions.3.target:
-        "0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"
      directlyReceivedPermissions.3.from:
+        "0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"
      directlyReceivedPermissions.2.target:
-        "0x2297eB8DC91f532C91c57b3fb33C06b782e9594A"
      directlyReceivedPermissions.2.from:
+        "0x2297eB8DC91f532C91c57b3fb33C06b782e9594A"
      directlyReceivedPermissions.1.target:
-        "0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"
      directlyReceivedPermissions.1.from:
+        "0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"
      directlyReceivedPermissions.0.target:
-        "0x624808dc4A34B79B90C3c085942D2100F09A0376"
      directlyReceivedPermissions.0.from:
+        "0x624808dc4A34B79B90C3c085942D2100F09A0376"
    }
```

```diff
    contract GnosisSafe (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
      directlyReceivedPermissions.0.from:
+        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.1.target:
-        "0xC16EAEDaB78E033B555c9eF3C326c07B49F21907"
      issuedPermissions.1.to:
+        "0xC16EAEDaB78E033B555c9eF3C326c07B49F21907"
      issuedPermissions.0.target:
-        "0x864A02Ca4a40616f8995709D1B26CDe588709043"
      issuedPermissions.0.to:
+        "0x864A02Ca4a40616f8995709D1B26CDe588709043"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "set and change address mappings."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.2.via.1.delay:
-        0
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.1.target:
-        "0xDeC273BF31AD79ad00D619c52662f724176A12Fb"
      issuedPermissions.1.to:
+        "0xDeC273BF31AD79ad00D619c52662f724176A12Fb"
      issuedPermissions.0.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.1.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xa81a6f25d7d8218b0864b8840153691fb7e548c1

# Diff at Wed, 08 Jan 2025 09:02:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xa6000f89dc166cf3c8bf5fd2c3ce096a4d51f4a2

# Diff at Fri, 01 Nov 2024 12:23:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      directlyReceivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.1.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xd5c1dd5f1f853d1707fc7d7016011e2b3c757e7d

# Diff at Tue, 29 Oct 2024 13:09:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x69e79c1f9db97383b6b9b7dd9be88af13d402e20

# Diff at Tue, 22 Oct 2024 13:50:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0x8003cb528459b255257355cc94e70974b09d5e92

# Diff at Mon, 21 Oct 2024 12:45:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

Generated with discovered.json: 0xb85db7362e9a1b1de9a191b50d96722905de10f7

# Diff at Mon, 21 Oct 2024 11:06:57 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.0.2:
+        ["0x527021A71d6E76Bb4243A0BabAd4e160245b8aAE"]
      values.$pastUpgrades.0.1:
-        ["0x527021A71d6E76Bb4243A0BabAd4e160245b8aAE"]
+        "0x1a3991338cc400337c14a34162b90b43413291541b5ceb1e189223ecf4d99819"
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x850DFdB4035db757e49eCF997ef051290959167A"]
      values.$pastUpgrades.0.1:
-        ["0x850DFdB4035db757e49eCF997ef051290959167A"]
+        "0x70d369e3fbd262bd7e466c0aeaadcc797f5e3ce3ee851e8b10971a3bfc0f977f"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x4CA20D48C87129Df90A3cAd73000568331548316"]
      values.$pastUpgrades.0.1:
-        ["0x4CA20D48C87129Df90A3cAd73000568331548316"]
+        "0x4a49658e24a8a7c5cf8fbca0e197eed3cd65bcc4b7f8cfde285b5d8a9cd9e221"
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x5865A0BCf08dd24A0691Dc746F181EDc6821bea9"]
      values.$pastUpgrades.0.1:
-        ["0x5865A0BCf08dd24A0691Dc746F181EDc6821bea9"]
+        "0x4bfec2bbdbd904e8a9551fd48b57d86712c1d897293ed0b516692447f06088d4"
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.0.2:
+        ["0x26B5810033fd2380c87F9E22CC20101778b5F584"]
      values.$pastUpgrades.0.1:
-        ["0x26B5810033fd2380c87F9E22CC20101778b5F584"]
+        "0x9bbb2552612e752f5ef45723425a876493354c383f84e1fa62739427379af625"
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x5121000767198Ad7D60fe8e47458F556B7B51aa0"]
      values.$pastUpgrades.0.1:
-        ["0x5121000767198Ad7D60fe8e47458F556B7B51aa0"]
+        "0xae9a24143ee0e3a2a01293ef4f3a841c22aec6728c705c76938aea840b472796"
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x781dAB53cC9d9870a96A84f4AE3130c084a2fAfD"]
      values.$pastUpgrades.0.1:
-        ["0x781dAB53cC9d9870a96A84f4AE3130c084a2fAfD"]
+        "0x4953e405f93b89a4589bd976cce5cc8a2a169c63549c25876b8dd155871528d3"
    }
```

Generated with discovered.json: 0xb13f1ab625a6510ae527803637d6c9bf2c63b6cc

# Diff at Wed, 16 Oct 2024 11:37:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40","via":[{"address":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","delay":0},{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.1:
-        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","delay":0}
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40","via":[{"address":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","delay":0},{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xC16EAEDaB78E033B555c9eF3C326c07B49F21907","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
+        "0x864A02Ca4a40616f8995709D1B26CDe588709043"
      issuedPermissions.0.via.1:
-        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","delay":0}
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40","via":[{"address":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","delay":0},{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.1:
-        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.0.via.0:
-        {"address":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","delay":0}
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40","via":[{"address":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","delay":0},{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
+        "0xDeC273BF31AD79ad00D619c52662f724176A12Fb"
      issuedPermissions.1.via.1:
-        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.1.via.0:
-        {"address":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","delay":0}
    }
```

Generated with discovered.json: 0xc646e87e5215cdbb4b58221feb5f68dfec2a0af1

# Diff at Mon, 14 Oct 2024 10:52:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract GnosisSafe (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

Generated with discovered.json: 0xfe8a705f42960f3231a5245183f2e6ee2c870300

# Diff at Fri, 11 Oct 2024 07:31:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@52c209ecd27d1a92626074299e0545e15598d287 block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
    }
```

```diff
    contract GnosisSafe (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"configure","target":"0x624808dc4A34B79B90C3c085942D2100F09A0376","description":"set and change address mappings.","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]},{"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]},{"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]},{"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]},{"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]},{"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]},{"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]},{"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}]
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0,"description":"set and change address mappings."}
      issuedPermissions.0.via.0.address:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.0.via.0.address:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.1.via.1:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
      issuedPermissions.1.via.0.address:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
+        "0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"
      issuedPermissions.0.via.1:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
      issuedPermissions.0.via.0.address:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

Generated with discovered.json: 0xdae9c1fd4a7fefa9fb8302dd2d3adfcd9f1c5207

# Diff at Wed, 09 Oct 2024 13:09:34 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20914730
- current block number: 20914730

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20914730 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract GnosisSafe (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x67aeb5b0b1211db969dd7f2026f0e3000f712321

# Diff at Mon, 07 Oct 2024 15:59:23 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@7c3e632caf56b943789c1bfa1021d4f65d503045 block: 20111587
- current block number: 20914730

## Description

Use discovery driven data, 1/1 Safe is not recognized as transparent. (willfix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract GnosisSafe (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      name:
-        "LambdaOwnerMultisig"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xf58915ced5c6b5a18bc7068ed36e1b393fa6ac82

# Diff at Tue, 01 Oct 2024 10:51:51 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades:
+        [["2024-04-17T09:44:23.000Z",["0x527021A71d6E76Bb4243A0BabAd4e160245b8aAE"]]]
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-04-17T09:53:23.000Z",["0x850DFdB4035db757e49eCF997ef051290959167A"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-04-17T09:51:59.000Z",["0x4CA20D48C87129Df90A3cAd73000568331548316"]]]
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-04-17T09:54:23.000Z",["0x5865A0BCf08dd24A0691Dc746F181EDc6821bea9"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-04-17T09:52:47.000Z",["0x26B5810033fd2380c87F9E22CC20101778b5F584"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-04-17T09:51:23.000Z",["0x5121000767198Ad7D60fe8e47458F556B7B51aa0"]]]
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-04-17T09:50:47.000Z",["0x781dAB53cC9d9870a96A84f4AE3130c084a2fAfD"]]]
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

Generated with discovered.json: 0x5cbdda2345c98b2145d68505782ed0c98d0149c5

# Diff at Sun, 08 Sep 2024 17:24:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      descriptions:
-        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
      issuedPermissions:
-        [{"permission":"configure","target":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0x624808dc4A34B79B90C3c085942D2100F09A0376"},{"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"},{"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A"},{"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"},{"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"},{"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94"},{"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8"},{"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0x624808dc4A34B79B90C3c085942D2100F09A0376"},{"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"},{"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A"},{"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"},{"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"},{"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94"},{"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8"},{"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","description":"upgrading bridge implementation allows to access all funds and change every system component."}]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions."]
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","description":"upgrading bridge implementation allows to access all funds and change every system component.","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","via":[{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]}
      receivedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x624808dc4A34B79B90C3c085942D2100F09A0376"
      receivedPermissions.0.via:
+        [{"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"}]
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.1.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0}
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.target:
-        "0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"
+        "0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501"
      issuedPermissions.0.via.0:
+        {"address":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","delay":0,"description":"upgrading bridge implementation allows to access all funds and change every system component."}
    }
```

Generated with discovered.json: 0x6ee629293bc6f12e48a5b5709f5116e2254d664c

# Diff at Fri, 30 Aug 2024 07:53:18 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
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
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xf72ac42e630ec58f61824950475ff9eab4c7848c

# Diff at Fri, 23 Aug 2024 09:52:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x5a61b96bdd037a661260a482c2127738b15d5efc

# Diff at Wed, 21 Aug 2024 10:03:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","0x8334f9A70294556101527bfB9bdEdeF7EB382D94","0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","0xae809d42f861A6381b0DFCf7216556e95362a7a8"],"configure":["0x624808dc4A34B79B90C3c085942D2100F09A0376"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0x624808dc4A34B79B90C3c085942D2100F09A0376","via":[]},{"permission":"upgrade","target":"0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","via":[]},{"permission":"upgrade","target":"0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","via":[]},{"permission":"upgrade","target":"0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","via":[]},{"permission":"upgrade","target":"0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","via":[]},{"permission":"upgrade","target":"0x8334f9A70294556101527bfB9bdEdeF7EB382D94","via":[]},{"permission":"upgrade","target":"0xae809d42f861A6381b0DFCf7216556e95362a7a8","via":[]},{"permission":"upgrade","target":"0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","via":[]}]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40","via":[]},{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f","via":[]}]
    }
```

Generated with discovered.json: 0x841bbb48ff20bea605aa98e2f2ff03c1b630db65

# Diff at Fri, 09 Aug 2024 11:59:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.6:
-        "0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"
+        "0xae809d42f861A6381b0DFCf7216556e95362a7a8"
      assignedPermissions.upgrade.3:
-        "0xae809d42f861A6381b0DFCf7216556e95362a7a8"
+        "0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"
      assignedPermissions.upgrade.2:
-        "0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"
+        "0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"
      assignedPermissions.upgrade.0:
-        "0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054"
+        "0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c"
    }
```

Generated with discovered.json: 0xa80328fdf85cd3455fa14f6c53b9727a8ab8ed89

# Diff at Fri, 09 Aug 2024 10:10:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4","0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","0x8334f9A70294556101527bfB9bdEdeF7EB382D94","0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","0xae809d42f861A6381b0DFCf7216556e95362a7a8"]
      assignedPermissions.owner:
-        ["0x624808dc4A34B79B90C3c085942D2100F09A0376"]
      assignedPermissions.upgrade:
+        ["0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054","0x2297eB8DC91f532C91c57b3fb33C06b782e9594A","0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c","0xae809d42f861A6381b0DFCf7216556e95362a7a8","0x8334f9A70294556101527bfB9bdEdeF7EB382D94","0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F","0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4"]
      assignedPermissions.configure:
+        ["0x624808dc4A34B79B90C3c085942D2100F09A0376"]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"]
      assignedPermissions.configure:
+        ["0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f"]
      values.$multisigThreshold:
-        "1 of 1 (100%)"
      values.getOwners:
-        ["0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"]
      values.getThreshold:
-        1
      values.$members:
+        ["0xD5FDcf4ab4b682ab8D4a99fBE1b6Bd08dC83Ea40"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 1 (100%)"
    }
```

Generated with discovered.json: 0x77aae1d165f3c654cdd307d99acf8d79097c3638

# Diff at Tue, 30 Jul 2024 11:12:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x11ad2fe16fdc0505518d5560b77a3be12667cecd

# Diff at Thu, 18 Jul 2024 10:31:20 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 20111587
- current block number: 20111587

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20111587 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c) {
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
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f) {
    +++ description: None
      descriptions:
+        ["It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component."]
    }
```

```diff
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f, inheriting its permissions."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4) {
    +++ description: None
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

```diff
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions.0:
-        "The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals."
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions.0:
-        "Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function."
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
      categories:
+        ["Core"]
    }
```

```diff
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94) {
    +++ description: None
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions.0:
-        "Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address."
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F) {
    +++ description: None
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x0ab7f1a958bfb52aa19a321df6c754c25ec26cd0

# Diff at Mon, 17 Jun 2024 12:45:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 20111587

## Description

Initial discovery:
Lambda Chain is an OP stack L2, publishing blobs to Ethereum. The TVL (USD ~3M) is almost exclusively in the associated token LAMB.
Lambda is developing decentralized modular storage services. EOA-upgradable.

## Initial discovery

```diff
+   Status: CREATED
    contract SuperchainConfig (0x01Cf2c778E56360dCd5e1396373c0Aa6ae794E2c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x04d59CB8f8b2BAcb8cE6912c284D10e263a0EB9f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LambdaOwnerMultisig (0x0b489aC3516F692159E4E5cc0C4a17B11fD6a501)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x2297eB8DC91f532C91c57b3fb33C06b782e9594A)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x5C3D1b1334b6939e6D042BF5E15249cF86A875A4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x624808dc4A34B79B90C3c085942D2100F09A0376)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x7288e508f56c1b4b52D2e4Fd3688a711c7cE0054)
    +++ description: The main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x78B5818884929d7A930edADD03a0fCD9Dd068EB7)
    +++ description: Sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x8334f9A70294556101527bfB9bdEdeF7EB382D94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xae809d42f861A6381b0DFCf7216556e95362a7a8)
    +++ description: Contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xEEBd256da18d0BF20c3CEb785a0946D41A7F408F)
    +++ description: None
```
