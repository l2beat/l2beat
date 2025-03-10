Generated with discovered.json: 0xfa49f0f8601eb9d37f3a518d4d9b659715b45010

# Diff at Tue, 04 Mar 2025 11:26:09 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21872538
- current block number: 21872538

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872538 (main branch discovery), not current.

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0xe85e846e3109d7abae7477a753d1524655396c2a

# Diff at Tue, 04 Mar 2025 10:39:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21872538
- current block number: 21872538

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872538 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        21418005
    }
```

```diff
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E) {
    +++ description: None
      sinceBlock:
+        21418004
    }
```

```diff
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sinceBlock:
+        20233410
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
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        21418004
    }
```

```diff
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        21418005
    }
```

```diff
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        21418005
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
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        21418007
    }
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      sinceBlock:
+        21418007
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      sinceBlock:
+        20573748
    }
```

```diff
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16) {
    +++ description: None
      sinceBlock:
+        21031662
    }
```

```diff
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63) {
    +++ description: None
      sinceBlock:
+        21547470
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        21418005
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        21418004
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        21418006
    }
```

Generated with discovered.json: 0x41b5b2ed137cbd0492bce7a22a0b50dc36401171

# Diff at Wed, 26 Feb 2025 10:32:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21872538
- current block number: 21872538

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872538 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

Generated with discovered.json: 0x08e22fe845d04500df9b8d136c4d929df5dcc23b

# Diff at Fri, 21 Feb 2025 08:59:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21872538
- current block number: 21872538

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21872538 (main branch discovery), not current.

```diff
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

```diff
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

Generated with discovered.json: 0xaf4f1193d931496fa675865a7065094238add87e

# Diff at Tue, 18 Feb 2025 10:03:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aff7e43e1c06f559de916763e04088cc23b3e08e block: 21845212
- current block number: 21872538

## Description

rangeVkeyCommitment, aggregationVkey changed, rollupConfigHash and verifier unchanged.

## Watched changes

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      values.aggregationVkey:
-        "0x008deea30a17c13a2fa7200fa0609b668b1673a3401a3eb7121c2a4692409736"
+        "0x004f113a89b4e8d162197047643c9d710b42a30e7da7052703855d5c4716a81d"
      values.rangeVkeyCommitment:
-        "0x72f2aa2345210ed43468b3084102ca212311b456482025bd0fed05294d3d6138"
+        "0x1dfce47807a22e50513d7a9a130af9de3d1844625b54c4815e46ca5437eb9ba9"
    }
```

Generated with discovered.json: 0x37f149776ddb33fd322cc1d4505433966f005a4d

# Diff at Fri, 14 Feb 2025 14:11:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@166dc249bfa78df836dc8592e4a420bb82432150 block: 21637082
- current block number: 21845212

## Description

vKey and verifier upgrade.

## Watched changes

```diff
-   Status: DELETED
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      values.aggregationVkey:
-        "0x001758559af75612b9d16de030ed47309d7d28fadd3839a3addaa78d2d4e2754"
+        "0x008deea30a17c13a2fa7200fa0609b668b1673a3401a3eb7121c2a4692409736"
      values.rangeVkeyCommitment:
-        "0x39979c7850d2d3f00c30b29a503c80e245af53ce02a1202518ae0d3c1f8691d0"
+        "0x72f2aa2345210ed43468b3084102ca212311b456482025bd0fed05294d3d6138"
      values.rollupConfigHash:
-        "0x60875d3128003350b1726b6a370c2ab6fa8b8ff7802134ed77fb2caa1f1d3db8"
+        "0xb687221eb250467cf026eaaeef39f33ca2af3ebea6c8eaabc7c7a2634d111ccd"
      values.verifier:
-        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.from:
-        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
+        "0x3B6041173B80E77f038f3F2C0f9744f04837185e"
    }
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x3B6041173B80E77f038f3F2C0f9744f04837185e)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63)
    +++ description: None
```

## Source code changes

```diff
...-0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63.sol | 1432 ++++++++++++++++++++
 ...-0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16.sol | 1432 ++++++++++++++++++++
 2 files changed, 2864 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637082 (main branch discovery), not current.

```diff
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      name:
-        "SuccinctGateway"
+        "SP1VerifierGateway"
      description:
-        "This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract."
+        "This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract."
      issuedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
      values.opSuccinctVerifier:
-        ["0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D",false]
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.description:
-        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
+        "holds the power to affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes."
    }
```

Generated with discovered.json: 0xf76688119ca801a5b0d9c0f04894d7301faea09b

# Diff at Mon, 10 Feb 2025 19:04:26 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21637082
- current block number: 21637082

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637082 (main branch discovery), not current.

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0x6ec5c6a7a3b29800edc3dc3172491548defa3cc6

# Diff at Tue, 04 Feb 2025 12:31:51 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21637082
- current block number: 21637082

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637082 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.2.permission:
-        "configure"
+        "interact"
      receivedPermissions.1.permission:
-        "configure"
+        "interact"
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x2d427380ae784be12e7346665a392005750143c3

# Diff at Mon, 20 Jan 2025 11:09:54 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21637082
- current block number: 21637082

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21637082 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E) {
    +++ description: None
      directlyReceivedPermissions.7.target:
-        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      directlyReceivedPermissions.7.from:
+        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      directlyReceivedPermissions.6.target:
-        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      directlyReceivedPermissions.6.from:
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      directlyReceivedPermissions.5.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      directlyReceivedPermissions.5.from:
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      directlyReceivedPermissions.4.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      directlyReceivedPermissions.4.from:
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      directlyReceivedPermissions.3.target:
-        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      directlyReceivedPermissions.3.from:
+        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      directlyReceivedPermissions.2.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      directlyReceivedPermissions.2.from:
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      directlyReceivedPermissions.1.target:
-        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      directlyReceivedPermissions.1.from:
+        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      directlyReceivedPermissions.0.target:
-        "0x51D5C516c818dcf63E67B28cB2516166D8578c06"
      directlyReceivedPermissions.0.from:
+        "0x51D5C516c818dcf63E67B28cB2516166D8578c06"
    }
```

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      issuedPermissions.0.target:
-        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.to:
+        "0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"
      issuedPermissions.0.description:
+        "holds the power to affect the liveness and safety of the bridge - can transfer ownership, add and freeze verifier routes."
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.9.target:
-        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      receivedPermissions.9.from:
+        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      receivedPermissions.8.target:
-        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.8.from:
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.7.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.7.from:
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.6.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.6.from:
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.5.target:
-        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      receivedPermissions.5.from:
+        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      receivedPermissions.4.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      receivedPermissions.4.from:
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      receivedPermissions.3.target:
-        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      receivedPermissions.3.from:
+        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      receivedPermissions.2.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.2.from:
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.1.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.1.from:
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.0.target:
-        "0x51D5C516c818dcf63E67B28cB2516166D8578c06"
      receivedPermissions.0.from:
+        "0x51D5C516c818dcf63E67B28cB2516166D8578c06"
      directlyReceivedPermissions.0.target:
-        "0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"
      directlyReceivedPermissions.0.from:
+        "0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"
    }
```

```diff
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06) {
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
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521) {
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
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
    }
```

```diff
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.1.from:
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.0.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      receivedPermissions.0.from:
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
    }
```

```diff
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF) {
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
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
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
      issuedPermissions.0.description:
+        "can toggle between the optimistic mode and not optimistic (ZK) mode."
    }
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
      receivedPermissions.0.from:
+        "0x397A5f7f3dBd538f23DE225B51f532c34448dA9B"
    }
```

```diff
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.target:
-        "0x9Fb23129982c993743Eb9bB156af8CC8Fa2aC761"
      issuedPermissions.1.to:
+        "0x9Fb23129982c993743Eb9bB156af8CC8Fa2aC761"
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.target:
-        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
      issuedPermissions.0.to:
+        "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A"
    }
```

```diff
    contract OptimismMintableERC20Factory (0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x4a4962275DF8C60a80d3a25faEc5AA7De116A746"
    }
```

Generated with discovered.json: 0x72dbc41fcdadae7a49670a9dfb8db474b913d572

# Diff at Thu, 16 Jan 2025 12:36:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b471de2d691e0c6d99ad89859efde79edd3d4dfb block: 21630146
- current block number: 21637082

## Description

ConduitMultisig signer changes.

## Watched changes

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
+++ description: The verifier contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2024-11-01.
      values.oldVerifier3.1:
-        false
+        true
    }
```

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

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21630146 (main branch discovery), not current.

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
+++ description: The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15.
      values.oldVerifier5:
+        ["0x0000000000000000000000000000000000000000",false]
      fieldMeta.oldVerifier5:
+        {"description":"The prover contract address for SP1, and whether it is frozen (true if frozen). This prover route was frozen on 2025-01-15."}
    }
```

Generated with discovered.json: 0xff38e9b6faa818266f23fb8e14753a64a9cc048e

# Diff at Wed, 15 Jan 2025 13:22:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@1189a75f4d0a644ce19ab86fd322d93dd0ecf4ae block: 21586240
- current block number: 21630146

## Description

Full discovery.

## Watched changes

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      values.aggregationVkey:
-        "0x00d4e72bc998d0528b0722a53bedd9c6f0143c9157af194ad4bb2502e37a496f"
+        "0x001758559af75612b9d16de030ed47309d7d28fadd3839a3addaa78d2d4e2754"
      values.rangeVkeyCommitment:
-        "0x33e3678015df481724af3aac49d000923caeec277027610b1490f857769f9459"
+        "0x39979c7850d2d3f00c30b29a503c80e245af53ce02a1202518ae0d3c1f8691d0"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21586240 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E) {
    +++ description: None
      directlyReceivedPermissions.10:
-        {"permission":"upgrade","target":"0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"}
      directlyReceivedPermissions.9:
-        {"permission":"upgrade","target":"0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f"}
      directlyReceivedPermissions.8:
-        {"permission":"upgrade","target":"0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"}
      directlyReceivedPermissions.7.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
+        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      directlyReceivedPermissions.6.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      directlyReceivedPermissions.5.target:
-        "0xa010dE167788ed7d95c770AC478997D3207236AF"
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      directlyReceivedPermissions.4.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      directlyReceivedPermissions.3.target:
-        "0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9"
+        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      directlyReceivedPermissions.2.target:
-        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      directlyReceivedPermissions.2.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.target:
-        "0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE"
+        "0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521"
      directlyReceivedPermissions.1.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
-   Status: DELETED
    contract DisputeGameFactory (0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
    contract SuccinctGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B) {
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
      name:
-        "SP1VerifierGateway"
+        "SuccinctGateway"
      values.opSuccinctVerifier:
+        ["0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D",false]
    }
```

```diff
    contract ConduitMultisig (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      receivedPermissions.11:
-        {"permission":"upgrade","target":"0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}
      receivedPermissions.10:
-        {"permission":"upgrade","target":"0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]}
      receivedPermissions.9.target:
-        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
+        "0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e"
      receivedPermissions.8.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
+        "0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8"
      receivedPermissions.7.target:
-        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.6.target:
-        "0xa010dE167788ed7d95c770AC478997D3207236AF"
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.5.target:
-        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
+        "0xa010dE167788ed7d95c770AC478997D3207236AF"
      receivedPermissions.4.target:
-        "0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9"
+        "0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A"
      receivedPermissions.2.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.2.target:
-        "0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE"
+        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
      receivedPermissions.2.via:
-        [{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E"}]
      receivedPermissions.2.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
      receivedPermissions.1.target:
-        "0xeBf5859b7646ca9cf8A981613569bF28394F2571"
+        "0xb45440830bd8D288bB2B5B01Be303ae60fc855d8"
      receivedPermissions.1.description:
-        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
+        "can toggle between the optimistic mode and not optimistic (ZK) mode."
    }
```

```diff
-   Status: DELETED
    contract DelayedWETH (0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
-   Status: DELETED
    contract MIPS (0x99F4f5651FF808107A84F279ed8b79e0870F1f39)
    +++ description: None
```

```diff
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E","delay":0}]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0:
-        {"address":"0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E","delay":0}
      values.additionalProposers:
+        ["0xb6c7448Ad01AfAF34217FFd0eCaCf2c29bdc38fE"]
      template:
+        "succinct/OPSuccinct/OPSuccinctL2OutputOracle"
      description:
+        "Contains a list of proposed state roots which Proposers assert to be a result of block execution. The SuccinctL2OutputOracle modifies the L2OutputOracle to support whenNotOptimistic mode, in which a validity proof can be passed as input argument to the proposeL2Output function."
    }
```

```diff
-   Status: DELETED
    contract FaultDisputeGame (0xB6846927447e4764acd53b0b354BEd939f9220d7)
    +++ description: None
```

```diff
    contract SuccinctGatewaySP1Multisig (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "SuccinctGatewaySP1Multisig"
    }
```

```diff
-   Status: DELETED
    contract PreimageOracle (0xE7Fd68F6a389DE7D7C9cFCfCE15486885abeDD44)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xe805B5dD6487f1528CCb204d76d007cB4699aEF3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract PermissionedDisputeGame (0xF27d54dB0587442b01d6036C0F7f67CDaaBa1743)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AnchorStateRegistry (0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract SP1Verifier (0xa27A057CAb1a4798c6242F6eE5b2416B7Cd45E5D)
    +++ description: None
```

Generated with discovered.json: 0xf403cc7f6e4417f0cf53bf159056fb905ed9ab0e

# Diff at Thu, 09 Jan 2025 10:11:31 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 21586240

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x1549Dd6f86f5bBf0b1Bc691407DE64e8104c1544)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x198A8e0c220f29d8aF956e4c8A9E8b552096Ab2E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x396ac7A2e8d0ac12DeDeB6BCeDC31C585e0038FE)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (0x397A5f7f3dBd538f23DE225B51f532c34448dA9B)
    +++ description: This contract is the router for the bridge proofs verification. It stores the mapping between the identifier of the bridge circuit and the address of the onchain verifier contract.
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
    contract AddressManager (0x51D5C516c818dcf63E67B28cB2516166D8578c06)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x6A3444d11cA2697fe4A19AC8995ABDd8Dd301521)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x8F7901A8974198cb62D3B78e79a21988CEBfF7E9)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x96B124841Eff4Ab1b3C1F654D60402a1405fF51A)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract MIPS (0x99F4f5651FF808107A84F279ed8b79e0870F1f39)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0xa010dE167788ed7d95c770AC478997D3207236AF)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OPSuccinctL2OutputOracle (0xb45440830bd8D288bB2B5B01Be303ae60fc855d8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0xB6846927447e4764acd53b0b354BEd939f9220d7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCafEf00d348Adbd57c37d1B77e0619C6244C6878)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xE7Fd68F6a389DE7D7C9cFCfCE15486885abeDD44)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xe805B5dD6487f1528CCb204d76d007cB4699aEF3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xeBf5859b7646ca9cf8A981613569bF28394F2571)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xeDe0D2f74e71bD43459e92D90c434D8cA5E597B8)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0xF27d54dB0587442b01d6036C0F7f67CDaaBa1743)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xf69D0f1faDd169CF7CD2b856cafBba01B1909a3f)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xF8e8E783fa7A5CCDB77EddC3335cDb00066B515e)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```
