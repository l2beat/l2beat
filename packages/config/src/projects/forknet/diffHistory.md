Generated with discovered.json: 0x76c69a4ede68e536d0f872f95f9c60382ac7958e

# Diff at Fri, 12 Dec 2025 16:19:52 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@d2235ef7f5c90cb4a3a617fea7d52a655dc22fa1 block: 1764933637
- current timestamp: 1764933637

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933637 (main branch discovery), not current.

```diff
    contract DisputeGameFactory (eth:0xAa47071585ee92Fa9AE314C87d3d12a25c241EeD) {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
+++ severity: HIGH
      values.game2000:
+        "eth:0x0000000000000000000000000000000000000000"
+++ severity: HIGH
      values.game42:
+        "eth:0x0000000000000000000000000000000000000000"
      values.initBondGame42:
+        0
      fieldMeta.game2000:
+        {"severity":"HIGH"}
      fieldMeta.game42:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xe1f05c44c918e340eac09f325cc796de754221be

# Diff at Tue, 09 Dec 2025 11:33:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ed25b2aa28d6ab9faa5f06bc943948919be9627d block: 1764933637
- current timestamp: 1764933637

## Description

config: add aggchain_type description and severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1764933637 (main branch discovery), not current.

```diff
    contract AggchainECDSAMultisig (eth:0x2f3d687e02dbe83B6cDaE02aeb66C0e8E69CcA4b) {
    +++ description: System contract defining the forknet Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
      fieldMeta.AGGCHAIN_TYPE:
+        {"severity":"HIGH","description":"0: ECDSA sig verification, 1: limited to vkeys in AggchainGateway with 1 as second byte"}
    }
```

Generated with discovered.json: 0x30078bc6eff8a2381ca5075e939f6d3822eb0d08

# Diff at Fri, 05 Dec 2025 11:21:56 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@1edf3e71cea32596658a3ea017cea9df6408b77c block: 1762246195
- current timestamp: 1764933637

## Description

Conduit multisig key rotation.

## Watched changes

```diff
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746) {
    +++ description: None
      values.$members.0:
+        "eth:0x2103c69696CB2D3779f5445393808239034E911c"
      values.$members.0:
-        "eth:0xFe0ab87ebE03DD0bF52DaF34Dfda6639c335e2d4"
+        "eth:0x65D1d44B8B2fE15d45A03708E0835C7E98a56007"
      values.$members.4:
-        "eth:0xF0B77EaE7F2dabCC2571c7418406A0dCA3afA4f0"
    }
```

Generated with discovered.json: 0x19a7b60ba68b440c0dc55920844f5c85c81ea4a3

# Diff at Tue, 04 Nov 2025 12:58:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@6b9a294e84c4d5ca84a7b377bd638098bb461624 block: 1762246195
- current timestamp: 1762246195

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1762246195 (main branch discovery), not current.

```diff
    contract PermissionedDisputeGame (eth:0xd102e395aA8b4710db44B33F14Ae0038F318C2AC) {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used.
      sourceHashes.0:
-        "0x7129ee348039f13e017c18c90ffcb319f67a8fdd3b4a5a28c39aabc8bf0c57f6"
+        "0x0a442058af95748cc6199d889a46c775f9f6f4d29a61df5124ceb93ff631074d"
    }
```

```diff
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1) {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      sourceHashes.0:
-        "0x115725ab57eeed11f754138c0ec5f9bfba41e494b2336c2cd4745778eb26f776"
+        "0xd693f0cc376e99425037555be4a61adb70c597ad1485e838c475743c79a41fa0"
    }
```

Generated with discovered.json: 0x17c2a52161ad7790b711c373b99243b95983b9fc

# Diff at Tue, 04 Nov 2025 09:09:39 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1762246195

## Description

aggkit opstack without proof system/state roots and onchain DA.

## Initial discovery

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x010DEBD63B170821ae1b4ba93Fe46005aaaB1692)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    reference AgglayerGateway (eth:0x046Bb8bb98Db4ceCbB2929542686B74b516274b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0x097f99768A0a4a0A81bAbbCB1ea18193bA9D53cC)
    +++ description: Since this contract is deployed in the context of a neutered op stack system, the guardian role has no significance.
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0x2258d4C98AaeDB54f6f1be40ca347FD3160B34C2)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    reference AgglayerBridge (eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AggchainECDSAMultisig (eth:0x2f3d687e02dbe83B6cDaE02aeb66C0e8E69CcA4b)
    +++ description: System contract defining the forknet Aggchain logic. It only enforces bridge accounting (pessimistic) proofs to protect the shared bridge while the Aggchain state transitions are not proven. They must instead be signed by 1 aggchainSigner(s).
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (eth:0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    reference AgglayerManager (eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0x514795090ceA49c14f65b45c4403A36b3576AE03)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    reference AgglayerGER (eth:0x580bda1e7A0CFAe92Fa7F6c20A3794F169CE3CFb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0x5D2952EAe032aa33e977c52f810e0089261efB27)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x6C82EEE75Bb8b957C12FaaF8CAb549BE4b0fD5af)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0xAa47071585ee92Fa9AE314C87d3d12a25c241EeD)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xb4899FF43Ae727B1E9CB19AC44660e4A43Fad0b5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0xB847cf7F5CE23cBaF76E751C066bfE732951501f)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0xd102e395aA8b4710db44B33F14Ae0038F318C2AC)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger. In the context of this permissioned aggkit deployment, there are no state proposals made here and the op stack fault proof system is not used.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0xd1cFFdEF1dc379372CB06f3dEdC6debeF6059E82)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0xD7cF5ce4688663e057E99D9f880599Ce88757695)
    +++ description: The OptimismPortal contract usually is the main entry point to deposit funds from L1 to L2 or for finalizing withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame. This specific fork of the standard contract **disables the depositTransaction() function**, which prevents users from sending or forcing any transactions from L1 to L2, including token deposits. It is instead used for configuration and administration of the system.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0xe0fCd317cbF59bA23205ab1662811E631AcbCE29)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xEfBb0af25B3bE24347f17916fda058795f36a5A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (eth:0xF027F4A985560fb13324e943edf55ad6F1d15Dc1)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```
