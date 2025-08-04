Generated with discovered.json: 0x5456ca4e5b48d74b58b85394c585e26c9e3cf8ec

# Diff at Mon, 14 Jul 2025 12:44:48 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 31338532
- current block number: 31338532

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 31338532 (main branch discovery), not current.

```diff
    contract FeeDisburser (0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA) {
    +++ description: Contract used to disburse funds from system FeeVault contracts, shares revenue with Optimism and bridges the rest of funds to L1.
      address:
-        "0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
+        "base:0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
      values.$admin:
-        "0xaD5B57FEB77e294fD7BF5EBE9aB01caA0a90B221"
+        "base:0xaD5B57FEB77e294fD7BF5EBE9aB01caA0a90B221"
      values.$implementation:
-        "0x45969D00739d518f0Dde41920B67cE30395135A0"
+        "base:0x45969D00739d518f0Dde41920B67cE30395135A0"
      values.$pastUpgrades.0.2.0:
-        "0x45969D00739d518f0Dde41920B67cE30395135A0"
+        "base:0x45969D00739d518f0Dde41920B67cE30395135A0"
      values.L1_WALLET:
-        "0x23B597f33f6f2621F77DA117523Dffd634cDf4ea"
+        "base:0x23B597f33f6f2621F77DA117523Dffd634cDf4ea"
      values.OPTIMISM_WALLET:
-        "0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05"
+        "base:0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05"
      implementationNames.0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA:
-        "Proxy"
      implementationNames.0x45969D00739d518f0Dde41920B67cE30395135A0:
-        "FeeDisburser"
      implementationNames.base:0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA:
+        "Proxy"
      implementationNames.base:0x45969D00739d518f0Dde41920B67cE30395135A0:
+        "FeeDisburser"
    }
```

```diff
    EOA  (0x1084092Ac2f04c866806CF3d4a385Afa4F6A6C97) {
    +++ description: None
      address:
-        "0x1084092Ac2f04c866806CF3d4a385Afa4F6A6C97"
+        "base:0x1084092Ac2f04c866806CF3d4a385Afa4F6A6C97"
    }
```

```diff
    EOA  (0x23B597f33f6f2621F77DA117523Dffd634cDf4ea) {
    +++ description: None
      address:
-        "0x23B597f33f6f2621F77DA117523Dffd634cDf4ea"
+        "base:0x23B597f33f6f2621F77DA117523Dffd634cDf4ea"
    }
```

```diff
    EOA  (0x3154Cf16ccdb4C6d922629664174b904d80F2C35) {
    +++ description: None
      address:
-        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
+        "base:0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
    }
```

```diff
    EOA  (0x3FDf3c4bf8783bB94295b9219DF74a648f397360) {
    +++ description: None
      address:
-        "0x3FDf3c4bf8783bB94295b9219DF74a648f397360"
+        "base:0x3FDf3c4bf8783bB94295b9219DF74a648f397360"
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      address:
-        "0x4200000000000000000000000000000000000007"
+        "base:0x4200000000000000000000000000000000000007"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007"
+        "base:0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007"
      values.l1CrossDomainMessenger:
-        "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
+        "base:0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
      values.OTHER_MESSENGER:
-        "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
+        "base:0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
      implementationNames.0x4200000000000000000000000000000000000007:
-        "Proxy"
      implementationNames.0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007:
-        "L2CrossDomainMessenger"
      implementationNames.base:0x4200000000000000000000000000000000000007:
+        "Proxy"
      implementationNames.base:0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007:
+        "L2CrossDomainMessenger"
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      address:
-        "0x4200000000000000000000000000000000000010"
+        "base:0x4200000000000000000000000000000000000010"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010"
+        "base:0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010"
      values.l1TokenBridge:
-        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
+        "base:0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
      values.messenger:
-        "0x4200000000000000000000000000000000000007"
+        "base:0x4200000000000000000000000000000000000007"
      values.MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "base:0x4200000000000000000000000000000000000007"
      values.OTHER_BRIDGE:
-        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
+        "base:0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
      implementationNames.0x4200000000000000000000000000000000000010:
-        "Proxy"
      implementationNames.0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010:
-        "L2StandardBridge"
      implementationNames.base:0x4200000000000000000000000000000000000010:
+        "Proxy"
      implementationNames.base:0xC0d3c0d3c0D3c0d3C0D3c0D3C0d3C0D3C0D30010:
+        "L2StandardBridge"
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x4200000000000000000000000000000000000011"
+        "base:0x4200000000000000000000000000000000000011"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xd53210eE20948eCFF8B6B8180E29657e0ce8492d"
+        "base:0xd53210eE20948eCFF8B6B8180E29657e0ce8492d"
      values.$pastUpgrades.0.2.0:
-        "0x54d194FaAe439fc3f8024801B0b9EBc91Ebd39f5"
+        "base:0x54d194FaAe439fc3f8024801B0b9EBc91Ebd39f5"
      values.$pastUpgrades.1.2.0:
-        "0xd53210eE20948eCFF8B6B8180E29657e0ce8492d"
+        "base:0xd53210eE20948eCFF8B6B8180E29657e0ce8492d"
      values.l1FeeWallet:
-        "0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
+        "base:0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
      values.RECIPIENT:
-        "0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
+        "base:0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
      implementationNames.0x4200000000000000000000000000000000000011:
-        "Proxy"
      implementationNames.0xd53210eE20948eCFF8B6B8180E29657e0ce8492d:
-        "SequencerFeeVault"
      implementationNames.base:0x4200000000000000000000000000000000000011:
+        "Proxy"
      implementationNames.base:0xd53210eE20948eCFF8B6B8180E29657e0ce8492d:
+        "SequencerFeeVault"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      address:
-        "0x4200000000000000000000000000000000000012"
+        "base:0x4200000000000000000000000000000000000012"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x6922ac4DbDfEdEa3a1E5535f12c3171f2b964C91"
+        "base:0x6922ac4DbDfEdEa3a1E5535f12c3171f2b964C91"
      values.$pastUpgrades.0.2.0:
-        "0x6922ac4DbDfEdEa3a1E5535f12c3171f2b964C91"
+        "base:0x6922ac4DbDfEdEa3a1E5535f12c3171f2b964C91"
      values.bridge:
-        "0x4200000000000000000000000000000000000010"
+        "base:0x4200000000000000000000000000000000000010"
      values.BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "base:0x4200000000000000000000000000000000000010"
      implementationNames.0x4200000000000000000000000000000000000012:
-        "Proxy"
      implementationNames.0x6922ac4DbDfEdEa3a1E5535f12c3171f2b964C91:
-        "OptimismMintableERC20Factory"
      implementationNames.base:0x4200000000000000000000000000000000000012:
+        "Proxy"
      implementationNames.base:0x6922ac4DbDfEdEa3a1E5535f12c3171f2b964C91:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      address:
-        "0x4200000000000000000000000000000000000013"
+        "base:0x4200000000000000000000000000000000000013"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013"
+        "base:0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013"
      implementationNames.0x4200000000000000000000000000000000000013:
-        "Proxy"
      implementationNames.0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013:
-        "L1BlockNumber"
      implementationNames.base:0x4200000000000000000000000000000000000013:
+        "Proxy"
      implementationNames.base:0xC0D3C0d3C0D3c0D3C0d3c0D3C0d3c0d3C0d30013:
+        "L1BlockNumber"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      address:
-        "0x4200000000000000000000000000000000000014"
+        "base:0x4200000000000000000000000000000000000014"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014"
+        "base:0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014"
      values.messenger:
-        "0x4200000000000000000000000000000000000007"
+        "base:0x4200000000000000000000000000000000000007"
      values.MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "base:0x4200000000000000000000000000000000000007"
      values.OTHER_BRIDGE:
-        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
+        "base:0x608d94945A64503E642E6370Ec598e519a2C1E53"
      values.otherBridge:
-        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
+        "base:0x608d94945A64503E642E6370Ec598e519a2C1E53"
      implementationNames.0x4200000000000000000000000000000000000014:
-        "Proxy"
      implementationNames.0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014:
-        "L2ERC721Bridge"
      implementationNames.base:0x4200000000000000000000000000000000000014:
+        "Proxy"
      implementationNames.base:0xC0D3c0d3c0d3c0d3c0D3C0d3C0D3C0D3c0d30014:
+        "L2ERC721Bridge"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      address:
-        "0x4200000000000000000000000000000000000015"
+        "base:0x4200000000000000000000000000000000000015"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "base:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.$pastUpgrades.0.2.0:
-        "0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"
+        "base:0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"
      values.$pastUpgrades.1.2.0:
-        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
+        "base:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.DEPOSITOR_ACCOUNT:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "base:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
      values.gasPayingToken.addr_:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "base:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      implementationNames.0x4200000000000000000000000000000000000015:
-        "Proxy"
      implementationNames.0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
-        "L1Block"
      implementationNames.base:0x4200000000000000000000000000000000000015:
+        "Proxy"
      implementationNames.base:0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
+        "L1Block"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      address:
-        "0x4200000000000000000000000000000000000016"
+        "base:0x4200000000000000000000000000000000000016"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016"
+        "base:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016"
      implementationNames.0x4200000000000000000000000000000000000016:
-        "Proxy"
      implementationNames.0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016:
-        "L2ToL1MessagePasser"
      implementationNames.base:0x4200000000000000000000000000000000000016:
+        "Proxy"
      implementationNames.base:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016:
+        "L2ToL1MessagePasser"
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      address:
-        "0x4200000000000000000000000000000000000017"
+        "base:0x4200000000000000000000000000000000000017"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017"
+        "base:0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017"
      values.BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "base:0x4200000000000000000000000000000000000014"
      implementationNames.0x4200000000000000000000000000000000000017:
-        "Proxy"
      implementationNames.0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017:
-        "OptimismMintableERC721Factory"
      implementationNames.base:0x4200000000000000000000000000000000000017:
+        "Proxy"
      implementationNames.base:0xc0d3C0d3C0d3C0d3C0d3c0d3C0D3C0d3C0D30017:
+        "OptimismMintableERC721Factory"
    }
```

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      address:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
+        "base:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018"
      values.addressManager:
-        "0x0000000000000000000000000000000000000000"
+        "base:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x8cC51c3008b3f03Fe483B28B8Db90e19cF076a6d"
+        "base:0x8cC51c3008b3f03Fe483B28B8Db90e19cF076a6d"
      implementationNames.0x4200000000000000000000000000000000000018:
-        "Proxy"
      implementationNames.0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
-        "ProxyAdmin"
      implementationNames.base:0x4200000000000000000000000000000000000018:
+        "Proxy"
      implementationNames.base:0xC0d3C0D3c0d3C0d3c0d3c0D3C0D3C0d3C0D30018:
+        "ProxyAdmin"
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x4200000000000000000000000000000000000019"
+        "base:0x4200000000000000000000000000000000000019"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x4E207bDF8aece56de86821f5370b2b993D08C9E9"
+        "base:0x4E207bDF8aece56de86821f5370b2b993D08C9E9"
      values.$pastUpgrades.0.2.0:
-        "0xB0B77878bBc76E29aBE7584Bda27ae3CE1A9059a"
+        "base:0xB0B77878bBc76E29aBE7584Bda27ae3CE1A9059a"
      values.$pastUpgrades.1.2.0:
-        "0x4E207bDF8aece56de86821f5370b2b993D08C9E9"
+        "base:0x4E207bDF8aece56de86821f5370b2b993D08C9E9"
      values.RECIPIENT:
-        "0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
+        "base:0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
      implementationNames.0x4200000000000000000000000000000000000019:
-        "Proxy"
      implementationNames.0x4E207bDF8aece56de86821f5370b2b993D08C9E9:
-        "BaseFeeVault"
      implementationNames.base:0x4200000000000000000000000000000000000019:
+        "Proxy"
      implementationNames.base:0x4E207bDF8aece56de86821f5370b2b993D08C9E9:
+        "BaseFeeVault"
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      address:
-        "0x420000000000000000000000000000000000001A"
+        "base:0x420000000000000000000000000000000000001A"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x0c9034b92351cF8f067379a1fFA4fa35f5AF9dCC"
+        "base:0x0c9034b92351cF8f067379a1fFA4fa35f5AF9dCC"
      values.$pastUpgrades.0.2.0:
-        "0xD36F11023188134d0f4610fF0C6e01c1B11488f8"
+        "base:0xD36F11023188134d0f4610fF0C6e01c1B11488f8"
      values.$pastUpgrades.1.2.0:
-        "0x0c9034b92351cF8f067379a1fFA4fa35f5AF9dCC"
+        "base:0x0c9034b92351cF8f067379a1fFA4fa35f5AF9dCC"
      values.RECIPIENT:
-        "0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
+        "base:0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA"
      implementationNames.0x420000000000000000000000000000000000001A:
-        "Proxy"
      implementationNames.0x0c9034b92351cF8f067379a1fFA4fa35f5AF9dCC:
-        "L1FeeVault"
      implementationNames.base:0x420000000000000000000000000000000000001A:
+        "Proxy"
      implementationNames.base:0x0c9034b92351cF8f067379a1fFA4fa35f5AF9dCC:
+        "L1FeeVault"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      address:
-        "0x4200000000000000000000000000000000000020"
+        "base:0x4200000000000000000000000000000000000020"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "base:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      values.$pastUpgrades.0.2.0:
-        "0x75505a97BD334E7BD3C476893285569C4136Fa0F"
+        "base:0x75505a97BD334E7BD3C476893285569C4136Fa0F"
      implementationNames.0x4200000000000000000000000000000000000020:
-        "Proxy"
      implementationNames.0x75505a97BD334E7BD3C476893285569C4136Fa0F:
-        "SchemaRegistry"
      implementationNames.base:0x4200000000000000000000000000000000000020:
+        "Proxy"
      implementationNames.base:0x75505a97BD334E7BD3C476893285569C4136Fa0F:
+        "SchemaRegistry"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      address:
-        "0x4200000000000000000000000000000000000021"
+        "base:0x4200000000000000000000000000000000000021"
      values.$admin:
-        "0x4200000000000000000000000000000000000018"
+        "base:0x4200000000000000000000000000000000000018"
      values.$implementation:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "base:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.$pastUpgrades.0.2.0:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "base:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.getSchemaRegistry:
-        "0x4200000000000000000000000000000000000020"
+        "base:0x4200000000000000000000000000000000000020"
      implementationNames.0x4200000000000000000000000000000000000021:
-        "Proxy"
      implementationNames.0xbEb5Fc579115071764c7423A4f12eDde41f106Ed:
-        "EAS"
      implementationNames.base:0x4200000000000000000000000000000000000021:
+        "Proxy"
      implementationNames.base:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed:
+        "EAS"
    }
```

```diff
    EOA  (0x608d94945A64503E642E6370Ec598e519a2C1E53) {
    +++ description: None
      address:
-        "0x608d94945A64503E642E6370Ec598e519a2C1E53"
+        "base:0x608d94945A64503E642E6370Ec598e519a2C1E53"
    }
```

```diff
    EOA  (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa) {
    +++ description: None
      address:
-        "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
+        "base:0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
    }
```

```diff
    EOA Base Governance Multisig - L2 Alias (0x8cC51c3008b3f03Fe483B28B8Db90e19cF076a6d) {
    +++ description: None
      address:
-        "0x8cC51c3008b3f03Fe483B28B8Db90e19cF076a6d"
+        "base:0x8cC51c3008b3f03Fe483B28B8Db90e19cF076a6d"
    }
```

```diff
    contract GnosisSafeL2 (0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05) {
    +++ description: None
      address:
-        "0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05"
+        "base:0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05"
      values.$implementation:
-        "0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
+        "base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"
      values.$members.0:
-        "0x1084092Ac2f04c866806CF3d4a385Afa4F6A6C97"
+        "base:0x1084092Ac2f04c866806CF3d4a385Afa4F6A6C97"
      values.$members.1:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "base:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
      values.$members.2:
-        "0x3FDf3c4bf8783bB94295b9219DF74a648f397360"
+        "base:0x3FDf3c4bf8783bB94295b9219DF74a648f397360"
      implementationNames.0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05:
-        "GnosisSafeProxy"
      implementationNames.0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
-        "GnosisSafeL2"
      implementationNames.base:0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05:
+        "GnosisSafeProxy"
      implementationNames.base:0xfb1bffC9d739B8D520DaF37dF666da4C687191EA:
+        "GnosisSafeL2"
    }
```

```diff
    EOA  (0xaD5B57FEB77e294fD7BF5EBE9aB01caA0a90B221) {
    +++ description: None
      address:
-        "0xaD5B57FEB77e294fD7BF5EBE9aB01caA0a90B221"
+        "base:0xaD5B57FEB77e294fD7BF5EBE9aB01caA0a90B221"
    }
```

```diff
    EOA  (0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001) {
    +++ description: None
      address:
-        "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
+        "base:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
    }
```

```diff
    EOA  (0xE7dEA1306D9F829bA469d1904c50903b46ebd02e) {
    +++ description: None
      address:
-        "0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
+        "base:0xE7dEA1306D9F829bA469d1904c50903b46ebd02e"
    }
```

```diff
    EOA  (0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
    +++ description: None
      address:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "base:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    }
```

```diff
+   Status: CREATED
    contract FeeDisburser (0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA)
    +++ description: Contract used to disburse funds from system FeeVault contracts, shares revenue with Optimism and bridges the rest of funds to L1.
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
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
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
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

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05)
    +++ description: None
```

Generated with discovered.json: 0xc791677705c423cfe7535507bb866e27fce879c4

# Diff at Mon, 09 Jun 2025 10:53:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 30124700
- current block number: 31338532

## Description

FeeDisburser admin moved to EOA.

## Watched changes

```diff
    contract FeeDisburser (0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA) {
    +++ description: Contract used to disburse funds from system FeeVault contracts, shares revenue with Optimism and bridges the rest of funds to L1.
      values.$admin:
-        "0xd94E416cf2c7167608B2515B7e4102B41efff94f"
+        "0xaD5B57FEB77e294fD7BF5EBE9aB01caA0a90B221"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafeL2 (0xd94E416cf2c7167608B2515B7e4102B41efff94f)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafeL2}/GnosisSafeL2.sol                 |    0
 .../GnosisSafeL2}/GnosisSafeProxy.p.sol            |    0
 .../GnosisSafeL2.sol => /dev/null                  | 1032 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   35 -
 4 files changed, 1067 deletions(-)
```

Generated with discovered.json: 0x19328ddd500cced0eba3e94b8c99a49450604791

# Diff at Fri, 23 May 2025 09:41:14 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 30124700
- current block number: 30124700

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 30124700 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
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
    EOA Base Governance Multisig - L2 Alias (0x8cC51c3008b3f03Fe483B28B8Db90e19cF076a6d) {
    +++ description: None
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

```diff
    contract GnosisSafeL2 (0xd94E416cf2c7167608B2515B7e4102B41efff94f) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x4f1047f67add04421f57aa7e98a4547d3560fe44

# Diff at Mon, 12 May 2025 08:32:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4a373705dbec82410d264d404f2ff330f41666ef block: 29605802
- current block number: 30124700

## Description

Isthmus L2 contract upgrades, mainly focusing on support for the new operator fee (standard contracts).

## Watched changes

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      sourceHashes.1:
-        "0xbdd7533735ef92fffadfbee431b476e72f2f048487c921c5570443e3cba5cb30"
+        "0xb3745d52050d9a2c6bfa6e6e091bdfa43e7c87a22542aa276d323a29431ec108"
      values.$implementation:
-        "0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"
+        "0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"
      values.$pastUpgrades.1:
+        ["2024-03-14T00:00:01.000Z","0x9f2b2d34dfa2cb55cceb9860cade0cb03cfbd7ff1dd07d48b4708b29a46b4a24",["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]]
      values.$pastUpgrades.0.2:
-        "2024-03-14T00:00:01.000Z"
+        "0xe992e00998b34075506d2726a274db07a62af6cdd9d527bfda9128114603cfbd"
      values.$pastUpgrades.0.1:
-        "0x9f2b2d34dfa2cb55cceb9860cade0cb03cfbd7ff1dd07d48b4708b29a46b4a24"
+        ["0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12"]
      values.$pastUpgrades.0.0:
-        ["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]
+        "2025-05-09T16:00:01.000Z"
      values.$upgradeCount:
-        1
+        2
      values.version:
-        "1.2.0"
+        "1.6.0"
      values.gasPayingToken:
+        {"addr_":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","decimals_":18}
      values.gasPayingTokenName:
+        "Ether"
      values.gasPayingTokenSymbol:
+        "ETH"
      values.isCustomGasToken:
+        false
      implementationNames.0x07dbe8500fc591d1852B76feE44d5a05e13097Ff:
-        "L1Block"
      implementationNames.0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12:
+        "L1Block"
    }
```

## Source code changes

```diff
.../{.flat@29605802 => .flat}/L1Block/L1Block.sol  | 151 ++++++++++++++++++++-
 1 file changed, 144 insertions(+), 7 deletions(-)
```

Generated with discovered.json: 0x312ebb30c05ba6bcc9508452a6d414c06c8b828d

# Diff at Tue, 06 May 2025 10:57:04 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@3a394513711f46aa66871603365b6afb40a79057 block: 29605802
- current block number: 29605802

## Description

Marking EOAs if they control the highest number of upgrade permissions in the project.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 29605802 (main branch discovery), not current.

```diff
    EOA Base Governance Multisig - L2 Alias (0x8cC51c3008b3f03Fe483B28B8Db90e19cF076a6d) {
    +++ description: None
      controlsMajorityOfUpgradePermissions:
+        true
    }
```

Generated with discovered.json: 0x2539615004f572c22736795bee4e25573a9b3bd3

# Diff at Wed, 30 Apr 2025 09:40:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 29605802

## Description

Base l2 initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract FeeDisburser (0x09C7bAD99688a55a2e83644BFAed09e62bDcCcBA)
    +++ description: Contract used to disburse funds from system FeeVault contracts, shares revenue with Optimism and bridges the rest of funds to L1.
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
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
    contract ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
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

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0x9c3631dDE5c8316bE5B7554B0CcD2631C15a9A05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafeL2 (0xd94E416cf2c7167608B2515B7e4102B41efff94f)
    +++ description: None
```
