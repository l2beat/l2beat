Generated with discovered.json: 0x7cf027e6e1d79c780e4032052354bca1a07a911b

# Diff at Wed, 08 Jan 2025 09:39:07 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3870091bac574174d64874eed9f76e846e3c3c9e block: 21543602
- current block number: 21543602

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543602 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x54e0eea976975dbaf70c242572171682ad00ba8a

# Diff at Fri, 03 Jan 2025 11:17:26 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 21543602

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract FacetEtherBridgeV6 (0x0000000000000b07ED001607f5263D85bf28Ce4C)
    +++ description: Official Facet implementation of the Ether Bridge.
```

```diff
+   Status: CREATED
    contract AddressManager (0x2D96455AAbb3206f77E7CdC8E4E5c29F76FD33aA)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract FacetSafeModule (0x3235AdE33cF7013f5b5A51089390396e931e6BCF)
    +++ description: Module that allows the Safe to send Facet transactions.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x8649Db4A287413567E8dc0EBe1dd62ee02B71eDD)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x8F75466D69a52EF53C7363F38834bEfC027A2909)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xa1233c2DB638D41893a101B0e9dd44cb681270E8)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract FacetMultisig (0xb2B01DeCb6cd36E7396b78D3744482627F22C525)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0xC1E935F25f9c1198200ec442c6F02f1A2F04534e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FacetSafeProxy (0xC9F2d55C56Ef9fE4262c4d5b48d8032241AF4d25)
    +++ description: Helper of the Safe Module that allows to send Facet transactions.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xD1e4cf142fDf7688A9f7734A5eE74d079696C5A6)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract EthscriptionsSafeModule (0xDB866fD9241cd32851Df760c1Ec536f3199B22cE)
    +++ description: Module that allows the Safe to interact with Ethscriptions.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xe2A3bda6CD571943DD4224d0B8872e221EB5997C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xec3a1bd0B6d435Fe8A6e0de728AE87229176EA59)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract EthscriptionsSafeProxy (0xeEd444Fc821b866b002f30f502C53e88E15d5095)
    +++ description: Helper of the Safe Module that allows to send Ethscriptions transactions.
```
