Generated with discovered.json: 0x4866eb70f735c21a971929e437f9db627df0883d

# Diff at Mon, 21 Jul 2025 11:59:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c89d5207a278197d1d4bfd60ac8e37852accba7c block: 13539010
- current block number: 19600718

## Description

fee increase.

## Watched changes

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      values.baseFeeScalar:
-        1368
+        4424
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      values.baseFeeScalar:
-        1368
+        4424
    }
```

Generated with discovered.json: 0x754eadb1b6ea6ca6edb848d7ea6f5dae0a9f336a

# Diff at Mon, 14 Jul 2025 12:46:55 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 13539010
- current block number: 13539010

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13539010 (main branch discovery), not current.

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      address:
-        "0x4200000000000000000000000000000000000007"
+        "ink:0x4200000000000000000000000000000000000007"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007"
+        "ink:0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007"
      values.l1CrossDomainMessenger:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "ink:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.OTHER_MESSENGER:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "ink:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.otherMessenger:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "ink:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      implementationNames.0x4200000000000000000000000000000000000007:
-        "Proxy"
      implementationNames.0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007:
-        "L2CrossDomainMessenger"
      implementationNames.ink:0x4200000000000000000000000000000000000007:
+        "Proxy"
      implementationNames.ink:0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007:
+        "L2CrossDomainMessenger"
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      address:
-        "0x420000000000000000000000000000000000000F"
+        "ink:0x420000000000000000000000000000000000000F"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x93e57A196454CB919193fa9946f14943cf733845"
+        "ink:0x93e57A196454CB919193fa9946f14943cf733845"
      values.$pastUpgrades.0.2.0:
-        "0x93e57A196454CB919193fa9946f14943cf733845"
+        "ink:0x93e57A196454CB919193fa9946f14943cf733845"
      implementationNames.0x420000000000000000000000000000000000000F:
-        "Proxy"
      implementationNames.0x93e57A196454CB919193fa9946f14943cf733845:
-        "GasPriceOracle"
      implementationNames.ink:0x420000000000000000000000000000000000000F:
+        "Proxy"
      implementationNames.ink:0x93e57A196454CB919193fa9946f14943cf733845:
+        "GasPriceOracle"
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      address:
-        "0x4200000000000000000000000000000000000010"
+        "ink:0x4200000000000000000000000000000000000010"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010"
+        "ink:0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010"
      values.l1TokenBridge:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "ink:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      values.messenger:
-        "0x4200000000000000000000000000000000000007"
+        "ink:0x4200000000000000000000000000000000000007"
      values.MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "ink:0x4200000000000000000000000000000000000007"
      values.OTHER_BRIDGE:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "ink:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      values.otherBridge:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "ink:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      implementationNames.0x4200000000000000000000000000000000000010:
-        "Proxy"
      implementationNames.0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010:
-        "L2StandardBridge"
      implementationNames.ink:0x4200000000000000000000000000000000000010:
+        "Proxy"
      implementationNames.ink:0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010:
+        "L2StandardBridge"
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x4200000000000000000000000000000000000011"
+        "ink:0x4200000000000000000000000000000000000011"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3C0d3c0d3c0d3C0D3c0d3C0D3c0d3c0D30011"
+        "ink:0xC0D3C0d3c0d3c0d3C0D3c0d3C0D3c0d3c0D30011"
      values.l1FeeWallet:
-        "0xa6f0F94C13C4255231958079E7331694205F6c93"
+        "ink:0xa6f0F94C13C4255231958079E7331694205F6c93"
      values.recipient:
-        "0xa6f0F94C13C4255231958079E7331694205F6c93"
+        "ink:0xa6f0F94C13C4255231958079E7331694205F6c93"
      values.RECIPIENT:
-        "0xa6f0F94C13C4255231958079E7331694205F6c93"
+        "ink:0xa6f0F94C13C4255231958079E7331694205F6c93"
      implementationNames.0x4200000000000000000000000000000000000011:
-        "Proxy"
      implementationNames.0xC0D3C0d3c0d3c0d3C0D3c0d3C0D3c0d3c0D30011:
-        "SequencerFeeVault"
      implementationNames.ink:0x4200000000000000000000000000000000000011:
+        "Proxy"
      implementationNames.ink:0xC0D3C0d3c0d3c0d3C0D3c0d3C0D3c0d3c0D30011:
+        "SequencerFeeVault"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      address:
-        "0x4200000000000000000000000000000000000012"
+        "ink:0x4200000000000000000000000000000000000012"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0D3c0d3C0d3c0d3c0D3c0d3c0D3c0D3c0D30012"
+        "ink:0xc0D3c0d3C0d3c0d3c0D3c0d3c0D3c0D3c0D30012"
      values.bridge:
-        "0x4200000000000000000000000000000000000010"
+        "ink:0x4200000000000000000000000000000000000010"
      values.BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "ink:0x4200000000000000000000000000000000000010"
      implementationNames.0x4200000000000000000000000000000000000012:
-        "Proxy"
      implementationNames.0xc0D3c0d3C0d3c0d3c0D3c0d3c0D3c0D3c0D30012:
-        "OptimismMintableERC20Factory"
      implementationNames.ink:0x4200000000000000000000000000000000000012:
+        "Proxy"
      implementationNames.ink:0xc0D3c0d3C0d3c0d3c0D3c0d3c0D3c0D3c0D30012:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      address:
-        "0x4200000000000000000000000000000000000013"
+        "ink:0x4200000000000000000000000000000000000013"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013"
+        "ink:0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013"
      implementationNames.0x4200000000000000000000000000000000000013:
-        "Proxy"
      implementationNames.0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013:
-        "L1BlockNumber"
      implementationNames.ink:0x4200000000000000000000000000000000000013:
+        "Proxy"
      implementationNames.ink:0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013:
+        "L1BlockNumber"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      address:
-        "0x4200000000000000000000000000000000000014"
+        "ink:0x4200000000000000000000000000000000000014"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014"
+        "ink:0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014"
      values.messenger:
-        "0x4200000000000000000000000000000000000007"
+        "ink:0x4200000000000000000000000000000000000007"
      values.MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "ink:0x4200000000000000000000000000000000000007"
      values.OTHER_BRIDGE:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "ink:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      values.otherBridge:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "ink:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      implementationNames.0x4200000000000000000000000000000000000014:
-        "Proxy"
      implementationNames.0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014:
-        "L2ERC721Bridge"
      implementationNames.ink:0x4200000000000000000000000000000000000014:
+        "Proxy"
      implementationNames.ink:0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014:
+        "L2ERC721Bridge"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      address:
-        "0x4200000000000000000000000000000000000015"
+        "ink:0x4200000000000000000000000000000000000015"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "ink:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.$pastUpgrades.0.2.0:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "ink:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.DEPOSITOR_ACCOUNT:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "ink:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "ink:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      implementationNames.0x4200000000000000000000000000000000000015:
-        "Proxy"
      implementationNames.0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
-        "L1Block"
      implementationNames.ink:0x4200000000000000000000000000000000000015:
+        "Proxy"
      implementationNames.ink:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
+        "L1Block"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      address:
-        "0x4200000000000000000000000000000000000016"
+        "ink:0x4200000000000000000000000000000000000016"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016"
+        "ink:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016"
      implementationNames.0x4200000000000000000000000000000000000016:
-        "Proxy"
      implementationNames.0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016:
-        "L2ToL1MessagePasser"
      implementationNames.ink:0x4200000000000000000000000000000000000016:
+        "Proxy"
      implementationNames.ink:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016:
+        "L2ToL1MessagePasser"
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      address:
-        "0x4200000000000000000000000000000000000017"
+        "ink:0x4200000000000000000000000000000000000017"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017"
+        "ink:0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017"
      values.BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "ink:0x4200000000000000000000000000000000000014"
      implementationNames.0x4200000000000000000000000000000000000017:
-        "Proxy"
      implementationNames.0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017:
-        "OptimismMintableERC721Factory"
      implementationNames.ink:0x4200000000000000000000000000000000000017:
+        "Proxy"
      implementationNames.ink:0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017:
+        "OptimismMintableERC721Factory"
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: Administration contract for other contract proxies.
      address:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
+        "ink:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
      values.addressManager:
-        "0x0000000000000000000000000000000000000000"
+        "ink:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
+        "ink:0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      implementationNames.0x4200000000000000000000000000000000000018:
-        "Proxy"
      implementationNames.0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
-        "ProxyAdmin"
      implementationNames.ink:0x4200000000000000000000000000000000000018:
+        "Proxy"
      implementationNames.ink:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
+        "ProxyAdmin"
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x4200000000000000000000000000000000000019"
+        "ink:0x4200000000000000000000000000000000000019"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3c0D3c0d3C0D3C0D3C0d3c0D3C0D3c0d30019"
+        "ink:0xC0d3c0D3c0d3C0D3C0D3C0d3c0D3C0D3c0d30019"
      values.recipient:
-        "0xa6f0F94C13C4255231958079E7331694205F6c93"
+        "ink:0xa6f0F94C13C4255231958079E7331694205F6c93"
      values.RECIPIENT:
-        "0xa6f0F94C13C4255231958079E7331694205F6c93"
+        "ink:0xa6f0F94C13C4255231958079E7331694205F6c93"
      implementationNames.0x4200000000000000000000000000000000000019:
-        "Proxy"
      implementationNames.0xC0d3c0D3c0d3C0D3C0D3C0d3c0D3C0D3c0d30019:
-        "BaseFeeVault"
      implementationNames.ink:0x4200000000000000000000000000000000000019:
+        "Proxy"
      implementationNames.ink:0xC0d3c0D3c0d3C0D3C0D3C0d3c0D3C0D3c0d30019:
+        "BaseFeeVault"
    }
```

```diff
    contract BaseFeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x420000000000000000000000000000000000001A"
+        "ink:0x420000000000000000000000000000000000001A"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0D3c0D3C0d3c0d3c0d3C0d3c0d3C0d3C0D3001A"
+        "ink:0xc0D3c0D3C0d3c0d3c0d3C0d3c0d3C0d3C0D3001A"
      values.recipient:
-        "0xa6f0F94C13C4255231958079E7331694205F6c93"
+        "ink:0xa6f0F94C13C4255231958079E7331694205F6c93"
      values.RECIPIENT:
-        "0xa6f0F94C13C4255231958079E7331694205F6c93"
+        "ink:0xa6f0F94C13C4255231958079E7331694205F6c93"
      implementationNames.0x420000000000000000000000000000000000001A:
-        "Proxy"
      implementationNames.0xc0D3c0D3C0d3c0d3c0d3C0d3c0d3C0d3C0D3001A:
-        "BaseFeeVault"
      implementationNames.ink:0x420000000000000000000000000000000000001A:
+        "Proxy"
      implementationNames.ink:0xc0D3c0D3C0d3c0d3c0d3C0d3c0d3C0d3C0D3001A:
+        "BaseFeeVault"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      address:
-        "0x4200000000000000000000000000000000000020"
+        "ink:0x4200000000000000000000000000000000000020"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0d3c0d3c0d3C0d3c0d3C0D3C0D3c0d3C0D30020"
+        "ink:0xc0d3c0d3c0d3C0d3c0d3C0D3C0D3c0d3C0D30020"
      implementationNames.0x4200000000000000000000000000000000000020:
-        "Proxy"
      implementationNames.0xc0d3c0d3c0d3C0d3c0d3C0D3C0D3c0d3C0D30020:
-        "SchemaRegistry"
      implementationNames.ink:0x4200000000000000000000000000000000000020:
+        "Proxy"
      implementationNames.ink:0xc0d3c0d3c0d3C0d3c0d3C0D3C0D3c0d3C0D30020:
+        "SchemaRegistry"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      address:
-        "0x4200000000000000000000000000000000000021"
+        "ink:0x4200000000000000000000000000000000000021"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "ink:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3c0D3C0d3c0D3c0D3C0D3c0D3c0d3c0d30021"
+        "ink:0xC0D3c0D3C0d3c0D3c0D3C0D3c0D3c0d3c0d30021"
      values.getSchemaRegistry:
-        "0x4200000000000000000000000000000000000020"
+        "ink:0x4200000000000000000000000000000000000020"
      implementationNames.0x4200000000000000000000000000000000000021:
-        "Proxy"
      implementationNames.0xC0D3c0D3C0d3c0D3c0D3C0D3c0D3c0d3c0d30021:
-        "EAS"
      implementationNames.ink:0x4200000000000000000000000000000000000021:
+        "Proxy"
      implementationNames.ink:0xC0D3c0D3C0d3c0D3c0D3C0D3c0D3c0d3c0d30021:
+        "EAS"
    }
```

```diff
    EOA  (0x661235a238B11191211fa95D4Dd9E423d521E0Be) {
    +++ description: None
      address:
-        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
+        "ink:0x661235a238B11191211fa95D4Dd9E423d521E0Be"
    }
```

```diff
    EOA  (0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f) {
    +++ description: None
      address:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "ink:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
    }
```

```diff
    EOA SuperchainProxyAdminOwner_L2Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      address:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
+        "ink:0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    EOA  (0x88FF1e5b602916615391F55854588EFcBB7663f0) {
    +++ description: None
      address:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "ink:0x88FF1e5b602916615391F55854588EFcBB7663f0"
    }
```

```diff
    EOA  (0xa6f0F94C13C4255231958079E7331694205F6c93) {
    +++ description: None
      address:
-        "0xa6f0F94C13C4255231958079E7331694205F6c93"
+        "ink:0xa6f0F94C13C4255231958079E7331694205F6c93"
    }
```

```diff
    EOA  (0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001) {
    +++ description: None
      address:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "ink:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
    }
```

```diff
    EOA  (0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
    +++ description: None
      address:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "ink:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    }
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
```

```diff
+   Status: CREATED
    contract GasPriceOracle (0x420000000000000000000000000000000000000F)
    +++ description: Provides the current gas price for L2 transactions.
```

```diff
+   Status: CREATED
    contract L2StandardBridge (0x4200000000000000000000000000000000000010)
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011)
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012)
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
```

```diff
+   Status: CREATED
    contract L1BlockNumber (0x4200000000000000000000000000000000000013)
    +++ description: Simple contract that returns the latest L1 block number.
```

```diff
+   Status: CREATED
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014)
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017)
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: Administration contract for other contract proxies.
```

```diff
+   Status: CREATED
    contract BaseFeeVault (0x4200000000000000000000000000000000000019)
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract BaseFeeVault (0x420000000000000000000000000000000000001A)
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract SchemaRegistry (0x4200000000000000000000000000000000000020)
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
```

```diff
+   Status: CREATED
    contract EAS (0x4200000000000000000000000000000000000021)
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
```

Generated with discovered.json: 0x29be3cacca47789d7b793a8d25372b28742aadcf

# Diff at Fri, 23 May 2025 09:41:17 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 13539010
- current block number: 13539010

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 13539010 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: Administration contract for other contract proxies.
      directlyReceivedPermissions.14.role:
+        "admin"
      directlyReceivedPermissions.13.role:
+        "admin"
      directlyReceivedPermissions.12.role:
+        "admin"
      directlyReceivedPermissions.11.role:
+        "admin"
      directlyReceivedPermissions.10.role:
+        "admin"
      directlyReceivedPermissions.9.role:
+        "admin"
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA SuperchainProxyAdminOwner_L2Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      receivedPermissions.14.role:
+        "admin"
      receivedPermissions.13.role:
+        "admin"
      receivedPermissions.12.role:
+        "admin"
      receivedPermissions.11.role:
+        "admin"
      receivedPermissions.10.role:
+        "admin"
      receivedPermissions.9.role:
+        "admin"
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x69e360462ac859edc70366ad63c4de9298bc7227

# Diff at Mon, 12 May 2025 08:14:46 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4a373705dbec82410d264d404f2ff330f41666ef block: 8196210
- current block number: 13539010

## Description

Isthmus L2 contract upgrades, mainly focusing on support for the new operator fee (standard contracts).

## Watched changes

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      sourceHashes.1:
-        "0x6e5bd465cdf07c7fc7de194833be336109be5aceaeb509643962096c772ec26a"
+        "0xa6ae4f0695335983b644f1524c759f3178ee95c406e1e905b8cbccf5763af43a"
      values.$implementation:
-        "0xc0d3C0d3C0d3c0D3C0D3C0d3C0d3C0D3C0D3000f"
+        "0x93e57A196454CB919193fa9946f14943cf733845"
      values.$pastUpgrades.0:
+        ["2025-05-09T16:00:01.000Z","0xb6560306ccb0e772b132a8a6dd78244c0d7ac270c80baba40f95006184926c30",["0x93e57A196454CB919193fa9946f14943cf733845"]]
      values.$upgradeCount:
-        0
+        1
      values.version:
-        "1.3.1-beta.1"
+        "1.4.0"
      values.isIsthmus:
+        true
      implementationNames.0xc0d3C0d3C0d3c0D3C0D3C0d3C0d3C0D3C0D3000f:
-        "GasPriceOracle"
      implementationNames.0x93e57A196454CB919193fa9946f14943cf733845:
+        "GasPriceOracle"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      sourceHashes.1:
-        "0x936b7b7eb2a88a64e3eceaf897abfa2dc6e48b4c75eba2da34ff927b98413b6b"
+        "0x6a90057e0a817ce81f9ed4b565f5efdbf1ebf76d5f59f3ce62f2994455e8199d"
      sourceHashes.0:
-        "0x6a90057e0a817ce81f9ed4b565f5efdbf1ebf76d5f59f3ce62f2994455e8199d"
+        "0xb3745d52050d9a2c6bfa6e6e091bdfa43e7c87a22542aa276d323a29431ec108"
      values.$implementation:
-        "0xc0d3C0D3C0D3c0D3C0D3C0d3C0D3c0D3c0d30015"
+        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.$pastUpgrades.0:
+        ["2025-05-09T16:00:01.000Z","0xe992e00998b34075506d2726a274db07a62af6cdd9d527bfda9128114603cfbd",["0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"]]
      values.$upgradeCount:
-        0
+        1
      values.version:
-        "1.5.1-beta.1"
+        "1.6.0"
      implementationNames.0xc0d3C0D3C0D3c0D3C0D3C0d3C0D3c0D3c0d30015:
-        "L1Block"
      implementationNames.0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
+        "L1Block"
    }
```

## Source code changes

```diff
.../GasPriceOracle/GasPriceOracle.sol              |  511 ++++++-
 .../{.flat@8196210 => .flat}/L1Block/L1Block.sol   | 1423 +-------------------
 2 files changed, 552 insertions(+), 1382 deletions(-)
```

Generated with discovered.json: 0xb262b25aef696506e629da385b193c8362af0a27

# Diff at Tue, 06 May 2025 10:57:07 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 8196210
- current block number: 8196210

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8196210 (main branch discovery), not current.

```diff
    EOA SuperchainProxyAdminOwner_L2Alias (0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x0feb6cad2b097def9e79878b14e572fcd1b50b59

# Diff at Tue, 29 Apr 2025 08:19:25 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 8196210
- current block number: 8196210

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8196210 (main branch discovery), not current.

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: Administration contract for other contract proxies.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract BaseFeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[{"address":"0x4200000000000000000000000000000000000018"}]}]
    }
```

Generated with discovered.json: 0x076e12ff6e1bb5945cf304fde925ed29dd28bebb

# Diff at Tue, 11 Mar 2025 12:03:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a75ac906056abb236c14b626853813f468099f57 block: 7087697
- current block number: 8196210

## Description

Contract verified.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7087697 (main branch discovery), not current.

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      unverified:
-        true
      values.BRIDGE:
+        "0x4200000000000000000000000000000000000014"
      values.REMOTE_CHAIN_ID:
+        1
      values.version:
+        "1.4.1-beta.1"
      sourceHashes:
+        ["0xdb44b7e73254e0314f233ca790b4d44a2f9e3cebc019945c0ef84b9e3579c77a","0xd05d0050b36bb2fb43c345eabc2d7f6e796571360aa2198707da64794c5f4b64"]
    }
```

Generated with discovered.json: 0x30f8eba84377b6e723f7d6b4d7b4b8eb9e7cef8b

# Diff at Tue, 04 Mar 2025 11:27:20 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 7087697
- current block number: 7087697

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7087697 (main branch discovery), not current.

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      sinceBlock:
+        0
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      sinceBlock:
+        0
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      sinceBlock:
+        0
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      sinceBlock:
+        0
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      sinceBlock:
+        0
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      sinceBlock:
+        0
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      sinceBlock:
+        0
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      sinceBlock:
+        0
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      sinceBlock:
+        0
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      sinceBlock:
+        0
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: Administration contract for other contract proxies.
      sinceBlock:
+        0
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      sinceBlock:
+        0
    }
```

```diff
    contract BaseFeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      sinceBlock:
+        0
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      sinceBlock:
+        0
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      sinceBlock:
+        0
    }
```

Generated with discovered.json: 0xc57a14ec38df9011215e85fbdfde3fad6d4a84d1

# Diff at Thu, 27 Feb 2025 12:17:02 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@498566f068804b86055f6b4fe0c93bc7215cc136 block: 7087697
- current block number: 7087697

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 7087697 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: Administration contract for other contract proxies.
      name:
-        "ProxyAdmin"
+        "L2ProxyAdmin"
      displayName:
-        "L2ProxyAdmin"
    }
```

Generated with discovered.json: 0x4df0da577a3b1875047b38f816dd33599e2e54e8

# Diff at Wed, 26 Feb 2025 16:18:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9eb8b2d626938c85a098b11b809352a92a892736 block: 6881137
- current block number: 7087697

## Description

Config related: Add L2 contracts as templates with source.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 6881137 (main branch discovery), not current.

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      template:
+        "opstack/Layer2/L2CrossDomainMessenger"
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      template:
+        "opstack/Layer2/GasPriceOracle"
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      template:
+        "opstack/Layer2/L2StandardBridge"
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      template:
+        "opstack/Layer2/SequencerFeeVault"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      template:
+        "opstack/Layer2/OptimismMintableERC20Factory"
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      template:
+        "opstack/Layer2/L1BlockNumber"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      unverified:
-        true
      values.messenger:
+        "0x4200000000000000000000000000000000000007"
      values.MESSENGER:
+        "0x4200000000000000000000000000000000000007"
      values.OTHER_BRIDGE:
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      values.otherBridge:
+        "0x661235a238B11191211fa95D4Dd9E423d521E0Be"
      values.paused:
+        false
      values.version:
+        "1.7.1-beta.2"
      template:
+        "opstack/Layer2/L2ERC721Bridge"
      sourceHashes:
+        ["0xdb44b7e73254e0314f233ca790b4d44a2f9e3cebc019945c0ef84b9e3579c77a","0xf8e3171eeccb9b5e31480276120e77545d7f33ae218b16ee367370dc484149f2"]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      template:
+        "opstack/Layer2/L1Block"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      template:
+        "opstack/Layer2/L2ToL1MessagePasser"
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      template:
+        "opstack/Layer2/OptimismMintableERC721Factory"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: Administration contract for other contract proxies.
      name:
-        "L2ProxyAdmin"
+        "ProxyAdmin"
      displayName:
+        "L2ProxyAdmin"
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      template:
+        "opstack/Layer2/BaseFeeVault"
    }
```

```diff
    contract BaseFeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      name:
-        "L1FeeVault"
+        "BaseFeeVault"
      description:
-        "Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1."
+        "Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1."
      template:
+        "opstack/Layer2/BaseFeeVault"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      template:
+        "opstack/Layer2/SchemaRegistry"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      template:
+        "opstack/Layer2/EAS"
    }
```

Generated with discovered.json: 0xb21b0a094164aa7fd1f8800e6424fe088522fc14

# Diff at Mon, 24 Feb 2025 06:46:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 6881137

## Description

Initial L2 discovery: 3 unverified contracts, ProxyAdmin gov correctly resolves to L1.

## Initial discovery

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
```

```diff
+   Status: CREATED
    contract GasPriceOracle (0x420000000000000000000000000000000000000F)
    +++ description: Provides the current gas price for L2 transactions.
```

```diff
+   Status: CREATED
    contract L2StandardBridge (0x4200000000000000000000000000000000000010)
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
```

```diff
+   Status: CREATED
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011)
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012)
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
```

```diff
+   Status: CREATED
    contract L1BlockNumber (0x4200000000000000000000000000000000000013)
    +++ description: Simple contract that returns the latest L1 block number.
```

```diff
+   Status: CREATED
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014)
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017)
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: Administration contract for other contract proxies.
```

```diff
+   Status: CREATED
    contract BaseFeeVault (0x4200000000000000000000000000000000000019)
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract L1FeeVault (0x420000000000000000000000000000000000001A)
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
```

```diff
+   Status: CREATED
    contract SchemaRegistry (0x4200000000000000000000000000000000000020)
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
```

```diff
+   Status: CREATED
    contract EAS (0x4200000000000000000000000000000000000021)
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
```
