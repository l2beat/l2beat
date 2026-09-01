Generated with discovered.json: 0xf79e73d47e55bed1f11513669d5045664a7fb1d1

# Diff at Thu, 27 Aug 2026 07:45:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1787816633

## Description

Initial discovery of the Base <> Solana native bridge (Base side): Bridge escrow with MMR (merkle mountain range) message accumulator, BridgeValidator (2-of-2 Base validators + 3-of-10 Chainlink partner signers, fixed at initialization), SignerRegistry owned by the CCIP RBACTimelock (border of this discovery), CrossChainERC20/Twin beacon architecture upgradable by a single EOA.

## Initial discovery

```diff
+   Status: CREATED
    contract CrossChainERC20 (base:0x0c39C78Dc31082187D8D7de9937bA46Ddba3c043) [basesolbridge/CrossChainERC20]
    +++ description: Implementation contract for the CrossChainERC20 tokens (beacon proxies) representing Solana-native assets on Base (e.g. SOL, JitoSOL). Only the Bridge can mint and burn them.
```

```diff
+   Status: CREATED
    contract Bridge (base:0x3eff766C76a1be2Ce1aCF2B69c78bCae257D5188) [basesolbridge/Bridge]
    +++ description: Core contract of the Base <> Solana bridge on the Base side. Outgoing messages (token transfers and arbitrary Solana instructions) are appended to an onchain merkle mountain range accumulator that is consumed by offchain infrastructure and the bridge program on Solana. Incoming messages from Solana must first be attested in the BridgeValidator and can then be relayed permissionlessly: they mint CrossChainERC20 tokens, release escrowed Base-native assets or execute arbitrary calls through per-user Twin contracts. Base-native assets (ETH, ERC20s) that are bridged to Solana are escrowed in this contract.
```

```diff
+   Status: CREATED
    contract SignerRegistry (base:0x50Ea62F44f44C17d48390cc9fd235dac8E5e127a) [basesolbridge/SignerRegistry]
    +++ description: Registry of the partner validator set that co-signs attestations of Solana -> Base messages for the BridgeValidator of the Base <> Solana bridge.
```

```diff
+   Status: CREATED
    contract RBACTimelock (base:0x7B0328745A01634c32eFAf041d91432a075B308D) [transporter/RBACTimelock]
    +++ description: Role based timelock used to administer CCIP contracts.
```

```diff
+   Status: CREATED
    contract BridgeValidator (base:0xAF24c1c24Ff3BF1e6D882518120fC25442d6794B) [basesolbridge/BridgeValidator]
    +++ description: Attestation registry for messages passed from Solana to Base: batches of message hashes become valid for execution in the Bridge after being co-signed by at least 2 of 2 Base validators and 3 partner validators listed in the SignerRegistry. The validator set and thresholds are fixed at initialization: the contract exposes no functions to change them and its proxy has no admin.
```

```diff
+   Status: CREATED
    contract Twin (base:0xb0887e4793d944Cf7bA674B3b3FA5C15900ddaA7) [basesolbridge/Twin]
    +++ description: Implementation contract for Twin accounts: each Solana address gets a deterministic Twin beacon proxy on Base that executes arbitrary calls on its behalf when instructed via bridge messages from Solana. Only the Bridge can call it.
```

```diff
+   Status: CREATED
    contract TwinBeacon (base:0xb326c02150bb0De265Bb0eCeDA53531ab0163bf6) [global/UpgradeableBeacon]
    +++ description: A beacon with an upgradeable implementation currently set as base:0xb0887e4793d944Cf7bA674B3b3FA5C15900ddaA7. Beacon proxy contracts pointing to this beacon will all use its implementation.
```

```diff
+   Status: CREATED
    contract CrossChainERC20Factory (base:0xDD56781d0509650f8C2981231B6C917f2d5d7dF2) [basesolbridge/CrossChainERC20Factory]
    +++ description: Factory that permissionlessly deploys CrossChainERC20 token contracts (beacon proxies) representing Solana-native assets (SOL and SPL tokens) on Base. The deployed tokens are minted and burned by the Bridge.
```

```diff
+   Status: CREATED
    contract CrossChainERC20Beacon (base:0xdDc41fdA4B758728d07F4686DbE7D1C75C6b2552) [global/UpgradeableBeacon]
    +++ description: A beacon with an upgradeable implementation currently set as base:0x0c39C78Dc31082187D8D7de9937bA46Ddba3c043. Beacon proxy contracts pointing to this beacon will all use its implementation.
```
