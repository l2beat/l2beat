Generated with discovered.json: 0x998cddef849b621580aae93d180fb74b56479a62

# Diff at Thu, 06 Mar 2025 14:25:01 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@454ef41fea41bcea030780b23fd1f11519ff78d2 block: 312801994
- current block number: 312801994

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 312801994 (main branch discovery), not current.

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      values.isPostBoLD:
+        false
    }
```

Generated with discovered.json: 0x19a84e8ae8cf7000661cb195320160e590e23789

# Diff at Thu, 06 Mar 2025 09:38:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7119c715545bc86a4194761f42815f811ac6307a block: 287773244
- current block number: 312801994

## Description

Config related: set severity for arbitrum inbox/outbox changes to high.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773244 (main branch discovery), not current.

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
+++ description: All Inboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.inboxHistory:
+        ["0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0xb29Eb9859E5eac993EDD1ABE2c3AF6A12A4D4cbF"]
+++ description: All Outboxes that were ever set as allowed in the bridge.
+++ severity: HIGH
      values.outboxHistory:
+        ["0x575d32f7ff0C72921645e302cb14d2757E300786","0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29"]
      fieldMeta:
+        {"allowedOutboxList":{"severity":"HIGH","description":"Can make calls as the bridge, steal all funds."},"outboxHistory":{"severity":"HIGH","description":"All Outboxes that were ever set as allowed in the bridge."},"allowedDelayedInboxList":{"severity":"HIGH","description":"Allowed to mint the gastoken on L2 and call `enqueueDelayedMessage()` on the bridge."},"inboxHistory":{"severity":"HIGH","description":"All Inboxes that were ever set as allowed in the bridge."}}
    }
```

Generated with discovered.json: 0xc0c89b8a7a417394b88ba532634e8e0a81f3a3d4

# Diff at Tue, 04 Mar 2025 10:40:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 287773244
- current block number: 287773244

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773244 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      sinceBlock:
+        200380586
    }
```

```diff
    contract SankoOftMultisig (0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185) {
    +++ description: None
      sinceBlock:
+        103897675
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      sinceBlock:
+        200380586
    }
```

```diff
    contract OneStepProverMath (0x29E1631710Fa96920eB2F65EaD4B1F270daB59cB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264448543
    }
```

```diff
    contract OneStepProverMemory (0x2D81591AfB19e1a1C1c932303790370c7257f454) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264448537
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      sinceBlock:
+        200380586
    }
```

```diff
    contract RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      sinceBlock:
+        200380586
    }
```

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      sinceBlock:
+        250552058
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      sinceBlock:
+        200380586
    }
```

```diff
    contract OneStepProver0 (0x5C864714456935f05cd74D78CFE05Bcc726CddEe) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264448532
    }
```

```diff
    contract OneStepProofEntry (0x5D1E3dC946fC8F2DD6C96C018e5a120CC2b76368) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264448557
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      sinceBlock:
+        200380586
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      sinceBlock:
+        200380586
    }
```

```diff
    contract GatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      sinceBlock:
+        200380636
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sinceBlock:
+        200380586
    }
```

```diff
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    +++ description: This contract implements view only utilities for validators.
      sinceBlock:
+        167664692
    }
```

```diff
    contract OrbitProxyOFT1_2 (0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29) {
    +++ description: OFT Adapter contract using the LayerZero v1 AMB for messaging. This contract can mint tokens on Sanko and steal tokens from the canonical bridge escrow. Its security depends on LayerZero v1 security.
      sinceBlock:
+        261673366
    }
```

```diff
    contract ERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      sinceBlock:
+        200380636
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      sinceBlock:
+        200380586
    }
```

```diff
    contract OneStepProverHostIo (0xE13987CcaFD999397021222630DEC78BaAa9fE15) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      sinceBlock:
+        264448550
    }
```

Generated with discovered.json: 0x5f652278a659badfc246d9551e0fe934144aaa76

# Diff at Thu, 27 Feb 2025 11:47:37 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@a4b50e45bb44f8ceeea29f9236088d26a843c885 block: 287773244
- current block number: 287773244

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773244 (main branch discovery), not current.

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "ERC20Bridge"
+        "Bridge"
      displayName:
-        "Bridge"
    }
```

```diff
    contract RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      name:
-        "ERC20RollupEventInbox"
+        "RollupEventInbox"
      displayName:
-        "RollupEventInbox"
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "ERC20Outbox"
+        "Outbox"
      displayName:
-        "Outbox"
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "ERC20Inbox"
+        "Inbox"
      displayName:
-        "Inbox"
    }
```

```diff
    contract GatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      name:
-        "L1OrbitGatewayRouter"
+        "GatewayRouter"
      displayName:
-        "GatewayRouter"
    }
```

```diff
    contract ERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      name:
-        "L1OrbitERC20Gateway"
+        "ERC20Gateway"
      displayName:
-        "ERC20Gateway"
    }
```

Generated with discovered.json: 0x24a31ba97da29a5344183ca709e58e21318b06b5

# Diff at Fri, 21 Feb 2025 14:12:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 287773244
- current block number: 287773244

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773244 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ERC20Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract ERC20Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x8c3e697ef97396fab764572d91ba5eb54f43130a

# Diff at Tue, 04 Feb 2025 12:33:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 287773244
- current block number: 287773244

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773244 (main branch discovery), not current.

```diff
    contract SankoOftMultisig (0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract OrbitProxyOFT1_2 (0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29) {
    +++ description: OFT Adapter contract using the LayerZero v1 AMB for messaging. This contract can mint tokens on Sanko and steal tokens from the canonical bridge escrow. Its security depends on LayerZero v1 security.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0x6bbab32db25c1e1286a44bb774b8356515f8a389

# Diff at Mon, 20 Jan 2025 11:10:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 287773244
- current block number: 287773244

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773244 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
    contract SankoOftMultisig (0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185) {
    +++ description: None
      receivedPermissions.0.target:
-        "0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29"
      receivedPermissions.0.from:
+        "0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29"
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.1.via.1.delay:
-        0
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.target:
-        "0x2f4dDaD3aB0AC4225fd8023EE07d04e2A758017a"
      issuedPermissions.0.to:
+        "0x2f4dDaD3aB0AC4225fd8023EE07d04e2A758017a"
      issuedPermissions.0.description:
+        "Can submit transaction batches or commitments to the SequencerInbox contract on the host chain."
    }
```

```diff
    contract ERC20Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      receivedPermissions.10.target:
-        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
      receivedPermissions.10.from:
+        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
      receivedPermissions.9.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      receivedPermissions.9.from:
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      receivedPermissions.8.target:
-        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      receivedPermissions.8.from:
+        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      receivedPermissions.7.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.7.from:
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.6.target:
-        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      receivedPermissions.6.from:
+        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      receivedPermissions.5.target:
-        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      receivedPermissions.5.from:
+        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      receivedPermissions.4.target:
-        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      receivedPermissions.4.from:
+        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      receivedPermissions.3.target:
-        "0x2f285781B8d58678a3483de52D618198E4d27532"
      receivedPermissions.3.from:
+        "0x2f285781B8d58678a3483de52D618198E4d27532"
      receivedPermissions.2.target:
-        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      receivedPermissions.2.from:
+        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      receivedPermissions.1.target:
-        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
      receivedPermissions.1.from:
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
      receivedPermissions.0.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      receivedPermissions.0.from:
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      directlyReceivedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      directlyReceivedPermissions.0.from:
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

```diff
    contract ERC20Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
    contract ERC20Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      directlyReceivedPermissions.2.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      directlyReceivedPermissions.2.from:
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      directlyReceivedPermissions.1.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      directlyReceivedPermissions.1.from:
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      directlyReceivedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
      directlyReceivedPermissions.0.from:
+        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4.target:
-        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
      issuedPermissions.4.to:
+        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
      issuedPermissions.4.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.3.target:
-        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
      issuedPermissions.3.to:
+        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
      issuedPermissions.3.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.2.target:
-        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
      issuedPermissions.2.to:
+        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
      issuedPermissions.2.description:
+        "Can propose new state roots (called nodes) and challenge state roots on the host chain."
      issuedPermissions.1.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.description:
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract OrbitProxyOFT1_2 (0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29) {
    +++ description: OFT Adapter contract using the LayerZero v1 AMB for messaging. This contract can mint tokens on Sanko and steal tokens from the canonical bridge escrow. Its security depends on LayerZero v1 security.
      issuedPermissions.0.target:
-        "0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185"
      issuedPermissions.0.to:
+        "0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185"
      issuedPermissions.0.description:
+        "Can change security parameters of the DMT token (Sanko gas token) and its OFT adapters (LayerZero). This includes the permission to mint unlimited tokens or steal tokens in the canonical bridge escrow."
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1.delay:
-        0
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
      directlyReceivedPermissions.8.from:
+        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
      directlyReceivedPermissions.7.target:
-        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      directlyReceivedPermissions.7.from:
+        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      directlyReceivedPermissions.6.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      directlyReceivedPermissions.6.from:
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      directlyReceivedPermissions.5.target:
-        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      directlyReceivedPermissions.5.from:
+        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      directlyReceivedPermissions.4.target:
-        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      directlyReceivedPermissions.4.from:
+        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      directlyReceivedPermissions.3.target:
-        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      directlyReceivedPermissions.3.from:
+        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      directlyReceivedPermissions.2.target:
-        "0x2f285781B8d58678a3483de52D618198E4d27532"
      directlyReceivedPermissions.2.from:
+        "0x2f285781B8d58678a3483de52D618198E4d27532"
      directlyReceivedPermissions.1.target:
-        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      directlyReceivedPermissions.1.from:
+        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      directlyReceivedPermissions.0.target:
-        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
      directlyReceivedPermissions.0.from:
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
    }
```

Generated with discovered.json: 0x3cf33e0c9d87d880a7f1f7fd194a9e0c9a9a44de

# Diff at Wed, 08 Jan 2025 10:45:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@20bf0eaa1dce373e2c004314fef59d2d1bdf5502 block: 287773244
- current block number: 287773244

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 287773244 (main branch discovery), not current.

```diff
    contract ERC20Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      description:
-        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
+        "Escrow contract for the project's gas token (can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

Generated with discovered.json: 0x10d9b304bbffde1de9d9cc62fd4de31cb41fc1c6

# Diff at Mon, 23 Dec 2024 12:54:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18325a975c44684702f30ee366361589e4c2ed8c block: 278532431
- current block number: 287773244

## Description

Config related: Celestia-Nitro wmroot added.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278532431 (main branch discovery), not current.

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      usedTypes.0.arg.0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287:
+        "Celestia Nitro 3.2.1 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x6c4a00cf6d114e61a3e11767bb5ea818c3c03fa4

# Diff at Thu, 05 Dec 2024 12:02:55 GMT:

- author: Piotr Szlachciak (<szlachciak.piotr@gmail.com>)
- comparing to: main@f9ded76f7930b0c86788e4c4595d553b165b87d1 block: 278532431
- current block number: 278532431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278532431 (main branch discovery), not current.

```diff
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    +++ description: This contract implements view only utilities for validators.
      template:
+        "orbitstack/ValidatorUtils"
      description:
+        "This contract implements view only utilities for validators."
    }
```

Generated with discovered.json: 0x180fb2aad68a50d5ad3915d8c909673adf3a55ac

# Diff at Fri, 29 Nov 2024 11:28:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9776abb8b1f960f6f1ec6ec27558b5eff7eb5b87 block: 278532431
- current block number: 278532431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278532431 (main branch discovery), not current.

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.0.via.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
+        "Pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x6984e42a6b04c35000f65ca8f45d0bee77d86bea

# Diff at Fri, 29 Nov 2024 09:31:38 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c60f4ba86fcd7b86d6876d1634b83081095f33d7 block: 278532431
- current block number: 278532431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278532431 (main branch discovery), not current.

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]}
      receivedPermissions.9.target:
-        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      receivedPermissions.9.via.1:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.9.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.8.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
+        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      receivedPermissions.8.via.1:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.8.via.0.address:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
      receivedPermissions.7.target:
-        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.6.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      receivedPermissions.5.target:
-        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
+        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      receivedPermissions.4.target:
-        "0x575d32f7ff0C72921645e302cb14d2757E300786"
+        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      receivedPermissions.3.target:
-        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
+        "0x2f285781B8d58678a3483de52D618198E4d27532"
      receivedPermissions.2.target:
-        "0x2f285781B8d58678a3483de52D618198E4d27532"
+        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      receivedPermissions.1.target:
-        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      receivedPermissions.0.via.1:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
+        {"permission":"validate","target":"0x964C83a66F78b67F75f076e386C433A1a10cefDB","via":[]}
      issuedPermissions.3.target:
-        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
+        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
      issuedPermissions.2.target:
-        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
+        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
      issuedPermissions.1.permission:
-        "validate"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.1.via.0:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0}
      issuedPermissions.0.permission:
-        "upgrade"
+        "configure"
      issuedPermissions.0.via.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability, DACs and the fastConfirmer role, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

Generated with discovered.json: 0x85d767346d91de6b36db4f1f5b5821850c0e271b

# Diff at Thu, 28 Nov 2024 11:03:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@4e0645053ebfcfcef2e7fd8c8410bad53373a3c4 block: 278532431
- current block number: 278532431

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 278532431 (main branch discovery), not current.

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.4:
-        {"permission":"validate","target":"0x964C83a66F78b67F75f076e386C433A1a10cefDB","via":[]}
      issuedPermissions.3.target:
-        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
+        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
      issuedPermissions.2.target:
-        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
+        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
      issuedPermissions.1.permission:
-        "upgrade"
+        "validate"
      issuedPermissions.1.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
+        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
      issuedPermissions.1.via.0:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0}
      issuedPermissions.0.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.0.target:
-        "0x0000000000000000000000000000000000000000"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.0:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0}
    }
```

Generated with discovered.json: 0xe1d5040a8e26447582f44e236d052687cd1df9d0

# Diff at Wed, 27 Nov 2024 13:44:45 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 277109146
- current block number: 278532431

## Description

Move to discodriven data.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 277109146 (main branch discovery), not current.

```diff
    contract SankoOftMultisig (0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","target":"0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29","description":"Can change security parameters of the DMT token (Sanko gas token) and its OFT adapters (LayerZero). This includes the permission to mint unlimited tokens or steal tokens in the canonical bridge escrow."}]
    }
```

```diff
    contract ERC20Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      name:
-        "Bridge"
+        "ERC20Bridge"
      displayName:
+        "Bridge"
    }
```

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]}
      receivedPermissions.9.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
+        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
      receivedPermissions.9.via.1:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.9.via.0.address:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
      receivedPermissions.8.target:
-        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      receivedPermissions.8.via.1:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.8.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.7.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      receivedPermissions.6.target:
-        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.5.target:
-        "0x575d32f7ff0C72921645e302cb14d2757E300786"
+        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      receivedPermissions.4.target:
-        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
+        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      receivedPermissions.3.target:
-        "0x2f285781B8d58678a3483de52D618198E4d27532"
+        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      receivedPermissions.2.target:
-        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
+        "0x2f285781B8d58678a3483de52D618198E4d27532"
      receivedPermissions.1.target:
-        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
+        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      receivedPermissions.0.permission:
-        "configure"
+        "upgrade"
      receivedPermissions.0.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
      receivedPermissions.0.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
      receivedPermissions.0.via.1:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.0.via.0.address:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
    }
```

```diff
    contract ERC20Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      name:
-        "Outbox"
+        "ERC20Outbox"
      displayName:
+        "Outbox"
    }
```

```diff
    contract ERC20Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      name:
-        "Inbox"
+        "ERC20Inbox"
      displayName:
+        "Inbox"
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
-        {"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"}
      directlyReceivedPermissions.1.permission:
-        "configure"
+        "upgrade"
      directlyReceivedPermissions.1.description:
-        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      template:
-        "orbitstack/RollupProxy"
+        "orbitstack/RollupProxy_fastConfirm"
      issuedPermissions.0.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
+        "0x0000000000000000000000000000000000000000"
      issuedPermissions.0.via.0:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      fieldMeta.minimumAssertionPeriod:
+        {"description":"Minimum time delta between newly created nodes (stateUpdates). This is checked on `stakeOnNewNode()`. Format is number of ETHEREUM blocks, even for L3s. "}
    }
```

```diff
    contract OrbitProxyOFT1_2 (0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29) {
    +++ description: OFT Adapter contract using the LayerZero v1 AMB for messaging. This contract can mint tokens on Sanko and steal tokens from the canonical bridge escrow. Its security depends on LayerZero v1 security.
      description:
+        "OFT Adapter contract using the LayerZero v1 AMB for messaging. This contract can mint tokens on Sanko and steal tokens from the canonical bridge escrow. Its security depends on LayerZero v1 security."
      issuedPermissions:
+        [{"permission":"configure","target":"0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185","via":[]}]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.
      template:
+        "orbitstack/ERC20Gateway"
      displayName:
+        "ERC20Gateway"
      description:
+        "Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract."
    }
```

Generated with discovered.json: 0xdf3d486e4fa488630360d2ef25cf7ac6cdf6975e

# Diff at Fri, 22 Nov 2024 11:06:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@47360b3fe185e6a526c31e0dfe4ad128b9d7db9f block: 268839192
- current block number: 277109146

## Description

Multisig member removed.

## Watched changes

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      values.$members.5:
-        "0x45931634c4496e9cdc3d0cCA700A387d581b6009"
      values.$members.4:
-        "0x201598e7F51dD57FF41a1743aBd5892EaFED97a0"
+        "0x45931634c4496e9cdc3d0cCA700A387d581b6009"
      values.$members.3:
-        "0xC75725f4644D54865d11B78d3Ca6b7779FA61581"
+        "0x201598e7F51dD57FF41a1743aBd5892EaFED97a0"
      values.$members.2:
-        "0x4919167EA334BE84B1604Cbc82A26A7746D5943e"
+        "0xC75725f4644D54865d11B78d3Ca6b7779FA61581"
      values.multisigThreshold:
-        "4 of 6 (67%)"
+        "4 of 5 (80%)"
    }
```

Generated with discovered.json: 0x80431a0161106f0270f1a1d7fe67cdf52bba035e

# Diff at Fri, 15 Nov 2024 08:18:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a00c2a67d12a174a45864b549412045028598606 block: 268839192
- current block number: 268839192

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 268839192 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      fieldMeta.maxTimeVariation.description:
-        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after the `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging.
      template:
+        "orbitstack/Bridge"
      description:
+        "Escrow contract for the project's gas token (Can be different from ETH). Keeps a list of allowed Inboxes and Outboxes for canonical bridge messaging."
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: Helper contract sending configuration data over the bridge during the systems initialization.
      template:
+        "orbitstack/RollupEventInbox"
      displayName:
+        "RollupEventInbox"
      description:
+        "Helper contract sending configuration data over the bridge during the systems initialization."
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control permissions for upgrading the system contract implementations.
      description:
-        "Central contract defining the access control for upgrading the system contract implementations."
+        "Central contract defining the access control permissions for upgrading the system contract implementations."
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging.
      template:
+        "orbitstack/GatewayRouter"
      displayName:
+        "GatewayRouter"
      description:
+        "This routing contract maps tokens to the correct escrow (gateway) to be then bridged with canonical messaging."
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.7:
-        {"permission":"upgrade","target":"0x420B4d16119127E4b96E55CB8a9D0c2828a161BB","via":[{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0}]}
      issuedPermissions.6:
-        {"permission":"propose","target":"0x964C83a66F78b67F75f076e386C433A1a10cefDB","via":[]}
      issuedPermissions.5:
-        {"permission":"propose","target":"0x839ed36E86D36328c687a211CBe36C271065BAfD","via":[]}
      issuedPermissions.4.permission:
-        "propose"
+        "validate"
      issuedPermissions.4.target:
-        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
+        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
      issuedPermissions.3.permission:
-        "configure"
+        "validate"
      issuedPermissions.3.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
+        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
      issuedPermissions.3.via.0:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
      issuedPermissions.2.permission:
-        "challenge"
+        "validate"
      issuedPermissions.2.target:
-        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
+        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
      issuedPermissions.1.permission:
-        "challenge"
+        "upgrade"
      issuedPermissions.1.target:
-        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.1.via.0:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0}
      issuedPermissions.0.permission:
-        "challenge"
+        "configure"
      issuedPermissions.0.target:
-        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.0:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0x2266745bee76f009b5cda8982d27f8212c6b664e

# Diff at Mon, 04 Nov 2024 08:10:16 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@950c85bf556f084c302d2b03100375cf3c7ed376 block: 268839192
- current block number: 268839192

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 268839192 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
+++ description: Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
      values.postsBlobs:
+        false
      fieldMeta.maxTimeVariation.description:
-        "Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
+        "Settable by the Rollup Owner. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."
    }
```

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]}
      receivedPermissions.9.target:
-        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      receivedPermissions.9.via.1:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.9.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.8.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
+        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      receivedPermissions.8.via.1:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.8.via.0.address:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
      receivedPermissions.7.target:
-        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.6.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      receivedPermissions.5.target:
-        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
+        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      receivedPermissions.4.target:
-        "0x575d32f7ff0C72921645e302cb14d2757E300786"
+        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      receivedPermissions.3.target:
-        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
+        "0x2f285781B8d58678a3483de52D618198E4d27532"
      receivedPermissions.2.target:
-        "0x2f285781B8d58678a3483de52D618198E4d27532"
+        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      receivedPermissions.1.target:
-        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
      receivedPermissions.0.permission:
-        "upgrade"
+        "configure"
      receivedPermissions.0.target:
-        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
+        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
      receivedPermissions.0.via.1:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}
      receivedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions.0.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      directlyReceivedPermissions.2:
+        {"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"}
      directlyReceivedPermissions.1.permission:
-        "upgrade"
+        "configure"
      directlyReceivedPermissions.1.description:
+        "can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.7:
+        {"permission":"upgrade","target":"0x420B4d16119127E4b96E55CB8a9D0c2828a161BB","via":[{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0}]}
      issuedPermissions.6.permission:
-        "upgrade"
+        "propose"
      issuedPermissions.6.target:
-        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
+        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
      issuedPermissions.6.via.0:
-        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0}
      issuedPermissions.5.target:
-        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
+        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
      issuedPermissions.4.target:
-        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
+        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
      issuedPermissions.3.permission:
-        "propose"
+        "configure"
      issuedPermissions.3.target:
-        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.3.via.0:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0,"description":"can pause and unpause and set important roles and parameters in the system contracts: Can delegate Sequencer management to a BatchPosterManager address, manage data availability and DACs, set the Sequencer-only window, introduce an allowList to the bridge and whitelist Inboxes/Outboxes."}
    }
```

Generated with discovered.json: 0xe3bca518a262a0c8e4eb026f155ce5e1db853d79

# Diff at Tue, 29 Oct 2024 13:22:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7b3fc9dc9074e1d423b48522c3f0273c86aab54a block: 268780411
- current block number: 268839192

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 268780411 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract OneStepProverMath (0x29E1631710Fa96920eB2F65EaD4B1F270daB59cB) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMemory (0x2D81591AfB19e1a1C1c932303790370c7257f454) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1.
      description:
-        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) eventually resolve in execution on L1."
    }
```

```diff
    contract OneStepProver0 (0x5C864714456935f05cd74D78CFE05Bcc726CddEe) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProofEntry (0x5D1E3dC946fC8F2DD6C96C018e5a120CC2b76368) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      fieldMeta.confirmPeriodBlocks.description:
-        "Challenge period. (Number of blocks until a node is confirmed)."
+        "Challenge period. (Number of ETHEREUM blocks until a node is confirmed, even for L3s)."
    }
```

```diff
    contract OneStepProverHostIo (0xE13987CcaFD999397021222630DEC78BaAa9fE15) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0x815af2d018bac5737f00eb53371bd2d1d8c86551

# Diff at Tue, 29 Oct 2024 08:53:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dd2750779d294ea31d352eac7a7f2e0e655f6440 block: 268780411
- current block number: 268780411

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 268780411 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.1.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.1.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0x24B68936C13A414cd91437aE7AA730321B9ff159","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0x2f285781B8d58678a3483de52D618198E4d27532","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0x365ce7234CE515c2e0139f3578b6c5989da1a863","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0x575d32f7ff0C72921645e302cb14d2757E300786","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4","via":[{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]},{"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"},{"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"}]
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]},{"permission":"upgrade","target":"0x24B68936C13A414cd91437aE7AA730321B9ff159","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]},{"permission":"upgrade","target":"0x2f285781B8d58678a3483de52D618198E4d27532","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]},{"permission":"upgrade","target":"0x365ce7234CE515c2e0139f3578b6c5989da1a863","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]},{"permission":"upgrade","target":"0x575d32f7ff0C72921645e302cb14d2757E300786","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]},{"permission":"upgrade","target":"0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]},{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]},{"permission":"upgrade","target":"0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]},{"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"},{"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}]
      directlyReceivedPermissions.1:
+        {"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"}
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      issuedPermissions.6.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.6.via.0:
+        {"address":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","delay":0}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
      issuedPermissions.0.via.1:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      issuedPermissions.0.via.0.address:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
    }
```

Generated with discovered.json: 0x5274840254214b71700dc17d94757e7c7e37c12c

# Diff at Tue, 29 Oct 2024 05:31:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9545db26ac342c1f6a432443f18ae63a0ab49007 block: 267471544
- current block number: 268780411

## Description

Sanko upgrades to the latest [ArbOS v32](https://docs.arbitrum.io/run-arbitrum-node/arbos-releases/arbos32).

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProver0 (0x19c077b3269D988f87DBe3E0FAE2937a3aA37De4)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      template:
-        "orbitstack/ChallengeManager"
      sourceHashes.1:
-        "0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"
+        "0x1a095768302d7d1c3d02375eaa3341833b4f1aaac707e1c608bce478c87cbf27"
      description:
-        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
      values.$implementation:
-        "0x63AB51383384a09734b8B8F6646647213bdD54aC"
+        "0xDb755eded17cF955C78B70C3946351C9Dd28Eb14"
      values.$pastUpgrades.2:
+        ["2024-10-26T07:30:54.000Z","0x77a1d7089bb6294a3db7e7666b639d5c9d3ccc96ade865bf8c746bbb6d50aa18",["0xDb755eded17cF955C78B70C3946351C9Dd28Eb14"]]
      values.$upgradeCount:
-        2
+        3
      values.osp:
-        "0xc78778b1D7416FB8211e864dBA3e277DF39f2c71"
+        "0x5D1E3dC946fC8F2DD6C96C018e5a120CC2b76368"
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      values.dacKeyset.requiredSignatures:
-        1
+        2
      values.dacKeyset.membersCount:
-        1
+        3
      values.dacKeyset.blsSignatures.2:
+        "YAmzm1YxVZXP20AOM0Knc2gRdNzux0yK3jevjCUcvPu7HxO5YA2L/LTdA5x8rXzOgBE/NQshfpla3sXps7Fy6kqzG4TgatKowxqjmUykc7xEd0vZIwmt/gQNuRxpSS5U4BHrkm1N05QXHUNwbDbXaklRazFHiO0DCbVa2MpwWRKxQUFfrWTt9o84QVUWPzr/+QFH1fNxAIWFj/MgOdOKOa8huL3c2HMOXUUPne5Jzf5hZYlVndUJZ9aKm1Oe8H/cNRRiHN4zFfPcWYD0OQeW3qlVaTulMWxGtXX23MyyJlcRBd0m/UdiYPvwepvLRBwhhxaLGGctsLIBtbDwfsnl2WcA3Mo1OdWBqVFsirfPVnBYQie0+dCcWfPCi4ATbu4rgg=="
      values.dacKeyset.blsSignatures.1:
+        "YBermx2JgluR6LOr3uddo6T6q/KNIWUnA6MDPaROfi3h4JFGLH0mIfprfjiOaQQqLwJJIMLkcAeDOn+X2USQE1VRRm93ppYJ5JO8JfTJ7m2o6wUdeq95C/bsjgUTnDrY4QAQHRPczi8UplQhDFmmsKQGlv3647YodoPunLwX/gQQrDxxUgRXlkedUkn62lCvVAL3wwwWImQoyzwAyD0vYt6wTK/Z3sv2vk36mwf8IUypZEzU7F4fKV2DFBlMruUlHwWdLhEm45sZzPalDEM12LUq1+5Y+5xeodsa/Ar8d/ZTlgJp617XZ7fMEu1zPQiWvBM6Xr2ALWsfoBXDgft8wuCGoViBx5PQaRiYHlWCTI2YbPyUEhbBY/G3NMvcibPIWg=="
      values.keySetUpdates:
-        1
+        2
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x6322893cf9Eb2A7cF5A2C34bd7cC77064e8fB9BE)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      sourceHashes.2:
-        "0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"
+        "0x7ee21b18b2e18c636bfafc08ff72692cc43302b2599ba75f0abad67282866dd5"
      sourceHashes.1:
-        "0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e"
+        "0x9349e73cbc2d2b818c1d79711574ba210b56249d8d3845bc78c776caf8f8ff42"
      issuedPermissions.6:
+        {"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[]}
      issuedPermissions.5:
+        {"permission":"propose","target":"0x964C83a66F78b67F75f076e386C433A1a10cefDB","via":[]}
      issuedPermissions.4:
+        {"permission":"propose","target":"0x839ed36E86D36328c687a211CBe36C271065BAfD","via":[]}
      issuedPermissions.3:
+        {"permission":"propose","target":"0x795aA8E945b571c57b12E7b5B77De10A88a1FADe","via":[]}
      issuedPermissions.2.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.2.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
      issuedPermissions.1.permission:
-        "propose"
+        "challenge"
      issuedPermissions.1.target:
-        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
+        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
      values.$implementation.1:
-        "0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"
+        "0xD935Ea1fc0Db18851C402D75ABF67E1f3dd75594"
      values.$implementation.0:
-        "0xc326D023758d7D212d529D1E58D7f271CAe49fcf"
+        "0x6Ce4A63204E00F0942Bce9E104b2f5A5d61921Dd"
      values.$pastUpgrades.1:
+        ["2024-10-26T07:30:54.000Z","0x77a1d7089bb6294a3db7e7666b639d5c9d3ccc96ade865bf8c746bbb6d50aa18",["0x6Ce4A63204E00F0942Bce9E104b2f5A5d61921Dd","0xD935Ea1fc0Db18851C402D75ABF67E1f3dd75594"]]
      values.$upgradeCount:
-        1
+        2
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "ArbOS v32 wasmModuleRoot"
+++ description: Increments on each Validator change.
      values.setValidatorCount:
-        1
+        2
      values.validators.2:
+        "0x964C83a66F78b67F75f076e386C433A1a10cefDB"
      values.validators.1:
+        "0x839ed36E86D36328c687a211CBe36C271065BAfD"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39"
      values.anyTrustFastConfirmer:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xc78778b1D7416FB8211e864dBA3e277DF39f2c71)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xdeC2bEA51D608C1Fb2cCBC4F654eE0ffF848A73d)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
-   Status: DELETED
    contract OneStepProverMemory (0xF0981852f26053B6506582f819b54cF2DD6b8cC3)
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0x29E1631710Fa96920eB2F65EaD4B1F270daB59cB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x2D81591AfB19e1a1C1c932303790370c7257f454)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x5C864714456935f05cd74D78CFE05Bcc726CddEe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0x5D1E3dC946fC8F2DD6C96C018e5a120CC2b76368)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0xE13987CcaFD999397021222630DEC78BaAa9fE15)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          | 404 ++++++----
 .../OneStepProofEntry.sol                          | 485 +++++++++--
 .../{.flat@267471544 => .flat}/OneStepProver0.sol  | 765 +++++++++++++-----
 .../OneStepProverHostIo.sol                        | 892 +++++++++++++++++----
 .../OneStepProverMath.sol                          |  65 +-
 .../OneStepProverMemory.sol                        | 315 ++++++--
 .../RollupProxy/RollupAdminLogic.1.sol             | 370 ++++++---
 .../RollupProxy/RollupUserLogic.2.sol              | 415 ++++++----
 8 files changed, 2766 insertions(+), 945 deletions(-)
```

Generated with discovered.json: 0x6c66edbfa26e6ba164a959bae9cf43600f5ba2b7

# Diff at Mon, 28 Oct 2024 14:09:14 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@846d03afee15838cf7b18315c02ebdb6a2071f6c block: 267471544
- current block number: 267471544

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 267471544 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      values.executors:
+        ["0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"]
    }
```

Generated with discovered.json: 0x001801eef2d2433777f8848d0113dcbc9f47142e

# Diff at Fri, 25 Oct 2024 10:05:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e7501f424c0cea9b5438386ee76e509448999836 block: 262322423
- current block number: 267471544

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262322423 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.0.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      issuedPermissions.1.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.1.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.0.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.0.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.0.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.0.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.0.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
      receivedPermissions.9:
+        {"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"}
      receivedPermissions.7:
+        {"permission":"upgrade","target":"0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}
      receivedPermissions.6:
+        {"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}
      receivedPermissions.5:
+        {"permission":"upgrade","target":"0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}
      receivedPermissions.4:
+        {"permission":"upgrade","target":"0x575d32f7ff0C72921645e302cb14d2757E300786","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}
      receivedPermissions.3:
+        {"permission":"upgrade","target":"0x365ce7234CE515c2e0139f3578b6c5989da1a863","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}
      receivedPermissions.2:
+        {"permission":"upgrade","target":"0x2f285781B8d58678a3483de52D618198E4d27532","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}
      receivedPermissions.1:
+        {"permission":"upgrade","target":"0x24B68936C13A414cd91437aE7AA730321B9ff159","via":[{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]}
      receivedPermissions.0.target:
-        "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
      receivedPermissions.0.via:
+        [{"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556"}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.0.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
      issuedPermissions.0.via.0:
+        {"address":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","delay":0}
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"},{"permission":"upgrade","target":"0x24B68936C13A414cd91437aE7AA730321B9ff159"},{"permission":"upgrade","target":"0x2f285781B8d58678a3483de52D618198E4d27532"},{"permission":"upgrade","target":"0x365ce7234CE515c2e0139f3578b6c5989da1a863"},{"permission":"upgrade","target":"0x575d32f7ff0C72921645e302cb14d2757E300786"},{"permission":"upgrade","target":"0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"},{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"},{"permission":"upgrade","target":"0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"},{"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990"}]
      template:
+        "global/ProxyAdmin"
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"},{"permission":"upgrade","target":"0x24B68936C13A414cd91437aE7AA730321B9ff159"},{"permission":"upgrade","target":"0x2f285781B8d58678a3483de52D618198E4d27532"},{"permission":"upgrade","target":"0x365ce7234CE515c2e0139f3578b6c5989da1a863"},{"permission":"upgrade","target":"0x575d32f7ff0C72921645e302cb14d2757E300786"},{"permission":"upgrade","target":"0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"},{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"},{"permission":"upgrade","target":"0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"},{"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990"}]
    }
```

Generated with discovered.json: 0x30892d8c9883b7c17282e008cacd4c887a943c3f

# Diff at Wed, 23 Oct 2024 14:37:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9cc37d16a5f0b172bb41f98d8a970963e5ca4afb block: 262322423
- current block number: 262322423

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262322423 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3)
    +++ description: None
```

```diff
    contract OneStepProver0 (0x19c077b3269D988f87DBe3E0FAE2937a3aA37De4) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProver0"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.
      template:
+        "orbitstack/ChallengeManager"
      description:
+        "Contract that allows challenging state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor."
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: A sequencer (registered in this contract) can submit transaction batches or commitments here.
      description:
-        "State batches / commitments get posted here."
+        "A sequencer (registered in this contract) can submit transaction batches or commitments here."
    }
```

```diff
-   Status: DELETED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1.
      template:
+        "orbitstack/Outbox"
      description:
+        "Facilitates L2 to L1 contract calls: Messages initiated from L2 (for example withdrawal messages) which eventually resolve in execution on L1."
    }
```

```diff
    contract OneStepProverHostIo (0x6322893cf9Eb2A7cF5A2C34bd7cC77064e8fB9BE) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverHostIo"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds.
      template:
+        "orbitstack/Inbox"
      description:
+        "Facilitates sending L1 to L2 messages like depositing ETH, but does not escrow funds."
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: Central contract defining the access control for upgrading the system contract implementations.
      template:
+        "orbitstack/UpgradeExecutor"
      description:
+        "Central contract defining the access control for upgrading the system contract implementations."
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators).
      description:
-        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
+        "Central contract for the project's configuration like its execution logic hash (`wasmModuleRoot`) and addresses of the other system contracts. Entry point for Proposers creating new Rollup Nodes (state commitments) and Challengers submitting fraud proofs (In the Orbit stack, these two roles are both held by the Validators)."
      issuedPermissions.2:
+        {"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[]}
      issuedPermissions.1.permission:
-        "validate"
+        "propose"
      issuedPermissions.0.permission:
-        "upgrade"
+        "challenge"
      issuedPermissions.0.target:
-        "0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276"
+        "0x795aA8E945b571c57b12E7b5B77De10A88a1FADe"
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "ArbOS v20 wasmModuleRoot"
+        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+++ description: ArbOS version derived from known wasmModuleRoots.
      values.arbOsFromWmRoot:
+        "ArbOS v20 wasmModuleRoot"
      fieldMeta.arbOsFromWmRoot:
+        {"description":"ArbOS version derived from known wasmModuleRoots."}
      fieldMeta.setValidatorCount:
+        {"description":"Increments on each Validator change."}
      fieldMeta.challenges:
+        {"description":"Emitted on createChallenge() in RollupUserLogic."}
    }
```

```diff
    contract OneStepProofEntry (0xc78778b1D7416FB8211e864dBA3e277DF39f2c71) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProofEntry"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMath (0xdeC2bEA51D608C1Fb2cCBC4F654eE0ffF848A73d) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMath"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

```diff
    contract OneStepProverMemory (0xF0981852f26053B6506582f819b54cF2DD6b8cC3) {
    +++ description: One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine.
      template:
+        "orbitstack/OneStepProverMemory"
      description:
+        "One of the modular contracts used for the last step of a fraud proof, which is simulated inside a WASM virtual machine."
    }
```

Generated with discovered.json: 0x6adefc00473204b36c23ad8188501c0de07f944c

# Diff at Mon, 21 Oct 2024 12:51:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e660599f23a07618fe949a07be1f516ce44f1914 block: 262322423
- current block number: 262322423

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262322423 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      descriptions:
-        ["State batches / commitments get posted here."]
      description:
+        "State batches / commitments get posted here."
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      descriptions:
-        ["Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."]
      description:
+        "Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs."
    }
```

Generated with discovered.json: 0x05138047062d1b33085f2c1c1a5aca974d9e1fe8

# Diff at Mon, 21 Oct 2024 11:13:34 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 262322423
- current block number: 262322423

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262322423 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0x63AB51383384a09734b8B8F6646647213bdD54aC"]
      values.$pastUpgrades.1.1:
-        ["0x63AB51383384a09734b8B8F6646647213bdD54aC"]
+        "0xf96c44f0d8e3ac8c1859088f7651eeb0209343cc8934e76706e6469f912c0617"
      values.$pastUpgrades.0.2:
+        ["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]
      values.$pastUpgrades.0.1:
-        ["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]
+        "0x0d61063cc83825eb0ef98a007195e26311a83915486dbc7bd044b93f660db5da"
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades.1.2:
+        ["0x083c2b4D0C745224E8E484Dfd41eDC9b19f21Feb"]
      values.$pastUpgrades.1.1:
-        ["0x083c2b4D0C745224E8E484Dfd41eDC9b19f21Feb"]
+        "0xf96c44f0d8e3ac8c1859088f7651eeb0209343cc8934e76706e6469f912c0617"
      values.$pastUpgrades.0.2:
+        ["0x1d182075d07744D71E37f77f1654165f6DAFad08"]
      values.$pastUpgrades.0.1:
-        ["0x1d182075d07744D71E37f77f1654165f6DAFad08"]
+        "0x0d61063cc83825eb0ef98a007195e26311a83915486dbc7bd044b93f660db5da"
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xC5Db571093C4600559e239497d147476F7543b15"]
      values.$pastUpgrades.0.1:
-        ["0xC5Db571093C4600559e239497d147476F7543b15"]
+        "0x0d61063cc83825eb0ef98a007195e26311a83915486dbc7bd044b93f660db5da"
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xf2bCB26dbb571EBC82CFAe6453AeF0DE90d93421"]
      values.$pastUpgrades.0.1:
-        ["0xf2bCB26dbb571EBC82CFAe6453AeF0DE90d93421"]
+        "0x0d61063cc83825eb0ef98a007195e26311a83915486dbc7bd044b93f660db5da"
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0xCa2F31F3C6553c2FD9897f7AA464406a431959A9"]
      values.$pastUpgrades.0.1:
-        ["0xCa2F31F3C6553c2FD9897f7AA464406a431959A9"]
+        "0x0d61063cc83825eb0ef98a007195e26311a83915486dbc7bd044b93f660db5da"
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x2675b9DEb473ECaC13ddd71dF8A0Ef13FeF6a75D"]
      values.$pastUpgrades.0.1:
-        ["0x2675b9DEb473ECaC13ddd71dF8A0Ef13FeF6a75D"]
+        "0x0d61063cc83825eb0ef98a007195e26311a83915486dbc7bd044b93f660db5da"
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]
      values.$pastUpgrades.0.1:
-        ["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]
+        "0x0d61063cc83825eb0ef98a007195e26311a83915486dbc7bd044b93f660db5da"
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x922db00d292477AD99Ef8A0c41101a664Ee79D2b"]
      values.$pastUpgrades.0.1:
-        ["0x922db00d292477AD99Ef8A0c41101a664Ee79D2b"]
+        "0x7d22d1fe49e2855ccea3f64913e4a936873f772c2988fadae392ca89a798e1bf"
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades.0.2:
+        ["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]
      values.$pastUpgrades.0.1:
-        ["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]
+        "0x0d61063cc83825eb0ef98a007195e26311a83915486dbc7bd044b93f660db5da"
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xF5CE2B2a046f5C5440506F76d512375fdB301BCa"]
      values.$pastUpgrades.1.1:
-        ["0xF5CE2B2a046f5C5440506F76d512375fdB301BCa"]
+        "0x16970bf621ae80ecb8e0d68b76909e83a2e2b2c1879d89dcec601ab9f24f05a1"
      values.$pastUpgrades.0.2:
+        ["0x652F65f950b71d7aD04AffB1725F43786ed5f6Cc"]
      values.$pastUpgrades.0.1:
-        ["0x652F65f950b71d7aD04AffB1725F43786ed5f6Cc"]
+        "0x7d22d1fe49e2855ccea3f64913e4a936873f772c2988fadae392ca89a798e1bf"
    }
```

Generated with discovered.json: 0x2de83f3a5192917811d61d8324d50bd7f51a2823

# Diff at Wed, 16 Oct 2024 11:44:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a3d139b799cc0b28e5e912febb17464d4e5aef5d block: 262322423
- current block number: 262322423

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262322423 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions.1:
+        {"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}
      issuedPermissions.0.permission:
-        "upgrade"
+        "sequence"
      issuedPermissions.0.target:
-        "0xd18b1C6376633000c85541F7c15c591Ffe5f9556"
+        "0x2f4dDaD3aB0AC4225fd8023EE07d04e2A758017a"
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions.1:
+        {"permission":"validate","target":"0x795aA8E945b571c57b12E7b5B77De10A88a1FADe","via":[]}
    }
```

Generated with discovered.json: 0x2a7a8ec3b52bf01e00eebe9c0716670733e79edb

# Diff at Mon, 14 Oct 2024 10:59:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 262322423
- current block number: 262322423

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 262322423 (main branch discovery), not current.

```diff
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3) {
    +++ description: None
      sourceHashes:
+        ["0x4ef3473c840bed3b4c6258271a494794c1545f0d0f13c6a386d1e39e6180d67c"]
    }
```

```diff
    contract OneStepProver0 (0x19c077b3269D988f87DBe3E0FAE2937a3aA37De4) {
    +++ description: None
      sourceHashes:
+        ["0x20330713abbbcf0219ef7d1c0aa3a6ede1b421f14c9d21b25c973e54fb75f5df"]
    }
```

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x58a6261c83c2766f749641902ad6fdb695ea189d2747f073b57a8f35b9a547e5"]
    }
```

```diff
    contract SankoOftMultisig (0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x50cf57b01499408fa99da27cf0fee96ec30f0d40667d1aa090c442bc80f0636b"]
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xc138999c828d091534e4fea5f3730160aa2a6366cea16b82a55b9c8de07670df"]
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x88c3a2fa81cad2f98a156402c78de0fc804b2a1866ea4f449aa90ae92ceabc6c"]
    }
```

```diff
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0x3073f29910dee50069a001fb20e58cca3dcc1b3c8da4b91809af2dd356ef0c8c"]
    }
```

```diff
    contract OneStepProverHostIo (0x6322893cf9Eb2A7cF5A2C34bd7cC77064e8fB9BE) {
    +++ description: None
      sourceHashes:
+        ["0x5b0a5e16100b7e163dcf39dc6a9034f12a7bad7a475cdffc73054b937be0683d"]
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xcb390b491549387c8fcc09fb22fbea7adf54cc74b7247a0c738369ddd7049b92"]
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      sourceHashes:
+        ["0xa7e3f6c355703ed46fcb2156862c4f01792b87beb10a87a81ce3bd5beee79b67","0xa7ff878cfd433a428d567d3b90fe1df400a048a1af5298f22cd4cd4fc25bdecd"]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x33422e0ac90902db5dad442b006c9df60e262556d8ad286808d133b5429a3eb0"]
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      sourceHashes:
+        ["0xb8da0b3748daac768860783e8555198fd2d1bbdffb775b81557a7124890c7eca","0x8b48118fe606012c0dcac2ccc1821785935aec89fab8f219f47b32c482b0017e","0xef94a66bd5339efd18fb9ca1f8031482e7ef7bbe6c5a0a10fae254ab83712406"]
    }
```

```diff
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0) {
    +++ description: None
      sourceHashes:
+        ["0xd9b36ec321be937cc727b5bdb0afa0e1a0a28448ef1a202d4f181a01ce57bdc8"]
    }
```

```diff
    contract OrbitProxyOFT1_2 (0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29) {
    +++ description: None
      sourceHashes:
+        ["0xaac6964570677f2a9cc26eed15a64f832ab05b188f5b82dfaa6ebf64bed99f7a"]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      sourceHashes:
+        ["0x36a2777510f3b20063560bdcb7f657da283bcfdc484a19b0a0f77d18f6a8b5e1","0x58abad5f338bc4be7d8039fe95309d2627ff20dd8dc73da45278e512c6ff2866"]
    }
```

```diff
    contract OneStepProofEntry (0xc78778b1D7416FB8211e864dBA3e277DF39f2c71) {
    +++ description: None
      sourceHashes:
+        ["0xf3479c667d20b1c17ea2573dc7fe09e4315a3e20bc09d31bc92603520cc962cc"]
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      sourceHashes:
+        ["0xf944f88083f41ff959fefbdcd6fc3ae633692b072b8497fb14cbdd843eded490"]
    }
```

```diff
    contract OneStepProverMath (0xdeC2bEA51D608C1Fb2cCBC4F654eE0ffF848A73d) {
    +++ description: None
      sourceHashes:
+        ["0xb2555ede3dfe7d6df28bd96d12a0113b658c213c7ce4e34fa539df7497bc51a1"]
    }
```

```diff
    contract OneStepProverMemory (0xF0981852f26053B6506582f819b54cF2DD6b8cC3) {
    +++ description: None
      sourceHashes:
+        ["0x731b4466319a83c95ce227d1a6c85aa03864f5d2bed03bda186843033a8b8d61"]
    }
```

Generated with discovered.json: 0x9367ead40fa2e88d3076d9ab0981d35f34ea14ec

# Diff at Thu, 10 Oct 2024 10:37:21 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 259311792
- current block number: 262322423

## Description

A new OFT adapter contract (for the Sanko gas token DMT) is added as allowed Outbox to the main bridge. This gives the OFT adapter full the permission to make any calls as the bridge (including sending all tokens from the bridge).

No 'withdrawal' activity yet through this adapter, only [one test deposit](https://app.blocksec.com/explorer/tx/arbitrum/0x2d172fd2e773bb05250421bc0dd54334118101118b09436852b4b8421f71f454?line=23).

## Watched changes

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      values.allowedOutboxList.1:
+        "0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29"
    }
```

```diff
+   Status: CREATED
    contract SankoOftMultisig (0x2227E9C08ae00750e0a5eD8da09Fa321A9DD7185)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OrbitProxyOFT1_2 (0xa9Aa07F082D9c15D0B6D7e9e5B68b1f898399C29)
    +++ description: None
```

## Source code changes

```diff
.../sanko/arbitrum/.flat/OrbitProxyOFT1_2.sol      | 1883 ++++++++++++++++++++
 .../.flat/SankoOftMultisig/GnosisSafeL2.sol        | 1032 +++++++++++
 .../.flat/SankoOftMultisig/GnosisSafeProxy.p.sol   |   35 +
 3 files changed, 2950 insertions(+)
```

Generated with discovered.json: 0x75d47a0556cc401ed7f7dbc3eafd6a8c8334e173

# Diff at Tue, 01 Oct 2024 15:47:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@974999225bba0722b5e81edd4c1b80928d80ef33 block: 257934843
- current block number: 259311792

## Description

Upgrade of SequencerInbox and OSP to newer versions that are known from other orbit chains. No overall logic / config changes.

## Watched changes

```diff
-   Status: DELETED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: None
```

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      values.$implementation:
-        "0x935239e066F4F449D87D600e6d7c1a4F24c50f97"
+        "0x63AB51383384a09734b8B8F6646647213bdD54aC"
      values.$pastUpgrades.1:
+        ["2024-09-30T15:15:30.000Z",["0x63AB51383384a09734b8B8F6646647213bdD54aC"]]
      values.$upgradeCount:
-        1
+        2
      values.osp:
-        "0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4"
+        "0xc78778b1D7416FB8211e864dBA3e277DF39f2c71"
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.$implementation:
-        "0x1d182075d07744D71E37f77f1654165f6DAFad08"
+        "0x083c2b4D0C745224E8E484Dfd41eDC9b19f21Feb"
      values.$pastUpgrades.1:
+        ["2024-09-30T15:15:30.000Z",["0x083c2b4D0C745224E8E484Dfd41eDC9b19f21Feb"]]
      values.$upgradeCount:
-        1
+        2
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
+        [17280,48,86400,3600]
      values.batchPosterManager:
+        "0x0000000000000000000000000000000000000000"
      values.BROTLI_MESSAGE_HEADER_FLAG:
+        "0x00"
      values.DAS_MESSAGE_HEADER_FLAG:
+        "0x80"
      values.DATA_BLOB_HEADER_FLAG:
+        "0x50"
      values.isUsingFeeToken:
+        true
      values.reader4844:
+        "0x0000000000000000000000000000000000000000"
      values.TREE_DAS_MESSAGE_HEADER_FLAG:
+        "0x08"
      values.ZERO_HEAVY_MESSAGE_HEADER_FLAG:
+        "0x20"
    }
```

```diff
-   Status: DELETED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0x19c077b3269D988f87DBe3E0FAE2937a3aA37De4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x6322893cf9Eb2A7cF5A2C34bd7cC77064e8fB9BE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xc78778b1D7416FB8211e864dBA3e277DF39f2c71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xdeC2bEA51D608C1Fb2cCBC4F654eE0ffF848A73d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMemory (0xF0981852f26053B6506582f819b54cF2DD6b8cC3)
    +++ description: None
```

## Source code changes

```diff
.../ChallengeManager/ChallengeManager.sol          |   6 +
 .../OneStepProverHostIo.sol                        | 107 +++-
 .../SequencerInbox/SequencerInbox.sol              | 662 ++++++++++++++++-----
 3 files changed, 611 insertions(+), 164 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 257934843 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0x935239e066F4F449D87D600e6d7c1a4F24c50f97"]]]
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0x1d182075d07744D71E37f77f1654165f6DAFad08"]]]
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0xC5Db571093C4600559e239497d147476F7543b15"]]]
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0xf2bCB26dbb571EBC82CFAe6453AeF0DE90d93421"]]]
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0xCa2F31F3C6553c2FD9897f7AA464406a431959A9"]]]
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0x2675b9DEb473ECaC13ddd71dF8A0Ef13FeF6a75D"]]]
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0x20C6be2A0429A82a7bF113905a29d36CF6753B10"]]]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:50:11.000Z",["0x922db00d292477AD99Ef8A0c41101a664Ee79D2b"]]]
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      values.$pastUpgrades:
+        [["2024-04-12T21:49:58.000Z",["0xc326D023758d7D212d529D1E58D7f271CAe49fcf","0xD92D49e8A2230E2C7a73c3ff4Df1AED09dA32a07"]]]
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-04-12T21:50:11.000Z",["0x652F65f950b71d7aD04AffB1725F43786ed5f6Cc"]],["2024-04-26T01:40:32.000Z",["0xF5CE2B2a046f5C5440506F76d512375fdB301BCa"]]]
    }
```

Generated with discovered.json: 0xdefe742156380a642fd956abd8d242a3e8c303c9

# Diff at Fri, 27 Sep 2024 15:35:20 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4cb14cc1bdc343d171a7988f9f91f11edbf568a8 block: 251657470
- current block number: 257934843

## Description

Config.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 251657470 (main branch discovery), not current.

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      usedTypes.0.arg.0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39:
+        "ArbOS v32 wasmModuleRoot"
    }
```

Generated with discovered.json: 0x74b0beb0abc992d417da24b1ff59a3d9ceb344f1

# Diff at Mon, 09 Sep 2024 08:41:15 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 245517194
- current block number: 251657470

## Description

Caldera MS removed, replaced with Sanko MS. 

## Watched changes

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
+        "0x420B4d16119127E4b96E55CB8a9D0c2828a161BB"
    }
```

```diff
+   Status: CREATED
    contract Sanko Multisig (0x420B4d16119127E4b96E55CB8a9D0c2828a161BB)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafeL2 => .flat/Sanko Multisig}/GnosisSafeL2.sol                | 0
 .../GnosisSafeL2 => .flat/Sanko Multisig}/GnosisSafeProxy.p.sol           | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract GnosisSafeL2 (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      name:
-        "Caldera Multisig"
+        "GnosisSafeL2"
    }
```

Generated with discovered.json: 0xb5b2f9e2382bd174b88d32f20268a9fd54527f71

# Diff at Sun, 01 Sep 2024 08:47:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bee35b6cff7c52634ae8667cbb331e18ad4ec17a block: 245517194
- current block number: 245517194

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
+++ description: Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions.
      values.wasmModuleRoot:
-        "0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4"
+        "ArbOS v20 wasmModuleRoot"
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0xbb9d58e9527566138b682f3a207c0976d5359837f6e330f4017434cca983ff41":"ArbOS v1-rc1 wasmModuleRoot","0x9d68e40c47e3b87a8a7e6368cc52915720a6484bb2f47ceabad7e573e3a11232":"ArbOS v2.1 wasmModuleRoot","0x53c288a0ca7100c0f2db8ab19508763a51c7fd1be125d376d940a65378acaee7":"ArbOS v3 wasmModuleRoot","0x588762be2f364be15d323df2aa60ffff60f2b14103b34823b6f7319acd1ae7a3":"ArbOS v3.1 wasmModuleRoot","0xcfba6a883c50a1b4475ab909600fa88fc9cceed9e3ff6f43dccd2d27f6bd57cf":"ArbOS v3.2 wasmModuleRoot","0xa24ccdb052d92c5847e8ea3ce722442358db4b00985a9ee737c4e601b6ed9876":"ArbOS v4 wasmModuleRoot","0x1e09e6d9e35b93f33ed22b2bc8dc10bbcf63fdde5e8a1fb8cc1bcd1a52f14bd0":"ArbOS v5 wasmModuleRoot","0x3848eff5e0356faf1fc9cafecb789584c5e7f4f8f817694d842ada96613d8bab":"ArbOS v6 wasmModuleRoot","0x53dd4b9a3d807a8cbb4d58fbfc6a0857c3846d46956848cae0a1cc7eca2bb5a8":"ArbOS v7 wasmModuleRoot","0x2b20e1490d1b06299b222f3239b0ae07e750d8f3b4dedd19f500a815c1548bbc":"ArbOS v7.1 wasmModuleRoot","0xd1842bfbe047322b3f3b3635b5fe62eb611557784d17ac1d2b1ce9c170af6544":"ArbOS v9 wasmModuleRoot","0x6b94a7fc388fd8ef3def759297828dc311761e88d8179c7ee8d3887dc554f3c3":"ArbOS v10 wasmModuleRoot","0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21":"ArbOS v10.1 wasmModuleRoot","0x0754e09320c381566cc0449904c377a52bd34a6b9404432e80afd573b67f7b17":"ArbOS v10.2 wasmModuleRoot","0xf559b6d4fa869472dabce70fe1c15221bdda837533dfd891916836975b434dec":"ArbOS v10.3 wasmModuleRoot","0xf4389b835497a910d7ba3ebfb77aa93da985634f3c052de1290360635be40c4a":"ArbOS v11 wasmModuleRoot","0x68e4fe5023f792d4ef584796c84d710303a5e12ea02d6e37e2b5e9c4332507c4":"ArbOS v11.1 wasmModuleRoot","0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4":"ArbOS v20 wasmModuleRoot","0xb0de9cb89e4d944ae6023a3b62276e54804c242fd8c4c2d8e6cc4450f5fa8b1b":"ArbOS v30 wasmModuleRoot","0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69":"ArbOS v31 wasmModuleRoot"}}]
    }
```

Generated with discovered.json: 0xc08a0d9fd89c733b1d8bac192fea931a191d1775

# Diff at Fri, 30 Aug 2024 08:06:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 245517194
- current block number: 245517194

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      receivedPermissions.8.via:
-        []
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

Generated with discovered.json: 0x8e2926a79308fc7816dd77e1498aadb82ef7eced

# Diff at Fri, 23 Aug 2024 09:57:20 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 245517194
- current block number: 245517194

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 245517194 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

Generated with discovered.json: 0xc77904e8ef816c1aa450a3fcf65347323acdae8e

# Diff at Thu, 22 Aug 2024 11:49:26 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@bf2d0ebf21a279d76dfafc24de12b751244afaf6 block: 225981699
- current block number: 245517194

## Description

New handler now fetching BLS signature keys of DAC members.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      values.dacKeyset.blsSignatures:
+        ["YBM8WH8fzFQs+IXcFMBei3c0fIp6lNYHAw/kaFJEygDiksyqeAE8rWf9HA5OoHsDVwOYrnfZkCSfRjlLEtBaTLPJaU4OfE2N0XzEuRdxmwEVPRO8Ju8IlyFtNyIBAKq3DwF4EqTAXqxCxd05xmmFGkPNkmF6206kv7VGp0cXmEinXf5so12V3pnb+pePP3e3pRhRfu19/rZzXtMJNE55U37hH3VFCC+y13NNoeNqQztRRsroRtQQ9czMa042Zwd0BRluNTa40csEMom/D0Y6o/4cMf7At3G6VYIGy7z/0twDSmhRVXe2xpVJqbxEsTkdyxRPFelDCvZeylRxtN9NHo+BXbvoBUToQDeizLpx2f1hdlggZUI4y+QIN/VJ6h0x3A=="]
    }
```

Generated with discovered.json: 0xeec169759f57f04759521544c5b81c1001656759

# Diff at Wed, 21 Aug 2024 10:07:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]}
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4","via":[]}]
    }
```

```diff
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[]}]
    }
```

```diff
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xd18b1C6376633000c85541F7c15c591Ffe5f9556","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x2f285781B8d58678a3483de52D618198E4d27532","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0xb4951c0C41CFceB0D195A95FE66280457A80a990"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","via":[]},{"permission":"upgrade","target":"0x24B68936C13A414cd91437aE7AA730321B9ff159","via":[]},{"permission":"upgrade","target":"0x2f285781B8d58678a3483de52D618198E4d27532","via":[]},{"permission":"upgrade","target":"0x365ce7234CE515c2e0139f3578b6c5989da1a863","via":[]},{"permission":"upgrade","target":"0x575d32f7ff0C72921645e302cb14d2757E300786","via":[]},{"permission":"upgrade","target":"0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","via":[]},{"permission":"upgrade","target":"0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","via":[]},{"permission":"upgrade","target":"0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","via":[]},{"permission":"upgrade","target":"0xb4951c0C41CFceB0D195A95FE66280457A80a990","via":[]}]
    }
```

Generated with discovered.json: 0x17ac8a625d8cf7d8442095aae327f6eefb847783

# Diff at Fri, 09 Aug 2024 12:03:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions.upgrade.8:
-        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
+        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
      assignedPermissions.upgrade.7:
-        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
+        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
      assignedPermissions.upgrade.5:
-        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
+        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
      assignedPermissions.upgrade.4:
-        "0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD"
+        "0x575d32f7ff0C72921645e302cb14d2757E300786"
      assignedPermissions.upgrade.3:
-        "0x575d32f7ff0C72921645e302cb14d2757E300786"
+        "0x365ce7234CE515c2e0139f3578b6c5989da1a863"
      assignedPermissions.upgrade.2:
-        "0xb4951c0C41CFceB0D195A95FE66280457A80a990"
+        "0x2f285781B8d58678a3483de52D618198E4d27532"
      assignedPermissions.upgrade.1:
-        "0x2f285781B8d58678a3483de52D618198E4d27532"
+        "0x24B68936C13A414cd91437aE7AA730321B9ff159"
      assignedPermissions.upgrade.0:
-        "0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B"
+        "0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"
    }
```

Generated with discovered.json: 0x1c5e2ffa8aba3e9f8f984b010b0cd98e616488b0

# Diff at Fri, 09 Aug 2024 10:13:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x12ee26aD74d50a1f6BDD90811387d1e0f3e7C76A","0x4919167EA334BE84B1604Cbc82A26A7746D5943e","0x356000Cec4fC967f8FC372381D983426760A0391","0xB2a5970fB30dc34AD65c914db855766ea62f1f41"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]
      assignedPermissions.upgrade:
+        ["0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4"]
    }
```

```diff
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x1f269F38196484ef81e58C0144AaD2c5F6394bB4","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x2f285781B8d58678a3483de52D618198E4d27532","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0xb4951c0C41CFceB0D195A95FE66280457A80a990"]
      assignedPermissions.upgrade:
+        ["0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B","0x2f285781B8d58678a3483de52D618198E4d27532","0xb4951c0C41CFceB0D195A95FE66280457A80a990","0x575d32f7ff0C72921645e302cb14d2757E300786","0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD","0x365ce7234CE515c2e0139f3578b6c5989da1a863","0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276","0x24B68936C13A414cd91437aE7AA730321B9ff159","0x1f269F38196484ef81e58C0144AaD2c5F6394bB4"]
    }
```

Generated with discovered.json: 0x4e6ead28c89bb9e104634cba78309db5c44c49bb

# Diff at Tue, 30 Jul 2024 11:17:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 225981699
- current block number: 225981699

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 225981699 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
      fieldMeta:
+        {"maxTimeVariation":{"description":"Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed."}}
    }
```

```diff
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4) {
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
      fieldMeta:
+        {"confirmPeriodBlocks":{"description":"Challenge period. (Number of blocks until a node is confirmed)."},"wasmModuleRoot":{"description":"Root hash of the WASM module used for execution, like a fingerprint of the L2 logic. Can be associated with ArbOS versions."}}
    }
```

Generated with discovered.json: 0x7497b2e8794633fb72d194a2e0f416633fb08a18

# Diff at Tue, 11 Jun 2024 13:11:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 216537364
- current block number: 220737963

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216537364 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xb8105dfaa96d42cb3168bb8035f98564cbe6a158

# Diff at Thu, 30 May 2024 08:36:56 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8465affce30f3ceba1fcd6e8fe7a47fd51c7c62f block: 215641876
- current block number: 216537364

## Description

The Admin EOA is removed, Caldera MS is the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xe8216687Ef40C65F64D6dcd335b0aaab4A1Bc400"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0x4d6ff733355fea27e32d71c819ef65601a504b1b

# Diff at Mon, 27 May 2024 17:59:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 215641876

## Description

Initial discovery: Orbit stack L3 with AnyTrust 1/1 DAC and ArbOS v10.2. Native L3 token is DMT.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```
