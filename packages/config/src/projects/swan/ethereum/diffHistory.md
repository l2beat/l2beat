Generated with discovered.json: 0x3ad5301acdf3ad654368a993698d7a183df9fbb0

# Diff at Tue, 04 Mar 2025 11:26:38 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 20413034
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
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x7522966cea16bbe28c15a9b6db8664240dbe6ba4

# Diff at Tue, 04 Mar 2025 10:40:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 20413034
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
      sinceBlock:
+        20112969
    }
```

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20112966
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20112971
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20112967
    }
```

```diff
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20112955
    }
```

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: None
      sinceBlock:
+        20112954
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        20112959
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20112965
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: None
      sinceBlock:
+        20112956
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20112970
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20112968
    }
```

Generated with discovered.json: 0x3b0c2d278c90c98fd2fdb0a143736bcc3c2dc315

# Diff at Wed, 26 Feb 2025 10:33:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 20413034
- current block number: 20413034

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x15567C4FfD9109795dFf1D9A5233D10aef0738D2) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0xe9edcb6622fe815d8ae49de4c368197670819c57

# Diff at Fri, 21 Feb 2025 14:11:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 20413034
- current block number: 20413034

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xd90d5d1e298e45d63d6e7edcacc057bb19a78d48

# Diff at Fri, 21 Feb 2025 09:00:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 20413034
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
      categories:
-        ["Core"]
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

Generated with discovered.json: 0xf282a8e784096537f348f509ad7dbce4dcc06760

# Diff at Mon, 10 Feb 2025 19:04:52 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 20413034
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
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x9311d992c9b98dae347e6fa6309a3956666c9f3b

# Diff at Tue, 04 Feb 2025 12:33:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 20413034
- current block number: 20413034

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xced6e73004067d25115165964ad507ff361b4b7a

# Diff at Mon, 20 Jan 2025 11:10:13 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 20413034
- current block number: 20413034

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.1.target:
-        "0xb2a5571C23d13Ce16EF3e993FbE8d225D3f67366"
      issuedPermissions.1.to:
+        "0xb2a5571C23d13Ce16EF3e993FbE8d225D3f67366"
      issuedPermissions.0.target:
-        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
      issuedPermissions.0.to:
+        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.1.target:
-        "0xde794bEc196832474f2F218135bFd0f7cA7fb038"
      issuedPermissions.1.to:
+        "0xde794bEc196832474f2F218135bFd0f7cA7fb038"
      issuedPermissions.0.target:
-        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
      issuedPermissions.0.to:
+        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: None
      receivedPermissions.7.target:
-        "0xed7525946A09056C6AaE29941b8323017382050e"
      receivedPermissions.7.from:
+        "0xed7525946A09056C6AaE29941b8323017382050e"
      receivedPermissions.6.target:
-        "0xE9614162C6128ABD7790C65D711CfC43ea842153"
      receivedPermissions.6.from:
+        "0xE9614162C6128ABD7790C65D711CfC43ea842153"
      receivedPermissions.5.target:
-        "0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"
      receivedPermissions.5.from:
+        "0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"
      receivedPermissions.4.target:
-        "0xadE916De67511E5C24af4174Be67143d0dA94959"
      receivedPermissions.4.from:
+        "0xadE916De67511E5C24af4174Be67143d0dA94959"
      receivedPermissions.3.target:
-        "0x504D56cf68f791B45E3A2e895B0e1562f3431328"
      receivedPermissions.3.from:
+        "0x504D56cf68f791B45E3A2e895B0e1562f3431328"
      receivedPermissions.2.target:
-        "0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"
      receivedPermissions.2.from:
+        "0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"
      receivedPermissions.1.target:
-        "0x1c22740A0B4511E11D76434A424487862b593901"
      receivedPermissions.1.from:
+        "0x1c22740A0B4511E11D76434A424487862b593901"
      receivedPermissions.0.target:
-        "0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"
      receivedPermissions.0.from:
+        "0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"
      directlyReceivedPermissions.0.target:
-        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
      directlyReceivedPermissions.0.from:
+        "0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3"
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.target:
-        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
      issuedPermissions.0.to:
+        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.target:
-        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
      issuedPermissions.0.to:
+        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xed7525946A09056C6AaE29941b8323017382050e"
      directlyReceivedPermissions.7.from:
+        "0xed7525946A09056C6AaE29941b8323017382050e"
      directlyReceivedPermissions.6.target:
-        "0xE9614162C6128ABD7790C65D711CfC43ea842153"
      directlyReceivedPermissions.6.from:
+        "0xE9614162C6128ABD7790C65D711CfC43ea842153"
      directlyReceivedPermissions.5.target:
-        "0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"
      directlyReceivedPermissions.5.from:
+        "0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15"
      directlyReceivedPermissions.4.target:
-        "0xadE916De67511E5C24af4174Be67143d0dA94959"
      directlyReceivedPermissions.4.from:
+        "0xadE916De67511E5C24af4174Be67143d0dA94959"
      directlyReceivedPermissions.3.target:
-        "0x504D56cf68f791B45E3A2e895B0e1562f3431328"
      directlyReceivedPermissions.3.from:
+        "0x504D56cf68f791B45E3A2e895B0e1562f3431328"
      directlyReceivedPermissions.2.target:
-        "0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"
      directlyReceivedPermissions.2.from:
+        "0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32"
      directlyReceivedPermissions.1.target:
-        "0x1c22740A0B4511E11D76434A424487862b593901"
      directlyReceivedPermissions.1.from:
+        "0x1c22740A0B4511E11D76434A424487862b593901"
      directlyReceivedPermissions.0.target:
-        "0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"
      directlyReceivedPermissions.0.from:
+        "0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xf63a4f15363b2bfd6f4b412fb494a6d4be8d05ff

# Diff at Wed, 08 Jan 2025 09:07:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x99c7c4b5fe2c5b5a4124ff5dcb79bf08e8342101

# Diff at Fri, 01 Nov 2024 12:24:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      description:
-        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: None
      directlyReceivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0xe306d856e0d6f7df46c65541164f9d71801dec90

# Diff at Tue, 29 Oct 2024 13:18:53 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20413034
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
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0xd97c4e99bf4b0ab5cb01297daf963d9206519eeb

# Diff at Tue, 22 Oct 2024 13:50:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c4e420ffba204be049626040a9ea287e023948f8 block: 20413034
- current block number: 20413034

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20413034 (main branch discovery), not current.

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      template:
-        "opstack/SuperchainConfig"
+        "opstack/SuperchainConfigFake"
      description:
-        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
+        "This is NOT the shared SuperchainConfig of the OP stack Superchain. This SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

Generated with discovered.json: 0x8b011024be2fef96b2e0dfbabd64d9d2cc5ce71a

# Diff at Mon, 21 Oct 2024 12:49:13 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20413034
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
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      descriptions:
-        ["Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."]
      description:
+        "Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system."
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

Generated with discovered.json: 0x4d4f95691591b6fdb34ab86be853ab1d872943d1

# Diff at Mon, 21 Oct 2024 11:10:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20413034
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
      values.$pastUpgrades.0.2:
+        ["0x76A8Eb93D4a200e8594B1ab1021ab5595CDfB57D"]
      values.$pastUpgrades.0.1:
-        ["0x76A8Eb93D4a200e8594B1ab1021ab5595CDfB57D"]
+        "0x03c4be0ca9d421b234b124fc28c74f2877311158d86340b160c73e649bc15b42"
    }
```

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x0092400cf9cbAC5ABD8518960Cb1F90663607630"]
      values.$pastUpgrades.0.1:
-        ["0x0092400cf9cbAC5ABD8518960Cb1F90663607630"]
+        "0x07b366c9ec8510a71e1c453a279dc8cb03c8d681ca860388c07220f51cc2d080"
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0x621729Ef0571a76E438689ec2bC88ee8E3f2Beff"]
      values.$pastUpgrades.0.1:
-        ["0x621729Ef0571a76E438689ec2bC88ee8E3f2Beff"]
+        "0x38552b748b878396f4ca547230550faa88ceaee69f7197dfbac254d0d13947fd"
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x7CDAEa613E1D17e78F24CAF6349bCCf2bC364F0a"]
      values.$pastUpgrades.0.1:
-        ["0x7CDAEa613E1D17e78F24CAF6349bCCf2bC364F0a"]
+        "0x3239bd9f6bb7dabf6cf048b550678631446b40b9def8df22fab9af2626767ffc"
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      values.$pastUpgrades.0.2:
+        ["0x704Ad7cb61f3Ff97F790FAA747279244Eb2a1802"]
      values.$pastUpgrades.0.1:
-        ["0x704Ad7cb61f3Ff97F790FAA747279244Eb2a1802"]
+        "0x0430cefb8557d7b12ec065dc6f0ae7252df7774417256562b675c76e0a5e801a"
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x1606beCd26316B935B2dFE31D57C1C0B39f4f52f"]
      values.$pastUpgrades.0.1:
-        ["0x1606beCd26316B935B2dFE31D57C1C0B39f4f52f"]
+        "0x267bfbcf162e6bcb1007b502ffec469cf37acb159189e50a741072a226386868"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0x351ABA1B5B72E6bA8d530740f073993069e7BC69"]
      values.$pastUpgrades.0.1:
-        ["0x351ABA1B5B72E6bA8d530740f073993069e7BC69"]
+        "0xcf0a39dab8a8a6442cf8fa84fb9caa5491ad2a403249e1695cb80350557aea22"
    }
```

Generated with discovered.json: 0x78428e95ca2f2ad16a83e58c239a94ff30b5ac78

# Diff at Wed, 16 Oct 2024 11:40:56 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20413034
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
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x6197f64902b9275e6815F9A5b641Ed2291A5d39c","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xb2a5571C23d13Ce16EF3e993FbE8d225D3f67366","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
+        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
      issuedPermissions.0.via.0:
-        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x6197f64902b9275e6815F9A5b641Ed2291A5d39c","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
+        "0xde794bEc196832474f2F218135bFd0f7cA7fb038"
      issuedPermissions.1.via.0:
-        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x6197f64902b9275e6815F9A5b641Ed2291A5d39c","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
+        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
      issuedPermissions.0.via.0:
-        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x6197f64902b9275e6815F9A5b641Ed2291A5d39c","via":[{"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.target:
-        "0x6197f64902b9275e6815F9A5b641Ed2291A5d39c"
+        "0x3FcB6E08A960EF52Ec3101A444f71A2Fd964b248"
      issuedPermissions.0.via.0:
-        {"address":"0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3","delay":0}
    }
```

Generated with discovered.json: 0x106f4cf6769403c6d86f0e0fe7f2efe2d0d98769

# Diff at Mon, 14 Oct 2024 10:56:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20413034
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
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0x1cc8a3b7de3d2c54c4706bb3f3015714d3b56647fc9fbfd6f8b068f5f63c1c25"]
    }
```

```diff
    contract L2OutputOracle (0x1c22740A0B4511E11D76434A424487862b593901) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x025c187b0231be4785898f25f98d749f953f5d06781772aef242812e2ecf52e3"]
    }
```

```diff
    contract L1ERC721Bridge (0x1Ccf7e62889E6A93413DEAFC4e390Bd4047bDC32) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x482ec6e91304ac39a3fb4505634427bddfddee23b8e93a4f7f995ca5083ae3c3"]
    }
```

```diff
    contract SystemConfig (0x504D56cf68f791B45E3A2e895B0e1562f3431328) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xdf9a11b46747139bfe0135df8a65a2728a2dbd60a689e2398c45627915cdd752"]
    }
```

```diff
    contract AddressManager (0x55Aec4EE11dA7d655565cCc2EB3bF21a46C94e6f) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract Swan Network Multisig (0x6197f64902b9275e6815F9A5b641Ed2291A5d39c) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract SuperchainConfig (0xadE916De67511E5C24af4174Be67143d0dA94959) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x3ac96c9c95e25f689f65a50f24b325e3f891029cb1cea96dc642418bbb535b1d"]
    }
```

```diff
    contract OptimismPortal (0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0xe35fb7bc0433439337b3eadda3d6fb7991918162f62a337a695e8c7f948cdd35"]
    }
```

```diff
    contract ProxyAdmin (0xCc8c55Ec2Ea3F3001C049eC934e72b55cf52fBf3) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xE9614162C6128ABD7790C65D711CfC43ea842153) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x7913a1d7d0c47796c94eb6f8fd87a89ae9f2716eda57c9be4fd2b27c70bed617","0x4c5ac4e53576924cabbd2a471f368a541bc3f4b1f53fa41a389692fcc62f6176"]
    }
```

```diff
    contract L1StandardBridge (0xed7525946A09056C6AaE29941b8323017382050e) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x1010ff7f40ab4d53e6d9996aefa04423dabe9d0e22fac2d02b330ed3aa2c5740"]
    }
```

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
