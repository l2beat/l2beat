Generated with discovered.json: 0xae44d827b352bcf149799a5d933847d880b58246

# Diff at Tue, 04 Mar 2025 10:40:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 132493968
- current block number: 132493968

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 132493968 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      sinceBlock:
+        6297293
    }
```

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
      sinceBlock:
+        0
    }
```

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
+        27391910
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
    contract ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
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
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
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

```diff
    contract OPToken (0x4200000000000000000000000000000000000042) {
    +++ description: The OP token contract. The minting policy is controlled by the 0x5C4e7Ba1E219E47948e6e3F55019A647bA501005.
      sinceBlock:
+        6490467
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      sinceBlock:
+        28103702
    }
```

Generated with discovered.json: 0xf654b71fc48982c2205f2d49c17291433b9f7a08

# Diff at Wed, 26 Feb 2025 16:18:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9eb8b2d626938c85a098b11b809352a92a892736 block: 132390328
- current block number: 132493968

## Description

Config related: Add L2 contracts as templates with source.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 132390328 (main branch discovery), not current.

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
      template:
+        "opstack/Layer2/L2ERC721Bridge"
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
    +++ description: None
      name:
-        "L2ProxyAdmin"
+        "ProxyAdmin"
      displayName:
-        "ProxyAdmin"
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
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      template:
+        "opstack/Layer2/L1FeeVault"
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

Generated with discovered.json: 0x2a19130fd8007af6b57f015d92053932cbfb08d3

# Diff at Tue, 04 Feb 2025 12:34:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 130896600
- current block number: 130896600

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 130896600 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xae91963222c9b674621fdfc1d623d287a26da936

# Diff at Mon, 20 Jan 2025 16:53:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@dcd1272b687a01381d2cbcd98213070f430a92aa block: 130664390
- current block number: 130896600

## Description

discodrive!

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 130664390 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"configure","from":"0x5C4e7Ba1E219E47948e6e3F55019A647bA501005","description":"change the OP token owner to a different MintManager and therefore change the inflation policy."}]
    }
```

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade.
      description:
+        "Legacy contract that was originally used to act as a whitelist of addresses allowed to the Optimism network. Fully unused and deprecated since the Bedrock upgrade."
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.
      description:
+        "The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function."
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: Provides the current gas price for L2 transactions.
      description:
+        "Provides the current gas price for L2 transactions."
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.
      description:
+        "The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token."
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: Collects the sequencer fees, which are withdrawable to the FeesCollector on L1.
      description:
+        "Collects the sequencer fees, which are withdrawable to the FeesCollector on L1."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.
      description:
+        "Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens."
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: Simple contract that returns the latest L1 block number.
      description:
+        "Simple contract that returns the latest L1 block number."
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.
      description:
+        "The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token."
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.
      description:
+        "Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain."
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.
      description:
+        "Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface."
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.
      description:
+        "Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens."
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1.
      description:
+        "Collects EIP-1559 base fees, which are withdrawable to the FeesCollector on L1."
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1.
      description:
+        "Collects the L1 portion of the L2 transaction fees, which are withdrawable to the FeesCollector on L1."
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: Contracts to register schemas for the Ethereum Attestation Service (EAS).
      description:
+        "Contracts to register schemas for the Ethereum Attestation Service (EAS)."
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: Contract containing the main logic for the Ethereum Attestation Service (EAS).
      description:
+        "Contract containing the main logic for the Ethereum Attestation Service (EAS)."
    }
```

```diff
    contract OPToken (0x4200000000000000000000000000000000000042) {
    +++ description: The OP token contract. The minting policy is controlled by the 0x5C4e7Ba1E219E47948e6e3F55019A647bA501005.
      description:
+        "The OP token contract. The minting policy is controlled by the 0x5C4e7Ba1E219E47948e6e3F55019A647bA501005."
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: Controls the OP inflation rate, which is currently hardcoded to 2% annually.
      description:
+        "Controls the OP inflation rate, which is currently hardcoded to 2% annually."
      issuedPermissions:
+        [{"permission":"configure","to":"0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26","description":"change the OP token owner to a different MintManager and therefore change the inflation policy.","via":[]}]
    }
```

Generated with discovered.json: 0xb64fb12ad7c0ba866205db300934491b303764ef

# Diff at Mon, 20 Jan 2025 11:10:41 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 130664390
- current block number: 130664390

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 130664390 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      directlyReceivedPermissions.15.target:
-        "0x4200000000000000000000000000000000000021"
      directlyReceivedPermissions.15.from:
+        "0x4200000000000000000000000000000000000021"
      directlyReceivedPermissions.14.target:
-        "0x4200000000000000000000000000000000000020"
      directlyReceivedPermissions.14.from:
+        "0x4200000000000000000000000000000000000020"
      directlyReceivedPermissions.13.target:
-        "0x420000000000000000000000000000000000001A"
      directlyReceivedPermissions.13.from:
+        "0x420000000000000000000000000000000000001A"
      directlyReceivedPermissions.12.target:
-        "0x4200000000000000000000000000000000000019"
      directlyReceivedPermissions.12.from:
+        "0x4200000000000000000000000000000000000019"
      directlyReceivedPermissions.11.target:
-        "0x4200000000000000000000000000000000000018"
      directlyReceivedPermissions.11.from:
+        "0x4200000000000000000000000000000000000018"
      directlyReceivedPermissions.10.target:
-        "0x4200000000000000000000000000000000000017"
      directlyReceivedPermissions.10.from:
+        "0x4200000000000000000000000000000000000017"
      directlyReceivedPermissions.9.target:
-        "0x4200000000000000000000000000000000000016"
      directlyReceivedPermissions.9.from:
+        "0x4200000000000000000000000000000000000016"
      directlyReceivedPermissions.8.target:
-        "0x4200000000000000000000000000000000000015"
      directlyReceivedPermissions.8.from:
+        "0x4200000000000000000000000000000000000015"
      directlyReceivedPermissions.7.target:
-        "0x4200000000000000000000000000000000000014"
      directlyReceivedPermissions.7.from:
+        "0x4200000000000000000000000000000000000014"
      directlyReceivedPermissions.6.target:
-        "0x4200000000000000000000000000000000000013"
      directlyReceivedPermissions.6.from:
+        "0x4200000000000000000000000000000000000013"
      directlyReceivedPermissions.5.target:
-        "0x4200000000000000000000000000000000000012"
      directlyReceivedPermissions.5.from:
+        "0x4200000000000000000000000000000000000012"
      directlyReceivedPermissions.4.target:
-        "0x4200000000000000000000000000000000000011"
      directlyReceivedPermissions.4.from:
+        "0x4200000000000000000000000000000000000011"
      directlyReceivedPermissions.3.target:
-        "0x4200000000000000000000000000000000000010"
      directlyReceivedPermissions.3.from:
+        "0x4200000000000000000000000000000000000010"
      directlyReceivedPermissions.2.target:
-        "0x420000000000000000000000000000000000000F"
      directlyReceivedPermissions.2.from:
+        "0x420000000000000000000000000000000000000F"
      directlyReceivedPermissions.1.target:
-        "0x4200000000000000000000000000000000000007"
      directlyReceivedPermissions.1.from:
+        "0x4200000000000000000000000000000000000007"
      directlyReceivedPermissions.0.target:
-        "0x4200000000000000000000000000000000000002"
      directlyReceivedPermissions.0.from:
+        "0x4200000000000000000000000000000000000002"
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

Generated with discovered.json: 0x739f5bcf6fd7385b048391104c685042326f2e9c

# Diff at Wed, 15 Jan 2025 07:52:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 122593187
- current block number: 130664390

## Description

Config related: displayName.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      displayName:
+        "ProxyAdmin"
    }
```

Generated with discovered.json: 0xebfa1d5ba77fb39d275f5e59944a2143e86b16b6

# Diff at Mon, 21 Oct 2024 11:14:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$pastUpgrades.1.2:
+        ["0xa919894851548179A0750865e7974DA599C0Fac7"]
      values.$pastUpgrades.1.1:
-        ["0xa919894851548179A0750865e7974DA599C0Fac7"]
+        "0x2f63bbe08a66796dde569281a58a53e0b0f64b7aa067297e9c70455fb8e375bc"
      values.$pastUpgrades.0.2:
+        ["0xb528D11cC114E026F138fE568744c6D45ce6Da7A"]
      values.$pastUpgrades.0.1:
-        ["0xb528D11cC114E026F138fE568744c6D45ce6Da7A"]
+        "0xedbfdad1f44ea830b863eac45eca4408398351b30511826012882059625963d2"
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"]
      values.$pastUpgrades.0.1:
-        ["0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"]
+        "0x02985bade8b066202067f455d11aa0996a23c022fcd923e113af5d9997ddb5ce"
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]
      values.$pastUpgrades.0.1:
-        ["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]
+        "0x9f2b2d34dfa2cb55cceb9860cade0cb03cfbd7ff1dd07d48b4708b29a46b4a24"
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"]
      values.$pastUpgrades.0.1:
-        ["0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"]
+        "0xe09a2d85965656572055111f1968491e9bb6b174bfaa5b3e38dbbb82ef94e6fb"
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      values.$pastUpgrades.0.2:
+        ["0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"]
      values.$pastUpgrades.0.1:
-        ["0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"]
+        "0xe09a2d85965656572055111f1968491e9bb6b174bfaa5b3e38dbbb82ef94e6fb"
    }
```

Generated with discovered.json: 0x85e07267569ada99b58fe175959a05fe0bd134c1

# Diff at Mon, 14 Oct 2024 11:00:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0x59fe14e95a8aa7f52213f18bae5c9329cf583a7ba31194698b15eddb97d5e825"]
    }
```

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x40a3a457f0e922425ed48d80603e24e652453f57be197487f62795991cff2c2b"]
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x54d303632c7acb15a0f8c319289166a6c178e02f2c930685ab3cdcbe5b19ca29"]
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x6d0f92051952bf3dcccae9e0ff5cf654e3b386df386bc0609b0c7234a2a108bb"]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xb1264cdbc9eb25c5d5f9542dc05d942009b4443379d97b246c66b11e2319215f"]
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xf13800f6674424ad602d8daac646acfc10794f492253796903ac26b7fdb3eabf"]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x33cbc2e27551e9c304842740517adbe533ed12516557dc9a8b7c63f7d599998b"]
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x0ac40be66f726a1d64904e03831f746ee3fd847922d5e54ba4ad0e509602ccf8"]
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x5e60fa0150197ecbd302b46ad0cc0b6f3f024342d97f052ed2f9a8c2a6ed3846"]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xbdd7533735ef92fffadfbee431b476e72f2f048487c921c5570443e3cba5cb30"]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x362ef15b4c72a78e42b10222a63ec31da455fc051e5fc3e6bade09de4d19bdd9"]
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x8dc81ca02eba8fc262038825d8c633ed5542af30e92e629f65787cf7161c0b69"]
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      template:
-        "opstack/ProxyAdmin"
+        "global/ProxyAdmin"
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x96d2f0fa1bd83ebd61ba6a2351c64c7fda7aa580b11ea67bb6bf4338e5c28512"]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x0c18a8a786c9a78d1ea6a3f71ee3369ae8acc817629b8bf4934b05f8a38a41a2"]
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0xa5448c99f954f5f48195d1e118c0513d52fe9a6357928d1d29f617258ca935ff"]
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x612d21c1676a505153f40dceb55f1251798affb5ed211cfc9c00efa2a51fcbfd"]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      sourceHashes:
+        ["0x0a47b6d41e108156a5ce873322c843aad6040edbe7cf3d7e3473abb4d01e7e44","0x662edc082d445c579bb50a631e8c4137c8d9d9016da29683e3f1ccf24b835092"]
    }
```

```diff
    contract OPToken (0x4200000000000000000000000000000000000042) {
    +++ description: None
      sourceHashes:
+        ["0xbaac8c2c26ae66ca5f26a277a6fc9ad2cac1d8e638fae5ab2589b8fec8262316"]
    }
```

```diff
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005) {
    +++ description: None
      sourceHashes:
+        ["0x132b4ddf43264613a6251435ddd7443efbd8ed51129af51edb5c6ab298471b3d"]
    }
```

Generated with discovered.json: 0xc3527c08f9f1468797be981c8cc9c3858d6d3d87

# Diff at Tue, 01 Oct 2024 11:13:41 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T00:00:01.000Z",["0xb528D11cC114E026F138fE568744c6D45ce6Da7A"]],["2024-07-10T16:00:01.000Z",["0xa919894851548179A0750865e7974DA599C0Fac7"]]]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      values.$pastUpgrades:
+        [["2022-10-04T21:36:13.000Z",["0x5a7749f83b81B301cAb5f48EB8516B986DAef23D"]]]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.$pastUpgrades:
+        [["2024-03-14T00:00:01.000Z",["0x07dbe8500fc591d1852B76feE44d5a05e13097Ff"]]]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.$pastUpgrades:
+        []
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-27T22:05:33.000Z",["0x6232208d66bAc2305b46b4Cb6BCB3857B298DF13"]]]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-07-27T22:05:33.000Z",["0x4E0275Ea5a89e7a3c1B58411379D1a0eDdc5b088"]]]
    }
```

```diff
-   Status: DELETED
    contract OldQuixoticNFTBridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: None
```

Generated with discovered.json: 0xde56736763a79673334ff3f954cd27f22d15ce8c

# Diff at Sun, 08 Sep 2024 17:20:14 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@fd881462cca0d7ef4519f907f3c6cfd5fe1cde8f block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      issuedPermissions.1:
-        {"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}
      issuedPermissions.0.permission:
-        "configure"
+        "upgrade"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
      receivedPermissions:
-        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021"}]
      directlyReceivedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019"},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020"},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021"}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x4200000000000000000000000000000000000018"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
      issuedPermissions.0.via.0:
+        {"address":"0x4200000000000000000000000000000000000018","delay":0}
    }
```

Generated with discovered.json: 0xbe928e4bf99a8230745afc52ef46b7b67ad76946

# Diff at Fri, 30 Aug 2024 08:07:22 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      receivedPermissions.15.via:
-        []
      receivedPermissions.14.via:
-        []
      receivedPermissions.13.via:
-        []
      receivedPermissions.12.via:
-        []
      receivedPermissions.11.via:
-        []
      receivedPermissions.10.via:
-        []
      receivedPermissions.9.via:
-        []
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

Generated with discovered.json: 0xdf61d13f6212a4e33bf5f8853829cc02df1c0ad6

# Diff at Fri, 23 Aug 2024 09:58:04 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$upgradeCount:
+        2
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.$upgradeCount:
+        0
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      values.$upgradeCount:
+        1
    }
```

Generated with discovered.json: 0xd085c9f1c61827b17645b6775951134a35698f7d

# Diff at Wed, 21 Aug 2024 10:08:25 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2StandardBridge (0x4200000000000000000000000000000000000010) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1BlockNumber (0x4200000000000000000000000000000000000013) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x4200000000000000000000000000000000000002","0x4200000000000000000000000000000000000007","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000011","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000018","0x4200000000000000000000000000000000000019","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000021"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000002","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000007","via":[]},{"permission":"upgrade","target":"0x420000000000000000000000000000000000000F","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000010","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000011","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000012","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000013","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000014","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000015","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000016","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000017","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000019","via":[]},{"permission":"upgrade","target":"0x420000000000000000000000000000000000001A","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000020","via":[]},{"permission":"upgrade","target":"0x4200000000000000000000000000000000000021","via":[]}]
    }
```

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract SchemaRegistry (0x4200000000000000000000000000000000000020) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

```diff
    contract EAS (0x4200000000000000000000000000000000000021) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x4200000000000000000000000000000000000018","via":[]}]
    }
```

Generated with discovered.json: 0x11c5d304eee079e826c09a6ecd7d7e7a37dc2150

# Diff at Fri, 09 Aug 2024 12:04:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions.upgrade.15:
-        "0x4200000000000000000000000000000000000018"
+        "0x4200000000000000000000000000000000000021"
      assignedPermissions.upgrade.14:
-        "0x4200000000000000000000000000000000000007"
+        "0x4200000000000000000000000000000000000020"
      assignedPermissions.upgrade.13:
-        "0x4200000000000000000000000000000000000016"
+        "0x420000000000000000000000000000000000001A"
      assignedPermissions.upgrade.12:
-        "0x4200000000000000000000000000000000000010"
+        "0x4200000000000000000000000000000000000019"
      assignedPermissions.upgrade.11:
-        "0x4200000000000000000000000000000000000019"
+        "0x4200000000000000000000000000000000000018"
      assignedPermissions.upgrade.10:
-        "0x4200000000000000000000000000000000000020"
+        "0x4200000000000000000000000000000000000017"
      assignedPermissions.upgrade.9:
-        "0x4200000000000000000000000000000000000021"
+        "0x4200000000000000000000000000000000000016"
      assignedPermissions.upgrade.7:
-        "0x4200000000000000000000000000000000000017"
+        "0x4200000000000000000000000000000000000014"
      assignedPermissions.upgrade.6:
-        "0x420000000000000000000000000000000000000F"
+        "0x4200000000000000000000000000000000000013"
      assignedPermissions.upgrade.5:
-        "0x4200000000000000000000000000000000000011"
+        "0x4200000000000000000000000000000000000012"
      assignedPermissions.upgrade.4:
-        "0x4200000000000000000000000000000000000014"
+        "0x4200000000000000000000000000000000000011"
      assignedPermissions.upgrade.3:
-        "0x4200000000000000000000000000000000000012"
+        "0x4200000000000000000000000000000000000010"
      assignedPermissions.upgrade.2:
-        "0x420000000000000000000000000000000000001A"
+        "0x420000000000000000000000000000000000000F"
      assignedPermissions.upgrade.1:
-        "0x4200000000000000000000000000000000000002"
+        "0x4200000000000000000000000000000000000007"
      assignedPermissions.upgrade.0:
-        "0x4200000000000000000000000000000000000013"
+        "0x4200000000000000000000000000000000000002"
    }
```

Generated with discovered.json: 0x521f8577f44a3d19e4a94182cca9f6b70e4e26a0

# Diff at Fri, 09 Aug 2024 10:14:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 122593187
- current block number: 122593187

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 122593187 (main branch discovery), not current.

```diff
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x3041BA32f451F5850c147805F5521AC206421623","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0xdb203D7f00fF435dA107543B33495f9cA2c484C6","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x3041BA32f451F5850c147805F5521AC206421623","0x7cB07FE039a92B3D784f284D919503A381BEC54f","0xdb203D7f00fF435dA107543B33495f9cA2c484C6","0x4D014f3c5F33Aa9Cd1Dc29ce29618d07Ae666d15","0xA902A27a7631D502E3Ec17fc5d4c3e0861752c94"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x4200000000000000000000000000000000000002","0x4200000000000000000000000000000000000007","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000011","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000018","0x4200000000000000000000000000000000000019","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000021"]
      assignedPermissions.upgrade:
+        ["0x4200000000000000000000000000000000000013","0x4200000000000000000000000000000000000002","0x420000000000000000000000000000000000001A","0x4200000000000000000000000000000000000012","0x4200000000000000000000000000000000000014","0x4200000000000000000000000000000000000011","0x420000000000000000000000000000000000000F","0x4200000000000000000000000000000000000017","0x4200000000000000000000000000000000000015","0x4200000000000000000000000000000000000021","0x4200000000000000000000000000000000000020","0x4200000000000000000000000000000000000019","0x4200000000000000000000000000000000000010","0x4200000000000000000000000000000000000016","0x4200000000000000000000000000000000000007","0x4200000000000000000000000000000000000018"]
    }
```

Generated with discovered.json: 0xbb4c91641c0bf25a3e6c9e69893a5e2edc9eb451

# Diff at Fri, 12 Jul 2024 11:52:45 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d6f7bd1c3a10712b93b6891cc6ca39616765a983 block: 121899221
- current block number: 122593187

## Description

The changes are due to the [OP Mainnet 'Fjord' upgrade](https://gov.optimism.io/t/upgrade-proposal-9-fjord-network-upgrade/8236).

The GasPriceOracle predeploy is changed to use a FastLZ-based compression estimator for gas price estimation. (compare [the spec](https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/fjord/exec-engine.md#fees))

## Watched changes

```diff
    contract GasPriceOracle (0x420000000000000000000000000000000000000F) {
    +++ description: None
      values.$implementation:
-        "0xb528D11cC114E026F138fE568744c6D45ce6Da7A"
+        "0xa919894851548179A0750865e7974DA599C0Fac7"
      values.baseFeeScalar:
-        1368
+        5227
      values.version:
-        "1.2.0"
+        "1.3.0"
      values.isFjord:
+        true
    }
```

```diff
    contract L1Block (0x4200000000000000000000000000000000000015) {
    +++ description: None
      values.baseFeeScalar:
-        1368
+        5227
    }
```

## Source code changes

```diff
.../GasPriceOracle/GasPriceOracle.sol              | 558 ++++++++++++++++++---
 1 file changed, 493 insertions(+), 65 deletions(-)
```

Generated with discovered.json: 0x010f9329c5b32c1c688ec638d3dd7adefe490a80

# Diff at Wed, 26 Jun 2024 10:20:31 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 121593875
- current block number: 121899221

## Description

Ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 121593875 (main branch discovery), not current.

```diff
    contract BaseFeeVault (0x4200000000000000000000000000000000000019) {
    +++ description: None
      values.totalProcessed:
-        "1928902844154653024561"
    }
```

```diff
    contract L1FeeVault (0x420000000000000000000000000000000000001A) {
    +++ description: None
      values.totalProcessed:
-        "11679962820116169091101"
    }
```

Generated with discovered.json: 0xc5eed77bd737b6f96961ef8ac1380b3dcfc065b1

# Diff at Tue, 11 Jun 2024 10:11:02 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@6a747b8f93a46c87e2494c6adb06df4640d08444 block: 121202053
- current block number: 121250937

## Description

The ProxyAdmin owner is now the same as L1 (but aliased).

## Watched changes

```diff
-   Status: DELETED
    contract InternalProxyAdminOwnerMultisig1 (0x28B1eE885034ccD2d5Fa228a9A3157390D27177C)
    +++ description: None
```

```diff
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018) {
    +++ description: None
      values.owner:
-        "0x7871d1187A97cbbE40710aC119AA3d412944e4Fe"
+        "0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b"
    }
```

```diff
-   Status: DELETED
    contract L2ProxyAdminOwner (0x7871d1187A97cbbE40710aC119AA3d412944e4Fe)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafeL2.sol => /dev/null                  | 1031 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafeL2.sol => /dev/null                  | 1031 --------------------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 4 files changed, 2130 deletions(-)
```

Generated with discovered.json: 0xf3841b075c5c5f1392147ee9bf27462c6692ba7e

# Diff at Mon, 10 Jun 2024 07:01:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 120992980
- current block number: 121202053

## Description

Ignored.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 120992980 (main branch discovery), not current.

```diff
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011) {
    +++ description: None
      values.totalProcessed:
-        "3495563082937265797169"
    }
```

Generated with discovered.json: 0xa1d57f190fbdfb73f7171e0322ccf7bddd4a21c9

# Diff at Wed, 05 Jun 2024 10:52:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 120992980

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract InternalProxyAdminOwnerMultisig1 (0x28B1eE885034ccD2d5Fa228a9A3157390D27177C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManagerOwner (0x2A82Ae142b2e62Cb7D10b55E323ACB1Cab663a26)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DeployerWhitelist (0x4200000000000000000000000000000000000002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2CrossDomainMessenger (0x4200000000000000000000000000000000000007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GasPriceOracle (0x420000000000000000000000000000000000000F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2StandardBridge (0x4200000000000000000000000000000000000010)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerFeeVault (0x4200000000000000000000000000000000000011)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x4200000000000000000000000000000000000012)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1BlockNumber (0x4200000000000000000000000000000000000013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ERC721Bridge (0x4200000000000000000000000000000000000014)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Block (0x4200000000000000000000000000000000000015)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (0x4200000000000000000000000000000000000016)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC721Factory (0x4200000000000000000000000000000000000017)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdmin (0x4200000000000000000000000000000000000018)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BaseFeeVault (0x4200000000000000000000000000000000000019)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1FeeVault (0x420000000000000000000000000000000000001A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SchemaRegistry (0x4200000000000000000000000000000000000020)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EAS (0x4200000000000000000000000000000000000021)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OPToken (0x4200000000000000000000000000000000000042)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OldQuixoticNFTBridge (0x5a7749f83b81B301cAb5f48EB8516B986DAef23D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MintManager (0x5C4e7Ba1E219E47948e6e3F55019A647bA501005)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2ProxyAdminOwner (0x7871d1187A97cbbE40710aC119AA3d412944e4Fe)
    +++ description: None
```
