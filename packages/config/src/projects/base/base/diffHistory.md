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
