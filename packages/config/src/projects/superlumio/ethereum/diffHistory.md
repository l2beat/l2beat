Generated with discovered.json: 0x953d5421446a0747def18136828fa8f1d385b3df

# Diff at Tue, 04 Mar 2025 11:26:38 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21637088
- current block number: 21637088

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x984808d7273fbd04ed32a7015b36c164d4e5618c

# Diff at Tue, 04 Mar 2025 10:40:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21637088
- current block number: 21637088

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sinceBlock:
+        16990669
    }
```

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        19314572
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        19314575
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        19314568
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        19314565
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      sinceBlock:
+        19314566
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        19314574
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        19314571
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        19314570
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        19314569
    }
```

Generated with discovered.json: 0xe2ce1d5875131eb32e7e6ee19de23e22a0aeafa0

# Diff at Wed, 26 Feb 2025 10:33:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21637088
- current block number: 21637088

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

Generated with discovered.json: 0x7b9e1443bfca21d7068f4a3b06a1cdb20d169859

# Diff at Fri, 21 Feb 2025 14:11:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21637088
- current block number: 21637088

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xe964a47d63720176060d373b4ae58a9600e38f36

# Diff at Fri, 21 Feb 2025 09:00:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21637088
- current block number: 21637088

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0x1e5e1146485d75fe9df95976bbb559c4957e3b71

# Diff at Mon, 10 Feb 2025 19:04:52 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637088
- current block number: 21637088

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x36359369efaf7d4a1ce8f48166546d5f41a80f07

# Diff at Tue, 04 Feb 2025 12:33:09 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637088
- current block number: 21637088

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.3.permission:
-        "guard"
+        "interact"
      receivedPermissions.3.from:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.3.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.2.from:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.2.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.2.via:
+        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.1.permission:
-        "configure"
+        "guard"
      receivedPermissions.1.from:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.1.description:
-        "set and change address mappings."
      receivedPermissions.1.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xe2c545d8d815f88e832a5000cad0dd2e63192b65

# Diff at Mon, 20 Jan 2025 11:10:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637088
- current block number: 21637088

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637088 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.9.from:
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.8.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.8.from:
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.7.target:
-        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      receivedPermissions.7.from:
+        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      receivedPermissions.6.target:
-        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      receivedPermissions.6.from:
+        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      receivedPermissions.5.target:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.5.from:
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.4.target:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      receivedPermissions.4.from:
+        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      receivedPermissions.3.target:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.3.from:
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.2.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.2.from:
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.1.target:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.1.from:
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.0.target:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.0.from:
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      directlyReceivedPermissions.0.target:
-        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
      directlyReceivedPermissions.0.from:
+        "0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.6.target:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      directlyReceivedPermissions.6.from:
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      directlyReceivedPermissions.5.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      directlyReceivedPermissions.5.from:
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      directlyReceivedPermissions.4.target:
-        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      directlyReceivedPermissions.4.from:
+        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      directlyReceivedPermissions.3.target:
-        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      directlyReceivedPermissions.3.from:
+        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      directlyReceivedPermissions.2.target:
-        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      directlyReceivedPermissions.2.from:
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      directlyReceivedPermissions.1.target:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      directlyReceivedPermissions.1.from:
+        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      directlyReceivedPermissions.0.target:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      directlyReceivedPermissions.0.from:
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
      issuedPermissions.1.to:
+        "0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
      issuedPermissions.1.to:
+        "0xb6E2Eee22b684f6AAb2083097F7E874994bA930e"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

Generated with discovered.json: 0x26cf8a2a75f8a66f95dc0d234775c76fce8d648d

# Diff at Thu, 16 Jan 2025 12:37:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21078678
- current block number: 21637088

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.8:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.7:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.6:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.5:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.4:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.3:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.2:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.1:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.$members.0:
-        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
+        "0x50930d652266EF4127FA3A1906B7Cb9951076628"
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "4 of 9 (44%)"
    }
```

Generated with discovered.json: 0x69a8e73040a7c32c79e2f3e3d31c45e629d36b46

# Diff at Wed, 08 Jan 2025 09:07:11 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21078678
- current block number: 21078678

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078678 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0xcaae15ffe19cc41fb5e0e3ba268e2b013d9c34a5

# Diff at Fri, 01 Nov 2024 12:10:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cd1f0e71bb08ce16b2084a11b768538e8aa6ba8c block: 21078678
- current block number: 21078678

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21078678 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.7.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.4.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions.0.via.0.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

Generated with discovered.json: 0x5217e962e38fd405e40eaa767548cd21f0fd0e0b

# Diff at Wed, 30 Oct 2024 13:13:03 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20770354
- current block number: 21078678

## Description

Conduit MS: Signer added.

## Watched changes

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.7:
+        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
      values.$members.6:
-        "0x4D8007a0E9f293e62E2b0F43C6Cf4C4B9e135BAe"
+        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
      values.$members.5:
-        "0xefCf0c8faFB425997870f845e26fC6cA6EE6dD5C"
+        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
      values.$members.4:
-        "0xa0C600a6e85bf225958FFAcC70B5FDDF9A059038"
+        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
      values.$members.3:
-        "0x3840f487A17A41100DD1Bf0946c34f132a57Fd5f"
+        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
      values.$members.2:
-        "0xa4000bDD2bB92ce6750b31F1eeda47Bd1cB8e6e4"
+        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
      values.$members.1:
-        "0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
+        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
      values.$members.0:
-        "0xF3313C48BD8E17b823d5498D62F37019dFEA647D"
+        "0xA0737fea60F0601A192E3d2c98865A883ab0bda2"
      values.multisigThreshold:
-        "4 of 7 (57%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x4eec49f9e023317087b6f0acb3d01c530b2d2353

# Diff at Tue, 29 Oct 2024 13:18:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta:
+        {"FINALIZATION_PERIOD_SECONDS":{"description":"Challenge period (Number of seconds until a state root is finalized)."}}
    }
```

Generated with discovered.json: 0x30c3f96e75edbbcc57c1efee09eb49e64193a5f9

# Diff at Mon, 21 Oct 2024 12:49:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      descriptions:
-        ["Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."]
      description:
+        "Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function."
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      descriptions:
-        ["Used to bridge ERC-721 tokens from host chain to this chain."]
      description:
+        "Used to bridge ERC-721 tokens from host chain to this chain."
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      descriptions:
-        ["The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."]
      description:
+        "The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals."
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      descriptions:
-        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
      description:
+        "Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      descriptions:
-        ["A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."]
      description:
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      descriptions:
-        ["The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."]
      description:
+        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      descriptions:
-        ["Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."]
      description:
+        "Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address."
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      descriptions:
-        ["Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."]
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots."
    }
```

Generated with discovered.json: 0x30be0d5e16d682f8d891eaed75716425c295c254

# Diff at Mon, 21 Oct 2024 11:10:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades.1.2:
+        ["0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"]
      values.$pastUpgrades.1.1:
-        ["0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"]
+        "0x3b403a7edc0424fc8660fc853602e5229bee91b99835874234266f9e384648ca"
      values.$pastUpgrades.0.2:
+        ["0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"]
      values.$pastUpgrades.0.1:
-        ["0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"]
+        "0x53bf303148a69eda22c6f29f31372131bb2bfe421327ce311c8288fecee8b453"
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades.0.2:
+        ["0xf7110272725E2036fc21294E9468EBD635800381"]
      values.$pastUpgrades.0.1:
-        ["0xf7110272725E2036fc21294E9468EBD635800381"]
+        "0xdef02483fe5ae6b828fbdf7a5507571ff8b84c7366a7a1ff2fdfb58b32ee62d1"
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades.0.2:
+        ["0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"]
      values.$pastUpgrades.0.1:
-        ["0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"]
+        "0xc16982082473ed47dd39f1a749df2b88e5de7e839f73078a6522f0568eaee7c3"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades.0.2:
+        ["0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"]
      values.$pastUpgrades.0.1:
-        ["0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"]
+        "0xbc6397329262295625fd9b6a92aee4238b4b10218c4b5a1c7fd3a215f1b83af2"
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades.0.2:
+        ["0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"]
      values.$pastUpgrades.0.1:
-        ["0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"]
+        "0x071cf08d571356b15dd25a2e1d04c9d546a99a0225a9c1432c488c79b51d1e72"
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades.0.2:
+        ["0x68c36689D9820D78F53CF384D06199b061cc948b"]
      values.$pastUpgrades.0.1:
-        ["0x68c36689D9820D78F53CF384D06199b061cc948b"]
+        "0x8d66763445eafc294b65f30198fc784a5dd37419bc41b103db48d980c56113d2"
    }
```

Generated with discovered.json: 0x286366d93e8ae893c24380dcbaacd76c18ac00e6

# Diff at Wed, 16 Oct 2024 11:40:53 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      roles:
-        ["Challenger","Guardian"]
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xffB004874CbBF8692B5f397B602f4B8a630aeD59","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]}
      receivedPermissions.7.target:
-        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
+        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
      receivedPermissions.7.description:
+        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.6.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
      receivedPermissions.5.target:
-        "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc"
+        "0x9C93982cb4861311179aE216d1B7fD61232DE1f0"
      receivedPermissions.5.description:
-        "upgrading bridge implementation allows to access all funds and change every system component."
      receivedPermissions.4.target:
-        "0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B"
+        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
      receivedPermissions.3.permission:
-        "upgrade"
+        "guard"
      receivedPermissions.3.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b"
+        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
      receivedPermissions.2.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.target:
-        "0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c"
+        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "set and change address mappings."
      receivedPermissions.1.via:
+        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
      receivedPermissions.0.permission:
-        "configure"
+        "challenge"
      receivedPermissions.0.target:
-        "0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc"
+        "0xffB004874CbBF8692B5f397B602f4B8a630aeD59"
      receivedPermissions.0.description:
-        "set and change address mappings."
      receivedPermissions.0.via:
-        [{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9"}]
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "guard"
      issuedPermissions.0.via.0:
-        {"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}]}
      issuedPermissions.1.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
+        "0x5c53f2fF1030C7fbC0616fD5B8fC6bE97aa27e00"
      issuedPermissions.1.via.0:
-        {"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}]}
      issuedPermissions.1:
+        {"permission":"propose","target":"0xb6E2Eee22b684f6AAb2083097F7E874994bA930e","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.via.0:
-        {"address":"0xA6b2b6B6E621482aF877F304D46B94123a942Ae9","delay":0}
    }
```

Generated with discovered.json: 0x66f7214bcfe1fb14aa4634bce5f1ed13f7d2a03b

# Diff at Mon, 14 Oct 2024 10:56:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sourceHashes:
+        ["0x20a2eb4d3677fc8a15e944f7b1843acd01b2e92acdc4c7a7f7a35b07b891149b","0xebfb36a18bcaa176678925149b43fdc5f9f943d98a6405ae1cbc26f4c168ff88"]
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x95c690f70db8f82a05347087d704333c180048757ff015d74a5b186c1b6b24ab"]
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xd7fe53899c31d6d8e73b6724694736dc3c3c4ebc8f4ddbe989fe9d3dba26692d"]
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sourceHashes:
+        ["0xdc86a850f11dc2b5c0472a05d0e3c14f239baf2c3b1ab19631591b0827985380"]
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xc8aea1ad75944084aeb3dc8b5c63135af405055da6baaffde3ed51e92c91e2eb"]
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      sourceHashes:
+        ["0xbfb58685ff2f2f07eaa01a3c4e3c33c97686bfd3ae7c50c49f9da6ef5098cb31","0x79abdbd90460fe2ac0535b5cb7b4c45284322b49a0a090d1c509cdaf35dbc87e"]
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0x29908eb7685943ff431cd384af851ce36a30997bbad880f9b4385bfc3abb86a2"]
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sourceHashes:
+        ["0x2cdcfef705094aaac53d507bad64d27b48ea5a9c11a7fadffacc192aab7a823f","0xcca8986d0789aa489ba57cd234e886bd92cb5a0d477e1f5ae5e6e030e15fb183"]
    }
```

Generated with discovered.json: 0xe097700b121aecacac262152e2fc8a7c66b21b9b

# Diff at Wed, 09 Oct 2024 13:10:47 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@37683e2b3d0587372f886eef49e921277810c8bf block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.via.0.description:
+        "set and change address mappings."
      descriptions:
+        ["Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts."]
    }
```

```diff
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9) {
    +++ description: None
      directlyReceivedPermissions.0.description:
+        "set and change address mappings."
    }
```

Generated with discovered.json: 0x2d80c02ca9c3658d1e72b530108fb9ddf9d96690

# Diff at Tue, 01 Oct 2024 11:10:59 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20770354
- current block number: 20770354

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20770354 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$pastUpgrades:
+        [["2024-02-26T22:00:11.000Z",["0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D"]],["2024-02-26T22:04:23.000Z",["0xfe0651694489eb60Bb93031C9C32318b0E1Fe200"]]]
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      values.$pastUpgrades:
+        [["2024-02-26T22:03:35.000Z",["0xf7110272725E2036fc21294E9468EBD635800381"]]]
    }
```

```diff
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      values.$pastUpgrades:
+        [["2024-02-26T22:05:11.000Z",["0x4662AF45c8A14c63cb90c5a61A8045EE5a35A00D"]]]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      values.$pastUpgrades:
+        [["2024-02-26T22:03:47.000Z",["0xCB163fF84Dfe5380C76cbd9B660d62D9ccE8945C"]]]
    }
```

```diff
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.$pastUpgrades:
+        [["2024-02-26T22:02:47.000Z",["0x4e85732016AFF90b14ea7F39Df04cBcf4ED170eC"]]]
    }
```

```diff
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      values.$pastUpgrades:
+        [["2024-02-26T22:04:47.000Z",["0x68c36689D9820D78F53CF384D06199b061cc948b"]]]
    }
```

Generated with discovered.json: 0xda4b7623d6ddc3ef7d2036f75b8d77252ae778f1

# Diff at Wed, 18 Sep 2024 11:34:50 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20770354

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x6c10d7e5750b21729Eb863Cf89E5b48850E6d97D)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x9bF59F099d4306B52C7624c90B6d5FD75ab8513b)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x9C93982cb4861311179aE216d1B7fD61232DE1f0)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0x9cF613c19371eFf26c94c0d4F62197d2C0ab60bc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xA6b2b6B6E621482aF877F304D46B94123a942Ae9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xccc6Fc5B866D34a7A4C40455a3cCfaa0cbFc145B)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SystemConfig (0xFb252d6199AEfeE6938a1c57213AAd96ecD2650c)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xffB004874CbBF8692B5f397B602f4B8a630aeD59)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```
