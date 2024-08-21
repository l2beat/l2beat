Generated with discovered.json: 0x4a7e0bffcbc07ae1fd4fea7bceefb7ca61b12c0e

# Diff at Wed, 21 Aug 2024 10:06:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20327427
- current block number: 20327427

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20327427 (main branch discovery), not current.

```diff
    contract DelayedWETH (0x0eCe16401A80551345bB672f177f51A8755FF775) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0x16193e14197c10109F3e81b938153A04A2a00190) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract L1ERC721Bridge (0x28d56C3BBbe4807c19Cc81E6D5207Fb681C3726b) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract L1StandardBridge (0x2AD84AbD52050956AcC9c490D024b821A59e3FB6) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract DisputeGameFactory (0x443164F044D8840479234e00E7aD5bb06b85fC78) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x515A0c8b1d9574C65EA1924eCd767B1d9b6AC32f) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract L2OutputOracle (0x5A0492D20D984eE904E46E6Ff24572bc755abb28) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract SystemConfig (0x6E99cdE188DAAFeEcb6eD8AC28B98dE4c8eE5D6C) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
+        [{"permission":"configure","target":"0xCf06c459AE59d4f47469BcE535afC3485Ce89dBf","via":[]},{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract ProxyAdmin (0x9e48d6bBca781c23392Ec459BfB3657C40a794A8) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions:
-        {"upgrade":["0x0eCe16401A80551345bB672f177f51A8755FF775","0x16193e14197c10109F3e81b938153A04A2a00190","0x28d56C3BBbe4807c19Cc81E6D5207Fb681C3726b","0x2AD84AbD52050956AcC9c490D024b821A59e3FB6","0x443164F044D8840479234e00E7aD5bb06b85fC78","0x515A0c8b1d9574C65EA1924eCd767B1d9b6AC32f","0x5A0492D20D984eE904E46E6Ff24572bc755abb28","0x6E99cdE188DAAFeEcb6eD8AC28B98dE4c8eE5D6C","0xBC2bEDA4ce7A1f40aa458322A33B44081b2F545A","0xcbF423525a5471Fc5037a5397F99f6F09fe41379"],"configure":["0xBdF852e2cc26Ea3C2dee7b493B1Fc12dA406175a"]}
      issuedPermissions:
+        [{"permission":"configure","target":"0xfF75Bd7672b79f2562fAf98D488bbb3Db1cD1574","via":[]}]
      receivedPermissions:
+        [{"permission":"configure","target":"0xBdF852e2cc26Ea3C2dee7b493B1Fc12dA406175a","via":[]},{"permission":"upgrade","target":"0x0eCe16401A80551345bB672f177f51A8755FF775","via":[]},{"permission":"upgrade","target":"0x16193e14197c10109F3e81b938153A04A2a00190","via":[]},{"permission":"upgrade","target":"0x28d56C3BBbe4807c19Cc81E6D5207Fb681C3726b","via":[]},{"permission":"upgrade","target":"0x2AD84AbD52050956AcC9c490D024b821A59e3FB6","via":[]},{"permission":"upgrade","target":"0x443164F044D8840479234e00E7aD5bb06b85fC78","via":[]},{"permission":"upgrade","target":"0x515A0c8b1d9574C65EA1924eCd767B1d9b6AC32f","via":[]},{"permission":"upgrade","target":"0x5A0492D20D984eE904E46E6Ff24572bc755abb28","via":[]},{"permission":"upgrade","target":"0x6E99cdE188DAAFeEcb6eD8AC28B98dE4c8eE5D6C","via":[]},{"permission":"upgrade","target":"0xBC2bEDA4ce7A1f40aa458322A33B44081b2F545A","via":[]},{"permission":"upgrade","target":"0xcbF423525a5471Fc5037a5397F99f6F09fe41379","via":[]}]
    }
```

```diff
    contract OptimismPortal (0xBC2bEDA4ce7A1f40aa458322A33B44081b2F545A) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract AddressManager (0xBdF852e2cc26Ea3C2dee7b493B1Fc12dA406175a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"configure","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract SuperchainConfig (0xcbF423525a5471Fc5037a5397F99f6F09fe41379) {
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

```diff
    contract RollupOwnerMultisig (0xfF75Bd7672b79f2562fAf98D488bbb3Db1cD1574) {
    +++ description: It can act on behalf of 0x9e48d6bBca781c23392Ec459BfB3657C40a794A8, inheriting its permissions.
      assignedPermissions:
-        {"configure":["0x9e48d6bBca781c23392Ec459BfB3657C40a794A8"]}
      receivedPermissions:
+        [{"permission":"configure","target":"0x9e48d6bBca781c23392Ec459BfB3657C40a794A8","via":[]}]
    }
```

Generated with discovered.json: 0x3218d2550f936576f07090522ef35953542c856b

# Diff at Fri, 09 Aug 2024 12:03:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bf40aa32f030fd312056ca0ef198c8550467d1d7 block: 20327427
- current block number: 20327427

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20327427 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x9e48d6bBca781c23392Ec459BfB3657C40a794A8) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.upgrade.9:
-        "0x28d56C3BBbe4807c19Cc81E6D5207Fb681C3726b"
+        "0xcbF423525a5471Fc5037a5397F99f6F09fe41379"
      assignedPermissions.upgrade.8:
-        "0x515A0c8b1d9574C65EA1924eCd767B1d9b6AC32f"
+        "0xBC2bEDA4ce7A1f40aa458322A33B44081b2F545A"
      assignedPermissions.upgrade.5:
-        "0x0eCe16401A80551345bB672f177f51A8755FF775"
+        "0x515A0c8b1d9574C65EA1924eCd767B1d9b6AC32f"
      assignedPermissions.upgrade.4:
-        "0xBC2bEDA4ce7A1f40aa458322A33B44081b2F545A"
+        "0x443164F044D8840479234e00E7aD5bb06b85fC78"
      assignedPermissions.upgrade.3:
-        "0xcbF423525a5471Fc5037a5397F99f6F09fe41379"
+        "0x2AD84AbD52050956AcC9c490D024b821A59e3FB6"
      assignedPermissions.upgrade.2:
-        "0x443164F044D8840479234e00E7aD5bb06b85fC78"
+        "0x28d56C3BBbe4807c19Cc81E6D5207Fb681C3726b"
      assignedPermissions.upgrade.0:
-        "0x2AD84AbD52050956AcC9c490D024b821A59e3FB6"
+        "0x0eCe16401A80551345bB672f177f51A8755FF775"
    }
```

Generated with discovered.json: 0xca8d7289d3c816acaac059031f9de88db9e57f00

# Diff at Fri, 09 Aug 2024 10:13:03 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20327427
- current block number: 20327427

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20327427 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x9e48d6bBca781c23392Ec459BfB3657C40a794A8) {
    +++ description: It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component.
      assignedPermissions.admin:
-        ["0x0eCe16401A80551345bB672f177f51A8755FF775","0x16193e14197c10109F3e81b938153A04A2a00190","0x28d56C3BBbe4807c19Cc81E6D5207Fb681C3726b","0x2AD84AbD52050956AcC9c490D024b821A59e3FB6","0x443164F044D8840479234e00E7aD5bb06b85fC78","0x515A0c8b1d9574C65EA1924eCd767B1d9b6AC32f","0x5A0492D20D984eE904E46E6Ff24572bc755abb28","0x6E99cdE188DAAFeEcb6eD8AC28B98dE4c8eE5D6C","0xBC2bEDA4ce7A1f40aa458322A33B44081b2F545A","0xcbF423525a5471Fc5037a5397F99f6F09fe41379"]
      assignedPermissions.owner:
-        ["0xBdF852e2cc26Ea3C2dee7b493B1Fc12dA406175a"]
      assignedPermissions.upgrade:
+        ["0x2AD84AbD52050956AcC9c490D024b821A59e3FB6","0x16193e14197c10109F3e81b938153A04A2a00190","0x443164F044D8840479234e00E7aD5bb06b85fC78","0xcbF423525a5471Fc5037a5397F99f6F09fe41379","0xBC2bEDA4ce7A1f40aa458322A33B44081b2F545A","0x0eCe16401A80551345bB672f177f51A8755FF775","0x5A0492D20D984eE904E46E6Ff24572bc755abb28","0x6E99cdE188DAAFeEcb6eD8AC28B98dE4c8eE5D6C","0x515A0c8b1d9574C65EA1924eCd767B1d9b6AC32f","0x28d56C3BBbe4807c19Cc81E6D5207Fb681C3726b"]
      assignedPermissions.configure:
+        ["0xBdF852e2cc26Ea3C2dee7b493B1Fc12dA406175a"]
    }
```

```diff
    contract RollupOwnerMultisig (0xfF75Bd7672b79f2562fAf98D488bbb3Db1cD1574) {
    +++ description: It can act on behalf of 0x9e48d6bBca781c23392Ec459BfB3657C40a794A8, inheriting its permissions.
      assignedPermissions.owner:
-        ["0x9e48d6bBca781c23392Ec459BfB3657C40a794A8"]
      assignedPermissions.configure:
+        ["0x9e48d6bBca781c23392Ec459BfB3657C40a794A8"]
      values.$multisigThreshold:
-        "3 of 4 (75%)"
      values.getOwners:
-        ["0xaC79765A73eB9dcBd3c427181E6819902AE25b48","0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2","0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7","0x8B6341E18B2DC644cA94eD85173691873626fc7F"]
      values.getThreshold:
-        3
      values.$members:
+        ["0xaC79765A73eB9dcBd3c427181E6819902AE25b48","0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2","0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7","0x8B6341E18B2DC644cA94eD85173691873626fc7F"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0x55b4a0d47214ba9d3ed6a08b9a4a4f8ae0f5a598

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
