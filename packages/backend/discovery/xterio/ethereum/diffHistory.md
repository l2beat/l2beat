Generated with discovered.json: 0x18abd96cc78df2cd8dbfd176e02817ad3cdfded5

# Diff at Tue, 30 Jul 2024 11:16:33 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20327427
- current block number: 20327427

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20327427 (main branch discovery), not current.

```diff
    contract SystemConfig (0x6E99cdE188DAAFeEcb6eD8AC28B98dE4c8eE5D6C) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta:
+        {"gasLimit":{"severity":"LOW","description":"Gas limit for blocks on L2."}}
    }
```

Generated with discovered.json: 0x408ac4318abf1e3f3f6ac58f375e47a0e10016cd

# Diff at Thu, 18 Jul 2024 14:50:59 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 20327427

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PreimageOracle (0x089A4754538B74Ff63Bc6AbeaD7A95973aB03572)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x0eCe16401A80551345bB672f177f51A8755FF775)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x15b689D90a62C3F7380054C8867b7e7f17Fa7F4B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0x16193e14197c10109F3e81b938153A04A2a00190)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MIPS (0x253DdBb3549e0CEFaaaA7f71BE502C5b94771dDc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x28d56C3BBbe4807c19Cc81E6D5207Fb681C3726b)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2AD84AbD52050956AcC9c490D024b821A59e3FB6)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0x443164F044D8840479234e00E7aD5bb06b85fC78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x515A0c8b1d9574C65EA1924eCd767B1d9b6AC32f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x56c7D88ee46BfD6cab37508E2e39e985a68007a4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x5A0492D20D984eE904E46E6Ff24572bc755abb28)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x6E99cdE188DAAFeEcb6eD8AC28B98dE4c8eE5D6C)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x702dF90E92A6841c9013faE6D724ddFA8F141d5C)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9e48d6bBca781c23392Ec459BfB3657C40a794A8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xBC2bEDA4ce7A1f40aa458322A33B44081b2F545A)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract AddressManager (0xBdF852e2cc26Ea3C2dee7b493B1Fc12dA406175a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xcbF423525a5471Fc5037a5397F99f6F09fe41379)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupOwnerMultisig (0xfF75Bd7672b79f2562fAf98D488bbb3Db1cD1574)
    +++ description: None
```
