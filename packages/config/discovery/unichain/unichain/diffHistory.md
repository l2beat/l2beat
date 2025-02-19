Generated with discovered.json: 0xd6941be094310bdfb0ebe8280e358f20dcfe8203

# Diff at Wed, 19 Feb 2025 16:07:00 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@db146cf0a2ae2ee66e75c589f22ad2e266fe95a9 block: 8535340
- current block number: 8535340

## Description

ProxyAdmin template match (config related).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 8535340 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: Administration contract for other contract proxies.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
      receivedPermissions:
-        [{"permission":"upgrade","from":"0x4200000000000000000000000000000000000002"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000007"},{"permission":"upgrade","from":"0x420000000000000000000000000000000000000F"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000010"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000011"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000012"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000013"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000014"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000015"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000016"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000017"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000018"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000019"},{"permission":"upgrade","from":"0x420000000000000000000000000000000000001A"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000020"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000021"}]
      template:
+        "opstack/Layer2/L2ProxyAdmin"
      description:
+        "Administration contract for other contract proxies."
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"0x4200000000000000000000000000000000000002"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000007"},{"permission":"upgrade","from":"0x420000000000000000000000000000000000000F"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000010"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000011"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000012"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000013"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000014"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000015"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000016"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000017"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000018"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000019"},{"permission":"upgrade","from":"0x420000000000000000000000000000000000001A"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000020"},{"permission":"upgrade","from":"0x4200000000000000000000000000000000000021"}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      issuedPermissions.0.to:
-        "0x4200000000000000000000000000000000000018"
+        "0x7E6c183F538abb8572F5cd17109C617b994d6944"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018"}
    }
```

Generated with discovered.json: 0xe405f16d8e1237019f35096e90c848f44b0099c1

# Diff at Tue, 11 Feb 2025 14:21:47 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 8535340

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002)
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
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
    contract FeeSplitter (0x4300c0D3c0d3c0d3c0d3c0d3C0D3c0d3c0d30001)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Splitter (0x4300C0D3C0D3C0D3C0d3C0d3c0d3C0d3C0d30002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Splitter (0x4300c0d3c0d3c0D3c0d3C0D3c0d3C0D3C0D30003)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NetFeeSplitter (0x4300c0D3c0D3c0D3c0D3c0D3C0D3c0d3c0D30004)
    +++ description: None
```
