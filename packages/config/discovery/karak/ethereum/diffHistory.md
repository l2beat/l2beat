Generated with discovered.json: 0x389b17ae00545ea199d11b168f0629ea5432e93f

# Diff at Tue, 04 Mar 2025 11:25:52 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        true
      values.opStackDA.isUsingCelestia:
+        true
    }
```

Generated with discovered.json: 0xf2f68552c63665c0e49b1b8a340ec67cdcf3ceb5

# Diff at Tue, 04 Mar 2025 10:39:17 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        18824926
    }
```

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      sinceBlock:
+        18824926
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      sinceBlock:
+        18817640
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        18824926
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        18824926
    }
```

```diff
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        18824926
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        18824926
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        18824926
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        18824926
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        18824926
    }
```

Generated with discovered.json: 0xde0109fefb95545c031197a96e1984dd8a7b6a11

# Diff at Wed, 26 Feb 2025 10:32:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 20920155
- current block number: 20920155

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x0a22efbf8eaa4ee4a65122777f4b320c0f018208

# Diff at Fri, 21 Feb 2025 14:07:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 20920155
- current block number: 20920155

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
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
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      severity:
+        "HIGH"
    }
```

Generated with discovered.json: 0x4c26a2dd7ec6b7d570725187cd5ef31ec8d60335

# Diff at Fri, 21 Feb 2025 08:59:35 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0x9d93859e7d3b8289f1dc539466ffae637c8649d5

# Diff at Mon, 10 Feb 2025 19:04:07 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x90eeb2ad4bf21af3aabfc6fe01aa0b819ac65dc0

# Diff at Tue, 04 Feb 2025 12:31:35 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 20920155
- current block number: 20920155

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
+        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
      receivedPermissions.3.description:
+        "set and change address mappings."
      receivedPermissions.3.via:
+        [{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.2.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.via:
-        [{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
+        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x2ab4cd788270ec150283de20f9617f02f0453a94

# Diff at Mon, 20 Jan 2025 11:09:38 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20920155
- current block number: 20920155

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.1.target:
-        "0x4179f43f3b994e97090557363b09F403138a729e"
      issuedPermissions.1.to:
+        "0x4179f43f3b994e97090557363b09F403138a729e"
      issuedPermissions.0.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
    }
```

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB"
      directlyReceivedPermissions.6.from:
+        "0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB"
      directlyReceivedPermissions.5.target:
-        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      directlyReceivedPermissions.5.from:
+        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      directlyReceivedPermissions.4.target:
-        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
      directlyReceivedPermissions.4.from:
+        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
      directlyReceivedPermissions.3.target:
-        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
      directlyReceivedPermissions.3.from:
+        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
      directlyReceivedPermissions.2.target:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      directlyReceivedPermissions.2.from:
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      directlyReceivedPermissions.1.target:
-        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      directlyReceivedPermissions.1.from:
+        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      directlyReceivedPermissions.0.target:
-        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
      directlyReceivedPermissions.0.from:
+        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB"
      receivedPermissions.9.from:
+        "0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB"
      receivedPermissions.8.target:
-        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      receivedPermissions.8.from:
+        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      receivedPermissions.7.target:
-        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
      receivedPermissions.7.from:
+        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
      receivedPermissions.6.target:
-        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
      receivedPermissions.6.from:
+        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
      receivedPermissions.5.target:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.5.from:
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.4.target:
-        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      receivedPermissions.4.from:
+        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      receivedPermissions.3.target:
-        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      receivedPermissions.3.from:
+        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      receivedPermissions.2.target:
-        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
      receivedPermissions.2.from:
+        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
      receivedPermissions.1.target:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.1.from:
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.0.target:
-        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      receivedPermissions.0.from:
+        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      directlyReceivedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
      directlyReceivedPermissions.0.from:
+        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.1.target:
-        "0x84BdFb21ed7C8B332a42bFD595744a84F3101e4E"
      issuedPermissions.1.to:
+        "0x84BdFb21ed7C8B332a42bFD595744a84F3101e4E"
      issuedPermissions.0.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x56e5c9762b6da42fdf0a59c93d7f2d61acea1af1

# Diff at Wed, 08 Jan 2025 09:02:13 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x14574b93b408c1c62b3797cd6c5cae25455d1063

# Diff at Fri, 01 Nov 2024 12:09:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      directlyReceivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xa83f2a4915f541e59f2e2cc8c2df59a8580021a4

# Diff at Tue, 29 Oct 2024 13:09:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x61fb244f86d080d0d87c43a9c03ab4d8dcaa1a36

# Diff at Mon, 21 Oct 2024 12:45:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

Generated with discovered.json: 0x7b36ac411a6586d0ef8f189872a49b97aa9b1994

# Diff at Mon, 21 Oct 2024 11:06:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x394317B191f5c7A371e74594776B1EfDc33d10D6"]
      values.$pastUpgrades.0.1:
-        ["0x394317B191f5c7A371e74594776B1EfDc33d10D6"]
+        "0x0c0f24dc018c3729da70c02c63d573dfac8fe99a9937b31da75b64d3ec98c88e"
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x01D5303F326B992845eef2782D4c9a7c6DdE4470"]
      values.$pastUpgrades.0.1:
-        ["0x01D5303F326B992845eef2782D4c9a7c6DdE4470"]
+        "0xf5b7950924dfea5813bc7b14b1e0d19c87cd862ee9717f7d24806b92e57c5ada"
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0xc4550911Df26E604aA560dee6a9b66D0CA933482"]
      values.$pastUpgrades.0.1:
-        ["0xc4550911Df26E604aA560dee6a9b66D0CA933482"]
+        "0x47bceb663a46c76e798b58969b6d6154ea215e03822c2a76faf0caeb34fb2216"
    }
```

```diff
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0xc5c3DF92714aAf510F8dD9a4c9C67D35f7d7376b"]
      values.$pastUpgrades.1.1:
-        ["0xc5c3DF92714aAf510F8dD9a4c9C67D35f7d7376b"]
+        "0x99fc5a58e224a9b519ed673d54b977070cb7093fe0aeb7ac5b2a93b1a541727b"
      values.$pastUpgrades.0.2:
+        ["0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d"]
      values.$pastUpgrades.0.1:
-        ["0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d"]
+        "0x2fcb412e58cba3af863cd4a0397c65bf6347a726aae1d698b79aa30cdaf877fa"
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x3fe449Ef47228F03f979F9D955196494243cdf7E"]
      values.$pastUpgrades.0.1:
-        ["0x3fe449Ef47228F03f979F9D955196494243cdf7E"]
+        "0x8a473670c3340bb6aa707beddf92664cf6d4ac8c79b785a6a0963531ba0e066d"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0xe1863A873f61fDD16560cAa7692a2A994b51E76A"]
      values.$pastUpgrades.0.1:
-        ["0xe1863A873f61fDD16560cAa7692a2A994b51E76A"]
+        "0xabefa8137a3edd703261a62514df2180cfe8251dea6867ab87386a0eb2f94281"
    }
```

Generated with discovered.json: 0x8ab75769eb68db05cdc0a6fd00fe036d7ce3ff09

# Diff at Wed, 16 Oct 2024 11:36:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x28A227d4faF0f4f75897438E24C43EF1CDABb920","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0x4179f43f3b994e97090557363b09F403138a729e","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.7.target:
-        "0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB"
+        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
      receivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.6.target:
-        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
+        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
      receivedPermissions.5.target:
-        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.target:
-        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
+        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.target:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
+        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      receivedPermissions.3.via:
-        [{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
+        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
      receivedPermissions.2.description:
+        "set and change address mappings."
      receivedPermissions.1.target:
-        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.via:
-        [{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
+        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      receivedPermissions.0.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x28A227d4faF0f4f75897438E24C43EF1CDABb920","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
+        "0x84BdFb21ed7C8B332a42bFD595744a84F3101e4E"
      issuedPermissions.1.via.0:
-        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x28A227d4faF0f4f75897438E24C43EF1CDABb920","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

Generated with discovered.json: 0xb5193a0a8da58e7e87f9a0a10377f54bbda5c4de

# Diff at Mon, 14 Oct 2024 10:51:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x373b0cddb16922a75ab98dfce0c4913a0970c018bfa1d55d123d4ff6511179a6"]
    }
```

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x8c104e5ac734cb73cbe75544fcd4f1f7f3bfefd5b61947c5d716d02c89866d64"]
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xf43d12b96b6c43853b7001daea5e33f38797c6847d565052a0edb0b191a665da"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xcec1afd157e4ccd04657ae8c428d6fc2aef84d29e92d58582dc06dcb4f0f2074"]
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x97db8b5a9741ddac67a8c6409fa1e545a9db896a6118f08c76f866f1ff767024"]
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x77dff740c401aa2b4cdb05f0661e7578cdb0cd0aebfd642fb728b3c6a389253c"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x00d8fbe998d6c51cacd085e73a9c76bea61e6cafe5ec4e669d62cf085374ccff"]
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

Generated with discovered.json: 0xb8db3d74396ea39ff7c4d0ced530a247c56a44f2

# Diff at Wed, 09 Oct 2024 13:09:30 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20920155
- current block number: 20920155

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20920155 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      receivedPermissions.1.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

Generated with discovered.json: 0x85ed44f43209ccdfa2ed62fe07d02c6985172b1a

# Diff at Tue, 08 Oct 2024 16:25:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@bca55174129419533cd4173605c170ea99ac6f98 block: 19531626
- current block number: 20920155

## Description

Move to discovery driven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      template:
+        "opstack/L2OutputOracle"
      descriptions:
+        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
    }
```

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      directlyReceivedPermissions.4.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.6.target:
-        "0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB"
+        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      receivedPermissions.5.target:
-        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
+        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
      receivedPermissions.5.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.target:
-        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
+        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
      receivedPermissions.3.target:
-        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.2.target:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
+        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
      receivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.1.target:
-        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
+        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
      receivedPermissions.0.target:
-        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      receivedPermissions.0.via:
-        [{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]
      receivedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      roles:
+        ["Challenger","Guardian"]
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x28A227d4faF0f4f75897438E24C43EF1CDABb920","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
      template:
+        "opstack/SystemConfig"
      descriptions:
+        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      template:
+        "opstack/L1ERC721Bridge"
      descriptions:
+        ["Used to bridge ERC-721 tokens from host chain to this chain."]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
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
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      template:
+        "opstack/L1StandardBridge"
      descriptions:
+        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      categories:
+        ["Gateways&Escrows"]
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      template:
+        "opstack/OptimismPortal"
      descriptions:
+        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      template:
+        "opstack/OptimismMintableERC20Factory"
      descriptions:
+        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
    }
```

Generated with discovered.json: 0xaffe70c7ae82ff9e32ff8bae15e4e3017fe5dbae

# Diff at Tue, 01 Oct 2024 10:51:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-21T07:31:23.000Z",["0x394317B191f5c7A371e74594776B1EfDc33d10D6"]]]
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-21T03:15:11.000Z",["0x01D5303F326B992845eef2782D4c9a7c6DdE4470"]]]
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-21T07:23:35.000Z",["0xc4550911Df26E604aA560dee6a9b66D0CA933482"]]]
    }
```

```diff
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-20T05:04:47.000Z",["0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d"]],["2023-12-21T07:29:11.000Z",["0xc5c3DF92714aAf510F8dD9a4c9C67D35f7d7376b"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-21T07:32:47.000Z",["0x3fe449Ef47228F03f979F9D955196494243cdf7E"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-12-21T07:25:47.000Z",["0xe1863A873f61fDD16560cAa7692a2A994b51E76A"]]]
    }
```

Generated with discovered.json: 0x7247231f22dd6a438b3dfde265a730810bfcfd8f

# Diff at Sun, 08 Sep 2024 17:18:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0:
+        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"configure","target":"0x28A227d4faF0f4f75897438E24C43EF1CDABb920","via":[]}]
      receivedPermissions:
-        [{"permission":"configure","target":"0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"},{"permission":"upgrade","target":"0x0a23342520Aa8Ca963c4201801F4D3E95e731637"},{"permission":"upgrade","target":"0x622333688CC1878C7ff4205c89bDe051798788A7"},{"permission":"upgrade","target":"0x952851CecB07705A5bb483C1CE080F97e1E7491E"},{"permission":"upgrade","target":"0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"},{"permission":"upgrade","target":"0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"},{"permission":"upgrade","target":"0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB"}]
      directlyReceivedPermissions:
+        [{"permission":"configure","target":"0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"},{"permission":"upgrade","target":"0x0a23342520Aa8Ca963c4201801F4D3E95e731637"},{"permission":"upgrade","target":"0x622333688CC1878C7ff4205c89bDe051798788A7"},{"permission":"upgrade","target":"0x952851CecB07705A5bb483C1CE080F97e1E7491E"},{"permission":"upgrade","target":"0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"},{"permission":"upgrade","target":"0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"},{"permission":"upgrade","target":"0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB"}]
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      descriptions:
-        ["It can act on behalf of 0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C, inheriting its permissions."]
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x952851CecB07705A5bb483C1CE080F97e1E7491E","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x622333688CC1878C7ff4205c89bDe051798788A7","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x0a23342520Aa8Ca963c4201801F4D3E95e731637","via":[{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]}
      receivedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
+        "0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"
      receivedPermissions.0.via:
+        [{"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"}]
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0:
+        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0:
+        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0:
+        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0:
+        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0:
+        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"
+        "0x28A227d4faF0f4f75897438E24C43EF1CDABb920"
      issuedPermissions.0.via.0:
+        {"address":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","delay":0}
    }
```

Generated with discovered.json: 0x8fc7f991ce20d3368a42b0c0af4742b42de10fdf

# Diff at Fri, 30 Aug 2024 07:53:11 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
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
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: It can act on behalf of 0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C, inheriting its permissions.
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x638cfcfd30fa8783c39c94c174591fcd22631030

# Diff at Fri, 23 Aug 2024 09:52:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xde2dee83752049b2ca5abfccfeec0a61fb7fb6c9

# Diff at Wed, 21 Aug 2024 10:03:23 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x0a23342520Aa8Ca963c4201801F4D3E95e731637","0x622333688CC1878C7ff4205c89bDe051798788A7","0x952851CecB07705A5bb483C1CE080F97e1E7491E","0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"],"configure":["0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x28A227d4faF0f4f75897438E24C43EF1CDABb920","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9","via":[]},{"permission":"upgrade","target":"0x0a23342520Aa8Ca963c4201801F4D3E95e731637","via":[]},{"permission":"upgrade","target":"0x622333688CC1878C7ff4205c89bDe051798788A7","via":[]},{"permission":"upgrade","target":"0x952851CecB07705A5bb483C1CE080F97e1E7491E","via":[]},{"permission":"upgrade","target":"0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","via":[]},{"permission":"upgrade","target":"0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73","via":[]},{"permission":"upgrade","target":"0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","via":[]}]
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: It can act on behalf of 0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

```diff
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C","via":[]}]
    }
```

Generated with discovered.json: 0xa9a9ea8793479a143a3f05029945ee38b86c5122

# Diff at Fri, 09 Aug 2024 11:59:47 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      assignedPermissions.upgrade.5:
-        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
+        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
      assignedPermissions.upgrade.3:
-        "0x622333688CC1878C7ff4205c89bDe051798788A7"
+        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
      assignedPermissions.upgrade.2:
-        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
+        "0x952851CecB07705A5bb483C1CE080F97e1E7491E"
      assignedPermissions.upgrade.1:
-        "0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"
+        "0x622333688CC1878C7ff4205c89bDe051798788A7"
      assignedPermissions.upgrade.0:
-        "0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3"
+        "0x0a23342520Aa8Ca963c4201801F4D3E95e731637"
    }
```

Generated with discovered.json: 0x4ed5b3030d4e40b45b13146b9beff60c7d8d91d9

# Diff at Fri, 09 Aug 2024 10:09:54 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x0a23342520Aa8Ca963c4201801F4D3E95e731637","0x622333688CC1878C7ff4205c89bDe051798788A7","0x952851CecB07705A5bb483C1CE080F97e1E7491E","0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73"]
      assignedPermissions.owner:
-        ["0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"]
      assignedPermissions.upgrade:
+        ["0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3","0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73","0x0a23342520Aa8Ca963c4201801F4D3E95e731637","0x622333688CC1878C7ff4205c89bDe051798788A7","0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB","0x952851CecB07705A5bb483C1CE080F97e1E7491E"]
      assignedPermissions.configure:
+        ["0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9"]
    }
```

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: It can act on behalf of 0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"]
      assignedPermissions.configure:
+        ["0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C"]
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0xAb86E21e9BFA559B93ca6f783362BFf5504f2cac","0x7E973c8f8aCDb71E4e00A19631739FFBF9748Cd0","0xBcB3EaB21eCe8864aFcC07f7613bD6D8bB5C28d3","0x988378eD49F538104fDBaC1A0ac2Edf9890EA4f2","0x282DB123D1cbf5437c295EA0df0137E5FaDbD117"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xAb86E21e9BFA559B93ca6f783362BFf5504f2cac","0x7E973c8f8aCDb71E4e00A19631739FFBF9748Cd0","0xBcB3EaB21eCe8864aFcC07f7613bD6D8bB5C28d3","0x988378eD49F538104fDBaC1A0ac2Edf9890EA4f2","0x282DB123D1cbf5437c295EA0df0137E5FaDbD117"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x272136412ca595ca8694411b7aad8edf1acac660

# Diff at Thu, 18 Jul 2024 10:31:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@d89fe52cb65d643cef712d1d7910564a7acf2dce block: 19531626
- current block number: 19531626

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19531626 (main branch discovery), not current.

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      descriptions:
+        ["It can act on behalf of 0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C, inheriting its permissions."]
    }
```

Generated with discovered.json: 0x425903034a509368cac295deabcbca75860f4d05

# Diff at Thu, 28 Mar 2024 09:10:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19411993
- current block number: 19531626

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19411993 (main branch discovery), not current.

```diff
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x0a1f7e21850a167f52f38ab6277deb45137398e8

# Diff at Mon, 11 Mar 2024 12:57:34 GMT:

- author: Michał Sobieraj-Jakubiec (<michalsidzej@gmail.com>)
- comparing to: main@64454506aee2b4b4e15b121f096369e92ec4cf20 block: 19324951
- current block number: 19411993

## Description

Update OP stack DA handler

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19324951 (main branch discovery), not current.

```diff
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    +++ description: None
      values.opStackDA.isSequencerSendingBlobTx:
+        false
    }
```

Generated with discovered.json: 0x4994070662bbd95d21b8c9c1ab21761f41503e62

# Diff at Wed, 28 Feb 2024 08:50:37 GMT:

- author: Bartek Kiepuszewski (<bkiepuszewski@gmail.com>)
- current block number: 19324951

## Description

Update discovery to include the multisig threshold.

## Initial discovery

```diff
+   Status: CREATED
    contract L2OutputOracle (0x0a23342520Aa8Ca963c4201801F4D3E95e731637) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x1612F868EbA1cea65ee66bF4A7C75001b0D4065C) {
    }
```

```diff
+   Status: CREATED
    contract KarakMultisig (0x28A227d4faF0f4f75897438E24C43EF1CDABb920) {
    }
```

```diff
+   Status: CREATED
    contract SystemConfig (0x622333688CC1878C7ff4205c89bDe051798788A7) {
    }
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x952851CecB07705A5bb483C1CE080F97e1E7491E) {
    }
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x9BFfA66a8FcAAd7AC9ea7c7d4b9a6fc46777022d) {
    }
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3) {
    }
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xeeCE9CD7Abd1CC84d9dfc7493e7e68079E47eA73) {
    }
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xF04a74899FF4c4410fAF3B5faa29B8Fd199C13DB) {
    }
```

```diff
+   Status: CREATED
    contract AddressManager (0xF2C89960B6D63eC6c61dF3EA8BaFa0a02c26e8C9) {
    }
```
